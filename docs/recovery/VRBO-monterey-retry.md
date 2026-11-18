# Vrbo retry: Monterey and Mendocino (2026-11-18)

Result: 0 stays added. Block hit: yes.

## What happened

Sequential single-fetcher retry, one page at a time, no parallel fetches, no retries of a page that failed. Every page returned HTTP 429, so under the stop rule (4 in a row) all fetching ended after 4 attempts of the 12 allowed. The 429 happened even with no other worker fetching, so it looks like a block on this egress or on WebFetch itself, not just load. We respect it and did not work around it.

| Attempt | Vrbo id | Town | Result |
|---|---|---|---|
| 1 | 1224889 | Monterey (Cannery Row) | 429 |
| 2 | 4307826 | Monterey area (Carmel) | 429 |
| 3 | 4085228 | Monterey area (Carmel) | 429 |
| 4 | 396131 | Monterey area (Carmel) | 429 |

Not attempted because of the stop rule: Mendocino 655394, 1537755, 600445 (Riventides, Albion; which id the page really is remains unidentified), and any further Monterey candidates (no WebSearch was run).

## Totals

Read: 0. Added: 0. Indexable: n/a. No existing Mendocino Vrbo stay was changed. Search-snippet claims (4 dogs at 35 lb for 655394, limit 1 dog for Riventides) stay unverified and were not used.

## Next step for the owner

Retry from a different network or later, or read the pages in a normal browser and paste the FAQ and policy text. No affiliate deeplinks needed yet.
