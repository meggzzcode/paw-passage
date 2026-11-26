// Finished keepsake examples, drawn by the real keepsake renderer with original sample art (an illustrated sample
// dog, not a customer). Pass image paths (for example "/examples/filter-1.jpg") or described items. Renders nothing
// while the list is empty, so no placeholder ever shows.
export type ExampleImage = {
  src: string;
  alt: string;
  label?: string;
  width?: number;
  height?: number;
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
              <img
                src={e.src}
                alt={e.alt}
                loading="lazy"
                width={e.width ?? 160}
                height={e.height ?? 200}
              />
              {e.label && <span className="pp-examples-label">{e.label}</span>}
            </li>
          );
        })}
      </ul>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
