# Review (round 4): Crash-Tested Dog Harness or Crate: How to Check One Before You Buy (dog-car-safety-harness-and-crate-guide)
Verdict: FIX FIRST. All four text-level r3 defects are fixed on the rendered page; what holds it under 9.0 is a buyer gap (no clickable Large crate; no restraint pick for the 15 to 45 lb dog), a 2014 single-size harness listing, and the same pick decision restated in four places.
Overall: 8.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5
(Sum 34 / 4 = 8.5. No criterion below 4; the only gate failure is overall under 9.0.)

Method: r3 review, FIX file (Round 4), rubric and SEO brief; page rendered with Playwright Chromium at 1280 and 390 px; head, links, tables and text read from the DOM. Head: title "Crash-Tested Dog Harness or Crate: How to Check One" (51 chars, no suffix); description 150 chars, contains "dog harness or crate" and a verb ("Look up"); canonical correct; H1 contains the primary keyword. Mobile scrollWidth 390 (no page overflow); both tables scroll inside their wrapper (544 px content in a 350 px wrapper). 22 Amazon links, all with sponsored nofollow noopener, no prices, ratings or stock claims; no invented testing. Pin CSV row 25 matches title and description.

## Round-3 issues: fixed or not
1. Atom card grammar: FIXED. Renders "A soft, fold-flat carrier for very small dogs that the maker says can be used as a car seat, with a safety tether inside."
2. 30 sponsored links, 14 to one harness: MOSTLY FIXED. Now 22 (Clickit 6, Lucky Kennel 8, Atom 4, Heather 4). Better, but the Lucky Kennel still has 8 links (4 are the cards and gear blocks).
3. Timberline Fuse sponsored link: FIXED. Plain text "see cold-weather dog gear; the vest in that guide is a walking harness, not a car restraint."
4. "four picks" in description and dek: FIXED. Description ends "and see our picks"; dek says "which products to start with"; Quick picks says "three restraint picks plus a booster seat, which is not a tested restraint."
5. Large crate button: NOT FIXED (owner decision, still open). The text is honest: "We have not verified a link for the Large, so we do not offer one."

## Top issues (most important first)
1. **Buying advice and placement: the crate pick has no button for the dog it is recommended for.**
   Where: "Crate pick" and the Lucky Kennel card ("Button opens Intermediate").
   What: the 70 to 110 lb reader, the one the "One large dog, SUV with cargo area" bullet targets, must search by hand. The card is an under-70 lb product serving a large-dog recommendation.
   Fix: PRODUCT (owner): verify the Large listing (candidate B0DW9JGDJM) on its Amazon page and add it as a second button; until then, move "One large dog, SUV with cargo area" wording so it names the Intermediate only for "under 70 lb" and leaves the 70 to 110 lb line as a search instruction without the word "pick".
2. **Buying advice: no restraint for a 15 to 45 lb dog.**
   Where: "Small-dog picks" ("Under about 25 lbs you have two routes") and "Pick by situation".
   What: the Atom stops at 12 lb, the Heather is explicitly not a restraint, and the harness's tested dogs start at 45 lb in the Medium. A 20 or 35 lb dog, a very common size, gets no tested product and no sentence saying so.
   Fix: TEXT: add one sentence after "Under about 25 lbs...": "For a dog between 12 and about 45 lbs, this guide has no pick whose CPS listing shows a test dog at that weight; use the seven criteria and the CPS directory to find one, and do not stretch the Atom or Medium Sport to cover it." Check the CPS Sport listing for Small and Large test weights before naming ranges.
3. **Trust: the harness pick still rests on a 2014 test, a one-size link and no maker page.**
   Where: "Start here only if the listing you open names the Clickit Sport" and the Clickit card ("tested July 2014").
   What: the page says so plainly (a plus), but the lead recommendation is the least corroborated product. The FIX file flags that the maker page 404s and the current product is the Sport Plus.
   Fix: PRODUCT (owner): re-verify the Medium listing is the Clickit Sport; if the maker has moved to the Plus, either approve and link it or add a line that the tested Sport may be hard to find and the same CPS rules apply.
4. **Reader flow and layout: the same pick decision appears four times and the links still crowd the picks.**
   Where: Quick picks, "Pick by situation", "What to buy first", plus the cards.
   What: each repeats product, size and the Large caveat; on a phone about 4,000 words is long, and the Large/Intermediate caveat is restated about five times.
   Fix: STRUCTURE/TEXT: keep the Large caveat in the Crate pick and Quick picks only; make "Pick by situation" bullets one clause each without sizes already in Quick picks; make "What to buy first" refer to Quick picks rather than restate it.
5. **SEO: head term "dog car harness" is absent from title, H1 and description.**
   Where: title tag and meta description.
   What: Search Console shows "best dog car harness" and "dog car safety" impressions; the page ranks on "crash tested dog harness" only. The slug and body carry "dog car safety" but the head does not.
   Fix: SEO (optional, keep the 60-char limit): description "Dog car harness or crate: "crash tested" is not regulated. Check the CPS directory, match your dog's weight, skip extension tethers, see our picks." (about 145 chars). Leave the title.

## What works well
- The seven-criteria CPS check, with test dog weight and date beside each pick and an explicit statement of what we did and did not read, is original and sourced; a typical top-10 result lists products without teaching the check.
- Cards now match the text: Intermediate chip, "Button opens Intermediate", Atom's missing tie-down method flagged in the card, Heather labelled "No seat crash-test claim".
- Honest closing structure: Quick picks gives a decision in the first scroll, "What to buy first" is an ordered list, and sponsored links are marked and disclosed with no price or rating claims.

## Buyer walkthrough
1. Lands from "crash tested dog harness"; the short answer and Quick picks name three restraints and a booster.
2. Reads the seven criteria, harness-vs-crate and the CPS side-by-side table.
3. Clicks the harness card; must pick the size on a one-size Medium listing, from a 2014 test.
4. A large-dog owner opens the crate card and finds the Intermediate, then searches for the Large; a 20 to 40 lb owner finds no tested pick.
5. Ends at "What to buy first", the packing list and the checklist tool; no dead ends.

## Mobile notes (390 px)
- scrollWidth 390; no page-level sideways scroll; tables scroll inside their wrapper with a swipe hint.
- Cards stack cleanly with chips wrapping; no clipping.
- Long page; repeated pick recaps (issue 4) are the main phone cost.

## Specific edits to make
1. PRODUCT (owner): verify and add the Large crate button (issue 1).
2. TEXT: add the 12 to 45 lb gap sentence (issue 2).
3. PRODUCT (owner): re-verify the Clickit Sport Medium listing or add a caveat (issue 3).
4. TEXT/STRUCTURE: trim the repeated pick recaps (issue 4).
5. SEO: add "dog car harness" to the description (issue 5).

Edits 1, 2 and 4 would plausibly lift Buying advice, Product placement and Reader flow to 5 and reach 9.0 or above.

## Questions for the owner
- Can the Lucky Kennel Large ASIN and the current Clickit Sport listing be verified?
