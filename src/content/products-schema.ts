// What content/products.yml must look like. Pure (no "@/" imports) because the build tool loads this file too.
// There is deliberately no price, rating or commission field, and unknown keys are rejected (.strict()).
import { z } from "zod";

/** Category web addresses used by /gear/<category>. A category page exists only once it has products. */
export const gearCategorySlugs = [
  "road-trips", "cabin-vacations", "beach-vacations", "senior-dogs", "large-dogs",
  "multiple-dogs", "travel-safety", "feeding-and-hydration", "travel-comfort",
] as const;
export type GearCategorySlug = (typeof gearCategorySlugs)[number];

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date written YYYY-MM-DD")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "is not a real date");
const httpsUrl = z.string().url("must be a full web address").refine((v) => v.startsWith("https://"), "must start with https://");
const nonEmpty = z.string().trim().min(1, "must not be empty");
const optText = z.string().optional().transform((v) => (v && v.trim() ? v.trim() : undefined));
/** Empty means "not filled in". */
const optUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .pipe(httpsUrl.optional());

export const productRecordSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers and hyphens"),
    name: nonEmpty,
    brand: nonEmpty,
    categories: z.array(z.enum(gearCategorySlugs)).min(1, "pick at least one category"),
    summary: nonEmpty,
    keySpecs: z.array(nonEmpty).default([]),
    specSource: z.object({ title: nonEmpty, url: httpsUrl, publisher: nonEmpty, accessedOn: date }).strict(),
    manufacturerUrl: optUrl,
    retailerUrl: optUrl,
    retailerName: optText,
    lastVerified: date,
    active: z.boolean().default(true),
    affiliateId: optText,
  })
  .strict();

export const productsSchema = z.object({ products: z.array(productRecordSchema).default([]) });
export type ProductRecord = z.infer<typeof productRecordSchema>;
