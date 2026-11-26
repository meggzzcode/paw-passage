# Decisions

Current architecture and commercial decisions. Each entry states the decision and the reason. Status is **Decided** (implemented in code), **Hypothesis** (to be validated) or **Open** (needs the owner or an external fact).

## Product

| #   | Decision                                                                                                                                                                        | Status  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| P1  | One product: The Adventure Passport (Paw & Passage). A collectible, self-paced set of dog adventures. Free samples, one-time purchase for the full library.                     | Decided |
| P2  | No AI or generative APIs. Content is written by people; selection is a fixed, explainable rule set, so results are reproducible and free to run.                                | Decided |
| P3  | No accounts for the free experience and no subscriptions. Free progress is stored on the device. Paid access is a license code, not a login.                                    | Decided |
| P4  | Hard eligibility: a known conflict excludes an adventure; a missing fact holds it behind a question. Unknown is never safe. Ranking, randomness and filters cannot override it. | Decided |
| P5  | Breed is never an eligibility input. It is a tiny soft ranking hint for scent games only.                                                                                       | Decided |
| P6  | Photo privacy: keepsakes are drawn on the device. Photos are never uploaded, stored, logged, sent to analytics or included in a Save.                                           | Decided |
| P7  | No streaks, timers, scores or leaderboards. Milestones are capped to the delivered library size so each is reachable.                                                           | Decided |
| P8  | Affiliate links are limited to verified Amazon products, shown only when approved, with a disclosure.                                                                           | Decided |

## Stack and content

| #   | Decision                                                                                                                                                                                                                      | Status  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| S1  | TanStack Start (React, Vite, Tailwind) deployed on Netlify, with Netlify Functions for the API and Netlify Blobs for data.                                                                                                    | Decided |
| S2  | The repository is **public**, on purpose. It contains no premium adventure text, no secret and no customer data. Premium content lives in a private store (Blobs) and is delivered only by the server to an entitled session. | Decided |
| S3  | Public content is plain files under `content/`, validated at build time against zod schemas. Pages CMS (`.pages.yml`) edits them. A malformed file fails the build, naming the file and field.                                | Decided |
| S4  | Adventure schema v2 with controlled lists (no free-text tags); a permanent id that never changes; one file per adventure named by its id. Only `access: free` files may exist in the repository.                              | Decided |
| S5  | Premium adventures are imported and exported by owner-run local scripts, not by any web endpoint, from a JSON file kept outside the repository.                                                                               | Decided |
| S6  | The build skips only for pushes that change nothing but `docs/`, `.github/` or root Markdown, to save credits; everything else builds.                                                                                        | Decided |

## Data, sessions and security

| #   | Decision                                                                                                                                                                                                                                                                                                                                            | Status            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| D1  | Netlify Blobs, site-wide stores, strong consistency: `customers-<env>` and `premium-<env>`.                                                                                                                                                                                                                                                         | Decided           |
| D2  | Conflict rule: creation is `onlyIfNew`; updates are `onlyIfMatch` on the etag. On a lost race the server re-reads, re-applies the change with the order-independent `merge()` (set union with timestamps and tombstones) and retries up to 6 times, then answers 503 `busy_retry`. The server owns the revision counter; a client can never set it. | Decided           |
| D3  | Customer ids are random (`cus_` plus 16 random bytes in hex), created on the first successful verification and independent of the checkout provider. The provider's purchase reference is stored only as a salted HMAC; the same purchase always maps to the same customer.                                                                         | Decided           |
| D4  | Session: cookie `pp_session`, HMAC-SHA256 signed, 30-day expiry, HttpOnly, Secure, SameSite=Lax, carrying only the customer id and expiry. The browser never names a record.                                                                                                                                                                        | Decided           |
| D5  | CSRF: state-changing calls need a same-origin `Origin` header and an `x-pp-csrf` token derived from the session.                                                                                                                                                                                                                                    | Decided           |
| D6  | License codes travel only in a POST body to the provider. They are never in URLs, logs, analytics or responses. The record keeps the code AES-256-GCM sealed solely so the 24-hour re-verification can run; if hash-only storage is preferred, remove it and accept that refund detection then needs the customer to restore again.                 | Decided (revisit) |
| D7  | Checkout provider interface: the server knows only `verify(code)` returning valid, invalid, refunded, disputed, revoked or unavailable. Gumroad is the first adapter. `unavailable` never grants or revokes.                                                                                                                                        | Decided           |
| D8  | Test-provider rule: a deterministic test provider exists only when `PP_ALLOW_TEST_PROVIDER=1` **and** the deploy context is `dev`, `deploy-preview` or `branch-deploy`. Production or an unknown context cannot construct it.                                                                                                                       | Decided           |
| D9  | Environment isolation: only a `production` deploy context uses `*-production` stores; every other context uses `*-preview`. Previews never read or write live customers or premium content.                                                                                                                                                         | Decided           |
| D10 | Every `/api/` response is `Cache-Control: no-store`; bodies over 64 KB are refused; saves are validated; per-IP rate limits are best effort per function instance. The API fails closed (503) if `SESSION_SECRET` is missing or shorter than 32 characters.                                                                                         | Decided           |
| D11 | Refunds, disputes and revoked keys switch premium off (403) at the next re-check (at most every 24 hours); progress is kept. Customers can export or delete their synced record.                                                                                                                                                                    | Decided           |
| D12 | Analytics: a fixed list of 15 named events with slug-safe fields only. No names, memories, codes, emails or customer ids.                                                                                                                                                                                                                           | Decided           |

## Commercial

| #   | Decision or hypothesis                                                                                                                                                                                                                                       | Status     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| C1  | Checkout and tax handling by Gumroad. The owner creates the account and product (CW-PAY tasks). Gumroad's license verification details are not yet verified against its live documentation (CW-PAY-1).                                                       | Open       |
| C2  | One-time price. Hypotheses to validate, not facts: **$14.99 introductory** and **$19.99 standard**. No price appears in code; it is set in Gumroad.                                                                                                          | Hypothesis |
| C3  | Validation thresholds, proposed as screening thresholds, **not benchmarks**: reach 100 visitors; 20 of them interact with an adventure; 5 saves, shares or returns; then 3 purchases. Missing a threshold means look at the cause, not that the idea failed. | Hypothesis |
| C4  | No new fixed monthly cost beyond the existing Netlify plan and the domain. The Gumroad fee is per sale (rate **UNVERIFIED** here).                                                                                                                           | Decided    |
| C5  | The free set must stand alone as a real, working passport so the paid library is an addition, not a toll gate.                                                                                                                                               | Decided    |

## Open items

- Verify the Gumroad license API fields and behaviour (CW-PAY-1) and replace every UNVERIFIED comment in `src/server/passport/provider.ts`.
- Confirm Netlify Blobs metering, persistence across deploys and etag behaviour on the owner's plan (CW-NET-2, CW-NET-5).
- Wire the browser to the premium endpoint and to `PUT /api/progress` (see `LAUNCH-CHECKLIST.md`).
