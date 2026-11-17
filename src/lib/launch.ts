import { visibleStays } from "@/content/stays";
import { affiliateLinks } from "@/content/affiliates";

/** True once at least one verified stay is published. Until then the site leads with guides and tools. */
export const hasStays = () => visibleStays().length > 0;
/** True once any affiliate link is switched to Approved. */
export const hasApprovedAffiliates = () => affiliateLinks.some((l) => l.approved && !!l.url);
