# Analytics setup: what the site sends and what the owner configures

Status 2026-11-18. The site code is COMPLETED (events below, tested in `src/test/analytics.test.ts`). Everything in sections 2 to 6 is NEEDS-YOU: it happens in Google, Bing or Pinterest dashboards that no one but the account owner can open. Nothing here costs money. Help pages were read on 2026-11-18; a path marked SUSPECTED could not be confirmed on the official page, so check it on screen.

## 1. Event vocabulary (what the site sends to GA4)

Events are sent only when a GA4 ID is set in `content/settings.yml`. Nothing a visitor types is ever sent; links are reduced to host and path where noted. Names are kept stable on purpose: renaming an event or parameter breaks GA4 history. The parameters that carry the old names (`stay_slug`, `product_id`) stay as they are.

| Event | Fires when | Parameters | Status in code |
|---|---|---|---|
| `booking_click` | Visitor clicks a stay booking or listing button (affiliate or plain link) | `stay_slug`, `partner`, `link_url`, `page_path` | exists (BookingButton) |
| `product_click` | Visitor clicks a gear or product link (guide picks, hub cards, packing tool, inline `aff:` links) | `product_id`, `partner`, `link_url`, `page_path` | exists |
| `accommodation_referral_click` | Click on an accommodation referral link that is not a stay booking button | `partner`, `stay_slug`, `link_url` (host and path), `page_path` | function added in `analytics.ts`; call site TO ADD |
| `hub_card_click` | Click on a card on a hub page | `hub`, `card`, `page_path` | function added; call site TO ADD in the gear hub files (owned by WP4) |
| `outbound_click` | Click on a plain outbound link (maker site, official source) | `link_url` (host and path), `link_label`, `page_path` | function added; call site TO ADD where wanted |
| `tool_start` | Visitor first touches a tool | `tool_name`, `tool_label`, `item_count`, `page_path` | exists |
| `tool_complete` | Visitor gets a result | same | exists |
| `tool_copy` | Copied the result | same | exists |
| `tool_print` | Printed the result | same | exists |
| `packing_trip_edited` | Packing planner: changed the trip details after building a list (`tool_name` = `packing-builder`; `item_count` = items on the list) | same | exists |
| `packing_custom_added` | Packing planner: added one of their own items. The text is never sent | same | exists |
| `packing_item_packed` | Packing planner: ticked "Packed" (`tool_label` = the item's id from `content/packing.yml`, or `custom`) | same | exists |
| `packing_item_need_to_buy` | Packing planner: ticked "Need to buy" (`tool_label` = item id, or `custom`) | same | exists |
| `packing_recommendation_opened` | Packing planner: a product panel opened under an item (once per item per visit; `tool_label` = item id) | same | exists |
| `rules_search` | Used dog-rules search or filters (label is the filter name, never typed text) | same | exists |
| `rules_view` | Opened a place's rules page | same | exists |
| `rules_source_click` | Clicked through to an official source | same | exists |

`tool_name` values in use: `checklist`, `dog-rules`, `packing`, and the dog-accepted checker (see `DogAcceptedChecker.tsx`). The older `docs/TOOL-TRACKING.md` lists fewer; this table is the current one.

Pinterest referrals need no code. Pin links carry `utm_source=pinterest&utm_medium=social&utm_campaign=...&utm_content=...` (see `docs/PINTEREST-SETUP.md`) and GA4 reads utm parameters on its own.

### Calls still to add (files owned by other workers)
- The pet cost check tool (`pet-cost-workflow` events) was removed on 2026-11-24 and no longer fires.
- The stay fee calculator was removed on 2026-11-24 (it needed fee upkeep), so its `stay-fee-calculator` event no longer fires.
- Gear hub card links: `trackHubCardClick({ hub: "gear", card: category.slug, page: loc.pathname })` in the onClick of each card link.
- Plain outbound links in components that render them: `trackOutboundClick({ url, page, label })`.
- The Stay22 map is an embedded frame; clicks inside it cannot be seen by the site. Use Stay22's own dashboard for those. `trackAccommodationReferral` is for any link of ours that goes to a referral partner.

## 2. Google Analytics 4 (analytics.google.com)

Sources: https://support.google.com/analytics/answer/13128484 (key events) and https://support.google.com/analytics/answer/14239696 (custom dimensions), both read 2026-11-18.

| Step | Where | What to do | Cost | Required | How to confirm |
|---|---|---|---|---|---|
| 2.1 Register dimensions | Admin (gear, bottom left) > Data display > Custom definitions > Custom dimensions > Create custom dimensions | Create one per row, Scope = Event, "Event parameter" typed exactly: name `Partner` / `partner`; `Product` / `product_id`; `Stay` / `stay_slug`; `Tool name` / `tool_name`; optional `Tool label` / `tool_label`, `Hub card` / `card`, `Link URL` / `link_url`. Names cannot contain hyphens. Scope and parameter cannot be changed after saving | Free | Required for any breakdown of clicks by partner, product, stay or tool | The five dimensions are listed under Custom definitions. Data appears in reports after 24 to 48 hours and only from the day you register (not backfilled) |
| 2.2 Key events | Admin > Data display > Events | Find `booking_click` and `product_click` in Recent events (they appear only after the first click), click the star. If an event has not fired yet, use Create event and switch on "Mark as key event" (needs Marketer role or higher; a created event may rewrite rules, so prefer waiting for the first real click) | Free | Required for conversion-style reporting | The star is filled; both show in Reports > Engagement > Events with a key-event marker (marker wording SUSPECTED) |
| 2.3 Search channel check | Reports > Acquisition > Traffic acquisition (path SUSPECTED, the official page read did not state it) | Look for the row "Organic Search" after a few weeks. It appears only when Google/Bing visitors arrive | Free | Optional | A non-zero Organic Search row |
| 2.4 Pinterest channel check | Same report, dimension "Session source / medium" (SUSPECTED) | After pins are live, look for `pinterest / social`. If it shows as "Unassigned" or "Direct", a pin link is missing its utm parameters | Free | Optional until pins are live | Sessions from `pinterest / social` |
| 2.5 Note the start date | Reports > Engagement > Pages and screens, widest date range | Write down the first date that has data (a buyer asks for it) | Free | Recommended | Date noted in the tracker |

## 3. Google Search Console (search.google.com/search-console)

Sources: https://support.google.com/webmasters/answer/9008080 (DNS verification) and https://support.google.com/webmasters/answer/7451001 (sitemaps), read 2026-11-18. Changing DNS is the owner's action; this repo does not touch DNS.

| Step | Where | What to do | Cost | Required | How to confirm |
|---|---|---|---|---|---|
| 3.1 Add and verify the domain | Search Console > property selector (top left) > Add property > Domain > `pawsandpassage.com` | Copy the TXT record value. At the domain's DNS host (Namecheap, Advanced DNS) add a TXT record: Host `@`, Value the string. Back in Search Console click Verify. Can take up to two to three days. Do not remove the record afterwards | Free | Required | Property opens with data screens; Settings > Ownership verification shows "Verified" |
| 3.2 Submit the sitemap | Left menu > Sitemaps | Type `sitemap.xml` under "Add a new sitemap" and Submit. You need owner permission. The sitemap lives at https://www.pawsandpassage.com/sitemap.xml; it is also listed in robots.txt | Free | Required | Status "Success" and a discovered-pages count that matches the sitemap |
| 3.3 Request indexing for key pages | Top search bar: paste a page URL > URL Inspection > "Request indexing" (SUSPECTED: label as I remember it, not on the pages I read) | Do this for the home page, /gear and the newest guides only. It is a hint, with a daily quota, and not needed for every page | Free | Optional | Inspection shows "URL is on Google" after crawling |
| 3.4 Read performance | Left menu > Performance > Search results | Monthly: note total clicks, impressions, average position for the last 28 days, and the top 10 pages. Export if needed | Free | Required monthly (feeds `docs/FINANCE-TRACKING.md`) | Numbers recorded |

## 4. Bing Webmaster Tools (bing.com/webmasters)

The official import help page address I tried returned 404 on 2026-11-18, so all Bing UI paths below are SUSPECTED; check them on screen.

| Step | Where | What to do | Cost | Required | How to confirm |
|---|---|---|---|---|---|
| 4.1 Import from Search Console | Sign in with a Microsoft or Google account > Add a site > "Import from Google Search Console" (SUSPECTED) | Authorise read access and import `pawsandpassage.com`. This copies the verification and the sitemaps | Free | Recommended | Site appears in the list as verified |
| 4.2 Submit sitemap | Sitemaps (left menu, SUSPECTED) | Add `https://www.pawsandpassage.com/sitemap.xml` if the import did not carry it | Free | Required | Status shows processed |
| 4.3 IndexNow | See section 5 | Optional extra | Free | Optional | Bing Webmaster "IndexNow" report (SUSPECTED) shows submissions |

Bing traffic is small compared with Google for most sites; the monthly time cost should stay about five minutes.

## 5. IndexNow (Bing and other participating engines)

Protocol read at https://www.indexnow.org/documentation on 2026-11-18.
- COMPLETED: key file `public/c020721357f8d6912ac3f66e4c956986.txt` (32 hex characters; the rule is 8 to 128 letters, digits and dashes). The key is public by design: it only proves the site is yours, and it is not a password. After a deploy it must open at `https://www.pawsandpassage.com/c020721357f8d6912ac3f66e4c956986.txt` and show the key.
- COMPLETED, NOT RUN: `scripts/indexnow.mjs` (dry run by default; `--send` submits to `https://api.indexnow.org/indexnow`, up to 10,000 URLs per request) and `.github/workflows/indexnow.yml` (manual button only, no secrets, with a dry-run choice).
- Responses: 200 received, 202 received and key check pending, 403 key not found or invalid, 422 URLs not on this host, 429 too many requests. A 200 means the submission was received, not that pages are indexed.
- Limits: IndexNow tells engines a page exists or changed; it does not guarantee indexing or ranking, and Google does not take part in IndexNow (SUSPECTED: the documentation page I read names no engines; check the current participants list on indexnow.org). Submit only after a production deploy; do not resubmit unchanged pages repeatedly, which can trigger 429.
- To use: after the bulk merge and deploy, open the key URL to confirm it works, then GitHub > Actions > IndexNow > Run workflow (dry run first, then with "Really send" ticked). Cost: free. Optional.

## 6. Pinterest analytics (pinterest.com)

Sources: https://help.pinterest.com/en/business/article/pinterest-analytics and https://help.pinterest.com/en/business/article/claim-your-website, read 2026-11-18.
- Needs a Pinterest business account (NEEDS-YOU, see `docs/PINTEREST-SETUP.md`).
- Claim the website: Settings (menu top right) > Link to Pinterest > Claim next to Websites > choose HTML tag, HTML file or DNS TXT. Free, optional but recommended; confirm under Settings > Claimed accounts. A tag or file means a developer change; the DNS TXT route does not touch the code.
- Read analytics: top-left menu > Analytics > Overview. Note impressions, outbound clicks and top pins monthly. Optional, free.
- Cross-check: sessions in GA4 from `pinterest / social` (2.4) should be in the same range as Pinterest's outbound clicks, though they will never match exactly.

## 7. Privacy notes
No typed text, names, emails or dog details are sent. Affiliate links in `link_url` are the same public links visitors see. The privacy page already discloses GA4. There is no consent banner (see `docs/recovery/07-analytics-affiliate-system-automation.md`, A2): a risk to review if European traffic grows.
