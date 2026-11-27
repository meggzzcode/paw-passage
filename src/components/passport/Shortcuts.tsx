// Quick discovery shortcuts: a row of tiles that each apply a preset of the existing filters.
// Entitled customers get a real, honest count and the matching adventures (the engine applies hard suitability first),
// and "Surprise us" uses pickSurprise with the same mystery and reveal surface as everywhere else. Free visitors get
// the matching public previews, or a way into the free intro quiz; they never see premium content here.
import { useMemo, useState } from "react";
import "@/design/shortcuts.css";
import { AppLink } from "@/components/shell/AppLink";
import { AdventureCard, MysteryCard } from "./AdventureCard";
import { PreviewCard } from "./PreviewCard";
import { useAdventureLibrary } from "./collections-shared";
import { pickSurprise, rank, type Ctx, type History } from "@/passport/engine";
import { members } from "@/passport/progress";
import { premiumPreviews } from "@/passport/preview-view";
import {
  SHORTCUTS,
  previewMatches,
  refineAdventures,
  shortcutBySlug,
  type Shortcut,
  type ShortcutSlug,
} from "@/passport/shortcuts";
import { usePassport } from "@/passport/usePassport";
import { usePreviews } from "@/lib/usePreviews";
import { PREVIEWS_NONE_COPY, PreviewsError, PreviewsLoading } from "./PreviewsNotice";
import { track } from "@/passport/events";

const PAGE = 4;

export function Shortcuts({ heading = "Quick ways in" }: { heading?: string }) {
  const { unlocked } = useAdventureLibrary();
  const [slug, setSlug] = useState<ShortcutSlug | null>(null);
  const active = slug ? shortcutBySlug(slug) : undefined;
  const choose = (s: Shortcut) => setSlug((cur) => (cur === s.slug ? null : s.slug));

  return (
    <section className="sc-wrap" aria-labelledby="sc-h">
      <h2 className="pa-h" id="sc-h">
        {heading}
      </h2>
      <ul className="sc-tiles">
        {SHORTCUTS.map((s) => (
          <li key={s.slug}>
            <button
              type="button"
              className="sc-tile"
              aria-pressed={slug === s.slug}
              onClick={() => choose(s)}
            >
              <span className="sc-mark" aria-hidden="true">
                {s.mark}
              </span>
              <span className="sc-label">{s.label}</span>
              <span className="sc-blurb">{s.blurb}</span>
            </button>
          </li>
        ))}
      </ul>
      {active && (
        <div className="sc-result" role="region" aria-label={active.label}>
          {unlocked ? <EntitledResult s={active} /> : <FreeResult s={active} />}
        </div>
      )}
    </section>
  );
}

/** Entitled: the engine, with this dog's profile, so hard suitability comes first. */
function EntitledResult({ s }: { s: Shortcut }) {
  const { save, profile } = usePassport();
  const { all: library, unlocked } = useAdventureLibrary();
  const ctx: Ctx = { dog: profile, owner: save.owner.data, unlocked };
  const history: History = useMemo(
    () => ({
      done: new Set(members(save.done)),
      favorites: new Set(members(save.favorites)),
      skipped: new Set<string>(),
    }),
    [save.done, save.favorites],
  );
  return s.surprise ? (
    <SurpriseUs key={s.slug} library={library} ctx={ctx} history={history} dogName={profile.name} />
  ) : (
    <Matches
      key={s.slug}
      s={s}
      library={library}
      ctx={ctx}
      history={history}
      dogName={profile.name}
    />
  );
}

type Lib = ReturnType<typeof useAdventureLibrary>["all"];

function Matches({
  s,
  library,
  ctx,
  history,
  dogName,
}: {
  s: Shortcut;
  library: Lib;
  ctx: Ctx;
  history: History;
  dogName: string | undefined;
}) {
  const [shown, setShown] = useState(PAGE);
  const raw = rank(library, ctx, s.filters, history, { seed: `sc-${s.slug}` });
  const list = raw.ok ? refineAdventures(s, raw.ranked) : [];
  const heldCount = raw.ok ? raw.held.filter((h) => !s.refine || s.refine(h.adventure)).length : 0;
  const who = dogName || "your dog or dogs";

  if (list.length === 0)
    return (
      <div className="pa-card" role="status">
        <h3 className="pa-title">Nothing new fits that right now</h3>
        <p>
          {raw.ok && heldCount > 0
            ? `${heldCount} more ${heldCount === 1 ? "needs" : "need"} an answer about ${who} first. You can answer from Made for you.`
            : `We start with calmer options when we are unsure, and adventures you have done are left out here.`}
        </p>
      </div>
    );
  return (
    <>
      <p className="sc-count" role="status">
        {list.length} {list.length === 1 ? "adventure" : "adventures"} that suit {who}, not done
        yet.
        {heldCount > 0 &&
          ` ${heldCount} more ${heldCount === 1 ? "needs" : "need"} an answer first.`}
      </p>
      <ul className="pd-list" aria-label={s.label}>
        {list.slice(0, shown).map((r) => (
          <li key={r.adventure.id}>
            <AdventureCard a={r.adventure} dogName={dogName} why={r.why} />
          </li>
        ))}
      </ul>
      {list.length > shown && (
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          onClick={() => setShown(shown + PAGE)}
        >
          Show more ({list.length - shown} more)
        </button>
      )}
    </>
  );
}

function SurpriseUs({
  library,
  ctx,
  history,
  dogName,
}: {
  library: Lib;
  ctx: Ctx;
  history: History;
  dogName: string | undefined;
}) {
  const [skipped, setSkipped] = useState<string[]>([]);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const [sticky, setSticky] = useState<string | null>(null);
  const picked =
    pickSurprise(library, { kind: "all" }, ctx, {}, { ...history, skipped: new Set(skipped) }, [], {
      seed: `su${seed}`,
    }) ?? null;
  // A revealed card stays put while it is being finished, even though a completed adventure is no longer drawn.
  const current = sticky ? library.find((a) => a.id === sticky) : picked;

  if (!current)
    return (
      <div className="pa-card" role="status">
        <h3 className="pa-title">
          {skipped.length > 0 ? "That is everything for now." : "Nothing suitable yet."}
        </h3>
        {skipped.length > 0 && (
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => {
              setSkipped([]);
              setSeed(seed + 1);
            }}
          >
            Start over
          </button>
        )}
      </div>
    );
  const another = () => {
    setSkipped([...skipped, current.id]);
    setSticky(null);
    setSeed(seed + 1);
  };
  return sticky ? (
    <AdventureCard a={current} dogName={dogName} defaultOpen onAnother={another} />
  ) : (
    <MysteryCard
      a={current}
      onAnother={another}
      onReveal={() => {
        setSticky(current.id);
        track("adventure_revealed", { adventure: current.id });
      }}
    />
  );
}

/** Free: matching public previews (no premium text), or the free intro quiz when previews cannot say. */
function FreeResult({ s }: { s: Shortcut }) {
  const { status, data, retry } = usePreviews();
  const items = useMemo(() => premiumPreviews(data?.items ?? []), [data]);
  const matches = useMemo(() => previewMatches(s, items), [s, items]);

  if (!s.preview)
    return (
      <div className="pa-card">
        <h3 className="pa-title">{s.label}</h3>
        <p>
          {s.surprise
            ? "Start with a free adventure picked for your dog: a few questions, then one personalized pick."
            : "Tell us a little about your dog and we will pick a free first adventure that suits you."}
        </p>
        <div className="pa-row">
          <AppLink to="/discover" className="pp-btn pp-btn-primary">
            Find our first adventure
          </AppLink>
        </div>
      </div>
    );
  if (status === "loading") return <PreviewsLoading />;
  if (status === "unavailable")
    return (
      <PreviewsError retry={retry} className="pa-card">
        <p className="pa-fine">
          You can still{" "}
          <AppLink to="/discover" className="pa-linkbtn">
            find a free first adventure
          </AppLink>
          .
        </p>
      </PreviewsError>
    );
  if (items.length === 0)
    return (
      <p className="pa-fine" role="status">
        {PREVIEWS_NONE_COPY}
      </p>
    );
  return (
    <>
      <p className="sc-count" role="status">
        {matches.length === 0
          ? "None of the selected previews match that one."
          : `${matches.length} of the ${items.length} selected previews match.`}{" "}
        <AppLink to="/previews" className="pa-linkbtn">
          See all previews
        </AppLink>
      </p>
      {matches.length > 0 && (
        <ul className="pa-grid pv-grid" aria-label={`${s.label}: previews`}>
          {matches.slice(0, 6).map((i) => (
            <PreviewCard key={i.id} item={i} />
          ))}
        </ul>
      )}
    </>
  );
}
