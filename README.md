# Paws & Passage

A dog-friendly travel site: 30 published researched guides (33 files), 3 planning tools and a directory of
stays (32 listed, each labelled "Not yet verified"; none verified). Pre-revenue. Plain-file content, no database, no admin login.

Built with TanStack Start + Vite + Tailwind, hosted on Netlify. It was edited in Lovable, which is not needed to build, host or edit.

**Buyer guide: [BUYER_HANDOVER.md](./BUYER_HANDOVER.md)**; verified counts: `docs/BUYER_ASSET_INVENTORY.md`; transfer steps: `docs/TRANSFER_CHECKLIST.md`.
**Developer handbook: see [HANDOVER.md](./HANDOVER.md)** (where content lives, corrected 2026-11-23: stays, affiliate links and settings are in `content/*.yml`, guides in `content/guides/*.md`).

## Develop

```sh
bun install
bun run dev        # local preview (sample stays and draft guides are visible)
bunx vitest run    # 486 tests in 33 files (2026-11-23)
bun run lint        # 0 errors, 12 warnings (2026-11-23)
bun run build
```

CI runs tests and build on every push and pull request.

## Publishing rules (enforced in code and tests)

- A guide is public only when `status: "published"`, `research.researchComplete` is `true`,
  `research.unverified` is empty, and `approvedBy` and `approvedOn` are filled. Anything else is a noindexed, preview-only draft left out of the sitemap.
- A stay is listed only when it has an approved affiliate link (verified or not; unverified ones are labelled). Sample stays never appear.
- Booking buttons appear only for stays with an approved affiliate link. Seller-held affiliate IDs and accounts are not part of a sale.
