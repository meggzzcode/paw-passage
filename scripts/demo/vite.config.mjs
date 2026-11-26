// Minimal vite config used only by scripts/demo/render-examples.mjs (the site's own config serves the whole app).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { contentPlugin } from "../../plugins/content";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export default defineConfig({
  root,
  plugins: [react(), contentPlugin()],
  resolve: { alias: { "@": path.join(root, "src") } },
  server: { host: "127.0.0.1", port: 5192, strictPort: true },
  logLevel: "warn",
});
