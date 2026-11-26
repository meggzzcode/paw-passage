// Runs live sync for an entitled visitor and exposes its state. One controller per page; free visitors never start it.
import { useEffect, useSyncExternalStore } from "react";
import { ownerConflictState, subscribeOwner } from "./device-owner";
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
import { planSyncBusy, subscribePlans, syncPlans } from "@/lib/plans";
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
  // A different customer than the one this device's records belong to: nothing is uploaded or merged until they choose.
  const conflict = useSyncExternalStore(subscribeOwner, ownerConflictState, () => "none" as const);
  const entitled = status === "entitled" && conflict === "none";
  useEffect(() => {
    if (!entitled) {
      controller?.stop();
      return;
    }
    const c = getSyncController();
    // Progress first (pull, merge, then push), then scheduled adventures the same way. Plans sync for every entitled
    // customer, with or without reminders.
    void c.start().then(() => syncPlans());
    const unsub = subscribeLocal(() => c.notifyLocalChange());
    let planTimer: ReturnType<typeof setTimeout> | null = null;
    const unsubPlans = subscribePlans(() => {
      if (planSyncBusy()) return; // our own merge, not an edit
      if (planTimer) clearTimeout(planTimer);
      planTimer = setTimeout(() => void syncPlans(), 1500);
    });
    const hide = () => {
      if (document.visibilityState === "hidden") void c.flush({ keepalive: true });
    };
    const pagehide = () => void c.flush({ keepalive: true });
    const wake = () => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - lastEntitlementCheck() >= FOCUS_MIN_MS) void refreshEntitlement();
      void c.resume().then(() => syncPlans());
    };
    const online = () => void c.resume().then(() => syncPlans());
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("online", online);
    return () => {
      unsub();
      unsubPlans();
      if (planTimer) clearTimeout(planTimer);
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("online", online);
    };
  }, [entitled]);
}

export function useOwnerConflict(): "none" | "ask" | "kept" {
  return useSyncExternalStore(subscribeOwner, ownerConflictState, () => "none" as const);
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

/** Stops live sync at once (sign-out, clear-device) without waiting for the next render. */
export function stopSync() {
  controller?.stop();
}
