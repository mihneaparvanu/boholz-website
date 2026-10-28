import type { LocationWithAgents } from "@/db/models";
import type { Image } from "../media/image.types";
import type { AgentSlug } from "../agents/agents.types";

export type LocationImage = Image &
  Omit<LocationWithAgents["media"][number], "media" | "sortOrder">;
export type LocationAgentLink = { slug: AgentSlug; isPrimary: boolean | null };

export type Location = Omit<LocationWithAgents, "id" | "agents" | "media"> & {
  agents: LocationAgentLink[];
  media: LocationImage[];
};
