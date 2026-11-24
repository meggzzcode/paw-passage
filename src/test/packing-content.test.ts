import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import { packingConfig as cfg } from "@/content/packing";
import { products } from "@/content/gear";
import { affiliateLinks } from "@/content/affiliates";
import { productLinkId } from "@/content/affiliate-usage";
import { packingProblems, packingSchema, type PackingConfig } from "@/lib/packing/schema";
import { defaultTrip, normalizeTrip, quantityFor, suggestFor } from "@/lib/packing/engine";
import { loadContent } from "../../plugins/content";

const facts = products.map((p) => ({ id: p.id, active: p.active !== false }));
const clone = (): PackingConfig => structuredClone(cfg);
const problems = (c: PackingConfig) => packingProblems(c, facts);
const first = (id: string, c: PackingConfig) => c.items.find((i) => i.id === id)!;

describe("content/packing.yml as shipped", () => {
  it("passes every check", () => {
    expect(problems(cfg)).toEqual([]);
    expect(
      packingSchema.safeParse(parse(readFileSync("content/packing.yml", "utf8"))).success,
    ).toBe(true);
  });

  it("has the categories and trip types the planner promises", () => {
    expect(cfg.categories.map((c) => c.label)).toEqual([
      "Food and water",
      "Leashes, ID and safety",
      "Sleep and comfort",
      "Car and travel",
      "Outdoor adventures",
      "Health and medication",
      "Cabin and rental essentials",
    ]);
    expect(cfg.tripTypes.map((t) => t.label)).toEqual([
      "Cabin or vacation rental",
      "Road trip",
      "Beach or lake getaway",
      "Camping or hiking trip",
      "Other getaway",
    ]);
    expect(cfg.conditions).toHaveLength(9);
  });

  it("every recommended product is active, Amazon-sourced with an approved affiliate link, and no record holds a URL", () => {
    const text = readFileSync("content/packing.yml", "utf8");
    expect(text).not.toMatch(/https?:\/\//);
    expect(text).not.toMatch(/\$\s?\d|amazon\.com|tag=/i);
    for (const item of cfg.items)
      for (const entry of item.products) {
        const p = products.find((x) => x.id === entry.id);
        expect(p, `${item.id}/${entry.id}`).toBeTruthy();
        expect(p!.active, `${item.id}/${entry.id} active`).not.toBe(false);
        const link = affiliateLinks.find((l) => l.id === productLinkId(p!));
        expect(link?.approved, `${entry.id} approved link`).toBe(true);
        expect(link?.network, `${entry.id} network`).toMatch(/amazon/i);
        expect(entry.caution.length, `${entry.id} caution`).toBeGreaterThan(20);
      }
  });

  it("makes no unsupported claims in its wording", () => {
    const all = JSON.stringify(cfg);
    expect(all).not.toMatch(
      /best[- ]seller|tested by us|we tested|top rated|cheapest|in stock|\b\d+(\.\d)? stars?\b/i,
    );
    // Quantities and guidance never carry a dose, a food weight, calories or a water volume (product cautions quote makers' sizes).
    const guidance = JSON.stringify(cfg.items.map((i) => [i.what, i.why, i.tip, i.quantity]));
    expect(guidance).not.toMatch(
      /\d\s?(mg|ml|cc|cups?|oz|ounces?|calories|kcal|litres?|liters?|gallons?)\b/i,
    );
  });

  it("is deterministic for any trip and never repeats an item", () => {
    for (const t of cfg.tripTypes)
      for (const days of [1, 7, 30])
        for (const dogs of [1, 5]) {
          const trip = normalizeTrip(
            { tripType: t.id, days, dogs, conditions: cfg.conditions.map((c) => c.id) },
            cfg,
          );
          const a = suggestFor(trip, cfg).map((s) => s.item.id);
          expect(new Set(a).size).toBe(a.length);
          expect(suggestFor(trip, cfg).map((s) => s.item.id)).toEqual(a);
        }
    expect(suggestFor(defaultTrip(), cfg).length).toBeGreaterThan(8);
  });
});

describe("content validation reports a clear error naming the record and the field", () => {
  it("duplicate item ids", () => {
    const c = clone();
    c.items.push(structuredClone(first("food", c)));
    expect(problems(c)).toContain('item "food": the id is used more than once');
  });
  it("missing names (schema)", () => {
    const c = parse(readFileSync("content/packing.yml", "utf8"));
    c.items[0].name = "  ";
    const r = packingSchema.safeParse(c);
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]!.path.join(".")).toBe("items.0.name");
  });
  it("invalid category references", () => {
    const c = clone();
    first("food", c).category = "nowhere";
    expect(problems(c).join("\n")).toMatch(
      /item "food": field "category" names an unknown category "nowhere"/,
    );
  });
  it("unknown trip types and conditions", () => {
    const c = clone();
    first("throw", c).when.tripTypes = ["spaceship"];
    first("pen", c).when.anyConditions = ["rainy"];
    c.tripTypes[0]!.implies = ["sunny"];
    const out = problems(c).join("\n");
    expect(out).toMatch(
      /item "throw": field "when.tripTypes" names an unknown trip type "spaceship"/,
    );
    expect(out).toMatch(
      /item "pen": field "when.anyConditions" names an unknown condition "rainy"/,
    );
    expect(out).toMatch(/trip type "cabin": field "implies" names an unknown condition "sunny"/);
  });
  it("invalid rules", () => {
    const c = clone();
    first("food", c).when = { tripTypes: ["cabin"] };
    first("pen", c).when = {};
    const out = problems(c).join("\n");
    expect(out).toMatch(/item "food": an "essential" item always appears/);
    expect(out).toMatch(/item "pen": a "conditional" item needs a "when" rule/);
    const bad = parse(readFileSync("content/packing.yml", "utf8"));
    bad.items[0].appears = "sometimes";
    expect(packingSchema.safeParse(bad).success).toBe(false);
  });
  it("contradictory conditions", () => {
    const c = clone();
    first("pen", c).when = { allConditions: ["hot"], unlessConditions: ["hot"] };
    first("gps", c).when = { anyConditions: ["cold"], unlessConditions: ["cold"] };
    first("cooling", c).when = { anyConditions: ["hot"], minDays: 9, maxDays: 2 };
    first("boots", c).products[0]!.onlyConditions = ["cold"];
    first("boots", c).products[0]!.unlessConditions = ["cold"];
    const out = problems(c).join("\n");
    expect(out).toMatch(/item "pen": contradictory rule: condition "hot"/);
    expect(out).toMatch(/item "gps": contradictory rule: every condition in "when.anyConditions"/);
    expect(out).toMatch(/item "cooling": contradictory rule: "when.minDays" \(9\)/);
    expect(out).toMatch(
      /item "boots": field "products\[0\]" \("ruffwear-polar-trex-boots"\): contradictory rule/,
    );
  });
  it("invalid quantity configuration", () => {
    const c = clone();
    first("bed", c).quantity = { strategy: "perDog" };
    first("water", c).quantity = { strategy: "text" };
    first("treats", c).quantity = { strategy: "none", count: 2 };
    first("waste-bags", c).quantity = {
      strategy: "perDogPerDay",
      count: 3,
      unit: "bag",
      min: 50,
      max: 10,
    };
    const out = problems(c).join("\n");
    expect(out).toMatch(/item "bed": field "quantity.count" is required for the "perDog" strategy/);
    expect(out).toMatch(/item "bed": field "quantity.unit" is required/);
    expect(out).toMatch(/item "water": field "quantity.text" is required for the "text" strategy/);
    expect(out).toMatch(/item "treats": field "quantity.strategy" is "none"/);
    expect(out).toMatch(
      /item "waste-bags": field "quantity.min" \(50\) is larger than "quantity.max" \(10\)/,
    );
    const bad = parse(readFileSync("content/packing.yml", "utf8"));
    bad.items[0].quantity = { strategy: "formula" };
    expect(packingSchema.safeParse(bad).success).toBe(false);
  });
  it("unknown product ids", () => {
    const c = clone();
    first("bowl", c).products[0]!.id = "no-such-product";
    expect(problems(c).join("\n")).toMatch(
      /item "bowl": field "products\[0\]" \("no-such-product"\): no product with this id in content\/products\.yml/,
    );
  });
  it("inactive product recommendations", () => {
    const inactive = products.find((p) => p.active === false)!;
    const c = clone();
    first("bowl", c).products[0]!.id = inactive.id;
    expect(problems(c).join("\n")).toMatch(
      /field "products\[0\]" \("[a-z0-9-]+"\): the product is inactive/,
    );
  });
  it("a second product without a 'because', a missing 'shopFor', and a reserved id", () => {
    const c = clone();
    delete first("bowl", c).products[1]!.because;
    first("gps", c).shopFor = undefined;
    c.items.push({ ...structuredClone(first("food", c)), id: "custom-1" });
    const out = problems(c).join("\n");
    expect(out).toMatch(/item "bowl": field "products\[1\]".*"because" is required/);
    expect(out).toMatch(/item "gps": field "shopFor" is required/);
    expect(out).toMatch(/item "custom-1": field "id" may not start with "custom-"/);
  });
});

describe("a bad packing.yml stops the build instead of breaking the planner", () => {
  /** A loader call against a temporary project holding the real products and an edited copy of packing.yml. */
  const run = (edit: (t: string) => string) => () => {
    const root = mkdtempSync(join(tmpdir(), "paws-packing-"));
    try {
      mkdirSync(join(root, "content"), { recursive: true });
      writeFileSync(
        join(root, "content/products.yml"),
        readFileSync("content/products.yml", "utf8"),
      );
      writeFileSync(
        join(root, "content/packing.yml"),
        edit(readFileSync("content/packing.yml", "utf8")),
      );
      return loadContent(root, false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  };

  it("loads the real file", () => {
    expect(run((t) => t)().packing.items.length).toBeGreaterThan(20);
  });
  it("names the file, the item and the field for a bad category", () => {
    expect(
      run((t) => t.replace("category: food-water\n    order: 10", "category: oops\n    order: 10")),
    ).toThrow(
      /content\/packing\.yml[\s\S]*item "food": field "category" names an unknown category "oops"/,
    );
  });
  it("names the item and field for an unknown product id", () => {
    expect(run((t) => t.replace("id: kurgo-collaps-a-bowl", "id: kurgo-missing"))).toThrow(
      /item "bowl": field "products\[0\]" \("kurgo-missing"\)/,
    );
  });
  it("fails with a readable error for a file that is not valid", () => {
    expect(run((t) => t.replace("appears: essential", "appears: whenever"))).toThrow(
      /content\/packing\.yml[\s\S]*appears/,
    );
  });
});

describe("Journey F: a buyer adds 'reusable dog towel' through packing.yml only", () => {
  it("validates, loads through the content pipeline and shows up in the list with no React change", () => {
    const addition = `
  - id: reusable-dog-towel
    name: Reusable dog towel
    category: outdoor
    order: 15
    appears: conditional
    when: { anyConditions: [water] }
    what: A quick-drying towel for swim days.
    why: Wet fur is easier to deal with at the water's edge.
    quantity: { strategy: perDog, count: 1, unit: towel }
`;
    const text = readFileSync("content/packing.yml", "utf8") + addition;
    const root = mkdtempSync(join(tmpdir(), "paws-packing-f-"));
    try {
      mkdirSync(join(root, "content"), { recursive: true });
      writeFileSync(
        join(root, "content/products.yml"),
        readFileSync("content/products.yml", "utf8"),
      );
      writeFileSync(join(root, "content/packing.yml"), text);
      const loaded = loadContent(root, false).packing as PackingConfig;
      expect(problems(loaded)).toEqual([]);
      const beach = normalizeTrip({ tripType: "beach-lake", dogs: 2 }, loaded);
      const got = suggestFor(beach, loaded).map((s) => s.item.id);
      expect(got).toContain("reusable-dog-towel");
      expect(got.indexOf("reusable-dog-towel")).toBeGreaterThan(got.indexOf("towel"));
      expect(
        quantityFor(
          loaded.items.find((i) => i.id === "reusable-dog-towel")!,
          beach,
        ).text,
      ).toBe("2 towels");
      expect(
        suggestFor(normalizeTrip({ tripType: "cabin" }, loaded), loaded).map((s) => s.item.id),
      ).not.toContain("reusable-dog-towel");
      // a typo in the new item fails the build with the item and field named
      writeFileSync(
        join(root, "content/packing.yml"),
        text.replace("category: outdoor\n    order: 15", "category: outdors\n    order: 15"),
      );
      expect(() => loadContent(root, false)).toThrow(
        /item "reusable-dog-towel": field "category" names an unknown category "outdors"/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
