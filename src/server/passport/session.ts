// Signed session cookie and CSRF token. The cookie carries only the opaque customer id and an expiry.
import { CUSTOMER_ID_RE, deriveKey, hmac, safeEqual } from "./crypto";
import { SESSION_DAYS } from "./config";

export const COOKIE = "pp_session";
export const CSRF_HEADER = "x-pp-csrf";
export type Session = { cus: string; exp: number };

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");

export function signSession(
  secret: string,
  cus: string,
  now: number,
): { token: string; exp: number } {
  const exp = now + SESSION_DAYS * 86_400_000;
  const payload = b64(JSON.stringify({ v: 1, cus, exp }));
  return { token: `${payload}.${hmac(deriveKey(secret, "session"), payload)}`, exp };
}

export function verifySession(
  secret: string,
  token: string | null | undefined,
  now: number,
): Session | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot < 1 || token.length > 400) return null;
  const payload = token.slice(0, dot);
  if (!safeEqual(hmac(deriveKey(secret, "session"), payload), token.slice(dot + 1))) return null;
  try {
    const p = JSON.parse(unb64(payload)) as { v?: unknown; cus?: unknown; exp?: unknown };
    if (p.v !== 1 || typeof p.cus !== "string" || !CUSTOMER_ID_RE.test(p.cus)) return null;
    if (typeof p.exp !== "number" || p.exp <= now) return null;
    return { cus: p.cus, exp: p.exp };
  } catch {
    return null;
  }
}

/** Double-submit token derived from the session: the page reads it from a JSON response and echoes it in a header. */
export const csrfFor = (secret: string, s: Session): string =>
  hmac(deriveKey(secret, "csrf"), `${s.cus}|${s.exp}`);

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export const sessionCookie = (token: string, exp: number, now: number): string =>
  `${COOKIE}=${token}; Path=/; Max-Age=${Math.floor((exp - now) / 1000)}; HttpOnly; Secure; SameSite=Lax`;
export const clearCookie = (): string =>
  `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

/** Same-origin check for state-changing requests. A missing Origin is refused. */
export function sameOrigin(req: Request): boolean {
  const o = req.headers.get("origin");
  if (!o) return false;
  try {
    return new URL(o).origin === new URL(req.url).origin;
  } catch {
    return false;
  }
}
