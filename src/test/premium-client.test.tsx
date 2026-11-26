import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, adv, renderUi } from "./collections-fixtures";
import { useLibrary } from "@/components/passport/collections-shared";
import { AccessForm, AccountPanel } from "@/components/passport/AccessForms";
import { StoryTimeline } from "@/components/passport/StoryTimeline";
import { SyncStatus } from "@/components/passport/SyncStatus";
import { PassportRuntime, _resetSyncForTests } from "@/passport/useSync";
import {
  ACCOUNT_FLAG,
  OFFLINE_MESSAGE,
  REVOKED_MESSAGE,
  _resetEntitlementForTests,
  acceptPremium,
  getEntitlement,
  refreshEntitlement,
} from "@/passport/premium-client";
import { canon } from "@/passport/sync";
import { _resetForTests, completeAdventure, getSave } from "@/passport/local-store";
import { add, emptySave, has, merge, migrate, type Save } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => null }));
const downloads = vi.hoisted(() => vi.fn());
vi.mock("@/passport/keepsake/render", () => ({ downloadBlob: downloads }));

const CODE = "TESTCODE-12345678";
const PREMIUM = adv("adv-ppp111", "Lighthouse Secret Walk", {
  access: "premium",
  collections: ["road-trip-adventures"],
});
const PREMIUM_JUNK = { ...adv("adv-ppp222", "Broken Premium"), instructions: "not a list" };
const PREMIUM_BAD_SLUG = adv("adv-ppp333", "Unknown Deck Adventure", {
  access: "premium",
  collections: ["no-such-deck"],
});

type Srv = ReturnType<typeof server>;
function server(over: { entitled?: boolean; save?: Save } = {}) {
  const s = {
    authenticated: true,
    entitled: over.entitled ?? true,
    save: over.save ?? emptySave(),
    rev: 1,
    offline: false,
    premiumRaw: [PREMIUM, PREMIUM_JUNK, PREMIUM_BAD_SLUG] as unknown[],
    urls: [] as string[],
    puts: 0,
    deleted: false,
    exports: 0,
    lastBodies: [] as { path: string; body: unknown; csrf: string | null }[],
  };
  const fn = vi.fn(async (url: string, init: RequestInit = {}) => {
    s.urls.push(url);
    if (s.offline) throw new TypeError("offline");
    const method = (init.method ?? "GET").toUpperCase();
    const h = (init.headers ?? {}) as Record<string, string>;
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    s.lastBodies.push({ path: url, body, csrf: h["x-pp-csrf"] ?? null });
    const r = (st: number, b: unknown) => new Response(JSON.stringify(b), { status: st });
    switch (`${method} ${url}`) {
      case "GET /api/session":
        return s.authenticated
          ? r(200, {
              ok: true,
              authenticated: true,
              entitled: s.entitled,
              status: s.entitled ? "active" : "refunded",
              csrf: "csrf-1",
            })
          : r(401, { ok: false });
      case "GET /api/premium/adventures":
        return s.entitled
          ? r(200, { ok: true, adventures: s.premiumRaw })
          : r(403, { ok: false, error: "not_entitled" });
      case "GET /api/progress":
        return r(200, { ok: true, save: { ...s.save, rev: s.rev }, rev: s.rev });
      case "PUT /api/progress": {
        s.puts++;
        const merged = merge(s.save, migrate(body.save)!);
        if (canon(merged) !== canon(s.save)) s.rev++;
        s.save = merged;
        return r(200, {
          ok: true,
          save: { ...merged, rev: s.rev },
          rev: s.rev,
          changed: true,
          stale: false,
        });
      }
      case "POST /api/account/export":
        s.exports++;
        return new Response(JSON.stringify({ progress: s.save }), { status: 200 });
      case "POST /api/account/delete":
        if (body?.confirm !== "DELETE") return r(400, { ok: false });
        s.deleted = true;
        s.authenticated = false;
        return r(200, { ok: true, deleted: true });
      case "POST /api/access/activate":
      case "POST /api/access/restore":
        return r(200, {
          ok: true,
          reason: "activated",
          entitled: true,
          csrf: "csrf-1",
          save: s.save,
          rev: s.rev,
        });
      default:
        return r(404, { ok: false });
    }
  });
  return { s, fn };
}

let srv: Srv;
const install = (x: Srv) => {
  srv = x;
  vi.stubGlobal("fetch", x.fn);
};
const flag = () => window.localStorage.setItem(ACCOUNT_FLAG, "1");

function Probe() {
  const { save } = usePassport();
  const lib = useLibrary(save);
  return (
    <div>
      <p data-testid="unlocked">{String(lib.unlocked)}</p>
      <ul data-testid="all">
        {lib.all.map((a) => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
      <ul data-testid="eligible">
        {lib.eligible.map((a) => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
    </div>
  );
}
const titles = (id: string) =>
  [...screen.getByTestId(id).querySelectorAll("li")].map((l) => l.textContent);

let consoleSpies: ReturnType<typeof vi.spyOn>[] = [];
beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  _resetForTests();
  _resetEntitlementForTests();
  _resetSyncForTests();
  downloads.mockClear();
  consoleSpies = (["log", "info", "warn", "error", "debug"] as const).map((m) =>
    vi.spyOn(console, m).mockImplementation(() => undefined),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function settle() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 20));
  });
}

describe("free visitor", () => {
  it("makes zero network calls, even on focus, hide, online and local edits", async () => {
    install(server());
    await renderUi(
      <>
        <PassportRuntime />
        <Probe />
        <SyncStatus />
        <AccountPanel />
      </>,
    );
    act(() => {
      completeAdventure(A1.id, 1000);
      window.dispatchEvent(new Event("focus"));
      window.dispatchEvent(new Event("online"));
      window.dispatchEvent(new Event("pagehide"));
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await settle();
    expect(srv.fn).not.toHaveBeenCalled();
    expect(screen.getByTestId("unlocked").textContent).toBe("false");
    expect(getEntitlement().status).toBe("free");
    expect(screen.queryByText(/Full Passport account/)).toBeNull();
    expect(document.body.textContent).not.toMatch(/Saved|Saving|Offline/);
  });
});

describe("entitled visitor", () => {
  it("loads premium, validates every adventure, drops invalid ones and keeps nothing in browser storage", async () => {
    flag();
    install(server());
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    await renderUi(
      <>
        <PassportRuntime />
        <Probe />
      </>,
    );
    await waitFor(() => expect(screen.getByTestId("unlocked").textContent).toBe("true"));
    expect(titles("all")).toContain("Lighthouse Secret Walk");
    expect(titles("all")).not.toContain("Broken Premium");
    expect(titles("all")).not.toContain("Unknown Deck Adventure");
    expect(titles("eligible")).toContain("Lighthouse Secret Walk"); // ctx.unlocked reaches eligibility
    expect(srv.s.urls).toContain("/api/premium/adventures");
    // nothing premium in any store, ever written
    const written = JSON.stringify(setItem.mock.calls);
    const stored =
      JSON.stringify({ ...window.localStorage }) + JSON.stringify({ ...window.sessionStorage });
    for (const needle of ["adv-ppp111", "Lighthouse", "Secret Walk", "adv-ppp222"]) {
      expect(written).not.toContain(needle);
      expect(stored).not.toContain(needle);
    }
    const idb = (globalThis as { indexedDB?: { open?: unknown } }).indexedDB;
    if (idb && typeof idb.open === "function") {
      const spy = vi.spyOn(idb as IDBFactory, "open");
      await settle();
      expect(spy).not.toHaveBeenCalled();
    }
    expect((globalThis as { caches?: unknown }).caches).toBeUndefined();
  });

  it("without being entitled the premium adventure is not in the library or the eligible list", async () => {
    flag();
    install(server({ entitled: false }));
    await renderUi(<Probe />);
    await waitFor(() => expect(getEntitlement().status).toBe("revoked"));
    expect(screen.getByTestId("unlocked").textContent).toBe("false");
    expect(titles("all")).not.toContain("Lighthouse Secret Walk");
    expect(titles("eligible")).not.toContain("Lighthouse Secret Walk");
  });

  it("revoked after refund: premium cleared, progress kept, plain message, placeholder in history", async () => {
    flag();
    install(server());
    completeAdventure(PREMIUM.id, 5000);
    await renderUi(
      <>
        <PassportRuntime />
        <SyncStatus />
        <Probe />
        <StoryTimeline />
      </>,
    );
    await waitFor(() => expect(titles("all")).toContain("Lighthouse Secret Walk"));
    expect(screen.getAllByText("Lighthouse Secret Walk").length).toBeGreaterThan(0);
    srv.s.entitled = false; // refunded
    await act(async () => {
      await refreshEntitlement();
    });
    expect(getEntitlement().premium).toEqual([]);
    expect(getEntitlement().message).toBe(REVOKED_MESSAGE);
    expect(titles("all")).not.toContain("Lighthouse Secret Walk");
    expect(has(getSave().done, PREMIUM.id)).toBe(true); // the completed id stays in progress
    expect(screen.getByText(REVOKED_MESSAGE)).toBeInTheDocument();
    expect(screen.getByText("Premium adventure (unlock to view)")).toBeInTheDocument();
    expect(screen.queryByText(/Lighthouse/)).toBeNull();
  });

  it("when the site cannot be reached it says so, shows the free library and never claims 'locked'", async () => {
    flag();
    install(server());
    srv.s.offline = true;
    await renderUi(
      <>
        <SyncStatus />
        <Probe />
      </>,
    );
    await waitFor(() => expect(getEntitlement().status).toBe("offline"));
    expect(titles("all")).toEqual([
      "Cozy Treasure Hunt",
      "Blanket Fort Picnic",
      "Backyard Safari",
      "Neighborhood Postcard Walk",
    ]);
    expect(screen.getByText(OFFLINE_MESSAGE)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/locked/i);
    // back online: the next check recovers
    srv.s.offline = false;
    await act(async () => {
      await refreshEntitlement();
    });
    expect(getEntitlement().status).toBe("entitled");
  });

  it("a flaky refresh does not take away a library that is already loaded", async () => {
    flag();
    install(server());
    await renderUi(<Probe />);
    await waitFor(() => expect(getEntitlement().status).toBe("entitled"));
    srv.s.offline = true;
    await act(async () => {
      await refreshEntitlement();
    });
    expect(getEntitlement().premium).toHaveLength(1);
  });

  it("acceptPremium never throws on garbage", () => {
    expect(acceptPremium(null)).toEqual([]);
    expect(acceptPremium([1, null, "x", {}, PREMIUM])).toHaveLength(1);
    expect(acceptPremium([PREMIUM, PREMIUM])).toHaveLength(1);
  });
});

describe("activation and live sync", () => {
  it("after activating, premium appears, the server copy merges in immediately and the line says Saved", async () => {
    const remote: Save = { ...emptySave(), done: add(emptySave().done, "adv-aaa222", 3000) };
    install(server({ save: remote }));
    completeAdventure("adv-aaa111", 1000); // free-visitor progress from before the purchase
    await renderUi(
      <>
        <PassportRuntime />
        <SyncStatus />
        <Probe />
        <AccessForm kind="activate" />
      </>,
    );
    expect(srv.fn).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Purchase code"), { target: { value: CODE } });
    fireEvent.click(screen.getByRole("button", { name: "Activate" }));
    await waitFor(() => expect(screen.getByTestId("unlocked").textContent).toBe("true"));
    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
    expect(has(getSave().done, "adv-aaa222")).toBe(true); // came from the server
    expect(has(srv.s.save.done, "adv-aaa111")).toBe(true); // went to the server
    // the code appears only in the activation request body: never a URL, a log, storage or the page
    expect(srv.s.urls.some((u) => u.includes(CODE))).toBe(false);
    const all = JSON.stringify(consoleSpies.flatMap((s) => s.mock.calls));
    expect(all).not.toContain(CODE);
    expect(JSON.stringify({ ...window.localStorage })).not.toContain(CODE);
    expect(window.localStorage.getItem(ACCOUNT_FLAG)).toBe("1");
    expect((screen.getByLabelText("Purchase code") as HTMLInputElement).value).toBe("");
  });

  it("an edit while entitled is written after the debounce with the CSRF header, and shows Saving... then Saved", async () => {
    flag();
    install(server());
    await renderUi(
      <>
        <PassportRuntime />
        <SyncStatus />
      </>,
    );
    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
    act(() => completeAdventure("adv-aaa111", 9000));
    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(srv.s.puts).toBe(0); // debounced
    await act(async () => {
      document.dispatchEvent(Object.assign(new Event("visibilitychange"))); // visible: does not flush
    });
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange")); // tab hidden: flush now
    });
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    await waitFor(() => expect(srv.s.puts).toBe(1));
    expect(
      srv.s.lastBodies.filter(
        (b) => b.path === "/api/progress" && b.body && "baseRev" in (b.body as object),
      )[0]!.csrf,
    ).toBe("csrf-1");
    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
  });
});

describe("account panel", () => {
  it("is absent for a free visitor and makes no call", async () => {
    install(server());
    await renderUi(<AccountPanel />);
    await settle();
    expect(screen.queryByText(/Full Passport account/)).toBeNull();
    expect(srv.fn).not.toHaveBeenCalled();
  });

  it("export posts to /api/account/export with the CSRF header and downloads the file", async () => {
    flag();
    install(server());
    await renderUi(<AccountPanel />);
    fireEvent.click(await screen.findByRole("button", { name: "Download account data" }));
    await waitFor(() => expect(downloads).toHaveBeenCalled());
    const call = srv.s.lastBodies.find((b) => b.path === "/api/account/export")!;
    expect(call.csrf).toBe("csrf-1");
    expect(await screen.findByText("Account data downloaded.")).toBeInTheDocument();
  });

  it("delete asks first, sends {confirm:'DELETE'} with the CSRF header, then clears premium and sign-in but keeps device progress", async () => {
    flag();
    install(server());
    completeAdventure("adv-aaa111", 1000);
    await renderUi(
      <>
        <PassportRuntime />
        <AccountPanel />
        <Probe />
      </>,
    );
    await waitFor(() => expect(screen.getByTestId("unlocked").textContent).toBe("true"));
    fireEvent.click(screen.getByRole("button", { name: "Delete account copy" }));
    expect(srv.s.deleted).toBe(false); // needs a second, explicit click
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete the account copy" }));
    await waitFor(() => expect(srv.s.deleted).toBe(true));
    const call = srv.s.lastBodies.find((b) => b.path === "/api/account/delete")!;
    expect(call.body).toEqual({ confirm: "DELETE" });
    expect(call.csrf).toBe("csrf-1");
    await waitFor(() => expect(screen.queryByText(/Full Passport account/)).toBeNull());
    expect(getEntitlement()).toMatchObject({
      status: "free",
      premium: [],
      signedIn: false,
      csrf: "",
    });
    expect(window.localStorage.getItem(ACCOUNT_FLAG)).toBeNull();
    expect(screen.getByTestId("unlocked").textContent).toBe("false");
    expect(has(getSave().done, "adv-aaa111")).toBe(true);
    // and no further network traffic once signed out
    const n = srv.fn.mock.calls.length;
    act(() => completeAdventure("adv-aaa222", 2000));
    await settle();
    expect(srv.fn.mock.calls.length).toBe(n);
  });

  it("a failed delete says so and keeps the account", async () => {
    flag();
    install(server());
    await renderUi(<AccountPanel />);
    fireEvent.click(await screen.findByRole("button", { name: "Delete account copy" }));
    srv.s.offline = true;
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete the account copy" }));
    expect(await screen.findByText(/Couldn't delete it right now/)).toBeInTheDocument();
    expect(screen.getByText(/Full Passport account/)).toBeInTheDocument();
  });
});
