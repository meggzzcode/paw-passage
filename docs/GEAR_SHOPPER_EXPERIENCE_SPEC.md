# Gear shopper experience: design spec and self-scoring

> Note (2026-11-24): the 95-URL figure and the Vrbo-label status here are older; current counts are in `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. <!-- SUPERSEDED-NOTE -->


Date: 2026-11-24. Repository HEAD `13a7ce1`. **Not deployed:** Netlify builds are stopped, so everything here describes the repository and the final build served locally on port 4199, not the live site.

Companion files: `docs/GEAR_REDESIGN_BRIEF.md` (the owner's brief), `docs/GEAR_REDESIGN_IMPLEMENTATION.md` (component contract, how curation works, how to add a product, how to replace affiliate IDs), `docs/review/FINAL-GEAR-REVIEW.md` (the independent review), `docs/buyer/FINAL_QA_CRAWL_2026-11-24.md` (the crawl). Labels: VERIFIED (checked on the HEAD build on 2026-11-24 or in a named file), REVIEW (an independent reviewer's finding on an earlier build), UNVERIFIED (not checked).

## 1. Identity

Gear is a **photo-free editorial shop** for dog travel: a calm, magazine-style buying guide, not a marketplace. It earns through Amazon affiliate links, and every product earns its place by a stated reason that comes from the product's own record. It never shows prices, ratings, review counts, stock or popularity labels, and never says "best seller", "top rated", "customer favorite", "expert tested" or "award-winning".

The look comes from type, tonal colour panels, restrained original vector motifs, Lucide line icons, spec chips and purpose labels instead of product photographs. VERIFIED: 0 `<img>` elements on `/gear`, `/gear/car-safety` and `/gear?trip=cabin-stay`; the decorative icon tiles do not read as missing photos (REVIEW).

The voice is the site's: warm, specific and practical, with one concise research note per page and a link to the methodology. The owner's decisions override anything older in the code:

- **No per-card affiliate label.** One notice sits at the top of every page that carries an affiliate link, and Amazon's exact sentence, "As an Amazon Associate I earn from qualifying purchases.", appears wherever an Amazon link appears. VERIFIED on `/gear`, a trip view and a category page: the sentence appears once; 0 matches for "Affiliate link ·" and "Check the current price" on any guide or Gear page. (Stay pages still carry a short label on their Vrbo booking buttons; see section 8.)
- **Buy button first, then "Details and specs".** One primary button per card, then a quiet link.
- **Amazon-first products.** The button goes to the approved Amazon link when one exists, then the manufacturer page, then a plain retailer link, then no button (an "Information only" state). The Amazon listing is the working link for every active product at HEAD (65 distinct Amazon URLs across the 11 category pages); a maker page is shown in the details panel where one was found.

## 2. Tokens

Gear reuses the site's tokens in `src/styles.css`; it adds no second palette. All values are OKLCH.

| Token | Value | Used for |
|---|---|---|
| `--ivory` / `--background` | `oklch(0.977 0.008 90)` | page ground |
| `--card` | `oklch(0.993 0.004 90)` | card surface |
| `--foreground` | `oklch(0.29 0.015 170)` (dark green-grey) | text |
| `--primary` | `oklch(0.39 0.05 172)` (dark green) | links, hover borders, hero |
| `--secondary` | `oklch(0.93 0.025 150)` | quiet panels |
| `--muted` / `--muted-foreground` | `oklch(0.945 0.012 90)` / `oklch(0.47 0.015 170)` | chips, reasons, secondary text |
| `--sage` | `oklch(0.83 0.045 150)` | sage tone panels |
| `--sky` | `oklch(0.91 0.03 230)` | light accent |
| `--terracotta` / `--terracotta-button` | `oklch(0.68 0.11 45)` / `oklch(0.53 0.11 45)` | buy button, caution icon |
| `--border` | existing token | fine card borders |
| `--radius` | `0.5rem` (cards use `--radius-xl`, buttons are pill-shaped) | shape |

Tone panels: three tones (sage, sand, terracotta) are assigned per category in `SPEC_CARD_STYLE` (`src/components/site/ProductSpecCard.tsx`) and per trip in `TRIP_STYLE` (`GearHomeSections.tsx`); each tone has a restrained SVG motif (arcs, dot grid, stripes) at 20% opacity. Motion is limited to a border and shadow shift on hover or focus, a 1px arrow nudge on the button, and a chevron rotation on the details panel; `prefers-reduced-motion` turns all of it off (`gear-card.css`).

Contrast was judged visually and not measured (UNVERIFIED). The white-on-terracotta button (`--terracotta-button` against `--terracotta-foreground`) is the one colour pair a contrast check should start with.

## 3. Typography

- Headlines: Fraunces (variable, self-hosted WOFF2), `--font-display`. Card names are Fraunces at 1.3 rem (1.55 rem on the featured card), weight 500, `text-wrap: balance`.
- UI and body: DM Sans (variable, self-hosted), `--font-sans`.
- Labels (purpose label, brand, section eyebrows): 0.72 rem, weight 600, uppercase, 0.12 to 0.13 em letter spacing.
- Reason line 0.95 rem at 1.5 line height; chips 0.78 rem; details panel 0.875 rem.
- Hero: eyebrow "DOG TRAVEL ESSENTIALS", H1 "Good gear. Better getaways." (4xl, 5xl from 768 px).

## 4. Structure

### /gear (hub)

VERIFIED section order on the build: hero (H1, supporting sentence, two buttons "Find gear for your trip" and "Browse all categories") then the affiliate notice; **Where are you headed?** (five trip cards: road trip, cabin stay, beach and lake, winter, hiking); **A few good places to start** (up to six featured products, deterministic); **Find exactly what you need** (all 11 category tiles with live product counts); **Every dog travels differently** (large, senior, escape artists, multi-dog families); **Plan the trip, not just the packing** (best guides plus "Pack your dog's bag", the packing tool).

A trip tile goes to `/gear?trip=<slug>#trip-collection`: a server-rendered collection of real products in ordered groups (for example Containment, Comfort, Cleanup for the cabin). It works without JavaScript and with browser history. The canonical stays `/gear`, the trip view is `noindex, nofollow`, and unknown trip values fall back to the hub. A trip needs at least 3 shoppable products (`MIN_COLLECTION`) or it is hidden; the Featured section drops any product already in the collection and is hidden if fewer than 3 remain (`src/test/gear-trip-dedupe.test.tsx`). VERIFIED on the build: cards per trip view 13, 9, 11, 9 and 11 (road trip, cabin stay, beach and lake, winter, hiking), and no Amazon URL appears twice on any of them.

### /gear/<category> (11 pages)

Order: breadcrumb and compact hero (icon, H1, two-sentence intro, product count, jump chips); the affiliate notice; for the three safety-critical categories (car safety, ramps and steps, pens and gates) a visible "Know before you choose" note; the primary products; "Also useful for this category" (cross-listed products as compact rows); "How to choose" (one line plus a native details element, open by default and holding the remaining check on safety categories); at most three related guides as plain rows; one "How we pick" with the methodology link. Categories: car-safety, car-interior, ramps-and-steps, feeding-and-hydration, pens-and-gates, comfort-and-cooling, water-and-beach, trail-and-hiking, cold-weather, safety-id-first-aid, rental-cleanup. A category page exists only while it has at least 3 active products (`MIN_LIVE`); an empty or unknown category returns 404; old category addresses 301 to a live one.

Product counts on the HEAD build (primary category, cross-listings shown as compact rows): car-safety 10, car-interior 4, ramps-and-steps 5, feeding-and-hydration 9, pens-and-gates 6 (+2), comfort-and-cooling 7, water-and-beach 3 (+2), trail-and-hiking 3 (+4), cold-weather 3, safety-id-first-aid 9, rental-cleanup 6 (+3); the hub counts each page's total (10, 4, 5, 9, 8, 7, 5, 7, 3, 9, 9). 92 product records, 65 active, each active product with an approved Amazon link.

## 5. Card anatomy

One shared component, `GearProductCard` (`src/components/site/GearProductCard.tsx`), in three variants (featured, standard, compact), also used inside guides through the pick directive, so a guide card and a Gear card are the same card.

1. Graphic panel (photo-free): purpose label ("best for", at most 34 characters, from the guide pick or the category job), a category-tone background, a Lucide icon chosen by category or product type, a decorative motif (`aria-hidden`).
2. Brand (small caps) and product name (heading level 2 to 4 by context).
3. One or two sentences on the problem it solves (`summary`).
4. At most three fact chips (`cardSpecs`, 28 characters each, taken from the record).
5. One "Check:" line where the record supports one (for example restraints: the maker's securing instructions).
6. One primary button, 44 px tall (183 x 44 at 320 px, REVIEW): "See it at Amazon" (wording follows the destination: "See it on <Maker>'s website" or "See it at <Retailer>"); an "Information only" line when there is no valid link.
7. A quiet "Details and specs" link to `/gear/<category>#<product-id>` (hidden on the category page itself).
8. A native details element "Specs, fit & sources": full specs, what the maker says versus what an independent tester says, extra watch-outs, source links with the read date, related guides.

Never on a card: price, rating, review count, stock, a per-card affiliate label, a "Check the current price" line, or a repeated "sizes change" note (once per page). Safety qualifications that could mislead if hidden stay outside the collapsed panel.

Link precedence lives in one place, `src/content/gear-links.ts`: approved affiliate, then manufacturer, then plain retailer, then no button. Affiliate links carry `rel="sponsored nofollow noopener"`; plain links carry `nofollow noopener`. `trackProductClick()` events are preserved.

## 6. Responsive behaviour and accessibility

- Breakpoints: one column below 768 px, two columns from 768 px, featured card with the panel beside the text on wide screens. Compact rows wrap their button below 14 rem.
- QA widths: 320, 375, 390, 430, 768, 1024 and 1440 px. VERIFIED (QA crawl at 390 and 1280, 200 page loads): no horizontal overflow on any of the 100 URLs. REVIEW (Playwright at 320, 390, 768 and 1440 on seven pages): no overflow, no images, buttons 44 px. Trip pages are very tall on a phone (16,000 to 17,000 px at 320, REVIEW).
- Semantics: one H1 per page (VERIFIED on every sitemap URL), ordered headings, cards as `<article>` inside list items, native `<details>`/`<summary>` for the expander (Enter opens it, Space toggles, 2 px focus outline, 44 px summary, REVIEW), decorative icons `aria-hidden`, no hover-only content, no colour-only meaning.
- Hash links (`#<product-id>`): `GearHashTarget` opens the card's details, scrolls it into view and outlines it for 2.5 s; without JavaScript the anchor still scrolls.
- Server rendering: all content, including trip collections, renders on the server.
- UNVERIFIED: a keyboard-only walk on a real device, a screen-reader pass (VoiceOver on macOS or iOS), Safari on iPhone, contrast ratios, tap targets on a real phone. These are in `docs/COWORK_FINAL_FLIP_BROWSER_BRIEF.md` for a browser session.

## 7. Curation

One catalog, `content/products.yml`; `src/content/gear-hub.ts` holds only explicit ids: `tripCollections` (ordered groups per trip), `featuredProductIds` (the hub's "good places to start", at most 6), `planGuideSlugs`, and the `shopByTrip` and `shopByDog` shortcuts. At render time any id that is unknown, inactive or without a link is dropped (`isShoppable`); fewer products are shown rather than padding. Tests (`gear-curation`, `gear-trip-dedupe`, `gear-category-page`, `gear-product-card`, `gear-products`) fail on missing, inactive or link-less ids, empty collections, duplicate cards, non-deterministic order and category counts that do not match. A product enters only through a record with a source, a read date and a reason; the Cowork 2026-11-24 Amazon checks decide which records are active. The Sleepypod Clickit Sport was retired (`docs/editorial/PASSG-SLEEPYPOD-RETIREMENT.md`): 0 links and 0 slug in the HTML.

## 8. Affiliate behaviour and the owner decisions

| Decision | State at HEAD |
|---|---|
| No per-card label; one top notice | VERIFIED on guides and Gear. **Exception:** the Vrbo booking buttons on stay pages still carry "Affiliate link · We may earn a commission if you book, at no extra cost to you." (23 of 23 indexable stay pages), and `/affiliate-disclosure` still says every buy or booking button carries its own label. Code (`src/lib/disclosure.ts`, the disclosure route) needs an owner decision |
| Buy button first, then Details and specs | VERIFIED on every card (QA crawl: 93 guide cards, every Gear card) |
| Amazon-first | VERIFIED: 65 active products, 65 distinct Amazon URLs on Gear pages; tag `pawspassage-20` comes from `content/settings.yml` (`amazonTrackingId`); an empty value hides all Amazon links and the Amazon sentence |
| `sponsored` on every buy link | VERIFIED: 0 tagged Amazon links without `sponsored` on the 95 pages |
| Untagged Amazon links | 14 links on 10 ASINs across 8 pages are citation "Source" or "Amazon listing as read" links, untagged; not buy buttons |
| Amazon sentence wherever an Amazon link appears | VERIFIED (QA crawl: all pages with a tagged Amazon link) |
| No prices, ratings, stock, best-seller wording | VERIFIED by DOM check in the Gear review and by tests |

## 9. Self-scoring on the ten criteria

The owner's target was 9 overall with no criterion under 8. The independent Gear review (`docs/review/FINAL-GEAR-REVIEW.md`) scored an earlier build **7.7 average** (7 to 8 on every criterion). Several of its defects were fixed afterwards; others were not. The scores below are mine, after the fixes, and each says what is evidence and what is not. They are **not** an independent score and no user testing was done.

| # | Criterion | Review score (earlier build) | My score now | Evidence and what is unverified |
|---|---|---:|---:|---|
| 1 | First impression and brand polish | 8 | 8 | VERIFIED: hero, notice directly below, shared type and palette; REVIEW found the hero polished. Trip views still show the generic H1 for every trip (review defect 1, unchanged on the build) |
| 2 | Photo-free visual design | 7 | 7 | VERIFIED 0 images. REVIEW: repeated identical banners per page start to look templated; unchanged |
| 3 | Finding relevant products | 7 | 8 | Trip tiles, 11 category tiles, dog tiles, 5 curated trip views; the duplicate-product defect is fixed and verified (0 repeated URLs on every trip view). The trip heading does not change per trip, and there is no side-by-side or filter (rejected as a feature) |
| 4 | Card readability | 8 | 8 | Purpose before specs, at most 3 chips, warning visible; two similar "details" labels remain (review defect 4, unchanged) |
| 5 | CTA clarity | 8 | 8 | One primary "See it at Amazon" matching an Amazon destination, buy button first (VERIFIED); the secondary "Details and specs" link is still easy to confuse with "Specs, fit & sources" |
| 6 | Mobile (320 / 390) | 8 | 8 | No overflow (VERIFIED at 390 and 1280; REVIEW at 320); 44 px buttons; 36 to 39 px chips and inline links not re-measured; no real-device check |
| 7 | Trust and presentation | 8 | 8 | One notice, the Amazon sentence once, no prices or ratings, maker-versus-independent claims stated on the cards (VERIFIED); stay pages still show per-button labels and the disclosure page says all buttons do (section 8) |
| 8 | Accessibility basics | 7 | 7 | VERIFIED one H1 per page, ordered headings, native details. UNVERIFIED: contrast ratios, keyboard walk-through and screen reader on real devices. Not scored higher without that evidence |
| 9 | Performance and SEO preservation | 8 | 8 | VERIFIED: 0 images; HTML 67 to 106 KB per page on the build; titles of 60 characters or fewer and 120 to 160 character descriptions on all 11 category pages and the hub (length checked; uniqueness not separately checked); canonical to `/gear` on trip views; URLs, 301s and 404 rules preserved. REVIEW: 1.4 MB total transfer including Google Analytics; three JS bundles of 190 to 350 KB |
| 10 | Maintainability | 8 | 8 | Small components (34 to 307 lines), data-driven `gear-hub.ts`, tests that fail on bad ids; adding a product is a record plus an affiliate entry (`docs/GEAR_REDESIGN_IMPLEMENTATION.md`) |
| | **Average** | **7.7** | **7.7** | Below the owner's 9 target and below 8 on two criteria; I did not round up |

The honest summary: the section looks finished, is consistent with the owner's decisions on guides and Gear, and has no known broken behaviour, but it is a solid 7 to 8 and not a 9. The things that would move it are not code of high risk: a per-trip heading, one differentiator line per ramp, one label for the two details links, 44 px chips, and real-device checks.

## 10. What still needs a browser, a device or an owner

1. Keyboard-only and VoiceOver passes on `/gear`, a category page and one guide card; Safari on iPhone at 390 px (the first trip card visible on the first phone screen).
2. A contrast measurement for the terracotta button and the muted text.
3. A click-through of a handful of buy buttons on the live site after deploy (open and close, no purchase).
4. An owner decision on the stay-page label versus the disclosure page.
5. The five review items still open (per-trip heading, differentiator line per ramp, details label wording, chip height, templated banners).
