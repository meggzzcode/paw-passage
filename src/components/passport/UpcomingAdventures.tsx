// Planned adventures: edit the date and time, cancel, or mark one done. Changes also reach pending reminders.
import { useEffect, useRef, useState } from "react";
import { useEntitlement } from "@/passport/useEntitlement";
import { usePassport } from "@/passport/usePassport";
import { completeAdventure } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { track } from "@/passport/events";
import { useAdventureLibrary } from "./collections-shared";
import type { Plan } from "@/lib/notifications";
import { isLive, pushPlan, savePlan, setPlanStatus, syncPlans, usePlans } from "@/lib/plans";
import { CALENDAR_NOTE, dateInput, exportPlanFile, timeInput } from "./ScheduleAdventure";

function when(p: Plan): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: p.tz,
    }).format(new Date(p.startAt));
  } catch {
    return new Date(p.startAt).toLocaleString("en-US");
  }
}

export function UpcomingAdventures({
  focus = false,
  planId,
}: {
  focus?: boolean;
  planId?: string | undefined;
}) {
  const { status } = useEntitlement();
  const entitled = status === "entitled";
  const { save } = usePassport();
  const { all: lib } = useAdventureLibrary();
  const plans = usePlans()
    .filter(isLive)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  const [editing, setEditing] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [msg, setMsg] = useState("");
  const root = useRef<HTMLElement>(null);

  // A paying customer opening this list may refresh it from the server. Free visitors make no request.
  useEffect(() => {
    if (!entitled) return;
    void syncPlans(); // pull and merge first, then push anything the server lacks
  }, [entitled]);
  useEffect(() => {
    if (focus) root.current?.scrollIntoView?.({ block: "start" });
  }, [focus]);

  if (plans.length === 0 && !focus) return null;
  const title = (p: Plan) => lib.find((a) => a.id === p.adventureId)?.title ?? "An adventure";

  /** Every change (edit, cancel, done) is sent as the plan's new state, so other devices see the tombstone. */
  async function remote(p: Plan) {
    if (!entitled) return true;
    return pushPlan(p);
  }
  async function saveEdit(p: Plan) {
    const start = new Date(`${date}T${time}`);
    if (Number.isNaN(start.getTime())) return setMsg("Please choose a date and a time.");
    const next = savePlan({ ...p, startAt: start.toISOString() });
    if (!next) return;
    setEditing(null);
    const ok = await remote(next);
    setMsg(
      (ok ? "Plan updated." : "Updated on this device; we couldn't update the reminder just now.") +
        " If you saved a calendar file, edit or delete that event in your calendar too.",
    );
  }
  async function cancel(p: Plan) {
    const next = setPlanStatus(p.id, "cancelled");
    const ok = next ? await remote(next) : true;
    setMsg(
      (ok ? "Plan cancelled." : "Cancelled here; we couldn't clear the reminder just now.") +
        " If you saved a calendar file, delete that event in your calendar too.",
    );
  }
  async function done(p: Plan) {
    if (!has(save.done, p.adventureId)) completeAdventure(p.adventureId);
    const next = setPlanStatus(p.id, "done");
    track("scheduled_adventure_completed");
    if (next) await remote(next);
    setMsg("Marked done and added to your passport.");
  }

  return (
    <section className="pa-panel" id="upcoming" aria-labelledby="up-h" ref={root}>
      <h2 id="up-h" className="pa-h">
        Upcoming adventures
      </h2>
      {plans.length === 0 ? (
        <p className="pa-fine">
          Nothing planned yet. Use “Schedule adventure” on any adventure you've revealed.
        </p>
      ) : (
        <ul className="nt-plans">
          {plans.map((p) => (
            <li key={p.id} className={p.id === planId ? "nt-plan nt-plan-focus" : "nt-plan"}>
              <p className="pa-title nt-plan-t">{title(p)}</p>
              <p className="pa-fine">
                {when(p)} · {p.durationMin} min
              </p>
              {editing === p.id ? (
                <div className="nt-form">
                  <div className="nt-grid">
                    <label className="pa-field">
                      <span>Date</span>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </label>
                    <label className="pa-field">
                      <span>Time</span>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </label>
                  </div>
                  <div className="pa-row">
                    <button
                      type="button"
                      className="pp-btn pp-btn-primary"
                      onClick={() => void saveEdit(p)}
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="pp-btn pp-btn-ghost"
                      onClick={() => setEditing(null)}
                    >
                      Never mind
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pa-row">
                  <button
                    type="button"
                    className="pp-btn pp-btn-secondary"
                    aria-label={`Edit date and time for ${title(p)}`}
                    onClick={() => {
                      const d = new Date(p.startAt);
                      setDate(dateInput(d));
                      setTime(timeInput(d));
                      setEditing(p.id);
                    }}
                  >
                    Edit date and time
                  </button>
                  <button
                    type="button"
                    className="pp-btn pp-btn-secondary"
                    aria-label={`Mark ${title(p)} done`}
                    onClick={() => void done(p)}
                  >
                    Mark done
                  </button>
                  <button
                    type="button"
                    className="pp-btn pp-btn-ghost"
                    aria-label={`Calendar file for ${title(p)}`}
                    onClick={() => exportPlanFile(p, title(p))}
                  >
                    Calendar file
                  </button>
                  <button
                    type="button"
                    className="pp-btn pp-btn-ghost"
                    aria-label={`Cancel plan for ${title(p)}`}
                    onClick={() => void cancel(p)}
                  >
                    Cancel plan
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="pa-fine">{CALENDAR_NOTE}</p>
      <p className="pa-fine" role="status" aria-live="polite">
        {msg}
      </p>
    </section>
  );
}
