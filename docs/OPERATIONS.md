# Operations

For the owner and anyone running the site. Nothing here needs a developer unless it says so. Never paste a secret, license code or customer detail into chat, an issue, a commit or a file in this repository.

## Routine maintenance

| When                   | What                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Weekly                 | Review the dependency pull requests Dependabot opens (Mondays, at most 3 npm and 2 Actions at a time, nothing merges itself). Merge only when the CI check is green.             |
| After any deploy       | Run `node scripts/verify-site.mjs <site url>` (needs only Node 22; never buys, signs in or sends anything). Exit 0 means all checks passed.                                      |
| After a content change | Open the live page once. A bad content file fails the build with the file and field named, so a broken edit cannot go live; fix it and save again.                               |
| Monthly                | Check Netlify usage and credits (the build-skip rule below keeps docs-only pushes free). Check each approved affiliate link still has a buy box on Amazon; switch it off if not. |
| Quarterly              | Rotate nothing by default (see secrets below). Re-read the privacy page against what the site really does. Export the premium library (runbook below) and store the file safely. |

Search engines can be notified with the manual "IndexNow" workflow (GitHub, Actions, IndexNow, Run workflow). It does a dry run unless "send" is ticked and should run only after a production deploy.

## Editing public content with Pages CMS

Pages CMS reads `.pages.yml` and edits only the files under `content/` (and photos in `public/uploads`). It cannot change code. Each save is a commit to the repository, and each commit that touches content starts a Netlify build. The branch Pages CMS writes to is set in the Pages CMS app (**UNVERIFIED**: confirm it is the production branch; the full edit, save and publish loop is not yet verified, see C9 in `COWORK-HANDOFF.md`).

Menu names in Pages CMS and the file each one edits:

| Menu name                    | File                       | Typical owner task                                                                                                                                                                                                                       |
| ---------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adventures (free)            | `content/adventures/*.yml` | Edit or add free adventures (the form matches the schema)                                                                                                                                                                                |
| Adventures (premium)         | `content/premium/*.json`   | OFF and should stay OFF (switch in `.pages.yml`, see below): the folder is git-ignored and untracked, so the form could only commit premium text again. Premium editing happens in the protected package (`PREMIUM-CONTENT-WORKFLOW.md`) |
| Adventure collections        | `content/collections.yml`  | Edit a title, tagline, description or order. The code (slug) must not change once adventures use it.                                                                                                                                     |
| Passport stamps              | `content/stamps.yml`       | Edit title, blurb or rule text. Do not change a stamp code that an adventure lists.                                                                                                                                                      |
| Achievements and milestones  | `content/achievements.yml` | Edit a milestone title and reward text                                                                                                                                                                                                   |
| Articles                     | `content/guides/*.md`      | Write or fix a guide. It goes live only when its status is Published AND it has an "Approved by" name and date and no unchecked claims.                                                                                                  |
| Products (travel essentials) | `content/products.yml`     | Edit product facts. No prices, ratings or "tested" claims.                                                                                                                                                                               |
| Affiliate links              | `content/affiliates.yml`   | Turn a verified Amazon link on or off (Approved).                                                                                                                                                                                        |
| Packing planner              | `content/packing.yml`      | Edit the packing planner's items and rules                                                                                                                                                                                               |
| Business settings            | `content/settings.yml`     | Contact email, site address, GA4 id, Amazon tracking id, Pinterest address, Impact verification value                                                                                                                                    |

Workflow: open the menu, open the item, change it, read the labels (they explain each field), Save. Wait for the Netlify build, then open the page. If the build fails, Netlify shows the content error naming the file and field; correct that field in Pages CMS.

**Adventure forms.** The free adventure form and the premium form list every field of the current adventure schema (all 56 fields, including role, teaser, previewTitle, showcase, household, keepsake explainer, review, and the collection, stamp and achievement references), with drop-downs matching the schema's controlled lists. `src/test/handover-cms.test.ts` fails if `.pages.yml` and `src/passport/schema.ts` drift apart, so a developer who changes the schema must update the form in the same change. Do not change an adventure's id. Free adventures are `access: free` only (the field is single-choice, defaulted and read-only); premium adventures are a separate form (**Adventures (premium)**, `content/premium/*.json`) that is switched OFF in `.pages.yml` (commented out between `PREMIUM-CMS-SWITCH:BEGIN` and `PREMIUM-CMS-SWITCH:END`, instructions at the top of the block) and is never part of the website build. Recommended state: OFF, because premium text is no longer tracked in this repository and each save would commit it again. The CMS does not check the adventure id pattern (`adv-` plus six lowercase letters or digits); the build does and a bad file fails the build instead of publishing. Whether the CMS lets you type an id when adding a new free adventure is UNVERIFIED (`NETLIFY-PREVIEW.md`, section 4). Static page wording (home, FAQ, policies and the like) is code, not content: only Business settings are editable in the CMS.

**Premium text is no longer tracked in this repository, but old history still contains it** (`HISTORICAL-EXPOSURE.md`: facts, unknowns and the owner's options; the owner decides on remediation). See `PREMIUM-CONTENT-WORKFLOW.md`.

Collections and stamps: every collection or stamp code listed on an adventure must exist, or the build fails with a clear message.

## Premium library runbook (import, export, backup)

The standard path is one JSON file per adventure in the protected package's `adventures/` folder (`export PREMIUM_DIR=<that folder>`; a git-ignored local copy may sit in `content/premium/`): validate with `node scripts/premium-import.mjs --dir "$PREMIUM_DIR" --env preview` (dry run), back up with `node scripts/premium-export.mjs --dir <folder> --env production`, then import with `--write`. The full workflow, rollback and the optional GitHub Action template are in `PREMIUM-CONTENT-WORKFLOW.md`; the visibility and history options are in `HISTORICAL-EXPOSURE.md`; handing the business to a new owner is `OWNERSHIP-TRANSFER.md`. The single-file commands below still work.

The premium adventures live only in Netlify Blobs, in store `premium-production` (live site) and `premium-preview` (previews and tests). They are loaded by two owner-run scripts on your own computer. The scripts are never deployed, are not web endpoints and are never run by Claude.

**Rules:** keep the library file (one JSON array of adventures) or the protected package outside the repository, in a private folder you choose; both scripts refuse a path inside the repository, with one exception: `--dir content/premium` (a git-ignored local working copy; see `content/premium/README.md`). There is no default folder: pass `--dir` or set `PREMIUM_DIR`. Keep a dated backup somewhere safe. Never commit, email or paste the file. `*.premium.json` and `/premium-content/` are git-ignored as a second guard.

**Setup (each session, in your terminal; never in a file):**

```bash
export NETLIFY_AUTH_TOKEN=...   # a Netlify personal access token
export SITE_ID=...              # the site's API id (Site configuration, Site information)
```

**Import:**

1. Dry run first. It validates every adventure against the schema, requires `access` to be `premium`, checks ids are unique, and writes nothing:
   `node scripts/premium-import.mjs --file <path to your premium JSON> --env preview`
2. Write to the preview store and test on a preview deploy: add `--write`.
3. Write to the live store only when satisfied: `--env production --write --yes-production`.
4. `--prune` also deletes stored adventures that are not in the file. Use it deliberately.

The import writes `adventure/<id>` for each adventure and an `index` listing the ids plus each adventure's status and collection slugs (used by the public summary). Requires Node 22.18 or newer.

**Export (backup):**
`node scripts/premium-export.mjs --out <path outside the repository>/premium-backup.json --env production`
It refuses to overwrite an existing file unless `--overwrite` is given and writes the file readable by you only. The output is the same array the import reads, so export then import restores a store.

**Round-trip test (once, with synthetic data):** B7 in `COWORK-HANDOFF.md`.

## Netlify credits and the build-skip rule

Full cost picture: `OPERATING-COSTS.md`.

Netlify's credit-based plans meter builds, bandwidth, requests and functions (`OPERATING-COSTS.md` records the rates read from Netlify's docs on 2026-11-26: a production deploy costs 15 credits, previews and rollbacks cost 0; Free is 300 credits with a hard stop, Personal is $9 for 1,000). Whether Blobs are metered and the real plan are **UNVERIFIED** until A1 and A5. Keep auto-recharge off and review usage monthly. Push is paused, so the 15-minute scheduled function uses nothing.

`netlify.toml` skips the build when a push changes only `docs/`, `.github/` or Markdown files in the repository root. Exit code 0 from the `ignore` command means skip. It deliberately does **not** skip other Markdown: guides in `content/guides/*.md`, any Markdown under `content/` or `src/`, and every Pages CMS save must build. If the cached commit reference is empty the build runs. `node scripts/test-netlify-ignore.mjs` tests 20 situations against the real command (CI runs it); run it after any change to the `ignore` line. A change to `netlify.toml`, `package.json`, `.pages.yml` or anything in `src/`, `content/` or `public/` always builds.

## Affiliate ID replacement

Affiliate links are limited to verified Amazon products.

- **Amazon tracking id:** one value, `amazonTrackingId` in Business settings (`content/settings.yml`). Every Amazon address in `content/affiliates.yml` contains the placeholder `{amazonTrackingId}`, so changing this one value retags every link. Empty hides all Amazon links.
- **Impact verification value:** `impactSiteVerification` in the same file is the seller's own account value; the new owner replaces it with theirs or clears it.
- **A link shows a Buy button only when `approved` is true.** Set it to false when a product loses its Amazon buy box. A product never stores an affiliate address; it names an entry in `affiliates.yml`.
- The affiliate disclosure page and in-article notices appear automatically when approved links are shown.

## Environment variables (names only; set in the Netlify UI, never in files)

| Name                     | Where                         | Purpose                                                                                                  |
| ------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `SESSION_SECRET`         | Netlify, Functions scope      | Signs sessions and CSRF tokens. At least 32 characters or the API answers 503.                           |
| `PP_DATA_KEY`            | Netlify, Functions scope      | Keys the purchase lookup hash and seals stored codes. Set once before the first customer; never change.  |
| `GUMROAD_PRODUCT_ID`     | Netlify, Functions scope      | Which Gumroad product a license code must belong to                                                      |
| `PP_ALLOW_TEST_PROVIDER` | Preview and dev contexts only | `1` enables the test provider; ignored in production                                                     |
| `CONTEXT`                | Set by Netlify (do not set)   | `production` selects the production stores; anything else uses `customers-preview` and `premium-preview` |
| `VITE_CHECKOUT_URL`      | Netlify, build scope (public) | The https Gumroad product link shown on `/unlock`. Not a secret. Hidden until set.                       |
| `SHOW_DRAFTS`            | Preview deploys only          | Shows draft guides. The build refuses `true` on the live site.                                           |
| `NETLIFY_AUTH_TOKEN`     | Your terminal only            | Used by the premium scripts                                                                              |
| `SITE_ID`                | Your terminal only            | Used by the premium scripts                                                                              |

Notification variables (`NOTIFICATIONS_ENABLED`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) are in `NOTIFICATIONS.md`; what to rotate when ownership changes is in `OWNERSHIP-TRANSFER.md`, section 2. Rotating `SESSION_SECRET` signs everyone out. Rotating `PP_DATA_KEY` breaks purchase lookups and the stored-code re-check, so treat it as permanent. If either leaks, set a new `SESSION_SECRET` immediately and plan `PP_DATA_KEY` migration with a developer.

The step-by-step preview procedure, the preview-versus-production values for each variable and the checks to run are in `NETLIFY-PREVIEW.md`.

## Check-ins after launch

Each check-in: open the site on a phone, activate and restore with a test code on a preview, and compare against the thresholds proposed in `DECISIONS.md`.

- **30 days:** Netlify usage and credits; any build or Function errors; GA4 events arriving (no personal data in parameters); every approved affiliate link still available; Gumroad dashboard for refunds and disputes; contact inbox answered; first premium export stored.
- **60 days:** dependency updates merged; Search Console coverage and queries; check that refunded purchases lose premium access in a preview test; review the privacy page against reality; review which adventures are revealed but not completed (analytics) for content fixes.
- **90 days:** decide on price using the validation thresholds; refresh the content review for any new adventures; re-verify Gumroad documentation facts that the code depends on (see `ARCHITECTURE.md`, unverified list); confirm the Netlify plan still fits.
