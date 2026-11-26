// The top of Discover for a customer: one suggestion for today, and a few clear ways to go from there.
// Every pick comes from the engine (rank, pickSurprise), so suitability rules apply exactly as everywhere else.
import { useState } from "react";
import "@/design/ux-detail.css";
import { AdventureCard, FactChips, MysteryCard } from "./AdventureCard";
import { useDiscoverData } from "./discover-data";
import { pickSurprise, rank } from "@/passport/engine";
import { listCollections } from "@/passport/progress";
import { track } from "@/passport/events";
import { hasProfile } from "./ProfileEditor";

const today = () => new Date().toDateString();

/** One personalized suggestion (or a good place to start when there is no profile yet). */
export function TodayCard({ onPersonalize }: { onPersonalize: () => void }) {
  const { dog, library, ctx, history } = useDiscoverData();
  const [skipped, setSkipped] = useState<string[]>([]);
  // The adventure being done stays put (even once completed, when the engine would stop suggesting it).
  const [openId, setOpenId] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState<string[]>([]);
  const open = openId !== null;
  const personal = hasProfile(dog);
  const raw = rank(
    library,
    ctx,
    {},
    { ...history, skipped: new Set(skipped) },
    { seed: `today-${today()}` },
  );
  const ranked = raw.ok ? raw.ranked : [];
  const sticky = openId ? library.find((x) => x.id === openId) : undefined;
  const pick = sticky ? undefined : ranked.find((r) => !history.done.has(r.adventure.id));

  if (!pick && !sticky)
    return (
      <section className="pa-card ux-today" aria-labelledby="ux-today-h" role="status">
        <h2 className="pa-h" id="ux-today-h">
          Nothing new to suggest right now
        </h2>
        <p>
          You have done everything that suits your answers. Browse the collections, or revisit a
          favorite.
        </p>
      </section>
    );

  const a = (pick?.adventure ?? sticky)!;
  const why = pick?.why ?? whyOpen;
  const another = () => {
    setSkipped((s) => [...s, a.id]);
    setOpenId(null);
  };
  return (
    <section className="ux-today" aria-labelledby="ux-today-h" data-testid="today">
      <h2 className="pa-h" id="ux-today-h">
        {personal ? `Picked for ${dog.name || "you"}` : "A good place to start"}
      </h2>
      {open ? (
        <AdventureCard a={a} dogName={dog.name} why={why} onAnother={another} focusOnMount />
      ) : (
        <article className="pa-card" aria-label={a.title}>
          <h3 className="pa-title">{a.title}</h3>
          <p className="pa-twist">{a.twist}</p>
          <FactChips a={a} />
          {why.length > 0 && <p className="pd-why">{why.join(". ")}.</p>}
          <div className="pa-actions">
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              onClick={() => {
                setOpenId(a.id);
                setWhyOpen(why);
                track("adventure_revealed", { adventure: a.id });
              }}
            >
              Let's do this one
            </button>
            <button type="button" className="pp-btn pp-btn-secondary" onClick={another}>
              Another idea
            </button>
          </div>
        </article>
      )}
      {!personal && !open && (
        <p className="pa-fine">
          Want ideas made for your dog?{" "}
          <button type="button" className="pa-linkbtn" onClick={onPersonalize}>
            Personalize
          </button>{" "}
          (optional).
        </p>
      )}
    </section>
  );
}

/** "Surprise us": a mystery from everything that suits, revealed in place. */
export function QuickSurprise() {
  const { dog, save, library, ctx, history } = useDiscoverData();
  const [st, setSt] = useState(() => ({
    skipped: new Set<string>(),
    seed: Math.floor(Math.random() * 1_000_000_000),
    revealed: false,
  }));
  const id = pickSurprise(
    library,
    { kind: "all" },
    ctx,
    {},
    { ...history, skipped: st.skipped },
    listCollections(save),
    { seed: `s${st.seed}`, includeDone: false },
  )?.id;
  const current = id ? library.find((a) => a.id === id) : undefined;
  if (!current)
    return (
      <div className="pa-card" role="status">
        <h2 className="pa-title">That is everything for now.</h2>
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          onClick={() => setSt({ ...st, skipped: new Set(), revealed: false })}
        >
          Start over
        </button>
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
