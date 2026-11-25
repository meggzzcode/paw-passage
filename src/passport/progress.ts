// Customer progress as small sets that merge safely across devices.
// Each set records "added at" and "removed at" times per ID, so two devices can only ever add or remove, never overwrite
// each other. The newest action for an ID wins. Everything derived (stamps, milestones) is recomputed from the sets.
export type TimedSet = { added: Record<string, number>; removed: Record<string, number> };
export type Memory = { text: string; at: number };
export type Save = {
  v: 1;
  rev: number; // incremented by the server on each accepted write
  profile: { data: Record<string, unknown>; at: number };
  done: TimedSet; // unique completed adventure IDs
  favorites: TimedSet;
  saved: TimedSet; // save for later
  memories: Record<string, Memory>;
  repeats: Record<string, number>; // adventure ID -> number of repeat memories (never counted as new adventures)
};

export const MAX_MEMORY_CHARS = 280;
export const MAX_IDS = 400;

export const emptySet = (): TimedSet => ({ added: {}, removed: {} });
export const emptySave = (): Save => ({
  v: 1,
  rev: 0,
  profile: { data: {}, at: 0 },
  done: emptySet(),
  favorites: emptySet(),
  saved: emptySet(),
  memories: {},
  repeats: {},
});

export const has = (s: TimedSet, id: string): boolean =>
  s.added[id] !== undefined && (s.removed[id] === undefined || s.added[id] > s.removed[id]);
export const members = (s: TimedSet): string[] => Object.keys(s.added).filter((id) => has(s, id));

/** Idempotent: adding something already present changes nothing, so double taps cannot create duplicates. */
export function add(s: TimedSet, id: string, now: number): TimedSet {
  if (has(s, id)) return s;
  return {
    added: { ...s.added, [id]: Math.max(now, (s.removed[id] ?? 0) + 1) },
    removed: s.removed,
  };
}
export function remove(s: TimedSet, id: string, now: number): TimedSet {
  if (!has(s, id)) return s;
  return { added: s.added, removed: { ...s.removed, [id]: Math.max(now, (s.added[id] ?? 0) + 1) } };
}

const maxMerge = (a: Record<string, number>, b: Record<string, number>) => {
  const out: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return Object.fromEntries(Object.entries(out).sort(([x], [y]) => (x < y ? -1 : 1))); // sorted keys: same bytes in any order
};
const mergeSet = (a: TimedSet, b: TimedSet): TimedSet => ({
  added: maxMerge(a.added, b.added),
  removed: maxMerge(a.removed, b.removed),
});

/** Order-independent merge (commutative, associative, idempotent): the sync conflict rule. */
export function merge(a: Save, b: Save): Save {
  const m0: Record<string, Memory> = { ...a.memories };
  for (const [k, m] of Object.entries(b.memories)) {
    if (!m0[k] || m.at > m0[k].at) m0[k] = m;
  }
  const memories = Object.fromEntries(Object.entries(m0).sort(([x], [y]) => (x < y ? -1 : 1)));
  return {
    v: 1,
    rev: Math.max(a.rev, b.rev),
    profile: b.profile.at > a.profile.at ? b.profile : a.profile,
    done: mergeSet(a.done, b.done),
    favorites: mergeSet(a.favorites, b.favorites),
    saved: mergeSet(a.saved, b.saved),
    memories,
    repeats: maxMerge(a.repeats, b.repeats),
  };
}

/** Rejects oversized or malformed input before it is stored. Returns a message or null. */
export function validateSave(s: unknown): string | null {
  if (!s || typeof s !== "object") return "not an object";
  const x = s as Save;
  if (x.v !== 1) return "unknown version";
  for (const set of [x.done, x.favorites, x.saved]) {
    if (!set || typeof set.added !== "object" || typeof set.removed !== "object") return "bad set";
    if (Object.keys(set.added).length > MAX_IDS || Object.keys(set.removed).length > MAX_IDS)
      return "too many items";
    for (const id of [...Object.keys(set.added), ...Object.keys(set.removed)])
      if (!/^adv-[a-z0-9]{6}$/.test(id)) return "bad id";
  }
  for (const m of Object.values(x.memories ?? {}))
    if (typeof m.text !== "string" || m.text.length > MAX_MEMORY_CHARS) return "memory too long";
  if (JSON.stringify(x).length > 60_000) return "record too large";
  return null;
}

export type Library = { id: string; stamps: string[]; collections: string[] }[];
export type Collections = Record<string, string[]>; // slug -> adventure IDs

export type Earned = {
  count: number;
  milestones: number[]; // thresholds reached
  stamps: string[];
  collectionsComplete: string[];
  next: number | null; // next milestone not yet reached
};

/** Milestone thresholds are capped to the delivered library size so every one is reachable. */
export function thresholds(librarySize: number): number[] {
  return [1, 5, 10, 20, 30, 50, 75].filter((t) => t <= librarySize);
}

export function achievements(save: Save, lib: Library, collections: Collections): Earned {
  const doneIds = new Set(members(save.done));
  const known = new Set(lib.map((a) => a.id));
  const count = [...doneIds].filter((id) => known.has(id)).length;
  const th = thresholds(lib.length);
  const stamps = new Set<string>();
  for (const a of lib) if (doneIds.has(a.id)) for (const s of a.stamps) stamps.add(s);
  const collectionsComplete = Object.entries(collections)
    .filter(([, ids]) => ids.length >= 3 && ids.every((id) => doneIds.has(id)))
    .map(([slug]) => slug);
  return {
    count,
    milestones: th.filter((t) => count >= t),
    stamps: [...stamps].sort(),
    collectionsComplete,
    next: th.find((t) => count < t) ?? null,
  };
}
