# Review (round 5): Large Dog Friendly Vacation Rentals: How to Find One (vacation-rentals-that-welcome-large-dogs)
Verdict: SHIP (borderline) (r4 content and button issues are fixed on the rendered page; the remaining defect is spec text repeated inside each pick card, which lives in product data)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 5 | Trust 5 | SEO fit 4 | Differentiation 5
(sum 36 / 4 = 9.0; no criterion below 4. Every 4 has a named issue below. This is a minimum pass, not a clean 10.)

Evidence: rendered page at 1280 and 390 via Playwright Chromium against localhost:4175. Head: title "Large Dog Friendly Vacation Rentals: Limits and Checks", meta description (Six managers we read cap dogs from under 35 to 65 lb...) with the primary phrase, canonical present, one H1. Six Amazon links (three names, three "See it at Amazon"), all rel="sponsored nofollow noopener". Disclosure under the byline with the Amazon Associate line. No prices, ratings or stock claims. Mobile scrollWidth 390, desktop 1280, no page-level overflow.

## Round-4 issues: verified on the rendered page
1. Button contrast: FIXED. Computed label rgb(255,255,255) on oklch(0.53 0.11 45) rust, roughly 5:1 by my estimate.
2. Specs repeated up to three times: PARTLY FIXED. The hammock's "lifetime guarantee" is gone from the prose, but it still shows in the chips ("Maker: lifetime guarantee") and the grey line. The grey description line under the chips still restates the paragraph above on all three cards.
3. Gear is car-heavy: MITIGATED. The sentence "Most of this is about the drive; for the rental itself, the checks above (steps, floor, yard) matter more than any product." now sits before "In the rental". Still one rental-side pick.
4. Repeated headline stat: FIXED in the short answer and table intro (the table intro no longer restates the count). The dek still carries the range once, which is fine.
5. SEO long-tail: PARTLY FIXED. FAQ "Do vacation rentals charge more for large dogs?" is present and a destination search sentence was added in "Find candidates". No "near me / by state" angle and no short numbered "how to find one" list.

## Top issues (remaining, most important first)
1. **Grey description line repeats the paragraph and chips.** Where: under the chips on the Loft Wander, Rover Hammock and Happy Ride cards ("A roll-up travel bed with a water-resistant ripstop top and a waterproof, non-slip bottom, meant to give a dog..."). What: the card restates the prose directly above it, and the hammock still shows "lifetime guarantee" in chips and in the grey line. Costs Product placement (4) and Reader flow (4). Fix: in content/products.yml change each description to a fact not in the prose or chips (bed "Roll-up and handled, so it travels with you."; hammock "Hooks to both headrests and covers the whole bench."; ramp "Slides shut for storage."), and drop one of the two lifetime-guarantee mentions.
2. **Only one rental-side product.** Where: "Gear for a big dog, after the rental says yes". What: bed is for the stay, hammock and ramp are for the drive; the new caveat sentence is honest but the buyer who searched for rentals still gets one stay pick. Costs Buying advice (4). Fix: either accept it (the page's own advice is that checks matter more than gear), or add a second stay-side pick already in products.yml, with no new claims.
3. **Long-tail gaps.** Where: H2 set and FAQ. What: nothing for "large dog friendly vacation rentals near me / by state", and no short numbered "how to find one" snippet list even though the H1 says "How to Find One". Costs SEO fit (4). Fix: add a 4 to 5 step numbered list at the top of "Find candidates" (weight rule, per-dog vs combined, written yes, five checks, total price), no new numbers.

## What works well
- The six-manager weight table with a per-dog versus combined column and worked examples, plus the decode table and paste-ready host message; nothing comparable in generic top results.
- "Find candidates" names starting points and says they are marketing pages, not your reservation, so get the yes in writing.
- Honest gear section: maker figures labelled as the maker's, skip-it lines on each pick, and a buy-first list that starts with "Nothing, until the rental says yes to your dog in writing."

## Buyer walkthrough
1. Dek and short answer give the rule: check the weight limit for this dog and get the yes in writing.
2. Reads the weight and decode tables, copies the host message.
3. Uses "Find candidates" and the checks (steps, floor, yard, total price).
4. Reaches gear, reads the "mostly about the drive" caveat, picks by problem; cards go to Amazon and /gear specs.
5. "What to buy first" closes with sibling guides and /gear. No dead end. Friction: each card repeats its own specs.

## Mobile notes (390 px)
- No page-level horizontal scroll (scrollWidth 390); tables scroll inside their wrappers.
- Cards are full width; the button is now legible white on rust.
- Page is long; the on-page contents and short answer keep the key decision at the top.

## Specific edits (ready to apply)
1. PRODUCT. Replace the three grey description lines in content/products.yml as in issue 1; remove one lifetime-guarantee mention.
2. STRUCTURE/SEO. Add the short numbered "how to find one" list in "Find candidates" (issue 3).
3. PRODUCT (optional). Consider a second stay-side pick (issue 2).

## Questions for the owner
- None blocking.
