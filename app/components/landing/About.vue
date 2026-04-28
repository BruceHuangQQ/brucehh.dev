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
      <Motion
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :animate="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ duration: 0.5, delay: 0.1 }"
      >
        <!-- MDC H2 style -->
        <h2 class="relative text-2xl text-highlighted font-bold mt-12 mb-6 text-left">
          {{ page.about.title }}
        </h2>
      </Motion>
    </template>
    <template #description>
      <Motion
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :animate="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ duration: 0.5, delay: 0.2 }"
      >
        <p class="text-left mt-3 text-base sm:text-lg lg:text-base text-muted">
          {{ page.about.description }}
        </p>
      </Motion>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
