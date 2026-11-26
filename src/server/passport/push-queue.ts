// Which bucket entries a record needs. Shared by the API (which enqueues after an edit) and the delivery run (which
// reschedules after a send). Pure helpers plus two enqueue functions.
import type { BucketEntry, NotifRecord, Plan, PushStore } from "./push-store";
import {
  nextSlotAfter,
  nextWeeklyOccurrence,
  plannedReminderDueMs,
  SLOT_MS,
  slotOf,
  slotStart,
} from "./schedule";

export const generalActive = (r: NotifRecord): boolean =>
  r.devices.length > 0 &&
  (r.prefs.weekly.enabled || r.prefs.saved.enabled || r.prefs.seasonal.enabled);

export const generalSig = (r: NotifRecord): string =>
  `${r.prefs.weekly.day}|${r.prefs.weekly.time}|${r.prefs.weekly.tz}`;

/** Next general occurrence after `after`: its slot (never earlier than the chosen time) and the exact instant. */
export function planGeneral(r: NotifRecord, after: number): { slot: number; base: number } {
  const w = r.prefs.weekly;
  const base = nextWeeklyOccurrence(w.day, w.time, w.tz, after);
  return { slot: Math.ceil(base / SLOT_MS), base };
}

/** Makes `gnext` match the prefs and devices. Returns the record unchanged when it already does. */
export function reconcileGeneral(r: NotifRecord, now: number): NotifRecord {
  if (!generalActive(r)) {
    if (r.gnext === undefined) return r;
    const { gnext: _a, gbase: _b, gsig: _c, ...rest } = r;
    return rest;
  }
  if (r.gnext !== undefined && r.gsig === generalSig(r)) return r;
  const g = planGeneral(r, now);
  return { ...r, gnext: g.slot, gbase: g.base, gsig: generalSig(r) };
}

/** Where a plan's reminder belongs, or null when it should not fire. */
export function planReminder(plan: Plan, now: number): { slot: number; at: number } | null {
  if (plan.status !== "planned" || !plan.push || plan.remind === "none") return null;
  const start = Date.parse(plan.startAt);
  if (!Number.isFinite(start) || start <= now) return null;
  const at = plannedReminderDueMs(start, plan.tz, plan.remind);
  if (at === null) return null;
  // Delivered at the 15-minute run at or just before the due time, never after the start.
  const slot = Math.max(slotOf(at), nextSlotAfter(now));
  if (slotStart(slot) > start) return null;
  return { slot, at };
}

export async function enqueueGeneral(store: PushStore, cus: string, r: NotifRecord): Promise<void> {
  if (r.gnext === undefined || !generalActive(r)) return;
  const e: BucketEntry = { c: cus, k: "g", r: String(r.gnext) };
  await store.addToBucket(r.gnext, e);
}

export async function enqueuePlan(
  store: PushStore,
  cus: string,
  plan: Plan,
  now: number,
): Promise<void> {
  const p = planReminder(plan, now);
  if (!p) return;
  await store.addToBucket(p.slot, { c: cus, k: "p", r: plan.id, at: p.at });
}
