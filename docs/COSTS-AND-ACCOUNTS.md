# Costs, accounts and the owner's action list (WP8)

> Note (2026-11-24): prices are list prices read on 2026-11-18, not the seller's bills; the sale summary of costs is `docs/buyer/HOSTING_OPTIONS.md`. <!-- SUPERSEDED-NOTE -->


Written and researched 2026-11-18. Every price or term below was read on the page named beside it on **2026-11-18**. Labels: VERIFIED (read on an official page or inspected in the repo today), UNCONFIRMED (not shown on an official page, or the page is ambiguous), RECOMMENDED, NEEDS-YOU. **Introductory and renewal prices are kept apart on purpose.** Nothing was cancelled, bought, changed or submitted while writing this.

Companion documents: `docs/EMAIL-AND-TRANSFER.md`, `docs/SECURITY-AND-RECOVERY.md`, `docs/NETLIFY-BADGE.md`, `docs/OPERATIONS-HANDBOOK.md`, `docs/OPERATIONS-RECORD.md`.

## 1. What each service costs

| Service | What the owner pays | Source (read 2026-11-18) | Label |
|---|---|---|---|
| Namecheap `.com` domain | Renewal **$19.98 per year**, from 2026-11-01. New registration and transfer are $15.98 per year. Both exclude the ICANN fee (the page does not state its amount; a third-party price site shows $0.20 per year, not an official figure). | https://www.namecheap.com/support/knowledgebase/article.aspx/10840/2201/com-price-change-november-1-2026/ | VERIFIED for $19.98; ICANN fee UNCONFIRMED |
| Domain privacy | Included free with the order (owner's order record) | `docs/OPERATIONS-RECORD.md` | Owner-seen; no official page re-read |
| Namecheap Private Email "Launch" (1 mailbox, 5 GB, 10 aliases) | **$14.88 per year** ($29.76 for 2 years). Extra mailbox $8.88 per year (not needed: hello@ is the only address). | https://www.namecheap.com/support/knowledgebase/article.aspx/10789/2179/private-email-plans-comparison/ and https://www.namecheap.com/support/knowledgebase/article.aspx/9185/2215/prices-for-additional-mailboxes-for-namecheap-private-email/ | VERIFIED as the listed price. That page says nothing about promotions or renewal, so "this is the renewal price" is **UNCONFIRMED**: read the renewal line in the cart in Namecheap. |
| Netlify Free | **$0**. 300 credits a month, a hard limit with no top-up. | https://www.netlify.com/pricing/ and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ | VERIFIED |
| Netlify Personal / Pro (only if wanted) | $9 per month (1,000 credits) / $20 per month (3,000 credits) | https://www.netlify.com/pricing/ | VERIFIED |
| GitHub Free | **$0**. Repository `meggzzcode/paw-passage` is currently **public**. | `docs/OPERATIONS-RECORD.md`; GitHub plan page below | VERIFIED |
| Pages CMS (hosted at app.pagescms.org) | **No price is shown on any official Pages CMS page I could read** (pagescms.org docs and the project README give none). The software is MIT-licensed and can be self-hosted. | https://pagescms.org/docs/ , https://github.com/pages-cms/pages-cms | Price UNCONFIRMED; treated as $0 with no guarantee |
| Google Analytics 4, Search Console, Bing Webmaster Tools | $0 | Owner's setup; free to use | Not re-read on official pages today; treat as free, RECOMMENDED to confirm in each console |
| Lovable | **Not needed** (see section 3). Pro is $25 per month for 100 credits; the workspace is on Pro per the audit. | https://lovable.dev/pricing | Pro price VERIFIED on the pricing page; the amount actually being billed UNCONFIRMED |

### 1a. Netlify Free limits that matter for this site (VERIFIED)

Source: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/

- Free plan: **300 credits a month, hard limit, no auto-recharge.**
- Each **successful production deploy costs 15 credits**. Deploy previews, branch deploys and failed deploys cost 0. "Build minutes no longer calculated."
- Bandwidth: 20 credits per GB. Web requests: 2 credits per 10,000. Compute (functions): 10 credits per GB-hour. Form submissions: free.
- "Once your credit balance is completely used up, all of your web projects ... are paused and visitors ... will find a `Site not available` page." The balance resets at the start of each cycle.

**Why this is the biggest hidden cost risk.** Every Pages CMS save is a commit to `main`, and every commit to `main` is a production deploy. 20 production deploys use all 300 credits before a single visitor arrives. Example: 12 deploys a month (180 credits) leaves 120 credits, which is 6 GB of bandwidth (120 / 20). A traffic spike or a month of many small edits could pause the site. RECOMMENDED: batch edits (write several changes, save once, or finish an article before publishing), and check the Usage page (see NEEDS-YOU N4). I could not see which plan type (credit-based or older "legacy" plan) the owner's account is on; this section assumes credit-based because the account is new. UNCONFIRMED.

### 1b. Netlify commercial-use terms (read 2026-11-18)

- The Self-Serve Subscription Agreement (last updated 2026-11-04, https://www.netlify.com/legal/self-serve-subscription-agreement/) **does not prohibit commercial use** of the Free Usage Tier. Section 4.1: customers are not charged on the Free Usage Tier and Netlify "may pause the affected Services if that use exceeds the capacity". Section 5.1: Netlify may change or discontinue the tier, and "may suspend, disable, or remove any site or application on the Free Usage Tier at any time, with or without notice, for any reason or no reason", with no service-level commitments.
- The Acceptable Use Policy (https://www.netlify.com/legal/acceptable-use-policy/) bans reselling the service as standalone hosting, spam, unrelated file hosting and similar; it does not mention affiliate, advertising or content sites.
- Netlify's own wording that the Free plan can host "commercial projects" is in an older blog post and staff forum replies (https://www.netlify.com/blog/introducing-netlify-free-plan/, https://answers.netlify.com/t/can-we-use-netlify-free-plan-for-commercial-purposes/41545). These are not contract terms.
- **Conclusion:** an affiliate content site is not excluded by the agreement or the AUP as read today. The honest residual risk is Section 5.1 (Netlify can remove a free site without notice). That is a business-continuity risk, covered by the restore runbook in `docs/SECURITY-AND-RECOVERY.md`. The earlier "UNCONFIRMED" wording in the handbook is replaced accordingly.

### 1c. GitHub: plan requirements (read 2026-11-18)

- GitHub Free allows unlimited private repositories "with a limited feature set" (https://docs.github.com/en/get-started/learning-about-github/githubs-plans). Protected branches on **private** repositories are listed under Pro and Team, not Free. This matches the owner's decision on 2026-11-17 to make the repo public.
- GitHub Actions on Free: **$12 a month of included compute for private repositories**, expressed as money not minutes (about 2,000 Linux minutes at $0.006 a minute is my arithmetic, not a GitHub figure). **Standard runners are free in public repositories** and do not use that allowance (https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions). Without a payment method, usage stops when the allowance is gone. So CI and the weekly Site health workflow cost $0 while the repo is public, and stay inside the allowance if it were private (CI runs `npm ci`, tests, build and `bun install`; a few minutes each).
- Secret scanning and push protection on a **private** repository need GitHub Secret Protection, a paid product (https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection). On a free **public** repository secret scanning can be enabled by the owner (https://docs.github.com/en/code-security/secret-scanning/enabling-secret-scanning-features/enabling-secret-scanning-for-your-repository). **Consequence: do not make the repo private to "hide" it without budgeting for these.**
- Scheduled workflows in a public repository are disabled after 60 days with no repository activity (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows). The weekly Site health run could silently stop in a quiet period; the owner should re-enable it from the Actions tab if it does.

## 2. Operating cost of the preferred model (renewal prices)

Preferred model: one domain, one mailbox (hello@), Netlify Free, GitHub Free (public repo), Pages CMS, free analytics tools, **no Lovable**.

| Line | Per year | Per month (year / 12) |
|---|---|---|
| Domain `.com` renewal | $19.98 | $1.665 |
| Private Email Launch, 1 mailbox | $14.88 | $1.24 |
| Netlify Free | $0.00 | $0.00 |
| GitHub Free | $0.00 | $0.00 |
| Pages CMS | $0.00 (UNCONFIRMED, no price page) | $0.00 |
| GA4, Search Console, Bing | $0.00 | $0.00 |
| **Total** | **$34.86** (19.98 + 14.88) | **$2.91** (34.86 / 12 = 2.905) |

- With the ICANN fee shown by a third party ($0.20) the domain line would be $20.18 and the total $35.06 a year ($2.92 a month). UNCONFIRMED, shown only to give the range.
- **First term versus renewal.** The owner's 2026-11-17 order for domain plus mailbox totalled **$24.16** (owner-seen). That is an introductory total, not the running cost. Renewal is $34.86 a year, about $10.70 more than the first term, and it is a different number from the order total. Domain renewal date and the email renewal date are UNCONFIRMED until read in Namecheap (N6).
- **If Lovable Pro is kept** at $25 a month: $300 a year extra, total $334.86 a year ($27.91 a month). The annual-billing price is UNCONFIRMED (the pricing page only says "2 months free" for yearly).
- Optional paid steps, none recommended now: Netlify Personal $9 a month ($108 a year) or Pro $20 a month ($240 a year) if the site outgrows 300 credits or the owner wants email build alerts (Pro) or the badge toggle if it is locked on Free (Personal or Pro per the Netlify badge page).

## 3. Lovable: what the site actually depends on

Inspected in the repo and `node_modules` on 2026-11-18.

| Item | Finding | Label |
|---|---|---|
| `package.json` devDependency `@lovable.dev/vite-tanstack-config` pinned `2.27.2` | A **Vite configuration wrapper**, MIT licensed, published on the public npm registry. `npm view @lovable.dev/vite-tanstack-config` returned version 2.27.2, license MIT, tarball `https://registry.npmjs.org/@lovable.dev/vite-tanstack-config/-/vite-tanstack-config-2.27.2.tgz`. Both lockfiles resolve it from that registry. **Installing and building need no Lovable account, login or token.** | VERIFIED |
| `vite.config.ts` imports `defineConfig` from it | It bundles TanStack Start, React, Tailwind, tsconfig paths and the Nitro deploy plugin. Removing it needs a developer to re-add those plugins by hand. | VERIFIED |
| What it does at build time on Netlify | Reading `node_modules/@lovable.dev/vite-tanstack-config/dist/index.js`: sandbox-only behaviour (preview proxy, HMR gate, error diagnostics, Supabase env) is gated on `LOVABLE_SANDBOX=1` or `DEV_SERVER__PROJECT_PATH`. Outside Lovable the config's own default Nitro target is Cloudflare unless Nitro detects the host (it does on Netlify; the live site works). The package makes network calls only if `LOVABLE_PREVIEW_HOST` is set. No script, badge, tagger or HTML injection was found. | VERIFIED by reading; fragility noted in audit 08 |
| `src/lib/lovable-error-reporting.ts`, used at `src/routes/__root.tsx:15,46` | Calls `window.__lovableEvents` / `window.__lovableReportRuntimeError` only if Lovable's editor injected them; otherwise a no-op. | VERIFIED |
| `AGENTS.md` (Lovable markers), `README.md:7` link, `.lovable/project.json`, `.lovable/plan/*.md` | Documentation and metadata only. No build effect. | VERIFIED |
| `lovable-tagger`, `gptengineer`, any Lovable script tag in `index.html`/`__root.tsx` | **None present** (grep of `src`, `plugins`, `scripts`, `public`, `package.json`). | VERIFIED |
| Lovable hosting | The Lovable project is unpublished (audit 08); the live site is on Netlify. | VERIFIED (audit 08) |
| GitHub sync | Two-way sync on `main` while connected. A GitHub connection is "available on all plans" and on disconnect the repository "stays on GitHub ... intact with all history and files" (https://docs.lovable.dev/integrations/github). | VERIFIED |

**Answers.**
- Does the site need a Lovable subscription to build, host or edit? **No** to all three. It builds from the public npm registry, hosts on Netlify and edits in Pages CMS or any code editor.
- What happens if the Lovable subscription ends? The workspace moves to the Free plan at the end of the billing period (https://docs.lovable.dev/introduction/plans-and-credits). Free keeps 5 daily build credits (30 a month cap). The live site, the repo, Netlify and Pages CMS are unaffected. Lost: Pro-only features (custom domains on Lovable's hosting, badge removal, rollovers: https://lovable.dev/pricing), none of which this site uses. What the pages do not say (UNCONFIRMED): what Lovable does with a workspace beyond a long period of inactivity.
- Residual risk: the npm package could be withdrawn or break with a future Vite. Mitigation: version is pinned, the lockfiles pin the exact tarball, and `docs/SECURITY-AND-RECOVERY.md` section 6e keeps an offline copy of the repo plus an optional `npm pack` copy of the package itself for a frozen build. Replacing it with a standard Vite config is a developer task (WP2 owns `package.json` and the lockfile).
- Do **not** run a Lovable prompt against this project: a Lovable edit pushes to `main` and deploys the live site.

## 4. Unnecessary subscriptions (identified only; nothing cancelled)

| Item | Why it may be unnecessary | Saving | Decision |
|---|---|---|---|
| Lovable Pro workspace | Not needed to build, host or edit (section 3) | $25 a month ($300 a year) at the listed price | Owner (N10) |
| Extra Private Email mailboxes | hello@ is the only business address; Launch includes 1 | $8.88 a year each | Do not add |
| Netlify Personal/Pro | Free covers a pre-revenue site if edits are batched | $108 / $240 a year | Do not buy unless credits run out |
| Hostinger | Not used (per handover) | $0 | Confirm nothing is billed elsewhere |

## 5. Where each account lives (names only, no secrets)

See `docs/OPERATIONS-RECORD.md`. Added today: Netlify site id is public in the page source (`3c4975ea-...`), not a secret. DNS is at Namecheap (nameservers `dns1/dns2.registrar-servers.com`, verified live 2026-11-18). Live DNS also holds a Google site-verification TXT and a Pinterest site-verification TXT; do not delete them (they prove ownership to Google and Pinterest).

## 6. NEEDS-YOU checklist (this area)

Each action gives the seven fields: dashboard, where to go, what to change, what to enter, cost, required or optional, how to confirm. Do only what you are comfortable with; none of these are done.

**N1. Turn on two-factor sign-in at GitHub.**
1. Dashboard: github.com (account `meggzzcode`). 2. Profile picture > Settings > Access > Password and authentication > Two-factor authentication > Enable. 3. Change: enable 2FA with an authenticator app, then add a passkey if you wish. 4. Enter: the code from the app; save the recovery codes in a safe place (do not paste them into any file in the repo). 5. Cost: $0. 6. Required (it guards the production branch). 7. Confirm: Settings > Password and authentication shows 2FA "Enabled". Source: https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication

**N2. Make GitHub Actions read-only by default.**
1. github.com. 2. Repository `paw-passage` > Settings > Actions > General > Workflow permissions. 3. Choose "Read repository contents and packages permissions" (the restricted option) and Save; leave "Allow GitHub Actions to create and approve pull requests" off. Also set Fork pull request approval to "Require approval for all external contributors". 4. Enter: nothing. 5. $0. 6. Recommended. 7. Confirm: the Site health workflow still works (Actions > Site health > Run workflow): it declares its own `permissions: contents: read, issues: write`, so it is unaffected. CI (`ci.yml`) has no `permissions:` block, so it will run with the read-only default, which is all it needs. Source: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository

**N3. Check secret scanning on the repository.**
1. github.com. 2. Repository > Settings > Security and quality > Advanced Security. 3. Enable "Secret Protection" / secret scanning if it is off. 4. Nothing to enter. 5. $0 while the repo is public (private repos need a paid product). 6. Recommended (the full-history key scan has never been run). 7. Confirm: the Security tab shows secret scanning; any alert is listed under Security > Secret scanning (revoke any real key it finds, do not just delete it).

**N4. Check Netlify plan, credits and the Powered-by badge.**
1. app.netlify.com. 2. Team settings > Billing (plan and credit usage); then the site > Project configuration > General > "Powered by Netlify badge". 3. Read the plan name and credits used; try the badge toggle (full steps in `docs/NETLIFY-BADGE.md`). 4. Nothing to enter. 5. $0 to look; if the toggle is locked, unlocking is a paid plan ($9 a month Personal), your choice. 6. Plan check: recommended. Badge: optional. 7. Confirm: the credit meter shows below 300; reload https://www.pawsandpassage.com in a private window and the bottom-right badge is gone (if you turned it off).

**N5. Get a free build-failure alert.**
1. app.netlify.com. 2. Site > Project configuration > Notifications > Deploy notifications > Add notification. 3. Add the **GitHub** notification types (commit status / pull request comment) for "Deploy failed" (free), or **Slack** / **HTTP POST request** if you use them. Do **not** choose Email on Free: email notifications are "available on all Pro and Enterprise plans" (https://docs.netlify.com/deploy/deploy-notifications/). 4. Enter: authorise Netlify's GitHub access if asked. 5. $0 (Email would need Pro, $20 a month). 6. Optional but recommended. 7. Confirm: a deliberately bad edit (see `BUYER_HANDOVER.md` section 6 step 10) shows a red mark on the commit in GitHub.

**N6. Read the real renewal prices and dates; turn on auto-renew.**
1. namecheap.com. 2. Account > Domain List > Manage (pawsandpassage.com) and Account > Private Email > Manage. 3. Read "Expires on", renewal price, and set Auto-Renew on for both; turn on two-factor in Profile > Security. 4. Nothing to enter except your 2FA setup. 5. $0 now; auto-renew bills about $19.98 and $14.88 a year when due. 6. Required. 7. Confirm: write the two dates and prices in `docs/OPERATIONS-RECORD.md` (no card details).

**N7. (Optional) Add DKIM and DMARC for the mailbox.** Live check 2026-11-18: MX and SPF exist; no DKIM at `privateemail._domainkey` or `default._domainkey` and no DMARC record. See `docs/EMAIL-AND-TRANSFER.md` section 5 for the careful steps. Cost $0; optional; confirm by sending a test message to a Gmail account and reading "Show original" (SPF/DKIM/DMARC pass).

**N8. Do one real Pages CMS test.**
1. app.pagescms.org. 2. Sign in with GitHub, install the app on the repository, open Articles. 3. Change a harmless date, save. 4. Enter: nothing else. 5. $0. 6. Required before anyone sets branch rules. 7. Confirm: a new commit on `main` in GitHub and the author shown (your own name if Pages CMS used your token; the app's name otherwise: https://pagescms.org/docs/development/authentication/); write down the branch and the author.

**N9. (Optional) Protect `main` against deletion and force-push only.** After N8. See `docs/SECURITY-AND-RECOVERY.md` section 3. Cost $0 on a public repo (private repo: paid plan). Confirm: GitHub shows the rule under Settings > Branches (or Rules); a normal CMS save still works.

**N10. Decide about Lovable.** 1. lovable.dev. 2. Workspace settings > Plans & credit usage > Manage. 3. Option: "Downgrade to free" (the plan stays until the period ends). Optionally Project settings > Git > GitHub > Disconnect so a Lovable prompt can never push to `main`. 4. Nothing to enter. 5. Saves about $25 a month at the listed price. 6. Optional (your decision; I changed nothing). 7. Confirm: the workspace shows Free; the site and GitHub repo are unchanged.

**N11. (Optional) Trial the Content-Security-Policy in Report-Only mode.** Needs someone to own `netlify.toml`. Text and steps: `docs/SECURITY-AND-RECOVERY.md` section 5. Cost $0. Confirm by opening the live site with the browser console open and reading "[Report Only]" messages.

**N12. Take a monthly offline backup.** Steps: `docs/SECURITY-AND-RECOVERY.md` section 6. Cost $0 (an external drive or any free storage you already have). Recommended. Confirm: `git bundle verify` prints "is okay".

**N13. Ask Namecheap support the open Private Email transfer questions** before any sale: fee, downtime, password hand-over. Dashboard: Namecheap Live Chat or pesupport@namecheap.com. Cost $0 to ask. Optional until a sale. Confirm: save their written answer (without any PIN) in your records.
