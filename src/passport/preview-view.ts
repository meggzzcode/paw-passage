// Pure helpers for the public previews: filtering, bookmark counts and the honest local fallback for "what matches".
// Nothing here touches the network. A preview carries no hard-eligibility detail (size, noise, crowds), so a local
// count can only check the basics and must say so.
import type { PreviewItem } from "@/lib/previews";
import type { DogProfile, OwnerPrefs } from "./profile";
import { has, members, type Save } from "./progress";

export type PreviewFilters = {
  time?: 15 | 30 | 60;
  budget?: "free" | 20;
  setting?: "indoor" | "outdoor";
  lifeStage?: "puppy" | "adult" | "senior";
  role?: string;
  energy?: PreviewItem["effort"];
  ownerEffort?: NonNullable<PreviewItem["ownerEffort"]>;
};

export const ROLE_LABELS: Record<string, string> = {
  signature: "Signature",
  everyday: "Everyday",
  lifestyle: "Lifestyle",
  aspirational: "Aspirational",
};

/** Previews that are premium showcase cards (free adventures are reached through the free introductory flow). */
export const premiumPreviews = (items: readonly PreviewItem[]): PreviewItem[] =>
  items.filter((i) => i.access === "premium");

export function filterPreviews(items: readonly PreviewItem[], f: PreviewFilters): PreviewItem[] {
  return items.filter(
    (i) =>
      (f.time === undefined || i.minutesMin <= f.time) &&
      (f.budget === undefined || (f.budget === "free" ? i.costMax === 0 : i.costMax <= f.budget)) &&
      (f.setting === undefined || i.setting === f.setting || i.setting === "either") &&
      (f.lifeStage === undefined || i.lifeStages.includes(f.lifeStage)) &&
      (f.role === undefined || i.role === f.role) &&
      (f.energy === undefined || i.effort === f.energy) &&
      (f.ownerEffort === undefined || i.ownerEffort === f.ownerEffort),
  );
}

/** Saved preview ids on this device that are among the previews actually shown. Never counts anything unverified. */
export function savedPreviews(items: readonly PreviewItem[], save: Save): PreviewItem[] {
  return items.filter((i) => has(save.saved, i.id));
}
/** How many ids are saved on this device in all (previews or not). Used only when the previews cannot be loaded. */
export const savedIdCount = (save: Save): number => members(save.saved).length;

/**
 * The basics of "does this preview fit": life stage, a gentle limit when mobility is limited, food, and a car.
 * Every check needs a KNOWN answer; unknown never rules a preview in or out here, and the caller must say this is
 * not the full check.
 */
export function previewFitsBasics(i: PreviewItem, dog: DogProfile, owner: OwnerPrefs): boolean {
  if (dog.lifeStage && !i.lifeStages.includes(dog.lifeStage)) return false;
  if (dog.limitedMobility === true && i.effort === "lively") return false;
  if (dog.foodActivities === "no" && i.needs.food) return false;
  if (owner.hasCar === "no" && i.needs.car) return false;
  return true;
}

/** The profile as sent for a match: counts need no name, notes, dates or breed. */
export function matchPayload(
  dog: DogProfile,
  owner: OwnerPrefs,
): { dog: DogProfile; owner: OwnerPrefs } {
  const {
    name: _n,
    breed: _b,
    restrictions: _r,
    dietaryRestrictions: _d,
    birthday: _bd,
    adoptionDate: _a,
    skipped: _s,
    ...safe
  } = dog;
  return { dog: safe, owner };
}
