// What content/products.yml must look like. Pure (no "@/" imports) because the build tool loads this file too.
// There is deliberately no price, rating or commission field, and unknown keys are rejected (.strict()).
import { z } from "zod";

/** Category web addresses used by /gear/<category>. A category page exists only once it has products. */
export const gearCategorySlugs = [
  "road-trips",
  "cabin-vacations",
  "beach-vacations",
  "senior-dogs",
  "large-dogs",
  "travel-safety",
  "feeding-and-hydration",
  "travel-comfort",
  "car-safety",
  "winter-travel",
  "outdoor-adventures",
  "cleaning-and-rental-protection",
] as const;
export type GearCategorySlug = (typeof gearCategorySlugs)[number];

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date written YYYY-MM-DD")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "is not a real date");
const httpsUrl = z
  .string()
  .url("must be a full web address")
  .refine((v) => v.startsWith("https://"), "must start with https://");
const nonEmpty = z.string().trim().min(1, "must not be empty");
const optText = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined));
/** Empty means "not filled in". */
const optUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .pipe(httpsUrl.optional());

/** Who may say a product photo can be shown. "none" (the default) means the card has no photo. */
export const imageRightsValues = ["none", "permitted", "own"] as const;
/** Written when no independent tester is cited. */
export const NO_TESTING_CITED = "none cited";

/** An optional plain retailer link. Both parts empty means "not filled in". */
const altRetailer = z
  .object({ name: z.string().optional().default(""), url: z.string().optional().default("") })
  .strict()
  .optional()
  .transform((v) =>
    v && (v.name.trim() || v.url.trim()) ? { name: v.name.trim(), url: v.url.trim() } : undefined,
  )
  .pipe(z.object({ name: nonEmpty, url: httpsUrl }).strict().optional());

export const productRecordObject = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers and hyphens"),
    name: nonEmpty,
    brand: nonEmpty,
    categories: z.array(z.enum(gearCategorySlugs)).min(1, "pick at least one category"),
    summary: nonEmpty,
    keySpecs: z.array(nonEmpty).default([]),
    specSource: z
      .object({ title: nonEmpty, url: httpsUrl, publisher: nonEmpty, accessedOn: date })
      .strict(),
    manufacturerUrl: optUrl,
    retailerUrl: optUrl,
    retailerName: optText,
    lastVerified: date,
    active: z.boolean().default(true),
    imageSource: optText,
    imageRights: z.enum(imageRightsValues).default("none"),
    /** Name of an entry in content/affiliates.yml that is the affiliate program for this product. Never a URL. */
    affiliateProgram: optText,
    /** Name of the entry in content/affiliates.yml that holds this product's tracked link. Never a URL or a raw ID. */
    affiliateTrackingId: optText,
    alternativeRetailer: altRetailer,
    /** Guide web addresses (slugs). Checked against the real guides by the tests. */
    relatedGuides: z
      .array(
        z
          .string()
          .regex(
            /^[a-z0-9-]+$/,
            "use a guide's web address (lowercase letters, numbers and hyphens)",
          ),
      )
      .default([]),
    manufacturerClaimsVsIndependentTesting: z.string().trim().min(1).default(NO_TESTING_CITED),
  })
  .strict();

export const productRecordSchema = productRecordObject.superRefine((v, ctx) => {
  if (v.imageRights !== "none" && !v.imageSource)
    ctx.addIssue({
      code: "custom",
      path: ["imageSource"],
      message: "is required when image rights are not 'none'",
    });
  if (v.imageRights === "none" && v.imageSource)
    ctx.addIssue({
      code: "custom",
      path: ["imageRights"],
      message: "must be 'permitted' or 'own' when an image source is given",
    });
  if (v.affiliateTrackingId && !v.affiliateProgram)
    ctx.addIssue({
      code: "custom",
      path: ["affiliateProgram"],
      message: "is required when a tracked link is named",
    });
});

export const productsSchema = z.object({ products: z.array(productRecordSchema).default([]) });
export type ProductRecord = z.infer<typeof productRecordSchema>;

/** The affiliate entries and guide slugs a product list may point to. Used by the build loader and by the tests. */
export function productReferenceProblems(
  list: ProductRecord[],
  links: { id: string; kind?: string | undefined }[],
  guideSlugs?: Set<string>,
): string[] {
  const problems: string[] = [];
  const byId = new Map(links.map((l) => [l.id, l]));
  for (const p of list) {
    for (const [field, ref] of [
      ["affiliateProgram", p.affiliateProgram],
      ["affiliateTrackingId", p.affiliateTrackingId],
    ] as const) {
      if (!ref) continue;
      const l = byId.get(ref);
      if (!l)
        problems.push(`product "${p.id}": ${field} "${ref}" does not exist in Affiliate links`);
      else if (l.kind === "stay")
        problems.push(
          `product "${p.id}": ${field} "${ref}" is marked as a place to stay, not a product`,
        );
    }
    if (guideSlugs)
      for (const g of p.relatedGuides)
        if (!guideSlugs.has(g))
          problems.push(`product "${p.id}": related guide "${g}" does not exist`);
  }
  return problems;
}
