// One world: a short intro, its collections as compact rows, and (for visitors without the full Passport) one
// section-level invitation with a relevant intro-quiz link. No purchase panel on each row.
import { collections, type Collection } from "@/passport/content";
import { AppLink } from "@/components/shell/AppLink";
import { Button } from "@/components/shell/Button";
import { discoverHref } from "@/passport/journal-context";
import type { World } from "@/passport/worlds";
import { CollectionRow } from "./parts";
import { adventureWord, useCollectionStats } from "./stats";

export function BackToDirectory() {
  return (
    <p className="co-back">
      <AppLink to="/collections" className="pa-linkbtn">
        ← All collections
      </AppLink>
    </p>
  );
}

export function WorldPage({ w }: { w: World }) {
  const stats = useCollectionStats();
  const dogName = stats.save.profile.data.name;
  const list = w.slugs
    .map((s) => collections.find((c) => c.slug === s))
    .filter((c): c is Collection => !!c);
  const distinct = stats.distinctIn(w.slugs);
  return (
    <div className="co-detail">
      <BackToDirectory />
      <header className={`co-hero co-acc-${w.accent}`}>
        <span className="co-hero-img" aria-hidden="true">
          <img src={w.image} alt="" decoding="async" />
        </span>
        <div className="co-hero-body">
          <p className="pa-kicker">World</p>
          <h1 className="pa-h1">{w.title}</h1>
          <p className="pa-sub">{w.intro}</p>
          <p className="pa-fine">
            {list.length} {list.length === 1 ? "collection" : "collections"}
            {distinct !== null ? ` · ${adventureWord(distinct)} in all` : ""}
          </p>
        </div>
      </header>
      <ul className="co-clist">
        {list.map((c) => (
          <CollectionRow key={c.slug} c={c} stats={stats} dogName={dogName} thumb={false} />
        ))}
      </ul>
      {!stats.unlocked && (
        <aside className="pa-panel co-invite" aria-labelledby="co-wi-h">
          <p className="pa-kicker">Full Passport</p>
          <h3 className="pa-h" id="co-wi-h">
            Selected previews, and one adventure free
          </h3>
          <p>
            Each collection shows a few selected previews. The full instructions are part of the
            Passport. Your first adventure is free: answer a few questions and we will pick one for
            your dog.
          </p>
          <div className="pa-row">
            <Button to={discoverHref(w.ctx)}>Find our first adventure</Button>
            <Button to="/unlock" variant="secondary">
              See what's included
            </Button>
          </div>
        </aside>
      )}
      <BackToDirectory />
    </div>
  );
}
