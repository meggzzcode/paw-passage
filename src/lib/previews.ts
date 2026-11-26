// Public premium previews. Both requests are anonymous and carry no premium text: GET /api/previews returns an
// allowlisted public record per showcase card, POST /api/previews/match returns aggregate counts and preview ids only.
// Any failure returns null; callers fall back to verified local counts and plain wording.
import type { DogProfile, OwnerPrefs } from "@/passport/profile";

export type PreviewItem = {
  id: string;
  title: string;
  teaser: string;
  category: string; // label of activityTypes[0]
  minutesMin: number;
  minutesMax: number;
  costMin: number;
  costMax: number;
  setting: "indoor" | "outdoor" | "either";
  effort: "gentle" | "moderate" | "lively";
  needs: { car: boolean; booking: boolean; food: boolean; water: boolean };
  lifeStages: ("puppy" | "adult" | "senior")[];
  keepsake: { family: string; theme: string };
  role: string;
  collections: string[];
  access: "free" | "premium";
};
export type PreviewsResponse = { items: PreviewItem[]; total: number; collections: number };
export type MatchResponse = { matching: number; total: number; previews: string[] };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function parsePreviews(b: unknown): PreviewsResponse | null {
  if (!b || typeof b !== "object") return null;
  const r = b as Record<string, unknown>;
  if (!Array.isArray(r["items"]) || !isNum(r["total"]) || !isNum(r["collections"])) return null;
  const items = (r["items"] as unknown[]).filter(
    (i): i is PreviewItem =>
      !!i &&
      typeof i === "object" &&
      typeof (i as PreviewItem).id === "string" &&
      typeof (i as PreviewItem).title === "string" &&
      typeof (i as PreviewItem).teaser === "string",
  );
  return { items, total: r["total"], collections: r["collections"] };
}

export async function fetchPreviews(): Promise<PreviewsResponse | null> {
  try {
    const res = await fetch("/api/previews", { credentials: "same-origin" });
    if (!res.ok) return null;
    return parsePreviews(await res.json());
  } catch {
    return null;
  }
}

/** Sent only on an explicit user action, never automatically. Returns null on any failure. */
export async function fetchMatch(
  dog: DogProfile,
  owner: OwnerPrefs,
): Promise<MatchResponse | null> {
  try {
    const res = await fetch("/api/previews/match", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dog, owner }),
    });
    if (!res.ok) return null;
    const b = (await res.json()) as Record<string, unknown>;
    if (!isNum(b["matching"]) || !isNum(b["total"]) || !Array.isArray(b["previews"])) return null;
    return {
      matching: b["matching"],
      total: b["total"],
      previews: (b["previews"] as unknown[]).filter((x): x is string => typeof x === "string"),
    };
  } catch {
    return null;
  }
}
