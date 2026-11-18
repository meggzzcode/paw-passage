# Vrbo-sourced stays: Helen, Georgia (read 2026-11-18)

All three stays: status unverified, photoPermission false, no image, no affiliateId, no lastVerified. Nothing was verified with a host; no property was visited. Pet fee, fence status, large-dog answer, breed rules, house rules, minimum stay and cancellation were not readable on any page (Policies section is cut off) and are recorded as not-confirmed or left out.

Listing ids for the owner to generate Expedia hub deeplinks (then add affiliateId vrbo-<id>): 2908219, 3622396, 3495924.

## Added

| Slug | Vrbo id / URL | Filled | Page did not say | Indexable |
|---|---|---|---|---|
| in-town-dog-friendly-hot-tub-fire-pit-helen | 2908219, https://www.vrbo.com/2908219 | 2 dogs, 20 lb per pet (FAQ); sleeps 6, 3 bed, 2 bath, beds; hot tub, fire pit, balcony; walking distances; 4 PM / 11 AM | pet fee, fence, breed rules, house rules, min stay, cancellation | yes (6 sections) |
| hidden-gem-dog-friendly-cabin-near-golf-helen | 3622396, https://www.vrbo.com/3622396 | 1 dog, 20 lb per pet (FAQ); sleeps 4, 2 bed, 2 bath, 2 queens; shared communal pool, fire pit; distances; 4 PM / 10 AM | pet fee, fence, hot tub (not listed, so not-confirmed), house rules, min stay, cancellation | yes (6 sections) |
| river-tubing-hot-tub-pool-pet-friendly-innsbruck-helen | 3495924, https://www.vrbo.com/3495924 | dogs and cats, 2 total, 50 lb per pet (FAQ); sleeps 10, 3 bed, 3 bath, beds; hot tub, pool, fire pit, EV charger; distances; 4 PM / 11 AM | pet fee, fence, pool private or shared, house rules, min stay, cancellation | yes (6 sections) |

Caveats: the search snippets showed different weight limits for 2908219 and 3622396 on other regional pages (9 kg) and reviews on 2908219 mention a property called "Moondance"; I recorded only what the US listing page text said (20 lb) and the owner may want to re-check. Pet limit for 3622396 is 1 dog.

## Rejected (8 candidates read or tried, 3 added)

- 3747365 (hot tub, king beds, walk to Helen): FAQ says 5 dogs total, but no weight limit, fee or fence readable; no second pet fact, so not indexable. Could be added if the owner confirms any one.
- 88525 (Alpenhaus Cabins): 2 dogs only, no second pet fact; also located in Sautee Nacoochee.
- 1342129 (Country Charm D): FAQ only says dogs allowed, no limit; cannot qualify.
- 3287569 (A Holler From Helen): located in Clarkesville (Habersham County), 1 dog only, no second fact.
- 2749386: HTTP 429, skipped without retry (search snippet claimed 2 dogs, 25 lb; not read, not used).
- Expedia-only and third-party results (Moondance, Delaine's Retreat, Alpine Rose, Chimney Mountain Chalet, Honey Bear Hideaway): no readable Vrbo listing page found; skipped.

Total Vrbo listings found: 8 (7 read, 1 blocked); 3 solid.

## Checks

- Temporary test of stayIndexability: all three indexable, missing empty, 6 sections each (temp test deleted). A second temp test confirmed the stay meta title and description lengths pass and contain no retailer brand for all three (deleted).
- tsc --noEmit: only error was a missing file from another worker's temporary test (src/test/zz-tmp-san-diego.test.ts); not mine.
- Full vitest: 383 passed, 1 failed, 9 files failed. All failures come from other workers: vanished temp tests (zz-tmp-mendocino and others), timeouts under concurrent load, a meta-brand failure on the Mendocino stay (its summary contains "Vrbo"), and launch-state, which now finds Ellijay indexable because other workers added Ellijay stays. None involve my files.
- Side effect for the owner: Helen town page now has 3 indexable stays, so it becomes indexable and enters the sitemap.
