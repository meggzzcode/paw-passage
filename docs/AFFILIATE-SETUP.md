# Affiliate links: how they work and how to add them

*No affiliate account has been opened yet, so no affiliate link is live. The site is ready for them. Everything here is switched on only by approved links.*

## The rule

A link to a product or a place to book appears on the site **only if** it is listed under **Affiliate links** in Pages CMS **and** its **Approved** box is ticked. Tick it only after the company has approved your account. An unapproved link shows nothing at all, so the site never shows a link you are not allowed to use.

## Three places a link can appear

1. **Product picks in the gear articles (27 products).** Add a link whose **short name is the product's id** (for example `kurgo-heather-hammock`). The "See it at..." button then appears under that product automatically. The ids are in `docs/affiliate-link-worksheet.csv`.
2. **Inside an article's text.** Write the link as `[the words people click](aff:short-name)`. Example: `[Heather Hammock](aff:kurgo-heather-hammock)`. If the link is approved it becomes a link that opens in a new tab; if not, only the words show.
3. **A "Book" button on a stay.** In the stay form, put the link's short name in **Booking link**. The button shows only for **Verified** stays whose link is approved.

## What the site does for you

- Adds `sponsored` and `nofollow` to every affiliate link, so search engines know they are paid links.
- Adds a notice at the top of any article that really has an approved link: *"This article contains affiliate links... we may earn a commission at no extra cost to you..."* with a link to the disclosure page. It does not appear on articles without links.
- Adds Amazon's required sentence (*"As an Amazon Associate we earn from qualifying purchases."*) whenever an Amazon link is on the page.
- Records a click event in Google Analytics (once you add your analytics ID), so you can see which links are used.
- Refuses to publish if an article uses a link name that does not exist (it stops the update with a message naming the article, so a typo can never create a dead link).
- Never shows prices or star ratings. The articles do not say the products were tested.

## Adding links, the easy way (a spreadsheet)

1. Open `docs/affiliate-link-worksheet.csv` in a spreadsheet. It has one row per product.
2. For each product you have a link for, fill in **network** (for example "Amazon Associates"), **affiliate_url** (the full link, starting with `https://`) and **approved** (`yes` only when the company has approved you; otherwise `no`).
3. Save it as CSV. A developer (or Claude) runs `bun scripts/import-affiliate-links.ts docs/affiliate-link-worksheet.csv`. It checks every row, explains any mistake in plain words, and updates the links list. Nothing is changed if any row has a problem.

You can also add links one at a time in Pages CMS (Affiliate links > add).

## Before you apply to any program

- The site must be live on your own domain, with the **affiliate disclosure**, **privacy** and **contact** pages (they exist, but they are drafts that need a lawyer's review).
- Most programs want a working business email address.
- Read each program's rules. The research notes are in `docs/AFFILIATE-PROGRAMS.md` (which programs exist for each product, and what they require).
- **Amazon Associates accounts belong to the person who opened them**, and Amazon's rules normally do not allow handing one to a buyer. A buyer should expect to open their own account and replace every Amazon link (see `docs/AFFILIATE-PROGRAMS.md`).

## Where each article could carry links

`docs/AFFILIATE-OPPORTUNITIES.md` lists, article by article, where a link would genuinely help a reader, which sentences to leave alone, and which gear articles the other articles should link to. Nothing has been added to any article yet: you approve each change first.
