<script setup lang="ts"></script>

<template>
  <div class="title-links">
    <p class="title">Musterhauser</p>
    <ul class="links">
      <li v-for="showhouse in showhouses" :key="showhouse.id">
        <a :href="`/hauser?category=${showhouse.slug}`">{{
          showhouse.title
        }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.title-links {
  display: flex;
  flex-direction: column;
}
</style>
