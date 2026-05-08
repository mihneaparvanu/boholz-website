# FilterPanel — Planning & Requirements

## Source

Email from Christoph (client). Key points:

- Sort: ascending/descending by Preis, Wohnfläche, Zimmer, Etagen
- Filter priorities: **Dachtyp, Kniestock, Quadratmeter, Schlafzimmer, Badezimmer (evtl.)**
- "Barrierefrei" and "Kinderzimmer" mentioned but data not available yet — build infrastructure, populate later
- **Price note:** Only "Bestseller" models have a public price. Others are "auf Anfrage". This affects sort behaviour — models without a price should fall to the bottom when sorting by price.

---

## Sorting (✅ Already implemented)

| Field        | DB Column                     | Status  |
| ------------ | ----------------------------- | ------- |
| Wohnfläche   | `house_models.living_area`    | ✅ Done |
| Preis        | `house_models.price`          | ✅ Done |
| Etagen       | `house_details.level_count`   | ✅ Done |
| Schlafzimmer | `house_details.bedroom_count` | ✅ Done |

**Edge case to handle:** `price` is `null` for non-Bestseller models. When sorting by price, `null` values should sort to the end regardless of direction.

---

## Filtering — Planned Options

### Boolean Filters (simple on/off toggle)

These map directly to a `boolean` column in the DB. UI: toggle/chip.

| Label               | DB Column                         | In Schema?          |
| ------------------- | --------------------------------- | ------------------- |
| Garage vorhanden    | `house_details.has_garage`        | ✅ Yes              |
| Kniestock vorhanden | `house_details.kniestock != null` | ✅ Yes (derived)    |
| Barrierefrei        | (no column yet)                   | ❌ Needs new column |

### Discrete / Enum Filters (select from fixed set of values)

These use a string or known set of values. UI: dropdown or chip group.

| Label   | DB Column                 | Known Values                         | In Schema?                                    |
| ------- | ------------------------- | ------------------------------------ | --------------------------------------------- |
| Dachtyp | `house_details.roof_type` | e.g. Satteldach, Walmdach, Flachdach | ✅ Yes (free text — needs enum cleanup in DB) |

### Numeric / Range Filters (min value or exact match)

User picks a minimum value or exact count. UI: stepper or range slider.

| Label        | DB Column                      | Filter Type  | In Schema?                                |
| ------------ | ------------------------------ | ------------ | ----------------------------------------- |
| Wohnfläche   | `house_models.living_area`     | Min (≥ X m²) | ✅ Yes                                    |
| Schlafzimmer | `house_details.bedroom_count`  | Min (≥ X)    | ✅ Yes                                    |
| Badezimmer   | `house_details.bathroom_count` | Min (≥ X)    | ✅ Yes                                    |
| Kniestock    | `house_details.kniestock`      | Exact (cm)   | ✅ Yes                                    |
| Kinderzimmer | (no column yet)                | Min (≥ X)    | ❌ Needs new column + data from Christoph |

---

## What Needs Schema/DB Work Before Filtering Is Possible

1. `isBarrierFree: boolean` — new column on `house_details`
2. `childrenRoomCount: smallint` — new column on `house_details` (data from Christoph pending)
3. `roofType` values — should be normalised to a consistent set (e.g. "Satteldach" not "satteldach" or "Sattel")

---

## Implementation Order (suggested)

1. Boolean filters first — simplest logic, immediate value
2. Dachtyp enum filter — needs consistent DB values first
3. Numeric range filters (Wohnfläche, Schlafzimmer, Badezimmer)
4. Kniestock filter
5. Defer: Barrierefrei, Kinderzimmer — wait for Christoph's data

---

## TypeScript Design Notes

A filter option needs a different shape than a sort option.
Three types of filter:

```ts
type BooleanFilter = { kind: "boolean"; field: ...; label: string }
type EnumFilter    = { kind: "enum";    field: ...; label: string; options: string[] }
type RangeFilter   = { kind: "range";   field: ...; label: string; min: number; max: number; step: number }
```

The active filter state in `HousesPage` would be something like:

```ts
const activeFilters = ref<ActiveFilterState>({});
```

where `ActiveFilterState` maps field keys to their currently selected value.
