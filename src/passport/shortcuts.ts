// Quick discovery shortcuts. Each one is only a preset of the existing SessionFilters (plus, for a few, one plain
// extra check on the adventure's own time or cost), run through the existing engine: hard suitability first, then the
// filters, then ranking. Nothing here is a new recommendation system. For visitors without the full Passport, a
// shortcut either filters the public previews (same fields the /previews page uses) or leads to the free intro quiz;
// it never touches premium content.
import type { PreviewItem } from "@/lib/previews";
import { filterPreviews, type PreviewFilters } from "@/passport/preview-view";
import type { SessionFilters } from "@/passport/profile";
import type { Adventure } from "@/passport/schema";

export type ShortcutSlug =
  | "ten-minutes"
  | "rainy-day"
  | "no-spend"
  | "weekend"
  | "doggy-dates"
  | "family"
  | "gentle"
  | "playful"
  | "creative"
  | "surprise";

export type Shortcut = {
  slug: ShortcutSlug;
  label: string;
  blurb: string;
  /** A plain symbol for the tile (decorative). */
  mark: string;
  /** The engine preset. */
  filters: SessionFilters;
  /** One plain extra check on the adventure's own facts, for what SessionFilters cannot say. */
  refine?: (a: Adventure) => boolean;
  /**
   * What the public previews can honestly say for this shortcut. `null` means the previews carry nothing to filter
   * on, so a free visitor is taken to the free intro quiz instead.
   */
  preview: { filters: PreviewFilters; refine?: (i: PreviewItem) => boolean } | null;
  /** "Surprise us" draws one mystery adventure instead of listing matches. */
  surprise?: boolean;
};

export const SHORTCUTS: readonly Shortcut[] = [
  {
    slug: "ten-minutes",
    label: "We have 10 minutes",
    blurb: "Short and sweet, 15 minutes at most",
    mark: "10",
    filters: { minutes: 10, quick: true },
    preview: {
      filters: {},
      refine: (i) => i.minutesMin <= 10 && i.minutesMax <= 15,
    },
  },
  {
    slug: "rainy-day",
    label: "Rainy-day adventures",
    blurb: "Indoors, or fine in the rain",
    mark: "☂",
    filters: { setting: "indoor", weather: "rain" },
    preview: { filters: { setting: "indoor" } },
  },
  {
    slug: "no-spend",
    label: "No additional spending",
    blurb: "Nothing to buy",
    mark: "$0",
    filters: { budget: 0 },
    refine: (a) => a.costMax === 0,
    preview: { filters: { budget: "free" } },
  },
  {
    slug: "weekend",
    label: "Weekend adventures",
    blurb: "Longer outings, an hour or more",
    mark: "☀",
    filters: {},
    refine: (a) => a.minutesMax >= 60,
    preview: { filters: {}, refine: (i) => i.minutesMax >= 60 },
  },
  {
    slug: "doggy-dates",
    label: "Doggy dates",
    blurb: "Treat-yourselves time together",
    mark: "♥",
    filters: { collection: "doggy-date-club" },
    preview: { filters: {}, refine: (i) => i.collections.includes("doggy-date-club") },
  },
  {
    slug: "family",
    label: "Family adventures",
    blurb: "Good for the whole household",
    mark: "⌂",
    filters: { household: ["family"] },
    // Previews do not say who can join in, so free visitors start with the intro quiz.
    preview: null,
  },
  {
    slug: "gentle",
    label: "Gentle experiences",
    blurb: "Calm, easy and unhurried",
    mark: "☾",
    filters: { energy: ["gentle"], quiet: true },
    preview: { filters: {}, refine: (i) => i.effort === "gentle" },
  },
  {
    slug: "playful",
    label: "Playful experiences",
    blurb: "Games and good silliness",
    mark: "★",
    filters: { types: ["play-and-games"] },
    preview: { filters: {}, refine: (i) => i.category === "Play and games" },
  },
  {
    slug: "creative",
    label: "Creative activities",
    blurb: "Make something together",
    mark: "✎",
    filters: { types: ["creative-projects"] },
    preview: { filters: {}, refine: (i) => i.category === "Creative projects" },
  },
  {
    slug: "surprise",
    label: "Surprise us",
    blurb: "One mystery adventure",
    mark: "?",
    filters: {},
    preview: null,
    surprise: true,
  },
];

export const shortcutBySlug = (slug: string): Shortcut | undefined =>
  SHORTCUTS.find((s) => s.slug === slug);

/** The previews that match a shortcut. Empty for a shortcut that has no honest preview filter. */
export function previewMatches(s: Shortcut, items: readonly PreviewItem[]): PreviewItem[] {
  if (!s.preview) return [];
  const base = filterPreviews(items, s.preview.filters);
  const extra = s.preview.refine;
  return extra ? base.filter(extra) : base;
}

/** Applies the shortcut's own extra check to an engine result. Hard suitability was already applied by the engine. */
export const refineAdventures = <T extends { adventure: Adventure }>(
  s: Shortcut,
  ranked: T[],
): T[] => (s.refine ? ranked.filter((r) => s.refine?.(r.adventure)) : ranked);
