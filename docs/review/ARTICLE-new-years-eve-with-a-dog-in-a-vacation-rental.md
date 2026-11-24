# Review: New Year's Eve With a Dog in a Cabin: Vet the Fireworks Claim, Plan the Night (new-years-eve-with-a-dog-in-a-vacation-rental)
Verdict: FIX FIRST. The vetting angle and the "how sure we are" honesty are genuinely different, but the title tag drops the main keyword, the gear is weakly tied to the plan, the Petcube pick omits the independent caveat used on the sibling article, and one table overflows on a phone.
Overall: 7.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 3 | Product placement 4 | Layout 3 | Trust 4 | SEO fit 3 | Differentiation 5  (sum 30 / 4 = 7.5)

Method: source `content/guides/new-years-eve-with-a-dog-in-a-vacation-rental.md`; rendered page at localhost:4173 read at 1280 and 390 wide (screenshots in the scratchpad `g6/` folder); head read from the page; pin row 16 of `docs/pinterest-pins.csv`; catalog records for kong-classic, kurgo-loft-wander-dog-bed, petcube-gps-tracker, ruffwear-the-beacon-dog-safety-light.

Head: title tag "Dog on New Year's Eve in a Rental: A Plan | Paws & Passage" (59 chars). Meta description 141 chars, accurate. The tag leaves out "fireworks" and "cabin", the words in `research.primaryKeyword` ("dog fireworks new year's eve cabin") and in the pin title.

## Top 5 issues (most important first)

1. **Title tag misses the search intent.**
   Where: `seoTitle: "Dog on New Year's Eve in a Rental: A Plan"`. The H1 and pin say "Vet the Fireworks Claim" and "Cabin"; the tag says neither, and "A Plan" says nothing. Searchers type "dog fireworks new year's eve" and "firework-free cabin".
   Fix: `seoTitle: "Dog in a Cabin on New Year's Eve: Fireworks Plan"` (about 65 chars with the suffix). See edit 1.

2. **Buying advice is thin and one pick lacks the independent caveat the catalog carries.**
   Where: "Gear that fits this plan". Four products, no shortcut for which matters, no "who should skip". The Petcube paragraph gives the maker's battery and plan requirement and "check plan cost and coverage", but omits what the catalog record and the sibling guide include: Tree Line Review called it "the most inaccurate location-wise" of its comparison group. A buyer reading only this page gets a rosier picture than the same site gives on the loose-dog guide. The Kurgo bed gives two sizes by inches but no way to choose between them.
   Fix: add the Tree Line sentence and a source entry (edit 4), a sizing sentence for the bed (edit 5), and a short "if you buy one thing" close (edit 6).

3. **Mobile table overflow.**
   Where: the manager table under "What hosts and local rules say" (Aunt Bug's / Cabin Rentals of Georgia / Vacasa). At 390 px the table measures 401 px in a 350 px column; the "Source" column is clipped at the right edge (screenshot shows "Sc" cut off) and the first two columns wrap to six or seven short lines per cell.
   Fix: drop the Source column and put the citation after the manager name (edit 3), giving three columns.

4. **A stray sentence breaks the intro to that table, and a forward reference confuses the gear section.**
   Where: "Wording differs by manager (sample, not a survey, as of 2026-11-18): Booking the week before? See Christmas week in a cabin with a dog." The Christmas pointer sits between the sentence and the table it introduces. Also in "Seeing the dog after dark": "...and the Homer, Alaska story shows how cold adds to the danger." The Homer story is first told two sections later under "If your dog runs".
   Fix: move the Christmas link to after the table (edit 2) and change the Homer clause (edit 7).

5. **Slight overclaim and non-US evidence left unmarked.**
   Where: the first paragraph "Everything here is checked for the 2026 season (as of 2026-11-18)." and the vetting section's key case, a Dutch park (Petbook). Policies and rules change and the source read date is the only thing checked; the Dutch case sets the "firework-free" lesson in a country with a different fireworks culture, and the page never says so while advising US cabin renters.
   Fix: replace with a source-date sentence (edit 8) and add "(a Dutch park, so the odds differ; the lesson is the question to ask, not the likelihood)" (edit 9; our note, flagged as such).

Other defects noted: "21 official sources" counts news and first-person items (Petbook, Mountain Times, KPCW, KBBI, Upworthy, Patch, Petco Love via PR Newswire) as "official" (template label); the four pick cards all carry the same generic eyebrow "Our pick" (consider a short descriptor); mobile meta row has a stray "·" on its own line.

## What works well
- "Questions to ask the host" plus the copy-and-paste message turns the central lesson (a firework-free label may stop at the property boundary) into an action the reader can do the same day.
- The noise-fear table grades what the sources say (food or play strongest; pheromones, supplements mostly not powerful enough) and gives no drug names or doses, with "ask your vet early" stated.
- "How sure we are" and its unknowns table each name who to ask, and the lost-dog stories are labelled as a small, non-random set.

## Buyer walkthrough
1. Lands from "dog fireworks new year's eve cabin"; gets the three "Do this first" steps and the vetting section; good.
2. Reads host rules table (flat pet fees, fireworks wording) and the bolting list.
3. Reaches "Gear that fits this plan": KONG (food delivery during noise), Kurgo bed (familiar spot), Petcube (second layer), Beacon (dark potty breaks); each paragraph names the problem first.
4. Clicks one card; the Petcube card says only maker facts, with no caution that an independent reviewer ranked it last for location accuracy.
5. Friction: no priority order between four products, no sizing help for the bed, and the "ID plan" (free) is a separate section from the gear, so a buyer may not realise a tag and chip record come before any purchase.

## Mobile notes (390 px)
- The first manager table overflows (401/350 px) and clips the Source column; the other two tables fit.
- The hero (dog on a blanket, holiday lights) loads at full width and pushes the first answer below the first screen; page is about 19,100 px tall.
- Checklist boxes and the copy-paste message block render cleanly.

## Specific edits to make
1. SEO: set `seoTitle` to `Dog in a Cabin on New Year's Eve: Fireworks Plan`.
2. TEXT: in "What hosts and local rules say", change "Wording differs by manager (sample, not a survey, as of 2026-11-18): Booking the week before? See [Christmas week in a cabin with a dog](/guides/christmas-week-in-a-cabin-with-a-dog)." to "Wording differs by manager (sample, not a survey, as of 2026-11-18):", and add after the table's closing note: "Booking the week before? See [Christmas week in a cabin with a dog](/guides/christmas-week-in-a-cabin-with-a-dog)."
3. STRUCTURE: rebuild the manager table with three columns "Manager | Dogs and fees | Fireworks and holiday wording", moving each citation to the end of the manager cell, e.g. `Aunt Bug's Cabin Rentals (Gatlinburg area) [[8]](https://www.auntbugs.com/rental-policies/)`, `Cabin Rentals of Georgia (Blue Ridge) [[9]](https://www.cabin-rentals-of-georgia.com/policies)`, `Vacasa (many places) [[10]](https://www.vacasa.com/pet-friendly-vacation-rentals)`.
4. PRODUCT: in the Petcube paragraph, after "...since the tracker uses cellular networks." add: "In a round-up of GPS collars, Tree Line Review called it 'the most inaccurate location-wise' of the group, a single reviewer's verdict; our [tracker guide](/guides/if-your-dog-gets-loose-on-a-trip) has the full buying checklist. [[22]](https://www.treelinereview.com/gearreviews/best-gps-dog-collars)" and add to `sources`: title "Best GPS Dog Collars", url https://www.treelinereview.com/gearreviews/best-gps-dog-collars, publisher "Tree Line Review", accessedOn 2026-11-19 (item 22, after the Ruffwear entry). Also change the Petcube pick why-text to end "...up to 30 days in power save mode; one independent reviewer rated its location accuracy lowest in its group."
5. PRODUCT: in the Kurgo bed paragraph, after the size figures, add: "The page lists two sizes by dimensions and gives no dog weight guidance, so measure your dog lying stretched out against 27 x 36 in or 36 x 48 in before you order."
6. STRUCTURE: at the end of "Gear that fits this plan", add: "**If you buy one thing:** nothing on this page replaces a tag with a number you will answer and a current chip record, and both cost no more than a phone call and a check of the tag ring. After that, the chew is for a dog that takes food during noise, the bed is for a familiar spot in the quiet room, the tracker is for a dog that has bolted before and an owner who accepts a paid plan, and the light is for dark potty breaks." (No new claims; restates the page's own logic.)
7. TEXT: in "Seeing the dog after dark", replace "and the Homer, Alaska story shows how cold adds to the danger" with "and in the Homer, Alaska case under 'If your dog runs', cold added to the danger".
8. TEXT: replace "Everything here is checked for the 2026 season (as of 2026-11-18)." with "We read the sources and manager pages below on 2026-11-18; fees and rules change, so confirm with your host."
9. TEXT: in "Is a 'firework-free' rental really firework-free?", after "a Dutch park advertised as firework-free" add "(a different fireworks culture from most US cabins, so the lesson is the question to ask, not the odds)" and label it "our note".
10. PRODUCT: change the four pick eyebrows from "Our pick" to short descriptors: "A chew for the first bangs" (KONG), "A familiar spot, packed flat" (Kurgo bed), "A second layer for a dog that bolts" (Petcube), "Seeing the dog after dark" (Beacon).
11. SEO: add FAQ "Can I leave my dog in a cabin while I go out on New Year's Eve?" a: "Check the manager's rule first: Cabin Rentals of Georgia says no dogs alone in the cabin, Vacasa says not unsupervised, and Aunt Bug's asks for a crate. We found no source that says a fearful dog is safe alone at midnight." (sources 8, 9, 10 already cited.)

## Questions for the owner
1. Should the Petcube pick stay on this page at all? It is the one product here whose independent verdict is negative; the loose-dog guide covers it with the checklist. A decision to keep or cut it is needed before the fix is final.
2. Is a non-US (Dutch) case acceptable as the central vetting example, or do you want a US-only example sourced first?
