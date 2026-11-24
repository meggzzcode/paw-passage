import { Link } from "@tanstack/react-router";
import { Breadcrumbs } from "./Breadcrumbs";

export function ToolShell({
  title,
  intro,
  children,
  guides,
  links,
  eyebrow = "Free tool",
  crumb,
  note,
}: {
  title: string;
  intro: string;
  /** Small label above the title. */
  eyebrow?: string;
  /** Breadcrumb label when it should be shorter than the title. */
  crumb?: string;
  /** One short line under the intro. */
  note?: React.ReactNode;
  children: React.ReactNode;
  guides?: { slug: string; label: string }[];
  links?: { to: string; label: string }[];
}) {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Tools", to: "/tools" },
          { label: crumb ?? title },
        ]}
      />
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{intro}</p>
        {note && <p className="mt-3 text-sm text-foreground">{note}</p>}
      </header>
      <div className="mt-10">{children}</div>
      {((guides && guides.length > 0) || (links && links.length > 0)) && (
        <aside className="no-print mt-16 rounded-xl bg-secondary/70 p-6">
          <p className="font-display text-lg">Go deeper</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(guides ?? []).map((g) => (
              <li key={g.slug}>
                <Link
                  to="/guides/$slug"
                  params={{ slug: g.slug }}
                  className="text-primary underline"
                >
                  {g.label}
                </Link>
              </li>
            ))}
            {(links ?? []).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
