# Master plan: status review and execution plan (2026-11-18)

Branch claude/affiliate-setup is 12 commits ahead of origin/main (main is untouched since de4c0b2; the user will merge in bulk). Tests: 338 pass, tsc clean at the last run. Nothing here has been deployed, so production rechecks (section 7) can only happen after the bulk merge.

Status labels: DONE (on the branch, tested), PARTIAL, TODO, NEEDS-YOU, BLOCKED.

## Status by section of the master prompt

| # | Section | Status | What exists / what remains |
|---|---|---|---|
| 1 | Review repo and reports | DONE | Ten reports, summary, this file. |
| 2 | Brand positioning "Dog-Friendly Stays, Travel Guides & Gear" | TODO | Apply the tagline in site config, header/footer tagline, About, and the home head; keep logo, colors, fonts (WP1). |
| 3 | Single business email hello@ | PARTIAL | No new mailbox. TODO: document the Private Email configuration and a verified transfer procedure (WP8). |
| 4 | Editorial identity and AI disclosure | PARTIAL | Masthead and byline on About done. TODO: the exact AI disclosure text on Editorial Standards only (WP1). |
| 5 | Credibility pages | PARTIAL | About, Contact, Editorial Standards, Disclosure, Methodology, Corrections done. TODO: Terms and Privacy review, Organization structured data, terminology sweep for unsupported claims, update dates (WP1, WP2 owns __root.tsx). |
| 6 | Technical SEO and performance | PARTIAL | DONE: JSON-LD URLs, titles and descriptions, town noindex rule, default share image, security headers. TODO: self-hosted fonts, render-blocking, guide-bundle split, FAQPage decision from current Google docs, dependency vulnerabilities, before/after timing (WP2). |
| 7 | Production recheck | BLOCKED | Needs the bulk merge and deploy. Netlify badge removal steps to be written (WP8). Unreachable external links to be investigated without treating blocks as broken (WP6). |
| 8 | Accommodation strategy | PARTIAL | Stays listed with listing-based wording. TODO: index stay pages that are complete and useful, noindex thin ones, same for town/destination pages; confirm the nine Vrbo deeplinks resolve; review filters (WP3). Photos: none used. |
| 9 | Travel Essentials hub | PARTIAL | /gear and six category pages live on the branch (25 products). TODO: more categories only where enough products exist, discoverability from guides, accommodation articles and tools (WP4). |
| 10 | Expand product catalog | TODO | Research candidates from manufacturer pages only, record specs read, distinguish claims from independent testing (WP4). |
| 11 | Centralized affiliate management | PARTIAL | content/products.yml with fallback logic done. TODO: image source and rights, affiliate program and tracking ID fields, related guides, alternative retailer; documented swap procedure for a buyer (WP4). |
| 12 | Orphaned commercial content | PARTIAL | Packing-list self-link fixed. TODO: surface the 8 orphaned products via the hub and guides (WP4). |
| 13 | 30-article roadmap | TODO | Waits on WP4 (products) and on improving weaker guides first. Batch 1 planned below. |
| 14 | Topical authority and pillars | TODO | Gear hub is the first pillar. Destinations and road-trip pillars follow the roadmap batch. |
| 15 | Affiliate program research | PARTIAL | Report 05 done. TODO: application pack with truthful drafts, transferability, apply-now-or-wait recommendation. No submissions (WP9). |
| 16 | Chewy recovery | PARTIAL | Report 02 drafts exist. TODO: refresh them after the hub and trust work (WP9). |
| 17 | Pinterest | PARTIAL | 24 pins, docs/PINTEREST-SETUP.md, footer icon support (setting pinterestUrl, hidden until set). TODO: UTM tracking parameters, strategy doc, per-article pin workflow (WP7). NEEDS-YOU: profile URL. |
| 18 | Organic traffic and original research | PARTIAL | Dataset page, tools exist. TODO: Bing, IndexNow key file and workflow, backlink target list (WP6). |
| 19 | Conversion opportunities | PARTIAL | Hub cards, packing tool, calculators. TODO: product links from relevant guides and tools (WP4). |
| 20 | Analytics and financial tracking | PARTIAL | GA4 events exist. TODO: UTM handling note, calculator and hub events, finance procedure; manual GA4/GSC/Bing steps (WP6). Google Sheet tracker update (done by lead). |
| 21 | Automation | PARTIAL | Weekly site-health workflow done. TODO: Dependabot config, IndexNow, sitemap validation, SOPs (WP6). |
| 22 | Minimal operating costs | TODO | Verify renewal prices, Netlify commercial terms, Pages CMS, GitHub plan, and whether Lovable Pro is needed (the repo depends on @lovable.dev/vite-tanstack-config, a build config package) (WP8). |
| 23 | Security | PARTIAL | Headers done. TODO: CSP compatibility report (report-only plan), Actions permissions, restore-from-scratch runbook, account steps for you (WP8). |
| 24 | Revenue diversification | PARTIAL | Report 09 done; no premature monetization. |
| 25 | Sale prep and handbook | PARTIAL | Operations handbook and sale-readiness doc exist. TODO: extend after new work (WP8). |
| 26 | Valuation | PARTIAL | Score 3.75 baseline; add the $10,000 scenario and reassess at the end without inflating traffic or revenue scores (lead). |
| 27 to 28 | Roadmaps and SOPs | TODO | Update after workers report (WP6, lead). |
| 29 | Approvals | | Stay on the branch. No merge, purchases, applications, DNS or account changes. |

## Execution packages (parallel, non-overlapping file ownership)

- WP1 Editorial and brand: editorial-standards, about, contact, terms, privacy, footer/header tagline text, site config tagline (not __root.tsx).
- WP2 Performance and SEO: __root.tsx, styles, fonts, guide bundle split, FAQPage, package.json and lockfile.
- WP3 Accommodations: stays and destinations routes, content/stays, seo.ts, sitemap-entries.ts.
- WP4 Product catalog and hub: content/products.yml, src/content/gear*, gear routes and components, guide gear links via a shared component only.
- WP6 Analytics, links and automation: src/lib/analytics.ts, .github, public IndexNow file, docs/SOP-*.
- WP7 Pinterest: docs/PINTEREST-*.md.
- WP8 Costs, accounts, email, security runbook, Netlify badge: docs only.
- WP9 Affiliate application pack: docs only.

Content writing (section 13) starts after WP4 reports. Batch 1 candidates, to be validated before writing: best dog travel gear for road trips; dog ramp versus steps; dog life jackets for beach trips; travel bowls and food storage; protecting vacation rental furniture. Each is researched from public sources with a claims ledger and independent fact-check, as for earlier guides.
