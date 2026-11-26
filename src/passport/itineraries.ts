// Itinerary helpers: look the ids up in the library, apply the same hard eligibility as everywhere else, and find
// out whether the itinerary was already saved as a handpicked collection. Pure functions; no storage here.
import { ITINERARIES, type Itinerary } from "@/config/itineraries";
import { eligibility, type Ctx } from "@/passport/engine";
import type { CustomCollection } from "@/passport/profile";
import type { Adventure } from "@/passport/schema";

export { ITINERARIES };
export type { Itinerary };

export type ItineraryItem =
  | { id: string; kind: "ok"; adventure: Adventure }
  | { id: string; kind: "may-not-suit"; adventure: Adventure; why: string }
  | { id: string; kind: "unavailable" };

/**
 * Each adventure of the itinerary with its verdict for this dog. An adventure that fails a rule, or that still needs
 * an answer (unknown is never safe), is "may-not-suit": it is shown, never planned, never silently treated as fine.
 * An id that is not in the loaded library is "unavailable" and is simply left out of planning.
 */
export function itineraryItems(
  it: Itinerary,
  byId: ReadonlyMap<string, Adventure>,
  ctx: Ctx,
): ItineraryItem[] {
  return it.ids.map((id): ItineraryItem => {
    const adventure = byId.get(id);
    if (!adventure) return { id, kind: "unavailable" };
    const v = eligibility(adventure, ctx);
    if (v.eligible) return { id, kind: "ok", adventure };
    const why = v.reasons[0] ?? (v.confirm[0] ? `We still need to know: ${v.confirm[0]}` : "");
    return { id, kind: "may-not-suit", adventure, why };
  });
}

/** The collection name for an itinerary (collection names are at most 40 characters). */
export const collectionNameFor = (it: Itinerary): string => it.title.slice(0, 40);

/** An existing handpicked collection that already holds exactly this itinerary, so saving never duplicates it. */
export function savedCollectionFor(
  it: Itinerary,
  mine: readonly CustomCollection[],
): CustomCollection | undefined {
  const want = [...it.ids].sort().join("|");
  return mine.find(
    (c) =>
      c.kind === "handpicked" &&
      c.name === collectionNameFor(it) &&
      [...c.ids].sort().join("|") === want,
  );
}
