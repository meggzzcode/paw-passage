// Feature detection for notifications. Pure reads: nothing here asks for permission or touches the network.
export type PushSupport = "supported" | "ios-needs-install" | "unsupported";
export type PermissionState = "default" | "granted" | "denied" | "unsupported";

function isIos(win: Window): boolean {
  const nav = win.navigator;
  if (/iPad|iPhone|iPod/.test(nav.userAgent)) return true;
  // iPadOS reports itself as a Mac with a touch screen.
  return nav.platform === "MacIntel" && (nav.maxTouchPoints ?? 0) > 1;
}

export function isStandaloneDisplay(win: Window = window): boolean {
  try {
    if (win.matchMedia?.("(display-mode: standalone)").matches) return true;
  } catch {
    /* ignore */
  }
  return (win.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Whether this browser can do Web Push. On iOS it only can from the home screen app, so that case is reported apart. */
export function detectPushSupport(win: Window | undefined = globalThis.window): PushSupport {
  if (!win) return "unsupported";
  if (isIos(win) && !isStandaloneDisplay(win)) return "ios-needs-install";
  const ok =
    "serviceWorker" in win.navigator &&
    "PushManager" in win &&
    typeof (win as Window & { Notification?: typeof Notification }).Notification
      ?.requestPermission === "function";
  return ok ? "supported" : "unsupported";
}

export function permissionState(win: Window | undefined = globalThis.window): PermissionState {
  const N = (win as (Window & { Notification?: typeof Notification }) | undefined)?.Notification;
  if (!N) return "unsupported";
  const p = N.permission;
  return p === "granted" || p === "denied" ? p : "default";
}
