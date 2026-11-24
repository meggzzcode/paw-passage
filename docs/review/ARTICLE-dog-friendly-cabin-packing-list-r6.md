# Review r6: Dog Cabin Packing List: What to Pack and Buy (dog-friendly-cabin-packing-list)
Verdict: FIX FIRST. The opening and citation system are now good, but the page is still a catch-all (first aid, ticks, winter chemicals) with three overlapping lists, and it lacks a distinct angle.
Overall: 7.5 / 10 (FAIL)
Editorial score (reader appeal 7, formatting 7, readability 7, utility 8, commercial integration 8): 7.4 / 10 (target 8: not met)
Scores (1 to 5): Answer clarity 4 | Reader flow 3 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 3 (sum 30)
Build checked: http://localhost:4176, 390 and 1280 in Playwright Chromium. Source is src/content/guides/dog-friendly-cabin-packing-list.ts, compared with b0f371a~12 (4,747 words, now 3,806 source, about 20% cut; rendered page about 2,300 words of prose plus Sources).

## Checks
1. 20-second answer: PASS. The dek names the four buys (food bin, towel, bed, night light) and the "short answer" box gives the four rules. The dek and first paragraph do not repeat each other.
2. Citations: PASS. 26 markers, none in the table, none stacked beyond 2 ("1 13", "14 15", "16 17", "4 6"). Click goes to #src-N, opens the Sources details and lands in view (about 484 px from top); the back-link (#cite-N-1) returns to the sentence; loading /#src-3 opens the details and scrolls to it; Tab reaches the first marker on the 10th press and Enter jumps and opens it. Defect: marker numbers are not in reading order (1 13, 2, 14 15, 16 17, 22, 20, 19, 21, 18, 3...), which looks like an error to a reader.
3. Affiliate: 4 pick cards, 4 "Affiliate link · We may earn a commission if you buy." labels, one top notice, Amazon Associate sentence present, no "Check the current price" text. All 11 Amazon links have rel "sponsored nofollow noopener". In-prose product-name links go to Amazon without a nearby label (covered by the top notice).
4. Tables: the single 3-column picks table fits at 390 (350 px, no clipped cells, no page overflow, sticky first column set). The "Swipe sideways to see all columns" hint appears over a table that does not scroll.
5. Head: title "Dog Cabin Packing List: What to Bring | Paws & Passage" 54 chars; meta 147 chars; canonical present. Internal links all return 200 (no redirects on this page).

## Issues (most important first)
1. Where: "Cold weather, wood stoves and seasonal chemicals", "Ticks", "First aid and poison numbers" (about a quarter of the page). What: the scorecard's main complaint (catch-all that duplicates other guides) is only half fixed. First aid is down to a pointer, but ticks and four winter-hazard paragraphs remain, with 9 of the 22 sources serving them. Fix: cut ticks to two sentences plus a link, and move heat-source/antifreeze/ice-melt to the Christmas-week and cold-weather guides with one "winter cabin" line here. That would remove 5 to 6 sources.
2. Where: "The short answer", "Our picks at a glance" table, "Buying checklist". What: three lists saying the same four buys (and "Everything else on this list is what you already own" is false: the page goes on to list leash, barriers, records, tick tool). Fix: delete the Buying checklist (the table is the checklist) and reword the line to "The rest is what most owners already have."
3. Where: Opening paragraph, "Muddy paws at the door, a dark deck at 11 pm and a vet an hour away". What: "a vet an hour away" is not sourced and not true of every cabin; it reads as invented scene. Fix: "...and a vet that may be far away".
4. Where: marker order. What: markers jump 1, 13, 2, 14, 15, 16, 17, 22, 20, 19, 21, 18, 3, 10, 11... Fix: renumber by first appearance (the Sources list too).
5. Where: header "11 min read". What: about 2,300 words of prose is 9 minutes at most, and the style guide wants the page "under 8 minutes". Fix: after cuts in issue 1 the count lands near 8; recompute.
6. Where: "Check the rules for each park and trail" and "Airbnb says that even when pets are allowed...". What: Georgia and California leash rules and Airbnb furniture wording are generic to any rental, not cabin packing; they pull the reader away from the pick decisions. Fix: one sentence plus link to the pre-booking checklist.
7. Where: "Swipe sideways" label above the picks table. What: nothing scrolls at 390. Fix: show the hint only when the table overflows.

## Material facts lost in the cut (vs b0f371a~12)
- BearWise's outdoor-feeding rule (single portions, remove food and bowls afterward) is gone; only "feed indoors when possible" survives. Material for a bear-country reader.
- The starting first-aid kit contents (gauze, nonstick dressing, scissors, gloves, towels) and "replace expired supplies; call before symptoms appear" are gone; the page now relies on the linked first-aid guide (acceptable, but the link is the only route).
- "Do not count on a regular bin or cooler as bear-proof" now only survives as "tidy storage, not bear-proof".
- Tick check method (well-lit spot, check yourself too), "before checkout remove hair and yard waste", "stain removers can damage some materials", the entry-mat-second and cooling-pad advice, Cornell boots-for-traction line, and the FAQ "Do I need a bear-proof container" were dropped. All are minor except the first two items above.

## What works well
- Dek and first paragraph now give the four buys and the host questions immediately; each pick states who should skip it.
- Citation jump, back-link, keyboard and hash-open all work; no markers in the table.
- Disclosure is clean: one top notice, one label per button, no price talk.

## Mobile notes (390 px)
- No horizontal page overflow (scrollWidth 390); page height 16,949 px, down from 23,630 px in the old scorecard.
- Picks table fits without scrolling; first column sticky.
- Hero image takes the first screen before the notice; the dek is visible above it.

## Questions for the owner
None needed.
