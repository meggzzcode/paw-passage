/**
 * DEV TOOL, NOT SHIPPED. Renders the public keepsake examples (home page, unlock page) from REAL, licensed CC0 dog
 * photographs through the REAL keepsake renderer (src/passport/keepsake/artwork.ts, with the real fonts and the real
 * photo loader), driven in headless Chromium. Output is the Story format (1080x1920), shrunk to 540x960 webp.
 *
 * How it works
 *   1. Starts the minimal vite server in scripts/demo/vite.config.mjs (serves scripts/demo/harness-art.html, which
 *      exposes window.renderOne). No entitlement hook is involved, so nothing needs mocking.
 *   2. For each entry in scripts/demo/examples.json it loads the photo from SRC_DIR (never committed), renders the
 *      keepsake with the entry's crop (zoom, panX, panY) and keeps the PNG in RAW_DIR.
 *   3. compose.py writes public/examples/<id>.webp (finished keepsake) and <id>-photo.webp (the original photo, resized
 *      only), each <= 90 KB, no metadata. Credits live in docs/IMAGE-CREDITS.md.
 *
 * Run:  SRC_DIR=/path/to/originals node scripts/demo/render-examples.mjs
 * Needs: Playwright (PLAYWRIGHT_MODULE env var or `playwright` resolvable), python3 with Pillow.
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
const mimeOf = (f) => (/\.webp$/i.test(f) ? "image/webp" : "image/jpeg");

const server = spawn("npx", ["vite", "--config", path.join(here, "vite.config.mjs")], {
  cwd: root,
  stdio: "ignore",
});
try {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(`${base}/scripts/demo/harness-art.html`)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
  await page.goto(`${base}/scripts/demo/harness-art.html`);
  await page.waitForFunction(() => document.title === "ready", null, { timeout: 60000 });
  for (const ex of examples) {
    const file = path.join(srcDir, ex.photo);
    const png = await page.evaluate(
      async ([spec, photo]) =>
        window.renderOne({ ...spec, date: "November 2026", size: "story" }, [photo], "original"),
      [
        ex.spec,
        { b64: fs.readFileSync(file).toString("base64"), mime: mimeOf(file), ...ex.placement },
      ],
    );
    fs.writeFileSync(path.join(rawDir, `${ex.id}.png`), Buffer.from(png, "base64"));
    console.log("rendered", ex.id);
  }
  await browser.close();
} finally {
  server.kill();
}
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
  { stdio: "inherit" },
);
