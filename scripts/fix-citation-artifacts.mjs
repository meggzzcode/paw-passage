#!/usr/bin/env bun
// Cleans artifacts left by the citation migration in every published guide (content/guides/*.md and
// src/content/guides/*.ts). Deterministic and idempotent. Run with bun:
//   bun scripts/fix-citation-artifacts.mjs --dry-run            per-guide before/after counts, change nothing
//   bun scripts/fix-citation-artifacts.mjs --dry-run --show     also print every changed line (before and after)
//   bun scripts/fix-citation-artifacts.mjs --write              rewrite the guide files
//   add --only a,b to limit to some slugs, --json for a JSON report.
//
// A "group" is a parenthetical publisher link: ([Airbnb](url)) or ([Airbnb](url), [Vrbo](url)). Rules, per paragraph
// or list item (a "unit"), left to right, repeated until nothing changes:
//  (a) inside one group, the same URL twice collapses to one, and so does the same publisher twice;
//  (b) a group link is dropped when an inline link to the same URL, or to the same publisher, sits within the
//      previous 160 characters of the same unit;
//  (d) a group link for a publisher+URL already given in an earlier group of the same unit is dropped
//      (the same publisher with a different URL stays);
//  (c) a group never sits inside quotation marks: it moves to just after the closing quote;
//  (f) a group never follows a sentence-ending period ("lists Christmas. (X)." becomes "lists Christmas (X).");
//  (g) a single-link group whose publisher is already named as plain words earlier in the same sentence
//      turns that mention into the link instead (the URL stays linked, the sentence stops saying it twice);
//  (e) an emptied group is removed together with its brackets, and a link is never dropped when it is the only
//      link left to a frontmatter source URL (counting links in the body and in the FAQ answers).
// A guide is written only if every source URL linked before is still linked after and a second run changes nothing.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  linkedSourceNumbers,
  publisherAliases,
  publisherDisplayName,
} from "../src/content/citations.ts";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const SHOW = args.includes("--show");
const JSON_OUT = args.includes("--json");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? new Set(args[onlyIdx + 1].split(",")) : null;
if (!WRITE && !args.includes("--dry-run")) {
  console.error("Pass --dry-run (report only) or --write.");
  process.exit(2);
}

const WINDOW = 160;
const LINK = "\\[[^\\]\\n]+\\]\\(https?:[^)\\s]+\\)";
const GROUP = new RegExp(`\\((${LINK}(?:,\\s*${LINK})*)\\)`, "g");
const ONE_LINK = /\[([^\]\n]+)\]\((https?:[^)\s]+)\)/g;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------- reading guides ----------
async function loadGuides() {
  const out = [];
  const mdDir = join(ROOT, "content/guides");
  for (const f of readdirSync(mdDir)
    .filter((n) => n.endsWith(".md"))
    .sort()) {
    const file = join(mdDir, f);
    const text = readFileSync(file, "utf8");
    const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!m) continue;
    const data = parseYaml(m[1]);
    if (data.status !== "published") continue;
    out.push({
      slug: f.replace(/\.md$/, ""),
      file,
      sources: data.sources ?? [],
      faqText: (data.faqs ?? []).map((x) => x.a).join("\n"),
      full: text,
      start: m[0].length,
      end: text.length,
    });
  }
  const tsDir = join(ROOT, "src/content/guides");
  for (const f of readdirSync(tsDir)
    .filter((n) => n.endsWith(".ts") && n !== "index.ts")
    .sort()) {
    const file = join(tsDir, f);
    const g = (await import(pathToFileURL(file).href)).guide;
    if (g.status !== "published") continue;
    const text = readFileSync(file, "utf8");
    const open = text.indexOf("body: `");
    if (open < 0) throw new Error(`${f}: no body template literal`);
    const start = open + "body: `".length;
    let i = start;
    while (i < text.length && !(text[i] === "`" && text[i - 1] !== "\\")) i++;
    out.push({
      slug: g.slug,
      file,
      sources: g.sources ?? [],
      faqText: (g.faqs ?? []).map((x) => x.a).join("\n"),
      full: text,
      start,
      end: i,
    });
  }
  return out.map((g) => ({ ...g, body: g.full.slice(g.start, g.end) }));
}

// ---------- publisher identity ----------
function makeKeys(sources) {
  const byUrl = new Map();
  const byName = new Map();
  for (const s of sources) {
    const disp = publisherDisplayName(s.publisher);
    byUrl.set(s.url, disp.toLowerCase());
    for (const a of [disp, ...publisherAliases(s.publisher)])
      byName.set(a.toLowerCase(), disp.toLowerCase());
  }
  return (text, url) => byUrl.get(url) ?? byName.get(text.toLowerCase()) ?? text.toLowerCase();
}
function mentionNames(sources, url, text) {
  const s = sources.find((x) => x.url === url);
  const names = new Set([text]);
  if (s)
    for (const a of [publisherDisplayName(s.publisher), ...publisherAliases(s.publisher)])
      names.add(a);
  return [...names].filter((n) => n.length >= 3).sort((a, b) => b.length - a.length);
}

/** A page title without the publisher name, cut at a word to 48 characters. */
function shortTitle(title, publisher) {
  let t = title
    .replace(new RegExp(`\\s*[|:–-]\\s*${esc(publisher)}\\s*$`, "i"), "")
    .replace(/[\[\]]/g, "")
    .trim();
  if (t.length > 48) t = t.slice(0, 48).replace(/\s+\S*$/, "") + "…";
  return t;
}

// ---------- units ----------
const isTableRow = (l) => /^\s*\|/.test(l);
const isUnitStart = (l) =>
  /^\s*([-*+]|\d+\.)\s/.test(l) || /^#{1,6}\s/.test(l) || isTableRow(l) || /^\s*>/.test(l);
/** [start,end) ranges of paragraphs / list items / table rows in the body. */
function unitRanges(body) {
  const ranges = [];
  let pos = 0;
  let cur = null;
  for (const line of body.split("\n")) {
    const len = line.length + 1;
    if (line.trim() === "") {
      if (cur) ranges.push(cur);
      cur = null;
    } else {
      if (cur && isUnitStart(line)) {
        ranges.push(cur);
        cur = null;
      }
      if (!cur) cur = [pos, pos + len];
      else cur[1] = pos + len;
    }
    pos += len;
  }
  if (cur) ranges.push(cur);
  return ranges;
}

const parseGroup = (m) => ({
  start: m.index,
  end: m.index + m[0].length,
  items: [...m[1].matchAll(ONE_LINK)].map((x) => ({ text: x[1], url: x[2], raw: x[0] })),
});
const groupsIn = (u) => [...u.matchAll(GROUP)].map(parseGroup);
const render = (g) => `(${g.items.map((i) => i.raw).join(", ")})`;

/** Index ranges [start,end) of quotation marks pairs in a unit (curly pairs, or straight pairs when no curly quotes). */
function quoteSpans(u) {
  const spans = [];
  if (/[“”]/.test(u)) {
    let open = -1;
    for (let i = 0; i < u.length; i++) {
      if (u[i] === "“") open = i;
      else if (u[i] === "”" && open >= 0) {
        spans.push([open, i]);
        open = -1;
      }
    }
  } else {
    let open = -1;
    for (let i = 0; i < u.length; i++)
      if (u[i] === '"' && !/\d/.test(u[i - 1] ?? "")) {
        if (open < 0) open = i;
        else {
          spans.push([open, i]);
          open = -1;
        }
      }
  }
  return spans;
}

/** Removes a whole group, with the space before it. */
function removeGroup(u, g) {
  let s = g.start;
  while (s > 0 && u[s - 1] === " ") s--;
  return (
    u.slice(0, s) +
    u.slice(g.end).replace(/^(?=[\p{L}\p{N}*_“(\[])/u, u[s - 1] === undefined || s === 0 ? "" : " ")
  );
}

// ---------- one unit ----------
function fixUnit(u, ctx) {
  const { key, sources, urlCount, stats } = ctx;
  for (let guard = 0; guard < 60; guard++) {
    const groups = groupsIn(u);
    if (!groups.length) return u;
    const spans = groups.map((g) => [g.start, g.end]);
    const inGroup = (i) => spans.some(([a, b]) => i >= a && i < b);
    const inlineLinks = [...u.matchAll(ONE_LINK)]
      .filter((m) => !inGroup(m.index))
      .map((m) => ({ start: m.index, end: m.index + m[0].length, text: m[1], url: m[2] }));
    const quotes = quoteSpans(u);
    const safe = (url) => !sources.some((s) => s.url === url) || (urlCount.get(url) ?? 0) > 1;
    const dropped = (url) => urlCount.set(url, (urlCount.get(url) ?? 0) - 1);
    const seenEarlier = new Set(); // key|url of items in earlier groups of this unit
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi];
      const keep = [];
      let changed = false;
      for (const it of g.items) {
        const k = key(it.text, it.url);
        let why = null;
        if (keep.some((x) => x.url === it.url)) why = "a-url";
        else if (keep.some((x) => key(x.text, x.url) === k) && safe(it.url)) why = "a-pub";
        else if (
          inlineLinks.some((l) => l.end <= g.start && g.start - l.end <= WINDOW && l.url === it.url)
        )
          why = "b-url";
        else if (
          inlineLinks.some(
            (l) => l.end <= g.start && g.start - l.end <= WINDOW && key(l.text, l.url) === k,
          ) &&
          safe(it.url)
        )
          why = "b-pub";
        else if (seenEarlier.has(`${k}|${it.url}`)) why = "d";
        if (why && safe(it.url)) {
          dropped(it.url);
          stats[why[0]] = (stats[why[0]] ?? 0) + 1;
          changed = true;
        } else keep.push(it);
      }
      for (const it of keep) seenEarlier.add(`${key(it.text, it.url)}|${it.url}`);
      if (changed) {
        if (!keep.length) {
          stats.emptied++;
          return removeGroup(u, g);
        }
        g.items = keep;
        return u.slice(0, g.start) + render(g) + u.slice(g.end);
      }
    }
    // (a2) two links with the same label that must both stay (each is the only link to its source): name the page
    for (const g of groups) {
      const labels = g.items.map((i) => i.text.toLowerCase());
      if (!g.items.some((i, n) => labels.indexOf(i.text.toLowerCase()) !== n)) continue;
      g.items = g.items.map((it) => {
        const src = sources.find((x) => x.url === it.url);
        const title = src ? shortTitle(src.title, src.publisher) : "";
        return !title || labels.filter((l) => l === it.text.toLowerCase()).length < 2
          ? it
          : { ...it, text: `${it.text}: ${title}`, raw: `[${it.text}: ${title}](${it.url})` };
      });
      stats.a2++;
      return u.slice(0, g.start) + render(g) + u.slice(g.end);
    }
    // (c) a group inside quotation marks moves to after the closing quote
    for (const g of groups) {
      const q = quotes.find(([a, b]) => g.start > a && g.end <= b);
      if (!q) continue;
      // a "." or "," that followed the group just before the closing quote ends the sentence outside the quote
      const tail = /^[.,;](?=[”"]$)/.exec(u.slice(g.end, q[1] + 1));
      const punct = tail ? tail[0] : "";
      const dropEnd = g.end + punct.length;
      const withoutGroup = removeGroup(u.slice(0, g.end) + u.slice(dropEnd), g);
      const shift = u.length - punct.length - withoutGroup.length;
      const closeAt = q[1] - punct.length - shift;
      u =
        withoutGroup.slice(0, closeAt + 1) +
        " " +
        render(g) +
        punct +
        withoutGroup.slice(closeAt + 1);
      u = u.replace(/ {2,}/g, " ");
      u = u.replace(/\.\.$/, ".");
      stats.c++;
      return u;
    }
    // (f) "word. (X)." -> "word (X)."
    for (const g of groups) {
      const before = u.slice(0, g.start);
      const mm = /([\p{Ll}\p{N}”"’)])([.!?]) $/u.exec(before);
      if (
        mm &&
        !/(?:\b[A-Za-z]|\bvs|\bInc|\bLtd|\bCo|\bSt|\bMr|\bMrs|\bDr)\.? $/.test(before.slice(-8))
      ) {
        const after = u.slice(g.end);
        const cut =
          before.slice(0, before.length - 2 - 0) +
          (mm[1] === "”" || mm[1] === '"' || mm[1] === "’" ? "" : "");
        const head = before.slice(0, before.length - 2) + " ";
        const term = after.startsWith(mm[2]) ? "" : mm[2];
        u =
          head +
          render(g) +
          (after.startsWith(".") && mm[2] === "." ? "" : term === "" ? "" : term) +
          after;
        void cut;
        stats.f++;
        return u;
      }
    }
    // (g) a single-link group whose publisher is already named in plain words earlier in the sentence
    for (const g of groups) {
      if (g.items.length !== 1) continue;
      const it = g.items[0];
      let sent = u.slice(0, g.start);
      const bounds = [
        ...sent.matchAll(/(?<=[\p{Ll}\p{N})”"’][.!?])\s+(?=[\p{Lu}"“(\[*])|:\s+(?=[\p{Lu}])/gu),
      ];
      const from = bounds.length
        ? bounds[bounds.length - 1].index + bounds[bounds.length - 1][0].length
        : 0;
      const winStart = Math.max(from, g.start - 220);
      const win = sent.slice(winStart);
      for (const name of mentionNames(sources, it.url, it.text)) {
        const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(name)}(?![\\p{L}\\p{N}])`, "u");
        const m = re.exec(win);
        if (!m) continue;
        const at = winStart + m.index;
        if (inlineLinks.some((l) => at >= l.start && at < l.end) || inGroup(at)) continue;
        if (/\]\([^)]*$/.test(u.slice(Math.max(0, at - 200), at))) continue;
        if (quotes.some(([a, b]) => at > a && at < b)) continue;
        if (/\[[^\]]*$/.test(u.slice(0, at))) continue; // inside link text
        const without = removeGroup(u, g);
        u = without.slice(0, at) + `[${m[0]}](${it.url})` + without.slice(at + m[0].length);
        stats.g++;
        return u;
      }
    }
    return u;
  }
  return u;
}

// ---------- one guide ----------
function fixGuide(g) {
  const key = makeKeys(g.sources);
  const stats = { a2: 0, a: 0, b: 0, d: 0, c: 0, f: 0, g: 0, emptied: 0 };
  // link counts for source URLs over the body and the FAQ answers (frontmatter links counted once, from the answers)
  const urlCount = new Map();
  const recount = (text) => {
    for (const m of text.matchAll(/\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g))
      urlCount.set(m[1], (urlCount.get(m[1]) ?? 0) + 1);
  };
  recount(g.body + "\n" + g.faqText);
  let body = g.body;
  for (let pass = 0; pass < 8; pass++) {
    const ranges = unitRanges(body);
    let out = "";
    let pos = 0;
    let changed = false;
    for (const [a, b] of ranges) {
      out += body.slice(pos, a);
      const u = body.slice(a, b);
      const nu = isTableRow(u) ? u : fixUnit(u, { key, sources: g.sources, urlCount, stats });
      if (nu !== u) changed = true;
      out += nu;
      pos = b;
    }
    out += body.slice(pos);
    body = out;
    if (!changed) break;
  }
  return { body, stats };
}

// ---------- metrics ----------
function metrics(body, sources) {
  const key = makeKeys(sources);
  const m = {
    groups: 0,
    links: 0,
    doubled: 0,
    inQuotes: 0,
    repeatsInUnit: 0,
    afterPeriod: 0,
    emptyParens: (body.match(/\(\s*\)/g) ?? []).length,
  };
  for (const [a, b] of unitRanges(body)) {
    const u = body.slice(a, b);
    if (isTableRow(u)) continue;
    const groups = groupsIn(u);
    const quotes = quoteSpans(u);
    const seen = new Set();
    const inlineAll = [...u.matchAll(ONE_LINK)];
    for (const g of groups) {
      m.groups++;
      m.links += g.items.length;
      const keys = g.items.map((i) => key(i.text, i.url));
      if (
        new Set(g.items.map((i) => i.text.toLowerCase())).size < g.items.length ||
        new Set(g.items.map((i) => i.url)).size < g.items.length
      )
        m.doubled++;
      void keys;
      if (quotes.some(([x, y]) => g.start > x && g.end <= y)) m.inQuotes++;
      if (/[\p{Ll}\p{N}”"’)][.!?] $/u.test(u.slice(0, g.start))) m.afterPeriod++;
      for (const it of g.items) {
        const k = `${key(it.text, it.url)}|${it.url}`;
        if (seen.has(k)) m.repeatsInUnit++;
        seen.add(k);
        if (
          inlineAll.some(
            (l) =>
              l.index + l[0].length <= g.start &&
              g.start - (l.index + l[0].length) <= WINDOW &&
              !groups.some((gg) => l.index >= gg.start && l.index < gg.end) &&
              (l[2] === it.url || key(l[1], l[2]) === key(it.text, it.url)),
          )
        )
          m.repeatsInUnit++;
      }
    }
  }
  return m;
}

function diffLines(a, b) {
  const A = a.split("\n");
  const B = b.split("\n");
  const out = [];
  if (A.length !== B.length) return out;
  for (let i = 0; i < A.length; i++) {
    if (A[i] === B[i]) continue;
    let p = 0;
    while (p < A[i].length && A[i][p] === B[i][p]) p++;
    let q = 0;
    while (
      q < A[i].length - p &&
      q < B[i].length - p &&
      A[i][A[i].length - 1 - q] === B[i][B[i].length - 1 - q]
    )
      q++;
    const from = Math.max(0, p - 110);
    out.push([A[i].slice(from, A[i].length - q + 40), B[i].slice(from, B[i].length - q + 40)]);
  }
  return out;
}

// ---------- main ----------
const guides = (await loadGuides()).filter((g) => !ONLY || ONLY.has(g.slug));
const reports = [];
for (const g of guides) {
  const r = fixGuide(g);
  const again = fixGuide({ ...g, body: r.body });
  const before = metrics(g.body, g.sources);
  const after = metrics(r.body, g.sources);
  const linkedBefore = linkedSourceNumbers(g.body + "\n" + g.faqText, g.sources);
  const linkedAfter = linkedSourceNumbers(r.body + "\n" + g.faqText, g.sources);
  const lost = [...linkedBefore].filter((n) => !linkedAfter.has(n));
  const rep = {
    slug: g.slug,
    changed: r.body !== g.body,
    stats: r.stats,
    before,
    after,
    lost,
    idempotent: again.body === r.body,
    lines: diffLines(g.body, r.body),
  };
  reports.push(rep);
  if (WRITE && rep.changed && !lost.length && rep.idempotent && !after.emptyParens) {
    writeFileSync(g.file, g.full.slice(0, g.start) + r.body + g.full.slice(g.end));
    rep.written = true;
  }
}
if (JSON_OUT) console.log(JSON.stringify(reports, null, 2));
else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad("guide", 52) +
      "groups  links  doubled  inQuote  repeat  afterDot  | rules a/b/d/c/f/g/a2  status",
  );
  const tot = {
    gb: 0,
    ga: 0,
    lb: 0,
    la: 0,
    db: 0,
    da: 0,
    qb: 0,
    qa: 0,
    rb: 0,
    ra: 0,
    pb: 0,
    pa: 0,
  };
  for (const r of reports) {
    const { before: b, after: a } = r;
    tot.gb += b.groups;
    tot.ga += a.groups;
    tot.lb += b.links;
    tot.la += a.links;
    tot.db += b.doubled;
    tot.da += a.doubled;
    tot.qb += b.inQuotes;
    tot.qa += a.inQuotes;
    tot.rb += b.repeatsInUnit;
    tot.ra += a.repeatsInUnit;
    tot.pb += b.afterPeriod;
    tot.pa += a.afterPeriod;
    const s = r.stats;
    console.log(
      pad(r.slug, 52) +
        pad(`${b.groups}>${a.groups}`, 8) +
        pad(`${b.links}>${a.links}`, 7) +
        pad(`${b.doubled}>${a.doubled}`, 9) +
        pad(`${b.inQuotes}>${a.inQuotes}`, 9) +
        pad(`${b.repeatsInUnit}>${a.repeatsInUnit}`, 8) +
        pad(`${b.afterPeriod}>${a.afterPeriod}`, 10) +
        `| ${s.a}/${s.b}/${s.d}/${s.c}/${s.f}/${s.g}/${s.a2}  ` +
        (r.lost.length
          ? `LOST SOURCES ${r.lost}`
          : !r.idempotent
            ? "NOT-IDEMPOTENT"
            : r.written
              ? "written"
              : r.changed
                ? "would change"
                : "clean"),
    );
  }
  console.log(
    `TOTAL groups ${tot.gb}>${tot.ga}; links ${tot.lb}>${tot.la}; doubled groups ${tot.db}>${tot.da}; in quotes ${tot.qb}>${tot.qa}; repeats ${tot.rb}>${tot.ra}; after period ${tot.pb}>${tot.pa}`,
  );
  if (SHOW)
    for (const r of reports)
      for (const [x, y] of r.lines)
        console.log(`\n${r.slug}\n- ${x.slice(0, 700)}\n+ ${y.slice(0, 700)}`);
}
