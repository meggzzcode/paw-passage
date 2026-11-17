# Launch checklist

One ordered list of what is left before the site is live and earning, who does each step, and where it stands.
Update the status column as things happen. Dated detail goes in `RECORD-TRAIL.md`.

| # | Step | Who | Status | Notes |
|---|---|---|---|---|
| 1 | Merge the site fixes to `main` | Owner approves, assistant merges | **Waiting for approval** | Branch `claude/affiliate-setup`. `main` is currently `6d5ec1c`. |
| 2 | Switch Netlify's production branch from `claude/cms-poc` to `main`; point Pages CMS at `main` | Cowork (owner's login) | Not done | Netlify still deploys the old branch. |
| 3 | Confirm the Namecheap mailbox receives and sends mail | Cowork (owner's login) | Not done | Do this BEFORE the site goes public, because the Contact page shows the address. |
| 4 | Connect `pawsandpassage.com` to Netlify, HTTPS on | Cowork (owner's login) | Not done | Never touch MX, SPF, DKIM or DMARC records. See `DNS-AND-TRANSFER.md`. |
| 5 | Enter the real address as `siteUrl` in Business settings | Assistant or owner in Pages CMS | Not done | Turns on the sitemap, canonical links and share-preview images. |
| 6 | Run `node scripts/verify-site.mjs https://pawsandpassage.com --site-url https://pawsandpassage.com` | Assistant | Not done | Expect 0 failures. |
| 7 | Google Search Console: add the domain, verify with a DNS TXT record (add only, keep existing TXT records), submit `/sitemap.xml` | Cowork (owner's Google login) | Not done | Do right after step 4. Free. |
| 8 | Google Analytics 4: create a property, enter the `G-` ID in Business settings | Cowork (owner's Google login), then assistant or owner | Not done | Needed to prove traffic to a buyer. Start early: history cannot be backfilled. |
| 9 | Author bio | n/a | **Not needed (owner's decision 2026-11-17)** | Articles are bylined "Paws & Passage Editors" with a published method and sources, which transfers to a buyer with no personal name. A buyer can add a bio. |
| 10 | Apply to an affiliate program, then add approved links in Pages CMS | Owner | On hold (owner's choice) | Buttons link to makers' pages until then. See `AFFILIATE-SETUP.md`. |
| 11 | Verify real stays with hosts and add them | Owner and assistant | Not started | Until one exists, the stays pages are hidden from search and the sitemap. |
| 12 | Product photos | Owner | Not started | Need permission or own photos. See `PRODUCT-PHOTOS.md`. |
| 13 | Email list | n/a | **Skipped for now (owner's decision)** | Revisit once there is steady traffic. See `LEAD-CAPTURE.md`. |
| 14 | Record monthly: visitors, top pages, search clicks, affiliate earnings | Owner | After launch | This history is what a buyer pays for. |

Legal review of the privacy, terms and disclosure pages was skipped by the owner's decision (2026-11-17).

## Sale readiness (what a buyer's checks will look for)

| Item | Why a buyer cares | Status |
|---|---|---|
| Google Analytics 4 and Search Console running for months | Proves traffic. Buyers usually want read-only access to both, not screenshots | Not set up (steps 7-8 above) |
| Affiliate account(s) with earnings history | Proves the site makes money. Without revenue the site is priced as a build, not a business | None joined (owner's hold) |
| Monthly numbers log: visitors, top pages, search clicks, income, costs | Gives a profit-and-loss story. A simple spreadsheet is enough | Not started |
| Asset inventory: domain, mailbox, hosting, GitHub, CMS | Buyer must know everything transfers | Done: `OPERATIONS-RECORD.md`, `DNS-AND-TRANSFER.md`. Re-check after the domain is live |
| Handover steps for each account | Non-technical buyer must be able to take over | Done: `BUYER_HANDOVER.md`. Update after Part D |
| Content ownership: articles are original; photos are licensed | Buyer wants no copyright risk | Photos are from Unsplash with credits in `image-credits.ts`. No maker photos used |
| Name check: is "Paws & Passage" already used by another business or trademark in travel or pet services? | A conflict could force a rebrand | **Done by the owner (reported 2026-11-17, no conflict found).** Keep the date and where it was checked in the record trail |
| Business owner of record for the accounts (the owner or the owner's company) | The sale must transfer the accounts from the right party | Confirm |
| Backlinks and social profiles (Pinterest first for travel) | Extra proof of reach | Pinterest Business account being set up under the business email (Cowork) |
| A 12-month content plan (list of next articles) | Shows the buyer where growth comes from | Not written. Search research is being done in `REVIEW-SEARCH.md` |
| Where to list it (a site-flipping marketplace) and what its minimums are | Some marketplaces only take sites with revenue and months of history | Not researched |
