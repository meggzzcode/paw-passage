import { affiliates } from "virtual:content";

// Affiliate / booking links, managed in one place. A booking button is shown ONLY when the
// link exists AND approved is true. Never add a partner you are not approved with.
export interface AffiliateLink {
  id: string;
  network: string; // e.g. "Vrbo (via CJ)", "Direct host"
  url: string;
  approved: boolean;
  notes?: string;
  /** "product" links (gear guides) vs "stay" links (booking buttons). Defaults to "stay". */
  kind?: "stay" | "product";
}

/** Amazon's required sentence, exactly as in its Operating Agreement (Section 5). Do not reword it (for example "we"): the agreement allows only substantially similar statements it previously allowed. */
export const AMAZON_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
export function isAmazon(link: AffiliateLink) {
  return /amazon/i.test(link.network);
}

// The list lives in content/affiliates.yml so it can be edited in Pages CMS (no code).
export const affiliateLinks: AffiliateLink[] = affiliates;

export function getApprovedLink(id?: string, links: AffiliateLink[] = affiliateLinks): AffiliateLink | undefined {
  if (!id) return undefined;
  const link = links.find((l) => l.id === id);
  return link && link.approved && link.url ? link : undefined;
}
