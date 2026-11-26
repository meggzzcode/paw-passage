import { useState } from "react";
import { track } from "@/passport/events";
import { setProfile } from "@/passport/local-store";
import { usePassport } from "@/passport/usePassport";
import { ProfileEditor } from "./ProfileEditor";
import { OwnerPrefsEditor } from "./OwnerPrefsEditor";

/**
 * Progressive, optional personalisation. Browsing never waits for it. Step one is short; the dog details and the
 * "About you" preferences are optional expansions. Answers save as you go and can be changed again any time.
 */
export function Onboarding({ onDone }: { onDone?: () => void }) {
  const { profile } = usePassport();
  const [more, setMore] = useState(false);
  const [owner, setOwnerOpen] = useState(false);

  function finish() {
    track("profile_completed", { stage: profile.lifeStage ?? "unset" });
    onDone?.();
  }

  return (
    <section className="pa-panel" aria-labelledby="pd-onboard-h">
      <h2 className="pa-h" id="pd-onboard-h">
        Who's coming on the adventure?
      </h2>
      <p className="pa-sub">
        A few quick questions, all optional. They only shape your suggestions. If you are not sure,
        choose “Not sure”: adventures that depend on that answer stay on hold until you tell us.
        Nothing leaves this device.
      </p>
      <ProfileEditor part="quick" />

      <div className="pd-expansions">
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          aria-expanded={more}
          onClick={() => setMore((v) => !v)}
        >
          {more ? "Hide more about your dog" : "Add more about your dog"}
        </button>
        {more && <ProfileEditor part="more" />}
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          aria-expanded={owner}
          onClick={() => setOwnerOpen((v) => !v)}
        >
          {owner ? "Hide About you" : "About you"}
        </button>
        {owner && <OwnerPrefsEditor />}
      </div>

      <div className="pa-row">
        <button type="button" className="pp-btn pp-btn-primary" onClick={finish}>
          Start exploring
        </button>
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          onClick={() => {
            setProfile({ skipped: true });
            onDone?.();
          }}
        >
          Skip for now
        </button>
      </div>
    </section>
  );
}
