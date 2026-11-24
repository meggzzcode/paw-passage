# Buyer transfer checklist: Paws & Passage (pawsandpassage.com)

Prepared 2026-11-23, counts and hosting refreshed 2026-11-24 for a quick, pre-revenue starter-site sale. Package order: `docs/buyer/TRANSFER_PACKAGE_INDEX.md`. Companion audit: `docs/flip/audit-legal-transfer.md`.
Labels: **VERIFIED** (read in this repo today, path given) or **UNVERIFIED** (from older docs or needs a live check).
No passwords, keys or private data belong in this file. Hand credentials over only through each service's own transfer or invite feature.

This file does not repeat the detailed procedures. Follow them in: `docs/DNS-AND-TRANSFER.md` (domain, DNS, Netlify, GitHub, Pages CMS), `docs/EMAIL-AND-TRANSFER.md` (mailbox), `BUYER_HANDOVER.md` and `HANDOVER.md` (buyer orientation), `docs/COSTS-AND-ACCOUNTS.md` (costs), `docs/OPERATIONS-RECORD.md` (account register), `docs/SECURITY-AND-RECOVERY.md` (2FA, restore), `docs/OPERATIONS-HANDBOOK.md` (running the site). Those docs are dated 2026-11-16 to 2026-11-18 and partly stale (see section 0).

## 0. What is being sold (no traffic or earnings claims)

- A TanStack Start site (React, Tailwind, Vite), server rendered, with content in `/content` (counts at repo `HEAD` `9797221`, 2026-11-24; commands and method in `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`): 32 guide files (25 Markdown in `content/guides`, 7 TypeScript in `src/content/guides`), of which **29 are published** and 3 are drafts (`breed-restrictions-at-vacation-rentals`, `bringing-a-dog-to-a-no-pets-rental`, `pet-friendly-listing-red-flags`); 8 "things to do with a dog" town articles (not guides); **83 stay files, 0 host-confirmed** (all `status: unverified`; pages say details are not confirmed with the host), of which **78 are shown** because they have an approved booking link, **23 are indexable** (in the sitemap), 55 are shown but `noindex` and 5 are hidden; 14 place files (0 public); a 38-manager pet-policy dataset (`public/pet-policies-38-managers.csv`, 38 rows x 13 fields); **3 tools** (packing planner, will my dog be accepted, before-you-book checklist); 11 gear categories with 65 active products (92 records) and 5 trip collections; a **103-URL sitemap**; **771 passing tests in 59 files**.
- **Nothing is deployed.** Production serves a build from about 2026-11-23 and is stale (98 sitemap URLs, old guide titles). The first step after the buyer's deploy is the verification in `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`.
- Stale statements in older docs: "24 guides", "30 guides", "32 listed stays", "37 stay files", "53 active products", "only Verified stays appear", "95 URLs", "98 URLs", "498 tests", "15-item packing list", calculators and per-button affiliate labels (the current figures are above). Do not repeat them in a listing without rechecking.
- Revenue today: none claimed. Traffic (HISTORICAL baseline on the older production build): Search Console reported 236 impressions and 0 clicks over 28 days; URL Inspection showed 21 of 23 inspected pages indexed (OWNER; screenshots kept privately). Do not state rankings or earnings; none are evidenced in the repo.
- Domain: registrar start 2026-11-16, valid to 2027-11-17, auto-renew OFF pending the owner's decision (decide before the push, section 1).

## Classification summary

| Asset | Class | Why |
|---|---|---|
| Domain pawsandpassage.com (Namecheap) | TRANSFERS | Account-to-account Change Ownership, free, per `docs/DNS-AND-TRANSFER.md` s.6a. |
| DNS records (Namecheap Advanced DNS) | TRANSFERS (with the domain) | Namecheap says a push does not change DNS (cited in `docs/DNS-AND-TRANSFER.md`). |
| Namecheap Private Email, hello@ | OWNER DECISION, then TRANSFERS or BUYER MUST REPLACE | Not pushed with the domain; support-assisted transfer or new subscription plus IMAP copy (`docs/EMAIL-AND-TRANSFER.md`). A fresh empty mailbox is simplest. |
| Netlify project `paws-passage-test` | TRANSFERS (project transfer) or BUYER MUST REPLACE | Netlify Team Owner can transfer a project; side effects unconfirmed. Re-creating from the repo on the buyer's own free account is the recommended path. The seller's builds are stopped to preserve credits. |
| GitHub repo `meggzzcode/paw-passage` | TRANSFERS | Repository transfer (Settings > Danger Zone). Public repo; history includes the seller's git author email. |
| Pages CMS | BUYER MUST REPLACE (re-link) | Account-less tool; buyer signs in with GitHub and installs the Pages CMS GitHub App on the repo owner (`.pages.yml`). Not yet opened live: the authenticated flow is UNVERIFIED (`docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`, section "Pages CMS"). |
| Code and original content | TRANSFERS (by assignment) | Needs a written assignment; no LICENSE file exists, and the assignment text is a seller and legal item (not drafted in the repo). |
| Unsplash photos | TRANSFERS as licensed use (not ownership) | Unsplash License is non-exclusive; credits must stay. |
| Home hero image | RESOLVED | Replaced with a credited Unsplash photo. Unsplash gives usage rights, not ownership or exclusivity. |
| Dataset CSV | OWNER DECISION / risk | Facts compiled from manager pages; terms-of-use not reviewed. |
| GA4 property (G-1J97C8CPC1) | NOT TRANSFERABLE as the seller's login; BUYER MUST REPLACE (or have access granted) | Property admin can be added to the buyer's Google account, but the owner must do that. Default: buyer creates own property. |
| Search Console property | BUYER MUST REPLACE | Verification file and ownership are per account. |
| Pinterest Business account | OWNER DECISION | Accounts are generally not transferable; handle: login handover only if buyer accepts the risk (UNVERIFIED). |
| Amazon Associates tag pawspassage-20 | NOT TRANSFERABLE | Tied to the seller's account and terms; buyer applies for own ID. |
| Vrbo/Expedia affiliate links (33 `vrbo.com/affiliate` deeplinks, marked approved; approval itself is not proof of a partnership) | NOT TRANSFERABLE | Tied to the seller's affiliate account; buyer must regenerate. |
| Impact site-verification meta tag | NOT TRANSFERABLE | Seller's Impact account; `src/routes/__root.tsx` comment says remove at sale. |
| Awin | UNVERIFIED | No Awin ID found in code (grep of `src`, `content`). Check seller's account list. |
| Lovable workspace | NOT NEEDED, NOT TRANSFERRED | Optional design tool; no paid Lovable usage is required (`docs/HOSTING_PORTABILITY_REPORT.md`). The seller disconnects Lovable's GitHub sync at handover. The build uses the free public devDependency `@lovable.dev/vite-tanstack-config` (no account). |

## 1. Domain (Namecheap)

- **Who acts:** Seller starts, buyer accepts. Buyer needs a Namecheap account first.
- **Steps:** Follow `docs/DNS-AND-TRANSFER.md` s.6a: Domain List > Manage > Sharing & Transfer > Change Ownership; enter the buyer's Namecheap **username** (not email); seller confirms with their account password; choose the Registrant Contact option; buyer accepts. Free. Seller removes any shared-access managers first.
- **60-day rule (ICANN):** a change of registrant can lock a later move to a different registrar for 60 days unless the registrant opts out. Whether a Namecheap account-to-account Change Ownership triggers that lock is **UNVERIFIED**: older docs record conflicting Namecheap sources, and my attempt to read an official Namecheap page today returned the wrong article. Ask Namecheap support in writing before closing; tell the buyer that moving to another registrar may be blocked for up to 60 days. Staying at Namecheap is unaffected.
- **Before the push:** seller confirms domain not expired (expired domains cannot be moved), domain privacy on, registrant contact is the seller (not a third party), and **decides auto-renew**: it is currently OFF, so the registration lapses on 2027-11-17 unless renewed (about $19.98 a year). Registrar start date is 2026-11-16 (valid to 2027-11-17); a new registration is normally also subject to the ICANN 60-day post-registration transfer lock to other registrars (general ICANN policy; confirm on the Namecheap domain page). That lock would end about 2027-01-15 (UNVERIFIED arithmetic from the start date).
- **Evidence to keep:** Namecheap confirmation emails, screenshot of the domain list on the buyer's account, support ticket text.
- **Risk:** Medium. Irreversible once accepted (per Namecheap, cited in the doc).

## 2. DNS

- **Who acts:** Buyer after the push; seller advises.
- **Steps:** DNS stays at Namecheap (nameservers `dns1/dns2.registrar-servers.com`, per `docs/COSTS-AND-ACCOUNTS.md`, UNVERIFIED live today). Buyer exports/screenshots Advanced DNS before and after. Records to expect: site records pointing to Netlify, mail records (MX, SPF, DKIM, DMARC), and the Google Search Console TXT record. Details in `docs/DNS-AND-TRANSFER.md` s.3 to 5.
- **Evidence:** before/after record list; dig output of apex and www.
- **Risk:** Low if only the owner changes; high if nameservers are moved without copying mail records.

## 3. Hosting (Netlify, project `paws-passage-test`)

- **Who acts:** Buyer creates Netlify account and team; seller (Team Owner) transfers the project (Project configuration > General > Transfer project), per `docs/DNS-AND-TRANSFER.md` s.6d.
- **After transfer:** recheck Git link to the repo, environment variables (none required for build per `netlify.toml`; `SHOW_DRAFTS=false` is set in `netlify.toml`), custom domain and HTTPS. Netlify's behavior for these is unconfirmed in the older doc.
- **Fallback:** buyer creates a new site from the repo (`netlify.toml`: `npm run build`, publish `dist`, Node 22) and attaches the domain. The project name `paws-passage-test` is a test name; renaming is optional.
- **Note:** Free plan is 300 credits a month, a hard limit; each production deploy is 15 credits (`docs/COSTS-AND-ACCOUNTS.md` s.1a, read 2026-11-18). The owner has stopped builds on the seller's project to preserve credits (about 65 left); the live site shows its last deploy. On the buyer's account the first deploy publishes repo `HEAD`; batch edits afterwards because every Pages CMS save is a deploy.
- **Hosting options (`docs/buyer/HOSTING_OPTIONS.md`, `docs/HOSTING_PORTABILITY_REPORT.md`):** Netlify is recommended. Lovable hosting is optional, was not tested with this site and needs a paid plan for a custom domain; no paid Lovable usage is required. Any Node 22 host works if the buyer recreates the `netlify.toml` redirects and headers. One devDependency (`@lovable.dev/vite-tanstack-config`) is a public, login-free package; a developer can swap it for a plain Vite config if it ever disappears.
- **Seller before handover:** disconnect Lovable's GitHub sync (UNVERIFIED whether connected now) and remove the seller's name from the Netlify team after the project move.
- **Evidence:** Netlify transfer confirmation, a successful production deploy on the buyer's team, HTTPS padlock screenshot.
- **Risk:** Medium (downtime if domain is switched before the new site works).

## 4. GitHub repository

- **Who acts:** Seller (admin) transfers; buyer accepts.
- **Steps:** Settings > Danger Zone > Transfer; enter buyer's username or org; confirm. Then buyer rotates any tokens, sets branch protection, enables secret scanning (public repo).
- **Seller cleanup first:** disconnect Lovable's GitHub sync in the Lovable project settings; remove seller-only collaborators and deploy keys; check the Actions workflows (4 workflows: `ci.yml`, `site-health.yml`, `monthly-digest.yml`, `indexnow.yml`) run on the buyer's account.
- **History note:** git history contains the seller's author email (a personal-looking address) on some commits (re-count at handover; 435 commits at `HEAD` `56552fc`) and many commits by the Claude author. History cannot be rewritten without breaking links; disclose it or ask the owner whether to squash into a fresh repo (OWNER DECISION).
- **Secrets:** scan found no keys or tokens in the working tree or history (see audit). Buyer should still rotate any account tokens they create.
- **Evidence:** transfer email, repo URL on the buyer's account, a green CI run.
- **Risk:** Low.

## 5. CMS (Pages CMS)

- **Who acts:** Buyer.
- **Steps:** Sign in at Pages CMS with GitHub, install the Pages CMS GitHub App on the repo's new owner, open the repo and confirm the forms from `.pages.yml` load. Make one trivial edit to `content/settings.yml` to prove the loop. Note the file's own header says the config has not been opened in the live app (UNVERIFIED that it works).
- **Evidence:** screenshot of a CMS edit becoming a commit and a Netlify deploy.
- **Risk:** Medium (never live-tested). Any CMS save is a production deploy (credit cost).

## 6. Content and images

- **Who acts:** Seller assigns rights in writing; buyer swaps seller-specific text.
- **Steps:** (a) Signed assignment of copyright in the original text, code and docs (no LICENSE file exists). (b) Keep `src/content/image-credits.ts` and `src/content/pack-photos.ts` intact: all guide/gear/destination photos are credited Unsplash photographers (46 credit entries); no third-party (Amazon) product images are used; the home hero (`hero-porch*.jpg`) is now a credited Unsplash photo too (unsplash gives usage rights, not ownership or exclusivity). (c) Buyer edits the About page byline paragraph (`src/routes/about.tsx`) and legal pages (see section 14 and the audit).
- **Do not claim** "unique photos" or product photography; the brief states maker photos are not licensed (`docs/PRODUCT-PHOTOS.md`).
- **Evidence:** signed assignment; export of image credits; hero photo credit in `src/content/image-credits.ts`.
- **Risk:** Medium (derived `public/pins` and `public/share` images were made from the site's photos, rights chain UNVERIFIED).

## 7. Dataset

- **Who acts:** Seller states provenance; buyer accepts the risk knowingly.
- **Facts:** `public/pet-policies-38-managers.csv` compiles stated pet policies of 38 manager websites with the source page and date read (columns `source_page`, `read_on`, VERIFIED). It is published on the site as CC BY 4.0 (`src/routes/data.pet-policies.tsx`). Facts are generally not copyrightable, but the managers' website terms of use and database rights (not an issue in US law, possible elsewhere) were not reviewed (UNVERIFIED). Do not describe it as "licensed" data; describe it as "compiled from public pages".
- **Evidence:** `docs/DATA-RECHECK-LOG.md`, the CSV, a refresh date. Data is dated 2026-11-18 and will age.
- **Risk:** Low to medium.

## 8. Analytics (GA4)

- **Who acts:** Buyer.
- **Steps:** Buyer creates their own GA4 property and replaces `ga4MeasurementId` in `content/settings.yml` (currently seller's `G-1J97C8CPC1`, VERIFIED). Optional: seller adds buyer as property Administrator, then removes self. Until replaced, visits send data to the seller's property. Tell the buyer there is no meaningful history (the seller's record says GA4 was "Not set up" on 2026-11-17, now set; any history is UNVERIFIED).
- **Evidence:** Realtime report showing the buyer's own visit; privacy page still accurate.
- **Risk:** Low.

## 9. Search Console

- **Who acts:** Buyer.
- **Steps:** Seller keeps their property until the buyer has verified theirs (DNS TXT record or HTML file). The existing verification file is `public/c020721357f8d6912ac3f66e4c956986.txt` (VERIFIED; looks like a seller-specific token) and a TXT record in Namecheap DNS. Buyer adds a property, verifies, submits `https://www.pawsandpassage.com/sitemap.xml`, then seller removes their ownership and the old TXT/file is deleted.
- **Evidence:** screenshot of buyer's verified property and sitemap status.
- **Risk:** Low.

## 10. Pinterest

- **Who acts:** Owner decision.
- **Facts:** profile `https://www.pinterest.com/paws_and_passage/` is in `content/settings.yml` and the footer. Pin images exist in `public/pins`. Account transfer terms not verified; safest is buyer opens own profile and the owner deletes or hands over. If handed over, change email and 2FA first. Clear `pinterestUrl` to hide the icon if not transferred.
- **Evidence:** screenshot of profile ownership.
- **Risk:** Low value, medium policy risk.

## 11. Affiliate accounts

- **Who acts:** Buyer applies; seller removes seller IDs.
- **Not transferable:** Amazon Associates tag (`amazonTrackingId` in `content/settings.yml`; all 81 Amazon entries in `content/affiliates.yml` use it via `{amazonTrackingId}`, 71 marked approved, 10 not), Vrbo/Expedia deeplinks (79 entries in `content/affiliates.yml`, all marked approved, 78 of the 83 stay files use one), the Impact verification value (`impactSiteVerification` in `content/settings.yml`), the GA4 ID and the Pinterest URL. `node scripts/audit-seller-ids.mjs` lists them all and `--expect-none` must exit 0 before sign-off; the step-by-step is `docs/BUYER_AFFILIATE_TRANSITION.md`. If the Vrbo deeplinks are removed the stay directory empties unless `stayDirectoryMode: "public-sources"` is chosen (owner decision, section 6 of that file). Programs forbid or do not mention assignment (read each program's terms; UNVERIFIED).
- **Steps:** Buyer applies to Amazon Associates (a site must usually show real content and, for Amazon, qualifying sales within a set period; verify current terms), Vrbo/Expedia, others. Then update the settings value, regenerate Vrbo links, replace or empty the Impact value. Until then set `amazonTrackingId` to "" (Amazon links hide automatically per `src/config/site.ts`) and set affiliate links `approved: false` to avoid paying the seller by accident or breaching terms.
- **Evidence:** program approval emails; a test click on the live site showing the buyer's tag.
- **Risk:** High to the buyer's expectations: the site arrives with no earning ability; seller links must be off before handover.

## 12. Email

- **Who acts:** Owner decision on mailbox; buyer replaces.
- **Facts:** `hello@pawsandpassage.com` is the public contact address (`content/settings.yml`, VERIFIED), rendered by the Contact component. Namecheap Private Email "Launch" (1 mailbox). Follow `docs/EMAIL-AND-TRANSFER.md`. The mailbox must exist and be monitored or Contact, Terms and Privacy point to a dead address. Seller should remove personal forwarding and recovery email on accounts that used hello@ (Pinterest Business used hello@ per `docs/OPERATIONS-RECORD.md`).
- **Evidence:** a test send and reply on the buyer's side; seller's forwards deleted.
- **Risk:** Medium.

## 13. Final sign-off

1. Seller-held IDs removed or replaced (GA4, Amazon, Vrbo, Impact, Search Console, Pinterest).
2. All six account moves confirmed: Namecheap, Netlify, GitHub, Pages CMS, Google (GA4/GSC), mailbox.
3. Site loads on the buyer's Netlify with HTTPS; sitemap returns 200.
4. Seller 2FA/recovery methods removed from transferred accounts; buyer sets own (`docs/SECURITY-AND-RECOVERY.md`).
5. Written asset-purchase agreement: copyright assignment, no revenue/traffic warranties, "as is", AI-assisted disclosure, and the legal pages replaced or reviewed by the buyer.
6. Bill of sale and handover record saved by both parties (no secrets in it).

## 14. Legal pages: buyer actions (see audit for evidence)

Privacy, Terms, Affiliate Disclosure, About, Editorial Standards and Contact read as generic and name no owner or jurisdiction. The buyer should add their own legal entity or name, governing law and contact, and have the pages reviewed. Update the footer text `(c) <year> Paws & Passage` if brand or owner changes.
