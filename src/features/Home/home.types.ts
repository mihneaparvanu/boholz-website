import type { HouseModel } from "@/types/models";

// --- Hero -----------------------------------------------------------

export type HeroSlide = Pick<HouseModel, "id" | "slug" | "title"> & {
  heroImgURL: string | null;
};

// --- Overview grid --------------------------------------------------

export interface OverviewCardImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface OverviewCardData {
  heading: string;
  subheading?: string;
  image?: OverviewCardImage;
  featured?: boolean;
}

// --- Building stages (Ausbaustufen) ---------------------------------

export interface BuildingStage {
  slug: string;
  title: string;
  description: string;
  imageURL: string | null;
}
