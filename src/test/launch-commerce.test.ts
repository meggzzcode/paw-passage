// Launch-readiness checks for the commercial path, at HTTP level against the real handler with an in-memory store and a
// fake Gumroad (fetch stub). No network, no accounts. The Gumroad field names remain UNVERIFIED (CW-PAY-1): these tests
// pin OUR behavior given the assumed shape. The model is pull verification (no webhook): refunds are noticed by the
// 24 hour re-check, so there is no signature to verify; replay and duplicate handling is by purchase reference.
import { describe, expect, it } from "vitest";
import { emptySave } from "../passport/progress";
import { syntheticPremium } from "../passport/fixtures/premium.synthetic";
import { createApi } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { createGumroadProvider } from "../server/passport/provider";

const ORIGIN = "https://pawsandpassage.test";
const SECRET = "s".repeat(48);
const KEY = "LICENSE-KEY-ABCD-1234";
const DAY = 24 * 3_600_000;

type Mode = "valid" | "refunded" | "chargebacked" | "disabled" | "unknown";
function world() {
  const customers = new MemoryKV();
  const premium = new MemoryKV();
  void premium.put("index", { ids: syntheticPremium.map((a) => a.id) });
  for (const a of syntheticPremium) void premium.put(`adventure/${a.id}`, a);
  const st = { mode: "valid" as Mode, ref: "sale-1", calls: 0, t: 1_800_000_000_000 };
  const fetchImpl = async () => {
    st.calls++;
    if (st.mode === "unknown")
      return new Response(JSON.stringify({ success: false }), { status: 404 });
    const purchase: Record<string, unknown> = { id: st.ref };
    if (st.mode === "refunded") purchase["refunded"] = true;
    if (st.mode === "chargebacked") purchase["chargebacked"] = true;
    if (st.mode === "disabled") purchase["license_disabled"] = true;
    return new Response(JSON.stringify({ success: true, purchase }));
  };
  const api = createApi({
    customers,
    premium,
    provider: createGumroadProvider({ productId: "p", fetchImpl: fetchImpl as never }),
    secret: SECRET,
    now: () => st.t,
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    log: () => undefined,
  });
  async function call(method: string, path: string, o: { body?: unknown; cookie?: string } = {}) {
    const headers: Record<string, string> = { "content-type": "application/json", origin: ORIGIN };
    if (o.cookie) headers["cookie"] = o.cookie;
    const init: RequestInit = { method, headers };
    if (o.body !== undefined) init.body = JSON.stringify(o.body);
    const res = await api.handle(new Request(`${ORIGIN}${path}`, init));
    const text = await res.text();
    return { status: res.status, text, cookie: res.headers.get("set-cookie")?.split(";")[0] };
  }
  return { st, customers, call };
}
const markers = () =>
  syntheticPremium
    .flatMap((a) => [...a.instructions, a.twist ?? "", a.reveal ?? "", a.title])
    .filter(Boolean);
const noPremiumText = (text: string) => {
  for (const m of markers()) expect(text).not.toContain(m);
};

describe("launch: purchase activation and recovery (Gumroad shape UNVERIFIED)", () => {
  it("activates once per purchase reference: duplicates and replays reuse the same customer", async () => {
    const w = world();
    const a = await w.call("POST", "/api/access/activate", { body: { code: KEY } });
    expect(a.status).toBe(200);
    const n = w.customers.keys().filter((k) => k.startsWith("customer/")).length;
    expect(n).toBe(1);
    await w.call("POST", "/api/access/activate", { body: { code: KEY } });
    await w.call("POST", "/api/access/restore", { body: { code: KEY } }); // new device, no cookie, no URL key
    expect(w.customers.keys().filter((k) => k.startsWith("customer/")).length).toBe(1);
    // The same purchase reached through a differently spelled key text is still one customer (reference, not text).
    await w.call("POST", "/api/access/restore", { body: { code: "OTHER-KEY-TEXT-9999" } });
    expect(w.customers.keys().filter((k) => k.startsWith("customer/")).length).toBe(1);
  });

  it("restore needs only the license key: no URL key, no cookie, and the key never appears in a response", async () => {
    const w = world();
    await w.call("POST", "/api/access/activate", { body: { code: KEY } });
    const r = await w.call("POST", "/api/access/restore", { body: { code: KEY } });
    expect(r.status).toBe(200);
    expect(r.cookie).toMatch(/^pp_session=/);
    expect(r.text).not.toContain(KEY);
    const p = await w.call("GET", "/api/premium/adventures", { cookie: r.cookie! });
    expect(p.status).toBe(200);
  });

  it.each([
    ["refunded", "refunded"],
    ["chargebacked", "disputed"],
    ["disabled", "revoked"],
  ] as const)(
    "a %s purchase loses premium delivery at the next 24h check, and cannot restore",
    async (mode, reason) => {
      const w = world();
      const a = await w.call("POST", "/api/access/activate", { body: { code: KEY } });
      expect((await w.call("GET", "/api/premium/adventures", { cookie: a.cookie! })).status).toBe(
        200,
      );
      w.st.mode = mode;
      // Within the 24h cache the stored entitlement is trusted (documented latency of up to 24h).
      w.st.t += DAY - 60_000;
      expect((await w.call("GET", "/api/premium/adventures", { cookie: a.cookie! })).status).toBe(
        200,
      );
      w.st.t += 2 * 60_000;
      const gone = await w.call("GET", "/api/premium/adventures", { cookie: a.cookie! });
      expect(gone.status).toBe(403);
      expect(gone.text).toContain(reason);
      noPremiumText(gone.text);
      const again = await w.call("POST", "/api/access/restore", { body: { code: KEY } });
      expect(again.status).toBe(403);
      expect(again.cookie).toBeUndefined();
    },
  );

  it("an unknown or malformed key grants nothing and a provider outage neither grants nor revokes", async () => {
    const w = world();
    w.st.mode = "unknown";
    expect((await w.call("POST", "/api/access/activate", { body: { code: KEY } })).status).toBe(
      403,
    );
    expect((await w.call("POST", "/api/access/activate", { body: { code: "x" } })).status).toBe(
      400,
    );
    expect(w.customers.keys().filter((k) => k.startsWith("customer/"))).toHaveLength(0);
  });
});

describe("launch: protected premium delivery", () => {
  it("unauthenticated, tampered and wrong-secret sessions get nothing; public routes carry no premium text", async () => {
    const w = world();
    const a = await w.call("POST", "/api/access/activate", { body: { code: KEY } });
    const forged = a.cookie!.slice(0, -3) + "AAA";
    for (const cookie of [undefined, "pp_session=garbage", forged]) {
      const r = await w.call("GET", "/api/premium/adventures", cookie ? { cookie } : {});
      expect(r.status).toBe(401);
      noPremiumText(r.text);
    }
    for (const path of ["/api/premium/summary", "/api/previews"]) {
      const r = await w.call("GET", path);
      noPremiumText(r.text);
      for (const k of ["instructions", "twist", "reveal", "objective", "variations", "safety"])
        expect(r.text, `${path} ${k}`).not.toContain(`"${k}"`);
    }
    // Entitled delivery is the only route that carries the text.
    const ok = await w.call("GET", "/api/premium/adventures", { cookie: a.cookie! });
    expect(ok.text).toContain(syntheticPremium[0]!.instructions[0]!);
  });
});

describe("launch: gifted licenses (Gumroad gift behavior UNVERIFIED, CW-PAY-7)", () => {
  // A gift purchase gives the RECIPIENT a license key. From our server's point of view that is an ordinary key: it must
  // activate whatever session presents it, build a passport from that session's own device only (never the purchaser's),
  // and a refund or revocation of the gift purchase must end access like any other purchase.
  const mkSave = (name: string) => ({
    ...emptySave(),
    profile: { data: { name }, at: 5 },
  });
  it("a key activates independently of who bought it, and never copies the purchaser's profile", async () => {
    const w = world();
    // The purchaser activated their own copy earlier, with their own dog profile.
    const buyer = await w.call("POST", "/api/access/activate", {
      body: { code: KEY, localSave: mkSave("BuyerDogName") },
    });
    expect(buyer.status).toBe(200);
    // A different, clean device (the recipient) presents a different gifted key for a different purchase reference.
    w.st.ref = "sale-gift-2";
    const GIFT = "GIFTED-KEY-WXYZ-9876";
    const r = await w.call("POST", "/api/access/activate", { body: { code: GIFT } });
    expect(r.status).toBe(200);
    expect(JSON.parse(r.text).reason).toBe("activated");
    expect(w.customers.keys().filter((k) => k.startsWith("customer/"))).toHaveLength(2);
    expect(r.cookie).not.toBe(buyer.cookie);
    expect(r.text).not.toContain("BuyerDogName");
    const prog = await w.call("GET", "/api/progress", { cookie: r.cookie! });
    expect(prog.text).not.toContain("BuyerDogName");
    const lib = await w.call("GET", "/api/premium/adventures", { cookie: r.cookie! });
    expect(lib.status).toBe(200);
    // The recipient's own device progress is what attaches to the recipient's passport.
    w.st.ref = "sale-gift-3";
    const own = await w.call("POST", "/api/access/activate", {
      body: { code: "GIFTED-KEY-OTHER-0001", localSave: mkSave("RecipientDog") },
    });
    expect(own.text).toContain("RecipientDog");
    expect(own.text).not.toContain("BuyerDogName");
  });
  it("revoking or refunding the gift purchase ends the recipient's access at the next check", async () => {
    const w = world();
    w.st.ref = "sale-gift-9";
    const r = await w.call("POST", "/api/access/activate", {
      body: { code: "GIFTED-KEY-REVOKE-5555" },
    });
    expect((await w.call("GET", "/api/premium/adventures", { cookie: r.cookie! })).status).toBe(
      200,
    );
    w.st.mode = "refunded";
    w.st.t += DAY + 60_000;
    const gone = await w.call("GET", "/api/premium/adventures", { cookie: r.cookie! });
    expect(gone.status).toBe(403);
    expect(gone.text).toContain("refunded");
    // The purchaser's own, separate purchase is unaffected by the gift's refund.
    w.st.mode = "valid";
    w.st.ref = "sale-1";
    const own = await w.call("POST", "/api/access/activate", { body: { code: KEY } });
    expect(own.status).toBe(200);
  });
});
