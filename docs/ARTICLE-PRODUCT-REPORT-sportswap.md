# Report: sportswap (2026-11-19)

## Task A: Clickit Sport replaces Sport Plus
- CPS listing read (centerforpetsafety.org/sleepypod-clickit-sport/): passed, 5 Star, tested July 2014, CPS-001-014.01, test dogs Small 25 lb, Medium 45-90, Large 75-90, X-Large to 90; M/L/XL inspected as identical.
- Maker page NOT readable: sleepypod.com/products/clickit-sport returns 404 (and with www). Sleepypod's collection shows only the Sport Plus. No maker specs were guessed; the catalog record states this.
- content/products.yml: new active record sleepypod-clickit-sport (specSource = CPS listing; manufacturerUrl sleepypod.com). Summary avoids "star" (tests forbid star/rating wording in catalog text).
- content/affiliates.yml: sleepypod-clickit-sport added (B08JQQF9YX, approved true, notes as instructed). Sport Plus entries left retired.
- Rewritten: dog-car-safety-harness-and-crate-guide.ts (pick, gear, relatedProducts, FAQ, table, bullet, what-to-buy-first, gapsFound), two-large-dogs-in-one-car.md (table row, harness paragraph, sources), src/lib/packing.ts.

## Task B: Backseat Bridge removed
- protect-your-car-interior...: bridge pick, relatedProducts, source, table row and prose removed; section now a generic gap-between-seats paragraph with no product and no recommendation; added kurgo-heather-booster-seat as the fourth pick (existing booster paragraph). Citations renumbered.
- two-large-dogs-in-one-car: bridge sentence, source and arithmetic removed; citations renumbered.
- Repo grep: no remaining sport-plus or bridge ids in content/src outside the retired catalog and affiliate records.

## For the lead
- sleepypod-clickit-sport has no pick in two-large-dogs (4 picks already); it is prose only there. Owner must verify the Amazon ASIN B08JQQF9YX (buy box, weight range, that it is the Sport and which sizes).
- Guide prose still cites the Sport Plus maker page [9] in the harness guide for the non-Sleepypod accessories warning only.

## Verify
bunx tsc --noEmit clean; bunx vitest run 486 passed.
