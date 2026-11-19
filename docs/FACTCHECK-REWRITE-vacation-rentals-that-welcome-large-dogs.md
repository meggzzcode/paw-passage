# Fact-check of rewritten guides, 2026-11-19
Guides: vacation-rentals-that-welcome-large-dogs, dog-friendly-cabin-packing-list, can-dogs-go-in-a-rental-pool-or-hot-tub.

## Corrections
| Guide | Before | After | Why |
| --- | --- | --- | --- |
| packing list, IRIS pick | "PetsRadar calls it its favorite all-rounder food container", source PetsRadar | Maker spec only, source the IRIS maker page | PetsRadar's "best overall / favorite all-rounder" is the IRIS container With Scoop, a 30 lb + 11 lb combo, not the 10 lb bin in products.yml. Label did not apply to this product. |
| packing list, 4 places (short answer, checklist, Storage, FAQ) | "is not bear-resistant" | "Do not count on ... as bear-proof"; "the maker makes no bear-resistance claim" | No source says the bin is not bear-resistant. NPS and BearWise do not address this bin; BearWise even mentions screw-top containers. |
| packing list FAQ | NPS "lists ice chests among items bears treat as food" | "among items to store properly" | NPS wording |
| packing list and pool guide, cooling pad | "a resting spot, not heatstroke prevention" attributed implicitly to Cornell | Labelled "in our view"; states what Cornell says (shade, water, avoid hot-weather exercise; medical emergency). Packing list gains source [[18]] (Cornell) | Cornell page does not mention cooling pads, so it cannot support the claim; it is our judgment |
| packing list, pool guide | "the two items that most reduce mud" / "help most" | "In our view ... most worth buying" | Unsourced superlative |
| pool guide | "since the rule is usually no" | "since where a manager states a rule it is no" | Sample is 7 of 38; "usually" overstated |
| large-dogs guide, How sure we are | no gear mention | Added gear specs from maker pages | Box matched content |
| packing list How sure we are | no gear/NBC mention | Added | same |
| readingMinutes | packing 9, pool 8 | 11, 10 | about 2472 and 2377 words; large-dogs 7 vs 8 left (within 1) |

## Verified in this pass
Kurgo (63 x 56 in, fits most full size trucks and large SUVs, eight attachment points, lifetime guarantee), PetSafe ramp (300 lb, 47-87 in, rails, high-traction, slides closed and locks), PetSafe hitch step (200 lb, 2 in hitch, adjusts, traction), NBC Select "Best cooling mat" (the pad appears as "The Green Pet Shop Dog Cooling Mat"), Green Pet Shop (five sizes, 12-month warranty, warnings), Soggy Doggy towel (31 x 14 in, microfiber chenille, machine wash; no durability claim on page, none in guides) and mat (Large 26x36, XL 36x60, non-slip backing, machine washable, dryer safe; page has no durability claim, but reviews are mixed, guides make none), NPS, BearWise, Cornell heatstroke page signs and treatment statements.

Counts (items checked): VERIFIED 20, PARTIAL 3 (IRIS/PetsRadar, Cornell/cooling pad, NPS ice chest wording; all fixed), WRONG 0, COULD NOT LOAD 0 (BearWise via WebFetch empty, read with curl instead).

## Unresolved (lead decides; products.yml not edited)
- iris-usa-airtight-dog-food-container-10-lb: manufacturerClaimsVsIndependentTesting mentions PetsRadar; PetsRadar reviewed a different SKU (With Scoop, 30 lb/11 lb). The record's "PetsRadar names no product tester" note and any 'best' use for this SKU should be dropped.
- green-pet-shop-cool-pet-pad record cites NBC Select and PetsRadar as naming it best cooling mat: NBC confirmed; PetsRadar not checked.
- Large-dogs picks and checklist, buying-checklist advice (ramp margin, hammock not a restraint, no carrying heavy dog) are our own advice and unlabelled as such only lightly; acceptable.
- Not re-checked: manager table, Airbnb, VCA, CDC, other earlier-verified claims; internal links all exist.

## Verdicts
- vacation-rentals-that-welcome-large-dogs: PUBLISH-READY
- dog-friendly-cabin-packing-list: PUBLISH-AFTER-NOTED-FIXES (fixes applied; products.yml IRIS note outstanding)
- can-dogs-go-in-a-rental-pool-or-hot-tub: PUBLISH-READY
tsc and vitest (content, content-pipeline, product-pick): pass, 228 tests.
