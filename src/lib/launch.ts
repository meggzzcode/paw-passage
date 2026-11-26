import { affiliateLinks } from "@/content/affiliates";

/** True once any affiliate link is switched to Approved. */
export const hasApprovedAffiliates = () => affiliateLinks.some((l) => l.approved && !!l.url);
