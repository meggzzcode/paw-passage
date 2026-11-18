# Rollback procedure

Previous production commit before the 2026-11-18 launch batch: **de4c0b2** ("Remove the Vrbo button from stay cards; it stays on the listing page").
Launch batch merged to main as 4083230, followed by a small wording fix (see git log).

## Fastest: Netlify (no code needed, about 1 minute)
1. Open https://app.netlify.com, choose the project, then **Deploys**.
2. Find the last good deploy (the one built from de4c0b2) and open it.
3. Click **Publish deploy**. The live site switches back immediately. Netlify keeps the later deploys, so you can publish forward again.
4. Confirm: https://www.pawsandpassage.com loads, and https://www.pawsandpassage.com/gear returns 404 again (it did not exist before).

## Permanent: Git (keeps history, needs the repo)
```bash
git fetch origin
git checkout main
git revert -m 1 <merge-or-range>   # or: git revert 4083230..origin/main to revert the batch commit by commit
git push origin main
```
Do not rewrite or force-push main history. A revert commit is safe and redeploys automatically.

## After a rollback
Tell Claude what failed so the fix is made on the working branch and merged only after the checks pass.
