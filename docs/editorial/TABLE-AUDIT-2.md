# Table audit 2 (10 guides)

Basis: sources at commit 88971cb (content/guides/*.md; src/content/guides/*.ts for first-aid, checklist, fence), cross-checked against the built pages on localhost:4176 (table counts match: bowls 2, Georgia 4, how-many-dogs 4, pet-fees 4, loose 2, NYE 3, fence 2; first-aid, cool, checklist 0). No chart or spec-grid components exist on these pages; the "pick" boxes are cards, not tables. Standard applied: necessary to a real decision, relevant to this page's question, not repeated elsewhere on the page, sourced, readable at 390 px (3 columns max).

## Per guide

### dog-travel-bowls-and-food-storage
1. "Our picks at a glance" (3 cols: Job | Pick | Size; 6 rows). Supports: shortlist. REMOVE. It duplicates the pick boxes and the "What the maker pages say" table; the Gunner row says "Not stated". The "Which dog travel bowl to pack" section carries the job-to-pick mapping.
2. "What the maker pages say" (3 cols: Product | Capacity | Cleaning and materials; 9 rows). Supports: sizing and dishwasher-safety. TRIM. Cut the "materials" half of column 3 and make it a "Dishwasher" yes/no/hand-wash column (the decision). Cut "no volume figure" and "Not stated" phrasing: drop the two Springland rows (no capacity) or fold them into one sentence. Drop the IRIS "Not stated" cleaning cell. Merge Kurgo Collaps A Bowl and Splash Free Wander (same 24 oz and cleaning) into one row. Result: about 6 rows, 3 short cells. Long cells wrap badly at 390 px as they stand.

### dog-travel-first-aid-kit-guide
No tables. Nothing to cut. Note: a stale summary string in the .ts (around line 319) still says "pick-by-situation table"; remove that wording.

### dogs-in-georgia-state-park-cabins
1. "The rules in one table" (2 cols; 9 rows). Supports: whether the trip works. TRIM. Keep rows: Which cottages, How many dogs, Fee, Leash, Extra charges. Cut Request and Unattended (each has its own H2 below: "How do you request" and "Can you leave a dog alone"), Cleanup and Noise (obvious, no decision).
2. "Which Georgia state parks have dog friendly cabins" (2 cols; 5 rows). Supports: picking a park. CONVERT to a 3-bullet list (Skidaway Cabin B, Mistletoe, Smithgall Garden Cottage) plus one sentence: "Fort Yargo and Red Top Mountain list cottages with no pet wording; call before booking (770-867-3489 for Fort Yargo)." Two of five rows say only "nothing stated"; Mistletoe has "no amount shown".
3. "State park cabin or private cabin" (3 cols; 4 rows). Supports: park versus private. TRIM. Drop the Sliding Rock row (dogs "Not stated"; it is the only row with no data). Keep the other three. Keep 3 columns but shorten the cells (the Cabin Rentals of Georgia fee cell is the longest). The "as of 2026-11-18" fee date is correct and should stay.
4. "What we could not confirm" (3 cols: Item | Why | Check for yourself; 5 rows). CONVERT to a 3-bullet list (nightly rate range, whether $50 is charged at booking or check-in, full cabin list) with the "ask" folded into each bullet. Drop the "Why" column and the service-animal row (it is not a limitation the reader can act on, and the rules page already says service animals are allowed).

### how-many-dogs-can-you-bring-to-a-vacation-rental
1. "What do vacation rental managers allow?" (3 cols; 5 rows). Supports: typical limits and the penalty for an extra dog. TRIM. Cut the rows "My Vacation Haven" and "One Vrbo listing, Blue Ridge": both have "Not stated" in column 3 and the latter is an unnamed, unverifiable listing. Keep Twiddy, Brindley, Cabin Rentals of Georgia (3 rows, all with a stated consequence).
2. "Two dogs: what the wording really means" (2 cols; 5 rows). Supports: decoding listing wording; unique to this page. KEEP. It is the page's most useful table and the cells are short enough for 390 px.
3. "What do extra dogs cost?" (3 cols: shape | calculation | total; 5 rows, hypothetical numbers). CONVERT. The numbers are invented and the fees guide has a stronger worked example. Replace with one sentence: "The same pet can cost $60 or $200 depending on whether the fee is per booking, per night, per pet or tiered, so ask for the total (see the pet fees guide)." If a table stays, keep only the tiered row, since that is the extra-dog case.
4. "What we could not confirm" (2 cols; 6 rows). CONVERT to 3 bullets. Cut the insurers row, the local-dog-limits row and the "November 2026 house-rules change (third-party source only)" row, which are speculative and give the reader nothing to do. Keep Airbnb override of host limit, arrival with more dogs than booked, and service animals.

### how-vacation-rental-pet-fees-work
1. "What 38 managers actually charge" (3 cols; 7 rows). Supports: fee ranges by structure. TRIM. Cut the "Managers (examples)" column entirely (name lists are noise; sources carry them). Cut the "Amount given, unit not stated" row (unusable) and merge "One-time, by dog size" into the per-stay row. The $0 row can become a trailing sentence. Result: 2 columns, about 5 rows.
2. "The four fee structures, priced" (3 cols; 4 rows). Supports: comparing the same stay under four structures; unique worked example. KEEP.
3. "Fees, deposits, holds and waivers" (3 cols; 4 rows). CONVERT to four one-line definitions (bold term, one clause). Column 3 "How to budget it" restates column 2 in generic words and is unsourced.
4. "How Airbnb and Vrbo display pet fees" (3 cols, 2 data cols; 3 rows). TRIM. Cut the Service animals row (duplicates the "Service animals are not pets" H2 two sections later). Keep "Fee structures" and "Where it shows". At 390 px, sentence-length cells in two data columns are cramped; shorten each to one clause.

### if-your-dog-gets-loose-on-a-trip
1. "Tag, microchip or tracker: what each does" (3 cols; 3 rows). REMOVE. The next three H3s ("The tag", "The microchip", "Trackers") cover the same does and does-not points in prose. Keep the prose; delete the table (or, if the owner prefers a summary, keep it and cut the prose duplicates instead, but not both).
2. Tracker comparison (3 cols: Tracker | Form and battery | Plan and dog size; 3 rows). Supports: choosing a tracker. KEEP. Trim the Fi cell "Collar page states no plan terms" to "Plan not stated by the maker" and put "dog size" first in the Tractive cell so it stays readable at 390 px.

### keep-a-dog-cool-on-a-summer-trip
No tables. Nothing to cut.

### new-years-eve-with-a-dog-in-a-vacation-rental
1. "What hosts and local rules say" (3 cols; 3 rows). Supports: how managers treat fireworks and holidays. CONVERT. The Vacasa row is filler (fee amount "not listed", "no fireworks text"). The fee column repeats the Cabin Rentals of Georgia fee already given on the pet-fee and Georgia pages. Replace with two sentences: Aunt Bug's prohibits fireworks and has holiday minimum stays; Cabin Rentals of Georgia prohibits firecrackers; two managers do not make the fireworks rule decisive for a booking, so ask the host.
2. "What helps a dog scared of fireworks" (2 cols; 5 rows). Supports: choosing what to buy and try; evidence summary, unique. KEEP. Cells are short enough at 390 px.
3. "What we could not confirm" (2 cols; 4 rows). CONVERT to bullets. Drop the "national count of lost dogs" row (no reader action). Keep: local fireworks rule, holiday fee rise, "is this trip a good idea" question for the vet.

### pet-friendly-vacation-rental-checklist
No tables (the 8-item checklist is a numbered list, which is the right form). A stale summary string in the .ts (around line 305) still says "booking decision table"; remove that wording.

### portable-dog-fence-and-playpen-guide-for-rentals
1. "Pens, gates and crates" product table (5 cols: Product | Height | Door | Floor protection | Best for; 4 rows). REMOVE. Five columns is unreadable at 390 px; every cell is repeated in the pick box and prose immediately below each product, "Not stated" and "Not applicable" appear in the cells, and "Best for" is repeated again in the pick-by-situation table. If a height comparison is wanted, replace with one sentence: "Heights run 24 to 48 in (MidWest sizes), 28 in (Carlson) and 26 in (North States gate)."
2. "Pick by situation" (3 cols; 5 rows). Supports: matching a rental scenario to a product. TRIM. Drop the "Key caution" column (cautions are in the product prose and pick boxes; the Jumper row's long caution breaks the phone layout) and drop the "Two dogs" row (no product advice, just a pointer to another guide). Keep 4 rows by 2 columns.

## Summary counts (21 tables)

| Verdict | Count | Tables |
| --- | --- | --- |
| KEEP | 4 | how-many wording; fees "four structures priced"; loose tracker comparison; NYE "what helps" |
| TRIM | 7 | bowls maker pages; Georgia rules; Georgia state vs private; how-many managers; fees "38 managers"; fees Airbnb vs Vrbo; fence pick-by-situation |
| CONVERT | 7 | Georgia parks; Georgia could-not-confirm; how-many extra-dog cost; how-many could-not-confirm; fees deposits/holds; NYE hosts; NYE could-not-confirm |
| REMOVE | 3 | bowls picks-at-a-glance; loose tag/chip/tracker; fence product table |

Pages with zero tables: first-aid kit, keep-cool, checklist. Wider than 3 columns on a phone: only the fence product table (5 columns), recommended for removal. Empty or mostly "not stated" columns: bowls picks (Gunner), bowls maker pages (3 cells), Georgia parks (3 of 5 rows say nothing), how-many managers column 3 (2 of 5), fence product table (Door, Floor protection), NYE Vacasa row. Pattern to enforce: every "What we could not confirm" table becomes a short bullet list with no "Why" column.

## Applied

Applied to the current sources (several tables had already been removed or changed since 88971cb).

- Bowls "picks at a glance": already gone, nothing to do. "What the maker pages say": TRIMMED to 3 columns (Product | Capacity | Dishwasher), 4 rows; the two Kurgo bowls merged, Gunner/Springland/IRIS rows removed (their facts stay in the picks and prose, no "Not stated" cells); intro and FAQ wording updated.
- First-aid: no audit table; the current kit-by-place table (3 cols, 3 short rows) KEPT; stale "pick-by-situation table" blurb in the .ts fixed.
- Georgia rules: TRIMMED to 5 rows (Request, Unattended, Cleanup, Noise removed; each has its own section or is obvious). Georgia parks: CONVERTED to 3 bullets plus one sentence for Fort Yargo and Red Top Mountain (with the phone number). State vs private: Sliding Rock row removed, its stated facts (no pet fees or breed or weight limits, fenced yards at select cabins) kept in one sentence under the table so source 14 stays cited. "Could not confirm": already converted to the "What to ask the park" list, nothing to do.
- How many dogs: managers table TRIMMED to 3 rows (Vacation Haven and the unnamed Vrbo listing removed; Vacation Haven is still cited in the fee bullets). "Two dogs wording": KEPT. "Extra dogs cost" invented-numbers table: CONVERTED to one sentence pointing to the pet fees guide. "Could not confirm": CONVERTED to 3 bullets (insurers, local limits, Nov 2026 house-rules rows dropped).
- Pet fees: "38 managers" TRIMMED to 2 columns, 4 rows (examples column, unit-not-stated row and one-time row merged; $0 managers and the unit-less amounts moved into a sentence). "Four structures priced": KEPT. "Fees, deposits, holds": CONVERTED to four one-line definitions plus one sentence. "Airbnb vs Vrbo": TRIMMED to 2 rows with one-clause cells; the service-animal row dropped, and the Vrbo service-animal source (5) is now cited in the service-animals section.
- Loose dog: tag/chip/tracker table REMOVED (prose kept); its AKC Reunite ID-tag source is now an inline link in "The tag". Tracker comparison table: already gone, nothing to do.
- Keep cool, checklist: no tables; stale "booking decision table" blurb in the checklist .ts fixed.
- NYE: hosts table CONVERTED to two sentences (Vacasa filler dropped). "What helps": KEPT. "Could not confirm": CONVERTED to 3 bullets (national count row dropped, plus two rows duplicating the host question list).
- Fence: both tables already gone (heights are in the pick boxes); nothing to do.

Counts: 7 trimmed, 7 converted, 1 removed, 3 kept (first-aid kit table, how-many wording, fees four structures, NYE what-helps counted as kept); 5 audit tables already gone.
