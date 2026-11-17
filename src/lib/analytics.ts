import { site } from "@/config/site";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

/** Sends a GA4 event only when a measurement ID is configured and gtag has loaded. */
export function trackOutbound(params: { stay: string; partner: string; url: string; page: string }) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "booking_click", { stay_slug: params.stay, partner: params.partner, link_url: params.url, page_path: params.page, transport_type: "beacon" });
  return true;
}

/** Outbound click on a gear-guide product link. Sends nothing without a GA4 ID. */
export function trackProductClick(params: { product: string; partner: string; url: string; page: string }) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", "product_click", { product_id: params.product, partner: params.partner, link_url: params.url, page_path: params.page, transport_type: "beacon" });
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

export function trackTool(event: ToolEvent, params: { tool: string; label?: string; count?: number }) {
  if (!site.ga4MeasurementId || typeof window === "undefined" || !window.gtag) return false;
  window.gtag("event", event, { tool_name: params.tool, tool_label: params.label ?? "", item_count: params.count ?? 0, page_path: window.location.pathname, transport_type: "beacon" });
  return true;
}

/** Fires an event only the first time per page view, e.g. "tool_start" when a visitor first touches a tool. */
const fired = new Set<string>();
export function trackToolOnce(event: ToolEvent, params: { tool: string; label?: string; count?: number }) {
  const key = `${event}:${params.tool}:${params.label ?? ""}`;
  if (fired.has(key)) return false;
  const sent = trackTool(event, params);
  if (sent) fired.add(key);
  return sent;
}
