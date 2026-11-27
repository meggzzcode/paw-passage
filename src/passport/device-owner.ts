// Shared-device privacy. Who on this device did the local progress last sync with?
//
// The server hands the browser an opaque one-way tag for the signed-in customer. The browser keeps it next to the local
// save ("pp.owner.v1"). When a DIFFERENT customer signs in on the same device, the earlier customer's local records are
// never uploaded or merged into the new account: sync stays paused until the person chooses. A returning same customer
// syncs as usual. Local data that was never tied to a customer (a free visitor's progress) still merges on first sign-in,
// which is the documented free-to-paid path.
//
// Limits: the tag is not a secret and not a login; it is stored in plain text on the device. Someone with the device
// unlocked can read the local save whatever this module does: "Sign out and clear this device" is the way to remove it.
import { clearLocal } from "./local-store";
import { clearPlansLocal } from "@/lib/plans";
import { disableOnThisDevice, getLocalDeviceId } from "@/lib/notifications";

export const OWNER_KEY = "pp.owner.v1";
const ACCOUNT_FLAG_KEY = "pp.acct.v1"; // same key as premium-client ACCOUNT_FLAG (that module imports this one)

/**
 * CUSTOMER-SPECIFIC data on this device: removed by "Sign out and clear this device" and by "start fresh".
 * Anything not listed here is an anonymous preference and stays (hemisphere choice, install-hint dismissal, analytics choice).
 */
export const CUSTOMER_LOCAL_KEYS = [
  "pp.save.v1", // dog profile and names, owner preferences, favorites, saved, completed, memories, collections, free starter
  "pp.plans.v1", // planned adventures and reminders
  "pp.revealed.v1", // which adventures were revealed (personal progress)
  "pp.packing.v1", // packing checklists (legacy format)
  "pp.packing.v2", // packing checklists: trip details, custom items
  "pp.packing.v2.corrupt", // a backup copy of a damaged packing list
  "pp.push.device", // id of this browser's push subscription record
  "pp.acct.v1", // "this browser has an account" flag
  OWNER_KEY,
] as const;
export const CUSTOMER_SESSION_KEYS = ["pp.intro.offered"] as const;

export const ANONYMOUS_PREFERENCE_KEYS = [
  "pp.hemisphere.v1",
  "pp.install.dismissedAt",
  "pp.install.detected",
  "pp.consent.v1",
] as const;

// ---- the tag
export function getDeviceOwner(): string | null {
  try {
    const v = window.localStorage.getItem(OWNER_KEY);
    return v && /^[a-f0-9]{8,64}$/.test(v) ? v : null;
  } catch {
    return null;
  }
}
function setDeviceOwner(tag: string | null) {
  try {
    if (tag) window.localStorage.setItem(OWNER_KEY, tag);
    else window.localStorage.removeItem(OWNER_KEY);
  } catch {
    /* blocked storage: no tag, so the next sign-in treats local data as anonymous */
  }
}

// ---- the conflict (a different customer signed in)
let conflict: { next: string; kept: boolean } | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
export const hasOwnerConflict = (): boolean => conflict !== null;
/** "ask": show the choice; "kept": the earlier records stay local-only and sync is paused; "none": no conflict. */
export const ownerConflictState = (): "none" | "ask" | "kept" =>
  conflict ? (conflict.kept ? "kept" : "ask") : "none";
export function subscribeOwner(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Called with the tag the server reports for the signed-in customer. "claimed": local data had no owner and now belongs
 * to this customer. "same": returning customer. "conflict": the local data belongs to someone else: do NOT merge or sync.
 */
export function noteSessionOwner(tag: unknown): "none" | "claimed" | "same" | "conflict" {
  if (typeof tag !== "string" || !/^[a-f0-9]{8,64}$/.test(tag)) return "none"; // an older server: behave as before
  const mine = getDeviceOwner();
  if (!mine) {
    setDeviceOwner(tag);
    if (conflict) {
      conflict = null;
      emit();
    }
    return "claimed";
  }
  if (mine === tag) {
    if (conflict) {
      conflict = null;
      emit();
    }
    return "same";
  }
  if (conflict?.next !== tag) {
    conflict = { next: tag, kept: false };
    emit();
  }
  return "conflict";
}

/** True when the browser holds local records that belong to a customer other than `tag` (so they must not be sent). */
export const localBelongsToOther = (): boolean => getDeviceOwner() !== null;

/** Removes every customer-specific record from this device (memory and storage). Anonymous preferences stay. */
export function wipeCustomerData(): void {
  clearLocal(); // removes pp.save.v1 and resets the in-memory save
  clearPlansLocal();
  try {
    for (const k of CUSTOMER_LOCAL_KEYS) window.localStorage.removeItem(k);
  } catch {
    /* blocked storage */
  }
  try {
    for (const k of CUSTOMER_SESSION_KEYS) window.sessionStorage.removeItem(k);
  } catch {
    /* blocked storage */
  }
}

/** "Start fresh on this device": the previous customer's local records are removed, the new customer's sync pulls theirs. */
export function startFreshForNewCustomer(): void {
  const next = conflict?.next ?? null;
  // The new customer is signed in right now: the "this browser has an account" flag belongs to THEM, so it survives the wipe
  // (otherwise the next page load would treat the browser as free until they activate again).
  let hadAccount: string | null = null;
  try {
    hadAccount = window.localStorage.getItem(ACCOUNT_FLAG_KEY);
  } catch {
    /* blocked storage */
  }
  wipeCustomerData();
  setDeviceOwner(next);
  try {
    if (hadAccount) window.localStorage.setItem(ACCOUNT_FLAG_KEY, hadAccount);
  } catch {
    /* blocked storage */
  }
  if (conflict) {
    conflict = null;
    emit();
  }
}

/** "Keep it on this device only": the earlier records stay here and are never uploaded. Sync stays paused. */
export function keepPreviousLocalOnly(): void {
  if (!conflict || conflict.kept) return;
  conflict = { ...conflict, kept: true }; // nothing changes on disk; sync stays paused; "start fresh" stays available
  emit();
}

/** Step 1 of "Sign out and clear this device", while the session still exists: remove this browser's push subscription. */
export async function removePushOnThisDevice(): Promise<void> {
  try {
    await disableOnThisDevice(getLocalDeviceId()); // unsubscribes this browser; tells the server when there is a device id
  } catch {
    /* the browser may have no push support */
  }
}

/**
 * Last step of "Sign out and clear this device": every customer-specific record goes (storage and memory), plus any copy
 * of the protected library in the Cache API (the app never writes one; this also removes a stray one from an older worker).
 * The caller signs out of the server and calls clearEntitlement first.
 */
export async function clearThisDevice(): Promise<void> {
  wipeCustomerData();
  conflict = null;
  emit();
  try {
    if (typeof caches !== "undefined") {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("pp-")).map((k) => caches.delete(k)));
    }
  } catch {
    /* no Cache API */
  }
}

/** The session ended: a pending choice about a previous customer's records no longer applies. */
export function resetOwnerConflict() {
  if (!conflict) return;
  conflict = null;
  emit();
}

/** Test helper. */
export function _resetOwnerForTests() {
  conflict = null;
  listeners.clear();
}
