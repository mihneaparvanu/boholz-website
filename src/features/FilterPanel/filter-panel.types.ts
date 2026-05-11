import type { HouseModel } from "../../types/models";

// Sorting
export type SortDirection = "asc" | "desc";

export interface SortField {
  value: string;
  label: string;
  resolve: (m: HouseModel) => string | number | null;
}
export interface SortOption extends SortField {
  direction: SortDirection;
}

// Filtering
export type BooleanFilter = {
  kind: "boolean";
  label: string;
  resolve: (m: HouseModel) => boolean | null;
};

export type EnumFilter = {
  kind: "enum";
  label: string;
  options: string[];
  resolve: (m: HouseModel) => string | null;
};

export type CountFilter = {
  kind: "count";
  label: string;
  values: number[];
  resolve: (m: HouseModel) => number | null;
};

export type FilterOption = BooleanFilter | EnumFilter | CountFilter;

export type FilterState =
  | { status: "inactive"; filters: ActiveFilter[] }
  | { status: "pending"; filters: ActiveFilter[] }
  | { status: "confirmed"; filters: ActiveFilter[] };

//prettier-ignore
type ValueFor<F> =
    F extends BooleanFilter ? boolean :
    F extends CountFilter   ? number  :
    F extends EnumFilter    ? string  :
    never;

//prettier-ignore
export type ActiveFilter =
FilterOption extends infer F ? { option: F; value: ValueFor<F> } :
never;
