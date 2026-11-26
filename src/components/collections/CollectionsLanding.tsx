// The Collections directory. Editorial hierarchy: a short intro, one featured collection, six worlds (varied tiles),
// practical shortcuts, a few relevant collections, this season's pick and a compact list of every collection.
// Worlds are presentation only: the 25 collections, their ids and their addresses are unchanged.
import { collections, type Collection } from "@/passport/content";
import { AppLink } from "@/components/shell/AppLink";
import {
  FEATURED_SLUG,
  SHORTCUT_COLLECTIONS,
  WORLDS,
  seasonalPick,
  worldOf,
  type World,
} from "@/passport/worlds";
import { CollectionRow, CountLine, Thumb } from "./parts";
import { totalCollections, useCollectionStats, type CollectionStats } from "./stats";

const bySlug = (slug: string): Collection | undefined => collections.find((c) => c.slug === slug);

/** A few collections that are relevant to this visitor. No popularity claims: entitled = most that suit the dog. */
function relevantCollections(stats: CollectionStats): Collection[] {
  const scored = collections.map((c) => ({
    c,
    n: stats.unlocked
      ? (() => {
          const s = stats.suitedOf(c.slug);
          return s ? s.total - s.done : 0;
        })()
      : (stats.countOf(c.slug) ?? 0),
  }));
  return scored
    .filter((x) => x.n > 0 && x.c.slug !== FEATURED_SLUG)
    .sort((a, b) => b.n - a.n || a.c.order - b.c.order)
    .slice(0, 4)
    .map((x) => x.c);
}

function WorldTile({ w, i, stats }: { w: World; i: number; stats: CollectionStats }) {
  const present = w.slugs.map(bySlug).filter((c): c is Collection => !!c);
  const distinct = stats.distinctIn(w.slugs);
  return (
    <li className={`co-world co-world-${i + 1} co-acc-${w.accent}`}>
      <AppLink to="/collections" search={{ world: w.slug } as never} className="co-world-link">
        <span className="co-world-img" aria-hidden="true">
          <img src={w.image} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="co-world-body">
          <span className="co-world-title">{w.title}</span>
          <span className="co-world-blurb">{w.blurb}</span>
          <span className="co-world-meta">
            {present.length} {present.length === 1 ? "collection" : "collections"}
            {distinct !== null ? ` · ${distinct} adventures` : ""}
          </span>
        </span>
      </AppLink>
    </li>
  );
}

export function CollectionsLanding() {
  const stats = useCollectionStats();
  const dogName = stats.save.profile.data.name;
  const featured = bySlug(FEATURED_SLUG);
  const season = seasonalPick(new Date().getMonth());
  const seasonal = bySlug(season.slug);
  const relevant = relevantCollections(stats);
  const unplaced = collections.filter((c) => !worldOf(c.slug));
  const total = totalCollections();

  return (
    <div className="co-landing">
      <p className="co-lede">
        Collections gather our adventures by mood, season and chapter of life, so you can pick a
        feeling and see what fits. Everything is self-paced, with no deadlines.{" "}
        <a href="#all-collections" className="pa-linkbtn">
          View all collections
        </a>
      </p>

      {featured && (
        <section aria-labelledby="co-feat-h" className="co-featured">
          <Thumb world={worldOf(featured.slug)} accent={featured.accent} size="lg" />
          <div className="co-featured-body">
            <p className="pa-kicker" id="co-feat-h">
              Start here
            </p>
            <h2 className="co-featured-title">
              <AppLink to={`/collections/${featured.slug}`}>{featured.title}</AppLink>
            </h2>
            <p>{featured.description}</p>
            <p className="pa-fine">
              <CountLine c={featured} stats={stats} dogName={dogName} />
            </p>
            <AppLink to={`/collections/${featured.slug}`} className="pp-btn pp-btn-primary">
              Explore {featured.title}
            </AppLink>
          </div>
        </section>
      )}

      <section aria-labelledby="co-worlds-h" className="co-block">
        <h2 id="co-worlds-h" className="pa-h">
          Six ways to wander
        </h2>
        <ul className="co-worlds">
          {WORLDS.map((w, i) => (
            <WorldTile key={w.id} w={w} i={i} stats={stats} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="co-quick-h" className="co-block">
        <h2 id="co-quick-h" className="pa-h">
          Quick ways in
        </h2>
        <ul className="co-shortcuts">
          {SHORTCUT_COLLECTIONS.filter((s) => bySlug(s.slug)).map((s) => (
            <li key={s.slug}>
              <AppLink to={`/collections/${s.slug}`} className="pa-chip co-chip-link">
                {s.label}
              </AppLink>
            </li>
          ))}
        </ul>
      </section>

      <div className="co-two">
        {relevant.length > 0 && (
          <section aria-labelledby="co-rel-h" className="co-block">
            <h2 id="co-rel-h" className="pa-h">
              {stats.unlocked ? `Suited to ${dogName || "your dog"}` : "Good places to start"}
            </h2>
            <ul className="co-clist">
              {relevant.map((c) => (
                <CollectionRow key={c.slug} c={c} stats={stats} dogName={dogName} />
              ))}
            </ul>
          </section>
        )}
        {seasonal && (
          <section aria-labelledby="co-season-h" className="co-block">
            <h2 id="co-season-h" className="pa-h">
              {season.lead}
            </h2>
            <ul className="co-clist">
              <CollectionRow c={seasonal} stats={stats} dogName={dogName} />
            </ul>
          </section>
        )}
      </div>

      <section aria-labelledby="all-collections-h" id="all-collections" className="co-block">
        <h2 id="all-collections-h" className="pa-h">
          All {total} collections
        </h2>
        {WORLDS.map((w) => {
          const list = w.slugs.map(bySlug).filter((c): c is Collection => !!c);
          if (list.length === 0) return null;
          return (
            <div key={w.id} className="co-allgroup">
              <h3 className="co-allgroup-h">
                <AppLink to="/collections" search={{ world: w.slug } as never}>
                  {w.title}
                </AppLink>
              </h3>
              <ul className="co-clist">
                {list.map((c) => (
                  <CollectionRow key={c.slug} c={c} stats={stats} dogName={dogName} />
                ))}
              </ul>
            </div>
          );
        })}
        {unplaced.length > 0 && (
          <div className="co-allgroup">
            <h3 className="co-allgroup-h">More collections</h3>
            <ul className="co-clist">
              {unplaced.map((c) => (
                <CollectionRow key={c.slug} c={c} stats={stats} dogName={dogName} />
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
