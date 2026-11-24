import { describe, expect, it } from "vitest";
import { packingConfig as cfg } from "@/content/packing";
import {
  defaultTrip,
  effectiveConditions,
  ideasFor,
  normalizeTrip,
  quantityFor,
  suggestFor,
  tripSummaryLine,
  tripTitle,
  type Trip,
} from "@/lib/packing/engine";
import { parsePresetSearch } from "@/lib/packing/preset";

const trip = (over: Partial<Trip> = {}): Trip => normalizeTrip({ ...defaultTrip(), ...over }, cfg);
const ids = (t: Trip) => suggestFor(t, cfg).map((s) => s.item.id);
const item = (id: string) => cfg.items.find((i) => i.id === id)!;

describe("packing engine: personalization", () => {
  it("keeps essentials on every trip type", () => {
    const essentials = cfg.items.filter((i) => i.appears === "essential").map((i) => i.id);
    expect(essentials.length).toBeGreaterThan(6);
    for (const t of cfg.tripTypes) {
      const got = ids(trip({ tripType: t.id }));
      for (const e of essentials) expect(got, `${t.id} ${e}`).toContain(e);
    }
  });

  it("adds no car items when the trip is not a driving trip", () => {
    const got = ids(trip({ tripType: "cabin" }));
    for (const id of ["car-restraint", "seat-cover", "ramp", "bottle"])
      expect(got).not.toContain(id);
    const cars = cfg.items.filter((i) => i.category === "car-travel").map((i) => i.id);
    expect(got.filter((i) => cars.includes(i))).toEqual([]);
  });

  it("adds car items when driving, by ticking the condition or by choosing a road trip", () => {
    expect(ids(trip({ conditions: ["driving"] }))).toContain("car-restraint");
    const road = trip({ tripType: "road-trip" });
    expect(effectiveConditions(road, cfg)).toContain("driving");
    expect(ids(road)).toEqual(expect.arrayContaining(["car-restraint", "seat-cover"]));
  });

  it("makes a beach trip different from a winter cabin", () => {
    const beach = ids(trip({ tripType: "beach-lake", days: 2 }));
    const winter = ids(trip({ tripType: "cabin", conditions: ["cold"] }));
    expect(beach).toContain("life-jacket");
    expect(beach).not.toContain("warm-layer");
    expect(winter).toContain("warm-layer");
    expect(winter).not.toContain("life-jacket");
    expect(winter).toContain("rental-rules");
    expect(beach).not.toContain("rental-rules");
  });

  it("treats a ramp as something to consider for an older dog, never a given", () => {
    const base = suggestFor(trip({ tripType: "road-trip" }), cfg);
    expect(base.find((s) => s.item.id === "ramp")).toBeUndefined();
    const senior = suggestFor(trip({ tripType: "road-trip", conditions: ["senior"] }), cfg);
    expect(senior.find((s) => s.item.id === "ramp")?.inclusion).toBe("consider");
    // no ramp when not driving, even for an older dog
    expect(ids(trip({ tripType: "cabin", conditions: ["senior"] }))).not.toContain("ramp");
    expect(ids(trip({ tripType: "cabin", conditions: ["senior"] }))).toContain("senior-care");
  });

  it("does not assume boots; they are only offered as an idea", () => {
    expect(ids(trip({ conditions: ["cold", "outdoors"] }))).not.toContain("boots");
    expect(ideasFor(trip(), cfg).map((i) => i.id)).toContain("boots");
  });

  it("adds a portable pen only when there is no fence or the dog may slip away", () => {
    expect(ids(trip())).not.toContain("pen");
    expect(ids(trip({ conditions: ["no-fence"] }))).toContain("pen");
    expect(ids(trip({ conditions: ["escape-risk"] }))).toEqual(
      expect.arrayContaining(["pen", "gps", "harness"]),
    );
    expect(item("pen").tip).toMatch(/host/i);
  });

  it("respects the day rule for food containers", () => {
    expect(ids(trip({ days: 1 }))).not.toContain("food-container");
    expect(ids(trip({ days: 2 }))).toContain("food-container");
  });

  it("adds medication only when asked, and never works out a dose", () => {
    expect(ids(trip())).not.toContain("medication");
    expect(ids(trip({ conditions: ["medication"] }))).toContain("medication");
    const q = quantityFor(item("medication"), trip({ dogs: 3, days: 10 }));
    expect(q.text).toMatch(/vet/i);
    expect(q.text).not.toMatch(/\d/);
  });

  it("is deterministic and has no duplicates", () => {
    const t = trip({
      tripType: "camping-hiking",
      days: 5,
      dogs: 2,
      conditions: ["cold", "hot", "senior", "medication"],
    });
    const a = ids(t);
    expect(ids(t)).toEqual(a);
    expect(new Set(a).size).toBe(a.length);
  });

  it("keeps the default list concise", () => {
    expect(ids(trip()).length).toBeLessThan(20);
  });

  it("builds a heading and a summary line", () => {
    const t = trip({ days: 3, dogs: 2, conditions: ["outdoors"] });
    expect(tripTitle(t, cfg)).toBe("Your cabin getaway packing list");
    expect(tripSummaryLine(t, cfg)).toBe("3 days · 2 dogs · Hiking or outdoors");
    expect(tripSummaryLine(trip({ days: 1, dogs: 1 }), cfg)).toBe("1 day · 1 dog");
  });
});

describe("packing engine: quantities", () => {
  it("scales beds and leashes by dog count", () => {
    expect(quantityFor(item("bed"), trip({ dogs: 1 })).text).toBe("1 bed");
    expect(quantityFor(item("bed"), trip({ dogs: 3 })).text).toBe("3 beds");
    expect(quantityFor(item("leash"), trip({ dogs: 2 })).text).toBe("2 leashes, plus a spare");
  });

  it("counts dog-days of food without a meal schedule", () => {
    const q = quantityFor(item("food"), trip({ dogs: 2, days: 3 }));
    expect(q.text).toBe("6 dog-days of food");
    expect(q.detail).toContain("2 dogs x 3 days");
  });

  it("counts meal portions from the visitor's own schedule and labels it a planning calculation", () => {
    const q = quantityFor(item("food"), trip({ dogs: 2, days: 3, mealsPerDay: 2 }));
    expect(q.text).toBe("12 meal portions");
    expect(q.detail).toMatch(/planning calculation/i);
    expect(q.text + (q.detail ?? "")).not.toMatch(/\b(cup|oz|gram|calorie|kcal|lb)s?\b/i);
  });

  it("gives waste bags an editable starting point with a floor", () => {
    const short = quantityFor(item("waste-bags"), trip({ dogs: 1, days: 1 }));
    expect(short.text).toMatch(/^10 bags/);
    const long = quantityFor(item("waste-bags"), trip({ dogs: 2, days: 7 }));
    expect(long.text).toMatch(/^42 bags/);
    expect(long.text).toMatch(/starting point/);
  });

  it("asks for safe water access instead of a volume", () => {
    const q = quantityFor(item("water"), trip({ dogs: 4, days: 20 }));
    expect(q.text).toMatch(/safe drinking water/i);
    expect(q.text).not.toMatch(/\d/);
  });
});

describe("packing engine: trip and preset parsing", () => {
  it("clamps and cleans a trip", () => {
    const t = normalizeTrip(
      {
        tripType: "nope",
        days: 400,
        dogs: 0,
        conditions: ["driving", "bogus", "driving"],
        mealsPerDay: 99,
      },
      cfg,
    );
    expect(t.tripType).toBe("cabin");
    expect(t.days).toBe(30);
    expect(t.dogs).toBe(1);
    expect(t.conditions).toEqual(["driving"]);
    expect(t.mealsPerDay).toBe(6);
    expect(normalizeTrip({ days: Number.NaN, dogs: "2" as unknown as number }, cfg)).toMatchObject({
      days: 3,
      dogs: 2,
    });
  });

  it("validates guide presets and ignores anything unknown", () => {
    expect(parsePresetSearch({ trip: "cabin", days: "3", dogs: "2" }, cfg)).toEqual({
      trip: "cabin",
      days: 3,
      dogs: 2,
    });
    expect(parsePresetSearch({ trip: "mars", days: "-4", dogs: "99", extra: "x" }, cfg)).toEqual({
      dogs: 5,
    });
    expect(parsePresetSearch({ days: "abc", dogs: "1e3", trip: ["cabin"] }, cfg)).toEqual({});
    expect(parsePresetSearch({ days: "400" }, cfg)).toEqual({ days: 30 });
  });
});
