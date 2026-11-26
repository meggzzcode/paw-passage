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

Pages are server-rendered by TanStack Start (`src/server.ts`, `src/start.ts`). The start file adds middleware for trailing-slash redirects, security headers on HTML (`Referrer-Policy`, `Permissions-Policy`; no frame header and no Content-Security-Policy yet) and an error page.

## Content pipeline

- `plugins/content.ts` (a Vite plugin) reads `content/` at build time, validates it with zod, and fails the build with the file and field name on any error. Unpublished guides are left out of production bundles.
- `src/passport/content.ts` loads `content/adventures/*.yml` (schema v2 required, file name equals id, only `access: free` allowed), `collections.yml`, `stamps.yml` and `achievements.yml`, then checks that every collection and stamp an adventure names exists. Only published adventures are exposed (`freeLibrary()`).
- The premium library is not part of this pipeline. It is never imported into the bundle.

## Schema v2 and the engine (`src/passport/`)

- `schema.ts`: the adventure schema (56 fields, controlled lists, cross-field rules such as car adventures must require `car`, food adventures need diet notes, a published adventure needs review average at least 8 and no score under 7) and `validateLibrary`.
- `profile.ts`: types for the dog profile, owner preferences, session filters, scopes and custom collections. Every field is optional.
- `engine.ts`: pure functions, no network, no AI. `eligibility()` is the hard filter (Stage A): known conflicts exclude, missing facts produce **held** adventures with a question. `rank()` scores the survivors with an explainable additive score (profile and owner matches, favorites, feedback, budget, preparation, supplies, a small deterministic jitter from a seed) and returns up to three reasons per result, or which filters to relax. `pickSurprise()` draws one adventure within a scope. `smartMembers()` evaluates a saved smart collection against today's profile.
- `progress.ts`: Save v2 and its merge. A Save contains the profile and owner preferences (last write wins by timestamp), add/remove timestamped sets (done, favorites, saved), memories (max 280 characters), repeat counts, feedback and custom collections (merged per field, with delete tombstones). Limits: 400 ids per set, 30 collections, 100 items per collection, 60,000 characters per record. `migrate()` upgrades a v1 Save; `validateSave()` rejects malformed or oversized input. **A Save never contains a photo or keepsake.**
- `local-store.ts`: browser persistence in `localStorage` key `pp.save.v1`, with an in-memory fallback and a visible notice when storage is blocked; JSON export and import.
- `keepsake/`: canvas renderer, ten families, themes, photo intake (`photo.ts`: in memory only, 20 MB and 2,400 px limits). Nothing in this folder talks to a server or writes to storage.
- `events.ts`: allow-listed analytics events.

## Server (`src/server/passport/`)

Routes (all `Cache-Control: no-store`; JSON):

| Route                     | Method   | Purpose                                                                                                        |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `/api/access/activate`    | POST     | Verify a license code with the provider, find or create the customer, merge local progress, set the cookie     |
| `/api/access/restore`     | POST     | Same lookup on another device; never creates a second customer for the same purchase                           |
| `/api/session`            | GET      | Whether the cookie is valid and entitled; returns the CSRF token                                               |
| `/api/progress`           | GET, PUT | Read the synced Save; merge a Save in (the server owns `rev`; a stale `baseRev` is merged and flagged `stale`) |
| `/api/premium/adventures` | GET      | The premium library, only for an entitled session                                                              |
| `/api/account/export`     | POST     | Download the synced progress as JSON                                                                           |
| `/api/account/delete`     | POST     | Delete the synced record and the purchase lookup (body `{"confirm":"DELETE"}`)                                 |

Modules: `api.ts` (handler), `provider.ts` (checkout interface, Gumroad adapter, test provider, selection), `session.ts` (cookie, CSRF, same-origin check), `store.ts` (customer records, compare-and-set), `kv.ts` (Blobs layer with etags; in-memory twin for tests), `crypto.ts` (HMAC, AES-GCM seal, key derivation), `limits.ts` (rate limiter), `config.ts` (environment and store naming), `netlify.ts` (wiring).

Flow:

1. **Activate.** The handler checks the code format, asks the provider to verify it (the code is sent only in a POST body), hashes the provider's purchase reference with `PP_DATA_KEY`, finds or creates the customer, merges the device's Save, stores the sealed code, and sets the session cookie. A refunded, disputed or revoked purchase answers 403 with a reason; a provider outage answers 503 and never grants or revokes.
2. **Use.** Every later call reads the customer id from the signed cookie only. At most every 24 hours the server re-verifies with the provider; a non-valid result switches premium off while keeping progress.
3. **Restore.** Same as activate from a new device; the same purchase hash finds the same customer.

## Stores (Netlify Blobs, strong consistency)

| Store             | Keys                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customers-<env>` | `customer/<cus_id>` = {v, id, save (Save v2), entitlement {purchaseRefHash, status, createdAt, lastVerifiedAt, sealed code}}; `purchase/<hash>` = {cus} |
| `premium-<env>`   | `index` = {v:1, ids}; `adventure/<id>` = one adventure                                                                                                  |

`<env>` is `production` only when the deploy context is `production`; every other context is `preview`. Older v1 records are upgraded on read.

**Conflict rule:** create with `onlyIfNew`, update with `onlyIfMatch` (etag). On a lost race re-read, re-apply with `merge()` and retry up to 6 times, then 503 `busy_retry`. Two devices writing at once both survive.

## Security controls

- Cookie `pp_session`: signed (HMAC-SHA256, key derived from `SESSION_SECRET`), constant-time compare, 30-day expiry, HttpOnly, Secure, SameSite=Lax.
- CSRF: same-origin `Origin` required (a missing one is refused) plus `x-pp-csrf`.
- License codes are never in URLs, logs or responses; logs hold event names and reason codes only.
- Request bodies over 64 KB are refused. Per-IP limits (12 access attempts and 120 other calls per minute) are held in function memory: best effort per instance, not global.
- Test provider only when `PP_ALLOW_TEST_PROVIDER=1` in `dev`, `deploy-preview` or `branch-deploy`.
- Fail closed: no valid `SESSION_SECRET` (32+ characters) means 503.
- Premium text is absent from the repository, the bundle and public files.
- `netlify.toml` sets `no-store` for `/api/*` and static security headers.

## Build and deploy

`netlify.toml`: `npm run build`, Node 22, functions directory `netlify/functions`, build-skip rule, cache headers for hashed assets, 410 responses for retired addresses (served from `public/gone.html`) and a few 301s. CI (`.github/workflows/ci.yml`) runs install, type check, lint, tests, the build-skip test and the build.

## Known limits and UNVERIFIED items

- **Gumroad:** the verify URL, parameter names, response fields (success, purchase id, refunded, chargebacked, disputed, dispute_won, license_disabled), the unknown-key status code, and `increment_uses_count=false` behaviour are written from the documented shape and are **UNVERIFIED** (CW-PAY-1).
- **Netlify:** that `/api/*` reaches the Function ahead of the TanStack Start server, what `context.deploy.context` contains on this site, and that the build output and the Function deploy together with the current `publish` setting (`dist`) while the local build writes `.output/`, are **UNVERIFIED** until a preview deploy (CW-NET-5). Blobs billing, persistence and etag behaviour against the real service are **UNVERIFIED** (CW-NET-2).
- **Browser wiring:** the browser does not yet call `GET /api/premium/adventures` or `PUT /api/progress`; discovery runs on the free library with `unlocked: false`. Activation returns and merges the synced Save.
- The `[[headers]]` block for `/api/*` may not apply to Function responses; the handler sets `no-store` itself.
- Server-side the code is kept sealed to allow the 24-hour re-check; see decision D6.
