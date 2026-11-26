// The only file that talks to a push service. Everything else receives a `PushSender`, so tests inject a fake and
// never touch the network. Uses the maintained `web-push` package for VAPID and payload encryption (no custom crypto).
import type { PushSubscriptionJson } from "./push-store";

export type SendOptions = {
  ttl: number;
  urgency: "very-low" | "low" | "normal" | "high";
  topic?: string;
};
/** Resolves with the push service HTTP status (201 accepted, 404/410 gone). Rejects only on a network failure. */
export type PushSender = (
  sub: PushSubscriptionJson,
  payload: string,
  opts: SendOptions,
) => Promise<{ status: number }>;

export type VapidConfig = { subject: string; publicKey: string; privateKey: string };

export function vapidFromEnv(env: {
  VAPID_PUBLIC_KEY?: string | undefined;
  VAPID_PRIVATE_KEY?: string | undefined;
  VAPID_SUBJECT?: string | undefined;
}): VapidConfig | null {
  const publicKey = env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = env.VAPID_PRIVATE_KEY?.trim();
  const subject = env.VAPID_SUBJECT?.trim();
  if (!publicKey || !privateKey || !subject) return null;
  if (!/^[A-Za-z0-9_-]{80,100}$/.test(publicKey)) return null;
  if (!/^[A-Za-z0-9_-]{40,50}$/.test(privateKey)) return null;
  if (!/^(mailto:[^\s@]+@[^\s@]+|https:\/\/\S+)$/.test(subject)) return null;
  return { subject, publicKey, privateKey };
}

/** Real sender. The status code of a rejected send (WebPushError) is returned, not thrown, so 404/410 can prune. */
export function createWebPushSender(vapid: VapidConfig): PushSender {
  return async (sub, payload, opts) => {
    const mod = await import("web-push");
    const wp = mod.default ?? mod;
    try {
      const r = await wp.sendNotification(sub, payload, {
        vapidDetails: vapid,
        TTL: opts.ttl,
        urgency: opts.urgency,
        timeout: 8000,
        ...(opts.topic ? { topic: opts.topic } : {}),
      });
      return { status: r.statusCode };
    } catch (e) {
      const code = (e as { statusCode?: unknown }).statusCode;
      if (typeof code === "number") return { status: code };
      throw new Error("push_network_error"); // message dropped on purpose: it can contain the endpoint
    }
  };
}
