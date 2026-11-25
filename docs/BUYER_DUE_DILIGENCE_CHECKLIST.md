# Buyer due-diligence checklist: private evidence index

Updated 2026-11-24 for repo `HEAD` `9797221`. **Nothing is deployed**; production is a stale build until the owner deploys, so every live-site row below stays UNVERIFIED until the post-deploy checks in [docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md](cowork/FINAL_PRE_SALE_BROWSER_QA.md) pass.

Purpose: list the evidence a buyer of a roughly $1,500, pre-revenue starter site can reasonably ask for, where each item is kept **privately**, who collects it and whether it exists yet. This file is the **sanitized index only**. It is committed to the repo; the evidence itself is not.

Rules
- Never put passwords, API keys, tokens, recovery codes, tax or bank details, identity documents, account screenshots or account emails in the repo or in this file. Evidence lives in a private folder owned by the seller (or the marketplace's private data room) and is shared only with a buyer who has signed the marketplace's terms.
- Status: **VERIFIED** (evidence exists and was checked, and the public part is cited here), **UNVERIFIED** (no evidence collected or could not be checked), **OWNER** (only the owner can supply it).
- Executors: **Claude** (repo and build work), **Cowork** (browser tasks under the owner's logged-in session, prompts in `docs/cowork/`), **Owner** (account holder).
- Marketplace expectations come from [docs/research/MARKETPLACES-AND-COMPS-2026-11.md](research/MARKETPLACES-AND-COMPS-2026-11.md). Marketplaces typically ask for analytics read access, proof of costs and identity verification; this site has no revenue, so revenue items are stated as zero, never estimated.
- Never state a replacement value, traffic figure, revenue figure or buyer interest in listing text unless it is evidenced here.

## A. Facts the listing may state (and their evidence)

| Fact | Evidence kept privately | Executor | Status |
|---|---|---|---|
| Domain `pawsandpassage.com`: registrar start 2026-11-16, valid to 2027-11-17, auto-renew OFF pending owner decision | Registrar domain list and overview page (redact account email); a dated WHOIS/RDAP lookup saved as PDF | Owner / Cowork (read-only) | OWNER (facts supplied by the owner; no screenshot in the repo) |
| HISTORICAL baseline (older production build): Google URL Inspection showed 21 of 23 inspected pages indexed | Search Console URL Inspection results with the inspected URL list and date | Owner / Cowork | OWNER |
| HISTORICAL baseline (older production build): Search Console reported 236 impressions and 0 clicks over 28 days | Performance report screenshot with the date range visible | Owner / Cowork | OWNER |
| Netlify free plan; builds stopped by the owner; about 65 credits left (15 per deploy) | Netlify plan and usage page (redact team and email) | Owner | OWNER |
| Counts of routes, guides, data and tests | [docs/buyer/ROUTE_AND_ASSET_COUNTS.md](buyer/ROUTE_AND_ASSET_COUNTS.md) (commands recorded there) | Claude | VERIFIED 2026-11-25 at `5aeb8b8` (774 tests in 61 files, `tsc` clean, build passed, 331 `verify-site` checks passed, 105 sitemap URLs, 31 published guides, 0 drafts). Re-run after any later commit |
| The 3 tools work | [docs/BUYER_ASSET_INVENTORY.md](BUYER_ASSET_INVENTORY.md) section 6, packing planner tests and browser runs in [docs/PACKING_PLANNER_QA.md](PACKING_PLANNER_QA.md) | Claude | VERIFIED on a local build 2026-11-24; real-device checks pending |
| Hero photos are credited Unsplash photos; no third-party (Amazon) images | `src/content/image-credits.ts`, grep of product cards; Unsplash License text | Claude | VERIFIED in repo; license reading (usage rights, not ownership or exclusivity) is general, not legal advice |
| AI-assisted content is disclosed | `/editorial-standards` page text | Claude | VERIFIED |
| One affiliate notice and the Amazon sentence on every page with an Amazon link; no per-button labels on guides and Gear | Crawl in the counts file: 49 of 49 Amazon pages carry the sentence | Claude | VERIFIED on the local build (wording not legally reviewed). **Open:** Vrbo stay buttons keep a label and `/affiliate-disclosure` still says every button has one (owner decision) |

## B. Evidence checklist

| # | Evidence | Why a buyer cares | How to collect | Executor | Stored | Status |
|---|---|---|---|---|---|---|
| 1 | Domain ownership page (registrar, dates, auto-renew, privacy) | Proves the seller owns what is sold | Screenshot of Namecheap domain overview | Owner / Cowork | Private folder | OWNER |
| 2 | Auto-renew decision recorded | Domain expires 2027-11-17 if nobody renews | Owner turns it on before the push or tells the buyer in writing | Owner | Private | OWNER |
| 3 | Domain not locked, registrant contact is the seller | Push can complete | Registrar page check | Owner / Cowork | Private | UNVERIFIED |
| 4 | Live site loads over HTTPS, www and apex behave | Buyer's first click | Fresh check with `node scripts/verify-site.mjs https://www.pawsandpassage.com` before listing | Claude | Repo summary only | UNVERIFIED (last live check pre-dates the stopped builds; the live site may differ from HEAD) |
| 5 | Repository ownership and history (commit count, first and last commit date, default branch) | Code title; 518 commits at `9797221`, first commit 2026-11-16 | `git log` summary | Claude | Repo summary | VERIFIED |
| 6 | Build and test proof on the final commit | Shows it runs | Re-run `bunx vitest run`, `tsc`, `vite build`; save summaries | Claude | Repo summary | VERIFIED at `9797221` (771 tests, 59 files; `tsc`, `eslint --quiet` and build passed); repeat on the final commit |
| 7 | Hosting proof: Netlify project, deploy history, plan | Shows how it is hosted and what it costs | Screenshot of Deploys and plan page | Owner / Cowork | Private | OWNER |
| 8 | Portability proof: clean install and build without any Lovable account | Removes a "paid Lovable usage" worry | [docs/HOSTING_PORTABILITY_REPORT.md](HOSTING_PORTABILITY_REPORT.md) (three builds passed on 2026-11-24) | Claude | Repo | VERIFIED |
| 9 | Lovable GitHub sync disconnected | Nothing from Lovable can push to the live branch | Owner disconnects in Lovable project settings; screenshot of the disconnected state | Owner | Private | UNVERIFIED (current state could not be read) |
| 10 | GA4: property exists; Realtime and Reports screenshots with the date range, read-only access only after terms are signed | Honest traffic baseline | Screenshot with dates | Owner | Private | OWNER |
| 11 | Search Console: Pages and Sitemaps reports as of the screenshot date; the 21 of 23 inspected result and the 236 / 0 numbers | Index status and honest zero clicks | Screenshots with dates; note any errors | Owner / Cowork | Private | OWNER |
| 12 | Traffic and revenue statement | Honest baseline | One paragraph: impressions, clicks and dates as above; revenue $0; no earnings to date. Never estimate | Owner | Listing text | OWNER |
| 13 | Affiliate status statement per program | Prevents a false monetization claim | applied / approved / not applied for Amazon Associates, Vrbo/Expedia, Impact, Awin; links wired in the site; accounts non-transferable; no commission or earnings quoted | Owner | Listing text | OWNER (config in repo is not proof) |
| 14 | Content provenance: dataset method and sources; editorial standards; AI disclosure | Honest origin, avoids a rights dispute | [docs/DATA-RECHECK-LOG.md](DATA-RECHECK-LOG.md), `/data/pet-policies`, `/editorial-standards` | Claude + Owner | Repo | VERIFIED (owner decides listing wording) |
| 15 | Image rights: credits list, derived pins and share images | Rights the buyer inherits | `src/content/image-credits.ts`; [docs/flip/audit-legal-transfer.md](flip/audit-legal-transfer.md) | Owner | Repo | VERIFIED for credits; rights chain of derived images UNVERIFIED |
| 16 | Third-party code licenses | Reuse rights | License-checker summary of production dependencies (permissive only per the audit) | Claude | Repo | UNVERIFIED (re-run on final commit) |
| 17 | Secrets scan of working tree and history | Buyer safety | Pattern scan; no keys found in the earlier audit | Claude | Repo summary | UNVERIFIED for a gitleaks-grade scan; public GA4 and Amazon tag IDs are intentional |
| 18 | Expenses | Buyer wants running costs | Domain renewal about $19.98 a year, optional mailbox about $14.88 a year, Netlify and GitHub $0 (list prices read 2026-11-18) | Owner | Listing text | UNVERIFIED for the seller's actual bills |
| 19 | Seller identity verification | Marketplace requirement | Marketplace flow only; never send ID to a buyer | Owner | Marketplace | OWNER |
| 20 | Transfer plan and package index | Reduces closing risk | [docs/TRANSFER_CHECKLIST.md](TRANSFER_CHECKLIST.md), [docs/buyer/TRANSFER_PACKAGE_INDEX.md](buyer/TRANSFER_PACKAGE_INDEX.md) | Claude | Repo | VERIFIED |
| 21 | Rights statement (copyright assignment, bill of sale) | Clean title | Written text reviewed by the owner's adviser | Owner | Private | OWNER |
| 22 | Pages CMS opens the repo and a save becomes a commit | Buyer will edit this way | The "Pages CMS" steps in [docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md](cowork/FINAL_PRE_SALE_BROWSER_QA.md); not done. Structure and tests pass locally; the authenticated flow is untested | Owner or buyer | n/a | UNVERIFIED |
| 23 | Screenshots of the live site | Buyers skim | Capture list in [docs/BUYER_WALKTHROUGH_SCRIPT.md](BUYER_WALKTHROUGH_SCRIPT.md) (private folder) | Cowork / Owner | Private | UNVERIFIED (capture after the final deploy) |
| 24 | Editorial quality evidence, stated honestly | A buyer will ask whether the guides are good | [docs/FINAL_EDITORIAL_RELEASE.md](FINAL_EDITORIAL_RELEASE.md): independent reader mean **7.1 of 10**, "ready with minor fixes". The reader scores were taken **before the final fixes** and the corrected text was not re-scored. Report it as a reviewer's reading of the pre-fix text, not as a quality score for the current text and not as marketing | Claude | Repo | VERIFIED as a record; no re-score exists |
| 25 | Seller identifiers inventory | Shows exactly what the buyer must replace | `node scripts/audit-seller-ids.mjs` (5 kinds remain: Amazon tag, GA4 ID, Impact value, Pinterest URL, 79 Vrbo deeplinks) and [docs/BUYER_AFFILIATE_TRANSITION.md](BUYER_AFFILIATE_TRANSITION.md) | Claude | Repo | VERIFIED 2026-11-24; the buyer runs `--expect-none` after replacing |
| 26 | Real-device and assistive-technology checks | Buyers on phones | Safari/iPhone and VoiceOver steps in [docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md](cowork/FINAL_PRE_SALE_BROWSER_QA.md) | Owner / Cowork | Private | UNVERIFIED |
| 27 | Production matches the repository | The listing describes `HEAD` | Deploy, then the post-deploy section of the QA file (sitemap 105, things-to-do 200, retired URL 301, `/guides/bringing-a-dog-to-a-no-pets-rental` and `/guides/pet-friendly-listing-red-flags` 200) | Owner / Cowork | Private | UNVERIFIED: production is a stale build from about 2026-11-23 |

## C. Evidence a buyer cannot be given

Revenue statements, payout history, affiliate earnings, bounce or engagement history, a mailing list, a backlink profile, first-party field performance data, or evidence that any affiliate partnership is active. None exists in this package. Say so plainly.

## D. Scam guardrails

Use the marketplace's own escrow only. Refuse off-platform payment, look-alike escrow sites and overpayment-and-refund requests. Do not push the domain or transfer the repository before funds are secured. Never share credentials: use the registrar's change-of-ownership flow, GitHub's repository transfer and each service's own invitation features.
