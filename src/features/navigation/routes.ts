import type { LandingCategory } from "../landing/landing.registry";

/**
 * Every internal URL in the app, in one place.
 *
 * Keys are English identifiers; values are the German public slugs, which
 * are the SEO asset and must not change without a redirect. Nothing outside
 * this file should build a path by hand — that way a URL change is one edit
 * here and every link, the nav and the sitemap follow.
 */
export const ROUTES = {
  home: "/",
  houses: "/hauser",
  house: (slug: string) => `/haus/${slug}`,
  showhouse: (slug: string) => `/musterhaus/${slug}`,
  promise: "/bauen-mit-boholz",
  yourHouse: "/ihr-neues-zuhause",
  about: "/uber-uns",
  news: "/news",
  newsArticle: (slug: string) => `/news/${slug}`,
  contact: "/kontakt",
  catalog: "/katalog",
  career: "/karriere",
  onsite: "/vor-ort-beratung",
  imprint: "/impressum",
  privacy: "/datenschutz",
  cookies: "/cookies",
  /** Typology landing pages — `landing.registry.ts` owns which ones exist. */
  landing: (slug: LandingCategory) => `/wohnen/${slug}`,
} as const;
