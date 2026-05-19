<script setup lang="ts">
import { ref } from "vue";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import { FileText, Download } from "lucide-vue-next";
import type { HouseFloor } from "@/types/models";

const props = defineProps<{
  floors: HouseFloor[];
}>();

const activeKey = ref<string>(props.floors[0]?.title ?? "");
</script>

<template>
  <div class="wrap">
    <div class="card">
      <TabsRoot
        v-if="floors.length > 1"
        v-model="activeKey"
        :default-value="floors[0].title"
        class="root"
      >
        <TabsList class="tabs" aria-label="Etagen">
          <TabsTrigger
            v-for="floor in floors"
            :key="floor.title"
            :value="floor.title"
            class="tab"
          >
            {{ floor.title }}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          v-for="floor in floors"
          :key="floor.title"
          :value="floor.title"
          class="panel"
        >
          <div class="plan">
            <img
              :src="floor.media.path"
              :alt="floor.media.alt || floor.title"
              :width="floor.media.width ?? undefined"
              :height="floor.media.height ?? undefined"
            />
          </div>
        </TabsContent>
      </TabsRoot>

      <div v-else-if="floors.length === 1" class="single">
        <span class="caption">{{ floors[0].title }}</span>
        <div class="plan">
          <img
            :src="floors[0].media.path"
            :alt="floors[0].media.alt || floors[0].title"
            :width="floors[0].media.width ?? undefined"
            :height="floors[0].media.height ?? undefined"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.card {
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  background: var(--clr-surface-primary);
  padding: var(--spacing-3);
}

.root {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.tabs {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  align-self: flex-start;
  background: transparent;
}

.tab {
  appearance: none;
  background: transparent;
  border: 0;
  font: inherit;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-tertiary);
  padding-block: var(--spacing-2);
  padding-inline: var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background 220ms ease,
    color 220ms ease;
}

.tab:hover {
  color: var(--clr-content-primary);
}

.tab[data-state="active"] {
  background: var(--clr-surface-secondary);
  color: var(--clr-content-primary);
}

.tab:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.panel {
  display: flex;
}

.panel[data-state="inactive"] {
  display: none;
}

.single {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.caption {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-secondary);
}

.plan {
  width: 100%;
  background: var(--clr-surface-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
}

.plan img {
  max-width: 100%;
  max-height: 70vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

@media (--mobile) {
  .plan {
    min-height: 280px;
    padding: var(--spacing-2);
  }
  .plan img {
    max-height: 60vh;
  }
}

.download {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  background: var(--clr-surface-primary);
  text-decoration: none;
  color: var(--clr-content-primary);
  transition: border-color 160ms ease;
}

.download:hover {
  border-color: var(--clr-accent-primary);
}

.download:focus-visible {
  outline: 2px solid var(--clr-accent-primary);
  outline-offset: 2px;
}

.dl-icon {
  display: inline-flex;
  color: var(--clr-content-secondary);
  flex-shrink: 0;
}

.dl-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.dl-title {
  font-weight: var(--font-weight-medium);
}

.dl-sub {
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
}

.dl-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-accent-primary);
  flex-shrink: 0;
}

@media (--mobile) {
  .dl-cta .dl-cta-label {
    display: none;
  }
}
</style>
