# Sale release status (single source of truth)

Last updated 2026-11-25. This is the only ledger of what has actually passed. A row is never marked complete because instructions or a plan exist; it needs evidence. Other documents (`docs/FINAL_SALE_CODE_RELEASE.md`, `docs/BUYER_WALKTHROUGH_SCRIPT.md`, `docs/SALE_LISTING_DRAFT.md`) must refer here for the target commit rather than naming one.

Allowed status values only: NOT STARTED, READY, IN PROGRESS, PASS, FAIL, BLOCKED, UNVERIFIED, DEFERRED WITH DISCLOSURE.

Who updates it: Claude Code, from Cowork returns (`docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`) and the owner's decisions. Cowork does not edit the repository.

## Status ledger

| Item | Status | Evidence or reason |
|---|---|---|
| Target commit | IN PROGRESS | Not yet fixed. The code checkpoint sets `TARGET_COMMIT` in the Release manifest below once the code worker's changes (affiliate disclosure page, settings tests, owner decision document) have landed on `main`. Until then, no verification may be recorded against a commit. |
| Current production commit | FAIL | Production serves a stale build from about 2026-11-23 22:44, commit `ced2c93` (98 sitemap URLs; retired weight-limit URL answers 200; things-to-do pages 404; "Check the current price" lines present). Source: `docs/SEO_ROOT_CAUSE_INVESTIGATION.md` section 2, fetched 2026-11-24. Not re-read since. |
| Code verification | UNVERIFIED | `docs/FINAL_SALE_CODE_RELEASE.md` section 4 records tsc, eslint, 771 tests, build and 319 `verify-site` checks passing for commit `9797221` (2026-11-24). `docs/PRESALE_BROWSER_QA_RESULTS.md` records 147 local Chromium page checks and 5 journeys passing after fixes (commit `84c0577`), with 286 `verify-site` checks. Neither covers the target commit; re-run all checks on `TARGET_COMMIT` at the code checkpoint. |
| Live deployment | BLOCKED | Owner approved one production deploy on 2026-11-25 (see Decision log), but Netlify builds are still off and no deploy has run. Nothing is deployed. |
| Owner decision: stay directory mode | READY | Recommendation prepared (public-sources); owner approval PENDING. Ready for the owner to decide; blocks the listing text and C1 step 9. |
| Owner decision: disclosure wording | READY | Mismatch open: Vrbo/stay buttons carry an "Affiliate link" label while `/affiliate-disclosure` says every buy or booking button has one and Amazon buttons do not (`docs/FINAL_SALE_CODE_RELEASE.md` sections 7 and 9). Wording being revised by the code worker; owner review PENDING. |
| Owner decision: deploy approval | PASS | Owner said "yes deploy" on 2026-11-25. Approves one deploy only; it has not happened (see Live deployment). |
| Owner decision: marketplace publication | NOT STARTED | Not authorized. |
| Cowork C0 (read-only account preflight) | NOT STARTED | Brief ready in `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`. No results returned. |
| Cowork C1 (live release verification) | BLOCKED | Needs the completed deployment and a filled manifest. |
| Cowork C2 (shopping, mobile, content QA) | BLOCKED | Needs C1 PASS. iPhone Safari is owner-reported good (2026-11-25, no screenshots or per-page notes): recorded as owner-reported, to be re-verified live. VoiceOver, Android, desktop Safari and Firefox: UNVERIFIED. |
| Cowork C3 (CMS and account workflow) | NOT STARTED | Read-only forms check is in C0. Any write needs explicit owner permission. |
| Cowork C4 (Search Console and traffic baseline) | BLOCKED | Needs C1 PASS. Baseline first; growth review after recrawl (not a blocker). |
| Cowork C5 (buyer screenshots and marketplace preview) | BLOCKED | Needs production verified, core journeys passing, affiliate mismatches resolved or disclosed, transition policy settled, inventory current. |
| CMS | UNVERIFIED | `.pages.yml` verified structurally and by tests only. Status if nothing more is done: CMS FORMS VERIFIED (after C0); AUTHENTICATED PUBLISH LOOP UNVERIFIED. Currently even the forms have not been opened by anyone. |
| Affiliate verification | UNVERIFIED | Amazon sample (13) and Vrbo deeplinks (5) not yet followed live; external sites were not followed in local QA. No verified affiliate approval exists for a buyer (`docs/BUYER_AFFILIATE_TRANSITION.md`). |
| Search Console | UNVERIFIED | Historical figures (236 impressions, 0 clicks, 21 of 23 inspected indexed) describe the older build. No post-release baseline. |
| Buyer presentation | NOT STARTED | 19 walkthrough screenshots not captured; no video exists; listing draft in `docs/SALE_LISTING_DRAFT.md` not checked against the live site. |
| Exact remaining blockers | BLOCKED | (1) Target commit not set. (2) Owner decision: stay directory mode. (3) Owner decision: disclosure wording. (4) Owner enables builds and deploys once; C1 verification. (5) C2 affiliate and journey checks. (6) C5 screenshots and draft preview. (7) Owner approval to publish. Not blockers: CMS publish loop (disclosed as unverified), Search Console growth review, real-device VoiceOver/Android (listing must not claim them if not done). |
| Next responsible party | READY | Claude Code: finish the code checkpoint (disclosure page, settings tests, owner decision document), fill the Release manifest, tell the owner the stay-mode and wording decisions are needed. Cowork: C0 may run now. Owner: decide stay mode and wording, enable builds and deploy once when told the target commit is final. |

## Release manifest

To be filled by the code checkpoint from the target commit's build. Do not fill from memory or from older documents. Cowork C1 compares the live site with these values.

| Field | Value |
|---|---|
| TARGET_COMMIT | TARGET_COMMIT (placeholder) |
| Date and time of manifest | MANIFEST_DATE (placeholder) |
| SITEMAP_URL_COUNT | SITEMAP_URL_COUNT (placeholder) |
| TOOL_COUNT | TOOL_COUNT (placeholder) |
| PUBLISHED_GUIDE_COUNT | PUBLISHED_GUIDE_COUNT (placeholder) |
| STAY_COUNTS_AND_INDEXING_MODE (files, listed, indexable, host-confirmed, `stayDirectoryMode`) | STAY_COUNTS_AND_INDEXING_MODE (placeholder) |
| ACTIVE_GEAR_COUNT (products, categories, trip collections) | ACTIVE_GEAR_COUNT (placeholder) |
| Things-to-do articles | THINGS_TO_DO_COUNT (placeholder) |
| Local checks on the target (tsc, eslint, tests, build, `verify-site` count) | LOCAL_CHECK_RESULTS (placeholder) |
| SIGNATURE_STRINGS (planner title and button, "Shop by trip", disclosure sentence, retired-URL redirect target) | SIGNATURE_STRINGS (placeholder) |

Historical counts for older commits stay in `docs/FINAL_SALE_CODE_RELEASE.md` and `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`, labelled with the commit at which they were counted.

## Decision log

| Date | Decision | Value | Status |
|---|---|---|---|
| 2026-11-25 | Stay directory mode | Recommended: `public-sources` (same listed stays, plain public source links, no commission, no affiliate label). Default today is `affiliate-only`. | Owner approval PENDING |
| 2026-11-25 | Affiliate disclosure wording | Reconcile the `/affiliate-disclosure` sentence with the Vrbo/stay button label (Amazon buttons carry no per-button label). | PENDING review |
| 2026-11-25 | Deploy | Owner said "yes deploy" (one production deploy of `main`, `docs/cowork/DEPLOY_NOW.md`). Builds are still off; not yet performed. | Approved, not executed |
| 2026-11-25 | Marketplace publication | Not authorized. A draft preview only is allowed (C5). | Not authorized |
