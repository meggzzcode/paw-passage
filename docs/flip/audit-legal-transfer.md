# Legal, rights and transfer audit (flip sale, ~$1,500 pre-revenue starter asset)

Audited 2026-11-23 against branch `claude/affiliate-setup` (main at b81db6c). Nothing committed, pushed, bought or changed outside these two docs. Not legal advice. Companion: `docs/TRANSFER_CHECKLIST.md`.
Labels: VERIFIED = read or run in this repo today (path given); UNVERIFIED = not checkable from the repo.
Existing docs relied on but stale (dated 2026-11-16 to 18): `docs/SALE-READINESS.md` says "24 guides" (repo: 26 guide files, 23 published, 3 not); the "only Verified stays appear" rule is true in `plugins/content.ts` but all 37 `content/stays/*.yml` are `status: unverified`, so zero stays are live.

## A. Verified blockers (must fix or disclose before the buyer pays)

| # | Finding | Evidence | Status |
|---|---|---|---|
| B1 | Seller affiliate IDs are live in the site: Amazon tag `pawspassage-20`, 33 Vrbo `vrbo.com/affiliate/...` deeplinks, Impact site-verification meta tag. A buyer who publishes as-is sends commissions to the seller and may breach program terms. | `content/settings.yml`; `content/affiliates.yml` (63 uses of `{amazonTrackingId}`); `src/routes/__root.tsx` ~107 | VERIFIED |
| B2 | No copyright assignment path: no `LICENSE`/`COPYING` file, no copyright notice except footer `(c) {year} Paws & Passage` (no owner named). Buyer needs a written assignment of the text, code and documentation. | `ls LICENSE*` fails; `src/components/site/SiteFooter.tsx:107` | VERIFIED |
| B3 | RESOLVED. Home hero `hero-porch*.jpg` was an undocumented AI image. Owner decision: replaced with a credited Unsplash photo (photographer Cody Scott Milewski, Unsplash License, page https://unsplash.com/photos/siberian-husky-lying-on-brown-wooden-floor-ubDougWF758). Unsplash gives usage rights, not ownership or exclusivity. | `src/content/image-credits.ts` (key `hero-porch`); `src/routes/editorial-standards.tsx`; `src/routes/terms.tsx` | Photo page showed the Unsplash License (not Unsplash+) when fetched |
| B4 | Legal pages name no operator, entity, jurisdiction or governing law; Terms has a no-liability clause but no governing-law or dispute clause; "no legal review" was the owner's decision. Not a listing blocker, but a buyer must add their own before relying on them. | `src/routes/terms.tsx`, `privacy.tsx`, `affiliate-disclosure.tsx` (all dated 2026-11-18); grep for jurisdiction, governing, entity, LLC: none | VERIFIED |
| B5 | Disclosure risk: it must not be advertised as earning or as having traffic. Repo supports neither. | `docs/SALE-READINESS.md` (net profit $0) | VERIFIED |

## B. Verified non-blockers (disclose, low risk)

| # | Finding | Evidence |
|---|---|---|
| N1 | No placeholder "starter text" markers in the legal pages (grep for starter, placeholder, TODO). The pages are generic rather than templated. | `src/routes/{privacy,terms,affiliate-disclosure,about,contact,editorial-standards}.tsx` VERIFIED |
| N2 | Masthead "Paws & Passage Editors" is a brand byline, not a person, and About says the owner chose not to publish a bio. This is not owner-specific and transfers cleanly. | `src/routes/about.tsx:24` VERIFIED |
| N3 | `hello@pawsandpassage.com` is the only contact address, set in settings (not hardcoded) and rendered with a graceful fallback if blank. A buyer can change it in one value. Dependence on the Namecheap Private Email subscription is real. | `content/settings.yml`; `src/components/site/ContactEmail.tsx` VERIFIED; subscription status UNVERIFIED |
| N4 | Photos: every guide, gear and destination image key in `src/assets` has an Unsplash credit in `image-credits.ts` (42 entries); the 15 `pack-*.jpg` images are credited in `src/content/pack-photos.ts` (16 entries). The hero (`hero-porch*`) is now credited too (B3 resolved). Unsplash License is non-exclusive and covers commercial use but is use-rights, not ownership; it does not cover trademarks or people's likeness in a photo. | credit-vs-asset comparison run today; `docs/PRODUCT-PHOTOS.md` cites https://unsplash.com/license. License text itself not re-read today (UNVERIFIED). |
| N5 | `public/pins/*` and `public/share/*` (Pinterest and social images) are derived images; their source photos are not recorded per file. Probably Unsplash-derived. | directory listing; provenance UNVERIFIED |
| N6 | Product photos: none from makers (docs record that maker photos need permission and none were added). | `docs/PRODUCT-PHOTOS.md`; no maker images identified in `src/assets` names VERIFIED by listing |
| N7 | Fonts: DM Sans and Fraunces under the SIL OFL, license files shipped. | `public/fonts/OFL-*.txt` VERIFIED |
| N8 | Dependencies (production, `bunx license-checker --production`): 241 MIT, 20 ISC, 5 BSD-3, 4 Apache-2.0, 1 BSD-2, 1 0BSD, 1 Unlicense, 6 MPL-2.0 (`lightningcss` and platform builds, file-level copyleft, unmodified, fine), `caniuse-lite` CC-BY-4.0 (data, attribution kept in package), `argparse` Python-2.0 (permissive), `victory-vendor` MIT AND ISC. No GPL/AGPL/SSPL or proprietary license found. | tool run today, VERIFIED |
| N9 | `@lovable.dev/vite-tanstack-config@2.27.2` (devDependency, MIT licensed per its package.json) is imported by `vite.config.ts` and wraps TanStack Start, Nitro, React and Tailwind plugins. It is a build-time dependency only, published on npm (no Lovable account needed). Risk: single-vendor wrapper; if unpublished or incompatible later the buyer must rewrite `vite.config.ts` to plain plugins. Lovable names also appear in `src/lib/lovable-error-reporting.ts`, `src/start.ts`, `bunfig.toml` (24h-guard exclusions), CI. Package-lock (npm) and `bun.lock` both exist; `npm run build` is what Netlify uses (`netlify.toml`). | VERIFIED |
| N10 | Secrets scan, working tree (excluding node_modules, build output, lockfiles): regex for AWS, GitHub, Stripe, Slack, Google and private key patterns and `key/secret/token/password = long-value` assignments hit only `docs/recovery/08-security-infrastructure.md` and, in history, `content/stays/the-french-secret-romantic-getaway.yml` (the word "secret" in a listing name) and that same doc in commit d98fad6. Inspected with values redacted: they are prose about secret scanning, not credentials. No `.env` or key files are tracked. No secrets found. Absence of `.env` in `.gitignore` was checked: ignore rule present. | VERIFIED (pattern-based; not a substitute for a tool like gitleaks, UNVERIFIED that none was run) |
| N11 | Non-secret identifiers present in public source: GA4 `G-1J97C8CPC1`, Amazon tag, Vrbo links, Impact verification value, Search Console file `public/c020721357f8d6912ac3f66e4c956986.txt`, Netlify site id noted in docs. These are replaceable (see B1). | VERIFIED |
| N12 | Personal data in git history: author email `coderconsults@gmail.com` on 41 commits (author name `meggzzcode`), repo path `meggzzcode/paw-passage` in 9 docs. Not a secret, but a privacy item: disclose, or ship a fresh squashed repo. | `git log --all --format=%ae` VERIFIED |
| N13 | Dataset `public/pet-policies-38-managers.csv`: 38 rows of stated pet policies with `source_page` and `read_on` (2026-11-18). It is published under CC BY 4.0 on `/data/pet-policies`. The facts were taken from manager web pages. Facts are not copyrightable in US law generally, but the managers' site terms of use (some prohibit scraping or reuse) and non-US database rights were not reviewed, and no robots/terms check is recorded (grep of data docs found none). Honest risk: a manager could object; mitigate by keeping sources cited, using short factual fields, offering takedown via Corrections, and not selling it as "licensed". | VERIFIED for content and license claim; legal risk UNVERIFIED |
| N14 | Amazon Associates disclosure sentence is present in code and tested. | `src/test/affiliate-links.test.tsx:78` VERIFIED |
| N15 | CMS: `.pages.yml` exists but its header says it was never opened in the live Pages CMS app. | `.pages.yml` header VERIFIED |
| N16 | Namecheap 60-day lock: not resolved. Existing doc records conflicting sources; one official page fetch today returned an unrelated article, so I did not confirm anything. Domain bought 2026-11-17 (record), so ICANN's initial 60-day registration lock on registrar transfers likely runs to about 2027-01-16 (UNVERIFIED); an in-Namecheap Change Ownership "push" is a different process and is the documented sale route (`docs/DNS-AND-TRANSFER.md` s.6a). | UNVERIFIED |

## C. Fix list

Effort: S under 1 hour, M 1 to 4 hours, L over 4. "Blocks listing" means do not list publicly until done (or disclosed).

### Claude / code

| Pri | Task | Effort | Blocks listing |
|---|---|---|---|
| P0 | Prepare a buyer-neutral "handover" branch or script (not on main): blank `amazonTrackingId`, set all `content/affiliates.yml` links `approved: false` or strip seller URLs, remove Impact meta tag in `src/routes/__root.tsx`, blank `ga4MeasurementId`, remove the Search Console file. Keep a note listing what the buyer re-adds. Owner must approve before merge. | M | No (do at closing), but listing must say IDs are removed at handover |
| P1 | Add `LICENSE` or `NOTICE` text only after the owner decides the terms (for example an all-rights-reserved notice plus assignment on sale). I will not pick a license for the owner. | S | No |
| P1 | Add `docs/flip/ASSET-INVENTORY.md`-style provenance table for hero, pins, share images (needs owner input first). | M | No |
| P2 | Add buyer-facing "replace these values" checklist generator or test that fails if seller IDs remain after a `HANDOVER_MODE` flag. | M | No |
| P2 | Replace `@lovable.dev/vite-tanstack-config` with explicit plugins to remove the single-vendor build dependency. | L | No |
| P2 | Fix stale counts in `docs/SALE-READINESS.md`, `BUYER_HANDOVER.md` (outside my ownership: flag only). | S | No (but do not quote them) |

### Cowork / browser

| Pri | Task | Effort | Blocks listing |
|---|---|---|---|
| P0 | In Namecheap (owner logged in): confirm domain status, expiry, auto-renew, privacy, registrant, and read the official Change Ownership and 60-day lock pages; ask support in writing whether a buyer push or later registrar transfer is locked. Screenshot only, no changes. | M | Yes for a firm closing date, no for listing |
| P1 | Read Unsplash License page and the AI image generator's terms (if known), and record the result. | S | No |
| P1 | Check Amazon Associates, Vrbo/Expedia, Impact, Awin, Pinterest and GA4 terms for assignment and account transfer rules; record. | M | No |
| P2 | Check the 38 managers' terms of use and robots files for reuse limits; record findings in the dataset doc. | L | No |

### Owner-only

| Pri | Task | Effort | Blocks listing |
|---|---|---|---|
| P0 | Decide and state the asset list honestly: pre-revenue, no traffic or income claims, 37 stays unverified (not live), AI-assisted content, seller affiliate IDs removed at closing. | S | Yes |
| P0 | DONE: hero replaced with a credited Unsplash photo. | S | No |
| P0 | Agree to a written bill of sale and copyright assignment (use a lawyer or a standard asset-purchase template; I did not draft one). | M | Closing |
| P1 | Decide the mailbox: transfer hello@ via Namecheap support, or buyer creates their own. Remove personal forwarding and recovery email. | S | No |
| P1 | Decide whether to hand over Pinterest (or delete) and the GA4/GSC properties; decide on a fresh squashed repo versus transferring full history (personal email in history). | S | No |
| P2 | Update legal pages with the buyer's name and governing law after the sale (buyer task). | S | No |

## D. Summary for the listing

Safe to say (VERIFIED): domain, 26 guide files (23 published), 6 tool pages (src/routes/tools.*), 38-manager dataset, documented stack, MIT/permissive dependencies, no secrets found, no traffic or revenue claimed.
Do not say: "24 guides", "verified stays" (none), "licensed dataset", "original photography", any traffic, ranking or earnings figure, "legal reviewed".
