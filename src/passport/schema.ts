// Adventure content rules. Pure (no "@/" imports) so the build and the tests can load it.
// The adventure ID is permanent: it never changes when a title, URL or collection changes.
import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "must not be empty");

export const LIFE_STAGES = ["puppy", "adult", "senior"] as const;
export const SETTINGS = ["indoor", "outdoor", "either"] as const;
export const ENERGY = ["gentle", "moderate", "lively"] as const;
export const CROWD = ["none", "some", "busy"] as const;
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export const ENVIRONMENTS = [
  "apartment",
  "house",
  "city",
  "countryside",
  "beach",
  "mountains",
  "road-trip",
] as const;
export const KEEPSAKES = [
  "postcard",
  "magazine-cover",
  "then-and-now",
  "milestone-card",
  "certificate",
  "seasonal-recap",
  "collage",
  "collection-complete",
] as const;

export const adventureSchema = z
  .object({
    id: z.string().regex(/^adv-[a-z0-9]{6}$/, "must look like adv-k3m9x2 and never be edited"),
    title: nonEmpty.max(70),
    clue: nonEmpty.max(140), // the mystery line shown before the reveal; must not give the title away
    description: nonEmpty.max(300),
    instructions: z.array(nonEmpty).min(2).max(8),
    twist: nonEmpty.max(220),
    prep: z.enum(["none", "light", "some"]),
    supplies: z.array(nonEmpty).max(10).default([]),
    minutesMin: z.number().int().min(1),
    minutesMax: z.number().int().min(1),
    costMin: z.number().min(0),
    costMax: z.number().min(0),
    setting: z.enum(SETTINGS),
    environments: z.array(z.enum(ENVIRONMENTS)).min(1),
    lifeStages: z.array(z.enum(LIFE_STAGES)).min(1),
    energy: z.enum(ENERGY),
    mobilityFriendly: z.boolean(), // true = can be done at a very gentle pace or in place
    crowd: z.enum(CROWD), // how many other people are around
    otherDogs: z.boolean(), // true = other dogs are likely to be near
    seasons: z.array(z.enum(SEASONS)).default([]), // empty = any season
    safety: z.array(nonEmpty).min(1).max(5), // at least one dog-welfare line, no medical claims
    variations: z.array(nonEmpty).max(4).default([]),
    memoryPrompt: nonEmpty.max(160),
    keepsake: z.enum(KEEPSAKES),
    collections: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
    stamps: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
    access: z.enum(["free", "premium"]),
    status: z.enum(["draft", "published"]),
    relatedGuides: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
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
  });

export type Adventure = z.infer<typeof adventureSchema>;

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
