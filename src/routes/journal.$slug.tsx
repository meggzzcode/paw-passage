import { createFileRoute, notFound } from "@tanstack/react-router";
import { JournalArticleView } from "@/components/journal/JournalArticleView";
import {
  articleBreadcrumbs,
  articleJsonLd,
  articlePath,
  getJournalArticle,
  relatedArticles,
} from "@/lib/journal";
import { isoDate, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = getJournalArticle(params.slug);
    if (!article) throw notFound();
    return { article, related: relatedArticles(article) };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Article unavailable" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    const h = pageHead({
      title: a.title,
      description: a.description,
      path: articlePath(a.slug),
      type: "article",
      image: a.image,
    });
    return {
      ...h,
      meta: [
        ...h.meta,
        { property: "article:published_time", content: isoDate(a.datePublished) },
        { property: "article:modified_time", content: isoDate(a.dateModified) },
      ],
      scripts: [articleJsonLd(a), articleBreadcrumbs(a)],
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { article, related } = Route.useLoaderData();
  return <JournalArticleView article={article} related={related} />;
}
