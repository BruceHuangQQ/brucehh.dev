import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { applyReturn, playGame, playRound, scoreRound, validateAllocation, type Allocation } from './rules'
import { SCENARIOS, STARTING_BALANCE } from './scenarios'

// Values calculated by Excel from public/sim/investment-sim.xlsx ("Checks" sheet).
const csv = readFileSync(new URL('./fixtures/excel-checks.csv', import.meta.url), 'utf8')
const rows = csv.trim().split(/\r?\n/).slice(1).map((line) => {
  const [strategy, round, cash, bonds, shares, start, returnPct, end, score] = line.split(',')
  return {
    strategy: strategy!,
    round: Number(round),
    allocation: { cash: Number(cash), bonds: Number(bonds), shares: Number(shares) },
    start: Number(start),
    returnPct: Number(returnPct),
    end: Number(end),
    score: Number(score)
  }
})
const strategies = [...new Set(rows.map(row => row.strategy))]

describe('matches the source spreadsheet', () => {
  it('has scenario rows to check', () => {
    expect(strategies.length).toBeGreaterThan(0)
    expect(rows).toHaveLength(strategies.length * SCENARIOS.length)
  })

  for (const strategy of strategies) {
    it(`"${strategy}" strategy, round by round`, () => {
      const expected = rows.filter(row => row.strategy === strategy)
      const game = playGame(STARTING_BALANCE, SCENARIOS, expected.map(row => row.allocation))

      game.rounds.forEach((round, i) => {
        const row = expected[i]!
        expect(round.round).toBe(row.round)
        expect(round.startBalance).toBe(row.start)
        expect(round.returnPct).toBeCloseTo(row.returnPct, 10)
        expect(round.endBalance).toBe(row.end)
        expect(round.score).toBe(row.score)
      })
      expect(game.finalBalance).toBe(expected.at(-1)!.end)
    })
  }
})

describe('validateAllocation', () => {
  it('accepts allocations that add to 100', () => {
    expect(validateAllocation({ cash: 20, bonds: 30, shares: 50 })).toBeNull()
  })

  it.each<[Allocation, string]>([
    [{ cash: 20, bonds: 30, shares: 40 }, 'add up to 100%'],
    [{ cash: -10, bonds: 60, shares: 50 }, 'between 0 and 100'],
    [{ cash: 10.5, bonds: 39.5, shares: 50 }, 'whole number']
  ])('rejects %j', (allocation, message) => {
    expect(validateAllocation(allocation)).toContain(message)
  })

  it('stops a round from being played with a bad allocation', () => {
    expect(() => playRound(1, 1000, { cash: 50, bonds: 0, shares: 0 }, SCENARIOS[0]!)).toThrow()
  })
})

describe('rounding', () => {
  it('rounds half a cent away from zero, like Excel ROUND()', () => {
    const scenario = { ...SCENARIOS[0]!, returns: { cash: 0.5, bonds: 0, shares: 0 } }
    // $1.00 * 1.005 = $1.005, which floating point would usually round down to $1.00
    expect(applyReturn(1, { cash: 100, bonds: 0, shares: 0 }, scenario)).toBe(1.01)
  })
})

describe('scoring and explanation', () => {
  const crash = SCENARIOS.find(s => s.id === 'crash')!

  it('gives 100 for the best asset and 0 for the worst', () => {
    expect(scoreRound({ cash: 0, bonds: 100, shares: 0 }, crash)).toBe(100)
    expect(scoreRound({ cash: 0, bonds: 0, shares: 100 }, crash)).toBe(0)
  })

  it('gives 100 when every asset returns the same', () => {
    const flat = { ...crash, returns: { cash: 2, bonds: 2, shares: 2 } }
    expect(scoreRound({ cash: 0, bonds: 0, shares: 100 }, flat)).toBe(100)
  })

  it('explains the round in plain English', () => {
    const result = playRound(1, 10000, { cash: 0, bonds: 50, shares: 50 }, crash)
    expect(result.contributions).toEqual({ cash: 0, bonds: 300, shares: -1100 })
    expect(result.explanation[0]).toBe(crash.why)
    expect(result.explanation[1]).toContain('Overall you lost $800.00')
    expect(result.explanation[2]).toContain('Bonds was the best performer')
  })
})
