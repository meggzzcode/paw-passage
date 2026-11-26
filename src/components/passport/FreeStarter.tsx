// The free experience: a short preference quiz, then ONE introductory adventure picked for this dog.
// Flow: understand the product -> "Find Our First Adventure" -> a few preferences -> a recommendation shown with
// practical info only (time, cost, setting, effort, prerequisites, restrictions; NOT the steps) -> Accept, or
// "Show me another" as often as you like (never the same one twice in a session) -> reveal -> complete whenever ->
// intro stamp and a static keepsake example (making one is part of the full Passport) -> a quiet invitation to the full Passport.
// This is a product choice, not a security gate (the free pool is public). Everything here runs on this device with no
// network call. Unanswered questions stay UNKNOWN, never "safe". No account, email or card; nothing forces completion.
import { RevealSurface } from "./RevealSurface";
import { IntroQuiz } from "./IntroQuiz";
import { KeepsakeUnlock } from "./KeepsakeUnlock";
import { activityConfirm } from "@/passport/engine";
import { parseCtx, type CtxKey } from "@/passport/journal-context";
import { MULTI_DOG_NOTE, dogWho, hasManyDogs, type DogProfile } from "@/passport/profile";
import { presetFor } from "@/passport/quiz";
import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { StampGrid } from "@/passport/art/stamps";
import { getSave, revealStarter, setProfile, setStarter } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { PREVIEWS_PATH, isRevealed, savedStarter, selectStarter } from "@/passport/starter";
import { usePassport } from "@/passport/usePassport";
import { unlockLine, type PremiumSummary } from "@/lib/premium-summary";
import type { Adventure } from "@/passport/schema";
import { AdventureCard, Chips } from "./AdventureCard";
import { useAdventureLibrary } from "./collections-shared";
import { flow } from "./flow-events";
import { PreviewMatch } from "./PreviewMatch";
import { needChips, glanceOf, suitabilityNotes, SUPPLY_LABELS } from "./labels";

export const FREE_PROMISE =
  "Tell us about your dog or dogs. Get one adventure picked for them, free.";

/** One concise safety question before this adventure's reveal, using the same "confirm" idea as held adventures. */
function ConfirmBeforeReveal({ a, onAnother }: { a: Adventure; onAnother: () => void }) {
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
          No, find another
        </button>
        <button type="button" className="pa-chip" onClick={onAnother}>
          Not sure, find another
        </button>
      </div>
      <p className="pa-fine">
        We never guess about your dog, so an unsure answer means another pick.
      </p>
    </div>
  );
}

/** The unlock pitch. Pass the live summary where the page already fetches it; otherwise it uses the fallback wording. */
export function UnlockPitch({
  summary = null,
  where = "intro",
}: {
  summary?: PremiumSummary | null;
  where?: string;
}) {
  return (
    <aside className="pa-panel" aria-labelledby="pitch-h">
      <h2 className="pa-h" id="pitch-h">
        Want more little adventures with your dog?
      </h2>
      <p>{unlockLine(summary)}</p>
      <p className="pa-fine">One-time purchase, no subscription, no account.</p>
      <div className="pa-row">
        <AppLink
          to="/unlock"
          className="pp-btn pp-btn-primary"
          onClick={() => flow("purchase_cta_clicked", { where })}
        >
          See the full Passport
        </AppLink>
        <AppLink to={PREVIEWS_PATH} className="pp-btn pp-btn-ghost">
          Browse previews
        </AppLink>
      </div>
    </aside>
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

/** The recommendation: practical facts only. The title, steps and twist stay a surprise until you accept. */
function Recommendation({
  a,
  dogName,
  why,
  widenedNote,
  onAccept,
  onAnother,
  onChange,
}: {
  a: Adventure;
  dogName: string | undefined;
  why: string[];
  /** Plain words about optional answers that were set aside to find this pick, or null. */
  widenedNote: string | null;
  onAccept: () => void;
  onAnother: () => void;
  onChange: () => void;
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
      <h1 className="pa-h1">
        {dogName ? `A first adventure for ${dogName}` : "A first adventure"}
      </h1>
      <p className="pa-sub">
        Here is what to expect. Scratch or tap the card to see what it is and how it goes, or ask
        for another.
      </p>
      <article className="pa-card pa-mystery" aria-label="Recommended adventure">
        <p className="pa-kicker">Your free first adventure</p>
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
        {why.length > 0 && (
          <p className="pd-why">
            <strong>Why this one:</strong> {why.join(". ")}.
          </p>
        )}
        <div className="pa-actions">
          {needsConfirm ? (
            <ConfirmBeforeReveal a={a} onAnother={onAnother} />
          ) : (
            <RevealSurface adventureId={a.id} onReveal={onAccept} />
          )}
          <button type="button" className="pp-btn pp-btn-ghost" onClick={onAnother}>
            Show me another
          </button>
        </div>
        {hasManyDogs(dogName) && <p className="pa-fine">{MULTI_DOG_NOTE}</p>}
      </article>
      <p className="pa-fine">
        Not the right fit? Show me another as many times as you like.{" "}
        <button type="button" className="pa-linkbtn" onClick={onChange}>
          Change my answers
        </button>
      </p>
      <SkipAheadLine />
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

export function FreeStarter({ ctx }: { ctx?: CtxKey | undefined } = {}) {
  const { ready, save } = usePassport();
  const { all: library, status } = useAdventureLibrary();
  const [stage, setStage] = useState<"welcome" | "survey">("welcome");
  const [none, setNone] = useState<"nothing" | "seen-all" | "narrow" | null>(null);
  const [quizMode, setQuizMode] = useState<"first" | "edit">("first");
  const [widened, setWidened] = useState(false);
  const offered = useRef<Set<string> | null>(null);
  const wasDone = useRef<boolean | null>(null);

  const adventure = ready ? savedStarter(library, save) : undefined;
  const done = adventure ? has(save.done, adventure.id) : false;
  const revealed = ready && isRevealed(save) && !!adventure;

  useEffect(() => {
    if (!ready) return;
    if (wasDone.current === false && done) flow("intro_completed");
    wasDone.current = done;
  }, [ready, done]);

  if (!ready || status === "checking")
    return (
      <Container>
        <div className="pa-page" aria-busy="true" />
      </Container>
    );

  const seen = (): Set<string> => (offered.current ??= readOffered());
  const dogName = save.profile.data.name;

  function pickNext(replace: boolean, relaxNow?: boolean) {
    const relax = relaxNow ?? widened; // "show me another" keeps the widening the visitor chose
    if (relaxNow !== undefined) setWidened(relaxNow);
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
    // Never leave a pick the answers rule out, and say which kind of "nothing" this is.
    const again = selectStarter(library, getSave(), new Set(), { relax });
    setStarter(null);
    setNone(
      again.ok
        ? "seen-all"
        : !relax && selectStarter(library, getSave(), new Set(), { relax: true }).ok
          ? "narrow"
          : "nothing",
    );
    setStage("welcome");
  }

  function submit() {
    flow("intro_personalized");
    seen().clear();
    writeOffered(seen());
    setStarter(null); // a fresh set of answers starts a fresh list
    pickNext(false, false);
  }

  function accept() {
    revealStarter();
    flow("intro_revealed");
  }

  let body;
  if (adventure && revealed) {
    body = (
      <>
        <h1 className="pa-h1">Your first adventure</h1>
        <p className="pa-sub">
          Picked for {dogWho(dogName)}. It stays here, free, so you can come back to it any time.
        </p>
        <AdventureCard a={adventure} dogName={dogName} />
        {done ? (
          <>
            <section className="pa-panel" aria-labelledby="fs-stamp-h">
              <h2 className="pa-h" id="fs-stamp-h">
                Your first stamp
              </h2>
              <StampGrid earned={["first-adventure"]} slugs={["first-adventure"]} size={112} />
              <p className="pa-fine">Added to your passport.</p>
            </section>
            <p className="pa-fine" id="fs-storage-note">
              Your progress is kept on this device, in this browser, and nothing is uploaded. If you
              clear your browser's site data, or open Paws &amp; Passage somewhere else (another
              browser, another device, or a home-screen shortcut, which keeps its own separate
              storage), it will not be there. Exporting a backup from My Passport is optional.
            </p>
            <UnlockPitch where="intro-complete" />
          </>
        ) : (
          <SkipAheadLine />
        )}
      </>
    );
  } else if (adventure && stage === "welcome") {
    const why = (() => {
      const pick = selectStarter(library, save);
      return pick.ok && pick.adventure.id === adventure.id ? pick.why : [];
    })();
    const o = save.owner.data;
    const widenedNote = !widened
      ? null
      : [
          o.where || o.time || o.spend
            ? "We widened your where, time and spend answers to find this one."
            : "",
          o.kids && !adventure.household.includes("family")
            ? "We also set aside the children-joining preference."
            : "",
        ]
          .filter(Boolean)
          .join(" ") || null;
    body = (
      <>
        <Recommendation
          a={adventure}
          dogName={dogName}
          why={why}
          widenedNote={widenedNote}
          onAccept={accept}
          onAnother={() => pickNext(true)}
          onChange={() => {
            setQuizMode("edit");
            setStage("survey");
          }}
        />
        <PreviewMatch hasIntro />
      </>
    );
  } else if (none && stage === "welcome") {
    body = (
      <>
        <h1 className="pa-h1">
          {none === "seen-all"
            ? "That was every free fit"
            : none === "narrow"
              ? "Nothing free fits all of that"
              : "No free adventure fits yet"}
        </h1>
        <div className="pa-card" role="status">
          <p>
            {none === "seen-all"
              ? "You have seen every free adventure that suits what you told us. We can start the list over, or you can change your answers."
              : none === "narrow"
                ? `Free adventures suit your dog, but none fits your ${save.owner.data.kids ? "optional answers (where, time, spend and children joining)" : "where, time and spend answers"} together. You can widen those, or change your answers. Widening never loosens what keeps your dog safe and comfortable.`
                : "None of the free adventures suits what you told us. We use your answers to leave out adventures that do not fit, and we never loosen those. If you picked something by mistake, or answered optional questions such as children joining or keeping it quiet, you can change your answers."}
          </p>
          <div className="pa-row">
            {none === "seen-all" && (
              <button
                type="button"
                className="pp-btn pp-btn-primary"
                onClick={() => {
                  seen().clear();
                  writeOffered(seen());
                  pickNext(false);
                }}
              >
                Start the list over
              </button>
            )}
            {none === "narrow" && (
              <button
                type="button"
                className="pp-btn pp-btn-primary"
                onClick={() => {
                  seen().clear();
                  writeOffered(seen());
                  pickNext(false, true);
                }}
              >
                {save.owner.data.kids
                  ? "Widen where, time, spend and children joining"
                  : "Widen where, time and spend"}
              </button>
            )}
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => {
                setQuizMode("edit");
                setStage("survey");
              }}
            >
              Change my answers
            </button>
          </div>
        </div>
        <p className="pa-fine">
          The full Passport has more adventures to choose from.{" "}
          <AppLink
            to="/unlock"
            className="pa-linkbtn"
            onClick={() => flow("purchase_cta_clicked", { where: "intro-none" })}
          >
            See the full Passport
          </AppLink>
        </p>
      </>
    );
  } else if (stage === "survey") {
    body = (
      <>
        <h1 className="pa-h1">A few quick questions</h1>

        <IntroQuiz
          save={save}
          mode={quizMode}
          preset={quizMode === "first" ? presetFor(ctx, save) : undefined}
          onDone={submit}
          onCancel={() => setStage("welcome")}
          submitLabel={adventure ? "Update my pick" : "Find our adventure"}
        />
      </>
    );
  } else {
    body = (
      <>
        <h1 className="pa-h1">Your first adventure is free</h1>
        <p className="pa-sub">{FREE_PROMISE}</p>
        <KeepsakeUnlock where="intro-start" />
        <section className="pa-panel" aria-labelledby="fs-how-h">
          <h2 className="pa-h" id="fs-how-h">
            How it works
          </h2>
          <ol className="pa-steps">
            <li>Answer a few quick questions, or skip any of them.</li>
            <li>
              See a recommendation with the practical details: time, cost, setting and effort.
            </li>
            <li>Accept it, or ask for another as often as you like.</li>
            <li>Then the full adventure is yours to keep. No account, email or card.</li>
          </ol>
          <div className="pa-row">
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              onClick={() => {
                flow("intro_started");
                setQuizMode("first");
                setStage("survey");
              }}
            >
              Find Our First Adventure
            </button>
            <AppLink to={PREVIEWS_PATH} className="pp-btn pp-btn-ghost">
              Browse previews first
            </AppLink>
          </div>
        </section>
      </>
    );
  }

  return (
    <Container>
      <div className="pa-page pd-page">{body}</div>
    </Container>
  );
}
