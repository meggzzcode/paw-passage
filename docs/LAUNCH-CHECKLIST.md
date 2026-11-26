# Launch checklist

Status as of 2026-11-26. A gate is **Pass** only when it was verified; otherwise **Not done**, **Blocked** (needs an external task) or **Defect**.

## Verdict

Choose one:

- **READY** - every gate below passes.
- **READY AFTER EXTERNAL SETUP** - everything in the code and content passes; only the owner tasks in `COWORK-HANDOFF.md` remain.
- **NOT READY** - at least one gate fails for a reason inside the repository.

**Current verdict: NOT READY.** Reasons:

1. The browser does not yet request the premium library or push progress to the server (`GET /api/premium/adventures` and `PUT /api/progress` are never called by the UI), so a purchaser cannot reach the paid library or live sync. This is a code gap, not an external task.
2. The Gumroad license integration is unverified (CW-PAY-1) and no seller account, product or checkout link exists (CW-PAY-2, CW-PAY-3).
3. Nothing has run on Netlify: the deploy path, `/api/*` routing, environment isolation and Blobs behavior are unverified (CW-NET-4, CW-NET-5, CW-NET-2).
4. No real-device test has been done (CW-QA-1).
5. No premium library has been imported to any store (CW-BLOB-3), so the paid product cannot be delivered yet.

Once item 1 is fixed and re-tested, the verdict becomes **READY AFTER EXTERNAL SETUP** (items 2 to 5 are external).

## Gates

| #   | Gate                                                                                                 | Status                              | Evidence or blocker                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Type check, lint (no errors), all tests, production build pass on the launch commit                  | Pass (snapshot)                     | `QA-REPORT.md`: tsc 0 errors; eslint 0 errors, 30 warnings; 847 of 847 tests; build OK. Re-run on the launch commit. |
| 2   | Build-skip rule tested                                                                               | Pass                                | `node scripts/test-netlify-ignore.mjs`: 20 of 20                                                                     |
| 3   | Free experience works end to end with no account                                                     | Not done on devices                 | Covered by automated tests only; CW-QA-1                                                                             |
| 4   | Eligibility: unknown is never safe, hard rules not overridable                                       | Pass (automated)                    | Engine and discovery tests                                                                                           |
| 5   | Photos never leave the device                                                                        | Pass (code and tests)               | No upload path in code; verify in a browser network panel during CW-QA-1                                             |
| 6   | Premium text absent from the repository, bundle and public files                                     | Pass (code); re-check before launch | Build refuses `access: premium` in `content/`; search the built output before launch                                 |
| 7   | Browser consumes the premium endpoint and syncs progress                                             | **Defect**                          | Not wired (`QA-REPORT.md`, defect 1)                                                                                 |
| 8   | Gumroad license behavior verified from live documentation                                            | Blocked                             | CW-PAY-1                                                                                                             |
| 9   | Gumroad seller account and draft product                                                             | Blocked                             | CW-PAY-2, CW-PAY-3 (owner, last)                                                                                     |
| 10  | Purchase, restore and refund tested                                                                  | Blocked                             | CW-PAY-4                                                                                                             |
| 11  | Environment variables set with correct scopes; test provider off in production                       | Blocked                             | CW-NET-4                                                                                                             |
| 12  | Preview deploy: pages load, `/api/*` reaches the Function, preview and production stores isolated    | Blocked                             | CW-NET-5                                                                                                             |
| 13  | Blobs metering, persistence and consistency understood                                               | Blocked                             | CW-NET-2                                                                                                             |
| 14  | Premium import and export proven with synthetic data, then the real library imported and backed up   | Blocked                             | CW-BLOB-3, then the runbook in `OPERATIONS.md`                                                                       |
| 15  | Netlify credits and auto-recharge reviewed; rollback deploy exists                                   | Blocked                             | CW-NET-1, CW-NET-3                                                                                                   |
| 16  | Real-device QA (iPhone Safari, Android Chrome)                                                       | Blocked                             | CW-QA-1                                                                                                              |
| 17  | GA4 events verified, no personal data                                                                | Blocked                             | CW-ANA-1 (does not block launch)                                                                                     |
| 18  | Privacy, terms, refund and affiliate disclosure pages match the live behavior                        | Not done                            | Pages exist; owner and legal read-through before launch                                                              |
| 19  | Content: free adventures reviewed; limits stated (nothing is vet-reviewed, and the site says so)     | Not done                            | `CONTENT-REVIEW.md`, "Remaining concerns"                                                                            |
| 20  | Pages CMS loop verified; adventure form updated to schema v2 (or CMS editing of adventures disabled) | Defect                              | CW-CMS-1; `.pages.yml` adventure form out of date                                                                    |
| 21  | Default page title no longer says "travel guides and stays"                                          | Defect                              | `src/routes/__root.tsx`                                                                                              |
| 22  | Affiliate links: each approved Amazon link re-checked the week of launch; tracking id correct        | Not done                            | `OPERATIONS.md`                                                                                                      |
| 23  | Post-deploy check on the live site                                                                   | Not done                            | `node scripts/verify-site.mjs <site url>`                                                                            |
| 24  | Search and sharing: sitemap served, Search Console and analytics owner access confirmed              | Not done                            | Owner                                                                                                                |

## Cutover (only after the verdict is READY)

1. Owner authorizes the production deploy and, separately, any DNS or billing change.
2. Set production environment variables (CW-NET-4), import the premium library with `--env production --write --yes-production`, export a backup.
3. Deploy, run `scripts/verify-site.mjs`, run one permitted purchase and refund (CW-PAY-4).
4. Keep the previous deploy available for rollback until the first week is clean.
