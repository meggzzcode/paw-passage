# SEO audit (pre-launch, 2026-11-26)

Scope: source, tests and a dev-server check (no production build). This is a readiness review, not a claim that anything is indexed or will rank.

## 1. The ten Journal articles

All ten pass `node scripts/validate-journal.mjs` (400-650 words each, validator-counted), have a unique title, primary query, context key, collection and hero image, alt text, two valid related slugs, a self canonical, `BlogPosting` JSON-LD with Organization author and publisher, a meta description of 155 characters or fewer, and sitemap entries with real `lastmod`. Every `/discover?ctx=<key>` CTA key exists in `ctxPresets`. No article is an orphan (each has an inbound related or body link; reciprocity is partial by design: two related links per article). Safety references: veterinarian, vaccination (AVSAB), heat, ASPCA food list, adult supervision for children. Product claims are consistent: $19.99, one time, yours to keep, one personalized adventure free, no account, email or card; no refund period, no promised future content. One wording fix made: "no expiry" became "no renewals" in the free-things article (avoids a perpetual-service promise).
Mobile check: dev-server screenshots at 390px of puppy-bucket-list, free-things-to-do-with-your-dog and rainy-day-dog-activities (kept in the scratchpad, not the repo): single column, no horizontal scroll, readable type, hero scaled to width.
Guard tests: `src/test/seo-audit-journal.test.ts` (every internal link resolves to a real route, collection or article; CTA ctx, collection, images, reciprocity floor, offer wording, redirects, sitemap).
Limits: the validator's sentence-overlap check against the premium library (owner-machine check, `PREMIUM_DIR`) passed (no premium sentence of 6+ words appears in any article). Facts in articles come from general pet-care guidance and linked sources only; no statistics.

## 2. Folded landing pages and the hub

`netlify.toml` holds ten forced 301s (tests pin ten): six landing pages (doggy-date-ideas, puppy-bucket-list, senior-dog-adventures, free-things-to-do-with-your-dog, weekend-adventure-finder, indoor-dog-adventures), each pointing to an existing Journal slug, plus `/tools` and three retired gear guides (section 4). None of the six landing pages has a route file or sitemap entry. It also holds 46 rules that answer 410. `/things-to-do-with-your-dog` is the kept hub, in the sitemap, and links to all ten articles. No change needed from worker N.

## 3. Legacy content classification

| Page / file                                                                                                                                                   | Decision                     | Purpose                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| /, /discover, /collections (+ each collection), /unlock, /previews* , /faq, /our-story                                                                        | KEEP                         | Product funnel (previews is a route; it is not in the sitemap list, see note)                                                                                            |
| /printables                                                                                                                                                   | KEEP                         | Free printable assets that support the adventures                                                                                                                        |
| /things-to-do-with-your-dog, /journal and articles                                                                                                            | KEEP                         | Informational traffic leading to the free adventure                                                                                                                      |
| /guides index and 13 guides                                                                                                                                   | KEEP                         | Dog travel, car safety, outdoor and gear guides carry the affiliate disclosure and feed the gear hub and packing list (the sole commercial content besides the Passport) |
| /tools/packing-list                                                                                                                                           | KEEP                         | Working tool linked from the guides                                                                                                                                      |
| /gear, /gear/*                                                                                                                                                | KEEP (conditional)           | Listed only when enough products exist (`hasGear`)                                                                                                                       |
| /about, /contact, /privacy, /terms, /refund-policy, /disclaimer, /affiliate-disclosure, /editorial-standards, /methodology, /corrections                      | KEEP                         | Trust and legal pages                                                                                                                                                    |
| Guides with cabin or rental framing (cold-weather gear for cabin trips, dog hiking gear for a cabin vacation, portable fence for rentals, cabin packing list) | REWRITE later (low priority) | Still useful gear advice; titles/intros lean on the retired stays theme. Not changed under the scope freeze.                                                             |

REMOVE: none. All 13 guides are published, interlinked and carry current affiliate/gear value, so no guide was deleted and no new 301/410 is needed. Note: `/previews` is a live public route but is not in `staticPaths`; decide with owner whether it should be indexable (it is a client-rendered browse page).

## 4. Original-site HTTP behavior (owner reference)

Answers 410 Gone (served with `/gone.html`, `noindex`, never redirected to the home page): `/stays*`, `/destinations*`, `/dogs*`, `/dog-rules*`, `/data/pet-policies`, `/list-your-property`, `/tools/{checklist,cost-calculator,host-questions,pet-cost-check,will-my-dog-be-accepted,compare}`, `/pet-policies-38-managers.csv`, `/pins/*`, `/share-towns/*`, and 29 retired rental/cabin/location guides.
Answers 301: `/tools` to `/tools/packing-list`; three retired gear guides to cabin packing list or the lost-dog guide; the six landing pages above to Journal articles.
Valuable-redirect review: none of the 410 guides has a close live equivalent (rental fee, policy or location topics), so no redirect is recommended. If Search Console shows meaningful external links to a specific retired guide, add a one-to-one 301 ahead of the 410 rules; never a blanket redirect.

## Search Console tasks (owner or Cowork)

The consolidated versions are D10 (verify the property), F7 (submit the sitemap, request indexing, inspect the 410 and 301 samples) and F9 (weekly monitoring) in `COWORK-HANDOFF.md`; OD7 is the decision on whether `/previews` should be indexable.

1. Verify the domain property (a DNS TXT record is the sturdiest; an HTML file token exists at public/c0207...txt).
2. Submit https://www.pawsandpassage.com/sitemap.xml once.
3. URL Inspection, then "Request indexing", for `/journal`, the ten articles and `/things-to-do-with-your-dog`; confirm canonical is the page itself.
4. Inspect one retired URL (e.g. /stays) and confirm HTTP 410; inspect `/doggy-date-ideas` and confirm 301 to the article.
5. Monitor Pages (coverage) and Sitemaps reports weekly for the first month; treat "Discovered, not indexed" as normal early on. No ranking outcome is promised.
