import About from "@/views/about/About.astro";
import Careers from "@/views/careers/Careers.astro";
import Catalog from "@/views/catalog/Catalog.astro";
import Contact from "@/views/contact/Contact.astro";
import Home from "@/views/home/Home.astro";
import HouseModel from "@/views/house-models/HouseModel.astro";
import HouseModels from "@/views/house-models/HouseModels.astro";
import Landing from "@/views/landing/Landing.astro";
import Legal from "@/views/legal/Legal.astro";
import News from "@/views/news/News.astro";
import NewsArticle from "@/views/news/NewsArticle.astro";
import OnSite from "@/views/on-site/OnSite.astro";
import Promise from "@/views/promise/Promise.astro";
import Showhouse from "@/views/showhouse/Showhouse.astro";
import YourHouse from "@/views/your-house/YourHouse.astro";

import { houseModels } from "@/domain/house-models/houseModels";
import { landingPagesKeys } from "@/features/landing/landing.registry";
import { getCollection } from "astro:content";
const newsArticles = await getCollection("news");
import { showhouses } from "@/domain/locations/locations";

import { ITEM_ROUTES, itemPath, PAGE_ROUTES, pagePath } from "@/core/routing";
import type { ItemKey, PageKey, RouteKey } from "@/core/routing";

interface ViewProps {
  key: RouteKey;
  slug?: string;
}

export type ViewComponent = (props: ViewProps) => unknown;

type Page = { key: RouteKey; slug?: string; path: string; view: ViewComponent };

const page = (key: PageKey, view: ViewComponent): Page => ({
  key,
  view,
  path: pagePath(key),
});

const items = (
  key: ItemKey,
  view: ViewComponent,
  slugs: readonly string[],
): Page[] =>
  slugs.map((slug) => ({ key, slug, view, path: itemPath(key, slug) }));

const collection = (
  key: PageKey & ItemKey,
  v: { index: ViewComponent; item: ViewComponent; slugs: readonly string[] },
): Page[] => [page(key, v.index), ...items(key, v.item, v.slugs)];

const PAGES = [
  page("about", About),
  page("career", Careers),
  page("catalog", Catalog),
  page("contact", Contact),
  page("cookies", Legal),
  page("home", Home),
  collection("houses", {
    index: HouseModels,
    item: HouseModel,
    slugs: houseModels.map((m) => m.slug),
  }),
  page("imprint", Legal),
  items("landing", Landing, landingPagesKeys),
  collection("news", {
    index: News,
    item: NewsArticle,
    slugs: newsArticles.map((a) => a.id),
  }),
  page("onsite", OnSite),
  page("privacy", Legal),
  page("promise", Promise),
  items(
    "showhouse",
    Showhouse,
    showhouses.map((s) => s.slug),
  ),
  page("yourHouse", YourHouse),
].flat();

const covered = new Set<string>(PAGES.map((p) => p.key));

for (const key of [...Object.keys(PAGE_ROUTES), ...Object.keys(ITEM_ROUTES)]) {
  if (!covered.has(key)) throw new Error(`views: no view for ${key}`);
}

export const paths = () =>
  PAGES.map(({ key, slug, view, path }) => ({
    params: { path: path.slice(1) || undefined },
    props: { key, slug, view },
  }));
