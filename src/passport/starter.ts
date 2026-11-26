// The one free introductory adventure. A free visitor answers a short quiz and the engine picks the single best match from the
// public free pool. Hard eligibility comes first (never overridden), unknown answers are never "safe", and a dog we
// know nothing about gets the gentle default. No network, no randomness beyond the engine's fixed tie-break.
import { activityConfirm, eligibility, rank, type Ctx, type History } from "./engine";
import { RELAX_KEYS, starterFilters, type Relax, type RelaxKey } from "./quiz";
import { has, members, type Save } from "./progress";
import type { Adventure } from "./schema";

/** Public address of the premium previews showcase. Other pages link here (plain `to`/`href`, no query string). */
export const PREVIEWS_PATH = "/previews";

export type StarterPick =
  | { ok: true; adventure: Adventure; why: string[] }
  | { ok: false; reason: "none-eligible" | "filters-too-narrow" };

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

/**
 * Picks the best free adventure for this save's answers. Held (unanswered) adventures are never picked.
 * `exclude` holds ids already offered this session ("show me another" never repeats one).
 * Where / time / spend answers act as today's filters; `relax` ignores only the optional ones (those three and children joining, which
 * is still preferred in ranking). Hard eligibility, no-car and quiet always still apply.
 * An adventure that needs no safety question is preferred over one that does.
 */
export function selectStarter(
  library: Adventure[],
  save: Save,
  exclude: ReadonlySet<string> = new Set(),
  opts: { relax?: Relax } = {},
): StarterPick {
  const free = library.filter((a) => a.access === "free" && !exclude.has(a.id));
  const ctx = ctxOf(save);
  const history = historyOf(save);
  const filters = starterFilters(save.owner.data, { relax: opts.relax ?? false });
  let narrow = false;
  for (const includeDone of [false, true]) {
    const r = rank(free, ctx, filters, history, { seed: "starter", includeDone });
    if (!r.ok && r.reason === "filters-too-narrow") narrow = true;
    const all = r.ok ? r.ranked : [];
    // With children joining set aside by "widen", a family-suited adventure that fits is still preferred.
    const fam = ctx.owner.kids ? all.filter((x) => x.adventure.household.includes("family")) : [];
    const list = fam.length > 0 ? fam : all;
    const top = list.find((x) => !activityConfirm(x.adventure, ctx.dog)) ?? list[0];
    if (top) return { ok: true, adventure: top.adventure, why: top.why };
  }
  return { ok: false, reason: narrow ? "filters-too-narrow" : "none-eligible" };
}

/** How many free adventures suit the current answers (hard eligibility only). Used for honest "more to see" lines. */
export function eligibleFreeCount(library: Adventure[], save: Save): number {
  const ctx = ctxOf(save);
  return library.filter((a) => a.access === "free" && eligibility(a, ctx).eligible).length;
}

/**
 * The saved starter, if it is still usable: it must exist in the free pool and either be revealed or completed (it
 * stays readable whatever the answers say) or still be eligible for the current answers.
 */
export function savedStarter(library: Adventure[], save: Save): Adventure | undefined {
  const id = save.starter?.id;
  if (!id) return undefined;
  const a = library.find((x) => x.id === id && x.access === "free");
  if (!a) return undefined;
  // Once revealed (or completed) it stays readable whatever the answers say now.
  const kept = has(save.done, id) || save.starter?.revealedAt !== undefined;
  return kept || eligibility(a, ctxOf(save)).eligible ? a : undefined;
}

/** True once the visitor accepted the recommendation (or completed it): the full instructions are theirs to re-read. */
export const isRevealed = (save: Save): boolean =>
  !!save.starter && (save.starter.revealedAt !== undefined || has(save.done, save.starter.id));

/** Which single optional preferences set aside, one at a time, would make a free adventure fit. */
export type NoMatchCause =
  | { kind: "single"; keys: RelaxKey[] } // each of these alone would find one
  | { kind: "several"; keys: RelaxKey[] } // only setting these aside together finds one
  | { kind: "hard" }; // even with every optional preference set aside, nothing free suits the safety answers

/**
 * Why nothing fits. Optional preferences the owner actually answered are tried one at a time, then together. Mandatory
 * suitability (life stage, mobility, noise, crowds, dogs, food, water, no car, quiet) is never part of this.
 */
export function noMatchCause(
  library: Adventure[],
  save: Save,
  already: readonly RelaxKey[] = [],
): NoMatchCause {
  const o = save.owner.data;
  const answered = RELAX_KEYS.filter(
    (k) =>
      !already.includes(k) &&
      (k === "where"
        ? o.where === "home" || o.where === "nearby"
        : k === "kids"
          ? o.kids === true
          : k === "time"
            ? o.time === "short" || o.time === "medium"
            : o.spend === "none" || o.spend === "inexpensive"),
  );
  const single = answered.filter(
    (k) => selectStarter(library, save, new Set(), { relax: [...already, k] }).ok,
  );
  if (single.length) return { kind: "single", keys: single };
  if (
    answered.length > 1 &&
    selectStarter(library, save, new Set(), { relax: [...already, ...answered] }).ok
  )
    return { kind: "several", keys: answered };
  return { kind: "hard" };
}

/** True when another free adventure (not offered yet, and not the current one) fits the answers: "Show me another" is worth offering. */
export function hasAnother(
  library: Adventure[],
  save: Save,
  seen: ReadonlySet<string>,
  relax: Relax,
): boolean {
  const cur = save.starter?.id;
  const ex = new Set(seen);
  if (cur) ex.add(cur);
  return selectStarter(library, save, ex, { relax }).ok;
}
