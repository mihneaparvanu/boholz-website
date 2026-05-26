<script setup lang="ts">
import Button from "@/ui/primitives/Button.vue";
</script>

<template>
  <div class="consent-pref">
    <div class="pref-text">
      <h2>Cookie-Einstellungen</h2>
      <p>
        Wählen Sie aus, welche Cookies Sie zulassen möchten. Essenzielle Cookies
        sind für den Betrieb der Website notwendig und können nicht deaktiviert
        werden.
      </p>
    </div>
    <div class="pref-table">
      <table>
        <caption>
          Optional title above the table
        </caption>

        <colgroup>
          <col />
          <!-- column-level styling hook -->
          <col class="num" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Purpose</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th scope="row">Essenziell</th>

            <td>Website functionality</td>
            <td>1 year</td>
          </tr>
          <tr>
            <th scope="row">Analyse</th>
            <td>Website functionality</td>
            <td>1 year</td>
          </tr>
          <tr>
            <th scope="row">Marketing</th>
            <td>Analytics</td>
            <td>2 years</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pref-actions">
      <Button size="sm" variant="primary">Alle akzeptieren</Button>
      <Button size="sm" variant="primary">Alle ablehnen</Button>
    </div>
  </div>
</template>

<style scoped>
.consent-pref {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: var(--spacing-2);
  border: 1px solid var(--clr-border-secondary);
}

th {
  background: var(--clr-surface-secondary);
  text-align: left;
}
</style>
