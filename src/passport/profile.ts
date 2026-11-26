// What we know about the dog and the owner, and what the customer asks for today.
// Every field is optional. A missing value is "unknown", never "safe": unknowns never unlock a restricted adventure
// (see engine eligibility). Breed is a soft hint only and is never used for eligibility.
import type { ActivityType } from "./schema";
import type { Adventure } from "./schema";

export type Tri = "yes" | "no" | "unknown";
export type Comfort = "comfortable" | "nervous" | "unknown";

export type DogProfile = {
  name?: string;
  breed?: string; // free text, "mixed" or "unknown"; soft ranking hint only
  ageYears?: number;
  ageMonths?: number;
  lifeStage?: "puppy" | "adult" | "senior";
  size?: "small" | "medium" | "large";
  energy?: "gentle" | "moderate" | "lively";
  limitedMobility?: boolean; // the owner's own statement, not a medical judgement
  restrictions?: string; // free text note shown to the owner only, never interpreted
  personality?: ("curious" | "playful" | "cozy" | "gentle" | "adventurous")[];
  favoriteTypes?: ActivityType[];
  people?: Comfort; // unfamiliar people
  dogs?: Comfort; // other dogs
  crowds?: Comfort;
  noiseSensitive?: Tri;
  foodActivities?: Tri; // does the dog do food-based activities
  dietaryRestrictions?: string; // free text note for the owner; "no food" is expressed with foodActivities: "no"
  water?: "loves" | "ok" | "avoids" | "unknown";
  swims?: Tri;
  carTravel?: Tri;
  home?: Adventure["homes"][number];
  yard?: Tri;
  birthday?: string; // YYYY-MM-DD, optional
  adoptionDate?: string;
  skipped?: boolean; // the visitor chose to skip the questions for now
};

export type OwnerPrefs = {
  mobility?: Adventure["ownerMobility"]; // the most walking the owner wants: seated | minimal-walking | short-walk | long-walk
  stepFree?: boolean;
  effort?: "low" | "medium" | "high"; // owner physical effort preference
  hasCar?: Tri;
  typicalBudget?: number; // dollars
  prep?: Adventure["prep"]; // the most preparation the owner wants
  preferredTypes?: ActivityType[];
  preferredPlaces?: Adventure["places"];
  supplies?: Adventure["requires"]; // what the owner says they already have
};

/** Today's filters. Multi-select fields are arrays; an empty or missing field means no preference. */
export type SessionFilters = {
  minutes?: number; // available time
  budget?: number; // maximum spend
  setting?: "indoor" | "outdoor";
  types?: ActivityType[];
  energy?: Adventure["energy"][];
  prep?: Adventure["prep"]; // the most preparation wanted today
  haveSupplies?: Adventure["requires"]; // when set, only adventures whose `requires` are all in this list
  transport?: "none-or-walk" | "any";
  places?: Adventure["places"];
  season?: Adventure["seasons"][number];
  weather?: "rain" | "heat" | "cold";
  foodFree?: boolean;
  quiet?: boolean;
  novelty?: "new-only" | "any" | "done-only";
  favoritesOnly?: boolean;
  collection?: string; // a curated collection slug
  // Derived chips: each is computed from fields the adventure already has (no extra upkeep).
  chair?: boolean; // owner can stay seated (ownerMobility "seated")
  quick?: boolean; // 15 minutes or less (minutesMax)
  noYard?: boolean; // does not need a yard
  puppy?: boolean; // suits puppies (lifeStages includes "puppy")
  highEnergy?: boolean; // lively pace or a dog that moves a lot
  household?: ("two-dogs" | "family")[]; // tagged for two dogs and/or families (any of the selected)
};

export type Scope =
  | { kind: "all" }
  | { kind: "made-for-you" }
  | { kind: "curated"; slug: string }
  | { kind: "custom"; id: string }
  | { kind: "favorites" }
  | { kind: "done" };

export type CustomCollection =
  | { id: string; kind: "handpicked"; name: string; ids: string[] }
  | { id: string; kind: "smart"; name: string; filters: SessionFilters };
