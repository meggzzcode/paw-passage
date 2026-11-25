# Buyer handover QA report (internal)

Internal. Not part of the buyer package. Written 2026-11-25 for the rebuilt [BUYER_HANDOVER.md](../BUYER_HANDOVER.md) ("START HERE: Paws & Passage Owner's Guide", version 2.0).

## 1. Commit counted at and what was run

All counts were taken on a clean `git archive` of commit `3e5923b`. Later commits at the time of writing (`edbd6e0`, `fd3ec3a`) changed only one guide's wording and a review note, so no count moved.

| Check             | Command                                                                                                                                                                                                                                | Result                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content counts    | throwaway Vitest file importing the site's own rules (`allGuides`, `isPublic`, `visibleStays`, `indexableStays`, `sitemapEntries`, `products`, `liveCategories`, `tripCollections`, `affiliateLinks`, `allTownReads`, `packingConfig`) | 32 guide files (25 Markdown, 7 TypeScript); 29 published (22 Markdown + 7 TypeScript); 3 drafts, all Markdown; 83 stay files; 78 shown; 23 indexable; 55 shown but noindex; 5 hidden; 0 host-confirmed; mode `public-sources`; 92 products, 65 active; 11 categories; 5 trip collections; 160 affiliate entries (79 Vrbo, 81 Amazon, 71 Amazon approved); 8 town articles; 37 packing items, 5 trip types, 9 conditions, 7 categories |
| Tests             | `npx vitest run`                                                                                                                                                                                                                       | 783 passed in 61 files                                                                                                                                                                                                                                                                                                                                                                                                                |
| Types and lint    | `npx tsc --noEmit`, `npx eslint . --quiet`                                                                                                                                                                                             | both clean                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Build and sitemap | `NITRO_PRESET=node-server npx vite build`, served on a local port, `curl /sitemap.xml`                                                                                                                                                 | build OK; 103 URLs                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Live-site checker | `node scripts/verify-site.mjs <local build> --site-url https://www.pawsandpassage.com`                                                                                                                                                 | 319 passed, 0 failed                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Seller-ID audit   | `node scripts/audit-seller-ids.mjs` and `--expect-none`                                                                                                                                                                                | 5 items remain; `--expect-none` exits 1 (expected before the buyer replaces them)                                                                                                                                                                                                                                                                                                                                                     |
| Build-skip rule   | `node scripts/test-netlify-ignore.mjs`                                                                                                                                                                                                 | all rows pass                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Prices            | WebFetch of Netlify pricing, Namecheap .com notice, Namecheap Private Email plans, Pages CMS site, GitHub pricing, all on 2026-11-25                                                                                                   | Netlify Free $0 and 300 credits, Personal $9 and 1,000, Pro $20 and 3,000, production deploy 15 credits; .com renewal $19.98 a year excluding the ICANN fee (effective 2026-11-01); Private Email Launch $14.88 a year (page does not say renewal or promotional); Pages CMS states it is free; GitHub Free $0                                                                                                                        |

Known differences from older documents: the test count fell from 785 in 62 files (ledger, at `daa758f`) to 783 in 61 after the cleanup worker removed code and a test file.

## 2. Live verification dates used in the guide

- Cowork C0 (2026-11-25, read-only): Netlify project, credits, build settings, HTTPS certificate (expires 2027-02-14, "renewal incomplete" flag for the apex domain); Pages CMS forms load, no configuration error; Namecheap registration, expiry, auto-renew OFF, Domain Lock ON, Change Ownership and Transfer Out available. Source: [SALE_RELEASE_STATUS.md](./SALE_RELEASE_STATUS.md).
- Production commit `main@82b0b34`, not the final commit (ledger, Claude public checks 2026-11-25).
- Not verified anywhere: full Pages CMS save-to-live loop, Namecheap registration-restriction text, button wording in Netlify and Pages CMS, whether Lovable GitHub sync is still connected.

## 3. Link check

`node scripts/check-doc-links.mjs --anchors --unlinked` over [BUYER_HANDOVER.md](../BUYER_HANDOVER.md), [HANDOVER.md](../HANDOVER.md), [README.md](../README.md), `docs/BUYER_*`, [docs/TRANSFER_CHECKLIST.md](TRANSFER_CHECKLIST.md) and `docs/buyer/*.md`: **19 files (including this report), 0 broken links, 0 unlinked file mentions.** Method: markdown link targets are resolved against the file's folder; anchors are checked against headings; file paths written in code formatting are reported. Before the fix, 97 file mentions in code formatting (mostly in [BUYER_ASSET_INVENTORY.md](./BUYER_ASSET_INVENTORY.md), [BUYER_DUE_DILIGENCE_CHECKLIST.md](./BUYER_DUE_DILIGENCE_CHECKLIST.md), [README.md](../README.md)) were turned into links, and two literal `[text](url)` examples were put in code spans. The script is read-only and can be re-run by anyone.

## 4. Screenshot status

All pending. No screenshot exists and none was faked. The exact Cowork request is [cowork/D2_BUYER_SCREENSHOTS.md](./cowork/D2_BUYER_SCREENSHOTS.md): 8 required (`buyer-01` to `buyer-08`) and 2 optional (`buyer-09`, `buyer-10`), each with page, click path, visible fields, numbered highlights, redaction list, alt text, caption and public or private storage. The guide has 9 "Screenshot pending" lines (`buyer-01` to `buyer-09`); `buyer-10` is optional and not placed. `docs/buyer/img/` does not exist yet.

## 5. Usability simulation (nontechnical buyer, 10 tasks)

Method: read the guide as a person who knows no Git or YAML, follow each task, and check labels against `.pages.yml` (parsed with a script; labels in the guide were copied from it).

| #   | Task                                | Found quickly?                        | Steps in order? | Labels accurate?                                                              | Success defined?                                      | Risks visible?                    | Missing knowledge or change made                                             |
| --- | ----------------------------------- | ------------------------------------- | --------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Where to edit an article            | Yes, Task A                           | Yes             | Yes ("Articles", "Article text (written in Markdown ...)", "Last checked on") | Yes                                                   | Yes (7 code guides)               | Added "Cannot find your article?" line pointing to the 7 code-managed guides |
| 2   | Why an article has not published    | Yes, section 8 and Task B             | Yes             | Yes                                                                           | Yes                                                   | Yes                               | Section 8 row did not name the four gate items; added a pointer to Task B    |
| 3   | Update a Gear product               | Yes, Task D                           | Yes             | Yes ("Products (travel essentials)", "Show this product?")                    | Yes (appears in category after build)                 | Yes (never change the Short name) | Gear is called Products in the CMS; stated in Task D                         |
| 4   | Update a packing recommendation     | Yes, Task E                           | Yes             | Yes                                                                           | Yes                                                   | Yes (no duplicates, ids)          | Did not say where to find a product id; added "its Short name"               |
| 5   | Remove or replace an affiliate link | Yes, Task F                           | Yes             | Yes                                                                           | Yes                                                   | Yes                               | Removal was missing; added "untick Approved, never delete the entry"         |
| 6   | Why stays work without seller links | Yes, section 5                        | Yes             | n/a                                                                           | Yes                                                   | Yes (earns nothing)               | None                                                                         |
| 7   | Check a change is live              | Yes, section 6 last paragraph         | Yes             | Netlify wording UNVERIFIED, marked                                            | Yes                                                   | Yes                               | Button wording needs Cowork (D2 item 6)                                      |
| 8   | Recover from a failed build         | Yes, section 8 row 2 and rollback row | Yes             | Netlify and GitHub wording UNVERIFIED                                         | Yes                                                   | Yes                               | None beyond the pending screenshots                                          |
| 9   | Find accounts needed and costs      | Yes, sections 1 and 12                | Yes             | n/a                                                                           | Yes (dated prices)                                    | Yes                               | None                                                                         |
| 10  | Confirm full ownership              | Yes, section 10 and the checklist     | Yes             | n/a                                                                           | **Was vague**; added a one-sentence test of ownership | Yes                               | Section 10 is short by design; it links the checklist                        |

Unnecessary cross-references: none in the guide's task sections. The guide links only to documents it needs (see section 3 of the report). The guide did not grow for any single task; five one-line additions in total.

## 6. Word count

[BUYER_HANDOVER.md](../BUYER_HANDOVER.md) is about 5,460 words in total. Excluding tables, checklist items and the section 3 step blocks (the checklist-style material), the essential explanation is about 3,325 words, inside the 2,500 to 3,500 target. Section 3 step blocks add about 915 words and tables about 1,000.

## 7. Cross-document consistency

Stale statements corrected:

- [README.md](../README.md): test count (783 in 61 files), deployment status, stay listing rule (public-sources), buyer start order.
- [HANDOVER.md](../HANDOVER.md): "37 stays" and "32 listed" replaced; stay listing rule; Lovable export step replaced; Hostinger section marked historical.
- [OPERATIONS-HANDBOOK.md](./OPERATIONS-HANDBOOK.md): "15 of the 24 guides" replaced with the current guide split; CMS area names corrected; header marks the file as advanced reference with its older plan figures.
- [BUYER_ASSET_INVENTORY.md](./BUYER_ASSET_INVENTORY.md): dated update header (tests, deployment, CMS status, disclosure rewrite); one literal link example fixed.
- [BUYER_AFFILIATE_TRANSITION.md](./BUYER_AFFILIATE_TRANSITION.md): the "off by default / shipped switched off" wording replaced (public-sources is the shipped mode, owner-approved 2026-11-25); the label trap is noted.
- [buyer/HOSTING_OPTIONS.md](./buyer/HOSTING_OPTIONS.md), [COSTS-AND-ACCOUNTS.md](./COSTS-AND-ACCOUNTS.md): Netlify plans and prices re-read 2026-11-25; seller account showing 1,000 credits noted.
- [SALE_LISTING_DRAFT.md](./SALE_LISTING_DRAFT.md): not-deployed, Pages CMS and disclosure-mismatch lines updated.
- [buyer/ROUTE_AND_ASSET_COUNTS.md](./buyer/ROUTE_AND_ASSET_COUNTS.md): recount note.
- [BUYER_OVERVIEW.md](./BUYER_OVERVIEW.md) and [TRANSFER_CHECKLIST.md](./TRANSFER_CHECKLIST.md) and [buyer/TRANSFER_PACKAGE_INDEX.md](./buyer/TRANSFER_PACKAGE_INDEX.md): rewritten.

Left as they are (historical, not rewritten): `docs/flip/`, `docs/recovery/`, [FINAL_SALE_CODE_RELEASE.md](./FINAL_SALE_CODE_RELEASE.md), [PRESALE_BROWSER_QA_RESULTS.md](./PRESALE_BROWSER_QA_RESULTS.md), `cowork/` task briefs, the 2026-11-24 crawl and SEO reports in `docs/buyer/`, and the `CLAIMS-*`, `FACTCHECK-*` and `review/` files. [BUYER_WALKTHROUGH_SCRIPT.md](./BUYER_WALKTHROUGH_SCRIPT.md) and [BUYER_DUE_DILIGENCE_CHECKLIST.md](./BUYER_DUE_DILIGENCE_CHECKLIST.md) were only linkified; their content is evidence indexes for the seller.

Stale statements found but not changed because they sit outside docs or outside this brief:

- [AGENTS.md](../AGENTS.md) "Project rules" still says a stay is listed only when it earns an approved link and that the sample/affiliate rule is the shipped mode. It describes the old mode.
- `.pages.yml`: the header comment says the file was never opened in Pages CMS; the "Which stays are listed" label says to leave it on the first option and calls it "current behaviour", but the shipped value is `public-sources`; one description reads "A article". Not edited (instructed not to).
- Several older docs still describe the Netlify plan as free with 300 credits. The seller's account showed a Personal plan with 1,000 credits on 2026-11-25.

## 8. Remaining unknowns

1. Full Pages CMS edit, save, build and live loop; which branch it saves to.
2. Exact button and menu wording in Pages CMS, Netlify and GitHub in a buyer's account (screenshots pending).
3. Namecheap registration-restriction text after a new registration or owner change; whether Change Ownership triggers a 60-day lock.
4. Whether the Lovable GitHub sync is still connected.
5. How a transferred Netlify project behaves for builds and publishing on the buyer's team (auto-publish lock, plan).
6. Which commit is live at closing (final commit not yet deployed).
7. Whether Private Email $14.88 is the renewal price; the ICANN fee amount.

## 9. Owner decisions needed

- Approve the second deploy of the final commit (about 15 credits) before closing, or state in the agreement that the buyer will deploy.
- Decide Domain auto-renew (currently OFF) before the Namecheap ownership change.
- Decide the length of the written support period.
- Decide Pinterest and Google Analytics handover or removal.
- Decide whether someone with config access should update the `.pages.yml` "Which stays are listed" labels and header comment, and [AGENTS.md](../AGENTS.md).
- Approve the legal pages position (unreviewed) for the listing.

## 10. Acceptance checklist (15 points)

| #   | Criterion                                                                                      | Result  | Evidence                                                                                         |
| --- | ---------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| 1   | Title, status line (version, date, commit, DRAFT: SCREENSHOT VERIFICATION PENDING)             | PASS    | Top of guide                                                                                     |
| 2   | Architecture diagram with correct hosts (not Pages CMS or Lovable)                             | PASS    | "How the pieces fit"                                                                             |
| 3   | Sections 1 to 12 in the specified order plus Advanced section                                  | PASS    | Headings                                                                                         |
| 4   | Plain English; jargon explained once; commands only in Advanced                                | PASS    | One command in section 5 is flagged as needing the Advanced section                              |
| 5   | Length 2,500 to 3,500 words of essential explanation                                           | PASS    | about 3,325 words                                                                                |
| 6   | First-day steps have Where, What to do, Success, If it fails; escrow rule; safe transfer order | PASS    | Section 3                                                                                        |
| 7   | Task labels match `.pages.yml` exactly                                                         | PARTIAL | Copied from the file; button labels unverified; the stay-mode drop-down label is stale (flagged) |
| 8   | CMS-editable vs code-managed counted                                                           | PASS    | 25 Markdown (23 published, 2 drafts; 22 and 3 before 2026-11-25) and 7 TypeScript, all published                             |
| 9   | Affiliate section honest (no earnings, not proof of approval, public-sources explained)        | PASS    | Section 5                                                                                        |
| 10  | Publishing truthfully separated into verified and unverified                                   | PASS    | Section 6                                                                                        |
| 11  | Costs dated and sourced; no seller cost used; no $0 promise                                    | PASS    | Section 12, checked 2026-11-25                                                                   |
| 12  | Screenshots pending only; no faked images; D2 request complete                                 | PASS    | D2 file; all pending                                                                             |
| 13  | Other files updated (checklist, index, overview, stale claims)                                 | PASS    | Section 7                                                                                        |
| 14  | Link check script runs clean                                                                   | PASS    | 0 broken of 158                                                                                  |
| 15  | Usability test on 10 tasks recorded with fixes                                                 | PASS    | Section 5                                                                                        |

## 11. Verdict

**READY AFTER COWORK SCREENSHOT AND LABEL VERIFICATION.** The guide is complete and follows the evidence. It is not 100% verified: the CMS save loop, button wording and several account behaviours are UNVERIFIED and are labelled as such. Do not describe it as fully verified until D2 returns and the guide is updated.
