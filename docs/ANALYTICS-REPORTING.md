# Analytics reporting foundation

Written 2026-11-26. A simple, free (Google Sheets) monthly report for Paws & Passage. It separates what was MEASURED from what is ESTIMATED, so nobody reads a click as a sale. Event meanings and their limits are in `docs/GOOGLE-SETUP.md` section 4. Nothing here needs a paid tool. Never write personal data, buyer names, emails, license codes or order ids into the sheet; keep the Gumroad CSV outside the repository and report only aggregates.

## 1. Rules

- Measured = a number read from a system of record: Search Console (impressions, clicks, queries), GA4 (sessions, events), Gumroad (sales, refunds, fees, net), the hosting bill. Estimated = anything computed from a guess or a ratio. Label every cell M or E.
- A purchase is a confirmed Gumroad sale. `pp_purchase_cta_clicked` and `pp_checkout_handoff` are clicks; `pp_purchase_confirmed` is a code activation on our site. None of them is a sale and none is revenue.
- Do not blend eras. Record the business pivot date and the production launch date at the top of the sheet. Report Adventure Passport performance only from the launch date. Pre-pivot travel-directory data stays in its own tab, labeled "old business".
- GA4 event-level data (Explorations) is kept 14 months at most; the monthly summaries below are the long-term record. Save them every month.
- Search Console shows impressions and clicks, not sales. GA4 can miss visitors who decline or block analytics. Gumroad is the source for money.

## 2. Sheet layout (one workbook, one tab per block, one row per month)

Tab `Settings`: pivot date, launch date, canonical host, GA4 property id, retention setting, price ($19.99), the month's Gumroad fee rate as stated on Gumroad.

Tab `Acquisition` (columns): Month | Organic impressions (M, Search Console) | Organic clicks (M) | Average position (M, directional) | Top 5 queries (M) | GA4 sessions (M) | Sessions by channel: organic search, direct, referral, social, email (M) | Top referrers (M) | Notes. Include a Landing pages block: top 10 landing pages by sessions.

Tab `Engagement`: Month | Engaged sessions (M) | Engagement rate (M) | `pp_journal_article_view` (M) | `pp_intro_started` (M) | `pp_intro_revealed` (M) | `pp_intro_completed` (M) | `pp_preview_viewed` (M) | `pp_keepsake_downloaded` (M) | Notes.

Tab `Funnel` (sales funnel, each step labeled by what it is): Month | Visitors who viewed `/unlock` (`pp_unlock_viewed`, M) | `pp_purchase_cta_clicked` (M, click) | `pp_checkout_handoff` (M, click on the outbound Gumroad link) | Gumroad product views (M, Gumroad) | Gumroad confirmed purchases (M, Gumroad) | `pp_purchase_confirmed` (M, code activations) | Cta clicks per `/unlock` view (E) | Confirmed purchases per hand-off click (E, directional only, never a conversion rate proof) | Notes.

Tab `Financial` (from the Gumroad sales export and the hosting bill; all M unless marked): Month | Gross sales ($) | Gumroad fees ($) | Refunds ($) | Net revenue after fees and refunds ($) = gross - fees - refunds | Hosting and tools ($) | Monthly profit ($) = net - hosting and tools | Qualified visitors (M, see below) | Net revenue per qualified visitor ($, E) = net revenue / qualified visitors | Notes. Taxes the buyer paid are not revenue; if the export shows tax separately, leave it out of gross.

Qualified visitor (define once, keep it fixed): a GA4 session in which the visitor viewed a preview or started the finder (`pp_preview_viewed` or `pp_intro_started`). Write the definition in `Settings`. If analytics counts are partial because visitors decline or block analytics, say so next to the number.

Tab `Estimates` (only things that are guesses): Month | What | How it was estimated | Confidence. Example: traffic missing because of declined analytics. Never feed an estimate into a Measured column.

## 3. Journal per-article scorecard

One row per Journal article per month (ten articles plus the hub `/things-to-do-with-your-dog`). Slug is the key everywhere: the article slug is the `source` parameter on the Journal events.

| Column                                                                               | Source                                                                                                            | M or E                                 |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Article slug                                                                         | repository                                                                                                        | M                                      |
| Organic impressions                                                                  | Search Console, Pages, filtered to the URL                                                                        | M                                      |
| Organic clicks                                                                       | Search Console                                                                                                    | M                                      |
| Top queries (3)                                                                      | Search Console, Queries, filtered to the URL                                                                      | M                                      |
| Sessions landing on the article                                                      | GA4, Landing pages                                                                                                | M                                      |
| Engagement rate / average engagement time                                            | GA4                                                                                                               | M                                      |
| `pp_journal_cta_click` for this `source`                                             | GA4, custom dimension `source`                                                                                    | M                                      |
| Quiz starts (`pp_intro_started`) after this article                                  | GA4 funnel exploration, broken down by `source`, open funnel                                                      | M (journey limited to one tab session) |
| Purchase-intent (`pp_purchase_cta_clicked`, `pp_checkout_handoff`) from this article | GA4 funnel, break down by `source`                                                                                | M, click only                          |
| Confirmed purchases attributed to this article                                       | Only if the Gumroad attribution test (`docs/GOOGLE-SETUP.md` 4.5) proved a reliable method; otherwise leave blank | blank by default                       |
| Next action (refresh, retitle, add links, leave)                                     | You                                                                                                               | note                                   |

Read it as a ranking of which articles bring people who start the free adventure, not as revenue per article. Do not call an article profitable from clicks.

## 4. Monthly routine (about 30 minutes)

1. Search Console: export Pages and Queries for the month; fill `Acquisition` and the scorecard columns.
2. GA4: read the sessions, channel and event counts; fill `Acquisition`, `Engagement`, `Funnel`. If the 14-month window is near, export the Explorations you use.
3. Gumroad: export the sales CSV for the month (UTC times; widen the range by a day each side), compute gross, fees, refunds, net; fill `Financial`. Do not paste the export into the sheet.
4. Hosting and tools: from the actual bills.
5. Write three lines in `Notes`: what changed, what is measured versus estimated, what to do next month.
6. Compare with the same month of the launch year only; do not compare to the old business.

## 5. Pre-launch checklist for this document

- [ ] Pivot date and production launch date written in `Settings`.
- [ ] Qualified-visitor definition agreed.
- [ ] The first month's tabs created before launch so nothing is retrofitted.
- [ ] The Gumroad export column names checked against the Gumroad help page ("How to read your CSV") when the first export is made.
