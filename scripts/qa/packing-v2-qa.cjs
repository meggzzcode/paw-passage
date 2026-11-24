// Browser QA for the packing planner's second pass (item controls, Undo, the four "Need to buy" responses, extras,
// the Gear trip handoff, overflow at seven widths, Journey 1). Needs Playwright with Chromium (not a project dependency):
//   BASE=http://localhost:4377 NODE_PATH=/opt/node-tools/node_modules node scripts/qa/packing-v2-qa.cjs
// Writes docs/editorial/img/packing-v2-*.png and prints a JSON result.
const { chromium } = require("playwright");
const path = require("node:path");
const BASE = process.env.BASE || "http://localhost:4377";
const OUT = path.join(__dirname, "../../docs/editorial/img");
const out = { overflow: {}, journey1: {}, notes: [] };
const mobile = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};
const desktop = { viewport: { width: 1280, height: 900 } };
const file = (n) => path.join(OUT, `packing-v2-${n}.png`);

async function build(page, { trip = "Cabin", days, dogs, conds = [] } = {}) {
  await page.goto(BASE + "/tools/packing-list", { waitUntil: "networkidle" });
  await page.waitForSelector('[data-hydrated="true"]');
  await page.getByRole("radio", { name: new RegExp(trip) }).check({ force: true });
  if (days)
    for (let i = 3; i < days; i++) await page.getByRole("button", { name: "More days" }).click();
  if (dogs)
    for (let i = 1; i < dogs; i++) await page.getByRole("button", { name: "More dogs" }).click();
  for (const c of conds) await page.getByRole("checkbox", { name: new RegExp(c) }).check();
  await page.getByRole("button", { name: "Build my packing list" }).click();
  await page.waitForSelector("#pk-summary-h");
}
const buy = (page, id) =>
  page
    .locator(`[data-item="${id}"]`)
    .getByRole("checkbox", { name: /Need to buy/ })
    .check();

(async () => {
  const browser = await chromium.launch();
  for (const [label, opts] of [
    ["390", mobile],
    ["1280", desktop],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await build(page, { days: 3, dogs: 2 });
    // item controls
    const row = page.locator('[data-item="throw"]');
    await row.scrollIntoViewIfNeeded();
    await row.getByRole("button", { name: "Why bring this?" }).click();
    await row.screenshot({ path: file(`controls-${label}`) });
    // undo
    await row.getByRole("button", { name: /Remove from list/ }).click();
    await page.waitForSelector(".pk-undo");
    await page.screenshot({ path: file(`undo-${label}`) });
    await page.getByRole("button", { name: "Undo" }).click();
    // need to buy states
    await buy(page, "bowl");
    await page.locator('[data-shopping="bowl"]').scrollIntoViewIfNeeded();
    await page.locator('[data-item="bowl"]').screenshot({ path: file(`buy-1-products-${label}`) });
    await buy(page, "water");
    await page.locator('[data-item="water"]').screenshot({ path: file(`buy-2-category-${label}`) });
    await buy(page, "treats");
    await page.locator('[data-item="treats"]').screenshot({ path: file(`buy-3-none-${label}`) });
    // extras
    await page.locator(".pk-extras").scrollIntoViewIfNeeded();
    await page.locator(".pk-extras").screenshot({ path: file(`extras-${label}`) });
    await page.locator("#pick-up").scrollIntoViewIfNeeded();
    await page.locator("#pick-up").screenshot({ path: file(`pickup-${label}`) });
    // Gear handoff, then Back
    await page
      .locator(".pk-extras")
      .getByRole("link", { name: "Explore more travel gear" })
      .scrollIntoViewIfNeeded();
    await page
      .locator(".pk-extras")
      .getByRole("link", { name: "Explore more travel gear" })
      .click();
    await page.waitForURL(/\/gear\?trip=cabin-stay/);
    await page.waitForSelector("#trip-collection");
    await page.waitForTimeout(2500);
    out.notes.push(`${label}: gear url ${page.url()}`);
    await page.screenshot({ path: file(`gear-collection-${label}`) });
    await page.goBack();
    await page.waitForSelector('[data-hydrated="true"]');
    await page.waitForSelector("#pk-summary-h");
    out.notes.push(
      `${label}: after Back, bowl need-to-buy checked = ${await page
        .locator('[data-item="bowl"]')
        .getByRole("checkbox", { name: /Need to buy/ })
        .isChecked()}`,
    );
    await ctx.close();
  }

  // overflow at seven widths on the built list with everything open
  for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await build(page, { trip: "Road trip", days: 5, dogs: 2, conds: ["Older dog", "Hiking"] });
    for (const id of ["bowl", "water", "treats", "bed"]) await buy(page, id);
    await page
      .locator('[data-item="bowl"]')
      .getByRole("button", { name: "Why bring this?" })
      .click();
    await page
      .locator('[data-item="throw"], [data-item="leash"]')
      .first()
      .getByRole("button", { name: /Remove from list/ })
      .click();
    const more = page.getByRole("button", { name: "See more packing ideas" });
    if (await more.count()) await more.click();
    const r = await page.evaluate(() => {
      const bad = [...document.querySelectorAll(".pk-root *")]
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest("[hidden]"))
        .slice(0, 3)
        .map((e) => e.className || e.tagName);
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, bad };
    });
    out.overflow[w] = r.sw <= r.iw ? "ok" : `OVERFLOW ${r.sw}>${r.iw} ${r.bad}`;
    await ctx.close();
  }

  // Journey 1: 3-day 2-dog cabin list, add an optional item, mark Need to buy, open a product link, return.
  {
    const ctx = await browser.newContext(desktop);
    const page = await ctx.newPage();
    await build(page, { days: 3, dogs: 2 });
    await page
      .locator('[data-item="bowl"]')
      .getByRole("checkbox", { name: /Packed/ })
      .check();
    await page
      .locator(".pk-extras")
      .getByRole("button", { name: /^Add to my list: Pet gate/ })
      .click();
    out.journey1.extraAdded = (await page.locator('[data-item="pet-gate"]').count()) === 1;
    out.journey1.extraNotBuy = !(await page
      .locator('[data-item="pet-gate"]')
      .getByRole("checkbox", { name: /Need to buy/ })
      .isChecked());
    await buy(page, "bed");
    const link = page.locator('[data-item="bed"] a.gearcard-cta').first();
    out.journey1.link = await link.evaluate((a) => ({
      href: a.href,
      rel: a.rel,
      target: a.target,
      text: a.textContent.trim(),
    }));
    out.journey1.progress = await page.textContent('[data-testid="pk-progress-text"]');
    // do not follow the external site: reload (as after Back) and check nothing was lost
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector('[data-hydrated="true"]');
    out.journey1.afterReturn = {
      progress: await page.textContent('[data-testid="pk-progress-text"]'),
      bowlPacked: await page
        .locator('[data-item="bowl"]')
        .getByRole("checkbox", { name: /Packed/ })
        .isChecked(),
      bedBuy: await page
        .locator('[data-item="bed"]')
        .getByRole("checkbox", { name: /Need to buy/ })
        .isChecked(),
      gate: (await page.locator('[data-item="pet-gate"]').count()) === 1,
    };
    await ctx.close();
  }
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
