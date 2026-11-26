import { settings, showDrafts } from "virtual:content";
import { BRAND } from "@/config/brand";

// Central brand + integration settings. The business details (domain, email, analytics ID) live in content/settings.yml so an owner can change them in Pages CMS without touching code.
export const site = {
  name: "Paws & Passage",
  tagline: `The Adventure Passport: ${BRAND.lifetime.replace(".", "").toLowerCase()} with your dog`,
  description:
    "The Adventure Passport is a collectible, self-paced set of little adventures to share with your dog. Free to try with no account: tell us about your dog and get one adventure picked for them. A one-time purchase unlocks the full library.",
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

/**
 * The public offer. The price must match the Gumroad listing before launch (see docs/COWORK-HANDOFF.md).
 * No other price, discount or "was" price appears anywhere on the site. Partner discounts are Gumroad discount codes
 * applied at checkout; the app never shows a code.
 */
export const offer = {
  price: "$19.99",
  pricing: "one-time purchase, no subscription",
} as const;
