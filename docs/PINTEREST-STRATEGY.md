# Pinterest strategy (evergreen)

Written 2026-11-18. Goal: a free, steady, honest traffic channel to the guides and tools. Cost: $0 (no paid scheduler, no ads, no paid tools). Setup steps and the pin list live in docs/PINTEREST-SETUP.md; this file is the reasoning and the rules.

## Sources and what was actually read

Labels: READ means the page was opened on 2026-11-18 and the point below comes from it. SUSPECTED means it is common advice or from memory and was not confirmed on an official page.

| Source | URL | Date read |
|---|---|---|
| Pinterest Community Guidelines | https://policy.pinterest.com/en/community-guidelines | 2026-11-18 READ |
| Pinterest Help: Rich Pins | https://help.pinterest.com/en/business/article/rich-pins | 2026-11-18 READ |
| Pinterest Help: Claim your website | https://help.pinterest.com/en/business/article/claim-your-website | 2026-11-18 READ |
| Pinterest Help: Schedule Pins | https://help.pinterest.com/en/business/article/schedule-pins | 2026-11-18 READ |
| Pinterest Help: Analytics | https://help.pinterest.com/en/business/article/pinterest-analytics | 2026-11-18 READ |
| Commercial and branded content guidelines | https://policy.pinterest.com/en/commercial-and-branded-content-guidelines | read earlier the same day for docs/recovery/09 (affiliate wording below comes from that report) |
| Pinterest business best practices / creator hub pages | business.pinterest.com (two URLs tried) | NOT READ: both returned 404. Everything below marked SUSPECTED about image format, keywords and frequency was not confirmed on an official page. Re-check with a working link before relying on it. |

## What Pinterest's own pages say (READ)

- Spam: coordinated or automated activity meant to manipulate or flood is prohibited, and "repetitive, irrelevant, or unsolicited" posting is not allowed. Only automation Pinterest has approved is allowed (so no third-party auto-posters; use native scheduling).
- Misleading content: pins must not trick people into engaging; exaggerated claims, unrealistic promises and misleading pricing are prohibited; stuffing irrelevant keywords to influence distribution is not allowed.
- Authenticity: content should be "authentic, helpful, and provide meaningful value"; buying or selling engagement or generating inauthentic traffic is prohibited.
- Links: the linked site should have original content that adds unique value, and a "no surprises" principle applies (people should be able to expect where a link goes). Abused link shorteners may be blocked. Our destinations are the guide pages themselves, with UTM parameters, and no shortened links.
- Money-making content must not be repetitive, deceptive or irrelevant. The affiliate wording (transparency, moderation, no repetitive large-volume affiliate pins) is from the commercial guidelines as quoted in docs/recovery/09. We link pins only to our own pages, which carry the disclosure.
- Scheduling: native, up to 30 days ahead, at most 10 pins scheduled at a time; the image cannot be changed after scheduling.
- Claiming: Settings > Link to Pinterest > Claim; HTML tag, HTML file, DNS TXT record (or Merchant Center for some accounts); one account per website; the tag can be removed after verification. Claiming shows how often content from the site is saved and attaches our profile to pins saved from the site.
- Rich Pins (article): the page must be an article; Open Graph needs og:title, og:description and og:type=article. Syncing can take up to 24 hours. Pinterest's page did not mention a validator.
- Analytics: impressions, saves, outbound clicks and engagements.

## Our site against the Rich Pins requirements

- og:title, og:description, og:type are set on every page by pageHead (src/lib/seo.ts); guide pages pass type "article" (src/routes/guides.$slug.tsx). VERIFIED in code. og:site_name and og:image are also set.
- Whether Pinterest's own tooling actually turns on Rich Pins for our site is NOT CONFIRMED: needs the claimed account after deploy. The Cowork prompt asks it to report whether validation is offered. The earlier concern about a missing person author (docs/recovery/09 line 8) does not apply to the Open Graph option as described on the help page read today, and the Article JSON-LD names the organization as author. Rich Pins are optional; the strategy does not depend on them.

## Strategy

1. Audience and intent. People planning a trip with a dog search on Pinterest weeks ahead. Our pins answer one planning question each (pet fees, dog limits, fences, cabin packing). Keep that focus; do not pin off-topic content.
2. One pin per article first. Every public guide has exactly one original pin (hero photo of that guide plus its title). Publish each once to its primary board. No guide gets a second pin until all have had their first and several weeks have passed.
3. Fresh variants later. After the first round, add at most one new pin per guide at a time, with a different headline and a different crop or a non-photo design (for example a data graphic that quotes a figure from the guide with its source and read date). Space variants of the same guide weeks apart. Never re-upload the same image or re-pin the same pin to many boards. (SUSPECTED benefit: Pinterest favors fresh pins; the Community Guidelines page read does not say so. The anti-repetition rule above is what is confirmed.)
4. Cadence. Pinterest publishes no required frequency (not found on a page read). A small steady rhythm is safest: 3 pins per week, never more than 3 in a day (the owner's rule in the Cowork prompt). The 24 existing pins give about 8 weeks. Schedule in batches inside Pinterest's 10-at-a-time limit; check back every two weeks. RECOMMENDED, not a Pinterest rule.
5. Honest imagery. Pins use the guide's own hero photo, which already matches its article and is never reused across guides. No fake before/after images, no photos of real properties that are not the property, no AI images passed off as photos, no claims on the image that the guide does not support. Text on the image is the guide title.
6. Keywords. Put the plain search phrase people use in the title and in the first sentence of the description ("vacation rental pet fees", "dog weight limit rental", "cabin packing list with a dog"). Titles and descriptions come from the guide metadata, so they stay accurate. No hashtag stuffing, no irrelevant keywords (prohibited as shown above). Title limit 100 characters and description limit 500 are enforced by scripts/make-pin-sheet.py.
7. Board structure. Boards follow the traveler's problem, not our site map: Vacation Rental Planning, Dog Travel Gear, Cabin Vacations, Senior Dog Travel, Large Dog Travel, Multiple Dog Travel, Travel Cost Planning, Dog-Friendly Vacations. Each guide has one primary board. Boards for road trip checklists, beach vacations and dog-friendly destinations are created only when we publish matching content. Give each board a one-sentence description with its keyword. Keep boards public and on topic; do not pin other people's content just to fill boards (optional, later: a few relevant, high-quality pins from other creators help a thin board, but only genuine ones).
8. Claim and Rich Pins. Claim https://www.pawsandpassage.com with the HTML tag (needs adding the meta tag to the site head, a change owned by whoever edits src/routes/__root.tsx; the tag can be removed after verification). Then check whether Rich Pins are offered for article pages.
9. Links and tracking. Destination is always the guide URL with UTM (utm_source=pinterest&utm_medium=social&utm_campaign=<board-slug>&utm_content=<pin-slug>). No affiliate links on pins, no shorteners. Product links live inside the guide, after the disclosure.
10. Native scheduling only. No paid scheduler and no third-party auto-poster (unapproved automation is prohibited by the Community Guidelines page read).

## Measuring

- Pinterest analytics (impressions, saves, outbound clicks, engagements): review monthly per pin and per board. A pin is judged on outbound clicks and saves, not impressions.
- GA4: Reports > Acquisition > Traffic acquisition, filter Session source = pinterest; add Session campaign (board) and Session manual ad content (pin slug) as secondary dimensions. Check engaged sessions and the existing GA4 events (tool use, outbound clicks) for those sessions. Pinterest also sends untagged traffic (shares from the Pin button on articles, and saves of site images), which shows as source pinterest.com referral; sum both when reporting.
- Log results in docs (a small monthly table: date, pins live, impressions, saves, outbound clicks, GA4 sessions from pinterest). Make no traffic claims until the log has data. No numbers exist yet.
- Decision rule (RECOMMENDED): after 90 days, make fresh variants only for guides whose first pin earned outbound clicks; do not add boards that get no saves.

## What NOT to do

- No buying followers, saves, repins or comments; no engagement groups or pods; no follow/unfollow churn.
- No pin spam: same image or link posted repeatedly, many near-identical pins, or pinning one guide to many boards.
- No clickbait, exaggerated promises, misleading prices, or text on the image that the guide does not support.
- No stock or AI photos presented as real properties; no photos from other sites.
- No shortened links, cloaked links or affiliate deep links on pins.
- No paid scheduler or unapproved auto-poster; no second Pinterest account for the site (one account only, per docs/recovery/09).
- No passwords or payment details typed by an assistant; stop on CAPTCHA, verification, suspicious-activity warnings or unexpected authorization requests.
- No Promoted Pins or any spend without the owner's explicit approval.
- No traffic or earnings claims in public until measured.

## Per-article workflow (about 5 minutes)

1. Guide goes public. 2. `python3 scripts/make-share-images.py` (pin + share image; prunes stale ones). 3. `python3 scripts/make-pin-sheet.py` (adds the row). 4. Add the pin in Pinterest from the new CSV row, scheduled with Pinterest's own tool. 5. Note it in the monthly log. If a guide is retired, re-run both scripts; the pin image and CSV row disappear, and the existing Pinterest pin should be deleted or its link checked by hand (the old URL may redirect or 404).
