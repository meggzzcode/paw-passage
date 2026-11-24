# Review (round 2): Keep a Dog Cool in the Car, at the Beach and in a Rental (keep-a-dog-cool-on-a-summer-trip)
Verdict: SHIP. Every round-1 issue is fixed; what remains is polish (repetition of the "thin evidence" stance, wrong spec-card icons, a hero crop) and sits at the pass line exactly.
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 5 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5  (sum 36 / 4 = 9.0)

Method: source `content/guides/keep-a-dog-cool-on-a-summer-trip.md`; round-1 review, FIX and SEO notes read; rendered page at localhost:4173 at 1280 and 390 wide (screenshots in the scratchpad `r2/` folder: `keep-a-dog-c-d-top.png`, `keep-a-dog-c-m-top.png`, `cool-d-card0..3.png`, `cool-m-card0..3.png`, `cool-d-hero.png`, `cool-m-table0..2.png`); head read from the page; pin row 15 of `docs/pinterest-pins.csv` checked.

Head: `<title>` "Keep a Dog Cool in the Car, Beach and Rental | Paws & Passage" (61 chars with the site suffix; `seoTitle` is 44, passes the repo's 60 test). Meta description 140 chars, primary keyword "keep a dog cool in the car" once, a clear reason to click. H1 "Keep a Dog Cool in the Car, at the Beach and in a Rental" contains the primary keyword at its start; the first paragraph answers it in the first 40 words. Pin row 15 matches the page.

## Round-1 issues: verified
1. Opening gave signs but no action: FIXED. First bullet "If your dog is showing these signs now" links to the steps, and the numbered steps now come before the temperature paragraph.
2. No vest / pad / water decision: FIXED. "Which one first" follows the table, and "What to buy first, in order" (bowl or bottle, vest if on foot, pad if resting) closes the page.
3. Pad pitched for the car seat: FIXED. Label "A gel pad for a cooled room or car", warnings first in the card, H3 "A pad for a cooled room or a cooled car".
4. Title too long / missing long-tail: FIXED (new seoTitle; two FAQs added: vest vs pad, rental without air conditioning).
5. 14/16 aside and temperature density: FIXED ("its own counts differ on the page"). The hero question: the hero image (dog drinking from a teal basin) matches the topic, but see issue 3 below.

## Top issues (most important first)

1. **The "evidence is thin" stance is stated in eight places.**
   Where: dek ("has little independent testing behind it"), bullet "Cooling gear has thin evidence", the "What independent evidence we found is thin" paragraph, the table column "What we could not find", "Which one first", FAQ "Do cooling vests and pads work?", the "What we could not confirm" table and "How sure we are". Each is accurate; together they slow a reader who has already got the point. Costs reader flow (4).
   Fix: edit 1.

2. **The spec-card icon is wrong on the vest card.**
   Where: the Ruffwear Swamp Cooler vest card shows a bed icon (wrong); the Green Pet Shop pad card also shows a bed (fine); the bowl card shows a drink-cup icon, the bottle card a cup with straw (acceptable). Screenshots `cool-d-card0.png`, `cool-m-card1.png`. Costs product placement (4) and layout (4).
   Fix: edit 2 (template / product data; the article text needs no change).

3. **The hero crop hides the point of the photo.**
   Where: the hero is a dog drinking from a basin, but at 1280 and 390 wide the first screen shows only the dog's head in foliage; the water appears at the bottom of the image, below the first screen on both viewports (hero 494 px tall on desktop). Alt text is accurate. The first screen therefore shows no cue about heat or water.
   Fix: edit 3 (template: set the object-position of the hero so the basin stays visible, or limit hero height).

4. **SEO: the page serves the car query in a headline but the body's heaviest section is not the car.**
   Where: the primary keyword "keep a dog cool in the car" has one short H2 "Never leave a dog in a parked car" and a plain-water bowl paragraph under "Hydration on the go"; there is no heading about keeping the car cool while driving (shade parking, air conditioning on, window use) and the page itself says it found no source on that. FAQs are 7, one over the 4 to 6 guideline.
   Fix: edit 4 and 5.

## What works well
- It resolves a conflict instead of choosing a side: AKC 105.8 F, AKC's pavement page 104/105/106 F and Cornell 105 F are shown side by side, with "call a vet at the signs, not at a number".
- The pad paragraph tells the buyer the maker's "shown to help" heatstroke wording is given no weight, and flags Chewy's four-hour claim against the maker's three. Product claims are all attributed to the maker; no prices, ratings or stock claims, and no first-hand experience.
- The ranked buy list is short and honest: bowl or bottle first, vest only if on foot, pad only if resting, with "Treat the vest and pad as optional". All 12 product links on the page (names and buttons) are sponsored Amazon links to the right products; no unlinked product mentions.

## Buyer walkthrough
1. Lands from "keep dog cool in car" or "dog cooling vest"; the first paragraph and the bullet list give the safety basics and a "signs now" shortcut.
2. Reads the options table (water, vest, pad, shade): honest, with "what we could not find".
3. "Which one first" gives the verdict: on foot, vest; resting, pad; every trip, water and shade first.
4. Vest and pad subsections give sizing, who should skip it and warnings; clicks "See it at Amazon" from the card.
5. Friction: the pad subsection is long; the cards use the wrong icons; the "What to buy first" list is at the very bottom, after the unknowns tables, so a skimmer finds the verdict only via "Which one first".

## Mobile notes (390 px)
- No sideways page scroll (document and viewport both 390). All three tables sit in a 350 px wrapper with the "Swipe" hint (table is 544 px wide); readable.
- First screen: breadcrumb, H1, long dek and the top of the hero; the meta row wraps with a lone "·" before "Affiliate links disclosed".
- Page is long (about 12 minutes); the table of contents is reachable, and cards stack cleanly with full-width buttons.

## Specific edits to make
(The page passes; these are optional and take the page toward 9.5.)
1. TEXT: keep the stance in the dek, the table and "How sure we are" only; in "Which one first" delete "(in other designs, on working dogs)" and in the FAQ answer "Do cooling vests and pads work?" keep as is. Remove the sentence "What independent evidence we found is thin." and begin the paragraph with "A 2022 study in the journal Animals looked at...".
2. PRODUCT / template: assign pick-card icons per product (vest, pad, bowl, bottle) instead of the category default.
3. LAYOUT / template: set the guide hero's object-position so the basin stays in the first screen at 390 px (owner or template change).
4. TEXT: under "Never leave a dog in a parked car", after the paragraph beginning "**Plan the day so the dog is never alone in the car (our suggestion).**" add one line: "While driving, we found no source on safe cabin temperatures, so use the air conditioning, shade the car at stops and offer water often (our suggestions, not tested)." Do not add any figure.
5. SEO: remove the FAQ "How do I tell if the ground is too hot for my dog's paws?" only if the owner wants 6; otherwise leave (it answers a real search and is not duplicated word for word in the body).

## Questions for the owner
- None needed to pass. Optional: confirm hero cropping is acceptable.
