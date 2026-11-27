// U3: paid Discover default view, entitled /unlock, completion free vs paid, detail hierarchy.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState, type ReactNode } from "react";

const ent = vi.hoisted(() => ({
  state: {
    status: "free" as string,
    premium: [] as unknown[],
    signedIn: false,
    csrf: "",
    message: null as string | null,
  },
}));
const flag = vi.hoisted(() => ({ on: false }));

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children?: ReactNode }) => (
    <a href={to} {...(rest as object)}>
      {children}
    </a>
  ),
}));
vi.mock("@/passport/useEntitlement", () => ({ useEntitlement: () => ent.state }));
vi.mock("@/passport/premium-client", async (orig) => ({
  ...(await orig<typeof import("@/passport/premium-client")>()),
  hasAccountFlag: () => flag.on,
}));
vi.mock("@/components/passport/Shortcuts", () => ({ Shortcuts: () => <div data-testid="sc" /> }));
vi.mock("@/components/passport/Itineraries", () => ({ Itineraries: () => null }));
vi.mock("@/components/passport/Keepsake", () => ({ Keepsake: () => <div /> }));
vi.mock("@/passport/events", async (orig) => ({
  ...(await orig<typeof import("@/passport/events")>()),
  track: () => true,
}));
vi.mock("@/lib/passport-api", async (orig) => ({
  ...(await orig<typeof import("@/lib/passport-api")>()),
  checkoutUrl: () => "",
}));

import { AdventureCard } from "@/components/passport/AdventureCard";
import { DiscoverPage } from "@/components/passport/DiscoverPage";
import type { DiscoverMode } from "@/components/passport/DiscoverTabs";
import { freeLibrary } from "@/passport/content";
import { _resetForTests, completeAdventure } from "@/passport/local-store";
import { Route } from "@/routes/unlock";

const A = freeLibrary()[0]!;

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  ent.state = { status: "free", premium: [], signedIn: false, csrf: "", message: null };
  flag.on = false;
});
afterEach(cleanup);

function Harness({ start = "made" as DiscoverMode }) {
  const [mode, setMode] = useState<DiscoverMode>(start);
  return <DiscoverPage mode={mode} onMode={setMode} />;
}
const Unlock = Route.options.component as () => ReactNode;

describe("paid Discover", () => {
  beforeEach(() => {
    ent.state = { ...ent.state, status: "entitled", signedIn: true };
  });
  it("leads with today's choices and clear actions; advanced browsing is collapsed", () => {
    render(<Harness />);
    expect(screen.getByRole("heading", { level: 1, name: "What shall we do today?" })).toBeTruthy();
    expect(screen.getByText("Find a little adventure that fits your day.")).toBeTruthy();
    for (const n of [
      "Find our adventure",
      "Surprise us!",
      "Collections",
      "Saved",
      "More preferences",
    ])
      expect(screen.getByText(n)).toBeTruthy();
    // Collapsed by default: no tabs, no filter panel, no card list, no quick-way tiles.
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByTestId("sc")).toBeNull();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    const more = screen.getByText("More ways to find an adventure");
    fireEvent.click(more);
    expect(screen.getByRole("tablist")).toBeTruthy();
    expect(screen.getByTestId("sc")).toBeTruthy();
    fireEvent.click(more);
    expect(screen.queryByRole("tablist")).toBeNull();
  });
  it("opens the advanced browser when the address asks for a mode", () => {
    render(<Harness start="browse" />);
    expect(screen.getByRole("tab", { name: "Browse All" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
  it("Surprise us offers a mystery in place", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Surprise us!" }));
    expect(screen.getByLabelText("Mystery adventure")).toBeTruthy();
  });
  it("Find our adventure shows a small set; a result opens straight to the full card", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    const list = screen.getByTestId("today-matches");
    expect(within(list).getAllByRole("article").length).toBeLessThanOrEqual(5);
    fireEvent.click(within(list).getAllByRole("button", { name: "Let's do this one" })[0]!);
    expect(within(list).getByRole("heading", { name: "Before you start" })).toBeTruthy();
  });
});

describe("paid completion focus", () => {
  it("an opened result stays put once done and focus moves to the celebration", () => {
    ent.state = { ...ent.state, status: "entitled", signedIn: true };
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Find our adventure" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Let's do this one" })[0]!);
    const list = screen.getByTestId("today-matches");
    const title = within(list).getAllByRole("listitem")[0]!.querySelector("h2, h3")!.textContent;
    fireEvent.click(within(list).getByRole("button", { name: "Complete adventure" }));
    expect(within(list).getAllByRole("listitem")[0]!.querySelector("h2, h3")!.textContent).toBe(
      title,
    );
    expect(document.activeElement).toBe(
      within(list).getByRole("heading", { name: "Another little memory made." }),
    );
  });
});

describe("adventure detail hierarchy", () => {
  it("shows safety, preparation, needs and numbered steps on the page, with extras folded", () => {
    const { container } = render(<AdventureCard a={A} />);
    const heads = within(container)
      .getAllByRole("heading")
      .map((h) => h.textContent);
    expect(heads).toEqual(
      expect.arrayContaining(["Before you start", "What you'll need", "How it goes"]),
    );
    const before = within(container).getByRole("heading", { name: "Before you start" });
    expect(before.closest("details")).toBeNull();
    for (const line of A.safety) expect(container.textContent).toContain(line);
    for (const d of container.querySelectorAll("details")) {
      expect(d.textContent).not.toContain(A.safety[0] ?? "\u0000__none__");
      expect(d.open).toBe(false);
    }
    expect(container.querySelector("ol")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Complete adventure" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Save for later/ })).toBeTruthy();
    // plain language: no internal classification
    expect(container.textContent).not.toMatch(/activity type|keepsake family|classification/i);
  });
});

describe("completion", () => {
  it("free: memory made, first stamp, one example, one invitation, no upload, progress help folded", () => {
    const { container } = render(<AdventureCard a={A} />);
    fireEvent.click(screen.getByRole("button", { name: "Complete adventure" }));
    const heading = screen.getByRole("heading", { name: "Another little memory made." });
    expect(document.activeElement).toBe(heading);
    const panel = screen.getByTestId("completion");
    expect(within(panel).getAllByRole("img", { name: /keepsake/i }).length).toBe(1);
    expect(screen.queryByLabelText("About personalized keepsakes")).toBeNull();
    expect(within(panel).getByText(/included in the full Passport/i)).toBeTruthy();
    expect(screen.getAllByTestId("purchase-invite")).toHaveLength(1);
    expect(panel.textContent).toContain(
      "One passport. Over a hundred adventures. Endless little memories.",
    );
    expect(panel.textContent).toContain("One payment of $19.99. Yours to keep.");
    expect(container.querySelector("input[type=file]")).toBeNull();
    const help = within(panel).getByText("Where is my progress kept?").closest("details")!;
    expect(help.open).toBe(false);
    expect(panel.textContent).not.toMatch(/localStorage|IndexedDB|cache/i);
  });
  it("paid: celebrates and offers the keepsake maker, never sells again", () => {
    ent.state = { ...ent.state, status: "entitled", signedIn: true };
    render(<AdventureCard a={A} />);
    fireEvent.click(screen.getByRole("button", { name: "Complete adventure" }));
    const panel = screen.getByTestId("completion");
    expect(
      within(panel).getByRole("heading", { name: "Another little memory made." }),
    ).toBeTruthy();
    expect(within(panel).getByRole("button", { name: "Create a keepsake" })).toBeTruthy();
    expect(screen.queryByTestId("purchase-invite")).toBeNull();
    expect(panel.textContent).not.toMatch(/\$19\.99|Passport\./);
  });
  it("an already completed adventure shows the panel without stealing focus", () => {
    completeAdventure(A.id);
    render(<AdventureCard a={A} />);
    expect(screen.getByTestId("completion")).toBeTruthy();
    expect(document.activeElement).toBe(document.body);
  });
});

describe("/unlock purchase clarity and entitled state", () => {
  it("free: two clear options, price once, no shipping, offer and checkout before the code form, honest disabled checkout", () => {
    render(<Unlock />);
    expect(screen.getByRole("heading", { name: "Your first adventure — free." })).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /The full Adventure Passport — \$19\.99 once/ }),
    ).toBeTruthy();
    const t = document.body.textContent ?? "";
    expect(t).toMatch(/nothing is shipped/i);
    expect(t).toMatch(/No subscription\. No renewals\./);
    expect(t).not.toMatch(/forever|lifetime|unlimited updates/i);
    const btn = screen.getByRole("button", { name: "Checkout opens soon" });
    expect(btn).toBeDisabled();
    // A new purchaser sees the headline, price and primary action BEFORE the activation form.
    const code = screen.getByTestId("code-section");
    const h1 = screen.getByRole("heading", { level: 1 });
    const price = screen.getAllByText(/One payment of \$19\.99\. Yours to keep\./)[0]!;
    const follows = (a: Element, b: Element) =>
      !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(follows(h1, price)).toBe(true);
    expect(follows(price, btn)).toBe(true);
    expect(follows(btn, code)).toBe(true);
    // The h1 and the supporting paragraph do not repeat each other.
    expect(h1.nextElementSibling?.textContent ?? "").not.toContain(h1.textContent ?? "");
    // Existing customers: a real anchor near the top that opens the single form and focuses the input.
    const link = screen.getByRole("link", { name: "Already have a code?" });
    expect(link.getAttribute("href")).toBe("#activate-code");
    expect(code.id).toBe("activate-code");
    expect(follows(link, code)).toBe(true);
    fireEvent.click(link);
    expect(code.hasAttribute("open")).toBe(true);
    expect(document.activeElement).toBe(screen.getByLabelText("Purchase code"));
    // one form, one code input
    expect(screen.getAllByLabelText("Purchase code")).toHaveLength(1);
    expect(screen.getAllByRole("form", { name: "Activate your code" })).toHaveLength(1);
  });
  it("right after activating here: the label appears once, with the confirmation, the single form and the welcome link", () => {
    const { rerender } = render(<Unlock />);
    fireEvent.click(screen.getByText("Enter your purchase code", { selector: "summary" }));
    fireEvent.submit(screen.getByRole("form", { name: "Activate your code" })); // marks "activated here"
    ent.state = { ...ent.state, status: "entitled", signedIn: true };
    rerender(<Unlock />);
    const main = document.body.textContent ?? "";
    expect(main.match(/Enter your purchase code/g)).toHaveLength(1);
    expect(main).not.toMatch(/Already have a code\?/); // the sales-state link is gone once entitled
    expect(screen.getAllByLabelText("Purchase code")).toHaveLength(1);
    expect(screen.queryByRole("heading", { name: "Already have a code?" })).toBeNull();
  });
  it("entitled: no sales page, no Buy button, links to Discover, My Passport, restore and support", () => {
    ent.state = { ...ent.state, status: "entitled", signedIn: true };
    render(<Unlock />);
    expect(screen.getByRole("heading", { name: "You have the Passport" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /checkout|get the passport/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /checkout/i })).toBeNull();
    expect(screen.queryByTestId("code-section")).toBeNull();
    const href = (n: string) => screen.getByRole("link", { name: n }).getAttribute("href");
    expect(href("My Passport")).toBe("/passport");
    expect(href("Restore access")).toBe("/restore-access");
    expect(href("Contact support")).toBe("/contact");
    expect(screen.getByRole("link", { name: /today's adventure/i }).getAttribute("href")).toBe(
      "/discover",
    );
  });
  it("a returning customer never sees the sales state while entitlement loads", () => {
    flag.on = true;
    ent.state = { ...ent.state, status: "checking", signedIn: true };
    render(<Unlock />);
    expect(screen.getByRole("status")).toHaveTextContent(/Checking your Passport/);
    expect(screen.queryByText(/Try your first adventure/)).toBeNull();
    expect(screen.queryByRole("button", { name: /checkout/i })).toBeNull();
    act(() => {
      ent.state = { ...ent.state, status: "entitled" };
    });
  });
});
