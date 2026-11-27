import { Breadcrumbs } from "./Breadcrumbs";
import { Markdown } from "./Markdown";

export function InfoPage({
  title,
  intro,
  body,
  updated,
  lead,
  children,
}: {
  title: string;
  intro?: string;
  body?: string;
  updated?: string;
  /** Optional decorative strip shown under the intro (the story pages use it for a pair of polaroids). */
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: title }]} />
      <div className="ws-paper mx-auto mt-6 max-w-[42rem]">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="ws-lead mt-4">{intro}</p>}
        {updated && <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>}
        {lead}
        {body && <Markdown source={body} className="mt-8" />}
        {children}
      </div>
    </div>
  );
}
