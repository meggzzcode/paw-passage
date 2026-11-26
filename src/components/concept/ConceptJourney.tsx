import type { ReactNode } from "react";
import picnic from "@/assets/concept/picnic.jpg";
import cozy from "@/assets/concept/cozy.jpg";
import date from "@/assets/concept/date.jpg";
import trail from "@/assets/concept/trail.jpg";
import puppy from "@/assets/concept/puppy.jpg";
import portrait from "@/assets/concept/portrait.jpg";
import { ScratchCard } from "./ScratchCard";

const v = (n: string) => `var(--em-${n})`;

/** Demonstration data only. The engineered app supplies the real content. */
const DOGS = "Maple & Biscuit";

function Screen({ title, kind, children }: { title: string; kind: string; children: ReactNode }) {
  return (
    <section className="em-screen" aria-label={title}>
      <header><h3>{title}</h3><span>{kind}</span></header>
      <div className="em-phone">{children}</div>
    </section>
  );
}

function Btn({ children, tone = "cherry" }: { children: ReactNode; tone?: string }) {
  const fg = tone === "cherry" || tone === "ink" ? "paper" : "ink";
  return <span className="em-mini-btn" style={{ background: v(tone), color: v(fg) }}>{children}</span>;
}

function Group({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="em-section">
      <div className="em-wrap" style={{ display: "grid", gap: "2rem" }}>
        <div><p className="em-eyebrow">{eyebrow}</p><h2 style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)" }}>{title}</h2></div>
        <div className="em-screens">{children}</div>
      </div>
    </section>
  );
}

const MiniCard = ({ img, title, tag, bg, meta }: { img: string; title: string; tag: string; bg: string; meta: string }) => (
  <div className="em-tile" style={{ background: v("vanilla") }}>
    <div className="em-thumb"><img src={img} alt="" loading="lazy" width={1024} height={1024} /></div>
    <span className="em-chip" style={{ background: v(bg), justifySelf: "start", fontWeight: 700 }}>{tag}</span>
    <strong style={{ fontFamily: v("display"), fontSize: "1.15rem", lineHeight: 1.1 }}>{title}</strong>
    <small>{meta}</small>
  </div>
);

export function ConceptJourney() {
  return (
    <div className="em">
      <p className="em-concept-note">Design concept “Everyday Magic” · customer journey · demonstration data only · not the live product · <a href="/concept" style={{ textDecoration: "underline" }}>Homepage concept</a> · <a href="/concept-system" style={{ textDecoration: "underline" }}>Design system</a></p>

      <section className="em-hero" style={{ paddingBottom: "1rem" }}>
        <div className="em-wrap" style={{ display: "grid", gap: "1rem" }}>
          <p className="em-eyebrow">the whole journey</p>
          <h1 style={{ fontSize: "clamp(2.6rem,7vw,5rem)" }}>Every screen, <span className="em-hl" style={{ background: v("butter"), borderRadius: ".3em", padding: "0 .12em" }}>a little magic.</span></h1>
          <p className="em-lede">Visual treatments for each step of the Adventure Passport. Layout and styling only — the existing app keeps its quiz, recommendations, checkout and storage.</p>
          <nav aria-label="Journey sections" className="em-row" style={{ marginTop: ".5rem" }}>
            {[["#browse", "Browse"], ["#start", "Quiz & reveal"], ["#passport", "My Passport"], ["#keepsakes", "Keepsakes"], ["#buy", "Purchase"], ["#read", "Journal & help"], ["#states", "Empty & error"]].map(([h, l]) => <a key={h} href={h} className="em-btn em-btn-ghost" style={{ minHeight: "2.75rem" }}>{l}</a>)}
          </nav>
        </div>
      </section>

      <Group id="browse" eyebrow="finding something to do" title="Browse & discover">
        <Screen title="Main navigation" kind="Mobile + desktop">
          <div className="em-nav-demo"><strong style={{ fontFamily: v("display") }}>Paws &amp; Passage</strong><Btn>Get the passport</Btn></div>
          <p className="em-meta">Desktop: Discover · Collections · Journal · FAQ · My Passport. Mobile keeps the logo, the buy button and a bottom bar.</p>
          <div style={{ flex: 1 }} />
          <div className="em-tabbar" style={{ marginTop: "12rem" }}><span data-on="true">Discover</span><span>Saved</span><span>Passport</span><span>Keepsakes</span></div>
        </Screen>
        <Screen title="Discover" kind="Mobile">
          <h4>Hi Maple &amp; Biscuit ✿</h4>
          <div className="em-field"><span>Search 113 adventures</span><small>⌕</small></div>
          <div className="em-row">{["Free", "Under 30 min", "Indoors", "Rainy day"].map((c) => <span key={c} className="em-chip" style={{ background: v("powder") }}>{c}</span>)}</div>
          <MiniCard img={cozy} title="The great indoor sniffari" tag="Cozy days in" bg="butter" meta="10 min · Free · Indoor" />
        </Screen>
        <Screen title="Collection directory" kind="Mobile">
          <h4>25 collections</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
            {[["Cozy days in", "butter"], ["Doggy dates", "strawberry"], ["Rainy days", "powder"], ["Golden years", "sage"], ["Creative", "strawberry"], ["Weekend", "butter"]].map(([n, bg]) => (
              <div key={n} className="em-tile" style={{ background: v(bg!), minHeight: "6rem", alignContent: "end" }}><strong style={{ fontFamily: v("display"), lineHeight: 1 }}>{n}</strong><small style={{ color: v("ink") }}>adventures inside</small></div>
            ))}
          </div>
        </Screen>
        <Screen title="Individual collection" kind="Mobile">
          <div className="em-tile" style={{ background: v("strawberry") }}><p className="em-hand" style={{ fontSize: "1.3rem" }}>collection</p><h4>Doggy dates</h4><small style={{ color: v("ink") }}>Easy, sweet plans for the two of you.</small></div>
          <MiniCard img={picnic} title="Sunset picnic for two (and a half)" tag="Preview" bg="butter" meta="1–2 hrs · Under $20 · Outdoor" />
          <MiniCard img={date} title="Coffee-shop people-watching" tag="Premium" bg="sage" meta="45 min · Under $10" />
        </Screen>
        <Screen title="Adventure preview" kind="Public · premium preview">
          <div className="em-thumb"><img src={picnic} alt="" loading="lazy" width={1024} height={1024} /></div>
          <h4>Sunset picnic for two (and a half)</h4>
          <div className="em-chips">{["1–2 hrs", "Under $20", "Outdoor", "Leash-friendly"].map((c) => <span key={c} className="em-chip">{c}</span>)}</div>
          <p>Golden hour, a blanket and the snacks you’d both steal. A slow, sweet evening out.</p>
          <p className="em-locked">Full steps, safety notes and a matching keepsake are inside the passport.</p>
          <Btn>Unlock all 113 · $19.99</Btn>
        </Screen>
        <Screen title="Adventure detail" kind="Passport owners">
          <div className="em-thumb"><img src={picnic} alt="" loading="lazy" width={1024} height={1024} /></div>
          <h4>Sunset picnic</h4>
          <div className="em-tile" style={{ background: v("powder") }}><strong>Before you go</strong><small style={{ color: v("ink") }}>Shade and fresh water. Skip hot pavement. Check local leash rules.</small></div>
          <ol style={{ display: "grid", gap: ".4rem", paddingLeft: "1.1rem", listStyle: "decimal" }}><li>Pick a quiet spot an hour before sunset.</li><li>Lay out the blanket, bowl first.</li><li>One photo for the keepsake.</li></ol>
          <div className="em-row"><Btn>Mark done · get stamp</Btn><Btn tone="vanilla">♡ Save</Btn></div>
        </Screen>
      </Group>

      <Group id="start" eyebrow="the free first adventure" title="Quiz, reveal & results">
        <Screen title="Introductory quiz" kind="Question 3 of 8">
          <div className="em-progress">{Array.from({ length: 8 }, (_, i) => <span key={i} data-on={i < 3} />)}</div>
          <small>Question 3 of 8</small>
          <h4>How do your dogs feel about new places?</h4>
          <p className="em-meta">Answer for {DOGS} together — one shared profile.</p>
          {["Love them right away", "Need a little time", "Prefer familiar spots", "Not sure yet"].map((a, i) => (
            <div key={a} className="em-field" style={{ boxShadow: i === 1 ? `inset 0 0 0 3px ${v("cherry")}` : undefined, background: v("paper"), border: `1.5px solid color-mix(in oklab, ${v("ink")} 12%, transparent)` }}>{a}</div>
          ))}
          <div className="em-row" style={{ justifyContent: "space-between" }}><Btn tone="vanilla">Back</Btn><Btn>Next</Btn></div>
        </Screen>
        <Screen title="Mystery reveal" kind="One surface · scratch or tap">
          <div className="em-tile" style={{ background: v("vanilla") }}><strong>Good to know first</strong><small>About 45 min · Free · Outdoors · Leash needed</small></div>
          <ScratchCard />
          <p className="em-meta" style={{ textAlign: "center" }}>Scratch with a finger, or tap the card to reveal.</p>
        </Screen>
        <Screen title="Personalized results" kind="After the reveal">
          <p className="em-hand" style={{ fontSize: "1.4rem", color: v("cherry") }}>picked for {DOGS}</p>
          <MiniCard img={trail} title="Leaf-pile treasure hunt" tag="Your free adventure" bg="butter" meta="45 min · Free · Gentle pace" />
          <p className="em-meta">Why this one: you said gentle pace, outdoors and free.</p>
          <Btn>Start this adventure</Btn>
          <div className="em-tile" style={{ background: v("strawberry") }}><strong>Liked that?</strong><small style={{ color: v("ink") }}>112 more are waiting in the passport.</small></div>
        </Screen>
      </Group>

      <Group id="passport" eyebrow="your collection" title="Saved, planned & stamped">
        <Screen title="Saved adventures" kind="Mobile">
          <h4>Saved · 6</h4>
          {[[cozy, "Indoor sniffari", "butter"], [date, "Coffee-shop date", "strawberry"], [puppy, "Puddle parade", "powder"]].map(([img, t, bg]) => (
            <div key={t} className="em-row" style={{ background: v(bg!), borderRadius: "1rem", padding: ".5rem", flexWrap: "nowrap" }}>
              <div className="em-thumb" style={{ width: "4rem", aspectRatio: "1", flex: "none" }}><img src={img} alt="" loading="lazy" width={1024} height={1024} /></div><strong>{t}</strong>
            </div>
          ))}
        </Screen>
        <Screen title="Custom collections" kind="Make your own">
          <h4>Your collections</h4>
          {[["Sunday slow mornings", "4 adventures", "sage"], ["Birthday week for Maple", "7 adventures", "butter"]].map(([t, n, bg]) => <div key={t} className="em-tile" style={{ background: v(bg!) }}><strong>{t}</strong><small style={{ color: v("ink") }}>{n}</small></div>)}
          <div className="em-field" style={{ border: `2px dashed color-mix(in oklab, ${v("ink")} 25%, transparent)`, background: "transparent", justifyContent: "center" }}>+ New collection</div>
        </Screen>
        <Screen title="My Passport" kind="Stamps">
          <div className="em-cover" style={{ rotate: "0deg", maxWidth: "none", aspectRatio: "auto", padding: "1.2rem" }}><p className="em-hand" style={{ fontSize: "1.3rem" }}>the adventures of</p><h4 style={{ fontSize: "2rem" }}>{DOGS}</h4></div>
          <small>9 stamps collected · 12 stamp types</small>
          <div className="em-stamps">
            {[["Cozy", "butter", "cherry"], ["Date", "strawberry", "cherry"], ["Puddle", "powder", "ink"], ["Trail", "sage", "leaf"], ["Art", "butter", "leaf"]].map(([t, bg, fg]) => <div key={t} className="em-stamp" style={{ background: v(bg!), color: v(fg!) }}>{t}</div>)}
            <div className="em-stamp" data-empty>next?</div>
          </div>
        </Screen>
        <Screen title="Achievements" kind="8 total">
          <h4>Achievements · 3 of 8</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: ".5rem" }}>
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="em-ach" style={i < 3 ? { background: [v("butter"), v("strawberry"), v("sage")][i] } : { boxShadow: `inset 0 0 0 2px color-mix(in oklab, ${v("ink")} 15%, transparent)`, color: v("ink-soft") }}>{i < 3 ? ["First stamp", "Date night", "Rain or shine"][i] : "locked"}</div>)}
          </div>
          <p className="em-meta">Earned quietly — no streaks, no pressure.</p>
        </Screen>
        <Screen title="Calendar planning" kind="Month view">
          <h4>November</h4>
          <div className="em-cal">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <strong key={i}>{d}</strong>)}{Array.from({ length: 28 }, (_, i) => <span key={i} style={[5, 12, 20].includes(i) ? { background: v(["butter", "strawberry", "sage"][[5, 12, 20].indexOf(i)]!), fontWeight: 700 } : undefined}>{i + 1}</span>)}</div>
          <div className="em-tile" style={{ background: v("strawberry") }}><strong>Sat 13 · Sunset picnic</strong><small style={{ color: v("ink") }}>Planned for Maple &amp; Biscuit</small></div>
        </Screen>
      </Group>

      <Group id="keepsakes" eyebrow="made on your device" title="Keepsakes">
        <Screen title="Keepsake gallery" kind="Artwork styles">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
            <div className="em-art" style={{ aspectRatio: "3/4" }}><img src={portrait} alt="Magazine cover keepsake example" loading="lazy" width={1024} height={1280} /><span style={{ position: "absolute", top: ".3rem", left: 0, right: 0, textAlign: "center", fontFamily: v("display"), fontWeight: 800, fontSize: "1.6rem", color: v("butter") }}>BARK</span></div>
            <div className="em-detective"><div className="em-art" style={{ aspectRatio: "1" }}><img src={puppy} alt="Detective card keepsake example" loading="lazy" width={1024} height={1024} /></div><small style={{ color: v("butter") }}>CASE #07 · The Missing Sock</small></div>
            <div className="em-cert" style={{ gridColumn: "span 2" }}><p className="em-hand" style={{ fontSize: "1.3rem" }}>this certifies that</p><strong style={{ fontFamily: v("display"), fontSize: "1.4rem" }}>Maple</strong><small>completed the Great Indoor Sniffari</small></div>
          </div>
        </Screen>
        <Screen title="Keepsake editor" kind="Passport owners only">
          <div className="em-art" style={{ aspectRatio: "4/5" }}><img src={trail} alt="Postcard keepsake being edited" loading="lazy" width={1024} height={1024} /><span className="em-hand" style={{ position: "absolute", bottom: ".6rem", left: ".8rem", fontSize: "1.6rem", color: v("paper") }}>Greetings from the woods!</span></div>
          <div className="em-row">{["Postcard", "Trading card", "Magazine", "Scrapbook"].map((s, i) => <span key={s} className="em-chip" style={{ background: i === 0 ? v("butter") : v("vanilla"), fontWeight: 700 }}>{s}</span>)}</div>
          <div className="em-row"><Btn tone="vanilla">Choose photo</Btn><Btn>Save to device</Btn></div>
          <p className="em-legend">Your photo stays on this device. Nothing is uploaded or stored online.</p>
        </Screen>
        <Screen title="More artwork" kind="Trading card · scrapbook">
          <div className="em-trading" style={{ rotate: "0deg" }}><div className="em-art" style={{ aspectRatio: "1" }}><img src={puppy} alt="Trading card keepsake example" loading="lazy" width={1024} height={1024} /></div><strong style={{ fontFamily: v("display"), fontSize: "1.3rem" }}>Biscuit</strong><small style={{ display: "block" }}>Special move: Puddle Splash</small></div>
          <div className="em-scrap"><div className="em-art" style={{ aspectRatio: "1" }}><img src={date} alt="Scrapbook keepsake example" loading="lazy" width={1024} height={1024} /></div><p className="em-hand" style={{ fontSize: "1.25rem", lineHeight: 1.1 }}>first coffee date, oct 12 ♡</p></div>
          <p className="em-meta">Example images. Customers download their own artwork.</p>
        </Screen>
      </Group>

      <Group id="buy" eyebrow="one little purchase" title="Purchase & welcome">
        <Screen title="Purchase page" kind="Hosted checkout opens next">
          <h4>The complete Adventure Passport</h4>
          <div className="em-tile" style={{ background: v("butter") }}><strong style={{ fontFamily: v("display"), fontSize: "2.4rem" }}>$19.99</strong><small style={{ color: v("ink") }}>Paid once · no subscription · no renewals</small></div>
          <ul style={{ display: "grid", gap: ".35rem" }}>{["113 adventures · 25 collections", "Mystery reveals & personalized picks", "Stamps, achievements & calendar", "Adventure-matched photo keepsakes"].map((x) => <li key={x}>✿ {x}</li>)}</ul>
          <Btn>Continue to secure checkout</Btn>
          <small>Not ready? Your free adventure is still yours.</small>
        </Screen>
        <Screen title="Purchase recovery" kind="Restore access">
          <h4>Already bought it?</h4>
          <p>Enter the email you used at checkout and we’ll help you get back into your passport.</p>
          <div className="em-field" style={{ background: v("paper"), border: `1.5px solid color-mix(in oklab, ${v("ink")} 18%, transparent)` }}>you@example.com</div>
          <Btn>Restore my passport</Btn>
          <p className="em-meta">Visual only — connects to the existing restore flow.</p>
        </Screen>
        <Screen title="Post-purchase welcome" kind="First open">
          <div className="em-tile" style={{ background: v("sage"), textAlign: "center" }}><p className="em-hand" style={{ fontSize: "1.6rem" }}>welcome aboard!</p><h4>Your passport is ready.</h4></div>
          <ol style={{ display: "grid", gap: ".5rem", paddingLeft: "1.1rem", listStyle: "decimal" }}><li>Reveal your next mystery adventure</li><li>Save a few favorites</li><li>Plan one on the calendar</li></ol>
          <Btn>Reveal my first premium adventure</Btn>
        </Screen>
      </Group>

      <Group id="read" eyebrow="reading & help" title="Journal & FAQ">
        <Screen title="Adventure Journal" kind="10 articles">
          <h4>The Adventure Journal</h4>
          <MiniCard img={trail} title="Easy first hikes with a nervous dog" tag="Outdoors" bg="sage" meta="8 min read" />
          <MiniCard img={cozy} title="Rainy-day games that tire them out" tag="At home" bg="powder" meta="6 min read" />
        </Screen>
        <Screen title="Journal article" kind="Reading view">
          <div className="em-thumb" style={{ aspectRatio: "16/9" }}><img src={trail} alt="" loading="lazy" width={1024} height={1024} /></div>
          <h4>Easy first hikes with a nervous dog</h4>
          <small>8 min read</small>
          <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>Start shorter than you think. A twenty-minute loop your dog finishes happy beats a big day that ends in a carry…</p>
          <div className="em-tile" style={{ background: v("butter") }}><strong>Try it as an adventure</strong><small style={{ color: v("ink") }}>Leaf-pile treasure hunt · free</small></div>
        </Screen>
        <Screen title="FAQ" kind="Accordion">
          <h4>Good questions.</h4>
          <div className="em-faq" style={{ display: "grid", gap: ".5rem" }}>
            {[["Is it a subscription?", "No. $19.99, paid once."], ["Is it a physical book?", "No, it’s an interactive digital passport."], ["Where do my photos go?", "Nowhere. Keepsakes are made on your device."]].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </Screen>
      </Group>

      <Group id="states" eyebrow="when things are quiet (or wrong)" title="Empty & error states">
        <Screen title="Empty: saved" kind="No saves yet">
          <div style={{ display: "grid", placeItems: "center", gap: ".8rem", textAlign: "center", paddingTop: "4rem" }}>
            <div className="em-stamp" data-empty style={{ width: "6rem" }}>♡</div>
            <h4>Nothing saved yet</h4><p>Tap the heart on any adventure to keep it here.</p><Btn>Browse adventures</Btn>
          </div>
        </Screen>
        <Screen title="Error: page not found" kind="404">
          <div style={{ display: "grid", placeItems: "center", gap: ".8rem", textAlign: "center", paddingTop: "3rem" }}>
            <div className="em-art" style={{ width: "9rem", aspectRatio: "1", rotate: "-4deg" }}><img src={puppy} alt="" loading="lazy" width={1024} height={1024} /></div>
            <h4>This trail went cold.</h4><p>The page you wanted isn’t here.</p><Btn>Back to Discover</Btn>
          </div>
        </Screen>
        <Screen title="Error: something broke" kind="Retry">
          <div style={{ display: "grid", placeItems: "center", gap: ".8rem", textAlign: "center", paddingTop: "4rem" }}>
            <h4>Hmm, that didn’t load.</h4><p>Check your connection and try again. Your saved adventures are safe on this device.</p><Btn>Try again</Btn>
          </div>
        </Screen>
      </Group>
    </div>
  );
}
