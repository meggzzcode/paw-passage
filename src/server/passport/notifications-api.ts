// Push and notification endpoints: devices, preferences and schedule plans. Called by api.ts only after the existing
// session, CSRF, same-origin and entitlement checks, so `cus` always comes from the signed cookie, never from a body.
// Never returned or logged: endpoints, keys, request bodies. Every request body is validated strictly (unknown keys are
// refused) and size-limited.
import { PLAN_ID_RE } from "./notifications-copy";
import type { KV } from "./kv";
import { enqueueGeneral, enqueuePlan, reconcileGeneral } from "./push-queue";
import { vapidFromEnv } from "./push-sender";
import {
  DEVICE_ID_RE,
  defaultPrefs,
  emptyRecord,
  endpointHash,
  MAX_DEVICES,
  MAX_LIVE_PLANS,
  MAX_STORED_PLANS,
  newDeviceId,
  PushStore,
  sealSub,
  type NotifRecord,
  type Plan,
  type Prefs,
} from "./push-store";
import { isValidTz, parseTime } from "./schedule";

export type NotifEnv = {
  NOTIFICATIONS_ENABLED?: string | undefined;
  VAPID_PUBLIC_KEY?: string | undefined;
  VAPID_PRIVATE_KEY?: string | undefined;
  VAPID_SUBJECT?: string | undefined;
};
export type NotifResult = { status: number; body: unknown };
export const SUBSCRIBE_MAX_BYTES = 4096;
export const SMALL_MAX_BYTES = 2048;
export const FLAG_KEY = "notifications/flag";

/** Push services we accept. https only; the host must be exactly one of these or end with the dotted suffix. */
const EXACT_HOSTS = ["fcm.googleapis.com", "updates.push.services.mozilla.com"];
const SUFFIX_HOSTS = [".push.apple.com", ".notify.windows.com"];

/** SSRF guard: returns the normalized endpoint or null. */
export function validateEndpoint(v: unknown): string | null {
  if (typeof v !== "string" || v.length < 20 || v.length > 600) return null;
  let u: URL;
  try {
    u = new URL(v);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password) return null;
  if (u.port && u.port !== "443") return null;
  const h = u.hostname;
  if (h.endsWith(".") || h.includes("..")) return null;
  const ok =
    EXACT_HOSTS.includes(h) || SUFFIX_HOSTS.some((s) => h.endsWith(s) && h.length > s.length);
  if (!ok) return null;
  if (u.hash) return null;
  return u.href;
}

const b64urlLen = (s: string, n: number): boolean =>
  /^[A-Za-z0-9_-]+$/.test(s) && Buffer.from(s, "base64url").length === n;

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const onlyKeys = (o: Record<string, unknown>, keys: string[]) =>
  Object.keys(o).every((k) => keys.includes(k));
const bad = (error: string, status = 400): NotifResult => ({
  status,
  body: { ok: false, error },
});
const okRes = (body: unknown, status = 200): NotifResult => ({ status, body });

export function cleanLabel(v: unknown): string | null {
  if (v === undefined) return "This device";
  if (typeof v !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u001f\u007f<>]/g, "").trim();
  if (s.length > 40) return null;
  return s || "This device";
}

export function validateSubscribe(body: Record<string, unknown>):
  | {
      sub: { endpoint: string; keys: { p256dh: string; auth: string } };
      label: string;
      tz?: string;
    }
  | string {
  if (!onlyKeys(body, ["subscription", "label", "tz"])) return "bad_request";
  const s = body["subscription"];
  if (!isObj(s) || !onlyKeys(s, ["endpoint", "keys", "expirationTime"])) return "bad_subscription";
  const exp = s["expirationTime"];
  if (exp !== undefined && exp !== null && typeof exp !== "number") return "bad_subscription";
  const endpoint = validateEndpoint(s["endpoint"]);
  if (!endpoint) return "endpoint_not_allowed";
  const k = s["keys"];
  if (!isObj(k) || !onlyKeys(k, ["p256dh", "auth"])) return "bad_subscription";
  const p256dh = k["p256dh"];
  const auth = k["auth"];
  if (typeof p256dh !== "string" || typeof auth !== "string") return "bad_subscription";
  if (!b64urlLen(p256dh, 65) || Buffer.from(p256dh, "base64url")[0] !== 4)
    return "bad_subscription";
  if (!b64urlLen(auth, 16)) return "bad_subscription";
  const label = cleanLabel(body["label"]);
  if (label === null) return "bad_label";
  const out: {
    sub: { endpoint: string; keys: { p256dh: string; auth: string } };
    label: string;
    tz?: string;
  } = {
    sub: { endpoint, keys: { p256dh, auth } },
    label,
  };
  if (body["tz"] !== undefined) {
    if (!isValidTz(body["tz"])) return "bad_tz";
    out.tz = body["tz"];
  }
  return out;
}

export function validatePrefs(body: unknown): Prefs | null {
  if (!isObj(body) || !onlyKeys(body, ["weekly", "planned", "saved", "seasonal", "quiet"]))
    return null;
  const w = body["weekly"];
  const q = body["quiet"];
  if (!isObj(w) || !onlyKeys(w, ["enabled", "day", "time", "tz"]) || !isObj(q)) return null;
  if (typeof w["enabled"] !== "boolean") return null;
  const day = w["day"];
  if (typeof day !== "number" || !Number.isInteger(day) || day < 0 || day > 6) return null;
  const time = w["time"];
  if (typeof time !== "string" || !parseTime(time)) return null;
  const tz = w["tz"];
  if (!isValidTz(tz)) return null;
  const flags: boolean[] = [];
  for (const k of ["planned", "saved", "seasonal"] as const) {
    const o = body[k];
    if (!isObj(o) || !onlyKeys(o, ["enabled"]) || typeof o["enabled"] !== "boolean") return null;
    flags.push(o["enabled"]);
  }
  if (!onlyKeys(q, ["start", "end"])) return null;
  const qs = q["start"];
  const qe = q["end"];
  if (typeof qs !== "string" || typeof qe !== "string" || !parseTime(qs) || !parseTime(qe))
    return null;
  return {
    weekly: { enabled: w["enabled"], day, time, tz },
    planned: { enabled: flags[0] ?? false },
    saved: { enabled: flags[1] ?? false },
    seasonal: { enabled: flags[2] ?? false },
    quiet: { start: qs, end: qe },
  };
}

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?Z$/;
const DAY = 24 * 60 * 60 * 1000;

export function validatePlan(body: unknown, now: number): Omit<Plan, "updatedAt"> | null {
  if (
    !isObj(body) ||
    !onlyKeys(body, [
      "id",
      "adventureId",
      "startAt",
      "tz",
      "durationMin",
      "remind",
      "push",
      "status",
      "updatedAt",
    ])
  )
    return null;
  const { id, adventureId, startAt, tz, durationMin, remind, push, status } = body;
  if (typeof id !== "string" || !PLAN_ID_RE.test(id)) return null;
  if (typeof adventureId !== "string" || !/^adv-[a-z0-9]{6}$/.test(adventureId)) return null;
  if (typeof startAt !== "string" || !ISO_UTC.test(startAt)) return null;
  const t = Date.parse(startAt);
  if (!Number.isFinite(t) || t < now - 2 * 365 * DAY || t > now + 3 * 365 * DAY) return null;
  if (!isValidTz(tz)) return null;
  if (
    typeof durationMin !== "number" ||
    !Number.isInteger(durationMin) ||
    durationMin < 5 ||
    durationMin > 1440
  )
    return null;
  if (remind !== "none" && remind !== "at" && remind !== "1h" && remind !== "1d") return null;
  if (typeof push !== "boolean") return null;
  if (status !== "planned" && status !== "done" && status !== "cancelled") return null;
  return { id, adventureId, startAt, tz, durationMin, remind, push, status };
}

/** Prefs as the client sees them. Weekly day and time default to Saturday 09:00 until the customer changes them. */
export const publicPrefs = (r: NotifRecord | null): Prefs => r?.prefs ?? defaultPrefs();

export type NotifApiDeps = {
  customers: KV;
  premium: KV;
  now: () => number;
  env: NotifEnv;
};

/** Kill switch: the env flag must be "true", keys must be configured, and the owner's blob flag must not say off. */
export async function notificationsEnabled(
  env: NotifEnv,
  premium: KV,
): Promise<{ enabled: boolean; publicKey: string | null }> {
  const vapid = vapidFromEnv(env);
  if (env.NOTIFICATIONS_ENABLED !== "true" || !vapid) return { enabled: false, publicKey: null };
  try {
    const f = (await premium.get(FLAG_KEY))?.value as { enabled?: unknown } | undefined;
    if (f && f.enabled === false) return { enabled: false, publicKey: null };
  } catch {
    return { enabled: false, publicKey: null }; // cannot read the flag: stay off
  }
  return { enabled: true, publicKey: vapid.publicKey };
}

export function createNotificationsApi(deps: NotifApiDeps) {
  const store = new PushStore(deps.customers, deps.now);

  /** Allowed methods for a path, or null when it is not a notifications route. */
  function methods(path: string): string[] | null {
    switch (path) {
      case "/api/push/config":
        return ["GET"];
      case "/api/push/subscribe":
        return ["POST", "DELETE"];
      case "/api/push/devices":
        return ["GET"];
      case "/api/push/primary":
        return ["POST"];
      case "/api/notifications/prefs":
        return ["GET", "PUT"];
      case "/api/notifications":
        return ["DELETE"];
      case "/api/schedule":
        return ["GET"];
      default:
        return path.startsWith("/api/schedule/") ? ["PUT", "DELETE"] : null;
    }
  }

  async function config(): Promise<NotifResult> {
    return okRes(await notificationsEnabled(deps.env, deps.premium));
  }

  async function sync(cus: string, rec: NotifRecord) {
    await enqueueGeneral(store, cus, rec);
  }

  async function handle(
    path: string,
    method: string,
    cus: string,
    dataKey: string,
    readBody: (max: number) => Promise<Record<string, unknown>>,
  ): Promise<NotifResult> {
    const now = deps.now();

    if (path === "/api/push/subscribe" && method === "POST") {
      if (!(await notificationsEnabled(deps.env, deps.premium)).enabled)
        return bad("notifications_unavailable", 503);
      const v = validateSubscribe(await readBody(SUBSCRIBE_MAX_BYTES));
      if (typeof v === "string") return bad(v);
      const hash = endpointHash(dataKey, v.sub.endpoint);
      const sealed = sealSub(dataKey, v.sub);
      let deviceId = "";
      let full = false;
      const out = await store.mutate(
        cus,
        (r) => {
          full = false;
          const found = r.devices.find((d) => d.epHash === hash);
          let next: NotifRecord;
          if (found) {
            deviceId = found.id;
            next = {
              ...r,
              devices: r.devices.map((d) =>
                d.id === found.id ? { ...d, sealed, label: v.label } : d,
              ),
            };
          } else {
            if (r.devices.length >= MAX_DEVICES) {
              full = true;
              return null;
            }
            deviceId = newDeviceId();
            next = {
              ...r,
              devices: [
                ...r.devices,
                { id: deviceId, sealed, epHash: hash, label: v.label, createdAt: now },
              ],
            };
          }
          if (!next.primary || !next.devices.some((d) => d.id === next.primary))
            next.primary = next.devices[0]?.id as string;
          if (v.tz) {
            next.tz = v.tz;
            if (!next.prefs.weekly.enabled && next.prefs.weekly.tz === "UTC")
              next = {
                ...next,
                prefs: { ...next.prefs, weekly: { ...next.prefs.weekly, tz: v.tz } },
              };
          }
          return reconcileGeneral(next, now);
        },
        { create: true },
      );
      if (full) return bad("too_many_devices", 409);
      if (!out) return bad("not_found", 404);
      await sync(cus, out);
      return okRes({ deviceId });
    }

    if (path === "/api/push/subscribe" && method === "DELETE") {
      const b = await readBody(SMALL_MAX_BYTES);
      const id = b["deviceId"];
      if (typeof id !== "string" || !DEVICE_ID_RE.test(id)) return bad("bad_device");
      await store.mutate(cus, (r) => {
        if (!r.devices.some((d) => d.id === id)) return null;
        const devices = r.devices.filter((d) => d.id !== id);
        const next: NotifRecord = { ...r, devices };
        if (r.primary === id) {
          const first = devices[0];
          if (first) next.primary = first.id;
          else delete next.primary;
        }
        return reconcileGeneral(next, now);
      });
      return okRes({ ok: true });
    }

    if (path === "/api/push/devices") {
      const r = await store.get(cus);
      const primary = r?.devices.find((d) => d.id === r.primary)?.id ?? r?.devices[0]?.id;
      return okRes({
        devices: (r?.devices ?? []).map((d) => ({
          deviceId: d.id,
          label: d.label,
          createdAt: d.createdAt,
          primary: d.id === primary,
        })),
      });
    }

    if (path === "/api/push/primary") {
      const id = (await readBody(SMALL_MAX_BYTES))["deviceId"];
      if (typeof id !== "string" || !DEVICE_ID_RE.test(id)) return bad("bad_device");
      let found = false;
      await store.mutate(cus, (r) => {
        found = r.devices.some((d) => d.id === id);
        return found ? { ...r, primary: id } : null;
      });
      return found ? okRes({ ok: true }) : bad("not_found", 404);
    }

    if (path === "/api/notifications/prefs" && method === "GET")
      return okRes(publicPrefs(await store.get(cus)));

    if (path === "/api/notifications/prefs" && method === "PUT") {
      const prefs = validatePrefs(await readBody(SMALL_MAX_BYTES));
      if (!prefs) return bad("bad_prefs");
      const out = await store.mutate(cus, (r) => reconcileGeneral({ ...r, prefs }, now), {
        create: true,
      });
      if (!out) return bad("not_found", 404);
      await sync(cus, out);
      return okRes(out.prefs);
    }

    if (path === "/api/notifications" && method === "DELETE") {
      // Opt out of everything: devices, preferences and delivery markers go. Saved plans are the customer's own data and stay.
      await store.mutate(cus, (r) => {
        const base = emptyRecord();
        return { ...base, plans: r.plans, tz: r.tz, prefs: defaultPrefs(r.tz) };
      });
      return okRes({ ok: true });
    }

    if (path === "/api/schedule" && method === "GET") {
      const r = await store.get(cus);
      return okRes({ plans: r?.plans ?? [] });
    }

    if (path.startsWith("/api/schedule/")) {
      const id = path.slice("/api/schedule/".length);
      if (!PLAN_ID_RE.test(id)) return bad("not_found", 404);
      if (method === "DELETE") {
        await store.mutate(cus, (r) =>
          r.plans.some((p) => p.id === id)
            ? { ...r, plans: r.plans.filter((p) => p.id !== id) }
            : null,
        );
        return okRes({ ok: true }); // a pending bucket entry finds no plan and is dropped when due
      }
      const raw = await readBody(SMALL_MAX_BYTES);
      const p = validatePlan(raw, now);
      if (!p || p.id !== id) return bad("bad_plan");
      // The client's own edit time decides (clamped, so a wrong clock cannot pin a plan in the far future). A write that
      // is older than what is stored never overwrites it: the stored plan is returned and the client merges it.
      const claimed =
        isObj(raw) && typeof raw["updatedAt"] === "number" && raw["updatedAt"] > 0
          ? Math.min(raw["updatedAt"], now + 5 * 60_000)
          : now;
      const plan: Plan = { ...p, updatedAt: claimed };
      const box: { err: NotifResult | null; stale: Plan | null } = { err: null, stale: null };
      const out = await store.mutate(
        cus,
        (r) => {
          box.err = null;
          box.stale = null;
          const cur = r.plans.find((x) => x.id === id);
          if (cur && cur.updatedAt > claimed) {
            box.stale = cur;
            return null;
          }
          const others = r.plans.filter((x) => x.id !== id);
          const live = others.filter((x) => x.status === "planned").length;
          if (plan.status === "planned" && live >= MAX_LIVE_PLANS) {
            box.err = bad("too_many_plans", 409);
            return null;
          }
          let plans = [...others, plan].sort((a, b) => a.startAt.localeCompare(b.startAt));
          while (plans.length > MAX_STORED_PLANS) {
            const i = plans.findIndex((x) => x.status !== "planned" && x.id !== id);
            if (i < 0) {
              box.err = bad("too_many_plans", 409);
              return null;
            }
            plans = plans.filter((_, j) => j !== i);
          }
          return { ...r, plans };
        },
        { create: true },
      );
      if (box.err) return box.err;
      if (!out) return bad("not_found", 404);
      if (box.stale) return okRes({ ok: true, plan: box.stale, stale: true });
      await enqueuePlan(store, cus, plan, now);
      return okRes({ ok: true, plan });
    }

    return bad("not_found", 404);
  }

  return { methods, config, handle };
}
