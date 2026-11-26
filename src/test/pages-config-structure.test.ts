import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { parse, parseDocument } from "yaml";
import { productRecordObject } from "../content/products-schema";

// Structural checks for the Pages CMS configuration that do not depend on the packing planner internals (those are in pages-config.test.ts).
const text = readFileSync(".pages.yml", "utf8");
type Field = { name: string; type?: string; fields?: Field[]; list?: boolean };
type Entry = { name: string; type: string; path: string; format?: string; fields: Field[] };
const cfg = parse(text) as { content: Entry[]; media?: { input: string } };

describe(".pages.yml structure", () => {
  it("is valid YAML with no errors or warnings", () => {
    const doc = parseDocument(text);
    expect(doc.errors.map(String)).toEqual([]);
    expect(doc.warnings.map(String)).toEqual([]);
  });

  it("uses no YAML anchors, aliases or merge keys (Pages CMS is not documented to support them)", () => {
    const code = text
      .split("\n")
      .filter((l) => !l.trim().startsWith("#"))
      .join("\n")
      // ignore anything inside quoted strings
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
      .replace(/'(?:[^'\n]|'')*'/g, "''");
    expect(code).not.toMatch(/(^|[\s:,[{-])&[A-Za-z_]/);
    expect(code).not.toMatch(/(^|[\s:,[{-])\*[A-Za-z_]/);
    expect(code).not.toMatch(/<<\s*:/);
  });

  it("every collection and file points at something that exists, and names are unique", () => {
    const names = cfg.content.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
    for (const c of cfg.content) {
      expect(existsSync(c.path), `${c.name}: ${c.path}`).toBe(true);
      expect(statSync(c.path).isDirectory(), c.name).toBe(c.type === "collection");
      expect(["collection", "file"]).toContain(c.type);
    }
    const have = cfg.content.map((c) => c.name);
    expect(have).toEqual(
      expect.arrayContaining(["affiliates", "guides", "packing", "products", "settings"]),
    );
    for (const retired of ["stays", "places", "towns", "destinations", "policies"])
      expect(have, retired).not.toContain(retired);
  });

  it("field names are unique inside each form level", () => {
    const walk = (fs: Field[], where: string) => {
      const n = fs.map((f) => f.name);
      expect(new Set(n).size, `${where}: ${n.join(",")}`).toBe(n.length);
      for (const f of fs) if (f.fields) walk(f.fields, `${where}.${f.name}`);
    };
    for (const c of cfg.content) walk(c.fields, c.name);
  });

  it("uploads go to a folder the site serves", () => {
    expect(cfg.media?.input).toBe("public/uploads");
  });

  it("the products form matches the product rules", () => {
    const products = cfg.content.find((c) => c.name === "products")!;
    const list = products.fields.find((f) => f.name === "products")!;
    expect(list.fields!.map((f) => f.name).sort()).toEqual(
      Object.keys(productRecordObject.shape).sort(),
    );
  });
});

describe("content files the form edits are valid against the form's schemas", () => {
  it("settings.yml, affiliates.yml and products.yml parse with their site schemas", async () => {
    const { settingsSchema, affiliatesSchema } = await import("../content/schema");
    const { productsSchema } = await import("../content/products-schema");
    expect(
      settingsSchema.safeParse(parse(readFileSync("content/settings.yml", "utf8"))).success,
    ).toBe(true);
    expect(
      affiliatesSchema.safeParse(parse(readFileSync("content/affiliates.yml", "utf8"))).success,
    ).toBe(true);
    expect(
      productsSchema.safeParse(parse(readFileSync("content/products.yml", "utf8"))).success,
    ).toBe(true);
  });
});
