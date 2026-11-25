# Sitemap count, 2026-11-24

> Superseded (2026-11-24): this is the 95-URL count; the 8 town "things to do" articles bring the sitemap to 103 ([docs/buyer/ROUTE_AND_ASSET_COUNTS.md](ROUTE_AND_ASSET_COUNTS.md)). <!-- SUPERSEDED-NOTE -->


Counted from a production build (`NITRO_PRESET=node-server bunx vite build`), served on port 4196, by fetching `/sitemap.xml` and parsing every `<loc>`.

| Type | URLs |
| --- | --- |
| Home (`/`) | 1 |
| Guides index (`/guides`) | 1 |
| Guides (published, public) | 29 |
| Stays index (`/stays`) | 1 |
| Stays (indexable under the publish rule) | 23 |
| Destinations index | 1 |
| Destination states | 2 |
| Destination towns | 6 |
| Gear hub (`/gear`) | 1 |
| Gear categories | 11 |
| Dogs index | 1 |
| Dog types | 4 |
| Tools index | 1 |
| Tools (checklist, will-my-dog-be-accepted, packing-list) | 3 |
| Data (`/data/pet-policies`) | 1 |
| Trust and legal (about, contact, list-your-property, affiliate-disclosure, privacy, terms, editorial-standards, methodology, corrections) | 9 |
| **Total** | **95** |

## Method and checks

- The total equals the number of `<loc>` entries the live route serves. There are no duplicate URLs.
- Every one of the 95 URLs was fetched from the build: each returned 200, has a self-referencing canonical on `https://www.pawsandpassage.com`, and has no `robots` noindex tag.
- Not in the sitemap on purpose: gear trip views (`/gear?trip=...`, noindex, canonical `/gear`), `/dog-rules` (noindex until a verified place exists), the retired tool URLs (`/tools/cost-calculator`, `/tools/pet-cost-check`, `/tools/host-questions`, which return 301), draft guides and sample stays.
- Rules live in `src/lib/sitemap-entries.ts` and are covered by `src/test/seo-sprint.test.ts`.

## lastmod

- Guides: `lastmod` is the guide's `lastReviewed`. It matches the visible "Last reviewed" date and the Article JSON-LD `dateModified` on all 29 guides (checked on the built pages). All 29 currently read 2026-11-24.
- Stays: a `lastmod` is emitted only when the page shows a real "Last verified" date (status verified plus a date). The stay field is `lastVerified`; there is no `readOn` field on stays. All 23 current stays are unverified, so none has a `lastmod`.
- Verified dog-rule places: `lastChecked`, when present (none are live today).
- Every other page has no `lastmod`; none is invented.
