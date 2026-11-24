# Review (round 6): Dog Ramp for Car or SUV: Ramp or Steps for a Big Dog? (dog-ramp-or-steps-for-the-car-and-cabin)
Verdict: FIX FIRST. The rewrite is a clear improvement (answer in the dek and first paragraph, 4,837 to about 2,800 rendered words, citation system works), but the same five picks appear four times, the lead 6-column table is heavy on a phone, and the citation back-link has two defects.
Overall: 8.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5
(Sum 34 / 4 = 8.5. No criterion below 4; the only gate failure is overall under 9.0.)
Editorial score (1 to 10): 7.8 (reader appeal 8, formatting 7, readability 7, utility 9, commercial integration 8). Target 8 not met.

Method: Playwright Chromium at 390 and 1280 against localhost:4176. Source read from content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md; compared with the pre-tightening version (git 196182f, 4,837 source words). Rendered word count 2,776 (390) / 2,908 (1280).

## Checks
1. Rubric: see scores above.
2. Editorial: 7.8, see above.
3. 20-second answer: yes. Dek ("Most cars and SUVs suit a telescoping ramp, and steps only suit a fixed door sill or hitch") plus paragraph one ("a ramp is usually the fix... rated above your dog's weight, side rails, non-slip, gentle slope... ask your vet") plus the "At a glance: our picks" box answers it. Not repetitive between dek and paragraph. The dek is two sentences (27 words); style guide asks for one. On a 390 px screen the hero image and affiliate notice fill the first screen, so the box is one scroll down.
4. Facts lost in the cuts (compared with 196182f):
   - MATERIAL: the sentence "Every ramp here is PetSafe because that is the maker whose pages we researched... other makers exist" is gone. All five products and all five buttons are one maker and the rendered page never says why or that other makers exist. A buyer reads this as a complete market comparison. Restore one sentence near the top table.
   - MATERIAL (small): the "who tested the ratings" row and the "ask your vet whether a ramp or steps suit your dog's spine, hips or pain" row were dropped from "What we could not confirm" (the testing point survives in prose; the vet point survives in the intro).
   - Minor: the 3-step porch worked example (21 in rise needs about 61 in at 20 degrees); PetMD's "medium and large dogs may prefer ramps"; CARE's "have not found car ramps that work particularly well for all dogs"; AKC "stairs too narrow" and "barrier on one side" points (side rails remain); "prices left out because they change" (no price claims remain, fine); the "How sure we are" block (acceptable, it was generic).
   - Nothing else of substance found. All five maker specs, all arithmetic, both decision tables, the measure checklist, host message and cabin-stairs advice survive.
5. Citation system: 19 markers, 11 distinct sources, all targets exist. Marker click opens the collapsed Sources details and lands the entry at about 446 px from the top (scroll-margin 112 px). Hash load (#src-2) opens the details. Keyboard: Tab reaches a marker and Enter jumps and opens. Max stacked markers 2. Markers in tables: 0. Defects: (a) the back-link always returns to the FIRST use (#cite-N-1) even when you came from a later one (tested marker 7, second use: marker at y 7,548 but back-link lands at y 2,513; marker 5 second use lands about 5,000 px short on mobile); (b) the cite anchors have scroll-margin-top 0 under a 65 px sticky header, so after "back to text" the marker line sits at viewport top 0, hidden under the header.
6. Affiliate: 5 "See it at Amazon" buttons, 5 "Affiliate link · We may earn a commission if you buy." labels, one top notice, Amazon Associate sentence in the notice, 0 "Check the current price" lines. Prose and table product-name links also go to Amazon (11 Amazon links total) and are not labelled, which is within the per-button rule.
7. Tables at 390: four tables, no page overflow (scrollWidth 390). First column sticky on all, "Swipe sideways to see all columns" hint present, nothing clipped. The lead table has 6 columns (547 px wide) and rows are 130 to 160 px tall, so one product takes about a third of a screen. The other three are 3 columns and fit.
8. Head: title "Dog Ramp for Car or SUV: Ramp vs Steps, Compared" (48), meta 140 characters. 24 internal links all 200. All Amazon links rel "sponsored nofollow noopener", target _blank.

## Issues
1. Where: "Dog ramp specs side by side" and the opening. What: the buy-by-height answer is stated four times in full (At a glance box, specs table, "quick decision shortcut" table, each "Which dog ramp" paragraph, then "What to buy first"), so the middle third re-reads the opening. Fix: delete the "Height or incline stated" repetition by merging the decision-shortcut table into the At-a-glance box (it already has height cues), and cut "What to buy first" item 1 to one sentence pointing up.
2. Where: lead specs table (6 columns). What: breaks the style guide's three-column phone rule; rows are tall. Fix: keep Product, Rating, Size; move Weight and "Other maker details" into the per-product paragraphs (most already repeat them).
3. Where: citation back-link ("back to text"). What: always returns to the first mention, and lands under the sticky header. Fix: render one back-link per use (or return to the specific marker) and give `[id^="cite-"]` the same scroll-margin-top as the source entries.
4. Where: after the specs table. What: single-maker disclosure lost. Fix: add "All five are PetSafe, the only maker whose pages we read; other brands exist and the same arithmetic applies."
5. Where: header meta "6 min read". What: about 2,800 words is 11 to 12 minutes at ordinary speed. Fix: set readingMinutes to 10 or 11.
6. Where: dek. What: two sentences, 27 words. Fix: "Most cars and SUVs suit a telescoping ramp; steps only suit a fixed door sill or hitch, so measure ground to floor first."
7. Where: "maker" is used about 30 times ("maker's 300 lb rating", "per the maker"). What: wearying. Fix: say it once under the table heading and drop it in each pick paragraph.

## What works well
- The slope arithmetic table and the "your measured height / look first at" table are real, original utility.
- Each pick paragraph is "for X, the Y", with a plain "Skip it if" line and a card; labels under every button.
- Cabin stairs section stays short, with a host message.

Mobile notes: no overflow; sticky first column works; hero plus notice push the At-a-glance box below the first screen.
