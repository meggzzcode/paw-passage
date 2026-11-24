// Build step that turns the files in /content (edited by Pages CMS) into data the site can use.
//
//  * Every file is checked against src/content/schema.ts. A mistake fails the build with a message
//    naming the file and field, so a bad edit can never be published by accident.
//  * Unpublished content (drafts, samples, unapproved guides) is LEFT OUT of the production code
//    completely, so it cannot be read from the downloadable JavaScript. It is included while
//    developing locally, or when SHOW_DRAFTS=true (used for private preview builds).
import {
  readdirSync,
  readFileSync,
  existsSync,
  statSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, basename, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import { transformWithOxc, type Plugin, type ViteDevServer } from "vite";
import {
  guideSchema,
  stayYamlSchema,
  toStay,
  placeYamlSchema,
  toPlace,
  affiliatesSchema,
  settingsSchema,
  relatedProductProblems,
} from "../src/content/schema";
import { guideIsPublic, stayIsPublic, placeIsPublic } from "../src/content/publish-rule";
import { destinations } from "../src/content/destinations";
import { readingMinutes } from "../src/lib/reading-time";
import {
  productsSchema,
  productReferenceProblems,
  gearCategorySlugs,
} from "../src/content/products-schema";
import { packingSchema, packingProblems, emptyPackingConfig } from "../src/lib/packing/schema";

const VIRTUAL = "virtual:content";
const RESOLVED = "\0" + VIRTUAL;

/** Guides that were merged into another and now 301 (see netlify.toml and src/routes/guides.<slug>.tsx). */
const retiredGuideSlugs = new Set(["vacation-rentals-with-no-dog-weight-limit"]);
// Guides are split so list pages do not download every article:
//  * virtual:guides-meta     a small list of every guide WITHOUT its text (cards, lists, links, sitemap)
//  * virtual:guide-loaders   one lazy loader per Markdown guide
//  * virtual:guide/<slug>    the full guide (loaded only by that guide's page)
const META = "virtual:guides-meta";
const LOADERS = "virtual:guide-loaders";
const ONE = "virtual:guide/";

class ContentError extends Error {}

/** An empty value in a YAML file reads as "null". Treat it as "not filled in" (the same as leaving it out). */
function dropNulls(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(dropNulls);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .filter(([, x]) => x !== null)
        .map(([k, x]) => [k, dropNulls(x)]),
    );
  }
  return v;
}

function formatIssues(
  file: string,
  error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] },
) {
  return (
    `\n\nContent problem in ${file}:\n` +
    error.issues
      .map((i) => `  - ${i.path.map(String).join(" > ") || "(file)"}: ${i.message}`)
      .join("\n") +
    "\n"
  );
}

/** During a build, leave an unfinished item out rather than letting its photo hold up everything else. */
function skipDraftPhotoProblem(
  file: string,
  message: string,
  isDraft: boolean,
  skipBrokenDrafts: boolean,
) {
  if (!isDraft || !skipBrokenDrafts) return false;
  console.warn(`[content] ${file} is not finished yet, so it is left out for now.${message}`);
  return true;
}

function readYamlFile(file: string): unknown {
  try {
    return dropNulls(parseYaml(readFileSync(file, "utf8")) ?? {});
  } catch (e) {
    throw new ContentError(
      `\n\nContent problem in ${file}:\n  - the file is not valid YAML: ${(e as Error).message}\n`,
    );
  }
}

function splitFrontmatter(file: string, text: string): { data: unknown; body: string } {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m)
    throw new ContentError(
      `\n\nContent problem in ${file}:\n  - the file must start with a settings block between two --- lines\n`,
    );
  try {
    return { data: dropNulls(parseYaml(m[1]!) ?? {}), body: m[2]!.replace(/^\n+/, "") };
  } catch (e) {
    throw new ContentError(
      `\n\nContent problem in ${file}:\n  - the settings block at the top is not valid YAML: ${(e as Error).message}\n`,
    );
  }
}

/** Web addresses already used by guides written as code files. */
function codeGuideSlugs(root: string): Set<string> {
  const d = join(root, "src", "content", "guides");
  return new Set(
    existsSync(d)
      ? readdirSync(d)
          .filter((n) => n.endsWith(".ts") && n !== "index.ts")
          .map((n) => basename(n, ".ts"))
      : [],
  );
}
/** Web addresses already used by stays written as code files. */
function codeStaySlugs(root: string): Set<string> {
  const out = new Set<string>();
  for (const f of ["samples.ts", "verified.ts"]) {
    const p = join(root, "src", "content", "stays", f);
    if (existsSync(p))
      for (const m of readFileSync(p, "utf8").matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)) out.add(m[1]!);
  }
  return out;
}
/** Names of the built-in photos (the keys of `images` in src/lib/images.ts). */
function builtInImageKeys(root: string): Set<string> {
  const p = join(root, "src", "lib", "images.ts");
  const text = existsSync(p) ? readFileSync(p, "utf8") : "";
  const start = text.indexOf("export const images");
  const body = start >= 0 ? text.slice(start) : "";
  return new Set([...body.matchAll(/^\s{2}"?([a-z0-9-]+)"?:\s*\{/gm)].map((m) => m[1]!));
}

export function loadContent(
  root: string,
  includeUnpublished: boolean,
  opts: { skipBrokenDrafts?: boolean } = {},
) {
  const skipBrokenDrafts = opts.skipBrokenDrafts ?? true;
  const dir = join(root, "content");
  const slugs = new Set<string>();
  const imageKeys = builtInImageKeys(root);
  const codeGuides = codeGuideSlugs(root);
  const codeStays = codeStaySlugs(root);
  const contentGuideSlugs = new Set<string>();
  // Names of all affiliate links in content/affiliates.yml (approved or not). Articles and stays may only refer to these.
  const affiliateIds = new Set<string>();
  {
    const early = affiliatesSchema.safeParse(
      existsSync(join(dir, "affiliates.yml")) ? readYamlFile(join(dir, "affiliates.yml")) : {},
    );
    if (early.success) for (const l of early.data.links) affiliateIds.add(l.id);
  }

  const guides: unknown[] = [];
  const gdir = join(dir, "guides");
  if (existsSync(gdir)) {
    for (const f of readdirSync(gdir)
      .filter((n) => n.endsWith(".md"))
      .sort()) {
      const file = join("content", "guides", f);
      const { data, body } = splitFrontmatter(file, readFileSync(join(gdir, f), "utf8"));
      const parsed = guideSchema.safeParse(data);
      const isDraft = (data as { status?: string })?.status !== "published";
      if (!parsed.success) {
        // A half-written DRAFT must never stop other changes from being published: leave it out and say so.
        if (isDraft && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is a draft that is not finished yet, so it is left out for now.${formatIssues(file, parsed.error)}`,
          );
          continue;
        }
        throw new ContentError(formatIssues(file, parsed.error));
      }
      const slug = basename(f, ".md");
      if (codeGuides.has(slug))
        throw new ContentError(
          `\n\nContent problem in ${file}:\n  - an article with the web address "${slug}" already exists. Open that article instead of creating a new one, or choose a different file name.\n`,
        );
      contentGuideSlugs.add(slug);
      if (!/^[a-z0-9-]+$/.test(slug)) {
        const msg = `\n\nContent problem in ${file}:\n  - the file name must use only lowercase letters, numbers and hyphens (rename the file, for example to "${slug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}.md")\n`;
        if (isDraft && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is a draft whose file name is not valid yet, so it is left out for now.${msg}`,
          );
          continue;
        }
        throw new ContentError(msg);
      }
      if (slugs.has(`guide:${slug}`))
        throw new ContentError(`\n\nTwo guides share the web address "${slug}".\n`);
      slugs.add(`guide:${slug}`);
      const g = parsed.data;
      const unknownAff = [...body.matchAll(/\]\(aff:([a-z0-9-]+)\)/g)]
        .map((m) => m[1]!)
        .filter((id) => !affiliateIds.has(id));
      if (unknownAff.length) {
        const msg = `\n\nContent problem in ${file}:\n  - the article uses affiliate link "${[...new Set(unknownAff)].join('", "')}" but there is no link with that name in Affiliate links. Add it there (leave it unapproved until you are approved), or remove it from the text.\n`;
        if (isDraft && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is a draft that refers to an affiliate link that does not exist yet, so it is left out for now.${msg}`,
          );
          continue;
        }
        throw new ContentError(msg);
      }
      if (!g.heroImage && !g.heroUpload) {
        const msg = `\n\nContent problem in ${file}:\n  - pick a built-in hero image or upload one\n`;
        if (skipDraftPhotoProblem(file, msg, isDraft, skipBrokenDrafts)) continue;
        throw new ContentError(msg);
      }
      if (!g.heroUpload && g.heroImage && imageKeys.size > 0 && !imageKeys.has(g.heroImage)) {
        const msg = `\n\nContent problem in ${file}:\n  - the built-in photo "${g.heroImage}" does not exist. Pick one from the list or upload your own.\n`;
        if (skipDraftPhotoProblem(file, msg, isDraft, skipBrokenDrafts)) continue;
        throw new ContentError(msg);
      }
      if (g.heroUpload && !existsSync(join(root, "public", g.heroUpload))) {
        const msg = `\n\nContent problem in ${file}:\n  - heroUpload "${g.heroUpload}" is not in the uploads folder\n`;
        if (skipDraftPhotoProblem(file, msg, isDraft, skipBrokenDrafts)) continue;
        throw new ContentError(msg);
      }
      if (g.status === "published" && (!g.approvedBy || !g.approvedOn)) {
        // Not an error: it simply stays a draft until someone approves it. Say so in the build log.
        console.warn(
          `[content] ${file} is set to Published but has no "approved by / approved on", so it stays a draft.`,
        );
      }
      const guide = { ...g, slug, body };
      if (includeUnpublished || guideIsPublic(guide)) guides.push(guide);
    }
  }

  for (const g of guides as { slug: string; relatedGuides: string[] }[]) {
    for (const r of g.relatedGuides) {
      // Retired guides keep a 301 to their replacement, so a leftover related-guide entry is harmless (the page skips it).
      if (retiredGuideSlugs.has(r)) continue;
      if (!contentGuideSlugs.has(r) && !codeGuides.has(r))
        throw new ContentError(
          `\n\nContent problem in content/guides/${g.slug}.md:\n  - related article "${r}" does not exist\n`,
        );
    }
  }

  const stays: unknown[] = [];
  const sdir = join(dir, "stays");
  if (existsSync(sdir)) {
    for (const f of readdirSync(sdir)
      .filter((n) => n.endsWith(".yml") || n.endsWith(".yaml"))
      .sort()) {
      const file = join("content", "stays", f);
      const raw = readYamlFile(join(sdir, f));
      const parsed = stayYamlSchema.safeParse(raw);
      const notLive = (raw as { status?: string })?.status !== "verified";
      if (!parsed.success) {
        if (notLive && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is not finished yet, so it is left out for now.${formatIssues(file, parsed.error)}`,
          );
          continue;
        }
        throw new ContentError(formatIssues(file, parsed.error));
      }
      const slug = basename(f).replace(/\.ya?ml$/, "");
      if (!/^[a-z0-9-]+$/.test(slug)) {
        const msg = `\n\nContent problem in ${file}:\n  - the file name must use only lowercase letters, numbers and hyphens (rename the file, for example to "${slug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}.yml")\n`;
        if (notLive && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is not live and its file name is not valid yet, so it is left out for now.${msg}`,
          );
          continue;
        }
        throw new ContentError(msg);
      }
      if (codeStays.has(slug))
        throw new ContentError(
          `\n\nContent problem in ${file}:\n  - a stay with the web address "${slug}" already exists\n`,
        );
      if (slugs.has(`stay:${slug}`))
        throw new ContentError(`\n\nTwo stays share the web address "${slug}".\n`);
      slugs.add(`stay:${slug}`);
      const s = parsed.data;
      // A stay needs no photo: without one the pages show a clear "photos are on the booking page" panel instead of a stock picture.
      if (s.affiliateId && !affiliateIds.has(s.affiliateId)) {
        const msg = `\n\nContent problem in ${file}:\n  - the booking link "${s.affiliateId}" does not exist in Affiliate links\n`;
        if (notLive && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is not live and refers to a booking link that does not exist yet, so it is left out for now.${msg}`,
          );
          continue;
        }
        throw new ContentError(msg);
      }
      if (!s.imageUpload && s.image && imageKeys.size > 0 && !imageKeys.has(s.image)) {
        const msg = `\n\nContent problem in ${file}:\n  - the built-in photo "${s.image}" does not exist\n`;
        if (skipDraftPhotoProblem(file, msg, notLive, skipBrokenDrafts)) continue;
        throw new ContentError(msg);
      }
      if (s.imageUpload && !existsSync(join(root, "public", s.imageUpload))) {
        const msg = `\n\nContent problem in ${file}:\n  - imageUpload "${s.imageUpload}" is not in the uploads folder\n`;
        if (skipDraftPhotoProblem(file, msg, notLive, skipBrokenDrafts)) continue;
        throw new ContentError(msg);
      }
      if (s.petFee === "charged" && (!s.petFeeAmount || !s.petFeeBasis))
        throw new ContentError(
          `\n\nContent problem in ${file}:\n  - pet fee is "charged", so enter an amount above zero and what it is charged per\n`,
        );
      if (s.status === "verified" && !s.lastVerified)
        throw new ContentError(
          `\n\nContent problem in ${file}:\n  - a verified stay needs a "last verified" date\n`,
        );
      const stay = toStay(slug, s);
      if (includeUnpublished || stayIsPublic(stay)) stays.push(stay);
    }
  }

  // Dog rules for places. Only places that are verified AND carry the official source, the exact quote and a
  // check date are public; everything else is left out of the production code (same as unpublished stays).
  const places: unknown[] = [];
  const pdir = join(dir, "places");
  if (existsSync(pdir)) {
    const townSlugs = new Set(destinations.flatMap((d) => d.towns.map((t) => t.slug)));
    for (const f of readdirSync(pdir)
      .filter((n) => n.endsWith(".yml") || n.endsWith(".yaml"))
      .sort()) {
      const file = join("content", "places", f);
      const raw = readYamlFile(join(pdir, f));
      const parsed = placeYamlSchema.safeParse(raw);
      const notLive = (raw as { status?: string })?.status !== "verified";
      if (!parsed.success) {
        if (notLive && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is not finished yet, so it is left out for now.${formatIssues(file, parsed.error)}`,
          );
          continue;
        }
        throw new ContentError(formatIssues(file, parsed.error));
      }
      const slug = basename(f).replace(/\.ya?ml$/, "");
      if (!/^[a-z0-9-]+$/.test(slug)) {
        const msg = `\n\nContent problem in ${file}:\n  - the file name must use only lowercase letters, numbers and hyphens (rename the file, for example to "${slug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}.yml")\n`;
        if (notLive && skipBrokenDrafts) {
          console.warn(
            `[content] ${file} is not live and its file name is not valid yet, so it is left out for now.${msg}`,
          );
          continue;
        }
        throw new ContentError(msg);
      }
      if (slugs.has(`place:${slug}`))
        throw new ContentError(`\n\nTwo places share the web address "${slug}".\n`);
      slugs.add(`place:${slug}`);
      const p = parsed.data;
      if (p.nearTown && !townSlugs.has(p.nearTown))
        throw new ContentError(
          `\n\nContent problem in ${file}:\n  - "nearTown" must be the web-address name of one of our towns (${[...townSlugs].join(", ")}) or left empty\n`,
        );
      if (p.claimFrom && !contentGuideSlugs.has(p.claimFrom) && !codeGuides.has(p.claimFrom))
        throw new ContentError(
          `\n\nContent problem in ${file}:\n  - "claimFrom" names an article that does not exist: "${p.claimFrom}"\n`,
        );
      const place = toPlace(slug, p);
      if (place.status === "verified" && !placeIsPublic(place)) {
        // Not an error: it simply stays unpublished until the source, the exact quote and the check date are all filled in.
        console.warn(
          `[content] ${file} is set to Verified but is missing its official source address, the exact quote or the date checked, so it is not published.`,
        );
      }
      if (includeUnpublished || placeIsPublic(place)) places.push(place);
    }
  }

  const afile = join(dir, "affiliates.yml");
  const aparsed = affiliatesSchema.safeParse(existsSync(afile) ? readYamlFile(afile) : {});
  if (!aparsed.success)
    throw new ContentError(formatIssues("content/affiliates.yml", aparsed.error));
  const ids = new Set<string>();
  for (const l of aparsed.data.links) {
    if (ids.has(l.id))
      throw new ContentError(
        `\n\nContent problem in content/affiliates.yml:\n  - the link id "${l.id}" is used twice\n`,
      );
    ids.add(l.id);
  }

  // Products (gear guides, packing tool, /gear). Every affiliateId must name a link in affiliates.yml, and a stay link can never be a product link.
  const pfile = join(dir, "products.yml");
  const pparsed = productsSchema.safeParse(existsSync(pfile) ? readYamlFile(pfile) : {});
  if (!pparsed.success) throw new ContentError(formatIssues("content/products.yml", pparsed.error));
  const productIds = new Set<string>();
  for (const p of pparsed.data.products) {
    if (productIds.has(p.id))
      throw new ContentError(
        `\n\nContent problem in content/products.yml:\n  - the product id "${p.id}" is used twice\n`,
      );
    productIds.add(p.id);
  }
  const refProblems = productReferenceProblems(pparsed.data.products, aparsed.data.links);
  if (refProblems.length)
    throw new ContentError(
      `\n\nContent problem in content/products.yml:\n${refProblems.map((x) => `  - ${x}`).join("\n")}\n`,
    );

  const rpProblems = relatedProductProblems(
    guides as { slug: string; relatedProducts?: string[]; body?: string }[],
    productIds,
  );
  if (rpProblems.length)
    throw new ContentError(
      `\n\nContent problem in content/guides (relatedProducts):\n${rpProblems.map((x) => `  - ${x}`).join("\n")}\n`,
    );

  // Packing planner (content/packing.yml). Item, category, trip-type and condition references, rules, quantity
  // settings and product recommendations are all checked here, so a bad edit fails the build with the item and field named.
  const kfile = join(dir, "packing.yml");
  if (!existsSync(kfile))
    console.warn(
      "[content] content/packing.yml is missing, so the packing planner has no suggestions.",
    );
  const kparsed = packingSchema.safeParse(
    existsSync(kfile) ? readYamlFile(kfile) : emptyPackingConfig,
  );
  if (!kparsed.success) throw new ContentError(formatIssues("content/packing.yml", kparsed.error));
  const kProblems = packingProblems(
    kparsed.data,
    pparsed.data.products.map((p) => ({ id: p.id, active: p.active })),
    {
      gearCategories: gearCategorySlugs,
      liveGearCategories: gearCategorySlugs.filter(
        (c) =>
          pparsed.data.products.filter((p) => p.active && p.categories.includes(c)).length >= 3,
      ),
    },
  );
  if (kProblems.length)
    throw new ContentError(
      `\n\nContent problem in content/packing.yml:\n${kProblems.map((x) => `  - ${x}`).join("\n")}\n`,
    );

  const sfile = join(dir, "settings.yml");
  const sparsed = settingsSchema.safeParse(existsSync(sfile) ? readYamlFile(sfile) : {});
  if (!sparsed.success) throw new ContentError(formatIssues("content/settings.yml", sparsed.error));

  // Private editorial notes and unapproved links are not needed by the pages, so they are not shipped to visitors.
  const publicGuides = includeUnpublished
    ? guides
    : (guides as { research: { competitors: { checkedOn: string }[] } }[]).map((g) => ({
        ...g,
        research: {
          primaryKeyword: "",
          relatedKeywords: [],
          readerQuestions: [],
          intendedReader: "",
          angle: "",
          gapsFound: [],
          differentiators: [],
          followUps: [],
          unverified: [],
          researchComplete: true,
          competitors: g.research.competitors.map((c) => ({
            url: "",
            title: "",
            checkedOn: c.checkedOn,
            coversWell: "",
            gaps: "",
          })),
        },
      }));
  const links = includeUnpublished
    ? aparsed.data.links
    : aparsed.data.links.filter((l) => l.approved).map(({ notes: _notes, ...l }) => l);
  return {
    guides: publicGuides,
    stays,
    places,
    affiliates: links,
    products: pparsed.data.products,
    packing: kparsed.data,
    settings: sparsed.data,
    showDrafts: includeUnpublished,
  };
}

/** A guide without its text, sources and private research notes. Keeps what lists, cards and the "is it public" rule need. */
export function guideSummary<
  G extends { research: { researchComplete: boolean; unverified: string[] } },
>(g: G) {
  // Cards show the reading time of the full text, so it is worked out here while the text is still present.
  const fullBody = (g as G & { body?: string; readingMinutes?: number }).body ?? "";
  const minutes = readingMinutes(
    fullBody,
    (g as G & { readingMinutes?: number }).readingMinutes ?? 1,
  );
  const {
    body: _b,
    faqs: _f,
    sources: _s,
    research,
    ...rest
  } = g as G & { body: string; faqs: unknown[]; sources: unknown[] };
  return {
    ...rest,
    readingMinutes: minutes,
    body: "",
    faqs: [],
    sources: [],
    research: {
      primaryKeyword: "",
      relatedKeywords: [],
      readerQuestions: [],
      intendedReader: "",
      angle: "",
      gapsFound: [],
      differentiators: [],
      competitors: [],
      unverified: research.unverified,
      researchComplete: research.researchComplete,
    },
  };
}

/** Guides written as code files (src/content/guides/*.ts). Read here (types removed) so their summary can be built without shipping their text. */
async function loadLegacyGuides(root: string): Promise<
  {
    file: string;
    guide: Record<string, unknown> & {
      slug: string;
      research: { researchComplete: boolean; unverified: string[] };
    };
  }[]
> {
  const d = join(root, "src", "content", "guides");
  if (!existsSync(d)) return [];
  const out = [];
  for (const n of readdirSync(d)
    .filter((x) => x.endsWith(".ts") && !x.endsWith(".d.ts") && x !== "index.ts")
    .sort()) {
    const file = join(d, n);
    const js = await transformWithOxc(readFileSync(file, "utf8"), file, { lang: "ts" });
    // The preview plugin runner cannot import data: URLs. A short-lived file works in both
    // development and production builds, and is removed as soon as the article is read.
    const tempDir = mkdtempSync(join(tmpdir(), "paws-guide-"));
    try {
      const tempFile = join(tempDir, "guide.mjs");
      writeFileSync(tempFile, js.code);
      const mod = await import(pathToFileURL(tempFile).href);
      out.push({ file, guide: mod.guide });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
  return out;
}

export function contentPlugin(): Plugin {
  let root = process.cwd();
  let isBuild = false;
  const includeUnpublished = () => {
    if (
      isBuild &&
      process.env["SHOW_DRAFTS"] === "true" &&
      process.env["CONTEXT"] === "production"
    ) {
      throw new ContentError(
        "\n\nSHOW_DRAFTS is switched on for the LIVE site. That would publish unfinished articles. Remove SHOW_DRAFTS from the site-wide environment settings; it belongs only to preview deploys.\n",
      );
    }
    return !isBuild || process.env["SHOW_DRAFTS"] === "true";
  };
  return {
    name: "paws-content",
    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
    },
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED;
      if (id === META || id === LOADERS || id.startsWith(ONE)) return "\0" + id;
      return undefined;
    },
    async load(id) {
      if (id === "\0" + META || id === "\0" + LOADERS || id.startsWith("\0" + ONE)) {
        try {
          const data = loadContent(root, includeUnpublished(), { skipBrokenDrafts: isBuild });
          const content = data.guides as {
            slug: string;
            research: { researchComplete: boolean; unverified: string[] };
          }[];
          if (id === "\0" + LOADERS) {
            return `export const guideLoaders = {\n${content.map((g) => `  ${JSON.stringify(g.slug)}: () => import(${JSON.stringify(ONE + g.slug)}).then((m) => m.guide),`).join("\n")}\n};`;
          }
          if (id.startsWith("\0" + ONE)) {
            const g = content.find((x) => x.slug === id.slice(("\0" + ONE).length));
            return g
              ? `export const guide = ${JSON.stringify(g)};`
              : this.error(`Unknown guide ${id}`);
          }
          const legacy = await loadLegacyGuides(root);
          for (const l of legacy) this.addWatchFile(l.file);
          const lp = relatedProductProblems(
            legacy.map(
              (l) => l.guide as { slug: string; relatedProducts?: string[]; body?: string },
            ),
            data.products.map((p) => p.id),
          );
          if (lp.length)
            throw new ContentError(
              `\n\nContent problem in src/content/guides (relatedProducts):\n${lp.map((x) => `  - ${x}`).join("\n")}\n`,
            );
          for (const f of readdirSync(join(root, "content", "guides")))
            this.addWatchFile(join(root, "content", "guides", f));
          // Development and tests keep the full text in the list (nothing to save there); a production build ships summaries only.
          const all = [...legacy.map((l) => l.guide), ...content];
          return `export const guidesMeta = ${JSON.stringify(isBuild ? all.map(guideSummary) : all)};`;
        } catch (e) {
          if (e instanceof ContentError) this.error(e.message);
          throw e;
        }
      }
      if (id !== RESOLVED) return undefined;
      const dir = resolve(root, "content");
      // Rebuild when any content file changes.
      const walk = (d: string) => {
        if (!existsSync(d)) return;
        for (const n of readdirSync(d)) {
          const p = join(d, n);
          if (statSync(p).isDirectory()) walk(p);
          else this.addWatchFile(p);
        }
      };
      walk(dir);
      try {
        const data = loadContent(root, includeUnpublished(), { skipBrokenDrafts: isBuild });
        return Object.entries(data)
          .filter(([k]) => k !== "guides")
          .map(([k, v]) => `export const ${k} = ${JSON.stringify(v)};`)
          .join("\n");
      } catch (e) {
        if (e instanceof ContentError) this.error(e.message);
        throw e;
      }
    },
    configureServer(server: ViteDevServer) {
      const refresh = (file: string) => {
        if (!file.includes(`${join(root, "content")}`)) return;
        for (const rid of [RESOLVED, "\0" + META, "\0" + LOADERS]) {
          const mod = server.moduleGraph.getModuleById(rid);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add(join(root, "content"));
      server.watcher.on("add", refresh).on("change", refresh).on("unlink", refresh);
    },
  };
}
