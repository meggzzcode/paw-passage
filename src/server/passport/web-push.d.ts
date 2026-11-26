// Minimal typings for the parts of the `web-push` package this repo uses (the package ships none).
declare module "web-push" {
  export type PushSubscriptionLike = { endpoint: string; keys: { p256dh: string; auth: string } };
  export type SendOptions = {
    vapidDetails?: { subject: string; publicKey: string; privateKey: string };
    TTL?: number;
    urgency?: "very-low" | "low" | "normal" | "high";
    topic?: string;
    timeout?: number;
  };
  export function sendNotification(
    subscription: PushSubscriptionLike,
    payload: string,
    options?: SendOptions,
  ): Promise<{ statusCode: number }>;
  const _default: { sendNotification: typeof sendNotification };
  export default _default;
}
