import type { ReactNode } from "react";
import { AppLink } from "./AppLink";

type Variant = "primary" | "secondary" | "ghost";

/** A link styled as a button (every call to action on this site is a link). 44px minimum height. */
export function Button({
  to,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  to: string;
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
}) {
  const cls = `pp-btn pp-btn-${variant}${size === "sm" ? " pp-btn-sm" : ""} ${className}`.trim();
  return (
    <AppLink to={to} className={cls}>
      {children}
    </AppLink>
  );
}
