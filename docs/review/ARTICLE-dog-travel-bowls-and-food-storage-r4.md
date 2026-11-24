# Review (round 4): Dog Travel Bowls and Food Storage: What to Pack First (dog-travel-bowls-and-food-storage)
Verdict: FIX FIRST (close: every r3 structural issue is fixed on the rendered page; what is left is polish on the first mobile screen, three products without cards, and one card name)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 5 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(Sum 35 / 4 = 8.75, shown as 8.8. No criterion below 4; the overall is under the 9.0 gate by one point.)

Evidence: r3, FIX notes and rubric read; frozen build http://localhost:4174/guides/dog-travel-bowls-and-food-storage rendered in Playwright Chromium at 1280 and 390; full text, head, links and screenshots read.
Head: title "Dog Travel Bowls and Food Storage: What to Pack" (47); meta description 154 chars, contains "collapsible dog bowl for travel" and "Nine products compared". H1 "Dog Travel Bowls and Food Storage: What to Pack First". All 29 Amazon links (cards, prose, table) carry rel sponsored nofollow noopener; none unmarked. Every internal link returned 2xx or 3xx (no broken links). No prices, ratings, stock or urgency. Page scrollWidth equals viewport at 1280 and 390 (no sideways page scroll). Six spec cards render at 308 px wide on phone with an icon. Disclosure sits under the byline, above the first link.

## Round-3 issues: status
1. Opening led with a scene: FIXED. The page now opens "Pack one flat bowl and a food container sized to your trip." then the three-item "What to pack" list.
2. Vittles card name doubled: FIXED. The card reads brand "VITTLES VAULT" and name "Travel-Tainer Portable Food Storage Container"; prose and table say "Vittles Vault Travel-Tainer". The brand and the name no longer repeat. (The record still says brand "Vittles Vault" while the source line says Petmate; harmless.)
3. First pick card sat behind the 9-row table: FIXED. "Which dog travel bowl to pack" is now an H2 directly after the checklist; the Collaps card is the first card, the table follows.
4. IRIS citation order: FIXED. Table citations read 6, 7, 8, 9, 10, 11, 12, 13, 15 in order; 14 (West Virginia) appears in the bear section.
5. Nine products but six cards: PARTLY FIXED. The dek now says "nine products ... (six with a pick card)", which is honest, but Splash Free Wander and the two Springland bottles still have no card.

## Top issues (most important first)
1. Where: dek "Which dog travel bowl and food container to pack, with capacity..." and the 390 px first screen. What is wrong: the dek is a six-line paragraph on a phone; with the byline row and share buttons the hero starts at about 720 px, so the answer ("Pack one flat bowl...") is on screen two. Desktop is fine. Fix: edit 1.
2. Where: "Kurgo's Splash Free Wander also holds 24 oz" and "For a bottle with the bowl attached, the Springland 22oz Classic". What is wrong: three linked products have no card and no skip-it line; a buyer who wants the car bowl or a bottle-bowl combo has no pick button for them, and the Springland pair appears only in a single sentence. Fix: edit 2.
3. Where: "Keeping dry food fresh in the car and the rental", then the Kibble Carrier, Vittles and IRIS cards. What is wrong: the three food cards sit after the FDA explanation, so a buyer who skipped to "what do I buy for food?" meets four paragraphs of regulation first; the "What to buy first" close is the only food shortcut. Fix: edit 3.
4. Where: table row "Ruffwear Quencher (Medium, one size) 11". What is wrong: "Medium, one size" reads as a contradiction; the card says "Medium: 4.2 cups". Fix: edit 4.
5. Where: the maker table on a 390 px phone. What is wrong: four columns scroll inside the wrapper, so cleaning and materials need a swipe; the hint is present but the product name column is the only one fully visible. Fix: edit 5.

## What works well
- The opening is now answer-first and the three-line list names the exact capacities (24 oz, 5 lbs, 6 cups) with "per the maker"; the first card arrives right after a short checklist.
- Honesty is specific, not boilerplate: the "What we could not confirm" table, the "How sure we are" block and the Gunner paragraph ("one caption says silicone where the copy says nylon") tell the buyer exactly what to test before ordering.
- The bear-country section separates an airtight lid from bear resistance, quotes the West Virginia agency, and ends in a paste-ready host message; the pick cards each carry who-for and skip-it lines.

## Buyer walkthrough
1. Lands from "dog travel bowl"; reads the answer line and the three-item list.
2. Scans the checklist, hits the Collaps card with a clear "See it at Amazon" button and a "Details and specs" link.
3. Reads Ruffwear and Gunner for a bigger drink or a lidded bowl; wants a car bowl and finds Splash Free Wander only as a sentence.
4. Scrolls past the FDA text to the food cards, then the bear and rental-kitchen sections.
5. Friction: three products without buttons, food cards late, long phone first screen.

## Mobile notes
- No page-level overflow (390 of 390). Spec cards stack cleanly (icon, brand, name, three chips, button) at 308 px wide.
- First phone screen is breadcrumb, H1, a six-line dek, byline and share buttons; the hero starts near the bottom, the answer line is on screen two.
- The two tables scroll inside their wrapper with a hint; the checklist and host-message blocks read well.

## Specific edits to make
1. TEXT: shorten the dek to about 25 words, for example "Which dog travel bowl and food container to pack, with capacity and cleaning for nine products from the makers' own pages, plus what the CDC and FDA say." Move the "(six with a pick card)" note to the table intro.
2. PRODUCT: give Splash Free Wander a card (replace the Gunner card only if the six-card cap requires it; Gunner has no stated capacity and the card already says so), or add one sentence after the Springland line: "We link these three without a card because they are variants of picks above." Use the second only if it is true to the card policy.
3. STRUCTURE: add one sentence at the top of the dry-food H2: "Short on time? The Kibble Carrier, Vittles Vault and IRIS picks are just below the FDA summary." with the FDA summary cut to the four rules in a list.
4. TEXT: in the table change "Ruffwear Quencher (Medium, one size)" to "Ruffwear Quencher (Medium)".
5. STRUCTURE: on the table, make the first column sticky or collapse materials into the cleaning column below 640 px; or move the table below the FAQ and keep the cards as the decision path.

Questions for the owner: is the six-card cap a policy or a limit of the data model? Edit 2 depends on it.
