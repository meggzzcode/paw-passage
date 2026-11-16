// Central brand + integration settings. Edit here; every page reads from this file.
export const site = {
  name: "Paw & Passage",
  tagline: "Better adventures, together.",
  description:
    "Dog-friendly travel guides, practical planning tools and carefully verified stays for people who travel with their dogs.",
  /** Public site origin, e.g. "https://pawandpassage.com". Required for sitemap.xml (returns 503 until set). */
  siteUrl: "",
  /** Business email for contact + property submissions. Leave "" until you have one: pages then say so honestly instead of showing a dead link. */
  contactEmail: "",
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXX". Leave "" to send nothing. */
  ga4MeasurementId: "",
  /**
   * External newsletter form (Kit or MailerLite). Paste the provider's form POST URL and the
   * name of its email field. Leave formAction "" and no public signup form is shown.
   */
  newsletter: {
    provider: "" as "" | "kit" | "mailerlite",
    formAction: "",
    emailFieldName: "email_address",
  },
  /** Sample stays render only in development / private preview, never in production builds. */
  showSampleStays: import.meta.env.DEV,
  /** Draft guides render (noindexed, labeled) only in development / private preview. */
  showDraftGuides: import.meta.env.DEV,
} as const;

export const nav = [
  { to: "/stays", label: "Stays" },
  { to: "/destinations", label: "Destinations" },
  { to: "/guides", label: "Guides" },
  { to: "/tools", label: "Tools" },
] as const;
