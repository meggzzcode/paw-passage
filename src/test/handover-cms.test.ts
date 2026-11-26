import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import * as S from "@/passport/schema";
import { ACCENTS, collectionSchema, stampSchema, achievementSchema } from "@/passport/content";

// The Pages CMS forms (.pages.yml) must offer every field of the CURRENT adventure schema, mark every required field as
// required and offer exactly the schema's choices. A schema change that is not mirrored in the CMS fails here, so the
// CMS cannot drift silently. The premium form (content/premium; OFF, because that folder is git-ignored and untracked) is checked against the same rules.
type Field = {
  name: string;
  type?: string;
  list?: boolean;
  required?: boolean;
  fields?: Field[];
  options?: { values?: (string | { value: string })[] };
};
type Entry = { name: string; path: string; format?: string; filename?: string; fields: Field[] };
const text = readFileSync(".pages.yml", "utf8");
const cfg = parse(text) as { content: Entry[] };
const entry = (n: string) => cfg.content.find((c) => c.name === n)!;
const names = (fs: Field[]) => fs.map((f) => f.name).sort();
const values = (f: Field) =>
  (f.options?.values ?? []).map((v) => (typeof v === "string" ? v : v.value)).sort();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Z = any;
const unwrap = (s: Z): Z => {
  let cur = s;
  for (let i = 0; i < 8; i++) {
    const d = cur?._def ?? cur?.def;
    const next = d?.innerType ?? d?.schema ?? d?.in ?? d?.out;
    if (!next || next === cur) break;
    cur = next;
  }
  return cur;
};
const shape = (s: Z): Record<string, Z> => unwrap(s).shape;
const element = (s: Z): Z => unwrap(unwrap(s).element ?? unwrap(s)._def?.element);
const enumValues = (s: Z): string[] | null => {
  const u = unwrap(s);
  const el = u?.element ? unwrap(u.element) : u;
  const opts = el?.options ?? (el?.enum ? Object.values(el.enum) : null);
  return opts ? ([...opts] as string[]).sort() : null;
};
const isOptional = (s: Z): boolean => s.safeParse(undefined).success;

const adventureShape = shape(S.adventureSchema);

// Pull the commented-out/enabled premium block out as live YAML for the same checks (the block is now enabled, so this
// is simply the parsed entry; the fallback keeps the test meaningful if someone comments it out again).
// The premium form sits behind a switch (PREMIUM-CMS-SWITCH:BEGIN/END in .pages.yml). OFF is the recommended state (the public
// repository must not need to hold the premium library); either way the block, once uncommented, must still match the schema.
const SWITCH_RE = /^ *# PREMIUM-CMS-SWITCH:BEGIN\n([\s\S]*?)\n {2}# PREMIUM-CMS-SWITCH:END/m;
const switchBlock = SWITCH_RE.exec(text)?.[1];
const premiumLive = cfg.content.some((c) => c.name === "premium-adventures");
const premiumEntry: Entry = premiumLive
  ? entry("premium-adventures")
  : (
      parse(
        (switchBlock ?? "")
          .split("\n")
          .map((l) => l.replace(/^\s*# ?/, ""))
          .join("\n"),
      ) as Entry[]
    )[0]!;

// Inside an OPTIONAL object (review) inner fields stay un-required in the form, so an editor can leave the whole object empty.
function checkForm(
  fields: Field[],
  zshape: Record<string, Z>,
  where: string,
  parentOptional = false,
) {
  expect(names(fields), `${where}: form fields vs schema fields`).toEqual(
    Object.keys(zshape).sort(),
  );
  for (const f of fields) {
    const z = zshape[f.name]!;
    if (!isOptional(z) && !parentOptional)
      expect(f.required, `${where}.${f.name} must be required`).toBe(true);
    const ev = enumValues(z);
    if (ev && f.options?.values && f.name !== "access" && f.name !== "status")
      expect(values(f), `${where}.${f.name} options`).toEqual(ev);
    if (ev) expect(f.type, `${where}.${f.name} is a select`).toBe("select");
    const u = unwrap(z);
    const isList = !!u.element;
    expect(!!f.list, `${where}.${f.name} list flag`).toBe(isList);
    if (f.type === "object") {
      const inner = isList ? shape(element(z)) : shape(z);
      checkForm(f.fields!, inner, `${where}.${f.name}`, parentOptional || isOptional(z));
    }
  }
}

describe("Pages CMS adventure forms match src/passport/schema.ts", () => {
  it("free adventures form has every schema field, required flags and enum options", () => {
    const e = entry("adventures");
    expect(e.path).toBe("content/adventures");
    checkForm(e.fields, adventureShape, "adventures");
  });

  it("includes the v2 fields the old form lacked", () => {
    const n = names(entry("adventures").fields);
    for (const k of [
      "role",
      "teaser",
      "previewTitle",
      "showcase",
      "household",
      "keepsake",
      "review",
      "collections",
      "stamps",
      "achievements",
      "reveal",
      "objective",
      "completion",
      "homes",
      "space",
      "places",
      "transport",
    ])
      expect(n).toContain(k);
    // fields that are NOT in the schema must not come back
    for (const k of ["description", "environments", "mobilityFriendly"]) expect(n).not.toContain(k);
    const keepsake = entry("adventures").fields.find((f) => f.name === "keepsake")!;
    expect(names(keepsake.fields!)).toContain("explainer");
  });

  it("enum options equal the exported schema constants", () => {
    const get = (n: string) => entry("adventures").fields.find((f) => f.name === n)!;
    const eq = (n: string, arr: readonly string[]) =>
      expect(values(get(n)), n).toEqual([...arr].sort());
    eq("activityTypes", S.ACTIVITY_TYPES);
    eq("lifeStages", S.LIFE_STAGES);
    eq("sizes", S.SIZES);
    eq("setting", S.SETTINGS);
    eq("energy", S.ENERGY);
    eq("crowd", S.CROWD);
    eq("noise", S.NOISE);
    eq("seasons", S.SEASONS);
    eq("homes", S.HOMES);
    eq("places", S.PLACES);
    eq("space", S.SPACE);
    eq("transport", S.TRANSPORT);
    eq("dogMobility", S.DOG_MOBILITY);
    eq("ownerMobility", S.OWNER_MOBILITY);
    eq("water", S.WATER);
    eq("avoidWeather", S.AVOID_WEATHER);
    eq("requires", S.SUPPLY_KEYS);
    eq("role", S.ADVENTURE_ROLES);
    const k = get("keepsake").fields!.find((f) => f.name === "family")!;
    expect(values(k)).toEqual([...S.KEEPSAKE_FAMILIES].sort());
  });

  it("the public free form offers only access=free; the premium form only premium", () => {
    const acc = (e: Entry) => values(e.fields.find((f) => f.name === "access")!);
    expect(acc(entry("adventures"))).toEqual(["free"]);
    expect(acc(premiumEntry)).toEqual(["premium"]);
  });

  it("premium form is the same shape in content/premium, one JSON file per adventure", () => {
    expect(premiumEntry.path).toBe("content/premium");
    expect(premiumEntry.format).toBe("json");
    expect(premiumEntry.filename).toBe("{fields.id}.json");
    checkForm(premiumEntry.fields, adventureShape, "premium-adventures");
  });

  it("collections, stamps and achievements forms match their content rules", () => {
    const col = shape(collectionSchema);
    const cf = entry("collections").fields[0]!;
    expect(names(cf.fields!)).toEqual(Object.keys(col).sort());
    expect(values(cf.fields!.find((f) => f.name === "accent")!)).toEqual([...ACCENTS].sort());
    expect(names(entry("stamps").fields[0]!.fields!)).toEqual(
      Object.keys(shape(stampSchema)).sort(),
    );
    expect(names(entry("achievements").fields[0]!.fields!)).toEqual(
      Object.keys(shape(achievementSchema)).sort(),
    );
  });

  it("business settings (the only content-managed site text) are editable", () => {
    expect(entry("settings").path).toBe("content/settings.yml");
  });

  it("no premium file is editable anywhere except the dedicated content/premium form", () => {
    for (const c of cfg.content)
      if (c.name !== "premium-adventures") expect(c.path, c.name).not.toMatch(/premium/);
    // the public free form's own description tells editors premium is elsewhere
    expect(text).toMatch(/content\/premium/);
  });
});

describe("premium CMS switch and access locks", () => {
  it("has exactly one switch block and the recommended state is OFF (premium form not live)", () => {
    expect(text.match(/^ *# PREMIUM-CMS-SWITCH:BEGIN$/gm)).toHaveLength(1);
    expect(text.match(/^ *# PREMIUM-CMS-SWITCH:END$/gm)).toHaveLength(1);
    expect(switchBlock, "switch block present").toBeTruthy();
    expect(text).toContain("RECOMMENDED STATE: OFF");
    expect(premiumLive, "premium-adventures is commented out (OFF)").toBe(false);
    expect(premiumEntry.path).toBe("content/premium");
  });

  it("the switch comments say premium text is not tracked and point at the historical-exposure record", () => {
    expect(text).toMatch(/NO LONGER TRACKED/);
    expect(text).toContain("HISTORICAL-EXPOSURE.md");
    expect(text).toContain("git-ignored");
  });

  it("the premium block (live or uncommented) is a premium-locked collection", () => {
    expect(premiumEntry.name).toBe("premium-adventures");
    const acc = premiumEntry.fields.find((f) => f.name === "access") as Field & {
      default?: string;
      readonly?: boolean;
    };
    expect(acc.default).toBe("premium");
    expect(acc.readonly).toBe(true);
  });

  it("the free form locks access to free (single option, default, read-only) and cannot create a premium file", () => {
    const acc = entry("adventures").fields.find((f) => f.name === "access") as Field & {
      default?: string;
      readonly?: boolean;
    };
    expect(values(acc)).toEqual(["free"]);
    expect(acc.default).toBe("free");
    expect(acc.readonly).toBe(true);
    expect(entry("adventures").path).toBe("content/adventures");
    expect(entry("adventures").format).toBe("yaml");
    expect(entry("adventures").filename).toBe("{fields.id}.yml");
  });

  it("the id field is required and described; the schema (enforced by the build) pins the id pattern", () => {
    const id = entry("adventures").fields.find((f) => f.name === "id") as Field & {
      description?: string;
    };
    expect(id.required).toBe(true);
    expect(id.description).toContain("adv-");
    // The CMS does not validate the pattern itself (UNVERIFIED that Pages CMS supports a pattern option); the build does.
    expect(S.adventureSchema.shape.id.safeParse("adv-k3m9x2").success).toBe(true);
    expect(S.adventureSchema.shape.id.safeParse("adv-K3M9X2").success).toBe(false);
    expect(S.adventureSchema.shape.id.safeParse("k3m9x2").success).toBe(false);
  });

  it("keeps Journal editing and names content/premium outside the switch only in comments or descriptions", () => {
    expect(entry("journal").path).toBe("content/journal");
    const outside = text.replace(new RegExp(SWITCH_RE.source, "m"), "");
    for (const line of outside.split("\n"))
      if (/content\/premium/.test(line))
        expect(line.trim().startsWith("#") || line.includes("description")).toBe(true);
  });
});
