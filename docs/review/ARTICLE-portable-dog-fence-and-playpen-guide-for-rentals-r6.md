# Review r6: Portable Dog Fence for Rentals: Pens and Playpens When There Is No Yard (portable-dog-fence-and-playpen-guide-for-rentals)
Verdict: FIX FIRST (shorter and answer-first now, but the same four-pen spec set is still told five times and one banned price line remains)
Overall: 7.5 / 10 (FAIL)
Editorial score (1-10): 6.6 (reader appeal 7, formatting 6, readability 6, utility 8, commercial integration 6)

Scores (1 to 5): Answer clarity 4 | Reader flow 3 | Buying advice 4 | Product placement 4 | Layout 3 | Trust 4 | SEO fit 4 | Differentiation 4 = 30/40. Reader flow and Layout are below 4, so FAIL regardless of total.

Evidence run: Playwright Chromium at 390 and 1280. About 2,640 rendered words (was ~3,440; -23%).

## Checks
1. Rubric: see scores above.
2. Editorial 6.6, below the owner target of 8. Utility is good; repetition and the commercial density drag it down.
3. 20-second answer: yes, the dek gives it ("freestanding folding pen taller than your dog can jump, host's permission, stay with your dog, skip for escape artists"). But the first paragraph then restates it (pen for a jumper, small dog, "supervised tool", "host's rules decide") and "At a glance: our picks" lists the same picks a third time before the first H2. Dek, paragraph and At a glance are three versions of one answer.
4. Facts lost (compare git show b0f371a~12): the old "What to check on any pen" detail on the metal pen's corner stabilizers keeping the octagon shape and the metal yard maker's stability wording; the full 24/30/36/42/48 size list (now "24 to 48 in size designations"); the Petmate "no usable height" is kept; the "Buying checklist" and "Pick by situation" rows for "Jumper, host allows nothing on the walls" and a separate "Large dog or jumper" row merged into one (fine). Nothing material for safety vanished; tie-out section is down to one paragraph as requested.
5. Citations: #src-n jumps work at 390 and 1280, Sources details opens on hash, back-link returns, Tab+Enter works, max adjacent markers 2 ("2 3"), 0 markers in the two tables. Defects below (tap target, header overlap, FAQ markers external).
6. Affiliate: one top notice, Amazon sentence present, 4 cards each with the "Affiliate link" label. FAIL on "Check the current price": the line "We give no prices because they change; check the current price on the listing." is still under "What to look for". 22 sponsored links for 4 products (names in prose, at-a-glance, intro, both tables, cards, buy-first) is heavy; rel is correct on all.
7. Tables: two tables. Table 1 (five columns: Product, Height, Door, Floor protection, Best for) is 465 px wide in a 350 px scroller; first column sticky and holds at 390 (verified offset 0 after scrolling), "Swipe sideways" hint present, no page overflow (390 = 390). But the visible slice shows only the first two and a half columns, and column 4 header is clipped ("Floor protectic") until the reader scrolls; style guide max is 3 columns. Table 2 (3 columns) fits.
8. Head: title "Portable Dog Fence for Rentals Without a Yard" 45 chars; meta 150 chars; all 26 internal links 200.

## Issues
1. Where: first paragraph "The MidWest Exercise Pen with Door, in the tallest size..." and "At a glance: our picks". What: both repeat the dek and each other; the page promises the answer three times before the first H2. Fix: delete "At a glance: our picks" (the first paragraph already names the two main picks; the second table and What to buy first carry the rest), and make the paragraph add only the new fact (which pen for which dog) not "pen is a short supervised tool".
2. Where: "We give no prices because they change; check the current price on the listing." What: banned line (item 6 of the brief); also an unnecessary disclaimer. Fix: delete the sentence.
3. Where: table "Pens, gates and crates" (first table) plus the four cards plus the per-pen paragraphs. What: the same specs (heights, latch, floor, stabilizers) appear in the table, the paragraph and the card for every product; the scorecard asked for one table and no duplicate card specs. Fix: keep the cards and the second ("Pick by situation") table; delete the five-column table, or cut it to Product / Height / Best for (3 columns) and remove the specs that the cards repeat.
4. Where: "Pick by situation" table and "What to buy first" list. What: the same four recommendations are given again (pen for a jumper, Carlson for a small dog, gate for a doorway). Fix: reduce "What to buy first" to the measure-and-ask step plus one line pointing to the table; no product names.
5. Where: product names throughout (22 sponsored links, 3 to 5 per product). What: heavy affiliate density; the scorecard asked for one button per card. Fix: link a product name once in prose and keep the card button; unlink in tables, at-a-glance, intro and buy-first (or keep only intro and card).
6. Where: every superscript marker. What: 6 to 14 px wide tap target at 390 px. Fix: padded hit area at least 24 px (see shared note in other r6 reviews).
7. Where: Sources "back to text" link. What: back-link lands the marker at viewport top 0 under the 65 px sticky header. Fix: `scroll-margin-top: 90px` on `[id^="cite-"]`.
8. Where: FAQ answers ("Can a portable dog fence replace a fenced yard...", tie-out answer, "How tall..."). What: markers in FAQ are links straight to the publisher page, not to #src-n, so they behave differently from body markers and do not open the Sources list. Fix: point them to #src-n or remove (the body already cites them).
9. Where: "What this page cannot tell you" plus "Before you buy" / "What to look for" ("None of the pens we read states one"). What: the missing-dog-size-limit hedge is stated in What to look for, in the Carlson card ("no dog-size limit is stated"), in the Pick by situation table and in What this page cannot tell you. Style guide: state it once. Fix: keep it in "What this page cannot tell you" only and cut the other three.
10. Where: inline publisher names ("MidWest says...", "Humane World for Animals...", "Petmate"). What: not linked; only superscripts link (style guide section 7). Fix: link the publisher name inline for the first mention.

## What works well
- Dek is a real answer, not a teaser, and the "stay with your dog, skip for escape artists" limit is stated up front.
- Tie-out section is now one tight paragraph that still carries the Humane World quotes and the stay-in-arm's-reach advice.
- The rental-etiquette questions list is concrete and the pen-at-home-first section is practical.
