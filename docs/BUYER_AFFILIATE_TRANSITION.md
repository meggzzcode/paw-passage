# Buyer affiliate and tracking transition

Written 2026-11-24. This is the step-by-step for replacing the seller's affiliate, analytics and partner identifiers with the
buyer's own. Nothing here needs a developer: every step is an edit in Pages CMS or in a file on GitHub, plus two commands.

## 0. What is and is not included in the sale

- **The seller's affiliate accounts are NOT included in the sale and do not transfer.** That covers the Amazon Associates account
  and its tracking ID, the Vrbo / Expedia Group affiliate account (Impact) and every deeplink created in it, the Google Analytics 4
  property, Google Search Console, the Pinterest account, and any Stay22 account. Commission links in the site today pay the seller,
  not the buyer. The buyer must open their own accounts, be approved by each programme, and put their own IDs in.
- The site's code, content, and the way it builds links ARE included. The configuration below is what changes.
- A link or ID being present in a file proves nothing about approval. See section 4.

## 1. What the buyer replaces (the full inventory)

Found by `node scripts/audit-seller-ids.mjs` (section 8). Where a value lives, and where the buyer changes it:

| Seller-owned item | Where it lives | Buyer changes it in | Notes |
|---|---|---|---|
| Amazon Associates tracking ID | `content/settings.yml` `amazonTrackingId` (one place) | Pages CMS, Business settings, "Amazon Associates tracking ID" | All 81 Amazon links in `content/affiliates.yml` use `tag={amazonTrackingId}`; changing the one setting retags every link. Leave empty = Amazon buttons disappear (section 5). |
| Vrbo / Impact deeplinks | `content/affiliates.yml`, 79 entries `network: Vrbo` (78 per-listing `vrbo-<listing id>` plus the generic `vrbo`) | Pages CMS, Affiliate links | Each is a deeplink generated in the seller's Impact account. The buyer generates their own for each listing (`docs/cowork/06-vrbo-deeplinks.md`, `docs/stay-deeplink-worksheet.csv`). |
| Google Analytics 4 measurement ID | `content/settings.yml` `ga4MeasurementId` | Pages CMS, Business settings | Empty = no analytics script is sent. Also create the buyer's own GA4 property and key events (`docs/ANALYTICS-SETUP.md`). |
| Impact site-verification tag | `content/settings.yml` `impactSiteVerification` (was hard-coded in `src/routes/__root.tsx` until this change) | Pages CMS, Business settings | Impact issues one per account. Empty = no tag is sent. |
| Pinterest profile link | `content/settings.yml` `pinterestUrl` | Pages CMS, Business settings | Empty hides the footer icon. Pin sheets in `docs/` are the seller's account material. |
| Stay22 account ID | `content/settings.yml` `stay22AccountId` (empty today) | Pages CMS, Business settings | Empty = no Stay22 map. |
| Google Search Console | Domain property in the seller's Google account | Buyer verifies the domain in their own account, submits the sitemap | There is no verification file or meta tag in the repo (`docs/cowork/02-search-console.md`). |
| Bing Webmaster / IndexNow key | `public/<32-hex>.txt`, used by `scripts/indexnow.mjs` | Buyer may keep it (it is public by design and tied to the domain) or replace the file and its content | Informational. |
| Business email, website address | `content/settings.yml` `contactEmail`, `siteUrl`; `public/robots.txt` `Sitemap:` line; `scripts/site-health.mjs` | Pages CMS (email, address); `robots.txt` and `site-health.mjs` need a file edit if the domain changes | Fine to keep if the domain and mailbox transfer with the sale. |
| Netlify, GitHub, domain registrar, Pages CMS login | Accounts | Buyer's own (`docs/TRANSFER_CHECKLIST.md`, `docs/DNS-AND-TRANSFER.md`) | Not affiliate items, listed so nothing is forgotten. |

There is **no** database, Supabase project key, payment key or server secret in the code (checked 2026-11-24, section 10).

## 2. Seller configuration, today

- Amazon: `amazonTrackingId: "pawspassage-20"`, 81 Amazon entries (all with the `{amazonTrackingId}` placeholder, none with a literal tag).
- Vrbo: 79 entries, all marked approved, all seller deeplinks. 78 stay records (of 83) use one; the other 5 stay records have a non-Vrbo source
  and are never listed.
- GA4 `G-1J97C8CPC1`, Impact verification tag, Pinterest profile: all the seller's.
- `stayDirectoryMode: "affiliate-only"` (default, section 6).

## 3. The transfer procedure, in order

Do these in this order. Do not skip ahead to deleting things (section 5 explains what breaks).

1. **Open the buyer's accounts first.** Apply to Amazon Associates (it asks for the site address and reviews the site; new accounts have a
   qualifying-sales window), to Vrbo / Expedia Group affiliates on Impact, and create a GA4 property. Approval is the programmes' decision and can be refused (section 4).
2. **Take a safety copy.** Note the commit you start from (`git log -1`). Everything below is reversible by reverting a commit.
3. **Amazon.** In Pages CMS, Business settings, paste the buyer's tracking ID (looks like `yourname-20`) into "Amazon Associates tracking ID".
   Save. Wait for the Netlify build. Do not edit the 81 Amazon entries; they pick the new ID up by themselves.
4. **GA4.** Paste the buyer's `G-XXXXXXXXXX` into "Google Analytics ID". Empty it instead if there is no property yet.
5. **Impact verification and Pinterest.** Replace with the buyer's values, or empty them.
6. **Vrbo, when the buyer is approved:** for each stay, generate the buyer's deeplink and replace the `url` of the matching entry
   (same `id`, for example `vrbo-1056490`) in Pages CMS "Affiliate links", then tick Approved. Do not rename ids: stay files and one article
   refer to them by name. `docs/cowork/06-vrbo-deeplinks.md` is the click-by-click for the Vrbo hub and `docs/cowork/12-vrbo-click-test.md` tests them.
7. **Vrbo, if the buyer is NOT yet approved** and the seller's links must go now: run
   `node scripts/neutralize-seller-vrbo-links.mjs` (dry run, prints what it would change), then `node scripts/neutralize-seller-vrbo-links.mjs --write`.
   It switches the 79 seller deeplinks off (address set to `https://www.vrbo.com/`, Approved off) and keeps the entries, so the build still passes.
   Then read section 6 about what the stay directory does next.
8. **Run the audit** (section 8): `node scripts/audit-seller-ids.mjs --expect-none` must exit 0.
9. **Verify outbound links** (section 7).
10. Update the disclosure wording if the buyer's programme mix differs (section 9).

## 4. What "approved" means

In this site, `approved: true` on a link in `content/affiliates.yml` only means *a person decided the button may show*. The site then shows a
"Book" or "Buy" button with an "Affiliate link" label. It is **not** proof that the buyer (or anyone) was approved by Amazon, Vrbo or Impact, and nothing in
the code checks with those programmes. The seller's links are marked approved because the seller was approved; **a buyer who pastes their own link and ticks Approved
before their programme has approved them is making a false statement on the page and may earn nothing, or be removed from the programme.** Only tick Approved
after the programme's own dashboard shows the buyer approved and the link is generated from the buyer's account. Amazon in particular needs
qualifying sales within its window after sign-up; do not claim earnings the site does not have.

## 5. What breaks or disappears if seller IDs are removed first

Tested 2026-11-24 on a throwaway copy (full build plus `scripts/verify-site.mjs`; nothing deployed):

| Action | Result |
|---|---|
| Set `amazonTrackingId` to empty | Build passes. All 81 Amazon entries resolve to no address, so no Amazon button, no seller tag anywhere, no Amazon disclosure sentence in articles. Products fall back to the maker's page, then a plain retailer link, then no button. 16 products whose only "maker" source is an Amazon page keep a plain, **untagged** link labelled "See it on Amazon" (earns nothing, carries no affiliate label). Articles stop calling out products without a link of their own, and the packing planner's shopping panels shrink to match. |
| Delete Vrbo entries from `affiliates.yml` | **The build fails** with "the booking link vrbo-... does not exist in Affiliate links" (nine stay files name one) and "the article uses affiliate link vrbo ..." (one article). Use step 7 of section 3 instead, never delete. |
| Switch the Vrbo entries off (step 7) | Build passes. **The stay directory empties** (see below). |
| Empty `ga4MeasurementId` | No analytics script. Pages unaffected. |
| Empty `impactSiteVerification` | The tag is not sent. Impact cannot confirm ownership for the buyer until the buyer's own value is in. |

**Stay directory when the Vrbo links are removed (default mode).** The directory is tied to approved affiliate links on purpose (owner decision
2026-11-18, `STAYS_REQUIRE_AFFILIATE_LINK` in `src/content/publish-rule.ts`): a stay is listed only while it has an approved link. Today: 83 stay records, **78 listed, 23 indexable**.
With every seller link off: **0 listed, 0 indexable**. The stay pages return 404, `/stays` and the stay pages leave the sitemap (the test build went from 103 sitemap URLs to 73), and
any search ranking those pages earned is lost until links come back. The five stays without a Vrbo source stay unlisted either way. This happened in the test above.

## 6. The explicit non-affiliate fallback: `stayDirectoryMode`

A single documented setting, **off by default**, so that the buyer is not forced to choose between "keep the seller's links" and "empty directory".

- Setting: `stayDirectoryMode` in `content/settings.yml` (Pages CMS, Business settings, "Which stays are listed").
- `affiliate-only` (default, exactly today's behaviour): list a stay only while it has an approved affiliate link.
- `public-sources`: list every stay that has a public Vrbo or Airbnb source address (78 stays, 23 indexable, the same as today), even with no affiliate link. For these stays:
  - the button is the plain public link ("See photos and dates on Vrbo"), `rel="nofollow noopener"`, **no** "Affiliate link" label, no commission wording, no seller deeplink;
  - pages keep their existing wording: details "read from the listing, not confirmed with the host", and the "Not confirmed" markers;
  - nothing says the stay is verified, approved, or partnered. A stay that has the buyer's own approved link still shows the affiliate button as usual.
- Not changed by this mode: no stay is claimed host-verified, no editorial text changes, and no new link type is created.

**This is an owner decision, not a default.** It changes the site's monetisation policy (a directory of stays that earn nothing) and the SEO footprint (pages stay
indexed), so it is shipped switched off. Owner to decide before sale whether to leave it for the buyer to switch on. Tests: `src/test/stay-directory-mode.test.ts`.

## 7. Verifying outbound links

After each build, from a clone: `npm ci`, `npm run build:node`, `PORT=4400 node .output/server/index.mjs`, then `node scripts/verify-site.mjs http://127.0.0.1:4400 --site-url https://yourdomain.com`.
Then by hand on the live site (also in `docs/cowork/07-amazon-links.md` and `12-vrbo-click-test.md`):

1. Open three product buttons: the address must contain `tag=<buyer's ID>`. View-source search for the seller's old tag: it must find nothing.
2. Open a stay page: with the buyer's own deeplink the button label is "Affiliate link" and the address is the buyer's deeplink; in fallback mode it is the plain Vrbo/Airbnb listing and has no affiliate label.
3. Click one Vrbo link through to confirm it lands on the right listing and, in the buyer's Impact dashboard, that the click is recorded. Programmes report with delay; do not count a click as earning.
4. In the browser's network tab or GA4 DebugView, confirm events carry the buyer's GA4 ID only.

## 8. The audit script

```
node scripts/audit-seller-ids.mjs                 plain report (exit 0)
node scripts/audit-seller-ids.mjs --expect-none   exit 1 while any seller identifier remains in live files
node scripts/audit-seller-ids.mjs --json          machine-readable
node scripts/audit-seller-ids.mjs --strict        also fail while the seller's contact email / domain remain
node scripts/audit-seller-ids.mjs --include-docs  also fail while docs/ still quote the seller's IDs
```

It is read-only and offline. It lists the settings that still hold the seller's values, the affiliate entries that are the seller's deeplinks, **every stay record that uses one**
(78 of 83 today), and every file that contains a seller identifier, with the kind of match and a line number. Documentation files that quote the old IDs are listed as `info` and do not fail
the audit unless `--include-docs`. Seller fingerprints come from `scripts/seller-ids.json` (public identifiers, not secrets); delete that file once the audit passes. Without it the
script assumes everything it finds is the seller's. Today's result: 5 blocking items (the four settings plus the 79 Vrbo deeplinks), exit 1.

Typical buyer run: change the settings, run `node scripts/neutralize-seller-vrbo-links.mjs --write` or paste own deeplinks, then `node scripts/audit-seller-ids.mjs --expect-none` until it ends with
"no seller identifiers remain in live files."

## 9. Wording the buyer must re-check

- `/affiliate-disclosure` (TypeScript page, `src/routes/affiliate-disclosure.tsx`) says Amazon's required statement appears wherever a link goes to Amazon and that stays and products
  with no affiliate link are treated the same. Both stay true after the transition, but if the buyer is **not** an Amazon Associate the disclosure should not keep implying the programme. Edit that file (a developer or the buyer's AI assistant).
- Amazon's Operating Agreement allows only Amazon's own statement; `AMAZON_DISCLOSURE` in `src/content/affiliates.ts` is shown only when an approved Amazon link is on the page.
- Copy such as `BUYER_HANDOVER.md` and the docs under `docs/` quote the seller's IDs as history; they are informational.

## 10. Tracking and secrets found in the 2026-11-24 sweep

- No API keys, tokens, private keys or passwords in the working tree or in the 514-commit history (regex scan, no scanner installed; matches were prose false positives such as "ask-the-host").
- No Supabase or other backend keys in client code. `src/lib/lovable-error-reporting.ts` only calls Lovable's editor hook when it exists in the page. The build uses `@lovable.dev/vite-tanstack-config` from public npm.
- Seller-specific values that **are** public by nature: GA4 ID, Amazon tag, Impact verification value, Vrbo deeplink codes, IndexNow key. They are identifiers, not credentials; they still must be replaced.
- Environment variables: none required. `SHOW_DRAFTS` is set to `false` for preview contexts in `netlify.toml`; the content plugin refuses a build that sets it on production.
