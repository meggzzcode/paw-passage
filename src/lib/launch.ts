import { visibleStays } from "@/content/stays";
import { visiblePlaces } from "@/content/places";
import { affiliateLinks } from "@/content/affiliates";

/** True once any stay (verified or labelled unverified) is listed: the Stays menu item and page appear. */
export const hasStays = () => visibleStays().length > 0;
/** True once at least one VERIFIED stay is published. Until then the homepage leads with guides and tools, and the Stays pages stay out of search and the sitemap. */
export const hasVerifiedStays = () => visibleStays().some((s) => s.status === "verified");
/** True once at least one dog-rules place is verified and public. Until then the Dog rules page is hidden from the menu, footer and sitemap. */
export const hasPlaces = () => visiblePlaces({ includeUnverified: false }).length > 0;
/** True once any affiliate link is switched to Approved. */
export const hasApprovedAffiliates = () => affiliateLinks.some((l) => l.approved && !!l.url);
