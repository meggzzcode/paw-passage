// Picks adventures with fixed rules (no AI, no network). Hard suitability exclusions always win over preferences.
import type { Adventure } from "./schema";

export type DogProfile = {
  name?: string;
  lifeStage?: "puppy" | "adult" | "senior";
  limitedMobility?: boolean; // the owner's own statement, not a medical judgement
  nervousAroundPeople?: boolean;
  nervousAroundDogs?: boolean;
  environment?: Adventure["environments"][number];
  likes?: Adventure["energy"][]; // preferred energy levels
};

export type Session = {
  minutesAvailable?: number;
  budget?: number;
  setting?: "indoor" | "outdoor";
  energy?: Adventure["energy"];
  season?: Adventure["seasons"][number];
  environment?: Adventure["environments"][number];
  collection?: string;
};

/** Reasons an adventure is unsuitable for this dog. Empty list = suitable. Never relaxed by session filters. */
export function exclusions(a: Adventure, p: DogProfile): string[] {
  const why: string[] = [];
  if (p.lifeStage && !a.lifeStages.includes(p.lifeStage)) why.push("life stage");
  if (p.limitedMobility && !a.mobilityFriendly) why.push("mobility");
  if (p.nervousAroundPeople && a.crowd === "busy") why.push("crowds");
  if (p.nervousAroundDogs && a.otherDogs) why.push("other dogs");
  return why;
}

type Soft = "time" | "budget" | "setting" | "energy" | "season" | "environment" | "collection";

function softMisses(a: Adventure, s: Session): Soft[] {
  const m: Soft[] = [];
  if (s.minutesAvailable !== undefined && a.minutesMin > s.minutesAvailable) m.push("time");
  if (s.budget !== undefined && a.costMin > s.budget) m.push("budget");
  if (s.setting && a.setting !== "either" && a.setting !== s.setting) m.push("setting");
  if (s.energy && a.energy !== s.energy) m.push("energy");
  if (s.season && a.seasons.length > 0 && !a.seasons.includes(s.season)) m.push("season");
  if (s.environment && !a.environments.includes(s.environment)) m.push("environment");
  if (s.collection && !a.collections.includes(s.collection)) m.push("collection");
  return m;
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

export type Ranked = { adventure: Adventure; score: number };
export type Result =
  | { ok: true; ranked: Ranked[] }
  | { ok: false; reason: "none-suitable" | "filters-too-narrow"; relax: Soft[] };

/**
 * Ranked suitable adventures. `done` = IDs already completed (hidden unless includeDone).
 * `lastKeepsake` lowers the score of repeating the same kind back to back, for variety.
 */
export function rank(
  library: Adventure[],
  profile: DogProfile,
  session: Session,
  opts: { done?: Set<string>; includeDone?: boolean; lastKeepsake?: string; seed?: string } = {},
): Result {
  const done = opts.done ?? new Set<string>();
  const suitable = library.filter(
    (a) => a.status === "published" && exclusions(a, profile).length === 0,
  );
  if (suitable.length === 0) return { ok: false, reason: "none-suitable", relax: [] };
  const fresh = suitable.filter((a) => opts.includeDone || !done.has(a.id));
  const hits: Ranked[] = [];
  const missCounts = new Map<Soft, number>();
  for (const a of fresh) {
    const miss = softMisses(a, session);
    if (miss.length === 0) {
      let score = 10;
      if (profile.likes?.includes(a.energy)) score += 3;
      if (opts.lastKeepsake && a.keepsake === opts.lastKeepsake) score -= 2;
      score += (hash(`${opts.seed ?? ""}${a.id}`) % 1000) / 1000; // deterministic shuffle per seed
      hits.push({ adventure: a, score });
    } else for (const k of miss) missCounts.set(k, (missCounts.get(k) ?? 0) + 1);
  }
  if (hits.length > 0) return { ok: true, ranked: hits.sort((x, y) => y.score - x.score) };
  // Explain which filters to loosen; never suggest loosening a safety exclusion.
  const relax = [...missCounts.entries()].sort((x, y) => y[1] - x[1]).map(([k]) => k);
  return { ok: false, reason: "filters-too-narrow", relax };
}
