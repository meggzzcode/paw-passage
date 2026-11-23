# Live site QA audit: https://www.pawsandpassage.com

Audited 2026-11-23 against the LIVE site (read-only; nothing was changed, no forms were submitted to the site, nothing was bought or added to a cart).
Tools: Playwright Chromium at 1280 px (desktop) and 390 px (iPhone-size, touch, deviceScaleFactor 2), plus plain HTTP fetches (no redirect following) for the link and SEO checks. The audit traffic went through a shared proxy; "BLOCKED" below means the third-party site refused a bot request, which is not proof the link is broken.

Verdict: no P0. The site is clean on layout, images, console, tools and SEO. The two things a buyer is most likely to hit are dead internal links to unpublished guides (P1) and external links that bots cannot verify (not defects).

## 1. Pass/fail table

Each page was loaded at mobile (390) and desktop (1280). "Clean" = HTTP 200, no horizontal scroll, 0 console errors/warnings, 0 failed or 4xx/5xx requests (except the one note below), all images loaded (naturalWidth > 0, checked after slow scroll), one h1, Pinterest footer icon present.

| Page | Mobile | Desktop | Notes |
|---|---|---|---|
| / | PASS | PASS | 11 images loaded. 4 images carry alt="" (decorative, acceptable). |
| /guides | PASS | PASS | 30 images loaded. |
| /guides/dog-life-jacket-for-lakes-and-beaches | PASS | PASS | |
| /stays | PASS | PASS | No images by design (no listing photos). |
| /stays/cherry-lake-log-cabin-fenced-yard-up-to-4-dogs | PASS | PASS | See D4 (title truncated with "…"), D6 (button wraps). |
| /gear | PASS | PASS | |
| /gear/beach-vacations | PASS | PASS | |
| /destinations | PASS | PASS | |
| /destinations/georgia/blue-ridge | PASS | PASS | |
| /data/pet-policies | PASS | PASS | |
| /tools/checklist | PASS | PASS | Works end to end (below). |
| /tools/packing-list | PASS | PASS | Works end to end. |
| /tools/pet-cost-check | PASS | PASS | Works end to end; arithmetic verified. |
| /tools/will-my-dog-be-accepted | PASS | PASS | Works end to end. |
| /about | PASS | PASS | |
| /methodology | PASS | PASS | |
| /affiliate-disclosure | PASS | PASS | |
| /qa-no-such-page-404 (404 page) | PASS | PASS | Returns real HTTP 404 with a friendly page and "Go home" button. The only console message is the browser's own "Failed to load resource: 404" for the document itself, which is expected. |

Cross-cutting checks:

| Check | Result |
|---|---|
| Horizontal scroll on mobile | PASS on all 18 pages (scrollWidth 390 = viewport). Also none at 1280. |
| Mobile nav menu | PASS. The "Open menu" button expands Stays, Destinations, Guides, Gear, Tools, and its label changes to "Close menu" (aria-expanded true). Each link was clicked and navigated to the right URL, and the menu closed after navigation. Escape closes it. Screenshot: `evidence/mobile-nav-open.jpg`. |
| Console errors | PASS. 0 errors or warnings on every page and in every tool flow (404 page excepted, see above). |
| Failed network requests | PASS with one note. The only "failed" request is the Google Analytics beacon being aborted (net::ERR_ABORTED) when navigation starts on 4 of the mobile loads and 1 desktop load. It is a normal beacon abort, not a site fault. No first-party request failed and no request returned 4xx/5xx. |
| Images load | PASS. No broken images on any page. A first run reported 10 "pending" lazy images on /guides; a slower scroll proved they load (lab artifact, not a defect). |
| Footer links | PASS. 21 footer links (all four tools, About, Methodology, Corrections, Contact, Privacy, Terms, Affiliate disclosure and so on) are all 200 with no redirect. |
| Pinterest footer icon | PASS. 40x40 SVG link to https://www.pinterest.com/paws_and_passage/ (aria-label "Paws & Passage on Pinterest"), profile returns 200. |
| "Powered by Netlify" badge | PASS, absent. No Netlify badge, iframe or fixed-position overlay found on any page at either size (checked DOM text, class names, iframes and all position:fixed elements). No screenshot was needed. |
| Cookie / consent behaviour | NOTE. There is no consent banner. Google Analytics loads on first paint, and sets `_ga` and `_ga_1J97C8CPC1` cookies with no choice offered. /privacy discloses GA4 and cookies. See D3. |
| Tool: no analytics of typed text | PASS. Sentinel string typed into the cabin-name field of the cost tool: it appears in no analytics URL or body. Only standard GA4 requests fired (event names for tool use were not decoded). |

### Tool end-to-end results (both viewports, identical)

| Tool | What I did | Result |
|---|---|---|
| Checklist | Ticked 3 of 25 boxes, reloaded, then Reset | Counter showed "3 of 25 done"; 3 stayed ticked after reload (saved on device); Reset cleared to 0. PASS |
| Packing list | Toggled driving, rental, older dog, bolts/digs, no fence; added 2 items to bag; Copy list | Recommended/optional split changed from 12/3 to 9/6; the two items showed "Packed"; clipboard text was a correct "[x] Car harness or crate / [x] Back-seat cover..." list. PASS |
| Pet cost check | Load an example, Clear, enter stay name and 3 box ticks, "Write my message to the host" | Totals add up by hand (lodging $800 + $125 + $50 pet + $92.50 tax = $1,067.50; $266.88 per night; pet fees 4.68%). Generated a host message with 11 fence questions plus the stated pet fee and deposit. PASS |
| Will my dog be accepted | 2 dogs, 85 lb and 22 lb, pit bull type: "0 show no conflict, 33 need a question first, 5 look like a problem". 1 dog, no breed: "20 show no conflict". 4 dogs: "0 show no conflict". | Sensible and monotonic; 38 managers listed (result list has 38 managers). PASS |

## 2. Link check

Source: live /sitemap.xml (98 URLs). Every page's HTML was fetched and all `<a href>` extracted: 124 unique internal targets, 456 unique external targets. Redirects were never followed automatically; I walked each chain by hand (max 4-5 hops, one request per URL, no retry loops, 400 ms spacing per host).

Sitemap: 98 URLs, all return 200 on the first request, zero redirects.

Internal links (124 unique targets):
- 121 return 200 directly, no redirects, no chains.
- 3 return 404 (D1): `/guides/bringing-a-dog-to-a-no-pets-rental`, `/guides/pet-friendly-listing-red-flags`, `/guides/breed-restrictions-at-vacation-rentals`. They are linked from 8 live guides (airbnb-pet-damage-charge-after-checkout, how-many-dogs-can-you-bring-to-a-vacation-rental, how-vacation-rental-pet-fees-work, vacation-rentals-with-no-dog-weight-limit, what-a-dog-really-costs-on-a-vacation-rental, pet-friendly-vacation-rental-checklist, vacation-rentals-that-welcome-large-dogs, vacation-rentals-with-no-pet-fee).
- 24 internal targets are not in the sitemap but return 200: 11 filter URLs (`/stays?type=...`, `/stays?state=...&town=...`), 9 stays and 2 destinations (Monterey, Mendocino) that are deliberately `noindex, nofollow` thin pages (rule in AGENTS.md), and `/pet-policies-38-managers.csv`. Consistent, not a defect.

External links (456 unique; Amazon tested separately, below):
- 343 final 200 (of these, 8 pass through 2 to 3 redirects; D5).
- 20 x 403 and 15 x 401: BLOCKED, not broken (bot walls). 401: 15 Unsplash photo-credit pages. 403: cdc.gov (7 URLs), cpsc.gov, exploregeorgia.org, enterprise.com, mdpi.com, napaonline.com, petbook-magazine.com, fearfreehappyhomes.com (2), elliott.org, mumsnet.com (3).
- 2 x 429 Vrbo (BLOCKED, as expected): `vrbo.com/affiliate/hdPLmiF` and `vrbo.com/affiliate/9ohw6rO` (301, then 429). I also fetched one www.vrbo.com listing URL (200). Stopped after 3 requests per instructions. 22 other `vrbo.com/affiliate/...` deeplinks (on /stays) were deliberately not requested: UNVERIFIED. All 12 help.vrbo.com articles return 200.
- No external final 3xx and no network errors.

Amazon affiliate links (no clicks, no cart, one GET each, final status only):
- All 54 unique Amazon links on the live site are `https://www.amazon.com/dp/<ASIN>?tag=pawspassage-20`: 54 of 54 carry `tag=pawspassage-20`, 54 of 54 are /dp/ links. There is no intermediate redirect hop on the site; the buttons link straight to amazon.com.
- All 5 sampled guides use `rel="sponsored nofollow noopener"` on every Amazon anchor.

| Guide | Amazon anchors | Link tested | Final status |
|---|---|---|---|
| dog-life-jacket-for-lakes-and-beaches | 8 | /dp/B0DNM2J19V | 200 (no redirect) |
| keep-a-dog-cool-on-a-summer-trip | 8 | /dp/B0DN4JBXSD | 200 |
| can-dogs-go-in-a-rental-pool-or-hot-tub | 8 | /dp/B0C5N3713P | 200 |
| dog-car-safety-harness-and-crate-guide | 12 | /dp/B08J7S6C4V | 200 |
| dog-travel-bowls-and-food-storage | 8 | /dp/B005QZ4YZQ | 200 |

Caveat: I recorded status only. A bare 200 to a bot does not prove the product page behind it (price, availability) is live; I did not check page content.

## 3. SEO basics

Checked all 98 sitemap pages from live HTML; the 10-page sample is in the table.

| Page | Title / desc (chars) | Canonical | JSON-LD types (parse OK) | OG image |
|---|---|---|---|---|
| / | 64 / 143 | absolute, matches | Organization | /share/default.jpg 200 |
| /guides | 61 / 141 | OK | Organization | default 200 |
| /guides/dog-life-jacket-for-lakes-and-beaches | 59 / 143 | OK | Organization, Article, BreadcrumbList | own jpg 200 |
| /stays | 62 / 214 (too long) | OK | Organization | default 200 |
| /stays/cherry-lake-log-cabin-... | 58 / 126 | OK | Organization, BreadcrumbList | default 200 |
| /gear/beach-vacations | 50 / 137 | OK | Organization, BreadcrumbList | default 200 |
| /destinations/georgia/blue-ridge | 60 / 115 | OK | + TouristDestination | default 200 |
| /tools/pet-cost-check | 56 / 155 | OK | Organization | default 200 |
| /data/pet-policies | 59 / 148 | OK | + Dataset | default 200 |
| /methodology | 47 / 156 | OK | Organization | default 200 |

Site-wide over 98 pages: exactly one `<title>`, one meta description, one h1 each; an absolute https canonical on every page that equals the page URL; no `noindex` on any sitemap page; no hreflang (fine); 0 JSON-LD parse errors; no duplicate titles or descriptions; all 31 distinct OG images return 200. robots.txt allows all and points at the sitemap.
- Sitemap count vs live: 98 listed, 98 return 200, none redirect.
- Drafts: `/guides/breed-restrictions-at-vacation-rentals` returns 404 (also the other two draft slugs). PASS.
- Minor: 5 guide titles exceed 65 characters (D7); one meta description is 214 characters (D7).

## 4. Lab timing (lab data only, not field data or a Lighthouse score)

Playwright, mobile 390 px, cache disabled, CDP throttling of 1.6 Mbps down / 750 kbps up / 150 ms RTT and 4x CPU slowdown; LCP and layout shift via PerformanceObserver; median of 3 cold runs.

| Page | TTFB | FCP | LCP | DCL | Load | CLS | Transfer | Requests |
|---|---|---|---|---|---|---|---|---|
| / | 140 ms | 900 ms | 1,952 ms | 739 ms | 4,232 ms | 0.002 | 906 KB | 42 |
| /guides/dog-life-jacket-... | 184 ms | 968 ms | 1,188 ms | 709 ms | 3,109 ms | 0.038 | 673 KB | 42 |

Both LCPs are under the 2.5 s "good" threshold in this lab setup, and CLS is under 0.1. Home page load event is 4.2 s under this throttling (cause not profiled).

## 5. GA4

- `https://www.googletagmanager.com/gtag/js?id=G-1J97C8CPC1` loads on every page; `window.gtag` is a function.
- A `POST https://www.google-analytics.com/g/collect` with `tid=G-1J97C8CPC1` and `en=page_view` fires for the guide page (dl = the page URL).
- Cookies `_ga` and `_ga_1J97C8CPC1` are set on first load with no consent step. Nothing further was verified (GA property ownership, data in reports, conversions).

## 6. Defects

| ID | Sev | Defect | Evidence / where |
|---|---|---|---|
| D1 | P1 | 3 internal links point to unpublished guides and return 404 ("Page not found"). A buyer reading any of 8 guides can click straight into a dead end. | Targets: `/guides/bringing-a-dog-to-a-no-pets-rental`, `/guides/pet-friendly-listing-red-flags`, `/guides/breed-restrictions-at-vacation-rentals`. Sources: 8 guides listed in section 2. Fix: remove the links or restore the guides; 404 page is `evidence/404-mobile.jpg`. |
| D2 | P1 | 22+ Vrbo booking deeplinks (`vrbo.com/affiliate/...`) cannot be verified by a bot (429). If any approved link has expired, the buyer will find out by clicking. | 2 of 2 tested returned 301 then 429. Owner should click-test them in a normal browser before listing. UNVERIFIED, not proven broken. |
| D3 | P2 | No consent banner: GA4 loads and sets cookies for every visitor, EU/UK/Canada included. Privacy page discloses it, but a compliance-minded buyer will ask. | Cookies `_ga`, `_ga_1J97C8CPC1` on first load. |
| D4 | P2 | Stay page titles are cut mid-name with an ellipsis, e.g. "Cherry Lake Log Cabin…, Blue Ridge GA" and "Bamby Bungalow Family and Pet…". Shows in the browser tab and Google result. | Title tag of `/stays/cherry-lake-log-cabin-fenced-yard-up-to-4-dogs`. |
| D5 | P2 | 8 external source links go through 2 to 3 redirects (outdated URLs). Kurgo hammock link now lands on a differently named product ("rover-hammock"). One is plain http. | tahoegetaways.com/policies; http://cuddleupcabinrentals.com/Cabin-Rentals-Pet-Friendly.php (3 hops); hearthsidecabinrentals.com FAQ; elkspringsresort.com/?p=1899; petsafe.com ramp; kurgo.com wander-hammock (3 hops); gopetfriendly.com blog; vacasa.com/furryfriends. |
| D6 | P2 | On mobile the Vrbo call-to-action text wraps awkwardly inside a rounded pill ("See photos and check dates on / Vrbo"). | `evidence/stay-mobile.jpg`. |
| D7 | P2 | 5 guide titles are over 65 chars (will truncate in Google): dog-hiking-gear-for-a-cabin-vacation 71, vacation-rental-secure-fenced-yard 68, protect-your-car-interior... 72, keep-a-dog-cool-on-a-summer-trip 73, new-years-eve-with-a-dog-in-a-vacation-rental 67. /stays meta description is 214 chars. | HTML titles. |
| D8 | P2 | Every stay page, town page and gear page shares the same default social-share image (/share/default.jpg), so shared links look identical. Only guides have their own. | og:image values. |
| D9 | P2 | A few cited sources are weak for a site that sells on trust: a pages.dev blog (`pawventures.pages.dev`), a TV-show fan forum (`forums.mst3k.com`) and 3 mumsnet threads. | pawventures.pages.dev is cited on the two-large-dogs-in-one-car guide; the other pages carrying these sources were not traced. |

No P0 found: no site-wide errors, no broken layout, no leaked analytics of typed text, no Netlify badge, all key pages load.

## 7. What a buyer clicking around would notice first

1. The first impression is strong: a full-screen hero with a dog, a working three-filter search box, a clean hamburger menu that opens and navigates correctly. Nothing scrolls sideways at 390 px.
2. Reading any of the larger guides (fees, no-pets rentals, large dogs, checklist) and clicking an inline link to a guide that no longer exists: a plain "404 Page not found" (D1). This is the most likely "oh no" moment and is cheap to fix.
3. Clicking a Vrbo "See photos and check dates" button. A bot cannot verify these, so the buyer may be the first person to find an expired link (D2).
4. The tools: all four work, and the numbers are right. The cost tool and "Will my dog be accepted" are the best demo of value.
5. No cookie banner on first load (D3) if the buyer is outside the US or has a lawyer.
6. Stay pages have no photos by design, only a "photos of this stay" box with a Vrbo link; some buyers will read that as thin.
7. Browser tab titles on stay pages that end in "…" (D4).
8. The footer: Pinterest icon, About, Methodology, Corrections, Affiliate disclosure and so on all work.

## 8. Screenshot index (relative paths, mobile 390 px at 2x unless noted, JPEG)

| File | Shows |
|---|---|
| evidence/home-mobile.jpg | / |
| evidence/home-desktop.jpg | / at 1280 px |
| evidence/mobile-nav-open.jpg | Mobile menu open |
| evidence/guides-mobile.jpg | /guides |
| evidence/guide-mobile.jpg | /guides/dog-life-jacket-for-lakes-and-beaches |
| evidence/stays-mobile.jpg | /stays |
| evidence/stay-mobile.jpg | Cherry Lake stay page |
| evidence/gear-mobile.jpg | /gear |
| evidence/gear-cat-mobile.jpg | /gear/beach-vacations |
| evidence/destinations-mobile.jpg | /destinations |
| evidence/town-mobile.jpg | /destinations/georgia/blue-ridge |
| evidence/data-mobile.jpg | /data/pet-policies |
| evidence/tool-checklist-mobile.jpg | Checklist with 2 items ticked |
| evidence/tool-packing-mobile.jpg | Packing list after toggles |
| evidence/tool-cost-mobile.jpg | Pet cost tool with message generated |
| evidence/tool-accept-mobile.jpg | Acceptance tool with 2 dogs and pit bull type filled in (inputs, before result) |
| evidence/about-mobile.jpg | /about |
| evidence/methodology-mobile.jpg | /methodology |
| evidence/affiliate-mobile.jpg | /affiliate-disclosure |
| evidence/404-mobile.jpg | 404 page |

No Netlify badge screenshot exists because no badge is present.

## 9. Not covered / limits

- Lighthouse itself was not run; section 4 is custom Playwright lab timing.
- Tool outputs were checked for sense and arithmetic, not against an independent source of truth for the 38 managers' policies.
- External pages that returned 200 were not checked for content drift (except where a redirect revealed it).
- Real-browser clicks on Vrbo and Amazon buttons, GA4 reporting and Search Console were out of scope.
