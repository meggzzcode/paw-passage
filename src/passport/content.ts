// Loads the public Adventure Passport content (content/adventures, collections, stamps, achievements) at build time.
// Files are read as text by Vite and checked here, so a bad edit fails the build with a message naming the file.
// Premium adventures are never loaded from the repo: only free, published ones live here.
import { z } from "zod";
import { parse as parseYaml } from "yaml";
import { adventureSchema, validateLibrary, type Adventure } from "./schema";

const slug = z.string().regex(/^[a-z0-9-]+$/);
const nonEmpty = z.string().trim().min(1);

export const ACCENTS = ["ink", "poppy", "ochre", "sage", "sky", "plum"] as const;

export const collectionSchema = z.object({
  slug,
  title: nonEmpty.max(60),
  tagline: nonEmpty.max(100),
  description: nonEmpty.max(300),
  order: z.number().int().min(1),
  accent: z.enum(ACCENTS),
  premiumOnly: z.boolean(),
});
export const stampSchema = z.object({
  slug,
  title: nonEmpty.max(40),
  blurb: nonEmpty.max(100),
  rule: nonEmpty.max(200),
});
export const achievementSchema = z
  .object({
    threshold: z.number().int().min(1).optional(),
    kind: z.enum(["count", "collection-complete"]).default("count"),
    title: nonEmpty.max(60),
    reward: nonEmpty.max(200),
  })
  .refine((a) => (a.kind === "count") === (a.threshold !== undefined), {
    message: "a count milestone needs a threshold and a collection-complete one must not have one",
  });

export type Collection = z.infer<typeof collectionSchema>;
export type Stamp = z.infer<typeof stampSchema>;
export type Achievement = z.infer<typeof achievementSchema>;

class PassportContentError extends Error {}

function issues(file: string, error: z.ZodError): never {
  const lines = error.issues.map(
    (i) => `  - ${i.path.map(String).join(" > ") || "(file)"}: ${i.message}`,
  );
  throw new PassportContentError(`Content problem in ${file}:\n${lines.join("\n")}`);
}

function parseFile(file: string, raw: string): unknown {
  try {
    return parseYaml(raw);
  } catch (e) {
    throw new PassportContentError(`Content problem in ${file}: ${(e as Error).message}`);
  }
}

function parseList<T>(file: string, raw: string, key: string, schema: z.ZodType<T>): T[] {
  const doc = parseFile(file, raw) as Record<string, unknown> | null;
  const r = z.array(schema).safeParse(doc?.[key]);
  if (!r.success) return issues(file, r.error);
  return r.data;
}

const adventureFiles = import.meta.glob("../../content/adventures/*.yml", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
import collectionsRaw from "../../content/collections.yml?raw";
import stampsRaw from "../../content/stamps.yml?raw";
import achievementsRaw from "../../content/achievements.yml?raw";

export const collections: Collection[] = parseList(
  "content/collections.yml",
  collectionsRaw,
  "collections",
  collectionSchema,
).sort((a, b) => a.order - b.order);
export const stamps: Stamp[] = parseList("content/stamps.yml", stampsRaw, "stamps", stampSchema);
export const achievements: Achievement[] = parseList(
  "content/achievements.yml",
  achievementsRaw,
  "achievements",
  achievementSchema,
);

function loadAdventures(): Adventure[] {
  const out: Adventure[] = [];
  for (const [path, raw] of Object.entries(adventureFiles)) {
    const file = path.replace(/^(\.\.\/)+/, "");
    const doc = parseFile(file, raw);
    if ((doc as { schema?: unknown } | null)?.schema !== 2)
      throw new PassportContentError(
        `Content problem in ${file}: this adventure must say "schema: 2" and use the version 2 fields (see docs/CONTENT-GUIDE.md)`,
      );
    const r = adventureSchema.safeParse(doc);
    if (!r.success) issues(file, r.error);
    else {
      const a = r.data;
      const expected = file.replace(/^content\/adventures\//, "").replace(/\.yml$/, "");
      if (a.id !== expected)
        throw new PassportContentError(
          `Content problem in ${file}: the file name must equal the adventure id "${a.id}"`,
        );
      if (a.access !== "free")
        throw new PassportContentError(
          `Content problem in ${file}: only free adventures may live in the public repo`,
        );
      out.push(a);
    }
  }
  return out.filter((a) => a.status === "published").sort((a, b) => a.id.localeCompare(b.id));
}

export const adventures: Adventure[] = loadAdventures();

const libraryErrors = validateLibrary(
  adventures,
  collections.map((c) => c.slug),
  stamps.map((s) => s.slug),
);
if (libraryErrors.length > 0)
  throw new PassportContentError(
    `Content problem in content/adventures: ${libraryErrors.join("; ")}`,
  );

/** The public library: free, published adventures only. */
export function freeLibrary(): Adventure[] {
  return adventures;
}
