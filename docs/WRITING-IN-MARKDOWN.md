# Writing article text (Markdown cheat sheet)

Article text in Pages CMS is plain text with a few simple marks. It looks old-fashioned, but it is deliberate: the "visual" editor was tested and quietly changed some formatting (it turned tick boxes into plain bullets), so articles use the plain editor, which never changes anything you did not type.

You only need the ones below. Copy an existing article's text if unsure.

| To get this | Type this |
|---|---|
| A big heading | `## Heading` (two hashes, a space, then the words) |
| A smaller heading | `### Smaller heading` |
| A new paragraph | Leave one empty line between paragraphs |
| **Bold** | `**bold words**` |
| *Italic* | `*italic words*` |
| A link | `[the words people click](https://example.com)` |
| A source citation | An inline link on the publisher's name in the sentence, for example `[Georgia State Parks](https://the-source-address) allows two dogs per cottage`, and the same source listed in the front-matter `sources`. **No numbered markers** (the old `[[1]](...)` style was removed on 2026-11-24; see `docs/EDITORIAL_STYLE_GUIDE.md`) |
| A bullet list | Start each line with `- ` (dash and a space) |
| A numbered list | Start each line with `1. `, `2. `, `3. ` |
| A tick-box list | `- [ ] not done` and `- [x] done` |
| A quote | Start the line with `> ` |
| A table | See below |

**A table:**

```
| Name | Price per night | Dogs allowed |
| --- | --- | --- |
| Cabin | 120 | 2 |
| Cottage | 90 | 1 |
```

**Rules that avoid problems**
- Leave an empty line before and after a heading, a list and a table.
- Do not type raw web-page code (angle brackets like `<div>`). The site shows it as plain text on purpose.
- Links must start with `https://`.
- After saving, wait about three minutes, then check the live page.
