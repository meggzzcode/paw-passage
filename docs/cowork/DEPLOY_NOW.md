# Cowork task: one production deploy (owner approved 2026-11-25)

The owner approved ONE production deploy of the current `main` (commit `df6a719` or later; check the latest commit on GitHub `meggzzcode/paw-passage`, branch `main`). Use the owner's already signed-in Netlify account (project `paws-passage-test`, free plan). Do not change DNS, plan, billing, environment variables, domains or any other setting. Never enter passwords or codes; stop at any login wall or security prompt and report BLOCKED.

1. Open Netlify > the project > Deploys. Note the current published deploy (commit hash and date) and the remaining credits shown.
2. Builds are currently stopped. Resume automatic builds (Site configuration > Build & deploy > Continuous deployment > Build settings > set builds to active) ONLY if that is how they were stopped. Then trigger exactly one deploy of `main` (Deploys > Trigger deploy > Deploy site). Do not trigger a second deploy.
3. Wait for the build to finish. Record: status (Published or Failed), commit hash, build duration, credits used. If it fails, copy the last 30 lines of the build log (no secrets) and STOP; do not retry more than once without the owner.
4. After it publishes, if the owner wants builds off again to save credits, set them back to stopped and record that. Ask the owner first if unsure.
5. Report: published commit, time, credits before and after. Do not run the QA checks yourself in this task; Claude will verify the live site.
