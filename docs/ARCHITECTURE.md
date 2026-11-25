# Adventure Passport: server architecture

Status 2026-11-25. Branch `claude/lucid-davinci-l2fixa`. Nothing here has run against live Netlify or Gumroad.

## Flow

1. **Free:** progress lives in the browser (local state, `src/passport/progress.ts`). No server involved.
2. **Buy:** the owner sells on Gumroad (the checkout provider). The buyer gets a license code by email.
3. **Activate:** `POST /api/access/activate {code, localSave?}`. The function asks the provider to verify the code (without using up a count), derives a purchase reference, hashes it, finds or creates the customer, merges the free local progress into the cloud record, and sets the `pp_session` cookie.
4. **Use:** `GET/PUT /api/progress` sync progress; `GET /api/premium/adventures` returns premium content only to an entitled session.
5. **Restore:** `POST /api/access/restore {code}` on any device finds the same customer through the purchase lookup. A second customer is never created for the same purchase.
6. **Refund:** at most every 24h the server re-verifies with the provider. `refunded`, `disputed`, `revoked` (or a code that became `invalid`) switch premium off (403). Progress is kept. `unavailable` never grants or revokes.
7. **Own your data:** `POST /api/account/export` downloads progress; `POST /api/account/delete {confirm:"DELETE"}` removes the record and the lookup.

Code: pure modules in `src/server/passport/` (`api.ts` handler, `provider.ts`, `session.ts`, `store.ts`, `kv.ts`), wired to Netlify by `src/server/passport/netlify.ts` and the single Function `netlify/functions/api.ts`. Tests: `src/test/server-passport.test.ts` (in-memory KV, fake provider).

## Stores (Netlify Blobs, site-wide, strong consistency)

| Store             | Keys                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customers-<env>` | `customer/<cus_id>` = {progress Save, entitlement {purchaseRefHash, status, createdAt, lastVerifiedAt, sealed code, v:1}}; `purchase/<purchaseRefHash>` = {cus} |
| `premium-<env>`   | `index` = {ids}; `adventure/<id>` = one adventure                                                                                                               |

`<env>` is `production` only when `context.deploy.context === "production"`; every other context (deploy preview, branch deploy, dev, unknown) is `preview`. Previews therefore never read or write production customers or premium content. Premium text is loaded by the owner-run scripts `scripts/premium-import.mjs` and `scripts/premium-export.mjs` from a JSON file kept outside git; it is never in the repo, bundle or public JSON. The synthetic fixture `src/passport/fixtures/premium.synthetic.ts` is for tests only.

## Conflict rule

Creation uses `onlyIfNew`. Updates use `onlyIfMatch` with the etag. On a lost race the server re-reads, re-applies the change with `merge()` (set union with timestamps and tombstones, order independent), and retries up to 6 times, then answers 503 `busy_retry`. Two devices writing at once both survive. The server owns `rev` (incremented only when the merged result differs); a repeated identical PUT changes nothing. A stale `baseRev` is merged and flagged `stale:true`, never rejected.

## Security controls

- Cookie `pp_session`: HMAC-SHA256 signed with a key derived from `SESSION_SECRET`, constant-time compare, 30-day expiry, version field, HttpOnly, Secure, SameSite=Lax; carries only `cus_<16 random bytes hex>` and the expiry. The browser never names a record.
- CSRF: state-changing calls need a same-origin `Origin` header and `x-pp-csrf` equal to a token derived from the session (returned by activate and `/api/session`).
- Raw license codes: sent only in a POST body to the provider, never in a URL, log or response. The customer lookup uses a salted HMAC of the provider purchase reference. The code is also stored AES-256-GCM sealed in the customer record solely so the 24h re-verification can run (see "Decisions to confirm"). Logs contain event names and reason codes only.
- All `/api/` responses are `Cache-Control: no-store`. Bodies over 64KB get 413; saves are checked with `validateSave`.
- Per-IP rate limits (12 access attempts and 120 other calls per minute) held in function memory: best effort per instance, not global.
- A test provider exists only if `PP_ALLOW_TEST_PROVIDER=1` and the context is `dev`, `deploy-preview` or `branch-deploy`; production (or an unknown context) cannot construct it. The server fails closed with 503 if `SESSION_SECRET` is missing or shorter than 32 characters.
- Rotating `SESSION_SECRET` signs everyone out and, unless `PP_DATA_KEY` is set to a stable value first, breaks purchase lookups. Set `PP_DATA_KEY` once before the first real customer and never change it.

## Decisions to confirm

Re-verifying every 24h needs the license code, but the brief said store only a hash. The record therefore keeps the code sealed (AES-GCM, key derived from the secret). If the owner prefers hash-only, remove `codeSealed` and accept that refund detection then needs the customer to restore again.

## Unverified (do not ship until proven)

- Gumroad: verify URL, parameter names, response fields (`success`, `purchase.id`, `sale_id`, `refunded`, `chargebacked`, `disputed`, `dispute_won`, `license_disabled`), status code for an unknown key, `increment_uses_count=false` behaviour, how a key is disabled (CW-PAY-1).
- That the Function path `/api/*` is served by the Function ahead of the TanStack Start server on Netlify, and that `context.deploy.context` has these values in this site (CW-NET-5).
- Blobs billing, persistence and strong-consistency behaviour on this plan (CW-NET-2); `getWithMetadata` returning the etag used by `onlyIfMatch` against the real service.
- The `[[headers]]` block for `/api/*` may not apply to Function responses; the Function sets `no-store` itself.
