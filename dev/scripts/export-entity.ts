import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

export async function exportEntity(opts: {
  entity: string;
  typeName: string;
  data: unknown[] | Record<string, unknown>;
  typeExpr?: string;
  exportName?: string;
  /** A second file inside the same entity folder, e.g. the parked models.
   *  Defaults to the entity name. The types import always points at
   *  `<entity>.types`, since both files describe the same shape. */
  fileName?: string;
  /** The types module to import from, when it is not `<entity>.types` —
   *  media's shared type lives in `image.types`. */
  typesFile?: string;
}): Promise<string> {
  const { entity, typeName, data, typeExpr } = opts;
  // `entity` names the folder and the file, so it is kebab-case. A const
  // cannot contain a hyphen, so a multi-word entity passes its own name.
  const exportName = opts.exportName ?? entity;
  const fileName = opts.fileName ?? entity;
  const typesFile = opts.typesFile ?? `${entity}.types`;

  const here = dirname(fileURLToPath(import.meta.url));
  const out = join(here, "../..", `src/domain/${entity}/${fileName}.ts`);

  const type = typeExpr ?? `${typeName}[]`;
  // Stored paths stay raw in the source — portable, greppable, and no CDN host
  // baked into a generated file. They are wrapped in getMediaURL() so the value
  // resolves at module load against whatever PUBLIC_ASSETS_URL is set, which is
  // exactly what resolveMediaPaths() in the old loader did per request.
  const raw = JSON.stringify(data, null, 2);

  // Every stored path must be the bare path, not a resolved CDN URL. If
  // PUBLIC_ASSETS_URL is in scope when an export runs, the loader resolves the
  // paths before they get here and they would then be resolved a second time
  // at module load. This fired the first time it existed.
  const bad = [...raw.matchAll(/"path": "([^"]*)"/g)]
    .map((m) => m[1]!)
    .filter((v) => !v.startsWith("/"));
  if (bad.length > 0) {
    throw new Error(
      `${bad.length} path(s) are not bare paths — unset PUBLIC_ASSETS_URL and re-run.\n  e.g. ${bad[0]}`,
    );
  }
  const json = raw.replace(/"path": "([^"]*)"/g, 'path: getMediaURL("$1")');
  const wrapped = (raw.match(/"path": "/g) ?? []).length;
  const emitted = (json.match(/path: getMediaURL\(/g) ?? []).length;
  if (wrapped !== emitted) {
    throw new Error(
      `path rewrite lost one: ${wrapped} found, ${emitted} emitted`,
    );
  }

  const mediaImport =
    wrapped > 0 ? '\nimport { getMediaURL } from "@/lib/media";' : "";

  const file = `import type { ${typeName} } from "./${typesFile}";${mediaImport}

export const ${exportName} = ${json} satisfies ${type};
`;

  const cfg = await prettier.resolveConfig(out);
  const pretty = await prettier.format(file, { ...cfg, filepath: out });

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, pretty, "utf-8");

  const count = Array.isArray(data) ? data.length : Object.keys(data).length;
  console.log(`wrote ${count} ${fileName} -> ${out}`);

  return out;
}
