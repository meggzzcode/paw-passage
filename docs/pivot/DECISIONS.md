# Adventure Passport pivot: baseline, verified facts, decisions

Started 2026-11-25. Authority: owner's "Final product pivot" directive and "Clean rebuild" addendum. Where they conflict with older strategy documents, they win. The older owner rules that still stand: no production deploy, DNS, billing, account or affiliate-account change, no listing publication, and no real charge without separate owner authorization; no secrets in the repo.

## 1. Recoverable baseline (Step 1)
- Pre-pivot commit: `2125a2a` on `main` (all content and docs up to the intent audit Part 2).
- Local annotated tag `pre-pivot-2026-11-25` points at it. **Pushing tags and new branch names is refused (HTTP 403) in this environment**, so the tag exists only in the working copy. The commit itself is permanent on `main`, so recovery is `git checkout 2125a2a`.
- Rebuild branch: `claude/lucid-davinci-l2fixa` (the only extra branch name this session may push). It starts at `2125a2a`. `main` is untouched by the rebuild until the owner authorizes replacement.
- Production: still runs the deploy built from `main@f02e4f9`. Rollback = Netlify "Publish deploy" on that deploy (no build, no credits). Not rehearsed by this session; Cowork task CW-NET-3.
- Netlify builds are set to Stopped, so pushes to the rebuild branch should not spend credits. Verify (CW-NET-1) before relying on it.
- Nothing is deleted: Netlify project, domain, analytics, Search Console and affiliate accounts are unchanged.

## 2. Verified infrastructure facts (read 2026-11-25)
Netlify Blobs (docs.netlify.com): default is eventual consistency (updates reach all edge locations within 60 seconds); strong consistency can be requested per store or per read, at the cost of slower reads. `set` and `setJSON` support `onlyIfMatch` (etag) and `onlyIfNew` and return `{ modified, etag }`, so atomic compare-and-set is available. Without a condition, last write wins. `getStore` is site-wide and persists across deploys; `getDeployStore` is per-deploy (do not use for customers). Works from Functions. Key limit 600 bytes, object 5 GB, metadata 2 KB (read from a summary, not verbatim).
- **Not verified:** whether Blobs is billed or metered in credits on Personal. The pricing page lists no Blobs line. Cowork CW-NET-2 must read the team's billing page.
Netlify Personal: $9/month, 1,000 credits. Credit costs: production deploy 15; compute 10 per GB-hour; bandwidth 20 per GB; web requests 2 per 10,000. Functions have no per-invocation price listed; their cost is compute plus requests. Credit packs and auto recharge exist, so auto recharge must stay off (CW-NET-1).
Gumroad: pricing page says 10% + $0.50 per direct sale, 30% via Discover, no monthly fee, merchant of record for tax since 2025-01-01. **Not verified (pages did not render):** the license verify endpoint, increment_uses_count, refunded/chargeback fields, key disabling, uses limits, account/product transfer rules. The pivot's design is therefore written behind a checkout adapter interface and must not ship until CW-PAY-1 confirms these from the live documentation.

## 3. Architecture decisions
1. **Keep the framework** (TanStack Start, Vite, React, Tailwind, Netlify). Replace the customer-facing routes, layout, navigation and design system; keep the content pipeline, SEO helpers, redirects, analytics wrapper and affiliate system where they serve guides.
2. **One adventure library, stable IDs, validated by schema** at build and in CI. Free adventures (10 to 15) are public static content. Premium adventures are **never** shipped in client bundles or public JSON.
3. **Premium content privacy (blocking decision).** The GitHub repository is public today (`private: false`). If the premium adventures sit in the repo, anyone can read them. Options: (a) make the repo private (the owner already had this on the closing list; Netlify and Pages CMS keep working with a private repo, but verify CW-GH-1); (b) keep premium text in a private second repository or in Netlify Blobs seeded by a private script, with the public repo holding only free content and the schema. Recommended: (a). Until the owner chooses, premium adventure text is **not committed**; the engine is built against free content and fixtures.
4. **Storage:** Netlify Blobs, site-wide store, strong consistency for customer records, `onlyIfMatch` revision writes, plus a server-side merge of completion sets (additions are set unions, removals carry tombstones) so two devices cannot erase each other. Fallback if Blobs proves metered or unreliable: decide with owner, no new subscription without approval.
5. **Access:** checkout provider adapter (Gumroad preferred); a Function verifies the code once without incrementing use counts, derives an opaque customer ID server-side, and sets a signed HttpOnly SameSite session cookie. The browser never names a record ID. A test adapter exists only in test builds and is excluded from production by build flag and tested for absence.
6. **No AI API, no accounts, no subscriptions, no new fixed cost.**
7. **Honest scope:** counts shown on the site equal the delivered, validated counts. Target is a coherent working product, not 100 padded adventures.

## 4. Asset audit (Step 2), first pass at area level
| Area | Decision | Note |
|---|---|---|
| TanStack Start/Vite/Tailwind/Netlify setup, `plugins/content.ts`, `src/start.ts` security headers, tests harness | KEEP | |
| Content schema and publish rule, citations, SourcesList | KEEP for guides; REBUILD for adventures (new schema) | |
| Affiliate system (`affiliates.yml`, `products.yml`, notice components, Amazon sentence) | KEEP + REFACTOR | one disclosure style, reused by adventure product cards |
| 29 Markdown + 7 TypeScript guides | KEEP/IMPROVE the travel, road-trip, hiking, gear, safety guides; MERGE or REDIRECT rental-fee/policy guides that only served the lodging directory | per-URL table due in Phase 5; no blanket redirects to home |
| Stays directory (83 files), town and destination pages, `/data/pet-policies`, dog-rules, `/list-your-property`, Stay22 map, Vrbo logic | ARCHIVE (kept in Git history, removed from active tree) | redirect URLs with real ranking only after the per-URL table; 404 the rest |
| Packing planner (`src/lib/packing`, `/tools/packing-list`) | REFACTOR into a Road Trip Adventures free tool | strong existing asset |
| Other tools (cost calculator, host questions, will-my-dog-be-accepted, pet-cost-check) | ARCHIVE | lodging-specific |
| Gear catalog and product pages | REFACTOR into adventure-linked recommendations | verified Amazon records kept |
| SiteHeader/Footer, home, about, layout, `styles.css` | REBUILD | new design system |
| Analytics wrapper, error capture, skip link, favicon set | KEEP (rebrand favicon later) | |
| `.pages.yml` (221 name entries) | REFACTOR: add adventures, collections, achievements, campaigns; remove stays/places collections | |
| docs/ (about 150 files: CLAIMS, FINAL, buyer, cowork, editorial) | ARCHIVE to Git history; replace with the 11 canonical documents | do last, after the product exists |
| Netlify config (build ignore, headers, redirects) | KEEP + extend (functions, cache rules, no-store for customer routes) | |

## 5. Plan and honest sequencing
This is multiple weeks of work if done properly; the 5 to 7 day sprint is a scope cap, not a promise. Order: (1) schema, design system, free engine (profile, ranking, reveal, completion, passport, achievements, local state, keepsakes); (2) commercial layer behind adapters with a test provider; (3) content: free set first, then premium; (4) migration, SEO, CMS, docs; (5) Cowork handoff; (6) QA; (7) verdict. No production replacement, no live checkout and no real charge without owner authorization; none of that has happened.

## 6. Owner decisions needed now
1. Make the repository private (recommended) or choose option (b) above. Blocks all premium content.
2. Confirm the pre-pivot tag limitation is acceptable (recovery by SHA `2125a2a`), or push the tag yourself.
3. Confirm the Gumroad account owner/payout setup will be done by you with Cowork (CW-PAY tasks), not by me.
