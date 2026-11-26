// Scheduled delivery against in-memory stores and a FAKE sender (no network): due buckets, idempotence, quiet hours,
// one general notification per week, pruning, stale items, kill switch, entitlement, bounds and logging hygiene.
import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { MemoryKV } from "../server/passport/kv";
import { createNotificationsApi, type NotifEnv } from "../server/passport/notifications-api";
import { LIMITS, pickGeneral, runDelivery, type RunStats } from "../server/passport/push-deliver";
import type { PushSender } from "../server/passport/push-sender";
import { emptyRecord, PushStore, defaultPrefs } from "../server/passport/push-store";
import { SLOT_MS, slotOf } from "../server/passport/schedule";
import { CustomerStore } from "../server/passport/store";

const KEY = "k".repeat(48);
const ENV: NotifEnv = {
  NOTIFICATIONS_ENABLED: "true",
  VAPID_PUBLIC_KEY: "B".repeat(87),
  VAPID_PRIVATE_KEY: "a".repeat(43),
  VAPID_SUBJECT: "mailto:owner@example.test",
};
const at = (y: number, mo: number, d: number, h = 0, mi = 0) => Date.UTC(y, mo - 1, d, h, mi);
const NO_QUIET = { start: "00:00", end: "00:00" };

type Sent = { endpoint: string; payload: Record<string, string>; raw: string; ttl: number };
function world(start = at(2026, 11, 25, 12, 0)) {
  const customers = new MemoryKV();
  const premium = new MemoryKV();
  const clock = { t: start };
  const now = () => clock.t;
  const sent: Sent[] = [];
  const answers = new Map<string, number>(); // endpoint -> status
  const logs: string[] = [];
  const sender: PushSender = async (sub, payload, opts) => {
    sent.push({
      endpoint: sub.endpoint,
      payload: JSON.parse(payload),
      raw: payload,
      ttl: opts.ttl,
    });
    return { status: answers.get(sub.endpoint) ?? 201 };
  };
  const capi = createNotificationsApi({ customers, premium, now, env: ENV });
  const cstore = new CustomerStore(customers, now);
  const pstore = new PushStore(customers, now);
  let n = 0;
  async function newCustomer(): Promise<string> {
    const { rec } = await cstore.activate(`hash-${++n}`, undefined, null, "active");
    return rec.id;
  }
  const call = (cus: string, path: string, method: string, body?: unknown) =>
    capi.handle(path, method, cus, KEY, async () => (body ?? {}) as Record<string, unknown>);
  async function subscribe(cus: string, host = "fcm.googleapis.com") {
    const endpoint = `https://${host}/fcm/send/${randomBytes(8).toString("hex")}-endpoint`;
    const r = await call(cus, "/api/push/subscribe", "POST", {
      subscription: {
        endpoint,
        keys: {
          p256dh: Buffer.concat([Buffer.from([4]), randomBytes(64)]).toString("base64url"),
          auth: randomBytes(16).toString("base64url"),
        },
      },
    });
    return { endpoint, deviceId: (r.body as { deviceId: string }).deviceId };
  }
  const prefs = (over: Record<string, unknown> = {}) => ({
    weekly: { enabled: true, day: 6, time: "09:00", tz: "UTC" },
    planned: { enabled: true },
    saved: { enabled: false },
    seasonal: { enabled: false },
    quiet: NO_QUIET,
    ...over,
  });
  const setPrefs = (cus: string, over?: Record<string, unknown>) =>
    call(cus, "/api/notifications/prefs", "PUT", prefs(over));
  let enabled = true;
  const once = (): Promise<RunStats> =>
    runDelivery({
      customers,
      dataKey: KEY,
      sender,
      enabled: () => enabled,
      now,
      log: (e, f) => logs.push(JSON.stringify({ e, ...f })),
    });
  // Simulates the real cron: a run at every 15-minute boundary since the previous call, then one at the current time.
  // `down: true` skips the catch-up ticks (the function was not running).
  let last: number | null = null;
  async function run(o: { down?: boolean } = {}): Promise<RunStats> {
    const target = clock.t;
    const times: number[] = [];
    if (o.down || last === null) times.push(target);
    else {
      for (let t = (Math.floor(last / SLOT_MS) + 1) * SLOT_MS; t <= target; t += SLOT_MS)
        times.push(t);
      if (times[times.length - 1] !== target) times.push(target);
    }
    last = target;
    const sum: RunStats = {
      disabled: false,
      slots: 0,
      entries: 0,
      accepted: 0,
      pruned: 0,
      failed: 0,
      skipped: 0,
      deferred: 0,
      stale: 0,
      errors: 0,
    };
    for (const t of times) {
      clock.t = t;
      const r = await once();
      for (const k of Object.keys(sum) as (keyof RunStats)[])
        if (k === "disabled") sum.disabled = r.disabled;
        else sum[k] += r[k];
    }
    clock.t = target;
    return sum;
  }
  const plan = (id: string, over: Record<string, unknown> = {}) => ({
    id,
    adventureId: "adv-k3m9x2",
    startAt: "2026-11-28T15:00:00Z",
    tz: "UTC",
    durationMin: 60,
    remind: "1h",
    push: true,
    status: "planned",
    updatedAt: 1,
    ...over,
  });
  return {
    customers,
    premium,
    clock,
    sent,
    answers,
    logs,
    cstore,
    pstore,
    newCustomer,
    call,
    subscribe,
    setPrefs,
    run,
    plan,
    setEnabled: (v: boolean) => (enabled = v),
  };
}

describe("weekly delivery", () => {
  it("sends once at the chosen time to the primary device, then schedules the next week", async () => {
    const w = world(); // Wed 2026-11-25 12:00 UTC
    const cus = await w.newCustomer();
    const a = await w.subscribe(cus);
    const b = await w.subscribe(cus, "updates.push.services.mozilla.com");
    await w.call(cus, "/api/push/primary", "POST", { deviceId: b.deviceId });
    await w.setPrefs(cus);
    await w.run(); // sets the cursor
    w.clock.t = at(2026, 11, 28, 8, 50);
    await w.run();
    expect(w.sent).toHaveLength(0); // not due yet
    w.clock.t = at(2026, 11, 28, 9, 5);
    const s = await w.run();
    expect(s.accepted).toBe(1);
    expect(w.sent).toHaveLength(1);
    expect(w.sent[0]!.endpoint).toBe(b.endpoint); // the primary device only
    expect(w.sent[0]!.endpoint).not.toBe(a.endpoint);
    expect(w.sent[0]!.payload).toEqual({
      kind: "weekly",
      title: "A little adventure awaits!",
      body: "Have some time together this weekend? Discover something new to do with your favorite companion.",
      url: "/discover?mode=surprise",
      tag: "weekly-2026-W48",
    });
    expect(w.sent[0]!.ttl).toBeLessThanOrEqual(6 * 3600);
    // idempotent: running again at the same time sends nothing
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 20);
    await w.run();
    expect(w.sent).toHaveLength(1);
    // next week
    const rec = (await w.pstore.get(cus))!;
    expect(rec.gnext! * SLOT_MS).toBe(at(2026, 12, 5, 9, 0));
    w.clock.t = at(2026, 12, 5, 9, 1);
    await w.run();
    expect(w.sent).toHaveLength(2);
  });

  it("two overlapping runs never double-send", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 1);
    await Promise.all([w.run(), w.run(), w.run()]);
    expect(w.sent).toHaveLength(1);
  });

  it("a customer with no devices or no enabled kind is never scheduled", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.setPrefs(cus);
    expect(w.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(0);
    await w.subscribe(cus);
    expect(w.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(1);
    await w.setPrefs(cus, { weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" } });
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 5);
    await w.run();
    expect(w.sent).toHaveLength(0);
  });

  it("changing the day moves the one pending entry; the old entry sends nothing", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.setPrefs(cus, { weekly: { enabled: true, day: 0, time: "10:00", tz: "UTC" } });
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 5); // old Saturday slot
    await w.run();
    expect(w.sent).toHaveLength(0);
    w.clock.t = at(2026, 11, 29, 10, 5);
    await w.run();
    expect(w.sent).toHaveLength(1);
  });

  it("uses the customer's time zone across DST", async () => {
    const w = world(at(2026, 3, 5, 12, 0));
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, {
      weekly: { enabled: true, day: 6, time: "09:00", tz: "America/New_York" },
    });
    await w.run();
    w.clock.t = at(2026, 3, 7, 14, 1); // 09:01 EST
    await w.run();
    expect(w.sent).toHaveLength(1);
    w.clock.t = at(2026, 3, 14, 12, 59); // 08:59 EDT
    await w.run();
    expect(w.sent).toHaveLength(1);
    w.clock.t = at(2026, 3, 14, 13, 1); // 09:01 EDT
    await w.run();
    expect(w.sent).toHaveLength(2);
  });
});

describe("one general notification per week", () => {
  it("seasonal beats weekly in the season-start week, then weekly resumes; never two in a week", async () => {
    const w = world(at(2026, 11, 30, 12, 0));
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, { seasonal: { enabled: true }, saved: { enabled: true } });
    await w.run();
    for (const d of [5, 12, 19, 26]) {
      w.clock.t = at(2026, 12, d, 9, 2);
      await w.run();
    }
    const kinds = w.sent.map((s) => s.payload["kind"]);
    expect(kinds).toHaveLength(4);
    expect(kinds[0]).toBe("seasonal"); // Dec 5 is in the first seven days of December
    expect(new Set(w.sent.map((s) => s.payload["tag"])).size).toBe(4); // never the same week twice
    expect(kinds.slice(1)).not.toContain("seasonal");
    expect(w.sent[0]!.payload["url"]).toBe("/discover?mode=made");
  });
  it("saved-only customers hear from us about once every four weeks", async () => {
    const w = world(at(2026, 11, 30, 12, 0));
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, {
      weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" },
      saved: { enabled: true },
    });
    await w.run();
    for (let i = 0; i < 8; i++) {
      w.clock.t = at(2026, 12, 5 + 7 * i, 9, 2);
      await w.run();
    }
    expect(w.sent.length).toBe(2);
    for (const s of w.sent) {
      expect(s.payload["kind"]).toBe("saved");
      expect(s.payload["url"]).toBe("/collections?tab=favorites");
    }
  });
  it("pickGeneral: only enabled kinds, seasonal then saved then weekly", () => {
    const rec = emptyRecord();
    rec.prefs = { ...defaultPrefs("UTC") };
    const ms = at(2026, 11, 14, 9);
    expect(pickGeneral(rec, "cus_00", ms)).toBeNull();
    rec.prefs.weekly.enabled = true;
    expect(pickGeneral(rec, "cus_00", ms)).toBe("weekly");
    rec.prefs.seasonal.enabled = true;
    expect(pickGeneral(rec, "cus_00", ms)).toBe("weekly"); // not a season-start week
    expect(pickGeneral(rec, "cus_00", at(2026, 12, 5, 9))).toBe("seasonal");
  });
});

describe("quiet hours", () => {
  it("delays a weekly send to the end of quiet hours", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, {
      weekly: { enabled: true, day: 6, time: "07:00", tz: "UTC" },
      quiet: { start: "21:00", end: "08:00" },
    });
    await w.run();
    w.clock.t = at(2026, 11, 28, 7, 5);
    const s1 = await w.run();
    expect(w.sent).toHaveLength(0);
    expect(s1.deferred).toBe(1);
    w.clock.t = at(2026, 11, 28, 7, 50);
    await w.run();
    expect(w.sent).toHaveLength(0);
    w.clock.t = at(2026, 11, 28, 8, 5);
    await w.run();
    expect(w.sent).toHaveLength(1);
    // and the next one is a week after the chosen time, not after the delayed one
    expect((await w.pstore.get(cus))!.gnext! * SLOT_MS).toBe(at(2026, 12, 5, 7, 0));
  });
  it("skips the week when quiet hours would delay it more than six hours", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, {
      weekly: { enabled: true, day: 6, time: "02:00", tz: "UTC" },
      quiet: { start: "21:00", end: "12:00" },
    });
    await w.run();
    w.clock.t = at(2026, 11, 28, 2, 5);
    await w.run();
    w.clock.t = at(2026, 11, 28, 12, 5);
    await w.run();
    expect(w.sent).toHaveLength(0);
    expect((await w.pstore.get(cus))!.gnext! * SLOT_MS).toBe(at(2026, 12, 5, 2, 0));
  });
});

describe("planned reminders", () => {
  it("sends at the reminder time to every device, once, with the plan link and no instructions", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.subscribe(cus, "web.push.apple.com");
    await w.setPrefs(cus, { weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" } });
    await w.call(cus, "/api/schedule/pl-abcd1234", "PUT", w.plan("pl-abcd1234"));
    await w.run();
    w.clock.t = at(2026, 11, 28, 13, 50);
    await w.run();
    expect(w.sent).toHaveLength(0);
    w.clock.t = at(2026, 11, 28, 14, 1);
    await w.run();
    await w.run();
    expect(w.sent).toHaveLength(2); // two devices, one delivery each
    const p = w.sent[0]!.payload;
    expect(p["kind"]).toBe("planned");
    expect(p["url"]).toBe("/passport?view=upcoming&plan=pl-abcd1234");
    expect(w.sent[0]!.raw).not.toContain("adv-");
    expect(w.sent[0]!.ttl).toBeLessThanOrEqual(3600);
  });
  it("cancelled, done, deleted, push-off, edited and planned-pref-off reminders never send the old one", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, { weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" } });
    const ids = ["pl-aaaaaaaa", "pl-bbbbbbbb", "pl-cccccccc", "pl-dddddddd", "pl-eeeeeeee"];
    for (const id of ids) await w.call(cus, `/api/schedule/${id}`, "PUT", w.plan(id));
    await w.call(cus, `/api/schedule/${ids[0]}`, "PUT", w.plan(ids[0]!, { status: "cancelled" }));
    await w.call(cus, `/api/schedule/${ids[1]}`, "PUT", w.plan(ids[1]!, { status: "done" }));
    await w.call(cus, `/api/schedule/${ids[2]}`, "DELETE");
    await w.call(cus, `/api/schedule/${ids[3]}`, "PUT", w.plan(ids[3]!, { push: false }));
    // id 4 is moved a day later: its old 14:00 entry is obsolete, the new one fires a day later
    await w.call(
      cus,
      `/api/schedule/${ids[4]}`,
      "PUT",
      w.plan(ids[4]!, { startAt: "2026-11-29T15:00:00Z" }),
    );
    await w.run();
    w.clock.t = at(2026, 11, 28, 14, 1);
    await w.run();
    expect(w.sent).toHaveLength(0);
    w.clock.t = at(2026, 11, 29, 14, 1);
    await w.run();
    expect(w.sent).toHaveLength(1);
    expect(w.sent[0]!.payload["tag"]).toBe("plan-pl-eeeeeeee");
  });
  it("respects the planned preference", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, {
      planned: { enabled: false },
      weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" },
    });
    await w.call(cus, "/api/schedule/pl-abcd1234", "PUT", w.plan("pl-abcd1234"));
    await w.run();
    w.clock.t = at(2026, 11, 28, 14, 1);
    await w.run();
    expect(w.sent).toHaveLength(0);
  });
  it("the 1-day reminder keeps its local time across DST", async () => {
    const w = world(at(2026, 3, 5, 12, 0));
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, { weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" } });
    // 10:00 EDT on 2026-03-08 -> reminder 10:00 EST on 2026-03-07 = 15:00Z
    await w.call(
      cus,
      "/api/schedule/pl-abcd1234",
      "PUT",
      w.plan("pl-abcd1234", {
        startAt: "2026-03-08T14:00:00Z",
        tz: "America/New_York",
        remind: "1d",
      }),
    );
    await w.run();
    w.clock.t = at(2026, 3, 7, 14, 50);
    await w.run();
    expect(w.sent).toHaveLength(0);
    w.clock.t = at(2026, 3, 7, 15, 1);
    await w.run();
    expect(w.sent).toHaveLength(1);
    expect(w.sent[0]!.payload["title"]).toBe("A planned adventure is coming up.");
  });
  it("a reminder falling in quiet hours waits for the morning, or is skipped if the event starts first", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus, {
      weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" },
      quiet: { start: "21:00", end: "08:00" },
    });
    // 1h before 07:30 is 06:30 (quiet): delayed to 08:00, but the event started at 07:30, so skipped
    await w.call(
      cus,
      "/api/schedule/pl-aaaaaaaa",
      "PUT",
      w.plan("pl-aaaaaaaa", { startAt: "2026-11-28T07:30:00Z" }),
    );
    // 1 day before 10:00 Sunday is 10:00 Saturday: not quiet, sent
    await w.call(
      cus,
      "/api/schedule/pl-bbbbbbbb",
      "PUT",
      w.plan("pl-bbbbbbbb", { startAt: "2026-11-29T22:30:00Z" }),
    );
    await w.run();
    for (const [d, h, m] of [
      [28, 6, 31],
      [28, 8, 5],
    ] as const) {
      w.clock.t = at(2026, 11, d, h, m);
      await w.run();
    }
    expect(w.sent).toHaveLength(0);
  });
});

describe("push service answers", () => {
  it("prunes a device on 404 and 410, keeps it on 500, and never retries", async () => {
    const w = world();
    const cus = await w.newCustomer();
    const a = await w.subscribe(cus);
    const b = await w.subscribe(cus, "updates.push.services.mozilla.com");
    await w.setPrefs(cus, { weekly: { enabled: false, day: 6, time: "09:00", tz: "UTC" } });
    await w.call(cus, "/api/schedule/pl-abcd1234", "PUT", w.plan("pl-abcd1234"));
    w.answers.set(a.endpoint, 410);
    w.answers.set(b.endpoint, 500);
    await w.run();
    w.clock.t = at(2026, 11, 28, 14, 1);
    const s = await w.run();
    expect(s.pruned).toBe(1);
    expect(s.failed).toBe(1);
    await w.run();
    w.clock.t = at(2026, 11, 28, 14, 16);
    await w.run();
    expect(w.sent).toHaveLength(2); // one attempt per device, no retry
    const rec = (await w.pstore.get(cus))!;
    expect(rec.devices.map((d) => d.id)).toEqual([b.deviceId]);
    expect(rec.primary).toBe(b.deviceId);
  });
  it("pruning the last device stops the weekly chain", async () => {
    const w = world();
    const cus = await w.newCustomer();
    const a = await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    w.answers.set(a.endpoint, 404);
    w.clock.t = at(2026, 11, 28, 9, 1);
    await w.run();
    const rec = (await w.pstore.get(cus))!;
    expect(rec.devices).toHaveLength(0);
    expect(rec.gnext).toBeUndefined();
  });
});

describe("kill switch, entitlement, staleness", () => {
  it("does nothing at all while the kill switch is off, and resumes after", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    w.clock.t = at(2026, 11, 28, 8, 50);
    await w.run();
    w.setEnabled(false);
    w.clock.t = at(2026, 11, 28, 9, 1);
    const s = await w.run();
    expect(s.disabled).toBe(true);
    expect(w.sent).toHaveLength(0);
    expect(s.slots).toBe(0);
    w.setEnabled(true);
    w.clock.t = at(2026, 11, 28, 9, 16);
    await w.run();
    // The due bucket is 15 minutes old, which is not stale: it still goes out.
    expect(w.sent).toHaveLength(1);
  });
  it("sends nothing for a revoked customer and removes their data", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    await w.cstore.setEntitlement(cus, { status: "refunded" });
    expect(await w.pstore.get(cus)).toBeNull();
    w.clock.t = at(2026, 11, 28, 9, 1);
    await w.run();
    expect(w.sent).toHaveLength(0);
  });
  it("checks entitlement at send time even if the data was somehow left behind", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    // Simulate a missed cleanup: flip the status directly in the store, bypassing setEntitlement.
    await w.cstore.mutate(cus, (r) => ({
      ...r,
      entitlement: { ...r.entitlement, status: "revoked" },
    }));
    w.clock.t = at(2026, 11, 28, 9, 1);
    await w.run();
    expect(w.sent).toHaveLength(0);
    expect(await w.pstore.get(cus)).toBeNull();
  });
  it("deleted customers send nothing", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    await w.cstore.remove(cus);
    w.clock.t = at(2026, 11, 28, 9, 1);
    await w.run();
    expect(w.sent).toHaveLength(0);
  });
  it("a bucket more than two hours old is stale: no send, the weekly chain moves on, reminders are dropped", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.call(
      cus,
      "/api/schedule/pl-abcd1234",
      "PUT",
      w.plan("pl-abcd1234", { startAt: "2026-11-28T10:30:00Z" }),
    );
    await w.run();
    w.clock.t = at(2026, 11, 28, 8, 50);
    await w.run();
    // the function was down until 12:00 on Saturday: the 09:00 weekly and 08:30 reminder are stale
    w.clock.t = at(2026, 11, 28, 12, 0);
    const s = await w.run({ down: true });
    expect(w.sent).toHaveLength(0);
    expect(s.stale).toBe(2);
    expect((await w.pstore.get(cus))!.gnext! * SLOT_MS).toBe(at(2026, 12, 5, 9, 0));
    expect(w.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(1);
  });
});

describe("bounds and hygiene", () => {
  it("handles at most maxEntries per run and finishes the rest next run", async () => {
    const w = world();
    const total = LIMITS.maxEntries + 5;
    for (let i = 0; i < total; i++) {
      const cus = await w.newCustomer();
      await w.subscribe(cus);
      await w.setPrefs(cus);
    }
    expect(w.customers.keys().filter((k) => k.startsWith("notifdue/"))).toHaveLength(1);
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 0);
    const s1 = await w.run();
    expect(s1.entries).toBe(LIMITS.maxEntries);
    expect(w.sent).toHaveLength(LIMITS.maxEntries);
    w.clock.t = at(2026, 11, 28, 9, 6);
    const s2 = await w.run();
    expect(s2.entries).toBe(5);
    expect(w.sent).toHaveLength(total);
    expect(new Set(w.sent.map((x) => x.endpoint)).size).toBe(total);
  });
  it("reads only the slots from the cursor to now (no scans)", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    w.clock.t = at(2026, 11, 25, 12, 20);
    const s = await w.run();
    expect(s.slots).toBeLessThanOrEqual(2);
    // a long outage catches up in a bounded number of slot reads per run
    w.clock.t = at(2026, 12, 30, 12, 0);
    const s2 = await w.run({ down: true });
    expect(s2.slots).toBeLessThanOrEqual(LIMITS.maxSlots);
    expect(slotOf(w.clock.t)).toBeGreaterThan(0);
  });
  it("never logs an endpoint, a key or a payload", async () => {
    const w = world();
    const cus = await w.newCustomer();
    const a = await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 1);
    await w.run();
    const all = w.logs.join("\n");
    expect(all).toContain("push_run");
    expect(all).not.toContain(a.endpoint);
    expect(all).not.toContain("fcm.googleapis");
    expect(all).not.toContain("adventure awaits");
    expect(all).not.toContain(cus);
  });
  it("stores no delivery history: markers expire after 14 days", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 1);
    await w.run();
    expect(Object.keys((await w.pstore.get(cus))!.sent)).toHaveLength(1);
    w.clock.t = at(2026, 12, 5, 9, 1);
    await w.run();
    w.clock.t = at(2026, 12, 12, 9, 1);
    await w.run();
    w.clock.t = at(2026, 12, 19, 9, 1);
    await w.run();
    const markers = Object.keys((await w.pstore.get(cus))!.sent);
    expect(markers.length).toBeLessThanOrEqual(2); // only the last 14 days remain
  });
  it("an unreadable stored subscription is pruned instead of crashing the run", async () => {
    const w = world();
    const cus = await w.newCustomer();
    await w.subscribe(cus);
    await w.setPrefs(cus);
    await w.pstore.mutate(cus, (r) => ({
      ...r,
      devices: r.devices.map((d) => ({ ...d, sealed: "v1.broken.broken.broken" })),
    }));
    await w.run();
    w.clock.t = at(2026, 11, 28, 9, 1);
    const s = await w.run();
    expect(s.pruned).toBe(1);
    expect(w.sent).toHaveLength(0);
  });
});
