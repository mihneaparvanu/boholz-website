import type { APIRoute } from "astro";
import { getNews, getModels, getLocations } from "@/db/loaders";
import { landingCategories } from "@/features/landing/landing.registry";
import { ROUTES } from "@/features/navigation/routes";

// Fallback origin if `site` is somehow unset (it's configured in astro.config.mjs).
const FALLBACK_SITE = "https://boholz-haus.de";

// Static, indexable routes. Every path comes from ROUTES, so changing a URL
// is a single edit there and the sitemap follows. Excludes api/*, 404, and
// /freigabe (internal approval page).
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

// Derived from the landing registry: adding a landing page is one line there
// and it appears here automatically — no second list to keep in sync.
const LANDING_PATHS: string[] = landingCategories.map(ROUTES.landing);

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

// SSR endpoint: queried at request time, so the sitemap always reflects the
// current DB (published news, models, showhouses) without a rebuild.
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? FALLBACK_SITE).replace(/\/$/, "");

  const entries: Entry[] = [...STATIC_PATHS, ...LANDING_PATHS].map((p) => ({
    loc: base + p,
  }));

  const [news, models, showhouses] = await Promise.all([
    getNews(),
    getModels(),
    getLocations({ kind: "showhouse" }),
  ]);

  for (const n of news) {
    entries.push({
      loc: base + ROUTES.newsArticle(n.slug),
      lastmod: iso(n.publishedAt ?? n.createdAt),
    });
  }
  for (const m of models) {
    entries.push({
      loc: base + ROUTES.house(m.slug),
      lastmod: iso(m.createdAt),
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
