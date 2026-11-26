import "@/design/journal.css";
import { ctxPresets, type CtxKey } from "@/passport/journal-context";

/** Visible, removable "Starting from: Rainy day" chip. */
export function CtxChip({ ctx, onClear }: { ctx: CtxKey; onClear: () => void }) {
  const label = ctxPresets[ctx].label;
  return (
    <p className="jn-ctx-chip" role="status">
      <span>Starting from: {label}</span>
      <button type="button" onClick={onClear} aria-label={`Remove the starting point: ${label}`}>
        Remove
      </button>
    </p>
  );
}
