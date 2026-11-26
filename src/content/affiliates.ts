import { affiliates } from "virtual:content";
import { site } from "@/config/site";

// Affiliate links, managed in one place. A buy button is shown ONLY when the
// link exists AND approved is true. Never add a partner you are not approved with.
export interface AffiliateLink {
  id: string;
  network: string; // e.g. "Amazon Associates"
  url: string;
  approved: boolean;
  notes?: string;
}

/** Amazon's required sentence, exactly as in its Operating Agreement (Section 5). Do not reword it (for example "we"): the agreement allows only substantially similar statements it previously allowed. */
export const AMAZON_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
export function isAmazon(link: AffiliateLink) {
  return /amazon/i.test(link.network);
}

// The list lives in content/affiliates.yml so it can be edited in Pages CMS (no code).
/** The placeholder an Amazon link address uses for the tracking ID, e.g. https://www.amazon.com/dp/B000000000?tag={amazonTrackingId}. */
export const AMAZON_TAG_PLACEHOLDER = "{amazonTrackingId}";

/** Fills in the tracking ID. A link that needs the ID while none is set resolves to "" (so it is never shown untagged). */
export function resolveAffiliateUrl(url: string, tag: string = site.amazonTrackingId): string {
  if (!url.includes(AMAZON_TAG_PLACEHOLDER)) return url;
  return tag ? url.split(AMAZON_TAG_PLACEHOLDER).join(tag) : "";
}

export const affiliateLinks: AffiliateLink[] = affiliates.map((l) => ({
  ...l,
  url: resolveAffiliateUrl(l.url),
}));

/** A plain (non-affiliate) link whose address is an Amazon page must say Amazon, not "the maker's website". It carries no tag. */
export const isAmazonUrl = (url: string): boolean =>
  /^https?:\/\/([a-z0-9-]+\.)*amazon\.[a-z.]+\//i.test(url);
export function plainLinkLabel(url: string, brand: string): string {
  return isAmazonUrl(url) ? "See it on Amazon" : `See it on ${brand}'s website`;
}

export function getApprovedLink(
  id?: string,
  links: AffiliateLink[] = affiliateLinks,
): AffiliateLink | undefined {
  if (!id) return undefined;
  const link = links.find((l) => l.id === id);
  return link && link.approved && link.url ? link : undefined;
}
