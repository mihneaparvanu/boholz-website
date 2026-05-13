import { db } from "../src/db/db";
import { agents, showhouses, showhouseAgents, agentMedia, media } from "../src/db/schema";
import { sql } from "drizzle-orm";

const agentRows = await db.select().from(agents);
const showhouseRows = await db.select().from(showhouses);
const showhouseAgentRows = await db.select().from(showhouseAgents);
const agentMediaRows = await db.select().from(agentMedia);

// Check for any orphaned / missing agent photo media
const agentsWithMedia = await db
  .select({ agentId: agentMedia.agentId, path: media.path, label: agentMedia.label })
  .from(agentMedia)
  .innerJoin(media, sql`${agentMedia.mediaId} = ${media.id}`);

console.log("=== AGENTS ===");
console.log(JSON.stringify(agentRows, null, 2));
console.log("\n=== SHOWHOUSES ===");
console.log(JSON.stringify(showhouseRows, null, 2));
console.log("\n=== SHOWHOUSE <-> AGENTS ===");
console.log(JSON.stringify(showhouseAgentRows, null, 2));
console.log("\n=== AGENT MEDIA ===");
console.log(JSON.stringify(agentsWithMedia, null, 2));
process.exit(0);
