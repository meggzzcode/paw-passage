// One source for every collection count. Entitled visitors: counted from the library they can open. Everyone else: the
// free adventures bundled with the site plus the public premium summary (counts only). A number is `null` while unknown,
// and callers print nothing rather than a guess. Worlds have no counts of their own (they only group collections).
import { useMemo } from "react";
import { adventures, collections } from "@/passport/content";
import { usePremiumSummary } from "@/lib/premium-summary";
import { members } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import { useLibrary } from "@/components/passport/collections-shared";

export const totalCollections = () => collections.length;

export function useCollectionStats() {
  const { save } = usePassport();
  const lib = useLibrary(save);
  const summary = usePremiumSummary();
  const doneIds = useMemo(() => new Set(members(save.done)), [save.done]);
  const countOf = (slug: string): number | null => {
    if (lib.unlocked) return lib.all.filter((a) => a.collections.includes(slug)).length;
    if (!summary) return null;
    const premium = summary.collections.find((c) => c.slug === slug)?.count ?? 0;
    return premium + adventures.filter((a) => a.collections.includes(slug)).length;
  };
  /** Entitled only: how many suit this dog (hard suitability), and how many of those are done. */
  const suitedOf = (slug: string) => {
    if (!lib.unlocked) return null;
    const items = lib.eligible.filter((a) => a.collections.includes(slug));
    return { total: items.length, done: items.filter((a) => doneIds.has(a.id)).length };
  };
  /** Entitled only: distinct adventures across several collections (an adventure in two is counted once). */
  const distinctIn = (slugs: readonly string[]): number | null =>
    lib.unlocked
      ? lib.all.filter((a) => a.collections.some((s) => slugs.includes(s))).length
      : null;
  const eligibleIdsIn = (slug: string): string[] =>
    lib.eligible.filter((a) => a.collections.includes(slug)).map((a) => a.id);
  return { unlocked: lib.unlocked, eligibleIdsIn, countOf, suitedOf, distinctIn, save };
}
export type CollectionStats = ReturnType<typeof useCollectionStats>;

export const adventureWord = (n: number) => `${n} ${n === 1 ? "adventure" : "adventures"}`;
