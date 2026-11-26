// Adventure content rules, schema version 2. Pure (no "@/" imports) so the build, scripts and tests can load it.
// The adventure ID is permanent: it never changes when a title, URL or collection changes.
// Every classification below is a controlled list, never free-text tags, so filtering and eligibility stay exact.
import { z } from "zod";

export const SCHEMA_VERSION = 2;
const nonEmpty = z.string().trim().min(1, "must not be empty");
const slug = z.string().regex(/^[a-z0-9-]+$/);

export const ACTIVITY_TYPES = [
  "play-and-games",
  "food-and-treats",
  "scent-and-discovery",
  "problem-solving",
  "creative-projects",
  "photography",
  "outdoor-exploration",
  "travel",
  "water",
  "relaxation",
  "celebrations",
  "memory-making",
] as const;
export const LIFE_STAGES = ["puppy", "adult", "senior"] as const;
export const SIZES = ["small", "medium", "large"] as const;
export const SETTINGS = ["indoor", "outdoor", "either"] as const;
export const ENERGY = ["gentle", "moderate", "lively"] as const;
export const CROWD = ["none", "some", "busy"] as const;
export const NOISE = ["quiet", "some", "loud"] as const;
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export const HOMES = ["apartment", "house-no-yard", "house-with-yard"] as const;
export const PLACES = ["home", "city", "countryside", "beach", "mountains", "road-trip"] as const;
export const SPACE = ["small-indoor", "a-room", "yard", "none"] as const; // none = no particular space needed
export const TRANSPORT = ["none", "walkable", "car"] as const;
export const DOG_MOBILITY = ["low", "moderate", "high"] as const; // low = fine for a dog who moves slowly or not far
export const OWNER_MOBILITY = ["seated", "minimal-walking", "short-walk", "long-walk"] as const;
export const WATER = ["none", "near-water", "in-water"] as const;
export const AVOID_WEATHER = ["rain", "heat", "cold"] as const; // conditions in which this should not be done
export const SUPPLY_KEYS = [
  "toys",
  "treats",
  "blanket",
  "camera-phone",
  "paper-and-pens",
  "picnic-gear",
  "bake-ingredients",
  "towels",
  "household-items",
  "cardboard-boxes",
  "leash-and-harness",
  "car",
] as const;
export const KEEPSAKE_FAMILIES = [
  "travel-postcard",
  "magazine-cover",
  "id-card",
  "trading-card",
  "certificate",
  "seasonal-frame",
  "event-ticket",
  "then-and-now",
  "collage",
  "poster",
] as const;

// Publication bar for the internal editorial `review` scores (1-10), chosen by the owner on 2026-11-26 ("option C")
// after an independent re-score on one consistent scale (5 = ordinary pet-blog idea, 7 = good, 8 = genuinely
// excellent) found that almost nothing reaches 8 and that authors' own scores run about 0.6 to 1.1 points higher.
// The `review` numbers on published adventures must therefore be the INDEPENDENT scores, not the author's.
// Editorial goal: premium adventures at 7.5 or more. To restore the original bar, set 8 and 7.
export const PUBLISH_MIN_AVERAGE = 7.0;
export const PUBLISH_MIN_CRITERION = 6;
// Owner directive 2026-11-26 (balanced commercial editorial system): originality is judged against the adventure's
// purpose. A simple everyday, lifestyle or aspirational adventure may score 5 on originality; every other criterion keeps
// the bar above, and a SIGNATURE adventure must clear the full bar on originality too. Safety and genuine value are
// mandatory whatever the role.
export const PUBLISH_MIN_ORIGINALITY_NON_SIGNATURE = 5;
export const ADVENTURE_ROLES = ["signature", "everyday", "lifestyle", "aspirational"] as const;
export type AdventureRole = (typeof ADVENTURE_ROLES)[number];

const researchRef = z.object({
  label: nonEmpty.max(120),
  url: z.string().url().startsWith("https://"),
});
const score = z.number().int().min(1).max(10);

export const adventureSchema = z
  .object({
    schema: z.literal(2),
    id: z.string().regex(/^adv-[a-z0-9]{6}$/, "must look like adv-k3m9x2 and never be edited"),
    title: nonEmpty.max(70),
    clue: nonEmpty.max(140), // mystery line shown before the reveal; must not give the title away
    reveal: nonEmpty.max(300), // the introduction shown after the reveal
    objective: nonEmpty.max(200),
    instructions: z.array(nonEmpty).min(3).max(9),
    twist: nonEmpty.max(220),
    variations: z.array(nonEmpty).max(4).default([]), // easier or more accessible versions
    completion: nonEmpty.max(200), // the natural point at which it counts as done
    photoIdea: nonEmpty.max(200).optional(),
    memoryPrompt: nonEmpty.max(160),

    // time and money
    minutesMin: z.number().int().min(1),
    minutesMax: z.number().int().min(1),
    activeMinutes: z.number().int().min(1).optional(), // time the dog is actively involved
    costMin: z.number().min(0),
    costMax: z.number().min(0),
    prep: z.enum(["none", "light", "some"]),

    // supplies and logistics
    supplies: z.array(nonEmpty).max(10).default([]),
    optionalSupplies: z.array(nonEmpty).max(8).default([]),
    substitutes: z.array(nonEmpty).max(6).default([]), // household stand-ins for supplies the owner may not have
    requires: z.array(z.enum(SUPPLY_KEYS)).default([]), // controlled keys for the "what I have" filter
    transport: z.enum(TRANSPORT),
    reservation: z
      .object({ needed: z.boolean(), note: nonEmpty.max(160).optional() })
      .default({ needed: false }),

    // where
    setting: z.enum(SETTINGS),
    homes: z.array(z.enum(HOMES)).min(1),
    space: z.enum(SPACE),
    places: z.array(z.enum(PLACES)).min(1),
    seasons: z.array(z.enum(SEASONS)).default([]), // empty = any season
    avoidWeather: z.array(z.enum(AVOID_WEATHER)).default([]),

    // who it suits (hard eligibility inputs)
    lifeStages: z.array(z.enum(LIFE_STAGES)).min(1),
    sizes: z.array(z.enum(SIZES)).default([]), // empty = any size
    energy: z.enum(ENERGY),
    personalities: z
      .array(z.enum(["curious", "playful", "cozy", "gentle", "adventurous"]))
      .default([]), // who tends to enjoy it; a hint, never eligibility
    dogMobility: z.enum(DOG_MOBILITY),
    ownerMobility: z.enum(OWNER_MOBILITY),
    stepFree: z.boolean(), // true = no steps or uneven ground needed
    crowd: z.enum(CROWD),
    strangers: z.boolean(), // true = meets unfamiliar people
    otherDogs: z.boolean(), // true = other dogs are likely to be near
    noise: z.enum(NOISE),
    food: z.boolean(), // true = food or treats are part of it
    dietNotes: nonEmpty.max(200).optional(),
    water: z.enum(WATER),
    safety: z.array(nonEmpty).min(1).max(6), // dog-welfare lines; never medical claims

    // classification and rewards
    activityTypes: z.array(z.enum(ACTIVITY_TYPES)).min(1).max(3),
    collections: z.array(slug).min(1),
    household: z.array(z.enum(["two-dogs", "family"])).default([]), // optional tags for two-dog and family households
    stamps: z.array(slug).default([]),
    achievements: z.array(slug).default([]),
    keepsake: z.object({
      family: z.enum(KEEPSAKE_FAMILIES),
      theme: slug, // names the variant of the family: palette, wording and ornaments are chosen from it
      headline: nonEmpty.max(40), // the big words on the artwork, e.g. "TOY CHAMPION"
      subhead: nonEmpty.max(60).optional(),
      // One cute line printed on the photo keepsake that says what the adventure was ("Mission: loot found in my human's
      // pocket"). It is part of the artwork, never a suggested caption; no hashtags, no emoji.
      explainer: nonEmpty.max(64).optional(),
    }),
    // Primary editorial role: signature (marketing flagship), everyday (easy, at home or nearby), lifestyle (dates,
    // creativity, seasons, celebrations, life stages) or aspirational (weekend, travel, camping, special outings).
    role: z.enum(ADVENTURE_ROLES).default("everyday"),
    // PUBLIC marketing copy. The teaser must tease without explaining how the activity works (no steps, mechanics or
    // twists). previewTitle is an optional mystery-style marketing title used instead of the real title in public previews.
    // showcase marks the card as approved for the curated public preview showcase (about 50 premium cards).
    teaser: nonEmpty.max(110).optional(),
    previewTitle: nonEmpty.max(60).optional(),
    showcase: z.boolean().default(false),
    access: z.enum(["free", "premium"]),
    status: z.enum(["draft", "published"]),
    relatedGuides: z.array(slug).default([]),
    affiliateProducts: z.array(slug).default([]), // product ids from content/products.yml; never required to finish
    research: z.array(researchRef).default([]),
    review: z
      .object({
        ownerAppeal: score,
        dogEnjoyment: score,
        originality: score,
        adventureFactor: score,
        practicality: score,
        memoryValue: score,
        reviewedOn: nonEmpty,
      })
      .optional(), // internal editorial scores, never shown to customers or described as customer ratings
  })
  .superRefine((a, ctx) => {
    if (a.minutesMax < a.minutesMin)
      ctx.addIssue({
        code: "custom",
        path: ["minutesMax"],
        message: "must be at least minutesMin",
      });
    if (a.costMax < a.costMin)
      ctx.addIssue({ code: "custom", path: ["costMax"], message: "must be at least costMin" });
    const t = a.title.toLowerCase();
    if (t.length > 4 && a.clue.toLowerCase().includes(t))
      ctx.addIssue({ code: "custom", path: ["clue"], message: "must not contain the title" });
    if (a.transport === "car" && !a.requires.includes("car"))
      ctx.addIssue({
        code: "custom",
        path: ["requires"],
        message: "a car adventure must list 'car' in requires",
      });
    if (a.food && a.activityTypes.every((t2) => t2 !== "food-and-treats") && !a.dietNotes)
      ctx.addIssue({
        code: "custom",
        path: ["dietNotes"],
        message: "food adventures need dietNotes",
      });
    if (a.reservation.needed && !a.reservation.note)
      ctx.addIssue({
        code: "custom",
        path: ["reservation"],
        message: "needs a note saying what to book",
      });
    if (a.water === "in-water" && !a.safety.some((s) => /supervis|check/i.test(s)))
      ctx.addIssue({
        code: "custom",
        path: ["safety"],
        message: "water adventures need a supervise/check safety line",
      });
    if (a.showcase && !a.teaser)
      ctx.addIssue({
        code: "custom",
        path: ["teaser"],
        message: "a showcase adventure needs a teaser",
      });
    if (a.teaser && /(?:step\s*\d|first,|then you|next,)/i.test(a.teaser))
      ctx.addIssue({
        code: "custom",
        path: ["teaser"],
        message: "a teaser must not explain how it works",
      });
    if (a.review) {
      const vals = [
        a.review.ownerAppeal,
        a.review.dogEnjoyment,
        a.review.originality,
        a.review.adventureFactor,
        a.review.practicality,
        a.review.memoryValue,
      ];
      const floors =
        a.role === "signature" ? PUBLISH_MIN_CRITERION : PUBLISH_MIN_ORIGINALITY_NON_SIGNATURE;
      const others = [
        a.review.ownerAppeal,
        a.review.dogEnjoyment,
        a.review.adventureFactor,
        a.review.practicality,
        a.review.memoryValue,
      ];
      if (
        a.status === "published" &&
        (Math.min(...others) < PUBLISH_MIN_CRITERION ||
          a.review.originality < floors ||
          vals.reduce((x, y) => x + y, 0) / 6 < PUBLISH_MIN_AVERAGE)
      )
        ctx.addIssue({
          code: "custom",
          path: ["review"],
          message: `a published adventure needs an average of at least ${PUBLISH_MIN_AVERAGE}, no score below ${PUBLISH_MIN_CRITERION}, and originality of at least ${floors}`,
        });
    }
  });

export type Adventure = z.infer<typeof adventureSchema>;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/** Checks a whole library: unique IDs and every collection/stamp reference is defined. Returns messages; empty = fine. */
export function validateLibrary(
  adventures: Adventure[],
  collectionSlugs: string[],
  stampSlugs: string[],
): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const a of adventures) {
    if (seen.has(a.id)) errors.push(`duplicate adventure id ${a.id}`);
    seen.add(a.id);
    for (const c of a.collections)
      if (!collectionSlugs.includes(c)) errors.push(`${a.id}: unknown collection "${c}"`);
    for (const s of a.stamps)
      if (!stampSlugs.includes(s)) errors.push(`${a.id}: unknown stamp "${s}"`);
  }
  return errors;
}
