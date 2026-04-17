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
  category: ImageCategory; // This is the secret to staying sane
  sort_order: number;
  is_primary: boolean;
  width?: number; // Highly recommended for preventing Cumulative Layout Shift (CLS)
  height?: number; // Highly recommended for preventing Cumulative Layout Shift (CLS)
}

export interface HouseModel {
  id: string;
  name: string;
  description: string;
  living_area_sqm: number;
  rooms: number;
  // Included when you do a Supabase join query: select('*, house_model_images(*)')
  house_model_images?: HouseModelImage[];
}
