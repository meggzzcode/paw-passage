/* Paws & Passage service worker.
 * Scope: /. Does three small things: (1) keeps a tiny precache of public static app assets (fonts, icons, offline page),
 * (2) answers failed page navigations with offline.html, (3) shows push notifications and opens allow-listed pages.
 * It NEVER caches /api/*, anything authenticated, premium content, or any cross-origin response. Bump VERSION to ship a
 * new worker; old caches are deleted on activate. A new worker waits until the page asks it to take over (SKIP_WAITING
 * message from the "refresh" toast) or until every tab is closed, so a visit is never swapped mid-use.
 */
const VERSION = "v1";
const CACHE_PREFIX = "pp-static-";
const STATIC_CACHE = CACHE_PREFIX + VERSION;
const PRECACHE = [
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/fonts/dm-sans-latin-variable.woff2",
  "/fonts/fraunces-latin-variable.woff2",
];
const OFFLINE_URL = "/offline.html";

// Notification click targets: same-origin, exact match after parsing (see the V5 payload contract).
const ALLOWED_URLS = [
  "/discover?mode=made",
  "/discover?mode=surprise",
  "/collections?tab=favorites",
  "/collections?tab=mine",
  "/passport?view=upcoming",
  "/previews",
];
const PLAN_URL = /^\/passport\?view=upcoming&plan=pl-[a-z0-9]{8}$/;
const KINDS = ["weekly", "planned", "saved", "seasonal"];

function safeTarget(raw, origin) {
  try {
    const u = new URL(String(raw), origin);
    if (u.origin !== origin) return "/";
    const path = u.pathname + u.search;
    return ALLOWED_URLS.indexOf(path) !== -1 || PLAN_URL.test(path) ? path : "/";
  } catch (e) {
    return "/";
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined), // a failed precache must never block the worker
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith(CACHE_PREFIX) && k !== STATIC_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // never touched: the network handles it
  if (req.mode === "navigate") {
    // Network first. Pages are never stored by this worker; only a failed navigation gets the offline page.
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL).then((r) => r || Response.error())),
    );
    return;
  }
  if (PRECACHE.indexOf(url.pathname) !== -1) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
  // Everything else falls through to the network and the HTTP cache.
});

self.addEventListener("push", (event) => {
  let data = null;
  try {
    data = event.data ? event.data.json() : null;
  } catch (e) {
    data = null;
  }
  if (!data || typeof data !== "object") return;
  const title =
    typeof data.title === "string" && data.title ? data.title.slice(0, 80) : "Paws & Passage";
  const body = typeof data.body === "string" ? data.body.slice(0, 160) : "";
  const kind = KINDS.indexOf(data.kind) !== -1 ? data.kind : "weekly";
  const tag = typeof data.tag === "string" && data.tag ? data.tag.slice(0, 64) : "pp-" + kind;
  const target = safeTarget(data.url, self.location.origin);
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag, // same tag replaces an earlier notification instead of stacking
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: target, kind },
      // Payloads carry no private details, and nothing is added here: the lock screen shows only title and body.
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const d = event.notification.data || {};
  const target = safeTarget(d.url, self.location.origin);
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (new URL(c.url).origin === self.location.origin && "focus" in c) {
          return c.focus().then((f) => (f && "navigate" in f ? f.navigate(target) : undefined));
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
