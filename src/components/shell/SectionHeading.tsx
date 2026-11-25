import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div>
      {eyebrow && <p className="pp-eyebrow">{eyebrow}</p>}
      <h2 id={id} className="pp-h2">
        {title}
      </h2>
      {children && <p className="pp-lede">{children}</p>}
    </div>
  );
}
