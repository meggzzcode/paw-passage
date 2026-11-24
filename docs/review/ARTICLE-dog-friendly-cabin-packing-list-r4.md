# Review (round 4): Dog Cabin Packing List: What to Pack and Buy (dog-friendly-cabin-packing-list)
Verdict: SHIP (the r3 text and product-card issues are fixed on the rendered page; the new hero has no third-party brand; what remains is a hero that still shows a car park rather than a cabin, page length, and a template-wide button contrast problem)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 5 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(sum 36 / 4 = 9.0; no criterion below 4. This is a bare pass: any regression in a 4 puts it back under. Honest note: Product placement moved from 4 to 5 because the r3 card defects are fixed; nothing else moved.)

Evidence: Playwright Chromium on the frozen build at http://localhost:4174/guides/dog-friendly-cabin-packing-list at 1280 and 390, plus the rendered text, link list, and computed styles. Head: title "Dog Cabin Packing List: What to Bring | Paws & Passage" = 54 chars; meta description 147 chars, starts with the verb "Use", primary keyword once; canonical correct; og:image /share/dog-friendly-cabin-packing-list.jpg; H1 "Dog Cabin Packing List: What to Pack and Buy"; 3 JSON-LD blocks. scrollWidth 1280 = 1280 and 390 = 390, no element wider than the viewport, no tables on the page. All 8 Amazon links (4 names in prose, 4 "See it at Amazon" buttons) carry rel="sponsored nofollow noopener"; no non-Amazon link is marked sponsored. All internal links I checked in the article body return 200. No prices, ratings, stock or urgency claims; no invented tests.

## Round-3 issues: verified on the rendered page
1. Hero shows a car boot with a third-party brand: PARTLY FIXED. The hero is now two border collies at a white station wagon with an orange suitcase, bowl and bags; no readable third-party brand. But the setting is a dim car park (concrete pillars, barriers), not a cabin or cabin porch. Alt text matches what is shown. The pin image I did not re-open; the pin CSV row title and description echo the keyword.
2. Bear caveat repeated: MOSTLY FIXED. Short-answer bullet 4 is now a pointer ("see Storage below"). The caveat is still said in the buying checklist item 1 ("not bear-proof"), "Storage.", the Iris paragraph ("a tidy bin, not a bear-proof one"), the card eyebrow, the card "why" line, and its FAQ. Fewer than before and each is now short, but it is still six touches.
3. Iris card repeats brand and name: FIXED. Brand "IRIS USA" in small caps, then "Airtight Dog Food Storage Container Up to 10 lbs". Chips, description and "Why we picked it" no longer say the same thing.
4. Why-texts repeat chip specs: FIXED (Iris: "For keeping kibble dry in a car or cabin kitchen; the maker makes no bear-resistance claim.").
5. First-aid and tick sections have no pointer: FIXED. The glance list reads "First-aid kit (no product needed)" and "Tick tool and preventive (no product needed)".
6. Button contrast: NOT FIXED (component). Computed colours are oklch(0.39 0.05 172) text on oklch(0.53 0.11 45) fill, a small lightness gap; it looks muted on the screenshot. This is the conversion button on all pick cards.

## Top issues (remaining, most important first)
1. **Hero and pin still do not say "cabin".** Where: hero `guide-cabin-packing` (src/lib/images.ts) and public/pins/dog-friendly-cabin-packing-list.jpg. What: the first image under a "Dog Cabin Packing List" title is a car park with two dogs and luggage; it reads "road trip", not "cabin". It costs Layout and SEO fit (both 4). Fix: edit 1.
2. **Pick-card button has weak contrast.** Where: every "See it at Amazon" button. What: dark green text on rust, low lightness difference; it is the main money control and hard to read in sunlight on a phone. Fix: edit 2 (component, owner).
3. **The page is long on a phone (about 23,600 px; 11 minutes) and the bear point still lands six times.** Where: buying checklist item 1, "Storage.", the Iris paragraph, card eyebrow and why line, FAQ. What: the content is the page's best, but a reader who has been told twice that the bin is not bear-proof does not need it in the checklist and card line as well. Fix: edit 3.
4. **Buying advice stops at four products.** Where: "What to buy first". What: this is honest (no catalog item for first aid, ticks, entry mat or cooling pad), and the close says so, but a buyer who wants a tick tool or first-aid kit is sent to the guide with no product. Not scored down further; fix is a catalog task (edit 4).

## What works well
- The first 40 words define the list, and the short answer states the four things to buy before any detail; the glance list with anchors makes the 11-minute page skimmable.
- The food-storage section is honest: NPS and BearWise are quoted, the container is labelled "NOT BEAR-PROOF" in the card eyebrow, and the maker makes no claim.
- Cabin-specific hazards (de-winterized chemicals, antifreeze, wood-stove clearance, pressure gates) are sourced; every product is linked in prose and on its card, with a details link to the right /gear anchor.

## Buyer walkthrough
1. Lands from "dog cabin packing list"; the first paragraph defines it, the short answer names four buys.
2. Scans the glance list and "Buying checklist", which maps each buy to a need.
3. Meets the container card in the food section, then towel, bed and light cards where the problem appears.
4. Clicks "See it at Amazon" (sponsored) or "Details and specs"; one prose link per product to the maker.
5. Close "What to buy first" lists the four in order and points to the packing-list tool, checklist and stays. Friction: length and button legibility.

## Mobile notes (390 px)
- No sideways scroll (scrollWidth 390); no tables; page height about 23,600 px.
- Hero crops to a wide strip but both dogs and the suitcase stay visible; the breadcrumb wraps onto two lines (minor).
- Pick cards are full width with the button and "Details and specs" side by side; the button text is low contrast.

## Specific edits to make
1. STRUCTURE. Replace the hero and pin with a cabin porch or interior image with luggage and a dog, no readable brand; update the hero alt in src/lib/images.ts and regenerate the pin.
2. STRUCTURE. Component: cream or white text on the rust fill (or a darker fill) for at least 4.5:1.
3. TEXT. Drop "(tidy storage, not bear-proof)" from checklist item 1 (keep "A food container with a snug lid that fits the whole bag.") and keep the caveat in Storage, the card eyebrow and the FAQ.
4. PRODUCT. If a sourced first-aid kit or tick remover is added to the catalog, add one card; otherwise leave as is.

## Questions for the owner
- Is there a licensed cabin image for the hero and pin?
