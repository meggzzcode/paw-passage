# Go-live and traffic plan (2026-11-19)

> Superseded: the sale plan replaced this keep-and-grow plan; its 98-URL and guide counts are old (`docs/FINAL_SALE_CODE_RELEASE.md`). <!-- SUPERSEDED-NOTE -->


Written by working backwards: where we want to be, what has to be true one step earlier, and what is true today. Everything marked VERIFIED was checked on 2026-11-19; ESTIMATE is judgment, not data.

## 1. The vision and what it requires
Vision: a dog-travel publication that earns steady affiliate income from real search and Pinterest traffic, with 12 months of provable analytics, so it can be sold as a business asset.

Working backwards:
1. A sale needs provable history: analytics and affiliate-network earnings for several months (earlier valuation scenarios: 12 to 30x monthly net profit; no traffic, no price).
2. Earnings need clicks on the money links (Amazon tag `pawspassage-20`, Vrbo deeplinks), and clicks need readers on pages where a product or stay is the natural next step.
3. Readers need Google (and Bing and Pinterest) to find the pages. That needs the pages crawled and indexed, then ranked. A domain registered 2026-11-17 has no authority, so ranking comes slowly and through (a) long-tail questions nobody answers well and (b) links and mentions from elsewhere.
4. Crawling needs Search Console and Bing set up with the sitemap submitted, plus Pinterest claimed so pins carry the site's name.
5. All of it needs a live site that is correct, fast and trustworthy. That part is largely done.

## 2. Where we are now
VERIFIED live on https://www.pawsandpassage.com (deploy of commit b81db6c):
- 98 sitemap URLs: 30 guides, 24 stay pages (23 with Vrbo deeplinks), 13 gear pages, 9 destinations, 5 dogs, 5 tools, trust pages.
- Production site checks: 321 of 321 pass. Pages return 200; unpublished guides return 404; HSTS and Referrer-Policy present; robots.txt allows crawlers and lists the sitemap; GA4 tag G-1J97C8CPC1 loads; affiliate buttons carry `rel="sponsored nofollow noopener"` and the Amazon tag; the Amazon Associate statement is on guide pages.
- Repo health: tsc clean, 486 of 486 tests, lint 0 errors, 53 active products all earning and each named in a published guide, every published guide has at least one earning product.
NOT VERIFIABLE from here: whether Google has indexed anything. A `site:pawsandpassage.com` search through our search tool returned no results from the domain, but that tool does not honor `site:` reliably. Treat indexing as unknown until Search Console says otherwise.

## 3. The gap, ranked by how much it moves traffic
| # | Gap | Why it matters | Who | Effort |
|---|---|---|---|---|
| 1 | Search Console: verify the domain, submit sitemap.xml, request indexing for the newest guides and /gear | Without it Google may take weeks to find pages, and we get no query data to steer by | You | 20 min |
| 2 | Bing Webmaster Tools: import from Search Console, submit sitemap; IndexNow key is already in the repo | Bing is cheap extra reach; IndexNow pings new URLs | You (steps in docs/cowork/04) | 10 min |
| 3 | Pinterest: claim pawsandpassage.com, then publish the 30 pins (docs/pinterest-pins.csv) on a drip, 3 to 5 a day | Pinterest is the one channel that can send traffic within weeks for a new domain, and gear and cabin content suits it | You or Cowork (docs/cowork/05) | 1 h setup, then 10 min a day |
| 4 | GA4: add custom dimensions partner, product, stay, tool_name; mark booking_click and product_click as key events | Without it we cannot show which guide earns, and a buyer will ask | You (docs/cowork/03) | 15 min |
| 5 | Backlinks: pitch the dataset page (/data/pet-policies) and the pet-policy guides to a handful of travel, pet and rental-owner sites | A new domain ranks only with links; the dataset is the one asset others may cite | Me to draft the list and pitches, you to send | ongoing |
| 6 | Finish Amazon link verification (Cowork task 08 is done; task 09 is done; any future new ASIN needs the same check) | A dead link is a lost sale and a bad reader experience | Cowork then me | per batch |
| 7 | Amazon Associates clock: the program asks for qualifying sales within 180 days of sign-up (verify the exact wording and date in your Associates account) | Without 3 sales the account can close | You to check; traffic to Amazon pages is the fix | watch monthly |
| 8 | Remove the "Powered by Netlify" badge and fix the unknown Google Ads container GTM-W99QCXZ9 | Credibility with reviewers; the container is not in our code and is unexplained | You (Netlify settings, Google Ads) | 15 min |
| 9 | Affiliate breadth: Vrbo (live), Amazon (live); Awin, Ascend, BringFido, Impact only after real traffic exists | More partners help a buyer later but are not needed to start | Later | later |
| 10 | Security hygiene: GitHub 2FA, Actions read-only permissions, Netlify build-failure alerts | A single account loss would take the asset with it | You | 20 min |

## 4. What I would not spend time on now
- More guides. Thirty guides on one narrow theme is enough to learn from. New writing should follow Search Console data, not guesses.
- More affiliate applications, ad networks, a newsletter, a store or paid ads. Ad networks need 5,000 to 250,000 monthly sessions; none of that exists yet.
- Further polishing of copy that already passes fact-check. The marginal gain is small compared with indexing and links.

## 5. Risks to name plainly
- Brand-new domain: expect little or no organic traffic for the first 4 to 12 weeks even when everything is right. This is normal, not a failure.
- Content sourcing: guides rest on researched public sources with disclosed methods, not on first-hand testing. We do not fake experience. Search engines and readers may discount that against sites with real hands-on tests. The mitigation we can honestly use: be transparent, keep cited sources, keep the data page unique, and add real first-hand material only when it exists.
- Affiliate dependence: Amazon links can go dead or change; Vrbo links earn only on completed stays. Monthly link spot-check (docs/PRODUCT-LINKS-GUIDE.md section 5) is the upkeep.
- Revenue per visitor is unknown until we have data; any dollar forecast now would be a guess.

## 6. Timeline (dates are targets, not promises)
- Week of 2026-11-19: items 1, 2, 3 (claim only), 4, 8, 10 done by you. I merge any remaining branch work on your word and recheck production.
- Weeks 1 to 4 (to 2026-12-17): Pinterest drip running; sitemap and indexing watched weekly in Search Console; first impressions expected; I prepare the backlink list and pitches; check Amazon clicks in GA4.
- Month 2 to 3 (Dec to Feb): read Search Console queries; improve the 5 pages with the most impressions and lowest position; add guides only where queries show demand; Amazon sales clock check.
- Month 4 (about 2027-03-17): the domain is 4 months old, the earliest point for Mediavine's Journey tier (needs about 5,000 sessions a month); decide whether ads make sense.
- Months 6 to 12: accumulate provable analytics and earnings; record monthly in the "P&P Scorecard" tab; prepare the sale package (docs/OPERATIONS-HANDBOOK.md, SCORECARD.md).

## 7. How we will know it is working (leading indicators)
1. Search Console: pages indexed rising toward 98; impressions above zero within about 2 to 4 weeks.
2. Pinterest: outbound link clicks in GA4 with utm_source=pinterest.
3. Affiliate clicks: booking_click and product_click events by guide.
4. First qualifying Amazon sale and first Vrbo booking commission.
5. Monthly sessions: set the first target after two weeks of real data, not before.
