// All /api/ endpoints as one framework-light handler: (Request) -> Response. The Netlify Function is a thin wrapper.
// Security rules enforced here: the browser never names a customer (the id comes from the signed cookie only), raw
// license codes are never logged or returned, every response is no-store, state changes need same-origin plus a CSRF header.
import { validateSave, type Save } from "../../passport/progress";
import { MAX_BODY_BYTES, MIN_SECRET_LENGTH, REVERIFY_MS } from "./config";
import { open, purchaseRefHash, seal } from "./crypto";
import type { KV } from "./kv";
import type { RateLimiter } from "./limits";
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
};

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

async function readBody(req: Request): Promise<Record<string, unknown>> {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > MAX_BODY_BYTES) throw new HttpError(413, "payload_too_large");
  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) throw new HttpError(413, "payload_too_large");
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
      "/api/account/export": ["POST"],
      "/api/account/delete": ["POST"],
    };
    const allowed = routes[path];
    if (!allowed) return fail(404, "not_found");
    if (!allowed.includes(method))
      return fail(405, "method_not_allowed", {}, { allow: allowed.join(", ") });

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
      if (e instanceof ConflictError) return fail(503, "busy_retry", {}, { "retry-after": "1" });
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
      const problem = validateSave(body["localSave"]);
      if (problem) return fail(400, "bad_local_save");
      local = body["localSave"] as Save;
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
    const problem = validateSave(body["save"]);
    if (problem) return fail(400, "bad_save", { detail: problem });
    const baseRev = typeof body["baseRev"] === "number" ? body["baseRev"] : -1;
    const out = await store.applyProgress(session.cus, body["save"] as Save);
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
