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
}): Promise<string> {
  const { entity, typeName, data, typeExpr } = opts;
  // `entity` names the folder and the file, so it is kebab-case. A const
  // cannot contain a hyphen, so a multi-word entity passes its own name.
  const exportName = opts.exportName ?? entity;
  const fileName = opts.fileName ?? entity;

  const here = dirname(fileURLToPath(import.meta.url));
  const out = join(here, "../..", `src/domain/${entity}/${fileName}.ts`);

  const type = typeExpr ?? `${typeName}[]`;
  const json = JSON.stringify(data, null, 2);

  const file = `import type { ${typeName} } from "./${entity}.types";

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
