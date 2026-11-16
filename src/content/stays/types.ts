import type { ImageKey } from "@/lib/images";

export type StayType = "cabin" | "vacation-home" | "cottage" | "beach-house" | "unique";
export type VerificationStatus = "verified" | "unverified" | "sample";
export type FeeBasis = "stay" | "night" | "dog" | "dog-night";

export interface PetFee {
  amount: number; // USD
  basis: FeeBasis;
}

export interface Stay {
  slug: string;
  name: string;
  /** Only "verified" stays are ever shown on the live site. "sample" = preview only. */
  status: VerificationStatus;
  type: StayType;
  state: "georgia" | "california";
  town: string; // town slug from destinations
  summary: string;
  description: string;
  sleeps: number | null;
  bedrooms: number | null;
  maxDogs: number | null; // null = not confirmed
  largeDogsOk: boolean | null;
  weightLimitLbs: number | null;
  fencedYard: "full" | "partial" | "none" | null;
  fenceNotes?: string;
  privateOutdoor: boolean | null;
  /** null = not confirmed; { amount: 0 } = confirmed no pet fee */
  petFee: PetFee | null;
  breedRestrictions: boolean | null; // false = confirmed none stated
  beach: boolean;
  mountain: boolean;
  hotTub: boolean | null;
  nearby: string[];
  houseRules: string[];
  image: ImageKey;
  /** Where the facts came from (listing URL, host email, etc.) */
  sourceUrl: string;
  lastVerified: string | null; // YYYY-MM-DD
  photoPermission: boolean;
  /** Key into src/content/affiliates.ts. Booking button appears only if that link is approved. */
  affiliateId?: string;
  sponsored?: { active: boolean; placement: "top" | "featured"; until?: string };
}
