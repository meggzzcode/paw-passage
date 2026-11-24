# Cowork brief: Search Console and analytics investigation (read-only)

Written 2026-11-24 for a browser session with the owner's Google account. Claude could not authenticate, so every finding from this run stays PROVISIONAL until the sanitized return below is pasted back. Nothing here changes the site, DNS, hosting or billing. Do not ask the owner for passwords; use the already signed-in browser. Do not click "Request indexing", "Validate fix" or "Remove" anywhere (see rule 9).

Why this matters: the repo evidence says the live site is an older build than the repository (see docs/SEO_ROOT_CAUSE_INVESTIGATION.md, section 1) and the domain was registered 2026-11-16. The numbers below tell us how much of the low visibility is domain age and indexing lag versus a real problem.

## Rules
1. Property: use the **domain property** `pawsandpassage.com` if it exists. If only a URL-prefix property exists, record which one (https://www.pawsandpassage.com/ expected) and say so in the return.
2. Before anything else, record: the property name and type, today's date, the account's timezone, and the date range each export covers. Search Console data lags 2 to 3 days, so "28 days" ends about 2026-11-21 or 11-22.
3. Prefer CSV exports (Export > Download CSV) over screenshots. Screenshots are only a supplement; store them privately and never paste them into the repo.
4. Never invent or estimate a number. If a report is unavailable, write `UNAVAILABLE: <exact message shown>` and move on.
5. Do not paste email addresses, account IDs, verification tokens or cookies into the return.
6. Do not change settings, submit anything, or remove anything. Exception: none.
7. Time box: about 60 minutes. Do sections A to H in order; stop a section if the report is empty.
8. Authenticated data is point-in-time. Record the time you read it.
9. Indexing requests: none now. The owner may authorize them later, after the final build is deployed (not before), at most one request per URL.

## A. Performance report (Search results, web)
Open Performance > Search results. For each range below export **Queries, Pages, Countries, Devices, Search appearance** (Dates and Search type = Web). Then repeat Queries and Pages once with Search type = **Image**, and note whether "Discover" or "Google News" tabs exist.

Ranges: last 7 days; last 28 days; the **previous** 28 days (Compare > Last 28 days vs previous period, or custom dates); last 3 months; and "Full time" (custom, 2026-11-16 to today; the domain is new, so there may be less than 16 months).

Record for every range: total clicks, total impressions, average CTR, average position. Then:
- Compare equivalent 28-day windows (current vs previous). The earlier owner reading was about 236 impressions, 0 clicks, average position about 16.5; the 2026-11-23 reading was 163 impressions over 2026-11-16 to 11-21, position 15.2. State whether impressions are rising, flat or falling and by how many.
- List the top 20 queries by impressions with clicks, CTR and average position, and the top 20 pages. Mark each query as one of: brand, dog-rental-fees, large-dog, multi-dog, car-safety-gear, packing, destination, other.
- Note any query with impressions at average position 8 to 20 (page-two queries): these are the realistic near-term wins.
- Note impressions by page for these URLs specifically: /guides/how-vacation-rental-pet-fees-work, /guides/vacation-rentals-with-no-pet-fee, /guides/vacation-rentals-that-welcome-large-dogs, /guides/vacation-rentals-with-no-dog-weight-limit, /data/pet-policies, /gear, /tools/packing-list, /stays, /destinations/georgia/blue-ridge.
- The 2026-11-24 SEO notes mention "64 impressions" for the retired no-pets-rental guide URL (`/guides/bringing-a-dog-to-a-no-pets-rental`, now 404 by owner rule). Record its current impressions and clicks.
- Is "pawsandpassage" or "paws and passage" (brand) present in queries? Branded impressions would indicate real people looking for the site, not only discovery.

## B. Page indexing report (Indexing > Pages)
- Record the headline: number Indexed and Not indexed, and the chart's date of last update.
- Open **every** reason listed under "Why pages aren't indexed" (for example: Crawled - currently not indexed; Discovered - currently not indexed; Page with redirect; Not found (404); Excluded by noindex tag; Alternate page with proper canonical tag; Duplicate without user-selected canonical; Duplicate, Google chose different canonical than user; Blocked by robots.txt; Soft 404). For each reason record the count and **up to 10 example URLs**, plus "Last crawled" for the examples.
- Expected and fine: the 55 listed stay pages are deliberately `noindex, nofollow` (quality rule, docs/SEO_ROOT_CAUSE_INVESTIGATION.md section 3), the draft guide URL returns 404, and old tool URLs 301. Say whether each appears.
- Flag anything unexpected, especially: /stays "Crawled - currently not indexed", the Mendocino and Monterey `/things-to-do` pages (new, only linkable from the state page after the next deploy), and any guide URL listed as "Duplicate, Google chose different canonical".
- Also record the "Improve page appearance" or "Page experience" sections if present: Core Web Vitals (mobile and desktop) status counts, or the message that there is not enough data.

## C. Sitemaps (Indexing > Sitemaps)
Record for `https://www.pawsandpassage.com/sitemap.xml`: status, last read date, discovered URLs count (the live file currently lists 98 URLs; the repository build lists 103), and any error text. Note any other sitemap submitted (for example a non-www or an old path) and the "Discovered pages" and "Discovered videos" figures.

## D. URL Inspection (15 priority URLs)
For each URL below, use the top search bar and read the result for the **live-indexed version** ("Google index", not "Test live URL"). Record: verdict (indexed or not and the stated reason), "Page indexing" sentence, **User-declared canonical** vs **Google-selected canonical**, **Last crawl** date, **Crawl allowed?**, **Indexing allowed?**, "Page fetch", referring sitemap(s), and the detected structured data / breadcrumbs / Dataset items if shown. Do **not** click "Request indexing".

1. https://www.pawsandpassage.com/
2. https://www.pawsandpassage.com/guides/how-vacation-rental-pet-fees-work
3. https://www.pawsandpassage.com/guides/vacation-rentals-with-no-pet-fee
4. https://www.pawsandpassage.com/guides/vacation-rentals-that-welcome-large-dogs
5. https://www.pawsandpassage.com/guides/vacation-rentals-with-no-dog-weight-limit (retired; expected to redirect after deploy; record what Google shows)
6. https://www.pawsandpassage.com/guides/how-many-dogs-can-you-bring-to-a-vacation-rental
7. https://www.pawsandpassage.com/guides/two-large-dogs-in-one-car
8. https://www.pawsandpassage.com/guides/dog-car-safety-harness-and-crate-guide
9. https://www.pawsandpassage.com/guides/dog-friendly-cabin-packing-list
10. https://www.pawsandpassage.com/data/pet-policies (the dataset page)
11. https://www.pawsandpassage.com/gear
12. https://www.pawsandpassage.com/tools/packing-list
13. https://www.pawsandpassage.com/stays
14. https://www.pawsandpassage.com/destinations/georgia/blue-ridge
15. https://www.pawsandpassage.com/guides/vacation-rental-secure-fenced-yard

Bonus if time: https://www.pawsandpassage.com/destinations/georgia/blue-ridge/things-to-do (expected "URL is not on Google" until the next deploy), https://www.pawsandpassage.com/destinations/california/mendocino/things-to-do.
For /stays and Blue Ridge, say whether the status is current or stale (compare the last crawl date with today).

## E. Manual actions and Security issues
Open Security & Manual Actions > Manual actions and > Security issues. Record the exact wording ("No issues detected" or the issue). Also open Settings > Crawl stats (if present) and record: total crawl requests last 90 days, average response time, and the host status (robots.txt fetch, DNS, server connectivity).

## F. Links report
Open Links. Record **External links** totals (top linking sites, top linked pages, top linking text) and **Internal links** (top linked pages). Export each CSV. Note how many linking sites there are in total, and whether any look like spam. An empty or near-empty external report is expected for a site this new; do not interpret it beyond stating the count.

## G. Enhancements and experience
Record which of these report types exist and their status: Breadcrumbs, Dataset (Search appearance > Dataset if present), Unparsable structured data, Page experience, Core Web Vitals, HTTPS. Do not expect FAQ rich results (the feature is deprecated; docs/recovery/FAQPAGE-DECISION.md).

## H. Analytics (GA4) and Bing
- GA4: confirm the measurement ID on the site matches the property (do not paste the ID). Open Reports > Realtime and visit the live home page in another tab: record whether your own visit appears within 60 seconds. If not, record that tracking looks inactive.
- GA4 Acquisition > Traffic acquisition for 2026-11-16 to today: sessions, users, engaged sessions, and the row for **Organic Search** (sessions, engaged sessions). The 2026-11-23 reading was 463 sessions, almost all Direct (450), 0 Organic Search; confirm whether any Organic Search appears now. Note whether internal or automated traffic is filtered.
- Bing Webmaster Tools, if the owner uses it: sitemap status, URLs discovered and indexed, and any crawl errors. If not set up, say `NOT SET UP`.

## Sanitized return format
Paste back one message with these headings, no screenshots inline, no identifiers:

```
SC-RETURN 2026-11-24 (time read: ____ , property: domain|url-prefix)
A. Performance: table of range | clicks | impressions | CTR | avg position (7d, 28d, prev 28d, 3m, all)
   Top queries (20): query | impressions | clicks | avg position | group
   Top pages (20): page | impressions | clicks | avg position
   Countries / devices / search appearance: one line each
   Image search: clicks / impressions
B. Indexing: Indexed N / Not indexed N; per-reason table: reason | count | 3 example URLs | last crawled
   Core Web Vitals: status or "not enough data"
C. Sitemaps: status | last read | discovered URLs | errors
D. Inspection (15 rows): URL | indexed? | reason | declared canonical = Google canonical? | last crawl | indexing allowed?
E. Manual actions: ____ ; Security issues: ____ ; Crawl stats: ____
F. Links: external linking sites N; top 5 linked pages; internal top 5
G. Enhancements: list or UNAVAILABLE
H. GA4: realtime check yes/no; organic sessions N; Bing: ____
UNAVAILABLE items: list each with the message shown
```
CSV exports go in the owner's private folder, not the repo. Name them `gsc-<report>-<range>-2026-11-24.csv`.

## If a report is unavailable
- "No data yet" or empty tables: write `UNAVAILABLE: no data`. For a new property that is a real finding (Google has not processed it yet), not a failure.
- A report asks for a different property: switch once, record that you did, and stop.
- A page needs verification or ownership you do not have: write `UNAVAILABLE: permission` and do not try to add yourself.
- Do not use third-party SEO tools or paste the site into anything unrelated.
- Do not substitute estimates. A blank is more useful than a guess.

## What Claude will do with the return
Update the PROVISIONAL rows of docs/SEO_ROOT_CAUSE_INVESTIGATION.md and docs/SEO_30_DAY_TRACKING.md, move findings from "Awaiting data" to confirmed or non-issue, and decide whether any post-deploy indexing request is justified (owner approval required, one per URL at most).
