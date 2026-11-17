# Live test results

*Filled in as each test is done. Evidence = a link, screenshot name or GitHub commit. Nothing here is verified until it has a Result and Evidence.*

Repository: existing (`meggzzcode/paw-passage`), branch `claude/cms-poc`. `main` must stay at `8f50649`.    Netlify address: _(not deployed yet)_    Date started: 2026-11-17. Netlify project: `paws-passage-test` (deploys `claude/cms-poc`, auto-publish on), https://paws-passage-test.netlify.app (set to Private, so it needs a Netlify login; see A2).

| # | Test | Result (Pass / Fail / Not run) | Evidence | Notes |
|---|---|---|---|---|
| A1 | Netlify connects to the repo (branch `claude/cms-poc`) and the first deploy succeeds | **Pass** | Deployed `71bbcf8`, `npm run build` + `dist`, about 1 min (reported by tester) | Netlify defaults on `main` were `bun run build` / `dist/client`; choosing the CMS branch filled in the values from `netlify.toml`. |
| A2 | Site checker on the live address: zero failures | **Pass** | 2026-11-17, against https://paws-passage-test.netlify.app after it was made public: 196 checks passed, 0 failed; with the draft test (CMS test article exists only as a draft): 198 passed, 0 failed. Real-browser run (desktop and phone): 61 passed, 0 failed. | Draft article returns 404 and its text is in no served file. Image files are served with `cache-control: public,max-age=31536000,immutable`. HTTPS with HSTS. Sitemap returns 503 until a website address is set (expected). See the finding below. |
| A3 | A change made on GitHub deploys automatically, without Lovable | **Pass** | Commit `7172146` triggered a deploy by itself; live about 1 min later with an 18 s build; article showed "Last reviewed 2026-11-17" | Reported by tester; commits confirmed in GitHub history. |
| A4 | A bad edit fails the build, live site stays up, failure email arrives | **Partly passed** | Commit `590df80`: deploy failed ("Build script returned non-zero exit code: 2") with `Content problem in content/affiliates.yml: links > 0 > url: must be a full web address / must start with https://`. Live site stayed on the last good deploy. Restored by `7b164af`. | **The email part could not be tested: email notifications are a paid (Pro) feature on Netlify's free plan.** A failed build is silent unless someone looks at the Netlify Deploys page. See the handover. |
| B1 | Pages CMS signs in, installs, shows the four sections; plan / Pro messages recorded | Not run | | |
| B2 | Rich-text round trip: only one word changes | Not run | | |
| B3 | New article from the form; stays hidden as a draft | Not run | | |
| B4 | Published without approval: still hidden | Not run | | |
| B5 | Approved and published: goes live; back to draft: disappears | Not run | | |
| B6 | New verified stay appears, filters work, unverified stays hidden | Not run | | |
| B7 | Affiliate button appears only when the link is approved | Not run | | |
| B8 | Photo upload and replacement | Not run | | |
| B9 | Business settings change shows on the site | Not run | | |
| B10 | Email-only collaborator can sign in and edit; no paid plan needed | Not run | | |
| B11 | Different permission levels for editors vs approvers | Not run | | |

## Answers to the open questions (fill in)

- Which branch does Pages CMS commit to, and can `claude/cms-poc` be chosen? _(unknown)_
- Did `main` stay at `8f50649` throughout? **Yes** (checked after Part A by the tester and independently from GitHub).
- Decision (owner): failure alerts will NOT be set up by the seller; documented as an optional buyer upgrade.
- Netlify free plan: email deploy-failure notifications are a Pro feature; Slack is also locked. Free options: GitHub commit status, GitHub PR comments, HTTP POST (webhook).
- Netlify project visibility: new projects here defaulted to **Private** (visitors must sign in to Netlify), which blocks outside checks and is the wrong setting for a live public site.
- Does the free hosted plan support email-only collaborators? _(unknown; the Pages CMS site says it is "100% free" and lists "Invite users via email, no other account needed", but this has not been tried)_
- Does a collaborator need a GitHub account to sign in? _(unknown)_
- Does the rich-text editor preserve tables, citations and formatting? _(unknown)_

## Finding from the live run: React error #418 on Netlify's free plan (fixed)

- **What happened.** The first real-browser run against the live site showed a React "hydration" error (#418) on every page (18 of 61 checks failed). Everything still worked, because React rebuilt the page in the browser, but it is wasted work and a console error on every visit. It never appeared in the local imitation of Netlify.
- **Cause.** Netlify's free plan adds an HTML comment and a blank line to the top of every page's `<head>` (a "this site is hosted on Netlify" note), and a small `hud` script after `</html>`. React treats the extra head content as a mismatch. Proven by injecting each piece separately: the comment was the trigger, the script was harmless.
- **Fix** (commit `9aa38a5`, `src/routes/__root.tsx`): a one-line script at the end of `<head>` removes comments and blank text from the head before React starts. Verified: all four injection scenarios load without errors, and after Netlify rebuilt, the live site passed 61 of 61.
- **For the buyer.** If the site moves to a paid Netlify plan or another host, the script is harmless and can stay.
- **Visitor access.** The test project was switched from Private to Public (Project configuration > General > Visitor access). A new project defaulting to Private makes the whole site ask for a Netlify login.
