# Live production audit: https://www.pawsandpassage.com (2026-11-18, ~22:57 to 23:25 UTC)

Audited the ACTUAL production site, not a local build. Method: curl for headers/redirects, a crawl of all sitemap URLs plus every internal link found (80 pages), Playwright with the preinstalled Chromium (proxy-routed) for interaction, screenshots and lab performance. Affiliate links were never clicked (hrefs recorded only).

## Summary (10 lines)

1. DEPLOY STATUS: LIVE. `/gear` returned 200 on the first poll (22:57:13 UTC); the 60-second polling loop was not needed. Live site contains the new features (gear hub, 12 gear categories, Methodology, Corrections, pet-cost-check, will-my-dog-be-accepted, packing-list, data page). Netlify exposes no commit SHA in headers or HTML, so "built from 045251c" is INFERRED from the feature set, not proven (COULD-NOT-VERIFY the exact commit).
2. 80 HTML pages crawled, all 200: 68 in the sitemap, 12 noindex pages outside it. Sitemap equals the indexable set exactly (every sitemap page lacks noindex; every noindex page is absent from it).
3. Every page: exactly one H1, title, meta description, absolute clean canonical, 6 og tags, 4 twitter tags, Impact meta tag, GA4 tag. All JSON-LD parses. No FAQPage, no rating or review schema, no Person author.
4. All 9 retired-guide and tool redirects return 301 to the right target; apex and http redirect to https://www. Trailing-slash URLs redirect with 307 (temporary), not 301.
5. All 11 filter types, 4 dog counts, 4 weight thresholds and 3 combos on /stays match an independent expectation built from each stay's own page: unknown never counts as yes. Fee calculator arithmetic is correct for both known-fee stays and the manual entry.
6. Affiliate hygiene is clean: 19 `vrbo.com/affiliate` hrefs (9 stays x 2 buttons, plus 1 in a guide), all `sponsored nofollow noopener`, each with the disclosure sentence beside it. The 9 deeplinks match `content/affiliates.yml` and each stay's source listing id. No affiliate link renders anywhere in /gear, so no disclosure shows there (correct).
7. AI disclosure appears only on /editorial-standards. Only email on the site is hello@pawsandpassage.com. No lorem, placeholder or draft pages, no stay photos.
8. DEFECTS: 0 critical, 0 high, 3 medium, 8 low (+ 3 suspected, 2 needs-your-action items). Details below.
9. Biggest finding: the three security headers in netlify.toml (X-Frame-Options, Referrer-Policy, Permissions-Policy) are NOT sent on any HTML page (only on static files), and the "Powered by Netlify" badge is visible on every public page.
10. Lab performance is the same as the documented after-numbers within noise (home LCP 4.9 s on emulated Slow 4G + 4x CPU, still image-bound). No real-user data exists.

## 1. Deploy poll

| Time (UTC) | /gear | Source |
|---|---|---|
| 22:57:13 | 200 | curl -s -o /dev/null -w '%{http_code}' (VERIFIED) |

docs/ROLLBACK.md says /gear was 404 before the launch batch; it is now 200. To roll back (Netlify "Publish deploy" on the de4c0b2 build), /gear should return 404 again.

## 2. Defects

### VERIFIED

| # | Sev | URL | Evidence | Suggested fix |
|---|---|---|---|---|
| D1 | Medium | Every HTML page, e.g. https://www.pawsandpassage.com/stays | HTML responses carry only `strict-transport-security: max-age=31536000` and `x-content-type-options: nosniff`. `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (netlify.toml lines 28-33, `for = "/*"`) are absent. The same headers DO arrive on /assets/index-0egDzKRb.js, /share/default.jpg and /favicon.ico. Pages are served by the server runtime, which Netlify's `[[headers]]` does not touch. Also absent on 404 responses. | Emit the three headers from the server handler (Nitro `routeRules`/response middleware) or an edge function, then re-test with `curl -I`. Decide on HSTS `includeSubDomains` separately (current value has none). |
| D2 | Medium | Every page (script `/.netlify/scripts/hud?variant=public`, 80 of 80 pages) | A "Powered by Netlify" pill is rendered fixed at the bottom right on production at 390px and 1280px. At 390px it sits over body text (seen over the stay card text on /stays, product text on /gear/car-safety, form on the tool page). Netlify's own script comment calls it "the badge and owner toolbar Netlify injects on published sites". | NEEDS-YOU: turn the badge/toolbar off in the Netlify site settings (owner login; I did not verify the exact setting name). For a sellable publication this should not be there. |
| D3 | Medium | Home https://www.pawsandpassage.com/ "Browse by travel style" and "Browse by must-have" tiles | Five tiles link to filters that return 0 stays on the 9 live stays: Beach houses `/stays?beach=true`, Unique stays `/stays?type=unique`, Fully fenced yards `?fenced=true`, Large-dog friendly `?large=true`, No pet fee `?noFee=true`. Also dead on the filter panel: No stated breed restrictions (0), Beach access (0). Result page just shows "0 stays". | Hide or demote tiles whose filter has no match (data-driven), or show a "none confirmed yet, ask us / see all stays" message. Not a filter bug: unknown correctly never matches. |
| D4 | Low | Stay pages, e.g. /stays/romantic-cabin-with-secluded-hot-tub-and-mountain-views-cherry-log | Titles are 89 to 119 characters (e.g. "5-Star Cabin with Views and Hot Tub (Cherry Lake), dog-friendly cabin in Blue Ridge \| Paws & Passage" = 100); Google truncates around 60. Meta descriptions are 76 to 97 characters (short; the summary string). | Shorten stay titles to about 60 characters (name + town); lengthen descriptions to 120-155 with the dog limit and fence facts. |
| D5 | Low | /stays/, /gear/, /guides/<slug>/ (any trailing-slash URL) | 307 Temporary Redirect to the slashless URL (checked 3). Canonical tags are correct, so no duplicate risk, but a 307 passes weaker signals than a 301. | Make the router/server redirect 301. |
| D6 | Low | /guides/new-years-eve-with-a-dog-in-a-vacation-rental and /guides/vacation-rental-with-a-senior-dog | Both link to `/guides/how-many-dogs-can-you-bring-to-a-vacation-rental#the-38-manager-pages-we-checked`; that id does not exist on the target (its h2 ids end at `how-sure-we-are`). All other in-page anchors found in the crawl resolve, including every `/gear/<cat>#<product>` link from the 9 Gear blocks. | Point to an existing heading id (e.g. `#how-many-dogs-do-rental-managers-actually-allow`) or add the missing heading. |
| D7 | Low | Stay page fee calculator, e.g. /stays/cozy-romantic-cabin-with-a-view-and-hot-tub-near-downtown | Typed values outside the input limits are accepted: nights 0 shows "$95 for 0 nights"; dogs 0 shows "$0" (per-dog) or "$50 for 5 nights, 0 dogs" (per stay); nights 400 accepted though max is 60. Over-limit dogs shows "The listing allows up to 1 dogs." (plural error; romantic-cabin-with-secluded-hot-tub page). Negative nights correctly shows "Enter your nights and dogs." | Treat nights < 1, dogs < 1 and nights > max as "enter valid numbers"; use "1 dog". |
| D8 | Low | /gear/<category> product cards | Product title links (e.g. https://sleepypod.com/products/clickit-range) have `rel="noopener noreferrer"` without `nofollow`; the "See it on ... website" buttons have `nofollow noopener` as intended. Only the maker's own URL, no affiliate parameter, so harmless today. | Add `nofollow` to title links too so a future affiliate swap cannot leak a followed link. |
| D9 | Low | Home hero, /stays etc. | Home LCP on the lab profile is 4.9 s (hero photo, image-bound, already known in PERF-BEFORE-AFTER.md); not fixed. | Priority hint is already set (`fetchpriority=high` preload present); remaining lever is a lighter 800 px hero variant on mobile. |
| D10 | Low | 404 page (e.g. /nonexistent) | Correct 404 status, but the title is the generic homepage title and there is no robots tag. | Optional: "Page not found" title plus noindex. |
| D11 | Low | /guides/airbnb-pet-damage-charge-after-checkout, line 235 of the guide source | Text "These are drafts, not proven winners." refers to message templates, not an unpublished article. Mentioned only because a "draft" grep hits it. Not a defect. | None (reword to "templates" if you want the grep clean). |

### SUSPECTED (not proven)

| # | Sev | Item | Why suspected |
|---|---|---|---|
| S1 | Low | White text on the terracotta "View on Vrbo" / "See photos and check dates on Vrbo" button (stay pages) | By eye the contrast looks about 3:1, under the 4.5:1 normal-text threshold. I did not measure the computed colours. |
| S2 | Low | Mobile home hero eyebrow "DOG-FRIENDLY TRAVEL, DONE PROPERLY" (390px) | Small pale text sits on a busy part of the photo and is hard to read in the screenshot. |
| S3 | Medium | Indexing risk of the 5 indexable stay pages | Pages are rewrites of public Vrbo listing data with sponsored buttons; thin-affiliate risk is already acknowledged in docs/recovery/ACCOMMODATION-INDEXING.md. Cannot be tested from outside. |

### NEEDS-YOUR-ACTION / COULD NOT VERIFY

| Item | Status |
|---|---|
| GTM container GTM-W99QCXZ9 | NOT in the page source of any of the 80 pages. Only `googletagmanager.com/gtag/js?id=G-1J97C8CPC1` (the GA4 gtag loader) plus `gtag('config','G-1J97C8CPC1')`. Google Ads detecting a GTM container may come from the gtag.js loader host or an old tag. Check in Google Ads/Tag Assistant; if you actually need GTM, it must be added. |
| Vrbo deeplink destinations | COULD-NOT-ACCESS (Vrbo returns 429 to bots; per brief not retried). Hrefs recorded below. |
| Exact deployed commit | COULD-NOT-VERIFY from outside; check Netlify Deploys. |
| Real-user performance | No field data exists. |

## 3. Page-level SEO checks (80 pages, VERIFIED)

- Status: 80 of 80 return 200. Sitemap: 68 `<loc>` (no lastmod), content-type application/xml.
- H1: exactly 1 on all 80. Title and meta description present on all 80 (non-stay titles 20-60 chars).
- Canonical: present on all 80, absolute https://www., no query, no UTM, equals the page's own path. `/gear?utm_source=x&utm_medium=y` returns 200 with canonical `https://www.pawsandpassage.com/gear`. Filtered `/stays?dogs=2&hotTub=true` is `noindex, nofollow` with canonical `/stays`.
- og: title, description, type, url, site_name, image on all 80 (6 tags); twitter: card, title, description, image (4 tags). All 25 distinct og:image URLs return 200.
- JSON-LD types per page (all parse; 0 invalid blocks): every page `Organization` (sameAs: Pinterest). Home/tools/about etc.: Organization only. /destinations/georgia and towns: BreadcrumbList + TouristDestination (towns). Guides (22): Article + BreadcrumbList, authored by Organization. /gear and 12 category pages: BreadcrumbList. /data/pet-policies: Dataset + DataDownload. Stay pages: BreadcrumbList only (no LodgingBusiness, as intended for unverified stays). No FAQPage anywhere (guides show a visible "Questions people ask" block without schema). No AggregateRating, Review or Rating anywhere. Gear pages: no Product/Offer.
- noindex (meta `noindex, nofollow`, none in sitemap): 4 stays (Blue Ridge Downtown, Creekside Cottage, Mountain View Cabin, The French Secret), /destinations/california plus its 4 towns (San Diego, Santa Barbara, Monterey, Mendocino), Ellijay, Helen, Dahlonega. This matches the table in ACCOMMODATION-INDEXING.md exactly. Indexable and in sitemap: /destinations/georgia, /destinations/georgia/blue-ridge, 5 stays, the 3 other tools, /stays, all gear pages.
- robots.txt: 200, text/plain; allows Googlebot, Bingbot, Twitterbot, facebookexternalhit and `*`; `Sitemap: https://www.pawsandpassage.com/sitemap.xml`. Nothing is blocked.

## 4. Redirects (VERIFIED, curl)

| Request | Result |
|---|---|
| /guides/traveling-with-two-dogs-accommodation-guide | 301 /guides/how-many-dogs-can-you-bring-to-a-vacation-rental |
| /guides/dog-friendly-cabins-fenced-yards-georgia | 301 /guides/vacation-rental-secure-fenced-yard |
| /guides/pet-friendly-beachfront-rentals-california | 301 /destinations/california |
| /guides/dog-friendly-weekend-getaways-from-atlanta | 301 /destinations/georgia |
| /guides/dog-friendly-weekend-getaways-from-los-angeles | 301 /destinations/california |
| /guides/dog-travel-water-and-feeding-gear-guide | 301 /guides/dog-friendly-cabin-packing-list |
| /guides/dog-friendly-rental-protection-gear-guide | 301 /guides/dog-friendly-cabin-packing-list |
| /guides/airbnb-vs-vrbo-with-a-dog | 301 /guides/how-vacation-rental-pet-fees-work |
| /guides/dog-id-tags-and-gps-trackers-for-travel-guide | 301 /guides/if-your-dog-gets-loose-on-a-trip |
| /tools/cost-calculator, /tools/host-questions | 301 /tools/pet-cost-check |
| https://pawsandpassage.com/gear | 301 https://www.pawsandpassage.com/gear |
| http://www.pawsandpassage.com/gear | 301 https://www.pawsandpassage.com/gear |
| http://pawsandpassage.com/ | 301 https://pawsandpassage.com/ then 301 to www (two hops, fine) |
| /stays/, /gear/, /guides/<slug>/ | 307 (see D5) |
| /nonexistent, /gear/nonexistent, /stays/nonexistent-slug, /guides/nonexistent | 404 |

All 9 redirects in netlify.toml match. The two retired tool routes are router redirects (src/routes/tools.*.tsx) and work.

## 5. Tracking, fonts, third parties (VERIFIED)

- Impact: `<meta name="impact-site-verification" value="6535a715-c434-467a-a407-2aeecbf0bf44">` on 80 of 80 pages (attribute is `value`, which is how Impact's tag is written).
- GA4 G-1J97C8CPC1 on 80 of 80 (gtag.js loader async + config). GTM-W99QCXZ9: absent (see above).
- Runtime hosts on home, /gear, a guide and a stay: www.pawsandpassage.com, www.googletagmanager.com, www.google-analytics.com only. Zero requests to fonts.googleapis.com or fonts.gstatic.com. DM Sans and Fraunces load from /fonts/*.woff2 (preloaded; `document.fonts` reports both loaded). No failed requests (the one aborted GA beacon is normal headless behaviour). The font files have `cache-control: public,max-age=0,must-revalidate`, so they are revalidated on every visit (Low; consider a long immutable cache for /fonts/*).
- Netlify HUD script present (see D2).

## 6. Navigation and content (VERIFIED)

- Header (desktop and mobile menu): Stays, Destinations, Guides, Gear, Tools, Find a stay. Gear is highlighted on /gear.
- Footer: Pinterest icon -> https://www.pinterest.com/paws_and_passage/ (`rel="me noopener"`, URL returns 200), Stays, Destinations, Guides, Gear, Tools, the four tools, Pet policy data, About us, Editorial standards, Methodology, Corrections, List your property, Contact, Affiliate disclosure, Privacy, Terms.
- Home: "Travel essentials" section with 3 tiles (Road trips, Travel safety, Feeding and hydration) and "See all" to /gear; "Stays" section with 3 stay cards showing a "Photos are on the booking page" placeholder (no photos).
- /gear: 12 categories with product counts (Road trips 27, Cabin vacations 6, Beach vacations 4, Senior dogs 4, Large dogs 9, Travel safety 14, Feeding and hydration 9, Travel comfort 6, Car safety 11, Winter travel 3, Outdoor adventures 11, Rental protection 10) and a "How we pick" box. All 12 category pages: 1 H1, no `$` price, no star/rating text, one "Researched, not tested by us" pill per product (27/6/4/4/9/14/9/6/11/3/11/10 pills = product counts), every CTA to a maker URL with `nofollow noopener`, no affiliate link, no disclosure shown.
- Guides: 9 "Gear for this trip" blocks exist (can-dogs-go-in-a-rental-pool-or-hot-tub, airbnb-pet-damage-charge-after-checkout, christmas-week-in-a-cabin-with-a-dog, dog-car-safety-harness-and-crate-guide, vacation-rentals-that-welcome-large-dogs, vacation-rental-with-a-senior-dog, puppy-at-a-vacation-rental, what-a-dog-really-costs-on-a-vacation-rental, dog-friendly-cabin-packing-list). Each says "not tested by us. No prices or ratings.", links "See all travel gear" -> /gear, per-product anchors on category pages resolve, CTAs `nofollow noopener`.
- AI disclosure: `grep` of all 80 pages for "artificial intelligence", "AI tools", `\bAI\b`, "machine learning", "language model" finds it only on /editorial-standards. (The word "automated" appears in the data page and guides in the sense of "automated reading", unrelated.)
- Emails: only `hello@pawsandpassage.com` (one mailto). The CSV has no "@".
- No "lorem ipsum", TODO, TBD or draft page. Only stays listed: the 9 expected (8 other YAML stays exist in the working tree but are not live).

## 7. Stays, filters and calculator (Playwright, VERIFIED)

Method: parsed each live stay page's "Pet policy at a glance" and "What is included" text, derived the strict expected result per filter (unknown/"Not confirmed" never a yes), applied each control in the UI, compared the cards shown and the "N stays" counter, and the URL state.

| Control | Result |
|---|---|
| Fenced (full) 0, Private outdoor 5, Large dogs 0, Multiple dogs 7, No pet fee 0, No breed 0, Beach 0, Mountain 1, Hot tub 6, A/C 7, Grill 8, Parking 8 | all match expectation |
| Dogs 1/2/3/4+ = 9/7/1/0 ; weight 20/30/50/70 lb = 5/3/2/0 (stays with no stated limit never match) | match |
| State Georgia 9, California 0; town Ellijay 0, Blue Ridge 5; type cabin 5, vacation home 3, cottage 1, beach/unique 0 | consistent |
| Combos fenced+hot tub 0, multi+50 lb 2, 3 dogs+hot tub 0; search "toccoa" 1, "zzz" 0 | match |
| Sort Name A-Z and Most dogs; deep links `?fenced=true`, `?dogs=2&hotTub=true` (5 results) | work; filtered URLs `noindex, nofollow`, canonical /stays |

Stay pages (all 9): "View on Vrbo" and "See photos and check dates on Vrbo" both present, `rel="sponsored nofollow noopener"`, sponsor line "Sponsored link: we may earn a commission..." beside each. No listing photos and no stock photo (only two related-guide cards). Recorded hrefs (not clicked), stay -> href: 5-star-cabin... -> vrbo.com/affiliate/dpJNgL9; blue-ridge-downtown... -> 85WJUQc; cozy-romantic... -> hj38sa6; creekside-cottage... -> 8PAjLc3; mountain-view-cabin... -> OvDjmi2; romantic-cabin-with-secluded... -> U0R4kX5; romantic-hideaway... -> ZZFfMMq; the-french-secret... -> vjqhYf3; toccoa-river-front... -> kckCpcg. Each equals the affiliates.yml entry for the stay's affiliateId and the id in its source URL.

Fee calculator, known fees: cozy-romantic ($95 per dog): 3 nights/1 dog $95; 3/2 $190; 7/2 $190; 1/1 $95; dogs over the limit -> "The listing allows up to 2 dogs." romantic-secluded ($50 per stay): 3/1 $50; 1 dog max enforced. Manual entry (5-star cabin, 3 nights, 2 dogs): $75 per stay = $75; $25 per night = $75; $40 per dog = $80; $10 per dog per night = $60; 7 nights/1 dog $15.50 per night = $108.50. All correct. Edge cases: see D7.

## 8. Tools and data (Playwright, VERIFIED)

- /tools/pet-cost-check: 2 dogs, 4 nights, nightly $200, cleaning $100, other $20, tax 10%, pet fee $50 per dog per night: lodging $800, cleaning+other $120, pet $400, tax $92 (applied to lodging+cleaning+other, as the page states), total $1,412, effective $353/night, +$300 deposit shows "Up front incl. deposit $1,712". Pet fee basis switch gives $50 / $200 / $100 / $400. Example and Clear buttons work; negative input gives $0. Generated host message (10 questions, fence/pool items conditional) states "$50.00 per dog ... total for 4 nights and 2 dogs is $100.00" (correct for per-dog).
- /tools/will-my-dog-be-accepted: 1 dog/40 lb: 23 no conflict, 14 ask first, 1 problem; 3 dogs: 2/16/20; 4 dogs, no weights: 0/18/20; 2 dogs + pit-bull type: 0 no conflict, 33 ask, 5 problem (breed silence correctly becomes "Ask", never "OK"). No console errors.
- /tools/packing-list: toggles change the recommended count (12 -> 9 -> 6 ...), "Add to bag" updates "x of y packed", state persists after reload, no console errors.
- /tools/checklist: 25 items, tick counter. /data/pet-policies: 38 table rows; CSV link `/pet-policies-38-managers.csv` returns 200 `text/csv`, 39 lines (header + 38), source URL on every row.

## 9. Screenshots

Saved in /tmp/claude-0/-home-user/fda9ad27-569d-5e7b-b498-88d7075dfab9/scratchpad/live-shots/ as `<page>-390.png` and `<page>-1280.png` for home, gear, gearcat (/gear/car-safety), guide (dog-car-safety-harness-and-crate-guide), stays, stay (5-star cabin), tool (pet-cost-check); 400 px-tall tiles of each in `tiles/`. No horizontal overflow at 390 or 1280 on any of the 7 pages (scrollWidth equals viewport). Layout observations from reading the PNGs:
- The Netlify badge floats over content on every screen (D2); at 390px it covers part of a sentence on the stay card, product text and a form field.
- Mobile category cards stack as one column; home travel-style tiles are a 2-column grid; stay pages show the Vrbo box above the fold, then text.
- /gear/<category> pages are very long on mobile (road-trips 14,400 px) because each product card has full specs and checks. Readable, but a jump-list or collapsed specs would help (Low, UX).
- White-on-terracotta Vrbo button and the pale eyebrow over the mobile hero are the two readability concerns (S1, S2).

## 10. Performance: LAB measurements only (no real-user data exists)

Method: scripts/perf/measure.cjs copied and pointed at production through the proxy: Pixel 5 emulation, CDP 4x CPU slowdown, Slow 4G (1.6 Mbps, 750 Kbps, 150 ms RTT), cache disabled, median of 3 loads, 2.5 s settle. Netlify delivers brotli and the same-origin HUD script. The routing through the sandbox proxy adds unknown latency, so absolute numbers are indicative.

| Page | FCP now / documented AFTER | LCP now / AFTER | CLS now / AFTER | Transfer now / AFTER | JS transfer now / AFTER | Requests |
|---|---|---|---|---|---|---|
| / | 764 / 836 ms | 4,876 / 5,288 ms | 0.0033 / 0.0021 | 1,438 / 1,437 KB | 404 / 381 KB | 42 |
| guide (markdown) | 976 / 884 ms | 976 / 884 ms | 0.0219 / 0.0207 | 788 / 768 KB | 437 / 410 KB | 41 |
| guide (code file) | 952 / 908 ms | 952 / 908 ms | 0.0037 / 0.0025 | 899 / 879 KB | 437 / 410 KB | 41 |
| /stays | 816 / 748 ms | 816 / 748 ms | 0.0016 / 0.0004 | 551 / 531 KB | 400 / 378 KB | 35 |
| /gear | 880 / 800 ms | 880 / 800 ms | 0.0013 / 0.0001 | 551 / 695 KB | 400 / 377 KB | 36 |
| /gear/road-trips (new row) | 988 ms | 988 ms | 0.0028 | 559 KB | 400 KB | 36 |

Reading: production matches PERF-BEFORE-AFTER.md within the stated run-to-run noise (+/-100 ms). All CLS values are under 0.1 (good); the markdown guide's 0.022 is the same small shift the document already noted. Third-party transfer is 184 KB (GA only). The home LCP (4.9 s) is the hero photo and remains the one slow metric in this lab. Note /gear transfer is lower than the document's 695 KB (551 KB now), likely because of Netlify compression and/or later changes.

## 11. Prioritised recommendations

| Priority | Action | Impact | Effort | Ongoing cost | Dependencies |
|---|---|---|---|---|---|
| 1 | D2: switch off the Netlify badge/toolbar | Cleaner, buyer-ready look; removes mobile overlap | 5 min | none | Netlify login (you) |
| 2 | D1: send the 3 security headers from the server | Closes clickjacking/referrer/permissions gap that netlify.toml promised | 1 hr | none | code change on branch, then re-check with curl |
| 3 | D3: fix or hide empty-result tiles on home | Avoids dead-end clicks on 5 prominent tiles | 1 hr | none | none |
| 4 | D4: shorten stay titles, lengthen descriptions | Better SERP display for the 5 indexable stays | 30 min | none | none |
| 5 | D5-D7: 301 for trailing slash, fix 2 anchors, calculator validation and plural | Polish | 1-2 hr | none | none |
| 6 | Resolve GTM-W99QCXZ9 question | Correct Google Ads tag setup | 15 min | none | Google Ads/Tag Assistant (you) |
| 7 | Long cache for /fonts/* | Slightly faster repeat visits | 10 min | none | netlify.toml headers (static files do honour it) |

## 12. Needs your personal action

1. Turn off the "Powered by Netlify" badge in Netlify (D2).
2. Check in Google Ads / Tag Assistant where GTM-W99QCXZ9 comes from; tell us whether GTM is wanted.
3. Open the 9 Vrbo deeplinks once in your own browser (bots get 429) to confirm they land on the right listing.
4. Confirm in Netlify Deploys that the live build is commit 045251c.

## 13. Count

Pages checked: 80 HTML pages (68 sitemap + 12 noindex), plus robots.txt, sitemap.xml, the CSV, 3 static-asset header checks, 25 og images, 22 redirect or 404 probes, 7 pages x 2 widths of screenshots, 6 pages of performance runs (18 loads). Defects: 0 critical, 0 high, 3 medium (D1, D2, D3), 8 low (D4-D11, of which D11 is not an actual defect), 3 suspected (S1, S2, S3).
