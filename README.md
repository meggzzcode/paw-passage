# Paws & Passage: The Adventure Passport

The Adventure Passport is a collectible, self-paced set of little adventures to share with a dog. Visitors try free sample adventures with no account. A one-time purchase unlocks a much larger, protected library, progress that syncs across devices, and extra keepsakes. There are no subscriptions, no AI APIs and no accounts for the free experience.

This repository is **public**. It holds the website, the free adventures, the engine and the server code. It does **not** hold any secret or customer data. By the owner's decision (2026-11-26) it holds the premium library in `content/premium/` (one JSON file per adventure) while still public; the paid library is protected only once the repository is made private (see `docs/PREMIUM-CONTENT-WORKFLOW.md`).

## Run it

Requires Node 22 or newer.

```bash
npm ci               # install exactly what package-lock.json says
npm run dev          # local dev server (Vite)
npm test             # vitest run (all tests, once)
npm run lint         # eslint .
npx tsc --noEmit     # type check
npm run build        # production build (output in .output/)
node scripts/test-netlify-ignore.mjs   # regression test for the Netlify build-skip rule
```

`npm run format` rewrites files with Prettier; `npx prettier --check <files>` only checks. CI (`.github/workflows/ci.yml`) runs `npm ci`, `tsc`, `lint`, `vitest`, the Netlify-ignore test and the build on every pull request and every push to `main`.

## Structure

| Path                             | What lives there                                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/`                       | All public content, edited in Pages CMS: `adventures/*.yml` (free only), `collections.yml`, `stamps.yml`, `achievements.yml`, `guides/*.md`, `products.yml`, `affiliates.yml`, `packing.yml`, `settings.yml` |
| `.pages.yml`                     | Pages CMS configuration (the forms for the files above)                                                                                                                                                      |
| `src/passport/`                  | Product logic with no UI: adventure schema v2, eligibility and ranking engine, Save v2 and merge rules, local store, keepsake renderer                                                                       |
| `src/server/passport/`           | Server logic with no Netlify imports in the core: HTTP handler, checkout provider interface, session, stores                                                                                                 |
| `netlify/functions/api.ts`       | The single Netlify Function that serves every `/api/*` route                                                                                                                                                 |
| `src/routes/`                    | TanStack Start file-based routes (`/`, `/discover`, `/collections`, `/passport`, `/unlock`, `/restore-access`, guides, gear, packing list, trust pages)                                                      |
| `src/components/`, `src/design/` | UI components and the design system CSS                                                                                                                                                                      |
| `plugins/content.ts`             | Build step that validates `content/` and fails the build with a file and field name on any mistake                                                                                                           |
| `scripts/`                       | Owner and CI scripts (premium import and export, build-skip test, post-deploy check, IndexNow)                                                                                                               |
| `docs/`                          | The documents listed below                                                                                                                                                                                   |

## Where content lives

- **Free adventures, collections, stamps, achievements, guides, products, affiliate links and site settings:** plain files under `content/`, edited through Pages CMS or directly in git. A build validates every file.
- **Premium adventures:** the authoring files are `content/premium/<id>.json` in this repository (owner's decision, 2026-11-26; the repository is still PUBLIC, so the paid library is protected only once it is private). The website build never reads that folder. The live copy is in Netlify Blobs (store `premium-<env>`), loaded by an owner-only script (`premium-import.mjs --dir content/premium`), and delivered only by the server to a signed-in, entitled session. The browser bundle and public files never contain them. Tests use a clearly marked synthetic fixture (`src/passport/fixtures/premium.synthetic.ts`).
- **Customer progress:** Netlify Blobs (store `customers-<env>`), keyed by a random customer id. Photos are never stored anywhere: keepsakes are drawn on the device.

## Rules for contributors

- Never commit secrets or customer data. Premium text belongs only in `content/premium/` (see above); never in `src/`, `public/`, `content/adventures/` or docs. `/premium-content/` and `*.premium.json` stay git-ignored for exports.
- Eligibility is a hard rule: an unknown fact about a dog is never treated as safe.
- Affiliate links are limited to verified Amazon products listed in `content/affiliates.yml`.
- See `AGENTS.md` for the short list used by coding agents.

## Documents

| Document                                                             | Subject                                              |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| [docs/PRODUCT-SPEC.md](docs/PRODUCT-SPEC.md)                         | What the product is and how it behaves               |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)                       | Tokens, type, components, motion, accessibility      |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                         | Code structure, data, server, security               |
| [docs/DECISIONS.md](docs/DECISIONS.md)                               | Current architecture and commercial decisions        |
| [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)                       | How to write an adventure                            |
| [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md)                     | Editorial review of the free library                 |
| [docs/OPERATIONS.md](docs/OPERATIONS.md)                             | Maintenance, CMS workflow, premium runbook, costs    |
| [docs/PREMIUM-CONTENT-WORKFLOW.md](docs/PREMIUM-CONTENT-WORKFLOW.md) | Editing, importing and backing up the paid library   |
| [docs/OWNERSHIP-TRANSFER.md](docs/OWNERSHIP-TRANSFER.md)             | Selling the business: accounts, rotation, checklists |
| [docs/QA-REPORT.md](docs/QA-REPORT.md)                               | Verified test results and what is not tested         |
| [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md)                 | Launch gates and verdict                             |
| [docs/COWORK-HANDOFF.md](docs/COWORK-HANDOFF.md)                     | External tasks only the owner can do                 |
| [docs/FLIP-HANDOFF.md](docs/FLIP-HANDOFF.md)                         | Transfer plan for a sale                             |
