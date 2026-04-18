export const ROUTES = {
  home: "/",
  houses: "/houses",
  house: (slug: string) => `/haus/${slug}`,
  yourHouse: "deine-zuhause",
  advantages: "versprechen",
  aboutUS: "uber-uns",
  contact: "kontakt",
} as const;

export interface NavRoute {
  label: string;
  path: string;
}

export const NAV_ROUTES: NavRoute[] = [
  { label: "Häuser", path: ROUTES.houses },
  { label: "Dein Zuhause", path: ROUTES.yourHouse },
  { label: "Unser Versprechen", path: ROUTES.advantages },
  { label: "Über Uns", path: ROUTES.aboutUS },
  { label: "Kontakt", path: ROUTES.contact },
];

export default NAV_ROUTES;
