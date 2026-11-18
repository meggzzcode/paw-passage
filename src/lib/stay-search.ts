import { z } from "zod";

export const staySearchSchema = z.object({
  q: z.string().default("").catch(""),
  state: z.string().default("").catch(""),
  town: z.string().default("").catch(""),
  type: z.string().default("").catch(""),
  dogs: z.number().default(0).catch(0),
  fenced: z.boolean().default(false).catch(false),
  outdoor: z.boolean().default(false).catch(false),
  large: z.boolean().default(false).catch(false),
  multi: z.boolean().default(false).catch(false),
  noFee: z.boolean().default(false).catch(false),
  noBreed: z.boolean().default(false).catch(false),
  beach: z.boolean().default(false).catch(false),
  mountain: z.boolean().default(false).catch(false),
  hotTub: z.boolean().default(false).catch(false),
  airCon: z.boolean().default(false).catch(false),
  grill: z.boolean().default(false).catch(false),
  parking: z.boolean().default(false).catch(false),
  weightMin: z.number().default(0).catch(0),
  sort: z.string().default("recommended").catch("recommended"),
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
