# Buyer asset inventory: Paws & Passage

Verified 2026-11-24 against repository `HEAD` `56552fc` by building a clean copy (`bun install`, `NITRO_PRESET=node-server bunx vite build`, both succeeded), running it locally, crawling it with Playwright (106 distinct pages, all HTTP 200) and running `bunx vitest run` (498 tests in 40 files, all passing). Method and every count: `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. This file replaces the 2026-11-23 inventory; older numbers (98-URL sitemap, 30 guides, 53 sitemap-wide gear pages, 76,890 words, 491 sources) are superseded.

Labels: VERIFIED (counted, built, run or read on 2026-11-24), OWNER (fact supplied by the owner, not checkable from the repo), UNVERIFIED (could not be checked).

## 1. Scope of the sale

A **pre-revenue starter site**, offered at about $1,500. The owner is selling it, not operating or growing it. The package is finished content, original research, working tools, a documented codebase and the domain. It is not a business with traffic, earnings, subscribers or approved partnerships. A configured affiliate ID in the repo is not evidence of an active partnership, and affiliate accounts do not transfer (section 13).

Live site versus repo: the owner has stopped Netlify builds to preserve credits (OWNER), so the live site serves the last successful deploy. Whether it matches repo `HEAD` was not checked against the live site in this recount; everything below describes `HEAD`. The first deploy on the buyer's own Netlify account will publish `HEAD`.

## 2. Headline numbers (HEAD, VERIFIED)

| Asset | Quantity |
|---|---|
| Sitemap URLs | 95 (home 1, guides 30, stays 24, gear 12, destinations 9, dogs 5, tools 4, data 1, trust and info pages 9) |
| Published guides | 29 (32 files: 25 Markdown, 7 TypeScript; 3 drafts held back) |
| Words in published guide bodies | 57,011 |
| Sources / inline citations | 452 listed sources, each linked inline by publisher name (no numbered markers); 193 FAQs |
| Original dataset | 38 vacation-rental managers x 13 fields, read 2026-11-18, one source URL per row |
| Stay pages | 37 stay files; 32 shown with their own detail page; 23 in the sitemap |
| Destination / dog-type pages | 2 states + 8 towns defined (6 indexable); 4 dog-type pages |
| Planning tools | 3 (will my dog be accepted, packing list, before-you-book checklist) |
| Gear | 11 category pages + hub; 74 product records, 53 active |
| Pick/spec cards in guides | 79 across 23 guides |
| Pins and share images | 29 pins (1000x1500) + pin sheet; 30 share images (1200x630) |
| Tests | 498 in 40 files |

## 3. Published guides and research

| Item | Detail | Where |
|---|---|---|
| Published guides | 29 on dog-friendly vacation-rental travel: pet fees, dog limits, breed restrictions, damage charges, fenced yards, large dogs (the former no-weight-limit guide is merged into the large-dog guide and redirects with a 301), puppies, seniors, reactive dogs, two large dogs in a car, holidays, packing, car safety, first aid, cooling, cold weather, hiking, life jackets, ramps, bowls, lost-dog plan | `content/guides/*.md` (25 files, editable in Pages CMS), `src/content/guides/*.ts` (7 files, need a developer) |
| Length | 57,011 words in bodies; 1,391 to 2,519 per guide | probe, method in the counts file |
| Citations | 452 sources (title, publisher, URL, access date) listed per guide in a compact collapsed Sources list, and linked inline in the article text by publisher name (natural publisher links or short parenthetical links such as ([Airbnb](url)); numbered markers were removed 2026-11-24) | frontmatter `sources`, body inline links |
| Pick/spec cards | 79 cards with maker-sourced spec lines and per-button affiliate labels | guide bodies |
| Drafts | 3 unpublished guides (breed restrictions, listing red flags, no-pets rental), ready to finish | `content/guides/` |
| Audit trail | Per-guide claims and fact-check files (`docs/CLAIMS-*.md`, `docs/FACTCHECK-*.md`), editorial scorecards and change logs (`docs/editorial/`, `docs/ARTICLE_SCORECARD.md`) | `docs/` |
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
| Stay files | 37 (Georgia 24, California 13), all `status: unverified`: written from public listing information with pet-policy fields, not confirmed with hosts. No photo permission recorded; pages carry no photos of the rentals |
| Shown in the directory | 32, each with its own detail page and search filters (state, town, type, dogs, weight limit, fenced yard and others). A stay is shown only when it has an approved affiliate deeplink (rule `STAYS_REQUIRE_AFFILIATE_LINK`) |
| Indexable | 23 stay pages are in the sitemap; 9 shown stays are `noindex` because they are too thin |
| Hidden | 5 stay files without an approved link (`coastal-bliss-fort-bragg-hot-tub-ocean-views`, `large-oceanfront-home-cleone-fort-bragg-hot-tub`, `rosemarys-retreat-mendocino-oceanfront`, `that-cabin-on-that-lane-blue-ridge`, `woof-in-the-woods-cabin-blue-ridge`) |
| Destinations | Georgia and California state pages; towns Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara indexable; Monterey and Mendocino defined but `noindex` |
| Dog types | 4 collection pages (escape artists, big dogs, multi-dog families, senior dogs) that link guides |
| Dog-rules places | 14 place files (parks, beaches, trails), all unverified, 0 public; the `/dog-rules` section is `noindex`. A research backlog, not a live asset (`docs/COWORK-VERIFY-PLACES.md`) |
| Importers | `scripts/import-stays.ts`, `scripts/stay-deeplink-worksheet.ts` |

## 6. Working planning tools (each loaded in Playwright and exercised once, 2026-11-24)

| Tool | Route | What was done | Result |
|---|---|---|---|
| Will my dog be accepted? | `/tools/will-my-dog-be-accepted` | chose 2 dogs, entered weights, picked a breed group, pressed "Check these managers" | Worked: "Of 38 rental managers, 0 show no conflict for your 2 dogs, 34 need a question first, and 4 look like a problem", with per-manager reasons, region filter, copy and print |
| Pack your dog's bag | `/tools/packing-list` | toggled "Older dog", tapped "Add to bag" on an item, reloaded | Worked: 15 items, tailoring by trip profile, "Packed" state survived a reload |
| Before-you-book checklist | `/tools/checklist` | ticked 2 items, reloaded | Worked: 25 items in 5 groups; ticks persisted; Print and Reset buttons present |
| Stay directory filters | `/stays` | typed in the search box | Worked; filter controls listed |

Tools run in the browser; no data is sent anywhere. Old calculator, question-writer and pet-cost addresses 301 to `/tools` (checked). The only console errors were the Google, Amazon and Vrbo requests this test blocked on purpose.

## 7. Gear guides and commercial pages

| Item | Detail |
|---|---|
| Gear hub | `/gear` plus 11 live category pages (car safety, car interior, ramps and steps, feeding and hydration, pens and gates, comfort and cooling, water and beach, trail and hiking, cold weather, safety ID and first aid, rental cleanup). Legacy category addresses redirect with 301 |
| Products | 74 records, 53 active, each with maker-sourced specs, source and verification date. No prices, ratings or "tested" claims by design. No third-party (Amazon) product images: product cards use the site's own graphic spec cards |
| Gear guides | Guides that carry pick cards: 23 of 29 |
| Disclosure | A label next to every affiliate button ("Affiliate link · We may earn a commission if you buy" or "...if you book, at no extra cost to you"), a notice per guide with Amazon links including the Amazon Associates sentence, and `/affiliate-disclosure` (43 of 43 pages with Amazon links carry the sentence) |
| Commerce wiring | `content/affiliates.yml` (96 entries) and `content/settings.yml`; see section 13 |

## 8. Domain and transferable assets

| Asset | State |
|---|---|
| Domain `pawsandpassage.com` | Namecheap. Registrar start 2026-11-16, valid to 2027-11-17 (OWNER). **Auto-renew is OFF pending the owner's decision**: if nothing changes the domain expires on 2027-11-17. Renewal about $19.98 a year (read 2026-11-18, `docs/COSTS-AND-ACCOUNTS.md`). Transfer by Namecheap account-to-account change of ownership (`docs/DNS-AND-TRANSFER.md`); a registrar-lock window may apply to moving registrars (UNVERIFIED, confirm with Namecheap) |
| DNS | Stays at Namecheap; mail records must not be deleted (`docs/DNS-AND-TRANSFER.md` section 3) |
| Code and original content | Transferred by written assignment (no LICENSE file exists) |
| Mailbox `hello@pawsandpassage.com` | Namecheap Private Email, not pushed with the domain; support-assisted move or a fresh mailbox (`docs/EMAIL-AND-TRANSFER.md`) |
| Pet-policy dataset, pins, share images | Transfer with the code |
| NOT transferable | Amazon Associates account and tag, Vrbo/Expedia affiliate account and deeplinks, Impact, Awin, GA4 property login, Search Console ownership, Pinterest account (owner decision), Lovable workspace |

## 9. Repository and deployment system

| Item | Detail |
|---|---|
| Stack | TanStack Start (React, Vite, Tailwind), server rendered; no database, no logins, no paid services required |
| Repository | GitHub, 435 commits since 2026-11-16, public; owner transfers it to the buyer's account. History contains the owner's author email (decision: keep history or hand over a squashed copy) |
| Hosting | Netlify Free plan; `netlify.toml` holds the build (`npm run build`, publish `dist`, Node 22), 10 permanent redirects, caching and security headers, and a rule skipping builds for docs-only pushes. **Netlify builds are currently stopped by the owner to preserve credits (about 65 left; 15 credits per production deploy)** (OWNER). A buyer's own free account starts with its own monthly allowance (300 credits a month on the free plan per Netlify's pricing page read 2026-11-18, `docs/COSTS-AND-ACCOUNTS.md`) |
| Portability | Clean installs and builds were run with no Lovable account: Node build, default build and a Netlify-style build all passed (`docs/HOSTING_PORTABILITY_REPORT.md`, `docs/buyer/HOSTING_OPTIONS.md`). Netlify is recommended; Lovable hosting is optional and untested |
| One Lovable dependency | devDependency `@lovable.dev/vite-tanstack-config` 2.27.2 (public npm, MIT, no login). A developer could replace it with a plain Vite config. Plus a no-op error hook and text/comments mentioning Lovable. Advice: the owner disconnects Lovable's GitHub sync before handover (UNVERIFIED whether it is currently connected) |
| CI and automation | 4 GitHub Actions workflows (tests and build, weekly health check, monthly digest, manual IndexNow). Not observed running on a schedule in this audit |
| Tests and build | 498 tests pass; build passes; scripts for verifying a live site (`scripts/verify-site.mjs`) |

## 10. Content management (Pages CMS, `.pages.yml`)

6 collections: guides (25 Markdown files), stays, places, affiliates, products, settings (`content/settings.yml`: contact email, site URL, GA4 ID, Amazon tag, Pinterest URL, Stay22 ID). Uploads go to `public/uploads`. A save is a commit; a commit to `main` triggers a production deploy, which costs Netlify credits on the free plan. **UNVERIFIED: `.pages.yml` has never been opened in the live Pages CMS app** (stated in its own header) and which branch it writes to is unconfirmed. Not editable in the CMS: the 7 TypeScript guides, destinations and towns, gear category copy, dog-type pages, checklist and packing items, the 38-manager data file, trust pages, navigation and design. Writing guide: `docs/WRITING-IN-MARKDOWN.md`.

## 11. Brand assets and licenses

| Asset | License / status |
|---|---|
| Hero and guide photos | Unsplash photos used under the Unsplash License, 46 credit entries in `src/content/image-credits.ts` plus `src/content/pack-photos.ts`. The home hero is a credited Unsplash photo (`hero-porch`, photographer Cody Scott Milewski). **The license gives usage rights, not ownership or exclusivity**: the buyer may keep using the photos, but does not own their copyright and others may use them too. Credits must stay |
| Product imagery | None from third parties; no Amazon images. Product cards use the site's own line-icon spec cards |
| Photos of real rentals | None |
| Pins and share images | 29 pins (1000x1500) and 30 share images (1200x630) generated from the site's own photos and text by `scripts/make-pin-sheet.py` and `scripts/make-share-images.py`; rights chain follows the Unsplash photos |
| Fonts | DM Sans and Fraunces, self-hosted variable WOFF2, SIL Open Font License texts included |
| Icons | `lucide-react` (open source); favicon and apple-touch icon in `public/` |
| Name, logo, wordmark | The "Paws & Passage" name is in the sale. No trademark search or registration was made (UNVERIFIED) |

## 12. SEO implementation and verified indexing evidence

Implemented (VERIFIED in the crawl): 95-URL generated sitemap, absolute canonical on every page (0 mismatches), per-page titles and descriptions, `noindex` on thin pages, `robots.txt` with the sitemap line, Organization, Article, BreadcrumbList and Dataset JSON-LD, IndexNow key file and script, 301 redirects for retired addresses (the merged large-dog guide returns 301 to its survivor), and a weekly health-check workflow.

Indexing evidence (OWNER, Google Search Console, not re-checked here): **Google URL Inspection showed 21 of 23 inspected pages indexed. Search Console reported 236 impressions and 0 clicks over 28 days.** That is the whole of it. It does not show that all 95 sitemap URLs are indexed, and it is not a traffic or revenue history. Evidence screenshots are held privately (`docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`).

Not included: any ranking history, backlink profile or field performance data. The domain was registered in November 2026.

## 13. Monetization setup and requirements for buyer-owned accounts

Full detail: `docs/MONETIZATION_READINESS.md` (its crawl counts are older than this file; use `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` for current counts).

| Channel | State in the repo | What the buyer must do |
|---|---|---|
| Amazon Associates | Tag `pawspassage-20` configured; 63 product link entries (53 approved, 10 not); 53 distinct Amazon URLs render; approval status of the seller's account UNKNOWN | Apply for their own Associates account, set `amazonTrackingId` in `content/settings.yml` (tested: one value retags every link; empty value hides all Amazon links and the Amazon sentence) |
| Vrbo (Expedia Group creator deeplinks) | 33 entries (1 generic + 32 per-listing), all marked approved; each stay shows 2 booking buttons | Open their own Expedia Group affiliate account and regenerate and replace every deeplink (worksheet and import scripts included); until replaced, clicks credit the seller |
| Impact | Only a site-verification meta tag in `src/routes/__root.tsx`; no Impact links | Remove the tag, verify with their own account |
| Awin, Chewy, others | Not in code; proposed in `docs/AFFILIATE-APPLICATION-PACK.md` | Apply fresh, per brand |
| Stay22 map | Code present, off (empty ID) | Own account |
| Display ads | None | Own account; traffic thresholds apply |
| GA4 | ID `G-1J97C8CPC1` in settings; click events `booking_click` and `product_click` tested to fire in the browser; arrival in a GA4 property not tested | Create own property and replace the ID; history does not carry over |

Affiliate accounts are not transferable in practice (Amazon's operating agreement bars assignment without written approval). A configured ID or an `approved: true` flag is not proof of an active, paying partnership: that needs account access (OWNER). No commission, click or revenue figure exists in this package.

## 14. Documentation, operating instructions and transfer support offered

- Handover set (index in order: `docs/buyer/TRANSFER_PACKAGE_INDEX.md`): `BUYER_HANDOVER.md`, `docs/TRANSFER_CHECKLIST.md`, `docs/DNS-AND-TRANSFER.md`, `docs/EMAIL-AND-TRANSFER.md`, `docs/SECURITY-AND-RECOVERY.md`, `docs/COSTS-AND-ACCOUNTS.md`, `docs/buyer/HOSTING_OPTIONS.md`, `docs/HOSTING_PORTABILITY_REPORT.md`, `docs/MONETIZATION_READINESS.md`, `docs/BUYER_DUE_DILIGENCE_CHECKLIST.md`.
- Operating: `docs/OPERATIONS-HANDBOOK.md`, weekly, monthly and quarterly checklists (`docs/SOP-*.md`), `docs/ROLLBACK.md`, data re-check log, analytics and Pinterest setup guides, 14 browser task prompts in `docs/cowork/`.
- Transfer support offered (owner decision to confirm): walking the buyer through the written transfer steps and answering questions during a short window after closing, as written in the listing. No work on growth, content or monetization is included.

## 15. How these assets save a buyer work

Qualitative only. No replacement cost, development cost or dollar value is claimed.

- **Research:** the buyer does not have to read, compare and cite hundreds of sources on pet fees, dog limits, fencing, car safety and gear, or re-derive the 38-manager policy dataset, with a source link and read date for each row.
- **Structuring:** topics, internal links between guides, dog-type collections, destination hubs, FAQs, source lists and a publish gate already exist.
- **Writing:** 29 finished guides with per-guide claims and fact-check records, plus 3 drafts, instead of a blank content calendar. Writers still need to review and keep them current.
- **Building tools:** three browser tools, a filterable stay directory and a policy data page are built, tested and documented.
- **SEO plumbing:** sitemap rules, canonicals, structured data, redirects, noindex rules, IndexNow and health checks are done; the buyer verifies their own Search Console and submits the sitemap.
- **Commerce plumbing:** affiliate-link management, per-button disclosure labels, an Amazon-tag switch and click-event tracking are wired so the buyer swaps IDs instead of building a system.
- **Operations:** content editing, hosting, rebuild-from-repo and security runbooks, and the handover checklists are written down.

What it does not save: applying to affiliate programs, earning traffic, keeping data fresh, or legal review.

## 16. What the buyer does NOT receive

Traffic, revenue or ranking history; affiliate approvals or accounts; the GA4 property, Search Console ownership or Bing access; Pinterest or social accounts (an owner decision, not promised); an email list (none exists); the mailbox contents; verified stays or verified dog-rules places (0 verified); photos of real rentals; ownership or exclusivity of the Unsplash photos; any warranty of results. Legal pages are generic and were not lawyer-reviewed; the buyer should add their own name, jurisdiction and contact and have them reviewed.
