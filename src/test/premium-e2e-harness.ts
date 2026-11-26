// Shared harness for the premium end-to-end tests: the REAL request handler (createApi) over in-memory stores and the
// deterministic TestProvider, plus a "device" that behaves like a browser (cookie jar, CSRF header, relative URLs).
// SYNTHETIC data only: nothing here is real premium text. See docs/PREMIUM-INTEGRATION-TESTS.md.
import { randomBytes } from "node:crypto";
import { syntheticPremium } from "../passport/fixtures/premium.synthetic";
import { freeLibrary, stamps } from "../passport/content";
import { emptySave, type Save } from "../passport/progress";
import type { Adventure } from "../passport/schema";
import { createApi } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { TestProvider } from "../server/passport/provider";
import { buildPreviewIndex, PREVIEW_INDEX_KEY } from "../server/passport/previews";

export const ORIGIN = "https://preview.pawsandpassage.test";
export const SECRET = "e".repeat(48);
export const KEY = "TEST-VALID-E2EKEY01";
export const KEY_B = "TEST-VALID-E2EKEY02";
export const HOUR = 3_600_000;
export const T0 = 1_800_000_000_000;

/** A real stamp slug that no free adventure awards, so a test can tell it came from premium work. */
export const PREMIUM_ONLY_STAMP = (() => {
  const used = new Set(freeLibrary().flatMap((a) => a.stamps));
  const slug = stamps.map((s) => s.slug).find((s) => !used.has(s));
  if (!slug) throw new Error("every stamp is awarded by a free adventure; adjust the e2e fixture");
  return slug;
})();

/** Synthetic premium cards. The first carries a real stamp slug so progression can be derived from premium work. */
export const PREMIUM: Adventure[] = [
  { ...syntheticPremium[0]!, stamps: [PREMIUM_ONLY_STAMP], collections: ["road-trip-adventures"] },
  { ...syntheticPremium[1]!, stamps: [], collections: ["road-trip-adventures"] },
  { ...syntheticPremium[2]!, stamps: [], collections: ["road-trip-adventures"] },
  {
    ...syntheticPremium[0]!,
    id: "adv-syn101",
    title: "SYNTHETIC Showcase One",
    showcase: true,
    teaser: "A small mystery for a curious nose.",
    previewTitle: "Mystery one",
    stamps: [],
    collections: ["road-trip-adventures"],
  },
];
export const PREMIUM_IDS = PREMIUM.map((a) => a.id);
/** Fields only the premium endpoint may carry for a premium card. */
export const SECRET_FIELDS = [
  "instructions",
  "twist",
  "reveal",
  "clue",
  "completion",
  "safety",
] as const;

export const sub = (n = 1) => ({
  endpoint: `https://fcm.googleapis.com/fcm/send/${"x".repeat(20)}${n}`,
  keys: {
    p256dh: Buffer.concat([Buffer.from([4]), randomBytes(64)]).toString("base64url"),
    auth: randomBytes(16).toString("base64url"),
  },
});

const NOTIF_ENV = {
  NOTIFICATIONS_ENABLED: "true",
  VAPID_PUBLIC_KEY: "B".repeat(87),
  VAPID_PRIVATE_KEY: "a".repeat(43),
  VAPID_SUBJECT: "mailto:owner@example.test",
};

export type World = ReturnType<typeof world>;
export function world(opts: { seedPremium?: boolean } = {}) {
  const customers = new MemoryKV();
  const premium = new MemoryKV();
  if (opts.seedPremium !== false) {
    void premium.put("index", {
      ids: PREMIUM_IDS,
      items: PREMIUM.map((a) => ({ id: a.id, status: a.status, collections: a.collections })),
    });
    for (const a of PREMIUM) void premium.put(`adventure/${a.id}`, a);
    void premium.put(PREVIEW_INDEX_KEY, buildPreviewIndex(PREMIUM, freeLibrary()));
  }
  const provider = new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "deploy-preview");
  const clock = { t: T0 };
  const logs: string[] = [];
  const api = createApi({
    customers,
    premium,
    provider,
    secret: SECRET,
    now: () => clock.t,
    ip: "9.9.9.9",
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 10_000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 10_000 }),
    notifLimiter: createRateLimiter({ windowMs: 60_000, max: 10_000 }),
    notifEnv: NOTIF_ENV,
    log: (e, f) => logs.push(JSON.stringify({ e, ...f })),
  });
  /** Network faults: `offline` throws like a dead connection; `faults` maps a path to a forced HTTP status. */
  const net = { offline: false, faults: new Map<string, number>() };
  return { customers, premium, provider, clock, api, logs, net };
}

export type Reply = {
  res: Response;
  status: number;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: Record<string, any>;
};

/** One browser: its own cookie jar and CSRF token. Two Devices on one World are two phones with one purchase. */
export class Device {
  cookie = "";
  csrf = "";
  constructor(public w: World) {}

  /** Bridge with the browser `fetch` shape; relative URLs only. */
  fetch = async (input: string, init: RequestInit = {}): Promise<Response> => {
    if (this.w.net.offline) throw new TypeError("offline");
    const path = new URL(input, ORIGIN).pathname;
    const forced = this.w.net.faults.get(path);
    if (forced) return new Response(JSON.stringify({ ok: false }), { status: forced });
    const headers = new Headers(init.headers);
    headers.set("origin", ORIGIN);
    if (this.cookie) headers.set("cookie", this.cookie);
    const res = await this.w.api.handle(new Request(`${ORIGIN}${input}`, { ...init, headers }));
    const sc = res.headers.get("set-cookie");
    if (sc) {
      const first = sc.split(";")[0]!;
      this.cookie = first.slice(first.indexOf("=") + 1) ? first : "";
    }
    return res;
  };

  async call(method: string, path: string, body?: unknown): Promise<Reply> {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (this.csrf) headers["x-pp-csrf"] = this.csrf;
    const init: RequestInit = { method, headers };
    if (body !== undefined) init.body = JSON.stringify(body);
    const res = await this.fetch(path, init);
    const text = await res.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { res, status: res.status, text, json: (text ? JSON.parse(text) : {}) as any };
  }

  private async access(kind: "activate" | "restore", code: string, localSave?: Save | null) {
    const r = await this.call("POST", `/api/access/${kind}`, {
      code,
      ...(localSave ? { localSave } : {}),
    });
    if (r.status === 200) this.csrf = r.json["csrf"] as string;
    return r;
  }
  activate = (code = KEY, localSave?: Save | null) => this.access("activate", code, localSave);
  restore = (code = KEY, localSave?: Save | null) => this.access("restore", code, localSave);
  premium = () => this.call("GET", "/api/premium/adventures");
  session = () => this.call("GET", "/api/session");
  progress = () => this.call("GET", "/api/progress");
  put = (save: Save, baseRev = 0) => this.call("PUT", "/api/progress", { save, baseRev });
}

export const customerKeys = (w: World) =>
  w.customers.keys().filter((k) => k.startsWith("customer/"));
export const customerId = (w: World) => customerKeys(w)[0]!.slice("customer/".length);
export { emptySave };
