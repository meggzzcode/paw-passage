// Checkout provider interface. The rest of the server only knows this interface, never Gumroad.
// A provider NEVER logs, returns or builds a URL from the raw license code.
import type { DeployContext, Env } from "./config";

export type VerifyStatus =
  "valid" | "invalid" | "refunded" | "disputed" | "revoked" | "unavailable";
export type VerifyResult = { status: VerifyStatus; purchaseRef?: string };
export interface CheckoutProvider {
  readonly name: string;
  verify(code: string): Promise<VerifyResult>;
}

export const GUMROAD_VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";

/**
 * Gumroad adapter.
 * UNVERIFIED (Cowork task CW-PAY-1): Gumroad's live API reference could not be read. Every Gumroad specific below is
 * from the documented shape as recalled, and MUST be confirmed before launch: the endpoint URL, the parameter names
 * product_id / license_key / increment_uses_count, the response fields success / purchase.id / purchase.sale_id /
 * purchase.refunded / purchase.chargebacked / purchase.disputed / purchase.dispute_won / purchase.license_disabled,
 * the HTTP status used for an unknown key, and whether increment_uses_count=false is honoured.
 */
export function createGumroadProvider(opts: {
  productId: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): CheckoutProvider {
  const doFetch = opts.fetchImpl ?? fetch;
  return {
    name: "gumroad",
    async verify(code: string): Promise<VerifyResult> {
      let res: Response;
      try {
        res = await doFetch(GUMROAD_VERIFY_URL, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          // The code travels only in the POST body, never in a URL.
          body: new URLSearchParams({
            product_id: opts.productId, // UNVERIFIED param name
            license_key: code, // UNVERIFIED param name
            increment_uses_count: "false", // UNVERIFIED: must not burn a use on every check
          }).toString(),
          signal: AbortSignal.timeout(opts.timeoutMs ?? 6000),
        });
      } catch {
        return { status: "unavailable" }; // network error or timeout: never grant or revoke
      }
      if (res.status >= 500 || res.status === 429) return { status: "unavailable" };
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        return { status: "unavailable" };
      }
      if (!body || typeof body !== "object") return { status: "unavailable" };
      const b = body as { success?: unknown; purchase?: Record<string, unknown> };
      if (b.success !== true) {
        // UNVERIFIED: an unknown key is assumed to come back as success:false (HTTP 404 or 200).
        return res.status === 404 || res.status === 200 || res.status === 400
          ? { status: "invalid" }
          : { status: "unavailable" };
      }
      const p = b.purchase ?? {};
      const ref = p["id"] ?? p["sale_id"]; // UNVERIFIED field names
      const out = (status: VerifyStatus): VerifyResult =>
        typeof ref === "string" && ref ? { status, purchaseRef: ref } : { status };
      if (p["refunded"] === true) return out("refunded"); // UNVERIFIED
      if (p["chargebacked"] === true || (p["disputed"] === true && p["dispute_won"] !== true))
        return out("disputed"); // UNVERIFIED
      if (p["license_disabled"] === true) return out("revoked"); // UNVERIFIED
      return out("valid");
    },
  };
}

/** Contexts where a fake provider may exist. Anything else, including a missing context, is treated as production. */
const TEST_SAFE_CONTEXTS = ["dev", "deploy-preview", "branch-deploy"];

/** Deterministic provider for tests and previews. Codes: TEST-VALID-x, TEST-REFUNDED-x, TEST-DISPUTED-x, TEST-REVOKED-x, TEST-DOWN-x. */
export class TestProvider implements CheckoutProvider {
  readonly name = "test";
  private overrides = new Map<string, VerifyStatus>();
  constructor(env: Env, deployContext: DeployContext) {
    if (
      env.PP_ALLOW_TEST_PROVIDER !== "1" ||
      !deployContext ||
      !TEST_SAFE_CONTEXTS.includes(deployContext)
    )
      throw new Error("TestProvider is not allowed in this environment");
  }
  /** Lets a test flip a code's state to simulate a later refund. */
  setStatus(code: string, status: VerifyStatus): void {
    this.overrides.set(code, status);
  }
  async verify(code: string): Promise<VerifyResult> {
    const forced = this.overrides.get(code);
    const m = /^TEST-(VALID|REFUNDED|DISPUTED|REVOKED|DOWN)-([A-Z0-9]{1,40})$/.exec(code);
    if (!m && !forced) return { status: "invalid" };
    const kind = m?.[1] ?? "VALID";
    const ref = `test-${m?.[2] ?? code}`;
    const status: VerifyStatus =
      forced ??
      (kind === "VALID"
        ? "valid"
        : kind === "REFUNDED"
          ? "refunded"
          : kind === "DISPUTED"
            ? "disputed"
            : kind === "REVOKED"
              ? "revoked"
              : "unavailable");
    return status === "unavailable" || status === "invalid"
      ? { status }
      : { status, purchaseRef: ref };
  }
}

/** Picks the provider from the environment. No product id and no test flag means "unavailable" (never a silent grant). */
export function selectProvider(env: Env, deployContext: DeployContext): CheckoutProvider {
  if (env.PP_ALLOW_TEST_PROVIDER === "1") {
    try {
      return new TestProvider(env, deployContext);
    } catch {
      // Flag set in production: ignore it and fall through to the real provider.
    }
  }
  if (env.GUMROAD_PRODUCT_ID) return createGumroadProvider({ productId: env.GUMROAD_PRODUCT_ID });
  return { name: "unconfigured", verify: async () => ({ status: "unavailable" }) };
}
