import type { ReactNode } from "react";
import { AppLink } from "./AppLink";

/** Printed-card surface. Pass `to` to make the whole card one link. */
export function Card({
  children,
  to,
  className = "",
}: {
  children: ReactNode;
  to?: string;
  className?: string;
}) {
  const cls = `pp-card ${className}`.trim();
  return to ? (
    <AppLink to={to} className={cls}>
      {children}
    </AppLink>
  ) : (
    <div className={cls}>{children}</div>
  );
}
