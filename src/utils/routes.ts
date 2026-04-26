export const ROUTES = {
  home: "/",
  houses: "/hauser",
  house: (slug: string) => `/haus/${slug}`,
  promise: "/unser-versprechen",
  yourHouse: "/dein-zuhause",
  aboutUS: "/uber-uns",
  news: "/news",
  newsArticle: (slug: string) => `/news/${slug}`,
  contact: "/kontakt",
  impressum: "/impressum",
  datenschutz: "/datenschutz",
  cookies: "/cookies",
} as const;

export interface NavRoute {
  label: string;
  path: string;
}

export const NAV_ROUTES: NavRoute[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Das BoHolz Versprechen", path: ROUTES.promise },
  { label: "Dein Zuhause", path: ROUTES.yourHouse },
  { label: "Über Uns", path: ROUTES.aboutUS },
  { label: "News", path: ROUTES.news },
  { label: "Kontakt", path: ROUTES.contact },
];

export default NAV_ROUTES;
