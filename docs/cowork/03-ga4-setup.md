# Cowork prompt 03: GA4 custom dimensions, key events, Realtime, GTM check

Use after step 3 of docs/OWNER-WALKTHROUGH.md. Paste everything below the line into Cowork.

---

You are helping me configure Google Analytics 4 for pawsandpassage.com (measurement ID G-1J97C8CPC1). I am signed in at https://analytics.google.com.

## Rules (read first, apply to every step)

- Work only in my own browser, in tabs I already have signed in. If a page asks me to sign in, STOP and tell me; I will sign in myself.
- NEVER type, paste, read aloud or store any password, one-time code, recovery code, security question, payment card, bank, tax, SSN or PayPal detail.
- NEVER buy, upgrade, start a trial, change a plan, or accept any agreement, terms box, or "authorize"/"allow access" request that I did not name below. If any such prompt appears: STOP, take no action, and describe it to me.
- STOP and tell me on any CAPTCHA, "verify it is you", security warning, suspicious-activity notice, unexpected popup, or a screen that does not match these instructions. Do not try to work around it.
- Menu names may differ slightly from this text. If you cannot find an item after two tries, use the nearest equivalent only if it is clearly the same setting; otherwise stop and report it as "not found".
- Change only what is named. Do not delete, remove, disconnect or invite anything.
- At the end, give a short results table (item, what you saw, what you did, status: done / already done / blocked / skipped) and list anything unexpected.
- Never delete or edit data streams, never change data retention, Google signals, data deletion requests or user access, and never link Google Ads or any other product.

## Steps

1. Select the property whose data stream uses G-1J97C8CPC1. If several properties exist, tell me which one you chose.
2. Admin, Data display, Custom definitions, Custom dimensions tab. List the existing custom dimensions. Then, for each row below that does NOT already exist, click Create custom dimensions and enter exactly: Dimension name, Scope = Event, Event parameter, then Save. Scope and parameter cannot be changed later, so type carefully.
   - Name: Partner | Event parameter: partner
   - Name: Product | Event parameter: product_id
   - Name: Stay | Event parameter: stay_slug
   - Name: Tool name | Event parameter: tool_name
   (Note: product_id and stay_slug are what the site sends. Do not use "product" or "stay".)
3. Admin, Data display, Events, Recent events. Find booking_click and product_click. For each one that is listed and not yet a key event, click its star. If an event is not listed, do NOT use Create event; report it as "not yet received".
4. Reports, Realtime. Report what you see (users in the last 30 minutes, the event names listed). If I have a second tab on the site, I will click a stay button and a gear link; then re-check Realtime for booking_click and product_click.
5. READ ONLY investigation of container GTM-W99QCXZ9 (Google Ads says it detected it on the site; I do not know where it came from; do not guess):
   a. Open https://tagmanager.google.com and, on the Accounts tab, report whether a container with ID GTM-W99QCXZ9 is listed, the account and container name, and who owns it. Change nothing.
   b. In GA4, Admin, find Data streams (nearest equivalent if named differently), open the web stream for pawsandpassage.com and report the Measurement ID, stream name and created date.
   c. In a new tab open view-source:https://www.pawsandpassage.com/ and search for "GTM-"; report whether it appears and the surrounding text.

Report table: property chosen; each dimension (created / already existed); each key event (starred / already / not yet received); Realtime summary; GTM findings (a, b, c).
