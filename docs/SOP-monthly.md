# SOP: monthly (about 60 minutes)

Automations: the **Monthly digest** workflow (3rd of each month) opens or updates ONE issue "Monthly site digest" that groups overdue content, affiliate-link configuration problems and sitemap structure problems. It closes itself when nothing is found. Run it by hand from GitHub > Actions > Monthly digest.

1. Read the digest issue and work through each bullet. Re-read the source before changing a date; follow `docs/DATA-RECHECK-LOG.md` for the policy dataset.
2. Numbers: GA4, Search Console, Bing, Pinterest analytics (`docs/ANALYTICS-SETUP.md` sections 2 to 6) and every affiliate dashboard; enter them per `docs/FINANCE-TRACKING.md` and save statements and screenshots.
3. Affiliate programs: confirm each approved program is still active and each link still works by clicking it once in a browser (the checks do not make live requests). Stay and product links to Vrbo, Amazon and similar sites are skipped by the robot because those sites block robots.
4. Search: Search Console > Pages (indexing) for new "not indexed" reasons; Performance for the top pages.
5. Clicks: in GA4 compare `booking_click` and `product_click` by `partner`; note the pages that earn clicks without revenue.
6. Costs: check invoices (domain, mailbox, any paid tool) and enter them.
7. Dependabot leftovers and any open pull requests: merge or close.
8. If IndexNow is enabled, run it after a deploy that changed pages.
