# QA report

Only results that were run and read are recorded here. Run on 2026-11-26 with Node v22.23.4 from `HEAD` `e965d75` plus uncommitted working-tree changes (documentation and design/keepsake work in progress). These are a snapshot: **re-run all five commands on the exact commit before launch.**

## Automated checks

| Command                                | Result                                                                                                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                     | Exit 0, no errors.                                                                                                                                                                     |
| `npx eslint .`                         | Exit 0. 0 errors, 30 warnings, all `react-refresh/only-export-components` (files that export both components and helpers; development hot-reload hint only, not a defect in behavior). |
| `npx vitest run`                       | Exit 0. **65 test files passed, 847 tests passed**, 0 failed, about 36 s.                                                                                                              |
| `npx vite build`                       | Exit 0. Client and server bundles built; the server output is generated under `.output/` (Nitro).                                                                                      |
| `node scripts/test-netlify-ignore.mjs` | Exit 0. "All rows pass": 20 of 20 situations (13 content or code changes build, 5 docs-only changes skip, a docs-plus-guide push builds, a missing cached commit builds).              |

## What the 847 tests cover

Content and schema validation (adventures, collections, stamps, achievements, guides, products, packing); the eligibility and ranking engine; discovery screens; Save v2 merge, migration and limits; the local store; custom collections; keepsake families, artwork and the photo path (in memory); the server API with an in-memory store and a fake provider (activation, restore, refund, dispute, revoke, outage, CSRF, origin, rate limit, body size, conflict retry, export, delete, test-provider exclusion in production); security headers; Pages CMS configuration structure; affiliate link rules and Amazon tracking-id replacement; disclosure labels; SEO and internal links; accessibility structure checks in component tests; trust pages.

## NOT tested

None of these has been done, so none is claimed:

- **Real devices.** No iPhone Safari or Android Chrome run; no real touch, camera, photo-picker, share-sheet or download behavior.
- **Browsers.** Component tests run in jsdom, not in real browsers. No cross-browser, print or screen-reader testing. Contrast ratios in the design documents are calculations, not tool-measured.
- **Gumroad.** No request has ever reached Gumroad. The adapter's URL, parameters and response fields are **UNVERIFIED**.
- **Netlify Blobs.** All server tests use an in-memory store. Strong consistency, etag compare-and-set, persistence, limits and metering against the real service are untested.
- **Live or preview deploy.** Nothing has been deployed from this branch. That `/api/*` reaches the Function, deploy-context values, headers on Function responses, and the build and Function deploying together with the current `netlify.toml` `publish` value are untested.
- **Pages CMS.** The edit, save and publish loop is not verified end to end.
- **Premium import and export.** The scripts have not been run against a real store (dry run or write).
- **GA4.** Event delivery and parameter contents are not verified in a real property.
- **Load, abuse and penetration testing.** None. Rate limiting is per function instance only.
- **Content with real dogs and owners.** None.

## Known defects and gaps

1. **Browser does not use premium or sync endpoints.** Discovery runs on the free library with `unlocked: false`; nothing in the browser calls `GET /api/premium/adventures` or `PUT /api/progress`. A purchaser can activate and restore, but the full library and live sync are not reachable from the UI. Blocks launch.
2. **Pages CMS adventure form is out of date.** It shows 29 fields; schema v2 has 56. It offers three fields the schema does not use and omits many required ones, so new adventures cannot be created correctly in the CMS (existing ones are protected by `merge: true`). See `OPERATIONS.md`.
3. **Stale default page title.** `src/routes/__root.tsx` sets the title of ordinary pages without their own title to "dog-friendly travel guides and stays", which does not describe the product.
4. **Dark mode is not reachable.** Dark tokens exist but nothing sets the `dark` class (UNVERIFIED by search of `src/`).
5. **Unverified provider contract and deploy path** as listed above.
6. **Content gaps** recorded in `CONTENT-REVIEW.md`: several free adventures sit at the minimum score, no free adventure needs a car, water or a beach, and there is one food adventure (the site states that nothing is vet-reviewed).
7. **Lint warnings:** 30 `react-refresh/only-export-components` warnings (no errors).
