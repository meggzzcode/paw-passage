# Review (round 4): How Many Dogs Are Allowed at an Airbnb or Vacation Rental? (how-many-dogs-can-you-bring-to-a-vacation-rental)
Verdict: SHIP (all five r3 issues are fixed or knowingly accepted on the rendered page; what remains is polish, not a blocker)
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 5 | Differentiation 5
(Sum 36 / 4 = 9.0. No criterion below 4. This is a bare pass; the issues below would lift it.)

Basis: rendered page at http://localhost:4174/guides/how-many-dogs-can-you-bring-to-a-vacation-rental at 1280 and 390 (Playwright Chromium; DOM text, link audit, table measurements, 390 screenshot). Head: `<title>` "How Many Dogs Are Allowed at an Airbnb or Rental?" (49 chars); meta description 152 chars, leads with the primary phrase and carries a clear reason to click; canonical https://www.pawsandpassage.com/guides/how-many-dogs-can-you-bring-to-a-vacation-rental; one H1 containing the primary phrase. Page 13,802 px at 1280, 20,179 px at 390. scrollWidth equals viewport at both widths (no page-level sideways scroll). Nine Amazon anchors (three products), every one `rel="sponsored nofollow noopener"` with tag pawspassage-20. Disclosure sits directly under the byline, plus a disclosure link. Hero alt "Three dogs, two Australian shepherds and a Cavalie..." fits the topic. Internal links: pet fees guide, large-dog rentals, no-weight-limit rentals, Georgia state park cabins, rental checklist, checklist tool, /data/pet-policies, /gear/pens-and-gates, car-safety guide: sensible, none broken-looking.

## Round-3 issues: verified on the rendered page
1. Over-general opening claim: FIXED. Now "Two dogs is the most common cap ... 22 state a limit of two, 2 allow three pets and 14 give no number" with "(a convenience sample)". Roadmap sentence is gone.
2. Orphan cups-per-day sentence: FIXED. Step 3 of "What to buy first" now ends with only the gear-page pointer.
3. Two "Next step" lines: FIXED. One remains, after the checklist; the end-of-page one is gone (see issue 2 below for what the survivor now causes).
4. "Buy first" twice / crate overlap: FIXED. Lead is "If the cabin is open-plan: the gate." and "What to buy first" is the only ranking. The Happy Ride vs iCrate choice is now clear ("covers the trip and the closed space ... in one purchase").
5. Sources table swipe at 390: NOT FIXED, accepted. Tables measure 544 px in a 350 px wrapper; the swipe hint is present.

## Remaining issues (most important first)
1. **Layout: four tables still need a sideways swipe on a phone.**
   - Where: "Source / Dogs and size / Extra or unapproved dog" (ten rows) and the other three tables at 390.
   - What: 544 px content in a 350 px wrapper; the third column of the source table, the answer to "what happens with an extra dog", sits off-screen on first view. Readers who skip the hint miss it.
   - Fix: STRUCTURE: shorten the third column cells ("Not stated" repeats five times; use a dash) and merge the platform rows into one line each so the table fits about 350 px; or on small screens stack each row as a card.
2. **Reader flow: "Next step" now sits mid-page, before the product section.**
   - Where: "Next step: add up the pet charges for your dog count and dates with our pet fees guide, then work down our pet-friendly rental checklist and the trip checklist tool."
   - What: it reads as the close of the article, then a new H2 starts ("If your rental has no separate spaces") plus three product cards, and the page ends in the sources, with the only closing recommendation being the "What to buy first" list. A reader who stops at "Next step" never sees the gear; one who reads on has no final pointer to the fee guide. The duplicate pet-fees link already appears under "What do extra dogs cost?".
   - Fix: STRUCTURE: move the Next step sentence to directly after "What to buy first" (before "How sure we are"), or cut it and keep the earlier fee-guide link plus the checklist link there.
3. **Buying advice: step 3 of "What to buy first" is loose and mismatched with the card text.**
   - Where: "Both dogs already crate-trained: the iCrate for meals and rest, or the Happy Ride if one dog is under 60 lb and rides in the back seat."
   - What: the Happy Ride paragraph says "if the second dog is small to medium", the list says "one dog is under 60 lb", and the maker's 60 lb is the crate's limit, not a dog size class. It also leaves out the cheapest-first logic (closed bedroom door is step 1, good) and what to do if only one dog is crated.
   - Fix: TEXT: "Both dogs already crate-trained: the iCrate for meals and rest. If one dog must ride in a crate in the back seat and weighs under 60 lb, the Happy Ride covers the car and the rental." Then end with the gear-page pointer.
4. **Product placement: each product is linked three to four times with identical anchors.**
   - Where: nine Amazon links for three products (gate x4 including prose, table and card button; iCrate x2; Happy Ride x2, plus the prose name links).
   - What: not wrong, but the gate has four affiliate links and the pick card repeats "Check the current price on the listing before you buy" three times; on a 20,000 px mobile page the gear block looks heavier than the dog-count answer it follows.
   - Fix: STRUCTURE: keep the prose name link and the card button; drop the extra in-prose link in the opening of the gear H2.
5. **Reader flow (minor): "What next?" is an empty-looking heading.**
   - Where: H2 "What next?" in the heading list, before "Sources and how we researched this"; the DOM shows only "Before-you-book checklist" under it before "Keep reading".
   - Fix: STRUCTURE: confirm this block is intended; if it only holds a checklist link, merge it into the Keep reading area or give it a descriptive heading ("Your pre-booking checklist").

## What works well
- The answer is in the first paragraph and the short-answer bullets with counts that reconcile (22 + 2 + 14 = 38), the convenience-sample caveat stated once and clearly, and the "How sure we are" block with an Unknown / Check for yourself table that tells the reader exactly what to ask.
- Decision tools no top result offers: the ten-source limits table with quoted wording, a made-up-and-labelled fee-shape table showing that the smallest per-booking-looking number can total more, and a copy-and-edit message to ask a host for a third dog with the "get it in writing" instruction.
- Gear is conditional and honest: problem labels, "Skip it if" sentences, "ask about a closed bedroom door first", "not a crash-tested restraint", no prices, ratings or stock claims, and a visible "Check the current price" line; nineteen sources cited.

## Buyer walkthrough
1. Lands on a direct answer (two dogs is the most common cap, 22 of 38) and four bullets.
2. Reads the limits table, weight limits, fee shapes and the third-dog message; works the before-you-book checklist.
3. Hits "Next step" and could stop there; if they keep going, "If your rental has no separate spaces" starts with the host-door check, then gate, iCrate, Happy Ride.
4. Clicks "See it at Amazon" or "Details and specs"; the "What to buy first" list ranks the choice.
5. Leaves through the fee guide, rental checklist and gear page; no dead end.

## Mobile notes (390 px)
- scrollWidth 390; no page-level overflow; 20,179 px tall; four tables scroll inside wrappers with the swipe hint (544 px in 350).
- Header, H1, dek, byline, three share buttons and the hero fit without clipping; the disclosure appears after the share buttons, close to the first link.
- The page is very long on a phone; the gear block is a heavy run of three full cards. Consider collapsing the "Why we picked it" boxes if the template allows.

## Specific edits to make
1. STRUCTURE: shorten/merge table cells so the source table fits about 350 px (issue 1).
2. STRUCTURE: move or cut the mid-page "Next step" line (issue 2).
3. TEXT: rewrite step 3 of "What to buy first" (issue 3).
4. STRUCTURE: drop redundant in-prose affiliate links (issue 4).
5. STRUCTURE: clarify the "What next?" block (issue 5).

## Questions for the owner
- None needed.
