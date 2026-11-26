import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { adventureSchema, type Adventure } from "../passport/schema";
import { eligibility, rank, type Ctx, type History } from "../passport/engine";

const base = {
  schema: 2,
  id: "adv-aaaaa1",
  title: "The Great Toy Showdown",
  clue: "A tournament with one furry judge.",
  reveal: "Pit familiar toys against each other.",
  objective: "Let your dog pick a favourite toy.",
  instructions: ["Pick four toys.", "Lay them out.", "Let your dog choose."],
  twist: "Predict the winner first.",
  completion: "When your dog has chosen.",
  memoryPrompt: "Who won?",
  minutesMin: 10,
  minutesMax: 25,
  costMin: 0,
  costMax: 0,
  prep: "none",
  transport: "none",
  setting: "indoor",
  homes: ["apartment", "house-no-yard", "house-with-yard"],
  space: "none",
  places: ["home"],
  lifeStages: ["puppy", "adult", "senior"],
  energy: "gentle",
  dogMobility: "low",
  ownerMobility: "seated",
  stepFree: true,
  crowd: "none",
  strangers: false,
  otherDogs: false,
  noise: "quiet",
  food: false,
  water: "none",
  safety: ["Stop if your dog loses interest."],
  activityTypes: ["play-and-games"],
  collections: ["home"],
  keepsake: { family: "certificate", theme: "toy-champion-certificate", headline: "TOY CHAMPION" },
  access: "free",
  status: "published",
};
let n = 0;
export const mk = (o: Record<string, unknown> = {}): Adventure =>
  adventureSchema.parse({ ...base, id: `adv-t${String(++n).padStart(5, "0")}`, ...o });

const ctx = (dog: Ctx["dog"] = {}, owner: Ctx["owner"] = {}, unlocked = false): Ctx => ({
  dog,
  owner,
  unlocked,
});
const hist = (o: Partial<History> = {}): History => ({
  done: new Set(),
  favorites: new Set(),
  skipped: new Set(),
  ...o,
});

describe("Stage A: each hard rule excludes", () => {
  const excluded = (a: Adventure, c: Ctx) => {
    const v = eligibility(a, c);
    return v.reasons.length > 0 && !v.eligible;
  };
  it("accepts a plain adventure for an empty profile", () => {
    expect(eligibility(mk(), ctx())).toEqual({ eligible: true, reasons: [], confirm: [] });
  });
  it("drafts and locked premium", () => {
    expect(excluded(mk({ status: "draft" }), ctx())).toBe(true);
    expect(excluded(mk({ access: "premium" }), ctx())).toBe(true);
    expect(eligibility(mk({ access: "premium" }), ctx({}, {}, true)).eligible).toBe(true);
  });
  it("life stage and size", () => {
    expect(excluded(mk({ lifeStages: ["adult"] }), ctx({ lifeStage: "puppy" }))).toBe(true);
    expect(excluded(mk({ sizes: ["large"] }), ctx({ size: "small" }))).toBe(true);
    expect(eligibility(mk({ sizes: ["large"] }), ctx({ size: "large" })).eligible).toBe(true);
  });
  it("dog and owner mobility", () => {
    expect(excluded(mk({ dogMobility: "moderate" }), ctx({ limitedMobility: true }))).toBe(true);
    expect(eligibility(mk({ dogMobility: "low" }), ctx({ limitedMobility: true })).eligible).toBe(
      true,
    );
    expect(
      excluded(mk({ ownerMobility: "short-walk" }), ctx({}, { mobility: "minimal-walking" })),
    ).toBe(true);
    expect(
      eligibility(mk({ ownerMobility: "short-walk" }), ctx({}, { mobility: "long-walk" })).eligible,
    ).toBe(true);
    expect(excluded(mk({ stepFree: false }), ctx({}, { stepFree: true }))).toBe(true);
  });
  it("nervous dog versus crowds, strangers, other dogs, noise", () => {
    expect(excluded(mk({ crowd: "busy" }), ctx({ crowds: "nervous" }))).toBe(true);
    expect(excluded(mk({ strangers: true }), ctx({ people: "nervous" }))).toBe(true);
    const v = eligibility(mk({ otherDogs: true }), ctx({ dogs: "nervous" }));
    expect(v.reasons).toContain("Your dog is nervous around other dogs.");
    expect(excluded(mk({ noise: "loud" }), ctx({ noiseSensitive: "yes" }))).toBe(true);
  });
  it("food, water, car, yard", () => {
    expect(
      excluded(mk({ food: true, dietNotes: "Small treats." }), ctx({ foodActivities: "no" })),
    ).toBe(true);
    expect(excluded(mk({ water: "near-water" }), ctx({ water: "avoids" }))).toBe(true);
    const swim = { water: "in-water", safety: ["Supervise closely."] };
    expect(excluded(mk(swim), ctx({ swims: "no" }))).toBe(true);
    const car = { transport: "car", requires: ["car"] };
    expect(excluded(mk(car), ctx({}, { hasCar: "no" }))).toBe(true);
    expect(excluded(mk(car), ctx({ carTravel: "no" }))).toBe(true);
    expect(excluded(mk({ space: "yard" }), ctx({ home: "apartment" }))).toBe(true);
    expect(excluded(mk({ space: "yard" }), ctx({ yard: "no" }))).toBe(true);
  });
  it("reservation is allowed", () => {
    const a = mk({ reservation: { needed: true, note: "Book a slot." } });
    expect(eligibility(a, ctx()).eligible).toBe(true);
  });
});

describe("unknown is never safe", () => {
  const asks = (a: Adventure, c: Ctx) => eligibility(a, c);
  it("asks instead of assuming", () => {
    const food = asks(mk({ food: true, dietNotes: "Small treats." }), ctx());
    expect(food.confirm).toEqual(["Does your dog do food activities?"]);
    expect(food.eligible).toBe(false);
    expect(asks(mk({ water: "in-water", safety: ["Supervise."] }), ctx()).confirm).toHaveLength(1);
    expect(asks(mk({ transport: "car", requires: ["car"] }), ctx()).confirm).toHaveLength(1);
    expect(asks(mk({ space: "yard" }), ctx()).confirm).toHaveLength(1);
    expect(asks(mk({ sizes: ["small"] }), ctx()).confirm).toHaveLength(1);
  });
  it("does not ask when the adventure has no such risk", () => {
    expect(asks(mk(), ctx()).confirm).toEqual([]);
  });
  it("held adventures are returned in held, never in ranked", () => {
    const risky = mk({ food: true, dietNotes: "Small treats." });
    const safe = mk();
    const r = rank([risky, safe], ctx(), {}, hist());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.ranked.map((x) => x.adventure.id)).toEqual([safe.id]);
      expect(r.held.map((x) => x.adventure.id)).toEqual([risky.id]);
      expect(r.held[0]?.confirm[0]).toMatch(/food/);
    }
  });
  it("answering the question moves it into ranked", () => {
    const risky = mk({ food: true, dietNotes: "Small treats." });
    const r = rank([risky], ctx({ foodActivities: "yes" }), {}, hist());
    expect(r.ok && r.ranked).toHaveLength(1);
  });
});

describe("breed is only a soft hint", () => {
  const lib = [
    mk({ activityTypes: ["scent-and-discovery"] }),
    mk(),
    mk({ space: "yard" }),
    mk({ sizes: ["small"] }),
  ];
  const ids = (r: ReturnType<typeof rank>) =>
    r.ok
      ? [...r.ranked.map((x) => x.adventure.id), ...r.held.map((x) => x.adventure.id)].sort()
      : [];
  it("never changes the eligible set", () => {
    const sets = ["Beagle", "Mixed", "Greyhound", "unknown", undefined].map((breed) =>
      ids(rank(lib, ctx(breed ? { breed } : {}), {}, hist(), { seed: "s" })),
    );
    for (const s of sets) expect(s).toEqual(sets[0]);
  });
  it("only nudges order, never lowers a score", () => {
    const scent = lib[0] as Adventure;
    const a = rank(lib, ctx({ breed: "Beagle" }), {}, hist(), { seed: "s" });
    const b = rank(lib, ctx({ breed: "Greyhound" }), {}, hist(), { seed: "s" });
    if (!a.ok || !b.ok) throw new Error("expected results");
    const sa = a.ranked.find((x) => x.adventure.id === scent.id)?.score ?? 0;
    const sb = b.ranked.find((x) => x.adventure.id === scent.id)?.score ?? 0;
    expect(sa).toBeGreaterThanOrEqual(sb);
    expect(sa - sb).toBeLessThan(1);
  });
  it("engine.ts has no breed-based eligibility", () => {
    const src = readFileSync("src/passport/engine.ts", "utf8");
    const start = src.indexOf("export function eligibility");
    const end = src.indexOf("// ---------- Session filters");
    expect(start).toBeGreaterThan(-1);
    expect(src.slice(start, end)).not.toMatch(/breed/i);
    expect(src).not.toMatch(/breed[^\n]*(reasons|confirm)\.push/i);
  });
});

describe("ranking behaviour", () => {
  it("uses real signals in plain words, without percentages", () => {
    const scent = mk({ activityTypes: ["scent-and-discovery"] });
    const r = rank(
      [scent],
      ctx({ favoriteTypes: ["scent-and-discovery"] }, { typicalBudget: 10 }),
      {},
      hist(),
    );
    if (!r.ok) throw new Error("expected ok");
    const why = r.ranked[0]?.why ?? [];
    expect(why).toContain("Matches your dog's love of scent games");
    expect(why.join(" ")).not.toMatch(/%|perfect/i);
  });
  it("likes rise, not-for-us falls, skipped falls, variety falls", () => {
    const a = mk();
    const b = mk();
    const score = (h: History, id: string) => {
      const r = rank([a, b], ctx(), {}, h, { seed: "z" });
      if (!r.ok) throw new Error("fail");
      return r.ranked.find((x) => x.adventure.id === id)?.score ?? 0;
    };
    const none = score(hist(), a.id);
    expect(score(hist({ feedback: { [a.id]: "liked" } }), a.id)).toBeGreaterThan(none);
    expect(score(hist({ feedback: { [a.id]: "not-for-us" } }), a.id)).toBeLessThan(none - 4);
    expect(score(hist({ skipped: new Set([a.id]) }), a.id)).toBeLessThan(none);
    expect(score(hist({ lastKeepsakeFamily: "certificate" }), a.id)).toBeLessThan(none);
  });
  it("is deterministic per seed", () => {
    const lib = Array.from({ length: 8 }, () => mk());
    const run = (seed: string) => JSON.stringify(rank(lib, ctx(), {}, hist(), { seed }));
    expect(run("x")).toBe(run("x"));
    expect(run("x")).not.toBe(run("y"));
  });
  it("hides completed adventures unless asked, or done-only", () => {
    const a = mk();
    const b = mk();
    const h = hist({ done: new Set([a.id]) });
    const ids = (r: ReturnType<typeof rank>) => (r.ok ? r.ranked.map((x) => x.adventure.id) : []);
    expect(ids(rank([a, b], ctx(), {}, h))).toEqual([b.id]);
    expect(ids(rank([a, b], ctx(), {}, h, { includeDone: true })).sort()).toEqual(
      [a.id, b.id].sort(),
    );
    expect(ids(rank([a, b], ctx(), { novelty: "done-only" }, h))).toEqual([a.id]);
  });
});

describe("no match", () => {
  it("none-eligible when Stage A leaves nothing, with no relax advice", () => {
    const r = rank([mk({ crowd: "busy" })], ctx({ crowds: "nervous" }), {}, hist());
    expect(r).toEqual({ ok: false, reason: "none-eligible", relax: [] });
  });
  it("filters-too-narrow lists session filters, most blocking first", () => {
    const lib = [
      mk({ minutesMin: 30, minutesMax: 30, costMin: 5, costMax: 5 }),
      mk({ minutesMin: 40, minutesMax: 40 }),
      mk({ minutesMin: 50, minutesMax: 50 }),
    ];
    const r = rank(lib, ctx(), { minutes: 5, budget: 1 }, hist());
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("filters-too-narrow");
      expect(r.relax).toEqual(["minutes", "budget"]);
    }
  });
  it("never suggests relaxing a Stage A rule, and filters never bypass it", () => {
    const risky = mk({ crowd: "busy" });
    const r = rank(
      [risky, mk({ minutesMin: 90, minutesMax: 90 })],
      ctx({ crowds: "nervous" }),
      { minutes: 10 },
      hist(),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.relax).toEqual(["minutes"]);
      expect(r.relax).not.toContain("crowds" as never);
    }
    // Even with no filters at all, the excluded adventure is never returned.
    const open = rank([risky, mk()], ctx({ crowds: "nervous" }), {}, hist());
    expect(open.ok && open.ranked.every((x) => x.adventure.id !== risky.id)).toBe(true);
  });
  it("all done and hidden suggests relaxing novelty", () => {
    const a = mk();
    const r = rank([a], ctx(), {}, hist({ done: new Set([a.id]) }));
    expect(r).toEqual({ ok: false, reason: "filters-too-narrow", relax: ["novelty"] });
  });
});
