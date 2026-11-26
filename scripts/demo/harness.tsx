// Dev-only harness for scripts/demo/render-examples.mjs. Mounts the REAL keepsake editor component with a sample
// adventure description taken from the URL (?spec=<json>). Not part of the site build or any route.
import { createRoot } from "react-dom/client";

import { Keepsake } from "@/components/passport/Keepsake";

const spec = JSON.parse(new URLSearchParams(location.search).get("spec") ?? "{}");
const adventure = {
  id: "demo",
  title: spec.headline ?? "Demo",
  objective: spec.explainer ?? "",
  stamps: spec.stamps ?? [],
  keepsake: {
    family: spec.family,
    theme: spec.theme,
    headline: spec.headline,
    subhead: spec.subhead,
    explainer: spec.explainer,
  },
};
createRoot(document.getElementById("root")!).render(
  <Keepsake adventure={adventure as never} dogName={spec.name} memory={spec.memory} />,
);
