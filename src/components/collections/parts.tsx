// Small shared pieces for the Collections screens.
import { AppLink } from "@/components/shell/AppLink";
import type { Collection } from "@/passport/content";
import type { World } from "@/passport/worlds";
import { worldOf } from "@/passport/worlds";
import { adventureWord, type CollectionStats } from "./stats";

/** A decorative photo (the title next to it carries the meaning). Falls back to a flat accent tile. */
export function Thumb({
  world,
  accent,
  size = "sm",
}: {
  world: World | undefined;
  accent: Collection["accent"];
  size?: "sm" | "lg";
}) {
  return (
    <span className={`co-thumb co-thumb-${size} co-acc-${accent}`} aria-hidden="true">
      {world?.image ? <img src={world.image} alt="" loading="lazy" decoding="async" /> : null}
    </span>
  );
}

/** "12 adventures", plus "5 suit Juno" for entitled visitors. Prints nothing while a count is unknown. */
export function CountLine({
  c,
  stats,
  dogName,
}: {
  c: Collection;
  stats: CollectionStats;
  dogName: string | undefined;
}) {
  const n = stats.countOf(c.slug);
  const s = stats.suitedOf(c.slug);
  if (n === null) return null;
  return (
    <span className="co-count">
      {adventureWord(n)}
      {s && s.total !== n ? ` · ${s.total} suit ${dogName || "your dog"}` : ""}
    </span>
  );
}

/** One compact collection row: small thumbnail, title, tagline, count. */
export function CollectionRow({
  c,
  stats,
  dogName,
}: {
  c: Collection;
  stats: CollectionStats;
  dogName: string | undefined;
}) {
  return (
    <li className="co-crow">
      <Thumb world={worldOf(c.slug)} accent={c.accent} />
      <div className="co-crow-main">
        <p className="co-crow-title">
          <AppLink to={`/collections/${c.slug}`}>{c.title}</AppLink>
        </p>
        <p className="pa-fine">
          {c.tagline} <CountLine c={c} stats={stats} dogName={dogName} />
        </p>
      </div>
    </li>
  );
}
