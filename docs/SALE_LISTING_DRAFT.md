# Sale listing draft: Paws & Passage (pre-revenue starter site)

DRAFT for the owner. Not submitted anywhere. Every number comes from `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` and `docs/BUYER_ASSET_INVENTORY.md` (recounted 2026-11-24 on repository `HEAD` `9797221`; re-run the counts after any later commit and before posting). **Nothing is deployed:** production still serves a build from about 2026-11-23, so do not post a claim about what the live site shows until the owner has deployed and the checks in `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md` have passed. Nothing here claims traffic, earnings, rankings, affiliate approvals, replacement value or buyer interest, because none are evidenced. Do not put an invented number in any bracket. One-page summary for a buyer: `docs/BUYER_OVERVIEW.md`.

## Headline

Pre-revenue dog-travel starter site: 29 sourced guides, an original 38-manager pet-policy dataset, a personalized packing planner and 2 other tools, a stay directory (78 shown, none confirmed with a host) and a photo-free Gear shop with trip collections. $1,500.

## Short version for marketplace fields

Title: Pre-revenue dog-friendly vacation-rental site: 29 sourced guides, original 38-manager policy dataset, packing planner, 11-category gear shop (starter site, .com included).

Summary (about 650 characters): New .com publication about renting vacation homes with a dog. 29 guides (about 45,000 words, 420 listed sources, each linked in the text) with FAQs; an original dataset of 38 rental managers' pet policies (13 fields each, dated and sourced); 3 browser tools including a personalized packing planner; a directory of 78 stays whose pages say details are not confirmed with the host (none host-confirmed; 23 indexable); a photo-free gear shop with 11 categories, 65 products and 5 trip collections; 8 town "things to do" articles; 103-URL sitemap, structured data, redirects, documentation. Registered November 2026. No revenue, no traffic history, no affiliate accounts included. Sold as a starter asset, as is.

## Honest positioning (near the top of the listing)

This is a **new, pre-revenue starter site**. The domain was registered 2026-11-16 (valid to 2027-11-17), so it is about 8 days old at the time of writing. As a **historical baseline on the older production build**, Google Search Console reported 236 impressions and 0 clicks over 28 days and URL Inspection showed 21 of 23 inspected pages indexed; that does not mean the 103 sitemap URLs are indexed, and it describes pages the repository no longer contains. There is no revenue or earnings history. **The current version of the site is not live yet**: production is a stale build until the owner deploys, and it is re-verified after that. You are buying finished content, original research, working tools and a documented codebase, not a business with a track record. The seller is selling it, not operating or growing it.

## What you get

- **Domain** pawsandpassage.com (Namecheap; valid to 2027-11-17; pushed to your Namecheap account at closing). Auto-renew is off pending the seller's decision; either the seller turns it on before the push or you renew (about $19.98 a year, read 2026-11-18).
- **Original 38-manager research.** A dataset of 38 vacation-rental managers, 13 fields each (dog limit, weight limit, breed rule, fee, pool and hot-tub wording, minimum age, leaving a dog alone), one source link per row, all read 2026-11-18; published as a data page (`/data/pet-policies`) and a CSV download. Each cell is a public fact; the original part is the selection, structure and dated sourcing. It is a convenience sample, not a survey, and policies change.
- **29 published guides, about 45,000 words** (shortest about 1,000, longest about 2,000), answer-first, each with FAQs (152 in all) and a Sources list (420 sources, every one linked inside the article text by publisher name; no numbered markers), plus per-guide claim and fact-check records. Topics: pet fees, dog limits, breed rules, damage charges, fenced yards, large dogs, puppies, seniors, reactive dogs, car safety, holidays, packing, first aid, cooling, cold weather, hiking, life jackets. Plus 3 unpublished drafts and 8 town "things to do with a dog" articles (not counted as guides). Independent readers rated the guides "ready with minor fixes", mean 7.1 of 10 on their scale; corrections made afterwards were not re-scored (`docs/FINAL_EDITORIAL_RELEASE.md`). That is a reviewer's reading, not a quality guarantee.
- **Stay directory.** 83 stay files (Georgia 49, California 34) written from public listing pages. **0 are host-confirmed**; every page says its details were read from the listing and are not confirmed with the host. **78 are shown** (each has a public Vrbo listing link; stays that still have the seller's approved affiliate link show a labelled button), **23 are indexable** (in the sitemap), 55 are shown but `noindex` as too thin, and 5 are hidden. **Caveat for the buyer:** the 78 shown stays exist because the *seller's* Vrbo deeplinks are marked approved. They do not transfer. The site ships in `public-sources` mode (owner-approved 2026-11-25), so removing the seller's links keeps the same 78 shown and 23 indexable stays with plain Vrbo source links, no commission and no affiliate label. A listing link does not guarantee availability. (`docs/BUYER_AFFILIATE_TRANSITION.md`, sections 5 and 6.)
- **Photo-free Gear shop.** 11 category pages, 5 curated trip collections (road trip, cabin stay, beach and lake, winter trip, hiking), 92 product records (65 active, each with a source and an Amazon link), 90 pick cards in the guides. No third-party (Amazon) product images and no prices, ratings or "tested" claims. Its own design spec scores it 7.7 of 10 against a target of 9 (`docs/GEAR_SHOPPER_EXPERIENCE_SPEC.md`).
- **Personalized dog packing planner** (`/tools/packing-list`): trip type, days, dogs and conditions build a checklist from 37 declared items (12 essential, 15 trip-specific, 10 optional extras). Packed and "Need to buy" states, editable quantities, custom items, undo, copy as text and print. **The list is saved in the visitor's own browser; there are no accounts, no sync between devices and no AI.** "Need to buy" shows researched Gear products or points to the related Gear category. Plus 2 other tools: "will my dog be accepted" (checks the 38 managers) and a 25-item before-you-book checklist.
- **SEO implementation** (what is built, not results): 103-URL generated sitemap, self-canonical pages, one H1, titles of 60 characters or fewer, descriptions of 120 to 160 characters, `noindex` rules for thin pages, Organization, Article, BreadcrumbList and Dataset structured data, 301 redirects for retired guides, internal-link fixes, IndexNow key and script, a weekly health-check workflow. Verified on a local build of `9797221` (`node scripts/verify-site.mjs`: 319 checks passed). No ranking or traffic result is claimed.
- **Pinterest assets:** 29 pins (1000x1500) with a posting sheet and 30 share images. No Pinterest account is included.
- **Images:** Unsplash photos with credits (64 credit entries; the license gives usage rights, not ownership or exclusivity), the site's own graphic spec cards, self-hosted open-license fonts. No Amazon images.
- **Trust pages:** about, methodology, editorial standards (AI-assisted content is disclosed there), corrections, affiliate disclosure, privacy, terms, contact. Generic, not lawyer-reviewed.
- **Codebase:** React/TanStack Start, no database and no logins, **771 automated tests passing in 59 files**, a Pages CMS configuration for editing content, 4 GitHub Actions workflows, a seller-ID audit script (`node scripts/audit-seller-ids.mjs`).
- **Documentation:** buyer overview, handover guide, transfer checklist and package index, affiliate transition steps, DNS and email transfer notes, operations handbook, security and recovery runbook, hosting options, buyer walkthrough script.

## What you do not get

- No traffic, revenue, ranking or backlink history. Zero revenue is the honest number.
- **No affiliate accounts, and no verified affiliate approvals.** The seller's Amazon Associates tag (`pawspassage-20`), the 79 Vrbo/Expedia deeplinks, the Impact value, the GA4 property (`G-1J97C8CPC1`) and Search Console access do not transfer. The repository contains configured IDs and links marked approved; a configured ID or an "approved" switch is not proof of an active partnership with anyone. **You must replace every seller ID** with your own after your own accounts are approved (`docs/BUYER_AFFILIATE_TRANSITION.md`).
- No analytics history, no Search Console or Bing history.
- No Pinterest or social accounts (unless the owner adds them in writing), no email list (none exists), no business mailbox contents.
- No ownership of the Unsplash photos, no photos of real rentals, no host-verified stays.
- No warranty of income, indexing or ranking. Sold as is.

## Licensing and rights

Original text, data selection and code written for the site are the seller's and are assigned by written assignment at closing. **There is no LICENSE file in the repository; the assignment wording is a seller and legal item and is not drafted here.** Unsplash photos stay under the Unsplash License with credits kept. No Amazon images. Third-party packages keep their own licenses (permissive per the earlier audit, to be re-run). The manager websites' own terms were not reviewed.

## Ongoing costs and limits

- Domain renewal about $19.98 a year (Namecheap list price read 2026-11-18); optional mailbox about $14.88 a year. Netlify Free plan and GitHub Free $0 (Netlify's free plan has a monthly credit limit; a paid plan is available if you outgrow it, see `docs/buyer/HOSTING_OPTIONS.md`); Pages CMS price not confirmed. Typical total from the hosting file: $19.98 to $34.86 a year. These are list prices, not the seller's bills.
- Each production deploy uses Netlify credits; batch your edits.
- You need a developer for the 7 TypeScript guides, towns, Gear category copy and design changes.

## Known limitations (state them, do not hide them)

- **Not deployed.** The live site is a stale build until the owner deploys; the post-deploy checks have not been run.
- **Pages CMS: the authenticated flow is UNVERIFIED.** The configuration was checked structurally and by tests, and a direct-edit path was rebuilt locally, but no one has signed in to the live Pages CMS app and saved a change. Editing on GitHub works without it.
- **Real-device checks are pending** (iPhone/Safari, VoiceOver, Android). The local browser QA used a desktop browser at phone and desktop widths.
- Guides are researched from public sources with the method disclosed, not first-hand tested; AI tools assisted research, drafting and source checks (disclosed on the site). The reader reviews (mean 7.1 of 10) preceded the final corrections.
- The 78 shown stays are not confirmed with a host; none was confirmed with a host. The 38-manager dataset is a single-date sample.
- **Open disclosure wording mismatch:** Vrbo buttons on stay pages carry a short "Affiliate link" label, while `/affiliate-disclosure` still says every buy or booking button does (Amazon buttons no longer carry one). The owner decides whether to restore labels or reword the page before the listing goes up.
- Affiliate earnings need accounts you open and get approved, including Amazon's own site review and qualifying-sales window.
- Domain auto-renew is off; the domain expires 2027-11-17 if nobody renews it.
- One devDependency comes from a vendor namespace (below).

## Hosting options

Short version: the site does not depend on paid Lovable usage. Lovable was a design tool the seller used; it is not needed to build, host, publish or edit the site. On 2026-11-24 a clean copy was installed and built with no Lovable account or settings and all three build variants succeeded (`docs/HOSTING_PORTABILITY_REPORT.md`).

- **Recommended: Netlify.** The current host; its free plan suits a site this size. Create free GitHub and Netlify accounts, take over the repository, "Import from Git"; settings come from `netlify.toml`. Add your domain and point Namecheap at it (`docs/DNS-AND-TRANSFER.md`). Every change to `main` rebuilds the site (the build-skip rule was fixed so Markdown guide edits and CMS saves do build; docs-only pushes skip).
- **Optional: another host.** Any host that can run a Node 22 build with server rendering works (`bun install`, then `NITRO_PRESET=node-server vite build`). You would recreate what `netlify.toml` does (10 redirects, caching, security headers, the docs-only build skip). Lovable hosting needs a paid plan for your own domain, does not read `netlify.toml` and was not tested with this site.
- **The one dependency, honestly:** `@lovable.dev/vite-tanstack-config` (devDependency, public npm, MIT, no login) wraps the build settings. If it were ever unpublished, a developer would replace it with a plain Vite config.
- **At handover:** the seller disconnects Lovable's GitHub sync so nothing from Lovable can push to your live branch (whether it is connected now is UNVERIFIED).

## First-week plan for the buyer

1. Accept the domain push and repository transfer; turn domain auto-renew on (`docs/TRANSFER_CHECKLIST.md`).
2. Create your Netlify account, import the repo, deploy, attach the domain, confirm HTTPS.
3. Run `node scripts/audit-seller-ids.mjs`, then follow `docs/BUYER_AFFILIATE_TRANSITION.md` in order: open your own accounts first, then replace IDs; decide the stay directory mode.
4. Verify the site in your own Search Console and Bing, submit the sitemap, create your own GA4 property.
5. Open Pages CMS, sign in with GitHub and run the first harmless-edit test (it has never been run).
6. Review the legal pages, add your name and contact, then start posting the 29 pins from your own Pinterest account.

## Price and terms

- **Asking price:** $1,500. A realistic close may be lower; do not state a higher "value" or a multiple.
- **Payment:** through the marketplace's escrow only. No off-platform payment, no domain push or repo transfer before funds are secured.
- **Handover:** domain push, repository transfer, hosting guidance and a short written question window (owner to confirm the length).
- **Sold as is**, no warranty of results; written copyright assignment and bill of sale at closing; the buyer arranges legal review.
