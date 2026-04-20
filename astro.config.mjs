// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import vue from "@astrojs/vue";

// https://astro.build/config
// SSR mode: all pages render per-request, no static prerendering
export default defineConfig({
  integrations: [vue()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
