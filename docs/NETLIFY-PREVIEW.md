# Netlify preview deployment

One procedure to put the branch `claude/lucid-davinci-l2fixa` on a private-by-obscurity Netlify preview and check it. It does not touch production, DNS, the domain, billing or the Gumroad seller account. Everything marked **UNVERIFIED** has not been proven by a real deploy; the first preview is the proof.

## 0. What the local build already proved (2026-11-26)

Run on this branch with `rm -rf dist .netlify .output && NITRO_PRESET=netlify npx vite build` (exit 0):

- Static site: `dist/` (hashed assets in `dist/assets`, `gone.html`, `offline.html`, icons, fonts, `robots.txt`, `sw.js`, `manifest.webmanifest`). This matches `publish = "dist"`.
- Server-rendered pages: `.netlify/functions-internal/server/` (a Nitro function that answers `/*`, `preferStatic: true`, `excludedPath: /.netlify/*`). `.output/` is not produced.
- Nitro wrote `dist/_headers` (only the `/assets/*` cache rule) and an empty `dist/_redirects`. The real redirects, 410s and security headers come from `netlify.toml` (46 rules answering 410 to `/gone.html`, 10 rules answering 301; all `force = true`). `netlify.toml` rules are read by Netlify at deploy time; they are not visible in `dist`. **UNVERIFIED until a deploy.**
- `netlify/functions/api.ts` bundles (esbuild, node, about 870 KB) and declares `config.path` for 18 `/api/...` routes. `push-deliver.ts` bundles and has no schedule (paused). Netlify bundles these itself at deploy; the local esbuild run only proves the imports resolve.
- Leak scan: `node scripts/check-leaks.mjs dist` and `node scripts/check-leaks.mjs .netlify` both pass (synthetic markers only). An extra local scan against the real premium text (`--premium-dir`) found none in `dist` or `.netlify`; it did find one premium adventure id inside the home/discover bundle because a collection lists it by id (an id only, no text).
- Local smoke test of the built server function (called as a fetch handler, not through Netlify): `/`, `/unlock`, `/journal`, `/discover`, `/guides` return 200 HTML with the Referrer-Policy and Permissions-Policy headers; `/stays` returns 404 from the function because the 410 is Netlify's job (redirect rule). `/api/*` is NOT served by this function: it belongs to `netlify/functions/api.ts`, so those paths 404 here by design.
- API logic smoke test (`createApi` with in-memory stores): `/api/previews` 200 `{items:[],total:0,collections:0}` (no preview store yet; in a preview context the synthetic sample catalogue is served instead, see section 3 item 5), `/api/session` 401 `not_signed_in`, `/api/access/activate` with a `TEST-VALID-...` code: 200 in `deploy-preview`, **503 `provider_unavailable` in `production` and with no context**, even with `PP_ALLOW_TEST_PROVIDER=1`.
- NOT proven locally: Netlify routing of `/api/*` to the API function instead of the catch-all SSR function (Netlify normally prefers the more specific path; **UNVERIFIED**), real Netlify Blobs, headers/redirects from `netlify.toml`, the build-skip behavior on Netlify.

## 1. Create the preview (owner or Cowork, in the Netlify UI)

Use a branch deploy, not a pull request into `main`:

1. Netlify, the site, **Site configuration, Build and deploy, Branches and deploy contexts**.
2. Under **Branch deploys** choose **Let me add individual branches** and add `claude/lucid-davinci-l2fixa`. Leave **Production branch** and **Deploy Previews** as they are. (Do not change billing, domains or the production branch.)
3. Trigger it by pushing to the branch, or **Deploys, Trigger deploy, Deploy branch**. **UNVERIFIED:** if the build-skip rule (`ignore` in `netlify.toml`) skips it, use **Clear cache and deploy**.

Expected URL: `https://<branch>--<site-name>.netlify.app`, where Netlify rewrites the slash in the branch name (so about `claude-lucid-davinci-l2fixa--<site-name>.netlify.app`; **UNVERIFIED**, copy the exact link from the deploy page). Share only with the people who test; it is not password protected unless you enable Netlify's deploy protection (a billing-plan feature, do not change plans for this).

## 2. Preview environment variables (optional for previews)

**No variables are needed for a preview.** On a Netlify branch deploy or deploy preview the site falls back to fixed, public, throwaway values for `SESSION_SECRET` and `PP_DATA_KEY` and switches the test provider on (`withPreviewDefaults` in `src/server/passport/config.ts`; production and dev never use it). This is safe only because previews use separate preview stores and must hold SYNTHETIC content only: anyone who finds a preview URL can forge a preview session and use `TEST-VALID-` codes. Set your own values (table below) only if you want them, and set real, different values for Production at launch.

**Site configuration, Environment variables.** For each variable use **different value per context** and fill only **Branch deploys** (and **Deploy Previews** if used). Leave **Production** empty for the first four rows. Names only; never write values into files or chat.

| Variable                                                                          | Preview (branch deploy)             | Production                              | Secret | Required |
| --------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------- | ------ | -------- |
| `SESSION_SECRET` (32+ chars)                                                      | a throwaway random value            | a different random value, set at launch | yes    | yes      |
| `PP_DATA_KEY` (32+ chars)                                                         | a throwaway random value            | a different value, set once at launch   | yes    | yes      |
| `PP_ALLOW_TEST_PROVIDER`                                                          | `1`                                 | **never set** (ignored if set anyway)   | no     | preview  |
| `GUMROAD_PRODUCT_ID`                                                              | leave empty (test provider is used) | the real product id, at seller setup    | yes    | launch   |
| `VITE_CHECKOUT_URL` (public, build scope)                                         | leave empty, or a test link         | the real https Gumroad link             | no     | launch   |
| `SHOW_DRAFTS`                                                                     | optional `true` to see drafts       | **never set** (the build refuses)       | no     | no       |
| `NOTIFICATIONS_ENABLED`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | leave unset (push is paused)        | leave unset                             | keys   | no       |
| `CONTEXT`                                                                         | set by Netlify automatically        | set by Netlify automatically            | no     | auto     |

`NETLIFY_AUTH_TOKEN` and `SITE_ID` are used only in your terminal for the premium scripts (section 5); never add them to Netlify.

How the separation works (code: `src/server/passport/config.ts`, `provider.ts`, covered by `src/test/netlify-env.test.ts`): only `CONTEXT=production` reads or writes the stores `customers-production` and `premium-production`. Every other context, including an unknown or missing one, uses `customers-preview` and `premium-preview`. The test provider is built only when `PP_ALLOW_TEST_PROVIDER` is exactly `1` AND the context is `dev`, `deploy-preview` or `branch-deploy`. In production the flag is ignored and, with no `GUMROAD_PRODUCT_ID`, activation answers `provider_unavailable`. Note: branch deploys and deploy previews share the one `*-preview` store pair.

## 3. What to check on the preview

Open the preview URL on a phone and a desktop. Record pass or fail for each:

1. `/` loads, headline "A lifetime of little adventures.", price text exactly "One payment of $19.99. Yours to keep. No subscription. No renewals."
2. `/discover`, `/unlock`, `/journal`, `/guides`, `/passport` load with no blank page.
3. Retired address `/stays` returns **410** (browser Network tab or `curl -I`), shows the gone page, and `/doggy-date-ideas` returns **301** to its new page. All ten 301 sources should redirect and no retired address should land on the home page.
4. Response headers on `/` (page, from the server function) and on `/robots.txt` (static, from `netlify.toml`) both include `Referrer-Policy: strict-origin-when-cross-origin` and `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`. Both also send `X-Content-Type-Options: nosniff`; pages also send `Content-Security-Policy-Report-Only`. No `X-Frame-Options`, no enforced CSP.
5. `GET /api/previews` returns JSON (200). On a branch deploy or deploy preview with no imported preview store it returns a **synthetic sample catalogue** (about 18 generic "Sample: ..." teasers across the six worlds, `total` and `collections` 0, response header `X-PP-Synthetic: 1`; `src/server/passport/synthetic-previews.ts`), so `/previews`, collection and world pages show populated rows. It is `{"items":[],"total":0,"collections":0}` (no header) in production until the real preview records are imported. Real previews appear only after an authorized import (section 5), which replaces the sample catalogue. `GET /api/session` returns 401 `not_signed_in`. If either returns the site's HTML 404 page, Netlify is sending `/api/*` to the SSR function instead of `netlify/functions/api.ts`: that is a **blocker**, report it.
6. On `/unlock`, enter `TEST-VALID-ABC12345`: access is granted on the preview. `TEST-REFUNDED-ABC12345` must be refused. (This only works because the preview has `PP_ALLOW_TEST_PROVIDER=1`; it must never work on the production URL.)
7. `/sw.js` may exist as a file, but no service worker is registered (DevTools, Application, Service Workers: empty) and the page has no `<link rel="manifest">` (PWA paused).
8. View source of `/` and `/discover`: no adventure instructions, clues or reveals of premium adventures. Run `node scripts/check-leaks.mjs dist` on the same commit's build.
9. Netlify deploy log: build command `npm run build`, preset netlify, functions `server`, `api`, `push-deliver` listed, no secret values printed. Note any warning.

## 4. Verify the CMS loop (C9)

Pages CMS edits `content/` by committing to a branch, which starts a Netlify build. Do this on the branch, not on the production branch:

1. In the Pages CMS app, open the repository and select the branch `claude/lucid-davinci-l2fixa` (**UNVERIFIED** that the app lets you pick a non-default branch; if it does not, stop and report; do not point it at production for this test).
2. Open **Journal**, pick one entry, change one sentence in the body (for example add the word "test" at the end), Save. A commit by Pages CMS should appear on the branch (GitHub, commits).
3. Wait for the branch deploy to finish in Netlify. It must start (a content `.md` save is not skipped by the `ignore` rule) and succeed.
4. Open that journal page on the preview URL: the change is visible. Revert the edit in Pages CMS the same way and confirm the second build.
5. Open **Adventures (free)**, open one entry, change nothing, and check: **Access** shows only `free` and cannot be changed; required fields are marked; selects show only the allowed options. Click Add new: record whether the **Adventure ID** field can be typed. If it is read-only on a new entry, new free adventures cannot be created in the CMS and the owner must decide whether to unlock that one field (then set `readonly: false` on `id` in `.pages.yml`; the build rejects any id not matching `adv-` plus six lowercase letters or digits).
6. Confirm **Adventures (premium)** is NOT in the Pages CMS menu (the switch in `.pages.yml` is OFF, section 6).
7. Pass: every step above done, two builds green, revert complete. Do not leave a test commit on the branch.

## 5. Import the premium library into the PREVIEW store only

A preview deploy already shows the built-in synthetic sample catalogue without any import (see section 3, item 5); the import below is only for testing with a stored index. **Production launch (Cowork task):** run `node scripts/premium-import.mjs --dir <package>/adventures --env production` (dry run first, then `--write --yes-production`) so the real preview records (about 50 showcase previews plus the free teasers) are stored; production never serves the sample catalogue, and until then `/api/previews` is empty and the site says "No previews are published yet."

Prerequisite: ordinary preview integration testing uses SYNTHETIC content (`src/passport/fixtures/premium.synthetic.ts`; write it to a temporary folder with `premium-split.mjs`). The REAL protected package (outside this repository) goes only into a protected environment AFTER the owner authorizes it; an undisclosed preview URL is not access control. Never use `--env production` for this test.

```bash
export NETLIFY_AUTH_TOKEN=...   # personal access token, your terminal only
export SITE_ID=...              # Site configuration, Site information
node scripts/premium-import.mjs --dir <private folder> --env preview          # dry run, writes nothing
node scripts/premium-import.mjs --dir <private folder> --env preview --write  # writes premium-preview
```

(`--dir` can be replaced by the environment variable `PREMIUM_DIR`; there is no default folder; see `PREMIUM-CONTENT-WORKFLOW.md`.) The dry run prints the validated count and the showcase count; a showcase card with no valid teaser is refused. After `--write`, reload `/api/previews` on the preview: `items` now lists the showcase previews and `total` is the library size; the response must contain no instructions, twist, reveal, clue, objective, variations or safety text. Then activate with a test code and open the full library on the preview.

> **Decision before importing the real library (OD12).** On a branch deploy with `PP_ALLOW_TEST_PROVIDER=1`, anyone who finds the preview URL can activate a `TEST-VALID-...` code and read whatever is in the preview store. The URL is obscure, not protected. Recommended: test with the synthetic library only (B7, B8) and import the real one straight to production (F3). Import the real package into a preview only after the owner authorizes it, only into a protected environment (Netlify site protection if the plan offers it, **UNVERIFIED**), and clear the store afterwards.

## 6. Pages CMS premium switch

`.pages.yml` ships with the premium form OFF (commented out between `PREMIUM-CMS-SWITCH:BEGIN` and `PREMIUM-CMS-SWITCH:END`). Recommended: keep it OFF. While it is ON, every save would commit premium text to this repository, which does not track it. To turn it ON, follow the instructions at the top of that block and run `npx vitest run src/test/handover-cms.test.ts`.

## 7. Camera and photo library on real phones (Permissions-Policy decision)

The keepsake editor (`src/components/passport/Keepsake.tsx`) has two native file inputs: "camera" (`accept="image/*" capture="environment"`) and "library" (`accept="image/*"`). It never calls `getUserMedia`. The site sends `Permissions-Policy: camera=()`, which blocks in-page camera streams. It is not documented to block a native file picker or the `capture` hand-off to the OS camera. **UNVERIFIED** in practice, so the decision (keep `camera=()`, no change) stands only if the device test passes. The test, on a purchased/test-unlocked preview (section 3, item 6):

- iPhone, Safari (current iOS): open the keepsake editor, tap the camera choice: the system camera or "Take Photo" sheet opens and a taken photo appears in the editor. Tap the library choice: the photo library opens, a chosen photo appears. Pass when both work and nothing says "camera blocked".
- Android, Chrome: same two checks.
- On both: the photo is not uploaded (Network tab or airplane mode after loading: the editor still works), and downloading or sharing the result works.
- If the camera choice fails ONLY on a device, report it with the OS and browser version. The fix then is `camera=(self)` for the editor route only (not the whole site) and an update to `src/test/netlify-config.test.ts`; do not loosen other headers.

## 8. Rollback

- Preview deploy bad: **Deploys**, open the last good deploy, **Publish deploy** applies only to production, so for a branch deploy simply push a fix or revert commit to the branch, or remove the branch under Branch deploys. Nothing about production changes.
- Preview store wrong: re-run the import with the correct package and `--prune`, or `node scripts/premium-export.mjs --out <private path> --env preview` first to keep a copy.
- Wrong environment variable: edit it in Netlify (preview scope) and redeploy; environment variable changes need a new deploy to reach the functions (**UNVERIFIED** otherwise).
- Production is never rolled back by anything on this page, because nothing on this page deploys production.

## 9. Headers decisions (security and cost review)

- **nosniff:** `X-Content-Type-Options: nosniff` is sent on static files (`netlify.toml`, `/*`) and on server-rendered HTML (`src/lib/security-headers.ts`).
- **CSP:** only `Content-Security-Policy-Report-Only` is sent, on pages. The root document has inline scripts, so enforcing now would break pages. Violations appear in the browser console only (no reporting endpoint). **Cowork follow-up:** on the preview, open `/`, `/discover`, `/unlock`, `/passport` and `/journal` with the console open, list every violation, then move to hashes or nonces and enforce in a later change.
- **Frame policy (deliberate, none today):** no `X-Frame-Options`, no `frame-ancestors`, because the Lovable preview may embed the site in an iframe and DENY would blank it. Revisit once embedding is not needed.
- **HSTS:** not set by the app or `netlify.toml`; Netlify serves it on its HTTPS domains. **UNVERIFIED:** confirm `Strict-Transport-Security` on the deployed domain (`curl -I https://<domain>/`), including the custom domain once attached.
- **`/api/previews` caching:** `netlify.toml` has `/api/*` `Cache-Control: no-store`, while the previews handler sends `public, max-age=300`. Netlify `[[headers]]` apply to static files, not to responses a function builds, so the function's own header should win and previews stay cacheable. Whether it really does is **UNVERIFIED**: on the preview, `curl -I https://<preview>/api/previews` and read `Cache-Control`. I did not add a more specific rule (precedence between overlapping `[[headers]]` rules is not something I could verify). If `no-store` shows, the endpoint is uncached, which is acceptable at this scale (see `OPERATING-COSTS.md`).
- **Cost pointer:** `docs/OPERATING-COSTS.md` covers function invocations and credits.

## 8. Owner-machine leak and overlap checks (need the real library)

These need the real premium folder, so they run only on the owner's machine with `PREMIUM_DIR` set to the `adventures/` folder of the protected package (they never run in CI or in this repository's clean state):

```bash
export PREMIUM_DIR=<protected package folder>/adventures
node scripts/validate-journal.mjs                                  # Journal sentence-overlap rule against the real premium text
node scripts/check-leaks.mjs dist --premium-dir "$PREMIUM_DIR"    # real titles, ids, instructions, twist, safety text in a build
node scripts/check-leaks.mjs .netlify --premium-dir "$PREMIUM_DIR"
node scripts/library-stats.mjs --md                                # full inventory (free-only notice without PREMIUM_DIR)
npx vitest run src/test/premium-owner-checks.test.ts               # the OWNER-MACHINE tests stop being skipped
```

Pass: "Leak check passed ... REAL premium fragments", "journal content OK (including the premium sentence-overlap check)". A check run without `PREMIUM_DIR` says it skipped the real-text part; that is not a pass for real text.
