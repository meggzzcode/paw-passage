# Final pre-sale browser QA

This file is assembled from self-contained sections. Each section has its own heading and can be read on its own.

## Pages CMS

Status: **UNVERIFIED in the live Pages CMS.** `.pages.yml` has been checked structurally and by tests, and the direct-edit path has been rebuilt locally, but no
one has signed in to Pages CMS with the repository owner's GitHub login and saved a change. Nothing below should be reported to a buyer as "tested in the CMS" until a person has completed the steps and ticked them.

### What was verified locally (2026-11-24, no login needed)

- `.pages.yml` parses as plain YAML. It uses **no anchors or aliases** (the earlier `&tri` and `&conditions` shortcuts in the stays and packing forms were expanded into plain YAML, which Pages CMS is not documented to need). Every `path` exists: `content/guides`, `content/stays`, `content/places`, `content/affiliates.yml`, `content/products.yml`, `content/packing.yml`, `content/settings.yml`, and the media folder `public/uploads` does not exist yet (Pages CMS creates it on the first upload).
- `src/test/pages-config.test.ts` and `src/test/pages-config-structure.test.ts` compare each form with the content rules: every field the rules accept is on the form, drop-down values equal the allowed values, Markdown is edited with the plain code editor.
- A save is a Git commit to the default branch (`main`). The Netlify build-skip rule builds for every content path (`node scripts/test-netlify-ignore.mjs`: guide Markdown, `content/*.yml`, stays, `.pages.yml`, `public/uploads` all BUILD; only `docs/`, `.github/` and root Markdown skip).
- A bad edit fails the build (content plugin) and the previous deploy stays live. Seen locally by deleting an affiliate entry that a stay refers to.
- Direct-edit path, on a throwaway copy of the repository (never committed): one product `summary`, one packing item `what`, and one line of a Markdown guide were changed, `NITRO_PRESET=node-server vite build` was run, and the markers appeared. The guide line appeared in the served page HTML; the product and packing text appeared in the compiled site data (client and server bundles). The copy was discarded.

### What can be edited in Pages CMS, and what needs a code edit

| Area | Editable in Pages CMS | Where |
|---|---|---|
| Markdown guides (`content/guides/*.md`, 25) | Yes: front matter form plus Markdown body | Articles |
| Stay records (`content/stays/*.yml`) | Yes | Stays |
| Dog rules for places (`content/places/*.yml`) | Yes | Places |
| Affiliate links (`content/affiliates.yml`) | Yes | Affiliate links |
| Products / gear records (`content/products.yml`) | Yes | Products |
| Packing planner content (`content/packing.yml`) | Yes (large form; the file itself can also be edited on GitHub) | Packing planner |
| Business settings (email, site address, GA4, Amazon tag, Impact value, Pinterest, Stay22, stay directory mode) | Yes | Business settings |
| Uploaded photos (`public/uploads`) | Yes | media button in any form |
| **Three TypeScript guides** (`src/content/guides/dog-car-safety-harness-and-crate-guide.ts`, `dog-friendly-cabin-packing-list.ts`, `dog-travel-first-aid-kit-guide.ts`) | **No: code edit** | GitHub or a developer/assistant |
| Home page, About, Contact, Methodology, Editorial standards, Corrections, Privacy, Terms, Affiliate disclosure, List your property (`src/routes/*.tsx`) | **No: code edit** | |
| Destinations (states and towns, `src/content/destinations.ts`), town things-to-do and town reads (`src/content/town-activities.ts`, `town-reads/`) | **No: code edit** | |
| Dog types (`dog-types.ts`), gear category definitions (`gear-categories.ts`, `gear-hub.ts`), tool pages (checklist, cost calculator, host questions, pet cost check, will-my-dog-be-accepted) | **No: code edit** | |
| Policy dataset (`src/content/manager-policies.ts`) and its CSV | **No: code edit** (`docs/DATA-RECHECK-LOG.md`) | |
| Navigation, site name, tagline, footer (`src/config/site.ts`, layout components) | **No: code edit** | |
| Redirects, headers (`netlify.toml`), `robots.txt` | **No: file edit** | |

### Cowork steps (needs the repository owner's GitHub login; stop and ask if anything differs)

Use a **dummy edit that is reverted**. Never publish a test string. Read each step's "expected" before clicking.

1. Open https://app.pagescms.org and sign in with GitHub. Choose the repository and the `main` branch. **Expected:** the sidebar lists Articles, Stays, Places, Affiliate links, Products, Packing planner, Business settings. If the list is empty or an error mentions configuration, record the exact message and stop: `.pages.yml` has a problem.
2. Open **Business settings**. **Expected:** one form, no "create" or "delete" buttons. Check the Amazon, GA4, Impact and "Which stays are listed" fields are present. Do not change them in this test. Close without saving.
3. Open **Articles**. **Expected:** the list shows title, category, status and last reviewed. Open one published guide. Check: Status, Approved by/on, FAQs, Sources, Research block and a plain-code Markdown body (not a rich-text editor).
4. **Reversible save test (Markdown guide).** In that guide, change one word of the body in a harmless place, for example add the word "TEST" at the end of one paragraph. Click Save. **Expected:** a green confirmation, and on GitHub a new commit on `main` by Pages CMS whose changed file is `content/guides/<slug>.md` only. Record the commit link.
5. In Netlify, Deploys. **Expected:** a deploy starts within a minute (it must not say "Skipped"/"Canceled by ignore"). Record the deploy status. If no deploy starts for a Markdown change, STOP: that is the old `*.md` skip bug and the `netlify.toml` change has not reached the repository.
6. When the deploy is Published, open the guide on the live site. **Expected:** "TEST" appears. Do **not** announce it.
7. **Revert.** In Pages CMS remove "TEST" and Save (or on GitHub, revert the CMS commit with the Revert button). **Expected:** a second commit, a second deploy, and the word gone from the live page. Record both commit links. Leave the repository on the same content as before.
8. **Products and Packing.** Open **Products**, open any product, change the first word of "What it is, in plain words" by adding "TEST" at the front, **do not Save**, and click away. **Expected:** the form warns about unsaved changes or discards it; nothing is committed. Repeat in **Packing planner**: open Items, open one item. These are large forms: confirm the lists of categories, trip types and conditions show real names, the "Show only when..." selects list the nine conditions, and a nested product list can be opened. If any field appears empty or crashes, record which and report that the form needs fixing (the file can still be edited on GitHub).
9. **Photo upload (optional).** Upload a small test image through a guide's photo field and then delete the upload on GitHub (`public/uploads/<file>`). **Expected:** the commit lands on `main`; the file is served at `/uploads/<file>` after a deploy.
10. **Validation behaviour.** In **Affiliate links**, change one link's address to `http://` (not https), Save. **Expected:** the commit saves (the CMS does not run the site's validator) and the **Netlify build fails** with "must start with https://" naming the file; the site stays on the previous deploy. Revert it immediately and confirm the next deploy goes green. This proves the safety net. (Skip if the owner does not want a red deploy in the history.)
11. Write results in a table: step, expected, actual, evidence link, pass/fail.

Mark **UNVERIFIED** any step not completed. Record in particular: whether Pages CMS accepts `.pages.yml` as is, whether the `merge: true` setting keeps fields the form does not know about, and whether the large Packing planner and Products forms render.

### Rollback

Every CMS save is one Git commit. To undo: GitHub, the commit, "Revert". Netlify rebuilds. The previous good deploy can also be restored from Netlify, Deploys, "Publish deploy" on an earlier one.

---

# Sections added 2026-11-24 (repo `HEAD` `9797221`; nothing deployed)

Rules for every section below. No private data in the repo: record results in a private folder or in the return message, never paste account emails, IDs, tokens, cookies, screenshots of dashboards or billing into a repository file. Never invent a result; write `UNAVAILABLE: <exact message>` or `NOT DONE: <why>`. Do not spend money, change plans, accept agreements, change DNS or press Publish/Submit/Confirm unless the section names it and the owner has authorized it. Do not repeat checks already verified in code or on the local build (see `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`: 771 tests, `tsc`, `eslint --quiet`, build, 319 `verify-site` checks, 103 sitemap URLs on a local build); the sections below test what only a live site, a real device or an account can show. Order: Production deploy verification first; the others need it to pass.

## Production deploy verification

- **URL:** https://www.pawsandpassage.com (production, after the owner has deployed `main`). Local rehearsal base `http://localhost:4581` is allowed for dry runs but does not count.
- **Required access:** none for the public checks; Netlify read access for step 1 (owner).
- **Why:** production is a stale build from about 2026-11-23 (`ced2c93`, 98 sitemap URLs); nothing in the listing is true of the live site until this passes.
- **Steps:**
  1. In Netlify, Deploys: note the published deploy's commit hash (must be `9797221` or a later commit that contains it) and its time. Record the hash.
  2. `node scripts/verify-site.mjs https://www.pawsandpassage.com --site-url https://www.pawsandpassage.com` from a clone (Node 22, no installs). Record the final line (expected "N checks passed, 0 failed"; on the local build N was 319).
  3. `curl -s https://www.pawsandpassage.com/sitemap.xml | grep -o '<loc>[^<]*' | wc -l` must print **103** (production was 98 before).
  4. The 8 things-to-do URLs must each return 200 with `curl -s -o /dev/null -w "%{http_code}"`: `/destinations/georgia/{blue-ridge,ellijay,helen,dahlonega}/things-to-do` and `/destinations/california/{san-diego,santa-barbara,monterey,mendocino}/things-to-do`.
  5. `curl -sI https://www.pawsandpassage.com/guides/vacation-rentals-with-no-dog-weight-limit` must return **301** with `location` ending `/guides/vacation-rentals-that-welcome-large-dogs`. Also `/tools/cost-calculator`, `/tools/pet-cost-check`, `/tools/host-questions` must 301 to `/tools`.
  6. Open `/guides/dog-friendly-cabin-packing-list` and `/tools/packing-list`: the page must be the new planner (title "Dog Travel Packing List Builder", a "Build my packing list" button). No guide may show the text "Check the current price".
  7. `/stays` must list stays, `/tools` must list exactly 3 tools, `/gear` must show "Shop by trip".
  8. `curl -s https://www.pawsandpassage.com/robots.txt` must contain the `Sitemap:` line for `https://www.pawsandpassage.com/sitemap.xml`.
- **Evidence:** the commit hash, the verify-site last line, the sitemap count, a 10-row table of status codes (8 things-to-do plus the 301 results), two screenshots (planner, Gear hub). Private folder.
- **Pass/fail:** PASS only if every numbered step matches. Any 404 on a things-to-do URL, a 200 on the retired weight-limit URL, a count of 98 or a "Check the current price" string means the deploy is not the current commit: FAIL.
- **If blocked:** if no deploy has happened or Netlify shows "Skipped", stop and report; do not request indexing. If the deploy is of an older commit, report the hash.
- **Owner authorization needed:** the deploy itself (turning Netlify builds on spends credits: about 15 per production deploy, about 65 left per the owner). Read-only checks need none.

## Mobile and desktop visual QA

- **URL:** the production URLs after the deploy check passes; start at `/`, `/guides/how-vacation-rental-pet-fees-work`, `/data/pet-policies`, `/gear`, `/gear?trip=road-trip`, `/gear/car-safety`, `/tools/packing-list`, `/tools/will-my-dog-be-accepted`, `/tools/checklist`, `/stays`, one stay, `/destinations/georgia/blue-ridge/things-to-do`.
- **Required access:** a real iPhone with Safari, a real Android phone with Chrome if available, a desktop with Chrome, Safari and Firefox. No logins.
- **Scope:** only what the local QA worker marked UNVERIFIED. `docs/PRESALE_BROWSER_QA_RESULTS.md` is written by that worker; **read it first if it exists**, and test only its UNVERIFIED rows. If it does not exist, the default list is: real-device Safari (iOS) and VoiceOver (iOS), TalkBack or Android Chrome, desktop Safari and Firefox, keyboard-only use, and print preview. Desktop Chromium at phone and desktop widths has been exercised locally and is not repeated here.
- **Steps:**
  1. iPhone Safari at the listed URLs: no horizontal scroll, the menu opens and closes, tables scroll sideways inside their box, the Sources list expands, the packing planner builds a list (Road trip, 4 days, 2 dogs, "We're driving"), ticking "Packed" and "Need to buy" works, the list is still there after a reload and after closing the tab, "Copy my list" either copies or shows the fallback message, "Print my list" opens the print preview.
  2. VoiceOver on the planner: the trip form fields are labelled (trip type, days, dogs), "Packed" and "Need to buy" announce their state, removing an item announces the Undo, and the Gear cards read in a sensible order. Record anything silent or confusing.
  3. Android Chrome (or TalkBack): the same planner run.
  4. Desktop Safari and Firefox: home, a guide, Gear, the planner, the stay directory filters.
  5. Keyboard only (Tab, Shift+Tab, Enter, Space) on the planner and the stays filters: every control reachable, a visible focus ring.
- **Evidence:** a table of device, browser and version, URL, result, plus screenshots of any defect (private folder).
- **Pass/fail:** PASS when the steps work without a layout break, a blocked control or an unannounced state change. Record each defect with URL, device and a screenshot; a defect that blocks a core journey (planner, guide reading, Gear links) is FAIL.
- **If blocked:** no real device available: mark the rows NOT DONE and say that the claim "tested on real devices" must not be made in the listing.
- **Owner authorization needed:** none (public pages only); use the owner's own devices.

## Netlify account usage and deploy status

- **URL:** https://app.netlify.com (the site's project, currently named in `docs/OPERATIONS-RECORD.md`).
- **Required access:** the owner's logged-in Netlify session, read-only.
- **Steps:**
  1. Open the site's Deploys list. Record the latest published deploy (time, commit hash and message) and whether any deploy shows "Skipped" or "Canceled".
  2. Open Team settings, Billing / Usage. Record the plan name, the monthly credit allowance, credits used and credits remaining, and the date the allowance resets. (The owner reports about 65 credits left at 15 per production deploy; confirm or correct.)
  3. Open Site configuration, Build and deploy. Record whether builds are stopped (continuous deployment off), the production branch (expected `main`) and the build command (`npm run build`) and publish directory (`dist`).
  4. Open Domain management. Record the primary domain, whether the apex redirects to www and whether HTTPS is active.
- **Evidence:** the recorded values in a private note. Redact team name, email and billing details in any screenshot.
- **Pass/fail:** PASS when the deploy list shows a published deploy of the intended commit, builds are enabled, credits remaining cover at least two deploys, and HTTPS is active. FAIL if credits are insufficient (the deploy cannot happen) or builds are stopped.
- **If blocked:** if the session is signed out, stop and ask the owner; do not request or enter credentials.
- **Owner authorization needed:** yes to re-enable builds or trigger a deploy; no for reading usage.

## Search Console final indexing

Use `docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md` as the single procedure; it is not repeated here. Run it **after** the deploy verification above passes and after a re-crawl window (the investigation file explains why rankings must not be read for 2 to 4 weeks after a deploy). For this QA file, record only:
- **URL:** Search Console, the domain property `pawsandpassage.com`.
- **Required access:** the owner's Google session (read-only; no indexing request unless authorized).
- **Evidence:** the sitemap report (submitted `https://www.pawsandpassage.com/sitemap.xml`, status Success, discovered URLs expected 103), the Pages report headline (indexed / not indexed with the reasons), and URL Inspection for five pages (home, `/guides/how-vacation-rental-pet-fees-work`, `/data/pet-policies`, `/tools/packing-list`, one things-to-do URL).
- **Pass/fail:** PASS when the sitemap shows 103 discovered URLs with no error and the five inspected pages are fetchable with the user-declared canonical accepted. "Indexed" is **not** required to sell; do not claim it unless it is shown. The 236-impression and 21-of-23 figures are a historical baseline on the older build and must stay labelled that way.
- **If blocked:** report `UNAVAILABLE` per the investigation file's rules.
- **Owner authorization needed:** yes for any "Request indexing" or sitemap resubmission (at most one request per URL).

## Bing Webmaster Tools

- **URL:** https://www.bing.com/webmasters (procedure: `docs/cowork/04-bing-import.md`).
- **Required access:** the owner's Microsoft or Google sign-in.
- **Steps:** confirm the site is added and verified (import from Search Console if not), submit `https://www.pawsandpassage.com/sitemap.xml`, read the sitemap status and the discovered URL count, and note whether the IndexNow key file `https://www.pawsandpassage.com/c020721357f8d6912ac3f66e4c956986.txt` returns 200.
- **Evidence:** status text and counts in a private note.
- **Pass/fail:** PASS when the sitemap is accepted (no error) and the key file returns 200. Indexed counts are informational only.
- **If blocked:** record the exact message; do not use Block URLs, Disavow or removal tools.
- **Owner authorization needed:** yes for importing or verifying the property and for submitting the sitemap; none for reading.

## Product retailer destination verification (Amazon)

- **URL:** the live Gear pages and guides after the deploy check; links open on amazon.com. Amazon rate-limits bots: use a normal browser, one click at a time, and do not sign in, add to cart or buy.
- **Required access:** a normal browser session without an Amazon login (an existing login is fine but not needed). No Associates access.
- **Sample (13 checks):**
  1. Eleven tagged buy buttons, one from each Gear category, from these products: `sleepypod-atom` (car safety), `petsafe-happy-ride-bench-seat-cover` (car interior), `petsafe-happy-ride-folding-ramp` (ramps and steps), `kurgo-collaps-a-bowl` (feeding and hydration), `midwest-exercise-pen-with-door` (pens and gates), `kurgo-loft-wander-dog-bed` (comfort and cooling), `ruffwear-float-coat` (water and beach), `ruffwear-knot-a-leash` (trail and hiking), `ruffwear-climate-changer-fleece` (cold weather), `amk-trail-dog` (safety ID and first aid), `adventure-medical-kits-dog-wipes` (rental cleanup).
  2. The 10 ASINs that appear as **untagged source links** (citation "Source" links, not buy buttons; none carries any tag): `B0CKQV4R3C` (`/gear/car-safety`, `/guides/two-large-dogs-in-one-car`), `B000QFT1R2` (`/gear/pens-and-gates`), `B00RDVE71W` and `B0DPQ4PFD6` (`/gear/comfort-and-cooling`), `B0FRMRRZV3` (`/gear/comfort-and-cooling`, `/guides/two-large-dogs-in-one-car`), `B09FKVQQVH` and `B0FC2HZHPJ` (`/gear/safety-id-first-aid`, `/guides/dog-travel-first-aid-kit-guide`), `B0C9MCCDH9` (`/gear/safety-id-first-aid`), `B08R74XVCS` and `B07H2RHVK4` (`/gear/rental-cleanup`). These were read from the local build; the live pages must show the same.
- **Steps:** for each sampled link, click it once, wait for the Amazon page, and record: lands on a `/dp/<ASIN>` product page; the product matches the card's name and maker; a buy box or "currently unavailable" text; and the URL contains `tag=pawspassage-20` on the buy buttons and **no** `tag=` on the 10 untagged source links. Close the tab.
- **Evidence:** a table: product id or ASIN, expected name, what loaded, buy box yes/no, tag present yes/no, date. Screenshots only of the product title area, no account data.
- **Pass/fail:** per row PASS when the page is the right product with a buy box; a dead page, wrong product or "unavailable" is a FAIL for that row and the product is switched off in `content/affiliates.yml` (`approved: false`) or `content/products.yml` (`active: false`) after the owner agrees. Whether the seller's tag earns anything is **not** tested and must not be claimed.
- **If blocked:** a CAPTCHA or "robot check": stop, do not retry quickly, report the rows reached.
- **Owner authorization needed:** none to click as a visitor; the owner decides any product retirement. A buyer repeats this with their own tag after replacing it.

## Representative Vrbo deeplinks (5)

- **URL:** the live stay pages below; the buttons open Vrbo/Expedia affiliate links.
- **Required access:** a normal browser, no login. Vrbo rate-limits bots: click once each, spaced out; do not book or enter details.
- **Stays (affiliate id):** `/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake` (`vrbo-1056490`, Blue Ridge, GA), `/stays/dahlonega-house-with-fenced-backyard` (Dahlonega, GA), `/stays/avila-beach-retreat-for-pets-and-families` (`vrbo-980414`, CA), `/stays/big-bear-moonridge-cabin-with-spa-and-fenced-deck` (`vrbo-207329`, CA), `/stays/beach-townhouse-pacific-beach-half-block-to-beach-park-dog-friendly` (`vrbo-3042489`, CA).
- **Steps:** on each page record the button label text (expected "Affiliate link · We may earn a commission if you book, at no extra cost to you.") and click the Vrbo button once. Record whether it redirects to the matching Vrbo listing (same property name and town), whether the dog or pet policy shown on Vrbo still matches the stay page's pet-policy panel, and whether the listing is unavailable. Also read `/affiliate-disclosure` and note whether its sentence "Every affiliate buy or booking button also carries its own label" matches what you saw on Amazon buttons (it does not: Amazon buttons carry no label).
- **Evidence:** a table with stay slug, button label, landing page, policy match yes/no, available yes/no, date; a screenshot of the landing title only.
- **Pass/fail:** PASS per stay when the link lands on the same property. A mismatch or dead link is a FAIL and that stay's affiliate entry should be switched off. The label/disclosure mismatch is recorded as an **open owner decision**, not a pass.
- **If blocked:** report and stop; a blocked Vrbo page is not evidence either way.
- **Owner authorization needed:** none to click as a visitor; the owner decides the label and disclosure wording and any link retirement. The links are the seller's and are not transferable.

## Buyer-facing screenshots

- **URL:** the production pages listed in `docs/BUYER_WALKTHROUGH_SCRIPT.md` section 9 (19 file names).
- **Required access:** none; run after the deploy check passes.
- **Steps:** capture each named file at the stated width (1280 px desktop, 390 px phone) in a clean window with no account, tab or notification visible. Capture two extra marketplace shots: the Gear hub with the trip collections and the planner with a built list.
- **Evidence:** the 19 PNG files in a private folder; the repository records only the file names.
- **Pass/fail:** PASS when all 19 exist, show the deployed build, and contain no private data. Re-take anything that shows an older build (for example the old planner).
- **If blocked:** list the missing files; do not substitute local-build screenshots without labelling them "local build".
- **Owner authorization needed:** none for capture; sharing with a buyer requires the owner's approval.

## Domain transfer requirements

- **URL:** the registrar (Namecheap) account; procedure in `docs/DNS-AND-TRANSFER.md` and `docs/TRANSFER_CHECKLIST.md`.
- **Required access:** the owner's logged-in Namecheap session, read-only. Do not start a transfer or push.
- **Steps:** record domain `pawsandpassage.com` registration and expiry dates (expected 2026-11-16 and 2027-11-17), the auto-renew state (currently OFF per the owner), whether Domain Lock and domain privacy are on, whether the registrant contact is the seller, and whether any recent change (new registration, contact change) imposes a registrar lock window on a push. Record the mail DNS records exist (they must not be deleted). Read, do not change, the renewal price shown.
- **Evidence:** a private note with the values; redact the account email in screenshots.
- **Pass/fail:** PASS when the domain is active, unexpired, unlocked for a Change of Ownership push, and the owner has decided and recorded the auto-renew setting. Everything that depends on Namecheap's own rules stays UNVERIFIED until confirmed with them.
- **If blocked:** record the exact message; do not contact support or start a push.
- **Owner authorization needed:** yes to turn auto-renew on, change the lock or start the push; none for reading.

## Marketplace listing presentation checks

- **URL:** the marketplace's listing preview (draft only), using `docs/SALE_LISTING_DRAFT.md`, `docs/BUYER_OVERVIEW.md` and the screenshots.
- **Required access:** the owner's marketplace seller account and its own preview or draft mode. Do not publish.
- **Steps:** paste the headline, summary and sections from `docs/SALE_LISTING_DRAFT.md` into the marketplace fields; attach the screenshots; then check against this list: (1) every number equals `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`; (2) the listing says "pre-revenue", "no affiliate accounts included", "not host-verified" and "Not yet verified" and shows no traffic, revenue, ranking, approval or buyer-interest claim; (3) the Search Console figures, if used, are labelled historical and tied to the older build; (4) the domain age (registered 2026-11-16) is stated; (5) the stay-directory mode caveat and the Pages CMS "authenticated flow unverified" and "real-device checks pending" limits are present; (6) licensing text says Unsplash credited photos, no Amazon images, and that the assignment wording is a seller and legal item; (7) the price is $1,500 with escrow-only payment; (8) the Vrbo-label versus disclosure-page decision has been made and the listing matches it; (9) the walkthrough link or video is described as not yet recorded unless one exists; (10) no private data (emails, IDs, dashboards) appears in any image.
- **Evidence:** a checklist with pass or fail per item, and the preview screenshot (private).
- **Pass/fail:** PASS when all ten items pass. Any invented claim is a FAIL; remove it rather than soften it.
- **If blocked:** if the marketplace needs identity verification or payment details, stop and leave it to the owner.
- **Owner authorization needed:** yes to publish the listing; none for a private draft preview.
