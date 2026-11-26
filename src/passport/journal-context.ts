// Starting points for the Adventure Journal's contextual discovery links: /discover?ctx=<key>.
// A preset is a SUGGESTED starting point for today's session filters. It never holds personal data, never overwrites a saved
// profile or a suitability restriction, and never grants extra free adventures. Worker B's quiz and Discover consume this.

import type { SessionFilters } from "./profile";

export type CtxAnswers = Partial<{
  lifeStage: "puppy" | "adult" | "senior" | "mixed";
  energy: "gentle" | "moderate" | "lively" | "variable";
  /** Quiz step 4 ids: sniffing, games, exploring, food, creative, relaxing. */
  enjoy: ("sniffing" | "games" | "exploring" | "food" | "creative" | "relaxing")[];
  where: "home" | "nearby" | "anywhere";
  time: "short" | "medium" | "longer";
  spend: "none" | "inexpensive" | "flexible";
  /** What works for the owner (quiz step 9). */
  owner: "seated" | "easy-walking" | "active";
  /** Optional refinement (quiz step 10). */
  refine: ("quiet" | "kids")[];
}>;

export type CtxPreset = { label: string; answers: CtxAnswers };

export const ctxPresets = {
  "at-home": { label: "At home", answers: { where: "home", time: "short", spend: "none" } },
  "rainy-day": {
    label: "Rainy day",
    answers: { where: "home", enjoy: ["games", "creative", "sniffing"], spend: "inexpensive" },
  },
  weekend: {
    label: "This weekend",
    answers: { where: "anywhere", time: "longer", spend: "flexible" },
  },
  "doggy-date": {
    label: "Doggy date",
    answers: { where: "anywhere", time: "medium", enjoy: ["exploring", "food"], spend: "flexible" },
  },
  "no-spend": { label: "No spend", answers: { spend: "none" } },
  bond: { label: "Bonding", answers: { enjoy: ["games", "sniffing", "relaxing"], time: "short" } },
  puppy: { label: "Puppy", answers: { lifeStage: "puppy", energy: "moderate", time: "short" } },
  senior: {
    label: "Senior dog",
    answers: { lifeStage: "senior", energy: "gentle", enjoy: ["sniffing", "relaxing"] },
  },
  family: { label: "Family time", answers: { refine: ["kids"], where: "nearby", spend: "none" } },
  "high-energy": {
    label: "High energy",
    answers: { energy: "lively", enjoy: ["games", "exploring"], where: "nearby" },
  },
} as const satisfies Record<string, CtxPreset>;

export type CtxKey = keyof typeof ctxPresets;
export const CTX_KEYS = Object.keys(ctxPresets) as CtxKey[];

/** A valid ctx key, or undefined for anything unknown (ignored silently). */
export function parseCtx(value: unknown): CtxKey | undefined {
  return typeof value === "string" && Object.hasOwn(ctxPresets, value)
    ? (value as CtxKey)
    : undefined;
}

/** Internal link for an article's CTA: no personal data, no utm. */
export const discoverHref = (ctx: CtxKey) => `/discover?ctx=${ctx}`;

/**
 * Today's session filters implied by a preset, for entitled customers. They are shown as ordinary, removable filter chips.
 * They only NARROW today's browsing; a saved profile and every mandatory suitability rule stay untouched (the engine still
 * applies hard eligibility before any filter).
 */
export function ctxToFilters(key: CtxKey): SessionFilters {
  const a: CtxAnswers = ctxPresets[key].answers;
  const f: SessionFilters = {};
  if (a.where === "home") f.setting = "indoor";
  if (a.spend === "none") f.budget = 0;
  else if (a.spend === "inexpensive") f.budget = 15;
  if (a.time === "short") f.minutes = 20;
  else if (a.time === "medium") f.minutes = 45;
  if (a.energy === "gentle") f.energy = ["gentle"];
  else if (a.energy === "lively") f.energy = ["lively"];
  else if (a.energy === "moderate") f.energy = ["moderate"];
  if (a.lifeStage === "puppy") f.puppy = true;
  if (a.owner === "seated") f.chair = true;
  if (a.refine?.includes("quiet")) f.quiet = true;
  return f;
}
