#!/usr/bin/env node
// Reproducible library inventory. Read-only; no network. Needs Node 22.18+ (imports TypeScript sources directly).
//   node scripts/library-stats.mjs            JSON, then a markdown table
//   node scripts/library-stats.mjs --json     JSON only
//   node scripts/library-stats.mjs --md       markdown only
// Reads content/adventures/*.yml (free), content/premium/*.json (premium, tracked here by the owner decision), content/collections.yml,
// stamps.yml, achievements.yml and the keepsake theme registry (src/passport/keepsake/themes.ts).
// It prints ONLY aggregates and card ids: no premium title, teaser or instruction text ever reaches the output.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { register } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

// The theme files import siblings without extensions; let Node's TypeScript stripping resolve them.
register(
  "data:text/javascript," +
    encodeURIComponent(
      "export async function resolve(s,c,n){try{return await n(s,c)}catch(e){if(s.startsWith('.'))return n(s+'.ts',c);throw e}}",
    ),
);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { adventureSchema } = await import(join(root, "src/passport/schema.ts"));
const { THEMES, THEME_REGISTRY } = await import(join(root, "src/passport/keepsake/themes.ts"));

const readYamlDir = (d) =>
  existsSync(d)
    ? readdirSync(d)
        .filter((f) => f.endsWith(".yml"))
        .sort()
        .map((f) => parseYaml(readFileSync(join(d, f), "utf8")))
    : [];
const readJsonDir = (d) =>
  existsSync(d)
    ? readdirSync(d)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .map((f) => JSON.parse(readFileSync(join(d, f), "utf8")))
    : [];

const rawFree = readYamlDir(join(root, "content/adventures"));
const rawPremium = readJsonDir(join(root, "content/premium"));
const invalid = [];
const byId = new Map();
const duplicates = [];
for (const raw of [...rawFree, ...rawPremium]) {
  const r = adventureSchema.safeParse(raw);
  if (!r.success) {
    invalid.push(raw?.id ?? "?");
    continue;
  }
  if (byId.has(r.data.id)) duplicates.push(r.data.id);
  else byId.set(r.data.id, r.data);
}
const all = [...byId.values()];
const pub = all.filter((a) => a.status === "published");
const draft = all.filter((a) => a.status === "draft");
const freePub = pub.filter((a) => a.access === "free");
const premPub = pub.filter((a) => a.access === "premium");
const showcase = premPub.filter((a) => a.showcase);

const collectionsDef = parseYaml(
  readFileSync(join(root, "content/collections.yml"), "utf8"),
).collections;
const stampsDef = parseYaml(readFileSync(join(root, "content/stamps.yml"), "utf8")).stamps;
const achDef = parseYaml(readFileSync(join(root, "content/achievements.yml"), "utf8")).achievements;
const collectionCounts = Object.fromEntries(collectionsDef.map((c) => [c.slug, 0]));
for (const a of pub)
  for (const c of a.collections) if (c in collectionCounts) collectionCounts[c]++;
const curatedCollections = Object.entries(collectionCounts).filter(([, n]) => n > 0);

// Keepsake: a card uses a registered theme when THEMES[theme] exists and belongs to the card's family.
const registered = (a) => THEMES[a.keepsake.theme]?.family === a.keepsake.family;
const pairs = new Set(pub.map((a) => `${a.keepsake.family}/${a.keepsake.theme}`));
const registeredPairs = [...pairs].filter((p) => {
  const [family, theme] = p.split("/");
  return THEMES[theme]?.family === family;
});

const tally = (items, keyFn) => {
  const out = {};
  for (const it of items) {
    const ks = [].concat(keyFn(it));
    for (const k of ks) out[k] = (out[k] ?? 0) + 1;
  }
  return out;
};
const bucket = (n, edges, labels) =>
  labels[edges.findIndex((e) => n <= e)] ?? labels[labels.length - 1];
const durationOf = (a) =>
  bucket(
    a.minutesMax,
    [10, 15, 30, 60],
    ["<=10 min", "<=15 min", "<=30 min", "<=60 min", ">60 min"],
  );
const budgetOf = (a) =>
  a.costMax === 0 ? "free" : a.costMax <= 10 ? "$1-10" : a.costMax <= 30 ? "$11-30" : "higher";

// Bonus experiences: this content model has NO bonus-resource role or collection (there is no "Base Camp" collection;
// that phrase only appears in card prose). By definition, a bonus experience is a non-adventure resource shipped beside
// the cards: browser-printed printables, curated itineraries and discovery shortcuts. They are counted from source, never
// added to any adventure count.
const count = (file, re) => (readFileSync(join(root, file), "utf8").match(re) ?? []).length;
const bonus = {
  printables: count("src/components/printables/data.ts", /^\s{4}slug: "/gm),
  itineraries: count("src/config/itineraries.ts", /^\s{4}slug: "/gm),
  shortcuts: count("src/passport/shortcuts.ts", /^\s{4}slug: "/gm),
};
bonus.total = bonus.printables + bonus.itineraries + bonus.shortcuts;

// Cards whose costMax is 0 but whose own text implies a purchase. A heuristic: it flags for human review, it never edits.
const BUY =
  /\b(buy|buying|bought|purchase|purchased|shopping|store-bought|grocery|groceries|ingredients?|rent|rental|admission|entry fee|cafe|caf\u00e9|restaurant|takeout|take-out|drive-thru)\b|\$\d/i;
// Soft signals: the card is free only if the household already has the item (dog treats, baking supplies, picnic gear).
const SOFT_KEYS = new Set(["treats", "bake-ingredients", "picnic-gear"]);
const freeCostFlags = pub
  .filter((a) => a.costMax === 0)
  .map((a) => {
    const strong = [];
    const soft = [];
    const hay = {
      supplies: a.supplies.join(" | "),
      dietNotes: a.dietNotes ?? "",
      instructions: a.instructions.join(" "),
    };
    for (const [k, v] of Object.entries(hay))
      if (v && BUY.test(v)) strong.push(`${k}: purchase wording`);
    if (a.reservation.needed) strong.push("reservation needed");
    if (a.transport === "car") soft.push("car trip (fuel)");
    for (const k of a.requires) if (SOFT_KEYS.has(k)) soft.push(`requires: ${k}`);
    return strong.length || soft.length ? { id: a.id, access: a.access, strong, soft } : null;
  })
  .filter(Boolean);

const stats = {
  generatedOn: new Date().toISOString().slice(0, 10),
  validation: { invalidCards: invalid, duplicateIds: duplicates },
  cards: {
    uniqueCore: all.length,
    published: pub.length,
    draft: draft.length,
    freeIntroPool: freePub.length,
    freeDraft: draft.filter((a) => a.access === "free").length,
    premiumPublished: premPub.length,
    premiumDraft: draft.filter((a) => a.access === "premium").length,
    publicPremiumPreviews: showcase.length,
    showcaseWithoutTeaser: showcase.filter((a) => !a.teaser).map((a) => a.id),
  },
  collections: {
    defined: collectionsDef.length,
    curatedWithPublishedCards: curatedCollections.length,
    premiumOnlyFlagged: collectionsDef.filter((c) => c.premiumOnly).length,
    cardsPerCollection: collectionCounts,
  },
  keepsake: {
    themesRegistered: Object.keys(THEMES).length,
    themesPerFamily: Object.fromEntries(
      Object.entries(THEME_REGISTRY).map(([f, t]) => [f, t.length]),
    ),
    cardsWithRegisteredTheme: pub.filter(registered).length,
    cardsWithUnregisteredTheme: pub.filter((a) => !registered(a)).map((a) => a.id),
    distinctFamilyThemePairsUsed: pairs.size,
    distinctRegisteredPairsUsed: registeredPairs.length,
    // "Adventure-specific configurations" = distinct registered family/theme pairs actually used by published cards.
    adventureSpecificConfigurations: registeredPairs.length,
  },
  rewards: { achievements: achDef.length, stamps: stampsDef.length },
  variations: {
    sumOfVariationArrays: pub.reduce((n, a) => n + a.variations.length, 0),
    cardsWithNoVariations: pub.filter((a) => a.variations.length === 0).length,
  },
  bonusExperiences: {
    definition:
      "Non-adventure resources beside the cards: printables + itineraries + discovery shortcuts (no bonus role or collection exists in the card schema)",
    ...bonus,
  },
  distributions: {
    scope: "published cards (free + premium)",
    dogEnergy: tally(pub, (a) => a.energy),
    ownerEffort: tally(pub, (a) => a.ownerMobility),
    activityTypes: tally(pub, (a) => a.activityTypes),
    activityTypePrimary: tally(pub, (a) => a.activityTypes[0]),
    duration: tally(pub, durationOf),
    budget: tally(pub, budgetOf),
    setting: tally(pub, (a) => a.setting),
    lifeStage: tally(pub, (a) => a.lifeStages),
    role: tally(pub, (a) => a.role),
    family: pub.filter((a) => a.household.includes("family")).length,
    twoDogHousehold: pub.filter((a) => a.household.includes("two-dogs")).length,
    limitedMobilityDog: pub.filter((a) => a.dogMobility === "low").length,
    apartmentFriendly: pub.filter((a) => a.homes.includes("apartment")).length,
    noCar: pub.filter((a) => a.transport === "walkable" || a.transport === "none").length,
    noAdditionalSpending: pub.filter((a) => a.costMax === 0).length,
    noAdditionalSpendingFree: freePub.filter((a) => a.costMax === 0).length,
    noAdditionalSpendingPremium: premPub.filter((a) => a.costMax === 0).length,
  },
  showcase: {
    count: showcase.length,
    role: tally(showcase, (a) => a.role),
    energy: tally(showcase, (a) => a.energy),
    setting: tally(showcase, (a) => a.setting),
    primaryActivity: tally(showcase, (a) => a.activityTypes[0]),
    family: showcase.filter((a) => a.household.includes("family")).length,
    local: showcase.filter((a) => a.transport !== "car").length,
    noAdditionalSpending: showcase.filter((a) => a.costMax === 0).length,
    lifeStage: tally(showcase, (a) => a.lifeStages),
    seasonal: showcase.filter((a) => a.seasons.length > 0).length,
    celebrations: showcase.filter(
      (a) =>
        a.activityTypes.includes("celebrations") ||
        a.collections.some((c) => /holiday|birthday|celebration/.test(c)),
    ).length,
  },
  noSpendCheck: {
    costMaxZeroCards: pub.filter((a) => a.costMax === 0).length,
    strongPurchaseSignals: freeCostFlags.filter((f) => f.strong.length),
    softSignalCount: freeCostFlags.filter((f) => !f.strong.length && f.soft.length).length,
    softSignals: freeCostFlags
      .filter((f) => !f.strong.length && f.soft.length)
      .map((f) => ({ id: f.id, soft: f.soft })),
  },
};

const row = (k, v) => `| ${k} | ${v} |`;
const obj = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
const md = [
  `Library inventory (generated ${stats.generatedOn})`,
  "",
  "| Measure | Value |",
  "| --- | --- |",
  row("Unique core adventures", stats.cards.uniqueCore),
  row("Published / draft", `${stats.cards.published} / ${stats.cards.draft}`),
  row("Free intro pool (published free)", stats.cards.freeIntroPool),
  row("Premium published", stats.cards.premiumPublished),
  row("Public premium previews (showcase)", stats.cards.publicPremiumPreviews),
  row(
    "Curated collections (with published cards / defined)",
    `${stats.collections.curatedWithPublishedCards} / ${stats.collections.defined}`,
  ),
  row("Keepsake themes registered", stats.keepsake.themesRegistered),
  row(
    "Adventure-specific keepsake configurations (distinct registered family/theme pairs used)",
    stats.keepsake.adventureSpecificConfigurations,
  ),
  row(
    "Cards with a registered keepsake theme",
    `${stats.keepsake.cardsWithRegisteredTheme} / ${stats.cards.published}`,
  ),
  row("Achievements", stats.rewards.achievements),
  row("Stamps", stats.rewards.stamps),
  row("Variations (sum of arrays)", stats.variations.sumOfVariationArrays),
  row(
    "Bonus experiences (printables + itineraries + shortcuts)",
    `${stats.bonusExperiences.total} (${stats.bonusExperiences.printables} + ${stats.bonusExperiences.itineraries} + ${stats.bonusExperiences.shortcuts})`,
  ),
  row(
    "No additional spending (costMax 0)",
    `${stats.distributions.noAdditionalSpending} (${stats.distributions.noAdditionalSpendingFree} free + ${stats.distributions.noAdditionalSpendingPremium} premium)`,
  ),
  "",
  "| Distribution (published cards) | Counts |",
  "| --- | --- |",
  ...Object.entries(stats.distributions)
    .filter(([k]) => k !== "scope")
    .map(([k, v]) => row(k, typeof v === "object" ? obj(v) : v)),
  "",
  "| Showcase composition | Counts |",
  "| --- | --- |",
  ...Object.entries(stats.showcase).map(([k, v]) => row(k, typeof v === "object" ? obj(v) : v)),
].join("\n");

const arg = process.argv[2];
if (arg !== "--md") console.log(JSON.stringify(stats, null, 2));
if (arg !== "--json") console.log((arg === "--md" ? "" : "\n") + md);
