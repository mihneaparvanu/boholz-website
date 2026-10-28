import "./_bare-paths";

import { agents } from "@/domain/agents/agents";
import { type AgentSlug } from "@/domain/agents/agents.types";
import { getLocations } from "@/db/loaders";
import type { Location } from "@/domain/locations/locations.types";

import { exportEntity } from "./export-entity";

// `s is AgentSlug` = if this returns true, treat s as a known agent slug.
// Replaces the foreign key: a location pointing at a missing agent throws.
const isAgentSlug = (s: string): s is AgentSlug => s in agents;

const loc = await getLocations();

const exported: Location[] = loc.map((l) => ({
  slug: l.slug,
  title: l.title,
  email: l.email,
  kind: l.kind,
  address: l.address,
  postalCode: l.postalCode,
  city: l.city,
  country: l.country,
  phone: l.phone,
  // numeric columns — Drizzle reports these as strings, not numbers
  lat: l.lat,
  lng: l.lng,
  agents: l.agents.map((la) => {
    if (!isAgentSlug(la.agent.slug)) {
      throw new Error(
        `location "${l.slug}" points at unknown agent "${la.agent.slug}"`,
      );
    }
    return { slug: la.agent.slug, isPrimary: la.isPrimary };
  }),
  media: l.media.map((m) => ({
    isHero: m.isHero,
    isThumbnail: m.isThumbnail,
    classification: m.classification,
    path: m.media.path,
    isAi: m.media.isAi,
    alt: m.media.alt,
    width: m.media.width,
    height: m.media.height,
  })),
}));

await exportEntity({
  entity: "locations",
  typeName: "Location",
  data: exported,
});

process.exit(0);
