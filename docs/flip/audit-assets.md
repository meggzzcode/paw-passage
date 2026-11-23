# Asset audit log (evidence for docs/BUYER_ASSET_INVENTORY.md)

Date: 2026-11-23. Checkout: branch `claude/affiliate-setup`, code state `902dde9` (a docs-only commit `945c340` and other sessions' evidence images landed during the audit; no source change). Production `main` = `b81db6c`. Nothing was committed, pushed or changed in any account. The probe test file `src/test/zz-probe.test.ts` was deleted after use; it wrote JSON to the session scratchpad only.

## Method

1. Guides, stays, places, destinations, products, affiliates, dog types, gear categories and the sitemap were read through the app's own modules (`allGuides`, `isPublic`, `loadGuide`, `allStayRecords`, `visibleStays`, `stayEarns`, `visiblePlaces`, `destinations`, `products`, `resolveProductLink`, `categoryProducts`, `sitemapEntries`) from a throwaway vitest file (two runs, both passed, file removed). Word count = whitespace-split tokens of the full guide body (includes Markdown markup and `{{pick:...}}` directives; excludes FAQs, sources, frontmatter).
2. `content/*.yml` counted with PyYAML; `public/pet-policies-38-managers.csv` counted with Python `csv`.
3. Live checks (curl, 2026-11-23): `/sitemap.xml` (HTTP 200, 9,559 bytes, 98 `<loc>`), `/robots.txt`, `/pet-policies-38-managers.csv` (200, byte-identical to repo file), IndexNow key file (200), and `<title>`, canonical, robots meta and JSON-LD `@type` of `/guides/how-vacation-rental-pet-fees-work`, `/stays/azure-springs-secluded-mountain-retreat-dahlonega`, `/data/pet-policies`, `/dog-rules`, `/gear`.
4. Comparison: the 98 live sitemap paths equal the 98 paths from `sitemapEntries()` exactly (no path on only one side).
5. Test and build commands run on this checkout.

## Command results

| Command | Result |
|---|---|
| `bunx vitest run` | Test Files 33 passed (33); Tests 486 passed (486); duration 21.86 s; exit 0 |
| `bunx tsc --noEmit` | no output; exit 0 |
| `NITRO_PRESET=node-server bunx vite build` | client build 2,298 modules (8.96 s), second build 366 modules (6.09 s), SSR build 2,147 modules (0.6 s); `.output/nitro.json` generated; exit 0 |
| `bun run lint` | 12 problems: 0 errors, 12 warnings (react-refresh only-export-components and similar) |
| `bunx vitest run src/test/zz-probe.test.ts` (twice) | passed; file deleted afterwards |

Tools: Bun 1.4.4, Node 22.23.4, vitest 4.1.11.

## Branch vs production

`git log b81db6c..HEAD` lists: `6e421ab`, `0da4db4`, `1f871b1` (Clickit Sport swap, retire Sport Plus and Backseat Bridge), `69b6be0`, `bac1b55` (go-live plan), `fc39951`, `902dde9` (Cowork prompts), then `945c340` (marketplace research, WIP). Files changed that affect the product: `content/affiliates.yml`, `content/products.yml`, `content/guides/protect-your-car-interior-from-a-dog-on-a-road-trip.md`, `content/guides/two-large-dogs-in-one-car.md`, `src/content/guides/dog-car-safety-harness-and-crate-guide.ts`, `src/lib/packing.ts`.

| Count | `b81db6c` (main) | branch |
|---|---|---|
| affiliate entries | 95 (Amazon approved 54, Amazon not approved 8, Vrbo approved 33) | 96 (53 / 10 / 33) |
| product records | 73, 54 active | 74, 53 active |

## Published and draft guides (probe output)

Word counts are body words as defined above.

| # | slug | file | status | public on live | body words | FAQs | sources | gear picks |
|---|---|---|---|---|---|---|---|---|
| 1 | airbnb-pet-damage-charge-after-checkout | content/guides/airbnb-pet-damage-charge-after-checkout.md | published | yes | 2,261 | 6 | 19 | 0 |
| 2 | can-dogs-go-in-a-rental-pool-or-hot-tub | content/guides/can-dogs-go-in-a-rental-pool-or-hot-tub.md | published | yes | 2,659 | 6 | 20 | 0 |
| 3 | can-you-leave-a-dog-alone-in-a-vacation-rental | content/guides/can-you-leave-a-dog-alone-in-a-vacation-rental.md | published | yes | 2,491 | 6 | 19 | 0 |
| 4 | christmas-week-in-a-cabin-with-a-dog | content/guides/christmas-week-in-a-cabin-with-a-dog.md | published | yes | 2,947 | 5 | 18 | 0 |
| 5 | cold-weather-dog-gear-for-winter-cabin-trips | content/guides/cold-weather-dog-gear-for-winter-cabin-trips.md | published | yes | 2,637 | 5 | 12 | 0 |
| 6 | dog-car-safety-harness-and-crate-guide | src/content/guides/dog-car-safety-harness-and-crate-guide.ts | published | yes | 2,872 | 6 | 16 | 4 |
| 7 | dog-friendly-cabin-packing-list | src/content/guides/dog-friendly-cabin-packing-list.ts | published | yes | 2,708 | 5 | 21 | 0 |
| 8 | dog-hiking-gear-for-a-cabin-vacation | content/guides/dog-hiking-gear-for-a-cabin-vacation.md | published | yes | 2,367 | 5 | 14 | 0 |
| 9 | dog-life-jacket-for-lakes-and-beaches | content/guides/dog-life-jacket-for-lakes-and-beaches.md | published | yes | 2,542 | 5 | 17 | 0 |
| 10 | dog-ramp-or-steps-for-the-car-and-cabin | content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md | published | yes | 2,660 | 5 | 11 | 0 |
| 11 | dog-travel-bowls-and-food-storage | content/guides/dog-travel-bowls-and-food-storage.md | published | yes | 2,665 | 5 | 15 | 0 |
| 12 | dog-travel-first-aid-kit-guide | src/content/guides/dog-travel-first-aid-kit-guide.ts | published | yes | 2,681 | 6 | 9 | 2 |
| 13 | dogs-in-georgia-state-park-cabins | content/guides/dogs-in-georgia-state-park-cabins.md | published | yes | 2,096 | 6 | 16 | 0 |
| 14 | how-many-dogs-can-you-bring-to-a-vacation-rental | content/guides/how-many-dogs-can-you-bring-to-a-vacation-rental.md | published | yes | 2,897 | 6 | 20 | 0 |
| 15 | how-vacation-rental-pet-fees-work | content/guides/how-vacation-rental-pet-fees-work.md | published | yes | 2,410 | 6 | 10 | 0 |
| 16 | if-your-dog-gets-loose-on-a-trip | content/guides/if-your-dog-gets-loose-on-a-trip.md | published | yes | 3,208 | 6 | 23 | 4 |
| 17 | keep-a-dog-cool-on-a-summer-trip | content/guides/keep-a-dog-cool-on-a-summer-trip.md | published | yes | 2,903 | 5 | 15 | 0 |
| 18 | new-years-eve-with-a-dog-in-a-vacation-rental | content/guides/new-years-eve-with-a-dog-in-a-vacation-rental.md | published | yes | 2,195 | 6 | 21 | 0 |
| 19 | pet-friendly-vacation-rental-checklist | src/content/guides/pet-friendly-vacation-rental-checklist.ts | published | yes | 1,679 | 6 | 11 | 0 |
| 20 | portable-dog-fence-and-playpen-guide-for-rentals | src/content/guides/portable-dog-fence-and-playpen-guide-for-rentals.ts | published | yes | 2,722 | 5 | 7 | 4 |
| 21 | protect-your-car-interior-from-a-dog-on-a-road-trip | content/guides/protect-your-car-interior-from-a-dog-on-a-road-trip.md | published | yes | 2,570 | 5 | 13 | 0 |
| 22 | puppy-at-a-vacation-rental | content/guides/puppy-at-a-vacation-rental.md | published | yes | 2,578 | 6 | 13 | 0 |
| 23 | two-large-dogs-in-one-car | content/guides/two-large-dogs-in-one-car.md | published | yes | 2,503 | 4 | 18 | 0 |
| 24 | vacation-rental-secure-fenced-yard | src/content/guides/vacation-rental-secure-fenced-yard.ts | published | yes | 2,578 | 5 | 11 | 0 |
| 25 | vacation-rental-with-a-reactive-dog | content/guides/vacation-rental-with-a-reactive-dog.md | published | yes | 2,636 | 6 | 18 | 0 |
| 26 | vacation-rental-with-a-senior-dog | content/guides/vacation-rental-with-a-senior-dog.md | published | yes | 3,324 | 7 | 31 | 0 |
| 27 | vacation-rentals-that-welcome-large-dogs | src/content/guides/vacation-rentals-that-welcome-large-dogs.ts | published | yes | 1,951 | 5 | 12 | 0 |
| 28 | vacation-rentals-with-no-dog-weight-limit | content/guides/vacation-rentals-with-no-dog-weight-limit.md | published | yes | 2,288 | 5 | 18 | 0 |
| 29 | vacation-rentals-with-no-pet-fee | content/guides/vacation-rentals-with-no-pet-fee.md | published | yes | 2,415 | 6 | 26 | 0 |
| 30 | what-a-dog-really-costs-on-a-vacation-rental | content/guides/what-a-dog-really-costs-on-a-vacation-rental.md | published | yes | 2,447 | 6 | 17 | 0 |
| 31 | breed-restrictions-at-vacation-rentals | content/guides/breed-restrictions-at-vacation-rentals.md | draft | no (404) | 2,462 | 6 | 20 | 0 |
| 32 | bringing-a-dog-to-a-no-pets-rental | content/guides/bringing-a-dog-to-a-no-pets-rental.md | draft | no (404) | 2,036 | 6 | 20 | 0 |
| 33 | pet-friendly-listing-red-flags | content/guides/pet-friendly-listing-red-flags.md | draft | no (404) | 1,845 | 6 | 11 | 0 |

Totals: 33 guides = 30 published + 3 draft. Published: 23 Markdown (59,699 words) + 7 code (17,191 words) = 76,890 words. Drafts: 3 Markdown, 6,343 words. Published FAQs 166, published sources 491, drafts' sources 51. All 33 have `researchComplete: true` and zero `unverified` claims; the drafts are held by status only. In the table `public on live` is derived from `guideIsPublic`; the live sitemap lists exactly the 30 published slugs.

## Stay files by town (37 files, all `status: unverified`)

| state/town | stay files | listed (earn) |
|---|---|---|
| california/fort-bragg | 2 | 0 |
| california/mendocino | 4 | 3 |
| california/san-diego | 3 | 3 |
| california/santa-barbara | 3 | 3 |
| california/ventura | 1 | 1 |
| georgia/blue-ridge | 11 | 9 |
| georgia/cherry-log | 2 | 2 |
| georgia/dahlonega | 2 | 2 |
| georgia/ellijay | 3 | 3 |
| georgia/helen | 3 | 3 |
| georgia/mccaysville | 1 | 1 |
| georgia/mineral-bluff | 1 | 1 |
| georgia/tybee-island | 1 | 1 |

Listed = has an approved affiliate entry (`vrbo-<listing id>`). Total listed 32; total hidden 5 (Fort Bragg 2, Mendocino 1, Blue Ridge 2). Indexable stay pages (the quality rule in `indexableStays`) = 23, matching the 23 `/stays/<slug>` sitemap entries. All 37 stay files have `photoPermission: false` and no `lastVerified` date.

## Dog-rules places (14 files, all `unverified`, none public)

alpine-pedal-path-big-bear, anna-ruby-falls-recreation-area, arroyo-burro-beach-county-park, california-state-parks-general-dog-rules, carmel-beach, channel-islands-national-park, georgia-state-parks-general-pet-rules, joshua-tree-national-park, mendocino-headlands-state-park, mount-san-jacinto-state-park, pismo-state-beach-and-oceano-dunes, red-top-mountain-state-park, san-diego-dog-beach-and-fiesta-island, tallulah-gorge-state-park. A place is public only when `verified` with source URL, source quote and last-checked date (`placeIsPublic`). Result: `/dog-rules` is live but `noindex, nofollow` and absent from the sitemap.

## Live sitemap (98 URLs) by section

guides 31 (30 + index), stays 24 (23 + index), gear 13 (hub + 12 categories), destinations 9 (index, 2 states, 6 towns: blue-ridge, ellijay, helen, dahlonega, san-diego, santa-barbara), tools 5 (index + 4), dogs 5 (index + 4), home 1, `/data/pet-policies` 1, and one URL each for about, contact, list-your-property, affiliate-disclosure, privacy, terms, editorial-standards, methodology, corrections.

## Gear counts

74 product records (53 active, 21 inactive). All 53 active products resolve to an approved Amazon affiliate link (`resolveProductLink` kind `affiliate`; zero resolve to a maker or retailer link). Active products per category (a product can be in several): road-trips 23, cabin-vacations 11, beach-vacations 5, senior-dogs 6, large-dogs 8, travel-safety 8, feeding-and-hydration 9, travel-comfort 6, car-safety 8, winter-travel 3, outdoor-adventures 12, cleaning-and-rental-protection 8. 14 distinct products are picked inside public guides. `affiliates.yml` totals: 96 entries = Vrbo 33 approved; Amazon 63 (53 approved, 10 not approved).

## Pet-policy CSV profile

38 rows; 13 columns; one `read_on` value (2026-11-18); 38 distinct `source_page` values; 23 distinct places. Regions: North Carolina 10, Georgia 9, Smoky Mountains TN 7, Colorado and Florida Gulf Coast 6, California 5, Many regions 1. `dog_or_pet_limit` stated on 24 rows; `weight_limit` stated on 6; `breed_rule`: not-stated 31, unnamed 3, named 2, none 2; `pet_fee_as_stated`: 25 state a fee (3 of them $0), 13 "Not stated"; pool/hot tub wording on 7; minimum age on 5; leaving-dog-alone wording on 8.

## Not verified in this audit

- Search Console and Bing indexing, GA4 data, Amazon and Vrbo account status, Pinterest account state (no access).
- Pages CMS forms in the real app (`.pages.yml` itself says it was never opened there).
- Tools were checked by code and tests, not driven in a browser.
- The scheduled workflows were read, not observed running.
- The 321-of-321 live check result quoted in `docs/GO-LIVE-PLAN.md` was not re-run; `scripts/verify-site.mjs` can repeat it.
- Revenue, costs, domain purchase date and marketplace figures quoted in older docs: no evidence in the repo.
