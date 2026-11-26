# Operating costs

Status as of 2026-11-26. This is a model, not a measurement. Nothing here has run against the real Netlify account.
Every number is tagged:

- **VERIFIED**: read on the cited page on 2026-11-26.
- **MEASURED**: computed from this repo (sizes, limits, call patterns).
- **ESTIMATE**: an assumption. Replace it with real numbers from the Netlify Usage screen after one month of traffic.

Recompute any scenario with `node scripts/cost-model.mjs` (the assumptions are constants at the top of that file).

> **Warning.** The plan cannot be assumed to support unlimited customers. On the Free plan the credit limit is a
> hard limit: when it is used up, all projects on the team are paused and visitors see "Site not available" (VERIFIED,
> billing FAQ). One single $19.99 payment pays for no fixed amount of future hosting, so cost grows with traffic
> while revenue arrives once. Watch usage monthly (see Monitoring) and decide on a plan before the limit is hit.

## 1. Netlify rates and plans (VERIFIED)

Sources: [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/),
[Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/),
[Billing FAQ](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans.md),
[Pricing](https://www.netlify.com/pricing/).

| Meter                                   | Rate                                                      |
| --------------------------------------- | --------------------------------------------------------- |
| Compute (functions, incl. scheduled)    | 10 credits per GB-hour (function run time x memory)       |
| Web requests (pages, assets, API)       | 2 credits per 10,000 requests                             |
| Bandwidth (assets, HTML, function data) | 20 credits per GB                                         |
| Production deploy                       | 15 credits each (previews 0; failed deploys, rollbacks 0) |
| Forms                                   | free                                                      |

| Plan       | Price     | Credits per month | Over the limit                                               |
| ---------- | --------- | ----------------- | ------------------------------------------------------------ |
| Free       | $0        | 300               | hard limit, projects pause, no purchase option               |
| Personal   | $9/month  | 1,000             | pause unless auto recharge (500 credits for $5) or a pack    |
| Pro (base) | $20/month | 3,000             | pause unless auto recharge (1,500 credits for $10) or a pack |

Also verified: Pro tiers of 5,000, 10,000, 15,000 and 20,000 credits exist (their prices were not read); rollover only
on Pro at 5,000 or more; auto recharge is off by default and only a Team Owner can change it; one site over the limit
pauses every site on the team; alerts go out at 50%, 75%, 90% and 100% by email and in-app.

**Not documented on the pages read (UNVERIFIED):** any Netlify Blobs rate or limit (Blobs is listed as a feature on
all plans with no separate meter), function default memory and rounding of run time, whether SSR pages count as
"page views", whether CDN cache hits count as requests, and whether outbound push calls count as bandwidth. The model
therefore assumes 1 GB of memory and counts every request.

## 2. What one customer costs (MEASURED from the code, then ESTIMATE)

| Item                         | Value                                                                                                                     | Basis                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Premium library, JSON        | 504,863 bytes (100 records)                                                                                               | MEASURED, the premium package files wrapped as the endpoint returns it       |
| Premium library, gzip        | 136,399 bytes                                                                                                             | MEASURED (brotli 108,338). Assumes the CDN compresses the response: ESTIMATE |
| Library fetched              | every app open of a signed-in customer                                                                                    | `premium-client.ts` holds it in memory only, never in storage                |
| Blob reads per library fetch | 100 (index + one per adventure)                                                                                           | MEASURED, `readPremium` in `store.ts`                                        |
| Customer record              | avg 8 KB, hard cap 60,000 chars                                                                                           | cap MEASURED (`MAX_RECORD_CHARS`), average ESTIMATE                          |
| Notification record (paused) | about 3 KB                                                                                                                | ESTIMATE                                                                     |
| Sync                         | PUT 2 s after a change plus on tab hide; pull on focus at most once a minute; session + library check on focus after 60 s | MEASURED (`sync.ts`, `useSync.ts`)                                           |
| `/api/previews`              | public, `max-age=300`, about 6 KB gzip                                                                                    | cache header MEASURED, size ESTIMATE                                         |
| `/api/previews/match`        | POST, body under 4 KB, not cacheable                                                                                      | MEASURED                                                                     |
| Pages                        | all HTML is server-rendered by a function (dist holds only `gone.html` and `offline.html`)                                | MEASURED                                                                     |
| JS + CSS in `dist/assets`    | 2.09 MB raw, 667 KB gzip in total                                                                                         | MEASURED; a visit loads route chunks only (ESTIMATE 0.85 MB with images)     |
| Static files in `public/`    | 3.0 MB (share 1.6 MB, examples 0.8 MB)                                                                                    | MEASURED                                                                     |
| Service worker, push         | paused: no worker, no idle invocations                                                                                    | MEASURED (`PWA_ENABLED=false`, no schedule line in `push-deliver.ts`)        |
| Backups                      | Drive, no Netlify cost                                                                                                    | owner decision                                                               |

Per active customer per month (8 sessions, ESTIMATE): about 1.1 MB of function and CDN transfer per session (library
136 KB, page 30 KB, sync 8 KB, bundles 100 KB), about 13 requests per session, and 105 blob reads plus 3 blob writes per
session. A cached `/api/previews` response is not modeled (every fetch is counted, which is conservative).

Note: `netlify.toml` sets `Cache-Control: no-store` for `/api/*`, while the previews handler sets `public,
max-age=300`. Which one reaches the browser and the CDN is UNVERIFIED; check a response header on the deployed site.

## 3. Scenarios

All rows are credits per month, push paused, 10,000 Journal visits and 12 production deploys per month (ESTIMATES).
The Journal and deploys are shared by every row, so look at the customers column to see how customer growth adds up.

| Customers | Active | MAU   | Total credits | Customer share | Smallest plan that covers it | Headroom |
| --------- | ------ | ----- | ------------- | -------------- | ---------------------------- | -------- |
| 100       | 20%    | 20    | 356           | 1.8            | Personal                     | 644      |
| 100       | 40%    | 40    | 357           | 3.6            | Personal                     | 643      |
| 100       | 60%    | 60    | 359           | 5.4            | Personal                     | 641      |
| 1,000     | 20%    | 200   | 372           | 17.9           | Personal                     | 628      |
| 1,000     | 40%    | 400   | 390           | 35.8           | Personal                     | 610      |
| 1,000     | 60%    | 600   | 408           | 53.8           | Personal                     | 592      |
| 5,000     | 20%    | 1,000 | 444           | 89.6           | Personal                     | 556      |
| 5,000     | 40%    | 2,000 | 533           | 179            | Personal                     | 467      |
| 5,000     | 60%    | 3,000 | 623           | 269            | Personal                     | 377      |
| 10,000    | 20%    | 2,000 | 533           | 179            | Personal                     | 467      |
| 10,000    | 40%    | 4,000 | 712           | 358            | Personal                     | 288      |
| 10,000    | 60%    | 6,000 | 892           | 538            | Personal                     | 108      |

Customer share at 10,000 customers and 40% active: bandwidth 190, compute 88, requests 80 credits. Transfer for that
row is about 16 GB per month. Stored data: about 80 MB at the 8 KB average, 600 MB if every record hit the 60 KB cap
(Blobs storage is not metered on the pages read: UNVERIFIED).

### Push

Paused baseline: 0 credits (no schedule, no deliveries). If restored (`schedule: "*/15 * * * *"` is 2,880 runs per
month), with 25% opt-in and 12 pushes per opted-in customer per month (ESTIMATES), at 40% active:

| Customers | Total credits | Push part |
| --------- | ------------- | --------- |
| 100       | 360           | 2.1       |
| 1,000     | 393           | 3.5       |
| 5,000     | 542           | 9.3       |
| 10,000    | 729           | 16.5      |

The idle schedule alone is about 3 credits per month. Push is small next to the Journal and deploys, but
scheduled functions run only on production deploys and the delivery path has not run for real (UNVERIFIED).

### What actually drives the bill

| Driver                    | Credits                                                | Note                                                                       |
| ------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Production deploys        | 15 each                                                | 12 deploys = 180, which is already 60% of the Free plan. 20 deploys = 300. |
| Journal and public visits | about 17 per 1,000 visits                              | 10,000 visits = about 174 credits (bandwidth 134, requests 36, compute 4)  |
| Customers                 | about 0.09 per active customer per month at 8 sessions | grows with the active count, not with cumulative sales                     |

Journal sensitivity (1,000 customers, 40% active, 12 deploys):

| Visits per month | Credits | Smallest plan                           |
| ---------------- | ------- | --------------------------------------- |
| 0                | 216     | Free                                    |
| 5,000            | 303     | Personal                                |
| 25,000           | 651     | Personal                                |
| 50,000           | 1,085   | Pro (base)                              |
| 100,000          | 1,955   | Pro (base)                              |
| 200,000          | 3,694   | above Pro base: needs a larger Pro tier |

### When the Free plan (300 credits) is not enough

| Journal visits | Deploys | Free plan lasts until (customers)                |
| -------------- | ------- | ------------------------------------------------ |
| 10,000         | 12      | already over with zero customers                 |
| 5,000          | 8       | 5,191 at 20% active; 2,595 at 40%; 1,730 at 60%  |
| 0              | 8       | 10,041 at 20% active; 5,020 at 40%; 3,347 at 60% |

Reading: with realistic Journal traffic and a normal deploy rhythm, the Free plan is the wrong plan for launch. Budget
for **Personal ($9 per month, 1,000 credits)** as the baseline. Personal is outgrown when the total passes 1,000: for
example 50,000 monthly visits, or 10,000 customers at 60% active with about 25,000 visits. Then Pro base ($20 per
month, 3,000 credits) is next.

To protect credits: batch changes into fewer production deploys (each is 15 credits), keep docs-only pushes skipped
(the `ignore` rule already does this), and keep large images optimized.

## 4. Revenue per sale (Gumroad)

Source: [Gumroad pricing](https://gumroad.com/pricing), read 2026-11-26. VERIFIED: direct sales (profile or direct
links) 10% plus $0.50 per transaction; Discover marketplace sales 30%; no monthly fee; Gumroad is merchant of record for
sales tax. Payment-processor fees are not itemized on that page. Whether fees are returned on a refund was not read
(UNVERIFIED).

| Sale price $19.99 | Fee                   | Net to the seller |
| ----------------- | --------------------- | ----------------- |
| Direct link       | $2.00 + $0.50 = $2.50 | $17.49            |
| Discover          | $6.00                 | $13.99            |

Net per direct sale covers the Personal plan ($9 per month) with 1 sale per month and Pro ($20) with 2, before taxes
on income and any other costs. Hosting is a recurring cost funded by one-time sales, so the margin per customer shrinks
the longer an active customer keeps using the app.

## 5. Settings and monitoring

- Auto recharge: keep it **OFF** (it is off by default). With it off, the worst case is a pause, not an open-ended bill.
  Only a Team Owner can change it. A pause is visible to customers, so act on the alerts instead of waiting for 100%.
- Alerts: confirm the 50%, 75%, 90% and 100% emails and in-app notices reach a monitored address.
- Monthly: read Usage and billing, then compare actual credits against this model and update the constants
  (`sessionsPerActiveMonth`, `productionDeploysPerMonth`, Journal visits). Check which meter dominates (expected:
  deploys and bandwidth).
- After each deploy of changed assets: confirm bundles stay near 667 KB gzip in total.
- Before restoring push: re-run the model with `push` on and add the 15-minute schedule only after the budget is clear.
- Before the library grows: set `libraryScale` in the script. Every signed-in app open downloads the whole library, so
  transfer per session grows in proportion (a library three times as large adds about 0.27 MB per session).
  Consider a cache or per-adventure fetch only if the Usage screen shows bandwidth is the main driver.
