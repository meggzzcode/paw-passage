# Review (round 2): Crash-Tested Dog Harness or Crate: How to Check One Before You Buy (dog-car-safety-harness-and-crate-guide)
Verdict: FIX FIRST - the text fixes from round 1 landed and the page is now honest and usable, but the crate button still opens a size the pick text tells the reader not to buy, and the harness pick still rests on a 2014 listing with no maker page read.
Overall: 8.0 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 3 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5
(Sum 32 / 4 = 8.0. Fails the gate on overall under 9.0; Product placement is 3, below the criterion floor of 4.)

Reviewed fresh from source (src/content/guides/dog-car-safety-harness-and-crate-guide.ts), rendered page at 1280 and 390 px (screenshots in the scratchpad), page head, link inventory. Head: title tag "Crash-Tested Dog Harness or Crate: How to Check One | Paws & Passage" (seoTitle part 50 chars; full rendered title 68 with the site suffix); meta description 154 chars, contains "dog harness or crate", ends with "see four picks". Mobile scrollWidth 390 (no sideways page scroll); both tables show "Swipe sideways to see all columns".

## Round-1 issues: fixed or not
1. Harness pick size/model caveat: FIXED in text (one size Medium, rib cage, check title says Clickit Sport; repeated in the card). NOT fixed underneath: still a 2014 listing, "we could not read a maker page", and the Amazon listing is one size. Honest, but a buyer is still asked to trust it.
2. Crate link is the Intermediate while the pick is the Large: NOT FIXED. Text now says it plainly ("The purchase link on the card below goes to the Intermediate... look for that size on the retailer page"), the card chip reads "Intermediate: under 70 lbs", and the card says "choose your dog's size". Disclosed, but the exact reader the crate is recommended for (70 to 110 lb) still has to repair our link.
3. Hero and table: hero is FIXED (a beagle in a car wearing a harness; on topic). CPS table FIXED (three columns, swipe hint). Pin image not re-checked here (file public/pins/dog-car-safety-harness-and-crate-guide.jpg was regenerated per git log).
4. Quick picks and Pick by situation: FIXED (Quick picks under the short answer; product names and links in every situation bullet; over-90 lb line present; hammock removed from the situation list).
5. SEO title/description: FIXED (covers harness and crate; keyword "crash tested dog harness" at the start).
Also fixed: cabin sentence, cold-weather link, FAQ additions (front seat, rental/cabin trip), "What to buy first" is an ordered list, no duplicate "Picks by criteria" block in the rendered page.

## Top issues (most important first)
1. **Product placement and buying: crate button and crate pick disagree.**
   - Where: "Crate pick: For a large dog in a cargo area." paragraph and the Lucky Duck Lucky Kennel card ("Intermediate: under 70 lbs", button to B0BMQY39R5).
   - What: the pick is justified by the Large (110 lb test dog) yet every Lucky Kennel link on the page (card, table prose, Quick picks, What to buy first) opens the Intermediate. A 70 to 110 lb dog owner clicks, lands on the wrong size, and the card chip even advertises "under 70 lbs".
   - Fix: PRODUCT (owner): verify the Large (candidate B0DW9JGDJM) on its Amazon page and make it the button, with the Intermediate and Medium as plain text. Until then, TEXT: change the card chip "Intermediate: under 70 lbs" to "Sizes: Medium, Intermediate, Large" so the chip does not contradict the large-dog pick, and change the pick sentence to "The button opens the Intermediate (under 70 lbs); if your dog is 70 lbs or more, search the retailer page for the Large."
2. **Trust: the one harness pick is an unverifiable 2014 listing.**
   - Where: "Harness pick: For a dog up to 90 lb riding on the rear seat."
   - What: the text correctly says no maker page was read and the maker's current product is a different one (the sources list cites the Clickit Sport Plus page for accessories, which a reader may take as the picked product). The pick is still headlined "Start here".
   - Fix: TEXT: in the harness pick paragraph replace "Start here if the rear seat is where your dog rides." with "Start here only if the listing you open names the Clickit Sport; if it shows another Sleepypod model, use the checklist above against that model's own CPS listing." And relabel source 9 in the Sources block (SEO/TEXT) as "Clickit Sport Plus (a different, current model; used only for the accessory warning)".
3. **Answer clarity: the first paragraph opens on a scenario, not the answer.**
   - Where: "Your dog is bouncing between the back seat and the center console, and you are doing 65 on the interstate."
   - What: it is an invented-scene opener that delays the answer by a sentence on a phone, where the H1 and dek already take most of the first screen. The answer ("only if it has a published independent test record at a test weight that matches your dog") is good but sits in sentence two.
   - Fix: TEXT: replace the first sentence with "A crash-tested dog harness or crate is the fix for a dog that moves around the car, but only if it has a published independent test record, at a test weight that matches your dog, installed the way the maker says." and delete the scene.
4. **Layout/rendering: a grammar defect in a card and repeated product CTAs.**
   - Where: Sleepypod Atom card blurb "A soft, fold-flat carrier that for very small dogs that the maker says can be used as a car seat..." and the Clickit Sport link (about 9 text links to the same Amazon ASIN, plus 4 cards).
   - What: broken sentence in the card copy; the harness is linked in nearly every paragraph, so a phone reader scrolls past many sponsored links, which can read as pushy next to a safety message.
   - Fix: PRODUCT: change the Atom card description to "A soft, fold-flat carrier for very small dogs that the maker says can be used as a car seat, with a safety tether inside." TEXT: keep the sponsored link on the first mention in each section and make later mentions in the same section plain text (Pick by situation, What to buy first and Quick picks may keep theirs).
5. **SEO fit: rendered title is 68 characters with the site suffix.**
   - Where: page head title.
   - What: the repo test counts seoTitle (50), but Google shows the full title, so "How to Check One | Paws & Passage" may be cut. The primary keyword is at the start, so the cost is small.
   - Fix: SEO: if the layout allows, drop the suffix on this page, or shorten the seoTitle to "Crash-Tested Dog Harness or Crate: How to Check" (47) so the full title is about 64.

## What works well
- The verification method (seven criteria, what "crash-tested" does not mean, CPS directory lookup, test dog weight beside each pick) is original and sourced; no top-10 result teaches the reader to check a claim themselves.
- Quick picks under the short answer now give a decision in the first screen and a half, with an honest over-90 lb line instead of a pick that does not fit.
- Cards are clean on mobile and desktop: our own icon, brand, name and three fact chips (CPS-tested, CPS lists passed July 2014, test dogs rated to 90 lbs) match the "why we picked it" text, and every chip is a source-backed fact, no price or rating. Button is "sponsored nofollow noopener", and "Check the current price on the listing before you buy" avoids a price claim.

## Buyer walkthrough
1. Lands from "crash tested dog harness"; disclosure sits above the short answer; the quick picks list names four products with sizes.
2. Reads the seven criteria and the harness-vs-crate table, then the CPS table with test dog weight and date.
3. At the harness pick reads the caveats, clicks "See it at Amazon" to a one-size (Medium) listing; has to choose the right size there.
4. A big-dog owner reaches the crate card, sees "Intermediate: under 70 lbs", reads that they need the Large and must find it.
5. Finishes with What to buy first and the cabin packing list and checklist links; no dead ends.

## Mobile notes (390 px)
- scrollWidth 390; page about 22,600 px tall. Both tables carry the "Swipe sideways to see all columns" hint; the CPS table is three columns and readable.
- Pick cards stack cleanly (icon, brand, name, three chips, text, button, "Details and specs"). Button and chips are tappable.
- The page is long for a phone; the products repeat as links but the duplicate "Picks by criteria" block is gone.

## Specific edits to make
1. PRODUCT: Owner verifies the Lucky Kennel Large listing and swaps the button to it; keep Medium and Intermediate as text (issue 1).
2. TEXT: Until then, change the Lucky Kennel card chip to "Sizes: Medium, Intermediate, Large" and the pick sentence as in issue 1.
3. TEXT: Replace "Start here if the rear seat is where your dog rides." with the conditional version in issue 2.
4. TEXT: Relabel source 9 (Clickit Sport Plus) so it is clear it is a different model.
5. TEXT: Replace the first sentence of "The short answer" with the answer-first sentence in issue 3.
6. PRODUCT: Fix the Atom card description grammar (issue 4).
7. TEXT: Reduce repeated sponsored links to the first mention per section (issue 4).
8. SEO: Shorten seoTitle to "Crash-Tested Dog Harness or Crate: How to Check" or drop the brand suffix on this page.

## Questions for the owner
- Can the Lucky Kennel Large ASIN be verified on its Amazon page so the button matches the large-dog pick? This is the one change that moves Product placement to 4 or 5.
