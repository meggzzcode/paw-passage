import { describe, expect, it } from "vitest";
import { allGuides } from "@/content/guides";

const tools = ["checklist", "host-questions", "cost-calculator", "compare"];
const text = (g: (typeof allGuides)[number]) => g.body + "\n" + g.faqs.map((f) => f.a).join("\n");

describe.each(allGuides.map((g) => [g.slug, g] as const))("guide content: %s", (_slug, g) => {
  it("every [[n]] marker points at an existing source", () => {
    const nums = [...text(g).matchAll(/\[\[(\d+)\]\]/g)].map((m) => Number(m[1]));
    const bad = nums.filter((n) => n < 1 || n > g.sources.length);
    expect(bad, `${g.slug}: markers out of range (sources: ${g.sources.length})`).toEqual([]);
  });
  it("every source is cited at least once", () => {
    const cited = new Set([...text(g).matchAll(/\[\[(\d+)\]\]/g)].map((m) => Number(m[1])));
    const uncited = g.sources.map((s, i) => [i + 1, s.title] as const).filter(([n]) => !cited.has(n));
    expect(uncited, `${g.slug}: sources never cited`).toEqual([]);
  });
  it("[[n]](url) links use the same URL as sources[n]", () => {
    const mismatches = [...text(g).matchAll(/\[\[(\d+)\]\]\((https?:[^)\s]+)\)/g)]
      .filter((m) => g.sources[Number(m[1]) - 1] && g.sources[Number(m[1]) - 1]!.url !== m[2])
      .map((m) => `[[${m[1]}]] links ${m[2]} but sources[${m[1]}] is ${g.sources[Number(m[1]) - 1]!.url}`);
    expect(mismatches).toEqual([]);
  });
  it("internal links resolve", () => {
    const slugs = new Set(allGuides.map((x) => x.slug));
    const links = [...text(g).matchAll(/\]\((\/[^)\s#]*)\)/g)].map((m) => m[1]!);
    const broken = links.filter((l) => (l.startsWith("/guides/") ? !slugs.has(l.slice(8)) : l.startsWith("/tools/") ? !tools.includes(l.slice(7)) : false));
    expect(broken).toEqual([]);
    for (const r of g.relatedGuides) expect(slugs.has(r), `relatedGuides: ${r}`).toBe(true);
  });
  it("has no leftover draft wording or stale dated closure notices", () => {
    expect(text(g)).not.toMatch(/for this draft|full-page review (is )?outstanding|TODO|TBD/i);
  });
  it("has at least five competitors, each with a check date", () => {
    if (g.status !== "published") return; // drafts (like the CMS test article) are still being written
    expect(g.research.competitors.length).toBeGreaterThanOrEqual(5);
    for (const c of g.research.competitors) expect(c.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("SEO fields fit", () => {
    expect(g.seoTitle.length).toBeLessThanOrEqual(60);
    expect(g.seoDescription.length).toBeLessThanOrEqual(160);
  });
});

import { getProduct, products } from "@/content/gear";
import { affiliateLinks } from "@/content/affiliates";

describe("gear guides and affiliate products", () => {
  const gearGuides = allGuides.filter((g) => g.category === "Gear");
  it("every product has a readable source and no price or rating", () => {
    for (const p of products) {
      expect(p.specSource.url, p.id).toMatch(/^https:\/\//);
      expect(JSON.stringify(p), `${p.id}: prices/ratings must not be stored`).not.toMatch(/\$\s?\d|stars?\b|rated \d|best price/i);
    }
  });
  it("product ids are unique", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });
  it("gear guides only pick products that exist, and never state prices or testing", () => {
    for (const g of gearGuides) {
      expect((g.gear ?? []).length, `${g.slug} needs picks`).toBeGreaterThanOrEqual(3);
      for (const pick of g.gear ?? []) expect(getProduct(pick.productId), `${g.slug}: ${pick.productId}`).toBeDefined();
      const all = g.body + JSON.stringify(g.gear) + JSON.stringify(g.faqs);
      expect(all, `${g.slug}: no static prices`).not.toMatch(/\$\s?\d/);
      expect(all, `${g.slug}: must not claim we tested`).not.toMatch(/\bwe (have )?(tested|tried|used|reviewed it)|our testing|hands-on/i);
    }
  });
  it("a product's affiliateId must exist in affiliates.ts and be an approved product link to show a button", () => {
    for (const p of products) if (p.affiliateId) expect(affiliateLinks.some((l) => l.id === p.affiliateId), `${p.id}: unknown affiliateId`).toBe(true);
  });
});
