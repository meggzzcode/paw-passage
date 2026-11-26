// Premium end-to-end integration: the REAL request handler over in-memory stores and the isolated TestProvider, with the
// real browser-side client code (entitlement store, sync controller, engine) wired to it through a fetch bridge.
// Synthetic data only. Proves OUR behavior; real Netlify Blobs and real Gumroad are listed as UNVERIFIED in
// docs/PREMIUM-INTEGRATION-TESTS.md. Existing suites (server-passport, launch-commerce, push-api, previews-server,
// premium-client, passport-sync) cover the unit level; these tests cover the whole purchase-to-library path.
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { freeLibrary } from "../passport/content";
import { eligibility } from "../passport/engine";
import {
  add,
  achievements as earn,
  addToCollection,
  chooseStarter,
  createCollection,
  emptySave,
  has,
  listCollections,
  members,
  merge,
  remove,
  revealStarter,
  type Save,
} from "../passport/progress";
import { adventureSchema } from "../passport/schema";
import {
  OFFLINE_MESSAGE,
  REVOKED_MESSAGE,
  _resetEntitlementForTests,
  acceptPremium,
  entitlementGranted,
  getEntitlement,
  refreshEntitlement,
} from "../passport/premium-client";
import { _resetForTests, completeAdventure, getSave } from "../passport/local-store";
import { SyncController } from "../passport/sync";
import { useKeepsakeEntitled } from "../passport/useKeepsakeEntitled";
import { submitAccessCode } from "../lib/passport-api";
import { collections as curated } from "../passport/content";
import { notifKey } from "../server/passport/push-store";
import {
  Device,
  HOUR,
  KEY,
  KEY_B,
  ORIGIN,
  PREMIUM,
  PREMIUM_IDS,
  PREMIUM_ONLY_STAMP,
  SECRET_FIELDS,
  customerId,
  customerKeys,
  sub,
  world,
  type World,
} from "./premium-e2e-harness";

const doneSave = (...ids: string[]): Save => ({
  ...emptySave(),
  done: ids.reduce((s, id, i) => add(s, id, 1000 + i), emptySave().done),
});
const FREE = freeLibrary();
const FREE_ID = FREE[0]!.id;
const FREE_ID_2 = FREE[1]!.id;

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  _resetEntitlementForTests();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Refund simulation: the seller flips the key, and the server notices at its next 24h re-check. */
function refund(w: World, code = KEY, status: "refunded" | "disputed" | "revoked" = "refunded") {
  w.provider.setStatus(code, status);
  w.clock.t += 25 * HOUR;
}

describe("premium e2e: activation", () => {
  it("activates a test key, issues a signed session and an empty-or-merged account", async () => {
    const w = world();
    const a = new Device(w);
    const r = await a.activate();
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, reason: "activated", entitled: true });
    expect(a.cookie).toMatch(/^pp_session=/);
    expect(customerKeys(w)).toHaveLength(1);
    const s = await a.session();
    expect(s.json).toMatchObject({ authenticated: true, entitled: true, status: "active" });
    // refused keys create nothing
    const b = new Device(w);
    for (const code of ["NOT-A-REAL-KEY", "TEST-REFUNDED-ZZZ111", "TEST-DISPUTED-ZZZ111"])
      expect((await b.activate(code)).status).toBe(403);
    expect(customerKeys(w)).toHaveLength(1);
    expect(b.cookie).toBe("");
  });
});

describe("premium e2e: premium content access", () => {
  it("an entitled session receives the full premium library including fields free users never get", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    const r = await a.premium();
    expect(r.status).toBe(200);
    const got = r.json["adventures"] as Record<string, unknown>[];
    expect(got.map((x) => x["id"]).sort()).toEqual([...PREMIUM_IDS].sort());
    for (const adv of got) {
      expect(adventureSchema.safeParse(adv).success).toBe(true);
      for (const f of SECRET_FIELDS) expect(adv).toHaveProperty(f);
      expect(adv["access"]).toBe("premium");
    }
    // The browser client accepts every one of them (schema, known collections and stamps).
    expect(
      acceptPremium(got)
        .map((x) => x.id)
        .sort(),
    ).toEqual([...PREMIUM_IDS].sort());
  });

  it("unauthenticated, tampered and revoked sessions receive no premium content", async () => {
    const w = world();
    const anon = new Device(w);
    expect((await anon.premium()).status).toBe(401);
    const a = new Device(w);
    await a.activate();
    const forged = new Device(w);
    forged.cookie = a.cookie.slice(0, -3) + "AAA";
    expect((await forged.premium()).status).toBe(401);
    refund(w);
    const r = await a.premium();
    expect(r.status).toBe(403);
    expect(r.json).toMatchObject({ ok: false, error: "not_entitled", reason: "refunded" });
    for (const t of [anon, forged, a]) {
      const txt = (await t.premium()).text;
      for (const p of PREMIUM) expect(txt).not.toContain(p.title);
    }
  });

  it("the public previews and summary never carry the premium-only fields", async () => {
    const w = world();
    const anon = new Device(w);
    const prev = await anon.call("GET", "/api/previews");
    const sum = await anon.call("GET", "/api/premium/summary");
    expect(prev.status).toBe(200);
    expect(prev.json["items"].some((i: { id: string }) => i.id === "adv-syn101")).toBe(true);
    const everything = prev.text + sum.text;
    for (const f of SECRET_FIELDS) expect(everything).not.toContain(`"${f}"`);
    for (const p of PREMIUM) {
      expect(everything).not.toContain(p.reveal ?? "x-never");
      expect(everything).not.toContain(p.instructions[0]!);
    }
  });
});

describe("premium e2e: protected API response shape", () => {
  it("session, premium, progress and export responses have the documented shape and headers", async () => {
    const w = world();
    const a = new Device(w);
    const act = await a.activate();
    expect(Object.keys(act.json).sort()).toEqual(
      ["csrf", "entitled", "ok", "reason", "rev", "save"].sort(),
    );
    const ses = await a.session();
    expect(Object.keys(ses.json).sort()).toEqual(
      ["authenticated", "csrf", "entitled", "expiresAt", "ok", "status"].sort(),
    );
    const prem = await a.premium();
    expect(Object.keys(prem.json).sort()).toEqual(["adventures", "ok"]);
    const prog = await a.progress();
    expect(Object.keys(prog.json).sort()).toEqual(["ok", "rev", "save"]);
    const exp = await a.call("POST", "/api/account/export", {});
    expect(Object.keys(exp.json).sort()).toEqual(["entitlementStatus", "exportedAt", "progress"]);
    for (const r of [act, ses, prem, prog, exp]) {
      expect(r.res.headers.get("cache-control")).toBe("no-store");
      expect(r.res.headers.get("x-content-type-options")).toBe("nosniff");
      expect(r.res.headers.get("content-type")).toContain("application/json");
      // never the key, the customer id or a sealed code
      expect(r.text).not.toContain(KEY);
      expect(r.text).not.toContain("cus_");
      expect(r.text).not.toContain("codeSealed");
    }
    // errors share one shape
    const bad = await new Device(w).premium();
    expect(bad.json).toMatchObject({ ok: false, error: "not_signed_in" });
    a.csrf = "";
    const noCsrf = await a.put(emptySave());
    expect(noCsrf).toMatchObject({ status: 403 });
    expect(noCsrf.json["error"]).toBe("bad_csrf");
  });
});

describe("premium e2e: full library discovery", () => {
  const dog = { lifeStage: "adult" as const, energy: "gentle" as const };

  it("the engine sees the union of free and premium only while entitled", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    const premium = acceptPremium((await a.premium()).json["adventures"]);
    const union = [...FREE, ...premium];
    const sees = (lib: typeof union, unlocked: boolean) =>
      new Set(
        lib.filter((x) => eligibility(x, { dog, owner: {}, unlocked }).eligible).map((x) => x.id),
      );
    const locked = sees(union, false);
    const open = sees(union, true);
    for (const id of PREMIUM_IDS) expect(locked.has(id)).toBe(false); // hard gate, even if the data were present
    expect(PREMIUM_IDS.some((id) => open.has(id))).toBe(true);
    expect(open.size).toBeGreaterThan(locked.size);
    for (const id of locked) expect(open.has(id)).toBe(true); // nothing free is lost by unlocking
  });

  it("server-side match counts the full library and returns only preview ids", async () => {
    const w = world();
    const anon = new Device(w);
    const m = await anon.call("POST", "/api/previews/match", { dog, owner: {} });
    expect(m.status).toBe(200);
    const all = [...FREE, ...PREMIUM];
    const expected = all.filter((x) => eligibility(x, { dog, owner: {}, unlocked: true }).eligible);
    expect(m.json["total"]).toBe(all.length);
    expect(m.json["matching"]).toBe(expected.length);
    for (const id of m.json["previews"])
      expect(PREMIUM_IDS.includes(id) || FREE.some((f) => f.id === id)).toBe(true);
    for (const p of PREMIUM) expect(m.text).not.toContain(p.title);
    expect(m.text).not.toContain("instructions");
  });
});

describe("premium e2e: custom collections", () => {
  it("custom collections with premium members sync to the account and appear on a second device", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    const col = "col-e2e00001";
    let s = createCollection(
      emptySave(),
      { id: col, kind: "handpicked", name: "Road days", ids: [PREMIUM_IDS[0]!] },
      10,
    );
    s = addToCollection(s, col, FREE_ID, 20);
    expect((await a.put(s)).status).toBe(200);
    const b = new Device(w);
    const r = await b.restore();
    const cols = listCollections(r.json["save"]);
    expect(cols).toHaveLength(1);
    expect(cols[0]).toMatchObject({ name: "Road days", ids: [PREMIUM_IDS[0], FREE_ID] });
    // ids only: no premium text is ever copied into the account record
    expect(JSON.stringify(r.json["save"])).not.toContain(PREMIUM[0]!.title);
  });

  it("a collection keeps its premium ids when access is revoked; the library just stops offering them", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    const col = "col-e2e00002";
    const s = createCollection(
      emptySave(),
      { id: col, kind: "handpicked", name: "Kept", ids: [PREMIUM_IDS[1]!] },
      10,
    );
    await a.put(s);
    refund(w);
    expect((await a.premium()).status).toBe(403);
    const kept = listCollections((await a.progress()).json["save"]);
    expect(kept[0]!.kind === "handpicked" && kept[0]!.ids).toEqual([PREMIUM_IDS[1]]);
  });
});

describe("premium e2e: saved adventures", () => {
  it("saved adventures and favorites, including bookmarked previews, survive activation and restoration", async () => {
    const w = world();
    // free visitor bookmarks a public preview and a free adventure before buying
    let local = emptySave();
    local = {
      ...local,
      saved: add(add(local.saved, "adv-syn101", 50), FREE_ID, 60),
      favorites: add(local.favorites, FREE_ID_2, 70),
    };
    const a = new Device(w);
    const act = await a.activate(KEY, local);
    expect(members(act.json["save"].saved).sort()).toEqual([FREE_ID, "adv-syn101"].sort());
    const b = new Device(w);
    const back = await b.restore();
    expect(members(back.json["save"].saved).sort()).toEqual([FREE_ID, "adv-syn101"].sort());
    expect(members(back.json["save"].favorites)).toEqual([FREE_ID_2]);
    // removing a bookmark on one device wins over the older add on another, per timestamp
    const removed = { ...local, saved: remove(local.saved, "adv-syn101", 500) };
    await b.put(removed);
    expect(members((await a.progress()).json["save"].saved)).toEqual([FREE_ID]);
  });
});

describe("premium e2e: introductory progress migration", () => {
  it("a free save (starter, reveal, completion, memory, saved, profile) merges into the account on activation without loss", async () => {
    const w = world();
    let free = emptySave();
    free = chooseStarter(free, FREE_ID, 100);
    free = revealStarter(free, 200);
    free = { ...free, done: add(free.done, FREE_ID, 300) };
    free = { ...free, memories: { [FREE_ID]: { text: "He found the bench first.", at: 310 } } };
    free = { ...free, saved: add(free.saved, FREE_ID_2, 320) };
    free = { ...free, profile: { data: { name: "Juno", lifeStage: "adult" }, at: 330 } };
    const a = new Device(w);
    const r = await a.activate(KEY, free);
    const got: Save = r.json["save"];
    expect(got.starter).toMatchObject({ id: FREE_ID, revealedAt: 200 });
    expect(members(got.done)).toEqual([FREE_ID]);
    expect(got.memories[FREE_ID]?.text).toBe("He found the bench first.");
    expect(members(got.saved)).toEqual([FREE_ID_2]);
    expect(got.profile.data).toMatchObject({ name: "Juno", lifeStage: "adult" });
    // a different free device with different work, then re-activation: both survive
    const other = chooseStarter(emptySave(), FREE_ID_2, 50);
    const b = new Device(w);
    const again = await b.activate(KEY, { ...other, done: add(other.done, FREE_ID_2, 400) });
    expect(members(again.json["save"].done).sort()).toEqual([FREE_ID, FREE_ID_2].sort());
    expect(again.json["reason"]).toBe("already_active");
  });
});

describe("premium e2e: passport progression", () => {
  it("stamps and milestones derive from completions including premium adventures", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate(KEY, doneSave(FREE_ID, PREMIUM_IDS[0]!));
    const save: Save = (await a.progress()).json["save"];
    const premium = acceptPremium((await a.premium()).json["adventures"]);
    const lib = [...FREE, ...premium].map((x) => ({
      id: x.id,
      stamps: x.stamps,
      collections: x.collections,
    }));
    const cur = Object.fromEntries(
      curated.map((c) => [
        c.slug,
        lib.filter((l) => l.collections.includes(c.slug)).map((l) => l.id),
      ]),
    );
    const e = earn(save, lib, cur);
    expect(e.count).toBe(2);
    expect(e.stamps).toContain(PREMIUM_ONLY_STAMP); // earned ONLY by the premium card
    expect(e.milestones).toContain(1);
    // finishing every card of the three-card premium collection earns the collection
    const all = doneSave(...cur["road-trip-adventures"]!);
    const e2 = earn(all, lib, cur);
    expect(e2.collectionsComplete).toContain("road-trip-adventures");
  });

  it("premium progress is hidden while revoked and comes back whole on re-activation", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate(KEY, doneSave(FREE_ID, PREMIUM_IDS[0]!));
    refund(w);
    const lib = FREE.map((x) => ({ id: x.id, stamps: x.stamps, collections: x.collections }));
    const hidden = earn((await a.progress()).json["save"], lib, {});
    expect(hidden.count).toBe(1);
    expect(hidden.stamps).not.toContain(PREMIUM_ONLY_STAMP);
    w.provider.setStatus(KEY, "valid");
    const b = new Device(w);
    const back = await b.activate();
    expect(back.json["reason"]).toBe("already_active");
    expect(members(back.json["save"].done)).toEqual([FREE_ID, PREMIUM_IDS[0]].sort());
  });
});

describe("premium e2e: keepsake editor access", () => {
  it("entitled opens the editor gate; free, revoked and unreachable sessions get the gate, via the entitlement hook and a mocked session endpoint", async () => {
    const w = world();
    const a = new Device(w);
    const calls: string[] = [];
    const spy = vi.fn(a.fetch);
    vi.stubGlobal("fetch", (u: string, i?: RequestInit) => (calls.push(u), spy(u, i)));
    const { result } = renderHook(() => useKeepsakeEntitled());
    expect(result.current).toBe(false);
    await act(async () => {}); // free visitor: nothing ran
    expect(calls).toEqual([]);
    expect(result.current).toBe(false);

    const r = await a.activate();
    await act(async () => entitlementGranted(r.json["csrf"]));
    expect(getEntitlement().status).toBe("entitled");
    expect(result.current).toBe(true);

    refund(w);
    await act(async () => refreshEntitlement({ force: true }));
    expect(getEntitlement().status).toBe("revoked");
    expect(result.current).toBe(false);

    // first-ever load with the server unreachable: not entitled, and no crash
    _resetEntitlementForTests();
    w.net.offline = true;
    await act(async () => refreshEntitlement({ force: true }));
    expect(getEntitlement().status).toBe("offline");
    expect(getEntitlement().premium).toEqual([]);
  });
});

/** A phone with its own local save, wired to the real server through the same SyncController the app uses. */
function phone(dev: Device, initial: Save = emptySave()) {
  const st = { save: initial };
  const c = new SyncController({
    fetch: dev.fetch,
    getSave: () => st.save,
    mergeRemote: (r) => void (st.save = merge(st.save, r)),
    getCsrf: () => dev.csrf,
    refreshCsrf: async () => dev.csrf,
    onSignedOut: () => undefined,
    csrfHeader: "x-pp-csrf",
    setTimer: () => 0,
    clearTimer: () => undefined,
  });
  return {
    c,
    st,
    edit(fn: (s: Save) => Save) {
      st.save = fn(st.save);
      c.notifyLocalChange();
    },
  };
}

describe("premium e2e: progress synchronization", () => {
  it("two devices merge and no addition is lost, even with stale revisions and simultaneous writes", async () => {
    const w = world();
    const a = new Device(w);
    const b = new Device(w);
    await a.activate();
    await b.restore();
    await Promise.all([a.put(doneSave("adv-aaaaa1"), 0), b.put(doneSave("adv-bbbbb2"), 0)]);
    await a.put(doneSave("adv-ccccc3"), 0); // stale baseRev
    const got = (await b.progress()).json["save"];
    expect(members(got.done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2", "adv-ccccc3"]);
    // replaying the same write changes nothing
    const rev = (await a.progress()).json["rev"];
    await a.put(doneSave("adv-ccccc3"), rev);
    expect((await a.progress()).json["rev"]).toBe(rev);
  });

  it("two SyncControllers on two phones converge through the real handler and keep both phones' additions", async () => {
    const w = world();
    const da = new Device(w);
    const db = new Device(w);
    await da.activate();
    await db.restore();
    const p1 = phone(da);
    const p2 = phone(db);
    await p1.c.start();
    await p2.c.start();
    p1.edit((s) => ({ ...s, done: add(s.done, "adv-aaaaa1", 5000) }));
    p2.edit((s) => ({
      ...s,
      done: add(s.done, "adv-bbbbb2", 5001),
      favorites: add(s.favorites, "adv-bbbbb2", 5002),
    }));
    await Promise.all([p1.c.flush(), p2.c.flush()]);
    await p1.c.pull();
    await p2.c.pull();
    for (const p of [p1, p2]) {
      expect(members(p.st.save.done).sort()).toEqual(["adv-aaaaa1", "adv-bbbbb2"]);
      expect(members(p.st.save.favorites)).toEqual(["adv-bbbbb2"]);
      expect(p.c.getSnapshot().status).toBe("saved");
    }
  });
});

describe("premium e2e: restoration on another device", () => {
  it("restores with the license key only, no cookie, and pulls the account progress", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate(KEY, doneSave(FREE_ID, PREMIUM_IDS[1]!));
    const fresh = new Device(w);
    expect((await fresh.premium()).status).toBe(401);
    const r = await fresh.restore(); // no localSave, no cookie, no URL key
    expect(r.json).toMatchObject({ ok: true, reason: "restored", entitled: true });
    expect(members(r.json["save"].done).sort()).toEqual([FREE_ID, PREMIUM_IDS[1]].sort());
    expect((await fresh.premium()).status).toBe(200);
    expect(customerKeys(w)).toHaveLength(1);
    expect(r.text).not.toContain(KEY);
    // through the real client helper too
    vi.stubGlobal("fetch", new Device(w).fetch);
    const viaClient = await submitAccessCode("restore", KEY);
    expect(viaClient).toMatchObject({ ok: true, reason: "restored" });
  });

  it("an empty local save cannot overwrite remote progress on restore or on sync", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate(KEY, doneSave(FREE_ID, FREE_ID_2));
    const b = new Device(w);
    const r = await b.restore(KEY, emptySave());
    expect(members(r.json["save"].done)).toHaveLength(2);
    await b.put(emptySave(), 0);
    expect(members((await a.progress()).json["save"].done)).toHaveLength(2);
    // and the client controller on a brand new phone ends up holding the remote work, not wiping it
    const p = phone(b);
    await p.c.start();
    expect(members(p.st.save.done)).toHaveLength(2);
    expect(members((await a.progress()).json["save"].done)).toHaveLength(2);
    // a different key is a different account and starts empty
    const other = new Device(w);
    expect(members((await other.activate(KEY_B)).json["save"].done)).toEqual([]);
  });
});

describe("premium e2e: refund and revocation", () => {
  it.each(["refunded", "disputed", "revoked"] as const)(
    "a %s key stops premium content at the next check but keeps the customer's own data",
    async (status) => {
      const w = world();
      const a = new Device(w);
      await a.activate(KEY, doneSave(FREE_ID));
      await a.call("PUT", "/api/progress", {
        save: { ...doneSave(FREE_ID), memories: { [FREE_ID]: { text: "kept", at: 9 } } },
        baseRev: 0,
      });
      refund(w, KEY, status);
      expect((await a.premium()).status).toBe(403);
      const s = await a.session();
      expect(s.json).toMatchObject({ authenticated: true, entitled: false, status });
      const prog = await a.progress();
      expect(prog.json["save"].memories[FREE_ID].text).toBe("kept");
      expect(members(prog.json["save"].done)).toEqual([FREE_ID]);
      expect((await a.call("POST", "/api/account/export", {})).status).toBe(200); // own data stays exportable
      expect(w.logs.some((l) => l.includes("entitlement_revoked"))).toBe(true);
    },
  );

  it("a refused key cannot restore, and revocation removes notification records", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    expect((await a.call("POST", "/api/push/subscribe", { subscription: sub() })).status).toBe(200);
    expect(w.customers.keys().some((k) => k.startsWith("notif/"))).toBe(true);
    refund(w);
    expect((await a.premium()).status).toBe(403);
    expect(w.customers.keys().some((k) => k.startsWith("notif/"))).toBe(false);
    expect((await a.call("GET", "/api/push/devices")).status).toBe(403);
    const b = new Device(w);
    const r = await b.restore();
    expect(r.status).toBe(403);
    expect(r.json["reason"]).toBe("refunded");
    expect(b.cookie).toBe("");
    expect(customerKeys(w)).toHaveLength(1);
  });

  it("re-activation after a refund reverses reuses the same account and returns the library and progress", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate(KEY, doneSave(FREE_ID));
    const id = customerId(w);
    refund(w);
    expect((await a.premium()).status).toBe(403);
    w.provider.setStatus(KEY, "valid"); // seller reverses the refund, or the owner re-issues the same purchase
    const b = new Device(w);
    const r = await b.activate();
    expect(r.json["reason"]).toBe("already_active");
    expect(customerId(w)).toBe(id);
    expect(members(r.json["save"].done)).toEqual([FREE_ID]);
    expect((await b.premium()).status).toBe(200);
    // push devices do NOT come back: they were deleted with the entitlement and must be re-registered
    expect(w.customers.keys().some((k) => k.startsWith("notif/"))).toBe(false);
  });

  it("a provider outage at re-check neither revokes nor grants", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    w.provider.setStatus(KEY, "unavailable");
    w.clock.t += 48 * HOUR;
    expect((await a.premium()).status).toBe(200);
    const fresh = new Device(w);
    expect((await fresh.restore()).status).toBe(503); // cannot grant while the provider is down
  });
});

describe("premium e2e: account deletion", () => {
  it("removes every record including notification records, and the key cannot restore the deleted progress", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate(KEY, doneSave(FREE_ID));
    await a.call("POST", "/api/push/subscribe", { subscription: sub() });
    const id = customerId(w);
    expect(w.customers.keys()).toEqual(expect.arrayContaining([`customer/${id}`, notifKey(id)]));
    expect((await a.call("POST", "/api/account/delete", {})).status).toBe(400); // needs the confirmation word
    const del = await a.call("POST", "/api/account/delete", { confirm: "DELETE" });
    expect(del.json).toMatchObject({ ok: true, deleted: true });
    expect(w.customers.keys()).toEqual([]); // customer, purchase lookup and notif/* are all gone
    expect((await a.session()).status).toBe(401);
    // The seller still says the key is valid, so it may start a NEW empty account, but nothing old comes back.
    const b = new Device(w);
    const r = await b.restore();
    expect(r.json["reason"]).toBe("activated");
    expect(members(r.json["save"].done)).toEqual([]);
    expect(customerId(w)).not.toBe(id);
    expect(JSON.stringify(w.customers.keys())).not.toContain(id);
  });
});

describe("premium e2e: offline and error handling", () => {
  const bridge = (w: World) => vi.stubGlobal("fetch", new Device(w).fetch);

  it("a premium fetch failure shows the truthful offline state with the free library and no crash", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    vi.stubGlobal("fetch", a.fetch);
    w.net.faults.set("/api/premium/adventures", 500);
    await refreshEntitlement({ force: true });
    expect(getEntitlement()).toMatchObject({
      status: "offline",
      premium: [],
      message: OFFLINE_MESSAGE,
    });
    expect(OFFLINE_MESSAGE).not.toMatch(/lock|refund|expired/i);
    w.net.faults.clear();
    await refreshEntitlement({ force: true });
    expect(getEntitlement().status).toBe("entitled");
  });

  it("an offline refresh keeps the previously verified entitlement and library; it never invents a revocation", async () => {
    const w = world();
    const a = new Device(w);
    await a.activate();
    vi.stubGlobal("fetch", a.fetch);
    await refreshEntitlement({ force: true });
    const before = getEntitlement().premium.length;
    expect(before).toBe(PREMIUM_IDS.length);
    w.net.offline = true;
    await refreshEntitlement({ force: true });
    expect(getEntitlement().status).toBe("entitled");
    expect(getEntitlement().premium).toHaveLength(before);
    w.net.offline = false;
    refund(w);
    await refreshEntitlement({ force: true }); // a real revoke IS shown, in plain words, with progress kept
    expect(getEntitlement()).toMatchObject({
      status: "revoked",
      premium: [],
      message: REVOKED_MESSAGE,
    });
    expect(REVOKED_MESSAGE).toMatch(/nothing was deleted/);
  });

  it("garbage, an expired cookie and a 5xx never crash the client", async () => {
    const w = world();
    bridge(w);
    window.localStorage.setItem("pp.acct.v1", "1");
    // expired session: server says 401, client goes back to free quietly
    await refreshEntitlement();
    expect(getEntitlement().status).toBe("free");
    expect(window.localStorage.getItem("pp.acct.v1")).toBeNull();
    expect(acceptPremium("nonsense")).toEqual([]);
    expect(acceptPremium([null, 5, { id: "x" }])).toEqual([]);
    vi.stubGlobal("fetch", async () => new Response("<html>oops</html>", { status: 200 }));
    window.localStorage.setItem("pp.acct.v1", "1");
    await refreshEntitlement();
    expect(["free", "offline"]).toContain(getEntitlement().status);
  });

  it("local progress is never touched by any of the above", async () => {
    completeAdventure(FREE_ID, 123);
    const w = world();
    const a = new Device(w);
    await a.activate();
    vi.stubGlobal("fetch", a.fetch);
    w.net.offline = true;
    await refreshEntitlement({ force: true });
    expect(has(getSave().done, FREE_ID)).toBe(true);
    expect(ORIGIN).toMatch(/^https:/);
  });
});
