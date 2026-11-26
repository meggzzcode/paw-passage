// Customer progress as small sets that merge safely across devices (Save v2).
// Each set records "added at" and "removed at" times per ID, so two devices can only ever add or remove, never overwrite
// each other. The newest action for an ID wins. Everything derived (stamps, milestones) is recomputed from the sets.
// Custom collections are merged per field by timestamp: name, filters, item set, order list and a delete tombstone.
// Photos and keepsakes are never part of a Save.
import {
  ACTIVITY_TYPES,
  ENERGY,
  HOMES,
  LIFE_STAGES,
  OWNER_MOBILITY,
  PLACES,
  SEASONS,
  SETTINGS,
  SIZES,
  SUPPLY_KEYS,
  WATER,
} from "./schema";
import type { CustomCollection, DogProfile, OwnerPrefs, SessionFilters } from "./profile";

export type TimedSet = { added: Record<string, number>; removed: Record<string, number> };
export type Memory = { text: string; at: number };
export type Stamped<T> = { v: T; at: number };

/** One custom collection, mergeable per field. `deleted` is a tombstone time (0 = never deleted). */
export type StoredCollection = {
  kind: "handpicked" | "smart";
  created: number;
  name: Stamped<string>;
  filters: Stamped<SessionFilters>; // smart collections only; handpicked keep {}
  items: TimedSet; // handpicked adventure IDs only, never copies of adventure records
  order: Stamped<string[]>; // last written order; live items not listed are appended
  deleted: number;
};

export type Save = {
  v: 2;
  rev: number; // incremented by the server on each accepted write
  profile: { data: DogProfile; at: number };
  owner: { data: OwnerPrefs; at: number };
  done: TimedSet; // unique completed adventure IDs
  favorites: TimedSet;
  saved: TimedSet; // save for later
  memories: Record<string, Memory>;
  repeats: Record<string, number>; // adventure ID -> number of repeat memories (never counted as new adventures)
  feedback: Record<string, { value: "liked" | "not-for-us"; at: number }>;
  collections: Record<string, StoredCollection>;
  /** The one adventure a free visitor was picked. Additive and optional, so older saves stay valid. */
  starter?: Starter;
};

/** The free visitor's single picked adventure (an ID only, never a copy of the adventure). */
export type Starter = { id: string; at: number };

export const MAX_MEMORY_CHARS = 280;
export const MAX_IDS = 400;
export const MAX_COLLECTIONS = 30;
export const MAX_COLLECTION_RECORDS = 60; // live plus tombstones
export const MAX_ITEMS = 100;
export const MAX_NAME_CHARS = 40;
export const MAX_RECORD_CHARS = 60_000; // the whole record must stay under 64KB

const ADV_RE = /^adv-[a-z0-9]{6}$/;
const COL_RE = /^col-[a-z0-9]{8}$/;

export const emptySet = (): TimedSet => ({ added: {}, removed: {} });
export const emptySave = (): Save => ({
  v: 2,
  rev: 0,
  profile: { data: {}, at: 0 },
  owner: { data: {}, at: 0 },
  done: emptySet(),
  favorites: emptySet(),
  saved: emptySet(),
  memories: {},
  repeats: {},
  feedback: {},
  collections: {},
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

// ---------------------------------------------------------------- merge helpers

const cmp = (x: string, y: string) => (x < y ? -1 : x > y ? 1 : 0);
const sortKeys = <T>(o: Record<string, T>): Record<string, T> =>
  Object.fromEntries(Object.entries(o).sort(([x], [y]) => cmp(x, y)));
const stable = (v: unknown): string => {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object")
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(v) ?? "null";
};
const maxMerge = (a: Record<string, number>, b: Record<string, number>) => {
  const out: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return sortKeys(out);
};
const mergeSet = (a: TimedSet, b: TimedSet): TimedSet => ({
  added: maxMerge(a.added, b.added),
  removed: maxMerge(a.removed, b.removed),
});
/** Later time wins; an exact tie is broken by comparing the values, so the result never depends on argument order. */
function later<T extends { at: number }>(a: T, b: T): T {
  if (a.at !== b.at) return a.at > b.at ? a : b;
  return stable(a) >= stable(b) ? a : b;
}

const lastEdit = (c: StoredCollection): number =>
  Math.max(
    c.created,
    c.name.at,
    c.filters.at,
    c.order.at,
    ...Object.values(c.items.added),
    ...Object.values(c.items.removed),
  );
/** A tombstone hides a collection unless something was edited after it (a newer edit resurrects it). */
const isLive = (c: StoredCollection): boolean => c.deleted === 0 || lastEdit(c) > c.deleted;

function mergeCollection(a: StoredCollection, b: StoredCollection): StoredCollection {
  return {
    kind: a.kind <= b.kind ? a.kind : b.kind,
    created: Math.min(a.created, b.created),
    name: later(a.name, b.name),
    filters: later(a.filters, b.filters),
    items: mergeSet(a.items, b.items),
    order: later(a.order, b.order),
    deleted: Math.max(a.deleted, b.deleted),
  };
}

/** Keeps merged results inside the documented limits, as a pure function of the merged state. */
function clamp(s: Save): Save {
  let cols = s.collections;
  let changed = false;
  for (const [id, c] of Object.entries(cols)) {
    const live = members(c.items);
    if (live.length <= MAX_ITEMS) continue;
    const keep = new Set(
      live.sort((x, y) => c.items.added[x]! - c.items.added[y]! || cmp(x, y)).slice(0, MAX_ITEMS),
    );
    const removed = { ...c.items.removed };
    for (const x of live) if (!keep.has(x)) removed[x] = c.items.added[x]! + 1;
    cols = { ...cols, [id]: { ...c, items: { added: c.items.added, removed: sortKeys(removed) } } };
    changed = true;
  }
  const liveIds = Object.keys(cols).filter((id) => isLive(cols[id]!));
  if (liveIds.length > MAX_COLLECTIONS) {
    liveIds.sort((x, y) => cols[x]!.created - cols[y]!.created || cmp(x, y));
    const next = { ...cols };
    for (const id of liveIds.slice(MAX_COLLECTIONS))
      next[id] = { ...next[id]!, deleted: lastEdit(next[id]!) + 1 };
    cols = next;
    changed = true;
  }
  const ids = Object.keys(cols);
  if (ids.length > MAX_COLLECTION_RECORDS) {
    const dead = ids
      .filter((id) => !isLive(cols[id]!))
      .sort((x, y) => cols[x]!.deleted - cols[y]!.deleted || cmp(x, y));
    const next = { ...cols };
    for (const id of dead.slice(0, ids.length - MAX_COLLECTION_RECORDS)) delete next[id];
    cols = next;
    changed = true;
  }
  return changed ? { ...s, collections: sortKeys(cols) } : s;
}

/** Order-independent merge (commutative, associative, idempotent): the sync conflict rule. */
export function merge(a: Save, b: Save): Save {
  const memories: Record<string, Memory> = { ...a.memories };
  for (const [k, m] of Object.entries(b.memories)) {
    const cur = memories[k];
    memories[k] = cur ? later(cur, m) : m;
  }
  const feedback: Save["feedback"] = { ...a.feedback };
  for (const [k, f] of Object.entries(b.feedback)) {
    const cur = feedback[k];
    feedback[k] = cur ? later(cur, f) : f;
  }
  const collections: Record<string, StoredCollection> = { ...a.collections };
  for (const [k, c] of Object.entries(b.collections)) {
    const cur = collections[k];
    collections[k] = cur ? mergeCollection(cur, c) : c;
  }
  const starter = a.starter && b.starter ? later(a.starter, b.starter) : (a.starter ?? b.starter);
  return clamp({
    v: 2,
    rev: Math.max(a.rev, b.rev),
    profile: later(a.profile, b.profile),
    owner: later(a.owner, b.owner),
    done: mergeSet(a.done, b.done),
    favorites: mergeSet(a.favorites, b.favorites),
    saved: mergeSet(a.saved, b.saved),
    memories: sortKeys(memories),
    repeats: maxMerge(a.repeats, b.repeats),
    feedback: sortKeys(feedback),
    collections: sortKeys(collections),
    ...(starter ? { starter } : {}),
  });
}

// ---------------------------------------------------------------- validation

type Spec =
  | { t: "str"; max: number }
  | { t: "num"; min: number; max: number }
  | { t: "bool" }
  | { t: "date" }
  | { t: "enum"; v: readonly string[] }
  | { t: "arr"; v: readonly string[]; max: number };
const str = (max = 200): Spec => ({ t: "str", max });
const num = (min: number, max: number): Spec => ({ t: "num", min, max });
const bool: Spec = { t: "bool" };
const en = (v: readonly string[]): Spec => ({ t: "enum", v });
const arr = (v: readonly string[], max = 12): Spec => ({ t: "arr", v, max });
const TRI = ["yes", "no", "unknown"] as const;
const COMFORT = ["comfortable", "nervous", "unknown"] as const;
const PREP = ["none", "light", "some"] as const;

const PROFILE_SPEC: Record<string, Spec> = {
  name: str(60),
  breed: str(),
  ageYears: num(0, 40),
  ageMonths: num(0, 600),
  lifeStage: en(LIFE_STAGES),
  size: en(SIZES),
  energy: en(ENERGY),
  limitedMobility: bool,
  restrictions: str(),
  personality: arr(["curious", "playful", "cozy", "gentle", "adventurous"], 5),
  favoriteTypes: arr(ACTIVITY_TYPES),
  people: en(COMFORT),
  dogs: en(COMFORT),
  crowds: en(COMFORT),
  noiseSensitive: en(TRI),
  foodActivities: en(TRI),
  dietaryRestrictions: str(),
  water: en(["loves", "ok", "avoids", "unknown"]),
  swims: en(TRI),
  carTravel: en(TRI),
  home: en(HOMES),
  yard: en(TRI),
  birthday: { t: "date" },
  adoptionDate: { t: "date" },
  skipped: bool,
};
const OWNER_SPEC: Record<string, Spec> = {
  mobility: en(OWNER_MOBILITY),
  stepFree: bool,
  effort: en(["low", "medium", "high"]),
  hasCar: en(TRI),
  typicalBudget: num(0, 10_000),
  prep: en(PREP),
  preferredTypes: arr(ACTIVITY_TYPES),
  preferredPlaces: arr(PLACES),
  supplies: arr(SUPPLY_KEYS),
};
const FILTER_SPEC: Record<string, Spec> = {
  minutes: num(0, 1440),
  budget: num(0, 10_000),
  setting: en(SETTINGS.filter((x) => x !== "either")),
  types: arr(ACTIVITY_TYPES),
  energy: arr(ENERGY, 3),
  prep: en(PREP),
  haveSupplies: arr(SUPPLY_KEYS),
  transport: en(["none-or-walk", "any"]),
  places: arr(PLACES),
  season: en(SEASONS),
  weather: en(["rain", "heat", "cold"]),
  foodFree: bool,
  quiet: bool,
  novelty: en(["new-only", "any", "done-only"]),
  favoritesOnly: bool,
  collection: str(60),
  chair: bool,
  quick: bool,
  noYard: bool,
  puppy: bool,
  highEnergy: bool,
  household: arr(["two-dogs", "family"], 2),
};

const isObj = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const okSpec = (spec: Spec, x: unknown): boolean => {
  switch (spec.t) {
    case "str":
      return typeof x === "string" && x.length <= spec.max;
    case "num":
      return typeof x === "number" && Number.isFinite(x) && x >= spec.min && x <= spec.max;
    case "bool":
      return typeof x === "boolean";
    case "date":
      return typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x);
    case "enum":
      return typeof x === "string" && spec.v.includes(x);
    case "arr":
      return (
        Array.isArray(x) &&
        x.length <= spec.max &&
        x.every((i) => typeof i === "string" && spec.v.includes(i)) &&
        new Set(x).size === x.length
      );
  }
};
/** Splits an object into the valid known fields and the names of everything else (unknown keys or bad values). */
function pick(
  obj: unknown,
  specs: Record<string, Spec>,
): { clean: Record<string, unknown>; bad: string[] } {
  const clean: Record<string, unknown> = {};
  const bad: string[] = [];
  if (!isObj(obj)) return { clean, bad: ["not an object"] };
  for (const [k, v] of Object.entries(obj)) {
    const spec = Object.hasOwn(specs, k) ? specs[k] : undefined;
    if (spec && okSpec(spec, v)) clean[k] = v;
    else bad.push(k);
  }
  return { clean, bad };
}

const goodTime = (t: unknown): t is number =>
  typeof t === "number" && Number.isFinite(t) && t >= 0 && t <= 1e14;

function checkSet(set: unknown): string | null {
  if (!isObj(set) || !isObj(set["added"]) || !isObj(set["removed"])) return "bad set";
  const { added, removed } = set as {
    added: Record<string, unknown>;
    removed: Record<string, unknown>;
  };
  if (Object.keys(added).length > MAX_IDS || Object.keys(removed).length > MAX_IDS)
    return "too many items";
  for (const m of [added, removed])
    for (const [id, t] of Object.entries(m)) {
      if (!ADV_RE.test(id)) return "bad id";
      if (!goodTime(t)) return "bad time";
    }
  return null;
}

function checkCollection(id: string, c: unknown): string | null {
  if (!COL_RE.test(id)) return "bad collection id";
  if (!isObj(c)) return "bad collection";
  const keys = ["kind", "created", "name", "filters", "items", "order", "deleted"];
  if (Object.keys(c).some((k) => !keys.includes(k)) || keys.some((k) => !(k in c)))
    return "bad collection";
  if (c["kind"] !== "handpicked" && c["kind"] !== "smart") return "bad collection kind";
  if (!goodTime(c["created"]) || !goodTime(c["deleted"])) return "bad time";
  const name = c["name"];
  if (!isObj(name) || typeof name["v"] !== "string" || !goodTime(name["at"])) return "bad name";
  const n = (name["v"] as string).trim();
  if (n.length < 1 || name["v"].length > MAX_NAME_CHARS) return "bad collection name";
  const filters = c["filters"];
  if (!isObj(filters) || !goodTime(filters["at"])) return "bad filters";
  const f = pick(filters["v"], FILTER_SPEC);
  if (f.bad.length) return "bad filters";
  const setErr = checkSet(c["items"]);
  if (setErr) return setErr;
  const items = c["items"] as TimedSet;
  if (members(items).length > MAX_ITEMS) return "too many items in a collection";
  if (c["kind"] === "smart" && Object.keys(items.added).length)
    return "smart collections hold filters only";
  const order = c["order"];
  if (!isObj(order) || !goodTime(order["at"]) || !Array.isArray(order["v"])) return "bad order";
  if (
    order["v"].length > MAX_IDS ||
    order["v"].some((x) => typeof x !== "string" || !ADV_RE.test(x))
  )
    return "bad order";
  return null;
}

function checkTree(x: Record<string, unknown>): string | null {
  const allowed = [
    "v",
    "rev",
    "profile",
    "owner",
    "done",
    "favorites",
    "saved",
    "memories",
    "repeats",
    "feedback",
    "collections",
    "starter",
  ];
  if (Object.keys(x).some((k) => !allowed.includes(k))) return "unknown field";
  if ("starter" in x) {
    const st = x["starter"];
    if (!isObj(st) || Object.keys(st).some((k) => k !== "id" && k !== "at")) return "bad starter";
    if (typeof st["id"] !== "string" || !ADV_RE.test(st["id"]) || !goodTime(st["at"]))
      return "bad starter";
  }
  if (typeof x["rev"] !== "number" || !Number.isInteger(x["rev"]) || x["rev"] < 0) return "bad rev";
  for (const [key, specs] of [
    ["profile", PROFILE_SPEC],
    ["owner", OWNER_SPEC],
  ] as const) {
    const p = x[key];
    if (!isObj(p) || !goodTime(p["at"]) || Object.keys(p).some((k) => k !== "data" && k !== "at"))
      return `bad ${key}`;
    if (pick(p["data"], specs).bad.length) return `bad ${key}`;
  }
  for (const k of ["done", "favorites", "saved"]) {
    const err = checkSet(x[k]);
    if (err) return err;
  }
  const memories = x["memories"];
  if (!isObj(memories) || Object.keys(memories).length > MAX_IDS) return "bad memories";
  for (const [id, m] of Object.entries(memories)) {
    if (!ADV_RE.test(id)) return "bad id";
    if (!isObj(m) || typeof m["text"] !== "string" || !goodTime(m["at"])) return "bad memory";
    if (m["text"].length > MAX_MEMORY_CHARS) return "memory too long";
  }
  const repeats = x["repeats"];
  if (!isObj(repeats) || Object.keys(repeats).length > MAX_IDS) return "bad repeats";
  for (const [id, n] of Object.entries(repeats))
    if (!ADV_RE.test(id) || typeof n !== "number" || !Number.isInteger(n) || n < 0 || n > 10_000)
      return "bad repeats";
  const feedback = x["feedback"];
  if (!isObj(feedback) || Object.keys(feedback).length > MAX_IDS) return "bad feedback";
  for (const [id, f] of Object.entries(feedback))
    if (
      !ADV_RE.test(id) ||
      !isObj(f) ||
      (f["value"] !== "liked" && f["value"] !== "not-for-us") ||
      !goodTime(f["at"])
    )
      return "bad feedback";
  const cols = x["collections"];
  if (!isObj(cols) || Object.keys(cols).length > MAX_COLLECTION_RECORDS)
    return "too many collections";
  let live = 0;
  for (const [id, c] of Object.entries(cols)) {
    const err = checkCollection(id, c);
    if (err) return err;
    if (isLive(c as StoredCollection)) live++;
  }
  if (live > MAX_COLLECTIONS) return "too many collections";
  return null;
}

/** Rejects oversized or malformed input before it is stored. Accepts a v2 Save only. Returns a message or null. */
export function validateSave(s: unknown): string | null {
  if (!isObj(s)) return "not an object";
  if (s["v"] !== 2) return "unknown version";
  const err = checkTree(s);
  if (err) return err;
  if (JSON.stringify(s).length > MAX_RECORD_CHARS) return "record too large";
  return null;
}

// ---------------------------------------------------------------- migration

/** Upgrades a v1 Save to v2 and validates a v2 Save. Returns null for anything else (never throws). */
export function migrate(raw: unknown): Save | null {
  try {
    if (!isObj(raw)) return null;
    if (raw["v"] === 2) return validateSave(raw) === null ? (raw as unknown as Save) : null;
    if (raw["v"] !== 1) return null;
    const p = isObj(raw["profile"]) ? raw["profile"] : {};
    const old = isObj(p["data"]) ? p["data"] : {};
    const { clean } = pick(old, PROFILE_SPEC);
    if (old["nervousAroundPeople"] === true && clean["people"] === undefined)
      clean["people"] = "nervous";
    if (old["nervousAroundDogs"] === true && clean["dogs"] === undefined) clean["dogs"] = "nervous";
    const next: Save = {
      ...emptySave(),
      rev: typeof raw["rev"] === "number" ? raw["rev"] : 0,
      profile: { data: clean as DogProfile, at: goodTime(p["at"]) ? p["at"] : 0 },
      done: raw["done"] as TimedSet,
      favorites: raw["favorites"] as TimedSet,
      saved: raw["saved"] as TimedSet,
      memories: (raw["memories"] ?? {}) as Save["memories"],
      repeats: (raw["repeats"] ?? {}) as Save["repeats"],
    };
    return validateSave(next) === null ? next : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- free starter

/**
 * Records (or clears, with null) the one adventure picked for a free visitor. Once that adventure is completed it is
 * the free keepsake and can no longer be changed here. Returns the same Save when nothing changes.
 */
export function chooseStarter(s: Save, id: string | null, now: number): Save {
  const cur = s.starter;
  if (cur && has(s.done, cur.id)) return s;
  if (id === null) {
    if (!cur) return s;
    const { starter: _gone, ...rest } = s;
    return rest;
  }
  if (cur?.id === id) return s;
  return { ...s, starter: { id, at: Math.max(now, (cur?.at ?? 0) + 1) } };
}

// ---------------------------------------------------------------- collections API

/** `col-` plus 8 lowercase alphanumerics. Generated by the caller of newCollection. */
export function newCollectionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  return `col-${Array.from(bytes, (b) => chars[b % 36]).join("")}`;
}

function effectiveOrder(c: StoredCollection): string[] {
  const live = members(c.items);
  const liveSet = new Set(live);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of c.order.v)
    if (liveSet.has(id) && !seen.has(id)) {
      out.push(id);
      seen.add(id);
    }
  const rest = live
    .filter((id) => !seen.has(id))
    .sort((x, y) => c.items.added[x]! - c.items.added[y]! || cmp(x, y));
  return [...out, ...rest];
}

/** Live (non-deleted) collections in a stable order: oldest first. */
export function listCollections(s: Save): CustomCollection[] {
  return Object.entries(s.collections)
    .filter(([, c]) => isLive(c))
    .sort(([ia, a], [ib, b]) => a.created - b.created || cmp(ia, ib))
    .map(([id, c]): CustomCollection =>
      c.kind === "smart"
        ? { id, kind: "smart", name: c.name.v, filters: c.filters.v }
        : { id, kind: "handpicked", name: c.name.v, ids: effectiveOrder(c) },
    );
}

/** How many of a collection's adventures are completed. The caller passes the member IDs (for a smart collection,
 * the adventures that currently match its filters). Deleting a collection never touches completion history. */
export function collectionProgress(
  s: Save,
  _c: CustomCollection,
  memberIds: string[],
): { done: number; total: number } {
  const ids = [...new Set(memberIds)];
  return { done: ids.filter((id) => has(s.done, id)).length, total: ids.length };
}

const cleanName = (n: string): string | null => {
  const t = n.trim().replace(/\s+/g, " ");
  return t.length >= 1 && t.length <= MAX_NAME_CHARS ? t : null;
};
const cleanFilters = (f: SessionFilters): SessionFilters | null => {
  const { clean, bad } = pick(f, FILTER_SPEC);
  return bad.length ? null : (clean as SessionFilters);
};
/** Applies a collection change, refusing it (returning the same Save) if the record would grow past the limit. */
function commitCollection(s: Save, id: string, next: StoredCollection): Save {
  const out: Save = { ...s, collections: sortKeys({ ...s.collections, [id]: next }) };
  return JSON.stringify(out).length > MAX_RECORD_CHARS ? s : out;
}
const liveOne = (s: Save, id: string): StoredCollection | null => {
  const c = s.collections[id];
  return c && isLive(c) ? c : null;
};

export function createCollection(s: Save, c: CustomCollection, now: number): Save {
  if (!COL_RE.test(c.id) || s.collections[c.id]) return s; // repeat taps and reused ids change nothing
  const name = cleanName(c.name);
  if (!name) return s;
  if (Object.keys(s.collections).filter((k) => isLive(s.collections[k]!)).length >= MAX_COLLECTIONS)
    return s;
  let base = s;
  if (Object.keys(s.collections).length >= MAX_COLLECTION_RECORDS) {
    const dead = Object.entries(s.collections)
      .filter(([, x]) => !isLive(x))
      .sort(([ia, a], [ib, b]) => a.deleted - b.deleted || cmp(ia, ib))[0];
    if (!dead) return s;
    const rest = { ...s.collections };
    delete rest[dead[0]];
    base = { ...s, collections: rest };
  }
  let filters: SessionFilters = {};
  let items = emptySet();
  let order: string[] = [];
  if (c.kind === "smart") {
    const f = cleanFilters(c.filters);
    if (!f) return s;
    filters = f;
  } else {
    order = [...new Set(c.ids)].filter((x) => ADV_RE.test(x)).slice(0, MAX_ITEMS);
    for (const x of order) items = add(items, x, now);
  }
  const stored: StoredCollection = {
    kind: c.kind,
    created: now,
    name: { v: name, at: now },
    filters: { v: filters, at: now },
    items,
    order: { v: order, at: now },
    deleted: 0,
  };
  const out = commitCollection(base, c.id, stored);
  return out === base ? s : out;
}

export function renameCollection(s: Save, id: string, name: string, now: number): Save {
  const c = liveOne(s, id);
  const n = cleanName(name);
  if (!c || !n || n === c.name.v) return s;
  return commitCollection(s, id, { ...c, name: { v: n, at: Math.max(now, c.name.at + 1) } });
}

export function addToCollection(s: Save, id: string, adventureId: string, now: number): Save {
  const c = liveOne(s, id);
  if (!c || c.kind !== "handpicked" || !ADV_RE.test(adventureId) || has(c.items, adventureId))
    return s;
  if (members(c.items).length >= MAX_ITEMS || Object.keys(c.items.added).length >= MAX_IDS)
    return s;
  return commitCollection(s, id, { ...c, items: add(c.items, adventureId, now) });
}

export function removeFromCollection(s: Save, id: string, adventureId: string, now: number): Save {
  const c = liveOne(s, id);
  if (!c || c.kind !== "handpicked" || !has(c.items, adventureId)) return s;
  return commitCollection(s, id, { ...c, items: remove(c.items, adventureId, now) });
}

export function reorderCollection(s: Save, id: string, orderedIds: string[], now: number): Save {
  const c = liveOne(s, id);
  if (!c || c.kind !== "handpicked") return s;
  const cur = effectiveOrder(c);
  const live = new Set(cur);
  const wanted = [...new Set(orderedIds)].filter((x) => live.has(x));
  const next = [...wanted, ...cur.filter((x) => !wanted.includes(x))];
  if (next.join() === cur.join()) return s;
  return commitCollection(s, id, { ...c, order: { v: next, at: Math.max(now, c.order.at + 1) } });
}

export function setSmartFilters(s: Save, id: string, filters: SessionFilters, now: number): Save {
  const c = liveOne(s, id);
  const f = cleanFilters(filters);
  if (!c || c.kind !== "smart" || !f || stable(f) === stable(c.filters.v)) return s;
  return commitCollection(s, id, { ...c, filters: { v: f, at: Math.max(now, c.filters.at + 1) } });
}

/** Tombstones the collection. Adventures and completion history are never touched. */
export function deleteCollection(s: Save, id: string, now: number): Save {
  const c = liveOne(s, id);
  if (!c) return s;
  return commitCollection(s, id, { ...c, deleted: Math.max(now, lastEdit(c) + 1) });
}

/** Repeats are separate from unique completions: they never add to the adventure count. */
export function recordRepeat(s: Save, adventureId: string): Save {
  if (!ADV_RE.test(adventureId)) return s;
  return {
    ...s,
    repeats: sortKeys({ ...s.repeats, [adventureId]: (s.repeats[adventureId] ?? 0) + 1 }),
  };
}

export type Library = { id: string; stamps: string[]; collections: string[] }[];
/** Curated collections only (slug -> adventure IDs). Custom collections never earn collection-complete achievements. */
export type Collections = Record<string, string[]>;

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
