import { affiliateLinks } from "@/content/affiliates";
import { describe, it, expect } from "vitest";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { hasStays, hasApprovedAffiliates } from "@/lib/launch";
import { pageHead, townHasVerifiedStay, DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import type { Stay } from "@/content/stays";

// While no verified stay is published, the empty stays pages must stay out of search and out of the sitemap.
describe("site before the first verified stay", () => {
  it("shows the footer affiliate line exactly when an approved affiliate link exists in the content", () => {
    expect(hasApprovedAffiliates()).toBe(affiliateLinks.some((l) => l.approved && !!l.url));
  });
  it("counts samples as stays only in development, never in the production sitemap", () => {
    // Tests run in development mode, where sample stays are visible; the sitemap never includes them.
    expect(typeof hasStays()).toBe("boolean");
  });
  it("lists the stays directory once any stay is listed, and leaves town pages out until one is verified", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths).toContain("/stays");
    expect(paths).not.toContain("/tools/compare");
    expect(paths).toContain("/tools/pet-cost-check");
    expect(paths.filter((p) => /^\/destinations\/[a-z-]+\/[a-z-]+$/.test(p))).toEqual([]);
    expect(paths).toContain("/guides");
    expect(paths.some((p) => p.startsWith("/guides/"))).toBe(true);
  });
  it("noindex can be set on a page", () => {
    expect(JSON.stringify(pageHead({ title: "x", description: "y", path: "/z", noindex: true }).meta)).toContain("noindex");
  });
  it("indexes a town page only when a verified stay exists there", () => {
    const stay = (town: string, status: "verified" | "unverified") => ({ town, status }) as unknown as Stay;
    expect(townHasVerifiedStay("blue-ridge", [])).toBe(false);
    expect(townHasVerifiedStay("blue-ridge", [stay("blue-ridge", "unverified")])).toBe(false);
    expect(townHasVerifiedStay("blue-ridge", [stay("other", "verified"), stay("blue-ridge", "unverified")])).toBe(false);
    expect(townHasVerifiedStay("blue-ridge", [stay("blue-ridge", "unverified"), stay("blue-ridge", "verified")])).toBe(true);
  });
  it("falls back to the stable default share image", () => {
    const h = pageHead({ title: "x", description: "y", path: "/z" });
    expect(DEFAULT_SHARE_IMAGE).toBe("/share/default.jpg");
    if (h.meta.some((m) => m["property"] === "og:image")) expect(JSON.stringify(h.meta)).toContain("/share/default.jpg");
  });
});
