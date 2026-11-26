import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, A2, A3, A4, renderUi } from "./collections-fixtures";
import { MyCollections } from "@/components/passport/CollectionsMine";
import { CollectionEditor } from "@/components/passport/CollectionEditor";
import { CuratedCollections } from "@/components/passport/CollectionsCurated";
import { FavoriteCollections } from "@/components/passport/CollectionsFavorites";
import {
  _resetForTests,
  completeAdventure,
  favorite,
  getSave,
  newCollection,
  setProfile,
} from "@/passport/local-store";
import { listCollections } from "@/passport/progress";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const rowTitles = () =>
  [...document.querySelectorAll(".co-row-title")].map((n) => n.textContent?.trim());

describe("hand-picked collection lifecycle through the UI", () => {
  it("creates, adds, reorders, renames and deletes", async () => {
    const first = await renderUi(<MyCollections />);
    expect(screen.getByText(/no collections of your own yet/i)).toBeInTheDocument();
    const nameBox = screen.getByLabelText("Name a hand-picked collection");
    fireEvent.change(nameBox, { target: { value: "Weekend List" } });
    fireEvent.click(screen.getByRole("button", { name: "Create hand-picked collection" }));
    const [c] = listCollections(getSave());
    expect(c).toMatchObject({ kind: "handpicked", name: "Weekend List", ids: [] });
    expect(await screen.findByText("Hand-picked")).toBeInTheDocument();
    first.unmount();

    await renderUi(<CollectionEditor id={c!.id} />);
    expect(screen.getByRole("heading", { level: 1, name: "Weekend List" })).toBeInTheDocument();
    expect(screen.getByText("0 of 0 done")).toBeInTheDocument();

    // add two
    fireEvent.click(screen.getByRole("button", { name: /^Add Backyard Safari/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Add Cozy Treasure Hunt/ }));
    expect(rowTitles().slice(0, 2)).toEqual(["Backyard Safari", "Cozy Treasure Hunt"]);

    // reorder: move the second one up
    const second = screen.getAllByRole("listitem").find((li) => li.textContent?.includes("Cozy"))!;
    fireEvent.click(within(second).getByRole("button", { name: /Move up/ }));
    expect(rowTitles().slice(0, 2)).toEqual(["Cozy Treasure Hunt", "Backyard Safari"]);
    expect(listCollections(getSave())[0]).toMatchObject({ ids: [A1.id, A3.id] });

    // the first item cannot move further up
    const firstLi = screen.getAllByRole("listitem").find((li) => li.textContent?.includes("Cozy"))!;
    expect(within(firstLi).getByRole("button", { name: /Move up/ })).toBeDisabled();

    // remove one
    const safari = screen
      .getAllByRole("listitem")
      .find((li) => li.textContent?.includes("Safari"))!;
    fireEvent.click(within(safari).getByRole("button", { name: /Remove/ }));
    expect(listCollections(getSave())[0]).toMatchObject({ ids: [A1.id] });

    // rename
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Rainy Plans" } });
    fireEvent.click(screen.getByRole("button", { name: "Rename" }));
    expect(listCollections(getSave())[0]!.name).toBe("Rainy Plans");
    expect(screen.getByRole("heading", { level: 1, name: "Rainy Plans" })).toBeInTheDocument();

    // progress counts a completion made anywhere
    act(() => completeAdventure(A1.id));
    expect(screen.getByText("1 of 1 done")).toBeInTheDocument();

    // delete needs confirmation
    fireEvent.click(screen.getByRole("button", { name: "Delete collection" }));
    expect(listCollections(getSave())).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Keep it" }));
    expect(listCollections(getSave())).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Delete collection" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete it" }));
    expect(listCollections(getSave())).toHaveLength(0);
    expect(await screen.findByText("Collection deleted")).toBeInTheDocument();
    // completed adventures are untouched by deleting a collection
    expect(Object.keys(getSave().done.added)).toEqual([A1.id]);
  });

  it("reveals a random member only from the collection", async () => {
    newCollection({ id: "col-abcd1234", kind: "handpicked", name: "Two", ids: [A2.id, A4.id] });
    await renderUi(<CollectionEditor id="col-abcd1234" />);
    fireEvent.click(screen.getByRole("button", { name: "Reveal a random one" }));
    const card = await screen.findByRole("article");
    expect([A2.title, A4.title]).toContain(within(card).getByRole("heading").textContent);
  });
});

describe("shared completion", () => {
  it("one completion shows in curated decks and in a custom collection", async () => {
    newCollection({
      id: "col-abcd1234",
      kind: "handpicked",
      name: "Mixed",
      ids: [A1.id, A3.id],
    });
    const view = await renderUi(<CuratedCollections />);
    // before: nothing done anywhere
    const card = (title: string) => screen.getByRole("heading", { name: title }).closest("li")!;
    expect(within(card("Five-Minute Moments")).getByText("0 of 2 done")).toBeInTheDocument();
    expect(within(card("Rainy Day Club")).getByText("0 of 2 done")).toBeInTheDocument();
    act(() => completeAdventure(A1.id)); // belongs to two curated decks and the custom one
    expect(within(card("Five-Minute Moments")).getByText("1 of 2 done")).toBeInTheDocument();
    expect(within(card("Rainy Day Club")).getByText("1 of 2 done")).toBeInTheDocument();
    expect(within(card("Weekend Together")).getByText("0 of 2 done")).toBeInTheDocument();
    view.unmount();

    await renderUi(<MyCollections />);
    expect(screen.getByText("1 of 2 done")).toBeInTheDocument();
  });

  it("premium-only collections say so honestly and invent no counts", async () => {
    await renderUi(<CuratedCollections />);
    const li = screen.getByRole("heading", { name: "Road Trip Adventures" }).closest("li")!;
    expect(within(li).getByText(/In the full Passport/)).toBeInTheDocument();
    expect(li.textContent).not.toMatch(/\d/);
  });

  it("an adventure that does not suit the dog is not counted in a curated deck", async () => {
    act(() => setProfile({ lifeStage: "senior" })); // A1 is for puppies and adults only
    await renderUi(<CuratedCollections />);
    const li = screen.getByRole("heading", { name: "Rainy Day Club" }).closest("li")!;
    expect(within(li).getByText("0 of 1 done")).toBeInTheDocument();
  });
});

describe("favorites", () => {
  it("lists favorites, offers a surprise from them and logs a repeat without a new completion", async () => {
    act(() => {
      favorite(A2.id);
      completeAdventure(A2.id);
    });
    await renderUi(<FavoriteCollections />);
    expect(rowTitles()).toEqual(["✓ Blanket Fort Picnic"]);
    fireEvent.click(screen.getByRole("button", { name: /Did it again/ }));
    expect(getSave().repeats[A2.id]).toBe(1);
    expect(Object.keys(getSave().done.added)).toEqual([A2.id]);
    fireEvent.click(screen.getByRole("button", { name: /Surprise me from my favorites/ }));
    expect(await screen.findByRole("article")).toBeInTheDocument();
  });

  it("has an empty state", async () => {
    await renderUi(<FavoriteCollections />);
    expect(screen.getByText(/No favorites yet/)).toBeInTheDocument();
  });
});
