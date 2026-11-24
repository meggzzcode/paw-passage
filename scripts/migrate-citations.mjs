#!/usr/bin/env bun
// Citation codemod. Deterministic and idempotent. Run with bun (it loads the .ts guides and the yaml package):
//   bun scripts/migrate-citations.mjs --dry-run                 report for every published guide, change nothing
//   bun scripts/migrate-citations.mjs --dry-run --only a,b      only these slugs
//   bun scripts/migrate-citations.mjs --write [--only a,b]      rewrite the guide files
//   add --json to print the report as JSON.
//
// For every published guide (content/guides/*.md and src/content/guides/*.ts) it:
//  (a) validates that every [[n]](url) uses exactly sources[n-1].url. A mismatch is fixed only when the URL appears
//      exactly once in sources (the marker is renumbered); otherwise it is reported and left alone.
//  (b) drops a marker for a source already cited earlier in the same paragraph / list item, and collapses runs of
//      stacked markers to at most 2 (never dropping a source's only citation).
//  (c) removes markers inside table rows. A source that would then be uncited gets one
//      "Sources for this table: [[n]](url)" line right under the table.
//  (d) when the source's publisher name appears in the 80 characters before a marker (same sentence), links that
//      first mention to the source URL and drops the marker. The source stays cited through the inline link.
// The `sources` frontmatter is never touched. Every source cited in the body before is still cited after
// (by a marker or an exact-URL inline link), or the guide is not written.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import { citedSourceNumbers } from "../src/content/citations.ts";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const JSON_OUT = args.includes("--json");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? new Set(args[onlyIdx + 1].split(",")) : null;
if (!WRITE && !args.includes("--dry-run")) {
  console.error("Pass --dry-run (report only) or --write.");
  process.exit(2);
}

const MARK = /\[\[(\d{1,3})\]\]\((https?:[^)\s]+)\)/g;
const countMarkers = (t) => [...t.matchAll(MARK)].length;
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
    const start = m[0].length;
    out.push({
      slug: f.replace(/\.md$/, ""),
      file,
      kind: "md",
      sources: data.sources ?? [],
      body: text.slice(start),
      full: text,
      start,
      end: text.length,
    });
  }
  const tsDir = join(ROOT, "src/content/guides");
  for (const f of readdirSync(tsDir)
    .filter((n) => n.endsWith(".ts") && n !== "index.ts")
    .sort()) {
    const file = join(tsDir, f);
    const mod = await import(pathToFileURL(file).href);
    const g = mod.guide;
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
      kind: "ts",
      sources: g.sources ?? [],
      body: text.slice(start, i),
      full: text,
      start,
      end: i,
    });
  }
  return out;
}

// ---------- publisher matching ----------
function publisherAliases(publisher) {
  const names = new Set();
  const base = publisher
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/,\s*\d{4}$/, "")
    .replace(/\s+via\s+.*$/i, "")
    .trim();
  names.add(base);
  for (const m of publisher.matchAll(/\(([A-Z]{2,6})\)/g)) names.add(m[1]);
  const list = [...names].filter((n) => n.length >= 3);
  return list.map((n) => ({ name: n, exactCase: !/\s/.test(n) && n.length > 0 }));
}
function findPublisher(window, publisher) {
  let best = null;
  for (const { name, exactCase } of publisherAliases(publisher)) {
    const re = new RegExp(`(?<![A-Za-z0-9])${esc(name)}(?![A-Za-z0-9])`, exactCase ? "g" : "gi");
    for (const m of window.matchAll(re)) {
      if (!best || m.index < best.index) best = { index: m.index, text: m[0] };
      break;
    }
  }
  return best;
}

// ---------- text helpers ----------
const isTableRow = (l) => /^\s*\|/.test(l);
const isUnitStart = (l) =>
  /^\s*([-*+]|\d+\.)\s/.test(l) || /^#{1,6}\s/.test(l) || isTableRow(l) || /^\s*>/.test(l);
const isSourcesLine = (l) => /^Sources for this table:/.test(l);

/** Removes [start,end) from a line together with the spaces before it, keeping words apart. */
function cut(line, start, end) {
  let s = start;
  while (s > 0 && line[s - 1] === " ") s--;
  let out = line.slice(0, s) + line.slice(end);
  if (
    s > 0 &&
    s < out.length &&
    /[\p{L}\p{N}*_]/u.test(out[s]) &&
    /[\p{L}\p{N}.,:;!?)*_"'”]/u.test(out[s - 1])
  ) {
    out = out.slice(0, s) + " " + out.slice(s);
  }
  return out;
}

/** Marker occurrences in a line with their positions. */
const markersIn = (line) =>
  [...line.matchAll(MARK)].map((m) => ({
    n: Number(m[1]),
    url: m[2],
    start: m.index,
    end: m.index + m[0].length,
  }));

function sentenceWindow(line, markerStart) {
  let before = line.slice(0, markerStart).replace(/[\s.!?"'”)*_]+$/u, "");
  const re = /(?<=[a-z0-9)\]"'”][.!?])\s+(?=[A-Z"(\[*])/g;
  let from = 0;
  for (const m of before.matchAll(re)) from = m.index + m[0].length;
  const s = Math.max(from, before.length - 80);
  return { text: before.slice(s), offset: s };
}

/** True when index i of line lies inside an existing Markdown link or a URL. */
function insideLink(line, i) {
  for (const m of line.matchAll(/\[[^\]]*\]\([^)]*\)|https?:\/\/\S+/g))
    if (i >= m.index && i < m.index + m[0].length) return true;
  return false;
}

// ---------- the migration of one body ----------
function migrate(g) {
  const rep = {
    slug: g.slug,
    kind: g.kind,
    sources: g.sources.length,
    markersBefore: countMarkers(g.body),
    mismatches: [],
    fixed: [],
    unresolved: [],
    dupDropped: 0,
    stackDropped: 0,
    stackKept: [],
    tableRemoved: 0,
    tableSourceLines: 0,
    inlineLinks: 0,
    inlineBySource: {},
    warnings: [],
  };
  const urlToIdx = new Map();
  g.sources.forEach((s, i) => urlToIdx.set(s.url, [...(urlToIdx.get(s.url) ?? []), i + 1]));
  let lines = g.body.split("\n");

  // (a) validate
  lines = lines.map((line, li) => {
    let out = line;
    for (const m of [...markersIn(line)].reverse()) {
      const want = g.sources[m.n - 1]?.url;
      if (want === m.url) continue;
      const cands = urlToIdx.get(m.url) ?? [];
      const note = `line ${li + 1}: [[${m.n}]] links ${m.url} but sources[${m.n}] is ${want ?? "(none)"}`;
      rep.mismatches.push(note);
      if (cands.length === 1) {
        out = out.slice(0, m.start) + `[[${cands[0]}]](${m.url})` + out.slice(m.end);
        rep.fixed.push(`${note} -> renumbered to [[${cands[0]}]]`);
      } else rep.unresolved.push(note);
    }
    return out;
  });

  const cited0 = citedSourceNumbers(lines.join("\n"), g.sources);
  const guard = (cur) => {
    const now = citedSourceNumbers(cur.join("\n"), g.sources);
    return [...cited0].filter((n) => !now.has(n));
  };

  const pass = () => {
    let changed = false;
    // paragraph / list-item units
    let unit = 0;
    const unitOf = lines.map((l) => {
      if (l.trim() === "") unit++;
      else if (isUnitStart(l)) unit++;
      return unit;
    });
    // (d-pre) dedupe a marker for a source already cited earlier in the same unit (marker or inline link)
    const seen = new Map();
    for (let li = 0; li < lines.length; li++) {
      if (isTableRow(lines[li]) || isSourcesLine(lines[li]) || /^#{1,6}\s/.test(lines[li]))
        continue;
      const u = unitOf[li];
      const set = seen.get(u) ?? new Set();
      seen.set(u, set);
      let line = lines[li];
      // inline links to sources count as a citation in this unit (left to right with markers)
      const events = [
        ...markersIn(line).map((m) => ({ ...m, kind: "marker" })),
        ...[...line.matchAll(/\]\((https?:[^)\s]+)\)/g)]
          .filter((m) => urlToIdx.has(m[1]) && !/\]\]\(/.test(line.slice(m.index - 1, m.index + 2)))
          .map((m) => ({ n: urlToIdx.get(m[1])[0], start: m.index, kind: "link" })),
      ].sort((a, b) => a.start - b.start);
      const drop = [];
      for (const e of events) {
        if (set.has(e.n)) {
          if (e.kind === "marker") drop.push(e);
        } else set.add(e.n);
      }
      for (const e of drop.sort((a, b) => b.start - a.start)) {
        line = cut(line, e.start, e.end);
        rep.dupDropped++;
        changed = true;
      }
      lines[li] = line;
    }

    // (d) publisher named just before the marker: link it, drop the marker
    for (let li = 0; li < lines.length; li++) {
      const line0 = lines[li];
      if (isTableRow(line0) || isSourcesLine(line0) || /^#{1,6}\s/.test(line0)) continue;
      let line = line0;
      for (const m of [...markersIn(line)].reverse()) {
        const src = g.sources[m.n - 1];
        if (!src || src.url !== m.url) continue;
        const w = sentenceWindow(line, m.start);
        const hit = findPublisher(w.text, src.publisher);
        if (!hit) continue;
        const at = w.offset + hit.index;
        if (insideLink(line, at)) continue;
        // The marker leaves; the first mention becomes a link. The marker sits after the mention, so cut it first.
        let next = cut(line, m.start, m.end);
        next = next.slice(0, at) + `[${hit.text}](${src.url})` + next.slice(at + hit.text.length);
        line = next;
        rep.inlineLinks++;
        rep.inlineBySource[m.n] = (rep.inlineBySource[m.n] ?? 0) + 1;
        changed = true;
      }
      lines[li] = line;
    }

    // (b) runs of stacked markers longer than 2: keep 2, never drop a source's only citation
    const total = new Map();
    const tally = () => {
      total.clear();
      for (const l of lines)
        for (const m of markersIn(l)) total.set(m.n, (total.get(m.n) ?? 0) + 1);
      for (const n of citedSourceNumbers(lines.join("\n"), g.sources))
        if (!total.has(n)) total.set(n, 1);
    };
    for (let li = 0; li < lines.length; li++) {
      const line0 = lines[li];
      if (isTableRow(line0) || isSourcesLine(line0)) continue;
      for (;;) {
        const ms = markersIn(lines[li]);
        // find the first run of >2 markers separated only by whitespace
        let run = null;
        for (let i = 0; i < ms.length;) {
          let j = i;
          while (j + 1 < ms.length && /^\s*$/.test(lines[li].slice(ms[j].end, ms[j + 1].start)))
            j++;
          if (j - i + 1 > 2) {
            run = ms.slice(i, j + 1);
            break;
          }
          i = j + 1;
        }
        if (!run) break;
        tally();
        // candidates to drop: later markers whose source is cited elsewhere too, from the end
        const victim = [...run]
          .reverse()
          .find((m, idx, arr) => (total.get(m.n) ?? 0) > 1 && run.indexOf(m) >= 2);
        if (!victim) {
          const note = `line ${li + 1}: ${run.length} stacked markers kept (sole citations): ...${lines[li].slice(Math.max(0, run[0].start - 70), run[run.length - 1].end).replace(/\]\(https?:[^)]*\)/g, "]")}`;
          if (!rep.stackKept.includes(note)) rep.stackKept.push(note);
          // mark as handled by turning the whole run into a comma-separated chain is not allowed; leave it
          break;
        }
        lines[li] = cut(lines[li], victim.start, victim.end);
        rep.stackDropped++;
        changed = true;
      }
    }
    return changed;
  };
  for (let i = 0; i < 6 && pass(); i++);

  // (c) table rows lose their markers; a source left uncited gets a line right under its table
  const removedFrom = new Map(); // source n -> index of the last row of the first table that had it
  for (let li = 0; li < lines.length; li++) {
    if (!isTableRow(lines[li])) continue;
    const ms = markersIn(lines[li]);
    if (!ms.length) continue;
    for (const m of ms)
      if (!removedFrom.has(m.n)) {
        let end = li;
        while (end + 1 < lines.length && isTableRow(lines[end + 1])) end++;
        removedFrom.set(m.n, { end, url: m.url });
      }
    for (const m of [...ms].reverse()) {
      lines[li] = cut(lines[li], m.start, m.end);
      rep.tableRemoved++;
    }
    lines[li] = lines[li].replace(/([^\s|\\])\|/g, "$1 |").replace(/\s+$/, "");
  }
  const now = citedSourceNumbers(lines.join("\n"), g.sources);
  const add = new Map(); // row index -> [n...]
  for (const [n, { end }] of removedFrom)
    if (cited0.has(n) && !now.has(n))
      add.set(
        end,
        [...(add.get(end) ?? []), n].sort((a, b) => a - b),
      );
  for (const end of [...add.keys()].sort((a, b) => b - a)) {
    const text =
      "Sources for this table: " +
      add
        .get(end)
        .map((n) => `[[${n}]](${g.sources[n - 1].url})`)
        .join(", ");
    lines.splice(end + 1, 0, "", text);
    rep.tableSourceLines++;
  }
  // a table is followed by a blank line already; collapse any accidental double blank lines created above
  let body = lines.join("\n").replace(/\n{3,}/g, "\n\n");
  if (/\n\n\n/.test(g.body)) body = lines.join("\n"); // never touch the body's own spacing

  const lost = guard(body.split("\n"));
  if (lost.length) rep.warnings.push(`sources no longer cited: ${lost.join(", ")}`);
  rep.markersAfter = countMarkers(body);
  rep.cited = [...citedSourceNumbers(body, g.sources)].length;
  rep.bodyChanged = body !== g.body;
  rep.newBody = body;
  rep.uncitedBefore = g.sources.map((_, i) => i + 1).filter((n) => !cited0.has(n));
  return rep;
}

// ---------- main ----------
const guides = (await loadGuides()).filter((g) => !ONLY || ONLY.has(g.slug));
const reports = [];
for (const g of guides) {
  const r = migrate(g);
  // idempotency check: migrating the result again must change nothing
  const again = migrate({ ...g, body: r.newBody });
  r.idempotent = again.newBody === r.newBody;
  reports.push(r);
  if (WRITE && r.bodyChanged && !r.warnings.length && r.idempotent) {
    writeFileSync(g.file, g.full.slice(0, g.start) + r.newBody + g.full.slice(g.end));
    r.written = true;
  }
}
if (JSON_OUT)
  console.log(
    JSON.stringify(
      reports.map(({ newBody, ...r }) => r),
      null,
      2,
    ),
  );
else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad("guide", 56) +
      "src  before  after  inline  dup  stack  table  tblLine  mism  fixed  unres  ok",
  );
  for (const r of reports)
    console.log(
      pad(r.slug, 56) +
        pad(r.sources, 5) +
        pad(r.markersBefore, 8) +
        pad(r.markersAfter, 7) +
        pad(r.inlineLinks, 8) +
        pad(r.dupDropped, 5) +
        pad(r.stackDropped, 7) +
        pad(r.tableRemoved, 7) +
        pad(r.tableSourceLines, 9) +
        pad(r.mismatches.length, 6) +
        pad(r.fixed.length, 7) +
        pad(r.unresolved.length, 7) +
        (r.warnings.length || !r.idempotent
          ? "CHECK " + r.warnings.join("; ") + (r.idempotent ? "" : " not-idempotent")
          : r.written
            ? "written"
            : "ok"),
    );
  const sum = (k) => reports.reduce((a, r) => a + r[k], 0);
  console.log(
    `TOTAL markers ${sum("markersBefore")} -> ${sum("markersAfter")}; inline links ${sum("inlineLinks")}; dup ${sum("dupDropped")}; stack ${sum("stackDropped")}; table markers ${sum("tableRemoved")}; table source lines ${sum("tableSourceLines")}`,
  );
  for (const r of reports) {
    for (const x of r.fixed) console.log(`FIXED ${r.slug}: ${x}`);
    for (const x of r.unresolved) console.log(`UNRESOLVED ${r.slug}: ${x}`);
    for (const x of r.stackKept) console.log(`STACK-KEPT ${r.slug}: ${x}`);
    if (r.uncitedBefore.length)
      console.log(
        `NOTE ${r.slug}: sources not cited in the body before: ${r.uncitedBefore.join(", ")}`,
      );
  }
}
