// Affiliate / booking links, managed in one place. A booking button is shown ONLY when the
// link exists AND approved is true. Never add a partner you are not approved with.
export interface AffiliateLink {
  id: string;
  network: string; // e.g. "Vrbo (via CJ)", "Direct host"
  url: string;
  approved: boolean;
  notes?: string;
}

export const affiliateLinks: AffiliateLink[] = [];

export function getApprovedLink(id?: string, links: AffiliateLink[] = affiliateLinks): AffiliateLink | undefined {
  if (!id) return undefined;
  const link = links.find((l) => l.id === id);
  return link && link.approved && link.url ? link : undefined;
}
