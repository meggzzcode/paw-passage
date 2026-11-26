// /printables: the list. Two free samples for everyone; the whole set for paying customers.
import "@/design/print.css";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { useEntitlement } from "@/passport/useEntitlement";
import { PRINTABLES } from "./data";

export function PrintablesIndex() {
  const { status } = useEntitlement();
  const entitled = status === "entitled";
  return (
    <Container>
      <div className="pa-page">
        <p className="pa-kicker">Printables</p>
        <h1 className="pa-h1">Printable pages for little adventures</h1>
        <p className="pa-sub">
          Print them at home or save them as a PDF from your browser. They are made with the same
          care as the Passport and work with any printer.{" "}
          {entitled
            ? "They come with your full Passport."
            : "Two are free to try. The full set comes with the full Passport."}
        </p>
        <ul className="pr-index">
          {PRINTABLES.map((p) => {
            const open = p.sample || entitled;
            return (
              <li key={p.slug} className="pa-card pr-index-card">
                <p className="pa-kicker">{p.sample && !entitled ? "Free sample" : "Printable"}</p>
                <h2 className="pa-title">{p.title}</h2>
                <p>{p.teaser}</p>
                {open ? (
                  <AppLink
                    to="/printables/$slug"
                    params={{ slug: p.slug } as never}
                    className="pp-btn pp-btn-secondary"
                  >
                    Open and print
                    <span className="sr-only"> {p.title}</span>
                  </AppLink>
                ) : (
                  <p className="pa-fine">Included with the full Passport</p>
                )}
              </li>
            );
          })}
        </ul>
        {!entitled && (
          <p className="pa-fine">
            <AppLink to="/unlock" className="pa-linkbtn">
              See the full Passport
            </AppLink>
          </p>
        )}
      </div>
    </Container>
  );
}

/** A small card for My Passport: one link to the printables. */
export function PrintablesCard() {
  return (
    <section className="pa-panel" aria-labelledby="pr-card-h">
      <h2 className="pa-h" id="pr-card-h">
        Printables
      </h2>
      <p>
        A bucket list, two bingo cards, a weekend planner, a certificate and a family checklist.
      </p>
      <div className="pa-row">
        <AppLink to="/printables" className="pp-btn pp-btn-secondary">
          Open printables
        </AppLink>
      </div>
    </section>
  );
}
