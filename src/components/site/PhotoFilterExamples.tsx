// Finished keepsake examples, drawn by the real keepsake renderer from real CC0 dog photographs (credits in
// docs/IMAGE-CREDITS.md). Each item shows "Your photo" next to "Your little keepsake" in fixed-ratio boxes, so nothing
// jumps while images load. Examples, not customer stories. Renders nothing while the list is empty.
import "@/design/examples.css";

export type ExampleImage = {
  src: string;
  alt: string;
  label?: string;
  width?: number;
  height?: number;
  /** The original photo the keepsake was made from. */
  before?: { src: string; alt: string; width?: number; height?: number };
  /** Photographer, shown in the small credits disclosure ("Photo by <author>, CC0, via Wikimedia Commons"). */
  credit?: { author: string; url: string };
  /** An illustration rather than a keepsake made from a photo. */
  illustration?: boolean;
};

export const BEFORE_LABEL = "Your photo";
export const AFTER_LABEL = "Your little keepsake";

export function PhotoFilterExamples({
  images,
  caption = "Examples of the photo keepsakes",
  compact = false,
}: {
  images: readonly (string | ExampleImage)[];
  caption?: string;
  /** A smaller sideways row (purchase page) instead of the larger grid (home). */
  compact?: boolean;
}) {
  if (images.length === 0) return null;
  const items: ExampleImage[] = images.map((it) =>
    typeof it === "string" ? { src: it, alt: "" } : it,
  );
  const credited = items.filter((e) => e.credit);
  return (
    <figure className={compact ? "kx kx-compact" : "kx"}>
      <ul className="kx-row" tabIndex={0} aria-label="Keepsake examples">
        {items.map((e, i) => (
          <li key={e.src} className="kx-item">
            <div className={e.before ? "kx-pair" : "kx-pair kx-solo"}>
              {e.before && (
                <span className="kx-side kx-before">
                  <span className="kx-box kx-fill">
                    <img
                      src={e.before.src}
                      alt={e.before.alt}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      width={e.before.width ?? 360}
                      height={e.before.height ?? 640}
                    />
                  </span>
                  <span className="kx-tag">{BEFORE_LABEL}</span>
                </span>
              )}
              <span className="kx-side kx-after">
                <span
                  className="kx-box"
                  style={{ aspectRatio: `${e.width ?? 540} / ${e.height ?? 960}` }}
                >
                  <img
                    src={e.src}
                    alt={e.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    width={e.width ?? 540}
                    height={e.height ?? 960}
                  />
                </span>
                <span className="kx-tag">{e.before ? AFTER_LABEL : (e.label ?? "")}</span>
              </span>
            </div>
            {e.label && e.before && <span className="kx-label">{e.label}</span>}
          </li>
        ))}
      </ul>
      <figcaption>{caption}</figcaption>
      {credited.length > 0 && (
        <details className="kx-credits">
          <summary>Photo credits</summary>
          <ul>
            {credited.map((e) => (
              <li key={e.src}>
                {e.label}: Photo by{" "}
                <a href={e.credit!.url} rel="noopener noreferrer" target="_blank">
                  {e.credit!.author}
                </a>
                , CC0, via Wikimedia Commons.
              </li>
            ))}
          </ul>
        </details>
      )}
    </figure>
  );
}
