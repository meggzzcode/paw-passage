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
  category: z.enum(["Destination", "Planning", "Checklist", "Gear"]),
  states: z.array(z.enum(["georgia", "california"])).default([]),
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
  relatedTools: z
    .array(z.enum(["checklist", "will-my-dog-be-accepted", "packing-list"]))
    .default([]),
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

// ---- Stays. "yes / no / not-confirmed" choices keep "we don't know" distinct from "no". ----
const tri = z.enum(["yes", "no", "not-confirmed"]).default("not-confirmed");
const triToBool = (v: "yes" | "no" | "not-confirmed") =>
  v === "yes" ? true : v === "no" ? false : null;
const optNum = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.coerce.number().optional(),
);

export const stayYamlSchema = z.object({
  name: nonEmpty,
  // If the Status box is ever left empty, the safe answer is "unverified" (never shown on the live site).
  status: z.enum(["verified", "unverified"]).default("unverified"),
  type: z.enum(["cabin", "vacation-home", "cottage", "beach-house", "unique"]),
  state: z.enum(["georgia", "california"]),
  town: nonEmpty,
  summary: nonEmpty,
  description: nonEmpty,
  sleeps: optNum,
  bedrooms: optNum,
  bathrooms: optNum,
  beds: z.array(z.string()).default([]),
  amenityGroups: z
    .array(z.object({ title: nonEmpty, items: z.array(z.string()).default([]) }))
    .default([]),
  locationNote: optText,
  distances: z.array(z.string()).default([]),
  checkIn: optText,
  checkOut: optText,
  minimumStay: optText,
  cancellation: optText,
  accessNotes: z.array(z.string()).default([]),
  generalRules: z.array(z.string()).default([]),
  guestNotes: z.array(z.string()).default([]),
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
  imageUpload: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : undefined))
    .pipe(uploadPath.optional()),
  sourceUrl: z.string().default(""),
  lastVerified: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v : null))
    .pipe(date.nullable()),
  photoPermission: z.boolean().default(false),
  affiliateId: optText,
});

export function toStay(slug: string, raw: z.infer<typeof stayYamlSchema>) {
  const petFee =
    raw.petFee === "none"
      ? { amount: 0, basis: "stay" as const }
      : raw.petFee === "charged"
        ? { amount: raw.petFeeAmount ?? 0, basis: raw.petFeeBasis ?? "stay" }
        : null;
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
    bathrooms: raw.bathrooms ?? null,
    beds: raw.beds,
    amenityGroups: raw.amenityGroups,
    locationNote: raw.locationNote,
    distances: raw.distances,
    checkIn: raw.checkIn,
    checkOut: raw.checkOut,
    minimumStay: raw.minimumStay,
    cancellation: raw.cancellation,
    accessNotes: raw.accessNotes,
    generalRules: raw.generalRules,
    guestNotes: raw.guestNotes,
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
  stay22AccountId: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[A-Za-z0-9_-]+$/.test(v),
      "must be your Stay22 account ID (letters, numbers, hyphens) or be left empty",
    )
    .default(""),
});
export type SiteSettings = z.infer<typeof settingsSchema>;

// ---- Dog rules for places (parks, trails, beaches). A place goes live only when it is verified AND
// has the official source address, the exact quoted sentence and the date someone read the page
// (see placeIsPublic in publish-rule.ts). ----
export const placeKinds = [
  "state-park",
  "national-park",
  "national-forest",
  "county-park",
  "city-park",
  "beach",
  "trail",
] as const;
export const placeRules = ["yes", "leash", "no", "some"] as const;
const optHttpsUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .pipe(httpsUrl.optional());
const optDate = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .pipe(date.optional());

export const placeYamlSchema = z.object({
  // If the Status box is ever left empty, the safe answer is "unverified" (never shown on the live site).
  status: z.enum(["unverified", "verified"]).default("unverified"),
  name: nonEmpty,
  state: z.enum(["georgia", "california"]),
  managedBy: nonEmpty,
  kind: z.enum(placeKinds),
  nearTown: optText,
  dogsAllowed: z
    .array(z.object({ area: nonEmpty, rule: z.enum(placeRules), note: optText }))
    .default([]),
  leash: optText,
  fees: optText,
  exclusions: z.array(z.string()).default([]),
  seasonal: optText,
  nearbyAlternative: optText,
  conflictNote: optText,
  sourceUrl: optHttpsUrl,
  sourceQuote: optText,
  sourcePageDate: optText,
  lastChecked: optDate,
  verifiedBy: optText,
  claimFrom: optText,
});
export type PlaceYaml = z.infer<typeof placeYamlSchema>;

export function toPlace(slug: string, raw: PlaceYaml) {
  return {
    slug,
    status: raw.status,
    name: raw.name,
    state: raw.state,
    managedBy: raw.managedBy,
    kind: raw.kind,
    nearTown: raw.nearTown ?? null,
    dogsAllowed: raw.dogsAllowed.map((d) => ({ area: d.area, rule: d.rule, note: d.note ?? null })),
    leash: raw.leash ?? null,
    fees: raw.fees ?? null,
    exclusions: raw.exclusions.filter((e) => e.trim()),
    seasonal: raw.seasonal ?? null,
    nearbyAlternative: raw.nearbyAlternative ?? null,
    conflictNote: raw.conflictNote ?? null,
    sourceUrl: raw.sourceUrl ?? null,
    sourceQuote: raw.sourceQuote ?? null,
    sourcePageDate: raw.sourcePageDate ?? null,
    lastChecked: raw.lastChecked ?? null,
    verifiedBy: raw.verifiedBy ?? null,
    claimFrom: raw.claimFrom ?? null,
  };
}
export type Place = ReturnType<typeof toPlace>;
