# Business email and its transfer (hello@pawsandpassage.com)

Researched 2026-11-18 (WP8). Namecheap help-centre pages were read on that date and the URL is given with each point. Live DNS was read on 2026-11-18 through Google's public DNS lookup (https://dns.google/resolve). Labels: VERIFIED, UNCONFIRMED, RECOMMENDED, NEEDS-YOU. **Nothing in DNS, Namecheap or the mailbox was changed.** Passwords, PINs and recovery codes are never written in the repo.

The step-by-step domain, DNS and Netlify transfer order stays in `docs/DNS-AND-TRANSFER.md`; this page adds what was verified today and the mailbox-specific rules.

## 1. The current setup

| Item | Value | Label |
|---|---|---|
| The only public business address | `hello@pawsandpassage.com` (`content/settings.yml`, `contactEmail`) | VERIFIED in repo |
| Provider and plan | Namecheap Private Email, "Launch": **1 mailbox, 5 GB, 10 aliases per mailbox** | VERIFIED plan table: https://www.namecheap.com/support/knowledgebase/article.aspx/10789/2179/private-email-plans-comparison/ ; the owner bought it 2026-11-17 (`docs/OPERATIONS-RECORD.md`) |
| Webmail and settings | privateemail.com (log in with the full address) | Per Namecheap pages below |
| Mail-app settings | IMAP and SMTP server `mail.privateemail.com`, IMAP port 993, SMTP port 465, SSL, username = full address | VERIFIED: https://www.namecheap.com/support/knowledgebase/article.aspx/10802/2226/how-to-transfer-emails-to-namecheap-private-email-account/ |
| Where DNS lives | Namecheap's own name servers `dns1.registrar-servers.com` and `dns2.registrar-servers.com` | VERIFIED live 2026-11-18 |
| Website host | Netlify, entirely separate from mail. `www` is a CNAME to `paws-passage-test.netlify.app`, apex resolves to Netlify addresses | VERIFIED live |
| Affiliate accounts | Never use hello@ (owner's rule); they use a separate address | Owner decision 2026-11-17 |

### Records live on 2026-11-18 (VERIFIED by DNS lookup)

| Type | Host | Value found | Note |
|---|---|---|---|
| MX | @ | `10 mx1.privateemail.com`, `10 mx2.privateemail.com` | Matches Namecheap's page (updated 10/8/2026): https://www.namecheap.com/support/knowledgebase/article.aspx/1338/2176/how-to-set-up-namecheap-private-email-dns-records-for-domains-on-namecheap-basicpremium-nameservers/ |
| TXT (SPF) | @ | `v=spf1 include:spf.privateemail.com ~all` | Matches. Only one SPF record is allowed per host. |
| TXT | @ | `google-site-verification=...` (Google Search Console) | Keep. Not email. |
| TXT | @ | `pinterest-site-verification=...` | Keep. Not email. |
| CNAME | autodiscover | `privateemail.com` | Optional record that helps mail apps self-configure. Keep. |
| DKIM TXT | `privateemail._domainkey` (new subscriptions) or `default._domainkey` (bought before 2026-06-02) | **Not found at either name** | Gap, see section 5 |
| DMARC TXT | `_dmarc` | **Not found** | Gap, see section 5 |
| CAA, `mail` CNAME | | None found | Nothing to do |

(The full DKIM value is long and private-looking; it was never needed here and is not copied. If one is created later, it lives in Namecheap and in DNS, not in the repo.)

## 2. Verified transfer options for a future owner

### 2a. Moving the domain does not move the mailbox (VERIFIED)
Namecheap's Change Ownership page says "Not all the domain-related services are moved to the destination account automatically along with the domain", and that Private Email and hosting accounts "need extra steps". Change Ownership is free, has no 60-day wait, and "the link is active for 7 days". https://www.namecheap.com/support/knowledgebase/article.aspx/1187/46/how-can-i-move-a-domain-from-one-namecheap-account-to-another/

### 2b. Move the Private Email subscription to the buyer's Namecheap account (VERIFIED route; fee and downtime UNCONFIRMED)
Namecheap: the transfer "is handled by Private Email representatives". The buyer must already have a Namecheap account. Contact **pesupport@namecheap.com** or Live Chat and send: the domain or order/transaction ID of the Private Email subscription, the seller's Namecheap username and Support PIN (Profile > Security), the buyer's username and full name. The page says "No emails or other data will be lost during the transfer" and **mentions no fee**. It does not state downtime. https://www.namecheap.com/support/knowledgebase/article.aspx/9925/2179/can-i-transfer-private-email-account-to-another-namecheap-user/
- **Never put the Support PIN in an email you keep, a chat log you paste into the repo, or any document.** Give it only to Namecheap support, then change it.
- UNCONFIRMED: whether support charges anything, and whether the mailbox is unavailable for some minutes. Ask in writing (N13) and keep the answer.

### 2c. Mailbox password hand-over (route VERIFIED; wording on what the buyer receives UNCONFIRMED)
- The mailbox password can be changed in the Namecheap dashboard (Private Email > Manage > the mailbox's edit menu > Change Password; it asks for the new password twice and the Namecheap **account** password) or inside webmail. It takes effect immediately. The mailbox password rules: at least 8 characters with an upper case letter, a lower case letter, a number and a symbol. Log out of webmail and mail apps first or the change is blocked. https://www.namecheap.com/support/knowledgebase/article.aspx/1053/2215/how-to-change-namecheap-private-email-password/
- Mail apps may use **app passwords** that keep working after the main password changes; revoke them in Namecheap's Security Center after a sale (paths on https://www.namecheap.com/support/knowledgebase/article.aspx/10816/2178/how-to-use-app-passwords-for-private-email/ , a search result snippet read today, so re-check the menu names).
- RECOMMENDED hand-over: after the subscription is on the buyer's account, the buyer sets a new mailbox password themselves. The seller should not send the old password at all. The two-factor sign-in on the mailbox (the plan includes 2FA) is set by the buyer.

### 2d. Moving the mailbox to a different provider (VERIFIED limits)
- Namecheap documents only moving mail **into** Private Email, using a desktop mail app: "At the moment, there is only one way to migrate your emails to Private Email: using the email clients" (add both mailboxes by IMAP and drag folders). It does not document an export tool for moving mail **out**, but the same IMAP method works in reverse. IMAP is preferred; POP3 "often deletes" mail from the server. https://www.namecheap.com/support/knowledgebase/article.aspx/10802/2226/how-to-transfer-emails-to-namecheap-private-email-account/ . Local backups can be saved as .eml/.mbox/.pst by the mail apps (https://www.namecheap.com/support/knowledgebase/article.aspx/9548/2226/how-to-back-up-emails-in-mail-clients/ , from a search result, UNCONFIRMED in detail).
- Cancelling through the Namecheap Admin Panel is described as **non-refundable**; a refund may be possible at Namecheap's discretion within 7 days of the charge, and Namecheap's two pages appear to conflict. Ask support first. https://www.namecheap.com/support/knowledgebase/article.aspx/10706/2179/how-to-cancel-your-private-email-subscription-via-namecheap-admin-panel/ and https://www.namecheap.com/legal/general/refund-policy/ (search-result summaries, UNCONFIRMED).

Safe order if the buyer prefers another provider: (1) create the new mailbox at the new provider, (2) copy mail by IMAP, (3) **only then** change the MX records to the new provider's values (and replace SPF/DKIM), (4) test both directions, (5) keep Private Email active for 30 days, (6) cancel. Do not change MX before step 2.

### 2e. DNS records stay at Namecheap (VERIFIED)
The MX records are in Namecheap's Advanced DNS because DNS is at Namecheap. A Change Ownership of the domain does not change DNS settings and Namecheap states no downtime for website or email (quoted in `docs/DNS-AND-TRANSFER.md` section 4).

### 2f. Renewal and expiry (VERIFIED)
Private Email renews from Private Email > Manage > Renew, only during Active or the first 30 days of Grace; after that only through support. Auto-Renew is recommended. Reducing mailboxes before renewal needs support. https://www.namecheap.com/support/knowledgebase/article.aspx/1167/2177/how-do-i-renew-my-namecheap-private-email-subscription/ . The renewal price is on the plan page ($14.88 a year for Launch, see `docs/COSTS-AND-ACCOUNTS.md`).

## 3. What the owner must do (checklist)

- [ ] Keep one person in control of the Namecheap login and its recovery email, with 2FA on (N6 in `COSTS-AND-ACCOUNTS.md`).
- [ ] Set Auto-Renew on for the domain and for Private Email; record both renewal dates in `docs/OPERATIONS-RECORD.md`.
- [ ] Keep a screenshot of Advanced DNS (every record) in a private folder, not the repo.
- [ ] Before a sale: ask Namecheap support the three open questions in writing (fee, downtime, password hand-over).
- [ ] After any DNS change anywhere: run the 10-minute email test in `docs/DNS-AND-TRANSFER.md` section 4.
- [ ] Use hello@ only as the public business address. Do not create other mailboxes (owner's rule) and do not use hello@ for affiliate accounts.

## 4. What must NOT be done

- **Never change the nameservers** away from Namecheap's unless every record is copied first; mail stops otherwise.
- **Never delete, edit or "tidy" the MX, SPF, DKIM or DMARC records**, the `autodiscover` CNAME, or the Google and Pinterest verification TXT records.
- Never add a second SPF record; merge any new sender into the single line (Namecheap warns multiple SPF records interfere).
- Never point the apex or `www` change at Netlify in a way that touches those records: the website needs only the apex ALIAS/A record and the `www` CNAME (see `docs/DNS-AND-TRANSFER.md` section 2).
- Never send the Support PIN, password or recovery codes by email or put them in a file in the repo.
- Never cancel Private Email before the replacement mailbox is tested.
- Never use a catch-all or forwarding rule that sends mail to an account you do not control.

## 5. Optional: DKIM and DMARC (NEEDS-YOU N7)

Why: the live domain has SPF only. DKIM signs outgoing mail; DMARC tells receivers what to do with mail that fails. Both improve delivery for a business mailbox. It is optional, free, and adds records only.

1. Namecheap > Private Email > Manage (the domain) > DKIM section > Generate / Show DKIM. Namecheap shows the host and value (new subscriptions use host `privateemail._domainkey`; older ones `default._domainkey`). https://www.namecheap.com/support/knowledgebase/article.aspx/10383/2176/how-to-set-up-a-dkim-record-for-private-email/
2. Domain List > Manage > Advanced DNS > Add New Record > type TXT, host exactly as shown, value pasted exactly as shown. Save. Do not touch any other row.
3. DMARC: add TXT host `_dmarc`, value in Namecheap's manual-setup form, starting with monitoring only: `v=DMARC1; p=none; rua=mailto:hello@pawsandpassage.com` (Namecheap's page uses a `postmaster@` example; use the address you actually read). Namecheap's example page notes one example lacks the colon after `mailto`, so use the manual form with the colon. Keep `p=none` until reports show nothing legitimate failing; Namecheap recommends quarantine or reject later but warns strict settings can affect forwarded or third-party mail. https://www.namecheap.com/support/knowledgebase/article.aspx/10846/2176/how-to-set-up-a-dmarc-record-for-private-email/
4. Wait up to 30 minutes. Test: send a message from hello@ to a Gmail address, open it, "Show original", and confirm SPF, DKIM and DMARC say PASS.
5. If anything fails, delete only the record you added.

## 6. What this changes elsewhere

`docs/OPERATIONS-HANDBOOK.md`, `BUYER_HANDOVER.md` and `docs/SALE-READINESS.md` now point to this page. Fees, downtime and password hand-over for the Private Email transfer remain **UNCONFIRMED** (Namecheap's page is silent), and the answers should be collected from support before any sale.
