# Design system

The look is a travel postcard and a printed passport: warm paper, ink, one red action colour, ochre stamps. It is not a pale SaaS page or a bright pet-store brand. Source of truth: `src/design/*.css` (imported by `src/styles.css`) and `src/components/shell/`.

## Files

| File                         | Prefix | Contents                                                                                |
| ---------------------------- | ------ | --------------------------------------------------------------------------------------- |
| `src/design/passport.css`    | `pp-`  | Tokens, layout primitives, buttons, cards, header, footer, home page, stamps, flip card |
| `src/design/adventure.css`   | `pa-`  | Adventure page, panels, forms, mystery card, reveal, progress                           |
| `src/design/discover.css`    | `pd-`  | Discover tabs, filters, results                                                         |
| `src/design/collections.css` | `co-`  | Curated and custom collection screens                                                   |
| `src/design/keepsake.css`    | `kp-`  | Keepsake maker and photo editor                                                         |
| `src/styles.css`             | -      | Tailwind setup, `@font-face`, base typography, article styles, skip link                |

## Tokens

All colours are CSS variables named `--pp-*`, defined on `html:root` in `passport.css`.

| Token                         | Light                | Use                                        |
| ----------------------------- | -------------------- | ------------------------------------------ |
| `--pp-ink` / `--pp-ink-2`     | #14283a / #1d3a52    | Text, dark panels, borders                 |
| `--pp-paper` / `--pp-paper-2` | #f7f0e1 / #efe5cf    | Page and alternate band background         |
| `--pp-card`                   | #fffaf0              | Card surface                               |
| `--pp-red` / `--pp-red-hover` | #a82f23 / #8e261b    | The single primary action, eyebrows, focus |
| `--pp-on-red`                 | #fffaf0              | Text on red                                |
| `--pp-ochre`                  | #e0a53a              | Stamps and highlights on dark surfaces     |
| `--pp-ochre-text`             | #7a5200              | The only ochre allowed as text on paper    |
| `--pp-pine`                   | #2f5d4e              | Quiet secondary                            |
| `--pp-muted`                  | #4a5a68              | Secondary text                             |
| `--pp-line`, `--pp-hairline`  | ink, ink at 20%      | Borders and dividers                       |
| `--pp-focus`                  | #a82f23              | Focus outline                              |
| `--pp-shadow`                 | 3px 3px 0 ink at 90% | The hard offset shadow of a printed card   |
| `--pp-radius`                 | 6px                  | Card and button radius                     |

The file also remaps the older shadcn-style tokens (`--background`, `--primary`, `--ring`, ...) so guide and gear pages sit inside the same shell. A `html.dark` block redefines every token (paper becomes #0f1e2b, red becomes #e0705f, focus becomes ochre). **UNVERIFIED:** nothing in `src/` was found that sets the `dark` class, so dark mode exists as tokens but is not user-reachable.

Paper texture is CSS only (two faint radial-dot layers on `body`). Stamps, perforations and borders are CSS or inline SVG. No icon fonts and no stock photos in the passport screens.

## Type

- Display and headings: **Bricolage Grotesque**. Body: **Figtree**. Handwritten notes: **Caveat** (`font-hand-note`). All are self-hosted in `public/fonts/` (SIL OFL licences included); there is no third-party font request.
- Headings use `clamp()` sizes (for example the section heading is `clamp(1.75rem, 6vw, 2.5rem)`), balanced wrapping and a 1.12 line height. Body copy is about 1.0625rem at a 1.6 line height. Eyebrows are 0.75rem, uppercase, tracked.
- Keepsake artwork uses system serif and sans stacks only (canvas drawing); nothing is downloaded for it.

## Components

- **Shell** (`src/components/shell/`): `SiteHeader`, `MobileNav`, `SiteFooter`, `Container`, `SectionHeading`, `Card`, `Button`, `AppLink`, `Logo`. Primary navigation is Discover, Collections, My Passport, Our Story, plus the "Get the Passport" call to action; Restore access and Guides are secondary.
- **Button** (`pp-btn`): variants primary (red), secondary, ghost; sizes md and sm. Every call to action is a link styled as a button. Minimum height 2.75rem.
- **Card** (`pp-card`, `pa-card`): 1.5px ink border, 6px radius, hard offset shadow.
- **Passport pieces:** stamps (`pp-stamp`), the passport booklet (`pp-passport`), the flipping mystery card (`pp-flip`), postmark, keepsake frame, FAQ disclosure list.
- **Passport components** (`src/components/passport/`): adventure card and reveal, discover tabs and filter panel, held-question prompts, onboarding and profile editors, collection screens and editor, stamp shelf, story timeline, keepsake maker and photo editor, access forms.
- **Layout:** `pp-container` (max 72rem, 1rem gutter, 2rem from 768px), `pp-section`, `pp-band` (ink band, inverted in dark mode), `pp-grid` (1, 2 then 3 columns at 640px and 960px). Header switches to the inline nav at 900px.

## Motion

Motion is decorative and optional. The mystery-card flip (`pp-flip`, 7s loop, pauses on hover and focus), the stamp press and the card entrance (`pa-in`, 0.25s) run only inside `@media (prefers-reduced-motion: no-preference)`. Under `reduce`, the discover and keepsake screens set `animation: none` and `transition: none`, and both faces of the mystery card stay readable. Never add motion that carries meaning.

## Accessibility rules

- Contrast target is WCAG AA. Documented ratios: ink on paper about 13:1, red on paper about 6.3:1, cream on red about 7:1, ochre on ink about 8:1, muted ink on paper about 6:1. Ochre text on paper must use `--pp-ochre-text`. (Ratios are the designers' calculations, not re-measured by an automated tool; see `QA-REPORT.md`.)
- Every interactive target is at least 44px tall.
- Focus is a visible 3px outline in `--pp-focus` on links, buttons, summaries and tab stops; never remove it.
- A skip link ("Skip to main content") jumps to `#main`.
- Discover uses a real tab pattern: `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, roving `tabindex`, Left and Right arrow keys, a `tabpanel` labelled by its tab.
- Expanders use `aria-expanded`. Form fields use `<label>`. Access errors are shown as plain sentences, never as a bare code.
- Keepsake maker: file input is visually hidden but reachable; the photo editor works by drag, pinch, slider and keyboard (arrow keys move, plus and minus zoom).

## Adding to the system

Use `--pp-*` variables, never raw hex in components. Keep the red action unique per view. Give new component classes the prefix of their stylesheet. Check light and dark tokens, a 320px viewport and reduced motion before shipping.
