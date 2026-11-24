export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="no-print text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:gap-x-1.5 sm:text-sm">
        {items.map((it, i) => (
          <li
            key={i}
            className={`flex min-w-0 items-center gap-1.5${i === items.length - 1 && i > 0 ? " max-sm:basis-full" : ""}`}
          >
            {/* Separators show from sm up; on phones the gap does the work so a wrapped line never starts with "/". */}
            {i > 0 && (
              <span aria-hidden className="max-sm:hidden">
                /
              </span>
            )}
            {it.to ? (
              <a href={it.to} className="hover:text-primary hover:underline">
                {it.label}
              </a>
            ) : (
              <span aria-current="page" className="truncate text-foreground">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
