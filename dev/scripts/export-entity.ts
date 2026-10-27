import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

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
