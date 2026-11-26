// The stamp page of the passport: earned stamps first. Stamps not earned yet sit in a collapsed list of plain
// descriptions (no grid of faded stamps), so nothing looks like a failure.
import { StampGrid } from "@/passport/art/stamps";
import { stamps as stampDefs } from "@/passport/content";

export function StampShelf({ earned }: { earned: readonly string[] }) {
  const mine = stampDefs.filter((s) => earned.includes(s.slug));
  const locked = stampDefs.filter((s) => !earned.includes(s.slug));
  return (
    <section aria-labelledby="stamps-h" className="pa-panel">
      <h2 id="stamps-h" className="pa-h">
        Stamps
      </h2>
      {mine.length > 0 ? (
        <>
          <p className="pa-fine">
            {mine.length} {mine.length === 1 ? "stamp" : "stamps"} collected, at your own pace.
          </p>
          <StampGrid earned={earned} slugs={mine.map((s) => s.slug)} size={112} />
        </>
      ) : (
        <p className="pa-fine">Your first stamp comes with your first collected adventure.</p>
      )}
      {locked.length > 0 && (
        <details className="pa-fold">
          <summary>Stamps to discover ({locked.length})</summary>
          <div className="pa-fold-body">
            <ul className="pa-list-plain">
              {locked.map((s) => (
                <li key={s.slug}>
                  <strong>{s.title}:</strong> {s.rule}
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </section>
  );
}
