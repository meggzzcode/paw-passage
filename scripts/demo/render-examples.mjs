/**
 * DEV TOOL, NOT SHIPPED. Renders the homepage / unlock-page keepsake examples from REAL, licensed dog photos using
 * the REAL keepsake editor component (src/components/passport/Keepsake.tsx), driven in a headless browser.
 *
 * How it works
 *   1. Starts the minimal vite server in scripts/demo/vite.config.mjs (serves scripts/demo/harness.html, which mounts
 *      <Keepsake/> directly; no entitlement hook is involved, so nothing needs mocking).
 *   2. For each entry in scripts/demo/examples.json it loads the photo from SRC_DIR (default: ./.demo-photos, never
 *      committed), puts it in the editor's file input, clicks the real "Download PNG" button and keeps the PNG.
 *   3. Builds a before/after pair (original photo on the left | finished keepsake on the right) and writes optimized
 *      webp files into public/examples/ (each <= 90 KB, total <= 900 KB). Credits live in docs/IMAGE-CREDITS.md.
 *
 * Run:  SRC_DIR=/path/to/photos node scripts/demo/render-examples.mjs
 * Needs: Playwright (PLAYWRIGHT_MODULE env var or `playwright` resolvable), python3 with Pillow for the final webp.
 */
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const srcDir = path.resolve(process.env.SRC_DIR ?? path.join(root, ".demo-photos"));
const rawDir = path.resolve(process.env.RAW_DIR ?? path.join(root, ".demo-raw"));
const base = "http://127.0.0.1:5192";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright"
);
const examples = JSON.parse(fs.readFileSync(path.join(here, "examples.json"), "utf8"));
fs.mkdirSync(rawDir, { recursive: true });

const server = spawn("npx", ["vite", "--config", path.join(here, "vite.config.mjs")], {
  cwd: root,
  stdio: "ignore",
});
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${base}/scripts/demo/harness.html`)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
  for (const ex of examples) {
    await page.goto(
      `${base}/scripts/demo/harness.html?spec=${encodeURIComponent(JSON.stringify(ex.spec))}`,
    );
    await page.waitForSelector("input[type=file]", { state: "attached" });
    const files = ex.photos.map((f) => path.join(srcDir, f));
    if (ex.mode === "card") await page.getByLabel(/Keepsake card/).check();
    for (let n = 0; n < files.length; n++) {
      const [fc] = await Promise.all([
        page.waitForEvent("filechooser"),
        page
          .getByRole("button", { name: /Choose from photos/ })
          .nth(n)
          .click(),
      ]);
      await fc.setFiles(files[n]);
      await page.waitForTimeout(900);
    }
    if (ex.size) await page.getByLabel(new RegExp(ex.size, "i")).first().check();
    await page.waitForTimeout(600);
    const [dl] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download PNG/ }).click(),
    ]);
    await dl.saveAs(path.join(rawDir, `${ex.id}.png`));
    console.log("rendered", ex.id);
  }
  await browser.close();
} finally {
  server.kill();
}
// Compose before/after pairs and write the optimized webp files.
execFileSync(
  "python3",
  [
    "-I",
    path.join(here, "compose.py"),
    srcDir,
    rawDir,
    path.join(root, "public/examples"),
    path.join(here, "examples.json"),
  ],
  {
    stdio: "inherit",
  },
);
