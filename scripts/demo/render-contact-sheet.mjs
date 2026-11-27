/**
 * DEV TOOL, NOT SHIPPED. Renders the review contact sheet: for every keepsake family the REAL renderer (artwork.ts,
 * real fonts, real photo loader) draws the Story output (1080x1920), three adventure variations (themes taken from the
 * real adventure -> theme mapping) and one square (1080x1080) and one portrait (1080x1350). Full-resolution PNGs are
 * written to OUT/full/<family>__<theme>__<format>.png; scripts/demo/make-sheets.py then builds the sheets.
 * Premium adventures contribute theme ids only (headlines fall back to the theme's own label); no premium text is used.
 *
 * Run: SRC_DIR=/path/to/originals OUT=/path/to/out node scripts/demo/render-contact-sheet.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const srcDir = path.resolve(process.env.SRC_DIR ?? path.join(root, ".demo-photos"));
const out = path.resolve(process.env.OUT ?? path.join(root, ".demo-sheets"));
const base = "http://127.0.0.1:5192";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright"
);
const examples = JSON.parse(fs.readFileSync(path.join(here, "examples.json"), "utf8"));
const place = (id) => examples.find((e) => e.id === id)?.placement ?? {};

// photo ids -> source file and the crop chosen for it
const P = {
  postcard: { file: "postcard.jpg", ...place("postcard") },
  magazine: { file: "magazine.jpg", ...place("magazine") },
  detective: { file: "detective.jpg", ...place("detective") },
  birthday: { file: "birthday.jpg", ...place("birthday") },
  certificate: { file: "certificate.jpg", ...place("certificate") },
  trading: { file: "trading-card.jpg", ...place("trading-card") },
  seasonal: { file: "seasonal.jpg", ...place("seasonal") },
};
// A theme entry is [theme, headline, subhead]; null headline = the theme's own label (premium cards: ids only).
const FAMILIES = [
  {
    family: "travel-postcard",
    name: "Travel postcard",
    dog: "Biscuit",
    photos: ["postcard"],
    themes: [
      ["day-trip", "CAPTAIN'S ROUTE", "Route chosen by the dog"],
      ["hometown-postcard", "GREETINGS FROM OUR TOWN", "Wish you were here"],
      ["sunset-beach-postcard"],
      ["christmas-card"],
    ],
  },
  {
    family: "magazine-cover",
    name: "Magazine cover",
    dog: "Juno",
    photos: ["magazine"],
    themes: [
      ["editorial-cover", "COVER STAR", "Exclusive portrait. No flash"],
      ["toy-champion", "OFFICIAL TOY CHAMPION", "Chosen by the dog, announced by you"],
      ["birthday-cover"],
      ["luxe-editorial"],
    ],
  },
  {
    family: "id-card",
    name: "Detective ID",
    dog: "Biscuit",
    photos: ["detective"],
    themes: [
      ["secret-agent", "DETECTIVE ID", "Cases solved by nose"],
      ["library-borrower-card", "CLUB MEMBER", "The dog is the expert"],
      ["ranger-card"],
      ["luggage-tag-card"],
    ],
  },
  {
    family: "trading-card",
    name: "Trading card",
    dog: "Biscuit",
    photos: ["trading"],
    themes: [
      ["explorer-card", "SAFARI EXPLORER", "Tracked by one very good nose"],
      ["star-card", "FOUNDING MEMBER", "Secret Handshake Club"],
      ["champion-medal-card", "PHOTO FINISH", "Caught in slow motion"],
      ["gold-foil-card"],
    ],
  },
  {
    family: "certificate",
    name: "Achievement certificate",
    dog: "Juno",
    photos: ["certificate"],
    themes: [
      ["toy-champion-certificate", "TOY CHAMPION", "Chosen by the dog"],
      ["quiet-club-certificate", "LISTENING POST", "Official station of one good listener"],
      ["laurel-award"],
      ["maritime-captain"],
    ],
  },
  {
    family: "seasonal-frame",
    name: "Seasonal frame",
    dog: "Juno",
    photos: ["seasonal"],
    themes: [
      ["winter", "WINTER WALK", "First snow of the year"],
      ["sunrise", "SUNRISE CLUB", "Breakfast with the first light"],
      ["golden-hour"],
      ["constellation-night"],
    ],
  },
  {
    family: "event-ticket",
    name: "Event ticket",
    dog: "Juno",
    photos: ["magazine"],
    themes: [
      ["campout-ticket", "CAMPGROUND PASS", "Living room campsite. One night only"],
      ["cinema-marquee"],
      ["safari-pass"],
      ["market-day"],
    ],
  },
  {
    family: "then-and-now",
    name: "Then and now",
    dog: "Juno",
    photos: ["detective", "postcard"],
    note: "one theme only; two different dogs here, no real same-dog pair",
    themes: [["then-and-now", "THEN AND NOW", "Same spot, a little more story"]],
    altPhotos: [
      ["birthday", "postcard"],
      ["magazine", "seasonal"],
      ["certificate", "detective"],
    ],
  },
  {
    family: "collage",
    name: "Collage",
    dog: "Juno",
    photos: ["birthday", "magazine", "detective", "postcard"],
    themes: [["favorite-moments"], ["friendship-map"], ["four-seasons-grid"], ["anniversary-gold"]],
  },
  {
    family: "poster",
    name: "Poster",
    dog: "Biscuit",
    photos: ["certificate"],
    themes: [
      ["ground-level-report", "THE LOW-DOWN", "Our house, from the floor"],
      ["bake-off", "CHIEF TASTE TESTER", "The Great Doggy Taste-Off"],
      ["archaeology-report", "TIME CAPSULE", "Dug up by paw"],
      ["menu-card"],
    ],
  },
];
const only = process.env.FAMILY;
const mimeOf = (f) => (/\.webp$/i.test(f) ? "image/webp" : "image/jpeg");
fs.mkdirSync(path.join(out, "full"), { recursive: true });

const server = spawn("npx", ["vite", "--config", path.join(here, "vite.config.mjs")], {
  cwd: root,
  stdio: "ignore",
});
const manifest = [];
try {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(`${base}/scripts/demo/harness-art.html`)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
  page.on("pageerror", (e) => console.log("pageerror", e.message));
  await page.goto(`${base}/scripts/demo/harness-art.html`);
  await page.waitForFunction(() => document.title === "ready", null, { timeout: 60000 });
  const photoIn = (id) => {
    const p = P[id];
    return {
      b64: fs.readFileSync(path.join(srcDir, p.file)).toString("base64"),
      mime: mimeOf(p.file),
      zoom: p.zoom,
      panX: p.panX,
      panY: p.panY,
    };
  };
  async function draw(fam, [theme, headline, subhead], size, ids, tag) {
    const png = await page.evaluate(
      async ([spec, photos]) => window.renderOne(spec, photos, "original"),
      [
        {
          family: fam.family,
          theme,
          headline: headline ?? "",
          subhead: subhead ?? "",
          dogName: fam.dog,
          date: "November 2026",
          size,
        },
        ids.map(photoIn),
      ],
    );
    const file = `${fam.family}__${theme}__${size}${tag ?? ""}.png`;
    fs.writeFileSync(path.join(out, "full", file), Buffer.from(png, "base64"));
    return file;
  }
  for (const fam of FAMILIES) {
    if (only && fam.family !== only) continue;
    const main = fam.themes[0];
    const rec = {
      family: fam.family,
      name: fam.name,
      note: fam.note ?? "",
      original: fam.photos.map((p) => P[p].file),
      story: "",
      variations: [],
      square: "",
      portrait: "",
    };
    rec.story = await draw(fam, main, "story", fam.photos);
    rec.square = await draw(fam, main, "square", fam.photos);
    rec.portrait = await draw(fam, main, "portrait", fam.photos);
    if (fam.altPhotos) {
      for (const [n, ids] of fam.altPhotos.entries())
        rec.variations.push({
          theme: main[0],
          file: await draw(fam, main, "story", ids, `__pair${n + 2}`),
        });
    } else {
      for (const t of fam.themes.slice(1, 4))
        rec.variations.push({ theme: t[0], file: await draw(fam, t, "story", fam.photos) });
    }
    manifest.push(rec);
    console.log("done", fam.family);
  }
  await browser.close();
} finally {
  server.kill();
}
fs.writeFileSync(
  path.join(out, only ? `manifest-${only}.json` : "manifest.json"),
  JSON.stringify(manifest, null, 1),
);
