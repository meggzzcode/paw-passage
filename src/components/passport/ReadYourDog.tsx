// App-level safety card shown on every revealed adventure card. The standing line and the
// walk-away line are always visible; the plain-words signs sit in a native <details> so the
// control works without JavaScript, by keyboard and by touch, and never depends on hover.
// General information from public guidance. Not veterinary advice.

export const WALK_AWAY_LINE = "Your dog can walk away at any time. Ending early is a good ending.";
export const STANDING_LINE =
  "General information from public guidance. Not veterinary advice. Ask your vet about your dog.";

export const DOG_SIGNS = {
  relaxed: "Soft, loose body. Easy sniffing. Moves about freely and comes back by choice.",
  unsure:
    "Lip licking, yawning, turning away, slowing down, a tucked tail. Make it easier or pause.",
  space:
    "Stiffening, freezing, growling, hiding, pulling away. Stop, give space and let your dog leave.",
} as const;

export function ReadYourDog() {
  return (
    <section className="pa-ryd" aria-label="Read your dog">
      <details>
        <summary>Read your dog</summary>
        <dl className="pa-ryd-signs">
          <div>
            <dt>Relaxed</dt>
            <dd>{DOG_SIGNS.relaxed}</dd>
          </div>
          <div>
            <dt>Unsure</dt>
            <dd>{DOG_SIGNS.unsure}</dd>
          </div>
          <div>
            <dt>Needs space now</dt>
            <dd>{DOG_SIGNS.space}</dd>
          </div>
        </dl>
      </details>
      <p className="pa-ryd-walk">{WALK_AWAY_LINE}</p>
      <p className="pa-ryd-standing">{STANDING_LINE}</p>
    </section>
  );
}
