// Typed client for the notification, push and schedule APIs. Every function here is called only after an explicit
// user action, or when a paying customer opens the settings panel. Free visitors never reach this module's network calls.
import { CSRF_HEADER } from "@/lib/passport-api";
import { getEntitlement } from "@/passport/premium-client";

export type Weekly = { enabled: boolean; day: number; time: string; tz: string };
export type NotificationPrefs = {
  weekly: Weekly;
  planned: { enabled: boolean };
  saved: { enabled: boolean };
  seasonal: { enabled: boolean };
  quiet: { start: string; end: string };
};
export type Device = {
  deviceId: string;
  label: string;
  createdAt: number | string;
  primary: boolean;
};
export type Remind = "none" | "at" | "1h" | "1d";
export type PlanStatus = "planned" | "done" | "cancelled";
export type Plan = {
  id: string;
  adventureId: string;
  startAt: string;
  tz: string;
  durationMin: number;
  remind: Remind;
  push: boolean;
  status: PlanStatus;
  updatedAt: number;
};
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number };

export const DEFAULT_PREFS: NotificationPrefs = {
  weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" },
  planned: { enabled: false },
  saved: { enabled: false },
  seasonal: { enabled: false },
  quiet: { start: "21:00", end: "08:00" },
};

export const deviceTz = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

async function call<T>(
  method: string,
  path: string,
  body?: unknown,
  parse: (v: unknown) => T | null = (v) => v as T,
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = { accept: "application/json" };
    if (body !== undefined) headers["content-type"] = "application/json";
    if (method !== "GET") headers[CSRF_HEADER] = getEntitlement().csrf;
    const res = await fetch(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) return { ok: false, status: res.status };
    let json: unknown = {};
    try {
      json = await res.json();
    } catch {
      /* an empty body is fine */
    }
    const data = parse(json);
    return data === null ? { ok: false, status: 502 } : { ok: true, data };
  } catch {
    return { ok: false, status: 0 };
  }
}

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

export const fetchPushConfig = () =>
  call<{ enabled: boolean; publicKey: string | null }>(
    "GET",
    "/api/push/config",
    undefined,
    (v) => {
      const o = obj(v);
      return {
        enabled: o["enabled"] === true,
        publicKey: typeof o["publicKey"] === "string" ? o["publicKey"] : null,
      };
    },
  );

export const getPrefs = () =>
  call<NotificationPrefs>("GET", "/api/notifications/prefs", undefined, (v) => {
    const o = obj(v);
    const d = DEFAULT_PREFS;
    const w = obj(o["weekly"]);
    const q = obj(o["quiet"]);
    const on = (k: string) => obj(o[k])["enabled"] === true;
    return {
      weekly: {
        enabled: w["enabled"] === true,
        day: typeof w["day"] === "number" ? w["day"] : d.weekly.day,
        time: typeof w["time"] === "string" ? w["time"] : d.weekly.time,
        tz: typeof w["tz"] === "string" ? w["tz"] : deviceTz(),
      },
      planned: { enabled: on("planned") },
      saved: { enabled: on("saved") },
      seasonal: { enabled: on("seasonal") },
      quiet: {
        start: typeof q["start"] === "string" ? q["start"] : d.quiet.start,
        end: typeof q["end"] === "string" ? q["end"] : d.quiet.end,
      },
    };
  });
export const putPrefs = (p: NotificationPrefs) =>
  call<NotificationPrefs>("PUT", "/api/notifications/prefs", p, () => p);
export const disableAll = () => call<true>("DELETE", "/api/notifications", undefined, () => true);

export const getDevices = () =>
  call<Device[]>("GET", "/api/push/devices", undefined, (v) => {
    const list = obj(v)["devices"];
    if (!Array.isArray(list)) return [];
    return list
      .map((d) => obj(d))
      .filter((d) => typeof d["deviceId"] === "string")
      .map((d) => ({
        deviceId: String(d["deviceId"]),
        label: typeof d["label"] === "string" && d["label"] ? d["label"] : "A device",
        createdAt:
          typeof d["createdAt"] === "number" ? d["createdAt"] : String(d["createdAt"] ?? ""),
        primary: d["primary"] === true,
      }));
  });
export const postSubscription = (subscription: unknown, label: string, tz: string) =>
  call<{ deviceId: string }>("POST", "/api/push/subscribe", { subscription, label, tz }, (v) => {
    const id = obj(v)["deviceId"];
    return typeof id === "string" ? { deviceId: id } : null;
  });
export const deleteDevice = (deviceId: string) =>
  call<true>("DELETE", "/api/push/subscribe", { deviceId }, () => true);
export const setPrimaryDevice = (deviceId: string) =>
  call<true>("POST", "/api/push/primary", { deviceId }, () => true);

// ---- schedule ----
export const PLAN_ID = /^pl-[a-z0-9]{8}$/;
export function newPlanId(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256)));
  return "pl-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
export const parsePlan = (v: unknown): Plan | null => {
  const o = obj(v);
  const remind = o["remind"];
  const status = o["status"];
  if (
    typeof o["id"] !== "string" ||
    !PLAN_ID.test(o["id"]) ||
    typeof o["adventureId"] !== "string" ||
    typeof o["startAt"] !== "string" ||
    Number.isNaN(Date.parse(o["startAt"])) ||
    (remind !== "none" && remind !== "at" && remind !== "1h" && remind !== "1d") ||
    (status !== "planned" && status !== "done" && status !== "cancelled")
  )
    return null;
  return {
    id: o["id"],
    adventureId: o["adventureId"],
    startAt: o["startAt"],
    tz: typeof o["tz"] === "string" ? o["tz"] : "UTC",
    durationMin: typeof o["durationMin"] === "number" ? o["durationMin"] : 30,
    remind,
    push: o["push"] === true,
    status,
    updatedAt: typeof o["updatedAt"] === "number" ? o["updatedAt"] : 0,
  };
};
export const getPlans = () =>
  call<Plan[]>("GET", "/api/schedule", undefined, (v) => {
    const list = obj(v)["plans"];
    return Array.isArray(list) ? list.map(parsePlan).filter((p): p is Plan => p !== null) : [];
  });
export const putPlan = (plan: Plan) =>
  call<Plan>("PUT", `/api/schedule/${plan.id}`, plan, (v) => parsePlan(obj(v)["plan"]) ?? plan);
export const deletePlanRemote = (id: string) =>
  call<true>("DELETE", `/api/schedule/${id}`, undefined, () => true);

// ---- this browser ----
const DEVICE_KEY = "pp.push.device";
export const getLocalDeviceId = (): string | null => {
  try {
    return window.localStorage.getItem(DEVICE_KEY);
  } catch {
    return null;
  }
};
export const setLocalDeviceId = (id: string | null) => {
  try {
    if (id) window.localStorage.setItem(DEVICE_KEY, id);
    else window.localStorage.removeItem(DEVICE_KEY);
  } catch {
    /* blocked storage: the server still lists the device */
  }
};

export function keyToBytes(b64: string): Uint8Array {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  try {
    return (
      (await navigator.serviceWorker.getRegistration()) ??
      (await navigator.serviceWorker.register("/sw.js"))
    );
  } catch {
    return null;
  }
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    return (await reg?.pushManager.getSubscription()) ?? null;
  } catch {
    return null;
  }
}

export function deviceLabel(): string {
  const ua = navigator.userAgent;
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac/.test(ua)
          ? "Mac"
          : /Linux/.test(ua)
            ? "Linux"
            : "Device";
  const br = /Firefox/.test(ua)
    ? "Firefox"
    : /Edg/.test(ua)
      ? "Edge"
      : /Chrome/.test(ua)
        ? "Chrome"
        : /Safari/.test(ua)
          ? "Safari"
          : "Browser";
  return `${os} ${br}`;
}

export type EnableResult =
  | { ok: true; deviceId: string }
  | { ok: false; reason: "declined" | "dismissed" | "no-worker" | "server" };

/** The ONLY place the browser permission prompt is requested. Call it from a click handler and nowhere else. */
export async function enableOnThisDevice(
  publicKey: string,
  hooks: { onRequested?: () => void } = {},
): Promise<EnableResult> {
  hooks.onRequested?.();
  const perm = await Notification.requestPermission();
  if (perm === "denied") return { ok: false, reason: "declined" };
  if (perm !== "granted") return { ok: false, reason: "dismissed" };
  const reg = await registration();
  if (!reg) return { ok: false, reason: "no-worker" };
  try {
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyToBytes(publicKey) as BufferSource,
      }));
    const r = await postSubscription(sub.toJSON(), deviceLabel(), deviceTz());
    if (!r.ok) {
      await sub.unsubscribe().catch(() => false);
      return { ok: false, reason: "server" };
    }
    setLocalDeviceId(r.data.deviceId);
    return { ok: true, deviceId: r.data.deviceId };
  } catch {
    return { ok: false, reason: "no-worker" };
  }
}

/** Removes this browser's push subscription (locally always; on the server when we know the device id). */
export async function disableOnThisDevice(deviceId: string | null): Promise<boolean> {
  let ok = true;
  if (deviceId) ok = (await deleteDevice(deviceId)).ok;
  const sub = await currentSubscription();
  await sub?.unsubscribe().catch(() => false);
  setLocalDeviceId(null);
  return ok;
}
