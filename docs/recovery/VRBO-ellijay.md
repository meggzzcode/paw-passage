# Vrbo-sourced stays: Ellijay, Georgia (read 2026-11-18)

Three new unverified stays, all read from public Vrbo pages with WebFetch. No host contact, no visit. No affiliateId set: the owner generates deeplinks in the Expedia hub for the three ids below.

Total Vrbo candidates found by search in Gilmer County: about 12 distinct ids; 7 pages were read successfully or attempted (see below).

## Added

| Slug | Vrbo id | URL | Read | Indexable |
|---|---|---|---|---|
| riverfront-fenced-cabin-with-sauna-ellijay | 4188412 | https://www.vrbo.com/4188412 | 2026-11-18 | yes (6 sections) |
| fully-fenced-firepit-cottage-near-ellijay | 3106796 | https://www.vrbo.com/3106796 | 2026-11-18 | yes (6 sections) |
| bamby-bungalow-pet-getaway-ellijay | 3348768 | https://www.vrbo.com/3348768 | 2026-11-18 | yes (6 sections) |

Fields filled (each): type, sleeps, bedrooms, bathrooms, beds, maxDogs, fence status and notes, amenities, location note, distances, check-in/out, house rules (short pet phrases), a guest note, own description.
- 4188412: limit 4 total; fencedYard set to partial because only the title says "Fenced" (reviewers describe a gated yard); sauna in title but not in the amenity list; hot tub not listed.
- 3106796: limit 4 total; fully fenced area stated in a photo caption (firepit area), so fencedYard full with that source noted.
- 3348768: limit 2 total; fencedYard partial (title "Fenced in yard", caption about a gated deck); hot tub listed.
- Not stated on any of the three: weight limit, pet fee, breed rules, large-dog answer, cancellation, minimum stay, house rules section. All recorded as not-confirmed. Prices and ratings were not recorded.
- Judgment call to review: the indexability rule needed one more pet fact; for 4188412 and 3348768 that fact is the fence (partial, from title/caption). If you would rather not count a title as fence evidence, set fencedYard to not-confirmed and both drop to noindex.

## Rejected or skipped
- 4874876 (dog-friendly cabin, fenced yard in title, hot tub): page read says only "pets allowed", no dog limit (a search snippet claimed other limits; not used). Cannot qualify.
- 1684143 (covered hot tub pavilion cabin): dogs allowed, no limit stated. Cannot qualify.
- 4896881, 1406330, 2854883, 9613601, 4489621, 3587254: HTTP 429 on fetch, skipped without retry.
- p4286321, p4489250, p2367803: only seen in search results, not read (not Ellijay-confirmed or not fetched).
- Expedia-only pages (not vrbo.com listing pages): not used.

## Checks
- Temporary test confirmed all three indexable, then deleted.
