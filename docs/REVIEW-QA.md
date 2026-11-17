# QA review: Paws & Passage (production build, 2026-11-17)

Method: production build served from `.output` on port 4501. Playwright/Chromium at 1280x800 and 390x844 (touch). Every route visited at both sizes (47 URLs x 2 viewports, including a 404 and four invalid dynamic URLs), plus interactive tool tests, curl checks, JS-disabled render, print emulation and a slow-3G + 4x CPU throttle. Source was read for the tools only to compute the expected maths; nothing was edited. Scripts are in the session scratchpad `qa/` folder.

Routes covered: `/`, `/guides`, all 16 `/guides/<slug>`, `/destinations`, both states, all 8 towns, `/stays`, `/tools`, `/tools/host-questions`, `/tools/cost-calculator`, `/tools/checklist`, `/tools/compare`, `/about`, `/contact`, `/list-your-property`, `/privacy`, `/terms`, `/affiliate-disclosure`, `/editorial-standards`, `/this-does-not-exist`, `/guides/nope`, `/destinations/texas`, `/destinations/georgia/nowhere`, `/stays/sample-ridge-cabin`.

Counts: **BUG 3, ISSUE 8, NIT 8.**

---

## BUG (broken or wrong)

### B1. Wide tables clip content and cause sideways page scroll on phones (3 guides)
- Pages: `/guides/dog-friendly-weekend-getaways-from-atlanta`, `/guides/dog-friendly-weekend-getaways-from-los-angeles`, `/guides/traveling-with-two-dogs-accommodation-guide`.
- Repro: open at 390px wide. Page `scrollWidth` is 444, 495 and 485 px against a 390 px viewport. The Atlanta first table is 424 px wide and the third column ("Main question before booking") is cut off at the screen edge ("Does the lodgi", "What are the exact rules for"). The table's parent is `.prose-article` with `overflow: visible`, so the table has no scroll wrapper. The widening also pushes the article headings, bullet lists and the right-hand edge of the whole layout.
- The other 13 guides have no horizontal scroll, but their tables only just fit (3 columns at 15px) and are cramped.
- Fix direction: wrap markdown tables in an `overflow-x: auto` container (or stack the cells on small screens).

### B2. `/sitemap.xml` returns an error string, not a sitemap
- Repro: `curl localhost:4501/sitemap.xml` returns the plain text `Sitemap domain not configured. Set siteUrl in src/config/site.ts.`
- Related: every `<link rel="canonical">` and `og:url` is a relative path (`href="/"`, `og:url content="/guides/..."`). Canonicals and Open Graph URLs should be absolute. The same unset `siteUrl` is the likely cause. Fine for staging, but a launch blocker.

### B3. Host-question generator: grammar breaks when more than one dog is selected
- Repro: `/tools/host-questions`, set Number of dogs to 2, tick "We'll use a crate" and "We may need to leave the dog alone sometimes".
- Output: "...are crates required when **them are** left?" and "Can **them** be left alone in the rental...". The single-dog message reads correctly ("Biscuit is left", "Can Biscuit be left alone").

---

## ISSUE (works but poor)

### I1. Very slow first load on slow 3G (400 kbps, 400 ms RTT, 4x CPU)
- Home: FCP 10.3 s, LCP about 27 s (the hero image `hero-porch`), load event 33 s. CLS 0.002.
- Guide (`dog-travel-first-aid-kit-guide`): FCP 10.7 s, LCP about 35.7 s (`gear-first-aid`, 489 KB), load 35.6 s. CLS 0.005.
- Total transfer is about 1.5 MB per page. JS is 850 KB (home) to 945 KB (guide), CSS 88 KB, images 489-533 KB.
- Causes seen:
  - **No compression.** HTTP responses carry no `content-encoding`. `Accept-Encoding: gzip, br` still returns raw bytes (`index-*.js` is 364,952 bytes). If the real host does not compress, this is the single biggest win. I could not tell whether the production host will add it.
  - A mostly static content page loads about 0.9 MB of JS.
  - Google Fonts CSS in `<head>` is render-blocking.

### I2. Images are far larger than needed, with no `srcset`
- Images over 300 KB in the build (bytes): guide-large-dogs 1,294,379; guide-atlanta-getaways 1,181,485; guide-ga-cabins 1,161,928; guide-la-getaways 1,145,035; gear-car-safety 861,400; guide-fenced-yard 854,775; guide-cabin-packing 776,151; guide-two-dogs 636,706; gear-portable-fence 537,622; guide-pet-fees 533,610; guide-rental-checklist 531,044; gear-first-aid 500,716; gear-feeding 498,854; guide-ca-beach 437,216; gear-rental-protection 386,770; gear-id-tracking 364,359. (The 250 KB home hero is under the line.)
- Hero and article images are 2400 px wide JPEGs. They are served unchanged to a 390 px phone (no `srcset`/`sizes`) and displayed at about 582 px on desktop. Destination town pages use the same 2400 px images.
- The card images (960 px) are shown at about 270 px.
- The article hero is also the LCP element on guides.

### I3. Contested "Lowest total" badge highlights a blank stay
- Repro: `/tools/cost-calculator`, enter a nightly rate of 200 in Stay A and leave Stay B empty. Stay B ($0.00 total) gets the green "Lowest total" label.
- An empty stay should not win. The flag only checks that at least one stay is above zero, then picks the minimum including the empty ones.

### I4. Number fields: cannot clear a value, and a stray leading zero sticks
- Repro: in any calculator field type 50, then Backspace twice. The field shows "0". Typing "7" now shows "07". Typing "12.5.5" ended as "012.55".
- Cause: the field re-renders as 0 on every empty value. The maths stays correct, but it looks broken and editing is awkward, especially on a phone keypad.

### I5. Host-question message for 2 or more dogs drops the dog details
- Repro: 2 dogs, name "Biscuit", breed "Border Collie mix", size Large. The opening says "traveling with 2 dogs" with no size, name or breed, while question 3 then says "My dog is a Border Collie mix" (singular, one breed for two dogs). The size dropdown only affects the weight question for one dog.
- Confusing when the dogs differ, and the user has no field for a second dog.

### I6. Compare tool is not reachable from the site
- `/tools/compare` exists and works, but it is not linked from `/tools` (three tool cards only), the header, the footer "Plan" column, or the sitemap list. It is only reachable by typing the URL or via the "Nothing to compare yet" text on other pages. The spec for this review said "four tools", so this may be a bug if it should be discoverable. (The empty state itself is clear: "Nothing to compare yet" plus a link to the cost calculator.)

### I7. Printing a guide hides all FAQ answers
- Repro: open any guide, emulate print. The FAQ `<details>` are closed, so only the question and a "+" print ("What should be in a dog first-aid kit for travel? +"). Header, footer and nav are correctly hidden; the guide prints to 14 pages. Answers should be forced open under `@media print`.

### I8. Mobile menu and JS-off gaps
- Escape does not close the open mobile menu (it only closes by the X button or by navigating).
- The menu button is 24x24 px, below a comfortable touch size.
- With JavaScript disabled, the 390 px layout shows the menu button, but it does nothing, so there is no navigation (the header links are `hidden md:flex`). The content itself renders fully without JS (see "Tested and fine").

---

## NIT

1. `/tools/checklist`: if `localStorage["pp-checklist-v1"]` holds the string `null`, the page throws `TypeError: Cannot convert undefined or null to object` (from `Object.values`) and fails to render. Bad JSON (`{bad`) is handled fine. The save effect also calls `localStorage.setItem` outside a try/catch, so a browser that blocks storage could throw.
2. Cost calculator: values like 1e21 display float noise ("$3,217,500,000,000,000,700,000.00"). There is no upper limit on any field. Nights and Dogs accept decimals (Dogs 2.5 at $10 per dog gives $25).
3. Cost calculator: after removing a stay and adding another, names can duplicate ("Stay C", "Stay B", "Stay C").
4. Product buttons read "See it on Adventure Medical Kits's website" and "Company of Animals's website" (the possessive is wrong for names ending in s or a phrase).
5. Guide checklists (tick-box lists in 9 guides, for example `how-vacation-rental-pet-fees-work`, 10 boxes) render as real checkboxes but are all `disabled`, so visitors cannot tick them. The interactive version lives at `/tools/checklist`. `/guides/dog-friendly-cabin-packing-list` has no checkboxes at all.
6. 404 pages keep the home page's `<title>` ("Paws & Passage: dog-friendly travel guides and planning tools") and the home meta description. They return a correct 404 status. The 404 block uses `min-h-screen` inside the layout, so the footer is pushed below a full screen of blank space.
7. No skip-to-content link (`a[href="#main"]` count 0), though `<main id="main">` exists.
8. `/stays` shows "Every stay here has had its pet policy, fees and fencing checked." above "0 stays" and "Verified stays are on their way". There is also no `og:image` on any page checked (home and guides), even though twitter card is `summary_large_image`. Guide `<head>` has no social image.

---

## Tested and fine

- **Status codes:** all 47 listed routes return 200. Invalid slugs (`/guides/nope`, `/destinations/texas`, `/destinations/georgia/nowhere`, `/stays/sample-ridge-cabin`, `/this-does-not-exist`) return a real 404 with a Go home link. The only console messages on any page are the expected 404 resource error on those 404 URLs. No console errors or warnings, no page errors, no failed requests on any 200 page, desktop or mobile.
- **Headings and meta:** exactly one `h1` on every page. No heading-level skips detected. Every page has a title, description and (relative) canonical. Breadcrumb JSON-LD present on guides and destinations. Every `<img>` has an `alt` attribute (guide and hero images have descriptive alt, repeated card images use empty alt next to a visible title).
- **Horizontal scroll (mobile):** none on 44 of 47 pages; the three exceptions are B1. No layout overflow elsewhere.
- **Images:** no broken images once lazy-loading has fired (an early false alarm was just lazy images not yet loaded in a fast scroll). `width`/`height` are set, CLS is near zero. Hashed assets are served with `max-age=31536000, immutable`.
- **Mobile menu:** opens with the correct `aria-expanded` and Close label, shows Destinations, Guides, Tools, closes on X, closes after navigating, and each link lands on the right page.
- **Keyboard:** Tab order is logical (logo, nav, CTA, page links); the browser's default focus ring (auto) is shown on links and buttons. FAQ `<summary>` opens and closes with Enter.
- **Footer:** 13 links, all 200. Breadcrumbs resolve and mark the current page with `aria-current`.
- **Contact and list-your-property:** mailto links are well-formed (`hello@pawsandpassage.com`, subject encoded, "Property submission"). Neither page has a form, only the mailto.
- **Host-question generator:** default message, all-options message (21 questions), 1 giant dog, nothing ticked (5 questions), special characters ("<b>x</b> & "q"") appear as text, not markup. Copy puts 2,210 characters on the clipboard and the button shows "Copied". "Email it" builds a correct mailto with subject and encoded body.
- **Cost calculator maths (checked by hand, all matched to the cent):** Stay A $200 x 4 nights, cleaning $100, other $25, pet $50, 2 dogs, tax 10%, deposit $300. Lodging $800, cleaning and other $125, tax $92.50 (applied to lodging+cleaning+other), per stay pet $50 gives total $1,067.50, $266.88 per night, $1,367.50 with deposit. Per night gave pet $200 (total $1,217.50), per dog $100 ($1,117.50), per dog per night $400 ($1,417.50). Stay B $150 x 5, cleaning $75, pet $25 per dog per night, 1 dog, 8.5% tax: pet $125, tax $70.13, total $1,020.13. Stay C $99.99 x 3, tax 7.25%: $299.97, tax $21.75, total $321.72. Add-a-stay works up to three, remove works, cheapest highlight moves correctly.
- **Calculator edge input:** zero, empty, negative (clamped to 0), non-numeric ("abc" cannot be typed or becomes 0) never produced NaN, Infinity or a crash. Nights 0 gives per-night $0.00 (no divide-by-zero). Per-dog with 0 dogs gives $0 pet fee. Huge values display (see NIT 2).
- **Checklist:** 25 boxes; ticking updates "3 of 25 done"; ticks survive reload; Reset clears and stays cleared after reload; corrupt JSON in storage is ignored. Print view hides header, footer, toolbar and breadcrumbs, boxes stay visible, two-column layout is clean.
- **Compare tool:** with no stays (also `?ids=foo,bar`) shows "Nothing to compare yet" with a working calculator link. No crash.
- **Guides (all 16):** FAQ accordions (5-6 items each) open and close by mouse and keyboard. All 19 distinct internal links return 200; no empty or `#` hrefs; no broken in-page anchors; no raw markdown artefacts (`**`, `[1](`, `|---`) in the rendered article. Product buttons ("See it on ...", 22 across 6 guides) all have absolute https hrefs, `target=_blank` and `rel="noopener noreferrer"`. 143 distinct external links were fetched: 126 returned 200, 14 returned 403 (cdc.gov, exploregeorgia.org, gofindoutdoors.org, cpsc.gov and others, probably bot blocking, not verified by a browser), 2 returned 429 (sleepypod.com, gunner.com), and one initially timed out (`sbparksandrec.santabarbaraca.gov/node/9272`) but returned 200 on retry. None returned 404.
- **View-source check (curl):** home, guide, calculator and town pages contain their full text in the server HTML (guide about 4,900 words, one `h1`, JSON-LD, FAQPage schema on guides).
- **JavaScript disabled:** the guide renders in full (1,771 words, all headings, tables, 6 FAQ items that still toggle natively). Calculator inputs show but cannot compute (expected).
- **Robots:** `robots.txt` serves. The privacy policy matches observed behaviour (tools are client-side; checklist uses local storage).

---

## Five worst problems

1. **B1** Guide tables clip content and force sideways scrolling on phones (3 of 16 guides).
2. **B2** `/sitemap.xml` returns an error string, and canonicals and `og:url` are relative.
3. **I1/I2** Slow-3G first load: LCP 27-36 s, about 900 KB of JS, no HTTP compression, and 2400 px hero images (16 files over 300 KB, up to 1.3 MB) sent to phones.
4. **B3** Host-question message is ungrammatical for multi-dog trips ("when them are left", "Can them be left alone"), and **I5** drops the dog details in that case.
5. **I3** Cost calculator crowns a blank, $0 stay as "Lowest total" (together with **I4**, numeric fields that cannot be cleared and keep a leading zero).
