# Final pre-sale browser QA

This file is assembled from self-contained sections. Each section has its own heading and can be read on its own.

## Pages CMS

Status: **UNVERIFIED in the live Pages CMS.** `.pages.yml` has been checked structurally and by tests, and the direct-edit path has been rebuilt locally, but no
one has signed in to Pages CMS with the repository owner's GitHub login and saved a change. Nothing below should be reported to a buyer as "tested in the CMS" until a person has completed the steps and ticked them.

### What was verified locally (2026-11-24, no login needed)

- `.pages.yml` parses as plain YAML. It uses **no anchors or aliases** (the earlier `&tri` and `&conditions` shortcuts in the stays and packing forms were expanded into plain YAML, which Pages CMS is not documented to need). Every `path` exists: `content/guides`, `content/stays`, `content/places`, `content/affiliates.yml`, `content/products.yml`, `content/packing.yml`, `content/settings.yml`, and the media folder `public/uploads` does not exist yet (Pages CMS creates it on the first upload).
- `src/test/pages-config.test.ts` and `src/test/pages-config-structure.test.ts` compare each form with the content rules: every field the rules accept is on the form, drop-down values equal the allowed values, Markdown is edited with the plain code editor.
- A save is a Git commit to the default branch (`main`). The Netlify build-skip rule builds for every content path (`node scripts/test-netlify-ignore.mjs`: guide Markdown, `content/*.yml`, stays, `.pages.yml`, `public/uploads` all BUILD; only `docs/`, `.github/` and root Markdown skip).
- A bad edit fails the build (content plugin) and the previous deploy stays live. Seen locally by deleting an affiliate entry that a stay refers to.
- Direct-edit path, on a throwaway copy of the repository (never committed): one product `summary`, one packing item `what`, and one line of a Markdown guide were changed, `NITRO_PRESET=node-server vite build` was run, and the markers appeared. The guide line appeared in the served page HTML; the product and packing text appeared in the compiled site data (client and server bundles). The copy was discarded.

### What can be edited in Pages CMS, and what needs a code edit

| Area | Editable in Pages CMS | Where |
|---|---|---|
| Markdown guides (`content/guides/*.md`, 25) | Yes: front matter form plus Markdown body | Articles |
| Stay records (`content/stays/*.yml`) | Yes | Stays |
| Dog rules for places (`content/places/*.yml`) | Yes | Places |
| Affiliate links (`content/affiliates.yml`) | Yes | Affiliate links |
| Products / gear records (`content/products.yml`) | Yes | Products |
| Packing planner content (`content/packing.yml`) | Yes (large form; the file itself can also be edited on GitHub) | Packing planner |
| Business settings (email, site address, GA4, Amazon tag, Impact value, Pinterest, Stay22, stay directory mode) | Yes | Business settings |
| Uploaded photos (`public/uploads`) | Yes | media button in any form |
| **Three TypeScript guides** (`src/content/guides/dog-car-safety-harness-and-crate-guide.ts`, `dog-friendly-cabin-packing-list.ts`, `dog-travel-first-aid-kit-guide.ts`) | **No: code edit** | GitHub or a developer/assistant |
| Home page, About, Contact, Methodology, Editorial standards, Corrections, Privacy, Terms, Affiliate disclosure, List your property (`src/routes/*.tsx`) | **No: code edit** | |
| Destinations (states and towns, `src/content/destinations.ts`), town things-to-do and town reads (`src/content/town-activities.ts`, `town-reads/`) | **No: code edit** | |
| Dog types (`dog-types.ts`), gear category definitions (`gear-categories.ts`, `gear-hub.ts`), tool pages (checklist, cost calculator, host questions, pet cost check, will-my-dog-be-accepted) | **No: code edit** | |
| Policy dataset (`src/content/manager-policies.ts`) and its CSV | **No: code edit** (`docs/DATA-RECHECK-LOG.md`) | |
| Navigation, site name, tagline, footer (`src/config/site.ts`, layout components) | **No: code edit** | |
| Redirects, headers (`netlify.toml`), `robots.txt` | **No: file edit** | |

### Cowork steps (needs the repository owner's GitHub login; stop and ask if anything differs)

Use a **dummy edit that is reverted**. Never publish a test string. Read each step's "expected" before clicking.

1. Open https://app.pagescms.org and sign in with GitHub. Choose the repository and the `main` branch. **Expected:** the sidebar lists Articles, Stays, Places, Affiliate links, Products, Packing planner, Business settings. If the list is empty or an error mentions configuration, record the exact message and stop: `.pages.yml` has a problem.
2. Open **Business settings**. **Expected:** one form, no "create" or "delete" buttons. Check the Amazon, GA4, Impact and "Which stays are listed" fields are present. Do not change them in this test. Close without saving.
3. Open **Articles**. **Expected:** the list shows title, category, status and last reviewed. Open one published guide. Check: Status, Approved by/on, FAQs, Sources, Research block and a plain-code Markdown body (not a rich-text editor).
4. **Reversible save test (Markdown guide).** In that guide, change one word of the body in a harmless place, for example add the word "TEST" at the end of one paragraph. Click Save. **Expected:** a green confirmation, and on GitHub a new commit on `main` by Pages CMS whose changed file is `content/guides/<slug>.md` only. Record the commit link.
5. In Netlify, Deploys. **Expected:** a deploy starts within a minute (it must not say "Skipped"/"Canceled by ignore"). Record the deploy status. If no deploy starts for a Markdown change, STOP: that is the old `*.md` skip bug and the `netlify.toml` change has not reached the repository.
6. When the deploy is Published, open the guide on the live site. **Expected:** "TEST" appears. Do **not** announce it.
7. **Revert.** In Pages CMS remove "TEST" and Save (or on GitHub, revert the CMS commit with the Revert button). **Expected:** a second commit, a second deploy, and the word gone from the live page. Record both commit links. Leave the repository on the same content as before.
8. **Products and Packing.** Open **Products**, open any product, change the first word of "What it is, in plain words" by adding "TEST" at the front, **do not Save**, and click away. **Expected:** the form warns about unsaved changes or discards it; nothing is committed. Repeat in **Packing planner**: open Items, open one item. These are large forms: confirm the lists of categories, trip types and conditions show real names, the "Show only when..." selects list the nine conditions, and a nested product list can be opened. If any field appears empty or crashes, record which and report that the form needs fixing (the file can still be edited on GitHub).
9. **Photo upload (optional).** Upload a small test image through a guide's photo field and then delete the upload on GitHub (`public/uploads/<file>`). **Expected:** the commit lands on `main`; the file is served at `/uploads/<file>` after a deploy.
10. **Validation behaviour.** In **Affiliate links**, change one link's address to `http://` (not https), Save. **Expected:** the commit saves (the CMS does not run the site's validator) and the **Netlify build fails** with "must start with https://" naming the file; the site stays on the previous deploy. Revert it immediately and confirm the next deploy goes green. This proves the safety net. (Skip if the owner does not want a red deploy in the history.)
11. Write results in a table: step, expected, actual, evidence link, pass/fail.

Mark **UNVERIFIED** any step not completed. Record in particular: whether Pages CMS accepts `.pages.yml` as is, whether the `merge: true` setting keeps fields the form does not know about, and whether the large Packing planner and Products forms render.

### Rollback

Every CMS save is one Git commit. To undo: GitHub, the commit, "Revert". Netlify rebuilds. The previous good deploy can also be restored from Netlify, Deploys, "Publish deploy" on an earlier one.
