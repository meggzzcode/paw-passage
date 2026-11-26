# Visual and accessibility review

Method: Playwright Chromium against the Vite dev server, widths 320, 390, 768 and 1280. **This is browser emulation, not physical-device testing.** No real iPhone, Android phone, tablet or screen reader was used. Screenshots (160 files, 40 page states) are in `/home/user/premium-content/export/screens/` as `<page>-<width>.png` (outside the repo).

Per page and width the script checked: horizontal page scroll, elements past the viewport edge, axe-core (WCAG 2.0/2.1/2.2 A/AA plus best practices, including color contrast), touch targets of 44px or more (inline text links inside paragraphs are exempt), heading order, one H1, image alt. API responses were mocked (previews from synthetic text only; entitled, 401 and offline sessions). Premium text was not used.

## Results (all four widths unless noted)

| Page or state                                                       | 320                                                     | 390            | 768            | 1280           |
| ------------------------------------------------------------------- | ------------------------------------------------------- | -------------- | -------------- | -------------- |
| Home (incl. keepsake examples)                                      | PASS after fix                                          | PASS after fix | PASS after fix | PASS after fix |
| /unlock, /unlock entitled                                           | PASS after fix                                          | PASS after fix | PASS           | PASS           |
| /previews (mocked), saved view, empty, entitled                     | PASS after fix                                          | PASS after fix | PASS after fix | PASS after fix |
| Quiz: welcome, step 1, middle, last step                            | PASS                                                    | PASS           | PASS           | PASS           |
| Quiz: recommendation, show another, confirm-before-reveal           | PASS                                                    | PASS           | PASS           | PASS           |
| Quiz: revealed, complete with stamp, keepsake demo                  | PASS after fix (heading) / ISSUE low (duplicate prompt) | same           | same           | same           |
| Adventure card with instructions, schedule controls (entitled mock) | PASS after fix                                          | PASS after fix | PASS after fix | PASS after fix |
| Keepsake editor (entitled mock, no photo)                           | PASS                                                    | PASS           | PASS           | PASS           |
| Collections index, collection page, entitled, mine/empty            | PASS                                                    | PASS           | PASS           | PASS           |
| /passport free, entitled, upcoming                                  | PASS                                                    | PASS           | PASS           | PASS           |
| Our Story, FAQ, Journal index, 2 Journal articles                   | PASS                                                    | PASS           | PASS           | PASS           |
| Restore access (also 401 state)                                     | PASS                                                    | PASS           | PASS           | PASS           |
| Errors: /passport and /discover with offline premium fetch, 401     | PASS                                                    | PASS           | PASS           | PASS           |
| /disclaimer, /terms, /welcome                                       | PASS                                                    | PASS           | PASS           | PASS           |

No horizontal page scroll anywhere. The only element wider than the viewport is the keepsake examples strip on home and /unlock at 320 and 390, a deliberate sideways-scrolling row inside its own container.

## Issues

| #   | Severity | Where                                                       | Issue                                                                                                                                             | Status                                                                                                                                                      |
| --- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Serious  | Home, keepsake examples                                     | "Original photo" / "Finished keepsake" captions used the muted token on the dark band: 2.11:1                                                     | Fixed: `color: inherit` in `src/design/commercial.css`                                                                                                      |
| 2   | Serious  | Home, /unlock                                               | Sideways-scrolling examples row not keyboard reachable (axe scrollable-region-focusable)                                                          | Fixed: `tabIndex=0` and an aria-label in `PhotoFilterExamples.tsx`                                                                                          |
| 3   | Moderate | /previews                                                   | Heading jump H1 to H3 (cards)                                                                                                                     | Fixed: visually hidden H2 "Previews" in `PreviewsPage.tsx`                                                                                                  |
| 4   | Moderate | Adventure card (quiz reveal, collections, schedule, editor) | Heading jump H1 to H3                                                                                                                             | Fixed: card title is now H2 in `AdventureCard.tsx` (full suite: 2018 tests pass)                                                                            |
| 5   | Minor    | Home                                                        | "demo adventure" summary 31px tall on desktop                                                                                                     | Fixed: `min-height: 44px` (`.pp-demo-adv summary`)                                                                                                          |
| 6   | Minor    | /unlock                                                     | "Read the full refund policy" link 18px tall                                                                                                      | Fixed: `inline-flex items-center` so the existing 44px min-height applies                                                                                   |
| 7   | Minor    | Breadcrumbs (many pages)                                    | "Home" crumb 33-38px wide                                                                                                                         | Fixed: `min-w-11`                                                                                                                                           |
| 8   | Minor    | Skip link                                                   | 43px tall when focused                                                                                                                            | Fixed: `min-height: 44px` in `src/styles.css`                                                                                                               |
| 9   | Low      | Free quiz completion, after opening the keepsake style      | The keepsake explainer appears twice on the page (the card's gate and the stamp section), both with the same landmark label (axe landmark-unique) | Fixed: the unprompted copy under the stamp was removed; the one inside the card, opened by "See the keepsake style", stays. Test in `free-starter.test.tsx` |
| 10  | Info     | /passport, editor                                           | Visually hidden file inputs (1x1) are driven by visible 44px buttons                                                                              | Not a defect                                                                                                                                                |

Issues found: 10 (9 real). Fixed: 8. Remaining: 1 (low).

## Keyboard and reduced motion (390px)

- Tab reaches "Find Our First Adventure"; Space opens the quiz; chips and Next activate with Enter; the scratch-to-reveal control is a real button, focus ring 3px solid, and Enter/Space reveal the adventure. PASS.
- Visible focus: 3px outline on buttons tested. PASS.
- `prefers-reduced-motion: reduce`: no running animations after reveal (without it, a 250ms fade-in runs) and the scratch transition drops to 0s. PASS.
- Images: no image missing an `alt` on any checked page. One H1 per page. PASS.

## Not covered

Premium editor with a real photo (a real photo was not used; the editor shell, calendar controls and demo opened and were checked). Physical devices, real screen readers, real checkout and Safari/Firefox rendering were not tested.
