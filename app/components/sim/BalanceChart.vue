<script setup lang="ts">
const props = defineProps<{
  /** Balance at the start (round 0) and after each round. */
  balances: number[]
  startBalance: number
}>()

// Draw at the real container width so text stays readable on phones.
const figure = useTemplateRef<HTMLElement>('figure')
const { width: measured } = useElementSize(figure)
const width = computed(() => Math.max(280, Math.round(measured.value) || 600))
const height = computed(() => width.value < 480 ? 220 : 260)
const pad = { top: 16, right: 16, bottom: 32, left: 64 }
const plotW = computed(() => width.value - pad.left - pad.right)
const plotH = computed(() => height.value - pad.top - pad.bottom)

const formatMoney = (value: number) =>
  value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })

const ticks = computed(() => {
  const values = [...props.balances, props.startBalance]
  const raw = (Math.max(...values) - Math.min(...values)) / 3 || 1000
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map(m => m * magnitude).find(s => s >= raw)!
  const min = Math.floor(Math.min(...values) / step) * step
  const max = Math.ceil(Math.max(...values) / step) * step
  const result: number[] = []
  for (let v = min; v <= max + step / 2; v += step) result.push(v)
  return result
})

const yMin = computed(() => ticks.value[0]!)
const yMax = computed(() => ticks.value.at(-1)!)
const x = (i: number) => pad.left + (i / Math.max(props.balances.length - 1, 1)) * plotW.value
const y = (v: number) => pad.top + (1 - (v - yMin.value) / (yMax.value - yMin.value || 1)) * plotH.value

const points = computed(() => props.balances.map((v, i) => ({ x: x(i), y: y(v), value: v, round: i })))
const path = computed(() => points.value.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' '))

const hovered = ref<number | null>(null)
const active = computed(() => hovered.value === null ? null : points.value[hovered.value]!)
</script>

<template>
  <figure
    ref="figure"
    class="w-full"
  >
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="w-full h-auto select-none"
      role="img"
      :aria-label="`Balance over ${balances.length - 1} rounds, from ${formatMoney(balances[0]!)} to ${formatMoney(balances.at(-1)!)}`"
      @mouseleave="hovered = null"
    >
      <g>
        <template
          v-for="tick in ticks"
          :key="tick"
        >
          <line
            :x1="pad.left"
            :x2="width - pad.right"
            :y1="y(tick)"
            :y2="y(tick)"
            style="stroke: var(--ui-border)"
            stroke-width="1"
          />
          <text
            :x="pad.left - 8"
            :y="y(tick)"
            text-anchor="end"
            dominant-baseline="middle"
            class="text-[12px]"
            style="fill: var(--ui-text-muted)"
          >{{ formatMoney(tick) }}</text>
        </template>
        <text
          v-for="p in points"
          :key="`x-${p.round}`"
          :x="p.x"
          :y="height - 10"
          text-anchor="middle"
          class="text-[12px]"
          style="fill: var(--ui-text-muted)"
        >{{ p.round === 0 ? 'Start' : `R${p.round}` }}</text>
      </g>

      <line
        :x1="pad.left"
        :x2="width - pad.right"
        :y1="y(startBalance)"
        :y2="y(startBalance)"
        stroke-width="1.5"
        stroke-dasharray="4 4"
        style="stroke: var(--ui-text-dimmed)"
      />

      <path
        :d="path"
        fill="none"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
        style="stroke: var(--ui-primary)"
      />
      <circle
        v-for="p in points"
        :key="`dot-${p.round}`"
        :cx="p.x"
        :cy="p.y"
        :r="hovered === p.round ? 6 : 4"
        stroke-width="2"
        style="fill: var(--ui-primary); stroke: var(--ui-bg)"
      />

      <g v-if="active">
        <line
          :x1="active.x"
          :x2="active.x"
          :y1="pad.top"
          :y2="height - pad.bottom"
          style="stroke: var(--ui-border-accented)"
        />
        <text
          :x="Math.min(Math.max(active.x, pad.left + 60), width - pad.right - 60)"
          :y="Math.max(active.y - 14, pad.top + 4)"
          text-anchor="middle"
          class="text-[13px] font-semibold"
          style="fill: var(--ui-text-highlighted); paint-order: stroke; stroke: var(--ui-bg); stroke-width: 4px"
        >{{ active.round === 0 ? 'Start' : `Round ${active.round}` }}: {{ formatMoney(active.value) }}</text>
      </g>

      <!-- Hit targets wider than the dots -->
      <rect
        v-for="p in points"
        :key="`hit-${p.round}`"
        :x="p.x - plotW / (balances.length - 1) / 2"
        :y="pad.top"
        :width="plotW / (balances.length - 1)"
        :height="plotH"
        fill="transparent"
        @mouseenter="hovered = p.round"
        @touchstart.passive="hovered = p.round"
      />
    </svg>
    <figcaption class="mt-1 text-xs text-muted">
      Dashed line: your starting balance of {{ formatMoney(startBalance) }}.
    </figcaption>
  </figure>
</template>
