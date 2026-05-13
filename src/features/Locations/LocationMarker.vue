<script setup lang="ts">
defineProps<{ active?: boolean }>();
</script>

<template>
  <button
    class="pin"
    :class="{ 'pin--active': active }"
    type="button"
    aria-label="Standort anzeigen"
  >
    <svg width="28" height="36" viewBox="0 0 32 40" aria-hidden="true">
      <path
        class="pin__body"
        d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
      />
      <circle class="pin__dot" cx="16" cy="16" r="5.5" />
    </svg>
  </button>
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

.pin--active {
  transform: scale(1.18);
}

.pin__body {
  fill: var(--clr-accent-primary);
  transition: fill 160ms ease;
}

.pin:hover .pin__body,
.pin--active .pin__body {
  fill: var(--clr-accent-secondary);
}

.pin__dot {
  fill: var(--clr-surface-primary);
}
</style>
