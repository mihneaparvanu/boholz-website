import type { LucideIcon } from "lucide-vue-next";
import type { HouseModel } from "@/db/models";

export interface DisplayItem {
  label: string;
  icon: LucideIcon;
  value: string;
}

export interface DisplayItemConfig {
  label: string;
  icon: LucideIcon;
  resolve: (model: HouseModel) => string | number | boolean | null | undefined;
  format?: (raw: string | number | boolean) => string;
  /** Shown when `resolve` yields null/undefined. Without it, the stat is
   *  dropped entirely (e.g. the MFH concepts whose Fläche is "auf Anfrage"). */
  fallback?: string;
}
