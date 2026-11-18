# SOP: quarterly (about 3 hours)

1. Content: re-read the five guides with the most traffic or clicks against their sources (rules and prices change). Update `lastReviewed` only after reading. The freshness rule is 6 months for guides, 12 for places, 6 for the policy dataset (settings at the top of `scripts/site-health.mjs`).
2. Tools: apply the 60-day rule in `docs/TOOL-TRACKING.md` to each tool (starts compared with page views); simplify or remove the unused.
3. Affiliate review: which programs earned, which did not, and whether a rejected or dormant program should be removed from `content/affiliates.yml` (never leave an unapproved link live). Check program terms for changes.
4. Products: re-verify the specs and sellers of the most-clicked products in `content/products.yml`; update `lastVerified`.
5. Security and access: confirm two-factor sign-in on GitHub, Netlify, Namecheap, the email host and each affiliate account; confirm who can reach hello@pawsandpassage.com. Do not store passwords in the repo.
6. Costs: compare expenses with revenue (`docs/FINANCE-TRACKING.md`); check renewal dates for the domain and mailbox.
7. Sale readiness: update `docs/SALE-READINESS.md` and the handover documents with the real numbers and dates, and confirm the evidence folder has every statement.
8. Dependencies: review the Dependabot pull requests that stayed open; update major versions deliberately, on a branch, with the tests passing.
9. Search and links: run Site health by hand once and open the Search Console Links and Core Web Vitals reports (UI paths SUSPECTED, check on screen).
