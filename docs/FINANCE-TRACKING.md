# Finance tracking: one simple monthly method

Purpose: a buyer must be able to see, month by month, what the site earned, what it cost and what was left. Status 2026-11-18: revenue is $0 and no earnings figure exists; do not enter estimates anywhere. Only numbers that appear on a dashboard, statement or invoice go in the sheet.

## Where the numbers go
The private Google Sheet "Website Flipping Tracker" holds them (`docs/OPERATIONS-HANDBOOK.md` section 6). Its tab and column names are not documented in the repository and were not visible to the author of this file, so the layout below is the RECOMMENDED shape. If the real tabs differ, keep the tabs and change only this list. The sheet stays out of the repo.

| Tab (recommended) | One row per | Columns |
|---|---|---|
| Revenue | month and program | Month, Program (for example Vrbo/Expedia Creator, Amazon Associates, Stay22), Amount (from the dashboard), Statement saved (yes/no), Date read |
| Expenses | invoice | Month, Item (domain, mailbox, Lovable, other), Amount, Receipt saved (yes/no) |
| Traffic | month | GA4 sessions, GA4 organic sessions, Search Console clicks, Search Console impressions, Pinterest outbound clicks, Affiliate clicks (GA4 `booking_click` plus `product_click`) |
| Summary | month | Revenue total, Expenses total, Net profit, Revenue per 1,000 sessions |

## Each month (about 30 minutes; see `docs/SOP-monthly.md`)
1. Revenue by program: open each affiliate dashboard, read the last full month's earnings, enter them as shown, download or screenshot the statement and note the date read. If a program shows pending versus paid, enter what the dashboard calls earned and add the pending/paid split in a note.
2. Operating expenses: enter each invoice or card line for the month (domain, mailbox, any paid tool). Use what was actually charged.
3. Net profit = revenue total minus expenses total. Negative is fine; record it.
4. Traffic: copy the numbers from GA4 and Search Console as set up in `docs/ANALYTICS-SETUP.md`. Revenue per 1,000 sessions = revenue / sessions x 1,000, computed only when sessions are above zero.
5. Evidence: keep one folder per month with the statements and dated screenshots of each dashboard. Buyers discount income they cannot verify.

## Rules
- Never write a projected or "expected" figure into these tabs.
- Revenue is per program, so an expiring or rejected program is visible at once.
- One tracking ID per program and site, so earnings stay provable (`docs/AFFILIATE-AND-SELLING.md`).
- Do not store bank, tax or login details in the sheet or the repo.
- A buyer should be able to read the Summary tab alone and trace every number to a saved statement.
