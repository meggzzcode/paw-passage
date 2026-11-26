import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PrintablePage } from "@/components/printables/PrintablePage";
import { PrintablesIndex } from "@/components/printables/PrintablesIndex";
import { PrintableSheet } from "@/components/printables/PrintableSheet";
import { PRINTABLES, allPrintableText } from "@/components/printables/data";
import { freeLibrary } from "@/passport/content";

const ent = vi.hoisted(() => ({ status: "free" as "free" | "entitled" }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));
vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/printables" }),
  Link: ({ children, to }: { children: unknown; to: string }) => (
    <a href={to}>{children as never}</a>
  ),
}));

beforeEach(() => {
  ent.status = "free";
});
afterEach(cleanup);

// Words that belong to adventure records, never to a printable.
const FORBIDDEN = [
  /\badv-[a-z0-9]{6}\b/i,
  /\binstructions?\b/i,
  /\breveal/i,
  /\btwist\b/i,
  /\bclue\b/i,
  /\bobjective\b/i,
  /\bvariations?\b/i,
  /\bstep \d/i,
  /\bpremium\b/i,
];

describe("printables", () => {
  it("has the six requested printables", () => {
    expect(PRINTABLES.map((p) => p.slug)).toEqual([
      "adventure-bucket-list",
      "indoor-discovery-bingo",
      "outdoor-discovery-bingo",
      "weekend-adventure-planner",
      "adventure-certificate",
      "family-adventure-checklist",
    ]);
    for (const p of PRINTABLES) expect(p.cells?.length ?? 24).toBe(24);
  });

  it("leak test: no printable contains an adventure title, id or instruction marker", () => {
    const titles = freeLibrary().flatMap((a) => [a.title, a.previewTitle ?? ""].filter(Boolean));
    for (const p of PRINTABLES) {
      const { container, unmount } = render(<PrintableSheet p={p} />);
      const html = `${container.textContent} ${allPrintableText(p).join(" ")}`;
      for (const t of titles) expect(html.toLowerCase()).not.toContain(t.toLowerCase());
      for (const re of FORBIDDEN) expect(html).not.toMatch(re);
      unmount();
    }
  });

  it("every sheet renders its title", () => {
    for (const p of PRINTABLES) {
      const { unmount } = render(<PrintableSheet p={p} />);
      expect(screen.getByRole("article", { name: p.title })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: p.title })).toBeInTheDocument();
      unmount();
    }
  });

  it("bingo cards are 5 by 5 with a free middle square", () => {
    const p = PRINTABLES.find((x) => x.slug === "indoor-discovery-bingo")!;
    render(<PrintableSheet p={p} />);
    expect(screen.getAllByRole("cell")).toHaveLength(25);
    expect(screen.getAllByRole("cell")[12]?.textContent).toContain("Free");
  });

  it("the certificate takes a name that stays on the page", () => {
    const p = PRINTABLES.find((x) => x.slug === "adventure-certificate")!;
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<PrintableSheet p={p} />);
    fireEvent.change(screen.getByLabelText("Dog's name"), { target: { value: "Biscuit" } });
    expect(screen.getByLabelText("Dog's name")).toHaveValue("Biscuit");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(window.localStorage.length).toBe(0);
    fetchSpy.mockRestore();
  });

  it("free visitors can open the two samples and see the rest as part of the full Passport", () => {
    render(<PrintablesIndex />);
    expect(screen.getAllByRole("link", { name: /Open and print/ })).toHaveLength(2);
    expect(screen.getAllByText("Included with the full Passport")).toHaveLength(4);
  });

  it("a locked printable shows no sheet to free visitors", () => {
    render(<PrintablePage slug="weekend-adventure-planner" />);
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.getByRole("link", { name: "See the full Passport" })).toBeInTheDocument();
  });

  it("paying customers get every printable and a print button", () => {
    ent.status = "entitled";
    const idx = render(<PrintablesIndex />);
    expect(screen.getAllByRole("link", { name: /Open and print/ })).toHaveLength(6);
    idx.unmount();
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<PrintablePage slug="weekend-adventure-planner" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Print or save as PDF" }));
    expect(print).toHaveBeenCalledTimes(1);
    print.mockRestore();
  });
});
