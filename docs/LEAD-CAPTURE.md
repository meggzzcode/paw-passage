# Email lead capture for Paws & Passage

Research date: 2026-11-17. Not legal advice. Provider limits change, so re-check the pricing pages before signing up.

## 1. Provider comparison (free plans)

| | Kit (ConvertKit) | MailerLite | Brevo (third option) |
|---|---|---|---|
| Subscribers | Up to 10,000 | 250 active; sending locks above that | Page said only "limits"; help-center search says 300 sends/day. Contact cap NOT CONFIRMED (sources conflict) |
| Sends | No stated cap | 2,500/month | 300/day (help.brevo.com, via search) |
| Forms / landing pages | Unlimited forms and landing pages | 3 forms, 1 landing page, 1 website. Whether embedded forms are on Free: NOT CONFIRMED (pricing page unclear) | NOT CONFIRMED (pricing page gave no numbers); a comparison site says forms carry Brevo branding |
| Automations | The pricing page summary says visual automations and sequences are NOT on Free. This is odd and must be re-checked on the live page before choosing Kit | 3 automations, 5 steps each | NOT CONFIRMED |
| Lead-magnet delivery | Included (incentive email: upload a file or link to a URL) | NOT CONFIRMED for Free (page did not say) | NOT CONFIRMED |
| Double opt-in | On by default; turning off the confirmation email turns it off | On by default per form (help article) | NOT CONFIRMED |
| Custom redirect | Yes, set a URL for "after confirming, redirect to" | Redirect to a custom page is advertised; plan tier NOT CONFIRMED | NOT CONFIRMED |
| Plain HTML form POST from a static site | Yes, copy the form action URL from Embed > HTML in Kit. Keep the data attributes from the embed code. Third-party reports; the Kit embed help page returned 403 | Embed code is offered; a bare custom form POST is NOT CONFIRMED | NOT CONFIRMED |
| Transfer to a buyer | NOT CONFIRMED. Kit's help center was not reachable | NOT CONFIRMED | NOT CONFIRMED |

Other Kit Free caveats from its pricing page: one user seat, Kit branding cannot be removed, email-only support, no free migration.

**Transfer in practice.** No provider page was found that describes selling an account. The safe approach is to create the account under a shared role email such as a mailbox on the site's own domain, so the buyer takes over the login. Subscriber lists can usually be exported as CSV and re-imported elsewhere. Confirm with the provider's support before the sale.

## 2. Legal basics (US)

From the FTC CAN-SPAM guide (ftc.gov). Every commercial email must:
- Have truthful From, To and Reply-To details.
- Have a non-deceptive subject line.
- Be identified as an ad where it is one.
- Include a valid postal address. A street address, a USPS-registered PO box or a registered private mailbox all count.
- Explain how to opt out. The opt-out must stay working for at least 30 days, be free, and need no more than a reply or one web page visit.
- Be honored within 10 business days.

Using a vendor does not remove your responsibility. Penalties are up to $53,088 per violating email.

**What the providers require.** Both Kit and MailerLite put an unsubscribe link and your postal address in the footer. Specific wording is NOT CONFIRMED on their own pages. Expect to be asked for an address when you set up the account, and use a PO box or mailbox service, not a home address.

**EU visitors.** GDPR Article 3(2) covers non-EU sites that intentionally offer goods or services to people in the EU or monitor their behavior. The EDPB guidelines (law-firm summaries read; the official PDF came up in search but was not fetched) say incidental EU traffic alone does not trigger it. A US-focused dog travel site with a few EU readers is probably outside it. Whether to add a consent checkbox is a risk choice. A cheap safeguard is double opt-in, plus a plain-language line under the form saying what people will receive. MailerLite says GDPR does not require double opt-in but recommends it. Do not target EU audiences (euro pricing, EU-specific content) without taking legal advice.

## 3. What converts (evidence vs opinion)

- No rigorous controlled study comparing placements was found. Most numbers are from vendors and bloggers, so treat them as directional.
- Blogger-reported: inline forms about 3-6%, exit-intent about 2-5%. These are single-source claims, NOT CONFIRMED as typical.
- Evidence: BlueLena's A/B test on Newspack publisher sites found pop-ups averaged 0.9%, rising to 1.45% when the pop-up was cut to one email field (bluelena.io).
- Evidence: Baymard's test found 65% of signups came from a sidebar form and 35% from an end-of-article form, so placement is not clear-cut.
- General guides say about 2-3% is a typical opt-in rate. Vendor claim.
- Lead magnet vs generic newsletter: no credible head-to-head source found. NOT CONFIRMED. Recommending a specific offer is opinion, not evidence.

## 4. Recommended setup

1. **Provider: Kit Free**, provided the live pricing page confirms an automated welcome email (or sequence) is on Free. The reasons are the 10,000 subscriber cap, unlimited forms, built-in incentive delivery, and a form action URL that works from a plain HTML form. If it fails that check, use MailerLite Free and accept the 250-subscriber lock, or Brevo.
2. **Offer: "Dog Travel Pre-Booking Checklist"**, as a printable PDF, delivered through the incentive email. It builds on the checklist tool the site already has, so there is nothing new to write. Mention the host-message generator and pet-fee calculator in the emails as follow-ups.
3. **Forms.** Add the same HTML form in three places:
   - End of each guide, under a heading like "Get the checklist".
   - One inline box mid-article on the highest-traffic guides.
   - A dedicated landing page linked from the tools.
   Skip pop-ups at first. They are annoying and the evidence for them is weak. Test a simple one-field pop-up later.
4. **Welcome sequence (3 emails max):**
   - Email 1 (the confirmation/incentive email): confirm, with the checklist link.
   - Email 2 (day 2): how to use the host-message generator for a pet-friendly stay.
   - Email 3 (day 5): the pet-fee calculator, plus the best guides, and ask readers to reply with their destination.
   Each email needs the postal address and an unsubscribe link, which the provider adds automatically.
5. **Thank-you redirect:** point the post-confirmation redirect to a page on the site that has the checklist download.

**Documentation for a buyer.** Keep a one-page handover note with:
- Which provider, and the account email (a role address, not a personal one).
- The form IDs and where each form appears on the site.
- The welcome emails' text and the lead-magnet file.
- The postal address in use.
- The unsubscribe and opt-out handling.
- The billing plan.
- Where to export the subscriber list.

The list as a CSV export transfers. The account itself transfers only if the provider allows it or the login is handed over (NOT CONFIRMED). Automation settings and form embeds can be rebuilt from the note.

## Sources read

- https://www.kit.com/pricing
- https://www.mailerlite.com/pricing
- https://www.brevo.com/pricing/
- https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- Search results only (page text not fetched): help.kit.com incentive email; support.mailerlite.com double opt-in; help.brevo.com free plan limits; EDPB Guidelines 3/2018; bluelena.io Newspack test; baymard.com inline CTA.
- Fetch failed: help.kit.com embed form (403); Commission GDPR scope page and NN/g signup page (404).
