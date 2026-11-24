# Review (round 2): Portable Dog Fence for Rentals: Pens and Playpens When There Is No Yard (portable-dog-fence-and-playpen-guide-for-rentals)
Verdict: FIX FIRST. The round-1 structure problems are largely solved (short answer, comparison table, large-dog row, fewer repeats), but the spec cards show duplicated brand names, the answer still starts below the hero, and the title tag is long, so it misses the 9.0 gate.
Overall: 8.3 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 4  (sum 33 / 4 = 8.3)

Method: read src/content/guides/portable-dog-fence-and-playpen-guide-for-rentals.ts, round-1 review, FIX and SEO notes; rendered http://localhost:4173/guides/portable-dog-fence-and-playpen-guide-for-rentals at 1280 and 390 and read the screenshots. Head: title "Portable Dog Fence for Rentals Without a Fenced Yard | Paws & Passage" (69 chars rendered; seoTitle 52), meta 150 chars (within 130 to 155). Primary keyword "portable dog fence for rentals" is at the start of both H1 and title. No horizontal scroll at 390; three tables use swipe containers with the hint. All Amazon links (4 cards, 4 prose names, iCrate) are `sponsored nofollow noopener`. No prices, ratings or stock. Hero (dog behind a white portable mesh fence on grass) matches the topic. Pin row in docs/pinterest-pins.csv matches the new title.

## Round-1 issues: status
1. Warning restated too many times: MOSTLY FIXED (tie-out bullet and the duplicate sentence gone; MidWest escape warning now short answer, card watch-out, FAQ). "Do not leave a dog alone" still appears in the short answer, "When not to use", an FAQ and the pen paragraph.
2. Short answer contradicted the picks: FIXED (height in inches, no "eight panels" rule).
3. Large dogs had no answer: FIXED in the table and "What to buy first"; the answer is honest but thin (see issue 3).
4. No side-by-side: FIXED (four-row table with product links). It lacks a floor-protection column, the feature the page calls the most relevant to rentals.
5. Product names not clickable: FIXED via aliases; all four pens and the iCrate link in prose and in the table, with correct sponsored rel.

## Top 5 issues (most important first)
1. **Spec card names repeat the brand (Layout 4, Product placement 4).** Where: the cards for the MidWest pen ("MIDWEST HOMES FOR PETS / MidWest Homes for Pets MidWest Exercise Pen with Door") and the Carlson yard ("CARLSON PET PRODUCTS / Carlson Pet Products Convertible Pet Yard (Model #2200)"). What is wrong: the brand is printed in the eyebrow and again at the start of the title, and "(Model #2200)" is clutter; the Petmate and North States cards do not do this, so the set looks uneven. Fix: in content/products.yml set the card title field to the short names "MidWest Exercise Pen with Door" and "Convertible Pet Yard" (drop the model number from `name`, keep it in a spec), or make the card skip the brand prefix when the name already contains it. Same MidWest duplication appears in the pet-friendly checklist card.
2. **Answer starts below the hero on both widths (Answer clarity 4).** Where: dek "How to choose a freestanding pen, match it to your dog, ask the host first, and know when a portable barrier is the wrong tool." What is wrong: the dek is a table of contents, not the answer; the sentence that says "a freestanding folding pen, used with the host's permission" is under the hero and disclosure. Fix: replace the dek with "Use a freestanding folding pen taller than your dog can jump, with the host's permission and you present. Here is how to pick one, what to ask the host first, and when to skip it."
3. **Large-dog and "which one" buying answer is still soft (Buying advice 4).** Where: "Pick by situation" last row and "What to buy first" item 3. What is wrong: the table tells large-dog owners to start with the tallest MidWest size but never says which size designation, and no row says what a first-time buyer with an average dog should buy. The Petmate "Dimensions listed without units" is honest but leaves a card pick with no usable height. Fix: add a one-line verdict above the comparison table: "If you buy one: the MidWest Exercise Pen with Door in the tallest size that fits your car, for any dog that jumps; the Carlson yard if your dog is small and you also need a doorway barrier." Drop the Petmate from "What to buy first" item 3 unless the owner wants it kept as the soft-sided option (open question below).
4. **Title tag length (SEO fit 4).** Where: head title "Portable Dog Fence for Rentals Without a Fenced Yard | Paws & Passage" is 69 characters. What is wrong: Google truncates around 60; the benefit words "Without a Fenced Yard" may display but the brand will not, and the seoTitle differs from the H1 only by phrasing. Fix: seoTitle "Portable Dog Fence for Rentals: Pens and Gates" (46; rendered 63) or "Portable Dog Fence for Rentals Without a Yard" (45; rendered 62).
5. **Remaining repetition and thin differentiation proof (Reader flow 4, Differentiation 4).** Where: "How sure we are" and "When not to use a portable pen" restate the host-permission and unattended points already in the short answer and FAQ; the page never states what makes it different from "Best fences for dogs" roundups. Fix: delete the first two bullets of "When not to use" (both already in the first screen bullets) and add one sentence under the short answer: "Unlike roundups of backyard fences, this page covers only what a renter can bring and still get their deposit back: host questions, floor protection and no-drill options." Do not claim testing.

## What works well
- The comparison table with maker-stated heights, door and a "best for" column makes the four choices skimmable and every product name links.
- Honest limits are named at the line of use: no maker states a dog weight limit, Petmate dimensions have no units, 28 in is modest for a jumper, gate not for stair tops.
- The rental-specific content (host questions list, stabilizers as floor protectors, anchors only with written permission) is the page's real differentiator.

## Buyer walkthrough
1. Lands from "portable dog fence for rental", sees H1 and dek, scrolls past the hero to the short answer and "What to buy".
2. Uses the checklist, then the comparison table to shortlist the MidWest or Carlson.
3. Reads the pen paragraph (who it suits, who can skip it) and clicks "See it at Amazon" on the card or the linked name.
4. Friction: duplicated brand text on two cards; no single "if you buy one" verdict; Petmate card gives no height.
5. Next: "What to buy first" and the trip checklist/packing list links, plus fenced-yard, large-dog and reactive-dog guides; no dead ends.

## Mobile notes
- scrollWidth equals 390; the three tables sit in swipe containers with the hint.
- Cards stack well with chips on separate lines; the Carlson card title takes four lines because of the duplicated brand and model number.
- First phone screen is title, dek and share buttons; the short answer needs two scrolls.

## Specific edits to make
1. PRODUCT: shorten the MidWest and Carlson card titles (remove repeated brand and "Model #2200") as in issue 1.
2. TEXT: replace the dek as in issue 2.
3. TEXT: add the "If you buy one" line above the comparison table (issue 3).
4. SEO: seoTitle "Portable Dog Fence for Rentals: Pens and Gates" (check the tests still require at most 60).
5. TEXT: trim the first two bullets of "When not to use a portable pen" and add the one-sentence differentiator under the short answer (issue 5).

## Questions for the owner
Keep the Petmate soft-sided yard as a pick even though its page gives no usable height or strength claim? If not, swap it for a catalogued rigid pen with stated dimensions.
