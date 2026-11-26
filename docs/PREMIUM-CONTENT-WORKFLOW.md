# Premium content workflow

How the paid adventure library is edited, checked, backed up and loaded into the live store, written so a non-technical owner or buyer can follow it. Nothing here needs a developer except the optional GitHub Action (section 7). No secret, license code or customer detail belongs in this file or anywhere in the repository.

## 0. Read this first: where the premium text lives now

**By the owner's directive of 2026-11-26, the premium adventure text is NOT tracked in this repository any more.** The 99 premium adventure JSON files were removed from the current source tree (`content/premium/*.json` is git-ignored; a test fails if one is ever tracked again). What stays public: marketing previews (teasers, never instructions), the schema, free adventures and synthetic test fixtures.

Run `node scripts/sanitize-check.mjs` before publishing a snapshot: it scans every tracked file for private markers and secret patterns and exits non-zero on a hit. The owner can add private strings that must never appear (for example a storage path or an id) through the `SANITIZE_EXTRA_MARKERS` environment variable (comma separated); those strings are never written into the repository.

- The website never reads premium text from the repository: the content plugin skips `content/premium/`, no import glob can match it, and `src/test/handover-premium-isolation.test.ts` fails if that changes. Customers receive premium text only from the server, after a purchase.
- Scripts and tests that need the real library take its folder from `--dir <folder>` or the environment variable `PREMIUM_DIR`. There is no default folder. Without it, scripts that need premium data stop with an explicit message, and `library-stats` and the Journal overlap check run in a clearly labelled free-only (partial) mode.
- Real premium content is loaded into a store only in a protected environment, after the owner authorizes it. An undisclosed URL is not access control.

## 0a. The protected content package (authoritative copy)

**The protected package is the authoritative copy of the paid library.** The repository no longer tracks the text (section 0),. **Commit no further premium text.** Treat the package, never the repository, as the source of truth for restores and transfers.

| Item       | Value                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Local path | `<package folder>/<version>/` (outside the repository; location held by the owner) plus `<version>.zip` and `<version>.zip.sha256` |
| Current    | `premium-2026-11-26-1` (99 adventures, 50 showcase previews, 25 collections in the library)                                        |
| Backup     | A private copy of the zip is held by the owner; its sha256 is recorded in the owner's private records                              |

What is inside: `premium-import.json` (one array), `adventures/` (one file per adventure; point `PREMIUM_DIR` here), `public-previews.json`, `collections.json`, `keepsake-configs.json` (per card family, theme, headline, subhead, explainer, plus the registered theme ids), `validation-report.txt` (the exact dry-run output), `MANIFEST.json` (version, date, git commit, sha256 of every file, counts), `IMPORT.md` and `EXPORT-RECOVERY.md`.

- **Access:** open the Drive file (it is private to the Drive account that owns it; share it only with someone you trust) or use the local folder. Check the zip against its `.sha256` file and the files against `MANIFEST.json`.
- **Update:** change adventures where you keep them, then from the repository run `node scripts/premium-package.mjs --out <folder outside the repo>`. It validates with the real schema through the import script's dry run, writes the next numbered version (`premium-<date>-<n>`), never writes to any store and refuses to write inside the repository. Upload the new zip to Drive and update the table above.
- **Export from the live store:** `node scripts/premium-export.mjs --dir <folder> --env production` (see `EXPORT-RECOVERY.md` in the package).
- **Transfer to a new owner:** hand over the zip and its sha256 privately; they follow `IMPORT.md` with their own store credentials. Details in `EXPORT-RECOVERY.md`.
- The package holds adventure text only: no customer data, no secrets. Keep it private anyway.

## 1. Repository hygiene

The repository tracks no premium text. Run the leak check on every build (section 5a) and `node scripts/sanitize-check.mjs` before any repository hand-over or snapshot. Repository migration planning is kept in the owner's private records.

## 2. The folder and the file format

```
<PREMIUM_DIR>/            (the package's adventures/ folder, or a git-ignored local copy in content/premium/)
  adv-k3m9x2.json
  adv-p4r8c1.json
  ... one file per premium adventure
```

- To make a LOCAL working copy in the repository folder (git-ignored): `mkdir -p content/premium && cp <protected package folder>/adventures/*.json content/premium/` (see `content/premium/README.md`). `git status` must stay clean.
- **One JSON file per adventure, named exactly `<id>.json`** (for example `adv-k3m9x2.json`). The id is permanent and never edited. Sub-folders are allowed and are read too; only `.json` files count.
- The file holds **one adventure object**, not a list. Its fields are exactly the adventure schema in `src/passport/schema.ts` (the same fields as a free adventure, with `"access": "premium"`).
- `docs/CONTENT-GUIDE.md` explains how to write one. The rules there (no medical claims, honest classification, independent review scores) apply unchanged.

## 3. Editing (Pages CMS premium form stays OFF)

**The premium form is OFF and must stay off (owner decision OD2, reinforced by the 2026-11-26 directive):** `.pages.yml` ships it commented out between `PREMIUM-CMS-SWITCH:BEGIN` and `PREMIUM-CMS-SWITCH:END`. Pages CMS edits tracked files in the repository, and `content/premium/*.json` is git-ignored, so the form could only commit premium text again. Premium adventures are edited in the protected package folder (or a local working copy) with any editor, then validated with the dry run (section 5) and re-packaged (section 0a). The form is still generated from, and tested against, the schema (`src/test/handover-cms.test.ts`), so it cannot drift if the owner ever re-enables it after a remediation decision.

Leave `status` on `draft` until the adventure has been independently scored (see `CONTENT-GUIDE.md`, Scoring).

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

All commands run on your own computer in the repository folder, with Node 22.18 or newer (`npm ci` once). First `export PREMIUM_DIR=<protected package folder>/adventures` (or pass `--dir <folder>` each time). The scripts are never deployed, are not web endpoints and are never run automatically on the live site.

**Step A: validate (dry run, the default, writes nothing, needs no password):**

```bash
node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env preview
```

It checks every file against the schema, that each file name equals the adventure id, that every adventure is `premium`, that ids are unique, builds the preview records and refuses a showcase card with a missing or mechanics-style teaser. It prints the totals, for example "Validated 120 premium adventures" and "Showcase previews: 50". Fix every line it complains about (each names the file and field) and run again until it passes.

**Step B: back up first (this is your rollback).** Before any write, export what is live now (section 6).

**Step C: write to the preview store and look at a preview deploy.** Ordinary preview integration testing should use SYNTHETIC content (`src/passport/fixtures/premium.synthetic.ts`); import the real library only into a protected environment after the owner authorizes it:

```bash
export NETLIFY_AUTH_TOKEN=...   # a Netlify personal access token, typed in your terminal, never in a file
export SITE_ID=...              # the site's API id
node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env preview --write
```

**Step D: write to the live store only when satisfied:**

```bash
node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env production --write --yes-production
```

`--prune` also deletes stored adventures that are no longer in the folder; use it only deliberately (it is how a retired adventure leaves the paid library). Nothing is ever written unless `--write` is typed.

The older single-file mode (`--file <one JSON array>`) still works. To convert an old array into the folder layout without any network: `node scripts/premium-split.mjs --file <array.json> --dir content/premium`.

## 6. Back up and roll back

**The backup rule:** export the live store to files before every import that writes to production, keep at least the last three exports, and also keep a dated export once a quarter. Store backups outside the public repository (an encrypted drive or a private cloud folder). The repository is not a backup of the premium text.

```bash
node scripts/premium-export.mjs --dir ~/premium-backups/2026-12-01 --env production
```

This writes one `<id>.json` per live adventure into a new folder (it refuses to overwrite existing files unless `--overwrite`). The folder must be outside the repository, or exactly `content/premium` (a git-ignored local working copy). The older single-file form `--out <file>` still works.

**Rollback:** the export folder has the same layout the import reads, so rolling back is an import of the backup:

```bash
node scripts/premium-import.mjs --dir ~/premium-backups/2026-12-01 --env production          # dry run
node scripts/premium-import.mjs --dir ~/premium-backups/2026-12-01 --env production --write --yes-production --prune
```

`--prune` here removes adventures that were added after the backup. Run a dry run first and read the counts.

**To fill a local working copy from the live store:** `node scripts/premium-export.mjs --dir content/premium --env production` (git-ignored; add `--overwrite` to refresh existing files), or restore it from the package (`content/premium/README.md`).

## 7. Optional: GitHub Action for review and approved imports

This is optional, **not usable as written while premium text is untracked** (the workflow below checks out files that no longer exist in the public repository), and works only in a PRIVATE repository that tracks premium text, such as the one in section 8. A workflow that writes to the live store must never run in a public repository. It is kept as a template only. Put the file below at `.github/workflows/premium-import.yml`. It costs nothing beyond the GitHub free tier (private repositories have a monthly allowance of free Actions minutes; the amount is **UNVERIFIED** here, check GitHub's current plan page). It makes three promises:

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
        run: node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env preview --write
      - name: Write production
        if: inputs.target == 'production' && inputs.confirm == 'production'
        run: node scripts/premium-import.mjs --dir content/premium --env production --write --yes-production
```

Notes: the dry run never needs credentials. The export step needs them, so it runs only in the approved job. Pull requests from forks never receive secrets. The Action never uses `--prune`; retiring an adventure is a deliberate local step (section 5). The upload step stores premium text as a private run artifact; it is private only if the repository is private.

## 8. Recommended layout for CMS editing: a separate private repository

This is now the recommended layout (premium text is out of the website repository). Create a private GitHub repository (suggested name `premium-private-repo`), put the same `content/premium/*.json` layout in it, copy the "Adventures (premium)" block from `.pages.yml` into that repository's own `.pages.yml` (change nothing but, if you like, the path), and run `node <path to site repo>/scripts/premium-import.mjs --dir <folder in the private repo>` from a checkout of both. The scripts accept any folder outside the website repository. The website repository stays free of premium text.

## 9. Who does what

| Task                                       | Non-technical owner or buyer        | Developer                     |
| ------------------------------------------ | ----------------------------------- | ----------------------------- |
| Edit or add a premium adventure in the CMS | Yes                                 |                               |
| Run the dry run, read its messages         | Yes (copy and paste commands)       |                               |
| Export a backup, run an import             | Yes, with the commands above        |                               |
| Enable and review the GitHub Action        | Owner reviews; developer sets it up | Recommended                   |
| Change the schema or the CMS form          |                                     | Yes (tests keep them in step) |

## 5a. Leak scans (owner-machine checks)

Two checks need the real library and so run only where `PREMIUM_DIR` is set (the tests skip visibly otherwise, `docs/PREMIUM-INTEGRATION-TESTS.md`):

```bash
export PREMIUM_DIR=<protected package folder>/adventures
node scripts/validate-journal.mjs                      # includes the Journal vs premium sentence-overlap rule
node scripts/check-leaks.mjs dist --premium-dir "$PREMIUM_DIR"   # after a build: real titles, instructions, twist, safety text
```
