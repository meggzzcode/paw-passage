import { Breadcrumbs } from "./Breadcrumbs";

export function ToolShell({
  title,
  intro,
  children,
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
}) {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: crumb ?? title }]} />
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{intro}</p>
        {note && <p className="mt-3 text-sm text-foreground">{note}</p>}
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
}
