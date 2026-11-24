# Review (round 2): Dog Got Loose on Vacation: The First Hour, ID and Prevention (if-your-dog-gets-loose-on-a-trip)
Verdict: FIX FIRST. The round-1 defects (mislabelled Beacon card, triple product repeat, doubled brand names, buy list after the evidence) are fixed and the comparison table is a real asset, but the urgent answer is still below the fold, the most important purchase (the tag) has no product help, spec-card icons are wrong, and the SEO phrase is awkward.
Overall: 8.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5  (sum 34 / 4 = 8.5)

Method: source `content/guides/if-your-dog-gets-loose-on-a-trip.md`; round-1 review, FIX and SEO notes read; rendered page at localhost:4173 at 1280 and 390 wide (screenshots in the scratchpad `r2/` folder: `if-your-dog--d-top.png`, `if-your-dog--m-top.png`, `loose-d-card0..3.png`, `loose-m-card0..3.png`, `loose-d-hero.png`, `loose-m-table0..2.png`); head read from the page; pin row 14 of `docs/pinterest-pins.csv` checked.

Head: `<title>` "Dog Got Loose on Vacation: First Hour Plan | Paws & Passage" (59 chars, fine). Meta description 135 chars, contains "dog got loose on vacation" once and a verb ("Follow"). H1 begins with the primary keyword. First paragraph answers the primary question in its second sentence. Canonical correct. Pin row 14 matches the page. No FAQPage markup concerns (none added).

## Round-1 issues: verified
1. Beacon card borrowed "Best waterproof" and a source not in the list: FIXED. Label "Clip-on light for night walks", why-text and source now the Ruffwear maker page.
2. Four products rendered three times: FIXED. The `gear:` repeat is gone; four inline cards only (plus the "Gear for this trip" link block); page is now about 4,450 words.
3. Doubled brand names: FIXED in the rendered cards ("Tractive DOG 6", "Fi Series 3+", "Petcube GPS Tracker").
4. No tag guidance: PARTLY FIXED. A labelled "Our suggestion" paragraph exists (legible at arm's length, engraved not sticker, check the ring), but there is still no way to buy a tag from the page (no catalog product; see issue 2).
5. Answer below the fold: PARTLY FIXED. "What to buy first" now sits before "How sure we are" and the opening names the three-step shortcut, but on both viewports the first screen is still breadcrumb, H1, dek, byline and the hero; "If your dog just bolted, start here" begins below it (see issue 1).

## Top issues (most important first)

1. **A reader whose dog is loose now sees no action on the first screen.**
   Where: dek "The first hour after your dog bolts in an unfamiliar place, the ID layers that get a finder to your phone, and how to stop it happening in a rental." The H1 promises "The First Hour", but the dek describes the article; the steps start roughly 1,100 px down on desktop and further down on mobile (screenshots `if-your-dog--d-top.png`, `if-your-dog--m-top.png`).
   Fix: edit 1 (dek carries the three actions). The hero height is a template matter.

2. **The tag is "the first buy" but the buyer is given no product, link or catalog pick.**
   Where: "What to buy first", item 1 "A tag with a number you will answer", and the "Our suggestion, not from a source" paragraph under "The tag". Items 3 and 4 have buy buttons; item 1 and 2 have none, and the page's own claim is that the tag is the one layer a finder can use without a scanner. A buyer clicks away to search for a tag and may not return.
   Fix: edit 2 (add a catalog product for an ID tag, or, if none is available, link the safety/ID gear category from item 1, which the page does only at the very end).

3. **The spec cards show a first-aid-suitcase icon on three trackers and the light.**
   Where: the Tractive, Fi and Ruffwear Beacon cards render the same medical-kit icon (the Petcube card too); the icon is the page's first visual cue per pick and says "first aid" for a GPS collar (screenshots `loose-d-card0.png`, `loose-m-card1.png`).
   Fix: edit 3 (template or product data, not article text).

4. **SEO: the page leads with an ungrammatical search phrase and over-runs the FAQ count.**
   Where: the title and H1 use "Dog Got Loose on Vacation", chosen from the SEO file's evidence that the full phrase had no autocomplete and no PAA; "lost dog on vacation" or "dog ran away on vacation" are how people phrase it, and neither appears in a heading. The FAQ has 8 entries against the 4 to 6 guideline, and the "Fireworks and holidays" section repeats what the New Year's Eve guide covers.
   Fix: edits 4 and 5.

5. **Flow: the page is 4,450 words and the decision list is near the end.**
   Where: "What to buy first" comes after the checklist and the fireworks section, and the three tracker paragraphs each restate battery, plan and fit already in the comparison table. A reader who has read the table and then three paragraphs reads the same specs a third time (table, paragraph, card).
   Fix: edit 6.

## What works well
- The first hour is built from AKC Reunite and ASPCA steps with our own additions labelled "(our suggestion)", and the three recovery stories are each marked as one case with the Killington outcome stated as unknown.
- The tracker section is a real decision tool: a buying checklist (plan, coverage, size range, battery, water rating, warranty), a three-row comparison table (3 columns, readable at 390 px with the swipe hint), and per-tracker "skip it if" lines, with Petcube honestly labelled "buy this one for its size" and Tree Line's "most inaccurate location-wise" verdict given as one reviewer's view.
- Compliance is clean: no prices, ratings, stock or invented first-hand tests; all product names and "See it at Amazon" buttons are sponsored Amazon links to the right products (Tractive B0D6Z4L6BW, Fi B0HJ3XJFQ7, Petcube B0C89SV8VP, Beacon B073WPG2KR); hero (German wirehaired pointer on a leash with tag, alt text accurate) fits the topic.

## Buyer walkthrough
1. Lands from "dog got loose on vacation"; scrolls past the hero to "If your dog just bolted, start here" and the six steps.
2. Reads the ID table and the tracker checklist; the comparison table shows Tractive, Fi and Petcube side by side with maker figures.
3. Picks a situation sentence ("If your dog already wears a collar you like, start with the clip-on") and clicks the Tractive card.
4. Reaches "What to buy first": tag and chip call come first, then the tracker choice, then light and containment.
5. Friction: no tag product to click; the same specs appear three times (table, paragraph, card); icons look like a first-aid kit.

## Mobile notes (390 px)
- No sideways page scroll (document and viewport both 390). The three tables are 544 px inside a 350 px wrapper with the "Swipe" hint.
- First screen is breadcrumb, H1, long dek, byline and the hero start; no article text before scrolling; the meta row wraps with a lone "·".
- Cards stack well with three fact chips each; the Tractive card's "(one place on the page also says above 9 lbs)" line is a useful honest detail.

## Specific edits to make
1. TEXT (dek): replace the dek with: "If your dog bolts, search near where it was last seen, then call your chip registry and host. Then fix the tag, the chip record and a tracker so it does not happen again."
2. PRODUCT: add an ID tag to the catalog (owner decision) and a `{{pick:...}}` under "The tag"; if not, in "What to buy first" item 1 append: "No product link here on purpose: any engraved tag that passes the checks above will do; see [safety, ID and first aid gear](/gear/safety-id-first-aid) for options."
3. PRODUCT / template: assign pick-card icons per product (tracker, collar, light) instead of the category default.
4. SEO: change the first line of "If your dog just bolted, start here" to include the common phrasing: "If your dog ran away on vacation and you got here searching for a lost dog on a trip, ...", and cut the FAQ to six by removing "Does a microchip track my dog?" (the table already answers it) and "Is a microchip enough on its own when I travel?" (covered in the chip section), moving one clause of each into the table row.
5. TEXT: in "Fireworks and holidays" keep two sentences (the Cornell advice and the link to the New Year's Eve guide) and delete the Dutch survey, Petco and the Petbook sentences, which the NYE guide already carries with the same sources.
6. STRUCTURE: in each of the three tracker paragraphs delete the sentence that restates battery or plan figures already in the comparison table (for Tractive: "with up to 2 weeks of battery with Power Saving Zones and up to 6 days without"), keeping the situation sentence, the fit limit and the skip line.

## Questions for the owner
- Is there a tag or ID product you want in the catalog? Without one the first purchase on the buy list cannot have a button.
