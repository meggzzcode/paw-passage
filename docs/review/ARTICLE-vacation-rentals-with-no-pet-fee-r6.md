# Review (round 6): Vacation Rentals With No Pet Fee: The 3 Managers We Found (vacation-rentals-with-no-pet-fee)
Verdict: FIX FIRST. The rewrite is a clear gain (3,959 to 2,870 words, 19 sources, sharp opening, honest scope), but marker numbering is out of order, tables are followed by 4-marker stacks, and the one product card sits at the very end, far from its mention.
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 5 (sum 35 / 4 = 8.75, rounded 8.8; no criterion below 4, but under 9.0)
Editorial score (1-10): reader appeal 8 | formatting 7 | readability 8 | utility 9 | commercial integration 7 = 7.8 (target 8: just under)

Evidence: source content/guides/vacation-rentals-with-no-pet-fee.md vs git show b0f371a~12 version; rendered at 390 and 1280 from localhost:4176 with Playwright Chromium; scorecard entry (old 6.4, STRUCTURAL EDIT, recs: keep three manager sections, delete contrast table, cut gear to doormat, retitle "The 3 Managers We Found": all done except the contrast table, which was cut to 4 rows rather than deleted).

## Checks
1. Rubric: see scores. 
2. Editorial: above. Old scorecard 6.4 became 7.8.
3. 20-second answer: yes. First paragraph ("So what is the catch? ... 'no pet fee' describes one line of the bill") answers the catch in two sentences, and the dek gives 3 of 38. Short answer then lists the three names. Dek and paragraph 1 are not repetitive, but paragraph 1 and the first Short-answer bullet both say "three managers" and name Sliding Rock/Hapey/Twiddy, and the "Which fits" bullet re-states place names that are the H3s one screen later. Title "The 3 Managers We Found": accurate (3 of 38 stated $0) and more appealing than "What Managers Say"; mild risk that "found" reads as a market-wide search, but the dek and meta ("3 of 38 managers we read") correct that. Keep.
4. Material lost by cuts (all minor): Airbnb detail that guests state 0 to 5 pets and that the pet fee covers expected cleaning, not damage; Vrbo "mandatory fees must be shown upfront" and "fee changes apply only to future bookings"; Sliding Rock line "pet deposits... not stated" survives, but "No pet fee is the one line that is clear" went; the "Vrbo cannot filter for no pet fee" row in the unconfirmed table; the contrast rows for Tahoe Getaways, Hearthside, My Vacation Haven and Vacasa; the link to the weight-limit guide (vacation-rentals-with-no-dog-weight-limit) from the Hapey no-weight-limit sentence and the closing step; the crate (Hapey recommends one) and Kurgo bed picks. Dropped sources: Tahoe Getaways, Hearthside, My Vacation Haven, Vacasa, MidWest iCrate, Kurgo. None supports a claim still on the page (the "22 state a charge / 13 no amount" counts come from the dataset, not those pages).
5. Citation system: works. Markers are #src-n; clicking opens the closed details and lands on the entry (checked at 390: target at 446 px from top of 844); the back-link returns to the marker (cite-n-m, lands at top 0); direct #src-5 opens the details; keyboard Enter on a focused marker works and has a 2 px solid focus outline. No stacks inside prose. Defects: (a) numbering is not in reading order: 18 appears before 8, 16 before 15, and 13/14/16/15/17/19 follow (readers see "...7, 18, 8, 9..."); (b) "Sources for this table: 8, 9, 10, 11" is a four-marker stack, against the guide's own "never more than two" rule, rendered as tiny comma-separated superscripts; (c) marker hit area is 9 x 15 px at 11.6 px type, too small for touch; (d) src-12 (Airbnb search help) is a list entry whose marker was replaced by an inline link, so the list order and the page differ; (e) markers sit after a visible space ("amount ²"), so they float away from the quote.
6. Affiliate: one top notice with the Amazon sentence and "How we earn money" link; per-button label "Affiliate link · We may earn a commission if you buy." under See it at Amazon; Vrbo link is an inline text link with no label next to it (the notice at top covers it); no "Check the current price" text. The doormat inline text link and button are both sponsored nofollow noopener. OK.
7. Tables at 390: three tables, each 349 px in a 350 px scroller, so no overflow and no scroll needed, yet each still shows a "Swipe sideways to see all columns" hint that is untrue. Cell wrapping is tall in the Manager table (Rosemary Beach name wraps to 4 lines).
8. Head: title tag 51 chars, meta 150 chars, both in range. All internal links 200. Both Amazon links rel "sponsored nofollow noopener", Vrbo too.

## Issues (most important first)
1. Where: citation numbers across the page ("...[7], [18], [8]..."). What: numbers are not sequential in reading order, so a reader sees 18 mid-page. Fix: renumber markers in order of first appearance (A Blue Ridge becomes 8, then shift), or move the "$20 a night" figure into the table source line.
2. Where: "Sources for this table: 8, 9, 10, 11". What: stack of four markers, tiny and comma separated, against the style guide. Fix: name the publishers inline in the table's first column as links (Big Bear Vacations, Rosemary Beach...) and drop the stack line, or cite once per row in a caption sentence with at most two markers.
3. Where: "Gear for this trip" card at the end, after FAQ, Sources and What next. What: the doormat is argued in "Keeping a fee-free stay fee-free" but the button is about 3 screens below the last section; the paragraph links to /gear/rental-cleanup, not the product card. Fix: place the card (pick block) directly after that paragraph, or point the inline name at the card anchor.
4. Where: "Swipe sideways to see all columns" above all three tables. What: the tables fit at 390 so the hint is wrong. Fix: show the hint only when the scroller overflows, or remove it.
5. Where: opening paragraph vs "The short answer" bullet 1 and 2. What: names and the 3-of-38 figure are said twice before the first H3, and "(a convenience sample, read 2026-11-18)" is repeated in the bullet and again in "What we could not confirm". Fix: make bullet 1 only the count ("Twenty-two charge, 13 give no amount") and delete the "Which fits" bullet; it duplicates the three H3s.
6. Where: marker styling. What: 9 x 15 px targets. Fix: pad the anchor to at least 24 x 24 px via padding and negative margin.
7. Where: removed links. What: the weight-limit guide is no longer reachable from this page even though Hapey and Sliding Rock sentences say "no weight limits". Fix: add one link in the Next step line.

## What works well
- The opening answers the "catch" in two sentences and the title now matches the page ("3 of 38").
- The three manager sections quote exact wording and state what each page does not say (Hapey's two pages disagreeing on booking route is the best original finding).
- The hypothetical total table is labelled as made up and shows the counter-intuitive result (fee home $40 cheaper).

## Buyer walkthrough
Reader lands, learns in the first paragraph that fee-free is rare and incomplete, reads three managers, compares totals, uses the Vrbo link in the platforms section, and gets a six-question host message. The only product (doormat) is optional and honestly caveated; friction is that its button is at the page bottom.

## Mobile notes
- No horizontal page overflow at 390 (scrollWidth 390); page is 12,962 px tall, down from about 19,000.
- Tables fit but show a swipe hint; the Manager table's first column wraps to 4 lines.
- Superscripts are tiny; the 4-marker table line is hard to tap.

## Specific edits
1. STRUCTURE: renumber sources in first-appearance order (move or reorder entries 18 and 13-17).
2. STRUCTURE: replace "Sources for this table: ..." with inline publisher links in the first column.
3. PRODUCT: move the doormat pick block under "Keeping a fee-free stay fee-free".
4. TEXT: delete the "Which fits:" bullet; keep count and the fix.
5. STRUCTURE: show the swipe hint only on overflowing tables; enlarge marker targets.
6. TEXT: add the weight-limit guide link to "Next step".

## Questions for the owner
None.
