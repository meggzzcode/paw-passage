import type { Stay, StayType } from "@/content/stays/types";

export interface StayFilters {
  q: string;
  state: string; // "" | georgia | california
  town: string;
  type: string; // "" | StayType
  dogs: number; // 0 = any
  fenced: boolean;
  outdoor: boolean;
  large: boolean;
  multi: boolean;
  noFee: boolean;
  noBreed: boolean;
  beach: boolean;
  mountain: boolean;
  hotTub: boolean;
  airCon: boolean;
  grill: boolean;
  parking: boolean;
  /** 0 = any. Otherwise the listing must state a weight limit of at least this many lb. */
  weightMin: number;
  sort: string; // recommended | name | dogs
}

export const defaultFilters: StayFilters = {
  q: "",
  state: "",
  town: "",
  type: "",
  dogs: 0,
  fenced: false,
  outdoor: false,
  large: false,
  multi: false,
  noFee: false,
  noBreed: false,
  beach: false,
  mountain: false,
  hotTub: false,
  airCon: false,
  grill: false,
  parking: false,
  weightMin: 0,
  sort: "recommended",
};

export const stayTypeLabels: Record<StayType, string> = {
  cabin: "Cabin",
  "vacation-home": "Vacation home",
  cottage: "Cottage",
  "beach-house": "Beach house",
  unique: "Unique stay",
};

/** True only when the amenity text the listing gave names it. A missing mention is "not confirmed", never a no. */
function listsAmenity(s: Stay, re: RegExp): boolean {
  return s.amenityGroups.some((g) => g.items.some((i) => re.test(i)));
}

/** A filter only matches when the feature is CONFIRMED. Unknown (null) never passes. */
export function filterStays(stays: Stay[], f: StayFilters): Stay[] {
  const q = f.q.trim().toLowerCase();
  const out = stays.filter((s) => {
    if (
      q &&
      !`${s.name} ${s.town} ${s.state} ${s.summary}`
        .toLowerCase()
        .replace(/-/g, " ")
        .includes(q.replace(/-/g, " "))
    )
      return false;
    if (f.state && s.state !== f.state) return false;
    if (f.town && s.town !== f.town) return false;
    if (f.type && s.type !== f.type) return false;
    if (f.dogs > 0 && !(s.maxDogs !== null && s.maxDogs >= f.dogs)) return false;
    if (f.fenced && s.fencedYard !== "full") return false;
    if (f.outdoor && s.privateOutdoor !== true) return false;
    if (f.large && s.largeDogsOk !== true) return false;
    if (f.multi && !(s.maxDogs !== null && s.maxDogs >= 2)) return false;
    if (f.noFee && !(s.petFee !== null && s.petFee.amount === 0)) return false;
    if (f.noBreed && s.breedRestrictions !== false) return false;
    if (f.beach && !s.beach) return false;
    if (f.mountain && !s.mountain) return false;
    if (f.hotTub && s.hotTub !== true) return false;
    if (f.airCon && !listsAmenity(s, /air.?condition/i)) return false;
    if (f.grill && !listsAmenity(s, /barbecue|\bbbq\b|grill/i)) return false;
    if (f.parking && !listsAmenity(s, /parking/i)) return false;
    // A stated weight limit of at least N lb. No limit stated is "not confirmed", so it never matches.
    if (f.weightMin > 0 && !(s.weightLimitLbs !== null && s.weightLimitLbs >= f.weightMin))
      return false;
    return true;
  });
  const sponsoredFirst = (s: Stay) =>
    s.sponsored?.active && s.sponsored.placement === "top" ? 0 : 1;
  if (f.sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
  else if (f.sort === "dogs") out.sort((a, b) => (b.maxDogs ?? 0) - (a.maxDogs ?? 0));
  else
    out.sort(
      (a, b) =>
        sponsoredFirst(a) - sponsoredFirst(b) ||
        (b.lastVerified ?? "").localeCompare(a.lastVerified ?? ""),
    );
  return out;
}

export function activeFilterCount(f: StayFilters): number {
  const keys: (keyof StayFilters)[] = [
    "fenced",
    "outdoor",
    "large",
    "multi",
    "noFee",
    "noBreed",
    "beach",
    "mountain",
    "hotTub",
    "airCon",
    "grill",
    "parking",
  ];
  return (
    keys.filter((k) => f[k]).length +
    (f.state ? 1 : 0) +
    (f.town ? 1 : 0) +
    (f.type ? 1 : 0) +
    (f.dogs ? 1 : 0) +
    (f.weightMin ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}
