# Premium content workflow

How the paid adventure library is edited, checked, backed up and loaded into the live store, written so a non-technical owner or buyer can follow it. Nothing here needs a developer except the optional GitHub Action (section 7). No secret, license code or customer detail belongs in this file or anywhere in the repository.

## 0. Read this first: where the premium text lives today

**By the owner's decision of 2026-11-26, the premium adventures are stored in THIS repository, in `content/premium/`, one JSON file per adventure, and the repository is still PUBLIC.** Anyone on the internet can read a public repository, including its history and any fork or clone. So:

- The paid library is **protected only once the repository is made private.** Until then the files are readable by anyone who looks.
- The website itself is safe from this folder: the site build never reads, watches or bundles `content/premium/` (the content plugin skips it, no import glob can match it, and `src/test/handover-premium-isolation.test.ts` fails if that changes). Customers receive premium text only from the server, after a purchase.
- **Next step: make the repository private, then check forks and clones** (checklist in section 1). Do this before any real marketing, and before sharing the repository with a buyer.
- Making a repository private later does not erase what was public before. Assume anyone who cloned or forked it while it was public still has a copy. The business answer to that is the owner's call; this document only records the fact.

## 1. One-time checklist: make the repository private

Do these in order, on GitHub, as the repository owner.

1. **Check visibility now.** Repository, Settings, General, "Danger Zone" shows "Change repository visibility". Note today's visibility and the date.
2. **Check forks and clones.** Repository, Insights, Forks (or the "Forks" count on the front page) lists public forks. A private repository's public forks stay public and detached; ask each fork owner to delete theirs or report them to GitHub if they hold the paid text. You cannot see private local clones; treat any past clone as existing.
3. **Make it private.** Settings, General, Danger Zone, "Change visibility", "Make private". Read the warning: stars and watchers are lost, GitHub Pages (if used) is affected, Actions minutes become metered by plan.
4. **Confirm Pages CMS access.** Pages CMS signs in with GitHub. Open the CMS as the owner and confirm the repository still opens and the "Adventures (premium)" menu lists the files. Any other person who edits must be added as a repository collaborator (Settings, Collaborators) first.
5. **Confirm Netlify can still build.** Netlify's GitHub connection needs access to private repositories. Trigger a deploy and confirm it succeeds. If it fails with an access error, re-authorize the Netlify GitHub app for this repository.
6. **Rotate nothing.** No secret is stored in the repository, so making it private requires no rotation. (Rotation rules for a sale are in `OWNERSHIP-TRANSFER.md`.)
7. **Run the leak check on a build.** A developer or the owner, with Node 22.18 or newer: `npm ci`, `npm run build`, then `node scripts/check-leaks.mjs dist` (use the output folder the build reports if it is different). It must say "Leak check passed". It proves the build output carries no premium text; it cannot judge the repository itself.
8. **Record it.** Write the date and the result under "Repository visibility" in your own notes (not in the repository).

## 2. The folder and the file format

```
content/premium/
  adv-k3m9x2.json
  adv-p4r8c1.json
  ... one file per premium adventure
```

- **One JSON file per adventure, named exactly `<id>.json`** (for example `adv-k3m9x2.json`). The id is permanent and never edited. Sub-folders are allowed (for example by collection) and are read too; only `.json` files count, so `.gitkeep` or notes are ignored.
- The file holds **one adventure object**, not a list. Its fields are exactly the adventure schema in `src/passport/schema.ts` (the same fields as a free adventure, with `"access": "premium"`).
- `docs/CONTENT-GUIDE.md` explains how to write one. The rules there (no medical claims, honest classification, independent review scores) apply unchanged.

## 3. Editing without a developer (Pages CMS)

Pages CMS has a menu **Adventures (premium)** that edits `content/premium/*.json` with a form listing every field, with drop-downs for every controlled choice. It is generated from, and tested against, the schema (`src/test/handover-cms.test.ts` fails if the form and the schema drift apart), so a new adventure made in the CMS passes the same checks as one written by hand.

1. Open Pages CMS, choose **Adventures (premium)**, open an adventure (or "Add" for a new one).
2. Change the fields. Every label says what it wants and its length limit.
3. Save. This only saves a file in the repository. **It does not change the live store.** The paid library on the site changes only when you run the import (section 5).
4. Leave `status` on `draft` until the adventure has been independently scored (see `CONTENT-GUIDE.md`, Scoring).

Be aware: until the repository is private, a save here commits premium text to a public repository. Wait for section 1 before writing new premium content this way, or write it somewhere private and bring it in afterwards.

## 4. Previews, showcase flags and teasers

The public website shows about 50 curated **previews** of premium adventures. A preview is built by the import from an allowlist of fields; it never contains the steps, twist, reveal, clue, objective, variations, completion, safety lines, supplies, photo idea, memory prompt, review scores or research.

Per adventure you control three public marketing fields:

| Field          | Rule                                                                                                                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `teaser`       | Up to 110 characters. Tease the idea without explaining how it works: no steps, mechanics or twists. The import refuses a teaser that sounds like instructions ("first,", "then you", "next,", "step 1"). |
| `previewTitle` | Optional, up to 60 characters. A mystery-style title shown instead of the real title in public previews.                                                                                                  |
| `showcase`     | Tick to put the adventure in the public preview set. **A showcase adventure must have a teaser**; the import refuses it otherwise. Only `published` adventures with `showcase` ticked become previews.    |

Keep the showcase to roughly 50 cards across roles and collections. The dry run (section 5) prints the showcase count. Public previews are always labeled as selected previews from a larger collection; never add claims such as ratings, counts or urgency to a teaser.

## 5. Validate and import

All commands run on your own computer in the repository folder, with Node 22.18 or newer (`npm ci` once). The scripts are never deployed, are not web endpoints and are never run automatically on the live site.

**Step A: validate (dry run, the default, writes nothing, needs no password):**

```bash
node scripts/premium-import.mjs --dir content/premium --env preview
```

It checks every file against the schema, that each file name equals the adventure id, that every adventure is `premium`, that ids are unique, builds the preview records and refuses a showcase card with a missing or mechanics-style teaser. It prints the totals, for example "Validated 120 premium adventures" and "Showcase previews: 50". Fix every line it complains about (each names the file and field) and run again until it passes.

**Step B: back up first (this is your rollback).** Before any write, export what is live now (section 6).

**Step C: write to the preview store and look at a preview deploy:**

```bash
export NETLIFY_AUTH_TOKEN=...   # a Netlify personal access token, typed in your terminal, never in a file
export SITE_ID=...              # the site's API id
node scripts/premium-import.mjs --dir content/premium --env preview --write
```

**Step D: write to the live store only when satisfied:**

```bash
node scripts/premium-import.mjs --dir content/premium --env production --write --yes-production
```

`--prune` also deletes stored adventures that are no longer in the folder; use it only deliberately (it is how a retired adventure leaves the paid library). Nothing is ever written unless `--write` is typed.

The older single-file mode (`--file <one JSON array>`) still works. To convert an old array into the folder layout without any network: `node scripts/premium-split.mjs --file <array.json> --dir content/premium`.

## 6. Back up and roll back

**The backup rule:** export the live store to files before every import that writes to production, keep at least the last three exports, and also keep a dated export once a quarter. Store backups outside the public repository (an encrypted drive or a private cloud folder). The repository's own history is a second copy only once it is private.

```bash
node scripts/premium-export.mjs --dir ~/premium-backups/2026-12-01 --env production
```

This writes one `<id>.json` per live adventure into a new folder (it refuses to overwrite existing files unless `--overwrite`). The folder must be outside the repository, or exactly `content/premium`. The older single-file form `--out <file>` still works.

**Rollback:** the export folder has the same layout the import reads, so rolling back is an import of the backup:

```bash
node scripts/premium-import.mjs --dir ~/premium-backups/2026-12-01 --env production          # dry run
node scripts/premium-import.mjs --dir ~/premium-backups/2026-12-01 --env production --write --yes-production --prune
```

`--prune` here removes adventures that were added after the backup. Run a dry run first and read the counts.

**To fill `content/premium/` from the live store (or to restore it):** `node scripts/premium-export.mjs --dir content/premium --env production` (add `--overwrite` to refresh existing files).

## 7. Optional: GitHub Action for review and approved imports

This is optional and works only once the repository is private (a workflow that writes to the live store must never run in a public repository). Put the file below at `.github/workflows/premium-import.yml`. It costs nothing beyond the GitHub free tier (private repositories have a monthly allowance of free Actions minutes; the amount is **UNVERIFIED** here, check GitHub's current plan page). It makes three promises:

- On a pull request that changes `content/premium/`, it runs the **dry run only**, with no secrets.
- It writes to a store only when a person manually starts it and, for production, types the word `production` and the run is approved by a reviewer you set up on a GitHub Environment (reviewer rules on private repositories may need a paid GitHub plan: **UNVERIFIED**; without them, the typed confirmation is the only gate).
- Before any write it exports the current live store and keeps it as a private run artifact for 14 days (your rollback).

**OWNER MUST REVIEW BEFORE ENABLING.** The write jobs use a Netlify access token that can change the production store. Review who can run workflows and who can approve, create the Netlify token as a dedicated token (not your personal one if you can avoid it), store it only as a repository (or Environment) secret named `NETLIFY_AUTH_TOKEN`, put the site id in `SITE_ID`, and be ready to revoke the token. Never print secrets in a step. When ownership changes, revoke and recreate these secrets.

```yaml
name: Premium import
on:
  pull_request:
    paths: ["content/premium/**", "scripts/premium-*.mjs", "src/passport/schema.ts"]
  workflow_dispatch:
    inputs:
      target:
        description: "Store to write: preview or production"
        required: true
        default: preview
        type: choice
        options: [preview, production]
      confirm:
        description: "For production only: type the word production"
        required: false

permissions:
  contents: read

jobs:
  dry-run:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: node scripts/premium-import.mjs --dir content/premium --env preview # dry run: no --write, no secrets

  write:
    if: github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    # Create a GitHub Environment named "premium-import" and add yourself as a required reviewer.
    environment: premium-import
    env:
      NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
      SITE_ID: ${{ secrets.SITE_ID }}
      TARGET: ${{ inputs.target }}
    steps:
      - name: Require the typed confirmation for production
        if: inputs.target == 'production' && inputs.confirm != 'production'
        run: |
          echo "Type the word production in the confirm box to write to the live store."
          exit 1
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - name: Dry run
        run: node scripts/premium-import.mjs --dir content/premium --env "$TARGET"
      - name: Back up the current store (rollback copy)
        run: node scripts/premium-export.mjs --dir "$RUNNER_TEMP/backup" --env "$TARGET"
      - uses: actions/upload-artifact@v4
        with:
          name: premium-backup-${{ github.run_id }}
          path: ${{ runner.temp }}/backup
          retention-days: 14
      - name: Write preview
        if: inputs.target == 'preview'
        run: node scripts/premium-import.mjs --dir content/premium --env preview --write
      - name: Write production
        if: inputs.target == 'production' && inputs.confirm == 'production'
        run: node scripts/premium-import.mjs --dir content/premium --env production --write --yes-production
```

Notes: the dry run never needs credentials. The export step needs them, so it runs only in the approved job. Pull requests from forks never receive secrets. The Action never uses `--prune`; retiring an adventure is a deliberate local step (section 5). The upload step stores premium text as a private run artifact; it is private only if the repository is private.

## 8. Alternative (kept short): a separate private repository

If you would rather keep premium text out of the website's repository entirely, create a private GitHub repository (suggested name `premium-content-private`), put the same `content/premium/*.json` layout in it, copy the "Adventures (premium)" block from `.pages.yml` into that repository's own `.pages.yml` (change nothing but, if you like, the path), and run `node <path to site repo>/scripts/premium-import.mjs --dir <folder in the private repo>` from a checkout of both. The scripts accept any folder outside the website repository. This is the safer layout for a public website repository, and the one to choose if the website repository is ever meant to stay public.

## 9. Who does what

| Task                                       | Non-technical owner or buyer        | Developer                     |
| ------------------------------------------ | ----------------------------------- | ----------------------------- |
| Edit or add a premium adventure in the CMS | Yes                                 |                               |
| Run the dry run, read its messages         | Yes (copy and paste commands)       |                               |
| Export a backup, run an import             | Yes, with the commands above        |                               |
| Make the repository private (section 1)    | Yes                                 |                               |
| Enable and review the GitHub Action        | Owner reviews; developer sets it up | Recommended                   |
| Change the schema or the CMS form          |                                     | Yes (tests keep them in step) |
