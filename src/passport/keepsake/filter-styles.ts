// Registry of the photo filter looks and the rule that picks one per adventure.
// The look is a stable function of the keepsake theme id, so an adventure always opens with the same look, and
// "Try another look" cycles through that adventure's own set of four (its default plus three alternatives).
import { hash } from "./kit";
import type { FilterStyleId } from "./filter-looks";

export type { FilterStyleId };

export interface FilterStyleInfo {
  id: FilterStyleId;
  label: string;
}

/** Ordered so neighbours look different from each other. */
export const FILTER_STYLES: readonly FilterStyleInfo[] = [
  { id: "caption-strip", label: "Caption strip" },
  { id: "corner-polaroid", label: "Polaroid label" },
  { id: "camcorder-rec", label: "Camcorder" },
  { id: "ticket-corner", label: "Ticket stub" },
  { id: "soft-badge", label: "Soft badge" },
  { id: "field-note", label: "Field note" },
];

export const FILTER_STYLE_IDS: readonly FilterStyleId[] = FILTER_STYLES.map((s) => s.id);

export function isFilterStyle(v: unknown): v is FilterStyleId {
  return typeof v === "string" && (FILTER_STYLE_IDS as readonly string[]).includes(v);
}

export function filterStyleLabel(id: FilterStyleId): string {
  return FILTER_STYLES.find((s) => s.id === id)?.label ?? id;
}

/** The four looks an adventure cycles through. The first is its default. Pure and stable. */
export function looksForTheme(themeId: string): FilterStyleId[] {
  const h = hash(`look:${themeId}`);
  const n = FILTER_STYLE_IDS.length;
  const base = h % n;
  const step = ((h >>> 8) & 1) === 0 ? 1 : 5; // coprime with 6, so four distinct looks
  return [0, 1, 2, 3].map((i) => FILTER_STYLE_IDS[(base + i * step) % n] as FilterStyleId);
}

export function defaultLookFor(themeId: string): FilterStyleId {
  return looksForTheme(themeId)[0] as FilterStyleId;
}

/** The next look in the adventure's set after the current one. */
export function nextLook(themeId: string, current: FilterStyleId): FilterStyleId {
  const set = looksForTheme(themeId);
  const i = set.indexOf(current);
  return set[(i + 1) % set.length] as FilterStyleId;
}
