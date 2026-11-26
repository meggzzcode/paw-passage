// One collection. Entitled visitors: the adventures that suit their dog, with save and open (plan) actions.
// Everyone else: the public preview cards only, with ONE section-level invitation and a relevant intro-quiz link.
import { useEffect } from "react";
import type { Collection } from "@/passport/content";
import { AppLink } from "@/components/shell/AppLink";
import { Button } from "@/components/shell/Button";
import { PreviewCard } from "@/components/passport/PreviewCard";
import { flow } from "@/components/passport/flow-events";
import { AdventureRow, useAccessLibrary } from "@/components/passport/collections-shared";
import { usePreviews } from "@/lib/usePreviews";
import { discoverHref } from "@/passport/journal-context";
import { favorite, unfavorite } from "@/passport/local-store";
import { has, members } from "@/passport/progress";
import { premiumPreviews } from "@/passport/preview-view";
import { worldOf } from "@/passport/worlds";
import { NarrowBar, narrow, useNarrow } from "./Narrow";
import { Thumb } from "./parts";
import { BackToDirectory } from "./WorldPage";
import { adventureWord, useCollectionStats } from "./stats";

function Header({ c }: { c: Collection }) {
  const w = worldOf(c.slug);
  return (
    <>
      <p className="co-crumbs">
        <AppLink to="/collections" className="pa-linkbtn">
          ← All collections
        </AppLink>
        {w && (
          <>
            {" "}
            <span aria-hidden="true">/</span>{" "}
            <AppLink to="/collections" search={{ world: w.slug } as never} className="pa-linkbtn">
              {w.title}
            </AppLink>
          </>
        )}
      </p>
      <header className={`co-hero co-hero-small co-acc-${c.accent}`}>
        <Thumb world={w} accent={c.accent} size="lg" />
        <div className="co-hero-body">
          <h1 className="pa-h1">{c.title}</h1>
          <p className="pa-sub">{c.description}</p>
        </div>
      </header>
    </>
  );
}

function PublicCollection({ c }: { c: Collection }) {
  const stats = useCollectionStats();
  const { status, data } = usePreviews();
  const n = useNarrow();
  const items = premiumPreviews(data?.items ?? []).filter((i) => i.collections.includes(c.slug));
  const shown = narrow(items, n.on);
  const total = stats.countOf(c.slug);
  const w = worldOf(c.slug);
  const { all } = useAccessLibrary(); // for a free visitor this holds only their own revealed intro adventure
  const own = all.filter((a) => a.collections.includes(c.slug));
  useEffect(() => {
    if (status === "ready" && items.length > 0)
      flow("collection_preview_viewed", { collection: c.slug });
  }, [status, items.length, c.slug]);
  return (
    <>
      <p className="pa-fine" role="status">
        {total !== null ? `${adventureWord(total)} in this collection. ` : ""}
        {status === "ready" && items.length > 0
          ? `${items.length} selected ${items.length === 1 ? "preview" : "previews"} below.`
          : status === "loading"
            ? "Loading previews..."
            : "Previews aren't available right now."}
      </p>
      {items.length > 0 && (
        <section aria-labelledby="cd-prev-h" className="co-block">
          <h2 className="pa-h" id="cd-prev-h">
            Selected previews
          </h2>
          <NarrowBar {...n} shown={shown.length} of={items.length} />
          {shown.length === 0 ? (
            <p className="pa-fine">Nothing in these previews matches. Clear a choice above.</p>
          ) : (
            <ul className="pa-grid pv-grid">
              {shown.map((i) => (
                <PreviewCard key={i.id} item={i} />
              ))}
            </ul>
          )}
        </section>
      )}
      {own.length > 0 && (
        <section aria-labelledby="cd-own-h" className="co-block">
          <h2 className="pa-h" id="cd-own-h">
            Your first adventure
          </h2>
          <ul className="co-list">
            {own.map((a) => (
              <AdventureRow
                key={a.id}
                a={a}
                done={has(stats.save.done, a.id)}
                dogName={stats.save.profile.data.name}
              />
            ))}
          </ul>
        </section>
      )}
      <aside className="pa-panel co-invite" aria-labelledby="cd-inv-h">
        <h2 className="pa-h" id="cd-inv-h">
          Your first adventure is free
        </h2>
        <p>
          Answer a few questions and we will pick one adventure for your dog. The full {c.title}{" "}
          collection, with every set of instructions, is part of the Passport.
        </p>
        <div className="pa-row">
          <Button to={discoverHref(w?.ctx ?? "at-home")}>Find our first adventure</Button>
          <Button to="/unlock" variant="secondary">
            See what's included
          </Button>
        </div>
      </aside>
    </>
  );
}

function FullCollection({ c }: { c: Collection }) {
  const stats = useCollectionStats();
  const n = useNarrow();
  const { save } = stats;
  const dogName = save.profile.data.name;
  const { all } = useAccessLibrary();
  const items = all.filter((a) => a.collections.includes(c.slug));
  const suitedIds = new Set(stats.eligibleIdsIn(c.slug));
  const eligible = items.filter((a) => suitedIds.has(a.id));
  const shown = narrow(eligible, n.on);
  const doneIds = new Set(members(save.done));
  const s = stats.suitedOf(c.slug);
  return (
    <>
      <p className="pa-fine" role="status">
        {adventureWord(items.length)} in this collection
        {s ? `, ${s.total} suit ${dogName || "your dog"}, ${s.done} done` : ""}.
      </p>
      {s && s.total > 0 && (
        <progress
          className="co-progress"
          value={s.done}
          max={Math.max(s.total, 1)}
          aria-label={`${s.done} of ${s.total} done`}
        />
      )}
      {eligible.length === 0 ? (
        <p className="pa-fine">
          None of the adventures in this collection suit what we know about your dog right now.
        </p>
      ) : (
        <>
          <NarrowBar {...n} shown={shown.length} of={eligible.length} />
          <ul className="co-list">
            {shown.map((a) => {
              const saved = has(save.favorites, a.id);
              return (
                <AdventureRow
                  key={a.id}
                  a={a}
                  done={doneIds.has(a.id)}
                  dogName={dogName}
                  actions={
                    <button
                      type="button"
                      className="pp-btn pp-btn-secondary"
                      aria-pressed={saved}
                      onClick={() => (saved ? unfavorite(a.id) : favorite(a.id))}
                    >
                      {saved ? "Saved" : "Save"}
                      <span className="sr-only"> {a.title}</span>
                    </button>
                  }
                />
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

export function CollectionDetail({ c }: { c: Collection }) {
  const { unlocked, status } = useAccessLibrary();
  return (
    <div className="co-detail">
      <Header c={c} />
      {unlocked ? (
        <FullCollection c={c} />
      ) : status === "checking" ? (
        <p className="pa-fine" role="status" aria-busy="true">
          Checking your access...
        </p>
      ) : (
        <PublicCollection c={c} />
      )}
      <BackToDirectory />
    </div>
  );
}
