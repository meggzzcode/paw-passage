# Cowork handoff: external tasks

The single list of things that need the owner's accounts, devices or money. Each task is done by the owner with Cowork assisting on screen. Updated 2026-11-26.

**Rules for every task.** Nothing here may spend money, publish, deploy or change DNS or billing without the owner's explicit authorization in that session. Never paste a secret, license code, token or banking detail into chat, a file, a commit or a screenshot. Use test codes only, except where a task says otherwise. Secrets are entered by the owner in the Netlify web UI only.

## Recommended order

1. Read-only checks first: CW-GH-1, CW-NET-1, CW-NET-2, CW-NET-3, CW-PAY-1, CW-PAY-5.
2. CW-GH-2 (recovery tag), CW-PIN-1 (Pinterest), CW-CMS-1 (Pages CMS loop).
3. Preview work with test data: CW-NET-4 (preview values), CW-NET-5, CW-BLOB-3 (premium import dry run), CW-QA-1 (real devices), CW-ANA-1 (GA4 events).
4. **Owner Gumroad setup last:** CW-PAY-2 (seller account), CW-PAY-3 (draft product), then CW-NET-4 (production values including the product id), then CW-PAY-4 (permitted purchase, restore and refund test).

## Summary: what blocks production

| Task      | Blocks production?                                                |
| --------- | ----------------------------------------------------------------- |
| CW-GH-1   | No                                                                |
| CW-GH-2   | No (recovery by commit id is accepted)                            |
| CW-NET-1  | Yes (cost control before any preview or production deploy)        |
| CW-NET-2  | Yes (storage choice depends on it; fallback is an owner decision) |
| CW-NET-3  | Yes (a rollback target must exist before cutover)                 |
| CW-NET-4  | Yes                                                               |
| CW-NET-5  | Yes                                                               |
| CW-BLOB-3 | Yes                                                               |
| CW-PAY-1  | Yes                                                               |
| CW-PAY-2  | Yes                                                               |
| CW-PAY-3  | Yes                                                               |
| CW-PAY-4  | Yes                                                               |
| CW-PAY-5  | No                                                                |
| CW-PAY-6  | No (optional gift checkout evaluation)                            |
| CW-QA-1   | Yes                                                               |
| CW-ANA-1  | No                                                                |
| CW-PIN-1  | No                                                                |
| CW-CMS-1  | No                                                                |

## Price constant must match Gumroad

`offer.price` in `src/config/site.ts` (currently "$19.99", one-time, no subscription) is shown on the home, unlock and FAQ pages. Before launch it must equal the Gumroad listing price exactly. Change both together; never show a discount or "was" price in the app.

## Partner discounts (Gumroad discount codes)

Partner and promotional discounts are done only with Gumroad discount codes. To set one up: in Gumroad, open the product, go to Discounts, and create a code for the partner (a percentage or fixed amount, optionally with an expiry or a use limit). Share the code, or a Gumroad link with the code applied, with the partner. The Gumroad checkout page applies the discount. The app shows no code and no discounted price; the site keeps showing the $19.99 price.

## CW-GH-1

- **Task ID:** CW-GH-1
- **Objective:** Verify the recovery commit `2125a2a` and the branch `claude/lucid-davinci-l2fixa` exist on GitHub, and record whether the repository is public.
- **Why Claude cannot do it:** Claude has no GitHub web session, and tag and branch pushes are refused in its environment.
- **URL:** The owner's GitHub repository: `/commit/2125a2a` and `/branches`
- **Required owner authorization:** Owner signed in to GitHub; read-only.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Open the repository and paste `2125a2a` into the commit URL.
  2. Open the Branches page and look for `claude/lucid-davinci-l2fixa`.
  3. Note whether the repository is public. It is meant to be public.
- **Expected outcome:** Both exist; visibility recorded.
- **Evidence to capture:** Screenshot of the commit page and the branch list.
- **Return to Claude:** Yes or no for each, and repository visibility.
- **Blocks production?** No
- **Safe handling:** Read only. Change nothing.

## CW-GH-2

- **Task ID:** CW-GH-2
- **Objective:** Create and push the recovery tag `pre-pivot-2026-11-25` at `2125a2a`.
- **Why Claude cannot do it:** Tag pushes return HTTP 403 from Claude's environment.
- **URL:** The repository's Tags page, or the owner's terminal in their own checkout.
- **Required owner authorization:** Owner approves creating a tag (adds a name, deletes nothing).
- **Prerequisite:** CW-GH-1.
- **Step-by-step:**
  1. In the owner's checkout: `git tag -a pre-pivot-2026-11-25 2125a2a -m 'recovery point'` (skip if the tag exists).
  2. `git push origin pre-pivot-2026-11-25`.
  3. Confirm it on the Tags page.
- **Expected outcome:** Tag visible and pointing at `2125a2a`.
- **Evidence to capture:** Screenshot of the tag page.
- **Return to Claude:** Created yes or no; the error text if no.
- **Blocks production?** No (recovery by commit id is accepted)
- **Safe handling:** Never force-push or move a branch.

## CW-NET-1

- **Task ID:** CW-NET-1
- **Objective:** Record the Netlify plan, credits, usage and auto-recharge state, and the state of builds for the site.
- **Why Claude cannot do it:** Needs the owner's signed-in Netlify dashboard.
- **URL:** https://app.netlify.com/ (Team settings, Billing; Site configuration, Build and deploy)
- **Required owner authorization:** Owner signed in; read-only. Changing any setting needs separate approval.
- **Prerequisite:** None.
- **Step-by-step:**
  1. On Billing, note the plan, credits remaining and credits used this cycle.
  2. Find the auto-recharge or credit-pack setting and confirm it is OFF.
  3. Open the site's build settings and note whether builds are active or stopped. Turn nothing on.
- **Expected outcome:** Plan and credits recorded; auto-recharge off; build state known.
- **Evidence to capture:** Screenshots of the billing summary, auto-recharge setting and build state.
- **Return to Claude:** Plan name, credits left, auto-recharge state, build state.
- **Blocks production?** Yes (cost control before any preview or production deploy)
- **Safe handling:** Never click Upgrade, Buy credits or Resume builds without the owner.

## CW-NET-2

- **Task ID:** CW-NET-2
- **Objective:** Establish Netlify Blobs metering, storage limits, persistence across deploys and consistency on the owner's plan.
- **Why Claude cannot do it:** The public pricing page lists no Blobs line; only the owner's billing and usage pages show real metering.
- **URL:** Team Billing and Usage pages; https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- **Required owner authorization:** Owner signed in; read-only.
- **Prerequisite:** CW-NET-1.
- **Step-by-step:**
  1. On Billing and Usage look for any Blobs, storage or Functions line and its credit cost.
  2. Re-read the Blobs documentation for persistence across deploys, strong consistency and conditional writes (`onlyIfMatch`, `onlyIfNew`).
  3. Note any per-plan limits or retention.
- **Index record (after any premium import):** the `index` record in `premium-<env>` must exist and list `items` with `id`, `status` and `collections` for every adventure (`scripts/premium-import.mjs` writes it; re-run the import if an older ids-only index is present). `GET /api/premium/summary` counts published adventures from it; without it the count is 0 or one read per adventure.
- **Expected outcome:** A written yes or no for: metered? charged in credits? persists across deploys? strong consistency available on this plan?
- **Evidence to capture:** Screenshots of billing lines and the documentation passages (URL plus quoted sentence).
- **Return to Claude:** A findings table.
- **Blocks production?** Yes (storage choice depends on it; the fallback is an owner decision)
- **Safe handling:** Read only.

## CW-NET-3

- **Task ID:** CW-NET-3
- **Objective:** Confirm that the deploy currently live (built from `main` at `f02e4f9`) still exists in the Deploys list, so a rollback target exists before cutover.
- **Why Claude cannot do it:** Needs the owner's Netlify dashboard.
- **URL:** https://app.netlify.com/ , the site, Deploys
- **Required owner authorization:** Owner signed in; read-only. Do NOT press Publish deploy.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Find the production deploy built from `f02e4f9`.
  2. Confirm it is listed and the Publish deploy button exists (do not press it).
  3. Note the currently published deploy id and commit.
- **Expected outcome:** Rollback target exists.
- **Evidence to capture:** Screenshot of the deploy page with the commit hash.
- **Return to Claude:** Deploy id, commit, published or not.
- **Blocks production?** Yes (a rollback must exist before cutover)
- **Safe handling:** No publishing, no deleting, no settings changes.

## CW-NET-4

- **Task ID:** CW-NET-4
- **Objective:** Set the environment variables in the Netlify UI: `SESSION_SECRET`, `PP_DATA_KEY`, `GUMROAD_PRODUCT_ID`, `VITE_CHECKOUT_URL`, and on previews `PP_ALLOW_TEST_PROVIDER=1`.
- **Why Claude cannot do it:** Claude must never hold secrets; only the owner can set them.
- **URL:** Netlify, Site configuration, Environment variables
- **Required owner authorization:** Owner authorizes setting them. `SESSION_SECRET` and `PP_DATA_KEY` are generated by the owner (a password manager, 40 or more random characters each, different from each other).
- **Prerequisite:** For the production values, CW-PAY-3 (product id and link).
- **Step-by-step:**
  1. Add `SESSION_SECRET` and `PP_DATA_KEY` scoped to Functions, marked secret. Once real customers exist, `PP_DATA_KEY` must never change.
  2. For previews, add `PP_ALLOW_TEST_PROVIDER=1` scoped to the Deploy Preview and Branch deploy contexts only, plus preview-only secret values.
  3. Later (last step of the order above): add `GUMROAD_PRODUCT_ID` (Functions) and `VITE_CHECKOUT_URL` (build; a public https link, not a secret) from the draft Gumroad product.
  4. Never set `PP_ALLOW_TEST_PROVIDER` for the Production context. The code store is chosen from the deploy context; there is no `PP_ENV` setting.
  5. Do not set `SHOW_DRAFTS` for Production.
- **Expected outcome:** Variables exist with the right scopes.
- **Evidence to capture:** Screenshot of variable NAMES and scopes only, values hidden.
- **Return to Claude:** Confirmation that the names and scopes are set.
- **Blocks production?** Yes
- **Safe handling:** NEVER paste a secret value into chat, a file or a screenshot. Mark secret values as secret in Netlify.

## CW-NET-5

- **Task ID:** CW-NET-5
- **Objective:** Prove, on a deploy preview, that the site and Function deploy, that `/api/*` reaches the Function, and that preview and production stores are isolated.
- **Why Claude cannot do it:** Needs a real deploy and the Netlify UI; Claude does not deploy.
- **URL:** A deploy preview URL and Netlify, Blobs
- **Required owner authorization:** Owner authorizes one preview deploy (costs credits if builds are on; confirm with CW-NET-1).
- **Prerequisite:** CW-NET-1, CW-NET-4 (preview values).
- **Step-by-step:**
  1. Confirm the preview builds and pages load (this also settles the `publish` and build-output question in `ARCHITECTURE.md`).
  2. Activate with the test code `TEST-VALID-ABC12345` and complete one adventure.
  3. In the Blobs UI confirm the record is in `customers-preview` and NOT in `customers-production`.
  4. Confirm `/api/session` answers JSON with `Cache-Control: no-store` (not an HTML page).
- **Expected outcome:** Preview writes only to `*-preview` stores; `/api/*` reaches the Function.
- **Evidence to capture:** Screenshots of the store lists and the response headers.
- **Return to Claude:** Pass or fail, and any HTML-instead-of-JSON or build finding.
- **Blocks production?** Yes
- **Safe handling:** Test codes only. Delete the preview records afterwards.

## CW-BLOB-3

- **Task ID:** CW-BLOB-3
- **Objective:** Premium import and export dry run with SYNTHETIC data.
- **Why Claude cannot do it:** Needs the owner's computer and Netlify token; Claude must not hold them.
- **URL:** The owner's terminal in their checkout.
- **Required owner authorization:** Owner authorizes using their `NETLIFY_AUTH_TOKEN` and `SITE_ID` locally.
- **Prerequisite:** CW-NET-2; Node 22.18 or newer.
- **Step-by-step:**
  1. Write the `syntheticPremium` array from `src/passport/fixtures/premium.synthetic.ts` to a JSON file in a private folder outside the repository (the scripts refuse paths inside it).
  2. `node scripts/premium-import.mjs --file <file> --env preview` (dry run), then again with `--write`.
  3. On the preview, activate with a test code and call `/api/premium/adventures`; compare with the file.
  4. `node scripts/premium-export.mjs --out <path outside the repo> --env preview` and diff against the input.
  5. Delete the synthetic data from `premium-preview` afterwards (`--prune` with an empty array file).
- **Expected outcome:** The round trip is identical and nothing reaches production.
- **Evidence to capture:** Terminal output without the token, and the diff result.
- **Return to Claude:** Pass or fail and any error text.
- **Blocks production?** Yes
- **Safe handling:** Token only in the environment, never in a file or chat. Always `--env preview`.

## CW-PAY-1

- **Task ID:** CW-PAY-1
- **Objective:** Read Gumroad's live license documentation and return the exact facts.
- **Why Claude cannot do it:** Gumroad's API pages did not render for Claude.
- **URL:** https://gumroad.com/api (licenses, verify) and Gumroad's help center article on license keys
- **Required owner authorization:** Read only; no account needed.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Find the license verify endpoint. Copy the exact URL, HTTP method and parameter names (`product_id` or `product_permalink`, `license_key`, `increment_uses_count`).
  2. Copy a full example response and list every field, especially the purchase id or sale id, refunded, chargebacked, disputed, dispute_won and any disabled flag.
  3. Find how a key is disabled and whether a disabled key fails verification.
  4. Record what `increment_uses_count=false` does and the default.
  5. Record the HTTP status and body for an unknown key and for rate limiting.
- **Expected outcome:** A verified specification that replaces every UNVERIFIED comment in `src/server/passport/provider.ts`.
- **Evidence to capture:** Quoted text and URL of each documentation passage.
- **Return to Claude:** The completed list, verbatim.
- **Blocks production?** Yes
- **Safe handling:** Read only.

## CW-PAY-2

- **Task ID:** CW-PAY-2
- **Objective:** Owner creates the Gumroad seller account with identity and payout. (Do this last; see the order above.)
- **Why Claude cannot do it:** Identity and banking data are owner-only; Claude never touches them.
- **URL:** https://gumroad.com/
- **Required owner authorization:** Owner only. Cowork may guide on screen but must never enter identity or bank data.
- **Prerequisite:** CW-PAY-1 and CW-PAY-5 read.
- **Step-by-step:**
  1. Owner signs up and completes identity and payout setup.
  2. Record which email owns the account and the payout method type (not the numbers).
- **Expected outcome:** Seller account ready.
- **Evidence to capture:** Screenshot of the dashboard with sensitive fields hidden.
- **Return to Claude:** Account ready yes or no.
- **Blocks production?** Yes
- **Safe handling:** Never capture identity or bank details.

## CW-PAY-3

- **Task ID:** CW-PAY-3
- **Objective:** Create the product as a DRAFT, not published: price per the owner's decision, license keys enabled, delivery email telling buyers to enter the code on the site.
- **Why Claude cannot do it:** Account actions need the owner's account.
- **URL:** Gumroad dashboard, Products
- **Required owner authorization:** Owner decides the price (the code holds none; see `DECISIONS.md`, C2) and authorizes a draft. Do NOT publish.
- **Prerequisite:** CW-PAY-2, CW-PAY-1.
- **Step-by-step:**
  1. Create the product in draft state.
  2. Enable license keys; note the product id the API uses (CW-PAY-1).
  3. Write the delivery email so it tells the buyer to enter the code at `/unlock` or `/restore-access`.
  4. Leave it unpublished.
- **Expected outcome:** A draft product with license keys enabled.
- **Evidence to capture:** Screenshot of the settings and the product id.
- **Return to Claude:** The product id (entered by the owner in Netlify as `GUMROAD_PRODUCT_ID`) and the product link (for `VITE_CHECKOUT_URL`).
- **Blocks production?** Yes
- **Safe handling:** Do not publish or share the product link.

## CW-PAY-4

- **Task ID:** CW-PAY-4
- **Objective:** A permitted test purchase, restore and refund.
- **Why Claude cannot do it:** Real money may be involved; only the owner can authorize it.
- **URL:** The Gumroad product page (when permitted) and a preview deploy
- **Required owner authorization:** Explicit per-purchase authorization. Use a 100 percent coupon or Gumroad test mode only if the documentation allows; otherwise the owner decides on a real small purchase and refund.
- **Prerequisite:** CW-PAY-1, CW-PAY-3, CW-NET-4, CW-NET-5.
- **Step-by-step:**
  1. Buy once as permitted; copy the license code from the email.
  2. Activate on the preview, then restore on a second browser.
  3. Refund the purchase in Gumroad, wait, then call `/api/session` (the 24-hour re-check; the owner may force it on a preview only).
  4. Confirm premium returns 403 and progress remains.
- **Expected outcome:** Purchase, restore and refund behave as designed.
- **Evidence to capture:** Screenshots with the code hidden; response status codes.
- **Return to Claude:** Pass or fail per step.
- **Blocks production?** Yes
- **Safe handling:** Never put a real license code into chat or files.

## CW-PAY-5

- **Task ID:** CW-PAY-5
- **Objective:** Find Gumroad's rules for transferring a seller account or product, and for migrating entitlements, customers and license keys.
- **Why Claude cannot do it:** The terms live in Gumroad's help center and the owner's agreements.
- **URL:** Gumroad help center and terms of service
- **Required owner authorization:** Read only.
- **Prerequisite:** None.
- **Step-by-step:**
  1. Find whether a seller account or product can be transferred or sold.
  2. Note what happens to customers, license keys and payouts on transfer.
  3. Note any way to export customers.
- **Expected outcome:** A written answer the buyer handover can rely on (`FLIP-HANDOFF.md`).
- **Evidence to capture:** Quoted passages with URLs.
- **Return to Claude:** Findings.
- **Blocks production?** No
- **Safe handling:** Read only.

## CW-QA-1

- **Task ID:** CW-QA-1
- **Objective:** Real iPhone Safari and Android Chrome run of the free flow and, on a preview, the activation flow.
- **Why Claude cannot do it:** Claude has no real devices.
- **URL:** The preview URL, on each phone
- **Required owner authorization:** Owner provides the devices.
- **Prerequisite:** A deploy preview (CW-NET-5).
- **Step-by-step:**
  1. Complete the profile, reveal an adventure, mark it done, add a memory and make a keepsake from a photo from the camera or library.
  2. Reload and confirm progress persists; try a private window and note the "memory only" notice.
  3. Activate with a test code on the preview, close the tab and return; confirm the cookie keeps the session.
  4. Note layout, tap-target, keyboard and download or share problems.
- **Expected outcome:** The free flow works on both devices.
- **Evidence to capture:** Screen recordings or screenshots.
- **Return to Claude:** A defects list.
- **Blocks production?** Yes
- **Safe handling:** Test codes only. Use a photo you do not mind keeping on the device; nothing is uploaded.

## CW-ANA-1

- **Task ID:** CW-ANA-1
- **Objective:** Verify the GA4 events fire and contain no license code, dog name, memory text or customer id.
- **Why Claude cannot do it:** Needs the owner's GA4 property.
- **URL:** GA4, Admin, DebugView, on a preview
- **Required owner authorization:** Owner signed in to GA4.
- **Prerequisite:** A deploy preview.
- **Step-by-step:**
  1. Open the preview with debug mode on.
  2. Walk through profile, reveal, complete, keepsake, unlock view, activate and restore.
  3. Check every event name (prefix `pp_`) and parameter against the list in `PRODUCT-SPEC.md`.
- **Expected outcome:** Events arrive; no personal data, code or id in any parameter.
- **Evidence to capture:** DebugView screenshots.
- **Return to Claude:** The event list with parameters.
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
  1. Claim the website using the meta tag or file method the owner chooses.
  2. Create the boards; post nothing yet.
  3. Make sure the profile address matches `pinterestUrl` in Business settings.
- **Expected outcome:** Site claimed.
- **Evidence to capture:** Screenshot of the claimed status.
- **Return to Claude:** Done yes or no.
- **Blocks production?** No
- **Safe handling:** Do not publish pins without approval.

## CW-CMS-1

- **Task ID:** CW-CMS-1
- **Objective:** Verify the Pages CMS edit, save and publish loop on a harmless change, and confirm which branch Pages CMS writes to.
- **Why Claude cannot do it:** Needs the owner's Pages CMS login; `.pages.yml` records that the full loop is not yet verified.
- **URL:** https://app.pagescms.org/
- **Required owner authorization:** Owner signed in; the owner approves one small saved edit and its build.
- **Prerequisite:** CW-NET-1 (a save starts a build if builds are on).
- **Step-by-step:**
  1. Open the repository in Pages CMS and note the branch.
  2. In "Passport stamps" change the blurb of one stamp by a few words and save.
  3. Confirm a commit appears on that branch and the Netlify build runs; open the page when done.
  4. Revert the edit.
- **Expected outcome:** Save creates a commit; the build passes; the change shows on the site.
- **Evidence to capture:** Screenshots of the commit and the finished deploy.
- **Return to Claude:** Branch name, pass or fail, any form error.
- **Blocks production?** No
- **Safe handling:** Do not edit adventures in the CMS (known form defect, see `OPERATIONS.md`).

## CW-PAY-6

- **Task ID:** CW-PAY-6
- **Objective:** Evaluate, as an optional extra, whether the checkout provider can sell the Passport as a gift (a code the buyer passes on), and record what it would take. Do not build or advertise gifting.
- **Why Claude cannot do it:** It needs the seller account and the provider's current documentation and settings.
- **URL:** The checkout provider's product settings and documentation.
- **Required owner authorization:** Read-only. No product, price or listing changes.
- **Prerequisite:** CW-PAY-1 (license behavior verified).
- **Step-by-step:**
  1. Read the provider's current documentation on gifting, multiple purchases and license-code transfer.
  2. Note whether a purchase code redeemed by someone else would work with our restore and refund checks, and whether the provider shows the buyer or the recipient as the purchaser.
  3. Write down the finding in two or three lines. Do not change anything.
- **Expected outcome:** A short written finding: possible as is, possible with changes, or not supported.
- **Evidence to capture:** The documentation page or setting that supports the finding.
- **Return to Claude:** The finding.
- **Blocks production?** No. Gift checkout is not a launch blocker and no page on the site mentions gifting.
- **Safe handling:** Never paste a license code. Change nothing.
