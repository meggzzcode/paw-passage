# QA report

This document records what kinds of checking exist, what has never been done, and where the result of the final run goes. It states **no test count and no "all tests pass" claim**. Counts written in earlier versions of this file or in any report are out of date and must not be reused. For the status of the final commit, see the **Last verified run** section.

## Automated checks (commands)

| Command                                | What it proves                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                     | The code type checks.                                                                                                                           |
| `npx eslint .`                         | The code passes lint rules.                                                                                                                     |
| `npx vitest run`                       | The test suite (unit, component and API tests with in-memory stores and fake providers) passes.                                                 |
| `NITRO_PRESET=netlify npx vite build`  | A clean production build succeeds. Static files go to `dist/`, server-rendered pages to `.netlify/functions-internal/server`.                   |
| `node scripts/test-netlify-ignore.mjs` | The Netlify build-skip rule skips docs-only pushes and builds everything else.                                                                  |
| `node scripts/check-leaks.mjs dist`    | The build output carries no premium text markers (run after the build; it cannot see the owner's real private text, only that no record ships). |

### Premium-protection commands (owner machine, need `PREMIUM_DIR`)

Premium text is not tracked in the repository. The default suite is green without it; checks against the real library are separate and report SKIPPED with a visible reason when `PREMIUM_DIR` is unset (`PREMIUM-INTEGRATION-TESTS.md`, "Owner-machine checks").

| Command                                                                                                                                                | What it proves                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `npx vitest run src/test/premium-not-tracked.test.ts`                                                                                                  | No `content/premium/*.json` is tracked in git; `.gitignore` carries the rule. |
| `PREMIUM_DIR=<package>/adventures npx vitest run src/test/premium-owner-checks.test.ts src/test/library-inventory.test.ts src/test/unlock-v6.test.tsx` | The owner-machine checks run instead of skipping.                             |
| `PREMIUM_DIR=<package>/adventures node scripts/validate-journal.mjs`                                                                                   | Journal sentence-overlap rule against the real premium text.                  |
| `node scripts/check-leaks.mjs dist --premium-dir <package>/adventures`                                                                                 | The build carries no real premium fragment.                                   |
| `PREMIUM_DIR=<package>/adventures node scripts/library-stats.mjs --md`                                                                                 | Full library inventory (without `PREMIUM_DIR`: labelled free-only mode).      |

## What the automated tests cover

Content and schema validation (adventures, collections, stamps, achievements, guides, Journal, products, packing); the eligibility and ranking engine; the free-first journey (quiz with 8 default and at most 10 steps, free starter, reveal) and a 17-profile audit over the real free pool (`INTRO-AUDIT.md`); discovery screens; Save v2 merge, migration and limits; the local store; custom collections; keepsake families, artwork, the premium-only gate and the photo path (in memory); the server API with an in-memory store and a fake provider (activation, restore, refund, dispute, revoke, outage, CSRF, origin, rate limit, body size, conflict retry, export, delete, test-provider exclusion in production); premium end to end over the real handler with the test provider (`PREMIUM-INTEGRATION-TESTS.md`); public previews and the leak guards; library inventory; security (`SECURITY-REVIEW.md`); security headers; policies and pay-once copy guards; Netlify configuration (redirect rules, env inventory); Pages CMS configuration structure and the premium switch; SEO and Journal content; PWA and notification code (paused); affiliate link rules; disclosure labels; accessibility structure checks in component tests; trust pages.

These are code checks against fakes. None of them is a live-service, device or browser result.

## NOT tested

None of these has been done, so none is claimed. Each has a task in `COWORK-HANDOFF.md`.

- **Real devices (C2, C3, C6).** No iPhone Safari or Android Chrome run; no real touch, camera, photo-picker, share-sheet or download behavior.
- **Browsers (C1, C4).** Component tests run in jsdom, not in real browsers. No cross-browser, print or screen-reader testing. Contrast ratios in the design documents are calculations, not tool-measured.
- **Gumroad (A7, E4 to E7).** No request has ever reached Gumroad. The adapter's URL, parameters and response fields are **UNVERIFIED**.
- **Netlify Blobs (A5, B7, B8).** All server tests use an in-memory store. Strong consistency, etag compare-and-set, persistence, limits and metering against the real service are untested. The import and export scripts have not been run against a real store.
- **Live or preview deploy (B3 to B6).** Nothing has been deployed from this branch. A clean local build with the Netlify preset succeeds, but that `/api/*` reaches the Function, that redirects and headers are applied by Netlify, deploy-context values, and the `Cache-Control` that wins on `/api/previews` are untested.
- **Pages CMS (C9).** The edit, save and publish loop is not verified end to end; whether "Add new" lets you type an adventure id is unknown.
- **Google Analytics (C11).** Event delivery and parameter contents are not verified in a real property.
- **PWA and push (C10).** Paused; nothing is tested on devices.
- **Load, abuse and penetration testing.** None. Rate limiting is per function instance only. The security review is a code review plus unit tests, not penetration testing.
- **Content with real dogs and owners.** None. Review scores are editorial judgments.

## Known gaps (none are launch-blocking repository defects)

1. **Content coverage.** The free pool of 14 has only two adventures that suit children, so some restrictive combinations (for example puppy plus adult plus senior plus children plus no car) return no free result and the page says so plainly. No adventures were added (scope freeze). Details in `INTRO-AUDIT.md` and `LIBRARY-INVENTORY.md`.
2. **Thin collections** (after-hours, birthday-and-gotcha-day, adventures-without-spending, apartment-adventures, the-gentle-soul) and the family and two-dog tags: do not advertise those audiences yet (D14).
3. **Missing sign-out route** (low). Security headers: `X-Frame-Options` and an enforced Content-Security-Policy are not sent on purpose (a report-only policy is).
4. **Dark mode** tokens exist but nothing sets the `dark` class (UNVERIFIED by search of `src/`); not a launch requirement.
5. **Provider contract and deploy path** are unverified as listed above.
6. **Lint warnings.** The lint run may report `react-refresh/only-export-components` warnings (development hot-reload hint only). Read the actual count from the final run.

## Last verified run

Fill this table for the exact launch commit. Do not copy numbers from any earlier document, report or message. A run on any other commit does not count.

| Field  | Value                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| COMMIT | `00eaf25aa145c24c4e5071609767af7f33127ac6` (every check below was run on this commit with a clean working tree; the next commit changes only this file) |
| DATE   | `2026-11-26`                                                                                                                                            |
| NODE   | `v22 (container default)`; Vite dev notices about `vite-tsconfig-paths` and the experimental `EnvHttpProxyAgent` appear in logs and are harmless        |

| Command                                                                                                           | Result                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npx tsc --noEmit`                                                                                                | 0 errors                                                                                                                                                                       |
| `npx eslint .` (run as `npx eslint src plugins scripts netlify`; the bare `.` form exceeded the 120 s tool limit) | 0 errors, 41 warnings (existing `react-refresh/only-export-components` and similar)                                                                                            |
| `npx vitest run`                                                                                                  | 117 files, 2018 tests, all passed, no exclusions (49 s)                                                                                                                        |
| `NITRO_PRESET=netlify npx vite build`                                                                             | exit 0 after `rm -rf dist .netlify .output`; outputs `dist/` and `.netlify/functions-internal`; no `.map` files                                                                |
| `node scripts/test-netlify-ignore.mjs`                                                                            | All rows pass                                                                                                                                                                  |
| `node scripts/check-leaks.mjs dist` and `.netlify`                                                                | passed (130 and 143 files, 22 markers, no premium instructions); an extra scan of 981 real premium text fragments from `content/premium` found 0 hits in `dist` and `.netlify` |

### Other checks run on the same commit

| Check                                                                                                                                      | Result                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `node scripts/validate-journal.mjs`                                                                                                        | `journal content OK` (ten articles, word counts, banned phrases, premium sentence overlap)                                    |
| `node scripts/premium-import.mjs --dir content/premium` (dry run, nothing written)                                                         | Validated 99 premium adventures; 50 showcase previews; 115 published across 25 collections (116 with the staged private card) |
| `node scripts/library-stats.mjs --md`                                                                                                      | 115 adventures (16 free pool, 99 premium; 116 with the staged private card), 117 keepsake themes, 25 collections              |
| Entitlement, premium integration, photo-editor gating and security tests (`netlify-env`, `premium-e2e`, `keepsake-gating`, `security-api`) | 4 files, 88 tests passed (also part of the full run)                                                                          |
| Secret scan of tracked text files (patterns for live keys, private keys, tokens)                                                           | no matches. This is a pattern scan of current files, not a git-history scan (gitleaks over history remains a Cowork task)     |
| `npx prettier --check` (src, docs, content, scripts, netlify, plugins, README, AGENTS, `.pages.yml`)                                       | 7 warnings, all in older `content/guides/*.md` files (formatting only); `netlify.toml` has no prettier parser                 |

Warnings are reported separately from errors above: 0 errors in tsc and eslint; 41 eslint warnings; 7 prettier formatting warnings in legacy guide files.
