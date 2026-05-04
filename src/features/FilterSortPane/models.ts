interface SortOption {
  label: string;
  value: string;
}

export const sortOptions: SortOption[] = [
  { label: "Fläche ↑", value: "livingArea_asc" },
  { label: "Fläche ↓", value: "livingArea_desc" },
  { label: "Preis ↑", value: "price_asc" },
  { label: "Preis ↓", value: "price_desc" },
  { label: "Schlafzimmer ↑", value: "bedrooms_asc" },
  { label: "Schlafzimmer ↓", value: "bedrooms_desc" },
  { label: "Etagen ↑", value: "floorCount_asc" },
  { label: "Etagen ↓", value: "floorCount_desc" },
];
