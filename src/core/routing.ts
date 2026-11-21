export const PAGE_ROUTES = {
  about: "uber-uns",
  career: "karriere",
  catalog: "katalog",
  contact: "kontakt",
  cookies: "cookies",
  home: "",
  houses: "hauser",
  imprint: "impressum",
  news: "news",
  onsite: "vor-ort-beratung",
  privacy: "datenschutz",
  promise: "bauen-mit-boholz",
  yourHouse: "ihr-neues-zuhause",
} as const;

export const ITEM_ROUTES = {
  houses: "haus",
  landing: "wohnen",
  news: "news",
  showhouse: "musterhaus",
} as const;

export type PageKey = keyof typeof PAGE_ROUTES;
export type ItemKey = keyof typeof ITEM_ROUTES;
export type RouteKey = PageKey | ItemKey;

export const pagePath = (key: PageKey) => `/${PAGE_ROUTES[key]}`;

export const itemPath = (key: ItemKey, slug: string) =>
  `/${ITEM_ROUTES[key]}/${slug}`;
