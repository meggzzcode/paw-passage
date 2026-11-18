# Accommodation expansion (2026-11-18)

Status labels: DONE (on the branch), BLOCKED, RECOMMENDED, NEEDS-YOU.
Eight new stay records were added under `content/stays/`. All are `status: unverified`, with no photo, `photoPermission: false`, no `lastVerified` and no `affiliateId`. Nothing was visited and no host was contacted. Every page below was read on 2026-11-18 with a plain page fetch; no login or bot-check workaround was used. Descriptions are our own paraphrase. Pet-policy lines quote short phrases and name the source.

## Scope limits found
- `stayYamlSchema` only allows `state: georgia` or `california`. North Carolina, Tennessee and Florida stays cannot be added without a schema change (not my file). RECOMMENDED if the owner wants them: widen the state enum, `destinations.ts` and the filters together.
- `src/test/stay-indexing.test.ts` "each stay's affiliateId matches the listing id in its sourceUrl..." assumes every stay is a Vrbo stay with an approved affiliate link. It now FAILS for the non-Vrbo stays and for the Vrbo stays without a link. Not my file; the test should only check stays that have an `affiliateId`. I left `affiliateId` out as instructed.
- Towns `tybee-island` and `fort-bragg` and `ventura` have no destination page, so the page shows the town name only. `blue-ridge` and `mendocino` exist.
- The indexing rule treats `bedrooms: 0` as missing, so a studio can never pass; RECOMMENDED: treat 0 as stated.

## New stays
Fields not stated by a page are `not-confirmed` or omitted. "Indexable" is the result of `stayIndexability` run against all visible stays (including the duplicate-description check).

| # | Slug | Source read | Indexable |
|---|---|---|---|
| 1 | tybee-family-and-pet-friendly-with-privacy-fence | https://www.vrbo.com/689968 | YES |
| 2 | take-a-paws-close-to-downtown-blue-ridge | https://www.vrbo.com/2827825 | YES |
| 3 | woof-in-the-woods-cabin-blue-ridge | https://exploregeorgia.org/blue-ridge/places-to-stay/cabins-cottages/dog-friendly-cabin-rentals | NO: dog limit not stated; sleeps, bedrooms, bathrooms missing; 3 of 6 sections |
| 4 | that-cabin-on-that-lane-blue-ridge | https://www.vacasa.com/unit/128736 | NO: dog limit not stated |
| 5 | rosemarys-retreat-mendocino-oceanfront | https://www.vacasa.com/unit/1004493 | YES |
| 6 | coastal-bliss-fort-bragg-hot-tub-ocean-views | https://www.vacasa.com/unit/1004433 | YES |
| 7 | large-oceanfront-home-cleone-fort-bragg-hot-tub | https://www.vacasa.com/unit/1004430 | NO: no weight limit, pet fee, fence or large-dog information |
| 8 | beach-bungalow-pierpont-ventura-dogs-stay-free | https://www.vrbo.com/2295009 | YES |

### 1. Tybee Island, GA (Vrbo, property page)
Filled: 3 bed / 2 bath / sleeps 9 with beds, dog limit 3, large dogs yes (inferred from "999 lbs per pet", noted as our reading), beach true, distances, check-in 4 PM, out 10 AM, amenities, rating note. Not stated: pet fee, fence description (title says "Privacy Fence"; recorded as `not-confirmed` with a note), hot tub, breed rules, address. Includes our own note that Tybee beaches bar dogs, taken from a local listing seen in search results, not from this page; check city rules before relying on it.

### 2. Take a Paws, Blue Ridge, GA (Vrbo)
Filled: 3 bed / 3.5 bath / sleeps 8, beds, 2 pets total, 50 lb, hot tub yes, distances, check-in/out. Not stated: pet fee, breed rules, fence size or whether fully enclosed (title says "fenced yard", recorded `not-confirmed` with a note so it does not match the fully-fenced filter).

### 3. Woof in the Woods, Blue Ridge, GA (Explore Georgia listing)
Filled: multiple dogs welcome (no maximum stated, so `maxDogs` left empty), no breed or size limits (large dogs yes, breed restrictions no), fully fenced yard (full), no pet fees (none). Not stated: sleeps, bedrooms, bathrooms, address, hot tub, distances. The page says its text is provided by the destination and not owned by Explore Georgia; only facts are used, paraphrased. Best match for the multi-dog / large-dog / fenced / no-fee needs but cannot be indexed until a booking page states size facts and a dog limit. The listing says it can be booked on Airbnb, Booking.com, Evolve, Vrbo and Marriott Homes and Villas; I did not read those pages (Marriott returned 403, which I did not work around), so the source URL is the tourism listing and there is no booking link.

### 4. That Cabin on That Lane, Blue Ridge, GA (Vacasa)
Filled: 5 bed / 3 bath / sleeps 10 with beds, fully fenced backyard with "over 800 feet of fencing" (full), private 6-person hot tub, amenities, parking, 21+ rule, cancellation note, rating (2 reviews). Not stated: dog count, weight limit, pet fee, check-in/out, address.

### 5. Mendocino oceanfront home, CA (Vacasa)
Filled: 4 bed / 3 bath / sleeps 8, 2 dogs 50 lb or under (large dogs no), yard "enclosed and gated" (kept `not-confirmed` for fence, quoted in notes), oceanfront (beach true), step-free access, quiet hours, 21+. Not stated: nightly pet fee amount, check-in/out, distance to a beach access point, bed configuration, A/C, hot tub.

### 6. Coastal Bliss, Fort Bragg, CA (Vacasa)
Filled: 3 bed / 3 bath / sleeps 8, 2 dogs 50 lb or under, hot tub yes, beach trail about 5 minutes (with the listing's rope-drop caution), distances, cancellation note. Not stated: pet fee amount, fence, check-in/out, bed configuration, parking.

### 7. Cleone oceanfront home, Fort Bragg, CA (Vacasa)
Filled: 4 bed / 3 bath / sleeps 12, about 3,200 sq ft (in the description), 2 dogs, hot tub yes, location and distances. Not stated: pet fee amount, weight limit, fence (only a guest-review summary on the page mentions it, so not recorded as fact), check-in/out, parking, full bed list. Becomes indexable once any one of weight limit, fee amount or fence status is read from the listing or confirmed by the host.

### 8. Pierpont beach bungalow, Ventura, CA (Vrbo)
Filled: 2 bed / 1 bath / sleeps 6 with beds, 2 dogs, large dogs yes (inferred from "999 lbs per pet"), beach walks of 2 and 5 minutes, check-in 3 PM, out 11 AM. Not stated: pet fee (title says dogs stay free; recorded as not confirmed), fence (reviews only), hot tub, breed rules.

## Existing nine stays
Only change: `creekside-cottage-relax-soak-swim.yml` gets `bedrooms: 0`. The Vrbo page states "0 bedrooms (sleeps 4)" with a king and a queen bed in the common area (re-read 2026-11-18). It stays NOINDEX because the rule counts 0 as missing (see scope limits). Pet-policy and fee gaps on the other eight were not filled; no page read stated them.

## Needs the owner
- NEEDS-YOU (free, required before any button appears): for any of the Vrbo stays (1, 2, 8) generate a deeplink in the Expedia hub and add it to `content/affiliates.yml` as approved, then add the `affiliateId`. I did not invent ids. Vacasa and Explore Georgia sources have no affiliate program in this repo, so those stays show a plain listing link.
- NEEDS-YOU (decision): whether to widen the schema to North Carolina, Tennessee and Florida, and whether to fix the affiliateId test.

## Rejected candidates
- Georgia State Parks cottages (gastateparks.org/Cottages, ParkRules): official source reached, but the rule is 2 dogs per cottage, $50 per dog at check-in for the stay, leash and never unattended. The pages do not list individual dog-friendly cottages or sizes (only Skidaway Cabin B and Mistletoe's Fisherman's Cabin are named), and the park pages I tried (Amicalola, Mistletoe) returned no cabin details or a 404. No size facts, so no stay record; the $50 policy is worth a planning note on a destination page instead (RECOMMENDED).
- thebeachestates.com Tybee pages (Mellow Yellow, Beach Song): page text came back empty (script rendered). Skipped.
- Mellow Yellow on Vrbo (734546): readable, but no dog limit, weight limit or fee, and a recent review reports pests and dog waste on arrival. Skipped as low value.
- Vrbo 2466678 (Tybee fenced cottage with hot tub) and 1310707: HTTP 429; not retried.
- Marriott Homes and Villas "Dog-Friendly Modern Cabin, Fully Fenced" (40785293): HTTP 403; skipped.
- Expedia Oceanside "3 blocks from water, sleeps 6, dog run" (limit 3 dogs, $150 fee per search summary): HTTP 429; not read, so no claim made.
- Vacasa Blue Ridge area page and units 14768 / unit list: the unit URL returned the area page, not a property, so nothing could be cited. Aska Woodlands, Bluebird Bliss and others unread.
- Camino, Gasquet, Shelter Cove, Bodega Bay and Oceanside candidates from search summaries: not read by me, so not used.
- North Carolina, Tennessee and Florida candidates: excluded by the schema, not researched.
- Multi-dog and fee-amount needs: only Tybee (3 dogs) and Woof in the Woods (multiple dogs, no fee) met them in pages I could read; no read page stated a pet fee dollar amount except the state-park policy ($50 per dog), which has no stay record. State plainly: the "reasonable fee amount stated" need was not met by any new stay.
