// All /api/ endpoints as one framework-light handler: (Request) -> Response. The Netlify Function is a thin wrapper.
// Security rules enforced here: the browser never names a customer (the id comes from the signed cookie only), raw
// license codes are never logged or returned, every response is no-store, state changes need same-origin plus a CSRF header.
import { migrate, validateSave, type Save } from "../../passport/progress";
import { MAX_BODY_BYTES, MIN_SECRET_LENGTH, REVERIFY_MS } from "./config";
import { MATCH_MAX_BODY_BYTES, matchProfile, validateMatchBody } from "./match";
import { PREVIEW_INDEX_KEY, parsePreviewIndex } from "./previews";
import { open, purchaseRefHash, seal } from "./crypto";
import { createNotificationsApi, type NotifEnv } from "./notifications-api";
import { PushConflictError } from "./push-store";
import type { KV } from "./kv";
import { createRateLimiter, type RateLimiter } from "./limits";
import type { CheckoutProvider } from "./provider";
import {
  clearCookie,
  COOKIE,
  csrfFor,
  CSRF_HEADER,
  readCookie,
  sameOrigin,
  sessionCookie,
  signSession,
  verifySession,
  type Session,
} from "./session";
import {
  ConflictError,
  CustomerStore,
  findCustomerId,
  premiumSummary,
  readPremium,
  type CustomerRecord,
  type EntitlementStatus,
} from "./store";

export type ApiDeps = {
  customers: KV;
  premium: KV;
  provider: CheckoutProvider;
  secret: string | undefined;
  /** Key for purchase hashes and sealed codes. Falls back to the session secret. Keep it stable once customers exist. */
  dataKey?: string | undefined;
  now?: () => number;
  ip?: string | undefined;
  accessLimiter: RateLimiter;
  generalLimiter: RateLimiter;
  log?: (event: string, fields?: Record<string, string | number | boolean>) => void;
  /** Push settings from the environment (kill switch and VAPID keys). Absent means notifications are off. */
  notifEnv?: NotifEnv;
  /** Per-customer limit for notification writes. Defaults to a shared in-memory limiter (best effort per instance). */
  notifLimiter?: RateLimiter;
};

// Module-level so counters survive between requests handled by the same function instance.
const defaultNotifLimiter = createRateLimiter({ windowMs: 60_000, max: 40 });

const CODE_RE = /^[A-Za-z0-9_-]{8,100}$/;
const STATE_CHANGING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Structured log that only ever receives short, non-secret fields. */
export const defaultLog: NonNullable<ApiDeps["log"]> = (event, fields = {}) => {
  console.info(JSON.stringify({ event, ...fields }));
};

function json(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
  cookies: string[] = [],
): Response {
  const h = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...headers,
  });
  for (const c of cookies) h.append("set-cookie", c);
  return new Response(JSON.stringify(body), { status, headers: h });
}
const fail = (
  status: number,
  error: string,
  extra: Record<string, unknown> = {},
  h: Record<string, string> = {},
  c: string[] = [],
) => json(status, { ok: false, error, ...extra }, h, c);

class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

async function readBody(req: Request, max = MAX_BODY_BYTES): Promise<Record<string, unknown>> {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > max) throw new HttpError(413, "payload_too_large");
  const text = await req.text();
  if (Buffer.byteLength(text) > max) throw new HttpError(413, "payload_too_large");
  if (!text) return {};
  try {
    const v = JSON.parse(text) as unknown;
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("not object");
    return v as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "bad_json");
  }
}

export function createApi(deps: ApiDeps) {
  const now = deps.now ?? Date.now;
  const log = deps.log ?? defaultLog;
  const store = new CustomerStore(deps.customers, now);
  const notifLimiter = deps.notifLimiter ?? defaultNotifLimiter;
  const notif = createNotificationsApi({
    customers: deps.customers,
    premium: deps.premium,
    now,
    env: deps.notifEnv ?? {},
  });

  async function handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = req.method.toUpperCase();
    const routes: Record<string, string[]> = {
      "/api/session": ["GET"],
      "/api/access/activate": ["POST"],
      "/api/access/restore": ["POST"],
      "/api/progress": ["GET", "PUT"],
      "/api/premium/adventures": ["GET"],
      "/api/premium/summary": ["GET"],
      "/api/previews": ["GET"],
      "/api/previews/match": ["POST"],
      "/api/account/export": ["POST"],
      "/api/account/delete": ["POST"],
    };
    const allowed = routes[path] ?? notif.methods(path);
    if (!allowed) return fail(404, "not_found");
    if (!allowed.includes(method))
      return fail(405, "method_not_allowed", {}, { allow: allowed.join(", ") });

    // Public and anonymous: counts only, no session needed, so it works even before sign-in.
    if (path === "/api/premium/summary") {
      if (!deps.generalLimiter.allow(`g:${deps.ip ?? "unknown"}`))
        return fail(429, "rate_limited", {}, { "retry-after": "60" });
      return await summary();
    }

    // Public and anonymous: allowlisted preview records and aggregate counts. Never any card text beyond the teaser.
    if (path === "/api/previews" || path === "/api/previews/match") {
      if (!deps.generalLimiter.allow(`g:${deps.ip ?? "unknown"}`))
        return fail(429, "rate_limited", {}, { "retry-after": "60" });
      return path === "/api/previews" ? await previews() : await previewMatch(req);
    }

    // Public and anonymous: whether notifications are on, and the public VAPID key. Nothing about any customer.
    if (path === "/api/push/config") {
      if (!deps.generalLimiter.allow(`g:${deps.ip ?? "unknown"}`))
        return fail(429, "rate_limited", {}, { "retry-after": "60" });
      try {
        const c = await notif.config();
        return json(c.status, c.body);
      } catch {
        return json(200, { enabled: false, publicKey: null });
      }
    }

    const secret = deps.secret;
    if (!secret || secret.length < MIN_SECRET_LENGTH) {
      log("server_misconfigured", { reason: "session_secret" });
      return fail(503, "server_misconfigured");
    }
    const dataKey =
      deps.dataKey && deps.dataKey.length >= MIN_SECRET_LENGTH ? deps.dataKey : secret;

    const isAccess = path.startsWith("/api/access/");
    const limiter = isAccess ? deps.accessLimiter : deps.generalLimiter;
    if (!limiter.allow(`${isAccess ? "a" : "g"}:${deps.ip ?? "unknown"}`))
      return fail(429, "rate_limited", {}, { "retry-after": "60" });

    if (STATE_CHANGING.has(method) && !sameOrigin(req)) return fail(403, "bad_origin");

    try {
      if (isAccess)
        return await access(
          req,
          path.endsWith("/restore") ? "restore" : "activate",
          secret,
          dataKey,
        );

      const session = verifySession(secret, readCookie(req.headers.get("cookie"), COOKIE), now());
      if (!session)
        return fail(
          401,
          "not_signed_in",
          {},
          {},
          readCookie(req.headers.get("cookie"), COOKIE) ? [clearCookie()] : [],
        );
      if (STATE_CHANGING.has(method)) {
        const sent = req.headers.get(CSRF_HEADER) ?? "";
        const want = csrfFor(secret, session);
        if (!sent || sent.length !== want.length || sent !== want) return fail(403, "bad_csrf");
      }
      const cur = await store.get(session.cus);
      if (!cur) return fail(401, "not_signed_in", {}, {}, [clearCookie()]);

      if (
        path.startsWith("/api/push/") ||
        path.startsWith("/api/notifications") ||
        path.startsWith("/api/schedule")
      ) {
        // Customers only: an active entitlement, and the customer is always the one named by the cookie.
        const ent = await freshEntitlement(cur.rec, dataKey);
        if (ent.entitlement.status !== "active")
          return fail(403, "not_entitled", { reason: ent.entitlement.status });
        if (STATE_CHANGING.has(method) && !notifLimiter.allow(`n:${session.cus}`))
          return fail(429, "rate_limited", {}, { "retry-after": "60" });
        const r = await notif.handle(path, method, session.cus, dataKey, (max) =>
          readBody(req, max),
        );
        return json(r.status, r.body);
      }

      switch (path) {
        case "/api/session":
          return await sessionInfo(session, cur.rec, secret, dataKey);
        case "/api/progress":
          return method === "GET"
            ? json(200, { ok: true, save: cur.rec.save, rev: cur.rec.save.rev })
            : await putProgress(req, session);
        case "/api/premium/adventures":
          return await premium(session, cur.rec, dataKey);
        case "/api/account/export":
          return exportData(cur.rec);
        default:
          return await deleteAccount(req, session);
      }
    } catch (e) {
      if (e instanceof HttpError) return fail(e.status, e.code);
      if (e instanceof ConflictError || e instanceof PushConflictError)
        return fail(503, "busy_retry", {}, { "retry-after": "1" });
      log("unhandled_error", { name: e instanceof Error ? e.name : "unknown" }); // message omitted on purpose
      return fail(500, "server_error");
    }
  }

  /** Verifies a code with the provider and maps it to a response. The code itself goes nowhere else. */
  async function access(
    req: Request,
    kind: "activate" | "restore",
    secret: string,
    dataKey: string,
  ) {
    const body = await readBody(req);
    const code = typeof body["code"] === "string" ? body["code"].trim() : "";
    if (!CODE_RE.test(code)) return fail(400, "invalid_code_format");
    let local: Save | null = null;
    if (body["localSave"] !== undefined && body["localSave"] !== null) {
      local = migrate(body["localSave"]); // v1 or v2; always handled as v2
      if (!local) return fail(400, "bad_local_save");
    }

    const v = await deps.provider.verify(code);
    if (v.status === "unavailable") {
      log("access_unavailable", { kind });
      return fail(
        503,
        "provider_unavailable",
        { reason: "provider_unavailable" },
        { "retry-after": "30" },
      );
    }
    // Fall back to hashing the code only if the provider gives no purchase reference.
    const hash = purchaseRefHash(dataKey, deps.provider.name, v.purchaseRef ?? `code:${code}`);

    if (v.status !== "valid") {
      const existing = await findCustomerId(deps.customers, hash);
      if (existing && v.status !== "invalid")
        await store.setEntitlement(existing, {
          status: v.status as EntitlementStatus,
          lastVerifiedAt: now(),
        });
      const reason = v.status === "invalid" ? "invalid_code" : v.status;
      log("access_denied", { kind, reason });
      return fail(403, reason, { reason }, {}, []);
    }

    const { rec, created } = await store.activate(hash, seal(dataKey, code), local, "active");
    const t = now();
    const { token, exp } = signSession(secret, rec.id, t);
    const reason = created ? "activated" : kind === "restore" ? "restored" : "already_active";
    log("access_granted", { kind, reason });
    return json(
      200,
      {
        ok: true,
        reason,
        entitled: true,
        csrf: csrfFor(secret, { cus: rec.id, exp }),
        save: rec.save,
        rev: rec.save.rev,
      },
      {},
      [sessionCookie(token, exp, t)],
    );
  }

  /** Re-checks with the provider at most once per 24h. Unavailable never changes anything. */
  async function freshEntitlement(rec: CustomerRecord, dataKey: string): Promise<CustomerRecord> {
    const ent = rec.entitlement;
    if (ent.status !== "active" || now() - ent.lastVerifiedAt < REVERIFY_MS) return rec;
    const code = ent.codeSealed ? open(dataKey, ent.codeSealed) : null;
    if (!code) return rec;
    const v = await deps.provider.verify(code);
    if (v.status === "unavailable") return rec;
    const status: EntitlementStatus =
      v.status === "valid" ? "active" : v.status === "invalid" ? "revoked" : v.status;
    if (status !== "active") log("entitlement_revoked", { reason: status });
    const out = await store.setEntitlement(rec.id, { status, lastVerifiedAt: now() });
    return out?.rec ?? rec;
  }

  async function sessionInfo(
    session: Session,
    rec0: CustomerRecord,
    secret: string,
    dataKey: string,
  ) {
    const rec = await freshEntitlement(rec0, dataKey);
    return json(200, {
      ok: true,
      authenticated: true,
      entitled: rec.entitlement.status === "active",
      status: rec.entitlement.status,
      csrf: csrfFor(secret, session),
      expiresAt: session.exp,
    });
  }

  async function putProgress(req: Request, session: Session) {
    const body = await readBody(req); // any id or customer field in the body is ignored: only the cookie names the customer
    const incoming = migrate(body["save"]); // v1 or v2; always stored as v2
    if (!incoming) {
      const raw = body["save"] as { v?: unknown } | null | undefined;
      return fail(400, "bad_save", {
        detail: raw && raw.v === 2 ? (validateSave(raw) ?? "bad save") : "bad save",
      });
    }
    const baseRev = typeof body["baseRev"] === "number" ? body["baseRev"] : -1;
    const out = await store.applyProgress(session.cus, incoming);
    if (!out) return fail(401, "not_signed_in", {}, {}, [clearCookie()]);
    return json(200, {
      ok: true,
      save: out.rec.save,
      rev: out.rec.save.rev,
      changed: out.changed,
      stale: baseRev !== out.rec.save.rev - (out.changed ? 1 : 0),
    });
  }

  async function premium(_s: Session, rec0: CustomerRecord, dataKey: string) {
    const rec = await freshEntitlement(rec0, dataKey);
    if (rec.entitlement.status !== "active")
      return fail(403, "not_entitled", { reason: rec.entitlement.status });
    return json(200, { ok: true, adventures: await readPremium(deps.premium) });
  }

  /** Cacheable for 10 minutes. An unreadable store is a 503 the client treats as "unknown"; an empty one is zero. */
  async function summary() {
    try {
      const s = await premiumSummary(deps.premium);
      return json(200, { ok: true, ...s }, { "cache-control": "public, max-age=600" });
    } catch {
      log("summary_unavailable");
      return fail(503, "summary_unavailable", {}, { "retry-after": "60" });
    }
  }

  async function readPreviewStore() {
    return parsePreviewIndex((await deps.premium.get(PREVIEW_INDEX_KEY))?.value);
  }

  /** Cacheable for 5 minutes. No store (or an empty one) is an honest empty answer, not an error. */
  async function previews() {
    try {
      const idx = await readPreviewStore();
      const body = idx
        ? { items: idx.items, total: idx.total, collections: idx.collections }
        : { items: [], total: 0, collections: 0 };
      return json(200, body, { "cache-control": "public, max-age=300" });
    } catch {
      log("previews_unavailable");
      return fail(503, "previews_unavailable", {}, { "retry-after": "60" });
    }
  }

  /** The body (an optional dog profile) is validated and never logged. Not cacheable. */
  async function previewMatch(req: Request) {
    if (!sameOrigin(req)) return fail(403, "bad_origin");
    try {
      const parsed = validateMatchBody(await readBody(req, MATCH_MAX_BODY_BYTES));
      if (!parsed) return fail(400, "bad_profile");
      return json(200, matchProfile(await readPreviewStore(), parsed.dog, parsed.owner));
    } catch (e) {
      if (e instanceof HttpError) return fail(e.status, e.code);
      log("previews_unavailable");
      return fail(503, "previews_unavailable", {}, { "retry-after": "60" });
    }
  }

  function exportData(rec: CustomerRecord) {
    return json(
      200,
      { exportedAt: now(), progress: rec.save, entitlementStatus: rec.entitlement.status },
      { "content-disposition": 'attachment; filename="paws-passage-progress.json"' },
    );
  }

  async function deleteAccount(req: Request, session: Session) {
    const body = await readBody(req);
    if (body["confirm"] !== "DELETE") return fail(400, "confirmation_required");
    await store.remove(session.cus);
    log("account_deleted");
    return json(200, { ok: true, deleted: true }, {}, [clearCookie()]);
  }

  return { handle };
}
