#!/usr/bin/env node
// Builds the owner package OUTSIDE the repository, in exactly six sections. Nothing generated is committed.
// Usage: node marketing/build-owner-package.mjs --out DIR [--skip-render] [--site ORIGIN] [--zip]
// Reads only tracked repo files (docs, public images, pin sources). It reads no secrets, no customer data and no premium text.
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  readdirSync,
  statSync,
  rmSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const out = resolve(arg("--out", join(root, "..", "paws-passage-export", "owner-package")));
if (out === root || out.startsWith(root + "/")) {
  console.error("Refusing to build the package inside the repository.");
  process.exit(1);
}
const date = new Date().toISOString().slice(0, 10);
const SITE = arg("--site", "https://YOUR-SITE-DOMAIN").replace(/\/$/, "");
const price =
  readFileSync(join(root, "src/config/site.ts"), "utf8").match(/price:\s*"([^"]+)"/)?.[1] ??
  "(see src/config/site.ts)";

const SECTIONS = [
  "01-Business-Overview",
  "02-Website-and-Operations",
  "03-Product-Assets",
  "04-Marketing",
  "05-Financial-Performance",
  "06-Transfer-and-Recovery",
];
mkdirSync(out, { recursive: true });
// Rebuild cleanly: remove only the six sections (and stray files from older layouts), so no stale duplicates remain.
for (const e of readdirSync(out)) rmSync(join(out, e), { recursive: true, force: true });
for (const s of SECTIONS) mkdirSync(join(out, s), { recursive: true });

const put = (sec, rel, text) => {
  const f = join(out, sec, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, text);
};
const copy = (sec, src, dst = src.split("/").pop()) => {
  if (!existsSync(join(root, src))) return false;
  const f = join(out, sec, dst);
  mkdirSync(dirname(f), { recursive: true });
  copyFileSync(join(root, src), f);
  return true;
};
const ls = (d) => (existsSync(d) ? readdirSync(d) : []);

// 04 Marketing: pins first (rendering needs the repo's pin generator).
const M = SECTIONS[3];
if (!args.includes("--skip-render")) {
  const gen = join(here, "pins/generate.mjs");
  execFileSync("node", [gen, "--out", join(out, M, "pins/general")], { stdio: "inherit" });
  execFileSync("node", [gen, "--set", "article", "--out", join(out, M, "pins/article")], {
    stdio: "inherit",
  });
}
const csvCell = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
const rows = [
  ["file", "pin_title", "description", "destination_url_with_utm", "source", "status", "alt_text"],
];
let completed = 0;
let concept = 0;
for (const [source, json, dir] of [
  ["general", "pins.json", "pins/general"],
  ["article", "article-pins.json", "pins/article"],
]) {
  const { pins } = JSON.parse(readFileSync(join(here, "pins", json), "utf8"));
  for (const p of pins) {
    const rel = `${dir}/${p.id}.png`;
    const ok = existsSync(join(out, M, rel)) && statSync(join(out, M, rel)).size > 10000;
    ok ? completed++ : concept++;
    const alt = `Pinterest pin: ${p.kicker}. ${p.headline}. ${p.sub}`.replace(/\s+/g, " ");
    rows.push([
      rel,
      p.title,
      p.description,
      `${SITE}${p.destination}`,
      source,
      ok ? "COMPLETED graphic" : "NOT RENDERED",
      alt,
    ]);
  }
}
put(M, "PINS.csv", rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
for (const [src, dst] of [
  ["docs/MARKETING.md", "MARKETING.md"],
  ["docs/EMAIL-NUDGES.md", "EMAIL-NUDGES.md"],
  ["marketing/README.md", "PIN-GENERATOR.md"],
])
  copy(M, src, dst);
put(
  M,
  "CAMPAIGN-TRACKING.md",
  `# Campaign tracking

Every pin link is the site address plus the destination in PINS.csv, copied exactly (utm_source=pinterest, utm_medium=social, utm_campaign, utm_content). Never add personal data to a link; keep names lowercase with hyphens.

- Measurable: Pinterest impressions, saves and outbound clicks per pin; on the site, visits by utm_campaign and the aggregate events purchase_cta_clicked and checkout_started.
- Limits: campaign data is not tied to confirmed Gumroad purchases, so a sale cannot be credited to one pin. Some browsers strip tracking parameters; counts are a lower bound.
- Weekly (about 30 minutes): choose 3 to 5 pins, upload the PNG, paste title and description, set the link exactly, pick the board; note outbound clicks per pin at the end of the week; retire the weakest pins monthly.
- Pins carry no hashtags, no discounts, no deadlines and no premium adventure text.
`,
);
put(
  M,
  "README.md",
  `# 04 Marketing

${completed} pin graphics rendered (${concept} not rendered). Pins: pins/general (30) and pins/article (30), 1000x1500 PNG. PINS.csv has title, description, link with UTM and alt text per pin. The links start with ${SITE}; rebuild with --site <real domain> before posting. MARKETING.md is the plan; EMAIL-NUDGES.md is a proposal only; CAMPAIGN-TRACKING.md has the routine and limits. The Pinterest account itself is not part of this package.
`,
);

// 03 Product assets
const P = SECTIONS[2];
const lines = [];
const hasCredits = existsSync(join(root, "docs/IMAGE-CREDITS.md"));
for (const dir of ["examples", "demo", "journal"]) {
  mkdirSync(join(out, P, "site-images", dir), { recursive: true });
  for (const f of ls(join(root, "public", dir))) {
    copyFileSync(join(root, "public", dir, f), join(out, P, "site-images", dir, f));
    const status =
      dir === "journal"
        ? "Journal picture; provenance in IMAGE-CREDITS.md"
        : "Illustrative keepsake art generated by the project; not a customer photo";
    lines.push(`| site-images/${dir}/${f} | ${status} |`);
  }
}
for (const [src, dst] of [
  ["docs/IMAGE-CREDITS.md", "IMAGE-CREDITS.md"],
  ["docs/DESIGN-ASSET-LICENSES.md", "DESIGN-ASSET-LICENSES.md"],
  ["docs/DESIGN-SYSTEM.md", "DESIGN-SYSTEM.md"],
  ["docs/PRINTABLES.md", "PRINTABLES.md"],
  ["public/fonts/OFL-DM-Sans.txt", "licenses/OFL-DM-Sans.txt"],
  ["public/fonts/OFL-Fraunces.txt", "licenses/OFL-Fraunces.txt"],
])
  copy(P, src, dst);
put(
  P,
  "README.md",
  `# 03 Product assets

Built ${date}. Images in site-images are copies of the site's example, demo and journal pictures. Licenses and credits: IMAGE-CREDITS.md${hasCredits ? "" : " (missing: provenance UNVERIFIED)"}, DESIGN-ASSET-LICENSES.md and licenses/ (fonts, SIL OFL 1.1). Pin art (04 Marketing) is original SVG and HTML. Licenses to use are not ownership; a trademark search for the brand name is not done. Not legal advice. The premium adventure text is NOT in this package; it is the protected package, described in 06.

| File | Status |
| ---- | ------ |
${lines.join("\n")}
`,
);

// 01 Business overview
const B = SECTIONS[0];
copy(B, "docs/PRODUCT-SPEC.md");
put(
  B,
  "README.md",
  `# 01 Business overview

Paws & Passage: a dog-adventure library. A visitor gets one free personalized introductory adventure with no account, email or card, can browse public previews, and may buy the full library once for ${price} (one-time, no subscription, no renewals). Photos never leave the device. Tagline: "A lifetime of little adventures."

Facts to quote only from their source: library size (node scripts/library-stats.mjs --md in the repository), price (src/config/site.ts), costs (02 OPERATING-COSTS.md, a model not a measurement). Revenue, traffic and customer numbers come only from the source account on the day (05). No testimonials, ratings or urgency claims exist or should be added.

PRODUCT-SPEC.md is the product definition. The current plan and next steps are in 02 COWORK-HANDOFF.md.
`,
);

// 02 Website and operations
const W = SECTIONS[1];
for (const f of [
  "COWORK-HANDOFF",
  "OPERATIONS",
  "ARCHITECTURE",
  "LAUNCH-CHECKLIST",
  "NETLIFY-PREVIEW",
  "GOOGLE-SETUP",
  "ANALYTICS-REPORTING",
  "OPERATING-COSTS",
  "SECURITY-REVIEW",
  "POLICIES-REVIEW",
])
  copy(W, `docs/${f}.md`);
put(
  W,
  "README.md",
  `# 02 Website and operations

The site is a TanStack Start app on Netlify (Functions and Blobs), source in the GitHub repository, content edited through Pages CMS, design work in Lovable. Start with COWORK-HANDOFF.md (the seven phases), then OPERATIONS.md (routine, environment variable names, customer-data export and restore, minimum recovery). No secret values are in this package; the owner keeps them in the Netlify settings and a password manager.
`,
);

// 05 Financial performance (template only, no numbers)
const F = SECTIONS[4];
const months = Array.from({ length: 12 }, (_, i) => `month-${String(i + 1).padStart(2, "0")}`);
put(
  F,
  "monthly-performance.csv",
  [
    "month,gross_sales,payment_fees,refunds,net_revenue,opex,monthly_profit,notes",
    ...months.map((m) => `${m},,,,,,,`),
  ].join("\n") + "\n",
);
put(
  F,
  "README.md",
  `# 05 Financial performance

Template only. monthly-performance.csv opens in any spreadsheet; every cell is empty on purpose. Fill it from source documents, never from estimates.

| Column | Meaning | Source |
| ------ | ------- | ------ |
| gross_sales | Sales before fees and refunds | Gumroad sales export (dashboard, Sales, export icon) |
| payment_fees | Gumroad and payment fees | Gumroad payout and sales reports |
| refunds | Refunded sales | Gumroad sales export |
| net_revenue | gross_sales - payment_fees - refunds | Formula |
| opex | Hosting, domain, tools | Netlify and registrar invoices |
| monthly_profit | net_revenue - opex | Formula |

Keep the exported Gumroad CSVs and invoices outside this package in the owner's private records (they hold customer data). 02 OPERATING-COSTS.md is a cost model, not actuals.
`,
);

// 06 Transfer and recovery
const T = SECTIONS[5];
for (const f of ["TRANSFER-INVENTORY", "PREMIUM-CONTENT-WORKFLOW"]) copy(T, `docs/${f}.md`);
put(T, "BACKUP-LOG.csv", "date,what,where_kept_description,integrity_check_done,checked_by\n");
put(
  T,
  "README.md",
  `# 06 Transfer and recovery

- TRANSFER-INVENTORY.md: every asset, who owns it, how it can or cannot move, buyer and seller actions, status (UNVERIFIED unless proven). Gumroad account or username transfer needs Gumroad's consent; do not assume a login handover.
- PREMIUM-CONTENT-WORKFLOW.md: the protected content package, export, import, backup and rollback.
- Customer-data export and restore, and the minimum recovery process: 02 OPERATIONS.md (one section; not duplicated here).
- Entitlement portability: purchases are keyed to the license and purchase reference, so a future checkout can be added without replacing the customer records (see TRANSFER-INVENTORY.md).
- BACKUP-LOG.csv: record each backup (date, what, a description of where it is kept, whether its checksum was verified). Never write paths, ids, secrets or license codes in it. Private records stay with the owner, outside this package.
`,
);

// Index
writeFileSync(
  join(out, "README.md"),
  `# Paws & Passage owner package

Built ${date} by marketing/build-owner-package.mjs. Six sections, no archives, no duplicate documents:

| Section | Contents |
| ------- | -------- |
${SECTIONS.map((s) => `| ${s} | ${{ "01-Business-Overview": "What the business is, the offer, the product definition", "02-Website-and-Operations": "Plan, operations, architecture, launch, Google and Netlify setup, costs model", "03-Product-Assets": "Site images, credits, licenses, design system", "04-Marketing": "Pins, links, plan, tracking", "05-Financial-Performance": "Empty monthly template and where each figure comes from", "06-Transfer-and-Recovery": "Transfer inventory, protected package workflow, backup log" }[s]} |`).join("\n")}

Sensitive records (incident notes, premium package, exports, credentials) are private and are not here. Refresh: from the repository root run node marketing/build-owner-package.mjs --out <folder outside the repository> (add --skip-render to skip pin rendering).
`,
);

if (args.includes("--zip")) {
  const zip = join(dirname(out), `${out.split("/").pop()}.zip`);
  rmSync(zip, { force: true });
  execFileSync("zip", ["-rq", zip, "."], { cwd: out });
  console.log(`Zip: ${zip}`);
}
console.log(`Package: ${out}; ${completed} pins rendered, ${concept} not rendered.`);
