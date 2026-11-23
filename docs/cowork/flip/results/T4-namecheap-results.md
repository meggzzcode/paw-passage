# Results: T4 Namecheap

Date and time: 2026-11-23, evening, Eastern time
Account confirmed (name only, no email): the Namecheap session was already signed in as the account username shown in the top bar, meggzz. I did not sign in or switch accounts.
Status: PASS (read only; nothing was changed)

## What I recorded

Pages read: Domain List > pawsandpassage.com > the Domain, Sharing & Transfer and Advanced DNS tabs, at ap.www.namecheap.com/domains/domaincontrolpanel/pawsandpassage.com/domain, /dcp/share/pawsandpassage.com/rights and /advancedns.

Status and validity: ACTIVE, Nov 16, 2026 to Nov 17, 2027. AUTO-RENEW is OFF (the toggle is off). I did not touch it.

Domain privacy (WithheldforPrivacy): ON, Nov 16, 2026 to Nov 16, 2027, auto-renew off.

Nameservers: Namecheap BasicDNS. PremiumDNS not enabled. Redirect Domain: none defined. DNSSEC: off. Parking Page: OFF.

Private Email: validity Nov 17 2026 to Nov 17 2027, 1 of 1 mailboxes in use.

Domain contacts: the registrant, administrator, technical and billing contacts all show the same person (Megan Bhagwandat). I did not copy the address, phone or email.

Sharing & Transfer tab, official wording on the page:
Change Ownership: With a change of ownership, you fully relinquish ownership of the domain (along with some associated services) and designate a new owner. If the new owner doesn't have a Namecheap account yet, she or he will have the option to create one.
Transfer Out: To transfer out, you will need to make sure that Domain Lock is turned OFF and get an Auth Code. After you place the request here, we'll send your Auth Code to the registrant email address specified for this domain. It may take up to 5 days for the transfer to be completed.
Domain Lock: ON (an UNLOCK button is shown). I did not click it and did not request an Auth Code.

Advanced DNS host records (4 records):
ALIAS Record, host @, value apex-loadbalancer.netlify.com., TTL 5 min.
CNAME Record, host www, value paws-passage-test.netlify.app., TTL 30 min.
TXT Record, host @, a google-site-verification value (Search Console).
TXT Record, host @, a pinterest-site-verification value.
Mail settings: Private Email, configured automatically.

The 60-day registrar-to-registrar transfer rule and the free account-to-account Change Ownership route are recorded with their official Namecheap URLs in the private B2 notes (B2-namecheap-rules.md). Not repeated here.

## Problems or surprises

The domain was registered Nov 16, 2026, so a registrar-to-registrar transfer cannot happen for 60 days. Change Ownership between Namecheap accounts is the only quick handover route, and it is final, so it should only be used with a buyer who has paid through escrow.

Auto-renew is OFF on the domain and on its privacy product. If nobody turns it on, the domain expires Nov 17, 2027. A buyer will want auto-renew on, so Megan should decide when to switch it on. I did not change it.

The Netlify certificate warning (T2) names the apex domain pawsandpassage.com as missing. The DNS here has an ALIAS record for @ pointing at Netlify's apex load balancer and a CNAME for www pointing at the Netlify project, which looks correct on its face. Whether Netlify's check simply needs another renewal attempt is UNVERIFIED. I did not test it.

The Domain Lock is ON. That is the safe setting while the site is for sale.

## Screens Megan should screenshot herself

The Domain tab (status, dates, auto-renew), the Sharing & Transfer tab, and the Advanced DNS host records, with her name, address, phone and email cropped out, for the marketplace's private data room.
