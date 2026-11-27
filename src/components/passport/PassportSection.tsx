// One chapter of the passport journal: a native disclosure with a calm summary line. Content mounts the first time
// it opens. A matching #hash (for example the old #acct-h link) opens the chapter and scrolls to it.
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function PassportSection({
  id,
  title,
  summary,
  anchors = [],
  defaultOpen = false,
  quiet = false,
  children,
}: {
  id: string;
  title: string;
  summary?: ReactNode;
  /** Extra #hash values that should open this chapter. */
  anchors?: readonly string[];
  defaultOpen?: boolean;
  quiet?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [seen, setSeen] = useState(defaultOpen);
  const ref = useRef<HTMLDetailsElement>(null);
  const anchorKey = anchors.join("|");

  useEffect(() => {
    const names = new Set([id, ...anchorKey.split("|").filter(Boolean)]);
    const check = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (!names.has(h)) return;
      setOpen(true);
      setSeen(true);
      window.setTimeout(() => ref.current?.scrollIntoView?.({ block: "start" }), 0);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [id, anchorKey]);

  return (
    <details
      ref={ref}
      id={id}
      className={quiet ? "pv8-sec pv8-sec-quiet" : "pv8-sec"}
      open={open}
      onToggle={(e) => {
        const o = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(o);
        if (o) setSeen(true);
      }}
    >
      <summary className="pv8-sum">
        <div className="pv8-sum-text">
          <h2 className="pv8-h">{title}</h2>
          {summary && <span className="pv8-sumline">{summary}</span>}
        </div>
        <span className="pv8-chev" aria-hidden="true" />
      </summary>
      <div className="pv8-body">{seen ? children : null}</div>
    </details>
  );
}
