# Review r6: Dog Got Loose on Vacation: The First Hour, ID and Prevention (if-your-dog-gets-loose-on-a-trip)
Verdict: FIX FIRST (strong emergency opening and working citations, but Petcube and Beacon are discussed with no link or card beside the text, and the page is still 2,900 words)
Overall: 8.0 / 10 (FAIL)  [Product placement 3 is below the 4 floor]
Editorial score (1-10): Reader appeal 7 | Formatting 7 | Readability 7 | Utility 8 | Commercial integration 6 = 7.0 (target 8: not met)

Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 3 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 4

Method: Playwright Chromium at 390 and 1280 against http://localhost:4176; source content/guides/if-your-dog-gets-loose-on-a-trip.md compared with git b0f371a~12 (body 3,429 -> 2,427 words, about 29 percent; rendered page 2,915 words, 13 min read).

## Checks
1. Answer in 20 seconds: yes. The dek gives the action (search within two miles, call registry and host). The numbered 6-step list is the first content block. The first paragraph ("Panic makes people search in circles...") is filler but short, and no longer repeats the dek. At 390 the list starts about two screens down (hero, share buttons, affiliate notice, collapsed contents come first); the dek carries the answer above it.
2. Citations: 33 markers, all resolve to #src-n (20 sources). Click jumps and opens the "Show the 20 sources" details (target at about 484 px). Back-link returns to #cite-n-1 and it is in view. Direct load with #src-3 opens the details. Keyboard: 10 Tabs reach the first marker, Enter jumps and opens. Max stack is 2 (never more). No markers inside table cells (tables cite once underneath). Marker tap target is 24 px via ::after (visible glyph 6x15 px). Markers are not in reading order (for example 1, 2, 6, 7, 8, 9, 12, 14, 18, 20, 19, 15, 16, 17, 3, 4, 5) because numbers follow the Sources list, not first use; legal but slightly odd.
3. Affiliates: 4 buttons ("See it at Amazon"), 4 "Affiliate link / We may earn a commission if you buy." labels, one top notice, Amazon sentence in it, no "Check the current price" text. All 8 Amazon links are rel="sponsored nofollow noopener".
4. Tables: 2 tables, 3 columns each, sticky first column, fit inside 350 px with no horizontal scroll; page scrollWidth 390 = clientWidth. See issue 4: the "Swipe sideways" hint shows although nothing scrolls.
5. Head: title tag 59 chars ("Dog Got Loose on Vacation: First Hour Plan | Paws & Passage"), meta description 141, H1 60. 27 internal links all return 200.

## Material facts lost vs the older version
- "What to buy first" list removed (the tag-first and "one phone call, no purchase" ordering, and the pen/containment item). The ranking of the three trackers (Tractive simplest, Fi longest battery, Petcube only for size) survives in the paragraphs but there is no single "start here" close.
- Tracker "buying checklist" was folded into one run-on paragraph ("What to check before buying...") - content kept, scannability lost.
- ASPCA attribution on the flyer contents is now unsourced in the sentence ("Put up flyers with a bold headline...") and the 2nd tag with host's number suggestion is gone (minor).
- The "How sure we are" confirmed/too-few/unknown block was reduced to one short "What we could not confirm" paragraph; acceptable.
- Nothing safety-critical was lost; steps 1-6 and the flood/fire line are intact.

## Top issues (most important first)
1. Where: "A clip-on light does not find a dog..." and "The smallest unit. Petcube's tracker is 29 g..." (Trackers section). What: Petcube and the Ruffwear Beacon are named and described in prose with no link and no card; their cards sit in a "Gear for this trip" block after Keep reading and Sources, 80+ lines away, while Tractive and Fi get an inline card. Rubric: product names must be clickable where mentioned, and each pick placed where the problem is felt. Fix: put a pick card (or at least an inline link) directly under the Petcube and Beacon paragraphs, or link the product names in the sentence; keep the bottom block only for items not discussed above.
2. Where: whole page (13 min read, 2,915 words rendered). What: style guide ceiling is 2,200 (2,800 for a policy-data comparison); this page is the longest of the three and mixes an emergency page with a tracker buyer's guide. The three-cases section, the fireworks paragraph (duplicates the NYE guide) and the checklist partly repeat steps already given. Fix: delete "Fireworks, holidays and three reported cases" down to one linked sentence to the NYE guide (about 300 words), drop the "Both recoveries began with a stranger..." paragraph, and cut the closing checklist to 4 items. Target about 2,200 words / 10 min.
3. Where: opening of "Tag, microchip or tracker" through "Trackers" (the 40-word run-on "What to check before buying, from the maker's page..."). What: a six-item list written as one sentence with semicolons. Fix: turn it into a 5-bullet list under a bold "Check before buying a tracker" label.
4. Where: the two comparison tables at 390 (hint "Swipe sideways to see all columns"). What: the tables fit the viewport, so the hint is wrong and adds clutter; the Tractive/Fi/Petcube table also links product names to Amazon with no affiliate label next to those links (the labels exist only under the buttons). Fix: show the hint only when scrollWidth > clientWidth; either drop the table links or add the label under the table.
5. Where: "Sources for this table: 6" (after the layer table). What: a marker floating after a colon looks like a stray number. Fix: write "Source: AKC Reunite" as an inline publisher link per the style guide, no marker.

## What works well
- Dek and first list give the whole emergency answer; "if you only have time for three, do 1, 5 and 6" is excellent.
- The tag/chip/tracker table plus the 4-step chip registry check are compact and sourced.
- Honest tracker caveats (Fi plan terms unstated, Petcube reviewer verdict, Tractive 8.8 lb floor) with skip-it lines.

## Buyer walkthrough
Lands on the emergency list, scrolls to the layer table, reads the tracker table, hits the Tractive card (button + label) and Fi card inline; the Petcube and Beacon buttons only appear after the Sources box. Friction: no closing "what to buy first".

## Mobile notes
- First screen: title, dek, chips, hero; affiliate notice and the steps are below the fold.
- Tables readable with sticky first column, no sideways scroll; hint is spurious.
- Page overflow none (390/390).

## Specific edits
1. STRUCTURE: move the Petcube and Beacon pick cards under their paragraphs (see issue 1).
2. TEXT: cut the fireworks/three-cases section to one sentence plus link.
3. TEXT: convert the pre-purchase check run-on to bullets.
4. STRUCTURE: conditional "Swipe sideways" hint.
5. TEXT: replace "Sources for this table: [6]" with an inline publisher link.
