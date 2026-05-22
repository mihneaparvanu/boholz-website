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
    plugins: [vanillaExtractPlugin()],
    ssr: {
      // maplibre-gl uses browser-only APIs (window, Worker, WebGL).
      // noExternal forces Vite to bundle it rather than handing it to Node.
      noExternal: ["maplibre-gl", "@indoorequal/vue-maplibre-gl"],
    },
  },
});
