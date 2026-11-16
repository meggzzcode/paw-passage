import type { Stay } from "./types";

// SAMPLE STAYS — fictional records used ONLY to preview layouts in development / private preview.
// They are never rendered in production builds, never indexed and never in the sitemap.
export const sampleStays: Stay[] = [
  {
    slug: "sample-ridge-cabin", name: "Sample: Ridge Hollow Cabin", status: "sample", type: "cabin",
    state: "georgia", town: "blue-ridge", summary: "Fictional two-bedroom cabin used to preview the stay layout.",
    description: "This is not a real property. It shows how a verified cabin with a fully fenced yard will appear.",
    sleeps: 4, bedrooms: 2, maxDogs: 2, largeDogsOk: true, weightLimitLbs: null, fencedYard: "full",
    fenceNotes: "Example note: 5 ft wood fence, self-closing gate.", privateOutdoor: true,
    petFee: { amount: 75, basis: "stay" }, breedRestrictions: false, beach: false, mountain: true, hotTub: true,
    nearby: ["Example: national forest trailheads"], houseRules: ["Example: dogs off furniture"],
    image: "mountain-cabin", sourceUrl: "", lastVerified: null, photoPermission: false,
  },
  {
    slug: "sample-orchard-cottage", name: "Sample: Orchard Lane Cottage", status: "sample", type: "cottage",
    state: "georgia", town: "ellijay", summary: "Fictional cottage with a partially fenced yard.",
    description: "Not a real property. Demonstrates how partial fencing and per-dog fees are displayed.",
    sleeps: 2, bedrooms: 1, maxDogs: 1, largeDogsOk: false, weightLimitLbs: 40, fencedYard: "partial",
    privateOutdoor: true, petFee: { amount: 25, basis: "dog-night" }, breedRestrictions: null,
    beach: false, mountain: true, hotTub: false, nearby: [], houseRules: [],
    image: "fenced-yard", sourceUrl: "", lastVerified: null, photoPermission: false,
  },
  {
    slug: "sample-tide-house", name: "Sample: Tideline Beach House", status: "sample", type: "beach-house",
    state: "california", town: "santa-barbara", summary: "Fictional beach house used to preview coastal listings.",
    description: "Not a real property. Shows a stay with no pet fee and beach access.",
    sleeps: 6, bedrooms: 3, maxDogs: 3, largeDogsOk: true, weightLimitLbs: null, fencedYard: "full",
    privateOutdoor: true, petFee: { amount: 0, basis: "stay" }, breedRestrictions: false,
    beach: true, mountain: false, hotTub: null, nearby: [], houseRules: [],
    image: "beach", sourceUrl: "", lastVerified: null, photoPermission: false,
  },
  {
    slug: "sample-headland-retreat", name: "Sample: Headland Retreat", status: "sample", type: "unique",
    state: "california", town: "mendocino", summary: "Fictional bluff-top stay with unconfirmed details.",
    description: "Not a real property. Demonstrates how unconfirmed details show as \"not confirmed\".",
    sleeps: 2, bedrooms: 1, maxDogs: null, largeDogsOk: null, weightLimitLbs: null, fencedYard: null,
    privateOutdoor: null, petFee: null, breedRestrictions: null, beach: true, mountain: false, hotTub: null,
    nearby: [], houseRules: [], image: "coast-bluff", sourceUrl: "", lastVerified: null, photoPermission: false,
  },
];
