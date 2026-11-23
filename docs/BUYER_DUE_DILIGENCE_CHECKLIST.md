# Buyer due-diligence checklist (evidence the seller can provide)

Purpose: the evidence a buyer reasonably asks for on a $1,500 pre-revenue starter site, how to collect it, and where it is stored. Marketplace expectations come from `docs/research/MARKETPLACES-AND-COMPS-2026-11.md` (Empire Flippers asks for analytics read access, revenue and expense proof, identity verification; Flippa says screenshots are not enough and suggests read-only analytics access; Flippa pages were blocked to us, so that is UNVERIFIED). This site has no revenue, so the revenue items below are "not applicable, stated as zero".

Rules: sensitive evidence (account screens, bills, identity documents, anything with an email or ID) is kept **privately** (owner's drive or the marketplace's private data room). Only this sanitized index lives in the repo. Never put passwords, API secrets, tax or bank details here. Label every item VERIFIED (evidence attached), UNVERIFIED, or N/A.

| # | Evidence | Why a buyer cares | How to collect | Executor | Where stored | Blocks listing? |
|---|---|---|---|---|---|---|
| 1 | Domain ownership: registrar account page showing pawsandpassage.com, registration date 2026-11-17, expiry, auto-renew, privacy on | Proves the seller owns what is sold | Screenshot of Namecheap Domain List and the domain's Overview (redact account email) | Owner or Cowork (read-only) | Private | Yes |
| 2 | WHOIS/RDAP lookup of the domain | Independent proof of age and registrar | Public lookup, save as PDF | Cowork | Private + index | No |
| 3 | Live site loads over HTTPS, www and apex redirect correctly | Buyer's first click | Already verified in `docs/flip/audit-live-qa.md` | Claude/Cowork | Repo (sanitized) | Yes |
| 4 | Repository ownership and history: GitHub repo page, commit count, first/last commit dates, default branch | Proves code ownership; first commit 2026-11-16 | Screenshot or `git log` summary | Claude | Repo index | Yes |
| 5 | Inventory of what is sold | Defines the asset | `docs/BUYER_ASSET_INVENTORY.md` | Claude (done) | Repo | Yes |
| 6 | Build and test proof: `bunx vitest run`, `tsc`, `vite build` outputs | Shows it runs | Re-run on the final commit, save the summary | Claude | Repo (summary) | Yes |
| 7 | Hosting proof: Netlify project, deploy history, plan (free) | Shows how it is hosted and what it costs | Screenshot of Netlify Deploys and plan page (redact team/email) | Owner or Cowork | Private | No (before closing) |
| 8 | Analytics: GA4 property exists and receives data; a screenshot of Realtime and Reports showing real zeros or real numbers, with date range | Buyers need to see the honest traffic number | Screenshot with the date range visible; grant read-only access only after a signed NDA or when the marketplace asks | Owner | Private | No |
| 9 | Search Console: domain property, sitemap status and indexing counts, as of the screenshot date | Shows crawl and index status, including "0 clicks" | Screenshot of Sitemaps and Pages reports with date; note any errors | Owner or Cowork | Private | No |
| 10 | Traffic and revenue statement | Honest baseline | One paragraph: "Traffic: [exact GA4 sessions and dates]. Revenue: $0. No earnings to date." Never estimate | Owner | Listing text | Yes |
| 11 | Affiliate status statement | Prevents a false monetization claim | Per program: applied / approved / not applied; Vrbo and Amazon wired in the site; **not transferable**. Do not quote commission or earnings | Owner | Listing text | Yes |
| 12 | Content originality: dataset method and source list; Editorial Standards page; AI-use disclosure on that page | Honest provenance, avoids a rights dispute | `docs/DATA-RECHECK-LOG.md`, `/data/pet-policies`, `/editorial-standards`; the owner decides the wording of AI-assisted content in the listing | Claude + owner | Repo | Yes |
| 13 | Image rights: credits list for Unsplash photos, derived pins and share images, and the AI-generated or undocumented hero image | Rights buyer inherits | `src/content/image-credits.ts`; owner decides on the hero image provenance (see `docs/flip/audit-legal-transfer.md`) | Owner | Repo | Yes (hero image) |
| 14 | Third-party code licenses | Reuse rights | `bunx license-checker --production` summary: permissive licenses only (see audit-legal-transfer.md) | Claude (done) | Repo | No |
| 15 | Secrets scan result | Buyer safety | Working-tree and history pattern scan: no keys found (UNVERIFIED for gitleaks-grade) | Claude (done) | Repo | No |
| 16 | Expenses | Buyer wants costs to run it | Domain first term and renewal, Private Email if kept; hosting $0. Figures from `docs/COSTS-AND-ACCOUNTS.md` and the tracker; label UNCONFIRMED where unconfirmed | Owner | Listing text | No |
| 17 | Seller identity verification | Marketplaces require it | Marketplace's own flow only; never send ID to a buyer | Owner | Marketplace | Yes (at listing) |
| 18 | Transfer plan | Reduces closing risk | `docs/TRANSFER_CHECKLIST.md` | Claude (done) | Repo | Yes |
| 19 | Rights statement | Clean title | Written copyright assignment and bill of sale text (owner chooses terms; have them reviewed) | Owner | Private | At closing |
| 20 | Screenshots of the live site | Buyers skim | `docs/flip/evidence/` (sanitized screenshots) | Cowork/Claude | Repo | No |

## Evidence the buyer cannot be given (state it)
Revenue statements, payout history, affiliate earnings, bounce and engagement history, a mailing list, backlink profile. None exists.

## Scam guardrails (from `docs/research/MARKETPLACES-AND-COMPS-2026-11.md`)
Use the marketplace's own escrow only. Refuse off-platform payment, a look-alike escrow site, overpayment-and-refund requests, or a domain push before escrow is funded. Never share credentials: transfer by the registrar's push or change-of-ownership process, and GitHub by adding the buyer as an owner after payment clears.
