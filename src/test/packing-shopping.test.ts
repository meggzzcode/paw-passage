import { describe, expect, it } from "vitest";
import { packingConfig as cfg } from "@/content/packing";
import { getProduct, products, type Product } from "@/content/gear";
import { affiliateLinks, getApprovedLink } from "@/content/affiliates";
import { productLinkId } from "@/content/affiliate-usage";
import { resolveProductLink, type ResolvedProductLink } from "@/content/gear-links";
import { defaultTrip, normalizeTrip, suggestFor, type Trip } from "@/lib/packing/engine";
import {
  ctaLabelFor,
  hasAffiliate,
  needsAmazonSentence,
  recommendationsFor,
} from "@/lib/packing/shopping";
import { AFFILIATE_SURFACE_NOTICE } from "@/lib/disclosure";

const trip = (over: Partial<Trip> = {}) => normalizeTrip({ ...defaultTrip(), ...over }, cfg);
const item = (id: string) => cfg.items.find((i) => i.id === id)!;

describe("packing product recommendations", () => {
  it("every item with products yields at least one valid, active, linked suggestion on a matching trip", () => {
    for (const it of cfg.items.filter((i) => i.products.length)) {
      const all = normalizeTrip(
        { tripType: "cabin", conditions: cfg.conditions.map((c) => c.id) },
        cfg,
      );
      const recs = recommendationsFor(it, all, cfg);
      expect(recs.length, it.id).toBeGreaterThan(0);
      expect(recs.length, it.id).toBeLessThanOrEqual(2);
      for (const r of recs) {
        expect(getProduct(r.product.id), `${it.id}/${r.product.id}`).toBeTruthy();
        expect(r.link.url).toMatch(/^https:\/\//);
        expect(r.caution.length).toBeGreaterThan(10);
        expect(r.facts.length).toBeLessThanOrEqual(3);
      }
      expect(recs[0]!.role).toBe("primary");
      if (recs[1]) {
        expect(recs[1].role).toBe("alternative");
        expect(recs[1].because).toBeTruthy();
      }
    }
  });

  it("uses the shared link precedence: the link equals resolveProductLink() and the approved affiliate entry, never a built URL", () => {
    const [rec] = recommendationsFor(item("bowl"), trip(), cfg);
    const p = rec!.product;
    expect(rec!.link).toEqual(resolveProductLink(p));
    expect(rec!.link.url).toBe(getApprovedLink(productLinkId(p))!.url);
    expect(rec!.link.kind).toBe("affiliate");
    expect(rec!.link.rel).toBe("sponsored nofollow noopener");
    expect(rec!.ctaLabel).toBe("View at Amazon");
    expect(rec!.amazon).toBe(true);
    expect(needsAmazonSentence([rec!])).toBe(true);
    expect(hasAffiliate([rec!])).toBe(true);
    expect(AFFILIATE_SURFACE_NOTICE).toMatch(/affiliate/i);
  });

  it("labels the button by where it goes", () => {
    const base = { rel: "x", url: "https://x.example/" };
    expect(
      ctaLabelFor({
        ...base,
        kind: "affiliate",
        network: "Amazon Associates",
        label: "",
      } as ResolvedProductLink),
    ).toBe("View at Amazon");
    expect(ctaLabelFor({ ...base, kind: "manufacturer", label: "" })).toBe(
      "See at the manufacturer",
    );
    expect(ctaLabelFor({ ...base, kind: "retailer", label: "" })).toBe("See at the retailer");
  });

  it("falls back to a maker page, a second option, or nothing, and never invents a recommendation", () => {
    const bowl = item("bowl");
    const first = getProduct("kurgo-collaps-a-bowl")!;
    // no affiliate link, but a maker page: still suggested, with a non-affiliate button and no Amazon sentence
    const noAff = (p: Product): ResolvedProductLink | undefined =>
      p.id === first.id
        ? {
            kind: "manufacturer",
            url: "https://maker.example/p",
            label: "x",
            rel: "nofollow noopener",
          }
        : resolveProductLink(p);
    const [a] = recommendationsFor(bowl, trip(), cfg, { resolve: noAff });
    expect(a!.ctaLabel).toBe("See at the manufacturer");
    expect(a!.affiliate).toBe(false);
    expect(needsAmazonSentence([a!])).toBe(false);
    // no usable link for the first product: the next one takes over as the main suggestion
    const none = (p: Product) => (p.id === first.id ? undefined : resolveProductLink(p));
    const recs = recommendationsFor(bowl, trip(), cfg, { resolve: none });
    expect(recs.map((r) => r.product.id)).toEqual(["gunner-dog-bowl"]);
    expect(recs[0]!.role).toBe("primary");
    // nothing resolves: no suggestions
    expect(recommendationsFor(bowl, trip(), cfg, { resolve: () => undefined })).toEqual([]);
    // an inactive product is skipped
    const off = products.map((p) => (p.id === first.id ? { ...p, active: false } : p));
    expect(recommendationsFor(bowl, trip(), cfg, { products: off })[0]!.product.id).toBe(
      "gunner-dog-bowl",
    );
    // an item with no products
    expect(recommendationsFor(item("food"), trip(), cfg)).toEqual([]);
  });

  it("matches the trip: cold boots only when cold, and never infers suitability from senior or large", () => {
    expect(
      recommendationsFor(item("boots"), trip({ conditions: ["cold"] }), cfg)[0]!.product.id,
    ).toBe("ruffwear-polar-trex-boots");
    expect(recommendationsFor(item("boots"), trip(), cfg)[0]!.product.id).toBe(
      "ruffwear-grip-trex-boots",
    );
    const senior = trip({ tripType: "road-trip", conditions: ["senior"] });
    const plain = trip({ tripType: "road-trip" });
    const ramp = (t: Trip) =>
      recommendationsFor(item("ramp"), t, cfg).map((r) => [r.product.id, r.caution]);
    expect(ramp(senior)).toEqual(ramp(plain));
    for (const r of recommendationsFor(item("ramp"), senior, cfg))
      expect(r.caution).not.toMatch(/safe for (senior|older|large)/i);
    // the ramp caution is honest that the maker does not describe it as a senior product
    expect(recommendationsFor(item("ramp"), senior, cfg)[0]!.caution).toMatch(
      /does not describe it as a senior or mobility product/,
    );
  });

  it("every product on any trip's list has a working link and an affiliate entry on Amazon", () => {
    for (const t of cfg.tripTypes) {
      const tr = normalizeTrip(
        { tripType: t.id, conditions: cfg.conditions.map((c) => c.id) },
        cfg,
      );
      for (const s of suggestFor(tr, cfg))
        for (const r of recommendationsFor(s.item, tr, cfg)) {
          const link = affiliateLinks.find((l) => l.id === productLinkId(r.product));
          expect(
            link?.approved && /amazon/i.test(link.network),
            `${s.item.id}/${r.product.id}`,
          ).toBe(true);
        }
    }
  });
});
