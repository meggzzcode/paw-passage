import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { guideSchema, stayYamlSchema, affiliatesSchema, settingsSchema } from "../content/schema";

// The Pages CMS form (.pages.yml) must offer every field the website's content rules know about,
// and every drop-down must offer exactly the allowed choices. Otherwise an edit in the CMS could
// silently drop data or fail the build.
type Field = { name: string; type?: string; list?: boolean; fields?: Field[]; options?: { values?: (string | { value: string })[] } };
const cfg = parse(readFileSync(".pages.yml", "utf8")) as { content: { name: string; fields: Field[] }[]; settings: { content: { merge: boolean } } };
const entry = (n: string) => cfg.content.find((c) => c.name === n)!;
const names = (fs: Field[]) => fs.map((f) => f.name).sort();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrap = (s: any): any => {
  let cur = s;
  for (let i = 0; i < 8; i++) {
    const d = cur?._def ?? cur?.def;
    const next = d?.innerType ?? d?.schema ?? d?.in ?? d?.out;
    if (!next || next === cur) break;
    cur = next;
  }
  return cur;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeKeys = (o: any) => Object.keys(unwrap(o).shape).sort();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const elementOf = (s: any) => unwrap(unwrap(s).element ?? unwrap(s)._def?.element ?? unwrap(s).def?.element);
const values = (f: Field) => (f.options?.values ?? []).map((v) => (typeof v === "string" ? v : v.value)).filter((v) => v !== "").sort();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enumValues = (s: any): string[] => [...(unwrap(s).options ?? Object.values(unwrap(s).enum ?? {}))].sort();

describe("Pages CMS form matches the content rules", () => {
  it("keeps settings that are not on the form instead of deleting them", () => {
    expect(cfg.settings.content.merge).toBe(true);
  });

  it("articles: the form has every field the rules accept (plus the text body)", () => {
    expect(names(entry("guides").fields)).toEqual([...shapeKeys(guideSchema), "body"].sort());
    const f = (n: string) => entry("guides").fields.find((x) => x.name === n)!;
    expect(names(f("faqs").fields!)).toEqual(shapeKeys(elementOf(unwrap(guideSchema).shape.faqs)));
    expect(names(f("sources").fields!)).toEqual(shapeKeys(elementOf(unwrap(guideSchema).shape.sources)));
    expect(names(f("research").fields!)).toEqual(shapeKeys(unwrap(guideSchema).shape.research));
    expect(names(f("gear").fields!)).toEqual(shapeKeys(elementOf(unwrap(guideSchema).shape.gear)));
    const comp = f("research").fields!.find((x) => x.name === "competitors")!;
    expect(names(comp.fields!)).toEqual(shapeKeys(elementOf(unwrap(unwrap(guideSchema).shape.research).shape.competitors)));
  });

  it("articles: drop-down choices equal the allowed values", () => {
    const f = (n: string) => entry("guides").fields.find((x) => x.name === n)!;
    const sh = unwrap(guideSchema).shape;
    expect(values(f("status"))).toEqual(enumValues(sh.status));
    expect(values(f("category"))).toEqual(enumValues(sh.category));
    expect(values(f("relatedTools"))).toEqual(enumValues(elementOf(sh.relatedTools)));
    expect(values(f("states"))).toEqual(enumValues(elementOf(sh.states)));
  });

  it("stays: the form has every field the rules accept, with matching choices", () => {
    const sh = unwrap(stayYamlSchema).shape;
    expect(names(entry("stays").fields)).toEqual(shapeKeys(stayYamlSchema));
    const f = (n: string) => entry("stays").fields.find((x) => x.name === n)!;
    for (const k of ["status", "type", "state", "fencedYard", "petFee", "petFeeBasis", "largeDogsOk", "privateOutdoor", "breedRestrictions", "hotTub"]) {
      expect(values(f(k)), `stay field ${k}`).toEqual(enumValues(sh[k]));
    }
  });

  it("affiliate links and business settings forms match the rules", () => {
    const links = entry("affiliates").fields.find((x) => x.name === "links")!;
    expect(names(links.fields!)).toEqual(shapeKeys(elementOf(unwrap(affiliatesSchema).shape.links)));
    expect(names(entry("settings").fields)).toEqual(shapeKeys(settingsSchema));
  });

  it("every built-in photo offered in the form really exists", async () => {
    const { images } = await import("../lib/images");
    const f = entry("guides").fields.find((x) => x.name === "heroImage")!;
    for (const v of values(f)) expect(Object.keys(images), v).toContain(v);
    const s = entry("stays").fields.find((x) => x.name === "image")!;
    for (const v of values(s)) expect(Object.keys(images), v).toContain(v);
  });
});
