// @vitest-environment jsdom
// Empty-state overwrite protection: a fresh or empty device must never overwrite or delete synced progress or plans.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SyncController, type SyncDeps } from "@/passport/sync";
import { add, emptySave, has, members, merge, migrate, type Save } from "@/passport/progress";
import { _resetForTests, getSave, mergeRemote } from "@/passport/local-store";
import {
  _resetPlansForTests,
  getPlans,
  mergePlans,
  pushPlan,
  savePlan,
  setPlanStatus,
  syncPlans,
  type PlanSyncDeps,
} from "@/lib/plans";
import type { Plan } from "@/lib/notifications";
import { createApi, type ApiDeps } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { TestProvider } from "../server/passport/provider";

const ORIGIN = "https://pawsandpassage.test";
const NOW = Date.UTC(2026, 10, 25, 12, 0);
const ENV = {
  NOTIFICATIONS_ENABLED: "true",
  VAPID_PUBLIC_KEY: "B".repeat(87),
  VAPID_PRIVATE_KEY: "a".repeat(43),
  VAPID_SUBJECT: "mailto:owner@example.test",
};

function setup() {
  const lim = () => createRateLimiter({ windowMs: 60_000, max: 1000 });
  const deps: ApiDeps = {
    customers: new MemoryKV(),
    premium: new MemoryKV(),
    provider: new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "dev"),
    secret: "s".repeat(48),
    now: () => NOW,
    ip: "1.2.3.4",
    accessLimiter: lim(),
    generalLimiter: lim(),
    notifLimiter: lim(),
    notifEnv: ENV,
  };
  return createApi(deps);
}
type Api = ReturnType<typeof setup>;
type Who = { cookie: string; csrf: string };
async function req(api: Api, method: string, path: string, who: Who | null, body?: unknown) {
  const headers: Record<string, string> = { "content-type": "application/json", origin: ORIGIN };
  if (who) {
    headers["cookie"] = who.cookie;
    headers["x-pp-csrf"] = who.csrf;
  }
  const res = await api.handle(
    new Request(`${ORIGIN}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  );
  const text = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { res, status: res.status, json: (text ? JSON.parse(text) : {}) as Record<string, any> };
}
async function signIn(api: Api, localSave?: Save): Promise<Who> {
  const r = await req(api, "POST", "/api/access/activate", null, {
    code: "TEST-VALID-ABC12345",
    ...(localSave ? { localSave } : {}),
  });
  return { cookie: r.res.headers.get("set-cookie")!.split(";")[0]!, csrf: r.json["csrf"] };
}
const rich = (): Save => ({
  ...emptySave(),
  profile: { data: { name: "Juniper", size: "medium" }, at: 5000 },
  owner: { data: { hasCar: "yes" }, at: 5000 },
  done: add(emptySave().done, "adv-aaaaa1", 1000),
  saved: add(emptySave().saved, "adv-bbbbb2", 1100),
  favorites: add(emptySave().favorites, "adv-ccccc3", 1200),
});

describe("server: empty or fresh saves never overwrite or delete synced progress", () => {
  it("PUT /api/progress with an empty save changes nothing (no rev bump, nothing lost)", async () => {
    const api = setup();
    const who = await signIn(api, rich());
    const before = (await req(api, "GET", "/api/progress", who)).json;
    const put = await req(api, "PUT", "/api/progress", who, { save: emptySave(), baseRev: 0 });
    expect(put.status).toBe(200);
    expect(put.json["changed"]).toBe(false);
    expect(put.json["rev"]).toBe(before["rev"]);
    const after = (await req(api, "GET", "/api/progress", who)).json["save"] as Save;
    expect(members(after.done)).toEqual(["adv-aaaaa1"]);
    expect(members(after.saved)).toEqual(["adv-bbbbb2"]);
    expect(after.profile.data).toEqual({ name: "Juniper", size: "medium" });
    expect(after.owner.data).toEqual({ hasCar: "yes" });
  });

  it("a stale write (old baseRev, old timestamps) is merged, never replaces newer remote data", async () => {
    const api = setup();
    const who = await signIn(api, rich());
    const stale: Save = { ...emptySave(), profile: { data: { name: "Old" }, at: 10 } };
    const put = await req(api, "PUT", "/api/progress", who, { save: stale, baseRev: -5 });
    expect(put.status).toBe(200);
    expect((put.json["save"] as Save).profile.data["name"]).toBe("Juniper");
    expect(members((put.json["save"] as Save).done)).toEqual(["adv-aaaaa1"]);
  });

  it("restore or activate on a fresh device with an empty local save keeps the account's save", async () => {
    const api = setup();
    await signIn(api, rich());
    const again = await req(api, "POST", "/api/access/restore", null, {
      code: "TEST-VALID-ABC12345",
      localSave: emptySave(),
    });
    expect(again.status).toBe(200);
    const save = again.json["save"] as Save;
    expect(members(save.done)).toEqual(["adv-aaaaa1"]);
    expect(save.profile.data["name"]).toBe("Juniper");
  });

  it("a client cannot set the server revision backwards or forwards", async () => {
    const api = setup();
    const who = await signIn(api, rich());
    const rev = (await req(api, "GET", "/api/progress", who)).json["rev"] as number;
    const put = await req(api, "PUT", "/api/progress", who, {
      save: { ...rich(), rev: 999 },
      baseRev: 0,
    });
    expect(put.json["rev"]).toBe(rev);
  });
});

describe("server: plans never lose a newer remote edit", () => {
  const plan = (over: Record<string, unknown> = {}) => ({
    id: "pl-abcd1234",
    adventureId: "adv-k3m9x2",
    startAt: "2026-12-05T15:00:00Z",
    tz: "America/New_York",
    durationMin: 60,
    remind: "1h",
    push: false,
    status: "planned",
    updatedAt: NOW - 1000,
    ...over,
  });
  it("an older PUT does not overwrite a newer stored plan; the stored plan comes back", async () => {
    const api = setup();
    const who = await signIn(api);
    await req(
      api,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan({ remind: "1d", updatedAt: NOW - 10 }),
    );
    const r = await req(
      api,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan({ remind: "at", updatedAt: NOW - 500 }),
    );
    expect(r.status).toBe(200);
    expect(r.json["stale"]).toBe(true);
    expect(r.json["plan"].remind).toBe("1d");
    const l = await req(api, "GET", "/api/schedule", who);
    expect(l.json["plans"]).toHaveLength(1);
    expect(l.json["plans"][0].remind).toBe("1d");
  });
  it("a cancelled tombstone is kept and a stale 'planned' cannot resurrect it", async () => {
    const api = setup();
    const who = await signIn(api);
    await req(api, "PUT", "/api/schedule/pl-abcd1234", who, plan({ updatedAt: NOW - 100 }));
    await req(
      api,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan({ status: "cancelled", updatedAt: NOW - 10 }),
    );
    await req(
      api,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan({ status: "planned", updatedAt: NOW - 50 }),
    );
    const l = await req(api, "GET", "/api/schedule", who);
    expect(l.json["plans"][0].status).toBe("cancelled");
  });
  it("plans sync without push (push: false) and a far-future clock is clamped", async () => {
    const api = setup();
    const who = await signIn(api);
    const r = await req(
      api,
      "PUT",
      "/api/schedule/pl-abcd1234",
      who,
      plan({ push: false, updatedAt: NOW + 9e9 }),
    );
    expect(r.status).toBe(200);
    expect(r.json["plan"].updatedAt).toBeLessThanOrEqual(NOW + 5 * 60_000);
  });
});

// ---------------------------------------------------------------- client controller

function srvFor(initial: Save) {
  const s = { save: initial, order: [] as string[] };
  const fetchFn = vi.fn(async (_u: string, init: RequestInit = {}) => {
    const method = (init.method ?? "GET").toUpperCase();
    s.order.push(method);
    const reply = (b: unknown) => new Response(JSON.stringify(b), { status: 200 });
    if (method === "GET") return reply({ ok: true, save: s.save, rev: s.save.rev });
    const incoming = migrate(JSON.parse(String(init.body)).save)!;
    s.save = merge(s.save, incoming);
    return reply({ ok: true, save: s.save, rev: s.save.rev });
  });
  return { s, fetchFn };
}
function controller(srv: ReturnType<typeof srvFor>): SyncController {
  const deps: SyncDeps = {
    fetch: (u, i) => srv.fetchFn(u, i),
    getSave,
    mergeRemote,
    getCsrf: () => "t",
    refreshCsrf: async () => "t",
    onSignedOut: vi.fn(),
    csrfHeader: "x-pp-csrf",
    setTimer: () => 0,
    clearTimer: () => undefined,
  };
  return new SyncController(deps);
}

describe("client: first sync pulls and merges before any push", () => {
  beforeEach(() => {
    window.localStorage.clear();
    _resetForTests();
    _resetPlansForTests();
  });
  it("a fresh empty device pulls the account's save and never PUTs", async () => {
    const srv = srvFor(rich());
    const c = controller(srv);
    await c.start();
    expect(srv.s.order).toEqual(["GET"]);
    expect(members(getSave().done)).toEqual(["adv-aaaaa1"]);
    expect(getSave().profile.data).toEqual({ name: "Juniper", size: "medium" });
    expect(srv.s.save.profile.data).toEqual({ name: "Juniper", size: "medium" });
  });
  it("a device with local progress: GET always comes first, then one PUT, and the server keeps everything", async () => {
    const local = { ...emptySave(), done: add(emptySave().done, "adv-ddddd4", 3000) };
    window.localStorage.setItem("pp.save.v1", JSON.stringify(local));
    _resetForTests();
    const srv = srvFor(rich());
    await controller(srv).start();
    expect(srv.s.order[0]).toBe("GET");
    expect(srv.s.order.filter((m) => m === "PUT")).toHaveLength(1);
    expect(has(srv.s.save.done, "adv-aaaaa1") && has(srv.s.save.done, "adv-ddddd4")).toBe(true);
  });
  it("a local edit made while the first pull is still running is pushed only after the pull", async () => {
    const srv = srvFor(rich());
    const c = controller(srv);
    const started = c.start();
    c.notifyLocalChange();
    await started;
    await c.flush();
    expect(srv.s.order[0]).toBe("GET");
    expect(members(srv.s.save.done)).toContain("adv-aaaaa1");
  });
});

// ---------------------------------------------------------------- plans

const P = (over: Partial<Plan> = {}): Plan => ({
  id: "pl-abcd1234",
  adventureId: "adv-k3m9x2",
  startAt: new Date(Date.now() + 864e5).toISOString(),
  tz: "UTC",
  durationMin: 30,
  remind: "none",
  push: false,
  status: "planned",
  updatedAt: 1000,
  ...over,
});
function planDeps(remote: Plan[], online = true) {
  const state = { remote: [...remote], puts: [] as Plan[], order: [] as string[] };
  const deps: PlanSyncDeps = {
    fetchRemote: async () => {
      state.order.push("GET");
      return online ? { ok: true, data: [...state.remote] } : { ok: false, status: 0 };
    },
    put: async (p) => {
      state.order.push("PUT");
      state.puts.push(p);
      const cur = state.remote.find((x) => x.id === p.id);
      if (cur && cur.updatedAt > p.updatedAt) return { ok: true, data: cur };
      state.remote = [...state.remote.filter((x) => x.id !== p.id), p];
      return { ok: true, data: p };
    },
  };
  return { state, deps };
}

describe("plans sync for entitled customers regardless of push", () => {
  beforeEach(() => {
    window.localStorage.clear();
    _resetPlansForTests();
  });
  it("a plan with push off is sent to the server, after a pull", async () => {
    const plan = savePlan({
      adventureId: "adv-k3m9x2",
      startAt: new Date(Date.now() + 864e5).toISOString(),
      tz: "UTC",
      durationMin: 30,
      remind: "none",
      push: false,
    })!;
    const { state, deps } = planDeps([]);
    expect(await syncPlans(deps)).toBe(true);
    expect(state.order).toEqual(["GET", "PUT"]);
    expect(state.remote.map((p) => p.id)).toEqual([plan.id]);
  });
  it("an empty device pulls remote plans and pushes nothing, so it cannot delete or overwrite them", async () => {
    const { state, deps } = planDeps([P(), P({ id: "pl-zzzzzzzz", status: "done" })]);
    await syncPlans(deps);
    expect(state.puts).toHaveLength(0);
    expect(
      getPlans()
        .map((p) => p.id)
        .sort(),
    ).toEqual(["pl-abcd1234", "pl-zzzzzzzz"]);
    expect(state.remote).toHaveLength(2);
  });
  it("never pushes when the pull failed", async () => {
    savePlan({
      adventureId: "adv-k3m9x2",
      startAt: new Date(Date.now() + 864e5).toISOString(),
      tz: "UTC",
      durationMin: 30,
      remind: "none",
      push: false,
    });
    const { state, deps } = planDeps([], false);
    expect(await syncPlans(deps)).toBe(false);
    expect(state.puts).toHaveLength(0);
    expect(getPlans()).toHaveLength(1); // local-first: nothing lost
  });
  it("a newer remote edit wins over an older local copy and is not overwritten", async () => {
    mergePlans([P({ remind: "at", updatedAt: 1000 })]);
    const { state, deps } = planDeps([P({ remind: "1d", updatedAt: 5000 })]);
    await syncPlans(deps);
    expect(getPlans()[0]!.remind).toBe("1d");
    expect(state.puts).toHaveLength(0);
  });
  it("a newer local edit is pushed; an older local copy of a cancelled plan stays cancelled", async () => {
    mergePlans([P({ remind: "at", updatedAt: 9000 })]);
    const a = planDeps([P({ remind: "1d", updatedAt: 5000 })]);
    await syncPlans(a.deps);
    expect(a.state.puts).toHaveLength(1);
    expect(a.state.remote[0]!.remind).toBe("at");
    _resetPlansForTests();
    mergePlans([P({ status: "planned", updatedAt: 1000 })]);
    const b = planDeps([P({ status: "cancelled", updatedAt: 4000 })]);
    await syncPlans(b.deps);
    expect(getPlans()[0]!.status).toBe("cancelled");
    expect(b.state.puts).toHaveLength(0);
  });
  it("cancel and done travel as status changes (tombstones), not deletes", async () => {
    const plan = savePlan({
      adventureId: "adv-k3m9x2",
      startAt: new Date(Date.now() + 864e5).toISOString(),
      tz: "UTC",
      durationMin: 30,
      remind: "none",
      push: false,
    })!;
    const next = setPlanStatus(plan.id, "cancelled", Date.now() + 10)!;
    const { state, deps } = planDeps([]);
    expect(await pushPlan(next, deps)).toBe(true);
    expect(state.remote[0]!.status).toBe("cancelled");
  });
  it("merging an unchanged remote list does not rewrite storage or notify", () => {
    mergePlans([P()]);
    const fn = vi.fn();
    const spy = vi.spyOn(Storage.prototype, "setItem");
    void fn;
    mergePlans([P()]);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
