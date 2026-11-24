#!/usr/bin/env node
// Post-deploy check for Paws & Passage. Needs only Node 22 (no installs).
//
//   node scripts/verify-site.mjs https://your-site.netlify.app
//   node scripts/verify-site.mjs http://localhost:8888 --site-url https://yourdomain.com --draft-marker "SOME TEXT ONLY IN A DRAFT"
//
// It checks what a visitor and a search engine would see: readable HTML, every guide and info page,
// real 404s, images, scripts and fonts, canonical tags, the sitemap, and that draft text is not served.
// Exit code 0 = everything passed, 1 = at least one check failed.

const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? "").replace(/\/+$/, "");
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const siteUrl = (flag("--site-url") ?? "").replace(/\/+$/, "");
const draftMarker = flag("--draft-marker");
if (!base) {
  console.error(
    "Usage: node scripts/verify-site.mjs <base-url> [--site-url https://domain] [--draft-marker TEXT]",
  );
  process.exit(2);
}

let passed = 0;
const failures = [];
const ok = (cond, label, detail = "") => {
  if (cond) passed++;
  else failures.push(`${label}${detail ? ` (${detail})` : ""}`);
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${!cond && detail ? `  -> ${detail}` : ""}`);
};

async function get(path, opts = {}) {
  const res = await fetch(base + path, { redirect: "manual", ...opts });
  const type = res.headers.get("content-type") ?? "";
  const body = /text|json|xml|javascript/.test(type)
    ? await res.text()
    : (await res.arrayBuffer(), "");
  return { status: res.status, type, body, headers: res.headers };
}

const strip = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
const meta = (html, re) => (html.match(re) ?? [])[1];

// ---------- 1. Core pages return readable HTML ----------
const core = [
  "/",
  "/guides",
  "/destinations",
  "/stays",
  "/tools",
  "/tools/checklist",
  "/about",
  "/contact",
  "/list-your-property",
  "/privacy",
  "/terms",
  "/affiliate-disclosure",
  "/editorial-standards",
];
const pages = {};
for (const p of core) {
  const r = await get(p);
  pages[p] = r;
  ok(r.status === 200 && /text\/html/.test(r.type), `GET ${p} is 200 HTML`, `status ${r.status}`);
  ok(
    strip(r.body).length > 400,
    `${p} has readable text in the raw HTML (not an empty app shell)`,
    `${strip(r.body).length} chars`,
  );
  ok(!!meta(r.body, /<title>([^<]+)<\/title>/), `${p} has a <title>`);
  ok(
    !!meta(r.body, /<meta[^>]+name="description"[^>]+content="([^"]+)"/) ||
      !!meta(r.body, /<meta[^>]+content="([^"]+)"[^>]+name="description"/),
    `${p} has a meta description`,
  );
  ok(/rel="canonical"/.test(r.body), `${p} has a canonical tag`);
}

// ---------- 2. Every published guide ----------
const guideSlugs = [
  ...new Set(
    [...(pages["/guides"]?.body ?? "").matchAll(/href="\/guides\/([a-z0-9-]+)"/g)].map((m) => m[1]),
  ),
];
ok(guideSlugs.length >= 1, `Guides index lists guides`, `${guideSlugs.length} found`);
for (const slug of guideSlugs) {
  const r = await get(`/guides/${slug}`);
  const text = strip(r.body);
  ok(
    r.status === 200 && text.length > 3000,
    `guide ${slug}: 200 with the full article in the HTML`,
    `status ${r.status}, ${text.length} chars`,
  );
  ok(
    /application\/ld\+json/.test(r.body) && /"@type":"Article"/.test(r.body),
    `guide ${slug}: Article structured data`,
  );
  ok(!/noindex/.test(r.body), `guide ${slug}: indexable (no noindex)`);
  const canon = meta(r.body, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
  ok(
    !!canon && (!siteUrl || canon === `${siteUrl}/guides/${slug}`),
    `guide ${slug}: canonical ${siteUrl ? "= " + siteUrl + "/guides/" + slug : "present"}`,
    canon,
  );
}

// ---------- 3. Destinations and stays ----------
const destLinks = [
  ...new Set(
    [...(pages["/destinations"]?.body ?? "").matchAll(/href="(\/destinations\/[a-z0-9-]+)"/g)].map(
      (m) => m[1],
    ),
  ),
];
for (const d of destLinks.slice(0, 6)) {
  const r = await get(d);
  ok(r.status === 200, `GET ${d} is 200`, `status ${r.status}`);
}
const stayLinks = [
  ...new Set(
    [...(pages["/stays"]?.body ?? "").matchAll(/href="(\/stays\/[a-z0-9-]+)"/g)].map((m) => m[1]),
  ),
];
for (const s of stayLinks.slice(0, 6)) {
  const r = await get(s);
  ok(
    r.status === 200 && strip(r.body).length > 400,
    `GET ${s} is 200 with readable text`,
    `status ${r.status}`,
  );
}
const filtered = await get("/stays?fenced=true");
ok(
  filtered.status === 200,
  "Filtered stays URL (/stays?fenced=true) is 200",
  `status ${filtered.status}`,
);
ok(
  /name="robots"[^>]+noindex/.test(filtered.body) || /noindex/.test(filtered.body),
  "Filtered stays pages are noindex (kept out of search engines)",
);
const staysIndexed = !/name="robots"[^>]+noindex/.test(pages["/stays"].body);
if (stayLinks.length > 0) {
  // Unverified stays are listed with a "Not yet verified" label. While every listed stay is unverified the directory stays out of search.
  const unverifiedBadges = (pages["/stays"].body.match(/Not yet verified/g) || []).length;
  if (unverifiedBadges >= stayLinks.length)
    ok(!staysIndexed, "The /stays page is noindex while every listed stay is still unverified");
  else ok(staysIndexed, "The main /stays page itself is indexable (it lists verified stays)");
} else
  ok(
    !staysIndexed,
    "The /stays page is noindex while it lists no verified stays (empty pages stay out of search)",
  );

// ---------- 3b. Dog rules lookup (/dog-rules) ----------
// Public only once a verified place exists. Until then the page must be noindex and out of the sitemap.
const rules = await get("/dog-rules");
ok(
  rules.status === 200 && /text\/html/.test(rules.type),
  "GET /dog-rules is 200 HTML",
  `status ${rules.status}`,
);
const placeLinks = [
  ...new Set([...rules.body.matchAll(/href="(\/dog-rules\/[a-z0-9-]+)"/g)].map((m) => m[1])),
];
const rulesIndexed = !/name="robots"[^>]+noindex/.test(rules.body);
if (placeLinks.length > 0) {
  ok(rulesIndexed, "/dog-rules is indexable (it lists verified places)");
  for (const pl of placeLinks.slice(0, 6)) {
    const r = await get(pl);
    ok(
      r.status === 200 && strip(r.body).length > 400,
      `GET ${pl} is 200 with readable text`,
      `status ${r.status}`,
    );
    ok(
      !/noindex/.test(r.body),
      `${pl} is indexable and shows the official source`,
      /Official source/.test(r.body) ? "" : "no 'Official source' link",
    );
    ok(
      /Official source/.test(r.body) && /Last checked/.test(r.body),
      `${pl} shows 'Official source' and 'Last checked'`,
    );
  }
} else {
  ok(
    !rulesIndexed,
    "/dog-rules is noindex while no verified place exists (an empty lookup stays out of search)",
  );
}
const rulesFiltered = await get("/dog-rules?state=georgia");
ok(
  rulesFiltered.status === 200 && /noindex/.test(rulesFiltered.body),
  "Filtered /dog-rules pages are noindex",
);

// ---------- 4. 404s ----------
for (const p of [
  "/this-page-does-not-exist",
  "/guides/this-guide-does-not-exist",
  "/stays/this-stay-does-not-exist",
  "/dog-rules/this-place-does-not-exist",
  "/destinations/nowhere",
]) {
  const r = await get(p);
  ok(r.status === 404, `Unknown route ${p} returns a real 404`, `status ${r.status}`);
}

// Retired tool URLs must redirect to /tools, never 404.
for (const p of ["/tools/pet-cost-check", "/tools/cost-calculator", "/tools/host-questions"]) {
  const r = await get(p);
  ok(
    r.status === 301 && (r.headers.get("location") ?? "").replace(/\/$/, "").endsWith("/tools"),
    `Retired tool ${p} redirects (301) to /tools`,
    `status ${r.status}, location ${r.headers.get("location")}`,
  );
}

// ---------- 5. Drafts ----------
if (draftMarker) {
  const hay = [];
  for (const p of ["/guides", ...guideSlugs.map((s) => `/guides/${s}`)])
    hay.push((await get(p)).body);
  ok(!hay.some((h) => h.includes(draftMarker)), "Draft text does not appear on any public page");
  const scripts = new Set();
  for (const h of hay.slice(0, 3))
    for (const m of h.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)) scripts.add(m[1]);
  let leaked = false;
  for (const s of scripts) if ((await get(s)).body.includes(draftMarker)) leaked = true;
  ok(
    !leaked,
    "Draft text is not inside any downloadable JavaScript file",
    `${scripts.size} scripts scanned`,
  );
} else {
  console.log("SKIP  draft checks (pass --draft-marker 'text that exists only in a draft')");
}

// ---------- 6. Assets: images, scripts, styles, fonts ----------
const home = pages["/"].body;
const assetPaths = new Set();
for (const m of home.matchAll(
  /(?:src|href)="(\/[^"#?]+\.(?:jpg|jpeg|png|webp|svg|js|css|woff2?|ico))"/g,
))
  assetPaths.add(m[1]);
for (const m of (pages["/guides"]?.body ?? "").matchAll(
  /(?:src|href)="(\/[^"#?]+\.(?:jpg|jpeg|png|webp|svg|js|css|woff2?|ico))"/g,
))
  assetPaths.add(m[1]);
let cssText = "";
for (const a of [...assetPaths]) {
  const r = await get(a);
  ok(r.status === 200, `asset ${a} loads`, `status ${r.status}`);
  if (a.endsWith(".css")) cssText += r.body;
}
for (const m of cssText.matchAll(/url\(([^)]+\.woff2?[^)]*)\)/g)) {
  const u = m[1].replace(/['"]/g, "");
  if (u.startsWith("http")) {
    ok(true, `font ${u} is hosted externally (not checked)`);
    continue;
  }
  const r = await get(u.startsWith("/") ? u : "/" + u);
  ok(r.status === 200, `font ${u} loads`, `status ${r.status}`);
}
const img = [...assetPaths].find((a) => /\.jpg$/.test(a));
if (img) {
  const r = await fetch(base + img);
  ok(
    /immutable|max-age=\d{6,}/.test(r.headers.get("cache-control") ?? ""),
    `images are cached long-term (${r.headers.get("cache-control")})`,
  );
}

// ---------- 7. robots.txt and sitemap ----------
const robots = await get("/robots.txt");
ok(robots.status === 200 && /User-agent/i.test(robots.body), "robots.txt is served");
const sm = await get("/sitemap.xml");
if (siteUrl) {
  ok(
    sm.status === 200 && /xml/.test(sm.type),
    "sitemap.xml is served as XML",
    `status ${sm.status}`,
  );
  ok(
    sm.body.includes(`<loc>${siteUrl}/</loc>`) || sm.body.includes(`<loc>${siteUrl}</loc>`),
    "sitemap lists the home page on the real domain",
  );
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(
    locs.every((l) => l.startsWith(siteUrl)),
    "every sitemap URL uses the real domain",
    `${locs.length} URLs`,
  );
  for (const slug of guideSlugs)
    ok(locs.includes(`${siteUrl}/guides/${slug}`), `sitemap includes guide ${slug}`);
  ok(!locs.some((l) => /[?]/.test(l)), "sitemap has no filtered/query URLs");
  ok(
    locs.includes(`${siteUrl}/dog-rules`) === rulesIndexed,
    "sitemap lists /dog-rules only when it is indexable (verified places exist)",
  );
  for (const pl of placeLinks) ok(locs.includes(siteUrl + pl), `sitemap includes ${pl}`);
} else {
  ok(
    sm.status === 503 || sm.status === 200,
    `sitemap.xml responds sensibly before a domain is set (status ${sm.status})`,
  );
  console.log("NOTE  pass --site-url to verify the sitemap and canonical URLs for the real domain");
}

console.log(`\n${passed} checks passed, ${failures.length} failed.`);
if (failures.length) {
  console.log("\nFailures:\n - " + failures.join("\n - "));
  process.exit(1);
}
