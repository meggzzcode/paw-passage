// Build step that turns the files in /content (edited by Pages CMS) into data the site can use.
//
//  * Every file is checked against src/content/schema.ts. A mistake fails the build with a message
//    naming the file and field, so a bad edit can never be published by accident.
//  * Unpublished content (drafts, samples, unapproved guides) is LEFT OUT of the production code
//    completely, so it cannot be read from the downloadable JavaScript. It is included while
//    developing locally, or when SHOW_DRAFTS=true (used for private preview builds).
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import type { Plugin, ViteDevServer } from "vite";
import { guideSchema, stayYamlSchema, toStay, affiliatesSchema, settingsSchema } from "../src/content/schema";
import { guideIsPublic, stayIsPublic } from "../src/content/publish-rule";

const VIRTUAL = "virtual:content";
const RESOLVED = "\0" + VIRTUAL;

class ContentError extends Error {}

/** An empty value in a YAML file reads as "null". Treat it as "not filled in" (the same as leaving it out). */
function dropNulls(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(dropNulls);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== null).map(([k, x]) => [k, dropNulls(x)]));
  }
  return v;
}

function formatIssues(file: string, error: { issues: { path: (string | number)[]; message: string }[] }) {
  return `\n\nContent problem in ${file}:\n` + error.issues.map((i) => `  - ${i.path.join(" > ") || "(file)"}: ${i.message}`).join("\n") + "\n";
}

function readYamlFile(file: string): unknown {
  try {
    return dropNulls(parseYaml(readFileSync(file, "utf8")) ?? {});
  } catch (e) {
    throw new ContentError(`\n\nContent problem in ${file}:\n  - the file is not valid YAML: ${(e as Error).message}\n`);
  }
}

function splitFrontmatter(file: string, text: string): { data: unknown; body: string } {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new ContentError(`\n\nContent problem in ${file}:\n  - the file must start with a settings block between two --- lines\n`);
  try {
    return { data: dropNulls(parseYaml(m[1]!) ?? {}), body: m[2]!.replace(/^\n+/, "") };
  } catch (e) {
    throw new ContentError(`\n\nContent problem in ${file}:\n  - the settings block at the top is not valid YAML: ${(e as Error).message}\n`);
  }
}

export function loadContent(root: string, includeUnpublished: boolean) {
  const dir = join(root, "content");
  const slugs = new Set<string>();

  const guides: unknown[] = [];
  const gdir = join(dir, "guides");
  if (existsSync(gdir)) {
    for (const f of readdirSync(gdir).filter((n) => n.endsWith(".md")).sort()) {
      const file = join("content", "guides", f);
      const { data, body } = splitFrontmatter(file, readFileSync(join(gdir, f), "utf8"));
      const parsed = guideSchema.safeParse(data);
      if (!parsed.success) throw new ContentError(formatIssues(file, parsed.error));
      const slug = basename(f, ".md");
      if (!/^[a-z0-9-]+$/.test(slug)) throw new ContentError(`\n\nContent problem in ${file}:\n  - the file name must use only lowercase letters, numbers and hyphens\n`);
      if (slugs.has(`guide:${slug}`)) throw new ContentError(`\n\nTwo guides share the web address "${slug}".\n`);
      slugs.add(`guide:${slug}`);
      const g = parsed.data;
      if (!g.heroImage && !g.heroUpload) throw new ContentError(`\n\nContent problem in ${file}:\n  - pick a built-in hero image or upload one\n`);
      if (g.heroUpload && !existsSync(join(root, "public", g.heroUpload))) throw new ContentError(`\n\nContent problem in ${file}:\n  - heroUpload "${g.heroUpload}" is not in the uploads folder\n`);
      if (g.status === "published" && (!g.approvedBy || !g.approvedOn)) {
        // Not an error: it simply stays a draft until someone approves it. Say so in the build log.
        console.warn(`[content] ${file} is set to Published but has no "approved by / approved on", so it stays a draft.`);
      }
      const guide = { ...g, slug, body };
      if (includeUnpublished || guideIsPublic(guide)) guides.push(guide);
    }
  }

  const stays: unknown[] = [];
  const sdir = join(dir, "stays");
  if (existsSync(sdir)) {
    for (const f of readdirSync(sdir).filter((n) => n.endsWith(".yml") || n.endsWith(".yaml")).sort()) {
      const file = join("content", "stays", f);
      const parsed = stayYamlSchema.safeParse(readYamlFile(join(sdir, f)));
      if (!parsed.success) throw new ContentError(formatIssues(file, parsed.error));
      const slug = basename(f).replace(/\.ya?ml$/, "");
      if (slugs.has(`stay:${slug}`)) throw new ContentError(`\n\nTwo stays share the web address "${slug}".\n`);
      slugs.add(`stay:${slug}`);
      const s = parsed.data;
      if (!s.image && !s.imageUpload) throw new ContentError(`\n\nContent problem in ${file}:\n  - pick a built-in photo or upload one\n`);
      if (s.petFee === "charged" && (s.petFeeAmount === undefined || !s.petFeeBasis)) throw new ContentError(`\n\nContent problem in ${file}:\n  - pet fee is "charged", so enter the amount and what it is charged per\n`);
      if (s.status === "verified" && !s.lastVerified) throw new ContentError(`\n\nContent problem in ${file}:\n  - a verified stay needs a "last verified" date\n`);
      const stay = toStay(slug, s);
      if (includeUnpublished || stayIsPublic(stay)) stays.push(stay);
    }
  }

  const afile = join(dir, "affiliates.yml");
  const aparsed = affiliatesSchema.safeParse(existsSync(afile) ? readYamlFile(afile) : {});
  if (!aparsed.success) throw new ContentError(formatIssues("content/affiliates.yml", aparsed.error));
  const ids = new Set<string>();
  for (const l of aparsed.data.links) {
    if (ids.has(l.id)) throw new ContentError(`\n\nContent problem in content/affiliates.yml:\n  - the link id "${l.id}" is used twice\n`);
    ids.add(l.id);
  }

  const sfile = join(dir, "settings.yml");
  const sparsed = settingsSchema.safeParse(existsSync(sfile) ? readYamlFile(sfile) : {});
  if (!sparsed.success) throw new ContentError(formatIssues("content/settings.yml", sparsed.error));

  return { guides, stays, affiliates: aparsed.data.links, settings: sparsed.data, showDrafts: includeUnpublished };
}

export function contentPlugin(): Plugin {
  let root = process.cwd();
  let isBuild = false;
  const includeUnpublished = () => !isBuild || process.env["SHOW_DRAFTS"] === "true";
  return {
    name: "paws-content",
    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
    },
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    load(id) {
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
        const data = loadContent(root, includeUnpublished());
        return Object.entries(data)
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
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add(join(root, "content"));
      server.watcher.on("add", refresh).on("change", refresh).on("unlink", refresh);
    },
  };
}
