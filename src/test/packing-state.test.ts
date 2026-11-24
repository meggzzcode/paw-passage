import { describe, expect, it } from "vitest";
import { packingConfig as cfg } from "@/content/packing";
import { defaultTrip, normalizeTrip, type Trip } from "@/lib/packing/engine";
import {
  activeEntries,
  addCustom,
  addIdea,
  availableIdeas,
  buildList,
  conflictsWithPreset,
  editCustom,
  emptyState,
  excludeItem,
  groupEntries,
  progressOf,
  removeCustom,
  removedEntries,
  restoreItem,
  setBuy,
  setPacked,
  setQuantity,
  type PlannerState,
} from "@/lib/packing/state";
import { packingText } from "@/lib/packing/export";
import {
  CORRUPT_KEY,
  LEGACY_KEY,
  STORAGE_KEY,
  clearState,
  loadState,
  migrateLegacy,
  parseState,
  saveState,
} from "@/lib/packing/storage";

const build = (over: Partial<Trip> = {}, prev: PlannerState | null = null) =>
  buildList(prev, { ...defaultTrip(), ...over }, cfg);
const names = (s: PlannerState) => activeEntries(s, cfg).map((e) => e.item.id);

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
}

describe("checklist state", () => {
  it("keeps packed and need-to-buy independent and never sets one from the other", () => {
    let s = build();
    s = setPacked(s, "bowl", true);
    expect(s.items["bowl"]).toEqual({ packed: true });
    s = setBuy(s, "bowl", true);
    expect(s.items["bowl"]).toEqual({ packed: true, buy: true });
    s = setPacked(s, "bowl", false);
    expect(s.items["bowl"]).toEqual({ buy: true });
    s = setBuy(s, "bowl", false);
    expect(s.items["bowl"]).toBeUndefined();
  });

  it("counts progress only over the active list", () => {
    let s = build();
    const total = names(s).length;
    s = setPacked(s, "bowl", true);
    s = setPacked(s, "leash", true);
    s = setBuy(s, "leash", true);
    let p = progressOf(s, activeEntries(s, cfg));
    expect(p).toEqual({ total, packed: 2, buy: 1 });
    s = excludeItem(s, "leash");
    p = progressOf(s, activeEntries(s, cfg));
    expect(p).toEqual({ total: total - 1, packed: 1, buy: 0 });
  });

  it("removes a suggestion without deleting its record, and restores it", () => {
    let s = build();
    s = setPacked(s, "throw", true);
    s = excludeItem(s, "throw");
    expect(names(s)).not.toContain("throw");
    expect(removedEntries(s, cfg).map((i) => i.id)).toContain("throw");
    expect(s.items["throw"]).toMatchObject({ packed: true, excluded: true });
    s = restoreItem(s, "throw");
    expect(names(s)).toContain("throw");
    expect(activeEntries(s, cfg).find((e) => e.item.id === "throw")?.packed).toBe(true);
  });

  it("lets a visitor add an optional idea, and offers each idea once", () => {
    let s = build();
    expect(availableIdeas(s, cfg).map((i) => i.id)).toContain("boots");
    s = addIdea(s, "boots");
    expect(names(s)).toContain("boots");
    expect(availableIdeas(s, cfg).map((i) => i.id)).not.toContain("boots");
    expect(names(s).filter((i) => i === "boots")).toHaveLength(1);
  });

  it("supports custom items: add, edit, pack, buy, remove; never recommends products for them", () => {
    let s = build();
    s = addCustom(s, "  Reusable   dog towel ", "2");
    expect(s.custom).toEqual([
      { id: "custom-1", name: "Reusable dog towel", qty: "2", packed: false, buy: false },
    ]);
    s = addCustom(s, "   ");
    expect(s.custom).toHaveLength(1);
    s = editCustom(s, "custom-1", "Blue towel", "3");
    s = setPacked(s, "custom-1", true);
    s = setBuy(s, "custom-1", true);
    expect(s.custom[0]).toMatchObject({ name: "Blue towel", qty: "3", packed: true, buy: true });
    const p = progressOf(s, activeEntries(s, cfg));
    expect(p.total).toBe(names(s).length + 1);
    s = removeCustom(s, "custom-1");
    expect(s.custom).toEqual([]);
    s = addCustom(s, "Another");
    expect(s.custom[0]!.id).toBe("custom-2");
  });

  it("lets a visitor change a quantity and go back to the suggestion", () => {
    let s = build({ dogs: 2 });
    s = setQuantity(s, "bed", "3 plus a blanket");
    expect(activeEntries(s, cfg).find((e) => e.item.id === "bed")?.qtyText).toBe(
      "3 plus a blanket",
    );
    s = setQuantity(s, "bed", undefined);
    expect(activeEntries(s, cfg).find((e) => e.item.id === "bed")?.qtyText).toBe("2 beds");
  });

  it("groups the active list by category, only categories with items", () => {
    const s = build();
    const groups = groupEntries(activeEntries(s, cfg), cfg);
    expect(groups.map((g) => g.category.id)).not.toContain("car-travel");
    expect(groups.map((g) => g.category.id)).toContain("rental");
    expect(groups[0]!.category.label).toBe("Food and water");
  });
});

describe("changing the trip after customizing", () => {
  it("keeps custom items, packed state and exclusions, and flags newly relevant items once", () => {
    let s = build({ days: 3 });
    s = setPacked(s, "bowl", true);
    s = setBuy(s, "bed", true);
    s = excludeItem(s, "throw");
    s = addCustom(s, "Squeaky toy");
    const before = new Set(names(s));
    s = buildList(s, { ...s.trip, tripType: "road-trip", conditions: ["cold"] }, cfg);
    const after = names(s);
    expect(s.custom).toHaveLength(1);
    expect(s.items["bowl"]?.packed).toBe(true);
    expect(s.items["bed"]?.buy).toBe(true);
    expect(after).not.toContain("throw");
    expect(new Set(after).size).toBe(after.length);
    expect(after).toEqual(expect.arrayContaining(["car-restraint", "warm-layer"]));
    expect(s.fresh).toEqual(expect.arrayContaining(["car-restraint", "warm-layer"]));
    for (const id of s.fresh) expect(before.has(id)).toBe(false);
    // an item that was already there is not flagged as new
    expect(s.fresh).not.toContain("bowl");
  });

  it("keeps packed state for an item that stops applying and comes back", () => {
    let s = build({ conditions: ["no-fence"] });
    s = setPacked(s, "pen", true);
    s = buildList(s, { ...s.trip, conditions: [] }, cfg);
    expect(names(s)).not.toContain("pen");
    s = buildList(s, { ...s.trip, conditions: ["no-fence"] }, cfg);
    expect(activeEntries(s, cfg).find((e) => e.item.id === "pen")?.packed).toBe(true);
  });

  it("keeps an excluded item excluded even if the trip makes it relevant again", () => {
    let s = build({ conditions: ["no-fence"] });
    s = excludeItem(s, "pen");
    s = buildList(s, { ...s.trip, conditions: [] }, cfg);
    s = buildList(s, { ...s.trip, conditions: ["no-fence"] }, cfg);
    expect(names(s)).not.toContain("pen");
    expect(s.fresh).not.toContain("pen");
  });

  it("detects a saved list that conflicts with a guide preset", () => {
    const s = build({ days: 3, dogs: 1 });
    expect(conflictsWithPreset(s, { tripType: "cabin", days: 3, dogs: 1 })).toBe(false);
    expect(conflictsWithPreset(s, { dogs: 2 })).toBe(true);
    expect(conflictsWithPreset(s, {})).toBe(false);
    expect(conflictsWithPreset(emptyState(cfg), { dogs: 2 })).toBe(false);
  });
});

describe("saved lists", () => {
  it("round-trips through storage", () => {
    const storage = memoryStorage();
    let s = build({ dogs: 2, conditions: ["hot"] });
    s = setPacked(s, "bowl", true);
    s = addCustom(s, "Toy", "1");
    expect(saveState(storage, s)).toBe(true);
    const got = loadState(storage, cfg);
    expect(got.source).toBe("saved");
    expect(got.state).toEqual(s);
  });

  it("migrates the first version (pp.packing.v1) and leaves the old key in place", () => {
    const v1 = JSON.stringify({
      profile: { car: true, rental: true, senior: true, bolter: false, noFence: true },
      packed: ["bowl", "meds-food", "fence", "leash-waste"],
    });
    const storage = memoryStorage({ [LEGACY_KEY]: v1 });
    const got = loadState(storage, cfg);
    expect(got.source).toBe("legacy");
    const s = got.state!;
    expect(s.built).toBe(true);
    expect(s.trip).toMatchObject({
      tripType: "cabin",
      conditions: expect.arrayContaining(["driving", "senior", "no-fence"]),
    });
    for (const id of ["bowl", "food", "treats", "pen", "leash", "waste-bags"])
      expect(s.items[id]?.packed, id).toBe(true);
    expect(storage.getItem(LEGACY_KEY)).toBe(v1);
    // saved as the new version afterwards, and the new version wins on the next load
    saveState(storage, s);
    expect(loadState(storage, cfg).source).toBe("saved");
  });

  it("keeps packed ids from the first version that it cannot map as the visitor's own items", () => {
    const s = migrateLegacy(
      { profile: { car: false, rental: false }, packed: ["old-thing"] },
      cfg,
    )!;
    expect(s.trip.tripType).toBe("other");
    expect(s.custom).toMatchObject([{ name: "old thing", packed: true }]);
  });

  it("recovers from malformed data without crashing, and keeps a copy of what it could not read", () => {
    for (const bad of ["{not json", "null", "[]", JSON.stringify({ v: 9 }), "42"]) {
      const storage = memoryStorage({ [STORAGE_KEY]: bad });
      const got = loadState(storage, cfg);
      expect(got.state, bad).toBeNull();
      expect(got.source).toBe("recovered");
      expect(storage.getItem(CORRUPT_KEY)).toBe(bad);
    }
    expect(loadState(memoryStorage(), cfg)).toEqual({ state: null, source: "none" });
  });

  it("cleans hostile or out-of-range saved values", () => {
    const s = parseState(
      {
        v: 2,
        built: true,
        trip: {
          tripType: "x",
          days: 9999,
          dogs: -2,
          conditions: ["driving", 5, "zzz"],
          mealsPerDay: "lots",
        },
        items: {
          bowl: { packed: "yes", buy: true, qty: "x".repeat(500) },
          "Bad Id!": { packed: true },
          leash: "nope",
        },
        custom: [
          { id: "custom-4", name: "<b>x</b>", qty: 4 },
          { id: "bad", name: "q" },
          { id: "custom-4", name: "dup" },
        ],
        customSeq: "n",
        fresh: [1, "bowl"],
      },
      cfg,
    )!;
    expect(s.trip).toMatchObject({
      tripType: "cabin",
      days: 30,
      dogs: 1,
      conditions: ["driving"],
      mealsPerDay: null,
    });
    expect(s.items["bowl"]).toEqual({ buy: true, qty: "x".repeat(40) });
    expect(Object.keys(s.items)).toEqual(["bowl"]);
    expect(s.custom).toHaveLength(1);
    expect(s.customSeq).toBe(4);
    expect(s.fresh).toEqual(["bowl"]);
  });

  it("works when storage is blocked", () => {
    const blocked = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    } as unknown as Storage;
    expect(loadState(blocked, cfg).state).toBeNull();
    expect(saveState(blocked, build())).toBe(false);
    expect(() => clearState(blocked)).not.toThrow();
    expect(saveState(null, build())).toBe(false);
  });

  it("clears both formats when the visitor confirms a fresh start", () => {
    const storage = memoryStorage({ [LEGACY_KEY]: "{}", [STORAGE_KEY]: "{}" });
    clearState(storage);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getItem(LEGACY_KEY)).toBeNull();
  });
});

describe("copy my list", () => {
  it("lists the active groups with quantities, packed state, items to buy and custom items, without marketing or hidden items", () => {
    let s = build({ dogs: 2, mealsPerDay: 2, conditions: ["driving"] });
    s = setPacked(s, "bowl", true);
    s = setBuy(s, "bed", true);
    s = excludeItem(s, "throw");
    s = addCustom(s, "Reusable dog towel", "2");
    const text = packingText(s, activeEntries(s, cfg), cfg);
    expect(text).toContain("Your cabin getaway packing list");
    expect(text).toContain("3 days · 2 dogs · We're driving");
    expect(text).toContain("FOOD AND WATER");
    expect(text).toContain("[ ] Your dog's usual food (12 meal portions)");
    expect(text).toContain("[x] Food and water bowls (2 bowl sets)");
    expect(text).toContain("[ ] A familiar bed or blanket (2 beds) - need to buy");
    expect(text).toContain("EXTRAS YOU'VE ADDED");
    expect(text).toContain("[ ] Reusable dog towel (2)");
    expect(text).toContain("THINGS TO PICK UP BEFORE YOU GO");
    expect(text).not.toContain("Washable throw");
    expect(text).not.toMatch(/amazon|http|affiliate|commission/i);
  });
});
