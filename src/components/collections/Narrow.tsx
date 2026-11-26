// A small narrowing control for one collection's list. Only facts both an adventure and a public preview carry.
import { useState } from "react";

export type Narrowable = {
  minutesMax: number;
  costMax: number;
  setting: "indoor" | "outdoor" | "either";
};
export type NarrowKey = "quick" | "free" | "indoor";

const OPTIONS: { key: NarrowKey; label: string }[] = [
  { key: "quick", label: "Under 30 minutes" },
  { key: "free", label: "Costs nothing" },
  { key: "indoor", label: "Indoors" },
];

const test: Record<NarrowKey, (x: Narrowable) => boolean> = {
  quick: (x) => x.minutesMax <= 30,
  free: (x) => x.costMax === 0,
  indoor: (x) => x.setting === "indoor" || x.setting === "either",
};

export function narrow<T extends Narrowable>(items: readonly T[], on: ReadonlySet<NarrowKey>): T[] {
  return items.filter((i) => [...on].every((k) => test[k](i)));
}

export function useNarrow() {
  const [on, setOn] = useState<ReadonlySet<NarrowKey>>(new Set());
  const toggle = (k: NarrowKey) =>
    setOn((cur) => {
      const next = new Set(cur);
      if (!next.delete(k)) next.add(k);
      return next;
    });
  return { on, toggle, clear: () => setOn(new Set()) };
}

export function NarrowBar({
  on,
  toggle,
  clear,
  shown,
  of,
}: {
  on: ReadonlySet<NarrowKey>;
  toggle: (k: NarrowKey) => void;
  clear: () => void;
  shown: number;
  of: number;
}) {
  return (
    <div className="co-narrow" role="group" aria-label="Narrow this list">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          className="pa-chip"
          aria-pressed={on.has(o.key)}
          onClick={() => toggle(o.key)}
        >
          {o.label}
        </button>
      ))}
      <p className="pa-fine" role="status" aria-live="polite">
        {on.size > 0 ? `Showing ${shown} of ${of}. ` : ""}
        {on.size > 0 && (
          <button type="button" className="pa-linkbtn" onClick={clear}>
            Clear
          </button>
        )}
      </p>
    </div>
  );
}
