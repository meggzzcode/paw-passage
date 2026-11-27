// The ONE source of the approved brand copy (owner directive 2026-11-26). Pages, meta descriptions, the footer, printables
// and the guard tests read these strings; nothing else writes them out. Price and offer wording stay in site.ts and
// commercial.ts (`offer`, `ONE_TIME_LINE` ("One payment of <price>. Yours to keep."), `KEEP_LINE`).
//
// Rules: handwritten type (Caveat) only decorates these lines, never safety, payment or instructions. Library-size claims use
// LIBRARY_CLAIM_MIN and nothing else; src/test/brand-copy.test.ts checks it against the verified library.
/** The library holds at least this many published adventures (verified: library-stats full mode shows 117, of which 100 premium). */
export const LIBRARY_CLAIM_MIN = 100;
/** The same claim in words ("Over a hundred"). The test fails if this and LIBRARY_CLAIM_MIN drift apart. */
export const LIBRARY_CLAIM_WORDS = "Over a hundred";

export const BRAND = {
  /** Signature phrases. Use naturally, not on every page. */
  lifetime: "A lifetime of little adventures.",
  everyDog: "Because every dog deserves a little adventure.",
  collect: "Collect adventures, not just things.",
  yoursToKeep: "One payment. Yours to keep.",

  hero: {
    eyebrow: "Because every dog deserves a little adventure.",
    titleLead: "A passport full of",
    titleEm: "little adventures",
    titleTail: "for you and your dog.",
    support: `${LIBRARY_CLAIM_MIN}+ personalized ideas for more fun, more time together and more memories.`,
    primaryCta: "Find our first adventure",
    /** The home page's one primary action (starts the quiz directly). Other pages keep `primaryCta`. */
    primaryCtaFree: "Find our first adventure — free.",
    ctaNote: "Your first adventure is free.",
  },
  /** The two options a visitor chooses between (home invitation and /unlock). The paid label adds the price in commercial.ts. */
  freeOption: "Your first adventure — free.",
  fullOptionName: "The full Adventure Passport",
  testersHeading: "A little love from our early testers.",
  discoverHeadline: "Adventures picked for your dog. Memories made by you.",
  unlockHeadline: `One passport. ${LIBRARY_CLAIM_WORDS} adventures. Endless little memories.`,
  keepsakeHeadline: "Adventures for your dog. Keepsakes for you.",
  passportHeadline: "Collect adventures, not just things.",
  ourStory: "A lifetime of little adventures.",
  mysteryHeadline: "A little adventure awaits...",
  journalHeadline: "More than walks. More than fetch. More little adventures.",
  /** Rendered only while flags.gifting is true (it stays false until gifting is verified). */
  giftLine: "Give a lifetime of little adventures.",
} as const;

/** Every approved signature phrase, and the only places each may appear in public source (the guard test enforces it). */
export const SIGNATURE_PHRASES = [
  BRAND.lifetime,
  BRAND.everyDog,
  BRAND.collect,
  BRAND.yoursToKeep,
] as const;
