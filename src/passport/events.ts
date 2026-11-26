// Product analytics. Only these named events are ever sent, with only the listed small fields.
// Never put a dog's name, memory text, license code, email or any customer ID in an event.
import { site } from "@/config/site";
import { campaignFields } from "@/lib/campaign";

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
  | "calendar_reminder_downloaded"
  | "intro_started"
  | "intro_personalized"
  | "intro_recommended"
  | "intro_replaced"
  | "intro_revealed"
  | "intro_completed"
  | "preview_viewed"
  | "preview_bookmarked"
  | "preview_unbookmarked"
  | "collection_preview_viewed"
  | "keepsake_downloaded"
  | "keepsake_share_attempted"
  | "purchase_cta_clicked"
  | "install_guide_viewed"
  | "install_initiated"
  | "install_detected"
  | "notification_permission_requested"
  | "notification_permission_granted"
  | "notification_permission_declined"
  | "push_subscription_enabled"
  | "push_subscription_disabled"
  | "notification_delivery_accepted"
  | "notification_opened"
  | "adventure_scheduled"
  | "calendar_event_exported"
  | "scheduled_adventure_completed"
  | "journal_article_view"
  | "journal_cta_click"
  | "journal_collection_click"
  | "journal_related_click"
  | "journal_preview_click";

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
  "intro_started",
  "intro_personalized",
  "intro_recommended",
  "intro_replaced",
  "intro_revealed",
  "intro_completed",
  "preview_viewed",
  "preview_bookmarked",
  "preview_unbookmarked",
  "collection_preview_viewed",
  "keepsake_downloaded",
  "keepsake_share_attempted",
  "purchase_cta_clicked",
  "install_guide_viewed",
  "install_initiated",
  "install_detected",
  "notification_permission_requested",
  "notification_permission_granted",
  "notification_permission_declined",
  "push_subscription_enabled",
  "push_subscription_disabled",
  "notification_delivery_accepted",
  "notification_opened",
  "adventure_scheduled",
  "calendar_event_exported",
  "scheduled_adventure_completed",
  "journal_article_view",
  "journal_cta_click",
  "journal_collection_click",
  "journal_related_click",
  "journal_preview_click",
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
  // Aggregate campaign fields (sanitized utm_*) ride along on the two purchase-funnel events only.
  if (name === "purchase_cta_clicked" || name === "checkout_started")
    Object.assign(safe, campaignFields());
  for (const [k, v] of Object.entries(params)) {
    if (!FIELD.test(k)) continue;
    if (typeof v === "string" && !FIELD.test(v)) continue; // slugs and ids only: free text is dropped
    safe[k] = v;
  }
  window.gtag("event", `pp_${name}`, { ...safe, transport_type: "beacon" });
  return true;
}
