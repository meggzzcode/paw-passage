// Public preview records. Pure and dependency-free (type imports only) so the import script, the API and the tests all
// load it. The projection is an ALLOWLIST: a public record is built field by field from a card, never by copying the
// card, so a new field added to the schema can never reach the public by accident.
// Never in a public record: instructions, twist, reveal, clue, objective, variations, completion, safety, supplies,
// photoIdea, memoryPrompt, review scores, research.
import type { PreviewItem } from "../../lib/previews";
import type { Adventure } from "../../passport/schema";

export const PREVIEW_KEYS = [
  "id",
  "title",
  "teaser",
  "category",
  "minutesMin",
  "minutesMax",
  "costMin",
  "costMax",
  "setting",
  "effort",
  "ownerEffort",
  "stepFree",
  "needs",
  "lifeStages",
  "keepsake",
  "role",
  "collections",
  "access",
] as const;
export const NEEDS_KEYS = ["car", "booking", "food", "water"] as const;
export const KEEPSAKE_KEYS = ["family", "theme"] as const;

/** Field names that must never appear in any public response, at any depth. */
export const FORBIDDEN_KEYS = [
  "instructions",
  "twist",
  "reveal",
  "clue",
  "objective",
  "variations",
  "completion",
  "safety",
  "supplies",
  "optionalSupplies",
  "substitutes",
  "photoIdea",
  "memoryPrompt",
  "review",
  "research",
  "dietNotes",
  "headline",
  "subhead",
  "explainer",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  "play-and-games": "Play and games",
  "food-and-treats": "Food and treats",
  "scent-and-discovery": "Scent and discovery",
  "problem-solving": "Problem solving",
  "creative-projects": "Creative projects",
  photography: "Photography",
  "outdoor-exploration": "Outdoor exploring",
  travel: "Travel",
  water: "Water",
  relaxation: "Relaxation",
  celebrations: "Celebrations",
  "memory-making": "Memory making",
};

const MECHANICS =
  /(?:\bsteps?\b|\bfirst\b|\bthen\b|\bnext\b|\bfinally\b|\bhow to\b|\binstructions?\b|\byou(?:'ll| will| need| should| must)\b|\bhide\b|\bhidden under\b|\bplace\b|\bset up\b|\b\d\s*[.)]\s)/i;

/** The no-mechanics check for a public teaser. Returns a problem, or null when the teaser is fine. */
export function teaserProblem(teaser: unknown): string | null {
  if (typeof teaser !== "string" || teaser.trim() === "") return "missing teaser";
  if (teaser.length > 110) return "teaser is longer than 110 characters";
  if (MECHANICS.test(teaser)) return "teaser appears to explain how the activity works";
  return null;
}

/** Owner effort, projected from ownerMobility: seated | easy-walking (minimal or short walk) | active (long walk). */
export function ownerEffortOf(m: Adventure["ownerMobility"]): "seated" | "easy-walking" | "active" {
  return m === "seated" ? "seated" : m === "long-walk" ? "active" : "easy-walking";
}

/** The public record for one card. Null when the card cannot be shown (not published, no valid teaser). */
export function projectPreview(a: Adventure): PreviewItem | null {
  if (a.status !== "published") return null;
  const teaser = a.teaser;
  if (teaserProblem(teaser) !== null || teaser === undefined) return null;
  return {
    id: a.id,
    title: a.previewTitle ?? a.title,
    teaser,
    category: CATEGORY_LABELS[a.activityTypes[0] ?? ""] ?? "Adventure",
    minutesMin: a.minutesMin,
    minutesMax: a.minutesMax,
    costMin: a.costMin,
    costMax: a.costMax,
    setting: a.setting,
    effort: a.energy,
    ownerEffort: ownerEffortOf(a.ownerMobility),
    stepFree: a.stepFree,
    needs: {
      car: a.transport === "car",
      booking: a.reservation.needed,
      food: a.food || a.activityTypes.includes("food-and-treats"),
      water: a.water !== "none",
    },
    lifeStages: [...a.lifeStages],
    keepsake: { family: a.keepsake.family, theme: a.keepsake.theme },
    role: a.role,
    collections: [...a.collections],
    access: a.access,
  };
}

/** Throws when a record has any key outside the allowlist, or a forbidden key anywhere. Used by the importer and tests. */
export function assertPreviewShape(item: unknown): void {
  const o = item as Record<string, unknown>;
  for (const k of Object.keys(o))
    if (!(PREVIEW_KEYS as readonly string[]).includes(k))
      throw new Error(`field not allowed: ${k}`);
  const needs = o["needs"] as Record<string, unknown>;
  for (const k of Object.keys(needs))
    if (!(NEEDS_KEYS as readonly string[]).includes(k))
      throw new Error(`needs field not allowed: ${k}`);
  const keep = o["keepsake"] as Record<string, unknown>;
  for (const k of Object.keys(keep))
    if (!(KEEPSAKE_KEYS as readonly string[]).includes(k))
      throw new Error(`keepsake field not allowed: ${k}`);
}

/**
 * The structural fields the eligibility engine reads, and nothing textual. Stored server-side for every published card
 * (free and premium) so GET/POST previews can count matches over the whole library without holding any card text.
 */
export const MATCH_KEYS = [
  "id",
  "status",
  "access",
  "lifeStages",
  "sizes",
  "dogMobility",
  "ownerMobility",
  "stepFree",
  "crowd",
  "strangers",
  "otherDogs",
  "noise",
  "food",
  "activityTypes",
  "water",
  "transport",
  "homes",
  "space",
  // Aggregates only: the cost ceiling (for "needs no extra spending") and collection slugs (for "where your matches are").
  "costMax",
  "collections",
] as const;
export type MatchRecord = Pick<Adventure, (typeof MATCH_KEYS)[number]>;

export function matchRecord(a: Adventure): MatchRecord {
  const out: Record<string, unknown> = {};
  for (const k of MATCH_KEYS) out[k] = a[k];
  return out as MatchRecord;
}

/** What is stored under `previews/index`. */
export type PreviewIndex = {
  v: 1;
  items: PreviewItem[]; // showcase premium cards, plus free cards that carry a teaser
  total: number; // published adventures, free + premium
  collections: number; // collections with at least one published adventure
  pool: MatchRecord[]; // every published adventure, structural fields only
};

export const PREVIEW_INDEX_KEY = "previews/index";

/**
 * Builds the index from the whole library. Throws, naming the card, when a showcase card has no valid teaser, so a bad
 * card is refused instead of silently dropped.
 */
export function buildPreviewIndex(premium: Adventure[], free: Adventure[]): PreviewIndex {
  const published = [...free, ...premium].filter((a) => a.status === "published");
  const items: PreviewItem[] = [];
  for (const a of premium) {
    if (a.status !== "published" || !a.showcase) continue;
    const p = projectPreview(a);
    if (!p)
      throw new Error(
        `${a.id}: showcase card needs a valid teaser (${teaserProblem(a.teaser) ?? "unpublished"})`,
      );
    items.push(p);
  }
  for (const a of free) {
    const p = a.status === "published" && a.teaser !== undefined ? projectPreview(a) : null;
    if (p) items.push(p);
  }
  for (const it of items) assertPreviewShape(it);
  return {
    v: 1,
    items,
    total: published.length,
    collections: new Set(published.flatMap((a) => a.collections)).size,
    pool: published.map(matchRecord),
  };
}

/** Reads and re-validates the stored index. Anything malformed reads as "no previews". */
export function parsePreviewIndex(value: unknown): PreviewIndex | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<PreviewIndex>;
  if (!Array.isArray(v.items) || !Array.isArray(v.pool)) return null;
  if (typeof v.total !== "number" || typeof v.collections !== "number") return null;
  const items = v.items.filter((i) => {
    try {
      assertPreviewShape(i);
      return true;
    } catch {
      return false;
    }
  });
  return { v: 1, items, total: v.total, collections: v.collections, pool: v.pool };
}
