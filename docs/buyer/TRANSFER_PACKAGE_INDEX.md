# Transfer and handover package index

Every handover document, its purpose and the order a transfer normally follows. No credentials appear in any of them. Counts: `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`.

## Read first (before any transfer)

| Document | Purpose |
|---|---|
| `docs/BUYER_ASSET_INVENTORY.md` | What is being sold, what is not, with verified counts |
| `docs/SALE_LISTING_DRAFT.md` | The listing text, terms and risks |
| `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md` | Private evidence index: what exists, who collects it |
| `docs/TRANSFER_CHECKLIST.md` | Step-by-step transfer plan with risks and sign-off |
| `BUYER_HANDOVER.md` | Orientation for a non-developer owner: how publishing works, first-time tests |

## Transfer order

| Step | Do this | Documents |
|---|---|---|
| 1 | **Domain push** (Namecheap change of ownership; decide auto-renew first; never change nameservers) | `docs/DNS-AND-TRANSFER.md`, `docs/TRANSFER_CHECKLIST.md` section 1, `docs/COSTS-AND-ACCOUNTS.md` |
| 2 | **Repository transfer** (GitHub; seller first disconnects Lovable's GitHub sync) | `docs/TRANSFER_CHECKLIST.md` section 4, `docs/HOSTING_PORTABILITY_REPORT.md` section 4, `docs/SECURITY-AND-RECOVERY.md` |
| 3 | **Netlify** (buyer deploys from their own account; the seller's builds are stopped; batch edits because each deploy costs 15 credits) | `docs/buyer/HOSTING_OPTIONS.md`, `docs/HOSTING_PORTABILITY_REPORT.md`, `docs/TRANSFER_CHECKLIST.md` section 3, `docs/NETLIFY-BADGE.md`, `docs/ROLLBACK.md` |
| 4 | **Pages CMS** (sign in with GitHub, install the app on the repo, run the first-edit test; `.pages.yml` has never been opened in the live app) | `BUYER_HANDOVER.md` sections 4 to 6, `docs/WRITING-IN-MARKDOWN.md`, `docs/TRANSFER_CHECKLIST.md` section 5 |
| 5 | **Affiliate IDs swap** (non-transferable accounts: buyer applies, then replaces every ID and deeplink) | `docs/MONETIZATION_READINESS.md` section 5, `docs/AFFILIATE-AND-SELLING.md`, `docs/AFFILIATE-APPLICATION-PACK.md`, `docs/PRODUCT-LINKS-GUIDE.md` |
| 6 | **GA4, Search Console, Bing** (buyer creates their own; replace the GA4 ID; verify and submit the sitemap; IndexNow key) | `docs/ANALYTICS-SETUP.md`, `docs/TOOL-TRACKING.md`, `docs/cowork/02-search-console.md`, `docs/cowork/03-ga4-setup.md`, `docs/cowork/04-bing-import.md`, `docs/TRANSFER_CHECKLIST.md` sections 8 and 9 |
| 7 | **Pinterest** (owner decision: hand over the account or the buyer opens their own; 29 pins and a sheet are included) | `docs/PINTEREST-SETUP.md`, `docs/PINTEREST-STRATEGY.md`, `docs/pinterest-pins.csv`, `docs/TRANSFER_CHECKLIST.md` section 10 |
| 8 | **Email** (mailbox is not pushed with the domain; support-assisted move or fresh mailbox) | `docs/EMAIL-AND-TRANSFER.md`, `docs/EMAIL-ADDRESS-NOTES.md`, `docs/TRANSFER_CHECKLIST.md` section 12 |
| 9 | **Sign-off** (seller IDs removed, recovery methods removed, written assignment, legal pages reviewed) | `docs/TRANSFER_CHECKLIST.md` sections 13 and 14, `docs/SECURITY-AND-RECOVERY.md` |

## After the transfer: running the site

`docs/OPERATIONS-HANDBOOK.md`, `docs/OPERATIONS-RECORD.md`, `docs/SOP-weekly.md`, `docs/SOP-monthly.md`, `docs/SOP-quarterly.md`, `docs/DATA-RECHECK-LOG.md` (re-read the 38 manager pages at least every six months), `docs/LAUNCH-CHECKLIST.md`, `HANDOVER.md` (developer notes), `README.md`, `AGENTS.md` (instructions for AI coding agents).

## Evidence and research (supporting)

`docs/editorial/` (editorial change logs and scorecards), `docs/CLAIMS-*.md` and `docs/FACTCHECK-*.md` (per-guide audit trail), `docs/DISCLOSURE_AND_TRUST_AUDIT.md`, `docs/flip/` (earlier sale-readiness audits; some figures are superseded by the inventory), `docs/research/` (marketplace research; sale price strategy).
