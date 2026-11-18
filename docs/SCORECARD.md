# Monthly business scorecard

Where: Google Sheet "Website Flipping Tracker", tab **P&P Scorecard** (one row per month, formulas for net profit and totals).
Rule: fill only actual numbers from the named dashboard. Leave a cell empty when a number is not available. Never estimate traffic or revenue. Projections belong in docs/SALE-READINESS.md, labelled as planning estimates.

| Column | Where the number comes from | Done by |
|---|---|---|
| Visitors | GA4 Reports > Acquisition > Traffic acquisition, users for the month | Monthly, SOP-monthly |
| Organic search clicks, impressions | Search Console > Performance, month range | Monthly |
| Pinterest outbound clicks | Pinterest Analytics > outbound clicks (also GA4 source = pinterest) | Monthly |
| Indexed pages | Search Console > Pages > Indexed | Monthly |
| Affiliate clicks | GA4 events booking_click and product_click | Monthly |
| Affiliate conversions, Revenue | Each network's statement (Expedia hub, Awin, Ascend, Impact, Amazon) | Monthly; keep the statement PDFs as proof |
| Operating expenses | Receipts (domain, mailbox, any paid plan) | Monthly |
| Net profit | Calculated: revenue minus expenses | Sheet formula |
| Published guides, listed stays, researched products | Counts from the repo (content/guides, content/stays, content/products.yml) | Monthly; the site-health digest can print them |
| Website business score | Average of traffic, revenue, content and risk (1 to 10 each) using docs/SALE-READINESS.md | Quarterly; do not raise traffic or revenue scores without data |
| Estimated resale value | Only when net profit is real: monthly net profit times the planning multiple (6 to 12x starter, 12 to 24x growing, 24 to 30x strong) | When supported |
