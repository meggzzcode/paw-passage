# Review (round 5): Dog Got Loose on Vacation: The First Hour, ID and Prevention (if-your-dog-gets-loose-on-a-trip)
Verdict: SHIP (narrowly). All r4 fixes are on the rendered page; what is left is template furniture, one owner decision and length, none of which blocks a reader or a buyer.
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 5 | Differentiation 5
(Sum 36 / 4 = 9.0. No criterion below 4.)

Method: frozen build http://localhost:4175/guides/if-your-dog-gets-loose-on-a-trip, Playwright Chromium at 1280 and 390 px (DOM inventory, text, link fetch). Head: title "Dog Got Loose on Vacation: First Hour Plan | Paws & Passage"; meta description "Dog got loose on vacation? Follow the first-hour steps, see what a tag, microchip and GPS tracker each do, and which GPS trackers to compare."; canonical and og:image present; 3 JSON-LD blocks. 12 Amazon links, all rel "sponsored nofollow noopener". scrollWidth equals viewport at 1280 and 390; all internal links return 200; no broken images. About 4,360 rendered words, 13 min read.

## Round-4 issues: fixed or not
1. "above 9 lbs" aside on Tractive card: FIXED (no "9 lbs" anywhere on the page; the body says 8.8 lbs). Price line "Check the current price on the listing before you buy." is still rendered (template, not editable by the article fixer): NOT FIXED, minor.
2. First hour written twice: MOSTLY FIXED. The "short version" paragraph now opens the ID section, and the timeline section opens "Steps 1 to 6 above are the order of work. This section adds what to say and carry." and adds flyer contents and daily shelter visits. It still repeats the description and the ASPCA places-to-call list, but now as new detail rather than a copy.
3. Step order versus shortcut: FIXED. Step 5 is the registry call, step 6 the host, and the shortcut reads "steps 1, 5 and 6".
4. No tag product / meta description: PARTLY FIXED. The meta description now ends "and which GPS trackers to compare", so it matches what the page sells. The tag is still a local errand by design (owner decision, open for four rounds).
5. SEO H2s and FAQ: FIXED. H2s are now "Lost dog in an unfamiliar place: the first hour" and "Microchip vs GPS tracker vs tag: what each does"; the FAQ has "Should I call the police or animal control when my dog is lost?".

## Remaining issues (most important first)
1. **Buying advice / product placement: the first essential layer (tag) still has no product.**
   Where: "The tag" ("The catalog has no ID tag product, so there is no link here on purpose") and "What to buy first" item 1.
   What: honestly labelled and the right call without a catalog item, but every linked product is an optional add-on, and a skeptical buyer ends with nothing to click for the thing the page says matters most. This holds Buying advice and Product placement at 4.
   Fix: PRODUCT (owner): add one ID tag with a spec card and place it in "The tag". Without it, accept the 4s.
2. **Reader flow: three news stories sit between the emergency steps and the prevention content.**
   Where: "What worked in reported cases" (Park City, Homer, Killington) inside "Lost dog in an unfamiliar place: the first hour".
   What: a panicking reader gets to the minute-by-minute material, then three anecdotes before reaching ID and prevention; the stories are properly hedged (one case each, Killington outcome unknown) but they are the least urgent content in the most urgent section. On mobile, the hero, byline buttons, disclosure and "On this page" toggle still sit before step 1 (template).
   Fix: STRUCTURE: move "What worked in reported cases" to after "Preventing it in a place you do not know" or fold it into "Fireworks and holidays" (the stories are all fireworks cases), and trim the page by about 300 words.
3. **Layout: reader-facing price line on pick cards.**
   Where: each pick card, "Check the current price on the listing before you buy."
   What: invites the reader to look for a price we never state; harmless but at odds with the no-price stance. Template text in src/components/site/Markdown.tsx.
   Fix: TEXT (template): change to "Confirm size and plan on the listing before you buy."
4. **Layout (mobile): tables scroll inside their wrapper.**
   Where: the three tables (544 px inside a 350 px wrapper at 390 px).
   What: no page-level overflow, but the last column ("What it does not do" and the comparison tail) is cut until swiped.
   Fix: STRUCTURE: shorten the cell text or drop one column on the comparison table so it fits 350 px.

## What works well
- Evidence discipline: first-hour steps cite AKC Reunite or ASPCA or say "(our suggestion, not from a source)"; stories are labelled as single cases; "How sure we are" is a three-row table.
- Decision aids and honest buying advice: the ID-layers table, tracker checklist and "The simplest fit" close, with who-should-skip and the Petcube accuracy caveat, give a real way to choose.
- Compliance and head: 12 Amazon links all correctly rel-marked, disclosure above the first link, no prices, ratings or stock claims, keyword-led meta description, FAQ now covers police and animal control.

## Buyer walkthrough
1. Lands from "dog got loose on vacation"; dek and first paragraph give the immediate actions.
2. Works the six steps, scans the timeline section for what to say and carry.
3. Reads the ID table and tag guidance, accepts that the tag is a local purchase.
4. Picks a tracker by situation (existing collar, new collar, size) and clicks "See it at Amazon" or Details and specs.
5. Friction: no tag to click; anecdote block before prevention; price line under each button.

## Mobile notes (390 px)
- scrollWidth 390; no page-level horizontal scroll.
- Tables scroll within a 350 px wrapper; last column cut until swiped.
- H1 sits about 209 px from the top; the answer-bearing dek is visible on the first screen, steps start after hero, disclosure and "On this page".

## Specific edits to make
1. PRODUCT (owner): add an ID tag with a spec card (issue 1).
2. STRUCTURE: move the three news stories below the prevention section and trim about 300 words (issue 2).
3. TEXT (template): replace the card price line (issue 3).
4. STRUCTURE: narrow the comparison table for 390 px (issue 4).

## Questions for the owner
- Add an ID tag product to the catalog? Still the only thing capping Buying advice and Product placement at 4.
