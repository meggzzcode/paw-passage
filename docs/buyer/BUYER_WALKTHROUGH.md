# Buyer walkthrough script and screenshot plan (Paws & Passage)

Written 2026-11-24. Target length 5 to 7 minutes. Live site: https://www.pawsandpassage.com. Claims in this script must match `docs/SALE_LISTING_DRAFT.md` (being rewritten by another worker; if a count differs there, the listing wins and the narration is edited).

## 0. Video status (read first)
**No video was produced.** The tools available to Claude Code in this environment cannot record a browser or a screen. This file is a script plus a screenshot plan. Cowork (or the owner) records the video using section 11 and takes the screenshots named below. Nothing here says a video exists.

Ground rules for every narration line: no traffic, revenue, ranking, approval or buyer-interest claims. The honest statement is "new, pre-revenue site; no earnings or traffic history". Record only after the owner has confirmed the production deploy is live (the live site may otherwise show an older build; the new build shows "Affiliate link · We may earn a commission" labels under buy buttons).

Counts used below come from the repo audits (30 guides, 38-manager dataset, 32 listed stays, 3 planning tools, 53 gear products). Re-check them against the live site while recording; if a number on screen differs, say what is on screen.

## 1. Segment plan at a glance
| # | Segment | URL | Time | Screenshots |
|---|---|---|---|---|
| 1 | Homepage and brand | `/` | 0:30 | `wt01-home-desktop.png`, `wt01-home-phone.png` |
| 2 | Original rental-policy research | `/data/pet-policies` | 0:45 | `wt02-policy-data-desktop.png`, `wt02-policy-csv.png` |
| 3 | A polished guide | `/guides/how-vacation-rental-pet-fees-work` | 0:45 | `wt03-guide-top-desktop.png`, `wt03-guide-sources.png`, `wt03-guide-phone.png` |
| 4 | Planning tool in action | `/tools/will-my-dog-be-accepted` | 0:50 | `wt04-tool-inputs.png`, `wt04-tool-results.png` |
| 5 | Directory and a stay page | `/stays` then `/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake` | 0:45 | `wt05-stays-index.png`, `wt05-stay-detail.png` |
| 6 | Commercial guide and affiliate journey | `/guides/dog-car-safety-harness-and-crate-guide`, then the stay page again | 1:00 | `wt06-pick-card.png`, `wt06-affiliate-label.png`, `wt06-amazon-landing.png`, `wt06-vrbo-button.png` |
| 7 | Edit and publish content | Pages CMS, GitHub, Netlify (slides or screenshots only unless the owner approves a live save) | 0:50 | `wt07-cms-form.png` (only if real), `wt07-flow-diagram.png` |
| 8 | Deployment and maintenance | Netlify dashboard (redacted), `docs/PRODUCT-LINKS-GUIDE.md` | 0:40 | `wt08-netlify-deploys.png`, `wt08-links-guide.png` |
Total about 6:25 plus 0:20 intro and close = about 6:45.

## 2. Segment 1: Homepage and brand (URL https://www.pawsandpassage.com/)
- Click: load the page; slowly scroll to the footer; click "Guides" in the top navigation, then back.
- Say: "This is Paws & Passage, a dog-friendly vacation-rental publication. It is a new, pre-revenue site: there is no traffic or earnings history, so what you are evaluating is the content, the data and the code."
- Say: "The brand, the trust pages in the footer and the affiliate disclosure are all here, so a new owner starts with a site that already states how it makes money."
- Screenshots: `wt01-home-desktop.png` (1280 px, first screen), `wt01-home-phone.png` (390 px, first screen).

## 3. Segment 2: Original research (URL https://www.pawsandpassage.com/data/pet-policies)
- Click: open the page; scroll the table; click the CSV download link (file is `/pet-policies-38-managers.csv`); open the downloaded CSV in a spreadsheet for 5 seconds (hide the file path and any account name in the OS toolbar).
- Say: "This is the original research: 38 vacation-rental managers, 13 fields each, such as dog limit, weight limit, breed rule and pet fee, each row with a source link and a read date of November 18, 2026."
- Say: "It is a one-time convenience sample compiled from public manager pages. Policies change, so a buyer would want to re-check it before relying on it."
- Screenshots: `wt02-policy-data-desktop.png`, `wt02-policy-csv.png` (spreadsheet view).

## 4. Segment 3: A polished guide (URL https://www.pawsandpassage.com/guides/how-vacation-rental-pet-fees-work)
- Click: scroll to the answer line, a table (swipe hint on phone), then to the Sources list at the end; click one source link and return.
- Say: "Each guide has a short answer up top, tables, FAQs and a dated Sources list. There are 30 published guides and about 77,000 words in total."
- Say: "The guides are AI-assisted, researched from public sources and disclosed that way. They are not first-hand testing."
- Screenshots: `wt03-guide-top-desktop.png`, `wt03-guide-sources.png`, `wt03-guide-phone.png` (390 px).

## 5. Segment 4: Planning tool in action (URL https://www.pawsandpassage.com/tools/will-my-dog-be-accepted)
Exact sample run (the form title is "Will my dog be accepted?"):
1. Under "How many dogs are coming?" click **2**.
2. Under "Weight of each dog in pounds (optional)" type **70** for dog 1 and **45** for dog 2.
3. In "Is one of your dogs any of these?" choose the first non-default option if present, or leave the default "none" for a plain first run.
4. Click **Check these managers**.
5. In the results, point at the three labels: "No conflict found", "Ask first", "Likely a problem". Click one filter button (for example "Likely a problem"), then click one manager's source link.
6. Optional second run: change to 1 dog, 20 lb, click Check again to show the list change.
- Say: "This tool checks your dogs against the 38-manager dataset. Nothing you type leaves the browser."
- Say: "Results come with reasons and a source link per manager, so the tool shows its evidence. It also has a copy and print option."
- Screenshots: `wt04-tool-inputs.png` (before clicking Check), `wt04-tool-results.png` (after, with the filter row visible).
- Alternative if the tool misbehaves on the day: `/tools/packing-list`: tick 3 items, use the copy/print action. Record which tool was shown.

## 6. Segment 5: Directory and a stay page (URLs https://www.pawsandpassage.com/stays and https://www.pawsandpassage.com/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake)
- Click: on `/stays` scroll the list; open the Cherry Lake stay; scroll to the pet-policy panel.
- Say: "The directory has 32 listed stays in Georgia and California, each with pet-policy fields. A stay is listed only when it has an approved booking link, which is a rule in the code."
- Say: "It is built so a new owner can add more stays from a spreadsheet; the process is in the monetization notes."
- If the page is missing on the day, pick any stay from `/stays`. Say which.
- Screenshots: `wt05-stays-index.png`, `wt05-stay-detail.png` (include the pet-policy panel).

## 7. Segment 6: Commercial guide and affiliate journey
URL A: https://www.pawsandpassage.com/guides/dog-car-safety-harness-and-crate-guide
1. Scroll to the notice near the top ("affiliate" note, plus the Amazon Associate sentence).
2. Scroll to a product pick card. Point at: the card, the label under the button ("Affiliate link · We may earn a commission"), and the Amazon button.
3. Click the Amazon button once; let the Amazon product page load in a new tab; do NOT sign in, add to cart or buy. Close the tab. If Amazon shows a sign-in wall or "unavailable", say so and move on.
URL B: the Cherry Lake stay page. Point at the Vrbo booking button and its label; click it once only if the owner has said it is acceptable to open Vrbo (Vrbo rate-limits bots; do not click repeatedly). Close the tab.
- Say: "Product and booking buttons carry a disclosure label right next to them. Amazon links use the seller's Associates tag; Vrbo links use the seller's own deeplinks."
- Say, explicitly: "These affiliate links use the seller's IDs and are non-transferable. A buyer applies for their own Amazon Associates and Expedia/Vrbo accounts, then swaps the IDs in two config files. Until approved, the links must not be assumed to earn."
- Say: "Ten products are switched off because they had no buy box when checked in November, and nine earlier retirements are documented. Nothing here shows earnings."
- Screenshots: `wt06-pick-card.png`, `wt06-affiliate-label.png`, `wt06-amazon-landing.png` (redact any account or location data), `wt06-vrbo-button.png`.

## 8. Segment 7: How a buyer edits and publishes (flow: Pages CMS, GitHub `main`, Netlify)
STATUS OF EVIDENCE: **The Pages CMS configuration (`.pages.yml`) has NOT been opened or tested in the live Pages CMS app** (its own header says so, and `docs/HOSTING_PORTABILITY_REPORT.md` lists it as UNVERIFIED). Do not claim a CMS test was done. Record a live CMS save only if the owner approves it (it commits to `main` and triggers a production deploy costing 15 Netlify credits); if done, report exactly what happened, including failure. Otherwise show a diagram plus the file layout, and say it is untested.
Steps a buyer follows (from `docs/TRANSFER_CHECKLIST.md` section 5 and the hosting report):
1. Go to Pages CMS (app.pagescms.org) and sign in with GitHub.
2. Install the Pages CMS GitHub App on the account or organization that owns the repository, and open the repository.
3. Confirm the forms from `.pages.yml` load: Articles, Stays, Dog rules, Affiliate links, Products, Business settings.
4. Open "Business settings" and make one trivial edit (for example a text field), then Save.
5. The save is a commit to the repository. Confirm in GitHub that a new commit appears (and which branch it went to: the target branch is UNVERIFIED, so check it is `main`).
6. A push to `main` triggers a Netlify build; open Netlify, Deploys, and watch the deploy turn "Published".
7. Reload the live page to confirm the change.
Alternative that needs no CMS: edit the Markdown or YAML in `content/` directly on GitHub and commit to `main`.
- Say: "Content edits happen in Pages CMS or straight in GitHub. A commit to main deploys through Netlify. I have to be straightforward: the CMS forms were written from the documentation and have not been opened in the live app, so the first edit is a buyer's test."
- Screenshots: `wt07-flow-diagram.png` (simple three-box graphic: Pages CMS, GitHub main, Netlify), `wt07-cms-form.png` (ONLY if a real CMS session was run; otherwise omit and state "not captured").

## 9. Segment 8: Deployment and maintenance (Netlify, credits, ignore rule, monthly link check)
- Show: Netlify dashboard Deploys list for the site (redact team name, email, billing).
- Say: "The site runs on Netlify's free plan: 300 credits a month, a hard limit, and each production deploy costs 15 credits (figures from Netlify's pricing pages as read on November 24, 2026; recheck them). Running cost is roughly $20 to $35 a year, mostly the domain."
- Say: "A build ignore rule in `netlify.toml` skips deploys when a push changes only docs, markdown or workflow files, so documentation edits do not spend credits."
- Say: "Monthly upkeep is about 15 minutes: open each Amazon link from the live site once and fix anything dead or the wrong item, following the Product links guide. Amazon and Vrbo block bots, so this check is manual."
- Show: `docs/PRODUCT-LINKS-GUIDE.md` section 5 on screen (GitHub view is fine).
- Screenshots: `wt08-netlify-deploys.png`, `wt08-links-guide.png`.

## 10. Close (0:20)
Say: "To summarize: finished content, an original dataset, working tools, a directory and a gear hub, on a low-cost stack with handover documents. It has no traffic or revenue history, and the affiliate accounts do not transfer. The listing has the full inventory and limitations."

## 11. Recording instructions for Cowork
- Recorder: any local screen recorder (QuickTime on Mac, Xbox Game Bar or OBS on Windows, or the Loom desktop app in local-only mode). Record the browser window only, not the whole desktop.
- Settings: 1280x720 for the main video, 30 fps, MP4 (H.264), system audio off, microphone on, a quiet room. Cursor visible, with click highlighting if available. Browser zoom 100%, light theme, a clean profile or private window with bookmarks bar, extensions and tab titles hidden.
- Phone segment: a separate clip with the browser window at 390 px wide (DevTools device toolbar, or a resized window), about 40 seconds, covering `wt01` home first screen, opening the menu to reach Guides, Stays, Gear, Tools, and one guide table swipe. Name it `walkthrough-phone-390.mp4`.
- Privacy: no account emails, avatars, earnings, tracking IDs in a Search Console or Amazon dashboard, passwords, codes or recovery data on screen. Do not open Gmail, Namecheap, Amazon Associates, Vrbo or Search Console while recording. Close notifications and chat apps. If anything private flashes on screen, discard the take and re-record.
- Order of shots: segments 1 to 8 in the table order, then the close. Record each segment as its own clip so retakes are cheap; stitch if needed. Use the sample inputs exactly as written.
- Length: 5 to 7 minutes for the main file; the phone clip is separate.
- File naming: `pawsandpassage-walkthrough-2026-11-XX-main-1280x720.mp4`, `pawsandpassage-walkthrough-2026-11-XX-phone-390.mp4`, and screenshots as named in the segment tables. Use the real date for XX.
- Storage: a PRIVATE folder named by the owner (not the public repo, not a public link). The repo records file names only. Share with a buyer only after the owner approves, preferably as an unlisted link to a private cloud folder or through the marketplace messaging.
- Report back: list each file, build seen (confirm the labels "Affiliate link · We may earn a commission" were present), and any segment that failed or could not be recorded. Never invent a result.
- Do not click Publish, Submit or Confirm anywhere, spend money, or edit the repository while recording.
