#!/usr/bin/env node
// Post-deploy check for Paw & Passage. Needs only Node 22 (no installs).
//
//   node scripts/verify-site.mjs https://your-site.netlify.app
//   node scripts/verify-site.mjs http://localhost:8888 --site-url https://yourdomain.com
//
// It checks what a visitor and a search engine would see: readable HTML, every guide and info page, real 404s,
// 410 Gone for retired addresses, the private pages kept out of search, assets, canonical tags and the sitemap.
// It never buys, signs in or sends anything. Exit code 0 = everything passed, 1 = at least one check failed.

const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? "").replace(/\/+$/, "");
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const siteUrl = (flag("--site-url") ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Usage: node scripts/verify-site.mjs <base-url> [--site-url https://domain]");
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

// ---------- 1. Public pages return readable HTML ----------
const core = [
  "/",
  "/discover",
  "/collections",
  "/unlock",
  "/our-story",
  "/guides",
  "/gear",
  "/tools/packing-list",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/affiliate-disclosure",
  "/editorial-standards",
  "/methodology",
  "/corrections",
];
const pages = {};
for (const p of core) {
  const r = await get(p);
  pages[p] = r;
  ok(r.status === 200 && /text\/html/.test(r.type), `GET ${p} is 200 HTML`, `status ${r.status}`);
  ok(
    strip(r.body).length > 200,
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

// ---------- 2. Private pages stay out of search ----------
for (const p of ["/passport", "/restore-access"]) {
  const r = await get(p);
  ok(r.status === 200, `GET ${p} is 200`, `status ${r.status}`);
  ok(/noindex/.test(r.body), `${p} is noindex (private to the visitor)`);
}

// ---------- 3. Every published guide ----------
const guideSlugs = [
  ...new Set(
    [...(pages["/guides"]?.body ?? "").matchAll(/href="\/guides\/([a-z0-9-]+)"/g)].map((m) => m[1]),
  ),
];
ok(guideSlugs.length >= 1, "Guides index lists guides", `${guideSlugs.length} found`);
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

// ---------- 4. 404s and retired addresses ----------
for (const p of ["/this-page-does-not-exist", "/guides/this-guide-does-not-exist"]) {
  const r = await get(p);
  ok(r.status === 404, `Unknown route ${p} returns a real 404`, `status ${r.status}`);
}
// Retired addresses have no replacement and must say Gone, never redirect to the home page.
for (const p of [
  "/stays",
  "/stays/some-cabin",
  "/destinations/georgia",
  "/dogs/senior-dogs",
  "/dog-rules",
  "/data/pet-policies",
  "/list-your-property",
  "/tools/checklist",
  "/tools/will-my-dog-be-accepted",
  "/guides/how-vacation-rental-pet-fees-work",
]) {
  const r = await get(p);
  ok(r.status === 410, `Retired address ${p} returns 410 Gone`, `status ${r.status}`);
}

// ---------- 5. Assets: images, scripts, styles, fonts ----------
const assetPaths = new Set();
for (const html of [pages["/"].body, pages["/guides"]?.body ?? ""])
  for (const m of html.matchAll(
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

// ---------- 6. robots.txt and sitemap ----------
const robots = await get("/robots.txt");
ok(robots.status === 200 && /User-agent/i.test(robots.body), "robots.txt is served");
const sm = await get("/sitemap.xml");
if (siteUrl) {
  ok(
    sm.status === 200 && /xml/.test(sm.type),
    "sitemap.xml is served as XML",
    `status ${sm.status}`,
  );
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(
    locs.includes(`${siteUrl}/`) || locs.includes(siteUrl),
    "sitemap lists the home page on the real domain",
  );
  ok(
    locs.every((l) => l.startsWith(siteUrl)),
    "every sitemap URL uses the real domain",
    `${locs.length} URLs`,
  );
  for (const slug of guideSlugs)
    ok(locs.includes(`${siteUrl}/guides/${slug}`), `sitemap includes guide ${slug}`);
  ok(!locs.some((l) => /[?]/.test(l)), "sitemap has no filtered/query URLs");
  ok(
    !locs.some((l) =>
      /\/(stays|destinations|dogs|dog-rules|passport|restore-access)(\/|$)/.test(l),
    ),
    "sitemap has no retired or private pages",
  );
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
