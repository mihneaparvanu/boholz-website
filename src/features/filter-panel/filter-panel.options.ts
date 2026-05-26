import type {
  SortField,
  SortOption,
  BooleanFilter,
  EnumFilter,
  CountFilter,
  FilterOption,
  ThresholdFilter,
} from "./filter-panel.types";
import { parseLivingArea } from '@/lib/parse-living-area';

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
  {
    value: "title",
    label: "Name",
    resolve: (m) => m.title,
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

const livingAreaThreshold: ThresholdFilter = {
  id: "livingArea",
  kind: "threshold",
  label: "Wohnfläche",
  options: [
    {
      label: "<150",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a < 150;
      },
    },
    {
      label: "<170",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a < 170;
      },
    },
    {
      label: "<200",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a < 200;
      },
    },
    {
      label: ">200",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a > 200;
      },
    },
  ],
};

const allowsGrannyFlat: BooleanFilter = {
  id: "allowsGrannyFlat",
  kind: "boolean",
  label: "Einliegerwohnung",
  resolve: (m) => m.details?.allowsGrannyFlat ?? null,
};

export const filterOptions: FilterOption[] = [
  livingAreaThreshold,
  allowsGrannyFlat,
  hasGarage,
  hasKniestock,
  roofType,
  bedroomNumber,
  bathroomCount,
];
