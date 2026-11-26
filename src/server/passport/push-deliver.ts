// Scheduled delivery. Runs every 15 minutes (netlify/functions/push-deliver.ts). It reads only the due buckets from the
// cursor to now (one small blob per 15-minute slot), never lists customers and never scans. Work per run is bounded.
// Rules: kill switch first; entitlement checked before every send; a delivery marker is written BEFORE the send, so a
// repeated or overlapping run can never send twice (at most once, best effort); stale items are never retried; a push
// service answer of 404 or 410 removes that device; nothing here logs an endpoint, a key or a payload.
import {
  buildPlanned,
  buildSaved,
  buildSeasonal,
  buildWeekly,
  serializePayload,
  type NotifPayload,
} from "./notifications-copy";
import type { KV } from "./kv";
import { enqueueGeneral, generalActive, planGeneral, reconcileGeneral } from "./push-queue";
import type { PushSender } from "./push-sender";
import {
  entryKey,
  openSub,
  primaryDevice,
  PushStore,
  type BucketEntry,
  type Device,
  type NotifRecord,
} from "./push-store";
import {
  inQuietHours,
  isoWeekId,
  inSeasonStartWeek,
  nextSlotAfter,
  plannedReminderDueMs,
  quietEndAfter,
  seasonFor,
  SLOT_MS,
  slotOf,
  slotStart,
  weekIndex,
} from "./schedule";
import { CustomerStore } from "./store";

export const LIMITS = {
  /** Slots read per run (96 = one day of catch-up). */
  maxSlots: 96,
  /** Entries handled per run. */
  maxEntries: 150,
  chunk: 8,
  /** The Netlify limit is 30 s; stop starting work after this. */
  budgetMs: 20_000,
  /** A bucket older than this is stale: nothing is sent from it, chains are only rescheduled. */
  staleMs: 2 * 60 * 60 * 1000,
  /** A quiet-hours delay longer than this skips the send instead. */
  maxQuietDeferMs: 6 * 60 * 60 * 1000,
};

export type DeliverDeps = {
  customers: KV;
  dataKey: string;
  sender: PushSender;
  /** Kill switch: false means do nothing at all. Evaluated first, on every run. */
  enabled: () => Promise<boolean> | boolean;
  now?: () => number;
  log?: (event: string, fields?: Record<string, string | number | boolean>) => void;
};

export type RunStats = {
  disabled: boolean;
  slots: number;
  entries: number;
  accepted: number;
  pruned: number;
  failed: number;
  skipped: number;
  deferred: number;
  stale: number;
  errors: number;
};

type Outcome = "accepted" | "skipped" | "deferred" | "stale" | "failed";

export async function runDelivery(deps: DeliverDeps): Promise<RunStats> {
  const now = deps.now ?? Date.now;
  const log = deps.log ?? (() => undefined);
  const stats: RunStats = {
    disabled: false,
    slots: 0,
    entries: 0,
    accepted: 0,
    pruned: 0,
    failed: 0,
    skipped: 0,
    deferred: 0,
    stale: 0,
    errors: 0,
  };
  if (!(await deps.enabled())) {
    stats.disabled = true;
    log("push_run_disabled");
    return stats;
  }
  const pstore = new PushStore(deps.customers, now);
  const cstore = new CustomerStore(deps.customers, now);
  const started = Date.now();
  const t0 = now();
  const nowSlot = slotOf(t0);
  let cursor = (await pstore.readCursor()) ?? nowSlot;
  if (cursor > nowSlot + 1) cursor = nowSlot; // a clock or data oddity: never wait for the future

  async function entitled(cus: string): Promise<boolean> {
    const c = await cstore.get(cus);
    if (!c || c.rec.entitlement.status !== "active") {
      await pstore.purge(cus); // revoked, refunded or deleted: remove everything
      return false;
    }
    return true;
  }

  async function sendTo(
    cus: string,
    rec: NotifRecord,
    devices: Device[],
    payload: NotifPayload,
    ttl: number,
    urgency: "low" | "normal",
  ): Promise<Outcome> {
    const body = serializePayload(payload);
    let accepted = false;
    const gone: string[] = [];
    for (const d of devices) {
      const sub = openSub(deps.dataKey, d);
      if (!sub) {
        gone.push(d.id); // unreadable (key changed or damaged): it can never be used
        continue;
      }
      try {
        const r = await deps.sender(sub, body, { ttl, urgency });
        if (r.status >= 200 && r.status < 300) {
          accepted = true;
          stats.accepted++;
        } else if (r.status === 404 || r.status === 410) {
          gone.push(d.id);
        } else {
          stats.failed++; // no retry: a transient failure is not worth a late notification
        }
      } catch {
        stats.failed++;
      }
    }
    if (gone.length > 0) {
      stats.pruned += gone.length;
      await pstore.mutate(cus, (r) => {
        const devs = r.devices.filter((d) => !gone.includes(d.id));
        const next: NotifRecord = { ...r, devices: devs };
        if (!devs.some((d) => d.id === r.primary)) {
          const first = devs[0];
          if (first) next.primary = first.id;
          else delete next.primary;
        }
        return reconcileGeneral(next, now());
      });
    }
    void rec;
    return accepted ? "accepted" : "failed";
  }

  // Next-week entries are collected and written once per slot after each chunk, instead of one write per customer.
  const pending = new Map<number, BucketEntry[]>();
  function queueNext(cus: string, r: NotifRecord) {
    if (r.gnext === undefined || !generalActive(r)) return;
    const list = pending.get(r.gnext) ?? [];
    list.push({ c: cus, k: "g", r: String(r.gnext) });
    pending.set(r.gnext, list);
  }
  async function flushPending() {
    const all = [...pending.entries()];
    pending.clear();
    for (const [slot, list] of all) await pstore.addManyToBucket(slot, list);
  }

  /** Reschedules the general chain only (used for stale buckets). */
  async function rescheduleGeneral(cus: string, slot: number): Promise<void> {
    await pstore.mutate(cus, (r) => {
      if (r.gnext !== slot) return null;
      if (!generalActive(r)) return reconcileGeneral({ ...r }, t0);
      const g = planGeneral(r, t0);
      return { ...r, gnext: g.slot, gbase: g.base };
    });
    const after = await pstore.get(cus);
    if (after) await enqueueGeneral(pstore, cus, after);
  }

  async function doGeneral(cus: string, slot: number, stale: boolean): Promise<Outcome> {
    const rec0 = await pstore.get(cus);
    if (!rec0 || rec0.gnext !== slot) return "skipped"; // obsolete entry
    if (!(await entitled(cus))) return "skipped";
    if (!generalActive(rec0)) {
      await pstore.mutate(cus, (r) => (r.gnext === slot ? reconcileGeneral(r, t0) : null));
      return "skipped";
    }
    if (stale) {
      await rescheduleGeneral(cus, slot);
      return "stale";
    }
    const tz = rec0.prefs.weekly.tz;
    const base = rec0.gbase ?? slotStart(slot);

    let quietSkip = false;
    if (inQuietHours(t0, tz, rec0.prefs.quiet)) {
      quietSkip = true; // unless a short delay below is possible
      const qe = quietEndAfter(t0, tz, rec0.prefs.quiet);
      if (qe - t0 <= LIMITS.maxQuietDeferMs) {
        const target = Math.max(Math.ceil(qe / SLOT_MS), nextSlotAfter(t0));
        let moved = false;
        await pstore.mutate(cus, (r) => {
          moved = r.gnext === slot;
          return moved ? { ...r, gnext: target } : null;
        });
        if (moved) await pstore.addToBucket(target, { c: cus, k: "g", r: String(target) });
        return "deferred";
      }
    }

    const week = isoWeekId(t0, tz);
    const kind = quietSkip ? null : pickGeneral(rec0, cus, t0);
    let claimed = false;
    const after = await pstore.mutate(cus, (r) => {
      claimed = false;
      if (r.gnext !== slot || !generalActive(r)) return null;
      const g = planGeneral(r, Math.max(t0, base));
      const next: NotifRecord = { ...r, gnext: g.slot, gbase: g.base };
      if (kind && r.sent[`g:${week}`] === undefined) {
        claimed = true;
        next.sent = { ...r.sent, [`g:${week}`]: t0 };
      }
      return next;
    });
    if (!after) return "skipped";
    queueNext(cus, after); // the chain continues even when nothing is sent this week
    if (!claimed || !kind) return "skipped";
    const dev = primaryDevice(after);
    if (!dev) return "skipped";
    const payload =
      kind === "seasonal"
        ? buildSeasonal(seasonFor(t0, tz), week)
        : kind === "saved"
          ? buildSaved(week)
          : buildWeekly(week);
    return sendTo(cus, after, [dev], payload, 6 * 3600, "low");
  }

  async function doPlanned(
    cus: string,
    planId: string,
    at: number,
    slot: number,
    stale: boolean,
  ): Promise<Outcome> {
    if (stale) return "stale"; // a reminder that is more than two hours late is dropped, not retried
    const rec0 = await pstore.get(cus);
    const plan = rec0?.plans.find((p) => p.id === planId);
    if (!rec0 || !plan || !rec0.prefs.planned.enabled || rec0.devices.length === 0)
      return "skipped";
    const start = Date.parse(plan.startAt);
    const due = plannedReminderDueMs(start, plan.tz, plan.remind);
    if (plan.status !== "planned" || !plan.push || due !== at || start <= t0) return "skipped";
    const remind = plan.remind as "at" | "1h" | "1d";
    if (!(await entitled(cus))) return "skipped";
    if (inQuietHours(t0, plan.tz, rec0.prefs.quiet)) {
      const qe = quietEndAfter(t0, plan.tz, rec0.prefs.quiet);
      const target = Math.max(Math.ceil(qe / SLOT_MS), nextSlotAfter(t0));
      if (slotStart(target) < start && qe - t0 <= LIMITS.maxQuietDeferMs) {
        await pstore.addToBucket(target, { c: cus, k: "p", r: planId, at });
        return "deferred";
      }
      return "skipped";
    }
    const mark = `p:${planId}:${at}`;
    let claimed = false;
    const after = await pstore.mutate(cus, (r) => {
      claimed = false;
      const p = r.plans.find((x) => x.id === planId);
      if (!p || p.status !== "planned" || r.sent[mark] !== undefined) return null;
      claimed = true;
      return { ...r, sent: { ...r.sent, [mark]: t0 } };
    });
    if (!after || !claimed) return "skipped";
    void slot;
    const ttl = Math.max(60, Math.min(3600, Math.floor((start - t0) / 1000)));
    return sendTo(cus, after, after.devices, buildPlanned(planId, remind), ttl, "normal");
  }

  async function handle(e: BucketEntry, slot: number, stale: boolean): Promise<Outcome> {
    try {
      if (e.k === "g") return await doGeneral(e.c, slot, stale);
      return await doPlanned(e.c, e.r, e.at ?? 0, slot, stale);
    } catch (err) {
      stats.errors++;
      log("push_entry_error", { name: err instanceof Error ? err.name : "unknown" });
      try {
        const r = await pstore.get(e.c);
        if (e.k === "g" && r && r.gnext !== undefined && r.gnext <= slot) {
          // keep the weekly chain alive: try again at the next run, once
          const target = nextSlotAfter(t0);
          await pstore.mutate(e.c, (x) => (x.gnext === r.gnext ? { ...x, gnext: target } : null));
          await pstore.addToBucket(target, { c: e.c, k: "g", r: String(target) });
        }
      } catch {
        /* the chain is rebuilt the next time the customer changes their settings */
      }
      return "failed";
    }
  }

  let slot = cursor;
  let budget = LIMITS.maxEntries;
  let advanced = cursor;
  for (; slot <= nowSlot && stats.slots < LIMITS.maxSlots; slot++) {
    if (Date.now() - started > LIMITS.budgetMs) break;
    stats.slots++;
    const entries = await pstore.readBucket(slot);
    if (entries.length === 0) {
      advanced = slot + 1;
      continue;
    }
    const stale = t0 - slotStart(slot) > LIMITS.staleMs;
    const take = entries.slice(0, Math.max(0, budget));
    const done = new Set<string>();
    for (let i = 0; i < take.length; i += LIMITS.chunk) {
      if (Date.now() - started > LIMITS.budgetMs) break;
      const part = take.slice(i, i + LIMITS.chunk);
      const res = await Promise.all(part.map((e) => handle(e, slot, stale)));
      await flushPending();
      part.forEach((e, j) => {
        done.add(entryKey(e));
        stats.entries++;
        budget--;
        const o = res[j];
        if (o === "skipped") stats.skipped++;
        else if (o === "deferred") stats.deferred++;
        else if (o === "stale") stats.stale++;
      });
    }
    if (done.size > 0) await pstore.removeFromBucket(slot, done);
    if (done.size < entries.length) break; // budget left over: finish this slot next run
    advanced = slot + 1;
  }
  if (advanced !== cursor) await pstore.writeCursor(advanced);
  log("push_run", {
    slots: stats.slots,
    entries: stats.entries,
    accepted: stats.accepted,
    pruned: stats.pruned,
    failed: stats.failed,
    skipped: stats.skipped,
    deferred: stats.deferred,
    stale: stats.stale,
    errors: stats.errors,
  });
  return stats;
}

/** Which one general notification (if any) this customer gets this week. Seasonal, then saved, then weekly. */
export function pickGeneral(
  rec: NotifRecord,
  cus: string,
  ms: number,
): "seasonal" | "saved" | "weekly" | null {
  const tz = rec.prefs.weekly.tz;
  if (rec.prefs.seasonal.enabled && inSeasonStartWeek(ms, tz)) return "seasonal";
  if (rec.prefs.saved.enabled) {
    const salt = parseInt(cus.slice(-2), 16) % 4 || 0;
    if ((weekIndex(ms, tz) + salt) % 4 === 0) return "saved";
  }
  if (rec.prefs.weekly.enabled) return "weekly";
  return null;
}
