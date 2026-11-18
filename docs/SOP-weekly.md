# SOP: weekly (about 20 minutes)

Automations that run for you: the **Site health** workflow (Mondays 06:17 UTC: tests, live sitemap page check, content freshness) and **Dependabot** pull requests (Mondays, at most 3 npm and 2 Actions pull requests, grouped). GitHub emails the owner when they open an issue or a pull request.

1. Open GitHub > Issues, label `site-health`. If "Site health: broken or missing pages" is open, open each listed page; a 403 or 429 entry is a robot block, not a broken page. Fix real 404s (usually a changed address in a guide).
2. If "Site health: content overdue for a re-check" is open, plan the re-check (see SOP-monthly).
3. GitHub > Pull requests: for each Dependabot pull request, merge it only when the CI check is green; otherwise leave it and note it. Never merge on a red check.
4. Glance at GA4 Reports > Realtime or the last 7 days to confirm data still arrives (see `docs/ANALYTICS-SETUP.md`). No data for several days is a problem to look at.
5. Pinterest: pin the next guide(s) from `docs/PINTEREST-SETUP.md`, with the utm parameters.
6. Check the inbox of hello@pawsandpassage.com (the only business address) for program or partner messages.

## Build-failure notification (NEEDS-YOU, once)
- GitHub: profile photo > Settings > Notifications. Under "Actions" keep "Send notifications for failed workflows" on (this is the default; wording SUSPECTED). Failed CI or health runs then email you. Also use Watch > Custom > Issues and Pull requests on the repository.
- Netlify: the free plan gives no build-failure email (`docs/OPERATIONS-HANDBOOK.md`); notification settings are under Project configuration > Notifications (SUSPECTED, check on screen; the paid plan may be required). Without it, GitHub's CI result is your early warning, since CI runs the same `npm run build`. Also open the live site after any merge.
- Confirm: ask GitHub to rerun a harmless workflow ("Site health" > Run workflow) and check the issue or email arrives.
