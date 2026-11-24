# Buyer asset inventory: Paws & Passage

Verified 2026-11-23 against the repository (branch `claude/affiliate-setup`, code verified at commit `902dde9`; production `main` is `b81db6c`, an ancestor of the branch) and the live site https://www.pawsandpassage.com. Every number below was counted from the repo, produced by the app's own data modules, or fetched live on this date. Nothing is taken from older documents. Raw evidence, commands and the per-guide table: `docs/flip/audit-assets.md`.

Scope of the sale: a pre-revenue, turnkey starter site. There is no traffic history, no revenue history and no accounts in the package (see section 12).

Branch vs live: the branch holds unmerged fixes (7 commits since `b81db6c`: Amazon link swap in `content/affiliates.yml` and `content/products.yml`, two car guides, a packing-list line, new docs). Live and branch give the same 98-URL sitemap. Product counts differ by one (main: 54 active products and 54 approved Amazon links; branch: 53 and 53). Merge the branch before handover so the buyer receives the numbers below. A later commit (`945c340`, docs only) landed while this audit ran.

## 1. Headline numbers

| Asset | Quantity | Where it lives | Verified how | Buyer value |
|---|---|---|---|---|
| Published guides | 30 (23 Markdown, 7 TypeScript) | `content/guides/*.md`, `src/content/guides/*.ts` | Throwaway vitest probe over the app's `allGuides` + `isPublic()`; live sitemap lists 30 `/guides/<slug>` plus `/guides` | Core content; each has FAQs, sources and a research brief |
| Draft guides (not public, 404 on live) | 3 (all Markdown) | `content/guides/breed-restrictions-at-vacation-rentals.md`, `pet-friendly-listing-red-flags.md`, `bringing-a-dog-to-a-no-pets-rental.md` | Same probe: status `draft` | Unfinished inventory, ready to finish and publish |
| Words in published guide bodies | 76,890 (Markdown 59,699; code 17,191); draft bodies 6,343 | as above | Probe: whitespace-split word count of the full body text (includes `{{pick:}}` directives and Markdown markup; excludes FAQs and sources) | Size of the content library |
| Original pet-policy dataset | 38 rows x 13 columns, read 2026-11-18, one source URL per row | `public/pet-policies-38-managers.csv`, `src/content/manager-policies.ts`, `docs/data/pet-policies-*.csv` (63 lines), route `/data/pet-policies` | Parsed CSV; live CSV is byte-identical to the repo file (HTTP 200, 8,660 bytes); live page returns Dataset JSON-LD | The one original data asset; drives a tool, a page and counts in guides |
| Stay directory | 37 stay files; 32 listed and earning; 5 written up but hidden | `content/stays/*.yml` | Probe over `allStayRecords()` and `visibleStays()` | Programmatic local pages with pet-policy fields |
| Dog-rules places | 14 files, all `unverified`; 0 public | `content/places/*.yml` | Probe over `visiblePlaces()`; live `/dog-rules` is `noindex, nofollow` and not in the sitemap | A research backlog, not a live asset |
| Planning tools | 4 live (plus 2 redirects) | `src/routes/tools.*.tsx`, `src/components/site/*`, `src/lib/*` | Code read plus the test suite (section 6) | Interactive pages that link to guides |
| Gear catalog | 74 product records; 53 active; 53 active with an approved Amazon link; 21 inactive | `content/products.yml`, `content/affiliates.yml` | Probe: `resolveProductLink()` returns an affiliate link for all 53 active products | Gear hub and in-article picks |
| Affiliate links | 96 entries: 33 Vrbo (all approved), 63 Amazon (53 approved, 10 not approved) | `content/affiliates.yml` | YAML parsed and counted | Wiring is in place; accounts are not transferable |
| Sitemap | 98 URLs live, equal to the locally generated 98 | `src/lib/sitemap-entries.ts`, `/sitemap.xml` | Live fetch 2026-11-23 vs probe of `sitemapEntries()`: no difference | Index-ready URL set |
| Pinterest pins | 30 pin images (1000x1500) + 30 CSV rows | `public/pins/*.jpg`, `docs/pinterest-pins.csv` | File count, `file` dimensions, CSV parse (8 boards) | Ready-to-post pins, no account |
| Share (Open Graph) images | 31 (30 guide images + `default.jpg`), 1200x630 | `public/share/` | File count and `file` | Link previews |
| Automated tests | 486 pass in 33 files | `src/test/*.test.ts(x)` | `bunx vitest run` | Regression safety |

## 2. Guides

| Asset | Quantity | Where it lives | Verified how | Buyer value |
|---|---|---|---|---|
| Published guides | 30 | see section 1; full list with word counts in `docs/flip/audit-assets.md` | Probe + live sitemap (31 guide URLs = 30 guides + index) | Search-targeted content |
| Longest / shortest published guide | 3,324 words (`vacation-rental-with-a-senior-dog`) / 1,679 (`pet-friendly-vacation-rental-checklist`) | as above | Probe | Depth range |
| FAQs inside published guides | 166 | frontmatter `faqs` | Probe sum | Visible Q&A (no FAQPage markup, see section 9) |
| Source citations inside published guides | 491 | frontmatter `sources` | Probe sum | Verifiability |
| Guides carrying gear picks | 4 published (14 distinct products appear across public guides) | frontmatter `gear` | Probe | Monetisation hooks |
| Fact-check / claims records | `docs/FACTCHECK-*.md` and `docs/CLAIMS-*.md` per guide | `docs/` | File listing | Audit trail for claims |
| Publish gate | A guide is public only if status = published, research complete, no unverified claims, and approved by/on filled | `src/content/publish-rule.ts` (`guideIsPublic`) | Code read; 30 of 33 pass | Prevents unfinished text going live |

All 33 guides have `research.researchComplete = true` and an empty `unverified` list; the 3 drafts are held back by status `draft`.

## 3. Original pet-policy dataset

| Item | Value | Where / how verified |
|---|---|---|
| Rows | 38 managers | `public/pet-policies-38-managers.csv` (39 lines with header) |
| Columns (13) | manager, region, place, dog_or_pet_limit, limit_basis, weight_limit, breed_rule, pet_fee_as_stated, dogs_in_pool_or_hot_tub, minimum_dog_age, leaving_dog_alone, source_page, read_on | CSV header |
| Read date | single date, 2026-11-18, on all 38 rows (`dataDate` in `src/content/manager-policies.ts`) | CSV `read_on` column has 1 distinct value |
| Sources | 38 distinct manager policy-page URLs, one per row | CSV `source_page` has 38 distinct values |
| Regions | North Carolina 10, Georgia 9, Smoky Mountains TN 7, Colorado and Florida Gulf Coast 6, California 5, Many regions 1 | counted from CSV |
| Fields filled | dog limit stated 24; weight limit stated 6; breed rule named 2, unnamed 3, none 2, not stated 31; fee stated 25 (3 of them $0), not stated 13; pool/hot tub wording 7; minimum age 5; leaving-dog-alone wording 8 | counted from CSV |
| Raw notes | 5 regional CSVs in `docs/data/` (`pet-policies-california`, `-colorado-gulf`, `-georgia`, `-north-carolina`, `-smokies-tn`) | file listing |
| Re-check procedure | `docs/DATA-RECHECK-LOG.md`; CSV rebuilt by `scripts/make-policy-csv.mjs` | file listing |
| Where it is used | `/data/pet-policies` page (filter by region, CSV download, Dataset JSON-LD declaring CC BY 4.0), "Will my dog be accepted?" tool, counts quoted in guides (for example the fees guide title "25 of 38 State a Fee") | code read; live page and guide title fetched |

Original vs public facts: each cell is a public fact stated on a manager's own page. What is original is the selection of 38 managers, the normalised 13-column structure, the classification (for example `limit_basis`, `breed_rule`) and the dated reading with a source link per row. It is a convenience sample, not a survey; the page says so. The licence statement (CC BY 4.0) appears in the page's JSON-LD only; the buyer should decide whether to keep it. Policies change; the data is a dated snapshot and is 5 days old on the date of this audit.

## 4. Directory, destinations, dog rules, dog pages

| Asset | Quantity | Where it lives | Verified how | Buyer value |
|---|---|---|---|---|
| Stay files | 37 (Georgia 24, California 13); all status `unverified`; 0 `verified`; no photo permission recorded (`photoPermission: false` on all 37) | `content/stays/*.yml` (`src/content/stays/verified.ts` holds no records) | grep and probe | Entries show a "Not yet verified" label |
| Stays listed on the site | 32 (Georgia 22, California 10) | rule `STAYS_REQUIRE_AFFILIATE_LINK = true` in `src/content/publish-rule.ts` | `visibleStays()` | Only stays that can earn are shown |
| Stays earning via an approved Vrbo deeplink | 32 (each has its own `vrbo-<listing id>` entry, approved) | `content/affiliates.yml` (33 approved Vrbo entries = 32 per-listing + 1 generic `vrbo`), `src/content/stays/index.ts` | `stayEarns()` count = 32; all 32 sourceUrls are vrbo.com | Monetised directory |
| Stays written up but hidden | 5: `coastal-bliss-fort-bragg-hot-tub-ocean-views`, `large-oceanfront-home-cleone-fort-bragg-hot-tub`, `rosemarys-retreat-mendocino-oceanfront`, `that-cabin-on-that-lane-blue-ridge`, `woof-in-the-woods-cabin-blue-ridge` | `content/stays/` | `stayAwaitingAffiliateLink()` equivalent: no derived affiliate id | Go live when a deeplink is added |
| Stay pages in the sitemap | 23 (plus the `/stays` index) | `/sitemap.xml` | live sitemap: 24 `/stays` URLs | Indexable pages (thin ones are kept out by `indexableStays`) |
| Towns with stays | 13 (see audit file for counts) | `content/stays/*.yml` `town` | probe | Local coverage |
| Destination pages | 2 states (Georgia, California) and 8 town definitions in code (Blue Ridge, Ellijay, Helen, Dahlonega; San Diego, Santa Barbara, Monterey, Mendocino) | `src/content/destinations.ts` (code, not CMS) | live sitemap has 9 destination URLs: index, 2 states, 6 towns (Monterey and Mendocino are not indexed) | Hub pages |
| Dog-rules places | 14 (California 10, Georgia 4; 6 state parks, 4 beaches, 2 national parks, 1 national forest, 1 trail) | `content/places/*.yml` | grep and probe; all `status: unverified`, no `lastChecked` | 0 public. The `/dog-rules` section is live but noindexed and empty of verified places. Verification backlog: `docs/COWORK-VERIFY-PLACES.md` |
| Dog-type pages | 4 live (`escape-artists`, `big-dogs`, `multi-dog-families`, `senior-dogs`) + `/dogs` index | `src/content/dog-types.ts`, `src/routes/dogs.*.tsx` | live sitemap: 5 `/dogs` URLs | Collections linking existing guides |
| Stay search | Filters (the per-stay pet-fee calculator was removed 2026-11-24 to avoid fee maintenance) | `src/lib/stay-search.ts` | code read; `stay-fee-calculator.test.tsx` passes | Tool value on stay pages |
| Stay22 map | Wired but off (account ID empty in `content/settings.yml`) | `src/components/site/Stay22Map.tsx` | settings read | Needs the buyer's own account |

## 5. Gear catalog

| Asset | Quantity | Where it lives | Verified how | Buyer value |
|---|---|---|---|---|
| Product records | 74 | `content/products.yml` (editable in Pages CMS) | YAML parse | Researched facts with a spec source and verification date each |
| Active products | 53 | `active: true` | probe | Shown in guides, packing tool and `/gear` |
| Active products with an approved Amazon link | 53 (all active ones; none fall back to a maker link) | `content/affiliates.yml` | `resolveProductLink()` kind = affiliate for all 53 | Every visible pick can earn |
| Inactive products | 21 | `active: false` | parse | Kept on file; hidden |
| Amazon entries not approved | 10 (`amk-me-and-my-dog`, `baskerville-ultra-muzzle`, `gunner-g1-kennel`, `kong-bench-seat-cover-hammock-xl`, `kurgo-dog-first-aid-kit`, `north-states-petyard-passage-8-panel`, `sleepypod-clickit-range`, `midwest-lifestages-dog-crate`, `sleepypod-clickit-sport-plus`, `kurgo-rover-backseat-bridge`) | `content/affiliates.yml` | parse | Off until back in stock or retired |
| Hub categories | 12 defined, 12 live (3 or more active products each): road-trips 23, cabin-vacations 11, beach-vacations 5, senior-dogs 6, large-dogs 8, travel-safety 8, feeding-and-hydration 9, travel-comfort 6, car-safety 8, winter-travel 3, outdoor-adventures 12, cleaning-and-rental-protection 8 (products can sit in several categories) | `src/content/gear-categories.ts` (code), membership in `content/products.yml` | probe `categoryProducts()` | `/gear` plus 12 category pages (13 sitemap URLs) |
| Products used in public guides | 14 distinct | guide frontmatter `gear` | probe | Contextual picks |
| Product photos | Photo-less cards by design (`imageRights: none`) where no rights exist | `content/products.yml` | field read | No image-rights risk |

## 6. Tools (all run in the browser, nothing is sent anywhere)

| Tool | Route | What it does | Verified how |
|---|---|---|---|
| Will my dog be accepted? | `/tools/will-my-dog-be-accepted` | Takes number of dogs, weights and breed group; compares against the 38 managers and marks each fits / ask / conflict with reasons (`src/lib/dog-accepted.ts`) | Code read; `dog-accepted.test.ts` passes |
| Pack your dog's bag | `/tools/packing-list` | 15 packing items in 7 groups, tailored by a 5-flag trip profile (car, rental, senior, bolter, no fence); item detail with gear links; ticks saved in the browser (`src/lib/packing.ts`, `PackingBuilder.tsx`) | Code read; `packing.test.ts` passes |
| Pet cost and host confirmation | `/tools/pet-cost-check` (old `/tools/cost-calculator` and `/tools/host-questions` redirect with 301) | 3-step workflow: trip details, compare up to 3 quotes with the real pet-fee total (`petFeeTotal`: per stay / night / dog / dog-night), then generate a message asking the host to confirm the fee in writing | Code read; `pet-fee-calc.test.ts`, `pet-cost-workflow.test.tsx`, `tools-fixes.test.tsx` pass |
| Before-you-book checklist | `/tools/checklist` | 5 groups, 25 items, saved in the browser, printable (`src/content/checklist.ts`) | Code read; item count by script |

The same pet-cost workflow can be embedded inside an article (`embeddedTool: pet-cost-workflow`). Tools were verified by reading code and running their tests; they were not driven in a browser in this audit.

## 7. Affiliate wiring (what is approved and what is not; no commission figures)

| Item | State | Where | Verified how |
|---|---|---|---|
| Amazon Associates tag | `pawspassage-20`; every Amazon link is stored as `...?tag={amazonTrackingId}` and resolved from one setting, so a buyer swaps one value to retag all links; empty value hides all Amazon links | `content/settings.yml`, `src/content/affiliates.ts` | Settings read; `amazon-tracking-id.test.ts` passes |
| Amazon links | 63 entries: 53 approved, 10 not approved | `content/affiliates.yml` | parse |
| Amazon disclosure sentence | Added automatically wherever Amazon links appear | `AMAZON_DISCLOSURE` in `src/content/affiliates.ts`; `AffiliateNotice.tsx` | Code read |
| Vrbo | 33 entries, all approved: 1 generic + 32 per-listing deeplinks | `content/affiliates.yml` | parse |
| Link rel | Affiliate links carry `sponsored nofollow noopener`, never `noreferrer` (Vrbo needs the referrer) | `src/content/gear-links.ts` | Code read |
| Brand-name rule | Vrbo/Expedia names kept out of titles and meta tags | `src/test/meta-brands.test.ts` | Test passes |
| Stay22 | Not set up (ID empty) | `content/settings.yml` | read |
| Not transferable | The Amazon Associates and Vrbo/Expedia accounts belong to the seller; the buyer applies for their own and replaces IDs and links | n/a | `docs/AFFILIATE-AND-SELLING.md` |

## 8. Pinterest and share assets

| Asset | Quantity | Where | Verified how |
|---|---|---|---|
| Pin images | 30, 1000x1500 JPG, one per published guide, 5.7 MB total | `public/pins/` | `ls`, `file`, `du` |
| Pin sheet | 30 rows across 8 boards (Dog-Friendly Vacations, Cabin Vacations, Large Dog Travel, Dog Travel Gear, Multiple Dog Travel, Travel Cost Planning, Senior Dog Travel, Vacation Rental Planning); each row has image URL, title, description, destination URL with UTM tags | `docs/pinterest-pins.csv` | CSV parse |
| Share images | 31 at 1200x630 (30 + default), 3.5 MB | `public/share/` | `ls`, `file` |
| Generators | `scripts/make-pin-sheet.py`, `scripts/make-share-images.py` | `scripts/` | file listing |
| Pinterest strategy and setup docs | `docs/PINTEREST-STRATEGY.md`, `docs/PINTEREST-SETUP.md`, `docs/cowork/05-pinterest-claim-and-pins.md`, `docs/cowork/10-pinterest-pins.md` | `docs/` | file listing |
| Footer Pinterest link | Set to `https://www.pinterest.com/paws_and_passage/` in settings (the account is not transferred) | `content/settings.yml` | read |

## 9. SEO implementation

| Item | State | Verified how |
|---|---|---|
| Sitemap | `/sitemap.xml` generated from the same rules as the pages: 98 URLs (30 guides, 24 `/stays` URLs, 13 gear, 9 destinations, 5 dogs, 5 tools, `/`, `/data/pet-policies`, 9 trust/info pages); `lastmod` set on guides and stays | Live fetch vs probe: identical |
| Sitemap by section | guides 31, stays 24, gear 13, destinations 9, tools 5, dogs 5, home 1, data 1, and one each for about, contact, list-your-property, affiliate-disclosure, privacy, terms, editorial-standards, methodology, corrections | counted from live XML |
| Titles | `pageHead()` sets title and description per page, with a 60/160 character limit enforced in the guide schema; live guide title example: "Rental Pet Fees: 25 of 38 State a Fee \| Paws & Passage" | `src/lib/seo.ts`, `src/content/schema.ts`; live fetch |
| Canonical | Absolute canonical on every page, on `www.pawsandpassage.com` | live fetch of 5 page types |
| Robots | `public/robots.txt` allows Googlebot, Bingbot, Twitterbot, facebookexternalhit and `*`, and lists the sitemap; live robots.txt is identical. Thin or empty pages get `noindex, nofollow` (live `/dog-rules` does) | file and live fetch |
| Structured data (JSON-LD) | Article and BreadcrumbList on guides; BreadcrumbList on stays and gear; Dataset + DataDownload on `/data/pet-policies`; Organization on every page; LodgingBusiness, TouristDestination and PostalAddress defined in code for stays and destinations (a LodgingBusiness block did not appear on the one unverified stay fetched live). FAQPage was deliberately removed (decision `docs/recovery/FAQPAGE-DECISION.md`); the visible FAQ accordion remains | `grep` of `@type` in `src`; live fetch of 5 pages |
| IndexNow | Key file `c020721357f8d6912ac3f66e4c956986.txt` served live (HTTP 200); submit script `scripts/indexnow.mjs` (dry run by default, `--send` to submit); manual workflow `.github/workflows/indexnow.yml` | live fetch; file read |
| Security headers | Referrer-Policy and Permissions-Policy set; no Content-Security-Policy | `netlify.toml`, `src/lib/security-headers.ts`, `security-headers.test.ts` |
| Redirects | Retired guides and old tool URLs 301 | `netlify.toml`, route files |
| Index status | Not verifiable from here: no Search Console access in this audit | n/a |

## 10. Trust pages, content workflow, automation

| Asset | Quantity | Where it lives | Verified how |
|---|---|---|---|
| Trust and info pages | 9: about, contact, corrections, editorial-standards, methodology, privacy, terms, affiliate-disclosure, list-your-property | `src/routes/*.tsx` (code files; `test: trust-pages.test.tsx`) | All 9 in the live sitemap. Legal pages were not lawyer-reviewed (owner decision recorded in `BUYER_HANDOVER.md`) |
| Pages CMS collections | 6: guides (`content/guides`), stays (`content/stays`), places (`content/places`), affiliates (`content/affiliates.yml`), products (`content/products.yml`), settings (`content/settings.yml`); uploads go to `public/uploads` (currently empty) | `.pages.yml`; `pages-config.test.ts` | Config read. `.pages.yml` states it has not been opened in the live Pages CMS app |
| NOT editable without code | The 7 TypeScript guides; destinations and towns (`src/content/destinations.ts`); gear category copy (`src/content/gear-categories.ts`); dog-type pages (`src/content/dog-types.ts`); the 38-manager data (`src/content/manager-policies.ts` + CSV script); checklist items (`src/content/checklist.ts`); packing items (`src/lib/packing.ts`); all 9 trust pages; navigation and design | `src/` | Not in `.pages.yml` |
| GitHub workflows | 4: `ci.yml` (tests and build on push/PR), `site-health.yml` (Mondays 06:17 UTC: tests, link report, freshness report), `monthly-digest.yml` (3rd of each month, 07:43 UTC), `indexnow.yml` (manual) | `.github/workflows/` | File read (schedules not observed running in this audit) |
| Scripts | `verify-site.mjs` (live site checker), `site-health.mjs`, `indexnow.mjs`, importers for stays and affiliate links, worksheet generators, perf harness `scripts/perf/` | `scripts/` | Listing |

## 11. Tests, build, performance, docs

Results of 2026-11-23 on this checkout (Bun 1.4.4, Node 22.23.4):

| Check | Result |
|---|---|
| `bunx vitest run` | 33 test files passed, 486 tests passed, 0 failed (21.9 s) |
| `bunx tsc --noEmit` | exit 0, no output |
| `NITRO_PRESET=node-server bunx vite build` | exit 0 (client 2,298 modules, SSR 2,147 modules; no build errors) |
| `bun run lint` | 0 errors, 12 warnings |

Performance already measured (lab, throttled headless Chromium, Pixel 5 profile; from `docs/recovery/PERF-BEFORE-AFTER.md` and `docs/recovery/LCP-INVESTIGATION.md`, dated 2026-11-18; not re-run here):

- Lab: home page JS parsed 1,073 KB to 626 KB; first-party JS on the wire about 316 KB to about 197 KB; home LCP 6,148 ms to 5,288 ms (Slow 4G, 4x CPU, brotli); FCP flat within noise (about 0.7 to 0.9 s).
- Lab, after the later hero-image fix: home LCP 5,408 ms to 2,404 ms on Slow 4G + 4x CPU in the HTTP/1.1 lab server; 4,584 ms in the HTTP/2 lab server; 576 ms on Fast 4G.
- Field: none. CrUX and PageSpeed Insights could not be read, and the domain is new. No Lighthouse score was recorded.

Docs the buyer receives: 135 Markdown files in `docs/` (plus `docs/audit`, `docs/cowork`, `docs/data`, `docs/products`, `docs/recovery` with 33 files), including operations and transfer material (`OPERATIONS-HANDBOOK.md`, `DNS-AND-TRANSFER.md`, `EMAIL-AND-TRANSFER.md`, `SECURITY-AND-RECOVERY.md`, `ROLLBACK.md`, `COSTS-AND-ACCOUNTS.md`, `SOP-weekly/monthly/quarterly.md`, `LAUNCH-CHECKLIST.md`, `GO-LIVE-PLAN.md`), per-guide fact-check and claims records, affiliate and Pinterest guides, 11 Cowork task prompts (`docs/cowork/`), audits (`docs/audit/`, `docs/recovery/`), plus `BUYER_HANDOVER.md`, `HANDOVER.md`, `README.md`, `AGENTS.md`. Some are out of date (section 13).

## 12. What the buyer does NOT receive

| Not included | Notes |
|---|---|
| Traffic or search history | New domain (registered 2026-11-17 per the seller's records). No Search Console or GA4 history is in the repo; indexing status is unknown. GA4 measurement ID `G-1J97C8CPC1` is in settings but the GA4 property and its data are the seller's account |
| Revenue or earnings | The package contains no earnings data. Sold as pre-revenue |
| Accounts | Amazon Associates, Vrbo/Expedia affiliate, Stay22 (not set up), Pinterest (`paws_and_passage`), Google (GA4, Search Console), Bing, Netlify, GitHub, Namecheap, Pages CMS login and Lovable are the seller's. The buyer creates their own and replaces the IDs and links |
| Email | `hello@pawsandpassage.com` is a Namecheap Private Email mailbox; the subscription is not moved with the domain and its transfer is unconfirmed (`docs/EMAIL-AND-TRANSFER.md`) |
| Domain and hosting | Transfers are written procedures (`docs/DNS-AND-TRANSFER.md`); none has been rehearsed |
| Photos of real rentals | No photo permission recorded on any stay file; stock photos are Unsplash; `src/assets` holds 148 JPG files |
| Home hero image | Now a credited Unsplash photo (`hero-porch*.jpg`, photographer Cody Scott Milewski, credited in `src/content/image-credits.ts`), replacing the earlier AI illustration. Unsplash gives usage rights, not ownership or exclusivity: the buyer gets the right to keep using it under the Unsplash License, not the photo's copyright, and anyone else may use it too |
| Verified places or verified stays | 0 verified stays and 0 verified dog-rules places |
| Subscribers or newsletter | There is no list or newsletter |

## 13. Gaps and stale claims in existing docs

Corrected values are from the 2026-11-23 verification above.

### BUYER_HANDOVER.md

| Claim in the file | Correct value |
|---|---|
| "directory of verified places to stay" (section 1) | 37 stay files, all `unverified`; 32 listed with a "Not yet verified" label; 0 verified |
| "the site has 24 guides: 9 are Markdown ... and 15 are code files" (section 1) | 33 guide files: 26 Markdown (23 published, 3 draft) and 7 code. 30 are published |
| "The towns, the gear product lists and the legal pages are still code files" (section 1) | Gear products are in `content/products.yml` and the Pages CMS "products" collection. Towns, gear category copy, dog-type pages and legal pages are still code |
| "Stays work the same way: only Verified stays appear" (section 3) | Verified and unverified stays can appear, but only when an approved affiliate link exists (`STAYS_REQUIRE_AFFILIATE_LINK = true`). Section 4 of the same file already says unverified stays are listed |
| "passes its 155 automatic tests" (section 5) and "`npx vitest run` (155 tests)" (section 9) | 486 tests in 33 files |
| "Affiliate programs: Not set up yet" (section 5 table) | Vrbo: 33 approved links (32 per-listing). Amazon: tag `pawspassage-20`, 53 approved links on 53 active products. Stay22: not set up. The accounts remain the seller's |
| "you see Articles, Stays, Affiliate links and Business settings" (section 6 step 5) | `.pages.yml` defines 6 collections: guides, stays, places, affiliates, products, settings |
| "Articles: `content/guides/*.md` (one converted so far...)" (section 9) | 26 Markdown guide files; 7 remain in `src/content/guides/*.ts` |
| "15 of the 24 guides, the towns, the gear product lists and the legal pages are code" (section 8 item 1) | 7 of 33 guides are code; gear product lists are CMS-editable |
| "planning tools (a checklist and a pet cost and host confirmation tool)" (section 1) | 4 tools: will-my-dog-be-accepted, packing-list, pet-cost-check, checklist |
| "198 automatic site checks and 61 real-browser checks" / "216 checks" / "7 pages compared" (section 5) | Dated 2026-11-16/17 results; `docs/GO-LIVE-PLAN.md` records 321 of 321 live checks on 2026-11-19 (not re-run in this audit) |

### HANDOVER.md

| Claim in the file | Correct value |
|---|---|
| Stays live in `src/content/stays/verified.ts` | `verified.ts` has no records; stays are `content/stays/*.yml` (37 files) |
| Affiliate links in `src/content/affiliates.ts` | Links are in `content/affiliates.yml` (96 entries); the `.ts` file only reads them |
| Email, site URL, GA4 ID in `src/config/site.ts` | They are in `content/settings.yml` (also the Amazon tag, Pinterest URL and Stay22 ID); `site.ts` reads them |
| Guides are `src/content/guides/<slug>.ts`, added by copying a file | New guides go in `content/guides/<slug>.md` (Pages CMS); only 7 legacy guides are `.ts` |
| Guide public rule: published, researchComplete, unverified empty | Also requires `approvedBy` and `approvedOn` (`guideIsPublic`) |
| "Only `verified` stays appear on the live site" and "Booking buttons appear only for verified stays with an approved link" | Listed stays are unverified-labelled or verified, and only those with an approved affiliate link |
| Sitemap: "returns 503 until siteUrl is set... then add the Sitemap line to `robots.txt`" | `siteUrl` is set in `content/settings.yml`; `robots.txt` already has the Sitemap line; live sitemap has 98 URLs |
| "Still needed before launch: business email, domain, GA4 ID; approved affiliate partnerships" | Email (`hello@pawsandpassage.com`), domain, GA4 ID, Vrbo and Amazon approvals are all configured. Still true: no verified stays and legal pages unreviewed |
| "It builds for Cloudflare Workers by default"; Hostinger section | Production is Netlify (`netlify.toml`); `bun run build` is the default build; `build:node` is the Node build. The Hostinger notes are a 2026-11-16 test, not the live setup |
| Content items editable only in code (stays, links, settings) | These are CMS-editable now |

### docs/SALE-READINESS.md

| Claim in the file | Correct value |
|---|---|
| "Vrbo approved but links are generic" | 32 per-listing Vrbo deeplinks plus 1 generic, all approved. Stay22 ID is still empty (still true) |
| "15 code-only guides" (Content row) | 7 code-only guides |
| "24 guides" (the where-the-site-stands paragraph) | 30 published guides (33 files) |
| "Amazon" listed only among excluded accounts | Amazon Associates tag and 53 approved product links are live in the site (the account is still excluded) |
| "Pages CMS not yet verified" | Still true (`.pages.yml` header) |
| "Revenue is $0"; "bought 2026-11-17"; "$34.86 a year to run"; Empire Flippers 2.2x to 2.4x | Not verifiable from the repo. The newer `docs/research/MARKETPLACES-AND-COMPS-2026-11.md` (read 2026-11-23) lists Empire Flippers as not a fit and does not repeat the multiples. Treat the cost, multiple and revenue lines as unverified |

### README.md

| Claim in the file | Correct value |
|---|---|
| "a directory of verified stays" | Stays are unverified-labelled; 0 are verified |
| "Only `verified` stays appear on the live site" and "Booking buttons appear only for verified stays with an approved affiliate link" | See HANDOVER.md row above |
| Guide rule omits the approval fields | `approvedBy` and `approvedOn` are required as well |
| "Owner's handbook: see HANDOVER.md" | HANDOVER.md is largely stale; `BUYER_HANDOVER.md` is the current guide, itself needing the corrections above |
| "bun run lint ... existing code has Prettier errors" | Lint now reports 0 errors and 12 warnings |
| "Edited in Lovable (project link)" | Lovable is not needed to build, host or edit (`BUYER_HANDOVER.md`) |

Also noted, outside the four files: `docs/recovery/PERF-BEFORE-AFTER.md` says `src/assets` has 116 images; there are now 148 JPG files.
