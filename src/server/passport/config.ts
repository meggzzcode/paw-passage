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
