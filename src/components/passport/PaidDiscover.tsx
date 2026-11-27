// The pieces of paid Discover that turn today's choices into adventures: a SMALL set of matches and a contextual surprise.
// Every pick comes from the engine (rank, pickSurprise) through src/passport/context.ts, so suitability rules apply exactly
// as everywhere else and nothing is relaxed silently.
import { useRef, useState } from "react";
import "@/design/ux-detail.css";
import { AdventureCard, FactChips, MysteryCard } from "./AdventureCard";
import { useDiscoverData } from "./discover-data";
import { SMALL_SET, findToday, surpriseToday, type TodayState } from "@/passport/context";
import type { PlaceOption, PrefOption } from "@/passport/context";
import { track } from "@/passport/events";

/** A short list of matches. Each can be opened straight away; there is no mystery step to get through. */
export function TodayMatches({
  state,
  seed,
  places,
  prefs,
  onSeeMore,
  onNoMatch,
}: {
  state: TodayState;
  seed: number;
  places?: PlaceOption[] | undefined;
  prefs?: PrefOption[] | undefined;
  onSeeMore: () => void;
  onNoMatch: (reason: "none-eligible" | "too-narrow") => React.ReactNode;
}) {
  const { dog, library, ctx, history } = useDiscoverData();
  // An adventure being done stays put (even once completed, when the engine would stop suggesting it).
  const [open, setOpen] = useState<string[]>([]);
  const order = useRef<{ key: string; pos: Map<string, number> }>({ key: "", pos: new Map() });
  const r = findToday(library, ctx, history, state, {
    seed: `find-${seed}`,
    ...(places ? { places } : {}),
    ...(prefs ? { prefs } : {}),
  });
  if (!r.ok) return <>{onNoMatch(r.reason)}</>;
  const keep = new Set(open);
  const shown = r.ranked.slice(0, SMALL_SET);
  const pinned = open
    .filter((id) => !shown.some((x) => x.adventure.id === id))
    .flatMap((id) => {
      const x = r.ranked.find((y) => y.adventure.id === id);
      const a = library.find((y) => y.id === id);
      return x ? [x] : a ? [{ adventure: a, score: 0, why: [] as string[] }] : [];
    });
  // Keep the order first shown, so an opened card does not jump away when it is completed.
  const key = JSON.stringify([state, seed]);
  if (order.current.key !== key) order.current = { key, pos: new Map() };
  const pos = order.current.pos;
  for (const x of [...shown, ...pinned])
    if (!pos.has(x.adventure.id)) pos.set(x.adventure.id, pos.size);
  const list = [...shown, ...pinned].sort(
    (x, y) => pos.get(x.adventure.id)! - pos.get(y.adventure.id)!,
  );
  return (
    <section className="dt-results" aria-labelledby="dt-results-h" data-testid="today-matches">
      <h2 className="pa-h" id="dt-results-h">
        {r.repeats ? "Ones you have loved before" : "Here are a few ideas"}
      </h2>
      {r.repeats && (
        <p className="pa-fine">
          You have done everything new that fits today, so here they are again.
        </p>
      )}
      <ul className="pd-list" aria-label="Matches for today">
        {list.map((x) => {
          const a = x.adventure;
          return (
            <li key={a.id}>
              {keep.has(a.id) ? (
                <AdventureCard a={a} dogName={dog.name} why={x.why} focusOnMount />
              ) : (
                <article className="pa-card" aria-label={a.title}>
                  <h3 className="pa-title">{a.title}</h3>
                  <p className="pa-twist">{a.twist}</p>
                  <FactChips a={a} />
                  {x.why.length > 0 && <p className="pd-why">{x.why.join(". ")}.</p>}
                  <div className="pa-actions">
                    <button
                      type="button"
                      className="pp-btn pp-btn-primary"
                      onClick={() => {
                        setOpen((o) => [...o, a.id]);
                        track("adventure_revealed", { adventure: a.id });
                      }}
                    >
                      Let's do this one
                    </button>
                  </div>
                </article>
              )}
            </li>
          );
        })}
      </ul>
      {r.total > shown.length && (
        <button type="button" className="pp-btn pp-btn-secondary" onClick={onSeeMore}>
          See more matches ({r.total - shown.length} more)
        </button>
      )}
    </section>
  );
}

/** "Surprise us": a mystery from everything that suits AND today's choices, revealed in place. */
export function QuickSurprise({
  state,
  places,
  prefs,
}: {
  state: TodayState;
  places?: PlaceOption[] | undefined;
  prefs?: PrefOption[] | undefined;
}) {
  const { dog, library, ctx, history } = useDiscoverData();
  const [st, setSt] = useState(() => ({
    skipped: new Set<string>(),
    seed: Math.floor(Math.random() * 1_000_000_000),
    revealed: false,
  }));
  const id = surpriseToday(library, ctx, { ...history, skipped: st.skipped }, state, {
    seed: `s${st.seed}`,
    ...(places ? { places } : {}),
  })?.id;
  const current = id ? library.find((a) => a.id === id) : undefined;
  if (!current)
    return (
      <div className="pa-card" role="status">
        <h2 className="pa-title">
          {st.skipped.size > 0
            ? "That is everything for now."
            : "We couldn't find a little surprise that fits all of today's choices."}
        </h2>
        {st.skipped.size > 0 && (
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => setSt({ ...st, skipped: new Set(), revealed: false })}
          >
            Start over
          </button>
        )}
      </div>
    );
  const another = () =>
    setSt({ ...st, skipped: new Set([...st.skipped, current.id]), revealed: false });
  return st.revealed ? (
    <AdventureCard
      a={current}
      dogName={dog.name}
      onAnother={another}
      anotherLabel="Try another"
      focusOnMount
    />
  ) : (
    <MysteryCard
      a={current}
      onAnother={another}
      onReveal={() => {
        setSt((s) => ({ ...s, revealed: true }));
        track("adventure_revealed", { adventure: current.id });
      }}
    />
  );
}
