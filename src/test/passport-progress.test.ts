import { describe, expect, it } from "vitest";
import {
  achievements,
  add,
  addToCollection,
  collectionProgress,
  createCollection,
  deleteCollection,
  emptySave,
  has,
  listCollections,
  members,
  merge,
  migrate,
  newCollectionId,
  recordRepeat,
  remove,
  removeFromCollection,
  renameCollection,
  reorderCollection,
  setSmartFilters,
  thresholds,
  validateSave,
  type Save,
} from "../passport/progress";

const A = "adv-aaaaa1";
const B = "adv-bbbbb2";
const C = "adv-ccccc3";
const D = "adv-ddddd4";
const COL = "col-abcd1234";
const hand = (ids: string[] = [], id = COL) => ({
  id,
  kind: "handpicked" as const,
  name: "Rainy days",
  ids,
});
const same = (x: unknown, y: unknown) => expect(JSON.stringify(x)).toBe(JSON.stringify(y));
const mine = (s: Save) => listCollections(s).find((c) => c.id === COL);
const withDone = (s: Save, id: string, t: number): Save => ({ ...s, done: add(s.done, id, t) });

describe("sets, repeats, achievements", () => {
  const lib = [A, B, C].map((id, i) => ({
    id,
    stamps: i === 0 ? ["first"] : ["x"],
    collections: ["home"],
  }));
  const cols = { home: [A, B, C] };
  it("repeat taps do not duplicate, undo removes, redo works", () => {
    let s = withDone(withDone(emptySave(), A, 10), A, 20);
    expect(members(s.done)).toEqual([A]);
    s = { ...s, done: remove(s.done, A, 30) };
    expect(has(s.done, A)).toBe(false);
    s = withDone(s, A, 40);
    expect(achievements(s, lib, cols).count).toBe(1);
  });
  it("skipping, 'not for us', saving or favoriting never earns a stamp or milestone", () => {
    const s: Save = {
      ...emptySave(),
      favorites: add(emptySave().favorites, A, 5),
      saved: add(emptySave().saved, B, 5),
      feedback: { [C]: { value: "not-for-us", at: 5 } },
    };
    const e = achievements(s, lib, cols);
    expect(e.count).toBe(0);
    expect(e.stamps).toEqual([]);
    expect(e.milestones).toEqual([]);
    expect(e.collectionsComplete).toEqual([]);
  });
  it("repeat memories never count as new adventures", () => {
    let s = recordRepeat(recordRepeat(emptySave(), A), A);
    expect(s.repeats[A]).toBe(2);
    expect(achievements(s, lib, cols).count).toBe(0);
    s = recordRepeat(s, "../bad");
    expect(Object.keys(s.repeats)).toEqual([A]);
  });
  it("achievements are derived and capped; custom collections are not passed in", () => {
    expect(thresholds(3)).toEqual([1]);
    let s = emptySave();
    for (const [i, l] of lib.entries()) s = withDone(s, l.id, i + 1);
    const e = achievements(s, lib, cols);
    expect(e.count).toBe(3);
    expect(e.collectionsComplete).toEqual(["home"]);
    expect(e.next).toBeNull();
  });
});

describe("v1 to v2 migration", () => {
  const v1 = {
    v: 1,
    rev: 4,
    profile: {
      data: {
        name: "Juno",
        lifeStage: "senior",
        limitedMobility: true,
        nervousAroundPeople: true,
        nervousAroundDogs: false,
        environment: "home",
        hacked: 1,
      },
      at: 9,
    },
    done: { added: { [A]: 5 }, removed: {} },
    favorites: { added: {}, removed: {} },
    saved: { added: { [B]: 6 }, removed: {} },
    memories: { [A]: { text: "Fun", at: 7 } },
    repeats: { [A]: 2 },
  };
  it("keeps progress and maps profile keys", () => {
    const s = migrate(v1)!;
    expect(s.v).toBe(2);
    expect(s.rev).toBe(4);
    expect(members(s.done)).toEqual([A]);
    expect(members(s.saved)).toEqual([B]);
    expect(s.memories[A]?.text).toBe("Fun");
    expect(s.repeats[A]).toBe(2);
    expect(s.profile.data).toEqual({
      name: "Juno",
      lifeStage: "senior",
      limitedMobility: true,
      people: "nervous",
    });
    expect(s.profile.at).toBe(9);
    expect(s.collections).toEqual({});
    expect(validateSave(s)).toBeNull();
  });
  it("returns null for garbage and passes v2 through", () => {
    for (const bad of [
      null,
      5,
      "x",
      [],
      {},
      { v: 3 },
      { ...v1, done: 1 },
      { ...v1, done: { added: { "../x": 1 }, removed: {} } },
    ])
      expect(migrate(bad)).toBeNull();
    const s = emptySave();
    expect(migrate(s)).toBe(s);
    expect(migrate({ ...s, extra: 1 })).toBeNull();
  });
});

describe("collection operations", () => {
  it("creates handpicked and smart collections, listing them in a stable order", () => {
    let s = createCollection(emptySave(), hand([A, B]), 10);
    s = createCollection(
      s,
      { id: "col-zzzz0000", kind: "smart", name: "Quick", filters: { minutes: 15, quiet: true } },
      20,
    );
    const l = listCollections(s);
    expect(l.map((c) => c.id)).toEqual([COL, "col-zzzz0000"]);
    expect(l[0]).toEqual({ id: COL, kind: "handpicked", name: "Rainy days", ids: [A, B] });
    expect(l[1]).toEqual({
      id: "col-zzzz0000",
      kind: "smart",
      name: "Quick",
      filters: { minutes: 15, quiet: true },
    });
    expect(validateSave(s)).toBeNull();
  });
  it("create is idempotent and rejects bad input", () => {
    const s = createCollection(emptySave(), hand([A]), 10);
    expect(createCollection(s, hand([B]), 20)).toBe(s);
    expect(createCollection(emptySave(), hand([], "bad"), 1)).toEqual(emptySave());
    const e = emptySave();
    expect(createCollection(e, { ...hand(), name: "   " }, 1)).toBe(e);
    expect(createCollection(e, { ...hand(), name: "x".repeat(41) }, 1)).toBe(e);
    expect(
      createCollection(e, { id: COL, kind: "smart", name: "s", filters: { bogus: 1 } as never }, 1),
    ).toBe(e);
  });
  it("rename, add, remove are idempotent and undoable", () => {
    let s = createCollection(emptySave(), hand([A]), 10);
    const r = renameCollection(s, COL, "  Cozy   days ", 20);
    expect(mine(r)?.name).toBe("Cozy days");
    expect(renameCollection(r, COL, "Cozy days", 30)).toBe(r);
    s = addToCollection(s, COL, B, 30);
    expect(addToCollection(s, COL, B, 31)).toBe(s);
    expect(mine(s)).toMatchObject({ ids: [A, B] });
    const removed = removeFromCollection(s, COL, B, 40);
    expect(removeFromCollection(removed, COL, B, 41)).toBe(removed);
    expect(mine(removed)).toMatchObject({ ids: [A] });
    expect(mine(addToCollection(removed, COL, B, 50))).toMatchObject({ ids: [A, B] }); // undo
  });
  it("only handpicked collections take items, only smart take filters", () => {
    const sm = createCollection(emptySave(), { id: COL, kind: "smart", name: "S", filters: {} }, 1);
    expect(addToCollection(sm, COL, A, 2)).toBe(sm);
    const h = createCollection(emptySave(), hand(), 1);
    expect(setSmartFilters(h, COL, { quiet: true }, 2)).toBe(h);
    const f = setSmartFilters(sm, COL, { quiet: true, types: ["nonsense"] as never }, 2);
    expect(f).toBe(sm); // unknown filter values are refused
    const ok = setSmartFilters(sm, COL, { quiet: true, types: ["travel"] }, 2);
    expect(mine(ok)).toMatchObject({ filters: { quiet: true, types: ["travel"] } });
    expect(setSmartFilters(ok, COL, { types: ["travel"], quiet: true }, 3)).toBe(ok);
  });
  it("reorders; unknown and removed ids are ignored; missing ids are appended", () => {
    let s = createCollection(emptySave(), hand([A, B, C]), 10);
    s = reorderCollection(s, COL, [C, "adv-zzzzzz", A], 20);
    expect(mine(s)).toMatchObject({ ids: [C, A, B] });
    expect(reorderCollection(s, COL, [C, A, B], 30)).toBe(s);
    s = removeFromCollection(s, COL, C, 40);
    expect(mine(s)).toMatchObject({ ids: [A, B] });
  });
  it("delete hides the collection but never touches adventures or completions", () => {
    let s = withDone(createCollection(emptySave(), hand([A]), 10), A, 11);
    s = deleteCollection(s, COL, 20);
    expect(listCollections(s)).toEqual([]);
    expect(deleteCollection(s, COL, 30)).toBe(s);
    expect(members(s.done)).toEqual([A]);
    expect(addToCollection(s, COL, B, 40)).toBe(s); // cannot edit a deleted collection
  });
  it("progress counts completions for handpicked and smart members", () => {
    let s = createCollection(emptySave(), hand([A, B, C]), 1);
    s = withDone(withDone(s, A, 2), D, 3);
    const c = mine(s)!;
    expect(collectionProgress(s, c, [A, B, C])).toEqual({ done: 1, total: 3 });
    const smart = { id: "col-smart000", kind: "smart" as const, name: "S", filters: {} };
    expect(collectionProgress(s, smart, [A, D, D])).toEqual({ done: 2, total: 2 });
    expect(collectionProgress(s, smart, [])).toEqual({ done: 0, total: 0 });
  });
  it("enforces limits: 30 collections, 100 items", () => {
    let s = emptySave();
    for (let i = 0; i < 35; i++)
      s = createCollection(s, hand([], `col-${String(i).padStart(8, "0")}`), i + 1);
    expect(listCollections(s)).toHaveLength(30);
    let t = createCollection(emptySave(), hand(), 1);
    for (let i = 0; i < 105; i++)
      t = addToCollection(t, COL, `adv-${String(i).padStart(6, "0")}`, i + 2);
    expect((mine(t) as { ids: string[] }).ids).toHaveLength(100);
    expect(validateSave(t)).toBeNull();
  });
  it("newCollectionId has the contract shape", () => {
    for (let i = 0; i < 20; i++) expect(newCollectionId()).toMatch(/^col-[a-z0-9]{8}$/);
  });
});

describe("two-device merge", () => {
  const base = () => createCollection(emptySave(), hand([A]), 10);
  const both = (x: Save, y: Save) => {
    const m1 = merge(x, y);
    same(m1, merge(y, x));
    same(merge(m1, m1), m1);
    return m1;
  };
  it("both devices add different items: nothing is lost", () => {
    const phone = addToCollection(base(), COL, B, 100);
    const laptop = addToCollection(base(), COL, C, 90);
    expect(mine(both(phone, laptop))).toMatchObject({ ids: [A, C, B] });
  });
  it("rename on one, add on the other", () => {
    const phone = renameCollection(base(), COL, "Wet walks", 100);
    const laptop = addToCollection(base(), COL, B, 90);
    expect(mine(both(phone, laptop))).toMatchObject({ name: "Wet walks", ids: [A, B] });
  });
  it("renames: newest wins; exact ties are deterministic", () => {
    const x = renameCollection(base(), COL, "One", 100);
    const y = renameCollection(base(), COL, "Two", 100);
    const m = both(x, y);
    expect(mine(m)?.name).toBe(mine(merge(y, x))?.name);
    expect(mine(both(renameCollection(base(), COL, "Old", 50), x))?.name).toBe("One");
  });
  it("delete on one device beats an older edit on the other", () => {
    const deleted = deleteCollection(base(), COL, 100);
    const stale = addToCollection(base(), COL, B, 50);
    expect(listCollections(both(deleted, stale))).toEqual([]);
  });
  it("an edit newer than the delete brings the collection back, with everything in it", () => {
    const deleted = deleteCollection(base(), COL, 100);
    const newer = addToCollection(base(), COL, B, 200);
    expect(mine(both(deleted, newer))).toMatchObject({ ids: [A, B] });
  });
  it("remove on one device and re-add older on the other: newest action wins", () => {
    const start = addToCollection(base(), COL, B, 20);
    const removed = removeFromCollection(start, COL, B, 100);
    const stale = addToCollection(start, COL, C, 60);
    expect(mine(both(removed, stale))).toMatchObject({ ids: [A, C] });
  });
  it("reorder conflicts resolve by last write; new items from the other device are appended", () => {
    const start = addToCollection(addToCollection(base(), COL, B, 20), COL, C, 21);
    const phone = reorderCollection(start, COL, [C, B, A], 100);
    const laptop = reorderCollection(start, COL, [B, A, C], 200);
    const laptopAdds = addToCollection(laptop, COL, D, 210);
    expect(mine(both(phone, laptop))).toMatchObject({ ids: [B, A, C] });
    expect(mine(both(phone, laptopAdds))).toMatchObject({ ids: [B, A, C, D] });
    const phoneAdds = addToCollection(phone, COL, D, 300);
    expect(mine(both(phoneAdds, laptop))).toMatchObject({ ids: [B, A, C, D] });
  });
  it("is associative across three devices and with other fields", () => {
    const a = withDone(addToCollection(base(), COL, B, 100), A, 5);
    const b = renameCollection(addToCollection(base(), COL, C, 110), COL, "Z", 111);
    const c = deleteCollection(
      createCollection(emptySave(), hand([D], "col-other000"), 1),
      "col-other000",
      2,
    );
    same(merge(merge(a, b), c), merge(a, merge(b, c)));
    same(merge(merge(c, a), b), merge(b, merge(a, c)));
  });
  it("merged results stay within limits", () => {
    let x = createCollection(emptySave(), hand(), 1);
    let y = createCollection(emptySave(), hand(), 1);
    for (let i = 0; i < 100; i++) {
      x = addToCollection(x, COL, `adv-x${String(i).padStart(5, "0")}`, 10 + i);
      y = addToCollection(y, COL, `adv-y${String(i).padStart(5, "0")}`, 10 + i);
    }
    const m = merge(x, y);
    expect((mine(m) as { ids: string[] }).ids).toHaveLength(100);
    expect(validateSave(m)).toBeNull();
  });
  it("profile, owner and feedback merge by time with deterministic ties", () => {
    const p = {
      ...emptySave(),
      profile: { data: { name: "A" }, at: 5 },
      feedback: { [A]: { value: "liked" as const, at: 5 } },
    };
    const q = {
      ...emptySave(),
      profile: { data: { name: "B" }, at: 5 },
      feedback: { [A]: { value: "not-for-us" as const, at: 5 } },
    };
    same(merge(p, q), merge(q, p));
  });
});

describe("validation", () => {
  const ok = () => createCollection(emptySave(), hand([A]), 1);
  it("accepts a normal v2 save", () => expect(validateSave(ok())).toBeNull());
  it("rejects unknown keys, bad versions and bad ids", () => {
    expect(validateSave({ ...emptySave(), v: 1 })).toBe("unknown version");
    expect(validateSave({ ...emptySave(), extra: 1 })).toBe("unknown field");
    const bad = emptySave();
    bad.done.added["../etc"] = 1;
    expect(validateSave(bad)).toBe("bad id");
    expect(validateSave({ ...emptySave(), profile: { data: { evil: 1 }, at: 1 } })).toBe(
      "bad profile",
    );
    expect(validateSave({ ...emptySave(), owner: { data: { mobility: "sprint" }, at: 1 } })).toBe(
      "bad owner",
    );
    expect(validateSave({ ...emptySave(), rev: -1 })).toBe("bad rev");
    expect(validateSave(null)).toBe("not an object");
  });
  it("rejects malformed and oversized collections", () => {
    const s = ok();
    const c = s.collections[COL]!;
    const put = (patch: Record<string, unknown>, id = COL) =>
      validateSave({ ...s, collections: { [id]: { ...c, ...patch } } });
    expect(put({}, "col-BAD")).toBe("bad collection id");
    expect(put({ name: { v: "x".repeat(41), at: 1 } })).toBe("bad collection name");
    expect(put({ name: { v: " ", at: 1 } })).toBe("bad collection name");
    expect(put({ filters: { v: { minutes: 10, nope: 1 }, at: 1 } })).toBe("bad filters");
    expect(put({ filters: { v: { types: Array(50).fill("travel") }, at: 1 } })).toBe("bad filters");
    expect(put({ extra: 1 })).toBe("bad collection");
    expect(put({ kind: "other" })).toBe("bad collection kind");
    expect(put({ order: { v: ["not-an-id"], at: 1 } })).toBe("bad order");
    const items = { added: {} as Record<string, number>, removed: {} };
    for (let i = 0; i < 101; i++) items.added[`adv-${String(i).padStart(6, "0")}`] = 1;
    expect(put({ items })).toBe("too many items in a collection");
    expect(put({ kind: "smart", items: { added: { [A]: 1 }, removed: {} } })).toBe(
      "smart collections hold filters only",
    );
    const many: Record<string, unknown> = {};
    for (let i = 0; i < 31; i++) many[`col-${String(i).padStart(8, "0")}`] = c;
    expect(validateSave({ ...s, collections: many })).toBe("too many collections");
  });
  it("rejects records over the size limit", () => {
    const s = emptySave();
    for (let i = 0; i < 300; i++)
      s.memories[`adv-${String(i).padStart(6, "0")}`] = { text: "x".repeat(280), at: 1 };
    expect(validateSave(s)).toBe("record too large");
  });
  it("collection operations refuse changes that would exceed the size limit", () => {
    const s = createCollection(emptySave(), hand(), 1);
    for (let i = 0; i < 200; i++)
      s.memories[`adv-${String(i).padStart(6, "0")}`] = { text: "x".repeat(280), at: 1 };
    expect(addToCollection(s, COL, A, 2)).toBe(s);
  });
});
