# Crawl fixes, 2026-11-24

Fixes for FINAL_QA_CRAWL_2026-11-24.md.

- Meta descriptions (22 pages, now 120-155 characters): /terms, /privacy, /corrections, /contact and /tools rewritten in their route head(). Six town pages (San Diego, Santa Barbara, Blue Ridge, Dahlonega, Ellijay, Helen) use a new fitDescription() in destinations.$state.$town.tsx that picks the first blurb-plus-suffix that fits. All 11 gear categories get metaTitle and metaDescription in src/content/gear-categories.ts (used by gear.$category.tsx). Titles are natural and 60 characters or fewer, for example "Dog Car Safety Gear: Crates, Harness Advice and Barriers"; "ID" and "GPS" are capitalised. No "verified" or "best" claims.
- Gear trip views (gear.index.tsx): the Featured section drops every product already in the trip collection and is hidden when fewer than three remain. Dog-type and category sections are tiles, not product cards. Test: src/test/gear-trip-dedupe.test.tsx (no product card twice on any trip view).
- Bowls guide: the doubled-publisher parenthetical is gone. The sentence now ends "per the `[22oz](url)` and `[20oz](url)` pages", keeping both Springland source URLs linked, while the product names stay plain text so the affiliate text links still apply. Fewer words than before.
- Puppy guide: cause of the 716 px first paragraph was an H2 ("The short answer") placed before the first paragraph; other guides open with a lede paragraph. Removed that heading (3 words fewer). The dek is unchanged.
- Not touched: the four guides owned by the other worker, citation links, quotes.
