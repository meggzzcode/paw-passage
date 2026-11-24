# Final review: Gear section

Method: localhost:4179, Playwright Chromium at 320/390/768/1440, screenshots viewed for /gear, /gear?trip=cabin-stay, /gear?trip=road-trip, /gear/car-safety, /gear/ramps-and-steps, /gear/feeding-and-hydration, /gear/rental-cleanup. DOM checks for prices/ratings/claims, keyboard test of the expander, code read of src/components/gear and src/content/gear-hub.ts. No user testing was done; the 28-year-old cabin-weekend owner is a lens. Contrast ratios were not measured, only judged visually.

Hubs checked: five trips exist (road-trip, cabin-stay, beach-and-lake, winter-trip, hiking); I opened cabin-stay and road-trip and checked the cards of the others link correctly.

## What works
- No horizontal overflow at 320/390/768/1440 on any of the seven pages. No images at all (0 img elements); decorative icon tiles and tinted banners do not look like missing photos.
- One affiliate notice per page with the Amazon sentence (count 1 and 1 on every page); no per-card affiliate label; no `$` prices, ratings, review counts, "best seller", "in stock" text on any page. All CTAs read "See it at Amazon" and all go to amazon.com with rel="sponsored nofollow noopener".
- Cards: maker/brand eyebrow, product name, one-sentence purpose, then at most three fact chips, a single primary button (183x44 at 320), then "Details, fit & sources". Warnings are surfaced ("Check: Maker says not to leave young animals unsupervised").
- Expander is a native details/summary: Enter opens it, Space toggles, visible 2px focus outline, 44px tall. Content states what the maker says, what is claimed versus independently tested, and conflicts ("Maker pages have disagreed on the weight rating").
- Page titles unique, canonical per category, one H1 per page, 1.4 MB total transfer including Google Analytics with no large images.

## Defects
1. Trip views (/gear?trip=...) reuse the same H1 ("Good gear. Better getaways."), meta description and canonical as /gear. Intentional (the code says trip view is a filter, not indexed), but the visible H1 doesn't change, so a visitor landing on ?trip=cabin-stay sees the generic hero and has to scroll past 5 trip tiles to find "Gear for a cabin stay" (about 1,000 px down at 1440, more on mobile). The page loads at scrollY 0.
2. Cabin trip view duplicates products: Exercise Pen with Door, Loft Wander Dog Bed, Microfiber Doormat appear in the trip groups and again in "A few good places to start". On the road-trip view the same repetition happens.
3. Category pages: all cards on a page share the same banner and icon ("GETTING INTO THE CAR" x5 on ramps; "CONTAINMENT AT THE STAY" etc.), which uses vertical space and gives no help telling products apart. Ramps page is five PetSafe Happy Ride products with no sentence on which suits which car or dog; "Know before you choose" and "How to choose" say nearly the same thing twice.
4. /gear featured cards offer three controls: See it at Amazon, a secondary "Details and specs" link (goes to the category anchor) and "Details, fit & sources" expander. The two "details" labels are confusingly alike.
5. Category meta descriptions are a template ("Researched picks for ramps and steps: the maker's own specs...") and titles read "Ramps and steps for Dogs" (odd capital D).
6. Journey: senior dog needing a ramp: /gear dog tile "Senior dogs" leads to ramps, but the hero says "The makers do not sell these as senior or mobility products, so ask your vet", honest but gives no pick. Comparison shopping has no side-by-side or filter on the category pages, only card reading.
7. Small tap targets: hero chips ("How to choose", "Related guides", "Also useful") are 36px tall at 320, below the 44px used on buttons; inline links in cards are 39px.
8. Performance: three JS bundles of 190-350 KB each plus the Google Analytics tag (184 KB). Acceptable, not light.

## Scores (1-10)
| Criterion | Score | Evidence |
|---|---|---|
| First impression and brand polish | 8 | Clean hero, notice directly below, consistent type and palette; footer matches the rest of the site |
| Photo-free visual design | 7 | Icon tiles and tinted banners hold up; repeated identical banners per page start to look templated |
| Finding relevant products | 7 | Trip tiles, 12 categories, dog tiles, featured picks; hurt by duplicated products and a hero that does not change per trip |
| Card readability | 8 | Purpose before specs, three chips max, warnings visible |
| CTA clarity | 8 | One primary "See it at Amazon" matching an Amazon destination; confusing secondary "Details and specs" |
| Mobile (320/390) | 8 | No overflow, 44px CTAs; 36-39px chips and links; very tall trip pages (16-17k px at 320) |
| Trust and presentation | 8 | One top notice, no prices/ratings, conflicts and untested claims stated on the cards |
| Accessibility basics | 7 | One H1, ordered headings, native details, visible focus; contrast not measured; product names as H2 on category pages is acceptable |
| Performance and SEO preservation | 8 | No images, 1.4 MB with analytics, unique titles and canonicals, trip views canonical to /gear; templated meta descriptions |
| Maintainability | 8 | Small components in src/components/gear (34-307 lines), data-driven hub in gear-hub.ts with helpers (MIN_LIVE, resolveTripCollection, liveTrips), a spec-card test exists |
| **Average** | **7.7** | |

## Verdict: READY WITH MINOR FIXES
Fix list: dedupe featured vs trip products, make the trip-view heading reflect the chosen trip, rename the secondary details link, add one differentiator line per ramp, enlarge chips to 44px, vary category meta descriptions.
