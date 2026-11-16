# Paws & Passage: owner's handbook

Everything on this site lives in plain files. There is no database, no admin login, and no paid service required. Edit a file, commit it, and publish.

## Where things live

| What | File |
| --- | --- |
| Brand name, tagline, email, site URL, GA4 ID, newsletter form | `src/config/site.ts` |
| Stays (real, verified) | `src/content/stays/verified.ts` |
| Sample stays (preview only, never live) | `src/content/stays/samples.ts` |
| Affiliate / booking links | `src/content/affiliates.ts` |
| Destinations (states and towns) | `src/content/destinations.ts` |
| Guides (one file each, with research brief and sources) | `src/content/guides/<slug>.ts` |
| Checklist tool items | `src/content/checklist.ts` |
| Images | `src/assets/` + `src/lib/images.ts` |
| Policy pages | `src/routes/privacy.tsx`, `terms.tsx`, `affiliate-disclosure.tsx`, `editorial-standards.tsx` |

## 1. Add a new stay
1. Confirm with the host: dog count, weight and breed limits, pet fee and its basis, fencing, unattended rules, and **permission to use photos**.
2. Either add a record to `src/content/stays/verified.ts` (copy the shape from `samples.ts`), or fill in `data/stays-template.csv`, save it as `data/stays.csv`, and run `bun scripts/import-stays.ts data/stays.csv`.
3. Set `status: "verified"` and `lastVerified: "YYYY-MM-DD"`. Anything not confirmed stays `null` and shows as "Not confirmed". Filters never treat that as a yes.
4. Only `verified` stays appear on the live site. `sample` stays show only in the private preview.

## 2. Update a stay's pet policy
Edit the fields in `verified.ts` (`maxDogs`, `petFee`, `fencedYard`, `breedRestrictions`, and so on) and update `lastVerified`.

## 3. Add a destination
Add a town object to the right state in `src/content/destinations.ts`. Its page at `/destinations/<state>/<town>` and its sitemap entry are created automatically. For a new state, add a state object and extend the `state` type in `src/content/stays/types.ts`.

## 4. Publish a guide
1. Copy an existing file in `src/content/guides/` and rename it to `<slug>.ts`. It is picked up automatically.
2. Write the body in Markdown inside `body`. Fill in `sources`, the `research` brief and `faqs`.
3. A guide is public only if `status: "published"`, `research.researchComplete` is `true` **and** `research.unverified` is empty (a test also requires `followUps` to be empty and at least five competitor pages read in full). Otherwise it stays a draft: visible in preview only, noindexed, and left out of the sitemap.
4. Update `lastReviewed` whenever you re-check facts.

## 5. Update affiliate links
Add `{ id, network, url, approved: true }` to `src/content/affiliates.ts` and set `affiliateId` on the stay. Booking buttons appear only for verified stays with an approved link, and they carry `rel="sponsored"`.

## 6. Change images
Put the file in `src/assets/`, register it in `src/lib/images.ts` with alt text, and reference its key. Never show a generic photo as if it were a specific rental.

## 7. Connect analytics
Set `ga4MeasurementId` in `src/config/site.ts`. Outbound booking clicks are sent as a `booking_click` event. Nothing is sent while it's empty.

## 8. Connect an email service
In Kit or MailerLite, create an embedded form and copy its form `action` URL and email field name into `site.newsletter`. The signup block appears on the live site only once this is set.

## 9. Sitemap and domain
Set `siteUrl` (e.g. `https://pawsandpassage.com`) in `src/config/site.ts`. `/sitemap.xml` then lists every published page; until then it returns 503. Then add `Sitemap: https://yourdomain/sitemap.xml` to `public/robots.txt`.

## 10. Export and deploy elsewhere
- Connect GitHub in Lovable (Project settings → Git). The repository is a standard TanStack Start + Vite app.
- Locally: `bun install`, `bun run dev`, `bun run build`, `bunx vitest run`.
- It builds for Cloudflare Workers by default. Any host that runs TanStack Start works.

## Deploying on Hostinger (Node.js web app)

Tested 2026-11-16: the app builds as a plain Node server and renders pages on the server.

- **Plan:** Hostinger runs Node.js web apps only on **Business Web Hosting** and **Cloud** plans (Startup, Professional, Enterprise, Enterprise Plus), or on a VPS with manual setup. Cheaper shared plans (Single, Premium and the like) and website-builder or WordPress plans do not. Check hPanel's Node.js section before paying.
- **Framework preset:** Nitro (this app is built with Nitro). Node 22 or 24; `package.json` declares `engines.node >= 22`.
- **Install:** Hostinger uses npm when it finds `package-lock.json`. The repo includes it, plus an `.npmrc` with `legacy-peer-deps=true`, because plain `npm install` otherwise crashes on this dependency set.
- **Build command:** `build:node` (runs `NITRO_PRESET=node-server vite build`). Do **not** use plain `build`: it targets Cloudflare Workers, which Lovable's own publishing uses.
- **Output directory:** `.output`  **Entry file:** `server/index.mjs` (relative to the output directory).
- **Port:** the server reads `PORT`, which Hostinger sets.
- **Limits to know:** each request is cut off after 120 seconds, no inbound WebSockets, no always-on background workers, and all Node apps on a plan share one process and memory pool (Business: 5 apps). This site needs none of those; it used about 95 MB of memory in testing.
- After switching on a domain, set `siteUrl` in `src/config/site.ts` and redeploy so canonical tags and the sitemap use it.
- Lovable's built-in publish and Hostinger are separate deployments. Pick one as the live site so the two don't drift.

## Transferring the business
Hand over: the GitHub repo, the domain registrar, the GA4 property (add the buyer as admin), the email-service account (export subscribers), and each affiliate account (most networks need the new owner to re-apply).

## Still needed before launch
- Business email (`contactEmail`), domain (`siteUrl`), GA4 ID, newsletter form.
- Approved affiliate partnerships.
- Real verified stays.
- Legal review of the privacy policy, terms and disclosure.
- Each guide's `research.followUps` lists optional editor follow-ups, such as competitor pages that could only be read as search excerpts.
