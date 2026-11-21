import About from "@/views/About.astro";



import type { RouteKey } from "@/core/routing";

interface ViewProps {
  key: RouteKey;
}

export type ViewComponent = (props: ViewProps) => unknown;

type View =
  | {
      kind: "page";
      View: ViewComponent;
    }
  | {
      kind: "collection";
      item: ViewComponent;
      slugs: readonly [string];
      index?: ViewComponent;
    };

type Page = { key: RouteKey; view: View; slug?: string };
