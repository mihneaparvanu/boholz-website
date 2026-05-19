import type {
  SortField,
  SortOption,
  BooleanFilter,
  EnumFilter,
  CountFilter,
  FilterOption,
} from "./filter-panel.types";
import { parseLivingArea } from "@/utils/parseLivingArea";

// Sorting
// `livingArea` and `price` are stored as Postgres `numeric` -> string in
// drizzle. Resolve them to `number | null` so comparators don't have to
// guess at locale-compare semantics. Default sort + this resolve share
// the same parser (parseLivingArea / Number) for consistency.
export const sortFields: SortField[] = [
  {
    value: "livingArea",
    label: "Fläche",
    resolve: (m) => parseLivingArea(m.livingArea),
  },
  {
    value: "price",
    label: "Preis",
    resolve: (m) => {
      if (m.price == null) return null;
      const n = Number(m.price);
      return Number.isFinite(n) ? n : null;
    },
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
      value: `${field.value}-asc`,
      label: field.label + " " + "↑",
      resolve: field.resolve,
      direction: "asc",
    },
    {
      value: `${field.value}-desc`,
      label: field.label + " " + "↓",
      resolve: field.resolve,
      direction: "desc",
    },
  ]);
};

export const sortOptions = generateSortOptions(sortFields);

// Filtering
// `id` is the dedup / URL key — keep it stable and unique across the array.
const hasGarage: BooleanFilter = {
  id: "hasGarage",
  kind: "boolean",
  label: "Garage",
  resolve: (m) => m.details?.hasGarage ?? null,
};

const bedroomNumber: CountFilter = {
  id: "bedroomCount",
  kind: "count",
  label: "Schlafzimmer",
  values: [1, 2, 3],
  resolve: (m) => m.details?.bedroomCount || null,
};

const bathroomCount: CountFilter = {
  id: "bathroomCount",
  kind: "count",
  label: "Badezimmer",
  values: [1, 2],
  resolve: (m) => m.details?.bathroomCount || null,
};

const hasKniestock: BooleanFilter = {
  id: "hasKniestock",
  kind: "boolean",
  label: "Kniestock",
  resolve: (m) => (m.details != null ? m.details.kniestock != null : null),
};

const roofType: EnumFilter = {
  id: "roofType",
  kind: "enum",
  label: "Dachtyp",
  options: ["Satteldach", "Walmdach", "Flachdach", "Pultdach"],
  resolve: (m) => m.details?.roofType ?? null,
};

export const filterOptions: FilterOption[] = [
  hasGarage,
  hasKniestock,
  roofType,
  bedroomNumber,
  bathroomCount,
];
