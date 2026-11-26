// Runs live sync for an entitled visitor and exposes its state. One controller per page; free visitors never start it.
import { useEffect, useSyncExternalStore } from "react";
import { getSave, mergeRemote, subscribe as subscribeLocal } from "./local-store";
import {
  clearEntitlement,
  getEntitlement,
  refreshCsrf,
  refreshEntitlement,
  lastEntitlementCheck,
} from "./premium-client";
import { useEntitlement } from "./useEntitlement";
import { CSRF_HEADER } from "@/lib/passport-api";
import { FOCUS_MIN_MS, SyncController, syncLabel, type SyncStatus } from "./sync";

let controller: SyncController | null = null;

export function getSyncController(): SyncController {
  if (!controller)
    controller = new SyncController({
      fetch: (input, init) => fetch(input, init),
      getSave,
      mergeRemote,
      getCsrf: () => getEntitlement().csrf,
      refreshCsrf,
      onSignedOut: () => clearEntitlement(),
      csrfHeader: CSRF_HEADER,
    });
  return controller;
}

const OFF = { status: "off" as SyncStatus, pending: false };

export function useSyncState(): { status: SyncStatus; label: string | null } {
  const c = getSyncController();
  const snap = useSyncExternalStore(c.subscribe, c.getSnapshot, () => OFF);
  return { status: snap.status, label: syncLabel(snap.status, snap.pending) };
}

/**
 * Mount once in the app shell. Starts sync only while entitled; wires local changes, tab hide, connection and focus.
 * Focus refresh happens at most once a minute and there is no polling.
 */
export function useSync(): void {
  const { status } = useEntitlement();
  const entitled = status === "entitled";
  useEffect(() => {
    if (!entitled) {
      controller?.stop();
      return;
    }
    const c = getSyncController();
    void c.start();
    const unsub = subscribeLocal(() => c.notifyLocalChange());
    const hide = () => {
      if (document.visibilityState === "hidden") void c.flush({ keepalive: true });
    };
    const pagehide = () => void c.flush({ keepalive: true });
    const wake = () => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - lastEntitlementCheck() >= FOCUS_MIN_MS) void refreshEntitlement();
      void c.resume();
    };
    const online = () => void c.resume();
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("online", online);
    return () => {
      unsub();
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("online", online);
    };
  }, [entitled]);
}

/** Mounted once in the root layout. Renders nothing. */
export function PassportRuntime() {
  useSync();
  return null;
}

/** Test helper: drop the shared controller so the next test starts clean. */
export function _resetSyncForTests() {
  controller?.stop();
  controller = null;
}
