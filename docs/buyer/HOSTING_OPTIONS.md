# Hosting options

Short version: the site does not depend on paid Lovable usage. Lovable was a design tool the seller used; it is not needed to build, host, publish or edit the site. We checked this on 2026-11-24 by installing and building a clean copy of the code with no Lovable account or settings; all builds succeeded. Details: `docs/HOSTING_PORTABILITY_REPORT.md`.

One honest note: the code uses a free, public, open-source (MIT) build-settings package whose name starts with `@lovable.dev`. It needs no login or payment. If Lovable ever removed it, a developer would swap it for standard Vite settings (a small, planned job).

## Option A: keep Netlify (recommended)

Netlify is the current host and its free plan covers a site of this size.

1. Create a free GitHub account and take over the code repository (the seller transfers it).
2. Create a free Netlify account, choose "Import from Git", pick the repository. The build settings are already in `netlify.toml`.
3. Add your domain in Netlify and point your domain registrar to it (guide: `docs/DNS-AND-TRANSFER.md`).
4. Every change to `main` rebuilds the site. Writers can edit articles through Pages CMS (free sign-in with GitHub), which saves to GitHub and triggers the same rebuild.

Before handover the seller disconnects Lovable's GitHub link so nothing from Lovable can push to your live branch.

## Option B: move elsewhere, including Lovable

- Any host that can run a Node 22 build and server rendering works (`bun install` then `NITRO_PRESET=node-server vite build` gives a plain Node server; other presets exist). Tested: Node build only.
- You would have to recreate what `netlify.toml` does: 11 permanent redirects for retired guide addresses (this protects old links and search rankings), long-lived caching on `/assets/*`, two security headers on static files, and the rule that skips builds for docs-only changes.
- Lovable hosting: its docs say it serves this kind of app with server rendering, but it needs a paid plan ($25/month Pro, $250/year) to use your own domain, does not read `netlify.toml`, and its docs do not describe redirects or custom headers. We did not test the site on Lovable hosting, so check a trial publish first. A Lovable project can only be moved to someone who is a member of the same workspace, so a buyer would normally receive the code from GitHub instead.

## Costs (US dollars, list prices)

| Item | Cost |
|---|---|
| Netlify Free (300 credits a month, hard limit, no charge) | $0. Paid plans start at $9/month if traffic outgrows it. |
| GitHub Free, Pages CMS | $0 (Pages CMS price not confirmed) |
| Domain renewal (Namecheap .com) | about $19.98 a year |
| Optional mailbox (Namecheap Private Email) | about $14.88 a year |
| Typical total | $19.98 to $34.86 a year (about $1.67 to $2.91 a month) |
| Lovable (not needed) | $0 Free plan; $25/month if you want your domain on Lovable hosting |

Free allowance: Netlify credits above. Paid requirement: a custom domain on Lovable. Usage-based: Netlify credits beyond the free 300 (bandwidth, deploys, requests) on a paid plan.
