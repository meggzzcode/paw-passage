import picnic from "@/assets/concept/picnic.jpg";
import cozy from "@/assets/concept/cozy.jpg";
import date from "@/assets/concept/date.jpg";
import trail from "@/assets/concept/trail.jpg";
import puppy from "@/assets/concept/puppy.jpg";
import portrait from "@/assets/concept/portrait.jpg";
import { ConceptQuiz } from "./ConceptQuiz";
import { ScratchCard } from "./ScratchCard";

const v = (name: string) => `var(--em-${name})`;

const MOODS = [
  { name: "Cozy days in", bg: "butter", img: cozy, note: "blanket forts & sniff games" },
  { name: "Doggy dates", bg: "strawberry", img: date, note: "pup cups for two" },
  { name: "The Playful Pup", bg: "powder", img: puppy, note: "zoomies, sanctioned" },
  { name: "Weekend adventures", bg: "sage", img: trail, note: "pack the good snacks" },
  { name: "Rainy-day adventures", bg: "powder", img: puppy, note: "puddles optional" },
  { name: "Golden years", bg: "butter", img: trail, note: "slow & sweet" },
  { name: "Family adventures", bg: "sage", img: trail, note: "everyone gets a job" },
  { name: "Creative companions", bg: "strawberry", img: portrait, note: "paw-print art & more" },
];

const CARDS = [
  { title: "The great indoor sniffari", tag: "Cozy days in", tagBg: "butter", img: cozy, chips: ["⏱ 10 min", "Free", "Indoor game", "All ages"], need: "A few treats and a towel" },
  { title: "Sunset picnic for two (and a half)", tag: "Doggy dates", tagBg: "strawberry", img: picnic, chips: ["⏱ 1–2 hrs", "Under $20", "Outdoor date", "Leash-friendly"], need: "Shade, water bowl, a blanket" },
  { title: "Leaf-pile treasure hunt", tag: "Family adventures", tagBg: "sage", img: trail, chips: ["⏱ 45 min", "Free", "Outdoor play", "Gentle pace"], need: "A safe, leash-legal trail" },
];

const FAQ = [
  ["Is it really a one-time purchase?", "Yes. $19.99, paid once. No subscription, no renewals."],
  ["Can I try it first?", "Of course. Take the quiz and unwrap one personalized adventure free — no account needed."],
  ["Are the adventures safe for my dog?", "Each adventure lists time, budget and what your pup needs to enjoy it. You know your dog best — skip anything that doesn't suit them."],
  ["Where do my photos go?", "Keepsakes are made right on your device. Your photos are never uploaded or stored by us."],
  ["Can I give it as a gift?", "We'd love that. Gifting is part of this design and will open when checkout supports it."],
];

export function ConceptPage() {
  return (
    <div className="em">
      <p className="em-concept-note">Design concept “Everyday Magic” · demonstration content only · not the live product</p>

      {/* HERO */}
      <section className="em-hero">
        <div className="em-wrap em-hero-grid">
          <div style={{ display: "grid", gap: "1.6rem" }}>
            <p className="em-eyebrow">Paws &amp; Passage · The Adventure Passport</p>
            <h1>More than walks. More than fetch. More <span className="em-hl">little adventures.</span></h1>
            <p className="em-lede">Make the everyday a little more extraordinary with fun, personalized things to do with your favorite companion.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
              <a href="#quiz" className="em-btn em-btn-primary">Find our first adventure — free</a>
              <a href="#offer" className="em-btn em-btn-ghost">The full passport · $19.99 once</a>
            </div>
            <p className="em-hand" style={{ fontSize: "1.4rem", color: v("ink-soft") }}>no subscription · no sign-up to try ♡</p>
          </div>
          <div className="em-collage" aria-hidden>
            <figure className="em-polaroid" style={{ width: "58%", height: "78%", left: "4%", top: "4%", rotate: "-5deg" }}>
              <span className="em-tape" /><img src={picnic} alt="" width={1024} height={1280} /><figcaption>sunday picnic w/ Maple</figcaption>
            </figure>
            <figure className="em-polaroid" style={{ width: "44%", height: "46%", right: "2%", top: "0%", rotate: "6deg" }}>
              <img src={date} alt="" width={1024} height={1024} loading="lazy" /><figcaption>coffee date ☕</figcaption>
            </figure>
            <figure className="em-polaroid" style={{ width: "42%", height: "44%", right: "6%", bottom: "0%", rotate: "-3deg" }}>
              <img src={puppy} alt="" width={1024} height={1024} loading="lazy" /><figcaption>first puddle!</figcaption>
            </figure>
            <div className="em-sticker" style={{ width: "7.5rem", height: "7.5rem", left: "46%", top: "52%", background: v("butter"), rotate: "12deg", fontSize: "1rem" }}>Little<br />moments.<br />Big<br />memories.</div>
          </div>
        </div>
      </section>

      <div className="em-marquee" aria-hidden><div>{Array(2).fill("Your favorite little sidekick ✿ Let’s make a date ✿ Collect adventures, not just things ✿ Made for the two of you ✿ ").join("")}</div></div>

      {/* MOODS */}
      <section className="em-section">
        <div className="em-wrap" style={{ marginBottom: "2rem" }}>
          <p className="em-eyebrow">ten collections</p>
          <h2 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>What are we in the mood for?</h2>
        </div>
        <div className="em-moods">
          {MOODS.map((m) => (
            <article key={m.name} className="em-mood" style={{ background: v(m.bg) }}>
              <div className="em-mood-img"><img src={m.img} alt="" loading="lazy" width={1024} height={1024} /></div>
              <div><h3>{m.name}</h3><p className="em-hand" style={{ fontSize: "1.3rem" }}>{m.note}</p></div>
            </article>
          ))}
        </div>
      </section>

      {/* CARDS */}
      <section className="em-section" style={{ background: v("paper") }}>
        <div className="em-wrap" style={{ display: "grid", gap: "2rem" }}>
          <div><p className="em-eyebrow">a peek inside</p><h2 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>Adventures worth collecting.</h2></div>
          <div className="em-cards">
            {CARDS.map((c) => (
              <article key={c.title} className="em-card">
                <div className="em-card-top">
                  <img src={c.img} alt="" loading="lazy" width={1024} height={1024} />
                  <span className="em-card-tag" style={{ background: v(c.tagBg) }}>{c.tag}</span>
                </div>
                <div className="em-card-body">
                  <h3>{c.title}</h3>
                  <div className="em-chips">{c.chips.map((x) => <span key={x} className="em-chip">{x}</span>)}</div>
                  <p style={{ fontSize: ".92rem" }}><strong>You’ll need:</strong> {c.need}</p>
                  <p className="em-locked">🔒 Full steps &amp; little extras inside the passport</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section id="quiz" className="em-section">
        <div className="em-wrap" style={{ display: "grid", gap: "2rem" }}>
          <div><p className="em-eyebrow">eight quick questions</p><h2 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>Let’s get to know your sidekick.</h2></div>
          <ConceptQuiz />
        </div>
      </section>

      {/* MYSTERY */}
      <section id="mystery" className="em-section em-mystery">
        <div className="em-wrap em-hero-grid">
          <div style={{ display: "grid", gap: "1.2rem" }}>
            <p className="em-eyebrow" style={{ color: v("ink") }}>the mystery reveal</p>
            <h2 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>A little adventure awaits.</h2>
            <p className="em-lede" style={{ color: v("ink") }}>Scratch or tap to reveal. Like opening a tiny gift — every time you’re not sure what to do today.</p>
          </div>
          <ScratchCard />
        </div>
      </section>

      {/* PASSPORT */}
      <section className="em-section">
        <div className="em-wrap em-passport">
          <div style={{ display: "grid", gap: "1.5rem", justifyItems: "start" }}>
            <p className="em-eyebrow">your adventure passport</p>
            <h2 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>A scrapbook of the two of you.</h2>
            <p className="em-lede">Collect a stamp for every adventure. No streaks, no pressure — just a sweet record of your life together.</p>
            <div className="em-cover">
              <p className="em-hand" style={{ fontSize: "1.5rem" }}>the adventures of</p>
              <h3 style={{ fontSize: "3.2rem" }}>Maple &amp; Me</h3>
              <p style={{ fontSize: ".8rem", letterSpacing: ".2em", textTransform: "uppercase" }}>Paws &amp; Passage · est. 2026</p>
            </div>
          </div>
          <div className="em-book">
            <div className="em-page">
              <p className="em-hand" style={{ fontSize: "1.4rem" }}>stamps collected · 7</p>
              <div className="em-stamps" style={{ marginTop: "1rem" }}>
                {[["Cozy\nday in", "butter", "cherry"], ["First\ndate", "strawberry", "cherry"], ["Puddle\njumper", "powder", "ink"], ["Trail\nblazer", "sage", "leaf"], ["Pup\ncup", "strawberry", "cherry"], ["Art\nstar", "butter", "leaf"], ["Beach\nday", "powder", "ink"]].map(([t, bg, fg]) => (
                  <div key={t} className="em-stamp" style={{ background: v(bg!), color: v(fg!), whiteSpace: "pre-line", rotate: `${(t!.length % 5) * 4 - 8}deg` }}>{t}</div>
                ))}
                <div className="em-stamp" data-empty>next?</div>
                <div className="em-stamp" data-empty>✿</div>
              </div>
            </div>
            <div className="em-page">
              <figure className="em-polaroid" style={{ position: "relative", width: "80%", aspectRatio: "1", rotate: "3deg", margin: "0 auto" }}>
                <span className="em-tape" /><img src={date} alt="" loading="lazy" width={1024} height={1024} />
              </figure>
              <p className="em-hand" style={{ fontSize: "1.45rem", marginTop: "3rem", lineHeight: 1.15 }}>Oct 12 — Maple ate the whole whipped cream and then stole a napkin. 10/10 date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* KEEPSAKES */}
      <section className="em-section" style={{ background: v("sage") }}>
        <div className="em-wrap" style={{ display: "grid", gap: "2.5rem" }}>
          <div><p className="em-eyebrow" style={{ color: v("ink") }}>photo keepsakes · included in the passport</p><h2 style={{ fontSize: "clamp(2.4rem,6vw,4.2rem)" }}>Little moments, made to keep.</h2></div>
          <div className="em-keeps">
            <div className="em-magazine"><img src={portrait} alt="Magazine-style keepsake featuring a smiling dog in a flower crown" loading="lazy" width={1024} height={1280} />
              <div className="em-mast">BARK</div>
              <p className="em-hand" style={{ position: "absolute", bottom: "1rem", left: "1rem", color: v("butter"), fontSize: "1.6rem", lineHeight: 1 }}>Cover star:<br />Honey, age 6</p></div>
            <div className="em-postcard"><img src={trail} alt="Postcard keepsake of a family hike with their senior dog" loading="lazy" width={1024} height={1024} style={{ borderRadius: ".3rem" }} />
              <p className="em-hand" style={{ fontSize: "1.6rem", marginTop: ".5rem" }}>Greetings from the woods! ✿</p></div>
            <div className="em-trading"><div className="em-inner"><img src={puppy} alt="Trading-card keepsake of a corgi puppy in a raincoat" loading="lazy" width={1024} height={1024} />
              <div style={{ padding: ".8rem 1rem" }}><h3 style={{ fontSize: "1.5rem" }}>Biscuit</h3><p style={{ fontSize: ".8rem" }}>Special move: Puddle Splash · Rarity ★★★★★</p></div></div></div>
          </div>
          <p style={{ fontSize: ".9rem" }}>Made on your phone. Your photos never leave your device.</p>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="em-section">
        <div className="em-wrap">
          <div className="em-offer">
            <div style={{ display: "grid", gap: "1.2rem" }}>
              <p className="em-eyebrow" style={{ color: v("butter") }}>one little purchase. so many possibilities.</p>
              <h2 style={{ fontSize: "clamp(2.4rem,6vw,4rem)" }}>The complete Adventure Passport.</h2>
              <ul>
                {["The full adventure library & all ten collections", "Personalized picks for your dog", "Scratch-off mystery adventures", "Collectible stamps & your passport journal", "Save favorites, build your own collections, plan dates", "Photo keepsakes — covers, postcards, trading cards"].map((x) => <li key={x}><span style={{ color: v("butter") }}>✿</span>{x}</li>)}
              </ul>
            </div>
            <div className="em-ticket">
              <p className="em-hand" style={{ fontSize: "1.5rem" }}>made for the two of you</p>
              <div className="em-price">$19.99</div>
              <p style={{ fontWeight: 600 }}>Paid once. Yours to keep. No subscription, no renewals.</p>
              <a href="#offer" className="em-btn em-btn-primary" style={{ justifyContent: "center" }}>Get the passport</a>
              <a href="#quiz" className="em-btn em-btn-ghost" style={{ justifyContent: "center" }}>Try one free first</a>
              <p style={{ fontSize: ".85rem", textAlign: "center" }}>🎁 Gifting for a dog-loving friend — coming with checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="em-section" style={{ paddingTop: 0 }}>
        <div className="em-wrap em-faq" style={{ display: "grid", gap: ".8rem", maxWidth: "48rem" }}>
          <h2 style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", marginBottom: "1rem" }}>Good questions.</h2>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>
    </div>
  );
}
