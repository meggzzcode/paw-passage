// /printables/<slug>: the sheet, plus a print button. Free samples are open to everyone; the rest come with the full
// Passport. The page content is generic, so this is a product choice rather than a security gate.
import { useEffect } from "react";
import "@/design/print.css";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { useEntitlement } from "@/passport/useEntitlement";
import { PRINTABLES, printableBySlug } from "./data";
import { PrintableSheet } from "./PrintableSheet";

export function PrintablePage({ slug }: { slug: string }) {
  const { status } = useEntitlement();
  const p = printableBySlug(slug);

  useEffect(() => {
    document.body.classList.add("pr-active");
    return () => document.body.classList.remove("pr-active");
  }, []);

  if (!p)
    return (
      <Container>
        <div className="pa-page">
          <h1 className="pa-h1">That printable is not here</h1>
          <p>
            <AppLink to="/printables" className="pa-linkbtn">
              See all printables
            </AppLink>
          </p>
        </div>
      </Container>
    );

  const open = p.sample || status === "entitled";
  return (
    <Container>
      <div className="pa-page pr-page">
        <div className="pr-toolbar no-print pr-noprint">
          <AppLink to="/printables" className="pa-linkbtn">
            All printables
          </AppLink>
          {open && (
            <>
              <button
                type="button"
                className="pp-btn pp-btn-primary"
                onClick={() => window.print()}
              >
                Print or save as PDF
              </button>
              <p className="pa-fine">
                In the print window choose “Save as PDF” to keep a copy. Nothing is uploaded.
              </p>
            </>
          )}
        </div>
        {open ? (
          <PrintableSheet p={p} />
        ) : (
          <div className="pa-card no-print" role="status">
            <h1 className="pa-title">{p.title}</h1>
            <p>{p.teaser}</p>
            <p>This printable comes with the full Passport. One-time purchase, no subscription.</p>
            <div className="pa-row">
              <AppLink to="/unlock" className="pp-btn pp-btn-primary">
                See the full Passport
              </AppLink>
              <AppLink to="/printables" className="pp-btn pp-btn-ghost">
                Try a free sample
              </AppLink>
            </div>
          </div>
        )}
        {open && (
          <p className="pa-fine no-print">
            {PRINTABLES.length} printables in all.{" "}
            <AppLink to="/printables" className="pa-linkbtn">
              See the others
            </AppLink>
          </p>
        )}
      </div>
    </Container>
  );
}
