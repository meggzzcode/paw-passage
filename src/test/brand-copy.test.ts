// Approved brand copy (owner directive 2026-11-26): the strings are single-sourced in src/config/brand.ts, each page reads them,
// the library-size claim is tied to one constant that is checked against the verified library, and retired or risky lines stay out.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND, LIBRARY_CLAIM_MIN, LIBRARY_CLAIM_WORDS, SIGNATURE_PHRASES } from "@/config/brand";
import { flags, homePromo, ONE_TIME_LINE, KEEP_LINE } from "@/config/commercial";
import { site } from "@/config/site";

const read = (f: string) => readFileSync(f, "utf8");
const PREMIUM_DIR = process.env["PREMIUM_DIR"]?.trim() || "";
const HAS_PREMIUM = Boolean(PREMIUM_DIR) && existsSync(PREMIUM_DIR);

function sources(dirs: string[], re = /\.(tsx?|md|json|webmanifest|html)$/): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (re.test(n) && !/\.test\.tsx?$/.test(n)) out.push(p);
    }
  };
  for (const d of dirs) if (existsSync(d)) walk(d);
  return out;
}
const PUBLIC_SRC = () =>
  sources(["src/routes", "src/components", "src/config", "src/lib", "content/journal"]);

describe("approved brand copy", () => {
  it("pins the approved strings exactly", () => {
    expect(BRAND.hero.eyebrow).toBe("Because every dog deserves a little adventure.");
    expect(`${BRAND.hero.titleLead} ${BRAND.hero.titleEm} ${BRAND.hero.titleTail}`).toBe(
      "A passport full of little adventures for you and your dog.",
    );
    expect(BRAND.hero.support).toBe(
      "Discover 100+ fun, creative and memorable things to do together, personalized to your dog and your lifestyle.",
    );
    expect(BRAND.hero.primaryCta).toBe("Find our first adventure");
    expect(BRAND.hero.ctaNote).toBe("Your first adventure is free.");
    expect(ONE_TIME_LINE).toBe("One payment of $19.99. Yours to keep.");
    expect(BRAND.discoverHeadline).toBe("Adventures picked for your dog. Memories made by you.");
    expect(BRAND.unlockHeadline).toBe(
      "One passport. Over a hundred adventures. Endless little memories.",
    );
    expect(BRAND.keepsakeHeadline).toBe("Adventures for your dog. Keepsakes for you.");
    expect(BRAND.passportHeadline).toBe("Collect adventures, not just things.");
    expect(BRAND.ourStory).toBe("A lifetime of little adventures.");
    expect(BRAND.mysteryHeadline).toBe("A little adventure awaits...");
    expect(BRAND.journalHeadline).toBe("More than walks. More than fetch. More little adventures.");
    expect(BRAND.giftLine).toBe("Give a lifetime of little adventures.");
    expect([...SIGNATURE_PHRASES]).toEqual([
      "A lifetime of little adventures.",
      "Because every dog deserves a little adventure.",
      "Collect adventures, not just things.",
      "One payment. Yours to keep.",
    ]);
    expect(KEEP_LINE).toMatch(/^No subscription\. No renewals\./);
  });

  it("the home page and other pages read the one source", () => {
    expect(homePromo.eyebrow).toBe(BRAND.hero.eyebrow);
    expect(homePromo.lede).toBe(BRAND.hero.support);
    expect(read("src/routes/unlock.tsx")).toContain("BRAND.unlockHeadline");
    expect(read("src/routes/passport.tsx")).toContain("BRAND.passportHeadline");
    expect(read("src/routes/our-story.tsx")).toContain("BRAND.ourStory");
    expect(read("src/components/journal/JournalIndex.tsx")).toContain("BRAND.journalHeadline");
    expect(read("src/components/shell/SiteFooter.tsx")).toContain("BRAND.lifetime");
    expect(read("src/components/printables/PrintableSheet.tsx")).toContain("BRAND.lifetime");
    expect(read("src/routes/index.tsx")).toContain("BRAND.discoverHeadline");
    expect(read("src/routes/index.tsx")).toContain("BRAND.keepsakeHeadline");
    expect(read("src/routes/index.tsx")).toContain("BRAND.mysteryHeadline");
    expect(site.tagline).toContain(BRAND.lifetime.replace(".", "").toLowerCase());
    const manifest = JSON.parse(read("public/manifest.webmanifest")) as { description: string };
    expect(manifest.description.startsWith(BRAND.lifetime)).toBe(true);
  });

  it("gift copy exists only behind flags.gifting (which stays false until gifting is verified)", () => {
    expect(flags.gifting).toBe(false);
    const unlock = read("src/routes/unlock.tsx");
    const i = unlock.indexOf("BRAND.giftLine");
    expect(i).toBeGreaterThan(0);
    expect(unlock.lastIndexOf("flags.gifting", i)).toBeGreaterThan(0);
    for (const f of PUBLIC_SRC()) {
      if (f.endsWith("unlock.tsx") || f.endsWith("brand.ts")) continue;
      expect(read(f), f).not.toMatch(/give a lifetime of little adventures/i);
    }
  });

  it("the slogan 'Collect adventures, not just things.' is written only in brand.ts: the My Passport headline and the decorative home strip use it, never the hero", () => {
    const hits = sources(
      ["src", "public", "content"],
      /\.(tsx?|md|json|webmanifest|html|css|txt|ya?ml)$/,
    )
      .filter((f) => /collect\s+adventures,?\s+not\s+just\s+things/i.test(read(f)))
      .map((f) => f.replace(/\\/g, "/"));
    expect(hits).toEqual(["src/config/brand.ts"]);
    expect(read("src/routes/index.tsx")).not.toMatch(/passportHeadline|BRAND\.collect/);
    expect(read("src/routes/index.tsx")).toContain("BRAND.marquee");
    expect(BRAND.marquee).toContain("Collect adventures, not just things ✿");
    expect(read("src/config/commercial.ts")).not.toMatch(/BRAND\.collect|passportHeadline/);
  });

  it("retired lines and risky promises stay out of every customer-facing file", () => {
    const BANNED = [
      /life\s+is\s+better\s+with\s+a\s+little\s+adventure/i,
      /deserves\s+a\s+little\s+wonder/i,
      /free\s+forever|forever\s+free|free\s+for\s+life|completely\s+free/i,
      /unlimited\s+(updates|access|adventures)|perpetual|lifetime\s+(access|support|updates)/i,
      /updates\s+forever|access\s+forever|yours\s+forever/i,
    ];
    for (const f of PUBLIC_SRC()) {
      const t = read(f);
      for (const re of BANNED) expect(t, `${f} ${re}`).not.toMatch(re);
    }
  });
});

describe("library-size claim", () => {
  it("is one constant, mirrored in words and in the hero copy", () => {
    expect(LIBRARY_CLAIM_MIN).toBe(100);
    expect(LIBRARY_CLAIM_WORDS).toBe("Over a hundred");
    expect(BRAND.hero.support).toContain(`${LIBRARY_CLAIM_MIN}+`);
    expect(BRAND.unlockHeadline).toContain(LIBRARY_CLAIM_WORDS);
  });

  it("no public page claims a bigger number than the constant (free-only check)", () => {
    const NOUN = /(adventures|things to do|collections|keepsakes|stamps)/i;
    const NUM = new RegExp(`\\b(\\d{2,4})\\+?\\s+(?:[a-z-]+\\s+){0,2}${NOUN.source}`, "gi");
    const bad: string[] = [];
    for (const f of [...PUBLIC_SRC(), "public/manifest.webmanifest"]) {
      if (f.endsWith("brand.ts")) continue;
      for (const m of read(f).matchAll(NUM)) {
        // Allowed: numbers that are not library-size claims (years, dates, minutes) never sit next to these nouns; anything else must not exceed the claim.
        if (Number(m[1]) > LIBRARY_CLAIM_MIN) bad.push(`${f}: ${m[0]}`);
      }
      expect(read(f), f).not.toMatch(/\b(hundreds|thousands)\s+of\s+(adventures|things)/i);
    }
    expect(bad).toEqual([]);
  });

  it.skipIf(!HAS_PREMIUM)(
    "OWNER-MACHINE check (needs PREMIUM_DIR): the real published library is at least the claimed size",
    () => {
      const out = execFileSync(
        "node",
        [join(process.cwd(), "scripts/library-stats.mjs"), "--json"],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
          env: { ...process.env, PREMIUM_DIR },
        },
      );
      const s = JSON.parse(out) as { mode: string; cards: { published: number } };
      expect(s.mode).toBe("full");
      expect(s.cards.published).toBeGreaterThanOrEqual(LIBRARY_CLAIM_MIN);
    },
  );
});
