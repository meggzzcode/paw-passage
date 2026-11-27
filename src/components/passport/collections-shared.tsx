// Small pieces shared by the Collections screens: the engine context, the library views and one adventure row.
import { useMemo, useState, type ReactNode } from "react";
import { freeLibrary } from "@/passport/content";
import { isRevealed, savedStarter } from "@/passport/starter";
import { usePassport } from "@/passport/usePassport";
import { useEntitlement } from "@/passport/useEntitlement";
import { eligibility, smartMembers, type Ctx, type History } from "@/passport/engine";
import { members, type Save } from "@/passport/progress";
import type { CustomCollection, SessionFilters } from "@/passport/profile";
import type { Adventure } from "@/passport/schema";
import { MysteryCard, RevealedCard } from "@/components/passport/AdventureCard";
import { isSavedMystery } from "@/components/passport/RevealSurface";

export function ctxFor(save: Save, unlocked = false): Ctx {
  return { dog: save.profile.data, owner: save.owner.data, unlocked };
}
export function historyFor(save: Save): History {
  return {
    done: new Set(members(save.done)),
    favorites: new Set(members(save.favorites)),
    skipped: new Set<string>(),
  };
}

/**
 * The library for Discover and the intro flow: the free adventures, plus the premium ones only while access is confirmed.
 * Premium adventures live in memory only. Ids are the same stable ids everywhere. Free wins if an id ever collides.
 * Do NOT use this for the Collections, Saved or editor screens: see useAccessLibrary.
 */
export function useAdventureLibrary() {
  const { status, premium, message } = useEntitlement();
  const unlocked = status === "entitled";
  const all = useMemo(() => {
    const free = freeLibrary();
    if (!unlocked || premium.length === 0) return free;
    const ids = new Set(free.map((a) => a.id));
    return [...free, ...premium.filter((a) => !ids.has(a.id))];
  }, [unlocked, premium]);
  return { all, unlocked, status, message };
}

/**
 * The library the Collections, Saved and editor screens may show. A visitor without the full Passport gets exactly one
 * adventure here: their own revealed intro adventure. Every other free-pool adventure stays behind the intro flow, so no
 * list, expansion, favorite or saved link can reveal a second one. (The free pool is public YAML in the bundle, so this
 * keeps the product promise; it is not a security boundary.) Entitled visitors get the whole library, unchanged.
 */
export function useAccessLibrary() {
  const lib = useAdventureLibrary();
  const { save } = usePassport();
  const introId = useMemo(() => {
    const a = isRevealed(save) ? savedStarter(freeLibrary(), save) : undefined;
    return a?.id;
  }, [save]);
  const all = useMemo(
    () => (lib.unlocked ? lib.all : lib.all.filter((a) => a.id === introId)),
    [lib.unlocked, lib.all, introId],
  );
  return { all, unlocked: lib.unlocked, status: lib.status, message: lib.message, introId };
}

/** The library, and the part of it that suits this dog (hard eligibility only; never loosened here). */
export function useLibrary(save: Save) {
  const { all, unlocked } = useAccessLibrary();
  return useMemo(() => {
    const ctx = ctxFor(save, unlocked);
    const eligible = all.filter((a) => eligibility(a, ctx).eligible);
    return {
      all,
      unlocked,
      eligible,
      byId: new Map(all.map((a) => [a.id, a])),
      eligibleIds: new Set(eligible.map((a) => a.id)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save.profile, save.owner, all, unlocked]);
}

type Lib = ReturnType<typeof useLibrary>;

/** The adventures that currently count toward a custom collection (always suited to this dog). */
export function memberIdsOf(c: CustomCollection, lib: Lib, save: Save): string[] {
  if (c.kind === "smart")
    return smartMembers(lib.all, c, ctxFor(save, lib.unlocked), historyFor(save)).map((a) => a.id);
  return c.ids.filter((id) => lib.eligibleIds.has(id));
}

export const timeText = (a: Adventure) =>
  a.minutesMin === a.minutesMax ? `${a.minutesMin} min` : `${a.minutesMin}–${a.minutesMax} min`;
export const costText = (a: Adventure) =>
  a.costMax === 0
    ? "Free"
    : a.costMin === a.costMax
      ? `$${a.costMax}`
      : `$${a.costMin}–$${a.costMax}`;

/** One adventure in a list: title, facts, done state and an expandable full card. `actions` are extra buttons. */
export function AdventureRow({
  a,
  done,
  note,
  actions,
  dogName,
}: {
  a: Adventure;
  done: boolean;
  note?: string | undefined;
  actions?: ReactNode;
  dogName?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [, bump] = useState(0);
  const { unlocked, introId } = useAccessLibrary();
  // Defense in depth: only an entitled visitor, or the visitor's own intro adventure, can be opened from a list.
  const canOpen = unlocked || a.id === introId;
  // A saved adventure that was never revealed stays a mystery here: no title, no instructions, until it is revealed.
  const mystery = !done && isSavedMystery(a.id);
  return (
    <li className="co-row" data-mystery={mystery ? "true" : undefined}>
      <div className="co-row-main">
        <p className="co-row-title">
          {done && <span aria-label="Completed">✓ </span>}
          {mystery ? "Mystery adventure, saved for later" : a.title}
        </p>
        <p className="pa-fine">
          {timeText(a)} · {costText(a)}
          {done ? " · completed" : ""}
          {mystery ? " · not revealed yet" : ""}
          {note ? ` · ${note}` : ""}
        </p>
      </div>
      <div className="co-row-actions">
        {actions}
        {canOpen && (
          <button
            type="button"
            className="pp-btn pp-btn-ghost"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : mystery ? "Reveal" : "Open"}
            <span className="sr-only"> {mystery ? "this mystery adventure" : a.title}</span>
          </button>
        )}
      </div>
      {open && canOpen && (
        <div className="co-row-detail">
          {mystery ? (
            <MysteryCard a={a} onReveal={() => bump((n) => n + 1)} />
          ) : (
            <RevealedCard a={a} dogName={dogName} />
          )}
        </div>
      )}
    </li>
  );
}

export type FilterTemplate = { name: string; blurb: string; filters: SessionFilters };

/** One-tap starting points for smart collections. Names that mention a dog use the dog's name when we know it. */
export function smartTemplates(dogName: string | undefined): FilterTemplate[] {
  return [
    {
      name: dogName ? `Rainy Days with ${dogName}` : "Rainy Days",
      blurb: "Indoor adventures for wet weather",
      filters: { setting: "indoor", weather: "rain" },
    },
    { name: "Adventures Under $10", blurb: "Budget up to $10", filters: { budget: 10 } },
    {
      name: "Gentle Golden Days",
      blurb: "Gentle-energy adventures",
      filters: { energy: ["gentle"] },
    },
    {
      name: "Our Weekend Bucket List",
      blurb: "Ones we have not done yet",
      filters: { novelty: "new-only" },
    },
    { name: "Five-Minute Adventures", blurb: "Five minutes or less", filters: { minutes: 5 } },
    {
      name: "No-Car Adventures",
      blurb: "Home or on foot",
      filters: { transport: "none-or-walk" },
    },
  ];
}
