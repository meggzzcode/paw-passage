# Website address, email and handover guide

> Written from the companies' published instructions on 2026-11-16. Not yet tried on live accounts.

This guide is for the person buying a small website business. It explains where everything lives, how to point the website address at the host, how to keep email working, and how to take over each piece. Wherever the companies' own pages do not say something, this guide says **NOT CONFIRMED - ask support** instead of guessing.

Plain-English words used below:
- **DNS**: the address book of the internet. It tells the world where your website and your email live.
- **Record**: one line in that address book. Each has a **type** (A, CNAME, MX, TXT...).
- **Apex domain**: the bare address, like `example.com`, with no `www`.
- **Nameservers**: the setting that says which company keeps your address book. **We are not changing these.**

---

## 1. The big picture

| Piece | Where it lives | What the buyer needs |
|---|---|---|
| Domain name (the address) | Namecheap (registrar) | A Namecheap account |
| Address book (DNS) | Stays at Namecheap | Same Namecheap account |
| Email | Namecheap Private Email | Same Namecheap account (the subscription is separate from the domain, see 6b) |
| Website host | Netlify (a different company) | A Netlify account and team |
| Website files (code) | GitHub repository | A GitHub account |
| Content editor (Pages CMS) | Pages CMS, signs in with GitHub | A GitHub account, plus installing the Pages CMS GitHub App |

Why DNS stays at Namecheap: your email records live there. If you move DNS to Netlify, those records must be copied first or email can stop (Netlify's own page warns: "If you have any existing records on your current DNS provider, such as MX records for email service, make sure to copy them to Netlify DNS first."). By leaving DNS where it is, you only add or change website records and never touch the email ones.

---

## 2. Setting up the website address

Do this once the Netlify site exists. In Namecheap: **Domain List > Manage > Advanced DNS**. In Netlify: **Domain management** for the site.

**Step 1.** In Netlify, add your custom domain to the site. Netlify says that if you add an apex domain or `www`, it adds both.

**Step 2.** Open the "Pending DNS verification" details next to your domain in Netlify (under Domain management > Production domains). Write down the values it shows. Use those, not anything from this guide, if they differ.

**Step 3. Apex record.** Netlify's page says: "Unlike subdomains, apex domains don't support CNAME records. You must configure your apex domain with an ALIAS, ANAME, flattened CNAME, or A record."
- Preferred type: ALIAS (or ANAME), host `@`, value `<value shown in Netlify under Domain management>`. Netlify's page names `apex-loadbalancer.netlify.com` for this.
- Fallback type: **A record**, host `@`. Netlify's page names the IP `75.2.60.5`. **Confirm this on your Netlify screen first**: Netlify also says sites on its "High-Performance Edge" use a different value shown in that screen.
- Whether Namecheap offers an ALIAS type in Advanced DNS: NOT CONFIRMED - ask support. If not, use the A record.

**Step 4. www record.** Type **CNAME**, host `www`, value `<value shown in Netlify under Domain management>` (your site's own Netlify address).

**Step 5. Clean up.** Delete old website records that conflict (see section 5). Do **not** touch MX or TXT records (section 3).

**Step 6. Wait.** Netlify says: "It may take a full day for the settings to propagate across the global Domain Name System."

Netlify also recommends: "we recommend using a subdomain for your primary domain when using external DNS." (For example making `www` the main address.) Ask the developer which is intended.

---

## 3. Email records that must NEVER be deleted

These make Namecheap Private Email work. Values below are exactly as Namecheap's page lists them (updated 10/8/2026). Your own screen is the final authority.

| Type | Host | Value | Priority |
|---|---|---|---|
| MX | @ | `mx1.privateemail.com` | 10 |
| MX | @ | `mx2.privateemail.com` | 10 |
| TXT (SPF) | @ | `v=spf1 include:spf.privateemail.com ~all` | - |
| TXT (DKIM) | `privateemail._domainkey` | long value starting `v=DKIM1;k=rsa;p=...` | - |
| TXT (DMARC) | `_dmarc` | Namecheap's example: `v=DMARC1; p=none; rua=mailto:postmaster@yourdomain.tld` | - |

Notes:
- Namecheap: "For Private Email subscriptions purchased before June 2, 2026, DKIM record's hostname is default._domainkey." Keep whichever name you already have.
- **Where to find the DKIM value**: Namecheap account > **Private Email** > **Manage** next to your domain > the DKIM section (**Generate** or **Show DKIM**) > copy the "DNS Record" field.
- DMARC: a separate Namecheap page says "We recommend using p=quarantine or p=reject to protect your domain from spoofing and phishing" and warns strict settings can affect forwarded or third-party mail. Keep whatever value is there; do not change it during handover.
- Only one SPF record is allowed per host. If you must add another sender, merge it into the existing line.
- Optional records (CNAME `mail`, `autodiscover`, `autoconfig`, an SRV record) help mail apps set themselves up. Keep them too.

**Before and after checklist**
- [ ] Before any change: take a screenshot of the whole Advanced DNS page (scroll to capture every record) and save it.
- [ ] Copy the DKIM value from the Private Email screen into a safe note.
- [ ] Change only the apex record and the `www` record.
- [ ] After: compare with the screenshot. Every MX and TXT line must still be there, unchanged.

---

## 4. Will email stop working?

| Action | Risk |
|---|---|
| Adding or editing the apex A/ALIAS record and the `www` CNAME | Safe for email (only website records) |
| Adding a Netlify domain, HTTPS changes | Safe |
| Pushing the domain to another Namecheap account | Namecheap says it "does not affect the DNS settings" and that there will be "no downtime (for both the website and the email service)" |
| **Changing nameservers** (for example to Netlify DNS) | **Risky**: all records must be copied first or email stops |
| **Deleting or editing MX or TXT records** | **Risky**: mail can bounce or land in spam |
| Moving the Private Email subscription | Downtime NOT CONFIRMED - ask support (see 6b) |

Namecheap says records take "up to 30 minutes" to apply.

**10-minute email test after any DNS change**
1. From a different provider (for example a personal Gmail), send a message **to** your business address.
2. Wait a few minutes, then check it arrived in the business inbox (also check spam).
3. From the business webmail, send a message **to** that outside address.
4. Check it arrives in the inbox, not spam.
5. Reply to each message and confirm the replies arrive.
6. If anything fails, compare the DNS page to your screenshot and restore the missing record.

---

## 5. HTTPS (the padlock)

Netlify does this by itself: "If you add a custom domain, we will automatically provision a certificate with Let's Encrypt, enabling HTTPS on your domain." Check progress in Netlify under Domain management > HTTPS. Certificates are renewed automatically.

What usually goes wrong (from Netlify's troubleshooting page):
- **Old AAAA records** (an older kind of address record) left from previous hosting. "Netlify's load balancer doesn't support IPv6". Remove all AAAA records.
- **More than one apex A record.** "Multiple A records on the apex domain will cause certificate failures." Keep only one.
- **A CAA record** that does not allow Let's Encrypt. "If your CAA record doesn't include Let's Encrypt, certificate provisioning will fail." Update or remove it.
- **DNS not yet spread around the world.** "You need 100% correct DNS records propagated globally before a certificate can be provisioned."

How long: Netlify retries "every 10 minutes for the first 24 hours, then once every hour for the following two days." If nothing after 24 hours, "there's likely a DNS misconfiguration".

(Checking Namecheap's Advanced DNS for AAAA and CAA records is our reasoning from Netlify's advice, not a Namecheap instruction.)

---

## 6. Handing over each piece, in this order

### (a) Namecheap domain
Account-to-account **Change Ownership**. Free ("The process is free of charge"). No downtime. Namecheap says you do not need to wait 60 days for this kind of move. Expired domains cannot be moved.

Seller steps: Domain List > Manage > **Sharing & Transfer** tab > **Change Ownership**; enter the recipient; enter your account password; choose the Registrant Contact option.
- **Buyer already has a Namecheap account**: enter their **username**, not their email ("please make sure to enter the username of a destination account, not the email address").
- **Buyer has no account**: enter their **email**, choose "Use current contacts". The buyer clicks the emailed link, signs in or creates an account using **that same email address**, clicks Accept, fills in their address, then clicks the email link again and Accepts again. The link "is active for 7 days" (stated on the main page; whether it applies to the no-account page is NOT CONFIRMED, assume yes).
- Domain Privacy and PremiumDNS subscriptions move with the domain. Apps subscriptions do not. "For the Private Email service and hosting account, some additional actions are required."
- Namecheap's wider page also mentions removing shared-access managers first, and that Namecheap cannot reverse the change. Read the page before starting.

### (b) Private Email subscription
**It is not pushed with the domain.** Two routes:
1. **Support-assisted transfer** (Namecheap page says "The transfer can be done by our Private Email representatives" and "No emails or other data will be lost during the transfer."). The buyer must already have a Namecheap account. Email pesupport@namecheap.com or use Live Chat, with: the domain or order ID, the seller's username and Support PIN (from the security profile), and the buyer's username and full name.
2. **New subscription on the buyer's account, then copy the mail** with an email app using IMAP (server `mail.privateemail.com`, port 993, SSL). Namecheap says this is the only migration method "at the moment", warns POP3 is risky for transfers, and says it takes a while. Mailbox addresses stay the same because the domain and MX records stay put.

NOT CONFIRMED - ask support: fees for the support transfer; how mailbox passwords are handed over (the buyer can likely reset them after taking over, but no Namecheap page says so); any downtime during the transfer.

### (c) GitHub repository
From GitHub's docs: the seller (needs admin access) opens the repository > **Settings** > **Danger Zone** > **Transfer**; enters the buyer's username or organization; reviews the warnings; types the repository name to confirm. A personal-account recipient must accept, and "the confirmation email expires after one day". Old links redirect automatically. The seller stays as a collaborator unless removed afterwards. Moving a private repo to a Free account removes some features (for example protected branches).

### (d) Netlify site
Buyer creates a Netlify account and a team. Netlify: "As a Team Owner, you can transfer a project to another team if team transfers are allowed and you are also an Owner or Developer on the team you are transferring to." So the seller needs to be an Owner or Developer on the buyer's team (invite them temporarily), or contact Netlify support.
Steps: Project configuration > General > Project information > **Transfer project**.
After transfer, check and reconnect: the Git link to the repository, environment variables, the custom domain, and HTTPS. Netlify's transfer page does **not** say what happens to these: NOT CONFIRMED - ask support. Members not in the new team lose dashboard access. If the new team is on a lower plan, plan-only settings are lost. Fees for transfer: none stated.

### (e) Pages CMS (content editor)
The buyer signs in with GitHub at the Pages CMS site and installs the Pages CMS GitHub App on the account or organization that owns the repository (the quick start says "Sign in with GitHub" and "Install the GitHub App on the account or organization that owns your repository"). Do this after the repository transfer.
Helpers: "Collaborators are invited by email" and can open invited repositories and edit content and media. They cannot manage settings or other collaborators.
NOT CONFIRMED - ask support: whether a person with no GitHub account can actually sign in (one release note suggests sign-in still goes through GitHub); whether a private repository is supported; price and limits of the hosted service; how branches and publishing work.

### (f) Affiliate programs
Affiliate accounts are normally tied to a person or business, so the buyer usually has to apply again. Links on the site must be replaced with the buyer's own. This is general practice, not from the companies above: check each program's terms. Until replaced, commission goes to the seller.

---

## 7. Risks and unknowns

| Item | Why it matters | How to find out before the sale | Who to ask |
|---|---|---|---|
| 60-day lock after owner change | The ICANN rule can block moving the domain to another registrar after a contact change. Namecheap's sources **conflict**: the Change Ownership page says no 60-day wait for account moves; Namecheap's registration agreement (could not be fetched) reportedly lets you opt out; another Namecheap page claims a lock may apply. NOT CONFIRMED. | Ask whether a later registrar transfer will be blocked | Namecheap support |
| Private Email transfer fees and downtime | Cost and email outage | Ask in writing before agreeing a price | pesupport@namecheap.com |
| Mailbox passwords | Buyer must be able to log in | Agree who resets them, and when | Namecheap support |
| 2FA and recovery email | If the seller's login or recovery email stays on the account, they keep a way in. Namecheap's 2FA page says nothing about lost devices. | Seller removes themselves; buyer sets their own 2FA | Namecheap support |
| Domain auto-renew and expiry | A missed renewal loses the domain | Buyer checks auto-renew and contacts after the push (NOT CONFIRMED where; look in Domain List > Manage) | Namecheap support |
| Private Email billing | Renewal works only while active or in the 30-day grace period; after that only via support | Buyer checks the renewal date and Auto Renew setting | Namecheap support |
| Netlify transfer side effects | Git link, variables, domain and HTTPS may need redoing | See 6d | Netlify support |
| Netlify Free plan | Credit-based limits apply; whether commercial use is allowed is NOT CONFIRMED | Read Netlify's terms | Netlify support |
| Pages CMS | See 6e | See 6e | Pages CMS maintainers |
| Affiliate programs | Income may not transfer | Read each program's terms | Each program |

---

## 8. Day of sale checklist (email never stops)

**Before**
- [ ] Buyer has Namecheap, GitHub and Netlify accounts (and a Netlify team).
- [ ] Screenshot every Advanced DNS record; save the DKIM value.
- [ ] Ask Namecheap support the open questions in section 7 (in writing).
- [ ] Seller sends a test email to and from the business address (section 4).

**Transfer, in this order**
- [ ] 1. Domain: seller starts Change Ownership; buyer accepts.
- [ ] 2. Run the 10-minute email test.
- [ ] 3. Private Email: send the support request (or set up the new subscription and copy mail by IMAP). Do not delete the old one until the new mailboxes are checked.
- [ ] 4. Run the email test again.
- [ ] 5. GitHub: transfer the repository; buyer accepts.
- [ ] 6. Netlify: transfer the project; reconnect Git link and environment variables.
- [ ] 7. Netlify: confirm the custom domain and the DNS records match section 2; wait for HTTPS.
- [ ] 8. Pages CMS: buyer signs in with GitHub and installs the app on the repository.
- [ ] 9. Replace affiliate links.

**After**
- [ ] Compare DNS to the screenshot: all MX and TXT records still present.
- [ ] Final email test.
- [ ] Seller is removed from all accounts and recovery emails.
- [ ] Buyer sets their own 2FA, auto-renew and billing.

---

## Sources

Namecheap
- https://www.namecheap.com/support/knowledgebase/article.aspx/1187/46/how-can-i-move-a-domain-from-one-namecheap-account-to-another/
- https://www.namecheap.com/support/knowledgebase/article.aspx/10111/46/how-can-i-move-a-domain-name-to-another-person-who-doesnt-have-a-namecheap-account-yet/
- https://www.namecheap.com/support/knowledgebase/article.aspx/1338/2176/how-to-set-up-namecheap-private-email-dns-records-for-domains-on-namecheap-basicpremium-nameservers/
- https://www.namecheap.com/support/knowledgebase/article.aspx/10383/2176/how-to-set-up-a-dkim-record-for-private-email/
- https://www.namecheap.com/support/knowledgebase/article.aspx/10846/2176/how-to-set-up-a-dmarc-record-for-private-email/
- https://www.namecheap.com/support/knowledgebase/article.aspx/9925/2179/can-i-transfer-private-email-account-to-another-namecheap-user/
- https://www.namecheap.com/support/knowledgebase/article.aspx/10802/2226/how-to-transfer-emails-to-namecheap-private-email-account/
- https://www.namecheap.com/support/knowledgebase/article.aspx/1167/2177/how-do-i-renew-my-namecheap-private-email-subscription/
- https://www.namecheap.com/support/knowledgebase/article.aspx/9253/45/how-can-i-enabledisable-twofactor-authentication/
- https://www.namecheap.com/legal/domains/registration-agreement/ (returned an error when fetched; the 60-day point is unverified)

Netlify
- https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- https://docs.netlify.com/manage/domains/set-up-netlify-dns/
- https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/
- https://docs.netlify.com/manage/domains/troubleshooting/troubleshoot-ssl-and-https/
- https://docs.netlify.com/manage/projects/transfer-project/

GitHub
- https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository

Pages CMS
- https://pagescms.org/docs/quick-start/
- https://pagescms.org/docs/configuration/collaborators/
- https://pagescms.org/docs/development/authentication/
