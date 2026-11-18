import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";

export const staySearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  state: fallback(z.string(), "").default(""),
  town: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "").default(""),
  dogs: fallback(z.number(), 0).default(0),
  fenced: fallback(z.boolean(), false).default(false),
  outdoor: fallback(z.boolean(), false).default(false),
  large: fallback(z.boolean(), false).default(false),
  multi: fallback(z.boolean(), false).default(false),
  noFee: fallback(z.boolean(), false).default(false),
  noBreed: fallback(z.boolean(), false).default(false),
  beach: fallback(z.boolean(), false).default(false),
  mountain: fallback(z.boolean(), false).default(false),
  hotTub: fallback(z.boolean(), false).default(false),
  airCon: fallback(z.boolean(), false).default(false),
  grill: fallback(z.boolean(), false).default(false),
  parking: fallback(z.boolean(), false).default(false),
  weightMin: fallback(z.number(), 0).default(0),
  sort: fallback(z.string(), "recommended").default("recommended"),
});
export type StaySearch = z.infer<typeof staySearchSchema>;

export const featureFilters = [
  { key: "fenced", label: "Fully fenced yard" },
  { key: "outdoor", label: "Private outdoor space" },
  { key: "large", label: "Large dogs allowed" },
  { key: "multi", label: "Multiple dogs allowed" },
  { key: "noFee", label: "No pet fee" },
  { key: "noBreed", label: "No stated breed restrictions" },
  { key: "beach", label: "Beach access" },
  { key: "mountain", label: "Mountain location" },
  { key: "hotTub", label: "Hot tub" },
  { key: "airCon", label: "Air conditioning (listed)" },
  { key: "grill", label: "Barbecue grill (listed)" },
  { key: "parking", label: "On-site parking (listed)" },
] as const;
export type FeatureKey = (typeof featureFilters)[number]["key"];
