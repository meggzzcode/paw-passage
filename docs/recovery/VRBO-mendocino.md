# Vrbo stays, Mendocino coast (2026-11-18)

Method: web search for Vrbo listings, each read once with a page fetch. Many fetches returned HTTP 429; those were skipped with no retry.
Result: 3 stays added, all `status: unverified`, no affiliateId, no image. None is indexable yet: each has a stated dog limit but no weight limit, pet fee, fence status or large-dog answer on the readable page, so `stayIndexability` reports "no weight limit, pet fee or fence information" (the only missing item). They stay listed and noindex; any one of those facts, read from the policies section or confirmed by the host, makes them indexable. Left as non-indexable on purpose: inventing or inferring (review-only fence mentions) is not allowed.

Owner: please generate Expedia-hub deeplinks for ids 889523, 4717796, 317612.

## Added
| Slug | Vrbo id | URL | Read | Filled | Not on the page | Indexable |
|---|---|---|---|---|---|---|
| lovely-1920s-farmhouse-family-and-pet-friendly-mendocino | 889523 | https://www.vrbo.com/889523 | 2026-11-18 | 2 dogs, sleeps 6, 3 bed, 1 bath, beds, amenities, distances, check-in 3:00 PM / out 11:00 AM | weight limit, pet fee, fence (reviews only), house rules, hot tub (not listed) | no |
| coastal-redwood-bliss-little-river | 4717796 | https://www.vrbo.com/4717796 | 2026-11-18 | 1 dog, sleeps 4, 2 bed, 2 bath, hot tub, distances, 4:00 PM / 10:00 AM | weight limit, pet fee, fence, house rules, bathroom details | no |
| relaxing-privacy-overlooking-the-mendocino-coast-albion | 317612 | https://www.vrbo.com/317612 | 2026-11-18 | 2 dogs, sleeps 6, 3 bed, 2 bath, hot tub, distances, 4:00 PM / 12:00 PM | weight limit, pet fee, fence, house rules | no |

## Rejected or not read
- 176414 (Whale Song, Caspar): FAQ says dogs allowed with no limit stated; no dog limit, skipped.
- 4968841 (Little River Redwoods hot tub): "pets allowed", no limit; skipped.
- 4968851 (Oceanfront Elk home): "pets allowed", no limit; skipped.
- 4968866 (Fort Bragg cottage with hot tub): "pets allowed", no limit; skipped.
- Riventides (Albion; page read, id uncertain: 1537755 or 600445 answered a 429 and the other returned it): FAQ limit 1 dog, no second fact; also id not certain, so not added.
- 655394, 3573539, 600445/1537755 (one of them), 652163, 2017087: HTTP 429, skipped without retry. Search snippets suggest 655394 (4 dogs, 35 lb) and an Elk listing (4 dogs, 30 lb) would qualify, worth another try later; not used since not read.
- Non-Vrbo mirrors and Expedia/Travelocity pages: not used.

Total found: 15 candidate Vrbo ids; 10 read; 3 with a stated dog limit and a clean read were added.

## Checks
Temporary indexability test run and deleted. See final message for tsc and full vitest results.
