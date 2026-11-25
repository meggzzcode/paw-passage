# Final pre-sale browser QA (the single canonical Cowork brief)

Status ledger (single source of truth for what has passed): `docs/SALE_RELEASE_STATUS.md`. Target commit, counts and signature strings: its "Release manifest" section (placeholders until the code checkpoint fills them; never invent a number here). Nothing is deployed as of 2026-11-25: production is a stale build from about 2026-11-23 (`ced2c93`).

This file is the only Cowork checklist. Detailed sub-procedures live elsewhere and are referenced, not copied: deploy sub-task `docs/cowork/DEPLOY_NOW.md` (from C1), Search Console procedure `docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md` (from C4), walkthrough `docs/BUYER_WALKTHROUGH_SCRIPT.md` (from C5).

## How the stages work

Stages run in this order: C0, C1, C2, C3, C4, C5. Each stage has the same eleven labelled sub-sections. A stage that has a gate does not start until the gate is met. Update the stage's row in `docs/SALE_RELEASE_STATUS.md` only through the return message to Claude Code (Cowork does not edit the repository). Mark anything not seen as UNVERIFIED.

| Stage | Name | Starts when | Blocks the sale? |
|---|---|---|---|
| C0 | Pre-deployment read-only account preflight | any time, before deploy | partly |
| C1 | Live release verification | owner has authorized and completed the deploy | yes |
| C2 | Shopping, mobile and content QA | C1 passed | yes |
| C3 | CMS and account workflow verification | C0 done; any write needs explicit owner permission | partly |
| C4 | Search Console and traffic baseline | C1 passed | no (baseline yes, growth review no) |
| C5 | Buyer screenshots and marketplace preview | production verified, core journeys pass | yes |

---

## C0 Pre-deployment read-only account preflight

**Responsible worker**
Cowork (browser, the owner's already signed-in sessions). Claude Code reads the returned table.

**Prerequisites**
- None of the deploy has to have happened; C0 can run before deploy.
- The owner is signed in to Netlify, GitHub (for Pages CMS) and Namecheap in the browser Cowork uses. If a session is signed out, stop (see If blocked).

**Tools and accounts needed**
- Netlify (the site's project; `docs/cowork/DEPLOY_NOW.md` names it `paws-passage-test`, free plan; confirm it is the right site, `docs/OPERATIONS-RECORD.md` names it).
- Pages CMS at https://app.pagescms.org, using the owner's existing GitHub session.
- Namecheap (registrar). Procedure background: `docs/DNS-AND-TRANSFER.md`, `docs/TRANSFER_CHECKLIST.md`.

**Exact browser actions**

*A. Netlify (read only)*
1. Confirm this is the correct site/project and record its name.
2. Deploys: record the current published deploy (commit hash, message, time) and whether any deploy shows "Skipped" or "Canceled".
3. Record whether builds are paused/stopped (Site configuration, Build and deploy, Continuous deployment). Do NOT turn builds on. Do NOT click Deploy or Trigger deploy.
4. Team settings, Billing/Usage: record plan name, monthly credit allowance, credits used, credits remaining and the reset date. The owner reports about 65 left at about 15 per production deploy: confirm or correct. Record any cost or limit that affects the planned release (for example bandwidth, build minutes, a second deploy).
5. Build and deploy settings: record the build command (expected `npm run build`), publish directory (expected `dist`) and production branch (expected `main`).
6. Domain management: record the primary domain, whether the apex redirects to www, and whether HTTPS is active.
7. No plan, billing, environment-variable, domain or setting changes.

*B. Pages CMS (read only: forms load, no saves)*
1. Open https://app.pagescms.org. Choose the repository and the `main` branch. Expected: the sidebar lists Articles, Stays, Places, Affiliate links, Products, Packing planner, Business settings. If the list is empty or an error mentions configuration, record the exact message and stop: `.pages.yml` has a problem.
2. Confirm the repository loads and the branch is the correct one.
3. **Business settings:** expected one form with no "create" or "delete" buttons. Check that the Amazon, GA4, Impact and "Which stays are listed" fields are present and the stay directory mode selector renders its options. Do not change anything; close without saving.
4. **Articles/Guides:** expected a list showing title, category, status and last reviewed. Open one published guide and check the fields: Status, Approved by/on, FAQs, Sources, Research block and a plain-code Markdown body (not a rich-text editor).
5. **Products:** open any product; confirm the fields render (for example "What it is, in plain words"). If you type into a field to confirm it is editable, do NOT save: click away and expect an unsaved-changes warning or a discard; nothing is committed.
6. **Packing planner:** open Items, open one item. These are large forms: confirm the lists of categories, trip types and conditions show real names, the "Show only when..." selects list the nine conditions, and a nested product list can be opened. If any field appears empty or crashes, record which and report that the form needs fixing (the file can still be edited on GitHub).
7. **Affiliate links:** open the form; confirm it loads and its fields and selectors render. Do not edit.
8. Record whether Pages CMS accepts `.pages.yml` as is and whether the large Packing planner and Products forms render.
9. NO saves, uploads or commits at any point. The full publish loop stays UNVERIFIED in C0.

*C. Namecheap (read only)*
1. Domain `pawsandpassage.com`: record registration date (registered 2026-11-16) and expiry (expected 2027-11-17), auto-renew state (owner says OFF), renewal cost shown, Domain Lock state, domain privacy state, and whether the registrant contact is the seller.
2. Record the account-ownership transfer options offered (for example Change of Ownership/push inside Namecheap, or auth-code transfer to another registrar).
3. Record any recent-registration or recent-transfer restriction that actually applies now. The domain is new (registered 2026-11-16): read the real restriction text in the account; do not assume the usual 60-day rule applies or does not apply.
4. Record the DNS records and mail/email records exist (they must not be deleted).
5. Do not unlock, transfer, renew, edit records or contact support.

**Evidence required**
One concise preflight report table, returned to Claude Code, with these columns: **Check | Result | Evidence | Blocker | Recommended next action**. One row per check above (Netlify site, published commit/date, builds paused, credits, build command and branch, HTTPS/primary domain, release cost/limits; CMS repo load, branch, each of the five forms; Namecheap expiry, auto-renew, lock, transfer options, restrictions, DNS/email, renewal cost). Evidence is a note or private screenshot reference. Sensitive data and screenshots stay private: no account emails, IDs, tokens, cookies or billing details in any repository file.

**Pass/fail criteria**
- PASS per row when the value is read and recorded. FAIL/BLOCKER when: the site is the wrong project; credits cannot cover one deploy; the CMS shows a configuration error or a form does not render; the domain is expired, locked in a way that blocks a push, or the registrar states a restriction that blocks the transfer plan.
- The CMS publish loop is not tested here and must be reported UNVERIFIED.

**Actions prohibited**
Turn builds on; click Deploy or Trigger deploy; change plan, billing, environment variables or domains; save, upload or commit in Pages CMS; unlock, transfer, renew or edit anything at Namecheap; contact support; enter or read passwords or codes.

**Owner approvals needed**
None for reading. (Turning builds on and deploying are not part of C0.)

**If blocked**
Signed out, CAPTCHA, security prompt or an unreadable page: stop, record the exact message as `UNAVAILABLE: <message>`, do not bypass, and ask the owner to sign in. Report the rows reached.

**Handoff destination**
Return the preflight table to Claude Code. C0 STOP RULE: stop after the read-only preflight; do nothing else (no deploy, no verification of the live site) until Claude Code or the owner says so. Claude Code records results in `docs/SALE_RELEASE_STATUS.md`.

**Blocks the sale?**
Partly: a credits, domain or wrong-site blocker blocks the deploy and therefore the sale; the CMS and Namecheap rows are informational unless they show a blocker.

---

## C1 Live release verification

**Responsible worker**
Cowork for the browser and terminal checks. The owner (or Cowork on the owner's explicit instruction, per `docs/cowork/DEPLOY_NOW.md`) performs the deploy itself; Claude Code reads the result.

**Prerequisites**
- The owner has authorized deployment (recorded 2026-11-25: "yes deploy") and the deployment has been completed. If builds are still off and no deploy happened, do not start C1.
- C0 done (credits and branch known).
- `docs/SALE_RELEASE_STATUS.md` release manifest is filled with the approved target commit and counts. Where it still shows a placeholder, record the observed value and mark the comparison UNVERIFIED rather than inventing the expected one.

**Tools and accounts needed**
- Public browser; a terminal with Node 22 and a clone of the repository (no installs needed for `verify-site`) and `curl`.
- Netlify read access (owner) for the published commit.
- Deploy sub-task, referenced only: `docs/cowork/DEPLOY_NOW.md` (one production deploy, no second deploy, builds resumed only if that is how they were stopped).

**Exact browser actions**
Compare each live value with the release manifest in `docs/SALE_RELEASE_STATUS.md`. Do not treat Netlify "Published" as proof: verify on the live site.

| Check | Expected (from the manifest) | Observed | Result |
|---|---|---|---|
| Published commit (Netlify Deploys) | `TARGET_COMMIT` (or a later commit that contains it) | | |
| Sitemap URL count (`curl -s https://www.pawsandpassage.com/sitemap.xml \| grep -o '<loc>[^<]*' \| wc -l`) | `SITEMAP_URL_COUNT` | | |
| Tool count (`/tools`) | `TOOL_COUNT` | | |
| Published guide count (`/guides`) | `PUBLISHED_GUIDE_COUNT` | | |
| Stay counts and indexing mode (`/stays`, a stay page robots meta, mode setting) | `STAY_COUNTS_AND_INDEXING_MODE` | | |
| Active gear count (`/gear`) | `ACTIVE_GEAR_COUNT` | | |
| Signature strings (for example planner title, "Shop by trip", disclosure sentence) | `SIGNATURE_STRINGS` | | |

Then:
1. Homepage loads, no server error, shows the current build (not an old-build artifact).
2. HTTPS and canonical domain: `http://` redirects to `https://`; apex and www resolve to the primary `https://www.pawsandpassage.com`; canonical tags use that domain.
3. Sitemap versus manifest: count as above; `robots.txt` contains the `Sitemap:` line for `https://www.pawsandpassage.com/sitemap.xml`.
4. Redirects: `curl -sI https://www.pawsandpassage.com/guides/vacation-rentals-with-no-dog-weight-limit` returns 301 with `location` ending `/guides/vacation-rentals-that-welcome-large-dogs` (the retired guide). Test a trailing-slash variant of a guide and a tool URL. Test the 10 redirects defined in `netlify.toml` (each `from` returns 301 to its `to`). `/tools/cost-calculator`, `/tools/pet-cost-check` and `/tools/host-questions` must 301 to `/tools`.
5. New town things-to-do articles live (8), each returns 200: `/destinations/georgia/{blue-ridge,ellijay,helen,dahlonega}/things-to-do` and `/destinations/california/{san-diego,santa-barbara,monterey,mendocino}/things-to-do`.
6. Updated articles live: no "Check the current price" text on any guide; inline publisher citation links present; no `[[n]]` numbered markers.
7. Packing planner live: `/tools/packing-list` and `/guides/dog-friendly-cabin-packing-list` show the new planner (title "Dog Travel Packing List Builder", a "Build my packing list" button).
8. Gear trip collections: `/gear` shows "Shop by trip" and the trip collections (for example `/gear?trip=road-trip`).
9. Stay directory mode behaves as the owner approved (see the Decision log): listed stays, links and labels match the approved mode.
10. Affiliate disclosure page: `/affiliate-disclosure` text matches what renders on Amazon buttons and Vrbo/stay buttons (record any difference; it is an owner decision item, not a pass).
11a. The republished guide `/guides/bringing-a-dog-to-a-no-pets-rental` returns 200 (it returned 404 live from about 2026-11-24 while it was a draft) with title "No-Pets Rental With a Dog: What Happens, What to Do", a self-canonical URL, one H1, Article and BreadcrumbList JSON-LD, the FAQ, the Sources list and the product cards. Expected sitemap count is 105 and `/guides` lists 31 guides.
11b. The republished guide `/guides/pet-friendly-listing-red-flags` returns 200 (it returned 404 live while it was a draft) with title "Is It Really Pet-Friendly? Listing Red Flags", a self-canonical URL, one H1, Article and BreadcrumbList JSON-LD, the FAQ, the Sources list and two product cards under the single affiliate notice. The deleted `/guides/breed-restrictions-at-vacation-rentals` returns 404 and is not in the sitemap.
11. No server errors (5xx), no 404 on any manifest URL, no old-build artifacts (old titles, the retired URL answering 200, the old packing tool).
12. Run `node scripts/verify-site.mjs https://www.pawsandpassage.com --site-url https://www.pawsandpassage.com` where reachable, and record the final line ("N checks passed, 0 failed"). There are no draft guides today, so the draft-leak check is skipped; pass `--draft-marker "text only in a draft"` only if a draft is added later.

**Evidence required**
The filled table above; the published commit hash; the last line of `verify-site`; a status-code table (8 things-to-do, the retired URL 301, the tool redirects, the 10 netlify redirects); two screenshots (planner, Gear hub). Private folder; the repository records only values.

**Pass/fail criteria**
- PASS: the intended release is deployed, critical routes are correct, the public experience reflects the release, and there is no material deploy error.
- FAIL: wrong or older commit, any manifest URL 404/5xx, the retired URL answering 200, "Check the current price" present, old planner, sitemap count off, or `verify-site` failures.
- On FAIL: STOP the whole sequence. No buyer screenshots, no indexing requests, no later stage. Send one precise defect report (issue format below).

**Actions prohibited**
Deploying a second time; changing settings; editing content; requesting indexing; taking buyer screenshots before a PASS; treating Netlify "Published" as proof.

**Owner approvals needed**
The deploy itself (turning builds on spends credits; about 15 per production deploy; one deploy affordable). Read-only checks need none.

**If blocked**
No deploy has happened or Netlify shows "Skipped"/"Canceled": stop and report; do not request indexing. Deployed commit older than target: report the hash. Site unreachable or bot-challenged: record the exact message; do not bypass.

**Handoff destination**
Return the table and either PASS or one defect report to Claude Code, who updates `docs/SALE_RELEASE_STATUS.md` rows "Current production commit", "Live deployment" and "C1".

**Blocks the sale?**
Yes.

---

## C2 Shopping, mobile and content QA

**Responsible worker**
Cowork (live behaviour and cross-browser checks).

**Prerequisites**
C1 PASS. Do not duplicate the 147 local Chromium page checks and the five scripted journeys already recorded in `docs/PRESALE_BROWSER_QA_RESULTS.md`; test only what a live site, a real device or a retailer can show, and the rows that file marks UNVERIFIED.

**Tools and accounts needed**
Normal browser with no sign-in. The owner's iPhone (Safari), an Android phone with Chrome if available, desktop Chrome, Safari and Firefox if available. A normal browser session for Amazon and Vrbo (no login, no cart, no booking).

**Exact browser actions**

*Journey A: packing planner (`/tools/packing-list`)*
1. Choose the cabin list; set duration and number of dogs; build the list. Add an optional item. Mark one item **Packed** and another **Need to buy**; see a product or a category fallback. Open "Why bring this?". Remove an item and use **Undo**.
2. Navigate to Gear and return: saved state is still there (also after a reload and after closing the tab).
3. "Copy my list" copies or shows the fallback message; "Print my list" opens print preview.
4. Planner build check used on the phone: Road trip, 4 days, 2 dogs, "We're driving".

*Journey B: Gear shopping*
Open a road-trip collection (`/gear?trip=road-trip`), then a category (for example `/gear/car-safety`); open product info; read the disclosure; follow a commercial link and record its destination; return using navigation and confirm context is kept.

*Journey C: stay directory (`/stays`)*
Use the filters; open a stay; read the source and pet-policy qualifications (stays are "not confirmed with the host"); confirm the CTA matches the chosen directory mode; open a representative real destination (for example `/destinations/georgia/blue-ridge`); record mismatches.

*Journey D: editorial and research*
Open the pet-fees guide (`/guides/how-vacation-rental-pet-fees-work`) and the dataset (`/data/pet-policies`): source links and citations work, the sources list expands, a relevant guide link works, no duplicated FAQ, no raw Markdown or `[[n]]`/`{{` leaks.

*Journey E: mobile and accessibility*
1. iPhone Safari at `/`, `/guides/how-vacation-rental-pet-fees-work`, `/data/pet-policies`, `/gear`, `/gear?trip=road-trip`, `/gear/car-safety`, `/tools/packing-list`, `/tools/will-my-dog-be-accepted`, `/tools/checklist`, `/stays`, one stay, `/destinations/georgia/blue-ridge/things-to-do`: no horizontal scroll, menu opens/closes, tables scroll inside their box. The owner reports iPhone Safari looks good (2026-11-25): record this as OWNER-REPORTED and re-verify live.
2. VoiceOver on a real device if available: trip form fields labelled (trip type, days, dogs); "Packed" and "Need to buy" announce state; removing an item announces Undo; Gear cards read in a sensible order.
3. Android Chrome (or TalkBack) if available: the same planner run.
4. Desktop Safari and Firefox: home, a guide, Gear, planner, stay filters.
5. Keyboard only (Tab, Shift+Tab, Enter, Space) on the planner and the stay filters: every control reachable, visible focus.
6. Print preview of the planner list.
7. If a device is unavailable, write NOT DONE for that row. Never say "done" or "tested on real devices" for an unavailable device.

*Retailer verification (keep these sample lists; one click at a time, no sign-in, no purchase, no booking)*

Amazon sample (13 checks):
1. Eleven tagged buy buttons, one per Gear category: `sleepypod-atom` (car safety), `petsafe-happy-ride-bench-seat-cover` (car interior), `petsafe-happy-ride-folding-ramp` (ramps and steps), `kurgo-collaps-a-bowl` (feeding and hydration), `midwest-exercise-pen-with-door` (pens and gates), `kurgo-loft-wander-dog-bed` (comfort and cooling), `ruffwear-float-coat` (water and beach), `ruffwear-knot-a-leash` (trail and hiking), `ruffwear-climate-changer-fleece` (cold weather), `amk-trail-dog` (safety ID and first aid), `adventure-medical-kits-dog-wipes` (rental cleanup).
2. The 10 ASINs that appear as untagged source links (citation "Source" links, none carries a tag): `B0CKQV4R3C` (`/gear/car-safety`, `/guides/two-large-dogs-in-one-car`), `B000QFT1R2` (`/gear/pens-and-gates`), `B00RDVE71W` and `B0DPQ4PFD6` (`/gear/comfort-and-cooling`), `B0FRMRRZV3` (`/gear/comfort-and-cooling`, `/guides/two-large-dogs-in-one-car`), `B09FKVQQVH` and `B0FC2HZHPJ` (`/gear/safety-id-first-aid`, `/guides/dog-travel-first-aid-kit-guide`), `B0C9MCCDH9` (`/gear/safety-id-first-aid`), `B08R74XVCS` and `B07H2RHVK4` (`/gear/rental-cleanup`). Read from the local build; the live pages must show the same.
3. For each: click once; record that it lands on a `/dp/<ASIN>` page, the product matches the card's name and maker, a buy box or "currently unavailable" is shown, and the URL contains `tag=pawspassage-20` on buy buttons and no `tag=` on the 10 untagged source links. Close the tab. Whether the tag earns anything is not tested and must not be claimed.

Vrbo sample (5 deeplinks, one click each, spaced out):
`/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake` (`vrbo-1056490`, Blue Ridge, GA), `/stays/dahlonega-house-with-fenced-backyard` (Dahlonega, GA), `/stays/avila-beach-retreat-for-pets-and-families` (`vrbo-980414`, CA), `/stays/big-bear-moonridge-cabin-with-spa-and-fenced-deck` (`vrbo-207329`, CA), `/stays/beach-townhouse-pacific-beach-half-block-to-beach-park-dog-friendly` (`vrbo-3042489`, CA). On each: record the button label (expected "Affiliate link · We may earn a commission if you book, at no extra cost to you."), whether the click lands on the matching Vrbo property (same name and town), whether the Vrbo pet policy still matches the stay page's pet-policy panel, and whether the listing is unavailable. Also read `/affiliate-disclosure` and note whether its sentence "Every affiliate buy or booking button also carries its own label" matches Amazon buttons (they carry no per-button label): record as an open owner decision, not a pass.

If a retailer shows a CAPTCHA or robot check, stop that retailer, do not retry quickly, report the rows reached.

**Evidence required**
A compact issue table (issue format below) plus: a device/browser/version/URL/result table; an Amazon table (product id or ASIN, expected name, what loaded, buy box yes/no, tag present yes/no, date); a Vrbo table (stay slug, button label, landing page, policy match yes/no, available yes/no, date). Screenshots of defects and of retailer product titles only, private folder, no account data.

**Pass/fail criteria**
PASS when the journeys work without a layout break, blocked control, unannounced state change or wrong destination. A defect that blocks a core journey (planner, guide reading, Gear links, stay directory) is a BLOCKER. Retailer rows: PASS when the right product or property loads; a dead page, wrong product, wrong property or unavailable item is FAIL for that row; the product or stay is then proposed for switch-off (`approved: false` in `content/affiliates.yml` or `active: false` in `content/products.yml`) for the owner to decide, not changed by Cowork. A mismatch that cannot be fixed before sale may be DEFERRED WITH DISCLOSURE by the owner in the ledger.

**Actions prohibited**
Any code change; any affiliate-record change; any CMS change in C2; sign-in to retailers, purchases, bookings, cart additions; bypassing a bot challenge.

**Owner approvals needed**
None to click as a visitor. The owner decides any link retirement, the Vrbo label versus disclosure wording and whether a residual defect is disclosed instead of fixed.

**If blocked**
Device unavailable: mark NOT DONE. Retailer bot wall: stop and report. Page not loading: record the exact error and the URL.

**Handoff destination**
Issue table and retailer tables to Claude Code (fixes) and the owner (decisions); Claude Code updates `docs/SALE_RELEASE_STATUS.md` rows C2, Affiliate verification.

**Blocks the sale?**
Yes for core-journey and affiliate-destination defects (unless resolved or disclosed); real-device rows left NOT DONE mean the listing may not claim real-device testing.

---

## C3 CMS and account workflow verification

**Responsible worker**
Cowork for the browser steps, only with explicit owner permission for any write. Claude Code prepares the approved content change if a live save test is authorized.

**Prerequisites**
- C0 forms-load check done (this is the read-only part of C3 and is already in C0).
- For any write: the owner's explicit, written authorization of the exact change.

**Tools and accounts needed**
Pages CMS (https://app.pagescms.org, the owner's GitHub session), GitHub (to see the commit), Netlify Deploys (read), the live site.

**Exact browser actions**

*Removed as defaults (and why).* The earlier proposals are removed from this brief: publishing a visible "TEST" marker and reverting it, creating multiple production deploys, and deliberately submitting an invalid affiliate URL (for example `http://`) to force a failed deploy. Reasons: they put test text and a red deploy into the public site and its history, each costs production-deploy credits (about 15 each, about 65 left) and the old "TEST" photo-upload test adds a stray file. The failure paths are already proven locally by the content-validation tests (a bad edit fails the build) and the Netlify build-rule tests (`node scripts/test-netlify-ignore.mjs`: all rows pass). The local facts that remain true and useful are kept in "What was verified locally" below.

*Safe default.* The C0 forms-load check is the read-only verification. No further CMS testing is required for the sale.

*Optional deeper test, only with explicit authorization.* Preferably use an actual approved, legitimate content improvement as the save/publish test; if there is none, perform no write test. A preview/staging test is allowed only if Pages CMS genuinely supports editing a non-production branch without unsafe changes or cost: check the CMS's branch selector and Netlify's branch-deploy setting; do not assume.

*If a real live save test is approved,* before starting confirm and record: (a) the exact change; (b) permanent or reversed; (c) the expected number of builds; (d) the credit budget; (e) rollback steps (below); (f) explicit owner authorization. Then:
1. Make the controlled edit in Pages CMS (a Markdown guide, `content/guides/<slug>.md`, is the simplest; field-level notes: Status, Approved by/on, FAQs, Sources, Research block, plain-code body).
2. Save. Expected: a green confirmation and a new commit on `main` by Pages CMS changing only that file (`content/guides/<slug>.md`). Record the commit link.
3. Confirm the build started: Netlify, Deploys: a deploy starts within a minute and must not say "Skipped"/"Canceled by ignore". If no deploy starts for a Markdown change, STOP: that is the old `*.md` skip bug and the `netlify.toml` fix has not reached the repository.
4. Confirm the content appears on the live page once Published.
5. If the change was to be reversed, reverse it (remove the edit and Save, or Revert the CMS commit on GitHub); confirm a second commit, a second build and the live page returns to the prior content.
6. Confirm the final deployed state is clean (published commit, no failed or stuck deploy, page content as intended).
7. Record results in a table: step, expected, actual, evidence link, pass/fail. Mark UNVERIFIED any step not completed. Also record whether the `merge: true` setting keeps fields the form does not know about.

*Rollback.* Every CMS save is one Git commit. Undo: GitHub, the commit, "Revert"; Netlify rebuilds. The previous good deploy can also be restored from Netlify, Deploys, "Publish deploy" on an earlier one.

*What was verified locally (2026-11-24, no login needed).*
- `.pages.yml` parses as plain YAML with no anchors or aliases (the earlier `&tri` and `&conditions` shortcuts were expanded). Every `path` exists: `content/guides`, `content/stays`, `content/places`, `content/affiliates.yml`, `content/products.yml`, `content/packing.yml`, `content/settings.yml`; the media folder `public/uploads` does not exist yet (Pages CMS creates it on the first upload).
- `src/test/pages-config.test.ts` and `src/test/pages-config-structure.test.ts` compare each form with the content rules: every field the rules accept is on the form, drop-down values equal the allowed values, Markdown uses the plain code editor.
- A save is a Git commit to `main`. The Netlify build-skip rule builds for every content path (guide Markdown, `content/*.yml`, stays, `.pages.yml`, `public/uploads` BUILD; only `docs/`, `.github/` and root Markdown skip).
- A bad edit fails the build (content plugin) and the previous deploy stays live (seen locally by deleting an affiliate entry that a stay refers to).
- Direct-edit path on a throwaway copy (never committed): a product `summary`, a packing item `what` and one line of a Markdown guide were changed, `NITRO_PRESET=node-server vite build` was run and the markers appeared (guide in served HTML; product and packing text in compiled site data). The copy was discarded.

*What can be edited in Pages CMS, and what needs a code edit.*

| Area | Editable in Pages CMS | Where |
|---|---|---|
| Markdown guides (`content/guides/*.md`) | Yes: front matter form plus Markdown body | Articles |
| Stay records (`content/stays/*.yml`) | Yes | Stays |
| Dog rules for places (`content/places/*.yml`) | Yes | Places |
| Affiliate links (`content/affiliates.yml`) | Yes | Affiliate links |
| Products / gear records (`content/products.yml`) | Yes | Products |
| Packing planner content (`content/packing.yml`) | Yes (large form; the file can also be edited on GitHub) | Packing planner |
| Business settings (email, site address, GA4, Amazon tag, Impact value, Pinterest, Stay22, stay directory mode) | Yes | Business settings |
| Uploaded photos (`public/uploads`) | Yes | media button in any form |
| **Three TypeScript guides** (`src/content/guides/dog-car-safety-harness-and-crate-guide.ts`, `dog-friendly-cabin-packing-list.ts`, `dog-travel-first-aid-kit-guide.ts`) | **No: code edit** | GitHub or a developer/assistant |
| Home page, About, Contact, Methodology, Editorial standards, Corrections, Privacy, Terms, Affiliate disclosure, List your property (`src/routes/*.tsx`) | **No: code edit** | |
| Destinations (`src/content/destinations.ts`), town things-to-do (`town-activities.ts`) and town reads (`town-reads/`) | **No: code edit** | |
| Dog types (`dog-types.ts`), gear category definitions (`gear-categories.ts`, `gear-hub.ts`), tool pages (checklist, cost calculator, host questions, pet cost check, will-my-dog-be-accepted) | **No: code edit** | |
| Policy dataset (`src/content/manager-policies.ts`) and its CSV | **No: code edit** (`docs/DATA-RECHECK-LOG.md`) | |
| Navigation, site name, tagline, footer (`src/config/site.ts`, layout components) | **No: code edit** | |
| Redirects, headers (`netlify.toml`), `robots.txt` | **No: file edit** | |

**Evidence required**
Read-only part: the C0 CMS rows. Write test (only if approved): the pre-test confirmation (change, builds, credits, rollback, authorization), the commit link(s), deploy statuses, live-page confirmation, final-state confirmation, step table. Private screenshots.

**Pass/fail criteria**
- Without a write test, the exact status string is: **CMS FORMS VERIFIED; AUTHENTICATED PUBLISH LOOP UNVERIFIED** (only if C0 forms rendered; otherwise CMS FORMS UNVERIFIED). The listing must not claim the full workflow was tested. This status is not by itself a reason for more development.
- With an approved write test: PASS when every step above matches; FAIL names the step and the evidence. Only then may the status become CMS PUBLISH LOOP VERIFIED.

**Actions prohibited**
Any save, upload, commit or deploy without explicit authorization of the exact change; publishing a test string; submitting an invalid URL; more than the authorized number of builds; changing `.pages.yml`, affiliate records or settings as a test.

**Owner approvals needed**
Yes, explicit, for any write: the exact change, whether permanent, the number of builds and credits, and rollback. A read-only C3 needs none.

**If blocked**
No GitHub session, CMS configuration error, or the CMS shows only `main` with no safe branch: stop, report the exact message and leave the status as CMS FORMS VERIFIED; AUTHENTICATED PUBLISH LOOP UNVERIFIED (or the lesser state). Never retry builds to "see if it works".

**Handoff destination**
Claude Code (updates `docs/SALE_RELEASE_STATUS.md` row CMS) and the owner (credit and publication decisions).

**Blocks the sale?**
Partly: not a blocker if the listing states honestly that the authenticated publish loop is unverified; a CMS configuration error that stops the forms from loading is a blocker for the "buyer can operate" claim.

---

## C4 Search Console and traffic baseline

**Responsible worker**
Cowork (read-only), using the owner's Google session. Detailed procedure: `docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md` (do not duplicate it here; follow its rules, sections and return format).

**Prerequisites**
C1 PASS. The two parts are separate: (1) an immediate baseline right after the release is verified; (2) a later growth review after a recrawl window (2 to 4 weeks), which does not block the listing.

**Tools and accounts needed**
Google Search Console (domain property `pawsandpassage.com`, or note the URL-prefix property if that is all there is), Google Analytics 4, optionally Bing Webmaster Tools (`docs/cowork/04-bing-import.md`).

**Exact browser actions**

*Part 1: immediate baseline (after C1 passes)*
1. Export the current query and page data (CSV preferred): impressions, clicks, CTR and average position, with the exact date range stated (data lags 2 to 3 days).
2. Sitemap report: submitted `https://www.pawsandpassage.com/sitemap.xml`, status, discovered URL count versus the manifest `SITEMAP_URL_COUNT`.
3. Pages report headline: indexed versus not indexed and the exclusion reasons.
4. URL Inspection for key URLs (home, `/guides/bringing-a-dog-to-a-no-pets-rental` and `/guides/pet-friendly-listing-red-flags` (the republished guides: inspect only; record the status and the live-page test result, make no indexing request unless the owner separately authorizes it), `/guides/how-vacation-rental-pet-fees-work`, `/data/pet-policies`, `/tools/packing-list`, one things-to-do URL): fetchable, canonical accepted; confirm the new pages are crawlable.
5. GA4: traffic sources and engagement for the same date range.
6. Bing (optional): site added/verified, sitemap status and discovered count, and whether the IndexNow key file `https://www.pawsandpassage.com/c020721357f8d6912ac3f66e4c956986.txt` returns 200. Read-only.

*Part 2: later growth review (separate, after recrawl)*
Monitor impressions and clicks for `/guides/bringing-a-dog-to-a-no-pets-rental` and report them as observed, without claiming an immediate ranking recovery. Repeat the exports after the recrawl window and compare with the Part 1 baseline. Do not read rankings in the first 2 to 4 weeks after a deploy.

**Evidence required**
CSV exports and the sanitized return defined in the investigation file; the exact date range and time read; no emails, account IDs or tokens. Historical figures (236 impressions, 0 clicks, 21 of 23 inspected indexed) describe the older build and must stay labelled historical.

**Pass/fail criteria**
Baseline PASS when the sitemap shows the expected discovered count with no error and the inspected pages are fetchable with the declared canonical accepted. "Indexed" is not required to sell; do not claim it unless shown. Do not claim old impressions came from the new code. Do not demand indexing of the new release. Growth review has no pass/fail for the sale.

**Actions prohibited**
Request indexing; sitemap resubmission; removals; disavow; property or settings changes; changing any Search Console or Bing setting. All need explicit owner authorization.

**Owner approvals needed**
Yes for any "Request indexing" (at most one per URL), sitemap submission/resubmission, or Bing import/verification. None for reading.

**If blocked**
A report is unavailable or a session is signed out: record `UNAVAILABLE: <exact message>` and move on.

**Handoff destination**
Claude Code (updates `docs/SALE_RELEASE_STATUS.md` row Search Console and `docs/SEO_30_DAY_TRACKING.md` if used) and the owner.

**Blocks the sale?**
No. The baseline strengthens the listing; the growth review never blocks it.

---

## C5 Buyer screenshots and marketplace preview

**Responsible worker**
Cowork (capture and draft preview). The owner approves publication; Cowork never publishes.

**Prerequisites**
All of: production verified (C1 PASS), core journeys pass (C2), affiliate mismatches resolved or disclosed, transition policy settled (stay directory mode and disclosure wording decided; `docs/BUYER_AFFILIATE_TRANSITION.md`), inventory current (`docs/BUYER_ASSET_INVENTORY.md`, `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` match the release manifest). If any is missing, do not start.

**Tools and accounts needed**
Production site in a clean browser window (1280 px desktop, 390 px phone); the owner's marketplace seller account in draft/preview mode only; `docs/SALE_LISTING_DRAFT.md`, `docs/BUYER_OVERVIEW.md`, `docs/BUYER_WALKTHROUGH_SCRIPT.md`.

**Exact browser actions**
1. Capture production screenshots per `docs/BUYER_WALKTHROUGH_SCRIPT.md` section 9 (the named files): home, original research (dataset), a polished guide, Gear collections, the planner and shopping flow (a built list), the stay directory, and a buyer content-management view if accessible (Pages CMS forms, no private data). Add two marketplace shots: the Gear hub with trip collections and the planner with a built list. No account, tab or notification visible. Store privately; the repository records only file names.
2. The walkthrough uses the real site. No video exists unless one has actually been recorded; say so.
3. Marketplace DRAFT preview (never publish): paste the headline, summary and sections from `docs/SALE_LISTING_DRAFT.md`, attach screenshots, then check each item: (1) every number equals the release manifest and `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`; counts and features match the live site; (2) says "pre-revenue", "no affiliate accounts included", "not host-verified" (stay details read from listings, not confirmed with the host), and shows no traffic, revenue, ranking, approval or buyer-interest claim; (3) any Search Console figures are labelled historical and tied to the older build; (4) domain age stated (registered 2026-11-16); (5) host-verification limitations, content-management limitations (Pages CMS authenticated publish loop status from C3; real-device checks pending if so) and the stay-directory-mode caveat are present; (6) hosting and transfer requirements stated (Netlify Free, domain transfer per `docs/DNS-AND-TRANSFER.md`/`docs/TRANSFER_CHECKLIST.md`: registrar lock, auth code or Change of Ownership, email DNS records kept, auto-renew decision, GitHub transfer and Lovable sync disconnect, accounts not transferable); (7) no affiliate-account transfer claims; the licensing text says Unsplash credited photos, no Amazon images, and the assignment wording is a seller and legal item; (8) the asking price is correct (about $1,495 to $1,500, escrow-only payment); (9) no invented financials, testimonials or video; the Vrbo-label versus disclosure decision is reflected; (10) no private data (emails, IDs, dashboards) appears in any image.

4. Fill the listing claims table, one row per claim in the draft listing, with a MATCH or MISMATCH result against the live site or the manifest (a MISMATCH is reported as an issue and the claim is removed or corrected, never softened):

| Claim in the draft listing | Source of truth | Observed on the live site or manifest | MATCH / MISMATCH |
|---|---|---|---|

**Evidence required**
The screenshot file list in a private folder (each shows the deployed build, not a local build or the old planner); a ten-item checklist with pass or fail per item; the draft preview screenshot (private).

**Pass/fail criteria**
PASS when all screenshots exist and show the deployed build, and all ten listing items pass. Any invented or unsupported claim is a FAIL: remove it rather than soften it. STOP RULE: when the materials are accurate, Cowork is complete: no more cosmetic browsing. Prepare the owner approval to publish (a one-page summary of what will be published and what remains open).

**Actions prohibited**
Publishing the listing; submitting identity or payment details; using local-build screenshots unlabelled; inventing financials, traffic, approvals or testimonials; claiming a video exists; sharing screenshots with a buyer without owner approval.

**Owner approvals needed**
Yes to publish the listing and to share materials with a buyer. None for a private draft preview.

**If blocked**
The marketplace needs identity verification or payment details: stop and leave it to the owner. Missing screenshots: list the missing files; label any local-build substitute "local build".

**Handoff destination**
The owner (approval to publish) and Claude Code (listing text corrections; `docs/SALE_RELEASE_STATUS.md` rows C5, Buyer presentation).

**Blocks the sale?**
Yes (the listing cannot go live on unverified materials).

---

## Code and Cowork return protocol

Cowork may independently: read public pages; inspect authorized dashboards (read-only); verify navigation; collect screenshots; export Search Console reports; check retailer destinations; record CMS form visibility; check domain transfer information; prepare marketplace drafts without publishing.

Cowork must NOT independently: edit source code; change CMS content; alter affiliate records; enable Netlify builds; trigger a paid deploy; modify DNS; transfer the domain; publish the listing; change billing; request indexing; delete content; change site policy.

Everything found goes back to Claude Code (code, content and records) or the owner (decisions, accounts) using the issue format below. Claude Code updates `docs/SALE_RELEASE_STATUS.md` from the returns; Cowork does not edit the repository.

## Issue format

One issue per entry, numbered QA-001, QA-002, and so on:

| Field | Content |
|---|---|
| ID | QA-001 |
| Stage | C0, C1, C2, C3, C4 or C5 |
| URL or account section | the exact URL or dashboard section |
| Expected | what should happen (cite the manifest or doc) |
| Observed | what happened (exact message; no guessing) |
| Evidence | private screenshot/file name or command output |
| Severity | BLOCKER / IMPORTANT / OPTIONAL |
| Likely owner | Claude Code / Cowork / Owner / External service |
| Proposed next action | one concrete action |

## Rules for everyone

- Never enter or read passwords, codes or recovery data.
- Stop at CAPTCHA, bot walls and security prompts; do not bypass them.
- Evidence is sanitized: no account emails, IDs, tokens, cookies, billing details. Screenshots stay private; the repository records only file names and values.
- Write UNVERIFIED for anything not actually seen; write `UNAVAILABLE: <exact message>` or `NOT DONE: <why>` instead of a guess. Never invent a result or a number.
- No purchases and no bookings. Do not spend money, change plans, accept agreements, change DNS or press Publish/Submit/Confirm unless a stage names it and the owner has authorized it.
- Do not repeat checks already verified locally (see `docs/PRESALE_BROWSER_QA_RESULTS.md` and `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`).
