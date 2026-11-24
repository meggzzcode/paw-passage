# Review (round 4): Traveling With Two Large Dogs in a Car: Crates, Harnesses and Barriers (two-large-dogs-in-one-car)
Verdict: SHIP (all five r3 issues are fixed on the rendered page; what is left is repetition and polish, none of it trust-damaging)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 5 | Trust 5 | SEO fit 5 | Differentiation 5
(Sum 36 / 4 = 9.0. No criterion below 4. This is a bare pass; the three issues below would lift flow, buying advice and placement to 5.)

Basis: r3 review, FIX file, rubric and SEO brief read; page rendered from the frozen build at http://localhost:4174/guides/two-large-dogs-in-one-car at 1280 and 390 with Playwright Chromium; all anchors and rel attributes read from the DOM; page text (about 4,100 words) read in full.
Head: title "Two Large Dogs in a Car: Safe Setups | Paws & Passage" (53 chars, keyword first); meta description 155 chars (at the limit, opens with the primary phrase, CTA verbs "Give/compare/check"); canonical https://www.pawsandpassage.com/guides/two-large-dogs-in-one-car; og:title matches the title; one H1 containing the keyword. Hero: two rough collies in an SUV cargo area, on topic, descriptive alt. Affiliate: 14 Amazon anchors, all with tag pawspassage-20 and rel "sponsored nofollow noopener" (0 failures); disclosure sits above the first link and a "How we earn money" link is in the header block; no prices, ratings of ours, stock or urgency copy; each card carries only "Check the current price on the listing before you buy." Internal links: 6 cards link to /gear/car-safety#<product>, plus the crash-test guide, large-dog guide, car-interior guide, how-many-dogs guide, ramp guide, three tools and the gear category; "Keep reading" lists three related guides. No broken or odd links seen.

## Round-3 issues: verified on the rendered page
1. Lucky Kennel chip "Maker cites CPS testing": FIXED. The chips now read "Button opens Intermediate", "Integrated tie-downs", "CPS lists Large (one dog)", which matches the prose and the "Why we picked it" text.
2. Kennel paragraph too dense: FIXED. It is now two paragraphs; the repeated sizes/strap-kit sentences are gone. Still the longest block on the page (see issue 2).
3. Kurgo barrier limit and "no crash test" repeated: PARTLY FIXED. The prose now points to the table; the card chip, card text and table row still each carry the 2-door/mini van limit (3 places), and "no crash test" still appears in the short answer, table, PetSafe prose, both cards, Unknowns and FAQ.
4. Sleepypod "no maker page" said twice: FIXED. Once in the skip rule and once in the card ("we could not read a maker page"); acceptable.
5. Opening scenario line: FIXED ("Two big dogs, one back seat and a long drive: each needs a restraint, and no single product covers both.").

## Top 3 remaining issues (most important first)
1. Where: Lucky Kennel pick card ("Button opens Intermediate") and the paragraph before it ("For the crate route with big dogs, the Lucky Kennel is the crate in this guide with a named independent listing..."). What: the page's only crate pick sends a buyer with two large dogs (the case in the title) to the Intermediate, which is for dogs under 70 lb and is not on the CPS listing; the card text then tells the buyer to go and find the Large elsewhere. It is honest, but it is a dead end for the exact buyer the article targets, and the card "Why we picked it" is a 70-word spec dump. Fix: PRODUCT: if a Large listing ASIN exists, point the button at it (or add it as the card's second link); otherwise cut the card "Why we picked it" to two sentences ("CPS lists only the Large (110 lb dog, strap kit, one crate, one dog). The button opens the Intermediate; confirm the Large before you order if either dog is over 70 lb.") and drop the Intermediate/Large figures that the arithmetic paragraph already gives.
2. Where: "Measure your cargo floor width before you shop..." and "For the crate route with big dogs..." paragraphs, plus the arithmetic paragraph above them. What: three consecutive dense paragraphs (about 400 words) with the same Intermediate/Large figures stated in the arithmetic, the paragraph and the card; reading it means re-reading numbers three times. Fix: TEXT: keep the figures only in the arithmetic paragraph; in the next paragraph keep one sentence on the CPS listing's narrowness and one on who it suits and who should skip; move the "Measure your cargo floor" line to the end of the arithmetic paragraph.
3. Where: Kurgo Backseat Barrier (layout table row 3, card chip "Not for 2-door or mini vans", card text) and PetSafe/"no crash test" mentions. What: the same restriction and the same "no crash test" caveat are stated in three to seven places; the page is about 4,100 words and 12 minutes. Also product names in prose are not always linked (the PetSafe Happy Ride, the Ruffwear Load Up and Kurgo barrier names in the barrier and harness paragraphs carry only citation numbers, not product links). Fix: TEXT: remove the vehicle limit from the card text (the chip carries it), cut "no crash test" from the PetSafe prose sentence ("remember its page states no weight capacity and no crash test, so it divides the car and does not restrain either dog" to "it divides the car and does not restrain either dog"); PRODUCT/STRUCTURE: make the first prose mention of "PetSafe Happy Ride" and "Ruffwear's Load Up" link to their cards or Amazon links like the other names.

Smaller items: the Sleepypod Amazon link (ASIN B08JQQF9YX) cannot be matched to the CPS-listed Clickit Sport from the page, and the card itself says Sleepypod now shows a Clickit Sport Plus; the owner should confirm the ASIN. The 75 to 90 lb harness route rests on a 2014 test and the page says so; fine, but it is thin evidence for a headline recommendation.

## What works well
- Honest evidence handling: the Unknowns table, "How sure we are" block and weight box (under 75 / 75 to 90 / over 90 lb) say exactly where single-dog evidence stops, and the Lucky Kennel and Sleepypod cards no longer overstate what CPS lists. Few pages on this topic do this.
- A buyer can use it: the width arithmetic is labelled as ours, the layout-by-vehicle table gives a fast path, and "What to buy first" links every product by situation, with the barrier last and a seat cover correctly described as protecting the seat, not the dogs.
- Clean, trustworthy mechanics: 14 properly tagged and rel-marked Amazon links, disclosure up top, citations numbered 1 to 16 in order of first appearance, SEO head within limits, FAQ with six real-search questions, three sensible "Keep reading" siblings.

## Buyer walkthrough
1. Lands on the H1, collie hero and the bold short answer (one restraint per dog, rated for that dog's weight).
2. Finds their vehicle in the layout table, reads what is unknown, measures the cargo floor.
3. Checks the weight box, picks a harness or the crate card.
4. Clicks "See it at Amazon" or "Details and specs" (to /gear/car-safety#anchor).
5. Friction: the crate button opens a size that may not suit large dogs; the kennel paragraphs repeat figures; a 12 minute page.

## Mobile notes (390 px)
- documentElement scrollWidth is 390; no element overflows outside the two table wrappers. Both tables (544 px wide inside a 350 px wrapper) scroll horizontally in place and show the swipe hint.
- Six cards stack with wrapped chips and full-width buttons, no overlap; hero is full width with sensible alt text.
- The page is long on a phone (about 4,100 words); the table of contents, the four-line answer and the layout table give a fast path. FAQ is collapsed (7 details elements including the sources block).

## Specific edits to make
1. PRODUCT: point the Lucky Kennel card button at the Large listing if one exists, or shorten the card "Why we picked it" as in issue 1.
2. TEXT: move the cargo-floor measuring sentence to the end of the arithmetic paragraph and remove repeated Intermediate/Large figures from the following paragraph and card.
3. TEXT: delete "will not work with 2-door cars or mini vans" from the Backseat Barrier card text (the chip and table carry it).
4. TEXT: in the PetSafe sentence, replace "remember its page states no weight capacity and no crash test, so it divides the car" with "it divides the car".
5. STRUCTURE: link the first prose mentions of "PetSafe Happy Ride" and "Ruffwear's Load Up" to their product links.
6. PRODUCT: confirm the Sleepypod ASIN is the Clickit Sport the CPS listing covers, not the Sport Plus.

## Questions for the owner
- Is there a Large-size Lucky Kennel ASIN to link? The card cannot serve two-large-dog buyers well until there is.
