# Editorial scorecard, batch 2 (read-only review, 2026-11-24)

Method: Playwright Chromium on the frozen build (localhost:4174) at 390 and 1280 px. Word counts are the full rendered `<article>` (includes header, FAQ, sources list, related), so the prose body is roughly 400-600 words lower. No horizontal scroll at 390 on any page. Trust count = affiliate/"how sure"/"not tested"/"not vet advice"/"we researched"-type statements in the article text. Scores are 1-10 judgments from reading, not user tests.

## Patterns across the batch
1. Same template everywhere: Buying checklist, then "What we could not confirm", "How sure we are", "What to buy first", FAQ, "What next?", "Sources and how we researched this". Every page reads like a research memo, not a travel-publication piece. A phone reader scrolls 18-23k px (about 25-28 screens).
2. Trust is over-stated. Each page says "trustworthy" 5-17 times: affiliate banner plus Amazon Associate line, "22 sources cited / Affiliate links disclosed" chips, "How we built this", "could not confirm" table, "How sure we are", maker-claim caveats on nearly every product sentence. One honest block would do more.
3. Numbered source markers render as superscript links, e.g. `<sup class="cite"><a ... aria-label="Source 1">1</a></sup>`, but the markdown source is `[[1]](https://...)`. 29-46 per page, often stacked ("[[3]] [[4]] [[5]]") and 3-5 in one sentence in tables. They are tiny tap targets on a phone and each opens a new tab (target=_blank), so a thumb mis-tap leaves the page. Cut to about 1 per claim and drop them from table cells.
4. Spec-sheet voice. Recurring tics: "the maker says / per the maker / the maker's own claim" (many times per page), "Skip it if...", "It is the pick if you have room for only one bowl", "we do not rank", "we could not confirm". Accurate but joyless, and it hedges even harmless facts.
5. Checklist padding: each buying checklist ends with a filler line that restates another ("Confirm your dog's girth falls inside a listed size before you order"; "Check the maker's capacity and care notes on the listing before you order"; "Compare the container's capacity with the size of your dog's food bag before you order"). Delete these.
6. Overlap between pages: first-aid and food storage sit inside the cabin packing list AND have their own guides (first-aid kit, bowls). Packing list should link out and shrink.
7. Product cards are thin: 1 on the first-aid page, 4-6 elsewhere, always repeating the paragraph above them. Affiliate fit is honest but the pick card duplicates its own prose.

---
## 1. Dog Cabin Packing List: What to Pack and Buy
URL /guides/dog-friendly-cabin-packing-list | src/content/guides/dog-friendly-cabin-packing-list.ts | about 3,860 words (4,750 in source) | phone scroll 23,630 px | 29 cites | trust statements about 5 core plus 22-sources chip | 0 tables, 6 asides/boxes, 4 pick cards, 127 list items, 18 H2
- A fit: right audience, but it is a catch-all. Half the page is first aid, ticks, winter stoves, ID folders that other guides own.
- B intro: "A dog cabin packing list is your dog's usual routine plus what a remote cabin cannot supply: tidy food storage, a way to dry muddy paws at the door, a bed that is clearly theirs, a light for dark toilet trips, offline records and a first-aid kit. A cabin is not a hotel room." Definition-style opener; the second sentence is a stock line. Needs a scene (muddy paws, dark deck, no cell signal), not a glossary entry.
- C length: CUT about 35%. Padded: "Pack list at a glance" (duplicates short answer, buying checklist and H2s: three lists saying the same thing), "Tick prevention", "Cold weather, wood stoves", "A practical canine first-aid kit" (own guide exists), "Identification, records".
- D voice: "Pack for the property you booked, not just for the dog." "A cabin is not a hotel room." Repetition of storage advice in short answer, checklist, food section, bear note. "(tidy storage, not bear-proof)" hedges recurring.
- E format: no table at all on a packing list; a comparison/pack table with "have / buy / ask host" columns would be the natural form. Long bullet runs; 127 list items reads as wall of bullets on a phone. Cites in the short answer stack "[1] [13]".
- F utility/affiliate: only 4 buy items, so commerce is natural but light; "no product needed" entries are honest but filler. Good: host-question list.
- G verdict: STRUCTURAL EDIT. Priority P1.
- Scores: appeal 5, format 5, readability 6, utility 7, commercial 7, AVERAGE 6.0
- Fix: (1) replace the three overlapping lists with one 3-column table (Bring / Buy / Ask host); (2) cut first aid, ticks, wood stove to 3-4 lines each with links to the first-aid guide and bowls guide; (3) rewrite the opener as a scene; (4) drop stacked cites in the short answer.

## 2. Dog Hiking Gear for a Cabin Vacation: What to Buy
URL /guides/dog-hiking-gear-for-a-cabin-vacation | content/guides/dog-hiking-gear-for-a-cabin-vacation.md | about 3,540 words (4,250 source) | scroll 19,785 px | 43 cites (highest density) | trust about 13 | 2 tables, 7 boxes, 5 pick cards, 104 list items, 16 H2
- A fit: strong. Rules-before-gear framing suits a cabin trip.
- B intro: "Most trail trips need less gear than the lists say, and the rules decide where your dog can go before the gear does. Here is what to check, how to size it and what the park and forest pages actually require." Good first sentence, contrarian and useful. Second is a roadmap sentence; trim.
- C length: CUT about 25%. Padded: "Trail etiquette in a few lines", "Seeing the dog at dusk", the long "could not confirm" table (6 rows about hedges) plus a "How sure we are" list repeating it.
- D voice: "Neither page describes a test on steep terrain, so this is shared advice from two sources, not a measured result." and "Our own reasoning, labeled as ours:" are over-hedged for a harness vs collar point. Lots of "NPS, PetMD and Orvis agree".
- E format: the first table (trail / worth buying / why) is the best element in the batch; the "Why" column carries 3 source names, which is noise. 43 markers look like a footnote storm. Page is well structured but scroll is long.
- F utility/affiliate: natural; gear follows the rules. Cards are fine. Leave.
- G verdict: LIGHT EDIT (heavier trim of trust blocks). Priority P2.
- Scores: appeal 6, format 7, readability 6, utility 8, commercial 7, AVERAGE 6.8
- Fix: merge "could not confirm" and "How sure we are" into one 4-row box; cut etiquette and dusk sections to two lines; delete source names from the table "Why" column; cap cites at about 20.

## 3. Dog Life Jacket for Lakes and Beaches: Size and Fit
URL /guides/dog-life-jacket-for-lakes-and-beaches | content/guides/dog-life-jacket-for-lakes-and-beaches.md | about 3,550 words (4,210 source) | scroll 19,609 px | 46 cites (most) | trust about 16 | 3 tables, 6 boxes, 4 cards, 87 list items, 14 H2
- A fit: strong; fit is the real buying problem and safety matters to a lake-weekend dog parent.
- B intro: "Measure by girth, fit-test in shallow water, then pick one of three jackets. Two maker pages disagree on what to do between sizes, and no federal standard exists." Best dek of the batch: concrete and useful. The article itself then opens with the buying checklist, with no intro prose at all.
- C length: CUT about 25%. Padded: "What a 'life jacket' label does and does not tell you", "Features worth checking" (restates the checklist), duplicated disclaimers "treat as marketing, not a measurement".
- D voice: "It claims up to 50% more flotation but gives no baseline or rating, so read that as marketing, not a measurement." Repeats the no-standard point at least 4 times (dek, checklist 4, jacket paragraphs, label section). "a reasonable precaution; a dog that only wades may not need one" is vague on the one question readers have: does my dog need one?
- E format: three-jacket sections are long paragraphs (about 150 words each) before a card repeating them; mobile reader needs a size/girth table up front. Fit test steps are good as numbered list. 46 cites is the worst readability hit.
- F utility/affiliate: natural; "buy EzyDog first if big dog" is a real recommendation. Whole Dog Journal citation helps.
- G verdict: LIGHT EDIT to STRUCTURAL EDIT. Priority P1 (safety plus high-intent keyword).
- Scores: appeal 6, format 6, readability 5, utility 8, commercial 8, AVERAGE 6.6
- Fix: add 2-3 sentence intro above the checklist (dog tires, dock, where lakes need a jacket); put one girth/weight table before the product prose; shorten each jacket paragraph to 3 sentences plus card; merge "label" and "features" sections; reduce cites to about 20.

## 4. Dog Ramp for Car or SUV: Ramp or Steps for a Big Dog?
URL /guides/dog-ramp-or-steps-for-the-car-and-cabin | content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md | about 3,915 words (4,840 source) | scroll 21,000 px | 33 cites | trust about 14 | 4 tables, 7 boxes, 5 cards, 87 list items, 14 H2
- A fit: good for large or older dogs; the "and cabin" half is thin (one stairs section). Slug and H1 differ (slug says "steps for the car and cabin").
- B intro: "Your big or older dog can no longer hop into the car. Compare ramps and steps on maker specs, measure your vehicle, and plan for cabin stairs." Clear, empathetic first sentence; a stronger second sentence would name the stakes (joint injury, lifting 70 lb).
- C length: CUT about 25%. Padded: "Dog ramp specs side by side" (6 columns, 5 products, 33 cite markers inside the table cells), "What vet and kennel-club sources say about jumping and stairs", the arithmetic section is useful but explained at length.
- D voice: "Every figure below is what the maker's page said on 2026-11-18, read that day." Repeats "No incline stated" across rows (filler cell). "The three ramp pages say the rating was independently tested and name no tester" is a conspicuous caveat repeated 3 times.
- E format: the wide table is the main phone problem; 6 columns at 390 px forces in-table scroll or crammed text, and cites inside cells are unreadable. Better as stacked cards per product with 4 key specs.
- F utility/affiliate: natural and useful (the slope arithmetic and vehicle-height measuring are genuinely helpful). Almost all products from one maker (PetSafe Happy Ride), which looks thin as a comparison for a buyer.
- G verdict: STRUCTURAL EDIT. Priority P1.
- Scores: appeal 6, format 5, readability 6, utility 8, commercial 6, AVERAGE 6.2
- Fix: convert the spec table to 5 compact product rows (name, rating, length, weight) without cites in cells; move cites to the line under; add a second brand or admit the one-brand sample in one line; fold the vet-sources section into 3 bullets; align H1 and slug.

## 5. Dog Travel Bowls and Food Storage: What to Pack First
URL /guides/dog-travel-bowls-and-food-storage | content/guides/dog-travel-bowls-and-food-storage.md | about 3,745 words (4,420 source) | scroll 21,248 px | 31 cites | trust about 7 | 2 tables, 8 boxes, 6 cards (most), 90 list items, 14 H2
- A fit: fine, but a low-stakes topic given 3,700 words; it is the weakest "reason to read" of the batch and a bowl is a one-line decision.
- B intro: "Which dog travel bowl and food container to pack, with capacity, cleaning and materials for nine products from the makers' own pages (six with a pick card), plus what the CDC, FDA and park agencies say about water and food on the road." This is a description, not an intro, and it is one 45-word sentence. The page then opens with the buying checklist. "(six with a pick card)" is internal bookkeeping leaked to readers.
- C length: CUT about 40%. Padded: the "Collapsible bowls, bottles and food carriers" table duplicating the picks, "Water first", the 7-row could-not-confirm table (Springland bottle volume, Gunner material), the rental-kitchen section.
- D voice: "Skip it if you want a lid" / "It is the pick if you have room for only one bowl" repeated in each pick; "a maker that does not claim it has not claimed it" (checklist 6) is a tautology. "Nothing here rests on owner reports or surveys" is trust theatre.
- E format: picks are tidy and scannable; the cards add little over the bold lead lines. Too many boxes (8) make the page feel like all callouts.
- F utility/affiliate: natural for bowls; food containers weaker. Bear-country and Giardia notes are the most useful bits.
- G verdict: STRUCTURAL EDIT, consider MERGE of the bowl/food parts into the cabin packing list plus a short buying guide. Priority P1.
- Scores: appeal 4, format 6, readability 6, utility 6, commercial 7, AVERAGE 5.8
- Fix: rewrite dek to under 25 words ("Pick one collapsible bowl, one lidded food tub, and carry your own water"); cut to about 2,200 words; drop Springland/Gunner unknowns unless the products stay; keep water/Giardia and bear storage; delete checklist items 6 and 7.

## 6. Dog First Aid Kit for Travel: What to Carry to a Cabin
URL /guides/dog-travel-first-aid-kit-guide | src/content/guides/dog-travel-first-aid-kit-guide.ts | about 3,070 words | scroll 18,822 px | 33 cites (8 distinct sources) | trust about 12 | 1 table, 3 boxes, 1 pick card, 104 list items, 19 H2 (most)
- A fit: high-value, safety-critical, strong for remote cabins. The only article with a real stakes scene.
- B intro (after "The short answer"): "Your dog cuts a paw on a rock two miles from the cabin, and the nearest clinic is 40 minutes away. A dog first aid kit for travel decides the next hour, and this guide shows what to put in it and which size to carry where, and it names the one ready-made trail kit we researched." Best opening in the batch; second sentence is run-on and self-referential. But the page leads with a dense "short answer" paragraph before it, which buries the scene.
- C length: CUT about 20%. Padded: "How we built this list" (also repeated in "How sure we are" and sources), "Pick by situation", "Learn the basics", "Keep the kit current", and 19 H2s for 3,000 words.
- D voice: "We researched one ready-made kit... so that is the only product we feature" repeated three times; "Nothing here is veterinary advice" repeated; "we lean cautious and say so". Reads honest but sells nothing.
- E format: the AVMA checklist is bullet-grouped under bold headings, which is good; it is a natural printable checklist with no checkbox or download. Many H2s fragment the page. One table only.
- F utility/affiliate: strongest utility, weakest commerce: exactly one product (12 oz Trail Dog kit) in a 3,000-word page. Honest, but a buyer judging affiliate yield sees a content page without a basket. Do not force; add 1-2 more kit researched, or accept the page as a trust/authority asset.
- G verdict: LIGHT EDIT. Priority P1 (safety accuracy check of every dosage/poison statement before launch; edit order after).
- Scores: appeal 7, format 6, readability 6, utility 9, commercial 4, AVERAGE 6.4
- Fix: open with the paw-on-a-rock scene, move short answer under it; cut H2 count to about 12 by merging "Pick by situation", "Ready-made or build", "Buying checklist"; make the checklist printable (checkbox style); add a second researched kit (cabin-size) or a thermometer/muzzle card; cut repeated disclaimers to one.

---
## Summary table
| # | Article | Appear | Format | Read | Utility | Comm | AVG | Verdict | Pri |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Cabin packing list | 5 | 5 | 6 | 7 | 7 | 6.0 | STRUCTURAL EDIT | P1 |
| 2 | Hiking gear | 6 | 7 | 6 | 8 | 7 | 6.8 | LIGHT EDIT | P2 |
| 3 | Life jacket | 6 | 6 | 5 | 8 | 8 | 6.6 | LIGHT to STRUCTURAL | P1 |
| 4 | Ramp or steps | 6 | 5 | 6 | 8 | 6 | 6.2 | STRUCTURAL EDIT | P1 |
| 5 | Bowls and food storage | 4 | 6 | 6 | 6 | 7 | 5.8 | STRUCTURAL / MERGE | P1 |
| 6 | First aid kit | 7 | 6 | 6 | 9 | 4 | 6.4 | LIGHT EDIT | P1 |
Batch average: about 6.3.
