# Owner walkthrough: the 13 actions, in order of business impact

Written 2026-11-18. Source checklist: `docs/recovery/FINAL-REPORT.md` section 12. Help pages named below were read on **2026-11-18**. Labels: VERIFIED = the menu path appears on the official page named; SUSPECTED = I could not confirm it on an official page, so look for the nearest equivalent on screen. Nothing here has been done for you. Nothing here costs money unless it says so.

## Rules that apply to every step

- **Only you** type passwords, 2FA codes, recovery codes, SSN or tax ID, bank or PayPal details, payment cards, and Namecheap Support PINs. The assistant and Cowork never do, and never see them. Do not paste them into chat or into any file in the repo.
- Stop and look yourself if a screen shows a CAPTCHA, a warning, an unexpected "authorize" request, or anything that asks for money.
- Do not accept any agreement or buy anything while a Cowork prompt is running. You accept agreements yourself.
- Do the merge/deploy first (checklist item 1 in the report). Steps 2, 3, 6 and 7 assume the new pages are live at https://www.pawsandpassage.com.
- "Send back" = what to reply to the assistant. Never include secrets.
- Cowork prompts live in `docs/cowork/` (one file per step). GitHub 2FA (step 8) is never given to Cowork.

## Summary table

| # | Action | Time | Cost | Required? | Cowork prompt |
|---|---|---|---|---|---|
| 1 | Netlify: plan, badge, credits, notifications | 15 min | $0 | Plan check recommended; badge optional | docs/cowork/01-netlify-check.md |
| 2 | Search Console: verify, sitemap, request indexing | 30 min, then a few days | $0 | Required | docs/cowork/02-search-console.md |
| 3 | GA4: dimensions, key events, Realtime, GTM question | 25 min | $0 | Required for conversion reporting | docs/cowork/03-ga4-setup.md |
| 4 | Bing Webmaster Tools | 10 min | $0 | Optional | docs/cowork/04-bing-import.md |
| 5 | Pinterest: claim site, then pins | 30 min + 15 min after the tag is added | $0 | Required for Pinterest analytics | docs/cowork/05-pinterest-claim-and-pins.md |
| 6 | Impact: verify property, Chewy decline reason | 20 min | $0 | Required before any Chewy reapply | none (account and support text) |
| 7 | Affiliate applications | 20 to 40 min each | $0 | Optional, needed for revenue | none (tax, bank, SSN, agreements) |
| 8 | GitHub security | 20 min | $0 | 2FA required; rest optional | none: owner only |
| 9 | Namecheap renewal and auto-renew | 15 min | $0 now | Required | none (billing) |
| 10 | Costs and the Lovable decision | 10 min | $0 | Your decision | none |
| 11 | Pages CMS test edit | 10 min | $0 | Required before branch rules | none |
| 12 | Two centerforpetsafety.org links | 5 min | $0 | Optional | none |
| 13 | Email decisions | 10 min | $0 | Decision | none |

---

## 1. Netlify: plan, "Powered by Netlify" badge, credits, notifications

**Why first:** a visible Netlify badge on every page, an unknown plan, and a hard 300-credit monthly cap that can pause the site are the quickest things to fix or understand, and an affiliate reviewer looks at the site.

**URL:** https://app.netlify.com

**A. Plan and credits.**
1. Click your team name (top left) then **Usage & billing > Plan details**. Direct form: `https://app.netlify.com/teams/{team_name}/billing/general#plan-details` (VERIFIED, https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ , read 2026-11-18; you must be Team Owner).
2. Write down the plan name (Free, Personal, Pro) and whether monthly **credits** are listed (credit-based) or "usage packages" appear (legacy plan). Accounts created on or after 2025-09-04 are credit-based.
3. Where credit usage is shown: the page I read does not say. Look on the same Usage & billing area for a usage or credits view (SUSPECTED path).
4. Oddity to report: the live site's Netlify script says `data-account-tier="personal"` but our records say Free (docs/NETLIFY-BADGE.md). Tell the assistant what you actually see.
- Leave alone: any "Upgrade" or "Change plan" button.
- Why credits matter (docs/COSTS-AND-ACCOUNTS.md 1a): Free = 300 credits a month, 15 per successful production deploy, so about 20 deploys exhaust it, and then the site is paused. Every Pages CMS save is a production deploy: batch your edits.

**B. Badge.**
1. Open the site (project), then **Project configuration > General > Powered by Netlify badge** (VERIFIED, https://docs.netlify.com/manage/projects/powered-by-netlify-badge/ , read 2026-11-18). The page does not quote the toggle label.
2. Switch it **off** and **Save**. Takes effect on the next request; no redeploy.
3. If the setting is **locked**, Netlify says upgrading to Personal or Pro unlocks it. Personal is $9 a month ($108 a year). **Do not upgrade now**; tell the assistant it is locked.
- Leave alone: all other General settings, the site name and domain settings.
- Confirm: open https://www.pawsandpassage.com in a private window; no dark "Powered by Netlify" pill bottom right. (A visitor's own "Hide this badge" is remembered per browser, so use a clean window.)

**C. Build-failure notifications.**
1. **Project configuration > Notifications > Deploy notifications > Add notification** (VERIFIED, https://docs.netlify.com/deploy/deploy-notifications/ , read 2026-11-18).
2. The page says GitHub commit statuses, pull request comments and commit checks are added by default to new GitHub-connected sites, and **Email is Pro and Enterprise only**. So do not choose Email on Free. Check that a GitHub commit status entry exists for deploy failed; if it is missing, add it. Slack and HTTP POST also exist.
- Confirm: the list shows the GitHub entries. A real failed build later shows a red mark on the commit in GitHub.

**Cost:** $0 (an upgrade is optional and not recommended now). **Required:** plan check recommended; badge and notifications optional. **Time:** 15 min. **Cowork:** docs/cowork/01-netlify-check.md (reads and toggles only; it never upgrades).
**Send back:** plan name, credit-based or legacy, credits used this month, whether the badge toggle was available and its state, which notifications are listed.

---

## 2. Google Search Console

**URL:** https://search.google.com/search-console

**A. Verify the domain property.** The live DNS already holds a Google site-verification TXT record (docs/COSTS-AND-ACCOUNTS.md section 5), so the domain may already be verified. Open the property selector (top left). If `pawsandpassage.com` appears as a Domain property, go to B. If not: property selector > Add property > **Domain** > `pawsandpassage.com` > pick TXT > copy the `google-site-verification=` string. Add it at Namecheap > Domain List > Manage > **Advanced DNS** > Add New Record > TXT, Host `@`, Value = the string (VERIFIED for Search Console side: https://support.google.com/webmasters/answer/9008080 , read 2026-11-18; the Namecheap menu names are SUSPECTED, look for Advanced DNS). Click Verify; can take two to three days. **Never delete the record afterward. Do not touch MX, SPF or nameserver rows.**

**B. Submit the sitemap.** Left menu **Sitemaps** > "Add a new sitemap" box > enter `https://www.pawsandpassage.com/sitemap.xml` (the help page says paste the full URL tested; `sitemap.xml` alone is also what our older note used) > **Submit** (VERIFIED, https://support.google.com/webmasters/answer/7451001 , read 2026-11-18; needs owner permission). Optional pre-check: paste the sitemap URL in the top inspection bar, **Test live URL**, expand Page availability, expect "Successful". Confirm: status **Success** (click the row for errors).

**C. Request indexing.** Paste each URL in the top search bar > inspection result > **Request indexing** (VERIFIED, https://support.google.com/webmasters/answer/9012289 , read 2026-11-18). A page that is not live yet, or fails the live test, cannot be requested. The daily quota exists but is not stated: if Search Console says quota exceeded, stop and continue tomorrow. A request is a hint, not a guarantee.

Which URLs (from `content/guides` and the sitemap rules in `src/lib/sitemap-entries.ts`):
- Important discrepancy (VERIFIED in the repo today): `content/guides` holds 17 Markdown guides, and 16 of them say `publishedOn: 2026-11-18` (the 17th, how-vacation-rental-pet-fees-work, is 2026-11-16); 7 more guides are TypeScript files in `src/content/guides` dated 2026-11-16. Every guide's sitemap `lastmod` is the same day, so the repo does not identify "the seven new guides" or "the five newest". I used file modification time as a proxy; tell the assistant if you meant a different seven.
- Day 1, in this order: (1) https://www.pawsandpassage.com/gear
- Day 1, seven guides (the newest guides, with the time-sensitive Christmas guide first; corrected by the lead):
  1. https://www.pawsandpassage.com/guides/christmas-week-in-a-cabin-with-a-dog
  2. https://www.pawsandpassage.com/guides/vacation-rentals-with-no-pet-fee
  3. https://www.pawsandpassage.com/guides/how-vacation-rental-pet-fees-work
  4. https://www.pawsandpassage.com/guides/what-a-dog-really-costs-on-a-vacation-rental
  5. https://www.pawsandpassage.com/guides/pet-friendly-listing-red-flags
  6. https://www.pawsandpassage.com/guides/vacation-rentals-with-no-dog-weight-limit
  7. https://www.pawsandpassage.com/guides/puppy-at-a-vacation-rental
- Day 2, the next five:
  1. https://www.pawsandpassage.com/guides/vacation-rental-with-a-reactive-dog
  2. https://www.pawsandpassage.com/guides/can-dogs-go-in-a-rental-pool-or-hot-tub
  3. https://www.pawsandpassage.com/guides/if-your-dog-gets-loose-on-a-trip
  4. https://www.pawsandpassage.com/guides/new-years-eve-with-a-dog-in-a-vacation-rental
  5. https://www.pawsandpassage.com/guides/how-many-dogs-can-you-bring-to-a-vacation-rental
- Later, only if quota allows: bringing-a-dog-to-a-no-pets-rental, breed-restrictions-at-vacation-rentals, can-you-leave-a-dog-alone-in-a-vacation-rental, vacation-rental-with-a-senior-dog, airbnb-pet-damage-charge-after-checkout (all under /guides/), plus the TypeScript guides (dog-car-safety-harness-and-crate-guide, dog-travel-first-aid-kit-guide, portable-dog-fence-and-playpen-guide-for-rentals, dog-friendly-cabin-packing-list, vacation-rentals-that-welcome-large-dogs, vacation-rental-secure-fenced-yard, pet-friendly-vacation-rental-checklist) and the /gear/<category> pages listed in the sitemap.
- Leave alone: "Remove URLs", "Change of address", Settings > Ownership verification users, any DNS record.

**Cost:** $0. **Required:** yes. **Time:** 30 min today, check back in 2 days. **Cowork:** docs/cowork/02-search-console.md (sitemap and indexing requests; it never adds DNS or users).
**Send back:** sitemap status and discovered-pages count; per URL, "requested" or the reason it could not be; any Coverage or Pages warnings.

---

## 3. Google Analytics 4

**URL:** https://analytics.google.com (property with Measurement ID `G-1J97C8CPC1`, the ID in `content/settings.yml`).

**A. Custom dimensions.** **Admin > Data display > Custom definitions > Custom dimensions tab > Create custom dimensions** (VERIFIED, https://support.google.com/analytics/answer/14239696 , read 2026-11-18; Editor role or higher). Create one each; **Scope = Event**; scope and parameter cannot be changed after saving; no hyphens in the name:

| Dimension name | Event parameter (type exactly) |
|---|---|
| Partner | `partner` |
| Product | `product_id` |
| Stay | `stay_slug` |
| Tool name | `tool_name` |

Important: your request said parameters named partner, product, stay, tool_name, but the site code actually sends `product_id` and `stay_slug` (docs/ANALYTICS-SETUP.md section 1; names kept stable on purpose). If you type `product` or `stay` as the parameter, the dimension will stay empty. Use the table above. Data appears 24 to 48 hours after creation and is not backfilled.

**B. Key events.** **Admin > Data display > Events > Recent events** tab, find `booking_click` and `product_click`, click the **star** (VERIFIED, https://support.google.com/analytics/answer/13128484 , read 2026-11-18). They show only after each has fired once. If one has not appeared, wait for a real click rather than using "Create event" (a created event can rewrite rules).

**C. Realtime.** Left menu **Reports > Realtime** (VERIFIED, https://support.google.com/analytics/answer/9271392 , read 2026-11-18). Open the live site in another tab, click around, and see yourself. Look at "Event count by Event name" for `booking_click`/`product_click` after clicking a button.

**D. The GTM container GTM-W99QCXZ9 (Google Ads detected it on the site).** The repo does not contain it: a search of `src/`, `index.html` and `content/settings.yml` found only the direct gtag.js loader for `G-1J97C8CPC1` (src/routes/__root.tsx:109), and no "GTM-" string. Its origin is **not known**; do not guess. What to check, and report what you see:
1. https://tagmanager.google.com > **Accounts** tab (top left): is `GTM-W99QCXZ9` listed under any account you can open? The container ID is shown at the top of the workspace (the official page I read does not say where the ID is displayed: SUSPECTED, look near the top of the container view). If it is yours, note which Google account owns it.
2. GA4 **Admin > Data collection and modification > Data streams** (path SUSPECTED; the official page I read does not give it, look for Data streams under Admin) > click the web stream for pawsandpassage.com: note the Measurement ID and the stream's creation date. If the stream's "Enhanced measurement" or tag settings mention Tag Manager, note it.
3. If no account of yours owns the container, report that. Do not delete or edit anything.
4. Also, view the live page source once (right-click > View page source, search for `GTM-`) and report whether it is present on the live page now. The assistant will decide what to do from your answer.

**Leave alone:** data retention, Google signals, data deletion, property deletion, linking Ads. **Cost:** $0. **Required:** A and B yes. **Time:** 25 min. **Cowork:** docs/cowork/03-ga4-setup.md (A to C and the read-only checks in D; it never deletes or links products).
**Send back:** the four dimension names as listed, whether the two key events were starred or are still waiting, what Realtime showed, and the GTM findings (account, creation date, or "not found").

---

## 4. Bing Webmaster Tools

**URL:** https://www.bing.com/webmasters. Sign in with a Microsoft or Google account (use an account you control; note it).
**Path: SUSPECTED.** Every Bing help URL I tried returned 404 or the wrong page on 2026-11-18, so I could not verify any menu path. Expected: on the first screen choose **Import** from Google Search Console, authorise read access, tick `pawsandpassage.com`, **Import**. Alternative: Add a site, enter the URL, verify with the CNAME or XML file option (do not edit DNS without asking; the import is simpler). Then **Sitemaps** (left menu): confirm `https://www.pawsandpassage.com/sitemap.xml` is listed; if not, Submit sitemap.
**IndexNow:** the key file is already in `public/` (`c020721357f8d6912ac3f66e4c956986.txt`). After the merge, open https://www.pawsandpassage.com/c020721357f8d6912ac3f66e4c956986.txt; it must show the key. The submit button is GitHub > Actions > IndexNow (dry run first); ask the assistant before running it (docs/ANALYTICS-SETUP.md section 5).
**Leave alone:** "Block URLs", "Disavow", "Configure My Site" settings.
**Cost:** $0. **Optional.** **Time:** 10 min. **Confirm:** site listed as verified; sitemap shows processed. **Cowork:** docs/cowork/04-bing-import.md.
**Send back:** import succeeded or the error text; sitemap status; the key file URL result.

---

## 5. Pinterest

**URL:** https://www.pinterest.com (sign in yourself). Needs a Pinterest **business** account (a personal account must be converted; that is your decision, free).
**A. Claim the site (HTML tag).** Click the chevron-down icon top right > **Settings > Link to Pinterest** (left menu) > **Claim** next to **Websites** > copy the tag from the box under **Add HTML tag** > **Continue** (VERIFIED, https://help.pinterest.com/en/business/article/claim-your-website , read 2026-11-18). Do **not** click Verify yet.
**B. Send the tag to the assistant** (it is a public meta tag, not a secret). The assistant adds it to the site head and deploys. Then return to the same screen, enter `https://www.pawsandpassage.com` and click **Verify**. Pinterest says you can remove the tag after the claim succeeds. Note: a Pinterest site-verification TXT record already exists in DNS (docs/COSTS-AND-ACCOUNTS.md section 5); do not delete it, and do not add DNS records for this.
**C. Pins.** Run the Cowork prompt (docs/cowork/05-pinterest-claim-and-pins.md, built from docs/PINTEREST-SETUP.md): boards, then at most 3 pins a day, scheduling the rest (Pinterest allows at most 10 scheduled pins at once, up to 30 days ahead). Pin destinations already carry utm parameters; never edit them.
**Leave alone:** ads, "Promote", Pinterest Business billing, shopping or catalog features, any "Verify your identity" payment step.
**Cost:** $0. **Required** for Pinterest analytics. **Time:** 30 min, plus 15 min after the tag is live. **Confirm:** Settings > Claimed accounts shows the site with a check mark; first pins published.
**Send back:** the HTML tag text; account type; claim status; table of pins with status.

---

## 6. Impact (Chewy decline)

**URL:** https://app.impact.com (sign in yourself).
1. **Verify the property:** User profile > **Settings > Profile > Media Properties**; the website should show as verified (VERIFIED path, via Impact's help assistant on https://help.impact.com , read 2026-11-18). To add or re-verify: Website under Add new channels > enter URL > choose Email, Meta tag, Tracking script or Edit content > Add Website. Meta tag or Tracking script would need a site change (ask the assistant); Email works only if your Impact signup email is on pawsandpassage.com, which conflicts with your no-hello@ rule: do not use it.
2. **Read the Chewy decline reason:** open your Impact inbox or notifications and the Chewy entry under the marketplace or "My Brands/Applications" area (SUSPECTED: the pages I read do not say where a declined status or reason is displayed; also check the decline email). Copy the exact reason text.
3. **Send the clarification** to Impact support (draft: docs/recovery/02-chewy-impact-requirements.md section 4.3; fill in your account ID and a non-hello@ affiliate email yourself; send only if still accurate). Find the support or help entry in the account (the pages I read give no support contact path: SUSPECTED). Send once. Contact affiliates@chewy.com only if Impact says the decision is Chewy's. **Do not reapply** before an answer and real traffic.
**Leave alone:** payment, tax interview and identity fields, "Apply" buttons for other brands (see step 7).
**Cost:** $0. **Required** before any reapply. **Time:** 20 min. **Cowork:** none (account, identity and support correspondence).
**Send back:** property status text, the decline reason (copy), confirmation the message was sent, later the support reply.

---

## 7. Affiliate applications (in this order)

**Before any application:** the merge is live (reviewers must see /gear, Methodology, Corrections), and step 13's affiliate-login email decision is made. Re-read each program's page on the day; terms change (docs/AFFILIATE-APPLICATION-PACK.md). Use the text blocks in that pack (7a to 7h); never state visitors, sales, followers or income; do not name Expedia/Vrbo or commission figures; no newsletter.

**Only you fill, assistant and Cowork never do:** Social Security number or tax ID, W-9 and tax interview, bank account, PayPal email, mailing address, phone, identity verification, and any "I accept the agreement" box. Ascend's form asks for a Social Security number and PayPal email. Awin and Impact need tax and payment details before payment.

| Order | Program | URL | Notes | Time |
|---|---|---|---|---|
| 7.1 | Awin: Fi | https://ui.awin.com/merchant-profile/123222 | Account exists. Log in, open the profile, **Join Program**, pick a promotional type, paste the short note (pack 7b, under 150 characters), accept terms yourself. Awin help path not verified (the help URL I tried 404'd): SUSPECTED, also reachable at ui.awin.com > Advertisers > Join Programmes. | 10 min |
| 7.2 | Awin: Petmate | https://ui.awin.com/merchant-profile/89913 | Same steps. Very small revenue (1 product). | 10 min |
| 7.3 | Ascend: Kurgo | https://www.ascendpartner.com/affiliate/registration?usertype=1 and https://kurgo.com/kurgo-affiliate-program | Read the Kurgo guide PDF first (could not be read as text). The form asks SSN/tax ID and PayPal: you only. Choose currency carefully (fixed at signup). Best brand fit (6 products). | 30 min |
| 7.4 | BringFido | https://www.bringfido.com/affiliate/ and /affiliate/agreement/ | Both returned 403 to my tool; I could not read them. Read the agreement in your browser first: rate (a snippet said $5 per completed reservation, old FAQ $3: unclear) and that BringFido may revoke at any time. Apply with pack 7h only if you accept it. | 20 min |
| 7.5 | Impact: Tractive | https://app.impact.com (Marketplace, search Tractive) or https://tractive.com/en/pa/affiliate | Note = pack 7g. Terms not readable on tractive.com today. | 15 min |
| 7.6 | Amazon Associates | https://affiliate-program.amazon.com | **Recommend waiting.** See below. | 30 min when ready |

**Amazon: apply now or wait?** Facts (docs/AFFILIATE-APPLICATION-PACK.md, from Amazon's own pages): pays 3% on Pets Products; you must make **3 qualifying sales within 180 days of applying** or the account is closed; **a rejected application cannot be reassessed**; your own orders do not count; the site needs "robust original content". Reasoning (judgment): with no visits today, 3 sales in 180 days is unlikely, so applying now starts a clock you may lose, and a rejection is final. Recommendation: **wait until there are real visits** (some weeks of Search Console impressions, live Pinterest pins), then apply with pack 7f and no traffic estimates. If you prefer to apply now, that is your decision; the cost is $0 but the one-shot risk is real. Amazon also requires the exact sentence "As an Amazon Associate I earn from qualifying purchases." near links before any Amazon link exists.
**Hold, not now:** AvantLink/Adventure Medical Kits (about 80% denied on its FAQ), PetSafe, Wild One, Petco, Chewy reapply.
**After each approval:** send the link/ID to the assistant (it sets `approved: true` in `content/affiliates.yml` and updates the privacy page). Do not paste links into content yourself.
**Cost:** $0 (Awin's US FAQ mentions a refundable $1 deposit; read what the screen asks). **Optional but needed for revenue.** **Cowork:** none. **Confirm:** each network shows Pending or Approved. **Send back:** per program, status and the date; never the tax/bank details.

---

## 8. GitHub security (owner only; no Cowork)

**URL:** https://github.com (account `meggzzcode`).
1. **2FA (required).** Profile picture > **Settings > Password and authentication** (Access section) > **Enable two-factor authentication** > scan the QR code with an authenticator app > type the six-digit code > **Download** the recovery codes and keep them somewhere safe (not in the repo or chat) > **I have saved my recovery codes** (VERIFIED, https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication , read 2026-11-18).
2. **Actions read-only (recommended).** Repository `paw-passage` > **Settings > Actions > General > Workflow permissions** > choose the option granting read access to contents and packages > **Save** (VERIFIED, https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository , read 2026-11-18). Leave "Allow GitHub Actions to create and approve pull requests" off. The Site health workflow declares its own permissions, so it keeps working.
3. **Force-push and deletion protection on main (optional, only after step 11).** Repository **Settings > Branches > Add classic branch protection rule**, pattern `main`; tick only the protections against deleting the branch and force pushes (the GitHub page lists "Allow force pushes" and "Allow deletions" as options to leave OFF; exact wording of the block checkbox is SUSPECTED, read the on-screen labels) > Create (VERIFIED path, https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule , read 2026-11-18). Plan limits on personal-account repos are not stated clearly on that page: if it will not let you, stop and tell the assistant.
4. **Why NOT "Require a pull request" or "Require status checks" yet:** `main` is also written by Pages CMS and the Lovable bot. Per docs/SECURITY-AND-RECOVERY.md section 3, a personal repo has no bypass list (bypass lists need an organization-owned repo), so those bots would be blocked and CMS saves would fail. First do step 11 to see how Pages CMS commits, then decide.
5. **Secret scanning (optional):** Repository Settings > Security and quality > Advanced Security (path from docs/COSTS-AND-ACCOUNTS.md N3, not re-verified: SUSPECTED); free for a public repo. Do not make the repo private without budgeting (secret scanning on private repos is paid).
**Leave alone:** transferring or deleting the repo, adding collaborators, changing visibility, deploy keys.
**Cost:** $0. **Time:** 20 min. **Confirm:** 2FA shows Enabled; the Actions setting shows the read option; the Site health workflow still runs (Actions > Site health > Run workflow).
**Send back:** "2FA on" and the two setting states (no codes, no recovery file).

---

## 9. Namecheap: renewal, auto-renew, Private Email

**URL:** https://www.namecheap.com (sign in yourself; turn on Namecheap 2FA under Profile > Security, SUSPECTED path).
1. **Domain List > Manage** (pawsandpassage.com): read **Expires on**, the renewal price and the **Auto-Renew** toggle; switch it **on**. The official auto-renew help pages I opened did not cover it (wrong page returned): menu path SUSPECTED. Expected price: **$19.98 a year** from 2026-11-01 (VERIFIED, https://www.namecheap.com/support/knowledgebase/article.aspx/10840/2201/com-price-change-november-1-2026/ , read 2026-11-18; ICANN fee not stated).
2. **Private Email > Manage**: read the expiry and the real renewal price in the cart (listed $14.88 a year for the 1-mailbox Launch plan; "renewal price" is UNCONFIRMED); turn on auto-renew. Renewal path: Private Email > Manage > Renew (docs/EMAIL-AND-TRANSFER.md 2f).
3. Domain privacy should be listed as included; just note its status.
**Leave alone:** Advanced DNS records (MX, SPF, nameservers, the Google and Pinterest TXT records, autodiscover), "Transfer out", extra mailboxes, upsells (hosting, SSL, VPN), any "Add to cart" prompt. DKIM and DMARC are optional (docs/EMAIL-AND-TRANSFER.md section 5); skip unless you want them.
**Cost:** $0 now; auto-renew charges about $34.86 a year in total when due. **Required.** **Time:** 15 min. **Confirm:** both show Auto-Renew on and dates are visible. **Cowork:** none (billing pages).
**Send back:** both expiry dates and the renewal prices as displayed (no card details).

---

## 10. Operating costs and the Lovable decision (nothing is cancelled)

From docs/COSTS-AND-ACCOUNTS.md section 2 (renewal prices, per year):

| Line | Per year |
|---|---|
| Domain .com renewal | $19.98 |
| Private Email Launch (1 mailbox) | $14.88 |
| Netlify Free, GitHub Free, Pages CMS (no price page found), GA4, Search Console, Bing | $0 |
| **Total without Lovable** | **$34.86** ($2.91 a month) |
| Lovable Pro at the listed $25 a month | +$300 |
| **Total with Lovable Pro** | **about $334.86** ($27.91 a month); the true billed amount and annual price are UNCONFIRMED |

Your first order was $24.16 (introductory); the running cost is $34.86. The site does **not** need Lovable to build, host or edit (it builds from the public npm registry, hosts on Netlify, edits in Pages CMS; docs/COSTS-AND-ACCOUNTS.md section 3). If you downgrade: **Workspace settings > Plans & credit usage > Manage > Downgrade to free**; the paid plan stays until the period ends (VERIFIED, https://docs.lovable.dev/introduction/plans-and-credits , read 2026-11-18). Optional to also disconnect GitHub sync (Project settings > Git > GitHub > Disconnect; path from the cost doc, SUSPECTED) so a Lovable prompt can never push to `main`. Netlify Personal ($9 a month) or Pro ($20) are not recommended unless credits run out. **This is your decision; the assistant cancelled nothing and will not.** Do not run Lovable prompts against this project: they would deploy live.
**Cost:** $0 to look. **Time:** 10 min. **Send back:** "keep Lovable" or "downgrade", and what the billing page shows as the amount.

---

## 11. Pages CMS test edit

**URL:** https://app.pagescms.org (sign in with GitHub). Open the site's collection, change something harmless (for example a date or a comma in a guide's text), **Save**. Then check https://github.com/meggzzcode/paw-passage/commits/main: a new commit should appear. Note the **author** shown and the **branch** (docs/SECURITY-AND-RECOVERY.md section 3: Pages CMS docs do not say which branch it writes to). Save counts as a production deploy (15 of 300 Netlify credits): then undo your edit in a later batched save. Menu names inside Pages CMS were not verified (SUSPECTED).
**Cost:** $0. **Required** before any branch rules. **Time:** 10 min. **Confirm:** commit on main; Netlify shows a green deploy. **Send back:** branch name, commit author, any error. No Cowork (signing in and committing is owner-authorised).

---

## 12. The two centerforpetsafety.org links

Open both in a normal browser (the two addresses are listed in docs/LINK-CHECK-FINDINGS.md; the car-safety guide cites them; the host did not answer from the assistant's sandbox, which points to the sandbox, not the pages). If they load, say so. If one shows not found, open https://centerforpetsafety.org/cps-certified/ and send the corrected address; do not claim a certification the live page does not show. **Cost:** $0. **Optional.** **Time:** 5 min. **Send back:** "both load" or the working address.

---

## 13. The email decision

**Settled (your rule):** `hello@pawsandpassage.com` is the only public address, for reader and partnership correspondence. No other mailbox. The Private Email Launch plan includes one mailbox; extra mailboxes cost $8.88 a year each.

**Open question: which address do affiliate accounts log in with** (Awin, Ascend, Impact, Amazon, BringFido)? Your earlier rule was "affiliate accounts must not use hello@". Both options, neutrally (docs/EMAIL-AND-TRANSFER.md, docs/AFFILIATE-APPLICATION-PACK.md):

| | Option A: a separate affiliate-only login address | Option B: hello@ |
|---|---|---|
| What it means | An address used only for network logins and payouts. Could be a Namecheap alias (the plan allows 10 aliases per mailbox: they deliver into the same mailbox) or a different mailbox (extra cost, and your rule is one mailbox). | The existing public address is the login and contact on every network. |
| Mail | Network mail does not mix with reader mail if the alias is filtered. Alias details: not verified here. | Network, payout and reader mail all arrive in one inbox. Anyone who knows the public address can attempt a password reset or phishing aimed at it. |
| Transfer to a buyer | Mailbox moves with the Private Email subscription (docs/EMAIL-AND-TRANSFER.md 2b); the buyer sets a new mailbox password. Affiliate accounts do **not** transfer automatically anyway: Amazon bars assignment; Impact documents a path; others assume reapply (pack section 4). Account emails would need changing to the buyer's address. | Same mailbox transfer. After a sale you must still change each network's login email away from hello@ or hand each account over; a buyer taking the mailbox would also receive the account recovery emails. |
| Your earlier rule | Matches it. | Reverses it. |
| Cost | $0 for an alias; $8.88 a year per extra mailbox. | $0. |

Whichever you choose: use a unique password per network in a password manager (yours), and never put credentials in the repo. **Needed before step 7.** **Send back:** A or B, and the address to use (the address is not a secret; the password is).
