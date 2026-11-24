# Review: If Your Dog Gets Loose on a Trip: Prevention, ID and the First Hour (if-your-dog-gets-loose-on-a-trip)
Verdict: FIX FIRST. Strong content and a real first-hour plan, but the same four products render three times, one pick card cites a source that is not in the Sources list and borrows another site's "Best waterproof" label, and the page is 18,000 px tall on desktop.
Overall: 7.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 3 | Layout 3 | Trust 4 | SEO fit 4 | Differentiation 5  (sum 31 / 4 = 7.75, shown as 7.8)

Method: source `content/guides/if-your-dog-gets-loose-on-a-trip.md`; rendered page at localhost:4173 read at 1280 and 390 wide (screenshots in the scratchpad `g6/` folder); head read from the page; pin row 14 of `docs/pinterest-pins.csv`; catalog records for tractive-dog-6, fi-series-3-plus, petcube-gps-tracker, ruffwear-the-beacon-dog-safety-light in `content/products.yml`.

Head: title tag "Dog Escaped on a Trip: First Hour Plan | Paws & Passage" (56 chars, fine). Meta description 150 chars, matches seoDescription, accurate.

## Top 5 issues (most important first)

1. **Ruffwear Beacon pick card borrows a ranking label and points at a source that is not in the Sources list.**
   Where: the pick under "Being seen after dark" (`{{pick:ruffwear-the-beacon-dog-safety-light|Best waterproof|...`). The card shows the eyebrow "BEST WATERPROOF", the text "Tree Line Review labels it 'Best waterproof'", and its "Source" link goes to `https://www.treelinereview.com/gearreviews/best-light-up-dog-collars`. Sources item 23 is a different Tree Line page (`best-gps-dog-collars`), and the sentence above the card tells the reader the waterproof figures are "the maker's claims". The catalog record says Tree Line "does not state it re-tested it". The label reads as our ranking and contradicts the prose.
   Fix: change the label to "Clip-on light", the why-text to "The maker lists three modes, three colors, up to 20 hours of run time and waterproofing to 1 m for 30 minutes, on a clip for Ruffwear collars and light loops." and the URL to `https://ruffwear.com/products/the-beacon-safety-dog-light` (the maker page, source 22). See edit 1.

2. **The four products appear three times, so the page repeats itself and runs 18,000 px.**
   Where: the inline pick cards (under "Three trackers" and "Being seen after dark"), then an H2 "Picks by criteria" with four full spec cards after "What to buy first", then "Gear for this trip" with four more cards at the bottom. Each repeat restates the same specs, watch-outs and "More like this" link. A reader who has just finished "What to buy first" is pushed into a second set of spec lists before the FAQ.
   Fix: drop the `gear:` frontmatter block (or whatever feeds "Picks by criteria") so the page keeps the inline cards plus the compact "Gear for this trip" row. Move the two or three watch-outs that are not already in prose (Tractive collar width 1.1 in, Fi sizing) into the tracker paragraphs. See edit 2. If the template cannot drop the block without losing the "Check before you buy" lists, ask the owner (question 1).

3. **Doubled brand names on the tracker cards and the "Picks by criteria" headings.**
   Where: card and section headings render "Tractive Tractive DOG 6", "Fi Fi Series 3+", "Petcube Petcube GPS Tracker" (brand + catalog name, and the catalog name already starts with the brand for Tractive and Petcube; "Fi Series 3+" is brand-prefixed by the card). The same defect shows in the NYE article for Petcube. This looks like a typo on a page about a lost dog and weakens trust at the buying moment.
   Fix: in `content/products.yml` set `name: DOG 6` (Tractive), `name: Series 3+` (Fi) and `name: GPS Tracker` (Petcube), or, better, have the card template skip the brand when the name already starts with it. Check the other pages that use these records before changing. See edit 3.

4. **The first buy on "What to buy first" has no product or selection guidance.**
   Where: "What to buy first", item 1 "A tag with a number you will answer", and "The tag" under "ID that actually works". The article says the tag is the one layer a finder can use without a scanner, yet gives the reader four tracker and light links and nothing about choosing a tag (engraved or slide-on, legibility, ring). The buyer's most important purchase is the one the page does not help with.
   Fix: add a short, labelled-as-our-suggestion checklist to "The tag" (see edit 4) with no invented product claims. If the owner wants a tag product, it must be added to the catalog first (question 2).

5. **The answer is below the fold on both viewports, and the closing buy list sits after the evidence tables.**
   Where: first screen at 1280 and 390 shows breadcrumb, H1, dek, byline and a very large hero photo only; "If your dog just bolted, start here" begins below it. Also "What to buy first" comes after "How sure we are" and the unknowns table.
   Fix: move the "What to buy first" H2 to sit before "How sure we are" (edit 5), and add one sentence under the H1-adjacent first paragraph so a panicking reader sees the action without scrolling (edit 6). The hero height is a template matter (question 3).

Other defects noted: mobile meta row shows an orphan "·" bullet on its own line; "23 official sources" counts news items (KPCW, Upworthy, Petbook) and a review site as "official" (template label, see question 3).

## What works well
- The first hour is built from AKC Reunite and ASPCA steps with our own additions labelled "(our suggestion)", and the three recovery stories are each marked as one case, with the Killington outcome stated as unknown.
- The tag / chip / tracker table says what each layer does and does not do, and the microchip registry check (find the registry with AAHA's lookup, then contact the registry) is a step most tracker round-ups skip.
- The Petcube paragraph carries the Tree Line "most inaccurate" verdict as one reviewer's view, and the Fi paragraph states plainly that its page gives no carrier or subscription terms.

## Buyer walkthrough
1. Lands from "dog got loose on vacation", reads steps 1 to 6 and the minute-by-minute list; the content answers the urgent need.
2. Reads the ID table, then the tracker checklist, which is a genuine decision tool (plan, coverage, size range, battery, water rating, warranty).
3. Meets three tracker paragraphs each followed by a card; the Ruffwear card follows with the mislabelled "Best waterproof" and a Tree Line link.
4. Reaches "What to buy first", acts on 1 and 2 (tag, chip record), then scrolls into a second full set of the same spec cards.
5. Friction: no side-by-side of the three trackers, no tag guidance, doubled product names, and no clear "skip it if" line for Petcube/Fi beyond the watch-outs lists.

## Mobile notes (390 px)
- Both tables fit (350/350, no sideways scroll). Good.
- Page is about 27,600 px tall on mobile; the triple product repeat is the main cause.
- Meta row wraps with a stray "·" alone on the second line; hero image takes most of the first screen so no article text appears before scrolling.

## Specific edits to make
1. PRODUCT: in `content/guides/if-your-dog-gets-loose-on-a-trip.md`, replace the line `{{pick:ruffwear-the-beacon-dog-safety-light|Best waterproof|Tree Line Review labels it "Best waterproof"; the maker lists up to 20 hours of run time and waterproofing to 1 m for 30 minutes.|https://www.treelinereview.com/gearreviews/best-light-up-dog-collars}}` with `{{pick:ruffwear-the-beacon-dog-safety-light|Clip-on light|The maker lists three modes, three colors, up to 20 hours of run time and waterproofing to 1 m for 30 minutes, on a clip for Ruffwear collars and light loops.|https://ruffwear.com/products/the-beacon-safety-dog-light}}`.
2. STRUCTURE: remove the `gear:` array from the frontmatter (the four entries tractive-dog-6, fi-series-3-plus, petcube-gps-tracker, ruffwear-the-beacon-dog-safety-light) so "Picks by criteria" no longer renders; keep `relatedProducts` so "Gear for this trip" stays. Then append to the Tractive paragraph: "It will not fit collars wider than 1.1 in." (maker figure) and keep the Fi sizing sentence already present.
3. PRODUCT: stop the doubled brand: set `name` in `content/products.yml` to `DOG 6`, `Series 3+` and `GPS Tracker` for tractive-dog-6, fi-series-3-plus and petcube-gps-tracker (or fix the card template to omit the brand when the name already begins with it). Re-render and confirm the NYE article card for Petcube reads once.
4. TEXT: under "### The tag", after the sentence ending "Check the ring and attachment before every trip.", add: "Our suggestion, not from a source: choose a tag you can read at arm's length, put the mobile number on it as engraved or stamped text rather than a sticker, and look at the attachment ring for wear before each trip. A second tag with the host's number for the stay is optional." (no product named, no claims).
5. STRUCTURE: move the whole "## What to buy first" block (list plus the "Next step" line) to sit directly after "## Checklist: before you leave and on arrival" and before "## How sure we are".
6. TEXT: directly after the sentence "The door was open for four seconds, and now your dog is gone, in a town whose street names you learned this morning." and before "Do these in order." leave as is; add to the very end of the numbered list's lead-in (replace "Do these in order.") with: "Do these in order; if you only have time for three, search near where the dog was last seen, call your microchip registry, and call your host."  (all three are steps already sourced or labelled in the list).
7. SEO: change `seoTitle` to `Dog Got Loose on Vacation: First Hour Plan` (matches the "dog got loose on vacation" keyword already in `research.relatedKeywords`; 42 chars before the site suffix).
8. TEXT: in "Trackers: GPS and Bluetooth", the sentence "It depends on other people's devices being nearby, so our view is that it is weaker than cellular GPS on a trail or at night." is fine; add before it nothing. Instead in the FAQ answer "Can a Bluetooth tag replace a GPS tracker?" end with: "For a dog that bolts in a place you do not know, treat a Bluetooth tag as a backup, not the plan." (our view, labelled by the existing "our view" wording in the body).
9. STRUCTURE: add under "Three trackers, and who each suits" a 3-column table, columns "Tractive DOG 6 | Fi Series 3+ | Petcube GPS Tracker", rows only from the catalog: "Form" (clip-on / collar with tracker built in / small tracker), "Listed battery" (up to 2 weeks with Power Saving Zones, 6 days without / up to 3 months / up to 30 days in power save mode), "Plan stated on the maker's page" (subscription required / not stated on collar page / paid plan required), "Dog size stated" (above 8.8 lbs, collars up to 1.1 in / modular XS to XL / none, universal fit). Put citation numbers 10, 12, 21 in the column headings so each column is cited once (keeps 390 px width).
10. SEO: add FAQ "Where do I post a lost dog online?" only if an already-cited source (ASPCA "Finding a Lost Pet" or AKC Reunite) lists online sites; otherwise leave it out. Check source 2 first (question 4).

## Questions for the owner
1. Can the "Picks by criteria" block be removed for this guide without losing the "Check before you buy" lists, or is the block required for every guide with `gear:`?
2. Do you want a tag/ID product in the catalog (affiliate-eligible), or should the "tag" step stay product-free?
3. Template: can the hero be capped in height so the first article paragraph shows on mobile, and can "23 official sources" be relabelled "23 sources" on pages that cite news items and a review site?
4. Did the ASPCA or AKC Reunite pages we read name online lost-pet databases? If yes, add one sentence; if we did not read it, leave it out.
