import type { AttachedImage } from "../media/image.types";
import type { AgentSlug } from "../agents/agents.types";

export type PlaceKind = "headquarters" | "office" | "showhouse";

export type Place = {
  slug: string;
  title: string;
  kind: PlaceKind;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  agents: AgentSlug[];
  media: AttachedImage[];
};
