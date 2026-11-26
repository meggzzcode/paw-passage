import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Adventure } from "../passport/schema";

const downloaded: string[] = [];
const sharedResult = { value: "download" as "shared" | "cancelled" | "download" };

vi.mock("../passport/usePassport", () => ({
  usePassport: () => ({ ready: true, save: null, saveState: "ok", profile: { name: "Pip" } }),
}));
vi.mock("../passport/events", () => ({ track: () => true }));
vi.mock("../passport/keepsake/artwork", async (orig) => {
  const real = await orig<typeof import("../passport/keepsake/artwork")>();
  return {
    ...real,
    drawPreview: () => true,
    makeArtworkBlob: async () => new Blob(["png"], { type: "image/png" }),
  };
});
vi.mock("../passport/keepsake/render", async (orig) => {
  const real = await orig<typeof import("../passport/keepsake/render")>();
  return {
    ...real,
    downloadBlob: (_b: Blob, name: string) => {
      downloaded.push(name);
    },
    shareBlob: async () => sharedResult.value,
  };
});

import { Keepsake } from "../components/passport/Keepsake";

const adventure = {
  id: "adv-abc123",
  title: "Toy Champion",
  keepsake: { family: "magazine-cover", theme: "toy-champion", headline: "TOY CHAMPION" },
} as unknown as Adventure;
const collageAdv = {
  ...adventure,
  keepsake: { family: "then-and-now", theme: "then-and-now", headline: "Then and now" },
} as unknown as Adventure;

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);
});

afterEach(() => {
  cleanup();
  downloaded.length = 0;
  vi.unstubAllGlobals();
});

describe("<Keepsake />", () => {
  it("offers camera capture, choose-from-photos, and an illustrated no-photo path", () => {
    const { container } = render(<Keepsake adventure={adventure} dogName="Biscuit" memory="" />);
    const cam = container.querySelector('input[type="file"][capture="environment"]');
    expect(cam).not.toBeNull();
    expect(cam?.getAttribute("accept")).toBe("image/*");
    expect(container.querySelectorAll('input[type="file"]').length).toBe(2);
    expect(screen.getByRole("button", { name: "Take a photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose from photos" })).toBeInTheDocument();
    expect(screen.getByText("Illustrated for now")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Biscuit")).toBeInTheDocument();
  });

  it("prefills the dog name from the profile when none is passed, limits the memory to 140", () => {
    render(<Keepsake adventure={adventure} memory={"m".repeat(200)} />);
    expect(screen.getByDisplayValue("Pip")).toBeInTheDocument();
    expect(screen.getByText("140 of 140")).toBeInTheDocument();
  });

  it("explains once that photos and downloads stay on the device", () => {
    render(<Keepsake adventure={adventure} memory="" />);
    expect(screen.getAllByText(/stay on this device/)).toHaveLength(1);
  });

  it("offers three sizes", () => {
    render(<Keepsake adventure={adventure} memory="" />);
    for (const n of [/Square/, /Portrait/, /Story/])
      expect(screen.getByRole("radio", { name: n })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /Story/ }));
    expect(screen.getByRole("radio", { name: /Story/ })).toBeChecked();
  });

  it("downloads with a size-specific name", async () => {
    render(<Keepsake adventure={adventure} memory="" />);
    fireEvent.click(screen.getByRole("radio", { name: /Square/ }));
    fireEvent.click(screen.getByRole("button", { name: "Download PNG" }));
    await waitFor(() => expect(downloaded).toEqual(["paw-and-passage-magazine-cover-square.png"]));
    expect(screen.getByRole("status")).toHaveTextContent(/Saved to your device/);
  });

  it("falls back to a download with an honest message and never claims a post", async () => {
    sharedResult.value = "download";
    render(<Keepsake adventure={adventure} memory="" />);
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    await waitFor(() => expect(downloaded).toHaveLength(1));
    const msg = screen.getByRole("status").textContent ?? "";
    expect(msg).toMatch(/saved to your device/);
    expect(msg).toMatch(/Nothing was posted/);
    expect(msg).not.toMatch(/Instagram|Facebook|TikTok/);
  });

  it("says so when sharing is cancelled", async () => {
    sharedResult.value = "cancelled";
    render(<Keepsake adventure={adventure} memory="" />);
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/cancelled/));
    expect(downloaded).toHaveLength(0);
  });

  it("rejects over-size photos with a plain message and does not decode them", async () => {
    const create = vi.fn();
    vi.stubGlobal("createImageBitmap", create);
    const { container } = render(<Keepsake adventure={adventure} memory="" />);
    const input = container.querySelectorAll<HTMLInputElement>('input[type="file"]')[1]!;
    const big = new File(["x"], "private-name.jpg", { type: "image/jpeg" });
    Object.defineProperty(big, "size", { value: 21 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [big] } });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/larger than 20 MB/));
    expect(create).not.toHaveBeenCalled();
    expect(screen.getByRole("status").textContent).not.toMatch(/private-name/);
  });

  it("adds a photo, shows the editor, and closes the bitmap on Make another and on unmount", async () => {
    const close = vi.fn();
    vi.stubGlobal("createImageBitmap", async () => ({ width: 800, height: 600, close }));
    const { container, unmount } = render(<Keepsake adventure={adventure} memory="" />);
    const input = container.querySelectorAll<HTMLInputElement>('input[type="file"]')[1]!;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "a.jpg", { type: "image/jpeg" })] },
    });
    await waitFor(() => expect(screen.getByLabelText("Zoom")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /Rotate 90/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Make another/ }));
    expect(close).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText("Zoom")).toBeNull();
    fireEvent.change(input, {
      target: { files: [new File(["x"], "b.jpg", { type: "image/jpeg" })] },
    });
    await waitFor(() => expect(screen.getByLabelText("Zoom")).toBeInTheDocument());
    unmount();
    expect(close).toHaveBeenCalledTimes(2);
  });

  it("then-and-now asks for two photos", () => {
    render(<Keepsake adventure={collageAdv} memory="" />);
    expect(screen.getByText("Then photo")).toBeInTheDocument();
    expect(screen.getByText("Now photo")).toBeInTheDocument();
  });
});
