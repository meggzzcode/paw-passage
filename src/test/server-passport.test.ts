// Server-side purchase verification, sessions, progress sync and premium delivery, against an in-memory store and a
// fake provider. Gumroad specifics are UNVERIFIED (handoff task E4); these tests pin OUR behaviour, not Gumroad's.
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  add,
  addToCollection,
  createCollection,
  emptySave,
  listCollections,
  members,
  type Save,
} from "../passport/progress";
import { syntheticPremium } from "../passport/fixtures/premium.synthetic";
import { createApi, type ApiDeps } from "../server/passport/api";
import { customersStoreName, premiumStoreName } from "../server/passport/config";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import {
  createGumroadProvider,
  selectProvider,
  TestProvider,
  type CheckoutProvider,
} from "../server/passport/provider";
import { signSession, verifySession } from "../server/passport/session";
import { CustomerStore } from "../server/passport/store";

const ORIGIN = "https://pawsandpassage.test";
const SECRET = "s".repeat(48);
const GOOD = "TEST-VALID-ABC12345";

type Harness = ReturnType<typeof setup>;
function setup(over: Partial<ApiDeps> = {}) {
  const customers = new MemoryKV();
  const premium = new MemoryKV();
  void premium.put("index", { ids: syntheticPremium.map((a) => a.id) });
  for (const a of syntheticPremium) void premium.put(`adventure/${a.id}`, a);
  const provider = new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "dev");
  const clock = { t: 1_800_000_000_000 };
  const deps: ApiDeps = {
    customers,
    premium,
    provider,
    secret: SECRET,
    now: () => clock.t,
    ip: "1.2.3.4",
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    ...over,
  };
  const api = createApi(deps);
  return { api, customers, premium, provider, clock, deps };
}

type CallOpts = {
  body?: unknown;
  cookie?: string;
  csrf?: string;
  origin?: string | null;
  raw?: string;
};
async function call(h: Harness, method: string, path: string, o: CallOpts = {}) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (o.origin !== null) headers["origin"] = o.origin ?? ORIGIN;
  if (o.cookie) headers["cookie"] = o.cookie;
  if (o.csrf) headers["x-pp-csrf"] = o.csrf;
  const init: RequestInit = { method, headers };
  if (o.raw !== undefined) init.body = o.raw;
  else if (o.body !== undefined) init.body = JSON.stringify(o.body);
  const res = await h.api.handle(new Request(`${ORIGIN}${path}`, init));
  const text = await res.text();
  const setCookie = res.headers.get("set-cookie");
  return {
    res,
    status: res.status,
    text,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: (text ? JSON.parse(text) : {}) as Record<string, any>,
    cookie: setCookie ? setCookie.split(";")[0]! : undefined,
    setCookie,
  };
}

async function activate(h: Harness, code = GOOD, localSave?: Save) {
  const r = await call(h, "POST", "/api/access/activate", {
    body: { code, ...(localSave ? { localSave } : {}) },
  });
  return { ...r, csrf: r.json["csrf"] as string };
}
const withDone = (id: string, at = 1000): Save => ({
  ...emptySave(),
  done: add(emptySave().done, id, at),
});
const customerKeys = (h: Harness) => h.customers.keys().filter((k) => k.startsWith("customer/"));

afterEach(() => vi.restoreAllMocks());

describe("activation and verification", () => {
  it("valid code grants access, sets a hardened cookie, and returns no id or code", async () => {
    const h = setup();
    const r = await activate(h);
    expect(r.status).toBe(200);
    expect(r.json["reason"]).toBe("activated");
    expect(r.setCookie).toMatch(/^pp_session=/);
    expect(r.setCookie).toMatch(/HttpOnly/);
    expect(r.setCookie).toMatch(/Secure/);
    expect(r.setCookie).toMatch(/SameSite=Lax/);
    expect(r.text).not.toContain(GOOD);
    expect(r.text).not.toContain("cus_");
  });

  it.each([
    ["invalid", "NOT-A-REAL-CODE", 403, "invalid_code"],
    ["refunded", "TEST-REFUNDED-AAAA1", 403, "refunded"],
    ["disputed", "TEST-DISPUTED-AAAA1", 403, "disputed"],
    ["revoked", "TEST-REVOKED-AAAA1", 403, "revoked"],
  ])("%s code is refused and creates no customer", async (_n, code, status, reason) => {
    const h = setup();
    const r = await activate(h, code);
    expect(r.status).toBe(status);
    expect(r.json["reason"]).toBe(reason);
    expect(r.setCookie).toBeNull();
    expect(customerKeys(h)).toHaveLength(0);
  });

  it("provider unavailable gives 503 and never grants", async () => {
    const h = setup();
    const r = await activate(h, "TEST-DOWN-AAAA1");
    expect(r.status).toBe(503);
    expect(r.json["reason"]).toBe("provider_unavailable");
    expect(customerKeys(h)).toHaveLength(0);
  });

  it("rejects malformed codes and bodies", async () => {
    const h = setup();
    expect((await activate(h, "x y")).status).toBe(400);
    expect((await call(h, "POST", "/api/access/activate", { raw: "{nope" })).status).toBe(400);
  });

  it("activating twice returns the same customer", async () => {
    const h = setup();
    await activate(h);
    const second = await activate(h);
    expect(second.json["reason"]).toBe("already_active");
    expect(customerKeys(h)).toHaveLength(1);
  });

  it("restore on a second device (no cookie) finds the same customer and its progress", async () => {
    const h = setup();
    const a = await activate(h, GOOD, withDone("adv-aaaaa1"));
    const put = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: { save: withDone("adv-bbbbb2", 2000), baseRev: 1 },
    });
    expect(put.status).toBe(200);
    const b = await call(h, "POST", "/api/access/restore", { body: { code: GOOD } });
    expect(b.json["reason"]).toBe("restored");
    expect(customerKeys(h)).toHaveLength(1);
    expect(members(b.json["save"].done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
    expect(b.cookie).toBeTruthy();
  });

  it("a free local save is merged into the paid record and never reset", async () => {
    const h = setup();
    const first = await activate(h, GOOD, withDone("adv-aaaaa1"));
    expect(members(first.json["save"].done)).toEqual(["adv-aaaaa1"]);
    const again = await activate(h, GOOD, withDone("adv-ccccc3", 3000));
    expect(members(again.json["save"].done).sort()).toEqual(["adv-aaaaa1", "adv-ccccc3"]);
    const noLocal = await activate(h, GOOD);
    expect(members(noLocal.json["save"].done)).toHaveLength(2);
  });

  it("a v1 local save activates into a v2 record", async () => {
    const h = setup();
    const v1 = {
      v: 1,
      rev: 0,
      profile: { data: { name: "Juno", nervousAroundPeople: true }, at: 5 },
      done: { added: { "adv-aaaaa1": 7 }, removed: {} },
      favorites: { added: {}, removed: {} },
      saved: { added: {}, removed: {} },
      memories: {},
      repeats: {},
    };
    const r = await call(h, "POST", "/api/access/activate", {
      body: { code: GOOD, localSave: v1 },
    });
    expect(r.status).toBe(200);
    expect(r.json["save"].v).toBe(2);
    expect(members(r.json["save"].done)).toEqual(["adv-aaaaa1"]);
    expect(r.json["save"].profile.data).toEqual({ name: "Juno", people: "nervous" });
    const again = await activate(h, GOOD, withDone("adv-bbbbb2", 3000));
    expect(members(again.json["save"].done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
  });

  it("an invalid local save is refused", async () => {
    const h = setup();
    const r = await call(h, "POST", "/api/access/activate", {
      body: { code: GOOD, localSave: { v: 9 } },
    });
    expect(r.status).toBe(400);
  });
});

describe("sessions and CSRF", () => {
  it("tampered, wrong-secret and expired cookies are rejected", async () => {
    const h = setup();
    const a = await activate(h);
    const good = await call(h, "GET", "/api/progress", { cookie: a.cookie! });
    expect(good.status).toBe(200);
    const tampered = a.cookie!.slice(0, -2) + (a.cookie!.endsWith("AA") ? "BB" : "AA");
    expect((await call(h, "GET", "/api/progress", { cookie: tampered })).status).toBe(401);
    const forged = signSession("z".repeat(48), "cus_" + "0".repeat(32), h.clock.t).token;
    expect((await call(h, "GET", "/api/progress", { cookie: `pp_session=${forged}` })).status).toBe(
      401,
    );
    h.clock.t += 31 * 86_400_000;
    expect((await call(h, "GET", "/api/progress", { cookie: a.cookie! })).status).toBe(401);
    expect(verifySession(SECRET, "garbage", h.clock.t)).toBeNull();
  });

  it("state changes need the CSRF header and a same-origin Origin", async () => {
    const h = setup();
    const a = await activate(h);
    const body = { save: emptySave(), baseRev: 0 };
    expect((await call(h, "PUT", "/api/progress", { cookie: a.cookie!, body })).status).toBe(403);
    expect(
      (await call(h, "PUT", "/api/progress", { cookie: a.cookie!, csrf: "wrong", body })).json[
        "error"
      ],
    ).toBe("bad_csrf");
    const evil = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body,
      origin: "https://evil.test",
    });
    expect(evil.json["error"]).toBe("bad_origin");
    const none = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body,
      origin: null,
    });
    expect(none.json["error"]).toBe("bad_origin");
    expect(
      (await call(h, "PUT", "/api/progress", { cookie: a.cookie!, csrf: a.csrf, body })).status,
    ).toBe(200);
  });

  it("GET /api/progress without a cookie is 401", async () => {
    expect((await call(setup(), "GET", "/api/progress")).status).toBe(401);
  });
});

describe("collections sync", () => {
  const COL = "col-abcd1234";
  const hand = (ids: string[]): Save =>
    createCollection(emptySave(), { id: COL, kind: "handpicked", name: "Rainy", ids }, 10);

  it("collections from two devices merge and survive a PUT", async () => {
    const h = setup();
    const a = await activate(h);
    const phone = addToCollection(hand(["adv-aaaaa1"]), COL, "adv-bbbbb2", 20);
    const laptop = addToCollection(hand(["adv-aaaaa1"]), COL, "adv-ccccc3", 30);
    for (const save of [phone, laptop]) {
      const r = await call(h, "PUT", "/api/progress", {
        cookie: a.cookie!,
        csrf: a.csrf,
        body: { save, baseRev: 0 },
      });
      expect(r.status).toBe(200);
    }
    const got = await call(h, "GET", "/api/progress", { cookie: a.cookie! });
    expect(got.json["save"].v).toBe(2);
    const cols = listCollections(got.json["save"]);
    expect(cols).toHaveLength(1);
    expect(cols[0]).toMatchObject({
      kind: "handpicked",
      ids: ["adv-aaaaa1", "adv-bbbbb2", "adv-ccccc3"],
    });
  });

  it("an old v1 record in storage is upgraded on read and accepts a v2 write", async () => {
    const h = setup();
    const a = await activate(h);
    const key = customerKeys(h)[0]!;
    const cur = (await h.customers.get(key))!;
    const rec = cur.value as { save: unknown };
    rec.save = {
      v: 1,
      rev: 1,
      profile: { data: {}, at: 0 },
      done: { added: { "adv-aaaaa1": 5 }, removed: {} },
      favorites: { added: {}, removed: {} },
      saved: { added: {}, removed: {} },
      memories: {},
      repeats: {},
    };
    await h.customers.update(key, rec, cur.etag);
    const r = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: { save: hand(["adv-bbbbb2"]), baseRev: 1 },
    });
    expect(r.status).toBe(200);
    expect(r.json["save"].v).toBe(2);
    expect(members(r.json["save"].done)).toEqual(["adv-aaaaa1"]);
    expect(listCollections(r.json["save"])).toHaveLength(1);
  });

  it("malformed collections and unknown keys are refused", async () => {
    const h = setup();
    const a = await activate(h);
    const bad = hand([]);
    (bad.collections[COL] as unknown as { name: { v: string } }).name.v = "x".repeat(41);
    for (const save of [bad, { ...emptySave(), sneaky: 1 }]) {
      const r = await call(h, "PUT", "/api/progress", {
        cookie: a.cookie!,
        csrf: a.csrf,
        body: { save, baseRev: 0 },
      });
      expect(r.status).toBe(400);
    }
  });
});

describe("progress sync", () => {
  it("two simultaneous PUTs both survive", async () => {
    const h = setup();
    const a = await activate(h);
    const put = (id: string) =>
      call(h, "PUT", "/api/progress", {
        cookie: a.cookie!,
        csrf: a.csrf,
        body: { save: withDone(id), baseRev: 0 },
      });
    const [x, y] = await Promise.all([put("adv-aaaaa1"), put("adv-bbbbb2")]);
    expect([x.status, y.status]).toEqual([200, 200]);
    const r = await call(h, "GET", "/api/progress", { cookie: a.cookie! });
    expect(members(r.json["save"].done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
  });

  it("an etag conflict re-reads, re-merges and retries", async () => {
    const h = setup();
    const a = await activate(h);
    const store = new CustomerStore(h.customers, () => h.clock.t);
    const id = h.customers
      .keys()
      .find((k) => k.startsWith("customer/"))!
      .slice("customer/".length);
    h.customers.beforeUpdate = async () => {
      await store.applyProgress(id, withDone("adv-ddddd4")); // competing writer lands first
    };
    const r = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: { save: withDone("adv-eeeee5"), baseRev: 0 },
    });
    expect(r.status).toBe(200);
    expect(members(r.json["save"].done).sort()).toEqual(["adv-ddddd4", "adv-eeeee5"]);
    expect(h.customers.updateAttempts).toBeGreaterThanOrEqual(3);
  });

  it("a stale baseRev is merged, not rejected, and flagged stale", async () => {
    const h = setup();
    const a = await activate(h);
    const put = (id: string, baseRev: number) =>
      call(h, "PUT", "/api/progress", {
        cookie: a.cookie!,
        csrf: a.csrf,
        body: { save: withDone(id), baseRev },
      });
    const first = await put("adv-aaaaa1", 0);
    expect(first.json["stale"]).toBe(false);
    const stale = await put("adv-bbbbb2", 0);
    expect(stale.status).toBe(200);
    expect(stale.json["stale"]).toBe(true);
    expect(members(stale.json["save"].done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
  });

  it("a duplicate request is idempotent: same rev, no second write", async () => {
    const h = setup();
    const a = await activate(h);
    const body = { save: withDone("adv-aaaaa1"), baseRev: 0 };
    const one = await call(h, "PUT", "/api/progress", { cookie: a.cookie!, csrf: a.csrf, body });
    const two = await call(h, "PUT", "/api/progress", { cookie: a.cookie!, csrf: a.csrf, body });
    expect(two.json["rev"]).toBe(one.json["rev"]);
    expect(two.json["changed"]).toBe(false);
    expect(two.json["save"]).toEqual(one.json["save"]);
  });

  it("the client cannot set the revision or name another customer", async () => {
    const h = setup();
    const a = await activate(h, "TEST-VALID-AAAA1111");
    const b = await activate(h, "TEST-VALID-BBBB2222", withDone("adv-bbbbb2"));
    const ids = customerKeys(h).map((k) => k.slice("customer/".length));
    const bId = ids[0]!;
    const sneaky = { ...withDone("adv-aaaaa1"), rev: 9999 };
    const r = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: { save: sneaky, baseRev: 0, cus: bId, id: bId, customerId: ids[1] },
    });
    expect(r.status).toBe(200);
    expect(r.json["rev"]).toBeLessThan(10);
    // B's progress is exactly what B stored, untouched by A's write.
    const bGet = await call(h, "GET", "/api/progress", { cookie: b.cookie! });
    expect(members(bGet.json["save"].done)).toEqual(["adv-bbbbb2"]);
    const aGet = await call(h, "GET", "/api/progress", { cookie: a.cookie! });
    expect(members(aGet.json["save"].done)).toEqual(["adv-aaaaa1"]);
  });

  it("oversized payloads get 413, invalid saves 400", async () => {
    const h = setup();
    const a = await activate(h);
    const big = { save: emptySave(), baseRev: 0, pad: "x".repeat(70_000) };
    expect(
      (await call(h, "PUT", "/api/progress", { cookie: a.cookie!, csrf: a.csrf, body: big }))
        .status,
    ).toBe(413);
    expect(
      (
        await call(h, "POST", "/api/access/activate", {
          body: { code: GOOD, pad: "x".repeat(70_000) },
        })
      ).status,
    ).toBe(413);
    const bad = await call(h, "PUT", "/api/progress", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: { save: { v: 2 } },
    });
    expect(bad.status).toBe(400);
  });
});

describe("premium delivery and revocation", () => {
  it("is 401 without a session and returns the premium store contents when entitled", async () => {
    const h = setup();
    expect((await call(h, "GET", "/api/premium/adventures")).status).toBe(401);
    const a = await activate(h);
    const r = await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! });
    expect(r.status).toBe(200);
    expect(r.json["adventures"].map((x: { id: string }) => x.id).sort()).toEqual(
      syntheticPremium.map((x) => x.id).sort(),
    );
  });

  it("is 403 when the entitlement is not active, and progress is kept", async () => {
    const h = setup();
    const a = await activate(h, GOOD, withDone("adv-aaaaa1"));
    h.provider.setStatus(GOOD, "refunded");
    h.clock.t += 25 * 3_600_000; // past the 24h re-verification window
    const prem = await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! });
    expect(prem.status).toBe(403);
    expect(prem.json["reason"]).toBe("refunded");
    const prog = await call(h, "GET", "/api/progress", { cookie: a.cookie! });
    expect(prog.status).toBe(200);
    expect(members(prog.json["save"].done)).toEqual(["adv-aaaaa1"]);
    // Restoring with the refunded code is refused too, and still creates no second customer.
    expect((await call(h, "POST", "/api/access/restore", { body: { code: GOOD } })).status).toBe(
      403,
    );
    expect(customerKeys(h)).toHaveLength(1);
  });

  it.each(["disputed", "revoked", "invalid"] as const)(
    "a later %s re-check revokes premium",
    async (st) => {
      const h = setup();
      const a = await activate(h);
      h.provider.setStatus(GOOD, st);
      h.clock.t += 25 * 3_600_000;
      expect((await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! })).status).toBe(
        403,
      );
    },
  );

  it("re-verifies at most every 24h and ignores an unavailable provider", async () => {
    const h = setup();
    const a = await activate(h);
    const spy = vi.spyOn(h.provider, "verify");
    h.provider.setStatus(GOOD, "refunded");
    h.clock.t += 3_600_000;
    expect((await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! })).status).toBe(
      200,
    );
    expect(spy).not.toHaveBeenCalled();
    h.provider.setStatus(GOOD, "unavailable");
    h.clock.t += 24 * 3_600_000;
    expect((await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! })).status).toBe(
      200,
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("account export and delete", () => {
  it("exports progress as a download and deletes it only after confirmation", async () => {
    const h = setup();
    const a = await activate(h, GOOD, withDone("adv-aaaaa1"));
    const ex = await call(h, "POST", "/api/account/export", { cookie: a.cookie!, csrf: a.csrf });
    expect(ex.res.headers.get("content-disposition")).toMatch(/attachment/);
    expect(members(ex.json["progress"].done)).toEqual(["adv-aaaaa1"]);
    expect(ex.text).not.toContain(GOOD);
    const no = await call(h, "POST", "/api/account/delete", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: {},
    });
    expect(no.status).toBe(400);
    expect(customerKeys(h)).toHaveLength(1);
    const del = await call(h, "POST", "/api/account/delete", {
      cookie: a.cookie!,
      csrf: a.csrf,
      body: { confirm: "DELETE" },
    });
    expect(del.status).toBe(200);
    expect(h.customers.keys()).toHaveLength(0);
    expect((await call(h, "GET", "/api/progress", { cookie: a.cookie! })).status).toBe(401);
  });
});

describe("privacy, headers and limits", () => {
  it("never logs or stores the raw code, and every response is no-store", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map((m) =>
      vi.spyOn(console, m).mockImplementation(() => {}),
    );
    const h = setup();
    const responses = [
      await activate(h),
      await activate(h, "TEST-REFUNDED-ZZZZ9"),
      await activate(h, "TEST-DOWN-ZZZZ9"),
      await call(h, "GET", "/api/session"),
      await call(h, "GET", "/api/nope"),
      await call(h, "DELETE", "/api/progress"),
    ];
    const a = responses[0]!;
    responses.push(await call(h, "POST", "/api/access/restore", { body: { code: GOOD } }));
    responses.push(await call(h, "GET", "/api/session", { cookie: a.cookie! }));
    responses.push(await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! }));
    const logged = spies
      .flatMap((s) => s.mock.calls.map((c) => c.map(String).join(" ")))
      .join("\n");
    expect(logged.length).toBeGreaterThan(0); // logging is on, so the assertions below mean something
    for (const code of [GOOD, "TEST-REFUNDED-ZZZZ9", "TEST-DOWN-ZZZZ9"]) {
      expect(logged).not.toContain(code);
      expect(h.customers.dump()).not.toContain(code);
      for (const r of responses) expect(r.text).not.toContain(code);
    }
    expect(logged).not.toContain(SECRET);
    for (const r of responses) expect(r.res.headers.get("cache-control")).toBe("no-store");
  });

  it("rate limits access attempts per IP", async () => {
    const h = setup({ accessLimiter: createRateLimiter({ windowMs: 60_000, max: 3 }) });
    const statuses: number[] = [];
    for (let i = 0; i < 5; i++) statuses.push((await activate(h, "NOT-A-REAL-CODE")).status);
    expect(statuses.slice(3)).toEqual([429, 429]);
  });

  it("fails closed without a usable SESSION_SECRET", async () => {
    const h = setup({ secret: "short" });
    expect((await activate(h)).status).toBe(503);
  });
});

describe("store and provider isolation", () => {
  it("preview and branch deploys use preview stores; only production uses production stores", () => {
    expect(customersStoreName("production")).toBe("customers-production");
    expect(premiumStoreName("production")).toBe("premium-production");
    for (const c of ["deploy-preview", "branch-deploy", "dev", undefined, "weird"]) {
      expect(customersStoreName(c)).toBe("customers-preview");
      expect(premiumStoreName(c)).toBe("premium-preview");
    }
  });

  it("the test provider cannot be constructed in production or without the flag", () => {
    expect(() => new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "production")).toThrow();
    expect(() => new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, undefined)).toThrow();
    expect(() => new TestProvider({}, "dev")).toThrow();
    expect(() => new TestProvider({ PP_ALLOW_TEST_PROVIDER: "true" }, "dev")).toThrow();
    expect(() => new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "deploy-preview")).not.toThrow();
  });

  it("selectProvider ignores the test flag in production", async () => {
    const p = selectProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "production");
    expect(p.name).not.toBe("test");
    expect((await p.verify(GOOD)).status).toBe("unavailable"); // no product id configured: never a silent grant
    expect(selectProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "deploy-preview").name).toBe("test");
    expect(selectProvider({ GUMROAD_PRODUCT_ID: "p" }, "production").name).toBe("gumroad");
  });
});

describe("Gumroad adapter (response shapes UNVERIFIED, handoff task E4)", () => {
  const reply = (body: unknown, status = 200) =>
    vi.fn(
      async (_u: string | URL | Request, _i?: RequestInit) =>
        new Response(JSON.stringify(body), { status }),
    );
  const mk = (f: ReturnType<typeof reply>): CheckoutProvider =>
    createGumroadProvider({ productId: "prod_x", fetchImpl: f as unknown as typeof fetch });

  it("posts the code in the body, never in the URL, without incrementing uses", async () => {
    const f = reply({ success: true, purchase: { id: "sale1" } });
    const r = await mk(f).verify("SECRETKEY-1234");
    expect(r).toEqual({ status: "valid", purchaseRef: "sale1" });
    const [url, init] = f.mock.calls[0]!;
    expect(String(url)).toBe("https://api.gumroad.com/v2/licenses/verify");
    expect(String(url)).not.toContain("SECRETKEY");
    const params = new URLSearchParams(String(init?.body));
    expect(params.get("product_id")).toBe("prod_x");
    expect(params.get("license_key")).toBe("SECRETKEY-1234");
    expect(params.get("increment_uses_count")).toBe("false");
  });

  it("maps success false, refunded, chargebacked and disputed", async () => {
    expect((await mk(reply({ success: false }, 404)).verify("KEY-12345678")).status).toBe(
      "invalid",
    );
    expect(
      (
        await mk(reply({ success: true, purchase: { id: "s", refunded: true } })).verify(
          "KEY-12345678",
        )
      ).status,
    ).toBe("refunded");
    expect(
      (
        await mk(reply({ success: true, purchase: { id: "s", chargebacked: true } })).verify(
          "KEY-12345678",
        )
      ).status,
    ).toBe("disputed");
    expect(
      (
        await mk(reply({ success: true, purchase: { id: "s", disputed: true } })).verify(
          "KEY-12345678",
        )
      ).status,
    ).toBe("disputed");
    expect(
      (
        await mk(
          reply({ success: true, purchase: { id: "s", disputed: true, dispute_won: true } }),
        ).verify("KEY-12345678")
      ).status,
    ).toBe("valid");
  });

  it("treats network errors, timeouts, 5xx, 429 and junk as unavailable", async () => {
    const boom = vi.fn(async () => {
      throw new Error("ECONNRESET");
    });
    expect((await mk(boom as never).verify("KEY-12345678")).status).toBe("unavailable");
    expect((await mk(reply({}, 503)).verify("KEY-12345678")).status).toBe("unavailable");
    expect((await mk(reply({}, 429)).verify("KEY-12345678")).status).toBe("unavailable");
    const junk = vi.fn(async () => new Response("<html>", { status: 200 }));
    expect((await mk(junk as never).verify("KEY-12345678")).status).toBe("unavailable");
  });

  it("is used end to end through the API and unavailable never revokes", async () => {
    let mode: "ok" | "down" = "ok";
    const fetchImpl = vi.fn(async () => {
      if (mode === "down") throw new Error("down");
      return new Response(JSON.stringify({ success: true, purchase: { id: "sale9" } }));
    });
    const h = setup({
      provider: createGumroadProvider({ productId: "p", fetchImpl: fetchImpl as never }),
    });
    const a = await activate(h, "REAL-LOOKING-KEY-1");
    expect(a.status).toBe(200);
    mode = "down";
    h.clock.t += 48 * 3_600_000;
    expect((await call(h, "GET", "/api/premium/adventures", { cookie: a.cookie! })).status).toBe(
      200,
    );
  });
});

describe("public premium summary", () => {
  const get = (h: Harness) => call(h, "GET", "/api/premium/summary");
  async function seeded(items: { id: string; status: string; collections: string[] }[]) {
    const h = setup();
    await h.premium.put("index", { v: 1, ids: items.map((i) => i.id), items });
    return h;
  }
  it("counts published only, by collection, with no adventure fields and no session", async () => {
    const h = await seeded([
      { id: "adv-p1", status: "published", collections: ["home", "rainy"] },
      { id: "adv-p2", status: "published", collections: ["home"] },
      { id: "adv-d1", status: "draft", collections: ["secret-draft"] },
    ]);
    const r = await get(h);
    expect(r.status).toBe(200);
    expect(r.json).toEqual({
      ok: true,
      count: 2,
      collections: [
        { slug: "home", count: 2 },
        { slug: "rainy", count: 1 },
      ],
    });
    expect(r.text).not.toMatch(/adv-|secret-draft|title/);
    expect(r.setCookie).toBeNull();
  });
  it("is cacheable for ten minutes", async () => {
    const r = await get(await seeded([]));
    expect(r.res.headers.get("cache-control")).toBe("public, max-age=600");
  });
  it("falls back to an ids-only index and leaks nothing", async () => {
    const r = await get(setup());
    expect(r.status).toBe(200);
    expect(r.json["count"]).toBe(syntheticPremium.filter((a) => a.status === "published").length);
    for (const a of syntheticPremium) {
      expect(r.text).not.toContain(a.id);
      expect(r.text).not.toContain(a.title);
    }
  });
  it("is safe when the store is empty or unavailable", async () => {
    const empty = await get(setup({ premium: new MemoryKV() }));
    expect(empty.status).toBe(200);
    expect(empty.json).toMatchObject({ count: 0, collections: [] });
    const broken = new MemoryKV();
    vi.spyOn(broken, "get").mockRejectedValue(new Error("down"));
    const r = await get(setup({ premium: broken }));
    expect(r.status).toBe(503);
    expect(r.text).not.toContain("down");
  });
  it("is rate limited and works without a configured session secret", async () => {
    const limited = setup({ generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1 }) });
    expect((await get(limited)).status).toBe(200);
    expect((await get(limited)).status).toBe(429);
    expect((await get(setup({ secret: undefined }))).status).toBe(200);
  });
  it("only allows GET, and the premium library itself still needs a session", async () => {
    const h = setup();
    expect((await call(h, "POST", "/api/premium/summary", { body: {} })).status).toBe(405);
    expect((await call(h, "GET", "/api/premium/adventures")).status).toBe(401);
  });
});
