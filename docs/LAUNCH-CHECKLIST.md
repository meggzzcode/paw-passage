# Launch checklist

A gate is **Pass** only when it was verified; otherwise **Not done** (a task is open), **Blocked** (waiting on an earlier external task) or **Defect**. Task ids (A1, B3 ...) are in `COWORK-HANDOFF.md`. Code-check results for the final commit belong in the **Last verified run** section of `QA-REPORT.md`; this file does not repeat counts.

## Verdict

Choose one:

- **READY**: every gate below passes.
- **BUILD COMPLETE — EXTERNAL SETUP REQUIRED**: everything in the code and content passes; only the tasks in `COWORK-HANDOFF.md` remain.
- **NOT READY**: at least one gate fails for a reason inside the repository.

**Current verdict: BUILD COMPLETE — EXTERNAL SETUP REQUIRED** (confirmed against commit 00eaf25 on 2026-11-26; see QA-REPORT.md, Last verified run). No repository defect is known. What remains is external: nothing has run on Netlify or Gumroad, no real device has been used, the premium library is not yet in any store, and several owner decisions are open (`COWORK-HANDOFF.md`, Owner decisions). Gift checkout, PWA install prompts and push notifications are optional and off; they do not block launch.

## Gates

| #   | Gate                                                                                                                           | Status                   | Evidence or task                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Type check, lint (no errors), tests, production build pass on the launch commit                                                | Not done                 | Fill the table in `QA-REPORT.md` (Last verified run) for the launch commit                                                 |
| 2   | Build-skip rule tested                                                                                                         | Not done                 | `node scripts/test-netlify-ignore.mjs`; record in Last verified run                                                        |
| 3   | Free experience works end to end with no account                                                                               | Not done on devices      | Automated tests only; C1 to C4                                                                                             |
| 4   | Eligibility: unknown is never safe, hard rules not overridable                                                                 | Pass (automated)         | Engine and discovery tests                                                                                                 |
| 5   | Photos never leave the device                                                                                                  | Pass (code and tests)    | `launch-static.test.ts`; verify in a browser network panel and with `exiftool` (C6)                                        |
| 6   | Premium text absent from the bundle and public files                                                                           | Not done on the build    | Build refuses `access: premium` in `content/adventures`; run `node scripts/check-leaks.mjs dist` on the launch build (B11) |
| 6a  | Premium text readable in the PUBLIC repository (`content/premium/`, owner decision)                                            | Open owner decision      | OD1: make the repository private, or knowingly accept. Authoritative protected package exists outside the repo (B1)        |
| 7   | Browser consumes the premium endpoint and syncs progress                                                                       | Not done (real services) | Wired and tested against fakes; verify on a preview (B8, C5, C7)                                                           |
| 8   | Gumroad license behavior verified from live documentation and a real key                                                       | Blocked                  | A7, E4                                                                                                                     |
| 9   | Gumroad seller account and draft product at $19.99                                                                             | Blocked                  | E1, E2 (owner, last)                                                                                                       |
| 10  | Purchase, restore and refund tested                                                                                            | Blocked                  | Fake-provider tests exist; real run is E5 to E7. A refund is noticed within about 24 hours (no webhook)                    |
| 11  | Environment variables set with correct scopes; test provider off in production                                                 | Blocked                  | B2, B6, F2                                                                                                                 |
| 12  | Preview deploy: pages load, `/api/*` reaches the Function, preview and production stores isolated                              | Blocked                  | B3 to B6                                                                                                                   |
| 13  | Blobs metering, persistence and consistency understood                                                                         | Blocked                  | A5                                                                                                                         |
| 14  | Premium import and export proven with synthetic data, then the real library imported to preview, then production and backed up | Blocked                  | B7, B8, F3, F4                                                                                                             |
| 15  | Netlify credits and auto-recharge reviewed; rollback deploy exists                                                             | Blocked                  | A1, A2, A3. Recovery is commit `2125a2a` plus a Netlify production rollback                                                |
| 16  | Real-device QA (iPhone Safari, Android Chrome)                                                                                 | Blocked                  | C2, C3, C6                                                                                                                 |
| 17  | Analytics events verified, no personal data                                                                                    | Blocked                  | C11 (does not block launch)                                                                                                |
| 18  | Support mailbox answers; privacy, terms, refund and affiliate pages read by a lawyer; cookie approach decided                  | Not done                 | D1 to D3; OD3, OD4, OD5, OD11. `POLICIES-REVIEW.md`                                                                        |
| 19  | Content: free pool reviewed; limits stated (nothing is vet-reviewed, and the site says so)                                     | Pass (editorial)         | `CONTENT-REVIEW.md`, `LIBRARY-INVENTORY.md`. Scores are editorial judgments, not customer ratings                          |
| 20  | Pages CMS loop verified; premium form stays OFF                                                                                | Not done                 | C9, OD2. The free and premium forms are tested against the schema; the premium form ships OFF                              |
| 21  | Affiliate links: each approved Amazon link re-checked the week of launch; tracking id correct                                  | Not done                 | D16                                                                                                                        |
| 22  | Post-deploy check on the live site                                                                                             | Not done                 | `node scripts/verify-site.mjs <site url>` (F6)                                                                             |
| 23  | Search and sharing: sitemap served, Search Console and analytics owner access confirmed                                        | Not done                 | A6, D10, F7                                                                                                                |
| 24  | Public counts quoted only from a launch-day inventory                                                                          | Not done                 | D13: `node scripts/library-stats.mjs --md`                                                                                 |

## Commercial pages and free-first flow

| #   | Gate                                                                                                                                                               | Status                | Evidence or task                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------------------------------------------------------------------------------------- |
| C1  | Home, `/unlock`, `/faq` and the hub read correctly at 390 px and desktop, with no horizontal scroll                                                                | Not done on devices   | Automated and dev-server checks only; C1 to C3                                            |
| C2  | The buyer questions are answered on `/faq`; sync and recovery wording matches `ARCHITECTURE.md`                                                                    | Pass                  | `src/test/commercial-pages.test.tsx`                                                      |
| C3  | No fabricated claims (ratings, counts, testimonials, urgency, discounts) and no perpetual-service or future-content promise                                        | Pass                  | Guard tests and `POLICIES-REVIEW.md` messaging audit                                      |
| C4  | Public counts come from the live endpoints, with plain fallbacks when previews are unavailable                                                                     | Not done              | B9 (needs the preview store)                                                              |
| C5  | Keepsake examples: 6 of 8 use real CC0 photos (credited), 2 are labeled illustrations; file sizes within the limits                                                | Pass (code)           | `public/examples/`, `IMAGE-CREDITS.md`, `demo-assets.test.ts`; licenses re-checked in D11 |
| C6  | New analytics events appear with no personal data                                                                                                                  | Blocked               | C11 (does not block launch)                                                               |
| C7  | The hub, `/faq` and the ten Journal pages are in the sitemap; the retired landing routes 301 to Journal articles; personalized filter combinations are not indexed | Pass                  | `src/lib/sitemap-entries.ts` and tests; `/previews` is not in the sitemap (OD7)           |
| C8  | Gift checkout evaluated (optional; flag OFF; not advertised)                                                                                                       | Optional              | E8                                                                                        |
| C9  | Gift flow verified before `flags.gifting` is set to true                                                                                                           | Not done (flag false) | E8                                                                                        |
| C10 | Personalized keepsake creation is full-Passport only; no page tells a free visitor they can make one                                                               | Pass                  | `keepsake-gating.test.tsx`, `unlock-v6.test.tsx`                                          |
| C11 | `/unlock` shows the price line, the refund terms next to the buy button and one fully visible demonstration adventure                                              | Pass                  | `unlock-v6.test.tsx`; the refund period itself is set on Gumroad (OD3, E2)                |
| C12 | Redirects: ten forced 301s and the 410 rules are in `netlify.toml`; Netlify's real behavior is unverified                                                          | Not done on Netlify   | `netlify-config.test.ts` pins ten; verify in B4                                           |

## Cutover (only after the verdict is READY)

1. Owner authorizes the production deploy and, separately, any DNS or billing change (F1).
2. Set production environment variables (F2); take a rollback copy of the live store, import the premium library with `--env production --write --yes-production`, export a backup (F3, F4).
3. Deploy (F5), run `scripts/verify-site.mjs`, run one permitted purchase and refund (F6).
4. Keep the previous deploy available for rollback until the first week is clean.

## PWA install (paused)

The PWA and push notifications are paused: `PWA_ENABLED = false` (no manifest link, no service worker registration, any earlier worker is removed), `PWA_PROMPTS_ENABLED = false`, `flags.notifications = false`, and the scheduled function has no schedule.

| #   | Gate                                                                                                                | Status                   | Evidence or task                                  |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------- |
| PW1 | Install prompts stay hidden, `/install` is noindex and unlinked, nothing customer-facing claims PWA or offline use  | Pass                     | `src/test/pwa-gate.test.tsx`                      |
| PW2 | Home-screen install, authentication continuity, restore fallback, updates and notification delivery on real devices | Not applicable at launch | C10 (only if the owner turns PWA or push on, OD9) |
