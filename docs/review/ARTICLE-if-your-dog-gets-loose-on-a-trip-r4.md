# Review (round 4): Dog Got Loose on Vacation: The First Hour, ID and Prevention (if-your-dog-gets-loose-on-a-trip)
Verdict: FIX FIRST (close). The r3 text fixes are all landed on the rendered page and the page is honest and compliant, but the first screen still puts the answer behind template furniture, the first-hour content is said twice, and the "buy" path still has no tag product.
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(Sum 35 / 4 = 8.75, rounded 8.8. No criterion below 4; fails on overall only.)

Method: source content/guides/if-your-dog-gets-loose-on-a-trip.md, r3 review and FIX file; rendered http://localhost:4174/guides/if-your-dog-gets-loose-on-a-trip at 1280 and 390 px with Playwright Chromium (screenshots and a DOM inventory). Head: title "Dog Got Loose on Vacation: First Hour Plan | Paws & Passage" (59 chars); meta description 135 chars, opens with the primary keyword and has the verb "Follow"; canonical and og:image present; 3 JSON-LD blocks. 12 Amazon links, all rel sponsored nofollow noopener, all on Tractive DOG 6 (B0D6Z4L6BW), Fi Series 3+, Petcube and the Ruffwear Beacon; no prices, ratings or stock claims. All internal links return 200. scrollWidth equals viewport at both widths.

## Round-3 issues: fixed or not
1. First body sentence (keyword stuffing, invented scene): FIXED. Rendered first paragraph is now "If your dog ran away or got loose on vacation, search close to where it was last seen right now, then call your microchip registry and your host." The "four seconds" scene is gone.
2. First screen after the dek is hero, disclosure and a collapsed table of contents: NOT FIXED (template). On 1280 the steps begin after the disclosure box; on 390 the hero, byline buttons, disclosure and "On this page" toggle still sit before step 1. The dek carries the answer, so this is a mild flow cost, not a clarity failure.
3. No tag product: NOT FIXED, still honest. "The tag" and "What to buy first" say plainly there is no catalog tag and it is a cheap local purchase. Owner decision.
4. Length / "How sure we are": FIXED. Table is three rows, readingMinutes 13. Body is still about 4,100 to 4,200 words (rendered), which is long for an urgent query (see issue 2).
5. "Buy first" wording: FIXED. "The simplest fit" replaces the repeat, and the meta description no longer says "buy first".

## Top issues (most important first)
1. **Layout / buyer trust: reader-facing spec card contains an internal editing note.**
   Where: the Tractive DOG 6 card: "(one place on the page also says above 9 lbs)".
   What: a note about our own copy inconsistency shown to the buyer; it reads like leftover QA text, and it implies the page contradicts itself. The same card repeats the line under "Check the current price on the listing before you buy." which, for a page that promises no price claims, invites the reader to look for a price we never state.
   Fix: TEXT/PRODUCT: find the "above 9 lbs" mention (catalog description or another spot), make every mention "above 8.8 lbs" and delete the parenthetical from the card; if the price line is template, change it to "Confirm size and plan on the listing before you buy."
2. **Reader flow: the first hour is written twice in a row.**
   Where: "If your dog just bolted, start here" (six steps) followed immediately by "The first hour, minute by minute".
   What: registry call, shelter list, 2 mile search and photo all appear in both. A panicking reader reads the same advice twice before reaching anything new, and the page's "short version for the next trip" paragraph (tag, chip, tracker, light) sits between the emergency list and the timeline, interrupting the emergency flow with a prevention teaser.
   Fix: STRUCTURE: keep the six steps, move the "short version for the next trip" paragraph to the top of "ID that actually works", and in the timeline drop sentences already in steps 1 to 6 (2 mile circle, registry call), leaving only the new material (flyer contents, daily shelter visits, what to say in a description).
3. **Reader flow: step order does not match the shortcut.**
   Where: "if you only have time for three, those are steps 1, 5 and 6 below" versus the opener "call your microchip registry and your host".
   What: the sentence names registry first and host second, but host is step 5 and the registry is buried inside step 6 ("Then work the phone: your microchip registry, local animal control..."), so the three-step shortcut cannot be found at a glance.
   Fix: TEXT: reorder so the registry call is its own step, e.g. step 5 "Call your microchip registry (24/7 helpline)" and step 6 "Ring the host or property manager", and change the shortcut to "steps 1, 5 and 6".
4. **Buying advice: the first essential layer (tag) has no product, and "learn what to buy" in the meta description leans on four optional picks.**
   Where: "What to buy first" item 1 and the meta description "learn what to buy".
   What: honestly labelled, but the buying path's first step is a local errand; all four linked products are optional add-ons.
   Fix: PRODUCT (owner): add one ID tag to the catalog with a spec card, or keep the wording and change the meta description to "...and which GPS trackers to compare." to match what the page actually sells.
5. **SEO fit: only one H2 carries a target phrase.**
   Where: H2 list: "If your dog just bolted, start here", "The first hour, minute by minute" and others.
   What: secondary phrases "lost dog on vacation", "lost dog in unfamiliar place" and "microchip vs GPS tracker dog" never appear in an H2, and the FAQ has no question on whether to call police or what to say to a shelter.
   Fix: SEO/TEXT: rename "ID that actually works" to "Microchip vs GPS tracker vs tag: what each does", and "The first hour, minute by minute" to "Lost dog in an unfamiliar place: the first hour"; add FAQ "Should I call the police or animal control when my dog is lost?" answered from the ASPCA source already cited, 40 to 60 words.

## What works well
- Evidence discipline: each first-hour step carries an AKC Reunite or ASPCA citation or is labelled "(our suggestion, not from a source)"; the three recovery stories are each one case and the Killington outcome is stated as unknown.
- Decision aids: the ID-layers table (what it does / does not do), the tracker buying checklist and the three-row comparison with makers' figures give a buyer a real way to choose; each pick leads with the reader's situation ("If your dog already wears a collar you like...") and states who should skip it. Petcube carries the Tree Line caveat in plain words.
- Compliance and hygiene: 12 Amazon links all properly rel-marked and on four intended products, disclosure box above the first link, no invented tests or statistics, hero (wirehaired pointer with tag on a leash) fits the topic and alt text is descriptive.

## Buyer walkthrough
1. Lands from "dog got loose on vacation"; the dek and first paragraph tell them what to do now.
2. Works the six steps, then reads the timeline (same ground again).
3. Reaches the ID table and tracker checklist, sees "no tag product here on purpose".
4. Picks a tracker by situation (existing collar, new collar, size), clicks "See it at Amazon" or Details and specs.
5. Friction: no tag to buy; duplicated first-hour content; a stray "9 lbs" aside on the Tractive card.

## Mobile notes (390 px)
- No page-level sideways scroll (scrollWidth 390). The three tables are 544 px wide inside a 350 px wrapper and scroll within it; the first column stays readable but the last column is cut until swiped.
- First screen is breadcrumb, H1, dek (answer visible), byline and Print / Copy / Pinterest buttons, then the hero; steps start about 1.5 screens down, after the disclosure and "On this page".
- Cards stack cleanly with chips, a pin icon, "See it at Amazon" and "Details and specs"; the "above 9 lbs" aside and the price line sit awkwardly under the button.

## Specific edits to make
1. TEXT: remove "(one place on the page also says above 9 lbs)" and fix the underlying inconsistency; reword or drop the price line on cards (issue 1).
2. STRUCTURE: de-duplicate steps and timeline; move the "short version" paragraph below the emergency section (issue 2).
3. TEXT: make the registry call its own step and align the "steps 1, 5 and 6" shortcut (issue 3).
4. SEO: change the meta description ending to "...and which GPS trackers to compare." unless a tag product is added (issue 4).
5. SEO/TEXT: rename two H2s and add one FAQ about police and animal control (issue 5).

Applying 1, 2 and 3 would plausibly lift Reader flow and Layout to 5 and reach 9.3; edit 5 lifts SEO to 5.

## Questions for the owner
- Add an ID tag product to the catalog? (Third round this has been open; it only affects Buying advice and Product placement, which are at 4.)
