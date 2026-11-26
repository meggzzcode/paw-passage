# Agent instructions

Product: The Adventure Passport (Paws & Passage). Read `README.md` first, then `docs/ARCHITECTURE.md`.

## Commands

```bash
npm ci
npx tsc --noEmit
npm run lint
npm test            # vitest run
npm run build
node scripts/test-netlify-ignore.mjs
npx prettier --check <files>
```

## Rules

- The repository is **public**. Never commit secrets, tokens, license codes, customer data, or premium adventure text or titles. Premium content lives only in Netlify Blobs and in a file outside the repository; the build refuses `access: premium` in `content/`.
- Never put a private or local file path in a document or comment.
- **Hard eligibility:** a known conflict excludes an adventure and a missing fact holds it. Unknown is never safe. Ranking, randomness and filters must not override it. Breed is never an eligibility input.
- **Photo privacy:** photos are handled in memory on the device only. Never add upload, storage, logging or analytics of photos or keepsakes.
- No AI APIs, no accounts for the free experience, no subscriptions.
- Affiliate links: verified Amazon products only, through `content/affiliates.yml`.
- Write only facts the code supports; mark anything unproven as UNVERIFIED.
- Do not commit, push, deploy or touch live services unless the owner asks.
- Netlify builds cost credits: do not change `netlify.toml` `ignore` without running `node scripts/test-netlify-ignore.mjs`.
- Handwritten type (Caveat, `font-hand-note`) is decorative only: never for safety, eligibility, payment, refund or instructional text, so critical text stays easy to read.
