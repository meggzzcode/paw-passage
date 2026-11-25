# Buyer asset inventory: Paws & Passage

Re-verified 2026-11-24 (final) against repository `HEAD` `9797221` on `main`: tests (`bunx vitest run`: **771 tests in 59 files**, all passing), `bunx tsc --noEmit` and `bunx eslint . --quiet` clean, a production build served locally, all **103** sitemap URLs fetched (all HTTP 200), `node scripts/verify-site.mjs` (**319 checks passed, 0 failed**), and the content counted with the site's own rules. Commands and every count: `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. This file replaces the versions made at `13a7ce1` and `56552fc`; the older numbers (498, 605 and 610 tests, 57,011 words, 452 sources, 37 stay files, 53 active products, the 95-URL and 98-URL sitemaps, a "15-item" packing list, calculators, per-button affiliate labels on guides and Gear) are superseded.

**Deploy pending: nothing in this file is live.** Production serves a build from about 2026-11-23 (`ced2c93`), 214 commits behind `HEAD` when compared (`docs/SEO_ROOT_CAUSE_INVESTIGATION.md`). This file describes the repository. Every listing claim about the live site must be re-verified after the owner deploys (`docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`).

Labels: VERIFIED (counted, built, run or read on 2026-11-24), OWNER (fact supplied by the owner, not checkable from the repo), UNVERIFIED (could not be checked).

## 1. Scope of the sale

A **pre-revenue starter site**, offered at about $1,500. The owner is selling it, not operating or growing it. The package is finished content, original research, working tools, a documented codebase and the domain. It is not a business with traffic, earnings, subscribers or approved partnerships. A configured affiliate ID in the repo is not evidence of an active partnership, and affiliate accounts do not transfer (section 13).

Live site versus repo: the owner has stopped Netlify builds to preserve credits (OWNER), so the live site serves the last successful deploy (about 2026-11-23) and the final editorial pass, the Gear redesign, the packing planner rebuild, the 8 town articles and the added stays are **not live**. Everything below describes `HEAD`. The first deploy on the buyer's own Netlify account will publish `HEAD`.

## 2. Headline numbers (HEAD, VERIFIED)

| Asset | Quantity |
|---|---|
| Sitemap URLs | 103 (home 1, guides 30, stays 24, gear 12, destinations 17, dogs 5, tools 4, data 1, trust and info pages 9) |
| Published guides | 29 (32 files: 25 Markdown, 7 TypeScript; 3 drafts held back) |
| Words in published guide bodies | 45,093 (1,014 to 2,027 per guide) |
| Sources / inline citations | 420 listed sources, each linked inside the article text by publisher name (no numbered markers); 152 FAQs |
| Original dataset | 38 vacation-rental managers x 13 fields, read 2026-11-18, one source URL per row |
| Stay pages | 83 stay files, **0 host-confirmed** (none confirmed with a host); 78 shown (listed) with their own detail page; 23 indexable (in the sitemap); 55 shown but `noindex`; 5 hidden |
| Destination / dog-type pages | 2 states + 8 towns defined (6 indexable) + 8 "things to do with a dog" articles (not guides); 4 dog-type pages |
| Planning tools | 3 (will my dog be accepted, dog packing list planner, before-you-book checklist); no calculators |
| Gear | 11 category pages + hub; 92 product records, 65 active; 5 curated trip collections |
| Pick/spec cards in guides | 90 across all 29 guides |
| Pins and share images | 29 pins (1000x1500) + pin sheet; 30 share images (1200x630) |
| Tests | 771 in 59 files |

## 3. Published guides and research

| Item | Detail | Where |
|---|---|---|
| Published guides | 29 on dog-friendly vacation-rental travel: pet fees, dog limits, breed restrictions, damage charges, fenced yards, large dogs (the former no-weight-limit guide is merged into the large-dog guide and redirects with a 301), puppies, seniors, reactive dogs, two large dogs in a car, holidays, packing, car safety, first aid, cooling, cold weather, hiking, life jackets, ramps, bowls, lost-dog plan | `content/guides/*.md` (25 files, editable in Pages CMS), `src/content/guides/*.ts` (7 files, need a developer) |
| Length | 45,093 words in bodies; 1,014 to 2,027 per guide (the final editorial pass cut the same 29 guides by about 45% from 81,901; the guides are answer-first, not padded) | script, method in the counts file |
| Citations | 420 sources (title, publisher, URL, access date) listed per guide in a compact collapsed Sources list, and linked inline in the article text by publisher name (natural publisher links or short parenthetical links such as ([Airbnb](url)); no numbers; numbered markers were removed 2026-11-24). All 420 are linked inside the text (checked on the built pages) | frontmatter `sources`, body inline links |
| Pick/spec cards | 90 cards (the shared Gear product card) with a reason, up to three fact chips and one "See it at Amazon" button; no per-card affiliate label | guide bodies |
| Drafts | 3 unpublished guides (breed restrictions, listing red flags, no-pets rental), ready to finish | `content/guides/` |
| Audit trail | Per-guide claims and fact-check files (`docs/CLAIMS-*.md`, `docs/FACTCHECK-*.md`), editorial scorecards and change logs (`docs/editorial/`, `docs/ARTICLE_SCORECARD.md`), independent reader reviews (`docs/review/FINAL-READER-*.md`) and the final release report (`docs/FINAL_EDITORIAL_RELEASE.md`: independent reader mean 7.1 of 10, "ready with minor fixes", corrections applied after review and not re-scored) | `docs/` |
| Publish gate | A guide is public only with status published, research complete, no unverified claims, and an approver name and date | `src/content/publish-rule.ts` |
| AI-assisted content | Disclosed on `/editorial-standards`: AI tools assist research, analysis and drafting; source checks are also AI-assisted; no first-hand testing, property visits or human fact-checker is claimed | `src/routes/editorial-standards.tsx` |

The guides are researched from public sources with the method disclosed. They are not first-hand tests.

## 4. Original pet-policy dataset

| Item | Value |
|---|---|
| Rows and fields | 38 managers x 13 fields: manager, region, place, dog_or_pet_limit, limit_basis, weight_limit, breed_rule, pet_fee_as_stated, dogs_in_pool_or_hot_tub, minimum_dog_age, leaving_dog_alone, source_page, read_on |
| Dates and sources | one read date (2026-11-18), 38 distinct source page URLs |
| Published as | `/data/pet-policies` (38-row filterable table, Dataset JSON-LD) and a downloadable CSV `/pet-policies-38-managers.csv` (HTTP 200 in the crawl, 39 lines) |
| Raw notes | 5 regional CSVs in `docs/data/`, re-check procedure `docs/DATA-RECHECK-LOG.md`, builder `scripts/make-policy-csv.mjs` |
| Used by | the "will my dog be accepted" tool, guide counts and tables |
| Nature | Each cell is a public fact from a manager's own page. What is original is the selection, the 13-column structure, the classification and the dated, sourced reading. It is a convenience sample, not a survey, and policies change. The JSON-LD declares CC BY 4.0; the buyer decides whether to keep that. The managers' website terms were not reviewed (UNVERIFIED) |

## 5. Vacation-rental research and stay listing information

| Item | Detail |
|---|---|
| Stay files | 83 (Georgia 49, California 34, across 27 towns), all `status: unverified` (**host-confirmed: 0**): written from public listing information with pet-policy fields, not confirmed with hosts, each page saying its details are read from the listing and not confirmed with the host (each page states the date its listing was read). No photo permission recorded; pages carry no photos of the rentals |
| Shown in the directory | 78 (Georgia 47, California 31), each with its own detail page and search filters (state, town, type, dogs, weight limit, fenced yard and others). The site ships in `stayDirectoryMode: public-sources` (owner-approved 2026-11-25): a stay is shown with a public Vrbo or Airbnb source link, and keeps a labelled affiliate button only while it has the seller's approved link. The seller's deeplinks do not transfer; removing them leaves the same 78 shown and 23 indexable with plain links, no commission and no affiliate label. The old `affiliate-only` mode would empty the directory (0 listed, stay pages 404) (`docs/BUYER_AFFILIATE_TRANSITION.md` sections 5 and 6) |
| Indexable | 23 stay pages are in the sitemap; 55 shown stays are `noindex` because they are too thin by the quality rule. "Listed" does not mean "in the sitemap" and does not mean "indexed by Google" |
| Hidden | 5 stay files (83 minus 78) without an approved link (`coastal-bliss-fort-bragg-hot-tub-ocean-views`, `large-oceanfront-home-cleone-fort-bragg-hot-tub`, `rosemarys-retreat-mendocino-oceanfront`, `that-cabin-on-that-lane-blue-ridge`, `woof-in-the-woods-cabin-blue-ridge`) |
| Destinations | Georgia and California state pages; towns Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara indexable; Monterey and Mendocino defined but `noindex`. Stay files cover 27 towns, so most stays sit in towns with no page of their own |
| Dog types | 4 collection pages (escape artists, big dogs, multi-dog families, senior dogs) that link guides |
| Dog-rules places | 14 place files (parks, beaches, trails), all unverified, 0 public; the `/dog-rules` section is `noindex`. A research backlog, not a live asset (`docs/COWORK-VERIFY-PLACES.md`) |
| Importers | `scripts/import-stays.ts`, `scripts/stay-deeplink-worksheet.ts` |

## 6. Working planning tools (each loaded in Playwright and exercised once, 2026-11-24)

| Tool | Route | What was done | Result |
|---|---|---|---|
| Will my dog be accepted? | `/tools/will-my-dog-be-accepted` | chose 2 dogs, entered weights, picked a breed group, pressed "Check these managers" | Worked: "Of 38 rental managers, 0 show no conflict for your 2 dogs, 34 need a question first, and 4 look like a problem", with per-manager reasons, region filter, copy and print |
| Dog packing list planner | `/tools/packing-list` | rebuilt 2026-11-24 (section 6b): trip setup, personalized checklist, saves on the device, copy and print | Covered by the packing tests and `scripts/qa/` browser runs (`docs/PACKING_PLANNER_QA.md`); the older "Add to bag" tool no longer exists |
| Before-you-book checklist | `/tools/checklist` | ticked 2 items, reloaded | Worked: 25 items in 5 groups; ticks persisted; Print and Reset buttons present |
| Stay directory filters | `/stays` | typed in the search box | Worked; filter controls listed |

The final QA crawl exercised all three tools again at 390 and 1280 px on the final build (ticking two checklist boxes changed "0 of 25 done" to "2 of 25 done"; the packing tool changed its list; the acceptance tool returned "Of 38 rental managers, 22 show no conflict for your 2 dogs, 13 need a question first, 3 look like a problem" for 2 dogs at 60 lb), so the result above depends on the inputs chosen. Tools run in the browser; no data is sent anywhere. Old calculator, question-writer and pet-cost addresses 301 to `/tools` (checked). The only console errors were the Google, Amazon and Vrbo requests this test blocked on purpose.

## 6b. Dog packing list planner (rebuilt, content-driven)
A trip setup (trip type, days, dogs, optional meals per day and conditions) produces a personalized, grouped packing checklist: packed and "Need to buy" states (independent), editable quantities, a "Why bring this?" explanation, "Remove from list" with Undo, custom items, "A few extras worth considering" (optional items the visitor adds with one click), copy as plain text and a print stylesheet. Everything it suggests is declared in `content/packing.yml`: **37 items (12 essential, 15 conditional, 10 optional), 5 trip types, 9 conditions, 7 categories**; it is built from the visitor's answers, not a fixed 15-item list. "Need to buy" always answers in one of four ways (researched product cards; a pointer to the related Gear category; a quiet "added to your shopping list" note; or a note for the visitor's own item). Every active Gear product is reachable from the planner or a Gear category it links to (0 unreachable; `docs/PACKING_GEAR_COVERAGE.md`). Product suggestions use the existing catalog and approved Amazon links and carry the Amazon sentence. The cabin guide has a "Make this list yours" module that opens the planner with a preset. **Lists are saved in the visitor's own browser (local storage) only: no accounts, no sync across devices, no AI, nothing sent to a server.** Documentation: `docs/PACKING_PLANNER_PRODUCT_GUIDE.md`; test evidence and what is unverified: `docs/PACKING_PLANNER_QA.md`. The Pages CMS form for it has not been tried live; direct YAML editing is the verified route (a local build showed an edited item reach the compiled site data).

## 7. Gear guides and commercial pages

| Item | Detail |
|---|---|
| Gear hub | `/gear` is a **photo-free editorial shop**: hero, five curated trip collections (road trip, cabin stay, beach and lake, winter, hiking; server-rendered `?trip=` views, `noindex`), a short featured list, all 11 category tiles, dog-type shortcuts and a link to the packing tool. 11 live category pages (car safety, car interior, ramps and steps, feeding and hydration, pens and gates, comfort and cooling, water and beach, trail and hiking, cold weather, safety ID and first aid, rental cleanup). Legacy category addresses redirect with 301. Design spec and an honest self-score (7.7 of 10, not the 9 target): `docs/GEAR_SHOPPER_EXPERIENCE_SPEC.md` |
| Products | 92 records, 65 active, each with a source, a read date and an Amazon link (the Amazon listing is the working link; a maker page is shown where one was found). No prices, ratings, stock or "tested" claims by design. No third-party (Amazon) product images: cards use the site's own graphic panels, icons and spec chips |
| Gear guides | Every published guide (29 of 29) carries at least one earning product, placed beside the paragraph that explains it; 90 pick cards in all |
| Disclosure | One affiliate notice at the top of every guide and Gear page that carries an affiliate link, including Amazon's exact sentence ("As an Amazon Associate I earn from qualifying purchases."); **per-button affiliate labels were removed** on guides and Gear (0 on the build) and no "Check the current price" lines remain. **Open mismatch (owner decision):** Vrbo booking buttons on stay pages still show "Affiliate link · We may earn a commission if you book, at no extra cost to you.", while `/affiliate-disclosure` still says every buy or booking button carries its own label, which is no longer true for Amazon buttons. 49 of 49 pages with an Amazon link carry the sentence (build of `9797221`) |
| Commerce wiring | `content/affiliates.yml` (160 entries) and `content/settings.yml`; see section 13 and `docs/GEAR_REDESIGN_IMPLEMENTATION.md` ("How to replace affiliate IDs") |

## 8. Domain and transferable assets

| Asset | State |
|---|---|
| Domain `pawsandpassage.com` | Namecheap. Registrar start 2026-11-16, valid to 2027-11-17 (OWNER). **Auto-renew is OFF pending the owner's decision**: if nothing changes the domain expires on 2027-11-17. Renewal about $19.98 a year (read 2026-11-18, `docs/COSTS-AND-ACCOUNTS.md`). Transfer by Namecheap account-to-account change of ownership (`docs/DNS-AND-TRANSFER.md`); a registrar-lock window may apply to moving registrars (UNVERIFIED, confirm with Namecheap) |
| DNS | Stays at Namecheap; mail records must not be deleted (`docs/DNS-AND-TRANSFER.md` section 3) |
| Code and original content | Transferred by written assignment. There is no LICENSE file in the repository; the assignment wording is a seller and legal item, not drafted here. The seller's original text and code are what the assignment covers; third-party code keeps its own (permissive, per the earlier audit) licenses and the Unsplash photos remain Unsplash-licensed |
| Mailbox `hello@pawsandpassage.com` | Namecheap Private Email, not pushed with the domain; support-assisted move or a fresh mailbox (`docs/EMAIL-AND-TRANSFER.md`) |
| Pet-policy dataset, pins, share images | Transfer with the code |
| NOT transferable | Amazon Associates account and tag, Vrbo/Expedia affiliate account and deeplinks, Impact, Awin, GA4 property login, Search Console ownership, Pinterest account (owner decision), Lovable workspace |

## 9. Repository and deployment system

| Item | Detail |
|---|---|
| Stack | TanStack Start (React, Vite, Tailwind), server rendered; no database, no logins, no paid services required |
| Repository | GitHub, 518 commits at `9797221` (first 2026-11-16), public; owner transfers it to the buyer's account. History contains the owner's author email (decision: keep history or hand over a squashed copy) |
| Hosting | Netlify Free plan; `netlify.toml` holds the build (`npm run build`, publish `dist`, Node 22), 10 permanent redirects, caching and security headers, and a rule skipping builds for docs-only pushes. **Netlify builds are currently stopped by the owner to preserve credits (about 65 left; 15 credits per production deploy)** (OWNER). A buyer's own free account starts with its own monthly allowance (300 credits a month on the free plan per Netlify's pricing page read 2026-11-18, `docs/COSTS-AND-ACCOUNTS.md`) |
| Portability | Clean installs and builds were run with no Lovable account: Node build, default build and a Netlify-style build all passed (`docs/HOSTING_PORTABILITY_REPORT.md`, `docs/buyer/HOSTING_OPTIONS.md`). Netlify is recommended; Lovable hosting is optional and untested |
| One Lovable dependency | devDependency `@lovable.dev/vite-tanstack-config` 2.27.2 (public npm, MIT, no login). A developer could replace it with a plain Vite config. Plus a no-op error hook and text/comments mentioning Lovable. Advice: the owner disconnects Lovable's GitHub sync before handover (UNVERIFIED whether it is currently connected) |
| CI and automation | 4 GitHub Actions workflows (tests and build, weekly health check, monthly digest, manual IndexNow). Not observed running on a schedule in this audit |
| Tests and build | 771 tests pass in 59 files; `tsc`, `eslint --quiet` and the production build pass; scripts for verifying a live site (`scripts/verify-site.mjs`) |

## 10. Content management (Pages CMS, `.pages.yml`)

7 collections: guides (25 Markdown files), stays, places, affiliates, products, packing planner, settings (`content/settings.yml`: contact email, site URL, GA4 ID, Amazon tag, Impact verification value, Pinterest URL, Stay22 ID, "Which stays are listed"). `.pages.yml` was rebuilt without YAML anchors, and three labels that contained a question mark were quoted because unquoted they broke strict YAML parsers (commit `9797221`); structure tests `pages-config.test.ts` and `pages-config-structure.test.ts` pass. Uploads go to `public/uploads`. A save is a commit; a commit to `main` triggers a production deploy, which costs Netlify credits on the free plan. **UNVERIFIED: no one has signed in to the live Pages CMS app with the owner's GitHub login and saved a change** (`docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`, section "Pages CMS"); the direct-edit path (GitHub web editor, then a Netlify build) was rebuilt locally. Which branch the CMS writes to is unconfirmed. Not editable in the CMS: the 7 TypeScript guides, destinations and towns and the 8 things-to-do articles, gear category copy, dog-type pages, the checklist items, the 38-manager data file, trust pages, navigation and design. Writing guide: `docs/WRITING-IN-MARKDOWN.md`.

## 11. Brand assets and licenses

| Asset | License / status |
|---|---|
| Hero and guide photos | Unsplash photos used under the Unsplash License, 64 credit entries in `src/content/image-credits.ts`. The home hero is a credited Unsplash photo (`hero-porch`, photographer Cody Scott Milewski). **The license gives usage rights, not ownership or exclusivity**: the buyer may keep using the photos, but does not own their copyright and others may use them too. Credits must stay |
| Product imagery | None from third parties; no Amazon images. Product cards use the site's own line-icon spec cards |
| Photos of real rentals | None |
| Pins and share images | 29 pins (1000x1500) and 30 share images (1200x630) generated from the site's own photos and text by `scripts/make-pin-sheet.py` and `scripts/make-share-images.py`; rights chain follows the Unsplash photos |
| Fonts | DM Sans and Fraunces, self-hosted variable WOFF2, SIL Open Font License texts included |
| Icons | `lucide-react` (open source); favicon and apple-touch icon in `public/` |
| Name, logo, wordmark | The "Paws & Passage" name is in the sale. No trademark search or registration was made (UNVERIFIED) |

## 12. SEO implementation and verified indexing evidence

Implemented (VERIFIED on a local build of `9797221`: 103 of 103 sitemap URLs return 200, self-canonical, one H1, title of at most 60 characters, description of 120 to 160 characters, no noindex): 103-URL generated sitemap, absolute canonical on every page (0 mismatches), per-page titles and descriptions, `noindex` on thin pages, `robots.txt` with the sitemap line, Organization, Article, BreadcrumbList and Dataset JSON-LD, IndexNow key file and script, 301 redirects for retired addresses (the merged large-dog guide returns 301 to its survivor), and a weekly health-check workflow. An SEO investigation (`docs/SEO_ROOT_CAUSE_INVESTIGATION.md`, `docs/SEO_IMPLEMENTATION_RESULTS.md`) found no technical blocker in the built site and made small internal-link fixes (two orphaned town articles linked from the state pages, one redirect-passing link, dataset and cluster links).

Indexing evidence (**HISTORICAL baseline**, OWNER, Google Search Console, not re-checked here, measured on the older production build): **Google URL Inspection showed 21 of 23 inspected pages indexed. Search Console reported 236 impressions and 0 clicks over 28 days.** That is the whole of it. It does not show that all 103 sitemap URLs are indexed, it describes pages that are no longer what the repository contains, and it is not a traffic or revenue history. GA4 for 2026-11-17 to 11-23 showed 463 sessions, 450 Direct and 0 Organic (OWNER, via the investigation file). Evidence screenshots are held privately (`docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`).

Not included: any ranking history, backlink profile or field performance data. The domain was registered 2026-11-16 (about 8 days old on 2026-11-24); a new domain with no inbound links normally takes weeks to be crawled and trusted, and **production is stale until the owner deploys**, so rankings cannot yet be read against the new build.

## 13. Monetization setup and requirements for buyer-owned accounts

Full detail: `docs/BUYER_AFFILIATE_TRANSITION.md` (the replacement procedure, `node scripts/audit-seller-ids.mjs` and what breaks if IDs are removed) and `docs/MONETIZATION_READINESS.md` (older; use `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` for current counts). **Configured affiliate links are not proof of approval, and no verified affiliate approval exists for a buyer.**

| Channel | State in the repo | What the buyer must do |
|---|---|---|
| Amazon Associates | Tag `pawspassage-20` configured; 81 Amazon link entries (71 approved, 10 not); 65 distinct Amazon URLs render on the Gear pages (270 tagged link occurrences on 49 of the 103 sitemap pages in the build of `9797221`); approval status of the seller's account UNKNOWN | Apply for their own Associates account, set `amazonTrackingId` in `content/settings.yml` (tested: one value retags every link; empty value hides all Amazon links and the Amazon sentence) |
| Vrbo (Expedia Group creator deeplinks) | 79 entries (1 generic + 78 per-listing), all marked approved; each listed stay shows 2 booking buttons | Open their own Expedia Group affiliate account and regenerate and replace every deeplink (worksheet and import scripts included); until replaced, clicks credit the seller |
| Impact | A site-verification value in `content/settings.yml` (`impactSiteVerification`, no longer hard-coded); no Impact links | Replace or empty the value, verify with their own account |
| Awin, Chewy, others | Not in code; proposed in `docs/AFFILIATE-APPLICATION-PACK.md` | Apply fresh, per brand |
| Stay22 map | Code present, off (empty ID) | Own account |
| Display ads | None | Own account; traffic thresholds apply |
| GA4 | ID `G-1J97C8CPC1` in settings (`ga4MeasurementId`); click events `booking_click` and `product_click` tested to fire in the browser; arrival in a GA4 property not tested | Create own property and replace the ID; history does not carry over |

Affiliate accounts are not transferable in practice (Amazon's operating agreement bars assignment without written approval). A configured ID or an `approved: true` flag is not proof of an active, paying partnership: that needs account access (OWNER). No commission, click or revenue figure exists in this package.

## 14. Documentation, operating instructions and transfer support offered

- Handover set (index in order: `docs/buyer/TRANSFER_PACKAGE_INDEX.md`): `BUYER_HANDOVER.md`, `docs/TRANSFER_CHECKLIST.md`, `docs/DNS-AND-TRANSFER.md`, `docs/EMAIL-AND-TRANSFER.md`, `docs/SECURITY-AND-RECOVERY.md`, `docs/COSTS-AND-ACCOUNTS.md`, `docs/buyer/HOSTING_OPTIONS.md`, `docs/HOSTING_PORTABILITY_REPORT.md`, `docs/MONETIZATION_READINESS.md`, `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`.
- Operating: `docs/OPERATIONS-HANDBOOK.md`, weekly, monthly and quarterly checklists (`docs/SOP-*.md`), `docs/ROLLBACK.md`, data re-check log, analytics and Pinterest setup guides, 14 browser task prompts in `docs/cowork/`.
- Transfer support offered (owner decision to confirm): walking the buyer through the written transfer steps and answering questions during a short window after closing, as written in the listing. No work on growth, content or monetization is included.

## 15. How these assets save a buyer work

Qualitative only. No replacement cost, development cost or dollar value is claimed.

- **Research:** the buyer does not have to read, compare and cite hundreds of sources on pet fees, dog limits, fencing, car safety and gear, or re-derive the 38-manager policy dataset, with a source link and read date for each row.
- **Structuring:** topics, internal links between guides, dog-type collections, destination hubs, FAQs, source lists and a publish gate already exist.
- **Writing:** 29 finished guides with per-guide claims and fact-check records, plus 3 drafts, instead of a blank content calendar. Independent readers called them ready with minor fixes; the corrections made afterwards were not re-scored. Writers still need to review and keep them current.
- **Building tools:** three browser tools, a filterable stay directory and a policy data page are built, tested and documented.
- **SEO plumbing:** sitemap rules, canonicals, structured data, redirects, noindex rules, IndexNow and health checks are done; the buyer verifies their own Search Console and submits the sitemap.
- **Commerce plumbing:** affiliate-link management, a single top notice with Amazon's sentence, an Amazon-tag switch (one value retags every Amazon link) and click-event tracking are wired so the buyer swaps IDs instead of building a system; steps in `docs/GEAR_REDESIGN_IMPLEMENTATION.md`.
- **Operations:** content editing, hosting, rebuild-from-repo and security runbooks, and the handover checklists are written down.

What it does not save: applying to affiliate programs, earning traffic, keeping data fresh, or legal review.

## 16. What the buyer does NOT receive

Traffic, revenue or ranking history; affiliate approvals or accounts; the GA4 property, Search Console ownership or Bing access; Pinterest or social accounts (an owner decision, not promised); an email list (none exists); the mailbox contents; verified stays or verified dog-rules places (0 verified); photos of real rentals; ownership or exclusivity of the Unsplash photos; any warranty of results. Legal pages are generic and were not lawyer-reviewed; the buyer should add their own name, jurisdiction and contact and have them reviewed.
