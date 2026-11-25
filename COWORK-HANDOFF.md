# Cowork handoff: external tasks for the Adventure Passport pivot

Written 2026-11-25. This is the single list of things Claude could not do. Each task is for the owner with Cowork assisting. **Nothing here may spend money, publish, deploy, or change DNS or billing without the owner's explicit authorization in that session.** Never paste a secret, license code or banking detail into chat or files.

## Summary: what blocks production

| Task      | Blocks production?                                                |
| --------- | ----------------------------------------------------------------- |
| CW-GH-1   | No                                                                |
| CW-GH-2   | No (recovery by SHA is accepted)                                  |
| CW-NET-1  | Yes (cost control before any preview or production deploy)        |
| CW-NET-2  | Yes (storage choice depends on it; fallback is an owner decision) |
| CW-NET-3  | Yes (rollback must exist before cutover)                          |
| CW-NET-4  | Yes                                                               |
| CW-NET-5  | Yes                                                               |
| CW-BLOB-3 | Yes                                                               |
| CW-PAY-1  | Yes                                                               |
| CW-PAY-2  | Yes                                                               |
| CW-PAY-3  | Yes                                                               |
| CW-PAY-4  | Yes                                                               |
| CW-PAY-5  | No                                                                |
| CW-QA-1   | Yes                                                               |
| CW-ANA-1  | No                                                                |
| CW-PIN-1  | No                                                                |

## CW-GH-1

- **Task ID:** CW-GH-1
- **Objective:** Verify the recovery commit 2125a2a and the branch claude/lucid-davinci-l2fixa exist on GitHub.
- **Why Claude cannot do it:** Claude has no read access to the GitHub UI session and tag/branch pushes are refused in its environment.
- **URL:** https://github.com/ (the owner's repository, then /commit/2125a2a and /branches)
- **Required owner authorization:** Owner signed in to GitHub; read-only.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Open the repository, paste 2125a2a into the commit URL.
  2. Open the Branches page and look for claude/lucid-davinci-l2fixa.
  3. Note whether the repository is still public.
- **Expected outcome:** Both exist; repo visibility recorded.
- **Evidence to capture:** Screenshot of the commit page and the branch list.
- **Return to Claude:** Yes/no for each, repository visibility.
- **Blocks production?** No
- **Safe handling:** Read only. Change nothing.

## CW-GH-2

- **Task ID:** CW-GH-2
- **Objective:** Create the remote tag pre-pivot-2026-11-25 at 2125a2a if permitted.
- **Why Claude cannot do it:** Tag pushes return HTTP 403 from Claude's environment.
- **URL:** GitHub repository, Releases/Tags page, or `git push origin pre-pivot-2026-11-25` from the owner's computer
- **Required owner authorization:** Owner approves creating a tag (adds a name, deletes nothing).
- **Prerequisite:** CW-GH-1 done.
- **Step-by-step:**
  1. On the owner's computer: `git tag -a pre-pivot-2026-11-25 2125a2a -m 'pre-pivot'` (skip if it exists locally).
  2. `git push origin pre-pivot-2026-11-25`.
  3. Confirm on the Tags page.
- **Expected outcome:** Tag visible and pointing at 2125a2a.
- **Evidence to capture:** Screenshot of the tag page.
- **Return to Claude:** Tag created yes/no, error text if no.
- **Blocks production?** No (recovery by SHA is accepted)
- **Safe handling:** Do not force-push or move any branch.

## CW-NET-1

- **Task ID:** CW-NET-1
- **Objective:** Verify Netlify plan, credits, usage, auto-recharge OFF and builds stopped.
- **Why Claude cannot do it:** Needs the owner's signed-in Netlify dashboard.
- **URL:** https://app.netlify.com/ (Team settings > Billing; Site configuration > Build & deploy)
- **Required owner authorization:** Owner signed in; read-only. Changing any setting needs separate approval.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Open the team Billing page; note plan, credits remaining and used this cycle.
  2. Find the auto-recharge / credit pack setting and confirm it is OFF.
  3. Open the site's Build settings and confirm builds are Stopped (or note the state).
  4. Turn nothing on.
- **Expected outcome:** Plan and credits recorded; auto-recharge OFF; builds stopped.
- **Evidence to capture:** Screenshots of billing summary, auto-recharge setting, build status.
- **Return to Claude:** Plan name, credits left, auto-recharge state, build state.
- **Blocks production?** Yes (cost control before any preview or production deploy)
- **Safe handling:** Never click Upgrade, Buy credits or Resume builds without the owner.

## CW-NET-2

- **Task ID:** CW-NET-2
- **Objective:** Blobs: metering, storage, persistence and consistency on the team billing page and docs.
- **Why Claude cannot do it:** Docs pricing page lists no Blobs line; only the owner's billing page shows real metering.
- **URL:** Team Billing and Usage pages; https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- **Required owner authorization:** Owner signed in; read-only.
- **Prerequisite:** CW-NET-1.
- **Step-by-step:**
  1. On Billing/Usage look for any Blobs, storage or functions line and its credit cost.
  2. Re-read the Blobs docs for persistence across deploys, strong consistency and conditional writes (onlyIfMatch, onlyIfNew).
  3. Note any per-plan limits or retention.
- **Expected outcome:** A written yes/no for: metered? charged in credits? persists across deploys? strong consistency available on Personal?
- **Evidence to capture:** Screenshots of billing lines and the doc passages (URL plus quoted sentence).
- **Return to Claude:** Findings table.
- **Blocks production?** Yes (storage choice depends on it; fallback is an owner decision)
- **Safe handling:** Read only.

## CW-NET-3

- **Task ID:** CW-NET-3
- **Objective:** Confirm the deploy of main@f02e4f9 still exists; rehearse nothing destructive.
- **Why Claude cannot do it:** Needs the owner's Netlify dashboard.
- **URL:** https://app.netlify.com/ > site > Deploys
- **Required owner authorization:** Owner signed in; read-only. Do NOT click Publish deploy.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Find the production deploy built from f02e4f9 in the Deploys list.
  2. Confirm it is listed and the Publish deploy button exists (do not press it).
  3. Note the currently published deploy ID and commit.
- **Expected outcome:** Rollback target exists.
- **Evidence to capture:** Screenshot of the deploy page with commit hash.
- **Return to Claude:** Deploy ID, commit, published or not.
- **Blocks production?** Yes (rollback must exist before cutover)
- **Safe handling:** No publishing, no deleting, no settings changes.

## CW-NET-4

- **Task ID:** CW-NET-4
- **Objective:** Set environment variables SESSION_SECRET, GUMROAD_PRODUCT_ID, PP_ENV (and PP_DATA_KEY) in the Netlify UI.
- **Why Claude cannot do it:** Claude must never hold secrets; only the owner can set them.
- **URL:** Site configuration > Environment variables
- **Required owner authorization:** Owner authorizes setting them. SESSION_SECRET and PP_DATA_KEY are generated by the owner (e.g. a password manager, 40+ random characters, different values).
- **Prerequisite:** CW-PAY-3 for the product id.
- **Step-by-step:**
  1. Add SESSION_SECRET and PP_DATA_KEY scoped to Functions (production and preview may differ; PP_DATA_KEY must then never change once customers exist).
  2. Add GUMROAD_PRODUCT_ID from the Gumroad product (CW-PAY-3).
  3. Add PP_ENV with the value production only on the production context, preview elsewhere (informational; code derives the store from the deploy context).
  4. Do not set PP_ALLOW_TEST_PROVIDER on production.
- **Expected outcome:** Variables exist with the right scopes.
- **Evidence to capture:** Screenshot of the variable NAMES and scopes only (values hidden).
- **Return to Claude:** Confirmation that names/scopes are set.
- **Blocks production?** Yes
- **Safe handling:** NEVER paste a secret value into chat, a file or a screenshot. Mark secret values as secret in Netlify.

## CW-NET-5

- **Task ID:** CW-NET-5
- **Objective:** Verify preview vs production store isolation using a deploy preview.
- **Why Claude cannot do it:** Needs a real deploy and the Netlify UI; Claude may not deploy.
- **URL:** A deploy preview URL and Site > Blobs in the Netlify UI
- **Required owner authorization:** Owner authorizes one preview deploy (costs credits only if builds are on; confirm via CW-NET-1). Preview needs PP_ALLOW_TEST_PROVIDER=1 and the test secrets.
- **Prerequisite:** CW-NET-1, CW-NET-4.
- **Step-by-step:**
  1. On the preview, activate with TEST-VALID-ABC12345 and complete one adventure.
  2. In the Blobs UI confirm the record appears in customers-preview and NOT in customers-production.
  3. Confirm /api/session on the preview answers JSON with Cache-Control: no-store (not an HTML page).
- **Expected outcome:** Preview writes only to _-preview stores; /api/_ reaches the Function.
- **Evidence to capture:** Screenshots of the store lists; response headers.
- **Return to Claude:** Pass/fail plus any HTML-instead-of-JSON finding.
- **Blocks production?** Yes
- **Safe handling:** Use only test codes. Delete the preview records afterwards.

## CW-BLOB-3

- **Task ID:** CW-BLOB-3
- **Objective:** Premium import/export dry run with SYNTHETIC data.
- **Why Claude cannot do it:** Needs the owner's local machine and Netlify token; Claude must not hold them.
- **URL:** Owner's terminal, repo checkout
- **Required owner authorization:** Owner authorizes using their NETLIFY_AUTH_TOKEN and SITE_ID locally.
- **Prerequisite:** CW-NET-2.
- **Step-by-step:**
  1. Export src/passport/fixtures/premium.synthetic.ts to a JSON array outside the repo.
  2. Run `node scripts/premium-import.mjs --file <file> --env preview` (dry run), then with --write.
  3. Call /api/premium/adventures on the preview with a test session and compare.
  4. Run `node scripts/premium-export.mjs --out <file> --env preview` and diff against the input.
- **Expected outcome:** Round trip is identical; nothing reaches production.
- **Evidence to capture:** Terminal output (no token) and diff result.
- **Return to Claude:** Pass/fail and any error text.
- **Blocks production?** Yes
- **Safe handling:** Token only in the environment, never in a file or chat. Use --env preview.

## CW-PAY-1

- **Task ID:** CW-PAY-1
- **Objective:** Read the live Gumroad license documentation and return the exact facts.
- **Why Claude cannot do it:** Gumroad's API pages did not render for Claude.
- **URL:** https://gumroad.com/api (License keys / Verify a license) and Gumroad's help center on license keys
- **Required owner authorization:** Read only; no account needed.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Open the API reference in a browser and find the licenses/verify endpoint.
  2. Copy the exact URL, HTTP method and parameter names (product_id vs product_permalink, license_key, increment_uses_count).
  3. Copy a full example response; list every field, especially purchase id/sale_id, refunded, chargebacked, disputed, dispute_won and any disabled flag.
  4. Find how to disable or revoke a key and whether a disabled key fails verify.
  5. Record what increment_uses_count=false does and the default.
  6. Record the HTTP status and body for an unknown key and for rate limiting.
- **Expected outcome:** A verified spec replacing every UNVERIFIED comment in src/server/passport/provider.ts.
- **Evidence to capture:** Quoted text and URL of each doc passage.
- **Return to Claude:** The completed list above, verbatim.
- **Blocks production?** Yes
- **Safe handling:** Read only.

## CW-PAY-2

- **Task ID:** CW-PAY-2
- **Objective:** Owner creates the Gumroad seller account, identity and payout.
- **Why Claude cannot do it:** Identity and banking data are owner-only; Claude never touches them.
- **URL:** https://gumroad.com/
- **Required owner authorization:** Owner only. Cowork may guide on screen but must never enter identity or bank data.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Owner signs up and completes identity and payout setup.
  2. Record which email owns the account and the payout method type (not the numbers).
- **Expected outcome:** Seller account ready.
- **Evidence to capture:** Screenshot of the dashboard with sensitive fields hidden.
- **Return to Claude:** Account ready yes/no.
- **Blocks production?** Yes
- **Safe handling:** Never capture identity or bank details.

## CW-PAY-3

- **Task ID:** CW-PAY-3
- **Objective:** Draft the product, NOT published: price per owner decision, license keys enabled, delivery email.
- **Why Claude cannot do it:** Account actions need the owner's account.
- **URL:** Gumroad dashboard > Products
- **Required owner authorization:** Owner decides the price and authorizes creating a draft. Do NOT publish.
- **Prerequisite:** CW-PAY-2.
- **Step-by-step:**
  1. Create a product in draft state.
  2. Enable license keys; note the product id used by the API (CW-PAY-1).
  3. Set the delivery email text so it tells buyers to enter the code on the site.
  4. Leave unpublished.
- **Expected outcome:** Draft product with license keys enabled.
- **Evidence to capture:** Screenshot of settings and the product id.
- **Return to Claude:** Product id (for GUMROAD_PRODUCT_ID, entered by the owner in Netlify).
- **Blocks production?** Yes
- **Safe handling:** Do not publish or share the product link.

## CW-PAY-4

- **Task ID:** CW-PAY-4
- **Objective:** Permitted test purchase, restore and refund test.
- **Why Claude cannot do it:** Real money may be involved; only the owner can authorize.
- **URL:** Gumroad product page (when permitted) and a preview deploy
- **Required owner authorization:** Explicit owner authorization per purchase. Use a 100% coupon or Gumroad test mode only if the docs allow it; otherwise the owner decides on a real small purchase and refund.
- **Prerequisite:** CW-PAY-1, 3, CW-NET-4, CW-NET-5.
- **Step-by-step:**
  1. Buy once as permitted; copy the license code from the email.
  2. Activate on the preview, then restore on a second browser.
  3. Refund the purchase in Gumroad; wait, then call /api/session (24h re-check can be forced by the owner only in preview).
  4. Confirm premium returns 403 and progress remains.
- **Expected outcome:** Purchase, restore, refund behave as designed.
- **Evidence to capture:** Screenshots with the license code hidden; response status codes.
- **Return to Claude:** Pass/fail per step.
- **Blocks production?** Yes
- **Safe handling:** Never put a real license code into chat or files.

## CW-PAY-5

- **Task ID:** CW-PAY-5
- **Objective:** Transfer-of-ownership rules for the Gumroad account/product and entitlement migration.
- **Why Claude cannot do it:** Terms live in Gumroad's help center and owner agreements.
- **URL:** Gumroad help center and terms of service
- **Required owner authorization:** Read only.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Find whether a seller account or product can be transferred or sold.
  2. Note what happens to customers, license keys and payouts on transfer.
  3. Note any way to export customers.
- **Expected outcome:** A written answer the buyer handover can rely on.
- **Evidence to capture:** Quoted passages with URLs.
- **Return to Claude:** Findings.
- **Blocks production?** No
- **Safe handling:** Read only.

## CW-QA-1

- **Task ID:** CW-QA-1
- **Objective:** Real iPhone Safari and Android Chrome run of the free flow (and, on preview, the activation flow).
- **Why Claude cannot do it:** Claude has no real devices.
- **URL:** The preview URL on each phone
- **Required owner authorization:** Owner provides devices.
- **Prerequisite:** A deploy preview.
- **Step-by-step:**
  1. Complete profile, reveal, mark done, add a memory, make a keepsake.
  2. Reload and confirm progress persists.
  3. Check cookie behaviour: activate on preview, close the tab, return.
  4. Note layout or tap problems.
- **Expected outcome:** Free flow works on both devices.
- **Evidence to capture:** Screen recordings or screenshots.
- **Return to Claude:** Defects list.
- **Blocks production?** Yes
- **Safe handling:** Use test codes only.

## CW-ANA-1

- **Task ID:** CW-ANA-1
- **Objective:** Verify GA4 events fire and contain no license code or customer id.
- **Why Claude cannot do it:** Needs the owner's GA4 property.
- **URL:** GA4 > Admin > DebugView, on a preview
- **Required owner authorization:** Owner signed in to GA4.
- **Prerequisite:** A deploy preview.
- **Step-by-step:**
  1. Open the preview with debug mode.
  2. Walk through reveal, complete, activate, restore.
  3. Check every event name and parameter.
- **Expected outcome:** Events arrive; no PII, code or id in any parameter.
- **Evidence to capture:** DebugView screenshots.
- **Return to Claude:** Event list with parameters.
- **Blocks production?** No
- **Safe handling:** Do not send real codes.

## CW-PIN-1

- **Task ID:** CW-PIN-1
- **Objective:** Pinterest: claim the site, set up the profile and boards.
- **Why Claude cannot do it:** Needs the owner's Pinterest account.
- **URL:** https://www.pinterest.com/
- **Required owner authorization:** Owner authorizes; nothing is published without approval.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Claim the website via the meta tag or file method the owner chooses.
  2. Create boards per the content plan; post nothing yet.
- **Expected outcome:** Site claimed.
- **Evidence to capture:** Screenshot of the claimed status.
- **Return to Claude:** Done yes/no.
- **Blocks production?** No
- **Safe handling:** Do not publish pins without approval.
