<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :ui="{
      container: '!p-0',
      description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <template #title>
      <!-- MDC H2 style -->
      <h2 class="relative text-2xl text-highlighted font-bold mt-12 mb-6 text-left">
        {{ page.about.title }}
      </h2>
    </template>
    <template #description>
      <p class="text-left mt-3 text-base sm:text-lg lg:text-base text-muted">
        {{ page.about.description }}
      </p>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
