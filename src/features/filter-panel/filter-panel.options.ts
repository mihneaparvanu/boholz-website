/**
 * Filter & sort options — canonical PDF-spec fields only.
 *
 * Mirrors `dev/todo/houses/hausliste-homepage.md` § "Filter & Detail spec".
 * The 7 filter rows + 2 sort options below are the complete set the front-end
 * exposes; legacy fields (bedroom/bathroom count, has-garage, price) remain
 * in the DB for back-office use but are NOT surfaced here.
 */
import type {
  SortField,
  SortOption,
  BooleanFilter,
  EnumFilter,
  FilterOption,
  ThresholdFilter,
} from "./filter-panel.types";
import type { HouseModel } from "@/db/models";
import { parseLivingArea } from "@/lib/parse-living-area";

// ─── Sorting ───────────────────────────────────────────────────────────────
// Spec: Wohnfläche + Name only. Preis is bestseller-only and not a meaningful
// catalogue-wide sort key. Geschosse is too coarse. Schlafzimmer is off-spec.

export const sortFields: SortField[] = [
  {
    value: "livingArea",
    label: "Fläche",
    resolve: (m) => parseLivingArea(m.livingArea),
  },
  {
    value: "title",
    label: "Name",
    resolve: (m) => m.title,
  },
];

const generateSortOptions = (fields: SortField[]): SortOption[] =>
  fields.flatMap((field) => [
    {
      value: `${field.value}-asc`,
      label: `${field.label} ↑`,
      resolve: field.resolve,
      direction: "asc",
    },
    {
      value: `${field.value}-desc`,
      label: `${field.label} ↓`,
      resolve: field.resolve,
      direction: "desc",
    },
  ]);

export const sortOptions = generateSortOptions(sortFields);

// ─── Filtering ─────────────────────────────────────────────────────────────
// `id` is the dedup / URL key — keep it stable and unique across the array.

/**
 * Wohnfläche — minimum bands ("ab N m²"). Selecting a band keeps every model
 * whose living area is that value or larger. Covers 115–1632 m² across the
 * catalogue (most models 115–200, a few large Mehrfamilien push the top end).
 */
const livingAreaThreshold: ThresholdFilter = {
  id: "livingArea",
  kind: "threshold",
  label: "Wohnfläche",
  options: [
    {
      label: "ab 130 m²",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a >= 130;
      },
    },
    {
      label: "ab 150 m²",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a >= 150;
      },
    },
    {
      label: "ab 170 m²",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a >= 170;
      },
    },
    {
      label: "ab 200 m²",
      predicate: (m) => {
        const a = parseLivingArea(m.livingArea);
        return a !== null && a >= 200;
      },
    },
  ],
};

/**
 * Geschosse — "at most" bands ("bis N"). Selecting a band keeps every model
 * with that floor count or fewer, so "bis 1,5" includes the single-storey
 * (1) models too. Catalogue carries 1 / 1,5 / 2 / 3.
 */
const floorCountAtMost = (m: HouseModel, max: number): boolean => {
  const fc = m.details?.floorCount;
  if (fc == null) return false;
  const n = Number(fc);
  return Number.isFinite(n) && n <= max;
};

const floors: ThresholdFilter = {
  id: "floorCount",
  kind: "threshold",
  label: "Geschosse",
  options: [
    { label: "bis 1", predicate: (m) => floorCountAtMost(m, 1) },
    { label: "bis 1,5", predicate: (m) => floorCountAtMost(m, 1.5) },
    { label: "bis 2", predicate: (m) => floorCountAtMost(m, 2) },
    { label: "bis 3", predicate: (m) => floorCountAtMost(m, 3) },
  ],
};

/** Dachform — covers every value present in the catalogue. */
const roofType: EnumFilter = {
  id: "roofType",
  kind: "enum",
  label: "Dachform",
  options: ["Satteldach", "Walmdach", "Pultdach", "Flachdach", "Flachdach, Attika"],
  resolve: (m) => m.details?.roofType ?? null,
};

/**
 * Dachneigung — threshold bands rather than a continuous slider for now;
 * matches the existing chip UI. The PDF only carries discrete pitches
 * (22°, 25°, 28°, 35°, 38°, 45°), so three bands cover every case.
 * Pitched-roof filter; Flachdach models return null and won't match.
 */
const roofPitch: ThresholdFilter = {
  id: "roofPitch",
  kind: "threshold",
  label: "Dachneigung",
  options: [
    {
      label: "≤22°",
      predicate: (m) =>
        m.roofPitch != null && Number(m.roofPitch) <= 22,
    },
    {
      label: "25–35°",
      predicate: (m) => {
        if (m.roofPitch == null) return false;
        const p = Number(m.roofPitch);
        return p >= 25 && p <= 35;
      },
    },
    {
      label: "38–45°",
      predicate: (m) => {
        if (m.roofPitch == null) return false;
        const p = Number(m.roofPitch);
        return p >= 38 && p <= 45;
      },
    },
  ],
};

const hasKniestock: BooleanFilter = {
  id: "hasKniestock",
  kind: "boolean",
  label: "Kniestock",
  resolve: (m) =>
    m.details != null ? m.details.kniestock != null : null,
};

/** Anbau — presence toggle; the values themselves (Erker / Garage / ...) are
 *  free text, so a boolean "vorhanden" is the safest cross-cutting filter. */
const hasExtension: BooleanFilter = {
  id: "hasExtension",
  kind: "boolean",
  label: "Anbau",
  resolve: (m) =>
    m.details != null
      ? Boolean(m.details.extensionDescription?.trim())
      : null,
};

const allowsGrannyFlat: BooleanFilter = {
  id: "allowsGrannyFlat",
  kind: "boolean",
  label: "Einliegerwohnung",
  resolve: (m) => m.details?.allowsGrannyFlat ?? null,
};

export const filterOptions: FilterOption[] = [
  livingAreaThreshold,
  floors,
  roofType,
  roofPitch,
  hasKniestock,
  hasExtension,
  allowsGrannyFlat,
];
