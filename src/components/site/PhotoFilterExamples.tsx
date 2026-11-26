// Finished keepsake examples, drawn by the real keepsake editor from real, licensed dog photographs (credits in
// docs/IMAGE-CREDITS.md). Each item can show the original photo ("before") next to the finished keepsake ("after").
// They are examples, not customer stories. Renders nothing while the list is empty, so no placeholder ever shows.
export type ExampleImage = {
  src: string;
  alt: string;
  label?: string;
  width?: number;
  height?: number;
  /** The original photo the keepsake was made from. */
  before?: { src: string; alt: string; width?: number; height?: number };
};

export function PhotoFilterExamples({
  images,
  caption = "Examples of the photo keepsakes",
}: {
  images: readonly (string | ExampleImage)[];
  caption?: string;
}) {
  if (images.length === 0) return null;
  return (
    <figure className="pp-examples">
      <ul className="pp-examples-row">
        {images.map((it) => {
          const e: ExampleImage = typeof it === "string" ? { src: it, alt: "" } : it;
          return (
            <li key={e.src}>
              <div className={e.before ? "pp-examples-pair" : undefined}>
                {e.before && (
                  <span className="pp-examples-side">
                    <img
                      src={e.before.src}
                      alt={e.before.alt}
                      loading="lazy"
                      decoding="async"
                      width={e.before.width ?? 160}
                      height={e.before.height ?? 200}
                    />
                    <span className="pp-examples-tag">Original photo</span>
                  </span>
                )}
                <span className="pp-examples-side">
                  <img
                    src={e.src}
                    alt={e.alt}
                    loading="lazy"
                    decoding="async"
                    width={e.width ?? 160}
                    height={e.height ?? 200}
                  />
                  {e.before && <span className="pp-examples-tag">Finished keepsake</span>}
                </span>
              </div>
              {e.label && <span className="pp-examples-label">{e.label}</span>}
            </li>
          );
        })}
      </ul>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
