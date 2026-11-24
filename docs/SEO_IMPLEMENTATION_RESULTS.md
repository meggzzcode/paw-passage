# SEO implementation results, 2026-11-24

Companion to docs/SEO_ROOT_CAUSE_INVESTIGATION.md. Start commit `a659f05`. Final commit: see the git log entry titled "SEO investigation" on `main` (hash recorded in the final report). **Nothing is deployed**; production still serves the build from about 2026-11-23 (`ced2c93`), verified by fetching the live site on 2026-11-24.

## Fixes implemented (all verified on a local build)

| # | Change | File | Evidence it was needed |
|---|---|---|---|
| 1 | The state page now lists every public "things to do" article with its title and dek | `src/routes/destinations.$state.index.tsx` | `/destinations/california/mendocino/things-to-do` and `.../monterey/things-to-do` were in the sitemap with 0 inbound links; their only linkers (town pages) are `noindex, nofollow`. Crawl: orphans 2 to 0; max click depth 3 to 2; the other six things-to-do pages gain a second inbound link from an indexable page. |
| 2 | `/gear/winter-travel` (301) replaced by `/gear/cold-weather` | `content/guides/cold-weather-dog-gear-for-winter-cabin-trips.md` | Only internal link that passed through a redirect |
| 3 | Dataset link added where the guide already cites the 38-manager sample | `content/guides/puppy-at-a-vacation-rental.md`, `content/guides/can-you-leave-a-dog-alone-in-a-vacation-rental.md` | Dataset page had 9 body inlinks; both guides name "38 managers" or "our dataset" without a link |
| 4 | Car-interior guide linked from the ramp and harness guides | `content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md`, `src/content/guides/dog-car-safety-harness-and-crate-guide.ts` | `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip` had one guide inlink |
| 5 | Fees guide description: colon to semicolon | `content/guides/how-vacation-rental-pet-fees-work.md` | Two colons in one sentence |
| 6 | New tests | `src/test/seo-internal-links.test.ts` (5 tests) | Block legacy gear slugs and retired tool URLs in body links; require dataset links in four guides; guide description colon/length; state page links town reads |

Guide word counts: changed by 0 to 25 words each. No citations, sources, frontmatter links or product picks were touched.

## Before / after metadata

Only one metadata string changed. No titles changed: every title is already at most 60 characters and tied to the question, and there is no query-level data to justify a rewrite (a 236-impression sample on the old build cannot support CTR conclusions).

| Page | Field | Before (HEAD) | After |
|---|---|---|---|
| `/guides/how-vacation-rental-pet-fees-work` | seoDescription (145 chars of text) | How vacation rental pet fees work: we read 38 managers: 22 state a charge, 3 charge $0 and 13 name no amount. See the units and price your trip. | How vacation rental pet fees work: we read 38 managers; 22 state a charge, 3 charge $0 and 13 name no amount. See the units and price your trip. |

Recorded originals for the unchanged pages are in docs/buyer/SEO_TITLES_REVIEW_2026-11-24.md.

## Links added (descriptive anchors, natural sentences)

- State pages (Georgia, California): "What to do with a dog, town by town", one link per public article using the article's own title.
- puppy guide: "listed in our pet policy dataset" to `/data/pet-policies`.
- leave-alone guide: "our pet policy dataset" to `/data/pet-policies`.
- ramp guide: "protect your car interior" to the car-interior guide, in the "What to buy first" list.
- harness guide: "protecting your car interior" to the same guide, in the "Before you leave" list.

## Not changed on purpose
- No guide merged, deleted or redirected (the large-dog merge was already done by the owner).
- No stay quality rule loosened (55 noindex stays are the rule working; section 3 of the investigation).
- `nofollow` on thin stays, stays title ellipsis, uniform `lastmod`, and the mobile lab LCP on `/guides` left alone (reasons in the investigation).
- `netlify.toml`, packing, affiliate and security files belong to other workers; not touched.

## Test results (working tree at commit time, including other workers' edits)
- `tsc --noEmit`: clean.
- `eslint --quiet` on changed files: clean.
- `vitest run`: 59 files, 771 tests passed.
- `NITRO_PRESET=node-server vite build`: succeeds.
- `node scripts/verify-site.mjs http://localhost:4321`: 286 checks passed, 0 failed.
- Crawl of the built sitemap (103 URLs): 0 issues (status, canonical, noindex, H1, title and description length, JSON-LD parse); 0 orphans; 0 broken or redirecting internal links.

## Deployment status
Not deployed. Production comparison table and the `netlify.toml` finding are in the investigation (section 2). After the owner deploys: re-run the crawl against `https://www.pawsandpassage.com`, confirm the retired weight-limit URL returns 301, the 103-URL sitemap, and the two new links; then run the Cowork Search Console brief.

## Browser verification
No in-app browser was used. HTML was verified with `curl` and a local Chromium (Lighthouse and the repo's Playwright LCP script). A visual check of the new state-page section at phone width is still open for Cowork (docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md does not cover it; add it to the post-deploy visual QA).

## Owner and Cowork actions
1. Deploy the final build once (the `netlify.toml` ignore fix is already committed by W2 in `75f7ff1`).
2. Run docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md and return the sanitized results.
3. After deploy, optionally request indexing for the changed URLs (owner decision, at most one per URL).
4. Claim Pinterest and publish pins only after deploy (docs/PINTEREST-SETUP.md).
5. Decide on outreach (investigation section 9); nothing has been sent.
