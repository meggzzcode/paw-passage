import { places as contentPlaces } from "virtual:content";
import { site } from "@/config/site";
import { placeIsPublic } from "./publish-rule";
import type { Place } from "./schema";

export type { Place } from "./schema";
export { placeIsPublic, placeNeedsRecheck } from "./publish-rule";

export const placeKindLabels: Record<Place["kind"], string> = {
  "state-park": "State park",
  "national-park": "National park",
  "national-forest": "National forest",
  "county-park": "County park",
  "city-park": "City park",
  beach: "Beach",
  trail: "Trail",
};

export const ruleLabels: Record<"yes" | "leash" | "no" | "some", string> = {
  yes: "Dogs allowed",
  leash: "Allowed on a leash",
  no: "Not allowed",
  some: "Allowed in some places",
};

/**
 * Places visible in this build. Production: verified places only (the build step already leaves the
 * rest out of the code). Development and private preview builds also show unverified places, badged.
 */
export function visiblePlaces(opts: { includeUnverified?: boolean } = {}): Place[] {
  const includeUnverified = opts.includeUnverified ?? site.showDraftGuides;
  const all = contentPlaces as Place[];
  const seen = new Set<string>();
  for (const p of all) {
    if (seen.has(p.slug)) throw new Error(`Two places share the web address "${p.slug}".`);
    seen.add(p.slug);
  }
  return all.filter((p) => placeIsPublic(p) || includeUnverified).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPlace(slug: string, opts: { includeUnverified?: boolean } = {}): Place | undefined {
  return visiblePlaces(opts).find((p) => p.slug === slug);
}

const TRAIL_OR_BEACH = /trail|beach|shore|rim|path|sand/i;
/** Whether dogs may use the place's trails or beaches, read from its dog-rule rows. "unclear" means the rows do not say. */
export function dogsOnTrailsOrBeaches(p: Pick<Place, "kind" | "dogsAllowed">): "yes" | "no" | "unclear" {
  let rows = p.dogsAllowed.filter((d) => TRAIL_OR_BEACH.test(d.area));
  if (rows.length === 0 && (p.kind === "trail" || p.kind === "beach")) rows = p.dogsAllowed;
  if (rows.length === 0) return "unclear";
  if (rows.some((r) => r.rule !== "no")) return "yes";
  return "no";
}

export interface PlaceFilters { q: string; state: string; kind: string; trails: string }
export const defaultPlaceFilters: PlaceFilters = { q: "", state: "", kind: "", trails: "" };

export function filterPlaces(all: Place[], f: PlaceFilters): Place[] {
  const q = f.q.trim().toLowerCase();
  return all.filter((p) => {
    if (f.state && p.state !== f.state) return false;
    if (f.kind && p.kind !== f.kind) return false;
    if (f.trails === "yes" && dogsOnTrailsOrBeaches(p) !== "yes") return false;
    if (f.trails === "no" && dogsOnTrailsOrBeaches(p) !== "no") return false;
    if (q && !`${p.name} ${p.managedBy} ${placeKindLabels[p.kind]}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
