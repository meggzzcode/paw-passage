import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { affiliateLinks } from "@/content/affiliates";
import { allGuides, isPublic } from "@/content/guides";
import { hasApprovedAffiliates } from "@/lib/launch";
import { sitemapEntries, sitemapXml, staticPaths } from "@/lib/sitemap-entries";
import { pageHead, DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { collections } from "@/passport/content";

// The site is the Adventure Passport plus its guides and gear. These tests keep the retired stays directory from creeping back.
describe("sitemap", () => {
  const paths = sitemapEntries().map((e) => e.path);

  it("lists the live pages: Passport pages, every curated collection, guides and the trust pages", () => {
    for (const p of ["/", "/discover", "/collections", "/unlock", "/guides", "/refund-policy"])
      expect(paths, p).toContain(p);
    for (const c of collections) expect(paths, c.slug).toContain(`/collections/${c.slug}`);
    for (const g of allGuides.filter(isPublic))
      expect(paths, g.slug).toContain(`/guides/${g.slug}`);
  });

  it("never lists private, retired or duplicate pages", () => {
    expect(
      paths.some((p) =>
        /^\/(stays|destinations|dogs|dog-rules|data|passport|restore-access)(\/|$)/.test(p),
      ),
    ).toBe(false);
    expect(paths).not.toContain("/list-your-property");
    expect(paths.some((p) => p.startsWith("/collections/mine"))).toBe(false);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("every static path is a route that exists", () => {
    for (const p of staticPaths) {
      if (p === "/") continue;
      const name = p.slice(1).replaceAll("/", ".");
      const file = [`src/routes/${name}.tsx`, `src/routes/${name}.index.tsx`].find((f) =>
        existsSync(f),
      );
      expect(file, p).toBeTruthy();
    }
  });

  it("builds valid XML", () => {
    const xml = sitemapXml("https://example.com", sitemapEntries());
    expect(xml).toContain("<urlset");
    expect(xml).toContain("<loc>https://example.com/discover</loc>");
  });
});

describe("page heads", () => {
  it("noindex can be set on a page", () => {
    expect(
      JSON.stringify(pageHead({ title: "x", description: "y", path: "/z", noindex: true }).meta),
    ).toContain("noindex");
  });
  it("falls back to the stable default share image", () => {
    expect(DEFAULT_SHARE_IMAGE).toBe("/share/default.jpg");
    expect(existsSync(`public${DEFAULT_SHARE_IMAGE}`)).toBe(true);
  });
});

describe("guides", () => {
  it("every public guide has a share image, and no share image is left for a deleted guide", () => {
    const slugs = new Set(allGuides.filter(isPublic).map((g) => g.slug));
    for (const s of slugs) expect(existsSync(`public/share/${s}.jpg`), s).toBe(true);
    const stale = readdirSync("public/share").filter(
      (f) => f !== "default.jpg" && !slugs.has(f.replace(/\.jpg$/, "")),
    );
    expect(stale).toEqual([]);
  });
});

describe("affiliates", () => {
  it("the footer affiliate line shows exactly when an approved affiliate link exists", () => {
    expect(hasApprovedAffiliates()).toBe(affiliateLinks.some((l) => l.approved && !!l.url));
  });
  it("only product links remain: no booking or stay links", () => {
    const yml = readFileSync("content/affiliates.yml", "utf8");
    expect(yml).not.toMatch(/vrbo|airbnb|stay22|kind:\s*stay/i);
  });
});

describe("retired addresses", () => {
  const toml = readFileSync("netlify.toml", "utf8");
  const rules = [...toml.matchAll(/\[\[redirects\]\]([\s\S]*?)(?=\n\[|\n#|$)/g)].map((m) => ({
    from: /from = "([^"]+)"/.exec(m[1]!)?.[1],
    to: /to = "([^"]+)"/.exec(m[1]!)?.[1],
    status: Number(/status = (\d+)/.exec(m[1]!)?.[1]),
  }));
  const gone = new Set(rules.filter((r) => r.status === 410).map((r) => r.from));

  it("answers 410 for the retired sections, tools and guides", () => {
    for (const f of [
      "/stays",
      "/stays/*",
      "/destinations",
      "/destinations/*",
      "/dogs",
      "/dogs/*",
      "/dog-rules",
      "/dog-rules/*",
      "/data/pet-policies",
      "/list-your-property",
      "/tools/checklist",
      "/tools/will-my-dog-be-accepted",
      "/guides/how-vacation-rental-pet-fees-work",
      "/guides/smoky-mountain-cabins-with-dogs",
    ])
      expect(gone, f).toContain(f);
    expect(existsSync("public/gone.html")).toBe(true);
  });

  it("never redirects a retired address to the home page, and never redirects to a missing guide", () => {
    for (const r of rules) {
      expect(r.to, String(r.from)).not.toBe("/");
      const m = /^\/guides\/([a-z0-9-]+)$/.exec(r.to ?? "");
      if (m && r.status !== 410)
        expect(
          allGuides.some((g) => g.slug === m[1]),
          `${r.from} -> ${r.to}`,
        ).toBe(true);
    }
  });

  it("no live guide has a 410 rule", () => {
    for (const g of allGuides) expect(gone, g.slug).not.toContain(`/guides/${g.slug}`);
  });
});
