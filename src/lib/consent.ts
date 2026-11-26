// Analytics consent: Google Analytics 4 in the "basic" Google consent-mode pattern.
// Before the visitor allows analytics: no Google script is requested, nothing is sent, no _ga cookie is set, and no campaign
// tag is kept in session storage. The consent defaults are denied (pushed to dataLayer only). On "Allow analytics" the
// consent is updated to granted and the script loads. On withdrawal consent goes back to denied, sending stops, the
// _ga cookies and the campaign tag are deleted. Everything else on the site works the same either way.
// The choice is kept on this device in localStorage "pp.consent.v1" with the date. No legal claim is made here.
import { site } from "@/config/site";
import { ANALYTICS_CONSENT_MODE } from "@/config/analytics";

export const CONSENT_KEY = "pp.consent.v1";
export type ConsentChoice = "granted" | "denied";
/** unset = never chosen; the effective state also folds in GPC / Do Not Track and the consent mode. */
export type ConsentState = "granted" | "denied" | "unset";

type Stored = { v: 1; choice: ConsentChoice; at: string };

let envOverride: { prod: boolean; hostname: string } | null = null;
/** Test helper: pretend to be (or not be) the production site. */
export function _setConsentEnvForTests(v: { prod: boolean; hostname: string } | null) {
  envOverride = v;
}
let modeOverride: "opt-in" | "notice-only" | null = null;
export function _setConsentModeForTests(m: "opt-in" | "notice-only" | null) {
  modeOverride = m;
}
const mode = () => modeOverride ?? ANALYTICS_CONSENT_MODE;

function productionHosts(): Set<string> {
  const out = new Set<string>();
  try {
    const h = new URL(site.siteUrl).hostname.toLowerCase();
    out.add(h);
    out.add(h.startsWith("www.") ? h.slice(4) : `www.${h}`);
  } catch {
    /* no site URL: no host qualifies */
  }
  return out;
}

/** Analytics may exist only on the production build served from the production host. Never in dev, tests, previews. */
export function analyticsEnvironmentAllowed(): boolean {
  if (!site.ga4MeasurementId || typeof window === "undefined") return false;
  const prod = envOverride ? envOverride.prod : import.meta.env.PROD === true;
  const host = (envOverride ? envOverride.hostname : window.location.hostname).toLowerCase();
  return prod && productionHosts().has(host);
}

export function privacySignalOn(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const w = window as Window & { doNotTrack?: string };
  return (
    n.globalPrivacyControl === true ||
    n.doNotTrack === "1" ||
    n.doNotTrack === "yes" ||
    w.doNotTrack === "1" ||
    n.msDoNotTrack === "1"
  );
}

let memoryChoice: Stored | null = null; // used only when storage is blocked: holds for this page view
function readStored(): Stored | null {
  if (memoryChoice) return memoryChoice;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<Stored>;
    if (o.v !== 1 || (o.choice !== "granted" && o.choice !== "denied")) return null;
    return { v: 1, choice: o.choice, at: typeof o.at === "string" ? o.at : "" };
  } catch {
    return null;
  }
}

/** The visitor's own choice, if any. */
export function storedChoice(): { choice: ConsentChoice; at: string } | null {
  if (typeof window === "undefined") return null;
  return readStored();
}

/** What analytics may do right now. An explicit choice always wins; otherwise a privacy signal means denied. */
export function consentState(): ConsentState {
  if (typeof window === "undefined") return "denied";
  const s = readStored();
  if (s) return s.choice;
  if (privacySignalOn()) return "denied";
  return mode() === "notice-only" ? "granted" : "unset";
}
/** True only when analytics storage and sending are allowed. */
export const analyticsAllowed = (): boolean => consentState() === "granted";

// ---- subscribers (the notice and the footer control)
const listeners = new Set<() => void>();
let reopen = false;
let version = 0;
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};
export const subscribeConsent = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const consentVersion = () => version;
export const isReopened = () => reopen;
/** The footer "Analytics choices" control. */
export function openConsentChoices() {
  reopen = true;
  emit();
}

/** Whether the notice should be on screen: not chosen yet (and no privacy signal), or reopened on purpose. */
export function noticeVisible(): boolean {
  if (!analyticsEnvironmentAllowed()) return false;
  if (reopen) return true;
  if (storedChoice() || privacySignalOn()) return false;
  return true; // opt-in: asking; notice-only: telling, with a one-click opt-out
}

// ---- Google loader
type DL = unknown[];
const win = () =>
  window as unknown as { dataLayer?: DL; gtag?: (...a: unknown[]) => void } & Record<
    string,
    unknown
  >;
let scriptRequested = false;

function ensureGtag() {
  const w = win();
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as DL).push(arguments);
    };
  }
}

function pushConsent(kind: "default" | "update", granted: boolean) {
  const v = granted ? "granted" : "denied";
  // Only analytics storage is ever granted. No advertising signals are used or offered.
  win().gtag?.("consent", kind, {
    analytics_storage: v,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function loadGoogle() {
  const id = site.ga4MeasurementId;
  const w = win();
  w[`ga-disable-${id}`] = false;
  ensureGtag();
  if (scriptRequested) {
    pushConsent("update", true);
    return;
  }
  scriptRequested = true;
  pushConsent("default", false); // basic mode: denied first, before the tag can run
  pushConsent("update", true);
  w.gtag?.("js", new Date());
  w.gtag?.("config", id);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s.dataset["ppAnalytics"] = "1";
  document.head.appendChild(s);
}

function deleteGoogleCookies() {
  try {
    const names = document.cookie
      .split(";")
      .map((c) => c.split("=")[0]!.trim())
      .filter((n) => n === "_ga" || n.startsWith("_ga_") || n === "_gid" || n.startsWith("_gat"));
    const host = window.location.hostname;
    const parts = host.split(".");
    const domains = new Set<string>(["", host]);
    for (let i = 0; i < parts.length - 1; i++) domains.add("." + parts.slice(i).join("."));
    for (const n of names)
      for (const d of domains)
        document.cookie = `${n}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
  } catch {
    /* cookies blocked: nothing to delete */
  }
}

function dropCampaign() {
  try {
    window.sessionStorage.removeItem("pp_campaign");
  } catch {
    /* blocked */
  }
}

const appliers = new Set<(allowed: boolean) => void>();
/** Lets other analytics storage (campaign tags) follow the choice without importing each other. */
export const onConsentApplied = (fn: (allowed: boolean) => void) => {
  appliers.add(fn);
};

/** Applies the current state to the page. Safe to call any number of times. */
export function applyConsent() {
  if (typeof window === "undefined") return;
  appliers.forEach((f) => f(analyticsAllowed()));
  if (!analyticsEnvironmentAllowed()) return;
  if (analyticsAllowed()) {
    loadGoogle();
    return;
  }
  // Not allowed (or withdrawn): stop sending, close the gate, remove what was set.
  const w = win();
  w[`ga-disable-${site.ga4MeasurementId}`] = true;
  if (scriptRequested) {
    pushConsent("update", false);
    delete w.gtag; // our event helpers send only while window.gtag exists
  }
  deleteGoogleCookies();
  dropCampaign();
}

/** Records the visitor's choice (with today's date), then applies it. */
export function setConsent(choice: ConsentChoice, now = new Date()) {
  const rec: Stored = { v: 1, choice, at: now.toISOString().slice(0, 10) };
  memoryChoice = null;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  } catch {
    memoryChoice = rec; // blocked storage: the choice holds for this page view only
  }
  reopen = false;
  applyConsent();
  emit();
}

/** Closes the reopened notice without changing the choice. */
export function closeConsentChoices() {
  reopen = false;
  emit();
}

/** Test helper. */
export function _resetConsentForTests() {
  scriptRequested = false;
  memoryChoice = null;
  reopen = false;
  version = 0;
  listeners.clear();
  envOverride = null;
  modeOverride = null;
}
