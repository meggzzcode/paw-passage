# PWA device test checklist

Nothing in this file is verified. Every row below is blank until a person runs it on a real device and fills it in. Documentation, emulation and unit tests do not count. For the owner or Cowork to run; Claude cannot test on devices.

**Status: PAUSED.** The PWA is off (`PWA_ENABLED=false`: no manifest link, no service worker registration, any earlier worker and cache are removed) and push is off (`flags.notifications=false`). This checklist is needed only if the owner decides to turn them on (decision OD9; Cowork task C10 in `COWORK-HANDOFF.md`). Row ids below (A1, B1 ...) belong to this checklist only; they are not Cowork task ids.

## Install prompts stay hidden until these pass

`PWA_PROMPTS_ENABLED` in `src/lib/pwa.ts` ships `false`: no install prompt, no install card, no link to `/install`, and no customer-facing claim about PWA or offline use. Change it to `true` only when every row marked REQUIRED in sections A to H has Pass, with OS and browser versions, date and tester filled in, on at least one iPhone (Safari, iOS 17.2 or later), one Android phone (Chrome) and one desktop browser. Any Fail on a REQUIRED row keeps the flag `false`; record the failure and the decision in `docs/PWA.md`. Notification rows (section I) gate only the notification wording, not the flag.

## Test record

| Field                                                    | Value |
| -------------------------------------------------------- | ----- |
| Tester                                                   |       |
| Date                                                     |       |
| Device model                                             |       |
| OS and exact version                                     |       |
| Browser and exact version                                |       |
| Site build or deploy id                                  |       |
| Test purchase (provider reference, no code written here) |       |

## Checklist

Use a permitted test purchase only (E5 to E7). Never write a purchase code into this file. Pass/Fail: P or F. Exact versions: fill per row if they differ from the record above.

| #   | Step                                                                                                                                                                                                                          | REQUIRED | OS / browser version | Pass/Fail | Date | Tester | Notes |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------- | --------- | ---- | ------ | ----- |
| A1  | In an ordinary browser tab, complete the free intro adventure, save two previews, then purchase. Activation succeeds and the library unlocks.                                                                                 | Yes      |                      |           |      |        |       |
| A2  | During A1 no install prompt, install card or install link appeared (discovery, checkout, free completion, `/unlock`, home, footer, FAQ).                                                                                      | Yes      |                      |           |      |        |       |
| B1  | After activation the sync line reads Saved. On a second browser or device, Restore access brings back intro progress, saved previews and the profile.                                                                         | Yes      |                      |           |      |        |       |
| B2  | Create a plan with reminders OFF in the tab. It appears under Upcoming on the second device (plans sync regardless of push).                                                                                                  | Yes      |                      |           |      |        |       |
| C1  | With the flag set to true in a test build only: the install invitation appears only after B1 (Saved), never before. Dismiss: it does not return for 90 days.                                                                  | Yes      |                      |           |      |        |       |
| C2  | Add to Home Screen following `/install` (iPhone: Safari Share, Add to Home Screen; Android: Chrome menu, Install app; desktop: address-bar install). The icon appears and opens standalone (no browser bars).                 | Yes      |                      |           |      |        |       |
| D1  | First launch of the installed app: record whether the customer is already signed in (session cookie copied). iOS 17.2 and later should copy it per WebKit; record the truth for each OS.                                      | Yes      |                      |           |      |        |       |
| D2  | If signed in: the app fetches the synced save and entitlement (Saved appears, premium library loads, plans listed). Local progress started empty, so everything shown came from the server.                                   | Yes      |                      |           |      |        |       |
| D3  | If not signed in: the first screen shows "Bought the Passport already? Restore access" prominently. Restore access with the emailed code works, and no code appears in the address bar or history.                            | Yes      |                      |           |      |        |       |
| D4  | Record what did NOT carry over: localStorage progress, the `pp.acct.v1` flag, notification permission. Confirm free progress from the tab is not in the installed app.                                                        | Yes      |                      |           |      |        |       |
| E1  | Make an edit in the installed app (complete an adventure). It appears in the browser tab after a refresh or focus, and the reverse.                                                                                           | Yes      |                      |           |      |        |       |
| E2  | Ship a new site version (bump the worker VERSION). Both the tab and the installed app show "A new version is ready" and update after Refresh; no stale pages.                                                                 | Yes      |                      |           |      |        |       |
| F1  | Empty-state protection: in the installed app with an empty local store, sign in. Progress is pulled first; the synced progress, profile, saved items and plans are all still on the server afterwards (check from the tab).   | Yes      |                      |           |      |        |       |
| F2  | Repeat F1 after clearing site data in the tab, then Restore access. Nothing on the server is lost or reset.                                                                                                                   | Yes      |                      |           |      |        |       |
| F3  | Make the same plan edit on two devices while one is offline, then reconnect. The newer edit wins; a cancelled plan stays cancelled.                                                                                           | Yes      |                      |           |      |        |       |
| G1  | Uninstall the home-screen app, reinstall it. Record what is signed in and what needs Restore access.                                                                                                                          | Yes      |                      |           |      |        |       |
| G2  | Session expiry: after the 30-day session ends (or after deleting the cookie in Settings), the installed app shows the Restore access panel and recovers with the code.                                                        | Yes      |                      |           |      |        |       |
| H1  | Purchase recovery after clearing local data: clear site data in the browser, open Restore access, enter the code. Library, profile, saved previews, completed adventures and plans return.                                    | Yes      |                      |           |      |        |       |
| H2  | Purchase recovery with no email access: the documented fallback path (support contact) works as written.                                                                                                                      | Yes      |                      |           |      |        |       |
| I1  | Notification permission is requested only after an explicit tap, inside the installed app on iPhone (iOS 16.4 or later). Outside the installed app on iPhone the settings say install is needed and do not promise reminders. | No       |                      |           |      |        |       |
| I2  | Real delivery: set a plan a few minutes ahead with a reminder; the notification arrives on the lock screen with title and body only; tapping it opens the right page.                                                         | No       |                      |           |      |        |       |
| I3  | Turn notifications off in settings: the device stops receiving them. Quiet hours and the one-general-per-week limit hold.                                                                                                     | No       |                      |           |      |        |       |
| I4  | A refunded or revoked test purchase stops reminders and removes devices and plans (server side).                                                                                                                              | No       |                      |           |      |        |       |

## Decision

| Question                                                  | Answer |
| --------------------------------------------------------- | ------ |
| All REQUIRED rows Pass on iPhone, Android and desktop?    |        |
| `PWA_PROMPTS_ENABLED` changed to true (who, when, build)? |        |
| Failures and follow-ups                                   |        |
