import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired draft: the breed-restriction question is answered in the large-dog guide (breed and weight rules). Kept so the
// address never 404s; a static route beats /guides/$slug. Also redirected in netlify.toml.
export const Route = createFileRoute("/guides/breed-restrictions-at-vacation-rentals")({
  beforeLoad: () => {
    throw redirect({
      href: "/guides/vacation-rentals-that-welcome-large-dogs",
      statusCode: 301,
    });
  },
});
