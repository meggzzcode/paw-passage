// Browser side of the paid experience: who is signed in, and the premium library.
// Privacy rules (tests enforce them): the premium library lives in memory only. It is never written to localStorage,
// sessionStorage, IndexedDB, the Cache API or a service worker, never sent to analytics and never logged. The only thing
// stored is a bare "this browser has an account" flag with no content, so a free visitor makes no network calls at all.
import { CSRF_HEADER } from "@/lib/passport-api";
import { isStandalone } from "@/lib/pwa";
import { collections, stamps } from "./content";
import { noteSessionOwner, resetOwnerConflict } from "./device-owner";
import { adventureSchema, type Adventure } from "./schema";

export type EntitlementStatus = "free" | "checking" | "entitled" | "revoked" | "offline";
export type EntitlementState = {
  status: EntitlementStatus;
  /** Validated premium adventures. Empty unless status is "entitled". */
  premium: Adventure[];
  /** True while a server session is believed to exist (entitled or revoked). */
  signedIn: boolean;
  /** The CSRF token for state-changing calls. Held in memory only. */
  csrf: string;
  /** Plain-words note for the UI, or null. */
  message: string | null;
};

export const ACCOUNT_FLAG = "pp.acct.v1";
export const REVOKED_MESSAGE =
  "Your full Passport access is no longer active, so premium adventures are hidden. Your progress is still saved and nothing was deleted.";
export const OFFLINE_MESSAGE =
  "We couldn't reach the site, so only the free adventures are showing for now. Your progress is safe.";

const FREE: EntitlementState = {
  status: "free",
  premium: [],
  signedIn: false,
  csrf: "",
  message: null,
};

let state: EntitlementState = FREE;
let started = false;
let inflight: Promise<void> | null = null;
let lastCheckAt = 0;
const listeners = new Set<() => void>();

function set(next: EntitlementState) {
  state = next;
  listeners.forEach((l) => l());
}
export const getEntitlement = (): EntitlementState => state;
export const getServerEntitlement = (): EntitlementState => FREE;
export function subscribeEntitlement(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export const lastEntitlementCheck = () => lastCheckAt;

// ------------------------------------------------------------ the flag (no content, no code)

export function hasAccountFlag(): boolean {
  try {
    return window.localStorage.getItem(ACCOUNT_FLAG) === "1";
  } catch {
    return false;
  }
}
function setAccountFlag(on: boolean) {
  try {
    if (on) window.localStorage.setItem(ACCOUNT_FLAG, "1");
    else window.localStorage.removeItem(ACCOUNT_FLAG);
  } catch {
    /* blocked storage: the flag lives only for this tab's session */
  }
}

// ------------------------------------------------------------ validation

/** Keeps only adventures that pass the schema and name known collections and stamps. Never throws. */
export function acceptPremium(raw: unknown): Adventure[] {
  if (!Array.isArray(raw)) return [];
  const colSlugs = new Set(collections.map((c) => c.slug));
  const stampSlugs = new Set(stamps.map((s) => s.slug));
  const seen = new Set<string>();
  const out: Adventure[] = [];
  for (const item of raw) {
    try {
      const r = adventureSchema.safeParse(item);
      if (!r.success) continue;
      const a = r.data;
      if (a.status !== "published" || seen.has(a.id)) continue;
      if (!a.collections.every((c) => colSlugs.has(c))) continue;
      if (!a.stamps.every((s) => stampSlugs.has(s))) continue;
      seen.add(a.id);
      out.push(a);
    } catch {
      /* a malformed item is dropped, never a crash */
    }
  }
  return out;
}

// ------------------------------------------------------------ network

type Loaded =
  | { kind: "free" } // no session
  | { kind: "offline" }
  | { kind: "revoked"; csrf: string; owner?: unknown }
  | { kind: "entitled"; csrf: string; premium: Adventure[]; owner?: unknown };

async function json(res: Response): Promise<Record<string, unknown>> {
  try {
    const v = (await res.json()) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function load(): Promise<Loaded> {
  try {
    return await loadInner();
  } catch {
    return { kind: "offline" };
  }
}

async function loadInner(): Promise<Loaded> {
  let res: Response;
  try {
    res = await fetch("/api/session", { credentials: "same-origin" });
  } catch {
    return { kind: "offline" };
  }
  if (res.status === 401) return { kind: "free" };
  if (!res.ok) return { kind: "offline" };
  const s = await json(res);
  if (s["authenticated"] !== true) return { kind: "free" };
  const csrf = typeof s["csrf"] === "string" ? s["csrf"] : "";
  const owner = s["owner"];
  if (s["entitled"] !== true) return { kind: "revoked", csrf, owner };
  try {
    const p = await fetch("/api/premium/adventures", { credentials: "same-origin" });
    if (p.status === 403) return { kind: "revoked", csrf, owner };
    if (p.status === 401) return { kind: "free" };
    if (!p.ok) return { kind: "offline" };
    const body = await json(p);
    return { kind: "entitled", csrf, premium: acceptPremium(body["adventures"]), owner };
  } catch {
    return { kind: "offline" };
  }
}

/**
 * Asks the server who this browser is and loads the premium library into memory. Runs only when this browser has
 * been activated before (or `force` after a successful activation); a free visitor never reaches the network.
 */
export function refreshEntitlement(opts: { force?: boolean; probe?: boolean } = {}): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (opts.force) setAccountFlag(true);
  // `probe`: an installed home-screen app may start with a copied session cookie but no localStorage flag (iOS copies
  // cookies, not other storage). The installed app asks the server once; a 401 simply leaves it free.
  else if (!hasAccountFlag() && !state.signedIn && !opts.probe) return Promise.resolve();
  if (inflight) return inflight;
  if (state.status === "free" || state.status === "offline")
    set({ ...state, status: "checking", message: null });
  inflight = load()
    .then((r) => {
      lastCheckAt = Date.now();
      if (r.kind === "free") {
        setAccountFlag(false);
        set(FREE);
      } else if (r.kind === "revoked") {
        noteSessionOwner(r.owner);
        set({
          status: "revoked",
          premium: [],
          signedIn: true,
          csrf: r.csrf,
          message: REVOKED_MESSAGE,
        });
      } else if (r.kind === "entitled") {
        noteSessionOwner(r.owner); // a different customer than the one this device's local records belong to pauses sync
        set({
          status: "entitled",
          premium: r.premium,
          signedIn: true,
          csrf: r.csrf,
          message: null,
        });
      } else if (
        state.status === "entitled" ||
        (state.status === "checking" && state.premium.length > 0)
      ) {
        // A flaky refresh must not take away a library that is already loaded; sync reports the connection problem.
        set({ ...state, status: "entitled" });
      } else {
        set({
          status: "offline",
          premium: [],
          signedIn: false,
          csrf: "",
          message: OFFLINE_MESSAGE,
        });
      }
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Called once per page load by the app shell. */
export function startEntitlement(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  void refreshEntitlement({ probe: isStandalone() });
}

/** After a successful activate or restore: remember this browser has an account and load everything now. */
export function entitlementGranted(csrf?: string): Promise<void> {
  if (csrf) state = { ...state, csrf };
  return refreshEntitlement({ force: true });
}

/** The session ended (401) or the account copy was deleted: forget premium and the flag. Local progress is untouched. */
export function clearEntitlement(): void {
  setAccountFlag(false);
  resetOwnerConflict();
  set(FREE);
}

/** The server said the session's CSRF token is stale: fetch a fresh one. */
export async function refreshCsrf(): Promise<string> {
  try {
    const res = await fetch("/api/session", { credentials: "same-origin" });
    if (!res.ok) return "";
    const b = await json(res);
    const csrf = typeof b["csrf"] === "string" ? b["csrf"] : "";
    if (csrf) state = { ...state, csrf };
    return csrf;
  } catch {
    return "";
  }
}

export { CSRF_HEADER };

/** Test helper. */
export function _resetEntitlementForTests() {
  state = FREE;
  started = false;
  inflight = null;
  lastCheckAt = 0;
  listeners.clear();
}
