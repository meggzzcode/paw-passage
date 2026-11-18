# 01 - Production accessibility audit: https://www.pawsandpassage.com

Audited 2026-11-18 (anonymous curl with normal and Googlebot UA, Playwright/Chromium, repo comparison). Screenshots: /tmp/claude-0/-home-user/fda9ad27-569d-5e7b-b498-88d7075dfab9/scratchpad/shots/ (mobile-* 390px, desktop-* 1440px; home, guide, stays, tool, guides, about; *-full.png = full page). Raw data: scratchpad crawl.jsonl, locs.txt.

## Summary
1. VERIFIED: The live site is up, fast and complete. All 47 sitemap URLs plus /stays return 200 over HTTPS with HTTP/2 on Netlify. No empty pages, no lorem or placeholder text, no drafts exposed.
2. VERIFIED: The 24 guides in the sitemap exactly match the repo (17 published .md in content/guides + 7 .ts in src/content/guides). Every one has title, meta description, canonical, Article + FAQPage + BreadcrumbList JSON-LD, and 2,100-4,900 words of article text in the raw HTML (no JavaScript needed).
3. VERIFIED: The Impact meta tag is live on every page: `<meta name="impact-site-verification" value="6535a715-c434-467a-a407-2aeecbf0bf44"/>` (attribute is `value`, not `content`; that is the form Impact documents, but confirm in the Impact dashboard that verification shows as passed).
4. VERIFIED: Canonical host is www; apex and http redirect with 301 to https://www. Cert is Let's Encrypt, valid to 2027-02-15, SANs cover apex and www.
5. VERIFIED: /stays and all 9 stay pages are `noindex, nofollow` and absent from the sitemap, yet /stays is a main-nav item and the header CTA "Find a stay". A reviewer sees a directory of 9 listings with icon placeholders ("Photos are on the booking page") and many "Not confirmed" pet fees.
6. VERIFIED (visual): A "Powered by Netlify" floating badge covers the bottom-right of every page on desktop and mobile (injected by /.netlify/scripts/hud, `data-account-tier="personal"`). It looks unprofessional on a publication.
7. VERIFIED: Security headers are minimal (only HSTS and nosniff); HTML is `cache-control: no-cache`. Not blocking for affiliate review.
8. VERIFIED: Performance is excellent (LCP 0.33-0.88 s, CLS <= 0.05) in the test environment. Lighthouse not installed (COULD-NOT-RUN, see end).
9. VERIFIED: No dead internal links found. External links: ~150 checked; 2 hosts unreachable from here, several 403/429 bot blocks (list below).
10. Conclusion: yes, a reviewer sees a complete, professional publication. The weak spots are cosmetic: Netlify badge, thin placeholder-style stays directory, hero photo looks AI-generated (SUSPECTED, judgment), no named author.

## 1. DNS / TLS / redirects
| Check | Result | Label |
|---|---|---|
| Apex A | 75.2.60.5 (Netlify load balancer); no AAAA record (SOA only) | VERIFIED (getent + Cloudflare DoH) |
| www CNAME | paws-passage-test.netlify.app. (TTL 1800); resolves 98.84.224.111 | VERIFIED |
| NS | dns1/dns2.registrar-servers.com (Namecheap) | VERIFIED |
| dig | Not installed; DNS via getent and https://cloudflare-dns.com/dns-query | note |
| Cert | CN=pawsandpassage.com, issuer Let's Encrypt YE2, notBefore 2026-11-17, notAfter 2027-02-15, SAN apex + www | VERIFIED (openssl; cert issued yesterday, Netlify auto-renews) |
| http://apex, http://www | 301 -> https version -> 301 to https://www (two hops for apex) | VERIFIED |
| https://apex/ and /guides | 301 -> https://www.pawsandpassage.com/ (path preserved) | VERIFIED |
| 404 | Real 404 status with a styled page (11 KB) for unknown URLs | VERIFIED |

## 2. Response codes
- 200: /, /destinations, /guides, /tools, /tools/{checklist,pet-cost-check,will-my-dog-be-accepted,packing-list}, /data/pet-policies, /about, /contact, /list-your-property, /affiliate-disclosure, /privacy, /terms, /editorial-standards, /destinations/{georgia,california}, /dogs + 4 sub-pages, all 24 guides, /stays (200 but noindex).
- netlify.toml retired-guide redirects (9), all 301 with correct targets: traveling-with-two-dogs -> how-many-dogs...; dog-friendly-cabins-fenced-yards-georgia -> vacation-rental-secure-fenced-yard; pet-friendly-beachfront-rentals-california -> /destinations/california; weekend-getaways-from-atlanta -> /destinations/georgia; ...-from-los-angeles -> /destinations/california; water-and-feeding-gear and rental-protection-gear -> dog-friendly-cabin-packing-list; airbnb-vs-vrbo-with-a-dog -> how-vacation-rental-pet-fees-work; dog-id-tags-and-gps-trackers -> if-your-dog-gets-loose-on-a-trip. VERIFIED.
- Note: /guides/ (netlify.toml lists retired URLs only for 9 slugs; nothing missing found).

## 3. Crawlability and indexing
| Item | Finding | Label |
|---|---|---|
| robots.txt | 200; Allow: / for Googlebot, Bingbot, Twitterbot, facebookexternalhit, *; Sitemap line points to www sitemap | VERIFIED |
| sitemap.xml | 200, application/xml, 47 URLs, all www, all return 200; includes 24 guides, tools, data, dogs, destinations, legal pages; excludes /stays and stay pages (by design: src/lib/sitemap-entries.ts:13-34, stays noindexed until a verified stay exists) | VERIFIED |
| Repo comparison | content/guides: 17 files, all `status: published` (grep); + 7 TS guides = 24 = sitemap guides, diff empty. No draft in sitemap or crawl | VERIFIED |
| Canonical | Self-referencing absolute www URL on all 47 sitemap pages | VERIFIED |
| Accidental noindex | None on the 47 pages (no meta robots, no X-Robots-Tag). Only /stays and /stays/* carry `noindex, nofollow` meta, intentional | VERIFIED |
| Raw HTML (no JS) | Googlebot UA and normal UA return the same content (diff only in the streamed hydration payload). Title, description, OG/Twitter, canonical, h1 (exactly 1 per page) and full article body are in the initial HTML (SSR). Guide raw HTML 61-110 KB | VERIFIED |
| JSON-LD | Organization everywhere; guides add Article, FAQPage (Question/Answer), BreadcrumbList; /data/pet-policies adds Dataset + DataDownload; destination and dog pages add BreadcrumbList | VERIFIED |
| Title/description | Titles 20-87 chars (a few over 60: /dogs 87, /guides 74, /destinations 68); descriptions 84-189 chars. /tools description 189 may truncate | VERIFIED, minor |
| Impact tag | Present on all 48 fetched pages | VERIFIED |
| Analytics | gtag G-1J97C8CPC1 loaded on pages | VERIFIED |

## 4. Content quality
- No lorem/placeholder/TODO/"coming soon" text. Keyword hits for "sample" and "draft" are legitimate wording ("convenience sample", "away from drafts"). VERIFIED.
- Word counts: guides 2,142-4,900; tools 248-550 (interactive); legal pages 175-494; contact 175 words (short, plausible).
- Guides show "By Paws & Passage Editors", reading time, "Last reviewed Nov 18, 2026", "22 official sources". Consistent with no-named-author rule.
- Images: guide hero images responsive (srcSet 800/1600), lazy loaded with width/height set; card images are 960-1600 px wide shown at ~350 px (up to ~220 KB each, immutable 1-year cache). /guides loads 24 card images (~1.7 MB desktop transfer). SUSPECTED mild inefficiency, not a defect.
- Homepage hero is a golden retriever on a cabin porch at sunset; it reads as AI-generated (SUSPECTED, visual judgment; verify provenance vs the "photos must match, no stock on real stays" rule).

## 5. Links (homepage + 10 guides + /guides, /stays, /data/pet-policies; 15 pages)
- Internal: every unique internal href returned 200. No broken internal links. VERIFIED.
- External: ~150 unique URLs. 200 for the large majority (vrbo, airbnb help, ADA, ASPCA, AKC, vendor sites).
  - 000/unreachable from this sandbox (proxy or host): centerforpetsafety.org/sleepypod-atom/ and /sleepypod-clickit-range/ (COULD-NOT-ACCESS; verify manually).
  - 429 rate-limit: hapeycabinrentals.com/the-pet-paradise-promise/ and /why-dont-you-offer-direct-booking/ (likely OK).
  - 403 bot-blocking (probably fine for humans): cdc.gov (2 URLs), cpsc.gov, mumsnet.com (3), petbook-magazine.com.
  - 404 only for bare `https://fonts.googleapis.com` / `https://fonts.gstatic.com` preconnect hrefs (not real links).
  - Note `dev.elkspringsresort.com/policies/pet-policy/` is a dev-subdomain citation that returned 200; consider citing the production URL (already also cited).

## 6. Headers
Observed on HTML: `cache-control: no-cache`, HSTS max-age=31536000 (no includeSubDomains/preload), `x-content-type-options: nosniff`, `server: Netlify`, HTTP/2. /assets/* `public,max-age=31536000,immutable` (matches netlify.toml). Sitemap `max-age=3600`. Missing: Content-Security-Policy, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy. VERIFIED. RECOMMENDATION (low priority): add via netlify.toml [[headers]].
/favicon.ico 200; /.well-known/security.txt 404 (optional).

## 7. Playwright timing (Chromium, via agent proxy, so indicative only)
| Page | vp | TTFB | FCP | LCP | CLS | transfer KB |
|---|---|---|---|---|---|---|
| / | mobile | 264 | 504 | 552 | 0.001 | 679 |
| / | desktop | 111 | 600 | 600 | 0 | 1321 |
| guide (no-pet-fee) | mobile | 241 | 380 | 380 | 0 | 110 |
| guide | desktop | 499 | 704 | 880 | 0.004 | 247 |
| /stays | mobile / desktop | 226 / 409 | 348 / 548 | 348 / 548 | 0 / 0.051 | 15 |
| /tools/pet-cost-check | mobile / desktop | 481 / 185 | 584 / 332 | 584 / 332 | 0 / 0.001 | 13 |
| /guides | mobile / desktop | 193 / 362 | 304 / 504 | 464 / 672 | 0 / 0.002 | 684 / 1762 |
No horizontal scroll at 390 px on any page. Only console/network error: blocked google-analytics collect call (sandbox egress, not a site bug). The 0.051 CLS on desktop /stays is within "good" (<0.1).

## 8. Visual review (screenshots read: mobile-home, desktop-home, desktop-stays, mobile-guide, desktop-tool, mobile-home-full)
- Home: clean serif/sans type, full-bleed hero with headline "Their favorite getaway starts here.", two CTAs, then dog-type links, Georgia/California destination cards, "Pet-friendly is one checkbox" explainer, Featured stays (icon placeholders), guide cards, data stats ("22 of 38 / 3 of 38 / 31 of 38" from the 38-manager dataset), tools block, footer with About/Contact/Privacy/Terms/Disclosure/Editorial standards. Polished.
- Problems: (a) "Powered by Netlify" pill overlaps hero/CTA area on both viewports. (b) On mobile the hero text over the dog photo is legible but the eyebrow label is low contrast green on the photo. (c) Featured stays and /stays cards use tree/house icons with "Photos are on the booking page" instead of photos (deliberate under the no-stock rule, but looks unfinished to a reviewer); many cards say "Pet fee: Not confirmed". (d) Guide mobile breadcrumb wraps awkwardly (long title on its own line starting with "/"). (e) Guide title is centered and very large on mobile (5 lines) before the first image. (f) Tool page desktop: Step 2 cards have a large empty dashed third slot; fine functionally.
- No overflow, overlap or broken images observed in captured views. (Image "broken" counts in my script were lazy images not yet loaded, not 404s: assets return 200 image/jpeg.)

## 9. What an affiliate reviewer sees in the first 60 seconds
1. Types domain: apex -> www HTTPS, valid cert, no warnings, page paints in under 1 s.
2. Hero: "Dog-friendly travel, done properly", sourced-guides promise, nav Stays / Destinations / Guides / Tools.
3. Scrolls: dog-type pathways, Georgia/California destinations, featured stays, three featured guides, a data panel stating a 38-manager convenience sample read 2026-11-18, and free tools.
4. Opens a guide: 3,000-5,000 words, sourced ("22 official sources"), FAQ, "By Paws & Passage Editors", last-reviewed date, Print/Copy link/Save to Pinterest.
5. Footer: Affiliate disclosure, Editorial standards, Privacy, Terms, Contact, About, List your property: all 200 with real text.
6. Friction points: Netlify badge; stays without photos; no named person; thin contact page (175 words). Nothing broken, empty or lorem.
Verdict: reads as a complete, original publication (24 guides, 4 tools, dataset page). A reviewer whose criteria concern traffic, niche relevance, content depth or monetization fit will find a content-rich site; the site gives no evidence of its audience size by itself.

## Prioritized recommendations
| # | Priority | Action | Impact | Effort | Ongoing cost | Dependency |
|---|---|---|---|---|---|---|
| 1 | High | Remove "Powered by Netlify" badge (Netlify site settings; the HUD script is injected by the platform, not the repo; may need a paid plan or a setting) | Professional look on every page | Low | Possibly Netlify plan fee (unverified) | NEEDS-USER-ACTION in Netlify dashboard |
| 2 | Med | Decide whether /stays should be in main nav/CTA while noindex and photo-less, or relabel ("Stays we are verifying") | Avoids "unfinished" impression | Low | None | Owner rule on photos |
| 3 | Med | Confirm Impact shows site verification passed; if it shows failure, test the `value=` attribute against `content=` | Impact approval flow | Low | None | NEEDS-USER-ACTION in Impact |
| 4 | Low | Add CSP/Referrer-Policy/X-Frame-Options in netlify.toml | Hygiene | Low | None | None |
| 5 | Low | Shorten titles over 60 chars (/dogs, /guides, /destinations) and /tools description | Minor SEO | Low | None | None |
| 6 | Low | Resize card images (~700 px wide variants) | Faster /guides | Low-Med | None | None |
| 7 | Low | Replace dev.elkspringsresort.com citation; recheck the two centerforpetsafety.org links | Link hygiene | Low | None | None |

## Needs your personal action
1. Netlify dashboard: remove/disable the "Powered by Netlify" badge.
2. Impact dashboard: confirm the verification tag check passes.
3. Manually open the two centerforpetsafety.org links and the 403 sites (cdc.gov, cpsc.gov) in a browser.
4. Confirm provenance of the homepage hero photo.
(4 items)

## Could not verify
- Lighthouse: not installed (npm registry reachable but install was out of scope); Playwright metrics substitute. Run Lighthouse mobile on /, a guide and /tools/pet-cost-check from your machine.
- Real-user Core Web Vitals, Search Console indexing state and whether Google has indexed the pages (no access).
- AAAA/IPv6 support (none published; fine).
- External link status for bot-blocked hosts (403/429) and the two unreachable centerforpetsafety.org URLs.
- Whether the Netlify badge can be removed on the current plan.
