# Article product report: policyA (2026-11-19)

Ranked by credibility of fit: 1 secure-fenced-yard, 2 leave-alone, 3 how-many-dogs, 4 pet-fees, 5 breed-restrictions (NO-FIT), 6 red-flags (NO-FIT).

## vacation-rental-secure-fenced-yard (src/content/guides/...ts): INTEGRATED
Section "If the yard falls short, bring your own boundary". Picks: midwest-exercise-pen-with-door, carlson-convertible-pet-yard, ruffwear-knot-a-leash (relatedProducts same). New sources 9-11 (MidWest manual PDF, Carlson page, Ruffwear page), all facts from content/products.yml records. Hedges kept: untrained-pet escape warning, 28 in is low, bar gaps, no stand-alone statement, no leash strength rating.

## can-you-leave-a-dog-alone-in-a-vacation-rental: INTEGRATED
Picks: midwest-icrate-dog-crate (under "crated when alone" rules), north-states-mypet-universal-petgate (ASPCA's baby-gate alternative), kong-classic (settling-in step 2, ASPCA's stuffed-toy advice). Sources 17-19 added. Considered and skipped: cooling pad (not a substitute for climate control).

## how-many-dogs-can-you-bring-to-a-vacation-rental: INTEGRATED (light)
Picks: north-states-mypet-universal-petgate and midwest-icrate-dog-crate, placed after the "two usable zones / meals" bullets as the way to separate two dogs when the rental has no doors. Sources 17-18. Considered and skipped: bowls and leashes (weak tie to the reader's problem).

## how-vacation-rental-pet-fees-work: PARTIAL
New section "Cut the odds of a damage deduction". Picks: pet-parents-pawtect-pads, soggy-doggy-microfiber-doormat, soggy-doggy-super-shammy-towel. States that nothing guarantees no deduction. Sources 8-10. The guide's core (fee structures) is policy, so the fit is secondary.

## breed-restrictions-at-vacation-rentals: NO-FIT
Unchanged. Reader's problem is a legal/policy approval; no catalog product helps a breed ban (the retired muzzle is not to be used).

## pet-friendly-listing-red-flags: NO-FIT
Unchanged. A listing-vetting guide; gear is not the reader's problem. Fence-pen products already sit in the fenced-yard guide.

No new facts beyond catalog records and their specSource pages. lastReviewed set to 2026-11-19 on the four changed guides; readingMinutes: leave-alone 9, fenced-yard 10, fees 9, how-many unchanged at 9.

## For the lead
- Test problem caused by my fees guide: src/test/content-pipeline.test.ts (8 tests) and src/test/pet-cost-workflow.test.tsx (2 tests) copy how-vacation-rental-pet-fees-work.md into a temp dir that has no content/products.yml, so any {{pick}} or relatedProducts in that guide fails them ("not a product id"). Fix the fixture (strip pick lines and relatedProducts, or copy products.yml), or tell me to drop the fees integration. I did not edit tests.
- Other failures (dog-travel-bowls, dog-car-safety, life-jacket, gear-parity, packing) are from other workers' files.
- Heads-up: the cabin packing and pen guides already pick the same pen/gate/crate/towel/mat products; overlap is intentional but the pet-fees picks duplicate the Airbnb damage guide's.
