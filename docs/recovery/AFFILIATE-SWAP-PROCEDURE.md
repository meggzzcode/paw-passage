# Affiliate swap procedure: replace IDs or connect your own accounts

Written 2026-11-18. For a buyer or owner who wants to change which affiliate program or tracking ID the product links use. No code change is needed. The rules below are enforced by tests (src/test/gear-products.test.ts, src/test/gear-hub.test.tsx) and by the build.

## How product links work

- **One place for every affiliate URL: `content/affiliates.yml`** (Pages CMS: "Affiliate links"). Each entry has `id`, `network`, `url`, `approved`, `kind` and optional `notes`. The tracking ID lives inside the `url` (for example the `tag=` part of an Amazon link or the code in a network deep link).
- **A product record never contains an affiliate URL or a raw tracking ID.** `content/products.yml` has two reference fields:
  - `affiliateProgram`: the `id` of an affiliates.yml entry that stands for the program (its `network` names the program).
  - `affiliateTrackingId`: the `id` of the affiliates.yml entry that holds this product's tracked link. Several products may name the same entry.
  Both stay EMPTY until an approved `kind: product` entry exists. A `kind: stay` entry can never be used by a product: the build stops with an error.
- **Which link a product shows** (src/content/gear-links.ts `resolveProductLink`): approved affiliate entry, else the manufacturer page, else a plain retailer page, else nothing. An affiliate button is labelled "Affiliate link", uses `rel="sponsored nofollow noopener"`, and the disclosure line appears automatically on any page that shows one.
- A product with both fields empty uses a link only if an affiliates.yml entry has exactly the product's own `id` (the older convention). Prefer the explicit fields.

## Procedure A: change the ID or URL for links that already exist (central swap)

1. Open `content/affiliates.yml` (or CMS: Affiliate links).
2. Find the entry the products name (search products.yml for its `id` in `affiliateTrackingId`).
3. Replace `url` with the new tracked link from your own account. Update `network` if the program changes. Keep `id` unchanged: every product points at the `id`, so every product link updates at once.
4. Keep `approved: true` only if that account has approved you for the program. Set `approved: false` to switch every product back to its manufacturer page instantly (no other edit needed).
5. Check: run `bun run test` (the "affiliate swap procedure" tests must pass), then open /gear and any category page and hover a button: it should show your new URL.

Example (hypothetical: this entry does not exist in the repo). Products `kurgo-splash-free-wander-bowl` and `kurgo-mud-dog-travel-shower` both name `affiliateTrackingId: kurgo-network`:

```yaml
# content/affiliates.yml  (before)
- id: kurgo-network
  network: Example Network
  url: https://example-network.test/r?id=OLD-ACCOUNT&u=https%3A%2F%2Fwww.kurgo.com%2F
  approved: true
  kind: product
# after: only this entry changes
- id: kurgo-network
  network: Another Network
  url: https://another-network.test/go/NEW-ACCOUNT?u=https%3A%2F%2Fwww.kurgo.com%2F
  approved: true
  kind: product
```

Both products now link through the new account. The two URLs above are placeholders: they are NOT real affiliate links and must not be published.

## Procedure B: connect a new affiliate account for a product that has no affiliate link yet

1. Get approved in the program. Do not add an entry before approval.
2. Add an entry in affiliates.yml: a new unique `id`, the `network` name, the full tracked `url`, `approved: true`, `kind: product`.
3. In products.yml (or CMS: Products) set `affiliateProgram` and `affiliateTrackingId` to that entry's `id` for each product it covers.
4. Check that the disclosure wording on /affiliate-disclosure matches the program's rules (network-specific wording is not confirmed in this repo).
5. Run the tests and the build. The build fails with a clear message if a name does not exist or points at a stay link.

## Procedure C: remove every affiliate link

Set `approved: false` on the entries (or delete them). Product buttons fall back to the manufacturer pages. Remove the names from the products only if you delete an entry (the build refuses names that do not exist).

## What the tests prove

- Changing one entry changes every product that names it and no other product.
- Un-approving an entry returns those products to a plain maker link with `rel="nofollow noopener"`.
- A stay link is never used for a product.
- A product record with a price, rating or commission key, or a tracked link without a program, is rejected.
