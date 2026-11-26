// The stamp page of the passport: every stamp, earned ones inked, and how the next few are earned.
import { StampGrid } from "@/passport/art/stamps";
import { stamps as stampDefs } from "@/passport/content";

export function StampShelf({ earned }: { earned: readonly string[] }) {
  const locked = stampDefs.filter((s) => !earned.includes(s.slug)).slice(0, 3);
  return (
    <section aria-labelledby="stamps-h" className="pa-panel">
      <h2 id="stamps-h" className="pa-h">
        Stamps
      </h2>
      <p className="pa-fine">
        {earned.length} {earned.length === 1 ? "stamp" : "stamps"} collected. Stamps are earned by
        finishing adventures, at your own pace.
      </p>
      <StampGrid earned={earned} size={112} />
      {locked.length > 0 && (
        <ul className="pa-fine co-plain">
          {locked.map((s) => (
            <li key={s.slug}>
              <strong>{s.title}:</strong> {s.rule}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
