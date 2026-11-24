# Review (round 6): Dog Travel Bowls and Food Storage: What to Pack First (dog-travel-bowls-and-food-storage)
Verdict: FIX FIRST. Much tighter (4,422 to about 2,450 words) and the picks are crisp, but the opening says the same thing three times, two tables duplicate each other, and the low-stakes topic still runs ten H2s.
Overall: 8.0 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 4
(Sum 32 / 4 = 8.0. No criterion below 4; gate failure is overall under 9.0.)
Editorial score (1 to 10): 7.6 (reader appeal 7, formatting 7, readability 8, utility 8, commercial integration 8). Target 8 not met.

Method: Playwright Chromium at 390 and 1280 on localhost:4176. Source content/guides/dog-travel-bowls-and-food-storage.md; compared with fca8398 (4,422 words). Rendered words 2,434 (390) / 2,589 (1280).

## Checks
1. Rubric: scores above.
2. Editorial: 7.6.
3. 20-second answer: yes, but repetitive. Dek: "Pack one collapsible bowl, one food container sized to your trip, and water from home; in bear country, food storage is the host's rule". Paragraph one: "Start with a flat-packing bowl, a food container that fits your dog's bag or a few days of kibble, and water from home." That is the dek again. The Short answer box then repeats water from home and the bear point a third time. "Water from home" appears 4 times in rendered text; bear/not-a-bear-rating about 5 times (checklist item 4, Short answer, cabin section, "could not confirm" and picks).
4. Facts lost in the cuts (vs fca8398):
   - Material: none that changes a purchase. The Materials column (BPA free, food-grade silicone, "Made in USA", Ruffwear's 4,000 mm lining rating, Springland carabiner) was merged into one short column, so a buyer who cares about materials gets less; the shell-vs-lining waterproof nuance is kept in the Ruffwear paragraph.
   - Minor: ASPCA travel-kit list; CDC "feed 3 to 4 hours before leaving" and "puppies and kittens more likely to get sick"; FDA page "last updated 05/23/2024"; the "airtight seal that keeps out pests and insects" claim; Ruffwear "packs down small"; "photograph the bag" suggestion; the "Short on time?" pointer; the "Ruffwear shell waterproofing" and "Gunner material nylon vs silicone" rows in the could-not-confirm table (Gunner caption mismatch is kept inside the Gunner paragraph).
   - Nothing safety-relevant lost: FDA four-part advice, 80 F figure, NPS and West Virginia bear quotes, Giardia, host message all survive.
5. Citation system: 19 markers, 15 distinct sources, all targets exist, 0 markers in tables, max stacked 2. Click opens Sources and lands at about 446 px; hash load opens it; Tab then Enter works. Defects as on the ramp guide: back-link returns to the first use (marker 2, third use: marker at y 10,908, back-link lands at y 1,398); and cite anchors have scroll-margin-top 0 so the marker sits at 0 under the 65 px sticky header.
6. Affiliate: 6 buttons, 6 "Affiliate link" labels, one top notice with the Amazon Associate sentence, 0 "Check the current price". Three non-card products (Splash Free Wander, two Springland bottles) link to Amazon inline only, which is fine.
7. Tables at 390: two 3-column tables (350 px), sticky first column, no clipping, no overflow (scrollWidth 390).
8. Head: title (47), meta 154 (inside 120 to 155 but one character from the limit). 24 internal links 200. 26-ish Amazon links all rel "sponsored nofollow noopener".

## Issues
1. Where: dek, first paragraph and "Short answer" box. What: the same message three times (dek / "Start with a flat-packing bowl... and water from home" / bullet 1). Fix: change paragraph one to the stakes and method only, e.g. "A bowl is a one-line decision; the food container and the rental kitchen are where trips go wrong. Sizes and care below come from each maker's own page, read 2026-11-18."
2. Where: "Our picks at a glance" table versus "What the maker pages say" table. What: nine-row second table repeats capacity from the first table and the pick text, then six pick cards repeat it a third time. Fix: delete "Our picks at a glance" or fold the Splash Free Wander and Springland rows into one-line bullets and keep the maker table as the single table.
3. Where: Buying checklist item 4 plus "Cabins and bear country" plus "What we could not confirm". What: "no maker claims bear resistance" is stated three times. Fix: keep it only in the cabin section.
4. Where: "What we could not confirm". What: a four-line paragraph restating caveats already beside each product (Gunner capacity, Springland volume). Fix: delete the section or reduce to a one-line pointer.
5. Where: page length for the topic (10 H2s, about 2,450 words). What: a bowl is a low-stakes decision; the reader must scroll about 15,000 px at 390. Fix: move the rental-kitchen section under the storage section as 3 bullets and drop "Next steps" repetition of the packing list.
6. Where: citation back-links, as in ramp review. Fix: per-use back-link and scroll-margin on `[id^="cite-"]`.
7. Where: meta description (154). What: no room for edits. Fix: trim to about 145.

## What works well
- Pick paragraphs: one-line "for X, the Y", plain skip-it, card, labelled button.
- The FDA four-part list and the NPS/West Virginia bear section are the real value and are well placed.
- Honest "the page gives no capacity" on Gunner and Springland without hedging pile-ups.

Mobile notes: tables fit with sticky first column; no overflow; hero plus notice fill the first screen so the Short answer is one scroll down.
