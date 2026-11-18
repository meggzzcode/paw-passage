// Helpers that answer: "which affiliate links does this article actually show?"
// The same answers drive the disclosure at the top of an article, the link tracking, and the build-time checks.
import { getApprovedLink, isAmazon, type AffiliateLink } from "./affiliates";
import { getProduct, type Product } from "./gear";

/** Inline affiliate links are written in an article as [words](aff:link-id). */
const INLINE = /\]\(aff:([a-z0-9-]+)\)/g;

export function inlineAffiliateIds(body: string): string[] {
  return [...new Set([...body.matchAll(INLINE)].map((m) => m[1]!))];
}

/** A product uses the affiliate link whose id equals its own id, unless it names a different one. */
export function productLinkId(p: { id: string; affiliateId?: string | undefined }): string {
  return p.affiliateId ?? p.id;
}

export interface AffiliateUsage {
  links: AffiliateLink[];
  count: number;
  anyAmazon: boolean;
}

/** The approved affiliate links an article will show (inline links and product picks). Unapproved links show nothing. */
export function affiliateUsage(guide: {
  body: string;
  gear?: { productId: string }[] | undefined;
}): AffiliateUsage {
  const ids = new Set<string>(inlineAffiliateIds(guide.body));
  for (const pick of guide.gear ?? []) {
    const product = getProduct(pick.productId);
    if (product) ids.add(productLinkId(product));
  }
  const links = [...ids].map((id) => getApprovedLink(id)).filter((l): l is AffiliateLink => !!l);
  return { links, count: links.length, anyAmazon: links.some(isAmazon) };
}

export type ProductButton =
  | { kind: "affiliate"; url: string; network: string; label: string }
  | { kind: "direct"; url: string; label: string };

/**
 * The button under a product pick. An APPROVED affiliate link wins; until then the button goes straight to the
 * maker's own page (no commission, no "sponsored" label needed). Nothing is shown if there is no web page to send to.
 */
export function productButton(p: Product): ProductButton | undefined {
  const aff = getApprovedLink(productLinkId(p));
  if (aff)
    return {
      kind: "affiliate",
      url: aff.url,
      network: aff.network,
      label: `See it at ${aff.network.replace(/ Associates$/i, "")}`,
    };
  const direct =
    p.productUrl ?? (/\.pdf(\?|#|$)/i.test(p.specSource.url) ? undefined : p.specSource.url);
  return direct
    ? { kind: "direct", url: direct, label: `See it on ${p.brand}'s website` }
    : undefined;
}
