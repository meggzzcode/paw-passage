# Premium integration tests

What proves the paid path works end to end, what only proves it locally, and what still needs a real preview deploy.
All fixtures are SYNTHETIC. No premium text lives in these tests, this document or the smoke script.

## How the local tests work

- The REAL request handler (`createApi`, the same code the Netlify Function runs) over in-memory stores (`MemoryKV`, same compare-and-set semantics as Blobs) and the isolated `TestProvider` (codes `TEST-VALID-x`, `TEST-REFUNDED-x`, `TEST-DISPUTED-x`, `TEST-REVOKED-x`, `TEST-DOWN-x`).
- A `Device` helper behaves like a browser: its own cookie jar, the CSRF header, relative URLs. Two devices on one world are two phones with one purchase.
- The real browser-side code runs on top of that bridge in jsdom: the entitlement store (`premium-client`), `useKeepsakeEntitled`, `SyncController`, `submitAccessCode`, the engine and the progress merge.
- Files: `src/test/premium-e2e.test.ts` (purchase to library), `src/test/premium-e2e-ops.test.ts` (production safety, export package, smoke script), `src/test/premium-e2e-harness.ts` (shared setup).
- Run: `npx vitest run src/test/premium-e2e`.

## Test provider safety

`TestProvider` exists only when `PP_ALLOW_TEST_PROVIDER=1` AND the deploy context is `dev`, `deploy-preview` or `branch-deploy`. A missing, empty or any other context (including `production`) is treated as production: the flag is ignored and the real provider (or `unconfigured`, which never grants) is used. Preview and production also use separate stores (`customers-preview` vs `customers-production`).

## Requirement to test map

| Requirement                                 | Test (file > describe > name)                                                                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test activation                             | `premium-e2e.test.ts` > premium e2e: activation > activates a test key, issues a signed session and an empty-or-merged account                                                    |
| Premium content access, entitled            | premium e2e: premium content access > an entitled session receives the full premium library including fields free users never get                                                 |
| Premium content access, none                | premium e2e: premium content access > unauthenticated, tampered and revoked sessions receive no premium content                                                                   |
| Public side never leaks                     | premium e2e: premium content access > the public previews and summary never carry the premium-only fields                                                                         |
| Protected API response shape                | premium e2e: protected API response shape > session, premium, progress and export responses have the documented shape and headers                                                 |
| Full library discovery                      | premium e2e: full library discovery > the engine sees the union of free and premium only while entitled                                                                           |
| Full library discovery, server count        | premium e2e: full library discovery > server-side match counts the full library and returns only preview ids                                                                      |
| Custom collections                          | premium e2e: custom collections > custom collections with premium members sync to the account and appear on a second device                                                       |
| Custom collections after revoke             | premium e2e: custom collections > a collection keeps its premium ids when access is revoked; the library just stops offering them                                                 |
| Saved adventures                            | premium e2e: saved adventures > saved adventures and favorites, including bookmarked previews, survive activation and restoration                                                 |
| Introductory progress migration             | premium e2e: introductory progress migration > a free save (starter, reveal, completion, memory, saved, profile) merges into the account on activation without loss               |
| Passport progression                        | premium e2e: passport progression > stamps and milestones derive from completions including premium adventures                                                                    |
| Progression across revoke                   | premium e2e: passport progression > premium progress is hidden while revoked and comes back whole on re-activation                                                                |
| Keepsake editor access                      | premium e2e: keepsake editor access > entitled opens the editor gate; free, revoked and unreachable sessions get the gate, via the entitlement hook and a mocked session endpoint |
| Progress sync, server level                 | premium e2e: progress synchronization > two devices merge and no addition is lost, even with stale revisions and simultaneous writes                                              |
| Progress sync, client level                 | premium e2e: progress synchronization > two SyncControllers on two phones converge through the real handler and keep both phones' additions                                       |
| Restore on another device                   | premium e2e: restoration on another device > restores with the license key only, no cookie, and pulls the account progress                                                        |
| Empty save cannot overwrite                 | premium e2e: restoration on another device > an empty local save cannot overwrite remote progress on restore or on sync                                                           |
| Refund, dispute, revoke                     | premium e2e: refund and revocation > a refunded / a disputed / a revoked key stops premium content at the next check but keeps the customer's own data                            |
| Refused key, notif cleanup                  | premium e2e: refund and revocation > a refused key cannot restore, and revocation removes notification records                                                                    |
| Re-activation                               | premium e2e: refund and revocation > re-activation after a refund reverses reuses the same account and returns the library and progress                                           |
| Provider outage                             | premium e2e: refund and revocation > a provider outage at re-check neither revokes nor grants                                                                                     |
| Account deletion                            | premium e2e: account deletion > removes every record including notification records, and the key cannot restore the deleted progress                                              |
| Offline: premium fetch failure              | premium e2e: offline and error handling > a premium fetch failure shows the truthful offline state with the free library and no crash                                             |
| Offline: keeps verified state               | premium e2e: offline and error handling > an offline refresh keeps the previously verified entitlement and library; it never invents a revocation                                 |
| Garbage and expired sessions                | premium e2e: offline and error handling > garbage, an expired cookie and a 5xx never crash the client                                                                             |
| Local progress untouched                    | premium e2e: offline and error handling > local progress is never touched by any of the above                                                                                     |
| Protected content export                    | `premium-e2e-ops.test.ts` > premium e2e: protected content export > premium-export produces the one-file-per-adventure package from the store, and premium-import accepts it      |
| Test provider off in production             | premium e2e: production safety > the test provider is DISABLED in a production context, even with the flag set                                                                    |
| Production test key grants nothing          | premium e2e: production safety > in production a test key grants nothing: no GUMROAD_PRODUCT_ID is unavailable, a real provider refuses it                                        |
| Store isolation                             | premium e2e: production safety > production and preview use separate stores, so test accounts never touch customer data                                                           |
| Config never enables the flag in production | premium e2e: production safety > the committed Netlify config never sets the test flag for the production context                                                                 |
| Smoke script guards                         | premium e2e: preview smoke script > refuses the production domain, plain http, a missing key and a real-looking key                                                               |
| Smoke script works                          | premium e2e: preview smoke script > passes every step against a preview-like server and leaves no customer data behind                                                            |
| Smoke script fails loudly                   | premium e2e: preview smoke script > prints FAIL and exits 1 when premium is not seeded or the key is refused                                                                      |

Existing suites that stay the unit-level source of truth and were not duplicated: `server-passport`, `launch-commerce`, `push-api`, `previews-server`, `premium-client`, `passport-sync`, `keepsake-gating`, `handover-scripts`.

## Behaviors these tests pin (so a change is deliberate)

- Refund, dispute or revoke: premium content stops at the next re-check (at most every 24 hours, on the next request after that). Progress, memories, collections and export stay available to the customer. Push devices, preferences and plans are deleted with the entitlement and do NOT come back on re-activation; the customer registers the device again.
- A reversed refund (the seller marks the key valid again) re-activates the SAME account with its progress.
- Account deletion removes the customer record, the purchase lookup and all `notif/` records. The seller may still call the key valid, so the key can open a NEW empty account; nothing deleted comes back. If the owner wants a deleted key to stay unusable, that needs a tombstone, which does not exist today (a product decision, not tested as a requirement).
- The client keeps an already verified entitlement and library through a flaky refresh (`offline` is shown only when nothing was verified yet). A real server answer of revoked is shown in plain words with "nothing was deleted".
- A provider outage never grants and never revokes.

## UNVERIFIED locally (needs a deployed preview)

1. Netlify Blobs strong consistency and compare-and-set under real concurrency (local tests use an in-memory fake with the same etag rules). Preview step: run the smoke script twice at the same moment with the same key from two shells (see below) and confirm both runs pass or one reports a retryable busy state, never a lost marker.
2. Real Gumroad: endpoint, field names, refund and chargeback flags, license disabling, gift behavior (tracked as A7, E4 and E8). Preview step: owner buys the live product once with a 100 percent discount code or a real $19.99 test purchase, activates, refunds in Gumroad, and checks access ends within 24 hours.
3. The real Netlify Function wrapper (`netlify/functions/api.ts`, `handleNetlify`, `CONTEXT` handling, cookie `Secure` over real HTTPS, response headers added by the CDN). Preview step: smoke script against the deploy preview.
4. The actual premium store contents and the preview index written by `premium-import.mjs --write` into `premium-preview`. Preview step: import the owner's package to the preview store, then run the smoke script; step 5 must show the expected adventure count.
5. `premium-export.mjs` against a real store (the test runs the real script text against a stub store). Preview step: run it with `--env preview --dir <folder outside the repo>` and then `premium-import.mjs --dir <folder>` as a dry run.
6. Real browsers: cookie jars across devices, iOS cookie handling for the home-screen app, real offline behavior. Manual device pass (see `docs/PWA-DEVICE-TEST.md`).
7. Push delivery (paused for launch): only record cleanup is proven here, not delivery.

## Preview smoke test (Cowork runs this, never against production)

Preconditions on the deploy preview (not production): `SESSION_SECRET` (32+ characters) and `PP_DATA_KEY` set, `PP_ALLOW_TEST_PROVIDER=1` set for the preview or branch-deploy context only, and premium content imported into `premium-preview`.

```
PREVIEW_URL=https://deploy-preview-N--<site>.netlify.app \
TEST_LICENSE_KEY=TEST-VALID-<8 to 40 letters or digits> \
node scripts/preview-smoke.mjs
```

The key is a made-up test code for the isolated provider, not a purchase key and not a secret; do not paste a real Gumroad key (the script refuses it). The script refuses to run when the host is, or ends with, the production domain from `content/settings.yml` (the value `site.siteUrl` uses), when the URL is not https, or when the key is not `TEST-VALID-...`.

Steps (each prints PASS or FAIL; exit code 1 if any fail; wait a minute before re-running because access calls are rate limited to 12 per minute per IP):

1. `GET /api/previews` is public and has no premium fields.
2. Premium library refused without a session (401).
3. Bad, refunded and revoked keys refused with no session cookie.
4. Activate with the test key.
5. `/api/premium/adventures` returns the full library (non-empty, full records).
6. Session reports entitled.
7. Progress written on the first device is stored.
8. Restore on a fresh cookie jar with the key only pulls that progress and premium works.
9. An empty save from the second device cannot erase the first device's progress.
10. Cleanup: deletes the throwaway account; the old session stops working.

The script prints counts only, never content and never the key. It writes one throwaway marker into the preview store and deletes the account at the end.
