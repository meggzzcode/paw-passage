// The free-pool gap: without the full Passport, collections, Saved, the editor and deep links must never show the
// instructions of any free-pool adventure except the visitor's own revealed intro adventure. Entitled behavior is unchanged.
import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, A2, A3, contentMock, renderUi } from "./collections-fixtures";
import { CollectionEditor } from "@/components/passport/CollectionEditor";
import { CuratedDetail } from "@/components/passport/CollectionsCurated";
import { FavoriteCollections } from "@/components/passport/CollectionsFavorites";
import { MyCollections } from "@/components/passport/CollectionsMine";
import { useAdventureLibrary, useLibrary } from "@/components/passport/collections-shared";
import { usePassport } from "@/passport/usePassport";
import {
  _resetForTests,
  bookmarkPreview,
  favorite,
  newCollection,
  revealStarter,
  setStarter,
} from "@/passport/local-store";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);

const ent = vi.hoisted(() => ({ status: "free" as "entitled" | "free" }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));

beforeEach(() => {
  ent.status = "free";
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const rainy = () => contentMock.collections.find((c) => c.slug === "rainy-day-club")!;
const text = () => document.body.textContent ?? "";

function Probe() {
  const { save } = usePassport();
  const lib = useLibrary(save);
  const full = useAdventureLibrary();
  return (
    <p data-testid="ids">
      {lib.all.map((a) => a.id).join(",")}|{full.all.length}
    </p>
  );
}

describe("a free visitor and the free pool", () => {
  it("the collections library is empty until an intro adventure is revealed, then holds exactly that one", async () => {
    await renderUi(<Probe />);
    expect(screen.getByTestId("ids").textContent).toBe(`|${contentMock.adventures.length}`);
    act(() => setStarter(A2.id));
    expect(screen.getByTestId("ids").textContent).toMatch(/^\|/); // recommended, not revealed: still nothing
    act(() => revealStarter());
    expect(screen.getByTestId("ids").textContent).toBe(`${A2.id}|${contentMock.adventures.length}`);
  });

  it("My collections shows an invitation, never the builder", async () => {
    await renderUi(<MyCollections />);
    expect(screen.getByText(/come with the full Passport/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Create/ })).toBeNull();
    expect(screen.queryByLabelText(/Name a/)).toBeNull();
  });

  it("a deep link to a custom collection shows the invitation, not its adventures", async () => {
    newCollection({ id: "col-abcd1234", kind: "handpicked", name: "Mine", ids: [A1.id, A2.id] });
    await renderUi(<CollectionEditor id="col-abcd1234" />);
    expect(screen.getByText(/come with the full Passport/)).toBeInTheDocument();
    expect(text()).not.toMatch(/Cozy Treasure Hunt|Blanket Fort Picnic|Reveal a random one/);
  });

  it("Saved lists only the revealed intro adventure; other free adventures that are hearted stay out", async () => {
    act(() => {
      favorite(A1.id);
      favorite(A3.id);
      setStarter(A2.id);
      revealStarter();
    });
    await renderUi(<FavoriteCollections />);
    expect(text()).toContain("Blanket Fort Picnic");
    expect(text()).not.toMatch(/Cozy Treasure Hunt|Backyard Safari/);
    // the one intro row can be opened; there is no surprise-me button
    expect(screen.getAllByRole("button", { name: /^Open/ })).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /Surprise/ })).toBeNull();
  });

  it("Saved with only bookmarked previews and no intro adventure shows no adventure rows", async () => {
    act(() => bookmarkPreview("adv-zzz999"));
    await renderUi(<FavoriteCollections />);
    expect(screen.queryByRole("button", { name: /^Open/ })).toBeNull();
    expect(text()).toMatch(/saved previews? (is|are) on this device|Nothing saved/);
  });

  it("a collection page shows only the visitor's own intro adventure, not the others in it", async () => {
    act(() => {
      setStarter(A2.id);
      revealStarter();
    });
    await renderUi(<CuratedDetail c={rainy()} />);
    expect(text()).toContain("Blanket Fort Picnic");
    expect(text()).not.toContain("Cozy Treasure Hunt");
    fireEvent.click(screen.getByRole("button", { name: /^Open/ }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("has one section-level purchase call to action on a collection page", async () => {
    await renderUi(<CuratedDetail c={rainy()} />);
    expect(screen.getAllByRole("link", { name: /See what's included/ })).toHaveLength(1);
  });
});

describe("an entitled visitor", () => {
  it("still sees and opens every adventure in a collection", async () => {
    ent.status = "entitled";
    await renderUi(<CuratedDetail c={rainy()} />);
    expect(text()).toContain("Cozy Treasure Hunt");
    expect(text()).toContain("Blanket Fort Picnic");
    expect(screen.getAllByRole("button", { name: /^Open/ })).toHaveLength(2);
    fireEvent.click(screen.getAllByRole("button", { name: /^Open/ })[0]!);
    expect(screen.getAllByRole("article").length).toBe(1);
  });

  it("can narrow a collection list", async () => {
    ent.status = "entitled";
    await renderUi(
      <CuratedDetail c={contentMock.collections.find((c) => c.slug === "weekend-together")!} />,
    );
    expect(screen.getAllByRole("button", { name: /^Open/ })).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Costs nothing" }));
    expect(screen.getAllByRole("button", { name: /^Open/ })).toHaveLength(1);
    expect(text()).toContain("Neighborhood Postcard Walk");
  });
});
