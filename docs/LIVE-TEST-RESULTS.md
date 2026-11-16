# Live test results

*Filled in as each test is done. Evidence = a link, screenshot name or GitHub commit. Nothing here is verified until it has a Result and Evidence.*

Repository: existing (`meggzzcode/paw-passage`), branch `claude/cms-poc`. `main` must stay at `8f50649`.    Netlify address: _(not deployed yet)_    Date started: _(not started)_

| # | Test | Result (Pass / Fail / Not run) | Evidence | Notes |
|---|---|---|---|---|
| A1 | Netlify connects to the repo (branch `claude/cms-poc`) and the first deploy succeeds | Not run | | |
| A2 | Site checker on the live address: zero failures | Not run | | |
| A3 | A change made on GitHub deploys automatically, without Lovable | Not run | | |
| A4 | A bad edit fails the build, live site stays up, failure email arrives | Not run | | |
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
- Did `main` stay at `8f50649` throughout? _(not checked yet)_
- Does the free hosted plan support email-only collaborators? _(unknown; the Pages CMS site says it is "100% free" and lists "Invite users via email, no other account needed", but this has not been tried)_
- Does a collaborator need a GitHub account to sign in? _(unknown)_
- Does the rich-text editor preserve tables, citations and formatting? _(unknown)_
