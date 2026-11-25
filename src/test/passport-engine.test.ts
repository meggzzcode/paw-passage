import { describe, expect, it } from "vitest";
import { adventureSchema, validateLibrary, type Adventure } from "../passport/schema";
import { exclusions, rank } from "../passport/engine";
import {
  achievements,
  add,
  emptySave,
  has,
  merge,
  remove,
  thresholds,
  validateSave,
  members,
  type Save,
} from "../passport/progress";

const base = {
  id: "adv-aaaaa1",
  title: "The Great Toy Showdown",
  clue: "A tournament with one furry judge.",
  description: "Pit familiar toys against each other.",
  instructions: ["Pick four toys.", "Predict a winner, then play."],
  twist: "Predict the winner first.",
  prep: "none",
  supplies: [],
  minutesMin: 10,
  minutesMax: 25,
  costMin: 0,
  costMax: 0,
  setting: "indoor",
  environments: ["apartment"],
  lifeStages: ["puppy", "adult", "senior"],
  energy: "gentle",
  mobilityFriendly: true,
  crowd: "none",
  otherDogs: false,
  seasons: [],
  safety: ["Stop if your dog loses interest."],
  variations: [],
  memoryPrompt: "Who won?",
  keepsake: "certificate",
  collections: ["home"],
  stamps: ["playtime"],
  access: "free",
  status: "published",
  relatedGuides: [],
};
const mk = (o: Record<string, unknown>): Adventure => adventureSchema.parse({ ...base, ...o });

describe("adventure schema", () => {
  it("accepts a good adventure and rejects bad ones", () => {
    expect(mk({}).id).toBe("adv-aaaaa1");
    expect(() => mk({ id: "toy" })).toThrow();
    expect(() => mk({ safety: [] })).toThrow();
    expect(() => mk({ minutesMin: 30, minutesMax: 10 })).toThrow();
    expect(() => mk({ clue: "The Great Toy Showdown is here" })).toThrow();
  });
  it("flags duplicate ids and unknown references", () => {
    const e = validateLibrary([mk({}), mk({ collections: ["nope"] })], ["home"], ["playtime"]);
    expect(e.some((m) => m.includes("duplicate"))).toBe(true);
    expect(e.some((m) => m.includes("unknown collection"))).toBe(true);
  });
});

describe("suitability and ranking", () => {
  const lively = mk({
    id: "adv-bbbbb2",
    energy: "lively",
    mobilityFriendly: false,
    crowd: "busy",
    otherDogs: true,
    setting: "outdoor",
  });
  const gentle = mk({ id: "adv-aaaaa1" });
  it("hard exclusions apply and are never relaxed", () => {
    expect(exclusions(lively, { limitedMobility: true })).toContain("mobility");
    expect(exclusions(lively, { nervousAroundPeople: true, nervousAroundDogs: true })).toEqual([
      "crowds",
      "other dogs",
    ]);
    const r = rank([lively], { limitedMobility: true }, {});
    expect(r).toEqual({ ok: false, reason: "none-suitable", relax: [] });
  });
  it("explains narrow filters without bypassing safety", () => {
    const r = rank([gentle], {}, { minutesAvailable: 5 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.relax).toEqual(["time"]);
  });
  it("hides completed adventures unless asked and is deterministic per seed", () => {
    const lib = [gentle, mk({ id: "adv-ccccc3" })];
    const r1 = rank(lib, {}, {}, { done: new Set(["adv-aaaaa1"]) });
    expect(r1.ok && r1.ranked.map((x) => x.adventure.id)).toEqual(["adv-ccccc3"]);
    const a = rank(lib, {}, {}, { seed: "x" });
    const b = rank(lib, {}, {}, { seed: "x" });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
  it("does not show drafts", () => {
    expect(rank([mk({ status: "draft" })], {}, {}).ok).toBe(false);
  });
});

describe("progress and sync", () => {
  const lib = ["adv-aaaaa1", "adv-bbbbb2", "adv-ccccc3"].map((id, i) => ({
    id,
    stamps: i === 0 ? ["first"] : ["x"],
    collections: ["home"],
  }));
  const cols = { home: lib.map((l) => l.id) };
  const withDone = (s: Save, id: string, t: number): Save => ({ ...s, done: add(s.done, id, t) });

  it("repeat taps do not duplicate, undo removes, redo works", () => {
    let s = emptySave();
    s = withDone(withDone(s, "adv-aaaaa1", 10), "adv-aaaaa1", 20);
    expect(members(s.done)).toEqual(["adv-aaaaa1"]);
    s = { ...s, done: remove(s.done, "adv-aaaaa1", 30) };
    expect(has(s.done, "adv-aaaaa1")).toBe(false);
    s = withDone(s, "adv-aaaaa1", 40);
    expect(has(s.done, "adv-aaaaa1")).toBe(true);
    expect(achievements(s, lib, cols).count).toBe(1);
  });
  it("two devices merge without erasing each other, in any order", () => {
    const phone = withDone(emptySave(), "adv-bbbbb2", 100);
    const computer = withDone(emptySave(), "adv-aaaaa1", 90);
    const m1 = merge(phone, computer);
    const m2 = merge(computer, phone);
    expect(members(m1.done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
    expect(JSON.stringify(m1)).toBe(JSON.stringify(m2));
    expect(JSON.stringify(merge(m1, m1))).toBe(JSON.stringify(m1));
  });
  it("an undo on one device survives a stale copy on the other", () => {
    const start = withDone(emptySave(), "adv-aaaaa1", 10);
    const undone: Save = { ...start, done: remove(start.done, "adv-aaaaa1", 50) };
    expect(has(merge(undone, start).done, "adv-aaaaa1")).toBe(false);
  });
  it("achievements are derived and capped to the library size", () => {
    expect(thresholds(3)).toEqual([1]);
    let s = emptySave();
    for (const [i, l] of lib.entries()) s = withDone(s, l.id, i + 1);
    const e = achievements(s, lib, cols);
    expect(e.count).toBe(3);
    expect(e.milestones).toEqual([1]);
    expect(e.collectionsComplete).toEqual(["home"]);
    expect(e.stamps).toEqual(["first", "x"]);
    expect(e.next).toBeNull();
  });
  it("rejects malformed or oversized records", () => {
    expect(validateSave(emptySave())).toBeNull();
    expect(validateSave({ ...emptySave(), v: 2 })).toBe("unknown version");
    const bad = emptySave();
    bad.done.added["../etc"] = 1;
    expect(validateSave(bad)).toBe("bad id");
    const big = emptySave();
    big.memories["adv-aaaaa1"] = { text: "x".repeat(300), at: 1 };
    expect(validateSave(big)).toBe("memory too long");
  });
});
