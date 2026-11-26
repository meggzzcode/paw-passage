import type { KeyboardEvent } from "react";

export type DiscoverMode = "made" | "surprise" | "browse";
export const DISCOVER_MODES: { id: DiscoverMode; label: string }[] = [
  { id: "made", label: "Made for You" },
  { id: "surprise", label: "Surprise Me" },
  { id: "browse", label: "Browse All" },
];
export const tabId = (m: DiscoverMode) => `discover-tab-${m}`;
export const panelId = (m: DiscoverMode) => `discover-panel-${m}`;

/** Accessible tab strip (arrow keys move between tabs). The page renders the matching tabpanel. */
export function DiscoverTabs({
  mode,
  onChange,
}: {
  mode: DiscoverMode;
  onChange: (m: DiscoverMode) => void;
}) {
  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = DISCOVER_MODES.length;
    const next =
      e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i + n - 1) % n : null;
    if (next === null) return;
    e.preventDefault();
    const m = DISCOVER_MODES[next]!.id;
    onChange(m);
    document.getElementById(tabId(m))?.focus();
  }
  return (
    <div className="pd-tabs" role="tablist" aria-label="Ways to discover adventures">
      {DISCOVER_MODES.map((t, i) => (
        <button
          key={t.id}
          id={tabId(t.id)}
          type="button"
          role="tab"
          aria-selected={mode === t.id}
          aria-controls={panelId(t.id)}
          tabIndex={mode === t.id ? 0 : -1}
          className="pd-tab"
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
