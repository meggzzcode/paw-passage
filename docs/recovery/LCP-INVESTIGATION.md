# Home page LCP investigation (2026-11-18)

Question: why is the homepage Largest Contentful Paint 5.3 s in the reported test (Slow 4G, 4x CPU, compressed), and what is the smallest safe fix?

## 1. What the LCP element is

Measured with a PerformanceObserver (`largest-contentful-paint`), Pixel 5 emulation, production build:

| Field | Value (before the fix) |
|---|---|
| Element | `IMG.absolute.inset-0` (the hero photo in the first section of `src/routes/index.tsx`) |
| URL | `/assets/hero-porch-<hash>.jpg` (1600 x 907, 196 KB on the wire) |
| size (px area) | 260,166 |
| startTime / renderTime | 5,308 ms (render time; `loadTime` 5,278 ms, so about 30 ms between the last byte and paint) |
| FCP | about 870 ms (text and the CSS paint early; the image is the whole LCP) |

So LCP is the time to download the hero image. Paint after download is not the problem.

## 2. Request waterfall (before; Slow 4G, 4x CPU, brotli, HTTP/1.1 lab server)

| Request | Start | End | Size | Priority |
|---|---|---|---|---|
| HTML | 0 | 202 ms | 10 KB | VeryHigh |
| hero-porch (1600 px) | 208 | 5,267 | 196 KB | High |
| styles.css | 210 | 666 | 15 KB | VeryHigh |
| gtag.js (Google Analytics) | 210 | 5,667 | 180 KB | Low |
| index.js + about 30 modulepreloaded chunks | 210 | up to 3,956 | about 200 KB | High |
| DM Sans + Fraunces (woff2) | 218 | 3,956 / 4,278 | 61 + 66 KB | High |
| 4 category tile images (`loading="lazy"`, but inside the viewport range) | 852 | 4,307 to 7,347 | 64 + 218 + 207 + 193 KB | Low |

Findings:

- Discovery is NOT late. The hero is requested at about 208 ms, right after the HTML, because React emits an early `<link rel="preload" as="image" fetchpriority="high">` with the 800w/1600w `imageSrcSet` and the `<img>` itself carries `fetchPriority="high"`.
- It is NOT lazy-loaded, and it is NOT blocked by hydration or by render-blocking CSS (the 15 KB brotli stylesheet is done at 666 ms; the image does not wait for it).
- The image IS the wrong size for a phone: a Pixel 5 (393 px wide, DPR 2.75) needs 1,080 device pixels, so `sizes="100vw"` selects the 1600w file (196 KB). The 800w file (68 KB) is never picked on any phone with DPR 2 or more. It is also cropped: `object-cover` shows only the centre 25 to 45% of the width on a portrait phone, so roughly 60% of the downloaded pixels are never visible.
- The hero shares the 1.6 Mbps link (about 200 KB/s) with about 750 KB of other bytes that start at the same time: Google Analytics 180 KB, first-party JS about 200 KB, fonts 127 KB, and from 852 ms four tile images (about 680 KB). 196 KB alone would take about 1.0 s plus 150 ms RTT; the measured 5.1 s is bandwidth contention. The lab does not model server-side HTTP/2 prioritisation (see section 6), so this overstates contention, but the direction is certain: every byte that is not needed for the first screen delays the hero on a slow link.

## 3. Experiments (3 runs each, median LCP in ms)

Method: `scripts/perf/lcp.cjs` (Playwright + CDP, Pixel 5, cache off, 2.5 s settle) against `scripts/perf/variant-proxy.mjs`, a brotli proxy that rewrites the home HTML per variant (real network, so throttling applies to every byte). Variants run against a scratch build of the page as it was BEFORE the fix ("legacy"). Profiles: Slow 4G = 1.6 Mbps down / 150 ms RTT + 4x CPU (the reported test); Fast 4G = 9 Mbps / 150 ms RTT + 4x CPU; unthrottled = no network or CPU throttling. Machine load average was 0.6 to 1.6 during the runs (other workers share the machine; all variants of one table were run back to back). Spread between the 3 runs is under 3% except where shown.

| Variant (legacy build + one change) | Slow 4G | Fast 4G | Unthrottled |
|---|---|---|---|
| Legacy as shipped (preload + fetchpriority + srcset) | 5,408 | 688 | 172 |
| No preload and no fetchpriority ("naive") | 6,740 | 1,908 | 168 |
| No preload, fetchpriority kept | 6,736 | 1,920 | n/m |
| Hero `loading="lazy"` (preload kept) | 5,384 | n/m | n/m |
| 800 px file for the hero + preload (soft on phones, see 4) | 1,800 | 580 | n/m |
| 800 px file, no preload | 4,060 | n/m | n/m |
| CSS inlined into the HTML | 5,360 | 876 | n/m |
| Google Analytics removed | 4,476 | 680 | n/m |
| Tile images below the hero removed | 3,996 | 704 | n/m |
| All JS removed (static HTML, image and CSS only) | 4,452 | 728 | 80 |
| **The fix (phone crop, see 4)** | **2,404** | **576** | 164 |

(n/m = not measured; they could not move a result that is already within the noise.)

Reading it:

- Preload and `fetchpriority="high"` are worth 1.3 s (Slow 4G) and 1.2 s (Fast 4G). They are already in place and must stay. A change that dropped them (for example moving the hero into `<picture>`, where React no longer emits the preload) would have cost that much.
- `loading="lazy"` on the hero would not change anything here only because the preload still fetches it; it is not used and must not be added.
- Inlining CSS does not help (CSS is not on the critical path for the image) and made Fast 4G worse (the HTML grows by 98 KB uncompressed).
- JS hydration does not gate the image: removing all JS saves about 1 s on Slow 4G, but only because the JS bytes stop competing for bandwidth, not because of script execution (unthrottled LCP is 172 ms with or without JS).
- Bytes that compete with the hero are the lever. Removing the 180 KB analytics script or the below-the-fold tiles alone saves about 1 s each on Slow 4G; neither is a file this task owns (see section 7).
- The fix shrinks the hero itself, which is the one thing in the owned files.

## 4. The fix (implemented)

1. `src/assets/hero-porch-mobile.jpg` (new, 96 KB): the centre 720 x 907 px of the existing `hero-porch.jpg`, same source pixels (so as sharp as before on a phone, where `object-cover` crops to that region anyway), 49% of the bytes. A plain 800w downscale was rejected: it is 68 KB but blurrier (1.4x CSS upscaling, about 3.9x at DPR 2.75), and it LCP-measured 1,800 ms vs 2,404 ms for the crop on Slow 4G, a difference that comes from 26 KB of image size. The crop trades about 0.6 s of lab LCP for no loss of sharpness.
2. `src/routes/index.tsx`: the hero `<img>` is wrapped in `<picture><source media="(max-width: 767px)" srcSet=mobile-crop></picture>`; the `<img>` keeps `fetchPriority="high"`, the 800w/1600w `srcset`, `sizes="100vw"`, `alt`, width/height and classes. Desktop and tablet (768 px and up) still get exactly the same files as before.
3. React does not auto-preload an `<img>` inside `<picture>`, so the component calls `preload()` from `react-dom` twice: the phone crop (`media="(max-width: 767px)"`) and the 800w/1600w pair (`media="(min-width: 768px)"`), both `fetchpriority="high"`. This emits both links at the top of `<head>`, before the stylesheet and scripts, which is where the old automatic preload sat. (First attempt: route `head()` links and `preload()` without the `imageSrcSet` form put the links at about 3.7 KB, after 36 modulepreload links, and the lab got worse, 1,516 ms on Fast 4G vs 688 ms before, so the placement matters; the `imageSrcSet` form is what React hoists to the early slot when a media query is present.)
4. `src/lib/images.ts`: `HERO_MOBILE` constant, and `hero-porch` gets `card: hero-porch-800.jpg`, so the "Mountain escapes" tile (about 190 px wide) loads the 68 KB file instead of the 196 KB hero file. Without this, the tile (which used to share the hero's cached URL on phones) would have downloaded a second, full 1600 px copy.
5. `src/test/images.test.ts`: one test for the phone crop (exists, under 60% of the full hero).

Rendered output: only the `<picture>` wrapper, the new `<source>`, two preload links and the tile image URL differ. Screenshots of the hero at 393 px, 360 px and 820 px wide before/after: tablet identical (0.00 mean difference), phones within 0.6 to 2 grey levels per channel (JPEG re-encoding only; visually identical).

## 5. Before / after (same method, same machine, 3 runs, median ms)

| Profile | Before | After | Change |
|---|---|---|---|
| Slow 4G + 4x CPU, HTTP/1.1 lab server (the reported test setup) | 5,408 | 2,404 | -3.0 s (-56%) |
| Fast 4G + 4x CPU, HTTP/1.1 | 688 | 576 | -0.1 s |
| Unthrottled | 172 | 164 | no change |
| Slow 4G, HTTP/2 lab server (no server prioritisation) | 6,808 | 4,584 | -2.2 s (-33%) |
| Fast 4G, HTTP/2 | 1,276 | 808 | -0.5 s |
| Desktop 1440 px, Slow 4G | 5,340 | 5,440 | unchanged (same files as before) |
| Desktop 1440 px, Fast 4G | 780 | 692 | unchanged within noise |

Target LCP <= 2.5 s: met on Fast 4G (0.6 to 0.8 s) and, in the HTTP/1.1 lab, on the harsh Slow 4G profile (2.4 s). Not met on the harsh profile in the HTTP/2 lab (4.6 s); not met on desktop over Slow 4G (5.4 s, not touched: it downloads the 196 KB file; a 1600 px hero on a 1.6 Mbps link cannot be under 2.5 s while analytics, JS and fonts share the link).

Earlier reports quote 5.3 s (`PERF-BEFORE-AFTER.md`); the 5.4 s here is the same setup on the same code.

## 6. Lab versus real users

- All numbers above are lab numbers on a throttled headless Chromium. The Slow 4G + 4x CPU profile is Lighthouse's harshest mobile preset (1.6 Mbps, 150 ms RTT); most phones on 4G or Wi-Fi see something closer to the Fast 4G column (about 0.6 to 0.8 s) or better.
- The HTTP/1.1 and HTTP/2 lab servers differ by up to 2 s on Slow 4G for the same page because Node does not honour HTTP/2 stream priority, so all concurrent downloads share bandwidth equally. Netlify (the host) serves HTTP/2 with Brotli (verified: `curl` against https://www.pawsandpassage.com returns `HTTP/2`, `content-encoding: br`, `server: Netlify`, HTML TTFB about 160 ms from this sandbox); whether the edge honours priority is not established here, so the truth for real visitors on a slow link lies between the two lab rows.
- There is NO field data. The Chrome UX Report API call for the origin returned HTTP 403 (API key required) and the PageSpeed Insights public API returned HTTP 429 (shared quota exhausted) when tried on 2026-11-18, so no CrUX or PSI value is recorded; nothing is invented. The site is new, so CrUX may not have enough traffic for the origin anyway. Check Search Console > Core Web Vitals and PageSpeed Insights from a browser once real traffic exists.
- The live site already serves the pre-fix markup (the same early preload and fetchpriority); the fix is not deployed until this branch is deployed.

## 7. What still limits the harsh profile (evidence) and recommended follow-ups

1. Google Analytics, 180 KB at Low priority, started at 210 ms and completed at 5.5 to 5.7 s in the waterfall; removing it moved legacy LCP from 5.4 s to 4.5 s (Slow 4G). Lever: load gtag after `load` (or on idle/first interaction). File: `src/routes/__root.tsx` scripts block (not changed here: analytics loading is a measurement decision for the owner).
2. The four category tile images (`loading="lazy"`, but within Chrome's lazy-load distance), about 680 KB on 960 px "card" files at 190 px display width: removing them moved Slow 4G LCP to 4.0 s. Lever: 400 to 480 px thumbnails for those tiles, or `fetchPriority="low"`. Files: `src/routes/index.tsx` (below the fold; outside this task's remit) and new thumbnail assets.
3. Fonts, 127 KB, preloaded (needed for the headline and body paint, not for the image). Not an LCP blocker (the LCP is the image) but they share the link. Subsetting Fraunces would save about 20 to 30 KB; not attempted.
4. First-party JS about 200 KB brotli (about 626 KB parsed): removing all JS saved about 1 s of LCP on Slow 4G through bandwidth, not execution. The larger win is already shipped in the earlier WP2 work (-38%).
5. Hosting latency: TTFB about 160 ms to the Netlify edge from this sandbox; the lab HTML TTFB is about 15 ms, so real users add roughly 100 to 300 ms to every number above, from RTT alone.
6. Desktop over Slow 4G: unchanged at 5.4 s because the 1600 px file is needed there; only lower contention helps (items 1 and 2).

## 8. Reproduce

```
NITRO_PRESET=node-server bunx vite build
PORT=4190 node .output/server/index.mjs &
node scripts/perf/variant-proxy.mjs 4182 4190 new &          # or legacy / no-ga / no-tiles / hero800 ...
NODE_PATH=$(npm root -g) node scripts/perf/lcp.cjs http://localhost:4182 slow4g 3 --waterfall
# profiles: slow4g | fast4g | none; add --desktop for a 1440 px viewport; set H2_KEY/H2_CERT on the proxy for HTTP/2 (use https:// and the same flags)
```

Variants only edit attributes or strip whole scripts, never add or remove elements, because React would replace the DOM at hydration and move the LCP (this invalidated a first set of runs that removed the `<picture>`; those were discarded and re-measured against a real scratch build of the old code). "Legacy" numbers come from a scratch build of the code before the fix; the "new" numbers from a scratch build of the final source.
