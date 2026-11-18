# Performance: before and after (2026-11-18)

## Method (repeatable: `scripts/perf/`)

- Production build: `NITRO_PRESET=node-server bunx vite build`, served with `PORT=4180 node .output/server/index.mjs`.
- `scripts/perf/measure.cjs`: Playwright + preinstalled Chromium, Pixel 5 mobile emulation, CDP CPU throttling 4x, CDP network "Slow 4G" (1.6 Mbps down, 750 Kbps up, 150 ms RTT), cache disabled, median of 3 loads per page, 2.5 s settle after `load`. FCP, LCP and CLS come from PerformanceObserver in the page; sizes are bytes on the wire (CDP `encodedDataLength`).
- `scripts/perf/compress-proxy.mjs`: the plain node server sends everything uncompressed (Netlify compresses), so the numbers in table A put a brotli-compressing proxy in front, to mimic production. Table B (uncompressed) is kept for completeness.
- BEFORE = the build of this branch before any WP2 change; AFTER = the final WP2 build. Both measured on the same machine, one after the other. Lighthouse is not installed, so there is no Lighthouse score here; these are lab numbers, not field data (no CrUX data exists for the new domain).
- Third-party in both runs is Google Analytics (about 184 KB, a script that loads only when a GA4 ID is configured) plus, BEFORE only, Google Fonts (CSS plus 131 KB of font files).

## A. Compressed delivery (closest to Netlify)

| Page | FCP before / after | LCP before / after | CLS before / after | Total transfer before / after | JS transfer before / after | JS parsed (decoded) before / after | Requests |
|---|---|---|---|---|---|---|---|
| / | 864 / 836 ms | 6,148 / 5,288 ms | 0.0021 / 0.0021 | 1,558 / 1,437 KB | 500 / 381 KB | 1,073 / 626 KB | 43 / 42 |
| guide (markdown) | 808 / 884 ms | 808 / 884 ms | 0.0207 / 0.0207 | 889 / 768 KB | 529 / 410 KB | 1,167 / 721 KB | 41 / 40 |
| guide (code file) | 852 / 908 ms | 852 / 908 ms | 0.0025 / 0.0025 | 1,000 / 879 KB | 529 / 410 KB | 1,167 / 721 KB | 41 / 40 |
| /stays | 728 / 748 ms | 728 / 748 ms | 0.0004 / 0.0004 | 652 / 531 KB | 497 / 378 KB | 1,063 / 617 KB | 36 / 35 |
| /gear | 700 / 800 ms | 700 / 800 ms | 0.0001 / 0.0001 | 817 / 695 KB | 496 / 377 KB | 1,058 / 612 KB | 38 / 37 |

JS transfer includes about 184 KB of Google Analytics in both columns; first-party JS on the wire fell from about 316 KB to about 197 KB (-38%) on the home page.

## B. Uncompressed (plain node server, Slow 4G; overstates JS cost)

| Page | FCP before / after | LCP before / after | Total transfer before / after | JS transfer before / after |
|---|---|---|---|---|
| / | 2,800 / 2,696 ms | 6,372 / 5,552 ms | 2,444 / 1,996 KB | 1,268 / 821 KB |
| guide (markdown) | 2,888 / 2,792 ms | 2,888 / 2,792 ms | 1,881 / 1,431 KB | 1,363 / 916 KB |
| guide (code file) | 2,876 / 2,752 ms | 2,876 / 2,752 ms | 2,008 / 1,557 KB | 1,363 / 916 KB |
| /stays | 2,604 / 2,976 ms | 2,604 / 2,976 ms | 1,525 / 1,079 KB | 1,257 / 812 KB |
| /gear | 2,576 / 3,000 ms | 2,576 / 3,000 ms | 1,672 / 1,224 KB | 1,253 / 807 KB |

## Honest reading

- Real, large win: bytes. Guide text no longer ships on every page: the `guides` chunk fell from 358 KB to 45 KB (raw), JS parsed on the home page fell 42% (1,073 to 626 KB), and total transfer fell 8 to 18% per page (more uncompressed). The Google Fonts stylesheet and two third-party origins are gone (133 KB of third-party requests replaced by 130 KB of first-party fonts that are preloaded and cacheable with the site's own domain).
- Not a measurable win: FCP and LCP. In this lab FCP is flat within noise (about 0.7 to 0.9 s compressed; +/-100 ms between runs, some pages slightly slower, some faster). Text pages paint at about the same time because the 98 KB (16 KB compressed) stylesheet, not the font, gates first paint, and `font-display: swap` already allowed text to paint before the fonts arrived in the old setup. The earlier audit's Lighthouse FCP of 3.1 to 3.7 s used Lighthouse's own simulated throttling, so it is not comparable to these numbers. Do not expect the "0.5 to 1 s" FCP gain the audit guessed at on the strength of this measurement.
- Home LCP (the hero photo) improved from 6.1 s to 5.3 s because less JS and font traffic competes with the image on a slow link; it is still slow because the home page loads about 900 KB of images over Slow 4G. Fixing that needs an image-priority change in `src/routes/index.tsx` (another worker's file) and was not done.
- CLS unchanged (0.0207 on the markdown guide is identical before and after, so fonts did not change it (cause not investigated)).
- Not changed: gtag (184 KB), zod (57 KB chunk, needed by search-parameter validation in the router), `marked` (81 KB, now only in the guide route chunk and not preloaded on the home page).
- Rendered output: the `<body>` HTML of 7 guides, the guides index, and the 404 page is identical before and after (`scripts/perf/snapshot.mjs` + `compare-html.mjs`; hashed asset names and router chunk manifests ignored). Home, /stays and /gear bodies changed afterwards because other workers edited those pages (filters, gear products); they were identical in the WP2-only comparison for /gear and /guides.
- Images (task 7): all 116 site images in `src/assets` are already within the existing conventions (heroes at most 1600 px and at most 417 KB, 800 px phone variants, 960 px cards); the 25 share images (73 to 165 KB) and 24 pin images (up to 292 KB, not loaded by pages) are fine. Nothing was oversized and nothing was re-compressed (re-running the optimizer on already optimized files would lose quality for no gain).
