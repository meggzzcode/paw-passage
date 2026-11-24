import { describe, it, expect } from "vitest";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { allGuides, isPublic } from "@/content/guides";

describe("sitemap lastmod rules", () => {
  const entries = sitemapEntries();
  it("guides use lastReviewed as a real date", () => {
    for (const g of allGuides.filter(isPublic)) {
      const e = entries.find((x) => x.path === `/guides/${g.slug}`);
      expect(e?.lastmod).toBe(g.lastReviewed);
      expect(e?.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("only guides, verified places and verified stays carry a lastmod", () => {
    for (const e of entries.filter((x) => x.lastmod))
      expect(/^\/(guides|dog-rules|stays)\//.test(e.path)).toBe(true);
  });
  it("has no duplicate URLs and no query-string (trip view) URLs", () => {
    const paths = entries.map((e) => e.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.some((p) => p.includes("?"))).toBe(false);
  });
});
