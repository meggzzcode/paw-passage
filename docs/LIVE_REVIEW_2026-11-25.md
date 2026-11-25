# Live site review, 2026-11-25

Reviewer: automated public review (no login, public GET requests only, at least 300 ms between requests to a host).
Live under test: https://www.pawsandpassage.com serving main@82b0b34. Compared with a local build of daa758f
(`NITRO_PRESET=node-server bunx vite build`, served from the scratchpad on port 4710). Nothing was pushed or deployed.

## Verdict

No P0 and no P1 defect found. The live site is clean on every mechanical check; the only differences from the
daa758f build are the three expected ones. Nine P2 observations are listed for the batch, none needs to hold the deploy.
No code or content was changed, so no fix commit exists; this report is the only commit.

## Summary table

| Area | Checked | Result |
|---|---|---|
| Sitemap crawl | 103 of 103 URLs | all 200 with no redirect; canonical absolute https, www host and equal to the URL on all 103; no robots meta on any (all indexable); exactly one H1 on all 103; titles 20 to 60 characters and descriptions 123 to 155, no duplicate titles; every page has 1 to 3 JSON-LD blocks and all parse; no `[[`, `{{`, `undefined`, `NaN`, `TODO` or "Check the current price" in visible text; no duplicated FAQ section |
| Browser load, 25 pages | 390 and 1280 (15 of them also at 320) | 65 + 50 page loads: no horizontal overflow at 320, 390 or 1280, no console errors, no failed requests other than analytics beacons I aborted myself, no broken visible image |
| Live vs local daa758f | 103 pages | 38 pages differ, all explained by the expected differences (see below); 65 pages are equal in visible text, link and image sets, title, canonical, JSON-LD block count and share images (not compared byte for byte) |
| Headers and redirects | see section 2 | all as designed |
| Share images | 38 distinct og:image and twitter:image URLs | all 200 image/jpeg, all absolute https |
| Outbound links | 348 distinct non-Amazon external URLs | 0 broken (no 404, 410, 5xx, timeout); 1 "soft" (expected); 22 unverifiable by script; 63 moved permanently |
| Amazon | 71 distinct approved ASINs | 71 of 71 returned a real product page (HTTP 200, product title); none is the "dogs of Amazon" 404 page; 284 Amazon anchors on 49 pages |
| Vrbo | 78 of 78 stay source URLs | 78 of 78 HTTP 200 with a listing title (20 by the earlier worker, 58 by me); no dead source link found |
| Performance (lab, mobile) | 10 pages | CLS and image weights fine; home LCP over 4 s in my proxy lab (P2, see F2) |
| Functional at 390 | planner, gear trip, stays filter, 2 tools, menu, footer, GA | all work; no PII in any URL |
| Content spot read | 6 guides, 3 towns | no reader-facing defect found |

## Expected differences (NOT-AN-ISSUE)

1. `/affiliate-disclosure`: the live page still describes affiliate-only stays ("Stays are listed when we have a booking link"); daa758f describes public-sources mode. Expected (stayDirectoryMode).
2. 37 pages (29 guides and 8 town things-to-do pages) have one extra affiliate notice beside the first product card in the local build; live has none there. Expected (one notice beside the first card). In each of these 37 the only text change is that single inserted notice; hrefs, titles, canonicals, JSON-LD and images are identical.
3. Notice size (12 px live, 14 px local) is CSS only, so it does not show in the text diff. Not measured separately.

No other page differs. The stays directory (`/stays` and the 22 stay pages in the sitemap) is identical in text and links.

## Findings

No P0 and no P1.

| ID | Sev | URL | Evidence | Fix status |
|---|---|---|---|---|
| F1 | P2 | `/destinations/georgia/blue-ridge/things-to-do`, `/destinations/california/mendocino/things-to-do` (all town pages likely) | Layout shift on mobile under 4x CPU and slow-4G throttling: CLS 0.177 (Blue Ridge) and 0.145 (Mendocino). One 16 px upward jump of the article body at about 3.1 s (`DIV.prose-article` y 544 to 528, the "On this page" details y 495 to 479). Zero when unthrottled. The same throttled test on the daa758f build gives 0.057 and 0.041 with that jump absent, so it is probably removed by the notice change. A smaller residual shift (0.0375, an `aspect-[2/1]` image block, y 444 to 478) exists in both builds on Mendocino. | None. Re-measure after the final deploy. |
| F2 | P2 | `/` | Lab LCP 4.5 s and 4.4 s over two runs (FCP 1.9 s), LCP element is the 97 KB `hero-porch-mobile` image, preloaded, `fetchpriority=high`. docs/FLIP_READINESS_AUDIT.md recorded 1.95 s with the same throttle profile unproxied. My run goes through the review proxy (TTFB about 550 ms vs about 30 ms), so it is inflated, and the 928 KB page weight shares the 1.6 Mbps throttle. GA loads on idle after load, so it does not delay LCP. | None. Needs a PageSpeed Insights or Cowork check. |
| F3 | P2 | all pages | Lab TBT 0.6 to 1.3 s with 4x CPU (own JS about 270 to 340 KB transferred; the packing tool is highest at 1.3 s). Informational. | None. |
| F4 | P2 | `/gear/car-interior`, `/gear/comfort-and-cooling`, `/gear/feeding-and-hydration`, `/gear/pens-and-gates` and their guides | Amazon availability moves. One approved item parsed as "Temporarily out of stock" at review time: `kurgo-rover-cargo-cape` (B01LY6DXU4). Three more showed a price but no add-to-cart in the markup I parsed, which may be markup variance rather than stock: `kong-classic` (B0002AR0I8), `vittles-vault-travel-tainer` (B000HHMCT8), `midwest-exercise-pen-with-door` (B005OCWML4). 40 of the 45 ASINs in the second pass showed In Stock with an add-to-cart control. Amazon began serving captchas after 45 requests of that pass, so I stopped; 26 ASINs have only the first-pass result (product page loads, availability not read). | None. A human should open the four in a browser and set `approved: false` (as was done for `amk-me-and-my-dog` on 2026-11-18) if unavailable. |
| F5 | P2 | `/guides/vacation-rentals-with-no-pet-fee` | The source "Accessibility policy" (airbnb.com/help/article/1869) now redirects to article 4238, titled "Reasonable Adjustments Policy". Link works; the label is probably stale. Also Psychology Today "How Long Is Too Long to Leave Your Dog Home Alone?" (`/guides/can-you-leave-a-dog-alone-in-a-vacation-rental`) is now titled "How Long Can You Leave a Dog Home Alone?" and its URL slug changed. | Not edited: editorial decision whether it is the same document (rule: do not replace what I cannot verify). |
| F6 | P2 | 63 cited URLs | Permanent moves (listed in the appendix). All land on the same topic; no content change needed to keep working. | Optional tidy-up of URLs; not done. |
| F7 | P2 | `/sitemap.xml` | No `<lastmod>` on any URL. Valid, but gives crawlers no freshness signal. | None. |
| F8 | P2 | `/destinations/california/monterey/things-to-do` | Evergreen copy states "Asilomar's park page listed a closure for large swells and high tides on our read date (2026-11-24)". True and dated, but will look stale within days. | None. Editorial choice. |
| F9 | P2 | `http://pawsandpassage.com/...` | Apex http goes to apex https and then to www (two hops). Works; HSTS is on. | None. |

Checked and found fine (not findings): the FAQ text appears twice in the DOM on guides, the second copy is a `print:block hidden` list for printing, not a visible duplicate. Three lazy "keep reading" images per guide report not loaded at 390: they sit in `display:none` cards (third card hidden on mobile), so they never load by design. The 14 untagged Amazon anchors on 8 pages are "Source" and "Amazon listing as read" evidence links, deliberately without the tag; all 270 buy buttons carry `tag=pawspassage-20` and `rel="sponsored nofollow noopener"`. The analytics beacon requests show `ERR_ABORTED`; those are not site failures.

## 2. Headers and routing on live

| Check | Result |
|---|---|
| HTML page headers | `strict-transport-security: max-age=31536000`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy` set, `cache-control: no-cache`, `content-type: text/html; charset=utf-8`. No CSP and no X-Frame-Options (documented decision). |
| `/assets/*` | `public, max-age=31536000, immutable` on css, js and image checked; correct content types |
| http://www, https://apex | 301 to https://www.pawsandpassage.com/ |
| `/does-not-exist` | real 404, `noindex, nofollow`, "Page not found" with Go home button (screenshot looked right at 390) |
| Trailing slash | `/guides/` and `/destinations/georgia/blue-ridge/things-to-do/` return 301 to the slashless URL |
| Retired URL | `/guides/airbnb-vs-vrbo-with-a-dog` returns 301 to `/guides/how-vacation-rental-pet-fees-work` |
| Draft URLs | `/guides/breed-restrictions-at-vacation-rentals` and `/guides/pet-friendly-listing-red-flags` return 404 (both are `status: draft`) |
| robots.txt | 200 `text/plain`, allows all, points to the sitemap |
| sitemap.xml | 200 `application/xml`, `max-age=3600`, 103 `<loc>`, no lastmod (F7) |
| IndexNow key | `/c020721357f8d6912ac3f66e4c956986.txt` returns 200 with the key as body |
| favicon.ico, apple-touch-icon.png | 200, `image/vnd.microsoft.icon` 20 KB, `image/png` 11 KB |
| og:image | 38 distinct share images, all 200 jpeg, all absolute https; 66 of 103 pages use `/share/default.jpg` |

## 3. Outbound link health

Method: every distinct external URL rendered on the 29 guides, 8 town things-to-do pages and the dataset page
(415 distinct; this covers all 255 frontmatter sources of the published Markdown guides, which I confirmed are all
linked in the body, plus the sources of the 7 code-file guides). 67 are Amazon product links (section 4); the other 348 were
tested with HEAD, then GET on failure, up to 6 redirect hops, 8 s timeout, 400 ms per host, then a second GET to
read the page title and catch soft 404s. No source was edited, so the content test was not needed.

| Class | Count |
|---|---|
| 200 direct | 246 |
| 200 after redirect (63 moved to a different path, the rest http to https or www) | 86 |
| Broken (404, 410, 5xx) | 0 |
| Timeout | 0 |
| Soft broken (redirect to a home page) | 1, and it is the generic Vrbo affiliate link, whose target is the Vrbo home by design |
| Bot-blocked or unreachable, unverifiable by script | 22 (below) |

I did not retry blocked hosts with other User-Agents or other tricks.

### Unverifiable by script (needs a browser check by a human)

| URL | Guide / page | Anchor text | Result |
|---|---|---|---|
| https://exploregeorgia.org/list/georgias-pet-friendly-wineries | `/destinations/georgia/blue-ridge/things-to-do`, `/destinations/georgia/dahlonega/things-to-do`, `/destinations/georgia/ellijay/things-to-do` +1 | Explore Georgia / Georgia's pet-friendly wineries | HTTP 403 bot-blocked, unverifiable by script |
| https://knowhow.napaonline.com/pet-proof-your-car-tips-for-taking-rex-on-the-road/ | `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip` | NAPA / Pet-proof your car, tips for taking Rex on the road | HTTP 403 bot-blocked, unverifiable by script |
| https://sandiego.org/articles/pets/California-dog-beaches-parks-recreation-areas-in-san-diego.aspx | `/destinations/california/san-diego/things-to-do` | San Diego Tourism Authority / California dog beaches, parks and recrea | HTTP 403 bot-blocked, unverifiable by script |
| https://santabarbaraca.com/plan-your-trip/know-before-you-go/pet-friendly-santa-barbara/ | `/destinations/california/santa-barbara/things-to-do` | Visit Santa Barbara dog guide / Dog friendly beaches in Santa Barbara | HTTP 403 bot-blocked, unverifiable by script |
| https://centerforpetsafety.org/cargo-area-connection-advisory/ | `/guides/dog-car-safety-harness-and-crate-guide`, `/guides/two-large-dogs-in-one-car` | Center for Pet Safety / Center for Pet Safety | no response (connection reset on HEAD and GET), unverifiable by script |
| https://exploregeorgia.org/places-to-stay/list/stay-in-these-cozy-cabins-with-your-dog-at-georgia-state-parks | `/guides/dogs-in-georgia-state-park-cabins` | Explore Georgia / Stay in these Cozy Cabins with Your Dog at Georgia S | HTTP 403 bot-blocked, unverifiable by script |
| https://santabarbaraca.com/itinerary/dog-friendly-wineries-in-santa-barbara/ | `/destinations/california/santa-barbara/things-to-do` | winery page / Dog-friendly wineries in Santa Barbara | HTTP 403 bot-blocked, unverifiable by script |
| https://centerforpetsafety.org/2013-harness-crash-test-study-results/ | `/guides/dog-car-safety-harness-and-crate-guide` | Center for Pet Safety / Center for Pet Safety | no response (connection reset on HEAD and GET), unverifiable by script |
| https://bearwise.org/six-bearwise-basics/never-leave-pet-food-outdoors/ | `/guides/dog-friendly-cabin-packing-list` | BearWise / Never Leave Pet Food Outdoors | no response (connection reset on HEAD and GET), unverifiable by script |
| https://centerforpetsafety.org/2013-harness-study-quasi-static-tests/ | `/guides/dog-car-safety-harness-and-crate-guide` | Center for Pet Safety / 2013 Harness Study - Quasi-Static Tests | no response (connection reset on HEAD and GET), unverifiable by script |
| https://centerforpetsafety.org/2015-crate-study-results/ | `/guides/dog-car-safety-harness-and-crate-guide`, `/guides/two-large-dogs-in-one-car` | Center for Pet Safety / 2015 Crate Study Results | no response (connection reset on HEAD and GET), unverifiable by script |
| https://centerforpetsafety.org/cps-certified/ | `/guides/dog-car-safety-harness-and-crate-guide` | Center for Pet Safety / Center for Pet Safety | no response (connection reset on HEAD and GET), unverifiable by script |
| https://centerforpetsafety.org/sleepypod-atom/ | `/guides/dog-car-safety-harness-and-crate-guide` | Center for Pet Safety / Center for Pet Safety | no response (connection reset on HEAD and GET), unverifiable by script |
| https://centerforpetsafety.org/extension-tether-advisory/ | `/guides/dog-car-safety-harness-and-crate-guide` | Center for Pet Safety / Warning: Extension Tethers Put Pets and Famili | no response (connection reset on HEAD and GET), unverifiable by script |
| https://centerforpetsafety.org/lucky-duck-lucky-kennel-large/ | `/guides/dog-car-safety-harness-and-crate-guide`, `/guides/two-large-dogs-in-one-car` | Center for Pet Safety / Center for Pet Safety | no response (connection reset on HEAD and GET), unverifiable by script |
| https://www.avma.org/resources-tools/pet-owners/emergencycare/first-aid-tips-pet-owners | `/guides/pet-friendly-vacation-rental-checklist` | AVMA advises / First aid tips for pet owners | 200 but only 212 bytes (JS bot challenge), unverifiable |
| https://elliott.org/advocacy/such-a-bizarre-rental-experience-on-vrbo-but-do-they-even-care/ | `/guides/airbnb-pet-damage-charge-after-checkout` | Elliott Advocacy / Such a bizarre rental experience on Vrbo | HEAD 200 but GET 403 (Security Verification), bot protection, unverifiable |
| https://www.fearfreehappyhomes.com/?p=12015 | `/guides/vacation-rental-with-a-reactive-dog` | Fear Free / Fear Free | HEAD 200 but GET 403 (Error 403 Forbidden), bot protection, unverifiable |
| https://vrbo.com/affiliate/hdPLmiF | `/guides/how-vacation-rental-pet-fees-work`, `/guides/vacation-rentals-that-welcome-large-dogs`, `/guides/vacation-rentals-with-no-pet-fee` +1 | start a pet-friendly search on Vrbo / start a pet-friendly search on V | 429 on GET ("Bot or Not"); HEAD followed to vrbo.com home (that is the expected target of the generic Vrbo affiliate link, not a broken link) |
| https://elliott.org/case-dismissed-2/this-airbnb-complaint-has-a-big-problem/ | `/guides/airbnb-pet-damage-charge-after-checkout` | Elliott Advocacy / This Airbnb complaint has a big problem | HEAD 200 but GET 403 (Security Verification), bot protection, unverifiable |
| https://fearfreehappyhomes.com/hitting-the-road-summer-travel-tips/ | `/guides/vacation-rental-with-a-reactive-dog` | Fear Free Happy Homes / Hitting the Road: Summer Travel Tips | HEAD 200 but GET 403 (Error 403 Forbidden), bot protection, unverifiable |
| https://www.mdpi.com/2076-2615/12/18/2347 | `/guides/keep-a-dog-cool-on-a-summer-trip` | Animals (Basel) / Clinical Evaluation of Exercise-Induced Physiologica | 200 but only 2211 bytes (JS bot challenge), unverifiable |

### Moved permanently (all still work)

| Old URL cited | Now redirects to | Used on |
|---|---|---|
| https://www.psychologytoday.com/gb/blog/all-dogs-go-heaven/201802/how-long-is-too-long-leave-dog-home-alone | https://www.psychologytoday.com/gb/blog/all-dogs-go-to-heaven/201802/how-long-can-you-leave-a-dog-home-alone | `/guides/can-you-leave-a-dog-alone-in-a-vacation-rental` |
| https://www.akc.org/expert-advice/lifestyle/best-dog-boots/ | https://www.akc.org/expert-advice/lifestyle/dog-boots/ | `/guides/cold-weather-dog-gear-for-winter-cabin-trips` |
| https://www.avantstay.com/pet-friendly-vacation-rentals/california/pismo-beach | https://www.avantstay.com/vacation-rentals/pet-friendly/california/pismo-beach | `/data/pet-policies` |
| https://blog.nationwide.com/dog-proofing-car/ | https://blog.nationwide.com/family-life/pets-family-life/dog-proofing-car/ | `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip` |
| https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl | https://www.kurgo.com/p/collaps-a-bowl/K00098 | `/destinations/california/mendocino/things-to-do`, `/destinations/california/monterey/things-to-do`, `/destinations/california/san-diego/things-to-do` +6 |
| https://www.beachrealtync.com/node/707 | https://www.beachrealtync.com/pet-rules-regulations | `/data/pet-policies`, `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`, `/guides/puppy-at-a-vacation-rental` |
| https://www.vet.cornell.edu/index.php/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/heatstroke-medical-emergency | https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/heatstroke-medical-emergency | `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`, `/guides/dog-friendly-cabin-packing-list`, `/guides/two-large-dogs-in-one-car` |
| https://www.petpoisonhelpline.com/pet-safety-tips/winter-holiday-pet-poison-tips/ | https://www.petpoisonhelpline.com/pet-owners/seasons/winter-holiday-pet-poison-tips/ | `/guides/christmas-week-in-a-cabin-with-a-dog` |
| https://ci.carmel.ca.us/post/beach-rules | https://ci.carmel.ca.us/post/carmel-beach | `/destinations/california/monterey/things-to-do` |
| https://www.surforsound.com/vacation-planning/rental-policies/ | https://www.surforsound.com/rental-policies | `/data/pet-policies`, `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub` |
| https://www.delmar.ca.us/FAQ.aspx?QID=96 | https://www.delmar.ca.us/m/faq?cat=22#question-96 | `/destinations/california/san-diego/things-to-do` |
| https://cabin-rentals-of-georgia.com/policies | https://www.cabin-rentals-of-georgia.com/rental-policies | `/data/pet-policies`, `/guides/can-you-leave-a-dog-alone-in-a-vacation-rental`, `/guides/dogs-in-georgia-state-park-cabins` +4 |
| https://www.airbnb.com/d/guarantee | https://www.airbnb.com/help/article/279 | `/guides/airbnb-pet-damage-charge-after-checkout` |
| https://www.wta.org/hiking-info/basics/hiking-with-dogs | https://www.wta.org/go-outside/trail-smarts/hiking-with-dogs-washington-5-things-you-need-know | `/guides/dog-hiking-gear-for-a-cabin-vacation` |
| https://bestfriends.org/resources/managing-barrier-reactivity | https://bestfriends.org/pet-care-resources/managing-barrier-reactivity | `/guides/vacation-rental-with-a-reactive-dog` |
| https://www.dahlonega.org/articles/post/exploring-dahlonega-with-your-pet-must-visit-spots-for-you-and-your-furry-friend | https://www.dahlonega.org/blog/exploring-dahlonega-with-your-pet-must-visit-spots-for-you-and-your-furry-friend/ | `/destinations/georgia/dahlonega/things-to-do` |
| https://www.thecooldown.com/?p=815147 | https://www.thecooldown.com/green-business/airbnb-guest-pet-fee-dispute-stained-towels/ | `/guides/airbnb-pet-damage-charge-after-checkout` |
| https://www.brindleybeach.com/node/3691 | https://www.brindleybeach.com/pet-policies | `/data/pet-policies`, `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`, `/guides/can-you-leave-a-dog-alone-in-a-vacation-rental` +3 |
| https://www.sunrealtync.com/node/1163 | https://www.sunrealtync.com/outer-banks-vacation-rentals-pet-friendly-sun-realty-nc | `/data/pet-policies`, `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`, `/guides/vacation-rental-with-a-senior-dog` |
| https://petparentsbrand.com/products/washable-puppy-pads | https://petparentsbrand.com/products/puppy-pads | `/guides/puppy-at-a-vacation-rental`, `/guides/vacation-rental-with-a-senior-dog` |
| https://www.cabin-rentals-of-georgia.com/policies | https://www.cabin-rentals-of-georgia.com/rental-policies | `/guides/new-years-eve-with-a-dog-in-a-vacation-rental` |
| https://sleepypod.com/products/clickit-sport-plus | https://sleepypod.com/products/sport-bundle | `/guides/dog-car-safety-harness-and-crate-guide` |
| https://www.rockymtnresorts.com/?p=8672 | https://www.rockymtnresorts.com/estes-park-travel-info/bringing-a-dog-to-estes-park/ | `/data/pet-policies` |
| https://elkspringsresort.com/?p=1899 | https://www.elkspringsresort.com/policies/pet-policy | `/data/pet-policies`, `/guides/vacation-rentals-that-welcome-large-dogs` |
| https://kurgo.com/car-seat-covers/rover-hammock | https://www.kurgo.com/p/rover-hammock/POG30-17766 | `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip` |
| https://blog.tokeet.com/?p=6080 | https://blog.tokeet.com/vacation-rental-pet-policy/ | `/guides/how-many-dogs-can-you-bring-to-a-vacation-rental` |
| https://www.mountaintimes.info/killington-community-helps-visitor-search-for-lost-dog/ | https://mountaintimes.info/2015/01/07/killington-community-helps-visitor-search-for-lost-dog/ | `/guides/new-years-eve-with-a-dog-in-a-vacation-rental` |
| https://sbparksandrec.santabarbaraca.gov/park/douglas-family-preserve | https://sbparksandrec.santabarbaraca.gov/parks/douglas-family-preserve | `/destinations/california/santa-barbara/things-to-do` |
| https://vcahospitals.com/shop/home/articles/the-dos-and-don-ts-of-dog-water-safety | https://vcahospitals.com/resources/lifestyle-dog/hazards-safety/the-dos-and-don-ts-of-dog-water-safety | `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`, `/guides/dog-life-jacket-for-lakes-and-beaches` |
| https://www.vetstreet.com/?p=1117 | https://www.vetstreet.com/our-pet-experts/is-your-pet-safe-when-riding-in-the-car-tips-to-help-ensure-the-answer-is-yes | `/guides/two-large-dogs-in-one-car` |
| https://ruffwear.ca/pages/load-up-car-harness-testing-design | https://ruffwear.com/pages/load-up-car-harness-testing-design?shpxid=d1998642-89b3-4cb9-bb1a-2f0b2518145e | `/guides/two-large-dogs-in-one-car` |
| https://www.petmate.com/vittles-vault-travel-trainer-portable-food-storage-container/product/4504 | https://www.petmate.com/products/vittles-vault-travel-trainer-portable-food-storage-container | `/guides/dog-travel-bowls-and-food-storage` |
| https://www.msdvetmanual.com/veterinary/dog-owners/behavior-of-dogs/diagnosing-behavior-problems-in-dogs | https://www.msdvetmanual.com/dog-owners/behavior-of-dogs/diagnosing-behavior-problems-in-dogs?ruleredirectid=463 | `/guides/vacation-rental-with-a-reactive-dog` |
| https://www.destinvacation.com/pet-friendly | https://www.destinvacation.com/rentals/pet-friendly | `/data/pet-policies`, `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`, `/guides/dog-life-jacket-for-lakes-and-beaches` |
| https://www.luckyduck.com/lucky-kennel-large | https://luckyduck.com/products/lucky-kennel | `/guides/dog-car-safety-harness-and-crate-guide`, `/guides/two-large-dogs-in-one-car` |
| http://cuddleupcabinrentals.com/Cabin-Rentals-Pet-Friendly.php | https://www.cuddleupcabinrentals.com/cabin-rentals-pet-friendly | `/data/pet-policies` |
| https://store.ezydog.com/dfd-life-jacket/ | https://store.ezydog.com/products/dfd-life-jacket | `/guides/dog-life-jacket-for-lakes-and-beaches` |
| https://www.bearcampcabins.com/blog/gatlinburg-cabins-pigeon-forge-pet-friendly-cabins | https://www.bearcampcabins.com/area-information/pigeon-forge-1/gatlinburg-cabins-pigeon-forge-pet-friendly-cabins/ | `/data/pet-policies`, `/guides/can-you-leave-a-dog-alone-in-a-vacation-rental` |
| https://caninearthritis.org/?p=2503 | https://caninearthritis.org/article/assistive-devices/ | `/guides/dog-ramp-or-steps-for-the-car-and-cabin` |
| https://petsafe.com/product/happy-ride-compact-telescoping-dog-ramp | https://www.petsafe.com/p/happy-ride-compact-telescoping-dog-ramp/62420/ | `/guides/dog-ramp-or-steps-for-the-car-and-cabin` |
| https://ruffwear.com/products/climate-changer-fleece-dog-jacket | https://ruffwear.com/products/fleece-dog-sweater-climate-changer#erid45843780 | `/guides/cold-weather-dog-gear-for-winter-cabin-trips` |
| https://www.fearfreehappyhomes.com/?p=12015 | https://www.fearfreehappyhomes.com/reactive-dog-how-to-lessen-on-leash-aggression/ | `/guides/vacation-rental-with-a-reactive-dog` |
| https://www.vacasa.com/pet-friendly-vacation-rentals | https://www.vacasa.com/explore/pet-friendly-vacation-rentals | `/guides/new-years-eve-with-a-dog-in-a-vacation-rental` |
| https://magazine.northeast.aaa.com/?p=95415 | https://magazine.northeast.aaa.com/daily/life/cars-trucks/dog-car-restraints/ | `/guides/two-large-dogs-in-one-car` |
| https://tahoegetaways.com/policies | https://www.tahoegetaways.com/our-rental-policies | `/data/pet-policies`, `/guides/puppy-at-a-vacation-rental` |
| https://vacasa.com/furryfriends | https://www.vacasa.com/explore/pet-friendly-vacation-rentals?utm_source=vanity&utm_medium=digital_mag&utm_campaign=guest_ad_fido_mag | `/guides/vacation-rental-with-a-senior-dog` |
| https://aldf.org/hotcars | https://aldf.org/project/an-avoidable-tragedy-dogs-in-hot-cars/ | `/guides/keep-a-dog-cool-on-a-summer-trip` |
| https://www.vet.cornell.edu/departments/riney-canine-health-center/canine-health-information/summer-safety-tips | https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/summer-safety-tips | `/guides/dog-life-jacket-for-lakes-and-beaches`, `/guides/keep-a-dog-cool-on-a-summer-trip` |
| https://www.whole-dog-journal.com/?p=3315 | https://www.whole-dog-journal.com/lifestyle/the-best-life-jackets-for-dogs-summer-2016/ | `/guides/dog-life-jacket-for-lakes-and-beaches` |
| https://kurgo.com/car-seat-covers/dog-hammocks/wander-hammock-extended-width | https://www.kurgo.com/p/rover-hammock-extended-width/POG30-17675 | `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip`, `/guides/two-large-dogs-in-one-car` |
| https://www.aspca.org/pet-care/animal-poison-control | https://www.aspca.org/pet-care/aspca-poison-control | `/guides/christmas-week-in-a-cabin-with-a-dog`, `/guides/new-years-eve-with-a-dog-in-a-vacation-rental`, `/guides/vacation-rental-with-a-senior-dog` |
| https://www.akc.org/expert-advice/health/general-health/dogs-drinking-salt-water/ | https://www.akc.org/expert-advice/health/dogs-drinking-salt-water/ | `/guides/dog-life-jacket-for-lakes-and-beaches` |
| https://ruffwear.com/products/knot-a-leash-dog-leash | https://ruffwear.com/products/knot-a-leash#erid37661061 | `/guides/dog-hiking-gear-for-a-cabin-vacation`, `/guides/dogs-in-georgia-state-park-cabins`, `/guides/vacation-rental-secure-fenced-yard` |
| https://www.kurgo.com/dog-travel/kibble-carrier | https://www.kurgo.com/p/kibble-carrier/K01671 | `/guides/dog-travel-bowls-and-food-storage` |
| https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/health-info/managing-reactive-behavior | https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/managing-reactive-behavior | `/guides/vacation-rental-with-a-reactive-dog` |
| https://www.akc.org/expert-advice/health/general-health/dog-stairs-and-ramps/ | https://www.akc.org/expert-advice/health/dog-stairs-and-ramps/ | `/guides/dog-ramp-or-steps-for-the-car-and-cabin`, `/guides/vacation-rental-with-a-senior-dog` |
| https://ruffwear.com/products/quencher-dog-bowl | https://ruffwear.com/products/quencher-packable-dog-bowl#erid47620127 | `/guides/dog-hiking-gear-for-a-cabin-vacation`, `/guides/dog-travel-bowls-and-food-storage`, `/guides/dogs-in-georgia-state-park-cabins` |
| https://www.akc.org/expert-advice/health/heat-stroke-in-dogs/ | https://www.akc.org/expert-advice/health/heatstroke-in-dogs/ | `/guides/keep-a-dog-cool-on-a-summer-trip` |
| https://ruffwear.com/products/web-master-dog-harness | https://ruffwear.com/products/web-master-harness#erid37093810 | `/guides/dog-hiking-gear-for-a-cabin-vacation` |
| https://ruffwear.com/products/grip-trex-dog-boots | https://ruffwear.com/products/grip-trex-dog-boot-pairs#erid5967811 | `/guides/dog-hiking-gear-for-a-cabin-vacation` |
| https://www.aspca.org/pet-care/virtual-pet-behaviorist/dog-behavior/barking | https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/barking | `/guides/vacation-rental-with-a-reactive-dog` |
| https://www.airbnb.com/resources/hosting-homes/a/a-guide-to-photographing-accessibility-features-30 | https://www.airbnb.com/resources/hosting-homes/a/how-to-photograph-accessibility-features-30 | `/guides/vacation-rental-with-a-senior-dog` |
| https://www.airbnb.com/help/article/1869 | https://www.airbnb.com/help/article/4238 | `/guides/vacation-rentals-with-no-pet-fee` |

## 4. Affiliate links

- Amazon: `content/affiliates.yml` has 81 Amazon Associates entries, of which 71 are approved with 71 distinct ASINs (the brief said 81; the other 10 are `approved: false`). All 71 `amazon.com/dp/<ASIN>` GETs returned HTTP 200 with the product title; none is the 404 page; no redirect. Amazon showed a captcha on the second pass after 45 requests, and I stopped.
- Tag: 284 Amazon anchors on 49 live pages; 270 carry `tag=pawspassage-20` and `rel="sponsored nofollow noopener"`; the 14 without are the intentional "Source" links.
- Vrbo: 78 source URLs (`sourceUrl: https://www.vrbo.com/<id>`), all 78 returned 200 with a real listing title carrying the right town or listing name; none redirected or showed "no longer available". A 200 shows the page exists; it does not prove the property matches the stay name (title match was read by eye for the 58 I probed). No stay has a dead "View the listing" link. 4 stays have a Vacasa source and 1 an Explore Georgia source; those were not probed.
- Stay page CTAs on live: "See photos and check dates on Vrbo" and "View on Vrbo", `vrbo.com/affiliate/...`, `rel="sponsored nofollow noopener"`.

## 5. Performance (live, mobile emulation)

Playwright with Chrome 153, Pixel 5, Slow 4G (1.6 Mbps, 150 ms), 4x CPU, cache off, median of 2 runs, through the review proxy.
Lighthouse is not installed or cached; these are lab numbers, not Lighthouse scores. TBT is the sum of long-task time over 50 ms after FCP.

| Page | FCP ms | LCP ms | CLS | TBT ms | Transfer KB | JS KB | Image KB | Largest image above the fold |
|---|---|---|---|---|---|---|---|---|
| Home | 1916 | 4512 | 0.002 | 888 | 928 | 449 | 323 | hero-porch-mobile 97 KB |
| Guides hub | 2068 | 2068 | 0.000 | 817 | 859 | 440 | 263 | none |
| Fees guide | 2380 | 2380 | 0.011 | 1070 | 827 | 534 | 130 | hero about 130 KB |
| Dataset | 1932 | 1932 | 0.040 | 1047 | 587 | 434 | 0 | none |
| Gear hub | 2088 | 2276 | 0.000 | 601 | 662 | 501 | 0 | none |
| Gear category (car safety) | 2336 | 2336 | 0.031 | 750 | 656 | 498 | 0 | none |
| Packing tool | 2144 | 2144 | 0.011 | 1298 | 666 | 509 | 0 | none |
| Stays hub | 1940 | 1940 | 0.003 | 987 | 604 | 446 | 0 | none |
| Stay page | 2032 | 2032 | 0.000 | 645 | 599 | 447 | 0 | none |
| Town things-to-do (Blue Ridge) | 1956 | 2012 | 0.177 | 681 | 910 | 528 | 226 | things-blue-ridge 226 KB |

Third-party transfer is 180 KB on every page (gtag, loaded on idle after the load event). One render-blocking stylesheet
(17 KB) on most pages and up to 3 head resources on the fees guide and packing tool. No above-the-fold image exceeds
300 KB. Serious items: only F2 (LCP, doubtful because of the proxy) and F1 (CLS on town pages, lab only).

## 6. Functional checks (Playwright, 390 px, analytics requests aborted)

- Packing planner: Cabin, 3 days, 1 dog builds 15 items. Need to buy on bowl and bed shows "researched options" with Amazon cards (`tag` present, `rel` sponsored); on water shows the no-match fallback ("We don't have a matching product recommendation..."); on treats shows "Added to your shopping list. We don't have a matching product recommendation for this item yet." Remove then Undo returns 14 then 15 items. The optional extra ("Add to my list: Collapsible travel crate") exists on live and adds once (15 to 16). Copy my list reports "Your list was copied." and puts a 1,118-character list on the clipboard. Marking packed and reloading keeps "1 of 16 items packed" and the Need to buy flag.
- Gear: "Explore more travel gear" opens `/gear?trip=cabin-stay#trip-collection` with 40 links, tagged Amazon links.
- Stays: 78 cards; Hot tub filter changes the URL to `?hotTub=true` and leaves 35.
- `/tools/will-my-dog-be-accepted` and `/tools/checklist` work (the checklist counts "2 of 25 done").
- Menu opens at 390 with Stays, Destinations, Guides, Gear, Tools. All 19 footer links return 200 (including the Pinterest profile).
- GA4: `googletagmanager.com/gtag/js?id=G-1J97C8CPC1` loads, the right ID. No query string carries an email, name or other personal data; the tools put only dog count, weight digits and breed into their own page URL.

## 7. Content spot read (390 px)

Read in full or in large part: fees, large dogs, heat, car harness and crate, two large dogs, and the Helen and Monterey
things-to-do pages (the packing guide and Blue Ridge page were covered by the mechanical checks only). Arithmetic in the fee
examples (cabin A against B, break-even at 4.5 nights, two-crate weights and widths) is correct; tables render at 390 with
"Swipe sideways" hint; sources lists open; product cards state what the maker says and carry the notice. No wrong fact, broken
layout, misleading commercial statement or heading typo found. Only F8 is worth a look.

## What could not be verified by script

- Whether a 200 Vrbo or Amazon page is the same property or product the card describes, and real-time Amazon stock (F4).
- The 22 bot-blocked or unreachable sources (table above), including all `centerforpetsafety.org` pages, `exploregeorgia.org`, `santabarbaraca.com`, `sandiego.org`, `elliott.org`, `fearfreehappyhomes.com`, `bearwise.org`, AVMA, MDPI.
- Real-device LCP, TBT and CLS (F1, F2, F3); a PageSpeed Insights run is the proper check.
- Whether `/affiliate-disclosure` and the notices read well in their final form on live (they are not deployed).
- The 14 px notice size difference (CSS only, not measured here).
- Content accuracy of the cited sources themselves, and whether retitled sources (F5) are the same document.
- Page-by-page reading of all 103 pages: the mechanical checks cover all of them, the human-style read covers 9.

Analytics note: my first browser pass (65 loads, plus about 10 from an aborted rerun) ran before I started aborting analytics beacons, so a small number of
GA4 page_view hits from a headless Chrome may have reached the property; every later run aborted them. Filter by that
afternoon if the numbers matter.
