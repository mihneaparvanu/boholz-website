import type { AttachedImage } from "../media/image.types";
import type { AgentSlug } from "../agents/agents.types";

export type PlaceKind = "showhouse" | "office";

export type Place = {
  slug: string;
  title: string;
  email: string;
  kind: PlaceKind;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  lat: string;
  lng: string;
  agents: AgentSlug[];
  media: AttachedImage[];
};
