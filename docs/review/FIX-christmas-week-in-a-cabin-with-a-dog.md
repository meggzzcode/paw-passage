# FIX round 2: christmas-week-in-a-cabin-with-a-dog

## Changed
- Title, seoTitle (57), seoDescription (149), first paragraph, first-bullet "Ask four things", gear sentence with link to the cold-weather guide; lastReviewed 2026-11-24.
- Citations renumbered by first appearance (sources list reordered to match); fire and cold section split into tree, candles and fireplace bullets.
- New H2 "Gear for the evenings and the cold walks" (bed, KONG, fleece, boots pointer) after the fire and cold section; gate pick kept in the tree plan with a who-for and skip-if. Pick labels: "For a tree room with a doorway", "A place to settle", "For when the tree is off limits", "For cold, dry walks".
- "What to buy first" is now a numbered order; buying checklist price line replaced by size chart and return terms; two FAQs added; packing-list guide linked.

## Not changed and why
- Boots pick: the brief caps a guide at 4 pick directives, and the page already has four. Boots are a prose pointer to the cold-weather guide, where the Polar Trex pick lives. If the owner wants a fifth card, add the pick and `ruffwear-polar-trex-boots` to relatedProducts.
- Review edit 13 (cold FAQ) answered without any temperature.

## For the lead
- Hero and pin: the hero (guide-christmas-week) and public/pins/christmas-week-in-a-cabin-with-a-dog.jpg show a dog in snow, nothing Christmas. The dog-by-the-tree image used in the body would fit better.
- docs/pinterest-pins.csv row 5: title should become "Christmas Week in a Cabin With Your Dog: Minimum Stays, Cancellation and Tree Safety" and the description should echo "Christmas cabin with a dog" (use the new seoDescription).
- Duplicate auto "Gear for this trip" block repeats all four inline picks; hide it when every related product has an inline card.
- Card renders "KONG KONG Classic": products.yml kong-classic has name "KONG Classic" and brand "KONG"; set name to "Classic" or skip the brand in the renderer.
- "See it at Amazon" button contrast (dark text on terracotta) flagged by the reviewer.
- products.yml: ruffwear-climate-changer-fleece and kong-classic already list this guide in relatedGuides; add north-states-mypet-universal-petgate and kurgo-loft-wander-dog-bed relatedGuides for this slug if desired.

## Round 3
- Opener now leads with the four manager questions and the 38-manager finding (moved to first bullet); jump link to the gear section added.
- Gear section moved up to directly after the booking questions (before hazards); gate card moved into it. Fleece card and its source removed (the cold-weather guide carries it, linked); boots card kept once, linked to the cold-weather guide. Buying checklist block deleted; packing-list gear bullet replaced by a pointer. Per-card "buy first" lines removed; one in "What to buy first".
- seoTitle now "Christmas Cabin With a Dog: Booking Rules and Safety" (53). readingMinutes 10. Citations renumbered after dropping the fleece source.
- For the lead: the fleece still appears in cold-weather-dog-gear-for-winter-cabin-trips; ruffwear-climate-changer-fleece relatedProducts id removed here. products.yml relatedGuides for the fleece still lists this slug (not edited).

## Round 4
Applied r3 edits 1, 2, 3 and 5: removed the repeated sample sentence and the duplicate "Ask four things" bullet; removed the cost claim in "What to buy first"; added the /gear/pens-and-gates link; gate paragraph now points to the hazards section. lastReviewed 2026-11-24, readingMinutes 10.
For the lead: edit 4 (hero crop or alt text in src/lib/images.ts) not touched; alt should say only what is visible (golden retriever on a wooden floor with blurred string lights).
