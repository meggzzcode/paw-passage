// A compact "what you get" strip next to the price card on the purchase page: three real keepsake examples, a few
// collectible stamps and badges in full colour (the paid ones wear the Full Passport ribbon) and one collection world.
// Decorative: every piece is explained in text elsewhere on the page, so the strip itself is hidden from assistive tech
// except for one summary line.
import { StampArt } from "@/components/passport/art/StampArt";
import { BadgeArt } from "@/components/passport/art/BadgeArt";
import { PURCHASE_EXAMPLES } from "./keepsake-examples";
import { WORLDS } from "@/passport/worlds";
import { AFTER_LABEL } from "./PhotoFilterExamples";
import "@/design/purchase-strip.css";

const KEEPSAKES = PURCHASE_EXAMPLES.slice(0, 3);
const WORLD = WORLDS[0];

export function PurchaseStrip() {
  return (
    <div className="ps-strip" data-testid="purchase-strip">
      <p className="ps-sum">
        A peek at what is inside: keepsakes, stamps and badges to collect, and collections to
        explore.
      </p>
      <ul className="ps-row" aria-hidden="true">
        {KEEPSAKES.map((k) => (
          <li key={k.src} className="ps-keep">
            <img
              src={k.src}
              alt=""
              width={54}
              height={96}
              loading="eager"
              decoding="async"
              data-testid="ps-keepsake"
            />
          </li>
        ))}
        {WORLD && (
          <li className="ps-world">
            <img src={WORLD.image} alt="" width={96} height={96} loading="eager" decoding="async" />
          </li>
        )}
      </ul>
      <ul className="ps-row ps-art" aria-hidden="true">
        <li>
          <StampArt id="first-adventure" state="earned" size={52} />
        </li>
        <li>
          <StampArt id="beach-explorer" state="full-passport" size={52} />
        </li>
        <li>
          <StampArt id="trail-blazer" state="full-passport" size={52} />
        </li>
        <li>
          <BadgeArt id="milestone-10" state="full-passport" size={52} />
        </li>
      </ul>
      <p className="ps-cap">
        {AFTER_LABEL} examples and sample stamps. Stamps with a ribbon come with the full Passport.
      </p>
    </div>
  );
}
