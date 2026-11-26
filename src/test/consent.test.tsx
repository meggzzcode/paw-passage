import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConsentNotice, AnalyticsChoicesButton } from "@/components/site/ConsentNotice";
import {
  CONSENT_KEY,
  _resetConsentForTests,
  _setConsentEnvForTests,
  _setConsentModeForTests,
  analyticsAllowed,
  applyConsent,
  consentState,
  setConsent,
} from "@/lib/consent";
import { track } from "@/passport/events";
import { trackTool } from "@/lib/analytics";
import { captureCampaign, campaignFields } from "@/lib/campaign";
import { site } from "@/config/site";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...r }: { children: React.ReactNode; to: string }) => (
    <a href={to} {...r}>
      {children}
    </a>
  ),
}));

const PROD = { prod: true, hostname: new URL(site.siteUrl).hostname };
const w = window as unknown as Record<string, unknown>;
let appended: HTMLScriptElement[];
let fetchSpy: ReturnType<typeof vi.fn>;

function clearCookies() {
  for (const c of document.cookie.split(";")) {
    const n = c.split("=")[0]!.trim();
    if (n) document.cookie = `${n}=; Max-Age=0; Path=/`;
  }
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  clearCookies();
  _resetConsentForTests();
  _setConsentEnvForTests(PROD);
  delete w["gtag"];
  delete w["dataLayer"];
  appended = [];
  const orig = document.head.appendChild.bind(document.head);
  vi.spyOn(document.head, "appendChild").mockImplementation(((n: Node) => {
    if (n instanceof HTMLScriptElement) {
      appended.push(n);
      return n; // never really fetch Google in a test
    }
    return orig(n);
  }) as never);
  fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);
  Object.defineProperty(navigator, "doNotTrack", { value: null, configurable: true });
  Object.defineProperty(navigator, "globalPrivacyControl", {
    value: undefined,
    configurable: true,
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const googleScripts = () => appended.filter((s) => s.src.includes("googletagmanager"));
const ga4 = () => ({ ok: site.ga4MeasurementId.length > 0 });

describe("analytics consent (default opt-in)", () => {
  it("the site has a measurement ID configured (otherwise the rest proves nothing)", () => {
    expect(ga4().ok).toBe(true);
  });

  it("requests no Google script, defines no gtag and sets no cookie before the visitor chooses", async () => {
    render(<ConsentNotice />);
    await act(async () => undefined);
    expect(googleScripts()).toEqual([]);
    expect(w["gtag"]).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(document.cookie).not.toMatch(/_ga/);
    expect(consentState()).toBe("unset");
    // both choices are visible, equal, and the page is not blocked
    expect(screen.getByRole("button", { name: "Essential only" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Allow analytics" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("link", { name: /What we store and why/ })).toHaveAttribute(
      "href",
      "/privacy",
    );
    // events are no-ops
    expect(track("intro_started")).toBe(false);
    expect(trackTool("tool_start", { tool: "x" })).toBe(false);
  });

  it("keeps campaign tags out of storage until analytics is allowed, then stores them", () => {
    captureCampaign("?utm_source=pinterest&utm_campaign=rain");
    expect(window.sessionStorage.getItem("pp_campaign")).toBeNull();
    expect(campaignFields()).toEqual({});
    setConsent("granted");
    expect(window.sessionStorage.getItem("pp_campaign")).not.toBeNull();
    expect(campaignFields()).toEqual({ utm_source: "pinterest", utm_campaign: "rain" });
  });

  it("Allow analytics: stores the choice with a date, denies by default then grants, and loads Google once", async () => {
    render(<ConsentNotice />);
    fireEvent.click(screen.getByRole("button", { name: "Allow analytics" }));
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_KEY)!);
    expect(saved).toMatchObject({ v: 1, choice: "granted" });
    expect(saved.at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(googleScripts()).toHaveLength(1);
    expect(googleScripts()[0]!.src).toContain(`id=${site.ga4MeasurementId}`);
    const dl = (w["dataLayer"] as unknown[][]).map((a) => Array.from(a as ArrayLike<unknown>));
    const consent = dl.filter((a) => a[0] === "consent");
    expect(consent[0]).toMatchObject([
      "consent",
      "default",
      { analytics_storage: "denied", ad_storage: "denied" },
    ]);
    expect(consent[1]).toMatchObject([
      "consent",
      "update",
      { analytics_storage: "granted", ad_storage: "denied" },
    ]);
    expect(screen.queryByTestId("consent-notice")).toBeNull();
    // events now flow, and only now
    const calls: unknown[][] = [];
    const real = w["gtag"] as (...a: unknown[]) => void;
    w["gtag"] = (...a: unknown[]) => void calls.push(a);
    expect(track("intro_started")).toBe(true);
    expect(calls.length).toBe(1);
    w["gtag"] = real;
    setConsent("granted"); // idempotent: no second script
    expect(googleScripts()).toHaveLength(1);
  });

  it("Essential only persists, loads nothing and the notice stays away on the next visit", () => {
    const { unmount } = render(<ConsentNotice />);
    fireEvent.click(screen.getByRole("button", { name: "Essential only" }));
    expect(JSON.parse(window.localStorage.getItem(CONSENT_KEY)!).choice).toBe("denied");
    expect(googleScripts()).toEqual([]);
    unmount();
    _resetConsentForTests();
    _setConsentEnvForTests(PROD);
    render(<ConsentNotice />);
    expect(screen.queryByTestId("consent-notice")).toBeNull();
    applyConsent();
    expect(googleScripts()).toEqual([]);
  });

  it("the footer control reopens the notice, and withdrawing stops sending and deletes _ga cookies and campaign tags", async () => {
    setConsent("granted");
    document.cookie = "_ga=GA1.1.1; Path=/";
    document.cookie = "_ga_ABC=GS1; Path=/";
    document.cookie = "pp_other=keep; Path=/";
    window.sessionStorage.setItem("pp_campaign", '{"utm_source":"x"}');
    render(
      <>
        <AnalyticsChoicesButton />
        <ConsentNotice />
      </>,
    );
    expect(screen.queryByTestId("consent-notice")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Analytics choices" }));
    expect(screen.getByTestId("consent-notice").textContent).toMatch(/currently allowed/);
    fireEvent.click(screen.getByRole("button", { name: "Essential only" }));
    expect(analyticsAllowed()).toBe(false);
    expect(w["gtag"]).toBeUndefined();
    expect(track("intro_started")).toBe(false);
    expect(document.cookie).not.toMatch(/_ga/);
    expect(document.cookie).toMatch(/pp_other=keep/);
    expect(window.sessionStorage.getItem("pp_campaign")).toBeNull();
    const dl = (w["dataLayer"] as unknown[][]).map((a) => Array.from(a as ArrayLike<unknown>));
    expect(dl.filter((a) => a[0] === "consent" && a[1] === "update").at(-1)).toMatchObject([
      "consent",
      "update",
      { analytics_storage: "denied" },
    ]);
    expect(googleScripts()).toHaveLength(1); // the one loaded earlier; nothing new after withdrawal
  });

  it("Global Privacy Control and Do Not Track count as declined and show no notice", () => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    render(<ConsentNotice />);
    expect(consentState()).toBe("denied");
    expect(screen.queryByTestId("consent-notice")).toBeNull();
    expect(googleScripts()).toEqual([]);
    // an explicit choice still wins
    setConsent("granted");
    expect(consentState()).toBe("granted");
    cleanup();
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: undefined,
      configurable: true,
    });
    window.localStorage.clear();
    Object.defineProperty(navigator, "doNotTrack", { value: "1", configurable: true });
    expect(consentState()).toBe("denied");
  });

  it("notice-only mode allows analytics until opted out; GPC still denies", () => {
    _setConsentModeForTests("notice-only");
    expect(consentState()).toBe("granted");
    applyConsent();
    expect(googleScripts()).toHaveLength(1);
    setConsent("denied");
    expect(consentState()).toBe("denied");
    expect(w["gtag"]).toBeUndefined();
  });

  it("never loads anything in dev, tests, previews or on another host, even after Allow", () => {
    for (const env of [
      { prod: false, hostname: PROD.hostname },
      { prod: true, hostname: "deploy-preview-12--paws.netlify.app" },
      { prod: true, hostname: "id-preview--abc.lovable.app" },
      { prod: true, hostname: "localhost" },
    ]) {
      _resetConsentForTests();
      _setConsentEnvForTests(env);
      window.localStorage.clear();
      setConsent("granted");
      applyConsent();
      expect(googleScripts(), JSON.stringify(env)).toEqual([]);
      expect(w["gtag"]).toBeUndefined();
      const { unmount } = render(<ConsentNotice />);
      expect(screen.queryByTestId("consent-notice")).toBeNull(); // nothing to consent to
      unmount();
    }
  });
});
