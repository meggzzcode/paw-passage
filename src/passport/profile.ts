// What we know about the dog and the owner, and what the customer asks for today.
// Every field is optional. A missing value is "unknown", never "safe": unknowns never unlock a restricted adventure
// (see engine eligibility). Breed is a soft hint only and is never used for eligibility.
import type { ActivityType } from "./schema";
import type { Adventure } from "./schema";

export type Tri = "yes" | "no" | "unknown";

/** What the dog (or dogs) enjoy, from the intro quiz. A soft ranking preference only: it never overrides eligibility. */
export const ENJOY = ["sniffing", "games", "exploring", "food", "creative", "relaxing"] as const;
export type Enjoy = (typeof ENJOY)[number];
export const ENJOY_TYPES: Record<Enjoy, ActivityType[]> = {
  sniffing: ["scent-and-discovery"],
  games: ["play-and-games", "problem-solving"],
  exploring: ["outdoor-exploration", "travel"],
  food: ["food-and-treats"],
  creative: ["creative-projects", "photography", "memory-making"],
  relaxing: ["relaxation"],
};
export const ENJOY_LABELS: Record<Enjoy, string> = {
  sniffing: "sniffing",
  games: "games",
  exploring: "exploring",
  food: "food",
  creative: "creative projects",
  relaxing: "relaxing",
};

/** "Anything to keep in mind" choices. The first seven map to cautious profile fields; the last three record a non-answer. */
export const KEEP_ITEMS = [
  "mobility",
  "food",
  "water",
  "noise",
  "crowds",
  "dogs",
  "exercise",
  "none",
  "unsure",
  "private",
] as const;
export type KeepItem = (typeof KEEP_ITEMS)[number];

export const WHERE_CHOICES = ["home", "nearby", "anywhere"] as const;
export const TIME_CHOICES = ["short", "medium", "longer"] as const;
export const SPEND_CHOICES = ["none", "inexpensive", "flexible"] as const;

/**
 * One profile can name one dog or several ("Luna and Milo"). Splits on commas, "and" and "&". Display only: the
 * profile stays a single shared one, and the most cautious answer always wins.
 */
export function parseDogNames(name: string | undefined): string[] {
  if (!name) return [];
  return name
    .split(/\s*(?:,|&|\band\b|\+)\s*/i)
    .map((n) => n.trim())
    .filter(Boolean);
}
export const hasManyDogs = (name: string | undefined): boolean => parseDogNames(name).length > 1;
/** The name field as written, or the natural fallback for any number of dogs. */
export const dogWho = (name: string | undefined): string => name?.trim() || "your dog or dogs";
/** One short note for any place a household with several dogs might read. */
export const MULTI_DOG_NOTE =
  "More than one dog? Pick activities that suit every dog. The most cautious answer wins, and food, toy or group games can bring out guarding, so give each dog room.";
export type Comfort = "comfortable" | "nervous" | "unknown";

export type DogProfile = {
  name?: string;
  breed?: string; // free text, "mixed" or "unknown"; soft ranking hint only
  ageYears?: number;
  ageMonths?: number;
  lifeStage?: "puppy" | "adult" | "senior";
  lifeStages?: ("puppy" | "adult" | "senior")[]; // mixed household: an adventure must suit every stage listed
  size?: "small" | "medium" | "large";
  energy?: "gentle" | "moderate" | "lively";
  energyVariable?: boolean; // "it varies": keep to gentle-to-moderate adventures only
  enjoy?: Enjoy[]; // soft ranking preference
  keepInMind?: KeepItem[]; // the quiz's "anything to keep in mind" picks (the cautious fields below are derived from them)
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
  // Intro quiz answers that become today's filters (see starterFilters). Missing = no preference.
  where?: (typeof WHERE_CHOICES)[number];
  time?: (typeof TIME_CHOICES)[number];
  spend?: (typeof SPEND_CHOICES)[number];
  quiet?: boolean;
  kids?: boolean; // children join (adult supervision always; no names or ages are collected)
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
