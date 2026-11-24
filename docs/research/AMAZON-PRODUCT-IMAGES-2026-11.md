# Amazon product images on pawsandpassage.com (research, read 2026-11-24)

Account: tag pawspassage-20, 0 orders, 34 clicks. No code changed.

Method and limits: Amazon pages were NOT blocked (no 503/bot check). All fetches ran through a summarizing
fetch tool that returns short excerpts (about 125 chars each), not full page text. So quotes below are
real excerpts but the surrounding context was not seen by me. Treat the policy text as "excerpts seen",
and have the owner read the full sections (Q8 test steps). Labels: VERIFIED = seen on an official Amazon
page today; SECONDARY = non-Amazon source; UNVERIFIED = not confirmed.

## Short answer
"No way at all" is too strong. The only Amazon-sanctioned route for images is the Creators API
(successor to PA-API 5), and a new account with 0 sales cannot get it today (needs 10 sales in 30 days).
So right now: no sanctioned way to show Amazon-hosted product images. Text links are fine.

## 1. Operating Agreement / Program Policies (IP License)
Sources: https://affiliate-program.amazon.com/help/operating/agreement (page says last updated Oct 15, 2025)
and https://affiliate-program.amazon.com/help/operating/policies (page says last updated Apr 14, 2026). Read 2026-11-24. VERIFIED (excerpts).
- Images may come from API calls only: IP License s.2(b): "You may obtain Product Advertising Content by making calls to Creators API or PA API."
- No storing images: s.2(h): "You will not store or cache Product Advertising Content consisting of an image, but you may store a link" ... "to Product Advertising Content consisting of an image for up to 24 hours." (Excerpt split across two fetch lines; the ellipsis is mine.)
- Other (non-image) API content: may be cached up to 24 hours then must be refreshed. ASINs may be stored indefinitely.
- Link back: s.2(c): "You will link each use of Product Advertising Content to, and only to, the relevant page of an Amazon Site".
- No derivatives: s.2(g): "You will not, and will not attempt to (i) modify, alter, tamper with, repair, or otherwise create derivative works" (rest of clause not seen).
- Price/availability: s.2(i): "You will include a date/time stamp adjacent to your display of pricing or availability information" plus disclaimer "Product prices and availability are accurate as of the date/time indicated and are subject to change." Participation Requirements: prices may show only if Amazon serves the link, or the data comes via the API.
- Third parties: "This license does not include any downloading, copying or other use of Program Content for the benefit of any third party."
- The "24-hour rule" in the official text is the caching/refresh limit (above). I did not see a separate "24-hour price rule" beyond the time stamp + refresh. (The Associates cookie also lasts 24 hours; unrelated.)
- Ambiguity: the policies page also says Program Content "specifically excludes any data, images, text, or other information or content relating to products" (s.2(a)). I read this as: product content is licensed ONLY under the API license, not under the general Operating Agreement. I did not see the full sentence, so this is my inference. SECONDARY-grade reading.
- Nothing I saw gives a license to right-click save, hotlink product-page image URLs, or screenshot. Absence of a grant means no permission. (Inference; the full IP License should be read.)

## 2. Official image routes
- SiteStripe Image / Text+Image: REMOVED. Official Amazon help page (https://affiliate-program.amazon.com/help/topic/stripe) now describes only "Get Link: Text". VERIFIED (current page shows text only). The removal dates (Image and Text+Image gone Dec 1, 2023; links stop working Dec 31, 2023) come from forum quotes of an Amazon email and blogs: SECONDARY. Sources disagree slightly on exact dates. Not available to new or old accounts. Exact embed form: not applicable, feature gone.
- Associates Central link builder / Product Links with images: UNVERIFIED. A few blogs hint at an image option on the product page; the Lasso article (updated Jul 17, 2026) says no such option and says SiteStripe image embeds ended. I could not open Associates Central (signed-in). Owner must check (Q8).
- Widgets: Amazon's Widgets FAQ (https://affiliate-program.amazon.com/help/node/topic/GJV3KJAYNY5BQYPH) VERIFIED: Flash widgets deprecated Dec 15, 2020; no new/edited widgets from Mar 1, 2022; "Widgets will no longer be supported" Apr 1, 2022; existing ones render blank. It points to "Site Stripe, Associates Central link building, Product Advertising API, and feeds".
- ws-na.amazon-adsystem.com ... ID=AsinImage: no Amazon documentation found. SECONDARY (forum posts): legacy widgets/q requests stopped responding. Treat as deprecated and undocumented; even if it still loads, hotlinking an undocumented endpoint is not a sanctioned route. UNVERIFIED whether it still returns an image; do NOT rely on it.
- Native Shopping Ads: SECONDARY blog says discontinued Aug 2023. Amazon help pages for it still exist in search but the current "Tools and Features" page does not list it. Treat as unavailable. UNVERIFIED officially.
- Amazon "Tools and Features" list (https://affiliate-program.amazon.com/help/node/topic/G9HQCQK9E78QUCQX): SiteStripe, Mobile GetLink, OneLink, Product Advertising API, Alexa Skills, Influencer Program, Links. No image embed tool listed. VERIFIED (what the page lists).

## 3. PA-API 5 and Creators API
- Status: https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation VERIFIED: "The Amazon Product Advertising API 5.0 (PA-API 5) has been deprecated and is being replaced by the Creators API." Calls return HTTP 403 AccessDeniedException saying it is deprecated. The page gives NO dates.
- Dates (retire May 15, 2026; migrate by Apr 30, 2026; Offers V1 Jan 31, 2026): SECONDARY (dev.to, techbloat, wordpress.org). Conflicting. Today all are past, so plan on Creators API only.
- Eligibility, VERIFIED (https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction): be enrolled in Associates for the marketplace; "Have at least 10 qualifying sales within the past 30 days to access the PA API through the Creators API"; register for API access in Associates Central; generate credentials. Error page: "The current eligibility criteria is that the account must have made 10 qualified sales in the trailing 30 days." (AssociateNotEligible, 403.)
  -> We have 0 orders: NOT eligible today. "Qualifying sales" is not defined on those pages; whether it means orders or shipped items, and whether per marketplace: UNVERIFIED (SECONDARY says per locale).
- Rate limits, VERIFIED (https://affiliate-program.amazon.com/creatorsapi/docs/en-us/concepts/api-rates): initial "up to a maximum of one request per second (one TPS)", 8640 requests/day; limits rise with shipped revenue (SECONDARY snippet: 1 TPS per $4,320 per 30 days, max 10 TPS).
- If sales stop, VERIFIED: "your account will lose access to Creators API if it has not generated qualified referring sales for a consecutive 30-day period." "You will regain access ... within two days after your referred sales are shipped."
- Returns: images.primary/variants in small/medium/large, size via _SLxxx_ suffix, hosted on m.media-amazon.com; use returned height/width (https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference/resources/images). VERIFIED. Also title, offers/prices, etc. (field list not fully checked).
- Credentials: PA-API keys do not work; new OAuth credentials (Credential ID/Secret) needed. VERIFIED (migration guide).
- Gotcha: sales needed to get images, but images help produce sales. Chicken and egg for a new site.

## 4. Display rules with API data
VERIFIED (policy excerpts, see section 1): link each use to the relevant Amazon page only; no modification or derivative works; no storing or caching images (link may be kept up to 24 h, then refresh); other content refreshed within 24 h; price/availability needs date/time stamp and disclaimer; do not exceed call limits.
So: images must be fetched from Amazon at render time or within 24 h, not uploaded to our server/CDN/repo. Whether proportional resizing via the _SL_ URL suffix is allowed: the Creators docs call it the preferred way to size; Lasso (SECONDARY) says proportional resizing is OK. Cropping, overlays, filters: assume NOT allowed.
Whether hotlinking the Amazon-hosted URL (not copying) is acceptable: yes in the API flow, because that is the delivered form. UNVERIFIED whether the m.media-amazon.com URL may be pasted statically into a page (24 h expiry language suggests no).

## 5. Manufacturer images
- Legitimate in principle, but only with the maker's permission. Default copyright applies. Not a loophole.
- Ruffwear: terms (https://ruffwear.com/pages/terms-of-use, VERIFIED excerpts): "All photos (c) Ruffwear. All rights reserved."; content only "for your own non-commercial use"; "You agree not to modify, copy, translate, broadcast"; no scraping; no license granted. A media library (https://media.ruffwear.com/) exists; download prompts "Please specify the reason for this download" and shows no usage terms I could see. SECONDARY (search snippet): library is for authorized retailers. Contact seen: mediainquiry@ruffwear.com. Affiliates not stated.
- Kurgo: affiliate guide PDF says assets are in an "Affiliate Box File" (SECONDARY snippet; the PDF would not parse for me). Reuse terms UNVERIFIED. Likely requires joining their affiliate program (Kurgo is owned by Radio Systems Corp, same as PetSafe).
- PetSafe (Radio Systems): terms (https://www.petsafe.com/support/policies-and-terms/terms-of-use, VERIFIED excerpts) forbid copying/reproducing/downloading/republishing any portion of the site; Content includes images; permission needs "express prior written consent". No press or affiliate image grant found.
- Sleepypod: media page (https://sleepypod.com/pages/media) says "Download press and media assets for each product below" (VERIFIED) but states no usage terms; footer "(c) 2026 Sleepypod". Press sheets (SECONDARY) mention media/retailer use. Contact on page: contact@sleepypod.com.
- Safe to hot-link or copy maker photos? NO, not without written permission. Hot-linking also hits their servers and can break. Press-page availability is not a license; ask in writing, keep the email.

## 6. Consequences of misuse (VERIFIED, policies page)
- IP License s.1: "The License will immediately and automatically terminate if at any time you do not timely comply."
- Commission Income Statement s.5: "we may take action, including withholding commissions, and/or terminating your participation in the Associates program."
- s.2: qualifying purchases "are disqualified whenever they occur in connection with a violation" of the Program Documents (fee/commission loss).
- Overpayments may be offset against later commissions. Violations are "a material breach".
- Operating Agreement s.6: either side may terminate any time, effective 7 days after notice. With 0 orders there is little to lose in commissions but the account itself (and future eligibility) is at risk.
Amazon did not quote an image-specific penalty I could find.

## 7. Other permitted options
- Our own photos: allowed, but we own no products. Buying products and photographing them is legitimate but costs money.
- Stock/licensed photos (e.g. a paid or CC0 library such as Unsplash/Pexels with terms checked): fine for generic pet/travel imagery, not as product depiction unless it is the real product. Check each license; not researched here.
- Written permission from makers (section 5) or enrolling in a maker's own affiliate program that supplies assets (Kurgo guide suggests this).
- Illustrations, icons, own comparison charts, text-only product cards with a button link: fine.
- Third-party plugins (Lasso, AAWP, Tasty Links, AzonPress) are SECONDARY wrappers around the same Creators API; they still require API eligibility.
- Amazon "embed" from the product page: UNVERIFIED.

## Bottom line
- Can we show Amazon product images today? Not by any route I could verify as sanctioned for an account with 0 sales. VERIFIED that SiteStripe Image/Text+Image are gone (current help page shows text only) and that widgets were retired in 2022. The Creators API is the only documented image source and requires 10 qualifying sales in the last 30 days.
- Route once eligible: Creators API GetItems (images.primary.medium/large), displayed by hotlinking the returned m.media-amazon.com URL, wrapped in our affiliate link, refreshed within 24 hours, no edits, price with date/time stamp and disclaimer.
- Do NOT: save/upload Amazon images to our server, CDN or repo; right-click copy; screenshot; paste product-page image URLs; use ws-na.amazon-adsystem.com AsinImage; crop/edit images; show prices without the time stamp; scrape; copy maker photos without written permission.
- For now: use text links (SiteStripe text works), our own graphics, and request written permission from makers (Ruffwear media inquiry, Sleepypod, Kurgo affiliate assets, PetSafe).
- Still UNVERIFIED (owner test steps, signed in to Associates Central, in a real browser):
  1. Open any product page on amazon.com while signed in; check the SiteStripe bar. Does it offer anything beyond "Get Link: Text" (e.g. an Image option)? Screenshot it.
  2. Associates Central > Product Links > Product Links builder (and Tools menu): search a product; see whether an image/ad-unit embed is offered, and whether the code loads on a test page.
  3. Associates Central > Tools > Creators API (or Product Advertising API): does it let you register? Is there an eligibility banner naming the sales number and window?
  4. Read the full Associates Program IP License (https://affiliate-program.amazon.com/help/operating/policies), sections 2(a)-(k), and confirm the images, caching and "Program Content excludes product content" wording.
  5. Test whether an existing ws-na.amazon-adsystem.com AsinImage URL still loads in a private window. Even if it does, do not ship it.
  6. Ask Associates support (Contact Us) in writing: "Can an account with no qualifying sales display product images in any approved way?" Save the reply.
  7. Email makers for written image permission; save replies.
- Also still unknown: whether "qualifying sales" means ordered or shipped items, and whether sales are counted across marketplaces.
