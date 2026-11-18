import { Breadcrumbs } from "./Breadcrumbs";
import { Markdown } from "./Markdown";

export function InfoPage({
  title,
  intro,
  body,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  body?: string;
  updated?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: title }]} />
      <div className="mx-auto mt-8 max-w-[42rem]">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
        {updated && <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>}
        {body && <Markdown source={body} className="mt-8" />}
        {children}
      </div>
    </div>
  );
}
