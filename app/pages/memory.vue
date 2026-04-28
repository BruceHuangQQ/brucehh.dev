<script setup lang="ts">
import photos from '../../photos/data'

const { data: page } = await useAsyncData('photos-page', () => {
  return queryCollection('memory').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const imageModel = ref<HTMLImageElement | null>(null)
const imageAlt = ref<string>('')
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl
const canonicalUrl = `${siteUrl}${route.path}`
const seoTitle = 'Memory'
const seoDescription = 'A personal photo memory collection by Bruce Huang.'
const seoImage = '/favicon.ico'
const absoluteSeoImage = `${siteUrl}${seoImage}`

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  robots: 'index, follow',
  ogType: 'website',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  ogImage: absoluteSeoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: absoluteSeoImage
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ]
})

function setImageModel(img: HTMLImageElement) {
  imageModel.value = img
  imageAlt.value = img.dataset.caption ?? img.alt ?? ''
  const figure = img.closest('figure')
  if (figure) {
    const caption = figure.querySelector('figcaption')
    if (caption?.textContent) imageAlt.value ||= caption.textContent
  }
}

useEventListener(document, 'click', async (e: MouseEvent) => {
  const path = Array.from((e as PointerEvent).composedPath())
  const first = path[0] as HTMLElement
  if (!(first instanceof HTMLElement)) return
  if (first.tagName !== 'IMG') return
  if (first.classList.contains('no-preview')) return
  if (
    path.some(
      el => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName)
    )
  )
    return
  if (
    !path.some(
      el =>
        el instanceof HTMLElement
        && (el.classList.contains('prose') || el.classList.contains('photos'))
    )
  )
    return
  const pos = first.getBoundingClientRect()
  await new Promise(resolve => setTimeout(resolve, 50))
  const newPos = first.getBoundingClientRect()
  if (pos.left !== newPos.left || pos.top !== newPos.top) return
  setImageModel(first as HTMLImageElement)
})

const pageContent = computed(() => page.value?.credit)
</script>

<template>
  <div>
    <UPage v-if="page">
      <UPageSection
        :ui="{
          container: '!pt-15'
        }"
      >
        <PhotoGrid :photos="photos" />
        <div
          v-if="pageContent"
          class="text-left italic"
        >
          <MDC :value="pageContent" />
        </div>
      </UPageSection>
    </UPage>

    <Transition name="fade">
      <div
        v-if="imageModel"
        class="fixed inset-0 z-[500] backdrop-blur-md flex items-center justify-center"
        @click="imageModel = null"
      >
        <div class="absolute inset-0 bg-black/50 -z-[1]" />
        <img
          v-if="imageModel"
          :src="imageModel.src"
          :alt="imageModel.alt"
          class="max-w-full max-h-full w-full h-full object-contain pointer-events-none"
          @click.stop
        >
      </div>
    </Transition>
  </div>
</template>
