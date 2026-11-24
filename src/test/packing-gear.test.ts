import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { packingConfig as cfg } from "@/content/packing";
import { products, getProduct } from "@/content/gear";
import { gearCategorySlugs } from "@/content/products-schema";
import {
  categoryIsLive,
  liveCategories,
  resolveTripCollection,
  tripCollections,
} from "@/content/gear-hub";
import { getGearCategory } from "@/content/gear-categories";
import { packingProblems, type PackingConfig } from "@/lib/packing/schema";
import {
  defaultTrip,
  extrasFor,
  gearTripFor,
  levelOf,
  normalizeTrip,
  suggestFor,
  type Trip,
} from "@/lib/packing/engine";
import { buyResponseFor, gearCategoryForItem } from "@/lib/packing/shopping";
import { classifyCoverage } from "@/lib/packing/coverage";
import { liveCoverage, liveCoverageMarkdown } from "@/lib/packing/coverage-live";
import { loadContent } from "../../plugins/content";

const trip = (over: Partial<Trip> = {}): Trip => normalizeTrip({ ...defaultTrip(), ...over }, cfg);
const item = (id: string) => cfg.items.find((i) => i.id === id)!;
const facts = products.map((p) => ({ id: p.id, active: p.active !== false }));
const known = {
  gearCategories: gearCategorySlugs,
  liveGearCategories: liveCategories().map((c) => c.slug),
};
const clone = (): PackingConfig => structuredClone(cfg);

describe("Need to buy: four responses, never empty", () => {
  it("1. researched products: a primary and at most one different alternative", () => {
    const r = buyResponseFor(item("bowl"), trip(), cfg);
    expect(r.kind).toBe("products");
    if (r.kind !== "products") return;
    expect(r.recs.length).toBeGreaterThanOrEqual(1);
    expect(r.recs.length).toBeLessThanOrEqual(2);
    expect(r.recs[0]!.role).toBe("primary");
    expect(r.recs[1]?.because).toBeTruthy();
  });

  it("2. no applicable product but a live Gear category: points to the category", () => {
    for (const id of ["water", "throw"]) {
      const r = buyResponseFor(item(id), trip(), cfg);
      expect(r.kind, id).toBe("category");
      if (r.kind === "category") {
        expect(categoryIsLive(r.category.slug), id).toBe(true);
        expect(getGearCategory(r.category.slug)).toBeTruthy();
      }
    }
    expect(gearCategoryForItem(item("water"))?.slug).toBe("feeding-and-hydration");
    // an item whose listed product does not apply to this trip still falls back to that product's category
    const noneApply = {
      ...item("boots"),
      products: [{ ...item("boots").products[0]!, onlyConditions: ["hot"] }],
    };
    const r = buyResponseFor(
      { ...noneApply, products: noneApply.products.slice(0, 1) },
      trip(),
      cfg,
    );
    expect(r.kind).toBe("category");
  });

  it("3. neither: a plain note, no category and no product", () => {
    for (const id of ["food", "treats", "waste-bags", "paperwork", "vet-info"]) {
      expect(buyResponseFor(item(id), trip(), cfg), id).toEqual({ kind: "none" });
    }
  });

  it("falls back from a product whose link is gone, and from a category that is not live", () => {
    const deps = { resolve: () => undefined, liveCategory: () => undefined };
    expect(buyResponseFor(item("bowl"), trip(), cfg, deps)).toEqual({ kind: "none" });
    const dead = {
      liveCategory: (s: string) => (s === "pens-and-gates" ? getGearCategory(s) : undefined),
    };
    expect(gearCategoryForItem(item("water"), dead)).toBeUndefined();
  });
});

describe("packing.yml: Gear handoff fields", () => {
  it("every gearCategory is a real, live Gear category and has a shopFor", () => {
    const withCat = cfg.items.filter((i) => i.gearCategory);
    expect(withCat.length).toBeGreaterThan(1);
    for (const i of withCat) {
      expect(gearCategorySlugs as readonly string[], i.id).toContain(i.gearCategory);
      expect(categoryIsLive(i.gearCategory!), i.id).toBe(true);
      expect(i.shopFor, i.id).toBeTruthy();
    }
  });

  it("the build check names an unknown or thin category and a missing shopFor", () => {
    const bad = clone();
    bad.items.find((i) => i.id === "water")!.gearCategory = "no-such-category";
    expect(packingProblems(bad, facts, known).join("\n")).toMatch(
      /item "water": field "gearCategory" names an unknown Gear category "no-such-category"/,
    );
    const thin = clone();
    thin.items.find((i) => i.id === "water")!.gearCategory = "cold-weather";
    expect(
      packingProblems(thin, facts, {
        ...known,
        liveGearCategories: ["feeding-and-hydration"],
      }).join("\n"),
    ).toMatch(
      /item "water": field "gearCategory" names "cold-weather", which has too few active products/,
    );
    const noShop = clone();
    delete noShop.items.find((i) => i.id === "water")!.shopFor;
    expect(packingProblems(noShop, facts, known).join("\n")).toMatch(
      /item "water": field "shopFor" is required/,
    );
    expect(packingProblems(cfg, facts, known)).toEqual([]);
  });

  it("an unknown gearCategory fails the real build with the item and field named", () => {
    const root = mkdtempSync(join(tmpdir(), "paws-packing-gc-"));
    try {
      mkdirSync(join(root, "content"), { recursive: true });
      writeFileSync(
        join(root, "content/products.yml"),
        readFileSync("content/products.yml", "utf8"),
      );
      writeFileSync(
        join(root, "content/packing.yml"),
        readFileSync("content/packing.yml", "utf8").replace(
          "gearCategory: feeding-and-hydration",
          "gearCategory: feeding",
        ),
      );
      expect(() => loadContent(root, false)).toThrow(
        /content\/packing\.yml[\s\S]*item "water": field "gearCategory" names an unknown Gear category "feeding"/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("every trip type's collection slug exists in the Gear hub and has a live collection", () => {
    const slugs = tripCollections.map((c) => c.slug);
    const mapped: Record<string, string | undefined> = {};
    for (const t of cfg.tripTypes) {
      mapped[t.id] = t.gearTrip;
      if (t.gearTrip) {
        expect(slugs, t.id).toContain(t.gearTrip);
        expect(resolveTripCollection(t.gearTrip), t.id).toBeTruthy();
      }
    }
    expect(mapped).toEqual({
      cabin: "cabin-stay",
      "road-trip": "road-trip",
      "beach-lake": "beach-and-lake",
      "camping-hiking": "hiking",
      other: undefined,
    });
    expect(gearTripFor(trip({ tripType: "other" }), cfg)).toBeUndefined();
  });
});

describe("packing.yml: the three levels and what the extras offer", () => {
  it("levels follow `appears`: essentials 1, conditional 2, optional 3", () => {
    expect(levelOf(item("food"))).toBe(1);
    expect(levelOf(item("harness"))).toBe(2);
    expect(levelOf(item("boots"))).toBe(3);
  });

  it("optional items are never on the list by the rules, and each is backed by a real active product", () => {
    const optional = cfg.items.filter((i) => i.appears === "optional");
    expect(optional.length).toBeGreaterThanOrEqual(8);
    for (const t of cfg.tripTypes)
      for (const c of [[], ...cfg.conditions.map((x) => [x.id])]) {
        const ids = suggestFor(trip({ tripType: t.id, conditions: c }), cfg).map((s) => s.item.id);
        for (const o of optional) expect(ids, `${t.id}/${o.id}`).not.toContain(o.id);
      }
    for (const o of optional) {
      expect(o.products.length, o.id).toBeGreaterThan(0);
      for (const p of o.products) expect(getProduct(p.id), `${o.id}/${p.id}`).toBeTruthy();
    }
  });

  it("extras suit the trip: no snow gear at the beach, no GPS for a cabin, no ramp from an older dog alone", () => {
    const ids = (t: Trip) => extrasFor(t, cfg).map((e) => e.item.id);
    expect(ids(trip({ tripType: "beach-lake" }))).not.toEqual(expect.arrayContaining(["boots"]));
    expect(ids(trip({ tripType: "beach-lake" }))).toContain("life-jacket");
    expect(ids(trip({ tripType: "cabin" }))).not.toContain("gps");
    expect(suggestFor(trip({ tripType: "cabin" }), cfg).map((s) => s.item.id)).not.toContain("gps");
    expect(ids(trip({ tripType: "cabin", conditions: ["senior"] }))).not.toContain("ramp");
    expect(ids(trip({ tripType: "road-trip", conditions: ["senior"] }))).toContain("ramp");
    // relevant first, general ideas last
    const all = extrasFor(trip({ tripType: "cabin" }), cfg);
    const firstGeneral = all.findIndex((e) => e.relevance === "general");
    if (firstGeneral >= 0)
      for (const e of all.slice(firstGeneral)) expect(e.relevance).toBe("general");
  });
});

describe("Gear coverage", () => {
  const report = liveCoverage();

  it("puts every active product in exactly one class and leaves none unreachable", () => {
    const active = products.filter((p) => p.active !== false);
    expect(report.total).toBe(active.length);
    expect(report.rows.map((r) => r.id).sort()).toEqual(active.map((p) => p.id).sort());
    expect(report.counts[1] + report.counts[2] + report.counts[3] + report.counts[4]).toBe(
      report.total,
    );
    expect(
      report.counts[4],
      `unreachable: ${report.rows.filter((r) => r.class === 4).map((r) => r.id)}`,
    ).toBe(0);
  });

  it("gives every active product a valid outbound link or a documented info-only status", () => {
    expect(report.noLink).toEqual([]);
  });

  it("classifies by the rules (a product off every path is class 4, a hub-only one is class 3)", () => {
    const base = {
      cfg: {
        ...cfg,
        items: [
          { ...item("bowl"), products: [{ id: "a", caution: "x" }], gearCategory: undefined },
        ],
      },
      liveCategories: [
        { slug: "feeding-and-hydration", name: "Bowls" },
        { slug: "cold-weather", name: "Cold" },
      ],
      tripCollections: [{ slug: "hiking", heading: "h", productIds: ["d"] }],
      featuredProductIds: [],
      linkKind: () => "manufacturer" as const,
    };
    const r = classifyCoverage({
      ...base,
      products: [
        { id: "a", name: "A", brand: "B", categories: ["feeding-and-hydration"] },
        { id: "b", name: "B", brand: "B", categories: ["feeding-and-hydration"] },
        { id: "c", name: "C", brand: "B", categories: ["cold-weather"] },
        { id: "d", name: "D", brand: "B", categories: [] },
        { id: "e", name: "E", brand: "B", categories: [] },
        { id: "f", name: "F", brand: "B", categories: ["cold-weather"], active: false },
      ],
    });
    const cls = Object.fromEntries(r.rows.map((x) => [x.id, x.class]));
    expect(cls).toEqual({ a: 1, b: 2, c: 3, d: 3, e: 4 });
    expect(r.inactive).toBe(1);
  });

  it("docs/PACKING_GEAR_COVERAGE.md is current (run: bun scripts/gear-coverage-report.ts)", () => {
    expect(existsSync("docs/PACKING_GEAR_COVERAGE.md")).toBe(true);
    expect(readFileSync("docs/PACKING_GEAR_COVERAGE.md", "utf8")).toBe(liveCoverageMarkdown());
  });
});
