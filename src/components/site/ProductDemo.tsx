// A five-step walk through the free journey (Discover, Reveal, Experience, Collect, Create), using real screens of the
// free introductory adventure on a sample dog. A plain stepper: nothing plays by itself, no motion is required, and
// every step has text and alt text. Only the free adventure is shown, never a premium one.
import { useState } from "react";
import { DEMO_STEPS } from "@/config/commercial";

export function ProductDemo() {
  const [i, setI] = useState(0);
  const step = DEMO_STEPS[i]!;
  const last = DEMO_STEPS.length - 1;
  return (
    <div
      className="pp-demo"
      role="group"
      aria-roledescription="stepper"
      aria-label="How it works, in five steps"
    >
      <figure className="pp-demo-fig">
        <img
          key={step.id}
          src={step.src}
          alt={step.alt}
          width={step.width}
          height={step.height}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div>
        <ol className="pp-demo-tabs" aria-label="Steps">
          {DEMO_STEPS.map((s, n) => (
            <li key={s.id}>
              <button
                type="button"
                className="pp-demo-tab"
                aria-current={n === i ? "step" : undefined}
                onClick={() => setI(n)}
              >
                {n + 1}. {s.label}
              </button>
            </li>
          ))}
        </ol>
        <div className="pp-demo-text" aria-live="polite">
          <h3>
            Step {i + 1} of {DEMO_STEPS.length}: {step.title}
          </h3>
          <p>{step.body}</p>
        </div>
        <div className="pp-demo-nav">
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            Back
          </button>
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            disabled={i === last}
            onClick={() => setI(i + 1)}
          >
            Next step
          </button>
        </div>
      </div>
    </div>
  );
}
