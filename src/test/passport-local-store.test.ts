import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  _resetForTests,
  addToCustomCollection,
  clearLocal,
  deleteCustomCollection,
  newCollection,
  removeFromCustomCollection,
  renameCustomCollection,
  reorderCustomCollection,
  repeatAdventure,
  setFeedback,
  setOwner,
  updateSmartFilters,
  completeAdventure,
  exportJson,
  favorite,
  getSave,
  getSaveState,
  importJson,
  setMemory,
  setProfile,
  STORAGE_KEY,
  undoCompletion,
} from "../passport/local-store";
import { listCollections, members } from "../passport/progress";
import { track } from "../passport/events";

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});

describe("local store", () => {
  it("persists across a reload and ignores repeat taps", () => {
    completeAdventure("adv-aaaaa1", 10);
    completeAdventure("adv-aaaaa1", 20);
    _resetForTests();
    expect(members(getSave().done)).toEqual(["adv-aaaaa1"]);
  });
  it("undo then redo", () => {
    completeAdventure("adv-aaaaa1", 10);
    undoCompletion("adv-aaaaa1", 20);
    expect(members(getSave().done)).toEqual([]);
    completeAdventure("adv-aaaaa1", 30);
    expect(members(getSave().done)).toEqual(["adv-aaaaa1"]);
  });
  it("trims memories and keeps profile edits", () => {
    setMemory("adv-aaaaa1", "x".repeat(500), 5);
    expect(getSave().memories["adv-aaaaa1"]?.text).toHaveLength(280);
    setProfile({ name: "Juno" }, 6);
    setProfile({ lifeStage: "senior" }, 7);
    expect(getSave().profile.data).toEqual({ name: "Juno", lifeStage: "senior" });
  });
  it("tells the truth when storage is blocked", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("full");
    });
    completeAdventure("adv-aaaaa1", 1);
    expect(getSaveState()).toBe("memory-only");
    expect(members(getSave().done)).toEqual(["adv-aaaaa1"]);
    spy.mockRestore();
  });
  it("recovers from corrupt storage", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(members(getSave().done)).toEqual([]);
  });
  it("import merges, rejects bad files, export round-trips, clear resets", () => {
    completeAdventure("adv-aaaaa1", 10);
    favorite("adv-aaaaa1", 11);
    const file = exportJson();
    clearLocal();
    expect(members(getSave().done)).toEqual([]);
    completeAdventure("adv-bbbbb2", 50);
    expect(importJson(file)).toEqual({ ok: true });
    expect(members(getSave().done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
    expect(importJson("nope").ok).toBe(false);
    expect(importJson('{"v":1,"done":{"added":{"../x":1},"removed":{}}}').ok).toBe(false);
  });
});

describe("local store v2", () => {
  const COL = "col-abcd1234";
  it("upgrades a stored v1 save on read and keeps its progress", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        rev: 0,
        profile: { data: { name: "Juno", nervousAroundDogs: true }, at: 1 },
        done: { added: { "adv-aaaaa1": 5 }, removed: {} },
        favorites: { added: {}, removed: {} },
        saved: { added: {}, removed: {} },
        memories: {},
        repeats: {},
      }),
    );
    expect(getSave().v).toBe(2);
    expect(members(getSave().done)).toEqual(["adv-aaaaa1"]);
    expect(getSave().profile.data).toEqual({ name: "Juno", dogs: "nervous" });
  });
  it("collections persist across a reload and every op is idempotent", () => {
    newCollection({ id: COL, kind: "handpicked", name: "Rainy", ids: ["adv-aaaaa1"] }, 1);
    newCollection({ id: COL, kind: "handpicked", name: "Again", ids: [] }, 2);
    addToCustomCollection(COL, "adv-bbbbb2", 3);
    addToCustomCollection(COL, "adv-bbbbb2", 4);
    addToCustomCollection(COL, "adv-ccccc3", 5);
    reorderCustomCollection(COL, ["adv-ccccc3"], 6);
    renameCustomCollection(COL, "Cozy", 7);
    removeFromCustomCollection(COL, "adv-aaaaa1", 8);
    removeFromCustomCollection(COL, "adv-aaaaa1", 9);
    _resetForTests();
    expect(listCollections(getSave())).toEqual([
      { id: COL, kind: "handpicked", name: "Cozy", ids: ["adv-ccccc3", "adv-bbbbb2"] },
    ]);
    deleteCustomCollection(COL, 10);
    deleteCustomCollection(COL, 11);
    _resetForTests();
    expect(listCollections(getSave())).toEqual([]);
  });
  it("smart filters, owner, feedback and repeats", () => {
    newCollection({ id: COL, kind: "smart", name: "Quick", filters: { minutes: 10 } }, 1);
    updateSmartFilters(COL, { minutes: 20, quiet: true }, 2);
    setOwner({ mobility: "seated" }, 3);
    setOwner({ stepFree: true }, 4);
    setFeedback("adv-aaaaa1", "liked", 5);
    setFeedback("adv-aaaaa1", "not-for-us", 6);
    repeatAdventure("adv-aaaaa1");
    repeatAdventure("adv-aaaaa1");
    _resetForTests();
    const s = getSave();
    expect(listCollections(s)[0]).toMatchObject({ filters: { minutes: 20, quiet: true } });
    expect(s.owner.data).toEqual({ mobility: "seated", stepFree: true });
    expect(s.feedback["adv-aaaaa1"]?.value).toBe("not-for-us");
    expect(s.repeats["adv-aaaaa1"]).toBe(2);
    expect(members(s.done)).toEqual([]);
    setFeedback("adv-aaaaa1", null);
    expect(getSave().feedback).toEqual({});
  });
  it("is honest and does not throw when storage is blocked", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() =>
      newCollection({ id: COL, kind: "handpicked", name: "X", ids: [] }, 1),
    ).not.toThrow();
    expect(getSaveState()).toBe("memory-only");
    expect(listCollections(getSave())).toHaveLength(1);
    spy.mockRestore();
  });
  it("export and import round-trip collections; v1 files import; bad files are refused", () => {
    newCollection({ id: COL, kind: "handpicked", name: "Rainy", ids: ["adv-aaaaa1"] }, 1);
    const file = exportJson();
    clearLocal();
    expect(importJson(file)).toEqual({ ok: true });
    expect(listCollections(getSave())).toHaveLength(1);
    const v1 = {
      v: 1,
      rev: 3,
      profile: { data: {}, at: 0 },
      done: { added: { "adv-bbbbb2": 1 }, removed: {} },
      favorites: { added: {}, removed: {} },
      saved: { added: {}, removed: {} },
      memories: {},
      repeats: {},
    };
    expect(importJson(JSON.stringify(v1))).toEqual({ ok: true });
    expect(members(getSave().done)).toEqual(["adv-bbbbb2"]);
    expect(getSave().rev).toBe(0);
    expect(importJson(JSON.stringify({ ...JSON.parse(file), extra: true })).ok).toBe(false);
    expect(importJson(JSON.stringify({ v: 2 })).ok).toBe(false);
  });
});

vi.mock("@/config/site", async (orig) => {
  const mod = await orig<typeof import("@/config/site")>();
  return { ...mod, site: { ...mod.site, ga4MeasurementId: "G-TEST" } };
});

describe("analytics events", () => {
  it("sends named events with slug-like fields only and drops free text", () => {
    const gtag = vi.fn();
    (window as unknown as { gtag: unknown }).gtag = gtag;
    expect(
      track("adventure_completed", { adventure: "adv-aaaaa1", name: "Juno Smith", n: 3 }),
    ).toBe(true);
    const [, event, params] = gtag.mock.calls[0]!;
    expect(event).toBe("pp_adventure_completed");
    expect(params).toMatchObject({ adventure: "adv-aaaaa1", n: 3 });
    expect(JSON.stringify(params)).not.toContain("Juno");
    expect(track("not_an_event" as never)).toBe(false);
  });
  it("reports false when gtag has not loaded", () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(track("unlock_viewed")).toBe(false);
  });
});
