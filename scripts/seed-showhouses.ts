/**
 * Seed script: Musterhäuser + Agents
 *
 * Run from project root:
 *   npx tsx scripts/seed-showhouses.ts
 *
 * REVIEW BEFORE RUNNING:
 *   - Update addresses for each showhouse
 *   - Update agent names, roles, phone, email
 *   - Update lat/lng if you have precise coordinates
 */

import { db } from "../src/db/db";
import {
  agents,
  showhouses,
  showhouseAgents,
} from "../src/db/schema";
import { eq } from "drizzle-orm";

// =========================================================================
// DATA — edit these before running
// =========================================================================

const SHOWHOUSES = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    title: "Musterhaus Bad Vilbel",
    slug: "bad-vilbel",
    address: "TODO: Straße und Hausnummer, 61118 Bad Vilbel", // ← update
    city: "Bad Vilbel",
    country: "Germany",
    lat: "50.1786",
    lng: "8.7347",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    title: "Musterhaus Fellbach",
    slug: "fellbach",
    address: "TODO: Straße und Hausnummer, 70734 Fellbach", // ← update
    city: "Fellbach",
    country: "Germany",
    lat: "48.8127",
    lng: "9.2741",
  },
];

const AGENTS = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    fullName: "TODO: Vorname Nachname", // ← update
    slug: "berater-bad-vilbel",
    role: "Hausberater",
    phoneNumber: "TODO: +49 ...", // ← update
    email: "TODO: name@boholz.de", // ← update
    bio: null,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    fullName: "TODO: Vorname Nachname", // ← update
    slug: "berater-fellbach",
    role: "Hausberater",
    phoneNumber: "TODO: +49 ...", // ← update
    email: "TODO: name@boholz.de", // ← update
    bio: null,
  },
];

// Which agent(s) belong to which showhouse
const ASSIGNMENTS: Array<{
  showhouseId: string;
  agentId: string;
  isPrimary: boolean;
}> = [
  {
    showhouseId: "10000000-0000-0000-0000-000000000001",
    agentId: "20000000-0000-0000-0000-000000000001",
    isPrimary: true,
  },
  {
    showhouseId: "10000000-0000-0000-0000-000000000002",
    agentId: "20000000-0000-0000-0000-000000000002",
    isPrimary: true,
  },
];

// =========================================================================
// INSERT (idempotent — skips existing rows by id)
// =========================================================================

async function seedAgents() {
  for (const agent of AGENTS) {
    const existing = await db
      .select({ id: agents.id })
      .from(agents)
      .where(eq(agents.id, agent.id));
    if (existing.length > 0) {
      console.log(`  skip agent: ${agent.fullName} (already exists)`);
      continue;
    }
    await db.insert(agents).values(agent);
    console.log(`  inserted agent: ${agent.fullName}`);
  }
}

async function seedShowhouses() {
  for (const sh of SHOWHOUSES) {
    const existing = await db
      .select({ id: showhouses.id })
      .from(showhouses)
      .where(eq(showhouses.id, sh.id));
    if (existing.length > 0) {
      console.log(`  skip showhouse: ${sh.title} (already exists)`);
      continue;
    }
    await db.insert(showhouses).values(sh);
    console.log(`  inserted showhouse: ${sh.title}`);
  }
}

async function seedAssignments() {
  for (const a of ASSIGNMENTS) {
    const existing = await db
      .select()
      .from(showhouseAgents)
      .where(eq(showhouseAgents.showhouseId, a.showhouseId));
    if (existing.length > 0) {
      console.log(
        `  skip assignment: ${a.showhouseId} <-> ${a.agentId} (already exists)`,
      );
      continue;
    }
    await db.insert(showhouseAgents).values({
      showhouseId: a.showhouseId,
      agentId: a.agentId,
      isPrimary: a.isPrimary,
      sortOrder: 0,
    });
    console.log(`  inserted assignment: ${a.showhouseId} <-> ${a.agentId}`);
  }
}

console.log("\n=== Seeding Agents ===");
await seedAgents();

console.log("\n=== Seeding Showhouses ===");
await seedShowhouses();

console.log("\n=== Seeding Showhouse <-> Agent assignments ===");
await seedAssignments();

console.log("\nDone ✓\n");

// Final state check
const finalAgents = await db.select().from(agents);
const finalShowhouses = await db.select().from(showhouses);
const finalAssignments = await db.select().from(showhouseAgents);

console.log("Agents in DB:", finalAgents.map((a) => a.fullName));
console.log("Showhouses in DB:", finalShowhouses.map((s) => s.title));
console.log("Assignments in DB:", finalAssignments.length);

process.exit(0);
