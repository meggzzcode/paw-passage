# Transfer plan (sale handoff)

How the business moves to a new owner. Written for the seller and for a buyer's advisers. Anything not proven is marked **UNVERIFIED**. This file contains no secrets, customer data or revenue or traffic figures, and none should be added.

## What transfers

| Asset                                                       | How it transfers                                                                                                                    | Notes                                                                                                                                                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain (the address in `siteUrl` in `content/settings.yml`) | Registrar transfer or account push, plus DNS records                                                                                | Registrar and renewal date are not recorded in the repository: **UNVERIFIED**. Owner to document.                                                                                      |
| GitHub repository                                           | Transfer ownership, or the buyer forks and the seller archives                                                                      | Public repository: it contains no premium text, secret or customer data.                                                                                                               |
| Netlify project                                             | Transfer the site to the buyer's team, or recreate it from the repository                                                           | **UNVERIFIED** which is possible on the seller's plan. Transferring the site itself keeps environment variables and Blobs in place; recreating it does not (see Blobs below).          |
| Pages CMS access                                            | The buyer signs in with their own GitHub account and opens the repository                                                           | Configuration is `.pages.yml` in the repository.                                                                                                                                       |
| Public content                                              | In the repository: free adventures, collections, stamps, achievements, guides, products, packing planner, settings                  | Includes the structured adventure schema and the writing guide.                                                                                                                        |
| Premium library                                             | A JSON file kept outside the repository, plus the live `premium-production` store                                                   | Hand over the latest export (`OPERATIONS.md`, runbook) at closing, never during diligence.                                                                                             |
| Design assets                                               | In the repository: CSS design system, keepsake artwork code, stamp art, self-hosted fonts (SIL OFL licences included), guide images | Guide photos are licensed from Unsplash under the Unsplash License (see the editorial standards page); they are not owned by the business.                                             |
| Affiliate IDs                                               | Buyer replaces them                                                                                                                 | Amazon: change `amazonTrackingId` in Business settings. Impact: replace or clear `impactSiteVerification`. The buyer needs their own Amazon Associates approval.                       |
| Gumroad product and entitlements                            | Depends on Gumroad's rules (CW-PAY-5, **UNVERIFIED**)                                                                               | License codes are verified against the seller's Gumroad product id. If the account cannot transfer, existing customers need a re-issue or a new product id plan agreed with the buyer. |
| Analytics and Search Console                                | Add the buyer as owner, then the seller removes themselves                                                                          | GA4 property id is in `content/settings.yml`; the buyer should replace it with their own property if they prefer.                                                                      |
| Pinterest                                                   | Transfer or hand over the profile (CW-PIN-1)                                                                                        | Address is `pinterestUrl` in settings.                                                                                                                                                 |
| Documentation                                               | All files under `docs/`                                                                                                             |                                                                                                                                                                                        |

## What does NOT transfer

- The seller's personal accounts, payout details, identity records and password manager.
- The seller's Amazon Associates and Impact accounts (affiliate earnings are tied to the account).
- Secrets: `SESSION_SECRET`, `PP_DATA_KEY`, tokens. They are re-created or handed over by the seller's secure channel at closing, never by email or the repository.
- Gumroad payouts and balances.
- Unsplash-licensed photos as owned property (only the licence to use them).
- Any customer personal data, until the buyer has accepted the privacy obligations in writing (see below).

## Blobs export and restore

- **Premium library:** export with `node scripts/premium-export.mjs --out <path outside the repo> --env production`; the buyer restores with `premium-import.mjs` (dry run, then `--write`) using their own token and site id. Round trip proven only with synthetic data once CW-BLOB-3 is done.
- **Customer records** (`customers-production`: progress and purchase lookups): there is **no export or import script** for them in this repository. If the buyer recreates the Netlify site, a developer must write and test one; if the Netlify site is transferred, the store moves with it (**UNVERIFIED**). Customers can also export their own progress from their Passport page.
- Restoring premium content never requires customer data.

## Secrets rotation at handover

1. The buyer generates a new `SESSION_SECRET` in their own Netlify. This signs every customer out once; they restore with their license code. Safe at any time.
2. `PP_DATA_KEY` is used to find a customer from a purchase and to open the stored code for refund re-checks. Changing it breaks both for existing customers. Either transfer the Netlify site with the value in place, hand the value over securely at closing, or plan a developer-run migration.
3. Rotate the Netlify and GitHub tokens the seller used, remove the seller's access, and replace `NETLIFY_AUTH_TOKEN` usage with the buyer's own.
4. Replace the Gumroad product id and checkout link if the product changes (`GUMROAD_PRODUCT_ID`, `VITE_CHECKOUT_URL`).

## Diligence rules

- **No customer data goes to a prospective buyer during diligence.** Counts or screenshots of records that identify no person may be shared only if they exist; none are provided by default.
- Share sanitized views only: the public repository, the documents here, and screenshots with identifiers hidden.
- Do not share license codes, purchaser emails, Gumroad customer lists, the premium library file or any token. A buyer may review the premium library under a signed confidentiality agreement and only after the seller decides to; it is not part of the public listing.
- Do not state revenue, traffic, subscriber or customer numbers unless they are taken from the source account on the day, and then show the source.

## Expense register (known costs only)

| Item                                   | Cost                                                      | Notes                                                                        |
| -------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Netlify Personal plan                  | About $9 per month, shared across the owner's other sites | Credits and Blobs or Functions metering **UNVERIFIED** (CW-NET-1, CW-NET-2). |
| Domain registration                    | Renewal amount and date not recorded here                 | **UNVERIFIED**; owner to fill in from the registrar.                         |
| Gumroad                                | Per-sale fee only; no recorded fixed fee                  | Rate **UNVERIFIED** here (CW-PAY-1, CW-PAY-5).                               |
| GitHub, Pages CMS, GA4, Search Console | No cost recorded                                          | **UNVERIFIED** plans; owner to confirm.                                      |

No other recurring costs are known. There is no subscription, no AI API cost and no email service.

## Sale-listing draft (honest claims only)

**Headline:** The Adventure Passport - a built, pre-launch product for dog owners: collectible little adventures, free samples, a one-time paid library.

**What it is:** A complete web product on TanStack Start, Netlify Functions and Netlify Blobs. Visitors try 10 free adventures with no account, a matching engine that suggests adventures for their dog, collections (20 defined), stamps and milestones, memory notes and keepsake images made on the device. A one-time purchase through Gumroad is designed to unlock a much larger protected library, synced progress and more keepsakes.

**What is true and checkable:**

- Public source code with no premium text, secrets or customer data; written documentation for product, design, architecture, operations and a launch checklist.
- Automated checks that passed on 2026-11-26: type check, lint with no errors, 847 tests, production build (`QA-REPORT.md`).
- No AI APIs, no accounts for the free experience, no subscriptions; photos never leave the visitor's device.
- Content managed by Pages CMS; affiliate links limited to verified Amazon products.

**What is not true yet (state this plainly):**

- It has not launched. There is no revenue and no customer base to transfer, and no traffic figure is claimed.
- The checkout, the license integration, the live deploy and real-device behavior are unverified (`LAUNCH-CHECKLIST.md`). The browser does not yet load the paid library from the server.
- The premium library is not yet imported to a store.
- Price points ($14.99 introductory, $19.99 standard) are untested hypotheses.

**Included in the sale:** the repository, documentation, content, design assets, the premium library file at closing (once it is imported and backed up), and a handover session. **Not included:** the seller's accounts, payouts and affiliate accounts.
