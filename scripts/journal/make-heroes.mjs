// Generates the ten original Adventure Journal hero illustrations (flat art cards in the brand palette, no stock photos).
// Offline: renders inline SVG in a local Chrome through Playwright, then converts to WebP with Pillow (python3).
// Usage: node scripts/journal/make-heroes.mjs   (dev tool, not shipped; output: public/journal/<slug>.webp, each <= 60 KB)
// Playwright is resolved from the project or the global install; set CHROME_PATH to override the browser.
import { createRequire } from "node:module";
import { mkdirSync, rmSync, statSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const require = createRequire(import.meta.url);
let chromium;
for (const p of ["playwright", "/node-tools/node_modules/playwright", "playwright-core"]) {
  try {
    ({ chromium } = require(p));
    break;
  } catch {}
}
if (!chromium) throw new Error("Playwright not found");

const C = {
  ink: "#14283a",
  paper: "#f7f0e1",
  card: "#fffaf0",
  red: "#a82f23",
  ochre: "#e0a53a",
  pine: "#2f5d4e",
  sky: "#bcd4de",
  blush: "#e9c3b0",
  cream: "#efe2c6",
};

// One scene per article: a sky/ground palette plus a few motifs. The dog is a simple geometric character, original to this site.
const SCENES = {
  "things-to-do-with-your-dog-at-home": {
    bg: C.cream,
    ground: C.blush,
    motif: "window",
    dog: C.ochre,
  },
  "rainy-day-dog-activities": { bg: C.sky, ground: C.pine, motif: "rain", dog: C.ochre },
  "things-to-do-with-your-dog-this-weekend": {
    bg: "#f6dca0",
    ground: C.pine,
    motif: "sun",
    dog: C.cream,
  },
  "doggy-date-ideas": { bg: "#f1b99a", ground: C.red, motif: "blanket", dog: C.cream },
  "free-things-to-do-with-your-dog": { bg: C.paper, ground: C.pine, motif: "path", dog: C.ochre },
  "activities-to-bond-with-your-dog": {
    bg: C.blush,
    ground: C.cream,
    motif: "hearts",
    dog: C.ochre,
  },
  "puppy-bucket-list": { bg: "#dbe7c8", ground: C.pine, motif: "list", dog: C.cream, small: true },
  "fun-things-to-do-with-your-senior-dog": {
    bg: "#f3e3c2",
    ground: "#8a6a3c",
    motif: "bench",
    dog: "#c9c3b5",
    gray: true,
  },
  "family-activities-with-dogs": { bg: C.sky, ground: C.pine, motif: "family", dog: C.ochre },
  "activities-for-high-energy-dogs": { bg: "#f6c9a0", ground: C.pine, motif: "leap", dog: C.ochre },
};

const dog = (x, y, s, fill, gray, lift = 0) => `
<g transform="translate(${x} ${y - lift}) scale(${s})" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round">
  <ellipse cx="0" cy="40" rx="120" ry="70" fill="${fill}"/>
  <rect x="-100" y="70" width="26" height="70" rx="12" fill="${fill}"/>
  <rect x="70" y="70" width="26" height="70" rx="12" fill="${fill}"/>
  <path d="M-118 20 C-170 -10 -160 -70 -140 -80 C-132 -50 -120 -30 -105 -10Z" fill="${C.red}"/>
  <circle cx="95" cy="-30" r="58" fill="${fill}"/>
  <path d="M60 -70 C30 -110 20 -50 40 -20 C50 -40 55 -55 60 -70Z" fill="${gray ? "#8f8a7d" : C.red}"/>
  <ellipse cx="140" cy="-10" rx="40" ry="28" fill="${fill}"/>
  <circle cx="172" cy="-18" r="10" fill="${C.ink}"/>
  <circle cx="110" cy="-42" r="7" fill="${C.ink}"/>
  ${gray ? `<path d="M120 -2 q22 14 40 0" fill="none" stroke="#fffaf0" stroke-width="6"/>` : `<path d="M125 6 q18 12 34 0" fill="none"/>`}
</g>`;

const person = (x, y, c, s = 1) => `
<g transform="translate(${x} ${y}) scale(${s})" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round">
  <circle cx="0" cy="-130" r="30" fill="${C.blush}"/>
  <path d="M-42 -90 h84 l14 140 h-112z" fill="${c}"/>
  <rect x="-36" y="50" width="26" height="80" rx="10" fill="${C.ink}"/><rect x="10" y="50" width="26" height="80" rx="10" fill="${C.ink}"/>
</g>`;

const motifs = {
  window: () =>
    `<rect x="150" y="90" width="300" height="250" rx="8" fill="${C.sky}" stroke="${C.ink}" stroke-width="6"/><path d="M300 90v250M150 215h300" stroke="${C.ink}" stroke-width="6"/><circle cx="380" cy="150" r="30" fill="${C.ochre}"/><rect x="760" y="330" width="360" height="40" rx="14" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/>`,
  rain: () =>
    `<path d="M0 0" /><ellipse cx="300" cy="120" rx="160" ry="50" fill="#fffaf0" stroke="${C.ink}" stroke-width="5"/><ellipse cx="520" cy="95" rx="120" ry="42" fill="#fffaf0" stroke="${C.ink}" stroke-width="5"/>${Array.from({ length: 22 }, (_, i) => `<path d="M${120 + i * 48} ${190 + (i % 3) * 30} l-10 36" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`).join("")}<path d="M860 250 a90 90 0 0 1 180 0z" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/><path d="M950 250v90" stroke="${C.ink}" stroke-width="6"/>`,
  sun: () =>
    `<circle cx="960" cy="150" r="70" fill="${C.ochre}" stroke="${C.ink}" stroke-width="5"/>${Array.from(
      { length: 12 },
      (_, i) => {
        const a = (i * Math.PI) / 6;
        return `<path d="M${960 + Math.cos(a) * 90} ${150 + Math.sin(a) * 90} L${960 + Math.cos(a) * 118} ${150 + Math.sin(a) * 118}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
      },
    ).join(
      "",
    )}<path d="M0 470 Q220 360 460 450 T900 440 T1280 420 V720H0z" fill="${C.pine}" opacity=".35"/>`,
  blanket: () =>
    `<circle cx="300" cy="170" r="80" fill="${C.ochre}" stroke="${C.ink}" stroke-width="5"/><path d="M200 560 h560 l60 100 h-680z" fill="${C.card}" stroke="${C.ink}" stroke-width="5"/><path d="M250 585h470M232 620h500" stroke="${C.red}" stroke-width="10"/><rect x="800" y="420" width="130" height="90" rx="10" fill="${C.card}" stroke="${C.ink}" stroke-width="5"/><path d="M800 450h130" stroke="${C.red}" stroke-width="6"/>`,
  path: () =>
    `<path d="M520 720 C560 560 700 520 640 360 S760 230 780 200 L840 210 C800 280 700 380 760 470 S880 600 920 720z" fill="${C.cream}" stroke="${C.ink}" stroke-width="5"/>${[
      [220, 380],
      [980, 330],
      [1100, 470],
    ]
      .map(
        ([x, y]) =>
          `<g stroke="${C.ink}" stroke-width="5"><rect x="${x - 6}" y="${y}" width="12" height="70" fill="#8a6a3c"/><circle cx="${x}" cy="${y - 20}" r="55" fill="${C.pine}"/></g>`,
      )
      .join("")}`,
  hearts: () =>
    [
      [260, 170, 1],
      [980, 140, 0.8],
      [1100, 300, 0.6],
      [140, 330, 0.6],
    ]
      .map(
        ([x, y, s]) =>
          `<path transform="translate(${x} ${y}) scale(${s})" d="M0 40 C-60 -10 -40 -70 0 -35 C40 -70 60 -10 0 40z" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/>`,
      )
      .join(""),
  list: () =>
    `<rect x="150" y="90" width="300" height="390" rx="12" fill="${C.card}" stroke="${C.ink}" stroke-width="6" transform="rotate(-4 300 285)"/>${[0, 1, 2, 3, 4].map((i) => `<g transform="rotate(-4 300 285)"><rect x="185" y="${140 + i * 68}" width="34" height="34" rx="6" fill="${i < 3 ? C.pine : "none"}" stroke="${C.ink}" stroke-width="5"/><path d="M240 ${157 + i * 68}h170" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>`).join("")}<circle cx="1000" cy="150" r="60" fill="${C.ochre}" stroke="${C.ink}" stroke-width="5"/>`,
  bench: () =>
    `<rect x="620" y="330" width="420" height="30" rx="8" fill="#8a6a3c" stroke="${C.ink}" stroke-width="5"/><rect x="640" y="360" width="26" height="120" fill="#8a6a3c" stroke="${C.ink}" stroke-width="5"/><rect x="1000" y="360" width="26" height="120" fill="#8a6a3c" stroke="${C.ink}" stroke-width="5"/><rect x="620" y="250" width="420" height="24" rx="8" fill="#8a6a3c" stroke="${C.ink}" stroke-width="5"/><circle cx="220" cy="160" r="80" fill="${C.ochre}" opacity=".8" stroke="${C.ink}" stroke-width="5"/>`,
  family: () =>
    `<circle cx="1050" cy="130" r="60" fill="${C.ochre}" stroke="${C.ink}" stroke-width="5"/><g stroke="${C.ink}" stroke-width="5"><rect x="154" y="340" width="12" height="90" fill="#8a6a3c"/><circle cx="160" cy="300" r="70" fill="${C.pine}"/></g>`,
  leap: () =>
    `<circle cx="200" cy="140" r="70" fill="${C.ochre}" stroke="${C.ink}" stroke-width="5"/><path d="M80 560 q60 -60 120 0 M980 600 q60 -60 120 0" stroke="${C.ink}" stroke-width="6" fill="none"/>${Array.from({ length: 4 }, (_, i) => `<path d="M${140 + i * 34} ${470 - i * 10} h-70" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" opacity=".6"/>`).join("")}`,
};

function svg(slug, sc) {
  const s = sc.small ? 0.55 : 1;
  const dogX = slug === "activities-for-high-energy-dogs" ? 620 : sc.motif === "bench" ? 790 : 640;
  const dogY = sc.motif === "bench" ? 330 : sc.motif === "blanket" ? 520 : 560;
  const lift = slug === "activities-for-high-energy-dogs" ? 140 : 0;
  const people =
    sc.motif === "family"
      ? person(260, 420, C.red, 0.95) +
        person(400, 440, C.pine, 0.8) +
        person(500, 470, C.ochre, 0.55)
      : ["puppy-bucket-list", "free-things-to-do-with-your-dog"].includes(slug)
        ? ""
        : person(
            sc.motif === "blanket" ? 440 : sc.motif === "bench" ? 880 : 1010,
            sc.motif === "blanket" ? 400 : 480,
            sc.motif === "bench" ? C.pine : C.red,
            sc.motif === "blanket" ? 0.9 : 1,
          );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<rect width="1280" height="720" fill="${sc.bg}"/>
${sc.motif === "blanket" ? "" : `<g>${motifs[sc.motif]()}</g>`}
<path d="M0 560 Q320 520 640 560 T1280 550 V720 H0z" fill="${sc.ground}" stroke="${C.ink}" stroke-width="5"/>
${sc.motif === "blanket" ? `<g>${motifs.blanket()}</g>` : ""}
${people}
${dog(dogX, dogY, s, sc.dog, sc.gray, lift)}
<g fill="${C.ink}" opacity=".18">${[
    [90, 650],
    [190, 680],
    [1140, 660],
    [1215, 630],
  ]
    .map(
      ([x, y]) =>
        `<ellipse cx="${x}" cy="${y}" rx="14" ry="11"/><circle cx="${x - 16}" cy="${y - 16}" r="6"/><circle cx="${x}" cy="${y - 22}" r="6"/><circle cx="${x + 16}" cy="${y - 16}" r="6"/>`,
    )
    .join("")}</g>
</svg>`;
}

const out = join(root, "public", "journal");
const tmp = join(root, "node_modules", ".cache", "journal-heroes");
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });
const exe =
  process.env.CHROME_PATH || ["/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const [slug, sc] of Object.entries(SCENES)) {
  await page.setContent(`<body style="margin:0">${svg(slug, sc)}</body>`);
  const png = join(tmp, `${slug}.png`);
  await page.screenshot({ path: png });
  const dest = join(out, `${slug}.webp`);
  let q = 82;
  for (; q >= 30; q -= 8) {
    const r = spawnSync("python3", [
      "-c",
      "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],'WEBP',quality=int(sys.argv[3]),method=6)",
      png,
      dest,
      String(q),
    ]);
    if (r.status !== 0) throw new Error(String(r.stderr));
    if (statSync(dest).size <= 60 * 1024) break;
  }
  console.log(slug, Math.round(statSync(dest).size / 1024) + " KB");
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
