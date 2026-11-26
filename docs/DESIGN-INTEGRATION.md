# Design integration plan: "Everyday Magic" concept

Status: PREPARATION ONLY. The final design is not approved. Nothing here has been merged or implemented. Facts below were read
from `origin/main` (fetched 2026-11-26) and the engineering branch `claude/lucid-davinci-l2fixa` at `9c748d8`.

## 1. Exact differences between main and the branch

- Merge base: `cf50035f461695bdcce152f86e558bbc3d74dddb`.
- Commits only on the branch (2): `00eaf25` (final audit pass: real-photo keepsake examples, library inventory, intro journey
  audit, policies, SEO audit, security review, premium test-provider integration tests, Netlify headers, CMS safety, operating
  costs, visual fixes, consolidated handoff) and `9c748d8` (QA report for `00eaf25`). Together 100 files changed, +6768 / -1486,
  measured against the merge base.
- Commits only on main (5), all by `gpt-engineer-app[bot]`, all dated 2026-11-26:

| Hash      | Subject                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `ed5f7c5` | Link the design concept page from the site footer                        |
| `4289ff9` | Link the design concept page from the site footer (duplicate subject)    |
| `2a8c9b3` | Ignore tool-generated bun.lock (project uses npm package-lock.json)      |
| `415461d` | Add Everyday Magic design concept page (/concept, noindex, demo content) |
| `227666a` | Work in progress                                                         |

### Files changed on main since the merge base

| File                                     | Main change (+/-)                     | Also changed on branch?                                    | Conflict risk                                                                                                                     | Resolution                                                                                                                     |
| ---------------------------------------- | ------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `.gitignore`                             | +1 / 0                                | No                                                         | None                                                                                                                              | Takes cleanly (`bun.lock` appended). Harmless; keep.                                                                           |
| `.lovable/north-star/north-star.md`      | +9 / 0                                | No                                                         | None                                                                                                                              | Lovable-owned file. Keep (its own header says ask before deleting). Contains no secrets.                                       |
| `package.json`                           | +1 / -1                               | No                                                         | Lockfile drift                                                                                                                    | Only `@lovable.dev/vite-tanstack-config` 2.27.2 -> 2.28.0 (a Lovable tooling bump, not a design dependency). See below.        |
| `src/assets/concept/*.jpg` (6)           | binary adds                           | No                                                         | None                                                                                                                              | Do NOT take until licensing is resolved (see DESIGN-ASSET-LICENSES.md).                                                        |
| `src/components/concept/ConceptPage.tsx` | +214                                  | No                                                         | None                                                                                                                              | Reference only; do not ship as a route.                                                                                        |
| `src/components/concept/ConceptQuiz.tsx` | +57                                   | No                                                         | None                                                                                                                              | Reference only; superseded by restyling IntroQuiz.                                                                             |
| `src/components/concept/ScratchCard.tsx` | +86                                   | No                                                         | None                                                                                                                              | Reference only; superseded by restyling RevealSurface.                                                                         |
| `src/components/shell/SiteFooter.tsx`    | +5                                    | No                                                         | None (textual)                                                                                                                    | Adds a footer link "Design concept (sample)" to `/concept`. Remove at launch (or keep the route noindex and unlinked).         |
| `src/design/concept.css`                 | +128                                  | No                                                         | None                                                                                                                              | Reference; port tokens only after approval.                                                                                    |
| `src/routeTree.gen.ts`                   | +21                                   | No (not touched on branch)                                 | Low                                                                                                                               | Generated file. Never hand-merge; regenerate (see section 3).                                                                  |
| `src/routes/concept.tsx`                 | +23                                   | No                                                         | None                                                                                                                              | New route, noindex, loads Google Fonts. Do not ship as is.                                                                     |
| `src/styles.css`                         | +1 (`@import "./design/concept.css"`) | YES: branch added `min-height: 44px` on the skip link (+1) | Textual, near-certain only if both edit the same hunk; the two hunks are about 160 lines apart, so git should merge automatically | If it does conflict, keep both lines. After approval, drop the concept.css import and import the real new tokens file instead. |

`package.json` note: main changed it, the branch did not. `package-lock.json` was NOT updated on main (main ignores `bun.lock`
and has no lockfile change) and still pins `@lovable.dev/vite-tanstack-config` 2.27.2 on the branch. Taking the bump from main
without a matching lockfile makes `npm ci` fail. Recommendation: do not take the version bump (keep 2.27.2 and the branch's
`package-lock.json`) unless the owner or Lovable needs 2.28.0; if needed, bump it deliberately with `npm install` and re-run all
gates. The conflicting files the task named: `src/routeTree.gen.ts` (regenerate), `src/styles.css` (keep both), `SiteFooter.tsx`
(drop the concept link), `package.json` (keep the branch version), `.gitignore` (take main's one line).

## 2. The concept, as read from origin/main

### Route and structure

- `src/routes/concept.tsx` registers `/concept` with `noindex: true`, title "Everyday Magic - design concept", and adds a
  `preconnect` plus a Google Fonts stylesheet link to the route head.
- A banner states "Design concept 'Everyday Magic' - demonstration content only - not the live product".
- Page sections: hero (polaroid collage, rotated stickers, tape), dark marquee strip, eight "mood" collection cards, three
  adventure cards, an 8-question quiz, a "mystery reveal" scratch card, a passport scrapbook (cover plus stamp page), three
  keepsake mockups (magazine "BARK", postcard, trading card), an offer ticket with $19.99, and an FAQ.
- Everything is hard-coded demo content (sample dog "Maple", "Honey, age 6", "Biscuit"; "Cover star", "7 stamps collected",
  a journal entry dated Oct 12). Nothing connects to recommendation, entitlement, storage or checkout code.

### North star (`.lovable/north-star/north-star.md`, verbatim)

> Lovable wrote this file; it is not part of your task. Keep it, and ask the user before deleting or reverting it.
>
> # North star
>
> Dog owners share more memorable adventures with their dogs.
>
> ## Metric
>
> Adventures completed in the passport each week

### Visual language (`src/design/concept.css`, scoped under `.em`)

- Palette (OKLCH): vanilla page `0.975 0.018 85`, butter `0.91 0.11 95`, strawberry `0.86 0.075 10`, cherry (primary action)
  `0.6 0.17 22`, sage `0.82 0.06 145`, leaf `0.5 0.08 150`, powder blue `0.88 0.045 235`, ink `0.27 0.015 40`, ink-soft
  `0.45 0.015 40`, paper `0.995 0.006 85`. Soft, bakery-pastel, warm; light only (no dark mode).
- Typography: display "Bricolage Grotesque" (700-800, tight tracking `-0.035em`, line-height 0.95, headline up to 6.2rem),
  body "Figtree" (400/600/700), handwriting accent "Caveat" (500/600) for eyebrows, captions and stamps.
- Font loading: NOT local. A Google Fonts stylesheet (`fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Caveat:wght@500;600&family=Figtree:wght@400;600;700&display=swap`)
  is added to the route head. No npm font packages; no local font files. The existing CSP is Report-Only and already lists
  `fonts.googleapis.com` and `fonts.gstatic.com` as allowed, but this means visitors' browsers contact Google (IP leak) and
  contradicts the branch's self-hosted-fonts approach. After approval the fonts should be self-hosted (see section 3).
- Spacing and layout: 1180px wrapper with 1.25rem gutters, 5rem section padding, 2-column hero at 900px and up, 3-column cards at
  760px and up, horizontal scroll-snap mood row.
- Card style: very round corners (1.4 to 2.5rem), no outlines, soft blurred shadow `0 18px 40px -22px`, mild rotations (+/-2 to
  6 degrees), pill chips and tags, polaroid frames with Caveat captions and translucent tape, dotted "locked" divider.
- Buttons: full pill (999px), min-height 3.1rem, cherry fill or paper ghost with inset ring, 2px lift on hover.
- Quiz: powder-blue rounded panel, segmented progress bar, large emoji answer tiles in an auto-fit grid, `aria-pressed`,
  220 ms auto-advance, Back link.
- Scratch card: 3:4 card, rotated 2 degrees; a 2x-resolution canvas covers the content with a butter/strawberry/powder gradient,
  sprinkle dots and the Bricolage/Caveat text "A little adventure awaits / scratch or tap to reveal"; pointer drag erases with
  `destination-out` (44px brush); more than 70 pointer moves reveals; a tap (fewer than 4 moves) reveals; Enter/Space reveals;
  canvas has `role="button"`, `aria-label`, and the inner card has `aria-live="polite"`; the canvas fades out (0.5 s). Issues:
  the content sits in the DOM under the canvas (readable by assistive tech and view-source before reveal, fine for demo, not
  for premium content); no reduced-motion handling for the fade; the canvas is non-resizable after mount; the live region is on
  the content that already exists, so a reveal is not reliably announced.
- Motion: marquee scroll (40 s, disabled under `prefers-reduced-motion`), hover lifts and rotations.
- Focus: 3px cherry outline offset 3px.

### Difference from current production tokens

| Aspect    | Production (`passport.css`, `adventure.css`, `commercial.css`, `styles.css`)                            | Concept                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Feel      | "Passport" print look: paper, navy ink, ochre, pine, red stamp                                          | "Everyday Magic": pastel bakery, playful, scrapbook                            |
| Colors    | Hex tokens `--pp-*` (ink `#14283a`, paper `#f7f0e1`, red `#a82f23`, ochre, pine) with a full dark theme | OKLCH `--em-*`, light only                                                     |
| Fonts     | Self-hosted Fraunces + DM Sans (OFL, in `public/fonts`)                                                 | Google-hosted Bricolage Grotesque, Figtree, Caveat                             |
| Shape     | 6px radius, hard 3px offset ink shadow                                                                  | 24-40px radius, soft blur shadow                                               |
| Contrast  | Verified in the branch (see `docs/VISUAL-REVIEW.md`)                                                    | Not measured (pastel fills with ink text; cherry `0.6` on paper needs a check) |
| Dark mode | Supported                                                                                               | None                                                                           |
| Scope     | App-wide variables                                                                                      | Scoped to `.em`, does not touch `--pp-*`                                       |

## 3. Selective integration approach (a plan, not an implementation)

### Take after approval (restyle onto EXISTING components)

1. Design tokens: a new `src/design/everyday.css` (name TBD) that defines the approved palette as variables mapped onto the
   existing semantic names (`--background`, `--card`, `--primary`, `--ring`, `--pp-*`), so existing components pick them up. Keep
   dark mode (derive a dark variant or decide with the owner that the site is light only; do not silently drop it).
2. Fonts: self-host the chosen families as woff2 in `public/fonts` with an OFL file each, `@font-face` with `font-display: swap`
   and a Latin subset (as done for Fraunces/DM Sans). No `fonts.googleapis.com` runtime link, no paid fonts.
3. Imagery: only images with a proven licence (see DESIGN-ASSET-LICENSES.md). Convert to webp, add real `alt` text where they
   convey content, keep decorative ones `alt=""`.
4. Hero: restyle `src/routes/index.tsx` hero (polaroid collage, highlight mark, handwriting eyebrow). Copy must follow the
   product facts: "$19.99 one-time", "No subscription. No renewals.", "A lifetime of little adventures." No fake counts.
5. Quiz look, reveal surface visual treatment, cards, buttons, footer: see mapping table.

### Do NOT take

- Demo content: sample dog names, "7 stamps", Oct 12 journal entry, "BARK" magazine, "Rarity 5 stars", "ten collections" claims
  not matching the library, any made-up numbers.
- A separate concept quiz (ConceptQuiz has hard-coded different questions and does not feed recommendations).
- Anything that replaces recommendation logic, entitlement checks, sync, photo rendering (keepsake maker stays on-device),
  checkout integration (Gumroad), content schemas, security headers or CSP, premium gating.
- The concept's "Gifting ... coming with checkout" line (the gifting flag is OFF until verified), the "Get the passport" dead
  anchor, the `/concept` route itself, the `.em` global body overrides, the footer concept link, the Google Fonts head link.
- The `@lovable.dev/vite-tanstack-config` bump unless separately decided.

### Mapping: concept component to existing component

| Concept                                  | Existing target                                        | What to port (visual only)                                                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ConceptPage` hero                       | `src/routes/index.tsx` hero                            | Headline scale, highlight mark, polaroid collage, pill CTAs                                                                                                                                        |
| `ConceptQuiz`                            | `src/components/passport/IntroQuiz.tsx`                | Panel colour, segmented progress (keep existing `role="progressbar"` and valuenow), larger answer tiles with the existing `aria-pressed` buttons and fieldsets. Keep the real questions and logic. |
| `ScratchCard`                            | `src/components/passport/RevealSurface.tsx`            | Gradient covering surface, headline/handwriting text, rotation, fade. Keep the existing gesture logic, storage key and live region.                                                                |
| `.em-card` / `.em-chip` / `.em-card-tag` | `AdventureCard.tsx` and `discover.css`/`adventure.css` | Radius, shadow, tag pill, chip pills, dotted locked footer                                                                                                                                         |
| `.em-btn*`                               | button classes in `commercial.css` / shadcn buttons    | Pill shape, cherry primary, ghost secondary                                                                                                                                                        |
| `.em-offer` / `.em-ticket`               | purchase section in `commercial.css`                   | Visual only; copy and price source stay as they are                                                                                                                                                |
| `.em-faq`                                | FAQ route/section                                      | Rounded `details` styling                                                                                                                                                                          |
| Passport scrapbook (`.em-book`, stamps)  | passport/journal components                            | Stamp roundels and page texture only                                                                                                                                                               |
| Keepsake mockups                         | `public/examples` previews and keepsake templates      | Frame styling only; do not change the on-device renderer                                                                                                                                           |
| `SiteFooter` concept link                | `src/components/shell/SiteFooter.tsx`                  | Remove the link; restyle the footer to the new tokens                                                                                                                                              |

### Keeping "Scratch or tap to reveal" accessible after the restyle

The existing `RevealSurface` is a single native `<button>` (label constant `REVEAL_LABEL = "Scratch or tap to reveal."`) with a
persistent polite `role="status"` live region. After restyling it must still:

- Stay a real `<button>` (not a canvas with `role="button"`); Enter and Space reveal; focus ring at least 3:1 contrast and
  visible against the new gradient; tap target at least 44px (the branch just added a 44px minimum on the skip link).
- Announce the reveal through the single persistent live region (not by putting `aria-live` on content that already exists
  in the DOM).
- Respect `prefers-reduced-motion`: no scratch-fade, rotation animation or marquee; the reveal is an instant swap. Add a test.
- Not expose or pre-render premium or hidden content in the DOM before reveal beyond what it does today.
- Keep text on the pastel surface at 4.5:1 or better (the concept uses mid-lightness pastels; measure every pair).
- Keep storage failures harmless (try/catch, as now) and the "already revealed" shortcut.

### Order of work (after approval only)

1. Owner approves the final design and licensing answers are recorded (DESIGN-ASSET-LICENSES.md fully VERIFIED for everything
   that ships).
2. New branch (section 4). Add tokens and self-hosted fonts only; verify nothing else moves.
3. Buttons, cards, chips, footer.
4. IntroQuiz look. 5. RevealSurface look. 6. Hero and homepage sections. 7. Imagery. 8. Remove the concept route and footer
   link (or keep noindex and unlinked with owner approval; the preferred default is removal).
5. Re-generate demo and keepsake examples (`scripts/demo/render-examples.mjs`, `public/demo`, `public/examples`) and the owner
   marketing package, because both embed the old look.
6. Update `docs/DESIGN-SYSTEM.md`, `docs/VISUAL-REVIEW.md`, `docs/IMAGE-CREDITS.md`, and the font licence note (see below).

### Guardrails: run after EACH step

- `npx tsc --noEmit`
- `npx eslint .`
- `npx vitest run` (the full suite, not a subset)
- Clean Netlify build, run by the single build owner only: `NITRO_PRESET=netlify npx vite build` into the default output dirs
- Leak checks: the existing premium/secret leak checks and tests (no premium text, no secrets in `dist` or `.netlify`), and a
  grep of build output for `fonts.googleapis.com` and `fonts.gstatic.com` (must be absent from page markup and CSS after
  self-hosting)
- Visual re-review at 320, 390, 768 and 1280 px widths (both themes if dark mode remains), then re-run the VIS review
  (`docs/VISUAL-REVIEW.md`) and update it
- Keep the repo public: add no secrets, no paid assets, no private fonts. No paid fonts.

### Housekeeping noted

`src/styles.css` says fonts are documented in `docs/recovery/FONT-LICENCES.md`, but that file does not exist in the branch.
The OFL texts live in `public/fonts/OFL-*.txt`. Fix the comment when the fonts change.

## 4. Git procedure (do not run until the owner approves)

1. `git fetch origin`
2. Create the integration branch from the verified engineering commit, never from main:
   `git switch -c design/everyday-magic 9c748d8`
3. Prefer bringing in only what is needed. Two options:
   - Cherry-pick specific commits, for example `git cherry-pick 2a8c9b3` (the `.gitignore` line). Commit `415461d` also adds
     the concept route, components and images, so do NOT cherry-pick it blindly.
   - Or, only after explicit owner approval, `git merge origin/main`, then immediately:
     - `src/routeTree.gen.ts`: do not hand-resolve. Take the branch version (`git checkout --ours src/routeTree.gen.ts`),
       delete concept route files if they are not shipping, and regenerate with the project's route generator (run the dev server
       or the TanStack router generator once) and commit the output.
     - `package.json`: keep the branch version (`git checkout --ours package.json`) unless the 2.28.0 bump is wanted.
     - `package-lock.json`: keep the branch's file (main has none that changed). Run `npm ci` to confirm it installs.
     - `src/styles.css`: keep both changes (skip-link `min-height: 44px` and, only while the concept exists, the concept
       import); remove the concept import before release.
     - `src/components/shell/SiteFooter.tsx`: delete the "Design concept (sample)" list item. At launch the footer must not link
       to `/concept`; if the route is kept at all it stays `noindex` and unlinked.
     - `.gitignore`: keep the extra `bun.lock` line.
4. Never `git push --force`, never commit to main, never merge main into `claude/lucid-davinci-l2fixa` itself; that branch stays
   at `9c748d8` until the owner decides how to merge the finished integration branch.
5. After each step run the guardrails above before committing.

## 5. Risks to keep visible

- Concept images carry content credentials marking them AI-generated (see DESIGN-ASSET-LICENSES.md). That conflicts with the
  site's "real photo" examples positioning unless disclosed or replaced.
- Runtime Google Fonts is a privacy regression versus self-hosted fonts.
- The concept's scratch card is a canvas with pre-rendered hidden content; do not reuse the implementation for anything gated.
- Lovable is still refining the concept. Do not integrate until the final version and its asset provenance are confirmed.

## 6. Integration log (trial branch `local/design-integration`, LOCAL ONLY, never pushed)

Owner decisions: Option C (main stays as Lovable left it; head `2c6625c` when last fetched). Lovable's design is exactly what the owner wants, so the
trial makes no design departures. The only intentional change is the approved copy (section 6.3). Base: `claude/lucid-davinci-l2fixa` at `f1a8a0f`.
Nothing was merged from main; `package.json` and `package-lock.json` are untouched.

### 6.1 What Lovable changed on main since the merge base, and how it was classified

`git diff cf50035..origin/main` (40 files at `2c6625c`). The concept pages and images were added and later deleted by Lovable, so they net out.

| Change on main                                                                                                                                                                                          | Class               | Result in the trial                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette tokens and radius in `src/design/passport.css`                                                                                                                                                  | PORT                | Applied.                                                                                                                                                                                                |
| `src/styles.css` (three `@font-face`, font vars, heading weight, `font-hand-note`, `everyday.css` import)                                                                                               | PORT                | Applied.                                                                                                                                                                                                |
| `public/fonts/*` (Bricolage Grotesque, Figtree, Caveat plus OFL texts)                                                                                                                                  | PORT                | Applied; old DM Sans/Fraunces files kept for `marketing/pins` only.                                                                                                                                     |
| `src/routes/__root.tsx` font preloads                                                                                                                                                                   | PORT                | Applied. Also fixed `public/sw.js` and `public/offline.html`, which main left pointing at deleted fonts.                                                                                                |
| `src/design/everyday.css` (collage, sticker, tape, marquee, pill buttons, site-wide personality layer)                                                                                                  | PORT                | Applied as Lovable wrote it, then extended with the concept pieces below.                                                                                                                               |
| `src/routes/index.tsx` hero collage, banner, marquee                                                                                                                                                    | PORT-WITH-REAL-DATA | Lovable's collage and its three images, as built. Demo captions: "sunday picnic w/ Maple" became "sunday picnic" (sample dog name removed). Disclosure line added.                                      |
| `src/components/shell/SiteFooter.tsx` banner strip                                                                                                                                                      | PORT                | Applied.                                                                                                                                                                                                |
| `src/passport/art/stamps.tsx`, `src/passport/keepsake/*` (stamp inks, keepsake palette and lettering), `PreviewArt.tsx`, hard-coded ink colors in `adventure.css`, `notifications.css`, `shortcuts.css` | PORT                | Applied by 3-way patch. These are colors and font stacks only; the keepsake renderer, photo handling and templates are unchanged. `render.ts` also waits for `document.fonts.ready` (Lovable's change). |
| `public/demo/*.webp` (five refreshed demo screens)                                                                                                                                                      | PORT                | Applied as Lovable has them.                                                                                                                                                                            |
| `src/assets/everyday/*.jpg` (3 images)                                                                                                                                                                  | PORT                | Applied. OWNER-CONFIRMED for commercial use; see `DESIGN-ASSET-LICENSES.md` section E.                                                                                                                  |
| Concept images (`cozy`, `portrait`, `trail`; plus `date`, `picnic`, `puppy`) from history `08168d3`                                                                                                     | PORT-WITH-REAL-DATA | Used on the home collection cards (paired with real collections). OWNER-CONFIRMED.                                                                                                                      |
| Marquee text                                                                                                                                                                                            | PORT                | Lovable's exact strip. It includes the approved slogan (now allowed), written once in `brand.ts`.                                                                                                       |
| `docs/DESIGN-SYSTEM.md`, `docs/OWNERSHIP-TRANSFER.md` (now `TRANSFER-INVENTORY.md`), `AGENTS.md` (Caveat rule)                                                                                          | PORT                | Applied (font names, Caveat rule). The ownership row went to `TRANSFER-INVENTORY.md`, where the file now lives.                                                                                         |
| `docs/DESIGN-EVERYDAY-MAGIC.md`                                                                                                                                                                         | SKIP                | Concept handoff; its product numbers (113, 99, 25, 50) are not re-verified and must not be advertised.                                                                                                  |
| `package.json` `@lovable.dev/vite-tanstack-config` 2.28.0                                                                                                                                               | SKIP                | Dependency bump with no matching lockfile (breaks `npm ci`).                                                                                                                                            |
| `.gitignore` (`bun.lock`), `.lovable/*` plan and north-star files                                                                                                                                       | SKIP                | Not needed on the engineering branch.                                                                                                                                                                   |
| Deleted concept routes, components, `concept.css`, footer concept link                                                                                                                                  | SKIP                | Never existed on the engineering branch.                                                                                                                                                                |

Concept looks that Lovable designed but never put into the live app, ported from `08168d3` `concept.css` onto the real components: hero scale (6.2rem headline,
0.95 line height, tight tracking), facts strip, horizontal pastel collection cards, powder quiz panel with segmented progress and emoji answer tiles,
foil scratch surface (gradient, tilt, canvas erase), leaf passport cover, keepsake frames on a sage section, ink offer panel with butter ticket, FAQ rows, mystery section.

### 6.2 Accessibility and logic preserved

- Quiz (`IntroQuiz`): same fieldsets, `aria-pressed` buttons and `role="progressbar"`; emoji are `aria-hidden` and the label alone names each button; the segment dividers are an `aria-hidden` element.
- Reveal (`RevealSurface`): still one real `<button>` with the same tap, drag-distance, Enter and Space behavior and the same persistent polite live region ("Adventure revealed."). The new `RevealFoil` canvas is purely visual: `aria-hidden`, ignores the pointer, never reads or exports pixels, and is skipped under reduced motion or without canvas. The foil is in its own file because `intro-audit.test.tsx` bans `<canvas` in the free-flow files (the guard is about photo and editor features); a new test pins that the foil cannot touch photos or the network.
- Handwritten type (Caveat) is used only for the collage captions, the sticker, collection-card notes and the scratch card line. Never for safety, eligibility, payment or instructional text; the commercial line is plain type.
- Dark mode: main ships `html.dark` tokens but nothing in main or here toggles it, so it is not enabled.

### 6.3 Copy map (owner-approved messaging; single source `src/config/brand.ts`)

| Page / place                                                                       | String                                                                                                                              |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Home hero eyebrow                                                                  | Because every dog deserves a little adventure.                                                                                      |
| Home hero H1                                                                       | A passport full of **little adventures** for you and your dog.                                                                      |
| Home hero supporting copy                                                          | Discover 100+ fun, creative and memorable things to do together, personalized to your dog and your lifestyle. (`LIBRARY_CLAIM_MIN`) |
| Home primary CTA / note / price line                                               | Find our first adventure / Your first adventure is free. / One payment of $19.99. Yours to keep. (from `ONE_TIME_LINE`)             |
| Home personalization section                                                       | Adventures picked for your dog. Memories made by you.                                                                               |
| Home mystery section and scratch card                                              | A little adventure awaits...                                                                                                        |
| Home keepsake section                                                              | Adventures for your dog. Keepsakes for you. (creation stays premium-only; free sees examples)                                       |
| Home decorative strip                                                              | Your favorite little sidekick, Let's make a date, Collect adventures, not just things, Made for the two of you                      |
| `/unlock` H1                                                                       | One passport. Over a hundred adventures. Endless little memories. (`LIBRARY_CLAIM_WORDS`)                                           |
| `/passport` H1                                                                     | Collect adventures, not just things. (kicker: "<name>'s Adventure Passport")                                                        |
| `/our-story` supporting line, `/about`, footer, printables, site tagline, manifest | A lifetime of little adventures.                                                                                                    |
| `/journal` H1                                                                      | More than walks. More than fetch. More little adventures. (kicker: The Adventure Journal)                                           |
| `/unlock` gift line (only if `flags.gifting`, which stays false)                   | Give a lifetime of little adventures.                                                                                               |
| Meta description (home)                                                            | "A lifetime of little adventures. One free adventure picked for your dog, then a large library for $19.99, once. No subscription."  |

Guards (`src/test/brand-copy.test.ts` plus edits to `free-starter`, `shell-home`, `pay-once-copy`): approved strings pinned; the slogan "Collect adventures, not just things." is written only in `brand.ts` and never reaches the hero; retired lines (the earlier "Life is better with a little ..." headline and the "deserves a little wonder" variants), "free forever" style claims and forever, unlimited or perpetual promises stay banned; no source file may state a library size above `LIBRARY_CLAIM_MIN`; an owner-machine test (needs `PREMIUM_DIR`) asserts the real published library is at least the claim (verified earlier: 117 unique, 17 free, 100 premium).

### 6.4 Remaining differences from Lovable's built design (honest list)

1. Copy: hero headline, eyebrow, supporting copy, CTA and section headlines are the approved copy, not Lovable's placeholder text. The longer H1 wraps over four lines at 390 px and five at 320 px at the concept scale; there is no overflow.
2. Real data replaces demo data: collection names and blurbs (real ones), real quiz questions, real keepsake examples (CC0 photos on the keepsake section), the real price and facts (library counts appear only when the previews API verifies them).
3. Lovable's concept "no subscription . no sign-up to try" handwritten line is not used: payment text must not be handwritten (Lovable's own Caveat rule). The same facts appear as plain chips.
4. Quiz answer tiles use `minmax(8.5rem, 1fr)` instead of the concept's `10rem`, so two tiles fit per row at 390 px (the concept's value would give one very tall column). Tiles are not emoji for every answer: every real answer has a decorative emoji.
5. The concept's scratch card is a canvas that hides content beneath it. Here the reveal is the real button; the foil canvas is decorative and the card is the real surface. The home sample mystery card stays Lovable's ink card from main (the concept's strawberry section is applied behind it).
6. The concept's keepsake magazine/postcard/trading mockups are rendered by the real CC0 example images in tilted frames (postcard white, trading butter), not Lovable's AI picture mockups, because the real examples are the product facts.
7. The concept's phone-frame "journey" pages and the design-system page were deleted by Lovable and are not part of the product.
8. Lovable's main has a hover flicker bug: its `.pp-btn:hover` lift moves the button out from under a resting pointer ("element not stable" when automating a click). The trial fixes it with an invisible 3px hit skirt and a motion-safe lift; it is not visible to users.
9. No dark mode toggle (same as main).
10. Consent notice and sign-out UI: Lovable did not design them; they inherit the pill and soft-card rules. Sign-out is shown only to entitled visitors, so it was not screenshotted.

### 6.5 Evidence

- Trial screenshots (deviceScaleFactor 1, reduced motion): `scratchpad/design-shots/engineering-v2/` (16 screens x 320, 390, 768, 1280).
- Lovable reference: the preview URL answers HTTP 401 (login required), so references were rendered locally from git: `scratchpad/design-shots/lovable-reference/main-head-2c6625c/` (the same 16 screens on Lovable's current main, rendered with the same script) and the earlier concept renders (`concept-home`, `concept-journey`, `concept-system`).
- Contrast (script `scratchpad/di2-contrast.cjs`): body text 14.1:1, muted 7.0, primary button 5.2 (hover 6.7), red link 4.9, ink on powder 10.6, on strawberry 9.6, on butter 11.6, footer 14.1.
