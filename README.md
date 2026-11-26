# Paws & Passage: The Adventure Passport

The Adventure Passport is a collectible, self-paced set of little adventures to share with a dog. Every visitor can get one complete, personalized introductory adventure free, with no account, email or card, and can browse 50 selected previews of the larger collection. One payment of $19.99, yours to keep, with no subscription and no renewals, unlocks the full library (113 published adventures in 25 collections: a free pool of 14 plus 99 premium), personalized keepsake creation from your own photo, and progress that follows your purchase code to other devices. There are no subscriptions, no AI APIs and no accounts for the free experience. Counts are from `node scripts/library-stats.mjs`; re-run it before quoting them.

This repository is **public**. It holds the website, the free adventures, the engine and the server code. It does **not** hold any secret or customer data. It does **not** track the premium adventure text any more (owner directive 2026-11-26): the files were removed from the source tree; the authoritative protected package is kept outside the repository.

**Status.** The build is complete; launch needs external setup (Netlify preview, real devices, Gumroad, owner decisions). Start with `docs/COWORK-HANDOFF.md` (the one consolidated task list) and `docs/LAUNCH-CHECKLIST.md`. The PWA and push notifications are paused. Results of the final code run are recorded in the **Last verified run** section of `docs/QA-REPORT.md`; no test count is stated anywhere else.

## Run it

Requires Node 22 or newer.

```bash
npm ci               # install exactly what package-lock.json says
npm run dev          # local dev server (Vite)
npm test             # vitest run
npm run lint         # eslint .
npx tsc --noEmit     # type check
NITRO_PRESET=netlify npm run build   # production build for Netlify (static files in dist/, server in .netlify/); netlify.toml sets the preset on Netlify
node scripts/test-netlify-ignore.mjs   # regression test for the Netlify build-skip rule
```

`npm run format` rewrites files with Prettier; `npx prettier --check <files>` only checks. CI (`.github/workflows/ci.yml`) runs `npm ci`, `tsc`, `lint`, `vitest`, the Netlify-ignore test and the build on every pull request and every push to `main`.

## Structure

| Path                             | What lives there                                                                                                                                                                                                                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/`                       | All public content, edited in Pages CMS: `adventures/*.yml` (the 14 free adventures), `collections.yml`, `stamps.yml`, `achievements.yml`, `journal/*.md` (ten Journal articles), `guides/*.md`, `products.yml`, `affiliates.yml`, `packing.yml`, `settings.yml`; plus `premium/` (see below, never read by the build) |
| `.pages.yml`                     | Pages CMS configuration (the forms for the files above)                                                                                                                                                                                                                                                                |
| `src/passport/`                  | Product logic with no UI: adventure schema v2, eligibility and ranking engine, Save v2 and merge rules, local store, keepsake renderer                                                                                                                                                                                 |
| `src/server/passport/`           | Server logic with no Netlify imports in the core: HTTP handler, checkout provider interface, session, stores                                                                                                                                                                                                           |
| `netlify/functions/api.ts`       | The single Netlify Function that serves every `/api/*` route (`push-deliver.ts` has no schedule while push is paused)                                                                                                                                                                                                  |
| `src/routes/`                    | TanStack Start file-based routes (`/`, `/discover`, `/previews`, `/collections`, `/passport`, `/unlock`, `/faq`, `/restore-access`, `/journal`, the hub `/things-to-do-with-your-dog`, guides, gear, packing list, trust pages)                                                                                        |
| `src/components/`, `src/design/` | UI components and the design system CSS                                                                                                                                                                                                                                                                                |
| `plugins/content.ts`             | Build step that validates `content/` and fails the build with a file and field name on any mistake                                                                                                                                                                                                                     |
| `scripts/`                       | Owner and CI scripts (premium import, export and package, library stats, cost model, preview smoke test, leak check, build-skip test, post-deploy check, IndexNow)                                                                                                                                                     |
| `docs/`                          | The documents listed below                                                                                                                                                                                                                                                                                             |
| `marketing/`                     | Pin and owner-package build scripts (generated images are written outside the repository)                                                                                                                                                                                                                              |

## Where content lives

- **Free adventures, collections, stamps, achievements, guides, products, affiliate links and site settings:** plain files under `content/`, edited through Pages CMS or directly in git. A build validates every file.
- **Premium adventures:** the text is NOT tracked in this repository (`content/premium/*.json` is git-ignored; `content/premium/README.md` explains how to restore a local working copy). The authoritative protected package is outside the repository (`docs/PREMIUM-CONTENT-WORKFLOW.md`, section 0a). The website build never reads that folder. The live copy is in Netlify Blobs (store `premium-<env>`), loaded by an owner-only script (`PREMIUM_DIR=<package adventures folder> node scripts/premium-import.mjs`, or `--dir <folder>`), and delivered only by the server to a signed-in, entitled session. The browser bundle and public files never contain them. Tests use a clearly marked synthetic fixture (`src/passport/fixtures/premium.synthetic.ts`). The Pages CMS premium form is OFF by default.
- **Customer progress:** Netlify Blobs (store `customers-<env>`), keyed by a random customer id. Photos are never stored anywhere: keepsakes are drawn on the device.

## Rules for contributors

- Never commit secrets or customer data. Premium text belongs only in the protected package (and an untracked local working copy); never add any of it to `src/`, `public/`, `content/`, tests or docs (a test fails if a premium JSON file is tracked). `/premium-package/` and `*.premium.json` stay git-ignored for exports.
- Eligibility is a hard rule: an unknown fact about a dog is never treated as safe.
- Affiliate links are limited to verified Amazon products listed in `content/affiliates.yml`.
- See `AGENTS.md` for the short list used by coding agents.

## Documents

| Document                                                                                                                       | Subject                                                                |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [docs/COWORK-HANDOFF.md](docs/COWORK-HANDOFF.md)                                                                               | The one consolidated list of external tasks, owner decisions, blockers |
| [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md)                                                                           | Launch gates and verdict                                               |
| [docs/LAUNCH-READINESS.md](docs/LAUNCH-READINESS.md)                                                                           | What is verified, what blocks launch                                   |
| [docs/QA-REPORT.md](docs/QA-REPORT.md)                                                                                         | What is and is not tested; the Last verified run table                 |
| [docs/PRODUCT-SPEC.md](docs/PRODUCT-SPEC.md)                                                                                   | What the product is and how it behaves                                 |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)                                                                                 | Tokens, type, components, motion, accessibility                        |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                                                                                   | Code structure, data, server, security                                 |
| [docs/DECISIONS.md](docs/DECISIONS.md)                                                                                         | Current architecture and commercial decisions                          |
| [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)                                                                                 | How to write an adventure                                              |
| [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md)                                                                               | Editorial review of the free pool                                      |
| [docs/LIBRARY-INVENTORY.md](docs/LIBRARY-INVENTORY.md)                                                                         | Reproducible library counts and coverage                               |
| [docs/INTRO-AUDIT.md](docs/INTRO-AUDIT.md)                                                                                     | Free visitor journey audit over the free pool                          |
| [docs/OPERATIONS.md](docs/OPERATIONS.md)                                                                                       | Maintenance, CMS workflow, premium runbook                             |
| [docs/PREMIUM-CONTENT-WORKFLOW.md](docs/PREMIUM-CONTENT-WORKFLOW.md)                                                           | Editing, packaging, importing and backing up the paid library          |
| [docs/PREMIUM-INTEGRATION-TESTS.md](docs/PREMIUM-INTEGRATION-TESTS.md)                                                         | Premium end-to-end tests and the preview smoke script                  |
| [docs/NETLIFY-PREVIEW.md](docs/NETLIFY-PREVIEW.md)                                                                             | Preview deploy procedure and checks                                    |
| [docs/OPERATING-COSTS.md](docs/OPERATING-COSTS.md)                                                                             | Netlify and Gumroad cost model                                         |
| [docs/SECURITY-REVIEW.md](docs/SECURITY-REVIEW.md)                                                                             | Security review (code review plus tests, not penetration testing)      |
| [docs/POLICIES-REVIEW.md](docs/POLICIES-REVIEW.md)                                                                             | Privacy, terms, refund and messaging audit                             |
| [docs/JOURNAL.md](docs/JOURNAL.md)                                                                                             | The Adventure Journal (ten articles)                                   |
| [docs/SEO-AUDIT.md](docs/SEO-AUDIT.md), [docs/SEO-RESEARCH.md](docs/SEO-RESEARCH.md)                                           | Search audit and research                                              |
| [docs/MARKETING.md](docs/MARKETING.md)                                                                                         | Marketing plan, pins, attribution limits                               |
| [docs/EMAIL-NUDGES.md](docs/EMAIL-NUDGES.md)                                                                                   | Buyers-only email workflow through Gumroad                             |
| [docs/IMAGE-CREDITS.md](docs/IMAGE-CREDITS.md)                                                                                 | Sources and licenses of photos                                         |
| [docs/PRINTABLES.md](docs/PRINTABLES.md)                                                                                       | Printables                                                             |
| [docs/PWA.md](docs/PWA.md), [docs/PWA-DEVICE-TEST.md](docs/PWA-DEVICE-TEST.md), [docs/NOTIFICATIONS.md](docs/NOTIFICATIONS.md) | PWA and push (paused)                                                  |
| [docs/TRANSFER-INVENTORY.md](docs/TRANSFER-INVENTORY.md)                                                                       | Assets, transfer limits, secrets (names only), recovery                |
