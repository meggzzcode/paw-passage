# Repository migration plan (summary)

**This file is removed from the final public repository.** It is a planning aid only. Details (names, locations, identifiers, step-by-step commands) are kept privately by the owner.

## Plan in one paragraph

The final, tested version of the app is published as a new public repository with a fresh, single-commit history, built from a copy of the tracked files only. After the new repository is verified and the connected services point to it, the existing repository is made private and archived. No history is rewritten and nothing is force-pushed. The protected premium package stays outside both repositories.

## Steps (summary)

1. Freeze changes to the current main branch.
2. Verify the final integrated commit: type check, lint, tests, build, leak scan.
3. Copy the tracked files into a fresh folder (no `.git`) and run `node scripts/sanitize-check.mjs` on it.
4. Initialize it, make one initial commit with a neutral author, create the new public repository, push.
5. Reconnect services to the new repository, keeping the same site, domain and settings: hosting (automatic builds stay stopped, manual deploys only), the app builder, the CMS, the custom GPT, repository integrations, CMS sign-in.
6. Verify one manual preview deploy and confirm the production rollback target still exists.
7. Only then make the old repository private and archive it, and update links.

## Sanitization checklist (run against the snapshot)

- [ ] `node scripts/sanitize-check.mjs` reports 0 findings (also with the owner's extra private strings in `SANITIZE_EXTRA_MARKERS`).
- [ ] `git ls-files content/premium` lists only `README.md`.
- [ ] No local paths, storage locations, backup or drive identifiers in any file.
- [ ] No author names or personal email addresses in files or the commit.
- [ ] No secrets, tokens or env values in files; only variable names.
- [ ] This file and any migration notes are deleted from the snapshot.
- [ ] `npm ci && npm run build` succeeds inside the snapshot folder.
- [ ] README and docs describe the product, not the migration.

## Rollback (summary)

Keep the previous production deploy as the rollback target; services can be relinked to the old repository until it is made private.
