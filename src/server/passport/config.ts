// Environment and deploy-context rules shared by every endpoint.
export type Env = {
  SESSION_SECRET?: string;
  PP_DATA_KEY?: string;
  GUMROAD_PRODUCT_ID?: string;
  PP_ALLOW_TEST_PROVIDER?: string;
  /** Push kill switch: notifications deliver only when this is exactly "true". */
  NOTIFICATIONS_ENABLED?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
};

export type DeployContext =
  "production" | "deploy-preview" | "branch-deploy" | "dev" | string | undefined;

/** Only a production deploy touches production data; everything else (previews, branch deploys, dev, unknown) is "preview". */
export const storeEnv = (ctx: DeployContext): "production" | "preview" =>
  ctx === "production" ? "production" : "preview";

export const customersStoreName = (ctx: DeployContext) => `customers-${storeEnv(ctx)}`;
export const premiumStoreName = (ctx: DeployContext) => `premium-${storeEnv(ctx)}`;

export const MIN_SECRET_LENGTH = 32;
export const SESSION_DAYS = 30;
export const REVERIFY_MS = 24 * 60 * 60 * 1000;
export const MAX_BODY_BYTES = 64 * 1024;

/** Netlify contexts that only ever serve synthetic preview content (never the production stores, see storeEnv). */
export const PREVIEW_CONTEXTS = ["branch-deploy", "deploy-preview"];

/**
 * Preview convenience: on a Netlify branch deploy or deploy preview, missing secrets fall back to fixed, PUBLIC,
 * throwaway values and the test provider is switched on, so a preview needs no environment variables.
 * Safe only because those contexts use the separate preview stores and must hold synthetic content only
 * (anyone who finds a preview URL could forge a preview session). Production and dev never use this.
 */
export function withPreviewDefaults(env: Env, ctx: DeployContext): Env {
  if (typeof ctx !== "string" || !PREVIEW_CONTEXTS.includes(ctx)) return env;
  const filler = [
    "pp",
    "preview",
    "only",
    "not",
    "a",
    "secret",
    "synthetic",
    "content",
    "only",
  ].join("-");
  return {
    ...env,
    SESSION_SECRET: env.SESSION_SECRET || `${filler}-session`,
    PP_DATA_KEY: env.PP_DATA_KEY || `${filler}-data`,
    PP_ALLOW_TEST_PROVIDER: env.PP_ALLOW_TEST_PROVIDER || "1",
  };
}
