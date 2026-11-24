# Review (round 3): Dog Cabin Packing List: What to Pack and Buy (dog-friendly-cabin-packing-list)
Verdict: FIX FIRST (all round-2 text issues are fixed and the page is accurate; the hero and pin still show a duffel in an SUV, not a cabin, and a few repeated or generic lines keep it just under the gate)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(sum 35 / 4 = 8.75, rounded 8.8; no criterion below 4, so the only blocker is the 0.25 gap to 9.0. Four 4s need two lifted to 5; edits 1 to 6 below plausibly do that.)

Evidence: source src/content/guides/dog-friendly-cabin-packing-list.ts, r2 review, FIX (Round 3) and SEO notes; rendered page at 1280 and 390 (screenshots in the scratchpad r3/ folder, read). Head: rendered title "Dog Cabin Packing List: What to Bring | Paws & Passage" = 54 chars; meta description 147 chars, primary keyword "dog cabin packing list" once, starts with a verb; H1 "Dog Cabin Packing List: What to Pack and Buy". scrollWidth 390 = 390 on mobile, 1280 = 1280. All 8 Amazon links carry rel="sponsored nofollow noopener"; no non-affiliate link is marked sponsored; product names in prose (Iris, Soggy Doggy, Kurgo, Beacon) are all clickable. No prices, ratings, stock or urgency claims (the only "price" text is the site's "Check the current price on the listing" card line); no invented first-hand experience.

## Round-2 issues: verified
1. NBC Select claim in "How sure we are": FIXED (removed; the block now lists only sources the page cites).
2. Missing links to first-aid and bowls guides: FIXED (in the first-aid section and the food section, and both in relatedGuides).
3. Iris name not clickable: FIXED (now a sponsored link to the card target).
4. Repeated "buy first" and generic checklist item 6: FIXED. "Buy first" is gone from the body; the only "buy first" text is the closing H2 "What to buy first" and its table-of-contents entry. Item 6 is now about container capacity.
5. Meta description CTA: FIXED ("Use this dog cabin packing list: ...", 147 chars).
6. Hero (optional edit 8): NOT FIXED. The hero and the pin are unchanged: a border collie lying in the open back of an SUV beside a canvas duffel with a legible third-party label ("BIRDLING"). It says "packing" but not "cabin", and it advertises another brand beside our picks.

## Top issues (remaining, most important first)
1. **Hero and pin do not show a cabin and show a third-party brand.** Where: hero `guide-cabin-packing` and public/pins/dog-friendly-cabin-packing-list.jpg. What: the first image a search or Pinterest visitor sees is a car boot; the title promises a cabin list, and the brand label on the duffel competes with the products we link. Fix: edit 1 (owner image task; not article text). Costs Layout and SEO fit (both 4).
2. **The bear-food caveat is still said four times.** Where: short answer bullet 4 ("Do not count on an ordinary food bin or cooler as bear-proof."), "Storage." paragraph ("Do not count on a regular food bin or an ordinary cooler as bear-proof."), the Iris paragraph ("It is a tidy bin, not a bear-proof one."), the Iris card eyebrow "(not bear-proof)", the FAQ "Can I leave dog food on the cabin deck" ("No: treat any household bin ... not bear-resistant"), and the next FAQ. It is the page's best content but it reads as insistence by the third pass (Reader flow 4). Fix: edit 2.
3. **Card name repeats the brand and the card text repeats itself.** Where: the Iris card shows the brand "IRIS USA" in small caps and then the name "IRIS USA Airtight Dog Food Storage Container Up to 10 lbs"; on every card the grey description under the chips and "Why we picked it" restate the same specs (for Soggy Doggy: "31 x 14 in ... microfiber" appears in the chips, the description and the why line). Fix: edit 3 (product data) and edit 4 (why text).
4. **The page is the longest of the three (about 23,800 px on a phone, 11 minutes) and the first-aid and tick sections have no product and no decision.** Where: "A practical canine first-aid kit" and "Tick prevention and the evening inspection". What: both are sourced and useful, but a reader who wants "what do I buy" scrolls past about 7,000 px of them; the glance list helps. Fix: edit 5 (one-line pointer in the at-a-glance list, no new product).
5. **Contrast of the "See it at Amazon" button.** Where: every pick card. What: dark green text (oklch 0.39) on rust (oklch 0.53) measures roughly 1.8:1 by my estimate of the computed colours; the same on all three articles. Fix: edit 6 (component; owner). Not scored against this article because it is template-wide, but it is the main conversion control.

## What works well
- The food-storage section remains unusually honest: NPS and BearWise are quoted, the Iris maker's lack of a bear claim is stated, and the card says "(not bear-proof)".
- The close now matches the cards exactly (container, towel, bed, light), in order, with entry mat and cooling pad marked optional and no model recommended.
- Cabin-specific hazards (de-winterized chemicals, antifreeze in toilets, wood stove clearance, pressure-gate warning) with sources, plus a first paragraph that defines the packing list in 40 words and an at-a-glance anchor list.

## Buyer walkthrough
1. Lands from "dog cabin packing list"; the first paragraph defines the list and the short answer's first bullet says what to buy.
2. Scans "Pack list at a glance" and the five host questions.
3. Meets the Iris card in the food section, the towel and bed cards in the mess section, and the light card under "Heat, light and dark nights".
4. Clicks "See it at Amazon" or "Details and specs" (all sponsored; one extra prose link per product).
5. Close lists the four in order and sends the reader to the packing list tool, checklist and stays. Little friction beyond length.

## Mobile notes (390 px)
- No page-level sideways scroll (scrollWidth 390); page height about 23,800 px.
- Cards are full width, chips wrap onto three lines, the button and "Details and specs" sit side by side without overlap.
- The Iris card shows a generic box icon and the brand name twice (small caps then name); the Soggy Doggy card icon does not suggest a towel (carried over from round 2).

## Specific edits (ready to apply)
1. STRUCTURE. Replace the hero and pin with a cabin porch or interior image with luggage and a dog and no readable third-party brand; update the hero alt text in src/lib/images.ts and regenerate the pin.
2. TEXT. Keep the full bear caveat in "Storage." and the Iris card only. In the short-answer bullet 4 shorten to: "Keep pet food, treats, bowls and rubbish indoors or stored the way the property and park say (see Storage below)." In the FAQ "Can I leave dog food on the cabin deck in a sealed bin?" delete the second sentence about NPS and keep one pointer.
3. PRODUCT. In the Iris catalog name drop the leading "IRIS USA" (brand is already shown above the name), or set the card to show the name without the brand when it already starts with it.
4. TEXT. In each {{pick}} "why" text state the job once and do not repeat the chip specs, for example Soggy Doggy: "For wiping paws and legs at the door before they cross the floor."
5. STRUCTURE. In the at-a-glance list add "(no product needed)" after "First-aid kit" and "Tick tool and preventive", so a buyer skims past them.
6. STRUCTURE. Component: change the pick-card button to cream text on the rust fill (or darken the fill) to reach at least 4.5:1.

## Questions for the owner
- Is there a licensed cabin image to replace the hero and pin?
