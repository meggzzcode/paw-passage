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
