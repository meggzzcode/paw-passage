import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { GearDisclosure } from "@/components/site/GearHubCards";
import { CategoryHero, SafetyNote } from "@/components/gear/CategoryHero";
import { GearHashTarget } from "@/components/gear/GearHashTarget";
import { HowToChoose } from "@/components/gear/HowToChoose";
import { CategoryHowWePick, RelatedGuides } from "@/components/gear/RelatedGuides";
import { CategoryProductGrid, RelatedProductRows } from "@/components/gear/RelatedProductRows";
import { buildCategoryView, siblingCategories } from "@/content/gear-category-view";
import {
  categoryProducts,
  categoryIsLive,
  getGearCategory,
  legacyRedirectFor,
} from "@/content/gear-hub";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/gear/$category")({
  beforeLoad: ({ params }) => {
    // Old job-less category slugs: permanent redirect so existing links never 404.
    const next = legacyRedirectFor(params.category);
    if (next) throw redirect({ href: `/gear/${next}`, statusCode: 301 });
  },
  loader: ({ params }) => {
    const c = getGearCategory(params.category);
    // Unknown categories and categories with no products at all are not pages.
    if (!c || categoryProducts(c.slug).length === 0) throw notFound();
    return { slug: c.slug };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData ? getGearCategory(loaderData.slug) : undefined;
    if (!c) return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const h = pageHead({
      title: c.metaTitle,
      description: c.metaDescription,
      path: `/gear/${params.category}`,
      noindex: !categoryIsLive(c.slug),
    });
    return {
      ...h,
      scripts: [
        breadcrumbLd([
          { name: "Travel essentials", path: "/gear" },
          { name: c.name, path: `/gear/${c.slug}` },
        ]),
      ],
    };
  },
  component: GearCategoryPage,
});

function GearCategoryPage() {
  const { slug } = Route.useLoaderData();
  const view = buildCategoryView(slug)!;
  const siblings = siblingCategories(slug);
  const all = [...view.primary, ...view.secondary];
  return (
    <div className="container-page pt-6 md:pt-10">
      <GearHashTarget />
      <CategoryHero view={view} />
      <GearDisclosure products={all} />
      {view.safetyNote && <SafetyNote text={view.safetyNote} />}
      <CategoryProductGrid products={view.primary} />
      <RelatedProductRows products={view.secondary} />
      <HowToChoose view={view} />
      <RelatedGuides guides={view.guides} />
      <CategoryHowWePick />
      <nav className="mt-12 text-sm" aria-label="More gear">
        <Link to="/gear" className="text-primary underline">
          All travel essentials
        </Link>
        {siblings.map((x) => (
          <span key={x.slug}>
            {" · "}
            <Link
              to="/gear/$category"
              params={{ category: x.slug }}
              className="text-primary underline"
            >
              {x.name}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
