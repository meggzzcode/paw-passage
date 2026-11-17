import { visibleStays } from "@/content/stays";
import { visiblePlaces } from "@/content/places";
import { affiliateLinks } from "@/content/affiliates";

/** True once at least one verified stay is published. Until then the site leads with guides and tools. */
export const hasStays = () => visibleStays().length > 0;
/** True once at least one dog-rules place is verified and public. Until then the Dog rules page is hidden from the menu, footer and sitemap. */
export const hasPlaces = () => visiblePlaces({ includeUnverified: false }).length > 0;
/** True once any affiliate link is switched to Approved. */
export const hasApprovedAffiliates = () => affiliateLinks.some((l) => l.approved && !!l.url);
