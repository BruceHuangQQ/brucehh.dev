<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      description: 'mt-2'
    }"
  >
    <template #title>
      <Motion
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :animate="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ duration: 0.5, delay: 0.1 }"
      >
        <h2 class="relative text-2xl text-highlighted font-bold mt-6 sm:mt-12 mb-6 text-left">
          {{ page.experience.title }}
        </h2>
      </Motion>
    </template>
    <template #description>
      <div class="flex flex-col gap-2">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex flex-col gap-1 mb-2 sm:mb-0"
        >
          <p class="text-sm text-left font-bold">
            {{ experience.date }}
          </p>
          <USeparator />
          <ULink
            class="flex items-center gap-1 text-nowrap"
            :to="experience.company.url"
            target="_blank"
          >
            <span class="text-sm">
              {{ experience.position }} at
            </span>
            <div
              class="inline-flex items-center gap-1"
              :style="{ color: experience.company.color }"
            >
              <span class="">{{ experience.company.name }}</span>
              <img
                :src="experience.company.logo"
                :alt="experience.company.name + ' logo'"
                class="size-4 object-contain"
              >
            </div>
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
