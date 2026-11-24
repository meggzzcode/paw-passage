# Immediate flip exit plan: Paws & Passage (30 days)

Written 2026-11-24. Goal: sell Paws & Passage as a pre-revenue starter site for about $1,500 gross within 30 days. The 30 days is a management deadline, not a promise or a forecast. The owner will not keep developing the site. Sources: `docs/research/MARKETPLACE-AND-BUYER-RESEARCH-2026-11-24.md` (called "the research doc"), `docs/research/PRICE-DEEP-DIVE-SUMMARY.md`, `docs/FLIP_READINESS_AUDIT.md`, `docs/TRANSFER_CHECKLIST.md`, `docs/HOSTING_PORTABILITY_REPORT.md`, `docs/MONETIZATION_READINESS.md`, `docs/COWORK_FINAL_FLIP_BROWSER_BRIEF.md`, `docs/SALE_LISTING_DRAFT.md` (being rewritten by another worker; referenced, not edited) and `docs/buyer/BUYER_WALKTHROUGH.md`.

Honesty rules for the whole plan: no invented buyer interest, traffic, revenue or comparable sales. Where a figure is third-party it is marked (3P). Day numbers count from the day the owner approves this plan (Day 1).

## 1. Realistic expectations (from the research)
- Evidence for $1,500: three broker-reported sold comps at $1,500 to $1,700 (CLAIM, undated, older domains). No verified sale of a sub-one-year, zero-revenue site was found.
- The research estimates a likely close of about $600 to $1,200 (most likely $800 to $1,000), with an optimistic $1,500 to $2,000 and a downside of $300 to $600 or no sale (ESTIMATE, moderate confidence on magnitude, low on the exact figure). Estimated 40% to 60% of starter listings do not sell (ESTIMATE).
- So $1,500 is a defensible ASK and an uncertain CLOSE. The plan targets $1,500 gross and defines in advance when to lower the ask.

## 2. Responsibilities
| Area | Claude Code | Cowork (browser) | Owner |
|---|---|---|---|
| Code and content | Approved fixes only; run tests and build; update inventory counts; write docs | none | Approve scope; say "merge"/deploy |
| Deploy | Prepare the merge | Visual QA after deploy | Turn Netlify builds on, deploy once (15 credits), turn off again if desired |
| Evidence | Update `BUYER_ASSET_INVENTORY.md` after final build | Search Console, Bing (if signed in), PageSpeed, listing-claim check, screenshots, walkthrough video (private storage) | Grant access; decide what a buyer may see |
| Marketplace | Draft and revise listing copy and outreach text | Verify live fee and eligibility pages in a browser; never submit | Open seller account, identity verification, approve text, publish listing, pay fees |
| Sales | Draft replies to enquiries for owner approval | none (no contact with buyers) | Send every message; accept or reject offers; set floor |
| Closing | Prepare repo handover, checklists | Screenshot evidence of ownership steps if asked | Escrow, domain push, bill of sale, assignment, account moves |
| Money | none | none | All payments, tax, identity |
Cowork rules: read-only unless a task says "with owner authorization"; no purchases, no listings, no buyer contact, no changes to DNS or accounts (see `docs/COWORK_FINAL_FLIP_BROWSER_BRIEF.md` section 0).

## 3. Development budget
Maximum development budget: **8 hours of Claude Code and owner time in total across all 30 days, of which no more than 5 hours before the listing goes live (Days 1 to 5)**. SUBJECT TO OWNER APPROVAL. Anything beyond this requires the section 8 test to pass and a fresh owner approval. The audit estimates the full P0 path at 4 to 5 hours hands-on, so 8 hours leaves a small reserve for Cowork-found defects.

## 4. Phases, dependencies and acceptance criteria
### Phase A, Days 1 to 5: finish approved improvements and QA
- Actions: complete the already-approved buyer-facing changes; run `bunx tsc --noEmit`, `bunx vitest run` and the build on final `main`; owner turns Netlify builds on and deploys ONCE (15 credits; avoid repeat deploys); Cowork runs the final browser brief (visual QA 1280 and 390 px, competitor validation limited to the five-recommendation cap, Search Console, Bing if signed in, PageSpeed, listing-claim check); Claude fixes only items classed as defects (broken page, dead link, wrong claim, disclosure missing), not preferences.
- Dependencies: owner deploys before Cowork starts sections 1 to 5; Cowork results before the listing numbers are final.
- Acceptance: tests and build pass on `main`; live site shows the new build (affiliate labels present); no 404 from internal links; Cowork report ends with READY TO LIST or READY AFTER (items) and every blocking item is fixed or consciously waived by the owner; development hours logged.
### Phase B, Days 5 to 7: evidence, listing, handover
- Actions: file private evidence (Search Console and PageSpeed screenshots with dates, honest zeros); update `docs/BUYER_ASSET_INVENTORY.md`; Cowork verifies Flippa's live fee page and starter-site acceptance (the research could not read it; the $29 / 10% figures are 3P); record the walkthrough video and screenshots per `docs/buyer/BUYER_WALKTHROUGH.md` (no video exists yet); finalize `docs/SALE_LISTING_DRAFT.md` and the outreach text; owner opens and verifies the marketplace seller account and chooses repo handover form and the MINIMUM ACCEPTABLE OFFER (section 7); prepare the transfer docs and the bill-of-sale and copyright assignment text for review.
- Dependencies: Phase A done; owner identity verification (external wait time unknown, UNVERIFIED).
- Acceptance: listing text matches verified counts (MATCH on every claim in Cowork's table); evidence folder complete; owner has written the price floor decision (even if "no floor"); listing ready to publish; asking price $1,500 entered with offers invited.
### Phase C, Days 8 to 21: authorized sales activity
- Actions: owner publishes on Flippa Basic and on SideProjectors the same day, after confirming live fees and eligibility; 5 to 10 individual outreach messages in week 1 (one message each, no mass mailing, escrow-only); review engagement every 3 days; answer enquiries within 24 hours; refuse off-platform payment and transfers before escrow is funded.
- Dependencies: Phase B acceptance; owner sends all messages.
- Acceptance: listing live, outreach sent and logged (date, recipient type, response); enquiry log kept (see section 6 counting rules); price triggers evaluated on Days 8, 14, 21.
### Phase D, Days 22 to 30: evaluate, negotiate, close
- Actions: price evaluation on Day 21 and 28; qualified-enquiry follow-up; objection handling (section 10); offers; escrow close. Day 30 decision (section 11).
- Acceptance: a recorded day-30 decision with the evidence counts, or a closed sale with escrow funds secured before any transfer.

## 5. Estimated selling and marketplace costs at a $1,500 sale
All Flippa figures are third-party (3P: exitbid.io, published 2026-04-09) and conflict with earlier reports; confirm on flippa.com/pricing in a browser. Source for the table: the research doc section 5.
| Route | Listing | Success fee | Escrow | Net to owner |
|---|---|---|---|---|
| Flippa Basic (3P) | $29 | 10% = $150 | $0 if buyer pays; $50 if seller pays (Escrow.com minimum) | $1,321 or $1,271 |
| Flippa Startup, 90 days (3P) | $149 | $150 | as above | $1,201 or $1,151 |
| SideProjectors, free tier | $0 | not stated, UNVERIFIED | not stated | up to $1,500, UNVERIFIED |
| Direct sale via Escrow.com | $0 | $0 | $0 to $50 | $1,450 to $1,500 |
| Money Nomad (earlier doc) | $297 | $0 | $0 to $50 | about $1,153 to $1,203 |
Other costs: legal review of a bill of sale/assignment is optional and not estimated here (owner decision). Hosting on Netlify free plan: one deploy is 15 of 300 monthly credits (3P/vendor page, `docs/HOSTING_PORTABILITY_REPORT.md`). Domain renewal is a buyer cost after transfer (registration valid to 2027-11-17; auto-renew was OFF at the audit, so the owner should make sure it does not lapse during the sale).

## 6. Pricing strategy
Ask $1,500 gross, offers invited, offered via Flippa Basic ($29) plus SideProjectors (free) plus direct outreach. Never accept off-platform payment.
Counting rules (so triggers are objective): a QUALIFIED ENQUIRY is a message from an identifiable account that asks a specific question about the site or the transfer, or requests the dataset sample or repo access. A "view" is the marketplace's own listing-view count. An OFFER is a written amount through the platform or email, with the buyer using escrow. Spam, "is it still available" with no follow-up and requests for off-platform payment do not count. Log each with date and source. If the platform shows no view counts, use enquiries and offers only and say so.
Triggers (the research doc's day-8/14/21 triggers, refined; thresholds are my proposals):
| Day | Condition (measured since listing) | Action |
|---|---|---|
| 8 | 0 qualified enquiries and the listing has fewer than 50 views (or no view data) | Keep $1,500; check title, first paragraph, screenshots; send the remaining outreach messages |
| 8 | 0 qualified enquiries but 50+ views | Keep price; test a stronger title and add the walkthrough link; views without enquiries suggest a copy problem, not a price problem |
| 8 | 1 to 3 qualified enquiries, no offer | Hold price; answer fully and offer a dataset sample |
| 14 | 0 qualified enquiries, or fewer than 3 enquiries and no offer | Cut ask to $1,200 |
| 14 | 3+ qualified enquiries but 0 offers | Hold $1,500 until Day 17 and ask enquirers what blocks them; if the answer is price, cut to $1,200 |
| 14 | Any written offer of $900 or more | Counter at $1,200 to $1,300 (subject to the owner's floor) |
| 21 | No offer above $600 | Cut ask to $900; consider the Startup tier ($149, 3P) only with 5+ qualified enquiries |
| 21 | Offer of $700 or more through escrow | Accept the best offer if it meets the owner's floor; a closed 30-day sale beats an unsold listing |
| 30 | No offer meeting the floor | Apply the Day 30 decision framework (section 11) |
The plan lowers the ASK, not the owner's floor; the floor is the owner's decision.

## 7. MINIMUM ACCEPTABLE OFFER: OWNER DECISION
**Minimum acceptable offer: $__________ gross (OWNER TO FILL IN BEFORE THE LISTING GOES LIVE). Not assumed by Claude.**
Considerations to weigh (not recommendations of a number):
- Net after fees: on Flippa Basic a $900 sale nets about $781 to $831 (3P figures: $29 + 10% + optional $50 escrow); at $600 about $490 to $541.
- The research's likely closing range is $600 to $1,200 and its downside is $300 to $600; a floor above $1,200 makes "no sale" the likely result.
- The domain alone is estimated at about $0 to $200 wholesale and $250 to $1,000 retail (ESTIMATE, low confidence); a floor below the replacement-cost range ($1,170 to $4,900 for the content, ARITHMETIC ceiling) is selling at a steep discount to rebuild cost, but replacement cost is not sale value.
- Time value: the owner will not keep developing it, so the alternative to selling is holding a zero-traffic asset that costs about $20 to $35 a year.
- Whether to accept payment plans or non-escrow terms: recommended no.
- Whether a lower floor is acceptable only after Day 21.
Record the decision, date and any later change in this section.

## 8. "Will this materially improve the probability of a $1,500 sale in 30 days?" test
Any proposed extra task must pass all five questions to be done now; one "no" means defer or drop.
1. Does it fix a defect that a buyer would see in the first five minutes (broken page, dead link, wrong claim, missing disclosure, rights issue)? 
2. Does it add evidence a buyer asked for, or a listed marketplace requires, that we do not already have?
3. Can it be done within the remaining development budget (section 3) without delaying the listing date by more than one day?
4. Is the benefit visible to a buyer, not merely a seller preference?
5. Is the effect likely to be large enough to move the price or conversion, not merely marginal? (Judgment; say why.)
Application to open items (judgment, not data; no source measures a dollar uplift for any of these):
| Item | Decision | Reason |
|---|---|---|
| First-aid products (four retired from the catalog on 2026-11-19; first-aid guide needs earning products) | DEFER unless the first-aid guide currently has no earning product or shows a dead card; if it does, treat it as a Phase A defect (fix only the card, 30 minutes max) | The rule "every published guide has at least one earning product" already holds per the product-links guide; adding more products adds seller-ID links that the buyer must replace anyway (non-transferable), so it does not change value |
| Cost-guide hero image | DO NOW only if the image has no recorded credit or source (a rights or honesty issue, like the earlier hero); otherwise DEFER | Rights and provenance affect closing and honesty; aesthetics do not move a $1,500 decision. Check image credits (`src/content/image-credits.ts`) first, 10 minutes |
| ID tag product (the AKC Reunite tag was retired with no matching listing) | DEFER | New affiliate links are seller IDs that do not transfer; zero evidence it influences a buyer; adds QA and a deploy |
| Bing Webmaster verification | DO NOW only as a Cowork read-only step IF the owner is already signed in (about 15 minutes, no development); otherwise DEFER and tell buyers it is not done | The Cowork brief calls it "desirable buyer evidence, not a blocker"; a buyer must verify with their own account anyway, so verification is of little transferable value |
| Cookie consent banner (T17), 5 long titles (T16), more guides, redesigns, backlinks, ad or affiliate applications | DEFER (the flip audit classed them P2 or "do not do") | Not buyer-critical |
| Walkthrough video and screenshots | DO NOW | Passes the test: the buyer-facing proof, costs Cowork time not development hours |
| Pages CMS live test | DO ONLY WITH OWNER APPROVAL (a save is a production deploy, 15 credits) and as Cowork task; otherwise state "untested" in the listing | A buyer cares, but the honest "untested" disclosure is acceptable |

## 9. Contingency if qualified interest is insufficient
Trigger: at Day 14 under the pricing table, with 0 qualified enquiries, or at Day 21 with fewer than 3.
1. Alternate venues (research doc: verify before use): Motion Invest (contact first; thresholds not published, reported minimum income, UNVERIFIED eligibility); forum marketplaces such as Digital Point (needs a linked PayPal account; fees and rules UNVERIFIED; high scam exposure, avoid off-platform payment); r/Flippa and Indie Hackers (rules unread). Do not use BlackHatWorld.
2. Direct outreach: another 10 individual messages to the buyer types in section 12 (dog-travel publishers, pet-site owners, vacation-rental bloggers); one message each; send only after the owner approves each batch.
3. Listing changes: new title, first-paragraph rewrite, add the walkthrough video link, lead with the dataset and tools.
4. Domain-only fallback: list the domain on Sedo or Afternic (Dan.com redirects to Afternic), commission figures in the earlier doc; a fresh domain with no history is a weak asset (research: usually does not sell, wholesale $0 to $200). Alternative: sell content and domain separately, or relist at $600 (research doc Day 30 row).
5. Do not resume development to chase traffic; that violates the mission.

## 10. Objection handling (honest answers)
| Objection | Answer |
|---|---|
| No traffic or revenue | Correct, it is sold as a pre-revenue starter. Search Console baseline (236 impressions, 0 clicks in 28 days, from the owner's earlier report; refresh from the Cowork run and quote the dated number) is available privately |
| Affiliate accounts do not transfer | Correct; buyer applies fresh; steps are in `docs/MONETIZATION_READINESS.md` section 5; Amazon requires qualifying sales within 180 days of applying |
| AI-assisted content | Disclosed on the site and in the listing; each guide has sources and a claims record |
| Young domain | Correct (registered November 2026) |
| CMS untested | Correct; editing directly in GitHub works; buyer test is step 1 |
| Price too high | Show the comps honestly as broker-reported, offer the triggers' lower ask only on schedule |

## 11. Outreach message (from the research doc, to be sent by the owner only)
> Subject: Small dog-travel site for sale, pre-revenue
>
> Hi [name], I run Paws & Passage, a new dog-friendly travel site, and I am selling it. It is pre-revenue: the domain was registered in November 2026, there is no traffic or earnings history, and Search Console shows 236 impressions and no clicks over 28 days. It includes 30 guides (AI-assisted and disclosed), an original dataset of 38 property-manager pet policies, four planning tools, a stay directory and a gear hub. Affiliate and analytics accounts cannot be transferred; the buyer would apply fresh. I am asking $1,500 and will consider reasonable offers via Escrow.com. If useful I can send a sample of the dataset and a content list. No reply is needed if it is not a fit.

Before sending: replace the Search Console numbers with the dated figures from the final Cowork run, and fix counts to match the final listing (the draft listing now says 3 tools plus a gear hub; the research text says four tools, and the pet cost check was removed on 2026-11-24, so reconcile before sending). Only the owner sends messages.

## 12. Buyer types (leads, not confirmed buyers)
| Type | Why interested | Leads from the research (verify first) | Pitch emphasis |
|---|---|---|---|
| Pet-travel publishers | Dataset, guides, directory fill gaps | GoPetFriendly (closed its directory in 2025; blog remains); Pet Traveller (Australia), Dog Jaunt, PetsPyjamas (UK) (all SNIPPET only); PetsWelcome was bought by HotelPlanner in 2024 (category has corporate buyers, but unlikely at this price) | Dataset and directory |
| Affiliate content operators | Skip months of writing | No named operator verified; Flippa and forums | Guides, gear hub, ID-swap steps |
| Vacation-rental and travel bloggers | Add a pet-friendly vertical | Travelnuity, Nomadic Matt dog page (SNIPPET) | Guides and policy dataset |
| Dog-site owners | Content bolt-on, tools | Feedspot 2026 dog-friendly travel list (SNIPPET) | Tools and code |
| Pet-brand marketers | Gear and travel content | Rover blog, Marriott Traveler (corporate; unlikely) | Low priority |
| Newsletter operators | Repurposable content | None verified | Low priority |
| Domain investors | Brandable name | Low odds for a week-old name | Fallback only |
| Developers (SideProjectors) | Codebase | Listing site | Tests (486), no backend, docs |

## 13. Day 30 decision framework
Development does NOT continue automatically after Day 30. Any continuation needs a new written owner decision.
| Decision | Evidence threshold | Next step |
|---|---|---|
| SELL | A written offer at or above the owner's minimum (section 7) with funds through escrow | Close per `docs/TRANSFER_CHECKLIST.md`; transfer only after funds secured |
| REPRICE | 3+ qualified enquiries or a verified offer within 30% below the floor and no sale, or 100+ views with 0 offers (if view data exists) | Lower the ask once (to $900 or the last trigger step) and relist; no new development |
| EXTEND BRIEFLY | A named, qualified buyer in active talks (documented messages) or an escrow in progress at Day 30 | Extend up to 7 days only for that buyer; no development |
| WITHDRAW | Fewer than 2 qualified enquiries in total, no offer above $300, and contingency steps in section 9 exhausted | Withdraw the listing; domain-only fallback or hold the site at about $20 to $35 a year; revisit only by owner decision |
Record the decision, the counts (views, qualified enquiries, offers, outreach sent) and the date in this file.
