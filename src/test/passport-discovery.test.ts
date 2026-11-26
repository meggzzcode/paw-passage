import { describe, expect, it } from "vitest";
import { adventureSchema, type Adventure } from "../passport/schema";
import type { CustomCollection } from "../passport/profile";
import {
  FILTER_LABELS,
  describeFilters,
  matchesFilters,
  pickSurprise,
  smartMembers,
  type Ctx,
  type History,
} from "../passport/engine";

const base = {
  schema: 2,
  title: "Sniff Safari",
  clue: "Somewhere a nose will lead the way.",
  reveal: "A gentle scent trail.",
  objective: "Follow a scent trail.",
  instructions: ["Hide a treat.", "Let your dog sniff.", "Celebrate."],
  twist: "Change the route.",
  completion: "When the trail ends.",
  memoryPrompt: "What did the nose find?",
  minutesMin: 10,
  minutesMax: 20,
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
  activityTypes: ["scent-and-discovery"],
  collections: ["home"],
  keepsake: { family: "certificate", theme: "explorer", headline: "EXPLORER" },
  access: "free",
  status: "published",
};
let n = 0;
const mk = (o: Record<string, unknown> = {}): Adventure =>
  adventureSchema.parse({ ...base, id: `adv-d${String(++n).padStart(5, "0")}`, ...o });
const ctx = (dog: Ctx["dog"] = {}, owner: Ctx["owner"] = {}): Ctx => ({
  dog,
  owner,
  unlocked: false,
});
const hist = (o: Partial<History> = {}): History => ({
  done: new Set(),
  favorites: new Set(),
  skipped: new Set(),
  ...o,
});
const H = { done: new Set<string>(), favorites: new Set<string>() };

describe("matchesFilters", () => {
  const ok = (o: Record<string, unknown>, f: Parameters<typeof matchesFilters>[1], h = H) =>
    matchesFilters(mk(o), f, h);
  it("empty filters match everything", () => {
    expect(ok({}, {})).toBe(true);
    expect(ok({}, { types: [], energy: [], places: [], haveSupplies: [] })).toBe(true);
  });
  it("minutes, budget", () => {
    expect(ok({ minutesMin: 20, minutesMax: 20 }, { minutes: 20 })).toBe(true);
    expect(ok({ minutesMin: 21, minutesMax: 21 }, { minutes: 20 })).toBe(false);
    expect(ok({ costMin: 5, costMax: 5 }, { budget: 5 })).toBe(true);
    expect(ok({ costMin: 6, costMax: 6 }, { budget: 5 })).toBe(false);
  });
  it("setting", () => {
    expect(ok({ setting: "indoor" }, { setting: "outdoor" })).toBe(false);
    expect(ok({ setting: "either" }, { setting: "outdoor" })).toBe(true);
  });
  it("types and energy are multi-select (any overlap)", () => {
    expect(ok({ activityTypes: ["travel", "water"] }, { types: ["water", "photography"] })).toBe(
      true,
    );
    expect(ok({ activityTypes: ["travel"] }, { types: ["water"] })).toBe(false);
    expect(ok({ energy: "lively" }, { energy: ["gentle", "lively"] })).toBe(true);
    expect(ok({ energy: "lively" }, { energy: ["gentle"] })).toBe(false);
  });
  it("prep is an at-most ordering", () => {
    expect(ok({ prep: "none" }, { prep: "light" })).toBe(true);
    expect(ok({ prep: "some" }, { prep: "light" })).toBe(false);
    expect(ok({ prep: "light" }, { prep: "none" })).toBe(false);
  });
  it("haveSupplies needs every requirement in the list", () => {
    expect(
      ok({ requires: ["toys", "treats"] }, { haveSupplies: ["toys", "treats", "blanket"] }),
    ).toBe(true);
    expect(ok({ requires: ["toys", "treats"] }, { haveSupplies: ["toys"] })).toBe(false);
    expect(ok({ requires: [] }, { haveSupplies: ["toys"] })).toBe(true);
  });
  it("transport, places, season, weather", () => {
    expect(ok({ transport: "car", requires: ["car"] }, { transport: "none-or-walk" })).toBe(false);
    expect(ok({ transport: "walkable" }, { transport: "none-or-walk" })).toBe(true);
    expect(ok({ places: ["beach", "city"] }, { places: ["city"] })).toBe(true);
    expect(ok({ places: ["beach"] }, { places: ["city"] })).toBe(false);
    expect(ok({ seasons: [] }, { season: "winter" })).toBe(true);
    expect(ok({ seasons: ["summer"] }, { season: "winter" })).toBe(false);
    expect(ok({ avoidWeather: ["rain"] }, { weather: "rain" })).toBe(false);
    expect(ok({ avoidWeather: ["heat"] }, { weather: "rain" })).toBe(true);
  });
  it("foodFree, quiet, collection", () => {
    expect(ok({ food: true, dietNotes: "Small treats." }, { foodFree: true })).toBe(false);
    expect(ok({ noise: "some" }, { quiet: true })).toBe(false);
    expect(ok({ collections: ["home", "rainy"] }, { collection: "rainy" })).toBe(true);
    expect(ok({ collections: ["home"] }, { collection: "rainy" })).toBe(false);
  });
  it("novelty and favorites", () => {
    const a = mk();
    const done = { done: new Set([a.id]), favorites: new Set<string>() };
    expect(matchesFilters(a, { novelty: "new-only" }, done)).toBe(false);
    expect(matchesFilters(a, { novelty: "done-only" }, done)).toBe(true);
    expect(matchesFilters(a, { novelty: "done-only" }, H)).toBe(false);
    expect(matchesFilters(a, { novelty: "any" }, done)).toBe(true);
    expect(matchesFilters(a, { favoritesOnly: true }, H)).toBe(false);
    expect(
      matchesFilters(a, { favoritesOnly: true }, { done: H.done, favorites: new Set([a.id]) }),
    ).toBe(true);
  });
  it("filters combine with AND", () => {
    const a = mk({ minutesMin: 10, setting: "outdoor", energy: "lively" });
    expect(matchesFilters(a, { minutes: 15, setting: "outdoor", energy: ["lively"] }, H)).toBe(
      true,
    );
    expect(matchesFilters(a, { minutes: 15, setting: "outdoor", energy: ["gentle"] }, H)).toBe(
      false,
    );
  });
});

describe("pickSurprise", () => {
  const a = mk({ collections: ["home"] });
  const b = mk({ collections: ["beach"] });
  const c = mk({ collections: ["beach"] });
  const lib = [a, b, c];
  const pick = (
    scope: Parameters<typeof pickSurprise>[1],
    h = hist(),
    custom: CustomCollection[] = [],
    seed = "s",
  ) => pickSurprise(lib, scope, ctx(), {}, h, custom, { seed });

  it("respects curated scope", () => {
    for (let i = 0; i < 10; i++) {
      const p = pick({ kind: "curated", slug: "beach" }, hist(), [], `seed${i}`);
      expect([b.id, c.id]).toContain(p?.id);
    }
    expect(pick({ kind: "curated", slug: "nope" })).toBeNull();
  });
  it("respects favorites and done scopes", () => {
    expect(pick({ kind: "favorites" })).toBeNull();
    expect(pick({ kind: "favorites" }, hist({ favorites: new Set([a.id]) }))?.id).toBe(a.id);
    expect(pick({ kind: "done" })).toBeNull();
    expect(pick({ kind: "done" }, hist({ done: new Set([c.id]) }))?.id).toBe(c.id);
  });
  it("respects handpicked and smart custom scopes", () => {
    const hand: CustomCollection = {
      id: "col-aaaaaaaa",
      kind: "handpicked",
      name: "Mine",
      ids: [c.id],
    };
    expect(pick({ kind: "custom", id: hand.id }, hist(), [hand])?.id).toBe(c.id);
    const smart: CustomCollection = {
      id: "col-bbbbbbbb",
      kind: "smart",
      name: "Beach",
      filters: { collection: "beach" },
    };
    for (let i = 0; i < 10; i++)
      expect([b.id, c.id]).toContain(
        pick({ kind: "custom", id: smart.id }, hist(), [smart], `k${i}`)?.id,
      );
    expect(pick({ kind: "custom", id: "col-zzzzzzzz" }, hist(), [])).toBeNull();
  });
  it("avoids skipped adventures", () => {
    for (let i = 0; i < 12; i++) {
      const p = pick({ kind: "all" }, hist({ skipped: new Set([a.id, b.id]) }), [], `q${i}`);
      expect(p?.id).toBe(c.id);
    }
    expect(pick({ kind: "all" }, hist({ skipped: new Set([a.id, b.id, c.id]) }))).toBeNull();
  });
  it("prefers uncompleted unless includeDone", () => {
    const h = hist({ done: new Set([a.id, b.id]) });
    for (let i = 0; i < 10; i++) expect(pick({ kind: "all" }, h, [], `d${i}`)?.id).toBe(c.id);
  });
  it("always applies Stage A first", () => {
    const risky = mk({ crowd: "busy" });
    const p = pickSurprise([risky], { kind: "all" }, ctx({ crowds: "nervous" }), {}, hist(), []);
    expect(p).toBeNull();
    const held = mk({ food: true, dietNotes: "Small treats." });
    expect(pickSurprise([held], { kind: "all" }, ctx(), {}, hist(), [])).toBeNull();
  });
  it("is deterministic per seed and varies across seeds", () => {
    const big = Array.from({ length: 12 }, () => mk());
    const run = (seed: string) =>
      pickSurprise(big, { kind: "all" }, ctx(), {}, hist(), [], { seed })?.id;
    expect(run("one")).toBe(run("one"));
    const seen = new Set(Array.from({ length: 30 }, (_, i) => run(`s${i}`)));
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe("smart collections", () => {
  it("re-evaluate when the profile changes", () => {
    const quiet = mk({ noise: "quiet" });
    const loud = mk({ noise: "loud" });
    const c = { id: "col-cccccccc", kind: "smart", name: "All", filters: {} } as Extract<
      CustomCollection,
      { kind: "smart" }
    >;
    const ids = (cx: Ctx) => smartMembers([quiet, loud], c, cx, hist()).map((x) => x.id);
    expect(ids(ctx())).toEqual([quiet.id, loud.id]);
    expect(ids(ctx({ noiseSensitive: "yes" }))).toEqual([quiet.id]);
  });
  it("re-evaluate when history and filters change", () => {
    const a = mk({ places: ["beach"] });
    const b = mk({ places: ["city"] });
    const c = {
      id: "col-dddddddd",
      kind: "smart",
      name: "Beach",
      filters: { places: ["beach"] },
    } as Extract<CustomCollection, { kind: "smart" }>;
    expect(smartMembers([a, b], c, ctx(), hist()).map((x) => x.id)).toEqual([a.id]);
    const fav = { ...c, filters: { favoritesOnly: true } };
    expect(
      smartMembers([a, b], fav, ctx(), hist({ favorites: new Set([b.id]) })).map((x) => x.id),
    ).toEqual([b.id]);
  });
  it("never includes held adventures", () => {
    const held = mk({ space: "yard" });
    const c = { id: "col-eeeeeeee", kind: "smart", name: "x", filters: {} } as Extract<
      CustomCollection,
      { kind: "smart" }
    >;
    expect(smartMembers([held], c, ctx(), hist())).toEqual([]);
    expect(smartMembers([held], c, ctx({ yard: "yes" }), hist())).toHaveLength(1);
  });
});

describe("describeFilters and labels", () => {
  it("gives readable phrases", () => {
    const out = describeFilters({
      minutes: 30,
      budget: 10,
      setting: "indoor",
      quiet: true,
      prep: "none",
      transport: "none-or-walk",
      novelty: "new-only",
      types: ["scent-and-discovery"],
    });
    expect(out).toEqual(
      expect.arrayContaining([
        "Fits in 30 minutes",
        "Up to $10",
        "Indoors",
        "Quiet",
        "No prep",
        "No car needed",
        "Not done yet",
      ]),
    );
    expect(out.join(" ")).toMatch(/scent games/);
  });
  it("is empty for no preference", () => {
    expect(describeFilters({})).toEqual([]);
    expect(describeFilters({ novelty: "any", transport: "any", types: [] })).toEqual([]);
  });
  it("has a label for every filter field", () => {
    expect(Object.keys(FILTER_LABELS)).toHaveLength(16);
    for (const v of Object.values(FILTER_LABELS)) expect(v.length).toBeGreaterThan(2);
  });

  it("never draws a completed adventure unless repeats are requested", () => {
    const one = mk({ id: "adv-aaaaa1" });
    const done = hist({ done: new Set(["adv-aaaaa1"]) });
    expect(pickSurprise([one], { kind: "all" }, ctx(), {}, done, [], { seed: "x" })).toBeNull();
    expect(
      pickSurprise([one], { kind: "all" }, ctx(), {}, done, [], { seed: "x", includeDone: true }),
    ).not.toBeNull();
  });
  it("different seeds can give different picks", () => {
    const lib = ["adv-aaaaa1", "adv-bbbbb2", "adv-ccccc3", "adv-ddddd4", "adv-eeeee5"].map((id) =>
      mk({ id }),
    );
    const picks = new Set(
      Array.from(
        { length: 20 },
        (_, i) => pickSurprise(lib, { kind: "all" }, ctx(), {}, hist(), [], { seed: `s${i}` })?.id,
      ),
    );
    expect(picks.size).toBeGreaterThan(1);
  });
});
