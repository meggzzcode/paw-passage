# Merge notes

## Large-dog guide absorbed the no-weight-limit guide (2026-11-24)

- Survivor: `/guides/vacation-rentals-that-welcome-large-dogs` (source `src/content/guides/vacation-rentals-that-welcome-large-dogs.ts`).
- Retired: `/guides/vacation-rentals-with-no-dog-weight-limit`. Permanent 301 to the survivor in `netlify.toml` and in the app
  (`src/routes/guides.vacation-rentals-with-no-dog-weight-limit.tsx`, so the node server redirects too). Not in the sitemap, share image or pin sheet.
- Why this URL: no Search Console, indexing or traffic data for either page exists in the repo (`docs/cowork/02-search-console.md`
  and `11-search-console-indexing.md` do not mention them), so none was assumed. The survivor had 15 inbound guide-body links against 7,
  already carries the shared product and pin board, has the more natural "large dog friendly vacation rentals" query, and the scorecard
  verdict (`docs/ARTICLE_SCORECARD.md`) says to keep it as the hub.
- The retired slug is allowed (not a 404) in `plugins/content.ts` (`retiredGuideSlugs`) and `src/test/internal-guide-links.test.ts`
  (`retiredRedirects`) until the files below are updated. Remove both entries after the link pass.

### Files that still link to the retired URL (the 301 covers them; a later pass should point them at the survivor)

Live text or front matter:

- `content/guides/breed-restrictions-at-vacation-rentals.md` (relatedGuides, body link)
- `content/guides/vacation-rentals-with-no-pet-fee.md` (relatedGuides, body link in "Dog limits", next-step text)
- `content/guides/what-a-dog-really-costs-on-a-vacation-rental.md` (relatedGuides)
- `src/content/guides/pet-friendly-vacation-rental-checklist.ts` (relatedGuides, and body text that says 38 managers)

Docs only (history, no action needed): `docs/ARTICLE_SCORECARD.md`, `docs/editorial/scorecard-batch-5.md`, `docs/review/*vacation-rentals-with-no-dog-weight-limit*`,
`docs/CLAIMS-/FACTCHECK-vacation-rentals-with-no-dog-weight-limit.md`, `docs/cowork/10-pinterest-pins.md`, `docs/PINTEREST-SETUP.md`, `docs/flip/*`, `docs/recovery/*`, `docs/products/*`.

Also check: the `guide-no-weight-limit` hero image is now unused by any guide (`src/lib/images.ts`, `src/content/image-credits.ts`).
