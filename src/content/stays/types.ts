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
  bathrooms: number | null;
  /** Bed lines, e.g. "Bedroom 1: 1 king bed". */
  beds: string[];
  /** Amenities from the listing, grouped (kitchen, comfort, outdoors...). Only what the listing states. */
  amenityGroups: { title: string; items: string[] }[];
  /** The setting in a sentence or two, and distances to town and sights. */
  locationNote?: string;
  distances: string[];
  checkIn?: string;
  checkOut?: string;
  minimumStay?: string;
  cancellation?: string;
  /** Stairs, parking, steep drive, accessibility. */
  accessNotes: string[];
  /** Non-pet house rules (smoking, quiet hours...). */
  generalRules: string[];
  /** Paraphrased heads-ups from the listing's guest reviews. */
  guestNotes: string[];
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
  /** Name of a built-in photo, or leave empty when imageUpload is used. */
  image?: string;
  imageUpload?: string;
  /** Where the facts came from (listing URL, host email, etc.) */
  sourceUrl: string;
  lastVerified: string | null; // YYYY-MM-DD
  photoPermission: boolean;
  /** Key into src/content/affiliates.ts. Booking button appears only if that link is approved. */
  affiliateId?: string;
  sponsored?: { active: boolean; placement: "top" | "featured"; until?: string };
}
