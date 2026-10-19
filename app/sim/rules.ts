// Game rules for the investment simulation.
// Pure functions only: no Vue, no DOM, no randomness, so the same inputs always
// give the same outputs and can be checked against the source spreadsheet.

export const ASSETS = ['cash', 'bonds', 'shares'] as const
export type Asset = typeof ASSETS[number]

export const ASSET_LABELS: Record<Asset, string> = {
  cash: 'Cash',
  bonds: 'Bonds',
  shares: 'Shares'
}

/** Whole-number percentages of the balance put into each asset. */
export type Allocation = Record<Asset, number>

export interface Scenario {
  id: string
  title: string
  teaser: string
  /** Yearly return for each asset, in percent (e.g. -6 or 3.5). */
  returns: Record<Asset, number>
  why: string
}

export interface RoundResult {
  round: number
  scenario: Scenario
  allocation: Allocation
  startBalance: number
  endBalance: number
  gain: number
  /** Portfolio return in percent, e.g. 4.25. */
  returnPct: number
  /** 0-100: how close the allocation got to the best single asset in hindsight. */
  score: number
  bestAsset: Asset
  worstAsset: Asset
  /** Dollar gain/loss from each asset this round (sums to `gain`, give or take a cent). */
  contributions: Record<Asset, number>
  explanation: string[]
}

export interface GameResult {
  rounds: RoundResult[]
  startBalance: number
  finalBalance: number
  totalScore: number
  maxScore: number
}

export function allocationTotal(allocation: Allocation): number {
  return ASSETS.reduce((sum, asset) => sum + allocation[asset], 0)
}

export function validateAllocation(allocation: Allocation): string | null {
  for (const asset of ASSETS) {
    const value = allocation[asset]
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      return `${ASSET_LABELS[asset]} must be a whole number between 0 and 100.`
    }
  }
  const total = allocationTotal(allocation)
  if (total !== 100) {
    return `Allocations must add up to 100% (currently ${total}%).`
  }
  return null
}

// Money is handled in integer cents and returns in basis points so the maths is
// exact and matches Excel's ROUND(), instead of drifting with floating point.
const toCents = (dollars: number) => Math.round(dollars * 100)
const toBasisPoints = (percent: number) => Math.round(percent * 100)

/** Portfolio return in "percent x basis points" (100% x 10,000bp = 1,000,000 = +100%). */
function weightedReturn(allocation: Allocation, scenario: Scenario): number {
  return ASSETS.reduce(
    (sum, asset) => sum + allocation[asset] * toBasisPoints(scenario.returns[asset]),
    0
  )
}

/** Rounds half away from zero, like Excel's ROUND(). */
function roundHalfAwayFromZero(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value))
}

export function portfolioReturnPct(allocation: Allocation, scenario: Scenario): number {
  return weightedReturn(allocation, scenario) / 10000
}

export function applyReturn(balance: number, allocation: Allocation, scenario: Scenario): number {
  const cents = toCents(balance)
  const next = roundHalfAwayFromZero(cents * (1_000_000 + weightedReturn(allocation, scenario)) / 1_000_000)
  return next / 100
}

export function rankAssets(scenario: Scenario): { best: Asset, worst: Asset } {
  const sorted = [...ASSETS].sort((a, b) => scenario.returns[b] - scenario.returns[a])
  return { best: sorted[0]!, worst: sorted[sorted.length - 1]! }
}

export function scoreRound(allocation: Allocation, scenario: Scenario): number {
  const { best, worst } = rankAssets(scenario)
  const bestR = toBasisPoints(scenario.returns[best]) * 100
  const worstR = toBasisPoints(scenario.returns[worst]) * 100
  if (bestR === worstR) return 100
  const yours = weightedReturn(allocation, scenario)
  return roundHalfAwayFromZero((100 * (yours - worstR)) / (bestR - worstR))
}

const money = (value: number) =>
  `$${Math.abs(value).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const signedMoney = (value: number) => `${value < 0 ? '-' : '+'}${money(value)}`
const pct = (value: number) => `${value > 0 ? '+' : ''}${value}%`

export function explainRound(result: Omit<RoundResult, 'explanation'>): string[] {
  const { scenario, allocation, contributions, bestAsset, score, gain } = result
  const lines = [scenario.why]

  const held = ASSETS.filter(asset => allocation[asset] > 0)
  const parts = held.map(asset =>
    `${ASSET_LABELS[asset]} ${pct(scenario.returns[asset])} on ${allocation[asset]}% of your money = ${signedMoney(contributions[asset])}`
  )
  lines.push(`${parts.join('; ')}. Overall you ${gain >= 0 ? 'gained' : 'lost'} ${money(gain)}.`)

  if (score === 100) {
    lines.push(`Perfect call: ${ASSET_LABELS[bestAsset]} was the best place to be this round.`)
  } else {
    lines.push(
      `${ASSET_LABELS[bestAsset]} was the best performer (${pct(scenario.returns[bestAsset])}). `
      + `Your score of ${score}/100 measures how close you got to putting everything there, `
      + `compared with putting everything in the worst asset.`
    )
  }
  return lines
}

export function playRound(round: number, startBalance: number, allocation: Allocation, scenario: Scenario): RoundResult {
  const error = validateAllocation(allocation)
  if (error) throw new Error(error)

  const endBalance = applyReturn(startBalance, allocation, scenario)
  const contributions = Object.fromEntries(ASSETS.map(asset => [
    asset,
    Math.round(startBalance * allocation[asset] * scenario.returns[asset] / 100) / 100
  ])) as Record<Asset, number>
  const { best, worst } = rankAssets(scenario)

  const base = {
    round,
    scenario,
    allocation,
    startBalance,
    endBalance,
    gain: Math.round((endBalance - startBalance) * 100) / 100,
    returnPct: portfolioReturnPct(allocation, scenario),
    score: scoreRound(allocation, scenario),
    bestAsset: best,
    worstAsset: worst,
    contributions
  }
  return { ...base, explanation: explainRound(base) }
}

export function playGame(startBalance: number, scenarios: Scenario[], allocations: Allocation[]): GameResult {
  if (allocations.length > scenarios.length) {
    throw new Error('More allocations than rounds.')
  }
  const rounds: RoundResult[] = []
  let balance = startBalance
  allocations.forEach((allocation, i) => {
    const result = playRound(i + 1, balance, allocation, scenarios[i]!)
    rounds.push(result)
    balance = result.endBalance
  })
  return {
    rounds,
    startBalance,
    finalBalance: balance,
    totalScore: rounds.reduce((sum, r) => sum + r.score, 0),
    maxScore: scenarios.length * 100
  }
}
