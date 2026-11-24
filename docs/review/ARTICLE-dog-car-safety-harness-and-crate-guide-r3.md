# Review (round 3): Crash-Tested Dog Harness or Crate: How to Check One Before You Buy (dog-car-safety-harness-and-crate-guide)
Verdict: FIX FIRST. The crate card is now honest (Intermediate chip, Large described as a separate listing), the opening answers first and the harness pick is conditional, but one round-2 grammar defect is still on the page and the page carries 30 sponsored links, 14 of them to one harness.
Overall: 8.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5
(Sum 34 / 4 = 8.5. No criterion is below 4, so the only gate failure is overall under 9.0.)

Method: source src/content/guides/dog-car-safety-harness-and-crate-guide.ts, r2 review, FIX (with Round 3), SEO file; rendered page at 1280 and 390 px (screenshots in the scratchpad r3x folder), head and link inventory read from the DOM. Head: rendered title "Crash-Tested Dog Harness or Crate: How to Check One" (51 chars; the suffix is correctly dropped). Meta description 154 chars, contains "dog harness or crate" and a verb ("Look up"); primary keyword "crash tested dog harness" appears in the title and H1. Mobile scrollWidth 390; tables scroll in their wrapper with the swipe hint. All 30 Amazon links carry "sponsored nofollow noopener"; no prices, ratings or stock claims; no invented first-hand testing; "buy first" wording appears once (the heading).

## Round-2 issues: fixed or not
1. Crate button vs pick: FIXED for honesty. The card chip reads "Intermediate: under 70 lbs", the title reads "Intermediate size, for dogs under 70 lb", and the text says the Large is a separate listing with no invented link. Residual (owner): a 70 to 110 lb reader still has no button. Not a text defect.
2. Harness pick rests on a 2014 listing: PARTLY FIXED. "Start here only if the listing you open names the Clickit Sport" is in, and source 9 is relabelled. The pick remains a listing we could not corroborate on a maker page; the page says so plainly.
3. First paragraph scene: FIXED. It now opens with the answer.
4. Atom card grammar defect: NOT FIXED. The rendered Atom card still reads "A soft, fold-flat carrier that for very small dogs that the maker says can be used as a car seat..." (content/products.yml, sleepypod-atom summary). Repeated product links: NOT FIXED (see issue 2).
5. Title length: FIXED. 51 chars, no suffix.

## Top issues (most important first)
1. **Product placement: broken sentence on a live spec card.**
   Where: Atom card blurb under "Small-dog picks": "A soft, fold-flat carrier that for very small dogs that the maker says can be used as a car seat, with a safety tether inside."
   What: ungrammatical copy in the one place a skimming buyer reads. It was flagged in round 2 and the fix note said it is a catalog item that was not changed.
   Fix: PRODUCT (content/products.yml, sleepypod-atom summary): "A soft, fold-flat carrier for very small dogs that the maker says can be used as a car seat, with a safety tether inside."
2. **Layout and trust: 30 sponsored links on one safety article, 14 to the Clickit Sport.**
   Where: nearly every paragraph from "Quick picks" through "What to buy first" links the product name (Clickit Sport, Lucky Kennel, Atom, Heather), plus 4 cards.
   What: on a phone this reads as a link wall next to a safety message, and it undercuts the researched-not-sold tone.
   Fix: TEXT/STRUCTURE: keep a sponsored link on the first product mention in each H2 section and on the card; make later mentions in the same section plain text (the auto-link rule can be bypassed by writing the product's short name without its catalog alias, for example "the Sport" or "the harness").
3. **Trust: an affiliate link to a non-restraint product in a restraint article.**
   Where: "Safety caveats", "the Timberline Fuse vest there is a walking harness, not a car restraint" (sponsored link to B0H133R562).
   What: the sentence warns against using it, yet the name is a sponsored link; a reader can read that as nudging a purchase of the wrong thing.
   Fix: TEXT: write it as plain text: "see cold-weather dog gear; the vest in that guide is a walking harness, not a car restraint."
4. **SEO/accuracy: the description promises "four picks".**
   Where: meta description ends "and see four picks." and the dek says "which four to start with".
   What: one of the four (Kurgo Heather) is stated in the body to be a seat, not a restraint, and the crate pick has no purchasable large size, so "four picks" over-sells a decision set.
   Fix: SEO: "“Crash tested” is not regulated. Look up a dog harness or crate in the CPS directory, match your dog's weight, skip extension tethers, and see our picks." (about 150 chars). Dek: "...and which products to start with."
5. **Buying advice: the only crate a big-dog owner can click is the wrong size for them.**
   Where: "Crate pick" and the Lucky Kennel card.
   What: honest, but the reader the crate is recommended for (70 to 110 lb) must search by hand; an owner decision, not a text one.
   Fix: PRODUCT (owner): verify the Large listing (candidate B0DW9JGDJM) on its Amazon page and add it as a second button, or keep the current wording. No text change needed meanwhile.

## What works well
- The seven-point check against the CPS directory, with test dog weight and date beside every pick, is original and sourced; no top-10 result teaches the reader to verify a claim.
- Honest uncertainty: "we could not read a maker page", "we did not read the Intermediate's own CPS listing", over-90 lb line with no pick; the cards carry the same caveats as the text.
- Quick picks under the answer paragraph give a decision on the first scroll; the hero (a beagle mix in a pink harness, looking out of a car window) fits a restraint article; cards show our own shield icon, brand, name and three factual chips.

## Buyer walkthrough
1. Lands from "crash tested dog harness"; the answer paragraph and Quick picks name four products with sizes.
2. Reads the seven criteria and the harness-vs-crate table, then the CPS test table.
3. At a pick card, clicks "See it at Amazon" and must choose the size on a one-size Medium listing (harness) or search for the Large (crate).
4. Small-dog owner reaches the Atom card and sees the broken blurb.
5. Ends with "What to buy first" and the packing list and checklist links; no dead ends.

## Mobile notes (390 px)
- scrollWidth 390; no page-level sideways scroll. Both tables show the swipe hint.
- Cards stack cleanly: icon, brand, name, three chips, text, button, "Details and specs". Chips wrap, nothing clipped.
- Very long (about 4,100 words); the number of inline links per screen is the main phone-reading cost.

## Specific edits to make
1. PRODUCT: fix the Atom summary sentence (issue 1).
2. TEXT: reduce repeated sponsored mentions to one per H2 section (issue 2).
3. TEXT: make the Timberline Fuse mention plain text (issue 3).
4. SEO: reword the description and dek so they do not promise "four picks" (issue 4).
5. PRODUCT (owner): verify and add the Large crate button (issue 5).

Applying edits 1 to 4 would plausibly lift Product placement, Layout and SEO to 5 and reach 9.0 or above.

## Questions for the owner
- Can the Lucky Kennel Large ASIN be verified so the large-dog reader gets a button?
