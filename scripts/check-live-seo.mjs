#!/usr/bin/env node
// Live SEO check. NOT run in CI and not run by the build: a person (or Cowork) runs it against a preview or production URL.
//
//   node scripts/check-live-seo.mjs https://www.pawsandpassage.com
//   node scripts/check-live-seo.mjs https://deploy-preview-12--site.netlify.app --expect-noindex
//   node scripts/check-live-seo.mjs https://www.pawsandpassage.com --apex https://pawsandpassage.com
//   node scripts/check-live-seo.mjs <base> --json            (machine-readable report)
//
// It is read-only: it only sends GET requests to the URLs it is given and to the sitemap's own <loc> paths.
// It fetches robots.txt and sitemap.xml, then every <loc> in the sitemap, requested from the BASE you gave (a sitemap on a
// preview names production URLs, so the path is requested from the preview). For each URL it reports the status, any redirect
// chain, the canonical link, the robots meta, the X-Robots-Tag header, and flags mismatches:
//   - a sitemap URL that is not a direct 200 (redirect, 404, 410, 5xx)
//   - a canonical that is missing, relative, or not the sitemap <loc>
//   - noindex (meta or header) on a sitemap URL, when checking production
//   - NO noindex when --expect-noindex is given (preview and branch deploys must not be indexable)
//   - a loc on a different host than the canonical host named in robots.txt Sitemap line
// With --apex <url> it also checks that the bare domain 301s to the base with the path and query kept, in a single hop.
// Nothing here proves a page is indexed or will rank. Search Console URL Inspection is the source for that.

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const base = args.find((a) => /^https?:\/\//.test(a));
if (!base || flag("--help")) {
  console.error(
    "usage: node scripts/check-live-seo.mjs <base-url> [--expect-noindex] [--apex <bare-domain-url>] [--json]",
  );
  process.exit(base ? 0 : 2);
}
const origin = new URL(base).origin;
const expectNoindex = flag("--expect-noindex");
const asJson = flag("--json");
const apex = opt("--apex");
const UA = "paws-passage-seo-check/1.0 (read-only)";
const problems = [];
const rows = [];
const flagProblem = (url, msg) => problems.push({ url, problem: msg });

/** GET without following redirects; returns { status, headers, body, location }. */
async function get(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA } });
  const ct = res.headers.get("content-type") ?? "";
  const body = /text|xml|json/.test(ct) ? await res.text() : "";
  return { status: res.status, headers: res.headers, body, location: res.headers.get("location") };
}

/** Follows up to 5 redirects and returns every hop. */
async function chain(url) {
  const hops = [];
  let cur = url;
  for (let i = 0; i < 6; i++) {
    const r = await get(cur);
    hops.push({ url: cur, status: r.status });
    if (r.status >= 300 && r.status < 400 && r.location) {
      cur = new URL(r.location, cur).toString();
      if (hops.some((h) => h.url === cur)) {
        hops.push({ url: cur, status: "LOOP" });
        return { hops, final: r, loop: true };
      }
      continue;
    }
    return { hops, final: r, loop: false };
  }
  return { hops, final: null, loop: true };
}

const attr = (tag, name) => new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i").exec(tag)?.[1];
function readHead(html) {
  let canonical;
  let robots;
  for (const m of html.matchAll(/<link\b[^>]*>/gi))
    if (/rel\s*=\s*["']canonical["']/i.test(m[0])) canonical = attr(m[0], "href");
  for (const m of html.matchAll(/<meta\b[^>]*>/gi))
    if (/name\s*=\s*["']robots["']/i.test(m[0])) robots = attr(m[0], "content");
  return { canonical, robots };
}

// 1. robots.txt
const robots = await get(`${origin}/robots.txt`);
console.error(`robots.txt: ${robots.status}`);
if (robots.status !== 200) flagProblem(`${origin}/robots.txt`, `status ${robots.status}`);
const sitemapLines = [...robots.body.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
if (sitemapLines.length !== 1)
  flagProblem(
    `${origin}/robots.txt`,
    `expected exactly one Sitemap line, found ${sitemapLines.length}`,
  );
if (/^\s*Disallow:\s*\S/im.test(robots.body))
  flagProblem(
    `${origin}/robots.txt`,
    "has a Disallow rule: Google could not see a noindex on a blocked page",
  );
const canonicalOrigin = sitemapLines[0] ? new URL(sitemapLines[0]).origin : undefined;

// 2. sitemap.xml
const sm = await chain(`${origin}/sitemap.xml`);
const smFinal = sm.final;
console.error(`sitemap.xml: ${smFinal?.status} (${sm.hops.length} hop(s))`);
if (!smFinal || smFinal.status !== 200 || sm.hops.length > 1)
  flagProblem(
    `${origin}/sitemap.xml`,
    `sitemap is not a direct 200 (hops: ${sm.hops.map((h) => h.status).join(">")})`,
  );
const locs = [...(smFinal?.body ?? "").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, "&"),
);
const lastmods = [...(smFinal?.body ?? "").matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(
  (m) => m[1],
);
console.error(`sitemap locs: ${locs.length}, with lastmod: ${lastmods.length}`);
if (new Set(locs).size !== locs.length)
  flagProblem(`${origin}/sitemap.xml`, "duplicate <loc> entries");
if (!locs.length) flagProblem(`${origin}/sitemap.xml`, "no <loc> entries found");

// 3. every loc, requested from the base
for (const loc of locs) {
  const u = new URL(loc);
  if (canonicalOrigin && u.origin !== canonicalOrigin)
    flagProblem(loc, `loc host differs from the robots.txt Sitemap host (${canonicalOrigin})`);
  if (u.search) flagProblem(loc, "loc has a query string");
  const target = origin + u.pathname + u.search;
  let row;
  try {
    const c = await chain(target);
    const f = c.final;
    const head = f && f.status === 200 ? readHead(f.body) : {};
    const xrt = f?.headers.get("x-robots-tag") ?? "";
    row = {
      loc,
      requested: target,
      status: f?.status ?? "none",
      redirects: c.hops.length > 1 ? c.hops.map((h) => `${h.status} ${h.url}`).join(" -> ") : "",
      canonical: head.canonical ?? "",
      robotsMeta: head.robots ?? "",
      xRobotsTag: xrt,
    };
    if (c.loop) flagProblem(loc, "redirect loop");
    else if (c.hops.length > 1) flagProblem(loc, `sitemap URL redirects: ${row.redirects}`);
    if (row.status !== 200) flagProblem(loc, `status ${row.status}, expected 200`);
    else {
      if (!head.canonical) flagProblem(loc, "no canonical link");
      else if (!/^https?:\/\//.test(head.canonical))
        flagProblem(loc, `canonical is not absolute: ${head.canonical}`);
      else if (head.canonical !== loc)
        flagProblem(loc, `canonical differs from loc: ${head.canonical}`);
      const noindex = /noindex/i.test(`${head.robots ?? ""} ${xrt}`);
      if (noindex && !expectNoindex)
        flagProblem(loc, "noindex (meta or X-Robots-Tag) on a sitemap URL");
      if (!noindex && expectNoindex)
        flagProblem(
          loc,
          "no noindex found, but --expect-noindex was given (preview must not be indexable)",
        );
    }
  } catch (e) {
    row = {
      loc,
      requested: target,
      status: "error",
      redirects: "",
      canonical: "",
      robotsMeta: "",
      xRobotsTag: "",
    };
    flagProblem(loc, `request failed: ${e.message}`);
  }
  rows.push(row);
}

// 4. one known-noindex URL, to prove noindex is actually emitted (only meaningful on production)
if (!expectNoindex) {
  for (const p of ["/previews", "/passport", "/our-story"]) {
    try {
      const c = await chain(origin + p);
      const head = c.final?.status === 200 ? readHead(c.final.body) : {};
      const noindex = /noindex/i.test(
        `${head.robots ?? ""} ${c.final?.headers.get("x-robots-tag") ?? ""}`,
      );
      rows.push({
        loc: `(expected noindex) ${p}`,
        requested: origin + p,
        status: c.final?.status ?? "none",
        redirects: "",
        canonical: head.canonical ?? "",
        robotsMeta: head.robots ?? "",
        xRobotsTag: c.final?.headers.get("x-robots-tag") ?? "",
      });
      if (c.final?.status === 200 && !noindex)
        flagProblem(origin + p, "should be noindex but is not");
    } catch (e) {
      flagProblem(origin + p, `request failed: ${e.message}`);
    }
  }
}

// 5. a retired URL should be 410 (read-only probe)
if (!expectNoindex) {
  const c = await chain(`${origin}/stays`);
  rows.push({
    loc: "(retired) /stays",
    requested: `${origin}/stays`,
    status: c.final?.status ?? "none",
    redirects: "",
    canonical: "",
    robotsMeta: "",
    xRobotsTag: "",
  });
  if (c.final?.status !== 410)
    flagProblem(`${origin}/stays`, `retired URL answered ${c.final?.status}, expected 410`);
}

// 6. bare domain -> canonical host, one hop, path and query kept, no loop
if (apex) {
  const probe = "/journal?utm_check=1";
  const c = await chain(new URL(apex).origin + probe);
  const want = origin + probe;
  const hop = c.hops[0];
  rows.push({
    loc: "(apex) " + apex,
    requested: new URL(apex).origin + probe,
    status: hop?.status ?? "none",
    redirects: c.hops.map((h) => `${h.status} ${h.url}`).join(" -> "),
    canonical: "",
    robotsMeta: "",
    xRobotsTag: "",
  });
  if (c.loop) flagProblem(apex, "redirect loop");
  if (hop?.status !== 301) flagProblem(apex, `first hop is ${hop?.status}, expected 301`);
  const last = c.hops.at(-1);
  if (last?.url !== want)
    flagProblem(apex, `ends at ${last?.url}, expected ${want} (path and query must be kept)`);
  if (c.hops.length > 2)
    flagProblem(apex, `${c.hops.length - 1} redirects, expected one (http to https may add one)`);
}

if (asJson) {
  console.log(
    JSON.stringify({ base, checkedAt: new Date().toISOString(), rows, problems }, null, 2),
  );
} else {
  console.log(`\nChecked ${base} at ${new Date().toISOString()}\n`);
  for (const r of rows)
    console.log(
      [
        r.status,
        r.loc,
        r.redirects && `redirects: ${r.redirects}`,
        r.canonical && `canonical: ${r.canonical}`,
        r.robotsMeta && `robots: ${r.robotsMeta}`,
        r.xRobotsTag && `x-robots-tag: ${r.xRobotsTag}`,
      ]
        .filter(Boolean)
        .join(" | "),
    );
  console.log(`\n${problems.length} mismatch(es)`);
  for (const p of problems) console.log(`  - ${p.url}: ${p.problem}`);
}
process.exit(problems.length ? 1 : 0);
