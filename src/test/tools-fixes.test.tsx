import { describe, it, expect } from "vitest";
import { parseChecklist } from "@/lib/checklist-storage";

describe("checklist storage parsing", () => {
  it("ignores null and non-object JSON", () => {
    for (const raw of ["null", "5", "[1]", '"x"', "{bad", "", null])
      expect(parseChecklist(raw)).toEqual({});
  });
  it("keeps ticked booleans", () => {
    expect(parseChecklist('{"a":true,"b":false,"c":3}')).toEqual({ a: true });
  });
});
