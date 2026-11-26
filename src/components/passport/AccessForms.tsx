// Activation and restore forms, plus the account panel for someone who is signed in.
// The code is held only in this component's input while typing. It is never put in a URL, a log, storage or an event.
import { AppLink } from "@/components/shell/AppLink";
import { InstallPrompt } from "@/components/site/InstallPrompt";
import { useState } from "react";
import { importJson, getSave } from "@/passport/local-store";
import {
  clearThisDevice,
  getDeviceOwner,
  keepPreviousLocalOnly,
  noteSessionOwner,
  removePushOnThisDevice,
  startFreshForNewCustomer,
} from "@/passport/device-owner";
import { stopSync, useOwnerConflict } from "@/passport/useSync";
import { clearEntitlement, entitlementGranted, refreshCsrf } from "@/passport/premium-client";
import { useEntitlement } from "@/passport/useEntitlement";
import { track } from "@/passport/events";
import {
  deleteAccount,
  exportAccount,
  signOutRequest,
  submitAccessCode,
  type AccessFailure,
  type AccessKind,
} from "@/lib/passport-api";
import { downloadBlob } from "@/passport/keepsake/download";

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
    // Local records that already belong to a customer are never offered to the server: if this is a different customer they
    // must not be merged into that account. The same customer's records still sync right after sign-in.
    const r = await submitAccessCode(kind, code, getDeviceOwner() ? undefined : getSave());
    setBusy(false);
    if (!r.ok) {
      setError(r.reason);
      return;
    }
    setCode(""); // the code leaves the page as soon as it has been checked
    const verdict = noteSessionOwner(r.owner);
    try {
      // merge, never replace, what is already on this device; but never into a different customer's local records
      if (r.save && verdict !== "conflict") importJson(JSON.stringify(r.save));
    } catch {
      /* the save on the server stays safe even if this device could not merge it */
    }
    // Load the premium library and run the first sync now, so the free-to-paid merge shows straight away.
    void entitlementGranted(r.csrf);
    track(r.reason === "activated" ? "purchase_confirmed" : "access_restored", {
      reason: r.reason,
    });
    setDone(
      verdict === "conflict"
        ? "Access is confirmed on this device. This device still holds saved progress from someone else, so nothing has been merged yet."
        : r.reason === "activated"
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
      {done && (
        <p className="pa-row">
          <AppLink to="/welcome" className="pp-btn pp-btn-primary">
            Continue to your welcome page
          </AppLink>
        </p>
      )}
      {done && <SharedDeviceChoice />}
      {done && <InstallPrompt where="purchase" />}
      <p className="pa-fine">
        Your code is only sent to confirm your purchase. It is never added to a web address or saved
        in this browser.
      </p>
    </form>
  );
}

/** Shown on My Passport only when a signed-in session exists. Quietly absent for the free passport. */
export function AccountPanel() {
  const ent = useEntitlement();
  const [msg, setMsg] = useState("");
  const [askDelete, setAskDelete] = useState(false);
  const [askSignOut, setAskSignOut] = useState(false);
  const [askClear, setAskClear] = useState(false);
  const [outMsg, setOutMsg] = useState("");
  if (!ent.signedIn && !outMsg) return null;
  if (!ent.signedIn)
    return (
      <section className="pa-panel" aria-labelledby="acct-h">
        <h2 id="acct-h" className="pa-h">
          Full Passport account
        </h2>
        <p role="status">{outMsg}</p>
        <p className="pa-row">
          <AppLink to="/restore-access" className="pp-btn pp-btn-secondary">
            Restore access
          </AppLink>
        </p>
      </section>
    );
  /** Calls the API; if the token went stale, fetches a fresh one and tries once more. */
  async function withCsrf<T>(run: (csrf: string) => Promise<T | null | false>): Promise<T | null> {
    const first = await run(ent.csrf);
    if (first) return first;
    const csrf = await refreshCsrf();
    if (!csrf || csrf === ent.csrf) return null;
    return (await run(csrf)) || null;
  }
  return (
    <section className="pa-panel" aria-labelledby="acct-h">
      <h2 id="acct-h" className="pa-h">
        Full Passport account
      </h2>
      <SharedDeviceChoice />
      <p className="pa-fine">
        Access status: {ent.status === "entitled" ? "active" : "not active"}. This copy is separate
        from the one stored in this browser.
      </p>
      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          onClick={async () => {
            const text = await withCsrf(exportAccount);
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
                const ok = await withCsrf(deleteAccount);
                setAskDelete(false);
                if (ok) {
                  clearEntitlement(); // premium, the sign-in flag and sync all stop; progress on this device stays
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
      <div className="pa-row">
        {!askSignOut ? (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={() => setAskSignOut(true)}>
            Sign out of this device
          </button>
        ) : (
          <>
            <p className="pa-fine" id="signout-note">
              Your progress stays on this device. This only signs this device out of the full
              Passport and hides the premium adventures here; it does not sign out other devices.
              Sign back in anytime with your purchase code via Restore access.
            </p>
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              aria-describedby="signout-note"
              onClick={async () => {
                // Best effort: the server clears the cookie; the device signs out locally whatever the answer.
                // A stale CSRF token gets one fresh-token retry.
                let ok = await signOutRequest(ent.csrf);
                if (!ok) {
                  const csrf = await refreshCsrf();
                  if (csrf) ok = await signOutRequest(csrf);
                }
                setAskSignOut(false);
                clearEntitlement(); // flag, in-memory premium library and sync all reset; local progress untouched
                setOutMsg(
                  ok
                    ? "Signed out of this device. Your progress is still here. Sign back in anytime with your purchase code via Restore access."
                    : "Signed out on this device. We couldn't reach the site to clear the sign-in cookie, so it may still be valid until it expires. Your progress is still here.",
                );
              }}
            >
              Yes, sign out of this device
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setAskSignOut(false)}
            >
              Stay signed in
            </button>
          </>
        )}
      </div>
      <div className="pa-row">
        {!askClear ? (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={() => setAskClear(true)}>
            Sign out and clear this device
          </button>
        ) : (
          <>
            <p className="pa-fine" id="clear-note">
              Use this on a shared or borrowed device. It signs this device out and removes from
              this browser your dog's names and profile, favorites, saved and completed adventures,
              memories, collections, planned adventures, packing lists, the progress stamps and the
              notification subscription. It cannot be undone on this device. Your account copy on
              our server is not deleted (use "Delete account copy" for that), and other devices are
              not signed out. You can restore access with your purchase code and your synced
              progress comes back.
            </p>
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              aria-describedby="clear-note"
              onClick={async () => {
                await removePushOnThisDevice(); // needs the session, so it goes first
                let ok = await signOutRequest(ent.csrf);
                if (!ok) {
                  const csrf = await refreshCsrf();
                  if (csrf) ok = await signOutRequest(csrf);
                }
                setAskClear(false);
                stopSync();
                clearEntitlement();
                await clearThisDevice();
                setOutMsg(
                  ok
                    ? "Signed out and cleared this device. Nothing from this account is left in this browser."
                    : "Cleared this device. We couldn't reach the site to clear the sign-in cookie, so it may still be valid until it expires. Nothing from this account is left in this browser's storage.",
                );
              }}
            >
              Yes, sign out and clear this device
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => setAskClear(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {msg && <p role="status">{msg}</p>}
    </section>
  );
}

/** Shown only when a different customer signs in on a device that still holds someone else's synced progress. */
export function SharedDeviceChoice() {
  const state = useOwnerConflict();
  if (state === "none") return null;
  return (
    <div className="pa-card" role="region" aria-labelledby="shared-h">
      <h3 id="shared-h" className="pa-h">
        This device has someone else's progress
      </h3>
      <p className="pa-fine">
        The saved progress on this device was last synced with a different account. To protect both
        accounts it has not been uploaded or merged into yours.{" "}
        {state === "kept"
          ? "It is staying on this device only, and your own progress is not syncing from here until you start fresh."
          : "Choose what to do with it."}
      </p>
      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-primary"
          onClick={() => startFreshForNewCustomer()}
        >
          Start fresh on this device
        </button>
        {state === "ask" && (
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            onClick={() => keepPreviousLocalOnly()}
          >
            Keep it on this device only
          </button>
        )}
      </div>
      <p className="pa-fine">
        Starting fresh removes the earlier progress from this browser and loads your own from your
        account. Keeping it leaves it readable here, never uploaded, with syncing paused.
      </p>
    </div>
  );
}
