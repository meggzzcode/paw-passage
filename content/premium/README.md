# content/premium (no premium text is tracked here)

The premium adventure instructions are **not stored in this repository**. This folder is a git-ignored place for a LOCAL working copy
(`content/premium/*.json` is in `.gitignore`, and a test fails if any of those files is ever tracked).

Premium text was committed here earlier and remains in old Git history. Removing the files does not remove that history:
see `docs/HISTORICAL-EXPOSURE.md`.

## Where the authoritative copy lives

- Protected package (outside the repository): `/home/user/premium-content/package/premium-2026-11-26-1/` (versioned, with a manifest of file hashes
  and a zip).
- Private backup: Google Drive file id `16_18luRbxED1OLmYAfyJQGx4UMO2xp4Z` (private to the owner).

## Restore a local working copy (for editing or import)

```bash
mkdir -p content/premium
cp /home/user/premium-content/package/premium-2026-11-26-1/adventures/*.json content/premium/
git status --short content/premium   # must print nothing: the files are ignored
```

Or skip the copy and point the scripts at the package folder directly:

```bash
export PREMIUM_DIR=/home/user/premium-content/package/premium-2026-11-26-1/adventures
node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env preview      # dry run
```

Scripts take the folder from `--dir <folder>` or `PREMIUM_DIR`. There is no default. See `docs/PREMIUM-CONTENT-WORKFLOW.md`.
Never copy premium text into any tracked file, test, fixture or doc; use the synthetic fixtures in `src/passport/fixtures/`.
