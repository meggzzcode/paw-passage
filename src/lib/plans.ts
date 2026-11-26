// Planned adventures, kept on this device (its own localStorage key; progress saves are untouched).
// One live plan per adventure: scheduling again edits the same plan, so reminders never duplicate.
import { useSyncExternalStore } from "react";
import {
  getPlans as fetchRemotePlans,
  newPlanId,
  putPlan,
  type ApiResult,
  type Plan,
  type Remind,
} from "@/lib/notifications";

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
/**
 * Merges plans from the server: the newer updatedAt wins per id; nothing local is dropped, and an equal timestamp keeps
 * the local copy. Writes (and notifies) only when something actually changed.
 */
export function mergePlans(remote: Plan[]) {
  const byId = new Map(getPlans().map((p) => [p.id, p]));
  let changed = false;
  for (const r of remote) {
    const l = byId.get(r.id);
    if (!l || r.updatedAt > l.updatedAt) {
      byId.set(r.id, r);
      changed = true;
    }
  }
  if (changed) write([...byId.values()]);
}

export type PlanSyncDeps = {
  fetchRemote: () => Promise<ApiResult<Plan[]>>;
  put: (plan: Plan) => Promise<ApiResult<Plan>>;
};
let syncing: Promise<boolean> | null = null;
export const planSyncBusy = (): boolean => syncing !== null;

/**
 * Keeps an entitled customer's plans in step with the server, whether or not reminders (push) are on. Local first:
 * plans are always saved here before anything is sent. Order matters: PULL and merge first, then push only plans the
 * server lacks or holds an older copy of. An empty or fresh device therefore pushes nothing and can never delete or
 * overwrite a remote plan. Cancelled and done plans are sent as status changes (tombstones), never as deletes, so other
 * devices learn about them. Returns false when the server could not be reached (nothing is lost; the next run retries).
 */
export function syncPlans(
  deps: PlanSyncDeps = { fetchRemote: fetchRemotePlans, put: putPlan },
): Promise<boolean> {
  if (syncing) return syncing;
  syncing = (async () => {
    const r = await deps.fetchRemote();
    if (!r.ok) return false; // never push without having pulled
    mergePlans(r.data);
    const remote = new Map(r.data.map((p) => [p.id, p]));
    let all = true;
    for (const p of getPlans()) {
      const rem = remote.get(p.id);
      const needs = rem ? p.updatedAt > rem.updatedAt : isLive(p);
      if (!needs) continue;
      const res = await deps.put(p);
      if (res.ok) mergePlans([res.data]);
      else all = false;
    }
    return all;
  })().finally(() => {
    syncing = null;
  });
  return syncing;
}

/** Sends one plan change right away (entitled customers). Failures are retried by the next syncPlans run. */
export async function pushPlan(
  plan: Plan,
  deps: Pick<PlanSyncDeps, "put"> = { put: putPlan },
): Promise<boolean> {
  const res = await deps.put(plan);
  if (res.ok) mergePlans([res.data]);
  return res.ok;
}
