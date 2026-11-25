# Cowork task C0: read-only account preflight (paste this to Cowork)

Paws & Passage (https://www.pawsandpassage.com, repo https://github.com/meggzzcode/paw-passage, branch main). READ ONLY. Use my already signed-in browser sessions for Netlify, GitHub (Pages CMS) and Namecheap. Do not deploy, save, change, buy, renew, transfer or contact support. Never type or read passwords or codes. If you hit a login wall, CAPTCHA or security prompt, stop that item, write `UNAVAILABLE: <exact message>`, and move on. Write UNVERIFIED for anything you did not see. Keep screenshots private (not in the repo) and leave out account emails, IDs and billing details from your report.

## A. Netlify (project paws-passage-test)
1. Confirm it is the right project; record its name.
2. Deploys: current published deploy (commit hash, message, time); note any Skipped or Canceled deploys.
3. Are builds paused or stopped (Site configuration > Build & deploy > Continuous deployment)? Do NOT turn them on. Do NOT click Deploy or Trigger deploy.
4. Billing/Usage: plan, monthly credits, credits used, credits remaining, reset date. I think about 65 remain and a production deploy costs about 15: confirm or correct. Note any cost or limit that affects one production deploy.
5. Build settings: build command (expected `npm run build`), publish directory (expected `dist`), production branch (expected `main`).
6. Domain management: primary domain, whether the apex redirects to www, whether HTTPS is active.

## B. Pages CMS (https://app.pagescms.org, my existing GitHub session): forms only, NO saves
1. Open the repo and the `main` branch. Expected sidebar: Articles, Stays, Places, Affiliate links, Products, Packing planner, Business settings. If it is empty or shows a configuration error, record the exact message and stop this section.
2. Business settings: one form, no create/delete buttons; fields for the Amazon tracking ID, GA4, Impact and the stay directory mode render. Close without saving.
3. Articles: open one published guide; check Status, Approved by/on, FAQs, Sources, Research block and a plain Markdown body.
4. Products: open one product; fields render. If you type to test editability, do NOT save; discard.
5. Packing planner: open Items, open one item. Large form: category, trip types and conditions show real names, the condition selects list nine conditions, the new fields "Gear category" and "Gear collection" (trip types) render, a nested product list opens. Record any field that is empty or crashes.
6. Affiliate links: form loads and selectors render. Do not edit.
7. Record whether Pages CMS accepts `.pages.yml` as it is and whether the large Products and Packing forms render. No saves, uploads or commits at any point. The edit/save/publish loop stays UNVERIFIED.

## C. Namecheap (pawsandpassage.com)
1. Registration date (expected 2026-11-16), expiry (expected 2027-11-17), auto-renew (I believe OFF), renewal price shown, Domain Lock state, domain privacy, registrant is the seller or not.
2. Account-ownership transfer options offered (change of ownership/push inside Namecheap, or auth-code transfer to another registrar).
3. Any recent-registration or recent-transfer restriction that applies NOW: read the actual text, do not assume the usual 60-day rule.
4. DNS and email records exist (note them; never delete).

## Report back (one table)
Columns: Check | Result | Evidence (private screenshot name) | Blocker (yes/no) | Recommended next action. One row per numbered check above. Blocker means: wrong project; credits cannot cover one deploy; CMS configuration error or a form does not render; domain expired, or locked/restricted in a way that blocks the transfer plan. Then STOP: do nothing else (no deploy, no live-site checks) until I say so.
