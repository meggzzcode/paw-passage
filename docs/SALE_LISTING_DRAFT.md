# Sale listing draft: Paws & Passage (pre-revenue starter site)

DRAFT for the owner. Not submitted anywhere. Every number comes from `docs/BUYER_ASSET_INVENTORY.md` and `docs/buyer/ROUTE_AND_ASSET_COUNTS.md` (verified 2026-11-24 on repo `HEAD` `56552fc`; re-run the counts after the last commit and before posting). Nothing here claims traffic, earnings, rankings, affiliate approvals, replacement value or buyer interest, because none are evidenced. Do not put an invented number in any bracket.

## Headline

Pre-revenue dog-travel starter site: 29 sourced guides, an original 38-manager pet-policy dataset, 3 working planning tools, a 32-stay directory and an 11-category gear hub. $1,500.

## Short version for marketplace fields

Title: Pre-revenue dog-friendly vacation-rental site: 29 sourced guides, original 38-manager policy dataset, 3 tools, 11-category gear hub (starter site, .com domain included).

Summary (about 650 characters): New .com publication about renting vacation homes with a dog. 29 guides (about 57,000 words, 452 listed sources) with FAQs and a per-guide fact-check record; an original dataset of 38 rental managers' pet policies (13 fields each, dated and sourced); 3 browser tools; a 32-stay directory; 11 gear categories with 53 products and spec cards; 95-URL sitemap, structured data, redirects, Pinterest pins, documentation. Registered November 2026. No revenue, no traffic history, no approved affiliate accounts included. Sold as a starter asset, as is.

## Honest positioning (near the top of the listing)

This is a **new, pre-revenue starter site**. The domain was registered in November 2026 (registrar start 2026-11-16, valid to 2027-11-17). Google Search Console reported **236 impressions and 0 clicks over 28 days**, and Google's URL Inspection showed **21 of 23 inspected pages indexed**; that does not mean all sitemap URLs are indexed. There is no revenue or earnings history. You are buying finished content, original research, working tools and a documented codebase, not a business with a track record. The seller is selling it, not operating or growing it, and stops work at closing.

## What you get

- **Domain** pawsandpassage.com (Namecheap; valid to 2027-11-17; pushed to your Namecheap account at closing). Auto-renew is currently off pending the seller's decision; either the seller turns it on before the push or you renew (about $19.98 a year).
- **29 published guides, about 57,000 words**, each with FAQs and a visible source list (452 sources, 809 numbered inline citations, per-guide fact-check records). Topics: pet fees, dog limits, breed rules, damage charges, fenced yards, large dogs (the former no-weight-limit guide is merged into the large-dog guide and redirects to it), puppies, seniors, reactive dogs, car safety, holidays, packing, first aid, cooling, cold weather. Plus 3 unpublished drafts. Citation presentation is shown as numbered markers linked to each guide's source list; confirm the final look on a guide page before you post, because the presentation was being reworked.
- **An original pet-policy dataset**: 38 vacation-rental managers across several regions, 13 fields each (dog limit, weight limit, breed rule, fee, pool and hot-tub wording, minimum age, leaving a dog alone), one source link per row, all read 2026-11-18. Published as a data page and a CSV download. Each cell is a public fact; the original part is the selection, structure and dated sourcing.
- **Stay directory**: 37 stay files (Georgia, California), 32 shown with detail pages, 23 in the sitemap, with state, town and dog-type pages. Stays are labelled "Not yet verified"; none has been confirmed with a host. 5 more are written up and hidden until a booking link is added.
- **3 planning tools**, each loaded and used in a browser on 2026-11-24: "will my dog be accepted" (checks the 38 managers), a 15-item packing list, a 25-item before-you-book checklist.
- **Gear hub**: 11 category pages, 74 product records (53 active) with maker-sourced specs, and 79 pick cards with spec lines in the guides. No third-party (Amazon) product images.
- **Affiliate labels on every button**: each affiliate button carries its own "Affiliate link · We may earn a commission..." label, plus a notice on pages with affiliate links and the Amazon Associates sentence where Amazon links appear. Affiliate links are wired through two config files so you replace IDs without code.
- **SEO foundations**: 95-URL generated sitemap, canonicals, noindex rules, structured data, 301 redirects for retired guides, IndexNow key and script, weekly health-check workflow.
- **Pinterest assets**: 29 pins (1000x1500) with a posting sheet and 30 share images. No Pinterest account is included.
- **Images**: Unsplash photos with credits (the license gives usage rights, not ownership or exclusivity), the site's own graphic spec cards, self-hosted open-license fonts.
- **Trust pages**: about, methodology, editorial standards (AI-assisted content is disclosed there), corrections, affiliate disclosure, privacy, terms, contact.
- **Codebase and tools**: React/TanStack Start site, no database and no logins, 498 automated tests passing, a content editor setup for Pages CMS, 4 GitHub Actions workflows.
- **Documentation**: handover guide, transfer checklist and package index, DNS and email transfer notes, operations handbook, security and recovery runbook, monetization-readiness guide, hosting options.

## What you do not get

- No traffic, revenue, ranking or backlink history. Zero revenue is the honest number.
- **No affiliate accounts.** The seller's Amazon Associates tag, Vrbo/Expedia deeplinks, Impact and Awin accounts, GA4 property and Search Console access do not transfer, and affiliate accounts are non-transferable in practice. The site contains configured IDs and links; a configured ID is not proof of an active or approved partnership. You apply for your own and replace every ID (steps in `docs/MONETIZATION_READINESS.md`).
- No Pinterest or social accounts, no email list, no business mailbox contents (a fresh mailbox or a support-assisted Namecheap move is your choice).
- No ownership of the Unsplash photos (usage rights only), no photos of real rentals, no verified stays.
- No warranty of income, indexing or ranking. Sold as is. Legal pages are generic and not lawyer-reviewed.

## Risks

- Brand-new domain with 236 impressions and 0 clicks in the last 28 days: expect slow organic growth, and no evidence yet of search traffic.
- Guides are researched from public sources with the method disclosed, not first-hand tested; AI tools assisted research, drafting and source checks (disclosed on the site).
- The 38-manager dataset is a convenience sample read on one date; policies change.
- Affiliate earnings need accounts you must open and get approved, including Amazon's own review of your site and its qualifying-sales window.
- Pages CMS setup was never opened in the live app (UNVERIFIED); some content (7 guides, towns, gear copy, trust pages) needs a developer.
- Hosting: the seller's Netlify builds are stopped to preserve a nearly used-up monthly credit allowance (about 65 credits left; 15 per deploy), so the live site shows the last deploy and your first act is to deploy from your own account.
- Domain auto-renew is off; the domain expires 2027-11-17 if nobody renews it.
- One devDependency comes from a vendor namespace (below).

## Hosting options

Short version: the site does not depend on paid Lovable usage. Lovable was a design tool the seller used; it is not needed to build, host, publish or edit the site. On 2026-11-24 a clean copy was installed and built with no Lovable account or settings and all three build variants succeeded (`docs/HOSTING_PORTABILITY_REPORT.md`).

- **Recommended: Netlify.** The current host and its free plan suits a site this size. Create free GitHub and Netlify accounts, take over the repository, "Import from Git", and the settings come from `netlify.toml`. Add your domain and point Namecheap at it (`docs/DNS-AND-TRANSFER.md`). Every change to `main` rebuilds the site; on the free plan each production deploy costs 15 of the monthly credits, so batch edits. Writers can edit through Pages CMS (free sign-in with GitHub).
- **Optional: Lovable or another host.** Any host that can run a Node 22 build and server rendering works (`bun install`, then `NITRO_PRESET=node-server vite build`). You would recreate what `netlify.toml` does (10 redirects for retired guide addresses, caching, security headers, the docs-only build skip). Lovable hosting needs a paid plan for your own domain, does not read `netlify.toml` and was not tested with this site. A Lovable project can only be moved between members of the same workspace, so a buyer receives the code from GitHub, not the Lovable project. Nothing about Lovable is required.
- **The one dependency, honestly:** `@lovable.dev/vite-tanstack-config` (devDependency, public npm, MIT, no login) wraps the build settings. If it were ever unpublished, a developer would replace it with a plain Vite config. It is a small, known coupling, not a hosting lock-in.
- **At handover:** the seller disconnects Lovable's GitHub sync so nothing from Lovable can push to your live branch (whether it is connected now is UNVERIFIED).
- **Running cost:** about $19.98 a year for the domain; optional mailbox about $14.88 a year; Netlify Free and GitHub $0 (list prices read 2026-11-18; Pages CMS price not confirmed).

## First-week plan for the buyer

1. Accept the domain push, repository transfer and (if needed) mailbox arrangement; turn domain auto-renew on (`docs/TRANSFER_CHECKLIST.md`).
2. Create your Netlify account, import the repo, deploy, attach the domain and confirm HTTPS.
3. Verify the site in your own Search Console and Bing, submit the sitemap, and create your own GA4 property.
4. Apply to affiliate programs with your own details; until approved, set `amazonTrackingId` empty and keep unapproved links off.
5. Open Pages CMS, sign in with GitHub and run the first harmless-edit test.
6. Review the legal pages, add your name and contact, then start posting the 29 pins.

## Price and terms

- **Asking price:** about $1,500. A realistic close may be lower; do not state a higher "value" or a multiple.
- **Payment:** through the marketplace's escrow only. No off-platform payment, no domain push or repo transfer before funds are secured.
- **Handover:** domain push, repository transfer, hosting guidance and a short written question window (owner to confirm the length).
- **Sold as is**, no warranty of results, written copyright assignment and bill of sale at closing; the buyer arranges legal review.
