import { settings, showDrafts } from "virtual:content";

// Central brand + integration settings. The business details (domain, email, analytics ID) live in content/settings.yml so an owner can change them in Pages CMS without touching code.
export const site = {
  name: "Paws & Passage",
  tagline: "Dog-Friendly Stays, Travel Guides & Gear",
  description:
    "Dog-friendly stays, travel guides, planning tools and researched gear for people who travel with their dogs. Stay details come from public listings and unknown details are marked Not confirmed.",
  /** Public site origin, e.g. "https://pawsandpassage.com". Required for sitemap.xml (returns 503 until set). */
  siteUrl: settings.siteUrl,
  /** Business email for contact + property submissions. Leave "" until you have one: pages then say so honestly instead of showing a dead link. */
  contactEmail: settings.contactEmail,
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXX". Leave "" to send nothing. */
  ga4MeasurementId: settings.ga4MeasurementId,
  /** Amazon Associates tracking ID (store ID), e.g. "yourname-20". Amazon links written with {amazonTrackingId} in their address use it. Leave "" and those links stay hidden. */
  amazonTrackingId: settings.amazonTrackingId,
  /** Impact site-ownership verification value (seller's account today). Leave "" and no tag is sent. */
  impactSiteVerification: settings.impactSiteVerification,
  /** Pinterest profile address. Leave "" and no Pinterest icon is shown. */
  pinterestUrl: settings.pinterestUrl,
  /** Stay22 account ID. Leave "" and the Stay22 map is not shown. */
  stay22AccountId: settings.stay22AccountId,
  /** Stay directory mode: "affiliate-only" (default) lists a stay only while it has an approved affiliate link; "public-sources" lists stays with a plain public source link instead. See docs/BUYER_AFFILIATE_TRANSITION.md. */
  stayDirectoryMode: settings.stayDirectoryMode,
  /** Sample stays render only in development / private preview, never in production builds. */
  showSampleStays: import.meta.env.DEV,
  /** Draft guides render (noindexed, labeled) only in development / private preview builds (SHOW_DRAFTS=true). */
  showDraftGuides: import.meta.env.DEV || showDrafts,
};

export const nav = [
  { to: "/stays", label: "Stays" },
  { to: "/destinations", label: "Destinations" },
  { to: "/dog-rules", label: "Dog rules" },
  { to: "/guides", label: "Guides" },
  { to: "/tools", label: "Tools" },
] as const;
