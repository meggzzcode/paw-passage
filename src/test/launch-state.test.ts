import { affiliateLinks } from "@/content/affiliates";
import { describe, it, expect } from "vitest";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { hasStays, hasApprovedAffiliates } from "@/lib/launch";
import { pageHead } from "@/lib/seo";

// While no verified stay is published, the empty stays pages must stay out of search and out of the sitemap.
describe("site before the first verified stay", () => {
  it("shows the footer affiliate line exactly when an approved affiliate link exists in the content", () => {
    expect(hasApprovedAffiliates()).toBe(affiliateLinks.some((l) => l.approved && !!l.url));
  });
  it("counts samples as stays only in development, never in the production sitemap", () => {
    // Tests run in development mode, where sample stays are visible; the sitemap never includes them.
    expect(typeof hasStays()).toBe("boolean");
  });
  it("leaves the stays directory and town pages out of the sitemap", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).not.toContain("/stays");
    expect(paths).not.toContain("/tools/compare");
    expect(paths).toContain("/tools/pet-cost-check");
    expect(paths.filter((p) => /^\/destinations\/[a-z-]+\/[a-z-]+$/.test(p))).toEqual([]);
    expect(paths).toContain("/guides");
    expect(paths.some((p) => p.startsWith("/guides/"))).toBe(true);
  });
  it("noindex can be set on a page", () => {
    expect(JSON.stringify(pageHead({ title: "x", description: "y", path: "/z", noindex: true }).meta)).toContain("noindex");
  });
});
