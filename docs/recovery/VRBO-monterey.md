# Vrbo candidates: Monterey Bay area (2026-11-18)

Result: 0 stays added. No Vrbo listing page could be read, so no stay file was created.

## What happened

WebSearch surfaced Vrbo listing ids for Monterey, Pacific Grove and Carmel-by-the-Sea. I tried one WebFetch of each of four numeric-id pages. Every one returned HTTP 429 (rate limited or bot blocked). Per the brief I did not retry or work around it. Nothing on any page was read, so there are no confirmed facts to record, and I did not build stays from search snippets (those are third-party summaries, not the page).

## Candidates tried (all 429, skipped)

| Vrbo id | URL | Why it looked promising (search snippet only, NOT confirmed) |
|---|---|---|
| 1224889 | https://www.vrbo.com/1224889 | Monterey, Cannery Row home; snippet said up to 2 dogs with pet screening |
| 4307826 | https://www.vrbo.com/4307826 | Carmel cottage; snippet said 1 pet, under 50 lb |
| 4085228 | https://www.vrbo.com/4085228 | Carmel cottage; snippet said 1 pet, under 50 lb |
| 396131 | https://www.vrbo.com/396131 | Carmel garden home; snippet said 1 dog, 50 lb |

## Other ids seen in search, not fetched

4514023 and 2875979 and 3312140 (Carmel), 396479 (Carmel, snippet mentions a pet fee), 4471508ha, 9547937ha, 9984051ha, 9828182ha (Pacific Grove), 9709256ha, p9863675 and p20077362 (Monterey). The "ha" and "p...vb" forms are not plain numeric-id pages, and I stopped after the 429 pattern, so none were read. None were in content/stays (existing Vrbo ids are all Georgia).

## Totals

Candidates found: about 15. Read: 0. Added: 0. Indexable: n/a.

## Next step for the owner

Retry later (the block looks like per-IP rate limiting), or read the four ids above in a normal browser and paste the FAQ and policy text. Ids 1224889 and the Carmel pair look most useful (stated dog limits). No affiliate deeplinks needed yet.

No tests, tsc or vitest were run because no content files were added.
