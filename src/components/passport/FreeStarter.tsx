// The free experience: a short dog survey, then ONE adventure picked for this dog ("Your first adventure").
// This is a product choice, not a security gate (the free pool is public). Everything here runs on this device with
// no network call. Unanswered questions stay UNKNOWN, never "safe".
import { useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { getSave, setStarter } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { selectStarter, savedStarter } from "@/passport/starter";
import { usePassport } from "@/passport/usePassport";
import { unlockLine, type PremiumSummary } from "@/lib/premium-summary";
import { AdventureCard } from "./AdventureCard";
import { useAdventureLibrary } from "./collections-shared";
import { COMFORT, Choice, patch } from "./ProfileEditor";

export const FREE_PROMISE = "Tell us about your dog. Get one adventure picked for them, free.";

/** The unlock pitch. Pass the live summary where the page already fetches it; otherwise it uses the fallback wording. */
export function UnlockPitch({ summary = null }: { summary?: PremiumSummary | null }) {
  return (
    <aside className="pa-panel" aria-labelledby="pitch-h">
      <h2 className="pa-h" id="pitch-h">
        Want more little adventures with your dog?
      </h2>
      <p>{unlockLine(summary)}</p>
      <p className="pa-fine">One-time purchase, no subscription, no account.</p>
      <div className="pa-row">
        <AppLink to="/unlock" className="pp-btn pp-btn-primary">
          See the full Passport
        </AppLink>
      </div>
    </aside>
  );
}

function Survey({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) {
  const { profile: p } = usePassport();
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
          legend="Treats and food games are okay"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "unknown", label: "Not sure" },
          ]}
          value={p.foodActivities}
          onChange={(v) => patch({ foodActivities: v })}
        />
      </div>
      <div className="pa-row">
        <button type="button" className="pp-btn pp-btn-primary" onClick={onSubmit}>
          {submitLabel}
        </button>
      </div>
    </section>
  );
}

export function FreeStarter() {
  const { ready, save } = usePassport();
  const { all: library, status } = useAdventureLibrary();
  const [editing, setEditing] = useState(false);
  const [none, setNone] = useState(false);

  if (!ready || status === "checking")
    return (
      <Container>
        <div className="pa-page" aria-busy="true" />
      </Container>
    );

  const adventure = savedStarter(library, save);
  const done = adventure ? has(save.done, adventure.id) : false;
  const dogName = save.profile.data.name;

  function submit() {
    const pick = selectStarter(library, getSave());
    if (pick.ok) {
      setStarter(pick.adventure.id);
      setNone(false);
      setEditing(false);
    } else {
      setStarter(null); // never leave a pick the new answers rule out
      setNone(true);
      setEditing(false);
    }
  }

  let body;
  if (adventure && !editing) {
    const why = (() => {
      const pick = selectStarter(library, save);
      return pick.ok && pick.adventure.id === adventure.id ? pick.why : undefined;
    })();
    body = (
      <>
        <h1 className="pa-h1">Your first adventure</h1>
        <p className="pa-sub">
          {dogName ? `Picked for ${dogName}` : "Picked for your dog"}, from what you told us. Free,
          no account.
        </p>
        <AdventureCard a={adventure} dogName={dogName} why={why} />
        {done ? (
          <p className="pa-fine">
            This is your free keepsake adventure. You can re-read it and keep your keepsake any
            time.
          </p>
        ) : (
          <p className="pa-fine">
            Your answers changed?{" "}
            <button type="button" className="pa-linkbtn" onClick={() => setEditing(true)}>
              Re-answer the survey
            </button>{" "}
            to change the pick, until you collect it.
          </p>
        )}
        <UnlockPitch />
      </>
    );
  } else if (none && !editing) {
    body = (
      <>
        <h1 className="pa-h1">No free adventure fits yet</h1>
        <div className="pa-card" role="status">
          <p>
            None of the free adventures suits what you told us, and we never suggest something your
            answers rule out. The full Passport has far more to choose from.
          </p>
          <div className="pa-row">
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setEditing(true)}
            >
              Change my answers
            </button>
          </div>
        </div>
        <UnlockPitch />
      </>
    );
  } else {
    body = (
      <>
        <h1 className="pa-h1">Find your first adventure</h1>
        <p className="pa-sub">{FREE_PROMISE}</p>
        <Survey
          onSubmit={submit}
          submitLabel={adventure ? "Update my pick" : "Pick our adventure"}
        />
      </>
    );
  }

  return (
    <Container>
      <div className="pa-page pd-page">{body}</div>
    </Container>
  );
}
