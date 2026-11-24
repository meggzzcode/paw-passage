
## Shared product card contract

Owner: worker G1. Code against `GearProductCard` from `src/components/site/GearProductCard.tsx`.

```ts
<GearProductCard
  product={Product}
  variant?: "featured" | "standard" | "compact"   // default "standard"
  useCase?: string          // overrides the purpose label; default = guide pick "best for" (<= 34 chars, ranking word stripped) else category job label
  guideSlug?: string        // public guide listed first under "Read with it" in the details panel
  headingLevel?: 2 | 3 | 4  // product-name heading, default 3
  hideDetailsLink?: boolean // hide the quiet "Details and specs" link (use on the category page itself)
/>
```

- Renders an `<article>` (put it inside your own `<li>`). Standard and featured cards carry `id={product.id}` for hash links; compact does not (avoids duplicate ids when a product is shown twice).
- Order: purpose label in the graphic panel, brand, name, reason (`product.summary`), up to 3 `cardSpecs` chips, one "Check:" line (first guide watch-out, else a sentence from the record about restraint or testing), ONE primary CTA (link from `resolveProductLink`, `trackProductClick`, rel preserved; "Information only" text when no link), quiet "Details and specs" link to `/gear/<category>#id`, then native `<details>` "Details, fit & sources".
- No price, stock, rating, per-card affiliate label. Page-level disclosure stays with `GearDisclosure` (below).
- Also exported: `useCaseFor`, `cautionFor`, `USE_CASE_LABEL`. `ProductSpecCard.tsx` exports `ProductSpecCard`, `productSpecCardHtml` (in-article pick cards), `SPEC_CARD_STYLE`, `styleFor`, `SpecGlyph`, `SpecMotif`. Styles live in `src/components/site/gear-card.css` (imported by ProductSpecCard).
- Kept in `GearHubCards.tsx` (unchanged names): `GearDisclosure({ products })`, `HowWePick()`, and `GearProductCard({ product, variant?, hideDetailsLink? })`, a thin `<li>` wrapper over the shared card (defaults `hideDetailsLink` to true). New code should import the shared card directly.
- `RelatedProducts` now renders the shared card in a 2-column grid; `GearPicks` keeps its pick content but uses the same CTA classes and moves specs/sources into a `<details>`.
- Tests: `src/test/gear-product-card.test.tsx`. Screenshots: `docs/editorial/img/gear-card-{320,390,768,1440}.png`.

## Category pages

Owner: worker G3. Route `src/routes/gear.$category.tsx`; page model `src/content/gear-category-view.ts` (`buildCategoryView`); components in `src/components/gear/` (`CategoryHero`, `SafetyNote`, `RelatedProductRows`/`CategoryProductGrid`, `HowToChoose`, `RelatedGuides`, `CategoryHowWePick`, `GearHashTarget`); copy in `src/content/gear-categories.ts`.

Order on the page: breadcrumb and compact hero (icon, H1, two-sentence intro, pick count, jump chips) then the single affiliate notice (with the Amazon sentence only when an Amazon link renders), then, for safety-critical categories only (car-safety, ramps-and-steps, pens-and-gates; defined by `safetyNote` in `gear-categories.ts`), a visible "Know before you choose" note, then primary products (`GearProductCard`, one column on mobile, two from 768 px, one featured card if a category has a single product), then "Also useful for this category" (secondary-category products as `compact` rows), then "How to choose" (one line plus a native `<details>`; open by default and holding the remaining check on safety categories), then at most three related guides as plain rows, one "How we pick" with the methodology link, and footer navigation.

Preserved: URLs, legacy 301s (`legacyRedirectFor`), 404 for unknown or empty categories, `noindex` when a category is not live, SEO title/description, breadcrumb JSON-LD, server rendering. Hash anchors: the standard card carries `id=<product-id>`; compact rows carry it on their `<li>`. Without JS it is a normal anchor; `GearHashTarget` (client effect, also on `hashchange`) opens the card's details, scrolls it into view and outlines it for 2.5 s.

Tests: `src/test/gear-category-page.test.tsx` (primary/secondary split, active only, empty/unknown, safety note placement, products before how-to-choose, compact rows, one id per product, guide limit, one methodology link, legacy redirects, noindex, hash targeting).

QA (Playwright on a built copy, port 4184, 11 categories at 320/375/390/430/768/1024/1440): no page-level horizontal overflow, no CTA or summary under 40 px, no clipped chips. The only elements reported past the viewport edge are the cards' decorative motif circles, which the card clips with `overflow: hidden`. Screenshots: `docs/editorial/img/gear-cat-{car-safety,ramps-and-steps,feeding-and-hydration,rental-cleanup}-{390,1440}.png`.

Journeys (walked on the built copy, not user-tested):
- B, six-hour road trip: car-safety opens with the restraint distinctions above the products, then harness and crate cards with a one-tap "See it at Amazon" or maker button; the car-interior and feeding categories are one tap away in the footer nav and guide rows.
- C, senior-dog ramp: ramps-and-steps shows the length, weight and vet caveat in the hero and note, five ramps and steps with specs chips, "Also see the senior dog" link; the guide row leads to the ramp guide.
- D, comparison shopper: two-column grid on tablet and desktop with three spec chips per card; full specs, sources and maker claims sit in each card's details; guide-to-category links using `#<product-id>` open that card's details.

Known limits: the page-level notice sits just under the hero, so on a phone it is near the first products but not above the H1. Hash-open of details needs JS; the anchor still scrolls without it.

## Homepage and curation (worker G2)

Files: `src/routes/gear.index.tsx`, `src/content/gear-hub.ts` (curation block at the end), `src/components/gear/GearHero.tsx`, `src/components/gear/GearHomeSections.tsx` (GearSectionHeader, TripCollectionCard, TripCollectionSection, FeaturedGearSection, GearCategoryTile, DogTypeCard, PlanTripSection), `src/test/gear-curation.test.tsx`. Cards come from `GearProductCard` (`src/components/site/GearProductCard.tsx`); the affiliate notice is `GearDisclosure`.

### How curation works
- One catalog: `content/products.yml`. `gear-hub.ts` holds only explicit product ids: `tripCollections` (per trip, ordered groups of ids), `featuredProductIds` (A few good places to start, max 6), `planGuideSlugs`, plus the existing `shopByTrip` / `shopByDog`.
- At render time `resolveTripCollection()` and `featuredGear()` drop any id that is unknown, inactive or without a link (`isShoppable`: approved affiliate, maker or retailer link). A trip with fewer than `MIN_COLLECTION` (3) shoppable products is hidden (`liveTrips()`); we show fewer products rather than pad.
- Trip cards go to `/gear?trip=<slug>#trip-collection`. The collection is rendered on the server, so it works with no JS and with browser history. The canonical stays `/gear` and a trip view is `noindex, nofollow`; unknown trip values are ignored (`parseGearSearch`). The sitemap is unchanged (no new indexable URLs).
- Featured labels come from `GearProductCard` (guide pick "best for" or the category job); nothing is invented here.
- Category tile counts are `categoryProducts(slug).length` (active only); all 11 categories show.

### Add a product or collection
1. Add the product to `content/products.yml` (and its affiliate entry when approved).
2. To feature it on a trip, add its id to a group in `tripCollections`; to feature it on the homepage, add it to `featuredProductIds` (keep 3 to 6).
3. A new trip: add an entry to `shopByTrip` and a matching `tripCollections` entry, plus an icon in `TRIP_STYLE` (`GearHomeSections.tsx`).
4. Run `bunx vitest run src/test/gear-curation.test.tsx`; it fails on missing, inactive or link-less ids, empty collections and non-deterministic order.

### Journeys (Playwright against a built copy, JS disabled for trips)
- A cabin: hero, Cabin stay card, `/gear?trip=cabin-stay` shows 9 products in Containment, Comfort and Cleanup, each with a button; passed.
- B road trip: `?trip=road-trip` shows 10 products (restraints, ramps, car cleanup, water); passed.
- C senior dog ramp: Every dog travels differently, Senior dogs, Ramps and steps category link and dog guides; passed (no medical claims in the copy).
- E skeptical visitor: affiliate notice and Amazon sentence sit right under the hero, one concise research paragraph with the methodology link at the end, no prices, ratings or stock text on the page; passed.
- Overflow: no horizontal scroll at 320, 375, 390, 430, 768, 1024, 1440. First mobile viewport (390x844) shows hero, both CTAs, the notice and the first trip card. Screenshots: `docs/editorial/img/gear-home-{320,390,768,1440}.png` (`-fold`, `-cabin` variants).
- Not verified: real-device Safari, screen reader pass, keyboard walk-through of the details panels (give to the Cowork browser task).
