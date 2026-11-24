# Review: Dog Ramp or Steps for the Car (and the Cabin Stairs)? How to Choose for a Senior or Large Dog (dog-ramp-or-steps-for-the-car-and-cabin)
Verdict: FIX FIRST (strong measuring method and honest spec table, but the product set is inconsistent: "four" products promised, five discussed, the table and the picks do not match, and the hero image is not a car or ramp)
Overall: 7.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 3 | Layout 3 | Trust 4 | SEO fit 4 | Differentiation 5  (sum 31 / 4 = 7.75, rounded 7.8; fails the 9.0 gate; Product placement and Layout are below 4)

Evidence base: source `content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md`; rendered `http://localhost:4173/guides/dog-ramp-or-steps-for-the-car-and-cabin` at 1280 and 390 wide (screenshots in the scratchpad `r4/` folder); head read from the page; pin row 9 of `docs/pinterest-pins.csv`; catalog records for `petsafe-happy-ride-compact-telescoping-ramp`, `-extra-long-ramp`, `-side-door-steps`, `-hitch-step`, `-folding-ramp`. Title tag: "Dog Ramp vs Stairs for the Car, Compared | Paws & Passage". Meta description: "Dog ramp vs stairs for the car: maker weight ratings and step heights for four PetSafe products, what vet sources say about jumping, and how to measure." Canonical correct, no robots block.

## Top 5 issues (most important first)

1. **The product set is inconsistent between promise, table and picks (Product placement 3).**
   - Where: meta description and pin text ("four PetSafe products"); the table under "Maker specs side by side"; the "Which one to buy" picks.
   - What is wrong: the page discusses five products. The table holds Folding, Extra Long, Side Door Steps and Hitch Step. The first pick card is the Compact Telescoping Ramp, which is NOT in the table. The Folding Ramp is in the table but has no pick card and is not in `relatedProducts`, even though the catalog has `petsafe-happy-ride-folding-ramp`. The FAQ "How heavy a dog" lists 150/300/200/200 lb and leaves out the Compact ramp's 300 lb. A reader comparing the table to the cards cannot match them.
   - Fix: add a Compact Telescoping row to the table (28 to 70 in, weight 14 lb, 300 lb rating "independently tested, no tester named", folds to 28 in, high-traction surface, rubber feet, side rails; width and height are not recorded in the catalog so write "not listed in our record"); change every "four" to "five"; add the Folding Ramp as a fifth card or state plainly in the table caption that it is listed for comparison and not featured; add the Compact ramp's 300 lb to the FAQ answer.

2. **Hero and pin image do not show a vehicle, a ramp or an aid (Layout 3).**
   - Where: hero image `guide-ramp-steps` and `public/pins/dog-ramp-or-steps-for-the-car-and-cabin.jpg`.
   - What is wrong: a merle dog with front paws on the wooden steps of a blue metal playground or agility platform on gravel. It does not show a car, an SUV, a ramp or a senior dog, and the platform steps are an unusual, steep structure that a buyer could read as the thing being recommended. On a pin the title text is the only link to cars. The alt text describes it honestly, but the topic mismatch remains.
   - Fix (STRUCTURE): swap the hero for an image of a dog at a vehicle's open cargo area or a ramp (owner decision on which image; do not use a product photo we do not have rights to). If no better image exists, the owner should choose a car or porch-step photo; do not leave the playground platform as the lead image.

3. **The headline promises a senior-dog answer the sources and makers do not give (Answer clarity 4, SEO 4).**
   - Where: H1 "...How to Choose for a Senior or Large Dog" and dek "Your big or older dog can no longer hop into the back seat".
   - What is wrong: the article itself says "None of the four maker pages describes the product as a senior or mobility product". The H1 is 92 characters and carries two audiences. A reader with a senior dog gets an honest "ask your vet" and no ramp criteria specific to stiffness (for example surface width, side rails, start-low-angle) beyond the generic checklist.
   - Fix (TEXT): keep the H1 but give the first screen a one-sentence answer naming the products: "For most cars a telescoping ramp is the usual pick (we feature the Compact and Extra Long PetSafe ramps); steps only suit a fixed door sill or a 2 in hitch." Put it directly under the opening paragraph, above the bullets. Add to the checklist a line for the senior case that stays within the sources: "For a stiff or sore dog, AKC says to start a ramp at a low angle and raise it gradually; ask your vet first."

4. **Buying advice is missing "who should skip it" and small-dog sizing for the picks (Buying advice 4).**
   - Where: the four pick paragraphs under "Which one to buy".
   - What is wrong: each pick says who it suits, but none says who should skip it. Examples that follow from the maker data: skip the Extra Long (47 to 87 in, 18 lb) if you cannot lift 18 lb or have a short driveway; skip the Hitch Step if you have no 2 in hitch; skip the Compact if your cargo floor is above about 22 in at the 18 degree figure the page itself computes. The Folding Ramp, the lightest at 10 lb, is dismissed in one closing sentence with no card, though it is the one most small-dog owners would look at. There is no plain "if you only read one line" product shortcut tied to height ranges.
   - Fix (TEXT): after each pick card add a "Skip it if" line using only the figures already in the article. Add a three-row decision shortcut before the picks: "Cargo floor about 20 in or lower and tight trunk: Compact (reaches about 22 in at 18 degrees). Floor 24 to 28 in: Extra Long (reaches about 27 to 30 in at 18 to 20 degrees). Same fixed sill every time: Side Door Steps if your sill is within 21.25, 24.75 or 28 in." Label it "our arithmetic from maker lengths".

5. **Over-hedged repetition of the "five pages, not a study" point (Reader flow 4, Trust 4).**
   - Where: "So AKC and VCA name a ramp for the vehicle..." and the "How sure we are" block.
   - What is wrong: the same limitation is stated in the vet-sources section, in "How sure we are", and in the FAQ; the PetMD and CARE statements are summarized three times (FAQ, sources section, "How sure we are"). The page runs 8 minutes on desktop and about 19,700 px on a 390 px phone.
   - Fix (TEXT): delete the paragraph that begins "So AKC and VCA name a ramp for the vehicle" (its content is repeated in "How sure we are") and shorten "How sure we are" to two bullets. Move "What we could not confirm" table above "Stairs at the cabin or rental" only if the owner wants fewer clicks to the caveats; otherwise leave.

## What works well
- The measuring section and the arithmetic table (length times sine of the angle) are original, correct (I re-checked: 47 in gives 14.5 and 16.1 in, 62 in gives 19.2 and 21.2, 87 in gives 26.9 and 29.8, 70 in gives 21.6; 21 in step rise needs about 61 in at 20 degrees) and explicitly labelled as our arithmetic, not a maker claim.
- The maker specs table separates what the maker states (weights, sizes, step heights) from what it does not (incline, folded size, who tested the rating), and the "What we could not confirm" table turns every gap into a "check for yourself" action. No prices, no ratings, no invented testing.
- The rental-stairs section with a message to the host is something no competitor in the research table offers, and it links to the senior rental guide with a clear next step.

## Buyer walkthrough
1. Lands from "dog ramp vs stairs for car"; the first paragraph and "What to buy" box answer "ramp, rated above the dog's weight, with rails, measured first". No product is named in that box.
2. Reads the checklist, then the vet-source section (about four screens of quotation) before reaching the spec table; the actual comparison arrives after the argument, so a buyer in a hurry scrolls.
3. Measures, then reaches "Which one to buy": four cards with "See it at Amazon" buttons, each introduced by its problem. Good.
4. Friction: the table does not include the first-listed pick; the Folding Ramp has no card; the cards repeat again under "Gear for this trip" (acceptable) but no "skip it if".
5. Ends with "What to buy first" and links to the car safety guide, the trip checklist and the packing list. The senior dogs gear link redirects to /gear/ramps-and-steps (works).

## Mobile notes (390 px)
- No page-level horizontal scroll. The spec table is 532 px wide inside a 350 px wrapper, so the "Height or incline stated" and "Other maker details" columns sit off-screen and a reader must scroll the table sideways to see the incline column, which is the point of the table.
- The H1 is five lines tall and wraps at 390 px, and the dek adds five more: the hero image starts below the first screen. The disclosure, date and "11 official sources" row is visible in the first screen; the full disclosure sentence is just below it.
- The page is about 19,700 px long on a phone; the "On this page" navigation is present. Pick cards sit between argument paragraphs but are short enough not to break flow.

## Specific edits to make
1. **TEXT** In the meta `seoDescription` and the pin description (`docs/pinterest-pins.csv` row 9), replace "four PetSafe products" with "five PetSafe products" (or keep "four" only if the table and cards are cut to four; do not leave a mix).
2. **STRUCTURE** In the "Maker specs side by side" table add a row: `Happy Ride Compact Telescoping Ramp [[11]](https://petsafe.com/product/happy-ride-compact-telescoping-dog-ramp) | 300 lb (maker; "independently tested", no tester named) | 28 to 70 in long; width and height not in our record | 14 lb | No incline stated; collapses to 28 in | Side rails, rubber feet, high-traction surface`. Then change "The four products here run from 150 lb to 300 lb" to "The five products here run from 150 lb to 300 lb".
3. **PRODUCT** Add `petsafe-happy-ride-folding-ramp` to `relatedProducts` and add a card after the Extra Long pick: "{{pick:petsafe-happy-ride-folding-ramp|For a smaller dog and the lightest carry|The maker lists 62 x 16 x 4 in, 10 lb, a 150 lb rating it calls independently tested (no tester named), side rails and a safety latch; the folded size is not listed.|https://www.petsafe.com/p/happy-ride-folding-dog-ramp/62462/}}". Delete the sentence "We feature it in our senior dog rental guide." or keep it as a second sentence.
4. **TEXT** In the FAQ "How heavy a dog" answer, replace "state 150 lb for the PetSafe Happy Ride Folding Dog Ramp, 300 lb for the Extra Long Telescoping Ramp, and 200 lb for both" with "state 150 lb for the PetSafe Happy Ride Folding Dog Ramp, 300 lb for both the Compact and Extra Long Telescoping Ramps, and 200 lb for both".
5. **TEXT** Under the opening "What to buy:" paragraph add: "In short: a telescoping ramp such as the Compact (28 to 70 in) or Extra Long (47 to 87 in) PetSafe ramp suits most cars and SUVs by the maker's figures; steps only suit a fixed door sill or a 2 in hitch. The sections below show how to check your own height."
6. **TEXT** After each of the four pick cards add one line starting "Skip it if": Compact: "your cargo floor is above about 22 in at an 18 degree slope (our arithmetic)"; Extra Long: "you cannot lift 18 lb or have no room for up to 87 in of ramp"; Side Door Steps: "your sill is far from 21.25, 24.75 or 28 in, or you want to know how it attaches (the page does not say)"; Hitch Step: "your vehicle has no 2 in hitch".
7. **TEXT** Delete the paragraph beginning "So AKC and VCA name a ramp for the vehicle, PetMD recommends..." and keep the "How sure we are" bullet that says the same thing.
8. **STRUCTURE** Move the "Maker specs side by side" table (with its one-paragraph intro) above "What vet and kennel-club sources say about jumping and stairs" and keep the vet section as a closing "what the sources say" block, so the comparison arrives within the first third.
9. **STRUCTURE** Replace the hero image (see issue 2) with a photo of a dog at a car's cargo area or a ramp; if none, re-crop the pin so the title block carries a "Car, SUV, truck" subline.
10. **SEO** Add to the FAQ: "How steep should a dog ramp be?" Answer from existing text only: "None of the four maker pages states an incline. Petful, citing a dog behaviorist, gives about 18 to 20 degrees, which is one person's figure, and CARE says only that it must not be too steep. Use the arithmetic table in this guide, then ask your vet." Also add "What size dog ramp do I need for an SUV?" pointing to the measuring section.
11. **SEO** Change the H1 only if the owner agrees: "Dog Ramp or Steps for the Car? How to Choose for a Senior or Large Dog" (drops "(and the Cabin Stairs)", which the page treats briefly) or keep it and leave the cabin-stairs text in the dek.
12. **TEXT** Replace the "Hypothetical, with round numbers" paragraph's last sentence "Whether a ramp can safely lie against real steps is for the host and the maker to answer." with "Whether a ramp can safely lie against real steps is for the host and the maker to answer; none of the four maker pages covers it."

## Questions for the owner
- Is there a better hero image (dog at an open cargo area or ramp) available, or should the playground-steps photo stay?
- Should the Folding Ramp become a full pick card (it is the lightest and the lowest rating, so the clearest "small dog" answer) or stay as a comparison row only?
