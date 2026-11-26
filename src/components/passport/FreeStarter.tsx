// The free experience: a short four-screen quiz, then ONE introductory adventure picked for this dog.
// Flow: the homepage CTA lands straight on the first question -> a mystery card shown with practical info only (time,
// cost, setting, effort, requirements; NOT the steps) -> "Scratch or tap to reveal", or "Show me another" while another
// fit exists (never the same one twice, never the last match) -> reveal (locked in: no second intro reveal) -> complete
// whenever -> intro stamp -> one quiet invitation to the full Passport. A revealed visitor returns straight to it.
// This is a product choice, not a security gate (the free pool is public). Everything here runs on this device with no
// network call. Unanswered questions stay UNKNOWN, never "safe". No account, email or card; nothing forces completion.
import { RevealSurface } from "./RevealSurface";
import { IntroQuiz, focusInto } from "./IntroQuiz";
import { activityConfirm } from "@/passport/engine";
import { type CtxKey } from "@/passport/journal-context";
import {
  MULTI_DOG_NOTE,
  dogWho,
  hasManyDogs,
  type DogProfile,
  type OwnerPrefs,
} from "@/passport/profile";
import { presetFor, type RelaxKey } from "@/passport/quiz";
import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { getSave, revealStarter, setProfile, setStarter } from "@/passport/local-store";
import { has } from "@/passport/progress";
import {
  PREVIEWS_PATH,
  hasAnother,
  isRevealed,
  noMatchCause,
  savedStarter,
  selectStarter,
  type NoMatchCause,
} from "@/passport/starter";
import { usePassport } from "@/passport/usePassport";
import type { Adventure } from "@/passport/schema";
import { AdventureCard, Chips } from "./AdventureCard";
import { useAdventureLibrary } from "./collections-shared";
import { flow } from "./flow-events";
import { needChips, glanceOf, suitabilityNotes, SUPPLY_LABELS } from "./labels";

export const FREE_PROMISE =
  "Tell us about your dog or dogs. Get one adventure picked for them, free.";

/** One concise safety question before this adventure's reveal, using the same "confirm" idea as held adventures. */
function ConfirmBeforeReveal({
  a,
  onAnother,
  another = true,
}: {
  a: Adventure;
  onAnother: () => void;
  another?: boolean;
}) {
  const { profile } = usePassport();
  const ask = activityConfirm(a, profile);
  if (!ask) return null;
  const nervous = ask.field === "noiseSensitive" ? "yes" : "nervous";
  const fine = ask.field === "noiseSensitive" ? "no" : "comfortable";
  const save = (v: string) => setProfile({ [ask.field]: v } as Partial<DogProfile>);
  return (
    <div className="pd-question" role="group" aria-label="Before you reveal">
      <p className="pd-qtext">{ask.question}</p>
      <div className="pa-chips">
        <button type="button" className="pa-chip" onClick={() => save(fine)}>
          Yes, that is fine
        </button>
        <button
          type="button"
          className="pa-chip"
          onClick={() => {
            save(nervous);
            onAnother();
          }}
        >
          {another ? "No, find another" : "No, edit my answers"}
        </button>
        <button type="button" className="pa-chip" onClick={onAnother}>
          {another ? "Not sure, find another" : "Not sure, edit my answers"}
        </button>
      </div>
      <p className="pa-fine">
        We never guess about your dog, so an unsure answer means a different pick or new answers.
      </p>
    </div>
  );
}

/** A quiet line, shown while the introductory adventure is still in progress: buying never has to wait. */
function SkipAheadLine() {
  return (
    <p className="pa-fine">
      You do not need to finish this first. You can{" "}
      <AppLink
        to="/unlock"
        className="pa-linkbtn"
        onClick={() => flow("purchase_cta_clicked", { where: "intro-inline" })}
      >
        get the full Passport
      </AppLink>{" "}
      or{" "}
      <AppLink to={PREVIEWS_PATH} className="pa-linkbtn">
        browse previews
      </AppLink>{" "}
      any time.
    </p>
  );
}

/** The recommendation: ONE mystery card with practical facts only. The title, steps and twist stay a surprise until you reveal. */
function Recommendation({
  a,
  dogName,
  why,
  widenedNote,
  another,
  onAccept,
  onAnother,
  onChange,
  headRef,
}: {
  a: Adventure;
  dogName: string | undefined;
  why: string | undefined;
  /** Plain words about optional answers the visitor chose to set aside, or null. */
  widenedNote: string | null;
  /** False when no other free adventure fits: "Show me another" is then not offered. */
  another: boolean;
  onAccept: () => void;
  onAnother: () => void;
  onChange: () => void;
  headRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const { profile } = usePassport();
  const needsConfirm = activityConfirm(a, profile) !== null;
  const notes = [
    ...suitabilityNotes(a),
    ...needChips(glanceOf(a)).filter((n) => !n.startsWith("Involves food")),
    ...a.requires.filter((r) => r !== "car").map((r) => `Needs: ${SUPPLY_LABELS[r]}`),
  ];
  return (
    <>
      <h1 className="pa-h1" tabIndex={-1} ref={headRef}>
        A little adventure awaits...
      </h1>
      <article className="pa-card pa-mystery" aria-label="Recommended adventure">
        <p className="pa-kicker">
          {dogName ? `Your free first adventure for ${dogName}` : "Your free first adventure"}
        </p>
        {a.teaser && <p className="pa-clue">“{a.teaser}”</p>}
        <Chips a={a} />
        {notes.length > 0 && (
          <ul className="pa-meta" aria-label="Good to know before you reveal">
            {[...new Set(notes)].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        {widenedNote && <p className="pa-fine">{widenedNote}</p>}
        {why && (
          <p className="pd-why">
            <strong>Why this one:</strong> {why}.
          </p>
        )}
        <div className="pa-actions">
          {needsConfirm ? (
            <ConfirmBeforeReveal
              a={a}
              onAnother={another ? onAnother : onChange}
              another={another}
            />
          ) : (
            <RevealSurface adventureId={a.id} onReveal={onAccept} />
          )}
          {another ? (
            <button type="button" className="pp-btn pp-btn-ghost" onClick={onAnother}>
              Show me another
            </button>
          ) : (
            <p className="pa-fine" role="status">
              This is the little adventure that suits you best today.
            </p>
          )}
        </div>
        {hasManyDogs(dogName) && <p className="pa-fine">{MULTI_DOG_NOTE}</p>}
      </article>
      <p className="pa-fine">
        <button type="button" className="pa-linkbtn" onClick={onChange}>
          Edit preferences
        </button>
      </p>
    </>
  );
}

const OFFERED_KEY = "pp.intro.offered";
/** Ids already offered this browser session, so "Show me another" never repeats one. */
function readOffered(): Set<string> {
  try {
    const raw = window.sessionStorage.getItem(OFFERED_KEY);
    const v: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}
function writeOffered(s: Set<string>) {
  try {
    window.sessionStorage.setItem(OFFERED_KEY, JSON.stringify([...s]));
  } catch {
    /* session storage blocked: the in-memory set still holds for this page view */
  }
}

const RELAX_TEXT: Record<
  RelaxKey,
  { ask: (o: OwnerPrefs) => string; button: (o: OwnerPrefs) => string; noted: string }
> = {
  where: {
    ask: (o) =>
      o.where === "home"
        ? "Nothing cozy at home fits just yet. Would you like to try somewhere beyond home too?"
        : "We haven't found the right little outdoor adventure yet. Would you like to try something indoors instead?",
    button: (o) => (o.where === "home" ? "Yes, beyond home is fine" : "Yes, try something indoors"),
    noted: "where",
  },
  time: {
    ask: () => "Could you spare a little more time today?",
    button: () => "Yes, a little longer is fine",
    noted: "time",
  },
  spend: {
    ask: () => "Would a small spend be okay for this one?",
    button: () => "Yes, a small spend is okay",
    noted: "spend",
  },
  kids: {
    ask: () => "Would you like to do this one without the children joining?",
    button: () => "Do this one without the children joining",
    noted: "children joining",
  },
};
const listOf = (keys: readonly RelaxKey[]): string =>
  keys
    .map((k) => RELAX_TEXT[k].noted)
    .join(", ")
    .replace(/, ([^,]*)$/, " and $1");

export function FreeStarter({ ctx }: { ctx?: CtxKey | undefined } = {}) {
  const { ready, save } = usePassport();
  const { all: library, status } = useAdventureLibrary();
  const [stage, setStage] = useState<"welcome" | "survey">("welcome");
  const [none, setNone] = useState<NoMatchCause | null>(null);
  const [quizMode, setQuizMode] = useState<"first" | "edit">("first");
  const [relaxed, setRelaxed] = useState<RelaxKey[]>([]);
  const offered = useRef<Set<string> | null>(null);
  const wasDone = useRef<boolean | null>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const lastView = useRef<string | null>(null);

  const adventure = ready ? savedStarter(library, save) : undefined;
  const done = adventure ? has(save.done, adventure.id) : false;
  const revealed = ready && isRevealed(save) && !!adventure;

  useEffect(() => {
    if (!ready) return;
    if (wasDone.current === false && done) flow("intro_completed");
    wasDone.current = done;
  }, [ready, done]);

  // Browser Back from the recommendation steps back into the quiz (the quiz marks its history entries).
  useEffect(() => {
    const pop = () => {
      const st = window.history.state as { ppQuiz?: unknown } | null;
      if (typeof st?.ppQuiz === "number" && !isRevealed(getSave())) {
        setQuizMode("first");
        setStage("survey");
      }
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  const inQuiz = stage === "survey" || (!revealed && !adventure && !none);
  const view = revealed
    ? `revealed:${adventure?.id}`
    : inQuiz
      ? "quiz"
      : adventure
        ? `rec:${adventure.id}`
        : "none";
  // A new view (recommendation, reveal, no-match) takes focus on its heading. The quiz moves focus itself, per question.
  useEffect(() => {
    if (!ready) return;
    const prev = lastView.current;
    lastView.current = view;
    if (prev !== null && prev !== view && view !== "quiz") focusInto(head.current);
  }, [ready, view]);

  if (!ready || status === "checking")
    return (
      <Container>
        <div className="pa-page" aria-busy="true" />
      </Container>
    );

  const seen = (): Set<string> => (offered.current ??= readOffered());
  const dogName = save.profile.data.name;

  function pickNext(replace: boolean, relax: RelaxKey[]) {
    setRelaxed(relax);
    const s = seen();
    const cur = getSave().starter?.id;
    if (cur) s.add(cur);
    const pick = selectStarter(library, getSave(), s, { relax });
    if (pick.ok) {
      s.add(pick.adventure.id);
      writeOffered(s);
      setStarter(pick.adventure.id);
      setNone(null);
      setStage("welcome");
      flow(replace ? "intro_replaced" : "intro_recommended");
      return;
    }
    // "Show me another" is only offered when one exists. If that ever fails, the current pick simply stays.
    if (replace) return;
    setStarter(null);
    setNone(noMatchCause(library, getSave(), relax));
    setStage("welcome");
  }

  function submit() {
    flow("intro_personalized");
    seen().clear();
    writeOffered(seen());
    setStarter(null); // a fresh set of answers starts a fresh list
    pickNext(false, []);
  }

  function accept() {
    revealStarter();
    flow("intro_revealed");
  }

  const editPrefs = () => {
    setQuizMode("edit");
    setStage("survey");
  };

  let body;
  if (adventure && revealed && stage !== "survey") {
    body = (
      <>
        <h1 className="pa-h1" tabIndex={-1} ref={head}>
          Your first adventure
        </h1>
        <p className="pa-sub">
          Picked for {dogWho(dogName)}. It stays here, free, so you can come back to it any time.
        </p>
        <AdventureCard a={adventure} dogName={dogName} focusOnMount />
        {!done && <SkipAheadLine />}
        <p className="pa-fine">
          <button type="button" className="pa-linkbtn" onClick={editPrefs}>
            Edit preferences
          </button>{" "}
          Your adventure stays the same; this only updates what we remember.
        </p>
      </>
    );
  } else if (inQuiz) {
    const editing = quizMode === "edit";
    body = (
      <>
        <h1 className="pa-h1">{editing ? "Your preferences" : "Your first adventure is free"}</h1>
        {!editing && (
          <p className="pa-sub">
            A few quick taps and we will pick one for you. No account needed.
          </p>
        )}
        <IntroQuiz
          save={save}
          mode={quizMode}
          preset={quizMode === "first" ? presetFor(ctx, save) : undefined}
          onDone={() => (adventure && revealed ? setStage("welcome") : submit())}
          onCancel={editing ? () => setStage("welcome") : undefined}
          submitLabel={
            revealed ? "Save preferences" : adventure ? "Update my pick" : "Find our adventure"
          }
        />
      </>
    );
  } else if (adventure) {
    const why = (() => {
      const pick = selectStarter(library, save, new Set(), { relax: relaxed });
      return pick.ok && pick.adventure.id === adventure.id ? pick.why[0] : undefined;
    })();
    const widenedNote = relaxed.length
      ? `As you chose, we set aside your ${listOf(relaxed)} preference${relaxed.length > 1 ? "s" : ""} for this one.`
      : null;
    body = (
      <Recommendation
        a={adventure}
        dogName={dogName}
        why={why}
        widenedNote={widenedNote}
        another={hasAnother(library, save, seen(), relaxed)}
        onAccept={accept}
        onAnother={() => pickNext(true, relaxed)}
        onChange={editPrefs}
        headRef={head}
      />
    );
  } else if (none) {
    const o = save.owner.data;
    const again = (keys: RelaxKey[]) => {
      seen().clear();
      writeOffered(seen());
      pickNext(false, keys);
    };
    const keys = none.kind === "hard" ? [] : none.keys;
    body = (
      <>
        <h1 className="pa-h1" tabIndex={-1} ref={head}>
          {none.kind === "hard"
            ? "We haven't found a free adventure for you just yet"
            : "We haven't found the right little adventure yet"}
        </h1>
        <div className="pa-card" role="status">
          {none.kind === "single" &&
            keys.slice(0, 2).map((k) => (
              <div key={k} className="pd-nomatch">
                <p>{RELAX_TEXT[k].ask(o)}</p>
                <button
                  type="button"
                  className="pp-btn pp-btn-primary"
                  onClick={() => again([...relaxed, k])}
                >
                  {RELAX_TEXT[k].button(o)}
                </button>
              </div>
            ))}
          {none.kind === "several" && (
            <div className="pd-nomatch">
              <p>
                Your {listOf(keys)} preferences are working together to keep us from finding one.
                Would you like to set them aside for now?
              </p>
              <button
                type="button"
                className="pp-btn pp-btn-primary"
                onClick={() => again([...relaxed, ...keys])}
              >
                {keys.includes("kids")
                  ? "Yes, even without the children joining"
                  : "Yes, set them aside"}
              </button>
            </div>
          )}
          {none.kind === "hard" && (
            <p>
              We stay careful with the answers that keep your dog safe and comfortable, and we never
              loosen them. If you picked something by mistake, you can change your answers.
            </p>
          )}
          <div className="pa-row">
            <button
              type="button"
              className={none.kind === "hard" ? "pp-btn pp-btn-primary" : "pp-btn pp-btn-secondary"}
              onClick={editPrefs}
            >
              Edit preferences
            </button>
          </div>
        </div>
        {none.kind === "hard" && (
          <p className="pa-fine">
            You can also{" "}
            <AppLink to={PREVIEWS_PATH} className="pa-linkbtn">
              browse previews
            </AppLink>{" "}
            or{" "}
            <AppLink
              to="/unlock"
              className="pa-linkbtn"
              onClick={() => flow("purchase_cta_clicked", { where: "intro-none" })}
            >
              see the full Passport
            </AppLink>
            .
          </p>
        )}
      </>
    );
  }

  return (
    <Container>
      <div className="pa-page pd-page">{body}</div>
    </Container>
  );
}
