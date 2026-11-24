// The checklist a visitor builds on top of the rules: what is packed, what needs buying, what they removed or
// added. Pure functions over a plain object, so every behaviour can be tested without a screen.
//
// Rules this file keeps (see docs/PACKING_PLANNER_PRODUCT_GUIDE.md, "State model"):
//  * "Packed" and "Need to buy" are independent. Neither ever sets the other.
//  * "Not bringing this" hides a suggestion and takes it out of the progress count. It never deletes the
//    record, and the item can be put back.
//  * Changing the trip keeps the visitor's own items, keeps packed / buy / quantity choices for items that stay
//    relevant, adds newly relevant items once (no duplicates) and flags them as new.
import type { PackingCategory, PackingConfig, PackingItem } from "./schema";
import {
  defaultTrip,
  ideasFor,
  inclusionFor,
  normalizeTrip,
  quantityFor,
  suggestFor,
  type Inclusion,
  type QuantityResult,
  type Trip,
} from "./engine";

export const MAX_CUSTOM_ITEMS = 60;
export const MAX_NAME = 80;
export const MAX_QTY = 40;

export interface ItemState {
  packed?: boolean;
  buy?: boolean;
  /** "Not bringing this". */
  excluded?: boolean;
  /** An optional idea the visitor added to their list. */
  added?: boolean;
  /** The visitor's own quantity, replacing the suggestion. */
  qty?: string;
}

export interface CustomItem {
  id: string;
  name: string;
  qty: string;
  packed: boolean;
  buy: boolean;
}

export interface PlannerState {
  v: 2;
  trip: Trip;
  /** false until the visitor has pressed "Build my packing list" (or a saved list was loaded). */
  built: boolean;
  items: Record<string, ItemState>;
  custom: CustomItem[];
  customSeq: number;
  /** Items that became relevant when the trip last changed (shown with a "New" tag). */
  fresh: string[];
}

export function emptyState(cfg: PackingConfig): PlannerState {
  return {
    v: 2,
    trip: normalizeTrip(defaultTrip(), cfg),
    built: false,
    items: {},
    custom: [],
    customSeq: 0,
    fresh: [],
  };
}

const idsOf = (trip: Trip, cfg: PackingConfig) =>
  new Set(suggestFor(trip, cfg).map((s) => s.item.id));

/**
 * Build the list for a trip. With a previous list (the visitor pressed "Edit trip" and changed something), everything
 * they did is kept and only the suggestions change: new ones appear once and are flagged, ones that no longer apply
 * leave the list but keep their packed / buy state in case they apply again.
 */
export function buildList(
  prev: PlannerState | null,
  tripInput: Partial<Trip>,
  cfg: PackingConfig,
): PlannerState {
  const trip = normalizeTrip(tripInput, cfg);
  if (!prev || !prev.built) {
    return { ...(prev ?? emptyState(cfg)), v: 2, trip, built: true, fresh: [] };
  }
  const before = idsOf(prev.trip, cfg);
  const now = idsOf(trip, cfg);
  const fresh = [...now].filter(
    (id) => !before.has(id) && !prev.items[id]?.excluded && !prev.items[id]?.added,
  );
  return { ...prev, trip, built: true, fresh };
}

function patchItem(state: PlannerState, id: string, patch: Partial<ItemState>): PlannerState {
  const next: ItemState = { ...(state.items[id] ?? {}), ...patch };
  for (const k of Object.keys(next) as (keyof ItemState)[]) {
    const v = next[k];
    if (v === false || v === undefined || v === "") delete next[k];
  }
  const items = { ...state.items };
  if (Object.keys(next).length === 0) delete items[id];
  else items[id] = next;
  return { ...state, items };
}

const clip = (s: string, n: number) => s.replace(/\s+/g, " ").trim().slice(0, n);

export function setPacked(state: PlannerState, id: string, value: boolean): PlannerState {
  if (isCustomId(id))
    return {
      ...state,
      custom: state.custom.map((c) => (c.id === id ? { ...c, packed: value } : c)),
    };
  return patchItem(state, id, { packed: value });
}
export function setBuy(state: PlannerState, id: string, value: boolean): PlannerState {
  if (isCustomId(id))
    return { ...state, custom: state.custom.map((c) => (c.id === id ? { ...c, buy: value } : c)) };
  return patchItem(state, id, { buy: value });
}
export function excludeItem(state: PlannerState, id: string): PlannerState {
  return {
    ...patchItem(state, id, { excluded: true }),
    fresh: state.fresh.filter((f) => f !== id),
  };
}
export function restoreItem(state: PlannerState, id: string): PlannerState {
  return patchItem(state, id, { excluded: false });
}
export function addIdea(state: PlannerState, id: string): PlannerState {
  return patchItem(state, id, { added: true, excluded: false });
}
export function setQuantity(
  state: PlannerState,
  id: string,
  value: string | undefined,
): PlannerState {
  const text = value === undefined ? "" : clip(value, MAX_QTY);
  if (isCustomId(id))
    return { ...state, custom: state.custom.map((c) => (c.id === id ? { ...c, qty: text } : c)) };
  return patchItem(state, id, { qty: text });
}
export function dismissFresh(state: PlannerState): PlannerState {
  return state.fresh.length ? { ...state, fresh: [] } : state;
}

export const isCustomId = (id: string) => id.startsWith("custom-");

export function addCustom(state: PlannerState, name: string, qty = ""): PlannerState {
  const n = clip(name, MAX_NAME);
  if (!n || state.custom.length >= MAX_CUSTOM_ITEMS) return state;
  const seq = state.customSeq + 1;
  return {
    ...state,
    customSeq: seq,
    custom: [
      ...state.custom,
      { id: `custom-${seq}`, name: n, qty: clip(qty, MAX_QTY), packed: false, buy: false },
    ],
  };
}
export function editCustom(
  state: PlannerState,
  id: string,
  name: string,
  qty: string,
): PlannerState {
  const n = clip(name, MAX_NAME);
  if (!n) return state;
  return {
    ...state,
    custom: state.custom.map((c) => (c.id === id ? { ...c, name: n, qty: clip(qty, MAX_QTY) } : c)),
  };
}
export function removeCustom(state: PlannerState, id: string): PlannerState {
  return { ...state, custom: state.custom.filter((c) => c.id !== id) };
}

// ----------------------------------------------------------------------------------------- reading the list

export interface Entry {
  item: PackingItem;
  inclusion: Inclusion | "added";
  packed: boolean;
  buy: boolean;
  isNew: boolean;
  /** The suggestion worked out from the trip. */
  suggested: QuantityResult;
  /** The visitor's own quantity, when they changed it. */
  customQty: string | undefined;
  /** What to show: the visitor's quantity, else the suggestion. */
  qtyText: string;
}

export interface Group {
  category: PackingCategory;
  entries: Entry[];
}

function entryFor(state: PlannerState, item: PackingItem, inclusion: Inclusion | "added"): Entry {
  const st = state.items[item.id] ?? {};
  const suggested = quantityFor(item, state.trip);
  const customQty = st.qty ? st.qty : undefined;
  return {
    item,
    inclusion,
    packed: !!st.packed,
    buy: !!st.buy,
    isNew: state.fresh.includes(item.id),
    suggested,
    customQty,
    qtyText: customQty ?? suggested.text,
  };
}

/** Every suggestion currently on the list, plus ideas the visitor added, minus the ones marked "Not bringing this". */
export function activeEntries(state: PlannerState, cfg: PackingConfig): Entry[] {
  const out: Entry[] = [];
  const have = new Set<string>();
  for (const s of suggestFor(state.trip, cfg)) {
    if (state.items[s.item.id]?.excluded) continue;
    out.push(entryFor(state, s.item, s.inclusion));
    have.add(s.item.id);
  }
  for (const item of ideasPool(cfg)) {
    const st = state.items[item.id];
    if (st?.added && !st.excluded && !have.has(item.id) && item.active !== false) {
      out.push(entryFor(state, item, "added"));
      have.add(item.id);
    }
  }
  return sortEntries(out, cfg);
}

const ideasPool = (cfg: PackingConfig) => cfg.items.filter((i) => i.appears === "optional");

function sortEntries(entries: Entry[], cfg: PackingConfig): Entry[] {
  const cats = new Map(cfg.categories.map((c, i) => [c.id, c.order * 1000 + i]));
  const idx = new Map(cfg.items.map((i, n) => [i.id, n]));
  return [...entries].sort(
    (a, b) =>
      (cats.get(a.item.category) ?? 0) - (cats.get(b.item.category) ?? 0) ||
      a.item.order - b.item.order ||
      (idx.get(a.item.id) ?? 0) - (idx.get(b.item.id) ?? 0),
  );
}

/** Active entries grouped by category (only categories that have items), in the content's category order. */
export function groupEntries(entries: Entry[], cfg: PackingConfig): Group[] {
  return [...cfg.categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      entries: entries.filter((e) => e.item.category === category.id),
    }))
    .filter((g) => g.entries.length > 0);
}

/** Suggestions the visitor removed that would still be on the list for this trip, so they can be put back. */
export function removedEntries(state: PlannerState, cfg: PackingConfig): PackingItem[] {
  const onTrip = new Set(suggestFor(state.trip, cfg).map((s) => s.item.id));
  return sortEntries(
    cfg.items
      .filter(
        (i) =>
          i.active !== false &&
          state.items[i.id]?.excluded &&
          (onTrip.has(i.id) || state.items[i.id]?.added),
      )
      .map((item) => entryFor(state, item, inclusionFor(item, state.trip, cfg) ?? "added")),
    cfg,
  ).map((e) => e.item);
}

/** Optional ideas that are not on the list yet (and not removed), for the "Other ideas" disclosure. */
export function availableIdeas(state: PlannerState, cfg: PackingConfig): PackingItem[] {
  return ideasFor(state.trip, cfg).filter(
    (i) => !state.items[i.id]?.added && !state.items[i.id]?.excluded,
  );
}

export interface Progress {
  total: number;
  packed: number;
  buy: number;
}

/** Progress counts only what is on the active list: suggestions that apply and are not removed, plus the visitor's own items. */
export function progressOf(state: PlannerState, entries: Entry[]): Progress {
  const total = entries.length + state.custom.length;
  const packed =
    entries.filter((e) => e.packed).length + state.custom.filter((c) => c.packed).length;
  const buy = entries.filter((e) => e.buy).length + state.custom.filter((c) => c.buy).length;
  return { total, packed, buy };
}

/** Does a saved list differ from a preset in a way the visitor should be asked about? */
export function conflictsWithPreset(
  state: PlannerState,
  preset: { tripType?: string | undefined; days?: number | undefined; dogs?: number | undefined },
): boolean {
  if (!state.built) return false;
  return (
    (preset.tripType !== undefined && preset.tripType !== state.trip.tripType) ||
    (preset.days !== undefined && preset.days !== state.trip.days) ||
    (preset.dogs !== undefined && preset.dogs !== state.trip.dogs)
  );
}
