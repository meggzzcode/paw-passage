// The one place that decides where a product's button goes and which rel it carries.
// Order: approved affiliate link -> manufacturer page -> plain retailer page -> no button.
// Nothing here invents a link: an affiliate link exists only for an APPROVED entry in content/affiliates.yml
// (and never a "stay" entry); the product records themselves store no affiliate URL.
import { getApprovedLink, affiliateLinks, type AffiliateLink } from "./affiliates";
import { productLinkId } from "./affiliate-usage";
import type { Product } from "./gear";

export type ResolvedLinkKind = "affiliate" | "manufacturer" | "retailer";

export interface ResolvedProductLink {
  kind: ResolvedLinkKind;
  url: string;
  label: string;
  rel: string;
  /** Set for affiliate links only. */
  network?: string;
}

/**
 * rel per link type. Affiliate links are always "sponsored nofollow noopener". They never get "noreferrer": the
 * Vrbo/Expedia Group programme needs the referrer to be passed, so that rule is the same for every network and
 * cannot diverge by accident. Plain links (maker, retailer) are "nofollow noopener".
 */
export function relFor(kind: ResolvedLinkKind): string {
  return kind === "affiliate" ? "sponsored nofollow noopener" : "nofollow noopener";
}

export function resolveProductLink(p: Product, links: AffiliateLink[] = affiliateLinks): ResolvedProductLink | undefined {
  const aff = getApprovedLink(productLinkId(p), links);
  if (aff && aff.kind !== "stay") {
    return { kind: "affiliate", url: aff.url, network: aff.network, label: `See it at ${aff.network.replace(/ Associates$/i, "")}`, rel: relFor("affiliate") };
  }
  const manufacturer = p.productUrl ?? (/\.pdf(\?|#|$)/i.test(p.specSource.url) ? undefined : p.specSource.url);
  if (manufacturer) return { kind: "manufacturer", url: manufacturer, label: `See it on ${p.brand}'s website`, rel: relFor("manufacturer") };
  if (p.retailerUrl) return { kind: "retailer", url: p.retailerUrl, label: `See it at ${p.retailerName ?? "the retailer"}`, rel: relFor("retailer") };
  return undefined;
}
