// SLOT for real photo-filter example images. Pass image paths (for example "/examples/filter-1.jpg") and they
// render as a small row. Renders nothing while the list is empty, so no placeholder ever shows.
// Owner: drop real, permitted example images into public/examples/ and pass their paths from the home page.
export function PhotoFilterExamples({
  images,
  caption = "Real examples of the photo filter",
}: {
  images: readonly string[];
  caption?: string;
}) {
  if (images.length === 0) return null;
  return (
    <figure className="pp-examples">
      <ul className="pp-examples-row">
        {images.map((src) => (
          <li key={src}>
            <img src={src} alt="" loading="lazy" width={160} height={200} />
          </li>
        ))}
      </ul>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
