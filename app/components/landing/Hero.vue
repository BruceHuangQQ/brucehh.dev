<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
import { ref, onMounted, onUnmounted } from 'vue'
import VanillaTilt from 'vanilla-tilt'

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

const tiltRef = ref<HTMLElement | null>(null)

onUnmounted(() => {
  (tiltRef.value as any)?.vanillaTilt?.destroy()
})

onMounted(() => {
  VanillaTilt.init((tiltRef.value as any), {
    'max': 15, // max tilt degrees
    'speed': 400, // transition speed
    'glare': false,
    'max-glare': 0.3,
    'perspective': 800
  })
})
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
        <div
          ref="tiltRef"
          class="tilt-wrapper mb-7"
        >
          <NuxtLink
            to="https://www.youtube.com/shorts/cP2K9mktqEs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch me on YouTube"
          >

            <img
              src="/ProfilePic.png"
              :alt="global.picture?.alt!"
              class="w-full max-w-[170px] object-cover animated-glow"
            >
          </nuxtlink>
        </div>
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
        {{ titlePrefix }} {{ titleName }}
        <!-- <AnimatedText
          as="span"
          class="font-extrabold"
        > -->
        <!-- </AnimatedText> -->
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
            delay: 0.8
          }"
        >
          <UButton
            icon="i-simple-icons-devpost"
            to="https://devpost.com/BruceHuangQQ"
            target="_blank"
            aria-label="Devpost"
            size="md"
            color="neutral"
            variant="ghost"
          />
        </Motion>
      </div>
    </template>
  </UPageHero>
</template>

<style scoped>
.animated-glow {
  filter: drop-shadow(0 0 4px hsl(0, 0%, 60%))
          drop-shadow(0 0 8px hsl(0, 0%, 60%))
}
/* .animated-glow {
  animation: glowCycle 3s linear infinite alternate;
}
@keyframes glowCycle {
  0%, 100% {
    filter: drop-shadow(0 0 4px hsl(0, 0%, 60%))
            drop-shadow(0 0 8px hsl(0, 0%, 60%));
  }
} */
/* @keyframes glowCycle {
  0% {
    filter: drop-shadow(0 0 4px hsl(172, 66%, 50%))
            drop-shadow(0 0 8px hsl(172, 66%, 50%));
  }
  33% {
    filter: drop-shadow(0 0 4px hsl(27, 96%, 61%))
            drop-shadow(0 0 8px hsl(27, 96%, 61%));
  }
  66% {
    filter: drop-shadow(0 0 4px hsl(210, 95%, 62%))
            drop-shadow(0 0 8px hsl(210, 95%, 62%));
  }
  100% {
    filter: drop-shadow(0 0 4px hsl(172, 66%, 50%))
            drop-shadow(0 0 8px hsl(172, 66%, 50%));
  }
} */
</style>
