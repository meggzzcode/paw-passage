import { createFileRoute } from "@tanstack/react-router";
import { JournalIndex } from "@/components/journal/JournalIndex";
import { JOURNAL_NAME, JOURNAL_TAGLINE, allJournal } from "@/lib/journal";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/journal/")({
  head: () => {
    const h = pageHead({
      title: JOURNAL_NAME,
      description: JOURNAL_TAGLINE,
      path: "/journal",
    });
    return { ...h, scripts: [breadcrumbLd([{ name: JOURNAL_NAME, path: "/journal" }])] };
  },
  component: () => <JournalIndex articles={allJournal} />,
});
