// Presets arrive as plain URL parameters (for example /tools/packing-list?trip=cabin&days=3&dogs=2) from the guide
// module and from links. Everything is validated and clamped; unknown or malformed values are ignored, so a
// hand-edited address can never put the planner in a broken state or create a new indexable page.
import { MAX_DAYS, MAX_DOGS, MIN_DAYS, MIN_DOGS, clampInt } from "./engine";
import type { PackingConfig } from "./schema";

export interface Preset {
  tripType?: string;
  days?: number;
  dogs?: number;
}

export interface PresetSearch {
  trip?: string;
  days?: number;
  dogs?: number;
}

const wholeNumber = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && /^\d{1,3}$/.test(v.trim())) return Number(v);
  return undefined;
};

/** Search parameters the route accepts. Anything else is dropped. */
export function parsePresetSearch(
  search: Record<string, unknown>,
  cfg: PackingConfig,
): PresetSearch {
  const out: PresetSearch = {};
  const trip = search["trip"];
  if (typeof trip === "string" && cfg.tripTypes.some((t) => t.id === trip)) out.trip = trip;
  const days = wholeNumber(search["days"]);
  if (days !== undefined) out.days = clampInt(days, MIN_DAYS, MAX_DAYS, MIN_DAYS);
  const dogs = wholeNumber(search["dogs"]);
  if (dogs !== undefined) out.dogs = clampInt(dogs, MIN_DOGS, MAX_DOGS, MIN_DOGS);
  return out;
}

export function presetFromSearch(s: PresetSearch): Preset {
  return {
    ...(s.trip !== undefined ? { tripType: s.trip } : {}),
    ...(s.days !== undefined ? { days: s.days } : {}),
    ...(s.dogs !== undefined ? { dogs: s.dogs } : {}),
  };
}

export const hasPreset = (p: Preset) =>
  p.tripType !== undefined || p.days !== undefined || p.dogs !== undefined;
