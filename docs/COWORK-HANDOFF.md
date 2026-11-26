# Cowork handoff

The one current list of what remains. It replaces every earlier handoff, including the old A to F phases. Google tasks keep their ids from `docs/GOOGLE-SETUP.md` (R1 to R10, P1 to P7, L1 to L10, T1 to T5, M1 and A1 to A9); they are not repeated here.

**Rules for every task.** Nothing here may spend money, publish, deploy or change DNS or billing without the owner's explicit authorization in that session. Never paste a secret, license code, token or banking detail into chat, a file, a commit or a screenshot. Secrets are entered by the owner in the Netlify web UI only. Do not nag the owner about items marked "later".

**Standing facts.** One-time $19.99 (`offer` in `src/config/site.ts`; it must equal the price on the Gumroad product); no subscription. Photos stay on the device. Gifting, PWA install prompts and push stay disabled (`flags.gifting=false`, `PWA_ENABLED=false`, `flags.notifications=false`). Preview testing uses SYNTHETIC content only; the real premium library goes only into an access-controlled environment after the owner authorizes it (an undisclosed URL is not access control). The protected premium package is kept outside the repo; private records are kept privately by the owner. Library size is 115 adventures in the repo (16 free plus 99 premium), 116 once the staged private premium card is added; quote counts only from `node scripts/library-stats.mjs --md` in the matching mode.

## 1. Code changes

**Done.** Free first-adventure flow with practical-info-first recommendation and "show me another"; public showcase previews and the two public preview endpoints; save before you buy; the commercial pages (home, unlock, FAQ, trust pages); analytics event allow-list; leak guards; Journal; the Google setup and indexing policy (`docs/GOOGLE-SETUP.md`).

**Pending.**

1. Design integration after Lovable approval. Lovable has already committed a site-wide retheme to `main` (`59cd632`, which deleted the concept pages) and a plan file (`5941db1`). The owner's options A, B and C for how to bring that work into this codebase are pending; do not choose for the owner. Details: `docs/DESIGN-INTEGRATION.md`, `docs/DESIGN-ASSET-LICENSES.md`.
2. Consent restyle: the consent surface restyled to match the approved design, behavior unchanged until the owner decides the markets and consent mode (section 2).
3. Final verification: the lead fills the Last verified run tables in `docs/QA-REPORT.md` for the commit that is proposed for launch.

## 2. Owner decisions

Record each answer with date and decider. Cowork does not decide these.

| Decision                         | Notes                                                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Markets and consent mode         | Which regions to serve; banner, or analytics cookies off; then the Cookies section of `/privacy` must match                                    |
| Canonical host                   | www (recommended) or apex; the other 301s to it (L1)                                                                                           |
| Repository privacy               | Owner: fine, later. Do not nag                                                                                                                 |
| New clean repository             | Name it and migrate at the end, with a separate approval for re-linking Netlify and Lovable (`docs/REPO-MIGRATION.md`)                         |
| Premium package additions        | Quiet Garden card; Treasure Island variation                                                                                                   |
| Free outdoor card                | One free outdoor adventure for puppies, limited-mobility dogs and noise-sensitive dogs                                                         |
| Bonus experiences                | Define the term (the inventory currently counts 22) before any public copy uses a number                                                       |
| Refund period                    | Set on the Gumroad product; the site states no period                                                                                          |
| Gifting go or no-go              | Stays off unless the Gumroad gift test passes completely                                                                                       |
| PWA and push go or no-go         | Stay off at launch (recommended)                                                                                                               |
| Slogan                           | The earlier signature line is removed everywhere with a guard test; the tagline is "A lifetime of little adventures." Confirm the final slogan |
| Two flagged 301s                 | Confirm the two redirects flagged in `docs/GOOGLE-SETUP.md` section 2.3 before any change                                                      |
| Attribution option               | Which Gumroad attribution option to use (`docs/GOOGLE-SETUP.md` 4.5)                                                                           |
| Internal-traffic IPs             | Owner supplies the addresses to exclude from GA4 (never written to the repo)                                                                   |
| Retention                        | GA4 data retention (14 months recommended)                                                                                                     |
| Retire stays-era GA4 items       | Approve deleting old key events, audiences and definitions                                                                                     |
| Lovable asset provenance         | Source and license of every image and font, and whether any imagery is AI-generated; label AI imagery visibly where used                       |
| Real library in a preview store  | No (recommended): synthetic content only. Real import only into an access-controlled environment after authorization                           |
| Support mailbox and policy items | Confirm the support address receives mail; deletion-request policy; lawyer review of the trust pages (`docs/POLICIES-REVIEW.md`)               |

## 3. External setup

- **Netlify credits and deploys (Phase N).** Live production is `main@6d80efb`; rollback target is `main@f02e4f9`. Credits were 6.8, then the owner bought one pack. N1 confirm the pack is applied and auto-recharge stays disabled. N2 manual deploys only: stop automatic builds, keep auto publishing locked, and confirm a push to `main` does not start a build. N3 keep branch deploys off. N4 record the live deploy id and rollback target. N5 deploy only when the owner says so (one production build is about 15 credits; `node scripts/cost-model.mjs`). Pass: a test push creates no build and credits are unchanged.
- **Domain.** Decide the canonical host and keep DNS changes owner-approved (L1 to L10).
- **Google, read-only inspection NOW.** Search Console properties, sitemaps, Pages and Removals reports, GA4 stream and settings: R1 to R10. Change nothing; export history first. Old Google URL cleanup is planned from what this finds, and is changed only after owner approval (L-group, T-group).
- **Supabase and Netlify.** Supabase is only touched if the design integration requires it. Netlify environment variables are set by the owner: `SESSION_SECRET`, `PP_DATA_KEY`, `GUMROAD_PRODUCT_ID` (Functions) and `VITE_CHECKOUT_URL` (build). `PP_ALLOW_TEST_PROVIDER` only on previews. Preview procedure: `docs/NETLIFY-PREVIEW.md`; import and backup: `docs/PREMIUM-CONTENT-WORKFLOW.md`.
- **Support mailbox test.** Send a message to the address on `/contact` from an outside address and confirm a reply from the same address (launch blocker).
- **Preview checks.** P1 to P7 once a preview exists (synthetic content only).

## 4. Physical-device verification

On a real iPhone and a real Android phone, preview only, test codes only. Report OS and browser versions for every failure.

- Sign-out: My Passport, "Sign out of this device"; progress stays; restore through Restore access.
- Shared device: a second person on the same phone sees no one else's dog or photos after sign-out.
- Consent: the banner or setting appears per the chosen mode, can be changed later, and analytics events arrive only when allowed.
- Keepsake: camera and library both work; the exported PNG has no EXIF or GPS; no network request carries image data.
- Free flow: quiz, recommendation, "show me another", reveal, stamp, widen with puppy plus senior plus children; 44 px tap targets; reduced motion honored.
- PWA and push: later, only if the owner turns them on (`docs/PWA-DEVICE-TEST.md`).

## 5. Gumroad (LAST, owner-owned)

Do not start until sections 1 to 4 are clear. Owner only for account, payout and any purchase. Steps: seller account; draft product at $19.99 with license keys; product id and checkout link entered by the owner in Netlify; verify the license response fields with a real test key; one authorized purchase, restore on a second browser, refund and revocation; optional gift test; buyers-only email workflow (`docs/EMAIL-NUDGES.md`); attribution findings (T1 to T5). Do not claim pin-to-sale attribution.

## 6. Production authorization

Nothing deploys, imports the real library, changes DNS or changes billing without the owner's written approval in that session. Before approval: the launch gates in `docs/LAUNCH-CHECKLIST.md` read Pass, the QA tables are filled for the launch commit, and a rollback copy and secure backup exist. After a production deploy: `node scripts/verify-site.mjs <site url>`, `node scripts/check-leaks.mjs` on the build, and weekly Search Console checks for the first month (M1, A1 to A9). Recovery is a Netlify production rollback to the earlier published deploy; no tag is needed.
