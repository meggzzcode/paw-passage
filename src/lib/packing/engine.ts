// The packing planner's rules, kept apart from the screen. Pure and deterministic: the same trip and the same
// content always give the same list (no randomness, no AI, no network). Content comes from content/packing.yml.
import type { PackingConfig, PackingItem, PackingProductEntry, PackingWhen } from "./schema";

export const MIN_DAYS = 1;
export const MAX_DAYS = 30;
export const MIN_DOGS = 1;
export const MAX_DOGS = 5;
export const MAX_MEALS = 6;

export interface Trip {
  tripType: string;
  /** Whole days away, counting the first and last day. */
  days: number;
  dogs: number;
  /** Conditions the visitor ticked. Conditions implied by the trip type are added by effectiveConditions(). */
  conditions: string[];
  /** Optional: meals per dog per day, from the visitor's own schedule. null = not given. */
  mealsPerDay: number | null;
}

export const DEFAULT_TRIP_TYPE = "cabin";

export function defaultTrip(): Trip {
  return { tripType: DEFAULT_TRIP_TYPE, days: 3, dogs: 1, conditions: [], mealsPerDay: null };
}

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Whole number within a range; anything that is not a number gives the fallback. */
export function clampInt(v: unknown, lo: number, hi: number, fallback: number): number {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return clamp(Math.round(n), lo, hi);
}

/** A trip made safe to use: unknown trip types and conditions are dropped, numbers are clamped. */
export function normalizeTrip(input: Partial<Trip> | null | undefined, cfg: PackingConfig): Trip {
  const base = defaultTrip();
  const tripIds = new Set(cfg.tripTypes.map((t) => t.id));
  const condIds = new Set(cfg.conditions.map((c) => c.id));
  const tripType =
    typeof input?.tripType === "string" && tripIds.has(input.tripType)
      ? input.tripType
      : tripIds.has(base.tripType)
        ? base.tripType
        : (cfg.tripTypes[0]?.id ?? base.tripType);
  const conditions = Array.isArray(input?.conditions)
    ? [
        ...new Set(
          input.conditions.filter((c): c is string => typeof c === "string" && condIds.has(c)),
        ),
      ]
    : [];
  const meals = input?.mealsPerDay;
  return {
    tripType,
    days: clampInt(input?.days, MIN_DAYS, MAX_DAYS, base.days),
    dogs: clampInt(input?.dogs, MIN_DOGS, MAX_DOGS, base.dogs),
    conditions,
    mealsPerDay:
      meals === null || meals === undefined ? null : clampInt(meals, 1, MAX_MEALS, 0) || null,
  };
}

/** Ticked conditions plus the ones the trip type brings with it, in the order the content lists them. */
export function effectiveConditions(trip: Trip, cfg: PackingConfig): string[] {
  const implied = cfg.tripTypes.find((t) => t.id === trip.tripType)?.implies ?? [];
  const set = new Set([...trip.conditions, ...implied]);
  return cfg.conditions.map((c) => c.id).filter((id) => set.has(id));
}

export function impliedConditions(tripType: string, cfg: PackingConfig): string[] {
  return cfg.tripTypes.find((t) => t.id === tripType)?.implies ?? [];
}

function whenMatches(w: PackingWhen, trip: Trip, conds: Set<string>): boolean {
  if (w.tripTypes && w.tripTypes.length > 0 && !w.tripTypes.includes(trip.tripType)) return false;
  if (w.anyConditions && w.anyConditions.length > 0 && !w.anyConditions.some((c) => conds.has(c)))
    return false;
  if (w.allConditions && !w.allConditions.every((c) => conds.has(c))) return false;
  if (w.unlessConditions && w.unlessConditions.some((c) => conds.has(c))) return false;
  if (w.minDays !== undefined && trip.days < w.minDays) return false;
  if (w.maxDays !== undefined && trip.days > w.maxDays) return false;
  return true;
}

function hasRule(w: PackingWhen): boolean {
  return (
    (w.tripTypes?.length ?? 0) > 0 ||
    (w.anyConditions?.length ?? 0) > 0 ||
    (w.allConditions?.length ?? 0) > 0 ||
    (w.unlessConditions?.length ?? 0) > 0 ||
    w.minDays !== undefined ||
    w.maxDays !== undefined
  );
}

export type Inclusion = "essential" | "conditional" | "consider";

/** How an item relates to this trip: on the list (and why), or not on the list. */
export function inclusionFor(item: PackingItem, trip: Trip, cfg: PackingConfig): Inclusion | null {
  if (item.active === false) return null;
  if (item.appears === "essential") return "essential";
  const conds = new Set(effectiveConditions(trip, cfg));
  const matches = hasRule(item.when) && whenMatches(item.when, trip, conds);
  if (item.appears === "conditional") return matches ? "conditional" : null;
  return matches ? "consider" : null;
}

function categoryOrder(cfg: PackingConfig): Map<string, number> {
  return new Map(cfg.categories.map((c, i) => [c.id, c.order * 1000 + i]));
}

/** Items in display order: category order, then the item's own order, then the file order. */
export function sortedItems(cfg: PackingConfig): PackingItem[] {
  const cats = categoryOrder(cfg);
  return cfg.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => cats.has(item.category))
    .sort(
      (a, b) =>
        cats.get(a.item.category)! - cats.get(b.item.category)! ||
        a.item.order - b.item.order ||
        a.index - b.index,
    )
    .map(({ item }) => item);
}

export interface Suggested {
  item: PackingItem;
  inclusion: Inclusion;
}

/** What the rules put on the list for this trip, in display order. */
export function suggestFor(trip: Trip, cfg: PackingConfig): Suggested[] {
  const out: Suggested[] = [];
  for (const item of sortedItems(cfg)) {
    const inclusion = inclusionFor(item, trip, cfg);
    if (inclusion) out.push({ item, inclusion });
  }
  return out;
}

/** Optional items that are not on the list for this trip: offered, never added by themselves. */
export function ideasFor(trip: Trip, cfg: PackingConfig): PackingItem[] {
  const onList = new Set(suggestFor(trip, cfg).map((s) => s.item.id));
  return sortedItems(cfg).filter(
    (i) => i.active !== false && i.appears === "optional" && !onList.has(i.id),
  );
}

export interface QuantityResult {
  /** What to show, e.g. "2 beds" or "12 meal portions". Empty when the item has no suggested quantity. */
  text: string;
  /** How it was worked out, when that is useful to show ("2 dogs x 3 days x 2 meals a day"). */
  detail?: string;
}

const plural = (n: number, unit: string) =>
  n === 1 ? unit : /(s|sh|ch|x)$/.test(unit) ? `${unit}es` : `${unit}s`;
const withNote = (text: string, note?: string) => (note ? `${text}, ${note}` : text);

/**
 * The suggested quantity for one item. One strategy per item (no single formula): the content chooses.
 * Food is a planning calculation from the visitor's own schedule. Nothing here works out a dose, a weight,
 * calories or a water volume.
 */
export function quantityFor(item: PackingItem, trip: Trip): QuantityResult {
  const q = item.quantity;
  const { dogs, days } = trip;
  switch (q.strategy) {
    case "fixed": {
      const n = q.count ?? 1;
      return { text: withNote(`${n} ${plural(n, q.unit ?? "item")}`, q.note) };
    }
    case "perDog": {
      const n = (q.count ?? 1) * dogs;
      return {
        text: withNote(`${n} ${plural(n, q.unit ?? "item")}`, q.note),
        ...(dogs > 1 ? { detail: `${q.count ?? 1} for each of your ${dogs} dogs` } : {}),
      };
    }
    case "perDay": {
      let n = (q.count ?? 1) * days;
      if (q.min !== undefined) n = Math.max(n, q.min);
      if (q.max !== undefined) n = Math.min(n, q.max);
      return { text: withNote(`${n} ${plural(n, q.unit ?? "item")}`, q.note) };
    }
    case "perDogPerDay": {
      let n = (q.count ?? 1) * dogs * days;
      if (q.min !== undefined) n = Math.max(n, q.min);
      if (q.max !== undefined) n = Math.min(n, q.max);
      return {
        text: withNote(`${n} ${plural(n, q.unit ?? "item")}`, q.note),
        detail: `${q.count ?? 1} per dog per day over ${days} ${plural(days, "day")} for ${dogs} ${plural(dogs, "dog")}, with a floor of ${q.min ?? 0}. Change it to what suits you.`,
      };
    }
    case "dogDays": {
      const n = dogs * days;
      return {
        text: withNote(`${n} ${q.unit ?? "dog-days"}`, q.note),
        detail: `${dogs} ${plural(dogs, "dog")} x ${days} ${plural(days, "day")}`,
      };
    }
    case "meals": {
      if (trip.mealsPerDay) {
        const n = dogs * days * trip.mealsPerDay;
        return {
          text: withNote(`${n} ${plural(n, q.unit ?? "meal portion")}`, q.note),
          detail: `${dogs} ${plural(dogs, "dog")} x ${days} ${plural(days, "day")} x ${trip.mealsPerDay} ${plural(trip.mealsPerDay, "meal")} a day. A planning calculation from the schedule you entered, not a feeding amount.`,
        };
      }
      const n = dogs * days;
      return {
        text: `${n} ${plural(n, "dog-day")} of food`,
        detail: `${dogs} ${plural(dogs, "dog")} x ${days} ${plural(days, "day")}. Add your dogs' meals per day above to count meal portions instead.`,
      };
    }
    case "text":
      return { text: q.text ?? "" };
    default:
      return { text: "" };
  }
}

/** Does a product entry apply to this trip? (Suitability is only what the content states, never inferred.) */
export function productEntryApplies(
  entry: PackingProductEntry,
  trip: Trip,
  cfg: PackingConfig,
): boolean {
  const conds = new Set(effectiveConditions(trip, cfg));
  if (entry.onlyConditions && entry.onlyConditions.length > 0)
    if (!entry.onlyConditions.some((c) => conds.has(c))) return false;
  if (entry.unlessConditions && entry.unlessConditions.some((c) => conds.has(c))) return false;
  return true;
}

/** A short summary of the trip, e.g. "3 days · 2 dogs · Hiking or outdoors, Cold or snowy weather". */
export function tripSummaryLine(trip: Trip, cfg: PackingConfig): string {
  const conds = effectiveConditions(trip, cfg);
  const labels = conds.map((id) =>
    shortConditionLabel(cfg.conditions.find((c) => c.id === id)?.label ?? id),
  );
  const parts = [
    `${trip.days} ${plural(trip.days, "day")}`,
    `${trip.dogs} ${plural(trip.dogs, "dog")}`,
  ];
  if (labels.length) parts.push(labels.join(", "));
  return parts.join(" · ");
}

/** "We're driving" reads as a trip fact in a summary line, so labels are used as written except long ones. */
export function shortConditionLabel(label: string): string {
  return label;
}

export function tripTitle(trip: Trip, cfg: PackingConfig): string {
  return cfg.tripTypes.find((x) => x.id === trip.tripType)?.listTitle ?? "Your packing list";
}
