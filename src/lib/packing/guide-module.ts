// The "Make this list yours" module that a guide can show with {{planner:cabin}} on a line of its own.
// It is a plain GET form (works without JavaScript, nothing to hydrate) that opens /tools/packing-list with a trip
// type, a number of days and a number of dogs. There is no second packing engine here: the planner page builds the list.
import type { PackingConfig } from "./schema";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const PLANNER_PATH = "/tools/packing-list";
export const MODULE_HEADING = "Make this list yours";
const DAY_CHOICES = [1, 2, 3, 4, 5, 6, 7, 10, 14];
const DOG_CHOICES = [1, 2, 3, 4, 5];

export function moduleCopy(tripId: string, cfg: PackingConfig) {
  const trip = cfg.tripTypes.find((t) => t.id === tripId);
  if (!trip) return undefined;
  const body =
    trip.id === "cabin"
      ? "Heading to a cabin with your dog? Build a packing list for your stay, your plans, and the number of dogs coming."
      : `Heading out on a ${trip.short} with your dog? Build a packing list for your trip, your plans, and the number of dogs coming.`;
  return { heading: MODULE_HEADING, body, cta: `Build my ${trip.short} packing list` };
}

/** HTML for one module, or "" for an unknown trip type (the guide then simply shows nothing). */
export function plannerModuleHtml(tripId: string, cfg: PackingConfig): string {
  const copy = moduleCopy(tripId, cfg);
  if (!copy) return "";
  const id = `pk-guide-${escapeHtml(tripId)}`;
  const options = (values: number[], selected: number) =>
    values
      .map((v) => `<option value="${v}"${v === selected ? " selected" : ""}>${v}</option>`)
      .join("");
  return `<aside class="pk-guide no-print not-prose" data-planner-module="${escapeHtml(tripId)}" aria-labelledby="${id}-h">
<h2 id="${id}-h">${escapeHtml(copy.heading)}</h2>
<p>${escapeHtml(copy.body)}</p>
<form method="get" action="${PLANNER_PATH}">
<input type="hidden" name="trip" value="${escapeHtml(tripId)}">
<label for="${id}-days">Days away<select id="${id}-days" name="days">${options(DAY_CHOICES, 3)}</select></label>
<label for="${id}-dogs">Dogs<select id="${id}-dogs" name="dogs">${options(DOG_CHOICES, 1)}</select></label>
<button type="submit">${escapeHtml(copy.cta)}</button>
</form>
</aside>
`;
}
