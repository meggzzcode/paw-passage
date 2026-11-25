# Route and asset counts (recount of 2026-11-24 at `9797221`)

> **Update 2026-11-25 at `5aeb8b8` (listing red-flags guide republished at the same URL, breed-restrictions draft deleted, owner-approved).** Re-counted from a local production build with a throwaway Vitest file (same method as the table below: `allGuides`, `isPublic`, whitespace-split bodies): **31 published guides (24 Markdown + 7 TypeScript), 0 drafts**, 31 guide files; **48,109 words** in published bodies (shortest 1,014, longest 2,047; the red-flags guide is 1,322 by this method); **161 FAQs**; **449 sources**, every URL linked in its article text (checked in the same run); **95 pick cards**; **105 sitemap URLs** (guides row 32 = `/guides` + 31; checked with `curl -s /sitemap.xml | grep -o '<loc>' | wc -l`); **31 pins and 32 share images** (`ls public/pins | wc -l`, `ls public/share | wc -l`; 31 data rows in `docs/pinterest-pins.csv`); **774 tests in 61 files**; `verify-site` run with no draft marker (331 passed, 0 failed). The deleted URL `/guides/breed-restrictions-at-vacation-rentals` returns 404 and is not in the sitemap. Where a row below says 30 guides, 104 URLs, 30 pins, 2 drafts, 46,721 words, 156 FAQs, 439 sources or 93 picks, this note supersedes it.

> **Update 2026-11-25 at `6f9add3` (no-pets-rental guide republished at the same URL, owner-approved).** The only content change since the recount below: `bringing-a-dog-to-a-no-pets-rental` is now published (it was a draft returning 404). Re-counted from a local production build with a throwaway Vitest file using the same method as the table below (`allGuides`, `isPublic`, whitespace-split bodies): **30 published guides (23 Markdown + 7 TypeScript), 2 drafts** (`breed-restrictions-at-vacation-rentals`, `pet-friendly-listing-red-flags`), 32 guide files; **46,721 words** in published bodies (shortest 1,014, longest 2,027; the new guide is 1,518 by this method, about 1,420 words of prose); **156 FAQs**; **439 sources**, every URL linked in its article text; **93 pick cards**; **104 sitemap URLs** (guides row 31 = `/guides` + 30); **30 pins and 31 share images** (`public/pins/`, `public/share/`, 30 data rows in `docs/pinterest-pins.csv`); **783 tests in 61 files**; `verify-site` run with `--draft-marker breed-restrictions-at-vacation-rentals`. Where a row below still says 29 guides, 103 URLs, 29 pins, 3 drafts, 45,093 words, 152 FAQs or 420 sources, this note supersedes it (the table keeps its 2026-11-24 and `3e5923b` wording as history).


> **Recount 2026-11-25 at `3e5923b`.** Every content count in this file was re-run and is unchanged (29 published guides: 22 Markdown and 7 TypeScript; 32 files; 83 stay files, 78 shown, 23 indexable, 55 shown but noindex, 5 hidden, 0 host-confirmed; 92 products, 65 active; 11 categories; 5 trip collections; 160 affiliate entries; 37 packing items; 8 town articles; 103 sitemap URLs from a local production build). Only the test count changed: **783 tests in 61 files** (the cleanup removed unused code and its tests). `verify-site` 319 passed, 0 failed; tsc and eslint clean; `test-netlify-ignore` all rows pass; the seller-ID audit reports 5 items. Production runs `main@82b0b34`; the final commit is not yet deployed.

Purpose: one place for every headline number a buyer or a listing may quote, with the commands that produced it, so each number can be re-run. Nothing here is a traffic, revenue, ranking, valuation or buyer-interest figure.

This file replaces the recount made at `13a7ce1`. Superseded numbers that must not be quoted: 498 and 605 and 610 tests; 57,011 and 81,901 and 76,890 guide words; 452 and 491 sources; 37 stay files and "32 listed"; 53 active products; the 95-URL and 98-URL sitemaps; a "15-item" packing list; per-button affiliate labels on guides and Gear; calculators (retired); numbered citations.

## Status of the site: read this first

- **Nothing is deployed.** Production (https://www.pawsandpassage.com) serves a build from about 2026-11-23 (`ced2c93`), 214 commits behind `HEAD` when it was compared ([docs/SEO_ROOT_CAUSE_INVESTIGATION.md](../SEO_ROOT_CAUSE_INVESTIGATION.md)): 98 sitemap URLs, the retired weight-limit guide still 200, the town "things to do" pages 404, old guide titles. **Every number below describes the repository at `HEAD` and a production build of it served locally on this machine.** No claim about the live site is made. The first deploy must be verified ([docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md](../cowork/FINAL_PRE_SALE_BROWSER_QA.md), section "Production deploy verification").
- Evidence types: COUNTED (script or command below), BUILT (from the locally served production build), OWNER (supplied by the owner, not checkable here).

## Commands used (re-runnable)

```
git archive HEAD | tar -x -C <scratch>        # clean copy of HEAD; copy node_modules in (or bun install)
cd <scratch>
bunx vitest run                                # tests
bunx tsc --noEmit                              # types
bunx eslint . --quiet                          # lint
NITRO_PRESET=node-server bunx vite build       # production build
PORT=4581 node .output/server/index.mjs &      # serve it
curl -s localhost:4581/sitemap.xml | grep -o '<loc>[^<]*' | wc -l
node scripts/verify-site.mjs http://localhost:4581 --site-url https://www.pawsandpassage.com
node scripts/audit-seller-ids.mjs              # seller identifiers (report mode, exit 0)
node scripts/test-netlify-ignore.mjs           # build-skip rule, 20 change types
bun scripts/gear-coverage-report.ts            # packing-to-Gear coverage (regenerates docs/PACKING_GEAR_COVERAGE.md)
```

The content counts were produced by a throwaway Vitest file (not committed, run in the scratch copy) that imports the site's own rules (`allGuides`, `isPublic`, `visibleStays`, `indexableStays`, `sitemapEntries`, `products`, `liveCategories`, `tripCollections`, `affiliateLinks`, `imageCredits`, `destinations`, `allTownReads`, `dogTypes`) and prints the totals, so the counts use the same code paths the site uses. Page-level counts (links, labels, titles, canonicals) come from fetching every one of the 103 sitemap URLs from the served build and parsing the HTML.

## Result of the checks at `9797221` (scratch copy of HEAD)

| Check | Result |
|---|---|
| `bunx vitest run` | **771 tests passed in 59 files**, 0 failed (55 s) |
| `bunx tsc --noEmit` | exit 0, no errors |
| `bunx eslint . --quiet` | exit 0, no errors (warnings are hidden by `--quiet`) |
| `NITRO_PRESET=node-server bunx vite build` | exit 0 |
| `node scripts/verify-site.mjs` on the served build | **319 checks passed, 0 failed** |
| Sitemap | **103 URLs**, all HTTP 200, all self-canonical on `https://www.pawsandpassage.com`, exactly one H1, no `noindex`, every title 60 characters or fewer (after decoding `&amp;`), every description 120 to 160 characters |
| Spot checks | the 8 `.../things-to-do` URLs: 200; `/guides/vacation-rentals-with-no-dog-weight-limit`: 301 to the large-dog guide; `/tools/cost-calculator`, `/tools/pet-cost-check`, `/tools/host-questions`: 301; `/pet-policies-38-managers.csv`: 200 |

## Sitemap: 105 URLs from 2026-11-25 (104 and 103 before the no-pets-rental and red-flags guides were republished; BUILT and COUNTED, the two agree)

| Type | URLs | Detail |
|---|---:|---|
| Home | 1 | `/` |
| Guides | 32 | `/guides` + 31 published guides (updated 2026-11-25) |
| Stays | 24 | `/stays` + 23 indexable stay pages |
| Gear | 12 | `/gear` + 11 category pages |
| Destinations | 17 | `/destinations` + 2 state pages + 6 town pages (Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara) + 8 "things to do with a dog" articles (`/destinations/<state>/<town>/things-to-do`; these are not guides) |
| Dog types | 5 | `/dogs` + 4 pages |
| Tools | 4 | `/tools` + 3 tools (packing planner, will my dog be accepted, before-you-book checklist) |
| Research data | 1 | `/data/pet-policies` |
| Trust and info pages | 9 | about, contact, list-your-property, affiliate-disclosure, privacy, terms, editorial-standards, methodology, corrections |
| **Total** | **105** | 1 + 32 + 24 + 12 + 17 + 5 + 4 + 1 + 9 |

Not in the sitemap on purpose: `/dog-rules` (noindex, no verified place), the five Gear trip views (`/gear?trip=<slug>`, `noindex, nofollow`, canonical `/gear`), retired tool addresses (301 to `/tools`), guide files that are drafts (none today), 55 shown stays that are `noindex` as too thin, and the Monterey and Mendocino town pages (`noindex`; their things-to-do articles are indexable and are linked from the state pages). A sitemap lists URLs offered for indexing; it is not evidence that Google has indexed them.

## Listing terms: use exactly these words

| Term | Count | Meaning |
|---|---:|---|
| Stay files written up | **83** (Georgia 49, California 34, 27 towns) | files in `content/stays/` |
| Host-confirmed | **0** | every file is `status: unverified`: written from public listing pages, never confirmed with a host. Each page says its details are not confirmed with the host |
| Shown in the directory (listed) | **78** (Georgia 47, California 31) | listed with a public Vrbo or Airbnb source link (`stayDirectoryMode: public-sources`, shipped from 2026-11-25); the old `affiliate-only` rule listed a stay only while it had an approved affiliate link |
| Indexable (in the sitemap) | **23** | pass the quality rule in `src/content/publish-rule.ts` |
| Shown but `noindex` | 55 | 78 minus 23 |
| Hidden | 5 | no approved link: `coastal-bliss-fort-bragg-hot-tub-ocean-views`, `large-oceanfront-home-cleone-fort-bragg-hot-tub`, `rosemarys-retreat-mendocino-oceanfront`, `that-cabin-on-that-lane-blue-ridge`, `woof-in-the-woods-cabin-blue-ridge` (non-Vrbo source) |
| Published guides | **29** | `isPublic()`: status published, research complete, no unverified claims, approver and date |
| Draft guides (404) | 0 | none today; `breed-restrictions-at-vacation-rentals` was deleted and returns 404 |
| Configured affiliate links | 160 | 79 Vrbo + 81 Amazon; "approved: true" is a switch in `content/affiliates.yml`, not proof of any programme's approval |
| **Verified affiliate approvals a buyer can rely on** | **0** | no approval is evidenced in the repo for the buyer; the seller's accounts do not transfer |

**Mode caveat (owner decision made 2026-11-25: `public-sources` ships).** Historical analysis of the old mode: The directory exists only because the seller's Vrbo deeplinks are marked approved. If those links are switched off (`node scripts/neutralize-seller-vrbo-links.mjs --write`) while `stayDirectoryMode` stays `affiliate-only`, the directory empties: 0 listed, 0 indexable, the stay pages 404 and the sitemap drops by 24 stay URLs plus any town and state pages that lose their indexable stays ([docs/BUYER_AFFILIATE_TRANSITION.md](../BUYER_AFFILIATE_TRANSITION.md) section 5 measured 103 to 73 on a test copy). The shipped `public-sources` mode lists the same 78 stays with plain Vrbo or Airbnb source links, no commission and no affiliate label. The owner chose `public-sources` for the sale (section 6 of that file).

## Content and data

| Asset | Count | How counted |
|---|---|---|
| Guide files | 31 (24 Markdown in `content/guides/`, 7 TypeScript in `src/content/guides/`) | `allGuides` |
| Published guides | **31 (24 Markdown + 7 TypeScript)**; 0 drafts (was 29 and 3 before 2026-11-25) | `isPublic` |
| Words in published guide bodies | **48,109 at 2026-11-25** (was 45,093 with 29 guides; shortest 1,014, longest 2,047) | whitespace-split words of each published guide's Markdown body (front matter, FAQs and Sources excluded; card directives and link syntax included). The same method gave 57,011 at `b0f371a` and 81,901 for the same guides at `dbbbb94`: the final editorial pass cut length on purpose. (The `13a7ce1` recount gave 45,057; the 36-word difference is the small SEO link edits made since.) |
| FAQs in published guides | 161 (was 152) | sum of `faqs` |
| Sources in published guides | **449** (was 420), every source listed in its guide's Sources list with publisher, title and read date (light inline links only where a sentence names its source) | sum of `sources`; the content test requires title, publisher, URL and date per source and that any inline external link points to a listed source |
| Pick / spec cards in guides | 95 (2026-11-25 recount; was 90) | `{{pick:}}` directives (counted at `13a7ce1`, guide text unchanged in spirit since; re-run before quoting) |
| Pet-policy dataset | **38 records x 13 fields** (header: manager, region, place, dog_or_pet_limit, limit_basis, weight_limit, breed_rule, pet_fee_as_stated, dogs_in_pool_or_hot_tub, minimum_dog_age, leaving_dog_alone, source_page, read_on) | `public/pet-policies-38-managers.csv` (39 lines); read date 2026-11-18 |
| Town "things to do" articles | 8 (all public) | `allTownReads`; indexable at `/destinations/<state>/<town>/things-to-do` |
| Destinations | 2 states (Georgia, California), 8 towns defined (6 indexable) | `destinations` |
| Dog-type pages | 4 live (+ `/dogs`) | `dogTypeIsLive` |
| Dog-rules place files | 14, all unverified, 0 public | `content/places/*.yml`; section is `noindex` |
| Tools | **3**: packing planner (`/tools/packing-list`), will my dog be accepted (`/tools/will-my-dog-be-accepted`), before-you-book checklist (`/tools/checklist`), plus the stay-directory filters. No calculators | `staticPaths`; the old calculator, pet cost check and host-questions addresses 301 to `/tools` |
| Packing planner content | **37 items** (12 essential, 15 conditional, 10 optional), 5 trip types, 9 conditions, 7 categories | `content/packing.yml`. The list is built from trip answers; it is not a fixed 15-item list. Gear coverage: 37 active products recommended directly by an item, 28 reachable through a live Gear category, 0 only via the hub, **0 unreachable** ([docs/PACKING_GEAR_COVERAGE.md](../PACKING_GEAR_COVERAGE.md)) |
| Gear categories (live) | **11** | `liveCategories()` |
| Gear trip collections | **5** (road trip, cabin stay, beach and lake, winter trip, hiking) | `tripCollections` (`noindex` views) |
| Gear products | **92 records, 65 active** (27 inactive) | `content/products.yml`. Active products by primary category (a product may sit in two): car-safety 10, car-interior 4, ramps-and-steps 5, feeding-and-hydration 9, pens-and-gates 6, comfort-and-cooling 7, water-and-beach 3, trail-and-hiking 3, cold-weather 3, safety-id-first-aid 9, rental-cleanup 6 (sums to 65; hub tiles show 8, 5, 7, 9 for pens, water, trail, rental because they count every membership) |
| Affiliate entries | **160**: 79 Vrbo (all marked approved) + 81 Amazon (71 marked approved, 10 not) | `content/affiliates.yml` |
| Seller identifiers in the repo | 5 kinds remain: Amazon tracking ID, GA4 ID, Impact verification value, Pinterest profile, 79 Vrbo deeplinks | `node scripts/audit-seller-ids.mjs` ("RESULT: 5 seller identifier(s) remain"); 78 of the 83 stay files use a seller deeplink |
| Seller IDs (public identifiers, not secrets) | Amazon tag `pawspassage-20`; GA4 `G-1J97C8CPC1`; Impact verification value and Pinterest URL in `content/settings.yml`; Vrbo deeplink codes in `scripts/seller-ids.json` | the buyer replaces all of them ([docs/BUYER_AFFILIATE_TRANSITION.md](../BUYER_AFFILIATE_TRANSITION.md)) |
| Pinterest pin images | 30 (1000x1500) + `docs/pinterest-pins.csv` (30 data rows) | `public/pins/` |
| Share (link-preview) images | 31 | `public/share/` |
| Image files in `src/assets` | 196 JPG | file listing |
| Image credit entries | **64** (Unsplash photographers) | `imageCredits.length` (a `grep -c "key:"` gives 65 because the type line also matches) |
| Fonts | 2 variable WOFF2 (DM Sans, Fraunces) with OFL texts | `public/fonts/` |
| Automated tests | **771 in 59 files** | `bunx vitest run` |
| GitHub workflows | 4 (`ci.yml`, `indexnow.yml`, `monthly-digest.yml`, `site-health.yml`) | `.github/workflows/` |
| Pages CMS collections | 7 (guides, stays, places, affiliates, products, packing, settings) | `.pages.yml`; **never used in the live Pages CMS app (UNVERIFIED)** |
| Permanent redirects in `netlify.toml` | 10 (retired guide addresses) plus app-level redirects for retired tool, Gear and guide addresses | `grep -c "from =" netlify.toml` |
| Markdown docs | 166 files in `docs/` (655 in the folder tree) | file listing |
| Git history | 518 commits at `9797221`, first commit 2026-11-16 | `git log --oneline \| wc -l` |

## Link and disclosure counts (all 103 sitemap pages, BUILT)

| Link type | Occurrences | Notes |
|---|---:|---|
| Amazon affiliate (`amazon.com/...tag=`) | 270 on 49 pages, 65 distinct URLs | one `sponsored` notice per page |
| Vrbo affiliate (`vrbo.com/affiliate/...`) | 50, 24 distinct | stay pages (2 on each of 23 indexable stays) and 4 in guides |
| Untagged Amazon links | 14 on 10 distinct ASINs | citation "Source" links, not buy buttons; the "10 ASINs untagged source links" to sample in the QA file |

Disclosure on the build: 49 of 49 pages with an Amazon link carry Amazon's sentence ("As an Amazon Associate I earn from qualifying purchases."). Guides and Gear carry one notice at the top and no per-button label; 0 occurrences of "Check the current price" and 0 numbered citation markers on any sitemap page. **Still open (owner decision):** the Vrbo booking buttons on the 23 indexable stay pages (and the 55 `noindex` ones) show "Affiliate link · We may earn a commission if you book, at no extra cost to you." (46 occurrences on indexable stay pages), while `/affiliate-disclosure` (source `src/routes/affiliate-disclosure.tsx`, line 22) still says every affiliate buy or booking button carries its own label. Amazon buttons no longer do. That sentence is therefore inaccurate for Amazon buttons until the owner either restores labels or rewrites the page. NOT checked: whether any Amazon or Vrbo link resolves or pays on the live hosts (not requested), or legal sufficiency of the wording.

## What these counts do not show

No traffic, revenue, earnings, clicks, rankings or backlinks. The only Search Console evidence is historical and owner-supplied: 236 impressions and 0 clicks over 28 days and 21 of 23 inspected pages indexed, measured on the older production build; GA4 for 2026-11-17 to 11-23 showed 463 sessions, 450 Direct, 0 Organic ([docs/SEO_ROOT_CAUSE_INVESTIGATION.md](../SEO_ROOT_CAUSE_INVESTIGATION.md)). The domain was registered 2026-11-16 and is about 8 days old; it is too early to read rankings.
