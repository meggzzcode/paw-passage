// Plain-text version of the visitor's list, for "Copy my list". It lists only what is on the active list (items marked
// "Not bringing this" are left out), the packed state, quantities, items to buy and the visitor's own items.
// No product names, links or marketing: it is a packing list, not an advertisement.
import { tripSummaryLine, tripTitle } from "./engine";
import { groupEntries, progressOf, type Entry, type PlannerState } from "./state";
import type { PackingConfig } from "./schema";

export const EXTRAS_LABEL = "Extras you've added";

export function packingText(
  state: PlannerState,
  entries: Entry[],
  cfg: PackingConfig,
  brand = "Paws & Passage",
): string {
  const prog = progressOf(state, entries);
  const lines: string[] = [
    tripTitle(state.trip, cfg),
    tripSummaryLine(state.trip, cfg),
    `${prog.packed} of ${prog.total} items packed`,
    "",
  ];
  const line = (name: string, qty: string, packed: boolean, buy: boolean) =>
    `${packed ? "[x]" : "[ ]"} ${name}${qty ? ` (${qty})` : ""}${buy ? " - need to buy" : ""}`;
  for (const g of groupEntries(entries, cfg)) {
    lines.push(g.category.label.toUpperCase());
    for (const e of g.entries) lines.push(line(e.item.name, e.qtyText, e.packed, e.buy));
    lines.push("");
  }
  if (state.custom.length) {
    lines.push(EXTRAS_LABEL.toUpperCase());
    for (const c of state.custom) lines.push(line(c.name, c.qty, c.packed, c.buy));
    lines.push("");
  }
  const toBuy = [
    ...entries.filter((e) => e.buy).map((e) => e.item.name),
    ...state.custom.filter((c) => c.buy).map((c) => c.name),
  ];
  if (toBuy.length) {
    lines.push("THINGS TO PICK UP BEFORE YOU GO");
    for (const n of toBuy) lines.push(`- ${n}`);
    lines.push("");
  }
  lines.push(`Made with the ${brand} packing planner.`);
  return lines.join("\n");
}
