// TEMPORARY migration check: content/products.yml must reproduce the legacy src/content/gear/*.ts products exactly,
// and every product's outbound URL must be unchanged. Delete this file (and src/content/gear/*.ts) once the owner is
// happy with products.yml as the single source.
import { describe, expect, it } from "vitest";
import { products, type Product } from "@/content/gear";
import { productButton } from "@/content/affiliate-usage";
import { resolveProductLink } from "@/content/gear-links";

const modules = import.meta.glob<{ products: Product[] }>("../content/gear/*.ts", { eager: true });
const legacy: Product[] = Object.values(modules).flatMap((m) => m.products ?? []);
const legacyOutbound = (p: Product) =>
  p.productUrl ?? (/\.pdf(\?|#|$)/i.test(p.specSource.url) ? undefined : p.specSource.url);

describe("products.yml parity with the legacy gear files", () => {
  it("still has all 25 legacy products (new products have been added since)", () => {
    expect(legacy.length).toBe(25);
    const ids = products.map((p) => p.id);
    for (const old of legacy) expect(ids, old.id).toContain(old.id);
  });
  it("keeps every product's facts verbatim", () => {
    for (const old of legacy) {
      const now = products.find((p) => p.id === old.id)!;
      expect(
        {
          name: now.name,
          brand: now.brand,
          summary: now.summary,
          // The Atom gained a "maker pages disagree" note on 2026-11-19; every legacy spec is still there, in order.
          keySpecs: now.keySpecs.filter((k) => !k.startsWith("Maker pages have disagreed")),
          specSource: now.specSource,
        },
        old.id,
      ).toEqual({
        name: old.name,
        brand: old.brand,
        summary: old.summary,
        keySpecs: old.keySpecs,
        specSource: old.specSource,
      });
    }
  });
  it("leaves every outbound URL unchanged (old productButton, new productButton and new resolver all agree)", () => {
    for (const old of legacy) {
      const now = products.find((p) => p.id === old.id)!;
      // A product the owner has since given an approved Amazon entry resolves to that link; all others stay unchanged.
      const viaAmazon = (u?: string) => !!u && u.startsWith("https://www.amazon.com/dp/");
      const a = productButton(now)?.url;
      if (!viaAmazon(a)) expect(a, old.id).toBe(legacyOutbound(old));
      const b = resolveProductLink(now, [])?.url;
      if (!viaAmazon(b)) expect(b, old.id).toBe(legacyOutbound(old));
    }
  });
  it("adds no affiliate id and no retailer link: none exist in the repo", () => {
    for (const p of products) {
      expect(p.affiliateId, p.id).toBeUndefined();
      expect(p.retailerUrl, p.id).toBeUndefined();
      expect(p.active, p.id).toBe(true);
    }
  });
  it("records the dates the repo already has as the last verification date", () => {
    for (const old of legacy)
      expect(products.find((p) => p.id === old.id)!.lastVerified).toBe(old.specSource.accessedOn);
  });
});
