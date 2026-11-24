import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired guide: merged into the large-dog guide (one page for "large dog friendly rentals" and "no dog weight limit").
// Kept so existing links never 404; a static route beats /guides/$slug. Also redirected in netlify.toml.
export const Route = createFileRoute("/guides/vacation-rentals-with-no-dog-weight-limit")({
  beforeLoad: () => {
    throw redirect({
      href: "/guides/vacation-rentals-that-welcome-large-dogs",
      statusCode: 301,
    });
  },
});
