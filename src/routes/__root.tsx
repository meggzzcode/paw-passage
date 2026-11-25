import { jsonLd } from "@/lib/seo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { site } from "../config/site";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/** True when the matched routes include one that resolved to "not found" (an unknown URL, or a stay/guide slug that does not exist). */
export function isNotFoundLane(
  matches:
    ReadonlyArray<{ status?: string; globalNotFound?: boolean; _notFound?: unknown }> | undefined,
): boolean {
  return !!matches?.some(
    (m) => m.status === "notFound" || m.globalNotFound === true || !!m._notFound,
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: (ctx) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // A page that does not exist keeps its 404 status, gets its own title and stays out of search results.
      {
        title: isNotFoundLane(ctx?.matches)
          ? `Page not found | ${site.name}`
          : `${site.name}: dog-friendly travel guides and stays`,
      },
      ...(isNotFoundLane(ctx?.matches) ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      { name: "description", content: site.description },
      { property: "og:site_name", content: site.name },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#234D44" },
      // Impact (impact.com) site-ownership check. Impact issues this tag with a "value" attribute, not "content". The value is
      // settings.impactSiteVerification (content/settings.yml, Pages CMS "Business settings"): the buyer replaces it with their own, or clears it.
      ...(site.impactSiteVerification
        ? [{ name: "impact-site-verification", value: site.impactSiteVerification }]
        : []),
      // A private preview build (SHOW_DRAFTS=true) can show unpublished drafts, so keep ALL of it out of search engines.
      ...(site.showDraftGuides && !import.meta.env.DEV
        ? [{ name: "robots", content: "noindex, nofollow" }]
        : []),
    ],
    links: [
      // Self-hosted fonts (see src/styles.css). Both are used above the fold, so both are preloaded.
      {
        rel: "preload",
        href: "/fonts/dm-sans-latin-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/fraunces-latin-variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      // Organization: url and name always; sameAs lists only the Pinterest profile, and only once site.pinterestUrl is set. No logo property: the site's logo is a text wordmark, and there is no brand logo image file to point to.
      {
        type: "application/ld+json",
        children: jsonLd({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          ...(site.siteUrl ? { url: site.siteUrl } : {}),
          slogan: site.tagline,
          description: site.description,
          ...(site.pinterestUrl ? { sameAs: [site.pinterestUrl] } : {}),
        }),
      },
      ...(site.ga4MeasurementId
        ? [
            {
              // The gtag stub is defined at once so events are queued; the 180 KB Google loader is fetched after the page
              // has loaded (and the browser is idle), so it never competes with the hero photo. Pageviews are still counted.
              children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};window.gtag=gtag;gtag('js',new Date());gtag('config','${site.ga4MeasurementId}');(function(){function l(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${site.ga4MeasurementId}';document.head.appendChild(s)}function g(){if('requestIdleCallback' in window){requestIdleCallback(l,{timeout:3000})}else{setTimeout(l,1)}}if(document.readyState==='complete'){g()}else{window.addEventListener('load',g)}})();`,
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Some hosts (Netlify's free plan) add an HTML comment and a blank line to the top of every page's <head>. React treats an
            unexpected node there as a mismatch ("hydration error #418") and rebuilds the page in the browser.
            This tiny script runs while the page loads and removes any comments and blank text from <head> before React starts. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var h=document.head;if(!h)return;var n=h.firstChild;while(n){var x=n.nextSibling;if(n.nodeType===8||(n.nodeType===3&&!/\\S/.test(n.nodeValue||'')))h.removeChild(n);n=x}})();",
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
