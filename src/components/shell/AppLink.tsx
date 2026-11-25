import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

/**
 * Link for addresses that may not be built yet (/discover, /passport, ...). Behaves like a router Link;
 * the cast keeps it compiling until those routes exist, after which callers can use typed Links.
 */
export function AppLink({ to, ...rest }: Omit<ComponentProps<typeof Link>, "to"> & { to: string }) {
  return <Link to={to as never} {...rest} />;
}
