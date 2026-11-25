# START HERE: Paws & Passage Owner's Guide

**Version 2.0 · written 2026-11-25 · counts taken at commit `3e5923b` · DRAFT: SCREENSHOT VERIFICATION PENDING**

> **DRAFT: SCREENSHOT VERIFICATION PENDING.** Every step below is written so you can follow it without pictures. Real screenshots of Pages CMS, Netlify, GitHub and Namecheap have not been captured yet. Lines marked "Screenshot pending" show where they will go. Button wording in services you have not opened yet is described, not quoted, unless it appears in the project's own configuration.

**Status of the live site (2026-11-25).** Production runs an earlier build (`main@82b0b34`). The final version of the code, which adds the owner-approved stay directory mode and larger disclosure notices, is **not deployed yet**; a second deploy needs the owner's approval. OWNER ACTION REQUIRED: ask the seller to confirm in writing which commit is live on your closing date.

**Evidence labels used in this guide:** VERIFIED LIVE (checked on the public site), VERIFIED IN CODE (read or tested in the repository), VERIFIED IN ACCOUNT (seen in a seller account by a reviewer on the date given), OWNER CONFIRMATION (stated by the seller, not checkable here), UNVERIFIED (not checked), NOT INCLUDED, OWNER ACTION REQUIRED. Detailed ledger: [docs/SALE_RELEASE_STATUS.md](./docs/SALE_RELEASE_STATUS.md).

## How the pieces fit

```
  You edit content ──> Pages CMS (web editor) ──saves to──> GitHub (stores content and code)
                                                               │
                                                  change detected
                                                               ▼
                                     Netlify (builds and publishes) ──> live website
                                                               ▲
  Namecheap (domain name and DNS address book) ── points visitors here
  Your own Amazon / Vrbo accounts ──> affiliate links (settings in GitHub files)
```

The site is **not** hosted by Pages CMS and **not** hosted by Lovable. Pages CMS only edits files. GitHub only stores them. Netlify turns them into the website. Namecheap tells the internet where the website lives.

## 1. Welcome

Paws & Passage is a dog-friendly vacation-rental travel site. It publishes researched guides, an original pet-policy dataset, three planning tools, a directory of stays and a Gear shop of dog travel products. It is built to earn affiliate commission, but it is **pre-revenue**: the domain was registered November 16, 2026. Google Search Console previously recorded approximately 236 impressions and zero clicks in a 28-day window that included the site's launch. There is no established organic traffic or revenue, and nothing here promises any.

**Plain words you will meet:**

- **GitHub** is where the content and code live, with every past version.
- **Netlify** publishes the site when those source files change.
- **Pages CMS** is a web editor for the content it supports. It is not a full site builder.
- **Namecheap** holds the domain name and its DNS records, the "address book" that points the name at the host.
- **Affiliate link:** a link that pays a commission if a visitor buys or books through it. It only pays the person whose account created it.

**What you can do without a developer:** edit and publish most articles, change Gear product details, update the packing planner, update stays, change your business details and affiliate settings, and check that a change went live.

**What needs a developer:** this is a custom React application, **not WordPress**. Design changes, new tools, seven older guides, the town pages and the legal pages are code. Section 9 lists them.

**Core services you will use:** Namecheap (domain), GitHub (storage), Netlify (publishing), Pages CMS (editing, free to sign in with GitHub). Costs are in section 12.

## 2. What you receive

What transfers is set by your signed purchase agreement. This table describes what exists in the project. Where a right needs a signed document, it is not yours until that document is signed.

| Asset                           | Included?                          | What you should know                                                                                                       |
| ------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Domain `pawsandpassage.com`     | Yes, by Namecheap ownership change | Registered 2026-11-16, expires 2027-11-17. Auto-renew is OFF on purpose; renewal is the buyer's job (VERIFIED IN ACCOUNT 2026-11-25).                             |
| Website code                    | Yes, by GitHub repository transfer | Plus a written copyright assignment. There is no LICENSE file; the assignment wording is a seller and legal item.          |
| Published guides                | Yes                                | 30 published. 23 are editable in Pages CMS; 7 are code files (section 4 and 9). VERIFIED IN CODE.                          |
| Original research and CSV       | Yes                                | 38 rental managers, 13 fields, read 2026-11-18. A convenience sample, not a survey.                                        |
| Stay directory                  | Yes                                | 83 stay files; 78 shown; 23 in the sitemap; **0 confirmed with a host**.                                                   |
| Gear catalog                    | Yes                                | 92 product records, 65 active, 11 categories, 5 trip collections.                                                          |
| Packing planner and other tools | Yes                                | 3 tools: packing planner (37 items), "Will my dog be accepted?", before-you-book checklist. No calculators.                |
| Images and licenses             | Photos are licensed, not owned     | Credited Unsplash photos. The Unsplash license is nonexclusive: you may use them, you do not own them, and others may too. |
| Pinterest and social assets     | Image files only                   | 31 pins and 32 share images, derived from the site's photos, plus the posting sheet. The seller's Pinterest account (pinterest.com/paws_and_passage) is NOT included unless your agreement says so: see Task H.                     |
| Documentation                   | Yes                                | This guide and the files in `docs/`.                                                                                       |
| Hosting configuration           | Yes                                | `netlify.toml` in the repository. The Netlify project itself is transferred or recreated as agreed (section 3).            |
| Affiliate infrastructure        | The wiring, yes; the accounts, no  | Links, tags and disclosures are set up. Section 5.                                                                         |

**Does not automatically transfer (NOT INCLUDED unless your agreement says so):** the seller's affiliate accounts (Amazon, Vrbo and Expedia through Impact, Stay22), the seller's Google Analytics property unless the seller authorizes access, Search Console access, the seller's personal email, the seller's Lovable subscription and workspace, the seller's social accounts, and copyright in third-party stock photos.

Do not treat a draft, an unsigned document or an invitation as a completed transfer. Nothing here guarantees income, traffic or rankings.

## 3. Your first day

Work in this order. It follows the safe sequence in [docs/DNS-AND-TRANSFER.md](./docs/DNS-AND-TRANSFER.md). The full chronological list with seller and buyer columns is [docs/TRANSFER_CHECKLIST.md](./docs/TRANSFER_CHECKLIST.md).

**Before transfer, the seller prepares.** The seller confirms the domain is unexpired, records the DNS page, lists which accounts are included, and has no valuable asset moved until funds are secured by the agreed escrow process. **After transfer, you confirm** each step below.

### Step 1. Confirm payment and escrow

- **Where:** your escrow or marketplace account.
- **What to do:** confirm the funds are held by the agreed process before any asset moves. Confirm the signed agreement lists the domain, repository and any accounts included.
- **Success looks like:** the escrow shows funds secured and a signed agreement is saved.
- **If it fails:** pause. Do not accept transfers until this is fixed.

### Step 2. Receive the domain

- **Where:** your Namecheap account (create one first). The seller opens Domain List, Manage, **Sharing & Transfer**, **Change Ownership** and enters your Namecheap **username**, not your email.
- **What to do:** accept the request in your account and check your contact details. Namecheap says this move is free and does not change DNS. Leave the DNS records alone.
- **Success looks like:** the domain appears in your Domain List. You then send a test email to and from the business address.
- **If it fails:** the Domain Lock was ON on 2026-11-25 (VERIFIED IN ACCOUNT); the seller may need to turn it off. Whether a recent-registration restriction applies is UNVERIFIED. Ask Namecheap support in writing. An invitation sent is not a completed transfer.
- Screenshot pending (buyer-08-namecheap-change-ownership).

### Step 3. Receive the GitHub repository

- **Where:** GitHub. The seller opens the repository, Settings, Danger Zone, Transfer.
- **What to do:** accept the transfer email within a day. Turn on two-factor sign-in. Keep the repository public unless you plan for paid features ([docs/COSTS-AND-ACCOUNTS.md](./docs/COSTS-AND-ACCOUNTS.md)).
- **Success looks like:** the repository is under your account and shows the full history.
- **If it fails:** the transfer email expires after one day; ask the seller to start it again.
- Screenshot pending (buyer-07-github-repo-overview).

### Step 4. Confirm hosting and deployment

- **Where:** Netlify. Two routes: the seller transfers the project to a team you own, or you create a new project from the repository ("Import from Git"). Recreating is the simpler route; the settings are in `netlify.toml`.
- **What to do:** check the repository link, the production branch (`main`), build command (`npm run build`) and publish folder (`dist`). Decide how builds publish (section 6).
- **Success looks like:** a deploy shows Published and the site opens at a `.netlify.app` address.
- **If it fails:** open the deploy log and see section 8.

### Step 5. Domain and HTTPS

- **Where:** Netlify domain settings, then Namecheap Advanced DNS.
- **What to do:** add the domain in Netlify. Change only the website records Netlify tells you to. **Never delete mail records and never change nameservers.** Keep a screenshot of the DNS page from before.
- **Success looks like:** the site opens at `https://www.pawsandpassage.com` with a padlock, and email still works.
- **If it fails:** see "domain not working" in section 8. The certificate was due to expire 2027-02-14 and Netlify showed "Certificate renewal incomplete" for the apex domain on 2026-11-25 (VERIFIED IN ACCOUNT). Check the HTTPS page in Netlify and fix any old IPv6 (AAAA) records.

### Step 6. Connect Pages CMS

- **Where:** `app.pagescms.org`, signing in with GitHub.
- **What to do:** install the Pages CMS GitHub App on the account that owns the repository, then open the repository on the `main` branch.
- **Success looks like:** the sidebar shows seven areas: Articles, Stays (accommodation listings), Dog rules (places), Affiliate links, Products (travel essentials), Packing planner (dog packing list) and Business settings. The forms loaded in the seller's account on 2026-11-25 (VERIFIED IN ACCOUNT).
- **If it fails:** edit on GitHub instead (section 6).
- Screenshot pending (buyer-01-pages-cms-dashboard).

### Step 7. Set contact details

- **Where:** Pages CMS, Business settings.
- **What to do:** set "Business email address (shown on the Contact page)" and "Website address". Confirm you can read mail at that address. The mailbox is a separate Namecheap subscription and does not move with the domain ([docs/EMAIL-AND-TRANSFER.md](./docs/EMAIL-AND-TRANSFER.md)).
- **Success looks like:** the Contact page shows your address and a test message reaches you.
- **If it fails:** the address points to a dead mailbox. Fix the mailbox first.

### Step 8. Replace seller tracking and affiliate settings

- **Where:** section 5.
- **What to do:** replace or empty every seller identifier.
- **Success looks like:** the audit command in section 5 reports none left.

### Step 9. Confirm the site works

- **Where:** the live site on a phone and a computer.
- **What to do:** open the home page, one guide, a Gear category, the packing planner and one stay. Check the sitemap at `/sitemap.xml`.
- **Success looks like:** every page loads, with no error page. The sitemap listed 105 addresses when counted.
- **If it fails:** section 8.

### Step 10. Save recovery information and backups

- **Where:** your password manager and a private folder.
- **What to do:** turn on two-factor sign-in on Namecheap, GitHub, Netlify and email. Save recovery codes privately, never in the repository. Download a copy of the repository. Never receive passwords from the seller; use each service's invitation or transfer feature. Then see [docs/SECURITY-AND-RECOVERY.md](./docs/SECURITY-AND-RECOVERY.md).
- **Success looks like:** you can sign in to every service without the seller, and the seller's access and recovery methods are removed.

## 4. How to manage the website

**What Pages CMS can edit.** `.pages.yml` defines seven areas. Three are collections of files: **Articles**, **Stays (accommodation listings)** and **Dog rules (places)**. Four are single files: **Affiliate links**, **Products (travel essentials)**, **Packing planner (dog packing list)** and **Business settings**. Uploaded photos go to `public/uploads`.

**Exceptions.** Of 31 guide files, **24 are Markdown (all 24 published; none is a draft today) and editable in Pages CMS**. **7 are code-managed and all 7 are published**: the car-safety, first-aid, cabin-packing, fenced-yard, large-dog, rental-checklist and portable-fence guides. They do not appear in Articles. Also outside Pages CMS: towns and destinations, the eight "things to do" articles, Gear category text, dog-type pages, the checklist items, the 38-manager data file, the legal pages and all design. The fallback for a Markdown or YAML file is editing it directly on GitHub (section 6). Code files need a developer.

After any task, save, wait for the build, and check the live page (section 6).

### Task A. Edit an article

- **What you're changing:** the text, a fact or the review date of a Markdown article.
- **Where to click:** Pages CMS, **Articles**, then the article by its title.
- **Steps:** edit **"Article text (written in Markdown)"**. For a new fact, add its source to **"Sources (shown at the end of the article)"** (every source must be listed there; links in the text are optional and light, only where the sentence names its source, and must go to a listed source) and set **"Last checked on"** to today. Save. Writing help: [docs/WRITING-IN-MARKDOWN.md](./docs/WRITING-IN-MARKDOWN.md).
- **How to check:** after the build, open the article and look for your change.
- **Cannot find your article?** It is one of the 7 code-managed guides (see Exceptions above). Those need a developer.
- Screenshot pending (buyer-02-article-editor).

### Task B. Publish a new article

- **What you're changing:** adding a page to the site.
- **Where to click:** Pages CMS, **Articles**, then add a new entry.
- **Steps:** keep **Status** on "Draft (not on the website)" while you write. Fill the required fields: Title, "One-line summary (shown under the title)", "Type of article", "Author name shown on the article", "First published on", "Last checked on", "Reading time (minutes)", "Title for Google (60 characters or fewer)", "Description for Google (160 characters or fewer)". Under "Research notes", fill "Main search phrase", "Who this is for" and "What makes this article different". To publish, set **Status** to "Published (live once approved below)", type a name in **"Approved by"**, set **"Approved on"**, tick **"Fact-checking finished? (must be ticked for the article to go live)"** and leave **"Claims still unchecked"** empty. Leave "Open follow-ups" empty too, as its label asks.
- **How to check:** the article appears at `/guides/<file name>` after the build. If it does not, one of the four gate items is missing.
- **Warning:** a published article with a mistake stops the build and names the field. The live site keeps its previous version.

### Task C. Add or update a stay

- **What you're changing:** a stay's details.
- **Where to click:** Pages CMS, **Stays (accommodation listings)**.
- **Steps:** fill only what the listing states. Leave unknown choices on "not-confirmed". Set the Status to "Verified (shown; the host confirmed the details)" **only** if the host confirmed them. Update **"Where the facts came from (listing link)"** to change its source address. The directory mode in Business settings (section 5) is "public-sources" in the shipped configuration (VERIFIED IN CODE), so a stay with a public Vrbo or Airbnb source address is listed with a plain link.
- **How to check:** the stay page shows your details after the build.
- **Know this:** visible does not mean host-confirmed. All 83 stays are unconfirmed and say so. A stay is hidden if it has no Vrbo or Airbnb source address. It is shown but `noindex` (kept out of search and the sitemap) when it is too thin: fewer than five of six content sections filled, a description under 250 characters, or text too similar to another stay. 78 are shown, 23 indexable, 55 shown but `noindex`, 5 hidden. The "public-sources" mode lists stays using a plain public link that earns nothing.
- Screenshot pending (buyer-09-stay-editor).

### Task D. Update a Gear product

- **What you're changing:** a product on the Gear pages and in articles. The Gear shop is the **Products (travel essentials)** form. No code change is needed.
- **Where to click:** Pages CMS, **Products (travel essentials)**, then the product.
- **Steps:** edit "What it is, in plain words" and "What the maker states (one fact per line, taken from the source below)". Update "Where the facts came from" and "Date you last re-read the source page". To hide a product, untick **"Show this product?"**. Never change a product's Short name, because guides and affiliate links use it.
- **How to check:** open the product's Gear category page after the build. A category needs at least three active products to appear.
- **Warning:** no prices, ratings or "tested" claims. The form says so, and so do the disclosure pages.
- Screenshot pending (buyer-04-gear-product-editor).

### Task E. Update the packing planner

- **What you're changing:** the list the planner builds.
- **Where to click:** Pages CMS, **Packing planner (dog packing list)**, then Items. It is a large form and loads slowly (about 40 seconds in the seller's account).
- **Steps:** for an existing item, change "Item name", "What is this for?", "Why bring this?", "Category" or **"When should this appear?"** and the rule. To attach an existing Gear product, add it under **"Related Gear products"** and type the Product id exactly as it appears in Products (its "Short name"). Each product needs "The one thing to check before buying". To remove an outdated recommendation, delete that product row, or untick "Show this item?" to hide a whole item.
- **How to check:** open `/tools/packing-list`, choose a matching trip and look for the item.
- **Warning:** the Gear catalog and the planner share product records. Add a product once in Products; never create a duplicate. An unknown or hidden product id stops the build. Never change an id once an item uses it. Details: [docs/PACKING_PLANNER_PRODUCT_GUIDE.md](./docs/PACKING_PLANNER_PRODUCT_GUIDE.md).
- Screenshot pending (buyer-03-packing-item-editor).

### Task F. Update an affiliate link

- **What you're changing:** where a Buy or Book button goes.
- **Where to click:** Pages CMS, **Affiliate links**.
- **Steps:** find the entry by its Short name. Paste your own link exactly as the program gave it into **"Your affiliate link (starts with https://)"**. Tick **"Approved? (tick only after the company approved you)"** only after the company's own dashboard shows you approved. Never rename an entry: stays and articles refer to it by name.
- **To remove a link:** untick "Approved?". The button then falls back to the maker's page, or disappears. Never delete the entry: stays and articles refer to it by name, and the build stops.
- **How to check:** click the button on the live page and read the address in the browser.
- **Warning:** "Approved" inside this site is only a switch. It is not proof that any program approved you.

### Task G. Change business information

- **Where to click:** Pages CMS, **Business settings**. These fields exist: "Business email address (shown on the Contact page)", "Website address", "Google Analytics ID", "Amazon Associates tracking ID", "Pinterest profile address", "Stay22 account ID", "Impact (impact.com) site-verification value" and "Which stays are listed".
- **Steps:** change the value and save. An empty value shows an honest "coming soon" message or hides the item.
- **Needs file edits beyond the CMS:** a new domain also needs the `Sitemap:` line in `public/robots.txt` and the address in `scripts/site-health.mjs`; the footer and legal-page owner names are code files (`src/routes/*.tsx`).
- Screenshot pending (buyer-05-business-settings).

> **Stay setting.** The "Which stays are listed" drop-down has two choices. The shipped value is "Also stays with a plain public Vrbo or Airbnb source link (no commission)" (`public-sources`). The other choice is labelled as the older mode: with it, the directory empties if the seller's Vrbo links are removed. Read section 5 before changing it. (VERIFIED IN CODE: the label was corrected on 2026-11-25; Cowork saw the form on `main`.)

### Task H. Pinterest: the account, the pins and how to post

- **The account.** The seller has a Pinterest account at **https://www.pinterest.com/paws_and_passage/**. Its address is stored in Business settings as "Pinterest profile address" (it controls the footer icon). **The account is the seller's and is NOT part of the sale unless your agreement says so** (OWNER ACTION REQUIRED: the seller decides at closing). Pinterest's rules on handing an account to another person are UNVERIFIED here; read Pinterest's current terms before agreeing to take it over.
- **The safe path (works either way).** Create your own Pinterest business account, claim `pawsandpassage.com` in its settings, create your boards, and upload the pins you receive. Then replace the Pinterest profile address in Business settings with yours (or empty it).
- **What you receive.** One pin image per published guide (1000 x 1500 px) in the repository folder `public/pins/`, the posting sheet [docs/pinterest-pins.csv](./docs/pinterest-pins.csv) (pin image address, title, description, destination with tracking, board), the board plan in [docs/PINTEREST-SETUP.md](./docs/PINTEREST-SETUP.md) and the approach in [docs/PINTEREST-STRATEGY.md](./docs/PINTEREST-STRATEGY.md). Marketing-style pin designs made in Canva, if the seller supplies them, are separate image files; the Canva account and designs stay with the seller unless the agreement says otherwise.
- **Add pins for a new article.** Publish the article, then run `python3 scripts/make-share-images.py` and `python3 scripts/make-pin-sheet.py` (developer step) or design the pin yourself in any design tool at 1000 x 1500 px. Pinterest destinations carry `utm_source=pinterest` so you can see Pinterest visits separately in analytics.
- **Honest expectations.** Pins can bring referral visitors over weeks; nothing here guarantees traffic. Keep pin titles and descriptions truthful to the article, and follow Pinterest's published guidelines (no repeated spam pins, no bought engagement).
- **Check:** open the pin's destination link; the guide loads and the page address carries the tracking parameters.

## 5. Affiliate accounts and monetization

**In plain English:** the site earns only when a visitor clicks a link created by _your_ approved affiliate account and then buys or books. The seller's accounts stay with the seller. Until you replace the seller's identifiers, any commission would go to the seller, not to you. That is not what you paid for and may break program rules, so replace them early.

**Transition checklist.** Full detail is in [docs/BUYER_AFFILIATE_TRANSITION.md](./docs/BUYER_AFFILIATE_TRANSITION.md). That file also covers the 79 Vrbo records, so this guide does not repeat them.

- [ ] Apply to Amazon Associates and to Vrbo or Expedia on Impact. Create your own Google Analytics property.
- [ ] Wait for approval. Approval is the program's decision and may be refused.
- [ ] Replace the Amazon tracking ID in Business settings. One value retags every Amazon link.
- [ ] Replace the Vrbo links with your own, or disable the seller's (the transition file explains the safe script).
- [ ] Replace or empty the Impact verification value, the Google Analytics ID and the Pinterest address.
- [ ] Run the audit (below) until it reports nothing left.
- [ ] Re-read the affiliate disclosure page and make sure it is still accurate for your programs.
- [ ] Click a sample of links and check they carry your identifiers.

**Check with one command:** `node scripts/audit-seller-ids.mjs --expect-none`. It stops with an error while any seller identifier remains. It needs Node 22 and a copy of the repository (Advanced section). On 2026-11-25 it reported five seller items remaining.

**Public-sources mode.** The shipped setting lists every stay that has a public Vrbo or Airbnb source address (78 stays, 23 indexable), with a plain "View the listing" link, no commission wording, no affiliate label and no claim of a partnership. Owner approved this on 2026-11-25. The reason: the old rule listed a stay only while it had an approved affiliate link, so removing the seller's links would have emptied the directory and made those pages disappear. Plain source links **earn nothing**. When your own Vrbo links are approved, add them in **Affiliate links** using the same entry names, and those stays show a labelled earning button again. Do not change the mode setting just to chase income.

**Warnings.**

- The seller's affiliate accounts do not transfer.
- A configured link is not buyer approval.
- Clicks are not earnings.
- Maker links on Gear products are plain links, not commission opportunities.
- No revenue is guaranteed. Amazon in particular expects qualifying sales within a set window.
- Your affiliate disclosure must stay accurate. Amazon requires its exact sentence next to Amazon links; the site adds it automatically.

## 6. How publishing works

**Edit, Save, Build, Live site.** You save in Pages CMS. Pages CMS writes a commit (a saved version) to GitHub. Netlify sees the commit, builds the site and publishes it, usually in a few minutes.

**A successful save is not a successful deploy.** Check Netlify, **Deploys**. A failed build shows a message naming the file and field, and visitors keep seeing the previous version. On Netlify's free plan you are not emailed about failures (an older finding from 2026-11-17), so look at Deploys after you save.

**Build settings are yours to confirm.**

- In the seller's account on 2026-11-25, builds had been stopped to save credits, then reactivated for one deploy, and **auto-publishing was locked**, so a finished deploy had to be published by hand (VERIFIED IN ACCOUNT, seller's project).
- A project you create or receive may behave differently. Check its continuous-deployment settings yourself. The wording of buttons such as "Publish deploy" and "Trigger deploy" comes from the repository's own instructions ([docs/ROLLBACK.md](./docs/ROLLBACK.md)) and is UNVERIFIED in your account.
- Each production deploy used about 15 credits (VERIFIED IN ACCOUNT 2026-11-25; Netlify's pricing page agrees). The free plan allows 300 credits a month. Batch your edits.

**Which changes trigger a build.** The rule in `netlify.toml` skips a build only when a push changes nothing but `docs/`, `.github/` or Markdown files in the repository root. Guide Markdown and content YAML always build. Developers can test the rule with `node scripts/test-netlify-ignore.mjs` (VERIFIED IN CODE, all rows pass).

**What is verified and what is not.**

- **CMS forms load: VERIFIED IN ACCOUNT 2026-11-25** (Cowork C0, read-only, nothing saved).
- **The full authenticated loop of edit, save, build and live page: UNVERIFIED.** No one has saved a real change through Pages CMS. Test it with one harmless edit, such as a review date, and watch the Deploys page.
- Which branch Pages CMS saves to is expected to be `main` and should be confirmed by that first edit.

**Verified fallback: edit on GitHub.** Open the file in the repository (for example `content/settings.yml`), use the pencil (edit) icon, change the text and commit to `main`. Netlify then builds. A GitHub edit published itself in about a minute on the seller's test site on 2026-11-17 ([docs/LIVE-TEST-RESULTS.md](./docs/LIVE-TEST-RESULTS.md)), and the same direct-edit path was rebuilt locally on 2026-11-24.

Screenshot pending (buyer-06-netlify-deploys).

**Check a change is live:** wait for the Netlify deploy to show Published, then reload the page with your edit (hold Shift while reloading to skip a stored copy). If it is not there, go to section 8.

## 7. Monthly maintenance

No daily routine is needed.

**After every update:** check Netlify Deploys shows Published, then open the changed page.

**Monthly (about 20 minutes):**

- [ ] Open the home page, one guide, the Gear page and the packing planner on your phone.
- [ ] Check Netlify credits remaining.
- [ ] Check Google Analytics records visits and Search Console shows no new errors.
- [ ] Click three affiliate buttons and confirm they carry your tag.

**Periodically:**

- **Data refresh.** The pet-policy dataset is a dated snapshot from 2026-11-18. Re-read every manager page at least every six months, following [docs/DATA-RECHECK-LOG.md](./docs/DATA-RECHECK-LOG.md). The data file is code, so this needs a developer.
- **Domain renewal (your responsibility).** The domain expires **2027-11-17**. The seller is deliberately NOT renewing or turning on auto-renew: renewal belongs to the new owner. On day one, in your own Namecheap account, turn Auto-Renew on (or put a calendar reminder at least 60 days before 2027-11-17). A missed renewal can lose the domain.
- **HTTPS certificate (your responsibility after transfer).** The seller is not renewing the certificate. The current certificate expires **2027-02-14**. Netlify normally renews it by itself once your domain's DNS points at your Netlify site, but on 2026-11-25 Netlify flagged "Certificate renewal incomplete: missing domains pawsandpassage.com" for the apex domain (VERIFIED IN ACCOUNT). After the transfer, open Netlify > Domain management > HTTPS, and if the flag is still there click the renew/provision option; check again in January 2027 before the expiry date.
- **Netlify credits** if the site grows.

## 8. If something goes wrong

| Problem                       | What to check                                                                                                                                               | What to do                                                                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edit not showing              | Netlify Deploys: did a deploy start, and is it Published? Is the item a code-managed guide? For a new article, are all four publishing items in Task B set? | Wait five minutes. If the deploy says Failed, open the log. If it needs publishing by hand, publish it. For a code-managed guide, you need a developer. |
| Failed build                  | The log names a file and a field.                                                                                                                           | Fix that field (usually a missing or wrong value) and save. The live site is untouched meanwhile.                                                       |
| Product button disappeared    | Is the product ticked "Show this product?" Does it have an approved affiliate entry, a maker address or a retailer address?                                 | The button order is approved affiliate link, then maker page, then retailer page, then none. Restore one of them.                                       |
| Stay disappeared              | Does its "Where the facts came from (listing link)" point to Vrbo or Airbnb? Did someone change the directory mode?                                         | Restore the source link. In the old "affiliate-only" mode a stay needs an approved link.                                                                |
| Packing updates not appearing | Did the build fail? Is the item active and its rule matching the trip you test?                                                                             | Check Deploys, then test with the right trip type and conditions.                                                                                       |
| Domain not working            | Namecheap Advanced DNS and Netlify domain settings.                                                                                                         | Compare with your "before" screenshot. Fix only website records. Allow up to a day for DNS to spread.                                                   |
| Email stopped after transfer  | Are the mail records (MX and TXT) still present?                                                                                                            | Restore any missing ones from your screenshot. Do not change nameservers. [docs/EMAIL-AND-TRANSFER.md](./docs/EMAIL-AND-TRANSFER.md)                    |
| Analytics not recording       | Is the Google Analytics ID in Business settings yours and correct?                                                                                          | Fix the value and wait for the build. Check Realtime in Google Analytics.                                                                               |
| Restore an older version      | GitHub history, or Netlify Deploys.                                                                                                                         | GitHub: open the bad commit and revert it. Netlify: publish an earlier good deploy. Steps: [docs/ROLLBACK.md](./docs/ROLLBACK.md).                      |

## 9. What needs a developer

This is a **custom React application, not WordPress**. There is no plugin store or visual page builder.

| Task                                     | Pages CMS? | Developer needed?                                |
| ---------------------------------------- | ---------- | ------------------------------------------------ |
| Edit a supported Markdown article        | Yes        | No                                               |
| Gear product details                     | Yes        | No                                               |
| Packing items and their products         | Yes        | No                                               |
| Affiliate IDs and links                  | Yes        | No                                               |
| Contact info and other business settings | Yes        | No, unless the domain changes (a few file edits) |
| The 7 legacy code-managed guides         | No         | Yes, or direct GitHub edits if you are confident |
| Redesign, new page type or new tool      | No         | Yes                                              |
| Publishing logic and rules               | No         | Yes                                              |
| Dependency or build failures             | No         | Yes                                              |
| Legal pages, towns, Gear category text   | No         | Yes                                              |

## 10. Transfer completion

You are done when the sign-off block in [docs/TRANSFER_CHECKLIST.md](./docs/TRANSFER_CHECKLIST.md) is complete: you control the domain, repository and hosting; the site loads; the seller's identifiers are replaced; documents are signed; and the seller's access is removed. An invitation sent is not a completed transfer.

**You fully own the site when you can, without the seller:** renew or manage the domain in your Namecheap account; open and change the repository on GitHub; publish from your own Netlify project; save in Pages CMS; read mail at your business address; and see only your own identifiers in the audit.

## 11. Important things to know

- **Rights documents.** The assignment of copyright must be signed. Until it is, the text and code are not yours by transfer alone.
- **Photos.** Unsplash licenses are nonexclusive. Keep the credits. The pins and share images use those photos, so their rights follow the same licenses.
- **The dataset** was compiled from public manager pages. It is not a guarantee of any current policy, and the managers' own terms were not reviewed.
- **Pre-revenue.** No traffic, rankings or earnings are promised. Domain registered November 16, 2026.
- **Legal pages** (privacy, terms, affiliate disclosure) were not reviewed by a professional. No legal or compliance certification exists. Consider your own review.
- **Stays** are not confirmed with hosts. The site says so; keep saying so.
- **Provider rules change.** Affiliate programs, Netlify plans and Namecheap prices change. Recheck before relying on this guide.

## 12. Costs and accounts

Prices below are public list prices read on **2026-11-25** unless noted. They are not the seller's bills. Check current pricing before transferring.

| Service                                          | Needed?                  | Expected cost                                                                                                                  | Important note                                                                                                                                                           |
| ------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Namecheap domain renewal                         | Yes                      | $19.98 a year plus the ICANN fee (Namecheap notice, effective 2026-11-01; read 2026-11-25)                                     | Auto-renew is OFF now. First-term price is not your renewal price.                                                                                                       |
| Business email (Namecheap Private Email, Launch) | Optional                 | Listed $14.88 a year (read 2026-11-25)                                                                                         | The page does not say whether this is a renewal price. Not moved with the domain.                                                                                        |
| Netlify                                          | Yes                      | Free $0 with 300 credits a month; Personal $9 a month with 1,000 credits; Pro $20 a month with 3,000 credits (read 2026-11-25) | A production deploy uses 15 credits. The seller's account showed 1,000 credits (VERIFIED IN ACCOUNT); your plan may differ.                                              |
| GitHub                                           | Yes                      | Free plan $0 (read 2026-11-25)                                                                                                 | Keep the repository public or budget for paid features.                                                                                                                  |
| Pages CMS                                        | Optional but recommended | Its site says it is free (read 2026-11-25)                                                                                     | Small open-source project with no stated guarantee. Your content stays in GitHub.                                                                                        |
| Analytics (Google)                               | Recommended              | $0                                                                                                                             | Create your own property.                                                                                                                                                |
| Lovable                                          | Not needed               | $0                                                                                                                             | Only if a clean independent build is demonstrated. It was: [docs/buyer/HOSTING_OPTIONS.md](./docs/buyer/HOSTING_OPTIONS.md). Do not run Lovable prompts on this project. |
| Optional developer tools                         | Optional                 | Varies                                                                                                                         | Check current pricing before transferring.                                                                                                                               |

A typical year is a domain plus optional email, but you must confirm each price when you buy. Nothing here promises $0 a month.

## Advanced / developer

Only needed for technical changes. Everything above works without these commands.

- **Get the code.** Clone the repository from GitHub (a clone is a full local copy).
- **Install and test.** Use Node 22. `npm ci` installs; `npx vitest run` runs the tests (783 pass in 61 files at the counted commit).
- **Build.** `npm run build` is what Netlify runs. `NITRO_PRESET=node-server npx vite build` makes a plain Node server in `.output`.
- **Check a live site.** `node scripts/verify-site.mjs https://www.pawsandpassage.com` (319 checks pass on a local build).
- **Scripts.** `node scripts/audit-seller-ids.mjs` (seller identifiers), `node scripts/neutralize-seller-vrbo-links.mjs` (switch off seller Vrbo links; dry run first), `node scripts/test-netlify-ignore.mjs` (build-skip rule).
- **Advanced reference: only needed for technical changes.** [HANDOVER.md](./HANDOVER.md) (developer notes), [docs/OPERATIONS-HANDBOOK.md](./docs/OPERATIONS-HANDBOOK.md), [docs/buyer/ROUTE_AND_ASSET_COUNTS.md](./docs/buyer/ROUTE_AND_ASSET_COUNTS.md) (every count and how it was made), [docs/BUYER_ASSET_INVENTORY.md](./docs/BUYER_ASSET_INVENTORY.md).
