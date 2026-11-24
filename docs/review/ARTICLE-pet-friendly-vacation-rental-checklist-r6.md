# Review r6: Pet-Friendly Vacation Rental Checklist: What to Check Before You Book (pet-friendly-vacation-rental-checklist)
Verdict: FIX FIRST (strong rewrite; the citation component and a few leftovers keep it just under the gate)
Overall: 8.8 / 10 (FAIL)
Editorial score (1-10): 8.0 (reader appeal 7, formatting 8, readability 8, utility 9, commercial integration 8)

Scores (1 to 5): Answer clarity 5 | Reader flow 5 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 4 = 35/40. No criterion below 4, but total is under 36.

Evidence run: Playwright Chromium at 390 and 1280 against localhost:4176. About 2,000 rendered words (was ~2,260 / 3,100 incl. data; -35% source).

## Checks
1. Rubric: see scores above.
2. Editorial 8.0, meets the owner target of 8 but only just; appeal is held down by residual meta text ("How sure we are", "unknown").
3. 20-second answer: yes. Dek says a badge says little and promises eight checks; the first paragraph gives the stake, then the 8-item list sits one scroll down. Dek and paragraph do not repeat each other (dek = problem, paragraph = what to do). The 45-word first sentence from the old scorecard is gone.
4. Facts lost by cuts (nothing safety-critical): the pointer to "rentals with no dog weight limit" (two managers that state none) after the weight-limit sentence; "Check the manager's page again before you book, as fees change" (the as-of date remains but the re-check instruction is gone); "skip it if the host provides a crate your dog fits" on the iCrate; the old "What to buy first" priority order (crate, bed, gate, pen last, pen only with written permission) is replaced by one tie-break line, so the "pen last" ordering is now only implied; the deposit-refund Vrbo source URL changed (fine). The "Everything below is detail..." meta line and the duplicate buy section are rightly gone.
5. Citations: markers (#src-n) jump to the right Sources entry on both viewports, the Sources details opens on hash and on click, the back-link returns to #cite-n-m, Tab then Enter works, max 1 adjacent marker, 0 markers in tables (page has no tables). Defects below.
6. Affiliate: one top notice, Amazon sentence present, 2 cards each with "Affiliate link · We may earn a commission if you buy." under the button, all 6 Amazon links rel="sponsored nofollow noopener", no "check the current price" text. But two products (North States gate, MidWest pen) are only inline text links with no button or label.
7. Tables: none on this page; no page overflow (scrollWidth 390 = 390).
8. Head: title "Pet-Friendly Vacation Rental Checklist | Paws & Passage" 55 chars; meta 155 chars (at the limit); all 31 internal links return 200.

## Issues
1. Where: every superscript marker (e.g. the "1" after "instead of trusting the pet-friendly filter"). What: tap target is 6 to 14 px wide by 15 px high at 390 px, far below a usable touch size, and the old scorecard asked for this to be enlarged. Fix: give `.cite a` min 24x24 px hit area via padding with negative margin, or `::after` inset -8px.
2. Where: back-link "back to text" in the Sources list. What: after returning, the marker lands at viewport top 0 while the sticky header is 65 px tall, so the marker sits under the header and the reader cannot see where they are. Fix: `scroll-margin-top: 90px` on `[id^="cite-"]` (and on `[id^="src-"]`).
3. Where: body text such as "Vrbo's house-rules guidance lets hosts..." and "AVMA advises calling your vet...". What: publisher is named in prose but is not a link; the style guide section 7 says name the publisher as an inline link and use a marker only where no publisher is named. Only the superscript links to the source. Fix: link the publisher name inline and drop the marker where it duplicates, or document that marker is the only link.
4. Where: "How sure we are" (and its "unknown until the host confirms them"). What: scorecard asked for this to be cut to one line; it is still a section with its own TOC row, and it repeats the Sources intro and the "researched not tested" stance. Fix: fold into one sentence under the sources box or delete; keep only the "38-manager convenience sample" caveat next to the weight-limit sentence where it matters.
5. Where: gate and pen paragraph under "What to buy for the lines you flagged" (starts "A closed room or a deck with no fence."). What: two products get only inline sponsored links with no card, button or affiliate label, while the two cards above do; inconsistent and the per-button label rule is not met for these links. Fix: either add one-line cards or add a small "(affiliate link)" after the link, or point to /gear/pens-and-gates and the pen guide without Amazon links here.
6. Where: Sources numbering. What: markers appear in order 1,2,3,4,7,5,6,8,9,11,10 so the list is not in reading order. Fix: number by first appearance (the Vrbo cancellation and the AVMA sources swap, and the gate and pen sources swap).
7. Where: dek vs FAQ last answer "What should a pet-friendly vacation rental checklist include?". What: restates the eight checks a third time (list, FAQ, and opening). Fix: shorten to one sentence pointing to the list, or drop.

## What works well
- Opening promises and delivers: eight checks, stop at first unanswered line; one-screen scan.
- Commercial restraint: "Most stays need none of this. Buy only for a line you flagged" and each buy item tied to a specific host rule.
- The "one message to send" block and the tie-break line are high-utility and screenshot-worthy.
