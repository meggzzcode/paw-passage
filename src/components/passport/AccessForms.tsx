// Activation and restore forms, plus the account panel for someone who is signed in.
// The code is held only in this component's input while typing. It is never put in a URL, a log, storage or an event.
import { useEffect, useState } from "react";
import { importJson, getSave } from "@/passport/local-store";
import { track } from "@/passport/events";
import {
  deleteAccount,
  exportAccount,
  getSessionInfo,
  submitAccessCode,
  type AccessFailure,
  type AccessKind,
  type SessionInfo,
} from "@/lib/passport-api";
import { downloadBlob } from "@/passport/keepsake/render";

export const FAILURE_TEXT: Record<AccessFailure, string> = {
  invalid_format:
    "That doesn't look like a purchase code. Check the code in your purchase email and try again.",
  invalid_code:
    "We couldn't match that code to a purchase. Check it for typos, or contact us if you think it's right.",
  refunded: "This purchase was refunded, so it no longer unlocks the full Passport.",
  disputed: "This purchase is under a payment dispute, so access is paused for now.",
  revoked: "Access for this purchase has been withdrawn.",
  unavailable:
    "We couldn't reach the checkout provider to confirm your code. Nothing is wrong with the code: please try again in a little while.",
  rate_limited: "Too many tries just now. Please wait a minute and try again.",
  misconfigured: "Activation isn't switched on for this site yet. Please try again later.",
  network: "We couldn't reach the site. Check your connection and try again.",
  error: "Something went wrong on our side. Please try again in a little while.",
};

export function AccessForm({ kind }: { kind: AccessKind }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<AccessFailure | null>(null);
  const restoring = kind === "restore";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setDone(null);
    const r = await submitAccessCode(kind, code, getSave());
    setBusy(false);
    if (!r.ok) {
      setError(r.reason);
      return;
    }
    setCode(""); // the code leaves the page as soon as it has been checked
    try {
      if (r.save) importJson(JSON.stringify(r.save)); // merge, never replace, what is already on this device
    } catch {
      /* the save on the server stays safe even if this device could not merge it */
    }
    track(r.reason === "activated" ? "purchase_confirmed" : "access_restored", {
      reason: r.reason,
    });
    setDone(
      r.reason === "activated"
        ? "Your purchase is confirmed and your progress is now linked to it."
        : r.reason === "restored"
          ? "Welcome back. Access is restored on this device and your saved progress has been merged in."
          : "This purchase was already active. Access is confirmed on this device.",
    );
  }

  return (
    <form
      className="pa-card"
      onSubmit={submit}
      aria-label={restoring ? "Restore access" : "Activate your code"}
    >
      <h2 className="pa-h">{restoring ? "Restore access" : "Already have a code?"}</h2>
      <p className="pa-fine">
        {restoring
          ? "Enter the code from your purchase email. No second purchase needed."
          : "Enter the code from your purchase email to unlock the full Passport on this device."}
      </p>
      <label className="pa-field">
        <span>Purchase code</span>
        <input
          type="text"
          name="purchase-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          required
          aria-invalid={error === "invalid_code" || error === "invalid_format"}
          aria-describedby="access-status"
        />
      </label>
      <div className="pa-row">
        <button type="submit" className="pp-btn pp-btn-primary" disabled={busy}>
          {busy ? "Checking…" : restoring ? "Restore access" : "Activate"}
        </button>
      </div>
      <div id="access-status" role="status" aria-live="polite">
        {error && <p className="co-error">{FAILURE_TEXT[error]}</p>}
        {done && <p>{done}</p>}
      </div>
      <p className="pa-fine">
        Your code is only sent to confirm your purchase. It is never added to a web address or saved
        in this browser.
      </p>
    </form>
  );
}

/** Shown on My Passport only when a signed-in session exists. Quietly absent for the free passport. */
export function AccountPanel() {
  const [info, setInfo] = useState<SessionInfo>({ signedIn: false });
  const [msg, setMsg] = useState("");
  const [askDelete, setAskDelete] = useState(false);
  useEffect(() => {
    let live = true;
    void getSessionInfo().then((s) => live && setInfo(s));
    return () => {
      live = false;
    };
  }, []);
  if (!info.signedIn) return null;
  return (
    <section className="pa-panel" aria-labelledby="acct-h">
      <h2 id="acct-h" className="pa-h">
        Full Passport account
      </h2>
      <p className="pa-fine">
        Access status: {info.entitled ? "active" : info.status}. This copy is separate from the one
        stored in this browser.
      </p>
      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          onClick={async () => {
            const text = await exportAccount(info.csrf);
            if (text === null) {
              setMsg("Couldn't download your account data. Please try again.");
              return;
            }
            downloadBlob(
              new Blob([text], { type: "application/json" }),
              "paw-and-passage-account.json",
            );
            setMsg("Account data downloaded.");
          }}
        >
          Download account data
        </button>
        {!askDelete ? (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={() => setAskDelete(true)}>
            Delete account copy
          </button>
        ) : (
          <>
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              onClick={async () => {
                const ok = await deleteAccount(info.csrf);
                setAskDelete(false);
                if (ok) {
                  setInfo({ signedIn: false });
                  setMsg("Your account copy was deleted. Progress on this device is untouched.");
                } else setMsg("Couldn't delete it right now. Please try again.");
              }}
            >
              Yes, delete the account copy
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setAskDelete(false)}
            >
              Keep it
            </button>
          </>
        )}
      </div>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}
