// The ONE place for commercial configuration: price, feature flags, homepage promo copy, seasonal collection mapping,
// how featured adventures are chosen, and how verified counts are worded. Pages import from here (or from site.ts for
// the offer itself); a test fails if a price or a hard-coded library count appears anywhere else in the source.
//
// Rules: nothing here is premium text, and nothing here names a premium adventure. Counts are never written down:
// they come from the previews API (published total and collections) or from the server's match aggregates, and
// when those are unavailable the wording below says so plainly instead of inventing a number.
import { offer } from "./site";

/** The price. Defined once, in `offer` in src/config/site.ts (it must equal the checkout listing). */
export const price = offer.price;
export const pricing = offer.pricing;
/** The one-line promise repeated near purchase prompts. */
export const ONE_PAYMENT_LINE = "One-time purchase, no subscription, no account.";
/** The pay-once promise, in one sentence. Pages use this instead of retyping it. */
export const ONE_TIME_LINE = `One payment of ${price}. Yours to keep.`;
/**
 * What "pay once" means in practice. It does not promise unlimited future content or that the service never changes:
 * refunds and revocation still follow the refund policy, and any adventures we add later are a bonus, not a promise.
 */
export const KEEP_LINE = "No subscription. No renewals. Your Passport does not expire.";

/**
 * Feature flags for what the pages may MENTION. A flag is false until the feature is shipped and verified, so the
 * site never advertises something that is not there. Flipping a flag changes copy only; it does not build a feature.
 */
export const flags = {
  /** Push reminders in My Passport. PAUSED by the owner (2026-11-26) in favor of email nudges; calendar export stays. */
  notifications: false,
  /** Trip itineraries. Shipped. */
  itineraries: true,
  /** Printable keepsakes and sheets. Shipped. */
  printables: true,
  /** The public "selected previews" showcase (the /previews page and the preview cards). */
  previewsShowcase: true,
  /**
   * Gifting through Gumroad's native "Give as a gift" on the SAME product and price (no custom gift platform).
   * FALSE until the owner has verified it end to end (docs/COWORK-HANDOFF.md, CW-PAY-7): the recipient receives a
   * usable license key, activation attaches to the RECIPIENT, and a refund revokes it. While false, nothing on the
   * site mentions gifting.
   */
  gifting: false,
} as const;

/** The Gumroad help article that describes the native gift option (read it before flipping `flags.gifting`). */
export const GIFT_HELP_URL =
  "https://gumroad.com/help/article/213-how-do-i-give-a-product-as-a-gift";
/** Secondary action label on /unlock, shown only when `flags.gifting` is true. */
export const GIFT_CTA = "Gift the Adventure Passport";

/**
 * The refund terms in one place, shown next to the buy button BEFORE payment. It summarizes src/routes/refund-policy.tsx
 * and promises nothing it does not say: no refund window is stated here because the checkout page shows the terms that
 * apply to the purchase (and wins if they differ). A test keeps this in step with the policy page.
 */
export const REFUND_SUMMARY: readonly string[] = [
  "The checkout page shows the refund terms that apply before you pay, and it wins if it differs from our policy page.",
  "To ask for a refund, contact us with the email you bought with and the date. It is issued through our checkout provider, to the way you paid.",
  "When a purchase is refunded, full access is switched off, within about a day. The free Passport stays, and your progress stays yours.",
];

/**
 * How many selected previews the homepage shows, and how they are chosen: the API serves only adventures flagged
 * `showcase: true` in the PRIVATE library data, so the choice is made there. This config never lists adventure ids
 * and never names a premium card.
 */
export const featured = {
  method: "showcase-flag-in-private-data",
  homeCards: 3,
} as const;

/** Homepage promo copy. Keys, not layout: the page reads these so wording lives in one place. */
export const homePromo = {
  eyebrow: "Digital adventures for you and your dog",
  titleLead: "Life is better with a little",
  titleEm: "adventure",
  lede: "Five-minute games at home, doggy dates, weekend adventures. A personalized library of little adventures for you and your dog, with a free first adventure picked just for them. Pay once, and the full Passport is yours to keep.",
  points: [
    "One free adventure to start",
    "Personalized to your dog",
    "One payment, not a subscription",
    "No account",
  ],
  primaryCta: "Find Our First Adventure — Free",
  secondaryCta: "Explore the Adventure Collection",
  demo: {
    eyebrow: "See it in action",
    title: "From first look to a keepsake style, in five steps",
    intro:
      "These are real screens from the free introductory adventure, on a sample dog. Nothing here is a premium adventure.",
  },
} as const;

/** Honest wording for the library size. `total`/`collections` must come from the previews API, never from here. */
export const LIBRARY_FALLBACK = "A much larger library of adventures, for every kind of dog.";
export function libraryLine(
  total: number | null | undefined,
  collections: number | null | undefined,
) {
  if (typeof total !== "number" || !Number.isFinite(total) || total < 1) return LIBRARY_FALLBACK;
  const c = typeof collections === "number" && collections > 0 ? collections : 0;
  return `${total} adventures${c ? ` across ${c} ${c === 1 ? "collection" : "collections"}` : ""}, for every kind of dog.`;
}

/**
 * Ideas for the current month, by calendar month (1 = January). Hemisphere-agnostic on purpose: only collections that
 * do not depend on the weather or the season are mapped, and the copy names the month, never "summer" or "winter".
 * Every slug must exist in content/collections.yml (a test checks).
 */
export const SEASONAL_COLLECTIONS: Readonly<Record<number, readonly string[]>> = {
  1: ["five-minute-wonders", "home-sweet-home", "creative-companions"],
  2: ["doggy-date-club", "creative-companions", "taste-and-treat"],
  3: ["the-curious-explorer", "city-explorers", "seasons-together"],
  4: ["seasons-together", "the-curious-explorer", "city-explorers"],
  5: ["doggy-date-club", "city-explorers", "the-curious-explorer"],
  6: ["seasons-together", "five-minute-wonders", "taste-and-treat"],
  7: ["seasons-together", "taste-and-treat", "five-minute-wonders"],
  8: ["seasons-together", "city-explorers", "the-playful-pup"],
  9: ["seasons-together", "the-curious-explorer", "creative-companions"],
  10: ["holidays-and-celebrations", "seasons-together", "doggy-date-club"],
  11: ["holidays-and-celebrations", "home-sweet-home", "taste-and-treat"],
  12: ["holidays-and-celebrations", "home-sweet-home", "five-minute-wonders"],
};
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** The mapped collection slugs for a month (1-12). Anything else gives an empty list. */
export function seasonalFor(month: number): readonly string[] {
  return SEASONAL_COLLECTIONS[month] ?? [];
}

/** The five-step product demonstration shown on the homepage. Images are real screens of the free adventure. */
export type DemoStep = {
  id: "discover" | "reveal" | "experience" | "collect" | "keepsake";
  label: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};
export const DEMO_STEPS: readonly DemoStep[] = [
  {
    id: "discover",
    label: "Discover",
    title: "Discover an adventure picked for your dog",
    body: "Answer a few taps and see one pick with its time, cost, setting and effort. Not the steps yet. Ask for another as often as you like.",
    src: "/demo/1-discover.webp",
    alt: "A free adventure picked for a sample dog: a mystery title with its time, cost, setting and effort, what it needs, and a short reason it was chosen.",
    width: 390,
    height: 700,
  },
  {
    id: "reveal",
    label: "Reveal",
    title: "Scratch or tap to reveal",
    body: "When you say yes, the card is revealed with a scratch or a tap. Whichever you prefer.",
    src: "/demo/2-reveal.webp",
    alt: "The same card with a golden panel that says Scratch or tap to reveal, and a button to see another adventure instead.",
    width: 390,
    height: 700,
  },
  {
    id: "experience",
    label: "Experience",
    title: "Go and do it together",
    body: "Clear, gentle instructions, with signs to watch for. Put the phone away and stop whenever your dog wants to.",
    src: "/demo/3-experience.webp",
    alt: "The revealed free adventure with its twist, what you will need, practical details and numbered instructions.",
    width: 390,
    height: 700,
  },
  {
    id: "collect",
    label: "Collect",
    title: "Collect a stamp",
    body: "Finish whenever you like and a stamp lands in your passport. No streaks, no scores.",
    src: "/demo/4-collect.webp",
    alt: "A passport page showing three illustrated stamps earned from finishing the first adventure.",
    width: 390,
    height: 700,
  },
  {
    id: "keepsake",
    label: "Keepsake",
    title: "See your keepsake style",
    body: "Finishing shows the matching keepsake style as an example. Making your own with your dog's photo is part of the full Passport, and the photo is never uploaded.",
    src: "/demo/5-keepsake.webp",
    alt: "An example keepsake with a sample illustrated dog and a cover headline.",
    width: 390,
    height: 700,
  },
] as const;

/** The trust points repeated on the homepage, /unlock and /faq. Plain statements of what the product does today. */
export const TRUST_POINTS: readonly { id: string; text: string }[] = [
  { id: "digital", text: "Digital: nothing ships, and you use it in your browser" },
  { id: "one-time", text: `One payment of ${price}, no subscription. Yours to keep.` },
  { id: "no-extra", text: "Many adventures cost nothing extra to do" },
  { id: "dogs", text: "Picks adapt to your dog and to you" },
  { id: "photos", text: "Photos stay on your device, always" },
  { id: "recovery", text: "Lost access? Restore it with your purchase code" },
] as const;
