# Agent instructions

Product: The Adventure Passport (Paws & Passage). Read `README.md` first, then `docs/ARCHITECTURE.md`.

## Commands

```bash
npm ci
npx tsc --noEmit
npm run lint
npm test            # vitest run
NITRO_PRESET=netlify npm run build
node scripts/test-netlify-ignore.mjs
npx prettier --check <files>
```

## Rules

- The repository is **public**. Never commit secrets, tokens, license codes, customer data, or any new premium adventure text or titles. Premium text is NOT tracked here (owner directive 2026-11-26): `content/premium/*.json` is git-ignored, the authoritative protected package is outside the repository (`docs/PREMIUM-CONTENT-WORKFLOW.md`). Never add or copy premium text into any file, doc, test or fixture; scripts take the folder from `--dir` or `PREMIUM_DIR`. The live copy is in Netlify Blobs; the build refuses `access: premium` in `content/adventures/` and never reads `content/premium/`.
- Never put a private or local file path in a document or comment (the one exception is the protected package location recorded in `docs/PREMIUM-CONTENT-WORKFLOW.md`).
- **Hard eligibility:** a known conflict excludes an adventure and a missing fact holds it. Unknown is never safe. Ranking, randomness and filters must not override it. Breed is never an eligibility input.
- **Photo privacy:** photos are handled in memory on the device only. Never add upload, storage, logging or analytics of photos or keepsakes.
- No AI APIs, no accounts for the free experience, no subscriptions.
- Affiliate links: verified Amazon products only, through `content/affiliates.yml`.
- Write only facts the code supports; mark anything unproven as UNVERIFIED.
- Do not commit, push, deploy or touch live services unless the owner asks.
- Netlify builds cost credits: do not change `netlify.toml` `ignore` without running `node scripts/test-netlify-ignore.mjs`.
- Verified status: never write a test count or "all tests pass" in a document. Results go only in the Last verified run section of `docs/QA-REPORT.md`.
- PWA and push notifications are paused (`PWA_ENABLED=false`, `flags.notifications=false`); gifting is off (`flags.gifting=false`). Do not turn them on without the owner.
- Handwritten type (Caveat, `font-hand-note`) is decorative only: never for safety, eligibility, payment, refund or instructional text, so critical text stays easy to read.
