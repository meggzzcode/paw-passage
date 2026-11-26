// Product analytics. Only these named events are ever sent, with only the listed small fields.
// Never put a dog's name, memory text, license code, email or any customer ID in an event.
import { site } from "@/config/site";

export type EventName =
  | "profile_completed"
  | "adventure_revealed"
  | "adventure_completed"
  | "adventure_saved"
  | "favorite_added"
  | "keepsake_created"
  | "share_clicked"
  | "share_completed"
  | "unlock_viewed"
  | "checkout_started"
  | "purchase_confirmed"
  | "access_restored"
  | "affiliate_clicked"
  | "suggestion_revealed"
  | "calendar_reminder_downloaded";

const ALLOWED = new Set<EventName>([
  "profile_completed",
  "adventure_revealed",
  "adventure_completed",
  "adventure_saved",
  "favorite_added",
  "keepsake_created",
  "share_clicked",
  "share_completed",
  "unlock_viewed",
  "checkout_started",
  "purchase_confirmed",
  "access_restored",
  "affiliate_clicked",
  "suggestion_revealed",
  "calendar_reminder_downloaded",
]);
const FIELD = /^[a-z0-9_-]{1,40}$/;

/** Returns true only when an event was actually handed to GA4. A click is never reported as a confirmed result. */
export function track(
  name: EventName,
  params: Record<string, string | number | boolean> = {},
): boolean {
  if (!ALLOWED.has(name)) return false;
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  const safe: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (!FIELD.test(k)) continue;
    if (typeof v === "string" && !FIELD.test(v)) continue; // slugs and ids only: free text is dropped
    safe[k] = v;
  }
  window.gtag("event", `pp_${name}`, { ...safe, transport_type: "beacon" });
  return true;
}
