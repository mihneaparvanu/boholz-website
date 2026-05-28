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

/** Wohnfläche — kept threshold bands; covers 117–349 m² across the catalogue. */
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

/** Geschosse — enum so German display "1,5" renders correctly on the chip. */
const floors: EnumFilter = {
  id: "floorCount",
  kind: "enum",
  label: "Geschosse",
  options: ["1", "1,5", "2"],
  resolve: (m) => {
    if (m.details?.floorCount == null) return null;
    const n = Number(m.details.floorCount);
    if (!Number.isFinite(n)) return null;
    return n.toString().replace(".", ",");
  },
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
