<script setup lang="ts">
import { computed } from "vue";
import { MglMarker } from "@indoorequal/vue-maplibre-gl";
import type { LocationWithAgents } from "@/types/models";
import { House } from "lucide-vue-next";

const props = defineProps<{ location: LocationWithAgents; active: boolean }>();
defineEmits<{ select: [] }>();

// Drizzle returns numeric as string; <MglMarker> wants [lng, lat] numbers.
const coordinates = computed<[number, number]>(() => [
  Number(props.location.lng),
  Number(props.location.lat),
]);
</script>

<template>
  <MglMarker :coordinates="coordinates" anchor="bottom">
    <template #marker>
      <button
        type="button"
        class="pin"
        :class="{ active }"
        :aria-label="`Standort ${location.title}`"
        @click.stop="$emit('select')"
      >
        <div v-if="location.kind === 'showhouse'" class="house-icon">
          <House size="20" aria-hidden="true" />
        </div>

        <svg
          v-if="location.kind === 'office'"
          width="28"
          height="36"
          viewBox="0 0 32 40"
          aria-hidden="true"
        >
          <path
            class="body"
            d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
          />
          <circle class="dot" cx="16" cy="16" r="5.5" />
        </svg>
      </button>
    </template>
  </MglMarker>
</template>

<style scoped>
.pin {
  display: block;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  transform-origin: 50% 100%;
  transition: transform 160ms ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.18));
}

.pin:hover {
  transform: scale(1.08);
}

.pin.active {
  transform: scale(1.18);
}

.body {
  fill: var(--clr-accent-primary);
  transition: fill 160ms ease;
}

.pin:hover .body,
.pin.active .body {
  fill: var(--clr-accent-secondary);
}

.dot {
  fill: var(--clr-surface-primary);
}

.house-icon {
  background-color: var(--clr-accent-primary);
  transition: background-color 160ms ease;
  padding: var(--spacing-1);
  border-radius: 50%;
  color: var(--clr-surface-primary);
}
</style>
