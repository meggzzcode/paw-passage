// Client wrapper for the Passport HTTP API (/api/*). Plain fetch, same-origin, cookies only.
// Privacy rules: the purchase code is sent in the request body and nowhere else. It is never put in a URL, a log line,
// an analytics event or browser storage. State-changing calls after sign-in send the CSRF token the server issued.

/** Same value as the server's CSRF_HEADER; duplicated so no server module is bundled into the browser. */
export const CSRF_HEADER = "x-pp-csrf";

export type AccessKind = "activate" | "restore";
export type AccessFailure =
  | "invalid_format" // does not look like a code (checked before sending)
  | "invalid_code" // the seller does not recognise it
  | "refunded"
  | "disputed"
  | "revoked"
  | "unavailable" // the checkout provider could not be reached: try again later
  | "rate_limited"
  | "misconfigured" // access is not set up on this site yet
  | "network" // this device could not reach the site
  | "error";
export type AccessResult =
  | { ok: true; reason: "activated" | "restored" | "already_active"; save: unknown; csrf: string }
  | { ok: false; reason: AccessFailure };

const CODE_RE = /^[A-Za-z0-9_-]{8,100}$/;
export const looksLikeCode = (code: string): boolean => CODE_RE.test(code.trim());

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const v = (await res.json()) as unknown;
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function failureFor(status: number, body: Record<string, unknown>): AccessFailure {
  const reason = typeof body["reason"] === "string" ? body["reason"] : "";
  const error = typeof body["error"] === "string" ? body["error"] : "";
  if (status === 429) return "rate_limited";
  if (status === 503 && error === "server_misconfigured") return "misconfigured";
  if (status === 503 || reason === "provider_unavailable") return "unavailable";
  if (error === "invalid_code_format") return "invalid_format";
  if (reason === "refunded" || reason === "disputed" || reason === "revoked") return reason;
  if (reason === "invalid_code" || status === 403) return "invalid_code";
  return "error";
}

/** Checks a purchase code. `localSave` (the browser's own progress) is offered so nothing is lost on first activation. */
export async function submitAccessCode(
  kind: AccessKind,
  code: string,
  localSave?: unknown,
): Promise<AccessResult> {
  const clean = code.trim();
  if (!CODE_RE.test(clean)) return { ok: false, reason: "invalid_format" };
  const send = async (withSave: boolean) =>
    fetch(`/api/access/${kind}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(withSave && localSave ? { code: clean, localSave } : { code: clean }),
    });
  try {
    let res = await send(true);
    let body = await readJson(res);
    if (!res.ok && body["error"] === "bad_local_save") {
      res = await send(false); // never block access because the local copy was rejected
      body = await readJson(res);
    }
    if (res.ok && body["ok"] === true) {
      const reason = body["reason"];
      return {
        ok: true,
        reason: reason === "restored" || reason === "already_active" ? reason : "activated",
        save: body["save"],
        csrf: typeof body["csrf"] === "string" ? body["csrf"] : "",
      };
    }
    return { ok: false, reason: failureFor(res.status, body) };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export type SessionInfo =
  { signedIn: false } | { signedIn: true; entitled: boolean; status: string; csrf: string };

/** Who the cookie says we are. Any failure reads as "not signed in": the free passport never needs this. */
export async function getSessionInfo(): Promise<SessionInfo> {
  try {
    const res = await fetch("/api/session", { credentials: "same-origin" });
    if (!res.ok) return { signedIn: false };
    const b = await readJson(res);
    if (b["authenticated"] !== true) return { signedIn: false };
    return {
      signedIn: true,
      entitled: b["entitled"] === true,
      status: typeof b["status"] === "string" ? b["status"] : "unknown",
      csrf: typeof b["csrf"] === "string" ? b["csrf"] : "",
    };
  } catch {
    return { signedIn: false };
  }
}

const post = (path: string, csrf: string, body: unknown) =>
  fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", [CSRF_HEADER]: csrf },
    body: JSON.stringify(body),
  });

/** The server copy of the progress, as text for a download. Returns null on any failure. */
export async function exportAccount(csrf: string): Promise<string | null> {
  try {
    const res = await post("/api/account/export", csrf, {});
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/** Deletes the server copy and signs out. The local copy is separate and is not touched here. */
export async function deleteAccount(csrf: string): Promise<boolean> {
  try {
    const res = await post("/api/account/delete", csrf, { confirm: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Asks the server to clear this device's session cookie. Stateless cookies mean this does not sign other devices out.
 * Returns true when the server confirmed; callers sign out locally either way.
 */
export async function signOutRequest(csrf: string): Promise<boolean> {
  try {
    const res = await post("/api/session/signout", csrf, {});
    return res.ok;
  } catch {
    return false;
  }
}

/** The configured checkout link, or null until one is set. Only https links are accepted. */
export function checkoutUrl(): string | null {
  const v = (import.meta.env["VITE_CHECKOUT_URL"] as string | undefined)?.trim();
  return v && /^https:\/\//.test(v) ? v : null;
}
