// The one fully visible public adventure card. Collapsed on the homepage, open on /unlock. It is a dedicated
// demonstration card, not an adventure from the Passport library.
import { DEMO_ADVENTURE as a, DEMO_LABEL } from "@/config/demo-adventure";

export function DemoAdventure({
  open = false,
  id = "demo-adventure",
}: {
  open?: boolean;
  id?: string;
}) {
  return (
    <section className="pa-card pp-demo-adv" aria-labelledby={`${id}-h`}>
      <p className="pa-kicker">{DEMO_LABEL}</p>
      <details open={open || undefined} data-testid="demo-adventure">
        <summary>
          <span id={`${id}-h`} className="pa-h">
            {a.title}
          </span>
          <span className="pa-fine"> {a.clue}</span>
        </summary>
        <p className="pa-fine">
          {a.time} · {a.cost} · {a.setting}. {a.effort}
        </p>
        <h3 className="pa-h">The twist</h3>
        <p>{a.twist}</p>
        <h3 className="pa-h">What you will need</h3>
        <ul className="co-plain">
          {a.youNeed.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3 className="pa-h">Steps</h3>
        <ol>
          {a.steps.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <h3 className="pa-h">Keep your dog safe</h3>
        <ul className="co-plain">
          {a.safety.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3 className="pa-h">Make it fit your dog</h3>
        <ul className="co-plain">
          {a.variations.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p>{a.multiDog}</p>
        <p className="pa-fine">Done when: {a.done}</p>
        <p className="pa-fine">
          This is a demonstration card written to show what a full adventure looks like. It is not
          one of the adventures in the library.
        </p>
      </details>
    </section>
  );
}
