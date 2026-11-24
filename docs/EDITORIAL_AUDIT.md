# Editorial, reader-experience and trust audit

> Historical audit (before the final editorial pass). Guide counts, word counts, numbered citations and "Check the current price" lines described here no longer apply (`docs/FINAL_EDITORIAL_RELEASE.md`, `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`). <!-- SUPERSEDED-NOTE -->


Date: 2026-11-24. Scope: all 30 published guides (rendered at 390 and 1280 px from a frozen build of `main`), the disclosure and citation systems, and live competitor research. Companion files: `docs/ARTICLE_SCORECARD.md`, `docs/EDITORIAL_STYLE_GUIDE.md`, `docs/DISCLOSURE_AND_TRUST_AUDIT.md`, `docs/EDITORIAL_FIX_PLAN.md`, `docs/COWORK_EDITORIAL_BROWSER_BRIEF.md`. Detailed notes: `docs/editorial/`. Labels: FACT (measured or quoted from a page we read), JUDGMENT (editorial opinion), UNVERIFIED (could not be read). No user testing was done.

## 1. Executive answers
1. **Does it feel like a modern pet-travel publication for 25 to 35 year olds? Not yet.** It reads like a well-sourced research memo. Layout and spec cards are clean and the disclosure and sourcing are better than the competitors we could read, but the voice is cautious and clinical, pages are very long, there are almost no in-body photos, and there is no human face. JUDGMENT.
2. **Would the audience read or skim?** Skim, and leave early. Pages render 2,700 to 4,300 words, 17 to 27 phone screens (16,000 to 27,000 px), for questions the first 300 to 400 words answer. FACT (DOM measurement).
3. **Too long / generic / repetitive / poorly structured** (library mean 6.5 of 10; see the scorecard): worst are how-many-dogs (5.2), keep-a-dog-cool (5.2), no-weight-limit (5.4), two-large-dogs (5.6), bowls (5.8), packing list (6.0), Christmas week (6.0), portable fence (6.2), ramp (6.2). Large-dog rentals and no-weight-limit duplicate each other; two-large-dogs and car-interior re-explain the car-safety guide; portable-fence overlaps fenced-yard.
4. **Numbered sources: yes, visually excessive.** 1,011 hand-typed markers, 11.6 per 1,000 words, 85 stacked, 11 to 64 per page, rendered as 11.6 px digits with a roughly 6x15 px tap target (below the 24x24 WCAG minimum) that open new tabs. About half follow a sentence that already names the publisher. Best replacement: publisher names as inline links, a small superscript only for numeric policy, fee, safety and medical claims, and a collapsible Sources list with read dates and back-links (see section 4).
5. **Too many disclaimers? Yes.** 297 disclaimer-like blocks across the guides (about 10 each), 36% of them one repeated line ("Check the current price on the listing before you buy"), plus 4 footer lines per page. The real compliance gap is the opposite: the affiliate notice is far from the first affiliate link, and buy buttons have no label.
6. **Versus competitors:** on the pages we could read (GoPetFriendly, TripsWithPets, The Points Guy, NBC Select) Paws & Passage wins on sourcing, disclosure wording, review dates and honesty; it loses on voice, photography, a named author, and an "our pick at a glance" box. BringFido, Rover, Dogster, Wirecutter and Lonely Planet blocked automated reads, so they are UNVERIFIED; the Cowork brief covers them.
7. **Standardize:** opening (answer first, 20 to 28 word dek), one short-answer box, section rhythm, citation system, disclosure policy, product-block placement and ending (see the style guide).
8. **Top 10 fixes before listing:** section 5.
9. **Claude vs Cowork:** section 6.
10. **Minimum work to feel polished and buyer-ready:** section 7.

## 2. What the audit found (evidence)
- **Length.** All five scorecard batches recommend cutting 20 to 40% (mostly repeated blocks: short answer, What to buy first, How sure we are, What we could not confirm, Unknowns, Sources). FACT.
- **Voice.** Hedge-heavy ("unknown", "we found no source", "treat it as a lead"), roadmap openings, spec-sheet product cards ("the maker's own claim"), meta commentary ("That is the gap this page fills"). Strong exceptions: the loose-dog first hour, NYE Do-this-first, Georgia request script. JUDGMENT.
- **Trust language.** 6 to 25 statements per page (affiliate banner, header chips, "How sure we are", methodology, "not advice", "haven't stayed at or inspected any property", editorial standards link). One reviewer notes the "haven't inspected any property" line is wrong on the car-gear guides (they do not cover properties). To fix with the disclosure pass.
- **Formatting.** All 12 sampled tables are 544 px wide in a 350 px wrapper (swipe hint shown); the ramp spec table is 721 px. Hero images are weak matches on cost, packing list and large-dog rentals. Mobile byline and breadcrumb show orphaned separators.
- **Affiliate fit.** Natural on checklist, puppy, fenced-yard, car-restraint and cold-gear pages; forced on pool, Airbnb damage, how-many-dogs and large-dog-rentals (gear blocks on policy pages). The same Kurgo bed, iCrate and Soggy Doggy mat repeat across five pages. The only natural commercial link on several pages is the Vrbo search CTA.
- **Compliance.** Amazon's sentence renders correctly wherever an Amazon link appears; all 304 guide affiliate links carry rel="sponsored". See the disclosure audit for the list of defects.

## 3. Competitor comparison (live research, with limits)
Full notes: `docs/editorial/competitors-pet-travel.md`, `docs/editorial/competitors-editorial-commerce.md`.
- **Read:** GoPetFriendly (3 posts; its directory closed Feb 2025), TripsWithPets (4 pages), The Points Guy (3 articles), NBC Select (2 articles), and two Paws & Passage guides for head-to-head. Through a summarising fetch tool, so layout and mobile notes are inferred.
- **Blocked (403) and therefore not reviewed:** BringFido, Rover, Dogster, Wirecutter, Lonely Planet; The Strategist and The Wildest returned nothing usable. UNVERIFIED.
- **What they do better:** a named author with first-hand anecdotes, in-body photos, a boxed quick answer or "our pick" at a glance, one collapsible contents list, one-line stay and policy lists, warmer copy, short "something to note" lines per product.
- **What we do better:** early, clear affiliate disclosure, last-reviewed dates, cited sources, honesty about what was and was not checked, comparison tables. GoPetFriendly has no sources or disclosure; TripsWithPets uses undisclosed tracked Vrbo links.
- **Adapt:** pick chips and fixed spec rows (done), "our pick" summary box, stacked tables on mobile, a changelog line. **Avoid:** unrelated card ads, AI summary boxes, stale dates, live prices, undisclosed partner content.

## 4. Citation system: recommendation
Detail: `docs/editorial/citation-investigation.md` (screenshots in `docs/editorial/img/`). Proposed rule: name the publisher inline; superscript only for fee, policy, safety or medical figures; markers jump to a collapsible Sources list with the read date. Estimated 350 to 450 superscripts after migration (from 1,011), with no source dropped; 2 to 3 days (about 0.5 to 1 day code, 1 to 1.5 days content codemod and spot check), touching Markdown.tsx, the guide route, styles and three tests.

Before and after, using real text (NYE guide):
- Before: "The Petcube GPS Tracker weighs 29 g, and the maker says a paid plan is required for it to operate and lists battery of up to 30 days in power save mode. [[20]](https://petcube.com/tracker/)"
- After: "[Petcube's own page](https://petcube.com/tracker/) says the tracker weighs 29 g, needs a paid plan, and lasts up to 30 days in power-save mode."
- Before (Airbnb damage guide): "Vrbo gives the host 14 days after your stay 8." After: "Vrbo gives the host [14 days after your stay](#src-8)" with a small jump to the Sources entry only if the sentence names no publisher.
Owner approval needed before the migration (it touches every guide).

## 5. Ten highest-impact fixes before listing
1. Replace the pick-card price line with a per-button affiliate label; add the Amazon sentence to /affiliate-disclosure; make the footer Vrbo line readable (compliance and clutter; template, about 2 hours).
2. Cut each page's repeated reassurance blocks per the disclosure audit section 5.5 (about 10 to 4 per page).
3. Merge or redirect the large-dog rentals / no-weight-limit pair into one hub (largest duplication; 301 plus one rewrite).
4. Trim the 9 worst pages by 25 to 35% (how-many-dogs, keep-a-dog-cool, packing list, Christmas week, portable fence, two-large-dogs, bowls, ramp, car-interior).
5. Rewrite openings: 20 to 28 word dek, answer-first first paragraph, no roadmap; apply to all 30.
6. Remove gear blocks from pure policy pages (pool, Airbnb damage, how-many-dogs, large-dog rentals); keep gear where it solves the page's problem.
7. Mobile table fix: stack extra columns on phones (ramp, bowls, no-weight-limit, how-many-dogs, parks table), cap tables at 3 columns, add a sticky first column.
8. Tidy markers: remove stacked and duplicate markers, move cites out of table cells, make the tap target at least 24 px (cheap CSS now; full system after approval).
9. Fix hero images that miss the topic (cost, packing list, large-dog rentals) and remove the AI-generated-image wording in remaining places; keep credits.
10. Add a short "at a glance / our pick" box to the five gear guides and fix mobile orphan separators in the byline and breadcrumb.

## 6. Claude Code vs Cowork browser
Claude Code: all repository, template, CSS, citation component, disclosure edits, article trims and merges, tests and builds. Cowork (live browser): competitor sites that block automated reads (BringFido, Rover, Dogster, Wirecutter, Lonely Planet, The Strategist, The Dyrt), real mobile visual QA on the deployed site, tap-target tests, screenshots, and checks needing the owner's logins. The self-contained brief is `docs/COWORK_EDITORIAL_BROWSER_BRIEF.md`.

## 7. Minimum work to feel polished and buyer-ready
Do fixes 1, 2, 5 and 7 (template and boilerplate, mostly mechanical, about 1 day) plus fix 3 (the merge) and fix 9 (three hero images). Trim only the three longest pages if time is tight. This removes the defensive feel, the clutter and the worst duplication, and still preserves every source and disclosure. Deploy once afterwards (15 Netlify credits) so a buyer sees the improved site.

## 8. Honest limits
No real user testing. Competitor findings are limited to what a summarising fetch tool returned. Reviewers measured DOM and read text; they did not visually inspect screenshots except the citation investigation. Trust-sentence counts are regex estimates. Legal points are not legal advice.
