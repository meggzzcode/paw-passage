const v = (n: string) => `var(--em-${n})`;

const COLORS: [string, string, string][] = [
  ["vanilla", "Page background", "Default canvas"],
  ["paper", "Cards & screens", "Surfaces above vanilla"],
  ["ink", "Text & dark bands", "Body text, marquee, tab bar"],
  ["cherry", "Primary action", "One per view: buy, next, start"],
  ["strawberry", "Romance & dates", "Collections, mystery band"],
  ["butter", "Highlight & reward", "Price, stamps, active tab"],
  ["sage", "Calm & outdoors", "Keepsakes band, success"],
  ["powder", "Info & quiz", "Quiz panel, filters, notes"],
  ["leaf", "Passport cover", "Deep accent, certificates"],
];

const ROWS: [string, string][] = [
  ["Typography", "Display: Bricolage Grotesque 700–800, tight tracking (-0.035em), line-height 0.95. Body: Figtree 400/600/700 at 16px minimum, line-height 1.55. Handwritten: Caveat for short accents only — never for instructions, prices or buttons."],
  ["Spacing", "Sections 5rem vertical (3rem on mobile). Content width 1180px with 1.25rem gutters. Card padding 1.1–1.4rem. Gaps step .4 / .8 / 1.2 / 2 / 2.5rem."],
  ["Buttons", "Pill shape, 44px+ tall. Primary = cherry on paper text. Ghost = paper with a soft ink outline. Small screen buttons keep 2.75rem minimum height."],
  ["Cards", "Paper surface, 1.75rem radius, soft long shadow. Image on top at 4:3, colored collection tag, plain-text chips for time / cost / setting."],
  ["Collections", "Each collection owns one tone (strawberry, butter, sage or powder) used on its tile, tag and header. Tone comes from mood, not ranking."],
  ["Illustrations & stamps", "Round stamps with a double inner ring in the collection tone. Empty slots use a dashed outline with a handwritten prompt. Organic stickers sparingly — max one per composition."],
  ["Icons", "Simple line icons at text size. Emoji avoided in UI; a single ✿ or ♡ is the brand flourish."],
  ["Photo treatments", "Real dog photos with warm light. Instant-photo frames (paper border, deeper bottom, tape), slight rotation of −6° to 6°. Crop with object-fit: cover; keep the dog's face in the upper two-thirds."],
  ["Keepsakes", "Magazine cover, postcard, trading card, detective card, certificate, scrapbook. Made on the customer's device; examples are labeled as examples."],
  ["Responsive", "Designed at 320, 390, 768 and 1280px. Grids collapse to one column below 760px; collages shorten instead of shrinking type. No horizontal overflow; carousels scroll inside their own track."],
  ["Motion", "Hover lift of 2–4px, slight card tilt, marquee and scratch fade. Everything decorative stops under prefers-reduced-motion."],
  ["Accessibility", "Ink on vanilla/paper and ink on every pastel passes WCAG AA for body text; paper on cherry for buttons. Scratch card also reveals on tap or Enter. Visible focus rings, 44px touch targets, real alt text on keepsake examples."],
];

export function ConceptSystem() {
  return (
    <div className="em">
      <p className="em-concept-note">Design concept “Everyday Magic” · design system · not the live product · <a href="/concept" style={{ textDecoration: "underline" }}>Homepage concept</a> · <a href="/concept-journey" style={{ textDecoration: "underline" }}>Customer journey</a></p>
      <section className="em-section">
        <div className="em-wrap" style={{ display: "grid", gap: "3rem" }}>
          <div><p className="em-eyebrow">design handoff</p><h1 style={{ fontSize: "clamp(2.6rem,7vw,5rem)" }}>The Everyday Magic system.</h1></div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <h2 style={{ fontSize: "2.2rem" }}>Color tokens</h2>
            <div className="em-swatches">
              {COLORS.map(([n, role, use]) => (
                <div key={n} className="em-swatch"><div style={{ background: v(n) }} /><p><strong>--em-{n}</strong><br />{role}<br /><span style={{ color: v("ink-soft") }}>{use}</span></p></div>
              ))}
            </div>
            <p className="em-meta">Hierarchy: vanilla and paper carry most of the page, one pastel per section, cherry reserved for the main action.</p>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <h2 style={{ fontSize: "2.2rem" }}>Type & buttons</h2>
            <p style={{ fontFamily: v("display"), fontSize: "3rem", fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1 }}>More little adventures.</p>
            <p style={{ fontSize: "1.1rem" }}>Body copy in Figtree keeps things friendly and easy to read on a phone.</p>
            <p className="em-hand" style={{ fontSize: "1.7rem", color: v("cherry") }}>a handwritten note, for flavor only</p>
            <div className="em-row"><a href="#top" className="em-btn em-btn-primary">Primary action</a><a href="#top" className="em-btn em-btn-ghost">Secondary</a></div>
          </div>

          <div className="em-doc">
            <h2 style={{ fontSize: "2.2rem" }}>Guidelines</h2>
            <table><tbody>{ROWS.map(([k, d]) => <tr key={k}><th scope="row" style={{ width: "28%" }}>{k}</th><td>{d}</td></tr>)}</tbody></table>
          </div>
        </div>
      </section>
    </div>
  );
}
