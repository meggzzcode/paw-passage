# Flip readiness audit: Paws & Passage (2026-11-23)

Objective (owner, 2026-11-23): sell the site as a turnkey, pre-revenue starter asset for about $1,500, quickly. This replaces the earlier keep-and-grow plan (`docs/GO-LIVE-PLAN.md`); that plan is not needed for this flip. Evidence behind every statement is in `docs/BUYER_ASSET_INVENTORY.md`, `docs/flip/audit-assets.md`, `docs/flip/audit-legal-transfer.md`, `docs/flip/audit-live-qa.md` (screenshots in `docs/flip/evidence/`) and `docs/research/MARKETPLACES-AND-COMPS-2026-11.md`. Labels: VERIFIED (evidence in those files), UNVERIFIED, OWNER (needs the owner).

## 1. Readiness score (each 1 to 10; average of four)
| Category | Score | Evidence and gaps |
|---|---|---|
| Traffic | 2 | No GA4 or Search Console data has been read by us. Domain registered November 2026 (registrar shows 2026-11-16 start, valid to 2027-11-17, auto-renew OFF), sitemap of 98 URLs is live and crawlable (VERIFIED). Whether Google has indexed anything is UNVERIFIED. |
| Revenue | 1 | $0. No affiliate earnings exist; Vrbo and Amazon links are wired through accounts that do not transfer (VERIFIED). |
| Content | 6 | 30 published guides, about 76,900 words, 491 citations, an original 38-manager dataset (VERIFIED). Held back by: researched not hands-on, no named author by design, dataset is a one-time convenience sample. |
| Risk | 5 | Positive: no backend, permissive licenses only, no secrets found, tests and build pass, handover docs exist. Negative: no LICENSE or assignment text, seller IDs in the site, an AI hero image (now replaced, see blocker 4), no legal review, domain transfer lock rule unverified, young domain. |
| **Average** | **3.5** | (2 + 1 + 6 + 5) / 4. Do not quote this to buyers; it is an internal planning score. |

## 2. Is $1,500 defensible?
Evidence (see the research file): only three verified sold comps were found, a Family site at $1,600, a Pet site at $1,500 (106 articles, two-year domain, a few backlinks) and a Home site at $1,700, all from one broker, self-reported and undated, all with aged domains. No verified sale of a sub-one-year, zero-revenue site was found. Flippa's own pages were blocked to us (fees UNVERIFIED), and its sold pages are gated.
Judgment (labeled, not data): ask **$1,500**; expect a close between about **$700 and $1,300**, with a downside of $300 to $600 if buyers value only the domain and content. The things that move it up: a clean, accurate listing, honest evidence, a verified Vrbo click test, the dataset and tools framed as original assets, and an escrow-only process. The thing that cannot be fixed in 72 hours: traffic and revenue history. Net after fees on a $1,500 sale is roughly $1,270 on Flippa Entry plus Escrow.com ($50) and $1,150 on Money Nomad ($297 flat), using unverified Flippa fee figures.
Trade-off the owner should know: waiting 3 to 6 months for real traffic data would likely raise the price, but that is the opposite of this mission; the decision is the owner's.

## 3. Verified blockers (supported by evidence)
| # | Blocker | Evidence | Blocks | Owner of fix |
|---|---|---|---|---|
| 1 | Branch fixes not merged to `main`. Production still has the retired Sleepypod Clickit Sport Plus and Backseat Bridge cards (no buy box on Amazon) and 54 active products instead of 53 | inventory "Branch vs live"; Amazon check 2026-11-18 | Listing | Owner says "merge", Claude merges |
| 2 | Eight live guides link to the three draft guides, which return 404 (D1) | live-QA audit | Listing | Claude (worker running; regression test added) |
| 3 | 22 of 24 Vrbo deeplinks unverified because Vrbo returns 429 to bots (D2) | live-QA audit | Listing (the listing says stays earn through Vrbo) | Cowork/owner click test |
| 4 | RESOLVED: hero image `hero-porch*.jpg` had no recorded source or rights (an AI image). Owner decision: replaced with a credited Unsplash photo (Cody Scott Milewski, Unsplash License). Unsplash gives usage rights, not ownership or exclusivity. | audit-legal-transfer | Listing (honesty) | Done |
| 5 | No traffic/GA/GSC evidence collected | none read | Listing (honest statement needs numbers) | Cowork B4 B5 |
| 6 | No LICENSE and no copyright assignment or bill of sale text | audit-legal-transfer | Closing | OWNER |
| 7 | Namecheap transfer-lock rule for a new domain is unverified | docs conflict | Closing | Cowork B2 |
| 8 | Seller IDs live in the site (GA4, Amazon tag, 33 Vrbo deeplinks, Impact tag, Search Console file) | audit-legal-transfer | Closing (buyer swaps) | Documented |
Corrections to claims: the legal-audit worker's "zero stays live" is wrong; 32 stays are listed (live `/stays` has 33 stay links, sitemap has 24 `/stays` URLs). The Vrbo wiring is real but non-transferable.
Not blockers (P2): GA4 sets cookies with no consent banner (privacy page discloses GA4); 5 guide titles over 65 characters; a long `/stays` meta description; 8 external sources behind redirect chains; Unsplash image URLs bot-blocked in link checks; no "Powered by Netlify" badge (good).
Verified good: 98 of 98 sitemap URLs return 200 with canonical, one title, JSON-LD and no stray noindex; four tools work end to end; Amazon links are direct `dp` links with the tag and `rel="sponsored nofollow noopener"`; mobile and desktop pass with no console errors; lab LCP 1.95 s home and 1.19 s guide on Slow-4G plus 4x CPU (lab only); tests 486 of 486; build passes.

## 4. Task classification
Categories: A Claude/code, B Cowork/browser, C Owner-only, D Not needed. Priority P0 blocks listing, P1 should be done before listing, P2 can follow. Effort is hands-on.
| ID | Cat | Pri | Action | Why a buyer cares | Executor | Prereq | Effort | Done when / evidence | Blocks listing? |
|---|---|---|---|---|---|---|---|---|---|
| T1 | C | P0 | Say "merge" for the branch | Live site matches the listing and has no dead Amazon cards | Owner, then Claude | T2 | 1 min | `main` contains the fixes; Netlify deploy green | Yes |
| T2 | A | P0 | Remove links to the 3 draft guides; regression test | No 404s while clicking around | Claude | none | 30 min | 0 internal links to non-public guides; tests pass | Yes |
| T3 | B | P0 | Vrbo deeplink click test: open each of the 24 booking links in the owner's browser, confirm each lands on the right listing (slow, never hammer) | Stay pages are the monetization story | Cowork or owner | T1 | 45 min | Table of 24 links: lands OK / wrong / dead; evidence | Yes |
| T4 | B | P0 | GA4 and Search Console evidence (brief B4, B5) | The honest traffic statement | Cowork | none | 20 min | Screenshots with dates, exact numbers | Yes |
| T5 | B | P0 | Domain proof and Namecheap transfer/lock rules (B1, B2) | Proves ownership; avoids a closing surprise | Cowork | none | 20 min | Screenshots; quoted official wording | Yes |
| T6 | C | P0 | Decide the hero image (keep with AI disclosure in the listing, or replace). DONE: replaced with a credited Unsplash photo | Rights and honesty | Owner | none | 15 min | Written decision | Yes |
| T7 | A | P0 | Re-run tests and build on final `main`; refresh inventory numbers | Verified-works evidence | Claude | T1 | 15 min | Updated inventory | Yes |
| T8 | C | P0 | Approve the listing text and decide price floor and offers policy | Final selling decisions | Owner | T3,T4 | 30 min | Approved `SALE_LISTING_DRAFT.md` | Yes |
| T9 | B | P1 | Marketplace requirements verified in browser (B9) and comps (B10) | Correct fees and a realistic price | Cowork | none | 45 min | Research file section | No (informs T8) |
| T10 | C | P1 | Marketplace account and seller identity verification | Required to list | Owner | T9 | 30 min | Verified seller account | Yes |
| T11 | C | P1 | Choose the repo handover form (full history vs fresh squashed repo) | Seller email is in 41 commits | Owner | none | 10 min | Decision recorded | No (closing) |
| T12 | C | P1 | Write or obtain copyright assignment and bill of sale; have them reviewed | Clean title | Owner | none | 1 to 3 h + review | Documents ready | No (closing) |
| T13 | A | P1 | Add a "rights and provenance" note: dataset provenance, image credits, hero disclosure | Honest provenance | Claude | T6 | 20 min | Doc in repo | No |
| T14 | B | P1 | CMS workflow proof in Pages CMS (B8); approval needed before any save | Shows a non-coder can edit | Cowork | owner approval | 15 min | Screenshot | No |
| T15 | B | P2 | Account status screenshots: Amazon, Vrbo, Impact, Awin, Pinterest (B6) | Honest affiliate statement | Cowork | none | 20 min | Status screenshots (earnings hidden) | No |
| T16 | A | P2 | Fix 5 long guide titles, the `/stays` description, stay title truncation | Minor polish | Claude | T1 | 30 min | Lint of titles | No |
| T17 | A | P2 | Add a cookie-consent notice for GA4 | Compliance, buyer may ask | Claude | owner approval | 1 h | Banner works | No |
| T18 | C | P2 | Decide whether to hand over the Pinterest account | Part of the asset | Owner | none | 5 min | Decision | No |
| T19 | D | | More guides, redesigns, new features, backlink campaigns, ad-network or affiliate applications, Pinterest posting, newsletters, Stay22 | Little buyer value for a pre-revenue flip | none | | | Do not do | |
Hands-on total for the P0 path: about 4 to 5 hours of Claude, Cowork and owner time. External waiting: marketplace seller verification and listing review (unknown, UNVERIFIED), and the buyer search.

## 5. Recommended sale strategy
1. Marketplace: **Flippa** (starter sites allowed; fees UNVERIFIED because its pages were blocked; verify in the browser first). Backup: Money Nomad ($297 flat seller fee, official, about 20% of the ask). Not a fit: Empire Flippers, Motion Invest, FE International. Sedo or Afternic only for a domain-only fallback.
2. Ask $1,500 with offers allowed; do not auto-accept below a floor the owner sets in advance (the owner's call; the research suggests likely closes of about $700 to $1,300, and a downside of $300 to $600 if buyers value only the domain and content).
3. Use the marketplace's escrow only (Escrow.com $50 on $1,500, official). Refuse off-platform payment, look-alike escrow sites, overpayment refunds, and any transfer before funds are secured.
4. Minimum evidence package: domain proof, repo and inventory, build and test proof, GA4 and Search Console screenshots with dates (honest zeros if that is what they show), the transfer checklist, the affiliate-status statement, provenance notes. No claim of traffic, revenue, rankings or buyer interest.

## 6. Immediate next action
Say "merge" (T1) so I can merge the branch after the link-fix worker finishes, then run the Cowork brief (`docs/COWORK_IMMEDIATE_FLIP_BRIEF.md`) starting with B1 to B5.
