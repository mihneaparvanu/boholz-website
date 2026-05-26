<script setup lang="ts">
import { ref } from "vue";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-vue-next";
import Button from "@/ui/primitives/Button.vue";

export interface ContactInfo {
  /** E-mail address — rendered as a mailto link. */
  email?: string;
  /** Phone number — rendered as a tel link. */
  phone?: string;
  /** Plain-text address line. */
  address?: string;
}

export interface InterestOption {
  value: string;
  label: string;
}

withDefaults(
  defineProps<{
    eyebrow?: string;
    heading: string;
    /** Optional italic-serif highlight appended to the heading. */
    highlight?: string;
    /** Lede paragraph under the heading. */
    lede?: string;
    /** Smaller sub-copy beneath the lede. */
    subCopy?: string;
    contact?: ContactInfo;
    interestOptions?: InterestOption[];
    /** Surface tone for the band wrapper. */
    tone?: "pastell" | "tertiary" | "quaternary";
  }>(),
  {
    interestOptions: () => [
      { value: "bungalow", label: "Bungalow" },
      { value: "efh", label: "Einfamilienhaus" },
      { value: "doppelhaus", label: "Doppelhaus" },
      { value: "mfh", label: "Mehrfamilienhaus" },
      { value: "individuell", label: "Individuelle Planung" },
      { value: "unsure", label: "Noch unentschieden" },
    ],
    tone: "pastell",
  },
);

const form = ref({
  name: "",
  phone: "",
  email: "",
  postcode: "",
  interest: "",
  message: "",
  consent: false,
});

const submitted = ref(false);

function onSubmit(e: Event): void {
  e.preventDefault();
  // Visual demonstration only — no network call.
  submitted.value = true;
}
</script>

<template>
  <section class="band full-width" :data-tone="tone" aria-labelledby="lead-heading">
    <div class="inner">
      <!-- ── Left rail ──────────────────────────────────── -->
      <div class="rail">
        <header class="head">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h2 id="lead-heading" class="heading">
            {{ heading }}
            <span v-if="highlight" class="highlight"> {{ highlight }}</span>
          </h2>
          <p v-if="lede" class="lede">{{ lede }}</p>
          <p v-if="subCopy" class="sub-copy">{{ subCopy }}</p>
        </header>

        <ul v-if="contact" class="contact" role="list">
          <li v-if="contact.phone">
            <Phone :size="16" :stroke-width="1.75" aria-hidden="true" />
            <a :href="`tel:${contact.phone.replace(/\s+/g, '')}`">{{ contact.phone }}</a>
          </li>
          <li v-if="contact.email">
            <Mail :size="16" :stroke-width="1.75" aria-hidden="true" />
            <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
          </li>
          <li v-if="contact.address">
            <MapPin :size="16" :stroke-width="1.75" aria-hidden="true" />
            <span>{{ contact.address }}</span>
          </li>
        </ul>
      </div>

      <!-- ── Right form panel ───────────────────────────── -->
      <form class="form" novalidate @submit="onSubmit" aria-describedby="form-note">
        <!-- Row 1: name -->
        <div class="field">
          <label for="lead-name">Name</label>
          <input
            id="lead-name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            required
            placeholder="Vor- und Nachname"
          />
        </div>

        <!-- Row 2: phone + email -->
        <div class="row-2">
          <div class="field">
            <label for="lead-phone">Telefonnummer</label>
            <input
              id="lead-phone"
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              placeholder="+49 …"
            />
          </div>
          <div class="field">
            <label for="lead-email">E-Mail-Adresse</label>
            <input
              id="lead-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              placeholder="ihre@adresse.de"
            />
          </div>
        </div>

        <!-- Row 3: postcode + interest -->
        <div class="row-2">
          <div class="field">
            <label for="lead-postcode">PLZ / Ort</label>
            <input
              id="lead-postcode"
              v-model="form.postcode"
              type="text"
              autocomplete="postal-code"
              placeholder="12345 Musterstadt"
            />
          </div>
          <div class="field">
            <label for="lead-interest">Interesse</label>
            <select id="lead-interest" v-model="form.interest" required>
              <option value="" disabled>Bitte wählen …</option>
              <option v-for="o in interestOptions" :key="o.value" :value="o.value">
                {{ o.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Row 4: message -->
        <div class="field">
          <label for="lead-message">Ihre Nachricht</label>
          <textarea
            id="lead-message"
            v-model="form.message"
            rows="4"
            placeholder="Erzählen Sie uns von Ihrem Projekt — wir melden uns innerhalb eines Werktags."
          ></textarea>
        </div>

        <!-- Row 5: consent -->
        <label class="consent">
          <input v-model="form.consent" type="checkbox" required />
          <span>
            Ich habe die
            <a href="/datenschutz">Datenschutzerklärung</a>
            gelesen und akzeptiere die Verarbeitung meiner Daten zur
            Bearbeitung meiner Anfrage.
          </span>
        </label>

        <!-- Submit + footnote -->
        <div class="foot">
          <Button type="submit" variant="primary" size="lg">
            Anfrage senden
            <template #trailing>
              <ArrowRight :size="18" :stroke-width="1.75" aria-hidden="true" />
            </template>
          </Button>
          <p id="form-note" class="foot-note">
            Wir antworten innerhalb eines Werktags. Keine automatischen
            Mailings — Sie sprechen mit einem Fachberater.
          </p>
        </div>

        <p v-if="submitted" class="success" role="status">
          Danke — Ihre Anfrage ist bei uns angekommen.
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.band {
  padding-block: var(--spacing-6);
  padding-inline: var(--padding-inline);
}

.band[data-tone="pastell"] {
  background: var(--pastell-bg);
}
.band[data-tone="tertiary"] {
  background: var(--clr-surface-tertiary);
}
.band[data-tone="quaternary"] {
  background: var(--clr-surface-quaternary);
}

.inner {
  max-width: var(--content-max-width);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-5);
}
@media (--from-desktop) {
  .inner {
    /* 5/7 split — copy column gets less width so the form has room to
       breathe, while the heading still anchors the left rail. */
    grid-template-columns: 5fr 7fr;
    gap: var(--spacing-6);
    align-items: start;
  }
}

/* ── Left rail ─────────────────────────────────────── */
.rail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
@media (--from-desktop) {
  .rail {
    position: sticky;
    /* Account for the navbar height when the rail sticks. */
    top: calc(var(--navbar-height) + var(--spacing-4));
  }
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.eyebrow {
  margin: 0 0 calc(var(--spacing-3) - var(--spacing-2)) 0;
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--clr-content-tertiary);
}

.heading {
  margin: 0;
  font-size: var(--fs-h2);
  font-weight: var(--font-weight-light);
  letter-spacing: var(--ls-heading);
  line-height: var(--lh-heading);
  color: var(--clr-content-primary);
  text-wrap: balance;
  max-width: 16ch;
}

.highlight {
  font-family: var(--font-secondary);
  font-style: italic;
  font-weight: var(--font-weight-regular);
}

.lede {
  margin: 0;
  font-size: var(--fs-body-lg);
  color: var(--clr-content-secondary);
  max-width: 38ch;
  line-height: var(--lh-body);
}

.sub-copy {
  margin: 0;
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
  max-width: 40ch;
  line-height: var(--lh-body);
}

.contact {
  list-style: none;
  margin: 0;
  padding: var(--spacing-3) 0 0;
  border-top: 1px solid color-mix(in srgb, var(--clr-content-primary) 12%, transparent);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.contact li {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--fs-body);
  color: var(--clr-content-secondary);
}

.contact a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 160ms ease, color 160ms ease;
}
.contact a:hover {
  color: var(--clr-accent-secondary);
  border-bottom-color: currentColor;
}

/* ── Form panel ────────────────────────────────────── */
.form {
  background: var(--clr-surface-primary);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}
@media (--from-tablet) {
  .form {
    padding: var(--spacing-5);
  }
}

/* ── Field primitives — extend the project-shared .field convention from
   style/form.css (which only covered text/email/tel). We add textarea,
   select, and the consent checkbox here, all routed through the same
   focus token & border-radius scale. ───────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 0;
}
.field > label {
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--clr-content-secondary);
  letter-spacing: 0.01em;
}

.field input[type="text"],
.field input[type="email"],
.field input[type="tel"],
.field select,
.field textarea {
  width: 100%;
  padding: 0 var(--spacing-2);
  border: 1px solid var(--clr-border-secondary);
  border-radius: var(--radius-sm);
  background: var(--clr-surface-primary);
  color: var(--clr-content-primary);
  font: inherit;
  font-size: var(--fs-body);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.field input[type="text"],
.field input[type="email"],
.field input[type="tel"],
.field select {
  height: var(--control-height-md);
}

.field textarea {
  resize: vertical;
  min-height: calc(var(--control-height-md) * 2);
  padding: var(--spacing-2);
  line-height: var(--lh-body);
}

.field select {
  /* Native select — keep the chevron but in our content-tertiary tone. */
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237e878c' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right var(--spacing-2) center;
  padding-inline-end: calc(var(--spacing-2) + 20px);
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--clr-content-quaternary);
}

.field input:hover,
.field select:hover,
.field textarea:hover {
  border-color: var(--clr-border-tertiary);
}

.field input:focus-visible,
.field select:focus-visible,
.field textarea:focus-visible {
  outline: none;
  border-color: var(--clr-accent-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
}

.field input:user-invalid,
.field select:user-invalid,
.field textarea:user-invalid {
  border-color: var(--clr-status-error);
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3);
}
@media (--from-tablet) {
  .row-2 {
    grid-template-columns: 1fr 1fr;
  }
}

/* ── Consent ──────────────────────────────────────── */
.consent {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--spacing-2);
  font-size: var(--fs-body-sm);
  color: var(--clr-content-secondary);
  line-height: var(--lh-body);
  cursor: pointer;
  user-select: none;
}

.consent input[type="checkbox"] {
  appearance: none;
  margin: 0;
  /* Align visually with the first line of label text. */
  margin-block-start: 3px;
  width: 16px;
  height: 16px;
  border: 1px solid var(--clr-border-tertiary);
  border-radius: var(--radius-sm);
  background: var(--clr-surface-primary);
  cursor: pointer;
  display: grid;
  place-content: center;
  transition: border-color 160ms ease, background 160ms ease;
  flex-shrink: 0;
}
.consent input[type="checkbox"]::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 1px;
  transform: scale(0);
  transition: transform 120ms ease;
  background: var(--clr-accent-primary);
}
.consent input[type="checkbox"]:checked {
  border-color: var(--clr-accent-primary);
}
.consent input[type="checkbox"]:checked::before {
  transform: scale(1);
}
.consent input[type="checkbox"]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--clr-accent-primary) 22%, transparent);
}

.consent a {
  color: var(--clr-accent-secondary);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--clr-accent-secondary) 40%, transparent);
  text-underline-offset: 2px;
}
.consent a:hover {
  text-decoration-color: currentColor;
}

/* ── Foot ─────────────────────────────────────────── */
.foot {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-block-start: var(--spacing-1);
}
@media (--from-tablet) {
  .foot {
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-3);
  }
}

.foot-note {
  margin: 0;
  font-size: var(--fs-body-sm);
  color: var(--clr-content-tertiary);
  line-height: var(--lh-body);
}

.success {
  margin: 0;
  padding: var(--spacing-2) var(--spacing-3);
  background: color-mix(in srgb, var(--clr-status-success) 12%, transparent);
  color: var(--clr-status-success);
  border-radius: var(--radius-sm);
  font-size: var(--fs-body-sm);
  font-weight: var(--font-weight-medium);
}

@media (--mobile) {
  .band {
    padding-block: var(--spacing-5);
  }
  .heading {
    font-size: var(--fs-h3);
  }
  .form {
    padding: var(--spacing-3);
  }
}
</style>
