import type { SortField, SortOption } from "./filter-panel.types";

export const sortFields: SortField[] = [
  {
    value: "livingArea",
    label: "Flache",
    resolveFromModel: (model) => model.livingArea,
  },
  {
    value: "price",
    label: "Preis",
    resolveFromModel: (model) => model.livingArea,
  },
  {
    value: "floorCount",
    label: "Etagen",
    resolveFromModel: (model) => model.livingArea,
  },
  {
    value: "bedroomCount",
    label: "Schlafzimmer",
    resolveFromModel: (model) => model.livingArea,
  },
];

const generateSortOptions = (fields: SortField[]): SortOption[] => {
  return fields.flatMap((field) => [
    {
      value: field.value,
      label: field.label + " " + "↑",
      resolveFromModel: field.resolveFromModel,
      direction: "asc",
    },
    {
      value: field.value,
      label: field.label + " " + "↓",
      resolveFromModel: field.resolveFromModel,
      direction: "asc",
    },
  ]);
};

export const sortOptions = generateSortOptions(sortFields);
