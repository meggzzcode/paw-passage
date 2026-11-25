# Repository cleanup notes (hygiene review, 2026-11-25)

Targeted review, not an overhaul. Buyer-facing entry points are unchanged: `docs/BUYER_OVERVIEW.md` (one page), `BUYER_HANDOVER.md` (repo root, what to do after the sale), `docs/SALE_RELEASE_STATUS.md` (what is released and what is still pending).

Tools: `knip 6.48` (offline from cache), `eslint`, `prettier --check`, `tsc`, `vitest`, `npm audit`, `npm ci` in a clean copy, grep across src, tests, scripts, plugins, content, `.pages.yml`, CI and docs.

## 1. Removed (all provably unused)

| Item | Proof of non-use |
|---|---|
| `src/lib/pack-images.ts`, `src/content/pack-photos.ts` | Imported only by each other; no route, component, test or script uses `packPhoto`/`packPhotos`. knip: unused files. |
| `src/assets/pack-*.jpg` (14 files) | Only loaded by the `import.meta.glob("../assets/pack-*.jpg")` inside the removed `pack-images.ts`. |
| `src/lib/pet-fee-calc.ts`, `src/test/pet-fee-calc.test.ts` | Remnant of the retired fee calculator: imported only by its own test. |
| `scripts/__pycache__/make-share-images.cpython-313.pyc` | Tracked bytecode. `__pycache__/` and `*.pyc` are now in `.gitignore`. |
| `src/components/ui/*` (46 shadcn files; their deletion was swept into commit 9e2ede9 by a concurrent worker), `src/hooks/use-mobile.tsx` | Lovable scaffolding; no file outside `ui/` imports any of them (knip, grep for `components/ui`, `use-mobile`). |
| 38 npm dependencies: `@hookform/resolvers`, 27 `@radix-ui/*`, `class-variance-authority`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, `sonner`, `vaul` | Used only by the removed `ui/` files (grep over src, plugins, scripts, configs). Lockfiles regenerated (`package-lock.json` via npm, `bun.lock` via `bun install --lockfile-only`). |

Added instead: `@testing-library/dom` (devDependency). It is a peer of `@testing-library/react` that was only present by accident (hoisted in the bun `node_modules`). On a clean `npm ci`, 3 packing test files failed with "Cannot find module '@testing-library/dom'". Fixed and verified in a clean copy (61 files, 783 tests pass).

Docs touched only to fix references made stale: `docs/BUYER_ASSET_INVENTORY.md`, `docs/TRANSFER_CHECKLIST.md`, `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` (pack-photos mentions removed; `src/assets` count 211 to 196 JPG). `.gitignore` gained `__pycache__/`, `*.pyc`, `.env`, `.env.*`, `coverage`.

## 2. Kept deliberately

- Redirect shims `src/routes/tools.pet-cost-check.tsx`, `tools.cost-calculator.tsx`, `tools.host-questions.tsx` (301 to `/tools`) and the 10 `netlify.toml` guide redirects: live inbound links; asserted by tests and `scripts/verify-site.mjs`. No component, copy, analytics event or sitemap entry remains for the retired tools (tests assert their absence).
- `STAYS_REQUIRE_AFFILIATE_LINK` (`src/content/publish-rule.ts`): constant is `true`, so the `!STAYS_REQUIRE_AFFILIATE_LINK` branch in `src/content/stays/index.ts` is unreachable in practice, but the flag is documented in AGENTS.md and asserted by `stay-earn-rule.test.ts`. Both `affiliate-only` and `public-sources` modes are live code paths and documented; untouched.
- All 30 `scripts/*`: each is referenced by package.json, CI, README, docs or another script. One-off migrations kept as history: `convert-guide-to-md.ts`, `fix-citation-artifacts.mjs`, `migrate-citations.mjs`, `remove-citation-numbers.mjs`, `scripts/perf/*`, `scripts/qa/*` (candidates for the archive plan below, not removed).
- Lovable integration: `.lovable/`, `components.json`, `@lovable.dev/vite-tanstack-config`, `vite.config.ts` comments, AGENTS.md Lovable block, `bunfig.toml` (bun lockfile) all stay. `@tanstack/router-plugin` is flagged by knip but is a peer of the Lovable config: kept.
- `public/pins/` (29) and `public/share*/` (41 images) are referenced by `ArticleActions.tsx`, `seo.ts`, `town-reads.ts`, tests and the make-*-images scripts. `public/c0207...txt` is the IndexNow key file.
- All `-800`, `-card`, `-tile` image variants in `src/assets`: loaded by the glob in `src/lib/images.ts` or imported by name. No other unused image found.
- No content (guides, stays, products, places) was touched.

## 3. Findings

### P0 must-fix
None found. Fresh `npm ci` + `npm run build` succeed; `npm audit` (with and without dev) reports 0 vulnerabilities.

### P1 should-fix
1. **Do not run `npm run format`**: `prettier --write .` would rewrite 755 files (645 in `docs/`, 101 in `content/`, plus AGENTS.md, HANDOVER.md, BUYER_HANDOVER.md, `.pages.yml`, `src/styles.css`, `gear-card.css`). All `.ts/.tsx` code is prettier-clean. Suggest adding `docs/` and `content/` to `.prettierignore`, or scoping the script to `src plugins scripts`.
2. **Hard-coded counts in tests will rot when content changes**: `78 listed / 23 indexable / 55 noindex / 83 records` (`stay-mode-public-sources.test.ts`, `stay-directory-mode.test.ts`, `stay-indexing`), `38 verified managers` (`dog-accepted.test.ts`), `442` words (`article-ux.test.tsx`), `10` legacy gear slugs (`gear-products.test.ts`). Fine today; the buyer adding a stay link or editing the affected guide will break them. Documented here, not changed (not trivial).
3. **Lockfile and package manager**: `package-lock.json` is canonical for Netlify (`npm run build`; `.npmrc` sets `legacy-peer-deps=true`); `bun.lock` is kept in sync for Lovable/bun use. Both now match `package.json` (`npm ci --dry-run` clean, real `npm ci` clean). Tell the buyer to update both or pick one.
4. **Node version**: `netlify.toml` sets `NODE_VERSION = "22"`, CI uses 22, `engines` is `>=22` (accepts 24). There is no `.nvmrc`. If the Netlify log showed Node 24, the likely cause is a `NODE_VERSION` set in the Netlify UI (site environment variables can take precedence over `netlify.toml`) or a log from before the toml value was read: check Site settings, Environment variables. Recommendation: keep 22 (what CI and these results use), delete any UI override, and add an `.nvmrc` with `22`. Not changed (hosting setting).
5. **README says 319 checks for `verify-site.mjs`; the requested target was 321.** Run on a local build of this tree: 319 passed, 0 failed (matches README). If 321 is expected, 2 checks are missing from the script or the target came from a different content state.

### P2 optional
- 16 eslint warnings (all `react-refresh/only-export-components` in `src/components/packing/Shopping.tsx`, `site/ArticleActions.tsx`, `GearPicks.tsx`, `GearProductCard.tsx`, `Markdown.tsx`, `ProductSpecCard.tsx`, `routes/__root.tsx`). Errors: 0.
- knip unused exports (about 50 values and 12 types, e.g. `useCaseFor`, `stayFilledSections`, `MIN_*` constants in `publish-rule.ts`, `hasVerifiedStays`): many are exported for tests; left in place. Review list: run `bunx knip`.
- Quality scan: 0 TODO/FIXME/HACK, 0 `console.log`/`debugger`, 0 commented-out code blocks, no dev/test routes. `any`/ignore uses are all in tests (`meta-brands`, `packing-routing`, `gear-hub`, `pages-config`) plus 2 `@ts-expect-error` for an untyped `.mjs` import and 1 `exhaustive-deps` disable in `PackingPlanner.tsx`; none hide real errors.
- Seller identifiers (`node scripts/audit-seller-ids.mjs`): 5 remain, all in settings/content as designed (Amazon tag, GA4, Impact verification, Pinterest profile, plus 79 Vrbo deeplinks); nothing hard-coded in `src/`. Sitemap host in `public/robots.txt` and the IndexNow key file are domain-bound.
- No LICENSE file (report only; see `docs/TRANSFER_CHECKLIST.md` for the copyright assignment step).
- Build warning: `WARN inlineDynamicImports option is ignored because the codeSplitting option is specified` (comes from the Lovable/Nitro toolchain). Dev server notice: `vite-tsconfig-paths` is redundant with Vite 8 native `resolve.tsconfigPaths` (plugin is added by the Lovable config; do not edit).
- `bun run dev` fails to bind in IPv6-less sandboxes (`listen ::`); `vite dev --host 127.0.0.1` starts and serves `/` with 200.
- Stray `.wrangler/` and `.output/` directories exist locally but are gitignored (not committed).

## 4. Results

| Check | Result |
|---|---|
| `tsc --noEmit` | pass |
| `eslint . --quiet` | pass (0 errors; 16 warnings without `--quiet`) |
| `vitest run` (twice) | 61 files, 783 tests pass both times; no flaky tests; no `skip`/`todo`. Slowest: `stay-mode-public-sources` (about 40 s), `stay-indexing` (19 s), `packing-planner` (14 s), `rules` (12 s). Full suite about 75 s |
| `NITRO_PRESET=node-server vite build` | pass; with `NETLIFY=true npm run build` the `dist/` publish dir and `_headers`/`_redirects` are produced |
| `npm audit` / `npm audit --omit=dev` | 0 vulnerabilities |
| Client entry `index-*.js` | 380 kB (120 kB gzip); next: `site-*.js` 308 kB (65 kB gzip), `ProductSpecCard` 209 kB (64 kB gzip), `Markdown` 93 kB |
| `verify-site.mjs` on local node-server build | 319 passed, 0 failed |
| `test-netlify-ignore.mjs` | all rows pass |
| `gear-coverage-report.ts` | runs; output identical (65 active products, no gaps) |
| README commands | install, dev (with `--host 127.0.0.1`), test, build, lint, verify all run |

Repository size: 1658 tracked files before cleanup (git pack 2.8 MB); about 91 MB on disk of which `docs/` is 49 MB (39 MB in `docs/editorial/img` screenshots, largest 1.5 MB PNG) and `src/assets` about 28 MB. The 20 largest tracked files are all `docs/editorial/img/*.png` (460 KB to 1.5 MB).

## 5. Proposed doc consolidation (not performed)

`docs/` holds 919 files (185 at top level, 172 of them `.md`) in 10 subfolders: `editorial` 253, `review` 323, `flip` 41, `recovery` 33, `cowork` 20, `data` 19, `audit` 14, `buyer` 9, `products` 25, `research` 7. Most is working history (fact-checks, per-article claims and dossiers, SERP captures, QA screenshots).

Proposal:
1. Keep at top level (buyer path): `BUYER_OVERVIEW.md`, `SALE_RELEASE_STATUS.md`, `BUYER_ASSET_INVENTORY.md`, `BUYER_AFFILIATE_TRANSITION.md`, `BUYER_DUE_DILIGENCE_CHECKLIST.md`, `BUYER_WALKTHROUGH_SCRIPT.md`, `TRANSFER_CHECKLIST.md`, `OPERATIONS-HANDBOOK.md`, `SECURITY-AND-RECOVERY.md`, `ANALYTICS-SETUP.md`, `AFFILIATE-SETUP.md`, `EDITORIAL_STYLE_GUIDE.md`, `ROLLBACK.md`, plus `docs/buyer/`; root `README.md`, `BUYER_HANDOVER.md`, `HANDOVER.md`, `AGENTS.md`.
2. Move per-article working files into `docs/archive/` (still in git history): `CLAIMS-*`, `FACTCHECK-*`, `DOSSIER-*`, `ARTICLE-PRODUCT-REPORT-*`, `SERP-*`, `docs/review/`, `docs/editorial/img/` (39 MB; or drop from the sale tree and keep in a separate archive).
3. Move seller-side history (`flip/`, `cowork/`, `recovery/`, COWORK_*, `PRESALE_*`, `SEO_*`, `FINAL_*`) to `docs/archive/seller-history/`, keeping an index in `docs/buyer/TRANSFER_PACKAGE_INDEX.md`.
4. Before moving anything, grep for links (scripts and tests read some docs, for example `docs/PACKING_GEAR_COVERAGE.md` is written by a script).
5. Optional: remove one-off scripts (`migrate-citations.mjs`, `fix-citation-artifacts.mjs`, `remove-citation-numbers.mjs`, `convert-guide-to-md.ts`, `scripts/perf/*`, `scripts/qa/*`) after the buyer confirms they are not wanted tooling.
