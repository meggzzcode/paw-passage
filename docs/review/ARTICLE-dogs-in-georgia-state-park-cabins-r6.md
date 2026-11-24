# Review r6: Dog Friendly Cabins in Georgia State Parks: Rules, Fee and How to Request (dogs-in-georgia-state-park-cabins)
Verdict: FIX FIRST. Strong, accurate, answer-first page; held below 9.0 by citation ergonomics and a generic gear block.
Overall: 8.8 / 10 (FAIL)
Editorial score: 8.0 / 10 (appeal 8, formatting 8, readability 8, utility 9, commercial integration 7). Target 8: met, only just.
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5 = 35/40. No criterion below 4.

## Evidence (390 and 1280, frozen build localhost:4176)
- 20-second answer: dek states the whole answer (2 dogs, $50 per dog, never alone, request first) above the fold at 390; the rules table starts about one screen later. Dek and paragraph 1 overlap a little ("requested before you arrive" / "request it before you arrive"; "never alone" / unattended). Not repetitive enough to fail.
- Cuts (3,127 to 1,888 body words, about 21% on body): lost only low-value items. Material or near-material that vanished: (a) "How is my request recorded, and will I get confirmation?" question; (b) the cleanup-bags step in "What to buy first" (page still says bags are required, but no longer prioritises them); (c) the 38-manager sample count (22 limit two, etc.) and the hypothetical three-night cost comparison ($50 vs $150 + $75) in the state vs private section; (d) the "How sure we are" block. Everything fee, limit, request, unattended, leash, cancellation and trail related survived. (c) is the only one a reader could miss; the table still shows the contrast.
- Citations: 22 markers, 17 sources. Click on a marker lands on #src-n, Sources details opens (also opens on direct load of /#src-3), the back-link returns to #cite-n-1, Tab reaches the first marker in 10 presses, Enter on a focused marker jumps and opens Sources. Max 1 marker adjacent (no stacking). 0 markers in tables; tables are cited by a "Sources for this table" line.
- Affiliate: 3 pick cards, each with "See it at Amazon" (rel sponsored nofollow noopener) and its own "Affiliate link · We may earn a commission if you buy." label; one top notice with the Amazon sentence; no "Check the current price" text.
- Tables: 4 tables at 390, each 350 px wide in a 350 px wrapper (no clipping, no page overflow: scrollWidth 390 = clientWidth), first column sticky, wraps text. Reads fine.
- Head: title 49 chars, meta 148 chars, one H1, canonical present. All 29 internal link targets return 200. Amazon links all rel "sponsored nofollow noopener".

## Issues
1. Where: superscript markers, all 22. What: tap target is about 6 px wide by 15 px high at 390 (11.6 px type). Hard to hit on a phone, where the guide is meant to be read. Fix: pad the marker link (min 24 x 24 px hit area via padding/negative margin, or `::after` inset -8px) without changing the visual size.
2. Where: marker numbering order in text (1,1,1,2,3,4,6,7,7,8,2,1,1,9,5,10,...). What: numbers jump back and forth (6 then 7, then 2, 1, 9, 5). Looks like an error to a reader and implies sources are missing. Fix: number sources by first appearance, or document in the Sources summary that numbers are fixed IDs. Reordering sources in frontmatter to match first use is the simplest.
3. Where: "Sources for this table" under the park table. What: lists [3] and [4] only; the Skidaway/Mistletoe rows come from [2] (cited in the sentence above) and Red Top from [5] (cited only much later). Fix: "Sources for this table: [[2]], [[3]], [[4]], [[5]]".
4. Where: "What to buy for a state park cabin trip", water bottle and Quencher bowl. What: generic bolt-ons for a rules page; Springland bottle and Quencher are both "water for the walk" with a "skip it" line each, so one card could go. The leash is genuinely rule-driven. Fix: keep the leash, merge the two water picks into one ("bottle for short outings, bowl for long hikes") or drop the bottle; add one line on cleanup bags since the rules require them (no product needed).
5. Where: opening. What: dek and paragraph 1 both lead with the unattended/request rules. Fix: make paragraph 1 carry the new fact (no official list of dog cabins, so confirm your exact unit) and drop the unattended clause, which the dek already states and the rules table repeats.
6. Where: page length. What: 14,134 px at 390 even after the cut; "What we could not confirm" table repeats the request/fee/rate points made in the body. Fix: cut that table to the two rows that are new (service animal handling, booking vs check-in) and move them into the request section.

## Anything lost that matters
Nothing critical. See (a) to (d) in Evidence.
