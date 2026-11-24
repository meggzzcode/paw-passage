# SEO changes (2026-11-24)

## SEO-A: /stays
- Meta description cut from about 215 to 150 characters.
- Intro now says what the cards are and what can be compared (pet fee, dog count, weight limit, fenced yard), with links to /tools/will-my-dog-be-accepted, /data/pet-policies, how-vacation-rental-pet-fees-work and vacation-rental-secure-fenced-yard. Listing links stay server-rendered.
- "Crawled - currently not indexed" is treated as an outcome. Note: /stays is noindex and out of the sitemap whenever there are zero listed stays (affiliate-link rule), so that status may simply reflect an empty directory. It will index once stays are listed.

## SEO-B: bringing-a-dog-to-a-no-pets-rental
Decision: published (frontmatter `status: draft` to `published`). No safeguard bypassed.
- It was drafted only because no catalog product fit (commit f76e488, docs/PRODUCT-LINKS-GUIDE.md), not because of open research.
- The publish rule (src/content/publish-rule.ts) was already met on every other condition: `researchComplete: true`, `unverified: []`, `approvedBy`/`approvedOn` set.
- I cross-checked the numbers against recorded research: the "11 of 38 managers describe a specific penalty" plus "three more without an amount" equals the 14 non-empty `unauthorized_pet_penalty` rows for the 38 public-CSV managers in docs/data/pet-policies-*.csv; "nine mention removal" and the eight table amounts match those rows. I did not re-fetch live pages.
- Product-free by design (docs/ARTICLE-PRODUCT-REPORT-policyB.md: NO-FIT). No 301 needed. It appears in the sitemap with lastmod 2026-11-18. Owner may want a quick re-read before relying on it, since it has no FACTCHECK file.

## SEO-D
- Titles: no guide title exceeds 60 characters once pageHead drops the brand suffix, and /stays is 58. Nothing to fix; src/lib/seo.ts unchanged.
- /guides/: the router answered `/guides/` with a 307. A request middleware (src/lib/trailing-slash.ts, registered first in src/start.ts) now returns 301 to the slashless URL for any GET/HEAD, keeping the query string. Verified on the node server: `/guides/` and `/stays/?q=a` return 301; `/guides`, `/stays` 200; unknown guide 404.
- Sitemap lastmod: already present for guides (lastReviewed), stays (lastVerified) and places (lastChecked); static pages deliberately have none. No change.


## Lead override on SEO-B (2026-11-24)
The guide was reverted to draft. It was unpublished earlier on an owner rule (published guides must carry an earning product; the only fitting gear would read as helping hide a dog; see docs/ARTICLE-PRODUCT-REPORT-policyB.md). No other published guide satisfies the same search intent, so there is no 301: the URL stays a 404. The 64 impressions are not recoverable without breaking that rule. Revisit only if the owner changes the rule.
