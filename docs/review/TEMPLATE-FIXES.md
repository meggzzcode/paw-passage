# Template fixes from article reviews

| # | Fix | Files | Before / after |
|---|-----|-------|----------------|
| 1, 8 | Brand not doubled | new `src/lib/product-display.ts` (`productTitle`), `Markdown.tsx`, `GearPicks.tsx`, `RelatedProducts.tsx`, `GearHubCards.tsx`, `PackingBuilder.tsx` | "KONG KONG Classic" -> "KONG Classic"; "Petcube Petcube GPS Tracker" -> "Petcube GPS Tracker" |
| 2 | Tables | `Markdown.tsx`, `src/styles.css` | Tables were `display:block` squeezed to the column width. Now `min-width: 34rem`, 7.5rem min column, scroll box with edge shadows, focusable region, and a "Swipe sideways to see all columns" hint under 40rem. Checked at 390 px: page width stays 390, no horizontal page scroll. |
| 3 | Source chip | `ArticleActions.tsx` | "18 official sources" -> "18 sources cited" |
| 4 | Checklist bullets | `Markdown.tsx`, `styles.css` | Task items get `class="task-item"`; bullet removed, checkbox kept |
| 5 | Pick label | `product-display.ts`, `Markdown.tsx` | No label, or the generic "Our pick", now shows the category label map (Car safety pick, Ramp pick ...). Any other explicit label wins. |
| 6 | Repeated gear blocks | `guides.$slug.tsx`, `GearPicks.tsx`, `RelatedProducts.tsx` | Products with a `{{pick:}}` card in the body are skipped by GearPicks; RelatedProducts also skips GearPicks products, and the block is not rendered when nothing is left |
| 7 | Pick card Why / Source | `Markdown.tsx` | Single renderer already used everywhere; unchanged (the "Our pick" handling above is the only difference) |

Tests: `src/test/template-fixes.test.tsx`, `src/test/gear-block-dedupe.test.tsx`; updated `article-ux.test.tsx` and `guide-related-products.test.tsx` (the old test assumed a block now correctly hidden).

Evidence (390 px): `docs/flip/evidence/template-fixes-*.jpg`.

Note: the working-tree build was broken by another worker's `content/guides/vacation-rental-with-a-reactive-dog.md` (invalid YAML at the time); screenshots came from a build of the same code with `content/` taken from HEAD.
