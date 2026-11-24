# Review (round 4): Christmas Week in a Cabin With Your Dog: Minimum Stays, Cancellation and Tree Safety (christmas-week-in-a-cabin-with-a-dog)
Verdict: SHIP (four of the five r3 edits are verified on the rendered page; what remains is a hero crop/alt mismatch and small polish)
Overall: 9.3 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 5 | Product placement 5 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(Sum 37 / 4 = 9.25. No criterion below 4.)

Basis: rubric, SEO brief, r3 and FIX notes; frozen build at localhost:4174 rendered at 1280 and 390 with Playwright Chromium; source read for the gear and buy-first sections. Head: title "Christmas Cabin With a Dog: Booking Rules and Safety" (53), meta description 149 chars, canonical correct. scrollWidth 1280 and 390 (no page-level sideways scroll); tables 672/672 on desktop, 544 in a 350 px wrapper on mobile (scrolls inside the wrapper). Page height 14,452 px desktop, 21,883 px mobile. Amazon links: 9 anchors (gate, Kurgo, KONG, Polar Trex, name link plus "See it at Amazon" button each; Polar Trex also named once more in prose), all `rel="sponsored nofollow noopener"`, tag pawspassage-20; no other Amazon links. Every internal href (about 45 unique) returned a non-error status; no 404s. No duplicate auto "Gear for this trip" block is present in the heading list.

## Round-3 issues: verified on the rendered page
1. Repeated 38-manager finding in the opener: PARTLY FIXED. The second opener sentence and the duplicate "Ask four things" bullet are gone. The finding still appears in bullet 1 of "The short answer" and again in question 2 of "What to ask before you book" (see issue 2); acceptable but not tight.
2. Cost claim in "What to buy first": FIXED. Item 3 now reads "because they carry the evenings in a room where the tree is off limits". No price claim anywhere.
3. No /gear category link: FIXED. The gear intro links /gear/pens-and-gates, and each card's "Details and specs" goes to the right /gear category anchor. (H1 is still 87 characters; left as is.)
4. Hero crop and alt: NOT FIXED. At 390 px the first screen still shows fur and bokeh lights only, and the alt still says "in front of a Christmas tree". See issue 1.
5. Gate paragraph pointer to hazards: FIXED ("listed further down, under Holiday hazards for dogs", anchor works).

## Top issues (most important first)
1. **Layout: hero alt text and crop still disagree.**
   - Where: hero image; alt "A golden retriever lying with its chin on a wooden floor, looking up softly, in front of a Christmas..."
   - What: no tree is visible in the crop, on mobile or desktop. A screen-reader user is told something the image does not show.
   - Fix: STRUCTURE (src/lib/images.ts, key guide-christmas-week): change the alt to "A golden retriever lying with its chin on a wooden floor, with warm string lights blurred behind", or shift the focal point so the eyes and lights show.
2. **Reader flow: the "none of 38 managers" finding is told twice in the first half.**
   - Where: bullet 1 "We found no stated holiday pet surcharge on the 38 manager pet pages..." and then question 2 "What is the complete pet total? In our reading of 38 managers' public pet pages, none stated..." (also repeated in "How sure we are").
   - Fix: TEXT: shorten bullet 1 to "No holiday pet surcharge turned up in our 38-manager sample, but ask for the total for your dates." and let question 2 carry the 19-page re-check detail only.
3. **Rendering polish: double space and a long H1.**
   - Where: gate paragraph, "...other spaces.  Ask the host before using the hardware mount." (two spaces; in source and rendered text). H1 "Christmas Week in a Cabin With Your Dog: Minimum Stays, Cancellation and Tree Safety" is 87 characters and wraps to four lines on a 390 px phone.
   - Fix: TEXT: remove the extra space. SEO: optionally shorten the H1 to "Christmas Week in a Cabin With Your Dog: Booking Rules and Tree Safety"; keep the pin title in sync if changed.
4. **Minor, SEO/differentiation: FAQ and hazard answers could add search phrases.** Questions people likely search and the page answers only inside body text: "are poinsettias poisonous to dogs" (answered in hazards) and "can I bring my dog to a cabin at Christmas". Not blocking.

## What works well
- Original, honest data: the three-row cancellation table with exact manager wording and "three managers, not a pattern", the 38-manager no-surcharge finding labelled a convenience sample, and a "What we could not confirm" table.
- Cards match the text: gate 26 in high for 26 to 42 in openings with a no-stair-top caution, Kurgo sizes, KONG weight bands, boots with "no insulation rating stated"; each product has a who-for and a skip-if; no prices, ratings, or stock claims. Disclosure sits directly above the answer and every Amazon link is marked sponsored.
- Conversion path: jump link to gear, gear-page link, cold-weather guide cross-link instead of a duplicate fleece pick, and a single ranked "What to buy first" ending in packing list and checklist tools, then Keep reading (NYE, pet fees, alone-in-rental).

## Buyer walkthrough
1. Lands on the answer and the sponsored-link disclosure, sees the four booking questions.
2. Reads the cancellation table or taps "Jump to the gear picks".
3. Gets gate, bed, KONG, boots, each with who-for and skip-if and a "Details and specs" link.
4. Reads hazards and the tree plan, then "What to buy first".
5. Leaves to the packing list, checklist, or sibling guides. No dead end. Friction: repeated finding in the opener, page length.

## Mobile notes (390 px)
- scrollWidth 390; no horizontal page scroll; tables scroll inside their wrapper with the swipe hint.
- H1 wraps to four lines; the hero's first view is fur and lights only (the alt mismatch in issue 1); the first answer paragraph is below the fold, as on every guide.
- Cards stack full width with button and specs link visible; no overlap.

## Specific edits to make
1. STRUCTURE: fix hero alt or crop (issue 1).
2. TEXT: shorten the first-bullet 38-manager sentence (issue 2).
3. TEXT: remove the double space in the gate paragraph; optionally shorten the H1 (issue 3).

## Questions for the owner
- None needed.
