# content/premium (no premium text is tracked here)

The premium adventure instructions are **not stored in this repository**. This folder is a git-ignored place for a LOCAL working copy
(`content/premium/*.json` is in `.gitignore`, and a test fails if any of those files is ever tracked).

## Where the authoritative copy lives

The protected premium package is kept outside this repository; its location and its private backup are held by the owner. It is versioned and
carries a manifest of file hashes and a zip with a recorded sha256.

## Restore a local working copy (for editing or import)

```bash
mkdir -p content/premium
cp <protected package folder>/adventures/*.json content/premium/
git status --short content/premium   # must print nothing: the files are ignored
```

Or skip the copy and point the scripts at the package folder directly:

```bash
export PREMIUM_DIR=<protected package folder>/adventures
node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env preview      # dry run
```

Scripts take the folder from `--dir <folder>` or `PREMIUM_DIR`. There is no default. See `docs/PREMIUM-CONTENT-WORKFLOW.md`.
Never copy premium text into any tracked file, test, fixture or doc; use the synthetic fixtures in `src/passport/fixtures/`.
