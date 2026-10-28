import type { APIRoute } from "astro";
import { houseModels as models } from "@/domain/house-models/houseModels";
import { locations } from "@/domain/locations/locations";
import { news } from "@/domain/news/news";
import { ROUTES } from "@/features/navigation/routes";

const FALLBACK_SITE = "https://boholz-haus.de";

const STATIC_PATHS: string[] = [
  ROUTES.home,
  ROUTES.houses,
  ROUTES.news,
  ROUTES.contact,
  ROUTES.catalog,
  ROUTES.career,
  ROUTES.about,
  ROUTES.onsite,
  ROUTES.promise,
  ROUTES.yourHouse,
  ROUTES.imprint,
  ROUTES.privacy,
  ROUTES.cookies,
];

type Entry = { loc: string; lastmod?: string };

const iso = (d: Date | string | null | undefined): string | undefined => {
  if (!d) return undefined;
  const date = d instanceof Date ? d : new Date(d);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const xml = (s: string): string =>
  s.replace(/[<>&'"]/g, (c) =>
    c === "<"
      ? "&lt;"
      : c === ">"
        ? "&gt;"
        : c === "&"
          ? "&amp;"
          : c === "'"
            ? "&apos;"
            : "&quot;",
  );

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? FALLBACK_SITE).replace(/\/$/, "");

  const entries: Entry[] = STATIC_PATHS.map((p) => ({ loc: base + p }));

  // news and locations come from files now, so only models is awaited
  const showhouses = locations.filter((l) => l.kind === "showhouse");

  for (const n of news) {
    entries.push({
      loc: base + ROUTES.newsArticle(n.slug),
      // createdAt is not carried into the domain files; the one evergreen
      // post has no publishedAt and so gets no lastmod, which is optional.
      lastmod: iso(n.publishedAt),
    });
  }
  for (const m of models) {
    entries.push({
      loc: base + ROUTES.house(m.slug),
      // createdAt is not carried into the domain files, so model entries
      // have no lastmod. It is an optional hint, not a requirement.
    });
  }
  for (const s of showhouses) {
    entries.push({ loc: base + ROUTES.showhouse(s.slug) });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${xml(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
