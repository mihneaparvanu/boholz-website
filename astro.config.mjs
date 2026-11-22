// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
export default defineConfig({
  site: "https://boholz-haus.de",
  integrations: [vue()],
  output: "static",
  build: { assets: "a" },
  redirects: {
    "/unser-versprechen": "/bauen-mit-boholz",
    "/dein-zuhause": "/ihr-neues-zuhause",
    "/vorschau-anspruch": "/wohnen/einfamilienhaus",
    "/landing/uebersicht": "/wohnen/einfamilienhaus",
    "/wohnen/uebersicht": "/wohnen/einfamilienhaus",
    "/landing/bungalow": "/wohnen/bungalow",
    "/landing/mehrfamilien": "/wohnen/mehrfamilien",
  },
  vite: {
    server: {
      allowedHosts: ["localhost", "boholz-haus.de", ".boholz-haus.de"],
    },
    ssr: {
      noExternal: ["maplibre-gl", "@indoorequal/vue-maplibre-gl"],
    },
  },
});
