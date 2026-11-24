# How to add, edit, hide and delete stays and affiliate links

Written 2026-11-24 for the buyer of Paws & Passage. Everything below is plain files in the GitHub repo. There is no database. You can edit them in Pages CMS (a form-based editor) or directly on GitHub. Each change is saved as a commit, and the site picks it up on the next deploy.

**Honest status:** the Pages CMS settings (`.pages.yml`) were written from its documentation and have not yet been opened in the live Pages CMS app (see `BUYER_HANDOVER.md`, "First-time CMS test"). If the form misbehaves, the GitHub route below always works.

## The one rule to know

A stay appears on the site only if it has an **approved affiliate link**. The site finds the link by itself: it takes the number from the stay's Vrbo address (`sourceUrl: https://www.vrbo.com/1297670`) and looks for a link named `vrbo-1297670`. The stay file does not need the link in it.

| Stay file | Link in Affiliate links | Result |
|---|---|---|
| present | `vrbo-<number>` and Approved ticked | Listed, with a Book button |
| present | missing, or Approved unticked | Hidden everywhere (pages, filters, sitemap). Comes back by itself once the link is approved |
| missing | present | Nothing shows. The link sits unused |

## Add a stay

1. In Vrbo (or your creator hub's Link builder) make an affiliate link for the listing. Short links look like `https://vrbo.com/affiliate/AbCdEf1`.
2. Pages CMS, **Affiliate links**: add a row. Short name `vrbo-<listing number>`, Company `Vrbo`, your link, Used for `A place to stay`, tick **Approved**.
3. Pages CMS, **Stays**: add an entry. Fill the required boxes (name, type, state, town, one-line summary, description) and **Where the facts came from** = the Vrbo address `https://www.vrbo.com/<listing number>`. Leave Status on **Unverified**: the site then shows a "Not yet verified" label.
4. Only enter what the listing actually states. Leave "not confirmed" where it does not say. Write the description in your own words.

On GitHub instead: copy any file in `content/stays/`, rename it (lowercase words with hyphens, ending `.yml`) and change the fields. The file name becomes the page address.

## Edit a stay or a link

- Stay: open it in **Stays**, change the box, save. The page address stays the same unless you rename the file.
- Link: open **Affiliate links**, change the `url` on that row, save.
- Never change a link's short name unless the listing number also changed. The short name is how the site matches link to stay.

## Hide a stay (keep it, don't show it)

Untick **Approved** on its row in **Affiliate links**. Tick it again to bring the stay back. Nothing else changes.

## Delete a stay

1. Delete its file in **Stays**.
2. Delete its row in **Affiliate links** (otherwise it sits unused; it is harmless).

## Use your own Vrbo account (important for a buyer)

The links on the site earn for the seller's Vrbo/Expedia creator account. To earn for yourself you must replace every `vrbo.com/affiliate/...` link with one made in your own account, and your account must be approved by Expedia Group. `AUDIT-stays-and-links.csv` lists every stay with its listing number and current link, so you can work down it: make the link for the listing, paste it into that row.

## Check your work

- The audit table (`AUDIT-stays-and-links.csv`) shows, per stay file, whether the site will show it. Rebuild it any time you add or remove stays.
- Run the tests (`npm test`). They check the stay and link files. One test (`stay-indexing`) needs a longer time limit once the site has more than about 60 stays; a ready patch is in `test-timeout.patch` here.
- Look at the preview deploy before you publish. Builds were switched off on 2026-11-24 and stay off until the owner or buyer turns them on.

## Good to know

- New stays here are **noindex** until each has at least 5 of 6 content sections and a unique description (the site's quality rule). Adding check-in times, access notes or guest-review notes helps.
- A town page exists only for the eight towns in `src/content/destinations.ts` (a code file). Stays in other towns still get their own page.
- Pet-fee amounts were not recorded for the 2026-11-24 batch. Those stays say "check the Vrbo listing before booking".
- Never put photos from a Vrbo listing on the site without the owner's written permission.
