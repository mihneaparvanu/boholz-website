<script setup lang="ts">
/**
 * Detail page "Technische Daten" — canonical PDF-spec fields only.
 *
 * Order (per `dev/todo/houses/hausliste-homepage.md` § 27):
 *   Etagen → Roof (Dachform + Dachneigung) → Kniestock → Netto-Grundfläche DIN
 *   → Gesamtwohnfläche WoFlV → Anbau → Einliegerwohnung [→ Preis (bestseller)]
 *
 * NULL rows are suppressed so the layout adapts to each typology (e.g.
 * Stadtvillen have no Kniestock by design — that row just doesn't render).
 *
 * Wohnfläche is NOT here — it lives in the hero StatsGrid above this section.
 * Price is only rendered for bestseller-category models (the only PDF rows
 * with a populated price column).
 */
import { computed, type Component } from "vue";
import {
  Layers,
  Triangle,
  Ruler,
  Square,
  Scaling,
  Hammer,
  KeyRound,
  Coins,
} from "lucide-vue-next";
import type { HouseModel } from "@/db/models";
import { isBestsellerCategory } from "@/lib/bestseller";
import { formatBoolean, formatCurrency } from "@/lib/format";
import DetailRow from "./DetailRow.vue";
import RoofCapsule from "@/features/model-overview/components/RoofCapsule.vue";

const props = defineProps<{
  model: HouseModel;
}>();

const m = props.model;
const d = m.details;

/** Etagen — Geschosse stored as numeric (1, 1.5, 2). German comma display. */
const floors = computed<string | null>(() => {
  const v = d?.floorCount;
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n.toString().replace(".", ",") : null;
});

/** Roof — capsule renders Dachform + (optional) Dachneigung. */
const roof = computed<{ type: string; pitch: number | null } | null>(() => {
  if (!d?.roofType) return null;
  return { type: d.roofType, pitch: m.roofPitch != null ? Number(m.roofPitch) : null };
});

const kniestock = computed<string | null>(() =>
  d?.kniestock != null ? `${d.kniestock} cm` : null,
);

const dinArea = computed<string | null>(() =>
  d?.netFloorAreaDin != null
    ? `${Number(d.netFloorAreaDin).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`
    : null,
);

const woflvArea = computed<string | null>(() =>
  d?.totalLivingAreaWoflv != null
    ? `${Number(d.totalLivingAreaWoflv).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`
    : null,
);

const anbau = computed<string | null>(() =>
  d?.extensionDescription?.trim() ? d.extensionDescription.trim() : null,
);

/** Einliegerwohnung — boolean default false; show row only when true. */
const granny = computed<string | null>(() =>
  d?.allowsGrannyFlat ? formatBoolean(true) : null,
);

/** Preis — only on bestseller-category rows per spec. */
const showPrice = computed(
  () => isBestsellerCategory(m.category) && m.price != null,
);
const price = computed<string | null>(() =>
  showPrice.value && m.price != null ? formatCurrency(m.price) : null,
);

type Row = { label: string; icon: Component; value: string };

const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  if (floors.value) out.push({ label: "Etagen", icon: Layers, value: floors.value });
  // Roof gets its own slot in the template — no flat string value.
  if (kniestock.value)
    out.push({ label: "Kniestock", icon: Scaling, value: kniestock.value });
  if (dinArea.value)
    out.push({ label: "Netto-Grundfläche (DIN 277)", icon: Square, value: dinArea.value });
  if (woflvArea.value)
    out.push({ label: "Gesamtwohnfläche (WoFlV)", icon: Ruler, value: woflvArea.value });
  if (anbau.value) out.push({ label: "Anbau", icon: Hammer, value: anbau.value });
  if (granny.value)
    out.push({ label: "Einliegerwohnung", icon: KeyRound, value: granny.value });
  if (price.value) out.push({ label: "Preis", icon: Coins, value: price.value });
  return out;
});
</script>

<template>
  <div class="details-grid">
    <!-- Roof row gets a dedicated cell so the capsule can render its own UI -->
    <div v-if="roof" class="detail-roof">
      <div class="label">
        <div class="icon-text">
          <Triangle :size="16" :stroke-width="1.75" aria-hidden="true" />
          <span>Dach</span>
        </div>
        <RoofCapsule :entries="[roof]" />
      </div>
      <div class="separator" />
    </div>

    <DetailRow
      v-for="row in rows"
      :key="row.label"
      :label="row.label"
      :value="row.value"
    >
      <template #icon>
        <component :is="row.icon" :size="16" :stroke-width="1.75" />
      </template>
    </DetailRow>
  </div>
</template>

<style scoped>
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);

  @media (--mobile) {
    grid-template-columns: 1fr;
  }
}

/* Mirrors DetailRow's layout so the roof row aligns with the others. */
.detail-roof {
  display: flex;
  flex-direction: column;
}

.detail-roof .label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--spacing-2);
}

.detail-roof .icon-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.detail-roof .separator {
  height: 1px;
  background: var(--clr-border-secondary);
}
</style>
