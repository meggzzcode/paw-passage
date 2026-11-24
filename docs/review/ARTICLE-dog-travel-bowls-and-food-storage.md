# Review: Dog Travel Bowls and Food Storage: What to Pack and What the Specs Say (dog-travel-bowls-and-food-storage)
Verdict: FIX FIRST (well sourced and honest, but half the products it tabulates have no pick card, one of two bowl picks has no stated capacity, and the "What to buy" answer names no product)
Overall: 8.0 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 3 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5  (sum 32 / 4 = 8.0; fails the 9.0 gate; Buying advice is below 4)

Evidence base: source `content/guides/dog-travel-bowls-and-food-storage.md`; rendered `http://localhost:4173/guides/dog-travel-bowls-and-food-storage` at 1280 and 390 wide (screenshots in the scratchpad `r4/` folder); head read from the page; pin row 10 of `docs/pinterest-pins.csv`; catalog records for `kurgo-collaps-a-bowl`, `gunner-dog-bowl`, `vittles-vault-travel-tainer`, `iris-usa-airtight-dog-food-container-10-lb`, and the catalog entries that exist but have no card (`kurgo-kibble-carrier`, `ruffwear-quencher-bowl`, `kurgo-splash-free-wander-bowl`, `springland-22oz-original-travel-bottle`, `springland-20oz-flip-travel-bottle`). Title tag: "Dog Travel Water Bowl and Food Storage | Paws & Passage". Meta description: "Eight travel bowls, bottles and food carriers compared on what each maker states, plus water, kibble and bear-country storage rules for a rental trip." Canonical correct, no robots block.

## Top 5 issues (most important first)

1. **Buying advice stops at four cards for an eight-product comparison, and the picks skew oddly (Buying advice 3).**
   - Where: "Eight travel bowls, bottles and carriers" table and the "Bowls to start with" / "Keeping dry food fresh" picks.
   - What is wrong: the table compares eight products; four get cards (Kurgo Collaps, Gunner, Vittles Vault, IRIS). The Kurgo Kibble Carrier, which the text itself says "can carry a few days of food without the whole bag" and is the only travel-sized food carrier besides the Vittles Vault, has no card. The Ruffwear Quencher, Kurgo Splash Free Wander and both Springland bottles are covered in one paragraph ("Two others in the table suit different jobs") with no card and no who-should-skip. The Gunner bowl is one of only two bowl picks even though the page says it gives no capacity or dimensions; a buyer cannot size it, and the article tells the reader to "run a water test at home" and "read the label" for the same product. The catalog has records for all the missing products, so they can be cards without new research.
   - Fix (PRODUCT): add cards for `kurgo-kibble-carrier` (in the dry-food section, as the light option for a weekend without the whole bag) and `kurgo-splash-free-wander-bowl` (the "lives in the car" bowl). Optionally add `ruffwear-quencher-bowl` as the "bigger drink on a long walk" bowl. Keep Gunner but add "Skip it if you need to know the capacity before you buy" in its paragraph. Add the new ids to `relatedProducts`.

2. **"What to buy" at the top names no product and gives no size rule a reader can act on (Answer clarity 4).**
   - Where: the bullet "**What to buy:** one bowl that packs flat and holds about one drink for your dog..."
   - What is wrong: "about one drink for your dog" is not measurable, and the first screen on both desktop and mobile is the intro, not a decision. The reader does not learn that the table has 24 oz and 4.2 cup bowls until much later. There is no small-dog versus large-dog guidance, no "skip" guidance, and nothing says "for a weekend with one medium dog, this plus this".
   - Fix (TEXT): replace the bullet with: "**What to buy:** a flat-packing bowl (the Kurgo Collaps A Bowl holds 24 oz and collapses under 1 inch, per the maker), plus, for food, a lid-tight container sized to the days you need (the Vittles Vault Travel-Tainer is 6 cups with two bowls, per the maker; a longer stay or a large dog needs more than that). Bring water from home. Check the maker's stated capacity against your dog's drink and your food bag, not the product name." Do not add any claim about how much a dog drinks.

3. **Scope sprawl and repeated points make the page long for the question (Reader flow 4).**
   - Where: the water-source paragraph, the bear-country section, the kitchen section, and the FAQ.
   - What is wrong: 10 minutes and about 20,300 px on a phone. The dishwasher caution appears five times (Kurgo paragraph, table, "Ask before you run bowls through the dishwasher", FAQ, "What we could not confirm"), and bear-country scent appears in the intro bullet, the cabins section, the FAQ and the confirm table. The "What we could not confirm" table repeats cells already in the spec table's "no capacity" and "no test data" notes.
   - Fix (TEXT): in the Kurgo Collaps paragraph delete "The maker says it is top-rack dishwasher safe, but in a rental we would still wash it by hand (see the kitchen section below)." In "What we could not confirm" delete the rows "Dishwasher status of the Kibble Carrier and Ruffwear" and "Prices and ratings" (both stated elsewhere on the page). Keep the bear-country section as the only full treatment and shorten the intro bullet to one clause.

4. **A leftover internal-process sentence confuses readers (Trust 4).**
   - Where: "How sure we are", second bullet: "What most people report: nothing here rests on reports, and we did not use our 38-manager dataset because it does not cover food or water rules."
   - What is wrong: a reader has never heard of a "38-manager dataset" on this page; it reads as template text and invites a question the page cannot answer. It also sits beside a different claim, "Our reading is that a bowl sized to your dog's single drink... is the easier one to pack", which is our judgment with no source, and the page only labels some judgments as such.
   - Fix (TEXT): replace the bullet with "**What most people report:** nothing here rests on owner reports or surveys." In the third bullet of "How sure we are" add "the single-drink sizing reading" to the list of our judgments.

5. **Mobile spec table hides the cleaning column, which is the rental question (Layout 4).**
   - Where: the eight-row table "Product | Capacity | Materials | Cleaning".
   - What is wrong: at 390 px the table is 447 px wide inside a 350 px wrapper; "Capacity" and "Materials" show, "Cleaning as stated" is off-screen, and the text rows run 8 to 11 lines tall. The cleaning column answers the rental dishwasher question.
   - Fix (STRUCTURE): either reorder the columns to Product | Capacity | Cleaning | Materials, or add a one-line note above the table: "On a phone, swipe the table sideways to see cleaning." The columns reorder is cleaner.

## What works well
- The eight-product spec table is built only from maker wording with explicit "no capacity or dimensions stated" cells, and the "What we could not confirm" table lists every gap (Gunner nylon versus silicone caption, Springland volume in the name only). It is exactly the "researched, not tested" stance without repeating it.
- The agency-sourced food and water section (ASPCA, FDA 80 F and original-bag advice, CDC Giardia, NPS and West Virginia on dog food and bears) is not offered by any competitor listed in the research block, and the page is careful that an airtight lid is not a bear-resistance rating.
- The rental-kitchen section is clearly labelled "our advice, not a rule" and ends with a short host message, which converts the advice into an action.

## Buyer walkthrough
1. Lands from "dog travel water bowl"; the H1 and first paragraph confirm the page covers bowls, food storage and a rental. The "What to buy" bullet gives a rule but no product.
2. Scans the checklist, then the water and CDC section, then the 8-row table; this is where the product comparison starts, about 2 screens down.
3. Reaches "Bowls to start with": Kurgo Collaps and Gunner cards, each introduced by a use case. The Kurgo Collaps card matches the text (24 oz, under 1 inch, top-rack dishwasher).
4. Friction: no card for the Kibble Carrier, Splash Free Wander, Ruffwear or Springland bottles though they are in the table; the Gunner card has no capacity to compare.
5. Food cards (Vittles Vault, IRIS) are placed after the FDA paragraph that explains why; the page closes with "What to buy first", the packing list tool, the cabin packing guide, the trip checklist and the /gear/feeding-and-hydration page. No dead ends.

## Mobile notes (390 px)
- No page-level horizontal scroll; the 4-column spec table scrolls inside its wrapper and loses the Cleaning column off-screen. The "What we could not confirm" table fits the width.
- The first screen shows breadcrumb, title (4 lines), dek (6 lines) and the byline row ("15 official sources", "Affiliate links disclosed"); the corgi-and-orange-bowl hero starts below the fold. The full disclosure sentence sits just under the share buttons.
- About 20,300 px tall; "On this page" nav is present. Product names in the table are links (Amazon) and the cards show "Details and specs" plus "See it at Amazon"; both are tap-sized.

## Specific edits to make
1. **TEXT** Replace the bullet starting "**What to buy:** one bowl that packs flat" with: "**What to buy:** a bowl that packs flat (the Kurgo Collaps A Bowl holds 24 oz and collapses to under 1 inch, per the maker) and, for food, a lid-tight container with room for the days you need (the Vittles Vault Travel-Tainer is a 6-cup container with two 3-cup bowls, per the maker). Both are easier to pack than to improvise."
2. **PRODUCT** After the paragraph beginning "That makes a rigid container a holder for the bag", add: "{{pick:kurgo-kibble-carrier|Lightest food carrier for a few days|The maker lists up to 5 lbs of dry food, about 20 cups of average kibble, ripstop material with a food-safe PEVA liner, and hand wash only.|https://www.kurgo.com/dog-travel/kibble-carrier}}" (confirm the card summary fits the record in `content/products.yml`, id `kurgo-kibble-carrier`).
3. **PRODUCT** After the paragraph beginning "Two others in the table suit different jobs", add a card for `kurgo-splash-free-wander-bowl` (bestFor: "A bowl that lives in the car"; use the existing record wording: 24 oz, food-grade silicone, top-rack dishwasher safe per the maker, wedge shape that lays flat on a seat). Add both new ids to `relatedProducts`.
4. **TEXT** In the Gunner paragraph, append: "Skip it if you need to know the capacity before you order; the page does not state one." Keep the existing water-test advice.
5. **TEXT** Delete the sentence "The maker says it is top-rack dishwasher safe, but in a rental we would still wash it by hand (see the kitchen section below)." from the Kurgo Collaps paragraph.
6. **TEXT** In "How sure we are", replace the second bullet with: "**What most people report:** nothing here rests on owner reports or surveys." Add to the third bullet: "the single-drink sizing reading".
7. **TEXT** In "What we could not confirm" delete the rows "Dishwasher status of the Kibble Carrier and Ruffwear" and "Prices and ratings".
8. **STRUCTURE** Reorder the spec table columns to Product | Capacity or size as stated | Cleaning as stated | Materials as the maker describes them so the cleaning answer is visible on a phone.
9. **TEXT** In the first paragraph after the H1 shorten to: "You are loading the car, the kibble is in a half-open bag, and the rental may be a cabin where food storage is a safety rule. This guide covers what to pack to feed and water a dog away from home, with each product's capacity, materials and cleaning taken from the maker's own page, read on 2026-11-18." (removes the "heavy one from your kitchen" aside that never pays off).
10. **SEO** In the intro or the water section, add the phrase "dog travel water bowl" once in the opening paragraph (for example "...what to pack in a dog travel water bowl, bottle and food container...") because the primary keyword is not in the H1 or first paragraph. Add the FAQ "What size travel bowl does my dog need?" with the answer: "No source we read gives a bowl size per dog. Makers state capacity (Kurgo 24 oz, Ruffwear 4.2 cups / 1 L); compare that with how much your dog drinks at a stop, and carry water from home."
11. **SEO** Add the FAQ "Which collapsible dog bowl is best for travel?" with the answer: "We do not rank them. The maker pages list Kurgo Collaps A Bowl at 24 oz, collapsing under 1 inch, and Ruffwear Quencher at 4.2 cups with a waterproof lining; the table in this guide shows what each maker states and what it leaves out."
12. **STRUCTURE** After the new Kibble Carrier and Splash Free Wander cards, check that the "Gear for this trip" block at the foot of the page shows all six cards without crowding; if it does not, keep the original four.

## Questions for the owner
- Do you want the Gunner bowl to stay a featured pick given the page says its capacity is unknown, or should the Kurgo Splash Free Wander replace it?
- Is a card for each of the eight tabulated products acceptable, or do you want the Springland bottles to stay table-only?
