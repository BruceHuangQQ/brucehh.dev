<script setup lang="ts">
import {
  ASSETS,
  ASSET_LABELS,
  allocationTotal,
  playRound,
  validateAllocation,
  type Allocation,
  type Asset,
  type RoundResult
} from '~/sim/rules'
import { SCENARIOS, STARTING_BALANCE } from '~/sim/scenarios'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl
const canonicalUrl = `${siteUrl}${route.path}`
const seoTitle = 'Investment Sim'
const seoDescription = 'A five-round investing game built from an Excel model: split your money between cash, bonds and shares, then see why it went up or down.'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription
})
useHead({ link: [{ rel: 'canonical', href: canonicalUrl }] })

const ASSET_HINTS: Record<Asset, string> = {
  cash: 'Savings account. Safe, small interest.',
  bonds: 'Loans to governments. Steady, but hurt by rising rates.',
  shares: 'Part-ownership of companies. Biggest swings.'
}

const PRESETS: { label: string, allocation: Allocation }[] = [
  { label: 'Play it safe', allocation: { cash: 70, bonds: 30, shares: 0 } },
  { label: 'Balanced', allocation: { cash: 20, bonds: 30, shares: 50 } },
  { label: 'All in shares', allocation: { cash: 0, bonds: 0, shares: 100 } }
]

const results = ref<RoundResult[]>([])
const allocation = reactive<Allocation>({ cash: 20, bonds: 30, shares: 50 })
const revealed = ref(false)
const finished = ref(false)

const roundIndex = computed(() => results.value.length - (revealed.value ? 1 : 0))
const scenario = computed(() => SCENARIOS[roundIndex.value]!)
const latest = computed(() => results.value.at(-1))
const balance = computed(() => latest.value?.endBalance ?? STARTING_BALANCE)
const score = computed(() => results.value.reduce((sum, r) => sum + r.score, 0))
const total = computed(() => allocationTotal(allocation))
const error = computed(() => validateAllocation(allocation))

function submit() {
  if (error.value) return
  results.value.push(playRound(roundIndex.value + 1, balance.value, { ...allocation }, scenario.value))
  revealed.value = true
}

function nextRound() {
  if (results.value.length === SCENARIOS.length) finished.value = true
  else revealed.value = false
}

function restart() {
  results.value = []
  revealed.value = false
  finished.value = false
  Object.assign(allocation, { cash: 20, bonds: 30, shares: 50 })
}

const money = (value: number) =>
  value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
const signedMoney = (value: number) => `${value < 0 ? '-' : '+'}${money(Math.abs(value))}`
const signedPct = (value: number) => `${value > 0 ? '+' : ''}${Number(value.toFixed(2))}%`
const tone = (value: number) => value > 0 ? 'text-success' : value < 0 ? 'text-error' : 'text-muted'

const balances = computed(() => [STARTING_BALANCE, ...results.value.map(r => r.endBalance)])
const finalVerdict = computed(() => {
  const pct = score.value / (SCENARIOS.length * 100)
  if (pct >= 0.8) return 'Great reading of the markets.'
  if (pct >= 0.5) return 'Solid, steady investing.'
  return 'Markets are hard to predict, which is exactly why people diversify.'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Investment Sim"
      description="Five years, three places to put your money. Read the news, split your $10,000 between cash, bonds and shares, then see what happened and why."
      :ui="{
        container: 'pb-8 sm:pb-12 lg:pb-12',
        title: '!mx-0 text-left',
        description: '!mx-0 text-left'
      }"
    />

    <UPageSection :ui="{ container: '!pt-0 gap-6 sm:gap-8' }">
      <!-- Status bar -->
      <div class="grid grid-cols-[1fr_1.5fr_1fr] sm:grid-cols-3 gap-2 sm:gap-4">
        <div class="rounded-lg border border-default p-2.5 sm:p-3">
          <p class="text-xs text-muted">
            Round
          </p>
          <p class="text-base sm:text-xl font-semibold tabular-nums">
            {{ Math.min(roundIndex + 1, SCENARIOS.length) }} / {{ SCENARIOS.length }}
          </p>
        </div>
        <div class="rounded-lg border border-default p-2.5 sm:p-3">
          <p class="text-xs text-muted">
            Balance
          </p>
          <p class="text-base sm:text-xl font-semibold tabular-nums">
            {{ money(balance) }}
          </p>
        </div>
        <div class="rounded-lg border border-default p-2.5 sm:p-3">
          <p class="text-xs text-muted">
            Score
          </p>
          <p class="text-base sm:text-xl font-semibold tabular-nums">
            {{ score }}<span class="text-xs sm:text-sm text-muted font-normal whitespace-nowrap"> / {{ SCENARIOS.length * 100 }}</span>
          </p>
        </div>
      </div>

      <!-- End screen -->
      <UCard v-if="finished">
        <template #header>
          <p class="text-sm text-muted">
            Game over
          </p>
          <h2 class="text-xl font-semibold text-highlighted">
            You finished with {{ money(balance) }}
          </h2>
          <p class="mt-1 text-sm">
            <span :class="tone(balance - STARTING_BALANCE)">{{ signedMoney(balance - STARTING_BALANCE) }}</span>
            over {{ SCENARIOS.length }} years, scoring {{ score }} / {{ SCENARIOS.length * 100 }}. {{ finalVerdict }}
          </p>
        </template>

        <SimBalanceChart
          :balances="balances"
          :start-balance="STARTING_BALANCE"
        />

        <div class="mt-6 overflow-x-auto">
          <table class="w-full text-xs sm:text-sm tabular-nums">
            <thead class="text-left text-muted">
              <tr class="border-b border-default">
                <th class="py-2 pr-2 sm:pr-3 font-normal">
                  Round
                </th>
                <th class="py-2 pr-2 sm:pr-3 font-normal">
                  Mix <span class="hidden sm:inline">(cash / bonds / shares)</span>
                </th>
                <th class="py-2 pr-2 sm:pr-3 font-normal text-right">
                  Return
                </th>
                <th class="py-2 pr-2 sm:pr-3 font-normal text-right">
                  Balance
                </th>
                <th class="py-2 font-normal text-right">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in results"
                :key="r.round"
                class="border-b border-default last:border-0"
              >
                <td class="py-2 pr-2 sm:pr-3">
                  {{ r.round }}<span class="hidden sm:inline">. {{ r.scenario.title }}</span>
                </td>
                <td class="py-2 pr-2 sm:pr-3 whitespace-nowrap">
                  {{ r.allocation.cash }}/{{ r.allocation.bonds }}/{{ r.allocation.shares }}
                </td>
                <td
                  class="py-2 pr-2 sm:pr-3 text-right"
                  :class="tone(r.returnPct)"
                >
                  {{ signedPct(r.returnPct) }}
                </td>
                <td class="py-2 pr-2 sm:pr-3 text-right">
                  {{ money(r.endBalance) }}
                </td>
                <td class="py-2 text-right">
                  {{ r.score }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #footer>
          <UButton
            label="Play again"
            icon="i-lucide-rotate-ccw"
            @click="restart"
          />
        </template>
      </UCard>

      <!-- Round result -->
      <UCard v-else-if="revealed && latest">
        <template #header>
          <p class="text-sm text-muted">
            Round {{ latest.round }} result
          </p>
          <h2 class="text-xl font-semibold text-highlighted">
            {{ latest.scenario.title }}
          </h2>
        </template>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
          <div>
            <p class="text-xs text-muted">
              Your return
            </p>
            <p
              class="text-lg font-semibold"
              :class="tone(latest.returnPct)"
            >
              {{ signedPct(latest.returnPct) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted">
              Gain / loss
            </p>
            <p
              class="text-lg font-semibold"
              :class="tone(latest.gain)"
            >
              {{ signedMoney(latest.gain) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted">
              New balance
            </p>
            <p class="text-lg font-semibold">
              {{ money(latest.endBalance) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted">
              Round score
            </p>
            <p class="text-lg font-semibold">
              {{ latest.score }} / 100
            </p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <UBadge
            v-for="asset in ASSETS"
            :key="asset"
            :color="asset === latest.bestAsset ? 'success' : 'neutral'"
            variant="subtle"
            class="tabular-nums"
          >
            {{ ASSET_LABELS[asset] }} {{ signedPct(latest.scenario.returns[asset]) }}
          </UBadge>
        </div>

        <div class="mt-5">
          <h3 class="font-semibold text-highlighted flex items-center gap-1.5">
            <UIcon
              name="i-lucide-lightbulb"
              class="size-4 text-primary"
            />
            Why?
          </h3>
          <ul class="mt-2 space-y-2 text-sm text-toned list-disc pl-5">
            <li
              v-for="(line, i) in latest.explanation"
              :key="i"
            >
              {{ line }}
            </li>
          </ul>
        </div>

        <template #footer>
          <UButton
            :label="results.length === SCENARIOS.length ? 'See final results' : 'Next round'"
            trailing-icon="i-lucide-arrow-right"
            @click="nextRound"
          />
        </template>
      </UCard>

      <!-- Allocation form -->
      <UCard v-else>
        <template #header>
          <p class="text-sm text-muted">
            Year {{ roundIndex + 1 }} news
          </p>
          <p class="mt-1 text-highlighted">
            {{ scenario.teaser }}
          </p>
        </template>

        <form
          class="space-y-6"
          @submit.prevent="submit"
        >
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="preset in PRESETS"
              :key="preset.label"
              :label="preset.label"
              size="xs"
              color="neutral"
              variant="outline"
              @click="Object.assign(allocation, preset.allocation)"
            />
          </div>

          <div
            v-for="asset in ASSETS"
            :key="asset"
          >
            <div class="flex items-baseline justify-between gap-4">
              <label
                :for="`alloc-${asset}`"
                class="font-medium text-highlighted"
              >{{ ASSET_LABELS[asset] }}</label>
              <span class="tabular-nums font-semibold">{{ allocation[asset] }}%</span>
            </div>
            <p class="text-xs text-muted mb-3">
              {{ ASSET_HINTS[asset] }}
            </p>
            <USlider
              :id="`alloc-${asset}`"
              v-model="allocation[asset]"
              :min="0"
              :max="100"
              :step="5"
              :aria-label="`${ASSET_LABELS[asset]} percentage`"
            />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p
              class="text-sm tabular-nums"
              :class="total === 100 ? 'text-success' : 'text-warning'"
              aria-live="polite"
            >
              Total: {{ total }}%{{ total === 100 ? '' : ` (needs to be 100%)` }}
            </p>
            <UButton
              type="submit"
              label="Invest for the year"
              trailing-icon="i-lucide-arrow-right"
              :disabled="!!error"
            />
          </div>
        </form>
      </UCard>

      <!-- How it's built -->
      <UCollapsible class="rounded-lg border border-default">
        <UButton
          label="How it's built"
          icon="i-lucide-wrench"
          trailing-icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          block
          class="justify-start p-4 group"
          :ui="{ trailingIcon: 'ms-auto group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        />
        <template #content>
          <div class="px-4 pb-4 space-y-3 text-sm text-toned">
            <p>
              The game started as an Excel model:
              <ULink
                to="/sim/investment-sim.xlsx"
                external
                class="text-primary"
              >investment-sim.xlsx</ULink>
              has a <em>Scenarios</em> sheet (each year's returns for cash, bonds and shares) and a
              <em>Checks</em> sheet that plays four sample strategies with ordinary formulas
              (SUMPRODUCT-style returns, <code>ROUND</code> to the cent, a 0&ndash;100 score).
            </p>
            <ul class="list-disc pl-5 space-y-2">
              <li>
                <strong>Rules are plain TypeScript, separate from the UI.</strong>
                <code>app/sim/rules.ts</code> holds pure functions (validate an allocation, apply a year's returns,
                score a round, write the explanation). No Vue, no randomness: the same inputs always give the same result.
              </li>
              <li>
                <strong>Checked against the spreadsheet.</strong> Vitest tests replay every row of the
                <em>Checks</em> sheet (values exported from Excel) and require the balance, return and score to match exactly.
                They run in CI with lint and type checks.
              </li>
              <li>
                <strong>Money in cents.</strong> Balances are kept as whole cents and returns as basis points,
                then rounded half away from zero like Excel's <code>ROUND()</code>, so there's no floating-point drift.
              </li>
              <li>
                <strong>The page is thin.</strong> <code>pages/sim.vue</code> only holds state (current round, chosen mix)
                and renders with Nuxt UI. The end-screen chart is a small hand-written SVG component.
              </li>
              <li>
                <strong>Mobile-first.</strong> Sliders, stacked cards and a scrollable results table work on a phone.
              </li>
            </ul>
            <p class="text-xs text-muted">
              Returns are made up for teaching, not financial advice.
            </p>
          </div>
        </template>
      </UCollapsible>
    </UPageSection>
  </UPage>
</template>
