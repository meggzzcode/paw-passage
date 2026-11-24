// What content/packing.yml must look like, and the cross-checks that keep the packing planner honest.
// Pure (no "@/" imports) because the build tool (plugins/content.ts) loads this file too.
// Nothing here stores a price, a rating or an affiliate link: a recommendation names a product id from
// content/products.yml, and the link comes from content/affiliates.yml at render time.
import { z } from "zod";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase letters, numbers and hyphens");
const text = z.string().trim().min(1, "must not be empty");
/** Optional text. A blank value (a CMS field left empty) counts as "not filled in". */
const optText = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().min(1).optional(),
);

export const tripIcons = ["house", "car", "waves", "tent", "compass"] as const;
export const appearsValues = ["essential", "conditional", "optional"] as const;
export const quantityStrategies = [
  "none",
  "fixed",
  "perDog",
  "perDay",
  "perDogPerDay",
  "dogDays",
  "meals",
  "text",
] as const;
export type QuantityStrategy = (typeof quantityStrategies)[number];

const tripTypeSchema = z
  .object({
    id: slug,
    label: text,
    /** Short lowercase name used in sentences ("cabin", "road trip"). */
    short: text,
    /** Heading of the generated list, e.g. "Your cabin getaway packing list". */
    listTitle: text,
    hint: optText,
    icon: z.enum(tripIcons),
    /** Conditions this trip type always includes (a road trip is a driving trip). */
    implies: z.array(slug).default([]),
  })
  .strict();

const conditionSchema = z.object({ id: slug, label: text, hint: optText }).strict();

const categorySchema = z
  .object({ id: slug, label: text, order: z.number().int().min(0).max(1000) })
  .strict();

const whenSchema = z
  .object({
    tripTypes: z.array(slug).optional(),
    anyConditions: z.array(slug).optional(),
    allConditions: z.array(slug).optional(),
    unlessConditions: z.array(slug).optional(),
    minDays: z.number().int().min(1).max(30).optional(),
    maxDays: z.number().int().min(1).max(30).optional(),
  })
  .strict();

const quantitySchema = z
  .object({
    strategy: z.enum(quantityStrategies).default("none"),
    count: z.number().positive().max(200).optional(),
    /** Singular unit; "bed" becomes "2 beds". */
    unit: optText,
    /** Floor for strategies that scale with days. */
    min: z.number().positive().max(500).optional(),
    max: z.number().positive().max(500).optional(),
    text: optText,
    /** Short plain note appended to the quantity ("plus a spare"). */
    note: optText,
  })
  .strict();

const productEntrySchema = z
  .object({
    id: slug,
    /** Required for every entry after the first: how this option is meaningfully different. */
    because: optText,
    /** The one thing to check before buying. Written from the product record, never from "senior" or "large". */
    caution: text,
    /** Optional replacement for the product's own summary sentence. */
    benefit: optText,
    onlyConditions: z.array(slug).optional(),
    unlessConditions: z.array(slug).optional(),
  })
  .strict();

const itemSchema = z
  .object({
    id: slug,
    name: text,
    category: slug,
    active: z.boolean().default(true),
    order: z.number().int().min(0).max(1000).default(100),
    /** What is this for? One short sentence shown under the name. */
    what: text,
    /** Why this is included. Shown in the "Why this is included" disclosure. */
    why: text,
    tip: optText,
    appears: z.enum(appearsValues),
    when: whenSchema.default({}),
    quantity: quantitySchema.default({ strategy: "none" as const }),
    /** "travel bowl" gives "Need a travel bowl? Here are a couple of researched options to consider." */
    shopFor: optText,
    products: z.array(productEntrySchema).max(4).default([]),
  })
  .strict();

export const packingSchema = z
  .object({
    tripTypes: z.array(tripTypeSchema).min(1),
    conditions: z.array(conditionSchema).min(1),
    categories: z.array(categorySchema).min(1),
    items: z.array(itemSchema).default([]),
  })
  .strict();

export type PackingConfig = z.infer<typeof packingSchema>;
export type PackingItem = PackingConfig["items"][number];
export type PackingTripType = PackingConfig["tripTypes"][number];
export type PackingCondition = PackingConfig["conditions"][number];
export type PackingCategory = PackingConfig["categories"][number];
export type PackingWhen = PackingItem["when"];
export type PackingProductEntry = PackingItem["products"][number];

/** Used only when content/packing.yml is missing altogether (for example in a stripped-down test project). The planner then shows no suggestions. */
export const emptyPackingConfig: PackingConfig = {
  tripTypes: [
    {
      id: "other",
      label: "Other getaway",
      short: "getaway",
      listTitle: "Your getaway packing list",
      icon: "compass",
      implies: [],
    },
  ],
  conditions: [{ id: "driving", label: "We're driving" }],
  categories: [{ id: "general", label: "Packing list", order: 10 }],
  items: [],
};

/** Product facts the checker needs. Pass every record from content/products.yml. */
export interface ProductFacts {
  id: string;
  active: boolean;
}

/** Item ids that the planner itself uses for the visitor's own items. */
export const CUSTOM_ID_PREFIX = "custom-";

/**
 * Cross-checks the schema alone cannot do. Every message names the record and the field, so the owner knows
 * exactly what to fix. An empty list means the file is safe to publish.
 */
export function packingProblems(cfg: PackingConfig, products: ProductFacts[]): string[] {
  const out: string[] = [];
  const dup = (kind: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) out.push(`${kind} "${id}": the id is used more than once`);
      seen.add(id);
    }
  };
  dup(
    "trip type",
    cfg.tripTypes.map((t) => t.id),
  );
  dup(
    "condition",
    cfg.conditions.map((c) => c.id),
  );
  dup(
    "category",
    cfg.categories.map((c) => c.id),
  );
  dup(
    "item",
    cfg.items.map((i) => i.id),
  );

  const trips = new Set(cfg.tripTypes.map((t) => t.id));
  const conds = new Set(cfg.conditions.map((c) => c.id));
  const cats = new Set(cfg.categories.map((c) => c.id));
  const prods = new Map(products.map((p) => [p.id, p]));
  const list = (s: Set<string>) => [...s].join(", ");

  for (const t of cfg.tripTypes)
    for (const c of t.implies)
      if (!conds.has(c))
        out.push(
          `trip type "${t.id}": field "implies" names an unknown condition "${c}" (known: ${list(conds)})`,
        );

  for (const i of cfg.items) {
    const where = `item "${i.id}"`;
    if (i.id.startsWith(CUSTOM_ID_PREFIX))
      out.push(
        `${where}: field "id" may not start with "${CUSTOM_ID_PREFIX}" (reserved for visitors' own items)`,
      );
    if (!cats.has(i.category))
      out.push(
        `${where}: field "category" names an unknown category "${i.category}" (known: ${list(cats)})`,
      );

    const w = i.when;
    for (const t of w.tripTypes ?? [])
      if (!trips.has(t))
        out.push(
          `${where}: field "when.tripTypes" names an unknown trip type "${t}" (known: ${list(trips)})`,
        );
    for (const key of ["anyConditions", "allConditions", "unlessConditions"] as const)
      for (const c of w[key] ?? [])
        if (!conds.has(c))
          out.push(
            `${where}: field "when.${key}" names an unknown condition "${c}" (known: ${list(conds)})`,
          );

    const hasRule =
      (w.tripTypes?.length ?? 0) > 0 ||
      (w.anyConditions?.length ?? 0) > 0 ||
      (w.allConditions?.length ?? 0) > 0 ||
      w.minDays !== undefined ||
      w.maxDays !== undefined;
    if (w.tripTypes && w.tripTypes.length === 0)
      out.push(
        `${where}: field "when.tripTypes" is empty, so the item could never appear (remove it or name a trip type)`,
      );
    if (w.anyConditions && w.anyConditions.length === 0)
      out.push(
        `${where}: field "when.anyConditions" is empty, so the item could never appear (remove it or name a condition)`,
      );
    if (i.appears === "essential" && (hasRule || (w.unlessConditions?.length ?? 0) > 0))
      out.push(
        `${where}: an "essential" item always appears, so it cannot have a "when" rule (make it "conditional")`,
      );
    if (i.appears === "conditional" && !hasRule && (w.unlessConditions?.length ?? 0) === 0)
      out.push(
        `${where}: a "conditional" item needs a "when" rule, otherwise it would never appear`,
      );
    // Contradictions: a rule that can never be true.
    for (const c of w.allConditions ?? [])
      if ((w.unlessConditions ?? []).includes(c))
        out.push(
          `${where}: contradictory rule: condition "${c}" is in both "when.allConditions" and "when.unlessConditions"`,
        );
    if (
      (w.anyConditions?.length ?? 0) > 0 &&
      (w.anyConditions ?? []).every((c) => (w.unlessConditions ?? []).includes(c))
    )
      out.push(
        `${where}: contradictory rule: every condition in "when.anyConditions" is also in "when.unlessConditions"`,
      );
    if (w.minDays !== undefined && w.maxDays !== undefined && w.minDays > w.maxDays)
      out.push(
        `${where}: contradictory rule: "when.minDays" (${w.minDays}) is larger than "when.maxDays" (${w.maxDays})`,
      );

    // Quantity strategy configuration.
    const q = i.quantity;
    const need = (field: "count" | "unit" | "text") => {
      if (q[field] === undefined)
        out.push(
          `${where}: field "quantity.${field}" is required for the "${q.strategy}" strategy`,
        );
    };
    if (q.strategy === "fixed" || q.strategy === "perDog") {
      need("count");
      need("unit");
    }
    if (q.strategy === "perDay" || q.strategy === "perDogPerDay") {
      need("count");
      need("unit");
    }
    if (q.strategy === "dogDays" || q.strategy === "meals") need("unit");
    if (q.strategy === "text") need("text");
    if (q.strategy === "none" && (q.count !== undefined || q.text !== undefined))
      out.push(
        `${where}: field "quantity.strategy" is "none" but a count or text is set (pick a strategy or remove them)`,
      );
    if (q.min !== undefined && q.max !== undefined && q.min > q.max)
      out.push(
        `${where}: field "quantity.min" (${q.min}) is larger than "quantity.max" (${q.max})`,
      );

    // Product recommendations.
    const seen = new Set<string>();
    i.products.forEach((p, n) => {
      const pw = `${where}: field "products[${n}]" ("${p.id}")`;
      const rec = prods.get(p.id);
      if (!rec) out.push(`${pw}: no product with this id in content/products.yml`);
      else if (!rec.active)
        out.push(
          `${pw}: the product is inactive (active: false), so it cannot be recommended. Remove it here or reactivate the product`,
        );
      if (seen.has(p.id)) out.push(`${pw}: listed twice for the same item`);
      seen.add(p.id);
      if (n > 0 && !p.because)
        out.push(
          `${pw}: field "because" is required for a second option (say how it differs from the first)`,
        );
      for (const key of ["onlyConditions", "unlessConditions"] as const)
        for (const c of p[key] ?? [])
          if (!conds.has(c))
            out.push(
              `${pw}: field "${key}" names an unknown condition "${c}" (known: ${list(conds)})`,
            );
      for (const c of p.onlyConditions ?? [])
        if ((p.unlessConditions ?? []).includes(c))
          out.push(
            `${pw}: contradictory rule: condition "${c}" is in both "onlyConditions" and "unlessConditions"`,
          );
    });
    if (i.products.length > 0 && !i.shopFor)
      out.push(
        `${where}: field "shopFor" is required when products are listed (for example "travel bowl")`,
      );
  }
  return out;
}
