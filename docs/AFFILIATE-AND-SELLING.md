# What happens to affiliate accounts when a site is sold

Researched 2026-11-17 from search results (broker pages, network help pages, seller guides). Many sources are blogs written by sellers or brokers, so treat them as indicative. Items marked NOT CONFIRMED were not found on an official page.

## What the sources say
- **Amazon Associates:** not transferable. Our own read of Amazon's Operating Agreement (Section 12) bars assignment without written approval (see `AFFILIATE-PROGRAMS.md`). Broker and seller guides agree: the buyer applies for their own account and re-tags every link, and past commission history and any custom rates do not carry over ([FE International](https://www.feinternational.com/blog/how-the-amazon-associates-program-works-and-how-to-transfer-an-amazon-associates-account), [Indie Hackers thread](https://www.indiehackers.com/post/transfer-amazon-associates-account-or-start-a-new-one-aaad216fcc)). A "case study" page claiming transfers lead to instant suspension looked unsourced and is not relied on.
- **Impact:** has a documented path. If the website is sold WITH the account, ownership of the partner account can be transferred (clear payment details first; collect pending payments first). If only the website is sold, brand contracts cannot be moved and the buyer re-applies to each brand ([Impact help](https://help.impact.com/partner/account-management/account-settings/how-can-i-transfer-ownership-of-my-impactcom-partner-account)).
- **Awin:** no page about selling a site was found. Awin support does move account ownership in some cases (it verifies the owner and invites the new person as a user), and closing an account requires the owner's email to match ([Awin support](https://success.awin.com/articles/en_US/Knowledge/How-do-I-close-my-account)). Whether this works for a normal sale is NOT CONFIRMED: ask Awin support.
- **Typical broker practice:** the affiliate account is usually left out of the sale. Listings state the Amazon account is not included and a new owner updates the links (or hires someone to) ([example Flippa listing](https://flippa.com/9786043-1000-month-amazon-affiliate-website-in-the-general-niche)). Sellers prove income with earnings screenshots, recorded video or screen-share, Google Analytics access, and sometimes read-only dashboard access. Brokers cross-check these. Income that cannot be verified is left out of the valuation ([Flippa review](https://organicarbitrage.pages.dev/articles/flippa-review-buyers-2026), [Empire Flippers listing](https://empireflippers.com/listing/90535/)). Payment is commonly through escrow with seller support for a transition period.
- **Not found:** whether a network frees an email address or website after an account is closed, and whether a buyer can be blocked because the site is "already registered" on the seller's account. NOT CONFIRMED.

## What this means for Paws & Passage
1. Plan for the buyer to apply fresh. The site makes that easy: all affiliate links are in one editor file, so the buyer pastes their own links.
2. The seller's value comes from provable earnings. Keep monthly records now: statements downloaded each month, Analytics and Search Console access ready, screen-recording of each dashboard before listing.
3. Keep `hello@` out of any account tied to the seller's tax ID (decided 2026-11-17).
4. Offer the buyer a transition period (for example 30 days of help swapping links and answering questions).
5. If a network offers an ownership transfer (Impact documented; Awin on request), it is optional. It could keep brand approvals but ties the buyer to the seller's account history, so decide at sale time.
6. Do not promise a buyer a transfer. Say in the listing that affiliate accounts are excluded and the buyer applies for their own.

## One account for several sites (owner's plan, 2026-11-17)
Most programs let one account promote several websites (Awin and Impact: add each site as a separate promotional space or property; Amazon: list each site; exact limits NOT CONFIRMED per program). Benefits for a sale: remove only the sold site from the seller's account instead of closing the account. To keep each site's earnings provable: use a separate tracking ID or property per site, download each site's report monthly and file it per site, and never reuse links across sites. Each site is reviewed separately, and a rule breach on one site can put the whole account at risk.

## Expedia Group (Vrbo, Expedia, Hotels.com) program rules that affect this site

Read from the program terms on 2026-11-18 (creator.expediagroup.com affiliate terms; section numbers are from that page and may change, so re-read before relying on them).

- **Privacy policy (9.1.2):** must disclose how you and third parties use cookies and pixels. Covered in the privacy page ("Affiliate links, cookies and tracking").
- **Links (11.1.1, 16.2, 16.3):** use the program link or deeplink exactly as the Hub gives it. Never edit it, add parameters, or send it through a redirect or intermediate page. The site renders the stored URL as it is; keep it that way.
- **Prices (11.3, 16.15.4):** do not show Vrbo or Expedia prices beside prices that are not on the same tax and fee basis. The site shows no Vrbo or Expedia prices. Keep it that way.
- **Coupons (11.4):** show only codes Expedia gives you. The site shows none.
- **Trademarks (12.3, 12.4, 12.6, 12.7, 11.9):** no Expedia Marks in domain names or meta tags, and no bidding on their brand names in paid search. The domain has none. Meta descriptions on the live pages avoid brand names, except the Airbnb vs Vrbo guide's title: see the open question in the Log.
- **Publicity and commission information (17.1, 20.4, 20.5):** no public announcement about the program without written approval, and commission information is confidential. Do not put Expedia commission figures in a public listing, a pitch, or a page. Share them with a buyer only after checking the wording with Expedia.
- **Termination (19.1, 19.2.4, 12.5, 16.19):** either side can end it on 30 days' written notice, and links, marks and Travel Content must then be removed promptly. This is why the account does not transfer in a sale.

### Removing Expedia links (selling the site, or termination)

1. Open the Affiliate links list in Pages CMS (`content/affiliates.yml`) and delete the Vrbo or Expedia entries, or switch them off. With no approved entry, the booking button disappears and product buttons fall back to the maker's page. No code change is needed.
2. Search the articles for `aff:vrbo` and similar inline links and remove them. Inline affiliate links only render when the entry is approved, so step 1 already stops them showing.
3. Remove any Expedia or Vrbo marks the program provided (banners, widgets) if any were added.
4. The buyer applies for their own account and adds their own links.

## Stay22 (read 2026-11-18: stay22.com/terms "Affiliate Partner Terms", last updated 2025-11-11, plus the FAQ and dev docs)

Section numbers come from a summarizing fetch tool, not a verbatim read: read the terms page yourself before signing. Not legal advice.

- **Photos and listing content:** the terms grant only a "revocable, limited, non-exclusive, non-sublicenseable", non-transferable licence to use the Stay22 solution (the map widget and links) during the term (section 2(a)). They do not say we may copy, download, store or host listing photos or data outside the widget, and third-party content is governed by the providers' own terms (sections 1(26), 4(a)); all rights not granted are reserved (section 7(a)). So: do not download or host Stay22 or listing photos. A photo on our own pages needs the host's written permission. The widget itself shows its photos inside Stay22's frame, which is within the licence.
- **Pet filter:** none in the docs or FAQ; the widget cannot filter for dogs. Our map panel says so.
- **Commission:** FAQ says the split "starts at 30%"; the actual rate is in the Order Form (section 5(a)), visible only after signup. Cookie windows are not in the terms ("mapped during setup"). Payouts monthly after the stay is complete; fees are calculated from Stay22's records; fees are forfeited if Stay22 terminates for breach.
- **Disclosure:** the terms say we are responsible for all required notices and consents (section 8(c)) and give no wording. Our map panel and the affiliate disclosure and privacy pages cover it.
- **Selling the site:** the agreement cannot be assigned or transferred without Stay22's written consent (section 13(i)), and the licence is non-transferable. A buyer must sign up themselves or get Stay22's consent. Add this to the handover steps; our accounts are already excluded from sale.
- **Other programs:** the FAQ says Stay22 is designed to work alongside other affiliate programs.
- **Exit:** remove the Stay22 account ID in Site settings (the map disappears); on termination we must stop using the solution immediately (section 12(c)).

## Transferability by program (read 2026-11-18; details in `docs/AFFILIATE-APPLICATION-PACK.md`)

- **Amazon Associates:** Operating Agreement s12 bars assignment without Amazon's prior written approval (read 2026-11-18). Buyer applies fresh and has its own 3-sales-in-180-days clock.
- **Impact:** help article confirms two paths. Site-only sale: buyer adds the site to their own account, verifies it and reapplies to each brand (brand contracts "cannot be sold as is"). Account sale: invite the buyer as admin, remove legacy users, buyer enters their own payment and tax details; clear bank details first and collect pending payments first.
- **Awin:** FAQ says several sites can sit under one account and transfers go through Publisher Success; no official page on selling a site, so ask and assume the buyer reapplies.
- **Ascend, AvantLink, BringFido:** transfer terms not read (pages blocked or not opened): UNCONFIRMED; assume the buyer applies. BringFido's agreement is reported to allow revocation at any time (search summary).
- Reminder for any application text: do not name Expedia Group or commission figures to third parties; the program terms make commission information confidential.
