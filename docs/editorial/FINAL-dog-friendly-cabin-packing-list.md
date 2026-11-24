# FINAL: Dog-Friendly Cabin Packing List: What to Bring
- URL: /guides/dog-friendly-cabin-packing-list
- Source: src/content/guides/dog-friendly-cabin-packing-list.ts
- Action: one structural rewrite from a four-product catch-all to a tickable weekend packing companion.
- Reader benefit: build a weekend list from the essentials block alone, then add only the rows that match the cabin, drive and season.
- Body words: about 1,700 before, about 1,180 after (includes checklist lines).

## Major changes
Order is now: short intro, essential checklist (real `- [ ]` task items, four groups), what changes by cabin and destination (situation-dependent), drive, sleep/food/cleanup, seasonal extras, what can stay home, packing-list tool CTA, five-line departure check. Removed the host-question section (links to the rental checklist tool), the "four buys" framing, and the "How sure we are" box. Product descriptions for the food bin, bed and light were removed; gear is linked by /gear category and the first-aid, bowls and cold-weather guides. Title, dek, SEO description, FAQ and reading time were updated to match. No claim about buying things readers may own.

## Product placement
Kept one pick, the Soggy Doggy towel, after the cleanup paragraph that says an old towel works and a purpose-made one is only a convenience. Dropped the IRIS bin, Kurgo bed and Ruffwear Beacon picks (products still exist in the catalog; gear-products tests pass apart from the sitemap test noted below).

## Citation verification
Seven sources remain, each linked inline at least once: NPS, BearWise, ASPCA, CDC, AVMA, Cornell, Soggy Doggy. Dropped IRIS, Kurgo and Ruffwear sources because no claim depends on them any more. No [[n]] markers.

## Self-check of the success test
Yes: the essentials block is the first thing after a 65-word intro, about four phone screens of tickable lines, and the rest is optional. At 390 and 1280 the page has no horizontal overflow; checklist wraps have no hanging indent (shared template style, not changed).

## Before / after
Opening before: "Muddy paws at the door, a dark deck at 11 pm and a vet who may be far away are what a cabin adds to a normal trip. This list runs in the order you will need it: the car, the arrival, the nights and the cleanup."
Opening after: "Cabin weekends fail on small things: a missing medication dose, muddy paws on a white rug, a food bag left on the porch. Start with the essentials below, then add only what your cabin and season call for. ..."
Before, first section: "The short answer" with four rules and "four buys are worth it". After: "Essential packing checklist".
Before, closing: four-buy ordering plus stacked tool and guide links. After: a single link to /tools/packing-list and a five-line departure check.

## Test notes
tsc clean. content-pipeline, content, internal-guide-links, article-ux, guide-related-products pass. gear-products: one failure, "the sitemap lists the new category pages" (Gear workers' area).
