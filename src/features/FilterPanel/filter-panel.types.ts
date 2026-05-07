import type { HouseModel } from "../../types/models";

export type SortDirection = "asc" | "desc";

export interface SortField {
  value: string;
  label: string;
  resolveFromModel: (model: HouseModel) => string | number | null;
}
export interface SortOption extends SortField {
  direction: SortDirection;
}
