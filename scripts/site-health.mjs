#!/usr/bin/env node
// Weekly health checks for Paws & Passage. Needs only Node 22 (no installs, no secrets).
//
//   node scripts/site-health.mjs links     [--out report.md] [--site https://www.pawsandpassage.com]
//   node scripts/site-health.mjs freshness [--out report.md]
//
// links:     reads the live sitemap and checks that every page answers with a normal status code.
// freshness: lists articles, places and the policy dataset that are overdue for a re-check.
//
// A report file is written ONLY when something needs attention (the weekly workflow turns it into a GitHub issue).
// The script exits 0 whether or not it found problems; it exits 2 only if it could not run at all.

import { readFileSync, readdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const mode = args[0];
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const out = flag("--out");

// ---- Settings a non-developer can change ------------------------------------------------------
const DEFAULT_SITE = "https://www.pawsandpassage.com";
// Sites known to refuse automated visitors. A link to one of these is never reported as broken.
const SKIP_HOSTS = ["vrbo.com", "expedia.com", "airbnb.com", "amazon.com", "facebook.com", "instagram.com", "pinterest.com", "linkedin.com"];
const ARTICLE_MAX_AGE_MONTHS = 6; // an article's "lastReviewed" date
const PLACE_MAX_AGE_MONTHS = 12; // a place's "lastChecked" date (same rule as the site's "needs recheck" badge)
const DATA_MAX_AGE_MONTHS = 6; // the 38-manager policy dataset (docs/DATA-RECHECK-LOG.md)
// -----------------------------------------------------------------------------------------------

function finish(lines) {
  if (lines.length === 0) {
    console.log("All clear: nothing needs attention.");
    if (out && existsSync(out)) rmSync(out);
    return;
  }
  const text = lines.join("\n") + "\n";
  console.log(text);
  if (out) writeFileSync(out, text);
}

const monthsAgo = (months) => {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - months);
  return d.toISOString().slice(0, 10);
};

// ---- links -------------------------------------------------------------------------------------
async function links() {
  const site = (flag("--site") ?? DEFAULT_SITE).replace(/\/+$/, "");
  const headers = { "User-Agent": "PawsAndPassage-site-health/1.0 (weekly status check)" };
  const sm = await fetch(`${site}/sitemap.xml`, { headers });
  if (!sm.ok) {
    finish([`# Link check: the sitemap could not be read`, "", `${site}/sitemap.xml answered with status ${sm.status}. The site may be down.`]);
    return;
  }
  const urls = [...(await sm.text()).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    finish([`# Link check: the sitemap is empty`, "", `${site}/sitemap.xml contains no page addresses.`]);
    return;
  }
  const broken = [];
  const warnings = [];
  let skipped = 0;
  for (const url of urls) {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (SKIP_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
      skipped++;
      continue;
    }
    try {
      const res = await fetch(url, { headers, redirect: "follow", signal: AbortSignal.timeout(20000) });
      // 403 and 429 usually mean "we were refused as a robot", so they are a warning, not a broken page.
      if (res.status === 403 || res.status === 429) warnings.push(`${url} (status ${res.status})`);
      else if (res.status >= 400) broken.push(`${url} (status ${res.status})`);
    } catch (e) {
      broken.push(`${url} (no answer: ${e.name})`);
    }
    await new Promise((r) => setTimeout(r, 300)); // be gentle with the server
  }
  console.log(`Checked ${urls.length - skipped} pages from the sitemap (${skipped} skipped).`);
  if (broken.length === 0 && warnings.length === 0) return finish([]);
  const lines = [`# Link check: ${broken.length} broken page(s)`, "", `Checked ${urls.length - skipped} sitemap pages on ${site}.`, ""];
  if (broken.length) lines.push("## Broken", ...broken.map((b) => `- ${b}`), "");
  if (warnings.length) lines.push("## Refused automated visit (probably fine, open by hand once)", ...warnings.map((w) => `- ${w}`), "");
  finish(broken.length || warnings.length ? lines : []);
}

// ---- freshness ---------------------------------------------------------------------------------
function readDir(rel, ext) {
  const dir = join(root, rel);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => [f, readFileSync(join(dir, f), "utf8")]) : [];
}
const field = (text, name) => text.match(new RegExp(`^\\s*["']?${name}["']?:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, "m"))?.[1];

function freshness() {
  const stale = [];
  const articleLimit = monthsAgo(ARTICLE_MAX_AGE_MONTHS);
  const placeLimit = monthsAgo(PLACE_MAX_AGE_MONTHS);

  // Articles: Markdown (editable in Pages CMS) and code files.
  const articles = [...readDir("content/guides", ".md").map(([f, t]) => ["content/guides/" + f, t]), ...readDir("src/content/guides", ".ts").filter(([f]) => f !== "index.ts").map(([f, t]) => ["src/content/guides/" + f, t])];
  for (const [file, text] of articles) {
    if (/^status:\s*draft/m.test(text)) continue; // drafts are not on the site
    const d = field(text, "lastReviewed");
    if (!d) stale.push(`- Article with no lastReviewed date: ${file}`);
    else if (d < articleLimit) stale.push(`- Article last reviewed ${d}: ${file}`);
  }

  // Places: only ones that are live (status verified) can be out of date.
  for (const [f, text] of readDir("content/places", ".yml")) {
    if (!/^status:\s*verified/m.test(text)) continue;
    const d = field(text, "lastChecked");
    if (!d) stale.push(`- Verified place with no lastChecked date: content/places/${f}`);
    else if (d < placeLimit) stale.push(`- Place last checked ${d}: content/places/${f}`);
  }

  // Policy dataset: the newest dated row in the re-check log.
  const logPath = join(root, "docs/DATA-RECHECK-LOG.md");
  const dates = [...readFileSync(logPath, "utf8").matchAll(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/gm)].map((m) => m[1]).sort();
  const latest = dates.at(-1);
  if (!latest) stale.push("- docs/DATA-RECHECK-LOG.md has no dated re-check row.");
  else if (latest < monthsAgo(DATA_MAX_AGE_MONTHS)) stale.push(`- The 38-manager policy data was last re-checked ${latest}; the rule is every ${DATA_MAX_AGE_MONTHS} months. Follow docs/DATA-RECHECK-LOG.md.`);

  console.log(`Looked at ${articles.length} articles and the places and policy data.`);
  if (stale.length === 0) return finish([]);
  finish([
    `# Content freshness: ${stale.length} item(s) overdue`,
    "",
    `Rules: articles ${ARTICLE_MAX_AGE_MONTHS} months, places ${PLACE_MAX_AGE_MONTHS} months, policy data ${DATA_MAX_AGE_MONTHS} months.`,
    "After re-reading the source, update the date (lastReviewed or lastChecked) and, for the policy data, add a row to docs/DATA-RECHECK-LOG.md.",
    "",
    ...stale,
  ]);
}

try {
  if (mode === "links") await links();
  else if (mode === "freshness") freshness();
  else {
    console.error("Usage: node scripts/site-health.mjs links|freshness [--out file.md]");
    process.exit(2);
  }
} catch (e) {
  console.error(e);
  process.exit(2);
}
