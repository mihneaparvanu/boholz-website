// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vue from "@astrojs/vue";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: "server",
  adapter: node({ mode: "standalone" }),
  vite: {
    // @ts-expect-error — vanilla-extract's Vite plugin is typed against a
    // different Vite copy than Astro's (Bun isolated linker hoists one and
    // keeps another in node_modules/.bun/). Runtime is fine.
    plugins: [vanillaExtractPlugin()],
    ssr: {
      // maplibre-gl uses browser-only APIs (window, Worker, WebGL).
      // noExternal forces Vite to bundle it rather than handing it to Node.
      noExternal: ["maplibre-gl", "@indoorequal/vue-maplibre-gl"],
    },
  },
});
