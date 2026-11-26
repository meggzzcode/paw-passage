// Notification data in the customers-<env> store (same environment isolation as customer records).
//   notif/<cus_id>   one record per customer: devices (sealed), prefs, plans, delivery markers, next general slot.
//   notifdue/<slot>  due-time bucket: entries due in one 15-minute slot (slot = floor(epoch ms / 900000)).
//   notifcursor      the first slot the scheduled function has not finished.
// The record is the source of truth; a bucket entry is only a hint that something may be due. An entry whose record
// no longer agrees (edited plan, changed prefs, opted out, deleted customer) is dropped when it comes due.
// No history is kept: delivery markers expire after 14 days and an opt-out, a delete or a revoke removes the record.
import { randomBytes } from "node:crypto";
import { deriveKey, hmac, open, seal } from "./crypto";
import type { KV } from "./kv";
import { isValidTz, type Quiet, type RemindKind } from "./schedule";

export const MAX_DEVICES = 5;
export const MAX_LIVE_PLANS = 50;
export const MAX_STORED_PLANS = 100;
export const MARKER_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_RETRIES = 6;
const BUCKET_RETRIES = 12;

export class PushConflictError extends Error {
  constructor() {
    super("too many write conflicts");
  }
}

export type PushSubscriptionJson = { endpoint: string; keys: { p256dh: string; auth: string } };
export type Device = {
  id: string;
  /** AES-GCM sealed JSON of the subscription. Never returned or logged. */
  sealed: string;
  /** HMAC of the endpoint, to recognize a repeat subscribe without opening the seal. */
  epHash: string;
  label: string;
  createdAt: number;
};

export type Prefs = {
  weekly: { enabled: boolean; day: number; time: string; tz: string };
  planned: { enabled: boolean };
  saved: { enabled: boolean };
  seasonal: { enabled: boolean };
  quiet: Quiet;
};
export type Plan = {
  id: string;
  adventureId: string;
  startAt: string;
  tz: string;
  durationMin: number;
  remind: RemindKind;
  push: boolean;
  status: "planned" | "done" | "cancelled";
  updatedAt: number;
};

export type NotifRecord = {
  v: 1;
  devices: Device[];
  primary?: string;
  tz: string;
  prefs: Prefs;
  plans: Plan[];
  /** Delivery markers: key -> epoch ms. Pruned after 14 days. */
  sent: Record<string, number>;
  /** Slot of the one pending general (weekly/saved/seasonal) entry, and the base occurrence it follows. */
  gnext?: number;
  gbase?: number;
  /** The weekly settings (day|time|tz) the pending general slot was computed from. */
  gsig?: string;
};

export const notifKey = (cus: string) => `notif/${cus}`;
export const bucketKey = (slot: number) => `notifdue/${slot}`;
export const CURSOR_KEY = "notifcursor";

export const defaultPrefs = (tz = "UTC"): Prefs => ({
  weekly: { enabled: false, day: 6, time: "09:00", tz },
  planned: { enabled: false },
  saved: { enabled: false },
  seasonal: { enabled: false },
  quiet: { start: "21:00", end: "08:00" },
});

export const emptyRecord = (): NotifRecord => ({
  v: 1,
  devices: [],
  tz: "UTC",
  prefs: defaultPrefs(),
  plans: [],
  sent: {},
});

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** Defensive read: a damaged record becomes an empty one rather than an error. */
export function parseRecord(v: unknown): NotifRecord {
  if (!isObj(v) || v["v"] !== 1) return emptyRecord();
  const r = v as unknown as NotifRecord;
  return {
    ...emptyRecord(),
    ...r,
    devices: Array.isArray(r.devices) ? r.devices : [],
    plans: Array.isArray(r.plans) ? r.plans : [],
    sent: isObj(r.sent) ? (r.sent as Record<string, number>) : {},
    prefs: isObj(r.prefs) ? { ...defaultPrefs(), ...r.prefs } : defaultPrefs(),
    tz: isValidTz(r.tz) ? r.tz : "UTC",
  };
}

export const newDeviceId = (): string => `dv-${randomBytes(6).toString("hex")}`;
export const DEVICE_ID_RE = /^dv-[0-9a-f]{12}$/;

export const sealSub = (dataKey: string, sub: PushSubscriptionJson): string =>
  seal(dataKey, JSON.stringify({ endpoint: sub.endpoint, keys: sub.keys }));
export function openSub(dataKey: string, d: Device): PushSubscriptionJson | null {
  const plain = open(dataKey, d.sealed);
  if (!plain) return null;
  try {
    const v = JSON.parse(plain) as PushSubscriptionJson;
    return typeof v.endpoint === "string" && v.keys ? v : null;
  } catch {
    return null;
  }
}
export const endpointHash = (dataKey: string, endpoint: string): string =>
  hmac(deriveKey(dataKey, "push-endpoint"), endpoint);

export const primaryDevice = (r: NotifRecord): Device | undefined =>
  r.devices.find((d) => d.id === r.primary) ?? r.devices[0];

export type BucketEntry = {
  c: string;
  /** "g" general (weekly, saved or seasonal) or "p" planned reminder. */
  k: "g" | "p";
  /** g: the slot number as a string. p: the plan id. */
  r: string;
  /** p: the reminder due time this entry was made for. */
  at?: number;
};
export const entryKey = (e: BucketEntry) => `${e.c}|${e.k}|${e.r}|${e.at ?? ""}`;

export class PushStore {
  constructor(
    private kv: KV,
    private now: () => number = Date.now,
  ) {}

  async get(cus: string): Promise<NotifRecord | null> {
    const r = await this.kv.get(notifKey(cus));
    return r ? parseRecord(r.value) : null;
  }

  /**
   * Read-modify-write with compare-and-set. `fn` must be pure (it is re-run on the fresh record after a lost race).
   * Returning null means "no change". Expired delivery markers are dropped on every write.
   */
  async mutate(
    cus: string,
    fn: (rec: NotifRecord) => NotifRecord | null,
    opts: { create?: boolean } = {},
  ): Promise<NotifRecord | null> {
    for (let i = 0; i < MAX_RETRIES; i++) {
      const cur = await this.kv.get(notifKey(cus));
      if (!cur && !opts.create) return null;
      const base = cur ? parseRecord(cur.value) : emptyRecord();
      const next = fn(base);
      if (!next) return base;
      const t = this.now();
      const sent: Record<string, number> = {};
      for (const [k, v] of Object.entries(next.sent))
        if (typeof v === "number" && t - v < MARKER_TTL_MS) sent[k] = v;
      const out: NotifRecord = { ...next, sent };
      const w = cur
        ? await this.kv.update(notifKey(cus), out, cur.etag)
        : await this.kv.create(notifKey(cus), out);
      if (w.ok) return out;
    }
    throw new PushConflictError();
  }

  async purge(cus: string): Promise<void> {
    await this.kv.delete(notifKey(cus));
  }

  async readBucket(slot: number): Promise<BucketEntry[]> {
    const r = await this.kv.get(bucketKey(slot));
    const v = r?.value;
    return Array.isArray(v) ? (v as BucketEntry[]) : [];
  }

  // Writers in this process queue per bucket, so a batch of customers sharing a weekly slot does not fight itself.
  private queues = new Map<number, Promise<unknown>>();
  private serial<T>(slot: number, fn: () => Promise<T>): Promise<T> {
    const prev = this.queues.get(slot) ?? Promise.resolve();
    const next = prev.then(fn, fn);
    this.queues.set(slot, next);
    void next.finally(() => {
      if (this.queues.get(slot) === next) this.queues.delete(slot);
    });
    return next;
  }

  /** Adds an entry to the slot's bucket (idempotent by entry key). */
  addToBucket(slot: number, entry: BucketEntry): Promise<void> {
    return this.addManyToBucket(slot, [entry]);
  }

  /** Adds entries in one write (idempotent by entry key). */
  addManyToBucket(slot: number, entries: BucketEntry[]): Promise<void> {
    return this.serial(slot, async () => {
      for (let i = 0; i < BUCKET_RETRIES; i++) {
        const cur = await this.kv.get(bucketKey(slot));
        const list = Array.isArray(cur?.value) ? (cur.value as BucketEntry[]) : [];
        const have = new Set(list.map(entryKey));
        const add = entries.filter((e) => !have.has(entryKey(e)));
        if (add.length === 0) return;
        const next = [...list, ...add];
        const w = cur
          ? await this.kv.update(bucketKey(slot), next, cur.etag)
          : await this.kv.create(bucketKey(slot), next);
        if (w.ok) return;
      }
      throw new PushConflictError();
    });
  }

  /** Removes finished entries; deletes the bucket when nothing is left. Entries added meanwhile are kept. */
  removeFromBucket(slot: number, keys: Set<string>): Promise<void> {
    return this.serial(slot, () => this.removeNow(slot, keys));
  }
  private async removeNow(slot: number, keys: Set<string>): Promise<void> {
    for (let i = 0; i < BUCKET_RETRIES; i++) {
      const cur = await this.kv.get(bucketKey(slot));
      if (!cur) return;
      const list = Array.isArray(cur.value) ? (cur.value as BucketEntry[]) : [];
      const rest = list.filter((e) => !keys.has(entryKey(e)));
      if (rest.length === list.length) return;
      if (rest.length === 0) {
        await this.kv.delete(bucketKey(slot));
        return;
      }
      const w = await this.kv.update(bucketKey(slot), rest, cur.etag);
      if (w.ok) return;
    }
    throw new PushConflictError();
  }

  async readCursor(): Promise<number | null> {
    const r = await this.kv.get(CURSOR_KEY);
    const n = (r?.value as { slot?: unknown } | undefined)?.slot;
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  }
  async writeCursor(slot: number): Promise<void> {
    await this.kv.put(CURSOR_KEY, { slot });
  }
}
