<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { global } = useAppConfig()

const props = defineProps<{
  page: IndexCollectionItem
}>()

const heroTitle = computed(
  () =>
    (props.page as any).heroTitle as
    | undefined
    | {
      prefix?: string
      name?: string
      suffix?: string
    }
)

const titlePrefix = computed(() => heroTitle.value?.prefix ?? 'Hey, I\'m')
const titleName = computed(() => heroTitle.value?.name ?? 'Bruce')
const titleSuffix = computed(
  () => heroTitle.value?.suffix ?? '- Software Engineer'
)
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <img
          src="/profile-pic.jpeg"
          :alt="global.picture?.alt!"
          class="size-35 rounded-full ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
        >
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        {{ titlePrefix }}
        <AnimatedText
          as="span"
          class="font-extrabold"
        >
          {{ titleName }}
        </AnimatedText>
        {{ ' ' + titleSuffix }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        {{ page.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="page.hero.links"
          class="flex items-center gap-2"
        >
          <UButton v-bind="page.hero.links[0]" />
          <UButton
            color="success"
            variant="ghost"
            class="gap-2"
            label="Based in Melbourne"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75 bg-success animate-ping"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full bg-success"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.6
          }"
        >
          <UButton
            icon="i-simple-icons-linkedin"
            to="https://linkedin.com/in/brucewonghh"
            target="_blank"
            aria-label="LinkedIn"
            size="md"
            color="neutral"
            variant="ghost"
          />
        </Motion>
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.7
          }"
        >
          <UButton
            icon="i-simple-icons-github"
            to="https://github.com/BruceHuangQQ"
            target="_blank"
            aria-label="GitHub"
            size="md"
            color="neutral"
            variant="ghost"
          />
        </Motion>
      </div>
    </template>
  </UPageHero>
</template>
