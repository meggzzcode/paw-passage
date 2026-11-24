# Final QA crawl, 2026-11-24

Read-only crawl of the final build at http://localhost:4180 (HEAD ac5da97), Playwright Chromium. Sitemap host https://www.pawsandpassage.com mapped to localhost. 95 sitemap URLs plus 5 `/gear?trip=<slug>` URLs = 100 URLs, each loaded at 1280x800 and 390x844 (200 page loads). Nothing was fixed.

## Summary

| Check | Result |
|---|---|
| Sitemap URLs | 95 (OK); 29 are published guides (/guides/<slug>) plus /guides index |
| Guides index cards | 29 (OK, equal to sitemap guide URLs) |
| HTTP 200, 100 URLs | 100 pass, 0 fail |
| Canonical present and self-referencing (95) | 95 pass. The 5 trip views canonicalize to https://www.pawsandpassage.com/gear (by design) |
| Exactly one H1 | 100 pass |
| Title <=60 chars | 100 pass (longest 60) |
| Meta description 120-160 | 78 pass, 22 fail, all too short (list below) |
| Stray noindex | 0 (the 5 trip views carry "noindex, nofollow", expected) |
| Horizontal overflow at 390 / 1280 | 0 / 0 |
| Console errors at 390 / 1280 | 0 / 0 (only aborted google-analytics collect beacons, 0 other failed requests) |
| Redirects | weight-limit URL 301 to the large-dogs guide: pass. no-pets-rental 404: pass. Trailing-slash URLs 301: pass (11 of 11 sampled) |
| Guides: raw '[[' or '](' | 0 |
| Guides: doubled publisher group | 2 guides fail |
| Guides: parenthetical inside quotation marks | 4 guides fail |
| Guides: sup.cite numbers | 0 |
| Guides: frontmatter source URLs linked in body; Sources list count equals frontmatter | 29 of 29 pass |
| Guides: reading time header equals index card | 29 of 29 pass |
| Guides: first paragraph above 700 px at 390x844 | 27 pass, 2 fail |
| Guides: one top affiliate notice with the Amazon Associate sentence | 29 of 29 pass |
| 'Check the current price'; per-card 'Affiliate link' label | 0; 0 |
| Amazon links (all pages) with tag=pawspassage-20 and sponsored nofollow noopener | all tagged affiliate buttons and inline links pass. 15 untagged amazon.com/dp links (citation "Source" or "Amazon listing as read" links) fail the strict href and rel rule; none uses another tag |
| Product cards: first action is "See it at ..." before "Details" | every card on every page passes (guide cards: 93); no card lacks a buyer button |
| Same product as two cards on one page | 4 of 5 trip views fail (Featured section repeats a trip-collection card); no guide or category page repeats |
| Retired sleepypod-clickit-sport | 0 links, 0 slug in HTML, 0 text of "Clickit Sport" alone. 1 text mention of "Clickit Sport Plus", a different current product, in the Sources list of dog-car-safety-harness-and-crate-guide |
| Gear: 11 categories on hub; counts equal cards on each category page | 11 of 11 pass |
| Gear trip views >=3 products; counts match hub "See N picks" | 5 of 5 pass (9, 9, 6, 5, 7 in the trip collection) |
| Empty sections | none (no heading without content) |
| Tools load and basic interaction | 3 of 3 pass at both widths |
| Pet cost calculator or host-questions tool mentions or links, all 100 rendered pages | 0 (routes /tools/cost-calculator, /tools/host-questions, /tools/pet-cost-check 301 to /tools) |

## Failures

### Meta descriptions outside 120-160 (22, all under 120)
- /contact (100 chars)
- /corrections (88 chars)
- /destinations/california/san-diego (114 chars)
- /destinations/california/santa-barbara (92 chars)
- /destinations/georgia/blue-ridge (115 chars)
- /destinations/georgia/dahlonega (94 chars)
- /destinations/georgia/ellijay (98 chars)
- /destinations/georgia/helen (103 chars)
- /gear/car-interior (112 chars)
- /gear/car-safety (109 chars)
- /gear/cold-weather (101 chars)
- /gear/comfort-and-cooling (109 chars)
- /gear/feeding-and-hydration (115 chars)
- /gear/pens-and-gates (106 chars)
- /gear/ramps-and-steps (99 chars)
- /gear/rental-cleanup (113 chars)
- /gear/safety-id-first-aid (105 chars)
- /gear/trail-and-hiking (105 chars)
- /gear/water-and-beach (113 chars)
- /privacy (80 chars)
- /terms (76 chars)
- /tools (106 chars)

### Doubled publisher inside one parenthetical (2)
- /guides/dog-travel-bowls-and-food-storage :: (Springland: 22oz Classic Travel Dog Water Bottle, Springland: 20oz Flip Travel Dog Water Bottle) (n=1)
- /guides/if-your-dog-gets-loose-on-a-trip :: (Fi: GPS Dog Collar with Health & Activity Tracking, Fi: Membership and Community) (n=1)

### Parenthetical inside quotation marks (4)
- /guides/dogs-in-georgia-state-park-cabins :: "our singular pet-friendly (with fee) cabin"
- /guides/new-years-eve-with-a-dog-in-a-vacation-rental :: "important (but not sufficient)"
- /guides/puppy-at-a-vacation-rental :: "a maximum of two (2) pets"
- /guides/vacation-rentals-with-no-pet-fee :: "Do you charge a pet fee, a pet deposit, or a pet cleaning fee for [number] dog(s) on [dates]?"

### First paragraph below 700 px at 390x844 (2)
- /guides/if-your-dog-gets-loose-on-a-trip :: 951 px
- /guides/puppy-at-a-vacation-rental :: 716 px

### Untagged Amazon links (15; rel lacks sponsored on 15; all are citation links, not buy buttons)
- /gear/car-safety :: https://www.amazon.com/dp/B0CKQV4R3C
- /gear/comfort-and-cooling :: https://www.amazon.com/dp/B00RDVE71W
- /gear/comfort-and-cooling :: https://www.amazon.com/dp/B0DPQ4PFD6
- /gear/comfort-and-cooling :: https://www.amazon.com/dp/B0FRMRRZV3
- /gear/pens-and-gates :: https://www.amazon.com/dp/B000QFT1R2
- /gear/rental-cleanup :: https://www.amazon.com/dp/B08R74XVCS
- /gear/rental-cleanup :: https://www.amazon.com/dp/B07H2RHVK4
- /gear/safety-id-first-aid :: https://www.amazon.com/dp/B09FKVQQVH
- /gear/safety-id-first-aid :: https://www.amazon.com/dp/B0FC2HZHPJ
- /gear/safety-id-first-aid :: https://www.amazon.com/dp/B0C9MCCDH9
- /guides/dog-travel-first-aid-kit-guide :: https://www.amazon.com/dp/B09FKVQQVH
- /guides/dog-travel-first-aid-kit-guide :: https://www.amazon.com/dp/B0FC2HZHPJ
- /guides/two-large-dogs-in-one-car :: https://www.amazon.com/dp/B000QFT1R2
- /guides/two-large-dogs-in-one-car :: https://www.amazon.com/dp/B0FRMRRZV3
- /guides/two-large-dogs-in-one-car :: https://www.amazon.com/dp/B0CKQV4R3C
Guide citation links have rel="noopener noreferrer"; gear page "Amazon listing as read" links have rel="nofollow noopener". If the intent is that every amazon.com/dp link carries the tag and sponsored, these fail; if source links are exempt, they are fine.

### Product repeated as two cards on one page (trip views)
- /gear?trip=cabin-stay :: midwest-exercise-pen-with-door x2
- /gear?trip=cabin-stay :: kurgo-loft-wander-dog-bed x2
- /gear?trip=cabin-stay :: soggy-doggy-microfiber-doormat x2
- /gear?trip=hiking :: amk-trail-dog x2
- /gear?trip=road-trip :: petsafe-happy-ride-extra-long-ramp x2
- /gear?trip=winter-trip :: soggy-doggy-microfiber-doormat x2
The trip collection and the Featured section below it both render the card (each with the "See it at Amazon" button). Hub /gear lists 5 featured cards without a repeat. Category pages show cross-listed products as compact rows with no card duplicate (verified by Amazon URL).

### Notes (not counted as failures)
- /gear?trip=bogus returns 200 (unknown trip falls back to the hub, noindex expected).
- Unpublished draft guides breed-restrictions-at-vacation-rentals and pet-friendly-listing-red-flags return 404 and are not in the sitemap (content has 25 markdown files, 22 published, plus 7 TS guides; 29 published in total). bringing-a-dog-to-a-no-pets-rental 404 as required.
- The quote on vacation-rentals-with-no-pet-fee is a suggested question template containing "dog(s)"; the other three are quotes from rental sources.
- Trip view page cards: beach-and-lake 11, hiking 12, cabin-stay 14, road-trip 14, winter-trip 10 (collection plus Featured).
- "pet cost" appears once in prose ("non-refundable pet cost is $325" in what-a-dog-really-costs-on-a-vacation-rental), not a calculator mention.

## Gear categories (hub count / cards on page / standard + compact)
| Category | Hub count | Cards | Std + compact |
|---|---|---|---|
| /gear/car-safety | 10 | 10 | 10 + 0 |
| /gear/car-interior | 4 | 4 | 4 + 0 |
| /gear/ramps-and-steps | 5 | 5 | 5 + 0 |
| /gear/feeding-and-hydration | 9 | 9 | 9 + 0 |
| /gear/pens-and-gates | 8 | 8 | 6 + 2 |
| /gear/comfort-and-cooling | 7 | 7 | 7 + 0 |
| /gear/water-and-beach | 5 | 5 | 3 + 2 |
| /gear/trail-and-hiking | 7 | 7 | 3 + 4 |
| /gear/cold-weather | 3 | 3 | 3 + 0 |
| /gear/safety-id-first-aid | 9 | 9 | 9 + 0 |
| /gear/rental-cleanup | 9 | 9 | 6 + 3 |

## Tools
- /tools/checklist: ticking 2 boxes changed "0 of 25 done" to "2 of 25 done" (390 and 1280).
- /tools/packing-list: choosing "Staying in a rental" and "Add to bag" changed the page content.
- /tools/will-my-dog-be-accepted: 2 dogs, 60 lb, "Check these managers" returned "Of 38 rental managers, 22 show no conflict for your 2 dogs, 13 need a question first, 3 look like a problem".

## Per guide table (body words from .prose-article; H2 count in body; cards = product cards; aff = tagged Amazon links incl. card buttons; untagged = amazon.com source links)
| Guide | Words | H2 | Cards | Aff links | Untagged | Min read | First para y (390) | Frontmatter sources |
|---|---|---|---|---|---|---|---|---|
| airbnb-pet-damage-charge-after-checkout | 1367 | 10 | 1 | 1 | 0 | 6 | 556 | 15 |
| can-dogs-go-in-a-rental-pool-or-hot-tub | 1241 | 8 | 1 | 1 | 0 | 6 | 556 | 17 |
| can-you-leave-a-dog-alone-in-a-vacation-rental | 1542 | 11 | 2 | 3 | 0 | 7 | 556 | 18 |
| christmas-week-in-a-cabin-with-a-dog | 1910 | 9 | 4 | 5 | 0 | 8 | 590 | 18 |
| cold-weather-dog-gear-for-winter-cabin-trips | 2105 | 7 | 4 | 12 | 0 | 9 | 590 | 12 |
| dog-car-safety-harness-and-crate-guide | 2038 | 7 | 4 | 9 | 0 | 8 | 577 | 16 |
| dog-friendly-cabin-packing-list | 1110 | 7 | 1 | 2 | 0 | 5 | 556 | 7 |
| dog-hiking-gear-for-a-cabin-vacation | 1302 | 6 | 3 | 6 | 0 | 6 | 590 | 14 |
| dog-life-jacket-for-lakes-and-beaches | 1493 | 7 | 3 | 7 | 0 | 6 | 556 | 16 |
| dog-ramp-or-steps-for-the-car-and-cabin | 1733 | 7 | 5 | 11 | 0 | 7 | 590 | 11 |
| dog-travel-bowls-and-food-storage | 1408 | 6 | 5 | 13 | 0 | 5 | 556 | 15 |
| dog-travel-first-aid-kit-guide | 2064 | 8 | 4 | 7 | 2 | 9 | 577 | 8 |
| dogs-in-georgia-state-park-cabins | 1551 | 8 | 3 | 5 | 0 | 7 | 590 | 17 |
| how-many-dogs-can-you-bring-to-a-vacation-rental | 1450 | 9 | 2 | 4 | 0 | 6 | 590 | 14 |
| how-vacation-rental-pet-fees-work | 1633 | 11 | 2 | 4 | 0 | 7 | 590 | 7 |
| if-your-dog-gets-loose-on-a-trip | 1813 | 6 | 5 | 6 | 0 | 7 | 951 | 16 |
| keep-a-dog-cool-on-a-summer-trip | 1718 | 7 | 4 | 7 | 0 | 7 | 556 | 15 |
| new-years-eve-with-a-dog-in-a-vacation-rental | 1736 | 9 | 3 | 4 | 0 | 7 | 556 | 20 |
| pet-friendly-vacation-rental-checklist | 1689 | 11 | 4 | 8 | 0 | 7 | 611 | 11 |
| portable-dog-fence-and-playpen-guide-for-rentals | 1595 | 7 | 4 | 9 | 0 | 7 | 590 | 7 |
| protect-your-car-interior-from-a-dog-on-a-road-trip | 1194 | 5 | 5 | 7 | 0 | 5 | 624 | 13 |
| puppy-at-a-vacation-rental | 2021 | 9 | 4 | 7 | 0 | 8 | 716 | 14 |
| two-large-dogs-in-one-car | 2238 | 8 | 9 | 15 | 3 | 8 | 590 | 16 |
| vacation-rental-secure-fenced-yard | 2072 | 10 | 3 | 5 | 0 | 9 | 590 | 11 |
| vacation-rental-with-a-reactive-dog | 2158 | 13 | 3 | 8 | 0 | 9 | 590 | 15 |
| vacation-rental-with-a-senior-dog | 1733 | 10 | 2 | 4 | 0 | 8 | 590 | 26 |
| vacation-rentals-that-welcome-large-dogs | 1989 | 10 | 1 | 1 | 0 | 9 | 590 | 18 |
| vacation-rentals-with-no-pet-fee | 1555 | 7 | 1 | 2 | 0 | 7 | 590 | 19 |
| what-a-dog-really-costs-on-a-vacation-rental | 1088 | 7 | 1 | 1 | 0 | 5 | 556 | 14 |
