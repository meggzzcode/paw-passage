export function PreviewBadge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground ring-1 ring-terracotta/40">{children}</span>;
}
