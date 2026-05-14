import "dotenv/config";
import { db } from "../src/db/db";
import { agents, locations, locationAgents, agentMedia, media } from "../src/db/schema";
import { sql } from "drizzle-orm";

const agentRows = await db.select().from(agents);
const locationRows = await db.select().from(locations);
const locationAgentRows = await db.select().from(locationAgents);

const agentsWithMedia = await db
  .select({ agentId: agentMedia.agentId, path: media.path, label: agentMedia.label })
  .from(agentMedia)
  .innerJoin(media, sql`${agentMedia.mediaId} = ${media.id}`);

console.log("=== AGENTS ===");
console.log(JSON.stringify(agentRows, null, 2));
console.log("\n=== LOCATIONS ===");
console.log(JSON.stringify(locationRows, null, 2));
console.log("\n=== LOCATION <-> AGENTS ===");
console.log(JSON.stringify(locationAgentRows, null, 2));
console.log("\n=== AGENT MEDIA ===");
console.log(JSON.stringify(agentsWithMedia, null, 2));
process.exit(0);
