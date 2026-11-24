# Review (round 4): Dog Hiking Gear for a Cabin Vacation: What to Buy (dog-hiking-gear-for-a-cabin-vacation)
Verdict: SHIP (all five r3 text issues are fixed on the rendered page; what remains is structural polish and a single-brand catalog, none of it blocking)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 5 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 5 | Differentiation 4
(sum 36 / 4 = 9.0; no criterion below 4. This sits exactly on the gate, so the issues below are worth doing but not required.)

Evidence: rubric, SEO brief, r3 review, FIX file (rounds 2 to 4), rendered page at 1280 and 390 (Playwright Chromium against http://localhost:4174). Head: title "Dog Hiking Gear for a Cabin Trip: Buy List | Paws & Passage" = 59 chars, keyword first; meta description 141 chars; canonical correct; og:image /share/dog-hiking-gear-for-a-cabin-vacation.jpg; JSON-LD Organization, Article, BreadcrumbList (no FAQPage, as intended). All 12 Amazon links (5 cards, 5 in the close, 2 inline Knot-a-Leash) carry rel sponsored nofollow noopener; 0 violations. No prices, ratings, stock or urgency; card footer is "Check the current price on the listing before you buy." Page scrollWidth 390 = 390 and 1280 = 1280. Both tables scroll inside their wrapper at 390 (544 px in 350 px). Product links go to the right Amazon dp targets and the right /gear anchors; "Details and specs" for the Beacon and Quencher go to /gear/safety-id-first-aid and /gear/feeding-and-hydration, which is correct for the catalog.

## Round-3 issues: verified on the rendered page
1. Unsupported "most people go wrong" sentence: FIXED. Now "Measure before you order. Ruffwear says ..."
2. Bowl explained twice: FIXED. Prose now gives only the lining, hand-wash and skip-it points; the card carries 5.5 in, 4.2 cups (1 L). "(the maker's wording, no tester named)" is gone from the card.
3. "Test hike first" said three times: FIXED. It now appears in the "What to buy" bullet, once in the close, and the kit item reads "Boots, only after a test hike (see above)". The boots section no longer repeats it. Slightly more than needed (bullet, table row "practiced at the cabin first", kit, close) but each is short and scoped.
4. Beacon and Quencher unlinked in the close: FIXED. "Ruffwear Beacon" and "Ruffwear Quencher" both link to the Amazon listing with correct rel.
5. Web Master icon and pin-row title: NOT changed (template/CSV, out of the article's reach). docs/pinterest-pins.csv row 7 still reads "Dog Hiking Gear for a Cabin Vacation: What to Buy". Minor.

## Top issues (remaining, most important first)
1. **The bowl card still sits inside "Heat, water and paws" with no heading of its own.** Where: "A packable bowl keeps the water stop easy." What: a fifth product card, and the fifth step in the buy-first list, is not findable from the 12-item "On this page" list or by scanning H2s, and it interrupts the heat-safety list that precedes it. Fix: add an H3 "A bowl for the trail" before that paragraph (or move the paragraph and card to after the heat bullet list under such a heading) and keep the card as is.
2. **Section order differs from the buy order, and the meta overpromises slightly.** Where: sections run harness, boots, leash, dusk, but "What to buy first" and the "What to buy" bullet put the leash first; the meta says "each sized from the maker's chart", but only the harness and boots are sized from a chart (the light and bowl are not). Fix: either move "Leash length and type" before the harness section (it is the only universal item) or add a one-line pointer at the top of the harness section ("the leash comes first; see below"); change the meta to "...then a leash, harness, boots and a dusk light, with sizing from the maker's chart where it applies." (keep 130 to 155 chars) and mirror it in the pin row.
3. **Single brand, no named second option for the three gear items.** Where: "All five products below are from Ruffwear." The honest disclosure is there and a plain six-foot leash or a headlamp is offered as an alternative, but the harness and boots have no non-Ruffwear path, so a skeptical buyer has one choice. Fix: in the harness and boots skip lines add one sentence, for example "Any harness with a sturdy top handle and a rib-cage size chart does the same job; use the same girth measurement." (no new product claims, no brand named unless it is in the catalog).
4. **Pin row and generic card icon.** Where: docs/pinterest-pins.csv row 7 title; Web Master card icon is a generic mountain. Fix: set the pin title to "Dog Hiking Gear for a Cabin Trip: Buy List"; icon is template or product data.
5. **Mobile meta row and H1.** Where: top of the page at 390 px. The meta row wraps with a lone "·" and the H1 runs to three lines (template, all guides). Fix: template change only.

## What works well
- Rules before gear with scoped examples ("That is one forest's page", "a Washington example, not a national rule"), plus a four-row "Match the gear to the trail" table that gives the answer before the first H2; the first paragraph names the fixed six-foot leash as the one universal item.
- Every pick has "Who it suits", a skip line, a "what the page does not state" line (no strength rating, no heat limit, no between-sizes rule, no weight) and a sizing instruction; the open-questions table lists specific checks (walk the dog at dusk near the cabin, try the handle on a low step).
- Candid brand statement and a "How sure we are" block that separates cited statements, shared advice and labelled "our reasoning"; the buy-first list is ordered, conditional ("skipping what your trail does not call for") and ends in a concrete next step (measure girth and paws tonight).

## Buyer walkthrough
1. Lands on a hiking dog in an orange harness; the first paragraph says leash first, then harness, boots or light only if the trail calls for them.
2. Reads the "What to buy" bullet and the four-row match table; checks the trail rules section.
3. Reads harness, boots, leash, dusk, each with a card, a skip line and a sizing step.
4. Clicks "See it at Amazon" (sponsored) or "Details and specs"; the ordered close gives the purchase order and links every pick.
5. Friction: the bowl is reached through the heat section and is not in the table of contents; no second brand for harness or boots.

## Mobile notes (390 px)
- No page-level sideways scroll (scrollWidth 390); both tables scroll inside their wrapper with the swipe hint.
- Spec cards stack and show their buttons without clipping; the hero image is in the first screen; H1 is three lines.
- The meta row wraps (lone "·" before "Affiliate links disclosed"), a template issue shared by all guides.

## Specific edits to make (ready to apply)
1. STRUCTURE. Add the H3 "A bowl for the trail" above "A packable bowl keeps the water stop easy." and, if the TOC builds from H2 only, make it an H2 "A bowl for the trail" placed after "Heat, water and paws".
2. TEXT / SEO. Change seoDescription to: "What dog hiking gear a cabin trip needs: trail rules first, then a leash, harness, boots and a dusk light, with sizing from the maker's chart." and mirror it in the pin row; set pin title to "Dog Hiking Gear for a Cabin Trip: Buy List".
3. STRUCTURE. Move "Leash length and type" above "Harness or collar on steep trails", or add to the harness section's first line: "The leash comes first; this section is for steep ground."
4. TEXT. Harness skip line: add "Any harness with a sturdy handle and a girth chart works the same way; measure the same way."

## Questions for the owner
None.
