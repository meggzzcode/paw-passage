# Review r6: Taking a Puppy to a Vacation Rental: Age Rules, Accidents and Fees (puppy-at-a-vacation-rental)
Verdict: FIX FIRST. Strong answer and best-in-library evidence (the five managers' own words), but the back-link defect, stale "could not confirm" table and repeated sample caveat keep it under the gate.
Overall: 8.5 / 10 (FAIL)
Editorial score (1-10): appeal 8, formatting 8, readability 7, utility 8, commercial integration 8 = 7.8 (target 8: not met, short by readability)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5 = 34/8 x ... sum 34, 34/4 = 8.5

Build checked: http://localhost:4176/guides/puppy-at-a-vacation-rental at 390 and 1280. Rendered about 2,745 words (old about 3,420 rendered; roughly 20% cut). 16,112 px at 390.

## Checks
1. Rubric: see above.
2. Editorial: appeal 8, formatting 8, readability 7, utility 8, commercial 8.
3. 20-second answer: yes. Dek says "Five of 38 managers ... set a minimum age or ban puppies. Ask in writing before you pay". The short-answer box then restates 5-of-38 / 18 months, and a third sentence repeats the sample caveat ("Our sample is 38 managers' public pet pages, a convenience sample..."). The dek and first paragraph overlap on "ask before you pay"; mild, not a defect.
4. Lost facts: nothing material. Dropped: the "How sure we are" block, the closing "before you go" list (vet consult / vaccination record / alone-time plan; the vet line and vaccination record survive in the vaccination section), "does a litter-mate change the answer", and the per-source markers on the Emmons and Resort Realty quotes (still linked by publisher name). The cut is lighter than requested: the vaccination section and "What we could not confirm" table the old scorecard said to delete are both still there.
5. Citation system: works. Markers (21, all sup, none in tables) jump to #src-n and open the closed Sources details; direct load of /guides/..#src-2 opens it and lands at about 476 px; keyboard Tab to a marker plus Enter opens the list and jumps; Tab to "back to text" plus Enter returns; max stack is 2. Defects: (a) back-link lands with the marker at viewport top 0, under the 65 px sticky header (no scroll-margin-top), so the reader sees the paragraph but not the marker; (b) numbering is not in reading order (first markers read 2, 4, 1, 4, 1); (c) source 3 (Emmons) has no marker anywhere, and Tahoe, Emmons and Resort Realty quotes carry no marker while two others do, so source coverage looks uneven.
6. Affiliate: 4 buy buttons, 4 "Affiliate link · We may earn a commission if you buy" labels; one top notice plus Amazon Associate sentence present; zero "Check the current price". Pass.
7. Tables: one 3-column table (349 px in a 350 px wrapper), sticky first column, no clipping, no marker inside. No page overflow (scrollWidth 390). Note the "Swipe sideways" hint appears although nothing scrolls.
8. Head: title 56 chars, meta 154 chars. 16 internal links all 200. Amazon links all `rel="sponsored nofollow noopener"`.

## Issues
1. Where: back-link "back to text" from the Sources list (all markers). What: lands marker at y=0 beneath the sticky header. Fix: add `scroll-margin-top: 90px` to `sup.cite a[id^="cite-"]` (and the source `li`), or scroll the target to center.
2. Where: "What we could not confirm" table (near the end). What: five rows restate points already made in the body (fee vs accidents, no puppy rate, no deposit, vaccine, other 33 managers); the old scorecard asked to delete it. Fix: cut to the two rows not stated elsewhere (vaccine schedule, other 33 managers) as a two-line note, or delete.
3. Where: opening ("Our sample is 38 managers' public pet pages..."). What: the 5-of-38 sample appears in the dek, the short answer and again in this sentence; the "Five of 38" dek leads with a small number. Fix: keep the caveat once, in the dek's follow-on sentence, and open the dek with the age rule ("Some managers require 18 months").
4. Where: citation numbering and quote list. What: out-of-order numbers (2,4,1,...), source 3 never marked, three of five quotes unmarked. Fix: renumber by first appearance; either mark all five quotes or none.
5. Where: "Age and vaccination" section. What: a section whose conclusion is "no schedule, ask your vet" for a topic the page does not cover. Fix: two sentences plus the vet line, drop the second CDC Yellow Book bullet.
6. Where: pad paragraph ("the card links to the smallest pack, so choose the size"). What: the card button opens the 18 x 24 pack, friction for a buyer. Fix: shorten and put the size tip in the card, or link the size-chooser listing.

## What works well
- The quoted-managers block is the page's best feature and is now the first thing after the dek.
- Buy order ("If not, start with the pads") and per-product skip lines are honest and specific.
- Disclosure is calm: one notice, one per-button label, no price talk.

## Mobile notes (390 px)
- No horizontal overflow; table fits without scroll.
- Sticky header hides back-link target (issue 1).
- About 16,100 px of scroll, 15 H2s; still long for the question but the answer sits in the first screen.

## Specific edits
1. STRUCTURE: add scroll-margin-top to citation anchors.
2. TEXT: delete or cut the "could not confirm" table to two rows.
3. TEXT: say the sample caveat once.
4. STRUCTURE: renumber citations by first appearance; mark all five quotes consistently.
5. TEXT: reduce the vaccination section to two sentences.
