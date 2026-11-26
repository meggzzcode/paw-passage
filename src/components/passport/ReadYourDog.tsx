// App-level safety copy for revealed adventure cards. One small muted line is always visible under the card.
// Everything else sits in ONE collapsed "Good to know" disclosure: the adventure's own safety lines plus the
// "Read your dog" signs. It is a native <details>, so it works without JavaScript, by keyboard and by touch,
// and never depends on hover. General guidance from public sources. Not veterinary advice.

/** The one standing line under every revealed card (the walk-away line and the not-vet-advice line, merged). */
export const SAFETY_LINE = "General guidance, not veterinary advice.";

/** One short line that says what "Read your dog" is, wherever it appears. */
export const RYD_EXPLAINER =
  "Read your dog: three quick signs of how your dog feels, so you know when to ease off.";

export const DOG_SIGNS = {
  relaxed: "Loose body, easy sniffing, comes back by choice.",
  unsure: "Lip licking, yawning, turning away, a tucked tail. Make it easier or pause.",
  space: "Stiffening, freezing, growling, hiding. Stop and let your dog leave.",
} as const;

/** The three signs, as a short definition list. Used inside "Good to know" and on the trust pages. */
export function DogSigns() {
  return (
    <div className="pa-ryd">
      <p className="pa-ryd-what">
        <strong>Read your dog.</strong> {RYD_EXPLAINER.replace("Read your dog: ", "")}
      </p>
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
          <dt>Needs space</dt>
          <dd>{DOG_SIGNS.space}</dd>
        </div>
      </dl>
    </div>
  );
}

/** The single collapsed safety block of a revealed card: the adventure's 1-3 lines, then the signs. */
export function GoodToKnow({ lines }: { lines: readonly string[] }) {
  return (
    <details className="pa-gtk">
      <summary>Good to know</summary>
      <div className="pa-gtk-body">
        {lines.length > 0 && (
          <ul className="pa-gtk-lines" aria-label="Safety for this adventure">
            {lines.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
        <DogSigns />
      </div>
    </details>
  );
}

/** The small muted line that is always visible under a revealed card. */
export function SafetyLine() {
  return <p className="pa-safety-line">{SAFETY_LINE}</p>;
}
