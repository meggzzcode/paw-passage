# Paws & Passage

A dog-friendly vacation-rental travel site. Pre-revenue, plain-file content, no database, no admin login, no server to look after.

What the repository contains (counted 2026-11-25 at `3e5923b`; commands in [docs/buyer/ROUTE_AND_ASSET_COUNTS.md](docs/buyer/ROUTE_AND_ASSET_COUNTS.md)):

- **30 published researched guides** (32 files; 2 drafts stay unpublished) and **8 town "things to do with a dog" articles**.
- **An original 38-manager pet-policy dataset** (13 fields per manager) on `/data/pet-policies` and as `public/pet-policies-38-managers.csv`.
- **3 tools:** a personalized dog packing planner (saves on the visitor's device only; copy and print; no accounts), "will my dog be accepted" (checks the 38 managers) and a before-you-book checklist. There are no calculators.
- **A stay directory:** 83 stay files, none confirmed with a host; 78 shown (each page says its details are not confirmed with the host) because each has a public Vrbo listing link, 23 of them indexable, 5 hidden. The site ships in `stayDirectoryMode: public-sources`: stays keep plain source links if the seller's affiliate links are removed ([docs/BUYER_AFFILIATE_TRANSITION.md](docs/BUYER_AFFILIATE_TRANSITION.md)).
- **A photo-free Gear shop:** 11 category pages, 5 trip collections, 65 active products (92 records), no third-party product images.
- A 104-URL generated sitemap, structured data, redirects and a weekly health check. **783 automated tests in 61 files.**

**Deployment (2026-11-25):** production runs `main@82b0b34`, which is older than the final commit; the final build is not yet deployed and needs the owner's approval ([docs/SALE_RELEASE_STATUS.md](docs/SALE_RELEASE_STATUS.md)). Affiliate accounts, analytics and Search Console are the seller's and are **not** part of a sale; the IDs in the repository are the seller's (`node scripts/audit-seller-ids.mjs` lists them).

Built with TanStack Start + Vite + Tailwind, hosted on Netlify. It was edited in Lovable, which is not needed to build, host or edit.

**Buyer start: [BUYER_HANDOVER.md](./BUYER_HANDOVER.md) (START HERE: Owner's Guide)**, with [docs/BUYER_OVERVIEW.md](./docs/BUYER_OVERVIEW.md) as the one-page summary; verified counts: [docs/BUYER_ASSET_INVENTORY.md](docs/BUYER_ASSET_INVENTORY.md); transfer steps: [docs/TRANSFER_CHECKLIST.md](docs/TRANSFER_CHECKLIST.md); replacing the seller's IDs: [docs/BUYER_AFFILIATE_TRANSITION.md](docs/BUYER_AFFILIATE_TRANSITION.md).
**Developer handbook: see [HANDOVER.md](./HANDOVER.md)** (where content lives: stays, affiliate links, products, the packing planner and settings are in `content/*.yml`, Markdown guides in `content/guides/*.md`, 7 guides still in `src/content/guides/*.ts`).

## Develop

```sh
bun install
bun run dev                              # local preview (sample stays and draft guides are visible)
bunx vitest run                          # 783 tests in 61 files (2026-11-25)
bunx tsc --noEmit                        # types, no errors
bunx eslint . --quiet                    # lint errors only, none
NITRO_PRESET=node-server bunx vite build   # production build served by Node (Netlify runs npm run build = vite build)
PORT=4581 node .output/server/index.mjs  # serve the build, then:
node scripts/verify-site.mjs http://localhost:4581 --site-url https://www.pawsandpassage.com   # 319 checks pass (2026-11-25)
node scripts/audit-seller-ids.mjs        # which seller IDs are still in the repository (--expect-none after a transfer)
node scripts/test-netlify-ignore.mjs     # the Netlify build-skip rule
bun scripts/gear-coverage-report.ts      # packing-to-Gear coverage (writes docs/PACKING_GEAR_COVERAGE.md)
```

CI runs tests and build on every push and pull request.

## Publishing rules (enforced in code and tests)

- A guide is public only when `status: "published"`, `research.researchComplete` is `true`, `research.unverified` is empty, and `approvedBy` and `approvedOn` are filled. Anything else is a noindexed, preview-only draft left out of the sitemap.
- A stay is listed when it has a public Vrbo or Airbnb source address (`stayDirectoryMode: public-sources`, owner-approved 2026-11-25) or an approved affiliate link; the older `affiliate-only` mode lists a stay only while it has an approved link. Unverified stays are labelled. Sample stays never appear. Approved only means a person allowed the button to show; it is not proof that any affiliate programme approved the site.
- A labelled booking button appears only for stays with an approved affiliate link; other stays get a plain source link that earns nothing. Seller-held affiliate IDs and accounts are not part of a sale.
