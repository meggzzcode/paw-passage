# Architecture

How the Adventure Passport is built. Facts come from the code; anything not proven against a live service is marked **UNVERIFIED**. Decisions and their reasons are in `DECISIONS.md`.

## Overview

```
browser (TanStack Start pages, local Save v2, keepsake canvas)
   |  free: no server call
   |  paid: same-origin fetch /api/*  (cookie pp_session + x-pp-csrf)
Netlify Function netlify/functions/api.ts
   -> src/server/passport/netlify.ts (wires Blobs, env, provider)
   -> src/server/passport/api.ts     (one framework-free handler: Request -> Response)
Netlify Blobs: customers-<env>, premium-<env>
Checkout provider (Gumroad adapter) for license verification
```

Pages are server-rendered by TanStack Start (`src/server.ts`, `src/start.ts`). The start file adds middleware for trailing-slash redirects, security headers on HTML (`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and a REPORT-ONLY `Content-Security-Policy` that allows inline scripts; `src/lib/security-headers.ts`) and an error page. There is deliberately no `X-Frame-Options`/`frame-ancestors` and no enforced CSP (the Lovable editor previews the site in an iframe; the inline scripts in the root document would need nonces first).

## Content pipeline

- `plugins/content.ts` (a Vite plugin) reads `content/` at build time, validates it with zod, and fails the build with the file and field name on any error. Unpublished guides are left out of production bundles.
- `src/passport/content.ts` loads `content/adventures/*.yml` (schema v2 required, file name equals id, only `access: free` allowed), `collections.yml`, `stamps.yml` and `achievements.yml`, then checks that every collection and stamp an adventure names exists. Only published adventures are exposed (`freeLibrary()`).
- The premium library is not part of this pipeline. It is never imported into the bundle.

## Schema v2 and the engine (`src/passport/`)

- `schema.ts`: the adventure schema (56 fields, controlled lists, cross-field rules such as car adventures must require `car`, food adventures need diet notes, a published adventure needs independent review average at least 7.0 and no score under 6) and `validateLibrary`.
- `profile.ts`: types for the dog profile, owner preferences, session filters, scopes and custom collections. Every field is optional.
- `engine.ts`: pure functions, no network, no AI. `eligibility()` is the hard filter (Stage A): known conflicts exclude, missing facts produce **held** adventures with a question. `rank()` scores the survivors with an explainable additive score (profile and owner matches, favorites, feedback, budget, preparation, supplies, a small deterministic jitter from a seed) and returns up to three reasons per result, or which filters to relax. `pickSurprise()` draws one adventure within a scope. `smartMembers()` evaluates a saved smart collection against today's profile.
- `progress.ts`: Save v2 and its merge. A Save contains the profile and owner preferences (last write wins by timestamp), add/remove timestamped sets (done, favorites, saved), memories (max 280 characters), repeat counts, feedback and custom collections (merged per field, with delete tombstones). Limits: 400 ids per set, 30 collections, 100 items per collection, 60,000 characters per record. `migrate()` upgrades a v1 Save; `validateSave()` rejects malformed or oversized input. **A Save never contains a photo or keepsake.**
- `starter.ts`: the free visitor's single tailored adventure (`selectStarter`, `savedStarter`), saved in the Save as the optional `starter` field. No network.
- `local-store.ts`: browser persistence in `localStorage` key `pp.save.v1`, with an in-memory fallback and a visible notice when storage is blocked; JSON export and import.
- `keepsake/`: canvas renderer, ten families, themes, photo intake (`photo.ts`: in memory only, 20 MB and 2,400 px limits). Nothing in this folder talks to a server or writes to storage.

### Personalized keepsake creation is paid (owner decision, 2026-11-26)

Free visitors can view finished static examples; only entitled customers can upload or take a photo and make a keepsake. The free intro adventure still gives the intro stamp.

- **Gate.** `components/passport/KeepsakeGate.tsx` reads `useEntitlement()`. Only `status === "entitled"` renders the editor. `free`, `checking`, `offline` and `revoked` never do: they render `KeepsakeUnlock.tsx` (a static example, a plain unlock link, no file input, no camera, no canvas) or a short "checking" line. An entitled session keeps full access, and access ends in the same render if the entitlement is revoked.
- **Lazy delivery.** `components/passport/keepsake-loader.ts` is the only place the editor (`Keepsake.tsx`, `PhotoEditor.tsx`, and through them the template, theme, filter and renderer code in `passport/keepsake/`) and the milestone-card renderer are imported, and both imports are dynamic. They run only after the entitlement check passes, so free visitors never download the editor chunk. Nothing eager imports `passport/keepsake/themes` or `render`: public preview tiles (`PreviewArt`) use a tint derived from the theme id, and the small save/share helpers live in `passport/keepsake/download.ts` so free features (calendar and backup downloads) do not pull keepsake code.
- **Entry points covered.** The adventure card button ("See the keepsake style" for free visitors, "Make my photo keepsake" for customers), Our Story ("Create a keepsake"), the free-intro completion (via the card), and the My Passport milestone card. There is no keepsake route. New entry points must go through `KeepsakeGate` or `useKeepsakeEntitled`, never import `Keepsake.tsx` or `keepsake/render` directly (tests in `keepsake-gating.test.tsx` and `our-story.test.tsx` cover the gate).
- **Photos.** Unchanged: processed on the device only, never uploaded or stored, exports are fresh canvas encodes.

**What this does and does not protect.** The repository is public, so the editor source, templates and themes can be read and run by anyone who clones it. The product gate is entitlement plus lazy delivery: the shipped site does not offer the editor to free visitors and does not send them the editor code, and hiding by CSS is not relied on. It is not DRM. Someone who builds the open source themselves can use the editor, and that is accepted. The paid value is the full library and the supported experience.

- `events.ts`: allow-listed analytics events.

## Server (`src/server/passport/`)

Routes (all `Cache-Control: no-store`, except `/api/premium/summary` (`public, max-age=600`) and `/api/previews` (`public, max-age=300`); JSON). UNVERIFIED: `netlify.toml` sets `no-store` for `/api/*` as a fallback; confirm on a preview deploy (B5) that the function's own header wins on those two (no-store would also be acceptable):

| Route                               | Method     | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/access/activate`              | POST       | Verify a license code with the provider, find or create the customer, merge local progress, set the cookie                                                                                                                                                                                                                                                                                                             |
| `/api/access/restore`               | POST       | Same lookup on another device; never creates a second customer for the same purchase                                                                                                                                                                                                                                                                                                                                   |
| `/api/session`                      | GET        | Whether the cookie is valid and entitled; returns the CSRF token                                                                                                                                                                                                                                                                                                                                                       |
| `/api/session/signout`              | POST       | Clears the `pp_session` cookie on THIS device (same attributes, `Max-Age=0`). Same-origin required; CSRF required when a valid session exists; idempotent, works with a missing or invalid cookie; no store writes. Sessions are stateless signed cookies, so this does not revoke other devices (a later "sign out everywhere" would need a per-customer session epoch; not built)                                    |
| `/api/session` and access responses | GET / POST | Also return `owner`: an opaque one-way tag of the customer (HMAC with its own derived key, 24 hex chars). The browser keeps it as `pp.owner.v1` so a different customer on the same device is detected and the previous customer's local records are not merged or uploaded (`src/passport/device-owner.ts`). Analytics consent lives in `src/lib/consent.ts` (no Google script before consent; production host only). |
| `/api/progress`                     | GET, PUT   | Read the synced Save; merge a Save in (the server owns `rev`; a stale `baseRev` is merged and flagged `stale`)                                                                                                                                                                                                                                                                                                         |
| `/api/premium/adventures`           | GET        | The premium library, only for an entitled session                                                                                                                                                                                                                                                                                                                                                                      |
| `/api/premium/summary`              | GET        | Public, no session: `{count, collections:[{slug,count}]}` of PUBLISHED premium adventures from the `index` record only (no titles, text or ids). `Cache-Control: public, max-age=600`, rate limited. Empty store gives zeros; unreadable store gives 503 (clients treat it as unknown)                                                                                                                                 |
| `/api/previews`                     | GET        | Public, no session: `{items, total, collections}`. Allowlisted preview records (showcase premium cards plus free cards with a teaser), `total` = published adventures in the whole library, `collections` = collections with at least one. `Cache-Control: public, max-age=300`, rate limited. No store gives `{items:[],total:0,collections:0}`                                                                       |
| `/api/previews/match`               | POST       | Public, same-origin, `no-store`: body `{dog, owner}` (whitelisted enum fields only, under 4 KB, never logged) gives `{matching, total, previews}` computed with `eligibility()` over the full published library; held (unknown) cards are not counted; ids only, no titles                                                                                                                                             |
| `/api/account/export`               | POST       | Download the synced progress as JSON                                                                                                                                                                                                                                                                                                                                                                                   |
| `/api/account/delete`               | POST       | Delete the synced record and the purchase lookup (body `{"confirm":"DELETE"}`)                                                                                                                                                                                                                                                                                                                                         |

The same function also routes `/api/push/*`, `/api/notifications*` and `/api/schedule*` (18 paths in `netlify/functions/api.ts` in all). Notifications are paused (`flags.notifications=false`, `NOTIFICATIONS.md`); the scheduled function `push-deliver.ts` has no schedule.

Modules: `api.ts` (handler), `provider.ts` (checkout interface, Gumroad adapter, test provider, selection), `session.ts` (cookie, CSRF, same-origin check), `store.ts` (customer records, compare-and-set), `kv.ts` (Blobs layer with etags; in-memory twin for tests), `crypto.ts` (HMAC, AES-GCM seal, key derivation), `limits.ts` (rate limiter), `config.ts` (environment and store naming), `netlify.ts` (wiring).

Flow:

1. **Activate.** The handler checks the code format, asks the provider to verify it (the code is sent only in a POST body), hashes the provider's purchase reference with `PP_DATA_KEY`, finds or creates the customer, merges the device's Save, stores the sealed code, and sets the session cookie. A refunded, disputed or revoked purchase answers 403 with a reason; a provider outage answers 503 and never grants or revokes.
2. **Use.** Every later call reads the customer id from the signed cookie only. At most every 24 hours the server re-verifies with the provider; a non-valid result switches premium off while keeping progress.
3. **Restore.** Same as activate from a new device; the same purchase hash finds the same customer.

## Public previews and leak guards

- **Record.** `src/server/passport/previews.ts` projects a card into a public `PreviewItem` field by field (allowlist; `PREVIEW_KEYS`), never by copying the card. Never public: instructions, twist, reveal, clue, objective, variations, completion, safety, supplies, photoIdea, memoryPrompt, review, research (`FORBIDDEN_KEYS`). The title is `previewTitle ?? title`. `teaserProblem()` is the no-mechanics check.
- **Store.** `scripts/premium-import.mjs` writes `previews/index` in `premium-<env>` next to `index`: `items` (showcase premium cards, plus free published cards that have a teaser), `total`, `collections`, and `pool` (structural fields the engine reads, for every published card including the free ones read from `content/adventures`; no text). It refuses a showcase card with no teaser or a teaser that explains mechanics. The dry run prints the showcase count. Environment isolation is the premium store's: only a production deploy reads `premium-production`.
- **Client.** `src/lib/previews.ts` (`fetchPreviews`, `fetchMatch`, types) and `src/lib/usePreviews.ts`. Any failure is `null`/`unavailable`; callers use local counts. `fetchMatch` runs only on an explicit user action.
- **Tests.** `src/test/previews-server.test.ts`: projection allowlist, endpoints, matching, body limits, schema bar, and a scan that no synthetic premium text appears in `src/`, `public/` or `content/`.
- **Bundle check (run after the build).** `node scripts/check-leaks.mjs dist` (use the real build output directory, for example `.output/public`). It fails on any synthetic-fixture marker or an `instructions` array next to `access:"premium"`. It cannot see the owner's real private text, only that no card record or fixture text ships.
- UNVERIFIED: `netlify.toml` sets `no-store` for `/api/*`; confirm on a preview deploy that `/api/previews` really returns `public, max-age=300`.

## Stores (Netlify Blobs, strong consistency)

| Store             | Keys                                                                                                                                                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customers-<env>` | `customer/<cus_id>` = {v, id, save (Save v2), entitlement {purchaseRefHash, status, createdAt, lastVerifiedAt, sealed code}}; `purchase/<hash>` = {cus}                                                                                                                                      |
| `premium-<env>`   | `index` = {v:1, ids, items:[{id, status, collections}]} (items feed the public summary; an older ids-only index still works but costs one read per adventure); `adventure/<id>` = one adventure; `previews/index` = the public preview records, totals and structural match fields (no text) |

`<env>` is `production` only when the deploy context is `production`; every other context is `preview`. Older v1 records are upgraded on read.

**Conflict rule:** create with `onlyIfNew`, update with `onlyIfMatch` (etag). On a lost race re-read, re-apply with `merge()` and retry up to 6 times, then 503 `busy_retry`. Two devices writing at once both survive.

## Security controls

- Cookie `pp_session`: signed (HMAC-SHA256, key derived from `SESSION_SECRET`), constant-time compare, 30-day expiry, HttpOnly, Secure, SameSite=Lax.
- CSRF: same-origin `Origin` required (a missing one is refused) plus `x-pp-csrf`.
- License codes are never in URLs, logs or responses; logs hold event names and reason codes only.
- Request bodies over 64 KB are refused. Per-IP limits (12 access attempts and 120 other calls per minute) are held in function memory: best effort per instance, not global.
- Test provider only when `PP_ALLOW_TEST_PROVIDER=1` in `dev`, `deploy-preview` or `branch-deploy`.
- While the test provider is enabled on a preview, anyone who finds the preview URL can activate a `TEST-VALID-...` code, so a preview store that holds the real library is readable by them. Keep the preview URL private and clear the preview store after testing, or test with synthetic data (`COWORK-HANDOFF.md`, OD12).
- Fail closed: no valid `SESSION_SECRET` (32+ characters) means 503.
- Premium text is absent from the bundle and public files; the build never reads `content/premium/`. Premium text is no longer tracked in this repository (owner directive 2026-11-26; `content/premium/*.json` is git-ignored and guarded by `src/test/premium-not-tracked.test.ts`). Scripts take the premium folder from `--dir` or `PREMIUM_DIR`; checks that need the real library are owner-machine checks (`PREMIUM-INTEGRATION-TESTS.md`).
- `netlify.toml` sets `no-store` for `/api/*` and static security headers.

## Build and deploy

`netlify.toml`: `npm run build` with `NITRO_PRESET=netlify` (static files to `dist/`, server-rendered pages to `.netlify/functions-internal/server`), Node 22, functions directory `netlify/functions`, build-skip rule, cache headers for hashed assets, static security headers, 46 rules that answer 410 for retired addresses (served from `public/gone.html`) and 10 forced 301s (three retired gear guides, `/tools`, and six former landing pages that point to Journal articles; `netlify-config.test.ts` pins ten). CI (`.github/workflows/ci.yml`) runs install, type check, lint, tests, the build-skip test and the build.

## Known limits and UNVERIFIED items

- **Gumroad:** the verify URL, parameter names, response fields (success, purchase id, refunded, chargebacked, disputed, dispute_won, license_disabled), the unknown-key status code, and `increment_uses_count=false` behaviour are written from the documented shape and are **UNVERIFIED** (A7, E4).
- **Netlify:** that `/api/*` reaches the Function ahead of the TanStack Start server, what `context.deploy.context` contains on this site, and that the build output and the Function deploy together are **UNVERIFIED** until a preview deploy (B3, B4): a clean local build with `NITRO_PRESET=netlify` produced `dist/` and `.netlify/functions-internal/server`, and that is all that is proven. Whether Netlify applies the redirects and headers as written is also unverified. Blobs billing, persistence and etag behaviour against the real service are **UNVERIFIED** (A5).
- **Browser wiring:** `src/passport/premium-client.ts` loads the premium library into memory only (never storage) when this browser has activated before (a content-free flag `pp.acct.v1`, so free visitors make no network calls), and `src/passport/sync.ts` pulls, merges and pushes the Save (debounced about 2 s, flushed on tab hide, retried when back online, focus check at most once a minute). Both are covered by tests with a fake server; none of it has run against the real Function, Blobs or Gumroad (**UNVERIFIED**).
- The `[[headers]]` block for `/api/*` may not apply to Function responses; the handler sets `no-store` itself.
- Server-side the code is kept sealed to allow the 24-hour re-check; see decision D6.
