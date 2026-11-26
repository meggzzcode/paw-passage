// Live sync for the paid Passport: pure controller logic with injected I/O, so it can be tested without a browser.
// Rules: only runs when told the visitor is entitled (a free visitor never reaches this code); the server owns `rev`
// and always merges, so a stale write loses nothing; "Saved" is shown only after the server confirmed it.
import { merge, migrate, type Save } from "./progress";

export type SyncStatus = "off" | "idle" | "saving" | "saved" | "offline" | "error";

export const SYNC_LABEL = {
  saved: "Saved",
  saving: "Saving...",
  offline: "Offline: changes pending",
  error: "Couldn't sync, will retry",
} as const;

export const DEBOUNCE_MS = 2000;
export const FOCUS_MIN_MS = 60_000;
export const MAX_ATTEMPTS = 3;

/** Plain words for the UI, or null when there is nothing honest to say (free visitor, or nothing happened yet). */
export function syncLabel(status: SyncStatus, pending: boolean): string | null {
  switch (status) {
    case "saved":
      return SYNC_LABEL.saved;
    case "saving":
      return SYNC_LABEL.saving;
    case "offline":
      return pending ? SYNC_LABEL.offline : "Offline";
    case "error":
      return SYNC_LABEL.error;
    default:
      return null;
  }
}

/** Key order does not matter: compares two saves ignoring `rev`. */
export function canon(s: Save): string {
  const walk = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object")
      return Object.fromEntries(
        Object.entries(v as Record<string, unknown>)
          .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
          .map(([k, x]) => [k, walk(x)]),
      );
    return v;
  };
  const { rev: _rev, ...rest } = s;
  void _rev;
  return JSON.stringify(walk(rest));
}

export type SyncDeps = {
  fetch: (input: string, init?: RequestInit) => Promise<Response>;
  getSave: () => Save;
  /** Merges a server Save into the local one (never replaces). Must not throw. */
  mergeRemote: (remote: Save) => void;
  getCsrf: () => string;
  /** Fetches a fresh CSRF token; returns "" when there is none. */
  refreshCsrf: () => Promise<string>;
  /** The server no longer knows this session (401). */
  onSignedOut: () => void;
  csrfHeader: string;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (h: unknown) => void;
  now?: () => number;
};

type PutResult =
  | { kind: "ok"; save: Save; rev: number }
  | { kind: "offline" }
  | { kind: "retry" } // busy: try again shortly
  | { kind: "csrf" }
  | { kind: "signedOut" }
  | { kind: "error" };

export class SyncController {
  private status: SyncStatus = "off";
  private dirty = false;
  private active = false;
  private applying = false;
  private localVersion = 0;
  private rev = 0;
  private timer: unknown = null;
  private running: Promise<void> | null = null;
  private again = false;
  private lastPullAt = 0;
  private listeners = new Set<() => void>();
  private snap: { status: SyncStatus; pending: boolean } = { status: "off", pending: false };

  constructor(private d: SyncDeps) {}

  // ---- observable state
  getSnapshot = () => this.snap;
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  private set(status: SyncStatus) {
    this.status = status;
    const pending = this.dirty;
    if (this.snap.status !== status || this.snap.pending !== pending) {
      this.snap = { status, pending };
      this.listeners.forEach((l) => l());
    }
  }
  get isActive() {
    return this.active;
  }
  get lastPull() {
    return this.lastPullAt;
  }

  private now = () => (this.d.now ?? Date.now)();
  private setTimer = (fn: () => void, ms: number) =>
    (this.d.setTimer ?? ((f, m) => setTimeout(f, m)))(fn, ms);
  private clearTimer = (h: unknown) =>
    (this.d.clearTimer ?? ((x) => clearTimeout(x as ReturnType<typeof setTimeout>)))(h);

  // ---- lifecycle

  /** Entitled: pull the server copy, merge it in, and push anything the server lacks. */
  async start(): Promise<void> {
    if (this.active) return;
    this.active = true;
    this.set("idle");
    await this.pull();
  }

  /** Not entitled any more (or signed out): stop all work and say nothing. */
  stop() {
    this.active = false;
    this.dirty = false;
    this.again = false;
    if (this.timer) this.clearTimer(this.timer);
    this.timer = null;
    this.set("off");
  }

  /** The local store changed. Sync's own merges are ignored. */
  notifyLocalChange() {
    if (!this.active || this.applying) return;
    this.localVersion++;
    this.dirty = true;
    this.set(this.status === "offline" ? "offline" : "saving");
    this.schedule();
  }

  private schedule() {
    if (this.timer) this.clearTimer(this.timer);
    this.timer = this.setTimer(() => {
      this.timer = null;
      void this.flush();
    }, DEBOUNCE_MS);
  }

  private applyRemote(remote: Save) {
    this.applying = true;
    try {
      this.d.mergeRemote(remote);
    } finally {
      this.applying = false;
    }
  }

  // ---- pull

  async pull(): Promise<void> {
    if (!this.active) return;
    if (this.running) {
      await this.running;
      return;
    }
    const run = (async () => {
      this.lastPullAt = this.now();
      let res: Response;
      try {
        res = await this.d.fetch("/api/progress", { credentials: "same-origin" });
      } catch {
        this.set("offline");
        return;
      }
      if (res.status === 401) return this.signedOut();
      if (!res.ok) return this.set("error");
      let remote: Save | null = null;
      let rev = 0;
      try {
        const b = (await res.json()) as { save?: unknown; rev?: unknown };
        remote = migrate(b.save);
        rev = typeof b.rev === "number" ? b.rev : (remote?.rev ?? 0);
      } catch {
        remote = null;
      }
      if (!remote) return this.set("error");
      this.rev = rev;
      this.applyRemote(remote);
      this.dirty = canon(this.d.getSave()) !== canon(remote);
      if (this.dirty) await this.pushLoop();
      else this.set("saved");
    })();
    this.running = run.finally(() => {
      this.running = null;
    });
    await this.running;
    if (this.again && this.active) {
      this.again = false;
      await this.flush();
    }
  }

  // ---- push

  /** Pushes pending changes now (also used for pagehide). Safe to call repeatedly. */
  async flush(opts: { keepalive?: boolean } = {}): Promise<void> {
    if (!this.active) return;
    if (this.timer) {
      this.clearTimer(this.timer);
      this.timer = null;
    }
    if (this.running) {
      this.again = true; // the run in progress will come back for anything newer
      await this.running;
      return;
    }
    if (!this.dirty) return;
    this.running = this.pushLoop(opts.keepalive).finally(() => {
      this.running = null;
    });
    await this.running;
    if (this.again && this.active) {
      this.again = false;
      await this.flush();
    }
  }

  /** Called when the connection comes back or the tab regains focus: retry anything pending, else check for news. */
  async resume(): Promise<void> {
    if (!this.active) return;
    if (this.dirty || this.status === "offline" || this.status === "error") {
      if (this.dirty) await this.flush();
      else await this.pull();
    } else if (this.now() - this.lastPullAt >= FOCUS_MIN_MS) await this.pull();
  }

  private async put(save: Save, baseRev: number, keepalive?: boolean): Promise<PutResult> {
    let res: Response;
    try {
      res = await this.d.fetch("/api/progress", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "content-type": "application/json", [this.d.csrfHeader]: this.d.getCsrf() },
        body: JSON.stringify({ save, baseRev }),
        ...(keepalive ? { keepalive: true } : {}),
      });
    } catch {
      return { kind: "offline" };
    }
    if (res.status === 401) return { kind: "signedOut" };
    if (res.status === 403) return { kind: "csrf" };
    if (res.status === 503 || res.status === 429) return { kind: "retry" };
    if (!res.ok) return { kind: "error" };
    try {
      const b = (await res.json()) as { save?: unknown; rev?: unknown };
      const server = migrate(b.save);
      if (!server) return { kind: "error" };
      return { kind: "ok", save: server, rev: typeof b.rev === "number" ? b.rev : server.rev };
    } catch {
      return { kind: "error" };
    }
  }

  private async pushLoop(keepalive?: boolean): Promise<void> {
    let csrfTried = false;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      if (!this.active) return;
      this.set("saving");
      const sentVersion = this.localVersion;
      const sent = this.d.getSave();
      const r = await this.put(sent, this.rev, keepalive);
      if (!this.active) return;
      if (r.kind === "offline") return this.set("offline"); // dirty stays true: retried on resume
      if (r.kind === "signedOut") return this.signedOut();
      if (r.kind === "error") return this.set("error");
      if (r.kind === "csrf") {
        if (csrfTried) return this.set("error");
        csrfTried = true;
        if (!(await this.d.refreshCsrf())) return this.set("error");
        attempt--; // a token refresh is not a failed attempt
        continue;
      }
      if (r.kind === "retry") continue;
      // Confirmed by the server. It has already merged our Save with whatever the other device wrote.
      this.rev = r.rev;
      this.applyRemote(r.save);
      const local = this.d.getSave();
      const changedMeanwhile = this.localVersion !== sentVersion;
      const lacking = canon(local) !== canon(r.save);
      this.dirty = changedMeanwhile || lacking;
      if (!this.dirty) return this.set("saved");
      // Newer local edits, or the server copy is not yet what we hold: go round again (bounded).
    }
    // Out of attempts: keep the pending flag so the next trigger retries.
    this.set(this.dirty ? "error" : "saved");
  }

  private signedOut() {
    this.stop();
    this.d.onSignedOut();
  }
}
