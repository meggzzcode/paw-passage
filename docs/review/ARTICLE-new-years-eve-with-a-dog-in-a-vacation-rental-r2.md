# Review (round 2): New Year's Eve With a Dog in a Cabin: Vet the Fireworks Claim, Plan the Night (new-years-eve-with-a-dog-in-a-vacation-rental)
Verdict: FIX FIRST. The round-1 problems are fixed and the page is far stronger, but it still has no criterion at 5 except differentiation: the dek and first screen do not give the answer, one pick (Petcube) is a product the page itself says to skip until you read another guide, the pick cards show the wrong icons, and one trust sentence counts "8 items" where the page tells four escape stories.
Overall: 8.3 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5  (sum 33 / 4 = 8.25, shown as 8.3)

Method: source `content/guides/new-years-eve-with-a-dog-in-a-vacation-rental.md`; round-1 review, FIX and SEO notes read; rendered page at localhost:4173 at 1280 and 390 wide (screenshots in the scratchpad `r2/` folder: `new-years-ev-d-top.png`, `new-years-ev-m-top.png`, `nye-d-card0..3.png`, `nye-m-card0..3.png`, `nye-m-table0..2.png`); head read from the page; pin row 16 of `docs/pinterest-pins.csv` checked.

Head: `<title>` "New Year's Eve With a Dog in a Cabin: Fireworks Plan | Paws & Passage" (69 chars with the site suffix; the `seoTitle` itself is 52, within the repo's 60 test, but the tail "Fireworks Plan" is at risk of truncating in results). Meta description 130 chars, contains the primary keyword once, accurate. H1 contains the primary keyword; the first paragraph repeats it. Canonical correct. Pin row 16 title and description match the page.

## Round-1 issues: verified
1. Title tag misses intent: FIXED (starts with the primary keyword, says "Fireworks Plan").
2. Thin buying advice / Petcube caveat / bed sizing: MOSTLY FIXED. Tree Line "most inaccurate" verdict is in prose and on the card; a measuring sentence for the Kurgo bed is present; a ranked "What to buy first" list exists. Not fully fixed: the Petcube is still a pick card (see issue 2).
3. Mobile table overflow: FIXED in the sense the rubric allows. The manager table is now three columns with the citation on the manager name; at 390 px it is 544 px inside a 350 px scroller with the "Swipe" hint, no page-level sideways scroll (document width 390). Readable.
4. Stray Christmas link and the Homer forward reference: FIXED (link sits after the table; the beacon paragraph now points to "If your dog runs").
5. "Checked for the 2026 season" overclaim and Dutch case: FIXED (replaced by a read-date sentence; the Dutch caveat is labelled "our note").

## Top issues (most important first)

1. **The dek and first screen do not give the answer.**
   Where: dek "How to check a "firework-free" claim, keep your dog from bolting in an unfamiliar place, and run the night of December 31." On desktop the first 900 px show breadcrumb, H1, dek, byline and the top of a large hero photo; "Do this first" begins after it. The dek names topics, not the decision.
   Fix: edit 1 (dek states the three actions). The hero height is a template matter.

2. **The Petcube pick card recommends a product the page tells the reader not to choose yet.**
   Where: the paragraph "If your dog has bolted before, add a tracker as a second layer" ends "If you want a tracker, read the tracker guide before choosing this one", and the card says "one independent reviewer rated its location accuracy lowest in its group". A buy button under a sentence that says "read another guide first" is a weak recommendation and the only pick that undermines itself. Honest, but it costs buying-advice clarity and the card ranks last in the buy list anyway.
   Fix: edit 4 (keep the paragraph and the link to the tracker guide, remove the `{{pick:petcube-gps-tracker|...}}` card here so the reader is sent to the guide that compares Tractive, Fi and Petcube).

3. **Pick cards use wrong icons.**
   Where: the KONG Classic card shows a bed icon; the Petcube and Ruffwear Beacon cards show a first-aid-suitcase icon (the Kurgo bed card shows a bed, correct). The icon is the first thing in the new spec card, so a chew toy drawn as a bed and a light drawn as a first-aid kit look like a template error at the buying moment (screenshots `nye-d-card0.png`, `nye-d-card2.png`, `nye-d-card3.png`).
   Fix: edit 5 (card template / product data, not article text).

4. **A trust sentence overcounts.**
   Where: "How sure we are": "the escape and recovery stories (a small, non-random sample of 8 news and first-person items)". The page tells four escape stories (Killington, Park City, Homer, the 60-mile dog) plus a Patch warning; "8" is the number of news and first-person sources in the Sources list, including non-story ones (Petco, Utrecht, Petbook).
   Fix: edit 2.

5. **The keyword-bearing section for the biggest sub-search is not worded like the search.**
   Where: H2 "What helps a noise-afraid dog". The SEO file says "dog fireworks new year's eve" and "dog scared of fireworks vacation rental" are the real searches; neither wording appears in a heading, and the article gives that section the least visible name on the page.
   Fix: edit 3.

## What works well
- The "firework-free" vetting section turns one documented case into a question list plus a copy-and-paste message to the host; no competing page we could find packages it that way.
- "How sure we are" with an "Open point / Check for yourself" table, and every gear paragraph ending in a "skip it if" line, make the page read as honest rather than as a gear pitch.
- The buy list is ordered correctly: free steps (tag, chip record) first, then the chew, bed, light, and the tracker last with a plan-cost caveat. No prices, ratings or stock claims anywhere; all eight product links (names and "See it at Amazon") are `rel="sponsored nofollow noopener"` Amazon links with the site tag, and no product mention elsewhere is unlinked or linked wrongly.

## Buyer walkthrough
1. Lands on "dog fireworks new year's eve" or "new year's eve with a dog in a cabin"; sees the H1 and dek, scrolls past the hero to the three-step "Do this first".
2. Reads the vetting questions and the host message; the manager table shows real policy wording.
3. Reaches "What to buy for the night, and what to buy first": each pick opens with the reader's situation and ends with who can skip it.
4. Clicks KONG or Kurgo; the card shows three fact chips, a "Why we picked it" line and "Details and specs".
5. Friction: the Petcube button sits under a "read the tracker guide first" sentence; the card icons are wrong; "Check the current price on the listing before you buy." repeats on every card.

## Mobile notes (390 px)
- No sideways page scroll (document and viewport both 390). The three tables scroll inside their wrapper with the "Swipe" hint.
- First screen is breadcrumb, H1, dek, byline and the top of the hero; no article text before scrolling. The meta row still wraps with a lone "·" before "Affiliate links disclosed".
- Spec cards stack cleanly: chips wrap to up to three lines, buttons are full size, no clipping.

## Specific edits to make
1. TEXT (dek): replace the dek with: "Check what "firework-free" really covers, keep your dog on a leash with current ID and a quiet room, and ask the host how far the nearest homes are before you book."
2. TEXT: in "How sure we are", replace "(a small, non-random sample of 8 news and first-person items)" with "(four escape stories from news and first-person items, a small non-random set)".
3. SEO: rename the H2 "What helps a noise-afraid dog" to "What helps a dog scared of New Year's Eve fireworks"; no other wording changes in the section.
4. PRODUCT: delete the line `{{pick:petcube-gps-tracker|A second layer for a dog that bolts|...}}`; keep the Petcube paragraph, the Tree Line sentence and the link to the tracker guide; in "What to buy first" item 5 change "The Petcube" to "A tracker, from our [tracker guide](/guides/if-your-dog-gets-loose-on-a-trip)" and keep the "only for a dog that has bolted before and an owner who accepts a paid plan" wording.
5. PRODUCT / template: give the pick-card icon a per-product value (toy for KONG, tracker for Petcube, light for Beacon) instead of the category default (owner or template change; no article edit).
6. STRUCTURE: under the "What helps a noise-afraid dog" table add: "Gear for the night is in [What to buy for the night](#what-to-buy-for-the-night-and-what-to-buy-first)." so a reader who wants the buy decision after the evidence finds it in one tap.

## Questions for the owner
- Do you want the Petcube kept on this page at all, given that the loose-dog guide already compares it with Tractive and Fi?
