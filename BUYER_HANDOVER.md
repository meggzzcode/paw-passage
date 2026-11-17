# Paws & Passage: buyer handover guide

*Written 2026-11-16. Read the "What has and has not been verified" section first. Nothing in this guide has been tried on live Netlify, Namecheap, GitHub or Pages CMS accounts yet.*

## 1. What you are buying

Paws & Passage is a dog-friendly travel website: researched articles, planning tools (a checklist, a cost calculator, a question writer) and a directory of verified places to stay. It earns money from affiliate links (a commission when a visitor books or buys through your link). It has **no database, no logins and no server you have to look after**. Everything on the site is plain files stored in GitHub.

The plan is that you can run it day to day without a developer:

| Job | Where you do it | Needs a developer? |
|---|---|---|
| Write or edit an article | Pages CMS (a web form) | No |
| Add or update a place to stay | Pages CMS | No |
| Change affiliate links | Pages CMS | No |
| Change your email address, website address, Google Analytics ID, newsletter form | Pages CMS | No |
| Replace a photo | Pages CMS (upload) | No |
| Change the design, add a new kind of page, add a new tool | Code | Yes |
| Update software when security notices arrive | Code | Yes, now and then |

**Not everything is in Pages CMS yet.** Only one sample article, one sample stay, your affiliate links and your business settings are set up so far. The other 15 articles, the towns, the product lists and the legal pages are still code files. Section 8 lists exactly what is left and `docs/MIGRATION-PLAN.md` explains how it gets done.

## 2. The five services, and who owns what

| Service | What it does | Cost | You need |
|---|---|---|---|
| **Namecheap** | Owns the website address (domain) and runs the business email (Private Email) | Yearly domain fee plus an email subscription | A Namecheap account |
| **Netlify** | Hosts the website and rebuilds it automatically when content changes | Has a free plan (usage limits apply; see section 8) | A Netlify account |
| **GitHub** | Stores the website's files and every change ever made | Free | A GitHub account |
| **Pages CMS** | The friendly web form for editing content | Free, per its own site | Your GitHub login |
| **Lovable** | Optional tool for a developer to change the design. **Not needed to publish.** | Not needed | Nothing |

There is no custom database or backend, and Hostinger is not used.

## 3. How publishing works

1. You edit something in Pages CMS and save.
2. Pages CMS saves your change into GitHub.
3. Netlify notices the change, rebuilds the site, and publishes it. This usually takes a few minutes.
4. If the rebuild fails, Netlify keeps showing the previous version of the site, so visitors never see a broken page. **On Netlify's free plan you are not emailed about a failed build** (email alerts are a paid feature; tested 2026-11-17). So after saving a change, wait about three minutes and check that it appeared. If it did not, open Netlify's **Deploys** page: a failed build shows there with a plain message naming the file and the field to fix. Optional free alert: Netlify can post a pass/fail mark on each GitHub commit (see section 6, step 4).

### Saving is not publishing

An article is public only when **all** of these are true:
- Status is **Published**
- **Approved by** has a name and **Approved on** has a date
- **Fact-checking finished** is ticked
- **Claims still unchecked** is empty

Anything else stays a draft. A draft is not just hidden: its text is left out of the website's code entirely, so nobody can read it by looking behind the scenes. (This was tested; see section 7.) Stays work the same way: only **Verified** stays appear. Samples never do.

If an editor saves a half-finished draft, the build skips it and carries on. If someone saves a **published** article with a mistake in it, the build stops with a plain message naming the file and the field, and the live site stays as it was.

## 4. Everyday jobs (once Pages CMS is connected)

**Write an article.** Pages CMS > Articles > New. Keep Status on *Draft* while writing. Fill in the title, summary, text, sources and the "Research notes". When it is ready and checked, ask the person who approves to type their name and today's date in *Approved by / Approved on*, tick fact-checking finished, and set Status to *Published*. It goes live after the next rebuild.

**Add a place to stay.** Pages CMS > Stays > New. Only fill in what the host has confirmed. Leave unknown boxes as **not-confirmed** (the site then says "Not confirmed"; it never guesses). Set Status to *Verified* and fill in the date the host confirmed the details. Use a photo only if you have the owner's permission.

**Add an affiliate link.** Pages CMS > Affiliate links. Add the link, then tick **Approved** only after the company has approved your account. A Book or Buy button appears on the site only for approved links.

**Change your business details.** Pages CMS > Business settings: email address, website address, Google Analytics ID (looks like `G-XXXXXXXXXX`) and the newsletter form address. Anything left empty shows an honest "coming soon" message instead of a broken link.

**Replace a photo.** Upload a new one in the article or stay form. Use a landscape photo about 1600 pixels wide and under 400 KB, and only one you have the right to use. The site's current photos are free-to-use Unsplash photos (credits are in `src/content/image-credits.ts`); the large picture at the top of the home page is an AI-generated illustration.

## 5. What has and has not been verified

### Tested (on 2026-11-16, in a test setup that imitates Netlify; not on Netlify itself)

- **A fresh start works.** A brand-new copy of the code from GitHub installs, passes its 155 automatic tests and builds, using only what is in the repository. It needs no Lovable account and none of the previous owner's personal accounts. (A first attempt failed because a lock file was out of date. That was found, fixed, and a check now guards against it.)
- **Netlify's own command-line tool** (a local imitation of Netlify's servers) built and ran the site: 216 automatic checks passed. These cover readable page text for search engines, every article, real "404 not found" pages for unknown addresses, correct canonical addresses and sitemap for a configured domain, images, scripts and fonts loading, and no empty pages.
- **61 real-browser checks passed** on a desktop and a phone-sized screen: no errors, every image loaded, no sideways scrolling, and the checklist (it remembers ticks), cost calculator and question writer all work.
- **Search and filters:** 9 checks passed (fenced yard, number of dogs, no pet fee, text search, and that "not confirmed" is never treated as "yes").
- **Editing by file:** changing a pet fee, an article title, a status, an affiliate link, a photo or a business setting in the content files changed the site as expected. Mistakes produced plain-English messages.
- **Drafts do not leak.** Drafts, unapproved articles and sample stays are absent from every file a visitor can download, and their addresses return "404". (An earlier version leaked draft text inside the site's downloadable JavaScript. That was found and fixed.)
- **An independent reviewer tried to break the safeguards** and found real problems (a duplicate web address crashing the site, unsafe text in articles, private notes shipped in public code). All were fixed and now have automatic tests.
- The article that was moved into the new format looks **identical** to before: 7 pages compared character by character.

### NOT yet verified (needs your accounts; steps in section 6)

| Not verified | Why |
|---|---|
| ~~A real deploy on Netlify and automatic rebuild when GitHub changes~~ | **Now tested (2026-11-17):** a real deploy worked, a GitHub change published itself in about a minute, and a deliberately bad edit failed the build while the live site stayed up. See `docs/LIVE-TEST-RESULTS.md`. Still open: the full site checker (the test project is set to Private, which blocks outside checks) and failure emails (a paid Netlify feature). |
| Pages CMS itself: signing in, installing its GitHub App, the editing forms, saving | Needs your GitHub login. The form file (`.pages.yml`) was written from Pages CMS's documentation and checked by tests, but never opened in the real app. |
| Whether Pages CMS saves straight to the main branch or can use branches / pull requests | The documentation does not say. The "Approved by" safeguard works either way. |
| Whether a collaborator with no GitHub account can sign in to Pages CMS | Not stated in the documentation. |
| Rich-text editor round trip: whether saving an article in Pages CMS keeps tables and the `[[1]](link)` source links intact | Must be tried once (section 6). |
| Long-term image caching on Netlify | The local imitation ignores Netlify's headers file. Check after the first deploy (section 6). |
| HTTPS certificate, DNS, domain transfer, Private Email transfer, GitHub and Netlify ownership transfer | Written from the companies' published instructions only: see `docs/DNS-AND-TRANSFER.md`. |
| Google Analytics, the newsletter form, affiliate programs | Not set up yet. |

**Do not treat the handover as complete until section 6 has been done and every box ticked.**

## 6. First-time setup and the tests that finish the verification

Do these in order. Each step says what "working" looks like.

1. **GitHub.** Make sure the repository is under the account that will own the business. Create a free GitHub account for the buyer when the time comes (transfer steps: `docs/DNS-AND-TRANSFER.md`, section 6c).
2. **Netlify.** New project > import from GitHub > pick the repository and the `main` branch. Netlify reads `netlify.toml` itself. *Working:* the first deploy succeeds and the site opens at a `.netlify.app` address.
3. **Run the site checker** against that address (needs only Node 22):
   `node scripts/verify-site.mjs https://YOUR-NAME.netlify.app`
   *Working:* it ends with "0 failed". It will report one failed check about image caching if Netlify is not applying the headers file; if so, tell a developer.
4. **Failure alerts.** Email alerts are not available on Netlify's free plan. Either accept that you check the Deploys page after a change, or add the free "GitHub commit status" notification in Netlify so each commit in GitHub shows a pass or fail mark. (It posts statuses on the repository's commits.)
5. **Pages CMS.** Open app.pagescms.org, sign in with GitHub, install its GitHub App on the repository, and open the project. *Working:* you see Articles, Stays, Affiliate links and Business settings.
6. **Harmless edit test.** Change the "Last checked on" date of the sample article, save, then look in GitHub for a new entry in the history. *Working:* a commit appears, Netlify starts a build, and a few minutes later the live article shows the new date. Write down which branch the commit went to.
7. **Rich-text test.** Open an article, change one word, save, and in GitHub look at what changed. *Working:* only that word changed. *Not working:* if tables or the source links changed, stop and ask a developer to switch that field to the plain-text editor.
8. **Draft test.** Create a new article, leave it on *Draft*, save. *Working:* it does not appear on the live site, and its address shows "404".
9. **Unapproved test.** Set Status to *Published* but leave *Approved by* empty. *Working:* still not on the live site.
10. **Mistake test.** Put the wrong text in a link (for example `abc`) in the Affiliate links form and save. *Working:* the Netlify build fails with a message naming the field, and the live site keeps working. (Tested on 2026-11-17.) Fix it and save again.
11. **Collaborator test.** Invite a second person by email in Pages CMS. *Working:* they can sign in and edit. Note whether they needed a GitHub account.
12. **Set the real details** in Business settings (website address, email, Google Analytics ID), then re-run the site checker with `--site-url https://yourdomain.com` to check canonical addresses and the sitemap.

## 7. Taking over each account

The detailed, step-by-step instructions are in **`docs/DNS-AND-TRANSFER.md`**. In short:

- **Namecheap domain:** moved account-to-account with Namecheap's "Change Ownership". It is free, the website and email keep working, and the domain's privacy and DNS add-ons move with it.
- **Private Email:** the subscription is **not** moved with the domain. Namecheap's published route is a support-assisted transfer; the fallback is a new subscription plus copying the mail across. Fees, downtime and password handover are **not confirmed**: ask Namecheap support before the sale.
- **GitHub:** the owner transfers the repository to the buyer's account.
- **Netlify:** the project is transferred to a team the buyer owns, then the connection to GitHub, the domain and HTTPS are checked.
- **Pages CMS:** the buyer signs in with GitHub and installs the Pages CMS GitHub App on the repository.
- **Affiliate programs:** these accounts belong to the person who applied. The buyer will probably need to apply themselves and replace every link.

**Never change the nameservers.** Keep DNS at Namecheap so the email records are never touched.

## 8. Remaining transfer risks (most important first)

1. **Most content is not editable in Pages CMS yet.** 15 articles, the towns, the gear product lists and the legal pages are code. Until `docs/MIGRATION-PLAN.md` is carried out, editing them needs a developer.
2. **Only the Netlify part has been tested on a real account** (2026-11-17). Pages CMS, Namecheap and the ownership transfers have not. The most important unknown is the real Pages CMS editing forms.
3. **Private Email cannot be pushed with the domain.** Plan this early; fees and downtime are unconfirmed.
4. **A hidden build dependency on Lovable's published configuration package** (`@lovable.dev/vite-tanstack-config`, version-pinned, from the public npm registry). It installs fine today. If Lovable ever withdrew it, a fresh install would fail. A developer can replace it with a standard configuration. The code also has a harmless error-reporting hook for Lovable's editor that does nothing without it.
5. **Two package lists in the repository** (`package-lock.json` for Netlify, `bun.lock` for Lovable). They can drift apart; the automatic GitHub check now fails if they do.
6. **Pages CMS is a free service run by a small open-source project** with no stated guarantee. Your content stays in GitHub, so you could switch tools, but the forms would need rebuilding. It can also be self-hosted (needs its own database).
7. **Draft preview links are public.** Private preview deploys (set up in `netlify.toml`) show drafts to anyone who has the link, and are not password protected on a free plan. They tell search engines to stay away.
8. **Netlify free plan limits and terms.** Usage limits apply, and whether commercial use is allowed on the free plan is not confirmed: read Netlify's current terms.
9. **Affiliate programs must be re-applied for** by the buyer, and Amazon requires its exact disclosure sentence wherever its links appear (the site adds it automatically).
10. **The legal pages (privacy, terms, affiliate disclosure) are drafts** and have not had a lawyer's review. Do that before launch and after any change of owner.
11. **The site loads fonts from Google Fonts**, and Google Analytics only once an ID is entered. The privacy page should say so.
12. **Photos:** stock photos are free-to-use under the Unsplash licence; the home page picture is AI-generated. Any photo of a real rental needs the owner's written permission.
13. **No failure emails on Netlify's free plan, and new projects may default to Private.** A failed build is silent unless someone looks at the Deploys page. A project set to Private makes the website ask visitors to sign in to Netlify: a live site must be set to public. Check this on day one.
14. **Domain basics:** keep auto-renew on, keep the Namecheap sign-in and recovery email under the buyer's control, and check whether changing the owner's contact details triggers a transfer lock (the sources conflict).

## 9. Where things live (for a developer)

| What | Where |
|---|---|
| Articles | `content/guides/*.md` (one converted so far; the rest are `src/content/guides/*.ts`) |
| Stays | `content/stays/*.yml` |
| Affiliate links | `content/affiliates.yml` |
| Business settings | `content/settings.yml` |
| Photos you upload | `public/uploads/` |
| The Pages CMS forms | `.pages.yml` |
| Content checks and "unpublished stays out" step | `plugins/content.ts`, `src/content/schema.ts`, `src/content/publish-rule.ts` |
| Netlify settings | `netlify.toml` |
| Check a live site | `node scripts/verify-site.mjs <address>` |
| Tests | `npx vitest run` (155 tests) |
| Developer handbook (older; mentions Hostinger as an alternative host) | `HANDOVER.md` |
