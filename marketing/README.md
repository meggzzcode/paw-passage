# Marketing assets

## Owner package

`node marketing/build-owner-package.mjs --out <folder outside the repository> [--skip-render] [--site https://real-domain] [--zip]` builds the owner package in exactly six sections: 01 Business Overview, 02 Website and Operations, 03 Product Assets, 04 Marketing, 05 Financial Performance (empty Sheet-ready template), 06 Transfer and Recovery. It refuses to write inside the repository, reads no secrets or premium text, and clears the output folder first so no stale files remain. Photo and example images are listed in 03 with the credits from `docs/IMAGE-CREDITS.md`; nothing is marked pending.

Owner instructions for the Pinterest pin system. Plan and rationale: docs/MARKETING.md.

## What is here

- `pins/pins.json`: 30 pins. Each has a headline, a destination path, and a pin title and description written as plain prose (no hashtags). Public file: generic ideas only.
- `pins/article-pins.json`: 30 Journal pins, three for each of the ten Adventure Journal articles (a practical question, a lifestyle benefit, a discovery message). Destinations are `/journal/<slug>` with UTM parameters already attached.
- `pins/templates/`: six HTML layouts (poster, stamp, postcard, magazine, passport, ticket), `_base.css` (brand tokens from `src/design/passport.css`) and original SVG art in `motifs/`.
- `pins/generate.mjs`: renders PNGs with Playwright and a local Chromium. Offline: no network, fonts come from `public/fonts/`.

## Messaging

All pin copy follows the owner-approved lines in docs/MARKETING.md section 0. Rotate the signature phrases (optional `tag` field, shown on poster, postcard and ticket layouts); no phrase on more than about one pin in four. Say "100+" or "Over a hundred", never another count. Keep gifting out until the owner has verified it. Pin images are not regenerated with copy edits: re-render pins after the design integration lands.

## Render the pins

```
node marketing/pins/generate.mjs
```

Output goes to ``paws-passage-export/pins/` next to the repository folder` (1000 by 1500 PNG). The script refuses to write inside the repository, so generated images are never committed. Options: `--set article` (render the Journal pins into ``paws-passage-export/pins/article/` next to the repository folder (never inside it)`), `--out DIR`, `--only pin-id`, `--help`. If Chromium is not found, set `CHROME_PATH` to a Chrome or Chromium binary. Playwright is looked up in the project first, then in the shared tools location.

## Render the Journal pins

```
node marketing/pins/generate.mjs --set article
```

Output: 30 PNGs (1000 by 1500) in ``paws-passage-export/pins/article/` next to the repository folder (never inside it)`, named `<slug>-<n>.png`. Never inside the repository.

## Post a pin (about 30 minutes a week)

1. Pick 5 pins from `pins.json`, favoring the current season (see docs/MARKETING.md).
2. On Pinterest upload the PNG, paste `title` and `description`, and set the link to your site plus the pin's `destination`.
3. Add pins to a board per theme.
4. Note outbound clicks after a few weeks; retire the weakest pins.

## Edit or add a pin

Add an object to `pins.json` (optional `tag`: one approved signature phrase, or leave it out). `template` is one of poster, stamp, postcard, magazine, passport, ticket. `motif` is a file name in `templates/motifs/`. `palette` is red, pine, ink or ochre. Journal pins go in `article-pins.json`: the destination is `/journal/<slug>?utm_source=pinterest&utm_medium=social&utm_campaign=<slug>-<n>`, the headline is at most 60 characters, the title at most 100 and the description at most 300 (checked by `src/test/pins-article.test.ts`). For `pins.json`, the destination must be an existing page: /things-to-do-with-your-dog (the hub), a `/journal/<slug>` article with the same UTM style, or /discover. The old landing pages were removed and now redirect to Journal articles.

## Rules

No hashtags, no suggested customer captions, no "forever" or perpetual-update promises, no implied free keepsake editor, no AI imagery presented as real customers, no premium adventure text, no deadlines or fake discounts, no claim that restricted content is free, and no medical claims.
