import { Shortcuts } from "./Shortcuts";
import { Itineraries } from "./Itineraries";
import { useRef, useState } from "react";
import { Container } from "@/components/shell/Container";
import { Onboarding } from "./Onboarding";
import { ProfileEditor, hasProfile } from "./ProfileEditor";
import { OwnerPrefsEditor } from "./OwnerPrefsEditor";
import { AdventureCard, MysteryCard } from "./AdventureCard";
import { FilterPanel } from "./FilterPanel";
import { HeldQuestions } from "./HeldQuestions";
import { Suggestions } from "./Suggestions";
import { DiscoverTabs, panelId, tabId, type DiscoverMode } from "./DiscoverTabs";
import { collections } from "@/passport/content";
import { useAdventureLibrary } from "./collections-shared";
import { FreeStarter } from "./FreeStarter";
import { FILTER_LABELS, pickSurprise, rank, type Ctx, type History } from "@/passport/engine";
import type { CustomCollection, DogProfile, Scope, SessionFilters } from "@/passport/profile";
import { listCollections, members, newCollectionId } from "@/passport/progress";
import { newCollection, setProfile } from "@/passport/local-store";
import { usePassport } from "@/passport/usePassport";
import { track } from "@/passport/events";
import { CtxChip } from "@/components/journal/CtxChip";
import { ctxToFilters, type CtxKey } from "@/passport/journal-context";

/** Everything the three tabs share: the library, who it is for, and what has been done. */
function useDiscoverData() {
  const { save, profile } = usePassport();
  const { all: library, unlocked } = useAdventureLibrary();
  const dog: DogProfile = profile;
  const ctx: Ctx = { dog, owner: save.owner.data, unlocked };
  const history: History = {
    done: new Set(members(save.done)),
    favorites: new Set(members(save.favorites)),
    skipped: new Set<string>(),
    feedback: Object.fromEntries(Object.entries(save.feedback).map(([k, v]) => [k, v.value])),
  };
  return { save, dog, library, ctx, history };
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
  const chip = props.ctx && props.onClearCtx && (
    <Container>
      <CtxChip ctx={props.ctx} onClear={props.onClearCtx} />
    </Container>
  );
  return unlocked ? (
    <>
      {chip}
      <FullDiscover {...props} />
    </>
  ) : (
    <>
      {chip}
      <FreeStarter ctx={props.ctx} />
    </>
  );
}

function FullDiscover({
  mode,
  onMode,
  ctx: ctxKey,
}: {
  mode: DiscoverMode;
  onMode: (m: DiscoverMode) => void;
  ctx?: CtxKey;
}) {
  const { ready, profile } = usePassport();
  const [onboarding, setOnboarding] = useState(false);
  const [editing, setEditing] = useState(false);

  if (!ready)
    return (
      <Container>
        <div className="pa-page" aria-busy="true" />
      </Container>
    );

  const showBanner = !profile.skipped && !hasProfile(profile) && !onboarding && !editing;

  return (
    <Container>
      <div className="pa-page pd-page">
        <h1 className="pa-h1">Find a little adventure</h1>
        <p className="pa-sub">
          Your full Passport. No deadlines. Pick one when it suits you
          {profile.name ? ` and ${profile.name}` : ""}.
        </p>

        <Shortcuts />
        <Itineraries />

        {showBanner && (
          <aside className="pd-banner" aria-label="Personalize">
            <p>
              <strong>Personalize</strong> your suggestions with a few optional questions. You can
              browse without answering.
            </p>
            <div className="pa-row">
              <button
                type="button"
                className="pp-btn pp-btn-secondary"
                onClick={() => setOnboarding(true)}
              >
                Personalize
              </button>
              <button
                type="button"
                className="pp-btn pp-btn-ghost"
                onClick={() => setProfile({ skipped: true })}
              >
                Not now
              </button>
            </div>
          </aside>
        )}
        {onboarding && <Onboarding onDone={() => setOnboarding(false)} />}
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
        {!editing && !onboarding && !showBanner && (
          <p className="pa-fine">
            {profile.name ? `Planning for ${profile.name}. ` : ""}
            <button type="button" className="pa-linkbtn" onClick={() => setEditing(true)}>
              {"Personalize"}
            </button>
          </p>
        )}

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
            <BrowseAll
              key={ctxKey ?? "none"}
              onMode={onMode}
              start={ctxKey ? ctxToFilters(ctxKey) : {}}
            />
          )}
        </div>
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
      {n} of {library.length} {ctx.unlocked ? "" : "free "}adventures completed.{" "}
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
  start,
}: {
  onMode: (m: DiscoverMode) => void;
  /** Starting filters from an Adventure Journal link: ordinary, removable session filters; the saved profile is never touched. */
  start: SessionFilters;
}) {
  const { dog, save, library, ctx, history } = useDiscoverData();
  const [filters, setFilters] = useState<SessionFilters>(start);
  const [shown, setShown] = useState(BROWSE_PAGE);
  const raw = rank(library, ctx, filters, history, { includeDone: true, seed: "browse" });
  const ordered = useStableOrder(
    raw.ok ? raw.ranked : [],
    JSON.stringify([save.profile.data, save.owner.data, filters]),
  );
  const result = raw.ok ? { ...raw, ranked: ordered } : raw;

  return (
    <>
      <FilterPanel
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setShown(BROWSE_PAGE);
        }}
        onSaveSmart={(name, f) =>
          newCollection({ id: newCollectionId(), kind: "smart", name, filters: f })
        }
      />
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
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setFilters({})}
            >
              Reset filters
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
