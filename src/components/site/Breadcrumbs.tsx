export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="no-print text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.to ? <a href={it.to} className="hover:text-primary hover:underline">{it.label}</a> : <span aria-current="page" className="text-foreground">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
