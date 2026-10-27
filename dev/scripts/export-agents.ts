import { db } from "@/db/db";

const agents = await db.query.agents.findMany();

const exported = Object.fromEntries(
  agents.map((a) => [
    a.slug,
    {
      fullName: a.fullName,
      email: a.email,
      phoneNumber: a.phoneNumber,
      phoneSecondary: a.phoneSecondary,
      role: a.role,
    },
  ]),
);

// File setup
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "../..", "src/domain/agents/agents.ts");
const file = `import { type AgentRecord } from "./agents.types";
export const agents = ${JSON.stringify(exported, null, 2)} satisfies Record<string, AgentRecord>;`;

// Prettier
import prettier from "prettier";
const cfg = await prettier.resolveConfig(out);
const pretty = await prettier.format(file, { ...cfg, filepath: out });

// Create file
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pretty, "utf-8");
