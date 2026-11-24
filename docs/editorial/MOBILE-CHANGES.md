# Mobile presentation changes

Checked at 390 and 1280 px with Playwright Chromium on four guides (ramp, bowls, rental dog limit, Georgia cabins). Screenshots: `docs/editorial/img/mobile-<name>-<width>-{before,after}[-table].png`, plus `mobile-pickcard-390-{before,after}.png`.

1. Wide tables (`src/styles.css`): first column is sticky with an opaque background and edge shadow; table uses `border-collapse: separate` so borders survive sticky; below 40rem the table min-width is dropped, cells are 0.85rem with tighter padding and 5.5rem min columns (first column 6.5-8rem). Swipe hint kept; right-edge fade strengthened. Tables that fit now show no overflow (721 -> 547 px, 544 -> 350 or 395 px).
2. Separators: breadcrumb separators are hidden on phones (gap spacing), current page is on its own truncated row. The byline/trust row no longer uses a `·` glyph between items (chips with gap), so no line can start with a separator.
3. `Affiliate links disclosed` chip removed from `TrustStrip`. Byline, last reviewed and sources count are one wrapped row; share buttons moved below the hero image; h1 is text-3xl and dek text-base on phones. Hero image top at 390 px: 634 -> 466 px (503 on the longest title).
4. Pick and spec cards: smaller padding, icon and name, tighter vertical rhythm below 40rem (CSS only, via `aside[data-pick]`; `Markdown.tsx` untouched).
5. Citation links: padding with equal negative margin gives a 26x31 px hit area with no layout or visual change (was 6x15).

Tests: `src/test/article-ux.test.tsx` asserts no affiliate chip and no separator glyph in the strip.
Known unrelated failures at commit time come from other workers' in-progress content (pins CSV, related-products disclosure text).
