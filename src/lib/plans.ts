// Planned adventures, kept on this device (its own localStorage key; progress saves are untouched).
// One live plan per adventure: scheduling again edits the same plan, so reminders never duplicate.
import { useSyncExternalStore } from "react";
import { newPlanId, type Plan, type Remind } from "@/lib/notifications";

export const PLANS_KEY = "pp.plans.v1";
const MAX_PLANS = 50;
let cache: Plan[] | null = null;
const listeners = new Set<() => void>();

function load(): Plan[] {
  try {
    const raw = window.localStorage.getItem(PLANS_KEY);
    const v: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(v)
      ? (v as Plan[]).filter(
          (p) => p && typeof p.id === "string" && typeof p.adventureId === "string" && !!p.startAt,
        )
      : [];
  } catch {
    return [];
  }
}
export function getPlans(): Plan[] {
  return (cache ??= typeof window === "undefined" ? [] : load());
}
function write(next: Plan[]) {
  cache = next;
  try {
    window.localStorage.setItem(PLANS_KEY, JSON.stringify(next));
  } catch {
    /* blocked storage: plans last for this page view */
  }
  listeners.forEach((l) => l());
}
export function subscribePlans(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export const usePlans = (): Plan[] => useSyncExternalStore(subscribePlans, getPlans, () => []);
export const _resetPlansForTests = () => {
  cache = null;
  try {
    window.localStorage.removeItem(PLANS_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};

export const isLive = (p: Plan) => p.status === "planned";
export const livePlanFor = (adventureId: string, plans = getPlans()): Plan | undefined =>
  plans.find((p) => p.adventureId === adventureId && isLive(p));

export type PlanInput = {
  adventureId: string;
  startAt: string;
  tz: string;
  durationMin: number;
  remind: Remind;
  push: boolean;
};

/** Creates the plan, or edits the existing live plan for this adventure (same id, same UID in the calendar file). */
export function savePlan(input: PlanInput, now = Date.now()): Plan | null {
  const all = getPlans();
  const existing = livePlanFor(input.adventureId, all);
  if (!existing && all.filter(isLive).length >= MAX_PLANS) return null;
  const plan: Plan = {
    ...input,
    id: existing?.id ?? newPlanId(),
    status: "planned",
    updatedAt: now,
  };
  write(existing ? all.map((p) => (p.id === existing.id ? plan : p)) : [...all, plan]);
  return plan;
}
export function setPlanStatus(id: string, status: Plan["status"], now = Date.now()): Plan | null {
  const all = getPlans();
  const p = all.find((x) => x.id === id);
  if (!p) return null;
  const next = { ...p, status, updatedAt: now };
  write(all.map((x) => (x.id === id ? next : x)));
  return next;
}
export function removePlan(id: string) {
  write(getPlans().filter((p) => p.id !== id));
}
/** Merges plans from the server: the newer updatedAt wins per id; nothing local is dropped. */
export function mergePlans(remote: Plan[]) {
  const byId = new Map(getPlans().map((p) => [p.id, p]));
  for (const r of remote) {
    const l = byId.get(r.id);
    if (!l || r.updatedAt > l.updatedAt) byId.set(r.id, r);
  }
  write([...byId.values()]);
}
