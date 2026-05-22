<script setup lang="ts">
// Data-driven badge row — matches the per-badge size pattern used in the
// footer (no nth-child arithmetic, re-ordering is safe). Aspect values
// mirror each symbol's viewBox inside `qualityBadgesColor.svg`.
//
// Holz-Rettet-Klima isn't included here — that mark belongs to the
// sustainability message, not the "Geprüfte Qualität" trust strip.
interface ProofBadge {
  id: string;
  label: string;
  aspect: string;
  size?: "default" | "wide";
}

const badges: ProofBadge[] = [
  { id: "badge-qdf-color", label: "Qualitätsgemeinschaft Deutscher Fertigbau", aspect: "469 / 512" },
  { id: "badge-gdf-color", label: "Gütegemeinschaft Deutsche Fertigbau", aspect: "709 / 512" },
  { id: "badge-ral-color", label: "RAL Gütezeichen", aspect: "256 / 120", size: "wide" },
  { id: "badge-bdf-color", label: "Bundesverband Deutscher Fertigbau", aspect: "474 / 512" },
  { id: "badge-creditreform-color", label: "Creditreform Bonitätszertifikat", aspect: "388 / 512" },
];
</script>

<template>
  <div class="proof">
    <span>Geprüfte Qualität · Zertifizierte Sicherheit</span>
    <div class="badges" aria-label="Qualitätssiegel">
      <svg
        v-for="b in badges"
        :key="b.id"
        class="badge"
        :data-size="b.size ?? 'default'"
        :style="{ aspectRatio: b.aspect }"
        role="img"
        :aria-label="b.label"
      >
        <use :href="`#${b.id}`" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.proof {
  /* Override per usage by setting `--proof-color` on any ancestor. */
  color: var(--proof-color, var(--clr-content-tertiary));
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--spacing-2);

  span {
    text-transform: uppercase;
    font-size: var(--fs-body-sm);
    font-weight: var(--font-weight-medium);
    color: inherit;
    opacity: 0.9;
  }
}

.badges {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  color: inherit;
  flex-wrap: wrap;
}

/* Per-badge visual mass — `wide` lifts narrow-aspect marks (RAL) so their
   content reads at the same perceived weight as the squarer neighbours. */
.badge {
  height: var(--badge-h, var(--fs-h3));
  width: auto;
}

.badge[data-size="default"] { --badge-h: var(--fs-h3); }
.badge[data-size="wide"]    { --badge-h: var(--fs-h2); }

@media (--below-desktop) {
  /* Eyebrow drops to tertiary tone — proof line is supporting copy, not
     headline beat. Shrink heights so all five fit one row on narrow
     viewports without forcing a wrap. */
  .proof span {
    color: var(--clr-content-tertiary);
    opacity: 1;
  }

  .badges {
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .badge[data-size="default"] { --badge-h: var(--fs-h4); }
  .badge[data-size="wide"]    { --badge-h: var(--fs-h3); }

  .badge {
    flex-shrink: 1;
    min-width: 0;
  }
}
</style>
