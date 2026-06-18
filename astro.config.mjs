// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  // Canonical origin — absolute URLs for sitemap.xml + canonical links.
  site: "https://boholz-haus.de",
  integrations: [vue()],
  output: "server",
  adapter: node({ mode: "standalone" }),
  // Routes renamed 2026-05-18; redirects keep old links + bookmarks alive.
  // Typology landing pages moved from /landing/* → /wohnen/* on 2026-05-22.
  redirects: {
    "/unser-versprechen": "/bauen-mit-boholz",
    "/dein-zuhause": "/ihr-neues-zuhause",
    "/landing/uebersicht": "/wohnen/uebersicht",
    "/landing/bungalow": "/wohnen/bungalow",
    "/landing/mehrfamilien": "/wohnen/mehrfamilien",
  },
  vite: {
    // Minify CSS with Lightning CSS (more aggressive than the esbuild default).
    // The PostCSS transform pipeline (preset-env, custom-media) still runs first.
    build: { cssMinify: "lightningcss" },
    ssr: {
      // maplibre-gl uses browser-only APIs (window, Worker, WebGL).
      // noExternal forces Vite to bundle it rather than handing it to Node.
      noExternal: ["maplibre-gl", "@indoorequal/vue-maplibre-gl"],
    },
  },
});
