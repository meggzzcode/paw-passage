# Live test runbook: Netlify + Pages CMS + GitHub

*Purpose: finish the verification that `BUYER_HANDOVER.md` (section 5) says has not been done. Nothing here changes the live site, buys anything, or touches `main`.*

**Who does what.** Claude cannot sign in to your Netlify, GitHub or Pages CMS accounts. You do the clicking; Claude prepares everything, then checks each result from the outside (running the site checker against your Netlify address and reading the GitHub history). Record every result in `docs/LIVE-TEST-RESULTS.md`.

**Cost.** Everything below is free: a GitHub repository, Netlify's free plan and Pages CMS's hosted app. Stop and ask before clicking anything that mentions a price, a trial or "upgrade".

## The setup: the existing repository, the CMS branch only

The tests use the **existing repository** (`meggzzcode/paw-passage`) but only its **`claude/cms-poc` branch**. The real site code on `main` must not change until the tests pass and you approve the merge.

- **Netlify** can build from any branch you choose, so we tell it that `claude/cms-poc` is the "production branch" for this test project.
- **Lovable** only syncs the default branch (`main`), so it ignores `claude/cms-poc`.
- **Pages CMS** reads its settings file "per repository and per branch" according to its docs, so it should be able to open this branch. This has not been confirmed. **If Pages CMS offers no way to choose or switch to `claude/cms-poc`, stop and tell Claude. Do not edit anything.** The fallback is a separate test repository.

**One real risk.** On GitHub's free plan, a private repository cannot lock `main` against changes. So a mistake in Pages CMS (saving while it is pointed at `main`) could write to `main`. To manage this:
1. Before every save in Pages CMS, look at which branch it shows. It must say `claude/cms-poc`.
2. Claude checks that `main` is still at commit `8f50649` after each test (`git ls-remote origin refs/heads/main`). If it ever moves, the test stops and Claude reports it.
3. `main` has nothing to edit in Pages CMS anyway (it has no `.pages.yml` or `content` folder yet), so a save there would fail rather than overwrite anything. Still, check.

## Part 0: before you start (2 minutes)

1. Open the repository on GitHub and confirm the branch `claude/cms-poc` exists and its latest commit is the one Claude names in chat.
2. Make sure you are signed in to GitHub as the owner of that repository.

## Part A: Netlify (does GitHub deploy the site without Lovable?)

**A1. Connect.** Sign in to Netlify (a free account is fine; signing in with GitHub is simplest). Add a new project, import an existing project from GitHub, and authorise Netlify for **this one repository only** (not all your repositories). When it asks for the branch to deploy, choose **`claude/cms-poc`**. (If it only offers `main`, finish the import, then open Project configuration > Build & deploy > Branches and set the **production branch** to `claude/cms-poc` before the first real deploy.) Netlify should read `netlify.toml` and fill in the build command (`npm run build`) and publish folder (`dist`) by itself. If it shows different values, do not change them: send Claude a screenshot. Press Deploy.
- *Pass:* the first deploy finishes and the site opens at a `something.netlify.app` address.
- *Send Claude:* the address, and a screenshot of the deploy log if it failed.

**A2. Claude runs the site checker** against that address (about 200 checks: readable page text, every article, real 404s, images, sitemap, drafts hidden).
- *Pass:* zero failures, apart from at most one check about image caching (see the handover; a developer can fix that).

**A3. Automatic publishing without Lovable.** On GitHub, **switch to the `claude/cms-poc` branch** (top-left branch menu), open `content/guides/how-vacation-rental-pet-fees-work.md`, click the pencil, change `lastReviewed: 2026-11-16` to `lastReviewed: 2026-11-17`, and commit directly to **`claude/cms-poc`** (not `main`).
- *Pass:* within a few minutes Netlify starts a new deploy **by itself**, and the live article now says "Reviewed 2026-11-17". Nobody opened Lovable, Claude or a command line.

**A4. A mistake does not break the live site.** On GitHub, edit `content/affiliates.yml` and replace the file's contents with:
```
links:
  - id: oops
    network: Test
    url: not-a-link
```
Commit to **`claude/cms-poc`** (not `main`).
- *Pass:* the Netlify deploy **fails**, the log names `content/affiliates.yml` and the `url` field in plain words, the live site is still the previous version, and Netlify sends a failure email (turn on deploy notifications first). Then restore the file (`links: []`) and confirm the next deploy succeeds.

**A5. Private previews (optional).** Not needed for the buyer workflow; skip unless you want drafts previewable.

## Part B: Pages CMS (can a non-developer do the real work?)

**B1. Connect.** Go to app.pagescms.org, sign in with GitHub, and install the Pages CMS GitHub App on **this one repository only** (choose "Only select repositories"). Open the repository and **choose the branch `claude/cms-poc`** (look for a branch picker or a branch name near the top). If there is no way to do this, stop.
- Note and screenshot: which branch it shows or lets you pick, and **any message about plans, "Pro", limits or upgrading** (this answers the free-plan question).
- *Pass:* you see four sections: **Articles, Stays, Affiliate links, Business settings**.

**B2. Rich-text round trip (the one most likely to need a fix).** Open the article **"CMS TEST - rich text round trip"**. It contains a table, bold and italic text, links, two source citations like `[[1]](https://example.com/one)`, nested bullets, a numbered list, a tick-box list and a quote. Change **exactly one word** in the last sentence ("ONE") and save. Do not touch anything else.
- *Claude checks* the commit on GitHub. *Pass:* only that one word differs. *Fail:* if the table, citations, tick boxes or anything else changed, the editor is damaging articles. **Result on 2026-11-17: the visual editor turned tick boxes into plain bullets**, so the body now uses the plain Markdown editor (`type: code`, `format: markdown`). Repeat this test with the plain editor.
- Also record: who the commit is attributed to, the commit message, and which branch it went to.

**B3. Create a brand-new article from scratch using only the form.** Articles > New. Fill in the form as a first-time buyer would, with a made-up article about anything. Keep Status on *Draft*. Save.
- Record **every field that confused you or was hard to fill**, and how long it took. This tells us whether the form needs simplifying for a buyer.
- *Pass:* a new file appears in GitHub, the build still succeeds, and the live site does **not** show the article (its address shows "404"). Claude confirms with the site checker's draft check.

**B4. Saving is not publishing.** Change the new article to Status *Published* but leave *Approved by* empty. Save.
- *Pass:* after the rebuild, the article is **still not live**. (The build log says it stays a draft.)

**B5. Approve and publish.** Fill in *Approved by* (a name) and *Approved on* (today), tick **Fact-checking finished**, and make sure *Claims still unchecked* and *Open follow-ups* are empty. Save.
- *Pass:* after the rebuild the article is live, appears in the guides list, has the right title, and has a correct address in the sitemap (set a test website address in Business settings first, or skip the sitemap check).
- Then set it back to *Draft*. *Pass:* it disappears after the next rebuild.

**B6. Stays.** Stays > New. Make a verified test stay with a pet fee, a fenced yard and some boxes left on *not-confirmed*. Use the built-in photo list. Save.
- *Pass:* after the rebuild it appears on the Stays page, filters work (for example "fenced yard"), "not confirmed" shows where you left things unknown, and a stay marked *Unverified* does not appear.

**B7. Affiliate links.** Affiliate links > add a link (`https://example.com/test`) used by your test stay's *Booking link*, with **Approved** unticked. Then tick it.
- *Pass:* no Book button while unticked; a Book button appears after ticking, and it opens the link in a new tab.

**B8. Photos.** In your test article, upload a photo (landscape, about 1600 px wide).
- *Pass:* it appears at the top of the article, and the file shows up in `public/uploads/` on GitHub. Record any trouble finding or replacing it.

**B9. Business settings.** Change the business email to a test address, save, and confirm it appears on the Contact page after the rebuild. Change it back.

**B10. Collaborator without GitHub.** In Pages CMS, invite a **second email address** as a collaborator (use one that has no GitHub account if you have one). Ask that person to accept and sign in.
- Record: could they sign in **without** a GitHub account? Could they edit and save? Did any screen mention a paid plan?
- *This answers the "does email-only access need Pro?" question for real.*

**B11. Who approves?** Note whether two different people can be given different powers. (The documentation lists granular permissions as "coming soon".) If not, "Approved by" is an honour-system field, and the handover should say so.

## Decision rules

| Result | What it means |
|---|---|
| A1-A4 pass | GitHub to Netlify publishing works without Lovable. |
| B2 fails, fallback passes | Use the plain-text editor for article bodies. |
| B2 fails on both | Stop. Pages CMS is not safe for articles; look at the alternatives in the evaluation. |
| B3 takes a buyer more than ~20 minutes or the form is confusing | Simplify the form before migrating the rest. |
| B10 requires GitHub or a paid plan | Update the handover: buyers' helpers need GitHub accounts (free), or consider the self-hosted option. |
| Pages CMS cannot open `claude/cms-poc` | Stop. Use a separate private test repository holding a copy of the CMS branch, and repeat Part B there. |
| Everything passes | Merge the CMS branch (with your approval) and migrate the remaining content (`docs/MIGRATION-PLAN.md`). |

## After the tests

Claude fills in `docs/LIVE-TEST-RESULTS.md` from your reports and from the GitHub history, then updates `BUYER_HANDOVER.md` so that every "not yet verified" row either becomes "verified" with evidence or stays open with the reason. Only then does the migration of the remaining 15 articles and other content start.
