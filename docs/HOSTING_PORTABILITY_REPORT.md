# Hosting portability report

Written 2026-11-24. Read-only audit of repo HEAD `bebafb9`; nothing in the repo, DNS, Netlify or Lovable was changed. Labels: VERIFIED (run or read today), UNVERIFIED (could not be read or tested).

## 1. Verdict

The site does not need a paid Lovable plan, a Lovable account or any Lovable environment variable to install, build, run, host or edit. It is hosted on Netlify and edited through GitHub or Pages CMS. One build-time package comes from Lovable's namespace (section 2); it is free, public and needs no login, but it is a real third-party coupling a buyer should know about.

## 2. Lovable-specific dependencies

| Item | Where | What it does | Buyer limitation? |
|---|---|---|---|
| `@lovable.dev/vite-tanstack-config` 2.27.2 | `package.json` devDependency; `vite.config.ts` | Wraps Vite config: TanStack Start, React, Tailwind, tsconfig paths, Nitro (default target Cloudflare; Netlify when Netlify is detected). Public npm, MIT. | Minor. Lockfiles resolve from the public registry, no token. It is a pinned dependency of a vendor the buyer does not control; if it were unpublished or changed incompatibly, the buyer would replace it with a plain `vite.config.ts` (already planned in `docs/MIGRATION-PLAN.md`). Not a hosting lock-in. |
| Lovable package exemptions | `bunfig.toml` (`minimumReleaseAgeExcludes` lists five `@lovable.dev/*` names) | Bun install setting only; four of the five packages are not installed. | None. |
| `reportLovableError` | `src/lib/lovable-error-reporting.ts`, used in `src/routes/__root.tsx` | Calls `window.__lovable*` hooks only if the Lovable editor injected them; otherwise no-op. | None. |
| `AGENTS.md` Lovable block | repo root | Instructions for AI agents (do not rewrite pushed history; Lovable manages DB, gateway, secrets). Text only. | None for building. Matters only if the GitHub sync stays connected (section 4). |
| `.lovable/project.json`, `.lovable/plan/*.md` | repo root | Template metadata and an old plan. Not read by the build. | None. |
| Comments | `vite.config.ts`, `netlify.toml`, `src/start.ts`, `src/lib/security-headers.ts`, `ci.yml` | Mention Lovable (editor iframe is why `X-Frame-Options` is not sent; bun lockfile kept current for Lovable). | None. A buyer may later add `X-Frame-Options`/CSP. |
| Env vars | whole repo | `LOVABLE_SANDBOX`, `DEV_SERVER__PROJECT_PATH`, `LOVABLE_PREVIEW_HOST` only gate editor-sandbox behaviour inside the config package (per `docs/COSTS-AND-ACCOUNTS.md` section 3, read from package source; not re-read today). `netlify.toml` sets none. | None. |
| Not present | grep of `src`, `plugins`, `scripts`, `public`, `index.html` | No `lovable-tagger`, no `lovable.toml`, no Lovable script tag, no Lovable runtime API call, no Lovable AI gateway or Cloud/Supabase use. | None. |
| Lovable project and workspace | Lovable account | Project `0f267d97-888f-41b2-a541-46bc86d899b5` "Paws & Passage", workspace "Megan's Lovable" (plan `pro`, owner Megan, 17 projects), `is_published: false`, no publish audience targets. Preview URL `id-preview--0f267d97-888f-41b2-a541-46bc86d899b5.lovable.app`. Last Lovable edit 2026-11-24, Lovable's latest commit `dbbbb94`. | Not part of the site. Nothing is hosted or domain-connected there. |

Workflows (`ci.yml`, `indexnow.yml`, `monthly-digest.yml`, `site-health.yml`) use GitHub Actions only. `ci.yml` runs `npm ci`, tests, `npm run build`, then `bun install --frozen-lockfile`.

## 3. Proof of independence (clean clones of HEAD, scratchpad `/tmp/claude-0/-home-user/fda9ad27-569d-5e7b-b498-88d7075dfab9/scratchpad/portability`)

No Lovable account, login or `LOVABLE_*` variable was present (`env | grep -i lovable` returned nothing; Bun builds ran under `env -i`).

| Test | Result |
|---|---|
| `bun install` | PASS, 522 packages, 4 s |
| `NITRO_PRESET=node-server bunx vite build` | PASS, `.output/server/index.mjs`. `node .output/server/index.mjs` served `/` 200 and a guide page 200 with correct `<title>` and a `permissions-policy` header. |
| `bunx vite build` (no preset, config default) | PASS, `.output/` with `_headers` (Cloudflare-style Worker target). |
| Netlify-style: `NETLIFY=true npm ci && NETLIFY=true npm run build` (what `netlify.toml` runs: `npm run build`, publish `dist`) | PASS, 513 packages. Output: static files in `dist/` plus an SSR function at `.netlify/functions-internal/server/`. So production = Netlify preset (Nitro auto-detects Netlify), static assets plus server-rendered HTML through a Netlify function. |

Not tested: a real Netlify deploy (live site was not touched), and `npm run lint`. Redirects from `netlify.toml` are not applied by the Node server (a retired slug returned 404 there); they exist only on Netlify. This is why a move needs section 5.

## 4. Buyer flow with no Lovable subscription

1. Buyer creates a GitHub account and takes ownership of the repo (transfer, or fork/push to a new one). Currently `meggzzcode/paw-passage`, public, `main` is live.
2. Buyer creates a Netlify account (Free), "Import from Git", picks the repo; the settings come from `netlify.toml` (`npm run build`, publish `dist`, Node 22). Adds the custom domain in Netlify and points Namecheap DNS to it (`docs/DNS-AND-TRANSFER.md`).
3. Push to `main` -> Netlify builds and deploys. A push touching only `docs/`, `.github/` or `*.md` skips the build (ignore rule).
4. Buyer signs into Pages CMS (app.pagescms.org, GitHub login) and opens the repo; `.pages.yml` defines the forms. A save commits to GitHub, which triggers the same Netlify build. UNVERIFIED: `.pages.yml` has not been exercised in the live Pages CMS app (stated in the file itself), and which branch it writes to is unconfirmed.
5. Buyer owns/creates: GitHub, Netlify, Namecheap (domain, optional mailbox), Pages CMS login, affiliate and analytics accounts (see `docs/TRANSFER_CHECKLIST.md`). Lovable is not on this list.

Git sync complication (only while Lovable stays connected): per https://docs.lovable.dev/integrations/github (read 2026-11-24) sync is two-way on one active branch; a Lovable edit pushes to that branch (here `main`, which deploys live) and if Lovable and GitHub diverge "the next sync from GitHub replaces Lovable's version of the branch" (Lovable saves a backup). Disconnecting leaves the GitHub repo "intact with all history and files". `AGENTS.md`'s warning not to rewrite pushed history is for that reason. Recommended before handover: owner disconnects GitHub in Lovable project settings. Whether it is currently connected could not be read (the Lovable MCP tools expose no Git status); UNVERIFIED.

## 5. Lovable findings (official docs, read 2026-11-24)

| Question | Finding | Source |
|---|---|---|
| Transfer | "You can move a project only between workspaces you belong to" (Move to workspace in project settings). A buyer would have to be a member of the owner's workspace first, so a clean sale transfers the GitHub repo, not the Lovable project. The dedicated transfer page (`/features/project-transfer`) returned 404; plan restrictions for moving: UNVERIFIED. A GitHub-synced project keeps syncing after a move only if the destination workspace has a GitHub connection for the repo owner, otherwise it is disconnected. | https://docs.lovable.dev/introduction/subscription-plans ; https://docs.lovable.dev/integrations/github |
| Plans | Pro $25/month or $250/year (100 credits), Business $50/month; Free has no price. Free: 5 daily credits, 30/month cap. | https://docs.lovable.dev/introduction/subscription-plans ; .../plans-and-credits |
| Publishing | Free includes publishing to invited people only (up to 10 per project); public publishing on Free is not listed there. | subscription-plans |
| Custom domain | Paid plan required ("Custom domains are available on paid plans"). | https://docs.lovable.dev/features/custom-domain |
| If plan lapses | Plan stays to end of period, then Free. Connected domains keep serving; no new domain can be connected until upgraded. Free workspaces inactive about a year "may be unpublished". Apps using Lovable Cloud/AI need credits. This site uses none of those and is not published there. | plans-and-credits ; custom-domain ; features/deploy |
| Project when plan lapses | Not stated beyond the above. Whether unpublished projects in an unused Free workspace are deleted: UNVERIFIED. The code remains in GitHub regardless. | n/a |

## 6. Recreating Netlify behaviour on Lovable hosting

Lovable hosting (https://docs.lovable.dev/features/hosting, read 2026-11-24) serves TanStack Start output in server-rendered or static form; apps created from 2026-05-13 get SSR for every visitor (this project was created 2026-11-16); static output needs a root `index.html` and "not every TanStack Start single-page configuration is supported"; plain HTTP redirects to HTTPS. The docs do not mention custom headers, a redirects file, or `netlify.toml`. Lovable does not read `netlify.toml`.

| `netlify.toml` item | Needed on Lovable | Status |
|---|---|---|
| `[build]` command, publish, Node 22 | Not needed; Lovable builds itself. | Equivalent, UNVERIFIED |
| Build `ignore` rule (skip docs-only pushes) | Not available as such; Lovable publishes on demand. | Dropped |
| 11 x 301 redirects (retired `/guides/...` slugs to merged guides or `/destinations/california`, `/destinations/georgia`; `force = true`) | Must be recreated, as route-level redirects in app code or a redirect mechanism Lovable offers. Docs name none. Gear legacy slugs and tool 301s were requested but are not in `netlify.toml` at HEAD (only guide redirects); if they live in app routes they move with the code (not checked). | Not documented; UNVERIFIED |
| Header `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` | Recreate if Lovable allows static headers; otherwise lose long caching (speed, not correctness). | UNVERIFIED |
| Header `Referrer-Policy`, `Permissions-Policy` on `/*` | HTML pages already get these from `src/lib/security-headers.ts` via `src/start.ts` (verified: `permissions-policy` seen on the Node build). Static files would lose them. No HSTS is set in `netlify.toml`; Netlify adds it by default on its HTTPS domains. | Pages preserved; static UNVERIFIED |
| Context env `SHOW_DRAFTS=false` for branch/deploy previews | Default behaviour; nothing to set if the variable is absent. | Equivalent |
| Functions | None declared. Netlify's SSR function is generated by Nitro. On Lovable the config's default (Cloudflare Worker) target applies. | Not tested on Lovable |

Whether SSR, SEO metadata, tools and every existing URL would behave identically on Lovable was NOT tested; only the build output type (Cloudflare-style default `.output`) and the docs support it. Check a staging publish on the buyer's own workspace before any DNS change. This report recommends no move.

## 7. Monthly cost (USD, list prices; see `docs/COSTS-AND-ACCOUNTS.md`, domain/email read 2026-11-18)

| Item | Free allowance | Paid requirement | Usage-based |
|---|---|---|---|
| Netlify Free | $0. 300 credits/month, hard limit, no recharge, "never charged". Deploy previews, branch deploys and failed deploys not metered. Custom domain and SSL included. | None. Personal $9/mo (1,000 credits), Pro $20/mo (3,000). | Credits: 15 per production deploy, 20 per GB bandwidth, 2 per 10,000 requests, 10 per GB-hour compute. 300 credits is about 20 deploys or 15 GB (arithmetic, not a Netlify figure). How the SSR function is metered: UNVERIFIED. What happens at the cap: not spelled out in the page read. |
| Lovable | Free plan: 5 daily credits (30/month), invite-only publishing. | Custom domain: Pro $25/mo ($250/yr) or higher. | Credits for AI/Cloud; no visitor/bandwidth cap on paid plans, free workspaces limited to 1,000 server requests per 10 s. |
| Domain (Namecheap .com) | none | $19.98/yr renewal (about $1.67/mo) | |
| Optional mailbox (Namecheap Private Email) | none | $14.88/yr listed (renewal price unconfirmed) | |
| GitHub Free, Pages CMS | $0 (Pages CMS price UNCONFIRMED) | | |

Running cost on the recommended stack: about $34.86/yr (about $2.91/mo) with the mailbox, $19.98/yr without. Keeping Lovable Pro adds $300/yr and is not needed. Netlify sources: https://www.netlify.com/pricing/ and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ (read 2026-11-24).

## 8. Unverified

- Lovable GitHub sync status, branch and repo link for this project (MCP exposes none); whether Lovable's latest commit `dbbbb94` matches GitHub `main`.
- Lovable's dedicated project-transfer page (404) and any plan restriction on transfers.
- What Lovable does with an unpublished project in a lapsed or inactive workspace; the amount actually billed on the Pro plan.
- Lovable support for custom headers/redirects; behaviour of this site's SSR build on Lovable.
- Netlify metering of the SSR function and behaviour at the 300-credit cap; real Netlify deploy not re-run.
- Pages CMS live test and target branch; current Pages CMS pricing.
- Env-var behaviour of the config package re-read from source today (relied on the 2026-11-18 reading).
