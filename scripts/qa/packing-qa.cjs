// Browser QA for the packing planner. Needs Playwright with Chromium (not a project dependency):
//   BASE=http://localhost:4311 NODE_PATH=/opt/node-tools/node_modules node scripts/qa/packing-qa.cjs
// Writes screenshots to docs/editorial/img/packing-*.png and prints a JSON result for journeys A to F.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");
const BASE = process.env.BASE || "http://localhost:4311";
const OUT = path.join(__dirname, "../../docs/editorial/img");
const results = { journeys: {}, overflow: {}, notes: [] };
const shot = (page, name, opts = {}) =>
  page.screenshot({ path: path.join(OUT, `packing-${name}.png`), ...opts });
const dismissCookie = async (page) => {
  /* no consent banner on this site */
};

async function overflow(browser, url, label) {
  for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + url, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    }));
    (results.overflow[label] ||= {})[w] = r.sw <= r.iw ? "ok" : `OVERFLOW ${r.sw}>${r.iw}`;
    await ctx.close();
  }
}

async function build(page, { trip, days, dogs, conds = [], meals } = {}) {
  await page.goto(BASE + "/tools/packing-list", { waitUntil: "networkidle" });
  await page.waitForSelector('[data-hydrated="true"]');
  if (trip) await page.getByRole("radio", { name: new RegExp(trip) }).check({ force: true });
  if (days)
    for (let i = 3; i !== days; i += days > 3 ? 1 : -1)
      await page.getByRole("button", { name: days > 3 ? "More days" : "Fewer days" }).click();
  if (dogs)
    for (let i = 1; i < dogs; i++) await page.getByRole("button", { name: "More dogs" }).click();
  for (const c of conds) await page.getByRole("checkbox", { name: new RegExp(c) }).check();
  if (meals) await page.getByLabel(/Meals per dog/).selectOption(String(meals));
  await page.getByRole("button", { name: "Build my packing list" }).click();
  await page.waitForSelector("#pk-summary-h");
}
const names = (page) =>
  page.$$eval("[data-item]:not([data-custom])", (els) =>
    els.map((e) => e.getAttribute("data-item")),
  );
const progressText = (page) => page.textContent('[data-testid="pk-progress-text"]');

(async () => {
  const browser = await chromium.launch();
  const mobile = {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  };
  const desktop = { viewport: { width: 1280, height: 900 } };

  // ---- mobile
  let ctx = await browser.newContext(mobile);
  let page = await ctx.newPage();
  await page.goto(BASE + "/tools/packing-list", { waitUntil: "networkidle" });
  await page.waitForSelector('[data-hydrated="true"]');
  await shot(page, "m-01-initial");
  await shot(page, "m-01-initial-full", { fullPage: true });

  // Journey A: cabin weekend, 2 dogs, outdoor activities
  await build(page, { trip: "Cabin", days: 3, dogs: 2, conds: ["Hiking or outdoors"], meals: 2 });
  const a = await names(page);
  results.journeys.A = {
    items: a.length,
    hasTick: a.includes("tick-kit"),
    hasCarItems: a.includes("car-restraint"),
    progress: await progressText(page),
    summary: await page.textContent(".pk-summary-line"),
    food: await page.textContent('[data-item="food"] .pk-qty'),
  };
  await shot(page, "m-02-list");
  await shot(page, "m-02-list-full", { fullPage: true });
  await page
    .locator('[data-item="food"]')
    .getByRole("button", { name: /Why this is included/ })
    .click();
  await page.locator('[data-item="food"]').scrollIntoViewIfNeeded();
  await shot(page, "m-03-category-expanded-why");
  // collapse a category
  await page.getByRole("button", { name: /^Leashes, ID and safety/ }).click();
  await shot(page, "m-03b-category-collapsed");
  await page.getByRole("button", { name: /^Leashes, ID and safety/ }).click();
  // custom item
  await page.getByRole("textbox", { name: "Add your own item" }).fill("Reusable dog towel");
  await page.getByLabel("Quantity (optional)").first().fill("2");
  await page.getByRole("button", { name: "Add item" }).click();
  await page.locator('[data-custom="true"]').scrollIntoViewIfNeeded();
  await shot(page, "m-04-custom-item");
  // shopping panel
  await page
    .locator('[data-item="bowl"]')
    .getByRole("checkbox", { name: /Need to buy/ })
    .check();
  await page.locator('[data-shopping="bowl"]').scrollIntoViewIfNeeded();
  await shot(page, "m-05-shopping-panel");
  await page
    .locator('[data-shopping="bowl"]')
    .screenshot({ path: path.join(OUT, "packing-m-05b-shopping-panel-element.png") });
  await page
    .locator('[data-item="bed"]')
    .getByRole("checkbox", { name: /Need to buy/ })
    .check();
  await page
    .locator('[data-item="bed"]')
    .getByRole("checkbox", { name: /Packed/ })
    .check();
  await page.locator("#pick-up").scrollIntoViewIfNeeded();
  await shot(page, "m-06-pickup");
  await page
    .locator("#pick-up")
    .screenshot({ path: path.join(OUT, "packing-m-06b-pickup-element.png") });
  const poll = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }));
  results.notes.push(`mobile 390 after interactions: scrollWidth ${poll.sw} / ${poll.iw}`);
  // print emulation
  await page.emulateMedia({ media: "print" });
  await page.setViewportSize({ width: 794, height: 1123 });
  await shot(page, "p-01-print-screen", { fullPage: true });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: false,
    path: path.join(OUT, "packing-p-02-print.pdf"),
  });
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  results.notes.push(`print PDF pages: ${pages}`);
  await page.emulateMedia({ media: "screen" });
  await ctx.close();

  // ---- desktop
  ctx = await browser.newContext(desktop);
  page = await ctx.newPage();
  await build(page, { trip: "Cabin", days: 3, dogs: 2, conds: ["Hiking or outdoors"], meals: 2 });
  await page
    .locator('[data-item="bowl"]')
    .getByRole("checkbox", { name: /Need to buy/ })
    .check();
  await page
    .locator('[data-item="id-tag"]')
    .getByRole("checkbox", { name: /Packed/ })
    .check();
  await window_scroll(page, 0);
  await shot(page, "d-01-two-column");
  await shot(page, "d-01-two-column-full", { fullPage: true });
  await page.locator('[data-shopping="bowl"]').scrollIntoViewIfNeeded();
  await shot(page, "d-02-shopping");
  await page.locator("#pick-up").scrollIntoViewIfNeeded();
  await shot(page, "d-03-pickup");
  // sticky sidebar behaves: stays within viewport while scrolling
  await page.evaluate(() => window.scrollTo(0, 900));
  const sticky = await page.evaluate(() => {
    const r = document.querySelector(".pk-side").getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight };
  });
  results.notes.push(
    `desktop sidebar while scrolled: top ${sticky.top}, bottom ${sticky.bottom}, viewport ${sticky.vh}`,
  );
  await ctx.close();

  // ---- guide module
  for (const [label, opts] of [
    ["m", mobile],
    ["d", desktop],
  ]) {
    ctx = await browser.newContext(opts);
    page = await ctx.newPage();
    await page.goto(BASE + "/guides/dog-friendly-cabin-packing-list", { waitUntil: "networkidle" });
    const mod = page.locator("[data-planner-module]");
    await mod.scrollIntoViewIfNeeded();
    await mod.screenshot({ path: path.join(OUT, `packing-${label}-07-guide-module.png`) });
    await page.screenshot({ path: path.join(OUT, `packing-${label}-07b-guide-context.png`) });
    if (label === "m") {
      await mod.getByLabel("Dogs").selectOption("2");
      await mod.getByLabel("Days away").selectOption("4");
      await Promise.all([
        page.waitForURL(/tools\/packing-list/),
        mod.getByRole("button", { name: "Build my cabin packing list" }).click(),
      ]);
      await page.waitForSelector('[data-hydrated="true"]');
      results.journeys.guide = {
        url: page.url(),
        note: await page.textContent('[data-testid="pk-preset-note"]'),
        days: await page.inputValue('[role="spinbutton"] >> nth=0'),
        dogs: await page.inputValue('[role="spinbutton"] >> nth=1'),
      };
      await shot(page, "m-08-guide-preset");
    }
    await ctx.close();
  }

  // ---- Journey B: road trip, 5 days, driving
  ctx = await browser.newContext(mobile);
  page = await ctx.newPage();
  await build(page, { trip: "Road trip", days: 5 });
  const b = await names(page);
  results.journeys.B = {
    items: b.length,
    car: ["car-restraint", "seat-cover", "bottle"].every((i) => b.includes(i)),
    noRentalRules: !b.includes("rental-rules"),
    summary: await page.textContent(".pk-summary-line"),
  };
  // Journey C: beach / lake, 2 days
  await page.getByRole("button", { name: "Start over" }).click();
  await page.getByRole("button", { name: "Yes, start over" }).click();
  await build(page, { trip: "Beach or lake", days: 2 });
  const c = await names(page);
  results.journeys.C = {
    items: c.length,
    lifeJacket: c.includes("life-jacket"),
    noCar: !c.includes("car-restraint"),
    noWarmLayer: !c.includes("warm-layer"),
    summary: await page.textContent(".pk-summary-line"),
  };
  // Journey D: senior dog with mobility needs (road trip so a ramp is relevant)
  await page.getByRole("button", { name: "Start over" }).click();
  await page.getByRole("button", { name: "Yes, start over" }).click();
  await build(page, { trip: "Road trip", conds: ["Older dog"] });
  const d = await names(page);
  results.journeys.D = {
    ramp: d.includes("ramp"),
    rampTag: await page.textContent('[data-item="ramp"] .pk-tag'),
    seniorCare: d.includes("senior-care"),
    rampShopping: await (async () => {
      await page
        .locator('[data-item="ramp"]')
        .getByRole("checkbox", { name: /Need to buy/ })
        .check();
      return page.locator('[data-shopping="ramp"] .gearcard-caution').first().textContent();
    })(),
  };
  await page.locator('[data-shopping="ramp"]').scrollIntoViewIfNeeded();
  await shot(page, "m-09-senior-ramp");
  // Journey E: budget traveler never marks need to buy
  await page.getByRole("button", { name: "Start over" }).click();
  await page.getByRole("button", { name: "Yes, start over" }).click();
  await build(page, { trip: "Cabin" });
  for (const id of ["bowl", "leash", "bed", "first-aid"])
    await page
      .locator(`[data-item="${id}"]`)
      .getByRole("checkbox", { name: /Packed/ })
      .check();
  results.journeys.E = {
    shoppingPanels: await page.locator("[data-shopping]").count(),
    pickup: await page.locator("#pick-up").count(),
    amazonSentence: (await page.textContent("body")).includes("Amazon Associate"),
    amazonLinks: await page.locator("a[href*='amazon']").count(),
    progress: await progressText(page),
  };
  await ctx.close();

  await overflow(browser, "/tools/packing-list", "setup");
  await overflow(browser, "/guides/dog-friendly-cabin-packing-list", "guide");
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function window_scroll(page, y) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
}
