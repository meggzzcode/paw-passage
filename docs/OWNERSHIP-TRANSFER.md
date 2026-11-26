# Ownership transfer pack (sale of the business)

For the seller and a non-technical buyer. It lists everything that changes hands, the order to do it in, what to rotate, and how the buyer runs the business afterwards. It complements `FLIP-HANDOFF.md` (what transfers, diligence rules, sale-listing draft) and does not repeat it. Anything not proven is marked **UNVERIFIED**. **This is not legal advice**: have a lawyer review the sale agreement, the policy updates (section 8) and any trademark question. This file holds no secrets, customer data or revenue figures, and none may be added.

## 0. Plain statements before anything else

- **Premium text is currently in a PUBLIC repository.** By the owner's decision of 2026-11-26, the paid adventures sit in `content/premium/` (one JSON file per adventure) in the same GitHub repository as the website, and that repository is still public. The paid library is protected only once the repository is private. **Next step: make the repository private, then check forks and clones** (`PREMIUM-CONTENT-WORKFLOW.md`, section 1). Do this before the buyer is given access, and tell a buyer plainly that the files were public for a period and may have been copied. The website build never reads that folder, so the site does not ship it.
- **The buyer must set up their own Gumroad payout and identity.** Gumroad payouts and identity verification are tied to a person or company and cannot be handed over. The seller's payout details, tax identity and balance stay with the seller. The buyer opens or uses their own Gumroad account, completes Gumroad's identity and payout setup themselves, and creates or receives the product there. Whether an existing Gumroad product and its license keys can move between accounts is **UNVERIFIED** (A8 in `COWORK-HANDOFF.md`); ask Gumroad support in writing before the sale closes.
- No customer data goes to a prospective buyer during diligence (`FLIP-HANDOFF.md`).

## 1. Inventory: every account and asset that changes hands

| Asset                                          | What the buyer needs                                         | How it moves                                                                                                                                                             | Notes                                                                                                                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub repository                              | Owner or admin access                                        | Transfer the repository to the buyer's GitHub account or organization (Settings, Danger Zone, Transfer), or the buyer forks and the seller archives                      | Make it private first. Contains the website, free adventures, engine, docs, tests and (currently) `content/premium/`. Collaborators and tokens the seller added must be reviewed and removed. |
| Netlify site                                   | Site owner on the buyer's team                               | Transfer the site to the buyer's Netlify team (keeps environment variables and Blobs in place, **UNVERIFIED** on the seller's plan), or recreate it from the repository  | Holds production environment variables, the Blobs stores (customer data, premium library), build settings and the scheduled function. See sections 3 and 7.                                   |
| Domain and DNS                                 | Registrar account, DNS control                               | Registrar account push or domain transfer; keep DNS records unchanged until the buyer confirms the site loads                                                            | Registrar and renewal date are not recorded in the repository: **UNVERIFIED**, the seller writes them in the handover notes. Do not let the domain expire during transfer.                    |
| Gumroad (account, product, payout, identity)   | Their own Gumroad account with their own identity and payout | See section 0. The product page, price ($19.99 one-time) and license key setting are recreated or moved if Gumroad allows                                                | `GUMROAD_PRODUCT_ID` (server) and `VITE_CHECKOUT_URL` (build) must point at the buyer's product. License codes are verified against that product id.                                          |
| Pages CMS                                      | Sign in with GitHub and open the repository                  | No transfer: access follows GitHub repository access                                                                                                                     | Configuration is `.pages.yml`. The buyer is added as a collaborator or owner.                                                                                                                 |
| Private premium repository                     | Only if the seller used the separate-repository option       | Repository transfer as above                                                                                                                                             | In the default single-repository setup, the premium files are in `content/premium/` of the main repository.                                                                                   |
| Google Drive backups                           | Ownership of the backup folder                               | Move or share the folder to the buyer, then the seller removes copies                                                                                                    | Contains premium exports and notes. Confirm what is in it before sharing; a premium export is the paid library.                                                                               |
| Cowork and other tooling                       | Own accounts                                                 | The seller's Cowork (browser-agent) sessions, tokens and saved credentials do not transfer; the buyer sets up their own. Tasks are in `COWORK-HANDOFF.md`                | Remove the seller's tokens from any tool.                                                                                                                                                     |
| Analytics (GA4, Search Console)                | Owner role                                                   | Add the buyer as owner, then the seller removes themselves. The GA4 id is `ga4MeasurementId` in `content/settings.yml`; the buyer may replace it with their own property | The site collects no personal data in analytics parameters.                                                                                                                                   |
| Affiliate accounts (Amazon Associates, Impact) | Their own accounts                                           | Not transferable: the buyer replaces `amazonTrackingId` and `impactSiteVerification` in Business settings                                                                | Amazon links hide when the tracking id is empty.                                                                                                                                              |
| Pinterest profile                              | Profile access                                               | Hand over the login or transfer the profile (D6)                                                                                                                         | Address is `pinterestUrl` in settings.                                                                                                                                                        |
| Contact mailbox                                | Control of the address in `contactEmail`                     | Move the mailbox or change the address in Business settings                                                                                                              | Policies and the Contact page show it.                                                                                                                                                        |
| Documentation and tests                        | Read access (inside the repository)                          | Included in the repository                                                                                                                                               | `docs/` and the test suite are the buyer's maintenance manual.                                                                                                                                |

## 2. Environment variables: what to rotate on transfer

Names only; values live in the Netlify site settings and are never written in files, email or chat. Hand secrets over through a password manager's shared item or in person, never by email.

| Name                                                     | Secret?                          | Rotate on transfer?                                                                                         | What happens if you rotate                                                                                                                                                                                                                                                                                |
| -------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SESSION_SECRET`                                         | Yes                              | **Yes, recommended** (buyer sets a fresh one of 32 or more characters)                                      | Every signed-in browser is logged out once. Customers sign back in with their license code (restore); no data is lost. Safe at any time.                                                                                                                                                                  |
| `PP_DATA_KEY`                                            | Yes                              | **Avoid.** Keep the same value with the site                                                                | It keys the purchase lookup hash and seals stored codes and push subscriptions. Rotating it invalidates sealed push subscriptions and breaks purchase lookups and the stored-code refund re-check for existing customers (they could create a second record). Rotate only with a developer-run migration. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Private key: yes                 | **Yes, if notifications are on**                                                                            | All existing push subscriptions stop working; devices must turn notifications on again. Generate a new pair on the buyer's own computer (`npx web-push generate-vapid-keys`), set `VAPID_SUBJECT` to the buyer's monitored address.                                                                       |
| `NOTIFICATIONS_ENABLED`                                  | No                               | **Set to anything but `true` (off) during the transfer**, turn on again after the buyer's VAPID keys are in | Off = no sending and no subscribing; nothing is read. It is the kill switch.                                                                                                                                                                                                                              |
| `GUMROAD_PRODUCT_ID`                                     | Not secret, but account-specific | **Yes** if the product changes                                                                              | License codes from the old product stop verifying; see section 9.                                                                                                                                                                                                                                         |
| `VITE_CHECKOUT_URL`                                      | No (public)                      | **Yes** if the product changes                                                                              | The Unlock page buy link points to the new product after a rebuild.                                                                                                                                                                                                                                       |
| Gumroad credentials (login, any API token)               | Yes                              | **Yes**: the seller keeps theirs; the buyer uses their own                                                  | The repository stores no Gumroad API token (**UNVERIFIED**; confirm in the Netlify variables list).                                                                                                                                                                                                       |
| `NETLIFY_AUTH_TOKEN`, `SITE_ID`                          | Token: yes                       | Seller revokes their token; buyer creates their own                                                         | Only used by the premium scripts in a terminal (and the optional Action).                                                                                                                                                                                                                                 |
| `PP_ALLOW_TEST_PROVIDER`, `SHOW_DRAFTS`                  | No                               | Check they are NOT set in production                                                                        | Test settings; preview only.                                                                                                                                                                                                                                                                              |

**Safe procedure for rotating `SESSION_SECRET`** (the only rotation most buyers do): (1) pick a quiet time; (2) in Netlify, Site configuration, Environment variables, edit `SESSION_SECRET` for the Functions scope; (3) trigger a deploy so the function picks it up (whether it applies without a redeploy is **UNVERIFIED**); (4) open the site in a private window, enter a test license code on a preview deploy, then on production; (5) expect existing visitors to be signed out once. **For `PP_DATA_KEY`: do not change it. Transfer the Netlify site with the value in place, or hand the value over securely, or use a developer-run migration.**

## 3. Order of transfer

Do the steps in this order; each depends on the one before.

1. Seller: make the repository private and check forks and clones (`PREMIUM-CONTENT-WORKFLOW.md`, section 1). Export a fresh premium backup (`node scripts/premium-export.mjs --dir <folder outside the repo> --env production`) and store it safely.
2. Seller: write the handover notes (registrar, renewal date, who has access to what), without secrets.
3. Both: sign the sale agreement (lawyer reviewed) and agree what moves and when.
4. Buyer: create their GitHub, Netlify, Gumroad (identity and payout), Google and password-manager accounts.
5. Seller: transfer the GitHub repository. Buyer: confirm they can open it and Pages CMS.
6. Seller: transfer the Netlify site (or buyer recreates it from the repository and re-enters variables). Buyer confirms a deploy works.
7. Seller turns `NOTIFICATIONS_ENABLED` off; buyer sets a new `SESSION_SECRET`; secrets are handed over securely (`PP_DATA_KEY` stays as is).
8. Buyer sets up their own Gumroad product; update `GUMROAD_PRODUCT_ID` and `VITE_CHECKOUT_URL`; redeploy (see section 9 before changing the product).
9. Seller: transfer the domain; keep DNS unchanged until the site works on the buyer's account. Then update DNS if the host changed.
10. Buyer: replace analytics, affiliate ids and contact email; update policy pages (section 8).
11. Buyer: run the post-transfer checks (section 4). Seller removes themselves from every account and revokes their tokens.

## 4. Day-by-day checklist

| Day      | Who           | Task                                                                                                                                                                                                        |
| -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -7 to -1 | Seller        | Repository private; forks and clones checked; leak check passed on a build (`node scripts/check-leaks.mjs dist`); fresh premium export stored; handover notes written; docs and tests current (section 12). |
| 1        | Both          | Agreement signed. Buyer creates accounts. Seller adds the buyer as GitHub admin collaborator.                                                                                                               |
| 2        | Seller, buyer | GitHub repository transfer. Buyer opens Pages CMS and the repository. Buyer reads `README.md`, this file and `OPERATIONS.md`.                                                                               |
| 3        | Seller, buyer | Netlify site transfer or recreation. Turn `NOTIFICATIONS_ENABLED` off. Buyer sets new `SESSION_SECRET`; deploy; run `node scripts/verify-site.mjs <site url>` (exit 0 = all checks passed).                 |
| 4        | Buyer         | Gumroad identity and payout complete; product created; `GUMROAD_PRODUCT_ID` and `VITE_CHECKOUT_URL` set; one test purchase and one refund of a real low-cost order, if the buyer chooses (E5 to E7).        |
| 5        | Seller, buyer | Domain move; confirm HTTPS and the site load on the domain. Confirm the premium library count matches the export (dry run and the public summary).                                                          |
| 6        | Buyer         | Policies updated (with a lawyer); analytics, affiliate ids and contact address replaced.                                                                                                                    |
| 7        | Both          | Seller removes themselves from GitHub, Netlify, Gumroad (their own account stays theirs), analytics, Drive and Cowork; revokes tokens. Buyer takes a first backup export. Sign-off.                         |

## 5. What customer data exists, and how it moves

The site keeps customer data only in Netlify Blobs (see `ARCHITECTURE.md`, Stores). There are no photos, and the app asks for no email address (**UNVERIFIED** against the live Gumroad response; check before stating it to a buyer).

| Store                  | Contents                                                                                                                                                                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customers-production` | Per customer: the synced progress (profile, preferences, completed and saved adventures, memories, feedback), an entitlement record (a hash of the purchase reference, status, dates, a sealed copy of the license code), and push subscriptions and reminder plans if notifications are on. |
| `premium-production`   | The paid library (one record per adventure), its index, public previews, and the notification kill-switch flag.                                                                                                                                                                              |

How it moves: if the Netlify **site is transferred**, its Blobs move with it (**UNVERIFIED** on the seller's plan; test on a copy first). If the buyer **recreates** the site, the premium library is restored from an export (`premium-import.mjs`), but **there is no export or import script for customer records**: a developer must write and test one, or customers restore access with their license key (their progress also lives in their own browser and can be exported by them). Customer data is not shared during diligence and moves only after the buyer accepts the privacy obligations in writing.

## 6. Existing customers' access

- License keys keep working as long as the buyer's server verifies them against the same Gumroad product (`GUMROAD_PRODUCT_ID`) and `PP_DATA_KEY` is unchanged. If the product moves to a new Gumroad account, old keys may stop verifying: the buyer and a developer must plan a re-issue or a grandfathering list before closing.
- Refunds: access is re-checked against Gumroad (see `ARCHITECTURE.md`). A refund takes effect on the next re-check, not at the second it is issued, so a refunded customer may keep access for a short while (latency **UNVERIFIED**; test with E5 to E7).
- If `SESSION_SECRET` rotates, customers are asked to restore with their license key; nothing is lost.

## 7. Netlify site facts the buyer should know

The site has two environment-split Blobs stores (production and preview), one scheduled function (notifications, off unless enabled), and a build-skip rule that keeps docs-only pushes free (`OPERATIONS.md`). Use the Netlify usage page monthly. Keep auto-recharge off until credit use is understood.

## 8. Policy pages the new owner must update

The Privacy, Terms and Refund policy pages (and the Contact and Affiliate disclosure pages) name the seller as operator, the contact address and the seller's way of handling data and refunds. The new owner must update the operator name, address and contact, the description of who holds customer data, the refund terms and the affiliate disclosure for their own accounts, then re-read each page against what the site really does. **These are not legal advice: a lawyer should review the policies and the terms of the sale.** The pages are `src/routes/privacy.tsx`, `terms.tsx`, `refund-policy.tsx`, `disclaimer.tsx` and `affiliate-disclosure.tsx` (a developer or the owner with a developer's help edits the wording; the business address and email are in `content/settings.yml`).

## 9. Intellectual property inventory

| Item                                                                                   | Status                                                                             | To verify before sale                                                                                                                                                                |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Original adventure text (free in `content/adventures/`, premium in `content/premium/`) | Written for this product; research is paraphrased, not copied (`CONTENT-GUIDE.md`) | The seller confirms in the sale agreement that they own it (including any text written with AI tools or contractors: **UNVERIFIED** what applies).                                   |
| Original art (keepsake artwork, stamp art, icons)                                      | Generated by code in the repository                                                | Confirm no artwork was copied from elsewhere.                                                                                                                                        |
| Fonts: DM Sans and Fraunces                                                            | Self-hosted; SIL Open Font License 1.1 (license texts in `public/fonts/OFL-*.txt`) | Confirm the exact licenses and any attribution requirements.                                                                                                                         |
| Guide photos                                                                           | Licensed from Unsplash under the Unsplash License (`FLIP-HANDOFF.md`)              | A license to use, not ownership; confirm each photo's source and terms.                                                                                                              |
| Software dependencies                                                                  | Open-source packages (see `package.json`)                                          | A developer can list their licenses; none is expected to restrict commercial use, **UNVERIFIED**.                                                                                    |
| Brand and domain                                                                       | The name "Paws & Passage" and the domain are used as the brand                     | **Trademark clearance for "Paws & Passage" is NOT verified.** A search and, if wanted, a filing should be done by a trademark lawyer. The domain transfers; a trademark is separate. |
| Marketing material (Pinterest, printables, images)                                     | Created for the product                                                            | Confirm sources for any outside images.                                                                                                                                              |

## 10. Running the business (non-technical owner)

**Weekly, about 15 minutes**

1. Open the site on your phone and tap through the home page, Discover and Unlock. It should look right and load.
2. Read the contact inbox; answer customer emails within two working days.
3. Open the Gumroad dashboard: sales, refunds, disputes.
4. Open GitHub, Pull requests: merge dependency updates only when the CI check is green.
5. Glance at Netlify: last deploy is green.

**Monthly, about 1 hour**

1. Netlify usage and credits (`OPERATIONS.md`); keep auto-recharge off.
2. Run `node scripts/verify-site.mjs <site url>` after any deploy; exit 0 means all checks passed.
3. Export the premium library to a backup folder outside the repository (`PREMIUM-CONTENT-WORKFLOW.md`, section 6); keep the last three.
4. Check each approved affiliate link still works; turn off any that do not.
5. Re-read Privacy and Refund pages against reality; check the domain renewal date.
6. Review Search Console and analytics, and plan one content improvement.

## 11. First-week training plan for a buyer

| Day | Learn                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tour of the live site as a visitor, then every account on the inventory (what it is for, who can log in). Read `README.md` and this file.                 |
| 2   | Pages CMS: change one wording in a free adventure and a collection; watch the Netlify build; open the live page.                                          |
| 3   | Premium workflow: run the dry run, an export and the preview import (`PREMIUM-CONTENT-WORKFLOW.md`). Never run a production write without a fresh backup. |
| 4   | Gumroad and money: dashboard, refunds, payouts, license keys; read `ARCHITECTURE.md` access section.                                                      |
| 5   | Netlify: environment variables (names only), deploys, usage, the notifications kill switch. Practice rolling back a deploy.                               |
| 6   | Policies, support replies, privacy rules (no customer data in chat or email).                                                                             |
| 7   | Run the weekly routine alone with the seller on call, then the sale-readiness check (section 12).                                                         |

## 12. What a nontechnical owner can do, and what needs a developer

| A nontechnical owner can                                                                                   | Hand to a developer                                                                    |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Edit wording of adventures, collections, stamps, achievements, articles and Business settings in Pages CMS | Change the schema, the engine or the CMS form (`src/passport/schema.ts`, `.pages.yml`) |
| Run the premium dry run, export and import commands from a copy-and-paste list                             | Customer-record export or import, store migrations, rotating `PP_DATA_KEY`             |
| Merge green dependency pull requests                                                                       | Failing builds, major upgrades, security issues                                        |
| Handle refunds and support in Gumroad and email                                                            | Change checkout or the license integration                                             |
| Turn the notifications kill switch off                                                                     | Set up or rotate VAPID keys; enable the GitHub Action for imports                      |
| Replace affiliate ids, contact email, site address                                                         | Edit policy page code; add new pages or features                                       |

## 13. Operating costs (from existing docs)

- Netlify Personal plan: about $9 a month, shared across the owner's other sites; credits and Blobs or Functions metering **UNVERIFIED** (A1, A5). Notification delivery is estimated at about 5 to 39 credits a month for 100 to 10,000 customers when enabled (`NOTIFICATIONS.md`).
- Domain: renewal amount and date not recorded: **UNVERIFIED**; the seller fills it in.
- Gumroad: a per-sale fee only, no recorded fixed fee; the rate is **UNVERIFIED** here (A7, E4).
- GitHub, Pages CMS, GA4, Search Console: no cost recorded; plans **UNVERIFIED**. A private repository changes GitHub's free-tier limits (for example Actions minutes): check GitHub's current plan page.
- No AI API cost, no email service, no subscription. Anything a buyer adds (a developer, a lawyer, a trademark filing) is extra.

## 14. Sale-readiness checklist

- [ ] Docs current: `README.md`, `OPERATIONS.md`, `CONTENT-GUIDE.md`, `PREMIUM-CONTENT-WORKFLOW.md`, `ARCHITECTURE.md`, `FLIP-HANDOFF.md` and this file all describe the real setup (including that premium files are in `content/premium/`).
- [ ] Tests green: `npx tsc --noEmit`, `npm run lint`, `npx vitest run` pass; `node scripts/test-netlify-ignore.mjs` passes.
- [ ] No secrets in the repository: search for tokens, keys and license codes; environment variables exist only in Netlify.
- [ ] Repository is private; forks and clones checked (`PREMIUM-CONTENT-WORKFLOW.md`, section 1).
- [ ] Leak check passed on a fresh build: `node scripts/check-leaks.mjs dist` (and the folder the build reports).
- [ ] Backups: a dated premium export stored outside the repository, restore dry run tested, Drive folder contents known.
- [ ] Runbooks: weekly and monthly routines (section 10) tried once by someone other than the author.
- [ ] Accounts inventory (section 1) filled in with real owners, renewal dates and who must be removed.
- [ ] Policies reviewed by a lawyer; trademark question answered or disclosed as open.
- [ ] Gumroad: the buyer's identity, payout and product ready; license continuity plan agreed (section 6).
