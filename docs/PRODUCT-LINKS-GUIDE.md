# Product links guide: how a product earns, why 9 were switched off, how to change it

Last updated 2026-11-19.

## 1. How a product earns on this site
1. A product record lives in `content/products.yml` (facts, specs, sources; no prices, ratings or affiliate URLs).
2. Its money link lives in `content/affiliates.yml`, in one entry whose `id` equals the product id. Amazon entries use `https://www.amazon.com/dp/<ASIN>?tag={amazonTrackingId}`; the tag (`pawspassage-20`) is filled in from `content/settings.yml`.
3. The link only counts when the entry has `approved: true`. If it is missing or `approved: false`, the product "does not earn".
4. A product that does not earn never gets a pick card or a gear block in an article (owner rule: only call out what we can monetize). It still appears nowhere else either once retired.
5. The owner rule since 2026-11-19: every active catalog product must earn and must appear in at least one article. A product that cannot earn is retired (`active: false` in products.yml), which hides it everywhere.

## 2. Why 9 links were switched off on 2026-11-18
The owner checked all 37 wired Amazon links in a signed-in browser. For nine of them the Amazon page showed no seller or price ("Currently unavailable" or "No buy box"). A button to a page that cannot be bought from sends a reader nowhere, so we set `approved: false` instead of leaving them live. Nothing was wrong with the products or the links themselves. The nine: Sleepypod Clickit Range, Gunner G1 Intermediate, Adventure Medical Kits Me & My Dog, Kurgo Dog First Aid Kit, Baskerville Ultra Muzzle, Kurgo Collaps-A-Bowl, North States Petyard Passage, MidWest LifeStages 36" crate, KONG bench seat cover XL.

What happened to each (2026-11-19):
| Product | Outcome |
|---|---|
| Sleepypod Clickit Range | Retired. Replaced by Sleepypod Clickit Sport Plus (new record). |
| Gunner G1 | Retired. Replaced in the guides by the Lucky Duck Lucky Kennel, also Center for Pet Safety certified. |
| Kurgo Collaps-A-Bowl | Kept, link moved to the Barn Red listing. |
| AMK Me & My Dog, Kurgo first aid kit, Baskerville muzzle, North States Petyard Passage, LifeStages crate, KONG hammock | Retired. No in-stock listing of the same product was found. |

Stock is not tracked on the site (owner decision: it is one more thing to maintain). If a link later turns out to be dead, the Amazon sentence on the page is unaffected; see section 4 to fix it.

## 3. Adding a product
1. Read the maker's own page and write the record in `content/products.yml` following a neighbouring record (specSource, keySpecs, what is a maker claim).
2. Find the Amazon listing. Use the Amazon page title, brand and model to confirm it is the same product. In Site Stripe, "Get Link" gives the short link; the full `https://www.amazon.com/dp/<ASIN>?tag=pawspassage-20` link earns the same.
3. Add the entry to `content/affiliates.yml` with a note (ASIN, variant, date checked).
4. Add the product to at least one guide: put its id in the guide's `relatedProducts` (max 4) and, where it answers the paragraph, a `{{pick:product-id|Label|Why we picked it|source URL}}` line. See `docs/ARTICLE-PRODUCT-BRIEF.md`.
5. Run `bunx tsc --noEmit` and `bunx vitest run`. Merge to main to publish.

## 4. Switching a link off or on, retiring a product
- Off: set `approved: false` on its entry. Cards for that product disappear and the surrounding prose still reads.
- On: set it back to `true`.
- Retire: set `active: false` on the product record, remove it from guides' `relatedProducts` and prose. Tests fail if a guide still points at a product that no longer exists.
- Wrong product behind a link: replace the ASIN in the entry's `url` and update the note.

## 5. Monthly upkeep (15 minutes)
Open each Amazon link from the live site once a month. Anything that is dead or the wrong item: section 4. Amazon earnings only count for qualifying sales after clicks from your tagged links; keep the Operating Agreement text (Amazon Associate statement) on pages that carry cards.
