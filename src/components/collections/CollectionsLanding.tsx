// The Collections directory. Editorial hierarchy and nothing more: a short intro, one featured collection (this season's
// pick takes its place when it is in season), six worlds, four practical shortcuts and ONE action that opens the compact
// list of every collection. No second list of "relevant" collections, no inline list of all of them.
// Worlds are presentation only: the 25 collections, their ids and their addresses are unchanged.
import { useState } from "react";
import { collections, type Collection } from "@/passport/content";
import { AppLink } from "@/components/shell/AppLink";
import { SHORTCUT_COLLECTIONS, WORLDS, featuredPick, worldOf, type World } from "@/passport/worlds";
import { CollectionRow, CountLine, Thumb } from "./parts";
import { totalCollections, useCollectionStats, type CollectionStats } from "./stats";

const bySlug = (slug: string): Collection | undefined => collections.find((c) => c.slug === slug);

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
  const pick = featuredPick(new Date().getMonth());
  const featured = bySlug(pick.slug);
  const unplaced = collections.filter((c) => !worldOf(c.slug));
  const total = totalCollections();
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="co-landing">
      <p className="co-lede">
        Pick a feeling and see what fits. Every collection is self-paced, with no deadlines.
      </p>

      {featured && (
        <section aria-labelledby="co-feat-h" className="co-featured">
          <Thumb world={worldOf(featured.slug)} accent={featured.accent} size="lg" />
          <div className="co-featured-body">
            <p className="pa-kicker" id="co-feat-h">
              {pick.lead}
            </p>
            <h2 className="co-featured-title">
              <AppLink to={`/collections/${featured.slug}`}>{featured.title}</AppLink>
            </h2>
            <p>{featured.tagline}</p>
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

      <section aria-label="All collections" className="co-block co-browse">
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          aria-expanded={showAll}
          aria-controls="all-collections"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? `Hide the ${total} collections` : `Browse all ${total} collections`}
        </button>
        {showAll && (
          <div id="all-collections">
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
          </div>
        )}
      </section>
    </div>
  );
}
