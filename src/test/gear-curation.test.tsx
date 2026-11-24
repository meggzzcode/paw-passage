import { describe, expect, it } from "vitest";
import { products } from "@/content/gear";
import { gearCategories } from "@/content/gear-categories";
import { resolveProductLink } from "@/content/gear-links";
import {
  MIN_COLLECTION,
  categoryProducts,
  featuredGear,
  featuredProductIds,
  liveCategories,
  liveShortcuts,
  liveTrips,
  parseGearSearch,
  planGuideSlugs,
  planGuides,
  resolveTripCollection,
  shopByDog,
  shopByTrip,
  tripCollections,
} from "@/content/gear-hub";

const active = (id: string) => products.find((p) => p.id === id && p.active !== false);

describe("gear homepage curation", () => {
  it("every configured product id exists, is active and has a valid link", () => {
    const ids = [
      ...featuredProductIds,
      ...tripCollections.flatMap((c) => c.groups.flatMap((g) => g.productIds)),
    ];
    for (const id of ids) {
      const p = active(id);
      expect(p, id).toBeTruthy();
      expect(resolveProductLink(p!), id).toBeTruthy();
    }
  });
  it("every trip has a collection, no collection is empty, no product repeats within one", () => {
    expect(tripCollections.map((c) => c.slug)).toEqual(shopByTrip.map((t) => t.slug));
    for (const t of shopByTrip) {
      const r = resolveTripCollection(t.slug)!;
      expect(r, t.slug).toBeTruthy();
      expect(r.count, t.slug).toBeGreaterThanOrEqual(MIN_COLLECTION);
      const ids = r.groups.flatMap((g) => g.products.map((p) => p.id));
      expect(new Set(ids).size).toBe(ids.length);
      expect(r.groups.every((g) => g.products.length > 0)).toBe(true);
    }
    expect(liveTrips().length).toBe(shopByTrip.length);
  });
  it("a collection with too few shoppable products is hidden rather than padded", () => {
    const list = products.map((p) =>
      p.categories?.[0] === "cold-weather" ? { ...p, active: false } : p,
    );
    expect(resolveTripCollection("winter-trip", list)).toBeUndefined();
    expect(liveTrips(list).map((t) => t.slug)).not.toContain("winter-trip");
  });
  it("curation is deterministic and ordered as configured", () => {
    expect(featuredGear().map((f) => f.product.id)).toEqual(featuredProductIds);
    expect(JSON.stringify(resolveTripCollection("road-trip"))).toBe(
      JSON.stringify(resolveTripCollection("road-trip")),
    );
    expect(featuredGear().length).toBeGreaterThanOrEqual(3);
    expect(featuredGear().length).toBeLessThanOrEqual(6);
  });
  it("all 11 categories are shown with counts equal to active products", () => {
    expect(liveCategories().length).toBe(gearCategories.length);
    for (const c of liveCategories())
      expect(categoryProducts(c.slug).every((p) => p.active !== false)).toBe(true);
  });
  it("dog shortcuts and guides resolve", () => {
    expect(liveShortcuts(shopByDog).length).toBe(shopByDog.length);
    expect(planGuides().length).toBeGreaterThanOrEqual(3);
    expect(planGuideSlugs.length).toBeGreaterThanOrEqual(3);
  });
  it("search parsing keeps only real trips", () => {
    expect(parseGearSearch({ trip: "cabin-stay" })).toEqual({ trip: "cabin-stay" });
    expect(parseGearSearch({ trip: "nope" })).toEqual({});
    expect(parseGearSearch({ trip: 5 })).toEqual({});
  });
});
