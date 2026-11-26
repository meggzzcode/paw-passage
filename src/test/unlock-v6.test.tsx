// V6 G stream: unlock page (refund terms before payment, one fully visible demonstration adventure, gifting behind a
// flag), keepsake claims audit, conditional FAQ, disclaimer line.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import type { ReactNode } from "react";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@/passport/events", async (orig) => {
  const real = await orig<typeof import("@/passport/events")>();
  return { ...real, track: () => true };
});
vi.mock("@/lib/passport-api", async (orig) => {
  const real = await orig<typeof import("@/lib/passport-api")>();
  return { ...real, checkoutUrl: () => "https://example.gumroad.test/l/passport" };
});

import { DEMO_ADVENTURE, DEMO_LABEL } from "@/config/demo-adventure";
import { REFUND_SUMMARY, flags, price, GIFT_CTA } from "@/config/commercial";
import { buildFaqs, FAQS } from "@/components/site/faq-content";

afterEach(() => {
  cleanup();
  vi.resetModules();
  vi.doUnmock("@/config/commercial");
});

async function renderUnlock(gifting: boolean) {
  vi.resetModules();
  vi.doMock("@/config/commercial", async (orig) => {
    const real = await orig<typeof import("@/config/commercial")>();
    return { ...real, flags: { ...real.flags, gifting } };
  });
  const { Route } = await import("@/routes/unlock");
  const C = Route.options.component as () => ReactNode;
  return render(<C />);
}

describe("/unlock: refund terms and the full demonstration adventure", () => {
  it("shows refund terms next to the buy button, before payment, with a link to the full policy", async () => {
    const { container } = await renderUnlock(false);
    const terms = container.querySelector('[data-testid="refund-terms"]')!;
    expect(terms).toBeTruthy();
    for (const line of REFUND_SUMMARY) expect(terms.textContent).toContain(line);
    expect(terms.querySelector('a[href="/refund-policy"]')).toBeTruthy();
    // Same card, before the checkout button in document order.
    const buy = [...container.querySelectorAll("a")].find((a) =>
      /Continue to checkout/.test(a.textContent ?? ""),
    )!;
    expect(terms.compareDocumentPosition(buy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("the refund summary matches the policy page", () => {
    const policy = readFileSync("src/routes/refund-policy.tsx", "utf8");
    expect(policy).toMatch(/checkout page for your purchase applies/);
    expect(policy).toMatch(/up to about a day/);
    expect(policy).toMatch(/Your progress is yours/);
    const all = REFUND_SUMMARY.join(" ");
    expect(all).toMatch(/checkout page/);
    expect(all).toMatch(/within about a day/);
    expect(all).toMatch(/progress stays yours/);
    expect(all).not.toMatch(/\b\d+[- ]day|money.back guarantee|no questions/i);
  });
  it("shows one fully visible adventure, open, labeled, with steps, twist and safety", async () => {
    const { container } = await renderUnlock(false);
    const d = container.querySelector('[data-testid="demo-adventure"]') as HTMLDetailsElement;
    expect(d.open).toBe(true);
    expect(container.textContent).toContain(DEMO_LABEL);
    expect(DEMO_LABEL).toBe("A full adventure, shown in full");
    expect(d.textContent).toContain(DEMO_ADVENTURE.twist);
    for (const s of DEMO_ADVENTURE.steps) expect(d.textContent).toContain(s);
    for (const s of DEMO_ADVENTURE.safety) expect(d.textContent).toContain(s);
    expect(DEMO_ADVENTURE.steps.length).toBeGreaterThanOrEqual(5);
    expect(DEMO_ADVENTURE.safety.length).toBeGreaterThanOrEqual(3);
  });
  const demoFiles = (dir: string, ext: string) =>
    readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .map((f) => `${dir}/${f}`);
  const notACopy = (files: string[]) => {
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const t = readFileSync(f, "utf8");
      expect(t, f).not.toContain(DEMO_ADVENTURE.title);
      for (const step of DEMO_ADVENTURE.steps) expect(t, f).not.toContain(step.slice(0, 60));
    }
  };
  it("the demonstration card is original: not a public library card", () => {
    notACopy(demoFiles("content/adventures", ".yml"));
  });
  const PREMIUM_DIR = process.env["PREMIUM_DIR"]?.trim() || "";
  it.skipIf(!PREMIUM_DIR || !existsSync(PREMIUM_DIR))(
    "OWNER-MACHINE check (skipped without PREMIUM_DIR): the demonstration card is not a premium card either",
    () => {
      notACopy(demoFiles(PREMIUM_DIR, ".json"));
    },
  );
  it("the homepage mounts it collapsed", () => {
    const home = readFileSync("src/routes/index.tsx", "utf8");
    expect(home).toContain("<DemoAdventure />");
    expect(home).not.toContain("<DemoAdventure open");
  });
  it("keeps the price single-sourced", () => {
    const src = [
      "src/routes/unlock.tsx",
      "src/config/demo-adventure.ts",
      "src/components/site/DemoAdventure.tsx",
      "src/components/site/faq-content.ts",
    ]
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    expect(src).not.toMatch(/\$\d+\.\d{2}/);
    expect(price).toMatch(/^\$\d+\.\d{2}$/);
  });
});

describe("gifting is behind flags.gifting", () => {
  it("defaults to false", () => {
    expect(flags.gifting).toBe(false);
  });
  it("advertises nothing about gifting while the flag is false", async () => {
    const { container } = await renderUnlock(false);
    expect(container.querySelector('[data-testid="gift-cta"]')).toBeNull();
    expect(container.textContent).not.toMatch(/gift/i);
    expect(FAQS.map((f) => `${f.q} ${f.a}`).join(" ")).not.toMatch(/\bgift/i);
    for (const f of [
      "src/routes/index.tsx",
      "src/components/site/WelcomePage.tsx",
      "src/components/site/TrustStrip.tsx",
      "src/routes/disclaimer.tsx",
    ])
      expect(readFileSync(f, "utf8"), f).not.toMatch(/\bgift/i);
  });
  it("shows a secondary gift action on the same checkout link when the flag is true", async () => {
    const { container } = await renderUnlock(true);
    const a = container.querySelector('[data-testid="gift-cta"]') as HTMLAnchorElement;
    expect(a.textContent).toBe(GIFT_CTA);
    expect(GIFT_CTA).toBe("Gift the Adventure Passport");
    expect(a.getAttribute("href")).toBe("https://example.gumroad.test/l/passport");
    expect(a.className).toMatch(/secondary/);
  });
  it("adds the gift FAQ only when on", () => {
    expect(buildFaqs(false).some((f) => f.id === "gift")).toBe(false);
    const on = buildFaqs(true);
    expect(on.some((f) => f.id === "gift")).toBe(true);
    expect(on.length).toBe(buildFaqs(false).length + 1);
  });
});

describe("keepsake claims: free means examples only", () => {
  const files = [
    "src/routes/index.tsx",
    "src/routes/unlock.tsx",
    "src/routes/about.tsx",
    "src/routes/privacy.tsx",
    "src/components/site/faq-content.ts",
    "src/components/site/landing-pages.ts",
    "src/components/site/WelcomePage.tsx",
    "src/components/site/PurchasePrompt.tsx",
    "src/components/passport/TrustBlock.tsx",
    "src/config/commercial.ts",
  ];
  it("no marketing copy says free visitors can make or create a keepsake or photo keepsake", () => {
    for (const f of files) {
      const t = readFileSync(f, "utf8").replace(/\s+/g, " ");
      expect(t, f).not.toMatch(
        /Make my photo (?:filter|keepsake)|turn it into a photo (?:filter|keepsake)/i,
      );
      expect(t, f).not.toMatch(/a stamp(?: for your passport)? and a keepsake you can make/i);
      expect(t, f).not.toMatch(/A stamp and a keepsake</);
      expect(t, f).not.toMatch(/more keepsake designs/i);
      expect(t, f).not.toMatch(/Photo filters are made/i);
    }
  });
  it("the FAQ says personalized keepsakes are paid and that photos never leave the device", () => {
    const k = FAQS.find((f) => f.id === "keepsake-paid")!;
    expect(k.a).toMatch(/part of the full Passport/);
    expect(k.a).toMatch(/examples/);
    expect(FAQS.find((f) => f.id === "keep-photos")!.q).toBe("Can I keep the photos I create?");
    expect(FAQS.find((f) => f.id === "photos-not-uploaded")!.a).toMatch(/never leave your device/);
  });
  it("the unlock page lists the matching style as an example for free and creation for paid", () => {
    const u = readFileSync("src/routes/unlock.tsx", "utf8").replace(/\s+/g, " ");
    expect(u).toMatch(/matching keepsake style shown as an example/);
    expect(u).toMatch(/Personalized keepsakes: make your own from your dog's photo/);
  });
  it("the demo stepper says making your own is part of the full Passport", async () => {
    const { DEMO_STEPS } = await import("@/config/commercial");
    const k = DEMO_STEPS.find((s) => s.id === "keepsake")!;
    expect(k.body).toMatch(/full Passport/);
    expect(k.title).not.toMatch(/^Create/);
  });
});

describe("multi-dog and disclaimer", () => {
  it("the FAQ covers multiple dogs: one shared profile, names together, suit every dog", () => {
    const m = FAQS.find((f) => f.id === "multi-dog")!;
    expect(m.a).toMatch(/one shared profile/);
    expect(m.a).toMatch(/Luna and Milo/);
    expect(m.a).toMatch(/every dog/);
    expect(m.a).toMatch(/guarding/);
  });
  it("the disclaimer has the enrichment line and no absolute safety promise", () => {
    const d = readFileSync("src/routes/disclaimer.tsx", "utf8");
    expect(d).toContain(
      "Adventures are enrichment ideas, not behavior treatment or veterinary advice.",
    );
    expect(d).toMatch(/cannot promise/);
    expect(FAQS.map((f) => f.a).join(" ")).not.toMatch(/never sent/i);
  });
});
