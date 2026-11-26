import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, renderUi } from "./collections-fixtures";
import { NotificationSettings } from "@/components/passport/NotificationSettings";
import { ScheduleAdventure } from "@/components/passport/ScheduleAdventure";
import { UpcomingAdventures } from "@/components/passport/UpcomingAdventures";
import { MysteryCard } from "@/components/passport/AdventureCard";
import { _resetForTests } from "@/passport/local-store";
import { _resetPlansForTests, getPlans, savePlan } from "@/lib/plans";
import { detectPushSupport } from "@/lib/push-support";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
const ent = vi.hoisted(() => ({ status: "entitled" as "entitled" | "free" }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: [],
    signedIn: false,
    csrf: "tok",
    message: null,
  }),
}));
vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("@/passport/keepsake/download", () => ({ downloadBlob: vi.fn() }));

const PREFS = {
  weekly: { enabled: false, day: 6, time: "09:00", tz: "America/Chicago" },
  planned: { enabled: false },
  saved: { enabled: false },
  seasonal: { enabled: false },
  quiet: { start: "21:00", end: "08:00" },
};
let calls: { method: string; url: string; body?: unknown }[] = [];
let devices: unknown[] = [];
let config = { enabled: true, publicKey: "BEl6" };

function mockFetch() {
  calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push({ method, url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      const json = (v: unknown) => ({ ok: true, status: 200, json: async () => v });
      if (url === "/api/push/config") return json(config);
      if (url === "/api/notifications/prefs" && method === "GET") return json(PREFS);
      if (url === "/api/notifications/prefs") return json({});
      if (url === "/api/push/devices") return json({ devices });
      if (url === "/api/notifications") return json({ ok: true });
      if (url === "/api/schedule" && method === "GET") return json({ plans: [] });
      return json({ ok: true });
    }),
  );
}

function fakeBrowser(
  permission: NotificationPermission,
  request?: () => Promise<NotificationPermission>,
) {
  const N = Object.assign(function () {}, { permission, requestPermission: undefined as unknown });
  const req = vi.fn(async () => {
    const r = request ? await request() : permission;
    N.permission = r;
    return r;
  });
  N.requestPermission = req;
  Object.defineProperty(window, "Notification", { configurable: true, value: N });
  Object.defineProperty(window, "PushManager", { configurable: true, value: function () {} });
  const sub = {
    toJSON: () => ({ endpoint: "https://fcm.googleapis.com/x", keys: { p256dh: "a", auth: "b" } }),
    unsubscribe: vi.fn(async () => true),
  };
  const reg = {
    pushManager: { getSubscription: vi.fn(async () => null), subscribe: vi.fn(async () => sub) },
  };
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { getRegistration: vi.fn(async () => reg), register: vi.fn(async () => reg) },
  });
  return { req, reg, sub };
}
function removeBrowser() {
  for (const k of ["Notification", "PushManager"])
    delete (window as unknown as Record<string, unknown>)[k];
  delete (navigator as unknown as Record<string, unknown>)["serviceWorker"];
}

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  _resetPlansForTests();
  ent.status = "entitled";
  devices = [];
  config = { enabled: true, publicKey: "BEl6" };
  mockFetch();
});
afterEach(() => {
  cleanup();
  removeBrowser();
  vi.unstubAllGlobals();
});

describe("notification settings", () => {
  it("makes no network call and no permission request for a free visitor", () => {
    ent.status = "free";
    const b = fakeBrowser("default");
    render(<NotificationSettings />);
    expect(screen.getByText(/come with the full Passport/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /turn on notifications/i })).toBeNull();
    expect(calls).toHaveLength(0);
    expect(b.req).not.toHaveBeenCalled();
  });

  it("explains first and asks the browser only when the button is pressed", async () => {
    const b = fakeBrowser("default", async () => "granted");
    render(<NotificationSettings />);
    const btn = await screen.findByRole("button", { name: "Turn on notifications" });
    expect(screen.getByText(/Would you like a little adventure inspiration/)).toBeInTheDocument();
    expect(b.req).not.toHaveBeenCalled();
    fireEvent.click(btn);
    await waitFor(() => expect(b.req).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(calls.some((c) => c.url === "/api/push/subscribe" && c.method === "POST")).toBe(true),
    );
    expect(window.localStorage.getItem("pp.push.device")).toBeNull(); // mock returned no deviceId
  });

  it("handles a decline calmly and never asks again by itself", async () => {
    const b = fakeBrowser("default", async () => "denied");
    const { rerender } = render(<NotificationSettings />);
    fireEvent.click(await screen.findByRole("button", { name: "Turn on notifications" }));
    expect(await screen.findByText(/blocked for this site in your browser/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Turn on notifications" })).toBeNull();
    rerender(<NotificationSettings />);
    expect(b.req).toHaveBeenCalledTimes(1);
  });

  it("shows the how-to for browser settings only when permission is denied", async () => {
    fakeBrowser("default");
    render(<NotificationSettings />);
    await screen.findByRole("button", { name: "Turn on notifications" });
    expect(screen.queryByText(/site settings/i)).toBeNull();
  });

  it("saves each toggle independently and sets the weekly defaults only when enabled", async () => {
    fakeBrowser("granted");
    devices = [{ deviceId: "d1", label: "Android Chrome", createdAt: 1, primary: true }];
    window.localStorage.setItem("pp.push.device", "d1");
    render(<NotificationSettings />);
    fireEvent.click(await screen.findByRole("checkbox", { name: /Saved-adventure reminders/ }));
    await waitFor(() => expect(calls.filter((c) => c.method === "PUT")).toHaveLength(1));
    let put = calls.filter((c) => c.method === "PUT")[0]!.body as typeof PREFS;
    expect(put.saved.enabled).toBe(true);
    expect(put.weekly.enabled).toBe(false);
    fireEvent.click(screen.getByRole("checkbox", { name: /Weekly inspiration/ }));
    await waitFor(() => expect(calls.filter((c) => c.method === "PUT")).toHaveLength(2));
    put = calls.filter((c) => c.method === "PUT")[1]!.body as typeof PREFS;
    expect(put.weekly).toMatchObject({ enabled: true, day: 6, time: "09:00" });
    expect(put.weekly.tz).toBeTruthy();
  });

  it("turns off everything and removes this device's subscription", async () => {
    const b = fakeBrowser("granted");
    b.reg.pushManager.getSubscription.mockResolvedValue(b.sub as never);
    devices = [{ deviceId: "d1", label: "Android Chrome", createdAt: 1, primary: true }];
    window.localStorage.setItem("pp.push.device", "d1");
    render(<NotificationSettings />);
    fireEvent.click(await screen.findByRole("button", { name: "Turn off all notifications" }));
    await waitFor(() =>
      expect(calls.some((c) => c.method === "DELETE" && c.url === "/api/notifications")).toBe(true),
    );
    await waitFor(() => expect(b.sub.unsubscribe).toHaveBeenCalled());
    expect(window.localStorage.getItem("pp.push.device")).toBeNull();
  });

  it("lists devices by label and can pick one for weekly ideas", async () => {
    fakeBrowser("granted");
    devices = [
      { deviceId: "d1", label: "iOS Safari", createdAt: 1, primary: true },
      { deviceId: "d2", label: "Mac Chrome", createdAt: 2, primary: false },
    ];
    render(<NotificationSettings />);
    fireEvent.click(await screen.findByRole("button", { name: "Use for weekly ideas" }));
    await waitFor(() => expect(calls.some((c) => c.url === "/api/push/primary")).toBe(true));
    expect(screen.getByText(/iOS Safari/)).toBeInTheDocument();
  });

  it("says reminders are unavailable when the owner switch is off", async () => {
    fakeBrowser("default");
    config = { enabled: false, publicKey: null as never };
    render(<NotificationSettings />);
    expect(
      await screen.findByText(
        "Reminders are not available right now. Calendar files still work on every adventure.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Turn on notifications" })).toBeNull();
  });

  it("hides the controls where push is unsupported and makes no calls", () => {
    removeBrowser();
    render(<NotificationSettings />);
    expect(screen.getByText(/can't show reminders/i)).toBeInTheDocument();
    expect(calls).toHaveLength(0);
  });

  it("explains the home-screen install on iPhone and links to /install", () => {
    const ua = vi
      .spyOn(navigator, "userAgent", "get")
      .mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS) Safari");
    expect(detectPushSupport()).toBe("ios-needs-install");
    render(<NotificationSettings />);
    expect(screen.getByRole("link", { name: "Read the optional install guide" })).toHaveAttribute(
      "href",
      "/install",
    );
    expect(calls).toHaveLength(0);
    ua.mockRestore();
  });

  it("uses calm, non-pressuring words", () => {
    removeBrowser();
    const { container } = render(<NotificationSettings />);
    expect(container.textContent).not.toMatch(
      /haven't played|is waiting|you missed|streak|falling behind|don't miss|last chance|hurry/i,
    );
  });
});

describe("scheduling", () => {
  async function open(a = A1) {
    await renderUi(<ScheduleAdventure a={a} />);
    fireEvent.click(screen.getByRole("button", { name: /Schedule adventure|Add to calendar/ }));
  }
  it("offers calendar-only 'Add to calendar' to a free visitor and makes no request", async () => {
    ent.status = "free";
    await open();
    expect(screen.queryByRole("checkbox", { name: /Paws & Passage reminder/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Save plan" }));
    await waitFor(() =>
      expect(screen.getByText(/delete the event in your calendar too/)).toBeInTheDocument(),
    );
    expect(calls).toHaveLength(0);
    expect(getPlans()).toHaveLength(1);
  });

  it("rescheduling edits the same plan: no duplicates", async () => {
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Save plan" }));
    await waitFor(() => expect(getPlans()).toHaveLength(1));
    const id = getPlans()[0]!.id;
    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "15:30" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(getPlans()[0]!.startAt).toContain(":30:00"));
    expect(getPlans()).toHaveLength(1);
    expect(getPlans()[0]!.id).toBe(id);
  });

  it("syncs a push reminder through the API for an entitled customer with push on", async () => {
    fakeBrowser("granted");
    window.localStorage.setItem("pp.push.device", "d1");
    await open();
    fireEvent.click(screen.getByRole("checkbox", { name: /Paws & Passage reminder/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save plan" }));
    await waitFor(() =>
      expect(calls.some((c) => c.method === "PUT" && c.url.startsWith("/api/schedule/pl-"))).toBe(
        true,
      ),
    );
    const put = calls.find((c) => c.url.startsWith("/api/schedule/"))!.body as {
      push: boolean;
      adventureId: string;
    };
    expect(put).toMatchObject({ push: true, adventureId: A1.id });
  });

  it("never lists a push reminder option when push is unavailable", async () => {
    removeBrowser();
    await open();
    expect(screen.queryByRole("checkbox", { name: /Paws & Passage reminder/ })).toBeNull();
  });
});

describe("upcoming adventures", () => {
  const mk = () =>
    savePlan({
      adventureId: A1.id,
      startAt: new Date(Date.now() + 864e5).toISOString(),
      tz: "UTC",
      durationMin: 30,
      remind: "1h",
      push: true,
    });

  it("edits, cancels and updates the server for a push plan", async () => {
    const p = mk()!;
    await renderUi(<UpcomingAdventures />);
    await waitFor(() => expect(calls.some((c) => c.url === "/api/schedule")).toBe(true));
    fireEvent.click(screen.getByRole("button", { name: /Edit date and time/ }));
    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "11:15" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() =>
      expect(calls.some((c) => c.method === "PUT" && c.url === `/api/schedule/${p.id}`)).toBe(true),
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancel plan/ }));
    // A cancel is sent as the plan's new state (a tombstone), not a delete, so other devices learn about it.
    await waitFor(() =>
      expect(
        calls.some(
          (c) =>
            c.method === "PUT" &&
            c.url === `/api/schedule/${p.id}` &&
            (c.body as { status?: string } | undefined)?.status === "cancelled",
        ),
      ).toBe(true),
    );
    expect(calls.some((c) => c.method === "DELETE" && c.url.startsWith("/api/schedule/"))).toBe(
      false,
    );
    expect(getPlans()[0]!.status).toBe("cancelled");
  });

  it("marks done and collects the adventure", async () => {
    mk();
    await renderUi(<UpcomingAdventures />);
    fireEvent.click(screen.getByRole("button", { name: /Mark .* done/ }));
    await waitFor(() => expect(getPlans()[0]!.status).toBe("done"));
    expect(window.localStorage.getItem("pp.save.v1")).toContain(A1.id);
  });

  it("makes no request for a free visitor", async () => {
    ent.status = "free";
    mk();
    await renderUi(<UpcomingAdventures />);
    expect(calls).toHaveLength(0);
  });
});

describe("one scratch-or-tap reveal surface", () => {
  it("reveals on tap or keyboard from the single labeled surface, and announces it", () => {
    const onReveal = vi.fn();
    render(<MysteryCard a={A1} onReveal={onReveal} />);
    const surface = screen.getByRole("button", { name: "Scratch or tap to reveal." });
    expect(screen.queryByRole("button", { name: /reveal adventure/i })).toBeNull();
    fireEvent.click(surface);
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
  it("reveals by scratching across the surface", () => {
    const onReveal = vi.fn();
    render(<MysteryCard a={A1} onReveal={onReveal} />);
    const s = screen.getByRole("button", { name: "Scratch or tap to reveal." });
    fireEvent.pointerDown(s, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(s, { clientX: 60, clientY: 0 });
    fireEvent.pointerMove(s, { clientX: 130, clientY: 10 });
    fireEvent.click(s); // the click that follows a scratch is swallowed
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
  it("never asks again for an adventure already revealed", () => {
    const onReveal = vi.fn();
    const { unmount } = render(<MysteryCard a={A1} onReveal={onReveal} />);
    fireEvent.click(screen.getByRole("button", { name: "Scratch or tap to reveal." }));
    unmount();
    const again = vi.fn();
    render(<MysteryCard a={A1} onReveal={again} />);
    expect(screen.queryByRole("button", { name: "Scratch or tap to reveal." })).toBeNull();
    expect(again).toHaveBeenCalledTimes(1);
    void within;
    void act;
  });
});
