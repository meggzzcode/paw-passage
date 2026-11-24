# Review (round 3): Dog Friendly Cabins in Georgia State Parks: Rules, Fee and How to Request (dogs-in-georgia-state-park-cabins)
Verdict: FIX FIRST (the research and structure are strong; the page has one inbound guide link where the SEO brief requires two, the buy-first idea is said three ways, and two spec-card icons do not match their products)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(Sum 35 / 4 = 8.75, rounded 8.8. No criterion below 4; one point under the gate. The round-2 review scored it 9.0 on a slightly looser read; this read is stricter on the inbound-link rule, which is a written requirement of the SEO brief.)

Basis: source, r2 review, FIX (incl. Round 3), SEO notes read; rendered at http://localhost:4173/guides/dogs-in-georgia-state-park-cabins at 1280 and 390; card crops and the park table crop read.
Head: rendered title "Dog Friendly Cabins in Georgia State Parks: Rules" (48 chars, brand suffix dropped, keyword first, matches SEO primary); description 148 chars, keyword-led ("Georgia state park cottages take 2 dogs at $50 each per stay..."; the "$50" is the park rule, not a product price), CTA verb "See". H1 now "Dog Friendly Cabins in Georgia State Parks: Rules, Fee and How to Request" (four lines at 390, answer in the dek and first paragraph on the first screen). Hero: golden retriever among evergreens; fits parks and dogs, no cabin shown (nit). No page-level sideways scroll (scrollWidth 390). Affiliate links: 3 products, Amazon tag, "sponsored nofollow noopener". All dollar figures are state-park fees or private-manager rules with a read date, not product prices.

## Round-2 issues: verified
1. "cost almost nothing" bag line: FIXED ("clip them to the leash loop").
2. Park table clipped on mobile: PARTLY FIXED. It is now two columns with citations in the cell, but at 390 the second column ("What the official page says about dogs") is still cut off at the wrapper edge (table 544 px in a 350 px wrapper) so the reader must swipe to read the answer column. It is inside the wrapper with the swipe hint, which is allowed, but the answer column is still the one that clips.
3. Long H1: FIXED (shortened).
4. Weak leash pick: FIXED in text ("If your current leash is 6 feet or shorter, you already have this and can skip it") and the card line; still the weakest product tie.
5. "Which parks" ends without a next step: FIXED ("ask for the unit number and the designation in writing").

## Top 5 issues (most important first)
1. Where: whole guide, internal links. What: only one other guide links to this page (how-many-dogs-can-you-bring-to-a-vacation-rental); the SEO brief requires at least two inbound guide links. A state-specific page with one inbound link will be crawled and weighted weakly. Fix: edit 1.
2. Where: "This is the one to buy first if your leash is over 6 feet." plus "### What to buy first" item 1 plus "Add it first if your dog drinks on every stop...". What: the same ordering is given three times (and the instruction is that "buy first" appears once). Fix: edit 2.
3. Where: spec card icons (Ruffwear Knot-a-Leash shows a mountain; the Springland bottle and the Quencher bowl show the same cup icon). What: the leash card does not look like a leash, and two different products share one icon. Fix: edit 3 (products.yml data).
4. Where: chips "Named 22oz bottle" (Springland) and "No strength rating stated" (Knot-a-Leash). What: the first states a non-feature; the second leads buyers with a negative and no positive. Fix: edit 4 (products.yml cardSpecs).
5. Where: park table at 390. What: the answer column clips. Fix: edit 5 (site CSS: narrower min-width for two-column tables) or accept.

## What works well
- Dated, quoted official rules table with the $50-per-dog-per-stay arithmetic ($50 or $100) and a "What we could not confirm" table that names every gap; differentiation against Animal of Things, GoPetFriendly and Explore Georgia is real.
- The request steps, phone hours and a copy-ready message turn a rules page into an action, and "Which to choose" gives the state-vs-private decision in two sentences.
- Gear is framed by the three rules (6-foot leash, cleanup, never unattended) and every pick has a skip line; the bag item correctly has no product.

## Buyer walkthrough
1. Lands on the dek and first paragraph: 2 dogs, $50, request first, never alone.
2. Reads the rules table, the park table and the request steps; sends the message.
3. Compares state vs private cabins; decides.
4. Gear section: leash check, then water, then bags; clicks Amazon from a card or prose name.
5. "Your next step" links Georgia destination, stays, pet fees guide, tool and checklist. Friction: the answer column of the park table needs a swipe on a phone.

## Mobile notes
- First screen: H1 (four lines), dek, meta row; hero image starts at the fold.
- Four tables scroll inside wrappers with the swipe hint; the park table's answer column starts clipped.
- No overlap; cards stack with full-width buttons.

## Specific edits to make
1. STRUCTURE/SEO: add a contextual link to /guides/dogs-in-georgia-state-park-cabins in two other guides, for example in vacation-rentals-with-no-pet-fee ("State parks charge a flat fee: see [Georgia state park cabins and their $50 per dog fee](/guides/dogs-in-georgia-state-park-cabins).") and can-you-leave-a-dog-alone-in-a-vacation-rental (in "What do hosts actually write?": "For how a state park words the same rule, see [dogs in Georgia state park cabins](/guides/dogs-in-georgia-state-park-cabins).").
2. TEXT: delete "This is the one to buy first if your leash is over 6 feet." from the leash paragraph, and in the Springland paragraph delete "Add it first if your dog drinks on every stop and you want one hand free for the leash." (the "What to buy first" list carries the order).
3. PRODUCT: in content/products.yml give ruffwear-knot-a-leash a leash icon and make the bottle and bowl icons differ.
4. PRODUCT: cardSpecs: Springland chip 1 "Named 22oz bottle" to "Attached bowl, one-hand use"; Knot-a-Leash chip 3 "No strength rating stated" to "Accessory loop for bags".
5. STRUCTURE (optional): lower the table min-width so two-column tables fit 390 px without sideways swipe.
