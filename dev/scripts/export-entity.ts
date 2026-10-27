import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

/**
 * Writes one generated domain file and returns the path it wrote.
 *
 * Owns the five things every export shares: where the file goes, the
 * declaration it emits, prettier (with the repo's own config), creating the
 * directory, and reporting the count. The caller owns the one thing that
 * differs — mapping DB rows to the shape the file should hold.
 *
 * `typeExpr` exists because the two file shapes are different sentences:
 * an array satisfies `Thing[]`, a slug-keyed record satisfies
 * `Record<string, Thing>`. It defaults to the array form, so only keyed
 * entities mention it.
 *
 * Note the paths are relative to THIS file, not to the calling script — so
 * moving this file breaks every export at once, and moving a caller breaks
 * nothing.
 */
export async function exportEntity(opts: {
  entity: string;
  typeName: string;
  data: unknown[] | Record<string, unknown>;
  typeExpr?: string;
}): Promise<string> {
  const { entity, typeName, data, typeExpr } = opts;

  const here = dirname(fileURLToPath(import.meta.url));
  const out = join(here, "../..", `src/domain/${entity}/${entity}.ts`);

  const type = typeExpr ?? `${typeName}[]`;
  const json = JSON.stringify(data, null, 2);

  const file = `import type { ${typeName} } from "./${entity}.types";

export const ${entity} = ${json} satisfies ${type};
`;

  const cfg = await prettier.resolveConfig(out);
  const pretty = await prettier.format(file, { ...cfg, filepath: out });

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, pretty, "utf-8");

  const count = Array.isArray(data) ? data.length : Object.keys(data).length;
  console.log(`wrote ${count} ${entity} -> ${out}`);

  return out;
}
