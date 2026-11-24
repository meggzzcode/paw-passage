# Review (round 5): Dog Travel Bowls and Food Storage: What to Pack First (dog-travel-bowls-and-food-storage)
Verdict: SHIP (every r4 text fix is on the rendered page; what is left is polish, not a blocker)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 5 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(Sum 36 / 4 = 9.0. No criterion below 4. This is exactly on the gate, so the remaining issues below should not be ignored.)

Evidence: RUBRIC, r4 and FIX4 read; frozen build http://localhost:4175/guides/dog-travel-bowls-and-food-storage rendered in Playwright Chromium at 1280 and 390.
Head: title "Dog Travel Bowls and Food Storage: What to Pack" (47 chars); meta description 154 chars with "collapsible dog bowl for travel" and "Nine products compared"; canonical, og:image and three JSON-LD blocks present. 31 Amazon links, 0 missing rel sponsored nofollow noopener. scrollWidth equals viewport at 1280 and 390 (no page overflow). No prices, ratings, stock or urgency; "Check the current price on the listing" is a pointer, not a claim.

## Round-4 issues: status
1. Long dek / answer on screen two: FIXED. Dek is now one sentence of about 28 words; at 390 px the hero starts at 634 px (was about 720) and the answer line follows it. Still not above the hero on a phone, but it is on the first screen and a half.
2. Three linked products without a card: PARTLY FIXED. The table intro now says "Six of the nine products have a pick card above or below; the other three (Kurgo Splash Free Wander and the two Springland bottles) are linked in the text and table only." Honest, but the buyer still has no button for the car bowl or the bottle-bowl combo. The owner question on the six-card cap is unanswered.
3. Food cards after FDA text: FIXED. "Short on time? The Kibble Carrier, Vittles Vault and IRIS picks are just below the FDA summary." sits at the top of the dry-food H2 and the FDA advice is a four-item list.
4. Quencher "Medium, one size": FIXED. The table row reads "Ruffwear Quencher (Medium)".
5. Table scroll on phone: NOT FIXED (declared skipped). Both tables are 544 px inside a 350 px wrapper; first column is not sticky (position static). A swipe hint is present.

## Remaining issues (most important first)
1. Where: table intro "Six of the nine products have a pick card"; the Kurgo Splash Free Wander and Springland sentences. What: three products have links but no skip-it or who-for line and no card button, so the "nine products compared" promise is only partly buyer-ready. Fix: if the six-card cap is a data-model limit, add one who-for and one skip-it sentence to each of the three prose mentions; if it is policy only, add a Splash Free Wander card.
2. Where: the two maker tables at 390 px. What: 544 px content in a 350 px wrapper, first column not sticky, so the product name scrolls away while the reader reads cleaning and materials. Fix: template CSS, make the first column sticky (position: sticky; left: 0; background) below 640 px.
3. Where: the 390 px first screen. What: the hero image starts at 634 px, below the dek, byline row and three share buttons; the "Pack one flat bowl" line is just under it. Fix: hide Print and Copy link on phones or put the share row after the hero.
4. Where: SEO. What: title tag omits "collapsible" and "dog travel bowl" as an exact phrase is only half there; no long-tail section for "do dogs need a travel bowl for flights" or "how to store dog food in a car". Fix: add two FAQ entries on those questions, sourced or marked as our advice.

## What works well
- Answer-first opening with exact capacities (24 oz, 5 lbs, 6 cups) marked "per the maker", then the first card right after a short checklist.
- Honest specifics: "What we could not confirm", "How sure we are", the Gunner capacity gap, and the explicit card-coverage sentence tell the buyer what to test.
- Bear-country section separates airtight lid from bear resistance, with a paste-ready host message; food cards sit under a short-on-time pointer.

## Buyer walkthrough
1. Lands from "dog travel bowl"; reads the dek and the three-item list.
2. Hits the Collaps card with a clear Amazon button and a Details and specs link.
3. Reads Ruffwear and Gunner; wants a car bowl and gets Splash Free Wander as a sentence only.
4. Uses the short-on-time pointer to reach the food cards, then bear country and the rental kitchen.
5. Friction: three products without buttons, tables need a sideways swipe on a phone.

## Mobile notes
- No page-level overflow (390 of 390); spec cards stack cleanly.
- Hero starts at 634 px; share row still sits above it.
- Tables scroll inside the wrapper (544 vs 350) with a hint; no sticky first column.

## Specific edits to make
1. PRODUCT: per remaining issue 1.
2. STRUCTURE: sticky first column on the maker tables below 640 px.
3. STRUCTURE: move or trim the share row on phones.
4. SEO: add two long-tail FAQ entries (flights; car food storage).

Questions for the owner: is the six-card cap a policy or a data-model limit?
