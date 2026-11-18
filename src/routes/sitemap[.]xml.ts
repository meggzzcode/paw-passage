import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import { sitemapEntries, sitemapXml } from "@/lib/sitemap-entries";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        if (!site.siteUrl) {
          return new Response("Sitemap domain not configured. Set siteUrl in src/config/site.ts.", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }
        return new Response(sitemapXml(site.siteUrl, sitemapEntries()), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
