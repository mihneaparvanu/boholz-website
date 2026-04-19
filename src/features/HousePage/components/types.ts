import type { LucideIcon } from "lucide-vue-next";
import type { HouseModel } from "../../../types/models";

export interface Detail {
  label: string;
  icon: LucideIcon;
  value: string;
}

export interface DetailConfig {
  label: string;
  icon: LucideIcon;
  resolve: (model: HouseModel) => string | number | boolean | null | undefined;
  format?: (raw: string | number | boolean) => string;
}
