// What a content file must look like. The build reads every file in /content, checks it against
// these rules, and stops with a plain message naming the file and field if something is wrong.
// Pure (no "@/" imports) because the build tool loads this file too.
import { z } from "zod";

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date written YYYY-MM-DD")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return (
      !Number.isNaN(d.getTime()) &&
      d.toISOString().slice(0, 10) === v &&
      d.getUTCFullYear() >= 2000 &&
      d.getUTCFullYear() <= 2100
    );
  }, "is not a real date");
const httpsUrl = z
  .string()
  .url("must be a full web address")
  .refine((v) => v.startsWith("https://"), "must start with https://");
const uploadPath = z
  .string()
  .regex(
    /^\/uploads\/[A-Za-z0-9._-]+\.(jpe?g|png|webp|gif|avif)$/i,
    "must be a photo in the uploads folder, like /uploads/my-photo.jpg",
  )
  .refine((v) => !v.includes(".."), "must not contain ..");
const nonEmpty = z.string().trim().min(1, "must not be empty");
const optText = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v : undefined));

export const guideSchema = z.object({
  title: nonEmpty,
  seoTitle: nonEmpty.max(60, "should be 60 characters or fewer"),
  seoDescription: nonEmpty.max(160, "should be 160 characters or fewer"),
  dek: nonEmpty,
  category: z.enum(["Planning", "Checklist", "Gear"]),
  // If the Status box is ever left empty, the safe answer is "draft".
  status: z.enum(["draft", "published"]).default("draft"),
  approvedBy: optText,
  approvedOn: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v : undefined))
    .pipe(date.optional()),
  author: nonEmpty,
  publishedOn: date,
  lastReviewed: date,
  readingMinutes: z.coerce.number().int().min(1),
  heroImage: optText,
  /** "emergency": an action-first page. The hero image and share row are skipped so the first actions sit on the first phone screen. */
  layout: z.enum(["standard", "emergency"]).optional(),
  heroUpload: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : undefined))
    .pipe(uploadPath.optional()),
  heroAlt: optText,
  faqs: z.array(z.object({ q: nonEmpty, a: nonEmpty })).default([]),
  relatedGuides: z.array(z.string()).default([]),
  // Product ids from content/products.yml shown as "Gear for this trip" after the article. Unknown ids stop the build.
  relatedProducts: z.array(nonEmpty).max(6, "can list at most 6 products").default([]),
  relatedTools: z.array(z.enum(["packing-list"])).default([]),
  gear: z
    .array(
      z.object({
        productId: nonEmpty,
        bestFor: nonEmpty,
        whyItMadeTheList: nonEmpty,
        watchOuts: z.array(z.string()).default([]),
      }),
    )
    .optional(),
  sources: z
    .array(z.object({ title: nonEmpty, url: httpsUrl, publisher: nonEmpty, accessedOn: date }))
    .default([]),
  research: z.object({
    primaryKeyword: nonEmpty,
    relatedKeywords: z.array(z.string()).default([]),
    readerQuestions: z.array(z.string()).default([]),
    intendedReader: nonEmpty,
    competitors: z
      .array(
        z.object({
          url: httpsUrl,
          title: nonEmpty,
          checkedOn: date,
          coversWell: nonEmpty,
          gaps: nonEmpty,
        }),
      )
      .default([]),
    gapsFound: z.array(z.string()).default([]),
    differentiators: z.array(z.string()).default([]),
    angle: nonEmpty,
    followUps: z.array(z.string()).default([]),
    unverified: z.array(z.string()).default([]),
    researchComplete: z.boolean(),
  }),
});
export type GuideFrontmatter = z.infer<typeof guideSchema>;

/** Problems with guides' relatedProducts: more than 4, or ids that are not in content/products.yml. Used at build time. */
/** Product ids written in an article as {{pick:product-id}} or {{pick:product-id|Label}} on a line of their own. */
export const PICK_DIRECTIVE = /\{\{pick:([a-z0-9-]+)(?:\|[^}\n]*)?\}\}/g;
export const pickIds = (body: string | undefined): string[] =>
  [...(body ?? "").matchAll(PICK_DIRECTIVE)].map((m) => m[1]!);

export function relatedProductProblems(
  guides: { slug: string; relatedProducts?: string[]; body?: string }[],
  productIds: Iterable<string>,
): string[] {
  const known = new Set(productIds);
  const out: string[] = [];
  for (const g of guides) {
    for (const id of pickIds(g.body))
      if (!known.has(id))
        out.push(
          `${g.slug}: the text has {{pick:${id}}}, which is not a product id in content/products.yml`,
        );
    const ids = g.relatedProducts ?? [];
    if (ids.length > 6)
      out.push(`${g.slug}: relatedProducts lists ${ids.length} products; the most allowed is 6`);
    for (const id of ids)
      if (!known.has(id))
        out.push(
          `${g.slug}: relatedProducts names "${id}", which is not a product id in content/products.yml`,
        );
  }
  return out;
}

// ---- Affiliate links and site settings ----
export const affiliatesSchema = z.object({
  links: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/, "use lowercase letters, numbers and hyphens"),
        network: nonEmpty,
        url: httpsUrl,
        approved: z.boolean().default(false),
        notes: optText,
      }),
    )
    .default([]),
});

export const settingsSchema = z.object({
  contactEmail: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
      "must be an email address or left empty",
    )
    .default(""),
  siteUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https:\/\/[A-Za-z0-9.-]+(:\d+)?$/.test(v),
      "must look like https://yourdomain.com (no slash, no extra text at the end) or be left empty",
    )
    .default(""),
  ga4MeasurementId: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^G-[A-Z0-9]{6,}$/.test(v),
      "must look like G-XXXXXXXXXX or be left empty",
    )
    .default(""),
  amazonTrackingId: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*-\d{2}$/.test(v),
      "must look like yourname-20 (your Amazon Associates tracking ID) or be left empty",
    )
    .default(""),
  pinterestUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https:\/\/(www\.)?pinterest\.com\/[A-Za-z0-9_./-]+$/.test(v),
      "must look like https://www.pinterest.com/yourname/ or be left empty",
    )
    .default(""),
  /** Impact (impact.com) site-ownership verification value, issued to the account holder. Empty = no tag is sent. */
  impactSiteVerification: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[A-Za-z0-9-]{8,64}$/.test(v),
      "must be the value Impact shows for site verification (letters, numbers, hyphens) or be left empty",
    )
    .default(""),
});
export type SiteSettings = z.infer<typeof settingsSchema>;
