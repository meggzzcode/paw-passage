# Review (round 6): How Much a Dog Really Costs on a Vacation Rental (what-a-dog-really-costs-on-a-vacation-rental)
Verdict: FIX FIRST. The method (definite / refundable / contingent, worked quote table) is strong and the page is tighter (3,671 to 2,671 words), but it ships a visible table defect (an empty "Source" column), 4-5 marker stacks under both tables, and two gear cards with no supporting text.
Overall: 8.0 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 3 | Layout 3 | Trust 4 | SEO fit 5 | Differentiation 5 (sum 32 / 4 = 8.0; Product placement and Layout are below 4, so FAIL regardless)
Editorial score (1-10): reader appeal 7 | formatting 6 | readability 7 | utility 8 | commercial integration 6 = 6.8 (target 8: not met)

Evidence: source content/guides/what-a-dog-really-costs-on-a-vacation-rental.md vs git show b0f371a~12 version; rendered at 390 and 1280; old scorecard 6.4 STRUCTURAL EDIT (recs: collapse rest-of-bill to one table, keep one worked example, drop or reduce gear, lead with a concrete figure if defensible). Done: rest-of-bill is now a 5-row table; the gear block text is gone. Not done: only two of three worked examples were merged (the Georgia example is still bolted onto the quote table paragraph).

## Checks
1. Rubric: see scores.
2. Editorial: above.
3. 20-second answer: partly. Paragraph 1 gives the fee ranges and "compare what you will pay", so a reader learns the pet fee is a range and not "the" cost within 10 seconds, but the first sentence is a 60-word stack of three ranges, "$20 to $50", "$50 to $400", "up to $1,000", "three charging nothing", before reaching the point. The dek ("The pet fee is one line of the bill...") and the paragraph do not repeat each other. The dek is 22 words, fine. A concrete all-in example (the 5-night table) is far down; a one-line "a 5-night stay with one dog often adds X" cannot be defended, so it is correctly absent, but the first paragraph should say that outright.
4. Material lost: the per-fee H3 explanations are now table cells (Airbnb price-breakdown option, Vrbo guest service fee paid to Vrbo, Vrbo "full breakdown with taxes before confirming" survives in step 2); "How sure we are" block (fine, covered in "What we could not confirm"); the Twiddy "when the pet fee is not the story" paragraph (now only a table row and a link); "what to buy first" and the line pointing to the cleanup gear page for a bigger list (kept as a link in the damage bullet); the Kurgo bed pick and the Super Shammy description. Dropped sources: Kurgo Loft Wander, Soggy Doggy Super Shammy product pages. The Shammy source supported claims that have been removed, but the page still carries a Shammy card (relatedProducts) and the sentence "A doormat and a dog towel cut the mud side of that risk" with no source and no explanation of which towel; the doormat spec claims now live only on the card.
5. Citation system: mechanics work (click opens details and lands at 446 px; back-link returns; direct #src-5 opens; keyboard Enter works, 2 px focus outline; 13 entries). Defects: (a) numbering out of order: first marker is 9, then 8, 10-13, then 3-7 and 7, 9 again; (b) "Sources for this table" lines are stacks of 5 markers (8, 10, 11, 12, 13) and 4 markers (3, 4, 5, 6), against the guide's own limit of two, comma-separated and tiny; (c) 14 x 15 px hit areas; (d) the pet-fee table's cell for Tahoe cites [9] elsewhere but is not in that table's source line (8, 10-13), so the row's source is not where the reader looks; (e) inline "[Airbnb](...)" publisher links appear three times in one paragraph, each to a different Airbnb page ("Airbnb's page... Airbnb's pricing page"), which reads like repeated links, not named sources.
6. Affiliate: one top notice with the Amazon sentence; two "See it at Amazon" buttons, each with "Affiliate link · We may earn a commission if you buy."; Vrbo inline link; all sponsored nofollow noopener; no price lines. OK. But the top notice and gear block are for a page whose body never recommends either product (see issue 4).
7. Tables at 390: four tables. The pet-fee table has an EMPTY third column headed "Source" (all six cells blank), taking about a third of the width and squeezing the text. The three-quote table is 368 px in a 350 px scroller (4 columns, swipes, with the hint), against the style guide's 3-column limit. Others fit.
8. Head: title "How Much a Dog Costs on a Vacation Rental | Paws & Passage" 58 chars, meta 148 chars. Internal links all 200. Amazon links sponsored nofollow noopener.

## Issues (most important first)
1. Where: table under "A few examples, each re-read on 2026-11-18" (header "Manager | What the page says | Source"). What: the Source column is empty in all six rows (leftover from moving the markers out); wastes width at 390 and looks broken. Fix: delete the third column header and cells.
2. Where: "Sources for this table: ..." under both tables. What: stacks of 5 and 4 markers, plus numbering that starts at 9. Fix: put the publisher name in the first column as an inline link (Big Bear Vacations, Tahoe Vacation Rentals, ...), renumber markers by first appearance, and cap any caption at two markers.
3. Where: opening sentence ("In the 38 managers whose pet pages we read..."). What: three ranges, a sample disclaimer, and a "$0" aside in one 60-word sentence before the point. Fix: "A dog's pet fee is only one line: nightly fees ran $20 to $50, flat fees $50 to $400 in our 38-manager sample, and cleaning, deposits, service fees and taxes come on top. Compare the total for your dates." Move "three charging nothing" and "convenience sample" to the dataset section.
4. Where: "Gear for this trip" (doormat and Shammy cards) and the line "A doormat and a dog towel cut the mud side of that risk". What: gear is the weakest fit on a bill-comparison page; the body gives no who-for or skip-it, the Shammy is never named, the doormat claim has no source on the page, and the same sentence says "nothing changes what a host may charge". Fix: remove relatedProducts and the sentence (style guide s9: recommend nothing if nothing fits), or move one doormat card directly under that bullet with a who-for and skip-it line.
5. Where: "Three quotes, side by side (hypothetical)" table. What: four columns (label plus three rentals) scroll sideways at 390 and the paragraph after it appends a fourth scenario (second dog) and the Georgia worked example, so the section carries two examples plus a hypothetical. Fix: keep the table, cut the "real-fee check" sentence or move it into the Cabin Rentals of Georgia paragraph above as one line.
6. Where: "Managers add their own twists" paragraph. What: 120-word block with four separate facts (Georgia per night plus cleaning plus deposit, Tahoe waiver, tax) and no break. Fix: split into three bullets.
7. Where: inline publisher links in "What the pet fee does and does not cover". What: "Airbnb" linked three times to different help pages with identical anchor text. Fix: one marker per claim, or anchors "Airbnb's pet-fee page" and "Airbnb's pricing page".
8. Where: marker hit areas and the swipe hint on tables that fit (the "rest of the bill" table fits, still shows the hint). Fix: min 24 px targets; show hint only on overflow.

## What works well
- The four-pile frame (definite, refundable, contingent, outside the bill) gives the reader a way to compare quotes that no competitor page offers.
- The worked quote table correctly shows a "no fee" rental can be cheapest on cost but the deposit changes cash up front; arithmetic checks out (A 1,300, B 1,250, C 1,300; with two dogs A 1,500; Georgia $50 x 5 + $75 = $325).
- "What we could not confirm" is short and specific to this page.

## Buyer walkthrough
Reader learns the fee range, sorts costs into piles, compares platform lines in one table, runs the quote method, and gets one Vrbo CTA at the end (natural). The gear cards at the bottom are disconnected from anything argued above.

## Mobile notes
- No page overflow (scrollWidth 390); height 12,521 px.
- Empty Source column in the examples table; 4-column quote table swipes.
- Marker stacks under tables are tiny and hard to tap.

## Specific edits
1. STRUCTURE: delete the empty Source column.
2. STRUCTURE: replace the two "Sources for this table" lines with publisher links in column one; renumber by first appearance.
3. TEXT: rewrite the opening as in issue 3.
4. PRODUCT: drop relatedProducts and the doormat/towel sentence, or place one card under the bullet with who-for / skip-it.
5. TEXT: trim the second dog and Georgia examples to one sentence; split the "twists" paragraph into bullets.
6. TEXT: differentiate the three "Airbnb" anchors.

## Questions for the owner
Do you want the gear block kept on a cost page at all? The style guide says no when nothing fits; the reader value is low.
