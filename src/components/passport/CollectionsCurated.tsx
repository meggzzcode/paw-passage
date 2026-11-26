// Curated collections: counts come from the real free library, progress from the one shared set of completions,
// so an adventure finished anywhere (Discover, a custom collection, another deck) counts everywhere.
import { collections, type Collection } from "@/passport/content";
import { members } from "@/passport/progress";
import { AppLink } from "@/components/shell/AppLink";
import { Button } from "@/components/shell/Button";
import { usePassport } from "@/passport/usePassport";
import { CollectionPreviews } from "./CollectionPreviews";
import { AdventureRow, useAdventureLibrary, useLibrary } from "./collections-shared";

export function useCuratedProgress(slug: string) {
  const { save } = usePassport();
  const lib = useLibrary(save);
  const doneIds = new Set(members(save.done));
  const items = lib.eligible.filter((a) => a.collections.includes(slug));
  const done = items.filter((a) => doneIds.has(a.id)).length;
  return { items, done, total: items.length, save };
}

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <>
      <p className="pa-fine">
        {done} of {total} done
      </p>
      <progress
        className="co-progress"
        value={done}
        max={Math.max(total, 1)}
        aria-label={`${done} of ${total} done`}
      />
    </>
  );
}

function CuratedCard({ c }: { c: Collection }) {
  const { done, total } = useCuratedProgress(c.slug);
  const { unlocked } = useAdventureLibrary();
  return (
    <li className={`pa-card pa-accent-${c.accent}`}>
      <h3 className="pa-title">
        <AppLink to={`/collections/${c.slug}`}>{c.title}</AppLink>
      </h3>
      <p>{c.tagline}</p>
      {!unlocked ? (
        <p className="pa-fine">The adventures in this collection are in the full Passport.</p>
      ) : total > 0 ? (
        <>
          <p className="pa-fine">
            {total} {unlocked ? "" : "free "}
            {total === 1 ? "adventure" : "adventures"} that suit your dog
          </p>
          <Progress done={done} total={total} />
        </>
      ) : c.premiumOnly && !unlocked ? (
        <p className="pa-fine">In the full Passport. The free set has none of these.</p>
      ) : (
        <p className="pa-fine">No free adventures here suit what we know about your dog yet.</p>
      )}
    </li>
  );
}

export function CuratedCollections() {
  return (
    <section aria-labelledby="curated-h">
      <h2 id="curated-h" className="pa-h">
        Curated collections
      </h2>
      <p className="pa-fine">
        Themed decks. An adventure counts once, however many decks it appears in, and finishing it
        anywhere ticks it off everywhere.
      </p>
      <ul className="pa-grid co-gap">
        {collections.map((c) => (
          <CuratedCard key={c.slug} c={c} />
        ))}
      </ul>
    </section>
  );
}

export function CuratedDetail({ c }: { c: Collection }) {
  const { items, done, total, save } = useCuratedProgress(c.slug);
  const doneIds = new Set(members(save.done));
  const { unlocked } = useAdventureLibrary();
  if (!unlocked)
    return (
      <>
        <h1 className="pa-h1">{c.title}</h1>
        <p className="pa-sub">{c.description}</p>
        <div className="pa-card">
          <p>The adventures in this collection are in the full Passport.</p>
          <p className="pa-fine">
            Free visitors get one adventure picked for their dog. Take the short quiz to get yours.
          </p>
          <div className="pa-row">
            <Button to="/discover">Get my free pick</Button>
            <Button to="/unlock" variant="secondary">
              See what's included
            </Button>
          </div>
        </div>
        <CollectionPreviews slug={c.slug} />
        <p>
          <AppLink to="/collections" className="pa-linkbtn">
            All collections
          </AppLink>
        </p>
      </>
    );
  return (
    <>
      <h1 className="pa-h1">{c.title}</h1>
      <p className="pa-sub">{c.description}</p>
      {total > 0 && <Progress done={done} total={total} />}
      {c.premiumOnly && !unlocked && total === 0 && (
        <div className="pa-card">
          <p>This collection lives in the full Adventure Passport.</p>
          <p className="pa-fine">
            The free set has none of these adventures, so there is nothing to count here yet.
          </p>
          <Button to="/unlock">See what's included</Button>
        </div>
      )}
      {(!c.premiumOnly || unlocked) && total === 0 && (
        <p className="pa-fine">
          None of the adventures in this collection suit what we know about your dog right now.
        </p>
      )}
      <ul className="co-list">
        {items.map((a) => (
          <AdventureRow
            key={a.id}
            a={a}
            done={doneIds.has(a.id)}
            dogName={save.profile.data.name}
          />
        ))}
      </ul>
      <p>
        <AppLink to="/collections" className="pa-linkbtn">
          All collections
        </AppLink>
      </p>
    </>
  );
}
