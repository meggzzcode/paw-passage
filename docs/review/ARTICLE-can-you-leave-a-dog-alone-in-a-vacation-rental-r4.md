# Review (round 4): Can You Leave a Dog Alone in a Vacation Rental? (can-you-leave-a-dog-alone-in-a-vacation-rental)
Verdict: SHIP (every r3 issue is fixed on the rendered page; what remains is polish: a choppy crate lead-in, and the KONG still sits oddly on a page about being alone)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 5 | Trust 4 | SEO fit 5 | Differentiation 5
(Sum 36 / 4 = 9.0. No criterion below 4. This is the minimum pass; the issues below would add 1 to 2 points.)

Basis: rendered at http://localhost:4174/guides/can-you-leave-a-dog-alone-in-a-vacation-rental at 1280 and 390 with Playwright Chromium; full-page screenshots and crops of the three spec cards read; r3 review and FIX notes read.
Head: title "Leave a Dog Alone in a Vacation Rental? | Paws & Passage" (56 chars, keyword first); meta description 148 chars, one keyword use, CTA "See". H1 "Can You Leave a Dog Alone in a Vacation Rental?" with a direct answer in the first paragraph. Affiliate: 3 products, 9 Amazon links (prose, card, buy list), every one rel "sponsored nofollow noopener". Disclosure sits under the meta row and in the Amazon Associate line. No prices, ratings, stock or urgency claims; the cards say "Check the current price on the listing before you buy."
Mobile: page scrollWidth 390 (no page scroll); the rule table is 544 px inside a 350 px wrapper and scrolls in its box (1280: 672/672, fits).

## Round-3 issues: verified on the rendered page
1. KONG paragraph repetition and contradiction: FIXED. One limit statement ("use it under supervision, so treat it as practice only ... Do not leave one with your dog alone unless your vet agrees"). Card, kicker and buy-list bullet agree with it.
2. iCrate card icon (picket fence): FIXED. The card now shows a box/crate icon; KONG shows a bone.
3. "Barking is the usual way ...": FIXED ("Barking is the risk the sources flag most.").
4. "What to buy first" KONG bullet: FIXED ("Practice at home: ... the maker says supervised use only"). The buy list now also has a no-purchase branch, and a new gate card (North States) covers the dog that dislikes crates.
5. Crate sizing note: honest ("sizes but no wire gauge, weights or folded dimensions, so confirm the size with the maker"). Not blocking.

## Top issues (most important first)
1. Where: "If the rule is "crated when alone": a folding crate that travels flat." What: the bold lead-in is a sentence fragment that runs into "Then the crate is part of the trip, and a dog that has never been shut in one is not ready to start at a rental." The "Then" has no antecedent, and the reader has to re-read to see it is a recommendation. Same pattern on the gate lead-in ("If the crate stresses your dog: a pressure-mounted gate."), which is clearer but still telegraphic. Fix (TEXT): "If the rule is "crated when alone", a folding crate that travels flat is the practical choice. A dog that has never been shut in one is not ready to start at a rental, so practice at home first."
2. Where: the KONG card in "A settling-in routine" and the "Practice at home" bullet. What: on a page whose question is "can I leave my dog alone", the only enrichment pick is one the maker says is not for unattended time, so it is a purchase that does not serve the page's job, and the card still carries a "See it at Amazon" button. Honest, but it is the weakest commercial fit and slightly muddies "buy nothing unless the rule needs it". Fix (PRODUCT/STRUCTURE, owner choice): either drop the KONG card and keep the prose mention, or move the card below "What to buy first" as an optional extra.
3. Where: gate section ("It is modest in height, so it will not hold a dog that jumps gates"). What: the skip advice is honest but there is no size guidance for the dog itself (26 in height only); a buyer with a mid-size dog cannot tell if it is enough. Fix (TEXT): add "If your dog can clear a 26-inch barrier, skip it and use a crate or a sitter instead." No invented specs.
4. Where: "Tools for this" box. What: only the checklist is listed, while the body also points to the will-my-dog-be-accepted tool and the packing list. Minor missed internal-link surface. Fix (STRUCTURE): list the accepted tool and packing list there too.
5. Where: the FAQ block (collapsed on load). What: six real questions, but answers are hidden until opened, so the snippet-friendly answer for "how long can a dog be left alone in a rental" is not visible in the first scan. Not blocking. Fix: none required.

## What works well
- Source discipline: every claim about Airbnb, Vrbo, ASPCA, Cornell and the four managers carries a numbered citation, with durations attributed to one writer and labelled "not a study".
- The "What to buy first" list maps host rule to product, including "No unattended pets: buy nothing for this." Strongest honesty signal on the page.
- The Airbnb camera section says exactly what the policy covers (hosts) and what it does not (guest devices) instead of guessing, and the copy-paste host message handles it.

## Buyer walkthrough
1. Lands from "can you leave a dog alone in an airbnb": H1, dek, then a one-paragraph answer and four sourced bullets.
2. Reads the rule table and the four manager rules, then the crate rule and the iCrate card with sizing and skip lines.
3. Alternative branch: the gate card for a dog that dislikes crates.
4. Copies the host message, then "What to buy first" maps rule to product or to nothing.
5. Friction: the choppy crate lead-in, and a KONG that is practice-only.

## Mobile notes
- First screen is H1, dek, meta row and the top of the hero; the answer is one scroll down, after the disclosure and contents box.
- No page-level sideways scroll (390); the rule table scrolls inside its wrapper with a swipe hint.
- Cards stack cleanly, chips wrap, buttons are full tap-size; hero loads at 390 wide, body images lazy-load.

## Specific edits to make
1. TEXT: rewrite the crate lead-in as in issue 1.
2. PRODUCT: decide on the KONG card (drop, or demote below "What to buy first").
3. TEXT: add the "if your dog can clear 26 inches" skip line to the gate paragraph.
4. STRUCTURE: add the will-my-dog-be-accepted tool and packing list to "Tools for this".

## Questions for the owner
- Keep the KONG as a clearly labelled practice-only pick, or drop it for a tighter, more honest affiliate set?
