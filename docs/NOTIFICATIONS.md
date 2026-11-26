# Notifications (Web Push, optional)

Optional, opt-in reminders for paying customers. The website works fully without them: nothing here is needed to buy, use or restore. No permission prompt is ever shown automatically; the client asks only after an explicit tap. Facts come from the code; anything not proven against a live service is marked **UNVERIFIED**.

## Status: paused

Push and the PWA are paused (`PWA_ENABLED=false`, `flags.notifications=false`). The scheduled function `netlify/functions/push-deliver.ts` therefore has **no `config.schedule`** and does not run on its own, so there are no idle invocations. The handler code is unchanged. To restore it when push is relaunched, add `export const config = { schedule: "*/15 * * * *" };` back to that file (the line is kept in a comment there), turn the flags on, and redeploy to production. Everything below describes the design once it is running; the 15-minute figures apply only after the schedule is restored.

## Architecture

```
browser (settings UI, after an explicit tap)        Netlify Function api.ts            Netlify Scheduled Function
  /api/push/*  /api/notifications/*  /api/schedule/*  --> src/server/passport/        push-deliver.ts (schedule PAUSED)
  cookie pp_session + x-pp-csrf + same-origin           notifications-api.ts            -> push-deliver.ts (runDelivery)
                                                        push-store.ts (customers-<env>)    reads due buckets only
                                                        push-queue.ts (due-bucket index)   -> push-sender.ts -> web-push -> push service
```

Files (all in `src/server/passport/`): `notifications-api.ts` (endpoints and strict validation), `notifications-copy.ts` (fixed copy table, payload builder), `schedule.ts` (pure time logic, Intl only), `push-store.ts` (records, due buckets, compare-and-set), `push-queue.ts` (what must be queued), `push-deliver.ts` (the run), `push-sender.ts` (the only code that talks to a push service; uses the maintained `web-push` package, no custom crypto), `push-netlify.ts` (wiring). The function file is `netlify/functions/push-deliver.ts`. Tests inject a fake sender and in-memory stores: no test touches the network.

### Endpoints

All except `config` need the existing session cookie, an active entitlement, and (for changes) same-origin plus the CSRF header. All are `no-store` JSON, size-limited (4 KB subscribe, 2 KB others), strictly validated (unknown keys are refused), and rate-limited (per IP like every endpoint, plus 40 changes per minute per customer, held in function memory: best effort per instance). The customer is always the one in the signed cookie, never a body field.

| Route                                                    | Purpose                                                                                                           |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `GET /api/push/config` (public)                          | `{ enabled, publicKey }`. `enabled` only when the kill switch is on AND keys are configured.                      |
| `POST /api/push/subscribe`                               | Register a device. Max 5 per customer. Re-subscribing the same endpoint updates it. Refused (503) while disabled. |
| `DELETE /api/push/subscribe`                             | `{ deviceId }`.                                                                                                   |
| `GET /api/push/devices`                                  | `{ devices: [{ deviceId, label, createdAt, primary }] }`. Never endpoints or keys.                                |
| `POST /api/push/primary`                                 | `{ deviceId }`.                                                                                                   |
| `GET` / `PUT /api/notifications/prefs`                   | The prefs object itself (no wrapper), as in the V5 contract. All off by default.                                  |
| `DELETE /api/notifications`                              | Opt out of everything: removes devices, prefs and markers. Saved plans stay (they are the customer's own data).   |
| `GET /api/schedule`, `PUT` / `DELETE /api/schedule/<id>` | Plans. `PUT` returns `{ ok, plan }` with a server `updatedAt`. Max 50 live plans.                                 |

**SSRF guard.** An endpoint must be `https`, with no credentials, port 443 only, no fragment, at most 600 characters, and the host must be exactly `fcm.googleapis.com` or `updates.push.services.mozilla.com`, or end in `.push.apple.com` or `.notify.windows.com` (with a label in front). Anything else is rejected before storage, so the delivery run can never be pointed at an arbitrary URL. The `web-push` library then sends only to a stored, validated endpoint. Keys must decode to 65 bytes (p256dh, first byte 0x04) and 16 bytes (auth).

### Payload

`{ kind, title, body, url, tag }`, under 1 KB, from a fixed copy table (`notifications-copy.ts`). `url` is one of the allow-listed same-origin paths (checked again before sending; the service worker checks it a third time). No adventure text, no license data, no session data, no names. Planned reminders refer to the plan id only. Copy rules: warm, optional, never guilt, streaks or urgency; a test scans the table for banned phrases (`haven't played`, `is waiting`, `missed`, `streak`, `falling behind` and others) and for weather claims.

### Delivery design

- **Due-bucket index.** A bucket is one small blob per 15-minute slot, `notifdue/<slot>` (slot = floor(epoch ms / 900000)), holding entries `{customer, kind, ref}`. The run reads only the slots from its cursor (`notifcursor`) to now. It never lists customers or scans.
- **The customer record is the source of truth** (`notif/<customer>`). A bucket entry is a hint: when it comes due it is dropped if the record no longer agrees (edited plan, changed day, opted out, deleted). Edits therefore need no bucket surgery.
- **Weekly, saved and seasonal share one chain** per customer (one pending general slot, `gnext`), computed from the weekly day, time and zone with `nextWeeklyOccurrence` (steps the local date, never "+7 x 24 h", so wall-clock time survives DST). Each general slot sends at most one notification: seasonal in the first seven days of March, June, September and December (once per season), else saved on a spread-out one-in-four-weeks cadence, else weekly. A week marker blocks a second general send in the same ISO week even if the customer changes the day.
- **Planned reminders** use `plannedReminderDueMs`: `at` and `1h` are exact; `1d` is the same local wall-clock time on the previous calendar day (23 or 25 hours on DST days; a time that does not exist moves to just after the gap). They are sent at the 15-minute run at or just before the due time (never after the start). Done, cancelled, deleted and edited plans never fire the old time.
- **Quiet hours** (default 21:00 to 08:00 in the customer's zone): a send inside them is delayed to the end, if that is at most six hours away and, for a reminder, before the event starts; otherwise it is skipped, never sent late.
- **Idempotent.** A delivery marker is written (compare-and-set) before the send, so overlapping or repeated runs cannot double-send. The trade-off is at most once: a crash between marker and send loses that one notification.
- **Devices.** Weekly, saved and seasonal go to the primary device (first device if none chosen). Planned reminders go to every device (up to 5). A push service answer of 404 or 410 removes that device; if none is left the chain stops.
- **No retries.** A failed or non-2xx send (other than 404/410) is counted and forgotten. Items in a bucket more than two hours old are **stale**: nothing is sent, weekly chains are rescheduled to the next future occurrence, reminders are dropped.
- **Bounded work per run:** at most 96 slot reads, 150 entries, 8 in parallel, and no new work after 20 seconds (Netlify's limit is 30 seconds). Leftover entries finish on the next run; a long outage is caught up by up to 96 slots per run.
- **Order of checks per entry:** kill switch (once per run, first) -> record agrees -> entitlement is `active` (else all notification data is removed) -> pref enabled -> quiet hours -> week marker -> marker write -> send.
- **Logging.** Only aggregate counts (`push_run`: slots, entries, accepted, pruned, failed, skipped, deferred, stale, errors) and event names. Never an endpoint, key, payload, customer id or body.

## Data model and retention

| Key (store `customers-<env>`) | Content                                                                                                                                                                                                                        | Size                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `notif/<cus_id>`              | devices (subscription **sealed** with AES-256-GCM under the data key, plus a keyed hash of the endpoint to spot repeats, label, created), primary, prefs, plans (max 50 live, 100 stored), delivery markers, next general slot | about 1 KB with one device, at most about 20 KB (5 devices, 100 plans) |
| `notifdue/<slot>`             | array of `{c, k, r, at?}` entries, about 70 bytes each                                                                                                                                                                         | grows with customers sharing a slot                                    |
| `notifcursor`                 | `{ slot }`                                                                                                                                                                                                                     | tiny                                                                   |

Retention: no history is kept. Delivery markers expire after 14 days (dropped on the next write). Opt-out (`DELETE /api/notifications`) removes devices, prefs and markers. Account deletion, refund, dispute and revocation remove the whole `notif/<id>` record (`CustomerStore.remove` and `setEntitlement`), and the delivery run checks entitlement again before every send and purges if it is not active. Bucket entries that outlive a customer are inert and are deleted when their slot is processed. Plans are the customer's own schedule data: opt-out keeps them; delete and revoke remove them.

## Security

- Customers only, via the existing signed session, same-origin and CSRF checks; the browser never names a customer.
- Subscriptions are stored sealed, never returned, never logged. Responses carry no endpoints or keys.
- Strict validation everywhere, size limits, per-IP and per-customer rate limits (in memory, per instance: slows abuse, not a global guarantee).
- SSRF guard on endpoints (above). The push library is injected, so the endpoint is the only thing a customer controls.
- The VAPID private key exists only as the environment variable `VAPID_PRIVATE_KEY`. It is never written to the repository, a log or a response; only `VAPID_PUBLIC_KEY` is served.
- Payloads are fixed copy plus an allow-listed path.

## Kill switch

Delivery and subscribing run only when **both** hold: the env var `NOTIFICATIONS_ENABLED` is exactly `true` and VAPID keys are configured. The owner can also write the blob `notifications/flag` = `{"enabled": false}` in the store `premium-<env>` (read on every config call and every run) to stop delivery without touching the environment. The scheduled function checks the switch first on every run and then does nothing (no reads). While it is off the cursor does not move: after more than about two hours off, buckets from the pause are treated as stale (nothing is sent late; weekly chains are rescheduled). UNVERIFIED: whether an environment variable change reaches already-deployed functions without a new deploy; plan for a redeploy.

## Required environment variables

| Variable                        | Meaning                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NOTIFICATIONS_ENABLED`         | `true` to allow subscribing and delivery. Anything else is off.                                                                                        |
| `VAPID_PUBLIC_KEY`              | Public application server key (served by `/api/push/config`).                                                                                          |
| `VAPID_PRIVATE_KEY`             | Private key. Mark as a secret. Never commit, paste into chat or log.                                                                                   |
| `VAPID_SUBJECT`                 | `mailto:` address or `https:` URL identifying the sender.                                                                                              |
| `SESSION_SECRET`, `PP_DATA_KEY` | Existing. `PP_DATA_KEY` (or `SESSION_SECRET`) also seals the stored subscriptions: keep it stable, or stored devices become unreadable and are pruned. |

The **owner** generates the keys once, on their own machine: `npx web-push generate-vapid-keys`. It prints a public and a private key; put them in the Netlify environment variables and nowhere else. Claude does not generate or handle these keys. Rotating the keys invalidates every existing subscription (devices must re-subscribe).

## Preview and production isolation

Same rule as the premium endpoints: only a `production` deploy context uses `customers-production` and `premium-production`; every other context (deploy preview, branch deploy, dev, unknown) uses the `-preview` stores (`storeEnv`). Netlify runs scheduled functions only for published production deploys, so previews never deliver on their own; a manual "Run now" on a preview would read only preview data. Preview and production use separate VAPID configuration if the owner sets different values per context (recommended: leave `NOTIFICATIONS_ENABLED` unset for previews).

## Limitations

- Best effort: delivery depends on the push services and the device; notifications can be late, collapsed or dropped. The client must never promise a time. Reminders and weekly sends arrive on the 15-minute run grid.
- At most once per item; no retries; a missed item is not resent.
- iOS and iPadOS: Web Push works only for a site added to the Home Screen as a web app, on 16.4 or later, with the permission asked from a tap (WebKit blog, "Web Push for Web Apps on iOS and iPadOS").
- Subscriptions can expire; the client should re-register on `pushsubscriptionchange` (service worker, P1/P3). Gone devices are pruned only when a send learns of it.
- Time-zone name heuristics decide the hemisphere for seasonal copy; it is a label only and never a weather claim.
- A weekly chain whose processing throws is re-queued once for the next run; if that also fails it is rebuilt the next time the customer saves their settings.
- Rate limits are per function instance.

## Operating cost model

Credit rates **read in Netlify's "How credits work" page** (billing for credit-based plans):

| Meter                                  | Rate read                                                       |
| -------------------------------------- | --------------------------------------------------------------- |
| Function compute                       | 10 credits per GB-hour (memory x execution time)                |
| Web requests (function requests count) | 2 credits per 10,000 requests                                   |
| Bandwidth                              | 20 credits per GB                                               |
| Production deploy                      | 15 credits each (build minutes are not charged separately)      |
| Included credits                       | Free 300 per month (hard limit); Personal 1,000; Pro from 3,000 |

**UNVERIFIED** (not on the pages read): Blobs storage and operation rates (the page says only that Blobs and Database fall under the compute and bandwidth meters, with no per-operation rate); whether a scheduled invocation counts as a web request; whether outbound requests to push services count as bandwidth; the default function memory (1 GB is assumed here); how a function that exceeds the Free plan's hard limit is handled. Scheduled functions are documented as available on all plans, with a 30-second limit, UTC cron and production-only runs.

### Assumptions

- Cumulative paying customers N = 100 / 1,000 / 5,000 / 10,000. Cron every 15 minutes = 96 x 30 = **2,880 invocations per month** (idle or not).
- 15% of customers opt in (assumption; if you see more, scale the delivery column linearly), 1.3 devices per opted-in customer.
- Each opted-in customer receives 1 general notification per week (4.33 per month, to one device) and has 2 planned reminders per month (2 x 1.3 = 2.6 device sends). Entries processed = opted x (4.33 + 2).
- Notification API traffic: 3.7 calls per customer per month (config, settings reads, 0.6 plans x 3 calls), each 0.15 s at 1 GB.
- Idle cron run: 0.5 s at 1 GB (cursor read, one bucket read, cursor write). Delivery: 0.25 s at 1 GB per entry (a conservative figure, since 8 run in parallel).
- Blob operations per delivered entry: about 8 (customer read, record read, marker write, bucket flush share, bucket remove share, device prune on demand). Idle run: about 4.
- Bytes: record about 2 KB per opted-in customer, bucket entry about 70 bytes, push request about 2 KB, API response about 2 KB, blob transfer about 20 KB per entry in total.
- No retries are made, so retry cost is zero by design (failed sends are counted, not repeated).

### Results (per month, credits from the rates above; blob ops and storage unpriced because UNVERIFIED)

|                                    | 100         | 1,000       | 5,000        | 10,000       |
| ---------------------------------- | ----------- | ----------- | ------------ | ------------ |
| Opted-in customers (15%)           | 15          | 150         | 750          | 1,500        |
| Push sends (device deliveries)     | 104         | 1,040       | 5,198        | 10,395       |
| Entries processed                  | 95          | 950         | 4,748        | 9,495        |
| Cron invocations (idle floor)      | 2,880       | 2,880       | 2,880        | 2,880        |
| API calls                          | 370         | 3,700       | 18,500       | 37,000       |
| Blob operations (est.)             | 12,300      | 19,100      | 49,500       | 87,500       |
| Stored notification data (est.)    | 30 KB       | 300 KB      | 1.5 MB       | 3 MB         |
| Bandwidth (est.)                   | 0.003 GB    | 0.03 GB     | 0.13 GB      | 0.26 GB      |
| Credits: cron (compute + requests) | 4.6         | 4.6         | 4.6          | 4.6          |
| Credits: delivery compute          | 0.1         | 0.7         | 3.3          | 6.6          |
| Credits: API (compute + requests)  | 0.2         | 2.3         | 11.4         | 22.8         |
| Credits: bandwidth                 | 0.05        | 0.5         | 2.6          | 5.3          |
| **Total credits**                  | **about 5** | **about 8** | **about 22** | **about 39** |
| Share of Free (300)                | 2%          | 3%          | 7%           | 13%          |
| Share of Personal (1,000)          | 0.5%        | 0.8%        | 2%           | 4%           |

Sensitivity: at a 40% opt-in rate the 10,000-customer total is about 70 credits (about 7% of Personal); at 20 plans per month per opted-in customer delivery compute stays under 25 credits. A single production deploy (15 credits) costs more than the whole 100-customer month of notifications. These are estimates from stated assumptions, not measurements; check the Netlify usage page after launch.

### Recommendation

- Keep the **15-minute cron** at every size in the table: the idle floor is about 4.6 credits a month (about 1.5% of the Free allowance) and 15-minute precision is what makes "at the time" and "1 hour before" reminders usable.
- Moving to **hourly** (720 invocations, about 1.1 credits) saves roughly 3.5 credits a month at any size: not worth the loss of precision. Reconsider only if (a) the owner confirms Blobs operations are billed at a rate that makes the idle 11,500 operations a month material, or (b) notifications grow past roughly 10,000 customers with the Free plan, or (c) planned reminders are not offered. If hourly is chosen, change `schedule` in `netlify/functions/push-deliver.ts` to `0 * * * *`, set `LIMITS.staleMs` and the plan reminder slot rule to hour granularity (`SLOT_MS`), and tell customers reminders arrive "around" the chosen hour.
- Watch these thresholds after launch: delivery run time approaching 20 seconds (raise concurrency or add a second run), a bucket of more than 500 entries in one slot (stagger the default send time by customer), and any Blobs operation line on the usage page.
- The kill switch is the cost brake: set `NOTIFICATIONS_ENABLED` to anything but `true` and the function exits before any read.

## Sources read for this page

- Netlify Docs, Scheduled functions (inline `config.schedule`, UTC cron, 30-second limit, published deploys only, no URL invocation).
- Netlify Docs, How credits work (the rates quoted above).
- Netlify Docs, Netlify Blobs (limits and consistency; no pricing on that page).
- MDN, Push API best practices (ask only after a user interaction; offer an easy opt-out; keep notifications assistive).
- WebKit blog, Web Push for Web Apps on iOS and iPadOS (iOS and iPadOS 16.4, Home Screen install with a standalone manifest, permission from a direct user gesture, allow `*.push.apple.com`).
- Apple's developer documentation page for sending web push notifications did not return readable content and is **not cited**. TTL, urgency and 404/410 handling follow RFC 8030 and the `web-push` library, **UNVERIFIED** against Apple's own page.
