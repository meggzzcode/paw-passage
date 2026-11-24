// Saving the checklist on this device only (localStorage). Versioned: this file reads the current format (v2) and
// the first version of the tool (key pp.packing.v1) and carries it over. Nothing is ever silently thrown away:
// the old key is left in place, and data that cannot be read is kept under a "corrupt" key before a fresh start.
import {
  MAX_CUSTOM_ITEMS,
  MAX_NAME,
  MAX_QTY,
  emptyState,
  type CustomItem,
  type ItemState,
  type PlannerState,
} from "./state";
import { normalizeTrip, type Trip } from "./engine";
import type { PackingConfig } from "./schema";

export const STORAGE_KEY = "pp.packing.v2";
export const LEGACY_KEY = "pp.packing.v1";
export const CORRUPT_KEY = "pp.packing.v2.corrupt";

/** localStorage, or null where it is blocked (private windows, strict settings). The planner then works for this visit only. */
export function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const s = window.localStorage;
    const probe = "__pp_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, n: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "";

/** A saved v2 object made safe, or null if it is not a v2 list at all. */
export function parseState(raw: unknown, cfg: PackingConfig): PlannerState | null {
  if (!isObj(raw) || raw["v"] !== 2) return null;
  const base = emptyState(cfg);
  const trip = normalizeTrip(isObj(raw["trip"]) ? (raw["trip"] as Partial<Trip>) : null, cfg);
  const items: Record<string, ItemState> = {};
  if (isObj(raw["items"]))
    for (const [id, v] of Object.entries(raw["items"]).slice(0, 300)) {
      if (!/^[a-z0-9-]{1,60}$/.test(id) || !isObj(v)) continue;
      const s: ItemState = {};
      if (v["packed"] === true) s.packed = true;
      if (v["buy"] === true) s.buy = true;
      if (v["excluded"] === true) s.excluded = true;
      if (v["added"] === true) s.added = true;
      const q = str(v["qty"], MAX_QTY);
      if (q) s.qty = q;
      if (Object.keys(s).length) items[id] = s;
    }
  const custom: CustomItem[] = [];
  let maxSeq = 0;
  if (Array.isArray(raw["custom"]))
    for (const c of raw["custom"].slice(0, MAX_CUSTOM_ITEMS)) {
      if (!isObj(c)) continue;
      const name = str(c["name"], MAX_NAME);
      const m = typeof c["id"] === "string" ? /^custom-(\d{1,6})$/.exec(c["id"]) : null;
      if (!name || !m || custom.some((x) => x.id === c["id"])) continue;
      maxSeq = Math.max(maxSeq, Number(m[1]));
      custom.push({
        id: c["id"] as string,
        name,
        qty: str(c["qty"], MAX_QTY),
        packed: c["packed"] === true,
        buy: c["buy"] === true,
      });
    }
  const seq =
    typeof raw["customSeq"] === "number" && Number.isFinite(raw["customSeq"])
      ? Math.floor(raw["customSeq"])
      : 0;
  return {
    ...base,
    trip,
    built: raw["built"] === true,
    items,
    custom,
    customSeq: Math.max(seq, maxSeq),
    fresh: Array.isArray(raw["fresh"])
      ? raw["fresh"].filter((f): f is string => typeof f === "string").slice(0, 60)
      : [],
  };
}

/** Where each id of the first version of the tool lives now. */
export const LEGACY_ID_MAP: Record<string, string[]> = {
  "car-restraint": ["car-restraint"],
  "seat-cover": ["seat-cover"],
  bed: ["bed"],
  throw: ["throw"],
  bowl: ["bowl"],
  bottle: ["bottle"],
  "id-tag": ["id-tag"],
  gps: ["gps"],
  fence: ["pen"],
  "first-aid": ["first-aid"],
  muzzle: ["muzzle"],
  paperwork: ["paperwork"],
  "meds-food": ["food", "treats"],
  "leash-waste": ["leash", "waste-bags"],
  towels: ["towel"],
};

/** The first version stored { profile: { car, rental, senior, bolter, noFence }, packed: [ids] }. */
export function migrateLegacy(raw: unknown, cfg: PackingConfig): PlannerState | null {
  if (!isObj(raw)) return null;
  const profile = isObj(raw["profile"]) ? raw["profile"] : null;
  const packedIds = Array.isArray(raw["packed"])
    ? raw["packed"].filter((x): x is string => typeof x === "string")
    : [];
  if (!profile && packedIds.length === 0) return null;
  const p = profile ?? {};
  const conditions: string[] = [];
  if (p["car"] === true) conditions.push("driving");
  if (p["senior"] === true) conditions.push("senior");
  if (p["bolter"] === true) conditions.push("escape-risk");
  if (p["noFence"] === true) conditions.push("no-fence");
  const tripType = p["rental"] === false ? (p["car"] === true ? "road-trip" : "other") : "cabin";
  let state: PlannerState = {
    ...emptyState(cfg),
    trip: normalizeTrip({ tripType, conditions }, cfg),
    built: true,
  };
  const known = new Set(cfg.items.map((i) => i.id));
  for (const id of packedIds.slice(0, 100)) {
    const targets = LEGACY_ID_MAP[id];
    if (targets) {
      for (const t of targets)
        if (known.has(t))
          state = {
            ...state,
            items: { ...state.items, [t]: { ...(state.items[t] ?? {}), packed: true } },
          };
    } else if (/^[a-z0-9-]{1,40}$/.test(id) && state.custom.length < MAX_CUSTOM_ITEMS) {
      // An id this version does not know: keep it as one of the visitor's own items rather than drop it.
      const seq = state.customSeq + 1;
      state = {
        ...state,
        customSeq: seq,
        custom: [
          ...state.custom,
          { id: `custom-${seq}`, name: id.replace(/-/g, " "), qty: "", packed: true, buy: false },
        ],
      };
    }
  }
  return state;
}

export type LoadSource = "saved" | "legacy" | "recovered" | "none";
export interface LoadResult {
  state: PlannerState | null;
  source: LoadSource;
}

function readJson(
  storage: Storage,
  key: string,
): { found: boolean; value?: unknown; raw?: string } {
  let raw: string | null = null;
  try {
    raw = storage.getItem(key);
  } catch {
    return { found: false };
  }
  if (raw === null) return { found: false };
  try {
    return { found: true, value: JSON.parse(raw), raw };
  } catch {
    return { found: true, raw };
  }
}

export function loadState(storage: Storage | null, cfg: PackingConfig): LoadResult {
  if (!storage) return { state: null, source: "none" };
  let corrupt = false;
  const cur = readJson(storage, STORAGE_KEY);
  if (cur.found) {
    const parsed = cur.value !== undefined ? parseState(cur.value, cfg) : null;
    if (parsed) return { state: parsed, source: "saved" };
    corrupt = true;
    try {
      if (cur.raw) storage.setItem(CORRUPT_KEY, cur.raw.slice(0, 20000));
    } catch {
      /* nothing more to do */
    }
  }
  const old = readJson(storage, LEGACY_KEY);
  if (old.found && old.value !== undefined) {
    const migrated = migrateLegacy(old.value, cfg);
    if (migrated) return { state: migrated, source: "legacy" };
  }
  return { state: null, source: corrupt ? "recovered" : "none" };
}

export function saveState(storage: Storage | null, state: PlannerState): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Used by "Start over" after the visitor confirms. Clears both formats so an old list cannot come back. */
export function clearState(storage: Storage | null): void {
  if (!storage) return;
  for (const k of [STORAGE_KEY, LEGACY_KEY]) {
    try {
      storage.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}
