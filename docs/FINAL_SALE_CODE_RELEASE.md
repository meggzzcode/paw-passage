# Final sale code release report

Written 2026-11-24 when `main` was at `9797221` (518 commits); all counts below were taken at that commit. For the current release target commit and live status, see docs/SALE_RELEASE_STATUS.md. Purpose: say, with evidence, whether Paws & Passage is ready to list for about $1,500 as a pre-revenue starter site, what was done in the final code release, what is still open and who must do it. **Nothing is deployed.** Production serves a build from about 2026-11-23 (`ced2c93`); everything below is the repository and a production build of it served locally.

## Verdict

**READY AFTER SPECIFIC BLOCKERS.** The code, content, tests and documents are in a state to sell, and development should now stop (section 11). The site cannot be listed until: (1) the owner deploys and the deploy is verified live; (2) the owner decides the stay directory mode; (3) the owner decides the Vrbo label versus `/affiliate-disclosure` mismatch; and (4) the Cowork browser checks in `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md` that a live site requires are run. None of these is a code defect that more development would fix. No gate below is a full PASS, because every gate depends on a live deployment or an owner decision.

## 1. Starting point

- Starting commit for this release: **`a659f05`** ("Town things-to-do articles: credited Unsplash heroes, og:image, source QA").
- Editorial baseline commits: **`dbbbb94`** (editorial audit, scorecard and style guide; the 29 guides were 81,901 words by the counting method) and **`b0f371a`** (integration of the editorial, disclosure, mobile, merge and SEO work; 57,011 words). The final editorial pass then cut the same 29 guides to 45,093 words on purpose (answer-first, `docs/FINAL_EDITORIAL_RELEASE.md`).
- Production at the time of comparison: `ced2c93` (about 2026-11-23 22:44), 214 commits behind `HEAD`.

## 2. Work completed since `a659f05` (git log, oldest first)

| Phase | Commit | What it did |
|---|---|---|
| 1. Publishing, buyer transition, CMS structure | `75f7ff1` | Fixed the Netlify build-skip rule; added the seller-ID audit script, the safe Vrbo switch-off helper and `docs/BUYER_AFFILIATE_TRANSITION.md`; moved the Impact verification value from code to `content/settings.yml`; added the `stayDirectoryMode` setting (default `affiliate-only`); labelled plain Amazon links "See it on Amazon"; expanded `.pages.yml` anchors; added tests (25 files, 1,323 insertions) |
| 2. SEO investigation and fixes | `b4957e2` | Production-versus-HEAD comparison, a crawl of all 103 URLs, orphan and redirect-passing link fixes, dataset and cluster links, a Search Console brief and a 30-day tracking plan (12 files) |
| 3. Packing planner behaviour | `43bc488` | "Need to buy" always answers (four states); visible optional extras; control labels and Undo; `gearCategory` and `gearTrip` content fields with build validation, a Gear coverage report and tests; copy fixes in `content/packing.yml` (43 files) |
| 4. Pages CMS fields | `9797221` | Added `gearCategory` and `gearTrip` to the planner form, renamed the "Why bring this?" field, quoted three labels containing question marks (1 file) |
| 5. Final documentation (this release) | the commit that adds this file | Recounted all numbers, rebuilt the buyer package, the walkthrough script and the browser QA file (docs only) |

Total since `a659f05` (code and docs): 80 files changed, 3,988 insertions, 225 deletions: 13 tests, 6 scripts, 6 components, 7 lib files, 6 content modules, 1 config file, 2 routes, 7 content data files, 28 docs, `netlify.toml`, `.pages.yml`, one workflow file and the content plugin.

## 3. Problems found and fixed

| Problem | Evidence | Fix |
|---|---|---|
| **Netlify ignore bug.** At `a659f05` the build-skip rule ended `':(exclude)*.md'`, whose `*` crosses directories, so a push or Pages CMS save that changed only `content/guides/*.md` (or any `*.md` under `content/` or `src/`) would be skipped and never deployed | read from `netlify.toml` at `a659f05`; `docs/SEO_ROOT_CAUSE_INVESTIGATION.md` section 2 | `75f7ff1`: `':(exclude,glob)*.md'` (repo-root Markdown only), an empty previous ref now builds, and `scripts/test-netlify-ignore.mjs` covers 20 change types (re-run 2026-11-24: "All rows pass") |
| Planner "Need to buy" could show nothing for an item with no product | commit `43bc488` | Four responses: researched products, a related Gear category pointer, a quiet "added to your shopping list" note, a note for the visitor's own item |
| Optional extras were not visible to a visitor | `43bc488` | "A few extras worth considering" with "Add to my list", "See more packing ideas" and "Explore more travel gear" |
| Item control labels | `43bc488` | "Why bring this?" and "Remove from list" with an Undo bar |
| Gear coverage: products the planner could not reach | `docs/PACKING_GEAR_COVERAGE.md` (generated; a test fails if it is stale) | Every active product is reachable: 37 directly, 28 through a live Gear category, 0 only via the hub, **0 unreachable** |
| The buyer would not know which seller IDs to replace, and removing them broke the stay directory | `docs/BUYER_AFFILIATE_TRANSITION.md` section 5: removing the Vrbo entries fails the build; switching them off empties the directory (103 to 73 URLs on a test copy) | `75f7ff1`: `node scripts/audit-seller-ids.mjs` (report mode; `--expect-none` after transfer), `scripts/neutralize-seller-vrbo-links.mjs`, settings moved into `content/settings.yml`, the transition guide |
| Directory exists only with seller links | same | Optional **public-sources mode** (plain Vrbo or Airbnb source links, no commission, no affiliate label) added and **shipped off**; owner decision (section 9) |
| `.pages.yml` risk | `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md` "Pages CMS" | YAML anchors expanded; **three labels containing question marks were unquoted and broke strict YAML parsers**, now quoted (`9797221`); structure tests added (`pages-config-structure.test.ts`) |
| SEO internal links | `docs/SEO_IMPLEMENTATION_RESULTS.md` | State pages now link the town articles (orphans 2 to 0, max click depth 3 to 2); one link that went through a 301 replaced; dataset links added to two guides; the car-interior guide linked from two guides; one description colon fixed |

## 4. Test and build results (historical: clean copy of `9797221`, run 2026-11-24; re-run on the target commit in docs/SALE_RELEASE_STATUS.md)

Commands are recorded in `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. Run on `git archive HEAD` extracted to a scratch directory (so uncommitted work by other workers is excluded).

| Check | Result |
|---|---|
| `bunx tsc --noEmit` | exit 0 |
| `bunx eslint . --quiet` | exit 0 |
| `bunx vitest run` | **771 passed, 59 files, 0 failed** |
| `NITRO_PRESET=node-server bunx vite build` | exit 0 |
| `node scripts/verify-site.mjs` on the served build | **319 checks passed, 0 failed** |
| Sitemap on the build | **103 URLs**, all 200, self-canonical, one H1, titles of 60 characters or fewer, descriptions of 120 to 160 characters, no `noindex` |
| Redirect checks on the build | retired weight-limit guide 301, the three retired tool URLs 301, 8 things-to-do 200 |
| `node scripts/test-netlify-ignore.mjs` | all rows pass |
| `node scripts/audit-seller-ids.mjs` | report mode: "5 seller identifier(s) remain" (Amazon tag, GA4 ID, Impact value, Pinterest URL, 79 Vrbo deeplinks; 78 of 83 stay files use one) |
| Links on the build | Amazon 270 occurrences on 49 pages, 65 distinct URLs, all with the Amazon sentence on the page; 14 untagged source links on 10 ASINs; Vrbo 50 occurrences, 24 distinct; 0 "Check the current price"; 0 numbered citation markers |

If another worker's code fixes land after this report, re-run the same commands before listing.

## 5. Browser QA summary

- A local QA worker writes `docs/PRESALE_BROWSER_QA_RESULTS.md`. **At the time of writing this file does not exist**, so no result from it is reported here. Read it before listing and treat every row it marks UNVERIFIED as open (they are carried into the stage C2 of `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`).
- Earlier local browser evidence (older commits, desktop Chromium at phone and desktop widths): `docs/buyer/FINAL_QA_CRAWL_2026-11-24.md` and `docs/PACKING_PLANNER_QA.md` (no horizontal overflow at 320 to 1440 px on the planner and cabin guide; print order fixed). Not verified anywhere: real iPhone Safari, VoiceOver, TalkBack, desktop Safari and Firefox, the Pages CMS authenticated flow, any live-site behaviour.

## 6. Production deployment status

**NOT DEPLOYED. Production is stale.** Live serves the build from about 2026-11-23 with 98 sitemap URLs, the retired weight-limit URL answering 200, the town things-to-do pages 404, old guide titles and "Check the current price" lines, and the old packing tool (`docs/SEO_ROOT_CAUSE_INVESTIGATION.md` section 2). Netlify builds are stopped by the owner to preserve credits (OWNER: about 65 credits left, 15 per production deploy). One deploy is affordable; a second leaves little. The deploy must contain `75f7ff1` or later, otherwise guide-only edits would be skipped by the old ignore rule.

## 7. Remaining risks

- Deploy not done, so no claim about the live site is supported.
- **Pages CMS authenticated flow unverified** (never opened with a login; structure and tests pass).
- **No verified affiliate approval exists for a buyer.** Configured links are the seller's. The directory depends on them (section 9).
- The Vrbo stay buttons keep an "Affiliate link" label while `/affiliate-disclosure` says every buy or booking button has one (Amazon buttons do not): **still open** (checked in `src/routes/affiliate-disclosure.tsx` line 22 against the built stay pages, 46 label occurrences on indexable stay pages).
- Real-device and assistive-technology checks pending.
- Reader review mean 7.1 of 10 was taken before the final fixes and was not re-scored (`docs/FINAL_EDITORIAL_RELEASE.md`); report it as a record, not a quality claim.
- All 83 stays are not confirmed with a host; none is host-confirmed. The dataset is a one-date sample. Guides are AI-assisted and not first-hand.
- Domain is about 8 days old; auto-renew is off and the domain expires 2027-11-17; the historical Search Console figures (236 impressions, 0 clicks, 21 of 23 inspected indexed) describe the older build.
- No LICENSE file; the assignment wording is a seller and legal item. Legal pages are generic and not lawyer-reviewed. Whether Lovable's GitHub sync is disconnected is unverified.
- No video exists, and the 19 walkthrough screenshots are not captured (`docs/BUYER_WALKTHROUGH_SCRIPT.md`).

## 8. The five sale gates

| Gate | Status | Evidence |
|---|---|---|
| **1. Website works** | **PARTIAL** (deployment pending) | Local build of `9797221`: 771 tests, `tsc`, `eslint --quiet`, build and 319 `verify-site` checks pass; all 103 sitemap URLs return 200. Not deployed; real-device and live checks not done |
| **2. Visitor value** | **PARTIAL** | Repository delivers 29 guides (45,093 words, 420 linked sources), a 38-manager dataset, a 37-item packing planner, a will-my-dog-be-accepted tool, a checklist, a 65-product Gear shop and 8 town articles. Limits: readers scored the pre-fix text 7.1 of 10 and it was not re-scored; stays are unverified; no first-hand testing; no traffic evidence that visitors value it |
| **3. Monetization handover-ready** | **PARTIAL** | Procedure and tooling exist and pass: `docs/BUYER_AFFILIATE_TRANSITION.md`, `audit-seller-ids.mjs`, one-value Amazon retag (tested), Vrbo switch-off helper, optional `public-sources` mode. Not ready: zero verified approvals for a buyer, directory mode undecided, disclosure-page mismatch open, no earnings claimed |
| **4. Buyer can operate** | **PARTIAL** (CMS authenticated flow unverified) | Operations handbook, SOPs, rollback, hosting options (Netlify Free, no Lovable dependency; clean builds passed), transfer checklist, build-skip bug fixed and tested, direct-edit path rebuilt locally. Pages CMS login flow untested; 7 guides and the towns need a developer |
| **5. Sold convincingly** | **PARTIAL** | `docs/SALE_LISTING_DRAFT.md`, `docs/BUYER_OVERVIEW.md`, `docs/BUYER_ASSET_INVENTORY.md`, `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md` and a walkthrough script are consistent with the recount. Missing: the live site, screenshots, a recording (none exists), the owner decisions, and a legal assignment text |

## 9. Issues by class

**BLOCKER (listing must wait):**
1. Owner deploys `main` (builds are off; one deploy, about 15 credits) and the deploy is verified live (sitemap 103, 8 things-to-do 200, retired URL 301, new planner): `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`, stage C1 (live release verification).
2. Owner decision: stay directory mode. Ship `affiliate-only` (the directory has value only while seller links exist, so a buyer who removes them loses it) or `public-sources` (same 78 stays with plain links, no commission). Whatever is chosen, the listing text must say so (`docs/BUYER_AFFILIATE_TRANSITION.md` sections 5 and 6).
3. Owner decision: Vrbo label versus `/affiliate-disclosure`. Either restore per-button labels on Amazon buttons or rewrite the page sentence so it matches the one-notice design. Open now.
4. Cowork live checks: Amazon sample including the 10 untagged ASINs, 5 Vrbo deeplinks, Netlify usage and deploy status.

**IMPORTANT (do before or soon after listing; state plainly if skipped):**
- Real-device Safari and VoiceOver check; Pages CMS authenticated test (or keep the "unverified" wording in the listing).
- Domain auto-renew decision and the Namecheap lock and transfer requirements.
- Written assignment and bill of sale (legal; not drafted in the repo).
- Disconnect Lovable's GitHub sync; decide whether to hand over full git history (it contains the owner's author email).
- Capture the 19 screenshots (and a recording if wanted).
- Search Console and Bing submission of the 103-URL sitemap after the deploy (historical baseline must stay labelled historical).
- Merge any code fixes from the local QA worker and re-run section 4.

**OPTIONAL:**
- Re-score the corrected guides with independent readers; add a LICENSE file; move the 7 TypeScript guides to Markdown; trademark check; Bing data; recording a video; Pinterest account setup (not included in the sale unless the owner adds it).

## 10. Shortest path to listing (in order)

1. Land any pending code fixes from the QA worker; re-run `bunx tsc --noEmit`, `bunx eslint . --quiet`, `bunx vitest run`, the build and `verify-site`.
2. Owner decides: stay directory mode; Vrbo label or disclosure wording; domain auto-renew.
3. Apply the two wording decisions (a small change; then re-run step 1).
4. Owner turns Netlify builds on and deploys once.
5. Cowork: production deploy verification, then Amazon sample, Vrbo deeplinks and Netlify usage.
6. Capture the 19 screenshots from the deployed site.
7. Update the listing and overview if any number moved; run the listing presentation checks; publish a private draft, then the listing.
8. After listing, in parallel: real-device QA, the Pages CMS test, Search Console and Bing submission.

## 11. Stop-work decision

**Freeze development now.** The product is complete enough for a $1,500 starter-site sale; further features, copy changes or new guides would change counts the listing quotes and add risk without changing the sale. Allowed from here: fixes for a defect found by the deploy verification or the live checks, the two wording decisions in section 9, and re-running the counts after any such change. Everything else waits for the buyer.

## 12. Evidence index

Counts and commands: `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. Inventory: `docs/BUYER_ASSET_INVENTORY.md`. Listing: `docs/SALE_LISTING_DRAFT.md`. One-pager: `docs/BUYER_OVERVIEW.md`. Walkthrough: `docs/BUYER_WALKTHROUGH_SCRIPT.md`. Browser tasks: `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`. Due diligence: `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`. Transfer: `docs/TRANSFER_CHECKLIST.md`, `docs/BUYER_AFFILIATE_TRANSITION.md`. SEO: `docs/SEO_ROOT_CAUSE_INVESTIGATION.md`, `docs/SEO_IMPLEMENTATION_RESULTS.md`, `docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md`. Packing: `docs/PACKING_PLANNER_PRODUCT_GUIDE.md`, `docs/PACKING_PLANNER_QA.md`, `docs/PACKING_GEAR_COVERAGE.md`.
