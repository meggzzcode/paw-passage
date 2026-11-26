# Marketing assets

Owner instructions for the Pinterest pin system. Plan and rationale: docs/MARKETING.md.

## What is here

- `pins/pins.json`: 30 pins. Each has a headline, a destination path, and a pin title and description written as plain prose (no hashtags). Public file: generic ideas only.
- `pins/templates/`: six HTML layouts (poster, stamp, postcard, magazine, passport, ticket), `_base.css` (brand tokens from `src/design/passport.css`) and original SVG art in `motifs/`.
- `pins/generate.mjs`: renders PNGs with Playwright and a local Chromium. Offline: no network, fonts come from `public/fonts/`.

## Render the pins

```
node marketing/pins/generate.mjs
```

Output goes to `/home/user/premium-content/export/pins/` (1000 by 1500 PNG). The script refuses to write inside the repository, so generated images are never committed. Options: `--out DIR`, `--only pin-id`. If Chromium is not found, set `CHROME_PATH` to a Chrome or Chromium binary. Playwright is looked up in the project first, then in the shared tools location.

## Post a pin (about 30 minutes a week)

1. Pick 5 pins from `pins.json`, favoring the current season (see docs/MARKETING.md).
2. On Pinterest upload the PNG, paste `title` and `description`, and set the link to your site plus the pin's `destination`.
3. Add pins to a board per theme.
4. Note outbound clicks after a few weeks; retire the weakest pins.

## Edit or add a pin

Add an object to `pins.json`. `template` is one of poster, stamp, postcard, magazine, passport, ticket. `motif` is a file name in `templates/motifs/`. `palette` is red, pine, ink or ochre. Destination must be one of the existing pages: /things-to-do-with-your-dog, /indoor-dog-adventures, /doggy-date-ideas, /puppy-bucket-list, /senior-dog-adventures, /free-things-to-do-with-your-dog, /weekend-adventure-finder, /discover.

## Rules

No hashtags, no suggested customer captions, no premium adventure text, no deadlines or fake discounts, no claim that restricted content is free, and no medical claims.
