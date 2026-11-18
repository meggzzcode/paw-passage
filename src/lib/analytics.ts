import { site } from "@/config/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 event only when a measurement ID is configured and gtag has loaded. */
export function trackOutbound(params: {
  stay: string;
  partner: string;
  url: string;
  page: string;
}) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "booking_click", {
    stay_slug: params.stay,
    partner: params.partner,
    link_url: params.url,
    page_path: params.page,
    transport_type: "beacon",
  });
  return true;
}

/** Outbound click on a gear-guide product link. Sends nothing without a GA4 ID. */
export function trackProductClick(params: {
  product: string;
  partner: string;
  url: string;
  page: string;
}) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "product_click", {
    product_id: params.product,
    partner: params.partner,
    link_url: params.url,
    page_path: params.page,
    transport_type: "beacon",
  });
  return true;
}

/**
 * Usage events for the site's tools and lookups, so the owner can see which are really used (and drop the ones that are not).
 * Sends nothing without a GA4 ID. Never send what a visitor types: only the event name, a short label and counts.
 * Reading them in Google Analytics: see docs/TOOL-TRACKING.md.
 */
export type ToolEvent =
  | "tool_start" // the visitor changed or filled the first thing in a tool
  | "tool_complete" // the visitor produced a result (a total, a message, a rule)
  | "tool_copy" // copied the result
  | "tool_print" // printed the result
  | "rules_search" // used the dog-rules lookup search or filters
  | "rules_view" // opened a place's rules page
  | "rules_source_click"; // clicked through to the official source

export function trackTool(
  event: ToolEvent,
  params: { tool: string; label?: string; count?: number },
) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", event, {
    tool_name: params.tool,
    tool_label: params.label ?? "",
    item_count: params.count ?? 0,
    page_path: window.location.pathname,
    transport_type: "beacon",
  });
  return true;
}

/** Fires an event only the first time per page view, e.g. "tool_start" when a visitor first touches a tool. */
const fired = new Set<string>();
export function trackToolOnce(
  event: ToolEvent,
  params: { tool: string; label?: string; count?: number },
) {
  const key = `${event}:${params.tool}:${params.label ?? ""}`;
  if (fired.has(key)) return false;
  const sent = trackTool(event, params);
  if (sent) fired.add(key);
  return sent;
}

/**
 * Additional events (WP6). Same rules as above: nothing is sent without a GA4 ID, and nothing a visitor types is ever sent.
 *
 * Call sites still to add (those files belong to other owners, so they are documented in docs/ANALYTICS-SETUP.md):
 *  - hub card links (GearHubCards, category pages):      trackHubCardClick({ hub: "gear", card: category.slug, page })
 *  - a plain outbound link (maker site, official source): trackOutboundClick({ url, page, label })
 *  - an accommodation referral link that is not a stay booking button: trackAccommodationReferral({ partner, stay, url, page })
 *  - the stay fee calculator showing a result:           trackToolOnce("tool_complete", { tool: "stay-fee-calculator", label: stay.slug })
 */

/** Shortens an address to host + path. Query strings and fragments are dropped, so no tracking IDs or typed text travel with it. */
export function stripUrl(raw: string): string {
  try {
    const u = new URL(raw);
    return `${u.hostname}${u.pathname}`.slice(0, 100);
  } catch {
    return "";
  }
}

/** Click on a card that leads from a hub page (gear hub, destinations) to a lower page. */
export function trackHubCardClick(params: { hub: string; card: string; page: string }) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "hub_card_click", {
    hub: params.hub,
    card: params.card,
    page_path: params.page,
    transport_type: "beacon",
  });
  return true;
}

/** Click on a plain outbound link (not an affiliate booking or product button). Only host and path are sent. */
export function trackOutboundClick(params: { url: string; page: string; label?: string }) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "outbound_click", {
    link_url: stripUrl(params.url),
    link_label: params.label ?? "",
    page_path: params.page,
    transport_type: "beacon",
  });
  return true;
}

/** Click on an accommodation referral link (for example a Stay22 link) that is not the stay booking button. */
export function trackAccommodationReferral(params: {
  partner: string;
  stay?: string;
  url: string;
  page: string;
}) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "accommodation_referral_click", {
    partner: params.partner,
    stay_slug: params.stay ?? "",
    link_url: stripUrl(params.url),
    page_path: params.page,
    transport_type: "beacon",
  });
  return true;
}

/**
 * The event vocabulary, one place. docs/ANALYTICS-SETUP.md carries the same table and src/test/analytics.test.ts
 * checks that the two agree, so a rename here cannot silently break the owner's GA4 reports.
 */
export const EVENT_VOCABULARY = {
  booking_click: ["stay_slug", "partner", "link_url", "page_path"],
  product_click: ["product_id", "partner", "link_url", "page_path"],
  accommodation_referral_click: ["partner", "stay_slug", "link_url", "page_path"],
  hub_card_click: ["hub", "card", "page_path"],
  outbound_click: ["link_url", "link_label", "page_path"],
  tool_start: ["tool_name", "tool_label", "item_count", "page_path"],
  tool_complete: ["tool_name", "tool_label", "item_count", "page_path"],
  tool_copy: ["tool_name", "tool_label", "item_count", "page_path"],
  tool_print: ["tool_name", "tool_label", "item_count", "page_path"],
  rules_search: ["tool_name", "tool_label", "item_count", "page_path"],
  rules_view: ["tool_name", "tool_label", "item_count", "page_path"],
  rules_source_click: ["tool_name", "tool_label", "item_count", "page_path"],
} as const;
