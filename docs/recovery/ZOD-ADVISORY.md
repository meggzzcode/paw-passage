# zod advisory GHSA-mrhx-c7xc-m3w5: evidence, exposure, options

Written 2026-11-18. Research only: no repo code, package.json or lockfile was changed. All installs and tests ran in temp copies (/tmp/zodaudit, /tmp/zodtest, /tmp/z3).

## Summary

1. VERIFIED: `npm audit` (prod and full) reports 2 high findings, both one root cause: zod 3.25.76 (ours) is inside "<4.6.6"; `@tanstack/zod-adapter` is flagged only because it depends on zod. `fixAvailable` is false.
2. VERIFIED: the bug is a memory/CPU exhaustion (denial of service, CWE-770) when zod validates a very large ARRAY (also set/map). Availability only, no data exposure.
3. VERIFIED: our runtime schemas (stay-search.ts, place-search.ts) contain no array, set, map, regex or size-limited type. Only strings, numbers and booleans. Unknown keys are stripped. Tested: 1M-element arrays in every field parse in ~20 ms.
4. VERIFIED: the zod 3 line will not get a fix. The maintainer says v3 is no longer published and he does not consider it a vulnerability. The "zod/v4" subpath inside 3.25.76 is also unpatched.
5. VERIFIED: the only real fix is zod >= 4.6.6 (4.6.7 latest), a major upgrade. `@tanstack/zod-adapter@1.167.0` (latest) peers on zod ^3.23.8, but TanStack docs say with zod v4 you pass the schema directly, no adapter.
6. VERIFIED in a temp copy: a working zod 4.6.7 migration exists (tsc clean, 396/396 tests, vite build OK, npm audit 0 vulnerabilities). Diff is small, steps in section 6.
7. Exposure verdict: NOT EXPLOITABLE VIA OUR SEARCH PARAMS (VERIFIED by code reading and test); residual build-time risk is low; the audit warning stays until the dependency is moved.
8. RECOMMENDED: do the zod 4 migration in section 6 as a small, separately reviewed change (about 1 hour, no ongoing cost). It is not urgent. Do not use npm audit fix --force or overrides.
9. Re-check date: 2026-12-18, or earlier when `@tanstack/zod-adapter` publishes a version with zod 4 peers.
10. Not a launch blocker: nothing here touches affiliate links, content or hosting.

## 1. Audit output (VERIFIED, run 2026-11-18 in /tmp/zodaudit with only package.json and package-lock.json)

`npm audit --omit=dev --json` and `npm audit --json` returned identical results: 0 critical, 2 high, 0 moderate/low.

| Item | Value |
|---|---|
| Advisory | GHSA-mrhx-c7xc-m3w5 (npm advisory source id 1243066); CVE-2023-54404 per the GitHub page |
| Title (npm) | "Zod can exhaust memory while validating oversized constrained collections" |
| Severity | high |
| CVSS | npm audit: 3.1 score 7.5, `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H`. GitHub page: CVSS v4 base 8.2, `AV:N/AC:L/AT:P/PR:N/UI:N/VC:N/VI:N/VA:H`. Both: network, no auth, availability high only |
| CWE | CWE-770 (allocation of resources without limits) |
| Affected | zod < 4.6.6 (npm range `<4.6.6`; GitHub text says "through 4.6.5") |
| Fixed | 4.6.6 (released 11 Oct 2026); 4.6.7 is latest (12 Oct) |
| Major upgrade? | Yes: 3.x to 4.x. There is no patched 3.x. |
| Workarounds listed | None on the advisory page |
| Published | 2026-10-01; updated 2026-10-23 (GitHub page) |

Second finding: `@tanstack/zod-adapter` severity high, range `*`, only via zod. No separate vulnerability in the adapter itself.

Sources read: https://github.com/advisories/GHSA-mrhx-c7xc-m3w5 (read 2026-11-18; api.github.com was refused, so the page text came via WebFetch summary); https://github.com/colinhacks/zod/releases (4.6.6 and 4.6.7); PR https://github.com/colinhacks/zod/pull/6652; issue https://github.com/colinhacks/zod/issues/6653. Page summaries were produced by the fetch tool; quotes below are as relayed.

### Vulnerability in plain words

Zod's array validation (`$ZodArray` / `handleArrayResult`) keeps a validation issue object for every bad element, with no cap and no early exit. An attacker who can get a huge array into a schema that parses arrays makes the process allocate millions of objects until memory runs out. The advisory title says "constrained", and PR #6652 shows why: `z.array(...).max(100)` checked the size only AFTER parsing every element, so even a `.max()` limit did not protect. In 4.6.6 the upper-bound checks (`.max()`, `.length()`, `.size()`) on arrays, sets and maps run before the elements are parsed. Unbounded arrays are not changed by that fix (a reviewer noted this gap in the PR).

Release notes 4.6.6: array/set/map size bounds checked before element parsing (#6652); record type declaration change (#6645). 4.6.7: version bump only. Release page also records that malicious commits were pushed to zod `main` on 21 Sep 2026 with a compromised credential, reverted the same day, and stated not to have been published to npm.

### Does zod 3 get a fix? (VERIFIED via issue #6653, as relayed)

Issue #6653 ("v3: .max() on arrays and sets doesn't stop parsing") is open. The maintainer (Oct 12): new v3 versions are no longer published and he does not consider it a vulnerability. A commenter reports the `zod/v3` entry point inside 4.6.6/4.6.7 still has the behaviour. Another user asked how apps stuck on zod 3 should mitigate; no answer on the page. Our own test (section 3) confirms `zod/v4` inside 3.25.76 is also unpatched: 1,000,001 issues for 1M bad items against `.max(100)`.

## 2. Who requires zod (VERIFIED)

Lockfile: `node_modules/zod` 3.25.76 (package-lock.json:8781). package.json:75 `"zod": "^3.25.76"` is our own direct dependency. `npm ls zod --all --package-lock-only`:

| Consumer | zod |
|---|---|
| our own dependency | 3.25.76 |
| @hookform/resolvers 5.9.2 | 3.25.76 (deduped; no source file in src/ imports it for zod) |
| @tanstack/zod-adapter 1.167.0 (peer `zod ^3.23.8`, router `>=1.43.2`) | 3.25.76 |
| @tanstack/react-start to start-plugin-core 1.171.49 | zod 4.6.7 (own nested copy) |
| @tanstack/router-plugin 1.168.42 and router-generator 1.167.40 | zod 4.6.7 (own nested copies) |

So TanStack's build tooling already runs on patched zod 4.6.7; only our app copy (3.25.76) is flagged. `zod-adapter` latest dist-tag is 1.167.0 (a 1.167.1-pre.0 exists), peer still `^3.23.8`.

## 3. Actual exposure (VERIFIED from code, plus tests)

Where zod runs:

| Location | When | Input | Array/regex/size types? |
|---|---|---|---|
| src/content/schema.ts and products-schema.ts, loaded by plugins/content.ts | Build time (and dev), over content/*.md and *.yml | Our own files (owner/CMS edits via Pages CMS commit to main) | Yes: `z.array(...)` for faqs, sources, gear etc., regexes for dates and uploads. Input is trusted repo content, not visitors |
| src/lib/stay-search.ts via `zodValidator` in src/routes/stays.index.tsx:16 | Runtime, browser and server render | URL query string only | No |
| src/lib/place-search.ts via `zodValidator` in src/routes/dog-rules.index.tsx:13 | Runtime, browser and server render | URL query string only | No |

The runtime schemas, read in full: stay-search has 4 free-text strings (q, state, town, type), sort (string), 2 numbers (dogs, weightMin), 12 booleans. place-search has 4 strings (q, state, kind, trails). All wrapped in `fallback(x, default).default(default)`. No `z.array`, set, map, record, regex or `.max()`. Nothing else in src/ imports zod (grep).

Untrusted input: URL query strings only (TanStack parses values from the query, so a visitor can supply JSON-like values such as arrays or objects in a field). A scalar schema given an array just fails that one field and falls back to the default; zod does not walk the array elements for a scalar type.

Test (/tmp/z3, zod 3.25.76 + adapter 1.167.0, our schema shape): `q` = array of 1M items, `dogs` = array of 1M strings, plus an extra 1M-item key: parse took 20 ms, 30 MB heap. Control: `z.array(z.string().uuid()).max(100)` with 1M bad items took 945 ms and made 1,000,001 issues. So the vulnerable path exists in the library but our schemas never reach it.

Practical size limit: query strings are capped by browsers/servers, so a visitor cannot send millions of elements anyway. I did not verify Netlify's or the server's exact URL limit (SUSPECTED: tens of KB at most; Node's documented default header limit is 16 KiB). Even a maximal URL holds only thousands of elements.

Verdict: **exposure through search params is VERIFIED not reachable**. Remaining exposure:
- Build time: content schemas do use arrays, but the input is our own content. A DoS here would need a malicious or enormous content file committed by someone with repo write access; that is the supply-chain/trust boundary, not a visitor risk (VERIFIED by reading; low).
- Future risk (RECOMMENDATION): if someone later adds a `z.array(...)` to a search-param schema, the hole opens. A zod 4 upgrade removes that trap.
- Reporting: scanners and a buyer's due diligence will flag the high finding regardless of reachability. That is the main practical cost.

## 4. Upgrade limitations, reproduced (VERIFIED in /tmp/zodtest)

Copy of the repo without node_modules/.output/.git, `npm ci` (note `.npmrc` has `legacy-peer-deps=true`, so npm did not stop on the peer conflict). Baseline before the change: `tsc --noEmit` clean, vitest 28 files / 396 tests pass.

`npm install zod@4.6.7`: succeeds silently, but `npm ls` reports `invalid: "^3.23.8" from node_modules/@tanstack/zod-adapter` (peer mismatch). `npm audit` then reports 0. tsc errors (exact categories):

- plugins/content.ts lines 116, 119, 184, 187, 241, 244, 271, 281, 295: TS2345, `ZodError` not assignable to `{ issues: { path: (string | number)[]; message: string }[] }` because zod 4 paths are `PropertyKey[]` (can contain symbol).
- src/routes/dog-rules.index.tsx (lines 18, 34, 35, 61, 65, 72, 79) and src/routes/stays.index.tsx (lines 21, 37-39, 47-79, 120): TS4111 "Property 'q' comes from an index signature" and TS2345 `{ [x: string]: any }` not assignable to `PlaceFilters`/`StayFilters`. Cause: the zod 3 adapter's types do not understand zod 4 schemas, so `Route.useSearch()` degrades to an index signature.
- vitest still 396 pass and `vite build` still succeeds (type errors only), so the failure is typing, not runtime. It is still not safe to ship unfixed: the adapter runtime with zod 4 was not validated, and a type-broken build hides real mistakes.

This matches the previous worker's report.

## 5. Do TanStack or zod offer another route? (VERIFIED)

- TanStack search-params guide (https://tanstack.com/router/latest/docs/framework/react/guide/search-params, read 2026-11-18): "With Zod v4, we can use the schema without the adapter" (pass the schema straight to `validateSearch`); in v4 `.catch()` keeps type inference; the adapter's `fallback()` is only needed for v3. Standard Schema libraries (valibot 1.0+, ArkType 2.0-rc) are passed directly too.
- Installed `@tanstack/react-router` 1.170.41 accepts Standard Schema (router-core types reference it) and my temp build used it.
- No newer `@tanstack/zod-adapter` with zod 4 peers exists (latest 1.167.0; only a pre-release 1.167.1-pre.0). So the adapter is simply not needed on zod 4.
- Patched zod 3 release: none. 3.25.76 is the last 3.x; `zod/v4` subpath exists in it (`./v4`, `./v4/mini`, `./v4/core`) but is the same unpatched code (tested).

## 6. A safe fix exists (VERIFIED in /tmp/zodtest): steps for the owner or next worker

Result of the full set of changes below in the temp copy: `tsc --noEmit` 0 errors, vitest 28 files / 396 tests pass, `vite build` succeeds, `npm audit` 0 vulnerabilities, search schema behaviour checked (empty query gives all defaults; `dogs=abc`, `fenced="yes"`, `q=["a"]`, `sort=5` fall back to defaults while valid `state=georgia` is kept; 5 MB string plus 1M-element array parses in 0 ms). A diff of the changes is in /tmp/zodaudit/proposed.diff (scratch only; may be cleared, the content is reproduced here).

1. `npm install zod@^4.6.7`. Keep `legacy-peer-deps=true`, otherwise npm will complain about the adapter peer. Optionally `npm uninstall @tanstack/zod-adapter` once step 3 is done (the temp copy kept it installed, harmless; removing it also clears the invalid-peer warning; not tested, so run `npm ci`, tsc and tests after).
2. plugins/content.ts, line 38-39: change `formatIssues` to accept zod 4 issues:
   `error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] }` and `i.path.map(String).join(" > ")`.
3. src/lib/stay-search.ts and src/lib/place-search.ts: remove the `fallback` import and replace each `fallback(z.T(), X).default(X)` with `z.T().default(X).catch(X)` (default keeps the field optional in Link/navigate calls, catch keeps the "bad value falls back" behaviour). `.catch()` alone caused 4 type errors in index.tsx and destinations.$state.$town.tsx because the field became required on `<Link search>` updaters; the `default().catch()` pair fixed them.
4. src/routes/stays.index.tsx:16 and dog-rules.index.tsx:13: delete the `zodValidator` import and use `validateSearch: staySearchSchema` / `placeSearchSchema` directly. `stripSearchParams(schema.parse({}))` stays as is.
5. Verify: `npx tsc --noEmit`, `npx vitest run`, `npx vite build`, `npm audit --json`, then open /stays and /dog-rules with and without garbage in the query string (e.g. `?dogs=abc&fenced=maybe`) on the Netlify deploy preview.

Caveats: `npx eslint` reports many pre-existing prettier formatting errors in this repo (272 in the files I linted); I did not confirm whether they predate this change, so judge lint separately. The content-schema zod 4 behaviour (build-time validation messages, `.url()` strictness) passed with the real content, but error WORDING may differ slightly in the editor-facing build messages. I did not test hosting (Netlify build), only a local `vite build`.

## 7. Recommendation

RECOMMENDED: apply section 6 as one small change, reviewed on a Netlify deploy preview. Reason: it removes the audit warning that buyer due diligence will see, deletes a dependency (the adapter), matches TanStack's current guidance, and prevents the future array-schema trap. Effort about 1 hour; ongoing cost none; dependencies: whoever merges to main (AGENTS.md rules apply). Priority: low-medium, not a launch blocker.

Not recommended: `npm audit fix --force` (it would force a bad downgrade or break the adapter peers), npm `overrides` forcing zod 4 while keeping the adapter and its zod 3 types (hides the type errors in section 4), or dismissing the finding without the note above. If the owner decides to defer, record the accepted risk: "reachable code path absent in search-param schemas, verified 2026-11-18".

## 8. Mitigation if the upgrade is deferred

- Do not add `z.array`, set or map to any search-param schema. This is the actual control.
- `.max()` limits on the existing string fields (for example `z.string().max(200)`) are harmless hygiene but are NOT a fix for this advisory: it concerns arrays, and on zod 3 even `.max()` on arrays does not stop element parsing (issue #6653 and our test). Describe only; do not implement unless asked.
- If an array param is ever needed on zod 3, reject large input before zod sees it: check the raw query string length (for example under 2 KB) in a validateSearch wrapper.
- Keep content-file contributors trusted (build-time input).

## 9. Re-check

Re-check on **2026-12-18**, or earlier if `@tanstack/zod-adapter` publishes a release with zod 4 peers or the zod issue #6653 changes. Command: `npm audit --json` in a clean copy and `npm view @tanstack/zod-adapter dist-tags peerDependencies`.

## Could not verify

- The advisory text came via a fetch-tool summary; api.github.com was refused (403), so the raw JSON was not read. Version ranges were cross-checked against `npm audit` output.
- Netlify's actual maximum request URL length.
- Adapter runtime behaviour on zod 4 (not needed after step 4, since the adapter is no longer called).
- Whether the lint errors predate the change.

## Outcome (2026-11-18): upgrade APPLIED on branch claude/affiliate-setup (not merged)

COMPLETED and VERIFIED in the repo itself (not a temp copy):

- Changes: zod `^3.25.76` to `^4.6.7`; `@tanstack/zod-adapter` removed (package.json, package-lock.json via npm, bun.lock via `bun install`; `.npmrc` legacy-peer-deps kept). `plugins/content.ts` `formatIssues` typing only. `src/lib/stay-search.ts` and `src/lib/place-search.ts`: `fallback(z.T(), x).default(x)` replaced by `z.T().default(x).catch(x)`. `src/routes/stays.index.tsx` and `dog-rules.index.tsx`: `validateSearch` now takes the schema directly. `src/content/schema.ts` needed no change. No URLs changed.
- New test `src/test/search-params.test.ts` (12 tests): written and passing on zod 3 BEFORE the upgrade, then passing unchanged on zod 4. It proves missing, invalid, array-like, object, null, oversized-array (50k items) and 1 MB string values give the same defaults and fallbacks for stays and dog-rules.
- `tsc --noEmit`: clean. `vite build` (NITRO_PRESET=node-server): OK. Served build on port 4190: `/stays?dogs=2` 200, `/dog-rules` 200; `/stays?dogs=abc&weight=zzz` returns 307 to `/stays?weight=zzz` then 200 (the existing stripSearchParams middleware drops invalid values that equal their defaults), likewise for dog-rules. Lovable-style `vite dev` on 5197: `/` 200, `/stays` 200, `/dog-rules` 200, `/stays?dogs=abc` 307 (same redirect), no errors in the log.
- Full vitest: 447 tests. Under parallel load 4 files timed out at 5 s (gear-hub, places, stay-indexing); they pass when rerun with a longer timeout. Two failures are NOT from this change and come from stay content edited by other workers: `launch-state.test.ts` (town page /destinations/georgia/ellijay is listed in the sitemap) and `meta-brands.test.ts` (stay "lovely-1920s-farmhouse-family-and-pet-friendly-mendocino" has a retailer brand in its meta). Those need the owner of the stay data to fix.
- Not compared: a byte-for-byte HTTP comparison with a zod 3 build was not run; equivalence rests on the schema tests above.

Audit before (npm audit --omit=dev and full): 1 high, zod <4.6.6, GHSA-mrhx-c7xc-m3w5, "fix available via npm audit fix --force" (not used).
Audit after (both): `found 0 vulnerabilities`.
Note: build-time content error wording from zod 4 may differ slightly in editor-facing messages; the real content validated without errors.
