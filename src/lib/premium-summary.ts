// The size of the premium library, from the public GET /api/premium/summary. Counts only: no titles, no text.
// Any failure returns null and the page shows honest fallback copy instead of a number.
import { useEffect, useState } from "react";

export type PremiumSummary = { count: number; collections: { slug: string; count: number }[] };

export const SUMMARY_FALLBACK = "A much larger library";

export async function fetchPremiumSummary(): Promise<PremiumSummary | null> {
  try {
    const res = await fetch("/api/premium/summary", { credentials: "same-origin" });
    if (!res.ok) return null;
    const b = (await res.json()) as Record<string, unknown>;
    const count = b["count"];
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1) return null;
    const cols = Array.isArray(b["collections"]) ? b["collections"] : [];
    const collections = cols
      .filter(
        (c): c is { slug: string; count: number } =>
          !!c &&
          typeof (c as { slug?: unknown }).slug === "string" &&
          typeof (c as { count?: unknown }).count === "number",
      )
      .filter((c) => c.count > 0);
    return { count, collections };
  } catch {
    return null;
  }
}

/** "N premium adventures across M collections", or the fallback text when the summary is unavailable. */
export function summaryText(s: PremiumSummary | null): string {
  if (!s) return SUMMARY_FALLBACK;
  const m = s.collections.length;
  const adv = `${s.count} premium ${s.count === 1 ? "adventure" : "adventures"}`;
  return m > 0 ? `${adv} across ${m} ${m === 1 ? "collection" : "collections"}` : adv;
}

const KINDS = "puppies, seniors, hyper dogs, homebodies and more";

/** The warm unlock line. Uses the live counts when we have them, and honest fallback wording when we do not. */
export function unlockLine(s: PremiumSummary | null): string {
  if (!s)
    return `Unlock a much larger library of adventures and challenges, for every kind of dog: ${KINDS}.`;
  const m = s.collections.length;
  const where = m > 0 ? ` across ${m} ${m === 1 ? "collection" : "collections"}` : "";
  return `Unlock ${s.count} adventures and challenges${where}, for every kind of dog: ${KINDS}.`;
}

export function usePremiumSummary(): PremiumSummary | null {
  const [s, setS] = useState<PremiumSummary | null>(null);
  useEffect(() => {
    let live = true;
    void fetchPremiumSummary().then((v) => live && setS(v));
    return () => {
      live = false;
    };
  }, []);
  return s;
}
