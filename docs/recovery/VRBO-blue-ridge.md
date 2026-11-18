# Vrbo additions: Blue Ridge, Georgia

Read on 2026-11-18 from public Vrbo pages (WebFetch). Status unverified, no photos, no prices, no affiliateId. Owner: please generate Expedia-hub deeplinks for the three new ids below.

## Added (3), all indexable: yes (6 of 6 sections)

1. **cherry-lake-log-cabin-fenced-yard-up-to-4-dogs.yml** - Vrbo 3320896, https://www.vrbo.com/3320896 (Cherry Lake, listed under Gilmer County, 1 min walk to national forest). Filled: sleeps 6, 2 bd, 2 ba, beds, maxDogs 4, weight 999 lb (largeDogsOk yes), fencedYard full (from the title and a photo caption), petFee none (title says "No Pet Fee"), hot tub, amenities, distances, check-in/out. Not said: fee details, fence size/material, breed rules, address, whether the fire pit is included.
2. **three-cubs-cottage-pet-friendly-fire-pit-mineral-bluff.yml** - Vrbo 4195368, https://www.vrbo.com/4195368 (Ridgeline Vistas, Mineral Bluff). Filled: sleeps 8, 3 bd, 3 ba, beds, maxDogs 2, weight 50 lb, amenities, distances, check-in/out. Not said: fence, pet fee, hot tub, full amenity list, breed rules, address.
3. **mountain-gem-cherry-log-fenced-yard-large-dogs.yml** - Vrbo 2357464, https://www.vrbo.com/2357464 (Cherry Log). Filled: sleeps 6, 3 bd, 3 ba, beds, maxDogs 1, weight 999 lb (largeDogsOk yes), fence only in title (fencedYard not-confirmed, fenceNotes), amenities, distances, check-in/out. Not said: pet fee, fence detail, breed rules, address.

Indexability checked with a temporary test (deleted): all three returned indexable true, missing empty.

## Rejected
- 4378701 (Mineral Bluff, 2 dogs, 20 lb cap, hot tub, fire pit): qualifies but lowest value for our priorities (small-dog cap) and same area as 4195368; kept as a spare.
- 1546115 (Mineral Bluff 10 acre retreat): limit 2 pets total only; no weight, fee or fence fact on the page, so not indexable.
- 1310707, 3815164, 3991657, 3097063, 1930933: HTTP 429, skipped without retry.
- 2827825, 1056490 and other ids already in content/stays: skipped as existing. Search also surfaced listings on Expedia/Travelocity mirrors (Black Dog of Blue Ridge, Up Up and Away, Smore Fun, etc.); not Vrbo pages I could read, so not used.

Total distinct new Vrbo candidates read successfully: 6 (3 added, 3 not used). Another 5 hit 429.
