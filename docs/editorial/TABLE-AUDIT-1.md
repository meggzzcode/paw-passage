# TABLE AUDIT 1: ten guides

Scope: every markdown table (and chart-like block) in 10 guides, judged from the built pages at localhost:4176 and the committed sources at HEAD 88971cb. No SVG or canvas charts exist in the article bodies; the only chart-like blocks are the `{{pick:...}}` product boxes, which are not audited as tables but are named below where a table duplicates them. Tests applied to each column: needed for a real decision, relevant to this page's question, not repeated elsewhere on the page, sourced, readable at 390 px (more than 3 columns is flagged).

## Summary

17 tables. KEEP 1, TRIM 7, CONVERT 4, REMOVE 5.

| Guide | Tables | KEEP | TRIM | CONVERT | REMOVE |
| --- | --- | --- | --- | --- | --- |
| airbnb-pet-damage-charge-after-checkout | 3 | 0 | 2 | 1 | 0 |
| can-dogs-go-in-a-rental-pool-or-hot-tub | 2 | 0 | 1 | 1 | 0 |
| can-you-leave-a-dog-alone-in-a-vacation-rental | 1 | 0 | 1 | 0 | 0 |
| christmas-week-in-a-cabin-with-a-dog | 1 | 0 | 0 | 1 | 0 |
| cold-weather-dog-gear-for-winter-cabin-trips | 1 | 0 | 1 | 0 | 0 |
| dog-car-safety-harness-and-crate-guide | 2 | 0 | 1 | 0 | 1 |
| dog-friendly-cabin-packing-list | 1 | 0 | 0 | 0 | 1 |
| dog-hiking-gear-for-a-cabin-vacation | 1 | 0 | 0 | 0 | 1 |
| dog-life-jacket-for-lakes-and-beaches | 1 | 0 | 0 | 0 | 1 |
| dog-ramp-or-steps-for-the-car-and-cabin | 4 | 1 | 2 | 1 | 1 |

Pattern: the worst offenders are "at a glance" tables that re-list what the picks bullets, the pick boxes and the buying checklist already say (packing list, hiking, life jacket, CPS listings, ramp arithmetic), and "what we could not confirm" tables that restate prose (airbnb, pool, ramp). Tables over 3 columns on a phone: only the ramp specs table (6). Filler columns or rows: airbnb clocks (Vrbo "Not stated"), ramp specs ("No incline stated" in 3 of 5 rows), life-jacket Dawson row ("lists no ranges"), pool table column 3 (restates the quote).

---

## 1. airbnb-pet-damage-charge-after-checkout (3 tables)

**T1. "How long does a host have to charge for damage? The three clocks"** (3 cols: Clock, Airbnb, Vrbo; 3 rows). Decision: is the claim late, and how long do I have. Verdict: TRIM.
- Cut the "Guest response" row. Its Vrbo cell is "Not stated on the pages we read" (filler) and the 24-hour Airbnb figure is already step 2 of "Do this first".
- Keep "Host claim window" (14 days Airbnb / 14 days Vrbo) and "Appeal" (60 days / Contact Us, no deadline). The 60-day appeal is the only figure not in "Do this first" (the "Two things trip people up" paragraph repeats it, so shorten that paragraph, not the table).
- Fix stray trailing commas in the cells ("for damage requests," / "for damage," / "after the stay,"). Result: 3 cols, 2 rows, fits 390 px.

**T2. "I paid a pet fee. Can they still charge for dog hair?"** (3 cols: Situation, What the sources say, Your focus; 4 rows). Decision: can I contest this line item. Verdict: CONVERT.
- Column 2 restates the paragraph above it (fee covers expected costs; stains listed as reimbursable). Delete it.
- Row 4 ("Listing said no pets") is a different question from "I paid a pet fee"; delete it.
- Replace with three bullets: ordinary hair after a paid fee: ask what extra work was needed; stain, odor or scratches: dated photos and an itemized claim; dog not declared: read the listing and booking terms.

**T3. "What we could not confirm"** (2 cols: Open point, Who to ask; 5 rows). Decision: what to ask support. Verdict: TRIM.
- Keep row 1 (does Airbnb enforce the 14 days; the quoted question to send) and row 2 (what an appeal should include).
- Cut row 3 (pet fee vs hair) and row 4 ("reasonable"): both are already scripted in "What to write back" and the host message. Cut row 5 (Vrbo dispute timelines): T1 already says "no deadline on the page".

## 2. can-dogs-go-in-a-rental-pool-or-hot-tub (2 tables)

**T1. "What the seven pages say"** (3 cols: Manager, What the page says, Does it name a hot tub or spa; 7 rows). Decision: is a pool/hot tub ban normal and will mine bite me. Verdict: TRIM.
- Cut column 3: it is derived from the quote in column 2 and the short answer already says "five of the seven also name the hot tub or spa". Where the exception matters (Newman-Dailey "pool area", Twiddy blog), the "Two details matter" paragraph covers it.
- Shorten the quotes to the operative clause (Newman-Dailey's leash/county sentence is noise here; Twiddy's "save their water time for the ocean" quote can become "pool allowed, dogs not").
- Keep all seven rows (unique primary evidence, sourced). Result: 2 cols, readable at 390 px.

**T2. "What we could not confirm"** (2 cols: Open question, Who to ask; 4 rows). Verdict: CONVERT.
- Row 1 repeats the intro (31 of 38 silent) and the "What to ask the host" section; row 2 (cleaning charge amount) is stated in the Brindley Beach row; row 3 (hot tub temperature) repeats the hot-tub section ("No source we read gives a safe hot tub temperature"). Only row 4 (liability) is new, and the reader cannot act on it beyond "read the agreement".
- Replace with one sentence: "We found no cleaning-charge amount, no safe hot tub time or temperature for a dog (ask your vet) and nothing on liability (read the rental agreement)."

## 3. can-you-leave-a-dog-alone-in-a-vacation-rental (1 table)

**T1. "What do hosts actually write?"** (3 cols: What the listing says, What it probably means for your dinner, What to do; 5 rows). Decision: how to read a house rule. Verdict: TRIM.
- Merge columns 2 and 3 into one action column ("What to do"). Column 2 is partly tautological ("No unattended pets" -> "Someone must stay with the dog") and is our interpretation, unsourced.
- Cut row 4 ("Pets mentioned, nothing about alone time -> Unknown -> Ask"): tautological, already said in "Is it allowed?" ("If the rules are silent, you have an unanswered question") and in the host message.
- Cut row 5 ("No furniture"): the table's own cell admits it is "not about alone time"; the crate and furniture section covers it.
- Keep rows 1-3 (no unattended / crate required / by prior arrangement) as 2 cols x 3 rows. The "What managers say" bullets below overlap row 1-2; keep the bullets (sourced) and drop the table's "probably means" prose.

## 4. christmas-week-in-a-cabin-with-a-dog (1 table)

**T1. "What does cancellation look like?"** (2 cols: Manager, Cancellation wording; 3 rows). Decision: which cancellation terms to ask for. Verdict: CONVERT.
- The page itself says "These are three managers, not a pattern", and the reader is not booking with these managers. The only transferable facts are: some cabin managers sell an optional 7 to 8 percent guarantee for a refund window (15 to 30 days before arrival), and some use a sliding scale (full 30+ days, 50% 7 to 30 days, none inside 7).
- Replace with two sentences carrying those facts and the existing advice (ask about a sick dog, road closures and pet-fee refund). Tahoe is a lake-town manager and Aunt Bugs states "no cancellation policy"; neither is Christmas-specific.

## 5. cold-weather-dog-gear-for-winter-cabin-trips (1 table)

**T1. "How cold is too cold, by dog type"** (2 cols: Dog, What the sources say plus our italic reading; 4 rows). Decision: does my dog need a layer. Verdict: TRIM.
- Cut row 1 (thick double coat: "handle cold best, paw care first"): the "At a glance" bullets already say "Skip the fleece for a thick double coat". Move the breed names (PetMD/Cornell) to one sentence.
- Cut row 4 (puppy, senior, ill: "ask your vet"): the intro paragraph already gives the PetMD thresholds (below 32 F for small, thin-coated, very young, old or sick dogs).
- Keep rows 2 (short or thin coat: pack a layer near or below 32 F) and 3 (small or toy breed: cover belly and chest). The mixed source-plus-italic cell is hard to read on a phone: split each into "Dog" and "Do this" and drop the restated source wording.

## 6. dog-car-safety-harness-and-crate-guide (2 tables)

**T1. "Harness or crate?"** (3 cols: Factor, Crash-tested harness, Secured crate; 5 rows). Decision: which restraint type. Verdict: TRIM.
- Cut "Where it goes" (put it in the column headers: "Harness: rear seat, on the belt" / "Crate: cargo area, anchored").
- Cut "Main risk" ("correct sizing and fit" / "correct anchoring and sizing"): restates buying criteria 3 to 6.
- Keep "Vehicle needs", "Dog needs" and "At each stop". Flag: "Dog needs" is our own reading, unsourced; the "Pick by situation" bullets repeat it, so keep one of them. 3 cols with long cells is borderline at 390 px.

**T2. "What the CPS listings say"** (3 cols: Product and model, Sizes on the CPS listing, Test dog and date; 3 rows). Verdict: REMOVE.
- Duplicates the Harness pick, Crate pick and Small-dog picks prose and their pick boxes (test dog weight, date, strap kit).
- "Sizes on the CPS listing" is noise (the Atom row is just "One size").
- The Clickit Sport "Small 25 lb" cell asserts a figure the prose says "we did not verify", so the table contradicts the page. If a worked example of reading a listing is wanted, keep one sentence on one listing.

## 7. dog-friendly-cabin-packing-list (1 table)

**T1. "Our picks at a glance"** (3 cols: Job, Pick, Size as the maker states it; 4 rows). Verdict: REMOVE.
- Duplicates the dek, the "Buying checklist" list (container, towel, bed, light) and the pick boxes later on.
- Column 3 (12.75 quarts, 31 x 14 in, bed sizes, 20 h run time) is spec detail that belongs in the pick boxes, and the table needs the "Swipe sideways" hint on a phone.
- Optional: add the four product names to the matching Buying checklist items.

## 8. dog-hiking-gear-for-a-cabin-vacation (1 table)

**T1. (untitled, under "At a glance: our picks")** (2 cols: Trail or situation, Worth buying; 4 rows). Verdict: REMOVE.
- It is the same four rows as the "At a glance" bullets directly above it (leash, harness, boots, light) and again the "A short kit for most cabin hikes" list. The bullets also carry the product names and the water-bowl row the table omits.

## 9. dog-life-jacket-for-lakes-and-beaches (1 table)

**T1. "Size ranges side by side"** (3 cols: Jacket, Sizing basis, Smallest to largest; 3 rows). Verdict: REMOVE.
- Duplicates the "At a glance" bullets (DFD XL 90+ lb 30-48 in; Float Coat XXS 13-17 in to XL 36-42 in), the three jacket paragraphs and pick boxes, and fit-test step 1 (sizing is by girth).
- It shows only the smallest and largest size, not a usable chart; the Dawson row is filler ("XS to XL; the page lists no ranges").
- Fold one sentence into the Dawson paragraph: "the maker page lists no girth ranges, so ask before ordering."

## 10. dog-ramp-or-steps-for-the-car-and-cabin (4 tables)

**T1. "Dog ramp specs side by side"** (6 cols: Product, Maker's weight rating, Size as listed, Weight, Height or incline stated, Other maker details; 5 rows). Verdict: TRIM. Six columns will not read at 390 px.
- Cut "Height or incline stated": "No incline stated" appears in 3 of 5 rows and the prose says it once already; the step heights (21.25, 24.75, 28 in) are in the shortcut table.
- Cut "Other maker details" (side rails, traction, folds, latch): not a decision input and repeated in the pick boxes.
- Merge Size and Weight into one cell (e.g. "28 to 70 in, 14 lb"). Result: 3 cols (Product, Weight rating, Length and weight), 5 rows.

**T2. "How steep should a dog ramp be? The arithmetic"** (3 cols: Ramp length, Height at 18 degrees, Height at 20 degrees; 4 rows). Verdict: REMOVE.
- The 18-degree heights (19, 22, 27 in) are repeated in T3's "Why" column and in the pick paragraphs; the 20-degree column is used nowhere else.
- The "47 in, shortest setting" row is tautological (nobody sets a ramp to minimum to reach a tall floor).
- Replace with one sentence giving the formula (length x sin of angle) and the one sourced 18 to 20 degree figure, which is a single behaviorist's number.

**T3. "A quick decision shortcut"** (3 cols: Your measured height, Look first at, Why; 5 rows). Decision: which product for my vehicle. Verdict: KEEP (the one decision table on the page).
- Optional cut if 390 px feels cramped: fold "Why" into "Look first at" ("Compact, reaches about 22 in"). The pick paragraphs also say "Start here if your floor is about 20 to 22 in"; trim those sentences, not the table.

**T4. "What we could not confirm"** (3 cols: What we cannot tell you, Why, Check for yourself; 4 rows). Verdict: CONVERT.
- Row 2 (steepness: no maker states an incline) is the third statement of that fact (specs column, intro, FAQ). The "Why" column restates earlier sections.
- Replace with three bullets: senior or arthritic suitability (ask your vet); the folded size of the Folding Ramp, the Compact's width and height and the hitch step's height range (ask the maker); whether a ramp can go on rental steps (ask the host).

---

Note on pick boxes: ramp, life jacket, packing, harness and cold-weather tables all restate facts that the `{{pick:...}}` boxes or "At a glance" bullets already carry; the removals above are what stops the same figure appearing three times per page.

---

## Applied

Re-checked against the current sources (several tables had already been removed since 88971cb). Result: 17 audited tables; 5 removed, 5 converted, 5 trimmed, 1 already gone, 1 kept as already trimmed.

- airbnb T1 clocks: TRIM, cut "Guest response" row (Vrbo "Not stated" filler), 2 rows x 3 cols. T2 pet-fee table: CONVERT to 3 bullets, dropped the "Listing said no pets" row. T3 unknowns: TRIM to the two Airbnb support rows.
- pool T1 seven pages: TRIM, dropped the hot-tub column, shortened Newman-Dailey and Twiddy quotes, all seven rows kept. T2 unknowns: CONVERT to one sentence (cleaning charge, hot tub temperature, liability).
- leave-alone T1: TRIM to 2 cols x 3 rows (listing wording, what to do); dropped "pets mentioned" and "no furniture" rows.
- christmas T1 cancellation: CONVERT to prose with the guarantee and sliding-scale facts; markers [2], [5], [6] kept inline.
- cold-weather T1: TRIM to 2 rows (thin coat, small breed) as "Dog / Do this"; double-coat breed names moved to one sentence; puppy/senior row dropped (PetMD thresholds already in the intro).
- harness-crate T1: TRIM, dropped "Where it goes" (moved to headers) and "Main risk". T2 CPS listings: REMOVE (also removes the unverified Clickit "Small 25 lb" figure); every CPS source stays cited in prose.
- packing list T1: REMOVE; one sentence names the four pick categories, product names and sizes remain in the prose and pick boxes.
- hiking T1: already removed in the current source; nothing to do.
- life jacket T1: REMOVE; Dawson paragraph now says the maker page lists no girth ranges, so ask before ordering.
- ramp T1 specs: TRIM to 3 cols (Product, Maker's weight rating, Length and weight), dropped the "Not stated" hitch weight. T2 arithmetic: REMOVE, replaced by one sentence with the formula and 18/20 degree heights. T3 shortcut: already removed in the current source. T4 unknowns: CONVERT to 3 bullets (senior/spine, missing sizes, rental steps).
