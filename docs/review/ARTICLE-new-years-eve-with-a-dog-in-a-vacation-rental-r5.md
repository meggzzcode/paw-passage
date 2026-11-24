# Review (round 5): New Year's Eve With a Dog in a Cabin: Vet the Fireworks Claim, Plan the Night (new-years-eve-with-a-dog-in-a-vacation-rental)
Verdict: FIX FIRST (the Petcube buy card and the dead anchor are fixed, but the prose still renders "Petcube GPS Tracker" as an Amazon affiliate link next to a Tree Line caveat, and the opening still says the same actions three times)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(sum 35 / 4 = 8.75, shown 8.8; no criterion below 4. Honest note: the remaining items are small; applying edits 1 and 2 plausibly gets 9.2 or better.)

Evidence: rendered page at 1280 and 390 via Playwright on the frozen build http://localhost:4175. Head: title "New Year's Eve With a Dog in a Cabin: Fireworks Plan" (52 chars); meta description present, keyword first; canonical https://www.pawsandpassage.com/guides/new-years-eve-with-a-dog-in-a-vacation-rental. scrollWidth 1280 = 1280 and 390 = 390 (no page-level overflow). 10 Amazon links, all rel="sponsored nofollow noopener" (0 violations). No prices, ratings, stock claims or invented tests. All in-page # links resolve (0 dead).

## Round-4 issues: verified on the rendered page
1. Petcube buy card: PARTLY FIXED. No Petcube spec card renders any more. But the prose "The Petcube GPS Tracker weighs 29 g..." still renders "Petcube GPS Tracker" as an Amazon link (a data-aff product-link, href amazon.com/dp/B0C89SV8VP?tag=pawspassage-20). The markdown source has no such link, so the site auto-links the product name from the catalog. FIX4 said the prose was already plain text; on the rendered page it is not. See issue 1.
2. Dead anchor: FIXED. Pointer now reads "A chew, a bed from home and a light cover the gaps in the table: see What to buy for the night." and the target id what-to-buy-for-the-night exists.
3. Triple restatement in the opening: PARTLY FIXED. The "three jobs" sentence is gone, but the dek, the lead paragraph and "Do this first" still all give the same two actions (ask how far the nearest homes are; leash, quiet room, person at every door). See issue 2.
4. Pointer filler: FIXED (now says what the gear does).
5. Dutch sentence: FIXED (split into account plus "Our note: ...").
6. Mobile meta row: NOT FIXED (template, owner item). At 390 the "Last reviewed / 22 sources cited / Affiliate links disclosed" row shows stray middle dots at the start of line two, and the breadcrumb wraps with a stray "/" at the start of line two.

## Remaining issues (most important first)
1. **Petcube still sold by an auto-link.** Where: "The Petcube GPS Tracker weighs 29 g, and the maker says..." in the tracker paragraph. What: the name is an Amazon affiliate link while the same paragraph quotes Tree Line calling it "the most inaccurate location-wise" and sends the buyer to the tracker guide. Mixed signal; the only other Amazon link in the section is the one a skeptical buyer should not be nudged to. Fix: opt this product out of prose auto-linking in the guide (or the component's no-autolink option), or reword to "This tracker" so the name is not matched; keep "tracker guide" as the one link.
2. **Opening repeats itself.** Where: dek ("Check what "firework-free" really covers, keep your dog on a leash..."), lead paragraph ("Before you book, ask the host how far the nearest homes are..."), then "Do this first" bullets 1 and 2. What: same two instructions three times in the first screen and a half. Fix: shorten the dek to the promise ("What a "firework-free" cabin listing really covers, and how to keep your dog safe and settled on the night.") and cut the lead paragraph's action sentences so it keeps only the researched-not-tested line, leaving "Do this first" as the single action list.
3. **Mobile meta row and breadcrumb stray separators.** Where: byline row and breadcrumb under the nav at 390. What: leading "·" and "/" orphaned on wrapped lines. Fix: template change, hide the separator at the wrap point (owner item).
4. **Title tag does not carry the cabin/rental split.** Where: head title. What: the slug says vacation rental, the title says cabin; searchers use both. Fix (optional): add "rental" in the meta description ("a cabin or vacation rental").

## What works well
- The "firework-free" vetting section: host questions, copy-and-paste message, manager table and a clear one-case-not-a-statistic caveat on the Dutch account. Competing pages do not do this.
- Problem-led gear with a skip line each, size checks and an ordered "buy first" list that starts with free steps; sponsored rel on every Amazon link.
- Evidence grading and "How sure we are", with no drug names or doses and no invented tests.

## Buyer walkthrough
1. Lands from "new year's eve with a dog in a cabin"; dek and lead give the actions (twice).
2. Uses the host questions and message, then the manager table.
3. Reaches "What to buy for the night"; each pick opens with a situation and ends with who can skip it.
4. Clicks KONG, Kurgo or Beacon (sponsored) or "Details and specs".
5. Friction: in the tracker paragraph the name goes to Amazon while the text steers to the guide.

## Mobile notes (390 px)
- No page-level sideways scroll; tables scroll inside wrappers.
- Hero image, chips and cards stack cleanly.
- Stray separators in the breadcrumb and meta row (template).

## Specific edits to make
1. PRODUCT. Stop the prose auto-link on "Petcube GPS Tracker" in the tracker paragraph (no-autolink option, or write "This tracker"); keep the tracker-guide link.
2. TEXT. Shorten the dek and trim the lead paragraph as in issue 2 so "Do this first" is the only action list.
3. STRUCTURE (owner/template). Fix the orphaned separators in the 390 px breadcrumb and byline row.
4. SEO (optional). Add "or vacation rental" to the meta description.
