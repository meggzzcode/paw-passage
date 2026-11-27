import picnicImg from "@/assets/everyday/picnic.jpg";
import puppyImg from "@/assets/everyday/puppy.jpg";

/** Two tilted polaroids for the brand pages. Decorative illustrations, so the images carry no alt text; the note says so. */
export function StoryStrip() {
  return (
    <>
      <div className="ws-strip" aria-hidden="true">
        <figure>
          <img src={picnicImg} alt="" width={1024} height={1280} loading="lazy" />
          <figcaption>sunday picnic</figcaption>
        </figure>
        <figure>
          <img src={puppyImg} alt="" width={1024} height={1024} loading="lazy" />
          <figcaption>first puddle!</figcaption>
        </figure>
      </div>
      <p className="ws-strip-note">
        Illustrative images only. They are not photos of real dogs, people or completed adventures.
      </p>
    </>
  );
}
