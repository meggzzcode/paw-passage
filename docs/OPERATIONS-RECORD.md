# Operations record: every service and site this business uses

Living register. Update it whenever a service is added, changed or dropped. **Never put passwords, API keys, personal emails or payment details here.** Where a login lives, say which account it is under, not the credential.
"Confirmed" means someone saw it on screen or in a receipt. "Not confirmed" means we have not seen it.

| Service | What it is used for | Status | Notes |
|---|---|---|---|
| Namecheap, domain `pawsandpassage.com` | The website address | Bought 2026-11-17 (order seen on screen) | Free domain privacy included. Renewal price and date: **not confirmed**, check in Namecheap. Domain is not yet pointed at the site. |
| Namecheap Private Email, "Launch" plan | Business mailbox (one mailbox) at the domain | Bought 2026-11-17 in the same order as the domain (order total shown: $24.16) | The inbox is Namecheap's own Private Email webmail (owner's wording: "inbox is with private label"). The mailbox is not on the website host, so moving the site never moves the email. Renewal: **not confirmed**. |
| Netlify | Hosts the website; rebuilds it automatically from GitHub | Free plan. Test site `paws-passage-test` live and verified (see LIVE-TEST-RESULTS.md) | Custom domain not connected yet. Account owner is the original owner's login; a buyer creates their own Netlify account and imports the repo. |
| GitHub, repo `meggzzcode/paw-passage` | The source of truth for all site content and code | Public (made public 2026-11-17 because free GitHub cannot protect `main` in a private repo) | `main` is the live branch. Work branches: `claude/lucid-davinci-l2fixa`, `claude/cms-poc`, `claude/affiliate-setup`. |
| Pages CMS (pagescms.org) | Visual editor for articles, stays, affiliate links, settings | Being live-tested; not yet signed off | Edits become commits in GitHub. Uses `.pages.yml`. |
| Lovable | Original builder of the site. Optional developer tool | Not needed to publish | Hostinger was considered and is **not** used. |
| Claude / Claude Code / Cowork | Assistant that wrote and tested the code and docs; Cowork drives a browser for account tests | In use by the owner | Not part of the running website. |
| Unsplash | Photos used on the site | In use | Licence: Unsplash licence. Per-photo credits are kept with the images. |
| Google Fonts | Fonts | In use | |
| Google Analytics (GA4) | Visitor statistics | **Not set up** | Add the ID under Business settings in Pages CMS. |
| Business email address | Shown on the Contact page | Set in `content/settings.yml` 2026-11-17 | Mailbox itself is the Namecheap Private Email one above. |
| Newsletter (Kit or MailerLite) | Email list | **Not set up** | |
| Affiliate programs (Amazon Associates, others) | Earning from product and booking links | **None joined yet** (owner chose to hold) | See AFFILIATE-PROGRAMS.md. Product buttons currently link to the makers' own pages. |
| Product photos | Pictures of the gear picks | None added | Maker photos need permission. See PRODUCT-PHOTOS.md. |
| Legal pages | Privacy, terms, affiliate disclosure | Live as written; **no legal review** (owner's decision 2026-11-17) | |

## Where the accounts live (names only)
- Namecheap, Netlify, GitHub, Pages CMS: under the original owner's logins. At sale, see DNS-AND-TRANSFER.md and BUYER_HANDOVER.md for handing each one over.
