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
  it("leads with one suggestion and five clear actions; advanced browsing is collapsed", () => {
    render(<Harness />);
    expect(screen.getByRole("heading", { level: 1, name: "What shall we do today?" })).toBeTruthy();
    expect(within(screen.getByTestId("today")).getAllByRole("article")).toHaveLength(1);
    for (const n of ["Surprise us", "Explore collections", "Saved", "Preferences"])
      expect(screen.getByText(n)).toBeTruthy();
    // Collapsed by default: no tabs, no filter panel, no card list, no quick-way tiles.
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByTestId("sc")).toBeNull();
    expect(screen.getAllByRole("article")).toHaveLength(1);
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
    fireEvent.click(screen.getByRole("button", { name: "Surprise us" }));
    expect(screen.getByLabelText("Mystery adventure")).toBeTruthy();
  });
  it("opening the suggestion shows the full card and focuses its title", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Let's do this one" }));
    const card = within(screen.getByTestId("today")).getByRole("article");
    expect(document.activeElement).toBe(within(card).getAllByRole("heading")[0]);
  });
});

describe("paid completion focus", () => {
  it("the suggestion stays put once done and focus moves to the celebration", () => {
    ent.state = { ...ent.state, status: "entitled", signedIn: true };
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Let's do this one" }));
    const title = within(screen.getByTestId("today")).getAllByRole("heading")[1]!.textContent;
    fireEvent.click(screen.getByRole("button", { name: "We did it" }));
    const today = screen.getByTestId("today");
    expect(within(today).getAllByRole("heading")[1]!.textContent).toBe(title);
    expect(document.activeElement).toBe(
      within(today).getByRole("heading", { name: "Another little memory made." }),
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
    expect(screen.getByRole("button", { name: "We did it" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Save for later/ })).toBeTruthy();
    // plain language: no internal classification
    expect(container.textContent).not.toMatch(/activity type|keepsake family|classification/i);
  });
});

describe("completion", () => {
  it("free: memory made, first stamp, one example, one invitation, no upload, progress help folded", () => {
    const { container } = render(<AdventureCard a={A} />);
    fireEvent.click(screen.getByRole("button", { name: "We did it" }));
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
    fireEvent.click(screen.getByRole("button", { name: "We did it" }));
    const panel = screen.getByTestId("completion");
    expect(
      within(panel).getByRole("heading", { name: "Another little memory made." }),
    ).toBeTruthy();
    expect(within(panel).getByRole("button", { name: "Make a photo keepsake" })).toBeTruthy();
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
  it("free: two clear options, price once, no shipping, code form up top, honest disabled checkout", () => {
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
    // The code form is reachable before the options, not at the bottom.
    const code = screen.getByTestId("code-section");
    const free = screen.getByRole("heading", { name: "Your first adventure — free." });
    expect(code.compareDocumentPosition(free) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.click(screen.getByText("Already have a code?", { selector: "summary" }));
    expect(screen.getByLabelText("Purchase code")).toBeTruthy();
    // one form, one "Already have a code?" label (the summary), no second heading
    expect(screen.getAllByText("Already have a code?")).toHaveLength(1);
    expect(screen.getAllByLabelText("Purchase code")).toHaveLength(1);
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
