# Review (round 2): Dog Car Seat Cover, Hammock or Cargo Cape: Protect Your Car on a Road Trip (protect-your-car-interior-from-a-dog-on-a-road-trip)
Verdict: FIX FIRST. Big improvement (table now reads on a phone, title and meta match the page, hedging trimmed), but one affiliate link in the prose points at the wrong product and a few small SEO and flow items keep it under the gate.
Overall: 8.3 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 5 | Product placement 3 | Layout 5 | Trust 4 | SEO fit 4 | Differentiation 4  (sum 33 / 4 = 8.3)

Method: read content/guides/protect-your-car-interior-from-a-dog-on-a-road-trip.md, the round-1 review, FIX and SEO notes; rendered http://localhost:4173/guides/protect-your-car-interior-from-a-dog-on-a-road-trip at 1280 and 390 with Playwright and read the screenshots. Head: title "Dog Car Seat Cover vs Hammock: Protect Your Car | Paws & Passage" (64 chars rendered; seoTitle itself 47), meta 136 chars. No horizontal page scroll at 390 (scrollWidth 390). All 12 Amazon links carry `rel="sponsored nofollow noopener"`, none unmarked. No prices, ratings or stock claims; no invented first-hand testing.

## Round-1 issues: status
1. Comparison table unreadable on phone: FIXED (four short columns, swipe hint shown, maker quotes moved under it). On 390 the fourth column "Suits" is behind the swipe, acceptable.
2. Title/meta promise cargo liner and backseat extender: FIXED (cargo cape; extender section says no pick).
3. "We read" over-hedging: MOSTLY FIXED (dek and opening clean); still repeated in the FAQ, the open-points table and "How sure we are".
4. Booster and crate dilute the argument: FIXED (own H2 for the booster; crate moved to the rental section where it answers a decision).
5. Gear labels and "who should skip it": FIXED (every pick ends "This is the one to buy first if..." with a skip line). Spec cards (icon, brand, name, three chips) are clear and accurate, and the "Not a restraint" chip on the bench cover is a nice honesty touch.
NOT FIXED / new: see issues 1 to 5 below. Pin row in docs/pinterest-pins.csv was updated and matches.

## Top 5 issues (most important first)
1. **Wrong product behind a prose affiliate link (Product placement 3).** Where: "points compact vehicles to the smaller Rover Hammock, listed at 55 by 56 inches". What is wrong: the auto-link alias "Rover Hammock" resolves to kurgo-rover-hammock-extended-width, so the link (amazon.com/dp/B07CRTPX8D) sends a reader looking for the smaller 55 x 56 in hammock to the 63 x 56 in extended one, the opposite of what the sentence says. There is no catalog record for the smaller hammock. Fix: reword the sentence so no alias fires, for example "points compact vehicles to Kurgo's standard-width hammock (listed at 55 by 56 inches on that page)", and do not name it "Rover Hammock". The same alias also links the later bare mention; check each instance of "Rover Hammock" outside the extended-width pick.
2. **Mobile first screen shows no answer (Answer clarity 4).** Where: the 390 px top (H1, dek, buttons, hero) and the 1280 view, where the hero fills the second screen. What is wrong: the "What to buy" sentence and the quick-pick bullets start below the hero, so on both widths the first screen carries the restraint warning only. Fix: add to the end of the dek "Bench cover for a car, extended hammock for a big dog in a truck, cargo cape behind the rear seat." (dek then about 40 words; trim "Here is how to match..." to keep it two lines on desktop).
3. **Rendered title tag is 64 characters and the research key is stale (SEO fit 4).** Where: head title "Dog Car Seat Cover vs Hammock: Protect Your Car | Paws & Passage" and `research.primaryKeyword: protect car interior from dog`. What is wrong: Google will cut the brand suffix at about 60 characters; the front matter still names the old primary keyword while the SEO file says "dog car seat cover". Fix: shorten seoTitle to "Dog Car Seat Cover vs Hammock for Road Trips" (43; rendered 60) and set primaryKeyword to "dog car seat cover" with "protect car interior from dog" under relatedKeywords.
4. **Formulaic repetition in the pick paragraphs and leftover hedging (Reader flow 4, Trust 4).** Where: "This is the one to buy first if..." closes all five product paragraphs, and "We found no source", "the pages we read", "No page we read" recur in the FAQ, table and "How sure we are". What is wrong: five identical closers read as a template and the "How sure we are" section restates the open-points table. Fix: keep the closer only on the bench cover, extended hammock and cargo cape; for the booster and crate end on the skip line instead. Delete the "Unknown: crash performance of any cover, and the table above." bullet and merge "How sure we are" into two bullets.
5. **One unsupported-looking cell in the open-points table (Trust 4).** Where: "The hammock page says its front-seat barrier keeps everyone safer". What is wrong: it is a maker claim quoted without a cited line elsewhere in the text, and sits in the row that argues nothing is crash tested. Fix: change to "No maker page we read names a test; the hammock page describes a front-seat barrier but gives no test or rating" or cite [[3]] there.

## What works well
- The "cover is not a restraint" line is stated in the dek, the first paragraph and the checklist, with the ASPCA wording cited, which is the right priority for a car-gear guide.
- The three-row size table plus quick-pick bullets give a decision in under a minute; the maker quotes below the table keep it sourced.
- The rental-car section built on Enterprise's own page and a crate pick tied to "if the agreement asks for a carrier" is a differentiator no listed competitor has.

## Buyer walkthrough
1. Lands on "dog car seat cover vs hammock", reads H1 and dek, scrolls past the hero to the quick-pick bullets.
2. Measures using the checklist, checks the size table and goes to the matching section.
3. Reads the paragraph (who it suits, who can skip it), clicks the green card button "See it at Amazon" (sponsored) or "Details and specs".
4. Friction: the prose "Rover Hammock" link for the smaller model goes to the extended one; five cards in a nine-minute page is on the high side.
5. Next: "What to buy first" links to the harness guide, car-interior gear page, packing list and cost guide; no dead ends.

## Mobile notes
- No sideways page scroll (scrollWidth 390); both tables sit in swipe containers with the "Swipe sideways to see all columns" hint.
- Spec cards stack cleanly: icon, brand, name and chips wrap to three lines; button and "Details and specs" stay on one row.
- The answer sits below the hero, so the first phone screen is title, dek and share buttons only (issue 2).

## Specific edits to make
1. TEXT: change the sentence "The extended hammock's page points compact vehicles to the smaller Rover Hammock, listed at 55 by 56 inches" to "The extended hammock's page points compact vehicles to Kurgo's standard-width hammock, listed at 55 by 56 inches" (avoid the alias "Rover Hammock"), and check no other bare "Rover Hammock" mention should link to the extended pick.
2. TEXT: append to the dek: "Bench cover for a car, extended hammock for a big dog in a truck, cargo cape behind the rear seat."
3. SEO: seoTitle "Dog Car Seat Cover vs Hammock for Road Trips"; research.primaryKeyword "dog car seat cover".
4. TEXT: remove "This is the one to buy first if..." from the booster and crate paragraphs; end them on their skip lines.
5. TEXT: in "How sure we are" delete the "Unknown" bullet; in the open-points table change the first row's middle cell to "No maker page we read names a test; the hammock page describes a front-seat barrier but gives no test or rating".

## Questions for the owner
None.
