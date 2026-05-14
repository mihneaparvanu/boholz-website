<script setup lang="ts">
import { X, Phone, Mail } from "lucide-vue-next";
import type { LocationWithAgents } from "../../types/models";

defineProps<{ location: LocationWithAgents }>();
defineEmits<{ close: [] }>();

const telHref = (s: string) => `tel:${s.replace(/[^\d+]/g, "")}`;
</script>

<template>
  <article class="card">
    <button
      class="card__close"
      type="button"
      aria-label="Schließen"
      @click="$emit('close')"
    >
      <X :size="16" />
    </button>

    <header class="card__head">
      <span v-if="location.kind === 'headquarters'" class="card__badge">Zentrale</span>
      <h3 class="card__title">{{ location.title }}</h3>
    </header>

    <p v-if="location.address" class="card__line">
      {{ location.address }}<br />
      <span class="card__line--muted">
        {{ [location.postalCode, location.city].filter(Boolean).join(" ") }}
      </span>
    </p>

    <div v-if="location.phone || location.email" class="card__contact">
      <a v-if="location.phone" :href="telHref(location.phone)" class="card__contact-item">
        <Phone :size="14" /> {{ location.phone }}
      </a>
      <a v-if="location.email" :href="`mailto:${location.email}`" class="card__contact-item">
        <Mail :size="14" /> {{ location.email }}
      </a>
    </div>

    <section v-if="location.agents.length" class="card__agents">
      <h4 class="card__agents-title">Ansprechpartner</h4>
      <ul class="card__agents-list">
        <li v-for="link in location.agents" :key="link.agent.id" class="agent">
          <div class="agent__name">{{ link.agent.fullName }}</div>
          <div v-if="link.agent.role" class="agent__role">{{ link.agent.role }}</div>
          <div class="agent__contact">
            <a v-if="link.agent.phoneNumber" :href="telHref(link.agent.phoneNumber)">
              <Phone :size="12" /> {{ link.agent.phoneNumber }}
            </a>
            <a v-if="link.agent.email" :href="`mailto:${link.agent.email}`">
              <Mail :size="12" /> {{ link.agent.email }}
            </a>
          </div>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.card {
  position: absolute;
  inset-inline: var(--spacing-3);
  bottom: var(--spacing-3);
  margin-inline: auto;
  width: min(420px, calc(100% - var(--spacing-4)));
  max-height: calc(100% - var(--spacing-5));
  overflow-y: auto;
  padding: var(--spacing-3);
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.card__close {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  display: grid;
  place-items: center;
  width: var(--control-height-sm);
  height: var(--control-height-sm);
  padding: 0;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--clr-content-tertiary);
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease;
}

.card__close:hover {
  color: var(--clr-content-primary);
  background: var(--clr-surface-secondary);
}

.card__head {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  padding-right: var(--spacing-4);
}

.card__badge {
  font-size: var(--fs-body-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--clr-accent-primary);
}

.card__title {
  margin: 0 0 var(--spacing-1);
  font-family: var(--font-secondary);
  font-style: italic;
  font-size: var(--fs-h5);
  color: var(--clr-content-primary);
}

.card__line {
  margin: 0;
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
}

.card__line--muted {
  color: var(--clr-content-tertiary);
}

.card__contact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  margin-top: var(--spacing-2);
}

.card__contact-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  text-decoration: none;
}
.card__contact-item:hover {
  color: var(--clr-accent-primary);
}

.card__agents {
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--clr-border-secondary);
}

.card__agents-title {
  margin: 0 0 var(--spacing-2);
  font-size: var(--fs-body-sm);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--clr-content-tertiary);
  font-weight: 500;
}

.card__agents-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.agent__name {
  font-weight: 500;
  color: var(--clr-content-primary);
}

.agent__role {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
}

.agent__contact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-0);
  margin-top: var(--spacing-0);
}

.agent__contact a {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  text-decoration: none;
  width: fit-content;
}
.agent__contact a:hover {
  color: var(--clr-accent-primary);
}
</style>
