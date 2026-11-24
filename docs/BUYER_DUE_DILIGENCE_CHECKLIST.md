# Buyer due-diligence checklist: private evidence index

Purpose: list the evidence a buyer of a roughly $1,500, pre-revenue starter site can reasonably ask for, where each item is kept **privately**, who collects it and whether it exists yet. This file is the **sanitized index only**. It is committed to the repo; the evidence itself is not.

Rules
- Never put passwords, API keys, tokens, recovery codes, tax or bank details, identity documents, account screenshots or account emails in the repo or in this file. Evidence lives in a private folder owned by the seller (or the marketplace's private data room) and is shared only with a buyer who has signed the marketplace's terms.
- Status: **VERIFIED** (evidence exists and was checked, and the public part is cited here), **UNVERIFIED** (no evidence collected or could not be checked), **OWNER** (only the owner can supply it).
- Executors: **Claude** (repo and build work), **Cowork** (browser tasks under the owner's logged-in session, prompts in `docs/cowork/`), **Owner** (account holder).
- Marketplace expectations come from `docs/research/MARKETPLACES-AND-COMPS-2026-11.md`. Marketplaces typically ask for analytics read access, proof of costs and identity verification; this site has no revenue, so revenue items are stated as zero, never estimated.
- Never state a replacement value, traffic figure, revenue figure or buyer interest in listing text unless it is evidenced here.

## A. Facts the listing may state (and their evidence)

| Fact | Evidence kept privately | Executor | Status |
|---|---|---|---|
| Domain `pawsandpassage.com`: registrar start 2026-11-16, valid to 2027-11-17, auto-renew OFF pending owner decision | Registrar domain list and overview page (redact account email); a dated WHOIS/RDAP lookup saved as PDF | Owner / Cowork (read-only) | OWNER (facts supplied by the owner; no screenshot in the repo) |
| Google URL Inspection showed 21 of 23 inspected pages indexed | Search Console URL Inspection results with the inspected URL list and date | Owner / Cowork | OWNER |
| Search Console reported 236 impressions and 0 clicks over 28 days | Performance report screenshot with the date range visible | Owner / Cowork | OWNER |
| Netlify free plan; builds stopped by the owner; about 65 credits left (15 per deploy) | Netlify plan and usage page (redact team and email) | Owner | OWNER |
| Counts of routes, guides, data and tests | `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` plus the saved build and test output | Claude | VERIFIED 2026-11-24 at HEAD `56552fc` (re-run after the final commit) |
| All 3 tools work | Playwright run recorded in `docs/BUYER_ASSET_INVENTORY.md` section 6 | Claude | VERIFIED 2026-11-24 |
| Hero photos are credited Unsplash photos; no third-party (Amazon) images | `src/content/image-credits.ts`, grep of product cards; Unsplash License text | Claude | VERIFIED in repo; license reading (usage rights, not ownership or exclusivity) is general, not legal advice |
| AI-assisted content is disclosed | `/editorial-standards` page text | Claude | VERIFIED |
| Per-button affiliate labels and Amazon sentence on every page with Amazon links | Crawl result in the counts file | Claude | VERIFIED (wording not legally reviewed) |

## B. Evidence checklist

| # | Evidence | Why a buyer cares | How to collect | Executor | Stored | Status |
|---|---|---|---|---|---|---|
| 1 | Domain ownership page (registrar, dates, auto-renew, privacy) | Proves the seller owns what is sold | Screenshot of Namecheap domain overview | Owner / Cowork | Private folder | OWNER |
| 2 | Auto-renew decision recorded | Domain expires 2027-11-17 if nobody renews | Owner turns it on before the push or tells the buyer in writing | Owner | Private | OWNER |
| 3 | Domain not locked, registrant contact is the seller | Push can complete | Registrar page check | Owner / Cowork | Private | UNVERIFIED |
| 4 | Live site loads over HTTPS, www and apex behave | Buyer's first click | Fresh check with `node scripts/verify-site.mjs https://www.pawsandpassage.com` before listing | Claude | Repo summary only | UNVERIFIED (last live check pre-dates the stopped builds; the live site may differ from HEAD) |
| 5 | Repository ownership and history (commit count, first and last commit date, default branch) | Code title; 435 commits, first commit 2026-11-16 at HEAD | `git log` summary | Claude | Repo summary | VERIFIED |
| 6 | Build and test proof on the final commit | Shows it runs | Re-run `bunx vitest run`, `tsc`, `vite build`; save summaries | Claude | Repo summary | VERIFIED at `56552fc` (498 tests, 40 files, build passed); repeat on the final commit |
| 7 | Hosting proof: Netlify project, deploy history, plan | Shows how it is hosted and what it costs | Screenshot of Deploys and plan page | Owner / Cowork | Private | OWNER |
| 8 | Portability proof: clean install and build without any Lovable account | Removes a "paid Lovable usage" worry | `docs/HOSTING_PORTABILITY_REPORT.md` (three builds passed on 2026-11-24) | Claude | Repo | VERIFIED |
| 9 | Lovable GitHub sync disconnected | Nothing from Lovable can push to the live branch | Owner disconnects in Lovable project settings; screenshot of the disconnected state | Owner | Private | UNVERIFIED (current state could not be read) |
| 10 | GA4: property exists; Realtime and Reports screenshots with the date range, read-only access only after terms are signed | Honest traffic baseline | Screenshot with dates | Owner | Private | OWNER |
| 11 | Search Console: Pages and Sitemaps reports as of the screenshot date; the 21 of 23 inspected result and the 236 / 0 numbers | Index status and honest zero clicks | Screenshots with dates; note any errors | Owner / Cowork | Private | OWNER |
| 12 | Traffic and revenue statement | Honest baseline | One paragraph: impressions, clicks and dates as above; revenue $0; no earnings to date. Never estimate | Owner | Listing text | OWNER |
| 13 | Affiliate status statement per program | Prevents a false monetization claim | applied / approved / not applied for Amazon Associates, Vrbo/Expedia, Impact, Awin; links wired in the site; accounts non-transferable; no commission or earnings quoted | Owner | Listing text | OWNER (config in repo is not proof) |
| 14 | Content provenance: dataset method and sources; editorial standards; AI disclosure | Honest origin, avoids a rights dispute | `docs/DATA-RECHECK-LOG.md`, `/data/pet-policies`, `/editorial-standards` | Claude + Owner | Repo | VERIFIED (owner decides listing wording) |
| 15 | Image rights: credits list, derived pins and share images | Rights the buyer inherits | `src/content/image-credits.ts`; `docs/flip/audit-legal-transfer.md` | Owner | Repo | VERIFIED for credits; rights chain of derived images UNVERIFIED |
| 16 | Third-party code licenses | Reuse rights | License-checker summary of production dependencies (permissive only per the audit) | Claude | Repo | UNVERIFIED (re-run on final commit) |
| 17 | Secrets scan of working tree and history | Buyer safety | Pattern scan; no keys found in the earlier audit | Claude | Repo summary | UNVERIFIED for a gitleaks-grade scan; public GA4 and Amazon tag IDs are intentional |
| 18 | Expenses | Buyer wants running costs | Domain renewal about $19.98 a year, optional mailbox about $14.88 a year, Netlify and GitHub $0 (list prices read 2026-11-18) | Owner | Listing text | UNVERIFIED for the seller's actual bills |
| 19 | Seller identity verification | Marketplace requirement | Marketplace flow only; never send ID to a buyer | Owner | Marketplace | OWNER |
| 20 | Transfer plan and package index | Reduces closing risk | `docs/TRANSFER_CHECKLIST.md`, `docs/buyer/TRANSFER_PACKAGE_INDEX.md` | Claude | Repo | VERIFIED |
| 21 | Rights statement (copyright assignment, bill of sale) | Clean title | Written text reviewed by the owner's adviser | Owner | Private | OWNER |
| 22 | Pages CMS opens the repo and a save becomes a commit | Buyer will edit this way | First-edit test (`BUYER_HANDOVER.md` section 6); not done | Owner or buyer | n/a | UNVERIFIED |
| 23 | Screenshots of the live site | Buyers skim | `docs/flip/evidence/` (sanitized) | Cowork / Claude | Repo | UNVERIFIED (re-capture after the final deploy) |

## C. Evidence a buyer cannot be given

Revenue statements, payout history, affiliate earnings, bounce or engagement history, a mailing list, a backlink profile, first-party field performance data, or evidence that any affiliate partnership is active. None exists in this package. Say so plainly.

## D. Scam guardrails

Use the marketplace's own escrow only. Refuse off-platform payment, look-alike escrow sites and overpayment-and-refund requests. Do not push the domain or transfer the repository before funds are secured. Never share credentials: use the registrar's change-of-ownership flow, GitHub's repository transfer and each service's own invitation features.
