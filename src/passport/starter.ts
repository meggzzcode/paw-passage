// The one free adventure. A free visitor answers a short survey and the engine picks the single best match from the
// public free pool. Hard eligibility comes first (never overridden), unknown answers are never "safe", and a dog we
// know nothing about gets the gentle default. No network, no randomness beyond the engine's fixed tie-break.
import { eligibility, rank, type Ctx, type History } from "./engine";
import { has, members, type Save } from "./progress";
import type { Adventure } from "./schema";

export type StarterPick =
  { ok: true; adventure: Adventure; why: string[] } | { ok: false; reason: "none-eligible" };

const ctxOf = (save: Save): Ctx => ({
  dog: save.profile.data,
  owner: save.owner.data,
  unlocked: false,
});

const historyOf = (save: Save): History => ({
  done: new Set(members(save.done)),
  favorites: new Set(members(save.favorites)),
  skipped: new Set<string>(),
  feedback: Object.fromEntries(Object.entries(save.feedback).map(([k, v]) => [k, v.value])),
});

/** Picks the best free adventure for this save's answers. Held (unanswered) adventures are never picked. */
export function selectStarter(library: Adventure[], save: Save): StarterPick {
  const free = library.filter((a) => a.access === "free");
  const ctx = ctxOf(save);
  const history = historyOf(save);
  for (const includeDone of [false, true]) {
    const r = rank(free, ctx, {}, history, { seed: "starter", includeDone });
    const top = r.ok ? r.ranked[0] : undefined;
    if (top) return { ok: true, adventure: top.adventure, why: top.why };
  }
  return { ok: false, reason: "none-eligible" };
}

/**
 * The saved starter, if it is still usable: it must exist in the free pool and either be completed (the keepsake stays
 * whatever the answers say) or still be eligible for the current answers.
 */
export function savedStarter(library: Adventure[], save: Save): Adventure | undefined {
  const id = save.starter?.id;
  if (!id) return undefined;
  const a = library.find((x) => x.id === id && x.access === "free");
  if (!a) return undefined;
  return has(save.done, id) || eligibility(a, ctxOf(save)).eligible ? a : undefined;
}
