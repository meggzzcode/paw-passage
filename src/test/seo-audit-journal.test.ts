// Pre-launch SEO audit guards for the ten Adventure Journal articles, the six folded landing-page redirects and the sitemap.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { ctxPresets } from "@/passport/journal-context";

const root = resolve(__dirname, "../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

type Article = {
  slug: string;
  fm: {
    related: string[];
    collection: string;
    ctaContext: string;
    image: string;
    imageAlt: string;
    title: string;
    primaryQuery: string;
  };
  body: string;
};

const articles: Article[] = readdirSync(resolve(root, "content/journal"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const m = read(`content/journal/${f}`).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!;
    return { slug: f.replace(/\.md$/, ""), fm: YAML.parse(m[1] ?? ""), body: m[2] ?? "" };
  });
const slugs = new Set(articles.map((a) => a.slug));
const collectionSlugs = new Set(
  [...read("content/collections.yml").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
);
// A path is a real route when a file route (or a static page) exists for it.
const routeFiles = readdirSync(resolve(root, "src/routes")).map((f) => f.replace(/\.tsx?$/, ""));
const staticRoutes = new Set(["/journal", "/collections", "/discover", "/unlock", "/previews"]);
const hubRoutes = new Set(["/things-to-do-with-your-dog"]);

function resolves(href: string): boolean {
  const url = new URL(href, "https://example.test");
  const p = url.pathname;
  if (url.search.includes("utm_")) return false;
  if (p === "/discover") {
    const ctx = url.searchParams.get("ctx");
    return ctx === null || ctx in ctxPresets;
  }
  if (staticRoutes.has(p) || hubRoutes.has(p))
    return routeFiles.includes(p.slice(1) || "index") || routeFiles.includes(`${p.slice(1)}.index`);
  if (p.startsWith("/journal/"))
    return slugs.has(p.slice(9)) && routeFiles.includes("journal.$slug");
  if (p.startsWith("/collections/"))
    return collectionSlugs.has(p.slice(13)) && routeFiles.includes("collections.$slug");
  return false;
}

describe("journal link validator", () => {
  it("has the ten articles", () => expect(articles).toHaveLength(10));

  it("every internal link in every article body resolves to a real route or file", () => {
    for (const a of articles) {
      for (const m of a.body.matchAll(/\]\(([^)\s]+)\)/g)) {
        const href = m[1]!;
        if (/^https?:\/\//.test(href)) continue;
        expect(href.startsWith("/"), `${a.slug}: non-absolute link ${href}`).toBe(true);
        expect(resolves(href), `${a.slug}: broken internal link ${href}`).toBe(true);
      }
    }
  });

  it("every article's CTA context, collection, related slugs and hero image resolve", () => {
    for (const a of articles) {
      expect(resolves(`/discover?ctx=${a.fm.ctaContext}`), `${a.slug} ctx`).toBe(true);
      expect(collectionSlugs.has(a.fm.collection), `${a.slug} collection`).toBe(true);
      for (const r of a.fm.related)
        expect(slugs.has(r) && r !== a.slug, `${a.slug} related ${r}`).toBe(true);
      const img = String(a.fm.image);
      expect(existsSync(resolve(root, "public", img.slice(1))), `${a.slug} image ${img}`).toBe(
        true,
      );
      expect(String(a.fm.imageAlt).length).toBeGreaterThanOrEqual(10);
    }
  });

  it("each article uses a distinct context key, collection and hero image", () => {
    for (const key of ["ctaContext", "collection", "image", "title", "primaryQuery"] as const) {
      const vals = articles.map((a) => String(a.fm[key]));
      expect(new Set(vals).size, key).toBe(vals.length);
    }
  });

  it("no article is an orphan: each is linked from another article (related or body)", () => {
    for (const a of articles) {
      const inbound = articles.some(
        (o) =>
          o.slug !== a.slug &&
          (o.fm.related.includes(a.slug) || o.body.includes(`](/journal/${a.slug})`)),
      );
      expect(inbound, `${a.slug} has no inbound article link`).toBe(true);
    }
  });

  it("hero images stay small", () => {
    for (const a of articles) {
      const size = statSync(resolve(root, "public", String(a.fm.image).slice(1))).size;
      expect(size, a.slug).toBeLessThanOrEqual(60 * 1024);
    }
  });

  it("states the offer accurately and never invents a refund period", () => {
    for (const a of articles) {
      expect(a.body, a.slug).toContain("$19.99");
      expect(a.body, a.slug).not.toMatch(/\b\d+[- ]day (money[- ]back|refund)/i);
      expect(a.body, a.slug).not.toMatch(
        /lifetime updates|unlimited updates|forever updates|new adventures every/i,
      );
      expect(a.body, a.slug).not.toMatch(/limited[- ]time|only \d+ left|% off/i);
    }
  });
});

describe("folded landing pages and the sitemap", () => {
  const toml = read("netlify.toml");
  const removed: Record<string, string> = {
    "/doggy-date-ideas": "doggy-date-ideas",
    "/puppy-bucket-list": "puppy-bucket-list",
    "/senior-dog-adventures": "fun-things-to-do-with-your-senior-dog",
    "/free-things-to-do-with-your-dog": "free-things-to-do-with-your-dog",
    "/weekend-adventure-finder": "things-to-do-with-your-dog-this-weekend",
    "/indoor-dog-adventures": "things-to-do-with-your-dog-at-home",
  };

  it("netlify.toml 301s each removed landing page to its existing Journal article", () => {
    for (const [from, slug] of Object.entries(removed)) {
      const rule = new RegExp(
        `\\[\\[redirects\\]\\]\\s+from = "${from}"\\s+to = "/journal/${slug}"\\s+status = 301\\s+force = true`,
      );
      expect(rule.test(toml), `redirect ${from}`).toBe(true);
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("the removed routes have no route file and are absent from the sitemap", () => {
    const paths = sitemapEntries().map((e) => e.path);
    for (const from of Object.keys(removed)) {
      expect(routeFiles.includes(from.slice(1)), `${from} route file`).toBe(false);
      expect(paths).not.toContain(from);
    }
  });

  it("the sitemap lists the hub, the Journal index and all ten articles once, with no duplicates", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toContain("/things-to-do-with-your-dog");
    expect(paths).toContain("/journal");
    for (const s of slugs) expect(paths).toContain(`/journal/${s}`);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("the sitemap never lists a retired (410) path or a private page", () => {
    const gone = [...toml.matchAll(/from = "([^"]+)"\s+to = "\/gone\.html"/g)].map((m) => m[1]!);
    const paths = sitemapEntries().map((e) => e.path);
    for (const g of gone) {
      const prefix = g.replace(/\/\*$/, "");
      expect(
        paths.some((p) => p === prefix || (g.endsWith("/*") && p.startsWith(`${prefix}/`))),
        `sitemap lists retired ${g}`,
      ).toBe(false);
    }
    for (const priv of ["/passport", "/restore-access", "/welcome", "/install"])
      expect(paths).not.toContain(priv);
  });
});
