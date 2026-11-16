// What a content file must look like. The build reads every file in /content, checks it against
// these rules, and stops with a plain message naming the file and field if something is wrong.
// Pure (no "@/" imports) because the build tool loads this file too.
import { z } from "zod";

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date written YYYY-MM-DD")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v && d.getUTCFullYear() >= 2000 && d.getUTCFullYear() <= 2100;
  }, "is not a real date");
const httpsUrl = z.string().url("must be a full web address").refine((v) => v.startsWith("https://"), "must start with https://");
const uploadPath = z
  .string()
  .regex(/^\/uploads\/[A-Za-z0-9._-]+\.(jpe?g|png|webp|gif|avif)$/i, "must be a photo in the uploads folder, like /uploads/my-photo.jpg")
  .refine((v) => !v.includes(".."), "must not contain ..");
const nonEmpty = z.string().trim().min(1, "must not be empty");
const optText = z.string().optional().transform((v) => (v && v.trim() ? v : undefined));

export const guideSchema = z.object({
  title: nonEmpty,
  seoTitle: nonEmpty.max(60, "should be 60 characters or fewer"),
  seoDescription: nonEmpty.max(160, "should be 160 characters or fewer"),
  dek: nonEmpty,
  category: z.enum(["Destination", "Planning", "Checklist", "Gear"]),
  states: z.array(z.enum(["georgia", "california"])).default([]),
  // If the Status box is ever left empty, the safe answer is "draft".
  status: z.enum(["draft", "published"]).default("draft"),
  approvedBy: optText,
  approvedOn: z.string().optional().transform((v) => (v && v.trim() ? v : undefined)).pipe(date.optional()),
  author: nonEmpty,
  publishedOn: date,
  lastReviewed: date,
  readingMinutes: z.coerce.number().int().min(1),
  heroImage: optText,
  heroUpload: z.string().optional().transform((v) => (v && v.trim() ? v.trim() : undefined)).pipe(uploadPath.optional()),
  heroAlt: optText,
  faqs: z.array(z.object({ q: nonEmpty, a: nonEmpty })).default([]),
  relatedGuides: z.array(z.string()).default([]),
  relatedTools: z.array(z.enum(["checklist", "host-questions", "cost-calculator", "compare"])).default([]),
  gear: z
    .array(z.object({ productId: nonEmpty, bestFor: nonEmpty, whyItMadeTheList: nonEmpty, watchOuts: z.array(z.string()).default([]) }))
    .optional(),
  sources: z.array(z.object({ title: nonEmpty, url: httpsUrl, publisher: nonEmpty, accessedOn: date })).default([]),
  research: z.object({
    primaryKeyword: nonEmpty,
    relatedKeywords: z.array(z.string()).default([]),
    readerQuestions: z.array(z.string()).default([]),
    intendedReader: nonEmpty,
    competitors: z.array(z.object({ url: httpsUrl, title: nonEmpty, checkedOn: date, coversWell: nonEmpty, gaps: nonEmpty })).default([]),
    gapsFound: z.array(z.string()).default([]),
    differentiators: z.array(z.string()).default([]),
    angle: nonEmpty,
    followUps: z.array(z.string()).default([]),
    unverified: z.array(z.string()).default([]),
    researchComplete: z.boolean(),
  }),
});
export type GuideFrontmatter = z.infer<typeof guideSchema>;

// ---- Stays. "yes / no / not-confirmed" choices keep "we don't know" distinct from "no". ----
const tri = z.enum(["yes", "no", "not-confirmed"]).default("not-confirmed");
const triToBool = (v: "yes" | "no" | "not-confirmed") => (v === "yes" ? true : v === "no" ? false : null);
const optNum = z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.coerce.number().optional());

export const stayYamlSchema = z.object({
  name: nonEmpty,
  // If the Status box is ever left empty, the safe answer is "unverified" (never shown on the live site).
  status: z.enum(["verified", "unverified", "sample"]).default("unverified"),
  type: z.enum(["cabin", "vacation-home", "cottage", "beach-house", "unique"]),
  state: z.enum(["georgia", "california"]),
  town: nonEmpty,
  summary: nonEmpty,
  description: nonEmpty,
  sleeps: optNum,
  bedrooms: optNum,
  maxDogs: optNum,
  largeDogsOk: tri,
  weightLimitLbs: optNum,
  fencedYard: z.enum(["full", "partial", "none", "not-confirmed"]).default("not-confirmed"),
  fenceNotes: optText,
  privateOutdoor: tri,
  petFee: z.enum(["not-confirmed", "none", "charged"]).default("not-confirmed"),
  petFeeAmount: optNum,
  petFeeBasis: z.enum(["stay", "night", "dog", "dog-night"]).optional(),
  breedRestrictions: tri,
  beach: z.boolean().default(false),
  mountain: z.boolean().default(false),
  hotTub: tri,
  nearby: z.array(z.string()).default([]),
  houseRules: z.array(z.string()).default([]),
  image: optText,
  imageUpload: z.string().optional().transform((v) => (v && v.trim() ? v.trim() : undefined)).pipe(uploadPath.optional()),
  sourceUrl: z.string().default(""),
  lastVerified: z.string().optional().transform((v) => (v && v.trim() ? v : null)).pipe(date.nullable()),
  photoPermission: z.boolean().default(false),
  affiliateId: optText,
});

export function toStay(slug: string, raw: z.infer<typeof stayYamlSchema>) {
  const petFee = raw.petFee === "none" ? { amount: 0, basis: "stay" as const } : raw.petFee === "charged" ? { amount: raw.petFeeAmount ?? 0, basis: raw.petFeeBasis ?? "stay" } : null;
  return {
    slug,
    name: raw.name,
    status: raw.status,
    type: raw.type,
    state: raw.state,
    town: raw.town,
    summary: raw.summary,
    description: raw.description,
    sleeps: raw.sleeps ?? null,
    bedrooms: raw.bedrooms ?? null,
    maxDogs: raw.maxDogs ?? null,
    largeDogsOk: triToBool(raw.largeDogsOk),
    weightLimitLbs: raw.weightLimitLbs ?? null,
    fencedYard: raw.fencedYard === "not-confirmed" ? null : raw.fencedYard,
    fenceNotes: raw.fenceNotes,
    privateOutdoor: triToBool(raw.privateOutdoor),
    petFee,
    breedRestrictions: triToBool(raw.breedRestrictions),
    beach: raw.beach,
    mountain: raw.mountain,
    hotTub: triToBool(raw.hotTub),
    nearby: raw.nearby,
    houseRules: raw.houseRules,
    image: raw.image,
    imageUpload: raw.imageUpload,
    sourceUrl: raw.sourceUrl,
    lastVerified: raw.lastVerified,
    photoPermission: raw.photoPermission,
    affiliateId: raw.affiliateId,
  };
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
        kind: z.enum(["stay", "product"]).default("stay"),
        notes: optText,
      }),
    )
    .default([]),
});

export const settingsSchema = z.object({
  contactEmail: z.string().trim().refine((v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "must be an email address or left empty").default(""),
  siteUrl: z.string().trim().refine((v) => v === "" || /^https:\/\/[A-Za-z0-9.-]+(:\d+)?$/.test(v), "must look like https://yourdomain.com (no slash, no extra text at the end) or be left empty").default(""),
  ga4MeasurementId: z.string().trim().refine((v) => v === "" || /^G-[A-Z0-9]{6,}$/.test(v), "must look like G-XXXXXXXXXX or be left empty").default(""),
  newsletterProvider: z.enum(["", "kit", "mailerlite"]).default(""),
  newsletterFormAction: z.string().trim().refine((v) => v === "" || /^https:\/\//.test(v), "must be the https:// form address from your email provider or left empty").default(""),
  newsletterEmailFieldName: z.string().trim().default("email_address"),
});
export type SiteSettings = z.infer<typeof settingsSchema>;
