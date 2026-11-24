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
