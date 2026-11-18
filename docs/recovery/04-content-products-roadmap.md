# 04 - Content, product slots and 30-article roadmap

Prepared 2026-11-18. Investigate-only; this is the one file written. Labels: VERIFIED (seen in repo/page), RECOMMENDATION, NEEDS-USER-ACTION, COULD-NOT-ACCESS. Demand labels: MEASURED only if a tool gave a number (none did), otherwise REPORTED (autocomplete presence) or ESTIMATE.

## Summary (10 lines)
1. VERIFIED: 25 published guides (17 in content/guides, 8 TS in src/content/guides). Product content exists in only 4 guides (car safety, first aid, portable fence, loose dog), 17 products, and none has an affiliateId; button goes to the maker page or spec source.
2. VERIFIED: content/affiliates.yml holds 10 entries, all Vrbo (kind stay). Only one inline affiliate link exists in any guide: `aff:vrbo` at content/guides/how-vacation-rental-pet-fees-work.md:192. So today every guide earns nothing except one Vrbo link.
3. VERIFIED defect: the cabin packing list says "Our rental protection gear guide compares washable covers, travel beds and car-seat covers" but links to itself (src/content/guides/dog-friendly-cabin-packing-list.ts:100). That guide does not exist.
4. VERIFIED waste: src/content/gear/dog-friendly-rental-protection-gear-guide.ts (3 products) and dog-travel-water-and-feeding-gear-guide.ts (5 products) have no guide that renders them. Researched, spec-sourced inventory sitting unused.
5. No search-volume tool was reachable. Google/YouTube suggest worked (REPORTED demand only); Pinterest suggest returned 403 and Google Trends returned 400 (COULD-NOT-ACCESS). No volumes appear below.
6. Autocomplete shows strong, persistent query families for: dog ramp for car, crash tested crates/harnesses, car seat covers/hammocks, travel bowls, dog GPS tracker, "dog friendly cabins [Smokies/Blue Ridge/Asheville]", "dog friendly state park cabins", "hotels that allow 2 dogs", "how long can a dog ride in a car".
7. The 38-manager dataset is regionally uneven (NC 10, GA 9, TN 7, CA 5, CO+FL Gulf 6, 1 multi-region), so regional comparison pages are viable for OBX/NC, Smokies, Georgia only.
8. Roadmap: 30 articles in 12 clusters; 10 marked BUILD FIRST. Only Vrbo is monetized, so stay-intent pages (cabins, state parks, hotels) carry the near-term revenue; gear pages are traffic plus future affiliate slots.
9. Do NOT target "Vrbo" in any title or meta (Expedia terms 12.7, per docs/AFFILIATE-AND-SELLING.md), which rules out "vrbo pet fee" as a keyword for meta-level targeting.
10. Needs your action: approve a product affiliate route (see list at end); 6 items.

## 1. Audit of existing guides and product slots

Product content today (VERIFIED from front matter, `gear:` blocks, grep for `aff:` and `affiliateId`): approved link = Vrbo only. "Gear picks" = rendered by GearPicks with maker-page buttons, no affiliate.

| Guide (slug) | Words | Current product content | Missing product slots | Fitting gear/affiliate categories | Priority before publishing more |
|---|---|---|---|---|---|
| how-vacation-rental-pet-fees-work (fees pillar) | 2,984 | 1 Vrbo inline link (:192), approved | Calculator CTA, no stay link in 'no fee' sections | stays (Vrbo) | High: add 2 contextual Vrbo links; trim repeated tables |
| what-a-dog-really-costs | 3,054 | none | travel bowl, bed, first aid (cost line items) | feeding/hydration, travel beds, first-aid | High: cost lines are natural slots; link to gear guides |
| vacation-rentals-with-no-pet-fee | 3,064 | none | stay link | stays | High: best Vrbo intent page, zero links |
| vacation-rentals-with-no-dog-weight-limit | 2,883 | none | stay link, large-dog crate/ramp | stays, car crate | Medium |
| how-many-dogs | 3,362 | none | stay link, multi-dog car restraint | stays, harness/crate | Medium; cannibalizes checklist/large (see sec 5) |
| breed-restrictions | 3,743 | none | none natural | none | Low; cut length |
| bringing-a-dog-to-a-no-pets-rental | 3,306 | none | none natural | none (stay link to alternatives) | Low |
| airbnb-pet-damage-charge | 2,935 | none | cover/throw, cleanup | rental protection (throw, bed, cover), stain-safe items | Medium |
| pool / hot tub | 3,204 | none | life jacket, towels | water/beach, dog life jacket | Medium: life jacket is natural |
| can-you-leave-a-dog-alone | 3,134 | none | camera, crate, white noise | portable crate/pen, calming | Medium (no unsourced efficacy claims) |
| puppy | 2,817 | none | crate/pen, gate, chew | portable pens and gates, puppy travel | High: only link target is none |
| reactive dog | 3,202 | none | gate, window film, white noise | portable gates/pens | Medium |
| senior | 4,135 | none (mentions ramps/rugs in sources) | ramp, non-slip rug, orthopedic travel bed | senior mobility/ramps, travel beds | High: strongest unfilled slot; cut ~half |
| red flags | 2,923 | none | none | none | Low |
| loose dog | 4,071 | 4 picks (AKC Reunite tag, Tractive DOG 6, DOG 6 XL, Fi Series 3+), no affiliate | none | GPS trackers (Tractive page showed a footer affiliate link; terms not read) | High: ready to monetize |
| NYE | 2,836 | none | calming/ID, white noise | GPS/ID, calming | Medium |
| Christmas cabin | 3,198 | none | tree-safe gate, bed | pens/gates, winter | Medium |
| car safety (TS) | 451 lines | 5 picks (Sleepypod Clickit, Saker Bomber, Sleepypod Atom, Gunner G1, Lucky Kennel); only Saker has productUrl | car seat cover/hammock, barrier, cargo liner | car seat covers, harness/crates | High: highest commercial value |
| first aid (TS) | 411 lines | 5 picks (AMK x2, Kurgo x2, Baskerville muzzle) | tick remover, cooling | first-aid, summer | Medium |
| portable fence (TS) | 309 lines | 3 picks (MidWest, North States, Carlson); productUrl on 2 | gates, tie-out warning | pens and gates | Medium |
| cabin packing list (TS) | 213 lines | none | all categories; broken self-link | whole catalog | High: hub for gear links |
| checklist (TS) | 258 lines | none | link out to gear | gear hub | Medium; duplicates packing list |
| fenced yard / large dogs (TS) | 293 / 274 lines | none | portable pen, car ramp | pens, ramps | Medium |

Gear catalog audit (src/content/gear/*.ts, VERIFIED): 6 files, 25 products (17 of them attached to a rendering guide). All carry specSource with accessedOn dates; none carries a price or rating (good, avoids stale data). Gaps against your category list: no car seat covers/hammocks, no ramps/steps, no travel beds beyond one Kurgo bed, no cooling/winter items, no life jackets, no puppy gear, no calming items, no multi-dog items. Present: crash-tested restraints, first-aid, fences, water/feeding (orphaned), GPS/ID, rental protection (orphaned).

## 2. Keyword demand (honest)

Method: curl to Google suggest (suggestqueries.google.com) on 2026-11-18 for ~125 seeds; YouTube suggest for 5; WebSearch result sets. Autocomplete returns ranked suggestions, no numbers, and is location-biased (UK/Australia noise appears). Presence = REPORTED that people type it; absence is not evidence. No MEASURED volume exists in this report.

| Query family | Evidence (autocomplete, 2026-11-18) | Label | Note |
|---|---|---|---|
| dog ramp for car (+ large dog, back seat, side door) | 8 suggestions for the seed; senior variants appear | REPORTED, strong | Heavy commercial competition |
| dog car seat cover / hammock back seat / cargo liner | 8 + 8 + 8 suggestions | REPORTED, strong | Amazon-dominated SERPs likely (ESTIMATE) |
| crash tested harness/crate | 8 + 8 suggestions; YouTube "dog car harness crash tested" | REPORTED | Covered by our car safety guide |
| pet friendly cabins Smokies / Gatlinburg / Asheville | full 8-suggestion lists incl. "with fenced yard", "indoor pool" | REPORTED, strong | Head terms owned by operators |
| dog friendly cabins Blue Ridge GA fenced yard | 8 suggestions incl. fenced yard | REPORTED | Fenced-yard modifier recurs |
| dog friendly state park cabins | 8 suggestions, state variants (OH, WV, AR, PA, TN, TX) | REPORTED | Official pages + GoPetFriendly |
| hotels that allow 2 / 3 / multiple dogs | 8 suggestions for "hotels that allow 2 dogs" | REPORTED | Multi-dog + hotel gap |
| how long can a dog ride in a car | 8 suggestions (puppy and after-eating variants) | REPORTED | Information, easy intent |
| dog friendly beaches outer banks / is outer banks dog friendly | 8 suggestions | REPORTED | Seasonal rules drive repeat search (ESTIMATE) |
| dog life jacket | 8 suggestions (chin float variants) | REPORTED | Retail-heavy |
| dog gps tracker (no subscription, no cell service) | 8 suggestions | REPORTED | Fits loose-dog guide |
| traveling with 2 large dogs in car | "traveling with 2 large dogs in car" suggested | REPORTED | Thin competition seen |
| dog anxiety car rides | 8 suggestions incl. meds | REPORTED | YMYL, vet-source only |
| vrbo pet fee / policy / deposit | 8 suggestions | REPORTED | Cannot use brand in meta; see rules |
| dog friendly cabins no pet fee / allow large dogs / 3 dogs | EMPTY or 3 generic | REPORTED weak | Our published pages target these; expect small |
| dog friendly road trip route 66 / east coast itinerary | EMPTY | REPORTED absent | Do not build |

People-also-ask, Pinterest, Search Console: COULD-NOT-ACCESS (Pinterest returned HTTP 403; PAA not visible in WebSearch). Third-party survey figures (e.g. PetScreening/Veridata 2026: 67% would pay at least $25 more per night for a pet-welcoming rental) are vendor-sponsored, REPORTED, never ours; treat as context only.

## 3. Roadmap: next 30 articles

Rating: P1 = build first. Intent: I informational, C commercial, T transactional. "Dataset" = src/content/manager-policies.ts (38 managers, dataDate 2026-11-18). All lengths are word targets. Partners column lists candidates only; no company is stated to run a program unless noted (NEEDS-USER-ACTION to verify on the official page and apply).

### Build first (10)

| # | Cluster | Primary keyword | Intent | Proposed headline | Length | Evidence of demand | Original research | Products (existing slots) | Partners (to verify) | Internal links in / out | Maintenance |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Destinations | outer banks dog friendly beaches rules | I/C | "Dogs on Outer Banks Beaches: Rules by Town, Plus What 8 Rental Managers Allow" | 1,800 | REPORTED (suggest: "is outer banks dog friendly") | Dataset: 8 OBX/Hatteras managers (fees, limits; 7 of 38 managers state a pool/hot-tub ban, several of them OBX names: confirm by region before claiming a count) | none needed; life jacket (#13) | Vrbo (stays) | in: fees, pool/hot tub, checklist; out: pool guide, #13 | HIGH: town ordinances change; recheck each May |
| 2 | Destinations | pet friendly cabins smoky mountains rules | C | "Smokies Cabin Pet Policies Compared: Fees, Limits and the 2 Trails Dogs Can Walk" | 2,000 | REPORTED (full suggestion lists for Smokies/Gatlinburg) | Dataset: 7 TN managers + NPS trail rule | pen, first aid | Vrbo | in: fees, no-pet-fee, weight-limit; out: fence, first aid | MED, recheck twice a year |
| 3 | Destinations | pet friendly cabins blue ridge ga fenced yard | C | "Blue Ridge, GA Cabin Pet Rules From 9 Georgia Managers" | 1,800 | REPORTED (suggest incl. "fenced yard") | Dataset: 9 GA managers; add the 2 policy pages read today as worked examples | pen | Vrbo | in: fenced yard, large dogs; out: fenced yard, fence guide | MED |
| 4 | Road trips | how long can a dog ride in a car | I | "How Long Can a Dog Ride in a Car? Stop Intervals by Age, Size and Health" | 1,500 | REPORTED (puppy/after-eating variants) | Compare conflicting competitor intervals (2h vs 4h) with vet sources | bowl, car restraint | none/Vrbo no | in: car safety, puppy, senior; out: car safety, feeding gear | LOW |
| 5 | Gear | dog ramp vs stairs for car | C/T | "Dog Ramp or Steps for the Car (and the Cabin Stairs)? How to Choose for a Senior or Large Dog" | 1,600 | REPORTED (ramp for car, senior variants) | Weight rating and incline check table from maker specs only | ramp x3 (new slots) | Amazon Associates?; Tractive-style maker programs only if official | in: senior, car safety, large; out: senior, car safety | MED (product churn) |
| 6 | Gear | dog life jacket | C/T | "Dog Life Jacket for Lakes and Beaches: Fit Test and What to Check" | 1,400 | REPORTED | Fit-test checklist; Coast Guard-style standard only if an official page is cited | jackets x3 (new) | Amazon Associates?; maker programs | in: pool/hot tub, #1; out: first aid | MED |
| 7 | Accommodations | hotels that allow 2 dogs | C | "Hotels That Allow 2 or More Dogs: Brand Limits, Weight Caps and Where Sources Disagree" | 1,800 | REPORTED (suggest "hotels that allow 2 dogs / 3 dogs / more than 2") | NEW dataset: read each brand's official pet page; document the Red Roof conflict (AKC says two per room, GoPetFriendly says one) | none | none (Expedia program may cover hotels; do not assume) | in: how-many-dogs, no-weight-limit; out: how-many-dogs | HIGH: brand pages change; recheck quarterly |
| 8 | Accommodations | georgia state park cabins dogs | C | "Dogs in Georgia State Park Cabins: The 2-Dog, $50 Rule and How to Request a Dog Cabin" | 1,300 | REPORTED (state park cabin family) | Uses content/places general pet rules; GA DNR rule page (2 dogs, $50/dog/stay, never unattended, requested before arrival) | none | Vrbo (alt stays) | in: fees, large dogs; out: Tallulah/Red Top place pages | LOW-MED |
| 9 | Multiple | traveling with 2 large dogs in car | I/C | "Two Large Dogs in One Car: Crates, Harnesses and Barriers That Work" | 1,500 | REPORTED | Competitors ignore multi-dog; CPS advises against two dogs in one crate (cite CPS page) | restraint (existing 5), barrier (new) | maker programs? | in: car safety, how-many-dogs; out: car safety | LOW |
| 10 | Gear | dog travel water bowl / food container | T | Restore water-and-feeding guide: "Dog Travel Bowls, Bottles and Food Storage: 5 Picks From Maker Specs" | 1,200 | REPORTED (many variants) | Existing 5 products already spec-sourced | 5 existing (orphaned) | Amazon?; Kurgo/Springland/Vittles Vault only if official | in: packing list, costs; out: packing list | MED |

Competitor analysis, priority-1 items (pages actually read 2026-11-18; counts of read pages are shown; items marked "snippet only" were not opened):

1. OBX. Read: outerbanks.org pets-on-the-beach (about 550 words, 7 towns, no date, no lodging, six empty "Sponsored" blocks, Southern Shores/Kitty Hawk/KDH rules incl. KDH 9-6 daytime ban Memorial-Labor Day); blog.twiddy.com (about 1,400 words, 7 sections, no date, mislabeled "don't allow" section, no Hatteras/Ocracoke, no official links); obxguides.com (2018, about 600 words, no Manteo/Ocracoke). Gap: dated, official-sourced, per-town table plus rental-manager rules with sources. Also search result mentioned conflicting leash-length claims for Corolla between sources, so verify each town.
2. Smokies. Read: smokymountains.com top-10 (Oct 2023 byline, about 1,000 words, per-cabin table with $50-$80 fees, 2-pet norm, 35-50 lb limits; 5 of 10 cabins missing a count limit, no sources); Bear Camp (about 330 words, 40 lb, $75 per pet, crate "must" vs "recommended" contradiction, undated); NPS Pets page (updated 2026-08-17; two trails only, 6 ft leash). Gap: manager-level comparison with source links plus the NPS rule in one page.
3. Blue Ridge. Read: Explore Georgia listing (single cabin, no comparison), Cabin Rentals of Georgia policies (under 35 lb, non-shedding, crate trained, $50/pet/night, $75 cleaning, $250 deposit, approval required, no unattended), Shiny Apple Cabins directory page (3 dogs, no fee, fenced yards; roughly 150 words, self-description). No third-party comparison page found. Gap is real but the audience is directory-click, so expect Vrbo/map intent.
4. Ride length. Read: FirstVet (2022, about 1,050 words, "every few hours", no sources), Wag Walking (2020/2022, 15-30 min every 2-4 hours, 7-hour daily cap unsourced, heavy Wag promotion), AAA (2023, about 450 words, every 2 hours). Gap: sourced, age/health-specific intervals; heat note; all three omit sources.
5. Ramp. Read: AKC (updated 2026-03-02, about 1,050 words, affiliate links, thin on car/rental use, no specs), PetMD/Chewy (2025, about 850 words, Chewy links, no disclosure beside links), The Drive (2022/2023, about 1,600 words, 4 products, vague testing, empty sections). Gap: car and rental-stairs use, weight/angle specs, honest "not tested" statement.
6. Life jacket. Read: Ruffwear blog (brand-only), Field Mag (2022/2024, 8 picks, not tested, affiliate), Jeffers size chart (110 words). Gap: fit-test steps and independent-standard framing; no purchase claims we cannot support.
7. Hotels. Read: AKC chain guide (updated 2026-07-31, 13 brands, almost no dollar amounts, no verification dates), GoPetFriendly chain page (2023, about 25 groups, fees and limits listed, some dated), NerdWallet page failed to load usefully (COULD-NOT-ACCESS). Gap: one table with per-brand official-page link and read-date; the AKC/GoPetFriendly Red Roof conflict (two per room vs one) shows why dated primary sourcing wins.
8. GA state parks. Read: gastateparks.org Cottages (dog cabins exist, fee not stated), gastateparks.org ParkRules (2 dogs per cottage, $50/dog/stay, never unattended, 6 ft leash), GoPetFriendly state parks roundup (2024, about 7,000+ words, Georgia section long, Amazon leash links, link errors). Note: docs/RESEARCH-DEMAND.md recorded ParkRules as blocked; it loaded for me today, so recheck rather than assume.
9. Two large dogs. Read: Tractive (2024, about 1,800 words, one dog assumed, no crash standards, tracker promotion), Hill's (2021, about 750 words, one dog assumed), Outside Online (COULD-NOT-ACCESS, login redirect). Snippet only: Dogster, Bustle. Gap: multi-dog layout and CPS-anchored advice.
10. Water gear: competitor pages not read; low differentiation need since the products and specs already exist. Mark: read 3 competitors before publishing.

### Remaining 20 (P2 and P3)

| # | Cluster | Primary keyword (REPORTED unless noted) | Intent | Headline | Length | Notes: research / products / partners / links | Priority |
|---|---|---|---|---|---|---|---|
| 11 | Destinations | dog friendly beach house rentals gulf shores | C | "Gulf Coast Beach Rental Dog Rules" | 1,600 | Dataset FL Gulf 4 managers only; thin, add 4 more first | P2 |
| 12 | Destinations | dog friendly cabins asheville | C | "Asheville Cabin Dog Rules" | 1,500 | Dataset only 2 Asheville managers: do not write until 5+ | P3 |
| 13 | Destinations | lake tahoe / big bear dog rentals | C | "Tahoe and Big Bear Dog Rental Rules in Winter" | 1,500 | CA 5 managers; Tahoe min-age 18 months noted | P3 |
| 14 | Road trips | dog car anxiety / car sickness | I | "Dog Car Sickness and Anxiety on Road Trips: What to Ask Your Vet" | 1,500 | YMYL; vet sources only, no dosing; calming gear only if sourced | P2 |
| 15 | Road trips | dog rest stops | I | "Highway Rest Areas With a Dog: State Rules and Safer Stops" | 1,400 | needs per-state DOT reads; high maintenance | P3 |
| 16 | Road trips | pacific coast highway dog road trip | I/C | "Dog-Friendly Pacific Coast Highway Drive" | 2,000 | 1 suggestion only; competitive; our CA place data helps | P3 |
| 17 | Gear | dog car seat cover / hammock | T | Restore rental-protection guide (3 existing products) + hammock/cargo liner | 1,500 | Fix the broken packing-list link at the same time | P2 |
| 18 | Gear | best dog crate for suv | C | "Crash-Tested Crates for an SUV: Fit and Anchoring" | 1,500 | extends car safety; avoid cannibalization via section merge | P2 |
| 19 | Gear | dog gps tracker no subscription | C | Merge into loose-dog guide as a section rather than new page | n/a | cannibalizes; Tractive/Fi picks exist | merge |
| 20 | Accommodations | pet friendly extended stay | C | "Extended Stay Hotel Pet Policies" | 1,400 | brand official pages; combine with #7 data | P3 |
| 21 | Senior | senior dog orthopedic travel bed | C | "Travel Bed and Non-Slip Setup for a Senior Dog at a Rental" | 1,400 | Kurgo bed exists in catalog; new picks needed | P2 |
| 22 | Senior | can senior dogs travel | I | "Is Your Senior Dog Fit for a Road Trip? A Vet Check-In List" | 1,600 | link to senior guide; vet sources | P2 |
| 23 | Large | large dog car access/boot setup | C | covered by #5 and #18; do not duplicate | - | merge | merge |
| 24 | Multiple | two dogs rental routine | I | "Two Dogs in One Rental: Sleeping, Feeding and Gates" | 1,300 | links to how-many-dogs; avoid repeating limits table | P3 |
| 25 | Puppies | puppy first car ride / puppy before vaccinations travel | I | "Puppy's First Road Trip: Stops, Crate and What Vets Say About Vaccines" | 1,500 | YMYL; link puppy guide; pens | P2 |
| 26 | Puppies | puppy travel crate | C | merge into #25 | - | merge | merge |
| 27 | Safety | bear safety dog cabin | I | "Bears, Dogs and Cabin Trash: What the NPS Says" | 1,300 | NPS source already cited in packing list | P2 |
| 28 | Safety | dog heat safety at a cabin | I | "Summer Heat at a Rental With a Dog" | 1,300 | hot-car head term owned by big orgs; do narrow angle only | P3 |
| 29 | Seasonal | dog winter cabin / snow | I/C | "Winter Cabin With a Dog: Snow, Salt and Boots" | 1,400 | Cornell winter sources already in repo; boots is a REPORTED suggestion | P2 |
| 30 | Seasonal | fireworks July 4 rental | I | "Fourth of July With a Dog in a Rental" | 1,300 | adapt NYE research; ship by early June | P2 |
| 31 | Planning | health certificate dog travel | I | "Health Certificate for Driving With a Dog: When You Need One" | 1,500 | official state pages; error-prone; vet confirm | P3 |
| 32 | Outdoor | tallulah gorge dogs | I | "Dogs at Tallulah Gorge: The Bridge Rule" | 1,100 | place file exists (tallulah-gorge-state-park.yml) | P2 |
| 33 | Outdoor | joshua tree dogs | I | "Dogs in Joshua Tree: Where They Can Go" | 1,200 | place file exists; NPS page 2024 date | P3 |
| 34 | Outdoor | california state park dog rules | I | "California State Park Dog Rules" | 1,300 | place file exists | P3 |
| 35 | Seasonal | thanksgiving cabin dog | I/C | "Thanksgiving Cabin With a Dog" | 1,300 | schedule September 2027; this year too late | P3 |

Count check: rows 19, 23 and 26 are merges into other pages (not separate articles), and rows 12 and 15 are P3 'do not build until data exists' placeholders. Committed 30 = build-first 1-10 plus rows 11, 13, 14, 16, 17, 18, 20, 21, 22, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35 (20 rows). Rows 12 and 15 stay parked.

## 4. Do not write (flagged)
- Head terms "pet friendly cabins smokies/gatlinburg" or "dog friendly hotels near me" as standalone listicles: operators and directories (BringFido, GoPetFriendly) own them, and we lack verified stays.
- "Vrbo pet fee/policy/deposit" with Vrbo in title or meta (Expedia 12.7). A brand-free explainer would also cannibalize the fees pillar.
- Dog hot-car temperature head term: AVMA/humane orgs and vets own it; nothing differentiating.
- Dosing or medication advice for car sickness/anxiety; any claim about "best" without testing; any "tested" language (no testing is done).
- Dog-friendly road trip route/itinerary pages (suggest empty; no data).
- Dog-friendly restaurants, towns, "best cities": local-directory intent, no data.
- "3+ dogs" as a separate page: would duplicate how-many-dogs (see cannibalization).
- Anything citing hotel/rental prices side by side with Vrbo/Expedia prices (docs/AFFILIATE-AND-SELLING.md, Expedia 11.3).

## 5. Improve existing guides first
1. Fix the broken self-link in the packing list (:100) and either create the rental-protection guide (#17) or reword; the same file promises content that does not exist.
2. Add 2-3 contextual Vrbo links to no-pet-fee, no-weight-limit, fees, how-many-dogs, large dogs. Zero today except one.
3. Cut length: senior (4,135 words) and breed (3,743) by about half; damage, how-many, NYE by about a third (per docs/audit/AUDIT-SUMMARY.md, VERIFIED; I agree after counting words).
4. Use the dataset in guides that currently use hypotheticals (fees, how-many-dogs, large dogs). Counts verified today: limit stated 24 of 38 (22 say 2, 2 say 3, 14 silent), weight stated 6, pool rule stated 7, minimum age stated 5, unattended rule stated 8.
5. Convert the loose-dog gear block to affiliate once a tracker/ID route is approved.
6. Reconcile CSV vs TS "no limit" counts (11 vs 14 per audit) before any new "X of 38" claim.

Missing pillar pages (no hub exists, only a flat guide list): Destinations (regional hub: OBX, Smokies, Georgia, California), Gear hub (links all gear guides and tools), Road-trip hub, Accommodation-types hub (rentals vs hotels vs state parks), Multiple-dog hub, Seasonal calendar. Recommended: build the gear hub and destinations hub with the first 10.

Cannibalization map (VERIFIED from relatedGuides and slugs):
- checklist vs cabin packing list vs gear guides: same items; pick one canonical per intent (checklist = booking, packing = what to bring, gear = what to buy).
- how-many-dogs vs large-dogs vs no-weight-limit vs new #7, #9: split strictly by limit-type; new hotel page must not repeat the rental limits table.
- fees pillar vs no-pet-fee vs true cost: fees = mechanics, no-fee = list, cost = trip total.
- fenced yard vs portable fence vs new #3: link, never restate.
- ramp #5 vs senior vs car safety vs #18: #5 owns "ramp or steps"; senior owns the host message.

## 6. Prioritized recommendations
| Priority | Action | Impact | Effort | Ongoing cost | Dependencies |
|---|---|---|---|---|---|
| 1 | Fix packing-list link; add Vrbo links to 5 high-intent guides | Immediate first revenue path | Low | none | none |
| 2 | Publish build-first #2, #3, #8 (stay intent, dataset-backed) | Vrbo clicks, backlinks | Medium | 2 rechecks a year | dataset recheck |
| 3 | Publish #1 before Memorial Day 2027 | Seasonal traffic | Medium | yearly recheck | official town pages |
| 4 | Restore water/feeding and rental-protection guides (#10, #17) | Zero new research | Low | low | affiliate route for any revenue |
| 5 | Choose product affiliate route, then fill ramp/jacket/restraint slots | Only way gear earns | Low after approval | link audits | user action 1-3 |
| 6 | Build #7 hotel table with official pages | Differentiated | Medium-High | quarterly | none |
| 7 | Gear and destinations hubs | Internal linking | Medium | low | after first 5 pages |

## Needs your personal action (6)
1. Decide whether to apply to Amazon Associates (affiliate docs show it is non-transferable; status in this repo is not recorded). Do not use hello@.
2. Search Impact (already connected) for pet/outdoor brand programs and apply from that account; Chewy was declined.
3. Check whether any maker (Sleepypod, Gunner, Kurgo, Tractive, Ruffwear) lists an affiliate/creator program on an official page; Tractive's blog footer showed an affiliate link (page fetched 2026-11-18, terms unread).
4. Confirm with Expedia whether hotels can be linked under the Vrbo/Expedia terms (hotel-intent articles #7, #20).
5. Approve the 10 build-first list and the do-not-write list.
6. Provide or approve Search Console access so MEASURED demand can replace REPORTED within 30 days of first indexing.

## Could not verify
- Any search volume, difficulty, or SERP position (no tool reachable): Pinterest suggest 403, Google Trends 400, PAA not visible.
- Outside Online page (login redirect) and NerdWallet hotel page (body missing).
- Whether any named product maker or hotel brand runs an affiliate program, and any commission/cookie terms.
- Current Corolla/Southern Shores/Kitty Hawk ordinance text (sources disagree on leash length; must read each town page).
- Competitor pages for #10 and #11-#35 were not read; only the 10 build-first items were researched.
