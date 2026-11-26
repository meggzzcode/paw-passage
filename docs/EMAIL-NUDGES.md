# Weekly email nudges: research, recommendation, copy

Status: owner decision recorded (buyers only, through Gumroad); setup is Cowork task E10. Nothing here is built in the repository. Sections that describe visitor signup forms, other email platforms or an own backend are research kept for reference and are NOT adopted. Not legal advice.
Research date: 2026-11-26. "UNVERIFIED" means I could not read it on the vendor's own page.

## Owner decisions (2026-11-26)

- Email nudges go to BUYERS only, through Gumroad. No visitor signup form, no email platform, no list of our own, so no postal address is needed on our side.
- Free visitors have no login and no email collection. A login exists only after purchase (license key and session).
- The 12-email length is our own design, not a Gumroad limit. Gumroad's help center says each workflow email is scheduled hours, days, weeks or months after the trigger; no maximum was found (UNVERIFIED: check the workflow screen). A longer series, or occasional one-off updates sent to all customers, is possible.
- PWA and push reminders are paused (`PWA_ENABLED = false`). Revisit only if installs can be counted in aggregate (the install and notification events already exist).
- Open checks before relying on it: Gumroad may limit sending until the seller has $100 net earnings and a payout (sources conflict); send a test workflow email to yourself and read the footer and unsubscribe link.

## 1. What Gumroad can do itself

Gumroad's own help pages (gumroad.com/help/article/...) returned only page titles to my fetch tool, so everything about Gumroad below comes from search summaries and a third-party article. Treat it as UNVERIFIED until the owner confirms it in the dashboard.

| Question                      | Finding                                                                                                                                                              | Source / status                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Workflows exist               | Scheduled emails to a segment when a trigger fires, delayed by hours, days, weeks or months                                                                          | Gumroad help article 131 (search snippet); Substack guide read |
| Triggers                      | New purchase, new subscriber, member cancels, new affiliate, abandoned cart                                                                                          | Substack guide (third party), UNVERIFIED on Gumroad            |
| Series length                 | "No hard limit"; 3 to 7 emails recommended. 12 weekly emails fit                                                                                                     | Substack guide, UNVERIFIED                                     |
| Relative to purchase          | Per-email delay measured from the trigger (0 hours = immediate)                                                                                                      | Substack guide, UNVERIFIED                                     |
| Recurring / repeat            | Buying again re-enters the workflow. No true "every week forever" mode found                                                                                         | Substack guide, UNVERIFIED                                     |
| Filters                       | Product bought or not, amount paid, purchase date range, country                                                                                                     | Substack guide, UNVERIFIED                                     |
| Limits                        | No A/B tests, advanced segmentation or personalization. Published workflow cannot change trigger (clone it)                                                          | Substack guide, UNVERIFIED                                     |
| Cost                          | Included in Gumroad's standard fees                                                                                                                                  | Substack guide, UNVERIFIED                                     |
| Sending threshold             | Seller must have earned $100 after fees and received a payout before sending email                                                                                   | Search summary of Gumroad help, UNVERIFIED                     |
| Sender                        | Appears from the seller's name at an @gumroad.com address                                                                                                            | Search summary, UNVERIFIED                                     |
| Unsubscribe handling          | Opt-outs are removed from the list automatically; whether workflow emails carry an unsubscribe link and the legal footer/address is not stated on pages I could read | UNVERIFIED. Owner must send a test and look                    |
| Marketing to buyers allowed?  | Not found in Gumroad terms I could read. Treat as UNVERIFIED; check the Terms and the email help before launch                                                       | UNVERIFIED                                                     |
| Transfers with a sold account | Workflows live in the seller account, so they should go with it, but I found no statement                                                                            | UNVERIFIED                                                     |
| Free vs paid                  | No separate fee found                                                                                                                                                | UNVERIFIED                                                     |
| Free visitors                 | Not possible: Gumroad emails buyers and its own subscribers, not our site's visitors (a Gumroad follow form is a different product)                                  | My reading, UNVERIFIED                                         |

Takeaway: a single Workflow (trigger: new purchase, 12 emails, 1 week apart) is the closest fit to "no new infrastructure". It is a drip from each buyer's own purchase date, so no weekly RSS or scheduler is needed.

## 2. Free-tier email platforms (pricing pages read 2026-11-26)

| Platform                    | Free tier                                                                                               | Sequences on free                                                   | RSS-to-email on free                                       | Notes                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| MailerLite (mailerlite.com) | 250 subscribers, 2,500 emails/mo, 3 forms, 1 landing page, 3 automations x 5 steps (steps: third party) | Yes but 5-step cap (third party), so a 12-email drip does not fit   | No. RSS campaigns appear only as a 14-day trial of premium | Logo stays on free. Paid from $12/mo (Comfort). Double opt-in on free UNVERIFIED                      |
| Brevo (brevo.com)           | 300 sends/day; storage cap 100,000 contacts (help center via search)                                    | Automation on free exists with limits, UNVERIFIED                   | UNVERIFIED                                                 | "Sent with Brevo" sticker on free. My fetch of pricing page returned no numbers                       |
| Buttondown (buttondown.com) | "Nothing for your first 100 subscribers"                                                                | Automations are a +$29/mo add-on                                    | RSS-to-email is a +$9/mo add-on                            | Double opt-in on by default (docs via search). Paid tier prices at 1,000/5,000 not on page            |
| Kit (kit.com)               | Up to 10,000 subscribers, unlimited opt-in forms, Kit branding                                          | No. Sequences and visual automations need Creator ($39/mo at 1,000) | No. RSS campaigns are Creator/Pro                          | Weekly emails would be manual broadcasts. Double opt-in on free UNVERIFIED                            |
| Mailchimp (mailchimp.com)   | 250 contacts, 500 sends/mo or 250/day                                                                   | No automation flows                                                 | Not listed                                                 | Branding stays. Paid prices below 10,000 contacts need their slider (UNVERIFIED)                      |
| Resend (resend.com)         | 1,000 contacts, 3 segments, broadcasts, 100/day cap on the transactional plan                           | Automations: 10,000 runs/mo (what a run covers: UNVERIFIED)         | No                                                         | Developer tool: no hosted signup form found (UNVERIFIED). Pro marketing from $40/mo at 5,000 contacts |

Common to all: a hosted signup form (no backend) is standard on MailerLite, Kit and Brevo (Kit and MailerLite confirmed on their pricing pages; Brevo forms UNVERIFIED). Reputable platforms add the unsubscribe link and your postal address to the footer; I confirmed this explicitly only for Resend broadcasts (needs the `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder). RSS-to-email on a FREE plan: not found on any platform checked. API is not needed for any hosted-form route.

## 3. Our-own-backend option

Netlify scheduled function + an email API (for example Resend) + a subscriber list in Netlify Blobs. It would add:

- Code: signup endpoint, confirm endpoint, unsubscribe endpoint, weekly scheduled sender, templates, tests.
- Secrets: email API key, a signing secret for confirm/unsubscribe links. Owner must provision them; a buyer must rotate them.
- Deliverability work: domain SPF/DKIM/DMARC records, sending reputation, list-unsubscribe headers.
- Compliance we would own: consent records, suppression list, honoring opt-outs within 10 business days, physical address in each email.
- Bounce and complaint handling: webhook endpoint to stop sending to dead or complaining addresses.
- Ongoing: monitoring a scheduler, API quota, key expiry, privacy requests (deletion/export).

It is the heaviest option: every item above is something a hosted platform already handles, and a future buyer would inherit a mail server's responsibilities. Not recommended.

## 4. Consent and legal basics (not legal advice)

- CAN-SPAM (FTC guide, read): applies to commercial email, including to existing customers. Requirements: accurate From/Reply-To; subject lines that match the content; clear ad disclosure where the message is an ad; a valid physical postal address (street, USPS PO box or registered private mailbox); a working opt-out that lasts at least 30 days after sending; opt-outs honored within 10 business days; you remain responsible even if a vendor sends. Penalties up to $53,088 per violating email.
- Weekly "adventure idea" emails link to a product, so treat them as commercial: use the platform's footer with address and unsubscribe.
- Free-visitor signups: use a plain sentence of consent (below) next to the button, send a confirmation email first (double opt-in), and keep the platform's record of when each person joined.
- GDPR / UK GDPR / CASL (Canada) / visitors abroad (GDPR.eu article read): consent must be freely given, specific, unbundled from other terms, withdrawable as easily as given, and provable. Double opt-in and a separate, unticked consent line cover this. Do not pre-tick, and do not make the email a condition of using the free adventure.
- One-time buyers: whether Gumroad lets the seller email them for marketing, and under what footer, is UNVERIFIED (section 1). Prefer a platform where buyers opt in themselves.
- Account-less promise: the site must not require email for anything. The signup is optional and never blocks the free adventure.

## 5. Recommendation

| Option                                    | New infrastructure | Cost at 100 / 1,000 / 5,000                               | Seamless (no account for buyer)     | Buyer-transfer ease            | Consent clarity                        |
| ----------------------------------------- | ------------------ | --------------------------------------------------------- | ----------------------------------- | ------------------------------ | -------------------------------------- |
| Gumroad Workflow                          | None               | $0 / $0 / $0 (fees only, UNVERIFIED)                      | High: buyers already in Gumroad     | High, UNVERIFIED               | Unclear until tested (footer, opt-out) |
| MailerLite free                           | None               | $0 / paid, from $12/mo (exact UNVERIFIED) / UNVERIFIED    | Medium: needs signup form or import | Medium: transfer account login | Good: hosted form, confirm email       |
| Brevo free                                | None               | $0 / $0 within 300 sends/day / UNVERIFIED                 | Medium                              | Medium                         | UNVERIFIED                             |
| Kit free                                  | None               | $0 / $0 (broadcasts only) / $0; sequences $39/mo at 1,000 | Medium; weekly send is manual       | Medium                         | Good                                   |
| Buttondown                                | None               | $0 / not on page / not on page                            | Medium                              | Medium                         | Good: double opt-in by default         |
| Mailchimp free                            | None               | $0 / not on page / not on page                            | Low: 250 contacts, no automation    | Medium                         | Standard                               |
| Resend                                    | Dev setup, no form | $0 / $0 (1,000 contacts cap) / $40/mo                     | Low                                 | Low                            | We must build forms                    |
| Own backend (Netlify + email API + Blobs) | Heavy              | API cost plus owner time                                  | Medium                              | Low                            | We own every duty                      |

**Launch setup (recommended):** one Gumroad Workflow, trigger "new purchase", 12 emails each 1 week after the previous (first at 1 week), filtered to this product. Before turning it on the owner must (a) send a test to themselves and confirm it shows an unsubscribe link and an address, (b) confirm Gumroad's terms allow it, (c) approve the copy. If either check fails, fall back to MailerLite free with an imported buyer list only if buyers opted in.

**Not adopted (owner decision: buyers only; no visitor signup form). Kept as reference only. Possible later upgrade for free visitors (would need new owner approval, no backend):** a MailerLite hosted signup form (free tier: 3 forms, 250 subscribers) with the consent line below and confirmation email. Place it only (1) at the bottom of the existing keepsake/unlock moment after the free adventure is complete and (2) in the site footer as a quiet text link opening the hosted form. Never as a popup, banner, interstitial or before the free adventure. Free automation allows about 3 emails (5 steps, third party), so send emails 1 to 3 of the series, then stop. Moving past 250 subscribers or a longer series is a paid decision. Kit free (10,000, forms free) is the alternative if we accept manual weekly broadcasts.

## 6. Copy

Rules applied: subjects 50 characters or fewer, bodies 90 words or fewer, one same-site link each, no urgency, no discounts, nothing about steps or twists of premium adventures, no health or behavior claims. Links are paths on the site's own domain (the platform needs the full domain prefixed).

### Consent line (signup form; not adopted, reference only)

Send me an occasional adventure idea by email. Unsubscribe any time.

### Confirmation email (visitor signups only; not adopted, reference only)

Subject: Please confirm your email
Preview: One click and we're set.

Thanks for signing up for occasional adventure ideas from Paws & Passage. Please confirm this is your address by choosing the button below. If you didn't ask for this, simply ignore the message and nothing will be sent.

[Confirm my email]

[unsubscribe + address added by the platform]

### Weekly series (12 emails)

Footer for every email: [unsubscribe + address added by the platform] Plus one support line: "Questions? Just reply to this email." Copy is for buyers only, so no email promotes the free adventure or asks anyone to buy. Signature phrases are rotated (docs/MARKETING.md section 0), never on every email; no gifting wording until the owner verifies gifting; no "forever" or promises of future content or updates.

**1.** Subject: A little idea for this week
Preview: Small, simple, no rush.
Body: Hi there. Because every dog deserves a little adventure, here is a gentle thought for the week: pick one small adventure, whenever it suits you. Some days a short outing is plenty, and some days a cozy one at home is just right. If you'd like something chosen for you, let the surprise button pick one. Your dog is always welcome to skip it for another day.
Link: /discover?mode=surprise

**2.** Subject: Something made, not bought
Preview: A hands-on idea for a quiet hour.
Body: Some of our favorite adventures end with something you made together: a little keepsake, a photo you like, a memory worth tucking away. Adventures for your dog, keepsakes for you. If you're in a crafty mood this week, the made-by-hand ideas are a nice place to wander. Take whatever speaks to you and leave the rest.
Link: /discover?mode=made

**3.** Subject: Your saved ideas, in one place
Preview: Favorites are easy to find again.
Body: Collect adventures, not just things. When one catches your eye, you can save it and come back later. Everything you've saved lives together on one page, ready for a free afternoon or a slow weekend. It's a small collection that grows at your own pace, and nothing about it is on a schedule.
Link: /collections?tab=favorites

**4.** Subject: A peek at the bigger collection
Preview: Selected previews, no commitment.
Body: Your passport holds over a hundred adventures, picked for your dog and made memorable by you. Browse the previews to see each one at a glance: how long, what setting, how active. It's a pleasant way to spend a coffee break, and it's fine to just look. One payment, yours to keep, with no subscription.
Link: /previews

**5.** Subject: Something to print and keep
Preview: Little extras for the fridge or a frame.
Body: If you like having something on paper, there are printables to go with your adventures. They're simple and cheerful, and they make a nice reminder that the little moments count. Print one, tuck it away, or just enjoy having it nearby for later.
Link: /printables

**6.** Subject: Your passport is here when you want it
Preview: A home for the adventures you've shared.
Body: Your passport keeps a quiet record of the adventures you've shared, kept on your own device. Stamps, keepsakes and memories gather there over time. Open it whenever you feel like looking back, or leave it be for a while. It will be just as you left it. You paid once, so there's nothing to renew.
Link: /passport

**7.** Subject: An ordinary day, a little different
Preview: Let a surprise do the choosing.
Body: A little adventure awaits... and it needn't be planned. Sometimes the nicest ones start with a small, unexpected idea on an ordinary day. Let a surprise suggest something simple, and see how it feels. If it isn't right for the moment, you can always ask for another one.
Link: /discover?mode=surprise

**8.** Subject: A slow-weekend idea
Preview: Something gentle to make together.
Body: Slow weekends are made for small projects. The made-by-hand adventures are friendly, low-key, and easy to fit around your day. Choose one that looks fun, give it as much time as you like, and enjoy the little keepsake that comes out of it.
Link: /discover?mode=made

**9.** Subject: Ideas worth keeping
Preview: Save a few for later.
Body: Saving an adventure is like putting a bookmark in a good story. Whenever something sounds nice, tuck it into your favorites and move on. When you want an idea later, you'll have a short, friendly list waiting. No pressure to use any of them.
Link: /collections?tab=favorites

**10.** Subject: Browse at your own pace
Preview: A few previews to wander through.
Body: More than walks, more than fetch, more little adventures: if you enjoy looking at what's possible, the previews are a relaxed way to do it. Each one shows the basics at a glance, so you can imagine the day without committing to anything. Come back as often as you like, or not at all. Either is just fine.
Link: /previews

**11.** Subject: Little keepsakes, big smiles
Preview: Printables for the memory shelf.
Body: A small printed keepsake can turn a good afternoon into something you can hold. Browse the printables for something that suits your style, and keep it somewhere you'll see it. It's a simple way to remember the little adventures that made you smile.
Link: /printables

**12.** Subject: A quiet note to close the series
Preview: Thank you for being part of this.
Body: This is the last email in this series, and we just wanted to say thank you for spending your time with Paws & Passage. A lifetime of little adventures is built one small moment at a time. Your passport is there whenever you'd like to add another page. One payment. Yours to keep.
Link: /passport

## 7. Owner approvals needed

1. Which route: Gumroad Workflow now (free) after verifying the points marked UNVERIFIED.
2. Copy approval for the 12 emails and the confirmation email.
3. Any paid plan (MailerLite Comfort, Kit Creator, etc.). None is assumed.
4. (Not adopted: a visitor signup form. The owner decided on buyers only.)
5. (Not needed for the buyers-only route: a postal address for our own list. Check what footer Gumroad's workflow email shows.)
