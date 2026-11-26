// Push, preferences and schedule endpoints: validation, SSRF guard, limits, isolation and cleanup. In-memory stores.
import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createApi, type ApiDeps } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { validateEndpoint } from "../server/passport/notifications-api";
import { TestProvider } from "../server/passport/provider";
import { CustomerStore } from "../server/passport/store";

const ORIGIN = "https://pawsandpassage.test";
const SECRET = "s".repeat(48);
// Obviously fake, correctly shaped VAPID values (never a real key).
const ENV = {
  NOTIFICATIONS_ENABLED: "true",
  VAPID_PUBLIC_KEY: "B".repeat(87),
  VAPID_PRIVATE_KEY: "a".repeat(43),
  VAPID_SUBJECT: "mailto:owner@example.test",
};
const NOW = Date.UTC(2026, 10, 25, 12, 0);

function setup(over: Partial<ApiDeps> = {}) {
  const customers = new MemoryKV();
  const premium = new MemoryKV();
  const deps: ApiDeps = {
    customers,
    premium,
    provider: new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "dev"),
    secret: SECRET,
    now: () => NOW,
    ip: "1.2.3.4",
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    notifLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    notifEnv: ENV,
    ...over,
  };
  return { api: createApi(deps), customers, premium, deps };
}
type H = ReturnType<typeof setup>;
type Who = { cookie: string; csrf: string };

async function call(
  h: H,
  method: string,
  path: string,
  who?: Who | null,
  body?: unknown,
  raw?: string,
) {
  const headers: Record<string, string> = { "content-type": "application/json", origin: ORIGIN };
  if (who) {
    headers["cookie"] = who.cookie;
    headers["x-pp-csrf"] = who.csrf;
  }
  const init: RequestInit = { method, headers };
  if (raw !== undefined) init.body = raw;
  else if (body !== undefined) init.body = JSON.stringify(body);
  const res = await h.api.handle(new Request(`${ORIGIN}${path}`, init));
  const text = await res.text();
  return {
    res,
    status: res.status,
    text,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: (text ? JSON.parse(text) : {}) as Record<string, any>,
  };
}
async function signIn(h: H, code = "TEST-VALID-ABC12345"): Promise<Who> {
  const res = await h.api.handle(
    new Request(`${ORIGIN}/api/access/activate`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: ORIGIN },
      body: JSON.stringify({ code }),
    }),
  );
  const j = (await res.json()) as { csrf: string };
  return { cookie: res.headers.get("set-cookie")!.split(";")[0]!, csrf: j.csrf };
}

const sub = (host = "fcm.googleapis.com", n = 1) => ({
  endpoint: `https://${host}/fcm/send/${"x".repeat(20)}${n}`,
  keys: {
    p256dh: Buffer.concat([Buffer.from([4]), randomBytes(64)]).toString("base64url"),
    auth: randomBytes(16).toString("base64url"),
  },
});
const plan = (id = "pl-abcd1234", over: Record<string, unknown> = {}) => ({
  id,
  adventureId: "adv-k3m9x2",
  startAt: "2026-12-05T15:00:00Z",
  tz: "America/New_York",
  durationMin: 60,
  remind: "1h",
  push: true,
  status: "planned",
  updatedAt: 1,
  ...over,
});
const PREFS = {
  weekly: { enabled: true, day: 6, time: "09:00", tz: "America/New_York" },
  planned: { enabled: true },
  saved: { enabled: false },
  seasonal: { enabled: false },
  quiet: { start: "21:00", end: "08:00" },
};

describe("GET /api/push/config", () => {
  it("is public, no-store, and enabled only with the kill switch on and keys configured", async () => {
    const h = setup();
    const r = await call(h, "GET", "/api/push/config");
    expect(r.status).toBe(200);
    expect(r.res.headers.get("cache-control")).toBe("no-store");
    expect(r.json).toEqual({ enabled: true, publicKey: ENV.VAPID_PUBLIC_KEY });
    expect(r.text).not.toContain(ENV.VAPID_PRIVATE_KEY);
  });
  it.each([
    ["switch off", { ...ENV, NOTIFICATIONS_ENABLED: "false" }],
    ["switch unset", { ...ENV, NOTIFICATIONS_ENABLED: undefined }],
    ["no private key", { ...ENV, VAPID_PRIVATE_KEY: undefined }],
    ["no public key", { ...ENV, VAPID_PUBLIC_KEY: undefined }],
    ["bad subject", { ...ENV, VAPID_SUBJECT: "owner@example.test" }],
  ])("is disabled with %s", async (_n, env) => {
    const r = await call(setup({ notifEnv: env }), "GET", "/api/push/config");
    expect(r.json).toEqual({ enabled: false, publicKey: null });
  });
  it("is disabled when no env is given at all", async () => {
    const r = await call(setup({ notifEnv: {} }), "GET", "/api/push/config");
    expect(r.json).toEqual({ enabled: false, publicKey: null });
  });
  it("the owner's blob flag turns it off", async () => {
    const h = setup();
    await h.premium.put("notifications/flag", { enabled: false });
    expect((await call(h, "GET", "/api/push/config")).json).toEqual({
      enabled: false,
      publicKey: null,
    });
  });
});

describe("authentication", () => {
  it("needs a session, and a CSRF token for changes", async () => {
    const h = setup();
    const who = await signIn(h);
    for (const [m, p] of [
      ["GET", "/api/push/devices"],
      ["GET", "/api/notifications/prefs"],
      ["GET", "/api/schedule"],
      ["POST", "/api/push/subscribe"],
      ["DELETE", "/api/notifications"],
    ] as const)
      expect((await call(h, m, p, null, m === "GET" ? undefined : {})).status).toBe(401);
    expect((await call(h, "DELETE", "/api/notifications", { ...who, csrf: "nope" })).status).toBe(
      403,
    );
    expect((await call(h, "GET", "/api/push/devices", who)).status).toBe(200);
  });
  it("wrong methods are refused and unknown paths are 404", async () => {
    const h = setup();
    expect((await call(h, "GET", "/api/push/primary")).status).toBe(405);
    expect((await call(h, "GET", "/api/push/nothing")).status).toBe(404);
  });
  it("a refunded customer cannot use the endpoints and loses their data", async () => {
    const h = setup();
    const who = await signIn(h);
    await call(h, "POST", "/api/push/subscribe", who, { subscription: sub() });
    await call(h, "PUT", "/api/schedule/pl-abcd1234", who, plan());
    expect(h.customers.keys().some((k) => k.startsWith("notif/"))).toBe(true);
    const id = h.customers
      .keys()
      .find((k) => k.startsWith("customer/"))!
      .slice("customer/".length);
    await new CustomerStore(h.customers).setEntitlement(id, { status: "refunded" });
    expect(h.customers.keys().some((k) => k.startsWith("notif/"))).toBe(false);
    expect((await call(h, "GET", "/api/push/devices", who)).status).toBe(403);
  });
});

describe("endpoint allow-list (SSRF guard)", () => {
  it.each([
    "https://fcm.googleapis.com/fcm/send/abcdefghij",
    "https://updates.push.services.mozilla.com/wpush/v2/abcdefghij",
    "https://web.push.apple.com/QAbcdefghij",
    "https://wns2-par02p.notify.windows.com/w/?token=abcdef",
  ])("accepts %s", (e) => expect(validateEndpoint(e)).not.toBeNull());
  it.each([
    "http://fcm.googleapis.com/fcm/send/abcdefghij",
    "https://evilfcm.googleapis.com/fcm/send/abcdefghij",
    "https://fcm.googleapis.com.evil.test/fcm/send/abcdefghij",
    "https://fcm.googleapis.com@evil.test/fcm/send/abcdefghij",
    "https://user:pw@fcm.googleapis.com/fcm/send/abcdefghij",
    "https://fcm.googleapis.com:8443/fcm/send/abcdefghij",
    "https://push.apple.com/abcdefghij",
    "https://evilpush.apple.com.test/abcdefghij",
    "https://evilnotify.windows.com/abcdefghij",
    "https://127.0.0.1/abcdefghij-abcdefghij",
    "https://169.254.169.254/latest/meta-data/",
    "https://localhost/abcdefghijklmnopqrstuvw",
    "https://[::1]/abcdefghijklmnopqrstuvw",
    "https://fcm.googleapis.com./fcm/send/abcdefghij",
    "ftp://fcm.googleapis.com/fcm/send/abcdefghij",
    "javascript:alert(1)//fcm.googleapis.com",
    "https://fcm.googleapis.com/x#frag-abcdefghijkl",
    "",
    "https://" + "a".repeat(700) + ".push.apple.com/",
  ])("rejects %s", (e) => expect(validateEndpoint(e)).toBeNull());
});

describe("subscribe, devices, primary", () => {
  it("subscribes, never returns endpoints or keys, and first device is primary", async () => {
    const h = setup();
    const who = await signIn(h);
    const s = sub();
    const r = await call(h, "POST", "/api/push/subscribe", who, {
      subscription: s,
      label: "My phone",
      tz: "America/Chicago",
    });
    expect(r.status).toBe(200);
    expect(r.json["deviceId"]).toMatch(/^dv-[0-9a-f]{12}$/);
    expect(r.text).not.toContain("fcm.googleapis");
    const d = await call(h, "GET", "/api/push/devices", who);
    expect(d.json["devices"]).toEqual([
      { deviceId: r.json["deviceId"], label: "My phone", createdAt: NOW, primary: true },
    ]);
    for (const t of [d.text, r.text]) {
      expect(t).not.toContain(s.keys.auth);
      expect(t).not.toContain(s.keys.p256dh);
      expect(t).not.toContain(s.endpoint);
    }
  });
  it("stores the subscription sealed, never in plain text", async () => {
    const h = setup();
    const who = await signIn(h);
    const s = sub();
    await call(h, "POST", "/api/push/subscribe", who, { subscription: s });
    const dump = h.customers.dump();
    expect(dump).not.toContain(s.endpoint);
    expect(dump).not.toContain(s.keys.auth);
    expect(dump).not.toContain("fcm.googleapis");
  });
  it("is refused while notifications are off", async () => {
    const h = setup({ notifEnv: { ...ENV, NOTIFICATIONS_ENABLED: "false" } });
    const who = await signIn(h);
    expect(
      (await call(h, "POST", "/api/push/subscribe", who, { subscription: sub() })).status,
    ).toBe(503);
  });
  it("repeat subscribe of the same endpoint returns the same device", async () => {
    const h = setup();
    const who = await signIn(h);
    const s = sub();
    const a = await call(h, "POST", "/api/push/subscribe", who, { subscription: s, label: "A" });
    const b = await call(h, "POST", "/api/push/subscribe", who, { subscription: s, label: "B" });
    expect(b.json["deviceId"]).toBe(a.json["deviceId"]);
    const d = await call(h, "GET", "/api/push/devices", who);
    expect(d.json["devices"]).toHaveLength(1);
    expect(d.json["devices"][0].label).toBe("B");
  });
  it("allows at most 5 devices", async () => {
    const h = setup();
    const who = await signIn(h);
    for (let i = 0; i < 5; i++)
      expect(
        (
          await call(h, "POST", "/api/push/subscribe", who, {
            subscription: sub("fcm.googleapis.com", i),
          })
        ).status,
      ).toBe(200);
    const r = await call(h, "POST", "/api/push/subscribe", who, {
      subscription: sub("fcm.googleapis.com", 9),
    });
    expect(r.status).toBe(409);
    expect(r.json["error"]).toBe("too_many_devices");
  });
  it.each([
    [
      "wrong host",
      { subscription: { ...sub(), endpoint: "https://evil.test/fcm/send/abcdefghijklm" } },
    ],
    [
      "http",
      { subscription: { ...sub(), endpoint: "http://fcm.googleapis.com/fcm/send/abcdefghijklm" } },
    ],
    [
      "short p256dh",
      { subscription: { ...sub(), keys: { p256dh: "abc", auth: sub().keys.auth } } },
    ],
    ["bad auth", { subscription: { ...sub(), keys: { p256dh: sub().keys.p256dh, auth: "!!!" } } }],
    ["extra subscription key", { subscription: { ...sub(), extra: 1 } }],
    ["extra body key", { subscription: sub(), customerId: "cus_x" }],
    ["bad tz", { subscription: sub(), tz: "Mars/Olympus" }],
    ["long label", { subscription: sub(), label: "x".repeat(41) }],
    ["no subscription", {}],
    ["array", { subscription: [] }],
  ])("rejects %s", async (_n, body) => {
    const h = setup();
    const who = await signIn(h);
    expect((await call(h, "POST", "/api/push/subscribe", who, body)).status).toBe(400);
  });
  it("rejects an oversized body and bad json", async () => {
    const h = setup();
    const who = await signIn(h);
    expect(
      (
        await call(h, "POST", "/api/push/subscribe", who, {
          subscription: sub(),
          label: "x".repeat(9000),
        })
      ).status,
    ).toBe(413);
    expect((await call(h, "POST", "/api/push/subscribe", who, undefined, "{nope")).status).toBe(
      400,
    );
  });
  it("strips markup characters from labels", async () => {
    const h = setup();
    const who = await signIn(h);
    await call(h, "POST", "/api/push/subscribe", who, {
      subscription: sub(),
      label: "<b>Mine</b>",
    });
    const d = await call(h, "GET", "/api/push/devices", who);
    expect(d.json["devices"][0].label).toBe("bMine/b");
  });
  it("changes the primary device, and removing the primary promotes another", async () => {
    const h = setup();
    const who = await signIn(h);
    const a = (
      await call(h, "POST", "/api/push/subscribe", who, {
        subscription: sub("fcm.googleapis.com", 1),
      })
    ).json["deviceId"];
    const b = (
      await call(h, "POST", "/api/push/subscribe", who, {
        subscription: sub("fcm.googleapis.com", 2),
      })
    ).json["deviceId"];
    expect((await call(h, "POST", "/api/push/primary", who, { deviceId: b })).status).toBe(200);
    let d = (await call(h, "GET", "/api/push/devices", who)).json["devices"] as {
      deviceId: string;
      primary: boolean;
    }[];
    expect(d.find((x) => x.primary)!.deviceId).toBe(b);
    expect((await call(h, "DELETE", "/api/push/subscribe", who, { deviceId: b })).json).toEqual({
      ok: true,
    });
    d = (await call(h, "GET", "/api/push/devices", who)).json["devices"];
    expect(d).toHaveLength(1);
    expect(d[0]!.deviceId).toBe(a);
    expect(d[0]!.primary).toBe(true);
    expect(
      (await call(h, "POST", "/api/push/primary", who, { deviceId: "dv-000000000000" })).status,
    ).toBe(404);
    expect((await call(h, "POST", "/api/push/primary", who, { deviceId: "x" })).status).toBe(400);
  });
  it("a customer can only touch their own devices", async () => {
    const h = setup();
    const alice = await signIn(h, "TEST-VALID-ALICE111");
    const bob = await signIn(h, "TEST-VALID-BOB22222");
    const a = (await call(h, "POST", "/api/push/subscribe", alice, { subscription: sub() })).json[
      "deviceId"
    ];
    expect(
      ((await call(h, "GET", "/api/push/devices", bob)).json["devices"] as unknown[]).length,
    ).toBe(0);
    expect((await call(h, "POST", "/api/push/primary", bob, { deviceId: a })).status).toBe(404);
    await call(h, "DELETE", "/api/push/subscribe", bob, { deviceId: a });
    expect(
      ((await call(h, "GET", "/api/push/devices", alice)).json["devices"] as unknown[]).length,
    ).toBe(1);
  });
});

describe("preferences", () => {
  it("defaults to everything off, weekly Saturday 09:00", async () => {
    const h = setup();
    const who = await signIn(h);
    const r = await call(h, "GET", "/api/notifications/prefs", who);
    expect(r.json["weekly"]).toMatchObject({ enabled: false, day: 6, time: "09:00" });
    for (const k of ["planned", "saved", "seasonal"]) expect(r.json[k]).toEqual({ enabled: false });
  });
  it("saves and returns valid prefs; nothing is scheduled without a device", async () => {
    const h = setup();
    const who = await signIn(h);
    const r = await call(h, "PUT", "/api/notifications/prefs", who, PREFS);
    expect(r.status).toBe(200);
    expect(r.json).toEqual(PREFS);
    expect((await call(h, "GET", "/api/notifications/prefs", who)).json).toEqual(PREFS);
    expect(h.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(0);
  });
  it("with a device, enabling weekly adds exactly one due-bucket entry", async () => {
    const h = setup();
    const who = await signIn(h);
    await call(h, "POST", "/api/push/subscribe", who, { subscription: sub() });
    await call(h, "PUT", "/api/notifications/prefs", who, PREFS);
    await call(h, "PUT", "/api/notifications/prefs", who, PREFS);
    expect(h.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(1);
  });
  it.each([
    ["day 7", { ...PREFS, weekly: { ...PREFS.weekly, day: 7 } }],
    ["day 1.5", { ...PREFS, weekly: { ...PREFS.weekly, day: 1.5 } }],
    ["time 9:00", { ...PREFS, weekly: { ...PREFS.weekly, time: "9:00" } }],
    ["time 24:00", { ...PREFS, weekly: { ...PREFS.weekly, time: "24:00" } }],
    ["bad tz", { ...PREFS, weekly: { ...PREFS.weekly, tz: "Nope/Nope" } }],
    ["string enabled", { ...PREFS, saved: { enabled: "yes" } }],
    ["missing quiet", { ...PREFS, quiet: undefined }],
    ["bad quiet", { ...PREFS, quiet: { start: "25:00", end: "08:00" } }],
    ["extra key", { ...PREFS, daily: { enabled: true } }],
    ["extra nested key", { ...PREFS, planned: { enabled: true, offset: 5 } }],
  ])("rejects %s", async (_n, body) => {
    const h = setup();
    const who = await signIn(h);
    expect((await call(h, "PUT", "/api/notifications/prefs", who, body)).status).toBe(400);
  });
  it("DELETE /api/notifications removes devices and prefs but keeps plans", async () => {
    const h = setup();
    const who = await signIn(h);
    await call(h, "POST", "/api/push/subscribe", who, { subscription: sub() });
    await call(h, "PUT", "/api/notifications/prefs", who, PREFS);
    await call(h, "PUT", "/api/schedule/pl-abcd1234", who, plan());
    expect((await call(h, "DELETE", "/api/notifications", who)).json).toEqual({ ok: true });
    expect(
      ((await call(h, "GET", "/api/push/devices", who)).json["devices"] as unknown[]).length,
    ).toBe(0);
    const p = (await call(h, "GET", "/api/notifications/prefs", who)).json;
    expect(p["weekly"].enabled).toBe(false);
    expect(((await call(h, "GET", "/api/schedule", who)).json["plans"] as unknown[]).length).toBe(
      1,
    );
  });
});

describe("schedule plans", () => {
  it("creates, updates, lists and deletes a plan", async () => {
    const h = setup();
    const who = await signIn(h);
    const r = await call(
      h,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan("pl-abcd1234", { updatedAt: NOW - 10 }),
    );
    expect(r.status).toBe(200);
    expect(r.json["plan"].updatedAt).toBe(NOW - 10);
    await call(
      h,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan("pl-abcd1234", { remind: "1d", updatedAt: NOW - 5 }),
    );
    const l = await call(h, "GET", "/api/schedule", who);
    expect(l.json["plans"]).toHaveLength(1);
    expect(l.json["plans"][0].remind).toBe("1d");
    expect((await call(h, "DELETE", "/api/schedule/pl-abcd1234", who)).json).toEqual({ ok: true });
    expect((await call(h, "GET", "/api/schedule", who)).json["plans"]).toEqual([]);
  });
  it.each([
    ["id mismatch", "pl-zzzzzzzz", plan()],
    ["bad id in body", "pl-abcd1234", plan("PL-ABCD1234")],
    ["bad adventure", "pl-abcd1234", plan("pl-abcd1234", { adventureId: "adv-ABC" })],
    ["non-UTC date", "pl-abcd1234", plan("pl-abcd1234", { startAt: "2026-12-05T15:00:00-05:00" })],
    ["far future", "pl-abcd1234", plan("pl-abcd1234", { startAt: "2040-12-05T15:00:00Z" })],
    ["bad tz", "pl-abcd1234", plan("pl-abcd1234", { tz: "x" })],
    ["duration 0", "pl-abcd1234", plan("pl-abcd1234", { durationMin: 0 })],
    ["remind 2h", "pl-abcd1234", plan("pl-abcd1234", { remind: "2h" })],
    ["status", "pl-abcd1234", plan("pl-abcd1234", { status: "late" })],
    ["extra key", "pl-abcd1234", plan("pl-abcd1234", { note: "hi" })],
  ])("rejects %s", async (_n, id, body) => {
    const h = setup();
    const who = await signIn(h);
    expect((await call(h, "PUT", `/api/schedule/${id}`, who, body)).status).toBe(400);
  });
  it("a bad id in the path is 404", async () => {
    const h = setup();
    const who = await signIn(h);
    expect((await call(h, "PUT", "/api/schedule/not-a-plan", who, plan())).status).toBe(404);
  });
  it("allows 50 live plans; done and cancelled do not count", async () => {
    const h = setup();
    const who = await signIn(h);
    const id = (i: number) => `pl-${String(i).padStart(8, "0")}`;
    for (let i = 0; i < 50; i++)
      expect((await call(h, "PUT", `/api/schedule/${id(i)}`, who, plan(id(i)))).status).toBe(200);
    expect((await call(h, "PUT", `/api/schedule/${id(50)}`, who, plan(id(50)))).status).toBe(409);
    expect(
      (await call(h, "PUT", `/api/schedule/${id(0)}`, who, plan(id(0), { status: "done" }))).status,
    ).toBe(200);
    expect((await call(h, "PUT", `/api/schedule/${id(50)}`, who, plan(id(50)))).status).toBe(200);
  });
  it("a reminder adds a due-bucket entry; done and cancelled do not", async () => {
    const h = setup();
    const who = await signIn(h);
    await call(h, "PUT", "/api/schedule/pl-aaaaaaaa", who, plan("pl-aaaaaaaa", { status: "done" }));
    await call(h, "PUT", "/api/schedule/pl-bbbbbbbb", who, plan("pl-bbbbbbbb", { remind: "none" }));
    await call(h, "PUT", "/api/schedule/pl-cccccccc", who, plan("pl-cccccccc", { push: false }));
    expect(h.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(0);
    await call(h, "PUT", "/api/schedule/pl-dddddddd", who, plan("pl-dddddddd"));
    expect(h.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(1);
  });
  it("plans are private to their customer", async () => {
    const h = setup();
    const alice = await signIn(h, "TEST-VALID-ALICE111");
    const bob = await signIn(h, "TEST-VALID-BOB22222");
    await call(h, "PUT", "/api/schedule/pl-abcd1234", alice, plan());
    expect((await call(h, "GET", "/api/schedule", bob)).json["plans"]).toEqual([]);
    await call(h, "DELETE", "/api/schedule/pl-abcd1234", bob);
    expect((await call(h, "GET", "/api/schedule", alice)).json["plans"]).toHaveLength(1);
  });
});

describe("limits and cleanup", () => {
  it("rate limits notification writes per customer", async () => {
    const h = setup({ notifLimiter: createRateLimiter({ windowMs: 60_000, max: 3 }) });
    const who = await signIn(h);
    const codes: number[] = [];
    for (let i = 0; i < 5; i++)
      codes.push((await call(h, "PUT", "/api/notifications/prefs", who, PREFS)).status);
    expect(codes).toEqual([200, 200, 200, 429, 429]);
  });
  it("deleting the account removes subscriptions, prefs and plans", async () => {
    const h = setup();
    const who = await signIn(h);
    await call(h, "POST", "/api/push/subscribe", who, { subscription: sub() });
    await call(h, "PUT", "/api/notifications/prefs", who, PREFS);
    await call(h, "PUT", "/api/schedule/pl-abcd1234", who, plan());
    expect(h.customers.keys().some((k) => k.startsWith("notif/"))).toBe(true);
    expect((await call(h, "POST", "/api/account/delete", who, { confirm: "DELETE" })).status).toBe(
      200,
    );
    expect(h.customers.keys().some((k) => k.startsWith("notif/"))).toBe(false);
  });
  it("a record stays within a few KB at the maximum", async () => {
    const h = setup();
    const who = await signIn(h);
    for (let i = 0; i < 5; i++)
      await call(h, "POST", "/api/push/subscribe", who, {
        subscription: sub("fcm.googleapis.com", i),
        label: "L".repeat(40),
      });
    for (let i = 0; i < 50; i++) {
      const id = `pl-${String(i).padStart(8, "0")}`;
      await call(h, "PUT", `/api/schedule/${id}`, who, plan(id));
    }
    const key = h.customers.keys().find((k) => k.startsWith("notif/"))!;
    const size = Buffer.byteLength(JSON.stringify((await h.customers.get(key))!.value));
    expect(size).toBeLessThan(25_000);
  });
});
