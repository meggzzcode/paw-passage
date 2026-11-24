# Review: Dog Car Safety: How to Choose a Crash-Tested Harness or Secured Crate (dog-car-safety-harness-and-crate-guide)
Verdict: REWORK the product layer - the verification method is the best content on the three pages, but the harness pick rests on a 2014 test of a listing we cannot confirm is the sold product, the crate link goes to the wrong size, and the hero shows unrestrained dogs in a bed.
Overall: 7.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 3 | Product placement 3 | Layout 3 | Trust 4 | SEO fit 4 | Differentiation 5
(Sum 30 / 4 = 7.5. Fails the gate: overall under 9.0 and Buying advice, Product placement and Layout are below 4.)

Reviewed from source (src/content/guides/dog-car-safety-harness-and-crate-guide.ts), the rendered page at 1280 and 390 px, page head (title tag "Crash-Tested Dog Harness? How to Verify It | Paws & Passage"; meta description = seoDescription; canonical correct; scrollWidth 390), the pin row and image, content/products.yml records for the four products, and content/affiliates.yml notes for the Amazon links.

## Top 5 issues (most important first)

1. **Buying advice and product placement: the harness pick may not be what the reader is sent to buy.**
   - Where: "Harness pick: For a dog riding on the rear seat, we start with Sleepypod's Clickit Sport..." and the pick card "Sleepypod Clickit Sport".
   - What: The pick is justified by a CPS listing (tested July 2014), the page itself says "we could not read a maker page for this model", and the catalog notes the maker URL returned 404 and that Sleepypod's current product is a Clickit Sport Plus (the Plus affiliate entry is not approved). The card's button goes to an Amazon listing for a Medium, Jet Black harness sold by a third party (affiliates.yml notes); a reader with a small or large dog lands on the wrong size and the page does not say that. The "Details and specs" and Source go to the CPS page, not a maker page, so the buyer cannot check size or fit anywhere on the maker side. A skeptical buyer is being asked to trust a nine-year-old test for a product they cannot verify is the same item.
   - Fix: PRODUCT/TEXT: add to the harness pick paragraph: "The button goes to a listing for one size (Medium); Sleepypod sizes by rib cage, so open the listing and pick your dog's size before you buy, and check that the listing names the Clickit Sport and not another model." Add the same as the first watch-out on the card. Ask the owner (below) to re-verify the Amazon listing; if the listed product is the Plus, either hold the pick back until its CPS listing is read or label it "CPS-listed model; check that the listing matches". Do not call it "the harness" (as in "the harness CPS lists") without that caveat.

2. **Buying advice: the crate link is for the Intermediate while the pick text is about the Large.**
   - Where: "Crate pick: ... The purchase link on the card below goes to the Intermediate, so if your dog is 70 lbs or more, pick the Large on the retailer page."
   - What: The text tells the reader to repair our own link. The CPS evidence quoted (110 lb test dog, July 2022, Large) is for a size the button does not open, and the affiliates note admits the ASIN came from search results and was not verified on the Amazon page. A buyer with a 70 to 110 lb dog is the exact reader this crate is recommended for.
   - Fix: PRODUCT: owner to approve a link to the Large (affiliates.yml notes list Large B0DW9JGDJM and Medium B0CTP2VR2T as candidates; each must be verified on the page before use), or split into one pick per size with its own button. Until then keep the existing sentence and add "Medium and Large listings exist on Amazon; open the one that matches the maker's weight guide above" so the reader is not left to guess.

3. **Layout: the hero and pin show unrestrained dogs, and the comparison table is cut off on a phone.**
   - Where: hero image alt "A small tan dog and a small curly black dog, the black one in a harness, sitting..." (also public/pins/dog-car-safety-harness-and-crate-guide.jpg); the table "What the CPS listings and makers say, side by side".
   - What: The hero and pin picture two small dogs sitting in a raised bed on a back seat with no visible tether, for an article that says a booster seat is not a restraint and that a restraint must be anchored. The picture undercuts the headline and shows exactly the setup the text warns about. On 390 px the four-column table scrolls inside its box: the Test dog column is eight lines tall and the "Tested" column is clipped, so the date and protocol are hidden unless the reader swipes (no scroll cue).
   - Fix: STRUCTURE: replace the hero and pin photo with an image of a dog in a harness on a seat belt or a crate secured in a cargo area, or if none exists use the Great Dane related image only if a restraint is visible; if no suitable image exists, add a caption "Not a restraint: a bed or booster seat does not replace a tested harness or secured crate" under the current hero. For the table, drop the "Tested" column on mobile by merging it into the Test dog cell ("Small 25 lb; Medium 45 to 90 lb ... (July 2014)") so three columns fit, or add a visible "swipe" hint.

4. **Answer clarity and flow: the short answer gives the method but not the shortlist, and "Pick by situation" names no products.**
   - Where: "The short answer: What to buy: a harness that threads onto a rear-seat belt, or a crate..." and the list "Pick by situation".
   - What: A reader who wants "which one for my dog" must read to "Harness pick" (about 45% down) to see a name. "Pick by situation" describes a Large crate, a Medium dog on a sedan, a toy dog, with no product names or links, though the picks exist: the reader who finds their situation then has to scroll back to cards. The page also has a second and third restatement of the same picks ("What to buy first" and the "Picks by criteria" block), so the same four products appear about four times. Meanwhile the reader with a dog over 90 lb gets no decision (the page says the listing gives no tested weight, then moves on).
   - Fix: STRUCTURE/TEXT: add to the short answer after the bullets: "**Quick picks (all from CPS listings, read 2026-11-19):** a dog up to 90 lb on the rear seat: Sleepypod Clickit Sport harness. A large dog in an SUV: Lucky Duck Lucky Kennel with the Lucky Ratchet Strap Kit. A dog up to 12 lb: Sleepypod Atom carrier. Over 90 lb: no harness in this guide has a tested weight that high, so look for a crate with a test dog weight at or above yours in the CPS directory." Add product names and links to each "Pick by situation" bullet (Large crate bullet to Lucky Kennel, Medium dog bullet to Clickit Sport, toy dog bullet to Atom and Kurgo Heather). Remove the Hammock bullet from "Pick by situation" (it is not a restraint and is covered in "What to buy first").

5. **SEO fit: the title tag and meta description leave out the crate half and the hook that wins the click.**
   - Where: seoTitle "Crash-Tested Dog Harness? How to Verify It"; seoDescription "“Crash tested” is not regulated. Check a harness or crate in the Center for Pet Safety directory, match your dog's weight, and skip extension tethers."
   - What: The title tag promises only a harness, while the H1 and half the content are about crates, so searchers for "dog crate for car" get no signal. The description is fine on content but starts with a quoted phrase and spends its length on three tips; it never says there are picks. The rental/cabin tie-in is thin (one sentence in "Why restraint matters"), so for this site's audience the page reads as a generic car-safety guide, and the pin (a booster-bed photo) does not match the headline.
   - Fix: SEO: seoTitle "Crash-Tested Dog Harness or Crate? How to Check One"; seoDescription "“Crash tested” is not regulated. How to look up a dog harness or crate in the Center for Pet Safety directory, match your dog's weight, and skip extension tethers, with four picks." Add one sentence under "Why restraint matters": "Driving to a cabin means longer highway miles and often a loaded car, so settle the restraint before you pack." (No new factual claim.) Keep the pin title in line with the H1 and change the pin image as in issue 3.

## What works well
- It teaches the reader to verify a claim instead of ranking by opinion: the seven-criteria checklist and the "what crash-tested does and does not mean" section explain that no federal standard exists, that the test dog is a dummy, that certification is model, size and test-weight specific, and that the 2013 and 2015 studies are old. This is the strongest differentiator on the three pages.
- Honest watch-outs on every pick: the 2014 test date, the 90 lb ceiling, the Atom's 12 versus 18 lb discrepancy, the booster seat not claiming crash testing, the Lucky Kennel weight by size, and the strap kit being sold separately.
- The pre-trip checklist and "Install it correctly" blocks are short and concrete and say what not to do (no extension tethers, no bungee cords, do not leave a carrier loose).

## Buyer walkthrough
1. Lands from "crash tested dog harness", sees the disclosure and the short answer that frames how to verify; no product yet.
2. Reads through seven criteria and the harness-vs-crate table to the CPS side-by-side table (first product names, text links in the table cells).
3. Reaches the harness pick: reads that the maker page could not be read, then clicks "See it at Amazon" to a single-size listing from a third party seller.
4. Wants a crate for a big dog: reads that the button goes to the Intermediate and must find the Large on Amazon herself.
5. Finishes at "What to buy first" and the "Picks by criteria" block, which repeat the same four products; next steps are the checklist tool and the packing list.

## Mobile notes (390 px)
- The page is about 26,900 px tall (the longest of the three) with no horizontal page scroll (scrollWidth 390).
- The CPS comparison table is clipped on the right: "Test dog" wraps to eight lines and "Tested" is cut off with no scroll cue. The harness-vs-crate table is readable.
- Pick cards are fine, but the same product shows up in inline cards, the Picks-by-criteria block and the Gear block, so a phone reader scrolls past about 12 near-identical buttons.

## Specific edits to make
1. PRODUCT: Add a size-and-model check sentence to the harness pick paragraph and the first watch-out on the Clickit Sport card (text in issue 1). Ask the owner to re-verify the Amazon listing (title must say Clickit Sport) before this article is re-reviewed.
2. PRODUCT: Resolve the Lucky Kennel link: link to the Large (or one button per size) once verified, or add "Medium and Large listings exist on Amazon; open the one that matches the maker's weight guide above" next to the existing Intermediate sentence.
3. STRUCTURE: Replace the hero (heroImage "gear-car-safety") and the pin image with a photo that shows a harness on a seat belt or a secured crate; otherwise add the caption in issue 3.
4. STRUCTURE: On mobile, merge the "Tested" column into the "Test dog" cell of the CPS table, for example "Small 25 lb; Medium 45 to 90 lb; Large 75 to 90 lb; X-Large up to 90 lb (July 2014, CPS-001-014.01)".
5. TEXT: Add the "Quick picks" paragraph from issue 4 right after the five short-answer bullets.
6. TEXT: Add product names and links to the "Pick by situation" bullets for the large dog in an SUV (Lucky Kennel), medium dog in a sedan (Clickit Sport), and toy dog (Atom, Kurgo Heather); delete the hammock bullet.
7. TEXT: Add the over-90-lb line to "Pick by situation, Very large breed": "Check the maker's top weight and the CPS test dog weight; the harness in this guide has no tested weight above 90 lb, so a heavier dog needs a crate or product whose CPS listing shows a test dog at or above its weight."
8. SEO: Replace seoTitle and seoDescription as in issue 5; update the pin CSV title/description to match the H1 and keep the utm URL.
9. STRUCTURE: Collapse the auto-generated "Picks by criteria" block (or hide the Gear block) so each product shows at most twice: one inline pick card and one "What to buy first" link.
10. TEXT: Add a FAQ "Do dogs need a crash-tested harness in a rental car?" with the answer "The CDC and ASPCA advise a back-seat restraint for any trip, and a rental car does not change that; use a harness that fits the car's seat belt and your dog's rib cage. Check the rental company's rules on pet hair and fees." Remove the last clause if not supportable by a cited source; the first part restates cited advice.
11. TEXT: Add the missing long-tail questions as short FAQ entries answered only from sources already cited: "Can a dog ride in the front seat?" (the cited CDC and ASPCA advice is the back seat) and "Are dog seat belt tethers safe?" (CPS extension tether advisory).
12. TEXT: Link the cold-weather sibling: in "Safety caveats" add "Heading to a winter cabin? See [cold-weather dog gear](/guides/cold-weather-dog-gear-for-winter-cabin-trips); the Timberline Fuse vest there is a walking harness, not a car restraint."

## Questions for the owner
- Is the Amazon listing behind sleepypod-clickit-sport (B08JQQF9YX, Medium, Jet Black, third-party seller) still correct and still the Clickit Sport and not the Plus? If it cannot be confirmed, should the pick be paused until a current CPS-listed harness with a readable maker page is available?
- Which Lucky Kennel size(s) should carry a buy button (Medium, Intermediate, Large)? Each ASIN needs to be verified on its Amazon page first.
