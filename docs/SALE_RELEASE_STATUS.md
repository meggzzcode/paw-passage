# Sale release status (single source of truth)

Last updated 2026-11-25. This is the only ledger of what has actually passed. A row is never marked complete because instructions or a plan exist; it needs evidence. Other documents (`docs/FINAL_SALE_CODE_RELEASE.md`, `docs/BUYER_WALKTHROUGH_SCRIPT.md`, `docs/SALE_LISTING_DRAFT.md`) must refer here for the target commit rather than naming one.

Allowed status values only: NOT STARTED, READY, IN PROGRESS, PASS, FAIL, BLOCKED, UNVERIFIED, DEFERRED WITH DISCLOSURE.

Who updates it: Claude Code, from Cowork returns (`docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`) and the owner's decisions. Cowork does not edit the repository.

## Status ledger

| Item | Status | Evidence or reason |
|---|---|---|
| Target commit | READY | `ca2ffbd` (last code or content commit, 2026-11-25; every later commit must be documentation only). It includes: the republished no-pets-rental guide, the republished listing red-flags guide (breed-restrictions draft deleted: 31 published guides, 0 drafts), the lighter in-sentence sourcing (trailing publisher tags removed: 220 to 2; all sources still in each Sources list), the heat-guide water fix, public-sources stay mode, the cleanup, and the 14px notices. The built-but-unpublished Netlify deploys of `9848745` and `7fc3f3b` must NOT be published. |
| Current production commit | PASS | Production runs `main@82b0b34` (published 2026-11-25 8:33 PM, 32s build, per Cowork), replacing `dbfa280`. This is BEFORE the final code commit `daa758f`: live still has the 11px article notice, no first-product notice and `affiliate-only` mode. Claude's own public fetch on 2026-11-25 confirmed the build is the new generation (see Live deployment). |
| Code verification | PASS | On `ca2ffbd`, 2026-11-25 (clean tree, nothing uncommitted): tsc clean; eslint --quiet clean; vitest 805 passed in 61 files; production build OK; `verify-site` 331/331 with no draft marker (port 4950); sitemap 105 (23 stay URLs, 31 guide URLs); new guides 200; breed URL 404; retired weight-limit URL 301; netlify-ignore rows pass; doc link check 187 links, 0 broken; audit-seller-ids reports the 5 seller identifier kinds. |
| Live deployment | BLOCKED | Production runs `main@82b0b34`. Final release needs ONE new Netlify build of `ca2ffbd` or later (about 15 credits; Cowork read 45 credits on 2026-11-25; builds are Stopped; auto-publishing is locked so Publish deploy is also needed). Owner authorization for that second build: PENDING. |
| Owner decision: stay directory mode | PASS | Owner approved `public-sources` on 2026-11-25; implemented in `daa758f` (`content/settings.yml`), tested (`src/test/stay-directory-mode.test.ts`, `stay-mode-public-sources.test.ts`). C1 must confirm it on the live site. |
| Owner decision: disclosure wording | READY | `/affiliate-disclosure` rewritten (`6590f0b`) to match the real behaviour and the active stay mode; `/methodology` and `/editorial-standards` aligned (`daa758f`). Proposed text and five items for owner or legal review: `docs/OWNER_DECISION_STAY_MODE.md` section 'Disclosure wording'. Owner approved in principle 2026-11-25 with a legibility correction, implemented in `daa758f`: notices are now 14px (were 11px) and the first product card in each article repeats the notice beside its buy button. Legal uncertainty stays flagged for owner review (`docs/OWNER_DECISION_STAY_MODE.md`); not certified compliance. |
| Owner decision: deploy approval | PASS | Owner said "yes deploy" on 2026-11-25; one deploy ran (`82b0b34`). The final commit `daa758f` needs a second deploy: approval PENDING. |
| Owner decision: marketplace publication | NOT STARTED | Not authorized. |
| Cowork C0 (read-only account preflight) | PASS | Returned 2026-11-25. Netlify: project `paws-passage-test`, personal plan, 1,000 credits/month, 63 left (period Nov 17 to Dec 16, auto-recharge off), about 15 credits per deploy, build `npm run build`, publish `dist`, production branch UNVERIFIED on the pages read; builds now ACTIVE, auto-publishing locked (manual Publish needed). HTTPS: Let's Encrypt covers apex and www, expires 2027-02-14; Netlify flags 'Certificate renewal incomplete: missing domains pawsandpassage.com'. Pages CMS: opens `main`, all forms load, no config error; Packing planner form loads slowly (about 40 s). Namecheap: registered 2026-11-16, expires 2027-11-17, auto-renew OFF, privacy ON, Domain Lock ON, Change Ownership and Transfer Out available, recent-registration restriction text not read (UNVERIFIED), DNS and mail records present. Deviation: Cowork also activated builds and ran the one deploy (the owner had said deploy). |
| Cowork C1 (live release verification) | BLOCKED | Needs the completed deployment and a filled manifest. |
| Cowork C2 (shopping, mobile, content QA) | BLOCKED | Needs C1 PASS. iPhone Safari is owner-reported good (2026-11-25, no screenshots or per-page notes): recorded as owner-reported, to be re-verified live. VoiceOver, Android, desktop Safari and Firefox: UNVERIFIED. |
| Cowork C3 (CMS and account workflow) | NOT STARTED | Read-only forms check is in C0. Any write needs explicit owner permission. |
| Cowork C4 (Search Console and traffic baseline) | BLOCKED | Needs C1 PASS. Baseline first; growth review after recrawl (not a blocker). |
| Cowork C5 (buyer screenshots and marketplace preview) | BLOCKED | Needs production verified, core journeys passing, affiliate mismatches resolved or disclosed, transition policy settled, inventory current. |
| CMS | UNVERIFIED | `.pages.yml` verified structurally and by tests only. Status if nothing more is done: CMS FORMS VERIFIED (after C0); AUTHENTICATED PUBLISH LOOP UNVERIFIED. Currently even the forms have not been opened by anyone. |
| Affiliate verification | UNVERIFIED | Amazon sample (13) and Vrbo deeplinks (5) not yet followed live; external sites were not followed in local QA. No verified affiliate approval exists for a buyer (`docs/BUYER_AFFILIATE_TRANSITION.md`). |
| Search Console | UNVERIFIED | After deployment Cowork inspects `/guides/bringing-a-dog-to-a-no-pets-rental` in Search Console and monitors its impressions and clicks; no ranking recovery is claimed and no indexing request is made unless the owner separately authorizes it. Historical figures (236 impressions, 0 clicks, 21 of 23 inspected indexed) describe the older build. No post-release baseline. |
| Buyer presentation | NOT STARTED | 19 walkthrough screenshots not captured; no video exists; listing draft in `docs/SALE_LISTING_DRAFT.md` not checked against the live site. |
| Exact remaining blockers | BLOCKED | (1) C0 preflight not yet run. (2) Owner enables builds and deploys once; C1 verification. (4) C2 affiliate and journey checks. (5) C5 screenshots and draft preview. (6) Owner approval to publish. Not blockers: CMS publish loop (disclosed as unverified), Search Console growth review, real-device VoiceOver/Android (listing must not claim them if not done). |
| Next responsible party | READY | Claude Code: done (final code commit `ca2ffbd`). Cowork: C0 may run now. Owner: after C0 passes, confirm credits and deploy once (target commit `ca2ffbd` is final unless C0 finds a P0). |

## Release manifest

To be filled by the code checkpoint from the target commit's build. Do not fill from memory or from older documents. Cowork C1 compares the live site with these values.

| Field | Value |
|---|---|
| TARGET_COMMIT | `ca2ffbd` (last code or content commit; verify with `git diff --stat ca2ffbd origin/main -- src content public netlify.toml package.json .pages.yml AGENTS.md` showing nothing) |
| Date and time of manifest | 2026-11-25, counted on a production build of `ca2ffbd` served locally (port 4950) |
| SITEMAP_URL_COUNT | 105 |
| TOOL_COUNT | 3 (packing planner, will-my-dog-be-accepted, rental checklist); no calculators |
| PUBLISHED_GUIDE_COUNT | 31 published (24 Markdown + 7 TypeScript), 0 drafts; `/guides/bringing-a-dog-to-a-no-pets-rental` and `/guides/pet-friendly-listing-red-flags` must return 200; the deleted `/guides/breed-restrictions-at-vacation-rentals` must return 404 |
| STAY_COUNTS_AND_INDEXING_MODE (files, listed, indexable, host-confirmed, `stayDirectoryMode`) | 83 files; 78 listed; 23 indexable (in the sitemap); 55 listed but noindex; 5 hidden; 0 host-confirmed; `stayDirectoryMode: "public-sources"` (owner-approved 2026-11-25; counts identical in both modes while the seller Vrbo links exist; with them removed `public-sources` keeps 78 / 23; see `docs/OWNER_DECISION_STAY_MODE.md`) |
| ACTIVE_GEAR_COUNT (products, categories, trip collections) | 65 active products of 92 records; 11 categories; 5 trip collections; 0 unreachable products (`docs/PACKING_GEAR_COVERAGE.md`) |
| Things-to-do articles | 8 (`/destinations/<state>/<town>/things-to-do`) |
| Local checks on the target (tsc, eslint, tests, build, `verify-site` count) | tsc clean; eslint --quiet clean; vitest 805 passed in 61 files; build OK; `verify-site` 331 passed, 0 failed (no draft marker: there are no drafts); sitemap 105; netlify-ignore rows pass |
| SIGNATURE_STRINGS (planner title and button, "Shop by trip", disclosure sentence, retired-URL redirect target) | Planner: H1 "Pack for your next adventure.", button "Build my packing list", sections "A few extras worth considering" and "Things to pick up before you go"; Gear: "Good gear. Better getaways." and "Shop by trip"; Amazon sentence "As an Amazon Associate I earn from qualifying purchases."; `/guides/vacation-rentals-with-no-dog-weight-limit` 301 to `/guides/vacation-rentals-that-welcome-large-dogs`; no "Check the current price" text; no `[[n]]` numbers |

Historical counts for older commits stay in `docs/FINAL_SALE_CODE_RELEASE.md` and `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`, labelled with the commit at which they were counted.

## Decision log

| Date | Decision | Value | Status |
|---|---|---|---|
| 2026-11-25 | Stay directory mode | `public-sources` (same listed stays, plain public source links, no commission, no affiliate label; stays with the seller's approved link keep their labelled button). | APPROVED by owner; implemented `daa758f` |
| 2026-11-25 | Affiliate disclosure wording | Truthful, mode-aware `/affiliate-disclosure` kept; make notices legible on mobile and close to recommendations in long guides. | APPROVED in principle; implemented `daa758f`; legal uncertainty flagged |
| 2026-11-25 | Deploy | Owner said "yes deploy" (one production deploy of `main`, `docs/cowork/DEPLOY_NOW.md`). Builds are still off; not yet performed. | Approved, not executed |
| 2026-11-25 | Domain auto-renew and HTTPS certificate | Owner decision: the seller does NOT turn on auto-renew and does NOT renew the domain or certificate; both are left to the buyer. Documented in `BUYER_HANDOVER.md` (maintenance section), `docs/TRANSFER_CHECKLIST.md`, `docs/BUYER_OVERVIEW.md` and `docs/SALE_LISTING_DRAFT.md`. | DECIDED |
| 2026-11-25 | Marketplace publication | Not authorized. A draft preview only is allowed (C5). | Not authorized |

## Cowork read-only follow-up (2026-11-25) and triage

| Finding | Triage |
|---|---|
| Credits 45 (62 production deploys / 930 credits used); about 15 per build; builds Stopped | Enough for one more build (leaves about 30). |
| 9848745 and 7fc3f3b built (not published) although docs-only | Not a defect: Netlify compares with the last built deploy, and the diff included code. Keep builds Stopped except for the one planned build. |
| Node: build used 22.23.5; UI setting says 24; netlify.toml says 22 | OPTIONAL: align (keep 22, remove the UI override). |
| Certificate: apex 'renewal incomplete', expires 2027-02-14 | DECIDED: seller does not renew; documented as the buyer's responsibility in the buyer guide. |
| Namecheap: Change Ownership (account to account) has no 60-day wait; outside-registrar Transfer Out waits about 60 days from 2026-11-16 (about 2027-01-15, Cowork arithmetic from public help pages); Domain Lock ON | Plan the sale handover as an account-to-account Change Ownership through escrow. |
| Search Console data only 2026-11-16 to 11-23: 0 clicks, 306 impressions, position 17.4, 47 queries; top page was the now-404 no-pets-rental draft (83 impressions); GSC sitemap read 2026-11-23 with 98 URLs; 0 external links | Baseline recorded; DEFERRED WITH DISCLOSURE (no established traffic). Decision for the owner: 301 the draft URL to a relevant live guide (optional). |
| GA4 Oct 28 to Nov 24: 527 sessions, 513 Direct, 11 'Paid Search' (nothing paid runs), no Organic Search | Disclose: mostly direct (owner and testing), property predates the domain; no traffic claims. |
| MidWest 42-inch pen (B005OCWML4) 'Currently unavailable' | P1-OPTIONAL: Cowork to check B002904LZE (36-inch) and the 48-inch listing; swap the ASIN or turn the affiliate off (turning off breaks 3 packing/guide tests and removes 3 guide cards, so do it only with a replacement plan). Not a deploy blocker. |
| Ramp and AMK kit in stock again; repo has them OFF | OPTIONAL owner decision. |
| Wipes card said pack of 8, Amazon lists pack of 4 | Fixed in `613a27d` (card now says 8 wipes per pack). |
| Two untagged Amazon 'Source' links | Intentional (plain source citations). |
| `/data/pet-policies`, `/tools/packing-list` 'no referring sitemap' | Not an issue: both are in the live sitemap.xml (checked 2026-11-25); GSC read the sitemap on 11-23. |
| `/affiliate-disclosure` 'every button labelled' | Not an issue: the live page was already rewritten and has no such sentence; the final build adds mode-aware text. |
| Live review P2s: sitemap has no lastmod; 22 bot-blocked source URLs; stale Airbnb/Psychology Today source labels; dated Asilomar closure sentence; 4 Amazon items to check stock (kurgo cargo cape, kong classic, vittles vault, midwest pen); town-page CLS 0.14 to 0.18 on live (0.04 to 0.06 on final build) | OPTIONAL; none blocks the deploy; re-measure town-page CLS after the final deploy. |
