import { marked } from "marked";
import { cn } from "@/lib/utils";

marked.setOptions({ gfm: true });

/** Renders trusted, repo-authored Markdown (guide bodies). Not for user input. */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const html = (marked.parse(source, { async: false }) as string)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  return <div className={cn("prose-article", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
