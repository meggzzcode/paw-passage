// Security review (S): executed tests for authorization, customer isolation and input limits against the real handler
// with an in-memory store. These complement server-passport.test.ts; they are not penetration tests.
import { describe, expect, it } from "vitest";
import { syntheticPremium } from "../passport/fixtures/premium.synthetic";
import { createApi, type ApiDeps } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { validateEndpoint } from "../server/passport/notifications-api";
import { TestProvider } from "../server/passport/provider";
import { signSession } from "../server/passport/session";

const ORIGIN = "https://pawsandpassage.test";
const SECRET = "s".repeat(48);

function setup(over: Partial<ApiDeps> = {}) {
  const customers = new MemoryKV();
  const premium = new MemoryKV();
  void premium.put("index", { ids: syntheticPremium.map((a) => a.id) });
  for (const a of syntheticPremium) void premium.put(`adventure/${a.id}`, a);
  const provider = new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "dev");
  const clock = { t: 1_800_000_000_000 };
  const api = createApi({
    customers,
    premium,
    provider,
    secret: SECRET,
    now: () => clock.t,
    ip: "9.9.9.9",
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    log: () => undefined,
    ...over,
  });
  return { api, customers, premium, provider, clock };
}
type H = ReturnType<typeof setup>;

async function call(
  h: H,
  method: string,
  path: string,
  o: { body?: unknown; cookie?: string; csrf?: string; origin?: string | null } = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (o.origin !== null) headers["origin"] = o.origin ?? ORIGIN;
  if (o.cookie) headers["cookie"] = o.cookie;
  if (o.csrf) headers["x-pp-csrf"] = o.csrf;
  const init: RequestInit = { method, headers };
  if (o.body !== undefined && method !== "GET") init.body = JSON.stringify(o.body);
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
async function signIn(h: H, code: string) {
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

// Every customer-only route and the methods it accepts.
const CUSTOMER_ROUTES: [string, string][] = [
  ["GET", "/api/session"],
  ["GET", "/api/progress"],
  ["PUT", "/api/progress"],
  ["GET", "/api/premium/adventures"],
  ["POST", "/api/account/export"],
  ["POST", "/api/account/delete"],
  ["POST", "/api/push/subscribe"],
  ["DELETE", "/api/push/subscribe"],
  ["GET", "/api/push/devices"],
  ["POST", "/api/push/primary"],
  ["GET", "/api/notifications/prefs"],
  ["PUT", "/api/notifications/prefs"],
  ["DELETE", "/api/notifications"],
  ["GET", "/api/schedule"],
  ["PUT", "/api/schedule/pl-abcd1234"],
  ["DELETE", "/api/schedule/pl-abcd1234"],
];

describe("every customer route refuses a missing, forged or expired session", () => {
  it.each(CUSTOMER_ROUTES)("%s %s returns 401 and no data", async (method, path) => {
    const h = setup();
    const premiumMarker = JSON.stringify(syntheticPremium[0]).slice(2, 40);
    const forged = [
      undefined,
      "pp_session=garbage",
      "pp_session=abc.def",
      // A correctly shaped token signed with the wrong secret.
      `pp_session=${signSession("w".repeat(48), `cus_${"a".repeat(32)}`, h.clock.t).token}`,
      // Correct secret but a customer that does not exist: 401, never an empty 200.
      `pp_session=${signSession(SECRET, `cus_${"b".repeat(32)}`, h.clock.t).token}`,
      // Correct secret, expired.
      `pp_session=${signSession(SECRET, `cus_${"b".repeat(32)}`, h.clock.t - 31 * 86_400_000).token}`,
    ];
    for (const [i, cookie] of forged.entries()) {
      const r = await call(h, method, path, { body: {}, ...(cookie ? { cookie } : {}) });
      // A validly signed token for a missing customer on a write is refused for the missing CSRF token first (403);
      // either way nothing is returned.
      if (i === 4 && method !== "GET") expect([401, 403]).toContain(r.status);
      else expect(r.status).toBe(401);
      expect(r.text).not.toContain(premiumMarker);
      expect(r.json["ok"]).toBe(false);
      expect(r.res.headers.get("cache-control")).toBe("no-store");
    }
  });
});

describe("state changes need CSRF and same origin on every customer write route", () => {
  const WRITES = CUSTOMER_ROUTES.filter(([m]) => m !== "GET");
  it.each(WRITES)(
    "%s %s is refused without the CSRF header or with a foreign origin",
    async (m, p) => {
      const h = setup();
      const a = await signIn(h, "TEST-VALID-CSRF0001");
      const noCsrf = await call(h, m, p, { body: {}, cookie: a.cookie });
      expect(noCsrf.status).toBe(403);
      expect(noCsrf.json["error"]).toBe("bad_csrf");
      const wrongCsrf = await call(h, m, p, {
        body: {},
        cookie: a.cookie,
        csrf: "x".repeat(a.csrf.length),
      });
      expect(wrongCsrf.status).toBe(403);
      const foreign = await call(h, m, p, {
        body: {},
        cookie: a.cookie,
        csrf: a.csrf,
        origin: "https://evil.example",
      });
      expect(foreign.status).toBe(403);
      expect(foreign.json["error"]).toBe("bad_origin");
      const noOrigin = await call(h, m, p, {
        body: {},
        cookie: a.cookie,
        csrf: a.csrf,
        origin: null,
      });
      expect(noOrigin.status).toBe(403);
    },
  );
});

describe("customer isolation", () => {
  it("two customers never see or change each other's progress, even when the body names the other", async () => {
    const h = setup();
    const a = await signIn(h, "TEST-VALID-AAAA0001");
    const b = await signIn(h, "TEST-VALID-BBBB0002");
    expect(a.cookie).not.toBe(b.cookie);
    const stored = () => h.customers.keys().filter((k) => k.startsWith("customer/"));
    expect(stored()).toHaveLength(2);
    const idB = stored().find((k) =>
      k.endsWith(
        JSON.parse(
          atob(b.cookie.split("=")[1]!.split(".")[0]!.replace(/-/g, "+").replace(/_/g, "/")),
        ).cus,
      ),
    )!;
    const before = (await h.customers.get(idB))!.etag;
    // A writes a body that tries to name customer B and a customer id in several places.
    const save = {
      v: 2,
      rev: 0,
      done: { a: { "adv-aaaaa1": 1 }, r: {} },
    };
    const w = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie,
      csrf: a.csrf,
      body: { save, cus: idB.slice(9), customer: idB, id: idB },
    });
    expect([200, 400]).toContain(w.status);
    expect((await h.customers.get(idB))!.etag).toBe(before); // B's record untouched
    expect(w.text).not.toContain("cus_");
    const gb = await call(h, "GET", "/api/progress", { cookie: b.cookie });
    expect(gb.status).toBe(200);
    expect(JSON.stringify(gb.json["save"])).not.toContain("adv-aaaaa1");
  });

  it("a customer cannot reach another customer's notification record through a plan or device id", async () => {
    const h = setup();
    const a = await signIn(h, "TEST-VALID-AAAA0001");
    const b = await signIn(h, "TEST-VALID-BBBB0002");
    const plan = {
      id: "pl-abcd1234",
      adventureId: "adv-aaaaa1",
      startAt: new Date(h.clock.t + 86_400_000).toISOString(),
      tz: "UTC",
      durationMin: 30,
      remind: "none",
      push: false,
      status: "planned",
    };
    const put = await call(h, "PUT", "/api/schedule/pl-abcd1234", {
      cookie: a.cookie,
      csrf: a.csrf,
      body: plan,
    });
    expect(put.status).toBe(200);
    // B asks for the same plan id: sees its own (empty) schedule, and its delete does not touch A's plan.
    expect((await call(h, "GET", "/api/schedule", { cookie: b.cookie })).json["plans"]).toEqual([]);
    await call(h, "DELETE", "/api/schedule/pl-abcd1234", { cookie: b.cookie, csrf: b.csrf });
    expect(
      ((await call(h, "GET", "/api/schedule", { cookie: a.cookie })).json["plans"] as unknown[])
        .length,
    ).toBe(1);
  });

  it("store keys come only from validated ids: path-like plan and device ids never reach the store", async () => {
    const h = setup();
    const a = await signIn(h, "TEST-VALID-AAAA0001");
    const keysBefore = h.customers.keys().sort().join("|");
    for (const p of [
      "/api/schedule/..%2f..%2fcustomer%2fx",
      "/api/schedule/pl-../x",
      "/api/schedule/%00",
    ]) {
      const r = await call(h, "PUT", p, { cookie: a.cookie, csrf: a.csrf, body: {} });
      expect([400, 404]).toContain(r.status);
    }
    const r = await call(h, "DELETE", "/api/push/subscribe", {
      cookie: a.cookie,
      csrf: a.csrf,
      body: { deviceId: "../customer/other" },
    });
    expect(r.status).toBe(400);
    expect(h.customers.keys().sort().join("|")).toBe(keysBefore);
  });
});

describe("entitlement is enforced on customer-only notification routes too", () => {
  it("a refunded customer gets 403 from schedule and push routes after the 24h re-check", async () => {
    const h = setup();
    const a = await signIn(h, "TEST-VALID-REFD0001");
    h.provider.setStatus("TEST-VALID-REFD0001", "refunded");
    h.clock.t += 25 * 3_600_000;
    for (const [m, p] of [
      ["GET", "/api/schedule"],
      ["GET", "/api/push/devices"],
      ["GET", "/api/notifications/prefs"],
    ] as const) {
      const r = await call(h, m, p, { cookie: a.cookie });
      expect(r.status).toBe(403);
      expect(r.json["error"]).toBe("not_entitled");
    }
  });
});

describe("public routes carry no customer data and no premium text", () => {
  it("previews, summary and push config answer without a cookie and never include premium fields", async () => {
    const h = setup();
    for (const p of ["/api/previews", "/api/premium/summary", "/api/push/config"]) {
      const r = await call(h, "GET", p);
      expect([200, 503]).toContain(r.status);
      for (const k of [
        "instructions",
        "twist",
        "reveal",
        "clue",
        "objective",
        "variations",
        "safety",
        "cus_",
      ])
        expect(r.text).not.toContain(`"${k}`);
    }
  });
  it("a preview match call with a foreign Origin is refused and an oversized body gets 413", async () => {
    const h = setup();
    expect(
      (
        await call(h, "POST", "/api/previews/match", {
          body: { dog: {} },
          origin: "https://evil.example",
        })
      ).status,
    ).toBe(403);
    const big = await call(h, "POST", "/api/previews/match", {
      body: { dog: { lifeStage: "adult" }, pad: "x".repeat(5000) },
    });
    expect(big.status).toBe(413);
    const wrongType = await call(h, "POST", "/api/previews/match", {
      body: { dog: { lifeStage: "<script>" } },
    });
    expect(wrongType.status).toBe(400);
  });
});

describe("input limits", () => {
  it("a signed-in customer sending an oversized or non-object body gets 413 or 400", async () => {
    const h = setup();
    const a = await signIn(h, "TEST-VALID-LIMT0001");
    const big = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie,
      csrf: a.csrf,
      body: { save: { pad: "x".repeat(70_000) } },
    });
    expect(big.status).toBe(413);
    const arr = await h.api.handle(
      new Request(`${ORIGIN}/api/progress`, {
        method: "PUT",
        headers: {
          origin: ORIGIN,
          cookie: a.cookie,
          "x-pp-csrf": a.csrf,
          "content-type": "application/json",
        },
        body: "[1,2,3]",
      }),
    );
    expect(arr.status).toBe(400);
  });
});

describe("rate limiting is per IP and honest about its scope", () => {
  it("separate limiters for activation and general calls, keyed by IP", async () => {
    const h = setup({ accessLimiter: createRateLimiter({ windowMs: 60_000, max: 2 }) });
    const codes = ["NOPE-NOPE-0001", "NOPE-NOPE-0002", "NOPE-NOPE-0003"];
    const out: number[] = [];
    for (const code of codes)
      out.push((await call(h, "POST", "/api/access/activate", { body: { code } })).status);
    expect(out).toEqual([403, 403, 429]);
    // The limiter is an in-memory Map: a fresh instance (a new function container) starts empty. This is the documented limit.
    const fresh = createRateLimiter({ windowMs: 60_000, max: 2 });
    expect(fresh.allow("a:9.9.9.9")).toBe(true);
  });
});

describe("push endpoint SSRF allow-list", () => {
  const good = "https://fcm.googleapis.com/fcm/send/abcdefghijklmnop";
  it("accepts only https push services on port 443", () => {
    expect(validateEndpoint(good)).toBe(good);
    expect(
      validateEndpoint("https://updates.push.services.mozilla.com/wpush/v2/abcdefghijkl"),
    ).not.toBeNull();
    expect(validateEndpoint("https://web.push.apple.com/QabcdefghijklmnopQ")).not.toBeNull();
  });
  it.each([
    "http://fcm.googleapis.com/fcm/send/abcdefghijklmnop",
    "https://fcm.googleapis.com.evil.example/fcm/send/abcdefghij",
    "https://evil.example/fcm.googleapis.com/abcdefghijklmnop",
    "https://user:pw@fcm.googleapis.com/fcm/send/abcdefghijk",
    "https://fcm.googleapis.com:8443/fcm/send/abcdefghijklmn",
    "https://169.254.169.254/latest/meta-data/abcdefghijk",
    "https://localhost/abcdefghijklmnopqrstu",
    "https://push.apple.com/abcdefghijklmnopqrstuvw",
    "https://notpush.apple.com/abcdefghijklmnopqrstu",
    "https://x.notify.windows.com./abcdefghijklmnopqrst",
    "https://fcm.googleapis.com/fcm/send/abc#frag-abcdefghijk",
  ])("rejects %s", (u) => {
    expect(validateEndpoint(u)).toBeNull();
  });
});
