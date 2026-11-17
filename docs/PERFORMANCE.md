# Performance notes

## 1. Images (done)

Tool: `python3 scripts/optimize-images.py` (Pillow; sharp is not installed). Heroes are max 1600 px wide, JPEG q80 (stepping down to no lower than q78 only when a file would exceed ~390 KB), progressive. Each hero also has a `<name>-800.jpg` phone variant. Card images (960 px, all 62-217 KB, shown at about 270 px) were left untouched. No photo was cropped or swapped; aspect ratios are unchanged (hero-porch went from 1920 to 1600 wide). Original files were kept outside the repo, so re-running the script on the optimized files recompresses them once more; avoid doing that repeatedly.

Before/after, bytes:

| Set | Before | After |
|---|---|---|
| 17 heroes incl. hero-porch (2400/1920 px) | 11,958,795 | 4,207,296 (1600 px, -65%) |
| 17 new 800 px phone variants | - | 1,283,358 (32-120 KB each) |
| 16 card images (unchanged) | 2,209,321 | 2,209,321 |
| src/assets total | 14,168,116 | 7,699,975 (includes the 800 px variants) |

Per file (KB, before -> after at 1600 px -> 800 px variant): guide-large-dogs 1264 -> 407 -> 115; guide-atlanta-getaways 1153 -> 391 -> 113; guide-ga-cabins 1134 -> 399 -> 120; guide-la-getaways 1118 -> 374 -> 98; gear-car-safety 841 -> 294 -> 87; guide-fenced-yard 834 -> 313 -> 100; guide-cabin-packing 757 -> 281 -> 88; guide-two-dogs 621 -> 210 -> 70; gear-portable-fence 525 -> 188 -> 61; guide-pet-fees 521 -> 130 -> 36; guide-rental-checklist 518 -> 184 -> 58; gear-first-aid 488 -> 194 -> 66; gear-feeding 487 -> 177 -> 56; guide-ca-beach 426 -> 115 -> 32; gear-rental-protection 377 -> 106 -> 34; gear-id-tracking 355 -> 141 -> 45; hero-porch 251 -> 195 -> 68. A phone loading the home page now fetches the 68 KB hero (if the component applies srcset) instead of 251 KB; a phone on a guide gets 32-120 KB instead of 426-1264 KB.

Visual check: side-by-side crops of hero-porch, guide-large-dogs and guide-fenced-yard (original vs optimized) showed no visible blocking or softening at 1:1.

The largest file, guide-large-dogs.jpg, is 417 KB (just above 400 KB; q78 is the floor the owner agreed to, and going lower or below 1600 px was ruled out). `src/test/images.test.ts` therefore uses a 420 KB limit.

### Component edits for the lead (helpers are in `src/lib/images.ts`)

Exports: `srcSetFor(key)`, `srcSetForKey(looseKey)`, `phoneSrcFor(key)`, `HERO_SIZES`. All return `undefined` when no variant exists, so passing them to `srcSet` is always safe. Uploaded heroes (`heroUpload`) have no variant and keep working.

1. `src/routes/index.tsx` home hero `<img>`: add `srcSet={srcSetFor("hero-porch")}` and `sizes="100vw"`; keep `src={images["hero-porch"].src}`; keep `fetchPriority="high"`, no lazy loading on the hero. Consider `<link rel="preload" as="image" imagesrcset=... imagesizes="100vw">` in the route `head()` for the LCP image.
2. Guide page hero (`src/routes/guides.$slug.tsx` or its hero component): where the hero `<img src={hero.src}>` is rendered, add `srcSet={srcSetForKey(guide.heroImage)}` and `sizes={HERO_SIZES}` (only when `!guide.heroUpload`).
3. Destination town pages that reuse the guide hero images: same two attributes with the guide's `heroImage` key.
4. Card images are already 960 px and need no change. Keep `width`/`height` attributes and `loading="lazy"` on below-the-fold images.

## 2. Caching and compression (done)

`netlify.toml` now sets `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (Vite emits hashed files there). Netlify serves text assets (HTML, JS, CSS, JSON, SVG) with gzip/brotli automatically, so nothing is needed for compression; the local node server being uncompressed is not representative. For reference, measured gzip -9 sizes of the largest chunks: index 365,842 -> 114,815; guides 358,230 -> 110,488; Markdown 80,979 -> 24,419; esm (zod) 57,043 -> 12,946.

## 3. JavaScript (measured, recommendations only)

Build of a copy of the tree (content from git HEAD): 103 files in `.output/public/assets`, 1,052,608 bytes of JS in total (raw), CSS 91,182 (one file). Biggest chunks (raw / gzip):

| Chunk | Raw | Gzip | What it is |
|---|---|---|---|
| index-*.js | 365,842 | 114,815 | entry: React 19 + react-dom, TanStack Router/Start, GA bootstrap, shared UI |
| guides-*.js | 358,230 | 110,488 | the full text of every guide (`src/content/guides/*.ts`, eager `import.meta.glob`) |
| Markdown-*.js | 80,979 | 24,419 | `marked` |
| esm-*.js | 57,043 | 12,946 | zod |
| guides._slug-*.js | 38,737 | 12,862 | guide route |
| link, site, routes, calculators | under 20 each | | |

Findings and recommendations (none applied: all need edits to files outside this task's ownership):

1. **Guide bodies ship on every page (about 358 KB raw, 110 KB gzip, the largest single saving).** The entry chunk statically imports `guides-*.js` because `src/content/guides/index.ts` uses `import.meta.glob("./*.ts", { eager: true })` and the home page, `GuideCard`, destinations, stays and sitemap code all import from it. Fix: have list views use a metadata-only module (title, slug, description, heroImage, dates; body excluded) and load the body only in the guide route, via `import.meta.glob("./*.ts")` (lazy) or a `loader` that dynamically imports the one guide. Expected: home and list pages drop most of that 110 KB gzip; `guides._slug` grows by one guide (about 10 KB raw).
2. **`marked` (81 KB raw / 24 KB gzip) is in the entry graph.** Only guide pages and info pages render Markdown; make `Markdown` a lazy import (`React.lazy`) or import it only from `guides.$slug` and `InfoPage`. Expected saving on home: about 24 KB gzip. Check why the entry references it (probably via the shared guide helper from item 1).
3. **zod (57 KB raw / 13 KB gzip) is in the entry.** It comes from `src/content/schema.ts` (content validation) and `stay-search.ts`. Validation of content can run at build time only (the `paws-content` Vite plugin already validates); do not import `schema.ts` at runtime. Expected saving: about 13 KB gzip.
4. **Analytics.** `src/lib/analytics.ts` and `__root.tsx` carry the GA bootstrap in the entry. Load the gtag script after `window.load`/idle (`requestIdleCallback`) and only after consent. The gtag.js itself (about 50-60 KB gzip, third party) is not measured here since it is not in the build output.
5. **lucide-react** is already per-icon (tree-shaken, `createLucideIcon` shared chunk), so lazy loading icons gives no meaningful win. **recharts** is a dependency but `ui/chart.tsx` is not in any emitted chunk (tree-shaken); unused dependencies (recharts, embla-carousel, react-day-picker, input-otp, cmdk, vaul, react-resizable-panels, date-fns if unused) only cost install time, not bundle size, as long as they are not imported. Removing them is optional housekeeping.
6. Tools routes are already split (calculator 9 KB, host-questions 9 KB); no work needed.
7. CSS is a single 91 KB (about 14 KB gzip) file; acceptable.

Combined potential on the home page from items 1-3: roughly 145 KB gzip (about 450 KB raw parsed JS) out of about 190 KB gzip total, which also cuts the 4x CPU parse time seen in the slow-3G test.

## Not done

No component or route edits, no WebP/AVIF conversion (would need `<picture>` edits and the owner is sensitive to image quality), no card variants, no preload tags, no server compression config.
