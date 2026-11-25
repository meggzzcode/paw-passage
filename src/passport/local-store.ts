// Local progress for visitors without an account. Plain functions plus a tiny subscribe API (no React import here).
// Storage can be blocked or full (private windows, cleared data), so every access is wrapped and the app still works in memory.
import {
  add,
  emptySave,
  merge,
  remove,
  validateSave,
  MAX_MEMORY_CHARS,
  type Save,
  type TimedSet,
} from "./progress";

export const STORAGE_KEY = "pp.save.v1";
export type SaveState = "saved" | "memory-only";

let current: Save | null = null;
let state: SaveState = "saved";
const listeners = new Set<() => void>();

function read(): Save {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (validateSave(parsed) === null) return parsed as Save;
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

export function setProfile(data: Record<string, unknown>, now = Date.now()) {
  const s = getSave();
  commit({ ...s, profile: { data: { ...s.profile.data, ...data }, at: now } });
}

/** Download-friendly export and a validated import that merges (never replaces) what is already here. */
export const exportJson = (): string => JSON.stringify(getSave(), null, 2);
export function importJson(text: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  const err = validateSave(parsed);
  if (err) return { ok: false, error: `That file is not a Paw & Passage save (${err}).` };
  commit(merge(getSave(), parsed as Save));
  return { ok: true };
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
