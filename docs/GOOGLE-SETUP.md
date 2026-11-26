# Google setup: Search Console and Google Analytics (GA4)

Written 2026-11-26, amended the same day by the owner's SEO/analytics directive (the amendment wins wherever it conflicts with earlier text). The site was rebuilt from a different business (a dog-friendly stays directory). Search Console and GA4 were set up for the OLD site, so they hold old URLs, old sitemaps and old events. This document says which pages deserve SEO, how to audit and retire old URLs, what the analytics events really measure, and the order in which Cowork and the owner do things. It is checked by `src/test/google-setup.test.ts`, which fails if a row below stops matching the code.

Rules: nothing here says a page is indexed or will rank; a sitemap helps discovery and guarantees neither indexing nor rankings. Cowork cannot be assumed to see Search Console or GA4 from the repository, so every account fact below is a task to read, not a fact. Google UI paths marked UNVERIFIED were not read on a Google help page. No step here changes a Google account, deletes data or files a removal request before launch; irreversible or production-impacting tasks are marked NOT BEFORE LAUNCH.

## 1. Indexing policy

Policy (owner, 2026-11-26).

- Indexable: the homepage, `/journal` and its ten articles, the `/things-to-do-with-your-dog` hub, `/unlock`, `/faq`, meaningful public collection landing pages, `/how-we-write-adventures`, and the sample printables that have standalone value. `/discover` (plain URL) stays indexable and carries public intro text (section 1.2).
- Noindex: My Passport, private collection tabs, profiles, restore/recovery, filter and context variants, account pages, admin, test and preview deployments, `/previews` (new), `/our-story` (until redesigned) and `/concept` (no such route exists; if one is ever added it must be noindex).
- Noindex pages are never in the sitemap.
- noindex is not access control. It asks search engines to leave a page out of results; anyone with the URL can still open it, and it protects no data. Private data stays private because it lives on the visitor's device or behind the server's entitlement check, not because of a robots tag.

Canonical host: `https://www.pawsandpassage.com` is the PROPOSED canonical host (see section 1.3). It is `siteUrl` in `content/settings.yml`, the `Sitemap:` line in `public/robots.txt`, and the canonical, og:url, JSON-LD and sitemap host on every page. The robots meta, when present, is `noindex, nofollow`, emitted by `pageHead({ noindex })` in `src/lib/seo.ts`. `public/robots.txt` allows everything and has no Disallow line: this is deliberate, because Google can only obey a noindex it is allowed to crawl. Never add a Disallow for a private page.

Priority: core = the pages we want to rank and convert; supporting = useful, helps the core; none = must not be indexed or has no search value.

### 1.1 Indexing table

| URL pattern                    | Indexable | In sitemap                     | Robots meta emitted | Priority   | Reason                                                                                                                                                                       |
| ------------------------------ | --------- | ------------------------------ | ------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                            | yes       | yes                            | none                | core       | Home: what the product is, price, free adventure                                                                                                                             |
| `/things-to-do-with-your-dog`  | yes       | yes                            | none                | core       | The hub: broad query page that links all ten Journal articles                                                                                                                |
| `/journal`                     | yes       | yes                            | none                | core       | Journal index                                                                                                                                                                |
| `/journal/$slug`               | yes       | yes (ten)                      | none                | core       | Ten articles with Article JSON-LD and real dates. Unknown slug: noindex                                                                                                      |
| `/unlock`                      | yes       | yes                            | none                | core       | The commercial page: $19.99 one time, what is included                                                                                                                       |
| `/faq`                         | yes       | yes                            | none                | core       | Objections and answers for buyers                                                                                                                                            |
| `/discover`                    | yes       | yes                            | none                | supporting | Plain URL only. The free-adventure entry that every Journal call to action points to. Carries a short server-rendered public intro (section 1.2) so it is not an empty shell |
| `/discover?ctx`                | no        | no                             | `noindex, nofollow` | none       | Context start from a Journal article; canonical stays `/discover`                                                                                                            |
| `/discover?mode`               | no        | no                             | `noindex, nofollow` | none       | Tab variant; canonical stays `/discover`                                                                                                                                     |
| `/collections`                 | yes       | yes                            | none                | supporting | Curated collections index (the plain URL and `?tab=curated`)                                                                                                                 |
| `/collections?tab=mine`        | no        | no                             | `noindex, nofollow` | none       | The visitor's own lists; canonical stays `/collections`                                                                                                                      |
| `/collections?tab=favorites`   | no        | no                             | `noindex, nofollow` | none       | The visitor's favorites; canonical stays `/collections`                                                                                                                      |
| `/collections/$slug`           | yes       | yes (all curated)              | none                | supporting | Curated themed decks render title, description and public preview cards for a logged-out visitor                                                                             |
| `/collections/mine/$id`        | no        | no                             | `noindex, nofollow` | none       | A visitor's own collection, stored on their device                                                                                                                           |
| `/previews`                    | no        | no                             | `noindex, nofollow` | none       | Owner decision 2026-11-26: still reachable and linked from the product, but not a search landing page (client-rendered cards). Never listed in the sitemap                   |
| `/printables`                  | yes       | yes                            | none                | supporting | Printable index, two free samples                                                                                                                                            |
| `/printables/$slug (sample)`   | yes       | yes (two)                      | none                | supporting | The two free sample printables are complete public pages                                                                                                                     |
| `/printables/$slug (entitled)` | no        | no                             | `noindex, nofollow` | none       | Customer-only printables                                                                                                                                                     |
| `/guides`                      | yes       | yes                            | none                | supporting | Index of the 13 kept guides                                                                                                                                                  |
| `/guides/$slug`                | yes       | yes (public guides)            | none                | supporting | Dog travel, car safety, outdoor and gear guides with the affiliate disclosure. Drafts and unknown slugs: noindex                                                             |
| `/gear`                        | yes       | yes (while a category is live) | none                | supporting | Gear hub. Noindex automatically when no category has enough products, and for `?trip=` views                                                                                 |
| `/gear/$category`              | yes       | yes (live categories)          | none                | supporting | Category pages. Noindex when the category is not live; unknown category is a 404                                                                                             |
| `/tools/packing-list`          | yes       | yes                            | none                | supporting | The one remaining working tool                                                                                                                                               |
| `/about`                       | yes       | yes                            | none                | supporting | Trust page                                                                                                                                                                   |
| `/contact`                     | yes       | yes                            | none                | none       | Indexable, low value                                                                                                                                                         |
| `/privacy`                     | yes       | yes                            | none                | none       | Policy: indexable, low priority                                                                                                                                              |
| `/terms`                       | yes       | yes                            | none                | none       | Policy                                                                                                                                                                       |
| `/refund-policy`               | yes       | yes                            | none                | none       | Policy (also a trust page for buyers)                                                                                                                                        |
| `/disclaimer`                  | yes       | yes                            | none                | none       | Policy                                                                                                                                                                       |
| `/affiliate-disclosure`        | yes       | yes                            | none                | none       | Policy                                                                                                                                                                       |
| `/editorial-standards`         | yes       | yes                            | none                | supporting | Trust page: how content is made                                                                                                                                              |
| `/methodology`                 | yes       | yes                            | none                | supporting | Trust page                                                                                                                                                                   |
| `/corrections`                 | yes       | yes                            | none                | none       | Trust page                                                                                                                                                                   |
| `/how-we-write-adventures`     | yes       | yes                            | none                | supporting | Trust page                                                                                                                                                                   |
| `/our-story`                   | no        | no                             | `noindex, nofollow` | none       | The visitor's own timeline. Stays noindex until it is redesigned as a public page                                                                                            |
| `/passport`                    | no        | no                             | `noindex, nofollow` | none       | The visitor's own Passport (private, local data)                                                                                                                             |
| `/welcome`                     | no        | no                             | `noindex, nofollow` | none       | Post-purchase page                                                                                                                                                           |
| `/restore-access`              | no        | no                             | `noindex, nofollow` | none       | Restore form                                                                                                                                                                 |
| `/install`                     | no        | no                             | `noindex, nofollow` | none       | Install guide (PWA is paused); reachable by URL only                                                                                                                         |

Not pages, and how they behave:

| URL                                             | Behavior                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| any unknown URL                                 | 404 status with `noindex, nofollow` and title "Page not found" (`isNotFoundLane` in `src/routes/__root.tsx`) |
| retired addresses (section 2)                   | HTTP 410 from `netlify.toml`, body `/gone.html` which carries `<meta name="robots" content="noindex">`       |
| `/sitemap.xml`                                  | Generated from `src/lib/sitemap-entries.ts`; no query strings, no private pages                              |
| `/api/*`                                        | JSON endpoints, not crawlable content                                                                        |
| `/concept`                                      | No such route exists in `src/routes` today. Policy: noindex if it is ever added                              |
| non-production hosts (previews, branch deploys) | `X-Robots-Tag: noindex, nofollow` on HTML pages, from Netlify and from the app (section 1.4)                 |
| private preview build (`SHOW_DRAFTS`)           | Whole site gets `noindex, nofollow` from the root head; never set on production                              |

### 1.2 `/discover` public intro

`/discover` is a client-rendered tool: before it runs, the server HTML used to be an empty loading shell. `src/components/passport/DiscoverPage.tsx` now renders a short public section ("How personalized adventure discovery works") for visitors who have not unlocked the full Passport. It explains personalized adventure discovery in plain text, links to `/previews`, `/journal` and `/unlock`, shows no adventure steps and nothing from the protected library. `src/test/discover-seo.test.tsx` renders the route on the server and asserts the heading, the explanation, the links, that no adventure card is rendered, and that the page is more than a shell. The `?ctx=` and `?mode=` variants stay noindex with canonical `/discover`. Expect `/discover` to rank for little; its job is to be a clean, honest entry page, not a traffic source.

### 1.3 Canonical host (proposed: www)

- What the repository does: `siteUrl`, `robots.txt`, canonicals, og:url, JSON-LD and the sitemap all use `https://www.pawsandpassage.com` (test: `google-setup.test.ts`, "canonical host is consistent").
- What `netlify.toml` does (added by this amendment): two forced 301 rules send `http://pawsandpassage.com/*` and `https://pawsandpassage.com/*` to `https://www.pawsandpassage.com/:splat`. The path is kept by `:splat`. The rule matches only the bare host, so a request already on www never matches it and cannot loop (test: `netlify-config.test.ts`, "canonical host redirect"). Netlify passes the query string through on a redirect whose `to` has none: UNVERIFIED until the live check below confirms it for `/journal?utm_check=1`. Deploy previews are on `*.netlify.app` and are not affected.
- What the repository cannot see: Netlify domain settings (primary domain, which of apex or www is primary, DNS, HTTPS certificate, HSTS). These are read-only Cowork checks (task R9). Netlify's own primary-domain setting performs the same bare-to-www redirect for custom domains; the repository rule is the written statement of the intent and a second layer, and the two must agree.
- No Search Console "Change of Address" request. That tool is for moving between domains; this is one domain whose host choice is www.
- If the owner chooses the bare domain instead, change the redirect block, `siteUrl` and `robots.txt` together and update the test; never run both hosts as 200.

### 1.4 Previews and test deployments

Netlify's documentation (https://docs.netlify.com/site-deploys/overview/, "Search engine indexing") says Netlify adds `X-Robots-Tag: noindex` to Deploy Previews and older branch deploys, but NOT to the most recent branch deploy of a branch, and it does not say whether the header reaches server-rendered pages. `[[headers]]` rules in `netlify.toml` cannot be limited to a deploy context, so no header rule can be added there. The app therefore adds `X-Robots-Tag: noindex, nofollow` itself to every HTML response whose request host is not the production host (`isNonProductionHost` in `src/lib/security-headers.ts`, tested in `security-headers.test.ts`; production hosts are the `siteUrl` host and its apex). `*.netlify.app`, Lovable preview hosts and localhost are therefore noindex. The header is a request to search engines, not protection: for real protection use Netlify's password protection. Verify live with `scripts/check-live-seo.mjs <preview-url> --expect-noindex` (task P2). Production-only analytics (so previews and tests do not pollute GA4) is implemented by worker S as a host gate; see section 4.7.

### 1.5 Sitemap rules

The sitemap lists only canonical, indexable, current public URLs that answer 200 directly (no redirect, no query string). `lastmod` is written only where the repository has a genuine date (Journal articles' `dateModified`, guides' `lastReviewed`, the Journal index = newest article change); static pages carry none rather than an invented one. Tests (`google-setup.test.ts`) pin: no duplicates, no query strings, no noindex page (`/previews`, `/our-story`, `/passport`, `/concept`, customer printables, `/collections/mine`), lastmod valid and not in the future, locs on the canonical host. After deploy, `scripts/check-live-seo.mjs` fetches every loc and reports status, redirects, canonical, robots meta, X-Robots-Tag and mismatches.

### 1.6 Open items from the earlier review, now decided

- OD-G1 `/discover`: indexable, with public intro. Decided by the amendment.
- OD-G2 `/previews`: noindex. Decided by the amendment (same as OD7 in `COWORK-HANDOFF.md`).
- `/collections?tab=mine|favorites`: noindex hardening implemented in `src/routes/collections.index.tsx`.
- Policies stay indexable and are listed; priority "none" because nobody should expect them to rank.
- Done earlier and kept: `/our-story` is not in the sitemap; `/how-we-write-adventures` and the two free sample printables (`/printables/adventure-bucket-list`, `/printables/indoor-discovery-bingo`) are.

## 2. Historical URL audit (before any removal)

The old site had many indexed URLs. Do not decide from memory. Export first (task R2), then classify every URL that shows clicks, impressions, backlinks or a "Indexed" status.

### 2.1 Classification procedure

1. Export from Search Console: Performance (Pages and Queries, the longest range available, 16 months), the Pages report (Indexing), Links (top linked pages, top linking sites). Save the exports untouched with the date. Do not delete anything while doing this.
2. Build one row per URL (template below), joining clicks, impressions, top queries, referring domains and the current HTTP status from `netlify.toml`.
3. Classify:
   - KEEP: the URL is a live page on the new site with the same purpose.
   - REPURPOSE: the URL has real demand or links and the new site can serve a genuinely matching page at the SAME address.
   - REDIRECT (301): only when a live replacement satisfies a similar search intent. Never redirect unrelated listings to the homepage, the Journal or `/discover`; Google treats that as a soft 404 and it misleads visitors.
   - REMOVE: discontinued with no replacement: answer 410 (or 404). Add a Search Console removal request only after launch, narrowly scoped (section 3).
4. Record the decision, the date and who approved it. Redirect changes are owner-approved and go through `netlify.toml` with a test; this document does not change them.

### 2.2 Ready-to-fill table

Copy into a Google Sheet (columns A to M) or paste into a note. One row per old URL or per prefix group.

| Old URL or prefix | Clicks (16 mo) | Impressions | Top 3 queries | Referring domains / backlinks | Current response | Current target | Replacement page | Same intent? (yes/no/partial) | Decision (KEEP / REPURPOSE / REDIRECT / REMOVE) | Rule in netlify.toml | Approved by / date | Verified (HTTP check date) |
| ----------------- | -------------- | ----------- | ------------- | ----------------------------- | ---------------- | -------------- | ---------------- | ----------------------------- | ----------------------------------------------- | -------------------- | ------------------ | -------------------------- |
|                   |                |             |               |                               |                  |                |                  |                               |                                                 |                      |                    |                            |

### 2.3 What `netlify.toml` does today (read; not verified on a live deploy)

46 forced 410 rules and 10 forced 301 rules for old addresses (plus the two host rules of section 1.3, which are not URL retirements). Verified by reading the rules only.

| Old group                                                                                                                                                                        | Returns now                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/stays`, `/stays/*`, `/destinations`, `/destinations/*`, `/dogs`, `/dogs/*`, `/dog-rules`, `/dog-rules/*`, `/data/pet-policies`, `/list-your-property`                          | 410 Gone                                                                                                   |
| `/tools/checklist`, `/tools/cost-calculator`, `/tools/host-questions`, `/tools/pet-cost-check`, `/tools/will-my-dog-be-accepted`, `/tools/compare`                               | 410                                                                                                        |
| `/pet-policies-38-managers.csv`, `/pins/*`, `/share-towns/*`                                                                                                                     | 410                                                                                                        |
| 29 retired rental, cabin and location guides under `/guides/...`                                                                                                                 | 410                                                                                                        |
| `/tools`                                                                                                                                                                         | 301 to `/tools/packing-list`                                                                               |
| 3 retired gear guides                                                                                                                                                            | 301 to `/guides/dog-friendly-cabin-packing-list` (two) or `/guides/if-your-dog-gets-loose-on-a-trip` (one) |
| 6 landing pages (`/doggy-date-ideas`, `/puppy-bucket-list`, `/senior-dog-adventures`, `/free-things-to-do-with-your-dog`, `/weekend-adventure-finder`, `/indoor-dog-adventures`) | 301 to the matching Journal article                                                                        |

Consistency review of the ten 301 rules against the policy "301 only to a replacement with similar intent" (flagged, NOT changed; the owner decides after the audit data):

| Rule                                                                                                                                   | Assessment                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/guides/dog-id-tags-and-gps-trackers-for-travel-guide` to `/guides/if-your-dog-gets-loose-on-a-trip`                                  | Equivalent intent. Keep                                                                                                |
| `/tools` to `/tools/packing-list`                                                                                                      | Acceptable: the tools index and its only remaining tool                                                                |
| the six landing pages to Journal articles of the same topic (date ideas, puppy bucket list, senior dogs, free things, weekend, indoor) | Topic matches. `/weekend-adventure-finder` was a finder tool and now lands on an article: partial intent, acceptable   |
| `/guides/dog-travel-water-and-feeding-gear-guide` to `/guides/dog-friendly-cabin-packing-list`                                         | FLAG: partial. A closer live page exists (`/guides/dog-travel-bowls-and-food-storage`); consider it as the target      |
| `/guides/dog-friendly-rental-protection-gear-guide` to `/guides/dog-friendly-cabin-packing-list`                                       | FLAG: weak. Protecting a rental is not packing; if the audit shows no meaningful links or demand, this should be a 410 |

410 rules worth a second look in the audit because a live page exists on a near topic: `/tools/checklist` (the packing list is a checklist tool) and `/guides/traveling-with-two-dogs-accommodation-guide` (the live `/guides/two-large-dogs-in-one-car` is a different intent, so 410 is probably right). Every other 410 has no live replacement and is consistent with the policy. A 410 on a URL with strong backlinks may deserve a REPURPOSE or a REDIRECT decision; that is exactly what the table is for.

Live pages that look similar and must NOT be removed: `/guides` and the 13 kept guides, `/tools/packing-list`, `/gear*`, `/journal*`, `/things-to-do-with-your-dog`.

## 3. Removal requests (Search Console Removals tool)

Removals are a secondary, temporary hiding tool. The real mechanism is correct HTTP responses (410 or 404) plus Google recrawling them.

- Only AFTER the replacement production site is live and the HTTP responses are verified (section 5, step 7). NOT BEFORE LAUNCH.
- Selective and narrowly scoped. One request per old group. Never `/guides/`, never `/tools/`, never `/`, and never any prefix that contains a live indexable page. For the 29 retired guides (which share the live `/guides/` prefix) and the retired tools, request single URLs, and only for ones still showing in Results.
- Before submitting a prefix, check the exact scope with Search Console's own preview of the request (the tool shows the URLs a prefix covers; Cowork reads it and records it). If the preview lists a live page, cancel.
- A removal is temporary: about six months (https://support.google.com/webmasters/answer/9689846). It hides the URL from results; it does not delete anything from Google's index. The 410 and recrawl are what end it for good.
- Document each request: date, exact URL or prefix, type (URL or prefix), the preview scope, status (Processing, Approved), expiry date. Keep the log in the audit sheet.
- Candidate list (from section 2.3, subject to the audit): `https://www.pawsandpassage.com/stays/`, `/destinations/`, `/dogs/`, `/dog-rules/`, `/pins/`, `/share-towns/`, `/data/pet-policies`, `/list-your-property`, `/pet-policies-38-managers.csv`. Do not request removal of: `/`, `/journal*`, `/things-to-do-with-your-dog`, `/guides` and any live guide slug, `/tools/packing-list`, `/gear*`, `/collections*`, `/discover`, `/unlock`, `/faq`, policy pages, or any URL on the 301 list.

What NOT to do: no blanket redirect of old URLs to the home page or the Journal; no removal of Journal, hub, guides, collections or the new pages; no Disallow lines in `robots.txt` (it would hide the noindex and the 410 from Google); no "Remove all URLs with this prefix" for `/guides/` or `/tools/`; do not delete the property; do not resubmit old sitemaps.

## 4. Google Analytics (GA4)

Measurement ID: see `ga4MeasurementId` in `content/settings.yml`: `G-1J97C8CPC1`. The existing GA4 property and data stream are PRESERVED: never delete either, and never file a data-deletion request (section 4.6).

### 4.1 How it works in the code (read from the repo)

- Loader: `src/routes/__root.tsx` adds an inline snippet to every page. The ID comes from settings; an empty ID loads nothing. Consent and the loader are being changed by worker S: see the "Consent (filled from worker S report)" section (4.8), which the lead completes.
- Passport events: `src/passport/events.ts`. `track(name, params)` only sends names in the allow-list, only when `window.gtag` exists (so ad blockers send nothing), and sends the event to GA4 as `pp_<name>`. Parameter keys must match `^[a-z0-9_-]{1,40}$`; string values must match the same pattern, so free text is dropped, never sent. `transport_type: beacon` is added.
- Other events: `src/lib/analytics.ts` sends unprefixed `product_click` (params `product_id`, `partner`, `link_url`, `page_path`; this is where affiliate clicks are measured) and the tool events `tool_start`, `tool_complete`, `tool_copy`, `tool_print`, `packing_trip_edited`, `packing_custom_added`, `packing_item_packed`, `packing_item_need_to_buy`, `packing_recommendation_opened`.
- Campaign fields: `src/lib/campaign.ts` keeps the first `utm_source`, `utm_medium`, `utm_campaign` of a tab session and attaches them only to `pp_purchase_cta_clicked` and `pp_checkout_handoff`. Per tab session only; not attributed across days or devices.

### 4.2 Event inventory (every event in `src/passport/events.ts`, checked against the code that emits it)

Method: every name in the allow-list was searched for in the source (direct `track(...)`, the `flow(...)` helper, `trackPwa(...)`, and the Journal helper `ev(...)`). A test (`analytics-events.test.ts`, "every defined event has an emitter") now fails if a defined event has no emitter. Key-event status: nothing that is unimplemented is verified, and no event below has been seen in GA4 by anyone yet, so "candidate" means "reasonable to mark once DebugView shows it", never "verified".

Category A: primary commercial (money events)

| Event             | Status                      | Notes                                                                     |
| ----------------- | --------------------------- | ------------------------------------------------------------------------- |
| verified purchase | NOT IMPLEMENTED client-side | See 4.3. Do not approximate it with any event below                       |
| refund            | NOT IMPLEMENTED client-side | Refunds happen in Gumroad; only the sales export or the Ping can see them |

Category B: purchase-intent (clicks and views on the way to Gumroad; never reported as revenue)

| Event (GA4 name `pp_` + name)                                                 | Emitted by                                                                                      | What it really measures                                                                                                                                                      | Key-event candidate                                                  |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `purchase_cta_clicked`                                                        | home hero, `/unlock`, match panel, keepsake prompts, purchase prompts, previews, intro, Journal | A click on a "get the Passport" button or link. The `where` parameter says which. Many go to `/unlock`, not to Gumroad                                                       | Candidate (intent)                                                   |
| `checkout_handoff` (formerly named `pp_checkout_started`, renamed 2026-11-26) | `/unlock` only: the "Continue to checkout" link and the gift link                               | A click on the outbound link that opens Gumroad. It does NOT mean checkout began: no card, no form, no purchase is known. Deduplicated: a repeat within 2 seconds is dropped | Candidate (hand-off, the closest on-site proxy to checkout intent)   |
| `unlock_viewed`                                                               | `/unlock` page view                                                                             | The commercial page was opened                                                                                                                                               | No (a page view)                                                     |
| `purchase_confirmed`                                                          | the access form when a license code is activated                                                | A buyer entered a valid code on our site. Not the sale: only buyers who return and activate, with analytics running. Never revenue                                           | Candidate only as a secondary activation signal, never as a purchase |
| `access_restored`                                                             | the restore form                                                                                | A returning buyer restored access. Not a sale, never revenue                                                                                                                 | No                                                                   |

Continuity note for the rename: GA4 may already list `pp_checkout_started` if a build with the old name was ever deployed (not checked: group 1 reads the event list). Old rows keep the old name in reports; they are not renamed or merged in GA4. When building reports, add the two names together for the pre-rename period, and mark any key event on the old name as retired only after reviewing dependencies (section 4.6). Do not create a GA4 event-rewrite rule unless the owner asks.

Category C: engagement and acquisition

| Event                                                                                                                                                                 | Emitted by                                                  | Notes                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `journal_article_view`                                                                                                                                                | Journal article page                                        | Article slug in `source`                                                                                                                                                                            |
| `journal_cta_click`, `journal_collection_click`, `journal_related_click`, `journal_preview_click`                                                                     | Journal article page links                                  | `where` carries the slug or id. All four are emitted                                                                                                                                                |
| `intro_started`, `intro_personalized`, `intro_recommended`, `intro_replaced`, `intro_revealed`, `intro_completed`                                                     | the free starter (`FreeStarter.tsx`)                        | The free adventure funnel; `intro_started` is the quiz start, `intro_revealed` the reveal                                                                                                           |
| `preview_viewed`                                                                                                                                                      | `/previews` and `/unlock`                                   | Previews opened                                                                                                                                                                                     |
| `preview_bookmarked`, `preview_unbookmarked`, `collection_preview_viewed`                                                                                             | preview cards and collection previews                       | Saves and views                                                                                                                                                                                     |
| `profile_completed`, `suggestion_revealed`, `adventure_revealed`, `adventure_completed`, `adventure_saved`, `favorite_added`                                          | Passport screens                                            | Product usage                                                                                                                                                                                       |
| `keepsake_created`, `keepsake_downloaded`, `share_clicked`, `share_completed`                                                                                         | keepsake editor and Passport                                | `keepsake_downloaded` is NEW (emitted when the picture is saved to the device; `kind` is `artwork` or `filter`; no photo or text is sent). It is a cheap, honest measure of the keepsake being used |
| `calendar_reminder_downloaded`, `adventure_scheduled`, `calendar_event_exported`, `scheduled_adventure_completed`                                                     | scheduling screens                                          | Product usage                                                                                                                                                                                       |
| `install_guide_viewed`, `install_initiated`, `install_detected`                                                                                                       | install guide (PWA paused)                                  | Only when the paused PWA is enabled                                                                                                                                                                 |
| `notification_permission_requested`, `notification_permission_granted`, `notification_permission_declined`, `push_subscription_enabled`, `push_subscription_disabled` | notification settings (paused, `flags.notifications=false`) | Only when notifications are enabled                                                                                                                                                                 |

Events removed in this pass (defined, never emitted, no commercial value now): `affiliate_clicked` (affiliate clicks are `product_click` in `src/lib/analytics.ts`), `keepsake_share_attempted` (`share_clicked` already covers it), `notification_delivery_accepted` and `notification_opened` (notifications are paused; add them back only with the feature). The directive counted nine defined-but-unemitted events; the code check found five (the four removed above plus `keepsake_downloaded`). The earlier review also listed `journal_collection_click`, `journal_related_click`, `journal_preview_click`, `preview_bookmarked`, `preview_unbookmarked` and `collection_preview_viewed` as unfound; they ARE emitted, through the Journal helper and the `flow()` helper that a plain text search missed. `keepsake_downloaded` was defined, never emitted, and is now emitted (cheap and useful). The other defined-but-unused events were removed or are the paused PWA and notification events listed in category C.

Key-event candidates, accurately labeled (mark in GA4 only after DebugView shows each; every one is a COUNT OF CLICKS OR ACTIVATIONS, never a sale): `pp_purchase_cta_clicked`, `pp_checkout_handoff`, `pp_intro_revealed`, `pp_journal_cta_click`. Optional secondary: `pp_intro_completed`, `pp_purchase_confirmed` (activation, not purchase). A key event is a count of the event; clicks must never be reported as revenue.

### 4.3 Verified purchase and refund: why they are not built

A purchase may be sent to GA4 only from a CONFIRMED Gumroad sale: the Gumroad Ping (webhook) or the sales API, forwarded as a GA4 Measurement Protocol `purchase` event with `transaction_id` set to the Gumroad sale id (or a one-way, non-personal derivative of it; no email, no name, no license key) plus `value` and `currency`. It must never be sent from a CTA click, the checkout hand-off, the return from checkout, a license entry, a restore or a test entitlement. That needs server infrastructure that receives the Ping and an API secret held outside the repository, plus a decision about linking the server event to a browser session (`client_id`), which on a different domain may not be possible. It is documented as a later optional step that needs owner approval. It is NOT built, and no client-side purchase or refund event exists. Until then, revenue comes from Gumroad's own sales export (4.5), reconciled monthly (`docs/ANALYTICS-REPORTING.md`).

### 4.4 Parameters allowed (names only)

The code only passes these: `where` (a slug such as `home-hero`, `unlock`, `unlock-gift`, `match-panel`, `keepsake-<where>`, or a Journal context key), `source` (a Journal article slug or a suggestion source), `adventure` (an adventure id), `stage` (dog life stage), `kind` (keepsake, milestone, artwork, filter, a reminder kind), `reason` (activated or restored), plus `utm_source`, `utm_medium`, `utm_campaign` on the two purchase-funnel events. GA4 adds `transport_type`. Never: dog name, memory text, license code, email, customer id, photo data. `src/test/analytics-events.test.ts` guards the allow-list.

### 4.5 Gumroad attribution investigation (what Gumroad's own help pages say)

Read on 2026-11-26: https://gumroad.com/help/article/74-the-analytics-dashboard and https://gumroad.com/help/article/174-third-party-analytics (the pages load their text in the HTML; the summaries below are only what those pages say, nothing inferred).

What can be measured, per Gumroad:

- Analytics dashboard: sales, views, conversion rate (viewers who buy), a referrer list (the original source of a visit: the list shows views, purchases, conversion and dollar amount per referrer), locations (approximate, from the purchase IP). "Direct" can hide mobile apps, email, some messengers.
- Sales CSV export (Sales tab): per purchase it includes a Referrer column (the domain that referred the buyer, or "direct" when the browser gave none), the purchase id, sale price, fees, net total, refund flags (partial and full), dispute flags, discount code, product id and an order number "used to identify an order when using Gumroad Ping". Times are UTC. Buyer names and emails are in the export: keep it private, never commit it, and report only aggregates.
- UTM link tracking (Analytics, Links): a creator creates a UTM link in the Gumroad dashboard (destination plus Source, Medium, Campaign), shares it, and Gumroad records a unique click; a purchase within 7 days is attributed to that link; the dashboard shows clicks, sales, revenue and conversion rate per link. For a product-page destination only that product's purchases count. The page documents links created in Gumroad; it does not say that arbitrary utm parameters appended to a product URL are recorded (UNVERIFIED: the test plan checks it).
- Tracking views from your own website: Gumroad offers a snippet from its Widgets page that counts views of a page you host as Gumroad views.
- Third-party analytics: pasting a GA4 measurement ID into Gumroad's Third-party analytics settings makes Gumroad send, for each product, `view_item` (product page view), `add_to_cart` (the "I want this" click) and `purchase` (with the sale value) to that GA4 property. Gumroad's page says discrepancies with Google Analytics happen and that Gumroad's numbers should be trusted over Google's, because the scripts do not run for every buyer. Gumroad's page also has a "Cross-domain tracking" section that points to Google's steps for adding a website domain to a data stream and says this lets you see how customers move from your site onto Gumroad and what they do there. Gumroad also documents Meta Pixel, TikTok Pixel, Google Ads and snippets, and says it does not support the Facebook Conversion API but can feed one through Gumroad Ping (the Ping sends `product_permalink` among other payload fields to your endpoint).

What cannot be claimed:

- Nothing on those pages says a UTM carried on our link reaches the GA4 `purchase` event, or that sale-level UTM data is in the CSV (the CSV columns listed carry the Referrer domain, not UTM fields).
- Cross-domain GA attribution is NOT claimed here. Gumroad documents it as possible; whether it works for this site, whether a checkout in the same stream is acceptable for the privacy policy (it would put Google Analytics on Gumroad pages under our property), and what it adds over Gumroad's own numbers are all untested and an owner decision. Do not enable it before the transaction test (group 5) and the owner's privacy review.
- Our site sends `Referrer-Policy: strict-origin-when-cross-origin`, so a Gumroad referrer is the site's origin, not the page. Gumroad's Referrer therefore tells us "the site" drove a sale, not which Journal article did.

Unwanted referrals: the earlier plan said to add `gumroad.com` to GA4 unwanted referrals so a return from checkout is not counted as a new session. Cowork must FIRST observe the actual checkout and return domains in a test (the buyer lands on gumroad.com, a subdomain of it, or an own-domain checkout), then list only the domains seen. This reduces self-referral noise; it does not create attribution.

Campaign identifier scheme (non-personal; also the rule for any UTM we ever put on a Gumroad link): `utm_source` = the channel (`journal`, `pinterest`, `newsletter`, `search-test`), `utm_medium` = the placement (`article`, `pin`, `email`, `button`), `utm_campaign` = a short slug of the article, pin batch or campaign (`rainy-day-dog-activities`). Lowercase `a-z 0-9 _ -`, at most 40 characters, the same rule `src/lib/campaign.ts` applies. Never a name, email, license key, dog or profile data, order id or customer id.

Cheapest test plan with real transactions (owner or Cowork, LAST phase, group 5; needs the owner's approval for each paid test and a refund afterwards; the refund period is Gumroad's and the owner's own policy, and nothing here invents one):

1. In Gumroad, create three UTM links to the product page (source `journal`, `pinterest`, `newsletter`; medium and campaign per the scheme). Do not change the site yet.
2. Buy through each link once from a clean browser profile, using the owner's own card (three sales), then refund them in Gumroad.
3. Check Gumroad Analytics, Links: does each link show one click and one sale? Check the CSV Referrer column and the referrer list for the three buys. This answers "does Gumroad's own UTM link attribution work for us".
4. Buy once by clicking the real "Continue to checkout" button on the live site, then refund. Check Gumroad's referrer list and CSV Referrer (expect the site domain) and GA4 DebugView/Realtime for `pp_purchase_cta_clicked` and `pp_checkout_handoff`. Note the checkout and return domains observed (input to the unwanted-referrals task).
5. Only if the owner wants more: repeat step 4 once with a `utm_*` query string appended to the Gumroad URL by hand, to see whether Gumroad records it (the help pages do not say it does).
6. Record the findings in this document. Decide, with the owner, whether to (a) use Gumroad's own UTM links for key placements, (b) enable GA4 in Gumroad's Third-party analytics (privacy review first), (c) build the Ping-to-Measurement-Protocol step of 4.3, or (d) rely on Gumroad's dashboard plus directional site data only. Option (d) is the default.

### 4.6 Internal traffic, retention and history

Internal traffic. Define the owner's and Cowork's IP addresses as internal traffic and create the GA4 internal-traffic data filter in TESTING state first (a Testing filter tags data but does not change reports), confirm a test visit is tagged, and only then make it Active (Active is irreversible for the data it filters). Only owner-approved IPs. A residential IP changes over time and may be shared; the filter then misses visits or hides someone else's, so re-check the IP when it changes and prefer testing with DebugView. Developer and test traffic is also kept out at the source by production-only analytics (4.7).

Retention. GA4 standard properties keep event-level data for 2 or 14 months (Google's data-retention help page, https://support.google.com/analytics/answer/7667196); 14 months is the maximum. The setting affects user-level and event-level data used in Explorations and funnel reports, NOT the standard aggregated reports. Recommend 14 months only if the privacy policy's retention statement matches; otherwise align the policy first. Because only 14 months of exploration data survive, keep a separate monthly aggregate summary in `docs/ANALYTICS-REPORTING.md` (and its Sheet) so history does not depend on the setting.

History and pivot. Preserve the existing GA4 property and data stream (never delete them) and send no data-deletion requests. Before retiring anything from the stays era (key events, audiences, custom dimensions, product links), review what depends on it (Google Ads or other integrations, saved explorations, Search Console links) and export the historical reports first. Record two dates in the reporting sheet: the business pivot date and the production launch date of the Adventure Passport site. Keep pre-pivot travel-directory data clearly separate from Adventure Passport performance: report the new site only from the launch date, use a date range, a comparison label or a separate view, and never blend the two in one trend line.

Old-era events seen in the git history of `src/lib/analytics.ts` (stays era): `booking_click`, `accommodation_referral_click`, `outbound_click`, `hub_card_click`, `rules_view`, `rules_source_click`, `rules_search`. What is actually configured in the property cannot be seen from the repository: group 1 documents it.

### 4.7 Production-only analytics

Developer machines, tests, Lovable previews and Netlify previews must not send events to the production property. Worker S implements the host gate in the loader; this document only records the requirement and how to verify it: open a deploy preview and `localhost` with DebugView or Realtime open and confirm no events arrive, then confirm they do on the production host. The same host rule drives `X-Robots-Tag` (1.4).

### 4.8 Consent (filled from worker S report)

The lead completes this section from worker S's report. Placeholders:

- What loads before any choice: nothing: no Google script request, no `_ga` cookies, no campaign tags stored; consent defaults are denied (Basic Google Consent Mode). Only on the production host; never in dev, tests, Netlify or Lovable previews.
- What changes after Accept / Decline: Accept loads `gtag/js` once and updates `analytics_storage` to granted (ad signals stay denied). Essential only/withdrawal sets consent to denied, deletes `_ga*`/`_gid`/`_gat*` cookies and the campaign tags and stops sending.
- Where the choice is stored and how it is changed again: `pp.consent.v1` in localStorage; footer and privacy page 'Analytics choices' reopens the notice. Global Privacy Control and Do Not Track count as denied.
- Regions covered / not covered: unconfirmed: the owner must confirm the markets with an advisor; default mode is opt-in (`ANALYTICS_CONSENT_MODE` in `src/config/analytics.ts`).
- Privacy policy text that must match: the Cookies and analytics sections of `/privacy`.
- Effect on measurement (what is not counted for visitors who decline): visitors who decline or have GPC/DNT are not counted at all, so GA4 undercounts; use Gumroad sales as the revenue source. Real browser network verification is a Cowork task.
- Test expectation in `src/test/google-setup.test.ts`: consent behavior is pinned in `src/test/consent.test.tsx`.

### 4.9 Custom dimensions and the Journal funnel

Register event-scoped custom dimensions for the parameters actually used: `where`, `source`, `kind`, `stage`, `reason`, `utm_source`, `utm_medium`, `utm_campaign`, and `adventure` only if the owner will report on it (many values). They only collect data from creation on. Funnel (Explore): `pp_journal_article_view`, `pp_journal_cta_click`, page view of `/discover`, `pp_intro_revealed`, `pp_purchase_cta_clicked`, open funnel, broken down by `source`. A tab-session limit applies. Reporting layout: `docs/ANALYTICS-REPORTING.md`.

## 5. Launch sequence

Before launch (all read-only or in the repository):

1. Verify Search Console ownership (Domain property by DNS preferred); confirm the owner is a verified Owner and nobody else holds access that should not.
2. Export the history (section 2.1, group 1) before anything changes.
3. Review what is currently indexed (Pages report, `site:` search for the host).
4. Prepare the URL classification table (2.2) and get the owner's decisions.
5. Verify the sitemap and canonicals in the built app (tests, then `scripts/check-live-seo.mjs` on the deploy preview, with `--expect-noindex`).
6. Confirm previews cannot be indexed (1.4).

After the authorized launch (NOT BEFORE LAUNCH):

7. Verify HTTP responses: home 200, `/sitemap.xml` 200, `/robots.txt` 200, bare domain 301 to www with path and query (`node scripts/check-live-seo.mjs https://www.pawsandpassage.com --apex https://pawsandpassage.com`), retired URLs 410, the ten 301s land where expected.
8. Verify the canonical host (canonicals, og:url, JSON-LD use www) and robots.
9. Remove obsolete sitemaps from the Sitemaps report (this only removes them from the report; Google still remembers the URLs); submit the current `https://www.pawsandpassage.com/sitemap.xml`. A sitemap helps discovery; it does not guarantee indexing or rankings.
10. URL Inspection on representative URLs (home, a Journal article, `/unlock`, `/discover`, a retired URL, a redirected URL, `/previews`), using "Test live URL".
11. Selective Request Indexing for the home page, the Journal and the core pages, one at a time (a quota applies); not for noindex pages.
12. Verify the redirects and removed URLs show the expected status in Search Console.
13. Narrow removal requests only where justified (section 3), scope previewed first, each documented.
14. Weekly for the first month, then monthly: Pages and Sitemaps reports. "Not found (404)" and "Gone"-type exclusions growing is the old site draining. Worry only if a LIVE URL sits in an error group.

## 6. Cowork tasks (six groups)

Flags: READ-ONLY (no change anywhere), OWNER APPROVAL (a decision or a change that needs the owner), NOT BEFORE LAUNCH (irreversible or production-impacting). Group 1 can start now. Mapping to the older G-ids: G1=R9/L2, G2=R1, G3=L5, G4=L6, G5=L7, G6=L9, G7=L11, G9=M1, G10=R7, G11=R4, G12=P4, G13=T4, G14=A4 plus R6, G15=A5, G16=A6, G17=A7, G18=A8, G19=A9, G20=P5, G21=OD4.

### Group 1: read-only account inspection and historical exports (start now; READ-ONLY)

| ID  | What                                                                                                                                                                              | Where                                                                                                           | Pass condition                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| R1  | List the existing Search Console properties; for each record type (Domain or URL-prefix), exact URL, verification method, whether it is verified, and who the verified owners are | Search Console, property selector and Settings, Ownership verification                                          | A written list; the owner is a verified Owner of one property that covers www and the bare domain |
| R2  | Export history, change nothing: Performance (Pages, Queries; the longest range, up to 16 months), Pages (Indexing) report, Links report (top linked pages, top linking sites)     | Search Console, Export                                                                                          | Dated files saved outside the repository; counts noted                                            |
| R3  | Sitemaps report: list every submitted sitemap with URL, status, last read, discovered URLs, errors. Do NOT remove any                                                             | Search Console, Sitemaps                                                                                        | Written list                                                                                      |
| R4  | GA4: record property name and id, the web data stream(s), their URLs and measurement ID (expect `G-1J97C8CPC1`), enhanced measurement settings, any other streams                 | GA4 Admin, Data streams (UNVERIFIED path)                                                                       | Written list; any stream on an old domain noted                                                   |
| R5  | GA4: list integrations and links (Search Console, Google Ads, others), events, key events, audiences, custom definitions, data filters, data retention, Google signals setting    | GA4 Admin, Product links, Events, Audiences, Custom definitions, Data filters, Data settings (UNVERIFIED paths) | Written inventory with a "what depends on it" note per stays-era item                             |
| R6  | GA4: record the current internal-traffic definitions and filters, if any, and their state                                                                                         | GA4 Admin                                                                                                       | Written note                                                                                      |
| R7  | Search Console: Security and manual actions, Users and permissions                                                                                                                | Search Console                                                                                                  | No manual action, or the issue recorded; users listed                                             |
| R8  | Search Console: Pages report, sample the "Indexed" and the main "Not indexed" reasons for the old host, and note any URL on other hosts (apex, http)                              | Search Console, Pages                                                                                           | Written note                                                                                      |
| R9  | Netlify domain settings (read-only): primary domain, which host is canonical, domain aliases, HTTPS, the bare-domain redirect, any HSTS                                           | Netlify, Domain management                                                                                      | Written note; confirm it agrees with `siteUrl` (www)                                              |
| R10 | Record the business pivot date and the production launch date once known                                                                                                          | Owner                                                                                                           | Both dates written in `docs/ANALYTICS-REPORTING.md`                                               |

### Group 2: repository implementation (done and pending)

Done by this amendment (in the repository, tested; nothing deployed):

- Indexing policy applied: `/previews` noindex; `/collections?tab=mine|favorites` noindex; `/discover` indexable with server-rendered public intro and an SSR test; `/our-story` still noindex; `/concept` has no route.
- Bare-to-www 301 rules (http and https) in `netlify.toml` with tests; non-production hosts get `X-Robots-Tag` from the app.
- Sitemap tests; `scripts/check-live-seo.mjs` (not run in CI).
- Events: `pp_checkout_started` renamed `pp_checkout_handoff` with a 2-second dedupe; `keepsake_downloaded` emitted; four unused definitions removed; an emitter test.

Pending (needs the owner or another worker): consent facts (4.8, from worker S); production-only analytics gate (worker S); decisions on the two flagged 301 rules (2.3); privacy policy retention wording if 14 months is chosen; any change to the host choice.

### Group 3: preview verification (after a deploy preview exists; READ-ONLY)

| ID  | What                                                                                                                                                                                                                       | Where                                     | Pass condition                                                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| P1  | Run `node scripts/check-live-seo.mjs <preview-url> --expect-noindex`                                                                                                                                                       | Terminal                                  | Exit 0 or only mismatches that are explained; every page reports noindex |
| P2  | Confirm `X-Robots-Tag: noindex` on a preview HTML page, and also on the latest branch deploy                                                                                                                               | Browser developer tools, response headers | Header present on both                                                   |
| P3  | View `/discover` source with scripts off: the intro heading and text are in the HTML                                                                                                                                       | Browser, view-source                      | Text present, no adventure steps                                         |
| P4  | Realtime and DebugView on the preview: confirm NO events arrive from the preview host (production-only gate); then run the free flow on localhost or the preview with debug enabled only if the gate offers a debug switch | GA4 Realtime, DebugView                   | No preview events in the production property                             |
| P5  | On production-equivalent builds, confirm parameters carry no dog name, text or code                                                                                                                                        | DebugView                                 | Only the parameters in 4.4                                               |
| P6  | Check `/unlock` outbound click produces one `pp_checkout_handoff` per click (double-click once)                                                                                                                            | DebugView                                 | One event per click                                                      |
| P7  | Record the checkout and return domains seen when following the Gumroad link (no purchase)                                                                                                                                  | Browser                                   | Domains written down                                                     |

### Group 4: production-launch SEO updates (NOT BEFORE LAUNCH; OWNER APPROVAL)

| ID  | What                                                                                                   | Where                    | Pass condition                                               |
| --- | ------------------------------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------ |
| L1  | Owner confirms the canonical host (www)                                                                | Owner                    | Decision recorded                                            |
| L2  | Run `node scripts/check-live-seo.mjs https://www.pawsandpassage.com --apex https://pawsandpassage.com` | Terminal                 | Exit 0; apex 301 keeps path and query in one hop             |
| L3  | Verify retired URLs answer 410 and the ten 301s land on their targets (spot-check one per group)       | Browser or terminal      | As in section 2.3                                            |
| L4  | Property verified (Domain by DNS) and Owner access confirmed                                           | Search Console           | Verified                                                     |
| L5  | Remove obsolete sitemaps from the report; submit the current sitemap                                   | Search Console, Sitemaps | One sitemap row, Success                                     |
| L6  | Compare the live sitemap count with the report's discovered count                                      | Browser, Search Console  | Numbers agree; no `/previews`, `/our-story`, `/passport`     |
| L7  | URL Inspection with live test on representative URLs (section 5 step 10)                               | Search Console           | Expected status; canonical is the page itself for core pages |
| L8  | Selective Request Indexing for the core pages only                                                     | Search Console           | Requests accepted                                            |
| L9  | Final URL classification table filled and approved (section 2.2)                                       | Audit sheet              | Every historical URL has a decision                          |
| L10 | Narrow removal requests only for REMOVE rows, scope previewed, each documented (section 3)             | Search Console, Removals | Each Approved; the log is complete; no live prefix included  |

### Group 5: Gumroad attribution and transaction testing (final phase; OWNER APPROVAL; NOT BEFORE LAUNCH)

| ID  | What                                                                                                                                                  | Where                                                                                                   | Pass condition                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| T1  | Create the three Gumroad UTM links per the scheme in 4.5                                                                                              | Gumroad, Analytics, Links                                                                               | Three links exist                                                     |
| T2  | Make the test purchases and refunds of the plan in 4.5 (owner's card, owner approval)                                                                 | Gumroad                                                                                                 | Results recorded: per link clicks and sales, CSV Referrer, GA4 events |
| T3  | Decide the option (a) to (d) of 4.5 with the owner                                                                                                    | Owner                                                                                                   | Decision recorded                                                     |
| T4  | Add the observed checkout and return domains to GA4 unwanted referrals (only those seen)                                                              | GA4 Admin, Data streams, Configure tag settings, List unwanted referrals (path read from the help page) | Domains listed; note it does not create attribution                   |
| T5  | Only if option (c) is chosen: build the server-side Ping to Measurement Protocol step (needs server infrastructure and an API secret; owner approval) | Not built                                                                                               | Out of scope until approved                                           |

### Group 6: post-launch reporting (after launch)

| ID  | What                                                                                                                                         | Where                                           | Pass condition                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| M1  | Weekly for the first month, then monthly: Pages and Sitemaps reports, record counts                                                          | Search Console                                  | No live core URL in an error group                                    |
| A1  | Fill the monthly report per `docs/ANALYTICS-REPORTING.md` (acquisition, engagement, funnel, financial)                                       | Sheet                                           | Month filled, measured and estimated separated                        |
| A2  | Journal per-article scorecard each month                                                                                                     | Sheet                                           | One row per article                                                   |
| A3  | Compare weekly purchase-button clicks with Gumroad sales as a directional ratio only                                                         | Sheet                                           | Never reported as a conversion rate                                   |
| A4  | Create the internal-traffic filter in TESTING state, confirm a tagged test visit, then (owner approval) make it Active                       | GA4 Admin, Data filters                         | Test visit tagged; Active only after                                  |
| A5  | Data retention to 14 months, only if the privacy policy matches (OWNER APPROVAL)                                                             | GA4 Admin, Data settings                        | Shows 14 months                                                       |
| A6  | Retire stays-era key events and audiences (OWNER APPROVAL), only after the R5 dependency review and the historical export                    | GA4 Admin                                       | A written list of what was retired; nothing deleted from the property |
| A7  | Mark key events once DebugView has shown them: `pp_purchase_cta_clicked`, `pp_checkout_handoff`, `pp_intro_revealed`, `pp_journal_cta_click` | GA4 Admin, Events                               | Four key events; none reported as revenue                             |
| A8  | Register the custom dimensions of 4.9                                                                                                        | GA4 Admin, Custom definitions (UNVERIFIED path) | Dimensions listed, scope Event                                        |
| A9  | Build the Journal funnel exploration (4.9)                                                                                                   | GA4 Explore                                     | Saved; counts per step per article after a few days                   |

## 7. Owner decisions

- OD-A: confirm www as the canonical host (L1) or choose the bare domain.
- OD-B: approve or change the two flagged 301 rules (2.3) after the audit data.
- OD-C: choose the Gumroad attribution option (4.5), including whether GA4 may run on Gumroad's pages (privacy policy impact).
- OD-D: approve the internal-traffic IPs, and whether the filter goes Active.
- OD-E: retention at 14 months, only with matching privacy policy text.
- OD-F: approve retiring stays-era key events and audiences after the dependency review.
- OD-G: whether to ever build the confirmed-purchase Measurement Protocol step (4.3).
- OD4: consent (see 4.8).

## 8. Sources read

- Removals tool: https://support.google.com/webmasters/answer/9689846 (temporary, about six months, prefix removal, permanent methods: 404/410, password, noindex)
- Sitemaps report: https://support.google.com/webmasters/answer/7451001 (remove sitemap steps, removal does not remove URLs)
- GA4 key events: https://support.google.com/analytics/answer/9267568
- GA4 unwanted referrals: https://support.google.com/analytics/answer/10327750
- GA4 data retention: https://support.google.com/analytics/answer/7667196 (2 or 14 months)
- Netlify, search engine indexing: https://docs.netlify.com/site-deploys/overview/ (X-Robots-Tag on Deploy Previews and older branch deploys, not the latest branch deploy)
- Gumroad: https://gumroad.com/help/article/74-the-analytics-dashboard and https://gumroad.com/help/article/174-third-party-analytics (read 2026-11-26; summarized in 4.5)
- Not read, so UNVERIFIED: internal-traffic filter menu paths, custom dimension limits, consent mode, Explore paths, Search Console property verification steps.
