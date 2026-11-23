# Buyer transfer checklist: Paws & Passage (pawsandpassage.com)

Prepared 2026-11-23 for a quick, pre-revenue turnkey sale. Companion audit: `docs/flip/audit-legal-transfer.md`.
Labels: **VERIFIED** (read in this repo today, path given) or **UNVERIFIED** (from older docs or needs a live check).
No passwords, keys or private data belong in this file. Hand credentials over only through each service's own transfer or invite feature.

This file does not repeat the detailed procedures. Follow them in: `docs/DNS-AND-TRANSFER.md` (domain, DNS, Netlify, GitHub, Pages CMS), `docs/EMAIL-AND-TRANSFER.md` (mailbox), `BUYER_HANDOVER.md` and `HANDOVER.md` (buyer orientation), `docs/COSTS-AND-ACCOUNTS.md` (costs), `docs/OPERATIONS-RECORD.md` (account register), `docs/SECURITY-AND-RECOVERY.md` (2FA, restore), `docs/OPERATIONS-HANDBOOK.md` (running the site). Those docs are dated 2026-11-16 to 2026-11-18 and partly stale (see section 0).

## 0. What is being sold (no traffic or earnings claims)

- A static-content TanStack Start site (React, Tailwind, Vite) with content in `/content` (VERIFIED: `content/`): 26 guide files, of which 23 are `status: published` and 3 are not (`breed-restrictions-at-vacation-rentals`, `bringing-a-dog-to-a-no-pets-rental`, `pet-friendly-listing-red-flags`); 37 stay files, all `status: unverified` (so none is shown on the live site: `plugins/content.ts` publishes stays only when `verified`); 14 place files; a 38-manager pet-policy dataset (`public/pet-policies-38-managers.csv`, 39 lines with header).
- Stale statements in older docs: "24 guides" (`docs/SALE-READINESS.md`) and "only Verified stays appear" (true in code, but there are zero verified stays, so the Stays section is effectively empty to visitors). Do not repeat either in a listing without rechecking.
- Revenue today: none claimed. `docs/SALE-READINESS.md` itself says monthly net profit is $0. Do not state traffic, rankings or earnings; none are evidenced in the repo.

## Classification summary

| Asset | Class | Why |
|---|---|---|
| Domain pawsandpassage.com (Namecheap) | TRANSFERS | Account-to-account Change Ownership, free, per `docs/DNS-AND-TRANSFER.md` s.6a. |
| DNS records (Namecheap Advanced DNS) | TRANSFERS (with the domain) | Namecheap says a push does not change DNS (cited in `docs/DNS-AND-TRANSFER.md`). |
| Namecheap Private Email, hello@ | OWNER DECISION, then TRANSFERS or BUYER MUST REPLACE | Not pushed with the domain; support-assisted transfer or new subscription plus IMAP copy (`docs/EMAIL-AND-TRANSFER.md`). A fresh empty mailbox is simplest. |
| Netlify project `paws-passage-test` | TRANSFERS (project transfer) or BUYER MUST REPLACE | Netlify Team Owner can transfer a project; side effects unconfirmed. Re-creating from the repo is the fallback. |
| GitHub repo `meggzzcode/paw-passage` | TRANSFERS | Repository transfer (Settings > Danger Zone). Public repo; history includes the seller's git author email. |
| Pages CMS | BUYER MUST REPLACE (re-link) | Account-less tool; buyer signs in with GitHub and installs the Pages CMS GitHub App on the repo owner (`.pages.yml`). Not yet opened live per its own header comment. |
| Code and original content | TRANSFERS (by assignment) | Needs a written assignment; no LICENSE file exists. |
| Unsplash photos | TRANSFERS as licensed use (not ownership) | Unsplash License is non-exclusive; credits must stay. |
| Home hero image | RESOLVED | Replaced with a credited Unsplash photo. Unsplash gives usage rights, not ownership or exclusivity. |
| Dataset CSV | OWNER DECISION / risk | Facts compiled from manager pages; terms-of-use not reviewed. |
| GA4 property (G-1J97C8CPC1) | NOT TRANSFERABLE as the seller's login; BUYER MUST REPLACE (or have access granted) | Property admin can be added to the buyer's Google account, but the owner must do that. Default: buyer creates own property. |
| Search Console property | BUYER MUST REPLACE | Verification file and ownership are per account. |
| Pinterest Business account | OWNER DECISION | Accounts are generally not transferable; handle: login handover only if buyer accepts the risk (UNVERIFIED). |
| Amazon Associates tag pawspassage-20 | NOT TRANSFERABLE | Tied to the seller's account and terms; buyer applies for own ID. |
| Vrbo/Expedia affiliate links (33 `vrbo.com/affiliate` deeplinks) | NOT TRANSFERABLE | Tied to the seller's affiliate account; buyer must regenerate. |
| Impact site-verification meta tag | NOT TRANSFERABLE | Seller's Impact account; `src/routes/__root.tsx` comment says remove at sale. |
| Awin | UNVERIFIED | No Awin ID found in code (grep of `src`, `content`). Check seller's account list. |
| Lovable workspace | NOT NEEDED | Optional builder, not required to run (`docs/OPERATIONS-RECORD.md`). Build uses npm package `@lovable.dev/vite-tanstack-config`. |

## 1. Domain (Namecheap)

- **Who acts:** Seller starts, buyer accepts. Buyer needs a Namecheap account first.
- **Steps:** Follow `docs/DNS-AND-TRANSFER.md` s.6a: Domain List > Manage > Sharing & Transfer > Change Ownership; enter the buyer's Namecheap **username** (not email); seller confirms with their account password; choose the Registrant Contact option; buyer accepts. Free. Seller removes any shared-access managers first.
- **60-day rule (ICANN):** a change of registrant can lock a later move to a different registrar for 60 days unless the registrant opts out. Whether a Namecheap account-to-account Change Ownership triggers that lock is **UNVERIFIED**: older docs record conflicting Namecheap sources, and my attempt to read an official Namecheap page today returned the wrong article. Ask Namecheap support in writing before closing; tell the buyer that moving to another registrar may be blocked for up to 60 days. Staying at Namecheap is unaffected.
- **Before the push:** seller confirms domain not expired (expired domains cannot be moved), auto-renew state, domain privacy on, registrant contact is the seller (not a third party). Domain was bought 2026-11-17 (`docs/OPERATIONS-RECORD.md`); a new registration is normally also subject to the ICANN 60-day post-registration transfer lock to other registrars (general ICANN policy; confirm on the Namecheap domain page). That lock ends about 2027-01-16 (UNVERIFIED arithmetic from the purchase date).
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
- **Note:** Free plan is 300 credits a month, a hard limit; each production deploy is 15 credits (`docs/COSTS-AND-ACCOUNTS.md` s.1a, UNVERIFIED today).
- **Evidence:** Netlify transfer confirmation, a successful production deploy on the buyer's team, HTTPS padlock screenshot.
- **Risk:** Medium (downtime if domain is switched before the new site works).

## 4. GitHub repository

- **Who acts:** Seller (admin) transfers; buyer accepts.
- **Steps:** Settings > Danger Zone > Transfer; enter buyer's username or org; confirm. Then buyer rotates any tokens, sets branch protection, enables secret scanning (public repo).
- **Seller cleanup first:** remove seller-only collaborators and deploy keys; check the Actions workflows (`.github/workflows/ci.yml`, site health) run on the buyer's account.
- **History note:** git history contains the seller's author email (a personal-looking address) on 41 commits and 253 commits by the Claude author. History cannot be rewritten without breaking links; disclose it or ask the owner whether to squash into a fresh repo (OWNER DECISION).
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
- **Steps:** (a) Signed assignment of copyright in the original text, code and docs (no LICENSE file exists). (b) Keep `src/content/image-credits.ts` and `src/content/pack-photos.ts` intact: all guide/gear/destination photos are credited Unsplash photographers; the home hero (`hero-porch*.jpg`) is now a credited Unsplash photo too (unsplash gives usage rights, not ownership or exclusivity). (c) Buyer edits the About page byline paragraph (`src/routes/about.tsx`) and legal pages (see section 14 and the audit).
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
- **Not transferable:** Amazon Associates tag (`amazonTrackingId` in `content/settings.yml`; 63 places in `content/affiliates.yml` use it via `{amazonTrackingId}`), Vrbo/Expedia deeplinks (33 `vrbo.com/affiliate` URLs in `content/affiliates.yml`), Impact verification tag (`src/routes/__root.tsx` lines around 107). Programs forbid or do not mention assignment (read each program's terms; UNVERIFIED).
- **Steps:** Buyer applies to Amazon Associates (a site must usually show real content and, for Amazon, qualifying sales within a set period; verify current terms), Vrbo/Expedia, others. Then update the settings value, regenerate Vrbo links, remove or replace the Impact meta tag. Until then set `amazonTrackingId` to "" (Amazon links hide automatically per `src/config/site.ts`) and set affiliate links `approved: false` to avoid paying the seller by accident or breaching terms.
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
