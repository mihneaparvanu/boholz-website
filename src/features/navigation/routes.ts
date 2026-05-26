export const ROUTES = {
  home: "/",
  houses: "/hauser",
  house: (slug: string) => `/haus/${slug}`,
  musterhaus: (slug: string) => `/musterhaus/${slug}`,
  promise: "/bauen-mit-boholz",
  yourHouse: "/ihr-neues-zuhause",
  aboutUS: "/uber-uns",
  news: "/news",
  newsArticle: (slug: string) => `/news/${slug}`,
  contact: "/kontakt",
  catalog: "/katalog",
  onsite: "/vor-ort-beratung",
  impressum: "/impressum",
  datenschutz: "/datenschutz",
  cookies: "/cookies",
  // German URL parent for typology landing pages — "wohnen" reads warm
  // and reserved without dev-jargon. The old `/landing/*` URLs redirect
  // here via `astro.config.mjs#redirects`.
  wohnen: {
    uebersicht: "/wohnen/uebersicht",
    bungalow: "/wohnen/bungalow",
    mehrfamilien: "/wohnen/mehrfamilien",
  },
} as const;
