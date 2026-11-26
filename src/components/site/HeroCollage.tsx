import picnicImg from "@/assets/everyday/picnic.jpg";
import dateImg from "@/assets/everyday/date.jpg";
import puppyImg from "@/assets/everyday/puppy.jpg";

/** The home hero's polaroid collage and its honesty note (decorative, shared by the visitor and returning-customer homes). */
export function HeroCollage() {
  return (
    <>
      <div className="pp-collage" aria-hidden="true">
        <figure
          className="pp-polaroid"
          style={{ width: "58%", height: "78%", left: "4%", top: "4%", rotate: "-5deg" }}
        >
          <span className="pp-tape" />
          <img src={picnicImg} alt="" width={1024} height={1280} />
          <span>sunday picnic</span>
        </figure>
        <figure
          className="pp-polaroid"
          style={{ width: "44%", height: "46%", right: "2%", top: "0%", rotate: "6deg" }}
        >
          <img src={dateImg} alt="" width={1024} height={1024} loading="lazy" />
          <span>coffee date ☕</span>
        </figure>
        <figure
          className="pp-polaroid"
          style={{
            width: "42%",
            height: "44%",
            right: "6%",
            bottom: "0%",
            rotate: "-3deg",
          }}
        >
          <img src={puppyImg} alt="" width={1024} height={1024} loading="lazy" />
          <span>first puddle!</span>
        </figure>
        <div className="pp-sticker">
          Little
          <br />
          moments.
          <br />
          Big
          <br />
          memories.
        </div>
      </div>
      <p className="pp-collage-note">
        Illustrative images only. They are not photos of real dogs, people or completed adventures.
      </p>
    </>
  );
}
