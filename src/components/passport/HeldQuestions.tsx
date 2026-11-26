import { setOwner, setProfile } from "@/passport/local-store";
import type { Held } from "@/passport/engine";

type Answer = { label: string; apply: () => void };

/** Maps the engine's plain-words questions to buttons that save the answer. Unrecognised questions fall back to the profile. */
function answersFor(q: string): Answer[] | null {
  const t = q.toLowerCase();
  if (t.includes("how big"))
    return (["small", "medium", "large"] as const).map((v) => ({
      label: v[0]!.toUpperCase() + v.slice(1),
      apply: () => setProfile({ size: v }),
    }));
  if (t.includes("food"))
    return [
      { label: "Yes", apply: () => setProfile({ foodActivities: "yes" }) },
      { label: "No", apply: () => setProfile({ foodActivities: "no" }) },
    ];
  if (t.includes("swim"))
    return [
      { label: "Yes", apply: () => setProfile({ swims: "yes" }) },
      { label: "No", apply: () => setProfile({ swims: "no" }) },
    ];
  if (t.includes("car"))
    return [
      {
        label: "Yes, both",
        apply: () => {
          setOwner({ hasCar: "yes" });
          setProfile({ carTravel: "yes" });
        },
      },
      { label: "No car", apply: () => setOwner({ hasCar: "no" }) },
      { label: "My dog does not ride in cars", apply: () => setProfile({ carTravel: "no" }) },
    ];
  if (t.includes("yard"))
    return [
      { label: "Yes", apply: () => setProfile({ yard: "yes" }) },
      { label: "No", apply: () => setProfile({ yard: "no" }) },
    ];
  return null;
}

/**
 * Adventures whose suitability depends on something we do not know yet. They stay on hold, never recommended,
 * until the visitor answers. Answers save to the profile and the held adventures move into the recommendations.
 */
export function HeldQuestions({
  held,
  onOpenProfile,
}: {
  held: Held[];
  onOpenProfile?: (() => void) | undefined;
}) {
  if (held.length === 0) return null;
  const counts = new Map<string, number>();
  for (const h of held) for (const q of h.confirm) counts.set(q, (counts.get(q) ?? 0) + 1);
  return (
    <section className="pa-panel pd-held" aria-labelledby="pd-held-h">
      <h2 className="pa-h" id="pd-held-h">
        A couple of quick questions
      </h2>
      <p className="pa-fine">
        {held.length} {held.length === 1 ? "adventure is" : "adventures are"} on hold until we know
        a little more. Answer to include them, or leave them: when we are unsure, we start with
        calmer options.
      </p>
      <ul className="pd-plain">
        {[...counts.entries()].map(([q, n]) => {
          const answers = answersFor(q);
          return (
            <li key={q} className="pd-question">
              <p className="pd-qtext">
                {q}{" "}
                <span className="pa-fine">
                  (holding {n} {n === 1 ? "adventure" : "adventures"})
                </span>
              </p>
              <div className="pa-chips" role="group" aria-label={q}>
                {answers ? (
                  answers.map((a) => (
                    <button key={a.label} type="button" className="pa-chip" onClick={a.apply}>
                      {a.label}
                    </button>
                  ))
                ) : (
                  <button type="button" className="pa-chip" onClick={onOpenProfile}>
                    Answer in my profile
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
