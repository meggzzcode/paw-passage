# Cowork brief: immediate flip of Paws & Passage (about $1,500, pre-revenue)

> Superseded (2026-11-24): counts here (30 guides, 37 stay files, 53 products) are old. Open browser tasks are now in `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`; counts in `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. <!-- SUPERSEDED-NOTE -->


Read this whole file first. It is self-contained: you start with no prior conversation. Date written: 2026-11-23. The repo is https://github.com/meggzzcode/paw-passage (work is on branch `claude/affiliate-setup`; production is `main`). Live site: https://www.pawsandpassage.com. Related files in the repo: `docs/FLIP_READINESS_AUDIT.md`, `docs/BUYER_ASSET_INVENTORY.md`, `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`, `docs/SALE_LISTING_DRAFT.md`, `docs/TRANSFER_CHECKLIST.md`, `docs/research/MARKETPLACES-AND-COMPS-2026-11.md`, `docs/flip/`.

## 1. Mission and constraints
Mission: get Paws & Passage ready to list on a marketplace as a **turnkey, pre-revenue starter site** with an ask of about $1,500, as fast as realistic (ready to list in 48 to 72 hours of hands-on work; a sale itself depends on buyers).

Do not: build features, redesign, write more articles, run long-term marketing, or speculate about growth. The owner has chosen to sell, not to keep growing it.

Never, without explicit owner approval in this conversation: buy or renew anything, change DNS or nameservers, change account ownership, submit a marketplace listing, contact buyers, initiate a domain or repo transfer, accept any agreement or terms, enter payment, tax, bank or identity details, change any account setting, add or remove users, or click Publish/Submit/Verify/Confirm on anything not named below. Never type, read aloud or store passwords, codes or recovery data. Stop and tell the owner at any CAPTCHA, "verify it is you", security warning, unexpected popup or screen that does not match these steps; never work around it. If a page needs a login you do not have, mark the task BLOCKED and continue.

Evidence rules: screenshots and exports go to a **private** folder the owner names (not the public repo). Redact account emails and IDs in anything that might be shared. Record only verified facts; write UNVERIFIED when you could not see it. Never invent traffic, revenue, comps, affiliate approvals or buyer interest. Do not quote commission rates or earnings.

## 2. Current verified website state (2026-11-23)
From `docs/BUYER_ASSET_INVENTORY.md`: 30 published guides (about 76,900 words, 166 FAQs, 491 citations), 3 draft guides (404 on the live site on purpose); an original 38-manager pet-policy dataset (`public/pet-policies-38-managers.csv`, page `/data/pet-policies`); 37 stay files, 32 listed and earning via approved Vrbo deeplinks, 5 hidden; 4 live tools; a gear hub with 53 active products, all with approved Amazon links (tag `pawspassage-20`); 98-URL sitemap; 30 Pinterest pins and 31 share images; 486 tests pass; production build succeeds. Hosting: Netlify free plan, project `paws-passage-test`, deploys from GitHub `main`. Domain: pawsandpassage.com at Namecheap (registered 2026-11-17). Pages CMS edits content. GA4 property G-1J97C8CPC1. Search Console: domain property (verified per the owner's tracker on 2026-11-17). Pinterest: https://www.pinterest.com/paws_and_passage/ (website claim status unconfirmed). **Traffic and revenue: none verified.** The unmerged branch fixes must be merged by the owner before listing (the owner must say "merge" to Claude).
Known limitations: no LICENSE and no assignment text; the seller's analytics, Amazon, Vrbo and Impact IDs are in the site and must be swapped by the buyer; the home hero (`hero-porch*.jpg`) is now a credited Unsplash photo (unsplash gives usage rights, not ownership or exclusivity); no legal review of Privacy and Terms; `docs/TRANSFER_CHECKLIST.md` lists the rest.

## 3. Dependency-aware execution order
1. **Stage 0 (no dependencies, start now):** tasks B1 to B6 (read-only evidence).
2. **Stage 1 (needs the owner's merge and a final Claude QA):** B7 and B8.
3. **Stage 2 (needs Stage 0 and 1):** B9 and B10 (marketplace prep, still no submission).
4. **Stage 3:** owner decisions, then the listing is submitted by the owner.
Do not start B7 until the owner confirms the branch is merged and Claude reports a green build on main. Do not start B9 until B1 to B6 are done, so the listing quotes real evidence.

## 4. Browser task queue
For every task: record what you saw, save the evidence, then mark PASS, FAIL, BLOCKED or NEEDS-OWNER. Owner approval is required only where stated.

**B1 (P0, blocks listing). Domain proof at Namecheap.** URL https://www.namecheap.com (sign in as the owner already is). Needs: Namecheap login. Steps: Account, Domain List, pawsandpassage.com, Manage. Inspect: registration date, expiry date, auto-renew, WhoisGuard/privacy state, nameservers, whether any "transfer lock", "registrar lock" or change-of-ownership restriction is shown. Record: dates, lock states. Capture: screenshots of Domain List and the Overview (redact account email). PASS: domain shows registered 2026-11-17 and active. If unavailable: BLOCKED. Owner approval: none (read-only).

**B2 (P0). Namecheap transfer rules, current.** URLs: Namecheap Knowledge Base (search "change ownership of a domain" and "domain transfer 60 day lock after registration"). Inspect: whether a newly registered domain is locked from a registrar transfer for 60 days; whether the "Change Ownership" (account-to-account push) process is free, available now and how long it takes. Record: exact quoted wording and URL, date read. PASS: you have an official page answering both. If the page is blocked, use Namecheap's support chat only to ask (no commitments). Owner approval: none to read; ask before opening a support ticket.

**B3 (P0). Netlify deploy status and plan.** URL https://app.netlify.com, project `paws-passage-test`. Inspect: latest production deploy is green and is from `main`; plan (free) and credit usage; domain settings show pawsandpassage.com and www; whether the "Powered by Netlify" badge setting exists. Capture: Deploys list and Domain management screenshots (redact team names/emails). PASS: latest deploy succeeded. Owner approval: none.

**B4 (P0). GA4 data, honestly.** URL https://analytics.google.com, property for Paws & Passage (G-1J97C8CPC1). Inspect: Reports > Realtime, Reports > Acquisition > Traffic acquisition for the maximum date range since 2026-11-17; total users and sessions to date. Record exact numbers and the date range. Capture: screenshot with the date range visible. If numbers are very low or zero: record them exactly; do not interpret them. PASS: you recorded real numbers. Owner approval: none; do NOT add users or change settings.

**B5 (P0). Search Console indexing status.** URL https://search.google.com/search-console, property pawsandpassage.com. Inspect: Sitemaps (status, discovered pages), Pages report (indexed vs not indexed counts and reasons), Performance (clicks and impressions since start). Record exact figures with dates. Capture: three screenshots. Do not click Validate Fix or Request Indexing in this task. PASS: you recorded status. Owner approval: none.

**B6 (P1). Affiliate and account status (status only, no changes).** (a) Amazon Associates (https://affiliate-program.amazon.com): record account status, whether it is still provisional, and the stated deadline for qualifying sales if shown (copy exact wording). (b) Vrbo/Expedia Group partner dashboard: record approved status and that the account and its links are seller-owned and not transferable. (c) Impact and Awin: record status only. (d) Pinterest: whether pawsandpassage.com shows as claimed. Capture: status screenshots with earnings amounts blurred or cropped out. Do not record or quote commissions. If a login is needed that you do not have: BLOCKED. Owner approval: none to read.

**B7 (P1). Mobile and desktop visual pass of the final build.** After the merge. Open https://www.pawsandpassage.com on a phone-size and a desktop window: home, a guide, /stays and one stay, /gear, /data/pet-policies, one tool, /about. Compare with `docs/flip/audit-live-qa.md` (Claude's automated pass). Record anything that looks broken, cut off or confusing; capture 8 screenshots for the listing. PASS: no visible defects. Owner approval: none.

**B8 (P1). CMS editing workflow proof.** URL https://app.pagescms.org. Inspect that the repo `meggzzcode/paw-passage` opens and lists collections (articles, stays, affiliate links, products, settings). **Do not save any edit** unless the owner approves one specific harmless edit (for example a typo) in this conversation, because a save commits to `main` and triggers a deploy. Record: collections visible, whether editing opens. Capture screenshot. PASS: collections open; if the owner approved a test edit, a new commit appears on `main`. Owner approval: required before any save.

**B9 (P1). Marketplace requirements, official pages only.** (a) Flippa (https://flippa.com): read the seller requirements, listing fees, success fee, rules on pre-revenue and AI-generated content, verification and escrow pages. Flippa pages returned HTTP 403 to automated fetches, so use the owner's browser. (b) Escrow.com fee calculator for a $1,500 sale. (c) Money Nomad official page (fee for sellers). Record exact fees, quoted wording and URLs with the date read, and put them in `docs/research/MARKETPLACES-AND-COMPS-2026-11.md` section "Verified in browser" (or a new file `docs/research/MARKETPLACES-BROWSER-VERIFIED.md`). Do **not** create a listing, enter payment or accept terms. Owner approval: required before creating any marketplace account.

**B10 (P1). Comparable listings.** On Flippa's public listing search (no login actions), look for starter or pre-revenue content sites under one year old: record 10 listings with asking price, age, content size, revenue (zero or none) and, if shown, "sold" status. Distinguish asking from sold prices; if sold prices are gated, say so. Do not contact sellers or bid. Output a short table in the same research file.

**B11 (P2). Screenshots pack.** Collect the sanitized screenshots in the private folder and list file names in `docs/flip/evidence/INDEX.md` (names only, no content that includes account details).

## 5. Buyer-readiness checklist (must be true before listing)
- [ ] Branch merged to `main` by the owner; Netlify deploy green; `docs/BUYER_ASSET_INVENTORY.md` numbers match the live site.
- [ ] B1 to B5 evidence collected; traffic and revenue statement written with exact numbers (or "none yet").
- [x] Hero image provenance and image credits resolved (`docs/flip/audit-legal-transfer.md`).
- [ ] Copyright assignment and bill-of-sale terms chosen by the owner (owner-only).
- [ ] Listing text approved by the owner, with no claim beyond the evidence; seller identity verification done by the owner on the marketplace.
- [ ] Repo history decision made (full history vs fresh squashed repo).

## 6. Buyer due-diligence package
See `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`: domain proof, repo proof, inventory, build and test proof, GA4 and Search Console screenshots (private), honest traffic statement, affiliate-status statement, image and data provenance, expenses, transfer plan, rights statement.

## 7. Marketplace and listing research
Prepared research (2026-11-23): `docs/research/MARKETPLACES-AND-COMPS-2026-11.md`. Summary: Flippa is the best fit (starter sites allowed; its pages were blocked to automated reads, so verify fees in the browser: third-party figures say an Entry listing is $29 and a 10% success fee under $50k, UNVERIFIED); Money Nomad charges a flat $297 seller fee (official) which is about 20% of $1,500; Empire Flippers, Motion Invest and FE International are not a fit; Sedo and Afternic sell domains only. Escrow.com costs $50 on a $1,500 sale (official calculator). Only three verified sold comps exist ($1,500 to $1,700), all with aged domains and backlinks, so a realistic close for this site is likely below $1,500.

## 8. Proposed sales listing
See `docs/SALE_LISTING_DRAFT.md` (draft only, nothing submitted).

## 9. Transfer-readiness procedure
See `docs/TRANSFER_CHECKLIST.md`. Accounts that cannot transfer and need buyer replacements: Amazon Associates tag, Vrbo/Expedia partner account, Impact, Awin, the GA4 property history (buyer creates their own; read-only share is optional), Search Console ownership (buyer verifies their own), the Namecheap Private Email mailbox, Pinterest account (owner decision), Pages CMS link (buyer re-links to their own GitHub), Lovable (not used).

## 10. Final status report (Cowork must write this at the end)
Report, in this order: (1) tasks completed with PASS/FAIL and the evidence file names; (2) verified facts collected (exact numbers and dates); (3) blocked tasks and why; (4) owner decisions needed; (5) remaining listing blockers; (6) a clear statement: READY TO LIST, READY AFTER (list), or NOT READY, with reasons. Do not state a price estimate you cannot support.
