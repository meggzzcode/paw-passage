// One printable sheet, laid out for paper: the same sheet is what you see on screen and what the browser prints.
// Generic content only. The certificate's name fields live in this page's memory and are never stored or sent.
import { useId, useState } from "react";
import "@/design/print.css";
import { site } from "@/config/site";
import type { Printable } from "./data";

function Header({ p }: { p: Printable }) {
  return (
    <header className="pr-head">
      <p className="pr-brand">{site.name}</p>
      <h2 className="pr-title">{p.title}</h2>
      <p className="pr-intro">{p.intro}</p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="pr-foot">
      <span>{site.name}</span>
      <span>A lifetime of little adventures.</span>
    </footer>
  );
}

function Checklist({ p }: { p: Printable }) {
  return (
    <div className="pr-groups">
      {p.groups?.map((g) => (
        <section key={g.heading} className="pr-group">
          <h3 className="pr-h3">{g.heading}</h3>
          <ul className="pr-checks">
            {g.items.map((i) => (
              <li key={i}>
                <span className="pr-box" aria-hidden="true" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {p.blanks ? (
        <section className="pr-group">
          <h3 className="pr-h3">Our own ideas</h3>
          <ul className="pr-checks">
            {Array.from({ length: p.blanks }, (_, n) => (
              <li key={n}>
                <span className="pr-box" aria-hidden="true" />
                <span className="pr-line" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Bingo({ p }: { p: Printable }) {
  const cells = [...(p.cells ?? [])];
  cells.splice(12, 0, p.freeSquare ?? "Free");
  return (
    <div className="pr-bingo" role="table" aria-label={p.title}>
      {cells.map((c, n) => (
        <div
          key={`${n}-${c}`}
          role="cell"
          className={n === 12 ? "pr-cell pr-cell-free" : "pr-cell"}
        >
          {n === 12 && <span className="pr-free">Free</span>}
          <span>{c}</span>
        </div>
      ))}
    </div>
  );
}

const PARTS = ["Morning", "Afternoon", "Evening"] as const;

function Planner() {
  return (
    <div className="pr-planner">
      {["Saturday", "Sunday"].map((day) => (
        <section key={day} className="pr-day">
          <h3 className="pr-h3">{day}</h3>
          {PARTS.map((part) => (
            <div key={part} className="pr-slot">
              <span className="pr-slot-label">{part}</span>
              <span className="pr-line" aria-hidden="true" />
            </div>
          ))}
        </section>
      ))}
      <section className="pr-day pr-wide">
        <h3 className="pr-h3">Adventures I would like to fit in</h3>
        {[0, 1, 2].map((n) => (
          <div key={n} className="pr-slot">
            <span className="pr-box" aria-hidden="true" />
            <span className="pr-line" aria-hidden="true" />
          </div>
        ))}
      </section>
      <section className="pr-day">
        <h3 className="pr-h3">Things to gather</h3>
        {[0, 1, 2].map((n) => (
          <div key={n} className="pr-slot">
            <span className="pr-line" aria-hidden="true" />
          </div>
        ))}
      </section>
      <section className="pr-day">
        <h3 className="pr-h3">Notes</h3>
        {[0, 1, 2].map((n) => (
          <div key={n} className="pr-slot">
            <span className="pr-line" aria-hidden="true" />
          </div>
        ))}
      </section>
    </div>
  );
}

function Certificate() {
  const id = useId();
  const [dog, setDog] = useState("");
  const [owner, setOwner] = useState("");
  const [what, setWhat] = useState("");
  const [date, setDate] = useState("");
  const field = (
    key: string,
    label: string,
    value: string,
    set: (v: string) => void,
    ph: string,
  ) => (
    <label className="pr-field" htmlFor={`${id}-${key}`}>
      <span className="pr-field-label">{label}</span>
      <input
        id={`${id}-${key}`}
        className="pr-input"
        type="text"
        value={value}
        maxLength={60}
        placeholder={ph}
        autoComplete="off"
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
  return (
    <div className="pr-cert">
      <p className="pr-cert-line">This certifies that</p>
      {field("dog", "Dog's name", dog, setDog, "Your dog's name")}
      <p className="pr-cert-line">has bravely and happily completed</p>
      {field("what", "Adventure", what, setWhat, "A little adventure")}
      <p className="pr-cert-line">with</p>
      {field("owner", "With", owner, setOwner, "Your name")}
      {field("date", "Date", date, setDate, "Date")}
      <p className="pr-cert-seal" aria-hidden="true">
        ★
      </p>
    </div>
  );
}

export function PrintableSheet({ p }: { p: Printable }) {
  return (
    <article className={`pr-sheet${p.landscape ? " pr-sheet-landscape" : ""}`} aria-label={p.title}>
      <Header p={p} />
      {p.kind === "checklist" && <Checklist p={p} />}
      {p.kind === "bingo" && <Bingo p={p} />}
      {p.kind === "planner" && <Planner />}
      {p.kind === "certificate" && <Certificate />}
      <Footer />
    </article>
  );
}
