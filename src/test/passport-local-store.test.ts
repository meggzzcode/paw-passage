import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  _resetForTests,
  clearLocal,
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
import { members } from "../passport/progress";
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
