// POST /api/previews/match: validates the body, then counts matches over the full published library with the same hard
// eligibility the app uses. Returns aggregates and preview ids only: no titles or text of any hidden card.
import type { MatchResponse } from "../../lib/previews";
import { eligibility } from "../../passport/engine";
import type { DogProfile, OwnerPrefs } from "../../passport/profile";
import type { Adventure } from "../../passport/schema";
import type { PreviewIndex } from "./previews";

export const MATCH_MAX_BODY_BYTES = 4096;

const TRI = ["yes", "no", "unknown"] as const;
const COMFORT = ["comfortable", "nervous", "unknown"] as const;
const DOG_ENUMS: Record<string, readonly string[]> = {
  lifeStage: ["puppy", "adult", "senior"],
  size: ["small", "medium", "large"],
  energy: ["gentle", "moderate", "lively"],
  people: COMFORT,
  dogs: COMFORT,
  crowds: COMFORT,
  noiseSensitive: TRI,
  foodActivities: TRI,
  water: ["loves", "ok", "avoids", "unknown"],
  swims: TRI,
  carTravel: TRI,
  home: ["apartment", "house-no-yard", "house-with-yard"],
  yard: TRI,
};
const OWNER_ENUMS: Record<string, readonly string[]> = {
  mobility: ["seated", "minimal-walking", "short-walk", "long-walk"],
  hasCar: TRI,
};

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** Copies only the known, correctly typed fields. A wrong type or unknown enum value rejects the whole body. */
function pick(
  src: Record<string, unknown>,
  enums: Record<string, readonly string[]>,
  bools: string[],
): Record<string, unknown> | null {
  const out: Record<string, unknown> = {};
  for (const [k, allowed] of Object.entries(enums)) {
    const v = src[k];
    if (v === undefined || v === null) continue;
    if (typeof v !== "string" || !allowed.includes(v)) return null;
    out[k] = v;
  }
  for (const k of bools) {
    const v = src[k];
    if (v === undefined || v === null) continue;
    if (typeof v !== "boolean") return null;
    out[k] = v;
  }
  return out;
}

export function validateMatchBody(body: unknown): { dog: DogProfile; owner: OwnerPrefs } | null {
  if (!isObj(body) || !isObj(body["dog"])) return null;
  const owner = body["owner"] === undefined || body["owner"] === null ? {} : body["owner"];
  if (!isObj(owner)) return null;
  const dog = pick(body["dog"], DOG_ENUMS, ["limitedMobility"]);
  const own = pick(owner, OWNER_ENUMS, ["stepFree"]);
  if (!dog || !own) return null;
  return { dog: dog as DogProfile, owner: own as OwnerPrefs };
}

/** Hard eligibility over the whole library, premium included. Held (unknown) cards are not eligible, so not counted. */
export function matchProfile(
  index: PreviewIndex | null,
  dog: DogProfile,
  owner: OwnerPrefs,
): MatchResponse {
  if (!index) return { matching: 0, total: 0, previews: [] };
  const ok = new Set<string>();
  for (const rec of index.pool) {
    // The engine reads structural fields only; the pool holds exactly those.
    if (eligibility(rec as unknown as Adventure, { dog, owner, unlocked: true }).eligible)
      ok.add(rec.id);
  }
  return {
    matching: ok.size,
    total: index.total,
    previews: index.items.filter((i) => ok.has(i.id)).map((i) => i.id),
  };
}
