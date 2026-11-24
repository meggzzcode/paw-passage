# Buyer walkthrough script (5 to 7 minutes)

Written 2026-11-24 for repo `HEAD` `9797221`. This is the single walkthrough document; it supersedes `docs/buyer/BUYER_WALKTHROUGH.md`, which now only points here.

## 0. Status, stated plainly

- **No video exists.** The tools used to prepare this package cannot record a screen. This file is a script, a screenshot list and recording steps for the owner or Cowork.
- **Do not record yet.** Nothing is deployed: https://www.pawsandpassage.com serves a build from about 2026-11-23 that lacks the packing planner rebuild, the Gear redesign, the 8 town articles and the final guides. Record only after the owner has deployed and the "Production deploy verification" section of `docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md` has passed. Until then, a rehearsal can run against a local build (`bun install`, `NITRO_PRESET=node-server bunx vite build`, `PORT=4581 node .output/server/index.mjs`, base URL `http://localhost:4581`); label any rehearsal recording "local build, not for the buyer".
- Ground rules for every line of narration: no traffic, revenue, ranking, affiliate-approval or buyer-interest claim. The true statement is: "a new, pre-revenue site; no earnings or traffic history". If a number on screen differs from the numbers below, say what is on screen and tell the owner to correct the listing.

Numbers used (from `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`): 29 guides, about 45,000 words, 420 sources, 38-manager dataset with 13 fields, 83 stay files (78 shown, 23 indexable, 0 host-confirmed), 3 tools, 11 Gear categories, 5 trip collections, 65 active products, 103 sitemap URLs.

## 1. Plan at a glance (6 minutes 30 seconds)

| # | Segment | Start URL | Time | Screenshots |
|---|---|---|---|---|
| 1 | Homepage | `/` | 0:30 | `wt01-home-desktop.png`, `wt01-home-phone.png` |
| 2 | Original research | `/data/pet-policies` | 1:00 | `wt02-dataset-desktop.png`, `wt02-dataset-csv.png` |
| 3 | Guides | `/guides/how-vacation-rental-pet-fees-work` | 0:45 | `wt03-guide-top.png`, `wt03-guide-sources.png`, `wt03-guide-phone.png` |
| 4 | Gear shop | `/gear` | 1:00 | `wt04-gear-hub.png`, `wt04-gear-trip-road.png`, `wt04-gear-card.png` |
| 5 | Packing planner | `/tools/packing-list` | 1:30 | `wt05-planner-setup.png`, `wt05-planner-list.png`, `wt05-planner-needtobuy.png`, `wt05-planner-print.png` |
| 6 | Stays | `/stays` | 0:45 | `wt06-stays-index.png`, `wt06-stay-detail.png` |
| 7 | Buyer operations | repository docs, Netlify, Pages CMS (screenshots only) | 1:00 | `wt07-transition-doc.png`, `wt07-audit-output.png`, `wt07-flow-diagram.png` |

Total 6:30. Use the date-stamped file names in section 10.

## 2. Segment 1: Homepage (0:30), https://www.pawsandpassage.com/

Clicks: load the page; scroll once to "Find the right trip for your dog" and the "Travel essentials" band; scroll to the footer (trust pages visible); click **Guides** in the top navigation, then back.
Say: "This is Paws & Passage, a dog-friendly vacation-rental publication. It is new and pre-revenue: there is no traffic or earnings history, so what you are evaluating is the research, the content, the tools and the code."
Screenshots: `wt01-home-desktop.png` (1280 px, first screen), `wt01-home-phone.png` (390 px, first screen).

## 3. Segment 2: Original research (1:00), https://www.pawsandpassage.com/data/pet-policies

Clicks: open the page; scroll the table; use one filter or sort if present; click **Download the CSV** (file `/pet-policies-38-managers.csv`); open it in a spreadsheet for five seconds (hide the folder path and any account name).
Say: "This is the original research: 38 vacation-rental managers, 13 fields each, such as dog limit, weight limit, breed rule and pet fee, each row with a source link and a read date of November 18, 2026. What is original is the selection, the structure and the dated sourcing. Each cell is a public fact from the manager's own page."
Say, honestly: "It is a one-date convenience sample, not a survey. Policies change, so a buyer should re-check it; the re-check procedure is in the repository."
Screenshots: `wt02-dataset-desktop.png`, `wt02-dataset-csv.png` (spreadsheet view).

## 4. Segment 3: Guides (0:45), https://www.pawsandpassage.com/guides/how-vacation-rental-pet-fees-work

Clicks: scroll past the short answer to a table; open the FAQs; scroll to the collapsed **Sources** list and expand it; click one inline publisher link in the text and return.
Say: "There are 29 published guides, about 45,000 words in all. Each starts with a short answer, then tables, FAQs and a dated Sources list; every one of the 420 sources is linked in the text by publisher name. The guides are researched from public sources with AI assistance, and that is disclosed on the Editorial standards page. They are not first-hand tests. Independent readers averaged 7.1 out of 10 before the final fixes; I am not claiming a score for the current text."
Screenshots: `wt03-guide-top.png`, `wt03-guide-sources.png` (Sources expanded), `wt03-guide-phone.png` (390 px).

## 5. Segment 4: Gear shop (1:00), https://www.pawsandpassage.com/gear

Clicks: open `/gear`; point at the trip collections ("Shop by trip"); click **Road trip** (the page becomes `/gear?trip=road-trip`); scroll one card; click **Browse all categories**; open one category, for example `/gear/car-safety`.
Say: "The Gear shop is photo-free on purpose: no Amazon images, so there is nothing to license. It has 11 categories, 5 trip collections and 65 active products, each with a source and a read date. There are no prices, ratings or 'tested' claims. One notice at the top of each page covers the affiliate links, with Amazon's required sentence."
Say, explicitly: "The links use the seller's Amazon tag. That does not transfer. A buyer opens their own Associates account, is approved, and changes one setting; I will show where."
Screenshots: `wt04-gear-hub.png`, `wt04-gear-trip-road.png`, `wt04-gear-card.png` (one product card with the specs and source). Do not click the Amazon button on camera unless the owner agrees.

## 6. Segment 5: Packing planner (1:30), https://www.pawsandpassage.com/tools/packing-list

Exact run:
1. Under "What kind of trip is it?" choose **Road trip**.
2. "How many days away?" enter **4**; "How many dogs are coming?" choose **2**; "Meals per dog each day" choose **2 meals a day**.
3. Under "Anything else we should plan for?" tick **We're driving** and **Hot weather**.
4. Click **Build my packing list**.
5. In the list, tick **Packed** on two items; open **Why bring this?** on one item; click **Need to buy** on a car-restraint item (product cards appear) and on a general item with no product (a pointer such as "Explore ... gear" appears).
6. Click **Remove from list** on one item, then **Undo**.
7. Scroll to **A few extras worth considering**; click **Add to my list** on one; point at **Things to pick up before you go**.
8. Click **Copy my list**; open **Print my list** (print preview) for a few seconds. Reload the page to show the list is still there.
Say: "You describe the trip and get a personalized list from 37 declared items: essentials, trip-specific items and optional extras. 'Need to buy' shows researched products, or points to the related Gear category, or says plainly that there is no pick yet. Your list is saved in your own browser only. There are no accounts, nothing syncs between devices and there is no AI in it."
Say: "A buyer can add or reword items by editing one file, `content/packing.yml`; the build checks it."
Screenshots: `wt05-planner-setup.png`, `wt05-planner-list.png`, `wt05-planner-needtobuy.png`, `wt05-planner-print.png`.

## 7. Segment 6: Stays (0:45), https://www.pawsandpassage.com/stays

Clicks: open `/stays`; use one filter ("Fully fenced yard" or "Large dogs allowed"); open the first stay; scroll to the pet-policy panel and the "Not yet verified" label; point at the booking button label.
Say: "The directory has 78 stays in Georgia and California, written from public listing pages. None has been confirmed with a host, and every one is labelled 'Not yet verified'. 23 of the pages are in the sitemap; the rest are shown but kept out of search because they are thin."
Say, explicitly: "A stay is listed only while it has an approved affiliate link. Those links are the seller's and do not transfer. If they are switched off, this directory empties, unless the buyer turns on an optional mode that lists the same stays with plain links and no commission. That choice is covered in the transition guide."
Screenshots: `wt06-stays-index.png`, `wt06-stay-detail.png` (include the label and the Vrbo button; it says "Affiliate link").

## 8. Segment 7: Buyer operations (1:00), repository and dashboards (screenshots only)

Show, in this order (GitHub's file viewer is fine; no logins on screen):
1. `docs/BUYER_OVERVIEW.md` (the one-page summary).
2. `docs/BUYER_AFFILIATE_TRANSITION.md`: scroll the table "What the buyer replaces". Show the output of `node scripts/audit-seller-ids.mjs` (run it locally; it reports five seller identifiers remaining and exits 0 in report mode).
3. `docs/TRANSFER_CHECKLIST.md` and `docs/buyer/HOSTING_OPTIONS.md` (costs: domain renewal about $19.98 a year; Netlify Free and GitHub $0 at list price).
4. A diagram of the edit flow: Pages CMS or GitHub, then `main`, then Netlify.
Say: "A buyer's first week is written down: open your own affiliate accounts, run the audit, replace the seller's IDs, choose the stay directory mode, deploy on your own Netlify account, verify in your own Search Console. The seller's affiliate accounts, analytics and Search Console are not part of the sale."
Say, honestly: "Editing through Pages CMS has not been tested with a login yet; editing the files on GitHub works. Real-phone checks are still pending. The domain renewal is the only recurring cost I know of, and auto-renew is currently off."
Close (10 seconds): "Finished research and content, working tools, a documented codebase, and a clear list of what you must replace. No traffic or revenue history. The listing has the full inventory and limits."
Screenshots: `wt07-transition-doc.png`, `wt07-audit-output.png` (terminal, no personal paths), `wt07-flow-diagram.png`.

## 9. Screenshot list (all names)

`wt01-home-desktop.png`, `wt01-home-phone.png`, `wt02-dataset-desktop.png`, `wt02-dataset-csv.png`, `wt03-guide-top.png`, `wt03-guide-sources.png`, `wt03-guide-phone.png`, `wt04-gear-hub.png`, `wt04-gear-trip-road.png`, `wt04-gear-card.png`, `wt05-planner-setup.png`, `wt05-planner-list.png`, `wt05-planner-needtobuy.png`, `wt05-planner-print.png`, `wt06-stays-index.png`, `wt06-stay-detail.png`, `wt07-transition-doc.png`, `wt07-audit-output.png`, `wt07-flow-diagram.png` (19 files). Desktop shots at 1280 px wide, phone shots at 390 px wide, browser zoom 100 percent. Store them in a private folder named by the owner; the repository records file names only. They are also the capture list for the marketplace listing (`docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md`, section "Buyer-facing screenshots").

## 10. Recording instructions (screen recording steps)

1. Confirm the deploy check passed. Open a clean browser profile or a private window, light theme, bookmarks bar and extensions hidden, notifications and chat apps closed.
2. Use any local screen recorder (QuickTime on Mac, Xbox Game Bar or OBS on Windows, or a recorder that stores locally). Record the browser window only, 1280x720, 30 fps, MP4 (H.264), microphone on, system audio off, cursor visible.
3. Record each segment as its own clip (`wt-seg1.mp4` to `wt-seg7.mp4`) so a retake is cheap; join them afterwards. Follow the clicks above exactly; read the "Say" lines in your own words but keep the explicit disclaimers.
4. Phone clip (about 40 seconds, `walkthrough-phone-390.mp4`): the browser window resized to 390 px wide (or a real phone screen recording): home first screen, open the menu to Guides, Stays, Gear and Tools, open the packing planner and build a list. Mark it "emulated" if it is a resized window.
5. Privacy: no account emails, avatars, earnings, tracking IDs or dashboards on screen; do not open Gmail, Namecheap, Amazon Associates, Vrbo or Search Console while recording; do not sign in anywhere. If anything private appears, discard the take.
6. Do not click Publish, Submit, Buy or Confirm anywhere, spend money or edit the repository while recording.
7. File names: `pawsandpassage-walkthrough-<date>-main-1280x720.mp4` and `pawsandpassage-walkthrough-<date>-phone-390.mp4`, with the real date. Total length 5 to 7 minutes for the main file.
8. Share with a buyer only after the owner approves, as a private link or through the marketplace messaging.
9. Report back: list each file, the build recorded (deployed commit), and any segment that failed. Never invent a result.
