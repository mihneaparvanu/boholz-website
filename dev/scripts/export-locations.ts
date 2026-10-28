import "./_bare-paths";

import { agents } from "@/domain/agents/agents";
import { type AgentSlug } from "@/domain/agents/agents.types";
import { getLocations } from "@/db/loaders";
import type { Place, PlaceKind } from "@/domain/locations/locations.types";

import { toAttachedImage } from "./attached-image";
import { exportEntity } from "./export-entity";
import { toNumber } from "./numeric";

// `s is AgentSlug` = if this returns true, treat s as a known agent slug.
// Replaces the foreign key: a location pointing at a missing agent throws.
const isAgentSlug = (s: string): s is AgentSlug => s in agents;

const PLACE_KINDS = [
  "headquarters",
  "office",
  "showhouse",
] as const satisfies readonly PlaceKind[];

const isPlaceKind = (s: string): s is PlaceKind =>
  (PLACE_KINDS as readonly string[]).includes(s);

const loc = await getLocations();

// The columns below are nullable because the table predates the domain type,
// which declares them present. A row that breaks that promise should not ship.
const exported: Place[] = loc.map((l) => {
  if (!isPlaceKind(l.kind)) {
    throw new Error(`location "${l.slug}" has unknown kind "${l.kind}"`);
  }
  if (
    l.address === null ||
    l.postalCode === null ||
    l.city === null ||
    l.country === null
  ) {
    throw new Error(`location "${l.slug}" is missing part of its address`);
  }

  return {
    slug: l.slug,
    title: l.title,
    email: l.email,
    kind: l.kind,
    address: l.address,
    postalCode: l.postalCode,
    city: l.city,
    country: l.country,
    phone: l.phone,
    lat: toNumber(l.lat),
    lng: toNumber(l.lng),
    // getLocations() orders the pivot by sortOrder, which already puts the
    // primary agent first, so the flag carries nothing the order doesn't.
    agents: l.agents.map((la) => {
      if (!isAgentSlug(la.agent.slug)) {
        throw new Error(
          `location "${l.slug}" points at unknown agent "${la.agent.slug}"`,
        );
      }
      return la.agent.slug;
    }),
    media: l.media.map(toAttachedImage),
  };
});

await exportEntity({
  entity: "locations",
  typeName: "Place",
  data: exported,
});

process.exit(0);
