# Paws & Passage: owner's handbook

*Corrected 2026-11-25 (stay counts and directory mode) and 2026-11-23 against [docs/BUYER_ASSET_INVENTORY.md](docs/BUYER_ASSET_INVENTORY.md); the Hostinger section is an older test.*

Everything on this site lives in plain files. There is no database, no admin login, and no paid service required. Edit a file, commit it, and publish.

## Where things live

| What | File |
| --- | --- |
| Email, site URL, GA4 ID, Amazon tag, Impact verification value, Pinterest URL, Stay22 ID, `stayDirectoryMode` | `content/settings.yml` (`src/config/site.ts` only reads it) |
| Stays (83 files; 78 listed, 23 indexable, 5 hidden; 0 host-confirmed) | `content/stays/*.yml` (`src/content/stays/verified.ts` holds no records) |
| Sample stays (preview only, never live) | `src/content/stays/samples.ts` |
| Gear products (92 records, 65 active) | `content/products.yml` |
| Affiliate / booking links (160 entries: 79 Vrbo, 81 Amazon) | `content/affiliates.yml` (`src/content/affiliates.ts` only reads it) |
| Destinations (states and towns) | `src/content/destinations.ts` |
| Guides (32 files: 25 Markdown, 7 legacy code; 30 published, 2 drafts) | `content/guides/<slug>.md`; legacy `src/content/guides/<slug>.ts` |
| Checklist tool items | `src/content/checklist.ts` |
| Packing planner items, rules and trip types (37 items) | `content/packing.yml` ([docs/PACKING_PLANNER_PRODUCT_GUIDE.md](docs/PACKING_PLANNER_PRODUCT_GUIDE.md)) |
| Images | `src/assets/` + `src/lib/images.ts` |
| Policy pages | `src/routes/privacy.tsx`, `terms.tsx`, `affiliate-disclosure.tsx`, `editorial-standards.tsx` |

## 1. Add a new stay
1. Confirm with the host: dog count, weight and breed limits, pet fee and its basis, fencing, unattended rules, and **permission to use photos**.
2. Either add a file in `content/stays/` (Pages CMS "stays" collection; copy an existing `.yml`), or fill in `data/stays-template.csv`, save it as `data/stays.csv`, and run `bun scripts/import-stays.ts data/stays.csv`.
3. Set `status: verified` and `lastVerified: YYYY-MM-DD` only after the host confirmed the details (all 83 current stay files are `unverified`). Anything not confirmed stays `null` and shows as "Not confirmed". Filters never treat that as a yes.
4. With the shipped `stayDirectoryMode: public-sources` (owner-approved 2026-11-25), a stay is listed when it has a public Vrbo or Airbnb source address or an approved affiliate link; unverified stays show a "Not yet verified" label. 78 are listed, 23 are indexable and 5 are hidden (no Vrbo or Airbnb source address). In the older `affiliate-only` mode a stay is listed only while it has an approved affiliate link (`STAYS_REQUIRE_AFFILIATE_LINK`). Counted 2026-11-25 at `3e5923b`. `sample` stays show only in the private preview.

## 2. Update a stay's pet policy
Edit the fields in the stay's `.yml` file in `content/stays/` (`maxDogs`, `petFee`, `fencedYard`, `breedRestrictions`, and so on) and update `lastVerified`.

## 3. Add a destination
Add a town object to the right state in `src/content/destinations.ts`. Its page at `/destinations/<state>/<town>` and its sitemap entry are created automatically. For a new state, add a state object and extend the `state` type in `src/content/stays/types.ts`.

## 4. Publish a guide
1. Add `content/guides/<slug>.md` (Pages CMS "guides" collection, or copy an existing `.md`); it is picked up automatically. Only 7 legacy guides are still `.ts` files.
2. Write the body in Markdown. Fill in `sources`, the `research` brief and `faqs`.
3. A guide is public only if `status: "published"`, `research.researchComplete` is `true`, `research.unverified` is empty **and** `approvedBy` and `approvedOn` are filled (`guideIsPublic`; a test also requires `followUps` to be empty and at least five competitor pages read in full). Otherwise it stays a draft: visible in preview only, noindexed, and left out of the sitemap.
4. Update `lastReviewed` whenever you re-check facts.

## 5. Update affiliate links
Add an entry (id, network, url, `approved: true`) to `content/affiliates.yml` (or use the Pages CMS "affiliates" collection) and set `affiliateId` on the stay. Amazon links use the tag from `amazonTrackingId` in `content/settings.yml`. Booking buttons appear only for stays with an approved link, and they carry `rel="sponsored"`.

## 6. Change images
Put the file in `src/assets/`, register it in `src/lib/images.ts` with alt text, and reference its key. Never show a generic photo as if it were a specific rental.

## 7. Connect analytics
Set `ga4MeasurementId` in `content/settings.yml`. Outbound booking clicks are sent as a `booking_click` event. Nothing is sent while it's empty.

## 8. Connect an email service
There is no newsletter signup on the site (removed by the owner's decision). Research for adding one later is in [docs/LEAD-CAPTURE.md](docs/LEAD-CAPTURE.md).

## 9. Sitemap and domain
`siteUrl` is set in `content/settings.yml` (change it if the domain changes). `/sitemap.xml` lists every published page (104 URLs counted on 2026-11-25 after the no-pets-rental guide was republished; 103 before that, 98 on 2026-11-23), and `public/robots.txt` already has the Sitemap line (update it for a new domain).

## 10. Export and deploy elsewhere
- Lovable is not needed. The seller disconnects Lovable's GitHub sync at handover. The repository is a standard TanStack Start + Vite app ([docs/buyer/HOSTING_OPTIONS.md](docs/buyer/HOSTING_OPTIONS.md)).
- Locally: `bun install`, `bun run dev`, `bun run build`, `bunx vitest run`.
- Production is Netlify (`netlify.toml`); `bun run build` is the default build and `build:node` makes the Node build. Any host that runs TanStack Start works.

## Deploying on Hostinger (Node.js web app)

*Historical: a 2026-11-16 test. Production is Netlify; Hostinger is not used.*

Tested 2026-11-16: the app builds as a plain Node server and renders pages on the server.

- **Plan:** Hostinger runs Node.js web apps only on **Business Web Hosting** and **Cloud** plans (Startup, Professional, Enterprise, Enterprise Plus), or on a VPS with manual setup. Cheaper shared plans (Single, Premium and the like) and website-builder or WordPress plans do not. Check hPanel's Node.js section before paying.
- **Framework preset:** Nitro (this app is built with Nitro). Node 22 or 24; `package.json` declares `engines.node >= 22`.
- **Install:** Hostinger uses npm when it finds `package-lock.json`. The repo includes it, plus an `.npmrc` with `legacy-peer-deps=true`, because plain `npm install` otherwise crashes on this dependency set.
- **Build command:** `build:node` (runs `NITRO_PRESET=node-server vite build`). Do **not** use plain `build`: it targets Cloudflare Workers, which Lovable's own publishing uses.
- **Output directory:** `.output`  **Entry file:** `server/index.mjs` (relative to the output directory).
- **Port:** the server reads `PORT`, which Hostinger sets.
- **Limits to know:** each request is cut off after 120 seconds, no inbound WebSockets, no always-on background workers, and all Node apps on a plan share one process and memory pool (Business: 5 apps). This site needs none of those; it used about 95 MB of memory in testing.
- After switching on a domain, set `siteUrl` in `content/settings.yml` and redeploy so canonical tags and the sitemap use it.
- Lovable's built-in publish and Hostinger are separate deployments. Pick one as the live site so the two don't drift.

## Transferring the business
Hand over: the GitHub repo, the domain registrar, the GA4 property (add the buyer as admin), the email-service account (export subscribers), and each affiliate account (most networks need the new owner to re-apply).

## Still needed before launch
- Already configured (seller's accounts): business email, domain, GA4 ID, Vrbo and Amazon approvals. The buyer must replace these with their own.
- Real verified stays (none of the 83 stay files is verified).
- Legal pages: the owner decided (2026-11-17) not to get a legal review. They are unreviewed drafts.
- Each guide's `research.followUps` lists optional editor follow-ups, such as competitor pages that could only be read as search excerpts.
