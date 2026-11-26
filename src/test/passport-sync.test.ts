import { beforeEach, describe, expect, it, vi } from "vitest";
import { SyncController, canon, syncLabel, DEBOUNCE_MS, type SyncDeps } from "@/passport/sync";
import { add, emptySave, has, merge, migrate, type Save } from "@/passport/progress";
import {
  _resetForTests,
  completeAdventure,
  favorite,
  getSave,
  mergeRemote,
} from "@/passport/local-store";

const CSRF = "x-pp-csrf";

/** A faithful stand-in for /api/progress: the server owns rev and always merges. */
function fakeServer(initial: Save = emptySave()) {
  const s = {
    save: initial,
    rev: initial.rev,
    online: true,
    puts: 0,
    gets: 0,
    mode: "ok" as string,
  };
  const calls: { method: string; headers: Record<string, string>; body: unknown }[] = [];
  const fetchFn = vi.fn(async (_url: string, init: RequestInit = {}) => {
    const method = (init.method ?? "GET").toUpperCase();
    const headers = (init.headers ?? {}) as Record<string, string>;
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ method, headers, body });
    if (!s.online) throw new TypeError("offline");
    const reply = (status: number, b: unknown) => new Response(JSON.stringify(b), { status });
    if (method === "GET") {
      s.gets++;
      return reply(200, { ok: true, save: { ...s.save, rev: s.rev }, rev: s.rev });
    }
    s.puts++;
    if (s.mode === "401") return reply(401, { ok: false, error: "not_signed_in" });
    if (s.mode === "403") {
      s.mode = "ok";
      return reply(403, { ok: false, error: "bad_csrf" });
    }
    if (s.mode === "500") return reply(500, { ok: false });
    const incoming = migrate(body.save)!;
    const merged = merge(s.save, incoming);
    const changed = canon(merged) !== canon(s.save);
    if (changed) s.rev++;
    s.save = merged;
    return reply(200, {
      ok: true,
      save: { ...merged, rev: s.rev },
      rev: s.rev,
      changed,
      stale: body.baseRev !== s.rev - (changed ? 1 : 0),
    });
  });
  return { s, fetchFn, calls };
}

function controllerFor(server: ReturnType<typeof fakeServer>, extra: Partial<SyncDeps> = {}) {
  const timers: { fn: () => void; ms: number; live: boolean }[] = [];
  const c = new SyncController({
    fetch: (u, i) => server.fetchFn(u, i),
    getSave,
    mergeRemote,
    getCsrf: () => "tok",
    refreshCsrf: async () => "tok2",
    onSignedOut: vi.fn(),
    csrfHeader: CSRF,
    setTimer: (fn, ms) => {
      const t = { fn, ms, live: true };
      timers.push(t);
      return t;
    },
    clearTimer: (h) => {
      (h as { live: boolean }).live = false;
    },
    ...extra,
  });
  const fire = async () => {
    const t = timers.filter((x) => x.live);
    t.forEach((x) => (x.live = false));
    t.forEach((x) => x.fn());
    await vi.waitFor(() => expect(c.getSnapshot().status).not.toBe("saving"));
  };
  return { c, timers, fire };
}

const doneAt = (id: string, t: number): Save => ({
  ...emptySave(),
  done: add(emptySave().done, id, t),
});

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});

describe("sync labels", () => {
  it("uses plain, truthful words", () => {
    expect(syncLabel("saved", false)).toBe("Saved");
    expect(syncLabel("saving", true)).toBe("Saving...");
    expect(syncLabel("offline", true)).toBe("Offline: changes pending");
    expect(syncLabel("offline", false)).toBe("Offline");
    expect(syncLabel("error", true)).toBe("Couldn't sync, will retry");
    expect(syncLabel("off", false)).toBeNull();
    expect(syncLabel("idle", false)).toBeNull();
  });
  it("canon ignores rev and key order", () => {
    const a = doneAt("adv-aaa111", 5);
    expect(canon({ ...a, rev: 9 })).toBe(canon(a));
  });
});

describe("SyncController", () => {
  it("first sync merges the server copy in and pushes what the server lacks, with the CSRF header", async () => {
    completeAdventure("adv-aaa111", 1000);
    const srv = fakeServer(doneAt("adv-bbb222", 2000));
    srv.s.rev = 3;
    const { c } = controllerFor(srv);
    await c.start();
    const put = srv.calls.find((x) => x.method === "PUT")!;
    expect(put.headers[CSRF]).toBe("tok");
    expect((put.body as { baseRev: number }).baseRev).toBe(3);
    // both devices' work survives on both sides
    expect(has(getSave().done, "adv-aaa111") && has(getSave().done, "adv-bbb222")).toBe(true);
    expect(has(srv.s.save.done, "adv-aaa111") && has(srv.s.save.done, "adv-bbb222")).toBe(true);
    expect(c.getSnapshot()).toEqual({ status: "saved", pending: false });
  });

  it("does nothing, and is not 'Saved', when the server already has everything and local is empty", async () => {
    const srv = fakeServer(doneAt("adv-bbb222", 2000));
    const { c } = controllerFor(srv);
    await c.start();
    expect(srv.s.puts).toBe(0);
    expect(has(getSave().done, "adv-bbb222")).toBe(true);
  });

  it("two devices: the server moved on after our pull, nothing local is lost", async () => {
    const srv = fakeServer();
    const { c, fire } = controllerFor(srv);
    await c.start();
    // another device writes while this tab is open
    srv.s.save = merge(srv.s.save, doneAt("adv-ccc333", 5000));
    srv.s.rev += 1;
    completeAdventure("adv-aaa111", 6000);
    favorite("adv-aaa111", 6001);
    c.notifyLocalChange();
    await fire();
    expect(has(srv.s.save.done, "adv-aaa111")).toBe(true);
    expect(has(srv.s.save.done, "adv-ccc333")).toBe(true);
    expect(has(srv.s.save.favorites, "adv-aaa111")).toBe(true);
    expect(has(getSave().done, "adv-ccc333")).toBe(true); // the other device's work reached this one
    expect(c.getSnapshot().status).toBe("saved");
  });

  it("debounces: many edits make one timer-driven write, and repeated flushes are idempotent", async () => {
    const srv = fakeServer();
    const { c, timers, fire } = controllerFor(srv);
    await c.start();
    completeAdventure("adv-aaa111", 1000);
    c.notifyLocalChange();
    favorite("adv-aaa111", 1001);
    c.notifyLocalChange();
    expect(timers.filter((t) => t.live)).toHaveLength(1);
    expect(timers.at(-1)!.ms).toBe(DEBOUNCE_MS);
    expect(c.getSnapshot().status).toBe("saving");
    expect(srv.s.puts).toBe(0);
    await fire();
    expect(srv.s.puts).toBe(1);
    const rev = srv.s.rev;
    await Promise.all([c.flush(), c.flush(), c.flush()]);
    await c.flush();
    expect(srv.s.puts).toBe(1); // nothing pending, nothing sent
    expect(srv.s.rev).toBe(rev);
  });

  it("never says Saved before the server confirmed; offline keeps the change pending and resume retries", async () => {
    const srv = fakeServer();
    const { c } = controllerFor(srv);
    await c.start();
    srv.s.online = false;
    completeAdventure("adv-aaa111", 1000);
    c.notifyLocalChange();
    expect(c.getSnapshot().status).not.toBe("saved");
    await c.flush();
    expect(c.getSnapshot()).toEqual({ status: "offline", pending: true });
    expect(syncLabel(c.getSnapshot().status, c.getSnapshot().pending)).toBe(
      "Offline: changes pending",
    );
    expect(srv.s.puts).toBe(0);
    srv.s.online = true;
    await c.resume();
    expect(c.getSnapshot()).toEqual({ status: "saved", pending: false });
    expect(has(srv.s.save.done, "adv-aaa111")).toBe(true);
  });

  it("a server error reads 'Couldn't sync, will retry' and is retried on the next trigger", async () => {
    const srv = fakeServer();
    const { c } = controllerFor(srv);
    await c.start();
    srv.s.mode = "500";
    completeAdventure("adv-aaa111", 1000);
    c.notifyLocalChange();
    await c.flush();
    expect(c.getSnapshot()).toEqual({ status: "error", pending: true });
    srv.s.mode = "ok";
    await c.resume();
    expect(c.getSnapshot().status).toBe("saved");
    expect(has(srv.s.save.done, "adv-aaa111")).toBe(true);
  });

  it("refreshes a stale CSRF token once and retries", async () => {
    const srv = fakeServer();
    let tok = "old";
    const { c } = controllerFor(srv, {
      getCsrf: () => tok,
      refreshCsrf: async () => (tok = "fresh"),
    });
    await c.start();
    srv.s.mode = "403";
    completeAdventure("adv-aaa111", 1000);
    c.notifyLocalChange();
    await c.flush();
    const puts = srv.calls.filter((x) => x.method === "PUT");
    expect(puts.map((p) => p.headers[CSRF])).toEqual(["old", "fresh"]);
    expect(c.getSnapshot().status).toBe("saved");
  });

  it("a 401 stops sync and tells the app the session is gone", async () => {
    const srv = fakeServer();
    const onSignedOut = vi.fn();
    const { c } = controllerFor(srv, { onSignedOut });
    await c.start();
    srv.s.mode = "401";
    completeAdventure("adv-aaa111", 1000);
    c.notifyLocalChange();
    await c.flush();
    expect(onSignedOut).toHaveBeenCalledTimes(1);
    expect(c.getSnapshot().status).toBe("off");
    expect(c.isActive).toBe(false);
  });

  it("a controller that was never started (free visitor) makes no calls", async () => {
    const srv = fakeServer();
    const { c, timers } = controllerFor(srv);
    completeAdventure("adv-aaa111", 1000);
    c.notifyLocalChange();
    await c.flush();
    await c.pull();
    await c.resume();
    expect(srv.fetchFn).not.toHaveBeenCalled();
    expect(timers).toHaveLength(0);
  });

  it("does not poll: resume within a minute of the last check makes no request", async () => {
    const srv = fakeServer();
    let t = 1_000_000;
    const { c } = controllerFor(srv, { now: () => t });
    await c.start();
    const gets = srv.s.gets;
    t += 30_000;
    await c.resume();
    expect(srv.s.gets).toBe(gets);
    t += 31_000;
    await c.resume();
    expect(srv.s.gets).toBe(gets + 1);
  });
});
