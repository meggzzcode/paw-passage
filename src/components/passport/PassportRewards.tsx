/* eslint-disable react-refresh/only-export-components */
// Stamps and milestones, with the collectible artwork. A free visitor sees the intro stamp and badge, plus a small
// selection of Full Passport artwork with a ribbon. A paying customer sees earned items, the one that is next up,
// and the rest in full colour. Nothing unearned is ever drawn as earned.
import { AppLink } from "@/components/shell/AppLink";
import { achievements as achDefs, stamps as stampDefs } from "@/passport/content";
import { StampArt } from "./art/StampArt";
import { BadgeArt, badgeIdFor } from "./art/BadgeArt";
import { STATE_CAPTION } from "./art/art-shared";
import type { CollectibleState } from "./art/art-shared";

/** The only free introductory rewards. Everything else belongs to the Full Passport for a free visitor. */
export const FREE_STAMP = "first-adventure";
export const FREE_BADGE = "milestone-1";
/** A small, selected taste of the paid artwork shown to free visitors (not the whole set). */
export const TASTE_STAMPS = [
  "trail-blazer",
  "beach-explorer",
  "night-owl",
  "memory-maker",
] as const;
export const TASTE_BADGES = ["milestone-10", "milestone-50", "collection-complete"] as const;

type Item = { id: string; name: string; note: string; state: CollectibleState };

function Tile({ item, kind }: { item: Item; kind: "stamp" | "badge" }) {
  return (
    <li className="pv8-tile" data-state={item.state}>
      {kind === "stamp" ? (
        <StampArt id={item.id} state={item.state} size={104} label={item.name} />
      ) : (
        <BadgeArt id={item.id} state={item.state} size={104} label={item.name} />
      )}
      <span className="pv8-tile-name" aria-hidden="true">
        {item.name}
      </span>
      <span className="pv8-tile-state" aria-hidden="true">
        {STATE_CAPTION[item.state]}
      </span>
      {item.note && item.state !== "earned" && <span className="pv8-tile-note">{item.note}</span>}
    </li>
  );
}

function Shelf({ items, kind, label }: { items: Item[]; kind: "stamp" | "badge"; label: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="pv8-shelf" aria-label={label}>
      {items.map((i) => (
        <Tile key={i.id} item={i} kind={kind} />
      ))}
    </ul>
  );
}

export type RewardsProps = {
  earnedStamps: readonly string[];
  earnedMilestones: readonly number[];
  collectionsComplete: number;
  entitled: boolean;
};

export function useRewardItems({
  earnedStamps,
  earnedMilestones,
  collectionsComplete,
  entitled,
}: RewardsProps) {
  const got = new Set(earnedStamps);
  const stampItems: Item[] = stampDefs.map((s) => ({
    id: s.slug,
    name: s.title,
    note: s.rule,
    state: "available",
  }));
  const badgeItems: Item[] = achDefs.map((a) => {
    const id = badgeIdFor(a);
    const earned =
      a.kind === "collection-complete"
        ? collectionsComplete > 0
        : a.threshold !== undefined && earnedMilestones.includes(a.threshold);
    return { id, name: a.title, note: a.reward, state: earned ? "earned" : "available" };
  });
  for (const s of stampItems) if (got.has(s.id)) s.state = "earned";
  if (entitled) {
    const nextStamp = stampItems.find((s) => s.state !== "earned");
    if (nextStamp) nextStamp.state = "next";
    const nextBadge = badgeItems.find(
      (b) => b.state !== "earned" && b.id !== "collection-complete",
    );
    if (nextBadge) nextBadge.state = "next";
  } else {
    for (const s of stampItems)
      if (s.state !== "earned") s.state = s.id === FREE_STAMP ? "next" : "full-passport";
    for (const b of badgeItems)
      if (b.state !== "earned") b.state = b.id === FREE_BADGE ? "next" : "full-passport";
  }
  return { stampItems, badgeItems };
}

export function StampsAndMilestones(props: RewardsProps) {
  const { stampItems, badgeItems } = useRewardItems(props);
  if (!props.entitled) {
    const stampsEarned = stampItems.filter((s) => s.state === "earned");
    const intro = stampsEarned.length
      ? stampsEarned
      : stampItems.filter((s) => s.id === FREE_STAMP);
    const introBadge = badgeItems.filter((b) => b.id === FREE_BADGE || b.state === "earned");
    return (
      <div className="pv8-stack">
        <div>
          <h3 className="pv8-h3">Your first stamp</h3>
          <p className="pa-fine">Free with your first adventure.</p>
          <Shelf items={intro.map((i) => ({ ...i, note: "" }))} kind="stamp" label="Your stamps" />
          <Shelf
            items={introBadge.map((i) => ({ ...i, note: "" }))}
            kind="badge"
            label="Your milestones"
          />
        </div>
        <div>
          <h3 className="pv8-h3">Included with the Full Passport</h3>
          <Shelf
            items={stampItems
              .filter((s) => (TASTE_STAMPS as readonly string[]).includes(s.id))
              .map((i) => ({ ...i, note: "" }))}
            kind="stamp"
            label="Full Passport stamps"
          />
          <Shelf
            items={badgeItems
              .filter((b) => (TASTE_BADGES as readonly string[]).includes(b.id))
              .map((i) => ({ ...i, note: "" }))}
            kind="badge"
            label="Full Passport milestones"
          />
          <p className="pa-fine">
            A selection. The Full Passport has {stampItems.length} stamps and {badgeItems.length}{" "}
            milestones to collect.{" "}
            <AppLink to="/unlock" className="pa-linkbtn">
              See the Full Passport
            </AppLink>
          </p>
        </div>
      </div>
    );
  }
  const stampsEarned = stampItems.filter((s) => s.state === "earned").length;
  const badgesEarned = badgeItems.filter((b) => b.state === "earned").length;
  const open = (i: Item) => i.state !== "earned";
  return (
    <div className="pv8-stack">
      <div>
        <h3 className="pv8-h3">Stamps</h3>
        <p className="pa-fine">
          {stampsEarned} of {stampItems.length} collected, at your own pace.
        </p>
        <Shelf items={stampItems.filter((s) => !open(s))} kind="stamp" label="Earned stamps" />
        <Shelf items={stampItems.filter(open)} kind="stamp" label="Stamps to earn" />
      </div>
      <div>
        <h3 className="pv8-h3">Milestones</h3>
        <p className="pa-fine">
          {badgesEarned} of {badgeItems.length} reached.
        </p>
        <Shelf items={badgeItems.filter((b) => !open(b))} kind="badge" label="Earned milestones" />
        <Shelf items={badgeItems.filter(open)} kind="badge" label="Milestones to reach" />
      </div>
    </div>
  );
}
