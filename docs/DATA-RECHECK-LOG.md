# Pet-policy data re-check log

The 38-manager dataset (src/content/manager-policies.ts, public/pet-policies-38-managers.csv, docs/data/) is a dated snapshot. Re-read it on a schedule so no number on the site goes stale.

## How to re-check (about half a day)
1. Open each `source_page` in the CSV and compare dog limit, weight limit, breed rule, pet fee (amount and unit), pool/hot tub, minimum age and leaving-a-dog-alone rules against the page as it reads today.
2. Edit `src/content/manager-policies.ts`, then run `bun scripts/make-policy-csv.mjs` to rebuild the CSV, and update `dataDate`.
3. Search the guides for the dated counts (for example "22 of 38", "11 of 38", "3 of 38") and update them; the homepage and data page compute theirs from the file.
4. Add a row below.

## Where dated counts appear in guides
Fees guide, how-many-dogs guide, large-dogs guide, checklist guide, breed guide, no-pets guide (penalties), can-you-leave-alone guide, New Year's Eve guide (holiday surcharge: none of the 38 pages mention one), the `/dogs` collection pages (src/content/dog-types.ts), and the packing/tool copy.

## Article-specific upkeep
- **vacation-rentals-with-no-pet-fee:** re-read the three fee-free pages (Sliding Rock Cabins, Hapey Cabin Rentals, Twiddy & Company) at least twice a year; re-check Twiddy's per-home wording, since it comes from a blog sample of 10 homes; update "3 of 38" if any page changes.
- **christmas-week-in-a-cabin-with-a-dog:** refresh each November: holiday minimum stays and cancellation examples (A Blue Ridge Vacation, Aunt Bugs, Hearthside, Tahoe Vacation Rentals), poison hotline numbers and fee wording, and the "no holiday pet surcharge stated" finding.

## Log
| Date | Who | Managers read | Changed | Notes |
|---|---|---|---|---|
| 2026-11-18 | Paws & Passage Editors | 38 of 49 attempted (11 blocked) | first snapshot | Every figure re-checked against live pages; fields for pool/hot tub, minimum age and unattended dogs added same day |


## Upkeep for the 2026-11-18 batch (moved from the guides' research blocks)

### what-a-dog-really-costs-on-a-vacation-rental
- A dated boarding-versus-bringing comparison if an official or primary source for boarding prices is found.

### can-dogs-go-in-a-rental-pool-or-hot-tub
- Re-read the seven pages at the next data re-check and add any new manager that states a pool or hot tub rule.
- Look for a veterinary page that addresses hot tub use specifically.

### pet-friendly-listing-red-flags
- Re-check Vrbo's house-rules field and whether long text is cut off, once an official page says.

### vacation-rentals-with-no-dog-weight-limit
- Re-read the eight manager pages on a schedule and log changes.
- Add per-listing weight fields if a manager publishes them.

### puppy-at-a-vacation-rental
- Re-read the five manager pages when we refresh the dataset.
- Add a minimum-age column to the tools if more managers state one.

### if-your-dog-gets-loose-on-a-trip
- Replaces src/content/guides/dog-id-tags-and-gps-trackers-for-travel-guide.ts and the lost-dog section of the New Year's Eve guide; the owner retires the old pieces.
- The AAHA, AVMA and CDC pages were not used; the AAHA lookup statement is cited as reproduced on AKC Reunite's FAQ.
