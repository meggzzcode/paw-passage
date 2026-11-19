# Rewrite fact-check, 2026-11-19

Guides: puppy-at-a-vacation-rental, vacation-rental-with-a-senior-dog, christmas-week-in-a-cabin-with-a-dog. Scope: new and changed material (picks, product records, checklists, what-to-buy, citations, links, reading time). tsc clean; content, content-pipeline and product-pick tests pass (228).

## Corrections

| Guide | Before | After | Why |
| --- | --- | --- | --- |
| puppy | Crate pick source was the ASPCA crate page, but the "Why" sentence is mostly maker facts (divider, six sizes, pan, flat fold) | Source is the maker page; the ASPCA match stays in the "Why" wording and in the cited prose | ASPCA page confirms only the sizing and divider advice, not the maker specs |
| puppy | "makers say no toy is indestructible" | "the maker says no dog toy is indestructible" | One maker (KONG), exact wording |
| puppy | readingMinutes 8 | 10 | About 2,327 body words / 238 = 10 |
| senior | readingMinutes 20 | 14 | About 3,139 body words / 238 = 14 |
| senior | Pawtect "Why": "among washable pads" | "among puppy pads" | Petful page is its best puppy pads list |
| senior | Checklist: rating "well above your dog's weight" unattributed | Marked as our rule of thumb; AKC says to check the rating | AKC says check the weight rating; "well above" is our advice |
| christmas | Polar Trex boots pick card (and relatedProducts entry) | Removed; boots advice kept as generic prose | Maker page still shows every size out of stock |
| christmas | Cold section ended at "not to a number" | Added: gear does not make a cold walk safe; ASPCA rule above still applies | Make sure nothing implies protection from cold injury (Ruffwear pages make general warmth claims only) |
| christmas | readingMinutes 9 | 11 | About 2,605 body words / 238 = 11 |

## Pick and product checks

| Item | Result |
| --- | --- |
| Pawtect "Best washable" (puppy and senior) | VERIFIED. Petful heading: "Best washable: Pet Parents Pawtect Pads Washable Pee Pads (34x36 inches, 2 count)"; it is the only washable label. Maker page: machine washable, triple layer, waterproof backing, StickyPaw grip, four sizes, 2-pack. Record matches. |
| LifeStages crate | VERIFIED on maker page: six sizes 22-48 in, divider included, removable pan, folds flat, no dimensions or warranty. ASPCA page: size for adult dog, panel to shrink space, "pee or poop at one end," one to two hours. Record matches. |
| KONG Classic | VERIFIED: six weight bands as in record, "size up," Puppy KONG softer for under 9 months, "Supervised use only," "no dog toy is indestructible." |
| PetSafe folding ramp | VERIFIED: 150 lb, side rails, high-traction treads, rubber feet, folds in half and locks. No senior or mobility claim. |
| PetSafe side-door steps | VERIFIED: 200 lb, three heights (21.25, 24.75, 28 in), rails, textured steps, rubberized feet, fold and handle; page says "designed for dogs of all ages." No senior claim. Senior guide says the makers do not describe them as senior or mobility products and tells readers to ask their vet. Good. |
| AKC stairs and ramps | VERIFIED (height to sofa, bed or trunk; weight rating; non-slip). Page does not cover full indoor flights, as the guide says. |
| Ruffwear Climate Changer fleece | VERIFIED: 260 g polyester, sleeves, full-length zipper, XXS-XL chest girth, cold gentle wash, no numeric temperature rating. Page has general warmth wording; the guide quotes none and claims no protection. |
| Ruffwear Polar Trex boots | VERIFIED facts (waterproof windproof softshell, lugs, set of two, 1.50-3.25 in, no rating) but OUT OF STOCK; pick removed. |
| Kurgo Loft Wander bed | VERIFIED: roll-up, water-resistant ripstop top, waterproof nonslip bottom, Medium and Large, hand or machine wash. Page showed an Add to Cart button with a delivery window. |

## Other checks (no change needed)

- All [[n]] match source order and every source is cited in all three guides; no dangling "above/below" references (the "below" pointers in checklists resolve); cards-hidden reading is coherent.
- Internal links resolve to existing guides, tools or src/content guides. No prices, ratings or first-hand wording; "have not tested them" is stated.
- "How sure we are" boxes and unknowns tables still match content (5 of 38, 38/19 managers, 4 of 17, 3 of 17 counts unchanged).
- Ledger counts for the rewrite pass: VERIFIED 9 product or source items, PARTIAL 1 (crate pick source mismatch, fixed), WRONG 0, COULD NOT LOAD 0. Earlier-round claims were not re-fetched, per brief.

## Unresolved for the lead (products.yml not edited)

- ruffwear-polar-trex-boots is out of stock; consider active: false or a replacement boot, and note the Christmas guide no longer shows it.
- Kurgo Loft record accessedOn 2026-11-16; page re-read today, still matches.
- Ruffwear pages make general warmth wording ("core heat retention," "protection in cold temperatures"); the records say no rating, which is accurate, but do not add warmth claims to cards.

## Verdicts

- puppy-at-a-vacation-rental: PUBLISH-READY
- vacation-rental-with-a-senior-dog: PUBLISH-READY
- christmas-week-in-a-cabin-with-a-dog: PUBLISH-AFTER-NOTED-FIXES (boots pick removed; lead to decide on the product record)
