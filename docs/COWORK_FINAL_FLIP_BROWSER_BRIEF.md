# Cowork final flip browser brief (Paws & Passage)

Self-contained. Written 2026-11-24. Repo: https://github.com/meggzzcode/paw-passage (production branch `main`). Live site: https://www.pawsandpassage.com. This replaces `docs/COWORK_EDITORIAL_BROWSER_BRIEF.md` and the editorial parts of earlier briefs; it is not another research assignment. Every task below needs a live browser. Report back in the format in section 10.

## 0. Rules (read first)
- Read-only unless a task says "with owner authorization". Never buy, subscribe, enter payment or identity details, change DNS, transfer accounts, publish a marketplace listing, message a buyer, or click Publish/Submit/Verify/Confirm on anything not named below.
- Never type, read aloud or store passwords, codes or recovery data. Stop at any CAPTCHA, "verify it is you", security warning, bot block or login wall you do not already have. Mark the task BLOCKED/UNVERIFIED and continue. Never work around a block.
- Sign in only as the owner account that is already signed in (Paws & Passage or megan.bhag); if a login is needed that you do not have, ask the owner once and move on.
- Screenshots go to a private folder the owner names (not the public repo); the repo gets file names only. Redact emails, account IDs, earnings.
- Record only facts you saw. Write UNVERIFIED for anything you could not see. Never invent traffic, revenue, rankings, approvals or buyer interest.
- Do NOT start section 3 (Search Console and Bing) or section 5 (performance) until the owner confirms the production deploy is live (Netlify builds are stopped until the owner turns them back on). Sections 1, 2 and 4 can run against the live site only after that deploy too, because the live site otherwise shows the older build. State which build you saw (the new build shows "Affiliate link · We may earn a commission" labels under buy buttons and no "Check the current price" lines).

## Required order of operations
1. Owner deploys the validated build and says so. 2. Section 1 (visual QA). 3. Section 2 (competitor visual validation). 4. Section 3 (Search Console). 5. Section 4 (Bing). 6. Section 5 (performance). 7. Section 6 (buyer listing verification) using the sanitized evidence collected above. 8. Write the report.

## 1. Final production visual QA (desktop 1280 px and 390 px phone window)
Pages: homepage `/`; guide directory `/guides`; three representative guides (`/guides/how-vacation-rental-pet-fees-work`, `/guides/vacation-rentals-that-welcome-large-dogs`, `/guides/if-your-dog-gets-loose-on-a-trip`); two gear guides (`/guides/dog-car-safety-harness-and-crate-guide`, `/guides/dog-ramp-or-steps-for-the-car-and-cabin`); accommodation directory `/stays`; one stay detail page (pick any from `/stays`); research page `/data/pet-policies`; one tool (`/tools/will-my-dog-be-accepted` or `/tools/packing-list`).
For each page check and record PASS / ISSUE with a one-line note: real rendered appearance; mobile navigation (open the menu, reach Guides, Stays, Gear, Tools); first-screen readability (can you see the headline and the answer line without scrolling past a hero, byline and share buttons); tables (no clipped column, first column stays visible while swiping, swipe hint); source links (tap 3 source references or publisher links: easy to tap, open the right page, a Sources list with dates at the end); affiliate disclosures (a notice near the top; a label next to every buy or booking button; Amazon Associate sentence where an Amazon link exists); product buttons (white readable text on the rust button, link goes to an Amazon product page and not an error); internal links (click 3 per page); images (load, match topic, no repeats between guides); layout errors (orphaned separators, overlapping, cut-off text, horizontal page scroll).
Screenshots required: first phone screen of each page; one table; one product card; one stay panel. Name files `qa-<page>-<width>.png`.

## 2. Competitor visual validation
Context: `docs/editorial/competitors-pet-travel.md` and `docs/editorial/competitors-editorial-commerce.md` (automated tools could not read BringFido, Rover, Dogster, Wirecutter, Lonely Planet or The Strategist; do not repeat what they already cover). With normal authorized browser access (no bypassing bot blocks, logins or CAPTCHAs), open 2 to 3 representative articles each from BringFido (bringfido.com/blog), Rover (rover.com/blog), Dogster, Wirecutter dog travel/crate/harness pieces, and one other useful travel publication (Condé Nast Traveler, Lonely Planet, The Dyrt). Record: real URL; article length in phone screens; first screen; photography (in-body photo count and style); how sources or citations are shown; how product or booking blocks and affiliate notices look (quote the notice, under 25 words); mobile reading comfort; friction (popups, ads, cookie walls). Compare with the same-width Paws & Passage pages from section 1. Give at most 5 recommendations that would materially improve the immediate sale, each with a URL as evidence; skip anything optional. Mark inaccessible sites UNVERIFIED.

## 3. Search Console (after deploy)
Property: pawsandpassage.com (domain property). Known baseline (do not overwrite): the owner's earlier report said 98 sitemap URLs, 21 of 23 individually inspected URLs indexed, 236 impressions and 0 clicks over 28 days.
- URL Inspection for `https://www.pawsandpassage.com/stays` and `https://www.pawsandpassage.com/destinations/georgia/blue-ridge`: record verdict, last crawl date, indexing eligibility and any reason (e.g. "Crawled - currently not indexed").
- Check the Sitemaps and Pages reports: has the stale Page Indexing report refreshed (record the date shown)? Record the sitemap's discovered URL count.
- With owner authorization only: Request Indexing for those two URLs (once each; stop at any quota message). Record exactly whether each request was submitted or blocked. Do not claim success if blocked. No other requests.
- Also inspect `/guides/vacation-rentals-that-welcome-large-dogs` (the surviving large-dog URL) and the retired URL `/guides/vacation-rentals-with-no-dog-weight-limit` in a browser to confirm the retired URL redirects (301) to the survivor.

## 4. Bing Webmaster Tools (if signed-in owner access exists)
Import the property from Google Search Console; check the submitted sitemap and its status; check indexing status; inspect IndexNow configuration and submission history (the IndexNow key file lives in the repo). If no login is available, mark UNVERIFIED and continue. This is desirable buyer evidence, not a blocker.

## 5. Performance and buyer QA
Run PageSpeed Insights (mobile) on `/`, one policy guide and one gear guide. Record LCP, CLS, INP/TBT, performance score, and any serious mobile usability or loading issue. Do not chase perfect scores; report only serious regressions or obvious waste (large images, layout shift).

## 6. Buyer listing verification
Using `docs/SALE_LISTING_DRAFT.md` and `docs/BUYER_ASSET_INVENTORY.md`, verify each claim against the deployed site and list MATCH / MISMATCH: counts (published guides, sitemap URLs, individual stay detail pages versus properties shown in the directory, tools, gear products and categories, pins, dataset managers and fields); features (spec cards, redirects, dataset CSV download, planning tools work); Search Console evidence (privately stored); image and licensing notes (Unsplash credits page lists each hero); known limitations. Produce a private evidence checklist (names only in the repo). Do not publish any listing, spend money, transfer accounts or contact buyers.

## 7. What you must NOT do
No marketplace actions of any kind; no edits to the repository `main`; no requests for indexing beyond section 3; no sharing account screenshots publicly.

## 8. Owner-only actions (list for the owner; Cowork does not do these)
Turn Netlify builds on and deploy once (15 credits); renew the Netlify certificate; domain auto-renew; copyright assignment and bill of sale; repo-history choice; marketplace seller account and identity verification; price floor; approve the listing text; GA4 and Search Console access terms for a buyer.

## 9. Evidence to collect (private)
Screenshots from sections 1 to 5; Search Console and Bing status screenshots with dates; PageSpeed results; the section 6 checklist.

## 10. Report format (write to `docs/flip/cowork-final-results.md` on branch `cowork/final-results`, or paste to the owner)
1. Build seen and date. 2. Section 1 table (page, width, PASS/ISSUE, note, screenshot name). 3. Competitor table with URLs and the 5 recommendations. 4. Search Console results (exact verdicts, dates, whether indexing requests were submitted). 5. Bing results or UNVERIFIED. 6. PageSpeed table. 7. Listing-claims table (MATCH/MISMATCH). 8. BLOCKED/UNVERIFIED list. 9. Final statement: READY TO LIST, READY AFTER (items), or NOT READY, with reasons.
