# Review (round 4): How Much a Dog Really Costs on a Vacation Rental (what-a-dog-really-costs-on-a-vacation-rental)
Verdict: SHIP (narrowly). The structure problems from r3 are fixed (gear now sits before the trust block, "compare quotes" is consistent, one opener, towel folded into the mat paragraph). What remains is cosmetic and a small gear-placement oddity: the hero is still a travel image, and the towel card now lives alone under the Sources block.
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 5 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5  (sum 36 / 4 = 9.0)

Rendered 2026-11-24 at localhost:4174, 1280 and 390. Head: title "How Much a Dog Costs on a Vacation Rental | Paws & Passage", meta description 147 chars (opens with the question, carries the $20 to $50 figure and a CTA verb), canonical correct, og:image /share/<slug>.jpg. Pin CSV row 24 matches the H1 and the new description. Links: 7 Amazon links, all rel sponsored nofollow noopener; the one affiliate Vrbo link (Next step) is sponsored nofollow noopener; Vrbo/Airbnb help links and manager links are plain noopener (correct, non-affiliate); every internal link returns 200. No product prices, ratings or stock claims; hypothetical table labelled "invented, round, and illustrative". Arithmetic re-checked and correct (A 1,300, B 1,250, C 1,300 / 1,550 cash; second dog A 1,500; Cabin Rentals 250+75 = 325). Mobile: scrollWidth 390, no overflowing element outside table wrappers. Nine FAQ accordions present.

## Round-3 issues: fixed or not
1. Hero says travel, not cost: NOT FIXED. The hero (guide-true-cost) is a dachshund on a leash in a hotel lobby with vintage suitcases; the pin and og image carry the same idea. Nothing on it says cost, bill or rental. Owner art decision, still open.
2. Gear block after "How sure we are": FIXED. Order is Charges you avoid, What to pack, How sure we are, Next step.
3. "two quotes" vs "three quotes": FIXED (dek, H2, FAQ say "compare quotes").
4. Mat/towel overlap card: FIXED in text (towel is a linked sentence in the mat paragraph; "overlap" sentence gone). But see issue 1 below.
5. Double opener / "tables live elsewhere": FIXED; the $0 versus $40 contrast is merged into the first paragraph and the pet fees guide link sits in the pet fee line section.

## Top remaining issues (most important first)
1. Where: "Gear for this trip" block under "Sources and how we researched this" (Soggy Doggy Super Shammy Towel card). What: the card for the towel was removed from the body, yet it still renders after the Sources list as the only card there, with a second "Some links below are affiliate links" disclosure. It duplicates a product already linked in the "What to pack" prose, sits in a place where nobody is deciding, and makes the page end with one orphan card. Fix: for this guide, suppress the relatedProducts "Gear for this trip" block (or render it before Sources), or add the towel back as a card inside "What to pack" and drop the related block.
2. Where: hero image `guide-true-cost` and its alt ("A small dark dachshund mix on a leash lying on the wooden floor of a hotel lobby..."). What: a hotel lobby with luggage is the wrong promise for a cost article; the pin and og image reuse it. Fix: replace with a dog at a rental door with a phone or printed quote, or a flat-lay of a booking summary with a leash; write new alt text and regenerate the pin. Until then Layout and SEO fit cannot reach 5.
3. Where: "To price real homes the same way, you can start a pet-friendly search on Vrbo". What: the sponsored link is the generic Vrbo affiliate link, and "pet-friendly search" implies a pre-filtered search the link may not deliver. Fix: reword to "you can browse Vrbo and open the full breakdown before you confirm" unless the link is confirmed to land on a pet-filtered search.
4. Where: Kurgo Loft Wander spec chip "M 27x36 in, L 36x48 in open". What: "open" is ambiguous next to "Large rolls to 17 x 9.5 in". Fix: "Open: M 27 x 36, L 36 x 48 in".
5. Where: prose "the Soggy Doggy Super Shammy" and "Soggy Doggy Microfiber Doormat" link to Amazon, while the footnote numbers beside them go to the maker. What: fine, but the towel prose link and its card button are the only towel purchase paths and there is no skip-if line for the towel. Fix: add one clause, for example "Skip it if the mat already handles your dog's wet paws".

## What works well
- The three-pile model plus the hypothetical three-quote table with the second-dog flip is a real decision tool; the range ($20 to $50 nightly, 38 managers) is in the dek, first paragraph and meta description.
- Sourcing is exact: each manager figure has a footnote, the sample is called a convenience sample, and "we give no figures" for fuel, gear and boarding is stated; the "How sure we are" block with the open-question table is honest and useful.
- Gear is now introduced by the problem (mud, wet dog, sofa hair), with skip conditions, a clear "What to buy first" line, a link to the /gear/rental-cleanup hub, and no prices.

## Buyer walkthrough
1. Lands on the cost question; the dek and first paragraph give the range and the "compare the total" rule.
2. Reads the pile model, dataset table and hypothetical, then the numbered "How to compare quotes".
3. Reads "What to pack", clicks the mat or bed card (Amazon, sponsored), or uses the spec page.
4. Closes with the checklist/Vrbo link in Next step.
5. Friction: the leftover towel card after Sources; hero image does not say cost.

## Mobile notes
- No page overflow at 390; tables sit in scroll wrappers.
- Cards stack and buttons are full width; breadcrumb wraps to two lines but is readable.
- Hero takes the screen after the dek; the first paragraph is below the fold on a phone, with the dek still delivering the range.

## Specific edits to make
1. STRUCTURE: do not render the trailing "Gear for this trip" block for this guide, or move it above Sources.
2. STRUCTURE: replace the hero and regenerate the pin with a cost-themed image; update alt text.
3. TEXT: "To price real homes the same way, you can browse Vrbo and read the full breakdown before you confirm."
4. TEXT: Loft Wander chip to "Open: M 27 x 36, L 36 x 48 in".
5. TEXT: add a skip line for the towel in the mat paragraph.

Questions for the owner: is a cost-themed hero available, and does the Vrbo affiliate link open a pet-filtered search?
