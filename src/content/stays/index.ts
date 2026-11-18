import { stays as contentStays } from "virtual:content";
import { site } from "@/config/site";
import { getApprovedLink } from "@/content/affiliates";
import { STAYS_REQUIRE_AFFILIATE_LINK } from "@/content/publish-rule";
import { sampleStays } from "./samples";
import { verifiedStays } from "./verified";
import type { Stay } from "./types";

export type { Stay } from "./types";

/** The Vrbo listing id in a source URL (https://www.vrbo.com/<id>), if there is one. */
export function vrboListingId(url: string): string | undefined {
  return /^https:\/\/(www\.)?vrbo\.com\/(\d+)/.exec(url)?.[2];
}

/**
 * The affiliate entry a stay uses: the one named in its file, otherwise vrbo-<listing id> derived from its Vrbo source
 * address. The owner therefore only has to add the deeplink to content/affiliates.yml (Pages CMS "Affiliate links",
 * id vrbo-<listing id>, approved) and the stay goes live; nothing in the stay file needs editing.
 */
export function stayAffiliateId(s: Pick<Stay, "affiliateId" | "sourceUrl">): string | undefined {
  if (s.affiliateId) return s.affiliateId;
  const id = vrboListingId(s.sourceUrl);
  return id ? `vrbo-${id}` : undefined;
}

/** True when the stay has an approved affiliate link, so a visitor who books through it earns commission. */
export const stayEarns = (s: Pick<Stay, "affiliateId" | "sourceUrl">): boolean =>
  !!getApprovedLink(stayAffiliateId(s));

/** Every stay file that passed validation, listed or not (for health checks and tests). Each carries its derived affiliate id. */
export function allStayRecords(): Stay[] {
  return [...verifiedStays, ...(contentStays as Stay[])].map((s) => {
    const id = stayAffiliateId(s);
    return id ? { ...s, affiliateId: id } : s;
  });
}

/** Stays that are written up but not listed because they would earn nothing yet (no approved affiliate link). */
export const stayAwaitingAffiliateLink = () => allStayRecords().filter((s) => !stayEarns(s));

/**
 * Stays visible in this build: verified first, then unverified (labelled on the page); plus samples in dev/preview.
 * Owner decision 2026-11-18: a stay is listed only when it earns (an approved affiliate link exists for it).
 */
export function visibleStays(opts: { includeSamples?: boolean } = {}): Stay[] {
  const includeSamples = opts.includeSamples ?? site.showSampleStays;
  const records = allStayRecords();
  const all = STAYS_REQUIRE_AFFILIATE_LINK ? records.filter(stayEarns) : records;
  const seen = new Set<string>();
  for (const s of [...records, ...sampleStays]) {
    if (seen.has(s.slug)) throw new Error(`Two stays share the web address "${s.slug}".`);
    seen.add(s.slug);
  }
  const verified = all.filter((s) => s.status === "verified");
  const unverified = all.filter((s) => s.status === "unverified");
  // Samples are only ever shown in development or private preview builds.
  return includeSamples
    ? [...verified, ...unverified, ...sampleStays]
    : [...verified, ...unverified];
}

/** Verified stays only: used for the homepage, indexing and the sitemap. */
export const verifiedOnly = (list: Stay[]) => list.filter((s) => s.status === "verified");

export function getStay(slug: string, opts: { includeSamples?: boolean } = {}): Stay | undefined {
  return visibleStays(opts).find((s) => s.slug === slug);
}
