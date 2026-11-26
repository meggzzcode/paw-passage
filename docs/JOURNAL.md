# The Adventure Journal

"The Adventure Journal" is the site's article section (`/journal`): ten original, useful articles that answer what dog owners search for and lead gently to a free personalized adventure. It is linked from the footer only, not from the four main menu items.

## For the owner: editing without code

Everything is edited in Pages CMS under **Journal**. Each article is one file in `content/journal/`.

**Edit an article**

1. Open Pages CMS, choose **Journal**, click the article.
2. Change the text in "Article text". Keep paragraphs short (two to four sentences).
3. If you change the advice (not just a typo), set "Last meaningfully updated" to today's date. Search engines and the sitemap use this date. Do not change "First published".
4. Save. The site rebuilds and publishes in a few minutes.

**Add or change a picture**

- Each article's picture lives in `public/journal/<slug>.webp` and is named in the "Picture path" field. To replace one, upload a new picture (WebP or JPG, wide 16:9, under 60 KB; original or properly licensed only, and record the source in `docs/IMAGE-CREDITS.md`) to `public/journal`, then set "Picture path" to it.
- Always fill in "Describe the picture" in one plain sentence.

**What not to touch**

- "Web address ending" (slug): changing it breaks links and search rankings. It must match the file name.
- The "Starting point for the quiz" choices and "Collection to link": only pick from the lists/real collections; a wrong collection name stops the site from building (this is intended: you will see a clear message).
- Do not paste raw HTML, tracking codes or `?utm_` links into articles. Do not add medical or behavior promises, made-up statistics, reviews or expert quotes. Do not add the paid adventure steps.
- The product paragraph inside each article is written for that article's reader. Do not reuse one paragraph across articles.

## Publishing checklist

1. Title is unique, under about 60 characters; description is 155 characters or fewer and unique.
2. Dates are real (`YYYY-MM-DD`).
3. One main idea, direct answer near the top, 4 to 7 practical ideas, a note that every dog is different, 400 to 650 words.
4. Exactly one or two links toward the product; $19.99 one-time and "one personalized adventure free" stated accurately; never implies the reader must buy.
5. Sources list only pages actually read.
6. `related` names two other real article slugs; `collection` is a real collection; the picture exists and has alt text.
7. After the deploy: open the article, check the hero, the CTA (it should go to `/discover?ctx=...` and show "Starting from: ..."), and view source for the canonical link and BlogPosting data.
8. Submit `/sitemap.xml` in Search Console (once) and use URL Inspection for new articles.

## How it works (for developers)

- Build: `plugins/content.ts` reads `content/journal/*.md` into the `virtual:journal` module, validated by `src/lib/journal-schema.ts` (bad files fail the build with a message naming file and field; broken related/collection/image references fail production builds).
- Routes: `src/routes/journal.index.tsx`, `src/routes/journal.$slug.tsx`; components in `src/components/journal/`; Markdown is rendered with raw HTML escaped (`src/lib/journal-markdown.ts`).
- SEO: unique title/description, self canonical, OG/Twitter, `BlogPosting` JSON-LD (author and publisher are the Organization Paws & Passage; real `datePublished`/`dateModified`), BreadcrumbList, sitemap entries with `lastmod` (`src/lib/sitemap-entries.ts`). `/discover?ctx=...` and `?mode=...` are `noindex` and canonicalize to `/discover`.
- Hero images: `node scripts/journal/make-heroes.mjs` redraws the ten original illustrations (offline, Playwright + Pillow). They are art cards, not photos.
- Public previews on an article use only the allowlisted preview fields, filtered by the article's collection (`usePreviews`).
- Tests: `src/test/journal.test.tsx` (fixtures in `src/test/fixtures/journal/`, never in `content/`).

## Contextual discovery (`?ctx=`)

`src/passport/journal-context.ts` exports `ctxPresets` (keys at-home, rainy-day, weekend, doggy-date, no-spend, bond, puppy, senior, family, high-energy) with `{ label, answers }`. Unknown values are ignored. No personal data is ever put in a URL. Entitled customers see the preset as ordinary, removable session filters in Browse; the saved profile and the engine's hard suitability rules are never overwritten, and a preset never grants extra free adventures. The free quiz shows the "Starting from" chip; pre-selecting quiz answers is done by the quiz (`ctxPresets[ctx].answers`).

## Analytics and campaign attribution

Events (names only; the article slug is sent as `source`): `journal_article_view`, `journal_cta_click`, `journal_collection_click`, `journal_related_click`, `journal_preview_click`.
`src/lib/campaign.ts` keeps the first landing URL's `utm_source`, `utm_medium` and `utm_campaign` (lowercased, `a-z0-9_-`, 40 characters max) in `sessionStorage` and adds them to `purchase_cta_clicked` and `checkout_started` only. Internal links never carry utm.

Limits, plainly: attribution lasts for that browser tab session; a visitor who returns later, switches device or opens Gumroad in another browser is not attributed; the confirmed purchase happens on Gumroad and is not tied to the campaign here; blockers and a missing GA4 ID drop it. Treat it as a directional signal, not proof of sales.

## Redirects review

Old-site addresses are retired with 410 (see `netlify.toml`), deliberately never redirected to the home page. Candidates considered for an equivalent Journal redirect and why none was added:

- `/guides/puppy-at-a-vacation-rental`, `/guides/vacation-rental-with-a-senior-dog`: about rentals, not the puppy/senior activity articles; a redirect would mislead. Kept 410.
- `/tools/*`, `/dog-rules*`, `/stays*`, `/destinations*`: no equivalent page.
- The former landing pages `/doggy-date-ideas`, `/puppy-bucket-list`, `/free-things-to-do-with-your-dog`, `/indoor-dog-adventures`, `/senior-dog-adventures` and `/weekend-adventure-finder` were removed and 301 to the matching Journal article (`netlify.toml`; with `/tools` and three retired gear guides these make the ten forced 301s that the tests pin). Only the broad hub `/things-to-do-with-your-dog` remains; it links to all ten articles.
  If old backlinks to a specific retired guide are later found in Search Console, add a one-to-one redirect to the closest article in `netlify.toml` ahead of the 410 rules.
