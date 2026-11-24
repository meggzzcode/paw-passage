import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address: the pet cost tool was retired. Kept so existing links never 404; permanent redirect to the tools index.
export const Route = createFileRoute("/tools/pet-cost-check")({
  beforeLoad: () => {
    throw redirect({ to: "/tools", statusCode: 301 });
  },
});
