# Historical exposure of the premium adventure text

Status: the premium adventure files are removed from the current source tree (staged for the next commit). **Removing files from the tree does not remove them from Git history.** Anyone who can read this public repository can still read the old commits. This document records the facts, the unknowns, and the owner's options. It changes nothing by itself: no visibility change, history rewrite, force-push or new repository has been done or is authorized.

## Facts (from `git log`, checked 2026-11-26)

| Item                                           | Fact                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository                                     | `meggzzcode/paw-passage`, visibility **public** (GitHub API read, 2026-11-26), 0 forks listed at that time                                                                                                                                                                                                                      |
| First commit with premium text                 | `195d159`, 2026-11-26 16:06:36 UTC, "Premium library in content/premium (owner decision) ...": added 100 files (99 premium adventure JSON files plus `.gitkeep`), 10,853 lines                                                                                                                                                  |
| Later change                                   | `c776905`, 2026-11-26 16:11:50 UTC, "Add the five missing collections ...": modified 20 of those JSON files (collection slugs and showcase flags) and added collections                                                                                                                                                         |
| Only these two commits touch `content/premium` | `git log --format=%h -- content/premium` lists exactly `c776905` and `195d159`                                                                                                                                                                                                                                                  |
| Branches that contain them                     | remote `origin/main` and `origin/claude/lucid-davinci-l2fixa` (`git branch -r --contains 195d159`). Other remote branches (`claude/affiliate-setup`, `claude/cms-poc`, `cowork/flip-tasks`) do not contain them. No tag contains them                                                                                           |
| Branch tip when this was written               | `origin/main` ed5f7c5; working branch tip 9c748d8 (18:01 UTC)                                                                                                                                                                                                                                                                   |
| What is exposed                                | The 99 premium adventure JSON files in full, including the `instructions` (steps), `twist`, `reveal`, `clue`, `objective`, `variations`, `completion`, `safety` text, supplies, memory prompts, review scores and research notes, in the two commits above and in every later commit until removal                              |
| Time window                                    | From the push of `195d159` (2026-11-26) until the premium files are removed and any remediation below is carried out. The files stayed under `content/premium/`, which the site build never reads, so the **deployed website never contained them**; the exposure is the repository itself                                      |
| Protected copy                                 | The authoritative package lives outside the repository (`/home/user/premium-content/package/premium-2026-11-26-1/`, 106 files; the 99 adventure files are byte-identical to the ones removed; Drive backup file id `16_18luRbxED1OLmYAfyJQGx4UMO2xp4Z`, private). The removal was done only after that identity was re-verified |

## Unknown (cannot be determined from here)

- Whether anyone cloned, forked or downloaded the repository after `195d159` was pushed (GitHub showed 0 forks when checked; private clones and archive downloads are not visible).
- Whether GitHub, search engines, code-search sites or AI crawlers cached or indexed the files.
- Whether the repository, its commit ids or pull-request refs are cached by third-party tools (for example the Lovable project that syncs this repository, or a custom GPT that reads it).

Assume the text may exist elsewhere. Deleting the files, making the repository private later, or rewriting history reduces future exposure; none of them recalls copies that already exist.

## What was done in the tree

- `content/premium/*.json` removed (`git rm`, staged, not committed). `content/premium/README.md` explains where the package is and how to restore a local working copy.
- `.gitignore` ignores `content/premium/*.json`; `src/test/premium-not-tracked.test.ts` fails if any such file is tracked again.
- Scripts take the premium folder from `--dir` or `PREMIUM_DIR`, never from the repository; the Pages CMS premium form stays disabled.
- Tests that need the real library are owner-machine checks that skip visibly without `PREMIUM_DIR` (`docs/PREMIUM-INTEGRATION-TESTS.md`).
- Public marketing previews (teasers, never instructions), schemas and synthetic fixtures remain.

## Remediation options

| Option                             | What it does                                                                                                                                                                                                                                  | Trade-offs                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Make the repository private** | Stops new readers from seeing the old commits. Simplest. Reversible                                                                                                                                                                           | Does not recall copies already taken. GitHub keeps public forks public and detached. Effects to check before doing it: the Lovable project that syncs the repository must keep access (re-link may be needed); the owner's custom GPT that reads the repository loses public access; the public engineering audit trail (commit ids, tests) is no longer visible to outsiders; Actions minutes become metered by plan; Netlify's GitHub app needs private-repository access |
| **B. Rewrite history**             | `git filter-repo` removes `content/premium` from every commit, then force-push all branches. Then ask GitHub Support to purge cached views and pull-request refs, and tell anyone with a fork or clone to delete or re-clone                  | Breaks every existing commit id (for example `9c748d8`, `195d159`), so audit records, handoff documents and any worker references go stale. Destroys the audit trail unless it is documented first. Force-push to `main` needs explicit owner approval and coordination with Lovable and Netlify. Still does not remove copies already taken. Needs care that nothing else (docs, tests, fixtures) quoted premium text                                                      |
| **C. New clean public repository** | Create a NEW repository from a snapshot of the current tree (no premium text, fresh history), archive or privatize the old repository, and publish the audit record (commit ids, test results, this document) in the new repository's `docs/` | Keeps a public engineering audit workflow without rewriting history. Needs the Lovable project, Netlify site and the custom GPT re-linked to the new repository, and the old repository's links updated. Old commit ids stop being part of the live repository (they remain in the archived or private old one). If the old repository is left public and untouched, the exposure stays                                                                                     |
| **D. Accept the exposure**         | Do nothing beyond this removal and rely on refreshing or rewriting premium cards over time                                                                                                                                                    | Cheapest. The leaked text stays readable and copyable now; a buyer-value risk (anyone can read the paid steps free). Rewriting cards over time reduces but never closes it; the dishonest option is to tell buyers the library is private                                                                                                                                                                                                                                   |

### Recommendation

**Option C**, possibly combined with **option A applied to the old repository** (make the old one private or archive it right after the new one is live and linked). It restores a clean public repository and a public audit trail without rewriting history, and it avoids breaking commit ids that other documents cite. Option A alone is the fastest first step if the owner wants to stop new readers today while deciding. Option B only if the owner specifically needs the old repository to stay public and clean, accepting the audit-trail cost. Do not choose D without recording that decision.

### What needs the OWNER's separate approval

Nothing below has been done. Each is its own decision:

1. Changing the repository's visibility (option A), including the effects on Lovable and the custom GPT.
2. Rewriting history and force-pushing any branch, and any request to GitHub Support (option B).
3. Creating a new repository, moving the code, archiving or privatizing the old one, and publishing the audit record (option C).
4. Re-linking Lovable, Netlify and the custom GPT to a new or changed repository.
5. Telling people who may hold forks or clones, if any are known.
6. Accepting the exposure (option D), recorded with a date.

## Verification commands

```bash
git log --format='%h %ad %s' --date=iso -- content/premium          # the commits that touched the folder
git branch -r --contains 195d159                                    # remote branches that contain the first commit
git ls-files content/premium                                        # after removal: only README.md and .gitkeep
```
