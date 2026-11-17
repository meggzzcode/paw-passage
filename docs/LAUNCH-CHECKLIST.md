# Launch checklist

One ordered list of what is left before the site is live and earning, who does each step, and where it stands.
Update the status column as things happen. Dated detail goes in `RECORD-TRAIL.md`.

| # | Step | Who | Status | Notes |
|---|---|---|---|---|
| 1 | Merge the site fixes to `main` | Owner approves, assistant merges | **Waiting for approval** | Branch `claude/affiliate-setup`. `main` is currently `6d5ec1c`. |
| 2 | Switch Netlify's production branch from `claude/cms-poc` to `main`; point Pages CMS at `main` | Cowork (owner's login) | Not done | Netlify still deploys the old branch. |
| 3 | Confirm the Namecheap mailbox receives and sends mail | Cowork (owner's login) | Not done | Do this BEFORE the site goes public, because the Contact page shows the address. |
| 4 | Connect `pawsandpassage.com` to Netlify, HTTPS on | Cowork (owner's login) | Not done | Never touch MX, SPF, DKIM or DMARC records. See `DNS-AND-TRANSFER.md`. |
| 5 | Enter the real address as `siteUrl` in Business settings | Assistant or owner in Pages CMS | Not done | Turns on the sitemap, canonical links and share-preview images. |
| 6 | Run `node scripts/verify-site.mjs https://pawsandpassage.com --site-url https://pawsandpassage.com` | Assistant | Not done | Expect 0 failures. |
| 7 | Google Search Console: add the domain, verify with a DNS TXT record (add only, keep existing TXT records), submit `/sitemap.xml` | Cowork (owner's Google login) | Not done | Do right after step 4. Free. |
| 8 | Google Analytics 4: create a property, enter the `G-` ID in Business settings | Cowork (owner's Google login), then assistant or owner | Not done | Needed to prove traffic to a buyer. Start early: history cannot be backfilled. |
| 9 | Write a short, true author bio for the About page and articles | Owner | Not done | Not invented by the assistant. |
| 10 | Apply to an affiliate program, then add approved links in Pages CMS | Owner | On hold (owner's choice) | Buttons link to makers' pages until then. See `AFFILIATE-SETUP.md`. |
| 11 | Verify real stays with hosts and add them | Owner and assistant | Not started | Until one exists, the stays pages are hidden from search and the sitemap. |
| 12 | Product photos | Owner | Not started | Need permission or own photos. See `PRODUCT-PHOTOS.md`. |
| 13 | Email list | n/a | **Skipped for now (owner's decision)** | Revisit once there is steady traffic. See `LEAD-CAPTURE.md`. |
| 14 | Record monthly: visitors, top pages, search clicks, affiliate earnings | Owner | After launch | This history is what a buyer pays for. |

Legal review of the privacy, terms and disclosure pages was skipped by the owner's decision (2026-11-17).
