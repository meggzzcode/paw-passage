#!/usr/bin/env node
// Renders Pinterest pin PNGs (1000x1500, 2:3) from marketing/pins/pins.json + templates.
// Fully offline: local Chromium via Playwright, local fonts, no network requests, nothing written into the repo.
// Usage: node marketing/pins/generate.mjs [--set main|article] [--out DIR] [--only pin-id]
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
// --set article renders article-pins.json (Journal pins) into .../pins/article by default.
const set = arg("--set", "main");
if (!["main", "article"].includes(set)) {
  console.error("--set must be main or article.");
  process.exit(1);
}
const outDir = resolve(
  arg("--out", join(root, "..", "paws-passage-export", "pins", set === "article" ? "article" : "")),
);
const only = arg("--only", null);

if (resolve(outDir).startsWith(root + "/")) {
  console.error("Refusing to write images inside the repository. Choose --out outside it.");
  process.exit(1);
}

// Playwright: project install first, then the shared tools location.
function loadPlaywright() {
  for (const base of [join(root, "package.json"), "/node-tools/package.json"]) {
    try {
      return createRequire(base)("playwright");
    } catch {
      /* try next */
    }
  }
  console.error(
    "Playwright not found. Install it (npm i -D playwright) or set it up under /node-tools.",
  );
  process.exit(1);
}
const { chromium } = loadPlaywright();

const read = (p) => readFileSync(join(here, p), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const dogHead = read("templates/motifs/_dog-head.svg").trim();
const base = read("templates/_base.css")
  .replace(
    "{{FONT_FRAUNCES}}",
    pathToFileURL(join(root, "public/fonts/fraunces-latin-variable.woff2")).href,
  )
  .replace(
    "{{FONT_DMSANS}}",
    pathToFileURL(join(root, "public/fonts/dm-sans-latin-variable.woff2")).href,
  );

const palettes = {
  red: "--accent:#a82f23;--on:#fffaf0",
  pine: "--accent:#2f5d4e;--on:#fffaf0",
  ink: "--accent:#14283a;--on:#fffaf0;--red:#a82f23",
  ochre: "--accent:#7a5200;--on:#fffaf0",
};
const fur = [
  "--fur:#e8c48a;--ear:#b9824a",
  "--fur:#d9d2c3;--ear:#8c8374",
  "--fur:#f1dfc0;--ear:#d39a52",
  "--fur:#c79a6b;--ear:#7b5232",
];

function sizeClass(h) {
  const n = h.length;
  return n <= 22 ? "h-xl" : n <= 34 ? "h-lg" : n <= 48 ? "h-md" : "h-sm";
}

const pins = JSON.parse(read(set === "article" ? "article-pins.json" : "pins.json")).pins.filter(
  (p) => !only || p.id === only,
);
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "pp-pins-"));

const browser = await chromium
  .launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ["--no-sandbox", "--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE localhost"],
  })
  .catch(async () =>
    chromium.launch({
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE localhost"],
    }),
  );
const ctx = await browser.newContext({
  viewport: { width: 1000, height: 1500 },
  deviceScaleFactor: 1,
});
const results = [];
let netAttempts = 0;
for (const [i, p] of pins.entries()) {
  const page = await ctx.newPage();
  page.on("request", (r) => {
    if (!/^(file|data|about):/.test(r.url())) netAttempts++;
  });
  let art = read(`templates/motifs/${p.motif}.svg`).replace("<!--DOG-->", dogHead);
  const tpl = read(`templates/${p.template}.html`)
    .replace("{{kicker}}", esc(p.kicker))
    .replace("{{hsize}}", sizeClass(p.headline))
    .replace("{{headline}}", esc(p.headline))
    .replace("{{sub}}", esc(p.sub))
    .replace("{{art}}", art);
  const vars = `${palettes[p.palette] ?? palettes.red};${fur[i % fur.length]}`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${base}:root{${vars}}</style></head><body>${tpl}</body></html>`;
  const f = join(tmp, `${p.id}.html`);
  writeFileSync(f, html);
  await page.goto(pathToFileURL(f).href);
  await page.evaluate(() => document.fonts.ready);
  const file = join(outDir, `${p.id}.png`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1000, height: 1500 } });
  results.push({ id: p.id, bytes: statSync(file).size });
  await page.close();
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
for (const r of results) console.log(`${r.id}.png  1000x1500  ${(r.bytes / 1024).toFixed(0)} KB`);
console.log(
  `Rendered ${results.length} pin PNG(s) to ${outDir}. Non-local requests attempted: ${netAttempts}.`,
);
