# Review (round 6): Dog First Aid Kit for Travel: What to Carry to a Cabin (dog-travel-first-aid-kit-guide)
Verdict: FIX FIRST. The stakes-scene opening and At-a-glance box are the best in this batch and the safety content is intact, but the page is still a wall of bullets with 30 markers (19 of them the same AVMA source) and no table or decision aid.
Overall: 8.3 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 4
(Sum 33 / 4 = 8.25, shown as 8.3. No criterion below 4; gate failure is overall under 9.0.)
Editorial score (1 to 10): 7.6 (reader appeal 8, formatting 7, readability 7, utility 9, commercial integration 7). Target 8 not met.

Method: Playwright Chromium at 390 and 1280 on localhost:4176. Source src/content/guides/dog-travel-first-aid-kit-guide.ts; compared with 067b9d7 (4,219 words incl. metadata). Rendered words 2,247 (390) / 2,409 (1280).

## Checks
1. Rubric: scores above.
2. Editorial: 7.6.
3. 20-second answer: yes. Paragraph one is the scene plus the AVMA stance; the At-a-glance box follows with kit, three sizes, numbers to save, and the medication rule. Dek and paragraph one do not repeat; the dek is repeated in the first At-a-glance bullet (AVMA checklist plus thermometer, contacts, records). The At-a-glance bullets are dense (the second is 60 words).
4. Facts lost in the cuts (vs 067b9d7):
   - The "Pick by situation" table is gone, taking with it the rows for "a dog that may bite" (basket muzzle, fitted in advance), "dog on regular medication" and "two or more dogs" as rows. The content survives in prose (muzzle add-on, medications paragraph, two-dog link), so nothing material is lost.
   - The closing "What to buy first" (free first: save numbers and copy records; then kit; then gaps) was cut; the "Before every trip" checklist covers it.
   - Minor: the "How we built this list" and "How sure we are" blocks; "Do not give human medication on your own initiative" (the leave-out list and At-a-glance still say it); "check the current price" removed as intended.
   - Safety content verified intact: both poison control numbers and fee note, no induced vomiting, charcoal and peroxide limits, heatstroke signs and cooling steps, no cold tub, bleeding, seizure, wound-object, transport points.
5. Citation system: 30 markers, 8 distinct sources, all targets exist, 0 in tables (no tables on the page), max stacked 2. Click, hash-load and Tab+Enter all open Sources and land the entry. Defects: back-link returns to the first use (source 4, fifth use: marker at y 11,052, back-link lands at y 2,458 on mobile) which matters most here because AVMA is cited 19 times; cite anchors have scroll-margin 0 so the marker lands under the sticky header. Style guide section 7 asks for inline publisher links with markers only where no publisher is named: here "the AVMA says... [1]" is repeated through the bullets and the AVMA is never an inline link. Four consecutive bullets in "Learn the basics" each end in the same [1].
6. Affiliate: 1 button ("See it at Amazon"), 1 label, one top notice with the Amazon sentence, 0 "Check the current price". Link rel "sponsored nofollow noopener", target _blank.
7. Tables: none on the page, so nothing to clip; no overflow (scrollWidth 390 at 390 and 1280). Checkbox lists render fine.
8. Head: title "Dog First Aid Kit for Travel: AVMA-Based Checklist" (50), meta 151 characters. 26 internal links all 200.

## Issues
1. Where: "Learn the basics before you need them" and the AVMA checklist. What: a marker after every bullet (four identical [1] in a row, 19 AVMA markers total). Fix: cite once per list ("The AVMA brochure says:" with an inline link to the PDF), then drop the per-bullet markers.
2. Where: citation back-links. What: first-use only, hidden under sticky header. Fix: per-use back-link; add scroll-margin-top to `[id^="cite-"]`.
3. Where: whole page (nine H2, about 100 list items, no table). What: scans as bullets only; the earlier situation table was the one comparison device and was removed. Fix: restore a 3-row table (cabin week / car / trail: kit size, what to prioritise) in place of the numbered three-layer list.
4. Where: At-a-glance bullet 2 ("Three sizes: the full kit at the cabin..."). What: 60 words with the product caveat buried. Fix: split into "Three sizes" (one line) and "Ready-made option" (one line).
5. Where: "What changes when you travel", "Add-ons" and "Leave out". What: "ask your vet" appears five times and medication caution three times (At a glance, Medications, Add-ons, Leave out, Ready-made kit). Fix: keep the full caution in "Medications and records" and the leave-out list only.
6. Where: closing. What: the page ends on a source-method sentence ("Product details come only from the maker's page... we lean cautious") instead of a next step. Fix: end with the trip checklist and cabin packing list links.
7. Where: "Ready-made kit or build your own" and the card. What: only one product in a 2,200-word page; honest, but a buyer wanting a cabin-size kit gets none. Fix: no product to add without research; say plainly in one line that a cabin kit is better built from the checklist (already implied) and keep as is.

## What works well
- Opening scene and the At-a-glance box answer both the emergency and the shopping question quickly.
- Clear "conditions attached" treatment for charcoal and peroxide and the "Leave out unless your vet says otherwise" list.
- The ready-made kit buying checklist ("count line items, not the piece count") is practical and unique.

Mobile notes: no overflow; pick card button and label fit; long list sections with many H2s make the page about 14,500 px tall at 390.
