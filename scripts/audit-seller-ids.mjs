#!/usr/bin/env node
// Seller-ID audit: finds every place the SELLER's affiliate, analytics and partner identifiers still live, so a buyer can
// prove the transfer is complete. Read-only: it changes nothing and makes no network calls.
//
//   node scripts/audit-seller-ids.mjs                 plain report (always exits 0 unless the script itself fails)
//   node scripts/audit-seller-ids.mjs --expect-none   exits 1 if any seller ID remains (use after the transfer procedure)
//   node scripts/audit-seller-ids.mjs --json          machine-readable report
//   node scripts/audit-seller-ids.mjs --strict        also treat the seller's contact email / domain as remaining IDs
//   node scripts/audit-seller-ids.mjs --include-docs  also fail on documentation that still quotes the seller's IDs
//
// What counts as a seller ID is listed in scripts/seller-ids.json (public identifiers as at the 2026-11-24 baseline; none is a
// secret). The buyer may delete that file after the audit passes. Without it the script treats every Vrbo deeplink, Amazon tag
// and GA4 / Impact value it finds as the seller's (it cannot prove ownership), which is the safe direction.
// Procedure: docs/BUYER_AFFILIATE_TRANSITION.md.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, relative, dirname, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const EXPECT_NONE = args.has("--expect-none");
const JSON_OUT = args.has("--json");
const STRICT = args.has("--strict");
const INCLUDE_DOCS = args.has("--include-docs");

const rel = (p) => relative(root, p).split(sep).join("/");
const readYaml = (p) => (existsSync(p) ? (parseYaml(readFileSync(p, "utf8")) ?? {}) : {});

// ---- the seller baseline -------------------------------------------------------------------------------------------
const baselinePath = join(root, "scripts/seller-ids.json");
const hasBaseline = existsSync(baselinePath);
const baseline = hasBaseline ? JSON.parse(readFileSync(baselinePath, "utf8")) : {};
const list = (k) => (Array.isArray(baseline[k]) ? baseline[k] : []);

const settings = readYaml(join(root, "content/settings.yml"));
const affiliates = readYaml(join(root, "content/affiliates.yml")).links ?? [];

// Without a baseline, whatever is configured now is assumed to be the seller's.
const sellerSet = (key, current) =>
  new Set([...list(key), ...(hasBaseline ? [] : [current].filter(Boolean))].filter(Boolean));
const sellerTag = sellerSet("amazonTrackingId", settings.amazonTrackingId);
const sellerGa = sellerSet("ga4MeasurementId", settings.ga4MeasurementId);
const sellerImpact = sellerSet("impactSiteVerification", settings.impactSiteVerification);
const sellerPinterest = sellerSet("pinterestUrl", settings.pinterestUrl);
const sellerStay22 = sellerSet("stay22AccountId", settings.stay22AccountId);
const VRBO_LINK = /https?:\/\/(?:www\.)?vrbo\.com\/affiliate\/([A-Za-z0-9]+)/g;
const sellerVrboCodes = new Set(list("vrboDeeplinkCodes"));
const vrboCodesIn = (text) => [...text.matchAll(VRBO_LINK)].map((m) => m[1]);
const isSellerVrbo = (code) => !hasBaseline || sellerVrboCodes.has(code);
// Partner tracking domains: a link on one of these is a commission link tied to somebody's account.
const PARTNER_HOSTS =
  /https?:\/\/[^\s"')]*(?:\.|\/\/)(?:evyy\.net|sjv\.io|pxf\.io|ojrq\.net|prf\.hn|awin1\.com|shareasale\.com|tkqlhce\.com|jdoqocy\.com|anrdoezrs\.net|dpbolvw\.net|kqzyfj\.com|linksynergy\.com|amzn\.to)\/[^\s"')]*/i;

const findings = []; // {kind, severity: "block" | "warn" | "info", file, line, note}
const add = (f) => findings.push(f);

// ---- 1. settings (content/settings.yml) ----------------------------------------------------------------------------
const settingChecks = [
  ["Amazon Associates tracking ID", "amazonTrackingId", sellerTag],
  ["Google Analytics 4 ID", "ga4MeasurementId", sellerGa],
  ["Impact site-verification value", "impactSiteVerification", sellerImpact],
  ["Pinterest profile", "pinterestUrl", sellerPinterest],
  ["Stay22 account ID", "stay22AccountId", sellerStay22],
];
const settingsState = [];
for (const [label, key, seller] of settingChecks) {
  const v = String(settings[key] ?? "").trim();
  const state = v === "" ? "empty" : seller.has(v) || (!hasBaseline && v) ? "SELLER" : "replaced";
  settingsState.push({ label, key, state });
  if (state === "SELLER")
    add({
      kind: label,
      severity: "block",
      file: "content/settings.yml",
      note: `${key} still holds the seller's value`,
    });
}
for (const [label, key] of [
  ["Contact email", "contactEmail"],
  ["Website address", "siteUrl"],
]) {
  const v = String(settings[key] ?? "").trim();
  const sellerV = baseline.identity?.[key];
  if (v && sellerV && v === sellerV)
    add({
      kind: label,
      severity: STRICT ? "block" : "info",
      file: "content/settings.yml",
      note: `${key} is still the seller's (fine if the domain/mailbox transfers with the sale; replace otherwise)`,
    });
}

// ---- 2. affiliate links (content/affiliates.yml) -------------------------------------------------------------------
const vrboEntries = [];
const amazonEntries = [];
const otherPartnerEntries = [];
for (const l of affiliates) {
  const url = String(l.url ?? "");
  const codes = vrboCodesIn(url);
  if (codes.length) {
    vrboEntries.push({
      id: l.id,
      code: codes[0],
      approved: !!l.approved,
      seller: isSellerVrbo(codes[0]),
    });
    continue;
  }
  if (/amazon\./i.test(String(l.network)) || /amazon\.[a-z.]+\//i.test(url)) {
    amazonEntries.push(l);
    continue;
  }
  // A plain vrbo.com address (no /affiliate/ code) is not an account link. Anything else that is approved, or sits on a known
  // partner tracking domain, is a commission link tied to some account and must be confirmed as the buyer's.
  const plainVrbo = /^https?:\/\/(?:www\.)?vrbo\.com\/?(?:[?#].*)?$/i.test(url);
  if (url && !plainVrbo && (l.approved || PARTNER_HOSTS.test(url))) otherPartnerEntries.push(l);
}
const sellerVrbo = vrboEntries.filter((e) => e.seller);
if (sellerVrbo.length)
  add({
    kind: "Vrbo/Impact deeplink",
    severity: "block",
    file: "content/affiliates.yml",
    note: `${sellerVrbo.length} entries are the seller's deeplinks (${sellerVrbo.filter((e) => e.approved).length} marked approved); the stay records that use them are listed above`,
  });
for (const l of otherPartnerEntries)
  add({
    kind: "Other partner link",
    severity: "block",
    file: "content/affiliates.yml",
    note: `entry "${l.id}" (${l.network}) is a partner link: confirm it belongs to the buyer's own account`,
  });
// Amazon entries must use the placeholder, never a literal tag.
for (const l of amazonEntries) {
  const m = /[?&]tag=([^&\s]+)/.exec(String(l.url));
  if (m && m[1] !== "{amazonTrackingId}")
    add({
      kind: "Amazon tag (hard-coded)",
      severity: "block",
      file: "content/affiliates.yml",
      note: `entry "${l.id}" has a literal tag instead of {amazonTrackingId}`,
    });
  if (!m && /amazon\.[a-z.]+\/dp\//i.test(String(l.url)))
    add({
      kind: "Amazon link without tag",
      severity: "warn",
      file: "content/affiliates.yml",
      note: `entry "${l.id}" has no tag parameter`,
    });
}

// ---- 3. stay records affected by the Vrbo deeplinks -----------------------------------------------------------------
const vrboById = new Map(vrboEntries.map((e) => [e.id, e]));
const stayDir = join(root, "content/stays");
const stays = [];
if (existsSync(stayDir)) {
  for (const f of readdirSync(stayDir)
    .filter((n) => n.endsWith(".yml"))
    .sort()) {
    const y = readYaml(join(stayDir, f));
    const slug = f.replace(/\.yml$/, "");
    const m = /^https:\/\/(?:www\.)?vrbo\.com\/(\d+)/.exec(String(y.sourceUrl ?? ""));
    const affId = y.affiliateId || (m ? `vrbo-${m[1]}` : undefined);
    const entry = affId ? vrboById.get(affId) : undefined;
    stays.push({
      slug,
      status: y.status,
      affiliateId: affId,
      hasDeeplink: !!entry,
      sellerDeeplink: !!entry?.seller,
      approved: !!entry?.approved,
    });
  }
}
const affectedStays = stays.filter((s) => s.sellerDeeplink);

// ---- 4. every file that contains a seller identifier ----------------------------------------------------------------
const SKIP_DIR =
  /(^|\/)(node_modules|\.git|dist|\.output|\.netlify|\.tanstack|coverage|__pycache__)(\/|$)/;
const SKIP_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".avif",
  ".ico",
  ".woff",
  ".woff2",
  ".pdf",
  ".zip",
  ".lock",
  ".lockb",
  ".pyc",
]);
const SELF = new Set(["scripts/audit-seller-ids.mjs", "scripts/seller-ids.json"]);
function listFiles() {
  try {
    const out = execSync("git ls-files -z", {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 256 * 1024 * 1024,
    }).toString();
    const files = out.split("\0").filter(Boolean);
    if (files.length) return files;
  } catch {
    /* not a git checkout: walk the folder */
  }
  const acc = [];
  (function walk(d) {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (SKIP_DIR.test(rel(p))) continue;
      statSync(p).isDirectory() ? walk(p) : acc.push(rel(p));
    }
  })(root);
  return acc;
}
// Where a match counts: live = shipped or run (fails --expect-none), docs = prose that quotes the ID (informational).
const classify = (f) =>
  /^docs\//.test(f) || (!f.includes("/") && /\.md$/i.test(f))
    ? "docs"
    : /^src\/test\//.test(f)
      ? "test"
      : "live";
// The two files whose job is to hold values are judged by the structured checks above, not as hard-coded literals.
const STRUCTURED = new Set(["content/settings.yml", "content/affiliates.yml"]);

const literalPatterns = [
  ...[...sellerTag].map((v) => ["Amazon tag", v]),
  ...[...sellerGa].map((v) => ["GA4 ID", v]),
  ...[...sellerImpact].map((v) => ["Impact verification value", v]),
  ...[...sellerPinterest].map((v) => ["Pinterest profile", v]),
  ...[...sellerStay22].map((v) => ["Stay22 account", v]),
];
const fileHits = new Map(); // file -> Set of kinds
const noteHit = (file, kind, line) => {
  const k = `${kind}`;
  if (!fileHits.has(file)) fileHits.set(file, new Map());
  const m = fileHits.get(file);
  m.set(k, [...(m.get(k) ?? []), line]);
};
for (const f of listFiles()) {
  if (
    SKIP_DIR.test(f) ||
    SKIP_EXT.has(extname(f).toLowerCase()) ||
    SELF.has(f) ||
    f === "package-lock.json" ||
    f === "bun.lock"
  )
    continue;
  let text;
  try {
    const p = join(root, f);
    if (!existsSync(p) || statSync(p).size > 4 * 1024 * 1024) continue;
    text = readFileSync(p, "utf8");
  } catch {
    continue;
  }
  if (text.includes("\0")) continue;
  const lines = text.split("\n");
  const structured = STRUCTURED.has(f);
  lines.forEach((ln, i) => {
    if (!structured) {
      for (const [kind, v] of literalPatterns) if (ln.includes(v)) noteHit(f, kind, i + 1);
      for (const c of vrboCodesIn(ln))
        if (isSellerVrbo(c)) noteHit(f, "Vrbo/Impact deeplink", i + 1);
      if (
        classify(f) !== "test" &&
        /amazon\.[a-z.]+\/[^\s"')]*[?&]tag=[A-Za-z0-9-]+-\d{2}/i.test(ln)
      )
        noteHit(f, "Amazon tag (hard-coded in a link)", i + 1);
      if (/google-site-verification/i.test(ln) && classify(f) === "live")
        noteHit(f, "Search Console meta tag", i + 1);
    }
  });
  if (/^public\/google[0-9a-f]+\.html$/i.test(f)) noteHit(f, "Search Console verification file", 1);
}
for (const [file, kinds] of fileHits) {
  const cls = classify(file);
  for (const [kind, ls] of kinds) {
    const severity =
      cls === "live" ? "block" : cls === "docs" ? (INCLUDE_DOCS ? "block" : "info") : "warn";
    add({
      kind,
      severity,
      file,
      line: ls[0],
      note: `${ls.length} occurrence${ls.length === 1 ? "" : "s"}${cls === "docs" ? " (documentation)" : cls === "test" ? " (test fixture: update the test to read the setting)" : ""}`,
    });
  }
}
// IndexNow key and robots.txt belong to the domain, not to an affiliate account: informational.
if (existsSync(join(root, "public")))
  for (const n of readdirSync(join(root, "public")))
    if (/^[0-9a-f]{32}\.txt$/.test(n))
      add({
        kind: "IndexNow key file",
        severity: "info",
        file: `public/${n}`,
        note: "ties to the domain (public by design); replace with a new key if the domain changes",
      });
if (existsSync(join(root, "public/robots.txt"))) {
  const m = /Sitemap:\s*(\S+)/i.exec(readFileSync(join(root, "public/robots.txt"), "utf8"));
  if (m && baseline.identity?.siteUrl && m[1].startsWith(baseline.identity.siteUrl))
    add({
      kind: "Sitemap address in robots.txt",
      severity: "info",
      file: "public/robots.txt",
      note: `still points at ${m[1]}: update if the domain changes`,
    });
}

// ---- 5. directory consequence ---------------------------------------------------------------------------------------
const mode = String(settings.stayDirectoryMode || "affiliate-only");
const remainingApprovedStayLinks = vrboEntries.filter((e) => e.approved).length;
const directoryWarning =
  mode === "affiliate-only" && stays.length > 0 && remainingApprovedStayLinks === 0
    ? `With stayDirectoryMode "affiliate-only" and no approved stay links, the stay directory lists 0 of ${stays.length} stay records (no stay pages, nothing in the sitemap). Add the buyer's own Vrbo deeplinks, or follow docs/BUYER_AFFILIATE_TRANSITION.md section 6 for the public-sources fallback.`
    : "";

// ---- report --------------------------------------------------------------------------------------------------------
const blocking = findings.filter((f) => f.severity === "block");
const report = {
  baseline: hasBaseline
    ? "scripts/seller-ids.json"
    : "none (everything found is treated as the seller's)",
  settings: settingsState,
  affiliatesYml: {
    vrboEntries: vrboEntries.length,
    sellerVrboDeeplinks: sellerVrbo.length,
    sellerVrboEntryIds: sellerVrbo.map((e) => e.id),
    amazonEntries: amazonEntries.length,
    otherPartnerEntries: otherPartnerEntries.length,
  },
  stays: {
    records: stays.length,
    withSellerDeeplink: affectedStays.length,
    affected: affectedStays.map((s) => ({
      slug: s.slug,
      status: s.status,
      affiliateId: s.affiliateId,
      approved: s.approved,
    })),
  },
  stayDirectoryMode: mode,
  directoryWarning,
  findings,
  blocking: blocking.length,
};

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const out = [];
  out.push("SELLER-ID AUDIT (read-only)");
  out.push(`Baseline of seller IDs: ${report.baseline}`);
  out.push("");
  out.push("Settings (content/settings.yml)");
  for (const s of settingsState)
    out.push(`  ${s.state === "SELLER" ? "[SELLER]  " : "[ok]      "} ${s.label}: ${s.state}`);
  out.push(`  stayDirectoryMode: ${mode}`);
  out.push("");
  out.push("Affiliate links (content/affiliates.yml)");
  out.push(`  Vrbo/Impact deeplinks: ${vrboEntries.length} (seller's: ${sellerVrbo.length})`);
  out.push(
    `  Amazon entries: ${amazonEntries.length} (use the {amazonTrackingId} placeholder; the tag comes from settings)`,
  );
  out.push(`  Other partner links: ${otherPartnerEntries.length}`);
  out.push("");
  out.push(`Stay records using a seller Vrbo deeplink: ${affectedStays.length} of ${stays.length}`);
  for (const s of affectedStays)
    out.push(
      `  ${s.slug}  (${s.status}, link "${s.affiliateId}"${s.approved ? ", approved" : ""})`,
    );
  if (directoryWarning) out.push("", `NOTE: ${directoryWarning}`);
  out.push("");
  const order = { block: 0, warn: 1, info: 2 };
  const byFile = [...findings].sort(
    (a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file),
  );
  out.push(
    `Files and entries containing seller identifiers (${findings.length}; ${blocking.length} blocking)`,
  );
  const label = { block: "BLOCK", warn: "WARN ", info: "info " };
  const seen = new Set();
  for (const f of byFile) {
    const key = `${f.severity}|${f.kind}|${f.file}|${f.note}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(`  ${label[f.severity]} ${f.file}${f.line ? ":" + f.line : ""}  ${f.kind}: ${f.note}`);
  }
  out.push("");
  out.push(
    blocking.length
      ? `RESULT: ${blocking.length} seller identifier(s) remain.${EXPECT_NONE ? " Failing (--expect-none)." : " (report mode: exit 0)"}`
      : "RESULT: no seller identifiers remain in live files.",
  );
  console.log(out.join("\n"));
}
process.exit(EXPECT_NONE && blocking.length ? 1 : 0);
