# Table audit 3 (9 guides)

Basis: committed sources at HEAD 88971cb (content/guides/*.md; the two fenced-yard and large-dog guides live in src/content/guides/*.ts). Built pages at :4176 were not re-diffed, so judge against the sources. "Phone" means 390 px; any 3+ column table with sentence-length cells is flagged because it stacks into cards or scrolls.

Rule applied: a table stays only if it holds data the reader needs for a real decision, that appears nowhere else on the page. Prose or pick-box repeats, "unknown/not stated" filler, and hypothetical-number tables that duplicate another guide are cut.

## protect-your-car-interior-from-a-dog-on-a-road-trip

1. Under "Seat cover, hammock or cargo cape: pick by vehicle and dog" (Setup | Size | Goes | Suits, 3 rows, 4 columns). REMOVE.
   - Every size (45x56, 63x56, 52x62) is repeated in the three pick boxes and the following prose.
   - "Goes" and "Suits" restate the pick headlines and the section headings below.
   - 4 columns is unreadable on a phone.
   - Edit: delete the table. Keep the one sentence after it ("None of these pages lists a vehicle compatibility chart, so the tape measure is the real check"). Add "measure the seat or cargo floor first" to the sentence.

## puppy-at-a-vacation-rental

1. Under "What we could not confirm" (Question | What we found | Check for yourself, 5 rows). REMOVE.
   - Rows 2 and 3 ("none of the five quoted a lower rate / a deposit") duplicate the "Does a puppy count" section.
   - Row 4 (vaccines) duplicates "This guide gives no vaccine schedule".
   - Row 5 (the other 33 managers) duplicates "The other 33 managers did not state a minimum age".
   - Row 1 (the fee does not cover accidents) is covered in the accidents section.
   - Every "Check" cell says ask in writing, which the "What to send the host" message already does.
   - Edit: delete the table. Keep the heading only if one sentence remains: "Not stated on the pages we read: puppy rates, deposits, vaccine schedules. Ask in writing (message above); ask your vet about shots."

No other tables. The pick boxes are not chart blocks.

## two-large-dogs-in-one-car

1. Under "Where should two large dogs ride? Layouts by vehicle" (Layout and vehicle | What the sources say | What is unknown, 4 rows, 3 columns). CONVERT.
   - The "What is unknown" column is filler ("Everything about the dogs in a sudden stop", "Whether your seat has two good belt positions").
   - Row 4 (barrier, no restraint) is a layout nobody should choose, and the barrier section covers it.
   - The Clickit Sport and Kurgo facts repeat in the harness and barrier sections.
   - Edit: replace with 3 bullets.
     - Two crates in the cargo area: CPS says cargo anchors are not always weight-rated, so ask the vehicle maker.
     - One harness per dog on the rear seat.
     - Harnesses plus a barrier (not 2-door cars or mini vans).
   - Drop the unknown column and row 4.
2. Under "What this guide cannot tell you" (Unknown | Why | Check, 5 rows). CONVERT.
   - Rows 2 (CPS on sharing a crate) and 3 (cargo anchors) repeat the layout and crate sections.
   - Row 5 (state law) repeats the "Do not skip the law check" bullet.
   - Row 4 repeats the harness weight section.
   - Keep only row 1, the real gap: no independent crash test of two dogs side by side.
   - Edit: one sentence ("No independent tester has crash-tested two dogs side by side; CPS's crate study used one dog per crate."). Delete the rest.

## vacation-rental-secure-fenced-yard (src/content/guides/*.ts)

1. Under "Start with your dog, not a universal fence height" (Your dog's pattern | What to investigate | What should pause the booking, 6 rows, 3 columns). TRIM.
   - It is the page's core decision tool, so keep it, but it is dense for a phone.
   - Delete row 6 ("Reacts to outside movement"). It belongs to the reactive-dog guide, which covers sightlines.
   - Delete the "What to investigate" column and fold the key item into the first column ("Digs: ground contact, soft soil"). Keep "What should pause the booking", the actionable red flag.
   - Result: 5 rows x 2 columns, or stacked cards on a phone.

No other tables. The three pick boxes are not chart blocks.

## vacation-rental-with-a-reactive-dog

No tables. The "trigger by trigger" section is a bold-label list (Look for / Ask) and is fine. Nothing to cut.

## vacation-rental-with-a-senior-dog

No tables. Nothing to cut.

## vacation-rentals-that-welcome-large-dogs (src/content/guides/*.ts)

1. Under "What real weight limits look like" (Manager | What the page says | Counted, 6 rows, 3 columns). KEEP, with a trim.
   - This is unique, sourced data: the weight limits and per-dog versus combined counting.
   - Cut the Hearthside cell to `"no larger than 35 pounds"; "SOME cabins will allow larger pets"` and drop the $75 fee quote, which appears later in "Where to look".
   - Shorten the region parentheticals.
   - Keep all 6 rows.
2. Under "Decode the wording" (Wording | Example or reading | What to ask, 8 rows, 3 columns). CONVERT.
   - Rows 1, 2, 4 and 6 repeat the first table's examples, and the prose after that table already explains per-dog versus combined.
   - Row 8 ("Any size") duplicates the no-weight-limit section.
   - Edit: replace with 4 bullets, each with its own question:
     - "under" versus "or less": is a dog at exactly the number accepted?
     - "Large dogs considered": has this dog been approved, and at what charge?
     - Soft limit: which cabins, and what extra fee?
     - Bundled conditions: does my dog meet every condition, not only weight?
3. Under "What we could not confirm" (Question | Status | Check, 4 rows). REMOVE.
   - Row 1 repeats "The other 30 managers say nothing about weight".
   - Row 2 repeats the Hearthside discussion.
   - Row 3 repeats the "Do Airbnb and Vrbo set a weight limit?" section.
   - The "Status" column is mostly "Unknown" or "Not stated" filler.
   - Edit: delete the table. Keep the closing sentence about the six-of-38 count.

## vacation-rentals-with-no-pet-fee

1. Under "Who charges, for contrast" (Manager | What the page says | Also on the page, 4 rows, 3 columns). CONVERT.
   - The page's question is who charges nothing. Big Bear, Rosemary Beach, Cabin Rentals of Georgia and Resort Realty are the same examples that appear in the cost guide's dataset table and in the large-dog guide, so this is a third copy.
   - Edit: one sentence ("Of the 38 managers, 22 state a charge, from $20 a night to 'up to $1,000'; e.g. Big Bear at $40 per pet per night, Rosemary Beach at $300 per pet"). Link to what-a-dog-really-costs for the table. Keep the "$0 plus cleaning can equal a fee home" paragraph.
2. Under "Read the total, not the pet line" (Line | Fee-free home | Home with a fee, 5 rows, 3 columns). REMOVE.
   - It is invented numbers, a smaller duplicate of the cost guide's three-quote table.
   - The sentence beneath it already makes the point ("the home with a $60 pet fee costs $40 less overall").
   - Edit: delete the table and keep the sentence, rewritten with the numbers inline ("$800 + $120 cleaning = $920 versus $720 + $100 + $60 = $880, invented to show the method"). Link to the cost guide's comparison.
3. Under "What we could not confirm" (Question | Check for yourself, 4 rows). REMOVE.
   - Rows 1 and 2 repeat the per-manager "What else is charged" paragraphs.
   - Row 3 repeats the Twiddy "This one is fragile" paragraph.
   - Row 4 repeats the platform-section advice.
   - Every Check cell says ask the host or the home's listing.
   - Edit: delete the table.

## what-a-dog-really-costs-on-a-vacation-rental

1. Under "The pet fee line, in our dataset" (Manager | What the page says | Source, 6 rows, 3 columns). TRIM.
   - The Source column is empty in every row, which is a dead column. The citations sit in the line beneath the table.
   - Delete the Source column.
   - Delete the Twiddy row, which is a $0 case covered in the no-pet-fee guide.
   - Delete the Rosemary Beach row. It is the same per-pet shape as Tahoe.
   - Keep Big Bear (per night), Tahoe (per pet, plus tax), AMI Locals (per stay, combined weight) and Resort Realty (up to $1,000). These show the units differ, which is what the reader must compare.
   - Result: 4 rows x 2 columns.
2. Under "The rest of the bill" (Line | Airbnb | Vrbo, 5 rows, 3 columns). TRIM.
   - Several cells are filler: "Not covered in the pages we read" (Airbnb deposit), "Check the listing" (extras), and "Pets and cleaning are separate standard fee types".
   - Delete the Optional extras and Cleaning fee rows, and the Deposit row (the paragraph below already covers deposits).
   - Keep Service fee and Taxes, which show what is hidden until checkout.
   - Result: 2 rows x 3 columns, with Airbnb cells at most 8 words.
   - If it will not fit at 390 px, CONVERT to two bullets ("Airbnb: service fee depends on the listing; taxes may not show until checkout. Vrbo: displayed price includes service fees; taxes are added at checkout").
3. Under "Three quotes, side by side (hypothetical)" (Line | Rental A | Rental B | Rental C, 6 rows, 4 columns). KEEP.
   - It is the only worked comparison of definite cost versus cash up front, the page's central decision.
   - It is a 4-column table but the cells are short numbers.
   - Trim the first row to bare totals ("$1,000", "$1,125", "$1,050") and the pet row to "$200", "$0", "$150", and put the per-night versus per-stay explanation in the caption.
   - The label "(hypothetical)" is already present.
4. Under "What we could not confirm" (Open question | Check for yourself, 5 rows). CONVERT.
   - Row 3 duplicates the "How to compare quotes" steps.
   - Row 5 (your own fuel, gear, boarding) is no-information filler, since the page already says it has no source for those figures.
   - Row 4 (cancellation) is generic.
   - Keep rows 1 and 2 as two bullets: whether a fee or tax applies to the pet charge, and when a deposit is released.

## Summary

Total tables: 15 (reactive-dog and senior-dog have none).

| Verdict | Count | Tables |
| --- | --- | --- |
| KEEP | 2 | large-dogs weight table (with a cell trim), cost quotes table |
| TRIM | 3 | fenced-yard pattern table, cost dataset table, cost rest-of-bill table |
| CONVERT | 5 | two-dogs layouts, two-dogs unknowns, large-dogs decode wording, no-pet-fee contrast, cost unconfirmed |
| REMOVE | 5 | car size table, puppy unconfirmed, large-dogs unconfirmed, no-pet-fee hypothetical total, no-pet-fee unconfirmed |

Pattern: nine of the 15 tables are "What we could not confirm" blocks (5), duplicated manager lists, or sizes already in pick boxes. Every "unconfirmed" block restates prose above it. Cutting the five REMOVE tables and converting the five CONVERT tables takes the 9 guides from 15 tables to 5. Of those 5, only the weight table and the quotes table are essential.

Wide tables on a phone: the car Setup table (4 columns), the cost quotes table (4 columns, short cells, acceptable), and the 3-column sentence tables in fenced-yard, large-dogs and two-dogs layouts (all addressed above).

Empty column: the "Source" column in the cost dataset table. Mostly-filler columns: "What is unknown" (two-dogs layouts), "Status" (large-dogs unconfirmed), "Also on the page" (no-pet-fee contrast).

## Applied

Applied to the current sources (several tables had already been removed or changed since 88971cb). Sources and marker numbering unchanged; all sources still cited.

- protect-your-car-interior: Setup table already gone. Nothing to do.
- puppy-at-a-vacation-rental: "What we could not confirm" table already gone. Nothing to do.
- two-large-dogs layouts table: CONVERTED to 3 bullets (cargo crates, harness per dog, harness plus barrier) with CPS and Kurgo markers; barrier row and "unknown" column dropped; the barrier-section pointer to the table now states the 2-door and mini van limit.
- two-large-dogs unknowns table: already converted to three bullets (incl. the no two-dog crash test gap). Kept.
- fenced-yard pattern table: TRIMMED to 5 rows x 2 columns; "Reacts to outside movement" row removed; check items folded into column 1, pause flag kept. The decision table (evidence vs decision, 2 columns) is short and kept.
- reactive-dog: no tables. Nothing to do.
- senior-dog: a 6-row, 3-column manager rules table had appeared; CONVERTED to a list (filler cells dropped, all six sources cited).
- large-dogs weight table: KEPT, 6 rows; Hearthside $75 quote dropped (still in "Where to look"); region parentheticals shortened to state.
- large-dogs decode table: CONVERTED to 4 bullets with questions (plus measured vs self-reported).
- large-dogs unconfirmed table: REMOVED; six-of-38 sentence kept.
- no-pet-fee contrast table: CONVERTED to one paragraph with the four managers, markers 18, 8-11 and a link to the cost guide.
- no-pet-fee hypothetical totals table: REMOVED; numbers inline ($920 vs $880) with a cost-guide link.
- no-pet-fee unconfirmed table: REMOVED.
- cost dataset table: Source column already gone; Twiddy and Rosemary Beach rows removed (4 rows x 2 columns); both facts moved into the source sentence with markers 10 and 13.
- cost rest-of-bill table: TRIMMED to Service fee and Taxes (3 columns, short cells); deposit, extras and cleaning facts moved to one sentence.
- cost quotes table: KEPT; first and pet rows reduced to bare totals; per-night vs per-stay explanation moved into the caption.
- cost unconfirmed table: CONVERTED to two bullets (fee or tax on the pet charge; deposit release).
