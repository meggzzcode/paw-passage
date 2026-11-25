import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  FOOTER_TEXT,
  cleanText,
  coverRect,
  keepsakeSize,
  renderKeepsake,
  shareBlob,
  wrapText,
  type KeepsakeSpec,
} from "../passport/keepsake/render";

type Call = { op: string; args: unknown[]; font: string; align: string };

function fakeCtx() {
  const calls: Call[] = [];
  const state: { font: string; textAlign: string; [k: string]: unknown } = {
    font: "10px serif",
    textAlign: "left",
  };
  const rec =
    (op: string) =>
    (...args: unknown[]) => {
      calls.push({ op, args, font: String(state.font), align: String(state.textAlign) });
    };
  const target: Record<string, unknown> = {
    measureText: (s: string) => {
      const size = Number(/(\d+(?:\.\d+)?)px/.exec(String(state.font))?.[1] ?? 10);
      return { width: Array.from(s).length * size * 0.5 };
    },
  };
  for (const op of [
    "save",
    "restore",
    "fillRect",
    "strokeRect",
    "beginPath",
    "moveTo",
    "lineTo",
    "arc",
    "closePath",
    "fill",
    "stroke",
    "clip",
    "rect",
    "fillText",
    "drawImage",
    "translate",
    "rotate",
    "setLineDash",
    "quadraticCurveTo",
  ])
    target[op] = rec(op);
  const ctx = new Proxy(target, {
    get: (t, k: string) => (k in t ? t[k] : state[k]),
    set: (_t, k: string, v) => {
      state[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  const texts = () =>
    calls
      .filter((c) => c.op === "fillText")
      .map((c) => {
        const size = Number(/(\d+(?:\.\d+)?)px/.exec(c.font)?.[1] ?? 10);
        const text = String(c.args[0]);
        return {
          text,
          x: Number(c.args[1]),
          w: Array.from(text).length * size * 0.5,
          align: c.align,
        };
      });
  return { ctx, calls, texts };
}

const specs: KeepsakeSpec[] = [
  {
    template: "postcard",
    dogName: "Biscuit",
    title: "The Great Toy Showdown",
    date: "12 May 2026",
    memory: "He won by a nose.",
  },
  {
    template: "certificate",
    dogName: "Biscuit",
    title: "Toy Champion Showdown",
    certificateKind: "toy-champion",
  },
  {
    template: "certificate",
    dogName: "Biscuit",
    title: "Backyard Explorer",
    certificateKind: "explorer",
  },
  {
    template: "milestone-card",
    dogName: "Biscuit",
    title: "Ten Stamps",
    stampCount: 10,
    stampSlugs: ["first-adventure", "trail-blazer"],
  },
  {
    template: "milestone-card",
    variant: "story",
    dogName: "Biscuit",
    title: "Ten Stamps",
    stampCount: 10,
    stampSlugs: ["first-adventure", "trail-blazer"],
  },
];

const [POSTCARD, CERT, CERT2, MS, STORY] = specs as [
  KeepsakeSpec,
  KeepsakeSpec,
  KeepsakeSpec,
  KeepsakeSpec,
  KeepsakeSpec,
];
void CERT2;
void MS;
void STORY;

describe("keepsake renderer", () => {
  it("sizes each template", () => {
    expect(keepsakeSize({ template: "postcard" })).toEqual({ width: 1500, height: 1000 });
    expect(keepsakeSize({ template: "certificate" })).toEqual({ width: 1080, height: 1350 });
    expect(keepsakeSize({ template: "milestone-card" })).toEqual({ width: 1080, height: 1080 });
    expect(keepsakeSize({ template: "milestone-card", variant: "story" })).toEqual({
      width: 1080,
      height: 1920,
    });
  });

  it.each(specs)("$template ($variant) draws the dog name, title and footer", (spec) => {
    const { ctx, texts } = fakeCtx();
    renderKeepsake(ctx, spec);
    const all = texts()
      .map((t) => t.text)
      .join("\n");
    expect(all).toContain("Biscuit");
    expect(all).toContain(spec.title.split(" ")[0]);
    expect(all).toContain(FOOTER_TEXT);
  });

  it("postcard includes date and memory", () => {
    const { ctx, texts } = fakeCtx();
    renderKeepsake(ctx, POSTCARD);
    const all = texts()
      .map((t) => t.text)
      .join("\n");
    expect(all).toContain("12 May 2026");
    expect(all).toContain("He won by a nose.");
  });

  it("cuts the memory to 140 characters and wraps it inside the column", () => {
    const { ctx, texts } = fakeCtx();
    renderKeepsake(ctx, { ...POSTCARD, memory: "word ".repeat(100) });
    const memLines = texts().filter((t) => t.text.startsWith("word"));
    expect(memLines.length).toBeGreaterThan(1);
    expect(memLines.join("").length).toBeLessThanOrEqual(200);
    const total = memLines
      .map((l) => l.text)
      .join(" ")
      .replace(/\s/g, "").length;
    expect(total).toBeLessThanOrEqual(112); // 140 chars minus spaces
    for (const l of memLines) expect(l.w).toBeLessThanOrEqual(580);
  });

  it("keeps every line of every template inside the canvas, even with hostile inputs", () => {
    const hostile = [
      "",
      "A".repeat(500),
      "Supercalifragilisticexpialidocious".repeat(6),
      "word ".repeat(200),
      '<script>alert(1)</script> & "quotes"',
    ];
    for (const spec of specs) {
      for (const text of hostile) {
        const { ctx, texts } = fakeCtx();
        const bad = { ...spec, dogName: text, title: text, memory: text, date: text };
        expect(() => renderKeepsake(ctx, bad)).not.toThrow();
        const { width } = keepsakeSize(bad);
        for (const t of texts()) {
          const left = t.align === "center" ? t.x - t.w / 2 : t.align === "right" ? t.x - t.w : t.x;
          expect(left, `${spec.template} "${t.text.slice(0, 20)}"`).toBeGreaterThanOrEqual(0);
          expect(left + t.w).toBeLessThanOrEqual(width);
        }
      }
    }
  });

  it("never throws on missing optional fields or junk values", () => {
    const { ctx } = fakeCtx();
    const junk = [
      { template: "postcard", dogName: undefined, title: undefined },
      {
        template: "milestone-card",
        dogName: "x",
        title: "y",
        stampCount: -4,
        stampSlugs: [1, null, "a"],
      },
      { template: "milestone-card", dogName: "x", title: "y", stampCount: Number.NaN },
      { template: "certificate", dogName: 5, title: {} },
    ] as unknown as KeepsakeSpec[];
    for (const s of junk) expect(() => renderKeepsake(ctx, s)).not.toThrow();
  });

  it("falls back to a default dog name when blank or emoji-only", () => {
    const { ctx, texts } = fakeCtx();
    renderKeepsake(ctx, { ...CERT, dogName: "\u{1F436}\u{1F43E}  " });
    expect(
      texts()
        .map((t) => t.text)
        .join("\n"),
    ).toContain("Your Dog");
  });

  it("draws a supplied photo cover-fit and a placeholder otherwise", () => {
    const photo = { width: 4000, height: 3000 } as unknown as ImageBitmap;
    const a = fakeCtx();
    renderKeepsake(a.ctx, POSTCARD, { photo });
    const draw = a.calls.find((c) => c.op === "drawImage")!;
    const [, sx, sy, sw, sh, , , dw, dh] = draw.args as [
      unknown,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ];
    expect(sw / sh).toBeCloseTo(dw / dh, 5);
    expect(sx).toBeGreaterThan(0);
    expect(sy).toBeCloseTo(0, 6);
    expect(sw).toBeLessThanOrEqual(4000);
    const b = fakeCtx();
    renderKeepsake(b.ctx, POSTCARD);
    expect(b.calls.some((c) => c.op === "drawImage")).toBe(false);
    const zero = fakeCtx();
    expect(() =>
      renderKeepsake(zero.ctx, POSTCARD, { photo: { width: 0, height: 0 } as ImageBitmap }),
    ).not.toThrow();
  });

  it("coverRect centres and never distorts", () => {
    expect(coverRect(1000, 1000, 500, 250)).toEqual({ sx: 0, sy: 250, sw: 1000, sh: 500 });
  });

  it("cleanText strips emoji and control characters", () => {
    expect(cleanText("Rex \u{1F415}‍\u{1F9BA}\u0007 rocks")).toBe("Rex rocks");
    expect(cleanText(42)).toBe("");
    expect(Array.from(cleanText("x".repeat(500), 140))).toHaveLength(140);
  });

  it("wrapText breaks over-long words and respects max width", () => {
    const { ctx } = fakeCtx();
    (ctx as unknown as { font: string }).font = "20px serif";
    const lines = wrapText(ctx, "short " + "W".repeat(80), 200);
    expect(lines.length).toBeGreaterThan(2);
    for (const l of lines) expect(ctx.measureText(l).width).toBeLessThanOrEqual(200);
  });
});

describe("shareBlob", () => {
  it("returns 'download' when file sharing is unsupported", async () => {
    expect(await shareBlob(new Blob(["x"], { type: "image/png" }), "a.png", "hi")).toBe("download");
  });

  it("shares files when the browser allows it, and reports cancellation", async () => {
    const nav = navigator as unknown as { canShare?: unknown; share?: unknown };
    nav.canShare = () => true;
    nav.share = async () => undefined;
    try {
      expect(await shareBlob(new Blob(["x"], { type: "image/png" }), "a.png", "hi")).toBe("shared");
      nav.share = async () => {
        throw new DOMException("no", "AbortError");
      };
      expect(await shareBlob(new Blob(["x"]), "a.png", "hi")).toBe("cancelled");
      nav.canShare = () => false;
      expect(await shareBlob(new Blob(["x"]), "a.png", "hi")).toBe("download");
    } finally {
      delete nav.canShare;
      delete nav.share;
    }
  });
});

describe("keepsake privacy", () => {
  const dir = join(__dirname, "..", "passport", "keepsake");
  const forbidden =
    /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource)\b|https?:\/\/|\baxios\b/;
  it("references no network API or URL anywhere in src/passport/keepsake", () => {
    const files = readdirSync(dir).filter((f) => /\.(ts|tsx|js)$/.test(f));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const src = readFileSync(join(dir, f), "utf8");
      expect(src, f).not.toMatch(forbidden);
    }
  });
  it("revokes object URLs it creates", () => {
    const src = readFileSync(join(dir, "render.ts"), "utf8");
    const creates = (src.match(/createObjectURL/g) ?? []).length;
    const revokes = (src.match(/revokeObjectURL/g) ?? []).length;
    expect(creates).toBeGreaterThan(0);
    expect(revokes).toBeGreaterThanOrEqual(creates);
  });
});
