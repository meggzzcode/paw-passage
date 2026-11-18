# The "Powered by Netlify" badge: where it comes from and how to remove it

Researched 2026-11-18 (WP8). Labels: VERIFIED, UNCONFIRMED, NEEDS-YOU. Nothing was changed on Netlify or in the repo.

## What visitors see

A small dark pill reading **Powered by Netlify** in the bottom-right corner of every page. Clicking it opens a card inviting the visitor to "Build your own site with Netlify", with a "Hide this badge" link.

## The cause (VERIFIED): a Netlify project setting, not the repo

1. **Official documentation.** https://docs.netlify.com/manage/projects/powered-by-netlify-badge/ (read 2026-11-18) says the badge appears on public projects that have it switched on, bottom-right on every page. Defaults:
   - Free plan (legacy or credit-based) projects **created on or after 2026-08-19: badge on**.
   - Free plan projects created before 2026-08-19: off.
   - Credit-based Personal and Pro: off by default, can be turned on.
   - Enterprise: not available.
   Netlify "injects the script at the edge, so your source, build, and dependencies are unchanged." It makes no network requests, sets no cookies, and renders in an isolated frame so site CSS cannot style or hide it. The changelog (https://www.netlify.com/changelog/2026-08-19-pre-launch-toolbar-and-powered-by-netlify-badge/) says the same and notes a gradual rollout.
2. **The live page.** `https://www.pawsandpassage.com` (fetched 2026-11-18) ends with this tag **after** the closing `</html>`, which is not in the repo's output:
   `<script async src="/.netlify/scripts/hud?variant=public" data-nf-variant="public" data-netlify-site-id="3c4975ea-d48f-4d8a-8736-2a92a614ad17" data-app-host="app.netlify.com" data-account-tier="personal"></script>`
   The file `/.netlify/scripts/hud` is served by Netlify itself and its first comment reads "Netlify HUD — the badge and owner toolbar Netlify injects on published sites." The site ID is public page-source data, not a secret.
3. **The repo is not the source.** Searches of `src/`, `plugins/`, `scripts/`, `public/`, `vite.config.ts`, `netlify.toml` and `package.json` found no badge, HUD, `netlify` script tag or related setting. The Lovable config package (`node_modules/@lovable.dev/vite-tanstack-config/dist/index.js`) contains no HTML or script injection (see `docs/COSTS-AND-ACCOUNTS.md` section 3). So **no file or line in the repo needs to change**, and the badge cannot be removed from code. (The only related repo line is the comment at `src/routes/__root.tsx:125`, about Netlify adding a comment to `<head>`; that is a different injection and is already handled.)
4. **Is it the Drawer or Collaborator toolbar?** No. The same Netlify script has a second variant, `owner-private`, which is a toolbar shown to the owner on a **private** project ("Pre-launch tools"). The live site serves the `public` variant, the badge, so the site is public (good). The changelog says the pre-launch toolbar needs a credit-based plan.

One oddity, UNCONFIRMED: the script is stamped `data-account-tier="personal"`, while the repo's records say the Netlify plan is Free. Per the documented defaults the badge on a new Free project is expected. Check the plan name in Netlify (N4) and record it in `docs/OPERATIONS-RECORD.md`.

## Exact removal steps (NEEDS-YOU N4; optional)

1. Dashboard: https://app.netlify.com , sign in as the site owner.
2. Open the site, then **Project configuration > General > Powered by Netlify badge**.
3. Switch it **off** and save. Per Netlify the change "takes effect on the next request, so no redeploy is needed" and applies only to this project.
4. Cost: $0 if the switch is available. Netlify says "If the setting is locked on your plan, upgrading to Personal or Pro lets you turn it off." So on a locked Free project the removal costs $9 a month (Personal, https://www.netlify.com/pricing/), $108 a year. For a pre-revenue site that is not recommended; accepting the badge is the cheaper choice.
5. Confirm: open the site in a private browser window (a visitor's "Hide this badge" is stored per browser and lapses after about a week, so test in a clean window) and the pill is gone from the bottom-right corner.

Notes:
- A visitor can already hide it for themselves; that does not remove it for others.
- Do not try to hide it with CSS or script: it lives in an isolated frame and Netlify's page says site CSS cannot affect it.
- A Content-Security-Policy whose `script-src` lacks `'unsafe-inline'` would stop the badge rendering (Netlify's note), but this site needs inline scripts (Google Analytics start-up, page hydration), so that is not a usable fix. The report-only policy proposed in `docs/SECURITY-AND-RECOVERY.md` keeps `'unsafe-inline'` and so will not hide it.
- Whether the badge counts against any Netlify credit: not stated on the page (UNCONFIRMED); it makes no network requests.
- A buyer who moves the site to their own Netlify team gets that team's own default for the new project, and should repeat these steps.
