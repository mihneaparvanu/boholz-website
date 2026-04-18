export const ROUTES = {
  home: "/",
  about: "/about",
  houses: "/hauser",
  services: "/services",
  contact: "/contact",
  projects: "/projects",
  blog: "/blog",
  careers: "/careers",
  faq: "/faq",
  model: (model: string, category: string) => `/hauser/${category}/${model}`,
};
