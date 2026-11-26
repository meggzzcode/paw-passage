# Policies review (2026-11-26)

Scope: `/privacy`, `/terms`, `/refund-policy`, `/contact`, `/affiliate-disclosure`, `/disclaimer`, checked line by line against the code. This is a factual accuracy review, **not legal advice**. Items marked LEGAL REVIEW need a lawyer before launch.

## What the code actually does (basis for the checks)

- Free progress: browser localStorage only (`pp.save.v1` main save; also `pp.packing.v2`, `pp.plans.v1`, `pp.revealed.v1`, `pp.hemisphere.v1`, `pp.acct.v*` sign-in flag, `pp.install.*`, `pp.push.device`). sessionStorage: `pp.intro.offered`, `pp_campaign` (utm_source/medium/campaign). Nothing is sent to our server.
- Server (Netlify Functions + Blobs): created only after a purchase is activated. Record = random customer id, synced progress, entitlement status, sealed (AES-GCM) license key, HMAC of the purchase reference. Our code never requests or stores the buyer's email. No automatic expiry.
- Cookie: `pp_session` (signed, HttpOnly, Secure, SameSite=Lax, 30 days), set only on activate/restore.
- Self-serve data tools (My Passport, when signed in): "Download account data" (`/api/account/export`) and "Delete account copy" (`/api/account/delete`, removes record, sealed key, lookup and any push record; local data untouched). Local: "Download" backup and "Delete local data".
- Analytics: GA4 loads for all visitors (gtag with default config, so GA sets its own cookies such as `_ga`); named `pp_*` events with slug-only fields (free text is dropped in `track()`).
- PWA service worker and push are PAUSED; the app unregisters old workers and `pp-` caches.
- Photos: processed in the browser, re-encoded through a fresh canvas (metadata dropped); never uploaded.
- Affiliate: all 81 links are Amazon Associates; none in Passport components; no ad scripts anywhere.
- Gumroad: license verification only (`product_id`, `license_key`, `increment_uses_count=false`, which is still marked UNVERIFIED in `provider.ts`).

## Per policy

### Privacy

Checked: storage claims, photo handling, purchase flow, cookie, analytics, hosting, deletion/export, affiliate cookies.
Changed: added a short summary; listed exact local/session storage use; named the cookie and its 30-day life; stated what the server record contains and that it is kept until deleted; named the exact buttons for export and deletion and what deletion does and does not do (purchase stays valid, restore creates a new record); said we do not receive the email from Gumroad; **corrected the cookie wording** (Google Analytics cookies are set for all visitors, so the page lists all cookies); added hosting (Netlify) and in-memory rate limiting; stated PWA/push are off; clarified GA events carry no free text.
Owner decisions: whether deletion requests by email (no sign-in) are honored and how identity is checked (the page asks for the purchase date only); whether to add a cookie consent banner or disable GA cookies.
LEGAL REVIEW: GA4 cookies without a consent banner for EU/UK/CA visitors; CCPA/GDPR rights wording and a named data controller/business address; retention statement ("until you delete it"); children under 13 wording (COPPA).

### Terms

Checked: purchase model, edition, access, refunds, liability.
Changed: "does not expire" now explicitly means no renewals/time limit and is not a promise the service runs unchanged indefinitely (we may change or retire features; export your progress); removed any implied promise of added adventures ("we do not promise to add adventures, features or updates; if we do, they are included"); named Gumroad; pointed to Restore access; clarified keepsake creation is part of the full Passport and the free Passport includes one intro adventure; progress wording ("on your device").
LEGAL REVIEW: limitation of liability, governing law/venue (none stated), consumer-law carve-out, "personal use/household" license, and whether "does not expire" (also in `KEEP_LINE`) is safe wording.

### Refund policy

Checked: against `REFUND_SUMMARY` (a test keeps them aligned) and the entitlement re-check (24h, only when the Passport is used).
Changed: says explicitly the page sets no refund period and the window lives on the checkout listing; refund is issued through Gumroad; re-check is "at most once a day, when you use the Passport"; saved keepsake images stay yours; chargeback warning.
Owner decisions (BLOCKER before launch): the refund period is the owner's choice and must be set on the Gumroad product (Gumroad refund policy setting). Nothing here invents one. Decide who processes refund requests and how fast.
LEGAL REVIEW: consumer-law rights to refunds/withdrawal for digital goods by region; whether Gumroad is the merchant of record (not asserted anywhere).

### Contact

Checked: `src/components/site/ContactEmail.tsx`, `content/settings.yml`, `src/config/site.ts`.
Finding: `contactEmail` is `hello@pawsandpassage.com`. There is no form, phone or chat. **The code cannot prove the mailbox exists or receives mail. This is a BLOCKER until the owner confirms it** (send a test message from outside). If the field is ever blanked, the page honestly says the address is being set up.
Changed: purchase help now starts with Restore access and says what to email; added a data/privacy route; states there is no phone, chat or form; no response-time promise.
Owner decisions: confirm/own the mailbox; optional response-time wording (not added).

### Affiliate disclosure

Checked: body in `src/lib/disclosure.ts` against `content/affiliates.yml` (Amazon only), Passport components (no links), ad scripts (none), and the Impact site-verification meta tag (verification only, no links).
Changed: added that there are no display ads in the Passport or on the site, and the Passport shows no affiliate links.
Open: the Impact verification tag is in the head but no Impact links exist; the page does not mention Impact. Fine while no Impact links go live; revisit if they do.
LEGAL REVIEW: FTC disclosure placement; Amazon Associates operating agreement wording.

### Disclaimer

Checked against product behavior (dog may opt out, eligibility filters). Only tidied a duplicated sentence region (a test pins the enrichment sentence, kept). No medical/behavior claims.
LEGAL REVIEW: scope of "not vet-reviewed" and liability language.

## Messaging audit (price, one-time, free, keepsake, lifetime, refund)

Searched `src/routes`, `src/components`, `src/config`, `content/journal`, `content/guides`. Price appears only via `offer`/`commercial.ts` (plus the ten journal CTAs at $19.99, consistent). No fabricated stats, testimonials, urgency or discounts found; the tagline "A lifetime of little adventures." is brand copy, not a service promise. Free-keepsake wording is consistent (examples only; creation is premium). Fixed: terms implied added adventures are guaranteed. Not changed on purpose: `/unlock` and the homepage repeat the one-payment line several times because `pay-once-copy.test.ts` pins `KEEP_LINE` on both pages; `FreeStarter.tsx` line "the full adventure is yours to keep" refers to the free adventure (fine). Candidate trims for the page owner (W3): `/unlock` shows the pay-once idea in H1, subtitle and `KEEP_LINE`.

## Open questions

1. Refund period on Gumroad (owner). 2. Is the mailbox live (owner/Cowork). 3. Gumroad `increment_uses_count=false` and license response fields are still UNVERIFIED in `provider.ts`; the 24h refund-switch-off claim depends on it. 4. Cookie consent approach. 5. Retention: records never expire; consider a policy for inactive records. 6. Business name/address and governing law for the terms.

The consolidated tasks and owner decisions for these questions are D1 to D3 and OD3 to OD5, OD11 in `COWORK-HANDOFF.md`.
