# Review: Christmas Week in a Cabin With Your Dog: Holiday Rules, Surcharges and Tree Safety (christmas-week-in-a-cabin-with-a-dog)
Verdict: FIX FIRST - the booking and hazard content is strong and honest, but the gear half is bolted on: boots are recommended with no pick, picks sit in odd places, and the page ends with a duplicate gear block that has a rendering defect.
Overall: 8.0 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 3 | Product placement 3 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(Sum 32 / 4 = 8.0. Fails the gate: overall under 9.0 and Buying advice and Product placement are below 4.)

Reviewed from source (content/guides/christmas-week-in-a-cabin-with-a-dog.md), the rendered page at 1280 and 390 px (screenshots in the scratchpad), page head (title tag "Christmas Week in a Cabin With a Dog | Paws & Passage", meta description = seoDescription, canonical correct, no horizontal overflow at 390), docs/pinterest-pins.csv row, public/pins jpg, and catalog records for the four products.

## Top 5 issues (most important first)

1. **Buying advice: boots are promised and never delivered.**
   - Where: "For the gear, the answer is short: a washable cold-weather layer and winter boots sized by chest girth and paw width..." and "For snow and ice, size boots by paw width, not dog weight, and check the count".
   - What: The short answer lists boots as one of four gear needs, the buying checklist has a boots line, and "What to buy first" ranks boots, but there is no boot product, no link and no pointer to where to learn more. The catalog already has ruffwear-polar-trex-boots (relatedGuides lists this very article), and the sister guide covers boots in depth. The page also never links in its body to /guides/cold-weather-dog-gear-for-winter-cabin-trips (it is only in the Keep reading block).
   - Fix: Replace the sentence "For snow and ice, size boots by paw width, not dog weight, and check the count: some are sold as a set of two." with: "For snow, ice or salted paths, boots are the item most worth reading about before you buy; our [cold-weather gear guide](/guides/cold-weather-dog-gear-for-winter-cabin-trips) covers when boots help, de-icer and paw width sizing. Size by paw width, not weight, and check the count: Ruffwear's Polar Trex is sold as a set of two." Then add `{{pick:ruffwear-polar-trex-boots|For salted or icy paths|The maker sells a set of two sized by paw width from 1.50 in to 3.25 in, states a waterproof, windproof softshell upper and winter-specific fiberglass lugs, and gives no temperature rating.|https://ruffwear.com/products/polar-trex-winter-dog-boots}}` and add ruffwear-polar-trex-boots to relatedProducts. If the owner prefers not to repeat the boot pick, still add the guide link.

2. **Product placement: picks do not arrive where the reader feels the problem, and every card says "Our pick".**
   - Where: the fleece card sits at the end of "Fire and cold: only what the sources say"; the Kurgo bed and KONG are introduced in the "What to buy first" section, after the buying checklist already listed them; four cards all carry the same "Our pick" label.
   - What: The fleece is introduced inside a section titled "only what the sources say" and right after a paragraph saying no source gives a temperature, so a product pitch interrupts a safety section. The bed and chew toy paragraphs appear as an afterthought under the closing heading and the reader meets the ranked advice and the product text in the wrong order. "Our pick" four times in a row gives no reason to choose one over another and reads as ranking.
   - Fix: (a) Move the "For a dog that will be out on cold walks, the Ruffwear Climate Changer Fleece..." paragraph and its pick card out of "Fire and cold" into a new H2 "Gear for the evenings and the cold walks" placed after "A tree and gift plan..." and before "Buying checklist". Put the Kurgo and KONG paragraphs and cards (currently under "What to buy first") into that same new section. (b) Leave only the ranked paragraph under "What to buy first". (c) Change the pick labels: gate "For keeping dogs off the tree", fleece "For cold walks", bed "A place to settle", KONG "For the hours the tree is off limits".

3. **Layout: duplicate gear block and a name defect at the foot of the page.**
   - Where: the "Gear for this trip" block after the Sources box; card heading "KONG KONG Classic".
   - What: The page ends with the same four products a second time as generic cards, after four inline pick cards for the same four products, which is eight affiliate buttons for four products on one page. The KONG card renders brand plus product name ("KONG KONG Classic"), an obvious defect on a site that sells on trust.
   - Fix: STRUCTURE/PRODUCT: either hide the auto-generated Gear block when every related product already has an inline pick card, or reduce it to one line "Details and specs for every product in this guide". Fix the KONG record display: set `name: Classic` or make the card renderer skip the brand when the product name already starts with it (content/products.yml id kong-classic, brand KONG, name KONG Classic).

4. **SEO and share fit: the title promises "Surcharges" and the pin shows no Christmas or cabin.**
   - Where: H1 "...Holiday Rules, Surcharges and Tree Safety"; public/pins/christmas-week-in-a-cabin-with-a-dog.jpg; hero image.
   - What: The article's actual finding is that none of 38 pages stated a holiday pet surcharge, so "Surcharges" promises a number the page cannot give and invites a click-then-bounce from someone searching "holiday pet surcharge". The hero and the pin are a Labrador in snow in bare woods; nothing says Christmas, tree or cabin, so the pin does not match its own title. The article body already uses an image of a dog asleep in front of a Christmas tree (second image on the page).
   - Fix: SEO: change title to "Christmas Week in a Cabin With Your Dog: Minimum Stays, Cancellation and Tree Safety" (keeps "Holiday Rules" idea, drops the surcharge promise; the surcharge answer stays in the FAQ and in bullet 2). Change seoTitle to "Christmas Cabin With a Dog: Booking Rules and Tree Safety". Use the dog-by-the-Christmas-tree photo as the hero and as the pin image (heroImage key and public/pins jpg), keeping the existing alt text style. Update the CSV pin title to the new H1.

5. **Reader flow: the short answer leads with a policy quote instead of the answer, and citation numbers are out of order.**
   - Where: "Minimum stays and cancellation are where holiday terms show up. A Blue Ridge Vacation says..." and the first body use of [18] (North States gate) before [15], [16], [17].
   - What: The top bullets are quotes from two managers; a reader who asked "will I pay extra and what must I ask" has to read two quotes to reach "ask for the total in writing". Also, the page then cites [18], [9], [10], [15] ... [16], [17] out of order, so the reference numbers jump around a reader who is checking sources. The "Fire and cold" section is one dense paragraph with eight citations and repeats what the sibling cold guide does better.
   - Fix: TEXT: add a first bullet "**Ask four things before you pay:** the minimum stay for your dates, the full total with one dog, cancellation terms, and whether this exact home takes dogs." Renumber the sources list so numbers follow first appearance in the body (the gate source becomes the next number after the PetMD tree source, and so on). Break the fire paragraph into three short bullets (tree, candles, fireplace).

## What works well
- The honest sample framing: "none of the 38 manager pet pages in our reading (a convenience sample)... not proof none exist" is repeated consistently in short answer, section 2, FAQ and "How sure we are", and the three-manager cancellation table is explicitly "three managers, not a pattern".
- The tree and gift plan is written for a house you do not own (ask the host, gate the doorway, cover or skip the water) and the gate paragraph openly states a 26 in gate will not stop a jumper or circle a tree. That is a differentiator no competitor on the research list has.
- The emergency vet section gives a concrete, checkable routine (24-hour hospital drive time, holiday hours by phone, save numbers offline) and refuses to invent clinic hours; the "What we could not confirm" table is useful, not decoration.

## Buyer walkthrough
1. Lands from "christmas cabin with dog", sees the short answer and the affiliate notice just above it (good, near the first link).
2. Learns minimum stay, cancellation and hazards; first product contact is the gate card halfway down, which fits the PetMD gate advice.
3. Reaches "Fire and cold", gets told no temperature rule exists, then is handed a fleece card.
4. Wants boots (the short answer said she needs them): no product, no link, must find the cold guide in Keep reading.
5. Scrolls to "What to buy first", finds bed and chew toy cards there, then meets all four products a third time in the Gear block (with the "KONG KONG Classic" glitch).

## Mobile notes (390 px)
- No sideways scroll (scrollWidth 390). The cancellation table reads fine as two columns, tall but legible, with superscript citations wrapping under the text.
- The H1 takes four lines before the dek and the page is about 21,850 px tall, roughly 1.5 times the desktop length; the 12 minute read plus three repeats of product cards is felt on a phone.
- Pick cards stack cleanly and buttons are tappable, but the "See it at Amazon" button label (dark text on terracotta) has low contrast; check against 4.5:1.

## Specific edits to make
1. STRUCTURE: Add boots to the guide: replace the sentence "For snow and ice, size boots by paw width, not dog weight, and check the count: some are sold as a set of two." with the text in issue 1, add the Polar Trex pick token shown there, and add `ruffwear-polar-trex-boots` to relatedProducts.
2. TEXT: In "The short answer", after "For the gear, the answer is short:..." add the sentence "Boots and a full cold-weather kit are covered in our [cold-weather gear guide](/guides/cold-weather-dog-gear-for-winter-cabin-trips)."
3. STRUCTURE: Move the fleece paragraph and pick card, plus the Kurgo and KONG paragraphs and cards, into one new H2 "Gear for the evenings and the cold walks" after the tree plan and before "Buying checklist". Keep the ranked sentence under "What to buy first".
4. PRODUCT: Change the four pick labels as listed in issue 2 (text in the pick token's second field).
5. PRODUCT: Fix "KONG KONG Classic" (kong-classic record or card renderer) as described in issue 3.
6. STRUCTURE: Suppress or shrink the auto "Gear for this trip" block when all related products already have inline picks.
7. SEO: Retitle per issue 4 (title, seoTitle, CSV pin title) and swap hero and pin image to the dog-by-the-tree photo.
8. TEXT: Add as the first bullet of the short answer: "**Ask four things before you pay:** the minimum stay for your dates, the full total with one dog, the cancellation terms, and whether this exact home takes dogs."
9. TEXT: Renumber citations so they ascend in order of appearance (the gate source currently cited as [18] before [9] to [17]).
10. TEXT: In "Fire and cold", split the single paragraph into three bullets: tree (distance, water, lights off), candles, fireplace (ask the host about a screen), each keeping the existing citation.
11. TEXT: Add a "skip it if" line to the gate paragraph: "Skip it if the tree room has no door or doorway to gate, or if your dog jumps 26 inches; use a closed door or crate time instead." (Derived from the maker's 26 in height and the page's own caveat; no invented claim.)
12. TEXT: In "What to buy first" make the order explicit with numbers (1 booking answers, 2 bed and chew toy, 3 fleece, 4 boots only if walks are on snow, ice or salted paths).
13. SEO: Add to the FAQ a question people search: "How cold is too cold for my dog on a Christmas cabin trip?" with an answer that points to the cold guide and repeats only that sources give different numbers (no temperature stated by us).

## Questions for the owner
- Is the boots pick duplicate across two articles acceptable, or should the Christmas page only link to the cold guide for boots (edit 1 offers both)?
- Is a Christmas-tree hero image available in the image library (the in-body dog by the tree), or should the pin use a type-led card?
