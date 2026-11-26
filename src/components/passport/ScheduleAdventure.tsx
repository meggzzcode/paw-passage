// Plan an adventure: pick a date and time, get a calendar file, and (for paying customers who turned them on) a
// Paws & Passage reminder. Scheduling again edits the same plan, so reminders never duplicate.
import { useId, useState } from "react";
import { site } from "@/config/site";
import type { Adventure } from "@/passport/schema";
import { useEntitlement } from "@/passport/useEntitlement";
import { track } from "@/passport/events";
import { buildPlanIcs, REMIND_LABEL } from "@/passport/ics";
import { downloadBlob } from "@/passport/keepsake/render";
import { detectPushSupport, permissionState } from "@/lib/push-support";
import { deviceTz, getLocalDeviceId, putPlan, type Plan, type Remind } from "@/lib/notifications";
import { livePlanFor, savePlan, usePlans } from "@/lib/plans";

export const CALENDAR_NOTE =
  "A calendar file is a copy. If you change or cancel this plan later, edit or delete the event in your calendar too.";

const pad = (n: number) => String(n).padStart(2, "0");
export const dateInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const timeInput = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function exportPlanFile(plan: Plan, title: string) {
  const ics = buildPlanIcs(plan, { title, siteUrl: site.siteUrl });
  downloadBlob(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
    "paws-and-passage-adventure.ics",
  );
  track("calendar_event_exported");
}

export function ScheduleAdventure({ a }: { a: Adventure }) {
  const { status } = useEntitlement();
  const entitled = status === "entitled";
  const plans = usePlans();
  const existing = livePlanFor(a.id, plans);
  const [open, setOpen] = useState(false);
  const id = useId();
  const defStart = existing ? new Date(existing.startAt) : tomorrowMorning();
  const [date, setDate] = useState(dateInput(defStart));
  const [time, setTime] = useState(timeInput(defStart));
  const [dur, setDur] = useState(existing?.durationMin ?? defaultDuration(a));
  const [remind, setRemind] = useState<Remind>(existing?.remind ?? "1h");
  const [file, setFile] = useState(true);
  const [push, setPush] = useState(existing?.push ?? false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const canPush =
    entitled &&
    detectPushSupport() === "supported" &&
    permissionState() === "granted" &&
    getLocalDeviceId() !== null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const start = new Date(`${date}T${time}`);
    if (Number.isNaN(start.getTime())) return setNote("Please choose a date and a time.");
    const wantPush = push && canPush;
    if (!file && !wantPush) return setNote("Choose a calendar file, a reminder, or both.");
    if (wantPush && start.getTime() <= Date.now())
      return setNote("A reminder needs a time in the future.");
    const r: Remind = wantPush && remind === "none" ? "at" : remind;
    setBusy(true);
    const plan = savePlan({
      adventureId: a.id,
      startAt: start.toISOString(),
      tz: deviceTz(),
      durationMin: Math.min(1440, Math.max(5, Math.round(dur) || 30)),
      remind: r,
      push: wantPush,
    });
    if (!plan) {
      setBusy(false);
      return setNote("You have a lot of plans on the go. Finish or cancel one to add another.");
    }
    track("adventure_scheduled");
    const parts: string[] = [existing ? "Plan updated." : "Planned."];
    if (entitled && wantPush) {
      const res = await putPlan(plan);
      parts.push(
        res.ok
          ? "We'll send a reminder."
          : "Saved on this device, but we couldn't set up the reminder just now. You can edit the plan in Upcoming adventures to try again.",
      );
    }
    if (file) {
      exportPlanFile(plan, a.title);
      parts.push("Your calendar file was downloaded.");
    }
    setNote(parts.join(" "));
    setBusy(false);
  }

  return (
    <div className="nt-sched">
      <button
        type="button"
        className="pp-btn pp-btn-ghost"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {entitled ? (existing ? "Reschedule adventure" : "Schedule adventure") : "Add to calendar"}
      </button>
      {open && (
        <form
          id={id}
          className="nt-form"
          onSubmit={(e) => void submit(e)}
          aria-label={`Plan ${a.title}`}
        >
          <div className="nt-grid">
            <label className="pa-field">
              <span>Date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label className="pa-field">
              <span>Time</span>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </label>
            <label className="pa-field">
              <span>Minutes</span>
              <input
                type="number"
                min={5}
                max={1440}
                step={5}
                value={dur}
                onChange={(e) => setDur(Number(e.target.value))}
              />
            </label>
            <label className="pa-field">
              <span>Reminder</span>
              <select
                className="pd-select"
                value={remind}
                onChange={(e) => setRemind(e.target.value as Remind)}
              >
                {(Object.keys(REMIND_LABEL) as Remind[]).map((k) => (
                  <option key={k} value={k}>
                    {REMIND_LABEL[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="pa-check">
            <input type="checkbox" checked={file} onChange={(e) => setFile(e.target.checked)} />
            <span>Calendar file (.ics)</span>
          </label>
          {canPush && (
            <label className="pa-check">
              <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} />
              <span>
                Paws &amp; Passage reminder
                <span className="nt-hint">
                  Also needs “Planned adventure reminders” switched on in My Passport.
                </span>
              </span>
            </label>
          )}
          <p className="pa-fine">{CALENDAR_NOTE}</p>
          <div className="pa-row">
            <button type="submit" className="pp-btn pp-btn-primary" disabled={busy}>
              {existing ? "Save changes" : "Save plan"}
            </button>
          </div>
        </form>
      )}
      <p className="pa-fine" aria-live="polite">
        {note}
      </p>
    </div>
  );
}

function tomorrowMorning(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d;
}
function defaultDuration(a: Adventure): number {
  return Math.max(15, Math.round(((a.minutesMin + a.minutesMax) / 2 || 30) / 5) * 5);
}
