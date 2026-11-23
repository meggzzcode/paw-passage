# Results: T2 Netlify

Date and time: 2026-11-23, about 6:55 PM to 7:05 PM Eastern time
Account confirmed (name only, no email): Megan Bhagwandat, signed in with the existing session. Nothing was typed to sign in.
Status: PASS for the read-only check. Certificate renew NOT DONE, waiting for Megan's yes in chat.

## What I recorded

Pages read: https://app.netlify.com/projects/paws-passage-test/overview, /deploys and /domain-management (read only, no setting changed, no deploy triggered, no button clicked).

Credits: the overview banner reads: 65 credits left, may not be enough. On the earlier Stage 0 check (B3) it showed 95 credits left, so about 30 credits were used between the two looks.

Latest production deploy: main@dbfa200, Skip Netlify builds for docs-only pushes to preserve credits, status Published, today at 6:41 PM, deployed in 20s. The site's home line reads: Published at 6:42 PM.

Recent production deploys (all Completed): main@31b7a22 at 6:23 PM (Replace home hero with credited Unsplash photo; update flip docs, 28s), main@ced2c93 at 6:10 PM (Remove links to unpublished guides; add internal-link regression test, 26s). Earlier: Nov 18 at 9:55 PM, 7:34 PM, 6:56 PM, 6:00 PM.

Deploy previews today (dependabot): Preview #6 at 1:40 PM and Preview #2 at 1:38 PM, both Completed. Older previews #3, #4, #5 on Nov 18.

Auto publishing: on. Deploys from main are published automatically. Repo connected: github.com/meggzzcode/paw-passage.

Domains listed: paws-passage-test.netlify.app, www.pawsandpassage.com (Primary domain), pawsandpassage.com (Redirects automatically to primary domain).

HTTPS certificate, exact wording: Certificate renewal incomplete: missing domains pawsandpassage.com. We can't renew your Let's Encrypt certificate automatically until the issue is resolved. Certificate: Let's Encrypt. Domains: pawsandpassage.com, www.pawsandpassage.com. Created Nov 16 at 8:52 PM. Updated Nov 16 at 8:55 PM. Expires Feb 14, 2027 (in 3 months).

Traffic seen on the overview (last hour at about 6:54 PM): 369 requests, 0.81% errors, 10.2 MB bandwidth.

No deploy of the cowork/flip-tasks branch had appeared in the list at the time of looking, shortly after the T1 commit. Branch deploys are not shown as enabled; Deploy Previews come only from pull requests.

## Problems or surprises

The certificate warning is still open. The apex domain pawsandpassage.com is not passing Netlify's check, so automatic renewal is blocked until its DNS is fixed. The current certificate is valid until Feb 14, 2027, so this is not urgent for a listing, but a buyer will ask about it.

Credits are low: 65 left on the Personal plan, with the banner saying they may not be enough. The new rule to skip builds for docs-only pushes should slow the drain.

I did not click Renew certificate because it needs Megan's yes. I asked in chat. Result: NOT DONE.

I did not check the billing page, so the credit reset date and plan price are UNVERIFIED.

## Screens Megan should screenshot herself

The Netlify team billing and usage page (credits used, plan, reset date) for the marketplace's private data room. Also the Domain management page showing the certificate warning, with her email hidden.
