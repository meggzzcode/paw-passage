import { describe, expect, it } from "vitest";
import {
  DEFAULT_EFFECT,
  PHOTO_EFFECTS,
  PHOTO_EFFECT_IDS,
  gradePixels,
  isPhotoEffect,
  normalizeEffectId,
  photoEffectLabel,
} from "../passport/keepsake/filter-effects";

function sample(w = 32, h = 24): Uint8ClampedArray {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    d[i * 4] = (i * 7) % 256;
    d[i * 4 + 1] = (i * 13) % 256;
    d[i * 4 + 2] = (i * 29) % 256;
    d[i * 4 + 3] = 255;
  }
  return d;
}

describe("photo effects", () => {
  it("has the six looks in order with stable ids", () => {
    expect(PHOTO_EFFECTS.map((e) => [e.id, e.label])).toEqual([
      ["original", "Original"],
      ["golden-hour", "Golden hour"],
      ["soft-film", "Soft film"],
      ["light-airy", "Light and airy"],
      ["subtle-vintage", "Subtle vintage"],
      ["black-white", "Black and white"],
    ]);
    expect(PHOTO_EFFECT_IDS.every(isPhotoEffect)).toBe(true);
    expect(photoEffectLabel("black-white")).toBe("Black and white");
  });

  it("maps older or unknown names to the closest look", () => {
    expect(normalizeEffectId("sepia")).toBe("subtle-vintage");
    expect(normalizeEffectId("Warm")).toBe("golden-hour");
    expect(normalizeEffectId("bw")).toBe("black-white");
    expect(normalizeEffectId("grayscale")).toBe("black-white");
    expect(normalizeEffectId("light_airy")).toBe("light-airy");
    expect(normalizeEffectId(undefined)).toBe("original");
    expect(normalizeEffectId(42)).toBe("original");
  });

  it("original leaves pixels untouched; every other look changes them", () => {
    for (const id of PHOTO_EFFECT_IDS) {
      const a = sample();
      const b = sample();
      gradePixels(b, 32, 24, id);
      expect(id === "original" ? Array.from(b) : []).toEqual(
        id === "original" ? Array.from(a) : [],
      );
      if (id !== "original") expect(Array.from(b)).not.toEqual(Array.from(a));
    }
  });

  it("is deterministic and keeps alpha", () => {
    for (const id of PHOTO_EFFECT_IDS) {
      const a = sample();
      const b = sample();
      gradePixels(a, 32, 24, id);
      gradePixels(b, 32, 24, id);
      expect(Array.from(a)).toEqual(Array.from(b));
      for (let i = 3; i < a.length; i += 4) expect(a[i]).toBe(255);
    }
  });

  it("black and white has equal channels; golden hour is warmer; airy is brighter", () => {
    const mid = () => new Uint8ClampedArray([128, 128, 128, 255, 90, 120, 160, 255]);
    const bw = mid();
    gradePixels(bw, 2, 1, "black-white");
    expect(bw[0]).toBe(bw[1]);
    expect(bw[1]).toBe(bw[2]);
    expect(bw[4]).toBe(bw[5]);
    const gh = mid();
    gradePixels(gh, 2, 1, "golden-hour");
    expect((gh[0] as number) - (gh[2] as number)).toBeGreaterThan(10);
    const air = mid();
    gradePixels(air, 2, 1, "light-airy");
    expect(air[0] as number).toBeGreaterThan(150);
  });

  it("has no metadata or network use", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("src/passport/keepsake/filter-effects.ts", "utf8");
    expect(src).not.toMatch(
      /fetch\(|XMLHttpRequest|localStorage|sessionStorage|Math\.random|webgl2?"/i,
    );
  });
});
