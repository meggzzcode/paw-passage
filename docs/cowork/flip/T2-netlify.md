# T2: Netlify check (login: Megan, Netlify project `paws-passage-test`)

Confirm the signed-in Netlify account is Megan's and the project is `paws-passage-test` before starting (see README section 0). Read-only unless noted.

1. Usage and credits: open the project's or team's Usage/Billing page. Record: credits remaining, credits used, plan (free), the date credits reset, and any banner text (copy exactly). If there is a per-deploy or per-feature breakdown, copy the lines (type and credits).
2. Deploys list: open Deploys. Record how many deploys appear for the last 7 days, split into Production (branch `main`), Branch deploys (any branch, especially `claude/affiliate-setup` and `cowork/flip-tasks`), and Deploy Previews. For the latest 5 write: branch, context, status, time, and whether a credit cost is shown.
3. Settings read-only: Project configuration > Build & deploy > Branches and deploy contexts. Record exactly: production branch, whether Branch deploys are "None", "All" or "Let me add individual branches", and whether Deploy Previews are on. Do NOT change them. Tell Megan: if branch deploys are on, each push to a branch may be spending credits.
4. Domain and certificate: Domain management. Record the primary domain, the certificate status text for each domain (copy the warning exactly, e.g. "Certificate renewal incomplete"), certificate expiry date. **Do not click Renew or any DNS button unless Megan says "yes, renew the certificate" in this chat.** If she does: click only "Renew certificate" (or the equivalent named button) once, wait, and record the exact result message. If it fails, copy the error and the DNS records Netlify says are wrong, and stop.
5. Badge: look for any "Powered by Netlify" badge setting; write found/not found (do not change).

Result file: `results/T2-netlify-results.md` with the numbers above and PASS/FAIL/NEEDS LOGIN.
