import { agents } from "@/domain/agents/agents";
import { type AgentSlug } from "@/domain/agents/agents.types";
import { getLocations } from "@/db/loaders";
import type { LocationRecord } from "@/domain/locations/locations.types";

const isAgentSlug = (s: string): s is AgentSlug => s in agents;

const loc = await getLocations();

const exported: LocationRecord = loc.map((l) => {
    slug: l.slug,
    title: l.title,
    email: l.email,
    kind: l.kind,
    
});
