# Review (round 3): Traveling With Two Large Dogs in a Car: Crates, Harnesses and Barriers (two-large-dogs-in-one-car)
Verdict: FIX FIRST (five of six r2 issues are fixed; the trust-sensitive Lucky Kennel chip still reads "Maker cites CPS testing", and the kennel and barrier prose is still dense and repetitive)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 5
(Sum 35 / 4 = 8.75, rounded 8.8. No criterion below 4; one point under the gate. Edits 1 to 3 close it.)

Basis: source, r2 review, FIX (incl. Round 3), SEO notes read; rendered at http://localhost:4173/guides/two-large-dogs-in-one-car at 1280 and 390; six card crops read.
Head: rendered title "Two Large Dogs in a Car: Safe Setups | Paws & Passage" (53 chars, keyword first; r2's 68 is fixed); meta description 155 chars (exactly at the limit; "Two large dogs in a car?" opens it, matches SEO primary, CTA verbs "Give/compare/check"). H1 contains the keyword. Hero: two rough collies in an SUV cargo area, on topic, alt text good. No page-level sideways scroll (scrollWidth 390); two tables scroll inside wrappers with the swipe hint. Affiliate links: 6 cards plus prose and "What to buy first" links, all Amazon with tag, "sponsored nofollow noopener"; the Rover Hammock and Sleepypod name links are also marked sponsored. No prices, ratings of ours, stock or urgency. "5 star" is attributed to CPS. Four inbound guide links exist. Pin row echoes the old longer H1, which still matches the new H1.

## Round-2 issues: verified
1. Lucky Kennel chip overstates CPS evidence: NOT FIXED. The prose and the pick text now say CPS lists only the Large (one dog, one crate) and the button opens the Intermediate, but the card chips still read "Intermediate: under 70 lbs", "Integrated tie-downs", "Maker cites CPS testing". The third chip sits beside the Intermediate. It is in products.yml (cardSpecs), not changed.
2. Barrier section repeats itself: MOSTLY FIXED. The duplicated paragraph is gone and PetSafe dimensions appear once in prose. The Kurgo "2-door cars or mini vans" limit still appears in the layout table, the barrier prose and the card line, and "no crash test" appears about five times.
3. Title 68 chars: FIXED (53).
4. Orphan competitor sentence and duplicate "short answer" H2: FIXED.
5. Citation order: FIXED (first appearance 1 to 16).
6. FAQ crate width: present and consistent with the arithmetic (2 x 22 in = 44 in).

## Top 5 issues (most important first)
1. Where: Lucky Kennel card chip "Maker cites CPS testing" (and "Intermediate: under 70 lbs"). What: a reader scanning chips sees a CPS claim next to the size the button opens, while the page text says only the Large is listed. Fix: edit 1.
2. Where: "Measure your cargo floor width before you shop. The crate must also be big enough..." paragraph. What: one 230-word paragraph holds measurement, ASPCA sizing, CPS limits, the size caveat, the button caveat, who it suits and who should skip; the card text repeats half of it. Fix: edit 2 (split and trim).
3. Where: Kurgo Backseat Barrier mentions (table row, barrier paragraph, card). What: the 2-door and mini van restriction is said three times; "names no crash test" is said in the short answer, the barrier paragraph, both cards, the FAQ and the Unknowns table. Fix: edit 3.
4. Where: Sleepypod card and prose. What: the card's "Details" source is the CPS page, there is no maker page, and the page says so twice ("We could not find a Sleepypod product page..." and "we could not read a maker page"). Honest but the reader gets a recommendation whose maker page we cannot read. Fix: edit 4 (say it once).
5. Where: opening line "Two big dogs, one back seat, and a long drive: one leans on the other..." What: an invented scenario in the first screen; not first-hand, but unsourced colour above the answer. Fix: edit 5 (optional).

## What works well
- The Unknowns table, the "How sure we are" block and the under 75 / 75 to 90 / over 90 lb box state exactly where single-dog evidence stops; few pages on this topic admit it.
- The width arithmetic (2 x 70 lb dogs + 2 x 38 lb kennels, 41 in interior, 44 in for two Larges) is labelled as our arithmetic from maker figures, and a buyer can use it with a tape measure.
- "What to buy first" now names and links every product by situation, with a "last, and only if you want a divider" barrier line and an honest note that a seat cover protects the seat, not the dogs. "Buy first" appears once.

## Buyer walkthrough
1. Lands on the H1, collie hero and the bold short answer ("give each dog its own restraint rated for that dog's weight").
2. Picks a layout row, reads what is unknown, measures the cargo floor.
3. Checks the weight box and chooses a harness or the crate card.
4. Clicks "See it at Amazon" or the Details link.
5. Friction: the chip on the Lucky card, the dense kennel paragraph and a long page (12 minutes).

## Mobile notes
- scrollWidth 390; the two tables scroll in wrappers with the swipe hint.
- Six cards stack with wrapped chips and full-width buttons; no overlap.
- The page is very long on a phone; the layout table and the short answer give a fast path.

## Specific edits to make
1. PRODUCT: in content/products.yml set lucky-duck-lucky-kennel cardSpecs to "Sizes: Medium, Intermediate, Large", "Integrated tie-downs", "CPS lists the Large (one dog)".
2. TEXT: split the kennel paragraph after "...turn around in, and it must not slide or shift." and delete the sentences "The maker sells three sizes with integrated tie-downs, so you size each dog's crate to that dog." and "Two of them side by side were not tested together, and the maker sells the ratchet strap kit separately." (both are in the card or the arithmetic).
3. TEXT: in the Backseat Barrier prose delete "The maker says it attaches to the backs of the front seats and will not work in 2-door cars or mini vans, so skip it there." and replace with "It attaches to the backs of the front seats; the layout table lists its vehicle limits." Also delete "Its page names no crash test and says it is designed to prevent distracted driving." (the Unknowns table and card carry it).
4. TEXT: delete "We could not find a Sleepypod product page for the Clickit Sport to read, so the maker's own sizing and fit details are unconfirmed here; check them with Sleepypod before you buy." (the closing skip rule already says so).
5. TEXT (optional): replace the opening line with "Two big dogs, one back seat and a long drive: each needs a restraint, and no single product covers both."
