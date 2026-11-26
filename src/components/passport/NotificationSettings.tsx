// Notification settings for My Passport. Paying customers only at launch. Nothing here asks the browser for
// permission until the customer presses the button under the explanation, and nothing re-asks after a "no".
import { useCallback, useEffect, useState } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { useEntitlement } from "@/passport/useEntitlement";
import { track } from "@/passport/events";
import { detectPushSupport, permissionState, type PermissionState } from "@/lib/push-support";
import {
  DEFAULT_PREFS,
  deviceTz,
  disableAll,
  disableOnThisDevice,
  enableOnThisDevice,
  fetchPushConfig,
  getDevices,
  getLocalDeviceId,
  getPrefs,
  putPrefs,
  setLocalDeviceId,
  setPrimaryDevice,
  deleteDevice,
  type Device,
  type NotificationPrefs,
} from "@/lib/notifications";
import { SavedReminderToggle } from "./SavedReminderToggle";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
type Phase = "loading" | "unavailable" | "off-by-owner" | "ready";

function zones(current: string): string[] {
  try {
    const list = (
      Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
    ).supportedValuesOf?.("timeZone");
    if (list?.length) return list.includes(current) ? list : [current, ...list];
  } catch {
    /* fall through */
  }
  return [current];
}

export function NotificationSettings() {
  const { status } = useEntitlement();
  if (status === "checking") return null;
  if (status !== "entitled")
    return (
      <section className="pa-panel" aria-labelledby="nt-h">
        <h2 id="nt-h" className="pa-h">
          Reminders
        </h2>
        <p className="pa-fine">
          Optional reminders and adventure ideas come with the full Passport. Calendar files for
          your adventures work for everyone.
        </p>
      </section>
    );
  return <Panel />;
}

function Panel() {
  const support = detectPushSupport();
  const [phase, setPhase] = useState<Phase>("loading");
  const [key, setKey] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [draft, setDraft] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [devices, setDevices] = useState<Device[]>([]);
  const [perm, setPerm] = useState<PermissionState>(permissionState());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [localId, setLocal] = useState<string | null>(getLocalDeviceId());

  const load = useCallback(async () => {
    setPhase("loading");
    const cfg = await fetchPushConfig();
    if (!cfg.ok) return setPhase("unavailable");
    if (!cfg.data.enabled) return setPhase("off-by-owner");
    setKey(cfg.data.publicKey);
    const [p, d] = await Promise.all([getPrefs(), getDevices()]);
    if (!p.ok || !d.ok) return setPhase("unavailable");
    setPrefs(p.data);
    setDraft(p.data);
    setDevices(d.data);
    setPhase("ready");
  }, []);
  useEffect(() => {
    if (support === "supported") void load();
  }, [load, support]);

  const thisDevice = devices.find((d) => d.deviceId === localId);
  const hasDevice = devices.length > 0;

  async function save(next: NotificationPrefs, ok = "Saved.") {
    setBusy(true);
    const r = await putPrefs(next);
    setBusy(false);
    if (r.ok) {
      setPrefs(next);
      setDraft(next);
      setMsg(ok);
    } else {
      setDraft(prefs);
      setMsg("We couldn't save that just now. Nothing changed. Please try again in a moment.");
    }
  }

  async function turnOn() {
    if (!key) return;
    setBusy(true);
    setMsg("");
    const r = await enableOnThisDevice(key, {
      onRequested: () => track("notification_permission_requested"),
    });
    setPerm(permissionState());
    if (r.ok) {
      track("notification_permission_granted");
      track("push_subscription_enabled");
      setLocal(r.deviceId);
      const d = await getDevices();
      if (d.ok) setDevices(d.data);
      setMsg("This device is set up. Choose what you would like below.");
    } else if (r.reason === "declined") {
      track("notification_permission_declined");
    } else if (r.reason === "dismissed") {
      setMsg("No problem. Nothing was turned on, and you can try again whenever you like.");
    } else {
      setMsg("We couldn't finish setting up this device. Nothing was turned on.");
    }
    setBusy(false);
  }

  async function offHere() {
    setBusy(true);
    const ok = await disableOnThisDevice(localId);
    track("push_subscription_disabled");
    setLocal(null);
    const d = await getDevices();
    if (d.ok) setDevices(d.data);
    setMsg(
      ok
        ? "Notifications are off on this device."
        : "Notifications are off here. We couldn't reach the site to update the device list; it will catch up later.",
    );
    setBusy(false);
  }

  async function offEverywhere() {
    setBusy(true);
    const r = await disableAll();
    await disableOnThisDevice(null);
    track("push_subscription_disabled");
    setLocalDeviceId(null);
    setLocal(null);
    if (r.ok) {
      setDevices([]);
      setPrefs(DEFAULT_PREFS);
      setDraft(DEFAULT_PREFS);
      setMsg("All notifications are off and your devices were removed.");
    } else {
      setMsg(
        "Notifications are off on this device. We couldn't reach the site to turn off the rest; please try again.",
      );
    }
    setBusy(false);
  }

  async function removeDevice(id: string) {
    setBusy(true);
    const r = await deleteDevice(id);
    if (id === localId) await disableOnThisDevice(null);
    if (id === localId) setLocal(null);
    if (r.ok) setDevices((l) => l.filter((d) => d.deviceId !== id));
    setMsg(r.ok ? "Device removed." : "We couldn't remove that device just now.");
    setBusy(false);
  }
  async function makePrimary(id: string) {
    setBusy(true);
    const r = await setPrimaryDevice(id);
    if (r.ok) setDevices((l) => l.map((d) => ({ ...d, primary: d.deviceId === id })));
    setMsg(r.ok ? "Weekly ideas will go to that device." : "We couldn't change that just now.");
    setBusy(false);
  }

  function toggleWeekly(on: boolean) {
    const w =
      on && !prefs.weekly.enabled
        ? { enabled: true, day: 6, time: "09:00", tz: deviceTz() }
        : { ...prefs.weekly, enabled: on };
    void save({ ...prefs, weekly: w });
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(prefs);

  let body;
  if (support === "unsupported")
    body = (
      <p className="pa-fine">
        This browser can't show reminders, so there is nothing to turn on here. Calendar files still
        work on every adventure.
      </p>
    );
  else if (support === "ios-needs-install")
    body = (
      <p className="pa-fine">
        On iPhone and iPad, reminders need Paws &amp; Passage added to your home screen first, and
        we have not confirmed them on every iPhone version.{" "}
        <AppLink to="/install" className="pa-linkbtn">
          Read the optional install guide
        </AppLink>
        . Calendar files work without it.
      </p>
    );
  else if (phase === "loading")
    body = (
      <p className="pa-fine" role="status">
        Checking reminder settings…
      </p>
    );
  else if (phase === "off-by-owner")
    body = (
      <p className="pa-fine" role="status">
        Reminders are not available right now. Calendar files still work on every adventure.
      </p>
    );
  else if (phase === "unavailable")
    body = (
      <div role="status">
        <p className="pa-fine">
          We couldn't load your reminder settings. Nothing has changed, and calendar files still
          work.
        </p>
        <button type="button" className="pp-btn pp-btn-secondary" onClick={() => void load()}>
          Try again
        </button>
      </div>
    );
  else
    body = (
      <>
        {perm === "denied" && !thisDevice && (
          <p className="pa-fine" role="status">
            Notifications are blocked for this site in your browser, which is completely fine. If
            you change your mind, you can allow them in your browser's site settings (usually the
            lock or tune icon beside the address), then come back here.
          </p>
        )}
        {!thisDevice && perm !== "denied" && (
          <div className="nt-card">
            <p>
              <strong>Would you like a little adventure inspiration?</strong>
            </p>
            <p>
              Receive optional weekly ideas and reminders for adventures you've planned. You're
              always in control.
            </p>
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              disabled={busy || !key}
              onClick={() => void turnOn()}
            >
              Turn on notifications
            </button>
          </div>
        )}
        {hasDevice && (
          <>
            <fieldset className="nt-set">
              <legend className="pa-sec">What to send</legend>
              <label className="pa-check">
                <input
                  type="checkbox"
                  checked={prefs.weekly.enabled}
                  disabled={busy}
                  onChange={(e) => toggleWeekly(e.target.checked)}
                />
                <span>
                  Weekly inspiration
                  <span className="nt-hint">One idea a week, at the time you choose.</span>
                </span>
              </label>
              <label className="pa-check">
                <input
                  type="checkbox"
                  checked={prefs.planned.enabled}
                  disabled={busy}
                  onChange={(e) => void save({ ...prefs, planned: { enabled: e.target.checked } })}
                />
                <span>
                  Planned adventure reminders
                  <span className="nt-hint">Only for adventures you schedule yourself.</span>
                </span>
              </label>
              <label className="pa-check">
                <input
                  type="checkbox"
                  checked={prefs.seasonal.enabled}
                  disabled={busy}
                  onChange={(e) => void save({ ...prefs, seasonal: { enabled: e.target.checked } })}
                />
                <span>
                  Seasonal inspiration
                  <span className="nt-hint">A rare note when the season changes.</span>
                </span>
              </label>
              <SavedReminderToggle
                on={prefs.saved.enabled}
                busy={busy}
                onChange={(on) => void save({ ...prefs, saved: { enabled: on } })}
              />
            </fieldset>

            <fieldset className="nt-set">
              <legend className="pa-sec">When</legend>
              <div className="nt-grid">
                <label className="pa-field">
                  <span>Weekly day</span>
                  <select
                    className="pd-select"
                    value={draft.weekly.day}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        weekly: { ...draft.weekly, day: Number(e.target.value) },
                      })
                    }
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="pa-field">
                  <span>Weekly time</span>
                  <input
                    type="time"
                    value={draft.weekly.time}
                    onChange={(e) =>
                      setDraft({ ...draft, weekly: { ...draft.weekly, time: e.target.value } })
                    }
                  />
                </label>
                <label className="pa-field">
                  <span>Time zone</span>
                  <select
                    className="pd-select"
                    value={draft.weekly.tz}
                    onChange={(e) =>
                      setDraft({ ...draft, weekly: { ...draft.weekly, tz: e.target.value } })
                    }
                  >
                    {zones(draft.weekly.tz).map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="pa-field">
                  <span>Quiet hours start</span>
                  <input
                    type="time"
                    value={draft.quiet.start}
                    onChange={(e) =>
                      setDraft({ ...draft, quiet: { ...draft.quiet, start: e.target.value } })
                    }
                  />
                </label>
                <label className="pa-field">
                  <span>Quiet hours end</span>
                  <input
                    type="time"
                    value={draft.quiet.end}
                    onChange={(e) =>
                      setDraft({ ...draft, quiet: { ...draft.quiet, end: e.target.value } })
                    }
                  />
                </label>
              </div>
              <p className="pa-fine">Nothing is sent during quiet hours.</p>
              <button
                type="button"
                className="pp-btn pp-btn-secondary"
                disabled={busy || !dirty}
                onClick={() => void save(draft, "Your times are saved.")}
              >
                Save times
              </button>
            </fieldset>

            <div>
              <p className="pa-sec">Your devices</p>
              <ul className="nt-devices">
                {devices.map((d) => (
                  <li key={d.deviceId}>
                    <span>
                      {d.label}
                      {d.deviceId === localId ? " (this device)" : ""}
                      {d.primary ? " · gets weekly ideas" : ""}
                    </span>
                    <span className="pa-row">
                      {!d.primary && (
                        <button
                          type="button"
                          className="pp-btn pp-btn-ghost"
                          disabled={busy}
                          onClick={() => void makePrimary(d.deviceId)}
                        >
                          Use for weekly ideas
                        </button>
                      )}
                      <button
                        type="button"
                        className="pp-btn pp-btn-ghost"
                        disabled={busy}
                        onClick={() => void removeDevice(d.deviceId)}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              {!thisDevice && perm !== "denied" && (
                <p className="pa-fine">
                  This device isn't on the list. Use the button above to add it.
                </p>
              )}
            </div>

            <div className="pa-row">
              {thisDevice && (
                <button
                  type="button"
                  className="pp-btn pp-btn-secondary"
                  disabled={busy}
                  onClick={() => void offHere()}
                >
                  Turn off on this device
                </button>
              )}
              <button
                type="button"
                className="pp-btn pp-btn-secondary"
                disabled={busy}
                onClick={() => void offEverywhere()}
              >
                Turn off all notifications
              </button>
            </div>
          </>
        )}
      </>
    );

  return (
    <section className="pa-panel nt-panel" aria-labelledby="nt-h">
      <h2 id="nt-h" className="pa-h">
        Reminders
      </h2>
      {body}
      <p className="pa-fine" role="status" aria-live="polite">
        {msg}
      </p>
    </section>
  );
}
