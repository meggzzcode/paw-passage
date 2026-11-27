// The three non-result states of every previews surface, kept distinct on purpose: loading (neutral), a FAILED request
// (calm error with Retry, never "no previews") and a catalogue that genuinely has nothing to show.
import type { ReactNode } from "react";

export const PREVIEWS_ERROR_COPY = "Having a little trouble loading the previews. Let's try again.";
export const PREVIEWS_NONE_COPY = "No previews are published yet. Please check back soon.";
export const PREVIEWS_NO_MATCH_COPY = "No previews match these filters yet.";

export function PreviewsLoading({ label = "Loading previews..." }: { label?: string }) {
  return (
    <p className="pa-fine" role="status" aria-busy="true" data-testid="previews-loading">
      {label}
    </p>
  );
}

export function PreviewsError({
  retry,
  className = "pa-card",
  children,
}: {
  retry?: (() => void) | undefined;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className} role="status" data-testid="previews-error">
      <p>{PREVIEWS_ERROR_COPY}</p>
      <div className="pa-row">
        <button type="button" className="pp-btn pp-btn-secondary" onClick={() => retry?.()}>
          Retry
        </button>
      </div>
      {children}
    </div>
  );
}
