// Wires the scheduled delivery to Netlify Blobs and the real environment. Kept apart so tests never import @netlify/blobs.
import { getStore } from "@netlify/blobs";
import {
  customersStoreName,
  MIN_SECRET_LENGTH,
  premiumStoreName,
  storeEnv,
  type Env,
} from "./config";
import { BlobsKV, type BlobStoreLike } from "./kv";
import { notificationsEnabled } from "./notifications-api";
import { runDelivery, type RunStats } from "./push-deliver";
import { createWebPushSender, vapidFromEnv } from "./push-sender";

/** Same key rule as the API: PP_DATA_KEY when it is long enough, else SESSION_SECRET. */
export function resolveDataKey(env: Env): string | null {
  if (env.PP_DATA_KEY && env.PP_DATA_KEY.length >= MIN_SECRET_LENGTH) return env.PP_DATA_KEY;
  if (env.SESSION_SECRET && env.SESSION_SECRET.length >= MIN_SECRET_LENGTH)
    return env.SESSION_SECRET;
  return null;
}

export async function handleScheduled(ctx: string | undefined): Promise<RunStats | null> {
  const env = process.env as Env;
  const strong = (name: string) =>
    new BlobsKV(getStore({ name, consistency: "strong" }) as unknown as BlobStoreLike);
  const dataKey = resolveDataKey(env);
  const vapid = vapidFromEnv(env);
  if (!dataKey || !vapid) {
    console.info(JSON.stringify({ event: "push_run_unconfigured" }));
    return null;
  }
  const premium = strong(premiumStoreName(ctx));
  return runDelivery({
    customers: strong(customersStoreName(ctx)),
    dataKey,
    sender: createWebPushSender(vapid),
    enabled: async () => (await notificationsEnabled(env, premium)).enabled,
    log: (event, fields = {}) =>
      console.info(JSON.stringify({ event, env: storeEnv(ctx), ...fields })),
  });
}
