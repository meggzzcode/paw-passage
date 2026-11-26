// Wires the handler to Netlify Blobs and the real environment. Kept separate so tests never import @netlify/blobs.
import { getStore } from "@netlify/blobs";
import { createApi, type ApiDeps } from "./api";
import { customersStoreName, premiumStoreName, type Env } from "./config";
import { BlobsKV, type BlobStoreLike } from "./kv";
import { createRateLimiter } from "./limits";
import { selectProvider } from "./provider";

// Module-level so counters survive between requests handled by the same function instance.
const accessLimiter = createRateLimiter({ windowMs: 60_000, max: 12 });
const generalLimiter = createRateLimiter({ windowMs: 60_000, max: 120 });

export type NetlifyContextLike = { ip?: string; deploy?: { context?: string } };

export function handleNetlify(req: Request, context: NetlifyContextLike): Promise<Response> {
  const env = process.env as Env;
  const ctx = context.deploy?.context ?? process.env["CONTEXT"];
  const strong = (name: string) =>
    new BlobsKV(getStore({ name, consistency: "strong" }) as unknown as BlobStoreLike);
  const deps: ApiDeps = {
    customers: strong(customersStoreName(ctx)),
    premium: strong(premiumStoreName(ctx)),
    provider: selectProvider(env, ctx),
    secret: env.SESSION_SECRET,
    dataKey: env.PP_DATA_KEY,
    notifEnv: {
      NOTIFICATIONS_ENABLED: env.NOTIFICATIONS_ENABLED,
      VAPID_PUBLIC_KEY: env.VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY: env.VAPID_PRIVATE_KEY,
      VAPID_SUBJECT: env.VAPID_SUBJECT,
    },
    ip: context.ip ?? req.headers.get("x-nf-client-connection-ip") ?? undefined,
    accessLimiter,
    generalLimiter,
  };
  return createApi(deps).handle(req);
}
