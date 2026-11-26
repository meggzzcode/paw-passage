import { settings, showDrafts } from "virtual:content";

// Central brand + integration settings. The business details (domain, email, analytics ID) live in content/settings.yml so an owner can change them in Pages CMS without touching code.
export const site = {
  name: "Paws & Passage",
  tagline: "The Adventure Passport: a lifetime of little adventures with your dog",
  description:
    "The Adventure Passport is a collectible, self-paced set of little adventures to share with your dog. Free to try with no account, with a one-time purchase to unlock the full library.",
  /** Public site origin, e.g. "https://pawsandpassage.com". Required for sitemap.xml (returns 503 until set). */
  siteUrl: settings.siteUrl,
  /** Business email for contact and support. Leave "" until you have one: pages then say so honestly instead of showing a dead link. */
  contactEmail: settings.contactEmail,
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXX". Leave "" to send nothing. */
  ga4MeasurementId: settings.ga4MeasurementId,
  /** Amazon Associates tracking ID (store ID), e.g. "yourname-20". Amazon links written with {amazonTrackingId} in their address use it. Leave "" and those links stay hidden. */
  amazonTrackingId: settings.amazonTrackingId,
  /** Impact site-ownership verification value (seller's account today). Leave "" and no tag is sent. */
  impactSiteVerification: settings.impactSiteVerification,
  /** Pinterest profile address. Leave "" and no Pinterest icon is shown. */
  pinterestUrl: settings.pinterestUrl,
  /** Draft guides render (noindexed, labeled) only in development / private preview builds (SHOW_DRAFTS=true). */
  showDraftGuides: import.meta.env.DEV || showDrafts,
};
