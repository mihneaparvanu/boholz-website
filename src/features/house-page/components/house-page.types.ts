import type { LucideIcon } from "lucide-vue-next";
import type { HouseModel } from "@/domain/house-models/houseModels.types";
import type { Displayable } from "@/lib/format";

export interface DisplayItem {
  label: string;
  icon: LucideIcon;
  value: string;
}

export interface DisplayItemConfig {
  label: string;
  icon: LucideIcon;
  resolve: (model: HouseModel) => Displayable | null | undefined;
  format?: (raw: Displayable) => string;
  /** Shown when `resolve` yields null/undefined. Without it, the stat is
   *  dropped entirely (e.g. the MFH concepts whose Fläche is "auf Anfrage"). */
  fallback?: string;
}
