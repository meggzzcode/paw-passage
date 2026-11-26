import { site } from "@/config/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
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
 * Usage events for the site's tools, so the owner can see which are really used (and drop the ones that are not).
 * Sends nothing without a GA4 ID. Never send what a visitor types: only the event name, a short label and counts.
 *  */
export type ToolEvent =
  | "tool_start" // the visitor changed or filled the first thing in a tool
  | "tool_complete" // the visitor produced a result (a total, a message, a rule)
  | "tool_copy" // copied the result
  | "tool_print" // printed the result
  | "packing_trip_edited" // packing planner: the visitor changed their trip details after building a list
  | "packing_custom_added" // packing planner: added one of their own items (the text is never sent)
  | "packing_item_packed" // packing planner: ticked "Packed" (label = the item's content id)
  | "packing_item_need_to_buy" // packing planner: ticked "Need to buy" (label = the item's content id)
  | "packing_recommendation_opened"; // packing planner: a product panel opened under an item (label = the item's content id)

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
 * The event vocabulary for the guides, gear and packing planner, one place. The Adventure Passport has its own, separate list
 * in src/passport/events.ts.
 */
export const EVENT_VOCABULARY = {
  product_click: ["product_id", "partner", "link_url", "page_path"],
  tool_start: ["tool_name", "tool_label", "item_count", "page_path"],
  tool_complete: ["tool_name", "tool_label", "item_count", "page_path"],
  tool_copy: ["tool_name", "tool_label", "item_count", "page_path"],
  tool_print: ["tool_name", "tool_label", "item_count", "page_path"],
  packing_trip_edited: ["tool_name", "tool_label", "item_count", "page_path"],
  packing_custom_added: ["tool_name", "tool_label", "item_count", "page_path"],
  packing_item_packed: ["tool_name", "tool_label", "item_count", "page_path"],
  packing_item_need_to_buy: ["tool_name", "tool_label", "item_count", "page_path"],
  packing_recommendation_opened: ["tool_name", "tool_label", "item_count", "page_path"],
} as const;
