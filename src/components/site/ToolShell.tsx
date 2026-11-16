import { Link } from "@tanstack/react-router";
import { Breadcrumbs } from "./Breadcrumbs";

export function ToolShell({ title, intro, children, guides }: { title: string; intro: string; children: React.ReactNode; guides?: { slug: string; label: string }[] }) {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools", to: "/tools" }, { label: title }]} />
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">Free tool</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{intro}</p>
      </header>
      <div className="mt-10">{children}</div>
      {guides && guides.length > 0 && (
        <aside className="no-print mt-16 rounded-xl bg-secondary/70 p-6">
          <p className="font-display text-lg">Go deeper</p>
          <ul className="mt-3 space-y-2 text-sm">{guides.map((g) => <li key={g.slug}><Link to="/guides/$slug" params={{ slug: g.slug }} className="text-primary underline">{g.label}</Link></li>)}</ul>
        </aside>
      )}
    </div>
  );
}
