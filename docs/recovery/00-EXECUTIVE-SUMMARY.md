# Paws & Passage: affiliate recovery review (2026-11-18)

Ten read-only investigations (reports 01 to 10 in this folder) plus a repo review. Labels: VERIFIED (evidence in the report), SUSPECTED, RECOMMENDATION, NEEDS-YOU (your personal action or approval). Nothing here states a traffic figure we do not have: the site is new and has no analytics history.

## 1. Executive summary

- The production site is complete, fast and crawlable. A reviewer who visits sees a finished publication (report 01). The Chewy decline is therefore most likely about history and fit, not about a broken site.
- Impact's official decline reasons are incomplete information, media-property concerns, limited reach or activity, and rule violations. No traffic or site-age minimum is published, and no reapply waiting period was found (report 02).
- The strongest suspected causes, ranked by judgment: (1) no traffic or history, domain registered 2026-11-17; (2) Impact verification tag was merged only on 2026-11-18, shortly before the likely review; (3) our content is vacation-rental pet policy research, with only 3 of 23 guides about gear and no approved product link anywhere except Vrbo stays; (4) profile quality, which we cannot see. The real reason is unknowable without Impact's decline text.
- The site's biggest commercial gap: 17 researched gear picks have no affiliate link, the homepage and nav had no product path, and only 1 of 25 guides carries an approved link (Vrbo).
- Fix path: add a researched travel essentials hub, a methodology page, honest masthead and corrections log, apply to programs that fit a new site (Amazon, Awin, Ascend), and reapply to Chewy only after real traffic exists.
- Sale readiness today: 3.75 of 10 (report 09). Content is the strong part. A score of 9 needs about 12 months of provable traffic and earnings, which no amount of editing can create.

## 2. Production accessibility (report 01)

VERIFIED: all 47 sitemap URLs plus /stays return 200; the 24 live guides match the repo; certificate is valid to 2027-02-15; apex, www and http redirects correct; robots and sitemap correct; raw HTML contains title, meta, canonical, JSON-LD and the full article text; no stray noindex, no placeholders, no exposed drafts; Impact meta tag present on every page. Largest content paint 0.33 to 0.88 s in browser timing; Lighthouse itself was not runnable in that report (report 06 ran it: SEO 100, performance 73 to 80 on mobile).
Problems: a "Powered by Netlify" badge overlays every page (NEEDS-YOU, a Netlify setting); /stays and the nine stay pages show icon placeholders instead of photos; security headers were only HSTS and nosniff.

## 3. Chewy rejection analysis (report 02)

See report 02 for the confirmed requirements (quotes and URLs), the ranked causes and the 12 account actions. Chewy's own terms page could not be read. Its page says websites apply through Impact and asks for "authentic, pet-friendly content".

## 4. Affiliate approval readiness (judgment)

Chewy now: LOW. Amazon Associates, Awin brands and Ascend brands: MEDIUM, because they accept new content sites but expect real relevant content and, for some, an online presence. Reasons for LOW on Chewy: no history, gear content thin relative to a pet-product retailer. This score is our judgment, not a program rule.

## 5. Credibility audit (report 03)

VERIFIED: About, Contact, Privacy, Terms, Affiliate Disclosure and Editorial Standards exist. Missing: Product Review Methodology, masthead for the "Paws & Passage Editors" byline, corrections log. Overclaims found: "Top pick" without test disclosure (car-safety guide), "Every fact is sourced" (homepage), "only publish a stay once confirmed" (stays directory and About). The stays wording was corrected today because you decided all stays go live with unknowns marked Not confirmed.

## 6. Technical SEO (report 06)

VERIFIED: server-rendered pages, no rewrite needed. Bugs: town pages indexable while out of the sitemap; relative URLs in some JSON-LD; Article has no image; FAQPage rich results ended May 2026; 7 guides have one inbound link; some titles too long or drifting from intent. Performance cause: render-blocking Google Fonts and about 350 KB of guide text on every page (NEEDS-YOU approval to change).

## 7. Content and product audit (report 04)

VERIFIED: 17 gear picks across 4 guides have no affiliate ID; the packing list links to a retired guide's title; 8 products are orphaned. A 30-article roadmap in 12 clusters is in the report, 10 marked build first. No search-volume tool was reachable, so every demand claim is REPORTED (autocomplete) or ESTIMATE.

## 8. Travel essentials hub (report 10)

No route conflicts. The Product type needs category, retailer URL, last-verified date and active fields. Four categories are thin (beach, senior, multiple dogs, comfort). Candidate Ruffwear products were read but none added, pending your approval. Photo-less cards unless a matching photo exists.

## 9. Alternative programs (report 05)

Verified: Chewy (Impact), PetSafe (Ascend 8%, 90-day cookie), Kurgo (Ascend, 30-day), Adventure Medical Kits (8-15%), Fi (Awin 10%), Petmate (Awin 10%), Amazon (3% pet products), Expedia Group (up to 4%, ours). Not available or not found: Airbnb (not accepting applications), KONG (invite-only), BringFido (charity only), Gunner, Sleepypod, Hurtta. Not confirmed (pages blocked): Petco, PetSmart, Ruffwear, REI, Backcountry, Orvis, Rover, Wag. Order: Amazon, Awin, Ascend, AvantLink, Impact (Tractive, Petco), Chewy later.

## 10. Traffic strategy (report 09)

Google organic, then Pinterest (25 pins built; Pinterest Cowork prompt in docs/PINTEREST-SETUP.md), then data-led backlinks to /data/pet-policies. Bing Webmaster Tools and IndexNow are cheap. No newsletter, per your decision.

## 11. Monetization (report 09)

Ad networks are out of reach: Raptive 25,000 pageviews a month, Ezoic 250,000 monthly users for new sites, Mediavine $5,000 annual ad revenue or its Journey tier (5,000 sessions and a domain at least 4 months old, so about 2027-03-17 earliest). Affiliate is the right first revenue; downloadable resources and direct partnerships come after credibility and traffic.

## 12. Automation (report 07)

Best first: a weekly GitHub Action for broken links and content freshness that opens an issue. Free uptime monitor, Search Console and Bing sitemap review. Nothing recommended needs a paid service.

## 13. Security and infrastructure (report 08)

VERIFIED: no backend, no database, no secrets in the tree, build output or live HTML; I also scanned the full git history and found none. Weak spots: main is unprotected, Netlify sends no failed-build emails, the Lovable GitHub app can push to main, minimal headers, two high dependency findings that are not reachable on a static site. Git on GitHub is the only backup.

## 14. Valuation and score (report 09)

Traffic 2, Revenue 2, Content 6, Risk 5, average 3.75 of 10. Planning multiples (6 to 12x, 12 to 24x, 24 to 30x monthly net profit) give a resale range of $600 to $3,000 at $100 a month net profit and $30,000 to $150,000 at $5,000 a month. These are planning estimates only; no comparable starter-site sale could be verified.

## 15. Chewy reapplication strategy

Do not resubmit yet. Preconditions: (1) Impact property verification confirmed passing; (2) the hub, methodology page and masthead live; (3) a few weeks of real search and Pinterest traffic, with analytics you can show truthfully; (4) at least one other program approved so the site demonstrates it can drive sales; (5) ask Impact support for the decline text and their reapply rule. Drafts for the business description, promotional methods and a clarification message are in report 02.

## 16. 90-day roadmap

Report 09 section D holds the four-phase table with priority, impact, effort, cost and dependencies per task.

## 17. Completed today, remaining, and your actions

Completed: reports 01 to 10; stay pet policies filled from public Vrbo pages; stays featured with listing-based wording; View on Vrbo button; fee calculator; seven guides published; Pinterest setup doc; safe-fix implementation (SEO, trust pages, hub and catalog, internal links, headers, operations docs; see the commit log for what landed).
Remaining: NEEDS-APPROVAL items in reports 06 and 10 (self-hosted fonts, bundle split, FAQPage JSON-LD decision, new products and photos); the 30-article roadmap; Search Console and Bing; program applications.

NEEDS-YOU (consolidated): remove the Netlify badge; confirm Impact verification passes and request the decline text; GA4 custom dimensions and key events; Search Console and Bing setup with a non-hello@ owner email; Pinterest claim and the Pinterest Cowork run; applications to Amazon, Awin, Ascend, AvantLink; GitHub 2FA, secret scanning and branch protection; Namecheap renewal price and auto-renew; Netlify free-plan commercial terms and build-failure emails; decide on the Lovable Pro plan; masthead and organization wording; separate reader and affiliate mailboxes; whether to disclose AI use in research; which hub products and brands to add.

## 18. Estimated operating costs

Evidenced: domain plus Private Email first term $24.16; Netlify, GitHub and Pages CMS free; Lovable workspace on a paid Pro plan not needed to publish. Renewal prices are UNCONFIRMED. See docs/OPERATIONS-HANDBOOK.md once it lands.
