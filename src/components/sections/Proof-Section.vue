<script setup lang="ts">
// Single source of truth for both this strip and the footer's "Geprüfte
// Qualität" row — both rows read from `src/data/quality-badges.ts`. The
// strip uses the filtered PROOF_BADGES (omits ISO and Holz-Rettet-Klima).
import { PROOF_BADGES as badges } from "@/data/quality-badges";
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
