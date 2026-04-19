import type { LucideIcon } from "lucide-vue-next";
import type { HouseModel } from "../../../types/models";

export interface Detail {
  label: string;
  icon: LucideIcon;
  value: string;
}

/**
 * Config entry: maps a label + icon to a field on the model/details.
 * `resolve` pulls the raw value from the model; `format` turns it into a display string.
 */
export interface DetailConfig {
  label: string;
  icon: LucideIcon;
  resolve: (model: HouseModel) => string | number | boolean | null | undefined;
  format?: (raw: string | number | boolean) => string;
}
