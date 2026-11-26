import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adv, renderUi } from "./collections-fixtures";
import { AccessForm, AccountPanel, SharedDeviceChoice } from "@/components/passport/AccessForms";
import { PassportRuntime, _resetSyncForTests } from "@/passport/useSync";
import { ACCOUNT_FLAG, _resetEntitlementForTests, getEntitlement } from "@/passport/premium-client";
import { _resetForTests, completeAdventure, getSave, setProfile } from "@/passport/local-store";
import {
  ANONYMOUS_PREFERENCE_KEYS,
  CUSTOMER_LOCAL_KEYS,
  CUSTOMER_SESSION_KEYS,
  OWNER_KEY,
  _resetOwnerForTests,
} from "@/passport/device-owner";
import { has } from "@/passport/progress";
import { _resetPlansForTests } from "@/lib/plans";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => null }));
vi.mock("@/components/site/InstallPrompt", () => ({ InstallPrompt: () => null }));

const OWNER_A = "a1a1a1a1a1a1a1a1a1a1a1a1";
const OWNER_B = "b2b2b2b2b2b2b2b2b2b2b2b2";
const PREMIUM = adv("adv-ppp111", "Lighthouse Secret Walk", {
  access: "premium",
  collections: ["road-trip-adventures"],
});

function server(owner: string) {
  const s = { calls: [] as { method: string; url: string; body: unknown }[], signedOut: false };
  const fn = vi.fn(async (url: string, init: RequestInit = {}) => {
    const method = (init.method ?? "GET").toUpperCase();
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    s.calls.push({ method, url, body });
    const r = (st: number, b: unknown) => new Response(JSON.stringify(b), { status: st });
    switch (`${method} ${url}`) {
      case "GET /api/session":
        return r(200, {
          ok: true,
          authenticated: true,
          entitled: true,
          status: "active",
          csrf: "c1",
          owner,
        });
      case "GET /api/premium/adventures":
        return r(200, { ok: true, adventures: [PREMIUM] });
      case "GET /api/progress":
      case "PUT /api/progress":
        return r(200, { ok: true, save: { v: 2, rev: 1 }, rev: 1, changed: false, stale: false });
      case "DELETE /api/push/subscribe":
        return r(200, { ok: true });
      case "POST /api/session/signout":
        s.signedOut = true;
        return r(200, { ok: true });
      case "POST /api/access/activate":
        return r(200, {
          ok: true,
          reason: "activated",
          entitled: true,
          csrf: "c1",
          owner,
          save: null,
          rev: 1,
        });
      default:
        return r(404, { ok: false });
    }
  });
  vi.stubGlobal("fetch", fn);
  return s;
}
const syncCalls = (s: ReturnType<typeof server>) =>
  s.calls.filter((c) => c.url === "/api/progress");
const settle = () => act(async () => void (await new Promise((r) => setTimeout(r, 30))));

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  _resetForTests();
  _resetEntitlementForTests();
  _resetSyncForTests();
  _resetOwnerForTests();
  _resetPlansForTests();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function seedFirstCustomer() {
  window.localStorage.setItem(OWNER_KEY, OWNER_A);
  setProfile({ name: "Biscuit" } as never, 1000);
  completeAdventure("adv-aaa111", 1000);
  window.localStorage.setItem(ACCOUNT_FLAG, "1");
}

describe("a second customer on the same device", () => {
  it("does not sync or merge the first customer's local records, and offers to start fresh", async () => {
    seedFirstCustomer();
    const s = server(OWNER_B);
    await renderUi(
      <>
        <PassportRuntime />
        <SharedDeviceChoice />
      </>,
    );
    await waitFor(() => expect(getEntitlement().status).toBe("entitled"));
    await settle();
    expect(syncCalls(s)).toEqual([]); // nothing uploaded, nothing pulled and merged
    expect(screen.getByText(/someone else's progress/)).toBeInTheDocument();
    expect(has(getSave().done, "adv-aaa111")).toBe(true); // still local only, until they choose
    // "Start fresh" is the primary choice
    fireEvent.click(screen.getByRole("button", { name: "Start fresh on this device" }));
    await waitFor(() => expect(syncCalls(s).length).toBeGreaterThan(0));
    expect(has(getSave().done, "adv-aaa111")).toBe(false);
    expect(JSON.stringify({ ...window.localStorage })).not.toContain("Biscuit");
    expect(window.localStorage.getItem(OWNER_KEY)).toBe(OWNER_B);
    const puts = s.calls.filter((c) => c.method === "PUT");
    expect(JSON.stringify(puts)).not.toContain("Biscuit");
  });

  it("'Keep it on this device only' keeps sync paused and never uploads the earlier records", async () => {
    seedFirstCustomer();
    const s = server(OWNER_B);
    await renderUi(
      <>
        <PassportRuntime />
        <SharedDeviceChoice />
      </>,
    );
    await waitFor(() => expect(screen.getByText(/someone else's progress/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Keep it on this device only" }));
    act(() => completeAdventure("adv-aaa222", 2000));
    await settle();
    expect(syncCalls(s)).toEqual([]);
    expect(screen.getByText(/staying on this device only/)).toBeInTheDocument();
    expect(window.localStorage.getItem(OWNER_KEY)).toBe(OWNER_A);
  });

  it("activation never offers a tagged local save to the server and does not merge into the new account", async () => {
    seedFirstCustomer();
    window.localStorage.removeItem(ACCOUNT_FLAG);
    const s = server(OWNER_B);
    await renderUi(<AccessForm kind="activate" />);
    fireEvent.change(screen.getByLabelText("Purchase code"), {
      target: { value: "TESTCODE-12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Activate" }));
    await screen.findByText(/nothing has been merged yet/);
    const call = s.calls.find((c) => c.url === "/api/access/activate")!;
    expect(JSON.stringify(call.body)).not.toContain("localSave");
    expect(JSON.stringify(call.body)).not.toContain("Biscuit");
    expect(screen.getByRole("button", { name: "Start fresh on this device" })).toBeInTheDocument();
  });
});

describe("the same customer returning", () => {
  it("syncs normally with no prompt", async () => {
    seedFirstCustomer();
    const s = server(OWNER_A);
    await renderUi(
      <>
        <PassportRuntime />
        <SharedDeviceChoice />
      </>,
    );
    await waitFor(() => expect(syncCalls(s).length).toBeGreaterThan(0));
    expect(screen.queryByText(/someone else's progress/)).toBeNull();
    expect(has(getSave().done, "adv-aaa111")).toBe(true);
  });

  it("local records with no owner (free progress) still merge on first sign-in and are then tagged", async () => {
    completeAdventure("adv-aaa111", 1000);
    window.localStorage.setItem(ACCOUNT_FLAG, "1");
    const s = server(OWNER_B);
    await renderUi(<PassportRuntime />);
    await waitFor(() => expect(syncCalls(s).length).toBeGreaterThan(0));
    expect(window.localStorage.getItem(OWNER_KEY)).toBe(OWNER_B);
  });
});

describe("sign-out", () => {
  it("leaves no premium text readable in memory or any browser store, and stops sync", async () => {
    seedFirstCustomer();
    const s = server(OWNER_A);
    await renderUi(
      <>
        <PassportRuntime />
        <AccountPanel />
      </>,
    );
    await waitFor(() => expect(getEntitlement().premium.length).toBe(1));
    fireEvent.click(screen.getByRole("button", { name: "Sign out of this device" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, sign out of this device" }));
    await waitFor(() => expect(s.signedOut).toBe(true));
    await settle();
    expect(getEntitlement()).toMatchObject({
      status: "free",
      premium: [],
      csrf: "",
      signedIn: false,
    });
    const all =
      JSON.stringify({ ...window.localStorage }) +
      JSON.stringify({ ...window.sessionStorage }) +
      document.body.textContent;
    for (const t of ["Lighthouse", "Secret Walk", "adv-ppp111"]) expect(all).not.toContain(t);
    expect(window.localStorage.getItem(ACCOUNT_FLAG)).toBeNull();
  });
});

describe("Sign out and clear this device", () => {
  it("asks first, then removes every customer-specific key and keeps anonymous preferences", async () => {
    seedFirstCustomer();
    for (const k of CUSTOMER_LOCAL_KEYS)
      if (!window.localStorage.getItem(k))
        window.localStorage.setItem(k, k === OWNER_KEY ? OWNER_A : "x");
    for (const k of CUSTOMER_SESSION_KEYS) window.sessionStorage.setItem(k, '["adv-aaa111"]');
    for (const k of ANONYMOUS_PREFERENCE_KEYS) window.localStorage.setItem(k, "keep");
    window.localStorage.setItem("pp.push.device", "dev-1");
    const s = server(OWNER_A);
    await renderUi(<AccountPanel />);
    await waitFor(() => expect(getEntitlement().status).toBe("entitled"));
    fireEvent.click(screen.getByRole("button", { name: "Sign out and clear this device" }));
    expect(s.signedOut).toBe(false); // needs the explicit confirmation
    expect(screen.getByText(/dog's names and profile/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Yes, sign out and clear this device" }));
    await screen.findByText(/Signed out and cleared this device/);
    expect(s.signedOut).toBe(true);
    expect(s.calls.some((c) => c.method === "DELETE" && c.url === "/api/push/subscribe")).toBe(
      true,
    );
    for (const k of CUSTOMER_LOCAL_KEYS) expect(window.localStorage.getItem(k), k).toBeNull();
    for (const k of CUSTOMER_SESSION_KEYS) expect(window.sessionStorage.getItem(k), k).toBeNull();
    for (const k of ANONYMOUS_PREFERENCE_KEYS)
      expect(window.localStorage.getItem(k), k).toBe("keep");
    expect(has(getSave().done, "adv-aaa111")).toBe(false);
    expect(JSON.stringify(getSave())).not.toContain("Biscuit");
    expect(getEntitlement().premium).toEqual([]);
  });

  it("still clears this device when the site cannot be reached, and says so", async () => {
    seedFirstCustomer();
    const s = server(OWNER_A);
    await renderUi(<AccountPanel />);
    await waitFor(() => expect(getEntitlement().status).toBe("entitled"));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("offline"))),
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign out and clear this device" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, sign out and clear this device" }));
    expect(
      await screen.findByText(/couldn't reach the site to clear the sign-in cookie/),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("pp.save.v1")).toBeNull();
    void s;
  });
});
