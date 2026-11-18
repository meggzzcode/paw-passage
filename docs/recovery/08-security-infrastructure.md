# 08 - Security, infrastructure and operations audit

Audit date: 2026-11-18. Method: repo read, live HTTP probes of https://www.pawsandpassage.com, read-only Supabase/Lovable/GitHub MCP calls, `npm audit` in a temp copy. No secret values are quoted. No repo file other than this report was changed.

## Summary

1. VERIFIED: the site has no backend. No `supabase/` folder, no `src/integrations/`, no `.env*` files, no `VITE_*` variables, no Supabase client import. Lovable's database is **not enabled** for the project (Lovable `get_database_status` -> `enabled:false`). Row-level security does not apply.
2. VERIFIED: no credentials found in the working tree, built `.output`, or live homepage. Only public-by-design values appear (GA4 ID, Impact `impact-site-verification` meta tag, both in the live HTML).
3. VERIFIED: `npm audit --omit=dev` reports 1 high (zod, memory exhaustion on oversized collections). Full audit adds 1 high (vite dev-server issues). Neither is reachable on a static/pre-rendered public site in a meaningful way (details below).
4. VERIFIED: no admin tool or draft is publicly reachable: `/admin`, `/.pages.yml`, `/docs`, `/.git/config`, `/.env`, `/netlify.toml`, `/package.json`, `/BUYER_HANDOVER.md` all return 404 on production.
5. VERIFIED weakness: live site sends only HSTS and `x-content-type-options: nosniff` (Netlify defaults). No CSP, X-Frame-Options, Referrer-Policy or Permissions-Policy. `netlify.toml` sets headers only for `/assets/*` cache.
6. VERIFIED weakness: `main` is unprotected (GitHub `protected:false`), and the sole collaborator is `meggzzcode` (admin). Anyone/anything with push (Pages CMS app, Lovable app, Claude sessions) writes straight to the production branch; CI (`.github/workflows/ci.yml`) runs but is not a required check.
7. CORRECTION to brief: commit history (last 100 on main) shows `lovable-dev[bot]` (2 commits), `claude` and `meggzzcode`; no `gpt-engineer-app[bot]` seen. The Lovable bot can still push to main if the Lovable GitHub app stays connected.
8. VERIFIED: the Supabase MCP account holds 3 unrelated projects (not this site); none read or modified.
9. Known costs: domain+Private Email order $24.16 (2026-11-17, first term); Netlify free; GitHub free; Pages CMS free; Lovable workspace is on the **Pro** plan (paid, not needed to publish).
10. Biggest operational risks: silent failed builds on Netlify free plan, no branch protection, unconfirmed Netlify free-plan commercial-use terms, deploy depends on Lovable's npm config package.

## 1. Database, RLS, auth, admin

| Item | Finding | Label | Evidence |
|---|---|---|---|
| Supabase in repo | None. No client, folder, edge functions, integrations dir | VERIFIED | `ls supabase src/integrations` -> not found; grep for supabase finds only a comment `src/lib/lovable-error-reporting.ts:55` and the Lovable boilerplate `AGENTS.md:18` ("Do not add supabase/migrations") |
| Env vars | No `.env*`; no `VITE_` use. Only `import.meta.env.DEV` (`src/config/site.ts:18,20`) and `SHOW_DRAFTS`/`CONTEXT` build vars (`plugins/content.ts:293,296`) | VERIFIED | grep |
| Lovable database | Disabled | VERIFIED | Lovable MCP get_database_status, project 0f267d97... |
| Supabase MCP | 3 projects exist in the connected account (names unrelated to this site, e.g. a trading and a medical app); I listed only, nothing else | VERIFIED; RECOMMENDATION: do not connect this site to any of them | list_projects |
| RLS | Not applicable (no DB). | VERIFIED | - |
| Public APIs / server functions | No API routes except `src/routes/sitemap[.]xml.ts`. Outbound-only: GA4 tag, affiliate links (`rel="sponsored nofollow noopener"`, `src/components/site/BookingButton.tsx:19`). Forms: none that post to a server (contact is by email). | VERIFIED | routes list |
| Admin access | Pages CMS signs in via GitHub; access = GitHub repo permission. Only collaborator is `meggzzcode` (admin). `/admin` is 404 (Pages CMS is hosted at app.pagescms.org, not on the site). | VERIFIED (collaborators, 404); real Pages CMS login not tested by anyone (`BUYER_HANDOVER.md:91`) | github list_repository_collaborators |
| Lovable project | One project "Paws & Passage", unpublished (`is_published:false`), visibility `workspace_edit`, workspace plan Pro, owner role. Not the live site (Netlify is). | VERIFIED | Lovable list_workspaces/list_projects |
| Lovable-GitHub relationship | Lovable syncs `main`; `AGENTS.md:3-9` says commits on the connected branch sync both ways. A Lovable prompt that edits code pushes to main and so would deploy to production via Netlify. | VERIFIED; risk SUSPECTED-moderate | AGENTS.md, commit list (`lovable-dev[bot]`) |
| Markdown rendering | `dangerouslySetInnerHTML` of `marked` output (`src/components/site/Markdown.tsx:82`) and chart style (`src/components/ui/chart.tsx:73`). Content comes only from repo files edited by trusted owners, so XSS needs repo write access. Low. | VERIFIED / low | grep |

## 2. Exposed credentials

| Check | Result | Label |
|---|---|---|
| Tree grep (AKIA, `sk-`, `ghp_`, `github_pat_`, JWT `eyJ...`, `xox`, PEM) | Single hit: `.output/server/_libs/h3-v2+rou3+srvx.mjs` (PEM header string inside a bundled library; not a key). `.output` is gitignored (`.gitignore` line `.output`) | VERIFIED |
| Keyword grep (`apikey/secret/token/password` assignments) | Only UI/test code (`src/components/site/Markdown.tsx:15,33`, `src/test/pet-cost-workflow.test.tsx:92`), no values | VERIFIED |
| Built `.output/public/assets` for AKIA/JWT | none | VERIFIED |
| Live homepage + JS assets | No `supabase`, no keys. Public-by-design present: GA4 measurement ID and Impact site-verification meta in `<head>` | VERIFIED |
| Source maps | Live JS assets not confirmed to expose maps (homepage assets contain no `sourceMappingURL`) | VERIFIED for sampled assets |
| Git history scan | NOT DONE: brief forbids running git beyond reading, and history grep needs it. One `git log` was run by mistake (read-only, output unused). GitHub secret scanning for pushes is a GitHub setting I could not see. | COULD-NOT-ACCESS / NEEDS-USER-ACTION (check Settings > Code security > Secret scanning) |
| Credentials stored in docs | Docs reference account owners, not passwords (spot checks; the standing rule says never store them) | VERIFIED (spot) |

## 3. Dependencies (`npm audit --omit=dev`, temp copy, lockfile as committed)

| Package | Severity | Issue | Reachable in static public site? |
|---|---|---|---|
| zod (direct, `^3.25.76`; fix needs zod 4 = breaking) | high | GHSA-mrhx-c7xc-m3w5: memory exhaustion validating oversized constrained collections | Mostly NO. zod is used in `src/content/schema.ts` (build-time validation of repo content) and in router search params `src/lib/stay-search.ts`, `src/lib/place-search.ts`, `src/routes/stays.index.tsx`, `src/routes/dog-rules.index.tsx`. Search params are small strings; exposure is only to a visitor crafting a huge URL on Netlify's SSR function. Low practical risk. |
| vite 8.0.0-8.1.5 (dev dependency, pinned `8.1.5`) | high | launch-editor command-exec and Vite dev-server middleware/fs.allow issues | NO. Dev server only; not shipped to production. Affects only a developer running `vite dev` on an untrusted network. |

Totals: prod 1 high / 0 others; all 2 high. `bun audit` not run (bun not needed; npm used).

Outdated/unused (VERIFIED by import grep, confirm before removing):
- Dependencies never imported in `src/`, `plugins/`, `scripts/`: `@hookform/resolvers`, `date-fns`, `vite-tsconfig-paths`, `@tailwindcss/vite`, `@tanstack/router-plugin` (the last two are probably provided by Lovable's config package; keep unless tested).
- shadcn components in `src/components/ui/` with no importer (~35 of 46): accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, drawer, dropdown-menu, form, hover-card, input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, sidebar, slider, sonner, switch, table, tabs, textarea, toggle-group. Dead code, and they pull unused deps (recharts, cmdk, vaul, embla, input-otp, react-day-picker, radix packages) into the install. Tree-shaking keeps the bundle small, so impact is install size/maintenance only.
- Two lockfiles (`package-lock.json` for Netlify, `bun.lock` for Lovable); CI `bun install --frozen-lockfile` guards drift (`.github/workflows/ci.yml`).
- `.npmrc` `legacy-peer-deps=true` hides peer conflicts.
- Dead routes: none found; routes all map to nav/content. `src/routes/README.md` is a doc file inside routes (harmless).

## 4. Hosting, headers, deploy

| Item | Finding | Label |
|---|---|---|
| Build | `command = "npm run build"`, `publish = "dist"`, Node 22 (`netlify.toml:1-6`). Local `.output` exists from the `node-server` preset (`build:node`), but the live site works on Netlify, so Nitro auto-selects its Netlify preset there. Fragile: `vite.config.ts` comments say the default Nitro target is cloudflare. | VERIFIED live works; SUSPECTED fragility |
| SHOW_DRAFTS | Preview contexts explicitly set `"false"` (`netlify.toml:10-14`), but the top comment still says previews can show drafts (stale comment, `netlify.toml:8-11`). Build fails if `SHOW_DRAFTS=true` AND `CONTEXT=production` (`plugins/content.ts:293-295`). Good guard. | VERIFIED |
| Draft/sample content | Samples only render when `import.meta.env.DEV` (`src/config/site.ts:18`). Production draft pages are not served. | VERIFIED |
| Preview deploys | Public link unless Netlify password protection (paid). With SHOW_DRAFTS=false this exposes nothing extra; branch deploys are still indexable unless noindex applies (only added when drafts shown, `src/routes/__root.tsx:94`). | SUSPECTED low |
| Live headers (/) | `strict-transport-security: max-age=31536000`, `x-content-type-options: nosniff`, `cache-control: no-cache`. No CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy. | VERIFIED |
| Redirects | http->https 301, apex -> www 301. 9 legacy redirects in `netlify.toml:23-80`. | VERIFIED |
| Reachable files | `/admin`, `/.pages.yml`, `/docs`, `/.git/config`, `/.env`, `/netlify.toml`, `/package.json`, `/BUYER_HANDOVER.md`, `/_headers`: 404. `/docs/` -> 307 -> `/docs` -> 404. `/pet-policies-38-managers.csv` (public data file, `public/`): 200, intentional dataset. `public/pins`, `public/share`: images. | VERIFIED |
| robots.txt / sitemap | Allow all, sitemap present and 200. | VERIFIED |
| Error handling | SSR wrapper converts swallowed 500s into an HTML error page (`src/server.ts:24-37`); Lovable error reporter is a no-op outside the editor. | VERIFIED |
| Build breakers | Content validation in `plugins/content.ts` fails the build on bad content (by design, old site stays live). Netlify free plan sends no failure emails (`BUYER_HANDOVER.md:44`). `npm ci` fails if `package-lock.json` is out of date with `package.json`. | VERIFIED |
| Branch protection / required checks | `main` `protected:false`. 5 branches: `add-impact-site-verification`, `claude/affiliate-setup`, `claude/cms-poc`, `claude/lucid-davinci-l2fixa`, `main`. Pages CMS writes directly to main (behavior unconfirmed in docs `BUYER_HANDOVER.md:92`), so a required-PR rule would break editing. | VERIFIED |
| Backups | Git history on GitHub is the only backup of content/code. No second copy, no Netlify deploy export beyond Netlify's retained deploys. No database to back up. | VERIFIED |

## 5. Operating costs (only what is evidenced)

| Service | Cost | Evidence |
|---|---|---|
| Domain pawsandpassage.com + Namecheap Private Email "Launch" (1 mailbox) | Order total $24.16 on 2026-11-17 (first term). Renewal prices and dates NOT CONFIRMED. Domain privacy free. | `docs/OPERATIONS-RECORD.md:8-9` |
| Netlify | Free plan; usage limits apply; commercial use on free plan NOT CONFIRMED (`BUYER_HANDOVER.md:141`). Paid features absent: failure emails, password-protected previews. | handover |
| GitHub | Free | handover line 29 |
| Pages CMS | Free per its site; no guarantee | handover lines 30,139 |
| Lovable | Workspace plan is **Pro** (paid; amount not shown to me). Not needed to publish. | Lovable list_workspaces |
| GA4 | Free (G-ID in `content/settings.yml`, public) | repo |
| Impact, Vrbo/Expedia, Stay22 | No cost evidenced | - |
| Ongoing total | Unknown beyond ~$24 first-year domain+mailbox; renewal figures need Namecheap | NEEDS-USER-ACTION |

## 6. Recommendations

SAFE fixes (repo-only, low risk, no behavior change):
1. Fix stale comment at `netlify.toml:8-11` (says drafts could show, but both contexts are `"false"`).
2. Add a `[[headers]] for="/*"` block with `X-Frame-Options: SAMEORIGIN` (or CSP `frame-ancestors 'self'`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Test on a preview. Do NOT add a strict CSP yet (GA4, Impact, inline script at `src/routes/__root.tsx:127` would break); consider CSP later in report-only mode.
3. Remove unused deps and ~35 unused `ui/*` components after a build+test pass (cosmetic/maintenance).
4. Add `X-Robots-Tag: noindex` for deploy-preview/branch-deploy contexts via `[context.*.headers]`.

NEEDS-APPROVAL:
1. Upgrade zod to 4.x (breaking; touches schema and search validation) and vite when 8.1.6+ is released: high-severity but low reach; schedule, not urgent.
2. Turn on GitHub branch protection for `main` with required check "CI / check". Must allow Pages CMS and Lovable pushes (use a ruleset with bypass for those apps) or CMS edits will be blocked. Alternative: leave unprotected but make `ci.yml` the Netlify build gate.
3. Disconnect Lovable's GitHub sync (or restrict it) once no further Lovable design work is planned, removing the "Lovable prompt pushes to production" path. Keep the `@lovable.dev/vite-tanstack-config` dependency risk in mind (`BUYER_HANDOVER.md:137`).
4. Cancel/downgrade the Lovable Pro plan if unused (it is not needed to publish): saves recurring cost.
5. Paid Netlify plan only if failure emails or password-protected previews are needed. Cheaper alternative: GitHub Actions already runs on push; add an email/Slack notification there.

## Needs your personal action
1. GitHub: Settings > Code security: confirm secret scanning + push protection are on; confirm 2FA on `meggzzcode`.
2. Namecheap: read renewal price/date, turn on auto-renew, confirm 2FA.
3. Netlify: confirm project visibility is Public (not Private), read free-plan commercial-use terms, check build-failure notifications.
4. Lovable: decide whether to keep the Pro plan and the GitHub sync.
5. Pages CMS: do one real sign-in/edit test (never done; `BUYER_HANDOVER.md:91`).

## Could not verify
- Git history for leaked keys (git not allowed by brief; use GitHub secret scanning or `gitleaks` locally).
- Branch rulesets beyond the `protected` flag; Netlify env vars and plan; GitHub app permissions; Lovable plan price; real Pages CMS access model.
- Source-map exposure for every asset (only sampled homepage assets).
- `gpt-engineer-app[bot]` activity older than the last 100 commits.
