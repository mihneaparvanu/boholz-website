import type { HouseModel } from "@/types/models";

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
//
// Each filter option has a stable `id` — used as the identity key for
// deduplication, toggling, and URL serialization. The `id` must be unique
// across all filter options regardless of `kind`; two `count` options
// (e.g. bedrooms vs. bathrooms) can share the same numeric value space, so
// dedup MUST be against the (id, value) tuple — never value alone.
export type BooleanFilter = {
  id: string;
  kind: "boolean";
  label: string;
  resolve: (m: HouseModel) => boolean | null;
};

export type EnumFilter = {
  id: string;
  kind: "enum";
  label: string;
  options: string[];
  resolve: (m: HouseModel) => string | null;
};

export type CountFilter = {
  id: string;
  kind: "count";
  label: string;
  values: number[];
  resolve: (m: HouseModel) => number | null;
};

export type ThresholdFilter = {
  id: string;
  kind: "threshold";
  label: string;
  // Each option carries its own predicate so the URL can serialize a
  // human-readable label ("<150") without needing range encoding.
  options: Array<{ label: string; predicate: (m: HouseModel) => boolean }>;
};

export type FilterOption =
  | BooleanFilter
  | EnumFilter
  | CountFilter
  | ThresholdFilter;

// The state machine:
//   inactive  — no filters at all (initial)
//   pending   — user has clicked filter chips but hasn't pressed "Entdecken";
//               the grid still shows the previous confirmed result so the
//               page doesn't churn under them. The panel shows a live preview
//               count via `modelsCount`.
//   confirmed — pending was confirmed; the grid now reflects `filters`.
//
// Panel close without confirming reverts to the last confirmed state
// (see HousesPage.handleClosePanel). This keeps the contract:
// "what's on screen is what the user opted into".
export type FilterState =
  | { status: "inactive"; filters: ActiveFilter[] }
  | { status: "pending"; filters: ActiveFilter[] }
  | { status: "confirmed"; filters: ActiveFilter[] };

//prettier-ignore
type ValueFor<F> =
    F extends BooleanFilter   ? boolean :
    F extends CountFilter     ? number  :
    F extends EnumFilter      ? string  :
    F extends ThresholdFilter ? string  :
    never;

//prettier-ignore
export type ActiveFilter =
FilterOption extends infer F ? { option: F; value: ValueFor<F> } :
never;
