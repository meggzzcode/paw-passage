# Review (round 7): How Much a Dog Really Costs on a Vacation Rental (what-a-dog-really-costs-on-a-vacation-rental)
Verdict: FIX FIRST. The visible r6 defects (empty column, marker stacks, unsupported Shammy card) are gone, but the opening is unchanged, a 2-row table adds nothing, the dataset table is repeated in prose, and the doormat is still a weak fit.
Overall: 8.5 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 5 (sum 34 / 4 = 8.5; no criterion below 4, but under 9.0)
Editorial score (1-10): reader appeal 7 | formatting 7 | readability 7 | utility 8 | commercial integration 7 = 7.2 (owner target 8: not met)

Evidence: source content/guides/what-a-dog-really-costs-on-a-vacation-rental.md; rendered at 390 and 1280 from localhost:4177; FIX6 note; citations, links, head and rel checked by script; tables inspected in screenshots.

## r6 issues, one by one
1. Empty "Source" column: FIXED (2-column table now).
2. "Sources for this table" 4-5 marker stacks: FIXED in form (max stack 1, none in cells), but replaced by a paragraph of publisher sentences ("Big Bear states its fee on its pet information page [8], and Tahoe on its reservation page [9]...") that reads like a source list and restates the table. Numbering: markers run 3,4,3,5...14,13,3 because entries 1 and 2 are inline Airbnb links without superscripts; first visible marker is 3, so "from 1" is only true if inline links count. The back-links for 1 and 2 work.
3. Opening sentence: NOT FIXED. It is still a 60-word stack of three ranges plus a sample disclaimer. FIX6 only removed "three charging nothing".
4. Gear block: PARTLY. Shammy card and unsupported sentence removed; doormat now has a sourced sentence, a skip-it line and a card directly under the bullet. It is still the only product on a bill-comparison page and does not change any figure; the card sits inside a bullet list so the next bullet resumes after it.
5. Four-column quote table: NOT FIXED. It is 368 px in a 350 px scroller at 390 (about 18 px of Rental C clipped, swipe hint shown, correctly only on this table). The second-dog sentence still follows it; the Georgia example is now one line in a bullet. Accepted as readable, but against the three-column limit.
6. "Twists" paragraph: FIXED (three bullets). One bullet ("Tahoe's '$75 plus tax per pet' means its pet line is more than $75.") is trivial and repeats the table row.
7. Three "Airbnb" anchors: FIXED ("Airbnb's pet-fee page", "Airbnb's pricing page").
8. Marker hit areas 14 x 15 px: NOT FIXED (13 x 17 px). Swipe hint only on overflowing tables: FIXED (appears once, at 390 only).

## Checks
- 20-second answer: partly, as in r6; opening is dense.
- Repetition: "compare the total" is stated in the opening, the pile list, FAQ, step 3 and Next step. Table 1 (Big Bear, Tahoe, AMI, Resort Realty) is re-listed with citations in the next paragraph, and Rosemary Beach and Twiddy are added there. Tahoe's $75 appears in the table, a bullet and a second bullet. Cabin Rentals of Georgia's fees appear here and in the sibling guide.
- Tables necessary and readable: pet-fee examples table is useful but duplicated; "The rest of the bill" is 2 data rows (Service fee, Taxes) and is followed by a prose paragraph restating it, so it can be two sentences; the three-quote table is the page's best asset and is readable (first column sticky, scroll shadow).
- Accuracy: totals check out (A 1,300; B 1,250; C 1,300; cash C 1,550; Georgia 250 + 75 = 325). "The ranking can flip when the dog count changes" is overstated: with a second dog A and C stop tying, but B stays cheapest; it is a tie-break, not a flip.
- Citations: jump lands 446-456 px from top, details opens, back-link returns (88 px); none in tables; stack max 1.
- Affiliate: one top notice with the Amazon sentence and "How we earn money"; Vrbo and both Amazon links rel "sponsored nofollow noopener"; button order See it at Amazon, Details and specs; no per-card label; no "Check the current price".
- Layout: no page overflow (390 and 1280); 11,382 px tall at 390.
- Head: title tag 58 chars, meta 148 chars. Page shows "7 min read" while front matter says readingMinutes 6 (rendered value is computed; harmless).
- Links: all distinct internal links 200 (/data/pet-policies, /gear/rental-cleanup, /tools/..., sibling guides).
- Console: no errors.

## Issues (most important first)
1. Where: opening ("In the 38 managers whose pet pages we read..."). What: three ranges and a disclaimer in one sentence before the point. Fix: "A dog's pet fee is one line of the bill: nightly fees ran $20 to $50 and flat fees $50 to $400 in our 38-manager sample, and cleaning, deposits, service fees and taxes come on top. Compare the total for your dates."
2. Where: "Big Bear states its fee on its pet information page" paragraph. What: restates the table and reads as a source list. Fix: add Rosemary Beach and Twiddy as table rows, drop the paragraph, and keep one marker per claim in a short sentence.
3. Where: "The rest of the bill" table. What: two rows. Fix: replace with one sentence: "Airbnb's service fee depends on the listing and taxes may not show until checkout; Vrbo's displayed price includes the service fee and adds taxes at checkout."
4. Where: "Rental B, the 'no pet fee' one". What: "The ranking can flip" is overstated. Fix: "A and C stop tying: with two dogs, A rises to $1,500 while C stays at $1,300."
5. Where: doormat sentence and card. What: weak fit for a cost page; card interrupts a bullet list. Fix: move the card after the list, or drop the product and keep the checklist link.
6. Where: superscript markers. What: 13 x 17 px targets. Fix: pad to 24 px.
7. Where: "Tahoe's '$75 plus tax per pet' means". What: trivial repeat. Fix: delete.

## What works well
- The four-pile frame (definite, refundable, contingent, outside the bill) is original and usable.
- The three-quote table shows why a "no pet fee" rental can still need more cash up front.
- "What we could not confirm" is short and specific.

## Buyer walkthrough
Reader learns the range, sorts costs into piles, compares platforms, runs the six-step method, and gets one Vrbo link at the end. The doormat appears mid-page as an aside. No dead end.

## Mobile notes
- No overflow; only the 4-column table scrolls (18 px) with a hint; others fit.
- Markers small; card and notice render cleanly.
- First screen: title, dek, notice, TOC, then the dense opening.

## Specific edits
1. TEXT: rewrite opening (issue 1).
2. STRUCTURE: extend table, drop source-list paragraph (issue 2).
3. STRUCTURE: collapse the 2-row table (issue 3).
4. TEXT: correct "ranking can flip" (issue 4).
5. PRODUCT: relocate or drop the doormat (issue 5).
6. STRUCTURE: bigger marker targets; delete the Tahoe repeat bullet.

## Questions for the owner
Keep the doormat on a cost page at all? Value to the reader is low; the style guide says recommend nothing when nothing fits (the earlier-round guide-related-products rule requires one earning product, so that is the owner's call).
