// Today's contextual choices for a customer on Discover ("Where are we today?" + "Something that fits our day").
// This is NOT another recommender. Every pick still comes from the engine (rank / pickSurprise), so hard suitability rules
// (eligibility, unknown never safe) run first; today's choices only NARROW what is left and are never silently relaxed.
// Choices are TEMPORARY (this tab session only) and never touch the saved dog or household profile.
//
// One table per group below. Each label is one entry: an honest name, an `enabled` flag and a data rule over the adventure's
// EXISTING fields (reviewed against the real library; see the notes on each entry). Rules run AFTER hard eligibility.

import type { Adventure } from "./schema";
import { rank, pickSurprise, type Ctx, type History, type Ranked } from "./engine";
import type { SessionFilters } from "./profile";
import { ctxToFilters, type CtxKey } from "./journal-context";

export type PlaceKey = "home" | "park" | "walk" | "getaway" | "anywhere";
export type PrefKey = "quick" | "no-spend" | "no-treats" | "brain" | "quiet" | "play";

// ---------- Rules ----------

type Cond = {
  f: string;
  op: "eq" | "ne" | "lte" | "includes" | "excludes";
  v: string | number | boolean;
};
/** `all` (AND of conditions) is the set; `allowIds` ADDS to it (or IS the set when `all` is absent); `denyIds` always removes. */
export type Rule = { all?: Cond[]; allowIds?: string[]; denyIds?: string[] };

function field(a: Adventure, f: string): unknown {
  if (f === "supplies.length") return a.supplies.length;
  const idx = /^activityTypes\.indexOf\((.+)\)$/.exec(f);
  if (idx) return a.activityTypes.indexOf(idx[1] as Adventure["activityTypes"][number]);
  return (a as Record<string, unknown>)[f];
}
function cond(a: Adventure, c: Cond): boolean {
  const x = field(a, c.f);
  switch (c.op) {
    case "eq":
      return x === c.v;
    case "ne":
      return x !== c.v;
    case "lte":
      return typeof x === "number" && x >= 0 && x <= (c.v as number);
    case "includes":
      return Array.isArray(x) && x.includes(c.v);
    case "excludes":
      return Array.isArray(x) && !x.includes(c.v);
  }
}
export function ruleMatches(r: Rule, a: Adventure): boolean {
  if (r.denyIds?.includes(a.id)) return false;
  const base = r.all ? r.all.every((c) => cond(a, c)) : false;
  return base || (r.allowIds?.includes(a.id) ?? false);
}

export type PlaceOption = {
  key: PlaceKey;
  /** Honest displayed name (the tile label). */
  label: string;
  emoji: string;
  enabled: boolean;
  /** Rule over EXISTING adventure fields. */
  rule: Rule;
  /** Contextual wording for the "Surprise us" button. */
  surprise: string;
};

export type PrefOption = {
  key: PrefKey;
  label: string;
  emoji: string;
  enabled: boolean;
  /** Preferences in the same group are alternatives (any of them); different groups combine (all of them). */
  group: "kind" | "own";
  rule: Rule;
};

const all = (...all: Cond[]): Rule => ({ all });

export const PLACE_OPTIONS: PlaceOption[] = [
  {
    key: "home",
    label: "At home",
    emoji: "🏡",
    enabled: true,
    // Own yard, porch and balcony cards count as home. One street walk mis-tagged "transport none" is denied.
    rule: {
      ...all({ f: "transport", op: "eq", v: "none" }, { f: "places", op: "includes", v: "home" }),
      denyIds: ["adv-h3q6j8"],
    },
    surprise: "Surprise us at home",
  },
  {
    key: "park",
    label: "At the park",
    emoji: "🌳",
    enabled: true,
    // No field says "park": a reviewed list of ordinary leash-on public-park adventures. Never "outdoor and not car".
    rule: {
      allowIds: [
        "adv-m53p4q",
        "adv-kbq7z3",
        "adv-m16g7x",
        "adv-5g9x4p",
        "adv-k3d9v2",
        "adv-q8w3c5",
        "adv-efxova",
        "adv-k7p3g6",
        "adv-9p4c7k",
        "adv-9m2r5w",
        "adv-z7xpml",
      ],
    },
    surprise: "Surprise us outdoors",
  },
  {
    key: "walk",
    label: "On a walk",
    emoji: "🥾",
    enabled: true,
    rule: {
      ...all(
        { f: "setting", op: "eq", v: "outdoor" },
        { f: "transport", op: "eq", v: "walkable" },
        { f: "energy", op: "ne", v: "lively" },
        { f: "dogMobility", op: "ne", v: "high" },
        { f: "ownerMobility", op: "ne", v: "long-walk" },
      ),
      denyIds: ["adv-efxova", "adv-9s4q7b", "adv-k4b8h5", "adv-e2paoq", "adv-7h9t5j", "adv-q8w3c5"],
    },
    surprise: "Surprise us outdoors",
  },
  {
    key: "getaway",
    label: "On a day trip or getaway",
    emoji: "🧳",
    enabled: true,
    rule: all({ f: "transport", op: "eq", v: "car" }),
    surprise: "Surprise us!",
  },
  {
    key: "anywhere",
    label: "Anywhere",
    emoji: "🗺️",
    enabled: true,
    rule: { all: [] },
    surprise: "Surprise us!",
  },
];

export const PREF_OPTIONS: PrefOption[] = [
  {
    key: "quick",
    label: "Quick & easy",
    emoji: "⏱️",
    enabled: true,
    group: "own",
    // 20 minutes or less (minutesMax, not the engine's minutesMin), little prep, a short supply list.
    rule: all(
      { f: "minutesMax", op: "lte", v: 20 },
      { f: "prep", op: "ne", v: "some" },
      { f: "supplies.length", op: "lte", v: 4 },
    ),
  },
  {
    key: "no-spend",
    label: "No spending",
    emoji: "🆓",
    enabled: true,
    group: "own",
    rule: all({ f: "costMax", op: "eq", v: 0 }),
  },
  {
    key: "no-treats",
    label: "No treats needed",
    emoji: "🦴",
    enabled: true,
    group: "own",
    rule: {
      ...all({ f: "food", op: "eq", v: false }, { f: "requires", op: "excludes", v: "treats" }),
      denyIds: ["adv-k8s4n1"],
    },
  },
  {
    key: "brain",
    label: "Brain games",
    emoji: "🧩",
    enabled: true,
    group: "kind",
    rule: {
      ...all({ f: "activityTypes", op: "includes", v: "problem-solving" }),
      denyIds: [
        "adv-v7m2c8",
        "adv-8t3j9q",
        "adv-ej0eya",
        "adv-ejbg17",
        "adv-h2w8p5",
        "adv-h3q6j8",
        "adv-k8s4n1",
        "adv-or9d3m",
      ],
    },
  },
  {
    key: "quiet",
    label: "Quiet moments",
    emoji: "🤫",
    enabled: true,
    group: "own",
    rule: all(
      { f: "energy", op: "eq", v: "gentle" },
      { f: "noise", op: "eq", v: "quiet" },
      { f: "crowd", op: "eq", v: "none" },
      { f: "strangers", op: "eq", v: false },
      { f: "otherDogs", op: "eq", v: false },
      { f: "activityTypes", op: "includes", v: "relaxation" },
    ),
  },
  {
    key: "play",
    label: "Let's play",
    emoji: "🎾",
    enabled: true,
    group: "kind",
    rule: {
      ...all(
        { f: "activityTypes", op: "includes", v: "play-and-games" },
        { f: "activityTypes.indexOf(play-and-games)", op: "lte", v: 1 },
      ),
      allowIds: ["adv-q6v2s9", "adv-l5c8m3", "adv-q4m7k2"],
      denyIds: [
        "adv-s3d8f6",
        "adv-5b5d2u",
        "adv-9v7c2z",
        "adv-d8cz2k",
        "adv-m9f2d7",
        "adv-5t8m2c",
        "adv-6b9r1e",
        "adv-6d9p2s",
      ],
    },
  },
];

/** A label is shown only when the visible library has at least this many matching cards (before eligibility). */
export const VISIBLE_MIN = 3;

export function visiblePlaces(
  library: Adventure[],
  all: PlaceOption[] = PLACE_OPTIONS,
): PlaceOption[] {
  return all.filter(
    (o) =>
      o.enabled &&
      (o.key === "anywhere" || library.filter((a) => ruleMatches(o.rule, a)).length >= VISIBLE_MIN),
  );
}
export function visiblePrefs(library: Adventure[], all: PrefOption[] = PREF_OPTIONS): PrefOption[] {
  return all.filter(
    (o) => o.enabled && library.filter((a) => ruleMatches(o.rule, a)).length >= VISIBLE_MIN,
  );
}

// ---------- Today's state (temporary) ----------

export type TodayState = {
  place: PlaceKey | null;
  prefs: PrefKey[];
  /** Today's advanced session filters (time, budget, effort, transport, household ...). One state shared with the filter panel. */
  filters: SessionFilters;
};
export const EMPTY_TODAY: TodayState = { place: null, prefs: [], filters: {} };

const STORE_KEY = "pp.today.v2";

export function readToday(): TodayState {
  try {
    const v = JSON.parse(window.sessionStorage.getItem(STORE_KEY) ?? "null") as TodayState | null;
    if (v && typeof v === "object" && v.filters && typeof v.filters === "object")
      return {
        place: PLACE_OPTIONS.some((p) => p.key === v.place) ? v.place : null,
        prefs: (Array.isArray(v.prefs) ? v.prefs : []).filter((k) =>
          PREF_OPTIONS.some((p) => p.key === k),
        ),
        filters: v.filters,
      };
  } catch {
    /* blocked or unreadable storage: start fresh */
  }
  return EMPTY_TODAY;
}
export function writeToday(s: TodayState | null) {
  try {
    if (s && (s.place || s.prefs.length || Object.keys(s.filters).length))
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify(s));
    else window.sessionStorage.removeItem(STORE_KEY);
  } catch {
    /* storage is only a convenience */
  }
}

export const togglePref = (s: TodayState, k: PrefKey): TodayState => ({
  ...s,
  prefs: s.prefs.includes(k) ? s.prefs.filter((x) => x !== k) : [...s.prefs, k],
});

/** Where a Journal ?ctx= link starts on the tiles and chips. The remaining filters stay ordinary, removable filters. */
const CTX_PLACE: Partial<Record<CtxKey, PlaceKey>> = {
  "at-home": "home",
  "rainy-day": "home",
  weekend: "getaway",
  "doggy-date": "walk",
  family: "park",
};

export function ctxToToday(key: CtxKey, places: PlaceOption[] = PLACE_OPTIONS): TodayState {
  const want = CTX_PLACE[key];
  const ok = want && places.some((p) => p.key === want && p.enabled);
  const f = { ...ctxToFilters(key) };
  const prefs: PrefKey[] = [];
  // Presets that mean "no spending" or "quiet" start on the matching chip instead of a second, overlapping filter.
  if (f.budget === 0) {
    delete f.budget;
    prefs.push("no-spend");
  }
  if (f.quiet) {
    delete f.quiet;
    prefs.push("quiet");
  }
  return { place: ok ? want : null, prefs, filters: f };
}

// ---------- Engine hooks ----------

export const placeOf = (s: TodayState, places: PlaceOption[] = PLACE_OPTIONS) =>
  places.find((p) => p.key === s.place);

/** The library narrowed by today's place and preferences. Hard suitability still runs inside rank/pickSurprise afterwards. */
export function narrowLibrary(
  library: Adventure[],
  s: TodayState,
  tables: { places?: PlaceOption[]; prefs?: PrefOption[] } = {},
): Adventure[] {
  const place = placeOf(s, tables.places);
  const picked = (tables.prefs ?? PREF_OPTIONS).filter((p) => s.prefs.includes(p.key));
  const kinds = picked.filter((p) => p.group === "kind");
  const own = picked.filter((p) => p.group === "own");
  return library.filter(
    (a) =>
      (!place || ruleMatches(place.rule, a)) &&
      (kinds.length === 0 || kinds.some((p) => ruleMatches(p.rule, a))) &&
      own.every((p) => ruleMatches(p.rule, a)),
  );
}

export const SMALL_SET = 4;
type Tables = { places?: PlaceOption[]; prefs?: PrefOption[] };

export type TodayResult =
  | { ok: true; ranked: Ranked[]; total: number; repeats: boolean }
  | { ok: false; reason: "none-eligible" | "too-narrow" };

/** The engine's ranked matches for today's choices. Fresh adventures first; repeats only when nothing new fits. */
export function findToday(
  library: Adventure[],
  ctx: Ctx,
  history: History,
  s: TodayState,
  opts: { seed: string } & Tables,
): TodayResult {
  const lib = narrowLibrary(library, s, opts);
  const fresh = rank(lib, ctx, s.filters, history, { seed: opts.seed });
  if (fresh.ok && fresh.ranked.length > 0)
    return { ok: true, ranked: fresh.ranked, total: fresh.ranked.length, repeats: false };
  const again = rank(lib, ctx, s.filters, history, { seed: opts.seed, includeDone: true });
  if (again.ok && again.ranked.length > 0)
    return { ok: true, ranked: again.ranked, total: again.ranked.length, repeats: true };
  // Nothing at all suits the saved answers (before today's choices): say so differently from "too narrow".
  const base = rank(library, ctx, {}, history, { includeDone: true });
  return {
    ok: false,
    reason: base.ok && base.ranked.length + base.held.length > 0 ? "too-narrow" : "none-eligible",
  };
}

/** A contextual surprise from the existing mystery system, using today's choices as its filters and pool. */
export function surpriseToday(
  library: Adventure[],
  ctx: Ctx,
  history: History,
  s: TodayState,
  opts: { seed: string } & Tables,
): Adventure | null {
  return pickSurprise(
    narrowLibrary(library, s, opts),
    { kind: "all" },
    ctx,
    s.filters,
    history,
    [],
    {
      seed: opts.seed,
      includeDone: false,
    },
  );
}

/** Contextual wording for the Surprise button: at home, outdoors, quiet, else the default. */
export function surpriseLabel(
  s: TodayState,
  places: PlaceOption[] = PLACE_OPTIONS,
  prefs: PrefOption[] = PREF_OPTIONS,
): string {
  const p = placeOf(s, places);
  if (p && p.key !== "anywhere" && p.surprise !== "Surprise us!") return p.surprise;
  if (s.prefs.includes("quiet") && prefs.some((x) => x.key === "quiet" && x.enabled))
    return "Surprise us with something quiet";
  return "Surprise us!";
}

// ---------- Describing and relaxing today's own choices ----------

export type Choice = { id: "place" | PrefKey; label: string };

/** The choices the customer made today (named ones only), in a stable order. */
export function activeChoices(
  s: TodayState,
  places: PlaceOption[] = PLACE_OPTIONS,
  prefs: PrefOption[] = PREF_OPTIONS,
): Choice[] {
  const out: Choice[] = [];
  const p = placeOf(s, places);
  if (p && p.key !== "anywhere") out.push({ id: "place", label: p.label });
  for (const o of prefs) if (s.prefs.includes(o.key)) out.push({ id: o.key, label: o.label });
  return out;
}

export function dropChoice(s: TodayState, id: Choice["id"]): TodayState {
  return id === "place" ? { ...s, place: null } : { ...s, prefs: s.prefs.filter((k) => k !== id) };
}

export type Alternative = { choice: Choice; count: number };

/**
 * When nothing fits, up to two specific ways forward: drop ONE named optional choice of today's. Suitability rules and the
 * saved profile are never part of this, so a safety restriction is never offered for removal.
 */
export function alternatives(
  library: Adventure[],
  ctx: Ctx,
  history: History,
  s: TodayState,
  tables: Tables = {},
): Alternative[] {
  const out: Alternative[] = [];
  for (const c of activeChoices(s, tables.places, tables.prefs)) {
    const r = findToday(library, ctx, history, dropChoice(s, c.id), { seed: "alt", ...tables });
    if (r.ok && !r.repeats) out.push({ choice: c, count: r.total });
  }
  return out.sort((x, y) => y.count - x.count).slice(0, 2);
}

/** Aggregate-only analytics category for today's context (no names, free text or location). */
export function analyticsPlace(s: TodayState): string {
  return s.place ?? "none";
}
