# Review (round 4): New Year's Eve With a Dog in a Cabin: Vet the Fireworks Claim, Plan the Night (new-years-eve-with-a-dog-in-a-vacation-rental)
Verdict: FIX FIRST (round-3 text fixes landed, but the Petcube card was only half removed: it still renders as a buy card in the page-level "Gear for this trip" block, and the new "What to buy for the night" pointer link is a dead anchor)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(sum 35 / 4 = 8.75, shown 8.8; no criterion below 4. Edits 1 to 4 should lift placement, layout, buying advice and flow to 5 and reach about 9.4.)

Evidence: source-rendered page at 1280 and 390 via Playwright (served build http://localhost:4174), r3 review, FIX file (Round 4 section), SEO brief. Head: title "New Year's Eve With a Dog in a Cabin: Fireworks Plan" = 52 chars; meta description 130 chars, keyword first; canonical and og:image present; JSON-LD Organization, Article, BreadcrumbList (no FAQPage, as intended). scrollWidth 1280 = 1280 and 390 = 390 (only the three tables overflow, inside their scroll wrappers). 11 Amazon links on the page, all rel="sponsored nofollow noopener" (0 violations). No prices, ratings, stock or urgency; no invented tests.

## Round-3 issues: verified on the rendered page
1. Petcube card sells the least-accurate tracker: PARTLY FIXED. The in-body card is gone and the prose keeps the Tree Line caveat with a link to the tracker guide; buy-list item 5 now says "A GPS tracker from our tracker guide". But the page still renders a Petcube spec card with "See it at Amazon" in the "Gear for this trip" block after the sources (and the prose still links "Petcube GPS Tracker" straight to Amazon). See issue 1.
2. "What most people report": FIXED ("Our reading of the stories").
3. Dense opening paragraph: PARTLY FIXED. The paragraph is shorter and leads with the action, but it still runs on into "New Year's Eve with a dog in a cabin comes down to three jobs..." which restates the dek and the "Do this first" box a third time.
4. July 4 bullet unlabeled: FIXED ("a different holiday, same fireworks fear").
5. "Buy" twice: FIXED (H2 "What to buy for the night"; "first" only in the list).
6. Beacon filler: FIXED.
7. Items not linked in the buy list: FIXED (Kurgo, Beacon, KONG linked; the tracker item links to the guide).

## Top issues (remaining, most important first)
1. **Petcube still has a buy card and an Amazon link.** Where: "Gear for this trip" block (card "PETCUBE GPS Tracker ... See it at Amazon") and the prose "The Petcube GPS Tracker weighs 29 g..." which links to Amazon. The page itself quotes Tree Line calling it "the most inaccurate location-wise", and the buy list says to use the tracker guide instead. A buyer gets two contradictory signals. Fix: edit 1.
2. **Dead anchor in the gear pointer.** Where: "Gear for the night is in What to buy for the night." links to `#what-to-buy-for-the-night-and-what-to-buy-first`, but the H2 id is now `what-to-buy-for-the-night` (verified: old id absent, new id present). The tap does nothing. Fix: edit 2.
3. **The opening still states the same three actions three times.** Where: "New Year's Eve with a dog in a cabin comes down to three jobs: ..." after the first paragraph's sentences, plus the dek and "Do this first". Fix: edit 3.
4. **Pointer sentence is filler.** Where: "Gear for the night is in What to buy for the night." sits under the noise table; it adds a link to a section the reader reaches by scrolling and the TOC lists. Fix: fold into edit 2 as a clause that says what the gear does ("A chew, a bed from home and a light cover the gaps in the table: see What to buy for the night.").
5. **Dutch case sentence is hard to parse.** Where: "In one first-person account, a Dutch park advertised..." packs the account, a parenthetical caveat and "our note" into one 60-word sentence. Fix: edit 4.
6. **Mobile meta row.** Where: byline row under the H1 at 390 (template, previously noted): stray separator before "Affiliate links disclosed" persists. Owner/template item, not content.

## What works well
- The "firework-free" vetting section: six host questions, a copy-and-paste message and a three-manager table, with a clear caveat that one Dutch case is not an odds statement. Competing pages do not do this.
- Gear is problem-led with a skip line each, size checks (KONG chart, Kurgo measure-first) and an ordered "buy first" list that starts with free steps; all card claims match the catalog specs.
- Evidence grading in the noise-fear table and the "How sure we are" block with who-to-ask rows; no drug names or doses, no invented tests.

## Buyer walkthrough
1. Lands from "new year's eve with a dog in a cabin"; dek and first sentence give the actions.
2. Uses the host questions and message, then the manager table.
3. Reaches "What to buy for the night"; each pick starts with the reader's situation and ends with who can skip it.
4. Clicks KONG or Kurgo (sponsored) or "Details and specs".
5. Friction: the tracker paragraph says "see our guide" but its name links to Amazon, and a Petcube buy card appears far below; the "Gear for the night" pointer goes nowhere.

## Mobile notes (390 px)
- No page-level sideways scroll; the three tables scroll in their wrappers.
- Spec cards stack cleanly with full-width buttons; chips wrap.
- First screen is breadcrumb, a long H1 and the dek; meta row has the stray separator (template).

## Specific edits to make (ready to apply)
1. PRODUCT. Remove petcube-gps-tracker from the guide's gear rail/related products so no Petcube card renders, and in the prose unlink the product name (write "The Petcube tracker" in plain text, or point it to the tracker guide) so the only action is "tracker guide". Keep the facts and the Tree Line caveat.
2. STRUCTURE. Change the pointer link target to `#what-to-buy-for-the-night`, and use the sentence "A chew, a bed from home and a light cover the gaps in the table: see What to buy for the night."
3. TEXT. Delete "New Year's Eve with a dog in a cabin comes down to three jobs: check what "firework-free" really covers, keep the dog from bolting, and plan the night." from the first paragraph and start the second sentence of the intro instead with "New Year's Eve with a dog in a cabin is mostly three jobs: vet the claim, stop a bolt, plan the night." only if the keyword must stay; otherwise rely on the H1 for the keyword.
4. TEXT. Split the Dutch sentence: "In one first-person account, a Dutch park advertised as firework-free had fireworks on arrival, the night before New Year's Eve and at midnight; reception could not control what happens outside. Our note: that is a different fireworks culture from most US cabins, so take the question to ask, not the odds."
