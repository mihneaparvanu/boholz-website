import About from "@/views/about/About.astro";
import Careers from "@/views/careers/Careers.astro";
import Catalog from "@/views/catalog/Catalog.astro";
import Contact from "@/views/contact/Contact.astro";

import type { RouteKey } from "@/core/routing";

interface ViewProps {
  key: RouteKey;
}

export type ViewComponent = (props: ViewProps) => unknown;

type View =
  | {
      kind: "page";
      view: ViewComponent;
    }
  | {
      kind: "collection";
      item: ViewComponent;
      slugs: readonly [string];
      index?: ViewComponent;
    };

const VIEWS = {
  about: { kind: "page", view: About },
  career: { kind: "page", view: Careers },
  catalog: { kind: "page", view: Catalog },
  contact: {kind: "page", view: Contact},
  cookies,
  landing
  news

} satisfies Record<RouteKey, View>;

type Page = { key: RouteKey; view: View; slug?: string };
