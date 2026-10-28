import "./_bare-paths";

import { db } from "@/db/db";
import { getMediaURL } from "@/lib/media";
import type { Image } from "@/domain/media/image.types";

import { exportEntity } from "./export-entity";

/**
 * Media rows that no pivot table points at.
 *
 * The files are still in the bucket — a sample of eight returned seven 200s
 * and one 404, so the database and R2 have drifted both ways. What is only in
 * the database is the metadata: alt text, dimensions, and the isAi flag, which
 * exists nowhere else. Ten of these are the AI-generated gallery images for
 * bungalow-22-134 and einfamilienhaus-28-194-170, two models that currently
 * show one and two photographs.
 *
 * Imported by nothing. This is a record of what exists, not content.
 */
const rows = await db.query.media.findMany({
  orderBy: (m, { asc }) => [asc(m.path)],
});

const linked = new Set<string>();
for (const t of [
  await db.query.modelMedia.findMany(),
  await db.query.categoryMedia.findMany(),
  await db.query.newsMedia.findMany(),
  await db.query.locationMedia.findMany(),
  await db.query.floorMedia.findMany(),
  await db.query.agentMedia.findMany(),
]) {
  for (const row of t) linked.add(row.mediaId);
}

const orphans: Image[] = rows
  .filter((m) => !linked.has(m.id))
  .map((m) => ({
    // getMediaURL is the identity function with PUBLIC_ASSETS_URL unset, which
    // is how every other export keeps the stored path rather than a CDN URL.
    path: getMediaURL(m.path),
    alt: m.alt,
    width: m.width,
    height: m.height,
    isAi: m.isAi,
  }));

await exportEntity({
  entity: "media",
  fileName: "media.orphans",
  typesFile: "image.types",
  exportName: "orphanMedia",
  typeName: "Image",
  data: orphans,
});

process.exit(0);
