import { useState } from "react";

type Q = { prompt: string; answers: [string, string][] };
const QUESTIONS: Q[] = [
  { prompt: "Who's your favorite little sidekick?", answers: [["🐶", "A puppy"], ["🐕", "Grown-up good dog"], ["🦮", "Golden-years sweetheart"], ["🐾", "We're a multi-dog family"]] },
  { prompt: "What are we in the mood for?", answers: [["🛋️", "Cozy & close"], ["🎾", "Silly & playful"], ["🌿", "Fresh air"], ["☕", "A little date"]] },
  { prompt: "How much time do you have?", answers: [["⏱", "5 minutes"], ["🕐", "An hour or so"], ["🌤", "An afternoon"], ["🗺", "A whole weekend"]] },
  { prompt: "Who's coming along?", answers: [["💛", "Just the two of us"], ["💑", "My partner too"], ["👨‍👩‍👧", "The whole family"], ["👯", "Friends & their pups"]] },
  { prompt: "Your pup's energy today?", answers: [["😴", "Sleepy loaf"], ["🙂", "Steady stroller"], ["⚡", "Zoomies loading"]] },
  { prompt: "How do they feel about new places?", answers: [["🤗", "Loves everyone"], ["🧐", "Curious but careful"], ["🫣", "Prefers quiet spots"]] },
  { prompt: "Budget for this one?", answers: [["🆓", "Free"], ["$", "Under $20"], ["$$", "Treat ourselves"]] },
  { prompt: "Inside or out?", answers: [["🏠", "Indoors"], ["🌳", "Outdoors"], ["🎲", "Surprise us"]] },
];

export function ConceptQuiz() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const done = step >= QUESTIONS.length;
  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  if (!q) return null;

  return (
    <div className="em-quiz">
      <div className="em-progress" aria-label={`Question ${Math.min(step + 1, 8)} of 8`}>
        {QUESTIONS.map((_, i) => <span key={i} data-on={i < step || done} />)}
      </div>
      {done ? (
        <div style={{ padding: "2.5rem 0 .5rem", display: "grid", gap: "1rem" }}>
          <p className="em-eyebrow">All done!</p>
          <h3 style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>Your first adventure is ready to unwrap.</h3>
          <p className="em-lede">Free, no sign-up. Scroll down to your mystery card.</p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <a href="#mystery" className="em-btn em-btn-primary">Reveal it →</a>
            <button type="button" className="em-btn em-btn-ghost" onClick={() => { setStep(0); setPicks({}); }}>Start over</button>
          </div>
        </div>
      ) : (
        <div style={{ paddingTop: "2rem", display: "grid", gap: "1.5rem" }}>
          <p className="em-hand" style={{ fontSize: "1.4rem" }}>{step + 1} of 8</p>
          <h3 style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>{q.prompt}</h3>
          <div className="em-answers">
            {q.answers.map(([emoji, label]) => (
              <button key={label} type="button" className="em-answer" aria-pressed={picks[step] === label}
                onClick={() => { setPicks({ ...picks, [step]: label }); setTimeout(() => setStep((s) => s + 1), 220); }}>
                <span className="em-emoji" aria-hidden>{emoji}</span>
                <span style={{ fontWeight: 600 }}>{label}</span>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} style={{ justifySelf: "start", fontWeight: 600 }}>← Back</button>
          )}
        </div>
      )}
    </div>
  );
}
