// The free experience: a short preference quiz, then ONE introductory adventure picked for this dog.
// Flow: understand the product -> "Find Our First Adventure" -> a few preferences -> a recommendation shown with
// practical info only (time, cost, setting, effort, prerequisites, restrictions; NOT the steps) -> Accept, or
// "Show me another" as often as you like (never the same one twice in a session) -> reveal -> complete whenever ->
// intro stamp and keepsake -> a quiet invitation to the full Passport.
// This is a product choice, not a security gate (the free pool is public). Everything here runs on this device with no
// network call. Unanswered questions stay UNKNOWN, never "safe". No account, email or card; nothing forces completion.
import { RevealSurface } from "./RevealSurface";
import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { StampGrid } from "@/passport/art/stamps";
import { getSave, revealStarter, setOwner, setStarter } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { PREVIEWS_PATH, isRevealed, savedStarter, selectStarter } from "@/passport/starter";
import { usePassport } from "@/passport/usePassport";
import { unlockLine, type PremiumSummary } from "@/lib/premium-summary";
import type { Adventure } from "@/passport/schema";
import { AdventureCard, Chips } from "./AdventureCard";
import { useAdventureLibrary } from "./collections-shared";
import { flow } from "./flow-events";
import { PreviewMatch } from "./PreviewMatch";
import { COMFORT, Choice, patch } from "./ProfileEditor";
import { needChips, glanceOf, suitabilityNotes, SUPPLY_LABELS } from "./labels";

export const FREE_PROMISE = "Tell us about your dog. Get one adventure picked for them, free.";

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

function Survey({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) {
  const { profile: p, save } = usePassport();
  const owner = save.owner.data;
  return (
    <section className="pa-panel" aria-labelledby="fs-survey-h">
      <h2 className="pa-h" id="fs-survey-h">
        Who's coming on the adventure?
      </h2>
      <p className="pa-sub">
        A few quick taps. Skip anything you are not sure about: “Not sure” is kept as unknown, and
        we only pick something your answers allow. Nothing leaves this device.
      </p>
      <div className="pd-editor">
        <label className="pa-field">
          <span>Your dog's name (optional)</span>
          <input
            value={p.name ?? ""}
            maxLength={30}
            autoComplete="off"
            onChange={(e) => patch({ name: e.target.value || undefined })}
          />
        </label>
        <Choice
          legend="Life stage"
          options={[
            { value: "puppy", label: "Puppy" },
            { value: "adult", label: "Adult" },
            { value: "senior", label: "Senior" },
            { value: undefined, label: "Not sure" },
          ]}
          value={p.lifeStage}
          onChange={(v) => patch({ lifeStage: v })}
        />
        <Choice
          legend="Energy"
          options={[
            { value: "gentle", label: "Gentle" },
            { value: "moderate", label: "Moderate" },
            { value: "lively", label: "Lively" },
            { value: undefined, label: "Not sure" },
          ]}
          value={p.energy}
          onChange={(v) => patch({ energy: v })}
        />
        <Choice
          legend="Size"
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: undefined, label: "Not sure" },
          ]}
          value={p.size}
          onChange={(v) => patch({ size: v })}
        />
        <Choice
          legend="With unfamiliar people"
          options={COMFORT}
          value={p.people}
          onChange={(v) => patch({ people: v })}
        />
        <Choice
          legend="Around other dogs"
          options={COMFORT}
          value={p.dogs}
          onChange={(v) => patch({ dogs: v })}
        />
        <details className="pa-fold">
          <summary>A few more that help (optional)</summary>
          <div className="pa-fold-body pd-editor">
            <Choice
              legend="Loud noises bother them"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "unknown", label: "Not sure" },
              ]}
              value={p.noiseSensitive}
              onChange={(v) => patch({ noiseSensitive: v })}
            />
            <Choice
              legend="Treats and food games are okay"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "unknown", label: "Not sure" },
              ]}
              value={p.foodActivities}
              onChange={(v) => patch({ foodActivities: v })}
            />
            <Choice
              legend="Moves slowly or not far"
              hint="Only you know what is right for your dog. This just keeps longer outings out of the pick."
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
                { value: undefined, label: "Not sure" },
              ]}
              value={p.limitedMobility}
              onChange={(v) => patch({ limitedMobility: v })}
            />
            <Choice
              legend="How much walking do you want"
              options={[
                { value: "seated", label: "None, I'd rather sit" },
                { value: "short-walk", label: "A short walk" },
                { value: "long-walk", label: "A longer walk" },
                { value: undefined, label: "Not sure" },
              ]}
              value={owner.mobility}
              onChange={(v) => setOwner({ mobility: v } as never)}
            />
            <Choice
              legend="A car is handy"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "unknown", label: "Not sure" },
              ]}
              value={owner.hasCar}
              onChange={(v) => setOwner({ hasCar: v } as never)}
            />
          </div>
        </details>
      </div>
      <div className="pa-row">
        <button type="button" className="pp-btn pp-btn-primary" onClick={onSubmit}>
          {submitLabel}
        </button>
      </div>
    </section>
  );
}

/** The recommendation: practical facts only. The title, steps and twist stay a surprise until you accept. */
function Recommendation({
  a,
  dogName,
  why,
  onAccept,
  onAnother,
  onChange,
}: {
  a: Adventure;
  dogName: string | undefined;
  why: string[];
  onAccept: () => void;
  onAnother: () => void;
  onChange: () => void;
}) {
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
        {why.length > 0 && (
          <p className="pd-why">
            <strong>Why this one:</strong> {why.join(". ")}.
          </p>
        )}
        <div className="pa-actions">
          <RevealSurface adventureId={a.id} onReveal={onAccept} />
          <button type="button" className="pp-btn pp-btn-ghost" onClick={onAnother}>
            Show me another
          </button>
        </div>
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

export function FreeStarter() {
  const { ready, save } = usePassport();
  const { all: library, status } = useAdventureLibrary();
  const [stage, setStage] = useState<"welcome" | "survey">("welcome");
  const [none, setNone] = useState<"nothing" | "seen-all" | null>(null);
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

  function pickNext(replace: boolean) {
    const s = seen();
    const cur = getSave().starter?.id;
    if (cur) s.add(cur);
    const pick = selectStarter(library, getSave(), s);
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
    const anyLeft = selectStarter(library, getSave()).ok;
    setStarter(null);
    setNone(anyLeft ? "seen-all" : "nothing");
    setStage("welcome");
  }

  function submit() {
    flow("intro_personalized");
    seen().clear();
    writeOffered(seen());
    setStarter(null); // a fresh set of answers starts a fresh list
    pickNext(false);
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
          {dogName ? `Picked for ${dogName}` : "Picked for your dog"}. It stays here, free, so you
          can come back to it any time.
        </p>
        <AdventureCard a={adventure} dogName={dogName} />
        {done ? (
          <>
            <section className="pa-panel" aria-labelledby="fs-stamp-h">
              <h2 className="pa-h" id="fs-stamp-h">
                Your first stamp
              </h2>
              <StampGrid earned={["first-adventure"]} slugs={["first-adventure"]} size={112} />
              <p className="pa-fine">
                Added to your passport. Make a keepsake from your photo above whenever you like.
              </p>
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
    body = (
      <>
        <Recommendation
          a={adventure}
          dogName={dogName}
          why={why}
          onAccept={accept}
          onAnother={() => pickNext(true)}
          onChange={() => {
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
          {none === "seen-all" ? "That was every free fit" : "No free adventure fits yet"}
        </h1>
        <div className="pa-card" role="status">
          <p>
            {none === "seen-all"
              ? "You have seen every free adventure that suits what you told us. We can start the list over, or you can change your answers."
              : "None of the free adventures suits what you told us, and we never suggest something your answers rule out. The full Passport has far more to choose from."}
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
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setStage("survey")}
            >
              Change my answers
            </button>
          </div>
        </div>
        <UnlockPitch where="intro-none" />
      </>
    );
  } else if (stage === "survey") {
    body = (
      <>
        <h1 className="pa-h1">A few quick questions</h1>
        <Survey
          onSubmit={submit}
          submitLabel={adventure ? "Update my pick" : "Find our adventure"}
        />
      </>
    );
  } else {
    body = (
      <>
        <h1 className="pa-h1">Your first adventure is free</h1>
        <p className="pa-sub">{FREE_PROMISE}</p>
        <section className="pa-panel" aria-labelledby="fs-how-h">
          <h2 className="pa-h" id="fs-how-h">
            How it works
          </h2>
          <ol className="pa-steps">
            <li>Answer a few quick questions, or skip any with “Not sure”.</li>
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
