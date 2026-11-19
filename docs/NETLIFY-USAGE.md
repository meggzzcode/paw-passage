# Reducing Netlify usage (2026-11-19)

Goal: stay inside the Netlify Free plan (300 credits a month, hard limit; read in docs/COSTS-AND-ACCOUNTS.md, re-verify on netlify.com/pricing before relying on it).

## What costs credits (from docs/COSTS-AND-ACCOUNTS.md section 1a, read 2026-11-18)
- Each successful **production deploy**: 15 credits. Deploy previews, branch deploys and failed deploys: 0.
- Bandwidth: 20 credits per GB. Web requests: 2 credits per 10,000. Functions: 10 credits per GB-hour.
- Every commit to `main` is a production deploy, including documentation-only commits and every Pages CMS save.

## Changes made in the repo (branch claude/netlify-usage, not merged)
1. `netlify.toml` now has an `ignore` rule: a push to `main` that only touches `docs/`, `scripts/`, `.github/`, `*.md`, tests or `.pages.yml` **skips the build and costs 0 credits**. Pushes that touch `content/`, `data/`, `public/`, `src/` (except `src/test`), `plugins/`, `package*.json`, `vite.config.ts`, `tsconfig.json` or `netlify.toml` still deploy.
   - Test it locally before merging: `git diff --quiet HEAD~1 HEAD -- content data public src plugins package.json package-lock.json vite.config.ts tsconfig.json netlify.toml ':(exclude)src/test'; echo $?` prints 0 (skip) for a docs-only commit and 1 (build) otherwise.
   - If you add a new top-level folder the build reads, add it to the `ignore` path list or its changes will not deploy.

## Owner actions in the Netlify dashboard (not done; needs your login)
- Site configuration, Build and deploy, **Continuous deployment**: leave **Auto publishing** on for `main`, but turn **deploy previews** and **branch deploys** off unless you use them (they cost 0 credits but add noise and build time).
- Notifications: add a free GitHub commit-status alert for failed deploys so a failure is noticed (email alerts need a paid plan).
- Check **Billing and usage** once a month; note credits used per cycle in the tracker.
- Batch Pages CMS edits: each save commits to `main`; make several changes, then save once or publish them together. 20 content deploys a month would use the whole allowance.

## Bandwidth
- Photos are the main bytes. The repo already serves resized variants (`-800`, `-card`); keep new images under about 200 KB and run `scripts/optimize-images.py`.
- Long-lived caching for hashed assets is already set in `netlify.toml`.
- Avoid large downloads (PDFs, videos) on the site; host them elsewhere or not at all.

## Not changed
- No plan change, no cancellation, no purchase. If credits still run out, the options are paying for a Netlify plan or moving to another static host: both are owner decisions.
