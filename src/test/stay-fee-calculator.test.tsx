import { describe, it, expect, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { StayFeeCalculator, feeInputsValid } from "@/components/site/StayFeeCalculator";
import { visibleStays } from "@/content/stays";
import type { Stay } from "@/content/stays/types";

const fireEvent = {
  change(el: HTMLElement, init: { target: { value: string } }) {
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(
        el,
        init.target.value,
      );
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
  },
};

let host: HTMLElement | null = null;
let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  host = null;
  root = null;
});

function mount(stay: Stay) {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(<StayFeeCalculator stay={stay} />));
  const input = (label: string) =>
    [...host!.querySelectorAll("label")]
      .find((l) => l.textContent?.startsWith(label))!
      .querySelector("input") as HTMLInputElement;
  const status = () => host!.querySelector("[aria-live]")!.textContent ?? "";
  return { input, status };
}

const base = visibleStays({ includeSamples: true })[0]!;
const fixed = (o: Partial<Stay>): Stay => ({
  ...base,
  petFee: { amount: 50, basis: "stay" },
  maxDogs: 2,
  ...o,
});

describe("StayFeeCalculator input limits", () => {
  it("feeInputsValid enforces nights 1-60 and dogs 1-max", () => {
    expect(feeInputsValid(1, 1, 2)).toBe(true);
    expect(feeInputsValid(60, 2, 2)).toBe(true);
    expect(feeInputsValid(0, 1, 2)).toBe(false);
    expect(feeInputsValid(61, 1, 2)).toBe(false);
    expect(feeInputsValid(400, 1, 2)).toBe(false);
    expect(feeInputsValid(2, 0, 2)).toBe(false);
    expect(feeInputsValid(2, 1.5, 2)).toBe(false);
    expect(feeInputsValid(-1, 1, 2)).toBe(false);
    expect(feeInputsValid(NaN, 1, 2)).toBe(false);
  });

  it("shows no total for 0 nights, 400 nights or 0 dogs", () => {
    const { input, status } = mount(fixed({}));
    expect(status()).toContain("$50");
    for (const [n, d] of [
      ["0", "1"],
      ["400", "1"],
      ["2", "0"],
    ] as const) {
      fireEvent.change(input("Nights"), { target: { value: n } });
      fireEvent.change(input("Dogs"), { target: { value: d } });
      expect(status(), `${n}/${d}`).toBe("Enter nights from 1 to 60 and dogs from 1 to 2.");
    }
  });

  it("uses singular 'dog' in the over-limit message and the total line", () => {
    const { input, status } = mount(fixed({ maxDogs: 1 }));
    fireEvent.change(input("Dogs"), { target: { value: "2" } });
    expect(status()).toBe("The listing allows up to 1 dog.");
    fireEvent.change(input("Dogs"), { target: { value: "1" } });
    fireEvent.change(input("Nights"), { target: { value: "1" } });
    expect(status()).toContain("for 1 night, 1 dog ");
  });
});
