<script setup lang="ts">
import { computed } from "vue";
import { type ConsentField } from "@/features/contact-forms/types/contact.types";
import "@/ui/style/form.css";
const props = defineProps<{ field: ConsentField }>();
const model = defineModel<boolean>();

// Turn the word "Datenschutzerklärung" in the label into a link to the
// privacy page. Split into before/after so the rest stays plain text.
const LINK_WORD = "Datenschutzerklärung";
const parts = computed(() => {
  const i = props.field.label.indexOf(LINK_WORD);
  if (i === -1) return { before: props.field.label, after: "", hasLink: false };
  return {
    before: props.field.label.slice(0, i),
    after: props.field.label.slice(i + LINK_WORD.length),
    hasLink: true,
  };
});
</script>

<template>
  <label class="consent" :data-checked="model === true">
    <input
      type="checkbox"
      :id="field.name"
      :name="field.name"
      :required="field.required"
      :aria-required="field.required"
      v-model="model"
    />
    <span>
      <template v-if="parts.hasLink">
        {{ parts.before }}<a
          class="ds-link"
          href="/datenschutz"
          target="_blank"
          rel="noopener"
          @click.stop
          >Datenschutzerklärung</a
        >{{ parts.after }}
      </template>
      <template v-else>{{ field.label }}</template>
      <span v-if="field.required" aria-hidden="true" class="required">*</span>
    </span>
  </label>
</template>

<style scoped>
.consent {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-1);
  color: var(--clr-content-secondary);
  cursor: pointer;
  /* Full form width; slightly larger + medium weight for readability. */
  font-size: var(--fs-body);
  font-weight: var(--font-weight-medium);
  line-height: var(--lh-body);
}

.required {
  color: var(--clr-accent-primary);
  margin-inline-start: var(--spacing-0);
}

/* Datenschutz link — brand deep-blue, clearly clickable. */
.ds-link {
  color: var(--clr-accent-secondary);
  font-weight: var(--font-weight-semibold, 600);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.ds-link:hover {
  text-decoration-thickness: 2px;
}
.ds-link:focus-visible {
  outline: 2px solid var(--clr-accent-secondary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

input {
  appearance: none;
  margin: 0;
  flex-shrink: 0;
  width: var(--sz-md);
  height: var(--sz-md);
  border: 1px solid var(--clr-border-quaternary);
  border-radius: var(--radius-sm);
  background: var(--clr-surface-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
  margin-block-start: 0.15em;
}

input::before {
  content: "";
  width: 40%;
  height: 40%;
  border-radius: var(--radius-full);
  transform: scale(0);
  transition: transform 140ms ease;
}

input:checked {
  border-color: var(--clr-accent-primary);
  background: var(--clr-accent-primary);
}

input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
}

.consent:hover input:not(:checked) {
  border-color: var(--clr-border-quaternary);
}
</style>
