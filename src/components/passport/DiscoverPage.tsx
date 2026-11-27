import { Shortcuts } from "./Shortcuts";
import { Itineraries } from "./Itineraries";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/shell/Container";
import { ProfileEditor } from "./ProfileEditor";
import { OwnerPrefsEditor } from "./OwnerPrefsEditor";
import { AdventureCard, MysteryCard } from "./AdventureCard";
import { FilterPanel } from "./FilterPanel";
import { HeldQuestions } from "./HeldQuestions";
import { Suggestions } from "./Suggestions";
import { DiscoverTabs, panelId, tabId, type DiscoverMode } from "./DiscoverTabs";
import { collections } from "@/passport/content";
import { useAdventureLibrary } from "./collections-shared";
import { FreeStarter } from "./FreeStarter";
import { useDiscoverData } from "./discover-data";
import { DiscoverToday } from "./DiscoverToday";
import "@/design/ux-detail.css";
import { FILTER_LABELS, pickSurprise, rank, type Ctx, type History } from "@/passport/engine";
import type { CustomCollection, DogProfile, Scope } from "@/passport/profile";
import {
  EMPTY_TODAY,
  ctxToToday,
  narrowLibrary,
  readToday,
  writeToday,
  type TodayState,
} from "@/passport/context";
import { listCollections, members, newCollectionId } from "@/passport/progress";
import { newCollection, setProfile } from "@/passport/local-store";
import { usePassport } from "@/passport/usePassport";
import { isRevealed } from "@/passport/starter";
import { hasAccountFlag } from "@/passport/premium-client";
import { track } from "@/passport/events";
import { CtxChip } from "@/components/journal/CtxChip";
import type { CtxKey } from "@/passport/journal-context";
import { AppLink } from "@/components/shell/AppLink";
import { useNavMode } from "@/components/shell/useNavMode";
import { AccessCheckFailed } from "@/components/site/ReturningHome";

/**
 * Public, server-rendered explanation of free adventure discovery. It is plain text that search engines can read without
 * running any script (the interactive starter below it renders only in the browser). It holds no adventure steps and
 * nothing from the protected library. Shown to visitors who have not unlocked the full Passport.
 */
export const DISCOVER_INTRO_HEADING = "How personalized adventure discovery works";
function DiscoverIntro() {
  return (
    <Container>
      <section className="pa-panel" aria-labelledby="dp-about-h" data-testid="discover-intro">
        <h2 className="pa-h" id="dp-about-h">
          {DISCOVER_INTRO_HEADING}
        </h2>
        <p>
          Paws &amp; Passage helps you find one small adventure that fits your dog. You answer a few
          quick questions about your dog and about you, and every question is optional. Then you get
          a personalized pick with the practical details first: how long it takes, what it costs,
          where it happens and how much effort it needs.
        </p>
        <p>
          If it suits you, accept it and the full instructions are yours to keep. If not, ask for
          another one as often as you like. Your first adventure is free, with no account, email or
          card, and your answers stay on your device.
        </p>
        <p className="pa-fine">
          Prefer to look around first? Browse the{" "}
          <AppLink to="/previews">adventure previews</AppLink>, read the{" "}
          <AppLink to="/journal">Adventure Journal</AppLink>, or see what the{" "}
          <AppLink to="/unlock">full Passport</AppLink> includes.
        </p>
      </section>
    </Container>
  );
}

/**
 * Free visitors get one adventure picked for their dog (a short quiz, then "Your first adventure"). The full
 * browse / mystery / made-for-you experience is for entitled visitors. This is a product choice, not a security gate.
 */
export function DiscoverPage(props: {
  mode: DiscoverMode;
  onMode: (m: DiscoverMode) => void;
  /** Validated ?ctx= starting point from an Adventure Journal article. */
  ctx?: CtxKey;
  onClearCtx?: () => void;
}) {
  const { unlocked } = useAdventureLibrary();
  const { ready, save } = usePassport();
  const { mode: accessMode } = useNavMode();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // The public explainer is for visitors still deciding. Server HTML and the first render keep it (crawlable); a returning
  // customer's browser or a visitor who already revealed an adventure no longer sees it.
  const showIntro = !(mounted && (hasAccountFlag() || (ready && isRevealed(save))));
  const chip = props.ctx && props.onClearCtx && (
    <Container>
      <CtxChip ctx={props.ctx} onClear={props.onClearCtx} />
    </Container>
  );
  // A paying customer whose access could not be confirmed gets the friendly retry, not the free quiz.
  if (accessMode === "error") return <AccessCheckFailed />;
  return unlocked ? (
    <>
      {chip}
      <FullDiscover {...props} />
    </>
  ) : (
    <>
      {chip}
      <FreeStarter ctx={props.ctx} />
      {showIntro && <DiscoverIntro />}
    </>
  );
}

function FullDiscover(props: {
  mode: DiscoverMode;
  onMode: (m: DiscoverMode) => void;
  ctx?: CtxKey;
}) {
  // A new (or removed) Journal starting point starts today's choices afresh.
  return <FullDiscoverBody key={props.ctx ?? "none"} {...props} />;
}

function FullDiscoverBody({
  mode,
  onMode,
  ctx: ctxKey,
}: {
  mode: DiscoverMode;
  onMode: (m: DiscoverMode) => void;
  ctx?: CtxKey;
}) {
  const { ready, profile } = usePassport();
  const [editing, setEditing] = useState(false);
  // Today's choices are temporary (this tab only) and never touch the saved profile.
  const [today, setToday] = useState<TodayState>(() => (ctxKey ? ctxToToday(ctxKey) : readToday()));
  useEffect(() => writeToday(today), [today]);
  // Advanced browsing and extra preferences stay tucked away unless the address asks for browsing.
  const [moreOpen, setMoreOpen] = useState(mode !== "made");
  const [prefsOpen, setPrefsOpen] = useState(false);

  if (!ready)
    return (
      <Container>
        <div className="pa-page" aria-busy="true" />
      </Container>
    );

  const seeMore = () => {
    setMoreOpen(true);
    onMode("browse");
  };

  return (
    <Container>
      <div className="pa-page pd-page">
        <p className="pa-kicker dt-hello">
          {profile.name ? `Hello, you and ${profile.name}.` : "Hello, adventurer."}
        </p>
        <h1 className="pa-h1">What shall we do today?</h1>
        <p className="pa-sub">Find a little adventure that fits your day.</p>

        <DiscoverToday
          state={today}
          onChange={setToday}
          onSeeMore={seeMore}
          startSearched={!!ctxKey}
        />

        <details className="ux-more dt-prefs" open={prefsOpen}>
          <summary
            onClick={(e) => {
              e.preventDefault();
              setPrefsOpen((v) => !v);
            }}
          >
            More preferences
          </summary>
          {prefsOpen && (
            <div className="dt-prefs-body">
              <FilterPanel
                simple
                filters={today.filters}
                onChange={(f) => setToday({ ...today, filters: f })}
                onSaveSmart={(name, f) =>
                  newCollection({ id: newCollectionId(), kind: "smart", name, filters: f })
                }
              />
              <button
                type="button"
                className="pp-btn pp-btn-ghost"
                aria-expanded={editing}
                onClick={() => setEditing((v) => !v)}
              >
                Our dog and household details
              </button>
              {editing && (
                <section className="pa-panel" aria-labelledby="pd-edit-h">
                  <h2 className="pa-h" id="pd-edit-h">
                    Your dog and you
                  </h2>
                  <ProfileEditor part="all" />
                  <h3 className="pa-h">About you</h3>
                  <OwnerPrefsEditor />
                  <div className="pa-row">
                    <button
                      type="button"
                      className="pp-btn pp-btn-primary"
                      onClick={() => setEditing(false)}
                    >
                      Done
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}
        </details>

        <details className="ux-more" open={moreOpen}>
          <summary
            onClick={(e) => {
              e.preventDefault();
              setMoreOpen((v) => !v);
            }}
          >
            More ways to find an adventure
          </summary>
          {moreOpen && (
            <>
              <Shortcuts />
              <Itineraries />
              <DiscoverTabs mode={mode} onChange={onMode} />
              <div
                role="tabpanel"
                id={panelId(mode)}
                aria-labelledby={tabId(mode)}
                tabIndex={0}
                className="pd-panel"
              >
                {mode === "made" && <MadeForYou onEditProfile={() => setEditing(true)} />}
                {mode === "surprise" && <SurpriseMe />}
                {mode === "browse" && (
                  <BrowseAll onMode={onMode} today={today} onReset={() => setToday(EMPTY_TODAY)} />
                )}
              </div>
            </>
          )}
        </details>
      </div>
    </Container>
  );
}

/**
 * Keeps a list in the order it was first shown, so a card does not jump away (and lose its "added to your passport"
 * message or keepsake button) the moment you complete or rate it. The order refreshes when the answers or filters change.
 */
function useStableOrder<T extends { adventure: { id: string } }>(
  items: T[],
  resetKey: string,
): T[] {
  const ref = useRef<{ key: string; pos: Map<string, number> }>({ key: resetKey, pos: new Map() });
  if (ref.current.key !== resetKey) ref.current = { key: resetKey, pos: new Map() };
  const pos = ref.current.pos;
  for (const it of items) if (!pos.has(it.adventure.id)) pos.set(it.adventure.id, pos.size);
  return [...items].sort((a, b) => pos.get(a.adventure.id)! - pos.get(b.adventure.id)!);
}

function Empty({ reason, onReset }: { reason: string; onReset?: (() => void) | undefined }) {
  return (
    <div className="pa-card" role="status">
      <h2 className="pa-title">{reason}</h2>
      {onReset && (
        <button type="button" className="pp-btn pp-btn-secondary" onClick={onReset}>
          Reset filters
        </button>
      )}
    </div>
  );
}

const NONE_ELIGIBLE =
  "Nothing in your library suits these answers yet. We start with calmer options when we are unsure.";

function Progress() {
  const { save, library, ctx } = useDiscoverData();
  const known = new Set(library.map((a) => a.id));
  const n = members(save.done).filter((id) => known.has(id)).length;
  return (
    <p className="pa-fine">
      {ctx.unlocked
        ? `${n} of ${library.length} adventures completed.`
        : `${n} ${n === 1 ? "adventure" : "adventures"} completed.`}{" "}
      <a href="/passport">See your passport</a>
    </p>
  );
}

// ---- Made for you ----

const PAGE = 5;

function MadeForYou({ onEditProfile }: { onEditProfile: () => void }) {
  const { dog, save, library, ctx, history } = useDiscoverData();
  const [shown, setShown] = useState(PAGE);
  const doneAtStart = useRef(new Set(history.done));
  const raw = rank(library, ctx, {}, history, { seed: "made", includeDone: true });
  // Completed adventures leave the recommendations, except the ones completed during this visit.
  const visible = raw.ok
    ? raw.ranked.filter(
        (r) => !history.done.has(r.adventure.id) || !doneAtStart.current.has(r.adventure.id),
      )
    : [];
  const ordered = useStableOrder(visible, JSON.stringify([save.profile.data, save.owner.data]));
  const result = raw.ok ? { ...raw, ranked: ordered } : raw;

  return (
    <>
      <Suggestions library={library} ctx={ctx} history={history} save={save} dog={dog} />
      {!result.ok ? (
        <Empty reason={NONE_ELIGIBLE} />
      ) : (
        <>
          <HeldQuestions held={result.held} onOpenProfile={onEditProfile} />
          {result.ranked.length === 0 ? (
            <Empty reason="You have done everything suited to these answers. Try Browse All to revisit favorites." />
          ) : (
            <ul className="pd-list" aria-label="Made for you">
              {result.ranked.slice(0, shown).map((r) => (
                <li key={r.adventure.id}>
                  <AdventureCard a={r.adventure} dogName={dog.name} why={r.why} />
                </li>
              ))}
            </ul>
          )}
          {result.ranked.length > shown && (
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setShown(shown + PAGE)}
            >
              Show more ({result.ranked.length - shown} more)
            </button>
          )}
        </>
      )}
      <Progress />
    </>
  );
}

// ---- Surprise me ----

type ScopeKey = Scope["kind"];
type Draw = {
  scopeKey: ScopeKey;
  slug: string;
  customId: string;
  repeats: boolean;
  skipped: Set<string>;
  seed: number;
  pickId: string | null;
  revealed: boolean;
};

function SurpriseMe() {
  const { dog, save, library, ctx, history } = useDiscoverData();
  const mine: CustomCollection[] = listCollections(save);
  const [s, setS] = useState<Draw>(() => {
    const base: Draw = {
      scopeKey: "all",
      slug: collections[0]?.slug ?? "",
      customId: mine[0]?.id ?? "",
      repeats: false,
      skipped: new Set(),
      seed: 1,
      pickId: null,
      revealed: false,
    };
    return { ...base, pickId: pick(base)?.id ?? null };
  });

  function scopeOf(d: Draw): Scope {
    switch (d.scopeKey) {
      case "curated":
        return { kind: "curated", slug: d.slug };
      case "custom":
        return { kind: "custom", id: d.customId };
      case "all":
      case "made-for-you":
      case "favorites":
      case "done":
        return { kind: d.scopeKey };
    }
  }
  function pick(d: Draw) {
    const id = pickSurprise(
      library,
      scopeOf(d),
      ctx,
      {},
      { ...history, skipped: d.skipped },
      mine,
      { seed: `s${d.seed}`, includeDone: d.repeats },
    );
    return id;
  }
  function update(p: Partial<Draw>) {
    // Every draw gets a fresh seed unless the caller sets one, so the same click never repeats the same pick.
    const next = {
      ...s,
      ...p,
      seed: p.seed ?? Math.floor(Math.random() * 1_000_000_000),
      revealed: false,
    };
    next.pickId = pick(next)?.id ?? null;
    setS(next);
  }
  function another() {
    const skipped = new Set(s.skipped);
    if (s.pickId) skipped.add(s.pickId);
    update({ skipped, seed: s.seed + 1 });
  }

  const current = s.pickId ? library.find((a) => a.id === s.pickId) : undefined;
  const noCustom = s.scopeKey === "custom" && mine.length === 0;

  return (
    <>
      <section className="pa-panel" aria-label="Surprise settings">
        <label className="pa-field">
          <span>Surprise me from</span>
          <select
            className="pd-select"
            value={s.scopeKey}
            onChange={(e) => update({ scopeKey: e.target.value as ScopeKey, skipped: new Set() })}
          >
            <option value="all">All suitable adventures</option>
            <option value="made-for-you">Made for you</option>
            <option value="curated">A curated collection</option>
            <option value="custom">One of my collections</option>
            <option value="favorites">Favorites</option>
            <option value="done">Previously completed</option>
          </select>
        </label>
        {s.scopeKey === "curated" && (
          <label className="pa-field">
            <span>Which collection</span>
            <select
              className="pd-select"
              value={s.slug}
              onChange={(e) => update({ slug: e.target.value, skipped: new Set() })}
            >
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        )}
        {s.scopeKey === "custom" &&
          (mine.length === 0 ? (
            <p className="pa-fine">
              You have no collections of your own yet. Use “Add to collection” on any adventure.
            </p>
          ) : (
            <label className="pa-field">
              <span>Which of my collections</span>
              <select
                className="pd-select"
                value={s.customId}
                onChange={(e) => update({ customId: e.target.value, skipped: new Set() })}
              >
                {mine.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        <label className="pa-check">
          <input
            type="checkbox"
            checked={s.repeats}
            onChange={(e) => update({ repeats: e.target.checked, skipped: new Set() })}
          />{" "}
          Include favorites and repeats
        </label>
        <p className="pa-fine">
          {s.repeats
            ? "Adventures you have done may come up again."
            : "Prioritising adventures you have not done yet."}
        </p>
      </section>

      {!current ? (
        <div className="pa-card" role="status">
          <h2 className="pa-title">
            {noCustom
              ? "Pick or build a collection first."
              : s.skipped.size > 0
                ? "That is everything in this pool for now."
                : "Nothing suitable in this pool yet."}
          </h2>
          {s.skipped.size > 0 && (
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => update({ skipped: new Set() })}
            >
              Start over
            </button>
          )}
        </div>
      ) : s.revealed ? (
        <AdventureCard
          a={current}
          dogName={dog.name}
          defaultOpen
          onAnother={another}
          anotherLabel="Skip, no penalty"
        />
      ) : (
        <MysteryCard
          a={current}
          onAnother={another}
          onReveal={() => {
            setS({ ...s, revealed: true });
            track("adventure_revealed", { adventure: current.id });
          }}
        />
      )}
      <Progress />
    </>
  );
}

// ---- Browse all ----

const BROWSE_PAGE = 8;

function BrowseAll({
  onMode,
  today,
  onReset,
}: {
  onMode: (m: DiscoverMode) => void;
  /** Today's temporary choices (place + the shared filters). The saved profile is never touched. */
  today: TodayState;
  onReset: () => void;
}) {
  const { dog, save, library: full, ctx, history } = useDiscoverData();
  const library = narrowLibrary(full, today);
  const filters = today.filters;
  const [shown, setShown] = useState(BROWSE_PAGE);
  const raw = rank(library, ctx, filters, history, { includeDone: true, seed: "browse" });
  const ordered = useStableOrder(
    raw.ok ? raw.ranked : [],
    JSON.stringify([save.profile.data, save.owner.data, today]),
  );
  const result = raw.ok ? { ...raw, ranked: ordered } : raw;

  return (
    <>
      {!result.ok ? (
        result.reason === "none-eligible" ? (
          <Empty reason={NONE_ELIGIBLE} />
        ) : (
          <div className="pa-card" role="status">
            <h2 className="pa-title">No adventure fits all of that</h2>
            <p>
              Try loosening: {result.relax.map((k) => FILTER_LABELS[k]).join(", ") || "a filter"}.
              Your dog's comfort answers stay as you set them.
            </p>
            <button type="button" className="pp-btn pp-btn-secondary" onClick={onReset}>
              Reset today's choices
            </button>
          </div>
        )
      ) : (
        <>
          <p className="pa-fine" role="status">
            Showing {Math.min(shown, result.ranked.length)} of {result.ranked.length} adventures.
            {result.held.length > 0 && (
              <>
                {" "}
                {result.held.length} more {result.held.length === 1 ? "is" : "are"} on hold until
                you answer a couple of questions.{" "}
                <button type="button" className="pa-linkbtn" onClick={() => onMode("made")}>
                  Answer them
                </button>
              </>
            )}
          </p>
          <ul className="pd-list" aria-label="All adventures">
            {result.ranked.slice(0, shown).map((r) => (
              <li key={r.adventure.id}>
                <AdventureCard a={r.adventure} dogName={dog.name} />
              </li>
            ))}
          </ul>
          {result.ranked.length > shown && (
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setShown(shown + BROWSE_PAGE)}
            >
              Show more
            </button>
          )}
        </>
      )}
      <Progress />
    </>
  );
}
