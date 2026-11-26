// Progressive Web App helpers: standalone detection, install prompt capture, platform detection, dismissal memory and
// service worker registration. Everything here is optional and client-only. The website works the same without it, and
// nothing in this file asks for a permission. No dependencies; storage access is always wrapped in try/catch.
import { track, type EventName } from "@/passport/events";

/**
 * LAUNCH GATE (`pwaInstallPrompts`). While false, no proactive install prompt or install card renders anywhere, and no
 * customer-facing page advertises installing or offline use. The /install guide stays reachable by URL (noindex).
 * Flip to true only after the "Install prompts stay hidden until these pass" rule in docs/PWA-DEVICE-TEST.md is met
 * on real devices. Q2 may later mirror this in commercial config; this constant is the one the components read.
 */
export const PWA_PROMPTS_ENABLED = false;

export const INSTALL_DISMISS_KEY = "pp.install.dismissedAt";
export const INSTALL_DETECTED_KEY = "pp.install.detected";
export const INSTALL_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;
export const INSTALL_GUIDE_PATH = "/install";

export type Platform = "ios-safari" | "ios-other" | "android-chrome" | "desktop-chromium" | "other";

/** The install guide events from the V5 contract. The allow-list in events.ts may not list them yet, so this never throws. */
export function trackPwa(
  name: string,
  params: Record<string, string | number | boolean> = {},
): void {
  try {
    track(name as EventName, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** True when the page runs as an installed app (home-screen icon), not in a browser tab. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
    if (window.matchMedia?.("(display-mode: fullscreen)").matches) return true;
    if ((window.navigator as Navigator & { standalone?: boolean }).standalone === true) return true;
  } catch {
    /* fall through */
  }
  return false;
}

/** Pure, so it can be tested with sample user agents. iPadOS 13+ reports as a Mac with touch points. */
export function detectPlatform(ua: string, maxTouchPoints = 0): Platform {
  const isIpadOs = /Macintosh/.test(ua) && maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || isIpadOs) {
    // Chrome, Firefox, Edge, Opera, DuckDuckGo, Brave on iOS identify with these tokens.
    return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|Brave|GSA\//.test(ua) ? "ios-other" : "ios-safari";
  }
  if (/Android/.test(ua))
    return /Chrome\//.test(ua) && !/SamsungBrowser|OPR\/|Firefox/.test(ua)
      ? "android-chrome"
      : "other";
  if (/Chrome\/|Chromium\/|Edg\//.test(ua) && !/OPR\/|Firefox/.test(ua)) return "desktop-chromium";
  return "other";
}

export function currentPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  return detectPlatform(navigator.userAgent || "", navigator.maxTouchPoints || 0);
}

/** iOS can only add a site to the Home Screen from Safari's Share menu. Other iOS browsers vary by version. */
export function installNeedsManualSteps(p: Platform): boolean {
  return p === "ios-safari" || p === "ios-other";
}

// ---- Dismissal memory ----------------------------------------------------------------------------------------------

export function getDismissedAt(): number | null {
  try {
    const v = Number(window.localStorage.getItem(INSTALL_DISMISS_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

export function dismissInstallPrompt(now = Date.now()): void {
  try {
    window.localStorage.setItem(INSTALL_DISMISS_KEY, String(now));
  } catch {
    /* a blocked store only means the prompt may come back after a reload */
  }
}

export function isInInstallCooldown(now = Date.now()): boolean {
  const at = getDismissedAt();
  return at !== null && now - at < INSTALL_COOLDOWN_MS;
}

/** The contextual prompt is shown only outside the installed app and outside the 90 day cooldown. */
export function shouldShowInstallPrompt(now = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  return !isStandalone() && !isInInstallCooldown(now);
}

// ---- beforeinstallprompt -------------------------------------------------------------------------------------------

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let captureStarted = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeInstallState(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** True when the browser offered a native install dialog (Chromium on Android and desktop). */
export function canPromptNatively(): boolean {
  return deferred !== null;
}

/** Starts listening once. Safe to call many times. */
export function startInstallCapture(): void {
  if (typeof window === "undefined" || captureStarted) return;
  captureStarted = true;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // hold it until the customer chooses Install; we never open it on our own
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    markInstallDetected("appinstalled");
    notify();
  });
  if (isStandalone()) markInstallDetected("standalone");
}

/** Counted once per browser, with no identifiers. */
function markInstallDetected(how: string): void {
  try {
    if (window.localStorage.getItem(INSTALL_DETECTED_KEY)) return;
    window.localStorage.setItem(INSTALL_DETECTED_KEY, "1");
  } catch {
    /* count it anyway */
  }
  trackPwa("install_detected", { how });
}

/** Opens the native dialog. Returns the outcome, or null when no native prompt is available. */
export async function promptInstall(): Promise<"accepted" | "dismissed" | null> {
  const ev = deferred;
  if (!ev) return null;
  deferred = null; // a captured event can be used once
  notify();
  try {
    await ev.prompt();
    const choice = await ev.userChoice;
    if (choice.outcome === "dismissed") dismissInstallPrompt();
    return choice.outcome;
  } catch {
    return null;
  }
}

// ---- Service worker ------------------------------------------------------------------------------------------------

export const SW_URL = "/sw.js";

/**
 * Registers the worker after the page has loaded. A new version waits instead of taking over mid-visit: `onUpdate`
 * receives a function that activates it and reloads once (used by the small "refresh" toast). Otherwise it activates by
 * itself on the next full visit, after all tabs are closed.
 */
export function registerServiceWorker(onUpdate?: (activate: () => void) => void): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return; // a cached dev page is confusing; the worker is for the built site
  const run = () => {
    navigator.serviceWorker
      .register(SW_URL, { scope: "/" })
      .then((reg) => {
        const offer = (worker: ServiceWorker) => {
          onUpdate?.(() => {
            let reloaded = false;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
              if (reloaded) return;
              reloaded = true;
              window.location.reload();
            });
            worker.postMessage({ type: "SKIP_WAITING" });
          });
        };
        // Only a replacement of a running worker is an "update"; the first install is silent.
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const w = reg.installing;
          w?.addEventListener("statechange", () => {
            if (w.state === "installed" && navigator.serviceWorker.controller) offer(w);
          });
        });
      })
      .catch(() => {
        /* no worker, no problem: the site works the same */
      });
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

export function _resetPwaForTests(): void {
  deferred = null;
  captureStarted = false;
  listeners.clear();
}
