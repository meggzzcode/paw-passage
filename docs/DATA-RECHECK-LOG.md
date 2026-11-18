# Pet-policy data re-check log

The 38-manager dataset (src/content/manager-policies.ts, public/pet-policies-38-managers.csv, docs/data/) is a dated snapshot. Re-read it on a schedule so no number on the site goes stale.

## How to re-check (about half a day)
1. Open each `source_page` in the CSV and compare dog limit, weight limit, breed rule, pet fee (amount and unit), pool/hot tub, minimum age and leaving-a-dog-alone rules against the page as it reads today.
2. Edit `src/content/manager-policies.ts`, then run `bun scripts/make-policy-csv.mjs` to rebuild the CSV, and update `dataDate`.
3. Search the guides for the dated counts (for example "22 of 38", "11 of 38", "3 of 38") and update them; the homepage and data page compute theirs from the file.
4. Add a row below.

## Where dated counts appear in guides
Fees guide, how-many-dogs guide, large-dogs guide, checklist guide, breed guide, no-pets guide (penalties), can-you-leave-alone guide, New Year's Eve guide (holiday surcharge: none of the 38 pages mention one), the `/dogs` collection pages (src/content/dog-types.ts), and the packing/tool copy.

## Log
| Date | Who | Managers read | Changed | Notes |
|---|---|---|---|---|
| 2026-11-18 | Paws & Passage Editors | 38 of 49 attempted (11 blocked) | first snapshot | Every figure re-checked against live pages; fields for pool/hot tub, minimum age and unattended dogs added same day |
