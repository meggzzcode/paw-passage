# Security steps and recovery runbook (owner's guide)

Researched 2026-11-18 (WP8), from official pages named beside each point plus the repo. Labels: VERIFIED, UNCONFIRMED, RECOMMENDED, NEEDS-YOU. This page changes nothing by itself; `netlify.toml`, `.github/` and `src/` were read, not edited. Related: `docs/recovery/08-security-infrastructure.md` (audit), `docs/COSTS-AND-ACCOUNTS.md` (costs and the full action list), `docs/EMAIL-AND-TRANSFER.md`.

## 1. GitHub account security

| Step | How | Cost | Status |
|---|---|---|---|
| Two-factor sign-in | Settings > Password and authentication > Enable two-factor authentication; authenticator app first, then add a passkey; save recovery codes offline. https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication | $0 | NEEDS-YOU N1 |
| Secret scanning | Repo Settings > Security and quality > Advanced Security > enable Secret Protection (free for a public repo you own). **For a private repo, secret scanning and push protection need GitHub Secret Protection, a paid product.** https://docs.github.com/en/code-security/secret-scanning/enabling-secret-scanning-features/enabling-secret-scanning-for-your-repository , https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection | $0 while public | NEEDS-YOU N3. Whether it is already on: UNCONFIRMED (I cannot see the setting). The git-history key scan has still not been run. |
| Review who has access | Repo Settings > Collaborators: only `meggzzcode` (audit 08). Remove anything unfamiliar. Pages CMS and Lovable apps appear under Settings > GitHub Apps / Integrations. | $0 | Recommended |
| Keep the repo public | The owner made it public on 2026-11-17 because Free GitHub cannot protect `main` in a private repo. If it is ever made private, branch protection, secret scanning and some Actions use stop being free. | | VERIFIED trade-off |
| Never put passwords, tokens or tax details in the repo or docs | Standing owner rule | | In force |

## 2. GitHub Actions permissions

Workflows in the repo (read 2026-11-18):
- `.github/workflows/ci.yml` (push to `main`, pull requests): checkout, `npm ci`, `npx vitest run`, `npm run build`, `bun install --frozen-lockfile`. It has **no `permissions:` block**, so it takes whatever the repository default is.
- `.github/workflows/site-health.yml` (Mondays 06:17 UTC and manual): declares `permissions: contents: read, issues: write`, uses only the built-in `GITHUB_TOKEN`, no secrets. This is already least-privilege.

What to set (N2): Repo Settings > Actions > General > Workflow permissions > **"Read repository contents and packages permissions"**, leave "Allow GitHub Actions to create and approve pull requests" off, and set "Approval for running fork pull request workflows" to "Require approval for all external contributors". https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository . Effect on this repo: none expected, because CI needs only read access and Site health declares its own permissions. (WP6 owns `.github/`; a developer may later add `permissions: contents: read` to the top of `ci.yml` so it does not depend on the setting.)

Also: scheduled workflows in a public repo are switched off after 60 days with no repository activity (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows). If the weekly Site health issues stop appearing, open Actions > Site health and re-enable it. To receive workflow failure emails, GitHub profile > Notifications > Actions (https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications).

## 3. Branch protection on `main`, and what it does to the bots

Facts:
- `main` is unprotected today (audit 08). Pushes from Pages CMS, the Lovable app and coding sessions all land directly on the live branch.
- GitHub's plan page lists protected branches for **private** repositories under Pro/Team, not Free (https://docs.github.com/en/get-started/learning-about-github/githubs-plans). Rulesets are described as a Team/Enterprise feature (https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets). Whether classic branch protection works for a free **public** repo owned by a personal account is not stated plainly on the pages I could read: UNCONFIRMED, but the owner's own 2026-11-17 note implies it does.
- **Bypass lists are limited to organization-owned repositories** ("Actors may only be added to bypass lists when the repository belongs to an organization", https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches). The repo belongs to a personal account, so you cannot exempt Pages CMS or Lovable. An account with admin rights can push unless "Do not allow bypassing the above settings" is on.
- **How Pages CMS commits (official, read today):** it uses the signed-in user's GitHub token if that token can reach the repository; otherwise, for an invited collaborator, the repository's Pages CMS **GitHub App installation token**. With a user token "GitHub handles attribution normally"; with the app token the commit shows the app identity unless `settings.commit.identity: user` is set. https://pagescms.org/docs/development/authentication/ . **The official pages I could read do not say which branch it writes to, nor how it reacts to a protected branch.** A third-party guide says it saves to the main branch; that is UNCONFIRMED.
- If the owner is the signed-in Pages CMS user, the commit uses the owner's own token, and as repo admin the owner can push past a rule unless the "do not allow bypassing" option is on. The Lovable bot (`lovable-dev[bot]`) and the Pages CMS app token are **not** admins and would be blocked by "require a pull request" or "require status checks before merging".

**Recommendation (RECOMMENDED, owner decision N9):**
1. Do **not** turn on "Require a pull request" or "Require status checks" on `main` until N8 (a real Pages CMS save) has shown which branch and identity it uses; a required-PR rule would very likely make every CMS save fail, and there is no bypass list on a personal repo.
2. After N8, the safe rule is: **block force pushes and block deleting `main`** only. That does not block normal commits, so it cannot stop Pages CMS, Lovable or the owner, and it prevents the worst accidents. Settings > Branches > Add rule for `main` (name pattern `main`) and tick only those. Confirm a normal CMS save still works.
3. Instead of required checks, rely on: the build refusing bad content, CI running after each push, and the owner's failure alert (N5). Netlify keeps the previous deploy live when a build fails.
4. The Lovable GitHub sync is the other writer to `main`. If no more Lovable design work is planned, disconnect it (N10): Project settings > Git > GitHub > Disconnect; the repository stays intact with all history (https://docs.lovable.dev/integrations/github).

## 4. Netlify: failed-build alerts (official steps)

- Source: https://docs.netlify.com/deploy/deploy-notifications/ (read 2026-11-18). Path: **Project configuration > Notifications > Deploy notifications**, pick the type, choose the event (Deploy failed, Previously successful deploy failed, etc.).
- **Email** notifications: "available on all Pro and Enterprise plans". Not on Free.
- Free types listed on that page: **GitHub** (commit status, pull request comments, commit checks), Slack, outgoing HTTP POST webhook, and third-party automations. The no-cost route is the GitHub commit status; a failed build then shows a red mark on the commit in GitHub, and GitHub can email from there if the owner watches the repo.
- Failed deploys cost 0 credits and the live site keeps the last good version. https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/
- Also watch the credit meter (Team > Billing): see `docs/COSTS-AND-ACCOUNTS.md` section 1a. Running out of the 300 free credits shows visitors "Site not available".
- Never publish from a failing branch; check Netlify > Deploys about three minutes after any save.

## 5. Content-Security-Policy compatibility plan (Report-Only; not enabled)

`netlify.toml` already sends `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` for `/*` (read in the repo today; the live site had not picked them up yet because the branch is not merged). There is deliberately no CSP. I may not edit `netlify.toml`, so the proposed header is written here for whoever owns it next (N11).

### Third-party origins found in the code (VERIFIED by reading `src/` and the live HTML, 2026-11-18)

| Origin | Used for | Where | CSP directive needed |
|---|---|---|---|
| `https://www.googletagmanager.com` | GA4 loader script `gtag/js?id=G-1J97C8CPC1` (ID in `content/settings.yml`) | `src/routes/__root.tsx` scripts, live HTML | `script-src` |
| `https://www.google-analytics.com`, `https://*.google-analytics.com`, `https://*.analytics.google.com`, `https://*.googletagmanager.com`, `https://*.g.doubleclick.net` | GA4 beacons and collection (`transport_type: "beacon"` events in `src/lib/analytics.ts`) | GA4 runtime | `connect-src`, `img-src` (these hosts are Google's documented GA4 endpoints; I did not re-read Google's page today, so UNCONFIRMED; watch the console report to confirm) |
| `https://fonts.googleapis.com` (CSS) and `https://fonts.gstatic.com` (font files) | Google Fonts, **still live** in the page `<link>` today. WP2 is self-hosting fonts; once that is deployed, drop both. | live HTML | `style-src`, `font-src` |
| `https://www.stay22.com` | Stay22 map iframe `https://www.stay22.com/embed/gm` (`src/lib/stay22.ts`, `src/components/site/Stay22Map.tsx`). **Hidden today** because `stay22AccountId` is empty. | iframe | `frame-src` |
| `https://www.pinterest.com` | "Save to Pinterest" link (`src/components/site/ArticleActions.tsx:36`) and a footer profile link. **Plain links only: no Pinterest script, pixel or widget exists in the code.** The `pinterest-site-verification` is a DNS TXT record, not a tag. | anchors | none (navigation is not restricted by this policy) |
| Affiliate links (`vrbo.com/affiliate/...` in `content/affiliates.yml`) and maker/retailer links (kurgo.com, sleepypod.com, Amazon, etc.) | Outbound anchors only | content | none |
| `impact-site-verification` | A `<meta>` tag, no request | `src/routes/__root.tsx` | none |
| Images | Photos are bundled same-origin files; Unsplash is credits/links only (`src/content/image-credits.ts`) | | `img-src 'self'` |

Own-origin requirements that force `'unsafe-inline'`: the GA4 start-up script (`window.dataLayer ...`), the small `<head>` cleaner script at `src/routes/__root.tsx` (line about 127), and TanStack Start's per-page inline hydration scripts. JSON-LD (`type="application/ld+json"`) is data, not executed. Inline style attributes need `style-src 'unsafe-inline'`. Because the inline hydration scripts differ on every page, hashes are impractical on a static host, so the realistic policy keeps `'unsafe-inline'` for scripts: it still blocks other origins, `<object>`, and base-tag and framing tricks, but it does **not** stop injected inline script. Netlify's badge needs the same allowance (see `docs/NETLIFY-BADGE.md`).

### Header to trial (write only; do not enable until someone owns `netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy-Report-Only = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net; frame-src https://www.stay22.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
```

(One line in the real file. In Report-Only mode the browser only logs would-be violations; nothing is blocked, and with no `report-uri` nothing is sent anywhere. There is no backend to collect reports, so reading them means opening the browser console.)

### How to trial it
1. Put the block in `netlify.toml` on a **branch deploy** (not production), deploy, open the branch URL.
2. Open the browser developer console, browse the home page, a guide, a stay, the packing tool and the policy tool, click a Vrbo button and the share buttons.
3. Look for console lines starting "[Report Only] Refused to ...". Add only the origins that are legitimately needed (for example another Google analytics host), never `*` or `https:` wholesale.
4. Repeat after the self-hosted fonts change lands (remove the two Google Fonts origins) and after the Stay22 account ID is entered.
5. When a full browse gives no reports for a week of normal edits, switch the header name to `Content-Security-Policy` on a branch, test again, and only then ship it. If any doubt, stay on Report-Only.
6. Risk if enforced wrongly: GA4 or the hydration scripts blocked, which breaks page interactivity. This is why it is trial-only.

## 6. Backup and restore runbook

**Principle:** the GitHub repository is the backup of the website, its content (Pages CMS edits are commits) and its docs. There is no database. What lives **outside** the repo is listed below; for each, the recovery step.

### 6a. What lives outside the repo

| Item | Where | If lost |
|---|---|---|
| Domain, DNS records, mailbox | Namecheap | Keep a private screenshot of Advanced DNS; mail copy by IMAP (`docs/EMAIL-AND-TRANSFER.md`) |
| Netlify site settings (domain, badge, notifications, deploy history) | Netlify | Rebuildable from the repo in minutes (6c); settings re-entered by hand. The repo holds `netlify.toml`; no secret environment variables are used (only `SHOW_DRAFTS`/`CONTEXT`, both set in `netlify.toml`). |
| GA4 property, Search Console, Bing property | Google / Microsoft | Not recoverable from the repo; keep admin access under more than one login. The GA4 ID is in `content/settings.yml`. |
| Affiliate accounts, statements, payouts | Each network | Not in the repo; download statements monthly (`docs/OPERATIONS-HANDBOOK.md` section 6) |
| Pinterest, Impact, Stay22 accounts | Each service | As above |
| Pages CMS | pagescms.org (the **content is the repo**; `.pages.yml` is in the repo) | Sign in again; reinstall the GitHub App. Nothing to restore. |
| Lovable project | Lovable (not needed to run the site) | Optional; repo is the master |
| Photos | In the repo (`public/`, `src/assets`) | Covered by the repo backup |
| Original photo or image source files, if any exist only on a laptop | Owner's computer | UNCONFIRMED whether any exist; keep them with the offline backup |

### 6b. Export Pages CMS content
There is nothing separate to export: every article, stay, place, affiliate entry and setting is a file in `content/` of the repository. A repo backup (6e) is the CMS export.

### 6c. Rebuild hosting from the repo on a new Netlify site, and re-point DNS
Use this if the Netlify site is removed, suspended (Netlify may remove a free site "with or without notice", agreement section 5.1) or paused for credits.
1. Netlify > Add new project > **Import an existing project** > GitHub > choose the `paw-passage` repository, branch `main`. If GitHub access is lost, restore the repo first (6f).
2. Netlify reads `netlify.toml`: build command `npm run build`, publish `dist`, Node 22. No environment variables or secrets are needed. Deploy.
3. Open the new `.netlify.app` address and run `node scripts/verify-site.mjs https://NEW-NAME.netlify.app` (needs Node 22). Expect "0 failed".
4. In the new project: Domain management > add `www.pawsandpassage.com` and `pawsandpassage.com`. Write down the DNS values Netlify shows (use those, not these notes).
5. Namecheap > Domain List > Manage > Advanced DNS: change **only** the website records: the `www` CNAME to the new Netlify address, and the apex ALIAS/A to the value Netlify shows (`docs/DNS-AND-TRANSFER.md` section 2). **Do not touch MX, TXT, autodiscover or nameservers.** Do not change nameservers.
6. Wait for HTTPS (Netlify retries for up to three days). Re-run the checker against the real domain with `--site-url https://www.pawsandpassage.com`.
7. Run the email test (`docs/DNS-AND-TRANSFER.md` section 4). Re-check the Netlify badge setting (N4), notifications (N5) and plan.
8. Then remove the old Netlify site, once the new one is confirmed live.
Total time if nothing goes wrong: under an hour plus DNS wait.

### 6d. If the GitHub account or repository is lost
Restore from the offline bundle (6e). Create a repository, push the bundle, reconnect Netlify and Pages CMS (6c, `docs/DNS-AND-TRANSFER.md` section 6e).

### 6e. Periodic offline export (monthly; no paid service) (N12)
On any computer with Git installed. Replace the date.
1. `git clone --mirror https://github.com/meggzzcode/paw-passage.git paw-passage.git` (the repo is public so no login is needed to read it; for a private repo you would sign in).
2. `cd paw-passage.git`
3. `git bundle create ../paw-passage-2026-11-18.bundle --all`
4. `git bundle verify ../paw-passage-2026-11-18.bundle` (it should say "is okay").
5. Optional, for a frozen build: `npm pack @lovable.dev/vite-tanstack-config@2.27.2` saves the build-config package as a `.tgz` beside the bundle, in case the public registry ever withdrew it.
6. Copy the `.bundle` (and optional `.tgz`) to **two** places you control (an external drive and a free cloud folder). Keep the last three months.
Fast alternative with less safety: on GitHub, Code > Download ZIP gives only the current `main` files with no history.
Also each month: download affiliate statements and save a dated screenshot of the Namecheap Advanced DNS page and the GA4 and Search Console home screens, in the same folder (not in the repo).

### 6f. Restore from a bundle
1. `git clone paw-passage-2026-11-18.bundle paw-passage` (creates a normal working copy).
2. Create a new empty GitHub repository, then `git remote set-url origin <new repo URL>` and `git push --all origin`.
3. `npm ci && npx vitest run && npm run build` to confirm it builds.
4. Connect it to Netlify (6c) and to Pages CMS.

### 6g. How often
Monthly, and before any sale, merge or large Pages CMS session. Record the date in `docs/OPERATIONS-RECORD.md`.

## 7. Other findings carried from audit 08

Still open and outside WP8: zod and vite advisories (WP2/package files), draft preview links are public (low), unused dependencies. Nothing here changes them.

## 6. Response headers on HTML pages and the frame-protection decision

**Problem (LIVE-AUDIT D1, VERIFIED):** `netlify.toml` `[[headers]]` only applies to static files. Pages are rendered by the server function, so the three headers never reached HTML.

**Fix (COMPLETED):** a TanStack Start request middleware (`src/lib/security-headers.ts`, registered first in `src/start.ts`) adds `Referrer-Policy: strict-origin-when-cross-origin` and `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()` to every `text/html` response, including 404 and 500 pages, in dev and in production. Checked with a local node production build and `curl -I` on `/`, `/stays`, a guide and a 404. Google Analytics, the Pinterest save link and affiliate links are unaffected (neither header blocks outbound links or scripts; `strict-origin-when-cross-origin` still sends the origin to Vrbo and Amazon, which the affiliate programmes need).

**Trade-off (DECISION):** `X-Frame-Options: SAMEORIGIN` is NOT sent on HTML. The Lovable editor shows the site in an iframe from a different origin, so the header would blank the preview. The cost is that another website can frame pages (clickjacking). Risk is low: there are no logins, forms that change state, payments or accounts. If the site is ever moved off Lovable previews, add `frame-ancestors 'self'` (or `X-Frame-Options: SAMEORIGIN`) to `HTML_SECURITY_HEADERS` in `src/lib/security-headers.ts`; for the Lovable preview use `frame-ancestors 'self' https://*.lovable.app https://*.lovable.dev https://*.lovableproject.com` (RECOMMENDED, not tested against the live editor).
