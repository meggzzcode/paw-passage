# External link check: centerforpetsafety.org (2026-11-18)

Brief: the production audit (`docs/recovery/01-production-accessibility.md`, section 5) reported two Center for Pet Safety (CPS) addresses as unreachable from its sandbox: `/sleepypod-atom/` and `/sleepypod-clickit-range/`.

## Result: UNDETERMINED (COULD-NOT-ACCESS), not broken
- One plain request each, from the author's sandbox, to both addresses (plain HTTP/1.1 and default): no answer, curl error "HTTP/2 stream not closed cleanly (PROTOCOL_ERROR)" and status 000. The same happened for `https://centerforpetsafety.org/cps-certified/`, which the guide also cites, so the host as a whole could not be reached from here; that points to the sandbox or CDN, not to those two pages. A fetch through the agent web-fetch tool also returned nothing.
- Per the rules, a transport failure or a bot block (403/429) is never classified as a broken link.
- Web search for the same pages found no CPS page URL. It returned Sleepypod's own pages (https://sleepypod.com/products/atom is the Atom carrier; https://sleepypod.com/collections/car-harnesses lists the harnesses) and press coverage that a Clickit Terrain XL earned a CPS Five Star certification at a 110 lb rating (announced November 2020, per Sleepypod's PR Newswire release). Those are the maker's statements. I found no evidence that a CPS page moved, and no replacement address.

## What the guide links (for the owner to open by hand)
All in `src/content/guides/dog-car-safety-harness-and-crate-guide.ts` (lines 20 to 24, 35 to 41, 237 to 267, 315 to 345 show the CPS citations): `/sleepypod-clickit-range/` (lines 20 and 315) and `/sleepypod-atom/` (line 321). Note the Atom is a carrier, not a harness (the guide already says so).

## NEEDS-YOU
Open both addresses in a normal browser once. If they load: nothing to change. If one shows "not found": search the CPS site's certified list (`https://centerforpetsafety.org/cps-certified/`) for the product, send the corrected address to the person editing that guide (the guide file above is the only one that cites these two), and do not claim a certification the live page does not show.
