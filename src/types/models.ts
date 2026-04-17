export type ImageCategory =
  | "hero"
  | "gallery"
  | "floorplan"
  | "interior"
  | "exterior";

export interface HouseModelImage {
  id: string;
  house_model_id: string;
  url: string;
  alt_text: string;
  category: ImageCategory; 
  sort_order: number;
  is_primary: boolean;
  width?: number;
  height?: number; 
}

export interface HouseModel {
  id: string;
  name: string;
  description: string;
  living_area_sqm: number;
  rooms: number;
  house_model_images?: HouseModelImage[];
}
