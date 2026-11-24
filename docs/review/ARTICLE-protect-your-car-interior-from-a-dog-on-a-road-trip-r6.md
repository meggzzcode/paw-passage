# Review r6: Dog Car Seat Cover, Hammock or Cargo Cape: Protect Your Car on a Road Trip (protect-your-car-interior-from-a-dog-on-a-road-trip)
Verdict: FIX FIRST (decision-first now and well cut, but leftover research-file sections and duplicate pick lists keep it under the gate)
Overall: 8.0 / 10 (FAIL)
Editorial score (1-10): 7.2 (reader appeal 7, formatting 7, readability 7, utility 8, commercial integration 7)

Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 4 = 32/40. No criterion below 4, total under 36.

Evidence run: Playwright Chromium at 390 and 1280. About 2,465 rendered words (was ~3,430; -28%); markers about 20 (was 31).

## Checks
1. Rubric: see scores above.
2. Editorial 7.2, below the owner target of 8.
3. 20-second answer: yes. The dek puts "none restrains a dog" after the benefit now (fixes the old negative lead), and the first paragraph gives the cover-by-vehicle rule plus the size figures. Minor overlap: dek says "pick by where your dog rides", paragraph says "match the cover to the vehicle first", then "At a glance: our picks" restates all five picks, then the table restates three of them (bench, hammock, cape).
4. Facts lost (compare git show b0f371a~12): the old "Buying checklist" steps to check attachment points and how it cleans (partly kept in belts/anchors and cleaning bullets); Chewy's note that cargo liners suit large and crated dogs; measuring the footwell gap for a seat extender; Vetstreet "not as secure as a crate"; the "rental companies and cover straps" gap; the care-sheet and claw rows of the old unconfirmed table (care-sheet kept inline). All low impact. The "How sure we are" block was deleted (good). Heat, rental and belt sections are intact.
5. Citations: markers jump to #src-n, Sources details opens, back-link returns, Tab+Enter works, no adjacent stack over 2, 0 markers in the table. Defects below (tap size, header overlap, order). Publisher inline links are present for the five products and Play Pet Brands/PetSafe/Kurgo; Nationwide, NAPA, Chewy, Vetstreet, ASPCA, Enterprise are named but not linked.
6. Affiliate: one top notice, Amazon sentence present, 5 cards each with "Affiliate link" label, all Amazon links rel="sponsored nofollow noopener", no "check the current price" text. Pick-names in the At a glance list link to the maker page (not Amazon), which is fine but differs from the cards.
7. Tables: one 4-column table, 369 px in a 350 px scroller (about 19 px of scroll, fourth column "Suits" slightly clipped), first column sticky, swipe hint present, no page overflow (390 = 390).
8. Head: title "Dog Car Seat Cover vs Hammock for Road Trips" 44 chars; meta 136 chars; all 27 internal links 200.

## Issues
1. Where: "At a glance: our picks" and the table "Seat cover, hammock or cargo cape: pick by vehicle and dog". What: five picks listed, then a three-row table of the same picks, then each pick's paragraph and card, then "What to buy first" again; the decision is told four times. Fix: delete "At a glance" (the table is the picker the scorecard asked for) and move the table up directly under the first paragraph; cut "What to buy first" to the restraint, a cleanup kit, and "pick the cover per table".
2. Where: section "What we could not confirm". What: the scorecard said delete it; it repeats inline hedges (no weight limits, no compatibility chart, no crash test) already stated in the bench-cover paragraph, the table note and the seat-belt section. Fix: delete the section; keep one sentence in the intro or the sources box: "None of these pages lists a weight limit or a crash-test rating."
3. Where: "If your dog drops into the footwell, a seat extender (or bridge) spans the gap. We have no maker page to cite for one, so we give no pick". What: a paragraph about an item it cannot recommend, flagged for deletion in the scorecard. Fix: delete or reduce to one clause ("a footwell bridge spans the gap; check its weight rating") inside the hammock paragraph.
4. Where: "Claws, hair and wet dogs" bullets ("Nationwide suggests...", "NAPA says...", "Play Pet Brands says..."). What: three retailer/blog quotes for common sense, plus "No maker page gives a scratch-resistance rating" hedge; scorecard asked for fewer citations on common-sense lines. Fix: collapse to two bullets (claws and hair together, wet dogs) with one marker each; keep the "towel the dog off" advice.
5. Where: every superscript marker. What: 6 to 14 px wide tap target at 390 px. Fix: padded 24 px hit area.
6. Where: Sources "back to text" link. What: marker lands under the 65 px sticky header after return. Fix: `scroll-margin-top: 90px` on `[id^="cite-"]`.
7. Where: inline publisher names (ASPCA, Nationwide, NAPA, Chewy, Vetstreet, Enterprise). What: named but not linked while PetSafe, Kurgo and Play Pet Brands are; inconsistent and short of style guide section 7. Fix: link the named publisher on first mention, and drop the marker where it only repeats that link.
8. Where: table (Setup / Size / Goes / Suits). What: 369 px in a 350 px scroller leaves the last column slightly clipped at 390 px. Fix: drop the "Goes" column (it duplicates the "Suits" and section headings) so it is three columns and fits without scroll.
9. Where: Sources numbering. What: markers appear 2,3,1,4,8,11,... not in reading order. Fix: number by first appearance.
10. Where: Enterprise-only rental paragraph and "Rental terms. We read only Enterprise's U.S. page" (twice). What: the Enterprise limit is stated in the paragraph, the FAQ and the unconfirmed list. Fix: once, in the paragraph.

## What works well
- Dek and first paragraph now lead with the benefit and the pick-by-vehicle rule; the "not a crash restraint" limit follows rather than leads.
- Product cards carry a who-for line and a skip-it line in the paragraph before them; the Heather booster text is honest that it is a booster, not a restraint.
- Four-point belt/anchor check (buckle, tether, headrest, slip) is practical and marked as the site's suggestion.
