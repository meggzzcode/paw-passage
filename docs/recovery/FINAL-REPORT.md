# Consolidated report: master plan implementation (2026-11-18)

Branch: claude/affiliate-setup. Nothing is merged to main or deployed; the owner merges in bulk. Labels: VERIFIED, COMPLETED, SUSPECTED, RECOMMENDED, BLOCKED, NEEDS-YOU.

## 1. Executive summary

- COMPLETED on the branch: brand tagline and AI disclosure, trust pages (methodology, corrections, masthead), 33 researched products and a 12-category gear hub with central affiliate management, indexing quality rule for stays/towns/states, self-hosted fonts and lazy guide bodies, JSON-LD fixes, security headers, weekly health check, Dependabot, IndexNow (manual), Pinterest workflow (24 pins, CSV with UTM), analytics event vocabulary and setup guides, operations handbook, costs and email-transfer research, affiliate application pack (drafts only), 9 related-product blocks in guides.
- VERIFIED at the final run: tsc clean, 396 of 396 tests pass (28 files), production build succeeds, local site verification 283 of 283 checks pass.
- NOT DONE by design: nothing merged or deployed, no applications submitted, no purchases, no DNS or account changes.
- BLOCKED until the bulk merge: production recheck of the live site, UTM landing check, the Vrbo deeplink click test (all nine returned 301 then HTTP 429 to automated requests).
- Biggest remaining levers are outside the repo: real traffic and indexing, the Netlify badge, affiliate applications, GA4 and Search Console setup.

## 2. Before and after (honest)

| Area | Before | After (branch) |
|---|---|---|
| Product recommendations | 25 products hardcoded, none linked from nav/home | 58 products in content/products.yml, /gear hub with 12 categories, nav and homepage entry, 9 guides carry a Gear block |
| Trust pages | About, Contact, Privacy, Terms, Disclosure, Editorial Standards | Plus Methodology, Corrections, masthead, AI disclosure, update dates |
| Stays | Hidden from search by a verification rule | 9 listed; 5 indexable by a quality rule, 4 held back; filters extended |
| JS/fonts | Google Fonts render-blocking; 358 KB guide chunk on every page | Self-hosted fonts; guides chunk 45 KB; home JS parsed down 42% |
| Headers | HSTS, nosniff | Plus X-Frame-Options, Referrer-Policy, Permissions-Policy (CSP drafted, not enabled) |
| Automation | None | Weekly health check, monthly digest, Dependabot, IndexNow (manual) |
| Sale score | 3.75 baseline | see section 12 |

Performance (compressed, Slow 4G, 4x CPU; docs/recovery/PERF-BEFORE-AFTER.md): home LCP 6.1 s to 5.3 s; first contentful paint unchanged within noise (0.7 to 0.9 s); layout shift unchanged. The audit's predicted font gain did not show up.

## 3. Technical SEO results

COMPLETED: town noindex rule matches sitemap; absolute URLs in breadcrumb and Article JSON-LD; Article image and ISO dates; Organization JSON-LD with sameAs only when the Pinterest URL is set; titles and descriptions under the limits with a test over every page; default 1200x630 share image and apple-touch icon; FAQPage JSON-LD removed (decision and Google source in docs/recovery/FAQPAGE-DECISION.md), visible FAQs kept; seven weak guides now have 3 or 4 inbound links each; drifting titles fixed.
Not done: zod high advisory (BLOCKED: zod 4 breaks @tanstack/zod-adapter; not reachable on a static site; revisit when the adapter supports zod 4). Home hero image priority tweak not applied.

## 4. Credibility, accommodation, catalog, hub

See docs/recovery/03-affiliate-manager-and-credibility.md, ACCOMMODATION-INDEXING.md, HUB-IMPLEMENTED.md, AFFILIATE-SWAP-PROCEDURE.md. Safety claims in the catalog are recorded as manufacturer claims; no product is described as tested by us; no prices, ratings or affiliate links exist.

## 5. Content

Seven new guides published today (24 live). Roadmap of 30 in docs/recovery/04-content-products-roadmap.md. Next batch candidates (validate before writing): best dog travel gear for road trips, dog ramp versus steps, dog life jackets for beach trips, travel bowls and food storage, protecting rental furniture. Writing waits for your go-ahead.

## 6. Affiliate readiness and programs

Chewy declined (decline text unread). Order after merge: Impact support message; Awin Fi and Petmate; Ascend Kurgo; BringFido (after reading its agreement); Impact Tractive; Amazon once there is traffic; AvantLink and PetSafe later. Details in docs/AFFILIATE-APPLICATION-PACK.md. Readiness (judgment): Chewy LOW now; Awin and Ascend brands MEDIUM after deploy; Amazon MEDIUM after traffic.

## 7. Pinterest, analytics, automation, security, costs

Pinterest: docs/PINTEREST-SETUP.md, PINTEREST-STRATEGY.md, docs/pinterest-pins.csv; footer icon reads the pinterestUrl setting (set to the account profile). Analytics: docs/ANALYTICS-SETUP.md. Automation: .github/workflows, scripts/site-health.mjs, docs/SOP-*.md. Security and recovery: docs/SECURITY-AND-RECOVERY.md. Costs: docs/COSTS-AND-ACCOUNTS.md.
Operating cost (renewal basis, VERIFIED or UNCONFIRMED as marked there): about $34.86 a year (domain $19.98 plus mailbox $14.88, mailbox renewal price unconfirmed). Lovable Pro ($25 a month) is not needed to build, host or edit.

## 8. Valuation scenarios (planning estimates, not valuations)

Annual profit and resale value at 6 to 12x, 12 to 24x, 24 to 30x monthly net profit:

| Monthly net profit | Annual profit | 6 to 12x | 12 to 24x | 24 to 30x |
|---|---|---|---|---|
| $100 | $1,200 | $600 to $1,200 | $1,200 to $2,400 | $2,400 to $3,000 |
| $250 | $3,000 | $1,500 to $3,000 | $3,000 to $6,000 | $6,000 to $7,500 |
| $500 | $6,000 | $3,000 to $6,000 | $6,000 to $12,000 | $12,000 to $15,000 |
| $1,000 | $12,000 | $6,000 to $12,000 | $12,000 to $24,000 | $24,000 to $30,000 |
| $2,500 | $30,000 | $15,000 to $30,000 | $30,000 to $60,000 | $60,000 to $75,000 |
| $5,000 | $60,000 | $30,000 to $60,000 | $60,000 to $120,000 | $120,000 to $150,000 |
| $10,000 | $120,000 | $60,000 to $120,000 | $120,000 to $240,000 | $240,000 to $300,000 |

Pre-revenue: no verified comparable starter-site sale was found; value today is the assets (domain, content, tools, dataset, documentation) and cannot be priced from a multiple.

## 9. Website score

Baseline 3.75 (traffic 2, revenue 2, content 6, risk 5). Reassessed (judgment): traffic 2 and revenue 2 unchanged because no traffic or earnings exist; content 6.5 (more guides, hub, methodology, but untested at scale); risk 5.5 (headers, backups runbook, automation added; main still unprotected, single mailbox). Average 4.0. Reaching 9 needs about 12 months of provable traffic and earnings plus more than one revenue source.

## 10. Roadmaps

90-day and 12-month plans: docs/recovery/09-traffic-monetization-valuation.md section D, with SOPs in docs/SOP-weekly.md, SOP-monthly.md, SOP-quarterly.md. Update them with real data after the first month of traffic.

## 11. Commits and deployment readiness

Branch claude/affiliate-setup is ahead of origin/main by the commits listed by `git log origin/main..claude/affiliate-setup`. Ready to merge: tests, build and local site checks pass. After the merge: recheck production (docs/recovery/01-production-accessibility.md checklist), request indexing for new URLs, click each Vrbo button.

## 12. One checklist of everything that needs you

Every item: site, where, what to do, cost, required or optional, how to confirm.

1. Merge and deploy. GitHub, repo meggzzcode/paw-passage, branch claude/affiliate-setup into main (or tell me "merge"). Free. Required. Confirm: Netlify Deploys shows a green deploy; https://www.pawsandpassage.com/gear loads.
2. Remove the "Powered by Netlify" badge. app.netlify.com, your project, Project configuration, General, "Powered by Netlify badge", switch off. Free; if the toggle is locked Netlify says a paid plan unlocks it (about $9 a month, check before paying). Optional but recommended for an affiliate reviewer. Confirm: reload the site; badge gone. Also check which plan the account is on (injected code said "personal").
3. Impact. app.impact.com, your account, Properties: confirm the website property shows verified; open support and ask for the Chewy decline reason and the reapply rule (draft: docs/recovery/02-chewy-impact-requirements.md section 4). Free. Required before any reapply. Confirm: property status verified; support replies in the ticket.
4. Pinterest. pinterest.com, Settings, Claimed accounts: claim pawsandpassage.com with the HTML tag option, send me the tag, then click Verify after I add it. Then run the Cowork prompt in docs/PINTEREST-SETUP.md. Free. Required for Pinterest analytics. Confirm: the claimed site appears with a check mark; first pins published.
5. Google Analytics 4. analytics.google.com, Admin, Custom definitions: add dimensions partner, product, stay, tool_name; mark booking_click and product_click as key events. Free. Required for conversion reporting. Confirm: events appear in Realtime after the merge. Exact steps: docs/ANALYTICS-SETUP.md.
6. Search Console. search.google.com/search-console, domain property: submit https://www.pawsandpassage.com/sitemap.xml and request indexing for the seven new guides and /gear after the merge. Free. Required. Confirm: sitemap status Success.
7. Bing Webmaster Tools. bing.com/webmasters: import from Search Console and submit the sitemap. Free. Optional. Confirm: sitemap shows processed (Bing's help path was unverified, see ANALYTICS-SETUP.md).
8. Affiliate applications, after the merge, using docs/AFFILIATE-APPLICATION-PACK.md: Awin (Fi, Petmate), Ascend (Kurgo), BringFido, Impact (Tractive); Amazon later. Free. Optional but needed for revenue. Several ask for tax or payment details that only you may enter. Decide the login email first (hello@ versus an affiliate-only address: your earlier rule was no hello@ for affiliate accounts). Confirm: each network shows pending or approved.
9. Google Ads. Do not click Publish. Use the expert-mode path to create an account with no campaign, or skip Keyword Planner and use Search Console data. Free if no campaign. Optional. Confirm: Tools shows Keyword Planner without a billing request.
10. GitHub security. github.com Settings, Password and authentication: turn on 2FA; repo Settings, Actions, General: set workflow permissions to read; optional: block force pushes on main. Free. Required for 2FA, others optional. Confirm: settings show enabled. Do NOT add required reviews or required checks until you test one real Pages CMS save (docs/SECURITY-AND-RECOVERY.md).
11. Netlify notifications and limits. Netlify Project, Notifications: free plans may only offer GitHub commit status for build failures. Free plan has 300 credits a month (15 per production deploy), so avoid many tiny CMS saves in one month. Optional. Confirm: a test failed build produces a notice.
12. Namecheap. namecheap.com, Domain List: confirm the renewal price ($19.98 a year per its page) and auto-renew; Private Email: confirm the renewal price (listed $14.88, unconfirmed). Optional DKIM and DMARC records are only worth adding with Namecheap's guidance; never change MX, SPF or nameservers. Free to check. Confirm: renewal dates noted in the tracker.
13. Lovable. lovable.dev workspace billing: decide whether to keep Pro ($25 a month). The site does not need it. I cancelled nothing. Optional. Confirm: workspace plan changes only if you change it.
14. Pages CMS test. app.pagescms.org: make one small real edit and confirm it commits to main without errors. Free. Required before any branch protection. Confirm: a new commit appears on main.
15. Open two links in a browser: the two centerforpetsafety.org links cited in the car-safety guide (docs/LINK-CHECK-FINDINGS.md). Free. Optional. Confirm: they load or you send me the new address.
16. Logo. Provide a real logo file (the site uses a text wordmark) if you want it in the Organization structured data. Optional.
17. Stays. Send the Vrbo links or IDs for the new stays you expected (none were found in the repository, main, any branch or Drive).
18. Domain claim tag. After Pinterest gives the tag, send it so I add it to the site head.
