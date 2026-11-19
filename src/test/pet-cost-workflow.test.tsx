import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { blankStay, type StayForm } from "@/lib/cost";
import { feeConfirmationText, withFeeConfirmation } from "@/lib/pet-cost-message";
import { buildHostQuestions } from "@/lib/host-questions";
import { guideSchema } from "@/content/schema";
import { loadContent } from "../../plugins/content";

vi.mock("@/config/site", async (orig) => {
  const m = await orig<typeof import("@/config/site")>();
  return { ...m, site: { ...m.site, ga4MeasurementId: "G-TEST123" } };
});

const stay = (o: Partial<StayForm>): StayForm => ({
  ...blankStay("Stay A"),
  nightly: "200",
  nights: "4",
  dogs: "2",
  petFee: "25",
  petFeeBasis: "dog-night",
  ...o,
});

describe("pre-filled fee confirmation", () => {
  it("per dog per night: states the fee and the computed total", () => {
    const t = feeConfirmationText(stay({}));
    expect(t).toContain("You listed the pet fee as $25.00 per dog per night");
    expect(t).toContain("the total for 4 nights and 2 dogs is $200.00");
    expect(t).toContain("no other pet-related charges, deposits or after-stay charges");
  });
  it("per stay: total equals the fee", () => {
    const t = feeConfirmationText(
      stay({ petFee: "50", petFeeBasis: "stay", dogs: "1", nights: "1" }),
    );
    expect(t).toContain("$50.00 per stay");
    expect(t).toContain("the total for 1 night and 1 dog is $50.00");
  });
  it("no fee entered asks to confirm there are none", () => {
    expect(feeConfirmationText(stay({ petFee: "" }))).toContain("no pet fee");
  });
  it("is spliced into the host message before the thank-you, with plural dog wording kept", () => {
    const base = buildHostQuestions({
      dogName: "",
      dogs: 2,
      size: "large",
      breed: "",
      needs: {
        fencedYard: false,
        jumper: false,
        digger: false,
        pool: false,
        crate: false,
        leftAlone: false,
        furniture: false,
        stairsHard: false,
        reactive: false,
        beach: false,
      },
    });
    const m = withFeeConfirmation(base.message, stay({}));
    expect(m).toContain("traveling with two dogs");
    expect(m.indexOf("You listed the pet fee")).toBeLessThan(m.indexOf("Thank you"));
    expect(withFeeConfirmation(base.message, null)).toBe(base.message);
  });
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLElement | null = null;
let root: Root | null = null;
const cleanup = () => {
  if (root) act(() => root!.unmount());
  host?.remove();
  root = null;
  host = null;
};
const labelled = (text: RegExp | string): HTMLElement[] =>
  [...host!.querySelectorAll("label")]
    .filter((l) =>
      typeof text === "string"
        ? l.textContent?.trim().startsWith(text)
        : text.test(l.textContent ?? ""),
    )
    .map((l) => l.querySelector("input,select") as HTMLElement);
const screen = {
  getAllByLabelText: (t: RegExp | string) => labelled(t),
  getByLabelText: (t: RegExp | string) => labelled(t)[0]!,
  getAllByDisplayValue: (v: string) =>
    [...host!.querySelectorAll("select")].filter((x) => x.options[x.selectedIndex]?.text === v),
  getAllByTestId: (id: string) => [...host!.querySelectorAll(`[data-testid="${id}"]`)],
  getByTestId: (id: string) => host!.querySelector(`[data-testid="${id}"]`)!,
  getByText: (re: RegExp) =>
    [...host!.querySelectorAll("p")].find((e) => re.test(e.textContent ?? "")) ?? null,
  getByRole: (_r: string, o: { name: RegExp }) =>
    [...host!.querySelectorAll("button")].find((b) => o.name.test(b.textContent ?? ""))!,
};
const fireEvent = {
  change(el: HTMLElement, init: { target: { value: string } }) {
    const proto =
      el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    act(() => {
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, init.target.value);
      el.dispatchEvent(
        new Event(el instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }),
      );
    });
  },
  click(el: HTMLElement) {
    act(() => {
      el.click();
    });
  },
};

describe("PetCostWorkflow tracking and message", () => {
  const gtag = vi.fn();
  beforeEach(() => {
    vi.resetModules();
    gtag.mockClear();
    (window as unknown as { gtag: unknown }).gtag = gtag;
  });
  afterEach(() => {
    cleanup();
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  async function setup() {
    const { PetCostWorkflow } = await import("@/components/site/PetCostWorkflow");
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root!.render(<PetCostWorkflow />));
  }

  it("shows the helper sentence for the chosen fee basis and the honesty note", async () => {
    await setup();
    expect(screen.getAllByTestId("fee-basis-help")[0]!.textContent).toContain("Per stay");
    expect(
      screen.getByText(
        /Estimate only\. Taxes and rules vary: confirm the final total with the host or the booking page\./,
      ),
    ).not.toBeNull();
  });

  it("pre-fills the message from what was entered and never sends typed text to analytics", async () => {
    await setup();
    const secret = "Zorblax-the-dog";
    fireEvent.change(screen.getByLabelText(/Dog's name/), { target: { value: secret } });
    fireEvent.change(screen.getByLabelText(/Property name/), {
      target: { value: "Secret Cabin 42" },
    });
    const rates = screen.getAllByLabelText(/Nightly rate/);
    fireEvent.change(rates[0]!, { target: { value: "200" } });
    fireEvent.change(rates[1]!, { target: { value: "150" } });
    fireEvent.change(screen.getAllByLabelText(/Pet fee/)[0]!, { target: { value: "25" } });
    fireEvent.change(screen.getAllByDisplayValue("Per stay")[0]!, {
      target: { value: "dog-night" },
    });
    fireEvent.change(screen.getByLabelText("Number of dogs"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Nights"), { target: { value: "4" } });
    fireEvent.click(screen.getByRole("button", { name: /Write my message/ }));
    const msg = screen.getByTestId("host-message").textContent!;
    expect(msg).toContain("You listed the pet fee as $25.00 per dog per night");
    expect(msg).toContain("the total for 4 nights and 2 dogs is $200.00");
    expect(msg).toContain("two dogs");
    expect(msg).toContain(secret);

    const events = gtag.mock.calls.map((c) => c[1] as string);
    expect(events).toContain("tool_start");
    const complete = gtag.mock.calls
      .filter((c) => c[1] === "tool_complete")
      .map((c) => (c[2] as { tool_label: string }).tool_label);
    expect(complete).toEqual(expect.arrayContaining(["total", "message"]));
    const allowed = ["tool_name", "tool_label", "item_count", "page_path", "transport_type"];
    for (const call of gtag.mock.calls) {
      expect(call[0]).toBe("event");
      expect(Object.keys(call[2] as object).every((k) => allowed.includes(k))).toBe(true);
      expect(JSON.stringify(call)).not.toContain(secret);
      expect(JSON.stringify(call)).not.toContain("Secret Cabin");
    }
  });
});

describe("Compare tool is gone", () => {
  const files = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
      d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)],
    );
  it("has no compare route and nothing in src links to it", () => {
    expect(readdirSync("src/routes").some((f) => /compare/i.test(f))).toBe(false);
    const offenders = files("src")
      .filter((f) => /\.(tsx?|md)$/.test(f) && !f.includes("/test/"))
      .filter((f) => readFileSync(f, "utf8").includes("/tools/compare"));
    expect(offenders).toEqual([]);
    expect(guideSchema.shape.relatedTools.safeParse(["compare"]).success).toBe(false);
  });
  it("old tool addresses are kept as redirects to the new tool", () => {
    for (const f of ["tools.cost-calculator.tsx", "tools.host-questions.tsx"]) {
      const src = readFileSync(`src/routes/${f}`, "utf8");
      expect(src).toContain("redirect");
      expect(src).toContain("/tools/pet-cost-check");
      expect(src).toContain("301");
    }
  });
});

describe("embeddedTool front matter", () => {
  const real = readFileSync(
    join(process.cwd(), "content/guides/how-vacation-rental-pet-fees-work.md"),
    "utf8",
  )
    .replace(/relatedGuides:\n( {2}- .*\n)+/, "relatedGuides: []\n")
    .replace(/relatedProducts:\n( {2}- .*\n)+/, "relatedProducts: []\n")
    .replace(/^\{\{pick:.*\}\}\n?/gm, "")
    .replace(/\]\(aff:[a-z0-9-]+\)/g, "](https://example.com)");
  const run = (text: string) => {
    const root = mkdtempSync(join(tmpdir(), "paws-embed-"));
    try {
      mkdirSync(join(root, "content/guides"), { recursive: true });
      mkdirSync(join(root, "content/stays"), { recursive: true });
      writeFileSync(join(root, "content/guides/g.md"), text);
      return loadContent(root, false).guides as { embeddedTool?: string }[];
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  };
  it("the fees guide embeds the tool", () => {
    expect(real).toContain("embeddedTool: pet-cost-workflow");
    expect(run(real)[0]!.embeddedTool).toBe("pet-cost-workflow");
  });
  it("is optional", () => {
    expect(run(real.replace(/^embeddedTool:.*\n/m, ""))[0]!.embeddedTool).toBeUndefined();
  });
  it("an unknown value stops the build with a clear message", () => {
    expect(() =>
      run(real.replace("embeddedTool: pet-cost-workflow", "embeddedTool: mortgage-calculator")),
    ).toThrow(/embeddedTool[\s\S]*pet-cost-workflow/);
  });
});
