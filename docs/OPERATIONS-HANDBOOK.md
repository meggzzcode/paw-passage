# Operations handbook (for a future owner)

Written 2026-11-18. This pulls together what a new owner needs to run Paws & Passage. It points to the detailed documents instead of repeating them. Nothing here is a promise of income, and no figure is invented: where a number is not known, it says so.

Related: `BUYER_HANDOVER.md` (what you are buying), `docs/DNS-AND-TRANSFER.md` (domain and email steps), `docs/OPERATIONS-RECORD.md` (account register), `docs/AFFILIATE-AND-SELLING.md`, `docs/SALE-READINESS.md`, and the audit reports in `docs/recovery/`. Verified costs, the owner's action list, email, security, restore steps and the Netlify badge are in `docs/COSTS-AND-ACCOUNTS.md`, `docs/EMAIL-AND-TRANSFER.md`, `docs/SECURITY-AND-RECOVERY.md` and `docs/NETLIFY-BADGE.md` (read 2026-11-18).

## 1. Architecture in one page

- A static-style website built with TanStack Start (React, TypeScript, Tailwind). There is **no database, no logins and no server to look after**.
- All content is plain files in GitHub: articles (`content/guides/*.md` and, not yet migrated, `src/content/guides/*.ts`), stays (`content/stays/*.yml`), dog-rule places (`content/places/*.yml`), affiliate links (`content/affiliates.yml`), business settings (`content/settings.yml`).
- A build step (`npm run build`) checks the content. A bad published article stops the build and the old site stays live. Drafts and unverified places are kept out of the public site.
- Tests: `npx vitest run`. They also run automatically on GitHub for every change (`.github/workflows/ci.yml`).
- Original data asset: the 38-manager pet-policy dataset (`src/content/manager-policies.ts`, `public/pet-policies-38-managers.csv`, notes in `docs/data/`).
- Tracking: Google Analytics 4 (ID in `content/settings.yml`) plus the click events described in `docs/TOOL-TRACKING.md`.

## 2. Hosting, domain and email

| Piece | Where | Notes |
|---|---|---|
| Website hosting | Netlify (free plan). Settings in `netlify.toml`. | Rebuilds automatically when GitHub changes. On the free plan you are **not emailed about failed builds** (email alerts need Pro; see section 8). Netlify's agreement (updated 2026-11-04) and acceptable-use policy do **not** prohibit commercial use of the free tier, but Netlify may pause or remove a free site at any time. The free plan has **300 credits a month, hard limit; each production deploy costs 15** (see `docs/COSTS-AND-ACCOUNTS.md` section 1a). A "Powered by Netlify" badge may show: `docs/NETLIFY-BADGE.md`. |
| Source code and content | GitHub repository `meggzzcode/paw-passage` (public), branch `main` is live | `main` is not protected; anything that can push (Pages CMS, Lovable app) writes straight to the live site. |
| Domain | Namecheap, `pawsandpassage.com` (free domain privacy) | Bought 2026-11-17. Keep DNS at Namecheap; **never change the nameservers** (email records live there). |
| Business email | Namecheap Private Email, "Launch" plan, 1 mailbox (`hello@pawsandpassage.com`, the only public address) | Not moved by a normal domain transfer. Verified options and do-not-do list: `docs/EMAIL-AND-TRANSFER.md`; DNS order: `docs/DNS-AND-TRANSFER.md`. Fees, downtime and password hand-over are still UNCONFIRMED (Namecheap's page is silent). |
| Editor | Pages CMS (pagescms.org), signs in with GitHub, uses `.pages.yml` | A real sign-in and edit test has not been done by anyone yet (`BUYER_HANDOVER.md` section 5). |
| Design tool (optional) | Lovable | Not needed to publish. See section 7 for the risk it adds. |

## 3. Content management (Pages CMS)

Open Pages CMS, sign in with GitHub, pick the repository. Collections: Articles, Stays, Dog-rule places, Affiliate links, Site settings. Saving creates a commit; Netlify then rebuilds (a few minutes).

- An article goes live only when Status is **Published**, **Approved by** and **Approved on** are filled, fact-checking is ticked and no claims are left unchecked.
- A stay appears with its status shown. Unverified stays show "Not confirmed" for unknown details and are never described as verified.
- A dog-rules place goes live only if verified with the official page address, the exact quoted sentence and the date read.
- 15 of the 24 guides, the towns, the gear product lists and the legal pages are still code files and need a developer (`docs/MIGRATION-PLAN.md`). Count as of 2026-11-18; check the folders for today's figure.
- House style for articles: `docs/audit/HOUSE-STYLE.md` and `docs/WRITING-IN-MARKDOWN.md`.

## 4. Affiliate relationships (and what will NOT transfer)

**Assume none of the affiliate accounts transfer.** The buyer applies for their own and pastes their own links into `content/affiliates.yml` (Pages CMS: "Affiliate links"). With no approved entry, buttons fall back to the maker's page or disappear, so nothing breaks.

| Program | Status in the repo docs | On a sale |
|---|---|---|
| Expedia Group (Vrbo, Expedia, Hotels.com) | Vrbo approved; links currently generic (report 09). Program terms read 2026-11-18. | Does **not** transfer. Either side can end it on 30 days' notice. Commission information is confidential: do not publish it, and share it with a buyer only after checking the wording with Expedia. Remove the entries and any inline `aff:vrbo` links (steps in `docs/AFFILIATE-AND-SELLING.md`). Never edit the program links or add prices. |
| Stay22 (map widget) | `stay22AccountId` is empty, so the map is hidden | **Non-assignable** without Stay22's written consent (section 13(i) per `docs/AFFILIATE-AND-SELLING.md`; section numbers came from a summarizing tool, re-read the terms). The licence is also non-transferable. Buyer signs up themselves. Do not download or host Stay22 or listing photos. |
| Impact | Account and the site-verification meta tag exist | Account transfer is possible only if the account is sold with the site; brand contracts do not move. Otherwise the buyer re-applies to each brand. |
| Awin | Programs researched in `docs/AFFILIATE-PROGRAMS.md` | Whether ownership can move for a normal sale is UNCONFIRMED: ask Awin support. Safest plan: re-apply. |
| Pepperjam Ascend (Kurgo) | Researched | Re-apply. |
| Amazon Associates | Not transferable (Operating Agreement section 12, per repo notes) | Buyer applies for their own account and re-tags every link. |
| Chewy | Declined (report 09) | Nothing to transfer. |

Rules that keep an account safe: use the link exactly as the program gives it, no shorteners or cloaking, keep disclosure wording (affiliate disclosure and privacy pages), and keep affiliate accounts on an address that is not `hello@` (owner's rule). Full detail: `docs/AFFILIATE-AND-SELLING.md`, `docs/AFFILIATE-PROGRAMS.md`, `docs/AFFILIATE-SETUP.md`.

## 5. Monthly expenses

Prices read from official pages on 2026-11-18; full sources and the owner's action list are in `docs/COSTS-AND-ACCOUNTS.md`. Introductory and renewal prices are kept apart.

| Item | Cost | Status |
|---|---|---|
| Domain + Private Email "Launch", **first term** | $24.16 order total on 2026-11-17 (one order, both items) | Evidenced (`docs/OPERATIONS-RECORD.md`). Introductory: not the running cost. |
| Domain `.com` **renewal** | $19.98 a year (from 2026-11-01; excludes the ICANN fee, amount not stated) | Namecheap notice: verified |
| Private Email Launch (1 mailbox) | $14.88 a year as listed; that page does not say whether it is the renewal price | Listed price verified; "is the renewal" UNCONFIRMED: read the cart |
| Renewal dates | UNCONFIRMED | Read them in Namecheap and record them |
| Netlify | $0 (free plan): 300 credits a month hard limit, 15 credits per production deploy | Verified. Commercial use is not prohibited by the agreement or acceptable-use policy; Netlify may pause or remove a free site. Paid plans ($9 or $20 a month) only if credits run out or email alerts are wanted (Pro). |
| GitHub | $0 (free plan, public repository) | Verified. Secret scanning is free on a public repo and paid on a private one. |
| Pages CMS | $0 (no price shown on any official Pages CMS page; MIT-licensed, can be self-hosted) | UNCONFIRMED, no guarantee it stays free |
| Google Analytics 4, Search Console, Bing | $0 | Free |
| Lovable | Paid Pro plan (listed at $25 a month; amount actually billed not seen) | **Not needed to build, host or edit** (verified in the repo). Owner decides whether to downgrade. |
| Affiliate networks, Stay22 | No cost evidenced | |
| **Total ongoing, preferred model** | **$34.86 a year ($2.91 a month)** = 19.98 + 14.88, divided by 12 | Domain + one mailbox, everything else free. Add $300 a year if Lovable Pro is kept. |

## 6. Revenue tracking

- **Revenue is currently $0.** No earnings exist yet, and traffic data is not yet available (the domain was bought 2026-11-17; Search Console and GA4 history have not been confirmed). Do not quote any income or traffic figure to a buyer until it is on a statement.
- Each month, record: GA4 sessions, Search Console clicks and impressions, earnings per affiliate program (download the statement), and expenses. The owner keeps a private tracking sheet ("Website Flipping Tracker"); its columns are not documented in the repo and it should stay out of the repo.
- Keep a separate tracking ID or property per site and per program so earnings stay provable. Save monthly statements and dated screenshots or screen recordings of each dashboard before any listing. Buyers and brokers discount income that cannot be verified (`docs/AFFILIATE-AND-SELLING.md`).
- Set up GA4 custom dimensions and key events once (listed in `docs/recovery/07-analytics-affiliate-system-automation.md`), and Search Console/Bing, so click reports exist.

## 7. Risks to know about

- No branch protection on `main`; a Lovable prompt or a CMS save publishes straight away. A personal-account repo cannot exempt Pages CMS or Lovable from a "require pull request" rule (bypass lists are organization-only), so do not add one; the safe rule is to block force-push and deletion only (`docs/SECURITY-AND-RECOVERY.md` section 3). Which branch Pages CMS writes to is UNCONFIRMED until the first real test.
- Netlify free plan gives no build-failure emails (email needs Pro). Free alternative: GitHub commit status (`docs/SECURITY-AND-RECOVERY.md` section 4).
- **Netlify free credits:** 300 a month, 15 per production deploy, so about 20 deploys use the whole allowance; at zero, visitors see "Site not available". Batch edits and check Team > Billing.
- A "Powered by Netlify" badge may appear bottom-right; it comes from a Netlify project setting, not the repo (`docs/NETLIFY-BADGE.md`).
- The build uses Lovable's npm config package (`@lovable.dev/vite-tanstack-config`, MIT, public npm, needs no Lovable account or subscription, verified 2026-11-18); see `BUYER_HANDOVER.md` section 8 and `docs/COSTS-AND-ACCOUNTS.md` section 3.
- One affiliate relationship is live; accounts are not transferable.
- A GitHub history scan for leaked keys has not been done; turn on GitHub secret scanning.

## 8. Standard operating procedures

### Publish a guide
1. Pages CMS > Articles > New. Write in the form; follow `docs/audit/HOUSE-STYLE.md`. Keep Status on Draft until finished.
2. Fill in sources, tick fact-checking finished, empty "Claims still unchecked". Add photos that match the article and have not been used anywhere else; no stock photos for real properties.
3. Set Status to Published, fill Approved by and Approved on. Save.
4. Wait about three minutes, open the live page and check it, then the sitemap (`/sitemap.xml`).
5. Optional: pin images are made by `scripts/make-share-images.py` into `public/pins` and `public/share`.

### Add a stay
1. Pages CMS > Stays > New. Fill in only what the listing shows; anything unknown stays "Not confirmed".
2. Leave status **unverified** unless someone has read the host's pet policy page and recorded it. Never describe an unverified stay as verified. Never copy listing photos without the host's written permission.
3. Save, wait for the rebuild, check the stay page.

### Update an affiliate link
1. Pages CMS > Affiliate links. Find the program entry and paste the link exactly as the program gives it (no edits, no extra parameters, no shortener).
2. Mark it approved only if the program has approved the site. With no approved entry the site uses the maker's or a plain retailer link.
3. Save, rebuild, click the button on the live site and confirm it lands where it should. Do not invent links.

### Run the monthly data re-check (policy dataset)
The dataset must be re-read at least every six months; next due about 2027-05-18. Steps are in `docs/DATA-RECHECK-LOG.md`: re-read each manager page, edit `src/content/manager-policies.ts`, run `bun scripts/make-policy-csv.mjs`, update `dataDate`, update dated counts in the guides, add a row to the log. The weekly Site health workflow opens an issue when this is overdue. The monthly routine for the whole site is: check the Site health issues, update the numbers sheet (section 6), and fix anything flagged.

### Handle a failed build
1. Netlify > Deploys. A failed deploy shows a plain message naming the file and the field.
2. Fix the field in Pages CMS (or revert the last commit in GitHub). The live site keeps the previous version meanwhile.
3. If the message mentions `npm ci` or lockfiles, a developer must regenerate `package-lock.json`.
4. Optional: in Netlify, Project configuration > Notifications > Deploy notifications, add the free GitHub commit status so failures show on GitHub. Email alerts need the Pro plan (`docs/SECURITY-AND-RECOVERY.md` section 4).
5. If hosting itself is lost, rebuild from the repository: `docs/SECURITY-AND-RECOVERY.md` section 6. Take a monthly offline backup (same section).

## 9. Automation

| Workflow | When | What it does |
|---|---|---|
| `.github/workflows/ci.yml` | Every push to `main` and pull request | Clean install, tests, build, lockfile checks. |
| `.github/workflows/site-health.yml` | Every Monday 06:17 UTC, or run by hand in GitHub Actions | Runs tests; visits every page in the live sitemap (status codes only, 403/429 treated as a warning; skips hosts that block robots); lists articles, places and data overdue for re-check (articles 6 months, places 12, policy data 6). Opens or updates one GitHub issue per problem type, labelled `site-health`, and closes it when fixed. Uses only GitHub's built-in token. |
| `scripts/site-health.mjs` | Called by the workflow; run by hand with `node scripts/site-health.mjs links` or `freshness` | The rules and thresholds sit at the top of the file. |
| `scripts/verify-site.mjs <url>` | By hand after a change | Deeper check of a deployed site. |
| `scripts/make-policy-csv.mjs`, `make-share-images.py` | By hand | Rebuild the dataset CSV and the pin/share images. |

Make sure GitHub notifications for issues are on for the owner's account. Never automate affiliate approvals, price or image scraping, or edits to articles without review.

## 10. Website transfer procedure

Follow `docs/DNS-AND-TRANSFER.md` (order and day-of-sale checklist) and `BUYER_HANDOVER.md` section 7. In short, in this order:
1. Seller: collect final statements and screenshots; take dashboard recordings.
2. Namecheap domain: "Change Ownership" to the buyer's account. DNS stays at Namecheap.
3. Private Email: ask Namecheap support first (fees and downtime UNCONFIRMED); fallback is a new subscription and copying the mail.
4. GitHub: transfer the repository to the buyer's account.
5. Netlify: buyer imports the repository into their own team; reconnect the domain and HTTPS; check the build.
6. Pages CMS: buyer signs in with GitHub and installs the Pages CMS GitHub App on the repository.
7. Google: grant the buyer access to Analytics and Search Console (owner-added users).
8. Seller removes their affiliate links and accounts from the site; the buyer adds their own.
9. Offer a transition period (for example 30 days) to swap links and answer questions.

## 11. Checklist for the new owner

- [ ] Take ownership of the domain at Namecheap; turn on auto-renew and two-factor sign-in; read the renewal price.
- [ ] Move or recreate the Private Email mailbox; change the contact address in Pages CMS (Site settings) if it changes.
- [ ] Take the GitHub repository; turn on two-factor sign-in and secret scanning.
- [ ] Create your own Netlify account/team, import the repo, reconnect the domain, confirm HTTPS and a good build.
- [ ] Sign in to Pages CMS and do one real edit end to end.
- [ ] **Apply for your own affiliate accounts** (Expedia Group Travel Creator, Impact, Awin, Pepperjam Ascend, Amazon Associates, Stay22) using an address you control; paste your links in Pages CMS. Delete the previous owner's entries.
- [ ] Enter your own `stay22AccountId` in Site settings (or leave it empty to keep the map hidden).
- [ ] **Remove the previous owner's Impact verification meta tag** (`impact-site-verification` in `src/routes/__root.tsx`, a code change) and verify your own Impact property if you use Impact.
- [ ] **Transfer or replace the Google Analytics 4 property:** get Administrator access to the old property (or create a new one) and change `ga4MeasurementId` in Site settings. Re-register the custom dimensions and key events. Do the same for Search Console.
- [ ] Update the privacy, terms and affiliate disclosure pages with your own business details (the owner skipped legal review; get your own).
- [ ] Update `contactEmail` and any other seller details; check the site for the previous owner's names and links.
- [ ] Decide whether to disconnect Lovable's GitHub sync and cancel any Lovable plan (the site needs neither; `docs/COSTS-AND-ACCOUNTS.md` section 3).
- [ ] Check the Netlify "Powered by Netlify" badge setting and the credit meter (`docs/NETLIFY-BADGE.md`).
- [ ] Turn on GitHub Issue notifications so the weekly Site health issues reach you.
- [ ] Do the first six-month data re-check by about 2027-05-18.
