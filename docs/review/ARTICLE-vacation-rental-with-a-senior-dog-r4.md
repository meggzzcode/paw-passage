# Review (round 4): Vacation Rental With a Senior Dog: What to Check Before You Book (vacation-rental-with-a-senior-dog)
Verdict: FIX FIRST (marginal). All round-3 text issues are fixed and the page now reads cleanly with two honest picks, but the header chip still says "32 sources cited" (11 are forum threads), the pads link still opens the smallest size, and a few small flow and citation glitches remain.
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 5
(Sum 35 / 4 = 8.75, shown as 8.8. No criterion below 4; fails on overall only, 0.2 short.)

Method: source, r3, FIX report; rendered page at 1280 and 390 px with Playwright, DOM link inventory, head read. Title "Senior Dog Vacation Rental: What to Check Before You Book" (57 chars, primary keyword first), meta description 142 chars with "vacation rental with a senior dog" and the verb "Check", canonical and og:title correct, JSON-LD Organization, Article, BreadcrumbList (no FAQPage, as intended). 4 Amazon links (2 products x name + button), all rel "sponsored nofollow noopener", right ASINs (B07DZSF2C2 pads, B01JFEAL1O bed). No prices, ratings, stock or urgency. Mobile scrollWidth 390, no overflowing element outside the table wrapper, no image missing alt. Pin CSV row 21 title and description now match the article.

## Round-3 issues: fixed or not
1. Orphan "Four portable fixes" sentence: FIXED. "What your vet says decides the plan:" now leads the four bullets.
2. Three overlapping openers: FIXED. Scene paragraph and "Everything below..." line are gone; dek, first paragraph and "Do this first" remain and each adds something.
3. Pads link is the smallest size: NOT FIXED (owner decision). Still disclosed in text.
4. "33 sources cited" chip: NOT FIXED. Now reads "32 sources cited" (seat cover dropped) while 11 are forum threads; the sources list is unseparated.
5. Seat cover: FIXED (dropped). Two picks, each tied to a named problem, plus a one-sentence pointer to the ramp guide.

## Top issues (most important first)
1. **Trust: the "32 sources cited" chip still overstates authority.**
   Where: header meta row, "32 sources cited".
   What: 11 of the 32 are Tripawds, Mumsnet and Airhosts forum threads, and the Sources block lists them in the same flat list as AKC, Banfield and Cornell. The body labels them honestly; the chip and list do not.
   Fix: STRUCTURE (template): count only non-forum sources in the chip (21), or relabel "32 sources (11 forum threads)"; in the Sources block add a "Forum threads (small samples)" sub-heading or a "(forum)" tag on each.
2. **Product placement: the pads card opens the smallest pack.**
   Where: "For a dog that may leak" card, B07DZSF2C2 (18 x 24 in, the only size that is not a bed or sofa cover).
   What: the reader clicks through to a size that rarely fits a senior's bed and has to hunt for another variant. The text tells them so, which is honest but is a repair job on the reader.
   Fix: PRODUCT (owner): switch the link in content/affiliates.yml to the larger candidate (B0C5N8MNWZ, 34 x 36), or drop the "buy a larger size" hedge by naming which size suits which bed.
3. **Reader flow / Layout: small rendering and citation glitches in the first screen and a half.**
   Where: (a) "Your dog is stiff, slow to rise or hesitates at stairs: call your vet first; these are listed signs of joint disease. 4 3" (citation order reversed, and the same "4 3" repeats later); (b) "Nothing here needs buying to book. What to buy, and in what order, is in What to buy, in order near the end." (the phrase "What to buy, in order" is repeated three times in one sentence and again in the pads and bed paragraphs); (c) the first bullet "Your vet says the trip is fine ... go, and check the rental carefully" carries no source while the others do.
   Fix: TEXT: reorder citations to "3 4"; rewrite (b) to "Nothing here needs buying to book; the two optional items are near the end."; replace each later "in What to buy, in order" with "near the end".
4. **Reader flow: one section heading is a statement, not a question, and the page is long for a decision.**
   Where: "What to buy, in order" among question-form H2s; 11 minutes (about 3,380 words).
   What: the heading breaks the question pattern that wins PAA matches, and the manager table plus the forum paragraphs push the buy answer to the bottom of a long page. The "Do this first" box does carry the decision, so this is polish, not a blocker.
   Fix: STRUCTURE: retitle "What should you buy for a senior dog's rental stay?" and add a one-line jump link to it in "Do this first".
5. **Buying advice: only two picks and no ramp or step option in this article.**
   Where: "If the car is your dog's hurdle (hesitating at the tailgate or a high sill)..."
   What: the sentence handles it sensibly, but the buyer who needs a rug (the most-cited fix: Banfield, Dog Aging Project) gets no rug pick, while the page gives bath-mat advice only in prose. A shopper looking for "what grips on a rental floor" finds pads (leaks) and a bed, not the traction product the sources actually recommend.
   Fix: PRODUCT (owner decision): add one non-slip runner or rug-grip pick from the catalog if one exists, or add the sentence "We did not pick a rug: measure the route first, since the host may not allow one." so the gap reads as deliberate.

## What works well
- The host message with six numbered questions plus the "borrowed photo standard" (Airbnb's step-free guidance, inference labelled) is original and exactly what a worried owner needs before paying.
- The six-manager policy table with an "our inference" column, the cap-at-two and unreported-accident observations, and the "How sure we are" block (confirmed / reported / unknown) are honest and differ from generic senior-travel pages.
- Cards are true spec cards (sizes, "Large rolls to 17 x 9.5 in", "not an orthopedic bed", "a rental-side fix, not a treatment"), each with a skip line, and "What to buy first" opens with "Nothing, until the vet and the host have answered."

## Buyer walkthrough
1. Lands from "senior dog vacation rental"; the first paragraph gives the three checks and the vet-first rule.
2. "Do this first" and the vet-situation bullets give the order; the listing checks and photo list follow.
3. Copies the host message, reads manager rules and slippery-floor tips tied to vet sources.
4. Reaches "What to buy, in order": pads and bed, each with a skip line; the pads link opens a small pack, so friction.
5. "What to buy first", then links to the large-dog guide, travel gear and the two checklists; no dead ends.

## Mobile notes (390 px)
- No sideways page scroll (scrollWidth 390); the manager table scrolls inside its wrapper with the swipe hint.
- First screen: breadcrumb, H1, dek with the answer, byline and chips, buttons, disclosure; the answer paragraph is within one scroll. Hero alt is descriptive.
- Spec cards are full width with wrapping chips; the rust button's dark-on-rust contrast is modest (component item).

## Specific edits to make
1. STRUCTURE (template): fix the sources chip and tag forum threads in the Sources block (issue 1).
2. PRODUCT (owner): larger pads variant (issue 2).
3. TEXT: citation order "3 4"; rewrite the "Nothing here needs buying to book..." sentence; replace later "in What to buy, in order" with "near the end" (issue 3).
4. STRUCTURE: question-form buy heading and a jump link from "Do this first" (issue 4).
5. TEXT/PRODUCT: add the deliberate-gap sentence about rugs, or one rug pick (issue 5).

Applying edits 1 to 3 plus either 4 or 5 would plausibly lift Trust, Reader flow and Product placement to 5 and reach 9.0 or above.

## Questions for the owner
- Approve a larger Pawtect variant, and add a rug or runner pick or accept the stated gap?
