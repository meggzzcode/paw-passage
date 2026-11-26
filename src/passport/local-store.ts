// Local progress for visitors without an account. Plain functions plus a tiny subscribe API (no React import here).
// Storage can be blocked or full (private windows, cleared data), so every access is wrapped and the app still works in memory.
import {
  add,
  addToCollection,
  createCollection,
  deleteCollection,
  emptySave,
  merge,
  migrate,
  recordRepeat,
  remove,
  removeFromCollection,
  renameCollection,
  reorderCollection,
  setSmartFilters,
  MAX_MEMORY_CHARS,
  type Save,
  type TimedSet,
} from "./progress";
import type { CustomCollection, DogProfile, OwnerPrefs, SessionFilters } from "./profile";

export const STORAGE_KEY = "pp.save.v1";
export type SaveState = "saved" | "memory-only";

let current: Save | null = null;
let state: SaveState = "saved";
const listeners = new Set<() => void>();

function read(): Save {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const upgraded = migrate(JSON.parse(raw) as unknown); // v1 saves are upgraded here
      if (upgraded) return upgraded;
    }
  } catch {
    state = "memory-only";
  }
  return emptySave();
}

export function getSave(): Save {
  if (current === null) current = typeof window === "undefined" ? emptySave() : read();
  return current;
}
export const getSaveState = (): SaveState => state;
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function commit(next: Save) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    state = "saved";
  } catch {
    state = "memory-only"; // never claim it was saved when it was not
  }
  listeners.forEach((l) => l());
}

const mutateSet =
  (key: "done" | "favorites" | "saved", fn: (s: TimedSet, id: string, now: number) => TimedSet) =>
  (id: string, now = Date.now()) => {
    const s = getSave();
    const next = fn(s[key], id, now);
    if (next !== s[key]) commit({ ...s, [key]: next });
  };

export const completeAdventure = mutateSet("done", add);
export const undoCompletion = mutateSet("done", remove);
export const favorite = mutateSet("favorites", add);
export const unfavorite = mutateSet("favorites", remove);
export const saveForLater = mutateSet("saved", add);
export const unsaveForLater = mutateSet("saved", remove);

export function setMemory(id: string, text: string, now = Date.now()) {
  const s = getSave();
  const clean = text.trim().slice(0, MAX_MEMORY_CHARS);
  const memories = { ...s.memories };
  if (clean) memories[id] = { text: clean, at: now };
  else delete memories[id];
  commit({ ...s, memories });
}

export function setProfile(data: Partial<DogProfile>, now = Date.now()) {
  const s = getSave();
  commit({
    ...s,
    profile: { data: { ...s.profile.data, ...data }, at: Math.max(now, s.profile.at) },
  });
}

export function setOwner(partial: OwnerPrefs, now = Date.now()) {
  const s = getSave();
  commit({ ...s, owner: { data: { ...s.owner.data, ...partial }, at: Math.max(now, s.owner.at) } });
}

/** Records "liked" or "not-for-us" for an adventure; null clears it on this device. */
export function setFeedback(id: string, value: "liked" | "not-for-us" | null, now = Date.now()) {
  const s = getSave();
  const cur = s.feedback[id];
  if (value === null) {
    if (!cur) return;
    const feedback = { ...s.feedback };
    delete feedback[id];
    commit({ ...s, feedback });
    return;
  }
  if (cur?.value === value) return;
  commit({
    ...s,
    feedback: { ...s.feedback, [id]: { value, at: Math.max(now, (cur?.at ?? 0) + 1) } },
  });
}

/** A repeat memory. Never counted as a new adventure. */
export function repeatAdventure(id: string) {
  const s = getSave();
  const next = recordRepeat(s, id);
  if (next !== s) commit(next);
}

const apply = (next: Save) => {
  if (next !== getSave()) commit(next);
};
export const newCollection = (c: CustomCollection, now = Date.now()) =>
  apply(createCollection(getSave(), c, now));
export const renameCustomCollection = (id: string, name: string, now = Date.now()) =>
  apply(renameCollection(getSave(), id, name, now));
export const addToCustomCollection = (id: string, advId: string, now = Date.now()) =>
  apply(addToCollection(getSave(), id, advId, now));
export const removeFromCustomCollection = (id: string, advId: string, now = Date.now()) =>
  apply(removeFromCollection(getSave(), id, advId, now));
export const reorderCustomCollection = (id: string, ids: string[], now = Date.now()) =>
  apply(reorderCollection(getSave(), id, ids, now));
export const updateSmartFilters = (id: string, filters: SessionFilters, now = Date.now()) =>
  apply(setSmartFilters(getSave(), id, filters, now));
export const deleteCustomCollection = (id: string, now = Date.now()) =>
  apply(deleteCollection(getSave(), id, now));

/** Download-friendly export and a validated import that merges (never replaces) what is already here. */
export const exportJson = (): string => JSON.stringify(getSave(), null, 2);
export function importJson(text: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  const upgraded = migrate(parsed);
  if (!upgraded) return { ok: false, error: "That file is not a Paw & Passage save." };
  commit(merge(getSave(), { ...upgraded, rev: 0 }));
  return { ok: true };
}

/** Merges a Save that came from the server into this device's copy (never replaces). No-op when nothing new. */
export function mergeRemote(remote: Save) {
  const cur = getSave();
  const next = merge(cur, { ...remote, rev: 0 });
  if (JSON.stringify(next) !== JSON.stringify(cur)) commit(next);
}

export function clearLocal() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing stored or storage blocked */
  }
  commit(emptySave());
}

/** Test helper: forget the in-memory copy so the next read goes to storage. */
export function _resetForTests() {
  current = null;
  state = "saved";
  listeners.clear();
}
