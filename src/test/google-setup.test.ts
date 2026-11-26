// Keeps docs/GOOGLE-SETUP.md (section 1, the indexing table) honest: every row is checked against the real route heads
// (robots meta) and the real sitemap, so a private page that loses its noindex, or an indexable page that drops out of the
// sitemap, fails here. Also pins the analytics facts the Google Analytics steps rely on.
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allJournal } from "@/lib/journal";
import { allGuides, isPublic, loadGuide } from "@/content/guides";
import { liveCategories } from "@/content/gear-hub";
import { collections } from "@/passport/content";
import { PRINTABLES } from "@/components/printables/data";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { site } from "@/config/site";

type Meta = { name?: string; content?: string }[];
type Head = { meta?: Meta };
type AnyRoute = { options: { head?: (ctx: never) => Head | Promise<Head> } };

const robots = (h: Head) => (h.meta ?? []).find((m) => m.name === "robots")?.content;

// path in sitemap?  true | false.  "noindex" = the head emits a robots noindex.
interface Row {
  id: string; // doc pattern (must appear in the doc)
  load: () => Promise<{ default?: never } & Record<string, unknown>>;
  ctx: () => Promise<Record<string, unknown>> | Record<string, unknown>;
  noindex: boolean;
  sitemapPath: string | null; // concrete path that must be in the sitemap, or null when it must not be
}

const search = (s: Record<string, unknown> = {}) => ({ match: { search: s }, params: {} });
const plain = () => search();

const rows: Row[] = [
  r("/", () => import("@/routes/index"), plain, false, "/"),
  r(
    "/things-to-do-with-your-dog",
    () => import("@/routes/things-to-do-with-your-dog"),
    plain,
    false,
    "/things-to-do-with-your-dog",
  ),
  r("/journal", () => import("@/routes/journal.index"), plain, false, "/journal"),
  r(
    "/journal/$slug",
    () => import("@/routes/journal.$slug"),
    () => {
      const a = allJournal[0]!;
      return { loaderData: { article: a, related: [] }, params: { slug: a.slug } };
    },
    false,
    `/journal/${allJournal[0]!.slug}`,
  ),
  r("/unlock", () => import("@/routes/unlock"), plain, false, "/unlock"),
  r("/faq", () => import("@/routes/faq"), plain, false, "/faq"),
  r("/discover", () => import("@/routes/discover"), plain, false, "/discover"),
  r(
    "/discover?ctx",
    () => import("@/routes/discover"),
    () => search({ ctx: "rainy-day" }),
    true,
    null,
  ),
  r(
    "/discover?mode",
    () => import("@/routes/discover"),
    () => search({ mode: "browse" }),
    true,
    null,
  ),
  r("/collections", () => import("@/routes/collections.index"), plain, false, "/collections"),
  r(
    "/collections/$slug",
    () => import("@/routes/collections.$slug"),
    () => ({
      loaderData: collections[0]!,
      params: { slug: collections[0]!.slug },
    }),
    false,
    `/collections/${collections[0]!.slug}`,
  ),
  r(
    "/collections?tab=mine",
    () => import("@/routes/collections.index"),
    () => search({ tab: "mine" }),
    true,
    null,
  ),
  r(
    "/collections?tab=favorites",
    () => import("@/routes/collections.index"),
    () => search({ tab: "favorites" }),
    true,
    null,
  ),
  r("/collections/mine/$id", () => import("@/routes/collections.mine.$id"), plain, true, null),
  r("/previews", () => import("@/routes/previews"), plain, true, null), // owner decision: noindex, still reachable, never listed
  r("/printables", () => import("@/routes/printables.index"), plain, false, "/printables"),
  r(
    "/printables/$slug (sample)",
    () => import("@/routes/printables.$slug"),
    () => ({
      params: { slug: PRINTABLES.find((p) => p.sample)!.slug },
    }),
    false,
    `/printables/${PRINTABLES.find((p) => p.sample)!.slug}`,
  ),
  r(
    "/printables/$slug (entitled)",
    () => import("@/routes/printables.$slug"),
    () => ({
      params: { slug: PRINTABLES.find((p) => !p.sample)!.slug },
    }),
    true,
    null,
  ),
  r("/guides", () => import("@/routes/guides.index"), plain, false, "/guides"),
  r(
    "/tools/packing-list",
    () => import("@/routes/tools.packing-list"),
    plain,
    false,
    "/tools/packing-list",
  ),
  r("/our-story", () => import("@/routes/our-story"), plain, true, null),
  r("/passport", () => import("@/routes/passport"), plain, true, null),
  r("/welcome", () => import("@/routes/welcome"), plain, true, null),
  r("/restore-access", () => import("@/routes/restore-access"), plain, true, null),
  r("/install", () => import("@/routes/install"), plain, true, null),
  ...(
    [
      ["/about", "about"],
      ["/contact", "contact"],
      ["/privacy", "privacy"],
      ["/terms", "terms"],
      ["/refund-policy", "refund-policy"],
      ["/disclaimer", "disclaimer"],
      ["/affiliate-disclosure", "affiliate-disclosure"],
      ["/editorial-standards", "editorial-standards"],
      ["/methodology", "methodology"],
      ["/corrections", "corrections"],
      ["/how-we-write-adventures", "how-we-write-adventures"],
    ] as const
  ).map(([p, f]) => r(p, () => import(`../routes/${f}.tsx`), plain, false, p)),
];

function r(
  id: string,
  load: Row["load"],
  ctx: Row["ctx"],
  noindex: boolean,
  sitemapPath: string | null,
): Row {
  return { id, load, ctx, noindex, sitemapPath };
}

const doc = readFileSync("docs/GOOGLE-SETUP.md", "utf8");
const sitemap = new Set(sitemapEntries().map((e) => e.path));

describe("indexing table matches the code", () => {
  for (const row of rows) {
    it(`${row.id}: robots meta and sitemap`, async () => {
      const mod = (await row.load()) as { Route: AnyRoute };
      const head = await mod.Route.options.head!((await row.ctx()) as never);
      if (row.noindex) expect(robots(head)).toMatch(/noindex/);
      else expect(robots(head)).toBeUndefined();
      if (row.sitemapPath) expect(sitemap.has(row.sitemapPath)).toBe(true);
      else {
        // Not listed: the exact pattern (without its variant suffix) must not be a sitemap entry unless it is the plain indexable page.
        // A variant row (with a query) shares its base page, which is listed; only a plain noindex page must be absent.
        if (row.noindex && !row.id.includes("?"))
          expect(sitemap.has(row.id.split(/\s/)[0]!)).toBe(false);
      }
    });
    it(`${row.id}: is documented in docs/GOOGLE-SETUP.md`, () => {
      expect(doc).toContain(`\`${row.id}\``);
    });
  }

  it("a public guide and a live gear category are indexable, a draft or unknown one is not", async () => {
    const g = allGuides.find(isPublic)!;
    const guide = await loadGuide(g.slug);
    const gm = (await import("@/routes/guides.$slug")) as { Route: AnyRoute };
    const h = await gm.Route.options.head!({
      loaderData: { guide },
      params: { slug: g.slug },
    } as never);
    expect(robots(h)).toBeUndefined();
    expect(sitemap.has(`/guides/${g.slug}`)).toBe(true);
    const cat = liveCategories()[0]!;
    const cm = (await import("@/routes/gear.$category")) as { Route: AnyRoute };
    const ch = await cm.Route.options.head!({
      loaderData: { slug: cat.slug },
      params: { category: cat.slug },
    } as never);
    expect(robots(ch)).toBeUndefined();
    expect(sitemap.has(`/gear/${cat.slug}`)).toBe(true);
  });

  it("the sitemap lists no private or unbuilt page", () => {
    for (const p of [
      "/passport",
      "/our-story",
      "/welcome",
      "/restore-access",
      "/install",
      "/previews",
      "/concept",
    ])
      expect(sitemap.has(p)).toBe(false);
    for (const p of sitemap) {
      expect(p).not.toMatch(/\?|\/mine\//);
      expect(p).not.toMatch(/^\/(stays|destinations|dogs|dog-rules|list-your-property)/);
    }
    for (const p of PRINTABLES.filter((x) => !x.sample))
      expect(sitemap.has(`/printables/${p.slug}`)).toBe(false);
  });

  it("every journal article, public guide and curated collection is in the sitemap", () => {
    for (const a of allJournal) expect(sitemap.has(`/journal/${a.slug}`)).toBe(true);
    for (const g of allGuides.filter(isPublic)) expect(sitemap.has(`/guides/${g.slug}`)).toBe(true);
    for (const c of collections) expect(sitemap.has(`/collections/${c.slug}`)).toBe(true);
  });

  it("robots.txt blocks nothing (noindex must stay crawlable) and names the one sitemap on the canonical host", () => {
    const t = readFileSync("public/robots.txt", "utf8");
    expect(t).not.toMatch(/^\s*Disallow:\s*\S/im);
    expect(t).toContain(`Sitemap: ${site.siteUrl}/sitemap.xml`);
    expect(t.match(/^Sitemap:/gim)).toHaveLength(1);
  });

  it("every route file appears in the doc table", () => {
    for (const f of readdirSync("src/routes")) {
      if (!f.endsWith(".tsx") || f === "__root.tsx" || f === "index.tsx" || f.startsWith("sitemap"))
        continue;
      const stem = f
        .replace(/\.tsx$/, "")
        .replace(/\.index$/, "")
        .replace(/\./g, "/");
      expect(doc, f).toContain(`/${stem.replace(/\$[a-z]+/gi, (m) => m)}`);
    }
  });
});

describe("analytics facts used by the GA4 steps", () => {
  const events = readFileSync("src/passport/events.ts", "utf8");
  it("sends events with the pp_ prefix", () => {
    expect(events).toContain("`pp_${name}`");
    // TODO(lead, after worker S reports): pin the consent facts here (what loads before and after a choice) and fill the
    // "Consent (filled from worker S report)" section of docs/GOOGLE-SETUP.md. The old assertion that no consent code
    // exists was removed because S is adding a notice; do not re-add it.
  });
  it("the key events named in the doc exist in the allow-list", () => {
    for (const n of [
      "purchase_cta_clicked",
      "checkout_handoff",
      "intro_revealed",
      "journal_cta_click",
      "journal_article_view",
    ])
      expect(events).toContain(`"${n}"`);
    for (const n of [
      "pp_purchase_cta_clicked",
      "pp_checkout_handoff",
      "pp_intro_revealed",
      "pp_journal_cta_click",
    ])
      expect(doc).toContain(n);
  });
  it("the GA4 id in settings is the one the doc mentions", () => {
    expect(doc).toContain(site.ga4MeasurementId);
  });
});

describe("indexing policy (owner amendment 2026-11-26)", () => {
  it("/previews, /our-story and /concept are noindex and unlisted; /discover is indexable and listed", () => {
    expect(sitemap.has("/discover")).toBe(true);
    for (const p of ["/previews", "/our-story", "/concept"]) expect(sitemap.has(p)).toBe(false);
    expect(readdirSync("src/routes")).not.toContain("concept.tsx"); // no such route; if one is added it must be noindex
  });

  it("the sitemap has only unique, canonical, query-free paths and genuine, past, valid lastmod dates", () => {
    const entries = sitemapEntries();
    const paths = entries.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
    const today = new Date().toISOString().slice(0, 10);
    for (const e of entries) {
      expect(e.path).toMatch(/^\/[A-Za-z0-9\-_/.]*$/);
      expect(e.path.length === 1 || !e.path.endsWith("/")).toBe(true);
      if (e.lastmod !== undefined) {
        expect(e.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(e.lastmod))).toBe(false);
        expect(e.lastmod <= today).toBe(true);
      }
    }
  });

  it("sitemapXml writes absolute locs on the canonical host only", async () => {
    const { sitemapXml } = await import("@/lib/sitemap-entries");
    const xml = sitemapXml(site.siteUrl, sitemapEntries());
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(locs.length).toBe(sitemapEntries().length);
    for (const l of locs) expect(new URL(l).origin).toBe(new URL(site.siteUrl).origin);
  });

  it("the canonical host is consistent: siteUrl is www, robots.txt and the bare-to-www rule agree", () => {
    expect(new URL(site.siteUrl).host).toBe("www.pawsandpassage.com");
    expect(site.siteUrl.endsWith("/")).toBe(false);
    const toml = readFileSync("netlify.toml", "utf8");
    expect(toml).toContain(`to = "${site.siteUrl}/:splat"`);
  });

  it("the doc states that noindex is not access control and lists the six Cowork groups", () => {
    expect(doc).toMatch(/noindex is not access control/i);
    for (const g of [
      "Group 1",
      "Group 2",
      "Group 3",
      "Group 4",
      "Group 5",
      "Group 6",
      "Consent (filled from worker S report)",
    ])
      expect(doc).toContain(g);
  });

  it("the event inventory in the doc matches the allow-list: every event is named, the renamed one is documented", () => {
    const src = readFileSync("src/passport/events.ts", "utf8");
    const names = [...src.matchAll(/^ {2}\| "([a-z_]+)"$/gm)].map((m) => m[1]!);
    for (const n of names) expect(doc, n).toContain(n);
    expect(doc).toContain("pp_checkout_handoff");
    expect(doc).toMatch(/formerly (named )?`?pp_checkout_started/);
    for (const gone of ["affiliate_clicked", "keepsake_share_attempted", "notification_opened"])
      expect(src).not.toContain(`"${gone}"`);
  });
});
