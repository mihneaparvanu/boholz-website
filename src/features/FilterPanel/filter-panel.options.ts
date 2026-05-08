import type { HouseModel } from "../../types/models";
import type {
  SortField,
  SortOption,
  BooleanFilter,
  EnumFilter,
  CountFilter,
  FilterOption,
} from "./filter-panel.types";

// Sorting
export const sortFields: SortField[] = [
  {
    value: "livingArea",
    label: "Flache",
    resolve: (m) => m.livingArea,
  },
  {
    value: "price",
    label: "Preis",
    resolve: (m) => m.price,
  },
  {
    value: "floorCount",
    label: "Etagen",
    resolve: (m) => m.details?.levelCount ?? null,
  },
  {
    value: "bedroomCount",
    label: "Schlafzimmer",
    resolve: (m) => m.details?.bedroomCount ?? null,
  },
];

const generateSortOptions = (fields: SortField[]): SortOption[] => {
  return fields.flatMap((field) => [
    {
      value: field.value,
      label: field.label + " " + "↑",
      resolve: field.resolve,
      direction: "asc",
    },
    {
      value: field.value,
      label: field.label + " " + "↓",
      resolve: field.resolve,
      direction: "desc",
    },
  ]);
};

export const sortOptions = generateSortOptions(sortFields);

// Filtering
const hasGarage: BooleanFilter = {
  kind: "boolean",
  label: "Garage",
  resolve: (m) => m.details?.hasGarage ?? null,
};

const bedroomNumber: CountFilter = {
  kind: "count",
  label: "Schlafzimmer",
  values: [1, 2, 3],
  resolve: (m) => m.details?.bedroomCount || null,
};

const bathroomCount: CountFilter = {
  kind: "count",
  label: "Badezimmer",
  values: [1, 2],
  resolve: (m) => m.details?.bathroomCount || null,
};

export const filterOptions: FilterOption[] = [hasGarage, bedroomNumber];
