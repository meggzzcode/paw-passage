# Route and asset counts (recount of 2026-11-24, final)

Purpose: one place for every headline number a buyer or a listing may quote, with the method, so the numbers can be re-run. Nothing here is a traffic, revenue, ranking or valuation figure. This file replaces the earlier recount made at `56552fc`; the older numbers (498 tests, 57,011 guide words, 452 sources, 37 stay files, 53 active products, per-button affiliate labels) are superseded.

## Status of the site

**The final build is NOT deployed.** The owner stopped Netlify builds to preserve credits, so the live site still serves an older deploy. Every number below describes the repository at `HEAD` `13a7ce1` (pushed to `main`) and a production build of it served locally. No live site was fetched. Any listing claim about the live site must be re-checked by Cowork after the first deploy.

## Method

- Source: committed code at HEAD `13a7ce1` (508 commits; the first is 2026-11-16).
- Build: production build (`NITRO_PRESET=node-server`) served by `node` on port 4199.
- Sitemap: `curl /sitemap.xml` from that build, grouped by first path segment. The sitemap comes from `src/lib/sitemap-entries.ts`.
- Page checks: each of the 103 sitemap URLs fetched from the build and parsed for status, canonical, H1 count, title length, description length and `noindex`; every guide page parsed for body links; the stays directory parsed for listed stay links, and each listed stay's robots meta read.
- Data counts: YAML read from `content/products.yml`, `content/affiliates.yml` and `content/stays/*.yml`; guide frontmatter and `src/content/guides/*.ts` read directly.
- Tests: `bunx vitest run` at HEAD.
- Word counts: whitespace-split words of each published guide's Markdown body (frontmatter, FAQs, Sources and page chrome excluded; card directives and link syntax included). The rendered-page counts in the QA crawl are higher.

## Sitemap: 103 URLs

| Type | URLs | Detail |
|---|---:|---|
| Home | 1 | `/` |
| Guides | 30 | `/guides` index + 29 published guides |
| Stays | 24 | `/stays` index + 23 indexable stay pages |
| Gear | 12 | `/gear` hub + 11 category pages |
| Destinations | 17 | `/destinations` + 2 state pages (Georgia, California) + 6 town pages (Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara) + 8 companion 'things to do with a dog' articles at `/destinations/<state>/<town>/things-to-do` (not guides; the guide count stays 29) |
| Dog types | 5 | `/dogs` + 4 pages (escape artists, big dogs, multi-dog families, senior dogs) |
| Tools | 4 | `/tools` + 3 tools |
| Research data | 1 | `/data/pet-policies` |
| Trust and info pages | 9 | about, contact, list-your-property, affiliate-disclosure, privacy, terms, editorial-standards, methodology, corrections |
| **Total** | **103** | checked against the XML; 1 + 30 + 24 + 12 + 17 + 5 + 4 + 1 + 9 = 103 |

Checks on the first 95 on the final build (2026-11-24; the 8 added town articles were checked by `scripts/verify-site.mjs`, 318 checks passed): HTTP 200 on all; a self-referencing canonical on all; exactly one H1 on all; every title 60 characters or fewer; every meta description 120 to 160 characters; no stray `noindex`. The five gear trip views (`/gear?trip=<slug>`) are not in the sitemap, are `noindex, nofollow` and canonicalize to `/gear`. Not in the sitemap on purpose: `/dog-rules` (noindex, no verified place), the retired tool addresses (301 to `/tools`), the draft guides (404), 55 listed stays that are `noindex` as too thin, and the Monterey and Mendocino town pages (`noindex`). A sitemap lists URLs offered for indexing; it is not evidence that Google has indexed them (see the inventory, section 12, for the only indexing evidence that exists).

## Content and data

| Asset | Count | How counted |
|---|---:|---|
| Guide files | 32 (25 Markdown in `content/guides/`, 7 TypeScript in `src/content/guides/`) | file listing |
| Published guides | 29 (22 Markdown + 7 TypeScript) | the sitemap and `isPublic()` (status, research complete, no unverified claims, approver and date) |
| Draft guides (404 on the site) | 3 | `breed-restrictions-at-vacation-rentals`, `pet-friendly-listing-red-flags`, `bringing-a-dog-to-a-no-pets-rental` |
| Words in published guide bodies | **45,057** (longest 2,027; shortest 1,014) | script, method above. The same method gave 57,011 at `b0f371a` and 81,901 for the same 29 guides at `dbbbb94`: the final editorial pass cut length on purpose |
| FAQs in published guides | 152 | the 152 FAQ entries rendered in the print list of the 29 pages |
| Sources in published guides (the Sources lists) | **420** (every one linked inside the article text) | frontmatter `sources` summed over the 29 guides; each URL checked against the built page |
| Citation presentation | inline publisher-name links in the text, plus a collapsible Sources list with the read date; no numbered markers | QA crawl: 0 `sup.cite` elements; Sources list count equals the frontmatter on 29 of 29 |
| Pick / spec cards in guides | 90 across all 29 guides | `{{pick:}}` directives; 90 `data-pick` elements rendered |
| Pet-policy dataset | 38 rows x 13 fields | `public/pet-policies-38-managers.csv` (39 lines); one read date (2026-11-18); also a 38-row table on `/data/pet-policies` |
| Raw regional notes behind the dataset | 5 CSVs in `docs/data/` | file listing |
| Stay files | **83** (Georgia 49, California 34), all `status: unverified`, across 27 towns | `content/stays/*.yml` |
| Stays shown in the directory (each with a detail page) | **78** (Georgia 47, California 31) | `/stays` links 78 distinct detail pages; a stay is shown only with an approved Vrbo link (rule `STAYS_REQUIRE_AFFILIATE_LINK`) |
| Stays in the sitemap (indexable) | **23** | sitemap |
| Stays shown but `noindex` | 55 | robots meta read on each of the 78 listed pages |
| Stays written up but hidden (no approved link) | 5 | 83 minus 78 (`coastal-bliss-fort-bragg-hot-tub-ocean-views`, `large-oceanfront-home-cleone-fort-bragg-hot-tub`, `rosemarys-retreat-mendocino-oceanfront`, `that-cabin-on-that-lane-blue-ridge`, `woof-in-the-woods-cabin-blue-ridge`) |
| Destination pages | 2 states + 8 towns defined (6 indexable) | `src/content/destinations.ts` |
| Dog-type pages | 4 (+ index) | all live |
| Dog-rules place files | 14, all `unverified`, 0 public | `content/places/*.yml`; the section is `noindex` |
| Tools | **3** working tools (will-my-dog-be-accepted, packing list, before-you-book checklist) + the stay directory filters; no calculators | the pet cost calculator, pet cost check and host-questions tool were removed; their old addresses 301 to `/tools` and no rendered page mentions them (QA crawl) |
| Gear categories (live) | **11** | sitemap and `liveCategories()` |
| Gear products | **92 records, 65 active** (27 inactive) | `content/products.yml`. Every active product has an approved Amazon link; 65 distinct Amazon URLs render on the 11 category pages |
| Products per category (hub count, a product can be in two) | car-safety 10, car-interior 4, ramps-and-steps 5, feeding-and-hydration 9, pens-and-gates 8, comfort-and-cooling 7, water-and-beach 5, trail-and-hiking 7, cold-weather 3, safety-id-first-aid 9, rental-cleanup 9 | primary-category counts sum to 65 |
| Gear trip collections | 5 (road trip, cabin stay, beach and lake, winter, hiking), 9 to 13 cards each, no repeated product | `/gear?trip=` views on the build |
| Affiliate entries | **160**: 79 Vrbo (all approved) + 81 Amazon (71 approved, 10 not) | `content/affiliates.yml`. "Approved" is a switch in the file, not proof of a partnership |
| Trust and legal pages | 9 | sitemap |
| Pinterest pin images | 29 (one per published guide, 1000x1500) + pin sheet `docs/pinterest-pins.csv` (29 data rows) | `public/pins/`, CSV line count 30 |
| Share (link-preview) images | 30 | `public/share/` |
| Image files in `src/assets` | 211 JPG (incl. 24 for the eight town article heroes) | file listing |
| Image credit entries | 65 in `src/content/image-credits.ts` (plus pack photo credits), 8 of them the town article heroes | `key:` count |
| Fonts | 2 variable WOFF2 files (DM Sans, Fraunces) with OFL texts | `public/fonts/` |
| Automated tests | **610 passing in 47 files** | `bunx vitest run`, 38 s |
| GitHub workflows | 4 | `.github/workflows/` |
| Pages CMS collections | 6 (guides, stays, places, affiliates, products, settings) | `.pages.yml`; never opened in the live Pages CMS app (UNVERIFIED) |
| Netlify redirects in `netlify.toml` | 10 permanent redirect rules (retired guides) plus app-level redirects for retired tool, gear and guide addresses | `grep -c "from ="` |
| Markdown docs | 156 in `docs/` (642 in the folder tree) | file listing |
| Git history | 508 commits, first commit 2026-11-16 | `git log` |

## Link and disclosure counts (first 95 sitemap pages, final build; the 8 town articles are not included)

| Link type | Occurrences | Notes |
|---|---:|---|
| Amazon affiliate (`amazon.com/dp/<ASIN>?tag=pawspassage-20`) | 254 occurrences, 65 distinct URLs | guides 173, Gear 81; no tagged link lacks `sponsored` |
| Vrbo affiliate (`vrbo.com/affiliate/...`) | 50 occurrences, 24 distinct URLs on sitemap pages | stay pages 46 (2 on each of 23 indexable stays), guides 4. The 55 noindex stays are not in this count |
| Untagged Amazon links | 14 on 10 ASINs across 8 guide and Gear pages | citation "Source" and "Amazon listing as read" links, not buy buttons; none uses another tag |

Disclosure on the final build: 41 of 41 pages with an Amazon link carry Amazon's sentence ("As an Amazon Associate I earn from qualifying purchases."). Guides and Gear carry **one notice at the top and no per-button label** (0 matches for "Affiliate link ·" or "Check the current price" on any guide or Gear page). **Exception:** the Vrbo booking buttons on stay pages still show their own short label ("Affiliate link · We may earn a commission if you book, at no extra cost to you."), and `/affiliate-disclosure` still says every buy or booking button carries a label; those come from code and are an open owner decision. NOT checked: whether any Amazon product or Vrbo link currently resolves or pays (those hosts were not requested), or legal sufficiency of the wording. See `docs/MONETIZATION_READINESS.md`, whose crawl counts are older.

## Re-run

```
git archive HEAD | tar -x -C <scratch>            # or git worktree add
cd <scratch> && bun install && NITRO_PRESET=node-server bunx vite build
PORT=4291 node .output/server/index.mjs &
curl -s localhost:4291/sitemap.xml | grep -o '<loc>[^<]*' | wc -l
bunx vitest run
```
