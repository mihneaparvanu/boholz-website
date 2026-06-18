import type { APIRoute } from "astro";
import { getNews, getModels, getLocations } from "@/db/loaders";

// Fallback origin if `site` is somehow unset (it's configured in astro.config.mjs).
const FALLBACK_SITE = "https://boholz-haus.de";

// Static, indexable routes. Excludes api/*, 404, and vorschau-anspruch (preview).
const STATIC_PATHS = [
  "/",
  "/hauser",
  "/news",
  "/kontakt",
  "/katalog",
  "/karriere",
  "/uber-uns",
  "/vor-ort-beratung",
  "/bauen-mit-boholz",
  "/ihr-neues-zuhause",
  "/wohnen/bungalow",
  "/wohnen/mehrfamilien",
  "/impressum",
  "/datenschutz",
  "/cookies",
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

// SSR endpoint: queried at request time, so the sitemap always reflects the
// current DB (published news, models, showhouses) without a rebuild.
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? FALLBACK_SITE).replace(/\/$/, "");

  const entries: Entry[] = STATIC_PATHS.map((p) => ({ loc: base + p }));

  const [news, models, showhouses] = await Promise.all([
    getNews(),
    getModels(),
    getLocations({ kind: "showhouse" }),
  ]);

  for (const n of news) {
    entries.push({
      loc: `${base}/news/${n.slug}`,
      lastmod: iso(n.publishedAt ?? n.createdAt),
    });
  }
  for (const m of models) {
    entries.push({ loc: `${base}/haus/${m.slug}`, lastmod: iso(m.createdAt) });
  }
  for (const s of showhouses) {
    entries.push({ loc: `${base}/musterhaus/${s.slug}` });
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
