// Final copy pins: lifestyle wording, free-flow honesty, professional refund wording, no perpetual-service promises,
// and what restoring access does and does not bring back.
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { FAQS } from "@/components/site/faq-content";
import { DEMO_STEPS, REFUND_SUMMARY, homePromo } from "@/config/commercial";
import { unlockLine } from "@/lib/premium-summary";

const read = (f: string) => readFileSync(f, "utf8").replace(/\s+/g, " ");
const customerFiles = () => {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) {
        if (e.name !== "test") walk(p);
      } else if (/\.(tsx?|ya?ml|md)$/.test(e.name)) out.push(p);
    }
  };
  walk("src");
  walk("content/journal");
  walk("content/adventures");
  out.push("content/collections.yml", "docs/MARKETING.md");
  return out;
};

describe("clumsy filler phrases are gone", () => {
  it("no 'hyper dog(s)' or 'adventures and challenges' in customer-facing text", () => {
    for (const f of customerFiles())
      expect(read(f), f).not.toMatch(/hyper[ -]dogs?|adventures and challenges/i);
    expect(unlockLine(null)).toMatch(/little adventures/);
    expect(unlockLine({ count: 100 } as never)).not.toMatch(/challenges/);
  });
});

describe("free flow: swapping happens before the reveal", () => {
  it("the demo step, quiz intro and FAQ say another pick is before the reveal and the first reveal is the free one", () => {
    const d = DEMO_STEPS.find((s) => s.id === "discover")!;
    expect(d.body).toMatch(/before you reveal/);
    expect(d.body).toMatch(/first adventure you reveal is your free one/);
    expect(d.body).not.toMatch(/as often as you like/);
    const intro = read("src/components/passport/DiscoverPage.tsx");
    expect(intro).not.toMatch(/as often as you like|every question is optional/);
    expect(intro).toMatch(/before you reveal/);
    expect(read("src/components/passport/FreeStarter.tsx")).toMatch(
      /Choose another before you reveal/,
    );
    const faq = FAQS.find((f) => f.id === "try-first")!.a;
    expect(faq).toMatch(/before you reveal/);
    expect(faq).toMatch(/never as safe/);
  });
  it("the quiz does not call every question optional and treats unknown cautiously", () => {
    const q = read("src/components/passport/IntroQuiz.tsx");
    expect(q).toMatch(/keep suggestions suitable/);
    expect(q).toMatch(/treated cautiously, never as safe/);
    expect(q).not.toMatch(/Skipped questions stay unknown\./);
  });
});

describe("homepage: one clear secondary link and one quiet previews link", () => {
  it("has distinct labels", () => {
    expect(homePromo.collectionsCta).toBe("Browse collections");
    expect(homePromo.secondaryCta).toBe("See adventure previews");
    const home = read("src/routes/index.tsx");
    expect(home).toMatch(/without the steps/);
    expect(home).not.toMatch(/Browse all collections/);
  });
});

describe("refund wording is professional and states no period", () => {
  it("the provider's terms govern the transaction everywhere", () => {
    const texts = [
      read("src/routes/refund-policy.tsx"),
      read("src/routes/terms.tsx"),
      FAQS.find((f) => f.id === "refund")!.a,
      REFUND_SUMMARY.join(" "),
    ];
    for (const t of texts) {
      expect(t).toMatch(/provider's terms/);
      expect(t).not.toMatch(/\bwins\b/);
      expect(t).not.toMatch(/\b\d+[- ]day|money.back guarantee/i);
    }
  });
});

describe("access duration is honest", () => {
  it("keeps the pay-once facts and adds an availability line, with no perpetual promise", () => {
    const a = FAQS.find((f) => f.id === "keep-access")!.a;
    expect(a).toMatch(/One payment of \$19\.99\. Yours to keep\. No subscription\. No renewals\./);
    expect(a).toMatch(/We aim to keep the Passport available/);
    expect(a).toMatch(/well ahead of any significant change/);
    expect(a).toMatch(/keep a copy of your purchase email and code/);
    for (const f of FAQS)
      expect(`${f.q} ${f.a}`, f.id).not.toMatch(
        /forever|never expires?|always available|indefinitely|lifetime access/i,
      );
    for (const f of [
      "src/routes/unlock.tsx",
      "src/components/site/WelcomePage.tsx",
      "src/routes/restore-access.tsx",
    ])
      expect(read(f), f).not.toMatch(/forever|never expires?|always available|indefinitely/i);
  });
});

describe("restore access says what comes back", () => {
  it("synced progress returns; unsynced and local-only records do not transfer automatically", () => {
    const r = read("src/routes/restore-access.tsx");
    expect(r).toMatch(/access and the progress that was synced to your account/);
    expect(r).toMatch(/never synced/);
    expect(r).toMatch(/do not transfer automatically/);
    expect(r).toMatch(/first adventure works without any code/);
    expect(r).not.toMatch(/progress comes with you/);
    expect(read("src/components/site/WelcomePage.tsx")).not.toMatch(/Nothing is lost either way/);
  });
});
