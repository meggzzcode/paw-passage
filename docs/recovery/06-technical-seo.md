# 06 Technical and on-page SEO audit (2026-11-18)

Evidence base: live crawl of https://www.pawsandpassage.com on 2026-11-18 (all 47 sitemap URLs plus extras, fetched with a Googlebot UA; raw HTML in the scratchpad), Playwright/Chrome rendering (mobile throttled and desktop), Lighthouse 12 (mobile default), and repo source. No repo file other than this report was changed.

## Summary

1. VERIFIED: Architecture is sound for search. Every page returns full server-rendered HTML (title, meta, canonical, JSON-LD, full article text). Raw-HTML text equals Playwright-rendered text on all four pages diffed (guides: 3,339 and 4,781 words in both). No JavaScript is needed to index articles. No architectural rewrite is warranted.
2. VERIFIED: Lighthouse mobile: SEO 100, best-practices 100, accessibility 96-97, performance 80 (home) and 73 (guide). LCP 3.5-3.9 s, FCP 3.1-3.7 s, TBT 240-310 ms, CLS about 0.003. Mobile performance is the main technical weakness, and it comes from a render-blocking Google Fonts stylesheet and about 350 KB of guide text shipped to every page.
3. VERIFIED: 24 guides, each has one H1, unique title and description, absolute canonical, an Article, Breadcrumb and FAQ JSON-LD block, and a 1200x630 share image (all 25 files in /public/share are exactly 1200x630, 73-161 KB, live 200).
4. VERIFIED bug: town pages (/destinations/georgia/blue-ridge) are indexable (no robots tag) but not in the sitemap. Their noindex rule uses `visibleStays()` (includes unverified), contradicting AGENTS.md and the sitemap rule. They also link to two redirected tool URLs.
5. VERIFIED: Breadcrumb `item` and Article `mainEntityOfPage` in JSON-LD are relative paths ("/guides/..."), where Google's examples all use absolute URLs.
6. VERIFIED (Google docs, read 2026-11-18): the FAQ rich result is discontinued ("no longer appear in Google Search starting May 7, 2026"). The FAQPage JSON-LD on 24 pages gives no search benefit; it is harmless but dead weight and carries brand names (see 7).
7. SUSPECTED compliance risk: no brand name is in any title/description/og/twitter meta (VERIFIED on all pages), but "Vrbo"/"Expedia" appear in FAQPage and Article JSON-LD text on 10 guides. Expedia 12.7 is about meta tags; JSON-LD is arguably not, but ask or strip.
8. VERIFIED: 7 of 24 guides are linked only from the /guides index (no contextual inbound link). Three tools and /data/pet-policies are well linked; /about, /privacy, /terms rely on footer only.
9. VERIFIED: titles over about 60 characters on several index pages; the home description is 182 characters; non-guide pages all share one 1600x907 hashed-URL og:image (hero-porch).
10. RECOMMENDATION: sustainable gains are (a) fix town-page indexing/links, (b) retitle guides whose seoTitle drifts from the H1 intent, (c) add inbound links to the 7 thin-linked guides and tighten cannibalizing clusters (fees, large dogs/weight limit), (d) self-host fonts and split guide bodies out of the entry bundle.

## 1. Rendering and indexability

| Check | Result | Evidence | Label |
|---|---|---|---|
| Server HTML contains article, title, meta, JSON-LD without JS | Yes | curl Googlebot UA on /guides/vacation-rentals-with-no-pet-fee: 90,849 bytes, 16 H2, text "Sliding Rock" present, 4 ld+json blocks. Rendered DOM identical in word count and title | VERIFIED |
| Tool pages server content | Thin by design (147-550 words), interactive client-side | /tools/will-my-dog-be-accepted raw = rendered 147 words | VERIFIED |
| Status codes | 200 for all 47 sitemap URLs; unknown path 404 (e.g. /nonexistent, /dog-rules/x, /index.html); retired guide 301 to target | status.txt | VERIFIED |
| Host canonicalization | http to https 301, apex to www 301 | curl | VERIFIED |
| Trailing slash | /guides/ gives 307 (temporary) to /guides; /Guides serves 200 with canonical /guides; ?utm=1 serves 200 with clean canonical | curl | VERIFIED, minor |
| Canonicals | Absolute https on all indexable pages | live HTML | VERIFIED |
| robots.txt | Allow all, Sitemap line present. Fine | /robots.txt | VERIFIED |
| Noindex controls | /stays, /stays/* (unverified), /dog-rules: `noindex, nofollow`; not in sitemap. Correct per AGENTS.md | live HTML | VERIFIED |
| Draft handling | Preview/branch deploys set SHOW_DRAFTS=false; root adds noindex only when drafts are shown (src/routes/__root.tsx:77-78; netlify.toml) | repo | VERIFIED |
| Town pages indexability | BUG: `src/routes/destinations.$state.$town.tsx:24` sets `noindex: !visibleStays().some(...)`. `visibleStays()` includes unverified stays (src/content/stays/index.ts:18-22), so /destinations/georgia/blue-ridge has no robots tag, while sitemap-entries.ts:16,23 only lists towns with verified stays. Page is a 882-word thin planning page with a Stay22 map | live HTML | VERIFIED |
| Hydration comment hack | __root.tsx strips head comments Netlify injects; Netlify also appends `/.netlify/scripts/hud` script after `</html>` (free plan) | live HTML | VERIFIED, low risk |

## 2. Sitemap

VERIFIED: 47 URLs, valid urlset, content-type application/xml, no priority/changefreq (good). The 24 guides all carry `<lastmod>` (7 at 2026-11-16, 17 at 2026-11-18) taken from `lastReviewed`; static pages, destinations and dog-type pages have none. Excludes noindexed pages and redirects. Guide Article `datePublished` equals `lastReviewed` on the 17 newer guides and `dateModified` equals `datePublished` everywhere, so lastmod is consistent with the markup. Accuracy depends on editors only bumping `lastReviewed` after substantive fact-checking; Google ignores lastmod it finds unreliable. RECOMMENDATION: add a CI/content test that fails if `lastReviewed` changes without a body or sources change (not built; needs approval because it touches tests/process).

## 3. Titles and descriptions (all public pages scripted)

- No duplicate titles or descriptions across 46 live 200 pages (VERIFIED, scripted).
- Brand rule: pageHead appends " | Paws & Passage" unless the title already contains the site name (src/lib/seo.ts:19). No Expedia-family name in any `<title>`, description, og or twitter tag on any crawled page (VERIFIED). src/test/meta-brands.test.ts checks only guides' seoTitle/seoDescription, not page-level `pageHead` calls on dogs/destinations/tools routes or JSON-LD.
- Lengths (title chars including suffix): all guide titles 53-59 (good). Over about 60: home 61, /destinations 68, /destinations/california 71, /guides 74, /dogs 87, /data/pet-policies 64, /tools/will-my-dog-be-accepted 67, /destinations/georgia 63. Noindexed /dog-rules 76 and /stays 58 do not matter.
- Descriptions over 160: home 182, /tools 189, /tools/pet-cost-check 169, /data/pet-policies 161. Guide descriptions 132-155 (good). Destination page descriptions reuse blurbs (California blurb is cut off at about 155 by design; the Georgia one is a scenic blurb rather than a search-intent description).
- Weak/unclear short titles: /about "About Paws & Passage", /contact, /privacy and /terms are fine for utility pages.

### Title versus intent per guide (seoTitle | H1)

The seoTitle often differs materially from the H1 and slug. Where the title drifts, the page can rank for the wrong query or underperform on the slug's query.

| Guide | seoTitle | H1 / slug intent | Issue |
|---|---|---|---|
| vacation-rentals-with-no-dog-weight-limit | "Dog Weight Limits at 38 Rental Managers" | "Vacation Rentals With No Dog Weight Limit..." | Title targets "weight limits" (competes with large-dogs guide); slug and H1 target "no weight limit". Drift |
| vacation-rentals-that-welcome-large-dogs | "Large Dog Rental: 5 Checks Before You Book" | "How to Find Vacation Rentals That Welcome Large Dogs" | Prior audit says no five-item list exists; the description also says "five checks" (live). Title promise unverified against body |
| airbnb-pet-damage-charge-after-checkout | "Airbnb Pet Damage Charge: 24h, 14d, 60d" | "Charged for Pet Damage After Checkout?..." | Jargon, not natural query text. Brand rule prevents "Vrbo", but "Pet damage charge after checkout" (no abbreviations) matches the query |
| if-your-dog-gets-loose-on-a-trip | "Dog Escaped on a Trip: First Hour Plan" | "If Your Dog Gets Loose on a Trip..." | OK, though "dog lost while traveling" intent is not in title |
| dog-car-safety-harness-and-crate-guide | "Crash-Tested Dog Harness? How to Verify It" | "Dog Car Safety: How to Choose..." | Narrower than slug; fine but loses "dog car safety/crate" |
| dog-friendly-cabin-packing-list | "Dog Cabin Packing List: Ticks, Bears, Cold" | "What to Pack for a Dog-Friendly Cabin Vacation" | Acceptable |
| how-vacation-rental-pet-fees-work | "Vacation Rental Pet Fees: What 38 Show" | "How Pet Fees Actually Work..." | "What 38 Show" is vague ("38 what?") |
| vacation-rentals-with-no-pet-fee | "...No Pet Fee: 3 of 38" | strong, specific | OK |

Titles ending "?" or listing three abbreviations read as clickbait fragments in SERPs; prefer a plain query-first title.

## 4. Headings

VERIFIED: exactly one H1 on every one of the 46 crawled pages (including the 404 page). Guides have 11-19 H2s with H3 under them. Skipped levels: /stays and /tools/checklist have H1 then H3 (no H2); minor. Images: 4 destination card images per state page have `alt=""` (decorative cards, acceptable if the link text names the guide; verify). All guide images have non-empty alt. Home 7 images, 0 missing alt.

## 5. Keyword targeting and cannibalization

Primary query per guide is inferred from slug/H1 (no Search Console data exists; every ranking judgment is an estimate, SUSPECTED).

| Cluster | Guides | Overlap | Recommendation |
|---|---|---|---|
| Pet fee amounts | how-vacation-rental-pet-fees-work, what-a-dog-really-costs, vacation-rentals-with-no-pet-fee | "pet fee" vs "total cost" vs "$0 fee". Three tables overlap (previous audit confirmed shared tables) | Keep three, make each own one query: fees-work = "how pet fees are charged" (units, caps); costs = "total trip cost" (cleaning, deposit, taxes); no-fee = list. Cross-link with descriptive anchors; remove duplicated tables |
| Large dogs | vacation-rentals-that-welcome-large-dogs, vacation-rentals-with-no-dog-weight-limit, /dogs/big-dogs hub | Highest overlap: "large dog rental" and "weight limit" are the same searcher | Large-dogs = "how to find / vet"; weight-limit = "exact manager limits". Retitle per section 3 so titles do not collide. Hub /dogs/big-dogs should link to both |
| Dog count | how-many-dogs (absorbed two-dogs via 301), /dogs/multi-dog-families | Low after merge | OK |
| Fenced yard | vacation-rental-secure-fenced-yard, portable-dog-fence-and-playpen, if-your-dog-gets-loose, vacation-rental-with-a-reactive-dog, /dogs/escape-artists | Moderate; intents differ (verify yard / substitute / emergency / behavior) | Keep; ensure each links to the others once |
| Pre-booking checks | pet-friendly-vacation-rental-checklist, pet-friendly-listing-red-flags, /tools/checklist | Checklist guide vs printable tool vs red flags | Guide = 8 questions; tool = printable; red flags = listing review. Tool page title "Dog-friendly rental checklist (printable)" is close to the guide title; differentiate with "printable PDF" intent only |
| Platform rules | airbnb-pet-damage-charge, bringing-a-dog-to-a-no-pets-rental, how-many-dogs | Shared platform text | Low |
| Gear | dog-friendly-cabin-packing-list, dog-travel-first-aid-kit-guide | First aid duplicated in packing list (prior audit) | Keep; link packing to first-aid for kit contents |

The two retired-guide redirects to `/destinations/california` and `/destinations/georgia` (netlify.toml) send long-tail "Los Angeles getaway" and "Atlanta getaway" queries to a state page that does not answer them; acceptable for 301 hygiene but expect those URLs to drop as soft 404s.

## 6. Internal links (main content only, nav/footer excluded; scripted)

VERIFIED inbound counts of unique linking pages: home 46, /tools/checklist 32, /tools/pet-cost-check 29, /guides 25, /editorial-standards 27, fees guide 23, checklist guide 23, how-many-dogs 22, /tools/will-my-dog-be-accepted 18, fenced-yard 17, leave-alone 13, large-dogs 12, packing list 11, no-pets 10, /tools/packing-list 9, damage charge 8, /data/pet-policies 7.

Weak: seven guides have exactly one inbound link (from /guides only): can-dogs-go-in-a-rental-pool-or-hot-tub, christmas-week-in-a-cabin-with-a-dog, pet-friendly-listing-red-flags, puppy-at-a-vacation-rental, vacation-rental-with-a-reactive-dog, vacation-rentals-with-no-dog-weight-limit, what-a-dog-really-costs-on-a-vacation-rental. None is a true orphan (all in /guides and the sitemap), but they receive no contextual equity, and several are the highest-demand opportunities listed in docs/audit/AUDIT-SUMMARY.md. The home page links only 4 guides. Anchor text for tools is consistent but repetitive: "will my dog be accepted?" appears 19 times, which is fine; guide-to-guide anchors mostly use the full title.

Redirect links: town pages link to `/tools/cost-calculator` and `/tools/host-questions`, both 301 to `/tools/pet-cost-check` (VERIFIED live). Site-wide nav and home link `/stays` (noindex, nofollow); home links 3 individual unverified `/stays/*` pages; wasted crawl, minor.

External links: all `target=_blank` links carry `rel="noopener noreferrer"`; none carry `nofollow`/`sponsored` (correct: citations are editorial and no affiliate links render today). One non-https source link (http://cuddleupcabinrentals.com/Cabin-Rentals-Pet-Friendly.php on /data/pet-policies); verify whether an https version exists. 24 Pinterest share links and 15 Unsplash credit links (packing tool) are fine. Docs note `noreferrer` should be dropped from Expedia affiliate links when they exist (AUDIT-SUMMARY 5.3); help.vrbo.com citation links are not affiliate links.

## 7. Structured data (checked against Google docs read 2026-11-18)

| Type | State | Verdict |
|---|---|---|
| Organization (every page, __root.tsx) | name, slogan, description only; no url, logo, sameAs | VERIFIED valid but minimal. Add `url` |
| Article (guides.$slug.tsx:36) | headline, description, datePublished, dateModified, author Organization "Paws & Passage Editors", publisher, mainEntityOfPage | Google: no required properties; recommended author (+url), dates ISO 8601 with timezone, headline, image. Missing `image`; dates are date-only (no timezone); `mainEntityOfPage` is relative; author has no `url`. Headline is the long H1 (up to 86 chars; no fixed limit). Valid, not a rich-result driver. Honest: no ratings, reviews or fabricated people |
| BreadcrumbList (src/lib/seo.ts:50-58) | `item` relative ("/guides") | Google examples use absolute URLs. Fix by passing `absoluteUrl(path)`. Last item may omit `item` |
| FAQPage on 24 guides | Mirrors visible FAQ accordion text | Eligibility ended: Google's FAQ page states the rich result is no longer shown from May 7, 2026. Content matches the visible page (no policy violation), but there is no benefit. Brand names appear in answers/questions on 10 guides |
| Dataset on /data/pet-policies | present | Not validated beyond parsing; check it has `distribution` (CSV in /public) and absolute URLs |
| TouristDestination on town pages | on page that should be noindexed | Remove or leave; low value |

No fake ratings/reviews/Review/AggregateRating markup anywhere (VERIFIED via scan of types on all pages). All JSON-LD parses as valid JSON.

## 8. Social metadata

VERIFIED: guide og:image and twitter:image are absolute `/share/<slug>.jpg`, 1200x630, live 200; `twitter:card=summary_large_image`; og:url, og:site_name, og:title, og:description present; guides add `article:modified_time` only (no `article:published_time`). All non-guide pages (home, tools, destinations, dogs, about, etc.) use `/assets/hero-porch-BdMubJoe.jpg`, 1600x907 (16:9, not 1200x630) with a hash that changes whenever the image changes, which breaks cached shares. There is no per-page share image for tools/data/destinations. No apple-touch-icon (404; favicon.ico only).

## 9. Performance (Lighthouse mobile, simulated; Playwright mobile 4x CPU, 1.6 Mbps)

| Page | Lighthouse perf | FCP / LCP / TBT / CLS | Playwright mobile LCP | JS (decoded) |
|---|---|---|---|---|
| / | 80 | 3.1 s / 3.5 s / 240 ms / 0.003 | 3.2 s (hero-porch-800) | 1,193 KB |
| /guides/vacation-rentals-with-no-pet-fee | 73 | 3.7 s / 3.9 s / 310 ms / 0.003 | 2.4 s | 1,266 KB |
| /guides (listing) | n/a | n/a | 4.2 s (card image LCP) | 477 KB |
| /guides/dog-car-safety... | n/a | n/a | 3.5 s | 1,312 KB |
| /tools/will-my-dog-be-accepted | n/a | n/a | 1.1 s | 485 KB |

Lab numbers only; no field CrUX data exists for a new domain (COULD-NOT-ACCESS/none). Drivers:
- VERIFIED: render-blocking third-party Google Fonts stylesheet (`fonts.googleapis.com/css2` DM Sans + Fraunces, __root.tsx:84-86; 127 KB of font files per page). Lighthouse FCP 3.1-3.7 s on mobile.
- VERIFIED: entry chunk `index-*.js` 371 KB and `site-*.js` 352 KB (all guide bodies, eager `import.meta.glob`) load on every page, matching docs/PERFORMANCE.md findings 1-3 (not yet applied). Lighthouse estimates 131 KiB unused JS. GA gtag adds 184 KB.
- VERIFIED: heroes are fine: guide hero 800 px variants 36-120 KB with srcset, `fetchPriority=high`, preloaded, width/height set; CLS about 0.003. The /guides listing loads 24 card images (about 1.2 MB desktop) with the first card as LCP.
- `/assets/*` immutable cache confirmed; share images `max-age=0, must-revalidate` (fine).

## 10. Can search engines discover, render and index the articles?

Yes. Discovery: sitemap with 24 guides plus hub /guides linking all of them and robots.txt pointing to the sitemap. Rendering: full SSR, JSON-LD in `<head>`, no JS dependence (VERIFIED). Indexing controls: correct for stays, dog-rules and drafts; one bug on town pages. The real constraint is not technical: the domain is new (bought 2026-11-17 per audit docs), the pages have no inbound external links, and several head terms are competitive (SUSPECTED, no search data). Submit the sitemap in Google Search Console and Bing Webmaster Tools (NEEDS-USER-ACTION; no evidence in the repo that this was done).

## Prioritized recommendations

| # | Priority | Item | Impact | Effort | Ongoing cost | Dependencies |
|---|---|---|---|---|---|---|
| 1 | High | Submit sitemap and verify property in Search Console and Bing; monitor index coverage | High (only way to see real indexing and queries) | 30 min | none | User account access (use non-hello@ owner email) |
| 2 | High | Fix town-page noindex logic and redirected links (SAFE 1, 2) | Medium (index hygiene; matches stated rule) | 10 min | none | none |
| 3 | High | Add contextual internal links to the 7 thinly linked guides and home (SAFE 7) | Medium-high (equity to the highest-opportunity guides) | 1-2 h | none | Content edits in content/*.md |
| 4 | High | Retitle drifting guides (SAFE 6) and shorten long index titles/descriptions (SAFE 5) | Medium | 1 h | none | meta-brands test must still pass |
| 5 | Medium | Self-host fonts (WOFF2 subset, `font-display: swap`, preload) | Medium (FCP 0.5-1 s on mobile, helps all pages) | 1-2 h | none | NEEDS-APPROVAL (new assets, styles.css) |
| 6 | Medium | Split guide bodies out of entry bundle and lazy-load Markdown/zod (PERFORMANCE.md 1-3) | Medium (about 145 KB gzip off home) | 0.5-1 day | none | NEEDS-APPROVAL (src/content/guides/index.ts structure) |
| 7 | Medium | Absolute URLs in JSON-LD; add Article `image`, ISO datetime, Organization `url` (SAFE 3) | Low-medium (hygiene) | 30 min | none | none |
| 8 | Low | Drop or keep FAQPage JSON-LD (NEEDS-APPROVAL 3) | Low (no rich result since May 2026) | 15 min | none | Decision on Expedia JSON-LD brand risk |
| 9 | Low | Dedicated 1200x630 default share image and per-section images; stable (non-hashed) URL (SAFE 8) | Low | 1 h | none | A designed image (owner choice; photos must match content) |
| 10 | Low | Trailing-slash 307 to 301; add apple-touch-icon | Very low | 15 min | none | netlify.toml redirect |

## Fix list

### SAFE (non-destructive, reversible)

1. `src/routes/destinations.$state.$town.tsx:24`: change `noindex: !visibleStays().some((s) => s.town === t.slug)` to `noindex: !visibleStays({ includeSamples: false }).some((s) => s.town === t.slug && s.status === "verified")`, matching `src/lib/sitemap-entries.ts:16,23`. Add a test in `src/test/launch-state.test.ts` that a town with only unverified stays is noindexed.
2. Same file (the "Plan it properly" list, about line 50-51): replace `/tools/host-questions` and `/tools/cost-calculator` links with a single link to `/tools/pet-cost-check`, plus `/tools/will-my-dog-be-accepted`. Grep `src` for any other links to the two retired tool routes (search `host-questions`, `cost-calculator`) and update them.
3. `src/lib/seo.ts`: in `breadcrumbLd` use `item: absoluteUrl(it.path)`; in `src/routes/guides.$slug.tsx:36` set `mainEntityOfPage: absoluteUrl(path)`, add `image: absoluteUrl(\`/share/${g.slug}.jpg\`)`, and format dates as ISO 8601 with offset (for example `${g.lastReviewed}T00:00:00-05:00`, or omit time only if Google's default timezone is acceptable). In `__root.tsx:78` Organization add `url: site.siteUrl`. Update `src/test/app-routing.test.tsx` expectations if it asserts the JSON.
4. Extend `src/test/meta-brands.test.ts` to cover every `pageHead` title/description (dogs, destinations, tools, data) and the final og/twitter tags, not only guide seoTitle/seoDescription.
5. Shorten (keep brand suffix, aim for 60 or fewer characters per title and 155 or fewer per description): `/dogs` (87), `/guides` (74), `/destinations/california` (71), `/destinations` (68), `/tools/will-my-dog-be-accepted` (67), `/data/pet-policies` (64), home description (182), `/tools` description (189), `/tools/pet-cost-check` (169). Edit the `pageHead` calls in the matching `src/routes/*.tsx` files and the home `description` in `src/config/site.ts` / `content/settings.yml`.
6. Retitle (content/guides/*.md `seoTitle`; for the TS guides edit `src/content/guides/*.ts`): weight-limit guide to a "no weight limit" query (for example "Vacation Rentals With No Dog Weight Limit: 2 of 38"), pending the data reconciliation noted in AUDIT-SUMMARY; large-dogs guide: remove "5 Checks" unless the body contains five numbered checks; damage-charge guide: plain-language query title; fees-work guide: replace "What 38 Show" with the specific finding. Do not add Expedia-family names (meta-brands test).
7. Internal links (content edits): link each of the seven weak guides from at least three relevant guides (for example hot-tub from fenced-yard/checklist/no-pets; red-flags from checklist, fees, large-dogs; reactive from fenced-yard, leave-alone, senior; puppy from leave-alone and checklist; weight-limit from large-dogs and breed-restrictions; costs from fees and no-pet-fee; Christmas from NYE and packing). Use the front-matter `relatedGuides` lists, which render a "Keep reading" block capped at 3 items (`guides.$slug.tsx`: `.slice(0, 3)`), plus in-body links with descriptive anchors. Add 4 to 6 more guides to the home page and a reciprocal link between NYE and Christmas.
8. Default share image: create `/public/share/default.jpg` at 1200x630 and use it as the `pageHead` fallback instead of the hashed `hero-porch` import (`src/lib/seo.ts:34`). Add `public/apple-touch-icon.png` (180x180).
9. `src/test/share-images.test.ts`: keep as is (already asserts presence); add a dimension check if desired.
10. `public/robots.txt`: no change needed. Optionally add `Disallow: /stays/` only if you later want crawl savings; do not, because noindex must be seen to be honored.

### NEEDS-APPROVAL

1. Self-host fonts and remove the Google Fonts stylesheet/preconnects in `src/routes/__root.tsx:82-86`; adds binary assets and changes `styles.css`. Expected FCP gain 0.5-1 s on mobile (SUSPECTED size of gain; measure after).
2. Implement the PERFORMANCE.md bundle plan (metadata-only guide index module, lazy guide body, lazy `marked`, no runtime zod, defer GA to idle). Restructures `src/content/guides/index.ts` and its consumers; run the full test suite.
3. FAQPage JSON-LD: either remove from `guides.$slug.tsx:37` (no rich result exists any more; also drops brand names from structured data), or keep for generic machine readability. Recommendation: remove the Vrbo/Expedia-named FAQ items from structured data at least, until Expedia confirms (docs/audit says to ask affiliatehubsupport@expediagroup.com whether titles count; JSON-LD was not asked). The visible FAQ stays either way.
4. Netlify `[[redirects]]` change to make `/guides/` style trailing-slash 301 rather than 307 and consider canonical `force` behavior; touches `netlify.toml`.
5. Decide whether to noindex `/destinations/*` (state pages) while they hold only unverified stay cards; currently indexable and in the sitemap (VERIFIED), and they show thin card grids (state pages 363-513 words). Owner decision.
6. Replace the two retired-guide redirects that send Atlanta/Los Angeles queries to state pages with 410 or keep; low value, owner decision.
7. Add Search Console/Bing verification meta tags in `__root.tsx` if the DNS method is not used (the Impact site-verification tag is already there and must be removed on sale).

## Needs your personal action

1. Create/verify Google Search Console and Bing Webmaster Tools properties (domain or URL-prefix) with an owner email that is not hello@, submit `https://www.pawsandpassage.com/sitemap.xml`, and share index coverage and query data later.
2. Decide on the Expedia brand-in-JSON-LD question (NEEDS-APPROVAL 3) and optionally email Expedia support (not done here).
3. Approve or reject the NEEDS-APPROVAL items above.
4. Provide or approve a default 1200x630 share image.

## Could not verify

- Real rankings, impressions, indexation status and Core Web Vitals field data: no Search Console or CrUX data for this new domain.
- Googlebot's actual rendering (only Chrome via Playwright with a Googlebot UA string; the server does not vary by UA in my tests).
- Whether Google indexed or dropped the unverified town pages (no `site:` access attempted).
- Whether the large-dogs guide body contains five checks (not re-read; prior audit says no).
- Whether Lighthouse's 3.1-3.7 s FCP persists on real devices (simulated throttling).
